import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft, faLocationDot, faUsers,
  faClock, faGlobe, faShare, faEllipsis,
  faStar, faCheck, faFire, faVideo,
  faCalendarDays, faUserPlus, faComment,
  faBell, faBellSlash, faFlag, faLink
} from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarReg } from '@fortawesome/free-regular-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import { myEvents, discoverEvents } from '../../data/eventsData'
import PostCard from '../../components/feed/PostCard'
import './EventDetail.css'

const allEvents = [...myEvents, ...discoverEvents]

function formatFullDate(start, end, lang) {
  const s = new Date(start)
  const e = new Date(end)
  const opts = { weekday:'long', day:'numeric', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' }
  if (lang === 'fr') {
    return `Du ${s.toLocaleDateString('fr-FR', opts)} au ${e.toLocaleDateString('fr-FR', opts)}`
  }
  return `${s.toLocaleDateString('en-US', opts)} – ${e.toLocaleDateString('en-US', opts)}`
}

function formatDay(dateStr) { return new Date(dateStr).getDate() }
function formatMonthShort(dateStr, lang) {
  return new Date(dateStr).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { month:'short' }).toUpperCase()
}

const fakeAttendees = [
  { id:1, name:'Awa Diop',      avatar:'https://i.pravatar.cc/32?img=5'  },
  { id:2, name:'Kofi Mensah',   avatar:'https://i.pravatar.cc/32?img=12' },
  { id:3, name:'Amina Traoré',  avatar:'https://i.pravatar.cc/32?img=9'  },
  { id:4, name:'Emeka Okonkwo', avatar:'https://i.pravatar.cc/32?img=15' },
  { id:5, name:'Fatou Diallo',  avatar:'https://i.pravatar.cc/32?img=47' },
]

const fakePost = {
  id: 301,
  user: { name:'AfriConnect', avatar:'https://i.pravatar.cc/48?img=11', titleEn:'Official Account', titleFr:'Compte Officiel', verified: true },
  timeEn:'1h ago', timeFr:'Il y a 1h', visibility:'public',
  contentEn:"🎉 We're excited to announce the full agenda for our upcoming summit! Check the details and RSVP now. Limited seats available.",
  contentFr:"🎉 Nous sommes ravis d'annoncer l'agenda complet de notre sommet ! Consultez les détails et confirmez votre présence. Places limitées.",
  image: null,
  reactions:{ like:45, love:12, clap:8, total:65 },
  commentsCount:14, sharesCount:22,
  tags:['Event', 'Africa'],
}

