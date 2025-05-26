// components/icons/AwardIcon.tsx
import React from 'react';

const AwardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M17.25 6.75A.75.75 0 0118 7.5v.75A.75.75 0 0117.25 9H9.75A.75.75 0 019 8.25V7.5A.75.75 0 019.75 6.75H17.25zM12 3a.75.75 0 01.75.75v3.375c0 .092-.023.18-.066.26l-2.482 4.963a.75.75 0 01-1.077.291L7.15 10.742a.75.75 0 01-.157-.962L8.514 6.75H6.75A.75.75 0 016 6V4.5a.75.75 0 01.75-.75h4.5zm-3 12a.75.75 0 01.75-.75h7.5a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75V15zm0 3a.75.75 0 01.75-.75h7.5a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v-.75z" />
  </svg>
);

export default AwardIcon;