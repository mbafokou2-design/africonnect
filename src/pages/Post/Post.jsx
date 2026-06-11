import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft, faThumbsUp, faComment,
  faShare, faPaperPlane, faEllipsis,
  faGlobe, faUsers, faCheckCircle,
  faBookmark, faBellSlash, faUserMinus,
  faFlag, faSpinner, faCheck,
  faHeart, faFire, faLightbulb
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import './Post.css'

// TODO: fetch from ${import.meta.env.VITE_API_BASE_URL}/posts/:id
import feedPosts from '../../data/feedData'

const reactionEmojis = [
  { id:'like', emoji:'👍', label:'Like',        labelFr:"J'aime"      },
  { id:'love', emoji:'❤️', label:'Love',        labelFr:"J'adore"     },
  { id:'clap', emoji:'👏', label:'Clap',        labelFr:'Bravo'       },
  { id:'fire', emoji:'🔥', label:'Fire',        labelFr:'Feu'         },
  { id:'idea', emoji:'💡', label:'Insightful',  labelFr:'Instructif'  },
]

// Fake comments — TODO: fetch from ${import.meta.env.VITE_API_BASE_URL}/posts/:id/comments
const generateComments = () => [
  {
    id: 1,
    name: 'Kofi Mensah',
    avatar: 'https://i.pravatar.cc/40?img=12',
    titleEn: 'Tech Entrepreneur',
    titleFr: 'Entrepreneur Tech',
    timeEn: '1h ago',
    timeFr: 'Il y a 1h',
    textEn: 'Congratulations! This is exactly the kind of innovation Africa needs right now. Keep it up! 🙌',
    textFr: "Félicitations ! C'est exactement le genre d'innovation dont l'Afrique a besoin. Continuez ! 🙌",
    likes: 12,
    liked: false,
    replies: [
      {
        id: 11,
        name: 'Awa Diop',
        avatar: 'https://i.pravatar.cc/36?img=5',
        timeEn: '45min ago',
        timeFr: 'Il y a 45min',
        textEn: 'Totally agree! Very inspiring.',
        textFr: 'Totalement d\'accord ! Très inspirant.',
        likes: 3,
        liked: false,
      }
    ]
  },
  {
    id: 2,
    name: 'Amina Traoré',
    avatar: 'https://i.pravatar.cc/40?img=9',
    titleEn: 'UX Designer',
    titleFr: 'Designer UX',
    timeEn: '2h ago',
    timeFr: 'Il y a 2h',
    textEn: 'I would love to collaborate on something like this. Are you open to partnerships?',
    textFr: "J'adorerais collaborer sur quelque chose comme ça. Êtes-vous ouvert aux partenariats ?",
    likes: 7,
    liked: false,
    replies: []
  },
  {
    id: 3,
    name: 'Emeka Okonkwo',
    avatar: 'https://i.pravatar.cc/40?img=15',
    titleEn: 'Software Engineer',
    titleFr: 'Ingénieur Logiciel',
    timeEn: '3h ago',
    timeFr: 'Il y a 3h',
    textEn: 'Africa rising! This is the kind of innovation we need to see more of across the continent.',
    textFr: "L'Afrique se lève ! C'est le genre d'innovation que nous devons voir davantage sur le continent.",
    likes: 19,
    liked: false,
    replies: []
  },
  {
    id: 4,
    name: 'Fatou Diallo',
    avatar: 'https://i.pravatar.cc/40?img=47',
    titleEn: 'Product Manager',
    titleFr: 'Chef de Produit',
    timeEn: '5h ago',
    timeFr: 'Il y a 5h',
    textEn: 'This is amazing work. Would love to connect and learn more about your journey!',
    textFr: 'C\'est un travail incroyable. J\'adorerais me connecter et en apprendre plus sur votre parcours !',
    likes: 5,
    liked: false,
    replies: []
  },
]

