import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark, faTriangleExclamation, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import './Toast.css'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast--${t.type}`}>
            <div className="toast__icon">
              {t.type === 'success' && <FontAwesomeIcon icon={faCheck} />}
              {t.type === 'error'   && <FontAwesomeIcon icon={faXmark} />}
              {t.type === 'warning' && <FontAwesomeIcon icon={faTriangleExclamation} />}
              {t.type === 'info'    && <FontAwesomeIcon icon={faCircleInfo} />}
            </div>
            <span className="toast__msg">{t.message}</span>
            <button className="toast__close" onClick={() => removeToast(t.id)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}