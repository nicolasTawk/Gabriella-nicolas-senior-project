// src/user/Universities/Information/MajorsList/MajorsList.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaFilter, FaStar, FaRegStar } from 'react-icons/fa';
import api from '../../http-common';
import Loader from '../../common/Loader/Loader';
import SearchBar from '../../common/SearchBar/SearchBar';
import './MajorsList.scss';

export default function MajorsList() {
  const [universities, setUniversities] = useState([]);
  const [selectedUni, setSelectedUni]   = useState('');
  const [majors, setMajors]             = useState([]);
  const [searchTerm, setSearchTerm]     = useState('');
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [sortAlpha, setSortAlpha]       = useState(false);
  const [favorites, setFavorites]       = useState(new Set());
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [filterOpen, setFilterOpen]     = useState(false);
  const filterRef = useRef();

  // load universities for dropdown
  useEffect(() => {
    api.get('/public/universities')
      .then(res => {
        const list = res.data.universities || [];
        setUniversities(list);
        if (list.length) {
          setSelectedUni(String(list[0].user_id));
        }
      })
      .catch(() => setError('Could not load universities.'))
      .finally(() => setLoading(false));
  }, []);

  // load majors whenever selectedUni changes
  useEffect(() => {
    if (!selectedUni) return;
    setLoading(true);
    api.get(`/public/universities/${selectedUni}/majors`)
      .then(res => setMajors(res.data.majors || []))
      .catch(() => setError('Could not load majors.'))
      .finally(() => setLoading(false));
  }, [selectedUni]);

  // close dropdown on outside click
  useEffect(() => {
    const onClick = e => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const toggleFav = async majorName => {
    // you can hook these up to your backend endpoints if available
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(majorName) ? next.delete(majorName) : next.add(majorName);
      return next;
    });
  };

  // apply search, favorites filter, then optional sort
  let filtered = majors.filter(m =>
    m.major.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!showFavsOnly || favorites.has(m.major))
  );

  if (sortAlpha) {
    filtered = [...filtered].sort((a, b) =>
      a.major.localeCompare(b.major)
    );
  }

  if (loading) return <Loader />;
  if (error)   return <p className="major-list__error text-center">{error}</p>;

  return (
    <div className="major-list py-4">

      <h2 className="major-list__title mb-4">All Majors</h2>

      {/* Controls: select | search + filter */}
      <div className="row align-items-center g-3 mb-4">
        <div className="col-12 col-md-4">
          <select
            className="major-list__select"
            value={selectedUni}
            onChange={e => setSelectedUni(e.target.value)}
          >
            {universities.map(u => (
              <option key={u.user_id} value={u.user_id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-4 offset-md-4 d-flex justify-content-end align-items-center">
          <div className="major-list__search-wrapper">
            <SearchBar
              placeholder="Search majors…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="major-list__filter" ref={filterRef}>
            <button
              className={`major-list__filter-btn ${filterOpen ? 'major-list__filter-btn--active' : ''}`}
              onClick={() => setFilterOpen(f => !f)}
              aria-label="Filter options"
            >
              <FaFilter />
            </button>
            {filterOpen && (
              <ul className="major-list__filter-menu">
                <li
                  className="major-list__filter-item"
                  onClick={() => {
                    setShowFavsOnly(f => !f);
                    setFilterOpen(false);
                  }}
                >
                  {showFavsOnly ? 'Show All' : 'Favorites Only'}
                </li>
                <li
                  className="major-list__filter-item"
                  onClick={() => {
                    setSortAlpha(s => !s);
                    setFilterOpen(false);
                  }}
                >
                  {sortAlpha ? 'Unsort' : 'Sort A → Z'}
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="major-list__table-wrapper">
        <table className="major-list__table w-100">
          <thead>
            <tr>
              <th>Major</th>
              <th>Faculty</th>
              <th>Credits</th>
              <th>Tuition</th>
              {/* <th className="text-center">Fav</th> */}
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((m, i) => (
                <tr key={i} className="major-list__row">
                  <td>{m.major}</td>
                  <td>{m.facultyName}</td>
                  <td>{m.number_of_credits}</td>
                  <td>${m.tuition_fee}</td>
                  {/* <td className="text-center">
                    {favorites.has(m.major) ? (
                      <FaStar
                        className="major-list__star major-list__star--filled"
                        onClick={() => toggleFav(m.major)}
                      />
                    ) : (
                      <FaRegStar
                        className="major-list__star"
                        onClick={() => toggleFav(m.major)}
                      />
                    )}
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="major-list__empty">
                  No majors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
