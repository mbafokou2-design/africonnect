import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft, faPhone, faVideo,
  faEllipsisVertical, faPaperPlane,
  faImage, faFile, faMicrophone,
  faStop, faPlay, faPause,
  faXmark, faCheck, faCheckDouble
} from '@fortawesome/free-solid-svg-icons'
import { txt } from '../../../utils/translate'

export default function ChatWindow({ thread, messages, onSend, onBack, lang }) {
  const [text, setText]               = useState('')
  const [recording, setRecording]     = useState(false)
  const [recordTime, setRecordTime]   = useState(0)
  const [mediaRec, setMediaRec]       = useState(null)
  const [audioChunks, setAudioChunks] = useState([])
  const [attachPreview, setAttachPreview] = useState(null)
  const [attachType, setAttachType]   = useState(null)
  const fileRef  = useRef()
  const imageRef = useRef()
  const bottomRef = useRef()
  const timerRef  = useRef()

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Recording timer
  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => setRecordTime(t => t + 1), 1000)
    } else {
      clearInterval(timerRef.current)
      setRecordTime(0)
    }
    return () => clearInterval(timerRef.current)
  }, [recording])

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  // Send text
  const sendText = () => {
    if (!text.trim()) return
    onSend({ type: 'text', textEn: text, textFr: text })
    setText('')
    // TODO: POST to API with text content
  }

  // Send image/file
  const handleFileSelect = (e, type) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setAttachPreview(ev.target.result)
      setAttachType(type)
    }
    reader.readAsDataURL(file)
    // TODO: upload to ${import.meta.env.VITE_API_BASE_URL}/media/upload
  }

  const sendAttachment = () => {
    if (!attachPreview) return
    onSend({
      type: attachType,
      textEn: `[${attachType}]`,
      textFr: `[${attachType}]`,
      preview: attachPreview
    })
    setAttachPreview(null)
    setAttachType(null)
    // TODO: attach media URL from API response
  }

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      const chunks = []
      mr.ondataavailable = e => chunks.push(e.data)
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const url  = URL.createObjectURL(blob)
        onSend({
          type: 'voice',
          textEn: '[Voice message]',
          textFr: '[Message vocal]',
          preview: url,
          duration: recordTime
          // TODO: upload blob to ${import.meta.env.VITE_API_BASE_URL}/media/voice
        })
        stream.getTracks().forEach(t => t.stop())
      }
      mr.start()
      setMediaRec(mr)
      setAudioChunks(chunks)
      setRecording(true)
    } catch (e) {
      alert(txt('Microphone access denied', 'Accès micro refusé', lang))
    }
  }

  const stopRecording = () => {
    mediaRec?.stop()
    setRecording(false)
    setMediaRec(null)
  }

  return (
    <div className="chat-window">

      {/* ── Header ── */}
      <div className="chat-header">
        <button className="chat-header__back" onClick={onBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <a href={`/profile/${thread.id}`} className="chat-header__user">
          <div className="chat-header__avatar-wrap">
            <img src={thread.avatar} alt={thread.name} />
            {thread.online && <span className="chat-header__online" />}
          </div>
          <div>
            <p className="chat-header__name">{thread.name}</p>
            <p className="chat-header__status">
              {thread.online
                ? txt('Online', 'En ligne', lang)
                : txt('Offline', 'Hors ligne', lang)}
            </p>
          </div>
        </a>
        <div className="chat-header__actions">
          {/* TODO: voice call via WebRTC */}
          <button className="chat-header__btn" title={txt('Voice call', 'Appel vocal', lang)}>
            <FontAwesomeIcon icon={faPhone} />
          </button>
          {/* TODO: video call via WebRTC */}
          <button className="chat-header__btn" title={txt('Video call', 'Appel vidéo', lang)}>
            <FontAwesomeIcon icon={faVideo} />
          </button>
          <button className="chat-header__btn">
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="chat-messages">
        {messages.map(m => (
          <MessageBubble key={m.id} m={m} thread={thread} lang={lang} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ── Attachment preview ── */}
      {attachPreview && (
        <div className="chat-attach-preview">
          {attachType === 'image' && (
            <img src={attachPreview} alt="preview" />
          )}
          {attachType === 'file' && (
            <div className="chat-attach-preview__file">
              <FontAwesomeIcon icon={faFile} />
              <span>{txt('File ready to send', 'Fichier prêt', lang)}</span>
            </div>
          )}
          <div className="chat-attach-preview__actions">
            <button className="chat-attach-preview__cancel" onClick={() => setAttachPreview(null)}>
              <FontAwesomeIcon icon={faXmark} />
              {txt('Cancel', 'Annuler', lang)}
            </button>
            <button className="chat-attach-preview__send" onClick={sendAttachment}>
              <FontAwesomeIcon icon={faPaperPlane} />
              {txt('Send', 'Envoyer', lang)}
            </button>
          </div>
        </div>
      )}

      {/* ── Input bar ── */}
      <div className="chat-input-bar">

        {recording ? (
          /* Recording state */
          <div className="chat-recording">
            <div className="chat-recording__indicator" />
            <span className="chat-recording__time">{formatTime(recordTime)}</span>
            <span className="chat-recording__label">
              {txt('Recording...', 'Enregistrement...', lang)}
            </span>
            <button className="chat-recording__stop" onClick={stopRecording}>
              <FontAwesomeIcon icon={faStop} />
              {txt('Stop', 'Arrêter', lang)}
            </button>
          </div>
        ) : (
          <>
            {/* Attach buttons */}
            <button
              className="chat-input-btn"
              onClick={() => imageRef.current.click()}
              title={txt('Send image', 'Envoyer image', lang)}
            >
              <FontAwesomeIcon icon={faImage} />
            </button>
            <button
              className="chat-input-btn"
              onClick={() => fileRef.current.click()}
              title={txt('Send file', 'Envoyer fichier', lang)}
            >
              <FontAwesomeIcon icon={faFile} />
            </button>

            {/* Hidden file inputs */}
            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => handleFileSelect(e, 'image')}
            />
            <input
              ref={fileRef}
              type="file"
              style={{ display: 'none' }}
              onChange={e => handleFileSelect(e, 'file')}
            />

            {/* Text input */}
            <input
              className="chat-input-field"
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendText()}
              placeholder={txt('Write a message...', 'Écrire un message...', lang)}
            />

            {/* Send or mic */}
            {text.trim() ? (
              <button className="chat-send-btn" onClick={sendText}>
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            ) : (
              <button
                className="chat-mic-btn"
                onMouseDown={startRecording}
                onTouchStart={startRecording}
                title={txt('Hold to record', 'Maintenir pour enregistrer', lang)}
              >
                <FontAwesomeIcon icon={faMicrophone} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function MessageBubble({ m, thread, lang }) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef()

  const toggleAudio = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play()
      setPlaying(true)
    }
  }

  return (
    <div className={`chat-bubble chat-bubble--${m.from}`}>
      {m.from === 'other' && (
        <img src={thread.avatar} alt={thread.name} className="chat-bubble__avatar" />
      )}
      <div className="chat-bubble__content">

        {/* Text */}
        {m.type === 'text' && (
          <div className="chat-bubble__text">
            {txt(m.textEn, m.textFr, lang)}
          </div>
        )}

        {/* Image */}
        {m.type === 'image' && m.preview && (
          <div className="chat-bubble__image">
            <img src={m.preview} alt="sent" />
          </div>
        )}

        {/* File */}
        {m.type === 'file' && (
          <div className="chat-bubble__file">
            <FontAwesomeIcon icon={faFile} />
            <span>{txt('File', 'Fichier', lang)}</span>
          </div>
        )}

        {/* Voice */}
        {m.type === 'voice' && (
          <div className="chat-bubble__voice">
            {m.preview && (
              <audio ref={audioRef} src={m.preview} onEnded={() => setPlaying(false)} />
            )}
            <button className="chat-bubble__voice-btn" onClick={toggleAudio}>
              <FontAwesomeIcon icon={playing ? faPause : faPlay} />
            </button>
            <div className="chat-bubble__voice-bar">
              <div className="chat-bubble__voice-wave">
                {[...Array(12)].map((_, i) => (
                  <span key={i} className={`wave-bar ${playing ? 'playing' : ''}`}
                    style={{ height: `${8 + Math.random() * 16}px`, animationDelay: `${i * 0.08}s` }}
                  />
                ))}
              </div>
              {m.duration && (
                <span className="chat-bubble__voice-dur">
                  {String(Math.floor(m.duration/60)).padStart(2,'0')}:{String(m.duration%60).padStart(2,'0')}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Time + read receipt */}
        <div className="chat-bubble__meta">
          <span className="chat-bubble__time">{m.time}</span>
          {m.from === 'me' && (
            <FontAwesomeIcon
              icon={faCheckDouble}
              className="chat-bubble__read"
            />
          )}
        </div>
      </div>
    </div>
  )
}