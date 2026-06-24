import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark, faArrowLeft, faSpinner,
  faCheck, faEnvelope, faPhone,
  faBuilding, faLocationDot, faStar,
  faCheckCircle, faShieldHalved, faArrowRight
} from '@fortawesome/free-solid-svg-icons'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import './ContactModal.css'

export default function ContactModal({ item, onClose, lang }) {
  const { addToast } = useToast()
  const isMobile = window.innerWidth <= 768

  const [message,  setMessage]  = useState('')
  const [name,     setName]     = useState('Jean Dupont')
  const [email,    setEmail]    = useState('jean.dupont@email.com')
  const [phone,    setPhone]    = useState('')
  const [company,  setCompany]  = useState('')
  const [budget,   setBudget]   = useState('')
  const [saving,   setSaving]   = useState(false)
  const [sent,     setSent]     = useState(false)

  const handleSend = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1200))
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/marketplace/${item.id}/contact
    // Body: { name, email, phone, company, budget, message }
    setSaving(false)
    setSent(true)
    addToast(txt('Message sent!', 'Message envoyé !', lang), 'success')
    setTimeout(onClose, 2000)
  }

  if (sent) {
    return (
      <div className="cm-overlay">
        <div className="cm-modal cm-modal--success">
          <div className="cm-success">
            <div className="cm-success__icon"><FontAwesomeIcon icon={faCheck} /></div>
            <h2>{txt('Message Sent!', 'Message envoyé !', lang)}</h2>
            <p>{txt(`${item.company} will respond within ${item.responseTime || '24h'}.`, `${item.company} répondra dans ${item.responseTime || '24h'}.`, lang)}</p>
            <p className="cm-success__note">📡 {txt('Messaging via API when connected.', 'Messagerie via API bientôt.', lang)}</p>
          </div>
        </div>
      </div>
    )
  }

  const Body = (
    <div className="cm-body">

      {/* Listing summary */}
      <div className="cm-listing-summary">
        <img src={item.companyLogo} alt={item.company} />
        <div>
          <p className="cm-listing-summary__title">
            {txt(item.titleEn, item.titleFr, lang)}
          </p>
          <p className="cm-listing-summary__company">
            {item.company}
            {item.verified && (
              <FontAwesomeIcon icon={faCheckCircle} className="cm-listing-summary__verified" />
            )}
          </p>
          <p className="cm-listing-summary__price">
            {txt(item.priceEn, item.priceFr, lang)}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="cm-form">
        <div className="cm-field-row">
          <div className="cm-field">
            <label><FontAwesomeIcon icon={faBuilding} /> {txt('Your name', 'Votre nom', lang)}</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="cm-input" />
          </div>
          <div className="cm-field">
            <label><FontAwesomeIcon icon={faBuilding} /> {txt('Your company', 'Votre entreprise', lang)}</label>
            <input type="text" value={company} onChange={e => setCompany(e.target.value)}
              placeholder={txt('Company name', 'Nom de l\'entreprise', lang)} className="cm-input" />
          </div>
        </div>
        <div className="cm-field-row">
          <div className="cm-field">
            <label><FontAwesomeIcon icon={faEnvelope} /> Email *</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="cm-input" />
          </div>
          <div className="cm-field">
            <label><FontAwesomeIcon icon={faPhone} /> {txt('Phone', 'Téléphone', lang)}</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="+237 6XX XXX XXX" className="cm-input" />
          </div>
        </div>
        {(item.type === 'tender' || item.type === 'wholesale') && (
          <div className="cm-field">
            <label>{txt('Your budget / quantity', 'Votre budget / quantité', lang)}</label>
            <input type="text" value={budget} onChange={e => setBudget(e.target.value)}
              placeholder={item.type === 'tender'
                ? txt('Your bid amount', 'Votre offre', lang)
                : txt('Quantity needed', 'Quantité requise', lang)}
              className="cm-input" />
          </div>
        )}
        <div className="cm-field">
          <label>{txt('Message *', 'Message *', lang)}</label>
          <textarea
            rows={5}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={txt(
              item.type === 'tender'
                ? 'Describe your proposal, experience and why you are the best candidate...'
                : 'Describe your requirements, timeline, and any specific questions...',
              item.type === 'tender'
                ? 'Décrivez votre offre, votre expérience et pourquoi vous êtes le meilleur candidat...'
                : 'Décrivez vos besoins, délais et toute question spécifique...',
              lang
            )}
            className="cm-textarea"
            maxLength={1000}
          />
          <span className="cm-char-count">{message.length}/1000</span>
        </div>
      </div>

      <div className="cm-legal">
        <FontAwesomeIcon icon={faShieldHalved} />
        <p>{txt(
          'Your contact details are shared securely with the business only.',
          'Vos coordonnées sont partagées de manière sécurisée avec l\'entreprise uniquement.',
          lang
        )}</p>
      </div>

      <button
        className="cm-send-btn"
        onClick={handleSend}
        disabled={saving || !message.trim() || !email.trim()}
      >
        {saving
          ? <FontAwesomeIcon icon={faSpinner} spin />
          : <><FontAwesomeIcon icon={faEnvelope} /> {item.type === 'tender'
            ? txt('Submit proposal', 'Soumettre l\'offre', lang)
            : txt('Send message', 'Envoyer le message', lang)}</>
        }
      </button>

      {item.responseTime && (
        <p className="cm-response-time">
          ⚡ {txt(`Typical response: ${item.responseTime}`, `Réponse typique : ${item.responseTime}`, lang)}
        </p>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <div className="cm-overlay">
        <div className="cm-mobile">
          <div className="cm-mobile__header">
            <button onClick={onClose}><FontAwesomeIcon icon={faArrowLeft} /></button>
            <h2>{item.type === 'tender'
              ? txt('Submit Proposal', 'Soumettre une offre', lang)
              : txt('Contact Business', 'Contacter l\'entreprise', lang)}</h2>
            <div style={{ width:36 }} />
          </div>
          {Body}
        </div>
      </div>
    )
  }

  return (
    <div className="cm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="cm-modal">
        <div className="cm-modal__header">
          <h2>{item.type === 'tender'
            ? txt('Submit Proposal', 'Soumettre une offre', lang)
            : txt('Contact Business', 'Contacter l\'entreprise', lang)}</h2>
          <button className="cm-modal__close" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        {Body}
      </div>
    </div>
  )
}