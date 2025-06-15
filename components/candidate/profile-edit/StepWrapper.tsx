// components/profile-edit/StepWrapper.tsx
// A common wrapper for all step components for consistent styling

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StepWrapperProps {
  title: string;
  description: string;
  children: ReactNode;
}

const StepWrapper: React.FC<StepWrapperProps> = ({ title, description, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg p-6 pb-0 flex flex-col h-full"
    >
      <h2 className="text-3xl font-bold mb-2 text-neutral-800">{title}</h2>
      <p className="text-neutral-600 mb-6">{description}</p>
      <div className="flex-grow overflow-y-auto pr-2"> {/* Added overflow for content */}
        {children}
      </div>
    </motion.div>
  );
};

export default StepWrapper;