import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark, faArrowLeft, faSpinner,
  faCheck, faMessage, faPaperclip,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import './InquiryModal.css'

export default function InquiryModal({ listing, onClose, lang }) {
  const { addToast } = useToast()
  const isMobile = window.innerWidth <= 768

  const [saving,   setSaving]   = useState(false)
  const [done,     setDone]     = useState(false)
  const [form,     setForm]     = useState({
    name:     'Jean Dupont',
    email:    'jean@email.com',
    company:  '',
    phone:    '',
    quantity: '',
    message:  '',
  })

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSend = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1200))
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/marketplace/${listing.id}/inquire
    // Body: { name, email, company, phone, quantity, message }
    setSaving(false)
    setDone(true)
    addToast(txt('Inquiry sent!', 'Demande envoyée !', lang), 'success')
    setTimeout(onClose, 2000)
  }

  if (done) {
    return (
      <div className="iq-overlay">
        <div className="iq-modal iq-modal--success">
          <div className="iq-success">
            <div className="iq-success__icon"><FontAwesomeIcon icon={faCheck} /></div>
            <h2>{txt('Inquiry Sent!', 'Demande envoyée !', lang)}</h2>
            <p>{txt(`Your inquiry to ${listing.company} has been sent. They will contact you soon.`, `Votre demande à ${listing.company} a été envoyée. Ils vous contacteront bientôt.`, lang)}</p>
            <p className="iq-success__note">📡 {txt('Messages delivered via API', 'Messages livrés via API', lang)}</p>
          </div>
        </div>
      </div>
    )
  }

  const Body = (
    <div className="iq-body">
      {/* Listing info */}
      <div className="iq-listing-info">
        <img src={listing.companyLogo} alt={listing.company} />
        <div>
          <p className="iq-listing-info__title">{txt(listing.titleEn, listing.titleFr, lang)}</p>
          <p className="iq-listing-info__company">{listing.company} · {txt(listing.locationEn, listing.locationFr, lang)}</p>
        </div>
      </div>

      <div className="iq-fields">
        {/* Name + company */}
        <div className="iq-field-row">
          <div className="iq-field">
            <label>{txt('Your name', 'Votre nom', lang)} *</label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="iq-field">
            <label>{txt('Your company', 'Votre entreprise', lang)}</label>
            <input type="text" value={form.company} onChange={e => set('company', e.target.value)} placeholder={txt('Optional', 'Optionnel', lang)} />
          </div>
        </div>

        {/* Email + phone */}
        <div className="iq-field-row">
          <div className="iq-field">
            <label>Email *</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div className="iq-field">
            <label>{txt('Phone', 'Téléphone', lang)}</label>
            <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+237 6XX XXX XXX" />
          </div>
        </div>

        {/* Quantity */}
        <div className="iq-field">
          <label>{txt('Quantity / Volume needed', 'Quantité / Volume souhaité', lang)}</label>
          <input type="text" value={form.quantity} onChange={e => set('quantity', e.target.value)}
            placeholder={txt(`Min. order: ${listing.minOrder}`, `Commande min. : ${listing.minOrderFr}`, lang)} />
        </div>

        {/* Message */}
        <div className="iq-field">
          <label>{txt('Your message', 'Votre message', lang)} *</label>
          <textarea
            rows={5}
            value={form.message}
            onChange={e => set('message', e.target.value)}
            placeholder={txt(
              'Describe your requirements, delivery timeline, and any questions...',
              'Décrivez vos besoins, délai de livraison et vos questions...',
              lang
            )}
            maxLength={1000}
          />
          <span className="iq-char">{form.message.length}/1000</span>
        </div>

        <div className="iq-legal">
          <FontAwesomeIcon icon={faShieldHalved} />
          <p>{txt('Your contact details will only be shared with this company.', 'Vos coordonnées ne seront partagées qu\'avec cette entreprise.', lang)}</p>
        </div>

        <button
          className="iq-send-btn"
          onClick={handleSend}
          disabled={saving || !form.name.trim() || !form.email.trim() || !form.message.trim()}
        >
          {saving
            ? <FontAwesomeIcon icon={faSpinner} spin />
            : <><FontAwesomeIcon icon={faMessage} /> {txt('Send inquiry', 'Envoyer la demande', lang)}</>
          }
        </button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <div className="iq-overlay">
        <div className="iq-mobile">
          <div className="iq-mobile__header">
            <button onClick={onClose}><FontAwesomeIcon icon={faArrowLeft} /></button>
            <h2>{txt('Send Inquiry', 'Envoyer une demande', lang)}</h2>
            <div style={{ width:36 }} />
          </div>
          {Body}
        </div>
      </div>
    )
  }

  return (
    <div className="iq-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="iq-modal">
        <div className="iq-modal__header">
          <h2>{txt('Send Inquiry', 'Envoyer une demande', lang)}</h2>
          <button className="iq-modal__close" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        {Body}
      </div>
    </div>
  )
}