'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchCandidatesForJob } from '@/lib/api/job';
import { Candidate } from '@/types/Candidate';




export default function JobCandidatesPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (jobId) {
      const getCandidates = async () => {
        try {
          setLoading(true);
          const data = await fetchCandidatesForJob(jobId);
          setCandidates(data);
        } catch (err) {
          console.error('Error fetching candidates:', err);
          setError('Failed to load candidates.');
        } finally {
          setLoading(false);
        }
      };
      getCandidates();
    }
  }, [jobId]);

  if (loading) return <div className="text-center py-8">Loading candidates...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (candidates.length === 0) return <div className="text-center py-8">No candidates found for this job yet.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Candidates for Job ID: {jobId}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.map((candidate) => (
          <div key={candidate.candidate_id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{candidate.first_name} {candidate.last_name}</h2>
            <p className="text-gray-600 mb-1">{candidate.email}</p>
            {candidate.headline && <p className="text-gray-700 mb-2">{candidate.headline}</p>}
            {candidate.bio && <p className="text-gray-700 text-sm mb-2">{candidate.bio}</p>}
            {candidate.experience && <p className="text-gray-700 text-sm mb-2">Experience: {candidate.experience}</p>}
            {candidate.candidate_education && <p className="text-gray-700 text-sm mb-2">Education: {candidate.candidate_education}</p>}
            {candidate.candidate_skills && <p className="text-gray-700 text-sm mb-2">Skills: {candidate.candidate_skills}</p>}
            <p className="text-gray-800 font-medium">Status: {candidate.application_status}</p>
            <p className="text-gray-500 text-sm">Applied on: {new Date(candidate.applied_date).toLocaleDateString()}</p>
            {candidate.resume_url && (
              <a href={candidate.resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-2 inline-block">
                View Resume
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}