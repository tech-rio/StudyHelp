# 🎓 CogniStudy AI — Autonomous Adaptive Study & Exam Intelligence Agent

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/tech-rio/StudyHelp)

An end-to-end, full-stack AI study assistant application built with **React 19, Express 5, TypeScript, Vite, Tailwind CSS, Google Gemini API, ElevenLabs Neural Voice, and PDF.js**. Designed for student academic mastery and high-yield presentation evaluation.

---

## 🚀 Quick Start (Run Locally)

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open your browser at: `http://127.0.0.1:5173/`

3. **(Optional) Add Gemini API Key:**
   - Click the **"Demo Mode / Gemini Live"** button in the top right header.
   - Enter your Google Gemini API Key (`AIzaSy...`).
   - *Note:* The app is fully functional **offline** with high-fidelity pre-packaged decks (Deep Learning & Operating Systems) so your live presentation will never fail even if internet connectivity drops!

---

## 🌟 Core Architecture & Key Modules

| Module | Description | Educational Value |
| :--- | :--- | :--- |
| **📥 Input & Notes Hub** | Upload PDFs, TXTs, or paste raw lecture notes. Client-side extraction via PDF.js. | Ingests dense course materials instantly without backend latency. |
| **📖 Smart Summary & ELI5** | Executive high-yield summary with mathematical formulas, plus an **"Explain Like I'm 5" (ELI5)** toggle. Includes built-in **NotebookLM-style Audio Overview** (Text-to-Speech). | Simplifies complex technical jargon into intuitive real-world analogies. |
| **🃏 3D Active-Recall Cards** | Interactive 3D flip cards with spaced repetition ratings (*Hard, Good, Mastered*) and keyboard shortcut navigation. | Solves the "illusion of competence" through active retrieval practice. |
| **📝 Adaptive Exam Quiz** | Dynamic multiple-choice questions with instant correct/incorrect feedback, detailed rationale, and celebratory confetti. | Simulates real exam conditions with immediate pedagogical reinforcement. |
| **🧠 Concept Mind Map** | Hierarchical visual concept tree showing how architecture, optimization, and challenges connect. Includes interactive inspector. | Provides holistic spatial understanding of interconnected syllabus topics. |
| **💬 Socratic AI Tutor** | Conversational tutor grounded directly in the document with 3 modes: *Socratic Guide*, *Viva Oral Exam Drill*, and *Direct Explainer*. | Guides students through step-by-step reasoning rather than spoon-feeding answers. |
| **📊 Presentation Slides** | Built-in 8-slide presentation deck with slide-by-slide **Speaker Script & Timing Notes** (5–7 minutes). | Ready for immediate classroom presentation with zero extra prep. |

---

## ⏱️ 5–7 Minute Presentation & Demo Playbook

| Time | Slide / Activity | What to Say / Do |
| :--- | :--- | :--- |
| **0:00 – 0:45** | **Slide 1: Title & Problem** | Introduce CogniStudy AI and explain the core thesis: passive reading leads to low exam retention. |
| **0:45 – 1:30** | **Slide 2 & 3: Problem & Solution** | Highlight how students waste hours making notes instead of practicing active recall. Introduce our 4-pillar multi-modal synthesis. |
| **1:30 – 2:30** | **Slide 4 & 5: Tech Stack & Architecture** | Explain the pipeline: PDF.js ingestion $\rightarrow$ Gemini API structured JSON schema $\rightarrow$ React 19 / Tailwind UI. |
| **2:30 – 4:30** | **LIVE WORKING DEMO** | 1. Open the app at `http://127.0.0.1:5173/`<br>2. Click **"🔥 Deep Learning"** sample deck.<br>3. Toggle the **"Explain Like I'm 5"** button and play the **Audio Overview**.<br>4. Switch to **Flashcards**, press `Space` to flip, and rate mastery.<br>5. Take a question on the **Adaptive Quiz** to showcase instant feedback and confetti.<br>6. Ask the **Socratic Tutor** in *Viva Oral Exam Mode*. |
| **4:30 – 5:30** | **Slide 6 & 8: Impact & Wrap-up** | Conclude with measurable impact (70% reduction in prep time) and invite Q&A. |

---

## 🛠️ Tech Stack
- **Framework:** React 19 with Vite & TypeScript
- **Styling:** Tailwind CSS (v4) with custom 3D transform utilities
- **Icons:** Lucide React
- **Visuals:** Canvas Confetti & SVG Concept Trees
- **AI Engine:** Google Gemini API (`gemini-2.0-flash` & `gemini-1.5-flash`)
- **Speech Synthesis:** HTML5 Web Speech API
- **Document Processing:** PDF.js (`pdfjs-dist`)
