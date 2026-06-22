import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark, faArrowLeft, faSpinner,
  faCheck, faArrowRight, faMobileAlt,
  faCreditCard, faBuilding, faWallet,
  faShieldHalved, faArrowTrendUp
} from '@fortawesome/free-solid-svg-icons'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import './InvestModal.css'

function formatAmount(amount, currency) {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M ${currency}`
  if (amount >= 1000)    return `${(amount / 1000).toFixed(0)}K ${currency}`
  return `${amount} ${currency}`
}

const paymentMethods = [
  { id: 'mobile',  iconEn: 'Mobile Money',  iconFr: 'Mobile Money',  icon: faMobileAlt,  desc: 'MTN, Orange, Wave' },
  { id: 'card',    iconEn: 'Bank Card',      iconFr: 'Carte bancaire', icon: faCreditCard, desc: 'Visa, Mastercard'  },
  { id: 'bank',    iconEn: 'Bank Transfer',  iconFr: 'Virement',       icon: faBuilding,   desc: 'SWIFT, SEPA'       },
  { id: 'wallet',  iconEn: 'AfriWallet',     iconFr: 'AfriWallet',     icon: faWallet,     desc: 'Platform wallet'   },
]

export default function InvestModal({ project, onClose, lang }) {
  const { addToast } = useToast()
  const isMobile = window.innerWidth <= 768

  const [step,    setStep]    = useState(1) // 1=amount 2=payment 3=confirm 4=success
  const [amount,  setAmount]  = useState(project.minInvestment)
  const [method,  setMethod]  = useState(null)
  const [phone,   setPhone]   = useState('')
  const [saving,  setSaving]  = useState(false)

  const presets = [
    project.minInvestment,
    project.minInvestment * 2,
    project.minInvestment * 5,
    project.minInvestment * 10,
  ]

  const handleInvest = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1500))
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/projects/${project.id}/invest
    // Body: { amount, currency: project.currency, method, phone }
    setSaving(false)
    setStep(4)
    addToast(
      txt('Investment submitted!', 'Investissement soumis !', lang),
      'success'
    )
  }

  const steps = [
    { labelEn: 'Amount',  labelFr: 'Montant'   },
    { labelEn: 'Payment', labelFr: 'Paiement'  },
    { labelEn: 'Confirm', labelFr: 'Confirmer' },
  ]

  const StepIndicator = step < 4 && (
    <div className="im-steps">
      {steps.map((s, i) => (
        <div key={i}
          className={`im-step ${step > i+1 ? 'done' : ''} ${step === i+1 ? 'active' : ''}`}>
          <div className="im-step__circle">
            {step > i+1 ? <FontAwesomeIcon icon={faCheck} /> : i+1}
          </div>
          <span>{txt(s.labelEn, s.labelFr, lang)}</span>
          {i < steps.length - 1 && <div className="im-step__line" />}
        </div>
      ))}
    </div>
  )

  // Success
  if (step === 4) {
    return (
      <div className="im-overlay">
        <div className="im-modal im-modal--success">
          <div className="im-success">
            <div className="im-success__icon">
              <FontAwesomeIcon icon={faCheck} />
            </div>
            <h2>{txt('Investment Submitted!', 'Investissement soumis !', lang)}</h2>
            <p>
              {txt(
                `You've committed ${formatAmount(amount, project.currency)} to ${project.nameEn}.`,
                `Vous avez engagé ${formatAmount(amount, project.currency)} pour ${project.nameFr}.`,
                lang
              )}
            </p>
            <div className="im-success__note">
              <FontAwesomeIcon icon={faShieldHalved} />
              <span>
                {txt(
                  'Your investment is pending confirmation via our payment API.',
                  'Votre investissement est en attente de confirmation via notre API de paiement.',
                  lang
                )}
              </span>
            </div>
            <button className="im-success__close" onClick={onClose}>
              {txt('Done', 'Terminer', lang)}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const Body = (
    <div className="im-body">
      {/* Project info */}
      <div className="im-project-info">
        <img src={project.logo} alt={project.nameEn} />
        <div>
          <p className="im-project-info__name">
            {txt(project.nameEn, project.nameFr, lang)}
          </p>
          <p className="im-project-info__tagline">
            {txt(project.taglineEn, project.taglineFr, lang)}
          </p>
        </div>
      </div>

      {StepIndicator}

      {/* ── Step 1: Amount ── */}
      {step === 1 && (
        <div className="im-step-content">
          <h3>{txt('Choose your investment amount', 'Choisissez votre montant d\'investissement', lang)}</h3>

          {/* Preset amounts */}
          <div className="im-presets">
            {presets.map((preset, i) => (
              <button
                key={i}
                className={`im-preset ${amount === preset ? 'active' : ''}`}
                onClick={() => setAmount(preset)}
              >
                {formatAmount(preset, project.currency)}
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="im-field">
            <label>{txt('Or enter a custom amount', 'Ou entrez un montant personnalisé', lang)}</label>
            <div className="im-amount-input">
              <span className="im-amount-input__currency">{project.currency}</span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                min={project.minInvestment}
                step={1000}
              />
            </div>
            {amount < project.minInvestment && (
              <p className="im-error">
                {txt(
                  `Minimum is ${formatAmount(project.minInvestment, project.currency)}`,
                  `Minimum est ${formatAmount(project.minInvestment, project.currency)}`,
                  lang
                )}
              </p>
            )}
          </div>

          {/* Returns estimate */}
          <div className="im-returns">
            <FontAwesomeIcon icon={faArrowTrendUp} />
            <div>
              <p className="im-returns__label">
                {txt('Estimated annual return', 'Retour annuel estimé', lang)}
              </p>
              <p className="im-returns__value">{project.returns}</p>
            </div>
          </div>

          <button
            className="im-next-btn"
            onClick={() => setStep(2)}
            disabled={amount < project.minInvestment}
          >
            {txt('Continue', 'Continuer', lang)} →
          </button>
        </div>
      )}

      {/* ── Step 2: Payment method ── */}
      {step === 2 && (
        <div className="im-step-content">
          <h3>{txt('Choose payment method', 'Choisissez le mode de paiement', lang)}</h3>

          <div className="im-methods">
            {paymentMethods.map(m => (
              <button
                key={m.id}
                className={`im-method ${method?.id === m.id ? 'active' : ''}`}
                onClick={() => setMethod(m)}
              >
                <div className="im-method__icon">
                  <FontAwesomeIcon icon={m.icon} />
                </div>
                <div className="im-method__info">
                  <p>{txt(m.iconEn, m.iconFr, lang)}</p>
                  <span>{m.desc}</span>
                </div>
                {method?.id === m.id && (
                  <div className="im-method__check">
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Phone for mobile money */}
          {method?.id === 'mobile' && (
            <div className="im-field">
              <label>
                {txt('Mobile Money number', 'Numéro Mobile Money', lang)}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+237 6XX XXX XXX"
                className="im-input"
              />
            </div>
          )}

          <p className="im-api-note">
            📡 {txt(
              'Payment processing will be connected to our payment gateway API.',
              'Le traitement des paiements sera connecté à notre API de passerelle de paiement.',
              lang
            )}
          </p>

          <div className="im-btn-row">
            <button className="im-back-btn" onClick={() => setStep(1)}>
              ← {txt('Back', 'Retour', lang)}
            </button>
            <button
              className="im-next-btn"
              onClick={() => setStep(3)}
              disabled={!method}
            >
              {txt('Continue', 'Continuer', lang)} →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Confirm ── */}
      {step === 3 && (
        <div className="im-step-content">
          <h3>{txt('Confirm your investment', 'Confirmez votre investissement', lang)}</h3>

          <div className="im-summary">
            <div className="im-summary__row">
              <span>{txt('Project', 'Projet', lang)}</span>
              <strong>{txt(project.nameEn, project.nameFr, lang)}</strong>
            </div>
            <div className="im-summary__row">
              <span>{txt('Amount', 'Montant', lang)}</span>
              <strong className="im-summary__amount">
                {formatAmount(amount, project.currency)}
              </strong>
            </div>
            <div className="im-summary__row">
              <span>{txt('Payment', 'Paiement', lang)}</span>
              <strong>{method ? txt(method.iconEn, method.iconFr, lang) : '—'}</strong>
            </div>
            {phone && (
              <div className="im-summary__row">
                <span>{txt('Phone', 'Téléphone', lang)}</span>
                <strong>{phone}</strong>
              </div>
            )}
            <div className="im-summary__row">
              <span>{txt('Est. returns', 'Retour estimé', lang)}</span>
              <strong style={{ color:'#2D6A4F' }}>{project.returns}</strong>
            </div>
          </div>

          <div className="im-legal">
            <FontAwesomeIcon icon={faShieldHalved} />
            <p>
              {txt(
                'By confirming, you agree to the investment terms. This transaction will be processed securely via our payment API.',
                'En confirmant, vous acceptez les termes d\'investissement. Cette transaction sera traitée via notre API de paiement.',
                lang
              )}
            </p>
          </div>

          <div className="im-btn-row">
            <button className="im-back-btn" onClick={() => setStep(2)}>
              ← {txt('Back', 'Retour', lang)}
            </button>
            <button
              className="im-confirm-btn"
              onClick={handleInvest}
              disabled={saving}
            >
              {saving
                ? <FontAwesomeIcon icon={faSpinner} spin />
                : <>{txt('Confirm investment', 'Confirmer l\'investissement', lang)} <FontAwesomeIcon icon={faCheck} /></>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <div className="im-overlay">
        <div className="im-mobile">
          <div className="im-mobile__header">
            <button onClick={onClose}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <h2>{txt('Back this project', 'Soutenir ce projet', lang)}</h2>
            <div style={{ width:36 }} />
          </div>
          {Body}
        </div>
      </div>
    )
  }

  return (
    <div className="im-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="im-modal">
        <div className="im-modal__header">
          <h2>{txt('Back this project', 'Soutenir ce projet', lang)}</h2>
          <button className="im-modal__close" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        {Body}
      </div>
    </div>
  )
}