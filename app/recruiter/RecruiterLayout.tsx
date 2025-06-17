"use client";
import React, { useEffect, useState } from "react";
import Navbar from "./dashboard/navbar";
import { User } from "@supabase/supabase-js";
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser, logout } from '@/lib/api/auth';
import { useRouter, usePathname } from 'next/navigation';
import { PlusSquare } from "lucide-react";
import {
  FaHome,
  FaFileAlt,
  FaChartBar,
  FaCog,
  FaUserFriends,
  FaEnvelope,
  FaTasks,
  FaCalendarAlt,
  FaBell,
  FaChartPie,
  FaCreditCard,
  FaImage,
  FaHeadset,
  FaQuestionCircle,
  FaCommentDots,
  FaShieldAlt,
  FaPuzzlePiece,
  FaSignOutAlt,
} from 'react-icons/fa';
import { Users, Smartphone, FileText, Settings, Download, BarChart3, HelpCircle } from "lucide-react";
import { FaSearch } from 'react-icons/fa';

interface RecruiterLayoutProps {
    children: React.ReactNode;
    user: User | null;
}

const RecruiterLayout: React.FC<RecruiterLayoutProps> = ({ children, user }) => {
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = [
      { name: 'home', path: '/recruiter/dashboard', label: 'Home', icon: <FaHome /> },
      { name: 'applications', path: '/recruiter/jobs', label: 'Applications', icon: <FaFileAlt /> },
      { name: 'add-job', path: "/recruiter/jobs/new", label: 'Add Job', icon: <PlusSquare size={18} /> },
      { name: 'users', path: '/recruiter/users', label: 'Users', icon: <FaUserFriends /> },
      { name: 'settings', path: '/recruiter/settings', label: 'Settings', icon: <FaCog /> },
      { name: 'reports', path: '/recruiter/reports', label: 'Reports', icon: <FaChartBar /> },
      { name: 'messages', path: '/recruiter/messages', label: 'Messages', icon: <FaEnvelope /> },
      { name: 'support', path: '/recruiter/support', label: 'Support', icon: <FaQuestionCircle /> },
    ];

    const [active, setActive] = useState('add-job');
    const [userState, setUserState] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMessages, setShowMessages] = useState(false);

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

    const getPrimaryColor = (shade: number) => `var(--primary-${shade})`;
    const getNeutralColor = (shade: number) => `var(--neutral-${shade})`;
    const getSecondaryColor = (shade: number) => `var(--secondary-${shade})`;

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const currentUser = await getCurrentUser();
          setUserState(currentUser);
          console.log(currentUser);
        } catch (error) {
          console.error("Erreur lors de la récupération de l'utilisateur :", error);
          setUserState(null);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }, []);

    const handleLogout = () => {
      logout();
      setUserState(null);
      setShowDropdown(false);
      router.push('/login');
    };

    const getUserDisplayName = () => {
      if (!userState) return '';
      const metadata = userState.user_metadata as any;
      if (metadata?.full_name) return metadata.full_name;
      if (metadata?.user_name) return metadata.user_name;
      return userState.email ? userState.email.substring(0, 10) + (userState.email.length > 10 ? '...' : '') : 'User';
    };

    const getUserRole = () => {
      if (!userState) return '';
      const metadata = userState.user_metadata as any;
      return metadata?.role || 'candidate';
    };

    const isCandidate = getUserRole() === 'candidate';

    return (
        <>
            <div className="w-[90%] ms-auto ">
                <Navbar />
            </div>
            <div className="flex h-screen -mt-8!">
                <div className="xl:w-24 w-10 fixed z-50 -mt-16">
                    <aside>
                        <nav className="bg-gray-200 h-screen flex flex-col">
                            {menuItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        setActive(item.name);
                                        if (item.path) {
                                            if (item.name === 'applications') {
                                                router.push(`${item.path}?recruiter_id=${user?.id}`);
                                            } else {
                                                router.push(item.path);
                                            }
                                        }
                                    }}
                                    className={`w-full flex items-center justify-center gap-3 p-3 rounded-lg text-sm font-medium mt-2 
                                        ${
                                            active === item.name
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        } transition`}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span className='hidden'>{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </aside>
                </div>
                <div className="flex-1 p-4">
                    {children}
                </div>
            </div>
        </>
    );
};

export default RecruiterLayout;