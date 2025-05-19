import React, { useState, useEffect } from 'react';
import api from '../../../http-common';
import './SchemaModal.scss';

const SchemaModal = ({ schema, onClose, onSuccess }) => {
  const [name, setName] = useState(schema?.name || '');
  const [description, setDescription] = useState(schema?.description || '');
  const [jsonSchema, setJsonSchema] = useState(schema?.jsonSchema || '');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (schema) {
      setName(schema.name);
      setDescription(schema.description);
      setJsonSchema(JSON.stringify(schema.jsonSchema, null, 2));
    }
  }, [schema]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    let parsedSchema;
    try {
      parsedSchema = JSON.parse(jsonSchema);
    } catch {
      setMessage('Invalid JSON schema format.');
      return;
    }

    setLoading(true);
    try {
      if (schema) {
        await api.put(`/admin/questionnaire-schemas/${schema.id}`, {
          name,
          description,
          jsonSchema: parsedSchema
        });
      } else {
        await api.post('/admin/questionnaire-schemas', {
          name,
          description,
          jsonSchema: parsedSchema
        });
      }
      setMessage('✅ Schema saved successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage('❌ Failed to save schema.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="schema-modal" onClick={onClose}>
      <div className="schema-modal__content" onClick={e => e.stopPropagation()}>
        <h3 className="schema-modal__title">{schema ? 'Edit Schema' : 'Add Schema'}</h3>

        <form className="schema-modal__form" onSubmit={handleSubmit}>
          <label className="schema-modal__label" htmlFor="name">Name</label>
          <input
            id="name"
            className="schema-modal__input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <label className="schema-modal__label" htmlFor="description">Description</label>
          <textarea
            id="description"
            className="schema-modal__textarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <label className="schema-modal__label" htmlFor="jsonSchema">JSON Schema</label>
          <textarea
            id="jsonSchema"
            className="schema-modal__textarea schema-modal__textarea--json"
            value={jsonSchema}
            onChange={e => setJsonSchema(e.target.value)}
            rows={10}
            required
          />

          {message && <p className="schema-modal__message">{message}</p>}

          <div className="schema-modal__actions">
            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchemaModal;
