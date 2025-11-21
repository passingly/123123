
import React from 'react';

interface IosStorageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IosStorageModal: React.FC<IosStorageModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-zinc-900 rounded-lg shadow-xl p-6 w-full max-w-lg m-4 border border-zinc-800">
        <h2 className="text-2xl font-bold text-zinc-100 mb-4">Important Note for iOS Users</h2>
        <div className="text-zinc-400 mb-6 space-y-4">
            <p>Due to iOS browser policies, chat data might be automatically deleted if you don't use the app for a while. To ensure your conversations are saved permanently, we recommend one of the following solutions:</p>
            
            <div>
                <h3 className="font-semibold text-zinc-200 mb-1">1. Add to Home Screen (Recommended)</h3>
                <p>Adding this app to your Home Screen provides a more stable storage environment. In Safari, tap the <span className="font-bold">Share</span> icon, then select <span className="font-bold">'Add to Home Screen'</span>.</p>
            </div>

            <div>
                <h3 className="font-semibold text-zinc-200 mb-1">2. Manual Backup</h3>
                <p>Use the <span className="font-bold">"Export Session"</span> button (down-arrow icon) in the chat view to save your conversation as a file at any time. You can import this file later to restore your chat.</p>
            </div>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 font-bold transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default IosStorageModal;
