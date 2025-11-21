
import React from 'react';
import type { Character, ChatSession, UserProfile } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import PlusIcon from './icons/PlusIcon';
import ChatBubbleLeftRightIcon from './icons/ChatBubbleLeftRightIcon';

interface SessionContinuationProps {
  character: Character;
  recentSession: ChatSession | null;
  userProfile: UserProfile | null;
  onStartNew: () => void;
  onContinue: () => void;
  onBack: () => void;
}

const SessionContinuation: React.FC<SessionContinuationProps> = ({ character, recentSession, userProfile, onStartNew, onContinue, onBack }) => {
    const lastMessage = recentSession?.messages?.length ? recentSession.messages[recentSession.messages.length - 1] : null;
    const lastMessageText = lastMessage?.content?.[lastMessage.activeContentIndex]?.text;
    const snippet = lastMessageText ? (lastMessageText.length > 100 ? lastMessageText.substring(0, 100) + '...' : lastMessageText) : null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-zinc-800 transition-colors">
                    <ArrowLeftIcon className="w-6 h-6 text-zinc-100 hover:text-white" />
                </button>
            </div>
            
            <div className="text-center">
                <img src={character.image} alt={character.name} className="w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover mx-auto shadow-2xl mb-4 border-4 border-zinc-800" />
                <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100">Chat with {character.name}</h1>
                <p className="text-lg text-zinc-400 mt-2">How would you like to proceed?</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 mt-12 w-full max-w-3xl">
                {/* Start New Chat Option */}
                <button
                    onClick={onStartNew}
                    className="flex-1 bg-zinc-900 p-6 sm:p-8 rounded-lg shadow-lg cursor-pointer group transition-all duration-300 hover:shadow-zinc-500/20 hover:ring-1 hover:ring-zinc-500 transform hover:-translate-y-1 text-left border border-zinc-800"
                >
                    <div className="flex items-center gap-4">
                        <div className="bg-zinc-800 p-3 rounded-full group-hover:bg-zinc-100 transition-colors">
                           <PlusIcon className="w-8 h-8 text-zinc-400 group-hover:text-zinc-900 flex-shrink-0 transition-colors" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">Start New Chat</h2>
                            <p className="text-zinc-400 mt-1">Begin a fresh conversation and choose your persona.</p>
                        </div>
                    </div>
                </button>
                
                {/* Continue Last Chat Option */}
                {recentSession && userProfile && (
                    <button
                        onClick={onContinue}
                        className="flex-1 bg-zinc-900 p-6 sm:p-8 rounded-lg shadow-lg cursor-pointer group transition-all duration-300 hover:shadow-zinc-500/20 hover:ring-1 hover:ring-zinc-500 transform hover:-translate-y-1 text-left border border-zinc-800"
                    >
                         <div className="flex items-center gap-4">
                            <div className="bg-zinc-800 p-3 rounded-full group-hover:bg-zinc-100 transition-colors">
                                <ChatBubbleLeftRightIcon className="w-8 h-8 text-zinc-400 group-hover:text-zinc-900 flex-shrink-0 transition-colors" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">Continue Last Chat</h2>
                                <p className="text-zinc-400 mt-1 truncate">Resume as <span className="font-semibold text-zinc-300">{userProfile.name}</span>.</p>
                                {snippet && <p className="text-xs text-zinc-500 mt-2 italic truncate">"{snippet}"</p>}
                            </div>
                        </div>
                    </button>
                )}
            </div>
        </div>
    );
};

export default SessionContinuation;