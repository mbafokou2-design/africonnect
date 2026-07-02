import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCheck, faCrown, faArrowLeft,
  faChevronDown, faChevronUp,
  faStar, faRocket, faBuilding,
  faShieldHalved, faMobileAlt,
  faCreditCard, faUniversity
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import { plans, faqItems } from '../../data/subscriptionData'
import './Subscription.css'

const planIcons = { free: faStar, pro: faCrown, business: faBuilding }

export default function Subscription() {
  const { lang }     = useLang()
  const { addToast } = useToast()
  const navigate     = useNavigate()

  const [billing,  setBilling]  = useState('monthly') // monthly | annual
  const [openFaq,  setOpenFaq]  = useState(null)
  const [selected, setSelected] = useState(null)
  const [paying,   setPaying]   = useState(false)
  const [method,   setMethod]   = useState(null)

  const annualSaving = Math.round((1 - (plans[1].priceAnnual / 12) / plans[1].priceMonthly) * 100)

  const handleUpgrade = (plan) => {
    if (plan.id === 'free') return
    setSelected(plan)
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/subscription/upgrade
  }

  const handlePay = async () => {
    if (!method) return
    setPaying(true)
    await new Promise(r => setTimeout(r, 1400))
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/payments/process
    setPaying(false)
    setSelected(null)
    addToast(
      txt('Subscription activated! Welcome to Pro 🎉', 'Abonnement activé ! Bienvenue en Pro 🎉', lang),
      'success'
    )
  }

  const methods = [
    { id:'mtn',  label:'MTN Mobile Money', icon: faMobileAlt  },
    { id:'wave', label:'Wave',             icon: faMobileAlt  },
    { id:'card', label:'Bank Card',        icon: faCreditCard  },
    { id:'bank', label:'Bank Transfer',    icon: faUniversity  },
  ]

  return (
    <div className="sub-page">

      {/* Back */}
      <button className="sub-back" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
        {txt('Back', 'Retour', lang)}
      </button>

      {/* Header */}
      <div className="sub-hero">
        <div className="sub-hero__crown">
          <FontAwesomeIcon icon={faCrown} />
        </div>
        <h1 className="sub-hero__title">
          {txt('Unlock the full AfriConnect experience', 'Débloquez l\'expérience AfriConnect complète', lang)}
        </h1>
        <p className="sub-hero__sub">
          {txt(
            'Connect, collaborate and grow faster with a Pro or Business plan.',
            'Connectez, collaborez et grandissez plus vite avec un plan Pro ou Business.',
            lang
          )}
        </p>

        {/* Billing toggle */}
        <div className="sub-billing-toggle">
          <button
            className={`sub-billing-btn ${billing === 'monthly' ? 'active' : ''}`}
            onClick={() => setBilling('monthly')}
          >
            {txt('Monthly', 'Mensuel', lang)}
          </button>
          <button
            className={`sub-billing-btn ${billing === 'annual' ? 'active' : ''}`}
            onClick={() => setBilling('annual')}
          >
            {txt('Annual', 'Annuel', lang)}
            <span className="sub-billing-badge">-{annualSaving}%</span>
          </button>
        </div>
      </div>

      {/* Plans grid */}
      <div className="sub-plans">
        {plans.map(plan => {
          const price = billing === 'annual' ? plan.priceAnnual : plan.priceMonthly
          const features = lang === 'fr' ? plan.featuresFr : plan.featuresEn
          const icon = planIcons[plan.id]
          return (
            <div
              key={plan.id}
              className={`sub-plan ${plan.popular ? 'sub-plan--popular' : ''}`}
            >
              {plan.popular && (
                <div className="sub-plan__popular-badge">
                  <FontAwesomeIcon icon={faCrown} />
                  {txt('Most popular', 'Le plus populaire', lang)}
                </div>
              )}

              <div className="sub-plan__header">
                <div
                  className="sub-plan__icon"
                  style={{ background:`${plan.color}20`, color: plan.color }}
                >
                  <FontAwesomeIcon icon={icon} />
                </div>
                <div>
                  <h2 className="sub-plan__name">{txt(plan.labelEn, plan.labelFr, lang)}</h2>
                  <div className="sub-plan__price">
                    {price === 0 ? (
                      <span className="sub-plan__price-num">
                        {txt('Free', 'Gratuit', lang)}
                      </span>
                    ) : (
                      <>
                        <span className="sub-plan__price-num">
                          {price.toLocaleString('fr-FR')}
                        </span>
                        <span className="sub-plan__price-currency">
                          {plan.currency}/{billing === 'annual'
                            ? txt('yr', 'an', lang)
                            : txt('mo', 'mois', lang)}
                        </span>
                      </>
                    )}
                  </div>
                  {billing === 'annual' && price > 0 && (
                    <p className="sub-plan__monthly-equiv">
                      ≈ {Math.round(price / 12).toLocaleString('fr-FR')} {plan.currency}/{txt('mo', 'mois', lang)}
                    </p>
                  )}
                </div>
              </div>

              <ul className="sub-plan__features">
                {features.map((f, i) => (
                  <li key={i} className="sub-plan__feature">
                    <div className="sub-plan__feature-check" style={{ color: plan.color }}>
                      <FontAwesomeIcon icon={faCheck} />
                    </div>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className="sub-plan__cta"
                style={plan.popular
                  ? { background: plan.color, color: 'white', border: 'none' }
                  : { borderColor: plan.color, color: plan.color }
                }
                onClick={() => handleUpgrade(plan)}
                disabled={plan.id === 'free'}
              >
                {plan.id === 'free'
                  ? txt('Current plan', 'Plan actuel', lang)
                  : txt(plan.cta.en, plan.cta.fr, lang)}
              </button>
            </div>
          )
        })}
      </div>

      {/* Payment modal */}
      {selected && (
        <div className="sub-pay-overlay" onClick={() => setSelected(null)}>
          <div className="sub-pay-modal" onClick={e => e.stopPropagation()}>
            <h2 className="sub-pay-modal__title">
              <FontAwesomeIcon icon={faCrown} style={{ color: selected.color }} />
              {txt('Complete your upgrade', 'Finaliser votre mise à niveau', lang)}
            </h2>
            <p className="sub-pay-modal__plan">
              {txt(selected.labelEn, selected.labelFr, lang)} ·{' '}
              {billing === 'annual'
                ? `${selected.priceAnnual.toLocaleString('fr-FR')} ${selected.currency}/${txt('yr', 'an', lang)}`
                : `${selected.priceMonthly.toLocaleString('fr-FR')} ${selected.currency}/${txt('mo', 'mois', lang)}`}
            </p>

            <p className="sub-pay-modal__label">
              {txt('Choose payment method', 'Choisissez le mode de paiement', lang)}
            </p>

            <div className="sub-pay-modal__methods">
              {methods.map(m => (
                <button
                  key={m.id}
                  className={`sub-pay-method ${method === m.id ? 'active' : ''}`}
                  onClick={() => setMethod(m.id)}
                >
                  <FontAwesomeIcon icon={m.icon} />
                  <span>{m.label}</span>
                  {method === m.id && (
                    <FontAwesomeIcon icon={faCheck} className="sub-pay-method__check" />
                  )}
                </button>
              ))}
            </div>

            <p className="sub-pay-modal__note">
              📡 {txt('Payment processed securely via API', 'Paiement traité via API', lang)}
            </p>

            <div className="sub-pay-modal__actions">
              <button className="sub-pay-modal__cancel" onClick={() => setSelected(null)}>
                {txt('Cancel', 'Annuler', lang)}
              </button>
              <button
                className="sub-pay-modal__pay"
                style={{ background: selected.color }}
                onClick={handlePay}
                disabled={paying || !method}
              >
                {paying ? '...' : txt('Pay now', 'Payer maintenant', lang)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trust badges */}
      <div className="sub-trust">
        <div className="sub-trust__item">
          <FontAwesomeIcon icon={faShieldHalved} />
          {txt('Secure payment', 'Paiement sécurisé', lang)}
        </div>
        <div className="sub-trust__item">
          <FontAwesomeIcon icon={faCheck} />
          {txt('Cancel anytime', 'Annuler à tout moment', lang)}
        </div>
        <div className="sub-trust__item">
          <FontAwesomeIcon icon={faStar} />
          {txt('14-day free trial', 'Essai gratuit 14 jours', lang)}
        </div>
      </div>

      {/* FAQ */}
      <div className="sub-faq">
        <h2 className="sub-faq__title">
          {txt('Frequently asked questions', 'Questions fréquentes', lang)}
        </h2>
        {faqItems.map((item, i) => (
          <div key={i} className="sub-faq__item">
            <button
              className="sub-faq__q"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <span>{lang === 'fr' ? item.qFr : item.qEn}</span>
              <FontAwesomeIcon icon={openFaq === i ? faChevronUp : faChevronDown} />
            </button>
            {openFaq === i && (
              <p className="sub-faq__a">{lang === 'fr' ? item.aFr : item.aEn}</p>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}