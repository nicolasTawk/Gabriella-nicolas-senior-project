// src/user/Majors/Majors.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../../http-common';
import Loader from '../../../../common/Loader/Loader';
import SearchBar from '../../../../common/SearchBar/SearchBar';
import './MajorsList.scss';

const Majors = () => {
  const { facultyId } = useParams();
  const [majors, setMajors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const res = await api.get(`/public/faculties/${facultyId}/majors`);
        setMajors(res.data.majors || []);
      } catch (err) {
        console.error('❌ Error loading majors:', err);
        setError('Failed to load majors.');
      } finally {
        setLoading(false);
      }
    };
    fetchMajors();
  }, [facultyId]);

  const filteredMajors = majors.filter((m) => {
    const term = searchTerm.toLowerCase();
    return (
      m.name.toLowerCase().includes(term) ||
      (m.description || '').toLowerCase().includes(term)
    );
  });

  if (loading) return <Loader />;
  if (error) return <p className="majors__error text-center">{error}</p>;

  return (
    <div className="majors">
      <h2 className="majors__title">Majors</h2>

      <div className="row majors__header g-3 mb-4">
        <div className="col-md-5 col-sm-6 col-12">
          <SearchBar
            placeholder="Search majors..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="majors__table-wrapper">
        <table className="majors__table">
          <thead className="majors__thead">
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredMajors.length > 0 ? (
              filteredMajors.map((m) => (
                <tr key={m.id} className="majors__row">
                  <td>{m.name}</td>
                  <td>{m.code}</td>
                  <td>{m.description || '—'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="majors__empty">
                  No majors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Majors;
