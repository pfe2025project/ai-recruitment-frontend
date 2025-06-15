"use client";

import React, { useEffect, useState } from 'react';
import StepWrapper from './StepWrapper';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useProfile } from '@/context/ProfileContext';
import { getBasicInfo } from '@/lib/api/profile';

interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  location: string;
  description?: string;
}

const EducationStep: React.FC = () => {
  const { profileData, handleProfileDataChange } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEducationInfo = async () => {
      try {
        setIsLoading(true);
        const data = await getBasicInfo();

        if (data?.education) {
          handleProfileDataChange('education', data.education);
        }
      } catch (err) {
        console.error('Failed to fetch education info:', err);
        setError('Erreur lors du chargement des données.');
      } finally {
        setIsLoading(false);
      }
    };

    if(false){fetchEducationInfo();}
  }, []);

  const handleAddEducation = () => {
    const newEducation = [
      ...profileData.education,
      { 
        id: Date.now().toString(),
        degree: '', 
        institution: '', 
        period: '', 
        location: '',
        description: ''
      }
    ];
    handleProfileDataChange('education', newEducation);
  };

  const handleRemoveEducation = (index: number) => {
    const newEducation = profileData.education.filter((_, i) => i !== index);
    handleProfileDataChange('education', newEducation);
  };

  const handleChangeEducation = (index: number, field: keyof Education, value: string) => {
    const newEducation = [...profileData.education];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value
    };
    handleProfileDataChange('education', newEducation);
  };

  if (isLoading) {
    return (
      <StepWrapper title="Votre Formation" description="Chargement de vos informations...">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </StepWrapper>
    );
  }

  return (
    <StepWrapper
      title="Votre Formation"
      description="Ajoutez les détails de vos diplômes et certifications académiques."
    >
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {profileData.education.map((edu, index) => (
          <div key={index} className="border border-gray-200 p-4 rounded-lg bg-gray-50 relative">
            <h4 className="text-lg font-semibold text-neutral-800 mb-3">Formation #{index + 1}</h4>
            <Input
              id={`degree-${index}`}
              label="Diplôme/Titre"
              value={edu.degree}
              onChange={(e) => handleChangeEducation(index, 'degree', e.target.value)}
              placeholder="Ex: Master en Informatique"
            />
            <Input
              id={`institution-${index}`}
              label="Institution"
              value={edu.institution}
              onChange={(e) => handleChangeEducation(index, 'institution', e.target.value)}
              placeholder="Ex: Université Paris-Saclay"
            />
            <Input
              id={`period-edu-${index}`}
              label="Période"
              value={edu.period}
              onChange={(e) => handleChangeEducation(index, 'period', e.target.value)}
              placeholder="Ex: 2016 - 2018"
            />
            <Input
              id={`location-edu-${index}`}
              label="Lieu"
              value={edu.location}
              onChange={(e) => handleChangeEducation(index, 'location', e.target.value)}
              placeholder="Ex: Orsay, France"
            />
            <Textarea
              id={`description-edu-${index}`}
              label="Description (facultatif)"
              value={edu.description || ''}
              onChange={(e) => handleChangeEducation(index, 'description', e.target.value)}
              placeholder="Spécialisation en..."
            />
            <div className="absolute top-4 right-4">
              <Button 
                onClick={() => handleRemoveEducation(index)} 
                variant="primary" 
                className="p-2 rounded-full"
              >
                <FaTrash size={16} />
              </Button>
            </div>
          </div>
        ))}
        <Button 
          onClick={handleAddEducation} 
          variant="secondary" 
          className="w-full flex items-center justify-center gap-2"
          style={{ backgroundColor: 'var(--secondary-100)', color: 'var(--secondary-700)' }}
        >
          <FaPlus /> Ajouter une formation
        </Button>
      </div>
    </StepWrapper>
  );
};

export default EducationStep;