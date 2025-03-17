import React, { useState } from 'react';
import { Outlet } from 'react-router';
import Header from './header';
import Sidebar from '../sidebar/Sidebar';

const HeaderLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        <main className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-16'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HeaderLayout;