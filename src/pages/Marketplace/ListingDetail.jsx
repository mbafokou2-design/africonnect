import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark, faArrowLeft, faShieldHalved,
  faLocationDot, faEye, faMessage,
  faBookmark, faShare, faBoxOpen,
  faCheck, faFire, faPhone, faGlobe,
  faArrowRight, faFlag
} from '@fortawesome/free-solid-svg-icons'
import { faBookmark as faBookmarkReg } from '@fortawesome/free-regular-svg-icons'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import { marketplaceCategories } from '../../data/marketplaceData'
import './ListingDetail.css'

const typeColors = {
  sell:    { bg:'rgba(45,106,79,0.1)',  color:'#2D6A4F', labelEn:'Selling',     labelFr:'Vente'       },
  buy:     { bg:'rgba(67,56,202,0.1)',  color:'#4338ca', labelEn:'Buying',      labelFr:'Achat'       },
  service: { bg:'rgba(124,61,43,0.1)', color:'#7C3D2B', labelEn:'Service',     labelFr:'Service'     },
  partner: { bg:'rgba(201,130,42,0.1)',color:'#C9822A', labelEn:'Partnership', labelFr:'Partenariat' },
}

export default function ListingDetail({ listing, onClose, onInquiry, onSave, lang }) {
  const { addToast } = useToast()
  const isMobile = window.innerWidth <= 768
  const tc       = typeColors[listing.type] || typeColors.sell
  const catLabel = marketplaceCategories.find(c => c.id === listing.category)

  const handleShare = () => {
    const url = `${window.location.origin}/marketplace/${listing.id}`
    if (navigator.share) navigator.share({ title: listing.titleEn, url })
    else { navigator.clipboard.writeText(url); addToast(txt('Link copied!', 'Lien copié !', lang), 'success') }
  }

  const Content = (
    <div className="ld-content">

      {/* Cover */}
      <div className="ld-cover">
        <img src={listing.cover} alt={listing.titleEn} />
        {listing.isFeatured && (
          <div className="ld-cover__featured">
            <FontAwesomeIcon icon={faFire} />
            {txt('Featured', 'En vedette', lang)}
          </div>
        )}
      </div>

      {/* Company */}
      <div className="ld-company">
        <img src={listing.companyLogo} alt={listing.company} className="ld-company__logo" />
        <div className="ld-company__info">
          <div className="ld-company__name-row">
            <span className="ld-company__name">{listing.company}</span>
            {listing.verified && (
              <span className="ld-company__verified">
                <FontAwesomeIcon icon={faShieldHalved} />
                {txt('Verified', 'Vérifié', lang)}
              </span>
            )}
          </div>
          <span
            className="ld-type-badge"
            style={{ background: tc.bg, color: tc.color }}
          >
            {txt(tc.labelEn, tc.labelFr, lang)}
          </span>
        </div>
        <div className="ld-company__actions">
          <button className="ld-icon-btn" onClick={handleShare}>
            <FontAwesomeIcon icon={faShare} />
          </button>
          <button
            className={`ld-icon-btn ${listing.isSaved ? 'ld-icon-btn--active' : ''}`}
            onClick={e => onSave(listing.id, e)}
          >
            <FontAwesomeIcon icon={listing.isSaved ? faBookmark : faBookmarkReg} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h2 className="ld-title">
        {txt(listing.titleEn, listing.titleFr, lang)}
      </h2>

      {/* Location + posted */}
      <div className="ld-meta">
        <span><FontAwesomeIcon icon={faLocationDot} />{txt(listing.locationEn, listing.locationFr, lang)}</span>
        <span><FontAwesomeIcon icon={faEye} />{listing.views} {txt('views', 'vues', lang)}</span>
        <span>{txt(listing.postedEn, listing.postedFr, lang)}</span>
      </div>

      {/* Price card */}
      <div className="ld-price-card">
        <div className="ld-price-card__main">
          <span className="ld-price-card__label">{txt('Price', 'Prix', lang)}</span>
          <span className="ld-price-card__value">{txt(listing.priceEn, listing.priceFr, lang)}</span>
        </div>
        <div className="ld-price-card__divider" />
        <div className="ld-price-card__main">
          <span className="ld-price-card__label">{txt('Min. Order', 'Commande min.', lang)}</span>
          <span className="ld-price-card__value">{txt(listing.minOrder, listing.minOrderFr, lang)}</span>
        </div>
        <div className="ld-price-card__divider" />
        <div className="ld-price-card__main">
          <span className="ld-price-card__label">{txt('Category', 'Catégorie', lang)}</span>
          <span className="ld-price-card__value">{txt(catLabel?.labelEn || '', catLabel?.labelFr || '', lang)}</span>
        </div>
      </div>

      {/* CTA */}
      <button className="ld-inquiry-btn" onClick={onInquiry}>
        <FontAwesomeIcon icon={faMessage} />
        {txt('Send an inquiry', 'Envoyer une demande', lang)}
        <FontAwesomeIcon icon={faArrowRight} />
      </button>

      {/* Description */}
      <div className="ld-section">
        <h3>{txt('Description', 'Description', lang)}</h3>
        <p>{txt(listing.descEn, listing.descFr, lang)}</p>
      </div>

      {/* Tags */}
      {listing.tags && (
        <div className="ld-tags">
          {listing.tags.map(tag => (
            <span key={tag} className="ld-tag">{tag}</span>
          ))}
        </div>
      )}

      {/* Contact person */}
      <div className="ld-section">
        <h3>{txt('Contact person', 'Personne de contact', lang)}</h3>
        <div className="ld-contact">
          <img src={listing.contact.avatar} alt={listing.contact.name} />
          <div>
            <p className="ld-contact__name">{listing.contact.name}</p>
            <p className="ld-contact__role">{listing.company}</p>
          </div>
          <button className="ld-contact__msg-btn" onClick={onInquiry}>
            <FontAwesomeIcon icon={faMessage} />
          </button>
        </div>
      </div>

      {/* Inquiries + views */}
      <div className="ld-engagement">
        <div className="ld-engagement__item">
          <FontAwesomeIcon icon={faMessage} />
          <span><strong>{listing.inquiries}</strong> {txt('inquiries sent', 'demandes envoyées', lang)}</span>
        </div>
        <div className="ld-engagement__item">
          <FontAwesomeIcon icon={faEye} />
          <span><strong>{listing.views}</strong> {txt('views', 'vues', lang)}</span>
        </div>
      </div>

      {/* Report */}
      <button className="ld-report-btn"
        onClick={() => addToast(txt('Reported', 'Signalé', lang), 'info')}>
        <FontAwesomeIcon icon={faFlag} />
        {txt('Report listing', 'Signaler l\'annonce', lang)}
      </button>

    </div>
  )

  if (isMobile) {
    return (
      <div className="ld-overlay">
        <div className="ld-mobile">
          <div className="ld-mobile__header">
            <button onClick={onClose}><FontAwesomeIcon icon={faArrowLeft} /></button>
            <h2>{txt('Listing Details', 'Détails', lang)}</h2>
            <div style={{ width:36 }} />
          </div>
          {Content}
        </div>
      </div>
    )
  }

  return (
    <div className="ld-panel">
      <div className="ld-panel__close-row">
        <button className="ld-panel__close" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      {Content}
    </div>
  )
}