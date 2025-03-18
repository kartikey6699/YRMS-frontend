import React, { useState } from 'react'
import logo from '/YRMS_logo-removebg-preview.png'
import userManual from '../../assets/user-solid.svg'
const Header = ({ isLoggedIn }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-gray-200">
      <div className="pr-8 pl-0">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex items-center justify-left sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img className="h-50 w-80" src={logo} alt="Your Company" />
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {isLoggedIn ? (<div className="relative ml-3">
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
              //   <div className="flex space-x-4">
              //   <a href="/login" className="text-gray-900 hover:text-black">Login</a>
              //   <a href="/signup" className="text-gray-500 hover:text-gray-700">Sign Up</a>
              // </div>
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
