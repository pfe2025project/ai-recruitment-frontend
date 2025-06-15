"use client";

import React, { useEffect, useState } from 'react';
import StepWrapper from './StepWrapper';
import TagInput from '@/components/ui/TagInput';
import { useProfile } from '@/context/ProfileContext';
import { getBasicInfo } from '@/lib/api/profile';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';

const SkillsStep = ( ) => {
  const { profileData, handleProfileDataChange } = useProfile();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data and setup
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBasicInfo();
        const currentSkills = profileData.skills || {
          added: [],
          extracted: { pySkills: [], skillnerSkills: [] }
        };

        // Merge existing data with newly extracted skills
        const mergedSkills = {
          added: [...(data?.skills?.added || currentSkills.added || [])],
          extracted: {
            pySkills: [
              ...new Set([
                ...(data?.skills?.extracted?.pySkills || []),
                ...(currentSkills.extracted?.pySkills || [])
              ])
            ],
            skillnerSkills: [
              ...new Set([
                ...(data?.skills?.extracted?.skillnerSkills || []),
                ...(currentSkills.extracted?.skillnerSkills || [])
              ])
            ]
          }
        };

        handleProfileDataChange('skills', mergedSkills);
      } catch (err) {
        console.error('Failed to fetch skills:', err);
        setError('Failed to load skills data');
        toast.error('Failed to load skills data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check if skill exists in either added or extracted
  const skillExists = (skill: string) => {
    const normalizedSkill = skill.trim().toLowerCase();
    return [
      ...profileData.skills.added,
      ...profileData.skills.extracted.pySkills,
      ...profileData.skills.extracted.skillnerSkills
    ].some(s => s.toLowerCase() === normalizedSkill);
  };

  const handleAddSkills = (newSkills: string[]) => {
    const validSkills = newSkills
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);

    const duplicates: string[] = [];
    const skillsToAdd: string[] = [];

    validSkills.forEach(skill => {
      if (skillExists(skill)) {
        duplicates.push(skill);
      } else {
        skillsToAdd.push(skill);
      }
    });

    if (duplicates.length > 0) {
      toast.warning(`These skills already exist: ${duplicates.join(', ')}`);
    }

    if (skillsToAdd.length > 0) {
      handleProfileDataChange('skills', {
        ...profileData.skills,
        added: [...profileData.skills.added, ...skillsToAdd]
      });
      toast.success(`${skillsToAdd.length} skill(s) added`);
    }
  };

  const handleRemoveAddedSkill = (skillToRemove: string) => {
    handleProfileDataChange('skills', {
      ...profileData.skills,
      added: profileData.skills.added.filter(skill => skill !== skillToRemove)
    });
  };

  const handleEditAddedSkill = (oldSkill: string, newSkill: string) => {
    const trimmedSkill = newSkill.trim();
    if (!trimmedSkill) {
      handleRemoveAddedSkill(oldSkill);
      return;
    }

    if (skillExists(trimmedSkill) && trimmedSkill.toLowerCase() !== oldSkill.toLowerCase()) {
      toast.warning(`Skill "${trimmedSkill}" already exists`);
      return;
    }

    handleProfileDataChange('skills', {
      ...profileData.skills,
      added: profileData.skills.added.map(skill => 
        skill === oldSkill ? trimmedSkill : skill
      )
    });
  };

  const handleRemoveExtractedSkill = (type: 'pySkills' | 'skillnerSkills', skillToRemove: string) => {
    handleProfileDataChange('skills', {
      ...profileData.skills,
      extracted: {
        ...profileData.skills.extracted,
        [type]: profileData.skills.extracted[type].filter(skill => skill !== skillToRemove)
      }
    });
  };

  if (isLoading) {
    return (
      <StepWrapper title="Your Skills" description="Loading your skills...">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </StepWrapper>
    );
  }

  return (
    <StepWrapper
      title="Your Skills"
      description="Manage your technical and soft skills"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-medium text-neutral-700">Your Added Skills</h3>
          <TagInput
            label=""
            tags={profileData.skills.added}
            onChange={handleAddSkills}
            onRemove={handleRemoveAddedSkill}
            onEdit={handleEditAddedSkill}
            placeholder="Add a skill (e.g., JavaScript, React)"
          />
        </div>

        {(profileData.skills.extracted.pySkills.length > 0 || 
          profileData.skills.extracted.skillnerSkills.length > 0) && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="font-semibold mb-3 text-blue-800">Extracted Skills</p>
            
            {profileData.skills.extracted.pySkills.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2 text-blue-700">Python Extraction:</p>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.extracted.pySkills.map((skill, index) => (
                    <span 
                      key={`py-${index}`} 
                      className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveExtractedSkill('pySkills', skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                        aria-label={`Remove ${skill}`}
                      >
                        <FaTimes size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profileData.skills.extracted.skillnerSkills.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2 text-blue-700">Skillner Extraction:</p>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.extracted.skillnerSkills.map((skill, index) => (
                    <span 
                      key={`skillner-${index}`} 
                      className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveExtractedSkill('skillnerSkills', skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                        aria-label={`Remove ${skill}`}
                      >
                        <FaTimes size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </StepWrapper>
  );
};

export default SkillsStep;