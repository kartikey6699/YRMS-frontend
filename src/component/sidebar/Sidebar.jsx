import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaCogs,
  FaChalkboardTeacher,
  FaChartBar,
  FaTachometerAlt,
  FaUsersCog,
  FaSignOutAlt,
  FaUserShield,
  FaList
} from 'react-icons/fa';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import logo from '../../assets/images/competency_logos/python.png';

const Sidebar = ({ isOpen, toggleSidebar, adminPanelOpen, setAdminPanelOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboard' },
    { name: 'Resources', icon: <FaCogs />, path: '/manage-resources' },
    { name: 'Analytics', icon: <FaChartBar />, path: '/analytics' },
    { name: 'Training', icon: <FaChalkboardTeacher />, path: '/manage-training' },
    { name: 'Interns', icon: <FaUsersCog />, path: '/interns'},
    { name: 'Admin Panel', icon: <FaUserShield />, path: null, isAdmin: true },
  ];

  const adminMenuItems = [
    { name: 'Resource List', icon: <FaList />, path: '/admin/resources' },
    // Add more admin items as needed
  ];

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const toggleAdminPanel = () => {
    setAdminPanelOpen(!adminPanelOpen);
  };

  const handleMainMenuItemClick = (item) => {
    if (item.isAdmin) {
      toggleAdminPanel();
    } else {
      if (adminPanelOpen) setAdminPanelOpen(false);
      navigate(item.path);
    }
  };

  return (
    <>
      {/* Main Sidebar */}
      <div 
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-100 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-16'
        } z-40 shadow-lg flex flex-col`}
      >
        
        {/* Logo Section */}
        <div className="relative h-20 bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center border-b border-gray-300">
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
              alt="Logo"
              className="h-10 w-10 object-contain transition-transform duration-300 hover:scale-110"
            />
            {isOpen && (
              <div className="ml-3 overflow-hidden">
                <span className="text-lg font-bold text-white tracking-wide whitespace-nowrap">
                  RMS Platform
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-2">
          <nav className="px-2 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isActiveParent = item.isAdmin && adminPanelOpen;
              
              return (
                <div 
                  key={item.name}
                  className="relative z-10" 
                  onMouseEnter={() => !isOpen && setHoveredItem(item.name)}
                  onMouseLeave={() => !isOpen && setHoveredItem(null)}
                >
                  <button
                    onClick={() => handleMainMenuItemClick(item)}
                    className={`w-full flex items-center py-3 px-3 my-1 rounded-lg relative
                      transition-all duration-200 group
                      ${isActive || isActiveParent
                        ? 'bg-gray-300 text-gray-900 font-medium border border-gray-400 shadow-inner' 
                        : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-transparent'}`}
                  >
                    <span className={`flex-shrink-0 text-lg ${
                      isActive || isActiveParent ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-800'
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

        {/* Logout Button */}
        <div className="mt-auto border-t border-gray-200">
          <div className="relative group">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center py-4 px-3 bg-gray-200 hover:bg-gray-300
                text-gray-700 transition-all duration-300 hover:text-gray-900
                ${isOpen ? 'justify-start' : 'justify-center'}`}
            >
              <FaSignOutAlt className={`text-xl ${isOpen ? 'mr-3' : ''}`} />
              {isOpen && <span className="text-sm font-medium">Logout</span>}
            </button>
            {!isOpen && (
              <div className="absolute right-0 translate-x-full top-1/2 -translate-y-1/2 px-2 py-1
                bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100
                pointer-events-none transition-opacity duration-200 whitespace-nowrap">
                Logout
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Panel Sidebar */}
      {adminPanelOpen && (
        <div 
          className={`fixed top-16 h-[calc(100vh-4rem)] bg-gray-200 transition-all duration-300 ${
            isOpen ? 'left-64 w-64' : 'left-16 w-64'
          } z-30 shadow-lg flex flex-col border-l border-gray-300`}
        >
          
          <div className="relative h-20 bg-gradient-to-r from-gray-700 to-gray-500 flex items-center justify-center border-b border-gray-300">
            <div className="flex items-center px-4">
              <FaUserShield className="h-6 w-6 text-white" />
              <div className="ml-3 overflow-hidden">
                <span className="text-lg font-bold text-white tracking-wide whitespace-nowrap">
                  Admin Panel
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            <nav className="px-2 space-y-1">
              {adminMenuItems.map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <div key={item.name} className="relative z-10">
                    <button
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center py-3 px-3 my-1 rounded-lg relative
                        transition-all duration-200 group
                        ${isActive 
                          ? 'bg-gray-300 text-gray-900 font-medium border border-gray-400 shadow-inner' 
                          : 'text-gray-700 hover:bg-gray-300 hover:text-gray-900 border border-transparent'}`}
                    >
                      <span className={`flex-shrink-0 text-lg ${
                        isActive ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-800'
                      }`}>
                        {item.icon}
                      </span>
                      <span className="ml-3 text-sm whitespace-nowrap overflow-hidden">
                        {item.name}
                      </span>
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;