import { useState, type FC } from 'react';
import { Key, ShieldCheck, X, AlertCircle } from 'lucide-react';
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
    setStatusMsg('API key saved in browser storage.');
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
    setStatusMsg('Connecting to Gemini API...');
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
        setStatusMsg('Key verified successfully.');
      } else {
        setStatus('error');
        setStatusMsg(`Verification failed (${res.status}). Check key.`);
      }
    } catch (e: unknown) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-stone-200/90 rounded-3xl max-w-md w-full p-7 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900 m-0">Google Gemini API Key</h3>
            <p className="text-xs text-stone-500 mt-0.5">Optional: For live AI text generation</p>
          </div>
        </div>

        <div className="bg-[#f0faf4] p-4 rounded-2xl border border-emerald-100 mb-4 text-xs text-stone-600 leading-relaxed">
          <p className="font-bold text-emerald-900 mb-0.5">Presentation Note:</p>
          <p>
            An API key is optional. The app comes pre-packaged with complete decks and an offline parser so your live presentation will work smoothly without internet.
          </p>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none font-mono"
          />
          <p className="text-[11px] text-stone-400 mt-1.5">
            Stored only in your local browser storage.
          </p>
        </div>

        {statusMsg && (
          <div className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 ${
            status === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
            status === 'error' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
            'bg-stone-100 text-stone-800 border border-stone-200'
          }`}>
            {status === 'success' && <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />}
            {status === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
            <span>{statusMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-1">
          {apiKey ? (
            <button
              onClick={handleClear}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
            >
              Remove Key
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestKey}
              disabled={status === 'testing' || !apiKey}
              className="px-4 py-2 text-xs font-semibold rounded-full border border-stone-200 hover:bg-stone-50 text-stone-700 transition"
            >
              {status === 'testing' ? 'Testing...' : 'Test Key'}
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 transition"
            >
              Save Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
