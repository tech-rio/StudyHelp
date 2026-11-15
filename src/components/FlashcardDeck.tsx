import { useState, useEffect, useCallback, type FC } from 'react';
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw
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
      <div className="text-center py-12 text-[#7d7368] text-sm">
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
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Top Header & Progress */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#26221f] tracking-tight flex items-center gap-2">
            Active Recall Flashcards
            <span className="text-xs px-2 py-0.5 rounded bg-[#eae4d7] text-[#26221f] font-mono font-medium border border-[#ded8cb]">
              {currentIndex + 1} of {cards.length}
            </span>
          </h2>
          <p className="text-xs text-[#7d7368] mt-0.5">
            Press <kbd className="px-1.5 py-0.5 rounded bg-[#eae4d7] text-[#474039] font-mono text-[10px] border border-[#ded8cb]">Space</kbd> or click to flip
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleShuffle}
            title="Shuffle cards"
            className="p-1.5 rounded-lg border border-[#ded8cb] bg-[#faf7f0] hover:bg-[#eae4d7] text-[#474039] transition"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            title="Reset progress"
            className="p-1.5 rounded-lg border border-[#ded8cb] bg-[#faf7f0] hover:bg-[#eae4d7] text-[#474039] transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress tracker bar */}
      <div className="w-full bg-[#ded8cb] h-1.5 rounded-full overflow-hidden flex">
        <div
          style={{ width: `${(masteredCount / cards.length) * 100}%` }}
          className="bg-[#3e5f29] transition-all duration-300"
          title={`Mastered: ${masteredCount}`}
        />
        <div
          style={{ width: `${(reviewingCount / cards.length) * 100}%` }}
          className="bg-[#b37424] transition-all duration-300"
          title={`Reviewing: ${reviewingCount}`}
        />
        <div
          style={{ width: `${(learningCount / cards.length) * 100}%` }}
          className="bg-[#9e9485] transition-all duration-300"
          title={`Learning: ${learningCount}`}
        />
      </div>

      {/* 3D Flashcard Flip Canvas */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-76 cursor-pointer perspective-1000 select-none"
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 ease-out transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT */}
          <div className="absolute inset-0 backface-hidden bg-[#faf7f0] border border-[#ded8cb] rounded-xl p-7 flex flex-col justify-between shadow-xs hover:border-[#b8ad9b] transition-colors">
            <div className="flex items-center justify-between text-xs text-[#7d7368]">
              <span className="font-medium tracking-wide uppercase text-[10px]">Question</span>
              <span className="px-2 py-0.5 rounded bg-[#eae4d7] text-[#474039] text-[11px] border border-[#ded8cb]">
                {currentCard.category}
              </span>
            </div>

            <div className="my-auto text-center px-4">
              <p className="text-lg font-semibold text-[#26221f] leading-snug">
                {currentCard.front}
              </p>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs text-[#8a8074] font-medium">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Click to reveal answer</span>
            </div>
          </div>

          {/* BACK */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#26221f] border border-[#3d3732] rounded-xl p-7 text-[#faf7f0] flex flex-col justify-between shadow-md">
            <div className="flex items-center justify-between text-xs text-[#b8ad9b]">
              <span className="font-medium tracking-wide uppercase text-[10px] text-[#86efac]">Answer</span>
              <span className="px-2 py-0.5 rounded bg-[#38332e] text-[#cfc6b6] text-[11px]">
                {currentCard.category}
              </span>
            </div>

            <div className="my-auto overflow-y-auto max-h-40 px-2 text-left">
              <p className="text-base text-[#faf7f0] leading-relaxed font-normal whitespace-pre-line">
                {currentCard.back}
              </p>
            </div>

            <div className="text-center text-[11px] text-[#b8ad9b] font-medium">
              Rate how well you knew this below
            </div>
          </div>
        </div>
      </div>

      {/* Spaced Repetition Buttons */}
      <div className="space-y-2">
        <div className="text-center text-[11px] font-medium text-[#7d7368] uppercase tracking-wider">
          Self Assessment
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRateMastery('learning');
            }}
            className="py-2 px-3 rounded-lg border border-[#ded8cb] bg-[#faf7f0] hover:bg-[#eae4d7] text-[#474039] text-xs font-medium transition active:scale-98"
          >
            Hard (Review Soon)
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRateMastery('reviewing');
            }}
            className="py-2 px-3 rounded-lg border border-[#e3d1ba] bg-[#f2e6d6] hover:bg-[#ebd9c4] text-[#5c3e1e] text-xs font-medium transition active:scale-98"
          >
            Good (Understood)
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRateMastery('mastered');
            }}
            className="py-2 px-3 rounded-lg border border-[#c4dcaf] bg-[#e6edd8] hover:bg-[#dbe6ca] text-[#2d4d1e] text-xs font-medium transition active:scale-98"
          >
            Easy (Mastered)
          </button>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#ded8cb] bg-[#faf7f0] hover:bg-[#eae4d7] text-[#474039] transition"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <span className="text-xs text-[#7d7368] font-mono">
          ← / → keys
        </span>

        <button
          onClick={handleNext}
          className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#26221f] hover:bg-[#3d3732] text-[#faf7f0] transition shadow-xs"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
