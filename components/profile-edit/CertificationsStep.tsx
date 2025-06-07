/* eslint-disable @typescript-eslint/no-explicit-any */
// components/profile-edit/CertificationsStep.tsx
import React from 'react';
import StepWrapper from './StepWrapper';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { Certification } from '@/data/defaultProfileData';

interface CertificationsStepProps {
  certifications: Certification[];
  onChange: (newCertifications: Certification[]) => void;
}

const CertificationsStep: React.FC<CertificationsStepProps> = ({ certifications, onChange }) => {
  const handleAddCertification = () => {
    onChange([...certifications, { name: '', issuingBody: '', issueDate: '' }]);
  };

  const handleRemoveCertification = (index: number) => {
    onChange(certifications.filter((_, i) => i !== index));
  };

  const handleChangeCertification = (index: number, field: keyof Certification, value: string) => {
    const newCertifications = [...certifications];
    (newCertifications[index] as any)[field] = value;
    onChange(newCertifications);
  };

  return (
    <StepWrapper
      title="Vos Certifications"
      description="Ajoutez vos certifications professionnelles pour renforcer votre profil."
    >
      <div className="space-y-6">
        {certifications.map((cert, index) => (
          <div key={index} className="border border-gray-200 p-4 rounded-lg bg-gray-50 relative">
            <h4 className="text-lg font-semibold text-neutral-800 mb-3">Certification #{index + 1}</h4>
            <Input
              id={`cert-name-${index}`}
              label="Nom de la certification"
              value={cert.name}
              onChange={(e) => handleChangeCertification(index, 'name', e.target.value)}
              placeholder="Ex: AWS Certified Solutions Architect"
            />
            <Input
              id={`issuing-body-${index}`}
              label="Organisme émetteur"
              value={cert.issuingBody}
              onChange={(e) => handleChangeCertification(index, 'issuingBody', e.target.value)}
              placeholder="Ex: Amazon Web Services"
            />
            <Input
              id={`issue-date-${index}`}
              label="Date d'émission"
              value={cert.issueDate}
              onChange={(e) => handleChangeCertification(index, 'issueDate', e.target.value)}
              placeholder="Ex: Mars 2023"
            />
            <Input
              id={`credential-url-${index}`}
              label="URL du justificatif (facultatif)"
              value={cert.credentialUrl || ''}
              onChange={(e) => handleChangeCertification(index, 'credentialUrl', e.target.value)}
              placeholder="https://www.credly.com/badge/..."
            />
            <div className="absolute top-4 right-4">
              <Button onClick={() => handleRemoveCertification(index)} variant="primary" className="p-2 rounded-full">
                <FaTrash size={16} />
              </Button>
            </div>
          </div>
        ))}
        <Button onClick={handleAddCertification} variant="secondary" className="w-full flex items-center justify-center gap-2"
             style={{ backgroundColor: 'var(--secondary-100)', color: 'var(--secondary-700)' }}>
          <FaPlus /> Ajouter une certification
        </Button>
      </div>
    </StepWrapper>
  );
};

export default CertificationsStep;