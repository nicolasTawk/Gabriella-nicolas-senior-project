import React, { useState, useEffect } from 'react';
import api from '../../../http-common';
import './AddMajor.scss';

const AddMajor = ({ major, faculties, onClose, onAdd }) => {
  const isEdit = Boolean(major);
  const [formData, setFormData] = useState({
    facultyId: faculties[0]?.id || '',
    name: '',
    code: '',
    number_of_credits: '',
    tuition_fee: '',
    description: ''
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {

      setFormData({
        facultyId: major.faculty_id,
        name: major.name,
        code: major.code,
        number_of_credits: major.number_of_credits,
        tuition_fee: major.tuition_fee,
        description: major.description || ''
      });
    }
  }, [major, isEdit]);
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.facultyId || !formData.name.trim() || !formData.code.trim()) {
      setError('Faculty, Name & Code are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = {
        name: formData.name,
        code: formData.code,
        number_of_credits: Number(formData.number_of_credits),
        tuition_fee: Number(formData.tuition_fee),
        description: formData.description
      };
      const url = isEdit
        ? `/university/faculties/Update-major/${formData.facultyId}/${major.id}`
        : `/university/faculties/Add-major/${formData.facultyId}`;
      await api[isEdit ? 'put' : 'post'](url, payload);
      onAdd();
      onClose();
    } catch {
      setError('Failed to save major.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-major" onClick={onClose}>
      <div className="add-major__overlay" />
      <div className="add-major__box" onClick={e => e.stopPropagation()}>
        <h2 className="add-major__title">
          {isEdit ? 'Edit Major' : 'Add New Major'}
        </h2>
        <form className="add-major__form" onSubmit={handleSubmit}>
          <div className="add-major__group">
            <label htmlFor="faculty">Faculty</label>
            <select
              id="faculty"
              name="facultyId"
              value={formData.facultyId}
              onChange={handleChange}
              required
            >
              <option value="" disabled>– Select Faculty –</option>
              {faculties.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="add-major__group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter major name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-major__group">
            <label htmlFor="code">Code</label>
            <input
              id="code"
              name="code"
              type="text"
              placeholder="Enter major code"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </div>

          <div className="add-major__group">
            <label htmlFor="credits">Number of Credits</label>
            <input
              id="credits"
              name="number_of_credits"
              type="number"
              placeholder="Enter number of credits"
              value={formData.number_of_credits}
              onChange={handleChange}
            />
          </div>

          <div className="add-major__group">
            <label htmlFor="tuition">Tuition Fee</label>
            <input
              id="tuition"
              name="tuition_fee"
              type="number"
              step="0.01"
              placeholder="Enter tuition fee"
              value={formData.tuition_fee}
              onChange={handleChange}
            />
          </div>

          <div className="add-major__group">
            <label htmlFor="desc">Description (optional)</label>
            <textarea
              id="desc"
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {error && <p className="add-major__error">{error}</p>}

          <div className="add-major__buttons">
            <button type="submit" className="primary-btn submit" disabled={loading}>
              {loading ? (isEdit ? 'Updating…' : 'Adding…') : (isEdit ? 'Update' : 'Add')}
            </button>
            <button
              type="button"
              className="cancel primary-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMajor;
