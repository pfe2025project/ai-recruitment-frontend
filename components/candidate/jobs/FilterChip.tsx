import React from 'react';

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, active, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
        active
          ? 'bg-blue-100 text-blue-800 border border-blue-200'
          : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
      }`}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </button>
  );
};

export default FilterChip;