import { Routes, Route } from 'react-router-dom'
import Home          from '../pages/Home/Home'
import Network       from '../pages/Network/Network'
import Messaging     from '../pages/Messaging/Messaging'
import Notifications from '../pages/Notifications/Notifications'
import Profile       from '../pages/Profile/Profile'
import ProfileEdit   from '../pages/Profile/ProfileEdit'
import Settings      from '../pages/Settings/Settings'
import Jobs          from '../pages/Jobs/Jobs'
import Projects      from '../pages/Projects/Projects'
import Groups        from '../pages/Groups/Groups'
import GroupDetail   from '../pages/Groups/GroupDetail'
import Search        from '../pages/Search/Search'
import Post          from '../pages/Post/Post'
import NotFound      from '../pages/NotFound/NotFound'

export default function AppRouter({ composerOpen, onComposerClose }) {
  return (
    <Routes>
      <Route path="/"              element={<Home composerOpen={composerOpen} onComposerClose={onComposerClose} />} />
      <Route path="/network"       element={<Network />}          />
      <Route path="/messaging"     element={<Messaging />}        />
      <Route path="/notifications" element={<Notifications />}    />
      <Route path="/profile"       element={<Profile />}          />
      <Route path="/profile/edit"  element={<ProfileEdit />}      />
      <Route path="/settings"      element={<Settings />}         />
      <Route path="/jobs"          element={<Jobs />}             />
      <Route path="/projects"      element={<Projects />}         />
      <Route path="/groups"        element={<Groups />}           />
      <Route path="/groups/:id"    element={<GroupDetail />}      />
      <Route path="/search"        element={<Search />}           />
      <Route path="/post/:id"      element={<Post />}             />
      <Route path="*"              element={<NotFound />}         />
    </Routes>
  )
}