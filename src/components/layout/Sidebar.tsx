import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Briefcase, 
  Layers, 
  CheckCircle2, 
  GraduationCap, 
  UserCircle 
} from 'lucide-react'

interface NavItem {
  name: string
  to: string
  icon: React.ComponentType<{ className?: string }>
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'Job Opportunities', to: '/jobs', icon: Briefcase },
  { name: 'Application Tracker', to: '/tracker', icon: Layers },
  { name: 'Eligibility Checker', to: '/eligibility', icon: CheckCircle2 },
  { name: 'Preparation Hub', to: '/prep', icon: GraduationCap },
  { name: 'Student Profile', to: '/profile', icon: UserCircle },
]

export const Sidebar: React.FC = () => {
  return (
    <aside 
      className="hidden md:flex flex-col w-64 bg-navy text-slate-300 shrink-0 select-none border-r border-slate-800"
      aria-label="Main Navigation"
    >
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center border-b border-slate-800/80 gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
          CF
        </div>
        <div>
          <span className="font-bold text-lg text-white tracking-tight leading-none block">
            CareerFlow
          </span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
            Campus Placement
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Bottom Tagline Info */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400">
        <p className="font-semibold text-slate-300 mb-0.5">CareerFlow Portal</p>
        <p className="text-[11px] leading-relaxed text-slate-400">
          Your Career. Your Journey. Your Future.
        </p>
      </div>
    </aside>
  )
}
