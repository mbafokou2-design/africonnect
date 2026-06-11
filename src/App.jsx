import { useState } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { ToastProvider } from './components/ui/Toast'
import MainLayout from './components/layout/MainLayout'
import Topbar from './components/topbar/Topbar'
import BottomNav from './components/bottomnav/BottomNav'
import AppRouter from './router/AppRouter'
import PostComposer from './components/composer/PostComposer'

function AppInner() {
  const location = useLocation()
  const [mobileComposerOpen, setMobileComposerOpen] = useState(false)

  return (
    <>
      <Topbar activePath={location.pathname} />
      <MainLayout activePath={location.pathname}>
        <AppRouter
          composerOpen={false}
          onComposerClose={() => {}}
        />
      </MainLayout>

      {/* Mobile-only global composer — triggered by + button in BottomNav */}
      <div className="mobile-composer-global">
        <PostComposer
          forceOpen={mobileComposerOpen}
          onClose={() => setMobileComposerOpen(false)}
        />
      </div>

      <BottomNav
        activePath={location.pathname}
        onPlusClick={() => setMobileComposerOpen(true)}
      />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ToastProvider>
          <AppInner />
        </ToastProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}