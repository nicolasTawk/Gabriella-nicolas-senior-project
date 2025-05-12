import React, { useEffect, useState } from 'react';
import api from '../../http-common';
import Loader from '../../context/Loader/Loader';
import './ListUniversities.scss';

const Universities = () => {
  const [universities, setUniversities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        console.log('🌐 Fetching from /public/universities...');
        const res = await api.get('/public/universities');
        console.log('✅ Received universities:', res.data.universities);
        setUniversities(res.data.universities || []);
      } catch (err) {
        console.error('❌ Error fetching universities:', err);
        setError('Failed to load universities.');
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  const filtered = universities.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-universities">
      <div className="admin-universities__header">
        <h2 className="admin-universities__title">All Universities</h2>
        <input
          type="text"
          className="admin-universities__search"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <Loader />}
      {error && <p className="admin-universities__error">{error}</p>}

      {!loading && !error && (
        <table className="admin-universities__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Website</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((uni) => (
                <tr key={uni.user_id}>
                  <td>{uni.name}</td>
                  <td>{uni.location || '—'}</td>
                  <td>
                    {uni.website ? (
                      <a href={uni.website} target="_blank" rel="noreferrer">
                        {uni.website}
                      </a>
                    ) : '—'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="admin-universities__empty">
                  No universities found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Universities;
