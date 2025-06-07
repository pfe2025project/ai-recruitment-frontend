/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { logout, getAccessToken, getCurrentUser } from '@/lib/api/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkCVUploadStatus } from '@/lib/api/cv';
import MultiStepFormModal from '@/components/ui/MultiStepFormModal';
import { steps } from '@/lib/candidate/config/steps';

export default function CandidateDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [cvUploaded, setCvUploaded] = useState<boolean | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const accessToken = getAccessToken();
    setToken(accessToken);

    const checkCV = async () => {
      const uploaded = await checkCVUploadStatus();
      setCvUploaded(uploaded);
      // setModalOpen(!uploaded); // open modal if CV not uploaded
      setModalOpen(true);
    };

    if (accessToken) checkCV();
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setCvUploaded(true); // assume form completed
  };

  

  return (
    <div className="text-center text-2xl mt-10">
      {cvUploaded === null ? (
        <p>Loading...</p>
      ) : cvUploaded ? (
        <>
          <p>Welcome to your dashboard!</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : null}

      {/* Show modal if CV not uploaded */}
      <MultiStepFormModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        steps={steps}
        onSave={handleModalClose}
      />
    </div>
  );
}

