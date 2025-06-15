/* eslint-disable react/no-unescaped-entities */
// app/my-applications/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { dummyJobs, Job } from '@/data/dummyJobs'; // Import Job interface and dummyJobs
import Button from '@/components/ui/Button'; // Assuming you have this Button component

const MyApplicationsPage: React.FC = () => {
  const router = useRouter();
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);

  useEffect(() => {
    // In a real application, you would fetch the user's applications from an API.
    // For this dummy setup, we filter jobs that have an applicationStatus.
    const userApplications = dummyJobs.filter(job => job.applicationStatus);
    setAppliedJobs(userApplications);
  }, []);

  const getStatusColor = (status: Job['applicationStatus']) => {
    switch (status) {
      case 'retenu':
        return 'bg-green-100 text-green-800';
      case 'entretien prévu':
        return 'bg-blue-100 text-blue-800';
      case 'rejeté':
        return 'bg-red-100 text-red-800';
      case 'en attente':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleViewJobDetails = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  const handleCancelApplication = (jobId: string) => {
    // In a real app, send a request to your backend to cancel the application
    if (confirm('Êtes-vous sûr de vouloir annuler cette candidature ?')) {
      console.log(`Cancelling application for job ID: ${jobId}`);
      // Simulate successful cancellation
      setAppliedJobs(prev => prev.map(job =>
        job.id === jobId ? { ...job, applicationStatus: 'rejeté', hasApplied: false } : job
      ));
      alert('Candidature annulée.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-neutral-800 mb-8 text-center" style={{ color: 'var(--primary-800)' }}>Mes Candidatures</h1>

        {appliedJobs.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-xl text-neutral-600">Vous n'avez pas encore postulé à des offres.</p>
            <Button
              onClick={() => router.push('/jobs')}
              variant="primary"
              className="mt-6 py-2 px-6"
              style={{ backgroundColor: 'var(--primary-500)', color: 'white' }}
            >
              Découvrir les offres
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Offre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entreprise
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de Candidature
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    État
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appliedJobs.map((job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {job.imageUrl && (
                          <div className="flex-shrink-0 h-10 w-10">
                            <Image
                              className="h-10 w-10 rounded-full"
                              src={job.imageUrl}
                              alt={`${job.company} logo`}
                              width={40}
                              height={40}
                            />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">{job.title}</div>
                          <div className="text-sm text-neutral-500">{job.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">{job.company}</div>
                      <div className="text-sm text-neutral-500">{job.contractType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {job.applicationDate ? new Date(job.applicationDate).toLocaleDateString('fr-FR') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(job.applicationStatus)}`}
                      >
                        {job.applicationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        onClick={() => handleViewJobDetails(job.id)}
                        variant="outline"
                        className="text-primary-600 hover:text-primary-800 mr-4 py-1 px-2"
                        style={{ color: 'var(--primary-600)' }}
                      >
                        Voir l'offre
                      </Button>
                      {job.applicationStatus !== 'rejeté' && job.applicationStatus !== 'retenu' && (
                        <Button
                          onClick={() => handleCancelApplication(job.id)}
                          variant="primary"
                          className="bg-red-100 text-red-600 cursor-pointer hover:bg-red-200 hover:text-red-800 py-1 px-2"
                          style={{ color: 'var(--danger-500)' }}
                        >
                          Annuler
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplicationsPage;