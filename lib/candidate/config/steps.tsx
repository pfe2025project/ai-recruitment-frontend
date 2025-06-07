import CVUploadStep from '@/components/profile-edit/CVUploadStep';
import React from 'react';
import { FaFileUpload } from 'react-icons/fa';
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
    // {
    //   id: 'basic-info',
    //   name: 'Infos de base',
    //   icon: <FaUser className="inline-block mr-2" />,
    //   component: (
    //     <BasicInfoStep
    //       profileData={profileData}
    //       onChange={handleProfileDataChange}
    //       onContactChange={handleContactInfoChange}
    //     />
    //   )
    // },
    // {
    //   id: 'about',
    //   name: 'À propos',
    //   icon: <FaInfoCircle className="inline-block mr-2" />,
    //   component: (
    //     <AboutStep profileData={profileData} onChange={handleProfileDataChange} />
    //   )
    // },
    // {
    //   id: 'education',
    //   name: 'Formation',
    //   icon: <FaGraduationCap className="inline-block mr-2" />,
    //   component: (
    //     <EducationStep
    //       education={profileData.education}
    //       onChange={(newEdu) => handleProfileDataChange('education', newEdu)}
    //     />
    //   )
    // },
    // {
    //   id: 'experience',
    //   name: 'Expériences',
    //   icon: <FaBriefcase className="inline-block mr-2" />,
    //   component: (
    //     <ExperienceStep
    //       experiences={profileData.experiences}
    //       onChange={(newExp) => handleProfileDataChange('experiences', newExp)}
    //     />
    //   )
    // },
    // {
    //   id: 'skills',
    //   name: 'Compétences',
    //   icon: <FaTools className="inline-block mr-2" />,
    //   component: (
    //     <SkillsStep
    //       profileData={profileData}
    //       onChange={(field, value) => handleProfileDataChange(field, value as string[])}
    //       extractedSkills={extractedSkills}
    //     />
    //   )
    // },
    // {
    //   id: 'certifications',
    //   name: 'Certifications',
    //   icon: <FaCertificate className="inline-block mr-2" />,
    //   component: (
    //     <CertificationsStep
    //       certifications={profileData.certifications}
    //       onChange={(certs) => handleProfileDataChange('certifications', certs)}
    //     />
    //   )
    // },
    // {
    //   id: 'job-preferences',
    //   name: 'Préférences d\'emploi',
    //   icon: <FaSuitcase className="inline-block mr-2" />,
    //   component: (
    //     <JobPreferencesStep
    //       jobPreferences={profileData.jobPreferences}
    //       onChange={handleJobPreferencesChange}
    //     />
    //   )
    // },
    // {
    //   id: 'other-info',
    //   name: 'Autres infos',
    //   icon: <FaEllipsisH className="inline-block mr-2" />,
    //   component: (
    //     <OtherInfoStep
    //       profileData={profileData}
    //       onContactChange={handleContactInfoChange}
    //     />
    //   )
    // }
  ];
