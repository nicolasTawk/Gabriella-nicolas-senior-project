import React, { useEffect, useState } from 'react';
import api from '../../http-common';
import SearchBar from '../../common/SearchBar/SearchBar';
import SchemaModal from '../../modals/admin/SchemaModal/SchemaModal';
import { Pencil, Trash } from 'lucide-react';
import './Schema.scss';

const AdminSchemas = () => {
  const [schemas, setSchemas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editSchema, setEditSchema] = useState(null);
  const [error, setError] = useState('');

  const fetchSchemas = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/questionnaire-schemas');
      setSchemas(res.data.schemas || []);
      setError('');
    } catch (err) {
      console.error('Failed to load schemas', err);
      setError('Failed to load schemas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemas();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this schema?')) return;
    try {
      await api.delete(`/admin/questionnaire-schemas/${id}`);
      fetchSchemas();
    } catch (err) {
      console.error('Failed to delete schema', err);
      setError('Failed to delete schema');
    }
  };

  const filtered = schemas.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="schemas">
      <div className="schemas__header row g-3 mb-4 align-items-center">
        <div className="col-md-5 col-sm-6 col-12">
          <SearchBar
            placeholder="Search schemas..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-7 col-sm-6 col-12 text-end">
          <button
            className="schemas__add-btn primary-btn"
            onClick={() => { setEditSchema(null); setModalOpen(true); }}
          >
            + Add Schema
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="schemas__error">{error}</p>}

      {!loading && !error && (
        <div className="schemas__table-wrapper">
          <table className="schemas__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map(schema => (
                  <tr key={schema.id}>
                    <td>{schema.name}</td>
                    <td>{schema.description || '—'}</td>
                    <td className="schemas__actions">
                      <Pencil
                        size={18}
                        className="schemas__icon edit"
                        onClick={() => { setEditSchema(schema); setModalOpen(true); }}
                      />
                      <Trash
                        size={18}
                        className="schemas__icon delete"
                        onClick={() => handleDelete(schema.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="schemas__empty">No schemas found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <SchemaModal
          schema={editSchema}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            fetchSchemas();
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminSchemas;
