


// import React, { useState, useEffect } from 'react';
// import './Universities.scss';
// import { FaSearch } from 'react-icons/fa';
// import Loader from '../../common/Loader/Loader';
// import api from '../../http-common';

// const Universities = () => {
//   const [universities, setUniversities] = useState([]);
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(true);

//   const fetchUniversities = async () => {
//     try {
//       const res = await api.get('/public/universities');
//       setUniversities(res.data.universities || []);
//     } catch (err) {
//       console.error('❌ Error loading universities:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUniversities();
//   }, []);

//   const filteredUniversities = universities.filter((uni) =>
//     uni.name.toLowerCase().includes(search.toLowerCase())
//   );

//   if (loading) return <Loader />;

//   return (
//     <div className="universities__container">
//       {/* Search Bar */}
//       <div className="universities__search-wrapper">
//         <div className="universities__search-group">
//           <FaSearch className="universities__icon" />
//           <input
//             type="text"
//             className="universities__input"
//             placeholder="Search universities..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* University Cards */}
//       <div className="row g-4">
//         {filteredUniversities.length > 0 ? (
//           filteredUniversities.map((uni) => (
//             <div className="col-sm-6 col-md-4 col-lg-3" key={uni.id}>
//               <div className="universities__card">
//                 <img
//                   src={uni.logo_url || 'https://via.placeholder.com/300x180?text=University'}
//                   alt={uni.name}
//                 />
//                 <h5 className="universities__card-title">{uni.name}</h5>
//                 <p className="universities__card-location">{uni.location}</p>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="col-12 text-center text-muted">No universities found.</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Universities;




import React, { useState, useEffect } from 'react';
import api from '../../http-common';
import Loader from '../../common/Loader/Loader';
import SearchBar from '../../common/SearchBar/SearchBar';
import './Universities.scss';
import defaultImage from '../../util/images/university-default-logo.png'; // your fallback image

const Universities = () => {
  const [universities, setUniversities] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUniversities = async () => {
    try {
      const res = await api.get('/public/universities');
      setUniversities(res.data.universities || []);
    } catch (err) {
      console.error('❌ Error fetching universities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  const filteredUniversities = universities.filter((uni) =>
    uni.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="universities__container">
          <h2 className="universities__title">Explore Universities</h2> {/* Page Title */}

      <div className="universities__search-wrapper">
        <SearchBar
          placeholder="Search universities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="row g-4">
        {filteredUniversities.length > 0 ? (
          filteredUniversities.map((uni) => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={uni.id}>
              <div className="universities__card">
                <img
                  src={uni.logo_url || defaultImage}
                  alt={uni.name}
                  className="universities__card-img"
                />
                <h5 className="universities__card-title">{uni.name}</h5>
                <p className="universities__card-location">{uni.location}</p>
              </div>
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
