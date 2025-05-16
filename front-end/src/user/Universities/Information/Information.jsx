// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../../../http-common';
// import Loader from '../../../common/Loader/Loader';
// import { FaArrowLeft } from 'react-icons/fa';
// import SearchBar from '../../../common/SearchBar/SearchBar';
// import defaultImage from '../../../util/images/university-default-logo.png';
// import './Information.scss';

// const Information = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState(null);
//   const [faculties, setFaculties] = useState([]);
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     Promise.all([
//       api.get(`/public/universities/${id}`),
//       api.get(`/public/universities/${id}/faculties`)
//     ])
//       .then(([pRes, fRes]) => {
//         setProfile(pRes.data.profile);
//         setFaculties(fRes.data.faculties);
//       })
//       .catch(() => setError('Could not load university details.'))
//       .finally(() => setLoading(false));
//   }, [id]);

//   if (loading) return <Loader />;
//   if (error) return <p className="uni-info__error text-center">{error}</p>;
//   const goBack = () => navigate('/universities');
//   const filtered = faculties.filter(f =>
//     f.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="uni-info ">
//          <button
//         type="button"
//         onClick={goBack}
//         className="uni-info__back-btn mb-3">
//             <FaArrowLeft className="uni-info__back-icon" />
        
//       </button>
//       <h1 className="uni-info__name mb-4">{profile.name}</h1>

//       <div className="row align-items-center mb-5">
//         <div className="col-lg-5 col-md-6 text-center">
//           <img
//             src={profile.logo_url || defaultImage}
//             alt={profile.name}
//             className="uni-info__logo mb-3"
//           />
//         </div>
//         <div className="col-lg-2 col-md-1"></div>
//         <div className="col-lg-5 col-md-5">
//           <ul className="list-unstyled uni-info__details">
//             {profile.location && <li><strong>Location:</strong> {profile.location}</li>}
//             {profile.phone && (
//               <li>
//                 <strong >Phone:</strong>{' '}
//                 <a href={`tel:${profile.phone}`}>{profile.phone}</a>
//               </li>
//             )}
//             {profile.contact_email && (
//               <li>
//                 <strong>Email:</strong>{' '}
//                 <a href={`mailto:${profile.contact_email}`}>{profile.contact_email}</a>
//               </li>
//             )}
//             {profile.website && (
//               <li>
//                 <strong>Website:</strong>{' '}
//                 <a href={profile.website} target="_blank" rel="noreferrer">
//                   {profile.website}
//                 </a>
//               </li>
//             )}
//             {profile.established_date && (
//               <li>
//                 <strong>Founded:</strong>{' '}
//                 <p>{new Date(profile.established_date).toLocaleDateString()}</p>
//               </li>
//             )}
//             {profile.accreditation && (
//               <li><strong>Accreditation:</strong>
//                 <p className='d-ruby'> {profile.accreditation}</p>
//               </li>
//             )}
//           </ul>
//         </div>
//       </div>

//       <h3 className="uni-info__section-title mb-3">Faculties</h3>
//       <div className="row mb-3 justify-content-end">
//         <div className="col-12 col-md-4">
//           <SearchBar
//             placeholder="Search faculties..."
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="table-responsive">
//         <table className="table table-hover uni-info__faculties-table">
//           <thead className="table-light">
//             <tr>
//               <th>Name</th>
//               <th>Description</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.length > 0 ? filtered.map(f => (
//               <tr
//                 key={f.id}
//                 onClick={() => navigate(`/faculties/${f.id}/majors`)}
//                 className="uni-info__faculty-row"
//               >
//                 <td>{f.name}</td>
//                 <td>{f.description || '—'}</td>
//               </tr>
//             )) : (
//               <tr>
//                 <td colSpan="2" className="text-center text-muted py-3">
//                   No faculties found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Information;



// src/user/UniversityInformation/UniversityInformation.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../http-common';
import Loader from '../../../common/Loader/Loader';
import SearchBar from '../../../common/SearchBar/SearchBar';
import { FaArrowLeft } from 'react-icons/fa';
import defaultImage from '../../../util/images/university-default-logo.png';
import './Information.scss';

const Information = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [faculties, setFaculties] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([
        api.get(`/public/universities/${id}`),
        api.get(`/public/universities/${id}/faculties`)
        ])
        .then(([profRes, facRes]) => {
            setProfile(profRes.data.profile);
            setFaculties(facRes.data.faculties);
        })
        .catch(() => setError('Could not load university details.'))
        .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Loader />;
    if (error) return <p className="uni-info__error text-center">{error}</p>;

    const filteredFaculties = faculties.filter(fac => {
        const term = searchTerm.toLowerCase();
        const nameMatch = fac.name.toLowerCase().includes(term);
        const descMatch = (fac.description || '').toLowerCase().includes(term);
        return nameMatch || descMatch;
    });

    return (
        <div className="uni-info">
        {/* Header with Back Button and Title */}
        <div className="row uni-info__header sticky-top bg-white ">
            <div className="col-12  text-start">
            <button
                type="button"
                className="uni-info__back-btn"
                onClick={() => navigate('/universities')}
            >
                <FaArrowLeft className="uni-info__back-icon" />
            </button>
            </div>
            <div className="col-12 ">
            <h1 className="uni-info__name mb-0">{profile.name}</h1>
            </div>
        </div>

        {/* Logo and Details */}
        <div className="row align-items-center mt-4 mb-5">
            <div className="col-md-5 text-center">
            <img
                src={profile.logo_url || defaultImage}
                alt={profile.name}
                className="uni-info__logo img-fluid"
            />
            </div>
            <div className="col-md-7">
            <ul className="list-unstyled uni-info__details">
                {profile.location && (
                <li><strong>Location:</strong> {profile.location}</li>
                )}
                {profile.phone && (
                <li>
                    <strong>Phone:</strong>{' '}
                    <a href={`tel:${profile.phone}`}>{profile.phone}</a>
                </li>
                )}
                {profile.contact_email && (
                <li>
                    <strong>Email:</strong>{' '}
                    <a href={`mailto:${profile.contact_email}`}>{profile.contact_email}</a>
                </li>
                )}
                {profile.website && (
                <li>
                    <strong>Website:</strong>{' '}
                    <a href={profile.website} target="_blank" rel="noreferrer">
                    {profile.website}
                    </a>
                </li>
                )}
                {profile.established_date && (
                <li><strong>Founded:</strong> {new Date(profile.established_date).toLocaleDateString()}</li>
                )}
                {profile.accreditation && (
                <li><strong>Accreditation:</strong> {profile.accreditation}</li>
                )}
            </ul>
            </div>
        </div>

        {/* Search Bar for Faculties */}
        <div className="row mb-3 justify-content-end">
            <div className="col-12 col-md-4">
            <SearchBar
                placeholder="Search faculties..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            </div>
        </div>

        {/* Faculties Table (styled like Faculty page) */}
        <div className="faculty__table-wrapper">
            <table className="faculty__table w-100">
            <thead className="faculty__thead">
                <tr>
                <th>Name</th>
                <th>Description</th>
                </tr>
            </thead>
            <tbody>
                {filteredFaculties.length > 0 ? (
                filteredFaculties.map(fac => (
                    <tr
                    key={fac.id}
                    className="faculty__row"
                    onClick={() => navigate(`/faculties/${fac.id}/majors`)}
                    >
                    <td>{fac.name}</td>
                    <td>{fac.description || '—'}</td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="2" className="faculty__empty">
                    No faculties found.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
        </div>
    );
};

export default Information;
