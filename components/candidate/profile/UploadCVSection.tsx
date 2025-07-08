"use client";
// components/candidate/UploadCVSection.tsx
import React, { useState } from 'react';
import Button from '../../ui/Button';
import FileUploadIcon from '../../icons/FileUploadIcon';
import PdfViewerModal from '../../ui/PdfViewerModal';

// Helper pour extraire le nom de fichier depuis l'URL
const getFileNameFromUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');
    return pathSegments[pathSegments.length - 1];
  } catch (error) {
    console.error("Invalid URL for file name extraction:", url);
    return "document.pdf";
  }
};

interface UploadCVSectionProps {
  onUploadCV: () => void;
  lastUpdated?: string;
  cvUrl?: string;
}

const UploadCVSection: React.FC<UploadCVSectionProps> = ({
  onUploadCV,
  lastUpdated,
  cvUrl
}) => {
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const handleViewCV = () => {
    setIsPdfModalOpen(true);
  };

  const handleClosePdfModal = () => {
    setIsPdfModalOpen(false);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md mb-8">
      {/* Section Texte + CV en haut */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-neutral-800 mb-2">Votre CV</h3>
        <p className="text-neutral-600 mb-4">
          Uploadez la dernière version de votre CV pour maximiser vos chances.
          {lastUpdated && (
            <span className="block text-sm text-neutral-500 mt-1">
              Dernière mise à jour : {lastUpdated}
            </span>
          )}
        </p>

        {cvUrl ? (
          <>
            <div className="flex flex-col md:flex-row items-center justify-between p-4 border border-gray-200 rounded-md bg-gray-50">
              <span className="text-neutral-700 font-medium mb-2 md:mb-0">
                {getFileNameFromUrl(cvUrl)}
              </span>
              <Button onClick={handleViewCV} variant="secondary">
                Voir le CV
              </Button>
            </div>
            <div className="mt-4 w-full h-64 border border-gray-300 rounded-md overflow-hidden">
              <iframe src={cvUrl} width="100%" height="100%" title="CV Preview" />
            </div>
          </>
        ) : (
          <p className="text-neutral-500">Aucun CV n'a été uploadé pour le moment.</p>
        )}
      </div>

      {/* Bouton Upload en bas */}
      <div className="flex justify-end">
        <Button
          onClick={onUploadCV}
          variant="primary"
          className="flex items-center justify-center"
        >
          <FileUploadIcon className="w-5 h-5 mr-2" />
          {cvUrl ? 'Mettre à jour le CV' : 'Uploader le CV'}
        </Button>
      </div>

      {cvUrl && isPdfModalOpen && (
        <PdfViewerModal
          pdfUrl={cvUrl}
          onClose={handleClosePdfModal}
          fileName={getFileNameFromUrl(cvUrl)}
        />
      )}
    </div>
  );
};

export default UploadCVSection;