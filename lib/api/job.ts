import { FetchJobsParams, JobMatchScore } from '@/types/Job';
import { supabase } from '../supabase/client';
import { Candidate } from '@/types/Candidate';
import { Job, JobPayload } from '@/types/Job';

const FLASK_API_BASE_URL = 'http://127.0.0.1:5000';
const AI_MATCHING_API_BASE_URL = 'http://127.0.0.1:5000/api/ai-matching';

export const fetchJobs = async (params?: FetchJobsParams): Promise<Job[]> => {
  let url = `${FLASK_API_BASE_URL}/job`; 
  const queryParams = new URLSearchParams();

  if (params) {
    for (const key in params) {
      const value = params[key as keyof FetchJobsParams];
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => queryParams.append(key, String(item)));
        } else {
          queryParams.append(key, String(value));
        }
      }
    }
  }

  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }

  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch jobs');
  }

  const data = await response.json();
  return data.jobs;
};

export const fetchJobMatchScore = async (candidateId: string, jobId: string): Promise<JobMatchScore> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session || !session.access_token) {
      console.warn('No active Supabase session or access token found. Cannot fetch job match score.');
      throw new Error('Authentication required to fetch job match score.');
    }

    const response = await fetch(`${AI_MATCHING_API_BASE_URL}/candidate/${candidateId}/job/${jobId}/score`, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend responded with status ${response.status}: ${errorText}`);
      throw new Error(`Failed to fetch job match score: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Fetched match score data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching job match score:', error);
    throw error;
  }
};

export const createJob = async (jobData: JobPayload): Promise<Job> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    const response = await fetch(`${FLASK_API_BASE_URL}/job`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session && { 'Authorization': `Bearer ${session.access_token}` })
      },
      body: JSON.stringify(jobData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create job: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

export const fetchCandidatesForJob = async (jobId: string): Promise<Candidate[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  const response = await fetch(`${FLASK_API_BASE_URL}/job/${jobId}/candidates`, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch candidates');
  }

  const data = await response.json();
  return data.candidates;
};

const _addMatchScoreToJob = async (job: Job, candidateId?: string): Promise<Job> => {
  const transformedJob: Job = {
    id: job.id,
    company_id: job.company_id || '',
    title: job.title,
    description: job.description,
    location: job.location,
    requirements: job.requirements || [],
    education: job.education || '',
    created_at: job.created_at || '',
    company: {
      name: job.company?.name || 'N/A',
      logo_url: job.company?.logo_url || undefined,
      website: job.company?.website || undefined,
      description: job.company?.description || '',
    },
    contract_type: job.contract_type || undefined,
    work_mode: job.work_mode || undefined,
    salary_min: job.salary_min || undefined,
    salary_max: job.salary_max || undefined,
    salary_currency: job.salary_currency || undefined,
    skills: job.skills || [],
    has_applied: job.has_applied || false,
    match_score: job.match_score ?? 0,
    is_recommended: (job.match_score ?? 0) > 50,
  };

  if (candidateId) {
    try {
      const matchScoreData = await fetchJobMatchScore(candidateId, job.id);
      transformedJob.match_score = matchScoreData.match_percentage ?? 0;
      transformedJob.is_recommended = (matchScoreData.match_percentage ?? 0) > 50;
    } catch (matchError) {
      console.warn(`Could not fetch match score for job ${job.id}:`, matchError);
    }
  }
  return transformedJob;
};

export const fetchJobById = async (id: string): Promise<Job> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    let candidateId: string | undefined;
    if (session && session.user && session.user.id) {
      candidateId = session.user.id;
    }

    const response = await fetch(`${FLASK_API_BASE_URL}/job/${id}`, {
      headers: {
        ...(session && { 'Authorization': `Bearer ${session.access_token}` })
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch job');
    }

    const jobData: Job = await response.json();
    return _addMatchScoreToJob(jobData, candidateId);
  } catch (error) {
    console.error('Error fetching job:', error);
    throw error;
  }
};