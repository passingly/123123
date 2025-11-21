
import React, { useState, useEffect } from 'react';

interface RegenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegenerate: (instructions: string) => void;
}

const RegenerateModal: React.FC<RegenerateModalProps> = ({ isOpen, onClose, onRegenerate }) => {
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInstructions('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegenerate(instructions);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 rounded-lg shadow-xl p-6 w-full max-w-md m-4 border border-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-zinc-100 mb-4">Regenerate Response</h2>
        <p className="text-zinc-400 mb-6">You can provide optional instructions to guide the new response.</p>
        <form onSubmit={handleSubmit}>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-zinc-500 mb-6 text-zinc-100 placeholder-zinc-500"
            placeholder="e.g., Make the response shorter..."
            autoFocus
          />
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
              Regenerate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegenerateModal;
