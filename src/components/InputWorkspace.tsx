import { useState, useRef, type FC, type ChangeEvent } from 'react';
import { UploadCloud, FileText, ArrowRight, Loader2, BookOpen, AlertCircle } from 'lucide-react';
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to read file.';
      setErrorMsg(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setErrorMsg('Please paste or upload some notes first.');
      return;
    }

    setErrorMsg('');
    setIsProcessing(true);

    try {
      const generated = await generateStudyPackage(inputText);
      onStudyPackageGenerated(generated);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong while generating the deck.';
      setErrorMsg(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="border-b border-stone-200 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-stone-900 m-0">
          Add Study Material
        </h2>
        <p className="text-sm text-stone-600 mt-1.5 leading-relaxed">
          Upload a lecture slide PDF, textbook excerpt, or paste syllabus notes below. The app breaks down dense text into key concepts, interactive flashcards, practice exam questions, and a concept map.
        </p>

        {/* 1-Click Samples */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-stone-500 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-stone-600" />
            Or try a sample topic:
          </span>
          <button
            onClick={() => onSelectSampleDeck(DEEP_LEARNING_DECK)}
            className="px-3 py-1 rounded-md text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition"
          >
            Deep Learning & Neural Networks
          </button>
          <button
            onClick={() => onSelectSampleDeck(OPERATING_SYSTEMS_DECK)}
            className="px-3 py-1 rounded-md text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition"
          >
            OS Concurrency & Deadlocks
          </button>
        </div>
      </div>

      {/* Main Workspace Card */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-5">
        {/* Upload dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-stone-300 hover:border-stone-400 bg-stone-50/50 hover:bg-stone-50 rounded-lg p-6 text-center cursor-pointer transition duration-150 group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.txt,.md,.json"
            className="hidden"
          />
          <div className="w-10 h-10 mx-auto rounded-full bg-stone-200/70 flex items-center justify-center text-stone-700 mb-2.5 group-hover:scale-105 transition-transform">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-stone-800">
            Click to upload PDF, TXT, or Markdown notes
          </p>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Text is parsed securely directly in your browser
          </p>
        </div>

        {/* Text Area */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium text-stone-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-stone-500" />
              Paste Raw Notes or Lecture Transcript
            </span>
            <span className="font-mono text-[11px]">{wordCount} words</span>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your course notes, slides text, definitions, or textbook reading here..."
            rows={8}
            className="w-full p-3.5 rounded-lg border border-stone-200 bg-white text-stone-900 text-sm focus:border-stone-900 focus:ring-1 focus:ring-stone-900 focus:outline-none resize-none transition font-sans leading-relaxed"
          />
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-end pt-1">
          <button
            onClick={handleGenerate}
            disabled={isProcessing || !inputText.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-xs transition active:scale-98"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-stone-300" />
                <span>Analyzing Notes...</span>
              </>
            ) : (
              <>
                <span>Build Study Deck</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
