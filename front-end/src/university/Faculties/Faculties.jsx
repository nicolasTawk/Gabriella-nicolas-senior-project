import React, { useEffect, useState } from 'react';
import api from '../../http-common';
import Loader from '../../context/Loader/Loader';
import AddFaculty from '../../modals/AddFaculty/AddFaculty';
import './Faculties.scss';

const Faculties = () => {
  const [faculties, setFaculties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchFaculties = async () => {
    setLoading(true);
    try {
      console.log('📡 Fetching university faculties...');
      const res = await api.get('/university/faculties');
      setFaculties(res.data.faculties || []);
      console.log('✅ Faculties:', res.data.faculties.length);
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

  const filteredFaculties = faculties.filter(fac =>
    fac.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="university-faculties">
      <div className="university-faculties__header">
        <input
          className="university-faculties__search"
          type="text"
          placeholder="Search faculties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="university-faculties__add-btn"
          onClick={() => setModalOpen(true)}
        >
          + Add Faculty
        </button>
      </div>

      {loading && <Loader />}
      {error && <p className="university-faculties__error">{error}</p>}

      {!loading && !error && (
        <table className="university-faculties__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredFaculties.length > 0 ? (
              filteredFaculties.map((fac) => (
                <tr key={fac.id}>
                  <td>{fac.name}</td>
                  <td>{fac.description || '—'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="university-faculties__empty">
                  No faculties found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <AddFaculty
          onClose={() => setModalOpen(false)}
          onAdd={fetchFaculties}
        />
      )}
    </div>
  );
};

export default Faculties;
