
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser, logout } from '@/lib/api/auth';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

import { Users, Smartphone, FileText, Settings, Download, BarChart3, HelpCircle } from "lucide-react"
import { FaSearch } from 'react-icons/fa';

const Topbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const navigationItems = [
   
    { icon: Users, label: "Team" },
    { icon: Smartphone, label: "Mobile" },
    { icon: FileText, label: "Documents" },
    { icon: Settings, label: "Settings" },
    { icon: Download, label: "Downloads" },
    { icon: BarChart3, label: "Analytics" },
    { icon: HelpCircle, label: "Help" },
  ]


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
        console.log(currentUser);
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
    router.push('/login');

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
    <div className="flex items-center justify-between p-4 bg-white shadow-sm rounded-lg mb-4">
      
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

   <button onClick={() => setShowDropdown(!showDropdown)}>
         <img
          src="https://i.pravatar.cc/40"
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
   </button>

      {showDropdown && (

         <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50">
      
                        {/* Part 1: Header with Avatar, Name & Email */}
                        <div className="flex items-center px-4 py-3 ">
                          {user?.user_metadata?.avatar_url ? (
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
                              {user?.email ? user.email.charAt(0).toUpperCase() : '?'}
                            </div>
                          )}
      
                          <div className="flex flex-col">
                            <p className="text-sm font-medium">{getUserDisplayName()}</p>
                            <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                          </div>
                        </div>
      
                        {/* Part 2: Dashboard Button */}
                        <div className="px-4 py-1 ">
                            <Link
                              href="/dashboard"
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
                              href={`/recruiter/jobs?recruiter_id=${user?.id}`}
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
    </div>
  );
};

export default Topbar;
