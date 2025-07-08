/* eslint-disable react/no-unescaped-entities */
// app/my-applications/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getCurrentUser, getSupabaseAccessToken } from '@/lib/api/auth';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal'; // Assurez-vous d'avoir ce composant
import { deleteApplication, getUserApplications } from '@/lib/api/application';
import { fetchJobById } from '@/lib/api/job';
import { Application } from '@/types/Application';



const MyApplicationsPage: React.FC = () => {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Add these state variables at the top of your component
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Replace your handleCancelApplication function with this:
  const handleCancelApplication = (appId: string) => {
    setApplicationToDelete(appId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!applicationToDelete) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteApplication(applicationToDelete);
      
      if (result.success) {
        setApplications(prev => prev.filter(app => app.id !== applicationToDelete));
        setIsDeleteModalOpen(false);
        // Optional: Show a success toast/message
      } else {
        alert(result.error || "Failed to delete application");
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('An error occurred while deleting the application');
    } finally {
      setIsDeleting(false);
      setApplicationToDelete(null);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = await getCurrentUser();
        
        if (!user || !user.id) {
          throw new Error('Utilisateur non connecté');
        }

        // Récupérer les candidatures
        const appsResponse = await getUserApplications(user.id);
        const apps = appsResponse.applications && Array.isArray(appsResponse.applications) ? appsResponse.applications : [];
        
        // Pour chaque candidature, récupérer les détails du job
        const appsWithJobs = await Promise.all(
          apps.map(async (app: Application) => {
            try {
              const job = await fetchJobById(app.job_id);
              return { ...app, job };
            } catch (err) {
              console.error(`Error fetching job ${app.job_id}:`, err);
              return app; // Retourner l'application sans les détails du job
            }
          })
        );

        setApplications(appsWithJobs);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending':
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: Application['status']) => {
    switch (status) {
      case 'accepted': return 'Retenu';
      
      case 'rejected': return 'Rejeté';
      case 'reviewed': return 'En revue';
      case 'pending': 
      default: return 'En attente';
    }
  };

  const handleViewDetails = (app: Application) => {
    setSelectedApplication(app);
    setIsModalOpen(true);
  };

  const handleEditApplication = (jobId: string) => {
    router.push(`/candidate/jobs/${jobId}`);
  };



  const handleDownloadFile = async (fileUrl: string, fileName: string) => {
    try {
      const token = await getSupabaseAccessToken();
      if (!token) return null;
         
      const response = await fetch(fileUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Échec du téléchargement');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement du fichier');
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="container mx-auto px-6 text-center">
          <p>Chargement...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-primary-800 mb-8 text-center">
          Mes Candidatures
        </h1>

        {applications.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-xl text-neutral-600">Aucune candidature</p>
            <Button
              onClick={() => router.push('/candidate/jobs')}
              className="mt-6"
            >
              Voir les offres
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Offre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entreprise</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">État</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {app.job?.company?.logo_url && (
                          <Image
                            src={app.job.company.logo_url}
                            alt="Logo"
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        )}
                        <div className="ml-4">
                          <div className="font-medium">{app.job?.title || 'Offre non disponible'}</div>
                          <div className="text-sm text-gray-500">{app.job?.location || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{app.job?.company?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{app.job?.contract_type || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(app.applied_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {getStatusText(app.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <Button
                        onClick={() => handleViewDetails(app)}
                        variant="outline"
                        // size="sm"
                      >
                        Voir plus
                      </Button>
                      {app.status !== 'rejected' && app.status !== 'accepted' && (
                        <Button
                          onClick={() => handleCancelApplication(app.id)}
                          variant="primary"
                          // size="sm"
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


        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Confirmer la suppression</h2>
            
            <p className="text-center text-gray-600">
              Êtes-vous sûr de vouloir supprimer cette candidature ? Cette action est irréversible.
            </p>
            
            <div className="flex justify-center space-x-4 pt-4">
              <Button
                onClick={() => setIsDeleteModalOpen(false)}
                variant="outline"
                disabled={isDeleting}
              >
                Annuler
              </Button>
              <Button
                onClick={handleConfirmDelete}
                variant="primary"
                disabled={isDeleting}
              >
                {isDeleting ? 'Suppression...' : 'Confirmer'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal pour afficher les détails */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {selectedApplication && (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-2xl font-bold">{selectedApplication.job?.title || 'Offre non disponible'}</h2>
                <p className="text-gray-600">{selectedApplication.job?.company?.name || 'N/A'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Détails de l'offre</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Localisation:</span> {selectedApplication.job?.location || 'N/A'}</p>
                    <p><span className="font-medium">Type de contrat:</span> {selectedApplication.job?.contract_type || 'N/A'}</p>
                    <p><span className="font-medium">Salaire:</span> {selectedApplication.job?.salary_range || 'Non spécifié'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Votre candidature</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Date:</span> {new Date(selectedApplication.applied_at).toLocaleDateString('fr-FR')}</p>
                    <p><span className="font-medium">Statut:</span> <span className={getStatusColor(selectedApplication.status)}>{getStatusText(selectedApplication.status)}</span></p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Documents</h3>
                <div className="space-y-4">
                  {/* Section CV */}
                  <div>
                    <p className="font-medium">CV:</p>
                    {selectedApplication.custom_cv_url ? (
                      <button
                        onClick={() => handleDownloadFile(selectedApplication.custom_cv_url!, 'cv.pdf')}
                        className="text-blue-600 hover:underline flex items-center mt-1"
                      >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Télécharger le CV
                      </button>
                    ) : (
                      <p className="text-gray-500">CV par défaut utilisé</p>
                    )}
                  </div>

                  {/* Section Lettre de motivation */}
                  <div>
                    <p className="font-medium">Lettre de motivation:</p>
                    {selectedApplication.cover_letter_text && (
                      <div className="bg-gray-50 p-3 rounded mt-1 mb-2">
                        <p className="whitespace-pre-line">{selectedApplication.cover_letter_text}</p>
                      </div>
                    )}
                    {selectedApplication.cover_letter_file_url && (
                      <button
                        onClick={() => handleDownloadFile(
                          selectedApplication.cover_letter_file_url!, 
                          selectedApplication.cover_letter_file_url?.endsWith('.pdf') ? 'lettre_motivation.pdf' : 'lettre_motivation.txt'
                        )}
                        className="text-blue-600 hover:underline flex items-center mt-1"
                      >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Télécharger la lettre
                      </button>
                    )}
                    {!selectedApplication.cover_letter_text && !selectedApplication.cover_letter_file_url && (
                      <p className="text-gray-500">Aucune lettre de motivation fournie</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                >
                  Fermer
                </Button>
                <Button 
                  onClick={() => {
                    setIsModalOpen(false);
                    handleEditApplication(selectedApplication.job_id);
                  }}
                >
                  Modifier la candidature
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default MyApplicationsPage;