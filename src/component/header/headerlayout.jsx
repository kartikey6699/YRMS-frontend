import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from './header';
import Sidebar from '../sidebar/Sidebar';

const HeaderLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isLandingPage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        {!isLandingPage && <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} adminPanelOpen={adminPanelOpen} setAdminPanelOpen={setAdminPanelOpen} />}
        <main className={`flex-1 transition-all duration-300 ${!isLandingPage && (adminPanelOpen && isOpen ? 'ml-112': adminPanelOpen && !isOpen ? 'ml-72' : !adminPanelOpen && isOpen ? 'ml-54'  : 'ml-16' )}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HeaderLayout;