import React, { useEffect, useState } from 'react';
import api from '../../http-common';
import Loader from '../../context/Loader/Loader';
import './ListStudents.scss';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        console.log('📡 Fetching /admin/students...');
        const res = await api.get('/admin/students');
        setStudents(res.data.students || []);
        console.log('✅ Students loaded:', res.data.students.length);
      } catch (err) {
        console.error('❌ Error:', err);
        setError('Failed to load students.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filtered = students.filter((s) =>
    s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-students">
      <div className="admin-students__header">
        <h2 className="admin-students__title">All Students</h2>
        <input
          type="text"
          className="admin-students__search"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <Loader />}
      {error && <p className="admin-students__error">{error}</p>}

      {!loading && !error && (
        <table className="admin-students__table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>DOB</th>
              <th>Phone</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((student) => (
                <tr key={student.id}>
                  <td>{student.username}</td>
                  <td>{student.email}</td>
                  <td>{student.dob || '—'}</td>
                  <td>{student.phone || '—'}</td>
                  <td>{student.gender || '—'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="admin-students__empty">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Students;
