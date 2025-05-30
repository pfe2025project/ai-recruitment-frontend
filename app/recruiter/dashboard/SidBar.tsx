import React from 'react';
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
import { useState } from 'react';

const Sidebar = () => {
  const [active, setActive] = useState('home');

const menuItems = [
  { name: 'home', label: 'Home', icon: <FaHome /> },
  { name: 'applications', label: 'Applications', icon: <FaFileAlt /> },
  { name: 'reports', label: 'Reports', icon: <FaChartBar /> },
  { name: 'settings', label: 'Settings', icon: <FaCog /> },
  { name: 'users', label: 'Users', icon: <FaUserFriends /> },
  { name: 'messages', label: 'Messages', icon: <FaEnvelope /> },
  { name: 'tasks', label: 'Tasks', icon: <FaTasks /> },
  { name: 'calendar', label: 'Calendar', icon: <FaCalendarAlt /> },
  { name: 'notifications', label: 'Notifications', icon: <FaBell /> },
  { name: 'analytics', label: 'Analytics', icon: <FaChartPie /> },
  { name: 'billing', label: 'Billing', icon: <FaCreditCard /> },
  { name: 'media', label: 'Media', icon: <FaImage /> },
  { name: 'support', label: 'Support', icon: <FaHeadset /> },
  { name: 'faq', label: 'FAQ', icon: <FaQuestionCircle /> },
  { name: 'feedback', label: 'Feedback', icon: <FaCommentDots /> },
  { name: 'security', label: 'Security', icon: <FaShieldAlt /> },
  { name: 'integrations', label: 'Integrations', icon: <FaPuzzlePiece /> },
  { name: 'logout', label: 'Logout', icon: <FaSignOutAlt /> },
];


  return (
    <aside className=" w-100 bg-white shadow-md border-r flex flex-col">
   
      <nav className="flex-1 p-4 space-y-2 text-center">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActive(item.name)}
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
