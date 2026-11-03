import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import Dashboard from './modules/dashboard/Dashboard'
import JobsPage from './modules/jobs/JobsPage'
import TrackerPage from './modules/tracker/TrackerPage'
import EligibilityPage from './modules/eligibility/EligibilityPage'
import PrepPage from './modules/prep/PrepPage'
import ProfilePage from './modules/profile/ProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/eligibility" element={<EligibilityPage />} />
          <Route path="/prep" element={<PrepPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
