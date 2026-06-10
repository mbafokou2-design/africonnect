import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUserPlus, faUsers, faSearch,
  faCheck, faXmark, faMessage,
  faUserMinus, faUser
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import './Network.css'

// TODO: fetch from ${import.meta.env.VITE_API_BASE_URL}/network/requests
const initialRequests = [
  { id:1, name:'Fatou Diallo',   titleEn:'Product Manager · Dakar',      titleFr:'Chef de Produit · Dakar',       avatar:'https://i.pravatar.cc/56?img=47', mutual:12 },
  { id:2, name:'Nadia Benali',   titleEn:'Marketing Lead · Casablanca',   titleFr:'Responsable Marketing · Casa',  avatar:'https://i.pravatar.cc/56?img=44', mutual:5  },
  { id:3, name:'Samuel Mwangi',  titleEn:'Data Scientist · Nairobi',      titleFr:'Data Scientist · Nairobi',      avatar:'https://i.pravatar.cc/56?img=55', mutual:15 },
]

// TODO: fetch from ${import.meta.env.VITE_API_BASE_URL}/network/connections
const initialConnections = [
  { id:1, name:'Awa Diop',      titleEn:'Full Stack Developer · Dakar',  titleFr:'Développeuse Full Stack · Dakar', avatar:'https://i.pravatar.cc/56?img=5'  },
  { id:2, name:'Kofi Mensah',   titleEn:'Tech Entrepreneur · Accra',     titleFr:'Entrepreneur Tech · Accra',       avatar:'https://i.pravatar.cc/56?img=12' },
  { id:3, name:'Emeka Okonkwo', titleEn:'Software Engineer · Lagos',     titleFr:'Ingénieur Logiciel · Lagos',      avatar:'https://i.pravatar.cc/56?img=15' },
  { id:4, name:'Amina Traoré',  titleEn:'UX Designer · Abidjan',         titleFr:'Designer UX · Abidjan',           avatar:'https://i.pravatar.cc/56?img=9'  },
]

// TODO: fetch from ${import.meta.env.VITE_API_BASE_URL}/network/suggestions
const suggestions = [
  { id:5, name:'Chidi Okafor',  titleEn:'Backend Engineer · Lagos',      titleFr:'Ingénieur Backend · Lagos',       avatar:'https://i.pravatar.cc/56?img=52', mutual:8  },
  { id:6, name:'Kwame Asante',  titleEn:'Investor · Accra',              titleFr:'Investisseur · Accra',            avatar:'https://i.pravatar.cc/56?img=53', mutual:20 },
  { id:7, name:'Aïcha Koné',    titleEn:'UX Researcher · Abidjan',       titleFr:'Chercheuse UX · Abidjan',         avatar:'https://i.pravatar.cc/56?img=48', mutual:3  },
  { id:8, name:'Zara Diallo',   titleEn:'Fintech Analyst · Dakar',       titleFr:'Analyste Fintech · Dakar',        avatar:'https://i.pravatar.cc/56?img=41', mutual:7  },
]

