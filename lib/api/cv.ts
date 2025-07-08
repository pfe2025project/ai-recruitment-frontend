import {  getSupabaseAccessToken } from "./auth";

const FLASK_API_BASE_URL = 'http://127.0.0.1:5000/cv/';




/**
 * Check if a CV has been uploaded for the current authenticated user
 */
export async function checkCVUploadStatus(): Promise<boolean> {
  const token = await getSupabaseAccessToken();
  if (!token) return false;

  try {
    const response = await fetch(`${FLASK_API_BASE_URL}/check_cv_uploaded`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.cv_uploaded === true;
  } catch (error) {
    console.error("Failed to check CV upload status:", error);
    return false;
  }
}

/**
 * Fetch the CV URL and file as a File object for the current authenticated user
 */
export const fetchExistingCVFromBackend = async (): Promise<{ url: string; file: File } | null> => {
  const token = await getSupabaseAccessToken();
  if (!token) return null;
  

  try {
    // Step 1: Get the CV URL
    const urlRes = await fetch(FLASK_API_BASE_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!urlRes.ok) throw new Error('Failed to fetch CV URL');

    const data = await urlRes.json();
    const downloadUrl = data.cv_url;
    console.log('fetchExistingCVFromBackend: Received downloadUrl from backend:', downloadUrl);
    if (!downloadUrl) return null;

    // Step 2: Fetch the actual file from the constructed URL
    const fileRes = await fetch(downloadUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!fileRes.ok) throw new Error('Failed to fetch CV file');

    const blob = await fileRes.blob();

    // Create a File object (you can change the name or infer from URL if needed)
    const file = new File([blob], 'cv.pdf', { type: blob.type });

    return { url: downloadUrl, file };
  } catch (error) {
    console.error('fetchExistingCVFromBackend error:', error);
    return null;
  }
};



/**
 * Upload CV for the current authenticated user
 */
export const uploadCVToBackend = async (file: File): Promise<{ success: boolean; url?: string }> => {
  const token = await getSupabaseAccessToken();
  if (!token) return { success: false };

  try {
    const formData = new FormData();
    formData.append('cv', file);

    const res = await fetch(FLASK_API_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to upload CV');
    }

    const data = await res.json();
    // The backend now returns the full web-accessible URL directly
    return { success: true, url: data.url };
  } catch (error) {
    console.error('uploadCVToBackend:', error);
    return { success: false };
  }
};

/**
 * Delete CV for the current authenticated user
 */
export const deleteCVFromBackend = async (): Promise<boolean> => {
  const token = await getSupabaseAccessToken();
  if (!token) return false;

  try {
    const res = await fetch(FLASK_API_BASE_URL, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return res.ok;
  } catch (error) {
    console.error('deleteCVFromBackend:', error);
    return false;
  }
};





