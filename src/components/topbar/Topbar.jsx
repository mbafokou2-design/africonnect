import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch, faChevronDown,
  faHouse, faUsers, faEnvelope, faBell
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import './Topbar.css'

const navItems = [
  { icon: faHouse,    en: 'Home',          fr: 'Accueil',       path: '/'              },
  { icon: faUsers,    en: 'Network',        fr: 'Réseau',        path: '/network'       },
  { icon: faEnvelope, en: 'Messaging',      fr: 'Messagerie',    path: '/messaging',    badge: 3 },
  { icon: faBell,     en: 'Notifications',  fr: 'Notifications', path: '/notifications', badge: 7 },
]

export default function Topbar({ activePath = '/' }) {
  const { lang } = useLang()

  return (
    <header className="topbar">

      {/* LEFT — Logo */}
      <div className="topbar__left">
        <a href="/" className="topbar__logo">
          <div className="topbar__logo-placeholder">
            <span>AC</span>
          </div>
          <div className="topbar__logo-text">
            <span className="topbar__logo-name">AfriConnect</span>
            <span
              className="topbar__logo-tagline"
              data-en="Connect. Collaborate. Succeed."
              data-fr="Connecter. Collaborer. Réussir."
            >
              {txt('Connect. Collaborate. Succeed.', 'Connecter. Collaborer. Réussir.', lang)}
            </span>
          </div>
        </a>
      </div>

      {/* CENTER — Search (desktop only) */}
      <div className="topbar__center">
        <div className="topbar__search">
          <FontAwesomeIcon icon={faSearch} className="topbar__search-icon" />
          <input
            type="text"
            className="topbar__search-input"
            placeholder={txt(
              'Search people, skills, companies...',
              'Rechercher personnes, compétences, entreprises...',
              lang
            )}
          />
        </div>
      </div>

      {/* RIGHT — Nav + User (desktop) / Icons only (mobile) */}
      <div className="topbar__right">

        {/* Mobile icons only */}
        <div className="topbar__mobile-icons">
          <a href="/search" className="topbar__mobile-btn">
            <FontAwesomeIcon icon={faSearch} />
          </a>
          <a href="/messaging" className="topbar__mobile-btn">
            <FontAwesomeIcon icon={faEnvelope} />
            <span className="topbar__badge">3</span>
          </a>
          <a href="/notifications" className="topbar__mobile-btn">
            <FontAwesomeIcon icon={faBell} />
            <span className="topbar__badge">7</span>
          </a>
          <a href="/profile" className="topbar__avatar topbar__avatar--mobile">
            <img src="https://i.pravatar.cc/40?img=11" alt="Jean" />
            <span className="topbar__avatar-dot" />
          </a>
        </div>

        {/* Desktop nav */}
<nav className="topbar__nav">
  {navItems.map(item => (
    <a
      key={item.path}
      href={item.path}
      className={`topbar__nav-item ${
        activePath === item.path ? 'active' : ''
      }`}
    >
      <div className="topbar__nav-icon-wrap">
        <FontAwesomeIcon
          icon={item.icon}
          className="topbar__nav-icon"
        />
        {item.badge && (
          <span className="topbar__badge">{item.badge}</span>
        )}
      </div>

      <span
        className="topbar__nav-label"
        data-en={item.en}
        data-fr={item.fr}
      >
        {txt(item.en, item.fr, lang)}
      </span>
    </a>
  ))}
</nav>

        {/* Desktop user */}
        <div className="topbar__user">
          <div className="topbar__avatar">
            <img src="https://i.pravatar.cc/40?img=11" alt="Jean Dupont" />
            <span className="topbar__avatar-dot" />
          </div>
          <div className="topbar__user-info">
            <span className="topbar__user-name">Jean Dupont</span>
            <span
              className="topbar__user-sub"
              data-en="View my profile"
              data-fr="Voir mon profil"
            >
              {txt('View my profile', 'Voir mon profil', lang)}
            </span>
          </div>
          <FontAwesomeIcon icon={faChevronDown} className="topbar__chevron" />
        </div>

      </div>
    </header>
  )
}