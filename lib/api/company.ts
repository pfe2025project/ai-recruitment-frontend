import { supabase } from '../supabase/client';

export type Company = {
  id: string;
  name: string;
  logo_url?: string;
  website?: string;
  description?: string;
};

const FLASK_API_BASE_URL = 'http://127.0.0.1:5000/company';

export const fetchCompanies = async (): Promise<Company[]> => {
  try {
    const response = await fetch(`${FLASK_API_BASE_URL}/companies`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch companies: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};