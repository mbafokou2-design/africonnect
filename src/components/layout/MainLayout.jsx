import Sidebar from '../sidebar/Sidebar'
import RightPanel from '../rightpanel/RightPanel'
import './MainLayout.css'

export default function MainLayout({ children, activePath = '/' }) {
  return (
    <div className="app-shell">
      <div className="app-body">

        {/* Left Sidebar */}
        <div className="app-sidebar">
          <Sidebar activePath={activePath} />
        </div>

        {/* Center Feed */}
        <main className="main-content">
          {children}
        </main>

        {/* Right Panel */}
        <div className="app-right-panel">
          <RightPanel />
        </div>

      </div>
    </div>
  )
}