// components/icons/FileUploadIcon.tsx
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
}

const FileUploadIcon: React.FC<IconProps> = ({ color = 'currentColor', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
    <path d="M14 15h-4v4h4v-4z" />
  </svg>
);

export default FileUploadIcon;