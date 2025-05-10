import React, { useState, useEffect } from 'react';
import './Universities.scss';
import { FaSearch } from 'react-icons/fa';
import Loader from '../../context/Loader/Loader';

const dummyUniversities = [
  {
    id: 1,
    name: 'Oxford University',
    location: 'Oxford, UK',
    image: 'https://via.placeholder.com/300x180?text=Oxford'
  },
  {
    id: 2,
    name: 'Harvard University',
    location: 'Cambridge, USA',
    image: 'https://via.placeholder.com/300x180?text=Harvard'
  },
  {
    id: 3,
    name: 'University of Tokyo',
    location: 'Tokyo, Japan',
    image: 'https://via.placeholder.com/300x180?text=Tokyo'
  },
  {
    id: 4,
    name: 'University of Melbourne',
    location: 'Melbourne, Australia',
    image: 'https://via.placeholder.com/300x180?text=Melbourne'
  },
  {
    id: 5,
    name: 'University of Toronto',
    location: 'Toronto, Canada',
    image: 'https://via.placeholder.com/300x180?text=Toronto'
  },
  {
    id: 6,
    name: 'ETH Zurich',
    location: 'Zurich, Switzerland',
    image: 'https://via.placeholder.com/300x180?text=ETH+Zurich'
  },
];

const Universities = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const filteredUniversities = dummyUniversities.filter(uni =>
    uni.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  if (loading) return <Loader/>;

  return (
    <div className="universities__container">
      {/* Search Bar */}
      <div className="universities__search-wrapper">
      <div className="universities__search-group">
  <FaSearch className="universities__icon" />
  <input
    type="text"
    className="universities__input"
    placeholder="Search universities..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>
      </div>

      {/* University Cards */}
      <div className="row g-4">
        {filteredUniversities.map((uni) => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={uni.id}>
            <div className="universities__card">
              <img src={uni.image} alt={uni.name} />
              <h5 className="universities__card-title">{uni.name}</h5>
              <p className="universities__card-location">{uni.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Universities;
