import React, { useEffect, useState } from 'react';
import api from '../../http-common';
import Loader from '../../common/Loader/Loader';
import AddFaculty from '../../modals/university/AddFaculty/AddFaculty';
import { Pencil, Trash } from 'lucide-react';
import SearchBar from '../../common/SearchBar/SearchBar';
import './Faculties.scss';

const Faculties = () => {
  const [faculties, setFaculties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editFaculty, setEditFaculty] = useState(null);

  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const res = await api.get('/university/faculties');
      setFaculties(res.data.faculties || []);
    } catch (err) {
      console.error('❌ Error loading faculties:', err);
      setError('Failed to load faculties.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this faculty?')) return;
    try {
      await api.delete(`university/profile/Delete-faculties/${id}`);
      fetchFaculties();
    } catch (err) {
      console.error('❌ Error deleting faculty:', err);
    }
  };

  const filteredFaculties = faculties.filter(fac =>
    fac.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="faculty">
      <div className="row faculty__header g-3 mb-4">
        <div className="col-md-5 col-sm-6 col-12">
          <SearchBar className="search"
            placeholder="Search faculties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-7 col-sm-6  col-12 text-end">
          <button
            className="faculty__add-btn primary-btn"
            onClick={() => { setEditFaculty(null); setModalOpen(true); }}
          >
            + Add Faculty
          </button>
        </div>
      </div>

      {loading && <Loader />}
      {error && <p className="faculty__error">{error}</p>}

      {!loading && !error && (
        <div className="faculty__table-wrapper">
          <table className="faculty__table">
            <thead className="faculty__thead">
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaculties.length > 0 ? (
                filteredFaculties.map((fac) => (
                  <tr key={fac.id}>
                    <td>{fac.name}</td>
                    <td>{fac.description || '—'}</td>
                    <td>
                      <div className="faculty__actions">
                        <Pencil
                          size={18}
                          className="faculty__icon edit"
                          onClick={() => {
                            setEditFaculty(fac);
                            setModalOpen(true);
                          }}
                        />
                        <Trash
                          size={18}
                          className="faculty__icon delete"
                          onClick={() => handleDelete(fac.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="faculty__empty">No faculties found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <AddFaculty
          faculty={editFaculty}
          onClose={() => setModalOpen(false)}
          onAdd={fetchFaculties}
        />
      )}
    </div>
  );
};

export default Faculties;