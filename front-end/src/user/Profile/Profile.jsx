import React, { useEffect, useState } from 'react';
import api from '../../http-common';
import Loader from '../../common/Loader/Loader';
import ChangePasswordModal from '../../modals/ChangePassword/ChangePassword';
import './Profile.scss';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  const userId = JSON.parse(atob(localStorage.getItem('authToken').split('.')[1]))?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/students/profile');
        const user = res.data;

        setProfile(user);
        setFormData({
          first_name: user.studentProfile.first_name || '',
          last_name: user.studentProfile.last_name || '',
          email: user.email || '',
          username: user.username || '',
          phone: user.studentProfile.phone || '',
          gender: user.studentProfile.gender || '',
          birth_date: user.studentProfile.birth_date?.split('T')[0] || '',
        });
      } catch (err) {
        console.error('❌ Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await api.put(`/users/students/updade_profile/${userId}`, formData);
      setMessage('✅ Profile updated successfully!');
    } catch (err) {
      console.error('❌ Update error:', err);
      setMessage('❌ Failed to update profile.');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete('/users/me/delete');
      localStorage.clear();
      window.location.href = '/login';
    } catch (err) {
      console.error('❌ Delete error:', err);
      setMessage('❌ Failed to delete account.');
    }
  };

  if (loading) return <Loader fullScreen={true} />;

  return (
//     <div className="profile-container">
//       <h2 className="profile-title">My Profile</h2>


//       {[
//         { label: 'First Name', field: 'first_name' },
//         { label: 'Last Name', field: 'last_name' },
//         { label: 'Email', field: 'email', readOnly: true },
//         { label: 'Username', field: 'username' },
//         { label: 'Phone', field: 'phone' },
//         { label: 'Gender', field: 'gender' },
//         { label: 'Birth Date', field: 'birth_date', type: 'date' },
//       ].map(({ label, field, readOnly, type }) => (
//         <div className="form-group" key={field}>
//           <label>{label}</label>
//           <input
//             value={formData[field]}
//             type={type || 'text'}
//             readOnly={readOnly}
//             onChange={(e) => handleChange(field, e.target.value)}
//           />
//         </div>
//       ))}

//       {message && <p className="status-message">{message}</p>}

//       <div className="row profile-btns">
//   <div className="col-12 mb-3">
//     <button className="btn btn-save w-100" onClick={handleSave}>Save Changes</button>
//   </div>

//   <div className="col-12 col-md-6 mb-3 mb-md-0">
//     <button className="btn btn-delete w-100" onClick={handleDelete}>Delete Account</button>
//   </div>
//   <div className="col-12 col-md-6">
//     <button className="btn btn-password w-100" onClick={() => setModalOpen(true)}>Change Password</button>
//   </div>
// </div>

//       {modalOpen && <ChangePasswordModal onClose={() => setModalOpen(false)} />}
//     </div>

<div className="profile-container">
  <h2 className="profile-title">My Profile</h2>

  {/* Scrollable input section */}
  <div className="profile-form">
    {[
      { label: 'First Name', field: 'first_name' },
      { label: 'Last Name', field: 'last_name' },
      { label: 'Email', field: 'email', readOnly: true },
      { label: 'Username', field: 'username' },
      { label: 'Phone', field: 'phone' },
      { label: 'Gender', field: 'gender' },
      { label: 'Birth Date', field: 'birth_date', type: 'date' },
    ].map(({ label, field, readOnly, type }) => (
      <div className="form-group" key={field}>
        <label>{label}</label>
        <input
          value={formData[field]}
          type={type || 'text'}
          readOnly={readOnly}
          onChange={(e) => handleChange(field, e.target.value)}
        />
      </div>
    ))}

    {message && <p className="status-message">{message}</p>}
  </div>

  {/* Fixed button row */}
  <div className="row profile-btns">
    <div className="col-12 mb-3">
      <button className="btn btn-save w-100" onClick={handleSave}>Save Changes</button>
    </div>
    <div className="col-12 col-md-6 mb-3 mb-md-0">
      <button className="btn btn-delete w-100" onClick={handleDelete}>Delete Account</button>
    </div>
    <div className="col-12 col-md-6">
      <button className="btn btn-password w-100" onClick={() => setModalOpen(true)}>Change Password</button>
    </div>
  </div>

  {modalOpen && <ChangePasswordModal onClose={() => setModalOpen(false)} />}
</div>

  );
};

export default Profile;
