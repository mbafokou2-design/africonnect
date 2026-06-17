import { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  faXmark,
  faArrowLeft,
  faUpload,
  faFile,
  faLink,
  faSpinner,
  faCheck,
  faUser,
  faEnvelope,
  faPhone
} from '@fortawesome/free-solid-svg-icons'

import {
  faLinkedin,
  faGithub
} from '@fortawesome/free-brands-svg-icons'

import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import './ApplyModal.css'

export default function ApplyModal({ job, onClose, lang }) {
  const { addToast } = useToast()
  const isMobile = window.innerWidth <= 768
  const cvRef    = useRef()

  const [step,     setStep]     = useState(1)  // 1=personal 2=cv+links 3=questions 4=confirm
  const [saving,   setSaving]   = useState(false)
  const [applied,  setApplied]  = useState(false)

  const [form, setForm] = useState({
    firstName:  'Jean',
    lastName:   'Dupont',
    email:      'jean.dupont@email.com',
    phone:      '',
    cvFile:     null,
    cvName:     '',
    linkedin:   '',
    github:     '',
    portfolio:  '',
    coverLetter:'',
    question1:  '',
  })

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }))

  const handleCV = (e) => {
    const f = e.target.files[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) {
      addToast(txt('File too large (max 5MB)', 'Fichier trop volumineux (max 5Mo)', lang), 'error')
      return
    }
    set('cvFile', f)
    set('cvName', f.name)
    // TODO: upload to ${import.meta.env.VITE_API_BASE_URL}/media/cv
  }

  const handleSubmit = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1500))
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/jobs/${job.id}/apply
    // Body: { firstName, lastName, email, phone, cvUrl, linkedin, github, portfolio, coverLetter }
    setSaving(false)
    setApplied(true)
    addToast(
      txt('Application submitted successfully!', 'Candidature soumise avec succès !', lang),
      'success'
    )
    setTimeout(onClose, 2000)
  }

  const steps = [
    { labelEn: 'Personal',  labelFr: 'Personnel'   },
    { labelEn: 'CV & Links', labelFr: 'CV & Liens'  },
    { labelEn: 'Cover',     labelFr: 'Lettre'       },
    { labelEn: 'Confirm',   labelFr: 'Confirmer'    },
  ]

  const StepIndicator = (
    <div className="apply-steps">
      {steps.map((s, i) => (
        <div key={i} className={`apply-step ${step > i ? 'done' : ''} ${step === i+1 ? 'active' : ''}`}>
          <div className="apply-step__circle">
            {step > i+1 ? <FontAwesomeIcon icon={faCheck} /> : i+1}
          </div>
          <span className="apply-step__label">
            {txt(s.labelEn, s.labelFr, lang)}
          </span>
          {i < steps.length-1 && <div className="apply-step__line" />}
        </div>
      ))}
    </div>
  )

  // Success state
  if (applied) {
    return (
      <div className="apply-overlay">
        <div className="apply-modal apply-modal--success">
          <div className="apply-success">
            <div className="apply-success__icon">
              <FontAwesomeIcon icon={faCheck} />
            </div>
            <h2>{txt('Application Submitted!', 'Candidature soumise !', lang)}</h2>
            <p>
              {txt(
                `Your application for ${job.titleEn} at ${job.company} has been submitted successfully.`,
                `Votre candidature pour ${job.titleFr} chez ${job.company} a été soumise avec succès.`,
                lang
              )}
            </p>
            <p className="apply-success__note">
              📡 {txt('You will be notified when the employer responds.', 'Vous serez notifié quand l\'employeur répond.', lang)}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const Body = (
    <div className="apply-body">
      {/* Job info */}
      <div className="apply-job-info">
        <img src={job.companyLogo} alt={job.company} />
        <div>
          <p className="apply-job-info__title">
            {txt(job.titleEn, job.titleFr, lang)}
          </p>
          <p className="apply-job-info__company">{job.company} · {txt(job.locationEn, job.locationFr, lang)}</p>
        </div>
      </div>

      {StepIndicator}

      {/* ── Step 1: Personal info ── */}
      {step === 1 && (
        <div className="apply-step-content">
          <h3>{txt('Personal Information', 'Informations personnelles', lang)}</h3>
          <div className="apply-field-row">
            <div className="apply-field">
              <label>
                <FontAwesomeIcon icon={faUser} />
                {txt('First Name', 'Prénom', lang)}
              </label>
              <input type="text" value={form.firstName}
                onChange={e => set('firstName', e.target.value)} />
            </div>
            <div className="apply-field">
              <label>
                <FontAwesomeIcon icon={faUser} />
                {txt('Last Name', 'Nom', lang)}
              </label>
              <input type="text" value={form.lastName}
                onChange={e => set('lastName', e.target.value)} />
            </div>
          </div>
          <div className="apply-field">
            <label>
              <FontAwesomeIcon icon={faEnvelope} />
              {txt('Email address', 'Adresse email', lang)}
            </label>
            <input type="email" value={form.email}
              onChange={e => set('email', e.target.value)} />
          </div>
          <div className="apply-field">
            <label>
              <FontAwesomeIcon icon={faPhone} />
              {txt('Phone number', 'Numéro de téléphone', lang)}
            </label>
            <input type="tel" value={form.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder="+237 6XX XXX XXX" />
          </div>
          <button className="apply-next-btn" onClick={() => setStep(2)}
            disabled={!form.firstName || !form.email}>
            {txt('Next', 'Suivant', lang)} →
          </button>
        </div>
      )}

      {/* ── Step 2: CV + Links ── */}
      {step === 2 && (
        <div className="apply-step-content">
          <h3>{txt('CV & Links', 'CV & Liens', lang)}</h3>

          {/* CV Upload */}
          <div className="apply-field">
            <label>
              <FontAwesomeIcon icon={faFile} />
              {txt('Upload your CV', 'Téléverser votre CV', lang)}
              <span className="apply-field__required">*</span>
            </label>
            {form.cvFile ? (
              <div className="apply-cv-uploaded">
                <FontAwesomeIcon icon={faFile} />
                <span>{form.cvName}</span>
                <button onClick={() => { set('cvFile', null); set('cvName', '') }}>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
            ) : (
              <div className="apply-cv-drop" onClick={() => cvRef.current.click()}>
                <FontAwesomeIcon icon={faUpload} />
                <p>{txt('Click to upload CV', 'Cliquez pour téléverser votre CV', lang)}</p>
                <span>{txt('PDF, DOC, DOCX · Max 5MB', 'PDF, DOC, DOCX · Max 5Mo', lang)}</span>
              </div>
            )}
            <input ref={cvRef} type="file"
              accept=".pdf,.doc,.docx" style={{ display:'none' }}
              onChange={handleCV} />
          </div>

          {/* Social links */}
<div className="apply-field">
  <label>
    <FontAwesomeIcon icon={faLinkedin} style={{ color: '#0077b5' }} />
    LinkedIn URL {txt('(optional)', '(optionnel)', lang)}
  </label>
  <input
    type="url"
    value={form.linkedin}
    onChange={e => set('linkedin', e.target.value)}
    placeholder="https://linkedin.com/in/yourname"
  />
</div>

<div className="apply-field">
  <label>
    <FontAwesomeIcon icon={faGithub} />
    GitHub URL {txt('(optional)', '(optionnel)', lang)}
  </label>
  <input
    type="url"
    value={form.github}
    onChange={e => set('github', e.target.value)}
    placeholder="https://github.com/yourname"
  />
</div>

<div className="apply-field">
  <label>
    <FontAwesomeIcon icon={faLink} />
    {txt('Portfolio / Website', 'Portfolio / Site web', lang)} {txt('(optional)', '(optionnel)', lang)}
  </label>
  <input
    type="url"
    value={form.portfolio}
    onChange={e => set('portfolio', e.target.value)}
    placeholder="https://yourportfolio.com"
  />
</div>

          <div className="apply-btn-row">
            <button className="apply-back-btn" onClick={() => setStep(1)}>
              ← {txt('Back', 'Retour', lang)}
            </button>
            <button className="apply-next-btn" onClick={() => setStep(3)}
              disabled={!form.cvFile}>
              {txt('Next', 'Suivant', lang)} →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Cover letter ── */}
      {step === 3 && (
        <div className="apply-step-content">
          <h3>{txt('Cover Letter', 'Lettre de motivation', lang)}</h3>
          <div className="apply-field">
            <label>
              {txt('Why do you want this job?', 'Pourquoi voulez-vous ce poste ?', lang)}
            </label>
            <textarea
              rows={7}
              value={form.coverLetter}
              onChange={e => set('coverLetter', e.target.value)}
              placeholder={txt(
                'Tell the employer why you are the best candidate...',
                'Expliquez à l\'employeur pourquoi vous êtes le meilleur candidat...',
                lang
              )}
              maxLength={1500}
            />
            <span className="apply-char-count">
              {form.coverLetter.length}/1500
            </span>
          </div>
          <div className="apply-btn-row">
            <button className="apply-back-btn" onClick={() => setStep(2)}>
              ← {txt('Back', 'Retour', lang)}
            </button>
            <button className="apply-next-btn" onClick={() => setStep(4)}>
              {txt('Next', 'Suivant', lang)} →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 4: Confirm ── */}
      {step === 4 && (
        <div className="apply-step-content">
          <h3>{txt('Review & Submit', 'Vérifier & Soumettre', lang)}</h3>
          <div className="apply-review">
            <div className="apply-review__row">
              <span>{txt('Name', 'Nom', lang)}</span>
              <strong>{form.firstName} {form.lastName}</strong>
            </div>
            <div className="apply-review__row">
              <span>Email</span>
              <strong>{form.email}</strong>
            </div>
            {form.phone && (
              <div className="apply-review__row">
                <span>{txt('Phone', 'Téléphone', lang)}</span>
                <strong>{form.phone}</strong>
              </div>
            )}
            <div className="apply-review__row">
              <span>CV</span>
              <strong className="apply-review__file">
                <FontAwesomeIcon icon={faFile} />
                {form.cvName}
              </strong>
            </div>
            {form.linkedin && (
              <div className="apply-review__row">
                <span>LinkedIn</span>
                <strong>{form.linkedin}</strong>
              </div>
            )}
            {form.github && (
              <div className="apply-review__row">
                <span>GitHub</span>
                <strong>{form.github}</strong>
              </div>
            )}
            {form.portfolio && (
              <div className="apply-review__row">
                <span>{txt('Portfolio', 'Portfolio', lang)}</span>
                <strong>{form.portfolio}</strong>
              </div>
            )}
            {form.coverLetter && (
              <div className="apply-review__row apply-review__row--col">
                <span>{txt('Cover Letter', 'Lettre de motivation', lang)}</span>
                <p className="apply-review__cover">
                  {form.coverLetter.slice(0, 120)}
                  {form.coverLetter.length > 120 ? '...' : ''}
                </p>
              </div>
            )}
          </div>
          <p className="apply-review__note">
            📡 {txt(
              'Your application will be sent to the employer via our API when connected.',
              'Votre candidature sera envoyée à l\'employeur via notre API une fois connecté.',
              lang
            )}
          </p>
          <div className="apply-btn-row">
            <button className="apply-back-btn" onClick={() => setStep(3)}>
              ← {txt('Back', 'Retour', lang)}
            </button>
            <button
              className="apply-submit-btn"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving
                ? <FontAwesomeIcon icon={faSpinner} spin />
                : <>
                    <FontAwesomeIcon icon={faCheck} />
                    {txt('Submit Application', 'Soumettre ma candidature', lang)}
                  </>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <div className="apply-overlay">
        <div className="apply-mobile">
          <div className="apply-mobile__header">
            <button onClick={onClose}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <h2>{txt('Apply', 'Postuler', lang)}</h2>
            <div style={{ width:36 }} />
          </div>
          {Body}
        </div>
      </div>
    )
  }

  return (
    <div className="apply-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="apply-modal">
        <div className="apply-modal__header">
          <h2>{txt('Apply for this job', 'Postuler à cet emploi', lang)}</h2>
          <button className="apply-modal__close" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        {Body}
      </div>
    </div>
  )
}