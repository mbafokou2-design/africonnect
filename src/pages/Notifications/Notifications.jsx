import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faThumbsUp, faUserPlus, faComment,
  faBriefcase, faBell, faCheck,
  faCheckDouble, faHeart, faUserCheck
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import './Notifications.css'

// TODO: fetch from ${import.meta.env.VITE_API_BASE_URL}/notifications
const initialNotifications = [
  {
    id: 1, type: 'like', read: false,
    avatar: 'https://i.pravatar.cc/44?img=5',
    nameEn: 'Awa Diop', nameFr: 'Awa Diop',
    bodyEn: 'liked your post about AgriTech.',
    bodyFr: 'a aimé votre post sur l\'AgriTech.',
    time: '2m',
    postImage: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=80&q=60',
  },
  {
    id: 2, type: 'connect', read: false,
    avatar: 'https://i.pravatar.cc/44?img=12',
    nameEn: 'Kofi Mensah', nameFr: 'Kofi Mensah',
    bodyEn: 'sent you a connection request.',
    bodyFr: 'vous a envoyé une demande de connexion.',
    time: '15m',
    postImage: null,
    actionAccept: true,
  },
  {
    id: 3, type: 'comment', read: false,
    avatar: 'https://i.pravatar.cc/44?img=9',
    nameEn: 'Amina Traoré', nameFr: 'Amina Traoré',
    bodyEn: 'commented on your post: "Very inspiring work! 🙌"',
    bodyFr: 'a commenté votre post : "Travail très inspirant ! 🙌"',
    time: '1h',
    postImage: null,
  },
  {
    id: 4, type: 'job', read: true,
    avatar: null,
    company: 'Wave',
    nameEn: 'Wave', nameFr: 'Wave',
    bodyEn: 'New job matching your profile: Senior Mobile Developer · Dakar',
    bodyFr: 'Nouvel emploi pour vous : Développeur Mobile Senior · Dakar',
    time: '3h',
    postImage: null,
  },
  {
    id: 5, type: 'like', read: true,
    avatar: 'https://i.pravatar.cc/44?img=15',
    nameEn: 'Emeka Okonkwo', nameFr: 'Emeka Okonkwo',
    bodyEn: 'liked your comment.',
    bodyFr: 'a aimé votre commentaire.',
    time: '5h',
    postImage: null,
  },
  {
    id: 6, type: 'connect_accepted', read: true,
    avatar: 'https://i.pravatar.cc/44?img=44',
    nameEn: 'Nadia Benali', nameFr: 'Nadia Benali',
    bodyEn: 'accepted your connection request. You are now connected!',
    bodyFr: 'a accepté votre demande de connexion. Vous êtes maintenant connectés !',
    time: '1d',
    postImage: null,
  },
  {
    id: 7, type: 'comment', read: true,
    avatar: 'https://i.pravatar.cc/44?img=53',
    nameEn: 'Kwame Asante', nameFr: 'Kwame Asante',
    bodyEn: 'replied to your comment: "Great point about the market!"',
    bodyFr: 'a répondu à votre commentaire : "Bon point sur le marché !"',
    time: '2d',
    postImage: null,
  },
]

const typeConfig = {
  like:             { icon: faThumbsUp,   bg: '#fef3c7', color: '#d97706', label: 'liked'       },
  love:             { icon: faHeart,      bg: '#fee2e2', color: '#ef4444', label: 'loved'        },
  comment:          { icon: faComment,    bg: '#ede9fe', color: '#7c3aed', label: 'commented'    },
  connect:          { icon: faUserPlus,   bg: '#dcfce7', color: '#16a34a', label: 'connected'    },
  connect_accepted: { icon: faUserCheck,  bg: '#dcfce7', color: '#16a34a', label: 'accepted'     },
  job:              { icon: faBriefcase,  bg: '#e0e7ff', color: '#4338ca', label: 'job'          },
}

