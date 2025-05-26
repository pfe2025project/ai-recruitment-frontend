// components/candidate/SkillBadge.tsx
import React from 'react';

interface SkillBadgeProps {
  skill: string;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill }) => {
  return (
    <span 
      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mr-2 mb-2 transition-colors duration-200 hover:bg-primary-200"
      style={{
        backgroundColor: 'var(--primary-100)',
        color: 'var(--primary-700)',
      }}
    >
      {skill}
    </span>
  );
};

export default SkillBadge;