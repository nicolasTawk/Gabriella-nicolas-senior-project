

// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   FaArrowLeft,
//   FaFilter,
//   FaThumbsUp,
//   FaThumbsDown,
//   FaReply,
//   FaStar,
//   FaRegStar
// } from 'react-icons/fa';
// import api from '../../../../http-common';
// import Loader from '../../../../common/Loader/Loader';
// import './Review.scss';

// const SORT_OPTIONS = [
//   { value: 'stars_desc', label: 'Rating: High → Low' },
//   { value: 'stars_asc', label: 'Rating: Low → High' },
// ];

// export default function Review() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [sortBy, setSortBy] = useState('stars_desc');
//   const [filterOpen, setFilterOpen] = useState(false);
//   const filterRef = useRef();

//   const [threadsOpen, setThreadsOpen] = useState({});
//   const [commentsByReview, setCommentsByReview] = useState({});
//   const [replyText, setReplyText] = useState({});
//   const [showReplyBox, setShowReplyBox] = useState({});
//   const [reactionCounts, setReactionCounts] = useState({});
//   const [userReactions, setUserReactions] = useState({});

//   // Close filter dropdown on outside click
//   useEffect(() => {
//     const onClick = e => {
//       if (filterRef.current && !filterRef.current.contains(e.target)) {
//         setFilterOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', onClick);
//     return () => document.removeEventListener('mousedown', onClick);
//   }, []);

//   // Fetch reviews
//   useEffect(() => {
//     api.get(`/review/universities/${id}`)
//       .then(res => setReviews(res.data.reviews || []))
//       .catch(() => setError('Could not load reviews.'))
//       .finally(() => setLoading(false));
//   }, [id]);

//   // Fetch reaction counts for top-level reviews
//   useEffect(() => {
//     reviews.forEach(r => fetchReactionCount(r.id));
//   }, [reviews]);

//   const sorted = [...reviews].sort((a, b) =>
//     sortBy === 'stars_asc' ? a.stars - b.stars : b.stars - a.stars
//   );

//   const fetchReactionCount = async commentId => {
//     try {
//       const res = await api.get(`/comment/comments/${commentId}/reactions/count`);
//       setReactionCounts(prev => ({
//         ...prev,
//         [commentId]: { likes: res.data.likes, dislikes: res.data.dislikes }
//       }));
//     } catch {}
//   };

//   const toggleThread = async reviewId => {
//     if (threadsOpen[reviewId]) {
//       setThreadsOpen(prev => ({ ...prev, [reviewId]: false }));
//     } else {
//       try {
//         const res = await api.get(`/comment/reviews/${reviewId}/comments`);
//         setCommentsByReview(prev => ({ ...prev, [reviewId]: res.data.comments }));
//         setThreadsOpen(prev => ({ ...prev, [reviewId]: true }));
//         res.data.comments.forEach(c => fetchReactionCount(c.id));
//       } catch {
//         alert('Failed to load comments.');
//       }
//     }
//   };

//   const submitReply = async (reviewId, parentId = null) => {
//     const key = parentId || reviewId;
//     const text = (replyText[key] || '').trim();
//     if (!text) return;
//     try {
//       await api.post(
//         `/comment/reviews/${reviewId}/comments`,
//         { content: text, parent_id: parentId }
//       );
//       const res = await api.get(`/comment/reviews/${reviewId}/comments`);
//       setCommentsByReview(prev => ({ ...prev, [reviewId]: res.data.comments }));
//       res.data.comments.forEach(c => fetchReactionCount(c.id));
//       setReplyText(prev => ({ ...prev, [key]: '' }));
//       setShowReplyBox(prev => ({ ...prev, [key]: false }));
//     } catch {
//       alert('Failed to post reply.');
//     }
//   };

//   const toggleReaction = async (commentId, type) => {
//     try {
//       await api.post(`/comment/comments/${commentId}/reactions`, { type });
//       setUserReactions(prev => ({
//         ...prev,
//         [commentId]: prev[commentId] === type ? null : type
//       }));
//       fetchReactionCount(commentId);
//     } catch {
//       alert('Could not update reaction.');
//     }
//   };

//   const buildTree = flat => {
//     const map = {};
//     flat.forEach(c => map[c.id] = { ...c, children: [] });
//     const roots = [];
//     flat.forEach(c => {
//       if (c.parent_id) map[c.parent_id]?.children.push(map[c.id]);
//       else roots.push(map[c.id]);
//     });
//     return roots;
//   };

