import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStore, faSearch, faPlus, faFilter,
  faXmark, faChevronDown, faLocationDot,
  faStar, faBookmark, 
  faArrowRight, faFire, faSeedling,
  faLaptop, faIndustry, faBriefcase,
  faTruck, faBolt, faHospital,
  faBuilding, faChartLine, faBullhorn,
  faTag, faFileContract, faBoxes,
  faCheckCircle, faClock, faEnvelope,
  faPhone
} from '@fortawesome/free-solid-svg-icons'
import { faBookmark as faBookmarkReg, faStar as faStarReg } from '@fortawesome/free-regular-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import {
  allListings, featuredCompanies,
  marketplaceCategories, listingTypes
} from '../../data/marketplaceData'
// import PostListingModal from './PostListingModal'
// import ContactModal from './ContactModal'
import './Marketplace.css'

const catIcons = {
  all: faStore, agriculture: faSeedling, tech: faLaptop,
  manufacturing: faIndustry, services: faBriefcase,
  logistics: faTruck, energy: faBolt, health: faHospital,
  construction: faBuilding, finance: faChartLine, media: faBullhorn,
}

const typeConfig = {
  product:   { icon: faTag,          colorEn: 'Product',   colorFr: 'Produit',        bg:'rgba(45,106,79,0.1)',   color:'#2D6A4F' },
  service:   { icon: faBriefcase,    colorEn: 'Service',   colorFr: 'Service',        bg:'rgba(124,61,43,0.1)',   color:'#7C3D2B' },
  tender:    { icon: faFileContract, colorEn: 'Tender',    colorFr: 'Appel d\'offres',bg:'rgba(67,56,202,0.1)',   color:'#4338ca' },
  wholesale: { icon: faBoxes,        colorEn: 'Wholesale', colorFr: 'Gros',           bg:'rgba(201,130,42,0.1)', color:'#C9822A' },
}

function StarRating({ rating }) {
  return (
    <div className="star-rating">
      {[1,2,3,4,5].map(i => (
        <FontAwesomeIcon
          key={i}
          icon={i <= Math.round(rating) ? faStar : faStarReg}
          className={i <= Math.round(rating) ? 'star-rating__filled' : 'star-rating__empty'}
        />
      ))}
      <span className="star-rating__num">{rating}</span>
    </div>
  )
}

