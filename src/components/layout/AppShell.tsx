import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { 
  LayoutDashboard, 
  Briefcase, 
  Layers, 
  CheckCircle2, 
  GraduationCap, 
  UserCircle 
} from 'lucide-react'

const MOBILE_NAV = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'Jobs', to: '/jobs', icon: Briefcase },
  { name: 'Tracker', to: '/tracker', icon: Layers },
  { name: 'Eligibility', to: '/eligibility', icon: CheckCircle2 },
  { name: 'Prep', to: '/prep', icon: GraduationCap },
  { name: 'Profile', to: '/profile', icon: UserCircle },
]

export const AppShell: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-bg text-slate-900 font-sans">
      {/* Desktop Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6 focus:outline-none" tabIndex={-1}>
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation (screens < 768px) */}
        <nav 
          className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around py-2 px-1 z-30 shadow-lg"
          aria-label="Mobile Navigation"
        >
          {MOBILE_NAV.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1 px-2 text-[10px] font-medium transition-colors ${
                    isActive ? 'text-primary font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`
                }
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span>{item.name}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
