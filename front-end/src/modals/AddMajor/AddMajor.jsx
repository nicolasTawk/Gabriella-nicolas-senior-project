import React, { useState, useEffect } from 'react';
import api from '../../http-common';
import './AddMajor.scss';

const AddMajor = ({ onClose, onAdd, faculty }) => {
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (faculty) {
      setFormData({
        name: faculty.name || '',
        code: faculty.code || '',
        description: faculty.description || '',
      });
    }
  }, [faculty]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return setError('Faculty name is required.');

    setLoading(true);
    setError('');

    try {
      if (faculty) {
        await api.put(`/university/profile/Update-major/${faculty.faculty_id}/${faculty.id}`, formData);
      } else {
        await api.post(`/university/profile/Add-major/${faculty.faculty_id}`, formData);
      }
      onAdd();
      onClose();
    } catch (err) {
      console.error('❌ Error saving major:', err);
      setError('Failed to save major.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-faculty-modal">
      <div className="add-faculty-modal__overlay" onClick={onClose} />
      <div className="add-faculty-modal__box">
        <h2 className="add-faculty-modal__title">{faculty ? 'Edit Major' : 'Add New Major'}</h2>
        <form onSubmit={handleSubmit} className="add-faculty-modal__form">
          <div className="add-faculty-modal__group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="Enter major name"
              required
            />
          </div>

          <div className="add-faculty-modal__group">
            <label>Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={e => handleChange('code', e.target.value)}
              placeholder="Enter major code"
            />
          </div>

          <div className="add-faculty-modal__group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Enter description (optional)"
            />
          </div>

          {error && <p className="add-faculty-modal__error">{error}</p>}

          <div className="add-faculty-modal__buttons">
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? (faculty ? 'Updating...' : 'Adding...') : faculty ? 'Update' : 'Add'}
            </button>
            <button type="button" onClick={onClose} className="cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMajor;
