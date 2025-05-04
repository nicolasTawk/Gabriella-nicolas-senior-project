// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../../http-common';
// import '../../styles/style.scss';
// import './Login.scss';
// import logo from '../../util/images/logo.png';

// const Login = ({ onLogin }) => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [loginData, setLoginData] = useState({
//     userName: '',
//     password: ''
//   });
//   const [registerData, setRegisterData] = useState({
//     firstName: '',
//     lastName: '',
//     userName: '',
//     dob: '',
//     phoneNumber: '',
//     email: '',
//     gender: '',
//     password: '',
//     confirmPassword: ''
//   });

//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLoginChange = (e) => {
//     setLoginData({ ...loginData, [e.target.name]: e.target.value });
//   };

//   const handleRegisterChange = (e) => {
//     setRegisterData({ ...registerData, [e.target.name]: e.target.value });
//   };

//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setLoading(true);

//     console.log("🔐 Login Payload:", loginData); // ✅ Logging what is actually being sent

//     try {
//       const res = await api.post('/users/login', loginData);
//       localStorage.setItem('authToken', res.data.token);
//       api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
//       setSuccess('Login successful!');
//       setTimeout(() => {
//         onLogin();
//         navigate('/home');
//       }, 1500);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRegisterSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     setLoading(true);

//     if (registerData.password !== registerData.confirmPassword) {
//       setError('Passwords do not match');
//       setLoading(false);
//       return;
//     }

//     const payload = {
//       firstName: registerData.firstName,
//       lastName: registerData.lastName,
//       userName: registerData.userName,
//       dob: registerData.dob,
//       phoneNumber: registerData.phoneNumber,
//       email: registerData.email,
//       gender: registerData.gender,
//       password: registerData.password
//     };

//     try {
//       await api.post('/users/register', payload);
//       setSuccess('Account created successfully! Please login.');
//       setTimeout(() => setIsLogin(true), 1500);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderInput = (type, name, value, onChange) => (
//     <div className="form-group" key={name}>
//       <input
//         type={type}
//         name={name}
//         id={name}
//         value={value}
//         onChange={onChange}
//         required
//         className="form-control"
//         placeholder=" "
//       />
//       <label htmlFor={name} className="animated-label">
//         {name === 'dob'
//           ? 'Date of Birth'
//           : name === 'phoneNumber'
//           ? 'Phone Number'
//           : name === 'confirmPassword'
//           ? 'Confirm Password'
//           : name.charAt(0).toUpperCase() + name.slice(1)}
//       </label>
//     </div>
//   );

//   return (
//     <div className={`page-container ${isLogin ? '' : 'sign-up-mode'}`}>
//       <div className="form-wrapper">
//         <div className="form-content">
//           {isLogin ? (
//             <form onSubmit={handleLoginSubmit} className="form-box">
//               <h2 className="title">Sign In</h2>
//               {renderInput('text', 'userName', loginData.userName, handleLoginChange)}
//               {renderInput('password', 'password', loginData.password, handleLoginChange)}
//               <button type="submit" className="primary-btn">
//                 {loading ? 'Logging in...' : 'Login'}
//               </button>
//               {error && <p className="error">{error}</p>}
//               {success && <p className="success">{success}</p>}
//             </form>
//           ) : (
//             <form onSubmit={handleRegisterSubmit} className="form-box">
//               <h2 className="title">Sign Up</h2>
//               {renderInput('text', 'firstName', registerData.firstName, handleRegisterChange)}
//               {renderInput('text', 'lastName', registerData.lastName, handleRegisterChange)}
//               {renderInput('text', 'userName', registerData.userName, handleRegisterChange)}
//               {renderInput('date', 'dob', registerData.dob, handleRegisterChange)}
//               {renderInput('text', 'phoneNumber', registerData.phoneNumber, handleRegisterChange)}
//               {renderInput('email', 'email', registerData.email, handleRegisterChange)}
//               {renderInput('password', 'password', registerData.password, handleRegisterChange)}
//               {renderInput('password', 'confirmPassword', registerData.confirmPassword, handleRegisterChange)}

//               <div className="form-group">
//                 <select
//                   name="gender"
//                   className="form-control"
//                   value={registerData.gender}
//                   onChange={handleRegisterChange}
//                   required
//                 >
//                   <option value="" disabled hidden></option>
//                   <option value="female">Female</option>
//                   <option value="male">Male</option>
//                   <option value="other">Other</option>
//                 </select>
//                 <label className="animated-label" htmlFor="gender">Gender</label>
//               </div>

