import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch, faChevronDown,
  faHouse, faUsers, faEnvelope, faBell,
  faUser, faGear, faRightFromBracket,
  faBorderAll, faUserGroup, faBriefcase,
  faMoneyBillTrendUp, faWrench, faCalendarDays,
  faGraduationCap, faHandshake, faGlobe,
  faStore, faEllipsis
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import './Topbar.css'
import logo from '../../assets/logo1.jpg'
import LogoutModal from '../ui/LogoutModal'

const navItems = [
  { icon: faHouse, en: 'Home', fr: 'Accueil', path: '/' },
  { icon: faUsers, en: 'Network', fr: 'Réseau', path: '/network' },
  { icon: faEnvelope, en: 'Messaging', fr: 'Messagerie', path: '/messaging', badge: 3 },
  { icon: faBell, en: 'Notifications', fr: 'Notifications', path: '/notifications', badge: 7 },
]

const menuSections = [
  {
    labelEn: 'Main',
    labelFr: 'Principal',
    items: [
      { icon: faHouse, en: 'Home', fr: 'Accueil', path: '/', color: '#7C3D2B', desc: null },
      { icon: faUsers, en: 'My Network', fr: 'Mon réseau', path: '/network', color: '#2D6A4F', desc: null },
      { icon: faEnvelope, en: 'Messaging', fr: 'Messagerie', path: '/messaging', color: '#7C3D2B', desc: null, badge: 3 },
      { icon: faBell, en: 'Notifications', fr: 'Notifications', path: '/notifications', color: '#C9822A', desc: null, badge: 7 },
    ]
  },
  {
    labelEn: 'Explore',
    labelFr: 'Explorer',
    items: [
      { icon: faUserGroup, en: 'Groups', fr: 'Groupes', path: '/groups', color: '#4338ca', descEn: 'Connect with people who share your interests.', descFr: 'Connectez-vous avec des personnes partageant vos intérêts.' },
      { icon: faBriefcase, en: 'Job Opportunities', fr: "Opportunités d'emploi", path: '/jobs', color: '#7C3D2B', descEn: 'Find your next role across Africa.', descFr: 'Trouvez votre prochain poste en Afrique.' },
      { icon: faMoneyBillTrendUp, en: 'Projects & Funding', fr: 'Projets & Financement', path: '/projects', color: '#2D6A4F', descEn: 'Fund or get funded for your next big idea.', descFr: 'Financez ou faites financer votre prochaine idée.' },
      { icon: faCalendarDays, en: 'Events', fr: 'Événements', path: '/events', color: '#C9822A', descEn: 'Find events near you or online.', descFr: 'Trouvez des événements près de chez vous.' },
      { icon: faGraduationCap, en: 'Training', fr: 'Formations', path: '/training', color: '#7c3aed', descEn: 'Develop your skills with African trainers.', descFr: 'Développez vos compétences avec des formateurs africains.' },
      { icon: faHandshake, en: 'Investors', fr: 'Investisseurs', path: '/investors', color: '#2D6A4F', descEn: 'Connect with investors ready to support you.', descFr: 'Connectez-vous avec des investisseurs prêts à vous soutenir.' },
      { icon: faWrench, en: 'Services & Skills', fr: 'Services & Compétences', path: '/services', color: '#7C3D2B', descEn: 'Offer or find professional services.', descFr: 'Offrez ou trouvez des services professionnels.' },
      { icon: faGlobe, en: 'Diaspora Connect', fr: 'Diaspora Connect', path: '/diaspora', color: '#C9822A', descEn: 'Africans abroad connected to home.', descFr: 'Les Africains à l\'étranger connectés au pays.' },
      { icon: faStore, en: 'B2B Marketplace', fr: 'Marketplace B2B', path: '/marketplace', color: '#4338ca', descEn: 'Buy, sell and partner with businesses.', descFr: 'Achetez, vendez et partenariez avec des entreprises.' },
    ]
  },
]

