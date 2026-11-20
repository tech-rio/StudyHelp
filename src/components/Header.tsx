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
    <header className="sticky top-0 z-40 bg-[#f0faf4]/90 backdrop-blur-md px-6 sm:px-8 py-4 transition-colors border-b border-emerald-100/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-5">
        {/* Search Bar matching mockup */}
        <div className="flex-1 max-w-xl">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your notes, topics, or ask anything..."
              className="w-full pl-11 pr-20 py-2.5 rounded-full border border-stone-200/90 bg-white text-sm sm:text-base font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs transition"
            />
            <kbd className="absolute right-3.5 px-2 py-0.5 text-xs font-mono font-bold text-stone-400 bg-stone-100 rounded-md border border-stone-200 pointer-events-none">
              Ctrl + K
            </kbd>
          </div>
        </div>

        {/* Right side controls matching mockup */}
        <div className="flex items-center gap-3.5">
          {/* Deck Dropdown Selector */}
          <div className="relative group hidden sm:block">
            <button className="flex items-center gap-2.5 text-sm font-semibold px-4 py-2 rounded-full border border-stone-200/90 bg-white hover:bg-stone-50 text-stone-700 shadow-xs transition">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span className="truncate max-w-44">{currentDeck.title}</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>
            <div className="absolute right-0 mt-1 w-72 bg-white border border-stone-200 rounded-2xl shadow-xl p-2 hidden group-hover:block z-50 animate-in fade-in duration-150">
              <div className="text-xs font-bold text-stone-400 uppercase tracking-wider px-3 py-1.5">
                Active Study Deck
              </div>
              <button
                onClick={() => onSelectDeck(DEEP_LEARNING_DECK)}
                className="w-full text-left px-3 py-2.5 text-sm rounded-xl hover:bg-emerald-50 text-stone-800 transition flex items-center justify-between"
              >
                <span>Deep Learning & Backprop</span>
                {currentDeck.title.includes("Deep Learning") && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
              <button
                onClick={() => onSelectDeck(OPERATING_SYSTEMS_DECK)}
                className="w-full text-left px-3 py-2.5 text-sm rounded-xl hover:bg-emerald-50 text-stone-800 transition flex items-center justify-between"
              >
                <span>OS Concurrency & Deadlocks</span>
                {currentDeck.title.includes("Operating Systems") && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            </div>
          </div>

          {/* Gemini API Pill */}
          <button
            onClick={onOpenKeyModal}
            className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full border shadow-xs transition ${
              hasKey
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            {hasKey ? <Sparkles className="w-4 h-4 text-emerald-600" /> : <Key className="w-4 h-4 text-stone-400" />}
            <span>{hasKey ? 'Gemini Live' : 'Demo Mode'}</span>
          </button>

          {/* Notification Bell with green badge */}
          <button
            title="Notifications"
            className="relative p-2.5 rounded-full border border-stone-200/90 bg-white hover:bg-stone-50 text-stone-600 transition shadow-xs"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>

          {/* Avatar from mockup */}
          <div className="w-10 h-10 rounded-full ring-2 ring-emerald-500 overflow-hidden shadow-xs cursor-pointer hover:scale-105 transition">
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
