/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RoleToggle from '@/components/auth/RoleToggle';
import AuthForm from '@/components/auth/AuthForm';
import { isAuthenticated, registerUser } from '@/lib/api/auth';
import Loader from '@/components/ui/loader';

export default function RegisterPage() {
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [error, setError] = useState('');
  const router = useRouter(); 
  const [loading, setLoading] = useState(true);


  useEffect(() => {
      if (isAuthenticated()) {
        const r = localStorage.getItem('role');
        if (r === 'candidate') router.push('/candidate/dashboard');
        else if (r === 'recruiter') router.push('/recruiter/dashboard');
      } else{
        setLoading(false)
      }
      
    }, [loading,router]);


  if (loading) {
    return <Loader role='candidate' />;
  }

  const handleSubmit = async (
      e: React.FormEvent,
      email: string,
      password: string
    ) => {
      e.preventDefault();
      setError('');

      try {
        console.log(`Registering as ${role} with:`, { email, password });

        const result = await registerUser(email, password, role);
        console.log('Registration success:', result);

        // Store access_token in localStorage or cookie
        localStorage.setItem('access_token', result.access_token);
        localStorage.setItem('role', result.user.role); // candidate or recruiter

        // Redirect to the appropriate dashboard
        router.push(`/${role}/dashboard`);
      } catch (err: any) {
        if (err instanceof TypeError && err.message === "Failed to fetch") {
          setError("Server is not available. Please try again later.");
        } else {
          setError(err.message || "Registration failed");
        }
      }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with role indicator */}
        <div
          className={`py-6 px-8 text-center ${
            role === 'candidate'
              ? 'bg-[var(--primary-500)]'
              : 'bg-[var(--secondary-500)]'
          }`}
        >
          <h2 className="text-2xl font-bold text-white">
            {role === 'candidate' ? 'Candidate Login' : 'Recruiter Login'}
          </h2>
        </div>

        <div className="p-8">
          <RoleToggle role={role} setRole={setRole} />

          {error && (
            <div className="mb-6 p-3 font-bold rounded-lg bg-[var(--error)/10] text-[var(--error)] text-sm">
              {error}
            </div>
          )}

          <AuthForm type="register" onSubmit={handleSubmit} role={role} />

          <div className="mt-6 text-center text-neutral-600">
            Already have an account?{' '}
            <a 
              href="/login" 
              className={`font-medium ${role === 'candidate'
                                ? 'text-[var(--primary-600)] hover:text-[var(--primary-500)] '
                                : 'text-[var(--secondary-600)] hover:text-[var(--secondary-500)] '
                            }         
                            transition-colors`}
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );

}