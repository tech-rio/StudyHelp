import { useState } from 'react';
import type { StudyPackage } from './types/study';
import { DEEP_LEARNING_DECK } from './services/demoData';
import { hasApiKey } from './services/gemini';
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
import { ApiKeyModal } from './components/ApiKeyModal';

export function App() {
  const [currentDeck, setCurrentDeck] = useState<StudyPackage>(DEEP_LEARNING_DECK);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [quizScore, setQuizScore] = useState<{ score: number; total: number } | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [keyConfigured, setKeyConfigured] = useState(() => hasApiKey());

  const handleStudyPackageGenerated = (pkg: StudyPackage) => {
    setCurrentDeck(pkg);
    setQuizScore(null);
    setActiveTab('summary');
  };

  const handleSelectSampleDeck = (deck: StudyPackage) => {
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
          onSelectDeck={handleSelectSampleDeck}
          hasKey={keyConfigured}
          onOpenKeyModal={() => setIsKeyModalOpen(true)}
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

          {activeTab === 'presentation' && (
            <PresentationSlides />
          )}
        </main>
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onKeySaved={() => setKeyConfigured(hasApiKey())}
      />
    </div>
  );
}

export default App;
