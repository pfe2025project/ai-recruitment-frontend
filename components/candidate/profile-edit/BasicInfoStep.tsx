"use client";
import React, { useEffect, useState } from 'react';
import StepWrapper from './StepWrapper';
import Input from '@/components/ui/Input';
import { useProfile } from '@/context/ProfileContext';
import { getBasicInfo } from '@/lib/api/profile';

const BasicInfoStep: React.FC = () => {
  const { profileData, handleProfileDataChange, handleContactInfoChange } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch basic info if not already in context
  useEffect(() => {
    const fetchInitialData = async () => {
      // Only fetch if we don't have basic data
        try {
          setIsLoading(true);
          const data = await getBasicInfo();
          
          // Update context with fetched data
          if (data) {
            handleProfileDataChange('name', data.basic_info?.name || '');
            handleProfileDataChange('title', data.basic_info?.title || '');
            handleProfileDataChange('location', data.basic_info?.location || '');
            handleContactInfoChange('email', data.contact?.email || '');
            handleContactInfoChange('phone', data.contact?.phone || '');
          }
        } catch (err) {
          setError('Failed to load profile data');
          console.error('Fetch error:', err);
        } finally {
          setIsLoading(false);
        }
      }

    if (false){
      fetchInitialData();
    }
    
  }, []); // Empty dependency array to run only once on mount


  if (isLoading) {
    return (
      <StepWrapper
        title="Basic Information"
        description="Loading your profile information..."
      >
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </StepWrapper>
    );
  }

  return (
    <StepWrapper
      title="Basic Information"
      description="Update your personal and contact information."
    >
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-6 ">
        <Input
          id="name"
          label="Full Name"
          value={profileData.name}
          onChange={(e) => handleProfileDataChange('name', e.target.value)}
          placeholder="Your full name" 
          required    
        />
        
        <Input
          id="title"
          label="Job Title"
          value={profileData.title}
          onChange={(e) => handleProfileDataChange('title', e.target.value)}
          placeholder="Ex: Senior Fullstack Developer"
        />
        
        <Input
          id="location"
          label="Location"
          value={profileData.location}
          onChange={(e) => handleProfileDataChange('location', e.target.value)}
          placeholder="Ex: Paris, France"
        />
        
        <Input
          id="email"
          label="Email"
          type="email"
          value={profileData.contact.email}
          onChange={(e) => handleContactInfoChange('email', e.target.value)}
          placeholder="your.email@example.com"
          required
        />
        
        <Input
          id="phone"
          label="Phone Number"
          type="tel"
          value={profileData.contact.phone}
          onChange={(e) => handleContactInfoChange('phone', e.target.value)}
          placeholder="+33 6 12 34 56 78"
        />
      </div>
    </StepWrapper>
  );
};

export default BasicInfoStep;