import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark, faArrowLeft, faSpinner,
  faCheck, faBuilding, faBriefcase,
  faLocationDot, faMoneyBill
} from '@fortawesome/free-solid-svg-icons'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import { jobCategories, jobTypes } from '../../data/jobsData'
import './PostJobModal.css'

export default function PostJobModal({ onClose, lang }) {
  const { addToast } = useToast()
  const isMobile = window.innerWidth <= 768

  const [step,   setStep]   = useState(1)
  const [saving, setSaving] = useState(false)
  const [posted, setPosted] = useState(false)

  const [form, setForm] = useState({
    titleEn: '', titleFr: '',
    company: '', companyWebsite: '',
    locationEn: '', locationFr: '',
    type: 'fulltime',
    category: 'tech',
    salaryEn: '', salaryFr: '',
    descEn: '', descFr: '',
    requirementsEn: '',
    requirementsFr: '',
    benefitsEn: '',
    benefitsFr: '',
    applyEmail: '',
    applyLink: '',
  })

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const handlePost = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1400))
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/jobs
    setSaving(false)
    setPosted(true)
    addToast(txt('Job posted successfully!', 'Emploi publié avec succès !', lang), 'success')
    setTimeout(onClose, 2000)
  }

  const steps = [
    { labelEn: 'Position',    labelFr: 'Poste'        },
    { labelEn: 'Details',     labelFr: 'Détails'      },
    { labelEn: 'Description', labelFr: 'Description'  },
    { labelEn: 'Apply',       labelFr: 'Candidature'  },
  ]

  const StepIndicator = (
    <div className="pjm-steps">
      {steps.map((s, i) => (
        <div key={i} className={`pjm-step ${step > i+1 ? 'done' : ''} ${step === i+1 ? 'active' : ''}`}>
          <div className="pjm-step__circle">
            {step > i+1 ? <FontAwesomeIcon icon={faCheck} /> : i+1}
          </div>
          <span>{txt(s.labelEn, s.labelFr, lang)}</span>
          {i < steps.length-1 && <div className="pjm-step__line" />}
        </div>
      ))}
    </div>
  )

  if (posted) {
    return (
      <div className="pjm-overlay">
        <div className="pjm-modal pjm-modal--success">
          <div className="pjm-success">
            <div className="pjm-success__icon"><FontAwesomeIcon icon={faCheck} /></div>
            <h2>{txt('Job Posted!', 'Emploi publié !', lang)}</h2>
            <p>{txt('Your job offer is now live on AfriConnect.', 'Votre offre est maintenant en ligne sur AfriConnect.', lang)}</p>
            <p className="pjm-success__note">
              📡 {txt('Job listings will be managed via API.', 'Les offres seront gérées via l\'API.', lang)}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const Body = (
    <div className="pjm-body">
      {StepIndicator}

      {/* Step 1: Position */}
      {step === 1 && (
        <div className="pjm-step-content">
          <h3>{txt('Job Position', 'Poste à pourvoir', lang)}</h3>
          <div className="pjm-field">
            <label>
              <FontAwesomeIcon icon={faBriefcase} />
              {txt('Job Title (English)', 'Intitulé du poste (Anglais)', lang)} *
            </label>
            <input type="text" value={form.titleEn}
              onChange={e => set('titleEn', e.target.value)}
              placeholder="e.g. Senior Software Engineer" />
          </div>
          <div className="pjm-field">
            <label>
              <FontAwesomeIcon icon={faBriefcase} />
              {txt('Job Title (French)', 'Intitulé du poste (Français)', lang)} *
            </label>
            <input type="text" value={form.titleFr}
              onChange={e => set('titleFr', e.target.value)}
              placeholder="ex. Ingénieur Logiciel Senior" />
          </div>
          <div className="pjm-field">
            <label>
              <FontAwesomeIcon icon={faBuilding} />
              {txt('Company name', 'Nom de l\'entreprise', lang)} *
            </label>
            <input type="text" value={form.company}
              onChange={e => set('company', e.target.value)}
              placeholder="e.g. Wave, Orange, Jumia..." />
          </div>
          <div className="pjm-field">
            <label>{txt('Company website', 'Site web de l\'entreprise', lang)}</label>
            <input type="url" value={form.companyWebsite}
              onChange={e => set('companyWebsite', e.target.value)}
              placeholder="https://yourcompany.com" />
          </div>
          <div className="pjm-field-row">
            <div className="pjm-field">
              <label>{txt('Category', 'Catégorie', lang)}</label>
              <select value={form.category}
                onChange={e => set('category', e.target.value)}
                className="pjm-select">
                {jobCategories.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {txt(cat.labelEn, cat.labelFr, lang)}
                  </option>
                ))}
              </select>
            </div>
            <div className="pjm-field">
              <label>{txt('Job type', 'Type de contrat', lang)}</label>
              <select value={form.type}
                onChange={e => set('type', e.target.value)}
                className="pjm-select">
                {jobTypes.filter(t => t.id !== 'all').map(type => (
                  <option key={type.id} value={type.id}>
                    {txt(type.labelEn, type.labelFr, lang)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button className="pjm-next-btn" onClick={() => setStep(2)}
            disabled={!form.titleEn || !form.company}>
            {txt('Next', 'Suivant', lang)} →
          </button>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="pjm-step-content">
          <h3>{txt('Job Details', 'Détails du poste', lang)}</h3>
          <div className="pjm-field">
            <label>
              <FontAwesomeIcon icon={faLocationDot} />
              {txt('Location (English)', 'Lieu (Anglais)', lang)} *
            </label>
            <input type="text" value={form.locationEn}
              onChange={e => set('locationEn', e.target.value)}
              placeholder="e.g. Dakar, Senegal / Remote" />
          </div>
          <div className="pjm-field">
            <label>
              <FontAwesomeIcon icon={faLocationDot} />
              {txt('Location (French)', 'Lieu (Français)', lang)} *
            </label>
            <input type="text" value={form.locationFr}
              onChange={e => set('locationFr', e.target.value)}
              placeholder="ex. Dakar, Sénégal / Télétravail" />
          </div>
          <div className="pjm-field">
            <label>
              <FontAwesomeIcon icon={faMoneyBill} />
              {txt('Salary range (English)', 'Fourchette salariale (Anglais)', lang)}
            </label>
            <input type="text" value={form.salaryEn}
              onChange={e => set('salaryEn', e.target.value)}
              placeholder="e.g. 500K – 800K FCFA/month" />
          </div>
          <div className="pjm-field">
            <label>
              <FontAwesomeIcon icon={faMoneyBill} />
              {txt('Salary range (French)', 'Fourchette salariale (Français)', lang)}
            </label>
            <input type="text" value={form.salaryFr}
              onChange={e => set('salaryFr', e.target.value)}
              placeholder="ex. 500K – 800K FCFA/mois" />
          </div>
          <div className="pjm-btn-row">
            <button className="pjm-back-btn" onClick={() => setStep(1)}>
              ← {txt('Back', 'Retour', lang)}
            </button>
            <button className="pjm-next-btn" onClick={() => setStep(3)}
              disabled={!form.locationEn}>
              {txt('Next', 'Suivant', lang)} →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Description */}
      {step === 3 && (
        <div className="pjm-step-content">
          <h3>{txt('Job Description', 'Description du poste', lang)}</h3>
          <div className="pjm-field">
            <label>{txt('Description (English)', 'Description (Anglais)', lang)} *</label>
            <textarea rows={4} value={form.descEn}
              onChange={e => set('descEn', e.target.value)}
              placeholder="Describe the role in English..." maxLength={1000} />
            <span className="pjm-hint">{form.descEn.length}/1000</span>
          </div>
          <div className="pjm-field">
            <label>{txt('Description (French)', 'Description (Français)', lang)} *</label>
            <textarea rows={4} value={form.descFr}
              onChange={e => set('descFr', e.target.value)}
              placeholder="Décrivez le poste en français..." maxLength={1000} />
            <span className="pjm-hint">{form.descFr.length}/1000</span>
          </div>
          <div className="pjm-field">
            <label>{txt('Requirements (EN, one per line)', 'Exigences (EN, une par ligne)', lang)}</label>
            <textarea rows={3} value={form.requirementsEn}
              onChange={e => set('requirementsEn', e.target.value)}
              placeholder="3+ years experience&#10;React or Vue&#10;English fluent" />
          </div>
          <div className="pjm-field">
            <label>{txt('Benefits (EN, one per line)', 'Avantages (EN, une par ligne)', lang)}</label>
            <textarea rows={3} value={form.benefitsEn}
              onChange={e => set('benefitsEn', e.target.value)}
              placeholder="Health insurance&#10;Remote work&#10;Annual bonus" />
          </div>
          <div className="pjm-btn-row">
            <button className="pjm-back-btn" onClick={() => setStep(2)}>
              ← {txt('Back', 'Retour', lang)}
            </button>
            <button className="pjm-next-btn" onClick={() => setStep(4)}
              disabled={!form.descEn}>
              {txt('Next', 'Suivant', lang)} →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Apply method */}
      {step === 4 && (
        <div className="pjm-step-content">
          <h3>{txt('How to Apply', 'Comment postuler', lang)}</h3>
          <div className="pjm-field">
            <label>{txt('Application email', 'Email de candidature', lang)} *</label>
            <input type="email" value={form.applyEmail}
              onChange={e => set('applyEmail', e.target.value)}
              placeholder="hr@yourcompany.com" />
          </div>
          <div className="pjm-field">
            <label>{txt('External apply link', 'Lien externe de candidature', lang)} {txt('(optional)', '(optionnel)', lang)}</label>
            <input type="url" value={form.applyLink}
              onChange={e => set('applyLink', e.target.value)}
              placeholder="https://careers.yourcompany.com/job/123" />
          </div>

          {/* Summary */}
          <div className="pjm-summary">
            <h4>{txt('Job Summary', 'Résumé de l\'offre', lang)}</h4>
            <div className="pjm-summary__row">
              <span>{txt('Position', 'Poste', lang)}</span>
              <strong>{form.titleEn}</strong>
            </div>
            <div className="pjm-summary__row">
              <span>{txt('Company', 'Entreprise', lang)}</span>
              <strong>{form.company}</strong>
            </div>
            <div className="pjm-summary__row">
              <span>{txt('Location', 'Lieu', lang)}</span>
              <strong>{form.locationEn}</strong>
            </div>
            <div className="pjm-summary__row">
              <span>{txt('Type', 'Type', lang)}</span>
              <strong>{form.type}</strong>
            </div>
          </div>

          <p className="pjm-api-note">
            📡 {txt(
              'Job will be posted via API when backend is connected.',
              'L\'offre sera publiée via l\'API quand le backend sera connecté.',
              lang
            )}
          </p>

          <div className="pjm-btn-row">
            <button className="pjm-back-btn" onClick={() => setStep(3)}>
              ← {txt('Back', 'Retour', lang)}
            </button>
            <button className="pjm-post-btn" onClick={handlePost}
              disabled={saving || !form.applyEmail}>
              {saving
                ? <FontAwesomeIcon icon={faSpinner} spin />
                : <>{txt('Post Job', 'Publier l\'offre', lang)} <FontAwesomeIcon icon={faCheck} /></>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <div className="pjm-overlay">
        <div className="pjm-mobile">
          <div className="pjm-mobile__header">
            <button onClick={onClose}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <h2>{txt('Post a Job', 'Publier un emploi', lang)}</h2>
            <div style={{ width:36 }} />
          </div>
          {Body}
        </div>
      </div>
    )
  }

  return (
    <div className="pjm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="pjm-modal">
        <div className="pjm-modal__header">
          <h2>{txt('Post a Job', 'Publier un emploi', lang)}</h2>
          <button className="pjm-modal__close" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        {Body}
      </div>
    </div>
  )
}