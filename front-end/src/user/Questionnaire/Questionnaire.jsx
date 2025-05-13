import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import api from '../../http-common';
import Loader from '../../common/Loader/Loader';
import '../../styles/style.scss';
import './Questionnaire.scss';

const QUESTION_LABELS = {
  childhoodActivities: 'What activities did you enjoy the most during your childhood?',
  mainChildhoodHobby: 'What was your main childhood hobby?',
  currentTopHobbies: 'What are your current top hobbies?',
  creativeHours: 'How many hours per week do you spend on creative tasks?',
  technicalHours: 'How many hours per week do you spend on technical tasks?',
  easiestSubject: 'Which subject do you find the easiest?',
  hardestSubject: 'Which subject do you find the hardest?',
  bestGradeSubjects: 'Which subjects did you get the best grades in?',
  likesAbstractProblems: 'How much do you enjoy solving abstract problems?',
  likesWriting: 'How much do you enjoy writing or expressing yourself in words?',
  leadershipScore: 'Rate your leadership ability (1–5)',
  prefersSolo: 'Do you prefer working alone or in a team? (1 = solo, 5 = team)',
  taskPreference: 'Which type of task do you prefer the most?',
  organiseVsCreate: 'Do you prefer organizing or creating things?',
  preferredTaskExample: 'Which of these tasks do you prefer?',
  workOutcome: 'What do you expect your work outcome to focus on?',
  jobStability: 'How important is job stability for you? (1–5)',
  highSalary: 'How important is a high salary to you? (1–5)',
  futureEnvironment: 'Which work environment do you see yourself in?',
  careerImpact: 'What impact do you want your career to have?'
};

const scaleQuestions = ['leadershipScore', 'prefersSolo', 'jobStability', 'highSalary', 'likesAbstractProblems', 'likesWriting'];
const rangeQuestions = ['creativeHours', 'technicalHours'];

const Questionnaire = () => {
  const [schema, setSchema] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [error, setError] = useState('');
  const [recommendedMajors, setRecommendedMajors] = useState([]);

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const res = await api.get('/users/questionnaire/schema');
        setSchema(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load questionnaire. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchSchema();
  }, []);

  const handleChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('');
    setError('');
    setSubmitting(true);
    setRecommendedMajors([]);

    const requiredFields = schema?.schema?.schema_json?.required || [];
    const missing = requiredFields.filter((field) => !answers[field] && answers[field] !== 0);

    if (missing.length > 0) {
      setError('Please answer all required questions before submitting.');
      setSubmitting(false);
      return;
    }

    const token = localStorage.getItem('token');
    const payload = {
      answers: Object.fromEntries(Object.entries(answers).filter(([_, v]) => v !== undefined && v !== null && v !== ''))
    };

    try {
      const res = await api.post(
        '/users/questionnaire/submit',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.majors) {
        setRecommendedMajors(Object.values(res.data.majors));
        setSubmitStatus('✅ Questionnaire submitted successfully!');
        setShowForm(false);
      } else {
        setSubmitStatus('✅ Questionnaire submitted, but no specific major recommendation received.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit answers.');
    } finally {
      setSubmitting(false);
    }
  };

  const properties = schema?.schema?.schema_json?.properties || {};
  const requiredFields = schema?.schema?.schema_json?.required || [];

  if (loading || submitting) return <Loader fullScreen={true} />;

  return (
    <div className="questionnaire">
      <div className="row">
        <div className="col-12">
          {!showForm && !recommendedMajors.length && (
            <>
              <h2 className="questionnaire__title mb-2">AI Guidance Questionnaire</h2>
              <p className="questionnaire__description mb-4">
                This AI-powered questionnaire helps guide you in discovering the university majors that best match your passions,
                academic strengths, and desired career impact. Answer thoughtfully to receive personalized and accurate results.
              </p>
              <div className="text-center mt-4">
                <button className="primary-btn" onClick={() => setShowForm(true)}>
                  Take Questionnaire
                </button>
              </div>
            </>
          )}

          {(showForm || recommendedMajors.length > 0) && (
            <div className="questionnaire__back-btn">
              <FontAwesomeIcon icon={faArrowLeft} onClick={() => {
                setShowForm(false);
                setRecommendedMajors([]);
              }} />
            </div>
          )}

          {error && <p className="text-danger fw-semibold mb-3">{error}</p>}
          {submitStatus && <p className="text-success fw-semibold mb-3">{submitStatus}</p>}

          {recommendedMajors.length > 0 && (
            <>
              <div className="questionnaire__recommendation">
                <h5 className="questionnaire__recommendation-title mb-2">🎓 Recommended Majors:</h5>
                <ul className="questionnaire__recommendation-list mb-0">
                  {recommendedMajors.map((major, index) => (
                    <li key={index}>{major}</li>
                  ))}
                </ul>
              </div>
              <div className="text-center mt-4 d-flex justify-content-center gap-3">
                <button className="primary-btn" onClick={() => {
                  setAnswers({});
                  setShowForm(true);
                  setRecommendedMajors([]);
                }}>Retake Questionnaire</button>
                <button className="primary-btn" onClick={() => {
                  window.location.href = '../../Universities';
                }}>View Universities</button>
              </div>
            </>
          )}

          {showForm && (
            <form className="questionnaire__form" onSubmit={handleSubmit}>
              <div className="questionnaire__scrollable">
                {Object.entries(properties).map(([key, q]) => (
                  <div key={key} className="row w-100 mb-4 g-2 align-items-start">
                    <div className="col-12">
                      <label className="form-label questionnaire__question fw-bold">
                        {QUESTION_LABELS[key] || q.title || key}
                      </label>
                    </div>
                    <div className="col-12 col-lg-6 col-md-6">
                      {scaleQuestions.includes(key) ? (
                        <div className="questionnaire__scale-group">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              type="button"
                              key={num}
                              className={`questionnaire__scale-group-btn ${answers[key] === num ? 'active' : ''}`}
                              onClick={() => handleChange(key, num)}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      ) : rangeQuestions.includes(key) ? (
                        <div className="questionnaire__range-group">
                          <input
                            type="range"
                            min="0"
                            max="168"
                            value={answers[key] || 0}
                            onChange={(e) => handleChange(key, parseInt(e.target.value))}
                            required={requiredFields.includes(key)}
                          />
                          <span className="questionnaire__range-group-value">{answers[key] || 0}</span>
                        </div>
                      ) : q.enum ? (
                        <div className="questionnaire__radio-group">
                          {q.enum.map((opt, idx) => (
                            <label key={idx} className="questionnaire__radio-group-item">
                              <input
                                type="radio"
                                name={key}
                                value={opt}
                                checked={answers[key] === opt}
                                onChange={(e) => handleChange(key, e.target.value)}
                                required={requiredFields.includes(key)}
                              />
                              <span className={answers[key] === opt ? 'selected' : ''}>{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <input
                          type={q.type === 'integer' ? 'number' : 'text'}
                          className="questionnaire__answer-input"
                          value={answers[key] || ''}
                          onChange={(e) => handleChange(key, e.target.value)}
                          required={requiredFields.includes(key)}
                          placeholder="Your answer"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="questionnaire__fixed-controls">
                <button type="submit" className="primary-btn">Submit</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
