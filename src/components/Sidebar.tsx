import type { FC } from 'react';
import {
  FileText,
  BookOpen,
  Layers,
  CheckCircle2,
  GitFork,
  MessageSquare,
  Presentation,
  Compass
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
      label: 'Upload & Notes',
      icon: FileText,
      badge: null
    },
    {
      id: 'summary' as TabType,
      label: 'Summary & Key Ideas',
      icon: BookOpen,
      badge: `${deck.keyPoints.length}`
    },
    {
      id: 'flashcards' as TabType,
      label: 'Active Flashcards',
      icon: Layers,
      badge: `${deck.flashcards.length}`
    },
    {
      id: 'quiz' as TabType,
      label: 'Practice Quiz',
      icon: CheckCircle2,
      badge: quizScore ? `${quizScore.score}/${quizScore.total}` : `${deck.quiz.length} Qs`
    },
    {
      id: 'mindmap' as TabType,
      label: 'Concept Map',
      icon: GitFork,
      badge: null
    },
    {
      id: 'tutor' as TabType,
      label: 'Study Tutor',
      icon: MessageSquare,
      badge: null
    },
    {
      id: 'presentation' as TabType,
      label: 'Presentation Slides',
      icon: Presentation,
      badge: '8 Slides'
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-[#f0ebe0]/70 border-r border-[#ded8cb] p-3.5 flex flex-col justify-between shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold text-[#8a8074] uppercase tracking-wider">
          Study Tools
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all duration-150 ${
                isActive
                  ? 'bg-[#26221f] text-[#faf7f0] font-medium shadow-xs'
                  : 'text-[#5c534a] hover:text-[#26221f] hover:bg-[#e6dfd1] font-normal'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#faf7f0]' : 'text-[#8a8074]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive
                      ? 'bg-white/20 text-[#faf7f0]'
                      : 'bg-[#ded8cb] text-[#474039]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Course Demo Note */}
      <div className="mt-6 p-3.5 bg-[#faf7f0] border border-[#ded8cb] rounded-xl text-xs space-y-1 shadow-xs">
        <div className="flex items-center gap-1.5 font-semibold text-[#26221f]">
          <Compass className="w-3.5 h-3.5 text-[#5c534a]" />
          <span>Evaluation Demo</span>
        </div>
        <p className="text-[11px] text-[#7d7368] leading-normal">
          5–7 min presentation mode with live demo and talking points.
        </p>
      </div>
    </aside>
  );
};
