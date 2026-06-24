import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStore, faSearch, faPlus, faFilter,
  faXmark, faShieldHalved, faEye,
  faMessage, faBookmark, faLocationDot,
  faBoxOpen, faHandshake, faArrowRight,
  faStar, faFire, faCheck, faChevronDown,
  faSeedling, faLaptop, faHammer,
  faIndustry, faUtensils, faHeartPulse,
  faCoins, faBolt, faTruck, faScissors,
  faEllipsis, faBuilding, faBullhorn
} from '@fortawesome/free-solid-svg-icons'
import { faBookmark as faBookmarkReg } from '@fortawesome/free-regular-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import {
  allListings, marketplaceCategories, listingTypes
} from '../../data/marketplaceData'
import ListingDetail from './ListingDetail'
import PostListingModal from './PostListingModal'
import InquiryModal from './InquiryModal'
import './Marketplace.css'

const catIcons = {
  all:           faStore,
  agri:          faSeedling,
  tech:          faLaptop,
  construction:  faHammer,
  manufacturing: faIndustry,
  food:          faUtensils,
  health:        faHeartPulse,
  finance:       faCoins,
  energy:        faBolt,
  logistics:     faTruck,
  textile:       faScissors,
}

const typeColors = {
  sell:    { bg:'rgba(45,106,79,0.1)',   color:'#2D6A4F', labelEn:'Selling',     labelFr:'Vente'       },
  buy:     { bg:'rgba(67,56,202,0.1)',   color:'#4338ca', labelEn:'Buying',      labelFr:'Achat'       },
  service: { bg:'rgba(124,61,43,0.1)',   color:'#7C3D2B', labelEn:'Service',     labelFr:'Service'     },
  partner: { bg:'rgba(201,130,42,0.1)',  color:'#C9822A', labelEn:'Partnership', labelFr:'Partenariat' },
}

