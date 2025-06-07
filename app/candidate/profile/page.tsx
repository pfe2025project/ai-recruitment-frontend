/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/profile/page.tsx
'use client';

import React, { useState } from 'react'; // Import useState
import { useRouter } from 'next/navigation';
import ProfileHeader from '@/components/candidate/ProfileHeader';
import ProfileSection from '@/components/candidate/ProfileSection';
import ExperienceCard from '@/components/candidate/ExperienceCard';
import EducationCard from '@/components/candidate/EducationCard';
import SkillBadge from '@/components/candidate/SkillBadge';
import UploadCVSection from '@/components/candidate/UploadCVSection';
import ContactInfoCard from '@/components/candidate/ContactInfoCard';
import CertificationCard from '@/components/candidate/CertificationCard';
import JobPreferencesCard from '@/components/candidate/JobPreferencesCard';
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


const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(dummyProfileData); // Use state to manage profile data
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]); // State for extracted skills

  // This would be your actual "persisted" profile data from a backend or global state
  // For now, we'll use a local state initialized with dummyData
  const [liveProfileData, setLiveProfileData] = useState<ProfileData>(dummyProfileData);


  const handleProfileDataChange = <K extends keyof ProfileData>(field: K, value: ProfileData[K]) => {
    setProfileData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleContactInfoChange = <K extends keyof ProfileData['contact']>(field: K, value: ProfileData['contact'][K]) => {
    setProfileData(prevData => ({
      ...prevData,
      contact: {
        ...prevData.contact,
        [field]: value,
      },
    }));
  };

  const handleJobPreferencesChange = <K extends keyof ProfileData['jobPreferences']>(field: K, value: ProfileData['jobPreferences'][K]) => {
    setProfileData(prevData => ({
      ...prevData,
      jobPreferences: {
        ...prevData.jobPreferences,
        [field]: value,
      },
    }));
  };

  const handleEditProfile = () => {
    // When opening the modal, set the current data to the form's state
    router.push('/candidate/profile/edit')
  };

  const handleUploadCV = () => {
    alert('Logique d\'upload de CV à implémenter !');
    // This is still here as the dedicated CV upload button on the profile page
    // but the modal will also have its own CV upload step
  };

  const handleSaveProfile = () => {
    // In a real application, you'd send `profileData` to your backend
    // to update the user's profile.
    console.log('Saving profile data:', profileData);
    // Update the live profile data shown on the main profile page
    setLiveProfileData(profileData);
    setIsEditModalOpen(false); // Close the modal
    alert('Profil mis à jour avec succès !');
  };

  // Simulate CV parsing
  const simulateCVExtraction = async (file: File): Promise<string[]> => {
    console.log(`Simulating skill extraction from ${file.name}...`);
    // In a real application, you would send this file to a backend service
    // that uses a library like 'pdf-parse' or an external API for CV parsing.
    // For now, let's return some dummy skills
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    const skills = ['Python', 'Data Analysis', 'SQL', 'Machine Learning', 'Communication'];
    setExtractedSkills(skills); // Update state to pass to SkillsStep
    return skills;
  };



  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-6">
        {/* Profile Header */}
        <ProfileHeader
          name={liveProfileData.name}
          title={liveProfileData.title}
          location={liveProfileData.location}
          avatarUrl={liveProfileData.avatarUrl}
          onEditProfile={handleEditProfile}
          onUploadCV={handleUploadCV}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          <div className="md:col-span-2">
            {/* About Section - Using SVG Icon Component */}
            <ProfileSection title="À propos" IconComponent={PersonIcon}>
              <p>{liveProfileData.about}</p>
            </ProfileSection>

            {/* Experience Section - Using SVG Icon Component */}
            <ProfileSection title="Expériences Professionnelles" IconComponent={WorkIcon}>
              <div className="space-y-6">
                {liveProfileData.experiences.map((exp, index) => (
                  <ExperienceCard key={index} {...exp} />
                ))}
              </div>
            </ProfileSection>

            {/* Education Section - Using SVG Icon Component */}
            <ProfileSection title="Formation" IconComponent={SchoolIcon}>
              <div className="space-y-6">
                {liveProfileData.education.map((edu, index) => (
                  <EducationCard key={index} {...edu} />
                ))}
              </div>
            </ProfileSection>

            {/* Certifications Section */}
            <ProfileSection title="Certifications" IconComponent={AwardIcon}>
              <div className="space-y-6">
                {liveProfileData.certifications.map((cert, index) => (
                  <CertificationCard key={index} {...cert} />
                ))}
              </div>
            </ProfileSection>

            {/* Skills Section - Using SVG Icon Component */}
            <ProfileSection title="Compétences Techniques" IconComponent={FlashOnIcon}>
              <div className="flex flex-wrap gap-2">
                {liveProfileData.skills.map((skill, index) => (
                  <SkillBadge key={index} skill={skill} />
                ))}
              </div>
            </ProfileSection>

            {/* Languages Section - Using SVG Icon Component */}
            <ProfileSection title="Langues" IconComponent={LanguageIcon}>
              <ul className="list-disc pl-5 space-y-2">
                {liveProfileData.languages.map((lang, index) => (
                  <li key={index}>
                    <span className="font-semibold">{lang.name}:</span> {lang.level}
                  </li>
                ))}
              </ul>
            </ProfileSection>
          </div>

          <div className="md:col-span-1">

            {/* Upload CV Section */}
            <UploadCVSection
              onUploadCV={handleUploadCV}
              lastUpdated={liveProfileData.cvLastUpdated}
              cvUrl={liveProfileData.cvPdfUrl} // Pass the actual URL
            />

            {/* Job Preferences Card - NEW LOCATION */}
            <JobPreferencesCard {...liveProfileData.jobPreferences} />

            {/* Contact Info Card */}
            <ContactInfoCard {...liveProfileData.contact} />

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