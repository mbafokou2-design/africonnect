import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'

export default function Groups() {
  const { lang } = useLang()
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div className="page-header">
        <div className="page-header__icon page-header__icon--purple">
          <FontAwesomeIcon icon={faUserGroup} />
        </div>
        <div>
          <h1 className="page-header__title">
            {txt('Groups', 'Groupes', lang)}
          </h1>
          <p className="page-header__sub">
            {txt('Work and grow together', 'Travaillez et grandissez ensemble', lang)}
          </p>
        </div>
      </div>
      <div className="page-coming-soon">
        <span>🚧</span>
        <p>{txt('Full groups page coming soon', 'Page groupes complète bientôt', lang)}</p>
      </div>
    </div>
  )
}