//   const CommentNode = ({ node, reviewId, depth = 0 }) => (
//     <div className="rev__comment-node" style={{ marginLeft: depth * 20 }}>
//       <div className="rev__comment-header">
//         <strong className="rev__comment-user">{node.User.username}</strong>
//       </div>
//       <p className="rev__comment-text">{node.content}</p>
//       <div className="rev__comment-actions">
//         <FaReply
//           className="rev__icon rev__icon--action"
//           onClick={() => setShowReplyBox(prev => ({ ...prev, [node.id]: !prev[node.id] }))}
//         />
//         <div className="rev__reaction-group">
//           <button
//             className={`rev__icon rev__icon--action ${userReactions[node.id] === 'like' ? 'rev__icon--selected' : ''}`}
//             onClick={() => toggleReaction(node.id, 'like')}
//           >
//             <FaThumbsUp/><span>{reactionCounts[node.id]?.likes || 0}</span>
//           </button>
//           <button
//             className={`rev__icon rev__icon--action ${userReactions[node.id] === 'dislike' ? 'rev__icon--selected' : ''}`}
//             onClick={() => toggleReaction(node.id, 'dislike')}
//           >
//             <FaThumbsDown/><span>{reactionCounts[node.id]?.dislikes || 0}</span>
//           </button>
//         </div>
//       </div>
//       {showReplyBox[node.id] && (
//         <div className="rev__reply-box">
//           <textarea
//             className="rev__reply-input"
//             rows="2"
//             placeholder="Your reply…"
//             value={replyText[node.id] || ''}
//             onChange={e => setReplyText(prev => ({ ...prev, [node.id]: e.target.value }))}
//           />
//           <button
//             className="primary-btn rev__reply-submit"
//             disabled={!replyText[node.id]?.trim()}
//             onClick={() => submitReply(reviewId, node.id)}
//           >
//             Post
//           </button>
//         </div>
//       )}
//       {node.children.map(child => (
//         <CommentNode key={child.id} node={child} reviewId={reviewId} depth={depth+1} />
//       ))}
//     </div>
//   );

//   if (loading) return <Loader />;
//   if (error) return <p className="rev__error">{error}</p>;

//   return (
//     <div className="rev container py-4">
//       <div className="rev__header row align-items-center mb-4">
//         <div className="col-2">
//           <button className="rev__back link-button" onClick={() => navigate(-1)}>
//             <FaArrowLeft/> Back
//           </button>
//         </div>
//         <div className="col-8 text-center">
//           <h2 className="rev__title">
//             {reviews[0]?.UniversityProfile?.name || 'University'} Reviews
//           </h2>
//         </div>
//         <div className="col-2 text-end" ref={filterRef}>
//           <FaFilter className="rev__filter-icon" onClick={() => setFilterOpen(o => !o)} />
//           {filterOpen && (
//             <ul className="rev__filter-menu">
//               {SORT_OPTIONS.map(o => (
//                 <li key={o.value} className="rev__filter-item" onClick={() => {
//                   setSortBy(o.value);
//                   setFilterOpen(false);
//                 }}>
//                   {o.label}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//       {sorted.map(review => (
//         <div key={review.id} className="rev__card mb-4">
//           <div className="rev__top">
//             <strong className="rev__user">{review.User.username}</strong>
//             <div className="rev__stars">
//               {Array.from({ length: 5 }, (_, i) =>
//                 i < review.stars
//                   ? <FaStar key={i} className="rev__star rev__star--filled"/>
//                 : <FaRegStar key={i} className="rev__star"/>
//               )}
//             </div>
//           </div>
//           <p className="rev__comment">{review.comment || '—'}</p>
//           <div className="rev__comment-actions">
//             <FaReply
//               className="rev__icon rev__icon--action"
//               onClick={() => setShowReplyBox(prev => ({ ...prev, [review.id]: !prev[review.id] }))}
//             />
//             <div className="rev__reaction-group">
//               <button
//                 className={`rev__icon rev__icon--action ${userReactions[review.id] === 'like' ? 'rev__icon--selected' : ''}`}
//                 onClick={() => toggleReaction(review.id, 'like')}
//               >
//                 <FaThumbsUp/><span>{reactionCounts[review.id]?.likes || 0}</span>
//               </button>
//               <button
//                 className={`rev__icon rev__icon--action ${userReactions[review.id] === 'dislike' ? 'rev__icon--selected' : ''}`}
//                 onClick={() => toggleReaction(review.id, 'dislike')}
//               >
//                 <FaThumbsDown/><span>{reactionCounts[review.id]?.dislikes || 0}</span>
//               </button>
//             </div>
//           </div>
//           {showReplyBox[review.id] && (
//             <div className="rev__reply-box">
//               <textarea
//                 className="rev__reply-input"
//                 rows="2"
//                 placeholder="Your reply…"
//                 value={replyText[review.id] || ''}
//                 onChange={e => setReplyText(prev => ({ ...prev, [review.id]: e.target.value }))}
//               />
//               <button
//                 className="primary-btn rev__reply-submit mb-3"
//                 disabled={!replyText[review.id]?.trim()}
//                 onClick={() => submitReply(review.id, null)}
//               >
//                 Post
//               </button>
//             </div>
//           )}
//           <div className="rev__actions row align-items-center">
//             <div className="col-auto">
//               <button
//                 className="rev__btn primary-btn"
//                 onClick={() => toggleThread(review.id)}
//               >
//                 {threadsOpen[review.id] ? 'Hide Comments' : 'Show All Comments'}
//               </button>
//             </div>
//           </div>
//           {threadsOpen[review.id] && (
//             <div className="rev__thread mt-3">
//               {buildTree(commentsByReview[review.id] || []).map(node => (
//                 <CommentNode key={node.id} node={node} reviewId={review.id} />
//               ))}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }





