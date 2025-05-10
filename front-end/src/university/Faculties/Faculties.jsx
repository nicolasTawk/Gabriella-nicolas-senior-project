// src/pages/Faculties/Faculties.jsx
import React, { useEffect, useState } from 'react';
import api from '../../http-common';
import AddFaculty from '../../modals/AddFaculty/AddFaculty';
import './Faculties.scss';

const Faculties = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('token');

  const fetchFaculties = async () => {
    try {
      const res = await api.get('/university/faculties', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFaculties(res.data.faculties || []);
    } catch (error) {
      console.error('❌ Failed to fetch faculties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  const handleAdd = (newFaculty) => {
    setFaculties([...faculties, newFaculty]);
  };

  const filteredFaculties = faculties.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="faculties-page container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="title">Faculties</h2>
        <button className="primary-btn" onClick={() => setShowModal(true)}>Add Faculty</button>
      </div>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search faculties..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : filteredFaculties.length === 0 ? (
        <p>No faculties found.</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredFaculties.map((faculty) => (
              <tr key={faculty.id}>
                <td>{faculty.name}</td>
                <td>{faculty.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <AddFaculty
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
};

export default Faculties;
