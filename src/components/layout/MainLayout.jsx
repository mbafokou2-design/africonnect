import Sidebar from '../sidebar/Sidebar'
import RightPanel from '../rightpanel/RightPanel'
import './MainLayout.css'

export default function MainLayout({ children, activePath = '/' }) {
  return (
    <div className="app-shell">
      <div className="app-body">
        <div className="app-sidebar">
          <Sidebar activePath={activePath} />
        </div>
        <main className="main-content">
          {children}
        </main>
        <div className="app-right-panel">
          <RightPanel />
        </div>
      </div>
    </div>
  )
}