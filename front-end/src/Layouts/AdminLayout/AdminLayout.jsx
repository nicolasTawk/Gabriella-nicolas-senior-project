import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../common/Navbar/navbar';

const AdminLayout = ({ isSidebarOpen, setIsSidebarOpen }) => (
  <div
    className={`app-wrapper ${
      isSidebarOpen ? 'app-wrapper--sidebar-open' : 'app-wrapper--sidebar-closed'
    }`}
  >
    <Navbar onToggle={setIsSidebarOpen} />
    <main className="main-content">
      <Outlet />
    </main>
  </div>
);

export default AdminLayout;
