/* eslint-disable @typescript-eslint/no-explicit-any */
// components/shared/header.tsx
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {  getCurrentUser, getSupabaseAccessToken, logout } from '@/lib/api/auth';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

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

  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        if (currentUser) {
          console.log("uid ",currentUser.id);
        }

        const token = await getSupabaseAccessToken();
        if (token) {
          console.log("Access Token:", token);
          // Tu peux maintenant l'utiliser dans un appel API avec:
          // Authorization: Bearer ${token}
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setShowDropdown(false);
    router.push('/');

  };

  const getUserDisplayName = () => {
    if (!user) return '';
    const metadata = user.user_metadata as any;
    if (metadata?.full_name) return metadata.full_name;
    if (metadata?.user_name) return metadata.user_name;
    return user.email ? user.email.substring(0, 10) + (user.email.length > 10 ? '...' : '') : 'User';
  };

  const getUserRole = () => {
    if (!user) return '';
    const metadata = user.user_metadata as any;
    return metadata?.role || 'candidate';
  };

  const isCandidate = getUserRole() === 'candidate';

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
            <li>
              <Link
                href="/"
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
                Accueil
              </Link>
            </li>
            <li>
              <Link
                href="/about"
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
                À propos
              </Link>
            </li>
            {user && isCandidate && (
              <>
                <li>
                  <Link
                    href="/candidate/jobs"
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
                    Offres
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${getUserRole()}/dashboard`}
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
                    Dashboard
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link
                href="/contact"
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
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="w-24 h-10 bg-neutral-200 rounded-md animate-pulse"></div>
          ) : user ? (
            <>
              {/* Notifications Icon */}
              <div className="relative ">
                <button
                  onClick={() => {setShowNotifications(!showNotifications); setShowMessages(false);setShowDropdown(false)}}
                  className="p-2 cursor-pointer rounded-full hover:bg-neutral-100"
                >
                  <BellIcon  />
                  {/* <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span> */}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm border-b">Notifications</div>
                    <div className="px-4 py-3 text-sm text-center text-neutral-500">
                      Aucune nouvelle notification
                    </div>
                  </div>
                )}
              </div>

              {/* Messages Icon */}
              <div className="relative cursor-pointer">
                <button
                  onClick={() => {setShowNotifications(false); setShowMessages(!showMessages);setShowDropdown(false)}}
                  className="p-2 cursor-pointer rounded-full hover:bg-neutral-100"
                >
                  <EnvelopeIcon />
                  {/* <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span> */}
                </button>
                {showMessages && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm border-b">Messages</div>
                    <div className="px-4 py-3 text-sm text-center text-neutral-500">
                      Aucun nouveau message
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Dropdown */}
              <div className="relative cursor-pointer">
                <button
                  onClick={() => {setShowNotifications(false); setShowMessages(false);setShowDropdown(!showDropdown)}}
                  className="flex items-center cursor-pointer space-x-2 focus:outline-none"
                >
                  {user.user_metadata?.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url as string}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="rounded-full border-2"
                      style={{
                        borderColor: isCandidate ? getPrimaryColor(500) : getSecondaryColor(500)
                      }}
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                      style={{
                        backgroundColor: isCandidate ? getPrimaryColor(200) : getSecondaryColor(200),
                        color: isCandidate ? getPrimaryColor(700) : getSecondaryColor(700)
                      }}
                    >
                      {user.email ? user.email.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                </button>

                {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50">

                  {/* Part 1: Header with Avatar, Name & Email */}
                  <div className="flex items-center px-4 py-3 ">
                    {user.user_metadata?.avatar_url ? (
                      <Image
                        src={user.user_metadata.avatar_url as string}
                        alt="User Avatar"
                        width={40}
                        height={40}
                        className="rounded-full border-2 mr-3"
                        style={{
                          borderColor: isCandidate ? getPrimaryColor(500) : getSecondaryColor(500)
                        }}
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-3"
                        style={{
                          backgroundColor: isCandidate ? getPrimaryColor(200) : getSecondaryColor(200),
                          color: isCandidate ? getPrimaryColor(700) : getSecondaryColor(700)
                        }}
                      >
                        {user.email ? user.email.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}

                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{getUserDisplayName()}</p>
                      <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Part 2: Dashboard Button */}
                  <div className="px-4 py-1 ">
                      <Link
                        href="/candidate/dashboard"
                        className="w-full block text-sm text-center py-2 rounded border border-neutral-500 hover:bg-neutral-800 hover:text-neutral-100 transition"
                        // style={{ color: getNeutralColor(700) }}
                        onClick={() => setShowDropdown(false)}
                      >
                        Espace Candidat
                      </Link>
                  </div>

                  <hr className='mx-4 mt-4 border-neutral-300'/>
              
                  {/* Part 3: Menu Items */}
                  <div className="py-1">
                    <Link
                      href={`/${getUserRole()}/profile`}
                      className="block px-4 py-2 text-sm hover:bg-neutral-100"
                      style={{ color: getNeutralColor(700) }}
                      onClick={() => setShowDropdown(false)}
                    >
                      Profil
                    </Link>

                    {isCandidate && (
                      <Link
                        href="/candidate/applications"
                        className="block px-4 py-2 text-sm hover:bg-neutral-100"
                        style={{ color: getNeutralColor(700) }}
                        onClick={() => setShowDropdown(false)}
                      >
                        Offres postulées
                      </Link>
                    )}

                    <hr className='mx-4 mt-2 border-neutral-300'/>


                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-neutral-100"
                      style={{ color: getNeutralColor(700) }}
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}

              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-5 py-2 rounded-md font-semibold transition-colors duration-200 border"
                style={{
                  borderColor: getPrimaryColor(600),
                  color: getPrimaryColor(600),
                  transitionProperty: 'border-color, color',
                  transitionDuration: '200ms',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.borderColor = getPrimaryColor(700);
                  (e.target as HTMLElement).style.color = getPrimaryColor(700);
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.borderColor = getPrimaryColor(600);
                  (e.target as HTMLElement).style.color = getPrimaryColor(600);
                }}
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 rounded-md font-semibold text-white transition-colors duration-200 shadow-sm"
                style={{
                  backgroundColor: getPrimaryColor(600),
                  color: getNeutralColor(50),
                  transitionProperty: 'background-color, box-shadow',
                  transitionDuration: '200ms',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = getPrimaryColor(700);
                  (e.target as HTMLElement).style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = getPrimaryColor(600);
                  (e.target as HTMLElement).style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;