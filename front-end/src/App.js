




// import React, { useState, useEffect } from 'react';
// import { Routes, Route, Navigate, useLocation, BrowserRouter } from 'react-router-dom';
// import Login from './pages/Login/Login';
// import Register from './pages/Register/Register';
// import Home from './pages/Home/Home';
// // import Settings from './pages/Settings/Settings';
// // import Profile from './pages/Profile/Profile';
// import Navbar from './context/Navbar/navbar';
// import './styles/style.scss';

// const App = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const location = useLocation();

//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     setIsAuthenticated(!!token);
//   }, []);

//   const handleLogin = () => setIsAuthenticated(true);

//   const shouldShowNavbar = !['/login', '/register'].includes(location.pathname);

//   return (
//     <div className="layout-wrapper">
//       {shouldShowNavbar && <Navbar onToggle={setIsSidebarOpen} />}
//       <div className={`layout-content ${isSidebarOpen ? 'layout-content--shifted' : ''}`}>
//         <Routes>
//           <Route path="/" element={<Navigate to={isAuthenticated ? '/home' : '/login'} />} />
//           <Route path="/login" element={<Login onLogin={handleLogin} />} />
//           <Route path="/register" element={<Register onLogin={handleLogin} />} />
//           <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
//           {/* <Route path="/settings" element={<Settings />} /> */}
//           {/* <Route path="/profile" element={<Profile />} /> */}
//         </Routes>
//       </div>
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './context/Navbar/navbar';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Universities from './pages/Universities/Universities'
import Questionnaire from './pages/Questionnaire/Questionnaire'

const App = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => setIsAuthenticated(true);

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className={`app-wrapper ${!isAuthPage ? (isSidebarOpen ? 'app-wrapper--sidebar-open' : 'app-wrapper--sidebar-closed') : ''}`}>
      {!isAuthPage && <Navbar onToggle={setIsSidebarOpen} />}
      <main className={isAuthPage ? 'auth-page-wrapper' : 'main-content'}>
        <Routes>
          <Route path="/" element={<Navigate to={isAuthenticated ? '/home' : '/login'} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/universities" element={<Universities />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
