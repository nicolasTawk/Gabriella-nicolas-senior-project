import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../../common/Navbar/navbar';
import ChatBot from '../../common/ChatBot/ChatBot';

const StudentLayout = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div
      className={`app-wrapper ${
        !isAuthPage
          ? isSidebarOpen
            ? 'app-wrapper--sidebar-open'
            : 'app-wrapper--sidebar-closed'
          : ''
      }`}
    >
      {!isAuthPage && <Navbar onToggle={setIsSidebarOpen} />}
      <main className={isAuthPage ? 'auth-page-wrapper' : 'main-content'}>
        <Outlet />
      </main>
      {!isAuthPage && <ChatBot />}
    </div>
  );
};

export default StudentLayout;
