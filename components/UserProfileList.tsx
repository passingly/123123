
import React from 'react';
import type { UserProfile } from '../types';
import PlusIcon from './icons/PlusIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import UserIcon from './icons/UserIcon';

interface UserProfileListProps {
  profiles: UserProfile[];
  onSelectProfile: (profile: UserProfile) => void;
  onNavigateToCreate: () => void;
  onBack: () => void;
}

const UserProfileList: React.FC<UserProfileListProps> = ({ profiles, onSelectProfile, onNavigateToCreate, onBack }) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-zinc-800 mr-4">
          <ArrowLeftIcon className="w-6 h-6 text-zinc-100 hover:text-white" />
        </button>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100">Choose Your Persona</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Create New Profile Card */}
        <div
          onClick={onNavigateToCreate}
          className="bg-zinc-900 rounded-lg shadow-lg cursor-pointer group transition-all duration-300 hover:shadow-zinc-500/10 hover:ring-1 hover:ring-zinc-500 transform hover:-translate-y-1 flex flex-col items-center justify-center p-4 min-h-[260px] border-2 border-dashed border-zinc-700 hover:border-zinc-500"
        >
          <PlusIcon className="w-12 h-12 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
          <h3 className="text-xl font-bold text-zinc-400 group-hover:text-zinc-200 mt-4 transition-colors">Create New Persona</h3>
        </div>

        {/* Existing Profile Cards */}
        {profiles.map(profile => (
          <div
            key={profile.id}
            onClick={() => onSelectProfile(profile)}
            className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg cursor-pointer group transition-all duration-300 hover:shadow-zinc-500/10 hover:ring-1 hover:ring-zinc-500 transform hover:-translate-y-1"
          >
            <div className="p-4 bg-zinc-800 flex items-center justify-center h-56 group-hover:bg-zinc-700 transition-colors">
                <UserIcon className="w-24 h-24 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold text-zinc-100 group-hover:text-zinc-300 transition-colors">{profile.name}</h3>
              <p className="text-sm text-zinc-400 mt-2 line-clamp-3">{profile.prompt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfileList;