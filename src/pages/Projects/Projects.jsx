import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyBillTrendUp } from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'

export default function Projects() {
  const { lang } = useLang()
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div className="page-header">
        <div className="page-header__icon page-header__icon--green">
          <FontAwesomeIcon icon={faMoneyBillTrendUp} />
        </div>
        <div>
          <h1 className="page-header__title">
            {txt('Projects & Funding', 'Projets & Financement', lang)}
          </h1>
          <p className="page-header__sub">
            {txt('Back the next African innovation', "Soutenez la prochaine innovation africaine", lang)}
          </p>
        </div>
      </div>
      <div className="page-coming-soon">
        <span>🚧</span>
        <p>{txt('Full projects page coming soon', 'Page projets complète bientôt', lang)}</p>
      </div>
    </div>
  )
}