import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import MainLayout from './components/layout/MainLayout'
import Topbar from './components/topbar/Topbar'
import HeroBanner from './components/hero/HeroBanner'
import PostComposer from './components/composer/PostComposer'
import Feed from './components/feed/Feed'
import BottomNav from './components/bottomnav/BottomNav'

function App() {
  const [composerOpen, setComposerOpen] = useState(false)

  return (
    <BrowserRouter>
      <LanguageProvider>
        <Topbar activePath="/" />
        <MainLayout activePath="/">
          <HeroBanner />
          <PostComposer forceOpen={composerOpen} onClose={() => setComposerOpen(false)} />
          <Feed />
        </MainLayout>
        <BottomNav activePath="/" onPlusClick={() => setComposerOpen(true)} />
      </LanguageProvider>
    </BrowserRouter>
  )
}

export default App