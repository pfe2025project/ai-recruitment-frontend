
import AboutStep from '@/components/candidate/profile-edit/AboutStep';
import BasicInfoStep from '@/components/candidate/profile-edit/BasicInfoStep';
import CertificationStep from '@/components/candidate/profile-edit/CertificationsStep';
import CVUploadStep from '@/components/candidate/profile-edit/CVUploadStep';
import EducationStep from '@/components/candidate/profile-edit/EducationStep';
import ExperienceStep from '@/components/candidate/profile-edit/ExperienceStep';
import JobPreferencesStep from '@/components/candidate/profile-edit/JobPreferencesStep';
import OtherInfoStep from '@/components/candidate/profile-edit/OtherInfoStep';
import SkillsStep from '@/components/candidate/profile-edit/SkillsStep';
import React from 'react';
import { FaBriefcase, FaCertificate, FaEllipsisH, FaFileUpload, FaGraduationCap, FaInfoCircle, FaSuitcase, FaTools, FaUser } from 'react-icons/fa';
// You can add more steps if needed


export const steps = [
   
    {
      id: 'cv-upload',
      name: 'Télécharger le CV',
      icon: <FaFileUpload className="inline-block mr-2" />,
      component: (
        <CVUploadStep  />
      )
    },
    {
      id: 'basic-info',
      name: 'Infos de base',
      icon: <FaUser className="inline-block mr-2" />,
      component: (
        <BasicInfoStep />
      )
    },
    {
      id: 'about',
      name: 'À propos',
      icon: <FaInfoCircle className="inline-block mr-2" />,
      component: (
        <AboutStep />
      )
    },
    {
      id: 'education',
      name: 'Formation',
      icon: <FaGraduationCap className="inline-block mr-2" />,
      component: (
        <EducationStep />
      )
    },
    {
      id: 'experience',
      name: 'Expériences',
      icon: <FaBriefcase className="inline-block mr-2" />,
      component: (
        <ExperienceStep />
      )
    },
    {
      id: 'skills',
      name: 'Compétences',
      icon: <FaTools className="inline-block mr-2" />,
      component: (
        <SkillsStep />
      )
    },
    {
      id: 'certifications',
      name: 'Certifications',
      icon: <FaCertificate className="inline-block mr-2" />,
      component: (
        <CertificationStep />
      )
    },
    {
      id: 'job-preferences',
      name: 'Préférences d\'emploi',
      icon: <FaSuitcase className="inline-block mr-2" />,
      component: (
        <JobPreferencesStep />
      )
    },
    {
      id: 'other-info',
      name: 'Autres infos',
      icon: <FaEllipsisH className="inline-block mr-2" />,
      component: (
        <OtherInfoStep />
      )
    }
  ];
