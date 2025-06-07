/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Dummy data & types import (you should replace these with your actual data)
import { dummyProfileData, ProfileData } from '@/data/dummyProfileData2';

// Steps Components (import your actual components here)
import CVUploadStep from '@/components/profile-edit/CVUploadStep';
import BasicInfoStep from '@/components/profile-edit/BasicInfoStep';
import AboutStep from '@/components/profile-edit/AboutStep';
import EducationStep from '@/components/profile-edit/EducationStep';
import ExperienceStep from '@/components/profile-edit/ExperienceStep';
import SkillsStep from '@/components/profile-edit/SkillsStep';
import CertificationsStep from '@/components/profile-edit/CertificationsStep';
import OtherInfoStep from '@/components/profile-edit/OtherInfoStep';
import JobPreferencesStep from '@/components/profile-edit/JobPreferencesStep';

// Icons
import {
  FaFileUpload,
  FaUser,
  FaInfoCircle,
  FaGraduationCap,
  FaBriefcase,
  FaTools,
  FaCertificate,
  FaSuitcase,
  FaEllipsisH,
  FaArrowLeft
} from 'react-icons/fa';

const ProfileEditPage: React.FC = () => {
  const router = useRouter();

  // Current selected step id
  const [selectedStepId, setSelectedStepId] = useState<string>('cv-upload');

  // Main profile data state
  const [profileData, setProfileData] = useState<ProfileData>(dummyProfileData);

  // Extracted skills from CV upload simulation
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);

  // Simulate CV skills extraction (mock async function)
  const simulateCVExtraction = async (file: File): Promise<string[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const skills = ['Python', 'Data Analysis', 'SQL'];
    setExtractedSkills(skills);
    return skills;
  };

  // Handle changes to profile data fields (generic)
  const handleProfileDataChange = <K extends keyof ProfileData>(
    field: K,
    value: ProfileData[K]
  ) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle changes in contact info (nested object)
  const handleContactInfoChange = <K extends keyof ProfileData['contact']>(
    field: K,
    value: ProfileData['contact'][K]
  ) => {
    setProfileData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  // Handle job preferences changes (nested object)
  const handleJobPreferencesChange = <K extends keyof ProfileData['jobPreferences']>(
    field: K,
    value: ProfileData['jobPreferences'][K]
  ) => {
    setProfileData((prev) => ({
      ...prev,
      jobPreferences: { ...prev.jobPreferences, [field]: value }
    }));
  };

  // Steps configuration
  const steps = [
    {
      id: 'cv-upload',
      name: 'Télécharger le CV',
      icon: <FaFileUpload className="inline-block mr-2" />,
      component: (
        <CVUploadStep /> 
      )
    },
    {
      id: 'basic-info',
      name: 'Infos de base',
      icon: <FaUser className="inline-block mr-2" />,
      component: (
        <BasicInfoStep
          profileData={profileData}
          onChange={handleProfileDataChange}
          onContactChange={handleContactInfoChange}
        />
      )
    },
    {
      id: 'about',
      name: 'À propos',
      icon: <FaInfoCircle className="inline-block mr-2" />,
      component: (
        <AboutStep profileData={profileData} onChange={handleProfileDataChange} />
      )
    },
    {
      id: 'education',
      name: 'Formation',
      icon: <FaGraduationCap className="inline-block mr-2" />,
      component: (
        <EducationStep
          education={profileData.education}
          onChange={(newEdu) => handleProfileDataChange('education', newEdu)}
        />
      )
    },
    {
      id: 'experience',
      name: 'Expériences',
      icon: <FaBriefcase className="inline-block mr-2" />,
      component: (
        <ExperienceStep
          experiences={profileData.experiences}
          onChange={(newExp) => handleProfileDataChange('experiences', newExp)}
        />
      )
    },
    {
      id: 'skills',
      name: 'Compétences',
      icon: <FaTools className="inline-block mr-2" />,
      component: (
        <SkillsStep
          profileData={profileData}
          onChange={(field, value) => handleProfileDataChange(field, value as string[])}
          extractedSkills={extractedSkills}
        />
      )
    },
    {
      id: 'certifications',
      name: 'Certifications',
      icon: <FaCertificate className="inline-block mr-2" />,
      component: (
        <CertificationsStep
          certifications={profileData.certifications}
          onChange={(certs) => handleProfileDataChange('certifications', certs)}
        />
      )
    },
    {
      id: 'job-preferences',
      name: 'Préférences d\'emploi',
      icon: <FaSuitcase className="inline-block mr-2" />,
      component: (
        <JobPreferencesStep
          jobPreferences={profileData.jobPreferences}
          onChange={handleJobPreferencesChange}
        />
      )
    },
    {
      id: 'other-info',
      name: 'Autres infos',
      icon: <FaEllipsisH className="inline-block mr-2" />,
      component: (
        <OtherInfoStep
          profileData={profileData}
          onContactChange={handleContactInfoChange}
        />
      )
    }
  ];

  const selectedStep = steps.find((step) => step.id === selectedStepId);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-6"
          >
            <FaArrowLeft className="mr-2" />
            Retour
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Éditer votre profil</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-1/4 bg-white p-6 shadow rounded-xl">
            <h3 className="text-lg font-bold mb-6">Sections</h3>
            <ul className="space-y-4">
              {steps.map((step) => (
                <li
                  key={step.id}
                  onClick={() => setSelectedStepId(step.id)}
                  className={`cursor-pointer p-2 rounded-lg flex items-center transition ${
                    selectedStepId === step.id
                      ? 'bg-blue-100 text-blue-600 font-medium'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {step.icon}
                  {step.name}
                </li>
              ))}
            </ul>
          </aside>

          {/* Right content */}
          <main className="flex-1 bg-white p-6 shadow rounded-xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                {selectedStep?.icon}
                {selectedStep?.name}
              </h2>
              {selectedStep?.component}
            </div>

            <div className="mt-6">
              <button
                onClick={() => alert('Données enregistrées avec succès !')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
              >
                Enregistrer
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;
