/* eslint-disable react/no-unescaped-entities */
// components/candidate/CertificationCard.tsx
import React from 'react';
import ExternalLinkIcon from '../../icons/ExternalLinkIcon';

interface CertificationCardProps {
  name: string;
  issuingBody: string;
  issueDate: string;
  credentialUrl?: string; // Optional: for a link to verify the certification
}

const CertificationCard: React.FC<CertificationCardProps> = ({
  name,
  issuingBody,
  issueDate,
  credentialUrl,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <h3 className="text-xl font-semibold text-primary-600">{name}</h3>
      <p className="text-neutral-700 mt-1">
        Délivré par <span className="font-medium" style={{ color: 'var(--secondary-500)' }}
>{issuingBody}</span>
      </p>
      <p className="text-neutral-500 text-sm mt-1" >Date d'émission: {issueDate}</p>
      {credentialUrl && (
        <div className="mt-4">
          <a
            href={credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{backgroundColor:"var(--primary-50)",color:"var(--primary-600)"}}
            className="inline-flex items-center hover:border px-2 py-1 rounded-lg text-accent-500 hover:text-accent-700 font-medium transition-colors duration-200"
          >
            Voir le certificat
            <ExternalLinkIcon />
          </a>
        </div>
      )}
    </div>
  );
};

export default CertificationCard;