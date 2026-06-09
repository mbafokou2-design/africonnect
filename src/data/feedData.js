// REPLACE pravatar URLs with real user photos when backend is ready
// REPLACE unsplash URLs with real post images when backend is ready
// Future: fetch from `${import.meta.env.VITE_API_BASE_URL}/feed`

const feedPosts = [
  {
    id: 1,
    user: {
      name: 'Awa Diop',
      avatar: 'https://i.pravatar.cc/48?img=5',
      // ↑ REPLACE with real avatar from API
      titleEn: 'Full Stack Developer',
      titleFr: 'Développeuse Full Stack',
      verified: true,
    },
    timeEn: '2h ago',
    timeFr: 'Il y a 2h',
    visibility: 'public',
    contentEn: "Happy to announce the launch of our new platform that connects farmers to local markets! 🌱🚜 #Agritech #Innovation #Africa",
    contentFr: "Heureuse d'annoncer le lancement de notre nouvelle plateforme qui connecte les agriculteurs aux marchés locaux ! 🌱🚜 #Agritech #Innovation #Afrique",
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&q=80',
    // ↑ REPLACE with real post image from API
    reactions: { like: 98, love: 20, clap: 10, total: 128 },
    commentsCount: 24,
    sharesCount: 15,
    tags: ['Agritech', 'Innovation', 'Africa'],
  },
  {
    id: 2,
    user: {
      name: 'Kofi Mensah',
      avatar: 'https://i.pravatar.cc/48?img=12',
      titleEn: 'Tech Entrepreneur',
      titleFr: 'Entrepreneur Tech',
      verified: false,
    },
    timeEn: '4h ago',
    timeFr: 'Il y a 4h',
    visibility: 'public',
    contentEn: "Just closed our seed round of $500K for our fintech solution. Grateful for every mentor and investor who believed in us from day one. 🙏 #Fintech #Africa #Startup",
    contentFr: "Nous venons de clôturer notre tour de financement de 500K$ pour notre solution fintech. Reconnaissant envers chaque mentor et investisseur. 🙏 #Fintech #Afrique #Startup",
    image: null,
    reactions: { like: 210, love: 55, clap: 33, total: 298 },
    commentsCount: 47,
    sharesCount: 32,
    tags: ['Fintech', 'Africa', 'Startup'],
  },
  {
    id: 3,
    user: {
      name: 'Amina Traoré',
      avatar: 'https://i.pravatar.cc/48?img=9',
      titleEn: 'UX Designer · Abidjan',
      titleFr: 'Designer UX · Abidjan',
      verified: true,
    },
    timeEn: '6h ago',
    timeFr: 'Il y a 6h',
    visibility: 'network',
    contentEn: "Design is not just how it looks, it's how it works for the people who use it. Sharing my latest UI case study for an e-health app built for rural communities in Côte d'Ivoire. 🎨",
    contentFr: "Le design n'est pas que visuel, c'est aussi la façon dont il fonctionne pour les utilisateurs. Je partage mon étude de cas UI pour une application e-santé rurale. 🎨",
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    // ↑ REPLACE with real post image from API
    reactions: { like: 150, love: 40, clap: 22, total: 212 },
    commentsCount: 18,
    sharesCount: 9,
    tags: ['Design', 'UX', 'eHealth'],
  },
  {
    id: 4,
    user: {
      name: 'Emeka Okonkwo',
      avatar: 'https://i.pravatar.cc/48?img=15',
      titleEn: 'Software Engineer · Lagos',
      titleFr: 'Ingénieur Logiciel · Lagos',
      verified: false,
    },
    timeEn: '1d ago',
    timeFr: 'Il y a 1j',
    visibility: 'public',
    contentEn: "React or Vue in 2025? After working with both on large-scale African platforms, here's my honest take 👇 React wins on ecosystem, Vue wins on simplicity. Both are great — pick the one your team knows. #WebDev #Africa",
    contentFr: "React ou Vue en 2025 ? Après avoir travaillé avec les deux sur des plateformes africaines, voici mon avis honnête 👇 React gagne sur l'écosystème, Vue sur la simplicité. #WebDev #Afrique",
    image: null,
    reactions: { like: 320, love: 28, clap: 90, total: 438 },
    commentsCount: 63,
    sharesCount: 44,
    tags: ['WebDev', 'React', 'Vue'],
  },
]

export default feedPosts