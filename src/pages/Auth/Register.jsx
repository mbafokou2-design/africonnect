import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEnvelope, faLock, faEye, faEyeSlash,
  faUser, faSpinner, faArrowRight,
  faCheck, faGlobe, faCamera,
  faXmark, faChevronDown
} from '@fortawesome/free-solid-svg-icons'
import { faGoogle, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import './Auth.css'

const regions = [
  { id:'west',    flag:'🌍', en:'West Africa',    fr:'Afrique de l\'Ouest', countries:['Senegal','Ghana','Nigeria','Côte d\'Ivoire','Mali','Burkina Faso','Benin','Togo','Guinea'] },
  { id:'central', flag:'🌍', en:'Central Africa', fr:'Afrique Centrale',   countries:['Cameroon','DR Congo','Congo','Gabon','Chad','CAR','Equatorial Guinea'] },
  { id:'east',    flag:'🌍', en:'East Africa',    fr:'Afrique de l\'Est',   countries:['Kenya','Ethiopia','Tanzania','Uganda','Rwanda','Somalia','Sudan'] },
  { id:'north',   flag:'🌍', en:'North Africa',   fr:'Afrique du Nord',     countries:['Egypt','Morocco','Algeria','Tunisia','Libya'] },
  { id:'south',   flag:'🌍', en:'Southern Africa',fr:'Afrique Australe',    countries:['South Africa','Zimbabwe','Mozambique','Angola','Zambia','Namibia'] },
  { id:'other',   flag:'🌐', en:'Rest of World',  fr:'Reste du monde',      countries:[] },
]

const skillOptions = ['Software Development','Design','Marketing','Finance','Agriculture','Healthcare','Education','Logistics','Entrepreneurship','Data Science','Legal','Engineering']

export default function Register() {
  const { lang }     = useLang()
  const { addToast } = useToast()

  const [step,    setStep]    = useState(1) // 1=credentials 2=profile 3=success
  const [showPw,  setShowPw]  = useState(false)
  const [loading, setLoading] = useState(false)
  const [avatar,  setAvatar]  = useState(null)

  const [form, setForm] = useState({
    fullName:   '',
    email:      '',
    password:   '',
    confirmPw:  '',
    region:     '',
    country:    '',
    bio:        '',
    skills:     [],
    participate: '',
  })

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const toggleSkill = (skill) => {
    setForm(p => ({
      ...p,
      skills: p.skills.includes(skill)
        ? p.skills.filter(s => s !== skill)
        : [...p.skills, skill]
    }))
  }

  const handleAvatarChange = e => {
    const f = e.target.files[0]
    if (f) setAvatar(URL.createObjectURL(f))
    // TODO: upload to ${import.meta.env.VITE_API_BASE_URL}/media/upload
  }

  const handleStep1 = async e => {
    e.preventDefault()
    if (!form.fullName || !form.email || !form.password) {
      addToast(txt('Please fill all required fields', 'Remplissez tous les champs requis', lang), 'error')
      return
    }
    if (form.password !== form.confirmPw) {
      addToast(txt('Passwords do not match', 'Les mots de passe ne correspondent pas', lang), 'error')
      return
    }
    if (!form.region) {
      addToast(txt('Please select your region', 'Veuillez sélectionner votre région', lang), 'error')
      return
    }
    setStep(2)
  }

  const handleStep2 = async e => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1300))
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/auth/register
    // Body: { ...form, avatarUrl, skills }
    setLoading(false)
    setStep(3)
  }

  const handleGoogle = () => {
    // TODO: window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`
    addToast(txt('Google sign-up coming soon', 'Inscription Google bientôt', lang), 'info')
  }

  const selectedRegion = regions.find(r => r.id === form.region)

  const participateOptions = [
    { id:'jobseeker',   en:'Find a job or freelance work', fr:'Trouver un emploi ou travail freelance'  },
    { id:'recruiter',   en:'Hire talent for my company',   fr:'Recruter des talents pour mon entreprise'},
    { id:'investor',    en:'Invest in African projects',   fr:'Investir dans des projets africains'     },
    { id:'founder',     en:'Get funding for my startup',   fr:'Obtenir du financement pour ma startup'  },
    { id:'network',     en:'Grow my professional network', fr:'Développer mon réseau professionnel'     },
    { id:'diaspora',    en:'Stay connected to Africa',     fr:'Rester connecté à l\'Afrique'            },
  ]

  return (
    <div className="auth-page">

      {/* Left visual */}
      <div className="auth-visual">
        <div className="auth-visual__overlay" />
        <div className="auth-visual__content">
          <div className="auth-visual__logo">
            <div className="auth-visual__logo-box">AC</div>
            <div>
              <p className="auth-visual__logo-name">AfriConnect</p>
              <p className="auth-visual__logo-tagline">
                {txt('Connect. Collaborate. Succeed.', 'Connecter. Collaborer. Réussir.', lang)}
              </p>
            </div>
          </div>
          <h1 className="auth-visual__title">
            {txt(
              'Join 200,000+ African professionals building the future together.',
              'Rejoignez 200 000+ professionnels africains qui construisent l\'avenir ensemble.',
              lang
            )}
          </h1>
          <div className="auth-visual__stats">
            {[
              { num:'200K+', en:'Members',   fr:'Membres' },
              { num:'50+',   en:'Countries', fr:'Pays'    },
              { num:'Free',  en:'Sign up',   fr:'Inscription' },
            ].map((s, i) => (
              <div key={i} className="auth-visual__stat">
                <span className="auth-visual__stat-num">{s.num}</span>
                <span className="auth-visual__stat-label">{txt(s.en, s.fr, lang)}</span>
              </div>
            ))}
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80"
          alt="bg"
          className="auth-visual__bg-img"
        />
        {/* REPLACE src above with your own background image */}
      </div>

      {/* Right form */}
      <div className="auth-form-panel">
        <div className="auth-form-wrap">

          {/* Mobile logo */}
          <div className="auth-mobile-logo">
            <div className="auth-mobile-logo__box">AC</div>
            <span>AfriConnect</span>
          </div>

          {/* Step indicator */}
          <div className="auth-steps">
            {['Account','Profile'].map((s, i) => (
              <div key={i} className={`auth-step ${step > i ? 'done' : ''} ${step === i+1 ? 'active' : ''}`}>
                <div className="auth-step__circle">
                  {step > i+1 ? <FontAwesomeIcon icon={faCheck} /> : i+1}
                </div>
                <span>{s}</span>
                {i < 1 && <div className="auth-step__line" />}
              </div>
            ))}
          </div>

          {/* ── STEP 1: Credentials + Region ── */}
          {step === 1 && (
            <>
              <h2 className="auth-form-title">
                {txt('Create your account', 'Créer votre compte', lang)}
              </h2>
              <p className="auth-form-sub">
                {txt('Already have an account?', 'Vous avez déjà un compte ?', lang)}{' '}
                <a href="/login" className="auth-link">
                  {txt('Log in', 'Se connecter', lang)}
                </a>
              </p>

              {/* Social */}
              <div className="auth-social">
                <button className="auth-social-btn auth-social-btn--google" onClick={handleGoogle}>
                  <FontAwesomeIcon icon={faGoogle} />
                  {txt('Sign up with Google', 'S\'inscrire avec Google', lang)}
                </button>
              </div>

              <div className="auth-divider">
                <span>{txt('or sign up with email', 'ou s\'inscrire par email', lang)}</span>
              </div>

              <form onSubmit={handleStep1} className="auth-fields">
                <div className="auth-field">
                  <label>{txt('Full name', 'Nom complet', lang)} *</label>
                  <div className="auth-field__input-wrap">
                    <FontAwesomeIcon icon={faUser} />
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={e => set('fullName', e.target.value)}
                      placeholder="Jean Dupont"
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <label>{txt('Email address', 'Adresse email', lang)} *</label>
                  <div className="auth-field__input-wrap">
                    <FontAwesomeIcon icon={faEnvelope} />
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      placeholder="you@email.com"
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <label>{txt('Password', 'Mot de passe', lang)} *</label>
                  <div className="auth-field__input-wrap">
                    <FontAwesomeIcon icon={faLock} />
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => set('password', e.target.value)}
                      placeholder="Min. 8 characters"
                    />
                    <button type="button" className="auth-field__eye" onClick={() => setShowPw(p => !p)}>
                      <FontAwesomeIcon icon={showPw ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>

                <div className="auth-field">
                  <label>{txt('Confirm password', 'Confirmer le mot de passe', lang)} *</label>
                  <div className="auth-field__input-wrap">
                    <FontAwesomeIcon icon={faLock} />
                    <input
                      type="password"
                      value={form.confirmPw}
                      onChange={e => set('confirmPw', e.target.value)}
                      placeholder="••••••••"
                    />
                    {form.confirmPw && form.password === form.confirmPw && (
                      <div className="auth-field__valid">
                        <FontAwesomeIcon icon={faCheck} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Region selection */}
                <div className="auth-field">
                  <label>
                    <FontAwesomeIcon icon={faGlobe} />
                    {txt('Your region', 'Votre région', lang)} *
                  </label>
                  <div className="auth-regions">
                    {regions.map(r => (
                      <button
                        key={r.id}
                        type="button"
                        className={`auth-region-btn ${form.region === r.id ? 'active' : ''}`}
                        onClick={() => set('region', r.id)}
                      >
                        <span>{r.flag}</span>
                        <span>{txt(r.en, r.fr, lang)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Country dropdown — shows if region has countries */}
                {selectedRegion && selectedRegion.countries.length > 0 && (
                  <div className="auth-field">
                    <label>{txt('Country', 'Pays', lang)}</label>
                    <div className="auth-field__input-wrap">
                      <FontAwesomeIcon icon={faChevronDown} />
                      <select
                        value={form.country}
                        onChange={e => set('country', e.target.value)}
                        className="auth-select"
                      >
                        <option value="">
                          {txt('Select your country', 'Sélectionnez votre pays', lang)}
                        </option>
                        {selectedRegion.countries.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <button type="submit" className="auth-submit">
                  {txt('Continue', 'Continuer', lang)} →
                </button>
              </form>
            </>
          )}

          {/* ── STEP 2: How you'll participate + Profile ── */}
          {step === 2 && (
            <>
              <h2 className="auth-form-title">
                {txt('Set up your profile', 'Configurez votre profil', lang)}
              </h2>

              <form onSubmit={handleStep2} className="auth-fields">

                {/* How will you participate */}
                <div className="auth-field">
                  <label>{txt('How will you use AfriConnect?', 'Comment utiliserez-vous AfriConnect ?', lang)}</label>
                  <div className="auth-participate-grid">
                    {participateOptions.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        className={`auth-participate-btn ${form.participate === p.id ? 'active' : ''}`}
                        onClick={() => set('participate', p.id)}
                      >
                        {form.participate === p.id && (
                          <div className="auth-participate-btn__check">
                            <FontAwesomeIcon icon={faCheck} />
                          </div>
                        )}
                        {txt(p.en, p.fr, lang)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Profile photo */}
                <div className="auth-field">
                  <label>{txt('Profile photo', 'Photo de profil', lang)}</label>
                  <div className="auth-avatar-upload">
                    {avatar ? (
                      <div className="auth-avatar-upload__preview">
                        <img src={avatar} alt="avatar" />
                        <button
                          type="button"
                          className="auth-avatar-upload__remove"
                          onClick={() => setAvatar(null)}
                        >
                          <FontAwesomeIcon icon={faXmark} />
                        </button>
                      </div>
                    ) : (
                      <label className="auth-avatar-upload__placeholder">
                        <FontAwesomeIcon icon={faCamera} />
                        <span>{txt('Upload photo', 'Téléverser une photo', lang)}</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display:'none' }}
                          onChange={handleAvatarChange}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="auth-field">
                  <label>Bio ({txt('optional', 'optionnel', lang)})</label>
                  <textarea
                    value={form.bio}
                    onChange={e => set('bio', e.target.value)}
                    rows={3}
                    placeholder={txt(
                      'Tell us about yourself, your work and your goals...',
                      'Parlez-nous de vous, de votre travail et de vos objectifs...',
                      lang
                    )}
                    className="auth-textarea"
                    maxLength={300}
                  />
                  <span className="auth-char-count">{form.bio.length}/300</span>
                </div>

                {/* Skills */}
                <div className="auth-field">
                  <label>{txt('Your skills', 'Vos compétences', lang)}</label>
                  <div className="auth-skills">
                    {skillOptions.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        className={`auth-skill-btn ${form.skills.includes(skill) ? 'active' : ''}`}
                        onClick={() => toggleSkill(skill)}
                      >
                        {form.skills.includes(skill) && <FontAwesomeIcon icon={faCheck} />}
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="auth-btn-row">
                  <button type="button" className="auth-back-btn" onClick={() => setStep(1)}>
                    ← {txt('Back', 'Retour', lang)}
                  </button>
                  <button type="submit" className="auth-submit" disabled={loading}>
                    {loading
                      ? <FontAwesomeIcon icon={faSpinner} spin />
                      : <>{txt('Create account', 'Créer le compte', lang)} <FontAwesomeIcon icon={faArrowRight} /></>
                    }
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ── STEP 3: Success ── */}
          {step === 3 && (
            <div className="auth-success">
              <div className="auth-success__icon">
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <h2>{txt('Welcome to AfriConnect! 🎉', 'Bienvenue sur AfriConnect ! 🎉', lang)}</h2>
              <p>
                {txt(
                  'Your account has been created successfully. You\'re now part of Africa\'s largest professional network.',
                  'Votre compte a été créé avec succès. Vous faites maintenant partie du plus grand réseau professionnel africain.',
                  lang
                )}
              </p>
              <a href="/" className="auth-submit" style={{ textDecoration:'none', textAlign:'center', display:'flex', justifyContent:'center', gap:8 }}>
                {txt('Go to my feed', 'Aller à mon fil', lang)}
                <FontAwesomeIcon icon={faArrowRight} />
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}