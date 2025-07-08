import { Job } from "./Job";

// types/Application.ts
export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'withdrawn';
  custom_cv_url?: string | null;
  cover_letter_text?: string | null;
  cover_letter_file_url?: string | null;
  applied_at: string; // ISO 8601 date string
  cv_last_updated?: string | null; // ISO 8601 date string
  // Optional fields that might be useful
  job:Job;
  updated_at?: string; // ISO 8601 date string
  score?: number | null;
  feedback?: string | null;
}

// For the response from your API
export interface ApplicationResponse {
  success: boolean;
  application?: Application;
  error?: string;
}

// For creating/updating applications
export interface ApplicationPayload {
  job_id: string;
  cv_option: 'default' | 'custom';
  custom_cv?: File | null;
  cover_letter_text?: string;
  cover_letter_file?: File | null;
}

// For the existing application prop in ApplyModal
export interface ExistingApplication {
  cvOption: 'default' | 'custom';
  customCvUrl?: string;
  coverLetterText?: string;
  coverLetterFileUrl?: string;
}