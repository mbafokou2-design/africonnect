import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faThumbsUp, faComment, faShare, faPaperPlane,
  faEllipsis, faGlobe, faUsers, faBookmark,
  faFlag, faUserMinus, faBellSlash, faCheckCircle,
  faXmark, faPaperPlane as faSend, faChevronDown
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import './PostCard.css'

const reactionEmojis = [
  { id: 'like', emoji: '👍', label: 'Like',    labelFr: "J'aime"  },
  { id: 'love', emoji: '❤️', label: 'Love',    labelFr: "J'adore" },
  { id: 'clap', emoji: '👏', label: 'Clap',    labelFr: 'Bravo'   },
  { id: 'fire', emoji: '🔥', label: 'Fire',    labelFr: 'Feu'     },
  { id: 'idea', emoji: '💡', label: 'Insightful', labelFr: 'Instructif' },
]

// Fake comments — replace with API data
const fakeComments = [
  {
    id: 1,
    name: 'Kofi Mensah',
    avatar: 'https://i.pravatar.cc/36?img=12',
    time: '1h',
    timeFr: '1h',
    text: 'Congratulations! This is amazing work 🙌',
    textFr: 'Félicitations ! C\'est un travail incroyable 🙌',
    likes: 12,
  },
  {
    id: 2,
    name: 'Amina Traoré',
    avatar: 'https://i.pravatar.cc/36?img=9',
    time: '45min',
    timeFr: '45min',
    text: 'Very inspiring, keep it up! 💪',
    textFr: 'Très inspirant, continuez ! 💪',
    likes: 7,
  },
  {
    id: 3,
    name: 'Emeka Okonkwo',
    avatar: 'https://i.pravatar.cc/36?img=15',
    time: '30min',
    timeFr: '30min',
    text: 'Africa rising! This is the kind of innovation we need.',
    textFr: "L'Afrique se lève ! C'est le genre d'innovation dont nous avons besoin.",
    likes: 19,
  },
]

