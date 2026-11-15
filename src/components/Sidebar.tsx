import type { FC } from 'react';
import {
  Home,
  BookOpen,
  MessageCircle,
  Layers,
  Trophy,
  GitFork,
  Folder,
  Settings,
  Sparkles
} from 'lucide-react';
import type { StudyPackage } from '../types/study';

export type TabType = 'dashboard' | 'workspace' | 'summary' | 'flashcards' | 'quiz' | 'mindmap' | 'tutor' | 'presentation';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  deck: StudyPackage;
  quizScore?: { score: number; total: number } | null;
}

export const Sidebar: FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  deck: _deck,
  quizScore: _quizScore
}) => {
  const navItems = [
    {
      id: 'dashboard' as TabType,
      label: 'Dashboard',
      icon: Home
    },
    {
      id: 'workspace' as TabType,
      label: 'Study Room',
      icon: BookOpen
    },
    {
      id: 'tutor' as TabType,
      label: 'AI Tutor',
      icon: MessageCircle
    },
    {
      id: 'flashcards' as TabType,
      label: 'Flashcards',
      icon: Layers
    },
    {
      id: 'quiz' as TabType,
      label: 'Quizzes',
      icon: Trophy
    },
    {
      id: 'mindmap' as TabType,
      label: 'Mind Maps',
      icon: GitFork
    },
    {
      id: 'summary' as TabType,
      label: 'Library',
      icon: Folder
    },
    {
      id: 'presentation' as TabType,
      label: 'Settings',
      icon: Settings
    }
  ];

  return (
    <aside className="w-full md:w-60 bg-[#eef9f2]/95 border-r border-emerald-100/80 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        {/* Brand Logo matching mockup */}
        <div
          onClick={() => onTabChange('dashboard')}
          className="flex items-center gap-2.5 px-2 cursor-pointer group"
        >
          {/* Open Book Icon in green */}
          <div className="text-emerald-600 transition-transform group-hover:scale-105">
            <svg
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <span className="text-[17px] font-extrabold tracking-tight text-stone-900 font-sans">
            CogniStudy<span className="text-emerald-600 ml-0.5">AI</span>
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs tracking-tight transition-all duration-150 relative ${
                  isActive
                    ? 'bg-[#dcfce7] text-emerald-950 font-bold shadow-xs'
                    : 'text-stone-600 font-medium hover:text-stone-900 hover:bg-emerald-50/70'
                }`}
              >
                {/* Active Left Indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-600 rounded-r-full" />
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-stone-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Upgrade to Pro Card matching mockup */}
      <div className="mt-6 p-4 rounded-2xl bg-linear-to-b from-[#dcfce7]/90 to-[#bbf7d0]/60 border border-emerald-200/60 shadow-xs space-y-2.5">
        <div className="flex items-center gap-1.5 text-emerald-800">
          <div className="w-6 h-6 rounded-lg bg-emerald-600/10 text-emerald-700 flex items-center justify-center font-bold text-xs">
            🌱
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold tracking-tight text-stone-900 m-0">Upgrade to Pro</h4>
          <p className="text-[11px] text-stone-600 mt-0.5 leading-snug font-normal">
            Unlock unlimited notes, quizzes, and AI features.
          </p>
        </div>

        <button
          onClick={() => onTabChange('presentation')}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-tight shadow-xs transition active:scale-98"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Upgrade →</span>
        </button>
      </div>
    </aside>
  );
};
