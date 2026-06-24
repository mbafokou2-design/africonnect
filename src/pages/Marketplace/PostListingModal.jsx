import { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark, faArrowLeft, faCamera,
  faSpinner, faCheck, faUpload, faFile
} from '@fortawesome/free-solid-svg-icons'
import { txt } from '../../utils/translate'
import { marketplaceCategories, listingTypes } from '../../data/marketplaceData'
import './PostListingModal.css'

export default function PostListingModal({ onClose, onPosted, lang }) {
  const isMobile = window.innerWidth <= 768
  const coverRef = useRef()

  const [step,   setStep]   = useState(1)
  const [saving, setSaving] = useState(false)
  const [form,   setForm]   = useState({
    titleEn: '', titleFr: '', descEn: '', descFr: '',
    category: 'agriculture', type: 'product',
    priceEn: '', priceFr: '', locationEn: '', locationFr: '',
    companyName: '', companyEmail: '', companyPhone: '',
    websiteUrl: '', cover: null,
  })

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const handleSubmit = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1400))
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/marketplace
    setSaving(false)
    onPosted()
  }

  const steps = [
    { labelEn:'Listing',  labelFr:'Annonce'   },
    { labelEn:'Details',  labelFr:'Détails'   },
    { labelEn:'Company',  labelFr:'Entreprise'},
  ]

  const StepBar = (
    <div className="plm-steps">
      {steps.map((s, i) => (
        <div key={i} className={`plm-step ${step > i+1 ? 'done' : ''} ${step === i+1 ? 'active' : ''}`}>
          <div className="plm-step__circle">
            {step > i+1 ? <FontAwesomeIcon icon={faCheck} /> : i+1}
          </div>
          <span>{txt(s.labelEn, s.labelFr, lang)}</span>
          {i < steps.length-1 && <div className="plm-step__line" />}
        </div>
      ))}
    </div>
  )

  const Body = (
    <div className="plm-body">
      {StepBar}

      {step === 1 && (
        <div className="plm-step-content">
          <h3>{txt('Listing basics', 'Infos de l\'annonce', lang)}</h3>

          {/* Cover */}
          <div className="plm-cover-picker"
            style={form.cover ? { backgroundImage:`url(${form.cover})` } : {}}
            onClick={() => coverRef.current.click()}>
            {!form.cover && (
              <div className="plm-cover-picker__placeholder">
                <FontAwesomeIcon icon={faCamera} />
                <span>{txt('Add cover image', 'Ajouter une image', lang)}</span>
              </div>
            )}
            {form.cover && (
              <div className="plm-cover-picker__overlay">
                <FontAwesomeIcon icon={faCamera} />
                {txt('Change', 'Changer', lang)}
              </div>
            )}
            <input ref={coverRef} type="file" accept="image/*"
              style={{ display:'none' }}
              onChange={e => { const f = e.target.files[0]; if(f) set('cover', URL.createObjectURL(f)) }} />
          </div>

          <div className="plm-field-row">
            <div className="plm-field">
              <label>{txt('Listing type', 'Type d\'annonce', lang)}</label>
              <select value={form.type} onChange={e => set('type', e.target.value)} className="plm-select">
                {listingTypes.filter(t => t.id !== 'all').map(t => (
                  <option key={t.id} value={t.id}>{txt(t.labelEn, t.labelFr, lang)}</option>
                ))}
              </select>
            </div>
            <div className="plm-field">
              <label>{txt('Category', 'Catégorie', lang)}</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="plm-select">
                {marketplaceCategories.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{txt(c.labelEn, c.labelFr, lang)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="plm-field">
            <label>{txt('Title (EN)', 'Titre (EN)', lang)} *</label>
            <input type="text" value={form.titleEn} onChange={e => set('titleEn', e.target.value)}
              placeholder="e.g. Premium Arabica Coffee Beans" className="plm-input" maxLength={100} />
          </div>
          <div className="plm-field">
            <label>{txt('Title (FR)', 'Titre (FR)', lang)}</label>
            <input type="text" value={form.titleFr} onChange={e => set('titleFr', e.target.value)}
              placeholder="ex. Grains de Café Arabica Premium" className="plm-input" maxLength={100} />
          </div>
          <div className="plm-field-row">
            <div className="plm-field">
              <label>{txt('Location (EN)', 'Lieu (EN)', lang)} *</label>
              <input type="text" value={form.locationEn} onChange={e => set('locationEn', e.target.value)}
                placeholder="e.g. Dakar, Senegal" className="plm-input" />
            </div>
            <div className="plm-field">
              <label>{txt('Location (FR)', 'Lieu (FR)', lang)}</label>
              <input type="text" value={form.locationFr} onChange={e => set('locationFr', e.target.value)}
                placeholder="ex. Dakar, Sénégal" className="plm-input" />
            </div>
          </div>

          <button className="plm-next-btn" onClick={() => setStep(2)}
            disabled={!form.titleEn.trim() || !form.locationEn.trim()}>
            {txt('Next', 'Suivant', lang)} →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="plm-step-content">
          <h3>{txt('Listing details', 'Détails de l\'annonce', lang)}</h3>

          <div className="plm-field">
            <label>{txt('Description (EN)', 'Description (EN)', lang)} *</label>
            <textarea rows={4} value={form.descEn} onChange={e => set('descEn', e.target.value)}
              placeholder="Describe your product or service in English..." className="plm-textarea" maxLength={1000} />
            <span className="plm-hint">{form.descEn.length}/1000</span>
          </div>
          <div className="plm-field">
            <label>{txt('Description (FR)', 'Description (FR)', lang)}</label>
            <textarea rows={4} value={form.descFr} onChange={e => set('descFr', e.target.value)}
              placeholder="Décrivez votre produit ou service en français..." className="plm-textarea" maxLength={1000} />
          </div>
          <div className="plm-field-row">
            <div className="plm-field">
              <label>{txt('Price / Budget (EN)', 'Prix / Budget (EN)', lang)}</label>
              <input type="text" value={form.priceEn} onChange={e => set('priceEn', e.target.value)}
                placeholder="e.g. 2,500 FCFA/kg" className="plm-input" />
            </div>
            <div className="plm-field">
              <label>{txt('Price / Budget (FR)', 'Prix / Budget (FR)', lang)}</label>
              <input type="text" value={form.priceFr} onChange={e => set('priceFr', e.target.value)}
                placeholder="ex. 2 500 FCFA/kg" className="plm-input" />
            </div>
          </div>

          <div className="plm-btn-row">
            <button className="plm-back-btn" onClick={() => setStep(1)}>
              ← {txt('Back', 'Retour', lang)}
            </button>
            <button className="plm-next-btn" onClick={() => setStep(3)}
              disabled={!form.descEn.trim()}>
              {txt('Next', 'Suivant', lang)} →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="plm-step-content">
          <h3>{txt('Company info', 'Infos de l\'entreprise', lang)}</h3>

          <div className="plm-field">
            <label>{txt('Company name', 'Nom de l\'entreprise', lang)} *</label>
            <input type="text" value={form.companyName} onChange={e => set('companyName', e.target.value)}
              placeholder="e.g. CamAgri Export SARL" className="plm-input" />
          </div>
          <div className="plm-field-row">
            <div className="plm-field">
              <label>Email *</label>
              <input type="email" value={form.companyEmail} onChange={e => set('companyEmail', e.target.value)}
                placeholder="contact@company.com" className="plm-input" />
            </div>
            <div className="plm-field">
              <label>{txt('Phone', 'Téléphone', lang)}</label>
              <input type="tel" value={form.companyPhone} onChange={e => set('companyPhone', e.target.value)}
                placeholder="+237 6XX XXX XXX" className="plm-input" />
            </div>
          </div>
          <div className="plm-field">
            <label>{txt('Website', 'Site web', lang)}</label>
            <input type="url" value={form.websiteUrl} onChange={e => set('websiteUrl', e.target.value)}
              placeholder="https://yourcompany.com" className="plm-input" />
          </div>

          {/* Summary */}
          <div className="plm-summary">
            <h4>{txt('Listing summary', 'Résumé de l\'annonce', lang)}</h4>
            <div className="plm-summary__row"><span>Type</span><strong>{form.type}</strong></div>
            <div className="plm-summary__row"><span>{txt('Title', 'Titre', lang)}</span><strong>{form.titleEn}</strong></div>
            <div className="plm-summary__row"><span>{txt('Location', 'Lieu', lang)}</span><strong>{form.locationEn}</strong></div>
          </div>

          <p className="plm-api-note">
            📡 {txt('Listing will be reviewed before going live.', 'L\'annonce sera examinée avant publication.', lang)}
          </p>

          <div className="plm-btn-row">
            <button className="plm-back-btn" onClick={() => setStep(2)}>
              ← {txt('Back', 'Retour', lang)}
            </button>
            <button className="plm-submit-btn" onClick={handleSubmit}
              disabled={saving || !form.companyName.trim() || !form.companyEmail.trim()}>
              {saving
                ? <FontAwesomeIcon icon={faSpinner} spin />
                : <>{txt('Submit listing', 'Soumettre l\'annonce', lang)} <FontAwesomeIcon icon={faCheck} /></>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <div className="plm-overlay">
        <div className="plm-mobile">
          <div className="plm-mobile__header">
            <button onClick={onClose}><FontAwesomeIcon icon={faArrowLeft} /></button>
            <h2>{txt('Post a Listing', 'Publier une annonce', lang)}</h2>
            <div style={{ width:36 }} />
          </div>
          {Body}
        </div>
      </div>
    )
  }

  return (
    <div className="plm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="plm-modal">
        <div className="plm-modal__header">
          <h2>{txt('Post a Listing', 'Publier une annonce', lang)}</h2>
          <button className="plm-modal__close" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        {Body}
      </div>
    </div>
  )
}