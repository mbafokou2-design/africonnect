import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGlobe, faUsers, faBriefcase, faCalendarDays,
  faHouse, faMoneyBillTransfer, faChartLine,
  faMapPin, faNewspaper, faSearch, faArrowRight,
  faLocationDot, faUserPlus, faCheck, faHeart,
  faFire, faVideo, faStar, faQuoteLeft,
  faBuilding, faSeedling, faKey
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import {
  hostCountries, originCountries,
  diasporaMembers, diasporaOpportunities,
  exchangeRates, diasporaEvents, diasporaStories
} from '../../data/diasporaData'
import './Diaspora.css'

const oppIcons = { job: faBriefcase, invest: faSeedling, property: faKey }
const navItems = [
  { id:'home',       icon: faHouse,              en:'Home',              fr:'Accueil'            },
  { id:'members',    icon: faUsers,              en:'Members',           fr:'Membres',    badge:200 },
  { id:'jobs',       icon: faBriefcase,          en:'Opportunities',     fr:'Opportunités'       },
  { id:'events',     icon: faCalendarDays,       en:'Events',            fr:'Événements'         },
  { id:'groups',     icon: faGlobe,              en:'Groups',            fr:'Groupes'            },
  { id:'send',       icon: faMoneyBillTransfer,  en:'Send Money',        fr:'Envoyer de l\'argent'},
  { id:'invest',     icon: faChartLine,          en:'Invest in Africa',  fr:'Investir en Afrique'},
  { id:'deals',      icon: faMapPin,             en:'Home Country Deals',fr:'Deals au pays'      },
  { id:'news',       icon: faNewspaper,          en:'Africa News',       fr:'Actualités Afrique' },
]

