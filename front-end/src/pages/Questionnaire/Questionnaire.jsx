import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../http-common';
import '../../styles/style.scss';

const Questionnaire = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <div>
      <h1>Welcome to Questionnaire Page!</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Questionnaire;