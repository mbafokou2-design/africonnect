import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    localStorage.getItem('africonnect_lang') || import.meta.env.VITE_APP_LANG_DEFAULT || 'en'
  )

  useEffect(() => {
    localStorage.setItem('africonnect_lang', lang)
    // Update all data-en / data-fr elements in the DOM
    document.querySelectorAll('[data-en]').forEach(el => {
      el.textContent = lang === 'fr' ? el.getAttribute('data-fr') : el.getAttribute('data-en')
    })
  }, [lang])

  const toggleLang = () => setLang(prev => prev === 'en' ? 'fr' : 'en')

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}