import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBriefcase } from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import { featuredJobs } from '../../data/rightPanelData'

export default function Jobs() {
  const { lang } = useLang()
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div className="page-header">
        <div className="page-header__icon page-header__icon--primary">
          <FontAwesomeIcon icon={faBriefcase} />
        </div>
        <div>
          <h1 className="page-header__title">
            {txt('Job Opportunities', "Opportunités d'emploi", lang)}
          </h1>
          <p className="page-header__sub">
            {txt('Find your next role in Africa', 'Trouvez votre prochain poste en Afrique', lang)}
          </p>
        </div>
      </div>
      <div className="page-coming-soon">
        <span>🚧</span>
        <p>{txt('Full jobs page coming soon', 'Page emplois complète bientôt', lang)}</p>
      </div>
    </div>
  )
}