import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaFilter,
  FaReply,
  FaStar,
  FaRegStar,
  FaRegThumbsUp,
  FaThumbsUp,
  FaRegThumbsDown,
  FaThumbsDown
} from 'react-icons/fa';
import api from '../../../../http-common';
import Loader from '../../../../common/Loader/Loader';
import './Review.scss';

const SORT_OPTIONS = [
  { value: 'stars_desc', label: 'Rating: High → Low' },
  { value: 'stars_asc',  label: 'Rating: Low → High'  },
];

export default function Review() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState('');
  const [sortBy, setSortBy]                 = useState('stars_desc');
  const [filterOpen, setFilterOpen]         = useState(false);
  const filterRef                          = useRef();

  const [threadsOpen, setThreadsOpen]       = useState({});
  const [commentsByReview, setCommentsByReview] = useState({});
  const [replyText, setReplyText]           = useState({});
  const [showReplyBox, setShowReplyBox]     = useState({});
  const [reactionCounts, setReactionCounts] = useState({});
  const [userReactions, setUserReactions]   = useState({});

  // close filter dropdown when clicking outside
  useEffect(() => {
    const onClick = e => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // fetch reviews
  useEffect(() => {
    api.get(`/review/universities/${id}`)
      .then(res => setReviews(res.data.reviews || []))
      .catch(() => setError('Could not load reviews.'))
      .finally(() => setLoading(false));
  }, [id]);

  // fetch reaction counts on reviews load
  useEffect(() => {
    reviews.forEach(r => fetchReactionCount(r.id));
  }, [reviews]);

  const sorted = [...reviews].sort((a,b) =>
    sortBy === 'stars_asc' ? a.stars - b.stars : b.stars - a.stars
  );

  async function fetchReactionCount(commentId) {
    try {
      const res = await api.get(`/comment/comments/${commentId}/reactions/count`);
      setReactionCounts(prev => ({
        ...prev,
        [commentId]: {
          likes: res.data.likes,
          dislikes: res.data.dislikes
        }
      }));
    } catch {}
  }

  // toggle nested comments
  const toggleThread = async reviewId => {
    if (threadsOpen[reviewId]) {
      setThreadsOpen(prev => ({ ...prev, [reviewId]: false }));
    } else {
      try {
        const res = await api.get(`/comment/reviews/${reviewId}/comments`);
        setCommentsByReview(prev => ({ ...prev, [reviewId]: res.data.comments }));
        setThreadsOpen(prev => ({ ...prev, [reviewId]: true }));
        res.data.comments.forEach(c => fetchReactionCount(c.id));
      } catch {
        alert('Failed to load comments.');
      }
    }
  };

  // post reply
  const submitReply = async (reviewId, parentId = null) => {
    const key = parentId || reviewId;
    const text = (replyText[key]||'').trim();
    if (!text) return;
    try {
      await api.post(
        `/comment/reviews/${reviewId}/comments`,
        { content: text, parent_id: parentId }
      );
      const res = await api.get(`/comment/reviews/${reviewId}/comments`);
      setCommentsByReview(prev => ({ ...prev, [reviewId]: res.data.comments }));
      res.data.comments.forEach(c => fetchReactionCount(c.id));
      setReplyText(prev => ({ ...prev, [key]: '' }));
      setShowReplyBox(prev => ({ ...prev, [key]: false }));
    } catch {
      alert('Failed to post reply.');
    }
  };

  // like/dislike toggle
  const toggleReaction = async (commentId, type) => {
    try {
      await api.post(`/comment/comments/${commentId}/reactions`, { type });
      setUserReactions(prev => ({
        ...prev,
        [commentId]: prev[commentId] === type ? null : type
      }));
      fetchReactionCount(commentId);
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

  // recursive comment renderer
  const CommentNode = ({ node, reviewId, depth = 0 }) => (
    <div
      className="rev__comment-node"
      style={{ marginLeft: depth * 20 }}
    >
      <div className="rev__comment-header">
        <strong>{node.User.username}</strong>
      </div>
      <p className="rev__comment-text">{node.content}</p>
      <div className="rev__comment-actions">
        <FaReply
          className="rev__icon"
          onClick={() =>
            setShowReplyBox(prev => ({ ...prev, [node.id]: !prev[node.id] }))
          }
        />
        <div className="rev__reaction-group">
          <button
            className="rev__icon"
            onClick={() => toggleReaction(node.id, 'like')}
          >
            {userReactions[node.id] === 'like'
              ? <FaThumbsUp />
              : <FaRegThumbsUp />}
            <span>{reactionCounts[node.id]?.likes || 0}</span>
          </button>
          <button
            className="rev__icon"
            onClick={() => toggleReaction(node.id, 'dislike')}
          >
            {userReactions[node.id] === 'dislike'
              ? <FaThumbsDown />
              : <FaRegThumbsDown />}
            <span>{reactionCounts[node.id]?.dislikes || 0}</span>
          </button>
        </div>
      </div>

      {showReplyBox[node.id] && (
        <div className="rev__reply-box">
          <textarea
            className="rev__reply-input"
            rows="2"
            placeholder="Your reply…"
            value={replyText[node.id]||''}
            onChange={e => setReplyText(prev => ({
              ...prev, [node.id]: e.target.value
            }))}
          />
          <button
            className="rev__reply-submit"
            disabled={!replyText[node.id]?.trim()}
            onClick={() => submitReply(reviewId, node.id)}
          >
            Post
          </button>
        </div>
      )}

      {node.children.map(child => (
        <CommentNode
          key={child.id}
          node={child}
          reviewId={reviewId}
          depth={depth+1}
        />
      ))}
    </div>
  );

  if (loading) return <Loader />;
  if (error)   return <p className="rev__error">{error}</p>;

  return (
    <div className="rev rev__container">
      <div className="rev__header">
        <button className="rev__back" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <h2 className="rev__title">
          {reviews[0]?.UniversityProfile?.name || 'University'} Reviews
        </h2>
        <div ref={filterRef}>
          <FaFilter
            className="rev__filter-icon"
            onClick={() => setFilterOpen(o => !o)}
          />
          {filterOpen && (
            <ul className="rev__filter-menu">
              {SORT_OPTIONS.map(o => (
                <li
                  key={o.value}
                  className="rev__filter-item"
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

      {sorted.map(review => (
        <div key={review.id} className="rev__card">
          <div className="rev__card-top">
            <strong className="rev__user">{review.User.username}</strong>
            <div className="rev__stars">
              {Array.from({ length: 5 }, (_, i) =>
                i < review.stars
                  ? <FaStar key={i} className="rev__star rev__star--filled"/>
                  : <FaRegStar key={i} className="rev__star"/>
              )}
            </div>
          </div>

          <p className="rev__comment">{review.comment || '—'}</p>

          <div className="rev__comment-actions">
            <FaReply
              className="rev__icon"
              onClick={() => setShowReplyBox(prev => ({
                ...prev, [review.id]: !prev[review.id]
              }))}
            />
            <div className="rev__reaction-group">
              <button
                className="rev__icon"
                onClick={() => toggleReaction(review.id, 'like')}
              >
                {userReactions[review.id] === 'like'
                  ? <FaThumbsUp />
                  : <FaRegThumbsUp />}
                <span>{reactionCounts[review.id]?.likes || 0}</span>
              </button>
              <button
                className="rev__icon"
                onClick={() => toggleReaction(review.id, 'dislike')}
              >
                {userReactions[review.id] === 'dislike'
                  ? <FaThumbsDown />
                  : <FaRegThumbsDown />}
                <span>{reactionCounts[review.id]?.dislikes || 0}</span>
              </button>
            </div>
          </div>

          {showReplyBox[review.id] && (
            <div className="rev__reply-box">
              <textarea
                className="rev__reply-input"
                rows="2"
                placeholder="Your reply…"
                value={replyText[review.id] || ''}
                onChange={e => setReplyText(prev => ({
                  ...prev, [review.id]: e.target.value
                }))}
              />
              <button
                className="rev__reply-submit"
                disabled={!replyText[review.id]?.trim()}
                onClick={() => submitReply(review.id, null)}
              >
                Post
              </button>
            </div>
          )}

          <div className="rev__actions">
            <button
              className="rev__btn primary-btn"
              onClick={() => toggleThread(review.id)}
            >
              {threadsOpen[review.id] ? 'Hide Comments' : 'Show All Comments'}
            </button>
          </div>

          {threadsOpen[review.id] && (
            <div className="rev__thread">
              {buildTree(commentsByReview[review.id]||[])
                .map(node => (
                  <CommentNode
                    key={node.id}
                    node={node}
                    reviewId={review.id}
                  />
                ))
              }
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
