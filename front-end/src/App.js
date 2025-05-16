
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './common/Navbar/navbar';
import Login from './user/Login/Login';
import Home from './user/Home/Home';
import Universities from './user/Universities/Universities';
import Questionnaire from './user/Questionnaire/Questionnaire';
// import Majors from './user/Majors/Majors';
import Profile from './user/Profile/Profile'
import Faculties from './university/Faculties/Faculties'
import UniversityProfile from './university/UniversityProfile/UniversityProfile'
import CreateUniversity from './admin/CreateUniversity/CreateUniversity';
import ListUniversities from './admin/ListUniversities/ListUniversities';
import Majors from './university/Majors/Majors'
import UniversityInfo from './user/Universities/Information/Information'
import FacultyMajors from './user/Universities/Information/MajorsList/MajorsList'
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
  const userRole = localStorage.getItem('userRole');

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
          <Route path="/profile" element={<Profile />} />
          <Route path="/majors" element={<Majors />} />
          <Route path="/faculties" element={<Faculties />}/>
          <Route path="/universityProfile" element={<UniversityProfile />}/>
          <Route path="/createUniversity" element ={<CreateUniversity/>}/>          
          <Route path="/listUniversities" element ={<ListUniversities/>}/>
          <Route path="/universities/:id" element ={<UniversityInfo/>}/>
          <Route path="/faculties/:id/majors" element ={<FacultyMajors/>}/>

        </Routes>
      </main>
    </div>
  );
};

export default App;
