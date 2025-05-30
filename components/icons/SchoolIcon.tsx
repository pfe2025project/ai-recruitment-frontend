// components/icons/SchoolIcon.tsx
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
}

const SchoolIcon: React.FC<IconProps> = ({ color = 'currentColor', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={color}
    {...props}
  >
    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 11-6-11-6zM5 11.26l7-3.82 7 3.82v-4L12 5 5 8.26v3z" />
  </svg>
);

export default SchoolIcon;