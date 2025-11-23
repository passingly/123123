
import React, { useState, useEffect } from 'react';

interface DeleteSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteSessionModal: React.FC<DeleteSessionModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [input, setInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInput('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (input.trim() === '삭제한다') {
      onConfirm();
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 rounded-lg shadow-xl p-6 w-full max-w-md m-4 border border-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-zinc-100 mb-4">대화 기록 삭제</h2>
        <p className="text-zinc-400 mb-6">
          정말로 이 대화를 삭제하시겠습니까?<br />
          삭제를 확인하려면 아래 입력창에 <strong>삭제한다</strong>를 입력하세요.
        </p>
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-100 placeholder-zinc-600 mb-6"
          placeholder="삭제한다"
          autoFocus
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            disabled={input.trim() !== '삭제한다'}
            className={`px-4 py-2 rounded-lg font-bold transition-colors ${
              input.trim() === '삭제한다' 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            삭제 확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSessionModal;
