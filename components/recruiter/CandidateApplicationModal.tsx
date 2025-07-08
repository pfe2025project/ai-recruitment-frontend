// components/recruiter/CandidateApplicationModal.tsx
import React, { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { CandidateMatch } from '@/types/Candidate';
import { fetchprofiledata } from '@/lib/data/profile';
import { ProfileData } from '@/types/Profile';
import { updateApplicationStatus } from '@/lib/api/application';
import { toast } from 'react-toastify';

interface CandidateApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateMatch;
  onStatusChange: (applicationId: string, newStatus: 'accepted' | 'rejected') => void;
}

const CandidateApplicationModal: React.FC<CandidateApplicationModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onStatusChange,
}) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      if (!candidate?.candidate_id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchprofiledata(candidate.candidate_id);
        if (data) {
          setProfileData(data);
        } else {
          setError('Profile data not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      getProfile();
    }
  }, [isOpen, candidate?.candidate_id]);

  const handleApplicationAction = async (status: 'accepted' | 'rejected') => {
    if (!candidate.application_id) {
      toast.error('Application ID is missing. Cannot update status.');
      return;
    }

    try {
      await updateApplicationStatus(candidate.application_id, status);
      toast.success(`Application ${status} successfully!`);
      onStatusChange(candidate.application_id, status);
      onClose();
    } catch (error) {
      toast.error(`Failed to ${status} application.`);
    }
  };


  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Application for {candidate.first_name} {candidate.last_name}
                </Dialog.Title>
                <div className="mt-2">
                  {loading && <p>Loading CV...</p>}
                  {error && <p className="text-red-500">Error: {error}</p>}
                  {profileData?.cvPdfUrl && !loading ? (
                    <iframe
                      src={profileData.cvPdfUrl}
                      width="100%"
                      height="500px"
                      style={{ border: 'none' }}
                      title="Candidate CV"
                    ></iframe>
                  ) : !loading && !error && (
                    <p>No CV available for this candidate.</p>
                  )}
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                    onClick={() => handleApplicationAction('accepted')}
                  >
                    Accept Application
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    onClick={() => handleApplicationAction('rejected')}
                  >
                    Reject Application
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CandidateApplicationModal;