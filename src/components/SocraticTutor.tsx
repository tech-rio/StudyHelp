import { useState, useRef, useEffect, type FC } from 'react';
import {
  Send,
  User,
  HelpCircle,
  Award,
  BookOpen,
  Loader2,
  Trash2
} from 'lucide-react';
import type { StudyPackage, ChatMessage } from '../types/study';
import { askSocraticTutor } from '../services/gemini';

interface SocraticTutorProps {
  deck: StudyPackage;
}

export const SocraticTutor: FC<SocraticTutorProps> = ({ deck }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      sender: 'tutor',
      text: `Hi! I'm your study partner for **"${deck.title}"**.\n\nAsk me about anything in these notes, or ask me to quiz you on key concepts. Where would you like to start?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: 'socratic'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pedagogicalMode, setPedagogicalMode] = useState<'socratic' | 'exam' | 'explainer'>('socratic');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: pedagogicalMode
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await askSocraticTutor(deck, messages, text, pedagogicalMode);
      const tutorMsg: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: pedagogicalMode
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'tutor',
        text: `Chat cleared. Ready to study **${deck.title}** whenever you are.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: pedagogicalMode
      }
    ]);
  };

  const quickPrompts = [
    `Quiz me on ${deck.keyPoints[0]?.topic || 'this topic'}`,
    `What are the most common exam mistakes here?`,
    `Give me a real-world example of this concept`,
    `Ask me a viva question`
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Top Header & Modes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-stone-200 p-4 rounded-xl shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight m-0">
            Study Tutor
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Grounded in: <span className="font-medium text-stone-700">{deck.title}</span>
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
          <button
            onClick={() => setPedagogicalMode('socratic')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition ${
              pedagogicalMode === 'socratic'
                ? 'bg-white text-stone-900 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Socratic</span>
          </button>
          <button
            onClick={() => setPedagogicalMode('exam')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition ${
              pedagogicalMode === 'exam'
                ? 'bg-white text-stone-900 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Oral Exam</span>
          </button>
          <button
            onClick={() => setPedagogicalMode('explainer')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition ${
              pedagogicalMode === 'explainer'
                ? 'bg-white text-stone-900 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Direct</span>
          </button>

          <button
            onClick={handleClearChat}
            title="Clear Chat History"
            className="p-1 text-stone-400 hover:text-stone-700 rounded ml-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Canvas */}
      <div className="bg-stone-50/70 border border-stone-200 rounded-xl p-4 sm:p-5 shadow-xs min-h-100 max-h-125 overflow-y-auto space-y-3.5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-xs font-semibold ${
                  isUser
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : 'AI'}
              </div>

              <div
                className={`max-w-[85%] rounded-xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-800 border border-stone-200 shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line font-normal">{msg.text}</div>
                <div
                  className={`text-[10px] mt-1 text-right ${
                    isUser ? 'text-stone-400' : 'text-stone-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-md bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 text-xs font-semibold">
              AI
            </div>
            <div className="p-3 rounded-xl bg-white border border-stone-200 text-stone-500 text-xs flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-500" />
              <span>Checking course notes...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex flex-wrap items-center gap-1.5 px-0.5">
        <span className="text-[11px] font-medium text-stone-400">
          Try asking:
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="text-xs px-2.5 py-1 rounded-md border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="flex items-center gap-2 bg-white border border-stone-200 p-2 rounded-xl shadow-xs">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask about ${deck.title}...`}
          className="flex-1 px-3 py-1.5 bg-transparent text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white text-xs font-semibold transition"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
