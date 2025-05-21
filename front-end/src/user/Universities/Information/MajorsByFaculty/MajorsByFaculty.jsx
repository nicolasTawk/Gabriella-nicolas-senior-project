// src/user/Universities/Information/MajorsByFaculty/MajorsByFaculty.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaStar,
  FaRegStar
} from 'react-icons/fa';
import api from '../../../../http-common';
import Loader from '../../../../common/Loader/Loader';
import SearchBar from '../../../../common/SearchBar/SearchBar';
import './MajorsByFaculty.scss';

const MajorsByFaculty = () => {
  const { id } = useParams();              // facultyId
  const navigate = useNavigate();

  const [majors, setMajors]             = useState([]);
  const [searchTerm, setSearchTerm]     = useState('');
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [favorites, setFavorites]       = useState(new Set());

  useEffect(() => {
    setLoading(true);
    api.get(`/public/faculties/${id}/majors`)
      .then(res => setMajors(res.data.majors || []))
      .catch(() => setError('Could not load majors.'))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleFavorite = (majorId) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(majorId)) next.delete(majorId);
      else next.add(majorId);
      return next;
    });
  };

  const filtered = majors.filter(m => {
    const term = searchTerm.toLowerCase();
    return (
      m.name.toLowerCase().includes(term) ||
      (m.code || '').toLowerCase().includes(term)
    );
  });

  if (loading) return <Loader />;
  if (error)   return <p className="text-center text-danger mt-4">{error}</p>;

  return (
    <div className="majors__page container py-4">
      {/* Back arrow + Search */}
      <div className="row align-items-center mb-3">
        <div className="col-2 col-sm-1">
          <button
            className="majors-by-faculty__back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <FaArrowLeft />
          </button>
        </div>
        <div className="col-10 col-sm-11">
          <SearchBar
            placeholder="Search majors..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Majors Table */}
      <div className="faculty__table-wrapper">
        <table className="faculty__table w-100">
          <thead className="faculty__thead">
            <tr>
              <th>Major</th>
              <th>Faculty</th>
              <th>Code</th>
              <th>Description</th>
              <th>Credits</th>
              {/* <th className="text-center">Fav</th> */}
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map(m => (
                <tr key={m.id} className="faculty__row">
                  <td>{m.name}</td>
                  <td>{m.facultyName}</td>
                  <td>{m.code}</td>
                  <td>{m.description || '—'}</td>
                  <td>{m.number_of_credits ?? '—'}</td>
                  {/* <td className="text-center"> */}
                    {/* <button
                      className="majors-by-faculty__fav-btn"
                      type="button"
                      onClick={() => toggleFavorite(m.id)}
                      aria-label={
                        favorites.has(m.id)
                          ? 'Remove from favorites'
                          : 'Add to favorites'
                      }
                    >
                      {favorites.has(m.id)
                        ? <FaStar className="majors-by-faculty__fav-icon majors-by-faculty__fav-icon--filled" />
                        : <FaRegStar className="majors-by-faculty__fav-icon" />
                      }
                    </button> */}
                  {/* </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="faculty__empty">
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

export default MajorsByFaculty;