export default function Diaspora() {
  const { lang }     = useLang()
  const { addToast } = useToast()
  const navigate     = useNavigate()

  const [activeNav,     setActiveNav]     = useState('home')
  const [hostFilter,    setHostFilter]    = useState('france')
  const [originFilter,  setOriginFilter]  = useState('cameroon')
  const [connected,     setConnected]     = useState({})
  const [sendMoneyOpen, setSendMoneyOpen] = useState(false)
  const [fromCurrency,  setFromCurrency]  = useState('EUR')
  const [sendAmount,    setSendAmount]    = useState(100)
  const [search,        setSearch]        = useState('')

  const currentRate = exchangeRates.find(r => r.from === fromCurrency) || exchangeRates[0]
  const received    = (sendAmount * currentRate.rate).toLocaleString('fr-FR')

  const filteredMembers = diasporaMembers.filter(m =>
    (!search || m.name.toLowerCase().includes(search.toLowerCase()) ||
     m.titleEn.toLowerCase().includes(search.toLowerCase())) &&
    (!hostFilter || m.hostCountry.toLowerCase() === hostFilter.toLowerCase())
  )

  const handleConnect = (id) => {
    setConnected(prev => ({ ...prev, [id]: true }))
    addToast(txt('Connection request sent!', 'Demande de connexion envoyée !', lang), 'success')
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/network/connect/${id}
  }

  return (
    <div className="dias-page">



      {/* ══ MAIN CONTENT ══ */}
      <main className="dias-main">

        {/* ── Hero banner ── */}
        <div className="dias-hero">
          <div className="dias-hero__content">
            <p className="dias-hero__eyebrow">
              {txt('African Diaspora Network', 'Réseau Diaspora Africaine', lang)}
            </p>
            <h1 className="dias-hero__title">
              {txt('Stay connected to Africa.', 'Restez connecté à l\'Afrique.', lang)}
              <br />
              {txt('Wherever you are.', 'Où que vous soyez.', lang)}
            </h1>
            <p className="dias-hero__sub">
              {txt(
                'Find Africans near you, discover opportunities back home, send money and invest in the continent.',
                'Trouvez des Africains près de vous, découvrez des opportunités au pays, envoyez de l\'argent et investissez.',
                lang
              )}
            </p>
            <div className="dias-hero__actions">
              <button className="dias-hero__btn-primary">
                <FontAwesomeIcon icon={faLocationDot} />
                {txt('Find Africans near me', 'Africains près de moi', lang)}
              </button>
              <button className="dias-hero__btn-outline">
                {txt('Explore opportunities', 'Explorer les opportunités', lang)}
              </button>
            </div>
          </div>
          <div className="dias-hero__stats">
            {[
              { num:'42K',  labelEn:'Members abroad',     labelFr:'Membres à l\'étranger' },
              { num:'87',   labelEn:'Countries',           labelFr:'Pays'                  },
              { num:'200M+',labelEn:'African diaspora',    labelFr:'Diaspora africaine'    },
            ].map((s, i) => (
              <div key={i} className="dias-hero__stat">
                <span className="dias-hero__stat-num">{s.num}</span>
                <span className="dias-hero__stat-label">
                  {txt(s.labelEn, s.labelFr, lang)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Members near you ── */}
        <section className="dias-section">
          <div className="dias-section__header">
            <h2 className="dias-section__title">
              <FontAwesomeIcon icon={faLocationDot} />
              {txt('Africans near you', 'Africains près de vous', lang)}
              {hostFilter && ` — ${hostCountries.find(c=>c.id===hostFilter)?.labelEn}`}
            </h2>
            <button className="dias-section__see-all">
              {txt('See all', 'Voir tout', lang)}
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>

          {/* Search */}
          <div className="dias-search">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={txt('Search members...', 'Rechercher des membres...', lang)}
            />
          </div>

          <div className="dias-members-grid">
            {filteredMembers.slice(0, 4).map(member => (
              <div key={member.id} className="dias-member-card">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="dias-member-card__avatar"
                />
                <div className="dias-member-card__origin-tag">
                  {member.originFlag} {txt(member.originEn, member.originFr, lang)}
                </div>
                <h3 className="dias-member-card__name">{member.name}</h3>
                <p className="dias-member-card__title">
                  {txt(member.titleEn, member.titleFr, lang)}
                </p>
                <p className="dias-member-card__location">
                  <FontAwesomeIcon icon={faLocationDot} />
                  {txt(member.cityEn, member.cityFr, lang)}
                  {member.distanceKm > 0 && ` · ${member.distanceKm}km`}
                </p>
                <button
                  className={`dias-member-card__connect ${connected[member.id] ? 'sent' : ''}`}
                  onClick={() => handleConnect(member.id)}
                  disabled={connected[member.id]}
                >
                  <FontAwesomeIcon icon={connected[member.id] ? faCheck : faUserPlus} />
                  {connected[member.id]
                    ? txt('Sent', 'Envoyé', lang)
                    : txt('Connect', 'Connecter', lang)}
                </button>
              </div>
            ))}
          </div>
          {filteredMembers.length === 0 && (
            <div className="dias-empty">
              <FontAwesomeIcon icon={faUsers} />
              <p>{txt('No members found', 'Aucun membre trouvé', lang)}</p>
            </div>
          )}
        </section>



        {/* ── Diaspora Events ── */}
        <section className="dias-section">
          <div className="dias-section__header">
            <h2 className="dias-section__title">
              <FontAwesomeIcon icon={faCalendarDays} />
              {txt('Diaspora events near you', 'Événements diaspora près de vous', lang)}
            </h2>
            <button className="dias-section__see-all">
              {txt('See all', 'Voir tout', lang)}
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
          <div className="dias-events-list">
            {diasporaEvents.map(event => (
              <div key={event.id} className="dias-event-row">
                <div className="dias-event-row__date">
                  <span className="dias-event-row__month">{event.month}</span>
                  <span className="dias-event-row__day">{event.day}</span>
                </div>
                <div className="dias-event-row__info">
                  <p className="dias-event-row__title">
                    {txt(event.titleEn, event.titleFr, lang)}
                  </p>
                  <p className="dias-event-row__meta">
                    <FontAwesomeIcon icon={event.isOnline ? faVideo : faLocationDot} />
                    {txt(event.locationEn, event.locationFr, lang)}
                    · {event.interested} {txt('interested', 'intéressés', lang)}
                  </p>
                </div>
                <div className="dias-event-row__actions">
                  <button className="dias-event-row__interested">
                    <FontAwesomeIcon icon={faStar} />
                    {txt('Interested', 'Intéressé(e)', lang)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Success stories ── */}
        <section className="dias-section">
          <div className="dias-section__header">
            <h2 className="dias-section__title">
              <FontAwesomeIcon icon={faHeart} />
              {txt('Diaspora success stories', 'Histoires de réussite', lang)}
            </h2>
          </div>
          <div className="dias-stories-grid">
            {diasporaStories.map(story => (
              <div key={story.id} className="dias-story-card">
                <FontAwesomeIcon icon={faQuoteLeft} className="dias-story-card__quote" />
                <p className="dias-story-card__text">
                  "{txt(story.storyEn, story.storyFr, lang)}"
                </p>
                <div className="dias-story-card__author">
                  <img src={story.avatar} alt={story.name} />
                  <div>
                    <p className="dias-story-card__name">{story.name}</p>
                    <p className="dias-story-card__country">
                      {txt(story.countryEn, story.countryFr, lang)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Send money modal */}
      {sendMoneyOpen && (
        <SendMoneyModal
          onClose={() => setSendMoneyOpen(false)}
          lang={lang}
          defaultCurrency={fromCurrency}
          defaultAmount={sendAmount}
        />
      )}

    </div>
  )
}