import { useState, useEffect, useCallback, type FC } from 'react';
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import type { Flashcard } from '../types/study';

interface FlashcardDeckProps {
  cards: Flashcard[];
}

export const FlashcardDeck: FC<FlashcardDeckProps> = ({ cards: initialCards }) => {
  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (cards.length > 0 ? (prev + 1) % cards.length : 0));
  }, [cards.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (cards.length > 0 ? (prev - 1 + cards.length) % cards.length : 0));
  }, [cards.length]);

  // Spacebar and arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-16 text-stone-500 text-base">
        No flashcards generated yet. Add notes to create a deck.
      </div>
    );
  }

  const currentCard = cards[currentIndex] || cards[0];

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleReset = () => {
    setCards(initialCards.map(c => ({ ...c, mastery: 'learning' })));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleRateMastery = (rating: 'learning' | 'reviewing' | 'mastered') => {
    const updated = [...cards];
    updated[currentIndex] = { ...updated[currentIndex], mastery: rating };
    setCards(updated);
    setTimeout(() => {
      handleNext();
    }, 200);
  };

  const masteredCount = cards.filter(c => c.mastery === 'mastered').length;
  const reviewingCount = cards.filter(c => c.mastery === 'reviewing').length;
  const learningCount = cards.filter(c => c.mastery === 'learning' || !c.mastery).length;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Top Header & Progress */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight flex items-center gap-3">
            Active Recall Flashcards
            <span className="text-sm px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
              {currentIndex + 1} of {cards.length}
            </span>
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Press <kbd className="px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-mono text-xs font-semibold">Space</kbd> or click card to flip
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShuffle}
            title="Shuffle cards"
            className="p-3 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition shadow-xs"
          >
            <Shuffle className="w-5 h-5" />
          </button>
          <button
            onClick={handleReset}
            title="Reset progress"
            className="p-3 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition shadow-xs"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress tracker bar */}
      <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden flex shadow-inner">
        <div
          style={{ width: `${(masteredCount / cards.length) * 100}%` }}
          className="bg-emerald-500 transition-all duration-300"
          title={`Mastered: ${masteredCount}`}
        />
        <div
          style={{ width: `${(reviewingCount / cards.length) * 100}%` }}
          className="bg-amber-400 transition-all duration-300"
          title={`Reviewing: ${reviewingCount}`}
        />
        <div
          style={{ width: `${(learningCount / cards.length) * 100}%` }}
          className="bg-stone-300 transition-all duration-300"
          title={`Learning: ${learningCount}`}
        />
      </div>

      {/* 3D Flashcard Flip Canvas */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-96 sm:h-105 cursor-pointer perspective-1000 select-none"
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 ease-out transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT */}
          <div className="absolute inset-0 backface-hidden bg-white border-2 border-stone-200/90 hover:border-emerald-400 rounded-3xl p-8 sm:p-12 flex flex-col justify-between shadow-xs transition-colors">
            <div className="flex items-center justify-between text-sm text-stone-500">
              <span className="font-bold tracking-wider uppercase text-xs text-emerald-700">Question</span>
              <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-semibold border border-emerald-200">
                {currentCard.category}
              </span>
            </div>

            <div className="my-auto text-center px-4">
              <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-snug tracking-tight">
                {currentCard.front}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-stone-400 font-medium">
              <RotateCw className="w-4.5 h-4.5" />
              <span>Click or press Space to reveal answer</span>
            </div>
          </div>

          {/* BACK */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-stone-900 border-2 border-emerald-500/40 rounded-3xl p-8 sm:p-12 text-white flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between text-sm text-stone-300">
              <span className="font-bold tracking-wider uppercase text-xs text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Verified Answer
              </span>
              <span className="px-3.5 py-1 rounded-full bg-stone-800 text-stone-200 text-xs sm:text-sm font-semibold">
                {currentCard.category}
              </span>
            </div>

            <div className="my-auto overflow-y-auto max-h-56 px-2 text-left">
              <p className="text-lg sm:text-xl text-stone-100 leading-relaxed font-normal whitespace-pre-line">
                {currentCard.back}
              </p>
            </div>

            <div className="text-center text-sm text-stone-400 font-medium">
              Rate your recall below
            </div>
          </div>
        </div>
      </div>

      {/* Spaced Repetition Buttons */}
      <div className="space-y-3">
        <div className="text-center text-xs sm:text-sm font-bold text-stone-400 uppercase tracking-wider">
          How well did you recall this?
        </div>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRateMastery('learning');
            }}
            className="py-3.5 px-4 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs sm:text-sm font-bold transition active:scale-98 shadow-xs"
          >
            Hard (Review Soon)
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRateMastery('reviewing');
            }}
            className="py-3.5 px-4 rounded-2xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs sm:text-sm font-bold transition active:scale-98 shadow-xs"
          >
            Good (Understood)
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRateMastery('mastered');
            }}
            className="py-3.5 px-4 rounded-2xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-bold transition active:scale-98 shadow-xs"
          >
            Easy (Mastered)
          </button>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm sm:text-base font-bold border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition shadow-xs"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous</span>
        </button>

        <span className="text-xs sm:text-sm text-stone-400 font-mono">
          ← / → keys
        </span>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm sm:text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm shadow-emerald-600/20"
        >
          <span>Next Card</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