export default function EventDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { lang }     = useLang()
  const { addToast } = useToast()

  const event = allEvents.find(e => e.id === Number(id)) || allEvents[0]

  const [status,   setStatus]   = useState(event.status)
  const [notified, setNotified] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [tab,      setTab]      = useState('about') // about | discussion

  const handleStatus = (s) => {
    setStatus(prev => prev === s ? null : s)
    const label = s === 'interested'
      ? txt('Marked as interested!', 'Marqué comme intéressé !', lang)
      : txt("You're going!", 'Vous participez !', lang)
    addToast(label, 'success')
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/events/${event.id}/status
  }

  const handleShare = () => {
    const url = `${window.location.origin}/events/${event.id}`
    if (navigator.share) {
      navigator.share({ title: txt(event.titleEn, event.titleFr, lang), url })
    } else {
      navigator.clipboard.writeText(url)
      addToast(txt('Link copied!', 'Lien copié !', lang), 'success')
    }
  }

  const handleInvite = () => {
    addToast(txt('Invite feature coming soon!', 'Inviter bientôt disponible !', lang), 'info')
    // TODO: open invite modal
  }

  return (
    <div className="event-detail">

      {/* ── Back ── */}
      <button className="event-detail__back" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>{txt('Events', 'Événements', lang)}</span>
      </button>

      {/* ── Cover ── */}
      <div className="event-detail__cover-wrap">

        {/* Date badge */}
        <div className="event-detail__date-badge">
          <span className="event-detail__date-month">
            {formatMonthShort(event.dateStart, lang)}
          </span>
          <span className="event-detail__date-day">
            {formatDay(event.dateStart)}
          </span>
        </div>

        <div className="event-detail__cover">
          <img src={event.cover} alt={txt(event.titleEn, event.titleFr, lang)} />
          {event.isLive && (
            <div className="event-detail__live">
              <FontAwesomeIcon icon={faFire} />
              {txt('Live now', 'En cours', lang)}
            </div>
          )}
          {event.isOnline && (
            <div className="event-detail__online-badge">
              <FontAwesomeIcon icon={faVideo} />
              {txt('Online event', 'Événement en ligne', lang)}
            </div>
          )}
        </div>
      </div>

      {/* ── Title + Actions ── */}
      <div className="event-detail__header">
        <div className="event-detail__header-left">
          <p className="event-detail__date-text">
            {formatFullDate(event.dateStart, event.dateEnd, lang)}
          </p>
          <h1 className="event-detail__title">
            {txt(event.titleEn, event.titleFr, lang)}
          </h1>
          <p className="event-detail__location-line">
            <FontAwesomeIcon icon={event.isOnline ? faGlobe : faLocationDot} />
            {txt(event.venueEn, event.venueFr, lang)} · {txt(event.locationEn, event.locationFr, lang)}
          </p>
        </div>

        {/* Action buttons */}
        <div className="event-detail__actions">
          {/* Interested */}
          <button
            className={`event-detail__action-btn ${status === 'interested' ? 'active-interested' : ''}`}
            onClick={() => handleStatus('interested')}
          >
            <FontAwesomeIcon icon={status === 'interested' ? faStar : faStarReg} />
            {txt('Interested', 'Intéressé(e)', lang)}
            <FontAwesomeIcon icon={faArrowLeft} className="event-detail__action-chevron" style={{ transform:'rotate(270deg)' }} />
          </button>

          {/* Going */}
          <button
            className={`event-detail__action-btn event-detail__action-btn--going ${status === 'going' ? 'active-going' : ''}`}
            onClick={() => handleStatus('going')}
          >
            <FontAwesomeIcon icon={status === 'going' ? faCheck : faCalendarDays} />
            {status === 'going'
              ? txt('Going', 'Je participe', lang)
              : txt('Going?', 'Je participe', lang)}
          </button>

          {/* Invite */}
          <button className="event-detail__icon-btn" onClick={handleInvite}
            title={txt('Invite', 'Inviter', lang)}>
            <FontAwesomeIcon icon={faUserPlus} />
            <span>{txt('Invite', 'Inviter', lang)}</span>
          </button>

          {/* Share */}
          <button className="event-detail__icon-btn" onClick={handleShare}
            title={txt('Share', 'Partager', lang)}>
            <FontAwesomeIcon icon={faShare} />
            <span>{txt('Share', 'Partager', lang)}</span>
          </button>

          {/* Notify */}
          <button
            className={`event-detail__icon-btn ${notified ? 'event-detail__icon-btn--notified' : ''}`}
            onClick={() => {
              setNotified(p => !p)
              addToast(
                notified
                  ? txt('Notifications off', 'Notifications désactivées', lang)
                  : txt('You\'ll be notified!', 'Vous serez notifié !', lang),
                'success'
              )
            }}
          >
            <FontAwesomeIcon icon={notified ? faBellSlash : faBell} />
          </button>

          {/* More */}
          <div style={{ position:'relative' }}>
            <button
              className="event-detail__icon-btn"
              onClick={() => setMenuOpen(p => !p)}
            >
              <FontAwesomeIcon icon={faEllipsis} />
            </button>
            {menuOpen && (
              <div className="event-detail__menu">
                <button className="event-detail__menu-item" onClick={() => {
                  handleShare(); setMenuOpen(false)
                }}>
                  <FontAwesomeIcon icon={faLink} />
                  <span>{txt('Copy link', 'Copier le lien', lang)}</span>
                </button>
                <button className="event-detail__menu-item" onClick={() => setMenuOpen(false)}>
                  <FontAwesomeIcon icon={faCalendarDays} />
                  <span>{txt('Add to calendar', 'Ajouter au calendrier', lang)}</span>
                </button>
                <div className="event-detail__menu-divider" />
                <button className="event-detail__menu-item event-detail__menu-item--danger"
                  onClick={() => {
                    addToast(txt('Reported', 'Signalé', lang), 'info')
                    setMenuOpen(false)
                  }}>
                  <FontAwesomeIcon icon={faFlag} />
                  <span>{txt('Report event', 'Signaler l\'événement', lang)}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="event-detail__tabs">
        <button
          className={`event-detail__tab ${tab === 'about' ? 'active' : ''}`}
          onClick={() => setTab('about')}
        >
          {txt('About', 'À propos', lang)}
        </button>
        <button
          className={`event-detail__tab ${tab === 'discussion' ? 'active' : ''}`}
          onClick={() => setTab('discussion')}
        >
          {txt('Discussion', 'Discussion', lang)}
        </button>
      </div>

      {/* ════════ ABOUT ════════ */}
      {tab === 'about' && (
        <div className="event-detail__about">

          <div className="event-detail__about-grid">

            {/* Left: details */}
            <div className="event-detail__about-left">

              {/* Details card */}
              <div className="event-detail__card">
                <h3 className="event-detail__card-title">
                  {txt('Details', 'Détails', lang)}
                </h3>

                <div className="event-detail__detail-rows">
                  {/* Attending */}
                  <div className="event-detail__detail-row">
                    <div className="event-detail__detail-icon">
                      <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <div>
                      <p className="event-detail__detail-main">
                        {event.interested} {txt('people responded', 'personnes ont répondu', lang)}
                      </p>
                      <div className="event-detail__attendee-avatars">
                        {fakeAttendees.map(a => (
                          <img key={a.id} src={a.avatar} alt={a.name}
                            title={a.name} />
                        ))}
                        {event.interested > 5 && (
                          <div className="event-detail__attendee-more">
                            +{event.interested - 5}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Organizer */}
                  <div className="event-detail__detail-row">
                    <img src={event.organizerAvatar} alt={event.organizer}
                      className="event-detail__organizer-avatar" />
                    <div>
                      <p className="event-detail__detail-sub">
                        {txt('Event by', 'Événement de', lang)}
                      </p>
                      <p className="event-detail__detail-main">{event.organizer}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="event-detail__detail-row">
                    <div className="event-detail__detail-icon">
                      <FontAwesomeIcon icon={event.isOnline ? faGlobe : faLocationDot} />
                    </div>
                    <div>
                      <p className="event-detail__detail-main">
                        {txt(event.venueEn, event.venueFr, lang)}
                      </p>
                      <p className="event-detail__detail-sub">
                        {txt(event.locationEn, event.locationFr, lang)}
                      </p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="event-detail__detail-row">
                    <div className="event-detail__detail-icon">
                      <FontAwesomeIcon icon={faClock} />
                    </div>
                    <div>
                      <p className="event-detail__detail-main">
                        {formatFullDate(event.dateStart, event.dateEnd, lang)}
                      </p>
                    </div>
                  </div>

                  {/* Privacy */}
                  <div className="event-detail__detail-row">
                    <div className="event-detail__detail-icon">
                      <FontAwesomeIcon icon={faGlobe} />
                    </div>
                    <div>
                      <p className="event-detail__detail-main">
                        {event.isPublic
                          ? txt('Public · Everyone can see', 'Public · Tout le monde peut voir', lang)
                          : txt('Private event', 'Événement privé', lang)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="event-detail__desc">
                  <p>{txt(event.descEn, event.descFr, lang)}</p>
                </div>

                {/* Tags */}
                {event.tags && (
                  <div className="event-detail__tags">
                    {event.tags.map(tag => (
                      <span key={tag} className="event-detail__tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Organizer card */}
              <div className="event-detail__card">
                <h3 className="event-detail__card-title">
                  {txt('Meet the organizer', 'Rencontrez l\'organisateur', lang)}
                </h3>
                <div className="event-detail__organizer-card">
                  <img src={event.organizerAvatar} alt={event.organizer} />
                  <div>
                    <p className="event-detail__organizer-name">{event.organizer}</p>
                    <p className="event-detail__organizer-sub">
                      {txt('Event organizer', 'Organisateur de l\'événement', lang)}
                    </p>
                  </div>
                  <button className="event-detail__follow-btn">
                    <FontAwesomeIcon icon={faUserPlus} />
                    {txt('Follow', 'Suivre', lang)}
                  </button>
                </div>
              </div>

            </div>

            {/* Right: map */}
            <div className="event-detail__about-right">
              <div className="event-detail__map-card">
                {event.lat && event.lng ? (
                  <>
                    <div className="event-detail__map-placeholder">
                      {/* Map placeholder — replace with Google Maps iframe when API is ready */}
                      <div className="event-detail__map-placeholder-inner">
                        <FontAwesomeIcon icon={faLocationDot} />
                        <p>{txt(event.venueEn, event.venueFr, lang)}</p>
                        <span>{txt(event.locationEn, event.locationFr, lang)}</span>
                        {/* TODO: replace with:
                        <iframe
                          src={`https://maps.google.com/maps?q=${event.lat},${event.lng}&z=14&output=embed`}
                          width="100%" height="280" frameBorder="0"
                          style={{ border:0 }} allowFullScreen
                        /> */}
                      </div>
                    </div>
                    <div className="event-detail__map-footer">
                      <FontAwesomeIcon icon={faLocationDot} />
                      <span>{txt(event.venueEn, event.venueFr, lang)}, {txt(event.locationEn, event.locationFr, lang)}</span>
                    </div>
                  </>
                ) : (
                  <div className="event-detail__online-card">
                    <FontAwesomeIcon icon={faVideo} />
                    <p>{txt('Online event', 'Événement en ligne', lang)}</p>
                    <span>{txt('Link will be shared with attendees', 'Le lien sera partagé avec les participants', lang)}</span>
                    {/* TODO: show join link from API */}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ════════ DISCUSSION ════════ */}
      {tab === 'discussion' && (
        <div className="event-detail__discussion">
          <PostCard post={fakePost} />
          <div className="event-detail__api-note">
            📡 {txt('Event discussion will be loaded from API', 'La discussion de l\'événement sera chargée via l\'API', lang)}
          </div>
        </div>
      )}

    </div>
  )
}