export default function Marketplace() {
  const { lang }     = useLang()
  const { addToast } = useToast()
  const navigate     = useNavigate()

  const [listings,      setListings]      = useState(allListings)
  const [search,        setSearch]        = useState('')
  const [category,      setCategory]      = useState('all')
  const [listingType,   setListingType]   = useState('all')
  const [showFilters,   setShowFilters]   = useState(false)
  const [tab,           setTab]           = useState('listings') // listings | companies | saved
  const [showPost,      setShowPost]      = useState(false)
  const [contactItem,   setContactItem]   = useState(null)
  const [sortBy,        setSortBy]        = useState('trending')

  const sortOptions = [
    { id:'trending', labelEn:'Trending',    labelFr:'Tendances'     },
    { id:'newest',   labelEn:'Newest',      labelFr:'Plus récents'  },
    { id:'rated',    labelEn:'Top rated',   labelFr:'Mieux notés'   },
  ]

  const toggleSave = (id, e) => {
    e.stopPropagation()
    setListings(prev => prev.map(l => l.id === id ? { ...l, isSaved: !l.isSaved } : l))
    const item = listings.find(l => l.id === id)
    addToast(
      item.isSaved
        ? txt('Removed from saved', 'Retiré des sauvegardes', lang)
        : txt('Listing saved!', 'Annonce sauvegardée !', lang),
      item.isSaved ? 'info' : 'success'
    )
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/marketplace/${id}/save
  }

  const filtered = listings.filter(l => {
    const matchSearch = !search ||
      l.titleEn.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase()) ||
      l.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchCat  = category === 'all' || l.category === category
    const matchType = listingType === 'all' || l.type === listingType
    const matchTab  = tab === 'saved' ? l.isSaved : true
    return matchSearch && matchCat && matchType && matchTab
  }).sort((a, b) => {
    if (sortBy === 'rated')  return (b.rating || 0) - (a.rating || 0)
    if (sortBy === 'newest') return b.id - a.id
    return (b.reviews || 0) - (a.reviews || 0)
  })

  const savedCount = listings.filter(l => l.isSaved).length

  return (
    <div className="mkt-page">

      {/* ── Header ── */}
      <div className="mkt-header">
        <div className="mkt-header__left">
          <div className="mkt-header__icon">
            <FontAwesomeIcon icon={faStore} />
          </div>
          <div>
            <h1 className="mkt-header__title"
              data-en="B2B Marketplace" data-fr="Marketplace B2B">
              {txt('B2B Marketplace', 'Marketplace B2B', lang)}
            </h1>
            <p className="mkt-header__sub">
              {txt(
                'Buy, sell and partner with African businesses',
                'Achetez, vendez et partenariez avec des entreprises africaines',
                lang
              )}
            </p>
          </div>
        </div>
        <button className="mkt-post-btn" onClick={() => setShowPost(true)}>
          <FontAwesomeIcon icon={faPlus} />
          <span>{txt('Post a listing', 'Publier une annonce', lang)}</span>
        </button>
      </div>

      {/* ── Hero stats strip ── */}
      <div className="mkt-stats-strip">
        {[
          { num:'2,400+', labelEn:'Active listings',  labelFr:'Annonces actives'  },
          { num:'850+',   labelEn:'Verified companies',labelFr:'Entreprises vérif.' },
          { num:'38',     labelEn:'African countries', labelFr:'Pays africains'    },
          { num:'4.8★',   labelEn:'Average rating',   labelFr:'Note moyenne'      },
        ].map((s, i) => (
          <div key={i} className="mkt-stats-strip__item">
            <span className="mkt-stats-strip__num">{s.num}</span>
            <span className="mkt-stats-strip__label">
              {txt(s.labelEn, s.labelFr, lang)}
            </span>
          </div>
        ))}
      </div>

      {/* ── Search + sort + filters ── */}
      <div className="mkt-search-bar">
        <div className="mkt-search-bar__field">
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={txt(
              'Search products, services, companies...',
              'Rechercher produits, services, entreprises...',
              lang
            )}
          />
          {search && (
            <button onClick={() => setSearch('')} className="mkt-search-bar__clear">
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>
        <select
          className="mkt-sort-select"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          {sortOptions.map(s => (
            <option key={s.id} value={s.id}>
              {txt(s.labelEn, s.labelFr, lang)}
            </option>
          ))}
        </select>
        <button
          className={`mkt-filter-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(p => !p)}
        >
          <FontAwesomeIcon icon={faFilter} />
          <span>{txt('Filters', 'Filtres', lang)}</span>
        </button>
      </div>

      {/* ── Filter panel ── */}
      {showFilters && (
        <div className="mkt-filters">
          <div className="mkt-filters__group">
            <label>{txt('Listing type', 'Type d\'annonce', lang)}</label>
            <div className="mkt-filters__pills">
              {listingTypes.map(t => (
                <button
                  key={t.id}
                  className={`mkt-pill ${listingType === t.id ? 'active' : ''}`}
                  onClick={() => setListingType(t.id)}
                >
                  {txt(t.labelEn, t.labelFr, lang)}
                </button>
              ))}
            </div>
          </div>
          <button
            className="mkt-filters__reset"
            onClick={() => { setCategory('all'); setListingType('all'); setSearch('') }}
          >
            {txt('Reset filters', 'Réinitialiser', lang)}
          </button>
        </div>
      )}

      {/* ── Category pills ── */}
      <div className="mkt-cat-pills">
        {marketplaceCategories.map(cat => (
          <button
            key={cat.id}
            className={`mkt-cat-pill ${category === cat.id ? 'active' : ''}`}
            onClick={() => setCategory(prev => prev === cat.id ? 'all' : cat.id)}
          >
            <FontAwesomeIcon icon={catIcons[cat.id] || faStore} />
            {txt(cat.labelEn, cat.labelFr, lang)}
          </button>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="mkt-tabs">
        <button
          className={`mkt-tab ${tab === 'listings' ? 'active' : ''}`}
          onClick={() => setTab('listings')}
        >
          {txt('Listings', 'Annonces', lang)}
          <span className="mkt-tab__count">{filtered.length}</span>
        </button>
        <button
          className={`mkt-tab ${tab === 'companies' ? 'active' : ''}`}
          onClick={() => setTab('companies')}
        >
          {txt('Companies', 'Entreprises', lang)}
        </button>
        <button
          className={`mkt-tab ${tab === 'saved' ? 'active' : ''}`}
          onClick={() => setTab('saved')}
        >
          {txt('Saved', 'Sauvegardés', lang)}
          {savedCount > 0 && (
            <span className="mkt-tab__count">{savedCount}</span>
          )}
        </button>
      </div>

      {/* ════════ LISTINGS TAB ════════ */}
      {(tab === 'listings' || tab === 'saved') && (
        <>
          {/* Featured tenders strip */}
          {tab === 'listings' && search === '' && (
            <div className="mkt-featured">
              <div className="mkt-featured__header">
                <div className="mkt-featured__title">
                  <FontAwesomeIcon icon={faFire} />
                  {txt('Active Tenders', 'Appels d\'offres actifs', lang)}
                </div>
              </div>
              <div className="mkt-tenders-strip">
                {listings.filter(l => l.type === 'tender').map(tender => {
                  const tc = typeConfig.tender
                  return (
                    <div
                      key={tender.id}
                      className="mkt-tender-card"
                      onClick={() => setContactItem(tender)}
                    >
                      <div className="mkt-tender-card__top">
                        <img src={tender.companyLogo} alt={tender.company} />
                        <div>
                          <span className="mkt-tender-card__type" style={{ background: tc.bg, color: tc.color }}>
                            <FontAwesomeIcon icon={tc.icon} />
                            {txt('Tender', 'Appel d\'offres', lang)}
                          </span>
                          {tender.verified && (
                            <span className="mkt-tender-card__verified">
                              <FontAwesomeIcon icon={faCheckCircle} />
                              {txt('Verified', 'Vérifié', lang)}
                            </span>
                          )}
                        </div>
                      </div>
                      <h3 className="mkt-tender-card__title">
                        {txt(tender.titleEn, tender.titleFr, lang)}
                      </h3>
                      <p className="mkt-tender-card__company">{tender.company}</p>
                      <div className="mkt-tender-card__footer">
                        <span className="mkt-tender-card__price">
                          {txt(tender.priceEn, tender.priceFr, lang)}
                        </span>
                        {tender.deadline && (
                          <span className="mkt-tender-card__deadline">
                            <FontAwesomeIcon icon={faClock} />
                            {tender.deadline}
                          </span>
                        )}
                      </div>
                      <button className="mkt-tender-card__btn"
                        onClick={e => { e.stopPropagation(); setContactItem(tender) }}>
                        {txt('Submit proposal', 'Soumettre une offre', lang)}
                        <FontAwesomeIcon icon={faArrowRight} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Listings grid */}
          {filtered.length === 0 ? (
            <div className="mkt-empty">
              <div className="mkt-empty__icon">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <p>{txt('No listings found', 'Aucune annonce trouvée', lang)}</p>
              <button onClick={() => { setSearch(''); setCategory('all'); setListingType('all') }}>
                {txt('Clear filters', 'Effacer les filtres', lang)}
              </button>
            </div>
          ) : (
            <div className="mkt-grid">
              {filtered.filter(l => l.type !== 'tender').map(listing => {
                const tc = typeConfig[listing.type]
                return (
                  <div
                    key={listing.id}
                    className="mkt-listing-card"
                    onClick={() => setContactItem(listing)}
                  >
                    {/* Cover */}
                    <div className="mkt-listing-card__cover">
                      <img src={listing.cover} alt={listing.titleEn} />
                      <div className="mkt-listing-card__type-badge"
                        style={{ background: tc.bg, color: tc.color }}>
                        <FontAwesomeIcon icon={tc.icon} />
                        {txt(tc.colorEn, tc.colorFr, lang)}
                      </div>
                      <button
                        className={`mkt-listing-card__save ${listing.isSaved ? 'saved' : ''}`}
                        onClick={e => toggleSave(listing.id, e)}
                      >
                        <FontAwesomeIcon icon={listing.isSaved ? faBookmark : faBookmarkReg} />
                      </button>
                    </div>

                    {/* Body */}
                    <div className="mkt-listing-card__body">
                      {/* Company */}
                      <div className="mkt-listing-card__company-row">
                        <img src={listing.companyLogo} alt={listing.company}
                          className="mkt-listing-card__company-logo" />
                        <div className="mkt-listing-card__company-info">
                          <span className="mkt-listing-card__company-name">
                            {listing.company}
                          </span>
                          {listing.verified && (
                            <FontAwesomeIcon icon={faCheckCircle}
                              className="mkt-listing-card__verified-icon" />
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="mkt-listing-card__title">
                        {txt(listing.titleEn, listing.titleFr, lang)}
                      </h3>

                      {/* Location */}
                      <p className="mkt-listing-card__location">
                        <FontAwesomeIcon icon={faLocationDot} />
                        {txt(listing.locationEn, listing.locationFr, lang)}
                      </p>

                      {/* Price */}
                      <p className="mkt-listing-card__price">
                        {txt(listing.priceEn, listing.priceFr, lang)}
                      </p>

                      {/* Rating + response */}
                      <div className="mkt-listing-card__meta">
                        {listing.rating && <StarRating rating={listing.rating} />}
                        {listing.reviews > 0 && (
                          <span className="mkt-listing-card__reviews">
                            ({listing.reviews})
                          </span>
                        )}
                        {listing.responseTime && (
                          <span className="mkt-listing-card__response">
                            <FontAwesomeIcon icon={faClock} />
                            {listing.responseTime}
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="mkt-listing-card__tags">
                        {listing.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="mkt-listing-card__tag">{tag}</span>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mkt-listing-card__footer">
                      <button
                        className="mkt-listing-card__contact-btn"
                        onClick={e => { e.stopPropagation(); setContactItem(listing) }}
                      >
                        <FontAwesomeIcon icon={faEnvelope} />
                        {txt('Contact', 'Contacter', lang)}
                      </button>
                      <button className="mkt-listing-card__view-btn">
                        {txt('View details', 'Voir détails', lang)}
                        <FontAwesomeIcon icon={faArrowRight} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* ════════ COMPANIES TAB ════════ */}
      {tab === 'companies' && (
        <div className="mkt-companies-grid">
          {featuredCompanies.map(company => (
            <div key={company.id} className="mkt-company-card">
              <div className="mkt-company-card__top">
                <img src={company.logo} alt={company.name}
                  className="mkt-company-card__logo" />
                {company.verified && (
                  <div className="mkt-company-card__verified">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    {txt('Verified', 'Vérifié', lang)}
                  </div>
                )}
              </div>
              <h3 className="mkt-company-card__name">{company.name}</h3>
              <p className="mkt-company-card__category">
                {txt(company.categoryEn, company.categoryFr, lang)}
              </p>
              <p className="mkt-company-card__location">
                <FontAwesomeIcon icon={faLocationDot} />
                {txt(company.locationEn, company.locationFr, lang)}
              </p>
              <div className="mkt-company-card__meta">
                <StarRating rating={company.rating} />
                <span className="mkt-company-card__listings">
                  {company.listingsCount} {txt('listings', 'annonces', lang)}
                </span>
              </div>
              <button className="mkt-company-card__btn">
                {txt('View profile', 'Voir profil', lang)}
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Post listing modal */}
      {showPost && (
        <PostListingModal
          onClose={() => setShowPost(false)}
          lang={lang}
          onPosted={() => {
            setShowPost(false)
            addToast(
              txt('Listing submitted for review!', 'Annonce soumise pour examen !', lang),
              'success'
            )
          }}
        />
      )}

      {/* Contact modal */}
      {contactItem && (
        <ContactModal
          item={contactItem}
          onClose={() => setContactItem(null)}
          lang={lang}
        />
      )}

    </div>
  )
}