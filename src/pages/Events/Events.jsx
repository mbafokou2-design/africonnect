import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarDays, faSearch, faPlus,
  faStar, faCheck, faShare,
  faEllipsis, faLocationDot, faUsers,
  faGlobe, faVideo, faFilter,
  faChevronDown, faFire
} from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarReg } from '@fortawesome/free-regular-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import { myEvents, discoverEvents, eventCategories } from '../../data/eventsData'
import CreateEventModal from './CreateEventModal'
import './Events.css'

const dateFilters = [
  { id: 'any',      labelEn: 'Any date',      labelFr: 'N\'importe quelle date' },
  { id: 'today',    labelEn: 'Today',          labelFr: 'Aujourd\'hui'           },
  { id: 'tomorrow', labelEn: 'Tomorrow',       labelFr: 'Demain'                 },
  { id: 'weekend',  labelEn: 'This weekend',   labelFr: 'Ce week-end'            },
  { id: 'week',     labelEn: 'This week',      labelFr: 'Cette semaine'          },
  { id: 'month',    labelEn: 'This month',     labelFr: 'Ce mois'                },
]

const sortFilters = [
  { id: 'best',     labelEn: 'Best',           labelFr: 'Meilleurs'              },
  { id: 'friends',  labelEn: 'Friends',         labelFr: 'Ami(e)s'               },
  { id: 'following',labelEn: 'Following',       labelFr: 'Suivi(e)s'             },
]

function formatEventDate(dateStr, lang) {
  const d = new Date(dateStr)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) return lang === 'fr' ? `Aujourd'hui à ${d.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })}` : `Today at ${d.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })}`
  return lang === 'fr'
    ? d.toLocaleDateString('fr-FR', { weekday:'short', day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })
    : d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })
}

function formatDay(dateStr) {
  return new Date(dateStr).getDate()
}

function formatMonth(dateStr, lang) {
  const d = new Date(dateStr)
  return lang === 'fr'
    ? d.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()
    : d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
}

