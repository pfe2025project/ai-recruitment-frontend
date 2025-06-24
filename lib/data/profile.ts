/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentUser } from "../api/auth";
import { fetchProfile } from "../api/profile";
import { ProfileData } from "@/types/Profile";

 export const fetchprofiledata = async (
  profileData: ProfileData,
  handleProfileDataChange: <K extends keyof ProfileData>(field: K, value: ProfileData[K]) => void,
  handleJobPreferencesChange: <K extends keyof ProfileData['jobPreferences']>(field: K, value: ProfileData['jobPreferences'][K]) => void
) => {
    try {
      const profileInfo = await fetchProfile();
      if (profileInfo) {
        handleProfileDataChange('name', profileInfo.name || profileData.name);
        handleProfileDataChange('title', profileInfo.title || profileData.title);
        handleProfileDataChange('location', profileInfo.location || profileData.location);
        handleProfileDataChange('about', profileInfo.about || profileData.about);

        if (profileInfo.contact) {
          const contactUpdates = {
            email: profileInfo.contact.email || profileData.contact?.email,
            phone: profileInfo.contact.phone || profileData.contact?.phone,
            linkedin: profileInfo.contact.linkedin || profileData.contact.linkedin,
            github: profileInfo.contact.github || profileData.contact.github,
            website: profileInfo.contact.website || profileData.contact.website,
          };
          handleProfileDataChange('contact', contactUpdates);
        }

        if (profileInfo.skills) {
          const currentSkills = profileData.skills || {
            added: [],
            extracted: { pySkills: [], skillnerSkills: [] },
          };

          const mergedSkills = {
            added: [...(profileInfo.skills.added || currentSkills.added)],
            extracted: {
              pySkills: [...new Set([...(profileInfo.skills.extracted?.pySkills || []), ...(currentSkills.extracted?.pySkills || [])])],
              skillnerSkills: [...new Set([...(profileInfo.skills.extracted?.skillnerSkills || []), ...(currentSkills.extracted?.skillnerSkills || [])])]
            }
          };

          handleProfileDataChange('skills', mergedSkills||profileData.skills);
        }

        if (profileInfo.experiences) handleProfileDataChange('experiences', profileInfo.experiences||profileData.experiences);
        if (profileInfo.education) handleProfileDataChange('education', profileInfo.education||profileData.education);
        if (profileInfo.certifications) handleProfileDataChange('certifications', profileInfo.certifications||profileData.certifications);
        if (profileInfo.languages) handleProfileDataChange('languages', profileInfo.languages||profileData.languages);

        if (profileInfo.jobPreferences) {
          handleJobPreferencesChange('isAvailable', profileInfo.jobPreferences.isAvailable);
          handleJobPreferencesChange('jobType', profileInfo.jobPreferences.jobType);
          handleJobPreferencesChange('preferredLocation', profileInfo.jobPreferences.preferredLocation);
          handleJobPreferencesChange('noticePeriod', profileInfo.jobPreferences.noticePeriod);
        }

        if (profileInfo.cvPdfUrl) {
          const backendPath = profileInfo.cvPdfUrl;
          // Convert backend path (e.g., c:\Users\MSI\ai-recruitment-backend\uploads\cvs\<uid>\cv.pdf)
          // to a web-accessible URL (e.g., /uploads/cvs/<uid>/cv.pdf)
          // Use a regex to extract the part of the path starting from 'uploads/cvs/'
          const match = backendPath.match(/(uploads[\\/]cvs[\\/].*)/i);
          if (match && match[1]) {
            const relativePath = match[1];
            const webAccessibleUrl = '/' + relativePath.replace(/\\/g, '/'); // Replace backslashes with forward slashes
            handleProfileDataChange('cvPdfUrl', `http://127.0.0.1:5000/${relativePath.replace(/\\/g, '/')}`);
          } else {
            // Fallback if the path format is not as expected or if it's already a URL
            // Check if it's already a URL (starts with http/https or /)
            if (backendPath.startsWith('http://') || backendPath.startsWith('https://') || backendPath.startsWith('/')) {
              handleProfileDataChange('cvPdfUrl', backendPath);
            } else {
              // If it's still a local path and doesn't match, log an error or handle as appropriate
              console.error('Unexpected CV path format:', backendPath);
              handleProfileDataChange('cvPdfUrl', ''); // Clear the URL to prevent errors
            }
          }
        }

        const currentUser = await getCurrentUser();
        if (currentUser){
        handleProfileDataChange('avatarUrl',currentUser.user_metadata.avatar_url)
        }
        
      }
    } catch (err) {
      console.error("Error extracting profile information:", err);
    }
  };