import React, { useState, useEffect } from 'react';
import logo from '/YRMS_logo-removebg-preview (1).png';
import userManual from '../../assets/user-solid.svg';

const Header = ({ isLoggedIn }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

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

  return (
    <nav className="bg-gray-200 sticky top-0 z-50 shadow-md">
      <div className="pr-8 pl-0">
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center justify-left sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img className="h-[40px] w-[230px] ml-[20px]" src={logo} alt="Your Company" />
            </div>
          </div>

          {/* Right side - Time and Profile */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Date/Time Display */}
            <div className="hidden md:flex items-center mr-4 bg-gray-100 rounded-md px-3 py-1 shadow-sm">
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

            {/* Profile Dropdown */}
            {isLoggedIn ? (
              <div className="relative ml-3">
                <div className="relative">
                  <button 
                    onClick={toggleDropdown} 
                    className="text-gray-700 focus:outline-none hover:bg-gray-300 rounded-full p-1 transition-colors duration-200"
                  >
                    <img src={userManual} alt="User Manual" className="w-8 h-8" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20 animate-fade-in">
                      <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200">Profile</a>
                      <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200">Settings</a>
                      <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200">Sign Out</a>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button onClick={toggleDropdown} className="text-gray-700 focus:outline-none">
                <img src={userManual} alt="User Manual" className="w-8 h-8" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;