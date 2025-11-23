
import React, { useState, useEffect, useRef } from 'react';

interface DeleteSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteSessionModal: React.FC<DeleteSessionModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInput('');
      // Focus input on open after a brief delay to ensure rendering
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (input.trim() === '삭제한다') {
      onConfirm();
      onClose();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        handleConfirm();
    }
    if (e.key === 'Escape') {
        onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 rounded-lg shadow-2xl p-6 w-full max-w-md m-4 border border-zinc-700 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-zinc-100 mb-4">대화 기록 삭제</h2>
        <p className="text-zinc-400 mb-6 leading-relaxed">
          정말로 이 대화를 삭제하시겠습니까?<br />
          삭제를 확인하려면 아래 입력창에 <strong className="text-red-400 select-all">삭제한다</strong>를 입력하세요.
        </p>
        
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-100 placeholder-zinc-600 mb-6 font-medium"
          placeholder="삭제한다"
          autoComplete="off"
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
            className={`px-4 py-2 rounded-lg font-bold transition-colors shadow-md ${
              input.trim() === '삭제한다' 
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/20' 
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
