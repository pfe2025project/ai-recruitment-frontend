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

        if(profileInfo.cvPdfUrl) handleProfileDataChange('cvPdfUrl',profileInfo.cvPdfUrl||profileData.cvPdfUrl);

        const currentUser = await getCurrentUser();
        if (currentUser){
        handleProfileDataChange('avatarUrl',currentUser.user_metadata.avatar_url)
        }
        
      }
    } catch (err) {
      console.error("Error extracting profile information:", err);
    }
  };