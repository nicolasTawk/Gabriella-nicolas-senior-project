import React, { useEffect, useState } from 'react';
import api from '../../http-common';
import ChangeUsersPassword from '../../modals/admin/ChangeUsersPassword/ChangeUsersPassword';
import { FaBan, FaTrash, FaKey, FaUnlock } from 'react-icons/fa';
import './ListUniversities.scss';
import SearchBar from '../../common/SearchBar/SearchBar';

const Universities = () => {
  const [unis, setUnis] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [pwdModal, setPwdModal] = useState({ open: false, userId: null });

  const fetchUnis = async () => {
    try {
      const res = await api.get('/admin/universities');
      setUnis(res.data.universities);
    } catch (err) {
      console.error('Error fetching universities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnis();
  }, []);

  const handleBanToggle = async (id, approved) => {
    try {
      if (approved) {
        await api.put(`/admin/users/${id}/ban`);
      } else {
        await api.put(`/admin/users/${id}/unban`);
      }
      fetchUnis();
    } catch (err) {
      console.error('Error toggling ban:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this account?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUnis();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const filtered = unis.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="universities">
      <div className="universities__header row g-3 mb-4 align-items-center">
      <h2 className="universities__title">List of Universities</h2>

        <div className="col-md-5 col-sm-6 col-12">
          <div className="universities__search-group">
          <SearchBar
            placeholder="Search Universities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="universities__table-wrapper">
          <table className="universities__table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Approved?</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((u) => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.approved ? 'Yes' : 'No'}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="universities__actions">
                      <button
                        className="icon-btn ban"
                        onClick={() => handleBanToggle(u.id, u.approved)}
                        title={u.approved ? 'Ban' : 'Unban'}
                      >
                        {u.approved ? <FaBan /> : <FaUnlock />}
                      </button>
                      <button
                        className="icon-btn password"
                        onClick={() => setPwdModal({ open: true, userId: u.id })}
                        title="Change Password"
                      >
                        <FaKey />
                      </button>
                      <button
                        className="icon-btn delete"
                        onClick={() => handleDelete(u.id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="universities__empty">
                    No universities found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {pwdModal.open && (
        <ChangeUsersPassword
          userId={pwdModal.userId}
          onClose={() => setPwdModal({ open: false, userId: null })}
          onSuccess={fetchUnis}
        />
      )}
    </div>
  );
};

export default Universities;
