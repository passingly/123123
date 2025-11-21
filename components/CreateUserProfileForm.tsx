
import React, { useState } from 'react';
import type { UserProfile } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface CreateUserProfileFormProps {
  onSubmit: (profile: Omit<UserProfile, 'id'>) => void;
  onBack: () => void;
}

const CreateUserProfileForm: React.FC<CreateUserProfileFormProps> = ({ onSubmit, onBack }) => {
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !prompt) {
      setError('All fields are required.');
      return;
    }
    setError('');
    onSubmit({ name, prompt });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-zinc-800 mr-4">
          <ArrowLeftIcon className="w-6 h-6 text-zinc-300" />
        </button>
        <h1 className="text-3xl font-bold text-zinc-100">Create New Persona</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 p-8 rounded-lg shadow-lg border border-zinc-800">
        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-md">{error}</div>}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">Your Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-zinc-500 text-zinc-100 placeholder-zinc-500"
            placeholder="e.g., Kai, the Bold Explorer"
          />
        </div>

        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-zinc-300 mb-2">Your Persona / Description</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-zinc-500 text-zinc-100 placeholder-zinc-500"
            placeholder="Describe your personality, background, and how you act..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-zinc-100 hover:bg-white text-zinc-900 font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105"
          >
            Create Persona
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserProfileForm;
