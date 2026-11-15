import { useState, type FC } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Lightbulb
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
      <div className="text-center py-12 text-slate-500">
        No quiz questions available. Please ingest notes first.
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const selectedOption = selectedAnswers[currentIndex];
  const isAnswered = selectedOption !== undefined;

  const handleSelectOption = (optIndex: number) => {
    if (isAnswered) return; // Prevent changing answer after selection

    const updatedAnswers = { ...selectedAnswers, [currentIndex]: optIndex };
    setSelectedAnswers(updatedAnswers);
    setShowExplanation(true);

    // If this was the last question, trigger completion after a short review
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
      // Completed!
      setIsCompleted(true);
      // Trigger celebratory confetti
      confetti({
        particleCount: 120,
        spread: 80,
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

  // Calculate score
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctIndex) {
      correctCount++;
    }
  });
  const scorePercent = Math.round((correctCount / questions.length) * 100);

  if (isCompleted) {
    return (
      <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-xl space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-linear-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-amber-500/30">
          <Trophy className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Assessment Complete
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            {scorePercent >= 80 ? 'Mastery Achieved! 🎉' : scorePercent >= 60 ? 'Good Effort! 📚' : 'Needs More Review 💪'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            You scored {correctCount} out of {questions.length} questions ({scorePercent}%)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500">Correct Answers</span>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{correctCount}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500">Mastery Rating</span>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{scorePercent}%</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleRetake}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/25 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Status */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Adaptive Knowledge Check
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Question {currentIndex + 1} of {questions.length}
          </h2>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          Score: {correctCount} / {Object.keys(selectedAnswers).length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          className="bg-indigo-600 h-full transition-all duration-300"
        />
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <p className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
          {currentQ.question}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, optIdx) => {
            const isSelected = selectedOption === optIdx;
            const isCorrect = optIdx === currentQ.correctIndex;

            let buttonStyle = "border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300";

            if (isAnswered) {
              if (isCorrect) {
                buttonStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-semibold shadow-sm";
              } else if (isSelected && !isCorrect) {
                buttonStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 font-semibold";
              } else {
                buttonStyle = "opacity-50 border-slate-200 dark:border-slate-800 text-slate-400";
              }
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-sm ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isAnswered && isCorrect
                      ? 'bg-emerald-500 text-white'
                      : isAnswered && isSelected
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{option}</span>
                </div>

                {isAnswered && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Card */}
        {showExplanation && (
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 text-xs text-indigo-950 dark:text-indigo-200 space-y-2 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 font-bold text-indigo-700 dark:text-indigo-300">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Explanation & Rationale</span>
            </div>
            <p className="leading-relaxed">
              {currentQ.explanation}
            </p>
            {currentQ.tip && (
              <div className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300 pt-1 border-t border-indigo-200/50 dark:border-indigo-800/50">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span><strong className="text-slate-800 dark:text-slate-200">Exam Tip:</strong> {currentQ.tip}</span>
              </div>
            )}
          </div>
        )}

        {/* Next Question Button */}
        {isAnswered && (
          <div className="flex items-center justify-end pt-2">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/25 transition active:scale-95"
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