export default function PostCard({ post }) {
  const { lang }   = useLang()
  const [reaction, setReaction]           = useState(null)
  const [showReactions, setShowReactions] = useState(false)
  const [showMenu, setShowMenu]           = useState(false)
  const [saved, setSaved]                 = useState(false)
  const [expanded, setExpanded]           = useState(false)
  const [showComments, setShowComments]   = useState(false)
  const [commentText, setCommentText]     = useState('')
  const [comments, setComments]           = useState(fakeComments)
  const [submittingComment, setSubmittingComment] = useState(false)
  const commentInputRef = useRef()
  const menuRef = useRef()

  const content = lang === 'fr' ? post.contentFr : post.contentEn
  const isLong  = content.length > 200

  // Close menu on outside click
  useEffect(() => {
    if (!showMenu) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showMenu])

  // Auto-focus comment input when drawer opens
  useEffect(() => {
    if (showComments) {
      setTimeout(() => commentInputRef.current?.focus(), 300)
    }
  }, [showComments])

  const handleReaction = (r) => {
    setReaction(prev => prev?.id === r.id ? null : r)
    setShowReactions(false)
    // TODO: POST to API
    // fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${post.id}/reactions`, {
    //   method: 'POST', body: JSON.stringify({ type: r.id })
    // })
  }

  const handleShare = async () => {
    // Native share sheet — works on mobile and modern desktop
    if (navigator.share) {
      try {
        await navigator.share({
          title: `AfriConnect — ${post.user.name}`,
          text: content.slice(0, 120) + '...',
          url: `${window.location.origin}/post/${post.id}`,
        })
      } catch (e) {
        // User cancelled share — do nothing
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(
        `${window.location.origin}/post/${post.id}`
      )
      alert(txt('Link copied!', 'Lien copié !', lang))
    }
  }

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return
    setSubmittingComment(true)

    // TODO: POST to API
    // await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${post.id}/comments`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ text: commentText })
    // })

    await new Promise(r => setTimeout(r, 800)) // fake delay
    const newComment = {
      id: Date.now(),
      name: 'Jean Dupont',
      avatar: 'https://i.pravatar.cc/36?img=11',
      time: 'now',
      timeFr: 'maintenant',
      text: commentText,
      textFr: commentText,
      likes: 0,
    }
    setComments(prev => [...prev, newComment])
    setCommentText('')
    setSubmittingComment(false)
  }

  const visibilityIcon = post.visibility === 'public' ? faGlobe : faUsers

  return (
    <>
      <div className="postcard">

        {/* ── Header ── */}
        <div className="postcard__header">
          <img src={post.user.avatar} alt={post.user.name} className="postcard__avatar" />
          <div className="postcard__user-info">
            <div className="postcard__name-row">
              <span className="postcard__name">{post.user.name}</span>
              {post.user.verified && (
                <FontAwesomeIcon icon={faCheckCircle} className="postcard__verified" />
              )}
            </div>
            <span className="postcard__title">
              {txt(post.user.titleEn, post.user.titleFr, lang)}
            </span>
            <div className="postcard__meta">
              <span>{txt(post.timeEn, post.timeFr, lang)}</span>
              <span className="postcard__dot">·</span>
              <FontAwesomeIcon icon={visibilityIcon} className="postcard__visibility" />
            </div>
          </div>

          {/* 3-dot menu */}
          <div className="postcard__menu-wrap" ref={menuRef}>
            <button className="postcard__menu-btn" onClick={() => setShowMenu(p => !p)}>
              <FontAwesomeIcon icon={faEllipsis} />
            </button>
            {showMenu && (
              <div className="postcard__menu-drop">
                <button className="postcard__menu-item"
                  onClick={() => { setSaved(p => !p); setShowMenu(false) }}>
                  <FontAwesomeIcon icon={faBookmark} />
                  <span>{txt(saved ? 'Unsave' : 'Save post', saved ? 'Retirer' : 'Sauvegarder', lang)}</span>
                </button>
                <button className="postcard__menu-item" onClick={() => setShowMenu(false)}>
                  <FontAwesomeIcon icon={faBellSlash} />
                  <span>{txt('Mute', 'Désactiver', lang)}</span>
                </button>
                <button className="postcard__menu-item" onClick={() => setShowMenu(false)}>
                  <FontAwesomeIcon icon={faUserMinus} />
                  <span>{txt('Unfollow', 'Ne plus suivre', lang)}</span>
                </button>
                <button className="postcard__menu-item postcard__menu-item--danger"
                  onClick={() => setShowMenu(false)}>
                  <FontAwesomeIcon icon={faFlag} />
                  <span>{txt('Report', 'Signaler', lang)}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="postcard__content">
          <p className="postcard__text">
            {isLong && !expanded ? content.slice(0, 200) + '...' : content}
            {isLong && (
              <button className="postcard__read-more" onClick={() => setExpanded(p => !p)}>
                {expanded
                  ? txt(' See less', ' Voir moins', lang)
                  : txt(' See more', ' Voir plus', lang)}
              </button>
            )}
          </p>
          {post.tags && (
            <div className="postcard__tags">
              {post.tags.map(tag => (
                <a key={tag} href={`/search?q=${tag}`} className="postcard__tag">#{tag}</a>
              ))}
            </div>
          )}
        </div>

        {/* ── Image ── */}
        {post.image && (
          <div className="postcard__image-wrap">
            <img src={post.image} alt="post" className="postcard__image" />
            {/* REPLACE src with API image URL when backend ready */}
          </div>
        )}

        {/* ── Reaction summary ── */}
        <div className="postcard__reaction-summary">
          <div className="postcard__reaction-emojis">
            <span>👍</span><span>❤️</span><span>👏</span>
            <span className="postcard__reaction-count">{post.reactions.total}</span>
          </div>
          <button
            className="postcard__engagement-btn"
            onClick={() => setShowComments(true)}
          >
            {post.commentsCount} {txt('comments', 'commentaires', lang)}
            <span> · </span>
            {post.sharesCount} {txt('shares', 'partages', lang)}
          </button>
        </div>

        <div className="postcard__divider" />

        {/* ── Action bar ── */}
        <div className="postcard__actions">

          {/* Like with reaction picker */}
          <div
            className="postcard__action-wrap"
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setShowReactions(false)}
          >
            {showReactions && (
              <div className="postcard__reactions-picker">
                {reactionEmojis.map(r => (
                  <button
                    key={r.id}
                    className={`postcard__reaction-btn ${reaction?.id === r.id ? 'active' : ''}`}
                    onClick={() => handleReaction(r)}
                    title={lang === 'fr' ? r.labelFr : r.label}
                  >
                    {r.emoji}
                  </button>
                ))}
              </div>
            )}
            <button
              className={`postcard__action ${reaction ? 'postcard__action--reacted' : ''}`}
              onClick={() => reaction ? setReaction(null) : handleReaction(reactionEmojis[0])}
            >
              {reaction
                ? <span className="postcard__action-emoji">{reaction.emoji}</span>
                : <FontAwesomeIcon icon={faThumbsUp} />}
              <span>{reaction
                ? txt(reaction.label, reaction.labelFr, lang)
                : txt("Like", "J'aime", lang)}
              </span>
            </button>
          </div>

          {/* Comment */}
          <button className="postcard__action" onClick={() => setShowComments(true)}>
            <FontAwesomeIcon icon={faComment} />
            <span>{txt('Comment', 'Commenter', lang)}</span>
          </button>

          {/* Share — native share sheet */}
          <button className="postcard__action" onClick={handleShare}>
            <FontAwesomeIcon icon={faShare} />
            <span>{txt('Share', 'Partager', lang)}</span>
          </button>

          {/* Send */}
          <button className="postcard__action">
            <FontAwesomeIcon icon={faPaperPlane} />
            <span>{txt('Send', 'Envoyer', lang)}</span>
          </button>

        </div>
      </div>

      {/* ── Comment Drawer ── */}
      {showComments && (
        <div className="comment-overlay" onClick={() => setShowComments(false)}>
          <div className="comment-drawer" onClick={e => e.stopPropagation()}>

            {/* Drawer handle */}
            <div className="comment-drawer__handle" />

            {/* Header */}
            <div className="comment-drawer__header">
              <h3 className="comment-drawer__title">
                {txt('Comments', 'Commentaires', lang)}
                <span className="comment-drawer__count">{comments.length}</span>
              </h3>
              <button className="comment-drawer__close" onClick={() => setShowComments(false)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Post preview */}
            <div className="comment-drawer__post-preview">
              <img src={post.user.avatar} alt={post.user.name} />
              <p>{content.slice(0, 120)}{content.length > 120 ? '...' : ''}</p>
            </div>

            <div className="comment-drawer__divider" />

            {/* Comments list */}
            <div className="comment-drawer__list">
              {comments.map(c => (
                <div key={c.id} className="comment-item">
                  <img src={c.avatar} alt={c.name} className="comment-item__avatar" />
                  <div className="comment-item__body">
                    <div className="comment-item__bubble">
                      <span className="comment-item__name">{c.name}</span>
                      <p className="comment-item__text">
                        {txt(c.text, c.textFr, lang)}
                      </p>
                    </div>
                    <div className="comment-item__actions">
                      <span className="comment-item__time">
                        {txt(c.time, c.timeFr, lang)}
                      </span>
                      <button className="comment-item__like">
                        👍 {c.likes > 0 && c.likes}
                      </button>
                      <button className="comment-item__reply">
                        {txt('Reply', 'Répondre', lang)}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment input */}
            <div className="comment-drawer__input-wrap">
              <img
                src="https://i.pravatar.cc/36?img=11"
                alt="Jean"
                className="comment-drawer__input-avatar"
              />
              <div className="comment-drawer__input-box">
                <input
                  ref={commentInputRef}
                  type="text"
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCommentSubmit()}
                  placeholder={txt('Write a comment...', 'Écrire un commentaire...', lang)}
                  className="comment-drawer__input"
                />
                <button
                  className="comment-drawer__send"
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim() || submittingComment}
                >
                  <FontAwesomeIcon icon={faSend} />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  )
}