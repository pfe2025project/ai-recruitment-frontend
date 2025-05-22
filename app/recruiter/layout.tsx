'use client';

import { useEffect, useState } from 'react';
import Loader from '@/components/ui/loader';
import { useRouter } from 'next/navigation';
import { getAccessToken, getRole } from '@/lib/api/auth';

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push('/login');
      return;
    }

    const userRole = getRole(); // ex: "candidate", "recruiter"

    if (userRole !== 'recruiter') {
      router.push('/unauthorized'); // ou afficher message accès refusé
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return <Loader role='recruiter' />;
  }

  return (
    <div>
      {/* Navbar candidate, sidebar, etc */}
      {children}
    </div>
  );
}



