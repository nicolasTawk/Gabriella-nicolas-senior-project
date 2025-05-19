import React, { useState } from 'react';
import api from '../../http-common';
import './ChangeAdminPassword.scss';
import '../../styles/style.scss';

const ChangeAdminPassword = ({ adminId, onClose }) => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('❌ Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.put(`/admin/users/${adminId}/password`, {
        password: formData.newPassword,
      });

      setMessage('✅ Password changed successfully.');
      setFormData({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container change-admin-password">
      <div className="row w-100 justify-content-center">
        <div className="col-lg-6 col-md-12">
          <h2 className="change-admin-password__title">Change Admin Password</h2>

          <form onSubmit={handleSubmit} className="change-admin-password__form">
            <div className="row">
              <div className="col-12 mb-3 change-admin-password__group">
                <label>New Password</label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={e => handleChange('newPassword', e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="col-12 mb-3 change-admin-password__group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={e => handleChange('confirmPassword', e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {message && (
                <div className="col-12">
                  <p className="change-admin-password__message">{message}</p>
                </div>
              )}

              <div className="col-12">
                <button
                  type="submit"
                  className="change-admin-password__button primary-btn w-100"
                  disabled={loading}
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangeAdminPassword;
