
import React, { useState, useMemo } from 'react';
import type { ChatSession, Character, UserProfile } from '../types';
import XMarkIcon from './icons/XMarkIcon';
import TrashIcon from './icons/TrashIcon';
import UserIcon from './icons/UserIcon';

interface SessionHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  characters: Character[];
  userProfiles: UserProfile[];
  onResumeSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

const SessionHistoryPanel: React.FC<SessionHistoryPanelProps> = ({
  isOpen,
  onClose,
  sessions,
  characters,
  userProfiles,
  onResumeSession,
  onDeleteSession,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const charactersById = useMemo(() => 
    characters.reduce((acc, char) => {
      acc[char.id] = char;
      return acc;
    }, {} as Record<string, Character>), [characters]);

  const profilesById = useMemo(() =>
    userProfiles.reduce((acc, profile) => {
      acc[profile.id] = profile;
      return acc;
    }, {} as Record<string, UserProfile>), [userProfiles]);
    
  const filteredSessions = useMemo(() => {
    const sortedSessions = [...sessions].sort((a, b) => b.lastUpdated - a.lastUpdated);
    if (!searchTerm.trim()) {
      return sortedSessions;
    }
    return sortedSessions.filter(session => {
      const character = charactersById[session.characterId];
      const userProfile = profilesById[session.userProfileId];
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      const characterNameMatch = character?.name.toLowerCase().includes(lowerSearchTerm);
      const profileNameMatch = userProfile?.name.toLowerCase().includes(lowerSearchTerm);
      
      return characterNameMatch || profileNameMatch;
    });
  }, [sessions, searchTerm, charactersById, profilesById]);


  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div
        className={`fixed top-0 left-0 h-full w-full max-w-md bg-zinc-900 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-panel-title"
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 id="history-panel-title" className="text-2xl font-bold text-zinc-100">
              Conversation History
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close history panel"
            >
              <XMarkIcon className="w-6 h-6 text-zinc-100 hover:text-white" />
            </button>
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by character or persona..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-zinc-500 mb-6 text-zinc-100"
          />
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {filteredSessions.length === 0 ? (
              <div className="flex items-center justify-center h-full text-zinc-500">
                <p>No conversations found.</p>
              </div>
            ) : (
              filteredSessions.map(session => {
                const character = charactersById[session.characterId];
                const userProfile = profilesById[session.userProfileId];
                if (!character || !userProfile) return null;

                const lastMsg = session.messages.length > 0 ? session.messages[session.messages.length - 1] : null;
                const lastContent = lastMsg?.content?.[lastMsg.activeContentIndex];
                const previewText = lastContent?.text || (lastContent?.imageUrl ? '[Image]' : '');

                return (
                  <div key={session.id} className="bg-zinc-800 p-3 rounded-lg flex items-center justify-between gap-4 group hover:bg-zinc-700 transition-colors">
                    <button onClick={() => onResumeSession(session.id)} className="flex items-center gap-3 text-left flex-1 min-w-0">
                      <img src={character.image} alt={character.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-zinc-200 truncate group-hover:text-white">{character.name}</p>
                        <div className="flex items-center gap-1.5 text-sm text-zinc-400 mb-1">
                            <UserIcon className="w-3.5 h-3.5 flex-shrink-0" />
                            <p className="truncate">{userProfile.name}</p>
                        </div>
                        {previewText && (
                            <p className="text-xs text-zinc-500 truncate">{previewText}</p>
                        )}
                      </div>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                      className="p-2 rounded-full text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-colors flex-shrink-0"
                      aria-label={`Delete conversation with ${character.name}`}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SessionHistoryPanel;
