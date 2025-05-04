import React, { useEffect, useState } from 'react';
import api from '../../http-common';
import './Questionnaire.scss';

const Questionnaire = () => {
  const [schema, setSchema] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState('');
  const [error, setError] = useState('');

  // Fetch schema on mount
  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const res = await api.get('/users/questionnaire/schema');
        setSchema(res.data);
        setLoading(false);
      } catch (err) {
        console.error('❌ Error fetching schema:', err.response?.data || err.message);
        setError('Failed to load questionnaire. Please try again later.');
        setLoading(false);
      }
    };
    fetchSchema();
  }, []);

  // Handle input change
  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Submit answers
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('');
    setError('');

    const payload = {
      responses: Object.entries(answers).map(([question_id, answer]) => ({
        question_id,
        answer
      }))
    };

    console.log('📝 Submitting responses:', payload);

    try {
      await api.post('/users/questionnaire/submit', payload);
      setSubmitStatus('✅ Questionnaire submitted successfully!');
    } catch (err) {
      console.error('❌ Submission error:', err.response?.data || err.message);
      setError('Failed to submit answers. Please try again.');
    }
  };

  if (loading) return <div className="questionnaire-loader">Loading questionnaire...</div>;

  return (
    <div className="questionnaire-container">
      <h2>AI Guidance Questionnaire</h2>
      <form onSubmit={handleSubmit} className="questionnaire-form">
        {schema.length === 0 ? (
          <p>No questions available.</p>
        ) : (
          schema.map((q) => (
            <div key={q.id} className="question-block">
              <label className="question-label">{q.text}</label>

              {q.type === 'text' && (
                <input
                  type="text"
                  className="question-input"
                  value={answers[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  required
                />
              )}

              {q.type === 'multiple-choice' && (
                <select
                  className="question-select"
                  value={answers[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  required
                >
                  <option value="">Select an option</option>
                  {q.options.map((opt, index) => (
                    <option key={index} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))
        )}

        <button type="submit" className="submit-btn">
          Submit
        </button>

        {submitStatus && <p className="success-msg">{submitStatus}</p>}
        {error && <p className="error-msg">{error}</p>}
      </form>
    </div>
  );
};

export default Questionnaire;
