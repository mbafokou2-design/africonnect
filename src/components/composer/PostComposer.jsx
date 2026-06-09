import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faImage, faNewspaper, faCalendarDays, faChartBar,
  faXmark, faGlobe, faUsers, faLock, faChevronDown,
  faSpinner, faCheck
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import './PostComposer.css'

const actions = [
  { id: 'photo',   icon: faImage,        colorClass: 'green',  en: 'Photo / Video', fr: 'Photo / Vidéo' },
  { id: 'article', icon: faNewspaper,    colorClass: 'blue',   en: 'Article',        fr: 'Article'        },
  { id: 'event',   icon: faCalendarDays, colorClass: 'purple', en: 'Event',          fr: 'Événement'      },
  { id: 'poll',    icon: faChartBar,     colorClass: 'orange', en: 'Poll',           fr: 'Sondage'        },
]

const audiences = [
  { id: 'public',      icon: faGlobe,  en: 'Public',         fr: 'Public'           },
  { id: 'network',     icon: faUsers,  en: 'My Network',     fr: 'Mon réseau'       },
  { id: 'private',     icon: faLock,   en: 'Only me',        fr: 'Seulement moi'   },
]

export default function PostComposer({ forceOpen = false, onClose }) {
  const { lang } = useLang()
  const [open, setOpen]           = useState(false)
  const [postText, setPostText]   = useState('')
  const [activeTab, setActiveTab] = useState('photo')
  const [audience, setAudience]   = useState(audiences[0])
  const [audienceDrop, setAudienceDrop] = useState(false)
  const [submitting, setSubmitting]     = useState(false)
  const [submitted, setSubmitted]       = useState(false)
  const [preview, setPreview]           = useState(null)
  const fileRef   = useRef()
  const modalRef  = useRef()
  const textareaRef = useRef()

  // Allow external trigger (e.g. bottom nav + button)
  useEffect(() => {
    if (forceOpen) setOpen(true)
  }, [forceOpen])

  const handleClose = () => {
    setOpen(false)
    onClose?.()
  }

  // Close modal on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Auto-focus textarea when modal opens
  useEffect(() => {
    if (open && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100)
    }
  }, [open])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  const handleSubmit = async () => {
    if (!postText.trim() && !preview) return
    setSubmitting(true)

    // TODO: Replace with real API call
    // const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ text: postText, audience: audience.id, media: preview })
    // })

    await new Promise(r => setTimeout(r, 1400)) // fake delay
    setSubmitting(false)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      handleClose()
      setPostText('')
      setPreview(null)
      setActiveTab('photo')
      setAudience(audiences[0])
    }, 1200)
  }

  const openWith = (tab) => {
    setActiveTab(tab)
    setOpen(true)
  }

  return (
    <>
      {/* ── Composer Bar ── */}
      <div className="composer">
        <img
          src="https://i.pravatar.cc/40?img=11"
          alt="Jean"
          className="composer__avatar"
        />
        <button
          className="composer__input-btn"
          onClick={() => setOpen(true)}
        >
          <span
            data-en="What's on your mind, Jean?"
            data-fr="Quoi de neuf, Jean ?"
          >
            {txt("What's on your mind, Jean?", 'Quoi de neuf, Jean ?', lang)}
          </span>
        </button>
      </div>

      {/* ── Action Buttons ── */}
      <div className="composer__actions">
        {actions.map(action => (
          <button
            key={action.id}
            className={`composer__action composer__action--${action.colorClass}`}
            onClick={() => openWith(action.id)}
          >
            <FontAwesomeIcon icon={action.icon} />
            <span data-en={action.en} data-fr={action.fr}>
              {txt(action.en, action.fr, lang)}
            </span>
          </button>
        ))}
      </div>

      {/* ── Modal Overlay ── */}
      {open && (
        <div className="composer__overlay">
          <div className="composer__modal" ref={modalRef}>

            {/* Modal Header */}
            <div className="composer__modal-header">
              <div className="composer__modal-user">
                <img src="https://i.pravatar.cc/40?img=11" alt="Jean" />
                <div>
                  <p className="composer__modal-name">Jean Dupont</p>
                  {/* Audience dropdown */}
                  <div className="composer__audience-wrap">
                    <button
                      className="composer__audience-btn"
                      onClick={() => setAudienceDrop(p => !p)}
                    >
                      <FontAwesomeIcon icon={audience.icon} />
                      <span data-en={audience.en} data-fr={audience.fr}>
                        {txt(audience.en, audience.fr, lang)}
                      </span>
                      <FontAwesomeIcon icon={faChevronDown} className="composer__audience-chevron" />
                    </button>
                    {audienceDrop && (
                      <div className="composer__audience-drop">
                        {audiences.map(a => (
                          <button
                            key={a.id}
                            className={`composer__audience-option ${audience.id === a.id ? 'active' : ''}`}
                            onClick={() => { setAudience(a); setAudienceDrop(false) }}
                          >
                            <FontAwesomeIcon icon={a.icon} />
                            <span data-en={a.en} data-fr={a.fr}>
                              {txt(a.en, a.fr, lang)}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button className="composer__close" onClick={handleClose}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Tabs */}
            <div className="composer__tabs">
              {actions.map(action => (
                <button
                  key={action.id}
                  className={`composer__tab composer__tab--${action.colorClass} ${activeTab === action.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(action.id)}
                >
                  <FontAwesomeIcon icon={action.icon} />
                  <span data-en={action.en} data-fr={action.fr}>
                    {txt(action.en, action.fr, lang)}
                  </span>
                </button>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              className="composer__textarea"
              value={postText}
              onChange={e => setPostText(e.target.value)}
              placeholder={txt(
                "What's on your mind, Jean?",
                'Quoi de neuf, Jean ?',
                lang
              )}
              rows={5}
            />

            {/* Photo/Video tab — file upload */}
            {activeTab === 'photo' && (
              <div className="composer__media">
                {preview ? (
                  <div className="composer__preview">
                    <img src={preview} alt="preview" />
                    <button
                      className="composer__preview-remove"
                      onClick={() => setPreview(null)}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                ) : (
                  <button
                    className="composer__upload-btn"
                    onClick={() => fileRef.current.click()}
                  >
                    <FontAwesomeIcon icon={faImage} />
                    <span data-en="Add photo or video" data-fr="Ajouter photo ou vidéo">
                      {txt('Add photo or video', 'Ajouter photo ou vidéo', lang)}
                    </span>
                  </button>
                )}
                <input
                  type="file"
                  accept="image/*,video/*"
                  ref={fileRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>
            )}

            {/* Event tab */}
            {activeTab === 'event' && (
              <div className="composer__event-fields">
                <input
                  type="text"
                  className="composer__field"
                  placeholder={txt('Event title', "Titre de l'événement", lang)}
                />
                <input
                  type="datetime-local"
                  className="composer__field"
                />
                <input
                  type="text"
                  className="composer__field"
                  placeholder={txt('Location', 'Lieu', lang)}
                />
              </div>
            )}

            {/* Poll tab */}
            {activeTab === 'poll' && (
              <div className="composer__poll-fields">
                <input
                  type="text"
                  className="composer__field"
                  placeholder={txt('Question', 'Question', lang)}
                />
                <input
                  type="text"
                  className="composer__field"
                  placeholder={txt('Option 1', 'Option 1', lang)}
                />
                <input
                  type="text"
                  className="composer__field"
                  placeholder={txt('Option 2', 'Option 2', lang)}
                />
                <button className="composer__add-option">
                  + {txt('Add option', 'Ajouter une option', lang)}
                </button>
              </div>
            )}

            {/* Footer */}
            <div className="composer__modal-footer">
              <span className="composer__char-count">
                {postText.length} / 3000
              </span>
              <button
                className={`composer__submit ${submitted ? 'submitted' : ''}`}
                onClick={handleSubmit}
                disabled={submitting || submitted || (!postText.trim() && !preview)}
              >
                {submitting && <FontAwesomeIcon icon={faSpinner} spin />}
                {submitted  && <FontAwesomeIcon icon={faCheck} />}
                {!submitting && !submitted && (
                  <span data-en="Publish" data-fr="Publier">
                    {txt('Publish', 'Publier', lang)}
                  </span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}