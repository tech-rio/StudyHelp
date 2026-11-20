import { useState, useEffect, useCallback, type FC } from 'react';
import {
  Settings as SettingsIcon,
  Server,
  Sparkles,
  Volume2,
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Play,
  RotateCcw
} from 'lucide-react';
import { fetchElevenLabsAudio } from '../services/gemini';
import { resetAnalyticsToBaseline } from '../services/studyAnalytics';

export const SettingsView: FC = () => {
  const [health, setHealth] = useState<{
    status?: string;
    geminiConfigured?: boolean;
    elevenLabsConfigured?: boolean;
    voiceId?: string;
  } | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [testSpeechText, setTestSpeechText] = useState('Welcome to CogniStudy AI. Your personalized study partner is ready.');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioSource, setAudioSource] = useState<'elevenlabs' | 'browser' | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const checkHealth = useCallback(async () => {
    setLoadingHealth(true);
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      } else {
        setHealth({ status: 'server-unreachable', geminiConfigured: false, elevenLabsConfigured: false });
      }
    } catch {
      setHealth({ status: 'offline', geminiConfigured: false, elevenLabsConfigured: false });
    } finally {
      setLoadingHealth(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch('/api/health');
        if (!ignore && res.ok) {
          const data = await res.json();
          setHealth(data);
        }
      } catch {
        if (!ignore) {
          setHealth({ status: 'offline', geminiConfigured: false, elevenLabsConfigured: false });
        }
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  const fallbackSpeech = useCallback(() => {
    setAudioSource('browser');
    if (!('speechSynthesis' in window)) {
      setIsSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(testSpeechText);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  }, [testSpeechText]);

  const handleTestVoice = async () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    try {
      const audio = await fetchElevenLabsAudio(testSpeechText);
      if (audio) {
        setAudioSource('elevenlabs');
        audio.onended = () => {
          setIsSpeaking(false);
        };
        audio.onerror = () => {
          fallbackSpeech();
        };
        await audio.play();
      } else {
        fallbackSpeech();
      }
    } catch {
      fallbackSpeech();
    }
  };

  const handleResetAnalytics = () => {
    resetAnalyticsToBaseline();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-7 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100/90 text-emerald-800 flex items-center justify-center">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-stone-900">System & Engine Settings</h1>
            <p className="text-sm text-stone-500 font-medium mt-0.5">
              Manage your Express backend connection, Gemini AI keys, and ElevenLabs neural voice synthesis.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backend & Environment Status */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <Server className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-stone-900">API Backend Health</h2>
              </div>
              <button
                onClick={checkHealth}
                disabled={loadingHealth}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition"
                title="Refresh Status"
              >
                <RefreshCw className={`w-4 h-4 ${loadingHealth ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <p className="text-xs text-stone-500 mb-5 leading-relaxed">
              Express server running on <code className="bg-stone-100 px-1.5 py-0.5 rounded text-emerald-800 font-mono">http://localhost:3001</code>. API keys are safely configured in your server <code className="bg-stone-100 px-1.5 py-0.5 rounded text-emerald-800 font-mono">.env</code> file.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f0faf4] border border-emerald-100">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-stone-800">Gemini AI Model</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  {health?.geminiConfigured ? (
                    <span className="text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready (.env)
                    </span>
                  ) : (
                    <span className="text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Local Demo Fallback
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f0faf4] border border-emerald-100">
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-stone-800">ElevenLabs Voice</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  {health?.elevenLabsConfigured ? (
                    <span className="text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Neural Voice Ready
                    </span>
                  ) : (
                    <span className="text-teal-700 bg-teal-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Web Speech Ready
                    </span>
                  )}
                </div>
              </div>

              {health?.voiceId && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs text-stone-600 font-mono">
                  Active Voice ID: <span className="font-bold text-stone-800">{health.voiceId}</span> (Rachel / Natural Mentor)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Voice Testing & Audio Studio */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Volume2 className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-stone-900">Voice Synthesis Test</h2>
            </div>
            <p className="text-xs text-stone-500 mb-4 leading-relaxed">
              Test neural speech overview using your ElevenLabs backend or client browser fallback.
            </p>

            <div className="space-y-3">
              <textarea
                value={testSpeechText}
                onChange={(e) => setTestSpeechText(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-2xl border border-stone-200 bg-stone-50 text-xs text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition resize-none"
                placeholder="Enter sample text to synthesize..."
              />

              <div className="flex items-center justify-between">
                <button
                  onClick={handleTestVoice}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-tight shadow-xs transition"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{isSpeaking ? 'Stop Voice' : 'Synthesize Audio'}</span>
                </button>

                {audioSource && (
                  <span className="text-[11px] font-semibold text-stone-400">
                    Engine: <strong className="text-emerald-700 capitalize">{audioSource}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Local Storage & Reset Analytics */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-xs md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Reset Study Analytics & Activity</h3>
              <p className="text-xs text-stone-500 font-medium">
                Restore the default 76% study goal, 12-day streak, and sample sessions from the dashboard mockup.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" /> Reset Successful
              </span>
            )}
            <button
              onClick={handleResetAnalytics}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold transition w-full sm:w-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
