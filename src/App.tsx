import { useState } from 'react';
import type { StudyPackage } from './types/study';
import { DEEP_LEARNING_DECK, OPERATING_SYSTEMS_DECK } from './services/demoData';
import { Header } from './components/Header';
import { Sidebar, type TabType } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { InputWorkspace } from './components/InputWorkspace';
import { SummaryView } from './components/SummaryView';
import { FlashcardDeck } from './components/FlashcardDeck';
import { QuizRunner } from './components/QuizRunner';
import { MindMapView } from './components/MindMapView';
import { SocraticTutor } from './components/SocraticTutor';
import { PresentationSlides } from './components/PresentationSlides';
import { SettingsView } from './components/SettingsView';

export function App() {
  const [decks, setDecks] = useState<StudyPackage[]>([DEEP_LEARNING_DECK, OPERATING_SYSTEMS_DECK]);
  const [currentDeck, setCurrentDeck] = useState<StudyPackage>(DEEP_LEARNING_DECK);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [quizScore, setQuizScore] = useState<{ score: number; total: number } | null>(null);

  const handleStudyPackageGenerated = (pkg: StudyPackage) => {
    setDecks(prev => [pkg, ...prev.filter(d => d.title !== pkg.title)]);
    setCurrentDeck(pkg);
    setQuizScore(null);
    setActiveTab('summary');
  };

  const handleSelectSampleDeck = (deck: StudyPackage) => {
    setDecks(prev => prev.some(d => d.title === deck.title) ? prev : [deck, ...prev]);
    setCurrentDeck(deck);
    setQuizScore(null);
  };

  return (
    <div className="min-h-screen bg-[#f0faf4] text-stone-900 flex font-sans antialiased">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        deck={currentDeck}
        quizScore={quizScore}
      />

      {/* Main Body Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          currentDeck={currentDeck}
          decks={decks}
          onSelectDeck={handleSelectSampleDeck}
          onNewSession={() => setActiveTab('workspace')}
        />

        {/* Dynamic Content Viewport */}
        <main className="flex-1 px-6 sm:px-8 py-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectDeck={handleSelectSampleDeck}
              currentDeck={currentDeck}
            />
          )}

          {activeTab === 'workspace' && (
            <InputWorkspace
              onStudyPackageGenerated={handleStudyPackageGenerated}
              onSelectSampleDeck={handleSelectSampleDeck}
            />
          )}

          {activeTab === 'summary' && (
            <SummaryView key={currentDeck.title} deck={currentDeck} />
          )}

          {activeTab === 'flashcards' && (
            <FlashcardDeck
              key={currentDeck.title}
              cards={currentDeck.flashcards}
              deckTitle={currentDeck.title}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizRunner
              key={currentDeck.title}
              questions={currentDeck.quiz}
              deckTitle={currentDeck.title}
              onScoreUpdate={(score, total) => setQuizScore({ score, total })}
            />
          )}

          {activeTab === 'mindmap' && (
            <MindMapView key={currentDeck.title} rootNode={currentDeck.mindMap} />
          )}

          {activeTab === 'tutor' && (
            <SocraticTutor key={currentDeck.title} deck={currentDeck} />
          )}

          {activeTab === 'settings' && (
            <SettingsView />
          )}

          {activeTab === 'presentation' && (
            <PresentationSlides />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
