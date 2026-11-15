import { useState, useEffect, type FC } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Baby,
  GraduationCap,
  Copy,
  Check,
  Tag,
  Code
} from 'lucide-react';
import type { StudyPackage } from '../types/study';

interface SummaryViewProps {
  deck: StudyPackage;
}

export const SummaryView: FC<SummaryViewProps> = ({ deck }) => {
  const [isEli5Global, setIsEli5Global] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleAudioOverview = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported by your browser.");
      return;
    }

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

    window.speechSynthesis.cancel();
    const narrationText = `Study overview for: ${deck.title}. ${isEli5Global ? deck.overviewEli5 : deck.overview}. Core points include: ${deck.keyPoints.map(kp => `${kp.topic}: ${isEli5Global ? kp.eli5 : kp.summary}`).join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

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
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setIsAudioPaused(false);
    }
  };

  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white m-0">
              {deck.title}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {deck.tags.map((t, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* ELI5 Toggle Button */}
          <button
            onClick={() => setIsEli5Global(!isEli5Global)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition shadow-sm ${
              isEli5Global
                ? 'bg-amber-500 text-white border-amber-600 shadow-amber-500/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {isEli5Global ? <Baby className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
            <span>{isEli5Global ? "ELI5 Mode Active" : "Explain Like I'm 5"}</span>
          </button>

          {/* Audio Overview Button (NotebookLM style) */}
          <div className="flex items-center rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 p-0.5">
            <button
              onClick={handleAudioOverview}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition"
            >
              {isPlayingAudio && !isAudioPaused ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Audio</span>
                </>
              ) : isAudioPaused ? (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Audio Overview</span>
                </>
              )}
            </button>
            {isPlayingAudio && (
              <button
                onClick={handleStopAudio}
                title="Stop Audio"
                className="p-1.5 text-slate-400 hover:text-rose-500"
              >
                <VolumeX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Audio Wave Bar when playing */}
      {isPlayingAudio && !isAudioPaused && (
        <div className="p-3 bg-indigo-600 rounded-xl text-white text-xs flex items-center justify-between shadow-lg shadow-indigo-500/20 animate-pulse">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 animate-bounce" />
            <span className="font-semibold">Playing AI Audio Overview (NotebookLM Audio Synthesis)...</span>
          </div>
          <span className="text-[11px] opacity-80">Listening Mode</span>
        </div>
      )}

      {/* Overview Card */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isEli5Global
          ? 'bg-amber-500/10 dark:bg-amber-500/5 border-amber-300 dark:border-amber-800/60'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          {isEli5Global ? (
            <div className="p-1.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg">
              <Baby className="w-4 h-4" />
            </div>
          ) : (
            <div className="p-1.5 bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
          )}
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            {isEli5Global ? "Intuitive ELI5 Overview" : "Executive High-Yield Summary"}
          </h3>
        </div>
        <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
          {isEli5Global ? deck.overviewEli5 : deck.overview}
        </p>
      </div>

      {/* Key Concepts Breakdown */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
          High-Yield Key Concepts ({deck.keyPoints.length})
        </h3>

        <div className="grid gap-4">
          {deck.keyPoints.map((kp, idx) => (
            <div
              key={kp.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {kp.topic}
                  </h4>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    kp.importance === 'critical'
                      ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      : kp.importance === 'high'
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      : 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  }`}
                >
                  {kp.importance}
                </span>
              </div>

              {/* Main Summary */}
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                {kp.summary}
              </p>

              {/* ELI5 Sub-block */}
              <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-xl p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2 mb-3">
                <Baby className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold mr-1">ELI5 Analogy:</span>
                  <span>{kp.eli5}</span>
                </div>
              </div>

              {/* Formula or Code Snippet */}
              {kp.formulasOrSyntax && kp.formulasOrSyntax.length > 0 && (
                <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs relative group">
                  <div className="flex items-center justify-between mb-1 text-[11px] text-slate-400 font-sans">
                    <span className="flex items-center gap-1">
                      <Code className="w-3.5 h-3.5" /> Key Formula / Syntax
                    </span>
                    <button
                      onClick={() => handleCopyCode(kp.id, kp.formulasOrSyntax!.join('\n'))}
                      className="text-slate-400 hover:text-white transition flex items-center gap-1"
                    >
                      {copiedId === kp.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap font-mono">
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
