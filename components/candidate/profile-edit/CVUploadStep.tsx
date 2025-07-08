'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import StepWrapper from './StepWrapper';
import Button from '@/components/ui/Button';
import { FaUpload, FaFilePdf, FaTimes, FaSpinner } from 'react-icons/fa';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useProfile } from '@/context/ProfileContext';
import {
  checkCVUploadStatus,
  deleteCVFromBackend,
  fetchExistingCVFromBackend,
  uploadCVToBackend,
} from '@/lib/api/cv';
import Modal from '@/components/ui/Modal';
import { extract_profile_info } from '@/lib/api/parser';
import { fetchprofiledata } from '@/lib/data/profile';

pdfjs.GlobalWorkerOptions.workerSrc = '/libs/pdfjs/pdf.worker.min.mjs';

const CVUploadStep: React.FC = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { profileData, handleProfileDataChange, handleContactInfoChange, handleJobPreferencesChange } = useProfile();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const checkExistingCV = async () => {
      try {
        const hasCV = await checkCVUploadStatus();
        if (hasCV) {
          setIsLoading(true);
          setLoadingMessage('Loading your existing CV...');

          const cvData = await fetchExistingCVFromBackend();
          if (cvData) {
            setSelectedFile(cvData.file);
            setPdfUrl(cvData.url);
            handleProfileDataChange('cvFile', cvData.file);
            handleProfileDataChange('cvPdfUrl', cvData.url);
            console.log('CVUploadStep: Fetched CV Data - pdfUrl:', cvData.url, 'selectedFile:', cvData.file);
          }
        }
      } catch (err) {
        console.error('CVUploadStep: Error checking for existing CV:', err);
      } finally {
        setIsLoading(false);
        setLoadingMessage('');
      }
    };

    checkExistingCV();
  }, [handleProfileDataChange]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(Math.min(containerRef.current.clientWidth - 40, 800));
      }
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const validatePDF = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const arr = new Uint8Array(reader.result as ArrayBuffer);
          const header = String.fromCharCode.apply(null, [...arr.subarray(0, 4)]);
          resolve(header === '%PDF');
        } catch (e) {
          console.log(e);
          resolve(false);
        }
      };
      reader.readAsArrayBuffer(file.slice(0, 4));
    });
  };

  const extractAndUpdateProfileInfo = async () => {
    try {
      setLoadingMessage('Extraction des informations depuis votre CV...');
      const res = await extract_profile_info();
      console.log("parsed data", res);

      if (res.success) {
        fetchprofiledata(profileData, handleProfileDataChange, handleJobPreferencesChange);
      }
    } catch (err) {
      console.error("Error extracting profile information:", err);
      setError("An error occurred while parsing your CV");
      throw err;
    } finally {
      setLoadingMessage('');
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) {
        setError("No file selected");
        return;
      }

      const isValidPDF = await validatePDF(file);
      if (!isValidPDF) {
        setError("Invalid PDF file - file may be corrupted");
        return;
      }

      if (file.type !== 'application/pdf') {
        setError("Please upload a PDF file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      try {
        setIsLoading(true);
        setLoadingMessage('Processing your CV...');
        setError(null);
        setNumPages(null);

        const uploadResult = await uploadCVToBackend(file);
        if (!uploadResult.success || !uploadResult.url) {
          throw new Error('Failed to upload CV to server or no URL returned');
        }

        setPdfUrl(uploadResult.url);
        setSelectedFile(file);
        handleProfileDataChange('cvFile', file);
        handleProfileDataChange('cvPdfUrl', uploadResult.url);

        await extractAndUpdateProfileInfo();
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred during upload";
        setError(errorMessage);
        console.error('Upload error:', err);
        setSelectedFile(null);
      } finally {
        setIsLoading(false);
        setLoadingMessage('');
      }
    },
    [handleProfileDataChange, handleContactInfoChange, handleJobPreferencesChange, profileData]
  );

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleRemoveFile = async () => {
    try {
      setIsLoading(true);
      setLoadingMessage('Removing CV...');
      setError(null);

      const deleteSuccess = await deleteCVFromBackend();
      if (!deleteSuccess) {
        throw new Error('Failed to delete CV from server');
      }

      if (pdfUrl) URL.revokeObjectURL(pdfUrl);

      setSelectedFile(null);
      setPdfUrl(null);
      setNumPages(null);

      handleProfileDataChange('cvFile', null);
      handleProfileDataChange('cvPdfUrl', '');
      handleProfileDataChange('skills', { extracted: { pySkills: [], skillnerSkills: [] }, added: [] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove CV");
      console.error('Remove error:', err);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
      setShowDeleteConfirm(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    disabled: isLoading,
    noClick: isLoading,
    noKeyboard: isLoading
  });

  return (
    <StepWrapper
      title="Upload Your CV"
      description="We'll extract key information from your CV to pre-fill your profile. Please upload a PDF file."
    >
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete your CV? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleRemoveFile} disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Delete CV'}
            </Button>
          </div>
        </div>
      </Modal>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md animate-fade-in">{error}</div>
      )}

      {isLoading && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md flex items-center animate-fade-in">
          <FaSpinner className="animate-spin mr-2" />
          {loadingMessage}
        </div>
      )}

      {!selectedFile && !pdfUrl && (
        <div
          {...getRootProps()}
          className={`p-6 border-2 border-dashed rounded-lg text-center mb-6 transition-all duration-300 ${
            isLoading
              ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-70'
              : isDragActive
              ? 'bg-blue-50 border-blue-500'
              : 'bg-gray-50 border-gray-300 hover:border-primary-500 cursor-pointer opacity-100'
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500">Drop your CV here...</p>
          ) : (
            <>
              <p className="text-neutral-500">
                Drag and drop your CV here, or{' '}
                <span className="text-primary-600 font-semibold">click to select</span>
              </p>
              <FaUpload className="mx-auto mt-4 text-primary-500 animate-bounce" size={30} />
              <p className="text-sm text-neutral-400 mt-2">PDF files only (max 5MB)</p>
            </>
          )}
        </div>
      )}

      {(selectedFile || pdfUrl) && (
        <div className="mb-6 bg-primary-50 p-4 rounded-lg flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center truncate max-w-[80%]">
            <FaFilePdf className="text-red-500 mr-3 flex-shrink-0" size={24} />
            <span className="text-neutral-700 font-medium truncate">
              {selectedFile?.name || 'Current CV'}
            </span>
          </div>
          <Button
            onClick={confirmDelete}
            variant="primary"
            className="p-2 rounded-full hover:scale-105 transition-transform"
            disabled={isLoading}
          >
            <FaTimes size={16} />
          </Button>
        </div>
      )}

      {selectedFile && !isLoading && (
        <div
          ref={containerRef}
          className="mt-6 border border-gray-300 rounded-lg overflow-auto p-4 h-[400px] flex justify-center bg-gray-100 animate-fade-in"
        >
          <Document
            file={selectedFile}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => {
              console.error('PDF load error:', error);
              setError('Failed to load PDF - file may be corrupted');
              setPdfUrl(null);
              setSelectedFile(null);
            }}
            loading={
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <FaSpinner className="animate-spin text-primary-500 mb-2" size={24} />
                  <p>Loading PDF preview...</p>
                </div>
              </div>
            }
            error={
              <div className="h-full flex items-center justify-center text-red-500">
                Failed to load PDF (invalid or corrupted file)
              </div>
            }
          >
            {Array.from(new Array(numPages), (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={containerWidth}
                className="border border-gray-200 mb-4 bg-white animate-fade-in"
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={
                  <div className="flex flex-col items-center justify-center h-full">
                    <FaSpinner className="animate-spin text-primary-500 mb-2" size={24} />
                    <p>Loading page {index + 1}...</p>
                  </div>
                }
              />
            ))}
          </Document>
        </div>
      )}
    </StepWrapper>
  );
};

export default CVUploadStep;
