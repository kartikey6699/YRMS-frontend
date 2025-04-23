import React, { useState, useEffect } from 'react';
import logo from '/header_logo.png';
import userManual from '../../assets/user-solid.svg';

const Header = ({ isLoggedIn }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date and time with seconds
  const formattedDate = currentDateTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  
  const formattedTime = currentDateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const userName = sessionStorage.getItem('userName') || 'Guest';
  const roleName = sessionStorage.getItem('roleName') || '';

  return (
    <nav className="bg-gray-200 sticky top-0 z-50 shadow-md">
      <div className="pr-8 pl-0">
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center justify-left sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img className="h-[55px] w-[230px] ml-[20px]" src={logo} alt="Your Company" />
            </div>
          </div>

          {/* Right side - Time and Profile */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Date/Time Display */}
            <div className="hidden md:flex items-center mr-4 bg-gray-100 rounded-md px-3 py-1 shadow-sm border-2 border-blue-600">
              <span className="text-gray-700 font-medium text-sm mr-2">
                {formattedDate}
              </span>
              <span className="text-gray-800 font-semibold text-sm">
                {formattedTime}
              </span>
            </div>

            {/* Small time display for mobile */}
            <div className="md:hidden text-gray-700 text-sm font-medium mr-3">
              {formattedTime}
            </div>

            {/* Profile Section */}
            <div className="relative ml-2 flex flex-col items-center">
              <button 
                className="text-gray-700 focus:outline-none hover:bg-gray-300 rounded-full p-1 transition-colors duration-200 flex justify-center w-full"
              >
                <img src={userManual} alt="User Manual" className="w-6 h-6 mx-auto" />
              </button>
              <p className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-md shadow-sm border border-gray-300 mt-1">
                {userName} | <span className="text-blue-600 font-semibold">{roleName}</span>
              </p>
            </div> 
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;