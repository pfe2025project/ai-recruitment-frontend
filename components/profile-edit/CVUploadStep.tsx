// components/profile-edit/CVUploadStep.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import StepWrapper from './StepWrapper';
import Button from '@/components/ui/Button';
import { FaUpload, FaFilePdf, FaTimes } from 'react-icons/fa';

interface CVUploadStepProps {
  onCVUpload: (file: File | null) => void;
  existingCvUrl: string | null;
  onExtractSkills: (file: File) => Promise<string[]>; // Callback to trigger skill extraction
}

const CVUploadStep: React.FC<CVUploadStepProps> = ({ onCVUpload, existingCvUrl, onExtractSkills }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const pdfViewerRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // If there's an existing CV URL, set a dummy file to represent it
    if (existingCvUrl && !selectedFile) {
      fetch(existingCvUrl)
        .then(response => response.blob())
        .then(blob => {
          const file = new File([blob], 'current_cv.pdf', { type: 'application/pdf' });
          setSelectedFile(file);
        })
        .catch(error => console.error("Error fetching existing CV:", error));
    }
  }, [existingCvUrl, selectedFile]);


  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      onCVUpload(file);
      // Immediately trigger skill extraction
      onExtractSkills(file).then(extractedSkills => {
        console.log("Extracted Skills:", extractedSkills); // Log extracted skills for now
        // In a real app, you'd pass these to the parent state to be used in SkillsStep
      });
    } else {
      alert('Veuillez télécharger un fichier PDF.');
    }
  }, [onCVUpload, onExtractSkills]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onCVUpload(null);
  };

  return (
    <StepWrapper
      title="Téléchargez votre CV"
      description="Nous allons extraire les informations clés de votre CV pour pré-remplir votre profil. Veuillez télécharger un fichier PDF."
    >
      <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50 mb-6" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-primary-600">Déposez le fichier ici...</p>
        ) : (
          <p className="text-neutral-500">
            Glissez-déposez votre CV ici, ou <span className="text-primary-600 font-semibold cursor-pointer">cliquez pour sélectionner</span>
          </p>
        )}
        <FaUpload className="mx-auto mt-4 text-primary-500" size={30} />
      </div>

      {selectedFile && (
        <div className="mb-6 bg-primary-50 p-4 rounded-lg flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center">
            <FaFilePdf className="text-red-500 mr-3" size={24} />
            <span className="text-neutral-700 font-medium">{selectedFile.name}</span>
          </div>
          <Button onClick={handleRemoveFile} variant="primary" className="p-2 rounded-full">
            <FaTimes size={16} />
          </Button>
        </div>
      )}

      {/* PDF Viewer */}
      {selectedFile && (
        <div className="mt-6 border border-gray-300 rounded-lg overflow-hidden h-[400px]">
          <iframe
            ref={pdfViewerRef}
            src={URL.createObjectURL(selectedFile)}
            width="100%"
            height="100%"
            title="Aperçu du CV"
            className="w-full h-full"
          />
        </div>
      )}
      {/* If no file, but existingCvUrl, display it initially (not directly handled by selectedFile state for upload) */}
      {!selectedFile && existingCvUrl && (
         <div className="mt-6 border border-gray-300 rounded-lg overflow-hidden h-[400px]">
         <iframe
           src={existingCvUrl}
           width="100%"
           height="100%"
           title="Aperçu du CV existant"
           className="w-full h-full"
         />
       </div>
      )}
    </StepWrapper>
  );
};

export default CVUploadStep;