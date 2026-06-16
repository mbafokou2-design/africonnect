import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft, faUsers, faLock,
  faGlobe, faShield, faBell,
  faBellSlash, faShare, faEllipsisVertical,
  faUserPlus, faCheck, faSearch,
  faSignOut, faFlag
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import PostCard from '../../components/feed/PostCard'
import PostComposer from '../../components/composer/PostComposer'
import {
  myGroups, discoverGroups,
  groupPosts, groupMembers
} from '../../data/groupsData'
import './GroupDetail.css'

const allGroups = [...myGroups, ...discoverGroups]

export default function GroupDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { lang }     = useLang()
  const { addToast } = useToast()

  const group = allGroups.find(g => g.id === Number(id)) || allGroups[0]

  const isMember = myGroups.some(g => g.id === group.id)

  const [tab,       setTab]     = useState('feed')   // feed | members | about
  const [joined,    setJoined]  = useState(isMember)
  const [requested, setRequested] = useState(false)
  const [muted,     setMuted]   = useState(false)
  const [menuOpen,  setMenuOpen]= useState(false)
  const [memberSearch, setMemberSearch] = useState('')

  const handleJoin = () => {
    if (group.isPublic) {
      setJoined(true)
      addToast(
        txt(`You joined ${group.nameEn}!`, `Vous avez rejoint ${group.nameFr} !`, lang),
        'success'
      )
    } else {
      setRequested(true)
      addToast(
        txt('Request sent! Waiting for admin approval.', 'Demande envoyée !', lang),
        'info'
      )
    }
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/groups/${group.id}/join
  }

  const handleLeave = () => {
    setJoined(false)
    setMenuOpen(false)
    addToast(txt('You left the group.', 'Vous avez quitté le groupe.', lang), 'info')
    // TODO: DELETE ${import.meta.env.VITE_API_BASE_URL}/groups/${group.id}/leave
  }

  const handleShare = () => {
    const url = `${window.location.origin}/groups/${group.id}`
    if (navigator.share) {
      navigator.share({ title: group.nameEn, url })
    } else {
      navigator.clipboard.writeText(url)
      addToast(txt('Link copied!', 'Lien copié !', lang), 'success')
    }
  }

  const filteredMembers = groupMembers.filter(m =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase())
  )

  const tabs = [
    { id:'feed',    labelEn:'Feed',    labelFr:'Fil'      },
    { id:'members', labelEn:'Members', labelFr:'Membres'  },
    { id:'about',   labelEn:'About',   labelFr:'À propos' },
  ]

  return (
    <div className="gd-page">

      {/* ── Back button ── */}
      <button className="gd-back" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>{txt('Groups', 'Groupes', lang)}</span>
      </button>

      {/* ── Cover ── */}
      <div className="gd-cover">
        <div
          className="gd-cover__bg"
          style={{ backgroundImage: `url(${group.cover})` }}
        >
          <div className="gd-cover__overlay" />
        </div>

        {/* Group avatar */}
        <div className="gd-cover__avatar">
          <img src={group.avatar} alt={group.nameEn} />
          {group.isAdmin && (
            <div className="gd-cover__admin-badge">
              <FontAwesomeIcon icon={faShield} />
            </div>
          )}
        </div>
      </div>

      {/* ── Group Info ── */}
      <div className="gd-info-card">
        <div className="gd-info-card__top">
          <div>
            <h1 className="gd-info-card__name">
              {txt(group.nameEn, group.nameFr, lang)}
            </h1>
            <div className="gd-info-card__meta">
              <span>
                <FontAwesomeIcon icon={group.isPublic ? faGlobe : faLock} />
                {group.isPublic
                  ? txt('Public group', 'Groupe public', lang)
                  : txt('Private group', 'Groupe privé', lang)}
              </span>
              <span className="gd-meta-dot">·</span>
              <span>
                <FontAwesomeIcon icon={faUsers} />
                {group.membersLabel} {txt('members', 'membres', lang)}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="gd-info-card__actions">

            {/* Join / Joined */}
            {!joined && !requested && (
              <button className="gd-join-btn" onClick={handleJoin}>
                <FontAwesomeIcon icon={faUserPlus} />
                {group.isPublic
                  ? txt('Join', 'Rejoindre', lang)
                  : txt('Request', 'Demander', lang)}
              </button>
            )}
            {requested && !joined && (
              <button className="gd-join-btn gd-join-btn--requested" disabled>
                <FontAwesomeIcon icon={faCheck} />
                {txt('Requested', 'Demandé', lang)}
              </button>
            )}
            {joined && (
              <button className="gd-join-btn gd-join-btn--joined" disabled>
                <FontAwesomeIcon icon={faCheck} />
                {txt('Joined', 'Rejoint', lang)}
              </button>
            )}

            {/* Share */}
            <button className="gd-icon-btn" onClick={handleShare}
              title={txt('Share', 'Partager', lang)}>
              <FontAwesomeIcon icon={faShare} />
            </button>

            {/* Mute */}
            <button
              className={`gd-icon-btn ${muted ? 'gd-icon-btn--muted' : ''}`}
              onClick={() => {
                setMuted(p => !p)
                addToast(
                  muted
                    ? txt('Group unmuted', 'Groupe réactivé', lang)
                    : txt('Group muted', 'Groupe désactivé', lang),
                  'success'
                )
              }}
              title={muted ? txt('Unmute', 'Réactiver', lang) : txt('Mute', 'Désactiver', lang)}
            >
              <FontAwesomeIcon icon={muted ? faBellSlash : faBell} />
            </button>

            {/* More menu */}
            <div className="gd-menu-wrap">
              <button className="gd-icon-btn" onClick={() => setMenuOpen(p => !p)}>
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </button>
              {menuOpen && (
                <div className="gd-dropdown">
                  <button className="gd-dropdown__item"
                    onClick={() => setMenuOpen(false)}>
                    <FontAwesomeIcon icon={faFlag} />
                    <span>{txt('Report group', 'Signaler le groupe', lang)}</span>
                  </button>
                  {joined && (
                    <button
                      className="gd-dropdown__item gd-dropdown__item--danger"
                      onClick={handleLeave}
                    >
                      <FontAwesomeIcon icon={faSignOut} />
                      <span>{txt('Leave group', 'Quitter le groupe', lang)}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="gd-info-card__desc">
          {txt(group.descEn, group.descFr, lang)}
        </p>
      </div>

      {/* ── Tabs ── */}
      <div className="gd-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`gd-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {txt(t.labelEn, t.labelFr, lang)}
          </button>
        ))}
      </div>

      {/* ════════ TAB: FEED ════════ */}
      {tab === 'feed' && (
        <div className="gd-feed">
          {/* Composer only if member */}
          {joined && (
            <div className="gd-composer-wrap">
              <PostComposer />
            </div>
          )}

          {!joined && (
            <div className="gd-join-prompt">
              <FontAwesomeIcon icon={faUsers} />
              <p>{txt('Join the group to post and comment.', 'Rejoignez le groupe pour publier et commenter.', lang)}</p>
              <button className="gd-join-prompt__btn" onClick={handleJoin}>
                {txt('Join now', 'Rejoindre maintenant', lang)}
              </button>
            </div>
          )}

          {groupPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* ════════ TAB: MEMBERS ════════ */}
      {tab === 'members' && (
        <div className="gd-members">

          {/* Search */}
          <div className="gd-members__search">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              value={memberSearch}
              onChange={e => setMemberSearch(e.target.value)}
              placeholder={txt('Search members...', 'Rechercher membres...', lang)}
            />
          </div>

          {/* Admins */}
          <div className="gd-members__group">
            <h3 className="gd-members__label">
              <FontAwesomeIcon icon={faShield} />
              {txt('Admins', 'Administrateurs', lang)}
            </h3>
            {filteredMembers
              .filter(m => m.role === 'admin')
              .map(m => (
                <MemberRow key={m.id} member={m} lang={lang} />
              ))}
          </div>

          {/* Members */}
          <div className="gd-members__group">
            <h3 className="gd-members__label">
              <FontAwesomeIcon icon={faUsers} />
              {txt('Members', 'Membres', lang)}
              <span className="gd-members__count">
                {filteredMembers.filter(m => m.role === 'member').length}
              </span>
            </h3>
            {filteredMembers
              .filter(m => m.role === 'member')
              .map(m => (
                <MemberRow key={m.id} member={m} lang={lang} />
              ))}
          </div>

        </div>
      )}

      {/* ════════ TAB: ABOUT ════════ */}
      {tab === 'about' && (
        <div className="gd-about">

          <div className="gd-about__card">
            <h3 className="gd-about__section-title">
              {txt('About this group', 'À propos de ce groupe', lang)}
            </h3>
            <p className="gd-about__desc">
              {txt(group.descEn, group.descFr, lang)}
            </p>
          </div>

          <div className="gd-about__card">
            <h3 className="gd-about__section-title">
              {txt('Group details', 'Détails du groupe', lang)}
            </h3>
            <div className="gd-about__rows">
              <div className="gd-about__row">
                <FontAwesomeIcon icon={group.isPublic ? faGlobe : faLock} />
                <div>
                  <p className="gd-about__row-title">
                    {group.isPublic
                      ? txt('Public group', 'Groupe public', lang)
                      : txt('Private group', 'Groupe privé', lang)}
                  </p>
                  <p className="gd-about__row-sub">
                    {group.isPublic
                      ? txt('Anyone can find and join this group.', 'N\'importe qui peut trouver et rejoindre ce groupe.', lang)
                      : txt('Only members approved by admins can join.', 'Seuls les membres approuvés par les admins peuvent rejoindre.', lang)}
                  </p>
                </div>
              </div>
              <div className="gd-about__row">
                <FontAwesomeIcon icon={faUsers} />
                <div>
                  <p className="gd-about__row-title">
                    {group.membersLabel} {txt('members', 'membres', lang)}
                  </p>
                  <p className="gd-about__row-sub">
                    {txt('Active community', 'Communauté active', lang)}
                  </p>
                </div>
              </div>
              <div className="gd-about__row">
                <FontAwesomeIcon icon={faShield} />
                <div>
                  <p className="gd-about__row-title">
                    {txt('Created by', 'Créé par', lang)} {group.createdBy}
                  </p>
                  <p className="gd-about__row-sub">
                    {group.createdAt}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Admins */}
          <div className="gd-about__card">
            <h3 className="gd-about__section-title">
              {txt('Admins', 'Administrateurs', lang)}
            </h3>
            {groupMembers
              .filter(m => m.role === 'admin')
              .map(m => (
                <MemberRow key={m.id} member={m} lang={lang} />
              ))}
          </div>

        </div>
      )}

    </div>
  )
}

function MemberRow({ member, lang }) {
  return (
    <a href={`/profile/${member.id}`} className="gd-member-row">
      <div className="gd-member-row__avatar-wrap">
        <img src={member.avatar} alt={member.name} />
        {member.role === 'admin' && (
          <div className="gd-member-row__admin-icon">
            <FontAwesomeIcon icon={faShield} />
          </div>
        )}
      </div>
      <div className="gd-member-row__info">
        <span className="gd-member-row__name">{member.name}</span>
        <span className="gd-member-row__title">
          {txt(member.titleEn, member.titleFr, lang)}
        </span>
      </div>
      {member.role === 'admin' && (
        <span className="gd-member-row__role-badge">Admin</span>
      )}
    </a>
  )
}