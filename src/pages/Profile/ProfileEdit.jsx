import { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft, faCamera, faSpinner,
  faBriefcase, faGraduationCap, faPlus, faTrash
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import { useToast } from '../../components/ui/Toast'
import './ProfileEdit.css'

// TODO: fetch from ${import.meta.env.VITE_API_BASE_URL}/profile/me
const initialProfile = {
  name: 'Jean Dupont',
  titleEn: 'Full Stack Developer · AfriConnect',
  titleFr: 'Développeur Full Stack · AfriConnect',
  location: 'Yaoundé, Cameroun',
  website: 'https://stevodigital.com',
  bioEn: "Passionate full-stack developer building digital solutions for Africa.",
  bioFr: "Développeur full-stack passionné construisant des solutions numériques pour l'Afrique.",
  avatar: 'https://i.pravatar.cc/96?img=11',
  cover: null,
  experience: [
    { id:1, roleEn:'Full Stack Developer', roleF:'Développeur Full Stack', co:'AfriConnect',     period:'2023 – Present' },
    { id:2, roleEn:'Frontend Developer',   roleF:'Développeur Frontend',   co:'Orange Cameroun', period:'2021 – 2023'   },
  ],
  education: [
    { id:1, degreeEn:'Computer Science', degreeF:'Informatique', school:'Université de Yaoundé I', period:'2017 – 2021' },
  ],
}

export default function ProfileEdit() {
  const { lang }     = useLang()
  const { addToast } = useToast()
  const [data,    setData]    = useState(initialProfile)
  const [saving,  setSaving]  = useState(false)
  const [section, setSection] = useState('basic') // basic | bio | experience | education
  const avatarRef = useRef()
  const coverRef  = useRef()

  const set = (key, val) => setData(p => ({ ...p, [key]: val }))

  const handleAvatarChange = (e) => {
    const f = e.target.files[0]
    if (f) set('avatar', URL.createObjectURL(f))
    // TODO: upload to ${import.meta.env.VITE_API_BASE_URL}/media/upload
  }

  const handleCoverChange = (e) => {
    const f = e.target.files[0]
    if (f) set('cover', URL.createObjectURL(f))
    // TODO: upload to ${import.meta.env.VITE_API_BASE_URL}/media/upload
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await new Promise(r => setTimeout(r, 1200))
      // TODO: PUT ${import.meta.env.VITE_API_BASE_URL}/profile/me
      if (Math.random() < 0.3) throw new Error('API not connected')
      addToast(txt('Profile updated!', 'Profil mis à jour !', lang), 'success')
      window.history.back()
    } catch {
      addToast(
        txt('Server not connected. Saved locally.', 'Serveur non connecté. Sauvegardé localement.', lang),
        'error'
      )
      window.history.back()
    } finally {
      setSaving(false)
    }
  }

  const addExperience = () => {
    setData(p => ({
      ...p,
      experience: [...p.experience, { id: Date.now(), roleEn:'', roleF:'', co:'', period:'' }]
    }))
  }

  const removeExperience = (id) => {
    setData(p => ({ ...p, experience: p.experience.filter(e => e.id !== id) }))
  }

  const updateExp = (id, key, val) => {
    setData(p => ({
      ...p,
      experience: p.experience.map(e => e.id === id ? { ...e, [key]: val } : e)
    }))
  }

  const addEducation = () => {
    setData(p => ({
      ...p,
      education: [...p.education, { id: Date.now(), degreeEn:'', degreeF:'', school:'', period:'' }]
    }))
  }

  const removeEducation = (id) => {
    setData(p => ({ ...p, education: p.education.filter(e => e.id !== id) }))
  }

  const updateEdu = (id, key, val) => {
    setData(p => ({
      ...p,
      education: p.education.map(e => e.id === id ? { ...e, [key]: val } : e)
    }))
  }

  const sections = [
    { id:'basic',      labelEn:'Basic Info',   labelFr:'Infos de base'  },
    { id:'bio',        labelEn:'Bio',           labelFr:'Bio'            },
    { id:'experience', labelEn:'Experience',    labelFr:'Expérience'     },
    { id:'education',  labelEn:'Education',     labelFr:'Formation'      },
  ]

  return (
    <div className="pedit-page">

      {/* ── Sticky Header ── */}
      <div className="pedit-header">
        <button className="pedit-header__back" onClick={() => window.history.back()}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1 className="pedit-header__title">
          {txt('Edit Profile', 'Modifier le profil', lang)}
        </h1>
        <button
          className="pedit-header__save"
          onClick={handleSave}
          disabled={saving}
        >
          {saving
            ? <FontAwesomeIcon icon={faSpinner} spin />
            : txt('Save', 'Enregistrer', lang)
          }
        </button>
      </div>

      {/* ── Cover + Avatar ── */}
      <div className="pedit-cover">
        <div
          className="pedit-cover__bg"
          style={data.cover ? { backgroundImage:`url(${data.cover})` } : {}}
        >
          <button
            className="pedit-cover__btn"
            onClick={() => coverRef.current.click()}
          >
            <FontAwesomeIcon icon={faCamera} />
          </button>
          <input ref={coverRef} type="file" accept="image/*"
            style={{ display:'none' }} onChange={handleCoverChange} />
        </div>
        <div className="pedit-cover__avatar-wrap">
          <img src={data.avatar} alt={data.name} />
          <button
            className="pedit-cover__avatar-btn"
            onClick={() => avatarRef.current.click()}
          >
            <FontAwesomeIcon icon={faCamera} />
          </button>
          <input ref={avatarRef} type="file" accept="image/*"
            style={{ display:'none' }} onChange={handleAvatarChange} />
        </div>
      </div>

      {/* ── Section tabs ── */}
      <div className="pedit-tabs">
        {sections.map(s => (
          <button
            key={s.id}
            className={`pedit-tab ${section === s.id ? 'active' : ''}`}
            onClick={() => setSection(s.id)}
          >
            {txt(s.labelEn, s.labelFr, lang)}
          </button>
        ))}
      </div>

      {/* ── Basic Info ── */}
      {section === 'basic' && (
        <div className="pedit-section">
          <h2 className="pedit-section__title">
            {txt('Basic Info', 'Informations de base', lang)}
          </h2>
          {[
            { label: txt('Full Name',     'Nom complet',    lang), key:'name',     type:'text' },
            { label: txt('Title (EN)',    'Titre (EN)',     lang), key:'titleEn',  type:'text' },
            { label: txt('Title (FR)',    'Titre (FR)',     lang), key:'titleFr',  type:'text' },
            { label: txt('Location',     'Localisation',   lang), key:'location', type:'text' },
            { label: txt('Website',      'Site web',       lang), key:'website',  type:'url'  },
          ].map(f => (
            <div key={f.key} className="pedit-field">
              <label>{f.label}</label>
              <input
                type={f.type}
                value={data[f.key] || ''}
                onChange={e => set(f.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Bio ── */}
      {section === 'bio' && (
        <div className="pedit-section">
          <h2 className="pedit-section__title">Bio</h2>
          <div className="pedit-field">
            <label>Bio (English)</label>
            <textarea
              rows={5}
              value={data.bioEn}
              onChange={e => set('bioEn', e.target.value)}
              placeholder="Tell your story in English..."
            />
          </div>
          <div className="pedit-field">
            <label>Bio (Français)</label>
            <textarea
              rows={5}
              value={data.bioFr}
              onChange={e => set('bioFr', e.target.value)}
              placeholder="Racontez votre histoire en français..."
            />
          </div>
          <p className="pedit-field__hint">
            {data.bioEn.length} / 500 {txt('characters', 'caractères', lang)}
          </p>
        </div>
      )}

      {/* ── Experience ── */}
      {section === 'experience' && (
        <div className="pedit-section">
          <h2 className="pedit-section__title">
            {txt('Experience', 'Expérience', lang)}
          </h2>
          {data.experience.map((exp, i) => (
            <div key={exp.id} className="pedit-card">
              <div className="pedit-card__header">
                <div className="pedit-card__icon">
                  <FontAwesomeIcon icon={faBriefcase} />
                </div>
                <span className="pedit-card__label">
                  {txt('Position', 'Poste', lang)} {i + 1}
                </span>
                <button
                  className="pedit-card__remove"
                  onClick={() => removeExperience(exp.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              {[
                { label: txt('Role (EN)', 'Rôle (EN)', lang), key:'roleEn' },
                { label: txt('Role (FR)', 'Rôle (FR)', lang), key:'roleF'  },
                { label: txt('Company',   'Entreprise', lang), key:'co'    },
                { label: txt('Period',    'Période',    lang), key:'period' },
              ].map(f => (
                <div key={f.key} className="pedit-field pedit-field--inline">
                  <label>{f.label}</label>
                  <input
                    type="text"
                    value={exp[f.key] || ''}
                    onChange={e => updateExp(exp.id, f.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          ))}
          <button className="pedit-add-btn" onClick={addExperience}>
            <FontAwesomeIcon icon={faPlus} />
            {txt('Add experience', 'Ajouter expérience', lang)}
          </button>
        </div>
      )}

      {/* ── Education ── */}
      {section === 'education' && (
        <div className="pedit-section">
          <h2 className="pedit-section__title">
            {txt('Education', 'Formation', lang)}
          </h2>
          {data.education.map((edu, i) => (
            <div key={edu.id} className="pedit-card">
              <div className="pedit-card__header">
                <div className="pedit-card__icon">
                  <FontAwesomeIcon icon={faGraduationCap} />
                </div>
                <span className="pedit-card__label">
                  {txt('Degree', 'Diplôme', lang)} {i + 1}
                </span>
                <button
                  className="pedit-card__remove"
                  onClick={() => removeEducation(edu.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              {[
                { label: txt('Degree (EN)', 'Diplôme (EN)', lang), key:'degreeEn' },
                { label: txt('Degree (FR)', 'Diplôme (FR)', lang), key:'degreeF'  },
                { label: txt('School',      'École',        lang), key:'school'   },
                { label: txt('Period',      'Période',      lang), key:'period'   },
              ].map(f => (
                <div key={f.key} className="pedit-field pedit-field--inline">
                  <label>{f.label}</label>
                  <input
                    type="text"
                    value={edu[f.key] || ''}
                    onChange={e => updateEdu(edu.id, f.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          ))}
          <button className="pedit-add-btn" onClick={addEducation}>
            <FontAwesomeIcon icon={faPlus} />
            {txt('Add education', 'Ajouter formation', lang)}
          </button>
        </div>
      )}

      {/* Bottom save */}
      <div className="pedit-bottom-save">
        <button
          className="pedit-save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving
            ? <FontAwesomeIcon icon={faSpinner} spin />
            : txt('Save changes', 'Enregistrer les modifications', lang)
          }
        </button>
      </div>

    </div>
  )
}