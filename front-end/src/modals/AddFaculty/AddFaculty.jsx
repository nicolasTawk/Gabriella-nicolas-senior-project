import React, { useState } from 'react';
import api from '../../http-common';
import './AddFaculty.scss';

const AddFaculty = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return setError('Faculty name is required.');
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/university/profile/Add-faculties', formData);
      onAdd();   // Refresh faculty list
      onClose(); // Close modal
    } catch (err) {
      console.error('❌ Error adding faculty:', err);
      setError('Failed to add faculty.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-faculty-modal">
      <div className="add-faculty-modal__overlay" onClick={onClose} />
      <div className="add-faculty-modal__box">
        <h2 className="add-faculty-modal__title">Add New Faculty</h2>
        <form onSubmit={handleSubmit} className="add-faculty-modal__form">
          <div className="add-faculty-modal__group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="Enter faculty name"
              required
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
            <button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add'}
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

export default AddFaculty;
