"use client";

import React, { useEffect, useState } from 'react';
import StepWrapper from './StepWrapper';
import Textarea from '@/components/ui/Textarea';
import { useProfile } from '@/context/ProfileContext';
import { getBasicInfo } from '@/lib/api/profile';

const AboutStep: React.FC = () => {
  const { profileData, handleProfileDataChange } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutInfo = async () => {
      try {
        setIsLoading(true);
        const data = await getBasicInfo();

        if (data?.about) {
          handleProfileDataChange('about', data.about);
        }
      } catch (err) {
        console.error('Failed to fetch about info:', err);
        setError('Erreur lors du chargement des données.');
      } finally {
        setIsLoading(false);
      }
    };

    if (false) {fetchAboutInfo();}
  }, []);

  if (isLoading) {
    return (
      <StepWrapper title="À propos de vous" description="Chargement de vos informations...">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </StepWrapper>
    );
  }

  return (
    <StepWrapper
      title="À propos de vous"
      description="Rédigez une brève description de votre parcours et de vos aspirations. Ceci est crucial pour attirer les recruteurs."
    >
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <Textarea
        id="about"
        label="Votre résumé professionnel"
        value={profileData.about}
        onChange={(e) => handleProfileDataChange('about', e.target.value)}
        placeholder="Développeur passionné avec X ans d'expérience..."
        rows={6}
      />
    </StepWrapper>
  );
};

export default AboutStep;
