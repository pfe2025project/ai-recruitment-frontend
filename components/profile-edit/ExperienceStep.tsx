/* eslint-disable @typescript-eslint/no-explicit-any */
// components/profile-edit/ExperienceStep.tsx
import React from 'react';
import StepWrapper from './StepWrapper';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { Experience } from '@/data/defaultProfileData';

interface ExperienceStepProps {
  experiences: Experience[];
  onChange: (newExperiences: Experience[]) => void;
}

const ExperienceStep: React.FC<ExperienceStepProps> = ({ experiences, onChange }) => {
  const handleAddExperience = () => {
    onChange([...experiences, { title: '', company: '', period: '', location: '', description: '' }]);
  };

  const handleRemoveExperience = (index: number) => {
    onChange(experiences.filter((_, i) => i !== index));
  };

  const handleChangeExperience = (index: number, field: keyof Experience, value: string) => {
    const newExperiences = [...experiences];
    (newExperiences[index] as any)[field] = value;
    onChange(newExperiences);
  };

  return (
    <StepWrapper
      title="Vos Expériences Professionnelles"
      description="Listez vos postes et responsabilités pour montrer votre parcours."
    >
      <div className="space-y-6">
        {experiences.map((exp, index) => (
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
              <Button onClick={() => handleRemoveExperience(index)} variant="primary" className="p-2 rounded-full">
                <FaTrash size={16} />
              </Button>
            </div>
          </div>
        ))}
        <Button onClick={handleAddExperience} variant="secondary" className="w-full flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--secondary-100)', color: 'var(--secondary-700)' }}>
          <FaPlus /> Ajouter une expérience
        </Button>
      </div>
    </StepWrapper>
  );
};

export default ExperienceStep;