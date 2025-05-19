// src/university/Majors/Majors.jsx
import React, { useEffect, useState } from 'react';
import api from '../../http-common';
import Loader from '../../common/Loader/Loader';
import AddMajor from '../../modals/university/AddMajor/AddMajor';
import { Pencil, Trash } from 'lucide-react';
import SearchBar from '../../common/SearchBar/SearchBar';
import './Majors.scss';

const Majors = () => {
  const [faculties, setFaculties]   = useState([]);
  const [majors, setMajors]         = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [modalOpen, setModalOpen]   = useState(false);
  const [editMajor, setEditMajor]   = useState(null);

  const fetchMajors = async () => {
    setLoading(true);
    try {
      // 1. load faculties
      const { data: facData } = await api.get('/university/faculties');
      const facs = facData.faculties || [];
      setFaculties(facs);

      // 2. load majors for each faculty
      const lists = await Promise.all(
        facs.map((f) =>
          api.get(`/university/faculties/${f.id}/majors`).then((res) =>
            (res.data.majors || []).map((m) => ({
              ...m,
              facultyName: f.name,
              facultyId: f.id,
            }))
          )
        )
      );

      setMajors(lists.flat());
      setError('');
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

  const handleDelete = async (m) => {
    if (!window.confirm('Are you sure you want to delete this major?'))
      return;
    try {
      await api.delete(
        `/university/faculties/${m.facultyId}/majors/${m.id}`
      );
      fetchMajors();
    } catch (err) {
      console.error('❌ Error deleting major:', err);
    }
  };

  const filteredMajors = majors.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="major">
      <div className="row major__header g-3 mb-4">
        <div className="col-md-5 col-sm-6 col-12">
          <SearchBar
            className="search"
            placeholder="Search majors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-7 col-sm-6 col-12 text-end">
          <button
            className="major__add-btn primary-btn"
            onClick={() => {
              setEditMajor(null);
              setModalOpen(true);
            }}
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
                <th>Code</th>
                <th># Credits</th>
                <th>Annual Fee</th>
                <th>Faculty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMajors.length > 0 ? (
                filteredMajors.map((m) => (
                  <tr key={`${m.facultyId}-${m.id}`}>
                    <td>{m.name}</td>
                    <td>{m.code}</td>
                    <td>{m.number_of_credits}</td>
                    <td>{m.tuition_fee}</td>
                    <td>{m.facultyName}</td>
                    <td>
                      <div className="major__actions">
                        <Pencil
                          size={18}
                          className="major__icon edit"
                          onClick={() => {
                            setEditMajor(m);
                            setModalOpen(true);
                          }}
                        />
                        <Trash
                          size={18}
                          className="major__icon delete"
                          onClick={() => handleDelete(m)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="major__empty">
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
          onAdd={fetchMajors}
        />
      )}
    </div>
  );
};

export default Majors;
