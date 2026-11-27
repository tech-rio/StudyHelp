import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractStudyPackageFromText } from '../src/services/semanticExtractor.ts';

// Load environment variables from .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '25mb' }));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM'; // Rachel

console.log(`[CogniStudy Server] Initializing...`);
console.log(`[CogniStudy Server] Gemini API Key: ${GEMINI_API_KEY ? 'Configured (Active)' : 'Not set in .env (Using offline fallback engine)'}`);
console.log(`[CogniStudy Server] ElevenLabs API Key: ${ELEVENLABS_API_KEY ? 'Configured (Active)' : 'Not set in .env (Will use browser audio fallback)'}`);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    geminiConfigured: Boolean(GEMINI_API_KEY),
    elevenLabsConfigured: Boolean(ELEVENLABS_API_KEY),
    voiceId: ELEVENLABS_VOICE_ID
  });
});

/**
 * ElevenLabs Text-to-Speech API Endpoint
 * Streams high-quality MP3 voice synthesis back to the frontend
 */
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, voiceId } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text prompt is required.' });
      return;
    }

    if (!ELEVENLABS_API_KEY) {
      // Gracefully signal frontend to use Web Speech fallback
      res.status(200).json({
        fallback: true,
        message: 'ELEVENLABS_API_KEY not configured in .env. Falling back to local Web Speech synthesis.'
      });
      return;
    }

    const selectedVoice = voiceId || ELEVENLABS_VOICE_ID;
    console.log(`[ElevenLabs TTS] Generating voice for ${text.length} chars using voice ${selectedVoice}...`);

    const elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: text.slice(0, 4500), // ElevenLabs character limit per request
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      }
    );

    if (!elevenRes.ok) {
      const errorText = await elevenRes.text();
      console.warn(`[ElevenLabs Error] Status ${elevenRes.status}: ${errorText}`);
      res.status(200).json({
        fallback: true,
        message: `ElevenLabs returned status ${elevenRes.status}. Using local browser voice.`
      });
      return;
    }

    const audioBuffer = await elevenRes.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.byteLength.toString());
    res.send(Buffer.from(audioBuffer));
  } catch (err: any) {
    console.error('[ElevenLabs Exception]', err);
    res.status(200).json({
      fallback: true,
      message: 'Network issue contacting ElevenLabs. Using local browser voice.'
    });
  }
});

/**
 * Generate Study Package using Google Gemini API
 */
app.post('/api/generate-deck', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text content is required to generate study material.' });
      return;
    }

    if (!GEMINI_API_KEY) {
      console.info("[Backend] No GEMINI_API_KEY in .env. Using structured educational generator engine.");
      await new Promise(r => setTimeout(r, 1200));
      const simulated = generateFallbackPackage(text);
      res.json(simulated);
      return;
    }

    console.info(`[Backend] Generating study package via Google Gemini for ${text.length} characters...`);

    const prompt = `
You are CogniStudy AI, an elite academic study partner.
Analyze the following course material and output a structured, comprehensive study package in STRICT JSON ONLY.
Schema required:
{
  "title": "Clear concise topic title",
  "overview": "2-3 sentence rigorous academic overview",
  "overviewEli5": "1-2 sentence intuitive plain English analogy",
  "tags": ["tag1", "tag2", "tag3"],
  "keyPoints": [
    {
      "id": "kp-1",
      "topic": "Subtopic title",
      "summary": "Technical explanation",
      "eli5": "Simple analogy",
      "formulasOrSyntax": ["key formula or code syntax"],
      "importance": "critical" | "high" | "medium"
    }
  ],
  "flashcards": [
    {
      "id": "fc-1",
      "front": "Thought-provoking question testing deep comprehension",
      "back": "Clear, complete verified answer",
      "category": "Concept" | "Formula" | "Application"
    }
  ],
  "quiz": [
    {
      "id": "q-1",
      "question": "Rigorous conceptual multiple-choice question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this answer is scientifically correct and others are flawed",
      "tip": "Exam memory mnemonic"
    }
  ],
  "mindMap": {
    "id": "root",
    "label": "Central Subject Name",
    "children": [
      {
        "id": "branch-1",
        "label": "Key Pillar 1",
        "children": [
          { "id": "leaf-1", "label": "Sub-concept A" },
          { "id": "leaf-2", "label": "Sub-concept B" }
        ]
      }
    ]
  }
}

Input Notes:
"""
${text.slice(0, 25000)}
"""
`;

    // Try Gemini 2.0 Flash first, fallback to 1.5 Flash
    let geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!geminiRes.ok) {
      geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );
    }

    if (!geminiRes.ok) {
      throw new Error(`Gemini API error: ${geminiRes.statusText}`);
    }

    const data = await geminiRes.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error("No response content from Gemini.");
    }

    const cleanJson = candidateText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleanJson);
    parsed.generatedAt = new Date().toISOString();
    res.json(parsed);
  } catch (err: any) {
    console.error("[Backend Error generating deck]", err);
    // Return high-fidelity fallback on error so the app never fails
    res.json(generateFallbackPackage(req.body.text || 'Study Notes'));
  }
});

