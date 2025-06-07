// components/profile-edit/JobPreferencesStep.tsx
import React from 'react';
import StepWrapper from './StepWrapper';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import Select from '@/components/ui/Select';
import { JobPreferences } from '@/data/defaultProfileData';

interface JobPreferencesStepProps {
  jobPreferences: JobPreferences;
  onChange: (field: keyof JobPreferences, value: string | boolean) => void;
}

const jobTypeOptions = [
  { value: 'Temps plein', label: 'Temps plein (CDI)' },
  { value: 'Temps partiel', label: 'Temps partiel (CDD)' },
  { value: 'Freelance', label: 'Freelance' },
  { value: 'Alternance', label: 'Alternance' },
  { value: 'Stage', label: 'Stage' },
  { value: 'Temps plein, Freelance', label: 'Temps plein, Freelance' }, // Example combo
];

const JobPreferencesStep: React.FC<JobPreferencesStepProps> = ({ jobPreferences, onChange }) => {
  return (
    <StepWrapper
      title="Vos Préférences d'Emploi"
      description="Indiquez le type d'emploi et la localisation souhaitée pour des offres plus pertinentes."
    >
      <div className="space-y-6">
        <Checkbox
          id="isAvailable"
          label="Je suis disponible pour de nouvelles opportunités"
          checked={jobPreferences.isAvailable}
          onChange={(e) => onChange('isAvailable', e.target.checked)}
        />
        <Select
          id="jobType"
          label="Type d'emploi souhaité"
          options={jobTypeOptions}
          value={jobPreferences.jobType}
          onChange={(e) => onChange('jobType', e.target.value)}
        />
        <Input
          id="preferredLocation"
          label="Localisation préférée"
          value={jobPreferences.preferredLocation}
          onChange={(e) => onChange('preferredLocation', e.target.value)}
          placeholder="Ex: Paris (Hybride), Télétravail, Lyon..."
        />
        <Input
          id="noticePeriod"
          label="Délai de préavis"
          value={jobPreferences.noticePeriod}
          onChange={(e) => onChange('noticePeriod', e.target.value)}
          placeholder="Ex: 1 mois, Immédiatement, 3 mois"
        />
      </div>
    </StepWrapper>
  );
};

export default JobPreferencesStep;