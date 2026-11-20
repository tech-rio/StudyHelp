import { useState, useRef, useEffect, type FC } from 'react';
import {
  Send,
  Loader2,
  HelpCircle,
  Award,
  BookOpen,
  Trash2,
  User,
  MessageCircle
} from 'lucide-react';
import type { StudyPackage, ChatMessage } from '../types/study';
import { askSocraticTutor } from '../services/gemini';

interface SocraticTutorProps {
  deck: StudyPackage;
}

export const SocraticTutor: FC<SocraticTutorProps> = ({ deck }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: `Hello! I am your AI Socratic Study Partner for "${deck.title}". I won't just dump answers — I'll guide you through active recall and check your reasoning. What concept would you like to review first?`,
      timestamp: 'Just now',
      mode: 'socratic'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pedagogicalMode, setPedagogicalMode] = useState<'socratic' | 'exam' | 'explainer'>('socratic');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (overridePrompt?: string) => {
    const textToSend = overridePrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: pedagogicalMode
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!overridePrompt) setInput('');
    setLoading(true);

    try {
      const response = await askSocraticTutor(
        deck,
        newMessages,
        textToSend,
        pedagogicalMode
      );

      const tutorMessage: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: pedagogicalMode
      };
      setMessages((prev) => [...prev, tutorMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'tutor',
          text: "I couldn't reach the model right now. You can continue reviewing using the pre-loaded study tools!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: pedagogicalMode
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'tutor',
        text: `Chat reset. Ready to practice "${deck.title}". Where shall we begin?`,
        timestamp: 'Just now',
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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header & Modes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200/90 p-6 sm:p-7 rounded-3xl shadow-xs">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight m-0 flex items-center gap-2.5">
            <MessageCircle className="w-6 h-6 text-emerald-600" />
            Socratic AI Tutor
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Grounded in: <span className="font-semibold text-emerald-800">{deck.title}</span>
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 bg-[#f0faf4] p-1.5 rounded-2xl border border-emerald-100">
          <button
            onClick={() => setPedagogicalMode('socratic')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
              pedagogicalMode === 'socratic'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Socratic</span>
          </button>
          <button
            onClick={() => setPedagogicalMode('exam')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
              pedagogicalMode === 'exam'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Oral Exam</span>
          </button>
          <button
            onClick={() => setPedagogicalMode('explainer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
              pedagogicalMode === 'explainer'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Direct</span>
          </button>

          <button
            onClick={handleClearChat}
            title="Clear Chat History"
            className="p-2 text-stone-400 hover:text-rose-600 rounded-xl ml-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Canvas */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-9 shadow-xs min-h-120 max-h-160 overflow-y-auto space-y-5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold shadow-xs ${
                  isUser
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {isUser ? <User className="w-5 h-5" /> : 'AI'}
              </div>

              <div
                className={`max-w-[85%] rounded-3xl p-5 text-sm sm:text-base leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none shadow-xs font-medium'
                    : 'bg-[#f0faf4] text-stone-900 rounded-tl-none border border-emerald-100 shadow-xs font-normal'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
                <div
                  className={`text-xs mt-2 text-right ${
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
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 text-sm font-bold shadow-xs">
              AI
            </div>
            <div className="p-4.5 rounded-2xl bg-[#f0faf4] border border-emerald-100 text-stone-600 text-sm flex items-center gap-2.5">
              <Loader2 className="w-4.5 h-4.5 animate-spin text-emerald-600" />
              <span>Analyzing notes & formulating pedagogical response...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex flex-wrap items-center gap-2.5 px-2">
        <span className="text-sm font-semibold text-stone-500">
          Try asking:
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="text-xs sm:text-sm px-4 py-2 rounded-full border border-stone-200 bg-white hover:bg-emerald-50 text-stone-700 transition shadow-xs font-medium"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="flex items-center gap-3 bg-white border border-stone-200/90 p-3 sm:p-3.5 rounded-full shadow-sm">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask about ${deck.title}...`}
          className="flex-1 px-5 py-2 bg-transparent text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-sm font-bold transition shadow-sm shadow-emerald-600/20 flex items-center gap-2"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
