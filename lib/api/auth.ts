/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api/auth.ts
import { supabase } from '@/lib/supabase/client'


export async function loginUser(email: string, password: string, role: 'candidate' | 'recruiter') {
  const response = await fetch('http://127.0.0.1:5000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password, role }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const error_msg =`${errorData.error} : ${errorData.details}`;
    throw new Error( error_msg || 'Login failed');
  }

  return await response.json();
}



export async function registerUser(
  email: string,
  password: string,
  role: 'candidate' | 'recruiter'
) {
  const response = await fetch('http://127.0.0.1:5000/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password, role }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const error_msg = `${errorData.error} : ${errorData.details}`;
    throw new Error(error_msg || 'Registration failed');
  }

  return await response.json();
}




export function getAccessToken() {
  return typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
}

export function isAuthenticated() {
  return !!getAccessToken();
}

export function getRole(){
    return typeof window !== 'undefined' ? localStorage.getItem('role') : null;
}


export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('role');
}



export async function signInWithGoogle(role: 'candidate' | 'recruiter') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/callback?role=${role}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    }
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function handleAuthCallback() {
  const { data, error } = await supabase.auth.getSession()
  
  if (error) {
    throw new Error(error.message)
  }

  return data.session
}

// Get user from Supabase directly
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    throw new Error(error.message)
  }

  return user
}