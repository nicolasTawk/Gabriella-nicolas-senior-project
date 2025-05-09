import React from 'react';
import './ChangePassword.scss';

const ChangePasswordModal = ({
  oldPassword,
  newPassword,
  confirmPassword,
  setOldPassword,
  setNewPassword,
  setConfirmPassword,
  onCancel,
  onSubmit
}) => {
  return (
    <div className="modal-bg">
      <div className="modal-box">
        <h5 className="mb-3">Change Password</h5>
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="modal-actions mt-3">
          <button className="btn btn-secondary me-2" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={onSubmit}>
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
