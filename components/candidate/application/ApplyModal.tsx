/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Button from "@/components/ui/Button";
import { Job } from "@/types/Job";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FaDownload, FaEdit, FaFilePdf, FaFileWord, FaTimes, FaTrash, FaUpload } from "react-icons/fa";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
  onApply: (jobId: string, cv: File | string, coverLetter: string | File) => void;
  isEditing?: boolean;
  existingApplication?: {
    cvOption: 'default' | 'custom';
    customCvUrl?: string;
    coverLetterText?: string;
    coverLetterFileUrl?: string;
  };
}

// Utility functions
const downloadFile = (url: string, filename: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const getFilenameFromUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    return pathParts[pathParts.length - 1] || 'document.pdf';
  } catch {
    return 'document.pdf';
  }
};

const ApplyModal: React.FC<ApplyModalProps> = ({ 
  isOpen, 
  onClose, 
  job, 
  onApply,
  isEditing = false,
  existingApplication
}) => {
  const [cvOption, setCvOption] = useState<'default' | 'custom'>(existingApplication?.cvOption || 'default');
  const [customCv, setCustomCv] = useState<File | null>(null);
  const [coverLetterType, setCoverLetterType] = useState<'text' | 'file'>(
    existingApplication?.coverLetterFileUrl ? 'file' : 'text'
  );
  const [coverLetterText, setCoverLetterText] = useState(existingApplication?.coverLetterText || '');
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const letterInputRef = useRef<HTMLInputElement>(null);

  // Mock user CV data
  const userCV = {
    name: 'My_Professional_CV.pdf',
    lastUpdated: '2023-10-15'
  };

  // Reset form when opening/closing modal
  useEffect(() => {
    if (isOpen) {
      if (isEditing && existingApplication) {
        setCvOption(existingApplication.cvOption);
        setCoverLetterText(existingApplication.coverLetterText || '');
        setCoverLetterType(existingApplication.coverLetterFileUrl ? 'file' : 'text');
      } else {
        setCvOption('default');
        setCoverLetterText('');
        setCoverLetterType('text');
        setCustomCv(null);
        setCoverLetterFile(null);
      }
    }
  }, [isOpen, isEditing, existingApplication]);

  const handleCVUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCustomCv(e.target.files[0]);
      setCvOption('custom');
    }
  };

  const handleLetterUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverLetterFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const cv = cvOption === 'default' ? userCV.name : customCv!;
      const coverLetter = coverLetterType === 'text' ? coverLetterText : coverLetterFile!;
      await onApply(job.id, cv, coverLetter);
      onClose();
    } catch (error) {
      console.error('Application error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">
                  {isEditing ? 'Edit Application' : `Apply for ${job.title}`}
                </h2>
                <p className="text-gray-600">at {typeof job.company === 'object' ? job.company.name : job.company}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto p-6">
            {/* Status indicator for editing */}
            {isEditing && (
              <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
                You're editing your existing application for this position.
              </div>
            )}

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Job Overview</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Posted Date</span>
                  <p>{new Date(job.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">Location</span>
                  <p>{job.location}</p>
                </div>
                <div>
                  <span className="text-gray-500">Job Type</span>
                  <p>{job.contract_type || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* CV Selection */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Curriculum Vitae</h3>
              
              <div className="space-y-3">
                {/* Default CV option */}
                <div 
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    cvOption === 'default' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setCvOption('default')}
                >
                  <div className="flex-shrink-0">
                    <FaFilePdf className="text-red-500 text-2xl" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="font-medium">{userCV.name}</p>
                    <p className="text-sm text-gray-500">Last updated: {userCV.lastUpdated}</p>
                    {isEditing && existingApplication?.cvOption === 'default' && (
                      <p className="text-xs text-green-600 mt-1">Currently using this CV</p>
                    )}
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    cvOption === 'default' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {cvOption === 'default' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                </div>

                {/* Custom CV upload */}
                <div 
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    cvOption === 'custom' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex-shrink-0">
                    <FaUpload className="text-blue-500 text-2xl" />
                  </div>
                  <div className="ml-4 flex-1">
                    {customCv ? (
                      <>
                        <p className="font-medium">{customCv.name}</p>
                        <p className="text-sm text-gray-500">{(customCv.size / 1024).toFixed(1)} KB</p>
                        <div className="flex space-x-3 mt-1">
                          <button 
                            className="text-blue-500 hover:underline text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              const url = URL.createObjectURL(customCv);
                              downloadFile(url, customCv.name);
                              URL.revokeObjectURL(url);
                            }}
                          >
                            Download CV
                          </button>
                        </div>
                      </>
                    ) : existingApplication?.customCvUrl ? (
                      <>
                        <p className="font-medium">Current CV</p>
                        <div className="flex space-x-3 mt-1">
                          <button 
                            className="text-blue-500 hover:underline text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadFile(
                                existingApplication.customCvUrl!,
                                getFilenameFromUrl(existingApplication.customCvUrl!)
                              );
                            }}
                          >
                            Download CV
                          </button>
                          <button 
                            className="text-blue-500 hover:underline text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(existingApplication.customCvUrl, '_blank');
                            }}
                          >
                            View CV
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="font-medium">Upload custom CV</p>
                        <p className="text-sm text-gray-500">PDF or Word document (max 5MB)</p>
                      </>
                    )}
                  </div>
                  {(customCv || existingApplication?.customCvUrl) && (
                    <button 
                      className="text-red-500 hover:text-red-700 mr-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCustomCv(null);
                      }}
                    >
                      <FaTrash />
                    </button>
                  )}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    cvOption === 'custom' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {cvOption === 'custom' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleCVUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Cover Letter / Motivation</h3>
              
              <div className="flex border rounded-lg overflow-hidden mb-4">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                    coverLetterType === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setCoverLetterType('text')}
                >
                  Write Text
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                    coverLetterType === 'file' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setCoverLetterType('file')}
                >
                  Upload File
                </button>
              </div>

              {coverLetterType === 'text' ? (
                <>
                  <textarea
                    rows={6}
                    value={coverLetterText}
                    onChange={(e) => setCoverLetterText(e.target.value)}
                    placeholder="Explain why you're the perfect candidate for this position..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {isEditing && existingApplication?.coverLetterText && !coverLetterText && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">
                        You previously submitted a text cover letter.
                      </p>
                      <button
                        className="text-blue-500 hover:text-blue-700 text-xs mt-1"
                        onClick={() => {
                          setCoverLetterText(existingApplication.coverLetterText || '');
                        }}
                      >
                        Restore previous text
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => letterInputRef.current?.click()}
                >
                  {coverLetterFile ? (
                    <div className="flex flex-col items-center">
                      {coverLetterFile.name.endsWith('.pdf') ? (
                        <FaFilePdf className="text-red-500 text-4xl mb-2" />
                      ) : (
                        <FaFileWord className="text-blue-500 text-4xl mb-2" />
                      )}
                      <p className="font-medium">{coverLetterFile.name}</p>
                      <p className="text-sm text-gray-500 mt-1">{(coverLetterFile.size / 1024).toFixed(1)} KB</p>
                      <div className="flex space-x-4 mt-3">
                        <button 
                          className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            const url = URL.createObjectURL(coverLetterFile);
                            downloadFile(url, coverLetterFile.name);
                            URL.revokeObjectURL(url);
                          }}
                        >
                          <FaDownload className="mr-1" /> Download
                        </button>
                        <button 
                          className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCoverLetterFile(null);
                          }}
                        >
                          <FaEdit className="mr-1" /> Change
                        </button>
                      </div>
                    </div>
                  ) : existingApplication?.coverLetterFileUrl ? (
                    <div className="flex flex-col items-center">
                      <FaFilePdf className="text-red-500 text-4xl mb-2" />
                      <p className="font-medium">Current Cover Letter</p>
                      <div className="flex space-x-4 mt-3">
                        <button 
                          className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadFile(
                              existingApplication.coverLetterFileUrl!,
                              getFilenameFromUrl(existingApplication.coverLetterFileUrl!)
                            );
                          }}
                        >
                          <FaDownload className="mr-1" /> Download
                        </button>
                        <button 
                          className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            letterInputRef.current?.click();
                          }}
                        >
                          <FaEdit className="mr-1" /> Upload New
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <FaUpload className="mx-auto text-gray-400 text-3xl" />
                      <p className="mt-2 text-sm text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        PDF or Word document (max 2MB)
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    ref={letterInputRef}
                    onChange={handleLetterUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                  />
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t">
              <h3 className="font-medium mb-3">Job Description</h3>
              <div className="prose max-w-none text-sm">
                {job.description || 'No job description available'}
              </div>
            </div>
          </div>

          <div className="border-t px-6 py-4 bg-gray-50">
            <div className="flex justify-end space-x-3">
              <Button
                onClick={onClose}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                variant="primary"
              >
                {isSubmitting ? 'Submitting...' : isEditing ? 'Update Application' : 'Submit Application'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyModal;