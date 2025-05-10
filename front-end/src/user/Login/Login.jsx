import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../http-common';
import '../../styles/style.scss';
import './Login.scss';
import logo from '../../util/images/logo.png';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ 
    username: '', 
    password: '' 
  });
  const [registerData, setRegisterData] = useState({
    first_name: '', 
    last_name: '', 
    username: '', 
    birth_date: '',
    phone: '', 
    email: '', 
    gender: '', 
    password: '', 
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const res = await api.post('/users/login', loginData);
      const { token, user } = res.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setSuccess('Login successful!');
      setTimeout(() => {
        onLogin();
        navigate(user.role === 'admin' ? '/admin-dashboard' : '/home');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    const { confirmPassword, ...payload } = registerData;
    try {
      await api.post('/users/register', payload);
      setSuccess('Account created successfully! Please login.');
      setTimeout(() => setIsLogin(true), 1500);
    } catch (err) {
      const firstError = err.response?.data?.errors?.[0]?.msg || err.response?.data?.error;
      setError(firstError || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (type, name, value, onChange) => (
    <div className="login__input-group" key={name}>
      <input
        type={type} name={name} id={name} value={value} onChange={onChange}
        required className="form-control" placeholder=" "
      />
      <label htmlFor={name} className="animated-label">
        {name === 'birth_date' ? 'Date of Birth' :
         name === 'phone' ? 'Phone Number' :
         name === 'confirmPassword' ? 'Confirm Password' :
         name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' ')}
      </label>
    </div>
  );

  return (
    <div className={`login__container ${isLogin ? '' : 'sign-up-mode'}`}>
      <div className="login__form-wrapper">
        <div className="login__form-content">
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="login__form-box text-center">
              <h2 className="login__title">Sign In</h2>
              {renderInput('text', 'username', loginData.username, handleLoginChange)}
              {renderInput('password', 'password', loginData.password, handleLoginChange)}
              <button type="submit" className="login__btn">
                {loading ? 'Logging in...' : 'Login'}
              </button>
              {error && <p className="error">{error}</p>}
              {success && <p className="success">{success}</p>}
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="login__form-box text-center">
              <h2 className="login__title">Sign Up</h2>
              <div className="login__register-inputs">
                <div className="row">
                  <div className="col-12">
                    {renderInput('text', 'first_name', registerData.first_name, handleRegisterChange)}
                  </div>
                  <div className="col-12">
                    {renderInput('text', 'last_name', registerData.last_name, handleRegisterChange)}
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    {renderInput('text', 'username', registerData.username, handleRegisterChange)}
                  </div>
                  <div className="col-12">
                    {renderInput('date', 'birth_date', registerData.birth_date, handleRegisterChange)}
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    {renderInput('text', 'phone', registerData.phone, handleRegisterChange)}
                  </div>
                  <div className="col-12">
                    {renderInput('email', 'email', registerData.email, handleRegisterChange)}
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    {renderInput('password', 'password', registerData.password, handleRegisterChange)}
                  </div>
                  <div className="col-12">
                    {renderInput('password', 'confirmPassword', registerData.confirmPassword, handleRegisterChange)}
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="login__input-group">
                      <select
                        name="gender"
                        className="form-control"
                        value={registerData.gender}
                        onChange={handleRegisterChange}
                        required
                      >
                        <option value="" disabled hidden></option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                      </select>
                      <label className="animated-label" htmlFor="gender">Gender</label>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="login__btn">
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
              {error && <p className="error">{error}</p>}
              {success && <p className="success">{success}</p>}
            </form>
          )}
        </div>
      </div>

      <div className="login__panel-wrapper">
        <div className="login__panel">
          <div className="content">
            <img src={logo} alt="Logo" className="login__logo" />
            <h3>{isLogin ? "Don't have an account?" : "Already have an account?"}</h3>
            <button className="login__btn--secondary login__panel-btn" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
