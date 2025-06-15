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
