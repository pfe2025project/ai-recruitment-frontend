// components/candidate/JobPreferencesCard.tsx
import React from 'react';

interface JobPreferencesCardProps {
  isAvailable: boolean;
  jobType: string;
  preferredLocation: string;
  noticePeriod?: string; // Optional
}

const JobPreferencesCard: React.FC<JobPreferencesCardProps> = ({
  isAvailable,
  jobType,
  preferredLocation,
  noticePeriod,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md my-8">
      <h3 className="text-xl font-semibold text-neutral-800 mb-4 flex items-center">
       
        Préférences de recherche
      </h3>
      <ul className="space-y-2 text-neutral-700">
        <li>
          <span className="font-semibold">Disponibilité:</span>{' '}
          <span
            className={`font-medium ${
              isAvailable ? 'text-green-600' : 'text-orange-600'
            }`}
          >
            {isAvailable ? 'Ouvert aux opportunités' : 'Non disponible actuellement'}
          </span>
        </li>
        <li>
          <span className="font-semibold">Type de poste:</span> {jobType}
        </li>
        <li>
          <span className="font-semibold">Localisation préférée:</span> {preferredLocation}
        </li>
        {noticePeriod && (
          <li>
            <span className="font-semibold">Préavis:</span> {noticePeriod}
          </li>
        )}
      </ul>
    </div>
  );
};

export default JobPreferencesCard;