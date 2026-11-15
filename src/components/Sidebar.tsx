import type { FC } from 'react';
import {
  FileText,
  BookOpen,
  Layers,
  CheckCircle2,
  GitFork,
  MessageSquare,
  Presentation,
  Flame
} from 'lucide-react';
import type { StudyPackage } from '../types/study';

export type TabType = 'workspace' | 'summary' | 'flashcards' | 'quiz' | 'mindmap' | 'tutor' | 'presentation';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  deck: StudyPackage;
  quizScore?: { score: number; total: number } | null;
}

export const Sidebar: FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  deck,
  quizScore
}) => {
  const navItems = [
    {
      id: 'workspace' as TabType,
      label: 'Input & Notes Hub',
      icon: FileText,
      badge: null
    },
    {
      id: 'summary' as TabType,
      label: 'Smart Summary & ELI5',
      icon: BookOpen,
      badge: `${deck.keyPoints.length} points`
    },
    {
      id: 'flashcards' as TabType,
      label: '3D Active Recall',
      icon: Layers,
      badge: `${deck.flashcards.length}`
    },
    {
      id: 'quiz' as TabType,
      label: 'Adaptive Exam Quiz',
      icon: CheckCircle2,
      badge: quizScore ? `${quizScore.score}/${quizScore.total}` : `${deck.quiz.length} Qs`
    },
    {
      id: 'mindmap' as TabType,
      label: 'Concept Mind Map',
      icon: GitFork,
      badge: 'Interactive'
    },
    {
      id: 'tutor' as TabType,
      label: 'Socratic AI Tutor',
      icon: MessageSquare,
      badge: 'AI Grounded'
    },
    {
      id: 'presentation' as TabType,
      label: 'Presentation Slides',
      icon: Presentation,
      badge: '8 Slides',
      highlight: true
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-50/70 dark:bg-slate-900/70 border-r border-slate-200 dark:border-slate-800 p-3 flex flex-col justify-between shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Study Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                  : item.highlight
                  ? 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 bg-indigo-50/60 dark:bg-indigo-950/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Presentation Badge */}
      <div className="mt-4 p-3 bg-linear-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/50 dark:border-indigo-800/40 rounded-xl text-xs">
        <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-bold mb-1">
          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Demo Ready</span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
          Designed for 5–7 min live presentation with full slide deck and live interactive demonstration.
        </p>
      </div>
    </aside>
  );
};
