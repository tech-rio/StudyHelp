import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckCircle2,
  BookOpen
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Slide Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-stone-200/90 p-5 rounded-3xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 m-0">
              Project Slide Deck ({currentSlideIdx + 1} of {PRESENTATION_SLIDES.length})
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Presentation Target: 5–7 Minutes • Timing: <span className="font-bold text-emerald-700">{currentSlide.timing}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Script */}
          <button
            onClick={() => setShowScript(!showScript)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition shadow-xs ${
              showScript
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-stone-500" />
            <span>{showScript ? 'Hide Speaker Notes' : 'Show Speaker Notes'}</span>
          </button>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={currentSlideIdx === 0}
              className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 text-stone-700 transition shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold px-2 text-stone-700">
              {currentSlideIdx + 1}/{PRESENTATION_SLIDES.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentSlideIdx === PRESENTATION_SLIDES.length - 1}
              className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 text-stone-700 transition shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide Visual Canvas */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-8 sm:p-11 shadow-xs min-h-110 flex flex-col justify-between">
        {/* Slide Header */}
        <div className="border-b border-stone-100 pb-5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
              {currentSlide.badge}
            </span>
            <span className="text-xs text-stone-400 font-mono">
              Slide {currentSlide.number} / {PRESENTATION_SLIDES.length}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 m-0">
            {currentSlide.title}
          </h1>
          <p className="text-sm text-stone-600 mt-1.5 font-normal">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Slide Body Points */}
        <div className="py-6 space-y-4">
          {currentSlide.points.map((pt, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#f0faf4] border border-emerald-100 hover:border-emerald-200 transition"
            >
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {pt.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pl-6">
                {pt.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Highlight Callout */}
        {currentSlide.highlightBox && (
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs sm:text-sm text-emerald-950 flex items-center gap-2">
            <span className="font-bold text-emerald-900">Key Takeaway:</span>
            <span>{currentSlide.highlightBox}</span>
          </div>
        )}
      </div>

      {/* Speaker Notes & Script Panel */}
      {showScript && (
        <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-600 uppercase tracking-wider">
            <span>Speaker Script (What to say)</span>
            <span className="font-mono text-emerald-700">Target: {currentSlide.timing}</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-normal">
            "{currentSlide.speakerScript}"
          </p>
        </div>
      )}

      {/* Bottom slide thumbnail picker */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {PRESENTATION_SLIDES.map((slide, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlideIdx(idx)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border shadow-xs ${
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
