"use client";

import React, { useEffect, useState } from 'react';
import StepWrapper from './StepWrapper';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useProfile } from '@/context/ProfileContext';
import { getBasicInfo } from '@/lib/api/profile';

const CertificationStep: React.FC = () => {
  const { profileData, handleProfileDataChange } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificationInfo = async () => {
      try {
        setIsLoading(true);
        const data = await getBasicInfo();

        if (data?.certifications) {
          handleProfileDataChange('certifications', data.certifications);
        }
      } catch (err) {
        console.error('Failed to fetch certification info:', err);
        setError('Erreur lors du chargement des données.');
      } finally {
        setIsLoading(false);
      }
    };

    if (false) {fetchCertificationInfo();}
  }, []);

  const handleAddCertification = () => {
    const newCertification = [
      ...profileData.certifications,
      { 
        name: '', 
        issuingBody: '', 
        issueDate: '',
        credentialUrl: ''
      }
    ];
    handleProfileDataChange('certifications', newCertification);
  };

  const handleRemoveCertification = (index: number) => {
    const newCertification = profileData.certifications.filter((_, i) => i !== index);
    handleProfileDataChange('certifications', newCertification);
  };

  const handleChangeCertification = (
    index: number, 
    field: keyof typeof profileData.certifications[0], 
    value: string
  ) => {
    const newCertification = [...profileData.certifications];
    newCertification[index] = {
      ...newCertification[index],
      [field]: value
    };
    handleProfileDataChange('certifications', newCertification);
  };

  if (isLoading) {
    return (
      <StepWrapper title="Vos Certifications" description="Chargement de vos informations...">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </StepWrapper>
    );
  }

  return (
    <StepWrapper
      title="Vos Certifications"
      description="Ajoutez vos certifications professionnelles pour renforcer votre profil."
    >
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {profileData.certifications.map((cert, index) => (
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
              <Button 
                onClick={() => handleRemoveCertification(index)} 
                variant="primary" 
                className="p-2 rounded-full"
              >
                <FaTrash size={16} />
              </Button>
            </div>
          </div>
        ))}
        <Button 
          onClick={handleAddCertification} 
          variant="secondary" 
          className="w-full flex items-center justify-center gap-2"
          style={{ backgroundColor: 'var(--secondary-100)', color: 'var(--secondary-700)' }}
        >
          <FaPlus /> Ajouter une certification
        </Button>
      </div>
    </StepWrapper>
  );
};

export default CertificationStep;