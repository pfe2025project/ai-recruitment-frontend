"use client";

import React, { useEffect, useState } from 'react';
import StepWrapper from './StepWrapper';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import Select from '@/components/ui/Select';
import { useProfile } from '@/context/ProfileContext';
import { getBasicInfo } from '@/lib/api/profile';

const jobTypeOptions = [
  { value: 'Temps plein', label: 'Temps plein (CDI)' },
  { value: 'Temps partiel', label: 'Temps partiel (CDD)' },
  { value: 'Freelance', label: 'Freelance' },
  { value: 'Alternance', label: 'Alternance' },
  { value: 'Stage', label: 'Stage' },
  { value: 'Temps plein, Freelance', label: 'Temps plein, Freelance' },
];

const JobPreferencesStep: React.FC = () => {
  const { profileData, handleJobPreferencesChange } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobPreferences = async () => {
      try {
        setIsLoading(true);
        const data = await getBasicInfo();

        if (data?.jobPreferences) {
          handleJobPreferencesChange('isAvailable', data.jobPreferences.isAvailable);
          handleJobPreferencesChange('jobType', data.jobPreferences.jobType);
          handleJobPreferencesChange('preferredLocation', data.jobPreferences.preferredLocation);
          handleJobPreferencesChange('noticePeriod', data.jobPreferences.noticePeriod);
        }
      } catch (err) {
        console.error('Failed to fetch job preferences:', err);
        setError('Erreur lors du chargement des préférences.');
      } finally {
        setIsLoading(false);
      }
    };

    if(false){fetchJobPreferences();}
  }, []);

  if (isLoading) {
    return (
      <StepWrapper title="Vos Préférences d'Emploi" description="Chargement de vos informations...">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </StepWrapper>
    );
  }

  return (
    <StepWrapper
      title="Vos Préférences d'Emploi"
      description="Indiquez le type d'emploi et la localisation souhaitée pour des offres plus pertinentes."
    >
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <Checkbox
          id="isAvailable"
          label="Je suis disponible pour de nouvelles opportunités"
          checked={profileData.jobPreferences.isAvailable}
          onChange={(e) => handleJobPreferencesChange('isAvailable', e.target.checked)}
        />
        <Select
          id="jobType"
          label="Type d'emploi souhaité"
          options={jobTypeOptions}
          value={profileData.jobPreferences.jobType}
          onChange={(e) => handleJobPreferencesChange('jobType', e.target.value)}
        />
        <Input
          id="preferredLocation"
          label="Localisation préférée"
          value={profileData.jobPreferences.preferredLocation}
          onChange={(e) => handleJobPreferencesChange('preferredLocation', e.target.value)}
          placeholder="Ex: Paris (Hybride), Télétravail, Lyon..."
        />
        <Input
          id="noticePeriod"
          label="Délai de préavis"
          value={profileData.jobPreferences.noticePeriod}
          onChange={(e) => handleJobPreferencesChange('noticePeriod', e.target.value)}
          placeholder="Ex: 1 mois, Immédiatement, 3 mois"
        />
      </div>
    </StepWrapper>
  );
};

export default JobPreferencesStep;