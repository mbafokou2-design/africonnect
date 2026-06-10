import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'

export default function NotFound() {
  const { lang } = useLang()
  return (
    <div className="page-coming-soon" style={{ minHeight:400, flexDirection:'column', gap:16 }}>
      <span style={{ fontSize:64 }}>🌍</span>
      <h2 style={{ fontSize:24, fontWeight:800, color:'var(--color-navy)' }}>404</h2>
      <p>{txt('Page not found', 'Page introuvable', lang)}</p>
      <a href="/" style={{ color:'var(--color-primary)', fontWeight:600 }}>
        {txt('Back to Home', "Retour à l'accueil", lang)}
      </a>
    </div>
  )
}