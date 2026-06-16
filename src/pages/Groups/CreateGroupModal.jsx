import { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark, faArrowLeft, faCamera,
  faGlobe, faLock, faSpinner, faUsers
} from '@fortawesome/free-solid-svg-icons'
import { txt } from '../../utils/translate'
import { categories } from '../../data/groupsData'
import './createGroupModal.css'

export default function CreateGroupModal({ onClose, onCreate, lang }) {
  const isMobile = window.innerWidth <= 768
  const coverRef = useRef()

  const [step,    setStep]    = useState(1) // 1=basic 2=details 3=confirm
  const [saving,  setSaving]  = useState(false)
  const [data,    setData]    = useState({
    nameEn: '', nameFr: '',
    descEn: '', descFr: '',
    category: 'tech',
    isPublic: true,
    cover: null,
  })

  const set = (key, val) => setData(p => ({ ...p, [key]: val }))

  const handleCover = (e) => {
    const f = e.target.files[0]
    if (f) set('cover', URL.createObjectURL(f))
    // TODO: upload to ${import.meta.env.VITE_API_BASE_URL}/media/upload
  }

  const handleCreate = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1200))
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/groups
    onCreate({
      id: Date.now(),
      ...data,
      members: 1,
      membersLabel: '1',
      isAdmin: true,
      unread: 0,
      lastActivity: 'now',
      lastActivityFr: 'maintenant',
      avatar: 'https://i.pravatar.cc/56?img=11',
    })
    setSaving(false)
  }

  const canNext1 = data.nameEn.trim().length > 2 || data.nameFr.trim().length > 2
  const canNext2 = data.descEn.trim().length > 10 || data.descFr.trim().length > 10

  const catLabel = categories.find(c => c.id === data.category)

  const StepIndicator = (
    <div className="cgm-steps">
      {[1,2,3].map(s => (
        <div key={s} className={`cgm-step ${step >= s ? 'active' : ''} ${step > s ? 'done' : ''}`}>
          <div className="cgm-step__circle">{s}</div>
          {s < 3 && <div className="cgm-step__line" />}
        </div>
      ))}
    </div>
  )

  const Body = (
    <div className="cgm-body">
      {StepIndicator}

      {/* Step 1 — Name + Cover */}
      {step === 1 && (
        <div className="cgm-step-content">
          <h3 className="cgm-step-title">
            {txt('Group name & cover', 'Nom & couverture du groupe', lang)}
          </h3>

          {/* Cover picker */}
          <div
            className="cgm-cover-picker"
            style={data.cover ? { backgroundImage:`url(${data.cover})` } : {}}
            onClick={() => coverRef.current.click()}
          >
            {!data.cover && (
              <div className="cgm-cover-picker__placeholder">
                <FontAwesomeIcon icon={faCamera} />
                <span>{txt('Add cover photo', 'Ajouter une photo de couverture', lang)}</span>
              </div>
            )}
            {data.cover && (
              <div className="cgm-cover-picker__overlay">
                <FontAwesomeIcon icon={faCamera} />
                {txt('Change', 'Changer', lang)}
              </div>
            )}
            <input ref={coverRef} type="file" accept="image/*"
              style={{ display:'none' }} onChange={handleCover} />
          </div>

          <div className="cgm-field">
            <label>{txt('Group name (English)', 'Nom du groupe (Anglais)', lang)}</label>
            <input
              type="text"
              value={data.nameEn}
              onChange={e => set('nameEn', e.target.value)}
              placeholder="e.g. Africa Tech Builders"
              maxLength={60}
            />
            <span className="cgm-hint">{data.nameEn.length}/60</span>
          </div>

          <div className="cgm-field">
            <label>{txt('Group name (French)', 'Nom du groupe (Français)', lang)}</label>
            <input
              type="text"
              value={data.nameFr}
              onChange={e => set('nameFr', e.target.value)}
              placeholder="ex. Bâtisseurs Tech Afrique"
              maxLength={60}
            />
            <span className="cgm-hint">{data.nameFr.length}/60</span>
          </div>

          <button
            className="cgm-next-btn"
            onClick={() => setStep(2)}
            disabled={!canNext1}
          >
            {txt('Next', 'Suivant', lang)} →
          </button>
        </div>
      )}

      {/* Step 2 — Description + Category + Privacy */}
      {step === 2 && (
        <div className="cgm-step-content">
          <h3 className="cgm-step-title">
            {txt('About your group', 'À propos de votre groupe', lang)}
          </h3>

          <div className="cgm-field">
            <label>{txt('Description (English)', 'Description (Anglais)', lang)}</label>
            <textarea
              rows={3}
              value={data.descEn}
              onChange={e => set('descEn', e.target.value)}
              placeholder="Describe your group in English..."
              maxLength={300}
            />
            <span className="cgm-hint">{data.descEn.length}/300</span>
          </div>

          <div className="cgm-field">
            <label>{txt('Description (French)', 'Description (Français)', lang)}</label>
            <textarea
              rows={3}
              value={data.descFr}
              onChange={e => set('descFr', e.target.value)}
              placeholder="Décrivez votre groupe en français..."
              maxLength={300}
            />
            <span className="cgm-hint">{data.descFr.length}/300</span>
          </div>

          {/* Category */}
          <div className="cgm-field">
            <label>{txt('Category', 'Catégorie', lang)}</label>
            <select
              value={data.category}
              onChange={e => set('category', e.target.value)}
              className="cgm-select"
            >
              {categories.filter(c => c.id !== 'all').map(cat => (
                <option key={cat.id} value={cat.id}>
                  {txt(cat.labelEn, cat.labelFr, lang)}
                </option>
              ))}
            </select>
          </div>

          {/* Privacy */}
          <div className="cgm-field">
            <label>{txt('Privacy', 'Confidentialité', lang)}</label>
            <div className="cgm-privacy-row">
              <button
                className={`cgm-privacy-btn ${data.isPublic ? 'active' : ''}`}
                onClick={() => set('isPublic', true)}
              >
                <FontAwesomeIcon icon={faGlobe} />
                <div>
                  <p>{txt('Public', 'Public', lang)}</p>
                  <span>{txt('Anyone can join', 'Tout le monde peut rejoindre', lang)}</span>
                </div>
              </button>
              <button
                className={`cgm-privacy-btn ${!data.isPublic ? 'active' : ''}`}
                onClick={() => set('isPublic', false)}
              >
                <FontAwesomeIcon icon={faLock} />
                <div>
                  <p>{txt('Private', 'Privé', lang)}</p>
                  <span>{txt('Admin approval required', 'Approbation admin requise', lang)}</span>
                </div>
              </button>
            </div>
          </div>

          <div className="cgm-btn-row">
            <button className="cgm-back-btn" onClick={() => setStep(1)}>
              ← {txt('Back', 'Retour', lang)}
            </button>
            <button
              className="cgm-next-btn"
              onClick={() => setStep(3)}
              disabled={!canNext2}
            >
              {txt('Next', 'Suivant', lang)} →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Preview + Confirm */}
      {step === 3 && (
        <div className="cgm-step-content">
          <h3 className="cgm-step-title">
            {txt('Review & Create', 'Vérifier & Créer', lang)}
          </h3>

          {/* Preview card */}
          <div className="cgm-preview-card">
            <div
              className="cgm-preview-cover"
              style={data.cover
                ? { backgroundImage:`url(${data.cover})` }
                : {}}
            />
            <div className="cgm-preview-body">
              <div className="cgm-preview-info">
                <p className="cgm-preview-name">
                  {lang === 'fr'
                    ? (data.nameFr || data.nameEn)
                    : (data.nameEn || data.nameFr)}
                </p>
                <p className="cgm-preview-desc">
                  {lang === 'fr'
                    ? (data.descFr || data.descEn)
                    : (data.descEn || data.descFr)}
                </p>
                <div className="cgm-preview-meta">
                  <FontAwesomeIcon icon={data.isPublic ? faGlobe : faLock} />
                  <span>
                    {data.isPublic
                      ? txt('Public', 'Public', lang)
                      : txt('Private', 'Privé', lang)}
                  </span>
                  <span>·</span>
                  <FontAwesomeIcon icon={faUsers} />
                  <span>1 {txt('member', 'membre', lang)}</span>
                  <span>·</span>
                  <span>
                    {catLabel ? txt(catLabel.labelEn, catLabel.labelFr, lang) : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="cgm-btn-row">
            <button className="cgm-back-btn" onClick={() => setStep(2)}>
              ← {txt('Back', 'Retour', lang)}
            </button>
            <button
              className="cgm-create-btn"
              onClick={handleCreate}
              disabled={saving}
            >
              {saving
                ? <FontAwesomeIcon icon={faSpinner} spin />
                : txt('Create Group', 'Créer le groupe', lang)}
            </button>
          </div>
        </div>
      )}
    </div>
  )

  /* ── Mobile — full page ── */
  if (isMobile) {
    return (
      <div className="cgm-mobile">
        <div className="cgm-mobile__header">
          <button className="cgm-mobile__back" onClick={onClose}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h2>{txt('Create Group', 'Créer un groupe', lang)}</h2>
          <div style={{ width:36 }} />
        </div>
        {Body}
      </div>
    )
  }

  /* ── Desktop — modal ── */
  return (
    <div className="cgm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="cgm-modal">
        <div className="cgm-modal__header">
          <h2>{txt('Create a Group', 'Créer un groupe', lang)}</h2>
          <button className="cgm-modal__close" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        {Body}
      </div>
    </div>
  )
}