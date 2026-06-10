import { useState } from 'react'
import { useLang } from '../../context/LanguageContext'
import { txt } from '../../utils/translate'
import ThreadList from './components/ThreadList'
import ChatWindow from './components/ChatWindow'
import './Messaging.css'

// TODO: fetch from ${import.meta.env.VITE_API_BASE_URL}/messages/threads
export const initialThreads = [
  { id:1, name:'Awa Diop',      avatar:'https://i.pravatar.cc/44?img=5',  lastEn:'Thanks for connecting!',        lastFr:'Merci pour la connexion !',          time:'2m',  unread:2, online:true,  muted:false },
  { id:2, name:'Kofi Mensah',   avatar:'https://i.pravatar.cc/44?img=12', lastEn:"Let's schedule a call.",        lastFr:'Planifions un appel.',               time:'1h',  unread:0, online:true,  muted:false },
  { id:3, name:'Amina Traoré',  avatar:'https://i.pravatar.cc/44?img=9',  lastEn:'Sent you my portfolio.',        lastFr:"Je t'ai envoyé mon portfolio.",       time:'3h',  unread:1, online:false, muted:false },
  { id:4, name:'Emeka Okonkwo', avatar:'https://i.pravatar.cc/44?img=15', lastEn:'Great post today!',             lastFr:"Super post aujourd'hui !",           time:'1d',  unread:0, online:false, muted:true  },
]

export const initialMessages = {
  1: [
    { id:1, from:'other', type:'text', textEn:'Hi! I saw your post about AgriTech. Very inspiring!', textFr:"Salut ! J'ai vu ton post sur l'AgriTech. Très inspirant !", time:'10:21' },
    { id:2, from:'me',    type:'text', textEn:"Thank you! It's a project close to my heart.",        textFr:"Merci ! C'est un projet qui me tient à cœur.",             time:'10:22' },
    { id:3, from:'other', type:'text', textEn:'Would love to collaborate sometime.',                  textFr:"J'aimerais collaborer un jour.",                            time:'10:23' },
    { id:4, from:'me',    type:'text', textEn:"Absolutely! Let's connect properly.",                  textFr:'Absolument ! Connectons-nous correctement.',               time:'10:25' },
  ],
  2: [
    { id:1, from:'other', type:'text', textEn:"Hey, are you free for a quick call this week?", textFr:'Salut, tu es libre pour un appel rapide cette semaine ?', time:'09:00' },
    { id:2, from:'me',    type:'text', textEn:'Yes! Thursday works for me.',                   textFr:'Oui ! Jeudi me convient.',                                 time:'09:05' },
  ],
  3: [
    { id:1, from:'other', type:'text', textEn:'Check out my portfolio!', textFr:'Regarde mon portfolio !', time:'08:00' },
  ],
  4: [
    { id:1, from:'other', type:'text', textEn:'Great post today!', textFr:"Super post aujourd'hui !", time:'Yesterday' },
  ],
}

export default function Messaging() {
  const { lang } = useLang()
  const [threads, setThreads]   = useState(initialThreads)
  const [messages, setMessages] = useState(initialMessages)
  const [activeId, setActiveId] = useState(null) // null = show thread list on mobile

  const activeThread = threads.find(t => t.id === activeId)

  const handleSend = (msg) => {
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/messages/threads/${activeId}
    setMessages(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), {
        id: Date.now(), from: 'me', ...msg,
        time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
      }]
    }))
    setThreads(prev => prev.map(t =>
      t.id === activeId
        ? { ...t, lastEn: msg.type === 'text' ? msg.textEn : `[${msg.type}]`, lastFr: msg.type === 'text' ? msg.textFr : `[${msg.type}]`, time: 'now', unread: 0 }
        : t
    ))
  }

  const handleDeleteThread = (id) => {
    setThreads(prev => prev.filter(t => t.id !== id))
    if (activeId === id) setActiveId(null)
    // TODO: DELETE ${import.meta.env.VITE_API_BASE_URL}/messages/threads/${id}
  }

  const handleMuteThread = (id) => {
    setThreads(prev => prev.map(t => t.id === id ? { ...t, muted: !t.muted } : t))
    // TODO: POST ${import.meta.env.VITE_API_BASE_URL}/messages/threads/${id}/mute
  }

  return (
    <div className="messaging-page">
      {/* Thread list — always visible desktop, conditional mobile */}
      <div className={`messaging-sidebar ${activeId ? 'messaging-sidebar--hidden-mobile' : ''}`}>
        <ThreadList
          threads={threads}
          activeId={activeId}
          onSelect={setActiveId}
          onDelete={handleDeleteThread}
          onMute={handleMuteThread}
          lang={lang}
        />
      </div>

      {/* Chat window */}
      <div className={`messaging-main ${!activeId ? 'messaging-main--hidden-mobile' : ''}`}>
        {activeThread ? (
          <ChatWindow
            thread={activeThread}
            messages={messages[activeId] || []}
            onSend={handleSend}
            onBack={() => setActiveId(null)}
            lang={lang}
          />
        ) : (
          <div className="messaging-empty">
            <span>💬</span>
            <p>{txt('Select a conversation', 'Sélectionnez une conversation', lang)}</p>
          </div>
        )}
      </div>
    </div>
  )
}