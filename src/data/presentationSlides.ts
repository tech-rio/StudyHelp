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
    title: "CogniStudy",
    subtitle: "A Practical Study Assistant for Course Notes & Exam Prep",
    badge: "Course Project",
    timing: "0:00 - 0:45 (45s)",
    points: [
      {
        title: "The Project",
        desc: "An individual project built for the course to solve a real student problem: studying dense materials effectively."
      },
      {
        title: "The Goal",
        desc: "Turn passive lecture slides and PDFs into active study tools: flashcards, self-quizzing, and clear explanations."
      },
      {
        title: "How It Works",
        desc: "Parses notes, extracts key ideas and formulas, writes practice questions with explanations, and provides interactive flashcards."
      }
    ],
    highlightBox: "Built to replace passive re-reading with active recall and practice questions.",
    speakerScript: "Good morning everyone. Today I'm presenting CogniStudy — a practical study assistant designed to solve a problem every student faces: information overload and passive studying. Instead of reading through 80 slides repeatedly, this tool turns notes into flashcards, practice questions, and plain-English summaries."
  },
  {
    number: 2,
    title: "The Problem",
    subtitle: "Passive Reading and Exam Anxiety",
    badge: "The Problem",
    timing: "0:45 - 1:30 (45s)",
    points: [
      {
        title: "1. Information Overload",
        desc: "Textbooks and course slides are packed with dense technical jargon, making it hard to identify what matters most."
      },
      {
        title: "2. The Illusion of Knowing",
        desc: "Re-reading slides feels productive, but research shows it leads to poor retention when tested in an actual exam."
      },
      {
        title: "3. Making Study Aids Takes Too Long",
        desc: "Writing flashcards and practice quizzes by hand is great for retention, but takes hours students don't have."
      }
    ],
    highlightBox: "Active recall and self-testing improve long-term retention significantly compared to passive highlighting.",
    speakerScript: "Most students study by highlighting slides and re-reading notes. The problem is that re-reading gives you a false sense of security — you recognize the terms, but you struggle to explain them on a test. Creating good flashcards and practice tests by hand works wonders, but it takes hours that most students don't have before exam week."
  },
  {
    number: 3,
    title: "The Solution",
    subtitle: "From Raw Notes to Active Practice",
    badge: "Our Approach",
    timing: "1:30 - 2:15 (45s)",
    points: [
      {
        title: "Upload Any Notes",
        desc: "Drop in lecture PDFs, slide exports, or copy-paste text directly in the browser."
      },
      {
        title: "High-Yield Summaries with Plain-English Mode",
        desc: "Read the full academic summary with formulas, or toggle 'Plain English' to get a simple, everyday analogy."
      },
      {
        title: "Active Practice Tools",
        desc: "Interactive 3D flashcards, self-grading spaced repetition, multiple choice quizzes with explanations, and an oral exam tutor."
      }
    ],
    highlightBox: "A focused study companion that helps you test yourself before your professor tests you.",
    speakerScript: "CogniStudy takes your raw lecture notes and immediately generates practical study tools: a structured summary with key formulas, a 'Plain English' toggle for tricky concepts, interactive flashcards with spaced repetition, and practice quizzes that explain why each option is right or wrong."
  },
  {
    number: 4,
    title: "Architecture & Implementation",
    subtitle: "How It Works Under the Hood",
    badge: "Architecture",
    timing: "2:15 - 3:00 (45s)",
    points: [
      {
        title: "1. Ingestion Layer",
        desc: "PDF text is parsed locally in the browser using PDF.js with zero server roundtrips and complete privacy."
      },
      {
        title: "2. Analysis & Extraction",
        desc: "Structured prompt pipeline using Google Gemini API to extract key definitions, formulas, flashcards, and quiz items."
      },
      {
        title: "3. Interactive Frontend",
        desc: "Built with React 19, TypeScript, and Tailwind CSS. Features tactile 3D flashcards and browser-native text-to-speech."
      }
    ],
    highlightBox: "Runs fast in the browser and includes offline sample decks so it works anywhere without failing.",
    speakerScript: "Technically, the architecture has three clean parts: First, documents are parsed locally using PDF.js. Second, the text is processed through our structured extraction prompts to produce validated study items. Third, our React frontend renders interactive components — from 3D card flips to text-to-speech audio overviews."
  },
  {
    number: 5,
    title: "Technologies Used",
    subtitle: "Tools and Libraries",
    badge: "Tech Stack",
    timing: "3:00 - 3:45 (45s)",
    points: [
      {
        title: "AI Model",
        desc: "Google Gemini API (gemini-2.0-flash / gemini-1.5-flash) for extraction, structured reasoning, and tutoring."
      },
      {
        title: "Frontend Stack",
        desc: "React 19, TypeScript, Vite, Tailwind CSS, and Lucide icons for a clean, fast light interface."
      },
      {
        title: "Document & Speech APIs",
        desc: "PDF.js for client-side document reading, plus the HTML5 Web Speech API for listening to study summaries aloud."
      }
    ],
    highlightBox: "Simple, lightweight stack chosen for responsiveness and reliability.",
    speakerScript: "For the tech stack: I used Google Gemini as the core model for extraction and conversational tutoring. The application is built with React 19, TypeScript, and Tailwind CSS for a clean, distraction-free interface. We also use PDF.js for parsing and Web Speech API for audio narration."
  },
  {
    number: 6,
    title: "Key Features",
    subtitle: "What Makes It Helpful for Students",
    badge: "Features",
    timing: "3:45 - 4:30 (45s)",
    points: [
      {
        title: "The 'Plain English' Mode",
        desc: "One click translates intimidating formulas and mathematical jargon into intuitive, everyday analogies."
      },
      {
        title: "Self-Testing Flashcards",
        desc: "Active recall cards with spacebar flip, difficulty self-ratings (Hard, Good, Easy), and progress bars."
      },
      {
        title: "Oral Exam Tutor",
        desc: "A conversational tutor that can ask viva-style questions and grade your verbal answers before exams."
      }
    ],
    highlightBox: "Designed around how students actually study before an exam.",
    speakerScript: "Three features make this especially practical: First, the 'Plain English' button which translates complex terms into simple analogies. Second, flashcards with spaced-repetition ratings so you know what to review. And third, our study tutor has an 'Oral Exam' mode that quizzes you viva-style and gives honest feedback."
  },
  {
    number: 7,
    title: "Live Demonstration",
    subtitle: "Testing the Working Application",
    badge: "Live Demo",
    timing: "4:30 - 6:00 (90s)",
    points: [
      {
        title: "1. Notes & Key Ideas",
        desc: "Reviewing the Deep Learning & Backpropagation deck, formulas, and plain-English breakdown."
      },
      {
        title: "2. Audio Narration",
        desc: "Listening to the audio overview for hands-free review."
      },
      {
        title: "3. Flashcard Practice",
        desc: "Flipping cards, testing recall, and rating difficulty."
      },
      {
        title: "4. Practice Quiz & Tutor",
        desc: "Answering an exam question to show instant rationale, followed by a quick viva question from the tutor."
      }
    ],
    highlightBox: "Let's switch over to the running app to see it live.",
    speakerScript: "Now let's switch to the live app. I'll show our pre-loaded Deep Learning notes, test the Plain English switch, flip through the flashcards, solve a practice quiz question, and ask the tutor for an oral exam check."
  },
  {
    number: 8,
    title: "Summary & Questions",
    subtitle: "Wrap-up and Open Discussion",
    badge: "Conclusion",
    timing: "6:00 - 7:00 (60s)",
    points: [
      {
        title: "What Was Built",
        desc: "A fully working individual study tool that bridges raw lecture notes and active exam practice."
      },
      {
        title: "Future Scope",
        desc: "Support for hand-drawn mathematical diagrams, LMS integration (Google Classroom / Canvas), and shared study decks."
      },
      {
        title: "Q&A",
        desc: "Thank you for your time. I'd be happy to answer any questions about the project or implementation!"
      }
    ],
    highlightBox: "CogniStudy — turning dense course notes into practical exam confidence.",
    speakerScript: "To wrap up: CogniStudy helps students spend less time making study materials and more time actually practicing. Thank you for your attention, and I'd be glad to take any questions!"
  }
];
