import { useState, useEffect, useCallback, type FC } from 'react';
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  Sparkles,
  CheckCircle,
  HelpCircle
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
      <div className="text-center py-12 text-slate-500">
        No flashcards generated yet. Please upload study material first.
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
    // Auto advance
    setTimeout(() => {
      handleNext();
    }, 200);
  };

  const masteredCount = cards.filter(c => c.mastery === 'mastered').length;
  const reviewingCount = cards.filter(c => c.mastery === 'reviewing').length;
  const learningCount = cards.filter(c => c.mastery === 'learning' || !c.mastery).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header and stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Active Recall Flashcards
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
              {currentIndex + 1} / {cards.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click card or press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-mono">Space</kbd> to flip
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            title="Shuffle Deck"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            title="Reset Ratings"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
        <div
          style={{ width: `${(masteredCount / cards.length) * 100}%` }}
          className="bg-emerald-500 transition-all duration-300"
          title={`Mastered: ${masteredCount}`}
        />
        <div
          style={{ width: `${(reviewingCount / cards.length) * 100}%` }}
          className="bg-amber-500 transition-all duration-300"
          title={`Reviewing: ${reviewingCount}`}
        />
        <div
          style={{ width: `${(learningCount / cards.length) * 100}%` }}
          className="bg-indigo-500 transition-all duration-300"
          title={`Learning: ${learningCount}`}
        />
      </div>

      {/* 3D Flashcard Flip Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-80 cursor-pointer perspective-1000 select-none"
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT */}
          <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-xl hover:border-indigo-400 transition-colors">
            <div className="flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                Prompt / Question
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-[11px]">
                {currentCard.category}
              </span>
            </div>

            <div className="my-auto text-center">
              <p className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 leading-snug">
                {currentCard.front}
              </p>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Click to reveal answer</span>
            </div>
          </div>

          {/* BACK */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-linear-to-br from-indigo-950 via-slate-900 to-slate-950 border-2 border-indigo-500/50 rounded-3xl p-8 text-white flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Verified Answer
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-900/60 border border-indigo-700/60 text-[11px] text-indigo-200">
                {currentCard.category}
              </span>
            </div>

            <div className="my-auto overflow-y-auto max-h-48 pr-2">
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal whitespace-pre-line text-left">
                {currentCard.back}
              </p>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-indigo-300/80 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Rate your recall below</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spaced Repetition Rating Buttons */}
      <div className="space-y-3">
        <div className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
          How well did you recall this?
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRateMastery('learning');
            }}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 transition active:scale-95 shadow-sm"
          >
            <span>🔴 Hard</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRateMastery('reviewing');
            }}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition active:scale-95 shadow-sm"
          >
            <span>🟡 Good</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRateMastery('mastered');
            }}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition active:scale-95 shadow-sm"
          >
            <span>🟢 Mastered</span>
          </button>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="text-xs text-slate-400 font-medium">
          Use ← / → arrow keys
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm"
        >
          <span>Next Card</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
