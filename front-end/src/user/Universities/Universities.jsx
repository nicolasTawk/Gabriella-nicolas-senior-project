
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar, FaFilter } from 'react-icons/fa';
import api from '../../http-common';
import Loader from '../../common/Loader/Loader';
import SearchBar from '../../common/SearchBar/SearchBar';
import defaultImage from '../../util/images/university-default-logo.png';
import './Universities.scss';

const Universities = () => {
  const [universities, setUniversities] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch universities
        const uniRes = await api.get('/public/universities');
        setUniversities(uniRes.data.universities || []);

        // Fetch favorites for current user
        const favRes = await api.get('/favoring/favorites');
        // Store favorites as a Set of university IDs for quick lookup
        const favSet = new Set(favRes.data.favorites.map(f => f.university.id));
        setFavorites(favSet);
      } catch (err) {
        console.error('❌ Error fetching universities or favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleFavorite = async (uniId) => {
    if (favorites.has(uniId)) {
      // Remove favorite
      try {
        await api.delete(`/favoring/favorites/${uniId}`);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(uniId);
          return newSet;
        });
      } catch (err) {
        console.error('Failed to remove favorite:', err);
      }
    } else {
      // Add favorite
      try {
        await api.post(`/favoring/favorites/${uniId}`);
        setFavorites(prev => new Set(prev).add(uniId));
      } catch (err) {
        console.error('Failed to add favorite:', err);
      }
    }
  };

  // Combine filters: search and favorites
  const filtered = universities.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase());
    const matchesFavorite = showFavoritesOnly ? favorites.has(u.user_id) : true;
    return matchesSearch && matchesFavorite;
  });

  if (loading) return <Loader />;

  return (
    <div className="universities__container  py-4">
      <h2 className="universities__title text-start mb-4">Explore Universities</h2>

      <div className="row justify-content-start mb-4 align-items-center">
        <div className="col-9 col-md-5">
          <SearchBar
            placeholder="Search universities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="col-2 col-md-3 text-md-start mt-3 mt-md-0">
  <button
    className={`universities__favorite-filter-btn ${
      showFavoritesOnly ? 'universities__favorite-filter-btn--active' : ''
    }`}
    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
    aria-pressed={showFavoritesOnly}
    aria-label={showFavoritesOnly ? 'Show all universities' : 'Filter favorites only'}
    title={showFavoritesOnly ? 'Show all universities' : 'Show favorites only'}
  >
    <FaFilter size={20} />
  </button>
</div>
      </div>

      <div className="row g-4">
        {filtered.length > 0 ? (
          filtered.map(uni => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={uni.user_id}>
              <Link to={`/universities/${uni.user_id}`} className="universities__card-link">
                <div className="universities__card">
                  <img
                    src={uni.logo_url || defaultImage}
                    alt={uni.name}
                    className="universities__card-img"
                  />
                  <h5 className="universities__card-title">{uni.name}</h5>
                  <p className="universities__card-location">{uni.location}</p>

                  {/* Favorite Star */}
                  <button
                    className="universities__favorite-btn"
                    type="button"
                    onClick={e => {
                      e.preventDefault(); // Prevent link navigation
                      toggleFavorite(uni.user_id);
                    }}
                    aria-label={favorites.has(uni.user_id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {favorites.has(uni.user_id) ? (
                      <FaStar className="universities__favorite-icon universities__favorite-icon--filled" />
                    ) : (
                      <FaRegStar className="universities__favorite-icon" />
                    )}
                  </button>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="col-12 text-center text-muted">No universities found.</div>
        )}
      </div>
    </div>
  );
};

export default Universities;
