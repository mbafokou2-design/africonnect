import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEnvelope, faLock, faEye, faEyeSlash,
  faSpinner, faArrowRight
} from '@fortawesome/free-solid-svg-icons'
import { faGoogle, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import './Auth.css'

export default function Login() {
  const { lang }     = useLang()
  const { addToast } = useToast()

  const [form,    setForm]    = useState({ email:'', password:'' })
  const [showPw,  setShowPw]  = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleLogin = async e => {
    e.preventDefault()
    if (!form.email || !form.password) {
      addToast(txt('Please fill all fields', 'Remplissez tous les champs', lang), 'error')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/auth/login
    // Body: { email: form.email, password: form.password }
    // On success: localStorage.setItem('token', res.token), navigate('/')
    setLoading(false)
    addToast(txt('Login successful!', 'Connexion réussie !', lang), 'success')
    window.location.href = '/'
  }

  const handleGoogle = () => {
    // TODO: redirect to OAuth
    // window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`
    addToast(txt('Google login coming soon', 'Connexion Google bientôt disponible', lang), 'info')
  }

  const handleLinkedIn = () => {
    // TODO: window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/linkedin`
    addToast(txt('LinkedIn login coming soon', 'Connexion LinkedIn bientôt disponible', lang), 'info')
  }

  return (
    <div className="auth-page">

      {/* Left panel — visual */}
      <div className="auth-visual">
        <div className="auth-visual__overlay" />
        <div className="auth-visual__content">
          {/* Logo placeholder */}
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
              'Welcome back to the African professional network.',
              'Bienvenue sur le réseau professionnel africain.',
              lang
            )}
          </h1>
          <div className="auth-visual__stats">
            {[
              { num:'200K+', en:'Members',   fr:'Membres'  },
              { num:'50+',   en:'Countries', fr:'Pays'     },
              { num:'12K+',  en:'Jobs',      fr:'Emplois'  },
            ].map((s, i) => (
              <div key={i} className="auth-visual__stat">
                <span className="auth-visual__stat-num">{s.num}</span>
                <span className="auth-visual__stat-label">{txt(s.en, s.fr, lang)}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Background image placeholder */}
        <img
          src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80"
          alt="bg"
          className="auth-visual__bg-img"
        />
        {/* REPLACE src above with your own background image */}
      </div>

      {/* Right panel — form */}
      <div className="auth-form-panel">
        <div className="auth-form-wrap">

          {/* Mobile logo */}
          <div className="auth-mobile-logo">
            <div className="auth-mobile-logo__box">AC</div>
            <span>AfriConnect</span>
          </div>

          <h2 className="auth-form-title">
            {txt('Log in to your account', 'Connectez-vous à votre compte', lang)}
          </h2>
          <p className="auth-form-sub">
            {txt("Don't have an account?", 'Pas encore de compte ?', lang)}{' '}
            <a href="/register" className="auth-link">
              {txt('Sign up', 'S\'inscrire', lang)}
            </a>
          </p>

          {/* Social login */}
          <div className="auth-social">
            <button className="auth-social-btn auth-social-btn--google" onClick={handleGoogle}>
              <FontAwesomeIcon icon={faGoogle} />
              {txt('Continue with Google', 'Continuer avec Google', lang)}
            </button>
            <button className="auth-social-btn auth-social-btn--linkedin" onClick={handleLinkedIn}>
              <FontAwesomeIcon icon={faLinkedin} />
              {txt('Continue with LinkedIn', 'Continuer avec LinkedIn', lang)}
            </button>
          </div>

          <div className="auth-divider">
            <span>{txt('or log in with email', 'ou se connecter par email', lang)}</span>
          </div>

          <form onSubmit={handleLogin} className="auth-fields">
            <div className="auth-field">
              <label>{txt('Email address', 'Adresse email', lang)}</label>
              <div className="auth-field__input-wrap">
                <FontAwesomeIcon icon={faEnvelope} />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="you@email.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-field__label-row">
                <label>{txt('Password', 'Mot de passe', lang)}</label>
                <a href="/forgot-password" className="auth-link auth-link--small">
                  {txt('Forgot password?', 'Mot de passe oublié ?', lang)}
                </a>
              </div>
              <div className="auth-field__input-wrap">
                <FontAwesomeIcon icon={faLock} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-field__eye"
                  onClick={() => setShowPw(p => !p)}
                >
                  <FontAwesomeIcon icon={showPw ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading
                ? <FontAwesomeIcon icon={faSpinner} spin />
                : <>{txt('Log in', 'Se connecter', lang)} <FontAwesomeIcon icon={faArrowRight} /></>
              }
            </button>
          </form>

        </div>
      </div>

    </div>
  )
}