export default function Post() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { lang }     = useLang()
  const { addToast } = useToast()

  // Find post — TODO: replace with API fetch
  const post = feedPosts.find(p => p.id === Number(id)) || feedPosts[0]

  const [reaction,      setReaction]      = useState(null)
  const [showReactions, setShowReactions] = useState(false)
  const [saved,         setSaved]         = useState(false)
  const [showMenu,      setShowMenu]      = useState(false)
  const [comments,      setComments]      = useState(generateComments)
  const [commentText,   setCommentText]   = useState('')
  const [submitting,    setSubmitting]    = useState(false)
  const [replyingTo,    setReplyingTo]    = useState(null) // comment id
  const [replyText,     setReplyText]     = useState('')
  const [expanded,      setExpanded]      = useState(false)
  const [sortBy,        setSortBy]        = useState('top') // top | recent
  const commentInputRef = useRef()
  const menuRef         = useRef()
  const replyInputRef   = useRef()

  const content  = lang === 'fr' ? post.contentFr : post.contentEn
  const isLong   = content.length > 300

  // Auto-focus comment input on mount
  useEffect(() => {
    setTimeout(() => commentInputRef.current?.focus(), 400)
  }, [])

  // Close menu outside click
  useEffect(() => {
    if (!showMenu) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showMenu])

  // Auto-focus reply input
  useEffect(() => {
    if (replyingTo) setTimeout(() => replyInputRef.current?.focus(), 200)
  }, [replyingTo])

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${post.id}`
    if (navigator.share) {
      await navigator.share({ title: post.user.name, url })
    } else {
      navigator.clipboard.writeText(url)
      addToast(txt('Link copied!', 'Lien copié !', lang), 'success')
    }
  }

  const handleReaction = (r) => {
    setReaction(prev => prev?.id === r.id ? null : r)
    setShowReactions(false)
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/posts/${post.id}/reactions
  }

  const submitComment = async () => {
    if (!commentText.trim()) return
    setSubmitting(true)
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/posts/${post.id}/comments
    await new Promise(r => setTimeout(r, 700))
    const newComment = {
      id: Date.now(),
      name: 'Jean Dupont',
      avatar: 'https://i.pravatar.cc/40?img=11',
      titleEn: 'Full Stack Developer',
      titleFr: 'Développeur Full Stack',
      timeEn: 'Just now',
      timeFr: 'À l\'instant',
      textEn: commentText,
      textFr: commentText,
      likes: 0,
      liked: false,
      replies: [],
    }
    setComments(prev => [newComment, ...prev])
    setCommentText('')
    setSubmitting(false)
    addToast(txt('Comment posted!', 'Commentaire publié !', lang), 'success')
  }

  const submitReply = async (commentId) => {
    if (!replyText.trim()) return
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/posts/${post.id}/comments/${commentId}/replies
    const newReply = {
      id: Date.now(),
      name: 'Jean Dupont',
      avatar: 'https://i.pravatar.cc/36?img=11',
      timeEn: 'Just now',
      timeFr: 'À l\'instant',
      textEn: replyText,
      textFr: replyText,
      likes: 0,
      liked: false,
    }
    setComments(prev => prev.map(c =>
      c.id === commentId
        ? { ...c, replies: [...c.replies, newReply] }
        : c
    ))
    setReplyText('')
    setReplyingTo(null)
  }

  const likeComment = (commentId, replyId = null) => {
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}/like
    setComments(prev => prev.map(c => {
      if (replyId) {
        return c.id === commentId
          ? {
              ...c,
              replies: c.replies.map(r =>
                r.id === replyId
                  ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 }
                  : r
              )
            }
          : c
      }
      return c.id === commentId
        ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
        : c
    }))
  }

  const sortedComments = [...comments].sort((a, b) =>
    sortBy === 'top' ? b.likes - a.likes : b.id - a.id
  )

  const visibilityIcon = post.visibility === 'public' ? faGlobe : faUsers

  return (
    <div className="post-page">

      {/* ── Top bar ── */}
      <div className="post-page__topbar">
        <button className="post-page__back" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1 className="post-page__title"
          data-en="Post" data-fr="Publication">
          {txt('Post', 'Publication', lang)}
        </h1>
        <div style={{ width: 36 }} />
      </div>

      {/* ── Post card ── */}
      <div className="post-page__card">

        {/* Header */}
        <div className="post-page__header">
          <a href={`/profile/${post.user.id || 1}`} className="post-page__user">
            <img src={post.user.avatar} alt={post.user.name} />
            <div>
              <div className="post-page__name-row">
                <span className="post-page__name">{post.user.name}</span>
                {post.user.verified && (
                  <FontAwesomeIcon icon={faCheckCircle} className="post-page__verified" />
                )}
              </div>
              <span className="post-page__user-title">
                {txt(post.user.titleEn, post.user.titleFr, lang)}
              </span>
              <div className="post-page__meta">
                <span>{txt(post.timeEn, post.timeFr, lang)}</span>
                <span>·</span>
                <FontAwesomeIcon icon={visibilityIcon} />
              </div>
            </div>
          </a>

          {/* 3-dot menu */}
          <div className="post-page__menu-wrap" ref={menuRef}>
            <button
              className="post-page__menu-btn"
              onClick={() => setShowMenu(p => !p)}
            >
              <FontAwesomeIcon icon={faEllipsis} />
            </button>
            {showMenu && (
              <div className="post-page__menu-drop">
                <button className="post-page__menu-item"
                  onClick={() => { setSaved(p => !p); setShowMenu(false) }}>
                  <FontAwesomeIcon icon={faBookmark} />
                  <span>{txt(saved ? 'Unsave' : 'Save', saved ? 'Retirer' : 'Sauvegarder', lang)}</span>
                </button>
                <button className="post-page__menu-item"
                  onClick={() => setShowMenu(false)}>
                  <FontAwesomeIcon icon={faBellSlash} />
                  <span>{txt('Mute', 'Désactiver', lang)}</span>
                </button>
                <button className="post-page__menu-item"
                  onClick={() => setShowMenu(false)}>
                  <FontAwesomeIcon icon={faUserMinus} />
                  <span>{txt('Unfollow', 'Ne plus suivre', lang)}</span>
                </button>
                <button className="post-page__menu-item post-page__menu-item--danger"
                  onClick={() => setShowMenu(false)}>
                  <FontAwesomeIcon icon={faFlag} />
                  <span>{txt('Report', 'Signaler', lang)}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="post-page__content">
          <p className="post-page__text">
            {isLong && !expanded
              ? content.slice(0, 300) + '...'
              : content}
            {isLong && (
              <button
                className="post-page__read-more"
                onClick={() => setExpanded(p => !p)}
              >
                {expanded
                  ? txt(' See less', ' Voir moins', lang)
                  : txt(' See more', ' Voir plus', lang)}
              </button>
            )}
          </p>
          {post.tags && (
            <div className="post-page__tags">
              {post.tags.map(tag => (
                <a key={tag} href={`/search?q=${tag}`} className="post-page__tag">
                  #{tag}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Image */}
        {post.image && (
          <div className="post-page__image-wrap">
            <img src={post.image} alt="post" />
          </div>
        )}

        {/* Reaction summary */}
        <div className="post-page__reaction-summary">
          <div className="post-page__reaction-emojis">
            <span>👍</span><span>❤️</span><span>👏</span>
            <span className="post-page__reaction-count">
              {post.reactions.total + (reaction ? 1 : 0)}
            </span>
          </div>
          <div className="post-page__engagement">
            <span>{comments.length} {txt('comments', 'commentaires', lang)}</span>
            <span>·</span>
            <span>{post.sharesCount} {txt('shares', 'partages', lang)}</span>
          </div>
        </div>

        <div className="post-page__divider" />

        {/* Actions */}
        <div className="post-page__actions">

          {/* Like with hover reactions */}
          <div
            className="post-page__action-wrap"
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setShowReactions(false)}
          >
            {showReactions && (
              <div className="post-page__reactions-picker">
                {reactionEmojis.map(r => (
                  <button
                    key={r.id}
                    className={`post-page__reaction-btn ${reaction?.id === r.id ? 'active' : ''}`}
                    onClick={() => handleReaction(r)}
                    title={lang === 'fr' ? r.labelFr : r.label}
                  >
                    {r.emoji}
                  </button>
                ))}
              </div>
            )}
            <button
              className={`post-page__action ${reaction ? 'post-page__action--reacted' : ''}`}
              onClick={() => reaction ? setReaction(null) : handleReaction(reactionEmojis[0])}
            >
              {reaction
                ? <span className="post-page__action-emoji">{reaction.emoji}</span>
                : <FontAwesomeIcon icon={faThumbsUp} />}
              <span>{reaction
                ? txt(reaction.label, reaction.labelFr, lang)
                : txt('Like', "J'aime", lang)}
              </span>
            </button>
          </div>

          <button
            className="post-page__action"
            onClick={() => commentInputRef.current?.focus()}
          >
            <FontAwesomeIcon icon={faComment} />
            <span>{txt('Comment', 'Commenter', lang)}</span>
          </button>

          <button className="post-page__action" onClick={handleShare}>
            <FontAwesomeIcon icon={faShare} />
            <span>{txt('Share', 'Partager', lang)}</span>
          </button>

          <button className="post-page__action">
            <FontAwesomeIcon icon={faPaperPlane} />
            <span>{txt('Send', 'Envoyer', lang)}</span>
          </button>

        </div>
      </div>

      {/* ── Comments section ── */}
      <div className="post-page__comments-section">

        {/* Section header */}
        <div className="comments-header">
          <h2 className="comments-header__title">
            {txt('Comments', 'Commentaires', lang)}
            <span className="comments-header__count">{comments.length}</span>
          </h2>
          {/* Sort */}
          <div className="comments-header__sort">
            <button
              className={`sort-btn ${sortBy === 'top' ? 'active' : ''}`}
              onClick={() => setSortBy('top')}
            >
              {txt('Top', 'Top', lang)}
            </button>
            <button
              className={`sort-btn ${sortBy === 'recent' ? 'active' : ''}`}
              onClick={() => setSortBy('recent')}
            >
              {txt('Recent', 'Récent', lang)}
            </button>
          </div>
        </div>

        {/* ── Add comment input ── */}
        <div className="comment-input-row">
          <img
            src="https://i.pravatar.cc/40?img=11"
            alt="Jean"
            className="comment-input-row__avatar"
          />
          <div className="comment-input-row__box">
            <input
              ref={commentInputRef}
              type="text"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitComment()}
              placeholder={txt(
                'Write a comment...',
                'Écrire un commentaire...',
                lang
              )}
              className="comment-input-row__input"
            />
            <button
              className="comment-input-row__send"
              onClick={submitComment}
              disabled={!commentText.trim() || submitting}
            >
              {submitting
                ? <FontAwesomeIcon icon={faSpinner} spin />
                : <FontAwesomeIcon icon={faPaperPlane} />}
            </button>
          </div>
        </div>

        {/* ── Comments list ── */}
        <div className="comments-list">
          {sortedComments.length === 0 && (
            <div className="comments-empty">
              <span>💬</span>
              <p>{txt('Be the first to comment', 'Soyez le premier à commenter', lang)}</p>
            </div>
          )}

          {sortedComments.map(comment => (
            <div key={comment.id} className="comment-item">

              {/* Comment */}
              <div className="comment-item__main">
                <a href={`/profile/${comment.id}`} className="comment-item__avatar-link">
                  <img
                    src={comment.avatar}
                    alt={comment.name}
                    className="comment-item__avatar"
                  />
                </a>
                <div className="comment-item__body">
                  <div className="comment-item__bubble">
                    <a href={`/profile/${comment.id}`} className="comment-item__name">
                      {comment.name}
                    </a>
                    <span className="comment-item__user-title">
                      {txt(comment.titleEn, comment.titleFr, lang)}
                    </span>
                    <p className="comment-item__text">
                      {txt(comment.textEn, comment.textFr, lang)}
                    </p>
                  </div>
                  <div className="comment-item__actions">
                    <span className="comment-item__time">
                      {txt(comment.timeEn, comment.timeFr, lang)}
                    </span>
                    <button
                      className={`comment-item__like-btn ${comment.liked ? 'liked' : ''}`}
                      onClick={() => likeComment(comment.id)}
                    >
                      👍 {comment.likes > 0 && (
                        <span>{comment.likes}</span>
                      )}
                    </button>
                    <button
                      className="comment-item__reply-btn"
                      onClick={() => setReplyingTo(
                        replyingTo === comment.id ? null : comment.id
                      )}
                    >
                      {txt('Reply', 'Répondre', lang)}
                    </button>
                  </div>

                  {/* Reply input */}
                  {replyingTo === comment.id && (
                    <div className="reply-input-row">
                      <img
                        src="https://i.pravatar.cc/32?img=11"
                        alt="Jean"
                        className="reply-input-row__avatar"
                      />
                      <div className="reply-input-row__box">
                        <input
                          ref={replyInputRef}
                          type="text"
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && submitReply(comment.id)}
                          placeholder={txt(
                            `Reply to ${comment.name}...`,
                            `Répondre à ${comment.name}...`,
                            lang
                          )}
                          className="reply-input-row__input"
                        />
                        <button
                          className="reply-input-row__send"
                          onClick={() => submitReply(comment.id)}
                          disabled={!replyText.trim()}
                        >
                          <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="replies-list">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="reply-item">
                          <a href={`/profile/${reply.id}`}>
                            <img
                              src={reply.avatar}
                              alt={reply.name}
                              className="reply-item__avatar"
                            />
                          </a>
                          <div className="reply-item__body">
                            <div className="reply-item__bubble">
                              <a href={`/profile/${reply.id}`} className="reply-item__name">
                                {reply.name}
                              </a>
                              <p className="reply-item__text">
                                {txt(reply.textEn, reply.textFr, lang)}
                              </p>
                            </div>
                            <div className="reply-item__actions">
                              <span className="comment-item__time">
                                {txt(reply.timeEn, reply.timeFr, lang)}
                              </span>
                              <button
                                className={`comment-item__like-btn ${reply.liked ? 'liked' : ''}`}
                                onClick={() => likeComment(comment.id, reply.id)}
                              >
                                👍 {reply.likes > 0 && <span>{reply.likes}</span>}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  )
}