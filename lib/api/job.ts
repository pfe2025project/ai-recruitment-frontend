import { Job, FetchJobsParams } from '@/types/Job';


const FLASK_API_BASE_URL = 'http://127.0.0.1:5000/job';

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
    return data.jobs || [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export const fetchJobById = async (id: string): Promise<Job> => {
  try {
    const response = await fetch(`${FLASK_API_BASE_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch job');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching job:', error);
    throw error;
  }
};

export const fetchRecommendedJobs = async (): Promise<Job[]> => {
  try {
    const response = await fetch(`${FLASK_API_BASE_URL}/recommended`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch recommended jobs');
    }

    const data = await response.json();
    return data.jobs || [];
  } catch (error) {
    console.error('Error fetching recommended jobs:', error);
    throw error;
  }
};