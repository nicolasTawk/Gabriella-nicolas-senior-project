import React, { useState } from 'react';
import api from '../../http-common';
import './AddProfile.scss';
import defaultLogo from '../../util/images/logo.png'; // 👈 fallback image

const AddProfile = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    about: '',
    phone: '',
    established_date: '',
    location: '',
    contact_email: '',
    accreditation: ''
  });

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(defaultLogo);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(defaultLogo);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    if (image) data.append('image', image);

    try {
      const res = await api.post('/university/Add-profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSuccess(res.data.createdProfile);
    } catch (err) {
      console.error('❌ Failed to create profile:', err);
      setError('❌ Could not create profile. Please try again.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Create Profile</h3>
        <form onSubmit={handleSubmit}>
          {[
            { label: 'Name', field: 'name' },
            { label: 'Website', field: 'website' },
            { label: 'About', field: 'about', isTextarea: true },
            { label: 'Phone', field: 'phone' },
            { label: 'Established Date', field: 'established_date', type: 'date' },
            { label: 'Location', field: 'location' },
            { label: 'Contact Email', field: 'contact_email' },
            { label: 'Accreditation', field: 'accreditation' }
          ].map(({ label, field, type, isTextarea }) => (
            <div className="form-group" key={field}>
              <label>{label}</label>
              {isTextarea ? (
                <textarea value={formData[field]} onChange={e => handleChange(field, e.target.value)} />
              ) : (
                <input type={type || 'text'} value={formData[field]} onChange={e => handleChange(field, e.target.value)} />
              )}
            </div>
          ))}

          <div className="form-group">
            <label>University Logo</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <div className="text-center mt-3">
              <img
                src={previewUrl}
                alt="Logo Preview"
                style={{ maxWidth: '100%', borderRadius: '8px', boxShadow: '0 0 6px rgba(0,0,0,0.1)' }}
              />
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="modal-buttons">
            <button type="submit" className="btn btn-save">Save</button>
            <button type="button" className="btn btn-delete" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProfile;
