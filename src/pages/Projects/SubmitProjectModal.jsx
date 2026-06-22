import { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark, faArrowLeft, faCamera,
  faSpinner, faCheck, faUpload,
  faFile, faPlus, faTrash
} from '@fortawesome/free-solid-svg-icons'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import { projectCategories, fundingStages, currencies } from '../../data/projectsData'
import './SubmitProjectModal.css'

export default function SubmitProjectModal({ onClose, onSubmitted, lang }) {
  const { addToast } = useToast()
  const isMobile  = window.innerWidth <= 768
  const coverRef  = useRef()
  const pitchRef  = useRef()

  const [step,   setStep]   = useState(1)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    nameEn:       '',
    nameFr:       '',
    taglineEn:    '',
    taglineFr:    '',
    category:     'agritech',
    stage:        'idea',
    locationEn:   '',
    locationFr:   '',
    websiteUrl:   '',
    descEn:       '',
    descFr:       '',
    goalAmount:   '',
    currency:     'FCFA',
    minInvestment:'',
    deadline:     '',
    returns:      '',
    cover:        null,
    pitchDeck:    null,
    pitchName:    '',
    teamMembers: [{ name:'', role:'' }],
  })

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const addTeamMember = () =>
    setForm(p => ({ ...p, teamMembers: [...p.teamMembers, { name:'', role:'' }] }))

  const removeTeamMember = (i) =>
    setForm(p => ({ ...p, teamMembers: p.teamMembers.filter((_, idx) => idx !== i) }))

  const updateTeamMember = (i, key, val) =>
    setForm(p => ({
      ...p,
      teamMembers: p.teamMembers.map((m, idx) => idx === i ? { ...m, [key]: val } : m)
    }))

  const handleCover = (e) => {
    const f = e.target.files[0]
    if (f) set('cover', URL.createObjectURL(f))
    // TODO: upload to ${import.meta.env.VITE_API_BASE_URL}/media/upload
  }

  const handlePitch = (e) => {
    const f = e.target.files[0]
    if (!f) return
    set('pitchDeck', f)
    set('pitchName', f.name)
    // TODO: upload to ${import.meta.env.VITE_API_BASE_URL}/media/upload
  }

  const handleSubmit = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1500))
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/projects
    setSaving(false)
    onSubmitted()
  }

  const steps = [
    { labelEn:'Project',  labelFr:'Projet'    },
    { labelEn:'Details',  labelFr:'Détails'   },
    { labelEn:'Funding',  labelFr:'Financement'},
    { labelEn:'Team',     labelFr:'Équipe'    },
  ]

  const StepIndicator = (
    <div className="spm-steps">
      {steps.map((s, i) => (
        <div key={i}
          className={`spm-step ${step > i+1 ? 'done':''} ${step === i+1 ? 'active':''}`}>
          <div className="spm-step__circle">
            {step > i+1 ? <FontAwesomeIcon icon={faCheck} /> : i+1}
          </div>
          <span>{txt(s.labelEn, s.labelFr, lang)}</span>
          {i < steps.length-1 && <div className="spm-step__line" />}
        </div>
      ))}
    </div>
  )

  const Body = (
    <div className="spm-body">
      {StepIndicator}

      {/* ── Step 1: Project basics ── */}
      {step === 1 && (
        <div className="spm-step-content">
          <h3>{txt('Project basics', 'Informations de base', lang)}</h3>

          {/* Cover */}
          <div
            className="spm-cover-picker"
            style={form.cover ? { backgroundImage:`url(${form.cover})` } : {}}
            onClick={() => coverRef.current.click()}
          >
            {!form.cover && (
              <div className="spm-cover-picker__placeholder">
                <FontAwesomeIcon icon={faCamera} />
                <span>{txt('Add project cover', 'Ajouter une couverture', lang)}</span>
              </div>
            )}
            {form.cover && (
              <div className="spm-cover-picker__overlay">
                <FontAwesomeIcon icon={faCamera} />
                {txt('Change', 'Changer', lang)}
              </div>
            )}
            <input ref={coverRef} type="file" accept="image/*"
              style={{ display:'none' }} onChange={handleCover} />
          </div>

          <div className="spm-field">
            <label>{txt('Project name (EN)', 'Nom du projet (EN)', lang)} *</label>
            <input type="text" value={form.nameEn}
              onChange={e => set('nameEn', e.target.value)}
              placeholder="e.g. AgriTech Solutions" maxLength={60} />
          </div>
          <div className="spm-field">
            <label>{txt('Project name (FR)', 'Nom du projet (FR)', lang)} *</label>
            <input type="text" value={form.nameFr}
              onChange={e => set('nameFr', e.target.value)}
              placeholder="ex. Solutions AgriTech" maxLength={60} />
          </div>
          <div className="spm-field">
            <label>{txt('Tagline (EN)', 'Accroche (EN)', lang)} *</label>
            <input type="text" value={form.taglineEn}
              onChange={e => set('taglineEn', e.target.value)}
              placeholder="One sentence describing your project" maxLength={120} />
          </div>
          <div className="spm-field">
            <label>{txt('Tagline (FR)', 'Accroche (FR)', lang)}</label>
            <input type="text" value={form.taglineFr}
              onChange={e => set('taglineFr', e.target.value)}
              placeholder="Une phrase décrivant votre projet" maxLength={120} />
          </div>
          <div className="spm-field-row">
            <div className="spm-field">
              <label>{txt('Category', 'Catégorie', lang)}</label>
              <select value={form.category}
                onChange={e => set('category', e.target.value)}
                className="spm-select">
                {projectCategories.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {txt(cat.labelEn, cat.labelFr, lang)}
                  </option>
                ))}
              </select>
            </div>
            <div className="spm-field">
              <label>{txt('Stage', 'Stade', lang)}</label>
              <select value={form.stage}
                onChange={e => set('stage', e.target.value)}
                className="spm-select">
                {fundingStages.filter(s => s.id !== 'all').map(s => (
                  <option key={s.id} value={s.id}>
                    {txt(s.labelEn, s.labelFr, lang)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="spm-field">
            <label>{txt('Location (EN)', 'Localisation (EN)', lang)} *</label>
            <input type="text" value={form.locationEn}
              onChange={e => set('locationEn', e.target.value)}
              placeholder="e.g. Dakar, Senegal" />
          </div>
          <div className="spm-field">
            <label>{txt('Website', 'Site web', lang)}</label>
            <input type="url" value={form.websiteUrl}
              onChange={e => set('websiteUrl', e.target.value)}
              placeholder="https://yourproject.com" />
          </div>

          <button className="spm-next-btn" onClick={() => setStep(2)}
            disabled={!form.nameEn.trim() || !form.taglineEn.trim() || !form.locationEn.trim()}>
            {txt('Next', 'Suivant', lang)} →
          </button>
        </div>
      )}

      {/* ── Step 2: Description + pitch ── */}
      {step === 2 && (
        <div className="spm-step-content">
          <h3>{txt('Project description', 'Description du projet', lang)}</h3>

          <div className="spm-field">
            <label>{txt('Description (EN)', 'Description (EN)', lang)} *</label>
            <textarea rows={5} value={form.descEn}
              onChange={e => set('descEn', e.target.value)}
              placeholder="Describe your project, the problem it solves, and your solution..."
              maxLength={2000} />
            <span className="spm-hint">{form.descEn.length}/2000</span>
          </div>
          <div className="spm-field">
            <label>{txt('Description (FR)', 'Description (FR)', lang)}</label>
            <textarea rows={5} value={form.descFr}
              onChange={e => set('descFr', e.target.value)}
              placeholder="Décrivez votre projet, le problème qu'il résout et votre solution..."
              maxLength={2000} />
          </div>

          {/* Pitch deck upload */}
          <div className="spm-field">
            <label>
              {txt('Pitch Deck', 'Pitch Deck', lang)}{' '}
              <span className="spm-optional">({txt('optional', 'optionnel', lang)})</span>
            </label>
            {form.pitchDeck ? (
              <div className="spm-file-uploaded">
                <FontAwesomeIcon icon={faFile} />
                <span>{form.pitchName}</span>
                <button onClick={() => { set('pitchDeck', null); set('pitchName', '') }}>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
            ) : (
              <div className="spm-upload-area" onClick={() => pitchRef.current.click()}>
                <FontAwesomeIcon icon={faUpload} />
                <p>{txt('Upload pitch deck', 'Téléverser le pitch deck', lang)}</p>
                <span>PDF, PPT · Max 20MB</span>
              </div>
            )}
            <input ref={pitchRef} type="file" accept=".pdf,.ppt,.pptx"
              style={{ display:'none' }} onChange={handlePitch} />
          </div>

          <div className="spm-btn-row">
            <button className="spm-back-btn" onClick={() => setStep(1)}>
              ← {txt('Back', 'Retour', lang)}
            </button>
            <button className="spm-next-btn" onClick={() => setStep(3)}
              disabled={!form.descEn.trim()}>
              {txt('Next', 'Suivant', lang)} →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Funding ── */}
      {step === 3 && (
        <div className="spm-step-content">
          <h3>{txt('Funding details', 'Détails du financement', lang)}</h3>

          <div className="spm-field-row">
            <div className="spm-field">
              <label>{txt('Funding goal', 'Objectif de financement', lang)} *</label>
              <input type="number" value={form.goalAmount}
                onChange={e => set('goalAmount', e.target.value)}
                placeholder="e.g. 50000000" />
            </div>
            <div className="spm-field">
              <label>{txt('Currency', 'Devise', lang)}</label>
              <select value={form.currency}
                onChange={e => set('currency', e.target.value)}
                className="spm-select">
                {currencies.map(c => (
                  <option key={c.id} value={c.label}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="spm-field-row">
            <div className="spm-field">
              <label>{txt('Min. investment', 'Invest. minimum', lang)} *</label>
              <input type="number" value={form.minInvestment}
                onChange={e => set('minInvestment', e.target.value)}
                placeholder="e.g. 25000" />
            </div>
            <div className="spm-field">
              <label>{txt('Campaign deadline', 'Date limite', lang)} *</label>
              <input type="date" value={form.deadline}
                onChange={e => set('deadline', e.target.value)} />
            </div>
          </div>

          <div className="spm-field">
            <label>{txt('Estimated annual returns', 'Retour annuel estimé', lang)}</label>
            <input type="text" value={form.returns}
              onChange={e => set('returns', e.target.value)}
              placeholder="e.g. 12–18%" />
          </div>

          <div className="spm-btn-row">
            <button className="spm-back-btn" onClick={() => setStep(2)}>
              ← {txt('Back', 'Retour', lang)}
            </button>
            <button className="spm-next-btn" onClick={() => setStep(4)}
              disabled={!form.goalAmount || !form.minInvestment || !form.deadline}>
              {txt('Next', 'Suivant', lang)} →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 4: Team ── */}
      {step === 4 && (
        <div className="spm-step-content">
          <h3>{txt('Team members', 'Membres de l\'équipe', lang)}</h3>
          <p className="spm-step-desc">
            {txt('Add your key team members.', 'Ajoutez vos membres clés.', lang)}
          </p>

          {form.teamMembers.map((member, i) => (
            <div key={i} className="spm-team-member">
              <div className="spm-team-member__fields">
                <input
                  type="text"
                  value={member.name}
                  onChange={e => updateTeamMember(i, 'name', e.target.value)}
                  placeholder={txt('Full name', 'Nom complet', lang)}
                  className="spm-input"
                />
                <input
                  type="text"
                  value={member.role}
                  onChange={e => updateTeamMember(i, 'role', e.target.value)}
                  placeholder={txt('Role (e.g. CEO)', 'Rôle (ex. CEO)', lang)}
                  className="spm-input"
                />
              </div>
              {form.teamMembers.length > 1 && (
                <button
                  className="spm-team-member__remove"
                  onClick={() => removeTeamMember(i)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>
          ))}

          <button className="spm-add-member-btn" onClick={addTeamMember}>
            <FontAwesomeIcon icon={faPlus} />
            {txt('Add team member', 'Ajouter un membre', lang)}
          </button>

          {/* Summary */}
          <div className="spm-summary">
            <h4>{txt('Project summary', 'Résumé du projet', lang)}</h4>
            <div className="spm-summary__row">
              <span>{txt('Name', 'Nom', lang)}</span>
              <strong>{form.nameEn}</strong>
            </div>
            <div className="spm-summary__row">
              <span>{txt('Category', 'Catégorie', lang)}</span>
              <strong>{form.category}</strong>
            </div>
            <div className="spm-summary__row">
              <span>{txt('Goal', 'Objectif', lang)}</span>
              <strong>{form.goalAmount} {form.currency}</strong>
            </div>
            <div className="spm-summary__row">
              <span>{txt('Min. investment', 'Invest. min', lang)}</span>
              <strong>{form.minInvestment} {form.currency}</strong>
            </div>
          </div>

          <p className="spm-api-note">
            📡 {txt(
              'Your project will be submitted for review before going live.',
              'Votre projet sera soumis pour examen avant publication.',
              lang
            )}
          </p>

          <div className="spm-btn-row">
            <button className="spm-back-btn" onClick={() => setStep(3)}>
              ← {txt('Back', 'Retour', lang)}
            </button>
            <button
              className="spm-submit-btn"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving
                ? <FontAwesomeIcon icon={faSpinner} spin />
                : <>{txt('Submit Project', 'Soumettre le projet', lang)} <FontAwesomeIcon icon={faCheck} /></>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <div className="spm-overlay">
        <div className="spm-mobile">
          <div className="spm-mobile__header">
            <button onClick={onClose}><FontAwesomeIcon icon={faArrowLeft} /></button>
            <h2>{txt('Submit a Project', 'Soumettre un projet', lang)}</h2>
            <div style={{ width:36 }} />
          </div>
          {Body}
        </div>
      </div>
    )
  }

  return (
    <div className="spm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="spm-modal">
        <div className="spm-modal__header">
          <h2>{txt('Submit a Project', 'Soumettre un projet', lang)}</h2>
          <button className="spm-modal__close" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        {Body}
      </div>
    </div>
  )
}