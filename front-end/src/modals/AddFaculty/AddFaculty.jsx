// // import React, { useState } from 'react';
// // import api from '../../http-common';
// // import './AddFaculty.scss';

// // const AddFaculty = ({ onClose, onAdd }) => {
// //   const [formData, setFormData] = useState({ name: '', description: '' });
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(false);

// //   const handleChange = (field, value) => {
// //     setFormData(prev => ({ ...prev, [field]: value }));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!formData.name.trim()) {
// //       return setError('Faculty name is required.');
// //     }

// //     setLoading(true);
// //     setError('');

// //     try {
// //       await api.post('/university/profile/Add-faculties', formData);
// //       onAdd();   // Refresh faculty list
// //       onClose(); // Close modal
// //     } catch (err) {
// //       console.error('❌ Error adding faculty:', err);
// //       setError('Failed to add faculty.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="add-faculty-modal">
// //       <div className="add-faculty-modal__overlay" onClick={onClose} />
// //       <div className="add-faculty-modal__box">
// //         <h2 className="add-faculty-modal__title">Add New Faculty</h2>
// //         <form onSubmit={handleSubmit} className="add-faculty-modal__form">
// //           <div className="add-faculty-modal__group">
// //             <label>Name</label>
// //             <input
// //               type="text"
// //               value={formData.name}
// //               onChange={e => handleChange('name', e.target.value)}
// //               placeholder="Enter faculty name"
// //               required
// //             />
// //           </div>

// //           <div className="add-faculty-modal__group">
// //             <label>Description</label>
// //             <textarea
// //               value={formData.description}
// //               onChange={e => handleChange('description', e.target.value)}
// //               placeholder="Enter description (optional)"
// //             />
// //           </div>

// //           {error && <p className="add-faculty-modal__error">{error}</p>}

// //           <div className="add-faculty-modal__buttons">
// //             <button type="submit" disabled={loading}>
// //               {loading ? 'Adding...' : 'Add'}
// //             </button>
// //             <button type="button" onClick={onClose} className="cancel">
// //               Cancel
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AddFaculty;



// import React, { useState, useEffect } from 'react';
// import api from '../../http-common';
// import './AddFaculty.scss';
// import '../../styles/style.scss'

// const AddFaculty = ({ onClose, onAdd, faculty }) => {
//   const [formData, setFormData] = useState({ name: '', description: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (faculty) {
//       setFormData({
//         name: faculty.name || '',
//         description: faculty.description || '',
//       });
//     }
//   }, [faculty]);

//   const handleChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.name.trim()) {
//       return setError('Faculty name is required.');
//     }

//     setLoading(true);
//     setError('');

//     try {
//       if (faculty) {
//         await api.put(`/university/profile/Update-faculties/${faculty.id}`, formData);
//       } else {
//         await api.post('/university/profile/Add-faculties', formData);
//       }
//       onAdd();
//       onClose();
//     } catch (err) {
//       console.error('❌ Error saving faculty:', err);
//       setError('Failed to save faculty.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="add-faculty">
//       <div className="add-faculty__overlay" onClick={onClose} />
//       <div className="add-faculty__box">
//         <h2 className="add-faculty__title">{faculty ? 'Edit Faculty' : 'Add New Faculty'}</h2>
//         <form onSubmit={handleSubmit} className="add-faculty__form">
//           <div className="add-faculty__group">
//             <label>Name</label>
//             <input
//               type="text"
//               value={formData.name}
//               onChange={e => handleChange('name', e.target.value)}
//               placeholder="Enter faculty name"
//               required
//             />
//           </div>

//           <div className="add-faculty__group">
//             <label>Description</label>
//             <textarea
//               value={formData.description}
//               onChange={e => handleChange('description', e.target.value)}
//               placeholder="Enter description (optional)"
//             />
//           </div>

//           {error && <p className="add-faculty__error">{error}</p>}

//           <div className="row w-100 justify-content-center align-content-center add-faculty__buttons">
//             <div className="col-6">
//             <button type="submit" className="primary-btn w-100" disabled={loading}>
//               {loading ? (faculty ? 'Updating...' : 'Adding...') : faculty ? 'Update' : 'Add'}
//             </button>

//             </div>
//             <div className="col-6">
//             <button type="button" onClick={onClose} className="primary-btn cancel w-100">
//               Cancel
//             </button>

//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddFaculty;



import React, { useState, useEffect } from 'react';
import api from '../../http-common';
import './AddFaculty.scss';
import '../../styles/style.scss';


const AddFaculty = ({ onClose, onAdd, faculty }) => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (faculty) {
      setFormData({
        name: faculty.name || '',
        description: faculty.description || '',
      });
    }
  }, [faculty]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return setError('Faculty name is required.');
    }

    setLoading(true);
    setError('');

    try {
      if (faculty) {
        await api.put(`/university/profile/Update-faculties/${faculty.id}`, formData);
      } else {
        await api.post('/university/profile/Add-faculties', formData);
      }
      onAdd();
      onClose();
    } catch (err) {
      console.error('❌ Error saving faculty:', err);
      setError('Failed to save faculty.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-faculty">
      <div className="add-faculty__overlay" onClick={onClose} />
      <div className="add-faculty__box">
        <h2 className="add-faculty__title">
          {faculty ? 'Edit Faculty' : 'Add New Faculty'}
        </h2>

        <form onSubmit={handleSubmit} className="add-faculty__form">
          <div className="add-faculty__group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="Enter faculty name"
              required
            />
          </div>

          <div className="add-faculty__group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Enter description (optional)"
            />
          </div>

          {error && <p className="add-faculty__error">{error}</p>}

          <div className="row add-faculty__buttons">
            <div className="col-6">
              <button type="submit" className='primary-btn' disabled={loading}>
                {loading
                  ? faculty
                    ? 'Updating...'
                    : 'Adding...'
                  : faculty
                  ? 'Update'
                  : 'Add'}
              </button>
            </div>
            <div className="col-6">
              <button type="button" onClick={onClose} className=" primary-btn cancel">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFaculty;
