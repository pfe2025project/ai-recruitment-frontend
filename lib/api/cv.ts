import {  getSupabaseAccessToken } from "./auth";

const FLASK_API_BASE_URL = 'http://127.0.0.1:5000/cv';




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
 * Get the URL of the existing CV for the current authenticated user
 */
export const fetchExistingCVFromBackend = async (): Promise<string | null> => {
  const token = await getSupabaseAccessToken();
  if (!token) return null;

  try {
    const res = await fetch(FLASK_API_BASE_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error('Failed to fetch CV URL');

    const data = await res.json();
    return data.cv_url || null;
  } catch (error) {
    console.error('fetchExistingCVFromBackend:', error);
    return null;
  }
};

/**
 * Download CV for the current authenticated user
 */
export const downloadCVFromBackend = async (): Promise<boolean> => {
  const token = await getSupabaseAccessToken();
  if (!token) return false;

  try {
    // First get the CV URL
    const cvUrl = await fetchExistingCVFromBackend();
    if (!cvUrl) return false;

    // Create a temporary anchor element to trigger download
    const a = document.createElement('a');
    a.href = cvUrl;
    a.download = 'cv.pdf'; // You can customize the filename here
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    return true;
  } catch (error) {
    console.error('downloadCVFromBackend:', error);
    return false;
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





