import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark, faLocationDot, faBuilding,
  faMoneyBill, faClock, faBookmark,
  faArrowRight, faCheck, faWifi,
  faShield, faUsers
} from '@fortawesome/free-solid-svg-icons'
import { faBookmark as faBookmarkReg } from '@fortawesome/free-regular-svg-icons'
import { txt } from '../../utils/translate'
import { jobTypes } from '../../data/jobsData'
import './JobDetail.css'

const typeColors = {
  fulltime:   { bg: 'rgba(45,106,79,0.1)',  color: '#2D6A4F' },
  parttime:   { bg: 'rgba(201,130,42,0.1)', color: '#C9822A' },
  remote:     { bg: 'rgba(67,56,202,0.1)',  color: '#4338ca' },
  freelance:  { bg: 'rgba(124,61,43,0.1)',  color: '#7C3D2B' },
  internship: { bg: 'rgba(124,58,237,0.1)', color: '#7c3aed' },
}

export default function JobDetail({ job, onClose, onApply, onSave, lang }) {
  const isMobile = window.innerWidth <= 768
  const tc       = typeColors[job.type] || typeColors.fulltime
  const typeLabel = jobTypes.find(t => t.id === job.type)

  const Content = (
    <div className="jd-content">

      {/* Header */}
      <div className="jd-header">
        <div className="jd-header__logo">
          <img src={job.companyLogo} alt={job.company} />
        </div>
        <div className="jd-header__info">
          <h2 className="jd-header__title">
            {txt(job.titleEn, job.titleFr, lang)}
          </h2>
          <p className="jd-header__company">
            {job.company}
          </p>
          <div className="jd-header__meta">
            <span>
              <FontAwesomeIcon icon={faLocationDot} />
              {txt(job.locationEn, job.locationFr, lang)}
            </span>
            <span>
              <FontAwesomeIcon icon={faClock} />
              {txt(job.postedEn, job.postedFr, lang)}
            </span>
          </div>
          <div className="jd-header__badges">
            <span
              className="jd-type-badge"
              style={{ background: tc.bg, color: tc.color }}
            >
              {typeLabel ? txt(typeLabel.labelEn, typeLabel.labelFr, lang) : job.type}
            </span>
            {job.isNew && (
              <span className="jd-new-badge">
                {txt('New', 'Nouveau', lang)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Salary */}
      <div className="jd-salary">
        <FontAwesomeIcon icon={faMoneyBill} />
        <span>{txt(job.salaryEn, job.salaryFr, lang)}</span>
      </div>

      {/* Action buttons */}
      <div className="jd-actions">
        <button className="jd-apply-btn" onClick={onApply}>
          {txt('Apply Now', 'Postuler maintenant', lang)}
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
        <button
          className={`jd-save-btn ${job.isSaved ? 'saved' : ''}`}
          onClick={e => onSave(job.id, e)}
        >
          <FontAwesomeIcon icon={job.isSaved ? faBookmark : faBookmarkReg} />
          {job.isSaved
            ? txt('Saved', 'Sauvegardé', lang)
            : txt('Save', 'Sauvegarder', lang)}
        </button>
      </div>

      <div className="jd-divider" />

      {/* Description */}
      <div className="jd-section">
        <h3 className="jd-section__title">
          {txt('Job Description', 'Description du poste', lang)}
        </h3>
        <p className="jd-section__text">
          {txt(job.descEn, job.descFr, lang)}
        </p>
      </div>

      {/* Requirements */}
      <div className="jd-section">
        <h3 className="jd-section__title">
          {txt('Requirements', 'Exigences', lang)}
        </h3>
        <ul className="jd-list">
          {(lang === 'fr' ? job.requirementsFr : job.requirementsEn).map((req, i) => (
            <li key={i} className="jd-list__item">
              <div className="jd-list__check">
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Benefits */}
      <div className="jd-section">
        <h3 className="jd-section__title">
          {txt('Benefits', 'Avantages', lang)}
        </h3>
        <div className="jd-benefits">
          {(lang === 'fr' ? job.benefitsFr : job.benefitsEn).map((b, i) => (
            <div key={i} className="jd-benefit-tag">
              <FontAwesomeIcon icon={faShield} />
              {b}
            </div>
          ))}
        </div>
      </div>

      {/* Company */}
      <div className="jd-section">
        <h3 className="jd-section__title">
          {txt('About', 'À propos de', lang)} {job.company}
        </h3>
        <div className="jd-company-card">
          <img src={job.companyLogo} alt={job.company} />
          <div>
            <p className="jd-company-card__name">{job.company}</p>
            <p className="jd-company-card__location">
              <FontAwesomeIcon icon={faLocationDot} />
              {txt(job.locationEn, job.locationFr, lang)}
            </p>
          </div>
        </div>
        {/* TODO: fetch company details from API */}
        <p className="jd-api-note">
          📡 {txt('Full company info coming via API', 'Infos entreprise complètes bientôt via l\'API', lang)}
        </p>
      </div>

      {/* Apply CTA */}
      <button className="jd-apply-cta" onClick={onApply}>
        {txt('Apply for this position', 'Postuler à ce poste', lang)}
        <FontAwesomeIcon icon={faArrowRight} />
      </button>

    </div>
  )

  if (isMobile) {
    return (
      <div className="jd-mobile">
        <div className="jd-mobile__header">
          <button className="jd-mobile__close" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <h2>{txt('Job Details', 'Détails du poste', lang)}</h2>
          <div style={{ width:36 }} />
        </div>
        {Content}
      </div>
    )
  }

  return (
    <div className="jd-panel">
      <div className="jd-panel__close-row">
        <button className="jd-panel__close" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      {Content}
    </div>
  )
}