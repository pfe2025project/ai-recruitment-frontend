import { getAccessToken } from './auth';

import { getSupabaseAccessToken } from "./auth";

export async function fetchUserProfile() {
  const token = await getSupabaseAccessToken();
  const res = await fetch('http://127.0.0.1:5000/profile', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,  // 🔐 Send token here
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.details || 'Failed to fetch user profile');
  }

  return res.json();
}
