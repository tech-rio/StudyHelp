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
    <div className="min-h-screen bg-[#f2eee5] text-[#26221f] flex flex-col font-sans">
      {/* Top Application Header */}
      <Header
        currentDeck={currentDeck}
        onSelectDeck={handleSelectSampleDeck}
        hasKey={keyConfigured}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
      />

      {/* Main Body Layout with warm parchment borders */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row border-x border-[#ded8cb] bg-[#f7f4ec] shadow-xs">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          deck={currentDeck}
          quizScore={quizScore}
        />

        {/* Dynamic Content Viewport */}
        <main className="flex-1 p-5 sm:p-8 overflow-x-hidden bg-[#f4f0e6]">
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
