export interface Slide {
  number: number;
  title: string;
  subtitle: string;
  badge: string;
  points: { title: string; desc: string; icon?: string }[];
  highlightBox?: string;
  speakerScript: string;
  timing: string;
}

export const PRESENTATION_SLIDES: Slide[] = [
  {
    number: 1,
    title: "CogniStudy AI",
    subtitle: "Autonomous Adaptive Study & Exam Intelligence Agent",
    badge: "Final Individual Project",
    timing: "0:00 - 0:45 (45s)",
    points: [
      {
        title: "Presenter & Subject",
        desc: "Individual Project-Based Presentation for Deep Learning & AI Technologies"
      },
      {
        title: "Core Thesis",
        desc: "Transforming passive lecture reading into active recall, automated adaptive quizzes, and Socratic intelligence."
      },
      {
        title: "Key Innovation",
        desc: "Multi-modal pedagogical engine combining structured RAG summarization, 3D spaced repetition, and real-time concept knowledge graphs."
      }
    ],
    highlightBox: "Objective: Move beyond static note-taking. Build a working agent that trains students for exam mastery.",
    speakerScript: "Good morning/afternoon everyone. Today, I am proud to present 'CogniStudy AI' — an autonomous, adaptive study assistant built to solve one of the biggest challenges in higher education: information overload and passive studying."
  },
  {
    number: 2,
    title: "The Problem Statement",
    subtitle: "The Passive Learning Trap & Information Overload",
    badge: "Problem Identification",
    timing: "0:45 - 1:30 (45s)",
    points: [
      {
        title: "1. Cognitive Overload",
        desc: "Dense 100-page textbooks, lengthy research papers, and slide decks overwhelm students with unstructured jargon."
      },
      {
        title: "2. The Illusion of Competence",
        desc: "Passive re-reading and highlighting gives a false sense of mastery without testing active retrieval."
      },
      {
        title: "3. Time Inefficiency",
        desc: "Students spend hours making flashcards and summary sheets manually rather than practicing and retaining concepts."
      }
    ],
    highlightBox: "Learning science proves that Active Recall and Spaced Repetition yield up to 2.5x better retention than passive reading.",
    speakerScript: "Students spend dozens of hours reading slides and highlighting textbooks. But cognitive science shows this creates an 'illusion of competence'—you think you know the material until an exam question tests you on it. Making flashcards and quizzes by hand takes hours that students simply don't have."
  },
  {
    number: 3,
    title: "The Proposed Solution",
    subtitle: "Autonomous Multi-Modal Study Pipeline",
    badge: "Solution Overview",
    timing: "1:30 - 2:15 (45s)",
    points: [
      {
        title: "Instant Multi-Format Ingestion",
        desc: "Accepts PDFs, lecture slide exports, or pasted syllabus notes, parsing them into structured knowledge blocks."
      },
      {
        title: "Dual-Perspective Summarization",
        desc: "Delivers both academic deep-dives with mathematical formulas and instant 'ELI5' (Explain Like I'm 5) intuitive analogies."
      },
      {
        title: "Active Learning Artifacts",
        desc: "Automatically produces 3D flashcards, rigorous MCQs with explanations, and hierarchical visual mind maps."
      }
    ],
    highlightBox: "CogniStudy AI acts as a 24/7 personal tutor that turns raw notes into an interactive training simulator.",
    speakerScript: "My solution is CogniStudy AI. A student uploads any PDF or pastes notes. Within seconds, the AI synthesizes four core learning artifacts: high-yield key takeaways with formulas, interactive 3D flashcards, an adaptive exam quiz with instant rationale, and an interactive concept mind map."
  },
  {
    number: 4,
    title: "System Architecture & Workflow",
    subtitle: "From Unstructured Document to Cognitive Learning Artifacts",
    badge: "Technical Architecture",
    timing: "2:15 - 3:00 (45s)",
    points: [
      {
        title: "Step 1: Document Processing Layer",
        desc: "Client-side PDF.js and text stream normalizers extract clean textual hierarchies without backend server overhead."
      },
      {
        title: "Step 2: AI Reasoning & Schema Synthesis",
        desc: "Prompt pipeline to Google Gemini API (gemini-2.0-flash / 1.5-flash) enforcing strict JSON schema generation."
      },
      {
        title: "Step 3: Interactive Cognitive UI",
        desc: "State-driven React components render 3D CSS transforms, Web Speech API audio synthesis, and visual graph trees."
      }
    ],
    highlightBox: "Architecture highlights: Zero latency bottlenecks, client-side safety, and built-in offline fault-tolerance.",
    speakerScript: "Here is the architectural pipeline: First, documents are parsed client-side using PDF.js. Second, the normalized text feeds into our prompt engineering layer powered by Google Gemini, which generates validated JSON conforming to our strict cognitive schema. Finally, our responsive frontend binds the data to interactive modules."
  },
  {
    number: 5,
    title: "Technologies & Tools Used",
    subtitle: "Modern, Full-Stack AI Application Stack",
    badge: "Tech Stack",
    timing: "3:00 - 3:45 (45s)",
    points: [
      {
        title: "AI Engine",
        desc: "Google Gemini API (gemini-2.0-flash & gemini-1.5-flash) for reasoning, structured JSON generation, and Socratic Q&A."
      },
      {
        title: "Frontend & UI",
        desc: "React 19, Vite, TypeScript, Tailwind CSS, Lucide Icons, and Canvas Confetti for high-performance responsive UI."
      },
      {
        title: "Document & Speech APIs",
        desc: "PDF.js for client-side document parsing; Web Speech API for voice synthesis audio overviews (NotebookLM style)."
      }
    ],
    highlightBox: "All tools align directly with the course technologies: Gemini, Antigravity workflow, and modern web frameworks.",
    speakerScript: "For the tech stack: I utilized Google Gemini API as the primary intelligence model for structured reasoning. The frontend is built using React, TypeScript, Vite, and Tailwind CSS. We also integrated PDF.js for file parsing and the Web Speech API to provide synthetic audio overviews similar to Google's NotebookLM."
  },
  {
    number: 6,
    title: "Core Features & Innovations",
    subtitle: "What Sets CogniStudy AI Apart",
    badge: "Key Capabilities",
    timing: "3:45 - 4:30 (45s)",
    points: [
      {
        title: "1. The 'ELI5' Analogy Toggle",
        desc: "One-click toggle translates complex mathematical jargon (e.g., partial derivatives, vanishing gradients) into intuitive analogies."
      },
      {
        title: "2. 3D Active-Recall Cards with Spaced Repetition",
        desc: "Interactive card flip with self-grading (Hard, Good, Mastered) and progress tracking."
      },
      {
        title: "3. Socratic AI Tutor with 3 Modes",
        desc: "Features Socratic guiding mode, Viva Oral Exam mode, and Direct Explainer mode."
      }
    ],
    highlightBox: "Demo Advantage: Includes 1-Click pre-loaded datasets so live demonstrations never suffer from WiFi drops.",
    speakerScript: "Three unique features set this project apart: First, the ELI5 button which converts dense definitions into simple real-world analogies. Second, the 3D flashcards with spaced repetition tracking. And third, our Socratic AI Tutor which has a dedicated Oral Exam mode to prep students for viva evaluations."
  },
  {
    number: 7,
    title: "Live Demonstration",
    subtitle: "Showcasing the Working Prototype in Real Time",
    badge: "Live Working Demo",
    timing: "4:30 - 6:00 (90s)",
    points: [
      {
        title: "Demo Step 1: Ingestion",
        desc: "Load lecture deck on 'Deep Learning: Neural Networks & Backpropagation'."
      },
      {
        title: "Demo Step 2: Smart Summary & ELI5",
        desc: "Demonstrate formula syntax, ELI5 toggle, and trigger the NotebookLM-style Audio Overview."
      },
      {
        title: "Demo Step 3: Flashcards & Adaptive Quiz",
        desc: "Flip 3D cards, solve a quiz question live, display instant feedback and confetti score."
      },
      {
        title: "Demo Step 4: Socratic Tutor",
        desc: "Ask the tutor a question and demonstrate oral exam viva grading."
      }
    ],
    highlightBox: "Now, let us switch to the live application to see CogniStudy AI in action!",
    speakerScript: "Now I'd like to show you the live working prototype. I will demonstrate loading our Deep Learning study notes, listening to the audio overview, testing ourselves on active recall flashcards, and running a quick exam question."
  },
  {
    number: 8,
    title: "Conclusion & Future Scope",
    subtitle: "Summary, Scalability & Q&A Session",
    badge: "Wrap Up & Questions",
    timing: "6:00 - 7:00 (60s)",
    points: [
      {
        title: "Real-World Impact",
        desc: "Reduces study prep time by up to 70% while improving long-term test performance and conceptual clarity."
      },
      {
        title: "Future Enhancements",
        desc: "Multi-modal diagram drawing recognition, LMS integration (Canvas/Google Classroom), and collaborative study rooms."
      },
      {
        title: "Q&A Session",
        desc: "Thank you for your time. I am now open to questions about the architecture, implementation, or results!"
      }
    ],
    highlightBox: "CogniStudy AI proves how generative AI can be engineered into an empowering daily learning tool.",
    speakerScript: "In conclusion, CogniStudy AI moves us away from passive cramming to true conceptual mastery. Thank you very much for your time and attention, and I am now ready to answer any questions!"
  }
];
