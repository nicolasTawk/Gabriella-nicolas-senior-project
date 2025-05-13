import React, { useEffect, useState } from 'react';
import api from '../../http-common';
import Loader from '../../common/Loader/Loader';
import AddMajor from '../../modals/AddMajor/AddMajor';
import { Pencil, Trash } from 'lucide-react';
import SearchBar from '../../common/SearchBar/SearchBar';
import './Majors.scss';

const Majors = () => {
  const [majors, setMajors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editMajor, setEditMajor] = useState(null);

  const fetchMajors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/university/profile/majors');
      setMajors(res.data.majors || []);
    } catch (err) {
      console.error('❌ Error loading majors:', err);
      setError('Failed to load majors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMajors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this major?')) return;
    try {
      await api.delete(`/university/profile/Delete-major/${id}`);
      fetchMajors();
    } catch (err) {
      console.error('❌ Error deleting major:', err);
    }
  };

  const filteredMajors = majors.filter(major =>
    major.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="major">
      <div className="row major__header g-3 mb-4">
        <div className="col-md-5 col-sm-6 col-12">
          <SearchBar
            placeholder="Search majors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-7 col-sm-6 col-12 text-end">
          <button
            className="major__add-btn primary-btn"
            onClick={() => { setEditMajor(null); setModalOpen(true); }}
          >
            + Add Major
          </button>
        </div>
      </div>

      {loading && <Loader />}
      {error && <p className="major__error">{error}</p>}

      {!loading && !error && (
        <div className="major__table-wrapper">
          <table className="major__table">
            <thead className="major__thead">
              <tr>
                <th>Name</th>
                <th>Field</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMajors.length > 0 ? (
                filteredMajors.map((major) => (
                  <tr key={major.id}>
                    <td>{major.name}</td>
                    <td>{major.field || '—'}</td>
                    <td>
                      <div className="major__actions">
                        <Pencil
                          size={18}
                          className="major__icon edit"
                          onClick={() => {
                            setEditMajor(major);
                            setModalOpen(true);
                          }}
                        />
                        <Trash
                          size={18}
                          className="major__icon delete"
                          onClick={() => handleDelete(major.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="major__empty">No majors found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <AddMajor
          major={editMajor}
          onClose={() => setModalOpen(false)}
          onAdd={fetchMajors}
        />
      )}
    </div>
  );
};

export default Majors;
