/* eslint-disable @typescript-eslint/no-explicit-any */
// components/shared/header.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { logout } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import NavLink from './NavLink';

const Header: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  const { user, role, loading } = useAuth();
  const router = useRouter();

  // Composants d'icônes SVG inline
  const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  );

  const EnvelopeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );

  // Fonctions utilitaires pour obtenir les variables CSS de couleur
  const getPrimaryColor = (shade: number) => `var(--primary-${shade})`;
  const getNeutralColor = (shade: number) => `var(--neutral-${shade})`;
  const getSecondaryColor = (shade: number) => `var(--secondary-${shade})`;

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    router.push('/');
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    const metadata = user.user_metadata as any;
    if (metadata?.full_name) return metadata.full_name;
    if (metadata?.user_name) return metadata.user_name;
    return user.email ? user.email.split('@')[0] : 'User'; // Use part before @ for display
  };

  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    if (displayName === 'User' || !displayName) return 'U';
    const parts = displayName.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (displayName.length > 0) {
      return displayName[0].toUpperCase();
    }
    return 'U';
  };

  const isCandidate = role === 'candidate';
  const isRecruiter = role === 'recruiter';

  return (
    <header style={{ backgroundColor: "white" }} className="shadow-md py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/favicon.ico"
            alt="HireMatch Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span style={{ color: getPrimaryColor(600) }} className="text-2xl font-bold">
            HireMatch
          </span>
        </Link>

        {/* Navigation Menu - Centered */}
        <nav className="flex-1 flex justify-center">
          <ul className="flex space-x-8">
            <NavLink href="/">Accueil</NavLink>
            <NavLink href="/about">À propos</NavLink>
            {!loading && user && isCandidate && (
              <>
                <NavLink href="/candidate/jobs">Jobs</NavLink>
                <NavLink href="/candidate/dashboard">Dashboard</NavLink>
                <NavLink href="/candidate/applications">Applications</NavLink>
              </>
            )}
            {!loading && user && isRecruiter && (
              <>
                <NavLink href="/recruiter/jobs/new">Add Job</NavLink>
                <NavLink href="/recruiter/dashboard">Dashboard</NavLink>
              </>
            )}
            {!loading && !user && (
              <NavLink href="/login">Login</NavLink>
            )}
          </ul>
        </nav>

        {/* User Actions / Auth Buttons */}
        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          ) : user ? (
            <div className="relative flex items-center space-x-4">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <BellIcon />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-20 top-full">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Notification 1</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Notification 2</a>
                </div>
              )}

              <button
                onClick={() => setShowMessages(!showMessages)}
                className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <EnvelopeIcon />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white"></span>
              </button>
              {showMessages && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-20 top-full">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Message 1</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Message 2</a>
                </div>
              )}

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {user.user_metadata?.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="rounded-full border border-gray-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'; // Hide image on error
                        const initialsElement = document.getElementById('user-initials');
                        if (initialsElement) initialsElement.style.display = 'flex'; // Show initials
                      }}
                    />
                  ) : null}
                  <div
                    id="user-initials"
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold text-sm"
                    style={{ display: user.user_metadata?.avatar_url ? 'none' : 'flex' }}
                  >
                    {getUserInitials()}
                  </div>
                  <span className="text-gray-700 font-medium hidden md:block">{getUserDisplayName()}</span>
                  <svg
                    className={`w-4 h-4 text-gray-700 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 top-full">
                    <Link href="/candidate/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg font-medium"
              style={{
                backgroundColor: getPrimaryColor(600),
                color: 'white',
                transitionProperty: 'background-color',
                transitionDuration: '200ms',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = getPrimaryColor(700);
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = getPrimaryColor(600);
              }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
                