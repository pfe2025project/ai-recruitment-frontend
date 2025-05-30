// components/ui/TagInput.tsx
// This component allows adding/removing skills as tags

import React, { useState, KeyboardEvent } from 'react';
import { FaTimes } from 'react-icons/fa';

interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (newTags: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({ label, tags, onChange, placeholder = 'Ajouter une compétence et appuyez sur Entrée' }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      e.preventDefault();
      onChange(tags.slice(0, -1));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="mb-4">
      <label className="block text-neutral-700 text-sm font-semibold mb-2">
        {label}
      </label>
      <div className="border border-gray-300 rounded-md p-2 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full cursor-pointer"
            style={{
                backgroundColor: 'var(--primary-100)',
                color: 'var(--primary-800)'
            }}
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="ml-2 text-primary-600 hover:text-primary-800 focus:outline-none"
            >
              <FaTimes size={12} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-grow p-1 outline-none bg-transparent text-neutral-800"
          style={{ minWidth: '100px' }}
        />
      </div>
      <p className="text-xs text-neutral-500 mt-1">Appuyez sur Entrée pour ajouter une compétence. Utilisez Retour arrière pour supprimer la dernière.</p>
    </div>
  );
};

export default TagInput;