export default function Network() {
  const { lang } = useLang()
  const [requests,    setRequests]    = useState(initialRequests)
  const [connections, setConnections] = useState(initialConnections)
  const [connected,   setConnected]   = useState({})
  const [search,      setSearch]      = useState('')

  // Accept request
  const acceptRequest = (person) => {
    setConnections(prev => [...prev, person])
    setRequests(prev => prev.filter(r => r.id !== person.id))
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/network/requests/${person.id}/accept
  }

  // Refuse request
  const refuseRequest = (id) => {
    setRequests(prev => prev.filter(r => r.id !== id))
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/network/requests/${id}/refuse
  }

  // Remove connection
  const removeConnection = (id) => {
    setConnections(prev => prev.filter(c => c.id !== id))
    // TODO: DELETE ${import.meta.env.VITE_API_BASE_URL}/network/connections/${id}
  }

  // Send connection request
  const sendRequest = (id) => {
    setConnected(prev => ({ ...prev, [id]: true }))
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/network/connect/${id}
  }

  const filteredConnections = connections.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="network-page">

      {/* Header */}
      <div className="page-header">
        <div className="page-header__icon page-header__icon--primary">
          <FontAwesomeIcon icon={faUsers} />
        </div>
        <div>
          <h1 className="page-header__title"
            data-en="My Network" data-fr="Mon Réseau">
            {txt('My Network', 'Mon Réseau', lang)}
          </h1>
          <p className="page-header__sub">
            {txt('Grow your professional connections', 'Développez vos connexions professionnelles', lang)}
          </p>
        </div>
      </div>

      {/* ── Pending Requests ── */}
      {requests.length > 0 && (
        <div className="network-section">
          <div className="network-section__header">
            <h2 className="section-title">
              {txt('Connection Requests', 'Demandes de connexion', lang)}
              <span className="section-title__badge">{requests.length}</span>
            </h2>
          </div>
          <div className="network-requests-list">
            {requests.map(person => (
              <div key={person.id} className="request-card">
                <a href={`/profile/${person.id}`} className="request-card__user">
                  <img src={person.avatar} alt={person.name} className="request-card__avatar" />
                  <div className="request-card__info">
                    <span className="request-card__name">{person.name}</span>
                    <span className="request-card__title">
                      {txt(person.titleEn, person.titleFr, lang)}
                    </span>
                    <span className="request-card__mutual">
                      <FontAwesomeIcon icon={faUsers} />
                      {person.mutual} {txt('mutual', 'en commun', lang)}
                    </span>
                  </div>
                </a>
                <div className="request-card__actions">
                  <button
                    className="request-btn request-btn--accept"
                    onClick={() => acceptRequest(person)}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                    {txt('Accept', 'Accepter', lang)}
                  </button>
                  <button
                    className="request-btn request-btn--refuse"
                    onClick={() => refuseRequest(person.id)}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                    {txt('Refuse', 'Refuser', lang)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── My Connections ── */}
      <div className="network-section">
        <div className="network-section__header">
          <h2 className="section-title">
            {txt('My Connections', 'Mes Connexions', lang)}
            <span className="section-title__badge">{connections.length}</span>
          </h2>
        </div>

        {/* Search connections */}
        <div className="page-search" style={{ marginBottom: 12 }}>
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={txt('Search connections...', 'Rechercher connexions...', lang)}
          />
        </div>

        <div className="connections-list">
          {filteredConnections.map(person => (
            <div key={person.id} className="connection-card">

              {/* Click avatar/name → profile */}
              <a href={`/profile/${person.id}`} className="connection-card__user">
                <img src={person.avatar} alt={person.name} className="connection-card__avatar" />
                <div className="connection-card__info">
                  <span className="connection-card__name">{person.name}</span>
                  <span className="connection-card__title">
                    {txt(person.titleEn, person.titleFr, lang)}
                  </span>
                </div>
              </a>

              {/* Actions */}
              <div className="connection-card__actions">
                {/* View profile */}
                <a
                  href={`/profile/${person.id}`}
                  className="conn-btn conn-btn--profile"
                  title={txt('View profile', 'Voir profil', lang)}
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>{txt('Profile', 'Profil', lang)}</span>
                </a>

                {/* Message */}
                <a
                  href={`/messaging?user=${person.id}`}
                  className="conn-btn conn-btn--message"
                  title={txt('Send message', 'Envoyer message', lang)}
                >
                  <FontAwesomeIcon icon={faMessage} />
                  <span>{txt('Message', 'Message', lang)}</span>
                </a>

                {/* Remove */}
                <button
                  className="conn-btn conn-btn--remove"
                  onClick={() => removeConnection(person.id)}
                  title={txt('Remove connection', 'Supprimer connexion', lang)}
                >
                  <FontAwesomeIcon icon={faUserMinus} />
                </button>
              </div>

            </div>
          ))}
          {filteredConnections.length === 0 && (
            <div className="page-coming-soon">
              <span>🔍</span>
              <p>{txt('No connections found', 'Aucune connexion trouvée', lang)}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Suggestions ── */}
      <div className="network-section">
        <h2 className="section-title">
          {txt('People you may know', 'Personnes que vous pourriez connaître', lang)}
        </h2>
        <div className="network-grid">
          {suggestions.map(person => (
            <div key={person.id} className="network-card">
              <a href={`/profile/${person.id}`}>
                <img src={person.avatar} alt={person.name} className="network-card__avatar" />
              </a>
              <div className="network-card__info">
                <a href={`/profile/${person.id}`} className="network-card__name">
                  {person.name}
                </a>
                <span className="network-card__title">
                  {txt(person.titleEn, person.titleFr, lang)}
                </span>
                <span className="network-card__mutual">
                  <FontAwesomeIcon icon={faUsers} />
                  {person.mutual} {txt('mutual connections', 'connexions communes', lang)}
                </span>
              </div>
              <button
                className={`network-card__connect ${connected[person.id] ? 'sent' : ''}`}
                onClick={() => sendRequest(person.id)}
                disabled={connected[person.id]}
              >
                <FontAwesomeIcon icon={connected[person.id] ? faCheck : faUserPlus} />
                {connected[person.id]
                  ? txt('Request sent', 'Demande envoyée', lang)
                  : txt('Connect', 'Connecter', lang)
                }
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}