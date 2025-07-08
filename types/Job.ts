// Represents the structure of a Company, often nested within a Job.
export type Company = {
  id?: string;
  name: string;
  logo_url?: string;
  website?: string;
  description?: string;
};

// The main Job entity, designed to be comprehensive for both candidate and recruiter views.
import { Candidate } from './Candidate';

export type Job = {
  // Core Fields from Database
  id: string;
  recruiter_id?: string;
  company_id: string;
  title: string;
  description: string;
  location: string;
  requirements: string[];
  education?: string;
  created_at: string;
  contract_type?: 'CDI' | 'CDD' | 'Internship' | 'Freelance' | '' | null;
  work_mode?: 'On-site' | 'Remote' | 'Hybrid' | '' | null;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency?: string;
  salary_range?: string;
  skills?: string[];

  // Nested Data
  company?: Company;

  // Frontend-specific State (Candidate-facing)
  has_applied?: boolean;
  is_saved?: boolean;

  // AI & Matching Fields
  match_score?: number;
  is_recommended?: boolean;

  // Recruiter-facing Fields
  application_count?: number; // Number of candidates who applied
  status?: 'open' | 'closed' | 'draft';
  candidates?: Candidate[];
};

// Type for the AI Matching API response, providing detailed scores.
export type JobMatchScore = {
  job_id: string;
  job_title: string;
  job_description: string;
  job_location: string;
  job_requirements: string[];
  company_name: string;
  company_logo?: string;
  match_score: number;
  sbert_similarity: number;
  skill2vec_similarity: number;
  matched_skills: string[];
  candidate_skills: string[];
  job_skills: string[];
  prediction: string;
  match_percentage: number;
};

// Parameters for fetching a list of jobs, supporting filtering and pagination.
export type FetchJobsParams = {
  search?: string;
  location?: string;
  contract_type?: string | null;
  work_mode?: string | string[] | null;
  min_salary?: number;
  recommended?: boolean;
  skills?: string[];
  page?: number;
  limit?: number;
  // Recruiter-specific filters
  recruiter_id?: string;
  status?: 'open' | 'closed' | 'draft';
};

// Parameters for creating or updating a job post.
export type JobPayload = {
  title: string;
  description: string;
  location: string;
  requirements: string[];
  recruiter_id?: string;
  company_id: string; // Required when creating
  education?: string;
  contract_type?: 'CDI' | 'CDD' | 'Internship' | 'Freelance' | '' | null;
  work_mode?: 'On-site' | 'Remote' | 'Hybrid' | '' | null;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency?: string;
  skills?: string[];
  status?: 'open' | 'closed' | 'draft';
};
