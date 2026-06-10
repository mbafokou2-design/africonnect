import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBell, faThumbsUp, faUserPlus,
  faComment, faBriefcase, faCircle
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import './Notifications.css'

// TODO: fetch from ${import.meta.env.VITE_API_BASE_URL}/notifications
const notifications = [
  { id:1, type:'like',    avatar:'https://i.pravatar.cc/40?img=5',  nameEn:'Awa Diop',     nameFr:'Awa Diop',     bodyEn:'liked your post about AgriTech.',        bodyFr:'a aimé votre post sur l\'AgriTech.',       time:'2m',  read:false },
  { id:2, type:'connect', avatar:'https://i.pravatar.cc/40?img=12', nameEn:'Kofi Mensah',  nameFr:'Kofi Mensah',  bodyEn:'sent you a connection request.',          bodyFr:'vous a envoyé une demande de connexion.',  time:'15m', read:false },
  { id:3, type:'comment', avatar:'https://i.pravatar.cc/40?img=9',  nameEn:'Amina Traoré', nameFr:'Amina Traoré', bodyEn:'commented on your post.',                 bodyFr:'a commenté votre post.',                  time:'1h',  read:false },
  { id:4, type:'job',     avatar:null,                               nameEn:'Wave',         nameFr:'Wave',         bodyEn:'New job matching your profile: Senior Dev.', bodyFr:'Nouvel emploi pour vous : Développeur Senior.', time:'3h', read:true  },
  { id:5, type:'like',    avatar:'https://i.pravatar.cc/40?img=15', nameEn:'Emeka Okonkwo',nameFr:'Emeka Okonkwo',bodyEn:'liked your comment.',                     bodyFr:'a aimé votre commentaire.',               time:'5h',  read:true  },
  { id:6, type:'connect', avatar:'https://i.pravatar.cc/40?img=44', nameEn:'Nadia Benali', nameFr:'Nadia Benali', bodyEn:'accepted your connection request.',       bodyFr:'a accepté votre demande de connexion.',   time:'1d',  read:true  },
]

const typeIcon = {
  like:    { icon: faThumbsUp,  color: '#7C3D2B' },
  connect: { icon: faUserPlus,  color: '#2D6A4F' },
  comment: { icon: faComment,   color: '#C9822A' },
  job:     { icon: faBriefcase, color: '#7c3aed' },
}

export default function Notifications() {
  const { lang } = useLang()
  const unread = notifications.filter(n => !n.read)
  const read   = notifications.filter(n =>  n.read)

  return (
    <div className="notif-page">
      <div className="page-header">
        <div className="page-header__icon page-header__icon--primary">
          <FontAwesomeIcon icon={faBell} />
        </div>
        <div>
          <h1 className="page-header__title"
            data-en="Notifications" data-fr="Notifications">
            {txt('Notifications', 'Notifications', lang)}
          </h1>
          <p className="page-header__sub"
            data-en="Stay up to date" data-fr="Restez informé">
            {txt('Stay up to date', 'Restez informé', lang)}
          </p>
        </div>
      </div>

      {/* Unread */}
      {unread.length > 0 && (
        <>
          <h2 className="section-title">
            {txt('New', 'Nouveau', lang)}
            <span className="section-title__badge">{unread.length}</span>
          </h2>
          <div className="notif-list">
            {unread.map(n => (
              <NotifItem key={n.id} n={n} lang={lang} />
            ))}
          </div>
        </>
      )}

      {/* Read */}
      <h2 className="section-title" style={{ marginTop: 16 }}>
        {txt('Earlier', 'Précédentes', lang)}
      </h2>
      <div className="notif-list">
        {read.map(n => (
          <NotifItem key={n.id} n={n} lang={lang} />
        ))}
      </div>

      <div className="page-coming-soon">
        <span>📡</span>
        <p>{txt('Real-time notifications coming via API', 'Notifications temps réel bientôt via l\'API', lang)}</p>
      </div>
    </div>
  )
}

function NotifItem({ n, lang }) {
  const { icon, color } = typeIcon[n.type] || typeIcon.like
  return (
    <div className={`notif-item ${!n.read ? 'notif-item--unread' : ''}`}>
      <div className="notif-item__avatar-wrap">
        {n.avatar
          ? <img src={n.avatar} alt={n.nameEn} className="notif-item__avatar" />
          : <div className="notif-item__avatar-placeholder">{n.nameEn[0]}</div>
        }
        <div className="notif-item__type-icon" style={{ background: color }}>
          <FontAwesomeIcon icon={icon} />
        </div>
      </div>
      <div className="notif-item__body">
        <p className="notif-item__text">
          <strong>{txt(n.nameEn, n.nameFr, lang)}</strong>{' '}
          {txt(n.bodyEn, n.bodyFr, lang)}
        </p>
        <span className="notif-item__time">{n.time}</span>
      </div>
      {!n.read && <div className="notif-item__dot" />}
    </div>
  )
}