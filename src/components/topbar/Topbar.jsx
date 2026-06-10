import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch, faChevronDown,
  faHouse, faUsers, faEnvelope, faBell,
  faUser, faGear, faRightFromBracket
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import './Topbar.css'

const navItems = [
  { icon: faHouse,     en: 'Home',          fr: 'Accueil',         path: '/'              },
  { icon: faUsers,     en: 'Network',        fr: 'Réseau',          path: '/network'       },
  { icon: faEnvelope,  en: 'Messaging',      fr: 'Messagerie',      path: '/messaging',    badge: 3 },
  { icon: faBell,      en: 'Notifications',  fr: 'Notifications',   path: '/notifications', badge: 7 },
]

export default function Topbar({ activePath = '/' }) {
  const { lang } = useLang()
  const [dropOpen, setDropOpen] = useState(false)
  const dropRef = useRef()

  useEffect(() => {
    if (!dropOpen) return
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropOpen])

  return (
    <header className="topbar">

      {/* LEFT */}
      <div className="topbar__left">
        <a href="/" className="topbar__logo">
          <div className="topbar__logo-placeholder"><span>AC</span></div>
          <div className="topbar__logo-text">
            <span className="topbar__logo-name">AfriConnect</span>
            <span className="topbar__logo-tagline"
              data-en="Connect. Collaborate. Succeed."
              data-fr="Connecter. Collaborer. Réussir.">
              {txt('Connect. Collaborate. Succeed.', 'Connecter. Collaborer. Réussir.', lang)}
            </span>
          </div>
        </a>
      </div>

      {/* CENTER */}
      <div className="topbar__center">
        <a href="/search" className="topbar__search-link">
          <div className="topbar__search">
            <FontAwesomeIcon icon={faSearch} className="topbar__search-icon" />
            <span className="topbar__search-placeholder">
              {txt('Search people, skills, companies...', 'Rechercher personnes, compétences...', lang)}
            </span>
          </div>
        </a>
      </div>

      {/* RIGHT */}
      <div className="topbar__right">

        {/* Mobile icons */}
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
            <a key={item.path} href={item.path}
              className={`topbar__nav-item ${activePath === item.path ? 'active' : ''}`}>
              <div className="topbar__nav-icon-wrap">
                <FontAwesomeIcon icon={item.icon} className="topbar__nav-icon" />
                {item.badge && <span className="topbar__badge">{item.badge}</span>}
              </div>
              <span className="topbar__nav-label"
                data-en={item.en} data-fr={item.fr}>
                {txt(item.en, item.fr, lang)}
              </span>
            </a>
          ))}
        </nav>

        {/* Desktop user dropdown */}
        <div className="topbar__user-wrap" ref={dropRef}>
          <button
            className="topbar__user"
            onClick={() => setDropOpen(p => !p)}
          >
            <div className="topbar__avatar">
              <img src="https://i.pravatar.cc/40?img=11" alt="Jean Dupont" />
              <span className="topbar__avatar-dot" />
            </div>
            <div className="topbar__user-info">
              <span className="topbar__user-name">Jean Dupont</span>
              <span className="topbar__user-sub"
                data-en="View my profile" data-fr="Voir mon profil">
                {txt('View my profile', 'Voir mon profil', lang)}
              </span>
            </div>
            <FontAwesomeIcon icon={faChevronDown}
              className={`topbar__chevron ${dropOpen ? 'open' : ''}`} />
          </button>

          {dropOpen && (
            <div className="topbar__dropdown">
              <div className="topbar__dropdown-user">
                <img src="https://i.pravatar.cc/48?img=11" alt="Jean" />
                <div>
                  <p className="topbar__dropdown-name">Jean Dupont</p>
                  <p className="topbar__dropdown-title">
                    {txt('Full Stack Developer', 'Développeur Full Stack', lang)}
                  </p>
                </div>
              </div>
              <div className="topbar__dropdown-divider" />
              <a href="/profile" className="topbar__dropdown-item"
                onClick={() => setDropOpen(false)}>
                <FontAwesomeIcon icon={faUser} />
                <span>{txt('View Profile', 'Voir Profil', lang)}</span>
              </a>
              <a href="/settings" className="topbar__dropdown-item"
                onClick={() => setDropOpen(false)}>
                <FontAwesomeIcon icon={faGear} />
                <span>{txt('Settings', 'Paramètres', lang)}</span>
              </a>
              <div className="topbar__dropdown-divider" />
              <button className="topbar__dropdown-item topbar__dropdown-item--danger">
                <FontAwesomeIcon icon={faRightFromBracket} />
                <span>{txt('Log out', 'Déconnexion', lang)}</span>
                {/* TODO: call ${import.meta.env.VITE_API_BASE_URL}/auth/logout */}
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}