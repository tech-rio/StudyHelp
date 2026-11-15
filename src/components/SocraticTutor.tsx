import { useState, useRef, useEffect, type FC } from 'react';
import {
  Send,
  User,
  HelpCircle,
  Award,
  BookOpen,
  Loader2,
  Trash2,
  MessageCircle
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
      text: `Hi! I'm your Socratic study partner for **"${deck.title}"**.\n\nAsk me about anything in these notes, or ask me to quiz you on key concepts. Where would you like to start?`,
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
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Top Header & Modes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-stone-200/90 p-5 rounded-3xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight m-0 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            Socratic AI Tutor
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Grounded in: <span className="font-semibold text-emerald-800">{deck.title}</span>
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 bg-[#f0faf4] p-1.5 rounded-2xl border border-emerald-100">
          <button
            onClick={() => setPedagogicalMode('socratic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              pedagogicalMode === 'socratic'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Socratic</span>
          </button>
          <button
            onClick={() => setPedagogicalMode('exam')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              pedagogicalMode === 'exam'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Oral Exam</span>
          </button>
          <button
            onClick={() => setPedagogicalMode('explainer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              pedagogicalMode === 'explainer'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Direct</span>
          </button>

          <button
            onClick={handleClearChat}
            title="Clear Chat History"
            className="p-1.5 text-stone-400 hover:text-rose-600 rounded-xl ml-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Canvas */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-7 shadow-xs min-h-105 max-h-130 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                  isUser
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : 'AI'}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none shadow-xs'
                    : 'bg-[#f0faf4] text-stone-900 rounded-tl-none border border-emerald-100 shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line font-normal">{msg.text}</div>
                <div
                  className={`text-[10px] mt-1.5 text-right ${
                    isUser ? 'text-emerald-100' : 'text-stone-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
              AI
            </div>
            <div className="p-3.5 rounded-2xl bg-[#f0faf4] border border-emerald-100 text-stone-600 text-xs flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>Analyzing notes & formulating pedagogical response...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex flex-wrap items-center gap-2 px-1">
        <span className="text-xs font-semibold text-stone-400">
          Try asking:
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-full border border-stone-200 bg-white hover:bg-emerald-50 text-stone-700 transition shadow-xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="flex items-center gap-2 bg-white border border-stone-200/90 p-2.5 rounded-full shadow-xs">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask about ${deck.title}...`}
          className="flex-1 px-4 py-2 bg-transparent text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold transition shadow-sm shadow-emerald-600/20"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
