import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch, faPlus, faUsers,
  faLock, faGlobe, faBell,
  faBellSlash, faEllipsisVertical,
  faSignOut, faShield, faCheck,
  faXmark, faUserPlus, faClock
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import {
  myGroups, discoverGroups,
  groupInvitations, categories
} from '../../data/groupsData'
import CreateGroupModal from './CreateGroupModal'
import './Groups.css'

export default function Groups() {
  const { lang } = useLang()
  const { addToast } = useToast()

  const [tab, setTab] = useState('mine')   // mine | discover | invitations
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [joined, setJoined] = useState({})
  const [muted, setMuted] = useState({})
  const [menuId, setMenuId] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [myList, setMyList] = useState(myGroups)
  const [invitations, setInvitations] = useState(groupInvitations)
  const [loading, setLoading] = useState(false)

  const tabs = [
    { id: 'mine', labelEn: 'My Groups', labelFr: 'Mes groupes', count: myList.length },
    { id: 'discover', labelEn: 'Discover', labelFr: 'Découvrir', count: null },
    { id: 'invitations', labelEn: 'Invitations', labelFr: 'Invitations', count: invitations.length },
  ]

  const handleJoin = (group) => {
    setLoading(true)
    setTimeout(() => {
      setJoined(prev => ({ ...prev, [group.id]: true }))
      if (!group.isPublic) {
        addToast(
          txt('Request sent! Waiting for admin approval.', 'Demande envoyée ! En attente d\'approbation.', lang),
          'info'
        )
      } else {
        setMyList(prev => [...prev, { ...group, isAdmin: false, unread: 0, lastActivity: 'now', lastActivityFr: 'maintenant' }])
        addToast(
          txt(`You joined ${group.nameEn}!`, `Vous avez rejoint ${group.nameFr} !`, lang),
          'success'
        )
      }
      setLoading(false)
    }, 800)
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/groups/${group.id}/join
  }

  const handleLeave = (groupId) => {
    setMyList(prev => prev.filter(g => g.id !== groupId))
    setMenuId(null)
    addToast(txt('You left the group.', 'Vous avez quitté le groupe.', lang), 'info')
    // TODO: DELETE ${import.meta.env.VITE_API_BASE_URL}/groups/${groupId}/leave
  }

  const handleMute = (groupId) => {
    setMuted(prev => ({ ...prev, [groupId]: !prev[groupId] }))
    setMenuId(null)
    addToast(
      muted[groupId]
        ? txt('Group unmuted', 'Groupe réactivé', lang)
        : txt('Group muted', 'Groupe désactivé', lang),
      'success'
    )
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/groups/${groupId}/mute
  }

  const handleAcceptInvite = (inv) => {
    setMyList(prev => [...prev, { ...inv, isAdmin: false, unread: 0, lastActivity: 'now', lastActivityFr: 'maintenant' }])
    setInvitations(prev => prev.filter(i => i.id !== inv.id))
    addToast(txt(`Joined ${inv.nameEn}!`, `Rejoint ${inv.nameFr} !`, lang), 'success')
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/groups/${inv.id}/accept-invite
  }

  const handleDeclineInvite = (id) => {
    setInvitations(prev => prev.filter(i => i.id !== id))
    addToast(txt('Invitation declined.', 'Invitation refusée.', lang), 'info')
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/groups/${id}/decline-invite
  }

  const filteredDiscover = discoverGroups.filter(g => {
    const matchCat = category === 'all' || g.category === category
    const matchSearch = g.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      g.nameFr.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const filteredMine = myList.filter(g =>
    g.nameEn.toLowerCase().includes(search.toLowerCase()) ||
    g.nameFr.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="groups-page">

      {/* ── Header ── */}
      <div className="groups-header">
        <div className="groups-header__left">
          <h1 className="groups-header__title"
            data-en="Groups" data-fr="Groupes">
            {txt('Groups', 'Groupes', lang)}
          </h1>
          <p className="groups-header__sub"
            data-en="Work and grow together"
            data-fr="Travaillez et grandissez ensemble">
            {txt('Work and grow together', 'Travaillez et grandissez ensemble', lang)}
          </p>
        </div>
        <button className="groups-create-btn" onClick={() => setShowCreate(true)}>
          <FontAwesomeIcon icon={faPlus} />
          <span data-en="Create group" data-fr="Créer un groupe">
            {txt('Create group', 'Créer un groupe', lang)}
          </span>
        </button>
      </div>

      {/* ── Search ── */}
      <div className="groups-search">
        <FontAwesomeIcon icon={faSearch} className="groups-search__icon" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={txt('Search groups...', 'Rechercher des groupes...', lang)}
          className="groups-search__input"
        />
      </div>

      {/* ── Tabs ── */}
      <div className="groups-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`groups-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span data-en={t.labelEn} data-fr={t.labelFr}>
              {txt(t.labelEn, t.labelFr, lang)}
            </span>
            {t.count > 0 && (
              <span className="groups-tab__count">{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ════════════════════════════
          TAB — MY GROUPS
      ════════════════════════════ */}
      {tab === 'mine' && (
        <div className="groups-section">
          {filteredMine.length === 0 ? (
            <div className="groups-empty">
              <span>👥</span>
              <p>{txt('No groups yet', 'Aucun groupe pour l\'instant', lang)}</p>
              <button className="groups-empty__cta"
                onClick={() => setTab('discover')}>
                {txt('Discover groups', 'Découvrir des groupes', lang)}
              </button>
            </div>
          ) : (
            filteredMine.map(group => (
              <div key={group.id} className="my-group-card">

                {/* Cover */}
                <a href={`/groups/${group.id}`} className="my-group-card__cover-link">
                  <div
                    className="my-group-card__cover"
                    style={{ backgroundImage: `url(${group.cover})` }}
                  >
                    {!group.isPublic && (
                      <div className="my-group-card__private-badge">
                        <FontAwesomeIcon icon={faLock} />
                        {txt('Private', 'Privé', lang)}
                      </div>
                    )}
                    {group.isAdmin && (
                      <div className="my-group-card__admin-badge">
                        <FontAwesomeIcon icon={faShield} />
                        Admin
                      </div>
                    )}
                  </div>
                </a>

                {/* Info */}
                <div className="my-group-card__body">
                  <div className="my-group-card__avatar-wrap">
                    <img src={group.avatar} alt={group.nameEn} />
                  </div>
                  <div className="my-group-card__info">
                    <a href={`/groups/${group.id}`} className="my-group-card__name">
                      {txt(group.nameEn, group.nameFr, lang)}
                    </a>
                    <div className="my-group-card__meta">
                      <span>
                        <FontAwesomeIcon icon={faUsers} />
                        {group.membersLabel} {txt('members', 'membres', lang)}
                      </span>
                      <span className="my-group-card__dot">·</span>
                      <span>
                        <FontAwesomeIcon icon={faClock} />
                        {txt(group.lastActivity, group.lastActivityFr, lang)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="my-group-card__actions">
                    {group.unread > 0 && (
                      <span className="my-group-card__unread">{group.unread}</span>
                    )}

                    <a
                      href={`/groups/${group.id}`}
                      className="my-group-card__view-btn"
                    >
                      {txt('View', 'Voir', lang)}
                    </a>

                    {/* 3-dot menu */}
                    <div className="my-group-card__menu-wrap">
                      <button
                        className="my-group-card__menu-btn"
                        onClick={() => setMenuId(prev => prev === group.id ? null : group.id)}
                      >
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                      </button>
                      {menuId === group.id && (
                        <div className="groups-dropdown">
                          <button
                            className="groups-dropdown__item"
                            onClick={() => handleMute(group.id)}
                          >
                            <FontAwesomeIcon icon={muted[group.id] ? faBell : faBellSlash} />
                            <span>
                              {muted[group.id]
                                ? txt('Unmute', 'Réactiver', lang)
                                : txt('Mute', 'Désactiver', lang)}
                            </span>
                          </button>
                          <button
                            className="groups-dropdown__item groups-dropdown__item--danger"
                            onClick={() => handleLeave(group.id)}
                          >
                            <FontAwesomeIcon icon={faSignOut} />
                            <span>{txt('Leave group', 'Quitter le groupe', lang)}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      )
      }

      {/* ════════════════════════════
          TAB — DISCOVER
      ════════════════════════════ */}
      {
        tab === 'discover' && (
          <div className="groups-section">

            {/* Category filters */}
            <div className="groups-categories">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`groups-cat-btn ${category === cat.id ? 'active' : ''}`}
                  onClick={() => setCategory(cat.id)}
                >
                  {txt(cat.labelEn, cat.labelFr, lang)}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="discover-grid">
              {filteredDiscover.map(group => (
                <div key={group.id} className="discover-card">

                  {/* Cover */}
                  <a href={`/groups/${group.id}`} className="discover-card__cover-link">
                    <div
                      className="discover-card__cover"
                      style={{ backgroundImage: `url(${group.cover})` }}
                    >
                      <div className="discover-card__cover-overlay" />
                      {!group.isPublic && (
                        <div className="discover-card__private">
                          <FontAwesomeIcon icon={faLock} />
                          {txt('Private', 'Privé', lang)}
                        </div>
                      )}
                    </div>
                  </a>

                  {/* Avatar */}
                  <div className="discover-card__avatar-wrap">
                    <img src={group.avatar} alt={group.nameEn} />
                  </div>

                  {/* Info */}
                  <div className="discover-card__body">
                    <a href={`/groups/${group.id}`} className="discover-card__name">
                      {txt(group.nameEn, group.nameFr, lang)}
                    </a>
                    <p className="discover-card__desc">
                      {txt(group.descShortEn, group.descShortFr, lang)}
                    </p>
                    <div className="discover-card__stats">
                      <span>
                        <FontAwesomeIcon icon={faUsers} />
                        {group.membersLabel} {txt('members', 'membres', lang)}
                      </span>
                      {group.mutualMembers > 0 && (
                        <span className="discover-card__mutual">
                          · {group.mutualMembers} {txt('mutual', 'en commun', lang)}
                        </span>
                      )}
                    </div>

                    <button
                      className={`discover-card__join-btn ${joined[group.id] ? 'sent' : ''}`}
                      onClick={() => !joined[group.id] && handleJoin(group)}
                      disabled={joined[group.id] || loading}
                    >
                      {joined[group.id] ? (
                        <>
                          <FontAwesomeIcon icon={group.isPublic ? faCheck : faClock} />
                          {group.isPublic
                            ? txt('Joined', 'Rejoint', lang)
                            : txt('Requested', 'Demandé', lang)}
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faUserPlus} />
                          {group.isPublic
                            ? txt('Join', 'Rejoindre', lang)
                            : txt('Request to join', 'Demander', lang)}
                        </>
                      )}
                    </button>
                  </div>

                </div>
              ))}

              {filteredDiscover.length === 0 && (
                <div className="groups-empty" style={{ gridColumn: '1/-1' }}>
                  <span>🔍</span>
                  <p>{txt('No groups found', 'Aucun groupe trouvé', lang)}</p>
                </div>
              )}
            </div>
          </div>
        )
      }

      {/* ════════════════════════════
          TAB — INVITATIONS
      ════════════════════════════ */}
      {
        tab === 'invitations' && (
          <div className="groups-section">
            {invitations.length === 0 ? (
              <div className="groups-empty">
                <span>📬</span>
                <p>{txt('No pending invitations', 'Aucune invitation en attente', lang)}</p>
              </div>
            ) : (
              invitations.map(inv => (
                <div key={inv.id} className="invitation-card">

                  {/* Cover */}
                  <div
                    className="invitation-card__cover"
                    style={{ backgroundImage: `url(${inv.cover})` }}
                  >
                    <div className="invitation-card__cover-overlay" />
                  </div>

                  <div className="invitation-card__body">
                    <div className="invitation-card__avatar-wrap">
                      <img src={inv.avatar} alt={inv.nameEn} />
                    </div>

                    <div className="invitation-card__info">
                      <a href={`/groups/${inv.id}`} className="invitation-card__name">
                        {txt(inv.nameEn, inv.nameFr, lang)}
                      </a>
                      <div className="invitation-card__meta">
                        <FontAwesomeIcon icon={faUsers} />
                        {inv.membersLabel} {txt('members', 'membres', lang)}
                      </div>

                      {/* Invited by */}
                      <div className="invitation-card__invited-by">
                        <img src={inv.invitedByAvatar} alt={inv.invitedBy} />
                        <span>
                          {txt('Invited by', 'Invité par', lang)}{' '}
                          <strong>{inv.invitedBy}</strong>
                        </span>
                        {inv.mutualMembers > 0 && (
                          <span className="invitation-card__mutual">
                            · {inv.mutualMembers} {txt('mutual', 'en commun', lang)}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="invitation-card__actions">
                        <button
                          className="inv-btn inv-btn--accept"
                          onClick={() => handleAcceptInvite(inv)}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                          {txt('Accept', 'Accepter', lang)}
                        </button>
                        <button
                          className="inv-btn inv-btn--decline"
                          onClick={() => handleDeclineInvite(inv.id)}
                        >
                          <FontAwesomeIcon icon={faXmark} />
                          {txt('Decline', 'Refuser', lang)}
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        )
      }

      {/* ── Create Group Modal ── */}
      {
        showCreate && (
          <CreateGroupModal
            onClose={() => setShowCreate(false)}
            onCreate={(newGroup) => {
              setMyList(prev => [...prev, newGroup])
              setShowCreate(false)
              addToast(
                txt('Group created successfully!', 'Groupe créé avec succès !', lang),
                'success'
              )
            }}
            lang={lang}
          />
        )
      }

    </div >
  )
}