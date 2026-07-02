import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGlobe, faHandshake, faRocket,
  faHeart, faShieldHalved,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import './About.css'

const team = [
  { name:'Amara Diallo',    role:'CEO & Co-founder',     origin:'🇸🇳 Senegal',    avatar:'https://i.pravatar.cc/64?img=5'  },
  { name:'Chukwuemeka Obi', role:'CTO & Co-founder',     origin:'🇳🇬 Nigeria',    avatar:'https://i.pravatar.cc/64?img=12' },
  { name:'Aïcha Konaré',   role:'Head of Product',      origin:'🇲🇱 Mali',       avatar:'https://i.pravatar.cc/64?img=9'  },
  { name:'David Asante',    role:'Head of Growth',       origin:'🇬🇭 Ghana',      avatar:'https://i.pravatar.cc/64?img=15' },
  { name:'Fatima Youssouf', role:'Head of Partnerships', origin:'🇨🇲 Cameroon',   avatar:'https://i.pravatar.cc/64?img=47' },
  { name:'Martin Nkosi',    role:'Head of Engineering',  origin:'🇿🇦 South Africa',avatar:'https://i.pravatar.cc/64?img=55' },
]

const values = [
  { icon: faGlobe,       titleEn:'Pan-African First',  titleFr:'Pan-Africain d\'abord',  descEn:'Built for Africa, by Africans. Every feature is designed with the African context in mind.', descFr:'Construit pour l\'Afrique, par des Africains. Chaque fonctionnalité est pensée pour le contexte africain.' },
  { icon: faHandshake,   titleEn:'Collaboration',      titleFr:'Collaboration',            descEn:'We believe in the power of connection. Together we build a stronger Africa.', descFr:'Nous croyons au pouvoir de la connexion. Ensemble nous construisons une Afrique plus forte.' },
  { icon: faShieldHalved,titleEn:'Trust & Safety',     titleFr:'Confiance & Sécurité',    descEn:'Your data is yours. We never sell it and we protect it with industry-standard encryption.', descFr:'Vos données vous appartiennent. Nous ne les vendons jamais et les protégeons avec un chiffrement standard.' },
  { icon: faHeart,       titleEn:'Impact Driven',      titleFr:'Axé sur l\'impact',       descEn:'Our mission is to unlock economic opportunity for 1 billion Africans by 2035.', descFr:'Notre mission est de débloquer des opportunités économiques pour 1 milliard d\'Africains d\'ici 2035.' },
]

const stats = [
  { num:'200K+', labelEn:'Members',         labelFr:'Membres'          },
  { num:'50+',   labelEn:'Countries',       labelFr:'Pays'             },
  { num:'12K+',  labelEn:'Jobs posted',     labelFr:'Emplois publiés'  },
  { num:'$2M+',  labelEn:'Projects funded', labelFr:'Projets financés' },
]

export default function About() {
  const { lang } = useLang()

  return (
    <div className="about-page">

      {/* Hero */}
      <div className="about-hero">
        <div className="about-hero__content">
          <p className="about-hero__eyebrow">
            {txt('Our Story', 'Notre histoire', lang)}
          </p>
          <h1 className="about-hero__title">
            {txt(
              'Building the professional network Africa deserves.',
              'Construire le réseau professionnel que l\'Afrique mérite.',
              lang
            )}
          </h1>
          <p className="about-hero__text">
            {txt(
              'AfriConnect was born in 2023 from a simple observation: Africa\'s talent, entrepreneurs and opportunities are scattered across a continent with no unified platform to connect them. We set out to change that.',
              'AfriConnect est né en 2023 d\'une observation simple : les talents, entrepreneurs et opportunités africains sont dispersés sur un continent sans plateforme unifiée pour les connecter. Nous avons décidé de changer cela.',
              lang
            )}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="about-stats">
        {stats.map((s, i) => (
          <div key={i} className="about-stat">
            <span className="about-stat__num">{s.num}</span>
            <span className="about-stat__label">{txt(s.labelEn, s.labelFr, lang)}</span>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div className="about-mission">
        <div className="about-mission__icon">
          <FontAwesomeIcon icon={faRocket} />
        </div>
        <div>
          <h2 className="about-mission__title">
            {txt('Our mission', 'Notre mission', lang)}
          </h2>
          <p className="about-mission__text">
            {txt(
              'To unlock economic opportunity for 1 billion Africans by connecting talent, capital and businesses across the continent — and with the global African diaspora.',
              'Débloquer des opportunités économiques pour 1 milliard d\'Africains en connectant les talents, les capitaux et les entreprises à travers le continent — et avec la diaspora africaine mondiale.',
              lang
            )}
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="about-section">
        <h2 className="about-section__title">
          {txt('Our values', 'Nos valeurs', lang)}
        </h2>
        <div className="about-values-grid">
          {values.map((v, i) => (
            <div key={i} className="about-value-card">
              <div className="about-value-card__icon">
                <FontAwesomeIcon icon={v.icon} />
              </div>
              <h3 className="about-value-card__title">
                {txt(v.titleEn, v.titleFr, lang)}
              </h3>
              <p className="about-value-card__desc">
                {txt(v.descEn, v.descFr, lang)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="about-section">
        <h2 className="about-section__title">
          {txt('Meet the team', 'Rencontrez l\'équipe', lang)}
        </h2>
        <div className="about-team-grid">
          {team.map((member, i) => (
            <div key={i} className="about-team-card">
              <img src={member.avatar} alt={member.name} className="about-team-card__avatar" />
              <p className="about-team-card__name">{member.name}</p>
              <p className="about-team-card__role">{member.role}</p>
              <p className="about-team-card__origin">{member.origin}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="about-cta">
        <h2>{txt('Ready to join AfriConnect?', 'Prêt à rejoindre AfriConnect ?', lang)}</h2>
        <p>{txt('Join 200,000+ professionals building Africa\'s future.', 'Rejoignez 200 000+ professionnels qui construisent l\'avenir de l\'Afrique.', lang)}</p>
        <a href="/register" className="about-cta__btn">
          {txt('Create your free account', 'Créer votre compte gratuit', lang)}
          <FontAwesomeIcon icon={faArrowRight} />
        </a>
      </div>

    </div>
  )
}