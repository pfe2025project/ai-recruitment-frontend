// components/ui/Textarea.tsx
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  id: string;
  className?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, id, className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-neutral-700 text-sm font-semibold mb-2">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-200 resize-y min-h-[100px] cursor-pointer ${className}`}
        {...props}
      ></textarea>
    </div>
  );
};

export default Textarea;