import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBriefcase, faMoneyBillTrendUp,
  faUserGroup, faArrowRight, faUsers
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import {
  featuredJobs,
  featuredProjects,
  popularGroups
} from '../../data/rightPanelData'
import './RightPanel.css'

export default function RightPanel() {
  const { lang } = useLang()

  return (
    <aside className="right-panel">

      {/* ── Jobs Section ── */}
      <div className="rp-card">
        <div className="rp-card__header">
          <div className="rp-card__title-row">
            <div className="rp-card__icon rp-card__icon--blue">
              <FontAwesomeIcon icon={faBriefcase} />
            </div>
            <h3
              className="rp-card__title"
              data-en="Job Opportunities"
              data-fr="Opportunités d'emploi"
            >
              {txt("Job Opportunities", "Opportunités d'emploi", lang)}
            </h3>
            <a
              href="/jobs"
              className="rp-card__view-all"
              data-en="See all"
              data-fr="Voir tout"
            >
              {txt('See all', 'Voir tout', lang)}
            </a>
          </div>
        </div>

        <div className="rp-card__list">
          {featuredJobs.map(job => (
            <a key={job.id} href={`/jobs/${job.id}`} className="rp-job-item">
              <div className="rp-job-item__logo">
                <img src={job.logo} alt={job.company} />
                {/* ↑ REPLACE with API logo */}
              </div>
              <div className="rp-job-item__info">
                <span className="rp-job-item__title">
                  {txt(job.titleEn, job.titleFr, lang)}
                </span>
                <span className="rp-job-item__company">
                  {job.company} · {txt(job.locationEn, job.locationFr, lang)}
                </span>
                <span className="rp-job-item__time">
                  {txt(job.timeEn, job.timeFr, lang)}
                </span>
              </div>
              {job.isNew && (
                <span className="rp-job-item__badge">
                  {txt('New', 'Nouveau', lang)}
                </span>
              )}
            </a>
          ))}
        </div>

        <a href="/jobs" className="rp-card__footer-link">
          <span data-en="See all offers" data-fr="Voir toutes les offres">
            {txt('See all offers', 'Voir toutes les offres', lang)}
          </span>
          <FontAwesomeIcon icon={faArrowRight} />
        </a>
      </div>

      {/* ── Projects Section ── */}
      <div className="rp-card">
        <div className="rp-card__header">
          <div className="rp-card__title-row">
            <div className="rp-card__icon rp-card__icon--green">
              <FontAwesomeIcon icon={faMoneyBillTrendUp} />
            </div>
            <h3
              className="rp-card__title"
              data-en="Projects to Fund"
              data-fr="Projets à financer"
            >
              {txt('Projects to Fund', 'Projets à financer', lang)}
            </h3>
          </div>
          <a href="/projects" className="rp-card__view-all">
            {txt('See all', 'Voir tout', lang)}
          </a>
        </div>

        <div className="rp-card__list">
          {featuredProjects.map(project => (
            <a key={project.id} href={`/projects/${project.id}`} className="rp-project-item">
              <div className="rp-project-item__icon">
                {project.icon}
              </div>
              <div className="rp-project-item__info">
                <span className="rp-project-item__name">
                  {txt(project.nameEn, project.nameFr, lang)}
                </span>
                <span className="rp-project-item__desc">
                  {txt(project.descEn, project.descFr, lang)}
                </span>
                <div className="rp-project-item__progress-wrap">
                  <div className="rp-project-item__progress-bar">
                    <div
                      className="rp-project-item__progress-fill"
                      style={{
                        width: `${project.percent}%`,
                        background: project.color
                      }}
                    />
                  </div>
                  <div className="rp-project-item__amounts">
                    <span style={{ color: project.color }}>
                      {project.percent}% {txt('funded', 'financé', lang)}
                    </span>
                    <span className="rp-project-item__goal">
                      {project.amountRaised} {project.currency}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <a href="/projects" className="rp-card__footer-link">
          <span data-en="See all projects" data-fr="Voir tous les projets">
            {txt('See all projects', 'Voir tous les projets', lang)}
          </span>
          <FontAwesomeIcon icon={faArrowRight} />
        </a>
      </div>

      {/* ── Groups Section ── */}
      <div className="rp-card">
        <div className="rp-card__header">
          <div className="rp-card__title-row">
            <div className="rp-card__icon rp-card__icon--purple">
              <FontAwesomeIcon icon={faUserGroup} />
            </div>
            <h3
              className="rp-card__title"
              data-en="Popular Groups"
              data-fr="Groupes populaires"
            >
              {txt('Popular Groups', 'Groupes populaires', lang)}
            </h3>
          </div>
          <a href="/groups" className="rp-card__view-all">
            {txt('See all', 'Voir tout', lang)}
          </a>
        </div>

        <div className="rp-card__list">
          {popularGroups.map(group => (
            <div key={group.id} className="rp-group-item">
              <div className="rp-group-item__avatar">
                <img src={group.avatar} alt={group.nameEn} />
                {/* ↑ REPLACE with API group image */}
              </div>
              <div className="rp-group-item__info">
                <span className="rp-group-item__name">
                  {txt(group.nameEn, group.nameFr, lang)}
                </span>
                <span className="rp-group-item__members">
                  <FontAwesomeIcon icon={faUsers} />
                  {group.members} {txt('members', 'membres', lang)}
                </span>
              </div>
              <button className="rp-group-item__join">
                {txt('Join', 'Rejoindre', lang)}
              </button>
            </div>
          ))}
        </div>

        <a href="/groups" className="rp-card__footer-link">
          <span data-en="See all groups" data-fr="Voir tous les groupes">
            {txt('See all groups', 'Voir tous les groupes', lang)}
          </span>
          <FontAwesomeIcon icon={faArrowRight} />
        </a>
      </div>

    </aside>
  )
}
