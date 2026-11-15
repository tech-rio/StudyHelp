import { useState, useRef, type FC, type ChangeEvent } from 'react';
import { UploadCloud, FileText, Sparkles, Loader2, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import type { StudyPackage } from '../types/study';
import { generateStudyPackage } from '../services/gemini';
import { extractTextFromPdf } from '../services/pdfReader';
import { DEEP_LEARNING_DECK, OPERATING_SYSTEMS_DECK } from '../services/demoData';

interface InputWorkspaceProps {
  onStudyPackageGenerated: (pkg: StudyPackage) => void;
  onSelectSampleDeck: (pkg: StudyPackage) => void;
}

export const InputWorkspace: FC<InputWorkspaceProps> = ({
  onStudyPackageGenerated,
  onSelectSampleDeck
}) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setIsProcessing(true);

    try {
      if (file.name.endsWith('.pdf')) {
        const extracted = await extractTextFromPdf(file);
        setInputText(extracted);
      } else {
        const text = await file.text();
        setInputText(text);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to read file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setErrorMsg('Please enter or paste your study notes first.');
      return;
    }

    setErrorMsg('');
    setIsProcessing(true);

    try {
      const generated = await generateStudyPackage(inputText);
      onStudyPackageGenerated(generated);
    } catch (err: any) {
      setErrorMsg(err.message || 'Generation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Banner */}
      <div className="bg-linear-to-r from-indigo-900/90 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Knowledge Synthesizer</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-white">
            Transform Any Lecture Notes or PDF into an Active Study Engine
          </h2>
          <p className="text-indigo-100/90 text-sm max-w-2xl leading-relaxed">
            Upload course slides, syllabus readings, or textbook passages. CogniStudy AI automatically generates high-yield summaries, 3D active-recall flashcards, adaptive exam quizzes, and visual mind maps.
          </p>
        </div>
      </div>

      {/* Quick Load Sample Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mr-1">
          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
          1-Click Demo Decks:
        </span>
        <button
          onClick={() => onSelectSampleDeck(DEEP_LEARNING_DECK)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition shadow-sm"
        >
          🔥 Deep Learning & Neural Networks
        </button>
        <button
          onClick={() => onSelectSampleDeck(OPERATING_SYSTEMS_DECK)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition shadow-sm"
        >
          ⚡ OS Concurrency & Deadlocks
        </button>
      </div>

      {/* Upload and Paste Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        {/* Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 cursor-pointer transition group mb-5"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.txt,.md,.json"
            className="hidden"
          />
          <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Click to upload PDF, TXT, or Markdown notes
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Supports textbook chapters, lecture slides & research papers
          </p>
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              Or Paste Text Directly
            </span>
            <span>{wordCount} words</span>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste raw lecture notes, syllabus concepts, textbook excerpts, or meeting transcripts here..."
            rows={8}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none transition"
          />
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-5 flex items-center justify-end">
          <button
            onClick={handleGenerate}
            disabled={isProcessing || !inputText.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-md shadow-indigo-500/25 transition active:scale-95"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Synthesizing Knowledge Base...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Study Package</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
