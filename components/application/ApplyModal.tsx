/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
// components/application/ApplyModal.tsx
'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { FaTimes, FaUpload, FaFilePdf } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

// Assuming you have this Job interface from dummyJobs or backend
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  imageUrl?: string;
  contractType: string;
  workMode: string;
  salary?: string;
}

// Assuming you have this UserCV interface from dummyProfileData
interface UserCV {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
  userCvs: UserCV[]; // Candidate's existing CVs
  onApply: (jobId: string, selectedCv: File | UserCV, coverLetter: string) => void;
}

const ApplyModal: React.FC<ApplyModalProps> = ({ isOpen, onClose, job, userCvs, onApply }) => {
  const [selectedCvOption, setSelectedCvOption] = useState<'existing' | 'new'>('existing');
  const [selectedExistingCvId, setSelectedExistingCvId] = useState<string>(userCvs[0]?.id || '');
  const [newCvFile, setNewCvFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [cvPreviewUrl, setCvPreviewUrl] = useState<string | null>(null);

  const pdfViewerRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Set initial preview for existing CV if available
    if (selectedCvOption === 'existing' && selectedExistingCvId) {
      const cv = userCvs.find(c => c.id === selectedExistingCvId);
      if (cv) {
        setCvPreviewUrl(cv.url);
      }
    } else if (selectedCvOption === 'new' && newCvFile) {
      setCvPreviewUrl(URL.createObjectURL(newCvFile));
    } else {
      setCvPreviewUrl(null);
    }
  }, [selectedCvOption, selectedExistingCvId, newCvFile, userCvs]);


  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setNewCvFile(file);
      setCvPreviewUrl(URL.createObjectURL(file));
      setSelectedCvOption('new'); // Ensure 'new' is selected when a new file is dropped
    } else {
      alert('Veuillez télécharger un fichier PDF.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = () => {
    let cvToSend: File | UserCV | null = null;

    if (selectedCvOption === 'existing' && selectedExistingCvId) {
      cvToSend = userCvs.find(cv => cv.id === selectedExistingCvId) || null;
    } else if (selectedCvOption === 'new' && newCvFile) {
      cvToSend = newCvFile;
    }

    if (!cvToSend) {
      alert('Veuillez sélectionner ou télécharger un CV.');
      return;
    }

    onApply(job.id, cvToSend, coverLetter);
    onClose(); // Close modal after submission
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-neutral-800">Postuler à l'offre</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex-grow overflow-y-auto">
          {/* Job Summary */}
          <div className="bg-gray-50 p-4 rounded-lg flex items-center mb-6 shadow-sm">
            {job.imageUrl && (
              <Image
                src={job.imageUrl}
                alt={`${job.company} logo`}
                width={50}
                height={50}
                className="rounded-full mr-4"
              />
            )}
            <div>
              <h3 className="text-xl font-semibold text-primary-800">{job.title}</h3>
              <p className="text-neutral-600">{job.company} - {job.location}</p>
              <p className="text-sm text-neutral-500">{job.contractType} ({job.workMode}) {job.salary ? ` - ${job.salary}` : ''}</p>
            </div>
          </div>

          {/* CV Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-3">Votre CV</h3>
            <div className="flex gap-4 mb-4">
              <Button
                variant={selectedCvOption === 'existing' ? 'primary' : 'outline'}
                onClick={() => {
                  setSelectedCvOption('existing');
                  setNewCvFile(null); // Clear new file if switching to existing
                }}
                className="flex-grow py-2 cursor-pointer"
                style={{
                  backgroundColor: selectedCvOption === 'existing' ? 'var(--primary-500)' : 'transparent',
                  color: selectedCvOption === 'existing' ? 'white' : 'var(--primary-600)',
                  borderColor: 'var(--primary-500)'
                }}
              >
                Utiliser un CV enregistré
              </Button>
              <Button
                variant={selectedCvOption === 'new' ? 'primary' : 'outline'}
                onClick={() => setSelectedCvOption('new')}
                className="flex-grow py-2 cursor-pointer"
                style={{
                  backgroundColor: selectedCvOption === 'new' ? 'var(--primary-500)' : 'transparent',
                  color: selectedCvOption === 'new' ? 'white' : 'var(--primary-600)',
                  borderColor: 'var(--primary-500)'
                }}
              >
                Télécharger un nouveau CV
              </Button>
            </div>

            {selectedCvOption === 'existing' && (
              userCvs.length > 0 ? (
                <div className="mb-4">
                  <label htmlFor="cv-select" className="block text-neutral-700 text-sm font-semibold mb-2">
                    Sélectionner un CV :
                  </label>
                  <select
                    id="cv-select"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 transition duration-200 cursor-pointer"
                    value={selectedExistingCvId}
                    onChange={(e) => setSelectedExistingCvId(e.target.value)}
                  >
                    {userCvs.map(cv => (
                      <option key={cv.id} value={cv.id}>
                        {cv.name} (Mis à jour le {new Date(cv.uploadedAt).toLocaleDateString('fr-FR')})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <p className="text-sm text-neutral-500 italic">Vous n'avez pas de CV enregistré. Veuillez en télécharger un nouveau.</p>
              )
            )}

            {selectedCvOption === 'new' && (
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="text-primary-600">Déposez le fichier ici...</p>
                  ) : (
                    <p className="text-neutral-500">
                      Glissez-déposez un nouveau CV PDF ici, ou <span className="text-primary-600 font-semibold cursor-pointer">cliquez pour sélectionner</span>
                    </p>
                  )}
                  <FaUpload className="mx-auto mt-4 text-primary-500" size={30} />
                </div>
                {newCvFile && (
                  <div className="mt-4 bg-primary-50 p-3 rounded-lg flex items-center justify-between shadow-sm">
                    <div className="flex items-center">
                      <FaFilePdf className="text-red-500 mr-3" size={20} />
                      <span className="text-neutral-700 font-medium">{newCvFile.name}</span>
                    </div>
                    <Button onClick={() => { setNewCvFile(null); setCvPreviewUrl(null); }} variant="primary" className="p-1 rounded-full">
                      <FaTimes size={14} />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CV Preview */}
          {cvPreviewUrl && (
            <div className="mb-6 border border-gray-300 rounded-lg overflow-hidden h-[300px]">
              <h3 className="text-base font-semibold text-neutral-700 p-3 bg-gray-100 border-b border-gray-200">Aperçu du CV</h3>
              <iframe
                ref={pdfViewerRef}
                src={cvPreviewUrl}
                width="100%"
                height="100%"
                title="CV Preview"
                className="w-full h-full"
              />
            </div>
          )}


          {/* Cover Letter */}
          <div className="mb-6">
            <Textarea
              id="cover-letter"
              label="Lettre de motivation (optionnel)"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Rédigez ici votre lettre de motivation..."
              rows={6}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="py-2 px-5 cursor-pointer"
            style={{ borderColor: 'var(--neutral-300)', color: 'var(--neutral-700)' }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            variant="primary"
            className="py-2 px-5 cursor-pointer"
            style={{ backgroundColor: 'var(--primary-600)', color: 'white' }}
            disabled={
                (selectedCvOption === 'existing' && !selectedExistingCvId && userCvs.length > 0) ||
                (selectedCvOption === 'new' && !newCvFile) ||
                (userCvs.length === 0 && !newCvFile) // If no existing CVs and no new file uploaded
            }
          >
            Soumettre ma candidature
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ApplyModal;