/* eslint-disable @typescript-eslint/no-unused-vars */
// app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  const handleLogin = () => {
    router.push('/login');
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] px-4 text-center">
      <h1 className="text-4xl font-bold text-[var(--primary-800)] mb-6">
        Welcome to HireMatch AI
      </h1>
      <p className="text-lg text-[var(--neutral-700)] mb-8 max-w-md">
        An intelligent recruitment platform powered by AI & NLP
      </p>
      <button
        onClick={handleLogin}
        className="bg-[var(--primary-600)] hover:bg-[var(--primary-700)] text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
      >
        Get Started
      </button>
    </main>
  );
}