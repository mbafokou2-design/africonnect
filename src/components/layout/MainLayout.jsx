import './MainLayout.css'

function MainLayout({ children }) {
  return (
    <main className="app-shell">
      <div className="app-body">
        <div className="sidebar-slot" />
        <div className="main-content">{children}</div>
        <div className="right-panel-slot" />
      </div>
    </main>
  )
}

export default MainLayout
