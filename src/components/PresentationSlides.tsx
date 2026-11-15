import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  GraduationCap
} from 'lucide-react';
import { PRESENTATION_SLIDES } from '../data/presentationSlides';

export const PresentationSlides = () => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [showScript, setShowScript] = useState(true);

  const currentSlide = PRESENTATION_SLIDES[currentSlideIdx];

  const handleNext = () => {
    if (currentSlideIdx < PRESENTATION_SLIDES.length - 1) {
      setCurrentSlideIdx(currentSlideIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIdx > 0) {
      setCurrentSlideIdx(currentSlideIdx - 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Slide Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white m-0">
              Project Slide Deck ({currentSlideIdx + 1} of {PRESENTATION_SLIDES.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Target Duration: 5–7 Minutes • Timing: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{currentSlide.timing}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Script */}
          <button
            onClick={() => setShowScript(!showScript)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${showScript
              ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{showScript ? 'Hide Speaker Notes' : 'Show Speaker Notes'}</span>
          </button>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={currentSlideIdx === 0}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold px-2 text-slate-600 dark:text-slate-300">
              {currentSlideIdx + 1}/{PRESENTATION_SLIDES.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentSlideIdx === PRESENTATION_SLIDES.length - 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide Visual Canvas */}
      <div className="bg-linear-to-br from-slate-900 via-indigo-950 to-slate-950 border-2 border-indigo-500/30 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden min-h-115 flex flex-col justify-between">
        {/* Background ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Slide Header */}
        <div className="relative z-10 border-b border-indigo-800/50 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 uppercase tracking-wider">
              {currentSlide.badge}
            </span>
            <span className="text-xs text-indigo-300/80 font-mono">
              Slide {currentSlide.number} / {PRESENTATION_SLIDES.length}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white m-0">
            {currentSlide.title}
          </h1>
          <p className="text-sm text-indigo-200/90 mt-1">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Slide Body Points */}
        <div className="relative z-10 py-6 grid gap-4">
          {currentSlide.points.map((pt, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                {pt.title}
              </h3>
              <p className="text-xs sm:text-sm text-indigo-100/80 leading-relaxed pl-6">
                {pt.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Highlight Banner */}
        {currentSlide.highlightBox && (
          <div className="relative z-10 p-3.5 rounded-xl bg-indigo-500/20 border border-indigo-400/40 text-xs sm:text-sm text-indigo-200 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="font-medium">{currentSlide.highlightBox}</span>
          </div>
        )}
      </div>

      {/* Speaker Notes & Script Panel */}
      {showScript && (
        <div className="bg-amber-500/10 dark:bg-amber-500/5 border border-amber-300 dark:border-amber-800/60 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Speaker Script (Say This for Slide {currentSlide.number})
            </span>
            <span>Target: {currentSlide.timing}</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-100 leading-relaxed font-normal italic">
            "{currentSlide.speakerScript}"
          </p>
        </div>
      )}

      {/* Bottom slide thumbnail picker */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {PRESENTATION_SLIDES.map((slide, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlideIdx(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${currentSlideIdx === idx
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
          >
            {slide.number}. {slide.title}
          </button>
        ))}
      </div>
    </div>
  );
};
