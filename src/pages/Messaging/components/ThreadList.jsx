import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch, faEllipsisVertical,
  faTrash, faBellSlash, faBell,
  faEdit
} from '@fortawesome/free-solid-svg-icons'
import { txt } from '../../../utils/translate'

export default function ThreadList({ threads, activeId, onSelect, onDelete, onMute, lang }) {
  const [search, setSearch]     = useState('')
  const [menuId, setMenuId]     = useState(null)
  const menuRef = useRef()

  useEffect(() => {
    if (!menuId) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuId(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuId])

  const filtered = threads.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="thread-list">
      {/* Header */}
      <div className="thread-list__header">
        <h2>{txt('Messages', 'Messages', lang)}</h2>
        <button className="thread-list__compose">
          <FontAwesomeIcon icon={faEdit} />
        </button>
      </div>

      {/* Search */}
      <div className="thread-list__search">
        <FontAwesomeIcon icon={faSearch} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={txt('Search...', 'Rechercher...', lang)}
        />
      </div>

      {/* Threads */}
      <div className="thread-list__items">
        {filtered.map(t => (
          <div
            key={t.id}
            className={`thread-item ${activeId === t.id ? 'active' : ''} ${t.muted ? 'muted' : ''}`}
          >
            {/* Click → open chat */}
            <button className="thread-item__main" onClick={() => onSelect(t.id)}>
              <div className="thread-item__avatar-wrap">
                <img src={t.avatar} alt={t.name} />
                {t.online && <span className="thread-item__online" />}
              </div>
              <div className="thread-item__info">
                <div className="thread-item__top">
                  <span className="thread-item__name">{t.name}</span>
                  <span className="thread-item__time">{t.time}</span>
                </div>
                <div className="thread-item__bottom">
                  <span className="thread-item__last">
                    {txt(t.lastEn, t.lastFr, lang)}
                  </span>
                  {t.unread > 0 && !t.muted && (
                    <span className="thread-item__unread">{t.unread}</span>
                  )}
                  {t.muted && (
                    <FontAwesomeIcon icon={faBellSlash} className="thread-item__muted-icon" />
                  )}
                </div>
              </div>
            </button>

            {/* 3-dot menu */}
            <div className="thread-item__menu-wrap" ref={menuId === t.id ? menuRef : null}>
              <button
                className="thread-item__menu-btn"
                onClick={e => { e.stopPropagation(); setMenuId(prev => prev === t.id ? null : t.id) }}
              >
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </button>
              {menuId === t.id && (
                <div className="thread-item__dropdown">
                  <button onClick={() => { onMute(t.id); setMenuId(null) }}>
                    <FontAwesomeIcon icon={t.muted ? faBell : faBellSlash} />
                    <span>{t.muted ? txt('Unmute', 'Réactiver', lang) : txt('Mute', 'Désactiver', lang)}</span>
                  </button>
                  <button
                    className="danger"
                    onClick={() => { onDelete(t.id); setMenuId(null) }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    <span>{txt('Delete', 'Supprimer', lang)}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}