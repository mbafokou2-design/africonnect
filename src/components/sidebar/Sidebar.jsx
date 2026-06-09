import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHouse, faUsers, faEnvelope, faUserGroup,
  faBriefcase, faMoneyBillTrendUp, faWrench,
  faCalendarDays, faGraduationCap, faHandshake,
  faGlobe, faStore, faEllipsis, faCrown
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import './Sidebar.css'

const mainNav = [
  { icon: faHouse,             en: 'Home',                  fr: 'Accueil',               path: '/'                },
  { icon: faUsers,             en: 'My Network',             fr: 'Mon réseau',             path: '/network'         },
  { icon: faEnvelope,          en: 'Messaging',              fr: 'Messagerie',             path: '/messaging'       },
  { icon: faUserGroup,         en: 'Groups',                 fr: 'Groupes',               path: '/groups'          },
  { icon: faBriefcase,         en: 'Job Opportunities',      fr: "Opportunités d'emploi",  path: '/jobs'            },
  { icon: faMoneyBillTrendUp,  en: 'Projects & Funding',     fr: 'Projets & Financement',  path: '/projects'        },
  { icon: faWrench,            en: 'Services & Skills',      fr: 'Services & Compétences', path: '/services'        },
  { icon: faCalendarDays,      en: 'Events',                 fr: 'Événements',             path: '/events'          },
  { icon: faGraduationCap,     en: 'Training',               fr: 'Formations',             path: '/training'        },
  { icon: faHandshake,         en: 'Investors',              fr: 'Investisseurs',          path: '/investors'       },
  { icon: faGlobe,             en: 'Diaspora Connect',       fr: 'Diaspora Connect',       path: '/diaspora'        },
  { icon: faStore,             en: 'B2B Marketplace',        fr: 'Marketplace B2B',        path: '/marketplace'     },
  { icon: faEllipsis,          en: 'More',                   fr: 'Plus',                   path: '/more'            },
]

export default function Sidebar({ activePath = '/' }) {
  const { lang } = useLang()

  return (
    <aside className="sidebar">

      {/* Nav Links */}
      <nav className="sidebar__nav">
        {mainNav.map(item => (
          <a
            key={item.path}
            href={item.path}
            className={`sidebar__nav-item ${activePath === item.path ? 'active' : ''}`}
          >
            <div className="sidebar__nav-icon">
              <FontAwesomeIcon icon={item.icon} />
            </div>
            <span
              className="sidebar__nav-label"
              data-en={item.en}
              data-fr={item.fr}
            >
              {txt(item.en, item.fr, lang)}
            </span>
          </a>
        ))}
      </nav>

      {/* Premium Card */}
      <div className="sidebar__premium">
        <div className="sidebar__premium-icon">
          <FontAwesomeIcon icon={faCrown} />
        </div>
        <p
          className="sidebar__premium-title"
          data-en="Go Premium"
          data-fr="Passez à Premium"
        >
          {txt('Go Premium', 'Passez à Premium', lang)}
        </p>
        <p
          className="sidebar__premium-desc"
          data-en="Unlock more opportunities and grow your network."
          data-fr="Débloquez plus d'opportunités et développez votre réseau."
        >
          {txt(
            'Unlock more opportunities and grow your network.',
            "Débloquez plus d'opportunités et développez votre réseau.",
            lang
          )}
        </p>
        <button className="sidebar__premium-btn">
          <span
            data-en="Discover Premium"
            data-fr="Découvrir Premium"
          >
            {txt('Discover Premium', 'Découvrir Premium', lang)}
          </span>
        </button>
      </div>

    </aside>
  )
}