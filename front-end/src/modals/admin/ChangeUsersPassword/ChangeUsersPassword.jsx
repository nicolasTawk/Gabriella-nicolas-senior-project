import React, { useState } from 'react';
import api from '../../../http-common';
import './ChangeUsersPassword.scss';

const ChangeUsersPassword = ({ userId, onClose, onSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.put(`/admin/users/${userId}/password`, {
        password: newPassword,
      });

      setMessage('Password changed successfully!');
      setNewPassword('');
      setConfirmPassword('');
      if (onSuccess) onSuccess();
    } catch {
      setMessage('Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-modal" onClick={onClose}>
      <div
        className="change-password-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="change-password-modal__title">Change Password</h3>

        <form className="change-password-modal__form" onSubmit={handleSubmit}>
          <label className="change-password-modal__label" htmlFor="new-password">
            New Password
          </label>
          <input
            id="new-password"
            className="change-password-modal__input"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={5}
            required
          />

          <label className="change-password-modal__label" htmlFor="confirm-password">
            Confirm New Password
          </label>
          <input
            id="confirm-password"
            className="change-password-modal__input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={5}
            required
          />

          {message && (
            <p className="change-password-modal__message">{message}</p>
          )}

          <div className="change-password-modal__actions">
            <button
              type="submit"
              disabled={loading}
              className="change-password-modal__btn change-password-modal__btn--primary"
            >
              {loading ? 'Saving...' : 'Change Password'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="change-password-modal__btn change-password-modal__btn--secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeUsersPassword;
