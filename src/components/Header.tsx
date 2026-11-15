import { useState, type FC } from 'react';
import { Search, Bell, Key, Sparkles, BookOpen, ChevronDown, Check } from 'lucide-react';
import type { StudyPackage } from '../types/study';
import { DEEP_LEARNING_DECK, OPERATING_SYSTEMS_DECK } from '../services/demoData';

interface HeaderProps {
  currentDeck: StudyPackage;
  onSelectDeck: (deck: StudyPackage) => void;
  hasKey: boolean;
  onOpenKeyModal: () => void;
  onSearch?: (query: string) => void;
}

export const Header: FC<HeaderProps> = ({
  currentDeck,
  onSelectDeck,
  hasKey,
  onOpenKeyModal,
  onSearch: _onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-40 bg-[#f0faf4]/90 backdrop-blur-md px-6 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Search Bar matching mockup */}
        <div className="flex-1 max-w-xl">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your notes, topics, or ask anything..."
              className="w-full pl-9 pr-16 py-2 rounded-full border border-stone-200/90 bg-white text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs transition"
            />
            <kbd className="absolute right-3 px-1.5 py-0.5 text-[10px] font-mono text-stone-400 bg-stone-100 rounded border border-stone-200 pointer-events-none">
              Ctrl + K
            </kbd>
          </div>
        </div>

        {/* Right side controls matching mockup */}
        <div className="flex items-center gap-3">
          {/* Deck Dropdown Selector */}
          <div className="relative group hidden sm:block">
            <button className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-stone-200/90 bg-white hover:bg-stone-50 text-stone-700 shadow-xs transition">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span className="truncate max-w-35">{currentDeck.title}</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>
            <div className="absolute right-0 mt-1 w-64 bg-white border border-stone-200 rounded-2xl shadow-xl p-1.5 hidden group-hover:block z-50 animate-in fade-in duration-150">
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-2.5 py-1">
                Active Study Deck
              </div>
              <button
                onClick={() => onSelectDeck(DEEP_LEARNING_DECK)}
                className="w-full text-left px-2.5 py-2 text-xs rounded-xl hover:bg-emerald-50 text-stone-800 transition flex items-center justify-between"
              >
                <span>Deep Learning & Backprop</span>
                {currentDeck.title.includes("Deep Learning") && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
              <button
                onClick={() => onSelectDeck(OPERATING_SYSTEMS_DECK)}
                className="w-full text-left px-2.5 py-2 text-xs rounded-xl hover:bg-emerald-50 text-stone-800 transition flex items-center justify-between"
              >
                <span>OS Concurrency & Deadlocks</span>
                {currentDeck.title.includes("Operating Systems") && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            </div>
          </div>

          {/* Gemini API Pill */}
          <button
            onClick={onOpenKeyModal}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border shadow-xs transition ${
              hasKey
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            {hasKey ? <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> : <Key className="w-3.5 h-3.5 text-stone-400" />}
            <span>{hasKey ? 'Gemini Live' : 'Demo Mode'}</span>
          </button>

          {/* Notification Bell with green badge */}
          <button
            title="Notifications"
            className="relative p-2 rounded-full border border-stone-200/90 bg-white hover:bg-stone-50 text-stone-600 transition shadow-xs"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>

          {/* Avatar from mockup */}
          <div className="w-8 h-8 rounded-full ring-2 ring-emerald-500 overflow-hidden shadow-xs cursor-pointer hover:scale-105 transition">
            <img
              src="/avatar.png"
              alt="User Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback avatar
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
