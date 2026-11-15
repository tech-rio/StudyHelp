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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#faf7f0] border border-[#ded8cb] p-4 rounded-xl shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-[#26221f] tracking-tight m-0">
            Study Tutor
          </h2>
          <p className="text-xs text-[#7d7368] mt-0.5">
            Grounded in: <span className="font-medium text-[#26221f]">{deck.title}</span>
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-[#eae4d7] p-1 rounded-lg">
          <button
            onClick={() => setPedagogicalMode('socratic')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition ${
              pedagogicalMode === 'socratic'
                ? 'bg-[#26221f] text-[#faf7f0] font-semibold shadow-xs'
                : 'text-[#5c534a] hover:text-[#26221f]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Socratic</span>
          </button>
          <button
            onClick={() => setPedagogicalMode('exam')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition ${
              pedagogicalMode === 'exam'
                ? 'bg-[#26221f] text-[#faf7f0] font-semibold shadow-xs'
                : 'text-[#5c534a] hover:text-[#26221f]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Oral Exam</span>
          </button>
          <button
            onClick={() => setPedagogicalMode('explainer')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition ${
              pedagogicalMode === 'explainer'
                ? 'bg-[#26221f] text-[#faf7f0] font-semibold shadow-xs'
                : 'text-[#5c534a] hover:text-[#26221f]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Direct</span>
          </button>

          <button
            onClick={handleClearChat}
            title="Clear Chat History"
            className="p-1 text-[#8a8074] hover:text-[#26221f] rounded ml-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Canvas */}
      <div className="bg-[#f0ebe0]/70 border border-[#ded8cb] rounded-xl p-4 sm:p-5 shadow-xs min-h-100 max-h-125 overflow-y-auto space-y-3.5">
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
                    ? 'bg-[#26221f] text-[#faf7f0]'
                    : 'bg-[#ded8cb] text-[#474039]'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : 'AI'}
              </div>

              <div
                className={`max-w-[85%] rounded-xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#26221f] text-[#faf7f0]'
                    : 'bg-[#faf7f0] text-[#26221f] border border-[#ded8cb] shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line font-normal">{msg.text}</div>
                <div
                  className={`text-[10px] mt-1 text-right ${
                    isUser ? 'text-[#b8ad9b]' : 'text-[#8a8074]'
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
            <div className="w-7 h-7 rounded-md bg-[#ded8cb] text-[#474039] flex items-center justify-center shrink-0 text-xs font-semibold">
              AI
            </div>
            <div className="p-3 rounded-xl bg-[#faf7f0] border border-[#ded8cb] text-[#7d7368] text-xs flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7d7368]" />
              <span>Checking course notes...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex flex-wrap items-center gap-1.5 px-0.5">
        <span className="text-[11px] font-medium text-[#7d7368]">
          Try asking:
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="text-xs px-2.5 py-1 rounded-md border border-[#ded8cb] bg-[#faf7f0] hover:bg-[#eae4d7] text-[#474039] transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="flex items-center gap-2 bg-[#faf7f0] border border-[#ded8cb] p-2 rounded-xl shadow-xs">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask about ${deck.title}...`}
          className="flex-1 px-3 py-1.5 bg-transparent text-xs sm:text-sm text-[#26221f] placeholder:text-[#8a8074] focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="px-3.5 py-2 rounded-lg bg-[#26221f] hover:bg-[#3d3732] disabled:opacity-40 text-[#faf7f0] text-xs font-semibold transition"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
