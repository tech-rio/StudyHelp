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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#26221f]/40 backdrop-blur-xs p-4">
      <div className="bg-[#faf7f0] border border-[#ded8cb] rounded-xl max-w-md w-full p-6 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8a8074] hover:text-[#26221f]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#eae4d7] text-[#474039] rounded-lg">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#26221f]">Google Gemini API Key</h3>
            <p className="text-xs text-[#7d7368]">Optional: For live text generation</p>
          </div>
        </div>

        <div className="bg-[#f4f0e6] p-3 rounded-lg border border-[#ded8cb] mb-4 text-xs text-[#5c534a]">
          <p className="font-medium text-[#26221f] mb-0.5">Presentation Note:</p>
          <p>
            An API key is optional. The app comes pre-packaged with complete decks and an offline parser so your live presentation will work smoothly without internet.
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-[#474039] uppercase tracking-wider mb-1.5">
            API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3 py-2 rounded-lg border border-[#ded8cb] bg-[#fbf9f5] text-[#26221f] text-xs focus:ring-1 focus:ring-[#26221f] focus:outline-none font-mono"
          />
          <p className="text-[11px] text-[#8a8074] mt-1">
            Stored only in your local browser storage.
          </p>
        </div>

        {statusMsg && (
          <div className={`p-2.5 rounded-lg mb-4 text-xs flex items-center gap-2 ${
            status === 'success' ? 'bg-[#e2edd8] text-[#2d4d1e] border border-[#c4dcaf]' :
            status === 'error' ? 'bg-[#fce8e6] text-[#6b1e1b] border border-[#f3beba]' :
            'bg-[#eae4d7] text-[#474039] border border-[#ded8cb]'
          }`}>
            {status === 'success' && <ShieldCheck className="w-4 h-4 shrink-0" />}
            {status === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMsg}</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-1">
          {apiKey ? (
            <button
              onClick={handleClear}
              className="text-xs text-[#a82a25] hover:text-[#7f1d1d] font-medium"
            >
              Remove Key
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestKey}
              disabled={status === 'testing' || !apiKey}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#ded8cb] bg-[#faf7f0] hover:bg-[#eae4d7] text-[#474039] transition"
            >
              {status === 'testing' ? 'Testing...' : 'Test Key'}
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#26221f] hover:bg-[#3d3732] text-[#faf7f0] shadow-xs transition"
            >
              Save Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
