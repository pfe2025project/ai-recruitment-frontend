'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createJob } from '@/lib/api/job';
import { fetchCompanies, Company } from '@/lib/api/company';
import { useAuth } from '@/context/AuthContext';

export default function NewJobPage() {
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    location: '',
    requirements: [],
    education: '',
    contract_type: '' as '' | 'CDI' | 'CDD' | 'Internship' | 'Freelance',
    work_mode: '' as '' | 'On-site' | 'Remote' | 'Hybrid',
    salary_min: '' as number | '',
    salary_max: '' as number | '',
    salary_currency: '',
    skills: [],
    experience: '',
    deadline: ''
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const data = await fetchCompanies();
        setCompanies(data);
        if (data.length > 0) {
          setSelectedCompanyId(data[0].id); // Select the first company by default
        }
      } catch (err) {
        console.error('Failed to fetch companies:', err);
        setError('Failed to load companies.');
      }
    };
    getCompanies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJobData(prevData => {
      if (name === 'requirements' || name === 'skills') {
        return {
          ...prevData,
          [name]: (value as string).split(',').map(item => item.trim())
        };
      } else if (name === 'contract_type' || name === 'work_mode' || name === 'salary_currency') {
        return {
          ...prevData,
          [name]: value
        };
      } else if (name === 'salary_min' || name === 'salary_max') {
        return {
          ...prevData,
          [name]: value === '' ? '' : Number(value)
        };
      }
      return {
        ...prevData,
        [name]: value
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...jobData,
        company_id: selectedCompanyId,
        requirements: jobData.requirements.map((req: string) => req.trim()).filter((req: string) => req.length > 0),
        skills: jobData.skills.map((skill: string) => skill.trim()).filter((skill: string) => skill.length > 0),
        salary_min: jobData.salary_min === '' ? null : Number(jobData.salary_min),
        salary_max: jobData.salary_max === '' ? null : Number(jobData.salary_max),
      };

      if (!payload.company_id) {
        setError('Please select a company.');
        setLoading(false);
        return;
      }

      await createJob(payload);
      alert('Job created successfully!');
      router.push('/recruiter/dashboard'); // Redirect to dashboard after creation
    } catch (err) {
      setError('Failed to create job. Please try again.');
      console.error('Error creating job:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Job Posting</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
          <input type="text" id="title" name="title" value={jobData.title} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" name="description" value={jobData.description} onChange={handleChange} required rows={5} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input type="text" id="location" name="location" value={jobData.location} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">Requirements</label>
          <textarea id="requirements" name="requirements" value={jobData.requirements} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
        </div>
        <div>
          <label htmlFor="education" className="block text-sm font-medium text-gray-700">Education</label>
          <input type="text" id="education" name="education" value={jobData.education} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label htmlFor="contract_type" className="block text-sm font-medium text-gray-700">Contract Type</label>
          <select id="contract_type" name="contract_type" value={jobData.contract_type} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            <option value="">Select contract type</option>
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Internship">Internship</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>
        <div>
          <label htmlFor="work_mode" className="block text-sm font-medium text-gray-700">Work Mode</label>
          <select id="work_mode" name="work_mode" value={jobData.work_mode} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            <option value="">Select work mode</option>
            <option value="On-site">On-site</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
        <div>
          <label htmlFor="salary_min" className="block text-sm font-medium text-gray-700">Minimum Salary</label>
          <input type="number" id="salary_min" name="salary_min" value={jobData.salary_min} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label htmlFor="salary_max" className="block text-sm font-medium text-gray-700">Maximum Salary</label>
          <input type="number" id="salary_max" name="salary_max" value={jobData.salary_max} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label htmlFor="salary_currency" className="block text-sm font-medium text-gray-700">Salary Currency</label>
          <input type="text" id="salary_currency" name="salary_currency" value={jobData.salary_currency} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience</label>
          <input type="text" id="experience" name="experience" value={jobData.experience} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Application Deadline</label>
          <input type="date" id="deadline" name="deadline" value={jobData.deadline} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
          <input type="text" id="skills" name="skills" value={jobData.skills} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>

        <div>
          <label htmlFor="company_id" className="block text-sm font-medium text-gray-700">Company</label>
          <select
            id="company_id"
            name="company_id"
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">
          {loading ? 'Creating...' : 'Create Job'}
        </button>
      </form>
    </div>
  );
}