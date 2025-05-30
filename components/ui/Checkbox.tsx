// components/ui/Checkbox.tsx
import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, id, className = '', ...props }) => {
  return (
    <div className="flex items-center mb-4">
      <input
        type="checkbox"
        id={id}
        className={`form-checkbox h-5 w-5 text-primary-600 rounded focus:ring-primary-500 cursor-pointer ${className}`}
        {...props}
      />
      {label && (
        <label htmlFor={id} className="ml-2 text-neutral-700 text-base cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;