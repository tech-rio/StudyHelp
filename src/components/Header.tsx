import { useState, useRef, useEffect, type FC } from 'react';
import { Search, Bell, BookOpen, ChevronDown, Check, Plus } from 'lucide-react';
import type { StudyPackage } from '../types/study';

interface HeaderProps {
  currentDeck: StudyPackage;
  decks: StudyPackage[];
  onSelectDeck: (deck: StudyPackage) => void;
  onNewSession?: () => void;
  onSearch?: (query: string) => void;
}

export const Header: FC<HeaderProps> = ({
  currentDeck,
  decks,
  onSelectDeck,
  onNewSession,
  onSearch: _onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

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

        {/* Right side controls */}
        <div className="flex items-center gap-3.5">
          {/* Deck Dropdown Selector */}
          <div ref={dropdownRef} className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(prev => !prev)}
              className="flex items-center gap-2.5 text-sm font-semibold px-4 py-2 rounded-full border border-stone-200/90 bg-white hover:bg-stone-50 active:scale-98 text-stone-700 shadow-xs transition cursor-pointer"
              title="Click to switch active study deck"
            >
              <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate max-w-44 font-bold text-stone-800">{currentDeck.title}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-emerald-600' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-stone-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-3 py-1.5 text-xs font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100 mb-1">
                  <span>Active Study Material</span>
                  <span className="text-[10px] text-emerald-700 font-semibold lowercase">({decks.length} available)</span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1 py-1">
                  {decks.map((deck) => {
                    const isSelected = currentDeck.title === deck.title;
                    const isCustom = !deck.title.includes("Deep Learning") && !deck.title.includes("Operating Systems");

                    return (
                      <button
                        key={deck.title}
                        type="button"
                        onClick={() => {
                          onSelectDeck(deck);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-sm rounded-xl transition flex items-center justify-between gap-2.5 ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200/80 shadow-2xs'
                            : 'hover:bg-stone-50 text-stone-700 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <BookOpen className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-600' : 'text-stone-400'}`} />
                          <div className="truncate">
                            <span className="truncate block">{deck.title}</span>
                            {isCustom && (
                              <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 tracking-wide uppercase">
                                Uploaded Notes
                              </span>
                            )}
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {onNewSession && (
                  <div className="pt-2 border-t border-stone-100 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onNewSession();
                      }}
                      className="w-full text-center px-3 py-2 text-xs font-bold rounded-xl text-emerald-700 hover:bg-emerald-50 transition flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Upload New Notes / PDF</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notification Bell with green badge */}
          <button
            title="Notifications"
            className="relative p-2.5 rounded-full border border-stone-200/90 bg-white hover:bg-stone-50 text-stone-600 transition shadow-xs cursor-pointer"
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
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
