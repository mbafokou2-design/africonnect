import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft, faLocationDot, faUsers,
  faClock, faArrowTrendUp, faBookmark,
  faShare, faEllipsis, faFire, faGlobe,
  faFlag, faBell, faCheck, faArrowRight,
  faLightbulb, faChartLine
} from '@fortawesome/free-solid-svg-icons'
import { faBookmark as faBookmarkReg } from '@fortawesome/free-regular-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import { allProjects, projectCategories } from '../../data/projectsData'
import InvestModal from './InvestModal'
import './ProjectDetail.css'

function formatAmount(amount, currency) {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M ${currency}`
  if (amount >= 1000)    return `${(amount / 1000).toFixed(0)}K ${currency}`
  return `${amount} ${currency}`
}

function getPercent(raised, goal) {
  return Math.min(Math.round((raised / goal) * 100), 100)
}

function getProgressColor(percent) {
  if (percent >= 80) return '#2D6A4F'
  if (percent >= 50) return '#C9822A'
  return '#7C3D2B'
}

const fakeBackers = [
  { id:1, name:'Kwame Asante',  avatar:'https://i.pravatar.cc/32?img=53', amount:'500K FCFA' },
  { id:2, name:'Aïcha Koné',   avatar:'https://i.pravatar.cc/32?img=48', amount:'250K FCFA' },
  { id:3, name:'Chidi Okafor', avatar:'https://i.pravatar.cc/32?img=52', amount:'1M FCFA'   },
  { id:4, name:'Zara Diallo',  avatar:'https://i.pravatar.cc/32?img=41', amount:'750K FCFA' },
]

export default function ProjectDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { lang }     = useLang()
  const { addToast } = useToast()

  const project = allProjects.find(p => p.id === Number(id)) || allProjects[0]

  const [saved,         setSaved]         = useState(project.isSaved)
  const [following,     setFollowing]     = useState(false)
  const [menuOpen,      setMenuOpen]      = useState(false)
  const [showInvest,    setShowInvest]    = useState(false)
  const [tab,           setTab]           = useState('about') // about | updates | backers | discussion

  const percent = getPercent(project.raisedAmount, project.goalAmount)
  const color   = getProgressColor(percent)
  const catLabel = projectCategories.find(c => c.id === project.category)

  const handleShare = () => {
    const url = `${window.location.origin}/projects/${project.id}`
    if (navigator.share) navigator.share({ title: project.nameEn, url })
    else {
      navigator.clipboard.writeText(url)
      addToast(txt('Link copied!', 'Lien copié !', lang), 'success')
    }
  }

  const handleSave = () => {
    setSaved(p => !p)
    addToast(
      saved
        ? txt('Removed from saved', 'Retiré des sauvegardes', lang)
        : txt('Project saved!', 'Projet sauvegardé !', lang),
      saved ? 'info' : 'success'
    )
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/projects/${project.id}/save
  }

  const tabs = [
    { id:'about',      labelEn:'About',      labelFr:'À propos'    },
    { id:'updates',    labelEn:'Updates',    labelFr:'Mises à jour',
      count: project.updates.length },
    { id:'backers',    labelEn:'Backers',    labelFr:'Investisseurs',
      count: project.backers },
    { id:'discussion', labelEn:'Discussion', labelFr:'Discussion'   },
  ]

  return (
    <div className="pd-page">

      {/* Back */}
      <button className="pd-back" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>{txt('Projects', 'Projets', lang)}</span>
      </button>

      {/* Cover */}
      <div className="pd-cover">
        <img src={project.cover} alt={project.nameEn} />
        <div className="pd-cover__overlay" />
        {project.isFeatured && (
          <div className="pd-cover__featured">
            <FontAwesomeIcon icon={faFire} />
            {txt('Featured', 'En vedette', lang)}
          </div>
        )}
      </div>

      {/* Header card */}
      <div className="pd-header-card">
        <div className="pd-header-card__top">
          <div className="pd-header-card__logo-wrap">
            <img src={project.logo} alt={project.nameEn} className="pd-header-card__logo" />
          </div>
          <div className="pd-header-card__info">
            <div className="pd-header-card__badges">
              <span className={`pd-stage pd-stage--${project.stage}`}>
                {project.stage.toUpperCase()}
              </span>
              <span className="pd-category">
                {txt(catLabel?.labelEn || '', catLabel?.labelFr || '', lang)}
              </span>
            </div>
            <h1 className="pd-header-card__name">
              {txt(project.nameEn, project.nameFr, lang)}
            </h1>
            <p className="pd-header-card__tagline">
              {txt(project.taglineEn, project.taglineFr, lang)}
            </p>
            <p className="pd-header-card__location">
              <FontAwesomeIcon icon={faLocationDot} />
              {txt(project.locationEn, project.locationFr, lang)}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="pd-header-card__actions">
          <button
            className="pd-invest-btn"
            onClick={() => setShowInvest(true)}
          >
            {txt('Back this project', 'Soutenir ce projet', lang)}
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
          <button
            className={`pd-icon-btn ${saved ? 'pd-icon-btn--active' : ''}`}
            onClick={handleSave}
            title={txt('Save', 'Sauvegarder', lang)}
          >
            <FontAwesomeIcon icon={saved ? faBookmark : faBookmarkReg} />
          </button>
          <button className="pd-icon-btn" onClick={handleShare}
            title={txt('Share', 'Partager', lang)}>
            <FontAwesomeIcon icon={faShare} />
          </button>
          <button
            className={`pd-icon-btn ${following ? 'pd-icon-btn--active' : ''}`}
            onClick={() => {
              setFollowing(p => !p)
              addToast(
                following
                  ? txt('Unfollowed', 'Désabonné', lang)
                  : txt('Following! You\'ll get updates.', 'Abonné ! Vous recevrez des mises à jour.', lang),
                'success'
              )
            }}
            title={following ? txt('Unfollow', 'Se désabonner', lang) : txt('Follow', 'Suivre', lang)}
          >
            <FontAwesomeIcon icon={following ? faBell : faBell} />
            {following && <span className="pd-icon-btn__dot" />}
          </button>
          <div style={{ position:'relative' }}>
            <button className="pd-icon-btn" onClick={() => setMenuOpen(p => !p)}>
              <FontAwesomeIcon icon={faEllipsis} />
            </button>
            {menuOpen && (
              <div className="pd-menu">
                <button className="pd-menu__item" onClick={() => { handleShare(); setMenuOpen(false) }}>
                  <FontAwesomeIcon icon={faShare} />
                  <span>{txt('Share', 'Partager', lang)}</span>
                </button>
                {project.websiteUrl && (
                  <button className="pd-menu__item" onClick={() => window.open(project.websiteUrl, '_blank')}>
                    <FontAwesomeIcon icon={faGlobe} />
                    <span>{txt('Visit website', 'Voir le site', lang)}</span>
                  </button>
                )}
                <div className="pd-menu__divider" />
                <button className="pd-menu__item pd-menu__item--danger"
                  onClick={() => { addToast(txt('Reported', 'Signalé', lang), 'info'); setMenuOpen(false) }}>
                  <FontAwesomeIcon icon={faFlag} />
                  <span>{txt('Report project', 'Signaler le projet', lang)}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress card */}
      <div className="pd-progress-card">
        <div className="pd-progress-card__bar-wrap">
          <div className="pd-progress-card__bar">
            <div
              className="pd-progress-card__fill"
              style={{ width:`${percent}%`, background: color }}
            />
          </div>
          <span className="pd-progress-card__percent" style={{ color }}>
            {percent}% {txt('funded', 'financé', lang)}
          </span>
        </div>

        <div className="pd-progress-card__stats">
          <div className="pd-stat">
            <span className="pd-stat__value" style={{ color }}>
              {formatAmount(project.raisedAmount, project.currency)}
            </span>
            <span className="pd-stat__label">
              {txt('raised of', 'collecté sur', lang)} {formatAmount(project.goalAmount, project.currency)}
            </span>
          </div>
          <div className="pd-stat">
            <span className="pd-stat__value">
              {project.backers}
            </span>
            <span className="pd-stat__label">
              {txt('backers', 'investisseurs', lang)}
            </span>
          </div>
          <div className="pd-stat">
            <span className="pd-stat__value">
              {project.daysLeft}
            </span>
            <span className="pd-stat__label">
              {txt('days left', 'jours restants', lang)}
            </span>
          </div>
          <div className="pd-stat">
            <span className="pd-stat__value">
              {project.returns}
            </span>
            <span className="pd-stat__label">
              {txt('est. returns', 'retour estimé', lang)}
            </span>
          </div>
        </div>

        <div className="pd-progress-card__min">
          <FontAwesomeIcon icon={faLightbulb} />
          <span>
            {txt('Minimum investment', 'Investissement minimum', lang)}: {' '}
            <strong>{formatAmount(project.minInvestment, project.currency)}</strong>
          </span>
        </div>

        <button className="pd-progress-card__cta" onClick={() => setShowInvest(true)}>
          {txt('Back this project', 'Soutenir ce projet', lang)}
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      {/* Tabs */}
      <div className="pd-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`pd-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {txt(t.labelEn, t.labelFr, lang)}
            {t.count > 0 && (
              <span className="pd-tab__count">{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ════════ ABOUT ════════ */}
      {tab === 'about' && (
        <div className="pd-about">
          <div className="pd-about__grid">

            {/* Left */}
            <div className="pd-about__left">

              {/* Description */}
              <div className="pd-card">
                <h3 className="pd-card__title">
                  {txt('About this project', 'À propos de ce projet', lang)}
                </h3>
                <p className="pd-card__text">
                  {txt(project.descEn, project.descFr, lang)}
                </p>
                {project.tags && (
                  <div className="pd-tags">
                    {project.tags.map(tag => (
                      <span key={tag} className="pd-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Key info */}
              <div className="pd-card">
                <h3 className="pd-card__title">
                  {txt('Key Information', 'Informations clés', lang)}
                </h3>
                <div className="pd-info-rows">
                  <div className="pd-info-row">
                    <span>{txt('Category', 'Catégorie', lang)}</span>
                    <strong>{txt(catLabel?.labelEn || '', catLabel?.labelFr || '', lang)}</strong>
                  </div>
                  <div className="pd-info-row">
                    <span>{txt('Stage', 'Stade', lang)}</span>
                    <strong>{project.stage.toUpperCase()}</strong>
                  </div>
                  <div className="pd-info-row">
                    <span>{txt('Location', 'Localisation', lang)}</span>
                    <strong>{txt(project.locationEn, project.locationFr, lang)}</strong>
                  </div>
                  <div className="pd-info-row">
                    <span>{txt('Min. Investment', 'Invest. minimum', lang)}</span>
                    <strong>{formatAmount(project.minInvestment, project.currency)}</strong>
                  </div>
                  <div className="pd-info-row">
                    <span>{txt('Est. Returns', 'Retour estimé', lang)}</span>
                    <strong style={{ color: '#2D6A4F' }}>{project.returns}</strong>
                  </div>
                  {project.websiteUrl && (
                    <div className="pd-info-row">
                      <span>{txt('Website', 'Site web', lang)}</span>
                      <a href={project.websiteUrl} target="_blank" rel="noreferrer"
                        className="pd-info-row__link">
                        <FontAwesomeIcon icon={faGlobe} />
                        {project.websiteUrl.replace('https://', '')}
                      </a>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right — team */}
            <div className="pd-about__right">
              <div className="pd-card">
                <h3 className="pd-card__title">
                  {txt('The Team', 'L\'équipe', lang)}
                </h3>
                <div className="pd-team">
                  {project.team.map((member, i) => (
                    <div key={i} className="pd-team-member">
                      <img src={member.avatar} alt={member.name} />
                      <div>
                        <p className="pd-team-member__name">{member.name}</p>
                        <p className="pd-team-member__role">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invest CTA */}
              <div className="pd-card pd-card--cta">
                <FontAwesomeIcon icon={faChartLine} className="pd-card--cta__icon" />
                <p className="pd-card--cta__title">
                  {txt('Ready to invest?', 'Prêt à investir ?', lang)}
                </p>
                <p className="pd-card--cta__sub">
                  {txt(
                    `Join ${project.backers} backers supporting this project.`,
                    `Rejoignez ${project.backers} investisseurs qui soutiennent ce projet.`,
                    lang
                  )}
                </p>
                <button className="pd-card--cta__btn" onClick={() => setShowInvest(true)}>
                  {txt('Back this project', 'Soutenir ce projet', lang)}
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ════════ UPDATES ════════ */}
      {tab === 'updates' && (
        <div className="pd-updates">
          {project.updates.length === 0 ? (
            <div className="pd-empty">
              <div className="pd-empty__icon">
                <FontAwesomeIcon icon={faBell} />
              </div>
              <p>{txt('No updates yet', 'Aucune mise à jour', lang)}</p>
              <span>{txt('Follow this project to get notified.', 'Suivez ce projet pour être notifié.', lang)}</span>
            </div>
          ) : (
            project.updates.map(u => (
              <div key={u.id} className="pd-update-card">
                <div className="pd-update-card__dot" />
                <div>
                  <p className="pd-update-card__title">
                    {txt(u.titleEn, u.titleFr, lang)}
                  </p>
                  <span className="pd-update-card__date">
                    {txt(u.dateEn, u.dateFr, lang)}
                  </span>
                </div>
              </div>
            ))
          )}
          <div className="pd-api-note">
            📡 {txt('Updates loaded from API when connected', 'Mises à jour chargées via API', lang)}
          </div>
        </div>
      )}

      {/* ════════ BACKERS ════════ */}
      {tab === 'backers' && (
        <div className="pd-backers">
          <div className="pd-backers__summary">
            <div className="pd-backers__total">
              <FontAwesomeIcon icon={faUsers} />
              <span>
                <strong>{project.backers}</strong> {txt('people have backed this project', 'personnes ont soutenu ce projet', lang)}
              </span>
            </div>
          </div>
          <div className="pd-backers__list">
            {fakeBackers.map(b => (
              <div key={b.id} className="pd-backer-row">
                <img src={b.avatar} alt={b.name} />
                <div className="pd-backer-row__info">
                  <span className="pd-backer-row__name">{b.name}</span>
                  <span className="pd-backer-row__amount">{b.amount}</span>
                </div>
                <FontAwesomeIcon icon={faCheck} className="pd-backer-row__check" />
              </div>
            ))}
            <p className="pd-backers__more">
              + {project.backers - fakeBackers.length} {txt('more backers', 'autres investisseurs', lang)}
            </p>
          </div>
          <div className="pd-api-note">
            📡 {txt('Full backers list from API', 'Liste complète via API', lang)}
          </div>
        </div>
      )}

      {/* ════════ DISCUSSION ════════ */}
      {tab === 'discussion' && (
        <div className="pd-discussion">
          <div className="pd-empty">
            <div className="pd-empty__icon">
              <FontAwesomeIcon icon={faChartLine} />
            </div>
            <p>{txt('Discussion coming soon', 'Discussion bientôt disponible', lang)}</p>
            <span>📡 {txt('Will be loaded from API', 'Sera chargé via API', lang)}</span>
          </div>
        </div>
      )}

      {/* Invest modal */}
      {showInvest && (
        <InvestModal
          project={project}
          onClose={() => setShowInvest(false)}
          lang={lang}
        />
      )}

    </div>
  )
}