export default function Marketplace() {
  const { lang }     = useLang()
  const { addToast } = useToast()

  const [listings,      setListings]      = useState(allListings)
  const [search,        setSearch]        = useState('')
  const [category,      setCategory]      = useState('all')
  const [listingType,   setListingType]   = useState('all')
  const [showFilters,   setShowFilters]   = useState(false)
  const [tab,           setTab]           = useState('all') // all | featured | saved
  const [selectedListing, setSelectedListing] = useState(null)
  const [showPost,      setShowPost]      = useState(false)
  const [inquiryListing,setInquiryListing]= useState(null)
  const [sortBy,        setSortBy]        = useState('newest')
  const [verifiedOnly,  setVerifiedOnly]  = useState(false)

  const toggleSave = (id, e) => {
    e.stopPropagation()
    setListings(prev => prev.map(l =>
      l.id === id ? { ...l, isSaved: !l.isSaved } : l
    ))
    const item = listings.find(l => l.id === id)
    addToast(
      item.isSaved
        ? txt('Removed from saved', 'Retiré', lang)
        : txt('Listing saved!', 'Annonce sauvegardée !', lang),
      item.isSaved ? 'info' : 'success'
    )
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/marketplace/${id}/save
  }

  const filtered = listings
    .filter(l => {
      const matchSearch   = !search || l.titleEn.toLowerCase().includes(search.toLowerCase()) || l.titleFr.toLowerCase().includes(search.toLowerCase()) || l.company.toLowerCase().includes(search.toLowerCase())
      const matchCat      = category    === 'all' || l.category === category
      const matchType     = listingType === 'all' || l.type     === listingType
      const matchTab      = tab === 'saved'    ? l.isSaved
                          : tab === 'featured' ? l.isFeatured
                          : true
      const matchVerified = !verifiedOnly || l.verified
      return matchSearch && matchCat && matchType && matchTab && matchVerified
    })
    .sort((a, b) => {
      if (sortBy === 'mostviewed') return b.views    - a.views
      if (sortBy === 'mostactive') return b.inquiries - a.inquiries
      return b.id - a.id // newest
    })

  const featuredCount = listings.filter(l => l.isFeatured).length
  const savedCount    = listings.filter(l => l.isSaved).length

  return (
    <div className="mkt-page">

      {/* ── Header ── */}
      <div className="mkt-header">
        <div className="mkt-header__left">
          <div className="mkt-header__icon">
            <FontAwesomeIcon icon={faStore} />
          </div>
          <div>
            <h1 className="mkt-header__title">
              {txt('B2B Marketplace', 'Marketplace B2B', lang)}
            </h1>
            <p className="mkt-header__sub">
              {txt(
                'Trade, partner and grow with African businesses',
                'Échangez, partenariez et grandissez avec des entreprises africaines',
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

      {/* ── Stats bar ── */}
      <div className="mkt-stats-bar">
        {[
          { num: listings.length,                        labelEn:'Active listings',  labelFr:'Annonces actives'  },
          { num: listings.filter(l=>l.verified).length,  labelEn:'Verified companies',labelFr:'Entreprises vérifiées'},
          { num: listings.reduce((a,l)=>a+l.inquiries,0),labelEn:'Inquiries today',  labelFr:'Demandes aujourd\'hui'},
          { num: '40+',                                   labelEn:'Countries',        labelFr:'Pays'              },
        ].map((s, i) => (
          <div key={i} className="mkt-stat">
            <span className="mkt-stat__num">{s.num}</span>
            <span className="mkt-stat__label">{txt(s.labelEn, s.labelFr, lang)}</span>
          </div>
        ))}
      </div>

      {/* ── Search + sort + filter ── */}
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
            <button onClick={() => setSearch('')}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>
        <select
          className="mkt-sort-select"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="newest">{txt('Newest',       'Plus récents',   lang)}</option>
          <option value="mostviewed">{txt('Most viewed', 'Plus vus',     lang)}</option>
          <option value="mostactive">{txt('Most active', 'Plus actifs',  lang)}</option>
        </select>
        <button
          className={`mkt-filter-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(p => !p)}
        >
          <FontAwesomeIcon icon={faFilter} />
          {txt('Filters', 'Filtres', lang)}
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
          <div className="mkt-filters__row">
            <label className="mkt-filters__toggle">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={e => setVerifiedOnly(e.target.checked)}
              />
              <span className="mkt-filters__toggle-slider" />
              <span>{txt('Verified companies only', 'Entreprises vérifiées uniquement', lang)}</span>
            </label>
            <button
              className="mkt-filters__reset"
              onClick={() => { setCategory('all'); setListingType('all'); setSearch(''); setVerifiedOnly(false) }}
            >
              {txt('Reset', 'Réinitialiser', lang)}
            </button>
          </div>
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
          className={`mkt-tab ${tab === 'all' ? 'active' : ''}`}
          onClick={() => setTab('all')}
        >
          {txt('All Listings', 'Toutes les annonces', lang)}
        </button>
        <button
          className={`mkt-tab ${tab === 'featured' ? 'active' : ''}`}
          onClick={() => setTab('featured')}
        >
          <FontAwesomeIcon icon={faFire} />
          {txt('Featured', 'En vedette', lang)}
          <span className="mkt-tab__count">{featuredCount}</span>
        </button>
        <button
          className={`mkt-tab ${tab === 'saved' ? 'active' : ''}`}
          onClick={() => setTab('saved')}
        >
          {txt('Saved', 'Sauvegardés', lang)}
          {savedCount > 0 && <span className="mkt-tab__count">{savedCount}</span>}
        </button>
      </div>

      {/* ── Results count ── */}
      {filtered.length > 0 && (
        <p className="mkt-count">
          <strong>{filtered.length}</strong> {txt('listings found', 'annonces trouvées', lang)}
        </p>
      )}

      {/* ── Listings grid ── */}
      {filtered.length === 0 ? (
        <div className="mkt-empty">
          <div className="mkt-empty__icon">
            <FontAwesomeIcon icon={faStore} />
          </div>
          <p>{txt('No listings found', 'Aucune annonce trouvée', lang)}</p>
          <button onClick={() => { setSearch(''); setCategory('all'); setListingType('all') }}>
            {txt('Clear filters', 'Effacer les filtres', lang)}
          </button>
        </div>
      ) : (
        <div className="mkt-grid">
          {filtered.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              lang={lang}
              onOpen={() => setSelectedListing(listing)}
              onSave={toggleSave}
              onInquiry={e => { e.stopPropagation(); setInquiryListing(listing) }}
            />
          ))}
        </div>
      )}

      {/* ── Detail panel ── */}
      {selectedListing && (
        <ListingDetail
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onInquiry={() => setInquiryListing(selectedListing)}
          onSave={toggleSave}
          lang={lang}
        />
      )}

      {/* ── Post listing modal ── */}
      {showPost && (
        <PostListingModal
          onClose={() => setShowPost(false)}
          lang={lang}
          onPosted={() => {
            setShowPost(false)
            addToast(txt('Listing posted!', 'Annonce publiée !', lang), 'success')
          }}
        />
      )}

      {/* ── Inquiry modal ── */}
      {inquiryListing && (
        <InquiryModal
          listing={inquiryListing}
          onClose={() => setInquiryListing(null)}
          lang={lang}
        />
      )}

    </div>
  )
}

/* ════════════════════
   LISTING CARD
════════════════════ */
function ListingCard({ listing, lang, onOpen, onSave, onInquiry }) {
  const tc = typeColors[listing.type] || typeColors.sell

  return (
    <div className="mkt-card" onClick={onOpen}>

      {/* Cover */}
      <div className="mkt-card__cover">
        <img src={listing.cover} alt={listing.titleEn} />
        {listing.isFeatured && (
          <div className="mkt-card__featured">
            <FontAwesomeIcon icon={faFire} />
            {txt('Featured', 'Vedette', lang)}
          </div>
        )}
        {listing.isNew && (
          <div className="mkt-card__new">
            {txt('New', 'Nouveau', lang)}
          </div>
        )}
        <button
          className={`mkt-card__save ${listing.isSaved ? 'saved' : ''}`}
          onClick={e => onSave(listing.id, e)}
        >
          <FontAwesomeIcon icon={listing.isSaved ? faBookmark : faBookmarkReg} />
        </button>
      </div>

      {/* Body */}
      <div className="mkt-card__body">

        {/* Company row */}
        <div className="mkt-card__company-row">
          <img src={listing.companyLogo} alt={listing.company} className="mkt-card__logo" />
          <div className="mkt-card__company-info">
            <span className="mkt-card__company">{listing.company}</span>
            {listing.verified && (
              <span className="mkt-card__verified">
                <FontAwesomeIcon icon={faShieldHalved} />
                {txt('Verified', 'Vérifié', lang)}
              </span>
            )}
          </div>
          <span
            className="mkt-card__type"
            style={{ background: tc.bg, color: tc.color }}
          >
            {txt(tc.labelEn, tc.labelFr, lang)}
          </span>
        </div>

        {/* Title */}
        <h3 className="mkt-card__title">
          {txt(listing.titleEn, listing.titleFr, lang)}
        </h3>

        {/* Description */}
        <p className="mkt-card__desc">
          {txt(listing.descEn, listing.descFr, lang).slice(0, 100)}...
        </p>

        {/* Location */}
        <p className="mkt-card__location">
          <FontAwesomeIcon icon={faLocationDot} />
          {txt(listing.locationEn, listing.locationFr, lang)}
        </p>

        {/* Price + min order */}
        <div className="mkt-card__price-row">
          <div className="mkt-card__price">
            {txt(listing.priceEn, listing.priceFr, lang)}
          </div>
          <div className="mkt-card__min-order">
            {txt('Min:', 'Min :', lang)} {txt(listing.minOrder, listing.minOrderFr, lang)}
          </div>
        </div>

        {/* Stats */}
        <div className="mkt-card__stats">
          <span>
            <FontAwesomeIcon icon={faEye} />
            {listing.views}
          </span>
          <span>
            <FontAwesomeIcon icon={faMessage} />
            {listing.inquiries} {txt('inquiries', 'demandes', lang)}
          </span>
          <span>{txt(listing.postedEn, listing.postedFr, lang)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mkt-card__footer" onClick={e => e.stopPropagation()}>
        <button className="mkt-card__inquiry-btn" onClick={onInquiry}>
          <FontAwesomeIcon icon={faMessage} />
          {txt('Send inquiry', 'Envoyer une demande', lang)}
        </button>
        <button className="mkt-card__view-btn" onClick={onOpen}>
          {txt('View', 'Voir', lang)}
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

    </div>
  )
}