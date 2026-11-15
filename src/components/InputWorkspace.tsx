import { useState, useRef, type FC, type ChangeEvent } from 'react';
import { UploadCloud, FileText, ArrowRight, Loader2, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 m-0">
            Study Room & Notes Ingestion
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Upload course slides, textbook chapters, or paste notes to automatically generate active study tools.
          </p>
        </div>

        {/* 1-Click Samples */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSelectSampleDeck(DEEP_LEARNING_DECK)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition flex items-center gap-1.5 shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Deep Learning Notes</span>
          </button>
          <button
            onClick={() => onSelectSampleDeck(OPERATING_SYSTEMS_DECK)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 transition flex items-center gap-1.5 shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-600" />
            <span>OS Concurrency Notes</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Card */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
        {/* Upload dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-emerald-200 hover:border-emerald-400 bg-emerald-50/20 hover:bg-emerald-50/40 rounded-2xl p-8 text-center cursor-pointer transition duration-150 group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.txt,.md,.json"
            className="hidden"
          />
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-stone-900">
            Click to upload PDF, TXT, or Markdown notes
          </p>
          <p className="text-xs text-stone-500 mt-1">
            Documents are parsed locally in your browser with zero latency
          </p>
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-semibold text-stone-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              Or Paste Text Directly
            </span>
            <span className="font-mono text-xs">{wordCount} words</span>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your course notes, slides text, definitions, or textbook reading here..."
            rows={8}
            className="w-full p-4 rounded-2xl border border-stone-200 bg-stone-50/40 text-stone-900 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none resize-none transition font-sans leading-relaxed"
          />
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-end pt-2">
          <button
            onClick={handleGenerate}
            disabled={isProcessing || !inputText.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition active:scale-98"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Course Notes...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Study Package</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
