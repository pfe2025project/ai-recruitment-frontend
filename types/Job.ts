/* eslint-disable @typescript-eslint/no-explicit-any */
// Types based on your database schema
export type Job = {
  id: string;
  company_id: string;
  title: string;
  description: string;
  location: string;
  requirements: string[];
  education: string;
  created_at: string;
  company: {
    website: any;
    name: string;
    logo_url?: string;
    description: string;
  };
  contract_type?: string; // CDI, CDD, etc.
  work_mode?: string; // Remote, On site, Hybrid
  salary_range?: string;
  skills?: string[];
  has_applied?: boolean;
  match_score?: number;
  is_recommended?:boolean;
};

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

export type FetchJobsParams = {
  search?: string;
  location?: string;
  contract_type?: string;
  work_mode?: string[];
  min_salary?: number;
  skills?: string[];
  page?: number;
  limit?: number;
};
