import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import './Settings.css'
import {
  faGear, faGlobe, faBell, faLock,
  faUser, faTrash, faCrown,
  faCircleQuestion, faArrowRight
} from '@fortawesome/free-solid-svg-icons'

export default function Settings() {
  const { lang, setLang } = useLang()

  return (
    <div className="settings-page">
      <div className="page-header">
        <div className="page-header__icon page-header__icon--primary">
          <FontAwesomeIcon icon={faGear} />
        </div>
        <div>
          <h1 className="page-header__title"
            data-en="Settings" data-fr="Paramètres">
            {txt('Settings', 'Paramètres', lang)}
          </h1>
          <p className="page-header__sub"
            data-en="Manage your account preferences"
            data-fr="Gérez vos préférences de compte">
            {txt('Manage your account preferences', 'Gérez vos préférences de compte', lang)}
          </p>
        </div>
      </div>

      {/* Language — THE only place to toggle EN/FR */}
      <div className="settings-card">
        <div className="settings-card__header">
          <div className="settings-card__icon settings-card__icon--blue">
            <FontAwesomeIcon icon={faGlobe} />
          </div>
          <h2 className="settings-card__title"
            data-en="Language" data-fr="Langue">
            {txt('Language', 'Langue', lang)}
          </h2>
        </div>
        <p className="settings-card__desc"
          data-en="Choose your preferred language for the interface."
          data-fr="Choisissez votre langue préférée pour l'interface.">
          {txt(
            'Choose your preferred language for the interface.',
            "Choisissez votre langue préférée pour l'interface.",
            lang
          )}
        </p>
        <div className="settings-lang-toggle">
          <button
            className={`settings-lang-btn ${lang === 'en' ? 'active' : ''}`}
            onClick={() => setLang('en')}
          >
            🇬🇧 English
          </button>
          <button
            className={`settings-lang-btn ${lang === 'fr' ? 'active' : ''}`}
            onClick={() => setLang('fr')}
          >
            🇫🇷 Français
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="settings-card">
        <div className="settings-card__header">
          <div className="settings-card__icon settings-card__icon--orange">
            <FontAwesomeIcon icon={faBell} />
          </div>
          <h2 className="settings-card__title"
            data-en="Notifications" data-fr="Notifications">
            {txt('Notifications', 'Notifications', lang)}
          </h2>
        </div>
        {[
          { labelEn: 'Push notifications', labelFr: 'Notifications push', defaultOn: true },
          { labelEn: 'Email notifications', labelFr: 'Notifications par email', defaultOn: true },
          { labelEn: 'Job alerts', labelFr: "Alertes d'emploi", defaultOn: true },
          { labelEn: 'Message previews', labelFr: 'Aperçu des messages', defaultOn: false },
        ].map((item, i) => (
          <div key={i} className="settings-toggle-row">
            <span data-en={item.labelEn} data-fr={item.labelFr}>
              {txt(item.labelEn, item.labelFr, lang)}
            </span>
            <label className="settings-switch">
              <input type="checkbox" defaultChecked={item.defaultOn} />
              <span className="settings-switch__slider" />
            </label>
          </div>
        ))}
        {/* TODO: save via VITE_API_BASE_URL/settings/notifications */}
      </div>

      {/* Privacy */}
      <div className="settings-card">
        <div className="settings-card__header">
          <div className="settings-card__icon settings-card__icon--green">
            <FontAwesomeIcon icon={faLock} />
          </div>
          <h2 className="settings-card__title"
            data-en="Privacy" data-fr="Confidentialité">
            {txt('Privacy', 'Confidentialité', lang)}
          </h2>
        </div>
        {[
          { labelEn: 'Public profile', labelFr: 'Profil public', defaultOn: true },
          { labelEn: 'Show online status', labelFr: 'Afficher statut en ligne', defaultOn: true },
          { labelEn: 'Allow messages from all', labelFr: 'Messages de tous', defaultOn: false },
        ].map((item, i) => (
          <div key={i} className="settings-toggle-row">
            <span data-en={item.labelEn} data-fr={item.labelFr}>
              {txt(item.labelEn, item.labelFr, lang)}
            </span>
            <label className="settings-switch">
              <input type="checkbox" defaultChecked={item.defaultOn} />
              <span className="settings-switch__slider" />
            </label>
          </div>
        ))}
        {/* TODO: save via VITE_API_BASE_URL/settings/privacy */}
      </div>
      {/* Quick links */}
      <div className="settings-card">
        <div className="settings-card__header">
          <div className="settings-card__icon settings-card__icon--gold">
            <FontAwesomeIcon icon={faCrown} />
          </div>
          <h2 className="settings-card__title">
            {txt('Plans & Subscription', 'Plans & Abonnement', lang)}
          </h2>
        </div>
        <a href="/subscription" className="settings-nav-link">
          <span>{txt('Upgrade to Pro', 'Passer à Pro', lang)}</span>
          <FontAwesomeIcon icon={faArrowRight} />
        </a>
      </div>

      <div className="settings-card">
        <div className="settings-card__header">
          <div className="settings-card__icon settings-card__icon--blue">
            <FontAwesomeIcon icon={faCircleQuestion} />
          </div>
          <h2 className="settings-card__title">
            {txt('Help & Support', 'Aide & Support', lang)}
          </h2>
        </div>
        <a href="/help" className="settings-nav-link">
          <span>{txt('Help Center', 'Centre d\'aide', lang)}</span>
          <FontAwesomeIcon icon={faArrowRight} />
        </a>
        <a href="/about" className="settings-nav-link">
          <span>{txt('About AfriConnect', 'À propos d\'AfriConnect', lang)}</span>
          <FontAwesomeIcon icon={faArrowRight} />
        </a>
      </div>

      {/* Account */}
      <div className="settings-card">
        <div className="settings-card__header">
          <div className="settings-card__icon settings-card__icon--red">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <h2 className="settings-card__title"
            data-en="Account" data-fr="Compte">
            {txt('Account', 'Compte', lang)}
          </h2>
        </div>
        <button className="settings-danger-btn">
          <FontAwesomeIcon icon={faTrash} />
          <span data-en="Delete account" data-fr="Supprimer le compte">
            {txt('Delete account', 'Supprimer le compte', lang)}
          </span>
        </button>
        {/* TODO: connect to VITE_API_BASE_URL/account/delete */}
      </div>

    </div>
  )
}