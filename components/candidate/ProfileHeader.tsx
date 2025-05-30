// components/candidate/ProfileHeader.tsx
import React from 'react';
import Image from 'next/image';
import Button from '../ui/Button';

interface ProfileHeaderProps {
  name: string;
  title: string;
  location: string;
  avatarUrl: string;
  onEditProfile: () => void;
  onUploadCV: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  title,
  location,
  avatarUrl,
  onEditProfile,
  onUploadCV,
}) => {
  return (
    // Utilisation des variables CSS pour le dégradé de fond
    <div
      className="text-white p-8 rounded-lg shadow-lg relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to right, var(--primary-600), var(--secondary-700))`
      }}
    >
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 relative z-10">
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl">
          <Image
            src={avatarUrl || 'https://via.placeholder.com/150/F8F8F8/888888?text=JP'} // Placeholder
            alt={`${name}'s avatar`}
            layout="fill"
            objectFit="cover"
            priority // Prioritize loading for LCP
          />
        </div>
        <div className="text-center md:text-left flex-grow">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{name}</h1>
          {/* Texte avec une teinte de couleur primaire plus claire */}
          <p className="text-xl md:text-2xl mb-2" style={{ color: 'var(--primary-100)' }}>{title}</p>
          {/* Icône et texte avec une teinte de couleur primaire légèrement plus foncée */}
          <p className="text-lg flex items-center justify-center md:justify-start" style={{ color: 'var(--primary-200)' }}>
            <span className="material-icons-outlined text-xl mr-2">location_on</span>
            {location}
          </p>
        </div>
        <div className="flex flex-col space-y-4 w-full md:w-auto mt-6 md:mt-0">
          {/* Bouton d'édition: fond blanc, texte couleur primaire foncée, hover couleur primaire très claire */}
          <Button onClick={onEditProfile} variant="secondary" className="bg-white px-8 cursor-pointer" 
                  style={{ color: 'var(--primary-700)', '--tw-bg-opacity': '1', '--tw-text-opacity': '1' }}>
            <span className="material-icons-outlined text-lg mr-2">edit</span>
            Éditer le profil
          </Button>
          {/* Bouton d'upload: bordure blanche, texte blanc, hover fond blanc, texte couleur primaire foncée */}
          <Button onClick={onUploadCV} variant="outline" className="border-white hover:text-[var(--primary-700)] cursor-pointer text-white px-8 hover:bg-white" 
                  style={{ '--tw-text-opacity': '1', '--tw-border-opacity': '1', '--tw-bg-opacity': '1' }}>
            Mettre à jour le CV
          </Button>
        </div>
      </div>
      {/* Background shape - Utilisation des variables CSS */}
      <div
        className="absolute top-0 right-0 w-48 h-48 opacity-20 rounded-full -mt-20 -mr-20 transform rotate-45"
        style={{ backgroundColor: 'var(--secondary-500)' }}
      ></div>
      <div
        className="absolute bottom-0 left-0 w-60 h-60 opacity-20 rounded-full -mb-32 -ml-32 transform -rotate-30"
        style={{ backgroundColor: 'var(--primary-500)' }}
      ></div>
    </div>
  );
};

export default ProfileHeader;