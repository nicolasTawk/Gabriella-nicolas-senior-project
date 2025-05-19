import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './user/Login/Login';

// Layouts
import StudentLayout from './Layouts/StudentLayout/StudentLayout';
import UniversityLayout from './Layouts/UniversityLayout/UniversityLayout';
import AdminLayout from './Layouts/AdminLayout/AdminLayout';

// Student Pages
import Home from './user/Home/Home';
import Universities from './user/Universities/Universities';
import Questionnaire from './user/Questionnaire/Questionnaire';
import Profile from './user/Profile/Profile';
import UniversityInfo from './user/Universities/Information/Information';
import MajorsByFaculty from './user/Universities/Information/MajorsByFaculty/MajorsByFaculty';
import MajorsList from './user/MajorsList/MajorsList'
import Review from './user/Universities/Information/Review/Review'

// University Pages
import Faculties from './university/Faculties/Faculties';
import UniversityProfile from './university/UniversityProfile/UniversityProfile';
import Majors from './university/Majors/Majors';

// Admin Pages
import CreateUniversity from './admin/CreateUniversity/CreateUniversity';
import CreateAdmin from './admin/CreateAdmin/CreateAdmin';
import ListUniversities from './admin/ListUniversities/ListUniversities';
import ListStudents from './admin/ListStudents/ListStudents';
import ChangeAdminPassword from './admin/ChangeAdminPassword/ChangeAdminPassword';
import Schema from './admin/Schema/Schema';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const userRole = localStorage.getItem('userRole')

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />

      {/* Student Routes */}
      <Route
        element={
          <StudentLayout
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        }
      >
        {/* <Route index element={<Navigate to={isAuthenticated ? '/home' : '/login'} />} /> */}
        <Route
          index
          element={
            !isAuthenticated
              ? <Navigate to="/login" />
              : userRole === 'admin'
                ? <Navigate to="/createUniversity" />
                : userRole === 'university'
                  ? <Navigate to="/universityProfile" />
                  : <Navigate to="/home" />
          }
        />
        <Route path="home" element={<Home />} />
        <Route path="universities" element={<Universities />} />
        <Route path="questionnaire" element={<Questionnaire />} />
        <Route path="profile" element={<Profile />} />
        <Route path="universities/:id" element={<UniversityInfo />} />
        <Route path="faculties/:id/majors" element={<MajorsByFaculty />} />
        <Route path="majorsList" element= {<MajorsList/>}/>
        <Route path="/reviews/university/:id" element= {<Review/>}/>
      </Route>

      {/* University Routes */}
      <Route
        element={
          <UniversityLayout
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        }
      >
        <Route path="faculties" element={<Faculties />} />
        <Route path="universityProfile" element={<UniversityProfile />} />
        <Route path="majors" element={<Majors />} />

      </Route>

      {/* Admin Routes */}
      <Route
        element={
          <AdminLayout
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        }
      >
        <Route path="createUniversity" element={<CreateUniversity />} />
        <Route path="createAdmin" element={<CreateAdmin />} />
        <Route path="listUniversities" element={<ListUniversities />} />
        <Route path="listStudents" element={<ListStudents />} />
        <Route path="changeAdminPassword" element={<ChangeAdminPassword />} />
        <Route path="schemas" element={<Schema />} />

        
      </Route>
    </Routes>
  );
};

export default App;
