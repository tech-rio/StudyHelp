import type { FC } from 'react';
import { GraduationCap, Key, Download, Sparkles, BookOpen, ChevronDown } from 'lucide-react';
import type { StudyPackage } from '../types/study';
import { DEEP_LEARNING_DECK, OPERATING_SYSTEMS_DECK } from '../services/demoData';

interface HeaderProps {
  currentDeck: StudyPackage;
  onSelectDeck: (deck: StudyPackage) => void;
  hasKey: boolean;
  onOpenKeyModal: () => void;
}

export const Header: FC<HeaderProps> = ({
  currentDeck,
  onSelectDeck,
  hasKey,
  onOpenKeyModal
}) => {
  const handleExportMarkdown = () => {
    let md = `# ${currentDeck.title}\n\n`;
    md += `## Overview\n${currentDeck.overview}\n\n`;
    md += `### Simplified (ELI5)\n${currentDeck.overviewEli5}\n\n`;
    md += `## Key Concepts\n`;
    currentDeck.keyPoints.forEach((kp, idx) => {
      md += `### ${idx + 1}. ${kp.topic} [${kp.importance.toUpperCase()}]\n`;
      md += `${kp.summary}\n`;
      md += `> **ELI5:** ${kp.eli5}\n\n`;
      if (kp.formulasOrSyntax && kp.formulasOrSyntax.length > 0) {
        md += `\`\`\`text\n${kp.formulasOrSyntax.join('\n')}\n\`\`\`\n\n`;
      }
    });
    md += `## Active Recall Flashcards\n`;
    currentDeck.flashcards.forEach((fc, idx) => {
      md += `**Card ${idx + 1} (${fc.category})**\n- Q: ${fc.front}\n- A: ${fc.back}\n\n`;
    });
    md += `## Quiz Assessment\n`;
    currentDeck.quiz.forEach((q, idx) => {
      md += `**Question ${idx + 1}:** ${q.question}\n`;
      q.options.forEach((opt, oIdx) => {
        md += `  ${oIdx === q.correctIndex ? '✅' : '⚪'} ${opt}\n`;
      });
      md += `*Explanation:* ${q.explanation}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${currentDeck.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_study_guide.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo and title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-none m-0">
                CogniStudy <span className="text-indigo-600 dark:text-indigo-400">AI</span>
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Agent v2.0
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block mt-0.5">
              Autonomous Adaptive Study & Exam Intelligence
            </p>
          </div>
        </div>

        {/* Center / Action toolbar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Selector */}
          <div className="relative group hidden md:block">
            <button className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span className="truncate max-w-[140px]">{currentDeck.title}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 hidden group-hover:block z-50">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                Load Instant Demo Deck
              </div>
              <button
                onClick={() => onSelectDeck(DEEP_LEARNING_DECK)}
                className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-200 transition flex items-center justify-between"
              >
                <span>🔥 Deep Learning & Backprop</span>
              </button>
              <button
                onClick={() => onSelectDeck(OPERATING_SYSTEMS_DECK)}
                className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-200 transition flex items-center justify-between"
              >
                <span>⚡ OS Concurrency & Deadlocks</span>
              </button>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportMarkdown}
            title="Download Study Guide Markdown"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* API Key Modal Trigger */}
          <button
            onClick={onOpenKeyModal}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition shadow-sm ${
              hasKey
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
            }`}
          >
            {hasKey ? <Sparkles className="w-3.5 h-3.5" /> : <Key className="w-3.5 h-3.5" />}
            <span>{hasKey ? 'Gemini Live' : 'Demo Mode'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
