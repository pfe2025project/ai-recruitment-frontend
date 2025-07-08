import { getSupabaseAccessToken } from "./auth";
import { ProfileData, Experience, Certification, JobPreferences } from "@/types/Profile";

const FLASK_API_BASE_URL = 'http://127.0.0.1:5000/profile';

const authHeaders = async () => {
  const token = await getSupabaseAccessToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// ======= GET FULL PROFILE =======
export const fetchProfile = async (candidateId?: string) => {
  let headers = {};
  if (!candidateId) { // Only apply auth headers if no candidateId is provided (i.e., fetching current user's profile)
    headers = await authHeaders();
  }
  const url = candidateId ? `${FLASK_API_BASE_URL}/${candidateId}` : FLASK_API_BASE_URL;
  console.log('Fetching profile from URL:', url, 'with headers:', headers);
  const res = await fetch(url, { headers });
  return await res.json();
};


// ======= UPDATE FULL PROFILE =======
export const updateFullProfile = async (profileData: ProfileData) => {
  const headers = await authHeaders();
  const res = await fetch(FLASK_API_BASE_URL, {
    method: 'PUT',
    headers,
    body: JSON.stringify(profileData)
  });
  return await res.json();
};

// ======= BASIC INFO =======
export const getBasicInfo = async () => {
  const headers = await authHeaders();
  const res = await fetch(`${FLASK_API_BASE_URL}`, { headers });
  return await res.json();
};

export const updateBasicInfo = async (info: Partial<ProfileData>) => {
  const headers = await authHeaders();
  const res = await fetch(`${FLASK_API_BASE_URL}/basic`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(info)
  });
  return await res.json();
};

// ======= EXPERIENCE =======
export const getExperiences = async () => {
  const headers = await authHeaders();
  const res = await fetch(`${FLASK_API_BASE_URL}/experience`, { headers });
  return await res.json();
};

export const addExperience = async (experience: Experience) => {
  const headers = await authHeaders();
  const res = await fetch(`${FLASK_API_BASE_URL}/experience`, {
    method: 'POST',
    headers,
    body: JSON.stringify(experience)
  });
  return await res.json();
};

export const updateExperience = async (experience: Experience) => {
  const headers = await authHeaders();
  const res = await fetch(`${FLASK_API_BASE_URL}/experience`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(experience)
  });
  return await res.json();
};

export const deleteExperience = async (id: string) => {
  const headers = await authHeaders();
  const res = await fetch(`${FLASK_API_BASE_URL}/experience`, {
    method: 'DELETE',
    headers,
    body: JSON.stringify({ id })
  });
  return await res.json();
};

// ======= LANGUAGES =======
export const getLanguages = async () => {
  const headers = await authHeaders();
  const res = await fetch(`${FLASK_API_BASE_URL}/languages`, { headers });
  return await res.json();
};

export const updateLanguages = async (languages: string[]) => {
  const headers = await authHeaders();
  const res = await fetch(`${FLASK_API_BASE_URL}/languages`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ languages })
  });
  return await res.json();
};

// ======= CERTIFICATIONS =======
export const getCertifications = async () => {
  const headers = await authHeaders();
  const res = await fetch(`${FLASK_API_BASE_URL}/certifications`, { headers });
  return await res.json();
};

export const updateCertifications = async (certifications: Certification[]) => {
  const headers = await authHeaders();
  const res = await fetch(`${FLASK_API_BASE_URL}/certifications`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ certifications })
  });
  return await res.json();
};

// ======= JOB PREFERENCES =======
export const getJobPreferences = async () => {
  const headers = await authHeaders();
  const res = await fetch(`${FLASK_API_BASE_URL}/job-preferences`, { headers });
  return await res.json();
};

export const updateJobPreferences = async (job_preferences: JobPreferences) => {
  const headers = await authHeaders();
  const res = await fetch(`${FLASK_API_BASE_URL}/job-preferences`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ job_preferences })
  });
  return await res.json();
};
