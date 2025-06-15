import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

interface TagInputProps {
  label?: string;
  tags: string[];
  onChange: (newTags: string[]) => void;
  onRemove: (tag: string) => void;
  onEdit?: (oldTag: string, newTag: string) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  label,
  tags,
  onChange,
  onRemove,
  onEdit,
  placeholder = 'Add a tag and press Enter',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [editingTag, setEditingTag] = useState<{index: number, value: string} | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (editingTag) {
        // Handle tag edit
        const newValue = inputValue.trim();
        if (newValue && newValue !== editingTag.value) {
          if (onEdit) {
            onEdit(editingTag.value, newValue);
          } else {
            const newTags = [...tags];
            newTags[editingTag.index] = newValue;
            onChange(newTags);
          }
        }
        setEditingTag(null);
      } else {
        // Handle new tag
        const newTag = inputValue.trim();
        if (newTag && !tags.includes(newTag)) {
          onChange([...tags, newTag]);
        }
      }
      
      setInputValue('');
    } else if (e.key === 'Escape') {
      if (editingTag) {
        setEditingTag(null);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      onRemove(tags[tags.length - 1]);
    }
  };

  const startEditing = (index: number, tag: string) => {
    setEditingTag({ index, value: tag });
    setInputValue(tag);
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (!editingTag) {
      inputRef.current?.focus();
    }
  }, [editingTag]);

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-neutral-700 text-sm font-semibold mb-2">
          {label}
        </label>
      )}
      
      <div className="border border-gray-300 rounded-md p-2 flex flex-wrap gap-2 min-h-[44px]">
        {tags.map((tag, index) => (
          editingTag?.index === index ? (
            <input
              key={`edit-${index}`}
              ref={editInputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => setEditingTag(null)}
              className="px-2 py-1 text-sm border border-blue-400 rounded-md shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              style={{ minWidth: '100px' }}
              autoFocus
            />
          ) : (
            <span
              key={`tag-${index}`}
              onDoubleClick={() => startEditing(index, tag)}
              className="flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full hover:bg-blue-200 transition-colors cursor-pointer"
            >
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(tag);
                }}
                className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                aria-label={`Remove ${tag}`}
              >
                <FaTimes size={12} />
              </button>
            </span>
          )
        ))}
        
        {!editingTag && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-grow px-2 py-1 outline-none bg-transparent text-neutral-800 placeholder-gray-400"
            style={{ minWidth: '100px' }}
          />
        )}
      </div>
      
      <p className="text-xs text-neutral-500 mt-1">
        {tags.length > 0 ? (
          <>Double-click to edit. {!editingTag && 'Press Enter to add, Backspace to remove last.'}</>
        ) : (
          'Press Enter to add tags'
        )}
      </p>
    </div>
  );
};

export default TagInput;