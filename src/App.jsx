import { BrowserRouter, useLocation } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { ToastProvider }    from './components/ui/Toast'
import Topbar               from './components/topbar/Topbar'
import MainLayout           from './components/layout/MainLayout'
import BottomNav            from './components/bottomnav/BottomNav'
import AppRouter            from './router/AppRouter'
import { useState, useEffect } from 'react'

const AUTH_PATHS = ['/login', '/register']

function AppInner() {
  const location  = useLocation()
  const isAuth    = AUTH_PATHS.includes(location.pathname)
  const activePath = location.pathname

  const [mobileComposerOpen, setMobileComposerOpen] = useState(false)

  if (isAuth) {
    return <AppRouter />
  }

  return (
    <>
      <Topbar activePath={activePath} />
      <MainLayout>
        <AppRouter />
      </MainLayout>
      <BottomNav
        activePath={activePath}
        onCompose={() => setMobileComposerOpen(true)}
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