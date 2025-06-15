/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseAccessToken } from "./auth";

const FLASK_API_BASE_URL = 'http://127.0.0.1:5000/parser';

const authHeaders = async () => {
  const token = await getSupabaseAccessToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// ======= EXTRACT  PROFILE INFO FROM CV =======
export const extract_profile_info = async () => {
  const headers = await authHeaders();
  const res = await fetch(`${FLASK_API_BASE_URL}/extract`, { 
    method: 'POST',
    headers });
  return await res.json();
};
