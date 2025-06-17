"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '@/app/recruiter/dashboard/navbar-jobs';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser, logout } from '@/lib/api/auth';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { PlusSquare } from "lucide-react";
import {
  FaHome,
  FaFileAlt,
  FaChartBar,
  FaCog,
  FaUserFriends,
  FaEnvelope,
  FaQuestionCircle,
} from 'react-icons/fa';

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [active, setActive] = useState('home');

  const router = useRouter();

  const menuItems = [
    { name: 'home', path: "/", label: 'Home', icon: <FaHome /> },
    { name: 'applications', path: "/recruiter/jobs", label: 'Applications', icon: <FaFileAlt /> },
    { name: 'add-job', path: "/recruiter/jobs/new", label: 'Add Job', icon: <PlusSquare size={18} /> },
    { name: 'users', path: "/users", label: 'Users', icon: <FaUserFriends /> },
    { name: 'settings', path: "/settings", label: 'Settings', icon: <FaCog /> },
    { name: 'reports', path: "/reports", label: 'Reports', icon: <FaChartBar /> },
    { name: 'messages', path: "/messages", label: 'Messages', icon: <FaEnvelope /> },
    { name: 'support', path: "/support", label: 'Support', icon: <FaQuestionCircle /> },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        console.log(currentUser);
      } catch (error) {
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
    <aside>
      <nav className="bg-gray-200 flex lg:w-[95%] w-full">
        {menuItems.map((item) => (
          <div key={item.name} className="w-[50%]">
            <button
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
              className="flex items-center text-center gap-5 mx-auto px-4 py-4 rounded-lg text-sm font-medium my-2 text-gray-600 hover:bg-gray-100 transition"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="hidden">{item.label}</span>
            </button>
          </div>
        ))}
      </nav>
      <div className="lg:-translate-y-[4.2rem] lg:absolute lg:right-0 flex justify-end lg:block border-b lg:border-b-0 lg:bg-gray-400 lg:h-[4.2rem]">
        <Navbar />
      </div>
    </aside>
  );
};

export default Header;