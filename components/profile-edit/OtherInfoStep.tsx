// components/profile-edit/OtherInfoStep.tsx
import React from 'react';
import StepWrapper from './StepWrapper';
import Input from '@/components/ui/Input';
import { ProfileData } from '@/data/defaultProfileData';

interface OtherInfoStepProps {
  profileData: ProfileData;
  onContactChange: (field: keyof ProfileData['contact'], value: string) => void;
}

const OtherInfoStep: React.FC<OtherInfoStepProps> = ({ profileData, onContactChange }) => {
  return (
    <StepWrapper
      title="Informations complémentaires"
      description="Partagez vos liens professionnels et personnels pour donner une vue d'ensemble de votre travail."
    >
      <div className="space-y-6">
        <Input
          id="linkedin"
          label="Lien LinkedIn (facultatif)"
          value={profileData.contact.linkedin || ''}
          onChange={(e) => onContactChange('linkedin', e.target.value)}
          placeholder="https://www.linkedin.com/in/votreprofil"
        />
        <Input
          id="github"
          label="Lien GitHub (facultatif)"
          value={profileData.contact.github || ''}
          onChange={(e) => onContactChange('github', e.target.value)}
          placeholder="https://github.com/votrenomutilisateur"
        />
        <Input
          id="website"
          label="Lien de votre Portfolio / Site web (facultatif)"
          value={profileData.contact.website || ''}
          onChange={(e) => onContactChange('website', e.target.value)}
          placeholder="https://www.votreportfolio.com"
        />
      </div>
    </StepWrapper>
  );
};

export default OtherInfoStep;