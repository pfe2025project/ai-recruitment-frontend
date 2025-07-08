// components/shared/NavLink.tsx
import React from 'react';
import Link from 'next/link';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const getPrimaryColor = (shade: number) => `var(--primary-${shade})`;
const getNeutralColor = (shade: number) => `var(--neutral-${shade})`;

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  return (
    <li>
      <Link
        href={href}
        className="font-medium transition-colors duration-200 px-3 py-2 rounded-lg"
        style={{
          color: getNeutralColor(600),
          transitionProperty: 'color, background-color',
          transitionDuration: '200ms',
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.color = getPrimaryColor(600);
          (e.target as HTMLElement).style.backgroundColor = getPrimaryColor(50);
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.color = getNeutralColor(600);
          (e.target as HTMLElement).style.backgroundColor = 'transparent';
        }}
      >
        {children}
      </Link>
    </li>
  );
};

export default NavLink;