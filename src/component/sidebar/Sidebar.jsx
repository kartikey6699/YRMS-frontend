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
  FaUserTie,
  FaUser,
} from 'react-icons/fa';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import logo from '../../assets/images/Yash-Technologies.png';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const competencyName = sessionStorage.getItem('competencyName') || 'Python';

  // Safely retrieve and normalize roles from sessionStorage
  let userRoles = [];
  try {
    const roleName = sessionStorage.getItem('roleName');
    if (roleName) {
      userRoles = roleName.split(",").map(role => role.trim());
    }
  } catch (error) {
    console.error('Error parsing roleName from sessionStorage:', error);
    userRoles = []; // Fallback to empty array
  }

  // Define all possible menu items
  const allMenuItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboard' },
    { name: 'Resources', icon: <FaCogs />, path: '/manage-resources' },
    { name: 'Analytics', icon: <FaChartBar />, path: '/analytics' },
    { name: 'Training', icon: <FaChalkboardTeacher />, path: '/manage-training' },
    { name: 'Interns', icon: <FaUsersCog />, path: '/interns' },
    { name: 'Admin Panel', icon: <FaUserShield />, path: '/admin-dashboard' },
    { name: 'Super Admin', icon: <FaUserTie />, path: '/superuser-dashboard' },
    { name: 'User Dashboard', icon: <FaUser />, path: '/user-dashboard' },
  ];

  // Determine which menu items to show based on roles
  const getVisibleMenuItems = () => {
    if (!userRoles || userRoles.length === 0) return [];

    // If SuperAdmin, show only Super Admin menu
    if (userRoles.includes('SuperAdmin')) {
      return allMenuItems.filter(item => item.name === 'Super Admin');
    }

    // If Admin, show all menus except Super Admin
    if (userRoles.includes('Admin')) {
      return allMenuItems.filter(item => item.name !== 'Super Admin' && item.name !== 'User Dashboard');
    }
    // If Trainer, show only Training menu
    if (userRoles.includes('Trainer')) {
      return allMenuItems.filter(item => item.name === 'Training');
    }

    // If only User role (no other roles), show only User Dashboard
    if (userRoles.length === 1 && userRoles.includes('User')) {
      return allMenuItems.filter(item => item.name === 'User Dashboard');
    }
    return [];
  };

  const menuItems = getVisibleMenuItems();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <>
      {/* Main Sidebar */}
      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-100 text-gray-800 
        transition-all duration-300 ease-in-out ${isOpen ? 'w-56' : 'w-16'} z-40 
        shadow-[0_0_15px_rgba(0,0,0,0.1)] flex flex-col`}
      >
        {/* Logo Section with Enhanced Animation - Integrated with Menu */}
        <div className="relative bg-gradient-to-b from-gray-100 to-gray-100 overflow-visible pt-4 pb-2">
          {/* Toggle button with right half visible */}
          <div className="absolute right-0 top-0 h-full w-full overflow-visible">
            <button
              onClick={toggleSidebar}
              className="absolute right-0 top-10 transform -translate-y-1/2 translate-x-1/2 z-50 w-8 h-8 bg-blue-600 rounded-full shadow-lg
              border-2 border-white flex items-center justify-center hover:bg-blue-700 transition-all
              duration-300 focus:outline-none hover:scale-110"
            >
              {isOpen ? (
                <FiChevronLeft className="text-white" />
              ) : (
                <FiChevronRight className="text-white" />
              )}
            </button>
          </div>

          {/* Background effects - lighter */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 to-transparent animate-pulse-slow"></div>
          <div className="absolute h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-200/20 via-transparent to-transparent animate-ping-slow"></div>
          
          {/* Animated blue swoosh effect */}
          <div className="absolute right-0 top-0 h-20 w-40 bg-blue-400/30 blur-xl rounded-full transform -translate-x-10 animate-swoosh"></div>

          {/* Logo container with animations */}
          <div className={`flex items-center justify-center w-full transition-all duration-300 ${isOpen ? 'px-4' : 'px-2'} mb-2`}>
            <div className="relative group animate-breath">
              {/* Inner glow effects */}
              <div className="absolute -inset-2 bg-gradient-to-r from-red-500/30 via-transparent to-blue-500/30 rounded-full blur-md animate-spin-slow opacity-70"></div>
              <div className="absolute -inset-3 bg-blue-500/20 rounded-full opacity-70 blur-lg animate-pulse-slow"></div>
              
              {/* Logo image */}
              <img
                src={logo}
                alt="Yash Technologies Logo"
                className={`relative z-10 transition-all duration-500 group-hover:scale-110 object-contain animate-glow
                          ${isOpen ? 'h-16 w-48' : 'h-14 w-14'}`}
              />
              
              {/* Hover effects */}
              <div className="absolute inset-0 bg-blue-400/30 blur-md opacity-0 group-hover:opacity-70 rounded-full animate-ping-slow"></div>
            </div>
          </div>
        </div>

        {/* Menu Items - No separation from logo section */}
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
                        : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-transparent'
                      }`}
                  >
                    <span
                      className={`flex-shrink-0 text-lg transition-colors duration-200 ${isActive ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-800'
                        }`}
                    >
                      {item.icon}
                    </span>

                    {isOpen && (
                      <span className="ml-3 text-sm whitespace-nowrap overflow-hidden">{item.name}</span>
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
              {isOpen && <span className="text-sm font-medium">Logout</span>}
            </button>
            {!isOpen && (
              <div
                className="absolute right-0 translate-x-full top-1/2 -translate-y-1/2 px-2 py-1
                  bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100
                  pointer-events-none transition-opacity duration-200 whitespace-nowrap"
              >
                Logout
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;