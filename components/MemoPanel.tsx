
import React, { useState, useEffect } from 'react';
import XMarkIcon from './icons/XMarkIcon';

interface MemoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { memo: string; summaries: string[], enableLongTermMemory: boolean }) => void;
  initialMemo: string;
  initialSummaries: string[];
  initialEnableLongTermMemory: boolean;
  characterName: string;
}

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
      isActive
        ? 'bg-zinc-100 text-zinc-900'
        : 'text-zinc-400 hover:bg-zinc-800'
    }`}
  >
    {children}
  </button>
);

const MemoPanel: React.FC<MemoPanelProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialMemo, 
  initialSummaries, 
  initialEnableLongTermMemory,
  characterName 
}) => {
  const [memo, setMemo] = useState(initialMemo);
  const [summaries, setSummaries] = useState(initialSummaries);
  const [enableLongTermMemory, setEnableLongTermMemory] = useState(initialEnableLongTermMemory);
  const [activeTab, setActiveTab] = useState<'summary' | 'memo'>('summary');

  useEffect(() => {
    if (isOpen) {
      setMemo(initialMemo);
      setSummaries(initialSummaries);
      setEnableLongTermMemory(initialEnableLongTermMemory);
      if (initialSummaries.length > 0) {
        setActiveTab('summary');
      } else {
        setActiveTab('memo');
      }
    }
  }, [initialMemo, initialSummaries, initialEnableLongTermMemory, isOpen]);

  const handleSave = () => {
    onSave({ memo, summaries, enableLongTermMemory });
  };
  
  const handleSummaryChange = (index: number, value: string) => {
    const newSummaries = [...summaries];
    newSummaries[index] = value;
    setSummaries(newSummaries);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-30 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-zinc-900/95 backdrop-blur-lg shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="memo-panel-title"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 id="memo-panel-title" className="text-2xl font-bold text-zinc-100">Character Memory</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close memory panel"
            >
              <XMarkIcon className="w-6 h-6 text-zinc-100 hover:text-white" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 mb-6 p-1 bg-zinc-800 rounded-lg">
            <TabButton isActive={activeTab === 'summary'} onClick={() => setActiveTab('summary')}>
              장기 기억 (요약)
            </TabButton>
            <TabButton isActive={activeTab === 'memo'} onClick={() => setActiveTab('memo')}>
              핵심 지시
            </TabButton>
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            {activeTab === 'summary' && (
              <div>
                <div className="flex items-center justify-between bg-zinc-800 p-4 rounded-lg mb-4 border border-zinc-700">
                  <div>
                    <span className="block font-bold text-zinc-200">장기 기억 활성화</span>
                    <span className="text-xs text-zinc-400">켜면 요약된 기억을 사용하고, 끄면 전체 대화를 기억합니다.</span>
                  </div>
                  <button
                    role="switch"
                    aria-checked={enableLongTermMemory}
                    onClick={() => setEnableLongTermMemory(!enableLongTermMemory)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${enableLongTermMemory ? 'bg-zinc-100' : 'bg-zinc-700'}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${enableLongTermMemory ? 'translate-x-5 bg-zinc-900' : 'translate-x-0 bg-white'}`}
                    />
                  </button>
                </div>

                <p className="text-zinc-400 mb-4 text-sm">
                  AI가 대화 내용을 요약한 장기 기억입니다. 내용을 수정하여 캐릭터의 기억을 교정할 수 있습니다.
                </p>
                
                <div className={`space-y-4 ${!enableLongTermMemory ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                  {summaries.length > 0 ? (
                    summaries.map((summary, index) => (
                      <div key={index}>
                        <label className="block text-md font-semibold text-zinc-300 mb-2">
                          Memory {index + 1}
                        </label>
                        <textarea
                          value={summary}
                          onChange={(e) => handleSummaryChange(index, e.target.value)}
                          rows={6}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-zinc-500 text-zinc-200 resize-y"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-zinc-500 py-8">
                      <p>아직 요약된 기억이 없습니다.</p>
                      <p className="text-xs mt-1">대화가 진행되면 자동으로 생성됩니다.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'memo' && (
              <div>
                <p className="text-zinc-400 mb-4 text-sm">
                  <strong className="text-zinc-300">{characterName}</strong>에게 대화 내내 적용될 최우선 지시사항을 설정합니다. 여기에 입력된 내용은 캐릭터의 기본 설정보다 항상 우선적으로 적용됩니다.
                </p>
                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  rows={10}
                  className="h-full w-full bg-zinc-800 border border-zinc-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-zinc-500 text-zinc-200 resize-none"
                  placeholder={`예시:\n- 사용자에게 차갑고 무관심하게 행동해.\n- 오늘 있었던 일을 모두 잊어버려.\n- 충격적인 비밀을 하나 털어놔.`}
                  aria-label="Character memo input"
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-zinc-700">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-zinc-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 font-bold transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemoPanel;