import React, { useState } from 'react';
import api from '../../http-common';
import './ChangePassword.scss';

const ChangePasswordModal = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('❌ New passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await api.put('/users/me/change-password', {
        old_password: oldPassword,
        new_password: newPassword
      });
      setMessage('✅ Password changed successfully.');
      // brief delay so user sees the success message
      setTimeout(onClose, 800);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.error || 'Failed to change password.';
      setMessage(`❌ ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-bg">
      <div className="modal-box">
        <h5 className="modal-box__title">Change Password</h5>
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          disabled={loading}
        />
        {message && <p className="modal-box__message">{message}</p>}
        <div className="modal-box__actions">
          <button
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Changing…' : 'Change Password'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
