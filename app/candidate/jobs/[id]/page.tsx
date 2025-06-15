"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { MdWork, MdLocationOn, MdCalendarToday, MdAccessTime, MdPeople, MdEmail, MdLanguage } from 'react-icons/md';
import { FaMoneyBillAlt, FaArrowLeft, FaCheckCircle, FaBookmark, FaRegBookmark, FaStar, FaLinkedin, FaGlobe } from 'react-icons/fa';
import { IoDiamondOutline } from 'react-icons/io5';
import { fetchJobById, fetchRecommendedJobs } from '@/lib/api/job';
import { Job } from '@/types/Job';
import { Skeleton } from '@/components/ui/Skeleton';
import ApplyModal from '@/components/candidate/application/ApplyModal';

const JobDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const jobData = await fetchJobById(jobId);
        setJob(jobData);
        
        // Check saved status
        const storedSavedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        setIsSaved(storedSavedJobs.includes(jobId));

        // Fetch similar jobs
        setLoadingSimilar(true);
        const similar = await fetchRecommendedJobs();
        setSimilarJobs(similar.filter(j => j.id !== jobId).slice(0, 3));
      } catch (err) {
        setError('Failed to load job details');
        console.error('Error:', err);
      } finally {
        setLoading(false);
        setLoadingSimilar(false);
      }
    };

    fetchData();
  }, [jobId]);

  // ... (keep your existing handler functions)
  
  const handleApplyClick = () => {
    setIsApplyModalOpen(true);
  };

  const handleToggleSave = () => {
    setIsSaved(prev => {
      const storedSavedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      const newSavedJobs = prev 
        ? storedSavedJobs.filter((id: string) => id !== jobId)
        : [...storedSavedJobs, jobId];
      localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
      return !prev;
    });
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        {/* ... (keep your existing skeleton loader) */}
         <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-8 w-32 mb-6" />
            
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <Skeleton className="w-20 h-20 rounded-full" />
                  <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                </div>
                <Skeleton className="w-10 h-10 rounded-full" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
              
              <div className="flex justify-end">
                <Skeleton className="h-12 w-48 rounded-lg" />
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3 space-y-4">
                <Skeleton className="h-8 w-48 mb-4" />
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
              
              <div className="lg:w-1/3 space-y-8">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48" />
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
                
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48" />
                  <div className="flex flex-wrap gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-6 w-20 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
 <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Job Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || "The job you're looking for doesn't exist or may have been removed."}
          </p>
          <Button 
            onClick={() => router.push('/jobs')}
            variant="primary"
            className="px-6 py-3"
          >
            Browse Other Jobs
          </Button>
        </div>      </div>
    );
  }

  function handleConfirmApplication(jobId: string, cv: File | null, coverLetter: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6"
          >
            <FaArrowLeft className="mr-2" />
            Back to Jobs
          </button>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3">
              {/* Job Header Section */}
             <div className="bg-white rounded-xl shadow-sm p-8 mb-8 border border-gray-100">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-6">
                    {job.company?.logo_url ? (
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={job.company.logo_url}
                          alt={`${job.company.name} logo`}
                          fill
                          className="rounded-full object-cover border border-gray-200"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <MdWork size={32} />
                      </div>
                    )}
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                      <p className="text-xl font-semibold text-gray-700 mt-2">
                        {job.company?.name || 'Unknown Company'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleSave}
                    className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label={isSaved ? "Remove from saved jobs" : "Save this job"}
                  >
                    {isSaved ? (
                      <FaBookmark size={20} className="text-blue-600" />
                    ) : (
                      <FaRegBookmark size={20} className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Job Meta Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-gray-700">
                  <div className="flex items-center space-x-2">
                    <MdLocationOn size={20} className="text-blue-500" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MdAccessTime size={20} className="text-blue-500" />
                    <span>
                      {job.contract_type} • {job.work_mode}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MdCalendarToday size={20} className="text-blue-500" />
                    <span>
                      Posted {new Date(job.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  {job.salary_range && (
                    <div className="flex items-center space-x-2">
                      <FaMoneyBillAlt size={20} className="text-blue-500" />
                      <span>{job.salary_range}</span>
                    </div>
                  )}
                  {job.match_score && (
                    <div className="flex items-center space-x-2">
                      <IoDiamondOutline size={20} className="text-yellow-500" />
                      <span>
                        Match Score: <strong>{job.match_score}%</strong>
                      </span>
                    </div>
                  )}
                  {job.is_recommended && (
                    <div className="flex items-center space-x-2">
                      <FaStar size={20} className="text-yellow-400" />
                      <span className="font-medium text-yellow-600">Recommended</span>
                    </div>
                  )}
                </div>

                {/* Apply Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleApplyClick}
                    variant={isApplied ? 'secondary' : 'primary'}
                    disabled={isApplied}
                    className="px-8 py-3 text-lg"
                  >
                    {isApplied ? (
                      <span className="flex items-center">
                        <FaCheckCircle className="mr-2" /> Applied
                      </span>
                    ) : (
                      'Apply Now'
                    )}
                  </Button>
                </div>
              </div>

              {/* Job Description */}
              <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Description</h2>
                <div className="prose max-w-none text-gray-700">
                  {job.description.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {job.requirements && job.requirements.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {job.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Company Details Section */}
              <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Company</h2>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    {job.company?.logo_url ? (
                      <Image
                        src={job.company.logo_url}
                        alt={`${job.company.name} logo`}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        <MdWork size={48} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{job.company?.name || 'Unknown Company'}</h3>
                    
                    <p className="text-gray-600 mb-4">
                      {job.company?.description || 'No company description available.'}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      {job.company?.website && (
                        <div className="flex items-center text-blue-600">
                          <FaGlobe className="mr-2" />
                          <a 
                            href={job.company.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {job.company.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                      
                      <div className="flex items-center text-gray-600">
                        <MdPeople className="mr-2" />
                        <span>Company Size: 50-200 employees</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <MdLanguage className="mr-2" />
                        <span>Industry: Technology</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Recruiter Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recruiter Information</h3>
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <MdPeople size={20} />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Taoufik El Achaouch</h4>
                      <p className="text-sm text-gray-600">Senior Talent Acquisition Specialist</p>
                      <div className="flex items-center mt-1 space-x-3">
                        <a href="#" className="text-blue-600 hover:text-blue-800">
                          <FaLinkedin size={16} />
                        </a>
                        <a href="mailto:recruiter@example.com" className="text-gray-600 hover:text-gray-800">
                          <MdEmail size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3 space-y-6">
              {/* Quick Facts */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Job Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MdCalendarToday className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Posted Date</p>
                      <p className="font-medium">
                        {new Date(job.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MdLocationOn className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{job.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MdAccessTime className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Job Type</p>
                      <p className="font-medium">{job.contract_type} • {job.work_mode}</p>
                    </div>
                  </div>
                  
                  {job.salary_range && (
                    <div className="flex items-start">
                      <FaMoneyBillAlt className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Salary</p>
                        <p className="font-medium">{job.salary_range}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Similar Jobs */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Similar Jobs</h3>
                {loadingSimilar ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full rounded-lg" />
                    ))}
                  </div>
                ) : similarJobs.length > 0 ? (
                  <div className="space-y-4">
                    {similarJobs.map((similarJob) => (
                      <div 
                        key={similarJob.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                        onClick={() => router.push(`/jobs/${similarJob.id}`)}
                      >
                        <h4 className="font-medium text-gray-800">{similarJob.title}</h4>
                        <p className="text-sm text-gray-600 mb-1">{similarJob.company?.name}</p>
                        <div className="flex items-center text-xs text-gray-500 space-x-3">
                          <span>{similarJob.location}</span>
                          {similarJob.match_score && (
                            <span className="flex items-center">
                              <IoDiamondOutline className="mr-1 text-yellow-500" />
                              {similarJob.match_score}% match
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No similar jobs found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={job}
        onApply={handleConfirmApplication}
      />
    </div>
  );
};

export default JobDetailPage;