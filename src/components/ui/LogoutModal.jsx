import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faRightFromBracket, faXmark, faSpinner
} from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { txt } from '../../utils/translate'
import { useToast } from './Toast'
import './LogoutModal.css'

export default function LogoutModal({ onClose, lang }) {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/auth/logout
    // Then: clear localStorage, redirect to /login
    addToast(txt('Logged out successfully.', 'Déconnexion réussie.', lang), 'success')
    setLoading(false)
    window.location.href = '/login'
  }

  return (
    <div className="logout-overlay" onClick={onClose}>
      <div className="logout-modal" onClick={e => e.stopPropagation()}>
        <div className="logout-modal__icon">
          <FontAwesomeIcon icon={faRightFromBracket} />
        </div>
        <h2 className="logout-modal__title">
          {txt('Log out of AfriConnect?', 'Se déconnecter d\'AfriConnect ?', lang)}
        </h2>
        <p className="logout-modal__sub">
          {txt(
            'You will need to log back in to access your account.',
            'Vous devrez vous reconnecter pour accéder à votre compte.',
            lang
          )}
        </p>
        <div className="logout-modal__actions">
          <button className="logout-modal__cancel" onClick={onClose}>
            {txt('Cancel', 'Annuler', lang)}
          </button>
          <button
            className="logout-modal__confirm"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading
              ? <FontAwesomeIcon icon={faSpinner} spin />
              : <><FontAwesomeIcon icon={faRightFromBracket} /> {txt('Log out', 'Déconnexion', lang)}</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}