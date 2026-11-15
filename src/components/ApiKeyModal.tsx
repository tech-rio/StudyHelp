import { useState, type FC } from 'react';
import { Key, ShieldCheck, X, Sparkles, AlertCircle } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '../services/gemini';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: () => void;
}

export const ApiKeyModal: FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredApiKey(apiKey);
    setStatus('success');
    setStatusMsg('API key saved locally in browser storage!');
    setTimeout(() => {
      onKeySaved();
      onClose();
    }, 600);
  };

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setStatus('error');
      setStatusMsg('Please enter an API key first.');
      return;
    }
    setStatus('testing');
    setStatusMsg('Verifying key with Google Gemini API...');
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Hello" }] }]
          })
        }
      );
      if (res.ok) {
        setStatus('success');
        setStatusMsg('Key verified successfully! Connected to Gemini.');
      } else {
        setStatus('error');
        setStatusMsg(`Verification failed (${res.status}). Check key permissions.`);
      }
    } catch (e: any) {
      console.error('Gemini test error:', e);
      setStatus('error');
      setStatusMsg('Network error connecting to Gemini API.');
    }
  };

  const handleClear = () => {
    setApiKey('');
    setStoredApiKey('');
    setStatus('idle');
    setStatusMsg('');
    onKeySaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Gemini API Settings</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Power your live study agent with Google Gemini</p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 mb-4 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Optional for Presentations:</p>
            <p>
              CogniStudy AI includes a high-fidelity local simulator and pre-packaged sample decks. You can run and demonstrate every feature offline without an API key!
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Google Gemini API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
          />
          <p className="text-[11px] text-slate-400 mt-1.5">
            Key is stored exclusively in your browser's local storage and never sent anywhere except Google's API.
          </p>
        </div>

        {statusMsg && (
          <div className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
            status === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
            status === 'error' ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800' :
            'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
          }`}>
            {status === 'success' && <ShieldCheck className="w-4 h-4 shrink-0" />}
            {status === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          {apiKey ? (
            <button
              onClick={handleClear}
              className="text-xs text-rose-500 hover:text-rose-600 font-medium px-2 py-1"
            >
              Clear Key
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestKey}
              disabled={status === 'testing' || !apiKey}
              className="px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
            >
              {status === 'testing' ? 'Testing...' : 'Test Key'}
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20 transition"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
