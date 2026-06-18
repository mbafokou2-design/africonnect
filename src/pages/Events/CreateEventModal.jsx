import { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark, faArrowLeft, faCamera,
  faSpinner, faCheck, faGlobe,
  faLock, faVideo, faLocationDot,
  faCalendarDays, faUsers
} from '@fortawesome/free-solid-svg-icons'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import { eventCategories } from '../../data/eventsData'
import './CreateEventModal.css'

export default function CreateEventModal({ onClose, onCreate, lang }) {
  const { addToast } = useToast()
  const isMobile = window.innerWidth <= 768
  const coverRef = useRef()

  const [step,   setStep]   = useState(1)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    titleEn:     '',
    titleFr:     '',
    dateStart:   '',
    dateEnd:     '',
    venueEn:     '',
    venueFr:     '',
    locationEn:  '',
    locationFr:  '',
    isOnline:    false,
    isPublic:    true,
    category:    'networking',
    descEn:      '',
    descFr:      '',
    cover:       null,
  })

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const handleCover = (e) => {
    const f = e.target.files[0]
    if (f) set('cover', URL.createObjectURL(f))
  }

  const handleCreate = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1200))
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/events
    const newEvent = {
      id: Date.now(),
      ...form,
      cover: form.cover || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
      interested: 1,
      going: 1,
      status: 'going',
      organizer: 'Jean Dupont',
      organizerAvatar: 'https://i.pravatar.cc/40?img=11',
      isLive: false,
      tags: [],
      lat: null, lng: null,
    }
    setSaving(false)
    onCreate(newEvent)
  }

  const steps = [
    { labelEn: 'Basic',       labelFr: 'Basique'      },
    { labelEn: 'Date & Place', labelFr: 'Date & Lieu'  },
    { labelEn: 'Description', labelFr: 'Description'  },
  ]

  const StepIndicator = (
    <div className="cem-steps">
      {steps.map((s, i) => (
        <div key={i} className={`cem-step ${step > i+1 ? 'done' : ''} ${step === i+1 ? 'active' : ''}`}>
          <div className="cem-step__circle">
            {step > i+1 ? <FontAwesomeIcon icon={faCheck} /> : i+1}
          </div>
          <span className="cem-step__label">{txt(s.labelEn, s.labelFr, lang)}</span>
          {i < steps.length-1 && <div className="cem-step__line" />}
        </div>
      ))}
    </div>
  )

  const Body = (
    <div className="cem-body">
      {StepIndicator}

      {/* Step 1: Basic */}
      {step === 1 && (
        <div className="cem-step-content">
          <h3>{txt('Event details', 'Détails de l\'événement', lang)}</h3>

          {/* Cover */}
          <div
            className="cem-cover-picker"
            style={form.cover ? { backgroundImage:`url(${form.cover})` } : {}}
            onClick={() => coverRef.current.click()}
          >
            {!form.cover && (
              <div className="cem-cover-picker__placeholder">
                <FontAwesomeIcon icon={faCamera} />
                <span>{txt('Add cover photo', 'Ajouter une photo', lang)}</span>
              </div>
            )}
            {form.cover && (
              <div className="cem-cover-picker__overlay">
                <FontAwesomeIcon icon={faCamera} />
                {txt('Change', 'Changer', lang)}
              </div>
            )}
            <input ref={coverRef} type="file" accept="image/*"
              style={{ display:'none' }} onChange={handleCover} />
          </div>

          <div className="cem-field">
            <label>{txt('Event name (English)', 'Nom de l\'événement (Anglais)', lang)} *</label>
            <input type="text" value={form.titleEn}
              onChange={e => set('titleEn', e.target.value)}
              placeholder="e.g. AfriConnect Summit 2026" maxLength={80} />
            <span className="cem-hint">{form.titleEn.length}/80</span>
          </div>

          <div className="cem-field">
            <label>{txt('Event name (French)', 'Nom de l\'événement (Français)', lang)} *</label>
            <input type="text" value={form.titleFr}
              onChange={e => set('titleFr', e.target.value)}
              placeholder="ex. Sommet AfriConnect 2026" maxLength={80} />
          </div>

          <div className="cem-field">
            <label>{txt('Category', 'Catégorie', lang)}</label>
            <select value={form.category} onChange={e => set('category', e.target.value)} className="cem-select">
              {eventCategories.filter(c => c.id !== 'all').map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {txt(cat.labelEn, cat.labelFr, lang)}
                </option>
              ))}
            </select>
          </div>

          {/* Privacy */}
          <div className="cem-field">
            <label>{txt('Privacy', 'Confidentialité', lang)}</label>
            <div className="cem-privacy-row">
              <button className={`cem-privacy-btn ${form.isPublic ? 'active' : ''}`}
                onClick={() => set('isPublic', true)}>
                <FontAwesomeIcon icon={faGlobe} />
                <div>
                  <p>{txt('Public', 'Public', lang)}</p>
                  <span>{txt('Anyone can see', 'Tout le monde voit', lang)}</span>
                </div>
              </button>
              <button className={`cem-privacy-btn ${!form.isPublic ? 'active' : ''}`}
                onClick={() => set('isPublic', false)}>
                <FontAwesomeIcon icon={faLock} />
                <div>
                  <p>{txt('Private', 'Privé', lang)}</p>
                  <span>{txt('Invite only', 'Sur invitation', lang)}</span>
                </div>
              </button>
            </div>
          </div>

          <button className="cem-next-btn" onClick={() => setStep(2)}
            disabled={!form.titleEn.trim()}>
            {txt('Next', 'Suivant', lang)} →
          </button>
        </div>
      )}

      {/* Step 2: Date & Place */}
      {step === 2 && (
        <div className="cem-step-content">
          <h3>{txt('Date & Location', 'Date & Lieu', lang)}</h3>

          <div className="cem-field-row">
            <div className="cem-field">
              <label>
                <FontAwesomeIcon icon={faCalendarDays} />
                {txt('Start', 'Début', lang)} *
              </label>
              <input type="datetime-local" value={form.dateStart}
                onChange={e => set('dateStart', e.target.value)} />
            </div>
            <div className="cem-field">
              <label>
                <FontAwesomeIcon icon={faCalendarDays} />
                {txt('End', 'Fin', lang)} *
              </label>
              <input type="datetime-local" value={form.dateEnd}
                onChange={e => set('dateEnd', e.target.value)} />
            </div>
          </div>

          {/* Online toggle */}
          <div className="cem-online-toggle">
            <button
              className={`cem-toggle-btn ${!form.isOnline ? 'active' : ''}`}
              onClick={() => set('isOnline', false)}
            >
              <FontAwesomeIcon icon={faLocationDot} />
              {txt('In person', 'En présentiel', lang)}
            </button>
            <button
              className={`cem-toggle-btn ${form.isOnline ? 'active' : ''}`}
              onClick={() => set('isOnline', true)}
            >
              <FontAwesomeIcon icon={faVideo} />
              {txt('Online', 'En ligne', lang)}
            </button>
          </div>

          {!form.isOnline && (
            <>
              <div className="cem-field">
                <label>
                  <FontAwesomeIcon icon={faLocationDot} />
                  {txt('Venue (English)', 'Lieu (Anglais)', lang)}
                </label>
                <input type="text" value={form.venueEn}
                  onChange={e => set('venueEn', e.target.value)}
                  placeholder="e.g. Hilton Hotel Yaoundé" />
              </div>
              <div className="cem-field">
                <label>
                  <FontAwesomeIcon icon={faLocationDot} />
                  {txt('Location (English)', 'Localisation (Anglais)', lang)} *
                </label>
                <input type="text" value={form.locationEn}
                  onChange={e => set('locationEn', e.target.value)}
                  placeholder="e.g. Yaoundé, Cameroon" />
              </div>
              <div className="cem-field">
                <label>{txt('Location (French)', 'Localisation (Français)', lang)}</label>
                <input type="text" value={form.locationFr}
                  onChange={e => set('locationFr', e.target.value)}
                  placeholder="ex. Yaoundé, Cameroun" />
              </div>
            </>
          )}

          {form.isOnline && (
            <div className="cem-field">
              <label>
                <FontAwesomeIcon icon={faVideo} />
                {txt('Online location', 'Lieu en ligne', lang)}
              </label>
              <input type="text" value={form.locationEn}
                onChange={e => { set('locationEn', e.target.value); set('locationFr', e.target.value) }}
                placeholder="e.g. Zoom, Google Meet, YouTube Live..." />
            </div>
          )}

          <div className="cem-btn-row">
            <button className="cem-back-btn" onClick={() => setStep(1)}>
              ← {txt('Back', 'Retour', lang)}
            </button>
            <button className="cem-next-btn" onClick={() => setStep(3)}
              disabled={!form.dateStart || !form.locationEn.trim()}>
              {txt('Next', 'Suivant', lang)} →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Description */}
      {step === 3 && (
        <div className="cem-step-content">
          <h3>{txt('Description', 'Description', lang)}</h3>

          <div className="cem-field">
            <label>{txt('Description (English)', 'Description (Anglais)', lang)} *</label>
            <textarea rows={5} value={form.descEn}
              onChange={e => set('descEn', e.target.value)}
              placeholder="Describe your event in English..."
              maxLength={1000} />
            <span className="cem-hint">{form.descEn.length}/1000</span>
          </div>
          <div className="cem-field">
            <label>{txt('Description (French)', 'Description (Français)', lang)}</label>
            <textarea rows={5} value={form.descFr}
              onChange={e => set('descFr', e.target.value)}
              placeholder="Décrivez votre événement en français..."
              maxLength={1000} />
            <span className="cem-hint">{form.descFr.length}/1000</span>
          </div>

          {/* Preview */}
          <div className="cem-preview">
            <h4>{txt('Preview', 'Aperçu', lang)}</h4>
            <div className="cem-preview-card">
              {form.cover && (
                <div className="cem-preview-cover"
                  style={{ backgroundImage:`url(${form.cover})` }} />
              )}
              <div className="cem-preview-body">
                <p className="cem-preview-title">
                  {form.titleEn || txt('Event name', 'Nom de l\'événement', lang)}
                </p>
                <p className="cem-preview-date">
                  {form.dateStart ? new Date(form.dateStart).toLocaleDateString() : '—'}
                </p>
                <p className="cem-preview-location">
                  <FontAwesomeIcon icon={form.isOnline ? faVideo : faLocationDot} />
                  {form.locationEn || '—'}
                </p>
              </div>
            </div>
          </div>

          <div className="cem-btn-row">
            <button className="cem-back-btn" onClick={() => setStep(2)}>
              ← {txt('Back', 'Retour', lang)}
            </button>
            <button className="cem-create-btn" onClick={handleCreate}
              disabled={saving || !form.descEn.trim()}>
              {saving
                ? <FontAwesomeIcon icon={faSpinner} spin />
                : <>{txt('Create Event', 'Créer l\'événement', lang)} <FontAwesomeIcon icon={faCheck} /></>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <div className="cem-overlay">
        <div className="cem-mobile">
          <div className="cem-mobile__header">
            <button onClick={onClose}><FontAwesomeIcon icon={faArrowLeft} /></button>
            <h2>{txt('Create Event', 'Créer un événement', lang)}</h2>
            <div style={{ width:36 }} />
          </div>
          {Body}
        </div>
      </div>
    )
  }

  return (
    <div className="cem-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="cem-modal">
        <div className="cem-modal__header">
          <h2>{txt('Create an Event', 'Créer un événement', lang)}</h2>
          <button className="cem-modal__close" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        {Body}
      </div>
    </div>
  )
}