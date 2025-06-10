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



  { name: 'support', label: 'Support', icon: <FaHeadset /> },


];


  return (
    <aside className="">
   
      <nav className="bg-gray-200 h-screen flex flex-col">
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
