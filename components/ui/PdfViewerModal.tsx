"use client";
import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import CloseIcon from '../icons/CloseIcon';
import DownloadIcon from '../icons/DownloadIcon'; // You'll need to create this
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = '/libs/pdfjs/pdf.worker.min.mjs';

interface PdfViewerModalProps {
  pdfUrl: string;
  onClose: () => void;
  fileName?: string;
}

const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ 
  pdfUrl, 
  onClose,
  fileName = "cv.pdf" 
}) => {
  const [numPages, setNumPages] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(800);

  React.useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth - 50); // Account for padding
    }
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-lg max-w-6xl w-full max-h-[90vh] h-full flex flex-col">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
          aria-label="Fermer"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        
        <div 
          ref={containerRef}
          className="flex-1 overflow-auto p-4"
        >
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="h-full flex items-center justify-center">
                Chargement du PDF...
              </div>
            }
            error={
              <div className="h-full flex items-center justify-center text-red-500">
                Erreur de chargement du PDF
              </div>
            }
          >
            {numPages && Array.from({ length: numPages }, (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={containerWidth}
                className="border border-gray-200 mb-4"
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            ))}
          </Document>
        </div>
        
        <div className="border-t p-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {numPages && `${numPages} page${numPages > 1 ? 's' : ''}`}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              style={{backgroundColor:"var(--primary-600)","--hov-col-primary":"var(--primary-700)"}}
              className="px-4 py-2   text-white cursor-pointer rounded .btn-primary transition-colors flex items-center gap-2"
            >
              <DownloadIcon className="w-4 h-4" />
              Télécharger
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-400 text-white  cursor-pointer rounded hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <CloseIcon className="w-4 h-4" />
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfViewerModal;