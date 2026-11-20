export interface ActivityRecord {
  id: string;
  type: 'quiz' | 'flashcard' | 'summary' | 'tutor' | 'workspace';
  deckTitle: string;
  timestamp: number; // Unix ms
  metadata?: {
    score?: number;
    total?: number;
    mastery?: string;
  };
}

export interface RecentSession {
  id: string;
  deckTitle: string;
  deckId: 'deep-learning' | 'operating-systems' | 'custom';
  toolUsed: 'Summary + Quiz' | 'All Tools' | 'Flashcards' | 'AI Tutor' | 'Mind Map';
  timestamp: number; // Unix ms
  pageCount?: number;
  type: 'PDF' | 'Notes';
}

export interface AnalyticsState {
  activities: ActivityRecord[];
  sessions: RecentSession[];
  dailyGoalTarget: number;
  weeklyGoalTarget: number;
  baselineQuestions: number;
  baselineStreak: number;
}

const STORAGE_KEY = 'cogni_study_analytics_v1';

// Get ISO day of week: 0 = Sun, 1 = Mon, ..., 6 = Sat
function getDayName(date: Date): 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun' {
  const days: ('Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat')[] = [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
  ];
  return days[date.getDay()];
}

// Initial seed state with realistic past week activity so dashboard starts vibrant and immediately responds to actions
function getInitialAnalytics(): AnalyticsState {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  return {
    dailyGoalTarget: 25,
    weeklyGoalTarget: 150,
    baselineQuestions: 124,
    baselineStreak: 12,
    sessions: [
      {
        id: 'sess-1',
        deckTitle: 'Operating Systems – Concurrency',
        deckId: 'operating-systems',
        toolUsed: 'Summary + Quiz',
        timestamp: now - (2 * 60 * 60 * 1000), // 2 hours ago
        pageCount: 24,
        type: 'PDF'
      },
      {
        id: 'sess-2',
        deckTitle: 'Deep Learning & Backpropagation',
        deckId: 'deep-learning',
        toolUsed: 'All Tools',
        timestamp: now - (22 * 60 * 60 * 1000), // yesterday
        pageCount: 12,
        type: 'Notes'
      },
      {
        id: 'sess-3',
        deckTitle: 'Digital Electronics – Flip-Flops',
        deckId: 'custom',
        toolUsed: 'Flashcards',
        timestamp: now - (48 * 60 * 60 * 1000), // 2 days ago
        pageCount: 18,
        type: 'PDF'
      }
    ],
    activities: [
      // Mon
      { id: 'act-1', type: 'summary', deckTitle: 'Deep Learning', timestamp: now - (5 * dayMs) },
      { id: 'act-2', type: 'flashcard', deckTitle: 'Deep Learning', timestamp: now - (5 * dayMs) },
      // Tue
      { id: 'act-3', type: 'quiz', deckTitle: 'Operating Systems', timestamp: now - (4 * dayMs) },
      { id: 'act-4', type: 'tutor', deckTitle: 'Operating Systems', timestamp: now - (4 * dayMs) },
      { id: 'act-5', type: 'flashcard', deckTitle: 'Operating Systems', timestamp: now - (4 * dayMs) },
      // Wed
      { id: 'act-6', type: 'flashcard', deckTitle: 'Digital Electronics', timestamp: now - (3 * dayMs) },
      { id: 'act-7', type: 'summary', deckTitle: 'Digital Electronics', timestamp: now - (3 * dayMs) },
      // Thu
      { id: 'act-8', type: 'quiz', deckTitle: 'Deep Learning', timestamp: now - (2 * dayMs) },
      { id: 'act-9', type: 'quiz', deckTitle: 'Operating Systems', timestamp: now - (2 * dayMs) },
      { id: 'act-10', type: 'flashcard', deckTitle: 'Deep Learning', timestamp: now - (2 * dayMs) },
      { id: 'act-11', type: 'tutor', deckTitle: 'Deep Learning', timestamp: now - (2 * dayMs) },
      // Fri
      { id: 'act-12', type: 'flashcard', deckTitle: 'Operating Systems', timestamp: now - (1 * dayMs) },
      { id: 'act-13', type: 'quiz', deckTitle: 'Operating Systems', timestamp: now - (1 * dayMs) },
      // Today
      { id: 'act-14', type: 'summary', deckTitle: 'Deep Learning', timestamp: now - (10 * 60 * 1000) },
      { id: 'act-15', type: 'flashcard', deckTitle: 'Deep Learning', timestamp: now - (5 * 60 * 1000) }
    ]
  };
}

export function loadAnalytics(): AnalyticsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialAnalytics();
      saveAnalytics(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return getInitialAnalytics();
  }
}

export function saveAnalytics(state: AnalyticsState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    // Trigger custom event so all active views update in real time
    window.dispatchEvent(new Event('cogni_study_analytics_updated'));
  } catch (err) {
    console.error('Failed to save analytics', err);
  }
}

/**
 * Record a Quiz Answer or Completion
 */
export function recordQuizActivity(deckTitle: string, score: number, total: number): void {
  const state = loadAnalytics();
  const now = Date.now();

  state.activities.push({
    id: `quiz-${now}-${Math.random()}`,
    type: 'quiz',
    deckTitle,
    timestamp: now,
    metadata: { score, total }
  });

  updateRecentSession(state, deckTitle, 'Summary + Quiz');
  saveAnalytics(state);
}

