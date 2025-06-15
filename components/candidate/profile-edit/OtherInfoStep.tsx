"use client";

import React, { useEffect, useState } from 'react';
import StepWrapper from './StepWrapper';
import Input from '@/components/ui/Input';
import { useProfile } from '@/context/ProfileContext';
import { getBasicInfo } from '@/lib/api/profile';

const OtherInfoStep: React.FC = () => {
  const { profileData, handleContactInfoChange } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setIsLoading(true);
        const data = await getBasicInfo();

        if (data?.contact) {
          handleContactInfoChange('linkedin', data.contact.linkedin || '');
          handleContactInfoChange('github', data.contact.github || '');
          handleContactInfoChange('website', data.contact.website || '');
        }
      } catch (err) {
        console.error('Failed to fetch contact info:', err);
        setError('Erreur lors du chargement des informations de contact.');
      } finally {
        setIsLoading(false);
      }
    };

    if(false){fetchContactInfo();}
  }, []);

  if (isLoading) {
    return (
      <StepWrapper title="Informations complémentaires" description="Chargement de vos informations...">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </StepWrapper>
    );
  }

  return (
    <StepWrapper
      title="Informations complémentaires"
      description="Partagez vos liens professionnels et personnels pour donner une vue d'ensemble de votre travail."
    >
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <Input
          id="linkedin"
          label="Lien LinkedIn (facultatif)"
          value={profileData.contact.linkedin || ''}
          onChange={(e) => handleContactInfoChange('linkedin', e.target.value)}
          placeholder="https://www.linkedin.com/in/votreprofil"
        />
        <Input
          id="github"
          label="Lien GitHub (facultatif)"
          value={profileData.contact.github || ''}
          onChange={(e) => handleContactInfoChange('github', e.target.value)}
          placeholder="https://github.com/votrenomutilisateur"
        />
        <Input
          id="website"
          label="Lien de votre Portfolio / Site web (facultatif)"
          value={profileData.contact.website || ''}
          onChange={(e) => handleContactInfoChange('website', e.target.value)}
          placeholder="https://www.votreportfolio.com"
        />
      </div>
    </StepWrapper>
  );
};

export default OtherInfoStep;