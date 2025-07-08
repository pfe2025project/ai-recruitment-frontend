'use client';

import React, { useEffect, useState } from 'react';
import { fetchJobs, fetchCandidatesForJob, Job } from '@/lib/api/job';
import { Candidate } from '@/types/Candidate';
import { supabase } from '@/lib/supabase/client';

interface JobWithCandidates extends Job {
  candidates: Candidate[];
}

const RecruiterJobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAcceptApplication = async (applicationId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('User not logged in');
        return;
      }
      
      // Refresh jobs to reflect the updated status
      const recruiterId = user.id;
      const fetchedJobs = await fetchJobs({ recruiter_id: recruiterId });
      const jobsWithCandidates = await Promise.all(
        fetchedJobs.map(async (job) => {
          const candidates = await fetchCandidatesForJob(job.id);
          return { ...job, candidates };
        })
      );
      setJobs(jobsWithCandidates);
    } catch (err) {
      setError('Failed to accept application');
      console.error(err);
    }
  };

  useEffect(() => {
    const getJobs = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('User not logged in');
          setLoading(false);
          return;
        }

        const recruiterId = user.id;
        const fetchedJobs = await fetchJobs({ recruiter_id: recruiterId });
        const jobsWithCandidates = await Promise.all(
          fetchedJobs.map(async (job) => {
            const candidates = await fetchCandidatesForJob(job.id);
            return { ...job, candidates };
          })
        );
        setJobs(jobsWithCandidates);
      } catch (err) {
        setError('Failed to fetch jobs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, []);

  if (loading) {
    return <div>Loading jobs...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Posted Jobs</h1>
      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job.id} className="border p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
              <p className="text-gray-600">{job.description}</p>
              <p className="text-sm text-gray-500">Location: {job.location}</p>
              <p className="text-sm text-gray-500">Created: {new Date(job.created_at).toLocaleDateString()}</p>

              <h3 className="text-lg font-medium mt-4 mb-2">Applicants ({job.candidates.length})</h3>
              {job.candidates.length === 0 ? (
                <p className="text-gray-500">No candidates have applied yet.</p>
              ) : (
                <ul className="list-disc pl-5 space-y-1">
                  {job.candidates.map((candidate: Candidate) => (
                    <li key={candidate.application_id} className="text-gray-700">
                      {candidate.full_name} ({candidate.email}) - Status: {candidate.status} - Applied: {new Date(candidate.applied_at).toLocaleDateString()}
                      {candidate.status === 'pending' && (
                        <button
                          onClick={() => handleAcceptApplication(candidate.application_id)}
                          className="ml-4 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                          Accept
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterJobsPage;