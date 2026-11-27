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

    const geminiRes = await fetch(
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
      throw new Error(`Gemini tutor error: ${geminiRes.statusText}`);
    }

    const data = await geminiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Let's review the core definition again. How would you describe the basic input and output?";
    res.json({ reply });
  } catch (err) {
    console.error("[Backend Tutor Error]", err);
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
  const lower = message.toLowerCase();

  const matchingKeyPoint = studyPackage?.keyPoints?.find((kp: any) =>
    lower.includes(kp.topic.toLowerCase()) ||
    kp.summary.toLowerCase().split(' ').some((w: string) => w.length > 4 && lower.includes(w))
  ) || studyPackage?.keyPoints?.[0];

  const matchingCard = studyPackage?.flashcards?.find((fc: any) =>
    lower.includes(fc.category.toLowerCase()) ||
    fc.front.toLowerCase().split(' ').some((w: string) => w.length > 5 && lower.includes(w))
  );

  const conceptTopic = matchingKeyPoint?.topic || title;
  const conceptSummary = matchingKeyPoint?.summary || studyPackage?.overview || 'the foundational principles';

  if (mode === 'socratic') {
    if (lower.includes('why') || lower.includes('how')) {
      return `That's a key inquiry in **${conceptTopic}**! Let's reason through it step-by-step:\n\nFrom your study material: *"${conceptSummary}"*.\n\nWhat would you predict happens if the primary boundary conditions are modified? How does that impact the overall system response?`;
    }
    return `Great topic to explore. Before jumping to formulas for **${conceptTopic}**, how would you state its governing rule in your own words based on your uploaded notes?`;
  }

  if (mode === 'exam') {
    return `### Oral Viva Evaluation: **8.5/10**\n\nYour query addresses the core mechanics of **${conceptTopic}**.\n- **Technical Invariant**: *${conceptSummary}*\n\n**Examiner Follow-up Question**: What specific failure mode or edge case occurs if these boundary constraints are violated, and how is it mitigated?`;
  }

  return `### Concept Breakdown: ${conceptTopic}\n\n1. **Core Principle**: ${conceptSummary}\n2. **Intuitive Model**: ${matchingKeyPoint?.eli5 || studyPackage?.overviewEli5 || 'Understanding this core concept makes exam derivation direct.'}\n3. **Key Formulation / Note**: ${matchingKeyPoint?.formulasOrSyntax?.[0] ? `\`${matchingKeyPoint.formulasOrSyntax[0]}\`` : (matchingCard?.back || 'Always verify boundary conditions in your written answer.')}\n\nWhat specific part of this concept would you like to explore deeper?`;
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