export default function Events() {
  const { lang }     = useLang()
  const { addToast } = useToast()
  const navigate     = useNavigate()

  const [myList,       setMyList]       = useState(myEvents)
  const [discList,     setDiscList]     = useState(discoverEvents)
  const [search,       setSearch]       = useState('')
  const [category,     setCategory]     = useState('all')
  const [dateFilter,   setDateFilter]   = useState('any')
  const [sortFilter,   setSortFilter]   = useState('best')
  const [showCreate,   setShowCreate]   = useState(false)
  const [menuId,       setMenuId]       = useState(null)
  const [dateDropOpen, setDateDropOpen] = useState(false)
  const [tab,          setTab]          = useState('discover') // discover | mine

  const handleStatus = (eventId, status, isMine = false) => {
    const updater = isMine ? setMyList : setDiscList
    updater(prev => prev.map(e =>
      e.id === eventId
        ? { ...e, status: e.status === status ? null : status }
        : e
    ))
    const label = status === 'interested'
      ? txt('Marked as interested!', 'Marqué comme intéressé !', lang)
      : txt('Marked as going!', 'Marqué comme participant !', lang)
    addToast(label, 'success')
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/events/${eventId}/status
  }

  const handleShare = (event, e) => {
    e.stopPropagation()
    const url = `${window.location.origin}/events/${event.id}`
    if (navigator.share) {
      navigator.share({ title: event.titleEn, url })
    } else {
      navigator.clipboard.writeText(url)
      addToast(txt('Link copied!', 'Lien copié !', lang), 'success')
    }
  }

  const filtered = discList.filter(e => {
    const matchSearch = !search ||
      e.titleEn.toLowerCase().includes(search.toLowerCase()) ||
      e.titleFr.toLowerCase().includes(search.toLowerCase()) ||
      e.locationEn.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'all' || e.category === category
    return matchSearch && matchCat
  })

  const dateFilterLabel = dateFilters.find(d => d.id === dateFilter)

  return (
    <div className="events-page">

      {/* ── Left sidebar ── */}


      {/* ── Main content ── */}
      <div className="events-main">

        {/* ── YOUR EVENTS ── */}
        {tab === 'mine' && (
          <div className="events-section">
            <div className="events-section__header">
              <h2>{txt('Your Events', 'Vos événements', lang)}</h2>
              <a href="#" className="events-section__see-all">
                {txt('See all', 'Voir tout', lang)}
              </a>
            </div>

            {myList.length === 0 ? (
              <div className="events-empty">
                <span>📅</span>
                <p>{txt('No upcoming events', 'Aucun événement à venir', lang)}</p>
                <button onClick={() => setShowCreate(true)}>
                  {txt('Create one', 'En créer un', lang)}
                </button>
              </div>
            ) : (
              myList.map(event => (
                <MyEventRow
                  key={event.id}
                  event={event}
                  lang={lang}
                  menuId={menuId}
                  setMenuId={setMenuId}
                  onStatus={(id, s) => handleStatus(id, s, true)}
                  onShare={handleShare}
                  onNavigate={() => navigate(`/events/${event.id}`)}
                />
              ))
            )}
          </div>
        )}

        {/* ── DISCOVER EVENTS ── */}
        {tab === 'discover' && (
          <>
            {/* My events compact strip */}
            {myList.length > 0 && (
              <div className="events-section">
                <div className="events-section__header">
                  <h2>{txt('Your Events', 'Vos événements', lang)}</h2>
                  <button className="events-section__see-all"
                    onClick={() => setTab('mine')}>
                    {txt('See all', 'Voir tout', lang)}
                  </button>
                </div>
                {myList.map(event => (
                  <MyEventRow
                    key={event.id}
                    event={event}
                    lang={lang}
                    menuId={menuId}
                    setMenuId={setMenuId}
                    onStatus={(id, s) => handleStatus(id, s, true)}
                    onShare={handleShare}
                    onNavigate={() => navigate(`/events/${event.id}`)}
                  />
                ))}
              </div>
            )}

            {/* Discover */}
            <div className="events-section">
              <div className="events-section__header">
                <h2>{txt('Discover Events', 'Découvrir des événements', lang)}</h2>
              </div>

              {/* Filter row */}
              <div className="events-filter-row">
                {/* Location */}
                <button className="events-filter-pill">
                  <FontAwesomeIcon icon={faLocationDot} />
                  {txt('My location', 'Ma localisation', lang)}
                  <FontAwesomeIcon icon={faChevronDown} />
                </button>

                {/* Date dropdown */}
                <div className="events-date-wrap">
                  <button
                    className="events-filter-pill"
                    onClick={() => setDateDropOpen(p => !p)}
                  >
                    <FontAwesomeIcon icon={faCalendarDays} />
                    {txt(dateFilterLabel.labelEn, dateFilterLabel.labelFr, lang)}
                    <FontAwesomeIcon icon={faChevronDown} />
                  </button>
                  {dateDropOpen && (
                    <div className="events-date-drop">
                      {dateFilters.map(d => (
                        <button
                          key={d.id}
                          className={`events-date-option ${dateFilter === d.id ? 'active' : ''}`}
                          onClick={() => { setDateFilter(d.id); setDateDropOpen(false) }}
                        >
                          {txt(d.labelEn, d.labelFr, lang)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sort pills */}
                {sortFilters.map(s => (
                  <button
                    key={s.id}
                    className={`events-filter-pill ${sortFilter === s.id ? 'active' : ''}`}
                    onClick={() => setSortFilter(s.id)}
                  >
                    {txt(s.labelEn, s.labelFr, lang)}
                  </button>
                ))}
              </div>

              {/* Events grid */}
              <div className="events-grid">
                {filtered.map(event => (
                  <DiscoverCard
                    key={event.id}
                    event={event}
                    lang={lang}
                    menuId={menuId}
                    setMenuId={setMenuId}
                    onStatus={(id, s) => handleStatus(id, s)}
                    onShare={handleShare}
                    onNavigate={() => navigate(`/events/${event.id}`)}
                  />
                ))}
                {filtered.length === 0 && (
                  <div className="events-empty" style={{ gridColumn:'1/-1' }}>
                    <span>🔍</span>
                    <p>{txt('No events found', 'Aucun événement trouvé', lang)}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

      </div>

      {/* ── Create Event Modal ── */}
      {showCreate && (
        <CreateEventModal
          onClose={() => setShowCreate(false)}
          lang={lang}
          onCreated={(newEvent) => {
            setMyList(prev => [newEvent, ...prev])
            setShowCreate(false)
            addToast(txt('Event created!', 'Événement créé !', lang), 'success')
          }}
        />
      )}

    </div>
  )
}

/* ── My Event Row ── */
function MyEventRow({ event, lang, menuId, setMenuId, onStatus, onShare, onNavigate }) {
  return (
    <div className="my-event-row" onClick={onNavigate}>
      {/* Thumbnail */}
      <div className="my-event-row__thumb">
        <img src={event.cover} alt={event.titleEn} />
        {event.isLive && (
          <div className="my-event-row__live">
            <FontAwesomeIcon icon={faFire} />
            {txt('Live', 'En cours', lang)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="my-event-row__info">
        <p className="my-event-row__date">
          {formatEventDate(event.dateStart, lang)}
        </p>
        <h3 className="my-event-row__title">
          {txt(event.titleEn, event.titleFr, lang)}
        </h3>
        <p className="my-event-row__location">
          {txt(event.venueEn, event.venueFr, lang)}
        </p>
        <p className="my-event-row__attending">
          <FontAwesomeIcon icon={faUsers} />
          {event.interested} {txt('interested', 'intéressés', lang)} · {event.going} {txt('going', 'participants', lang)}
        </p>
      </div>

      {/* Actions */}
      <div className="my-event-row__actions" onClick={e => e.stopPropagation()}>
        {/* Interested */}
        <button
          className={`my-event-row__action-btn ${event.status === 'interested' ? 'active' : ''}`}
          onClick={() => onStatus(event.id, 'interested')}
        >
          <FontAwesomeIcon icon={event.status === 'interested' ? faStar : faStarReg} />
          {txt('Interested', 'Intéressé(e)', lang)}
          <FontAwesomeIcon icon={faChevronDown} className="my-event-row__action-chevron" />
        </button>

        {/* Share */}
        <button className="my-event-row__icon-btn" onClick={e => onShare(event, e)}>
          <FontAwesomeIcon icon={faShare} />
          {txt('Share', 'Partager', lang)}
        </button>

        {/* 3-dot */}
        <div className="events-menu-wrap" style={{ position:'relative' }}>
          <button
            className="my-event-row__icon-btn my-event-row__icon-btn--dots"
            onClick={e => { e.stopPropagation(); setMenuId(prev => prev === event.id ? null : event.id) }}
          >
            <FontAwesomeIcon icon={faEllipsis} />
          </button>
          {menuId === event.id && (
            <EventMenu event={event} lang={lang} onClose={() => setMenuId(null)} />
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Discover Card ── */
function DiscoverCard({ event, lang, menuId, setMenuId, onStatus, onShare, onNavigate }) {
  const cat = eventCategories.find(c => c.id === event.category)
  return (
    <div className="discover-event-card" onClick={onNavigate}>
      {/* Cover */}
      <div className="discover-event-card__cover">
        <img src={event.cover} alt={event.titleEn} />
        {event.isLive && (
          <div className="discover-event-card__live">
            <FontAwesomeIcon icon={faFire} />
            {txt('Live', 'En cours', lang)}
          </div>
        )}
        {event.isOnline && (
          <div className="discover-event-card__online">
            <FontAwesomeIcon icon={faVideo} />
            {txt('Online', 'En ligne', lang)}
          </div>
        )}
        {/* 3-dot */}
        <div className="discover-event-card__menu-wrap" onClick={e => e.stopPropagation()}>
          <button
            className="discover-event-card__menu-btn"
            onClick={() => setMenuId(prev => prev === event.id ? null : event.id)}
          >
            <FontAwesomeIcon icon={faEllipsis} />
          </button>
          {menuId === event.id && (
            <EventMenu event={event} lang={lang} onClose={() => setMenuId(null)} />
          )}
        </div>
      </div>

      {/* Info */}
      <div className="discover-event-card__body">
        {/* Date badge */}
        <div className="discover-event-card__date-badge">
          <span className="discover-event-card__month">
            {formatMonth(event.dateStart, lang)}
          </span>
          <span className="discover-event-card__day">
            {formatDay(event.dateStart)}
          </span>
        </div>
        <div className="discover-event-card__info">
          <p className="discover-event-card__date-text">
            {formatEventDate(event.dateStart, lang)}
          </p>
          <h3 className="discover-event-card__title">
            {txt(event.titleEn, event.titleFr, lang)}
          </h3>
          <p className="discover-event-card__location">
            <FontAwesomeIcon icon={event.isOnline ? faGlobe : faLocationDot} />
            {txt(event.locationEn, event.locationFr, lang)}
          </p>
          <p className="discover-event-card__attending">
            <FontAwesomeIcon icon={faUsers} />
            {event.interested} {txt('interested', 'intéressés', lang)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="discover-event-card__footer" onClick={e => e.stopPropagation()}>
        <button
          className={`discover-event-card__interested ${event.status === 'interested' ? 'active' : ''}`}
          onClick={() => onStatus(event.id, 'interested')}
        >
          <FontAwesomeIcon icon={event.status === 'interested' ? faStar : faStarReg} />
          {txt('Interested', 'Intéressé(e)', lang)}
        </button>
        <button
          className="discover-event-card__share"
          onClick={e => onShare(event, e)}
        >
          <FontAwesomeIcon icon={faShare} />
        </button>
      </div>
    </div>
  )
}

/* ── Event Popup Menu ── */
function EventMenu({ event, lang, onClose }) {
  const { addToast } = useToast()
  const navigate = useNavigate()

  return (
    <div className="event-menu" onClick={e => e.stopPropagation()}>
      <button className="event-menu__item" onClick={() => { navigate(`/events/${event.id}`); onClose() }}>
        <FontAwesomeIcon icon={faCalendarDays} />
        <span>{txt('View event', 'Voir l\'événement', lang)}</span>
      </button>
      <button className="event-menu__item" onClick={() => {
        const url = `${window.location.origin}/events/${event.id}`
        if (navigator.share) navigator.share({ title: event.titleEn, url })
        else { navigator.clipboard.writeText(url); addToast(txt('Link copied!', 'Lien copié !', lang), 'success') }
        onClose()
      }}>
        <FontAwesomeIcon icon={faShare} />
        <span>{txt('Share event', 'Partager l\'événement', lang)}</span>
      </button>
      <button className="event-menu__item" onClick={() => {
        addToast(txt('Event saved!', 'Événement sauvegardé !', lang), 'success')
        onClose()
      }}>
        <FontAwesomeIcon icon={faStar} />
        <span>{txt('Save event', 'Sauvegarder', lang)}</span>
      </button>
      <div className="event-menu__divider" />
      <button className="event-menu__item event-menu__item--danger" onClick={() => {
        addToast(txt('Event reported', 'Événement signalé', lang), 'info')
        onClose()
      }}>
        <FontAwesomeIcon icon={faFilter} />
        <span>{txt('Report', 'Signaler', lang)}</span>
      </button>
    </div>
  )
}