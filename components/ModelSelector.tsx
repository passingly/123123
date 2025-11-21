
import React, { useState } from 'react';
import type { AIModel } from '../types';

interface ModelSelectorProps {
  models: AIModel[];
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ models, selectedModelId, onSelectModel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedModel = models.find(m => m.id === selectedModelId)!;

  const handleSelect = (modelId: string) => {
    if (modelId !== selectedModelId) {
      onSelectModel(modelId);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-semibold bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors text-zinc-100"
      >
        <span>{selectedModel.displayName}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
            <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsOpen(false)}></div>
            <div 
                className="absolute left-0 mt-2 w-64 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 rounded-lg shadow-2xl z-50 animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
            <ul className="p-2 space-y-1 max-h-[60vh] overflow-y-auto no-scrollbar">
                {models.map(model => {
                return (
                    <li key={model.id}>
                    <button
                        onClick={() => handleSelect(model.id)}
                        className={`w-full text-left p-3 rounded-md transition-colors ${
                        selectedModelId === model.id
                            ? 'bg-zinc-700'
                            : 'hover:bg-zinc-800'
                        }`}
                    >
                        <div className="flex justify-between items-center">
                        <span className="font-bold text-zinc-100">{model.displayName}</span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">{model.description}</p>
                    </button>
                    </li>
                );
                })}
            </ul>
            </div>
        </>
      )}
    </div>
  );
};

export default ModelSelector;
