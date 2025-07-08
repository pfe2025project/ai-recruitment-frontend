'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchRecruiterDashboardData, RecruiterDashboardData, JobDashboardData } from '@/lib/api/dashboard';
import { CandidateMatch } from '@/types/Candidate';
import CandidateApplicationModal from '@/components/recruiter/CandidateApplicationModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RecruiterDashboardPage = () => {
  const { user, role, loading: authLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<RecruiterDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateMatch | null>(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  const handleViewApplication = (candidate: CandidateMatch) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleStatusChange = (applicationId: string, newStatus: 'accepted' | 'rejected') => {
    if (dashboardData) {
      const updatedJobs = dashboardData.jobs.map(job => ({
        ...job,
        candidates: job.candidates.map(candidate =>
          candidate.application_id === applicationId
            ? { ...candidate, application_status: newStatus }
            : candidate
        )
      }));
      setDashboardData({ jobs: updatedJobs });
      toast.success(`Application ${newStatus} for candidate ${selectedCandidate?.first_name} ${selectedCandidate?.last_name}`);
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    const getDashboardData = async () => {
      if (authLoading) return;

      if (user?.id && role === 'recruiter') {
        try {
          const data = await fetchRecruiterDashboardData(user.id);
          setDashboardData(data);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch dashboard data');
        } finally {
          setLoading(false);
        }
      } else if (!user) {
        router.push('/login'); // Redirect to login if not authenticated
      } else {
        setLoading(false);
        setError('Please log in as a recruiter to view the dashboard.');
      }
    };

    getDashboardData();
  }, [user, authLoading, role]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  if (!user || role !== 'recruiter') {
    return <div className="container mx-auto p-4">Please log in as a recruiter to view the dashboard.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="flex space-x-2 mb-4 bg-gray-100 p-2 rounded-lg">
        {['all', 'pending', 'accepted', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setActiveStatusFilter(status as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${activeStatusFilter === status ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-800 hover:bg-gray-200'}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {dashboardData?.jobs && dashboardData.jobs.length > 0 ? (
        <>
          {dashboardData.jobs.map((job: JobDashboardData) => (
            <div key={job.job_id} className="bg-white shadow-md rounded-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Job: {job.job_title}</h2>
                <div className="flex space-x-4 text-sm text-gray-600">
                  <span>Total: {job.total_applications}</span>
                  <span>Accepted: {job.accepted_applications}</span>
                  <span>Rejected: {job.rejected_applications}</span>
                  <span>Pending: {job.pending_applications}</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3">Candidates for this Job:</h3>

              {(() => {
                const filteredCandidates = job.candidates.filter(candidate =>
                  activeStatusFilter === 'all' || candidate.application_status.toLowerCase() === activeStatusFilter
                );

                return filteredCandidates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {filteredCandidates.map(candidate => (
                      <div key={candidate.candidate_id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col">
                        <div className="flex items-center mb-2">
                          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold mr-3">
                            {candidate.first_name ? candidate.first_name.charAt(0) : ''}{candidate.last_name ? candidate.last_name.charAt(0) : ''}
                          </div>
                          <h4 className="text-lg font-semibold">{candidate.first_name} {candidate.last_name}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Status: {candidate.application_status}</p>
                        {candidate.match_score !== null && (
                          <p className="text-sm text-gray-600 mb-3">Match Score: {candidate.match_score.toFixed(2)}%</p>
                        )}
                        <button
                          onClick={() => handleViewApplication(candidate)}
                          className="mt-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                          View Application
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No {activeStatusFilter !== 'all' ? activeStatusFilter : ''} candidates have applied for this job yet.
                  </p>
                );
              })()}

              <h3 className="text-xl font-semibold mb-3 mt-4">Best Matches:</h3>
              {job.best_matches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {job.best_matches.map(candidate => (
                    <div key={candidate.candidate_id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center text-lg font-bold mr-3">
                          {candidate.first_name ? candidate.first_name.charAt(0) : ''}{candidate.last_name ? candidate.last_name.charAt(0) : ''}
                        </div>
                        <h4 className="text-lg font-semibold">{candidate.first_name} {candidate.last_name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Match Score: {candidate.match_score !== null ? candidate.match_score.toFixed(2) : 'N/A'}%</p>
                      <button
                        onClick={() => handleViewApplication(candidate)}
                        className="mt-auto px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                      >
                        View Application
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No best matches found yet. Ensure matching process has run.</p>
              )}
            </div>
          ))}

          {selectedCandidate && (
            <CandidateApplicationModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              candidate={selectedCandidate}
              onStatusChange={handleStatusChange}
            />
          )}
        </>
      ) : (
        <p className="text-gray-700">No jobs created by you yet. Create a new job to see dashboard data.</p>
      )}
    </div>
  );
};

export default RecruiterDashboardPage;
