import { Job, FetchJobsParams, JobMatchScore } from '@/types/Job';
import { supabase } from '../supabase/client';


const FLASK_API_BASE_URL = 'http://127.0.0.1:5000/job';
const AI_MATCHING_API_BASE_URL = 'http://127.0.0.1:5000/api/ai-matching';

export const fetchJobs = async (params: FetchJobsParams = {}): Promise<Job[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add all non-undefined params to the query
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(item => queryParams.append(key, item));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const response = await fetch(`${FLASK_API_BASE_URL}?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }

    const data = await response.json();
    const { data: { session } } = await supabase.auth.getSession();
    let candidateId: string | undefined;
    if (session && session.user && session.user.id) {
      candidateId = session.user.id;
    }

    const transformedJobs: Job[] = await Promise.all((data.jobs || []).map(async (job: any) => {
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
        salary_range: job.salary_range || undefined,
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
    }));
    return transformedJobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
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

export const fetchJobById = async (id: string): Promise<Job> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    let candidateId: string | undefined;
    if (session && session.user && session.user.id) {
      candidateId = session.user.id;
    }

    const response = await fetch(`${FLASK_API_BASE_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch job');
    }

    const jobData: Job = await response.json();

    if (candidateId) {
      try {
        const matchScoreData = await fetchJobMatchScore(candidateId, id);
        jobData.match_score = matchScoreData.match_percentage ?? 0;
        jobData.is_recommended = (matchScoreData.match_percentage ?? 0) > 50; // Assuming a match score > 50 means it's recommended
      } catch (matchError) {
        console.warn(`Could not fetch match score for job ${id}:`, matchError);
        // Continue without match score if there's an error
      }
    }

    return jobData;
  } catch (error) {
    console.error('Error fetching job:', error);
    throw error;
  }
};