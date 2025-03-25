// Header.jsx
import React, { useState } from 'react'
import logo from '/YRMS_logo-removebg-preview (1).png'
import userManual from '../../assets/user-solid.svg'

const Header = ({ isLoggedIn }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-gray-200 sticky top-0 z-50 shadow-md">
      <div className="pr-8 pl-0">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex items-center justify-left sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img className="h-[40px] w-[230px] ml-[20px]" src={logo} alt="Your Company" />
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {isLoggedIn ? (
              <div className="relative ml-3">
                <div className="relative">
                  <button onClick={toggleDropdown} className="text-white focus:outline-none">
                    <img src={userManual} alt="User Manual" className="w-8 h-8" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                      <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Profile</a>
                      <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Settings</a>
                      <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Sign Out</a>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button onClick={toggleDropdown} className="text-white focus:outline-none">
                <img src={userManual} alt="User Manual" className="w-8 h-8" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header