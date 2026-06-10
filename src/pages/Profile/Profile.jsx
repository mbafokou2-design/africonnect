import { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGear, faPen, faMapPin, faBriefcase,
  faGraduationCap, faLink, faUsers,
  faPlus, faEllipsis, faTrash, faXmark,
  faSpinner, faCamera
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import PostCard from '../../components/feed/PostCard'
import './Profile.css'

// TODO: fetch from ${import.meta.env.VITE_API_BASE_URL}/profile/me
const initialProfile = {
  name: 'Jean Dupont',
  titleEn: 'Full Stack Developer · AfriConnect',
  titleFr: 'Développeur Full Stack · AfriConnect',
  location: 'Yaoundé, Cameroun',
  connections: 342,
  bioEn: "Passionate full-stack developer building digital solutions for Africa. 5+ years of experience in React, Node.js and mobile development.",
  bioFr: "Développeur full-stack passionné construisant des solutions numériques pour l'Afrique. 5+ ans d'expérience en React, Node.js et développement mobile.",
  avatar: 'https://i.pravatar.cc/96?img=11',
  cover: null,
  website: 'https://stevodigital.com',
  experience: [
    { id:1, roleEn:'Full Stack Developer', roleF:'Développeur Full Stack', co:'AfriConnect',    period:'2023 – Present', periodF:'2023 – Présent' },
    { id:2, roleEn:'Frontend Developer',   roleF:'Développeur Frontend',   co:'Orange Cameroun', period:'2021 – 2023',   periodF:'2021 – 2023'   },
  ],
  education: [
    { id:1, degreeEn:'Computer Science', degreeF:'Informatique', school:'Université de Yaoundé I', period:'2017 – 2021' },
  ],
}

// Fake own posts — TODO: fetch from API
const myPosts = [
  {
    id: 101,
    user: { name:'Jean Dupont', avatar:'https://i.pravatar.cc/48?img=11', titleEn:'Full Stack Developer', titleFr:'Développeur Full Stack', verified: true },
    timeEn:'1d ago', timeFr:'Il y a 1j', visibility:'public',
    contentEn:"Excited to share that AfriConnect just hit 10,000 users! Thank you all for the support 🙏 #AfriConnect #Africa",
    contentFr:"Ravi de partager qu'AfriConnect vient d'atteindre 10 000 utilisateurs ! Merci à tous 🙏 #AfriConnect #Afrique",
    image: null,
    reactions: { like: 210, love: 55, clap: 33, total: 298 },
    commentsCount: 47, sharesCount: 32,
    tags: ['AfriConnect', 'Africa'],
  },
  {
    id: 102,
    user: { name:'Jean Dupont', avatar:'https://i.pravatar.cc/48?img=11', titleEn:'Full Stack Developer', titleFr:'Développeur Full Stack', verified: true },
    timeEn:'3d ago', timeFr:'Il y a 3j', visibility:'public',
    contentEn:"Just published a new article on building scalable React apps for low-bandwidth African markets. Link in bio!",
    contentFr:"Je viens de publier un article sur la création d'apps React évolutives pour les marchés africains à faible bande passante.",
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
    reactions: { like: 98, love: 20, clap: 10, total: 128 },
    commentsCount: 24, sharesCount: 15,
    tags: ['React', 'WebDev'],
  },
]

export default function Profile() {
  const { lang }  = useLang()
  const { addToast } = useToast()
  const isMobile  = window.innerWidth <= 768

  const [profile,    setProfile]    = useState(initialProfile)
  const [editOpen,   setEditOpen]   = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [editData,   setEditData]   = useState(profile)
  const [activeTab,  setActiveTab]  = useState('posts') // posts | about
  const avatarRef = useRef()
  const coverRef  = useRef()

  const openEdit = () => {
    setEditData(profile)
    setEditOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // TODO: PUT ${import.meta.env.VITE_API_BASE_URL}/profile/me
      await new Promise(r => setTimeout(r, 1200)) // fake delay
      // Simulate backend error 30% of time for demo
      if (Math.random() < 0.3) throw new Error('API not connected')
      setProfile(editData)
      setEditOpen(false)
      addToast(
        txt('Profile updated!', 'Profil mis à jour !', lang),
        'success'
      )
    } catch (e) {
      addToast(
        txt('Could not connect to server. Changes saved locally.', 'Impossible de se connecter au serveur.', lang),
        'error'
      )
      // Still update locally
      setProfile(editData)
      setEditOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setEditData(p => ({ ...p, avatar: url }))
    // TODO: upload to ${import.meta.env.VITE_API_BASE_URL}/media/upload
  }

  const handleDeletePost = (id) => {
    addToast(txt('Post deleted', 'Post supprimé', lang), 'success')
    // TODO: DELETE ${import.meta.env.VITE_API_BASE_URL}/posts/${id}
  }

  const shareProfile = () => {
    const url = `${window.location.origin}/profile`
    if (navigator.share) {
      navigator.share({ title: profile.name, url })
    } else {
      navigator.clipboard.writeText(url)
      addToast(txt('Profile link copied!', 'Lien copié !', lang), 'success')
    }
  }

  const EditForm = (
    <div className="profile-edit-form">
      {/* Avatar */}
      <div className="profile-edit-form__avatar-row">
        <div className="profile-edit-form__avatar-wrap">
          <img src={editData.avatar} alt="avatar" />
          <button className="profile-edit-form__avatar-btn"
            onClick={() => avatarRef.current.click()}>
            <FontAwesomeIcon icon={faCamera} />
          </button>
          <input ref={avatarRef} type="file" accept="image/*"
            style={{ display:'none' }} onChange={handleAvatarChange} />
        </div>
        <p className="profile-edit-form__avatar-hint">
          {txt('Click to change photo', 'Cliquez pour changer la photo', lang)}
        </p>
      </div>

      {/* Fields */}
      {[
        { label: txt('Full Name','Nom complet',lang),      key:'name',     type:'text' },
        { label: txt('Title (EN)','Titre (EN)',lang),       key:'titleEn',  type:'text' },
        { label: txt('Title (FR)','Titre (FR)',lang),       key:'titleFr',  type:'text' },
        { label: txt('Location','Localisation',lang),       key:'location', type:'text' },
        { label: txt('Website','Site web',lang),            key:'website',  type:'url'  },
      ].map(f => (
        <div key={f.key} className="profile-edit-form__field">
          <label>{f.label}</label>
          <input
            type={f.type}
            value={editData[f.key] || ''}
            onChange={e => setEditData(p => ({ ...p, [f.key]: e.target.value }))}
          />
        </div>
      ))}

      {/* Bio */}
      <div className="profile-edit-form__field">
        <label>{txt('Bio (EN)','Bio (EN)',lang)}</label>
        <textarea rows={3} value={editData.bioEn}
          onChange={e => setEditData(p => ({ ...p, bioEn: e.target.value }))} />
      </div>
      <div className="profile-edit-form__field">
        <label>{txt('Bio (FR)','Bio (FR)',lang)}</label>
        <textarea rows={3} value={editData.bioFr}
          onChange={e => setEditData(p => ({ ...p, bioFr: e.target.value }))} />
      </div>

      {/* Save button */}
      <button className="profile-edit-form__save" onClick={handleSave} disabled={saving}>
        {saving
          ? <FontAwesomeIcon icon={faSpinner} spin />
          : txt('Save changes', 'Enregistrer', lang)}
      </button>
    </div>
  )

  return (
    <div className="profile-page">

      {/* ── Cover + Avatar ── */}
      <div className="profile-cover">
        <div className="profile-cover__bg"
          style={profile.cover ? { backgroundImage:`url(${profile.cover})` } : {}}>
          <button className="profile-cover__change-cover"
            onClick={() => coverRef.current.click()}>
            <FontAwesomeIcon icon={faCamera} />
            {txt('Change cover', 'Changer couverture', lang)}
          </button>
          <input ref={coverRef} type="file" accept="image/*"
            style={{ display:'none' }}
            onChange={e => {
              const f = e.target.files[0]
              if (f) setProfile(p => ({ ...p, cover: URL.createObjectURL(f) }))
            }}
          />
        </div>
        <div className="profile-cover__bottom">
          <div className="profile-cover__avatar-wrap">
            <img src={profile.avatar} alt={profile.name} />
          </div>
        </div>
      </div>

      {/* ── Info Card ── */}
      <div className="profile-info-card">
        <div className="profile-info-card__header">
          <div>
            <h1 className="profile-info-card__name">{profile.name}</h1>
            <p className="profile-info-card__title">
              {txt(profile.titleEn, profile.titleFr, lang)}
            </p>
            <div className="profile-info-card__meta">
              <span><FontAwesomeIcon icon={faMapPin} /> {profile.location}</span>
              <span><FontAwesomeIcon icon={faUsers} /> {profile.connections} {txt('connections','connexions',lang)}</span>
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noreferrer">
                  <FontAwesomeIcon icon={faLink} /> {profile.website.replace('https://','').replace('http://','')}
                </a>
              )}
            </div>
          </div>

          {/* Desktop edit button */}
          <div className="profile-info-card__btns">
            <button className="profile-edit-btn profile-edit-btn--desktop" onClick={openEdit}>
              <FontAwesomeIcon icon={faPen} />
              {txt('Edit profile', 'Modifier profil', lang)}
            </button>
            {/* Mobile gear → settings */}
            <a href="/settings" className="profile-gear-btn">
              <FontAwesomeIcon icon={faGear} />
            </a>
          </div>
        </div>

        <div className="profile-info-card__actions">
          <button className="profile-btn profile-btn--primary">
            {txt('Open to work', 'Ouvert aux opportunités', lang)}
          </button>
          <button className="profile-btn profile-btn--outline" onClick={shareProfile}>
            <FontAwesomeIcon icon={faLink} />
            {txt('Share profile', 'Partager profil', lang)}
          </button>
          {/* Mobile edit */}
          <a href="/profile/edit" className="profile-btn profile-btn--outline profile-edit-btn--mobile">
            <FontAwesomeIcon icon={faPen} />
            {txt('Edit', 'Modifier', lang)}
          </a>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          {txt('Posts', 'Publications', lang)}
        </button>
        <button
          className={`profile-tab ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          {txt('About', 'À propos', lang)}
        </button>
      </div>

      {/* ── Posts Tab ── */}
      {activeTab === 'posts' && (
        <div className="profile-posts">
          {myPosts.map(post => (
            <div key={post.id} className="profile-post-wrap">
              <PostCard post={post} />
              {/* Own post actions */}
              <div className="profile-post-actions">
                <button className="profile-post-btn profile-post-btn--edit"
                  onClick={openEdit}>
                  <FontAwesomeIcon icon={faPen} />
                  {txt('Edit post', 'Modifier', lang)}
                </button>
                <button className="profile-post-btn profile-post-btn--delete"
                  onClick={() => handleDeletePost(post.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                  {txt('Delete', 'Supprimer', lang)}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── About Tab ── */}
      {activeTab === 'about' && (
        <div className="profile-about">
          <div className="profile-section">
            <h2 className="profile-section__title">
              {txt('About', 'À propos', lang)}
            </h2>
            <p className="profile-section__text">
              {txt(profile.bioEn, profile.bioFr, lang)}
            </p>
          </div>

          <div className="profile-section">
            <h2 className="profile-section__title">
              {txt('Experience', 'Expérience', lang)}
            </h2>
            {profile.experience.map(e => (
              <div key={e.id} className="profile-timeline-item">
                <div className="profile-timeline-item__icon">
                  <FontAwesomeIcon icon={faBriefcase} />
                </div>
                <div>
                  <p className="profile-timeline-item__role">{txt(e.roleEn,e.roleF,lang)}</p>
                  <p className="profile-timeline-item__co">{e.co}</p>
                  <p className="profile-timeline-item__period">{txt(e.period,e.periodF,lang)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="profile-section">
            <h2 className="profile-section__title">
              {txt('Education', 'Formation', lang)}
            </h2>
            {profile.education.map(e => (
              <div key={e.id} className="profile-timeline-item">
                <div className="profile-timeline-item__icon">
                  <FontAwesomeIcon icon={faGraduationCap} />
                </div>
                <div>
                  <p className="profile-timeline-item__role">{txt(e.degreeEn,e.degreeF,lang)}</p>
                  <p className="profile-timeline-item__co">{e.school}</p>
                  <p className="profile-timeline-item__period">{e.period}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Desktop Edit Modal ── */}
      {editOpen && !isMobile && (
        <div className="profile-modal-overlay" onClick={() => setEditOpen(false)}>
          <div className="profile-modal" onClick={e => e.stopPropagation()}>
            <div className="profile-modal__header">
              <h2>{txt('Edit Profile', 'Modifier le profil', lang)}</h2>
              <button className="profile-modal__close" onClick={() => setEditOpen(false)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className="profile-modal__body">
              {EditForm}
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Edit — inline drawer ── */}
      {editOpen && isMobile && (
        <div className="profile-mobile-edit">
          <div className="profile-mobile-edit__header">
            <button onClick={() => setEditOpen(false)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <h2>{txt('Edit Profile', 'Modifier le profil', lang)}</h2>
            <div />
          </div>
          {EditForm}
        </div>
      )}

    </div>
  )
}