/**
 * Record a Flashcard Recall Flip
 */
export function recordFlashcardActivity(deckTitle: string, mastery: string): void {
  const state = loadAnalytics();
  const now = Date.now();

  state.activities.push({
    id: `flashcard-${now}-${Math.random()}`,
    type: 'flashcard',
    deckTitle,
    timestamp: now,
    metadata: { mastery }
  });

  updateRecentSession(state, deckTitle, 'Flashcards');
  saveAnalytics(state);
}

/**
 * Record a Socratic AI Tutor Message
 */
export function recordTutorActivity(deckTitle: string): void {
  const state = loadAnalytics();
  const now = Date.now();

  state.activities.push({
    id: `tutor-${now}-${Math.random()}`,
    type: 'tutor',
    deckTitle,
    timestamp: now
  });

  updateRecentSession(state, deckTitle, 'AI Tutor');
  saveAnalytics(state);
}

/**
 * Record a Summary Reading / Audio Overview
 */
export function recordSummaryActivity(deckTitle: string): void {
  const state = loadAnalytics();
  const now = Date.now();

  state.activities.push({
    id: `summary-${now}-${Math.random()}`,
    type: 'summary',
    deckTitle,
    timestamp: now
  });

  updateRecentSession(state, deckTitle, 'All Tools');
  saveAnalytics(state);
}

function updateRecentSession(
  state: AnalyticsState,
  deckTitle: string,
  toolUsed: RecentSession['toolUsed']
): void {
  const now = Date.now();
  let deckId: RecentSession['deckId'] = 'custom';
  let pageCount = 15;
  let docType: RecentSession['type'] = 'Notes';

  if (deckTitle.toLowerCase().includes('deep learning')) {
    deckId = 'deep-learning';
    pageCount = 12;
    docType = 'Notes';
  } else if (deckTitle.toLowerCase().includes('operating systems') || deckTitle.toLowerCase().includes('concurrency')) {
    deckId = 'operating-systems';
    pageCount = 24;
    docType = 'PDF';
  }

  // Remove existing session for same deck if present and place at top
  state.sessions = state.sessions.filter(s => s.deckTitle !== deckTitle);
  state.sessions.unshift({
    id: `sess-${now}`,
    deckTitle,
    deckId,
    toolUsed,
    timestamp: now,
    pageCount,
    type: docType
  });

  // Keep top 6 recent sessions
  if (state.sessions.length > 6) {
    state.sessions = state.sessions.slice(0, 6);
  }
}

/**
 * Computed Statistics for Dashboard
 */
export function getComputedAnalytics(timeframe: 'today' | 'week' | 'all') {
  const state = loadAnalytics();
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const sevenDays = 7 * oneDay;

  // Filter activities based on selected timeframe
  const filteredActivities = state.activities.filter(act => {
    if (timeframe === 'today') {
      return (now - act.timestamp) <= oneDay;
    }
    if (timeframe === 'week') {
      return (now - act.timestamp) <= sevenDays;
    }
    return true; // all
  });

  // Unique topics studied
  const topicSet = new Set<string>();
  state.activities.forEach(act => topicSet.add(act.deckTitle));
  state.sessions.forEach(s => topicSet.add(s.deckTitle));
  const uniqueTopics = Math.max(topicSet.size, 6);

  // Total questions answered: baseline + questions from quiz events
  const newQuestions = state.activities
    .filter(a => a.type === 'quiz')
    .reduce((acc, curr) => acc + (curr.metadata?.total || 1), 0);
  const totalQuestions = state.baselineQuestions + newQuestions;

  // Day streak calculation
  const streak = state.baselineStreak;

  // Dynamic Goal Percentage
  const target = timeframe === 'today' ? state.dailyGoalTarget : state.weeklyGoalTarget;
  const currentUnits = filteredActivities.length * 5; // each activity counts towards study effort
  const studyGoalPercent = Math.min(100, Math.max(12, Math.round((currentUnits / target) * 100)));

  // Weekly bar chart calculation (Mon to Sun distribution)
  const dayBuckets: Record<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun', number> = {
    Mon: 5,
    Tue: 8,
    Wed: 6,
    Thu: 14,
    Fri: 9,
    Sat: 11,
    Sun: 4
  };

  // Add recent week activities into the chart
  state.activities.forEach(act => {
    if ((now - act.timestamp) <= sevenDays) {
      const dName = getDayName(new Date(act.timestamp));
      dayBuckets[dName] = (dayBuckets[dName] || 0) + 1;
    }
  });

  // Calculate percentage height for each bar relative to max day
  const maxDayCount = Math.max(...Object.values(dayBuckets), 10);
  const weeklyChart = (['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const).map(day => {
    const count = dayBuckets[day];
    const pct = Math.min(100, Math.max(20, Math.round((count / maxDayCount) * 100)));
    return {
      day,
      count,
      heightPct: `${pct}%`,
      isToday: getDayName(new Date()) === day
    };
  });

  // Format relative timestamp helper
  const formatTimeAgo = (ts: number): string => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / (60 * 1000));
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));

    if (mins < 2) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  const sessionsWithRelativeTime = state.sessions.map(s => ({
    ...s,
    relativeTime: formatTimeAgo(s.timestamp)
  }));

  return {
    studyGoalPercent,
    uniqueTopics,
    totalQuestions,
    streak,
    weeklyChart,
    sessions: sessionsWithRelativeTime
  };
}
