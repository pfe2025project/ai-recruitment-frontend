/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Job } from '@/types/Job';
import { FaTimes, FaUpload, FaFileAlt } from 'react-icons/fa';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
  onApply: (jobId: string, cv: File | null, coverLetter: string) => void;
}

interface UserCV {
  id: string;
  name: string;
  url: string;
  lastUpdated: string;
}

const ApplyModal: React.FC<ApplyModalProps> = ({ 
  isOpen, 
  onClose, 
  job, 
  onApply 
}) => {
  const [selectedCV, setSelectedCV] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userCvs, setUserCvs] = useState<UserCV[]>([]); // Will be fetched from API

  // Simulate fetching user's CVs (replace with real API call)
  useEffect(() => {
    const fetchUserCvs = async () => {
      // In a real app, you would fetch this from your API
      const mockCvs: UserCV[] = [
        {
          id: '1',
          name: 'My Professional CV.pdf',
          url: '/path/to/cv.pdf',
          lastUpdated: '2023-05-15',
        },
        {
          id: '2',
          name: 'Developer Resume.docx',
          url: '/path/to/resume.docx',
          lastUpdated: '2023-06-20',
        },
      ];
      setUserCvs(mockCvs);
    };

    fetchUserCvs();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedCV(e.target.files[0]);
    }
  };

  const handleCVSelect = (cv: UserCV) => {
    // In a real app, you would handle the selected CV from storage
    setSelectedCV(null); // Reset file selection
    
    // You would typically use the CV URL here
  };

  const handleSubmit = async () => {
    if ((!selectedCV && userCvs.length === 0) || !coverLetter.trim()) {
      alert('Please select a CV and write a cover letter');
      return;
    }

    setIsSubmitting(true);
    try {
      await onApply(job.id, selectedCV, coverLetter);
      onClose();
    } catch (error) {
      console.error('Application error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-590 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal container */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Apply for {job.title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6">
              {/* CV Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select your CV
                </label>
                
                {/* Existing CVs */}
                {userCvs.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <p className="text-sm text-gray-500 mb-2">Your saved CVs:</p>
                    {userCvs.map((cv) => (
                      <div 
                        key={cv.id}
                        className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleCVSelect(cv)}
                      >
                        <FaFileAlt className="text-gray-400 mr-3" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{cv.name}</p>
                          <p className="text-xs text-gray-500">
                            Updated {new Date(cv.lastUpdated).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload new CV */}
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">
                    {userCvs.length > 0 ? 'Or upload a new CV' : 'Upload your CV'}
                  </p>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                    />
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      {selectedCV 
                        ? selectedCV.name 
                        : 'Click to upload or drag and drop'}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      PDF, DOC, DOCX up to 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div className="mb-6">
                <label 
                  htmlFor="coverLetter" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Cover Letter
                </label>
                <Textarea
                  id="coverLetter"
                  rows={6}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Explain why you're a good fit for this position..."
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Footer with action buttons */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              variant="primary"
              className="w-full sm:ml-3 sm:w-auto"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
            <Button
              onClick={onClose}
              variant="secondary"
              className="mt-3 w-full sm:mt-0 sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyModal;