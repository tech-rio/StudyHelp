import { useState, useEffect, useCallback, type FC } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MonitorPlay,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { PRESENTATION_SLIDES } from '../data/presentationSlides';

export const PresentationSlides: FC = () => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [showScript, setShowScript] = useState(true);

  const currentSlide = PRESENTATION_SLIDES[currentSlideIdx];

  const handleNext = useCallback(() => {
    if (currentSlideIdx < PRESENTATION_SLIDES.length - 1) {
      setCurrentSlideIdx(prev => prev + 1);
    }
  }, [currentSlideIdx]);

  const handlePrev = useCallback(() => {
    if (currentSlideIdx > 0) {
      setCurrentSlideIdx(prev => prev - 1);
    }
  }, [currentSlideIdx]);

  // Arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <div className="max-w-5xl mx-auto space-y-7">
      {/* Presentation Control Bar */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center">
            <MonitorPlay className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-stone-900 m-0">Course Presentation Deck</h2>
            <p className="text-xs sm:text-sm text-stone-500">Topic #11 · 5–7 Minute Defense Walkthrough</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowScript(!showScript)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition ${
              showScript
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>{showScript ? 'Hide Speaker Notes' : 'Show Speaker Notes'}</span>
          </button>

          <div className="flex items-center gap-1.5 border border-stone-200 p-1 rounded-2xl bg-stone-50">
            <button
              onClick={handlePrev}
              disabled={currentSlideIdx === 0}
              className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 text-stone-700 transition shadow-xs"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
            <span className="text-xs sm:text-sm font-mono font-bold px-3 text-stone-700">
              {currentSlideIdx + 1}/{PRESENTATION_SLIDES.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentSlideIdx === PRESENTATION_SLIDES.length - 1}
              className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 text-stone-700 transition shadow-xs"
            >
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide Visual Canvas */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-8 sm:p-12 shadow-xs min-h-125 flex flex-col justify-between">
        {/* Slide Header */}
        <div className="border-b border-stone-100 pb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
              {currentSlide.badge}
            </span>
            <span className="text-xs sm:text-sm text-stone-400 font-mono">
              Slide {currentSlide.number} / {PRESENTATION_SLIDES.length}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 m-0">
            {currentSlide.title}
          </h1>
          <p className="text-base sm:text-lg text-stone-600 mt-2 font-normal">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Slide Body Points */}
        <div className="py-7 space-y-4.5">
          {currentSlide.points.map((pt, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#f0faf4] border border-emerald-100 hover:border-emerald-200 transition"
            >
              <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2.5 mb-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                {pt.title}
              </h3>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed pl-7">
                {pt.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Highlight Callout */}
        {currentSlide.highlightBox && (
          <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-sm sm:text-base text-emerald-950 flex items-center gap-2.5">
            <span className="font-bold text-emerald-900">Key Takeaway:</span>
            <span>{currentSlide.highlightBox}</span>
          </div>
        )}
      </div>

      {/* Speaker Notes & Script Panel */}
      {showScript && (
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-stone-600 uppercase tracking-wider">
            <span>Speaker Script (What to say)</span>
            <span className="font-mono text-emerald-700">Target: {currentSlide.timing}</span>
          </div>
          <p className="text-sm sm:text-base text-stone-800 leading-relaxed font-normal">
            "{currentSlide.speakerScript}"
          </p>
        </div>
      )}

      {/* Bottom slide thumbnail picker */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
        {PRESENTATION_SLIDES.map((slide, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlideIdx(idx)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition border shadow-xs ${
              currentSlideIdx === idx
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            {slide.number}. {slide.title}
          </button>
        ))}
      </div>
    </div>
  );
};
