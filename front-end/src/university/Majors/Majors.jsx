import React, { useEffect, useState } from 'react';
import api from '../../http-common';
import Loader from '../../common/Loader/Loader';
import AddMajor from '../../modals/university/AddMajor/AddMajor';
import SearchBar from '../../common/SearchBar/SearchBar';
import './Majors.scss';

const Majors = () => {
  const [faculties, setFaculties] = useState([]);
  const [majors, setMajors]       = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editMajor, setEditMajor] = useState(null);

  // Fetch all faculties, then all their majors
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: facData } = await api.get('/university/faculties');
      const facs = facData.faculties || [];
      setFaculties(facs);

      // fetch majors for each faculty in parallel
      const lists = await Promise.all(
        facs.map(f =>
          api
            .get(`/university/faculties/${f.id}/majors`)
            .then(res =>
              (res.data.majors || []).map(m => ({
                ...m,
                facultyName: f.name,
                facultyId: f.id
              }))
            )
        )
      );
      setMajors(lists.flat());
      setError('');
    } catch {
      setError('Failed to load majors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (m) => {
    if (!window.confirm('Delete this major?')) return;
    try {
      await api.delete(
        `/university/faculties/${m.facultyId}/majors/${m.id}`
      );
      fetchData();
    } catch {
      console.error('Error deleting major');
    }
  };

  const filtered = majors.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="major">
      <div className="row major__header g-3 mb-4">
        <div className="col-md-6 col-sm-8 col-12">
          <SearchBar
            placeholder="Search majors..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6 col-sm-4 col-12 text-end">
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
            <thead>
              <tr>
                <th>Name</th>
                <th>Faculty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map(m => (
                  <tr key={`${m.facultyId}-${m.id}`}>
                    <td>{m.name}</td>
                    <td>{m.facultyName}</td>
                    <td className="major__actions">
                      <button
                        className="icon-btn edit"
                        onClick={() => { setEditMajor(m); setModalOpen(true); }}
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-btn delete"
                        onClick={() => handleDelete(m)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="major__empty">
                    No majors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <AddMajor
          major={editMajor}
          faculties={faculties}
          onClose={() => setModalOpen(false)}
          onAdd={fetchData}
        />
      )}
    </div>
  );
};

export default Majors;
