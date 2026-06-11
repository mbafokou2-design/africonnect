import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faXmark, faImage, faSpinner,
  faCheck, faArrowLeft, faGlobe,
  faUsers, faLock, faChevronDown
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import { useToast } from '../ui/Toast'
import './EditPostModal.css'

const audiences = [
  { id:'public',  icon: faGlobe, en:'Public',     fr:'Public'          },
  { id:'network', icon: faUsers, en:'My Network', fr:'Mon réseau'      },
  { id:'private', icon: faLock,  en:'Only me',    fr:'Seulement moi'   },
]

export default function EditPostModal({ post, onClose, onSave }) {
  const { lang }     = useLang()
  const { addToast } = useToast()
  const isMobile     = window.innerWidth <= 768

  const [text,      setText]     = useState(lang === 'fr' ? post.contentFr : post.contentEn)
  const [textEn,    setTextEn]   = useState(post.contentEn)
  const [textFr,    setTextFr]   = useState(post.contentFr)
  const [image,     setImage]    = useState(post.image || null)
  const [audience,  setAudience] = useState(
    audiences.find(a => a.id === post.visibility) || audiences[0]
  )
  const [audienceDrop, setAudienceDrop] = useState(false)
  const [saving,    setSaving]   = useState(false)
  const fileRef   = useRef()
  const overlayRef = useRef()

  // Close on outside click (desktop only)
  useEffect(() => {
    if (isMobile) return
    const handler = (e) => {
      if (overlayRef.current && e.target === overlayRef.current) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isMobile, onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleImageChange = (e) => {
    const f = e.target.files[0]
    if (f) setImage(URL.createObjectURL(f))
    // TODO: upload to ${import.meta.env.VITE_API_BASE_URL}/media/upload
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await new Promise(r => setTimeout(r, 1000))
      // TODO: PUT ${import.meta.env.VITE_API_BASE_URL}/posts/${post.id}
      if (Math.random() < 0.3) throw new Error('API error')
      onSave({
        ...post,
        contentEn: textEn,
        contentFr: textFr,
        image,
        visibility: audience.id,
      })
      addToast(txt('Post updated!', 'Post mis à jour !', lang), 'success')
      onClose()
    } catch {
      addToast(
        txt('Server error. Changes saved locally.', 'Erreur serveur. Sauvegardé localement.', lang),
        'error'
      )
      onSave({ ...post, contentEn: textEn, contentFr: textFr, image, visibility: audience.id })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const FormBody = (
    <div className="epm-body">

      {/* User + audience */}
      <div className="epm-user-row">
        <img
          src={post.user.avatar}
          alt={post.user.name}
          className="epm-avatar"
        />
        <div>
          <p className="epm-user-name">{post.user.name}</p>
          {/* Audience picker */}
          <div className="epm-audience-wrap">
            <button
              className="epm-audience-btn"
              onClick={() => setAudienceDrop(p => !p)}
            >
              <FontAwesomeIcon icon={audience.icon} />
              <span>{txt(audience.en, audience.fr, lang)}</span>
              <FontAwesomeIcon icon={faChevronDown} className="epm-audience-chevron" />
            </button>
            {audienceDrop && (
              <div className="epm-audience-drop">
                {audiences.map(a => (
                  <button
                    key={a.id}
                    className={`epm-audience-option ${audience.id === a.id ? 'active' : ''}`}
                    onClick={() => { setAudience(a); setAudienceDrop(false) }}
                  >
                    <FontAwesomeIcon icon={a.icon} />
                    <span>{txt(a.en, a.fr, lang)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Text EN */}
      <div className="epm-field">
        <label>Content (English)</label>
        <textarea
          rows={4}
          value={textEn}
          onChange={e => setTextEn(e.target.value)}
          placeholder="Write your post in English..."
        />
        <span className="epm-char">{textEn.length} / 3000</span>
      </div>

      {/* Text FR */}
      <div className="epm-field">
        <label>Contenu (Français)</label>
        <textarea
          rows={4}
          value={textFr}
          onChange={e => setTextFr(e.target.value)}
          placeholder="Rédigez votre post en français..."
        />
        <span className="epm-char">{textFr.length} / 3000</span>
      </div>

      {/* Image */}
      <div className="epm-media">
        {image ? (
          <div className="epm-preview">
            <img src={image} alt="preview" />
            <button className="epm-preview-remove" onClick={() => setImage(null)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        ) : (
          <button className="epm-upload-btn" onClick={() => fileRef.current.click()}>
            <FontAwesomeIcon icon={faImage} />
            <span>{txt('Add / Change image', 'Ajouter / Changer image', lang)}</span>
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*"
          style={{ display:'none' }} onChange={handleImageChange} />
      </div>

    </div>
  )

  /* ── MOBILE — full page ── */
  if (isMobile) {
    return (
      <div className="epm-mobile-page">
        <div className="epm-mobile-header">
          <button className="epm-mobile-back" onClick={onClose}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h2>{txt('Edit Post', 'Modifier le post', lang)}</h2>
          <button
            className="epm-mobile-save"
            onClick={handleSave}
            disabled={saving || (!textEn.trim() && !textFr.trim())}
          >
            {saving
              ? <FontAwesomeIcon icon={faSpinner} spin />
              : txt('Save', 'Enregistrer', lang)
            }
          </button>
        </div>
        {FormBody}
      </div>
    )
  }

  /* ── DESKTOP — modal ── */
  return (
    <div className="epm-overlay" ref={overlayRef}>
      <div className="epm-modal">

        {/* Modal header */}
        <div className="epm-modal-header">
          <h2>{txt('Edit Post', 'Modifier le post', lang)}</h2>
          <button className="epm-modal-close" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Body */}
        {FormBody}

        {/* Footer */}
        <div className="epm-footer">
          <button className="epm-cancel-btn" onClick={onClose}>
            {txt('Cancel', 'Annuler', lang)}
          </button>
          <button
            className={`epm-save-btn ${saving ? 'loading' : ''}`}
            onClick={handleSave}
            disabled={saving || (!textEn.trim() && !textFr.trim())}
          >
            {saving
              ? <FontAwesomeIcon icon={faSpinner} spin />
              : <><FontAwesomeIcon icon={faCheck} /> {txt('Save changes', 'Enregistrer', lang)}</>
            }
          </button>
        </div>

      </div>
    </div>
  )
}