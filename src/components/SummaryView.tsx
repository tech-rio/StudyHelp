import { useState, useEffect, type FC } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Copy,
  Check,
  Tag,
  Code2
} from 'lucide-react';
import type { StudyPackage } from '../types/study';

interface SummaryViewProps {
  deck: StudyPackage;
}

export const SummaryView: FC<SummaryViewProps> = ({ deck }) => {
  const [isPlainEnglish, setIsPlainEnglish] = useState(false);
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
    const narrationText = `Summary for ${deck.title}. ${isPlainEnglish ? deck.overviewEli5 : deck.overview}. Key points: ${deck.keyPoints.map(kp => `${kp.topic}: ${isPlainEnglish ? kp.eli5 : kp.summary}`).join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(narrationText);
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight m-0">
            {deck.title}
          </h2>
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {deck.tags.map((t, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200 flex items-center gap-1"
              >
                <Tag className="w-3 h-3 text-stone-400" />
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Plain English Toggle */}
          <button
            onClick={() => setIsPlainEnglish(!isPlainEnglish)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isPlainEnglish
                ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            {isPlainEnglish ? "Plain English: ON" : "Plain English Mode"}
          </button>

          {/* Audio Player Button */}
          <div className="flex items-center rounded-lg border border-stone-200 bg-stone-50 p-0.5">
            <button
              onClick={handleAudioOverview}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-stone-800 hover:bg-stone-200/70 rounded-md transition"
            >
              {isPlayingAudio && !isAudioPaused ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              ) : isAudioPaused ? (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-stone-600" />
                  <span>Listen</span>
                </>
              )}
            </button>
            {isPlayingAudio && (
              <button
                onClick={handleStopAudio}
                title="Stop Audio"
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <VolumeX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Overview Box */}
      <div className={`p-5 rounded-xl border transition-colors ${
        isPlainEnglish
          ? 'bg-amber-50/60 border-amber-200'
          : 'bg-white border-stone-200 shadow-xs'
      }`}>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
          {isPlainEnglish ? "Plain English Explanation" : "Core Overview"}
        </div>
        <p className="text-sm leading-relaxed text-stone-800 font-normal">
          {isPlainEnglish ? deck.overviewEli5 : deck.overview}
        </p>
      </div>

      {/* Key Points Section */}
      <div className="space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-stone-400 px-0.5">
          Key Concepts ({deck.keyPoints.length})
        </div>

        <div className="space-y-3.5">
          {deck.keyPoints.map((kp, idx) => (
            <div
              key={kp.id}
              className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs hover:border-stone-300 transition-colors"
            >
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-mono text-stone-400">
                    0{idx + 1}.
                  </span>
                  <h3 className="text-base font-semibold text-stone-900 tracking-tight">
                    {kp.topic}
                  </h3>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded border border-stone-200 bg-stone-100 text-stone-600 uppercase tracking-wide">
                  {kp.importance}
                </span>
              </div>

              {/* Technical summary */}
              <p className="text-sm text-stone-700 leading-relaxed mb-3">
                {kp.summary}
              </p>

              {/* Plain English explanation */}
              <div className="bg-stone-50 border border-stone-200/80 rounded-lg p-3 text-xs text-stone-700 leading-relaxed mb-3">
                <span className="font-semibold text-stone-900">In plain English: </span>
                <span>{kp.eli5}</span>
              </div>

              {/* Formula or Code block */}
              {kp.formulasOrSyntax && kp.formulasOrSyntax.length > 0 && (
                <div className="bg-stone-900 text-stone-200 p-3 rounded-lg font-mono text-xs relative group">
                  <div className="flex items-center justify-between mb-1 text-[11px] text-stone-400 font-sans">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-stone-400" />
                      Key Formulation
                    </span>
                    <button
                      onClick={() => handleCopyCode(kp.id, kp.formulasOrSyntax!.join('\n'))}
                      className="text-stone-400 hover:text-white transition flex items-center gap-1"
                    >
                      {copiedId === kp.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 text-[11px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-stone-100">
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
