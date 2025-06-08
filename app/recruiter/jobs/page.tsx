// pages/jobs.tsx
'use client';
import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState, ChangeEvent, useEffect } from 'react';
import { dummyJobs, Job } from '@/data/dummyJobs';

import { useSearchParams } from 'next/navigation';




const Jobs: NextPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('Any type');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

 const searchParams = useSearchParams();
  const recruiterId = searchParams.get('recruiter_id') ?? '';
  useEffect(() => {
  
      fetch( `http://localhost:5000/offers/by-recruiter?recruiter_id=${encodeURIComponent(
        recruiterId
      )}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch jobs');
          return res.json();
        })
        .then((data) => setJobs(data.offers))
        .catch((err) => {
          console.error('Error loading jobs from API, falling back to dummy:', err);
        });
    
  }, [recruiterId]);

  useEffect(() => {
    const root = window.document.documentElement;
    theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
  }, [theme]);

  const now = new Date();
  const keywordLower = keyword.trim().toLowerCase();
 const filteredJobs = jobs.filter((job: Job) => {
    const matchesKeyword = !keywordLower ||
      job.title.toLowerCase().includes(keyword.toLowerCase()) ||
      job.description.toLowerCase().includes(keyword.toLowerCase());
    const matchesCity = !city || job.location.toLowerCase().includes(city.toLowerCase());
    const matchesType = typeFilter === 'Any type' || job.education === typeFilter;

    let matchesDateRange = true;
    if (startDate) {
      matchesDateRange = new Date(job.created_at) >= new Date(startDate);
    }
    if (endDate && matchesDateRange) {
      matchesDateRange = new Date(job.created_at) <= new Date(endDate);
    }

    return matchesKeyword && matchesCity && matchesType && matchesDateRange;
  });

  const clearAll = () => {
    setKeyword('');
    setCity('');
    setStartDate('');
    setEndDate('');
    setTypeFilter('Any type');
  };
console.log(jobs)
  return (
    <>
      <Head>
        <title>Jobs</title>
      </Head>
      <div className="min-h-screen py-8 bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
        <div className="container mx-auto px-4">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Jobs</h1>
              <p className="text-gray-600 dark:text-gray-400">Discover and apply to jobs</p>
            </div>
        
          </header>

          <div className="flex flex-wrap gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by keyword"
              value={keyword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
              className="flex-1 min-w-[200px] p-3 bg-gray-100 border border-gray-300 rounded placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
            />
            <input
              type="text"
              placeholder="Search by city"
              value={city}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
              className="flex-1 min-w-[200px] p-3 bg-gray-100 border border-gray-300 rounded placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
            />
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={startDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)}
                className="p-2 bg-gray-100 border border-gray-300 rounded text-black dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
              <span>to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)}
                className="p-2 bg-gray-100 border border-gray-300 rounded text-black dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-gray-100 border border-gray-300 rounded text-black focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option>Any type</option>
              <option>Bac+3</option>
              <option>Bac+5</option>
              {/* <option>Freelance</option> */}
            </select>
            <button
              onClick={clearAll}
              className="px-6 py-3 text-blue-500 hover:underline transition"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {filteredJobs.length ? filteredJobs.map((job: Job) => (
              <div key={job.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col justify-between bg-white dark:bg-transparent hover:shadow-lg dark:hover:shadow-white/10 transition">
              
                <div>
                  <h3 className="text-xl font-semibold mb-2 dark:text-white text-black">{job.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{job.description}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{job.education}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{job.created_at} • {job.workMode}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-500 dark:text-gray-500 text-sm">{job.requirements}</span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-500 border border-blue-500 rounded text-sm text-white hover:bg-blue-600 transition">details</button>
                    <button className="px-3 py-1 border border-gray-600 rounded text-sm text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition">☆</button>
                  </div>
                </div>
              </div>
            )) : (
              <p className="col-span-full text-center text-gray-500 dark:text-gray-400">No jobs found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Jobs;
