import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faRocket, faSearch, faPlus, faFilter,
  faBookmark, faChevronDown, faXmark,
  faLocationDot, faClock, faUsers,
  faArrowTrendUp, faFire, faSeedling,
  faLaptop, faHeartPulse, faStore,
  faBolt, faFilm, faBuilding,
  faIndustry, faEllipsis, faStar,
  faArrowRight, faChartLine
} from '@fortawesome/free-solid-svg-icons'
import { faBookmark as faBookmarkReg } from '@fortawesome/free-regular-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import {
  allProjects, myProjects,
  projectCategories, fundingStages
} from '../../data/projectsData'
import SubmitProjectModal from './SubmitProjectModal'
import InvestModal from './InvestModal'
import './Projects.css'

const catIcons = {
  all:           faRocket,
  agritech:      faSeedling,
  fintech:       faChartLine,
  edtech:        faLaptop,
  healthtech:    faHeartPulse,
  ecommerce:     faStore,
  energy:        faBolt,
  media:         faFilm,
  realestate:    faBuilding,
  manufacturing: faIndustry,
  other:         faEllipsis,
}

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

export default function Projects() {
  const { lang }     = useLang()
  const { addToast } = useToast()
  const navigate     = useNavigate()

  const [projects,      setProjects]      = useState(allProjects)
  const [search,        setSearch]        = useState('')
  const [category,      setCategory]      = useState('all')
  const [stage,         setStage]         = useState('all')
  const [showFilters,   setShowFilters]   = useState(false)
  const [tab,           setTab]           = useState('discover') // discover | mine | saved
  const [showSubmit,    setShowSubmit]    = useState(false)
  const [investProject, setInvestProject] = useState(null)
  const [sortBy,        setSortBy]        = useState('trending') // trending | newest | mostfunded | endingsoon

  const sortOptions = [
    { id: 'trending',   labelEn: 'Trending',      labelFr: 'Tendances'        },
    { id: 'newest',     labelEn: 'Newest',         labelFr: 'Plus récents'     },
    { id: 'mostfunded', labelEn: 'Most funded',    labelFr: 'Plus financés'    },
    { id: 'endingsoon', labelEn: 'Ending soon',    labelFr: 'Fin imminente'    },
  ]

  const toggleSave = (projectId, e) => {
    e.stopPropagation()
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, isSaved: !p.isSaved } : p
    ))
    const project = projects.find(p => p.id === projectId)
    addToast(
      project.isSaved
        ? txt('Removed from saved', 'Retiré des sauvegardes', lang)
        : txt('Project saved!', 'Projet sauvegardé !', lang),
      project.isSaved ? 'info' : 'success'
    )
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/projects/${projectId}/save
  }

  const filtered = projects
    .filter(p => {
      const matchSearch   = !search || p.nameEn.toLowerCase().includes(search.toLowerCase()) || p.nameFr.toLowerCase().includes(search.toLowerCase()) || p.taglineEn.toLowerCase().includes(search.toLowerCase())
      const matchCategory = category === 'all' || p.category === category
      const matchStage    = stage    === 'all' || p.stage    === stage
      const matchTab      = tab === 'saved' ? p.isSaved : true
      return matchSearch && matchCategory && matchStage && matchTab
    })
    .sort((a, b) => {
      if (sortBy === 'mostfunded') return getPercent(b.raisedAmount, b.goalAmount) - getPercent(a.raisedAmount, a.goalAmount)
      if (sortBy === 'endingsoon') return a.daysLeft - b.daysLeft
      if (sortBy === 'newest')     return b.id - a.id
      return b.backers - a.backers // trending
    })

  const featured  = filtered.filter(p => p.isFeatured)
  const savedCount = projects.filter(p => p.isSaved).length

  return (
    <div className="projects-page">

      {/* ── Header ── */}
      <div className="projects-header">
        <div className="projects-header__left">
          <div className="projects-header__icon">
            <FontAwesomeIcon icon={faRocket} />
          </div>
          <div>
            <h1 className="projects-header__title"
              data-en="Projects & Funding"
              data-fr="Projets & Financement">
              {txt('Projects & Funding', 'Projets & Financement', lang)}
            </h1>
            <p className="projects-header__sub">
              {txt(
                'Back the next African innovation',
                "Soutenez la prochaine innovation africaine",
                lang
              )}
            </p>
          </div>
        </div>
        <button
          className="projects-submit-btn"
          onClick={() => setShowSubmit(true)}
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>{txt('Submit a project', 'Soumettre un projet', lang)}</span>
        </button>
      </div>

      {/* ── Search + Filter bar ── */}
      <div className="projects-search-bar">
        <div className="projects-search-bar__field">
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={txt(
              'Search projects...',
              'Rechercher des projets...',
              lang
            )}
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="projects-sort-wrap">
          <select
            className="projects-sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            {sortOptions.map(s => (
              <option key={s.id} value={s.id}>
                {txt(s.labelEn, s.labelFr, lang)}
              </option>
            ))}
          </select>
        </div>

        {/* Filters toggle */}
        <button
          className={`projects-filter-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(p => !p)}
        >
          <FontAwesomeIcon icon={faFilter} />
          <span>{txt('Filters', 'Filtres', lang)}</span>
        </button>
      </div>

      {/* ── Filter panel ── */}
      {showFilters && (
        <div className="projects-filters">
          <div className="projects-filters__group">
            <label>{txt('Stage', 'Stade', lang)}</label>
            <div className="projects-filters__pills">
              {fundingStages.map(s => (
                <button
                  key={s.id}
                  className={`projects-pill ${stage === s.id ? 'active' : ''}`}
                  onClick={() => setStage(s.id)}
                >
                  {txt(s.labelEn, s.labelFr, lang)}
                </button>
              ))}
            </div>
          </div>
          <button
            className="projects-filters__reset"
            onClick={() => { setCategory('all'); setStage('all'); setSearch('') }}
          >
            {txt('Reset', 'Réinitialiser', lang)}
          </button>
        </div>
      )}

      {/* ── Category pills ── */}
      <div className="projects-cat-pills">
        {projectCategories.map(cat => (
          <button
            key={cat.id}
            className={`projects-cat-pill ${category === cat.id ? 'active' : ''}`}
            onClick={() => setCategory(prev => prev === cat.id ? 'all' : cat.id)}
          >
            <FontAwesomeIcon icon={catIcons[cat.id] || faRocket} />
            {txt(cat.labelEn, cat.labelFr, lang)}
          </button>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="projects-tabs">
        <button
          className={`projects-tab ${tab === 'discover' ? 'active' : ''}`}
          onClick={() => setTab('discover')}
        >
          {txt('Discover', 'Découvrir', lang)}
        </button>
        <button
          className={`projects-tab ${tab === 'mine' ? 'active' : ''}`}
          onClick={() => setTab('mine')}
        >
          {txt('My Projects', 'Mes Projets', lang)}
          {myProjects.length > 0 && (
            <span className="projects-tab__count">{myProjects.length}</span>
          )}
        </button>
        <button
          className={`projects-tab ${tab === 'saved' ? 'active' : ''}`}
          onClick={() => setTab('saved')}
        >
          {txt('Saved', 'Sauvegardés', lang)}
          {savedCount > 0 && (
            <span className="projects-tab__count">{savedCount}</span>
          )}
        </button>
      </div>

      {/* ════════ DISCOVER TAB ════════ */}
      {tab === 'discover' && (
        <>
          {/* Featured strip */}
          {featured.length > 0 && search === '' && category === 'all' && (
            <div className="projects-featured">
              <div className="projects-featured__header">
                <div className="projects-featured__title">
                  <FontAwesomeIcon icon={faFire} />
                  {txt('Featured Projects', 'Projets en vedette', lang)}
                </div>
              </div>
              <div className="projects-featured__strip">
                {featured.map(p => (
                  <FeaturedCard
                    key={p.id}
                    project={p}
                    lang={lang}
                    onNavigate={() => navigate(`/projects/${p.id}`)}
                    onSave={toggleSave}
                    onInvest={() => setInvestProject(p)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All projects */}
          <div className="projects-grid-section">
            <div className="projects-grid-section__header">
              <h2>{txt('All Projects', 'Tous les projets', lang)}</h2>
              <span className="projects-count">
                {filtered.length} {txt('projects', 'projets', lang)}
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="projects-empty">
                <div className="projects-empty__icon">
                  <FontAwesomeIcon icon={faSearch} />
                </div>
                <p>{txt('No projects found', 'Aucun projet trouvé', lang)}</p>
                <button onClick={() => { setSearch(''); setCategory('all'); setStage('all') }}>
                  {txt('Clear filters', 'Effacer les filtres', lang)}
                </button>
              </div>
            ) : (
              <div className="projects-grid">
                {filtered.map(p => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    lang={lang}
                    onNavigate={() => navigate(`/projects/${p.id}`)}
                    onSave={toggleSave}
                    onInvest={e => { e.stopPropagation(); setInvestProject(p) }}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ════════ MY PROJECTS TAB ════════ */}
      {tab === 'mine' && (
        <div className="projects-grid-section">
          {myProjects.length === 0 ? (
            <div className="projects-empty">
              <div className="projects-empty__icon">
                <FontAwesomeIcon icon={faRocket} />
              </div>
              <p>{txt('You haven\'t submitted any projects yet.', 'Vous n\'avez pas encore soumis de projets.', lang)}</p>
              <button onClick={() => setShowSubmit(true)}>
                {txt('Submit your first project', 'Soumettre votre premier projet', lang)}
              </button>
            </div>
          ) : (
            <div className="projects-grid">
              {myProjects.map(p => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  lang={lang}
                  onNavigate={() => navigate(`/projects/${p.id}`)}
                  onSave={toggleSave}
                  onInvest={e => { e.stopPropagation(); setInvestProject(p) }}
                  isOwner
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════════ SAVED TAB ════════ */}
      {tab === 'saved' && (
        <div className="projects-grid-section">
          {filtered.length === 0 ? (
            <div className="projects-empty">
              <div className="projects-empty__icon">
                <FontAwesomeIcon icon={faBookmark} />
              </div>
              <p>{txt('No saved projects yet.', 'Aucun projet sauvegardé.', lang)}</p>
              <button onClick={() => setTab('discover')}>
                {txt('Discover projects', 'Découvrir des projets', lang)}
              </button>
            </div>
          ) : (
            <div className="projects-grid">
              {filtered.map(p => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  lang={lang}
                  onNavigate={() => navigate(`/projects/${p.id}`)}
                  onSave={toggleSave}
                  onInvest={e => { e.stopPropagation(); setInvestProject(p) }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Submit modal */}
      {showSubmit && (
        <SubmitProjectModal
          onClose={() => setShowSubmit(false)}
          lang={lang}
          onSubmitted={() => {
            setShowSubmit(false)
            addToast(
              txt('Project submitted for review!', 'Projet soumis pour examen !', lang),
              'success'
            )
          }}
        />
      )}

      {/* Invest modal */}
      {investProject && (
        <InvestModal
          project={investProject}
          onClose={() => setInvestProject(null)}
          lang={lang}
        />
      )}

    </div>
  )
}

/* ════════════════════════════
   FEATURED CARD (horizontal)
════════════════════════════ */
function FeaturedCard({ project, lang, onNavigate, onSave, onInvest }) {
  const percent = getPercent(project.raisedAmount, project.goalAmount)
  const color   = getProgressColor(percent)

  return (
    <div className="featured-card" onClick={onNavigate}>
      <div className="featured-card__cover">
        <img src={project.cover} alt={project.nameEn} />
        <div className="featured-card__cover-overlay" />
        <div className="featured-card__stage">
          {project.stage.toUpperCase()}
        </div>
        <button
          className={`featured-card__save ${project.isSaved ? 'saved' : ''}`}
          onClick={e => onSave(project.id, e)}
        >
          <FontAwesomeIcon icon={project.isSaved ? faBookmark : faBookmarkReg} />
        </button>
      </div>

      <div className="featured-card__body">
        <div className="featured-card__logo-wrap">
          <img src={project.logo} alt={project.nameEn} className="featured-card__logo" />
        </div>
        <h3 className="featured-card__name">
          {txt(project.nameEn, project.nameFr, lang)}
        </h3>
        <p className="featured-card__tagline">
          {txt(project.taglineEn, project.taglineFr, lang)}
        </p>

        <div className="featured-card__progress-wrap">
          <div className="featured-card__progress-bar">
            <div
              className="featured-card__progress-fill"
              style={{ width:`${percent}%`, background: color }}
            />
          </div>
          <div className="featured-card__progress-stats">
            <span style={{ color }}>{percent}% {txt('funded', 'financé', lang)}</span>
            <span>{formatAmount(project.raisedAmount, project.currency)}</span>
          </div>
        </div>

        <div className="featured-card__meta">
          <span><FontAwesomeIcon icon={faUsers} /> {project.backers} {txt('backers', 'investisseurs', lang)}</span>
          <span><FontAwesomeIcon icon={faClock} /> {project.daysLeft} {txt('days left', 'jours restants', lang)}</span>
        </div>

        <button
          className="featured-card__invest-btn"
          onClick={e => { e.stopPropagation(); onInvest(e) }}
        >
          {txt('Back this project', 'Soutenir ce projet', lang)}
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  )
}

/* ════════════════════════════
   PROJECT CARD (grid)
════════════════════════════ */
function ProjectCard({ project, lang, onNavigate, onSave, onInvest, isOwner }) {
  const percent = getPercent(project.raisedAmount, project.goalAmount)
  const color   = getProgressColor(percent)

  return (
    <div className="project-card" onClick={onNavigate}>

      {/* Cover */}
      <div className="project-card__cover">
        <img src={project.cover} alt={project.nameEn} />
        {project.isFeatured && (
          <div className="project-card__featured-badge">
            <FontAwesomeIcon icon={faFire} />
            {txt('Featured', 'En vedette', lang)}
          </div>
        )}
        <button
          className={`project-card__save ${project.isSaved ? 'saved' : ''}`}
          onClick={e => onSave(project.id, e)}
        >
          <FontAwesomeIcon icon={project.isSaved ? faBookmark : faBookmarkReg} />
        </button>
      </div>

      {/* Body */}
      <div className="project-card__body">
        {/* Logo + name */}
        <div className="project-card__header-row">
          <img src={project.logo} alt={project.nameEn} className="project-card__logo" />
          <div className="project-card__title-group">
            <h3 className="project-card__name">
              {txt(project.nameEn, project.nameFr, lang)}
            </h3>
            <div className="project-card__badges">
              <span className={`project-card__stage project-card__stage--${project.stage}`}>
                {project.stage.toUpperCase()}
              </span>
              <span className="project-card__category">
                <FontAwesomeIcon icon={catIcons[project.category] || faRocket} />
                {txt(
                  projectCategories.find(c => c.id === project.category)?.labelEn || '',
                  projectCategories.find(c => c.id === project.category)?.labelFr || '',
                  lang
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <p className="project-card__tagline">
          {txt(project.taglineEn, project.taglineFr, lang)}
        </p>

        {/* Location */}
        <p className="project-card__location">
          <FontAwesomeIcon icon={faLocationDot} />
          {txt(project.locationEn, project.locationFr, lang)}
        </p>

        {/* Progress */}
        <div className="project-card__progress">
          <div className="project-card__progress-bar">
            <div
              className="project-card__progress-fill"
              style={{ width:`${percent}%`, background: color }}
            />
          </div>
          <div className="project-card__progress-row">
            <span className="project-card__raised">
              {formatAmount(project.raisedAmount, project.currency)}
            </span>
            <span className="project-card__percent" style={{ color }}>
              {percent}%
            </span>
          </div>
          <p className="project-card__goal">
            {txt('Goal', 'Objectif', lang)}: {formatAmount(project.goalAmount, project.currency)}
          </p>
        </div>

        {/* Stats */}
        <div className="project-card__stats">
          <div className="project-card__stat">
            <FontAwesomeIcon icon={faUsers} />
            <span>{project.backers}</span>
            <span>{txt('backers', 'invest.', lang)}</span>
          </div>
          <div className="project-card__stat">
            <FontAwesomeIcon icon={faClock} />
            <span>{project.daysLeft}</span>
            <span>{txt('days left', 'jours', lang)}</span>
          </div>
          <div className="project-card__stat">
            <FontAwesomeIcon icon={faArrowTrendUp} />
            <span>{project.returns || '—'}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="project-card__footer">
        {isOwner ? (
          <button
            className="project-card__manage-btn"
            onClick={e => { e.stopPropagation() }}
          >
            {txt('Manage', 'Gérer', lang)}
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        ) : (
          <button
            className="project-card__invest-btn"
            onClick={onInvest}
          >
            {txt('Back this project', 'Soutenir ce projet', lang)}
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        )}
      </div>

    </div>
  )
}