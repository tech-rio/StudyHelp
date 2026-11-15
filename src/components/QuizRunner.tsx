import { useState, type FC } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  HelpCircle,
  Trophy
} from 'lucide-react';
import type { QuizQuestion } from '../types/study';

interface QuizRunnerProps {
  questions: QuizQuestion[];
  onScoreUpdate?: (score: number, total: number) => void;
}

export const QuizRunner: FC<QuizRunnerProps> = ({ questions, onScoreUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIndex: number]: number }>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500 text-sm">
        No quiz questions available yet.
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const selectedOption = selectedAnswers[currentIndex];
  const isAnswered = selectedOption !== undefined;

  const handleSelectOption = (optIndex: number) => {
    if (isAnswered) return;

    const updatedAnswers = { ...selectedAnswers, [currentIndex]: optIndex };
    setSelectedAnswers(updatedAnswers);
    setShowExplanation(true);

    const totalAnswered = Object.keys(updatedAnswers).length;
    if (totalAnswered === questions.length) {
      let finalScore = 0;
      questions.forEach((q, idx) => {
        if (updatedAnswers[idx] === q.correctIndex) {
          finalScore++;
        }
      });
      if (onScoreUpdate) {
        onScoreUpdate(finalScore, questions.length);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowExplanation(selectedAnswers[currentIndex + 1] !== undefined);
    } else {
      setIsCompleted(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
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
      <div className="max-w-xl mx-auto bg-white border border-stone-200/90 rounded-3xl p-8 sm:p-10 text-center shadow-xs space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
          <Trophy className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Quiz Assessment Completed
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1.5">
            {scorePercent >= 80 ? 'Mastery Level Achieved! 🎉' : scorePercent >= 60 ? 'Good Effort! Keep Reviewing' : 'Review Recommended'}
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            You scored {correctCount} out of {questions.length} questions ({scorePercent}%)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 py-2 text-left">
          <div className="p-4 rounded-2xl bg-[#f0faf4] border border-emerald-100">
            <span className="text-xs text-stone-500 font-semibold">Correct Answers</span>
            <p className="text-2xl font-extrabold text-emerald-800 mt-0.5">{correctCount} / {questions.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#f0faf4] border border-emerald-100">
            <span className="text-xs text-stone-500 font-semibold">Mastery Score</span>
            <p className="text-2xl font-extrabold text-emerald-800 mt-0.5">{scorePercent}%</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleRetake}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/20 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Practice Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Adaptive Knowledge Check
          </span>
          <h2 className="text-xl font-bold text-stone-900 mt-0.5">
            Question {currentIndex + 1} of {questions.length}
          </h2>
        </div>
        <div className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
          Score: {correctCount} / {Object.keys(selectedAnswers).length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden shadow-inner">
        <div
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          className="bg-emerald-600 h-full transition-all duration-300"
        />
      </div>

      {/* Question Card */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <p className="text-lg font-bold text-stone-900 leading-snug">
          {currentQ.question}
        </p>

        {/* Options */}
        <div className="space-y-3">
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
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 flex items-center justify-between text-xs sm:text-sm ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
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
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Card */}
        {showExplanation && (
          <div className="p-4 rounded-2xl bg-[#f0faf4] border border-emerald-200/80 text-xs text-stone-800 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              <span>Explanation & Rationale</span>
            </div>
            <p className="leading-relaxed">
              {currentQ.explanation}
            </p>
            {currentQ.tip && (
              <div className="pt-2 border-t border-emerald-100 text-stone-600 text-[11px]">
                <strong className="text-emerald-900">Exam Note:</strong> {currentQ.tip}
              </div>
            )}
          </div>
        )}

        {/* Next Question Button */}
        {isAnswered && (
          <div className="flex items-center justify-end pt-1">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/20 transition active:scale-98"
            >
              <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
