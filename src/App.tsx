import { useState } from 'react';
import type { StudyPackage } from './types/study';
import { DEEP_LEARNING_DECK } from './services/demoData';
import { hasApiKey } from './services/gemini';
import { Header } from './components/Header';
import { Sidebar, type TabType } from './components/Sidebar';
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
  const [activeTab, setActiveTab] = useState<TabType>('summary');
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
    setActiveTab('summary');
  };

  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Application Header */}
      <Header
        currentDeck={currentDeck}
        onSelectDeck={handleSelectSampleDeck}
        hasKey={keyConfigured}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
      />

      {/* Main Body Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          deck={currentDeck}
          quizScore={quizScore}
        />

        {/* Dynamic Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
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
            <FlashcardDeck key={currentDeck.title} cards={currentDeck.flashcards} />
          )}

          {activeTab === 'quiz' && (
            <QuizRunner
              key={currentDeck.title}
              questions={currentDeck.quiz}
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
