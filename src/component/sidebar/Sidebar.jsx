import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaCogs,
  FaChalkboardTeacher,
  FaChartLine,
  FaTasks,
  FaChartBar,
  FaTachometerAlt,
  FaEye,
  FaPlus,
  FaLightbulb,
  FaUsersCog
} from 'react-icons/fa';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import logo from '../../assets/images/competency_logos/python.png';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboard' },
    { name: 'Resources', icon: <FaCogs />, path: '/manage-resources' },
    { name: 'Analytics', icon: <FaChartBar />, path: '/analytics' },
    { name: 'Trainers', icon: <FaChalkboardTeacher />, path: '/manage-trainers' },
    { name: 'Training', icon: <FaTasks />, path: '/manage-training' },
    { name: 'Interns', icon: <FaUsersCog />, path: '/interns'},
  ];

  return (
    <div className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-100 text-gray-800 
      transition-all duration-300 ease-in-out ${isOpen ? 'w-56' : 'w-16'} z-40 
      shadow-[0_0_15px_rgba(0,0,0,0.1)] flex flex-col`}>
      
      {/* Logo and Title Section */}
      <div className="relative h-20 bg-gradient-to-r from-black to-gray-200 flex items-center justify-center border-b-2 border-gray-300">
        <button
          onClick={toggleSidebar}
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 z-50 w-6 h-6 bg-gray-600 rounded-full shadow-lg
          border-2 border-white flex items-center justify-center hover:bg-gray-700 transition-all
          duration-300 focus:outline-none hover:scale-110`}
        >
          {isOpen ? (
            <FiChevronLeft className="text-white" />
          ) : (
            <FiChevronRight className="text-white" />
          )}
        </button>

        <div className={`flex items-center transition-all duration-300 ${isOpen ? 'px-4' : 'px-2'}`}>
          <img 
            src={logo}
            alt="Python Logo"
            className="h-12 w-12 object-contain transition-transform duration-300 hover:scale-110"
          />
          {isOpen && (
            <div className="ml-3 overflow-hidden">
              <span className="text-xl font-bold text-white tracking-wide whitespace-nowrap">
                Python RMS 
              </span>  
              <div className="h-1 mt-1 bg-white bg-opacity-50 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto pt-2 pb-4">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <div 
                key={item.name}
                className="relative z-10" 
                onMouseEnter={() => !isOpen && setHoveredItem(item.name)}
                onMouseLeave={() => !isOpen && setHoveredItem(null)}
              >
                {/* Main Menu Item */}
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center py-3 px-3 my-1 rounded-lg relative
                    transition-all duration-200 group
                    ${isActive 
                      ? 'bg-gray-300 text-gray-900 font-medium border-2 border-gray-500 shadow-inner animate-pulse' 
                      : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-transparent'}`}
                >
                  <span className={`flex-shrink-0 text-lg transition-colors duration-200 ${
                    isActive ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-800'
                  }`}>
                    {item.icon}
                  </span>

                  {isOpen && (
                    <span className="ml-3 text-sm whitespace-nowrap overflow-hidden">
                      {item.name}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;