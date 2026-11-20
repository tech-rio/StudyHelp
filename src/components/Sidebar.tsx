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
    <aside className="w-full md:w-68 bg-[#eef9f2]/95 border-r border-emerald-100/90 p-5 flex flex-col justify-between shrink-0 min-h-[calc(100vh-65px)]">
      <div className="space-y-7">
        {/* Brand Logo matching mockup */}
        <div
          onClick={() => onTabChange('dashboard')}
          className="flex items-center gap-3 px-2 cursor-pointer group"
        >
          {/* Open Book Icon in green */}
          <div className="text-emerald-600 transition-transform group-hover:scale-105">
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tight text-stone-900 font-sans">
            CogniStudy<span className="text-emerald-600 ml-0.5">AI</span>
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm tracking-tight transition-all duration-150 relative ${
                  isActive
                    ? 'bg-[#dcfce7] text-emerald-950 font-bold shadow-xs'
                    : 'text-stone-600 font-medium hover:text-stone-900 hover:bg-emerald-50/70'
                }`}
              >
                {/* Active Left Indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-2.5 bottom-2.5 w-1.5 bg-emerald-600 rounded-r-full" />
                )}
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-700' : 'text-stone-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Upgrade to Pro Card matching mockup */}
      <div className="mt-6 p-5 rounded-2xl bg-linear-to-b from-[#dcfce7]/95 to-[#bbf7d0]/65 border border-emerald-200/70 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-emerald-800">
          <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center font-bold text-sm">
            🌱
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold tracking-tight text-stone-900 m-0">Upgrade to Pro</h4>
          <p className="text-xs text-stone-600 mt-1 leading-normal font-normal">
            Unlock unlimited notes, quizzes, and AI features.
          </p>
        </div>

        <button
          onClick={() => onTabChange('presentation')}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold tracking-tight shadow-xs transition active:scale-98"
        >
          <Sparkles className="w-4 h-4" />
          <span>Upgrade →</span>
        </button>
      </div>
    </aside>
  );
};
