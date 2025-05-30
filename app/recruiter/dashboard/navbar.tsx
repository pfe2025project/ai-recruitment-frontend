import React from 'react';
import { FaSearch } from 'react-icons/fa';

const Topbar = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-sm border-b">
      
      {/* Search Box */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-4 pr-10 py-2 rounded-lg bg-gray-100 text-sm focus:outline-none"
        />
        <FaSearch className="absolute right-3 top-2.5 text-gray-400" />
      </div>

      {/* Avatar */}
      <div className="ml-4">
        <img
          src="https://i.pravatar.cc/40"
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export default Topbar;
