import { getSupabaseAccessToken } from './auth';

const FLASK_API_BASE_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || 'http://localhost:5000';

export const createApplication = async (
  jobId: string,
  cvOption: 'default' | 'custom',
  customCv?: File,
  coverLetterText?: string,
  coverLetterFile?: File
): Promise<{ success: boolean; applicationId?: string; error?: string }> => {
  const formData = new FormData();
  formData.append('job_id', jobId);
  formData.append('cv_option', cvOption);
  
  if (cvOption === 'custom' && customCv) {
    formData.append('custom_cv', customCv);
  }
  
  if (coverLetterText) {
    formData.append('cover_letter_text', coverLetterText);
  }
  
  if (coverLetterFile) {
    formData.append('cover_letter_file', coverLetterFile);
  }

  try {
    const token = await getSupabaseAccessToken();
    const response = await fetch(`${FLASK_API_BASE_URL}/application`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit application');
    }

    return await response.json();
  } catch (error) {
    console.error('Application error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to submit application' 
    };
  }
}

export const updateApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
  try {
    const accessToken = await getSupabaseAccessToken();
    if (!accessToken) {
      throw new Error('No access token found.');
    }

    const response = await fetch(`${FLASK_API_BASE_URL}/application/${applicationId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to update application status: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error updating application status to ${status}:`, error);
    throw error;
  }

};

import { Application } from '@/types/Application';



export const updateApplication = async (
  applicationId: string,
  payload: { status: Application['status'] }
): Promise<{ success: boolean; error?: string }> => {
  try {
    const token = await getSupabaseAccessToken();
    const response = await fetch(`${FLASK_API_BASE_URL}/application/${applicationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update application');
    }

    return await response.json();
  } catch (error) {
    console.error('Update application error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update application' 
    };
  }
};


export const getUserApplications = async (userId: string) => {
  try {
    const token = await getSupabaseAccessToken();

    const response = await fetch(`${FLASK_API_BASE_URL}/application/candidate/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
};




export const deleteApplication = async (
  applicationId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const token = await getSupabaseAccessToken();
    const response = await fetch(`${FLASK_API_BASE_URL}/application/${applicationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete application');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete application error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete application' 
    };
  }
};