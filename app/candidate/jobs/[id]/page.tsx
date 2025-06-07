/* eslint-disable react/no-unescaped-entities */
// app/jobs/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { MdWork, MdLocationOn, MdCalendarToday, MdAccessTime } from 'react-icons/md';
import { FaMoneyBillAlt, FaArrowLeft, FaCheckCircle, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { IoDiamondOutline } from 'react-icons/io5';

import { dummyJobs } from '@/data/dummyJobs'; // Adjust path if you move it
import { dummyProfileData, UserCV } from '@/data/dummyProfileData2'; // Import dummyProfileData and UserCV

// Ensure this interface matches the extended dummyJobs structure
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  postedDate: string;
  contractType: string;
  workMode: string;
  sector: string;
  description: string;
  imageUrl?: string;
  salary?: string;
  skills?: string[];
  requirements?: {
    diploma?: string[];
    experience?: string;
    languages?: string[];
    other?: string[];
  };
  hasApplied?: boolean;
  matchScore?: number;
}

// Import the new ApplyModal component
import ApplyModal from '@/components/application/ApplyModal';

const JobDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false); // State for modal visibility

  // Simulate fetching candidate's CVs (from dummyProfileData for now)
  const [userCvs, setUserCvs] = useState<UserCV[]>([]);

  useEffect(() => {
    // In a real app, you'd fetch data from an API:
    // fetch(`/api/jobs/${jobId}`).then(res => res.json()).then(setJob);

    // For now, find from dummy data
    const foundJob = dummyJobs.find((j) => j.id === jobId);
    if (foundJob) {
      setJob(foundJob);
      setIsApplied(foundJob.hasApplied || false); // Initialize from data
      // Check saved status from localStorage
      const storedSavedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      setIsSaved(storedSavedJobs.includes(jobId));
    } else {
      // Handle job not found (e.g., redirect to 404 or jobs list)
      router.push('/jobs'); // Redirect back to jobs list
    }

    // Simulate fetching user's CVs
    setUserCvs(dummyProfileData.userCvs);

  }, [jobId, router]); // Re-run if jobId changes

  const handleApplyClick = () => {
    setIsApplyModalOpen(true); // Open the modal
  };

  const handleConfirmApplication = (jobId: string, selectedCv: File | UserCV, coverLetter: string) => {
    // In a real app, send application request to backend
    console.log(`Applying to Job ID: ${jobId}`);
    console.log('Selected CV:', selectedCv);
    console.log('Cover Letter:', coverLetter);

    // Simulate API call
    setTimeout(() => {
      setIsApplied(true);
      alert('Félicitations ! Votre candidature a été soumise avec succès.');
      // Optional: Update dummy data or backend, e.g., mark job as applied for this user
      // For this demo, we just update local state
    }, 1000);
  };

  const handleToggleSave = () => {
    setIsSaved(prev => {
      const storedSavedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      let newSavedJobs;
      if (prev) {
        newSavedJobs = storedSavedJobs.filter((id: string) => id !== jobId);
      } else {
        newSavedJobs = [...storedSavedJobs, jobId];
      }
      localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
      return !prev;
    });
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-neutral-600">Chargement de l'offre ou offre introuvable...</p>
      </div>
    );
  }

  const iconSize = 20;
  const textColor = 'var(--neutral-700)';

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-6 ">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-primary-600 hover:text-primary-800 transition-colors duration-200 mb-6"
          style={{ color: 'var(--primary-600)' }}
        >
          <FaArrowLeft className="mr-2" /> Retour aux offres
        </button>

        {/* Job Header Section */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center">
              {job.imageUrl && (
                <div className="mr-6 flex-shrink-0">
                  <Image
                    src={job.imageUrl}
                    alt={`${job.company} logo`}
                    width={80}
                    height={80}
                    className="rounded-full object-cover border border-gray-200"
                  />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold" style={{ color: 'var(--primary-800)' }}>{job.title}</h1>
                <p className="text-xl font-semibold mt-2" style={{ color: 'var(--secondary-600)' }}>{job.company}</p>
              </div>
            </div>
            <button
              onClick={handleToggleSave}
              className="p-3 rounded-full hover:bg-gray-100 transition-colors duration-200"
              title={isSaved ? "Ne plus sauvegarder" : "Sauvegarder l'offre"}
            >
            {isSaved ? (
            <FaBookmark size={20} className="text-indigo-500 cursor-pointer" />
            ) : (
            <FaRegBookmark size={20} className="text-neutral-400 cursor-pointer group-hover:text-neutral-600" />
            )}
            </button>
          </div>

          {/* Job Meta Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6 text-base mb-6" style={{ color: textColor }}>
            <div className="flex items-center">
              <MdLocationOn size={iconSize} className="mr-2" style={{ color: 'var(--primary-500)' }} />
              {job.location}
            </div>
            <div className="flex items-center">
              <MdAccessTime size={iconSize} className="mr-2" style={{ color: 'var(--primary-500)' }} />
              {job.contractType} ({job.workMode})
            </div>
            <div className="flex items-center">
              <MdCalendarToday size={iconSize} className="mr-2" style={{ color: 'var(--primary-500)' }} />
              Publié le {new Date(job.postedDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </div>
            {job.salary && (
              <div className="flex items-center">
                <FaMoneyBillAlt size={iconSize} className="mr-2" style={{ color: 'var(--primary-500)' }} />
                {job.salary}
              </div>
            )}
            {job.sector && (
                <div className="flex items-center">
                    <MdWork size={iconSize} className="mr-2" style={{ color: 'var(--primary-500)' }} />
                    {job.sector}
                </div>
            )}
            {job.matchScore !== undefined && (
                <div className="flex items-center">
                    <IoDiamondOutline size={iconSize} className="mr-2" style={{ color: 'var(--accent-500)' }} />
                    Score de matching: <span className="font-bold ml-1">{job.matchScore}%</span>
                </div>
            )}
          </div>

          {/* Apply Button & Status */}
          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleApplyClick} 
              variant={isApplied ? 'secondary' : 'primary'}
              disabled={isApplied}
              className="py-3 px-8 text-lg cursor-pointer"
              style={{
                backgroundColor: isApplied ? 'var(--secondary-500)' : 'var(--primary-500)',
                color: 'white',
              }}
            >
              {isApplied ? (
                <span className="flex items-center">
                  <FaCheckCircle className="mr-2" /> Déjà Postulé
                </span>
              ) : (
                'Postuler maintenant'
              )}
            </Button>
          </div>
        </div>

        {/* Job Details: Description, Requirements, Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Description */}
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--neutral-800)' }}>Description du poste</h2>
            <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Requirements & Skills Sidebar */}
          <div className="lg:col-span-1 bg-white p-8 rounded-lg shadow-md">
            {/* Requirements */}
            {job.requirements && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--neutral-800)' }}>Exigences</h3>
                <ul className="list-disc list-inside text-neutral-700 space-y-2">
                  {job.requirements.diploma && job.requirements.diploma.length > 0 && (
                    <li>
                      <span className="font-semibold">Diplôme:</span> {job.requirements.diploma.join(', ')}
                    </li>
                  )}
                  {job.requirements.experience && (
                    <li>
                      <span className="font-semibold">Expérience:</span> {job.requirements.experience}
                    </li>
                  )}
                  {job.requirements.languages && job.requirements.languages.length > 0 && (
                    <li>
                      <span className="font-semibold">Langues:</span> {job.requirements.languages.join(', ')}
                    </li>
                  )}
                  {job.requirements.other && job.requirements.other.length > 0 && (
                    <>
                      {job.requirements.other.map((item, index) => (
                        <li key={index}>
                           {item}
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </div>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--neutral-800)' }}>Compétences requises</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: 'var(--primary-100)',
                        color: 'var(--primary-800)'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {job && ( // Render modal only if job data is loaded
        <ApplyModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          job={job}
          userCvs={userCvs} // Pass the candidate's CVs
          onApply={handleConfirmApplication}
        />
      )}
    </div>
  );
};

export default JobDetailPage;