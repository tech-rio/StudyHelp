import type { FC } from 'react';
import { BookOpen, Download, ChevronDown, Check, Key } from 'lucide-react';
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
    md += `### Plain English Explanation\n${currentDeck.overviewEli5}\n\n`;
    md += `## Key Concepts\n`;
    currentDeck.keyPoints.forEach((kp, idx) => {
      md += `### ${idx + 1}. ${kp.topic} [${kp.importance.toUpperCase()}]\n`;
      md += `${kp.summary}\n`;
      md += `> **Plain English:** ${kp.eli5}\n\n`;
      if (kp.formulasOrSyntax && kp.formulasOrSyntax.length > 0) {
        md += `\`\`\`text\n${kp.formulasOrSyntax.join('\n')}\n\`\`\`\n\n`;
      }
    });
    md += `## Flashcards\n`;
    currentDeck.flashcards.forEach((fc, idx) => {
      md += `**Card ${idx + 1} (${fc.category})**\n- Q: ${fc.front}\n- A: ${fc.back}\n\n`;
    });
    md += `## Practice Quiz\n`;
    currentDeck.quiz.forEach((q, idx) => {
      md += `**Question ${idx + 1}:** ${q.question}\n`;
      q.options.forEach((opt, oIdx) => {
        md += `  ${oIdx === q.correctIndex ? '✓' : ' '} ${opt}\n`;
      });
      md += `*Why:* ${q.explanation}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${currentDeck.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
            C
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-stone-900 tracking-tight leading-none m-0">
                CogniStudy
              </h1>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                Study Partner
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block mt-0.5 font-normal">
              Active recall & practice questions from your course notes
            </p>
          </div>
        </div>

        {/* Action toolbar */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Deck Switcher Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition">
              <BookOpen className="w-3.5 h-3.5 text-stone-600" />
              <span className="truncate max-w-[150px]">{currentDeck.title}</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>
            <div className="absolute right-0 mt-1 w-64 bg-white border border-stone-200 rounded-xl shadow-lg p-1.5 hidden group-hover:block z-50 animate-in fade-in duration-150">
              <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider px-2 py-1">
                Sample Course Topics
              </div>
              <button
                onClick={() => onSelectDeck(DEEP_LEARNING_DECK)}
                className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-stone-100 text-stone-800 transition flex items-center justify-between"
              >
                <span>Deep Learning & Backprop</span>
                {currentDeck.title.includes("Deep Learning") && <Check className="w-3.5 h-3.5 text-stone-800" />}
              </button>
              <button
                onClick={() => onSelectDeck(OPERATING_SYSTEMS_DECK)}
                className="w-full text-left px-2.5 py-1.5 text-xs rounded-lg hover:bg-stone-100 text-stone-800 transition flex items-center justify-between"
              >
                <span>OS Concurrency & Deadlocks</span>
                {currentDeck.title.includes("Operating Systems") && <Check className="w-3.5 h-3.5 text-stone-800" />}
              </button>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportMarkdown}
            title="Download notes in Markdown format"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Export Notes</span>
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenKeyModal}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition ${
              hasKey
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{hasKey ? 'Gemini Connected' : 'Offline Mode'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
