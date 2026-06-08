import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import MainLayout from './components/layout/MainLayout'
import Topbar from './components/topbar/Topbar'

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <Topbar activePath="/" />
        <MainLayout>
          <p style={{ color: 'var(--color-navy)', fontWeight: 600 }}>
            ✅ Topbar done — feed area
          </p>
        </MainLayout>
      </LanguageProvider>
    </BrowserRouter>
  )
}

export default App