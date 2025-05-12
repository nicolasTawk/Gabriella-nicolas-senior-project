// import React, { useState, useEffect } from 'react';
// import api from '../../http-common';
// import Loader from '../../context/Loader/Loader';
// import ChangePasswordModal from '../../modals/ChangePassword/ChangePassword';
// import './Profile.scss';

// const UniversityProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await api.get('/university/get-profile');
//         const uni = res.data.profile;
//         setProfile(uni);
//         setFormData({
//           name:             uni.name             || '',
//           website:          uni.website          || '',
//           about:            uni.about            || '',
//           phone:            uni.phone            || '',
//           established_date: uni.established_date?.split('T')[0] || '',
//           location:         uni.location         || '',
//           contact_email:    uni.contact_email    || '',
//           accreditation:    uni.accreditation    || '',
//         });
//       } catch (err) {
//         console.error('❌ Error fetching university profile:', err);
//         setMessage('❌ Could not load profile.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, []);

//   const handleChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSave = async () => {
//     try {
//       await api.put('/university/Update-profile', formData);
//       setMessage('✅ Profile updated successfully!');
//     } catch (err) {
//       console.error('❌ Update error:', err);
//       setMessage('❌ Failed to update profile.');
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await api.delete('/university/Delete-profile');
//       localStorage.clear();
//       window.location.href = '/login';
//     } catch (err) {
//       console.error('❌ Delete error:', err);
//       setMessage('❌ Failed to delete profile.');
//     }
//   };

//   if (loading) return <Loader fullScreen />;

//   return (
//     <div className="profile-container">
//       <h2 className="profile-title">My University Profile</h2>

//       <div className="profile-form">
//         {[
//           { label: 'Name',              field: 'name' },
//           { label: 'Website',           field: 'website' },
//           { label: 'About',             field: 'about',            isTextarea: true },
//           { label: 'Phone',             field: 'phone' },
//           { label: 'Established Date',  field: 'established_date', type: 'date' },
//           { label: 'Location',          field: 'location' },
//           { label: 'Contact Email',     field: 'contact_email' },
//           { label: 'Accreditation',     field: 'accreditation' },
//         ].map(({ label, field, type, isTextarea }) => (
//           <div className="form-group" key={field}>
//             <label>{label}</label>
//             {isTextarea ? (
//               <textarea
//                 value={formData[field]}
//                 onChange={e => handleChange(field, e.target.value)}
//               />
//             ) : (
//               <input
//                 type={type || 'text'}
//                 value={formData[field]}
//                 onChange={e => handleChange(field, e.target.value)}
//               />
//             )}
//           </div>
//         ))}

//         {message && <p className="status-message">{message}</p>}
//       </div>

//       <div className="row profile-btns">
//         <div className="col-12 mb-3">
//           <button className="btn btn-save w-100" onClick={handleSave}>
//             Save Changes
//           </button>
//         </div>
//         <div className="col-12 col-md-6 mb-3 mb-md-0">
//           <button className="btn btn-delete w-100" onClick={handleDelete}>
//             Delete Profile
//           </button>
//         </div>
//         <div className="col-12 col-md-6">
//           <button
//             className="btn btn-password w-100"
//             onClick={() => setModalOpen(true)}
//           >
//             Change Password
//           </button>
//         </div>
//       </div>

//       {modalOpen && <ChangePasswordModal onClose={() => setModalOpen(false)} />}
//     </div>
//   );
// };

// export default UniversityProfile;



import React, { useState, useEffect } from 'react';
import api from '../../http-common';
import Loader from '../../context/Loader/Loader';
import ChangePasswordModal from '../../modals/ChangePassword/ChangePassword';
import './Profile.scss';

const UniversityProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    about: '',
    phone: '',
    established_date: '',
    location: '',
    contact_email: '',
    accreditation: '',
  });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/university/get-profile');
        console.log('🎓 University profile response:', res.data);
        const uni = res.data.profile;

        if (!uni) {
          setMessage('❌ University profile not found.');
          return;
        }

        setFormData({
          name:             uni.name || '',
          website:          uni.website || '',
          about:            uni.about || '',
          phone:            uni.phone || '',
          established_date: uni.established_date?.split('T')[0] || '',
          location:         uni.location || '',
          contact_email:    uni.contact_email || '',
          accreditation:    uni.accreditation || '',
        });
      } catch (err) {
        console.error('❌ Error fetching university profile:', err);
        setMessage('❌ Could not load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await api.put('/university/Update-profile', formData);
      setMessage('✅ Profile updated successfully!');
    } catch (err) {
      console.error('❌ Update error:', err);
      setMessage('❌ Failed to update profile.');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete('/university/Delete-profile');
      localStorage.clear();
      window.location.href = '/login';
    } catch (err) {
      console.error('❌ Delete error:', err);
      setMessage('❌ Failed to delete profile.');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="profile-container">
      <h2 className="profile-title">My University Profile</h2>

      <div className="profile-form">
        {[
          { label: 'Name',              field: 'name' },
          { label: 'Website',           field: 'website' },
          { label: 'About',             field: 'about',            isTextarea: true },
          { label: 'Phone',             field: 'phone' },
          { label: 'Established Date',  field: 'established_date', type: 'date' },
          { label: 'Location',          field: 'location' },
          { label: 'Contact Email',     field: 'contact_email' },
          { label: 'Accreditation',     field: 'accreditation' },
        ].map(({ label, field, type, isTextarea }) => (
          <div className="form-group" key={field}>
            <label>{label}</label>
            {isTextarea ? (
              <textarea
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
              />
            ) : (
              <input
                type={type || 'text'}
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
              />
            )}
          </div>
        ))}

        {message && <p className="status-message">{message}</p>}
      </div>

      <div className="row profile-btns">
        <div className="col-12 mb-3">
          <button className="btn btn-save w-100" onClick={handleSave}>
            Save Changes
          </button>
        </div>
        <div className="col-12 col-md-6 mb-3 mb-md-0">
          <button className="btn btn-delete w-100" onClick={handleDelete}>
            Delete Profile
          </button>
        </div>
        <div className="col-12 col-md-6">
          <button
            className="btn btn-password w-100"
            onClick={() => setModalOpen(true)}
          >
            Change Password
          </button>
        </div>
      </div>

      {modalOpen && <ChangePasswordModal onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default UniversityProfile;

























