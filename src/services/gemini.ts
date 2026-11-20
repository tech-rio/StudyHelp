import type { StudyPackage, ChatMessage } from '../types/study';
import { extractStudyPackageFromText } from './semanticExtractor';

/**
 * Health check with backend
 */
export async function checkBackendHealth(): Promise<{
  status: string;
  geminiConfigured: boolean;
  elevenLabsConfigured: boolean;
  voiceId?: string;
}> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Backend health check failed');
    return await res.json();
  } catch {
    return {
      status: 'offline',
      geminiConfigured: false,
      elevenLabsConfigured: false
    };
  }
}

/**
 * Generate a complete Study Package from raw study notes/text via Backend
 */
export async function generateStudyPackage(rawText: string): Promise<StudyPackage> {
  try {
    const res = await fetch('/api/generate-deck', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: rawText })
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}: ${res.statusText}`);
    }

    const data: StudyPackage = await res.json();
    return data;
  } catch (err) {
    console.warn("Backend generate-deck call failed, using client fallback engine:", err);
    await new Promise(r => setTimeout(r, 900));
    return createSimulatedPackageFromText(rawText);
  }
}

/**
 * Socratic AI Tutor Chat grounded on the active study package via Backend
 */
export async function askSocraticTutor(
  studyPackage: StudyPackage,
  history: ChatMessage[],
  userMessage: string,
  mode: 'socratic' | 'exam' | 'explainer' = 'socratic'
): Promise<string> {
  try {
    const res = await fetch('/api/tutor/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studyPackage,
        history,
        message: userMessage,
        mode
      })
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return data.reply;
  } catch (err) {
    console.warn("Backend tutor chat call failed, using client fallback:", err);
    await new Promise(r => setTimeout(r, 600));
    return getOfflineTutorReply(studyPackage, userMessage, mode);
  }
}

/**
 * ElevenLabs Voice Synthesis via Backend
 * Returns an HTMLAudioElement with the MP3 stream, or null if fallback to Web Speech is required
 */
export async function fetchElevenLabsAudio(text: string): Promise<HTMLAudioElement | null> {
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (data.fallback) {
        console.info(`[ElevenLabs] ${data.message}`);
        return null; // Signals caller to use Web Speech API fallback
      }
    }

    if (!res.ok) return null;

    const blob = await res.blob();
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    return audio;
  } catch (err) {
    console.warn("Error fetching ElevenLabs audio stream:", err);
    return null;
  }
}

// Client-side fallback helpers for offline resilience
function createSimulatedPackageFromText(text: string): StudyPackage {
  return extractStudyPackageFromText(text);
}

function getOfflineTutorReply(studyPackage: StudyPackage, message: string, mode: string): string {
  const title = studyPackage?.title || 'this topic';
  const lower = message.toLowerCase();

  // Find relevant concept from the active study package
  const matchingKeyPoint = studyPackage?.keyPoints?.find(kp =>
    lower.includes(kp.topic.toLowerCase()) ||
    kp.summary.toLowerCase().split(' ').some(word => word.length > 4 && lower.includes(word))
  ) || studyPackage?.keyPoints?.[0];

  const matchingCard = studyPackage?.flashcards?.find(fc =>
    lower.includes(fc.category.toLowerCase()) ||
    fc.front.toLowerCase().split(' ').some(word => word.length > 5 && lower.includes(word))
  );

  const conceptTopic = matchingKeyPoint?.topic || title;
  const conceptSummary = matchingKeyPoint?.summary || studyPackage?.overview || 'the foundational laws';

  if (mode === 'socratic') {
    if (lower.includes('why') || lower.includes('how')) {
      return `That's a key inquiry in **${conceptTopic}**! Let's reason through it together:\n\nBased on your notes: *"${conceptSummary}"*.\n\nWhat would you expect to happen if we perturbed the baseline conditions? What would be the physical or system response?`;
    }
    return `Great focus area. Before jumping into the derivation for **${conceptTopic}**, how would you state its governing rule in your own words based on your study deck?`;
  }

  if (mode === 'exam') {
    return `### Oral Viva Evaluation: **8.5/10**\n\nYour question touches directly on **${conceptTopic}**.\n- **Technical Invariant**: *${conceptSummary}*\n\n**Examiner Follow-up Question**: Can you explain the primary boundary condition where this formulation holds true, and what happens when that condition is violated?`;
  }

  return `### Concept Breakdown: ${conceptTopic}\n\n1. **Core Principle**: ${conceptSummary}\n2. **Intuitive Model**: ${matchingKeyPoint?.eli5 || studyPackage?.overviewEli5 || 'Mastering this invariant makes exam derivation direct.'}\n3. **Key Formulation / Note**: ${matchingKeyPoint?.formulasOrSyntax?.[0] ? `\`${matchingKeyPoint.formulasOrSyntax[0]}\`` : (matchingCard?.back || 'Always verify boundary conditions in your written answer.')}\n\nWhat specific part of this concept would you like to explore deeper?`;
}
