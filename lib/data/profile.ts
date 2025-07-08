/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentUser } from "../api/auth";
import { fetchProfile } from "../api/profile";
import { ProfileData } from "@/types/Profile";

 export const fetchprofiledata = async (
  candidateId?: string
) => {
    try {
      const profileInfo = await fetchProfile(candidateId);
      if (profileInfo) {


        if (profileInfo.contact) {
        }

        if (profileInfo.skills) {

        }



        if (profileInfo.jobPreferences) {
        }

        if (profileInfo.cvPdfUrl) {
          // The backend should return a path like 'uid/cv.pdf' or 'uploads/cvs/uid/cv.pdf'.
          // We need to construct the full web-accessible URL for the download endpoint.
          // Ensure the path is relative to the backend's 'uploads/cvs' directory.
          let cvPath = profileInfo.cvPdfUrl;
          if (cvPath.startsWith('uploads/cvs/')) {
            cvPath = cvPath.substring('uploads/cvs/'.length);
          }
          profileInfo.cvPdfUrl = `http://127.0.0.1:5000/cv/download/${cvPath}`;
        }

        const currentUser = await getCurrentUser();
        if (currentUser){
          profileInfo.avatarUrl = currentUser.user_metadata.avatar_url;
        }
        return profileInfo;
      }
      return null;
    } catch (err) {
      console.error("Error extracting profile information:", err);
      return null;
    }
  };