export default function Topbar({ activePath = '/' }) {
  const { lang } = useLang()
  const [showLogout, setShowLogout] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuSearch, setMenuSearch] = useState('')
  const dropRef = useRef()
  const menuRef = useRef()

  useEffect(() => {
    if (!dropOpen) return
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [dropOpen])

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  // Filter menu items by search
  const filteredSections = menuSearch.trim()
    ? [{
      labelEn: 'Results', labelFr: 'Résultats',
      items: menuSections.flatMap(s => s.items).filter(item =>
        item.en.toLowerCase().includes(menuSearch.toLowerCase()) ||
        item.fr.toLowerCase().includes(menuSearch.toLowerCase())
      )
    }]
    : menuSections

  return (
    <>
      <header className="topbar">

        {/* LEFT — Logo */}
        <div className="topbar__left">
          <a href="/" className="topbar__logo">
            <img src={logo} alt="AfriConnect" className="topbar__logo-img" />
            <div className="topbar__logo-text">
            </div>
          </a>
        </div>

        {/* CENTER — Search */}
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

          {/* ── MOBILE icons ── */}
          <div className="topbar__mobile-icons">
            <a href="/search" className="topbar__mobile-btn">
              <FontAwesomeIcon icon={faSearch} />
            </a>
            <a href="/notifications" className="topbar__mobile-btn">
              <FontAwesomeIcon icon={faBell} />
              <span className="topbar__badge">7</span>
            </a>
            {/* Grid menu button — mobile only */}
            <button
              className="topbar__mobile-btn topbar__grid-btn"
              onClick={() => setMenuOpen(p => !p)}
            >
              <FontAwesomeIcon icon={faBorderAll} />
            </button>
          </div>

          {/* ── DESKTOP nav ── */}
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

          {/* ── DESKTOP user dropdown ── */}
          <div className="topbar__user-wrap" ref={dropRef}>
            <button className="topbar__user" onClick={() => setDropOpen(p => !p)}>
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
                <button className="topbar__dropdown-item topbar__dropdown-item--danger"
                  onClick={() => {
                    setDropOpen(false)
                    setShowLogout(true)
                  }}>
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  <span>{txt('Log Out', 'Se déconnecter', lang)}</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* ══════════════════════════════════
          MOBILE MENU DRAWER
      ══════════════════════════════════ */}
      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}>
          <div
            className="mobile-menu"
            ref={menuRef}
            onClick={e => e.stopPropagation()}
          >
            {/* Menu header */}
            <div className="mobile-menu__header">
              <h2 className="mobile-menu__title">
                {txt('Menu', 'Menu', lang)}
              </h2>
              <button
                className="mobile-menu__close"
                onClick={() => setMenuOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Search in menu */}
            <div className="mobile-menu__search">
              <FontAwesomeIcon icon={faSearch} />
              <input
                type="text"
                value={menuSearch}
                onChange={e => setMenuSearch(e.target.value)}
                placeholder={txt(
                  'Search in menu...',
                  'Rechercher dans le menu...',
                  lang
                )}
              />
            </div>

            {/* Menu sections */}
            <div className="mobile-menu__content">
              {filteredSections.map(section => (
                <div key={section.labelEn} className="mobile-menu__section">
                  <p className="mobile-menu__section-label">
                    {txt(section.labelEn, section.labelFr, lang)}
                  </p>
                  {section.items.map(item => (

                    <a key={item.path}
                      href={item.path}
                      className={`mobile-menu__item ${activePath === item.path ? 'active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <div
                        className="mobile-menu__item-icon"
                        style={{ background: `${item.color}18`, color: item.color }}
                      >
                        <FontAwesomeIcon icon={item.icon} />
                        {item.badge && (
                          <span className="mobile-menu__item-badge">{item.badge}</span>
                        )}
                      </div>
                      <div className="mobile-menu__item-text">
                        <span className="mobile-menu__item-label">
                          {txt(item.en, item.fr, lang)}
                        </span>
                        {item.descEn && (
                          <span className="mobile-menu__item-desc">
                            {txt(item.descEn, item.descFr, lang)}
                          </span>
                        )}
                      </div>
                      {activePath === item.path && (
                        <div className="mobile-menu__item-active-dot" />
                      )}
                    </a>
                  ))}
                </div>
              ))}
            </div>

            {/* Bottom — user + settings */}
            <div className="mobile-menu__footer">
              <a href="/profile" className="mobile-menu__footer-user"
                onClick={() => setMenuOpen(false)}>
                <div className="mobile-menu__footer-avatar">
                  <img src="https://i.pravatar.cc/40?img=11" alt="Jean" />
                  <span className="mobile-menu__footer-dot" />
                </div>
                <div>
                  <p className="mobile-menu__footer-name">Jean Dupont</p>
                  <p className="mobile-menu__footer-sub">
                    {txt('View profile', 'Voir le profil', lang)}
                  </p>
                </div>
              </a>
              <a href="/settings" className="mobile-menu__footer-settings"
                onClick={() => setMenuOpen(false)}>
                <FontAwesomeIcon icon={faGear} />
              </a>
              <button className="mobile-menu__footer-settings"
                onClick={() => {
                  setMenuOpen(false)
                  setShowLogout(true)
                }}
                style={{ color: 'var(--color-danger)' }}>
                <FontAwesomeIcon icon={faRightFromBracket} />
              </button>
            </div>

          </div>
        </div>
      )}
      {showLogout && (
        <LogoutModal onClose={() => setShowLogout(false)} lang={lang} />
      )}
    </>
  )
}