import React, { useState, useEffect } from 'react';

interface RedeemCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRedeem: (code: string) => void;
}

const RedeemCodeModal: React.FC<RedeemCodeModalProps> = ({ isOpen, onClose, onRedeem }) => {
  const [code, setCode] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCode(''); // Reset code on open
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onRedeem(code.trim());
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Redeem Code</h2>
        <p className="text-slate-400 mb-6">Enter a code to add currency to your wallet.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
            placeholder="Enter your code"
            autoFocus
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
              disabled={!code.trim()}
            >
              Redeem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RedeemCodeModal;
