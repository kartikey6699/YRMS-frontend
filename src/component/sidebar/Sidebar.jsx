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
  FaUsersCog,
  FaSignOutAlt,
  FaUserShield,
  FaList,
  FaCalendarAlt,
  FaUserClock
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
    { name: 'Training and Upskilling', icon: <FaChalkboardTeacher />, path: '/manage-training' },
    { name: 'Interns', icon: <FaUsersCog />, path: '/interns'},
    { name: 'Admin Panel', icon: <FaUserShield />, path: null, isAdmin: true },
  ];

  const adminMenuItems = [
    { name: 'Resource List', icon: <FaList />, path: '/admin/resources' },
    // { name: 'Competency List', icon: <FaLightbulb />, path: '/admin/competencies' },
    // { name: 'Calendar', icon: <FaCalendarAlt />, path: '/admin/calendar' },
    // { name: "Today's Leave", icon: <FaUserClock />, path: '/admin/leave-today' },
    // { name: "Next Week Leave", icon: <FaUserClock />, path: '/admin/leave-next-week' },
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
      // Close admin panel if open and navigate to the selected item
      if (adminPanelOpen) {
        setAdminPanelOpen(false);
      }
      navigate(item.path);
    }
  };

  return (
    <>
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
                    onClick={() => handleMainMenuItemClick(item)}
                    className={`w-full flex items-center py-3 px-3 my-1 rounded-lg relative
                      transition-all duration-200 group
                      ${isActive 
                        ? 'bg-gray-300 text-gray-900 font-medium border-2 border-gray-500 shadow-inner animate-pulse' 
                        : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-transparent'}
                      ${item.isAdmin && adminPanelOpen ? 'bg-gray-200' : ''}`}
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

        {/* Logout Button */}
        <div className="mt-auto border-t border-gray-200">
          <div className="relative group">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center py-4 px-3 bg-gray-200 hover:bg-gray-300
                text-gray-700 transition-all duration-300 group-hover:text-gray-900
                ${isOpen ? 'justify-start' : 'justify-center'}`}
            >
              <FaSignOutAlt className={`text-xl ${isOpen ? 'mr-3' : ''}`} />
              {isOpen && (
                <span className="text-sm font-medium">Logout</span>
              )}
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
        <div className={`fixed top-16 left-${isOpen ? '56' : '16'} h-[calc(100vh-4rem)] bg-gray-200 text-gray-800 
          transition-all duration-300 ease-in-out w-56 z-30 
          shadow-[0_0_15px_rgba(0,0,0,0.1)] flex flex-col border-l border-gray-300`}>
          
          <div className="relative h-20 bg-gradient-to-r from-gray-700 to-gray-400 flex items-center justify-center border-b-2 border-gray-300">
            <div className="flex items-center px-4">
              <FaUserShield className="h-6 w-6 text-white" />
              <div className="ml-3 overflow-hidden">
                <span className="text-xl font-bold text-white tracking-wide whitespace-nowrap">
                  Admin Panel
                </span>  
                <div className="h-1 mt-1 bg-white bg-opacity-50 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pt-2 pb-4">
            <nav className="px-2 space-y-1">
              {adminMenuItems.map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <div 
                    key={item.name}
                    className="relative z-10"
                  >
                    <button
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center py-3 px-3 my-1 rounded-lg relative
                        transition-all duration-200 group
                        ${isActive 
                          ? 'bg-gray-300 text-gray-900 font-medium border-2 border-gray-500 shadow-inner' 
                          : 'text-gray-700 hover:bg-gray-300 hover:text-gray-900 border border-transparent'}`}
                    >
                      <span className={`flex-shrink-0 text-lg transition-colors duration-200 ${
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