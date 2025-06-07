"use client";
// context/ProfileContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { ProfileData } from '@/types/Profile';
import { defaultProfileData } from '@/data/defaultProfileData';

type ProfileContextType = {
  profileData: ProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
  handleProfileDataChange: <K extends keyof ProfileData>(field: K, value: ProfileData[K]) => void;
  handleContactInfoChange: <K extends keyof ProfileData['contact']>(field: K, value: ProfileData['contact'][K]) => void;
  handleJobPreferencesChange: <K extends keyof ProfileData['jobPreferences']>(field: K, value: ProfileData['jobPreferences'][K]) => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfileData);

  const handleProfileDataChange = <K extends keyof ProfileData>(field: K, value: ProfileData[K]) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactInfoChange = <K extends keyof ProfileData['contact']>(field: K, value: ProfileData['contact'][K]) => {
    setProfileData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const handleJobPreferencesChange = <K extends keyof ProfileData['jobPreferences']>(field: K, value: ProfileData['jobPreferences'][K]) => {
    setProfileData((prev) => ({
      ...prev,
      jobPreferences: { ...prev.jobPreferences, [field]: value }
    }));
  };

  return (
    <ProfileContext.Provider
      value={{ profileData, setProfileData, handleProfileDataChange, handleContactInfoChange, handleJobPreferencesChange }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within a ProfileProvider');
  return context;
};


