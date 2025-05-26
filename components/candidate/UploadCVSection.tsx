"use client";
// components/candidate/UploadCVSection.tsx
import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import Button from '../ui/Button';
import FileUploadIcon from '../icons/FileUploadIcon';
import PdfViewerModal from '../ui/PdfViewerModal';
// Set the workerSrc to the CDN version to avoid import issues
pdfjs.GlobalWorkerOptions.workerSrc = '/libs/pdfjs/pdf.worker.min.mjs';

// Helper pour extraire le nom de fichier depuis l'URL
const extractFileNameFromUrl = (url: string): string => {
  try {
    // Gère les URLs complètes et les paths relatifs
    const pathname = new URL(url, window.location.origin).pathname;
    return pathname.split('/').pop() || "document.pdf";
  } catch {
    // Fallback pour les strings non-URL (comme des object URLs)
    return url.split('/').pop() || "document.pdf";
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
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber] = useState(1); // Toujours afficher la première page

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const fileName = extractFileNameFromUrl(cvUrl || "");

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

        {cvUrl && (
          <div 
            className="cursor-pointer max-w-md"
            onClick={() => setIsViewerOpen(true)}
          >
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Prévisualisation de la première page du PDF */}
              <div className="bg-gray-100 flex items-center justify-center">
                <div className="w-full">
                  <Document
                    file={cvUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<div className="h-48 flex items-center justify-center">Chargement...</div>}
                    error={<div className="h-48 flex items-center justify-center text-red-500">Erreur de chargement</div>}
                  >
                    <Page 
                      pageNumber={pageNumber} 
                      width={350}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </Document>
                </div>
              </div>
              
              {/* Nom du fichier en bas */}
              <div className="bg-white p-3 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
                <p className="text-xs text-gray-500">
                  PDF {numPages && `• ${numPages} page${numPages > 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
          </div>
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

      {/* Modal pour visualiser le PDF complet */}
      {isViewerOpen && cvUrl && (
        <PdfViewerModal 
          pdfUrl={cvUrl} 
          onClose={() => setIsViewerOpen(false)} 
        />
      )}
    </div>
  );
};

export default UploadCVSection;