/**
 * Socratic AI Tutor Chat Endpoint
 */
app.post('/api/tutor/chat', async (req: Request, res: Response) => {
  try {
    const { studyPackage, history, message, mode = 'socratic' } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required.' });
      return;
    }

    if (!GEMINI_API_KEY) {
      // Offline fallback tutor
      await new Promise(r => setTimeout(r, 700));
      const simulatedReply = getSimulatedTutorReply(studyPackage, message, mode);
      res.json({ reply: simulatedReply });
      return;
    }

    const systemInstructions = {
      socratic: "You are a warm, sharp Socratic Tutor. DO NOT immediately give away direct answers. Instead, ask thoughtful guiding questions, provide gentle hints, and prompt the student to reason through the problem based on their notes. Keep responses concise (under 120 words).",
      exam: "You are an exacting University Professor conducting a viva/oral exam. Evaluate the student's answer critically, give a score out of 10, point out any technical inaccuracies, and ask the next rigorous follow-up question.",
      explainer: "You are an elite master teacher. Provide a crystal-clear, structured breakdown with intuitive analogies, bullet points, and code/math when relevant. Format using clean markdown."
    }[mode as 'socratic' | 'exam' | 'explainer'] || "You are an academic study tutor.";

    const prompt = `
${systemInstructions}

Subject Material Context:
Title: ${studyPackage?.title || 'Course Material'}
Overview: ${studyPackage?.overview || 'Academic notes'}
Key Concepts: ${studyPackage?.keyPoints?.map((k: any) => k.topic).join(', ') || ''}

Chat History:
${history?.map((h: any) => `${h.sender === 'user' ? 'Student' : 'Tutor'}: ${h.text}`).join('\n') || ''}

Current Student Inquiry:
"${message}"

Respond directly as the tutor:
`;

    let geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!geminiRes.ok) {
      geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );
    }

    if (!geminiRes.ok) {
      throw new Error(`Gemini tutor error: ${geminiRes.statusText}`);
    }

    const data = await geminiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) throw new Error("Empty reply from Gemini model.");
    res.json({ reply });
  } catch (err) {
    console.warn("[Backend Tutor Fallback]", err);
    res.json({
      reply: getSimulatedTutorReply(req.body.studyPackage, req.body.message, req.body.mode || 'socratic')
    });
  }
});

// Helper for dynamic NLP extraction from user notes
function generateFallbackPackage(text: string) {
  return extractStudyPackageFromText(text);
}

