import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser, faPen, faMapPin,
  faBriefcase, faGraduationCap,
  faLink, faUsers
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import './Profile.css'

export default function Profile() {
  const { lang } = useLang()

  return (
    <div className="profile-page">

      {/* Cover + Avatar */}
      <div className="profile-cover">
        <div className="profile-cover__bg">
          {/* REPLACE with real cover image from API */}
        </div>
        <div className="profile-cover__avatar-wrap">
          <img
            src="https://i.pravatar.cc/96?img=11"
            alt="Jean Dupont"
            className="profile-cover__avatar"
            // ↑ REPLACE with real avatar from API
          />
          <button className="profile-cover__edit-avatar">
            <FontAwesomeIcon icon={faPen} />
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="profile-info-card">
        <div className="profile-info-card__header">
          <div>
            <h1 className="profile-info-card__name">Jean Dupont</h1>
            <p className="profile-info-card__title"
              data-en="Full Stack Developer · AfriConnect"
              data-fr="Développeur Full Stack · AfriConnect">
              {txt('Full Stack Developer · AfriConnect', 'Développeur Full Stack · AfriConnect', lang)}
            </p>
            <div className="profile-info-card__meta">
              <span><FontAwesomeIcon icon={faMapPin} /> Yaoundé, Cameroun</span>
              <span><FontAwesomeIcon icon={faUsers} /> 342 {txt('connections', 'connexions', lang)}</span>
            </div>
          </div>
          <button className="profile-edit-btn">
            <FontAwesomeIcon icon={faPen} />
            {txt('Edit', 'Modifier', lang)}
          </button>
        </div>

        <div className="profile-info-card__actions">
          <button className="profile-btn profile-btn--primary">
            {txt('Open to work', 'Ouvert aux opportunités', lang)}
          </button>
          <button className="profile-btn profile-btn--outline">
            <FontAwesomeIcon icon={faLink} />
            {txt('Share profile', 'Partager profil', lang)}
          </button>
        </div>
      </div>

      {/* About */}
      <div className="profile-section">
        <h2 className="profile-section__title"
          data-en="About" data-fr="À propos">
          {txt('About', 'À propos', lang)}
        </h2>
        <p className="profile-section__text"
          data-en="Passionate full-stack developer building digital solutions for Africa. 5+ years of experience in React, Node.js and mobile development."
          data-fr="Développeur full-stack passionné construisant des solutions numériques pour l'Afrique. 5+ ans d'expérience en React, Node.js et développement mobile.">
          {txt(
            "Passionate full-stack developer building digital solutions for Africa. 5+ years of experience in React, Node.js and mobile development.",
            "Développeur full-stack passionné construisant des solutions numériques pour l'Afrique. 5+ ans d'expérience en React, Node.js et développement mobile.",
            lang
          )}
        </p>
        {/* TODO: make editable via API */}
      </div>

      {/* Experience */}
      <div className="profile-section">
        <h2 className="profile-section__title"
          data-en="Experience" data-fr="Expérience">
          {txt('Experience', 'Expérience', lang)}
        </h2>
        {[
          { role:'Full Stack Developer', roleF:'Développeur Full Stack', co:'AfriConnect', period:'2023 – Present', periodF:'2023 – Présent' },
          { role:'Frontend Developer',   roleF:'Développeur Frontend',   co:'Orange Cameroun', period:'2021 – 2023', periodF:'2021 – 2023' },
        ].map((e, i) => (
          <div key={i} className="profile-timeline-item">
            <div className="profile-timeline-item__icon">
              <FontAwesomeIcon icon={faBriefcase} />
            </div>
            <div>
              <p className="profile-timeline-item__role">
                {txt(e.role, e.roleF, lang)}
              </p>
              <p className="profile-timeline-item__co">{e.co}</p>
              <p className="profile-timeline-item__period">
                {txt(e.period, e.periodF, lang)}
              </p>
            </div>
          </div>
        ))}
        {/* TODO: fetch from API + add/edit button */}
      </div>

      {/* Education */}
      <div className="profile-section">
        <h2 className="profile-section__title"
          data-en="Education" data-fr="Formation">
          {txt('Education', 'Formation', lang)}
        </h2>
        <div className="profile-timeline-item">
          <div className="profile-timeline-item__icon">
            <FontAwesomeIcon icon={faGraduationCap} />
          </div>
          <div>
            <p className="profile-timeline-item__role">
              {txt('Computer Science', 'Informatique', lang)}
            </p>
            <p className="profile-timeline-item__co">
              {txt('University of Yaoundé I', 'Université de Yaoundé I', lang)}
            </p>
            <p className="profile-timeline-item__period">2017 – 2021</p>
          </div>
        </div>
        {/* TODO: fetch from API */}
      </div>

      <div className="page-coming-soon">
        <span>📡</span>
        <p>{txt('Full profile editing coming via API', 'Édition complète du profil bientôt via l\'API', lang)}</p>
      </div>

    </div>
  )
}