import React, { useEffect, useState } from 'react';
import api from '../../http-common';
import ChangePasswordModal from '../../modals/admin/ChangePassword/ChangePassword';
import { FaSearch, FaBan, FaTrash, FaKey, FaUnlock } from 'react-icons/fa';
import './ListUniversities.scss';

const Universities = () => {
  const [unis, setUnis] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [pwdModal, setPwdModal] = useState({ open: false, userId: null });

  const fetchUnis = async () => {
    try {
      const res = await api.get('/admin/universities'); // :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}
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
        await api.put(`/admin/users/${id}/ban`); // :contentReference[oaicite:2]{index=2}:contentReference[oaicite:3]{index=3}
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

  const filtered = unis.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="universities">
      <div className="universities__header">
        <h2 className="universities__title">Universities</h2>
        <div className="universities__actions">
          <div className="universities__search-group">
            <FaSearch className="universities__icon" />
            <input
              type="text"
              className="universities__search"
              placeholder="Search universities..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
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
            {filtered.map(u => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.approved ? 'Yes' : 'No'}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="universities__btn-cell">
                  <button
                    className="universities__btn"
                    onClick={() => handleBanToggle(u.id, u.approved)}
                    title={u.approved ? 'Ban' : 'Unban'}
                  >
                    {u.approved ? <FaBan/> : <FaUnlock/>}
                  </button>
                  <button
                    className="universities__btn"
                    onClick={() => setPwdModal({ open: true, userId: u.id })}
                    title="Change Password"
                  >
                    <FaKey/>
                  </button>
                  <button
                    className="universities__btn"
                    onClick={() => handleDelete(u.id)}
                    title="Delete"
                  >
                    <FaTrash/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {pwdModal.open && (
        <ChangePasswordModal
          userId={pwdModal.userId}
          onClose={() => setPwdModal({ open: false, userId: null })}
          onSuccess={fetchUnis}
        />
      )}
    </div>
  );
};

export default Universities;
