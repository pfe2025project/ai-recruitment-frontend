// app/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      setMessage('Password reset link sent to your email!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary-50)] to-white flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left side - illustration or welcome */}
        <div className="hidden md:flex flex-col items-center justify-center bg-[var(--primary-600)] text-white p-8">
          <h2 className="text-3xl font-bold mb-2">Forgot Your Password?</h2>
          <p className="text-lg text-[var(--primary-100)] text-center">
            Don’t worry — it happens! Enter your email and we’ll send you a link to reset your password.
          </p>
          <Image
            src="/favicon.ico"
            alt="App Logo"
            width={64}
            height={64}
            className="mt-8 rounded-lg"
          />
        </div>

        {/* Right side - form */}
        <div className="p-8">
          <div className="mb-6 text-center">
            <Image src="/favicon.ico" alt="App Logo" width={48} height={48} className="mx-auto" />
            <h1 className="text-2xl font-bold mt-4">Reset Your Password</h1>
          </div>

          {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
              {message}. <Link href="/login" className="underline text-green-800 font-medium">Back to login</Link>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
                </label>
                <input
                id="email"
                type="email"
                disabled={isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--primary-500)] focus:border-[var(--primary-500)] bg-[var(--primary-50)] text-gray-800"
                placeholder="Enter your email"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-md transition duration-200 ${
                isSubmitting
                    ? 'bg-[color:var(--primary-400)] cursor-not-allowed'
                    : 'bg-[color:var(--primary-600)] cursor-pointer hover:bg-[color:var(--primary-700)]'
                } text-white font-medium`}
            >
                {isSubmitting ? (
                <svg
                    className="animate-spin h-5 w-5 mx-auto text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    ></circle>
                    <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                </svg>
                ) : (
                'Reset Password'
                )}
            </button>
          </form>



          <p className="mt-6 text-sm text-center text-gray-600">
            Remembered your password?{' '}
            <Link href="/login" className="text-[var(--primary-600)] hover:underline font-medium">
              Go back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}