import { useState, type FC } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  HelpCircle
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
      <div className="max-w-xl mx-auto bg-white border border-stone-200 rounded-xl p-8 text-center shadow-xs space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Quiz Completed
          </span>
          <h2 className="text-2xl font-bold text-stone-900 mt-1">
            {scorePercent >= 80 ? 'Solid Understanding!' : scorePercent >= 60 ? 'Good Progress' : 'Review Recommended'}
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            You got {correctCount} out of {questions.length} questions correct ({scorePercent}%)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 py-2 text-left">
          <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-xs text-stone-500">Correct Answers</span>
            <p className="text-xl font-bold text-stone-900 mt-0.5">{correctCount} / {questions.length}</p>
          </div>
          <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-xs text-stone-500">Score</span>
            <p className="text-xl font-bold text-stone-900 mt-0.5">{scorePercent}%</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleRetake}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs shadow-xs transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Practice Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Practice Assessment
          </span>
          <h2 className="text-lg font-bold text-stone-900">
            Question {currentIndex + 1} of {questions.length}
          </h2>
        </div>
        <div className="text-xs font-mono px-2.5 py-1 rounded bg-stone-100 text-stone-700 border border-stone-200">
          Score: {correctCount} / {Object.keys(selectedAnswers).length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
        <div
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          className="bg-stone-900 h-full transition-all duration-300"
        />
      </div>

      {/* Question Card */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-5">
        <p className="text-base font-semibold text-stone-900 leading-snug">
          {currentQ.question}
        </p>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((option, optIdx) => {
            const isSelected = selectedOption === optIdx;
            const isCorrect = optIdx === currentQ.correctIndex;

            let buttonStyle = "border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-800 bg-white";

            if (isAnswered) {
              if (isCorrect) {
                buttonStyle = "border-emerald-600 bg-emerald-50/80 text-emerald-950 font-medium";
              } else if (isSelected && !isCorrect) {
                buttonStyle = "border-rose-500 bg-rose-50/80 text-rose-950 font-medium";
              } else {
                buttonStyle = "opacity-45 border-stone-200 text-stone-400";
              }
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                disabled={isAnswered}
                className={`w-full text-left p-3.5 rounded-lg border transition-all duration-150 flex items-center justify-between text-xs sm:text-sm ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs shrink-0 ${
                    isAnswered && isCorrect
                      ? 'bg-emerald-600 text-white'
                      : isAnswered && isSelected
                      ? 'bg-rose-600 text-white'
                      : 'bg-stone-100 text-stone-600'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="leading-relaxed">{option}</span>
                </div>

                {isAnswered && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Card */}
        {showExplanation && (
          <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-800 space-y-1.5 animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 font-semibold text-stone-900">
              <HelpCircle className="w-4 h-4 text-stone-600" />
              <span>Explanation</span>
            </div>
            <p className="leading-relaxed">
              {currentQ.explanation}
            </p>
            {currentQ.tip && (
              <div className="pt-2 border-t border-stone-200 text-stone-600 text-[11px]">
                <strong className="text-stone-800">Exam Note:</strong> {currentQ.tip}
              </div>
            )}
          </div>
        )}

        {/* Next Question Button */}
        {isAnswered && (
          <div className="flex items-center justify-end pt-1">
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs shadow-xs transition active:scale-98"
            >
              <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
