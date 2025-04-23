import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './header';
import Sidebar from '../sidebar/Sidebar';

const HeaderLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (!isOpen && adminPanelOpen) {
      setAdminPanelOpen(false);
    }
  };

  const isLandingPage = location.pathname === '/';

  // Calculate main content margin
  const getMainContentMargin = () => {
    if (isLandingPage) return 'ml-0';
    return isOpen ? 'ml-64' : 'ml-16';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={toggleSidebar} isLandingPage={isLandingPage} />
      <div className="flex flex-1">
        {!isLandingPage && (
          <Sidebar 
            isOpen={isOpen} 
            toggleSidebar={toggleSidebar} 
            adminPanelOpen={adminPanelOpen} 
            setAdminPanelOpen={setAdminPanelOpen} 
          />
        )}
        <main className={`flex-1 transition-all duration-300 ${getMainContentMargin()} p-4`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HeaderLayout;