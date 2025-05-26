// components/icons/FlashOnIcon.tsx
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
}

const FlashOnIcon: React.FC<IconProps> = ({ color = 'currentColor', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={color}
    {...props}
  >
    <path d="M7 2v11h3v9l7-12H12l4-8z" />
  </svg>
);

export default FlashOnIcon;

