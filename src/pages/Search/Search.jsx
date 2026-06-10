import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch, faUserPlus, faCheck,
  faSpinner, faUsers, faBriefcase,
  faFileAlt
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import './Search.css'

// TODO: replace with ${import.meta.env.VITE_API_BASE_URL}/search?q=...
const allUsers = [
  { id:1, name:'Awa Diop',      titleEn:'Full Stack Developer · Dakar',   titleFr:'Développeuse Full Stack · Dakar', avatar:'https://i.pravatar.cc/56?img=5',  mutual:12, type:'user' },
  { id:2, name:'Kofi Mensah',   titleEn:'Tech Entrepreneur · Accra',      titleFr:'Entrepreneur Tech · Accra',       avatar:'https://i.pravatar.cc/56?img=12', mutual:8,  type:'user' },
  { id:3, name:'Amina Traoré',  titleEn:'UX Designer · Abidjan',          titleFr:'Designer UX · Abidjan',           avatar:'https://i.pravatar.cc/56?img=9',  mutual:5,  type:'user' },
  { id:4, name:'Emeka Okonkwo', titleEn:'Software Engineer · Lagos',      titleFr:'Ingénieur Logiciel · Lagos',      avatar:'https://i.pravatar.cc/56?img=15', mutual:20, type:'user' },
  { id:5, name:'Fatou Diallo',  titleEn:'Product Manager · Dakar',        titleFr:'Chef de Produit · Dakar',         avatar:'https://i.pravatar.cc/56?img=47', mutual:3,  type:'user' },
  { id:6, name:'Samuel Mwangi', titleEn:'Data Scientist · Nairobi',       titleFr:'Data Scientist · Nairobi',        avatar:'https://i.pravatar.cc/56?img=55', mutual:15, type:'user' },
  { id:7, name:'Wave',          titleEn:'Fintech Company · Senegal',      titleFr:'Entreprise Fintech · Sénégal',    avatar:'https://i.pravatar.cc/56?img=20', mutual:0,  type:'company' },
  { id:8, name:'AgriTech Solutions', titleEn:'AgriTech Startup · Cameroon', titleFr:'Startup AgriTech · Cameroun',  avatar:'https://i.pravatar.cc/56?img=30', mutual:0,  type:'company' },
]

const tabs = [
  { id:'all',     iconEn:'All',      iconFr:'Tout',       icon: faSearch    },
  { id:'people',  iconEn:'People',   iconFr:'Personnes',  icon: faUsers     },
  { id:'jobs',    iconEn:'Jobs',     iconFr:'Emplois',    icon: faBriefcase },
  { id:'posts',   iconEn:'Posts',    iconFr:'Publications', icon: faFileAlt  },
]

export default function Search() {
  const { lang } = useLang()
  const [query,      setQuery]      = useState('')
  const [activeTab,  setActiveTab]  = useState('all')
  const [loading,    setLoading]    = useState(false)
  const [results,    setResults]    = useState([])
  const [connected,  setConnected]  = useState({})

  // Simulate search with loading
  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    setLoading(true)
    const timer = setTimeout(() => {
      // TODO: fetch(`${import.meta.env.VITE_API_BASE_URL}/search?q=${query}&type=${activeTab}`)
      const filtered = allUsers.filter(u =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.titleEn.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [query, activeTab])

  const connect = (id) => {
    setConnected(prev => ({ ...prev, [id]: true }))
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/network/connect/${id}
  }

  return (
    <div className="search-page">

      {/* Search input */}
      <div className="search-page__bar">
        <FontAwesomeIcon icon={faSearch} className="search-page__icon" />
        <input
          autoFocus
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={txt(
            'Search people, companies, jobs...',
            'Rechercher personnes, entreprises, emplois...',
            lang
          )}
          className="search-page__input"
        />
        {loading && (
          <FontAwesomeIcon icon={faSpinner} spin className="search-page__spinner" />
        )}
      </div>

      {/* Tabs */}
      <div className="search-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`search-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            <FontAwesomeIcon icon={t.icon} />
            <span>{txt(t.iconEn, t.iconFr, lang)}</span>
          </button>
        ))}
      </div>

      {/* Empty state */}
      {!query && (
        <div className="search-empty">
          <span>🔍</span>
          <p>{txt('Start typing to search', 'Commencez à taper pour rechercher', lang)}</p>
          <span className="search-empty__hint">
            {txt('Search for people, companies, jobs and more', 'Recherchez des personnes, entreprises, emplois et plus', lang)}
          </span>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="search-results">
          {[1,2,3].map(i => (
            <div key={i} className="search-skeleton">
              <div className="skeleton skeleton--avatar" />
              <div className="search-skeleton__info">
                <div className="skeleton skeleton--line skeleton--line-lg" />
                <div className="skeleton skeleton--line skeleton--line-sm" />
              </div>
              <div className="skeleton skeleton--btn" />
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && query && results.length === 0 && (
        <div className="search-empty">
          <span>😔</span>
          <p>{txt('No results found', 'Aucun résultat trouvé', lang)}</p>
          <span className="search-empty__hint">"{query}"</span>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <p className="search-count">
            {results.length} {txt('results for', 'résultats pour', lang)} "<strong>{query}</strong>"
          </p>
          <div className="search-results">
            {results.map(user => (
              <div key={user.id} className="search-result-card">
                <a href={`/profile/${user.id}`} className="search-result-card__user">
                  <div className="search-result-card__avatar-wrap">
                    <img src={user.avatar} alt={user.name} />
                    {user.type === 'company' && (
                      <div className="search-result-card__type-badge">
                        <FontAwesomeIcon icon={faBriefcase} />
                      </div>
                    )}
                  </div>
                  <div className="search-result-card__info">
                    <span className="search-result-card__name">{user.name}</span>
                    <span className="search-result-card__title">
                      {txt(user.titleEn, user.titleFr, lang)}
                    </span>
                    {user.mutual > 0 && (
                      <span className="search-result-card__mutual">
                        <FontAwesomeIcon icon={faUsers} />
                        {user.mutual} {txt('mutual', 'en commun', lang)}
                      </span>
                    )}
                  </div>
                </a>
                {user.type === 'user' && (
                  <button
                    className={`search-connect-btn ${connected[user.id] ? 'sent' : ''}`}
                    onClick={() => connect(user.id)}
                    disabled={connected[user.id]}
                  >
                    <FontAwesomeIcon icon={connected[user.id] ? faCheck : faUserPlus} />
                    <span>
                      {connected[user.id]
                        ? txt('Sent', 'Envoyé', lang)
                        : txt('Connect', 'Connecter', lang)}
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  )
}