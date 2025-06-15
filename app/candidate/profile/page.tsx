/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/profile/page.tsx
'use client';

import React, { useEffect, useState } from 'react'; // Import useState
import { useRouter } from 'next/navigation';
import ProfileHeader from '@/components/candidate/profile/ProfileHeader';
import ProfileSection from '@/components/candidate/profile/ProfileSection';
import ExperienceCard from '@/components/candidate/profile/ExperienceCard';
import EducationCard from '@/components/candidate/profile/EducationCard';
import SkillBadge from '@/components/candidate/profile/SkillBadge';
import UploadCVSection from '@/components/candidate/profile/UploadCVSection';
import ContactInfoCard from '@/components/candidate/profile/ContactInfoCard';
import CertificationCard from '@/components/candidate/profile/CertificationCard';
import JobPreferencesCard from '@/components/candidate/profile/JobPreferencesCard';
import Button from '@/components/ui/Button';

// Import icons
import PersonIcon from '@/components/icons/PersonIcon';
import WorkIcon from '@/components/icons/WorkIcon';
import SchoolIcon from '@/components/icons/SchoolIcon';
import FlashOnIcon from '@/components/icons/FlashOnIcon';
import LanguageIcon from '@/components/icons/LanguageIcon';
import AwardIcon from '@/components/icons/AwardIcon';
import { MdHelpOutline } from 'react-icons/md';

// Import the dummy profile data
import { dummyProfileData, ProfileData } from '@/data/dummyProfileData2';
import { fetchprofiledata } from '@/lib/data/profile';
import { useProfile } from '@/context/ProfileContext';
import MultiStepFormModal from '@/components/ui/MultiStepFormModal';
import { steps } from '@/lib/candidate/config/steps';


const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { profileData, handleProfileDataChange, handleContactInfoChange, handleJobPreferencesChange } = useProfile();
  const [allskills, setAllskills] = useState<string[]>([])
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleEditProfile = () => {
    // When opening the modal, set the current data to the form's state
    router.push('/candidate/profile/edit')
  };


   const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleUploadCV = () => {
    setModalOpen(true);

  };

 

  

  useEffect(()=>{
    fetchprofiledata(profileData,handleProfileDataChange,handleJobPreferencesChange);

    const combine_skills=()=>{
      const  s = [
        ...profileData.skills.extracted.pySkills,
        ...profileData.skills.extracted.skillnerSkills,
        ...profileData.skills.added
      ];
      setAllskills(s);
    }

    combine_skills();
    
  },[])



  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-6">
        {/* Profile Header */}
        <ProfileHeader
          name={profileData.name}
          title={profileData.title}
          location={profileData.location}
          avatarUrl={profileData.avatarUrl}
          onEditProfile={handleEditProfile}
          onUploadCV={handleUploadCV}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {/* Modal for CV upload */}
          <MultiStepFormModal
            isOpen={modalOpen}
            onClose={handleModalClose}
            steps={steps}
            onSave={handleModalClose}
          />  
          <div className="md:col-span-2">
            {/* About Section - Using SVG Icon Component */}
            <ProfileSection title="À propos" IconComponent={PersonIcon}>
              <p>{profileData.about}</p>
            </ProfileSection>

            {/* Experience Section - Using SVG Icon Component */}
            <ProfileSection title="Expériences Professionnelles" IconComponent={WorkIcon}>
              <div className="space-y-6">
                {profileData.experiences.map((exp, index) => (
                  <ExperienceCard key={index} {...exp} />
                ))}
              </div>
            </ProfileSection>

            {/* Education Section - Using SVG Icon Component */}
            <ProfileSection title="Formation" IconComponent={SchoolIcon}>
              <div className="space-y-6">
                {profileData.education.map((edu, index) => (
                  <EducationCard key={index} {...edu} />
                ))}
              </div>
            </ProfileSection>

            {/* Certifications Section */}
            <ProfileSection title="Certifications" IconComponent={AwardIcon}>
              <div className="space-y-6">
                {profileData.certifications.map((cert, index) => (
                  <CertificationCard key={index} {...cert} />
                ))}
              </div>
            </ProfileSection>

            {/* Skills Section - Using SVG Icon Component */}
            <ProfileSection title="Compétences Techniques" IconComponent={FlashOnIcon}>
              <div className="flex flex-wrap gap-2">
                {allskills.map((skill, index) => (
                  <SkillBadge key={index} skill={skill} />
                ))}
              </div>
            </ProfileSection>

            {/* Languages Section - Using SVG Icon Component */}
            <ProfileSection title="Langues" IconComponent={LanguageIcon}>
              <ul className="list-disc pl-5 space-y-2">
                {profileData.languages.map((lang, index) => (
                  <li key={index}>
                    <span className="font-semibold">{lang.name}:</span> {lang.proficiency}
                  </li>
                ))}
              </ul>
            </ProfileSection>
          </div>

          <div className="md:col-span-1">

            {/* Upload CV Section */}
            <UploadCVSection
              onUploadCV={handleUploadCV}
              lastUpdated={profileData.cvLastUpdated}
              cvUrl={profileData.cvPdfUrl} // Pass the actual URL
            />

            {/* Job Preferences Card - NEW LOCATION */}
            <JobPreferencesCard {...profileData.jobPreferences} />

            {/* Contact Info Card */}
            <ContactInfoCard {...profileData.contact} />

            {/* Help Section - Updated with React Icons and color variables */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-8 text-center">
              <h3 className="text-xl font-semibold text-neutral-800 mb-4">Besoin d'aide ?</h3>
              <p className="text-neutral-600 mb-4">Contactez notre support pour toute question ou assistance.</p>
              <Button
                variant="outline"
                className="flex cursor-pointer items-center justify-center gap-2 border-2 px-4 py-2"
                style={{
                  borderColor: 'var(--primary-600)',
                  color: 'var(--primary-600)',
                  margin: "auto",
                }}
              >
                <MdHelpOutline className="text-lg" style={{ color: 'var(--primary-600)' }} />
                <span>Support</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default ProfilePage;