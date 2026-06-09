import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHouse, faUsers, faPlus,
  faEnvelope, faUser
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import './BottomNav.css'

export default function BottomNav({ activePath = '/', onPlusClick }) {
  const { lang } = useLang()
  const [visible, setVisible] = useState(true)
  const lastScrollY = { current: 0 }

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY
      if (current < 60) {
        setVisible(true)
      } else if (current > lastScrollY.current) {
        setVisible(false) // scrolling down — hide
      } else {
        setVisible(true)  // scrolling up — show
      }
      lastScrollY.current = current
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { icon: faHouse,   path: '/',            en: 'Home',       fr: 'Accueil'    },
    { icon: faUsers,   path: '/network',     en: 'Network',    fr: 'Réseau'     },
    { icon: faEnvelope,path: '/messaging',   en: 'Messages',   fr: 'Messages',  badge: 3 },
    { icon: faUser,    path: '/profile',     en: 'Profile',    fr: 'Profil'     },
  ]

  return (
    <nav className={`bottom-nav ${visible ? 'bottom-nav--visible' : 'bottom-nav--hidden'}`}>
      {navItems.slice(0, 2).map(item => (
        <a
          key={item.path}
          href={item.path}
          className={`bottom-nav__item ${activePath === item.path ? 'active' : ''}`}
        >
          <div className="bottom-nav__icon-wrap">
            <FontAwesomeIcon icon={item.icon} />
          </div>
          <span data-en={item.en} data-fr={item.fr}>
            {txt(item.en, item.fr, lang)}
          </span>
        </a>
      ))}

      {/* Center + button */}
      <button className="bottom-nav__plus" onClick={onPlusClick}>
        <FontAwesomeIcon icon={faPlus} />
      </button>

      {navItems.slice(2).map(item => (
        <a
          key={item.path}
          href={item.path}
          className={`bottom-nav__item ${activePath === item.path ? 'active' : ''}`}
        >
          <div className="bottom-nav__icon-wrap">
            <FontAwesomeIcon icon={item.icon} />
            {item.badge && <span className="bottom-nav__badge">{item.badge}</span>}
          </div>
          <span data-en={item.en} data-fr={item.fr}>
            {txt(item.en, item.fr, lang)}
          </span>
        </a>
      ))}
    </nav>
  )
}