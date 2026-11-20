import { useState, useEffect, type FC } from 'react';
import {
  FileText,
  Layers,
  Trophy,
  GitFork,
  MessageCircle,
  ArrowRight,
  Plus,
  Play,
  Clock,
  BarChart2,
  BookOpen,
  Target,
  Flame,
  MoreVertical,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import type { StudyPackage } from '../types/study';
import { DEEP_LEARNING_DECK, OPERATING_SYSTEMS_DECK } from '../services/demoData';
import { getComputedAnalytics, type RecentSession } from '../services/studyAnalytics';

interface DashboardViewProps {
  onNavigate: (tab: any) => void;
  onSelectDeck: (deck: StudyPackage) => void;
  currentDeck: StudyPackage;
}

export const DashboardView: FC<DashboardViewProps> = ({
  onNavigate,
  onSelectDeck,
  currentDeck: _currentDeck
}) => {
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'all'>('week');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [analytics, setAnalytics] = useState(() => getComputedAnalytics('week'));

  useEffect(() => {
    const update = () => {
      setAnalytics(getComputedAnalytics(timeframe));
    };

    update();
    window.addEventListener('cogni_study_analytics_updated', update);
    return () => window.removeEventListener('cogni_study_analytics_updated', update);
  }, [timeframe]);

  const handleSessionClick = (session: RecentSession) => {
    if (session.deckId === 'operating-systems' || session.deckTitle.toLowerCase().includes('concurrency')) {
      onSelectDeck(OPERATING_SYSTEMS_DECK);
    } else {
      onSelectDeck(DEEP_LEARNING_DECK);
    }

    if (session.toolUsed === 'Flashcards') {
      onNavigate('flashcards');
    } else if (session.toolUsed === 'AI Tutor') {
      onNavigate('tutor');
    } else if (session.toolUsed === 'Mind Map') {
      onNavigate('mindmap');
    } else {
      onNavigate('summary');
    }
  };

  const timeframeLabels: Record<'today' | 'week' | 'all', string> = {
    today: 'Today',
    week: 'This Week',
    all: 'All Time'
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-linear-to-r from-[#dcfce7]/95 via-[#e0f7e9]/85 to-[#f0faf4] border border-emerald-100/90 p-8 sm:p-12 overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-2xl">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 text-emerald-800 text-xs sm:text-sm font-bold tracking-tight mb-5 shadow-xs border border-emerald-200/70">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Your AI Study Partner</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[48px] font-extrabold tracking-tight text-stone-900 leading-[1.14]">
            Study Smarter,<br />Learn Deeper.
          </h1>

          <p className="text-base sm:text-lg text-stone-600 mt-4 max-w-xl leading-relaxed font-normal">
            Turn your notes into summaries, flashcards, quizzes, mind maps and more — powered by Gemini AI.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <button
              onClick={() => onNavigate('workspace')}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base font-bold tracking-tight shadow-md shadow-emerald-600/25 transition-all hover:scale-102 active:scale-98"
            >
              <Plus className="w-5 h-5" />
              <span>New Study Session</span>
            </button>
            <button
              onClick={() => {
                onSelectDeck(DEEP_LEARNING_DECK);
                onNavigate('summary');
              }}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 text-stone-800 text-sm sm:text-base font-bold tracking-tight border border-stone-200/90 shadow-xs transition-all hover:scale-102 active:scale-98"
            >
              <Play className="w-4 h-4 fill-stone-800 text-stone-800" />
              <span>Try a Sample Topic</span>
            </button>
          </div>
        </div>

        {/* Right side cozy study desk illustration */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[45%] overflow-hidden pointer-events-none">
          <img
            src="/study-desk.png"
            alt="Study Desk"
            className="w-full h-full object-cover object-left mask-[linear-gradient(to_right,transparent,black_25%)]"
          />
        </div>
      </div>

      {/* 5 Quick-Access Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Summarize Notes */}
        <div
          onClick={() => onNavigate('summary')}
          className="bg-white hover:bg-emerald-50/30 border border-stone-200/90 hover:border-emerald-300 rounded-3xl p-6 cursor-pointer transition-all duration-200 shadow-xs hover:-translate-y-1 group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-stone-900 group-hover:text-emerald-700 transition">
              Summarize Notes
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1.5 leading-normal font-normal">
              Get concise summaries, key concepts & formulas
            </p>
          </div>
        </div>

        {/* Card 2: Flashcards */}
        <div
          onClick={() => onNavigate('flashcards')}
          className="bg-white hover:bg-cyan-50/30 border border-stone-200/90 hover:border-cyan-300 rounded-3xl p-6 cursor-pointer transition-all duration-200 shadow-xs hover:-translate-y-1 group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100/90 text-cyan-700 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-stone-900 group-hover:text-cyan-700 transition">
              Flashcards
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1.5 leading-normal font-normal">
              Active recall with interactive cards
            </p>
          </div>
        </div>

        {/* Card 3: Adaptive Quiz */}
        <div
          onClick={() => onNavigate('quiz')}
          className="bg-white hover:bg-emerald-50/30 border border-stone-200/90 hover:border-emerald-300 rounded-3xl p-6 cursor-pointer transition-all duration-200 shadow-xs hover:-translate-y-1 group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-stone-900 group-hover:text-emerald-700 transition">
              Adaptive Quiz
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1.5 leading-normal font-normal">
              MCQs, instant scoring and detailed explanations
            </p>
          </div>
        </div>

        {/* Card 4: Mind Map */}
        <div
          onClick={() => onNavigate('mindmap')}
          className="bg-white hover:bg-teal-50/30 border border-stone-200/90 hover:border-teal-300 rounded-3xl p-6 cursor-pointer transition-all duration-200 shadow-xs hover:-translate-y-1 group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100/90 text-teal-700 flex items-center justify-center">
              <GitFork className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-teal-600 group-hover:translate-x-1 transition" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-stone-900 group-hover:text-teal-700 transition">
              Mind Map
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1.5 leading-normal font-normal">
              Visual concept tree to connect and remember
            </p>
          </div>
        </div>

        {/* Card 5: AI Tutor */}
        <div
          onClick={() => onNavigate('tutor')}
          className="bg-white hover:bg-cyan-50/30 border border-stone-200/90 hover:border-cyan-300 rounded-3xl p-6 cursor-pointer transition-all duration-200 shadow-xs hover:-translate-y-1 group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100/90 text-cyan-700 flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-stone-900 group-hover:text-cyan-700 transition">
              AI Tutor
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1.5 leading-normal font-normal">
              Ask, discuss and learn with a Socratic AI mentor
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Sessions + Progress Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Study Sessions (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100/90 flex items-center justify-center text-emerald-800">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-stone-900 m-0">Recent Study Sessions</h2>
                <p className="text-xs sm:text-sm text-stone-500 font-normal">Live history of your recent study materials.</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('workspace')}
              className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 transition"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {analytics.sessions.map((sess) => (
              <div
                key={sess.id}
                onClick={() => handleSessionClick(sess)}
                className="flex items-center justify-between p-4 sm:p-4.5 rounded-2xl border border-stone-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold tracking-tight text-stone-900">{sess.deckTitle}</h4>
                    <p className="text-xs sm:text-sm text-stone-500 font-medium">
                      {sess.type} · {sess.pageCount || 15} pages
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3.5">
                  <span className={`text-xs font-bold tracking-wide uppercase px-3 py-1 rounded-full ${
                    sess.toolUsed === 'Summary + Quiz' ? 'bg-cyan-100 text-cyan-800' :
                    sess.toolUsed === 'Flashcards' ? 'bg-sky-100 text-sky-800' :
                    sess.toolUsed === 'AI Tutor' ? 'bg-teal-100 text-teal-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {sess.toolUsed}
                  </span>
                  <span className="text-xs sm:text-sm text-stone-400 font-semibold font-sans">
                    {sess.relativeTime}
                  </span>
                  <MoreVertical className="w-4 h-4 text-stone-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Your Learning Progress (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-stone-900 m-0">Your Learning Progress</h2>
                  <p className="text-xs sm:text-sm text-stone-500 font-normal">Real-time study metrics & active effort.</p>
                </div>
              </div>

              {/* Timeframe selector dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 transition shadow-2xs"
                >
                  <span>{timeframeLabels[timeframe]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>
                {isFilterOpen && (
                  <div className="absolute right-0 mt-1 w-32 bg-white border border-stone-200 rounded-xl shadow-lg p-1 z-30 animate-in fade-in duration-100">
                    {(['today', 'week', 'all'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setTimeframe(t);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                          timeframe === t ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        {timeframeLabels[t]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 py-3">
              {/* Dynamic Circular Donut Progress Ring */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="text-stone-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Dynamic Progress Arc */}
                  <path
                    className="text-cyan-500 transition-all duration-700 ease-out"
                    strokeDasharray={`${analytics.studyGoalPercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900 leading-none">
                    {analytics.studyGoalPercent}%
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400 mt-1.5">
                    Study Goal
                  </span>
                </div>
              </div>

              {/* Dynamic 3 Metric Pills */}
              <div className="grid grid-cols-1 gap-2.5 flex-1">
                <div className="flex items-center gap-2.5 text-stone-700">
                  <BookOpen className="w-4.5 h-4.5 text-emerald-600" />
                  <span className="font-extrabold text-base sm:text-lg text-stone-900">{analytics.uniqueTopics}</span>
                  <span className="text-stone-500 text-xs sm:text-sm font-medium">Topics</span>
                </div>
                <div className="flex items-center gap-2.5 text-stone-700">
                  <Target className="w-4.5 h-4.5 text-cyan-600" />
                  <span className="font-extrabold text-base sm:text-lg text-stone-900">{analytics.totalQuestions}</span>
                  <span className="text-stone-500 text-xs sm:text-sm font-medium">Questions</span>
                </div>
                <div className="flex items-center gap-2.5 text-stone-700">
                  <Flame className="w-4.5 h-4.5 text-amber-500" />
                  <span className="font-extrabold text-base sm:text-lg text-stone-900">{analytics.streak}</span>
                  <span className="text-stone-500 text-xs sm:text-sm font-medium">Day Streak</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Weekly Bar Chart based on real activities */}
          <div className="pt-4 border-t border-stone-100">
            <div className="flex items-end justify-between h-16 px-2">
              {analytics.weeklyChart.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 group cursor-pointer" title={`${item.day}: ${item.count} study actions`}>
                  <div className="w-5 bg-emerald-100 rounded-full h-11 flex items-end overflow-hidden group-hover:bg-emerald-200 transition">
                    <div
                      style={{ height: item.heightPct }}
                      className={`w-full rounded-full transition-all duration-500 ${
                        item.isToday ? 'bg-emerald-600 shadow-xs' : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                  <span className={`text-xs font-semibold tracking-wide ${
                    item.isToday ? 'text-emerald-700 font-bold' : 'text-stone-400'
                  }`}>
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
