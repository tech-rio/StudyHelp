import { type FC } from 'react';
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
  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-linear-to-r from-[#dcfce7]/90 via-[#e0f7e9]/80 to-[#f0faf4] border border-emerald-100/80 p-7 sm:p-9 overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-xl">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 text-emerald-800 text-xs font-semibold mb-4 shadow-xs border border-emerald-200/60">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Your AI Study Partner</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 leading-tight">
            Study Smarter,<br />Learn Deeper.
          </h1>

          <p className="text-sm text-stone-600 mt-3 max-w-md leading-relaxed font-normal">
            Turn your notes into summaries, flashcards, quizzes, mind maps and more — powered by Gemini AI.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => onNavigate('workspace')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/20 transition-all hover:scale-102 active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>New Study Session</span>
            </button>
            <button
              onClick={() => {
                onSelectDeck(DEEP_LEARNING_DECK);
                onNavigate('summary');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold border border-stone-200 shadow-xs transition-all hover:scale-102 active:scale-98"
            >
              <Play className="w-3.5 h-3.5 fill-stone-800 text-stone-800" />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Summarize Notes */}
        <div
          onClick={() => onNavigate('summary')}
          className="bg-white hover:bg-emerald-50/30 border border-stone-200/80 hover:border-emerald-300 rounded-2xl p-4 cursor-pointer transition-all duration-200 shadow-xs hover:-translate-y-0.5 group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-700 transition">
              Summarize Notes
            </h3>
            <p className="text-[11px] text-stone-500 mt-1 leading-snug">
              Get concise summaries, key concepts & formulas
            </p>
          </div>
        </div>

        {/* Card 2: Flashcards */}
        <div
          onClick={() => onNavigate('flashcards')}
          className="bg-white hover:bg-cyan-50/30 border border-stone-200/80 hover:border-cyan-300 rounded-2xl p-4 cursor-pointer transition-all duration-200 shadow-xs hover:-translate-y-0.5 group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-100/80 text-cyan-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 group-hover:text-cyan-700 transition">
              Flashcards
            </h3>
            <p className="text-[11px] text-stone-500 mt-1 leading-snug">
              Active recall with interactive cards
            </p>
          </div>
        </div>

        {/* Card 3: Adaptive Quiz */}
        <div
          onClick={() => onNavigate('quiz')}
          className="bg-white hover:bg-emerald-50/30 border border-stone-200/80 hover:border-emerald-300 rounded-2xl p-4 cursor-pointer transition-all duration-200 shadow-xs hover:-translate-y-0.5 group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-700 transition">
              Adaptive Quiz
            </h3>
            <p className="text-[11px] text-stone-500 mt-1 leading-snug">
              MCQs, instant scoring and detailed explanations
            </p>
          </div>
        </div>

        {/* Card 4: Mind Map */}
        <div
          onClick={() => onNavigate('mindmap')}
          className="bg-white hover:bg-teal-50/30 border border-stone-200/80 hover:border-teal-300 rounded-2xl p-4 cursor-pointer transition-all duration-200 shadow-xs hover:-translate-y-0.5 group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-teal-100/80 text-teal-700 flex items-center justify-center">
              <GitFork className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 group-hover:text-teal-700 transition">
              Mind Map
            </h3>
            <p className="text-[11px] text-stone-500 mt-1 leading-snug">
              Visual concept tree to connect and remember
            </p>
          </div>
        </div>

        {/* Card 5: AI Tutor */}
        <div
          onClick={() => onNavigate('tutor')}
          className="bg-white hover:bg-cyan-50/30 border border-stone-200/80 hover:border-cyan-300 rounded-2xl p-4 cursor-pointer transition-all duration-200 shadow-xs hover:-translate-y-0.5 group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-100/80 text-cyan-700 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 group-hover:text-cyan-700 transition">
              AI Tutor
            </h3>
            <p className="text-[11px] text-stone-500 mt-1 leading-snug">
              Ask, discuss and learn with a Socratic AI mentor
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Sessions + Progress Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Recent Study Sessions (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-stone-900 m-0">Recent Study Sessions</h2>
                <p className="text-[11px] text-stone-500">Continue where you left off.</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('workspace')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {/* Session 1 */}
            <div
              onClick={() => {
                onSelectDeck(OPERATING_SYSTEMS_DECK);
                onNavigate('summary');
              }}
              className="flex items-center justify-between p-3 rounded-xl border border-stone-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Operating Systems – Concurrency</h4>
                  <p className="text-[11px] text-stone-400">PDF · 24 pages</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
                  Summary + Quiz
                </span>
                <span className="text-[11px] text-stone-400 font-mono">2h ago</span>
                <MoreVertical className="w-3.5 h-3.5 text-stone-400" />
              </div>
            </div>

            {/* Session 2 */}
            <div
              onClick={() => {
                onSelectDeck(DEEP_LEARNING_DECK);
                onNavigate('summary');
              }}
              className="flex items-center justify-between p-3 rounded-xl border border-stone-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Deep Learning & Backpropagation</h4>
                  <p className="text-[11px] text-stone-400">Notes · 12 pages</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  All Tools
                </span>
                <span className="text-[11px] text-stone-400 font-mono">Yesterday</span>
                <MoreVertical className="w-3.5 h-3.5 text-stone-400" />
              </div>
            </div>

            {/* Session 3 */}
            <div
              onClick={() => {
                onSelectDeck(OPERATING_SYSTEMS_DECK);
                onNavigate('flashcards');
              }}
              className="flex items-center justify-between p-3 rounded-xl border border-stone-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Digital Electronics – Flip-Flops</h4>
                  <p className="text-[11px] text-stone-400">PDF · 18 pages</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  Flashcards
                </span>
                <span className="text-[11px] text-stone-400 font-mono">2 days ago</span>
                <MoreVertical className="w-3.5 h-3.5 text-stone-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Your Learning Progress (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
                  <BarChart2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-stone-900 m-0">Your Learning Progress</h2>
                  <p className="text-[11px] text-stone-500">Track your study activity and improvement.</p>
                </div>
              </div>
              <button className="flex items-center gap-1 text-[11px] text-stone-500 font-medium px-2 py-1 rounded-md border border-stone-200 bg-stone-50 hover:bg-stone-100">
                <span>This Week</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>
            </div>

            <div className="flex items-center gap-4 py-2">
              {/* Circular Donut Progress Ring */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="text-stone-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Progress Arc */}
                  <path
                    className="text-cyan-500"
                    strokeDasharray="76, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-base font-extrabold text-stone-900 leading-none">76%</span>
                  <span className="text-[9px] text-stone-400 mt-0.5">Study Goal</span>
                </div>
              </div>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-1 gap-1.5 flex-1 text-xs">
                <div className="flex items-center gap-2 text-stone-700">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-bold text-stone-900">6</span>
                  <span className="text-stone-500 text-[11px]">Topics</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700">
                  <Target className="w-3.5 h-3.5 text-cyan-600" />
                  <span className="font-bold text-stone-900">128</span>
                  <span className="text-stone-500 text-[11px]">Questions</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-bold text-stone-900">12</span>
                  <span className="text-stone-500 text-[11px]">Day Streak</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Weekly Bar Chart */}
          <div className="pt-3 border-t border-stone-100">
            <div className="flex items-end justify-between h-14 px-2">
              {[
                { day: 'Mon', h: '45%' },
                { day: 'Tue', h: '65%' },
                { day: 'Wed', h: '50%' },
                { day: 'Thu', h: '95%' },
                { day: 'Fri', h: '60%' },
                { day: 'Sat', h: '75%' },
                { day: 'Sun', h: '40%' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <div className="w-4 bg-emerald-100 rounded-full h-10 flex items-end overflow-hidden">
                    <div
                      style={{ height: item.h }}
                      className="w-full bg-emerald-500 rounded-full transition-all duration-500"
                    />
                  </div>
                  <span className="text-[9px] text-stone-400 font-medium">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
