/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Image from 'next/image';
import { RiBookmarkFill, RiBookmarkLine, RiStarFill } from 'react-icons/ri';
import { FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave, FaRegClock, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

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
  matchScore?: number;
  onViewMore: (id: string) => void;
  onToggleSave: (id: string) => void;
  isRecommended?: boolean;
  isFeatured?: boolean;
  isUrgent?: boolean;
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
  matchScore,
  onViewMore,
  onToggleSave,
  isRecommended,
  isFeatured = false,
  isUrgent = false,
}) => {
  const getScoreMessage = (score?: number) => {
    if (!score) return null;
    if (score >= 90) return "Excellent match! 🎯";
    if (score >= 80) return "Strong match! 🔥";
    if (score >= 70) return "Good match! 👍";
    if (score >= 50) return "Potential match";
    return "Low match";
  };

  const getScoreColor = (score?: number) => {
    if (!score) return "bg-gray-100 text-gray-800";
    if (score >= 90) return "bg-gradient-to-r from-green-500 to-emerald-600 text-white";
    if (score >= 80) return "bg-gradient-to-r from-blue-500 to-indigo-600 text-white";
    if (score >= 70) return "bg-gradient-to-r from-purple-400 to-indigo-500 text-white";
    if (score >= 50) return "bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-800";
    return "bg-gray-200 text-gray-800";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 relative group"
    >
      {/* Badges in top-right corner */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        {isFeatured && (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-md">
            <RiStarFill className="mr-1" /> Featured
          </div>
        )}
        {isRecommended && (
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-md">
            <FaStar className="mr-1" /> Recommended
          </div>
        )}
        {isUrgent && (
          <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-md">
            ⚡ Urgent Hire
          </div>
        )}
      </div>

      {/* Match Score - Top right corner (below badges) */}
      {/* {matchScore && (
        <div className="absolute top-16 right-4 z-10">
          <div 
            className={`w-14 h-14 rounded-full ${getScoreColor(matchScore)} flex flex-col items-center justify-center shadow-lg border-2 border-white transform hover:scale-110 transition-transform`}
            title={getScoreMessage(matchScore) ?? undefined}
          >
            <span className="font-bold text-lg leading-none">{matchScore}%</span>
          </div>
        </div>
      )} */}

      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-4 pr-10">
            {imageUrl ? (
              <div className="flex-shrink-0 w-14 h-14 relative rounded-xl overflow-hidden border border-gray-200 group-hover:border-blue-200 transition-colors">
                <Image
                  src={imageUrl}
                  alt={`${company} logo`}
                  fill
                  className="object-contain p-1.5 bg-white"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="flex-shrink-0 w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 border border-gray-200">
                {company.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {title}
              </h3>
              <p className="text-blue-600 font-medium truncate">{company}</p>
            </div>
          </div>
          <button
            onClick={() => onToggleSave(id)}
            className="text-gray-400 hover:text-blue-500 cursor-pointer transition-colors absolute bottom-6 right-48 z-10"
            aria-label={isSaved ? "Unsave job" : "Save job"}
          >
            {isSaved ? (
              <RiBookmarkFill className="w-10 h-10 text-blue-500" />
            ) : (
              <RiBookmarkLine className="w-10 h-10 group-hover:text-blue-400" />
            )}
          </button>
        </div>

        {/* Job Metadata - Improved grid layout */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center text-gray-700">
            <FaMapMarkerAlt className="mr-2 text-blue-500 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaBriefcase className="mr-2 text-blue-500 flex-shrink-0" />
            <span>{contractType}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <FaRegClock className="mr-2 text-blue-500 flex-shrink-0" />
            <span>Posted {postedDate}</span>
          </div>
          {salary && (
            <div className="flex items-center text-gray-700">
              <FaMoneyBillWave className="mr-2 text-blue-500 flex-shrink-0" />
              <span className="font-medium truncate">{salary}</span>
            </div>
          )}
        </div>

        {/* Description with read more */}
        <div className="mt-4 relative">
          <p className="text-gray-600 line-clamp-2 leading-relaxed pr-4">
            {description}
          </p>
          <button 
            onClick={() => onViewMore(id)}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium mt-1 inline-flex items-center"
          >
            Read more
          </button>
        </div>

        {/* Skills with better organization */}
        {skills && skills.length > 0 && (
          <div className="mt-5">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Key Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 5).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-100"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 5 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  +{skills.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* CTA with improved layout */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            {matchScore && matchScore >= 70 && (
              <div className={`text-sm font-medium px-3 py-1.5 rounded-lg inline-flex items-center ${
                matchScore >= 80 
                  ? 'text-green-800 bg-green-100' 
                  : 'text-purple-800 bg-purple-100'
              }`}>
                {matchScore >= 80 ? '⚡ ' : '✓ '}
                {getScoreMessage(matchScore)}
              </div>
            )}
          </div>
          <button
            onClick={() => onViewMore(id)}
            className="w-full sm:w-auto px-5 py-2.5 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center"
          >
            View Details
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;