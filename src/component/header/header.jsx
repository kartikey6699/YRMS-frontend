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

          {/* Right side - Profile and Time */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="flex items-center">
              {/* User Icon */}
              <button 
                className="text-gray-700 focus:outline-none hover:bg-gray-300 rounded-full p-1 transition-colors duration-200"
              >
                <img src={userManual} alt="User Manual" className="w-8 h-8" />
              </button>
              {/* Profile and Time Section */}
              <div className="ml-2 flex flex-col items-start">
                <p className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-md shadow-sm border border-gray-300">
                  {userName} | <span className="text-blue-600 font-semibold">{roleName}</span>
                </p>
                {/* Date/Time Display */}
                <p className="mt-1 text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded-md shadow-sm border border-gray-300">
                  <span>{formattedDate}</span>
                  <span className="ml-2">{formattedTime}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;