// components/ui/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  horizontal?: boolean;
}

const Input: React.FC<InputProps> = ({ label, id, horizontal = false, ...props }) => {
  return (
    <div className={`mb-4 ${horizontal ? 'flex items-start gap-4' : ''}`}>
      {label && (
        <label
          htmlFor={id}
          className={`text-sm font-medium text-neutral-700 text-left ${horizontal ? 'w-32' : 'block mb-1'}`}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        style={{ '--tw-ring-color': 'var(--primary-500)', '--tw-border-color': 'var(--primary-500)' }}
        {...props}
      />
    </div>
  );
};

export default Input;
