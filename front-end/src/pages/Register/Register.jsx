import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../http-common';
import '../../styles/style.scss';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: 'student'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post('/users/register', formData);
//       navigate('/login');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Registration failed');
//     }
//   };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        full_name: `${formData.firstName} ${formData.lastName}`, // Combine names
        email: formData.email,
        password: formData.password,
        role: formData.userType, // Change userType to role
      };
  
      await api.post('/users/register', payload);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };
  
  return (
    <div className="form-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="firstName" type="text" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
        <input name="lastName" type="text" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <select name="userType" value={formData.userType} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="university">University</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
