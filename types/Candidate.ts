import { ProfileData } from './Profile';

export interface Candidate {
  candidate_id: string;
  application_id: string;
  application_status: 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'withdrawn';
  applied_date: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  resume_url?: string;
  headline?: string;
  bio?: string;
  experience?: string;
  candidate_education?: string;
  candidate_skills?: string;
  created_at?: string;
  full_name?: string; // Added for convenience
  profile?: ProfileData; // Optional, if you want to embed profile details
}

export interface CandidateMatch extends Candidate {
  match_score: number | null;
  job_id?: string;
  job_title?: string;
  application_id: string;
}