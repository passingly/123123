
import React, { useState, useEffect } from 'react';
import XMarkIcon from './icons/XMarkIcon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  initialApiKey: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, initialApiKey }) => {
  const [apiKey, setApiKey] = useState(initialApiKey);

  useEffect(() => {
    if (isOpen) {
      setApiKey(initialApiKey);
    }
  }, [isOpen, initialApiKey]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(apiKey.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-zinc-900 rounded-lg shadow-xl p-6 w-full max-w-md m-4 border border-zinc-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-zinc-100">Settings</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-zinc-300 mb-2">
              Gemini API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-zinc-500 text-zinc-100 placeholder-zinc-500"
              placeholder="Leave blank to use default system key"
            />
            <p className="mt-2 text-xs text-zinc-400">
              If set, this key will override the default system API key.
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              Don't have a key?{' '}
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                Get one from Google AI Studio
              </a>
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Your key is stored locally in your browser and is never sent to any other server.
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 font-bold transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;