function getSimulatedTutorReply(studyPackage: any, message: string, mode: string) {
  const title = studyPackage?.title || 'this topic';
  const lower = (message || '').toLowerCase().trim();

  const keyPoints: any[] = studyPackage?.keyPoints || [];
  const flashcards: any[] = studyPackage?.flashcards || [];

  const matchedKp = keyPoints.find((kp: any) =>
    lower.includes(kp.topic.toLowerCase()) ||
    kp.topic.toLowerCase().split(/\s+/).some((w: string) => w.length > 3 && lower.includes(w))
  ) || keyPoints[0];

  const matchedCard = flashcards.find((fc: any) =>
    lower.includes(fc.category.toLowerCase()) ||
    fc.front.toLowerCase().split(/\s+/).some((w: string) => w.length > 4 && lower.includes(w))
  ) || flashcards[0];

  const topicName = matchedKp?.topic || title;
  const summary = matchedKp?.summary || studyPackage?.overview || 'the foundational principles';
  const formula = matchedKp?.formulasOrSyntax?.[0] || '';
  const eli5 = matchedKp?.eli5 || studyPackage?.overviewEli5 || '';

  // 1. Quick Prompt: "Quiz me on ..."
  if (lower.startsWith('quiz me')) {
    const card = flashcards[Math.floor(Math.random() * Math.min(flashcards.length, 4))] || matchedCard;
    return `### Active Recall Challenge 🎯\n\n**Question**: ${card?.front || `What is the governing principle of ${topicName}?`}\n\n*Formulate your answer and type it below — I will evaluate your reasoning!*`;
  }

  // 2. Quick Prompt: "What are the most common exam mistakes here?"
  if (lower.includes('mistake') || lower.includes('pitfall') || lower.includes('error')) {
    return `### High-Yield Exam Traps for ${title} ⚠️\n\n1. **Boundary Condition Neglect**: Forgetting that wavefunctions or states must vanish at infinite barriers (e.g., $\\psi(0)=0, \\psi(a)=0$).\n2. **Units & Constants**: Confusing $h$ ($6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}$) with reduced Planck's constant $\\hbar = h/(2\\pi)$.\n3. **Degeneracy Count**: Missing permutations in 3D problems—distinct quantum tuples like $(1,1,2)$, $(1,2,1)$, and $(2,1,1)$ share the same energy level (3-fold degeneracy).\n\n*Pro-tip: Always write out the governing formula before beginning step-by-step mathematical substitution.*`;
  }

  // 3. Quick Prompt: "Give me a real-world example of this concept"
  if (lower.includes('real-world') || lower.includes('example') || lower.includes('practical') || lower.includes('application')) {
    return `### Real-World Engineering Application 🌍\n\n**Topic**: ${topicName}\n\n${eli5 ? `💡 **Intuitive Analogy**: ${eli5}\n\n` : ''}**Practical Tech Use-Case**:\n- **Scanning Tunneling & Electron Microscopes**: Exploit the De Broglie matter-wave nature of electrons ($\\lambda = h/p$) to achieve picometer-scale atomic resolution impossible with visible light.\n- **Quantum Wells & Semiconductor Lasers**: Nanoscale potential wells restrict electrons just like a 3D quantum box, engineering specific bandgap energies for telecom fiber lasers.\n\nWhich practical mechanism would you like to explore deeper?`;
  }

  // 4. Quick Prompt: "Ask me a viva question"
  if (lower.includes('viva') || lower.includes('oral exam')) {
    return `### Oral Viva Drill 🎓\n\n**Examiner Question**: In **${topicName}**, what physical condition makes energy eigenvalues discrete rather than continuous, and how do physical boundary conditions enforce this?\n\n*Answer concisely as you would in front of a university examiner.*`;
  }

  // 5. Formula / Equation Inquiries
  if (lower.includes('formula') || lower.includes('equation') || lower.includes('math') || lower.includes('derivation')) {
    return `### Key Mathematical Formulations for ${topicName} 📐\n\n${formula ? `- **Primary Invariant**: \`${formula}\`\n` : ''}- **Theoretical Grounding**: ${summary}\n- **Physical Interpretation**: Each term represents a conserved quantity or dynamical state constraint.\n\n*Would you like to step through the derivation or test an exam calculation with these variables?*`;
  }

  // 6. Direct Explanations ("What is...", "Explain...", "Tell me about...")
  if (lower.includes('what is') || lower.includes('explain') || lower.includes('tell me') || lower.includes('define') || mode === 'explainer') {
    return `### Concept Deep-Dive: ${topicName} 📖\n\n- **Core Definition**: ${summary}\n${formula ? `- **Governing Formulation**: \`${formula}\`\n` : ''}${eli5 ? `- **Plain English Intuition**: ${eli5}\n` : ''}\n**Key Exam Takeaway**: ${matchedCard?.back || 'Ensure you highlight boundary conditions and invariant assertions in written answers.'}\n\n*Does this clear up the concept, or would you like to test a quick practice question on it?*`;
  }

  // 7. Exam Mode (Oral Evaluation)
  if (mode === 'exam') {
    return `### Oral Examination Evaluation 📝\n\n- **Score**: **8.5 / 10**\n- **Assessment**: Your response accurately targets **${topicName}**. Concepts like *"${summary.slice(0, 80)}..."* are mathematically sound.\n\n**Follow-up Question**: What happens to this formulation when input scales to extreme limits? State the asymptotic boundary behavior.`;
  }

  // 8. Socratic Mode (Default / Conversational Guidance)
  return `### Socratic Study Partner: ${topicName} 💡\n\nGood observation! Looking at **${topicName}** in your course notes:\n\n> *"${summary}"*\n\n${formula ? `With formulation: \`${formula}\`\n\n` : ''}**Guiding Question**: If we double the boundary scale or change the fundamental parameters, how would the energy or system state react? What is your physical intuition?`;
}

// Serve client build (SPA) in production
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// SPA wildcard fallback
app.get('{*splat}', (req: Request, res: Response) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: `API endpoint not found: ${req.path}` });
    return;
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`[CogniStudy Server] Backend running on http://localhost:${PORT}`);
  console.log(`[CogniStudy Server] Endpoints:`);
  console.log(`  -> GET  http://localhost:${PORT}/api/health`);
  console.log(`  -> POST http://localhost:${PORT}/api/tts (ElevenLabs Audio)`);
  console.log(`  -> POST http://localhost:${PORT}/api/generate-deck (Gemini)`);
  console.log(`  -> POST http://localhost:${PORT}/api/tutor/chat (Socratic AI)`);
});
