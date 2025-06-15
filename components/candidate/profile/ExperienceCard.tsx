// components/candidate/ExperienceCard.tsx
import React from 'react';

interface ExperienceCardProps {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  title,
  company,
  period,
  location,
  description,
}) => {
  return (
    <div 
      className="border-l-4 pl-4 py-2 relative group hover:bg-primary-50 transition-colors duration-200 rounded-md"
      style={{ borderColor: 'var(--primary-500)' }}
    >
      <h3 className="text-xl font-semibold" >
        {title}
      </h3>
      <p 
        className="text-lg font-medium mb-1" 
        style={{ color: 'var(--secondary-400)' }}

      >
        {company} - {location}
      </p>
      <p 
        className="text-md italic mb-3" 
      >
        {period}
      </p>
      <p 
        className="text-sm" 
      >
        {description}
      </p>
      
      {/* Decorative elements similar to ProfileHeader */}
      <div
        className="absolute top-0 right-0 w-3 h-3 opacity-20 rounded-full -mt-1 -mr-1"
        style={{ backgroundColor: 'var(--secondary-500)' }}
      ></div>
      
    </div>
  );
};

export default ExperienceCard;