export default function Notifications() {
  const { lang }     = useLang()
  const { addToast } = useToast()

  const [notifs,   setNotifs]   = useState(initialNotifications)
  const [accepted, setAccepted] = useState({})
  const [filter,   setFilter]   = useState('all') // all | unread

  const unreadCount = notifs.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
    addToast(
      txt('All notifications marked as read', 'Toutes les notifications marquées comme lues', lang),
      'success'
    )
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/notifications/mark-all-read
  }

  const markOneRead = (id) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/notifications/${id}/read
  }

  const acceptConnection = (id) => {
    setAccepted(prev => ({ ...prev, [id]: true }))
    markOneRead(id)
    addToast(txt('Connection accepted!', 'Connexion acceptée !', lang), 'success')
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/network/requests/${id}/accept
  }

  const declineConnection = (id) => {
    setNotifs(prev => prev.filter(n => n.id !== id))
    addToast(txt('Request declined', 'Demande refusée', lang), 'info')
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/network/requests/${id}/decline
  }

  const displayed = filter === 'unread'
    ? notifs.filter(n => !n.read)
    : notifs

  const newNotifs  = displayed.filter(n => !n.read)
  const oldNotifs  = displayed.filter(n =>  n.read)

  return (
    <div className="notif-page">

      {/* ── Header ── */}
      <div className="notif-page__header">
        <div className="notif-page__header-left">
          <h1 className="notif-page__title"
            data-en="Notifications" data-fr="Notifications">
            {txt('Notifications', 'Notifications', lang)}
          </h1>
          {unreadCount > 0 && (
            <span className="notif-page__unread-badge">{unreadCount}</span>
          )}
        </div>
        <div className="notif-page__header-right">
          {/* Filter tabs */}
          <div className="notif-filter">
            <button
              className={`notif-filter__btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              {txt('All', 'Tout', lang)}
            </button>
            <button
              className={`notif-filter__btn ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              {txt('Unread', 'Non lues', lang)}
              {unreadCount > 0 && (
                <span className="notif-filter__count">{unreadCount}</span>
              )}
            </button>
          </div>
          {/* Mark all read */}
          {unreadCount > 0 && (
            <button className="notif-mark-all-btn" onClick={markAllRead}>
              <FontAwesomeIcon icon={faCheckDouble} />
              <span>{txt('Mark all read', 'Tout marquer lu', lang)}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── New notifications ── */}
      {newNotifs.length > 0 && (
        <div className="notif-group">
          <h2 className="notif-group__label">
            <span className="notif-group__dot notif-group__dot--new" />
            {txt('New', 'Nouveau', lang)}
          </h2>
          <div className="notif-list">
            {newNotifs.map(n => (
              <NotifCard
                key={n.id}
                n={n}
                lang={lang}
                accepted={accepted}
                onRead={markOneRead}
                onAccept={acceptConnection}
                onDecline={declineConnection}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Earlier ── */}
      {oldNotifs.length > 0 && (
        <div className="notif-group">
          <h2 className="notif-group__label">
            <span className="notif-group__dot notif-group__dot--old" />
            {txt('Earlier', 'Précédentes', lang)}
          </h2>
          <div className="notif-list">
            {oldNotifs.map(n => (
              <NotifCard
                key={n.id}
                n={n}
                lang={lang}
                accepted={accepted}
                onRead={markOneRead}
                onAccept={acceptConnection}
                onDecline={declineConnection}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {displayed.length === 0 && (
        <div className="notif-empty">
          <div className="notif-empty__icon">
            <FontAwesomeIcon icon={faBell} />
          </div>
          <p className="notif-empty__title">
            {txt('All caught up!', 'Vous êtes à jour !', lang)}
          </p>
          <p className="notif-empty__sub">
            {txt('No new notifications', 'Aucune nouvelle notification', lang)}
          </p>
        </div>
      )}

      {/* API note */}
      <div className="notif-api-note">
        <FontAwesomeIcon icon={faBell} />
        <span>{txt(
          'Real-time notifications coming via API',
          'Notifications en temps réel bientôt via l\'API',
          lang
        )}</span>
      </div>

    </div>
  )
}

function NotifCard({ n, lang, accepted, onRead, onAccept, onDecline }) {
  const config = typeConfig[n.type] || typeConfig.like

  return (
    <div
      className={`notif-card ${!n.read ? 'notif-card--unread' : ''}`}
      onClick={() => !n.read && onRead(n.id)}
    >
      {/* Unread dot */}
      {!n.read && <div className="notif-card__unread-dot" />}

      {/* Avatar + type icon */}
      <div className="notif-card__avatar-wrap">
        {n.avatar ? (
          <img src={n.avatar} alt={n.nameEn} className="notif-card__avatar" />
        ) : (
          <div className="notif-card__avatar-placeholder">
            {n.company?.[0] || n.nameEn[0]}
          </div>
        )}
        <div
          className="notif-card__type-icon"
          style={{ background: config.bg, color: config.color }}
        >
          <FontAwesomeIcon icon={config.icon} />
        </div>
      </div>

      {/* Content */}
      <div className="notif-card__content">
        <p className="notif-card__body">
          <a href={`/profile/1`} className="notif-card__name">
            {txt(n.nameEn, n.nameFr, lang)}
          </a>
          {' '}
          <span>{txt(n.bodyEn, n.bodyFr, lang)}</span>
        </p>
        <span className="notif-card__time">{n.time}</span>

        {/* Connection request actions */}
        {n.type === 'connect' && !accepted[n.id] && (
          <div className="notif-card__actions">
            <button
              className="notif-card__btn notif-card__btn--accept"
              onClick={e => { e.stopPropagation(); onAccept(n.id) }}
            >
              <FontAwesomeIcon icon={faCheck} />
              {txt('Accept', 'Accepter', lang)}
            </button>
            <button
              className="notif-card__btn notif-card__btn--decline"
              onClick={e => { e.stopPropagation(); onDecline(n.id) }}
            >
              {txt('Decline', 'Refuser', lang)}
            </button>
          </div>
        )}
        {n.type === 'connect' && accepted[n.id] && (
          <div className="notif-card__accepted">
            <FontAwesomeIcon icon={faUserCheck} />
            {txt('Connected', 'Connecté', lang)}
          </div>
        )}
      </div>

      {/* Post thumbnail */}
      {n.postImage && (
        <img src={n.postImage} alt="" className="notif-card__thumb" />
      )}

    </div>
  )
}