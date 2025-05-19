import React, { useEffect, useState } from 'react';
import api from '../../http-common';
import ChangeUsersPassword from '../../modals/admin/ChangeUsersPassword/ChangeUsersPassword';
import { FaBan, FaTrash, FaKey, FaUnlock } from 'react-icons/fa';
import SearchBar from '../../common/SearchBar/SearchBar';
import './ListStudents.scss';

const ListStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [pwdModal, setPwdModal] = useState({ open: false, userId: null });

  const fetchStudents = async () => {
    try {
      const res = await api.get('/admin/students');
      setStudents(res.data.students);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleBanToggle = async (id, approved) => {
    try {
      if (approved) {
        await api.put(`/admin/users/${id}/ban`);
      } else {
        await api.put(`/admin/users/${id}/unban`);
      }
      fetchStudents();
    } catch (err) {
      console.error('Error toggling ban:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this account?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchStudents();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const filtered = students.filter(
    (s) =>
      s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="students">
      <div className="students__header row g-3 mb-4 align-items-center">
      <h2 className="students__title">List of Students</h2>

        <div className="col-md-5 col-sm-6 col-12">
          <SearchBar
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="students__table-wrapper">
          <table className="students__table">
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
                filtered.map((s) => (
                  <tr key={s.id}>
                    <td>{s.username}</td>
                    <td>{s.email}</td>
                    <td>{s.approved ? 'Yes' : 'No'}</td>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="students__actions">
                      <button
                        className="icon-btn ban"
                        onClick={() => handleBanToggle(s.id, s.approved)}
                        title={s.approved ? 'Ban' : 'Unban'}
                      >
                        {s.approved ? <FaBan /> : <FaUnlock />}
                      </button>
                      <button
                        className="icon-btn password"
                        onClick={() => setPwdModal({ open: true, userId: s.id })}
                        title="Change Password"
                      >
                        <FaKey />
                      </button>
                      <button
                        className="icon-btn delete"
                        onClick={() => handleDelete(s.id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="students__empty">
                    No students found.
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
          userType="student"
          onClose={() => setPwdModal({ open: false, userId: null })}
          onSuccess={fetchStudents}
        />
      )}
    </div>
  );
};

export default ListStudents;
