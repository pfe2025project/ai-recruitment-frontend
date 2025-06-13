// components/profile-edit/AboutStep.tsx
import React from 'react';
import StepWrapper from './StepWrapper';
import Textarea from '@/components/ui/Textarea';
import { ProfileData } from '@/data/dummyProfileData';

interface AboutStepProps {
  profileData: ProfileData;
  onChange: (field: keyof ProfileData, value: string) => void;
}

const AboutStep: React.FC<AboutStepProps> = ({ profileData, onChange }) => {
  return (
    <StepWrapper
      title="À propos de vous"
      description="Rédigez une brève description de votre parcours et de vos aspirations. Ceci est crucial pour attirer les recruteurs."
    >
      <Textarea
        id="about"
        label="Votre résumé professionnel"
        value={profileData.about}
        onChange={(e) => onChange('about', e.target.value)}
        placeholder="Développeur passionné avec X ans d'expérience..."
        rows={6}
      />
    </StepWrapper>
  );
};

export default AboutStep;