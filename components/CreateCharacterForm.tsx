
import React, { useState, useRef } from 'react';
import type { Character } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ArrowUpTrayIcon from './icons/ArrowUpTrayIcon';

interface CreateCharacterFormProps {
  onSubmit: (character: Omit<Character, 'id'>) => void;
  onBack: () => void;
}

const CreateCharacterForm: React.FC<CreateCharacterFormProps> = ({ onSubmit, onBack }) => {
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState('');
  const [greeting, setGreeting] = useState('');
  const [error, setError] = useState('');
  const importFileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result;
          if (typeof text !== 'string') {
            throw new Error("Failed to read file content.");
          }
          const data = JSON.parse(text) as Partial<Character>;

          if (data.name && data.prompt && data.image) {
            setName(data.name);
            setPrompt(data.prompt);
            setImage(data.image);
            setGreeting(data.greeting || ''); // Handle optional greeting
            setError(''); // Clear previous errors
          } else {
            throw new Error("Invalid character file format. Required fields: name, prompt, image.");
          }
        } catch (err: any) {
          console.error("Failed to import character file:", err);
          setError(`Import failed: ${err.message}`);
        }
      };
      reader.onerror = () => {
        setError("Error reading the selected file.");
      }
      reader.readAsText(file);
      e.target.value = ''; // Reset file input
    }
  };

  const handleImportClick = () => {
    importFileRef.current?.click();
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !prompt || !image) {
      setError('All fields including an image are required.');
      return;
    }
    setError('');
    onSubmit({ name, prompt, image, greeting });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <input
        type="file"
        ref={importFileRef}
        onChange={handleFileImport}
        className="hidden"
        accept=".json"
      />
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-zinc-800 mr-4">
            <ArrowLeftIcon className="w-6 h-6 text-zinc-300" />
          </button>
          <h1 className="text-3xl font-bold text-zinc-100">Create New Character</h1>
        </div>
        <button
          type="button"
          onClick={handleImportClick}
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
        >
          <ArrowUpTrayIcon className="w-5 h-5" />
          <span>Import</span>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 p-8 rounded-lg shadow-lg border border-zinc-800">
        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-md">{error}</div>}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">Character Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-zinc-500 text-zinc-100 placeholder-zinc-500"
            placeholder="e.g., Luna, the Space Explorer"
          />
        </div>

        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-zinc-300 mb-2">Role-playing Prompt</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-zinc-500 text-zinc-100 placeholder-zinc-500"
            placeholder="Describe your character's personality and background..."
          />
        </div>

        <div>
          <label htmlFor="greeting" className="block text-sm font-medium text-zinc-300 mb-2">First Greeting (Optional)</label>
          <textarea
            id="greeting"
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-zinc-500 text-zinc-100 placeholder-zinc-500"
            placeholder="The first thing your character says when a new chat begins..."
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-zinc-300 mb-2">Character Image</label>
          <div className="mt-2 flex items-center gap-4">
            {image && <img src={image} alt="Preview" className="w-24 h-24 rounded-lg object-cover" />}
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-900 hover:file:bg-zinc-200"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-zinc-100 hover:bg-white text-zinc-900 font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105"
          >
            Create Character
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCharacterForm;
