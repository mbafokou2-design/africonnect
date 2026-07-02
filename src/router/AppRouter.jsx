import { Routes, Route, Navigate } from 'react-router-dom'
import Home           from '../pages/Home/Home'
import Network        from '../pages/Network/Network'
import Messaging      from '../pages/Messaging/Messaging'
import Notifications  from '../pages/Notifications/Notifications'
import Profile        from '../pages/Profile/Profile'
import ProfileEdit    from '../pages/Profile/ProfileEdit'
import Settings       from '../pages/Settings/Settings'
import Search         from '../pages/Search/Search'
import Post           from '../pages/Post/Post'
import Groups         from '../pages/Groups/Groups'
import GroupDetail    from '../pages/Groups/GroupDetail'
import Jobs           from '../pages/Jobs/Jobs'
import Projects       from '../pages/Projects/Projects'
import ProjectDetail  from '../pages/Projects/ProjectDetail'
import Events         from '../pages/Events/Events'
import EventDetail    from '../pages/Events/EventDetail'
import Diaspora       from '../pages/Diaspora/Diaspora'
import Marketplace    from '../pages/Marketplace/Marketplace'
import Subscription   from '../pages/Subscription/Subscription'
import HelpCenter     from '../pages/HelpCenter/HelpCenter'
import About          from '../pages/About/About'
import Login          from '../pages/Auth/Login'
import Register       from '../pages/Auth/Register'

function NotFound() {
  return (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', padding:'80px 20px', gap:16, textAlign:'center'
    }}>
      <div style={{ fontSize:64 }}>🌍</div>
      <h1 style={{ fontSize:28, fontWeight:800, color:'var(--color-navy)' }}>404</h1>
      <p style={{ color:'var(--color-text-muted)' }}>Page not found</p>
      <a href="/" style={{
        padding:'10px 24px', background:'var(--color-primary)', color:'white',
        borderRadius:20, textDecoration:'none', fontWeight:700, fontSize:14
      }}>
        Go home
      </a>
    </div>
  )
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/"               element={<Home />}          />
      <Route path="/network"        element={<Network />}       />
      <Route path="/messaging"      element={<Messaging />}     />
      <Route path="/notifications"  element={<Notifications />} />
      <Route path="/profile"        element={<Profile />}       />
      <Route path="/profile/edit"   element={<ProfileEdit />}   />
      <Route path="/settings"       element={<Settings />}      />
      <Route path="/search"         element={<Search />}        />
      <Route path="/post/:id"       element={<Post />}          />
      <Route path="/groups"         element={<Groups />}        />
      <Route path="/groups/:id"     element={<GroupDetail />}   />
      <Route path="/jobs"           element={<Jobs />}          />
      <Route path="/projects"       element={<Projects />}      />
      <Route path="/projects/:id"   element={<ProjectDetail />} />
      <Route path="/events"         element={<Events />}        />
      <Route path="/events/:id"     element={<EventDetail />}   />
      <Route path="/diaspora"       element={<Diaspora />}      />
      <Route path="/marketplace"    element={<Marketplace />}   />
      <Route path="/subscription"   element={<Subscription />}  />
      <Route path="/help"           element={<HelpCenter />}    />
      <Route path="/about"          element={<About />}         />
      <Route path="/login"          element={<Login />}         />
      <Route path="/register"       element={<Register />}      />
      <Route path="*"               element={<NotFound />}      />
    </Routes>
  )
}