// components/candidate/ContactInfoCard.tsx
import React from 'react';

interface ContactInfoCardProps {
  email: string;
  phone?: string;
  linkedin?: string;
  website?: string;
}

const ExternalLinkIcon = () => (
  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ email, phone, linkedin, website }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md my-8">
      <h3 className="text-xl font-semibold text-primary-800 mb-4">Informations de Contact</h3>
      <ul className="space-y-3">
        {/* Email */}
        <li className="flex items-center text-neutral-700">
          <svg className="w-5 h-5 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <a href={`mailto:${email}`} className="hover:underline hover:text-primary-700 transition-colors">
            {email}
          </a>
        </li>

        {/* Téléphone */}
        {phone && (
          <li className="flex items-center text-neutral-700">
            <svg className="w-5 h-5 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a href={`tel:${phone}`} className="hover:underline hover:text-primary-700 transition-colors">
              {phone}
            </a>
          </li>
        )}

        {/* LinkedIn */}
        {linkedin && (
          <li className="flex items-center text-neutral-700">
            <svg className="w-5 h-5 text-[#0A66C2] mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <a 
              href={linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline hover:text-[#0A66C2] transition-colors flex items-center"
            >
              LinkedIn
              <ExternalLinkIcon />
            </a>
          </li>
        )}

        {/* Site Web */}
        {website && (
          <li className="flex items-center text-neutral-700">
            <svg className="w-5 h-5 text-secondary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <a 
              href={website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline hover:text-secondary-700 transition-colors flex items-center"
            >
              Portfolio / Site Web
              <ExternalLinkIcon />
            </a>
          </li>
        )}
      </ul>
    </div>
  );
};

export default ContactInfoCard;