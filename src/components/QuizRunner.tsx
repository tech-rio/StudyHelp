import { useState, type FC } from 'react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { QuizQuestion } from '../types/study';

interface QuizRunnerProps {
  questions: QuizQuestion[];
  onScoreUpdate?: (score: number, total: number) => void;
}

export const QuizRunner: FC<QuizRunnerProps> = ({ questions, onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-16 text-stone-500 text-base">
        No quiz questions found in this study deck.
      </div>
    );
  }

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    setShowExplanation(true);

    const updatedAnswers = { ...selectedAnswers, [currentIndex]: idx };
    setSelectedAnswers(updatedAnswers);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#22c55e', '#10b981', '#14b8a6', '#84cc16']
      });
    }

    let currentScore = 0;
    questions.forEach((q, qIdx) => {
      if (updatedAnswers[qIdx] === q.correctIndex) {
        currentScore++;
      }
    });

    if (onScoreUpdate) {
      onScoreUpdate(currentScore, questions.length);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(selectedAnswers[currentIndex + 1] ?? null);
      setIsAnswered(selectedAnswers[currentIndex + 1] !== undefined);
      setShowExplanation(selectedAnswers[currentIndex + 1] !== undefined);
    } else {
      setIsCompleted(true);
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899']
      });
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setSelectedOption(null);
    setIsAnswered(false);
    setShowExplanation(false);
    setCurrentIndex(0);
    setIsCompleted(false);
    if (onScoreUpdate) {
      onScoreUpdate(0, questions.length);
    }
  };

  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctIndex) {
      correctCount++;
    }
  });
  const scorePercent = Math.round((correctCount / questions.length) * 100);

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-stone-200/90 rounded-3xl p-10 sm:p-12 text-center shadow-xs space-y-7">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
          <Trophy className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-700">
            Quiz Assessment Completed
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2">
            {scorePercent >= 80 ? 'Mastery Level Achieved! 🎉' : scorePercent >= 60 ? 'Good Effort! Keep Reviewing' : 'Review Recommended'}
          </h2>
          <p className="text-base text-stone-600 mt-2">
            You scored {correctCount} out of {questions.length} questions ({scorePercent}%)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 py-3 text-left">
          <div className="p-5 rounded-2xl bg-[#f0faf4] border border-emerald-100">
            <span className="text-xs sm:text-sm text-stone-500 font-semibold">Correct Answers</span>
            <p className="text-3xl font-extrabold text-emerald-800 mt-1">{correctCount} / {questions.length}</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#f0faf4] border border-emerald-100">
            <span className="text-xs sm:text-sm text-stone-500 font-semibold">Mastery Score</span>
            <p className="text-3xl font-extrabold text-emerald-800 mt-1">{scorePercent}%</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={handleRetake}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-sm shadow-emerald-600/20 transition active:scale-98"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Retake Practice Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs sm:text-sm font-bold text-emerald-700 uppercase tracking-wider">
            Adaptive Knowledge Check
          </span>
          <h2 className="text-2xl font-extrabold text-stone-900 mt-1 tracking-tight">
            Question {currentIndex + 1} of {questions.length}
          </h2>
        </div>
        <div className="text-sm font-mono font-bold px-4 py-2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          Score: {correctCount} / {Object.keys(selectedAnswers).length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden shadow-inner">
        <div
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          className="bg-emerald-600 h-full transition-all duration-300"
        />
      </div>

      {/* Question Card */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-7 sm:p-10 shadow-xs space-y-7">
        <p className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug tracking-tight">
          {currentQ.question}
        </p>

        {/* Options */}
        <div className="space-y-3.5">
          {currentQ.options.map((option, optIdx) => {
            const isSelected = selectedOption === optIdx;
            const isCorrect = optIdx === currentQ.correctIndex;

            let buttonStyle = "border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/20 text-stone-800 bg-white";

            if (isAnswered) {
              if (isCorrect) {
                buttonStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-xs";
              } else if (isSelected && !isCorrect) {
                buttonStyle = "border-rose-400 bg-rose-50 text-rose-950 font-bold";
              } else {
                buttonStyle = "opacity-40 border-stone-200 text-stone-400";
              }
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                disabled={isAnswered}
                className={`w-full text-left p-5 sm:p-5.5 rounded-2xl border-2 transition-all duration-150 flex items-center justify-between text-sm sm:text-base ${buttonStyle}`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    isAnswered && isCorrect
                      ? 'bg-emerald-600 text-white'
                      : isAnswered && isSelected
                      ? 'bg-rose-600 text-white'
                      : 'bg-stone-100 text-stone-700'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="leading-relaxed">{option}</span>
                </div>

                {isAnswered && isCorrect && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Card */}
        {showExplanation && (
          <div className="p-5 rounded-2xl bg-[#f0faf4] border border-emerald-200/80 text-sm sm:text-base text-stone-800 space-y-2.5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <HelpCircle className="w-5 h-5 text-emerald-700" />
              <span>Explanation & Rationale</span>
            </div>
            <p className="leading-relaxed">
              {currentQ.explanation}
            </p>
            {currentQ.tip && (
              <div className="pt-2.5 border-t border-emerald-100 text-stone-600 text-xs sm:text-sm">
                <strong className="text-emerald-900">Exam Note:</strong> {currentQ.tip}
              </div>
            )}
          </div>
        )}

        {/* Next Question Button */}
        {isAnswered && (
          <div className="flex items-center justify-end pt-2">
            <button
              onClick={handleNext}
              className="flex items-center gap-2.5 px-7 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-sm shadow-emerald-600/20 transition active:scale-98"
            >
              <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
