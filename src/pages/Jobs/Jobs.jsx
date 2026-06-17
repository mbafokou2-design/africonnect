import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBriefcase, faSearch, faLocationDot,
  faBookmark, faBookmark as faBookmarkSolid,
  faFilter, faArrowRight, faPlus,
  faMoneyBill, faClock, faBuilding,
  faXmark, faWifi
} from '@fortawesome/free-solid-svg-icons'
import { faBookmark as faBookmarkReg } from '@fortawesome/free-regular-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import { allJobs, jobCategories, jobTypes } from '../../data/jobsData'
import JobDetail from './JobDetail'
import ApplyModal from './ApplyModal'
import PostJobModal from './PostJobModal'
import './Jobs.css'

const typeColors = {
  fulltime:   { bg: 'rgba(45,106,79,0.1)',   color: '#2D6A4F' },
  parttime:   { bg: 'rgba(201,130,42,0.1)',  color: '#C9822A' },
  remote:     { bg: 'rgba(67,56,202,0.1)',   color: '#4338ca' },
  freelance:  { bg: 'rgba(124,61,43,0.1)',   color: '#7C3D2B' },
  internship: { bg: 'rgba(124,58,237,0.1)',  color: '#7c3aed' },
}

export default function Jobs() {
  const { lang }     = useLang()
  const { addToast } = useToast()

  const [jobs,        setJobs]        = useState(allJobs)
  const [search,      setSearch]      = useState('')
  const [location,    setLocation]    = useState('')
  const [category,    setCategory]    = useState('all')
  const [jobType,     setJobType]     = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [applyJob,    setApplyJob]    = useState(null)
  const [showPostJob, setShowPostJob] = useState(false)
  const [tab,         setTab]         = useState('all') // all | saved

  const toggleSave = (jobId, e) => {
    e.stopPropagation()
    setJobs(prev => prev.map(j =>
      j.id === jobId ? { ...j, isSaved: !j.isSaved } : j
    ))
    const job = jobs.find(j => j.id === jobId)
    addToast(
      job.isSaved
        ? txt('Job removed from saved', 'Emploi retiré des sauvegardes', lang)
        : txt('Job saved!', 'Emploi sauvegardé !', lang),
      job.isSaved ? 'info' : 'success'
    )
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/jobs/${jobId}/save
  }

  const filtered = jobs.filter(j => {
    const matchTab      = tab === 'all' || j.isSaved
    const matchSearch   = !search   || j.titleEn.toLowerCase().includes(search.toLowerCase()) || j.titleFr.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase())
    const matchLocation = !location || j.locationEn.toLowerCase().includes(location.toLowerCase())
    const matchCat      = category === 'all' || j.category === category
    const matchType     = jobType  === 'all' || j.type === jobType
    return matchTab && matchSearch && matchLocation && matchCat && matchType
  })

  const newCount  = jobs.filter(j => j.isNew).length
  const savedCount = jobs.filter(j => j.isSaved).length

  return (
    <div className="jobs-page">

      {/* ── Header ── */}
      <div className="jobs-header">
        <div className="jobs-header__left">
          <div className="jobs-header__icon">
            <FontAwesomeIcon icon={faBriefcase} />
          </div>
          <div>
            <h1 className="jobs-header__title"
              data-en="Job Opportunities"
              data-fr="Opportunités d'emploi">
              {txt("Job Opportunities", "Opportunités d'emploi", lang)}
            </h1>
            <p className="jobs-header__sub">
              {txt('Find your next role in Africa', 'Trouvez votre prochain poste en Afrique', lang)}
            </p>
          </div>
        </div>
        <button className="jobs-post-btn" onClick={() => setShowPostJob(true)}>
          <FontAwesomeIcon icon={faPlus} />
          <span>{txt('Post a job', 'Publier un emploi', lang)}</span>
        </button>
      </div>

      {/* ── Search bar ── */}
      <div className="jobs-search-bar">
        <div className="jobs-search-bar__field">
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={txt('Job title, company...', 'Titre, entreprise...', lang)}
          />
          {search && (
            <button className="jobs-search-bar__clear"
              onClick={() => setSearch('')}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>
        <div className="jobs-search-bar__divider" />
        <div className="jobs-search-bar__field">
          <FontAwesomeIcon icon={faLocationDot} />
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder={txt('Location, country...', 'Lieu, pays...', lang)}
          />
          {location && (
            <button className="jobs-search-bar__clear"
              onClick={() => setLocation('')}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>
        <button
          className={`jobs-filter-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(p => !p)}
        >
          <FontAwesomeIcon icon={faFilter} />
          <span>{txt('Filters', 'Filtres', lang)}</span>
        </button>
      </div>

      {/* ── Filter panel ── */}
      {showFilters && (
        <div className="jobs-filters">
          <div className="jobs-filters__group">
            <label className="jobs-filters__label">
              {txt('Category', 'Catégorie', lang)}
            </label>
            <div className="jobs-filters__pills">
              {jobCategories.map(cat => (
                <button
                  key={cat.id}
                  className={`jobs-pill ${category === cat.id ? 'active' : ''}`}
                  onClick={() => setCategory(cat.id)}
                >
                  {txt(cat.labelEn, cat.labelFr, lang)}
                </button>
              ))}
            </div>
          </div>
          <div className="jobs-filters__group">
            <label className="jobs-filters__label">
              {txt('Job Type', 'Type de contrat', lang)}
            </label>
            <div className="jobs-filters__pills">
              {jobTypes.map(type => (
                <button
                  key={type.id}
                  className={`jobs-pill ${jobType === type.id ? 'active' : ''}`}
                  onClick={() => setJobType(type.id)}
                >
                  {txt(type.labelEn, type.labelFr, lang)}
                </button>
              ))}
            </div>
          </div>
          <button
            className="jobs-filters__reset"
            onClick={() => { setCategory('all'); setJobType('all'); setSearch(''); setLocation('') }}
          >
            {txt('Reset all filters', 'Réinitialiser', lang)}
          </button>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="jobs-tabs">
        <button
          className={`jobs-tab ${tab === 'all' ? 'active' : ''}`}
          onClick={() => setTab('all')}
        >
          {txt('All Jobs', 'Tous les emplois', lang)}
          {newCount > 0 && <span className="jobs-tab__badge">{newCount} {txt('new', 'nouveaux', lang)}</span>}
        </button>
        <button
          className={`jobs-tab ${tab === 'saved' ? 'active' : ''}`}
          onClick={() => setTab('saved')}
        >
          {txt('Saved', 'Sauvegardés', lang)}
          {savedCount > 0 && <span className="jobs-tab__count">{savedCount}</span>}
        </button>
      </div>

      {/* ── Results count ── */}
      {filtered.length > 0 && (
        <p className="jobs-count">
          <strong>{filtered.length}</strong> {txt('jobs found', 'emplois trouvés', lang)}
        </p>
      )}

      {/* ── Job list ── */}
      <div className="jobs-list">
        {filtered.length === 0 ? (
          <div className="jobs-empty">
            <span>🔍</span>
            <p>{txt('No jobs found', 'Aucun emploi trouvé', lang)}</p>
            <button onClick={() => { setSearch(''); setLocation(''); setCategory('all'); setJobType('all') }}>
              {txt('Clear filters', 'Effacer les filtres', lang)}
            </button>
          </div>
        ) : (
          filtered.map(job => {
            const tc = typeColors[job.type] || typeColors.fulltime
            const typeLabel = jobTypes.find(t => t.id === job.type)
            return (
              <div
                key={job.id}
                className={`job-card ${selectedJob?.id === job.id ? 'job-card--active' : ''}`}
                onClick={() => setSelectedJob(job)}
              >
                {/* Logo + bookmark */}
                <div className="job-card__top">
                  <div className="job-card__logo">
                    <img src={job.companyLogo} alt={job.company} />
                  </div>
                  <div className="job-card__badges">
                    {job.isNew && (
                      <span className="job-card__new">
                        {txt('New', 'Nouveau', lang)}
                      </span>
                    )}
                    <button
                      className={`job-card__save-btn ${job.isSaved ? 'saved' : ''}`}
                      onClick={e => toggleSave(job.id, e)}
                      title={job.isSaved
                        ? txt('Remove from saved', 'Retirer des sauvegardes', lang)
                        : txt('Save job', 'Sauvegarder', lang)}
                    >
                      <FontAwesomeIcon icon={job.isSaved ? faBookmarkSolid : faBookmarkReg} />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="job-card__info">
                  <h3 className="job-card__title">
                    {txt(job.titleEn, job.titleFr, lang)}
                  </h3>
                  <p className="job-card__company">
                    <FontAwesomeIcon icon={faBuilding} />
                    {job.company}
                  </p>
                  <p className="job-card__location">
                    <FontAwesomeIcon icon={faLocationDot} />
                    {txt(job.locationEn, job.locationFr, lang)}
                  </p>
                  <p className="job-card__salary">
                    <FontAwesomeIcon icon={faMoneyBill} />
                    {txt(job.salaryEn, job.salaryFr, lang)}
                  </p>
                </div>

                {/* Footer */}
                <div className="job-card__footer">
                  <span
                    className="job-card__type"
                    style={{ background: tc.bg, color: tc.color }}
                  >
                    {typeLabel ? txt(typeLabel.labelEn, typeLabel.labelFr, lang) : job.type}
                  </span>
                  <span className="job-card__posted">
                    <FontAwesomeIcon icon={faClock} />
                    {txt(job.postedEn, job.postedFr, lang)}
                  </span>
                  <button
                    className="job-card__apply-btn"
                    onClick={e => { e.stopPropagation(); setApplyJob(job) }}
                  >
                    {txt('Apply', 'Postuler', lang)}
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </div>

              </div>
            )
          })
        )}
      </div>

      {/* ── Job Detail side panel (desktop) / page (mobile) ── */}
      {selectedJob && (
        <JobDetail
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={() => setApplyJob(selectedJob)}
          onSave={toggleSave}
          lang={lang}
        />
      )}

      {/* ── Apply Modal ── */}
      {applyJob && (
        <ApplyModal
          job={applyJob}
          onClose={() => setApplyJob(null)}
          lang={lang}
        />
      )}

      {/* ── Post Job Modal ── */}
      {showPostJob && (
        <PostJobModal
          onClose={() => setShowPostJob(false)}
          lang={lang}
        />
      )}

    </div>
  )
}