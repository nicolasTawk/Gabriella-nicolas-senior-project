import React, { useState } from 'react';
import api from '../../http-common';
import './CreateAdmin.scss';
import '../../styles/style.scss';

const CreateAdmin = () => {
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
      await api.post('/admin/create-admin', formData);
      setMessage('✅ Admin account created successfully.');
      setFormData({ username: '', password: '', email: '' });
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to create admin account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container create-admin">
      <div className="row w-100">
        <div className="col-lg-6 col-md-12">
          <h2 className="create-admin__title">Create New Admin Account</h2>

          <form onSubmit={handleSubmit} className="create-admin__form">
            <div className="row">
              <div className="col-12 mb-3 create-admin__group">
                <label>Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={e => handleChange('username', e.target.value)}
                  required
                />
              </div>

              <div className="col-12 mb-3 create-admin__group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="col-12 mb-3 create-admin__group">
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
                  <p className="create-admin__message">{message}</p>
                </div>
              )}

              <div className="col-12">
                <button
                  type="submit"
                  className="create-admin__button primary-btn w-100"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Admin'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAdmin;
