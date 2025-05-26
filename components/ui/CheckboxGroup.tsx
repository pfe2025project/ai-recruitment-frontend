// components/ui/CheckboxGroup.tsx
import React from 'react';

interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxGroupProps {
  label: string;
  name: string; // Used for grouping checkboxes (important for accessibility)
  options: CheckboxOption[];
  selectedValues: string[]; // Array of currently selected values
  onChange: (values: string[]) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ label, name, options, selectedValues, onChange }) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      onChange([...selectedValues, value]);
    } else {
      onChange(selectedValues.filter((v) => v !== value));
    }
  };

  const primaryColor = 'var(--primary-600)'; // For checked state

  return (
    <div className="mb-6">
      <h4 className="text-lg font-semibold text-neutral-800 mb-3">{label}</h4>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center text-neutral-700 cursor-pointer">
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={handleCheckboxChange}
              className="h-5 w-5 rounded mr-3 cursor-pointer"
              // Custom styling for checkbox using accent color
              style={{
                borderColor: 'var(--gray-400)', // Default border
                backgroundColor: selectedValues.includes(option.value) ? primaryColor : 'white',
                // This will apply the primary color to the checkmark/background when checked
                // For proper custom checkbox styling, you often need more complex CSS or a headless UI library.
                // This is a basic inline attempt. Tailwind's forms plugin might be better: @tailwindcss/forms
              }}
            />
            {/* For custom checked icon, you'd typically hide the native checkbox
                and render an SVG/icon based on the `checked` state, like: */}
            {/* {selectedValues.includes(option.value) && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white absolute" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )} */}
            <span
              className="leading-tight"
              style={{ color: selectedValues.includes(option.value) ? 'var(--primary-700)' : 'var(--neutral-700)' }}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;