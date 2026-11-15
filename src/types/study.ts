export interface KeyPoint {
  id: string;
  topic: string;
  summary: string;
  eli5: string; // Explain like I'm 5
  formulasOrSyntax?: string[];
  importance: 'high' | 'medium' | 'critical';
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  mastery?: 'learning' | 'reviewing' | 'mastered';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tip?: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  description?: string;
  color?: string;
  children?: MindMapNode[];
}

export interface StudyPackage {
  title: string;
  overview: string;
  overviewEli5: string;
  keyPoints: KeyPoint[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  mindMap: MindMapNode;
  tags: string[];
  generatedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  mode?: 'socratic' | 'exam' | 'explainer';
}
