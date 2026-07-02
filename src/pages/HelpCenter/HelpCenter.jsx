import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch, faQuestionCircle, faBook,
  faMessage, faVideo, faChevronDown,
  faChevronUp, faArrowRight, faShieldHalved,
  faCreditCard, faUsers, faBriefcase,
  faGear, faBug
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import './HelpCenter.css'

const categories = [
  { icon: faUsers,        en: 'Account & Profile',    fr: 'Compte & Profil'      },
  { icon: faBriefcase,    en: 'Jobs & Opportunities',  fr: 'Emplois'              },
  { icon: faCreditCard,   en: 'Billing & Subscription',fr: 'Facturation'          },
  { icon: faShieldHalved, en: 'Privacy & Security',   fr: 'Confidentialité'      },
  { icon: faMessage,      en: 'Messaging',             fr: 'Messagerie'           },
  { icon: faGear,         en: 'Settings',              fr: 'Paramètres'           },
]

const faqs = [
  { qEn:'How do I update my profile?',           qFr:'Comment mettre à jour mon profil ?',      aEn:'Go to your Profile page and click the Edit button. You can update your photo, title, bio, experience and education.', aFr:'Allez sur votre page Profil et cliquez sur Modifier. Vous pouvez mettre à jour votre photo, titre, bio, expérience et formation.' },
  { qEn:'How does the job application work?',    qFr:'Comment fonctionne la candidature ?',      aEn:'Click Apply on any job listing. Fill in your personal details, upload your CV, add your social links and submit. The employer will be notified.', aFr:'Cliquez sur Postuler sur n\'importe quelle offre. Remplissez vos informations, téléversez votre CV, ajoutez vos liens sociaux et soumettez.' },
  { qEn:'How do I cancel my subscription?',      qFr:'Comment annuler mon abonnement ?',        aEn:'Go to Settings > Billing and click Cancel subscription. You will keep access until the end of your current billing period.', aFr:'Allez dans Paramètres > Facturation et cliquez sur Annuler l\'abonnement. Vous conserverez l\'accès jusqu\'à la fin de votre période.' },
  { qEn:'How do I report a user or listing?',    qFr:'Comment signaler un utilisateur ?',       aEn:'Click the 3-dot menu (⋯) on any profile, post or listing and select Report. Our team reviews all reports within 24 hours.', aFr:'Cliquez sur le menu 3 points (⋯) sur n\'importe quel profil, post ou annonce et sélectionnez Signaler. Notre équipe examine tous les signalements.' },
  { qEn:'Is my data safe on AfriConnect?',       qFr:'Mes données sont-elles sécurisées ?',     aEn:'Yes. We use industry-standard encryption and never sell your data to third parties. See our Privacy Policy for details.', aFr:'Oui. Nous utilisons un chiffrement standard et ne vendons jamais vos données à des tiers. Consultez notre Politique de confidentialité.' },
  { qEn:'How do I delete my account?',           qFr:'Comment supprimer mon compte ?',          aEn:'Go to Settings > Account and click Delete account. This action is permanent and cannot be undone. All your data will be erased.', aFr:'Allez dans Paramètres > Compte et cliquez sur Supprimer le compte. Cette action est permanente et irréversible.' },
]

export default function HelpCenter() {
  const { lang } = useLang()
  const [search,  setSearch]  = useState('')
  const [openFaq, setOpenFaq] = useState(null)

  const filtered = faqs.filter(f =>
    !search ||
    (lang === 'fr' ? f.qFr : f.qEn).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="help-page">

      {/* Hero */}
      <div className="help-hero">
        <h1 className="help-hero__title">
          {txt('How can we help you?', 'Comment pouvons-nous vous aider ?', lang)}
        </h1>
        <div className="help-hero__search">
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={txt(
              'Search for help articles...',
              'Rechercher des articles d\'aide...',
              lang
            )}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="help-section">
        <h2 className="help-section__title">
          {txt('Browse by topic', 'Parcourir par sujet', lang)}
        </h2>
        <div className="help-cat-grid">
          {categories.map((cat, i) => (
            <div key={i} className="help-cat-card">
              <div className="help-cat-card__icon">
                <FontAwesomeIcon icon={cat.icon} />
              </div>
              <span>{txt(cat.en, cat.fr, lang)}</span>
              <FontAwesomeIcon icon={faArrowRight} className="help-cat-card__arrow" />
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="help-section">
        <h2 className="help-section__title">
          {txt('Frequently asked questions', 'Questions fréquentes', lang)}
        </h2>
        <div className="help-faqs">
          {filtered.map((f, i) => (
            <div key={i} className="help-faq-item">
              <button
                className="help-faq-item__q"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span>{lang === 'fr' ? f.qFr : f.qEn}</span>
                <FontAwesomeIcon icon={openFaq === i ? faChevronUp : faChevronDown} />
              </button>
              {openFaq === i && (
                <p className="help-faq-item__a">
                  {lang === 'fr' ? f.aFr : f.aEn}
                </p>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="help-empty">
              <FontAwesomeIcon icon={faQuestionCircle} />
              <p>{txt('No results found', 'Aucun résultat', lang)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact cards */}
      <div className="help-contact-grid">
        <div className="help-contact-card">
          <FontAwesomeIcon icon={faMessage} className="help-contact-card__icon" />
          <h3>{txt('Live chat', 'Chat en direct', lang)}</h3>
          <p>{txt('Chat with our support team. Available Mon–Sat, 8am–8pm.', 'Discutez avec notre équipe. Disponible Lun–Sam, 8h–20h.', lang)}</p>
          <button className="help-contact-card__btn">
            {txt('Start chat', 'Démarrer le chat', lang)}
          </button>
        </div>
        <div className="help-contact-card">
          <FontAwesomeIcon icon={faBook} className="help-contact-card__icon" />
          <h3>{txt('Documentation', 'Documentation', lang)}</h3>
          <p>{txt('Read our detailed guides and API documentation.', 'Lisez nos guides détaillés et la documentation API.', lang)}</p>
          <button className="help-contact-card__btn">
            {txt('Read docs', 'Lire les docs', lang)}
          </button>
        </div>
        <div className="help-contact-card">
          <FontAwesomeIcon icon={faBug} className="help-contact-card__icon" />
          <h3>{txt('Report a bug', 'Signaler un bug', lang)}</h3>
          <p>{txt('Found a bug? Let us know and we\'ll fix it fast.', 'Vous avez trouvé un bug ? Dites-le nous et nous le corrigerons rapidement.', lang)}</p>
          <button className="help-contact-card__btn">
            {txt('Report', 'Signaler', lang)}
          </button>
        </div>
      </div>

    </div>
  )
}