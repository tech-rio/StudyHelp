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
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Slide Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#faf7f0] border border-[#ded8cb] p-4 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#eae4d7] text-[#474039] rounded-lg">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#26221f] m-0">
              Project Slide Deck ({currentSlideIdx + 1} of {PRESENTATION_SLIDES.length})
            </h2>
            <p className="text-xs text-[#7d7368]">
              Presentation Target: 5–7 Minutes • Timing: <span className="font-semibold text-[#26221f]">{currentSlide.timing}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Script */}
          <button
            onClick={() => setShowScript(!showScript)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              showScript
                ? 'bg-[#eae4d7] text-[#26221f] border-[#ded8cb] font-semibold'
                : 'bg-[#faf7f0] text-[#5c534a] border-[#ded8cb] hover:bg-[#eae4d7]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#5c534a]" />
            <span>{showScript ? 'Hide Speaker Notes' : 'Show Speaker Notes'}</span>
          </button>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={currentSlideIdx === 0}
              className="p-1.5 rounded-lg border border-[#ded8cb] bg-[#faf7f0] hover:bg-[#eae4d7] disabled:opacity-40 text-[#474039] transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2 text-[#474039]">
              {currentSlideIdx + 1}/{PRESENTATION_SLIDES.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentSlideIdx === PRESENTATION_SLIDES.length - 1}
              className="p-1.5 rounded-lg border border-[#ded8cb] bg-[#faf7f0] hover:bg-[#eae4d7] disabled:opacity-40 text-[#474039] transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide Visual Canvas (Warm parchment background, no stark white) */}
      <div className="bg-[#faf7f0] border border-[#ded8cb] rounded-2xl p-7 sm:p-10 shadow-sm min-h-110 flex flex-col justify-between">
        {/* Slide Header */}
        <div className="border-b border-[#ded8cb] pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-[#eae4d7] text-[#5c534a] border border-[#ded8cb] uppercase tracking-wide">
              {currentSlide.badge}
            </span>
            <span className="text-xs text-[#8a8074] font-mono">
              Slide {currentSlide.number} / {PRESENTATION_SLIDES.length}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#26221f] m-0">
            {currentSlide.title}
          </h1>
          <p className="text-sm text-[#5c534a] mt-1 font-normal">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Slide Body Points */}
        <div className="py-6 space-y-3.5">
          {currentSlide.points.map((pt, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#f4f0e6] border border-[#ded8cb] hover:border-[#cfc6b6] transition"
            >
              <h3 className="text-sm font-semibold text-[#26221f] flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-[#474039] shrink-0" />
                {pt.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#5c534a] leading-relaxed pl-6">
                {pt.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Highlight Callout */}
        {currentSlide.highlightBox && (
          <div className="p-3.5 rounded-xl bg-[#f0e6d6] border border-[#dec9b0] text-xs sm:text-sm text-[#4a2e12] flex items-center gap-2">
            <span className="font-semibold text-[#3b230d]">Key Takeaway:</span>
            <span>{currentSlide.highlightBox}</span>
          </div>
        )}
      </div>

      {/* Speaker Notes & Script Panel */}
      {showScript && (
        <div className="bg-[#f0ebe0] border border-[#ded8cb] rounded-xl p-4 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-[#5c534a] uppercase tracking-wider">
            <span>Speaker Script (What to say)</span>
            <span className="font-mono text-[#7d7368]">Target: {currentSlide.timing}</span>
          </div>
          <p className="text-xs sm:text-sm text-[#3d3732] leading-relaxed font-normal">
            "{currentSlide.speakerScript}"
          </p>
        </div>
      )}

      {/* Bottom slide thumbnail picker */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {PRESENTATION_SLIDES.map((slide, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlideIdx(idx)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
              currentSlideIdx === idx
                ? 'bg-[#26221f] text-[#faf7f0] border-[#26221f]'
                : 'bg-[#faf7f0] text-[#5c534a] border-[#ded8cb] hover:bg-[#eae4d7]'
            }`}
          >
            {slide.number}. {slide.title}
          </button>
        ))}
      </div>
    </div>
  );
};
