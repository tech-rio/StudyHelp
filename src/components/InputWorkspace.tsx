import { useState, useRef, type ChangeEvent, type FC } from 'react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  BookOpen,
  ArrowRight,
  AlertCircle,
  Loader2
} from 'lucide-react';
import type { StudyPackage } from '../types/study';
import { extractTextFromPdf } from '../services/pdfReader';
import { generateStudyPackage } from '../services/gemini';
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setIsProcessing(true);

    try {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const text = await extractTextFromPdf(file);
        if (!text.trim()) {
          throw new Error('Extracted PDF text was empty. Please ensure the PDF has readable text.');
        }
        setInputText(text);
      } else {
        const text = await file.text();
        setInputText(text);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to read uploaded file.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const generated = await generateStudyPackage(inputText);
      onStudyPackageGenerated(generated);
    } catch (err: any) {
      setErrorMsg(err.message || 'Generation failed. Check your API key or network.');
    } finally {
      setIsProcessing(false);
    }
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-7">
      {/* Header and Quick Pre-sets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-1">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 m-0">
            Study Room & Notes Ingestion
          </h2>
          <p className="text-sm sm:text-base text-stone-500 mt-1.5">
            Upload course slides, textbook chapters, or paste notes to automatically generate active study tools.
          </p>
        </div>

        {/* 1-Click Samples */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onSelectSampleDeck(DEEP_LEARNING_DECK)}
            className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition flex items-center gap-2 shadow-xs"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Deep Learning Notes</span>
          </button>
          <button
            onClick={() => onSelectSampleDeck(OPERATING_SYSTEMS_DECK)}
            className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 transition flex items-center gap-2 shadow-xs"
          >
            <BookOpen className="w-4 h-4 text-cyan-600" />
            <span>OS Concurrency Notes</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Card */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-7 sm:p-10 shadow-xs space-y-6">
        {/* Upload dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-emerald-200 hover:border-emerald-400 bg-emerald-50/20 hover:bg-emerald-50/40 rounded-3xl p-10 sm:p-12 text-center cursor-pointer transition duration-150 group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.txt,.md,.json"
            className="hidden"
          />
          <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
            <UploadCloud className="w-8 h-8" />
          </div>
          <p className="text-base sm:text-lg font-bold text-stone-900">
            Click to upload PDF, TXT, or Markdown notes
          </p>
          <p className="text-xs sm:text-sm text-stone-500 mt-1.5">
            Documents are parsed locally in your browser with zero latency
          </p>
        </div>

        {/* Text Area */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-sm text-stone-500">
            <span className="font-bold text-stone-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Or Paste Text Directly
            </span>
            <span className="font-mono text-xs sm:text-sm font-semibold">{wordCount} words</span>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your course notes, slides text, definitions, or textbook reading here..."
            rows={8}
            className="w-full p-5 rounded-2xl border border-stone-200 bg-stone-50/40 text-stone-900 text-sm sm:text-base focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none resize-none transition font-sans leading-relaxed"
          />
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 text-xs sm:text-sm flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-end pt-2">
          <button
            onClick={handleGenerate}
            disabled={isProcessing || !inputText.trim()}
            className="flex items-center gap-2.5 px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm sm:text-base font-bold shadow-md shadow-emerald-600/20 transition active:scale-98"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Course Notes...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Study Package</span>
                <ArrowRight className="w-5 h-5 ml-0.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
