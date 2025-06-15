"use client";

import React, { useEffect, useState } from 'react';
import StepWrapper from './StepWrapper';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useProfile } from '@/context/ProfileContext';
import { getBasicInfo } from '@/lib/api/profile';

interface Experience {
  id?: string;
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
}

const ExperienceStep: React.FC = () => {
  const { profileData, handleProfileDataChange } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperienceInfo = async () => {
      try {
        setIsLoading(true);
        const data = await getBasicInfo();

        if (data?.experiences) {
          handleProfileDataChange('experiences', data.experiences);
        }
      } catch (err) {
        console.error('Failed to fetch experience info:', err);
        setError('Erreur lors du chargement des données.');
      } finally {
        setIsLoading(false);
      }
    };

    if(false){fetchExperienceInfo();}
  }, []);

  const handleAddExperience = () => {
    const newExperiences = [
      ...profileData.experiences,
      { 
        id: Date.now().toString(),
        title: '', 
        company: '', 
        period: '', 
        location: '',
        description: '' 
      }
    ];
    handleProfileDataChange('experiences', newExperiences);
  };

  const handleRemoveExperience = (index: number) => {
    const newExperiences = profileData.experiences.filter((_, i) => i !== index);
    handleProfileDataChange('experiences', newExperiences);
  };

  const handleChangeExperience = (index: number, field: keyof Experience, value: string) => {
    const newExperiences = [...profileData.experiences];
    newExperiences[index] = {
      ...newExperiences[index],
      [field]: value
    };
    handleProfileDataChange('experiences', newExperiences);
  };

  if (isLoading) {
    return (
      <StepWrapper title="Vos Expériences Professionnelles" description="Chargement de vos informations...">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </StepWrapper>
    );
  }

  return (
    <StepWrapper
      title="Vos Expériences Professionnelles"
      description="Listez vos postes et responsabilités pour montrer votre parcours."
    >
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {profileData.experiences.map((exp, index) => (
          <div key={index} className="border border-gray-200 p-4 rounded-lg bg-gray-50 relative">
            <h4 className="text-lg font-semibold text-neutral-800 mb-3">Expérience #{index + 1}</h4>
            <Input
              id={`title-${index}`}
              label="Titre du poste"
              value={exp.title}
              onChange={(e) => handleChangeExperience(index, 'title', e.target.value)}
              placeholder="Ex: Développeur Fullstack Senior"
            />
            <Input
              id={`company-${index}`}
              label="Entreprise"
              value={exp.company}
              onChange={(e) => handleChangeExperience(index, 'company', e.target.value)}
              placeholder="Ex: Innovate Solutions"
            />
            <Input
              id={`period-exp-${index}`}
              label="Période"
              value={exp.period}
              onChange={(e) => handleChangeExperience(index, 'period', e.target.value)}
              placeholder="Ex: Jan 2022 - Présent"
            />
            <Input
              id={`location-exp-${index}`}
              label="Lieu"
              value={exp.location}
              onChange={(e) => handleChangeExperience(index, 'location', e.target.value)}
              placeholder="Ex: Paris, France"
            />
            <Textarea
              id={`description-exp-${index}`}
              label="Description des responsabilités"
              value={exp.description}
              onChange={(e) => handleChangeExperience(index, 'description', e.target.value)}
              placeholder="Développement d'applications web critiques..."
              rows={4}
            />
            <div className="absolute top-4 right-4">
              <Button 
                onClick={() => handleRemoveExperience(index)} 
                variant="primary" 
                className="p-2 rounded-full"
              >
                <FaTrash size={16} />
              </Button>
            </div>
          </div>
        ))}
        <Button 
          onClick={handleAddExperience} 
          variant="secondary" 
          className="w-full flex items-center justify-center gap-2"
          style={{ backgroundColor: 'var(--secondary-100)', color: 'var(--secondary-700)' }}
        >
          <FaPlus /> Ajouter une expérience
        </Button>
      </div>
    </StepWrapper>
  );
};

export default ExperienceStep;