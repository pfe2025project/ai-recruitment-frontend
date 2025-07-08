/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave, FaRegClock, FaStar, FaRegStar } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import ToggleSwitch from '@/components/ui/ToggleSwitch';
import JobCard from '@/components/candidate/jobs/JobCard';
import { Job } from '@/types/Job';
import { fetchJobs } from '@/lib/api/job';

const JobSearchPage = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [contractType, setContractType] = useState('');
  const [workModes, setWorkModes] = useState<string[]>([]);
  const [minSalary, setMinSalary] = useState(0);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);


  // Fetch jobs based on filters
  const fetchJobsData = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm,
        location,
        contract_type: contractType,
        work_mode: workModes, // Ensure this is an array
        min_salary: minSalary,
        page: currentPage
      };
      
      const jobsData = await fetchJobs(params) || []; // Ensure jobsData is an array
      console.log('Fetched jobs data:', jobsData);
      setJobs(jobsData);
      setFilteredJobs(showRecommendedOnly ? jobsData.filter(job => job.is_recommended) : jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recommended jobs

  // Initial load and when recommended toggle changes
  useEffect(() => {
      fetchJobsData();
    }, [showRecommendedOnly]);

  // When filters change
  useEffect(() => {
    fetchJobsData();
  }, [searchTerm, location, contractType, workModes, minSalary, currentPage, showRecommendedOnly]);



  const handleSearch = () => {
    setCurrentPage(1);
    fetchJobsData();
  };


  const toggleWorkMode = (mode: string) => {
    const newWorkModes = workModes.includes(mode) 
      ? workModes.filter(m => m !== mode) 
      : [...workModes, mode];
    setWorkModes(newWorkModes);
  };

  const handleViewDetails = (id: string) => {
    router.push(`/candidate/jobs/${id}`);
  };

  const handleToggleSave = (id: string) => {
    setSavedJobs(prev => 
      prev.includes(id) ? prev.filter(jobId => jobId !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocation('');
    setContractType('');
    setWorkModes([]);
    setMinSalary(0);
    setFilteredJobs(showRecommendedOnly ? jobs.filter(job => job.is_recommended) : jobs);
  };

  // Filter options
  const workModeOptions = [
    { value: 'On-site', label: 'On Site', icon: <FaMapMarkerAlt /> },
    { value: 'Remote', label: 'Remote', icon: <FaBriefcase /> },
    { value: 'Hybrid', label: 'Hybrid', icon: <IoMdTime /> }
  ];

  const contractOptions = [
    { value: '', label: 'All Types' },
    { value: 'CDI', label: 'Full-time' },
    { value: 'CDD', label: 'Contract' },
    { value: 'Freelance', label: 'Freelance' }
  ];

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'Paris', label: 'Paris' },
    { value: 'Lyon', label: 'Lyon' },
    { value: 'Remote', label: 'Remote' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header with Search */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 py-12 px-6 text-white" style={{
            backgroundImage: `linear-gradient(to right, var(--primary-600), var(--secondary-700))`
          }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Find Your Dream Job</h1>
            <p className="text-lg md:text-xl opacity-90">Discover opportunities that match your skills and preferences</p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute z-[10] inset-y-0 left-0 pl-4 flex items-center ">
                <FaSearch className="text-gray-100  " />
              </div>
              <input
                type="text"
                className="w-full pl-12 pr-28 py-4 rounded-lg text-white placeholder-gray-300 border border-white/30 bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Job title, keywords, or company"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch} 
                className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-800 bg-white rounded-md hover:bg-white transition-colors shadow-sm"
              >
                <FaSearch className="text-gray-800" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="container mx-auto px-6 py-4 lg:hidden">
        <div className="flex gap-3">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex-1 flex items-center justify-center py-3 px-4 bg-white border border-gray-200 rounded-lg shadow-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <FaFilter className="mr-2 text-blue-600" />
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-72 ${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center text-gray-800">
                  <FaFilter className="mr-2 text-blue-600" />
                  Filters
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all
                </button>
              </div>

              {/* Recommended Jobs Toggle */}
              <div className="mb-6">
                <ToggleSwitch
                  isOn={showRecommendedOnly}
                  handleToggle={() => setShowRecommendedOnly(prev => !prev)}
                  label="Recommended Jobs"
                />
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-gray-400" />
                  Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {locationOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Work Mode Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <IoMdTime className="mr-2 text-gray-400" />
                  Work Mode
                </label>
                <div className="space-y-2">
                  {workModeOptions.map(option => (
                    <label key={option.value} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workModes.includes(option.value)}
                        onChange={() => toggleWorkMode(option.value)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 flex items-center">
                        {option.icon}
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Contract Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaBriefcase className="mr-2 text-gray-400" />
                  Contract Type
                </label>
                <select
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {contractOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salary Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaMoneyBillWave className="mr-2 text-gray-400" />
                  Minimum Salary (€)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="5000"
                  value={minSalary}
                  onChange={(e) => setMinSalary(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>100k+</span>
                </div>
              </div>

              <button
                onClick={handleSearch}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm mt-2"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Job Listings */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {loading ? 'Loading...' : (
                  <>
                    <span className="flex items-center">
                        <FaStar className="text-yellow-400 mr-2" />
                        Recommended For You
                      </span>
                    <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                      {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
                    </span>
                  </>
                )}
              </h2>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}

            {/* Job Cards */}
            {!loading && filteredJobs.length > 0 && (
              <div className="space-y-6">
                {filteredJobs.map(job => (
                  <JobCard
                    key={job.id}
                    id={job.id}
                    title={job.title}
                    company={job.company?.name || 'N/A'}
                    location={job.location}
                    postedDate={new Date(job.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                    contractType={job.contract_type || 'Not specified'}
                    description={job.description}
                    imageUrl={job.company?.logo_url}
                    salary={job.salary_range}
                    skills={job.skills}
                    isSaved={savedJobs.includes(job.id)}
                    matchScore={job.match_score}
                    onViewMore={handleViewDetails}
                    onToggleSave={handleToggleSave}
                    isRecommended={job.is_recommended}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredJobs.length === 0 && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
                <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <FaSearch className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  No recommended jobs found
                </h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  We couldn't find jobs matching your profile. Try browsing all jobs or updating your profile.
                </p>
                <div className="flex justify-center gap-3">

                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;