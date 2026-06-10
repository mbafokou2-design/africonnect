import { useState } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import MainLayout from './components/layout/MainLayout'
import Topbar from './components/topbar/Topbar'
import BottomNav from './components/bottomnav/BottomNav'
import AppRouter from './router/AppRouter'

function AppInner() {
  const location = useLocation()
  const [composerOpen, setComposerOpen] = useState(false)

  return (
    <>
      <Topbar activePath={location.pathname} />
      <MainLayout activePath={location.pathname}>
        <AppRouter
          composerOpen={composerOpen}
          onComposerClose={() => setComposerOpen(false)}
        />
      </MainLayout>
      <BottomNav
        activePath={location.pathname}
        onPlusClick={() => setComposerOpen(true)}
      />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AppInner />
      </LanguageProvider>
    </BrowserRouter>
  )
}