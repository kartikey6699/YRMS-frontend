import React from 'react';
import { FaCogs, FaChalkboardTeacher,FaTachometerAlt, FaGraduationCap, FaChartBar, FaUserGraduate, FaUserShield, FaUserTie, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const currentHour = new Date().getHours();
  const competencyName = sessionStorage.getItem('competencyName') || 'Your Team';

  // Safely retrieve and normalize roles from sessionStorage
  let userRoles = [];
  try {
    const roleName = sessionStorage.getItem('roleName');
    if (roleName) {
      userRoles = roleName.split(",");
    }
  } catch (error) {
    console.error('Error parsing roleName from sessionStorage:', error);
    userRoles = []; // Fallback to empty array
  }

  // Define all possible menu items (aligned with Sidebar)
  const allMenuItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboard' },
    { name: 'Resources', icon: <FaCogs className="text-4xl text-blue-600 mr-4" />, path: '/manage-resources', gradient: 'from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300' },
    { name: 'Analytics', icon: <FaChartBar className="text-4xl text-yellow-600 mr-4" />, path: '/analytics', gradient: 'from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300' },
    { name: 'Training', icon: <FaGraduationCap className="text-4xl text-purple-600 mr-4" />, path: '/manage-training', gradient: 'from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300' },
    { name: 'Interns', icon: <FaUserGraduate className="text-4xl text-pink-600 mr-4" />, path: '/interns', gradient: 'from-pink-100 to-pink-200 hover:from-pink-200 hover:to-pink-300' },
    { name: 'Admin Panel', icon: <FaUserShield className="text-4xl text-teal-600 mr-4" />, path: '/admin-dashboard', gradient: 'from-teal-100 to-teal-200 hover:from-teal-200 hover:to-teal-300' },
    { name: 'Super Admin', icon: <FaUserTie className="text-4xl text-indigo-600 mr-4" />, path: '/superuser-dashboard', gradient: 'from-indigo-100 to-indigo-200 hover:from-indigo-200 hover:to-indigo-300' },
    { name: 'User Dashboard', icon: <FaUser className="text-4xl text-green-600 mr-4" />, path: '/user-dashboard', gradient: 'from-green-100 to-green-200 hover:from-green-200 hover:to-green-300' },
  ];

  // Determine which menu items to show based on roles (same logic as Sidebar)
  const getVisibleMenuItems = () => {
    if (!userRoles || userRoles.length === 0) return [];

    if (userRoles.includes('SuperAdmin')) {
      return allMenuItems.filter((item) => item.name !== 'User Dashboard');
    }

    if (userRoles.includes('Admin')) {
      return allMenuItems.filter((item) => item.name !== 'Super Admin' && item.name !== 'User Dashboard' );
    }

    const visibleItems = [];
    if (userRoles.includes('Trainer')) {
      const trainingItem = allMenuItems.find((item) => item.name === 'Training');
      if (trainingItem && !visibleItems.some((item) => item.name === 'Training')) {
        visibleItems.push(trainingItem);
      }
    }
    if (userRoles.includes('User')) {
      const userItems = allMenuItems.filter((item) => ['User Dashboard'].includes(item.name));
      userItems.forEach((item) => {
        if (!visibleItems.some((i) => i.name === item.name)) {
          visibleItems.push(item);
        }
      });
    }

    return visibleItems;
  };

  const menuItems = getVisibleMenuItems();

  // Filter out 'Dashboard' as it's not a card
  const cardItems = menuItems.filter((item) => item.name !== 'Dashboard');

  // Time-based greetings with fallback for missing images
  const { backgroundImage, greeting } = (() => {
    if (currentHour >= 5 && currentHour < 12) {
      return { backgroundImage: 'morning.jpg', greeting: 'Good Morning' };
    } else if (currentHour >= 12 && currentHour < 17) {
      return { backgroundImage: 'noon.jpg', greeting: 'Good Afternoon' };
    } else if (currentHour >= 17 && currentHour < 20) {
      return { backgroundImage: 'evening.jpg', greeting: 'Good Evening' };
    }
    return { backgroundImage: 'night.jpg', greeting: 'Good Night' };
  })();

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 mt-15">
      {/* Hero Section */}
      <div className="relative text-center mb-8 md:mb-12">
        <div className="w-full h-48 md:h-56 bg-gray-300 rounded-xl shadow-lg overflow-hidden">
          <img 
            src={`src/assets/images/dashboard/${backgroundImage}`} 
            className="w-full h-full object-cover"
            alt="Time of day background" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'src/assets/images/dashboard/default.jpg';
            }}
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-lg">
          {greeting}
        </h1>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-md">
          <span className="text-lg md:text-xl font-semibold text-gray-800">
            Welcome to <span className="text-blue-600">{competencyName}</span> Competency
          </span>
        </div>
      </div>
      
      {/* Quick Actions Section */}
      <div className="text-center text-2xl md:text-3xl font-semibold mb-6 md:mb-10 text-gray-800">
        Quick Actions
      </div>
      
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {cardItems.map((card, index) => (
          <div 
            key={index}
            className={`bg-gradient-to-br ${card.gradient} p-4 md:p-6 rounded-xl shadow-md transition-all duration-300 flex items-center cursor-pointer transform hover:-translate-y-1`}
            onClick={() => handleCardClick(card.path)}
          >
            {card.icon}
            <span className="text-base md:text-lg font-medium text-gray-800">
              {card.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;