import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../http-common';
import Loader from '../../../common/Loader/Loader';
import SearchBar from '../../../common/SearchBar/SearchBar';
import {
  FaArrowLeft,
  FaStar,
  FaRegStar
} from 'react-icons/fa';
import defaultImage from '../../../util/images/university-default-logo.png';
import './Information.scss';


const Information = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [reviews, setReviews]   = useState([]);
  const [myReview, setMyReview] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState('');
  const [stars, setStars]       = useState(0);
  const [comment, setComment]   = useState('');

  // fetch profile, faculties & reviews
  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/public/universities/${id}`),
      api.get(`/public/universities/${id}/faculties`),
      api.get(`/review/universities/${id}`)
    ])
      .then(([pRes, fRes, rRes]) => {
        setProfile(pRes.data.profile);
        setFaculties(fRes.data.faculties);
        setReviews(rRes.data.reviews);
      })
      .catch(() => setError('Could not load university details.'))
      .finally(() => setLoading(false));
  }, [id]);

  // compute current user id from JWT
  const currentUserId = useMemo(() => {
    try {
      const token = localStorage.getItem('authToken');
      return JSON.parse(atob(token.split('.')[1])).id;
    } catch {
      return null;
    }
  }, []);

  // extract myReview if it exists
  useEffect(() => {
    if (currentUserId != null) {
      const existing = reviews.find(r => r.User?.id === currentUserId);
      if (existing) {
        setMyReview({
          stars: existing.stars,
          comment: existing.comment
        });
      }
    }
  }, [reviews, currentUserId]);

  // average rating
  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.stars, 0);
    return sum / reviews.length;
  }, [reviews]);

  // filter faculties
  const filteredFaculties = faculties.filter(fac => {
    const term = searchTerm.toLowerCase();
    return (
      fac.name.toLowerCase().includes(term) ||
      (fac.description || '').toLowerCase().includes(term)
    );
  });

  // submit new review
  const submitReview = async () => {
    setSubmitting(true);
    try {
      await api.post(`/review/universities/${id}`, { stars, comment });
      const rRes = await api.get(`/review/universities/${id}`);
      setReviews(rRes.data.reviews);
      setComment('');
      setStars(0);
    } catch {
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (error)   return <p className="uni-info__error text-center">{error}</p>;

  return (
    <div className="uni-info">
      {/* — Header */}
      <div className="row uni-info__header sticky-top bg-white">
        <div className="col-12 text-start">
          <button
            className="uni-info__back-btn"
            onClick={() => navigate('/universities')}
          >
            <FaArrowLeft className="uni-info__back-icon" />
          </button>
        </div>

        <div className="col-12 col-md-8">
          <h1 className="uni-info__name mb-0">{profile.name}</h1>
        </div>

        <div className="col-12 col-md-4 text-md-end uni-info__avg-rating">
          <span className="uni-info__avg-label">Avg Rating:</span>
          <span className="uni-info__avg-stars">
            {Array.from({ length: 5 }, (_, i) =>
              i < Math.round(avgRating)
                ? <FaStar key={i} className="uni-info__avg-star uni-info__avg-star--filled" />
                : <FaRegStar key={i} className="uni-info__avg-star" />
            )}
          </span>
          <span className="uni-info__avg-value">({avgRating.toFixed(1)})</span>
        </div>
      </div>

      {/* — Logo & Details */}
      <div className="row align-items-center mt-4 mb-5">
        <div className="col-md-5 text-center">
          <img
            src={profile.logo_url || defaultImage}
            alt={profile.name}
            className="uni-info__logo img-fluid"
          />
        </div>
        <div className="col-md-7">
          <ul className="list-unstyled uni-info__details">
            {profile.location && (
              <li><strong>Location:</strong> {profile.location}</li>
            )}
            {profile.phone && (
              <li>
                <strong>Phone:</strong>{' '}
                <a href={`tel:${profile.phone}`}>{profile.phone}</a>
              </li>
            )}
            {profile.contact_email && (
              <li>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${profile.contact_email}`}>{profile.contact_email}</a>
              </li>
            )}
            {profile.website && (
              <li>
                <strong>Website:</strong>{' '}
                <a href={profile.website} target="_blank" rel="noreferrer">
                  {profile.website}
                </a>
              </li>
            )}
            {profile.established_date && (
              <li>
                <strong>Founded:</strong>{' '}
                {new Date(profile.established_date).toLocaleDateString()}
              </li>
            )}
            {profile.accreditation && (
              <li><strong>Accreditation:</strong> {profile.accreditation}</li>
            )}
          </ul>
        </div>
      </div>

      {/* — Search Bar */}
      <div className="row mb-3 justify-content-end">
      <h2 className="uni-info__section-title">Faculties</h2>
        <div className="col-12 col-md-4">
          <SearchBar
            placeholder="Search faculties..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* — Faculties Table */}
      <div className="faculty__table-wrapper">
        <table className="faculty__table w-100">
          <thead className="faculty__thead">
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredFaculties.length > 0 ? filteredFaculties.map(fac => (
              <tr
                key={fac.id}
                className="faculty__row"
                onClick={() => navigate(`/faculties/${fac.id}/majors`)}
              >
                <td>{fac.name}</td>
                <td>{fac.description || '—'}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="2" className="faculty__empty">
                  No faculties found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* — Reviews Section */}
      <h2 className="uni-info__section-title mt-5">Reviews</h2>
      <div className="row justify-content-center mb-4">
        <div className="col-lg-6 col-md-8 col-12">
          <div className="review-box">
            {myReview ? (
              <div className="review-box__existing">
                <h3 className="review-box__title">
                  Your review has been submitted
                </h3>
                <div className="review-box__stars">
                  {Array.from({ length: 5 }, (_, i) =>
                    i < myReview.stars
                      ? <FaStar key={i} className="review-box__star review-box__star--filled" />
                      : <FaRegStar key={i} className="review-box__star" />
                  )}
                </div>
                <p className="review-box__comment">{myReview.comment}</p>
              </div>
            ) : (
              <>
                <p className="text-center">
                  <strong>Leave your review:</strong>
                </p>
                <div className="review-box__stars-input">
                    {[1,2,3,4,5].map(n => (
                        n <= stars
                        ? <FaStar
                            key={n}
                            className="review-box__star review-box__star--filled"
                            onClick={() => setStars(n)}
                            />
                        : <FaRegStar
                            key={n}
                            className="review-box__star"
                            onClick={() => setStars(n)}
                            />
                    ))}
                </div>
                <textarea
                  className="review-box__input"
                  rows="3"
                  placeholder="Write your comments..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                />
                <button
                  className="primary-btn w-100"
                  disabled={submitting || stars === 0 || !comment.trim()}
                  onClick={submitReview}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </>
            )}
          </div>
          <div className="row justify-content-center align-items-center text-center">
            <button
              className="primary-btn w-50 mt-3 "
              onClick={() => navigate(`/reviews/university/${id}`)}
            >
              Show all reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Information;
