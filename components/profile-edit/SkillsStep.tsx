/* eslint-disable react/no-unescaped-entities */
// components/profile-edit/SkillsStep.tsx
import React from 'react';
import StepWrapper from './StepWrapper';
import TagInput from '@/components/ui/TagInput';
import { ProfileData } from '@/data/defaultProfileData';

interface SkillsStepProps {
  profileData: ProfileData;
  onChange: (field: keyof ProfileData, value: string[]) => void;
  extractedSkills: string[]; // Skills that were extracted from the CV
}

const SkillsStep: React.FC<SkillsStepProps> = ({ profileData, onChange, extractedSkills }) => {

    // Merge extracted skills with existing skills, prioritizing existing unique skills
    const initialSkills = Array.from(new Set([...profileData.skills, ...extractedSkills]));

    // Use a local state for the skills being edited within this step
    const [currentSkills, setCurrentSkills] = React.useState<string[]>(initialSkills);

    // Update the parent's profileData when currentSkills changes
    React.useEffect(() => {
        onChange('skills', currentSkills);
    }, [currentSkills, onChange]);


  return (
    <StepWrapper
      title="Vos Compétences"
      description="Corrigez, ajoutez ou supprimez les compétences extraites de votre CV. Elles sont essentielles pour le matching."
    >
      <TagInput
        label="Compétences techniques et soft skills"
        tags={currentSkills}
        onChange={setCurrentSkills}
        placeholder="Ex: JavaScript, React, Gestion de projet..."
      />
      {extractedSkills.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
          <p className="font-semibold mb-2">Compétences extraites de votre CV :</p>
          <div className="flex flex-wrap gap-2">
            {extractedSkills.map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                {skill}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-blue-700">Vous pouvez les modifier ou en ajouter d'autres ci-dessus.</p>
        </div>
      )}
    </StepWrapper>
  );
};

export default SkillsStep;