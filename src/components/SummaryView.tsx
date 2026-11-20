import { useState, useEffect, useRef, type FC } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Copy,
  Check,
  Tag,
  Code2,
  Sparkles,
  Loader2
} from 'lucide-react';
import type { StudyPackage } from '../types/study';
import { recordSummaryActivity } from '../services/studyAnalytics';
import { fetchElevenLabsAudio } from '../services/gemini';

interface SummaryViewProps {
  deck: StudyPackage;
}

export const SummaryView: FC<SummaryViewProps> = ({ deck }) => {
  const [isPlainEnglish, setIsPlainEnglish] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioSource, setAudioSource] = useState<'elevenlabs' | 'webspeech' | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeAudioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    recordSummaryActivity(deck.title);
    return () => {
      if (activeAudioElementRef.current) {
        activeAudioElementRef.current.pause();
        activeAudioElementRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [deck.title]);

  const handleAudioOverview = async () => {
    // If currently playing ElevenLabs audio, toggle pause/play
    if (activeAudioElementRef.current && audioSource === 'elevenlabs') {
      if (isPlayingAudio && !isAudioPaused) {
        activeAudioElementRef.current.pause();
        setIsAudioPaused(true);
        return;
      }
      if (isAudioPaused) {
        activeAudioElementRef.current.play();
        setIsAudioPaused(false);
        return;
      }
    }

    // If currently playing Web Speech API, toggle pause/resume
    if (audioSource === 'webspeech' && 'speechSynthesis' in window) {
      if (isPlayingAudio && !isAudioPaused) {
        window.speechSynthesis.pause();
        setIsAudioPaused(true);
        return;
      }
      if (isAudioPaused) {
        window.speechSynthesis.resume();
        setIsAudioPaused(false);
        return;
      }
    }

    // Stop any existing playback before starting fresh
    handleStopAudio();

    const narrationText = `Summary for ${deck.title}. ${isPlainEnglish ? deck.overviewEli5 : deck.overview}. Key points: ${deck.keyPoints.map(kp => `${kp.topic}: ${isPlainEnglish ? kp.eli5 : kp.summary}`).join('. ')}`;

    setIsLoadingAudio(true);

    try {
      // 1. Try ElevenLabs voice synthesis via backend
      const elevenAudio = await fetchElevenLabsAudio(narrationText);

      if (elevenAudio) {
        activeAudioElementRef.current = elevenAudio;
        setAudioSource('elevenlabs');
        setIsLoadingAudio(false);
        setIsPlayingAudio(true);
        setIsAudioPaused(false);

        elevenAudio.onended = () => {
          setIsPlayingAudio(false);
          setIsAudioPaused(false);
          activeAudioElementRef.current = null;
        };

        elevenAudio.onerror = () => {
          console.warn("ElevenLabs audio playback failed, falling back to Web Speech");
          fallbackToWebSpeech(narrationText);
        };

        await elevenAudio.play();
        return;
      }
    } catch (err) {
      console.warn("ElevenLabs error, using fallback voice", err);
    }

    // 2. Seamless local Web Speech API fallback
    fallbackToWebSpeech(narrationText);
  };

  const fallbackToWebSpeech = (text: string) => {
    setIsLoadingAudio(false);
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported by your browser.");
      return;
    }

    setAudioSource('webspeech');
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;

    utterance.onstart = () => {
      setIsPlayingAudio(true);
      setIsAudioPaused(false);
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStopAudio = () => {
    if (activeAudioElementRef.current) {
      activeAudioElementRef.current.pause();
      activeAudioElementRef.current.currentTime = 0;
      activeAudioElementRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setIsAudioPaused(false);
    setIsLoadingAudio(false);
  };

  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Header Card */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-7 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight m-0">
            {deck.title}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {deck.tags.map((t, idx) => (
              <span
                key={idx}
                className="text-xs sm:text-sm font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5"
              >
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Plain English Toggle */}
          <button
            onClick={() => setIsPlainEnglish(!isPlainEnglish)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold border transition-all shadow-xs ${isPlainEnglish
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
          >
            {isPlainEnglish ? "Plain English: ON" : "Plain English Mode"}
          </button>

          {/* Audio Player Button (ElevenLabs Voice Powered) */}
          <div className="flex items-center rounded-full border border-emerald-200 bg-emerald-50/70 p-1 shadow-xs">
            <button
              onClick={handleAudioOverview}
              disabled={isLoadingAudio}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-800 hover:bg-emerald-100/80 rounded-full transition disabled:opacity-60"
            >
              {isLoadingAudio ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                  <span>Synthesizing Voice...</span>
                </>
              ) : isPlayingAudio && !isAudioPaused ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Voice</span>
                </>
              ) : isAudioPaused ? (
                <>
                  <Play className="w-4 h-4" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-700" />
                  <span>Voice Overview</span>
                  {audioSource === 'elevenlabs' && (
                    <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-1.5 py-0.5 rounded font-mono font-bold">
                      ElevenLabs
                    </span>
                  )}
                </>
              )}
            </button>
            {isPlayingAudio && (
              <button
                onClick={handleStopAudio}
                title="Stop Audio"
                className="p-2 text-stone-400 hover:text-stone-700"
              >
                <VolumeX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Overview Box */}
      <div className={`p-7 sm:p-9 rounded-3xl border transition-colors shadow-xs ${isPlainEnglish
          ? 'bg-amber-50/80 border-amber-200'
          : 'bg-white border-stone-200/90'
        }`}>
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800 mb-3">
          <Sparkles className="w-4.5 h-4.5 text-emerald-600" />
          <span>{isPlainEnglish ? "Plain English Explanation" : "Core Academic Overview"}</span>
        </div>
        <p className="text-base sm:text-lg leading-relaxed text-stone-800 font-normal">
          {isPlainEnglish ? deck.overviewEli5 : deck.overview}
        </p>
      </div>

      {/* Key Points Section */}
      <div className="space-y-5">
        <div className="text-sm sm:text-base font-bold uppercase tracking-wider text-stone-500 px-1">
          High-Yield Key Concepts ({deck.keyPoints.length})
        </div>

        <div className="space-y-5">
          {deck.keyPoints.map((kp, idx) => (
            <div
              key={kp.id}
              className="bg-white border border-stone-200/90 rounded-3xl p-7 sm:p-8 shadow-xs hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                    {kp.topic}
                  </h3>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full border border-stone-200 bg-stone-100 text-stone-600 uppercase tracking-wide">
                  {kp.importance}
                </span>
              </div>

              {/* Technical summary */}
              <p className="text-base sm:text-[17px] text-stone-700 leading-relaxed mb-4">
                {kp.summary}
              </p>

              {/* Plain English explanation */}
              <div className="bg-[#f0faf4] border border-emerald-100 rounded-2xl p-4.5 text-sm sm:text-base text-stone-700 leading-relaxed mb-4">
                <span className="font-bold text-emerald-900">In plain English: </span>
                <span>{kp.eli5}</span>
              </div>

              {/* Formula or Code block */}
              {kp.formulasOrSyntax && kp.formulasOrSyntax.length > 0 && (
                <div className="bg-stone-900 text-emerald-400 p-4.5 rounded-2xl font-mono text-sm relative group shadow-xs">
                  <div className="flex items-center justify-between mb-2 text-xs sm:text-sm text-stone-400 font-sans">
                    <span className="flex items-center gap-2 text-stone-300">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      Key Mathematical Formulation
                    </span>
                    <button
                      onClick={() => handleCopyCode(kp.id, kp.formulasOrSyntax!.join('\n'))}
                      className="text-stone-400 hover:text-white transition flex items-center gap-1.5"
                    >
                      {copiedId === kp.id ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400 text-xs sm:text-sm">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-xs sm:text-sm">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-emerald-300 text-sm leading-relaxed">
                    {kp.formulasOrSyntax.join('\n')}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
