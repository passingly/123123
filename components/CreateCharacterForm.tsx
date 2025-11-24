
import React, { useState, useRef } from 'react';
import type { Character } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ArrowUpTrayIcon from './icons/ArrowUpTrayIcon';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import PhotoIcon from './icons/PhotoIcon';

interface CreateCharacterFormProps {
  onSubmit: (character: Omit<Character, 'id'>) => void;
  onBack: () => void;
}

interface KeywordImageItem {
  id: string;
  keyword: string;
  image: string;
}

const CreateCharacterForm: React.FC<CreateCharacterFormProps> = ({ onSubmit, onBack }) => {
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState('');
  const [greeting, setGreeting] = useState('');
  const [keywordImages, setKeywordImages] = useState<KeywordImageItem[]>([]);
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
            
            // Restore keyword images if they exist
            if (data.keywordImages) {
              const loadedImages: KeywordImageItem[] = Object.entries(data.keywordImages).map(([keyword, img], index) => ({
                id: `kwi-${Date.now()}-${index}`,
                keyword,
                image: img
              }));
              setKeywordImages(loadedImages);
            } else {
              setKeywordImages([]);
            }

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

  // Keyword Image Handlers
  const addKeywordImage = () => {
    setKeywordImages([...keywordImages, { id: `kwi-${Date.now()}`, keyword: '', image: '' }]);
  };

  const removeKeywordImage = (id: string) => {
    setKeywordImages(keywordImages.filter(item => item.id !== id));
  };

  const updateKeywordImage = (id: string, field: 'keyword' | 'image', value: string) => {
    setKeywordImages(keywordImages.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleKeywordImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateKeywordImage(id, 'image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !prompt || !image) {
      setError('All fields including an image are required.');
      return;
    }
    
    // Convert array back to Record object
    const keywordImagesMap: Record<string, string> = {};
    keywordImages.forEach(item => {
      if (item.keyword.trim() && item.image) {
        keywordImagesMap[item.keyword.trim()] = item.image;
      }
    });

    setError('');
    onSubmit({ name, prompt, image, greeting, keywordImages: keywordImagesMap });
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
          <label htmlFor="image" className="block text-sm font-medium text-zinc-300 mb-2">Character Profile Image</label>
          <div className="mt-2 flex items-center gap-4">
            {image && <img src={image} alt="Preview" className="w-24 h-24 rounded-lg object-cover border border-zinc-700" />}
            <label className="cursor-pointer flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2 px-4 rounded-md transition-colors border border-zinc-700">
              <PhotoIcon className="w-5 h-5" />
              <span>Upload Image</span>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
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

        {/* Keyword Images Section */}
        <div className="border-t border-zinc-800 pt-6">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-zinc-300">Keyword Images (Optional)</label>
            <button
              type="button"
              onClick={addKeywordImage}
              className="flex items-center gap-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-md transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Keyword Image</span>
            </button>
          </div>
          <p className="text-xs text-zinc-500 mb-4">
            Map keywords to images. When the character uses <code>{'{{img::keyword}}'}</code> in chat, the image will be displayed.
          </p>
          
          <div className="space-y-3">
            {keywordImages.map((item, index) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-3 bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50 items-start sm:items-center">
                <div className="flex-1 w-full sm:w-auto">
                  <input
                    type="text"
                    value={item.keyword}
                    onChange={(e) => updateKeywordImage(item.id, 'keyword', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                    placeholder="keyword (e.g., smile)"
                  />
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                   <div className="flex items-center gap-3">
                      {item.image ? (
                        <img src={item.image} alt="Thumb" className="w-10 h-10 rounded object-cover border border-zinc-600" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-600">
                           <PhotoIcon className="w-5 h-5" />
                        </div>
                      )}
                      
                      <label className="cursor-pointer text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-200 px-2 py-1.5 rounded transition-colors whitespace-nowrap">
                        Select Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleKeywordImageUpload(item.id, e)}
                          className="hidden"
                        />
                      </label>
                   </div>

                   <button
                    type="button"
                    onClick={() => removeKeywordImage(item.id)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-900 rounded transition-colors"
                    title="Remove"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {keywordImages.length === 0 && (
              <div className="text-center py-4 bg-zinc-800/30 rounded-lg border border-dashed border-zinc-800 text-zinc-600 text-sm">
                No keyword images added.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
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
