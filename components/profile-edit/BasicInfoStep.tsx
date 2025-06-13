// components/profile-edit/BasicInfoStep.tsx
import React from 'react';
import StepWrapper from './StepWrapper';
import Input from '@/components/ui/Input';
import { ProfileData } from '@/data/dummyProfileData'; // Import your ProfileData interface

interface BasicInfoStepProps {
  profileData: ProfileData;
  onChange: (field: keyof ProfileData, value: string) => void;
  onContactChange: (field: keyof ProfileData['contact'], value: string) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ profileData, onChange, onContactChange }) => {
  return (
    <StepWrapper
      title="Informations de base"
      description="Mettez à jour vos informations personnelles et de contact."
    >
      <div className="space-y-6">
        <Input
          id="name"
          label="Nom complet"
          value={profileData.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Votre nom complet"
          required
        />
        <Input
          id="title"
          label="Titre du poste"
          value={profileData.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Ex: Développeur Fullstack Senior"
        />
        <Input
          id="location"
          label="Localisation"
          value={profileData.location}
          onChange={(e) => onChange('location', e.target.value)}
          placeholder="Ex: Paris, France"
        />
        <Input
          id="email"
          label="Email"
          type="email"
          value={profileData.contact.email}
          onChange={(e) => onContactChange('email', e.target.value)}
          placeholder="votre.email@example.com"
          required
        />
        <Input
          id="phone"
          label="Numéro de téléphone"
          type="tel"
          value={profileData.contact.phone}
          onChange={(e) => onContactChange('phone', e.target.value)}
          placeholder="+33 6 12 34 56 78"
        />
      </div>
    </StepWrapper>
  );
};

export default BasicInfoStep;