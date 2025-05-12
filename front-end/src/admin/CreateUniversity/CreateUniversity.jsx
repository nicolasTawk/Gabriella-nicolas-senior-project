// import React, { useState } from 'react';
// import api from '../../http-common';
// import './CreateUniversity.scss';
// import '../../styles/style.scss'

// const CreateUniversity = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     email: '',
//   });

//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');
//     try {
//       const res = await api.post('/admin/create-university', formData);
//       setMessage('✅ University account created successfully.');
//       setFormData({ username: '', password: '', email: '' });
//     } catch (err) {
//       console.error(err);
//       setMessage('❌ Failed to create university account.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="create-university">
//       <h2 className="create-university__title">Create New University Account</h2>

//       <form onSubmit={handleSubmit} className="create-university__form">
//         <div className="create-university__group">
//           <label>Username</label>
//           <input
//             type="text"
//             value={formData.username}
//             onChange={e => handleChange('username', e.target.value)}
//             required
//           />
//         </div>

//         <div className="create-university__group">
//           <label>Email</label>
//           <input
//             type="email"
//             value={formData.email}
//             onChange={e => handleChange('email', e.target.value)}
//             required
//           />
//         </div>

//         <div className="create-university__group">
//           <label>Password</label>
//           <input
//             type="password"
//             value={formData.password}
//             onChange={e => handleChange('password', e.target.value)}
//             required
//           />
//         </div>

//         {message && <p className="create-university__message">{message}</p>}

//         <button
//           type="submit"
//           className="create-university__button primary-btn"
//           disabled={loading}
//         >
//           {loading ? 'Creating...' : 'Create University'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateUniversity;

import React, { useState } from 'react';
import api from '../../http-common';
import './CreateUniversity.scss';
import '../../styles/style.scss'; // global styles + button themes

const CreateUniversity = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/admin/create-university', formData);
      setMessage('✅ University account created successfully.');
      setFormData({ username: '', password: '', email: '' });
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to create university account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container create-university">
      <div className="row w-100">
        <div className=" col-lg-6 col-md-12">
          <h2 className="create-university__title">Create New University Account</h2>

          <form onSubmit={handleSubmit} className="create-university__form">
            <div className="row">
              <div className="col-12 mb-3 create-university__group">
                <label>Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={e => handleChange('username', e.target.value)}
                  required
                />
              </div>

              <div className="col-12 mb-3 create-university__group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="col-12 mb-3 create-university__group">
                <label>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => handleChange('password', e.target.value)}
                  required
                />
              </div>

              {message && (
                <div className="col-12">
                  <p className="create-university__message">{message}</p>
                </div>
              )}

              <div className="col-12">
                <button
                  type="submit"
                  className="create-university__button primary-btn w-100"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create University'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUniversity;
