
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser, logout } from '@/lib/api/auth';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

import { Users, Smartphone, FileText, Settings, Download, BarChart3, HelpCircle } from "lucide-react"
import { FaSearch } from 'react-icons/fa';
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


const Sidebar = () => {

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
  const [active, setActive] = useState('home');

const menuItems = [
  { name: 'home',path:"", label: 'Home', icon: <FaHome /> },
  { name: 'applications' ,path:"jobs", label: 'Applications', icon: <FaFileAlt /> },
  { name: 'users',path:"", label: 'Users', icon: <FaUserFriends /> },
  
  { name: 'settings',path:"", label: 'Settings', icon: <FaCog /> },
  { name: 'reports',path:"", label: 'Reports', icon: <FaChartBar /> },
  { name: 'messages',path:"", label: 'Messages', icon: <FaEnvelope /> },



  { name: 'support',path:"", label: 'Support', icon: <FaQuestionCircle /> },


];


  return (
    <aside className="">
   
      <nav className="bg-gray-200 h-screen flex flex-col">
        {menuItems.map((item) => (
          <button
            key={item.name}
           
            onClick={function() {item.path=="jobs" ?  router.push(`/recruiter/jobs?recruiter_id=${user?.id}`): "" ;setActive(item.name)} }
            className={`w-full flex items-center text-center gap-3 p-3 rounded-lg text-sm font-medium mt-2 
              ${
                active === item.name
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              } transition`}
          >
            <span className="text-lg">{item.icon}</span>
          
          </button>
        ))}
      </nav>
    
    </aside>
  );
};

export default Sidebar;
