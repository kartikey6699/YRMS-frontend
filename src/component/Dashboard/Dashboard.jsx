import React from 'react';
import { FaCogs, FaChalkboardTeacher, FaGraduationCap, FaChartBar, FaUserGraduate } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const currentHour = new Date().getHours();

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

  // Card data configuration for cleaner JSX
  const cards = [
    {
      path: '/manage-resources',
      icon: <FaCogs className="text-4xl text-blue-600 mr-4" />,
      title: 'Manage Resources',
      gradient: 'from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300'
    },
    {
      path: '/analytics',
      icon: <FaChartBar className="text-4xl text-yellow-600 mr-4" />,
      title: 'Analytics',
      gradient: 'from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300'
    },
    {
      path: '/manage-training',
      icon: <FaGraduationCap className="text-4xl text-purple-600 mr-4" />,
      title: 'Training & Upskilling',
      gradient: 'from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300'
    },
    {
      path: '/interns',
      icon: <FaUserGraduate className="text-4xl text-pink-600 mr-4" />,
      title: 'Intern Management',
      gradient: 'from-pink-100 to-pink-200 hover:from-pink-200 hover:to-pink-300'
    }
  ];

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
      </div>
      
      {/* Quick Actions Section */}
      <div className="text-center text-2xl md:text-3xl font-semibold mb-6 md:mb-10 text-gray-800">
        Quick Actions
      </div>
      
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card, index) => (
          <div 
            key={index}
            className={`bg-gradient-to-br ${card.gradient} p-4 md:p-6 rounded-xl shadow-md transition-all duration-300 flex items-center cursor-pointer transform hover:-translate-y-1`}
            onClick={() => handleCardClick(card.path)}
          >
            {card.icon}
            <span className="text-base md:text-lg font-medium text-gray-800">
              {card.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;