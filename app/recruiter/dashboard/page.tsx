/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import {  logout, getAccessToken } from '@/lib/api/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RecruiterDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    setToken(token);
  }, []);


  const handleLogout = () => {
    logout();
    router.push('/login');
  };



  return (
    <div className="text-center text-2xl mt-10">
      <p>Welcome to your dashboard!</p>

      <div className="mt-6">
        <strong>Your token:</strong>
        <pre className="break-all bg-gray-100 p-4 rounded max-w-xl mx-auto mt-2">
          {token ?? 'No token found'}
        </pre>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
