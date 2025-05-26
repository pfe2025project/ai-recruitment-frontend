/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
// components/jobs/JobCard.tsx
import React from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { MdLocationOn, MdCalendarToday, MdAccessTime } from 'react-icons/md';
import { FaBookmark, FaRegBookmark, FaMoneyBillAlt } from 'react-icons/fa';

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  postedDate: string;
  contractType: string;
  description: string;
  imageUrl?: string;
  salary?: string;
  skills?: string[];
  isSaved: boolean;
  onViewMore: (id: string) => void;
  onToggleSave: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({
  id,
  title,
  company,
  location,
  postedDate,
  contractType,
  description,
  imageUrl,
  salary,
  skills,
  isSaved,
  onViewMore,
  onToggleSave,
}) => {
  // Constants for styling
  const accentColor = 'var(--primary-600)';
  const textColor = 'var(--neutral-700)';
  const secondaryTextColor = 'var(--neutral-500)';

  // Truncate description with proper line-clamp
  const truncateDescription = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-100 relative group overflow-hidden">
      {/* Save button - top right */}
      <button
        onClick={() => onToggleSave(id)}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-neutral-100 transition-colors duration-200 shadow-sm"
        aria-label={isSaved ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        {isSaved ? (
          <FaBookmark size={20} className="text-indigo-500 cursor-pointer"  />
        ) : (
          <FaRegBookmark size={20} className="text-neutral-400 cursor-pointer group-hover:text-neutral-600" />
        )}
      </button>

      {/* Header with company logo */}
      <div className="flex items-start gap-4 mb-5">
        {imageUrl && (
          <div className="flex-shrink-0 w-14 h-14 relative rounded-lg overflow-hidden border border-neutral-200 bg-white">
            <Image
              src={imageUrl}
              alt={`${company} logo`}
              fill
              className="object-contain p-2"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
        <div>
          <h3 className="text-xl font-bold text-neutral-900 mb-1">{title}</h3>
          <p className="text-md font-medium text-primary-600">{company}</p>
        </div>
      </div>

      {/* Job details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-sm">
        <div className="flex items-center text-neutral-700">
          <MdLocationOn className="mr-2 text-primary-500 flex-shrink-0" size={18} />
          <span>{location}</span>
        </div>
        <div className="flex items-center text-neutral-700">
          <MdAccessTime className="mr-2 text-primary-500 flex-shrink-0" size={18} />
          <span>{contractType}</span>
        </div>
        <div className="flex items-center text-neutral-500">
          <MdCalendarToday className="mr-2 text-primary-500 flex-shrink-0" size={18} />
          <span>Publié le {postedDate}</span>
        </div>
        {salary && (
          <div className="flex items-center text-neutral-700">
            <FaMoneyBillAlt className="mr-2 text-primary-500 flex-shrink-0" size={18} />
            <span className="font-medium">{salary}</span>
          </div>
        )}
      </div>

      {/* Description with line clamp */}
      <p className="text-neutral-600 mb-5 text-sm line-clamp-3 leading-relaxed">
        {description}
      </p>

      <div className="flex justify-between items-center flex-wrap gap-4 mt-4">        {/* Skills chips */}
        {skills && skills.length > 0 && (
            <div className="mb-6">
            <div className="flex flex-wrap gap-2">
                {skills.slice(0, 6).map((skill, index) => (
                <span
                    key={index}
                    className="inline-flex bg-gray-100 items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                    {skill}
                </span>
                ))}
                {skills.length > 6 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600">
                    +{skills.length - 4} autres
                </span>
                )}
            </div>
            </div>
        )}

        {/* CTA button */}
        <div className="flex align-right">
            <Button
            onClick={() => onViewMore(id)}
            variant="outline"
            className="border-primary-500 text-primary-500 hover:bg-indigo-100 h-10 cursor-pointer flex justify-center items-center hover:border-primary-600 hover:text-primary-600 transition-colors"
            >
            Voir l'offre
            </Button>
        </div>
     </div>

      {/* Subtle hover effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-100 pointer-events-none rounded-xl transition-all duration-300" />
    </div>
  );
};

export default JobCard;