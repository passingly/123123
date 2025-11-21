
import React, { useRef } from 'react';
import type { Character } from '../types';
import PlusIcon from './icons/PlusIcon';
import ArchiveBoxIcon from './icons/ArchiveBoxIcon';
import ArrowUpTrayIcon from './icons/ArrowUpTrayIcon';
import ArrowDownTrayIcon from './icons/ArrowDownTrayIcon';
import Cog6ToothIcon from './icons/Cog6ToothIcon';

interface CharacterListProps {
  characters: Character[];
  onSelectCharacter: (character: Character) => void;
  onNavigateToCreate: () => void;
  onOpenHistory: () => void;
  onImportFile: (file: File) => void;
  onExportCharacter: (character: Character) => void;
  isInstallable: boolean;
  onInstall: () => void;
  onOpenSettings: () => void;
}

const CharacterList: React.FC<CharacterListProps> = ({ 
  characters, 
  onSelectCharacter, 
  onNavigateToCreate, 
  onOpenHistory,
  onImportFile,
  onExportCharacter,
  isInstallable,
  onInstall,
  onOpenSettings
}) => {
  const importFileRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    importFileRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportFile(file);
      e.target.value = '';
    }
  };

  return (
    <>
      <input type="file" ref={importFileRef} onChange={handleFileSelected} className="hidden" accept=".json" />
      <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <button 
                onClick={onOpenHistory}
                className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
                aria-label="Open conversation history"
            >
                <ArchiveBoxIcon className="w-7 h-7 text-zinc-100 hover:text-white" />
            </button>
            <button 
                onClick={onOpenSettings}
                className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
                aria-label="Settings"
            >
                <Cog6ToothIcon className="w-7 h-7 text-zinc-100 hover:text-white" />
            </button>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100">Select a Character</h1>
          
          <div className="flex items-center gap-2 sm:gap-4 self-end sm:self-auto">
            {isInstallable && (
              <button
                onClick={onInstall}
                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Install App</span>
              </button>
            )}
            <button
              onClick={handleImportClick}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
            >
              <ArrowUpTrayIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button
              onClick={onNavigateToCreate}
              className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Create New</span>
            </button>
          </div>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {characters.map(character => (
            <div
              key={character.id}
              onClick={() => onSelectCharacter(character)}
              className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg cursor-pointer group transition-all duration-300 hover:shadow-zinc-500/10 hover:ring-1 hover:ring-zinc-500 transform hover:-translate-y-1"
            >
              <img src={character.image} alt={character.name} className="w-full h-56 object-cover grayscale-[20%] group-hover:grayscale-0 transition-all" />
              <div className="p-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-zinc-100 group-hover:text-zinc-300 transition-colors truncate pr-2">{character.name}</h3>
                    <button
                        onClick={(e) => { e.stopPropagation(); onExportCharacter(character); }}
                        className="p-1.5 rounded-full text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                        aria-label={`Export ${character.name}`}
                        title={`Export ${character.name}`}
                    >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-sm text-zinc-400 mt-2 line-clamp-3">{character.prompt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CharacterList;
