import React, { useState } from 'react';
import api from '../../http-common';
import './AddFaculty.scss';

const AddFaculty = ({ onClose }) => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    const payload = {
      name: formData.name,
      description: formData.description,
    };

    try {
        const res = await api.post('/university/profile/Add-faculties', payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
      console.log('✅ Faculty added:', res.data);
      onClose();
    } catch (err) {
      console.error('❌ Add Faculty error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 className="modal__title">Add New Faculty</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Faculty Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <div className="modal__actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-add" disabled={loading}>
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFaculty;
