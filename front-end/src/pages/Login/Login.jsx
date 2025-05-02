import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../http-common';
import '../../styles/style.scss';
import './Login.scss';
import logo from '../../util/images/logo.png';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await api.post('/users/login', loginData);
      localStorage.setItem('authToken', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        onLogin();
        navigate('/home');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        fullName: registerData.username,
        email: registerData.email,
        password: registerData.password,
        role: 'student',
      };
      await api.post('/users/register', payload);
      setSuccess('Account created successfully! Please login.');
      setTimeout(() => setIsLogin(true), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (type, name, value, onChange) => (
    <div className="form-group">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required
        className="form-control"
        placeholder=" "
      />
      <label htmlFor={name} className="animated-label">
        {name === 'confirmPassword'
          ? 'Confirm Password'
          : name === 'username'
          ? 'Username'
          : name.charAt(0).toUpperCase() + name.slice(1)}
      </label>
    </div>
  );

  return (
    <div className={`page-container ${isLogin ? '' : 'sign-up-mode'}`}>
      <div className="form-wrapper">
        <div className="form-content">
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="form-box">
              <h2 className="title">Sign In</h2>
              {renderInput('email', 'email', loginData.email, handleLoginChange)}
              {renderInput('password', 'password', loginData.password, handleLoginChange)}
              <button type="submit" className="primary-btn">
                {loading ? 'Logging in...' : 'Login'}
              </button>
              {error && <p className="error">{error}</p>}
              {success && <p className="success">{success}</p>}
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="form-box">
              <h2 className="title">Sign Up</h2>
              {renderInput('text', 'username', registerData.username, handleRegisterChange)}
              {renderInput('email', 'email', registerData.email, handleRegisterChange)}
              {renderInput('password', 'password', registerData.password, handleRegisterChange)}
              {renderInput('password', 'confirmPassword', registerData.confirmPassword, handleRegisterChange)}
              <button type="submit" className="primary-btn">
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
              {error && <p className="error">{error}</p>}
              {success && <p className="success">{success}</p>}
            </form>
          )}
        </div>
      </div>

      <div className="panel-wrapper">
        <div className="panel">
          <div className="content">
            <img src={logo} alt="Logo" className="panel-logo" />
            <h3>{isLogin ? "Don't have an account?" : "Already have an account?"}</h3>
            <button className="secondary-btn panel-btn" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
