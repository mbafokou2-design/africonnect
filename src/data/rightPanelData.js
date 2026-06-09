// REPLACE all data with API responses when backend is ready
// Future endpoints:
// GET ${import.meta.env.VITE_API_BASE_URL}/jobs/featured
// GET ${import.meta.env.VITE_API_BASE_URL}/projects/featured
// GET ${import.meta.env.VITE_API_BASE_URL}/groups/popular

export const featuredJobs = [
  {
    id: 1,
    titleEn: 'Senior Mobile Developer',
    titleFr: 'Développeur Mobile Senior',
    company: 'Wave',
    locationEn: 'Dakar, Senegal',
    locationFr: 'Dakar, Sénégal',
    timeEn: '2h ago',
    timeFr: 'Il y a 2h',
    isNew: true,
    logo: 'https://i.pravatar.cc/40?img=20',
    // ↑ REPLACE with company logo from API
  },
  {
    id: 2,
    titleEn: 'Digital Project Manager',
    titleFr: 'Chef de Projet Digital',
    company: 'Orange Cameroun',
    locationEn: 'Yaoundé, Cameroon',
    locationFr: 'Yaoundé, Cameroun',
    timeEn: '4h ago',
    timeFr: 'Il y a 4h',
    isNew: true,
    logo: 'https://i.pravatar.cc/40?img=21',
    // ↑ REPLACE with company logo from API
  },
  {
    id: 3,
    titleEn: 'Data Analyst',
    titleFr: 'Analyste de Données',
    company: 'Flutterwave',
    locationEn: 'Lagos, Nigeria',
    locationFr: 'Lagos, Nigeria',
    timeEn: '6h ago',
    timeFr: 'Il y a 6h',
    isNew: true,
    logo: 'https://i.pravatar.cc/40?img=22',
    // ↑ REPLACE with company logo from API
  },
]

export const featuredProjects = [
  {
    id: 1,
    nameEn: 'AgriTech Solutions',
    nameFr: 'AgriTech Solutions',
    descEn: 'Agricultural management platform',
    descFr: 'Plateforme de gestion agricole',
    percent: 45,
    amountRaised: '45 000 000',
    amountGoal: '100 000 000',
    currency: 'FCFA',
    color: '#22c55e',
    icon: '🌱',
  },
  {
    id: 2,
    nameEn: 'EduConnect Africa',
    nameFr: 'EduConnect Africa',
    descEn: 'E-learning platform',
    descFr: 'Plateforme e-learning',
    percent: 60,
    amountRaised: '30 000 000',
    amountGoal: '50 000 000',
    currency: 'FCFA',
    color: '#4b56d2',
    icon: '📚',
  },
  {
    id: 3,
    nameEn: 'HealthBridge',
    nameFr: 'HealthBridge',
    descEn: 'Rural telemedicine app',
    descFr: 'Application de télémédecine rurale',
    percent: 30,
    amountRaised: '15 000 000',
    amountGoal: '50 000 000',
    currency: 'FCFA',
    color: '#f59e0b',
    icon: '🏥',
  },
]

export const popularGroups = [
  {
    id: 1,
    nameEn: "Africa's Entrepreneurs",
    nameFr: "Entrepreneurs d'Afrique",
    members: '12.5K',
    avatar: 'https://i.pravatar.cc/40?img=30',
    // ↑ REPLACE with group image from API
  },
  {
    id: 2,
    nameEn: 'Africa Developers',
    nameFr: 'Développeurs Afrique',
    members: '8.7K',
    avatar: 'https://i.pravatar.cc/40?img=31',
    // ↑ REPLACE with group image from API
  },
  {
    id: 3,
    nameEn: 'Investors & Startups',
    nameFr: 'Investisseurs & Startups',
    members: '6.2K',
    avatar: 'https://i.pravatar.cc/40?img=32',
    // ↑ REPLACE with group image from API
  },
]