//               <button type="submit" className="primary-btn">
//                 {loading ? 'Creating Account...' : 'Sign Up'}
//               </button>
//               {error && <p className="error">{error}</p>}
//               {success && <p className="success">{success}</p>}
//             </form>
//           )}
//         </div>
//       </div>

//       <div className="panel-wrapper">
//         <div className="panel">
//           <div className="content">
//             <img src={logo} alt="Logo" className="panel-logo" />
//             <h3>{isLogin ? "Don't have an account?" : "Already have an account?"}</h3>
//             <button className="secondary-btn panel-btn" onClick={() => setIsLogin(!isLogin)}>
//               {isLogin ? "Sign Up" : "Sign In"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../http-common';
import '../../styles/style.scss';
import './Login.scss';
import logo from '../../util/images/logo.png';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({
    username: '',  // ✅ must be 'username'
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

  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const handleRegisterChange = (e) =>
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const payload = {
      username: loginData.username,
      password: loginData.password,
    };

    console.log('🔐 Sending login payload:', payload);

    try {
      const res = await api.post('/users/login', payload);
      console.log('✅ Login response:', res.data);

      const { token, user } = res.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', user.role);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setSuccess('Login successful!');
      setTimeout(() => {
        onLogin();
        navigate(user.role === 'admin' ? '/admin-dashboard' : '/home');
      }, 1000);
    } catch (err) {
      console.error('❌ Login error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // const handleRegisterSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   setSuccess('');
  //   setLoading(true);

  //   if (registerData.password !== registerData.confirmPassword) {
  //     setError('Passwords do not match');
  //     setLoading(false);
  //     return;
  //   }

  //   const payload = {
  //     first_name: registerData.first_name,
  //     last_name: registerData.last_name,
  //     username: registerData.username,
  //     birth_date: registerData.birth_date,
  //     phone: registerData.phone,
  //     email: registerData.email,
  //     gender: registerData.gender,
  //     password: registerData.password
  //   };

  //   console.log('📝 Sending registration payload:', payload);

  //   try {
  //     const res = await api.post('/users/register', payload);
  //     console.log('✅ Registration response:', res.data);
  //     setSuccess('Account created successfully! Please login.');
  //     setTimeout(() => setIsLogin(true), 1500);
  //   } catch (err) {
  //     console.error('❌ Registration error:', err.response?.data || err.message);
  //     setError(err.response?.data?.error || 'Registration failed');
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
  
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
  
    const payload = {
      first_name: registerData.first_name,
      last_name: registerData.last_name,
      username: registerData.username,
      birth_date: registerData.birth_date,
      phone: registerData.phone,
      email: registerData.email,
      gender: registerData.gender,
      password: registerData.password
    };
  
    console.log('📝 Sending registration payload:', payload);
  
    try {
      const res = await api.post('/users/register', payload);
      console.log('✅ Registration response:', res.data);
      setSuccess('Account created successfully! Please login.');
      setTimeout(() => setIsLogin(true), 1500);
    } catch (err) {
      console.error('❌ Registration error:', err.response?.data || err.message);
      const firstError = err.response?.data?.errors?.[0]?.msg || err.response?.data?.error;
      setError(firstError || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  
  const renderInput = (type, name, value, onChange) => (
    <div className="form-group" key={name}>
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
        {name === 'birth_date'
          ? 'Date of Birth'
          : name === 'phone'
          ? 'Phone Number'
          : name === 'confirmPassword'
          ? 'Confirm Password'
          : name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' ')}
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
              {renderInput('text', 'username', loginData.username, handleLoginChange)}
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
              {renderInput('text', 'first_name', registerData.first_name, handleRegisterChange)}
              {renderInput('text', 'last_name', registerData.last_name, handleRegisterChange)}
              {renderInput('text', 'username', registerData.username, handleRegisterChange)}
              {renderInput('date', 'birth_date', registerData.birth_date, handleRegisterChange)}
              {renderInput('text', 'phone', registerData.phone, handleRegisterChange)}
              {renderInput('email', 'email', registerData.email, handleRegisterChange)}
              {renderInput('password', 'password', registerData.password, handleRegisterChange)}
              {renderInput('password', 'confirmPassword', registerData.confirmPassword, handleRegisterChange)}

              <div className="form-group">
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
