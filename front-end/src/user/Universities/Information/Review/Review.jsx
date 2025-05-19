import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaFilter,
  FaArrowLeft,
  FaReply,
  FaStar,
  FaRegStar,
  FaThumbsUp,
  FaRegThumbsUp,
  FaThumbsDown,
  FaRegThumbsDown
} from 'react-icons/fa';
import api from '../../../../http-common';
import Loader from '../../../../common/Loader/Loader';
import './Review.scss';

const SORT_OPTIONS = [
  { value: 'stars_desc', label: 'Rating: High → Low' },
  { value: 'stars_asc',  label: 'Rating: Low → High'  },
  { value: 'likes_desc', label: 'Most Liked' },
  { value: 'likes_asc',  label: 'Least Liked' }
];

export default function UniversityReviews() {
  const { id } = useParams();
  const nav   = useNavigate();

  const [reviews, setReviews]                 = useState([]);
  const [commentCounts, setCommentCounts]     = useState({});
  const [commentsByReview, setCommentsByReview] = useState({});
  const [threadsOpen, setThreadsOpen]         = useState({});
  const [replyingTo, setReplyingTo]           = useState(null);
  const [replyText, setReplyText]             = useState({});
  const [reactions, setReactions]             = useState({});
  const [sortBy, setSortBy]                   = useState('stars_desc');
  const [filterOpen, setFilterOpen]           = useState(false);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState('');
  const filterRef = useRef();

  // close filter menu on outside click
  useEffect(() => {
    const onClick = e => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // 1) fetch reviews + count their comments
  useEffect(() => {
    setLoading(true);
    api.get(`/review/universities/${id}`)
      .then(async res => {
        console.log('REVIEWS PAYLOAD:', res.data.reviews);
      setReviews(res.data.reviews || []);
        const rv = res.data.reviews || [];
        setReviews(rv);

        // count comments for each review
        const counts = {};
        await Promise.all(rv.map(r =>
          api.get(`/comment/reviews/${r.id}/comments`)
            .then(r2 => { counts[r.id] = r2.data.comments.length; })
            .catch(() => { counts[r.id] = 0; })
        ));
        setCommentCounts(counts);
      })
      .catch(() => setError('Could not load reviews.'))
      .finally(() => setLoading(false));
  }, [id]);

  // sorting reviews
  const sorted = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'stars_asc':
        return a.stars - b.stars;
      case 'likes_asc':
        return (reactions[a.id] === 'like' ? 1 : 0)
             - (reactions[b.id] === 'like' ? 1 : 0);
      case 'likes_desc':
        return (reactions[b.id] === 'like' ? 1 : 0)
             - (reactions[a.id] === 'like' ? 1 : 0);
      case 'stars_desc':
      default:
        return b.stars - a.stars;
    }
  });

  // toggle loading / hiding the nested thread
  const toggleThread = async reviewId => {
    if (threadsOpen[reviewId]) {
      setThreadsOpen({ ...threadsOpen, [reviewId]: false });
    } else {
      try {
        const res = await api.get(`/comment/reviews/${reviewId}/comments`);
        setCommentsByReview({
          ...commentsByReview,
          [reviewId]: res.data.comments
        });
        setThreadsOpen({ ...threadsOpen, [reviewId]: true });
      } catch {
        alert('Failed to load comments.');
      }
    }
  };

  // post a reply (to a review or to a comment)
  const submitReply = async (reviewId, parentId = null) => {
    const txt = (replyText[parentId ?? reviewId] || '').trim();
    if (!txt) return;
    try {
      await api.post(
        `/comment/reviews/${reviewId}/comments`,
        { comment: txt, parent_id: parentId }
      );
      // refresh
      const res = await api.get(`/comment/reviews/${reviewId}/comments`);
      setCommentsByReview({
        ...commentsByReview,
        [reviewId]: res.data.comments
      });
      setReplyText({ ...replyText, [parentId ?? reviewId]: '' });
      setReplyingTo(null);
    } catch {
      alert('Failed to post reply.');
    }
  };

  // like / dislike toggle
  const toggleReaction = async (itemId, type) => {
    try {
      await api.post(`/comment/comments/${itemId}/reactions`, { type });
      setReactions(prev => {
        const same = prev[itemId] === type;
        return { ...prev, [itemId]: same ? null : type };
      });
    } catch {
      alert('Could not update reaction.');
    }
  };

  // build nested tree
  const buildTree = flat => {
    const map = {};
    flat.forEach(c => map[c.id] = { ...c, children: [] });
    const roots = [];
    flat.forEach(c => {
      if (c.parent_id) map[c.parent_id]?.children.push(map[c.id]);
      else roots.push(map[c.id]);
    });
    return roots;
  };

  // render a comment + its children (no stars here)
  const CommentNode = ({ node, reviewId, depth }) => (
    <div className="row mb-3" style={{ marginLeft: depth * 16 }}
    >
      <div className="col-12 univ-rev__card" style={{
        backgroundColor: depth % 2 === 0 ? '#ffffff' : '#f7f7f7'
      }}>
        <strong>{node.User.username}</strong>
        <p className="mt-2">{node.content || '—'}</p>

        <div className="row univ-rev__actions">
          <div className="col" />
          <div className="col text-end">
            <FaReply
              className="univ-rev__icon"
              onClick={() => setReplyingTo(node.id)}
            />
            {reactions[node.id] === 'like' ? (
              <FaThumbsUp
                className="univ-rev__icon univ-rev__icon--filled"
                onClick={() => toggleReaction(node.id, 'like')}
              />
            ) : (
              <FaRegThumbsUp
                className="univ-rev__icon"
                onClick={() => toggleReaction(node.id, 'like')}
              />
            )}
            {reactions[node.id] === 'dislike' ? (
              <FaThumbsDown
                className="univ-rev__icon univ-rev__icon--filled"
                onClick={() => toggleReaction(node.id, 'dislike')}
              />
            ) : (
              <FaRegThumbsDown
                className="univ-rev__icon"
                onClick={() => toggleReaction(node.id, 'dislike')}
              />
            )}
          </div>
        </div>

        {replyingTo === node.id && (
          <div className="univ-rev__reply-box">
            <textarea
              className="univ-rev__reply-input"
              rows="2"
              placeholder="Write your reply…"
              value={replyText[node.id] || ''}
              onChange={e =>
                setReplyText({ ...replyText, [node.id]: e.target.value })
              }
            />
            <button
              className="univ-rev__reply-submit"
              disabled={!replyText[node.id]?.trim()}
              onClick={() => submitReply(reviewId, node.id)}
            >
              Post
            </button>
          </div>
        )}

        {node.children.length > 0 && (
          <div className="mt-3">
            {node.children.map(child => (
              <CommentNode
                key={child.id}
                node={child}
                reviewId={reviewId}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) return <Loader />;
  if (error)   return <p className="univ-rev__error">{error}</p>;

  return (
    <div className="univ-rev">
      {/* Header */}
      <div className="row align-items-center mb-4">
        <div className="col-2">
          <button className="univ-rev__back" onClick={() => nav(-1)}>
            <FaArrowLeft /> 
          </button>
        </div>
        <div className="col-8 text-center">
          <h2 className="univ-rev__title">
            {reviews[0]?.UniversityProfile?.username || 'University'} Reviews
          </h2>
        </div>
        <div className="col-2 text-end" ref={filterRef}>
          <FaFilter
            className="univ-rev__filter-icon"
            onClick={() => setFilterOpen(o => !o)}
          />
          {filterOpen && (
            <ul className="univ-rev__filter-menu">
              {SORT_OPTIONS.map(o => (
                <li
                  key={o.value}
                  className="univ-rev__filter-item"
                  onClick={() => {
                    setSortBy(o.value);
                    setFilterOpen(false);
                  }}
                >
                  {o.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main reviews */}
      {sorted.map(review => (
        <div key={review.id} className="row m-3">
          <div className="col-12 univ-rev__card">
            {/* username + stars */}
            <div className="row align-items-center">
              <div className="col">
                <p className='univ-rev__user'>{review.User.username}</p>
              </div>
              <div className="col text-end">
                {[...Array(5)].map((_, i) =>
                  i < review.stars ? (
                    <FaStar
                      key={i}
                      className="univ-rev__star univ-rev__star--filled"
                    />
                  ) : (
                    <FaRegStar
                      key={i}
                      className="univ-rev__star"
                    />
                  )
                )}
              </div>
            </div>

            {/* content */}
            <p className="mt-2">{review.comment || '—'}</p>

            {/* actions + show-comments */}
            <div className="row univ-rev__actions">
              <div className="col">
                {commentCounts[review.id] > 0 && (
                  <button
                    className="univ-rev__btn"
                    onClick={() => toggleThread(review.id)}
                  >
                    {threadsOpen[review.id]
                      ? `Hide comments`
                      : `Show all comments (${commentCounts[review.id]})`}
                  </button>
                )}
              </div>
              <div className="col text-end">
                <FaReply
                  className="univ-rev__icon"
                  onClick={() => setReplyingTo(review.id)}
                />
                {reactions[review.id] === 'like' ? (
                  <FaThumbsUp
                    className="univ-rev__icon univ-rev__icon--filled"
                    onClick={() => toggleReaction(review.id, 'like')}
                  />
                ) : (
                  <FaRegThumbsUp
                    className="univ-rev__icon"
                    onClick={() => toggleReaction(review.id, 'like')}
                  />
                )}
                {reactions[review.id] === 'dislike' ? (
                  <FaThumbsDown
                    className="univ-rev__icon univ-rev__icon--filled"
                    onClick={() => toggleReaction(review.id, 'dislike')}
                  />
                ) : (
                  <FaRegThumbsDown
                    className="univ-rev__icon"
                    onClick={() => toggleReaction(review.id, 'dislike')}
                  />
                )}
              </div>
            </div>

            {/* reply-to-review box */}
            {replyingTo === review.id && (
              <div className="univ-rev__reply-box">
                <textarea
                  className="univ-rev__reply-input"
                  rows="2"
                  placeholder="Write your reply…"
                  value={replyText[review.id] || ''}
                  onChange={e =>
                    setReplyText({ ...replyText, [review.id]: e.target.value })
                  }
                />
                <button
                  className="univ-rev__reply-submit"
                  disabled={!replyText[review.id]?.trim()}
                  onClick={() => submitReply(review.id, null)}
                >
                  Post
                </button>
              </div>
            )}

            {/* nested replies */}
            {threadsOpen[review.id] && commentsByReview[review.id] && (
              <div className="mt-3">
                {buildTree(commentsByReview[review.id]).map(node => (
                  <CommentNode
                    key={node.id}
                    node={node}
                    reviewId={review.id}
                    depth={1}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
