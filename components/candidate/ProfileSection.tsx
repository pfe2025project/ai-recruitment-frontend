// components/candidate/ProfileSection.tsx
import React from 'react';

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
  IconComponent?: React.FC<{ className?: string; color?: string }>; // Accepte un composant d'icône
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children, IconComponent }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold text-neutral-800 mb-6 flex items-center border-b pb-4 border-neutral-200">
        {IconComponent && (
          <IconComponent
            className="w-8 h-8 mr-3" // Classes Tailwind pour la taille et la marge
            color="var(--primary-600)" // Couleur via variable CSS
          />
        )}
        {title}
      </h2>
      <div className="text-neutral-700 leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default ProfileSection;