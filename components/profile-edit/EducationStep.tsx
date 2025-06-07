/* eslint-disable @typescript-eslint/no-explicit-any */
// components/profile-edit/EducationStep.tsx
import React from 'react';
import StepWrapper from './StepWrapper';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { Education } from '@/data/defaultProfileData';

interface EducationStepProps {
  education: Education[];
  onChange: (newEducation: Education[]) => void;
}

const EducationStep: React.FC<EducationStepProps> = ({ education, onChange }) => {
  const handleAddEducation = () => {
    onChange([...education, { degree: '', institution: '', period: '', location: '' }]);
  };

  const handleRemoveEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  const handleChangeEducation = (index: number, field: keyof Education, value: string) => {
    const newEducation = [...education];
    (newEducation[index] as any)[field] = value;
    onChange(newEducation);
  };

  return (
    <StepWrapper
      title="Votre Formation"
      description="Ajoutez les détails de vos diplômes et certifications académiques."
    >
      <div className="space-y-6">
        {education.map((edu, index) => (
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
              <Button onClick={() => handleRemoveEducation(index)} variant="primary" className="p-2 rounded-full">
                <FaTrash size={16} />
              </Button>
            </div>
          </div>
        ))}
        <Button onClick={handleAddEducation} variant="secondary" className="w-full flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--secondary-100)', color: 'var(--secondary-700)' }}>
          <FaPlus /> Ajouter une formation
        </Button>
      </div>
    </StepWrapper>
  );
};

export default EducationStep;