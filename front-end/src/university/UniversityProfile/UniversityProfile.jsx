import React, { useState, useEffect } from 'react';
import api from '../../http-common';
import Loader from '../../common/Loader/Loader';
import ChangePasswordModal from '../../modals/ChangePassword/ChangePassword';
import defaultLogo from '../../util/images/logo.png';
import './UniversityProfile.scss';

const UniversityProfile = () => {
  const [formData, setFormData] = useState({
    name: '', website: '', about: '', phone: '',
    established_date: '', location: '', contact_email: '', accreditation: ''
  });

  const [loading, setLoading] = useState(true);
  const [modalPasswordOpen, setModalPasswordOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [profileExists, setProfileExists] = useState(false);
  const [logoUrl, setLogoUrl] = useState(defaultLogo);
  const [logoFile, setLogoFile] = useState(null);

  const fetchLogo = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/university/profile/logo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Logo fetch failed');
      const blob = await res.blob();
      setLogoUrl(URL.createObjectURL(blob));
    } catch {
      setLogoUrl(defaultLogo);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/university/get-profile');
        const profile = res.data?.profile;
        if (profile) {
          setFormData({
            name: profile.name || '',
            website: profile.website || '',
            about: profile.about || '',
            phone: profile.phone || '',
            established_date: profile.established_date?.split('T')[0] || '',
            location: profile.location || '',
            contact_email: profile.contact_email || '',
            accreditation: profile.accreditation || ''
          });
          setProfileExists(true);
          await fetchLogo();
        }
      } catch {
        setProfileExists(false);
        setLogoUrl(defaultLogo);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formPayload.append(key, value);
      });
      if (logoFile) formPayload.append('image', logoFile);

      const endpoint = profileExists ? 'Update-profile' : 'Add-profile';
      const method = profileExists ? 'PUT' : 'POST';

      const res = await fetch(`http://localhost:3000/api/university/${endpoint}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formPayload
      });

      if (!res.ok) throw new Error('Save failed');

      setMessage(profileExists ? '✅ Profile updated successfully!' : '✅ Profile created successfully!');
      setProfileExists(true);

      if (logoFile) {
        await fetchLogo();
        setLogoFile(null);
      }
    } catch (err) {
      console.error('❌ Error saving profile:', err);
      setMessage('❌ Failed to save profile.');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete('/university/Delete-profile');
      localStorage.clear();
      window.location.href = '/login';
    } catch (err) {
      console.error('❌ Delete error:', err);
      setMessage('❌ Failed to delete profile.');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="profile__container" style={{ overflowY: 'auto', maxHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center sticky-top bg-white pb-2">
        <h2 className="profile__title">My University Profile</h2>
      </div>

      <div className="row p-0 profile__form mt-3 ">
        <div className="col-md-4 profile__form-logo-wrapper mb-4">
          <img src={logoUrl} alt="University Logo" />
          <input type="file" accept="image/*" onChange={handleLogoChange} className="mt-2" />
        </div>

        <div className="col-md-8 " >
          {[ 
            { label: 'About', field: 'about', isTextarea: true },
            { label: 'Name', field: 'name' },
            { label: 'Website', field: 'website' },
            { label: 'Phone Number', field: 'phone' },
            { label: 'Established Date', field: 'established_date', type: 'date' },
            { label: 'Location', field: 'location' },
            { label: 'Contact Email', field: 'contact_email' },
            { label: 'Accreditation', field: 'accreditation' }
          ].map(({ label, field, type, isTextarea }) => (
            <div className="profile__form-group" key={field}>
              <label className="profile__form-group-label">{label}</label>
              {isTextarea ? (
                <textarea
                  className="profile__form-group-textarea"
                  value={formData[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                />
              ) : (
                <input
                  className="profile__form-group-input"
                  type={type || 'text'}
                  value={formData[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        {message && <div className="col-12"><p className="profile__form-message">{message}</p></div>}
      </div>

      <div className="sticky-bottom bg-white pt-3">
        <div className="row justify-content-center align-items-center p-0">
          <div className="col-12 mb-3 mt-3 w-50">
            <button className="profile__btn profile__btn--save" onClick={handleSave}>
              {profileExists ? 'Save Changes' : 'Create Profile'}
            </button>
          </div>

          {profileExists && (
            <>
              <div className="col-12 col-md-6 mb-3">
                <button className="profile__btn profile__btn--delete" onClick={handleDelete}>
                  Delete Account
                </button>
              </div>
              <div className="col-12 col-md-6 mb-3">
                <button className="profile__btn profile__btn--password" onClick={() => setModalPasswordOpen(true)}>
                  Change Password
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {modalPasswordOpen && <ChangePasswordModal onClose={() => setModalPasswordOpen(false)} />}
    </div>
  );
};

export default UniversityProfile;
