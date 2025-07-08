import { API_BASE_URL } from './message';
import { CandidateMatch } from '../../types/Candidate';


export interface JobDashboardData {
  job_id: string;
  job_title: string;
  total_applications: number;
  accepted_applications: number;
  rejected_applications: number;
  pending_applications: number;
  candidates: CandidateMatch[];
  best_matches: CandidateMatch[];
}

export interface RecruiterDashboardData {
  jobs: JobDashboardData[];
}

import { supabase } from '@/lib/supabase/client';

export const fetchRecruiterDashboardData = async (recruiterId: string): Promise<RecruiterDashboardData> => {
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new Error('No access token found. User not authenticated.');
  }

  const response = await fetch(`${API_BASE_URL}/dashboard/recruiter/${recruiterId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch recruiter dashboard data');
  }
  const data: RecruiterDashboardData = await response.json();

  // Helper function to validate and cast application_status
  const validateApplicationStatus = (status: string): 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'withdrawn' => {
    const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected', 'withdrawn'];
    if (validStatuses.includes(status.toLowerCase())) {
      return status.toLowerCase() as 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'withdrawn';
    } else {
      // Default to 'pending' or throw an error if an invalid status is encountered
      console.warn(`Invalid application status received: ${status}. Defaulting to 'pending'.`);
      return 'pending';
    }
  };

  // Apply validation to all candidates in all jobs
  data.jobs.forEach(job => {
    const validatedJob: JobDashboardData = {
      ...job,
      candidates: job.candidates.map(candidate => ({
        ...candidate,
        application_status: validateApplicationStatus(candidate.application_status)
      })),
      best_matches: job.best_matches.map(match => ({
        ...match,
        application_status: validateApplicationStatus(match.application_status)
      }))
    };
  });

  return data;
};