import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaCogs, 
  FaChalkboardTeacher, 
  FaChartLine, 
  FaTasks, 
  FaChartBar,
  FaArrowRight,
  FaArrowLeft,
  FaTachometerAlt
} from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboard' },
    { name: 'Resources', icon: <FaCogs />, path: '/manage-resources' },
    { name: 'Trainers', icon: <FaChalkboardTeacher />, path: '/manage-trainers' },
    { name: 'Baseline', icon: <FaChartLine />, path: '/manage-baseline' },
    { name: 'Training', icon: <FaTasks />, path: '/manage-training' },
    { name: 'Analytics', icon: <FaChartBar />, path: '/analytics' },
  ];

  return (
    <div className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-950 text-white 
      transition-all duration-500 ease-in-out ${isOpen ? 'w-56' : 'w-14'} z-50 
      shadow-[0_0_15px_rgba(0,0,0,0.3)] overflow-hidden`}>
      
      {/* Toggle Button with Glow Effect */}
      <button
        onClick={toggleSidebar}
        className="w-full p-3 flex justify-end items-center text-gray-400 
        hover:text-white focus:outline-none relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-900/20 to-transparent 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="relative z-10 p-1 rounded-md hover:bg-gray-800/50 transition-colors duration-200">
          {isOpen ? <FaArrowLeft size={14} /> : <FaArrowRight size={14} />}
        </span>
      </button>

      {/* Menu Items */}
      <nav className="mt-4 px-2">
        {menuItems.map((item, index) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center py-2.5 px-3 my-1.5 rounded-lg relative overflow-hidden
              transition-all duration-300 group
              ${location.pathname === item.path 
                ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-white' 
                : 'text-gray-300 hover:text-white'}`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            {/* Animated Background Line */}
            <span className={`absolute left-0 top-0 h-full w-1 bg-indigo-500 
              transition-all duration-300 ${location.pathname === item.path 
                ? 'opacity-100' 
                : 'opacity-0 group-hover:opacity-50'}`} />

            {/* Icon with Pulse Effect on Active */}
            <span className={`w-5 flex-shrink-0 text-sm relative
              ${location.pathname === item.path 
                ? 'text-indigo-400 animate-pulse' 
                : 'group-hover:text-indigo-300'}`}>
              {item.icon}
            </span>

            {/* Text with Slide Effect */}
            <span className={`ml-3 text-xs font-medium tracking-wide whitespace-nowrap
              transition-all duration-300 ${isOpen 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-4 absolute'}`}>
              {item.name}
            </span>

            {/* Hover Ripple Effect */}
            <span className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 
              transition-opacity duration-300 transform scale-0 group-hover:scale-150 
              rounded-full pointer-events-none" />
          </button>
        ))}
      </nav>

      {/* Bottom Gradient Accent */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t 
        from-indigo-900/20 to-transparent pointer-events-none" />
    </div>
  );
};

export default Sidebar;