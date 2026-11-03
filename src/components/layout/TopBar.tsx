import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Bell, Sparkles } from 'lucide-react'
import { useStore } from '../../store'

export const TopBar: React.FC = () => {
  const navigate = useNavigate()
  const student = useStore((state) => state.student)
  const searchQuery = useStore((state) => state.searchQuery)
  const setSearchQuery = useStore((state) => state.setSearchQuery)
  const currentRole = useStore((state) => state.currentRole)
  const setCurrentRole = useStore((state) => state.setCurrentRole)
  const [showNotifications, setShowNotifications] = useState(false)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(currentRole === 'admin' ? '/admin/drives' : '/jobs')
  }

  const handleRoleToggle = (role: 'student' | 'admin') => {
    setCurrentRole(role)
    if (role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/')
    }
  }

  return (
    <header className="h-16 bg-white border-b border-surface-border px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 shrink-0">
      {/* Search Input / Quick Filter */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md mr-4">
        <label htmlFor="global-search" className="sr-only">
          {currentRole === 'admin' ? 'Search placement drives and candidates' : 'Search opportunities, companies, skills'}
        </label>
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          id="global-search"
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            currentRole === 'admin'
              ? 'Search active drives, branches, criteria...'
              : 'Search companies, roles, skills...'
          }
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Pill */}
        <div
          role="radiogroup"
          aria-label="Role Switcher"
          className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium"
        >
          <button
            type="button"
            role="radio"
            aria-checked={currentRole === 'student'}
            onClick={() => handleRoleToggle('student')}
            className={`px-3 py-1 rounded-md transition-all ${
              currentRole === 'student'
                ? 'bg-white text-navy font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={currentRole === 'admin'}
            onClick={() => handleRoleToggle('admin')}
            className={`px-3 py-1 rounded-md transition-all ${
              currentRole === 'admin'
                ? 'bg-primary text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            TPO Admin
          </button>
        </div>

        {/* Quick Placement Season Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-full text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Placement Season 2026</span>
        </div>

        {/* Notifications Icon with popover toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View placement notifications"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 text-xs text-slate-700 animate-in fade-in-50 zoom-in-95">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
                <span className="font-semibold text-slate-900">Notifications</span>
                <span className="text-[10px] text-primary font-medium">2 New</span>
              </div>
              <div className="space-y-2.5">
                <div className="p-2 bg-blue-50/70 border border-blue-100 rounded-lg">
                  <p className="font-semibold text-slate-900">Flipkart SDE Drive</p>
                  <p className="text-slate-600">Application deadline approaching in 3 days.</p>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg">
                  <p className="font-semibold text-slate-900">Google L3 Drive</p>
                  <p className="text-slate-600">Shortlist requirements published: CGPA 8.5+</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Link */}
        {currentRole === 'admin' ? (
          <div className="flex items-center gap-2 pl-2" aria-label="TPO Administrator Profile">
            <div className="w-9 h-9 rounded-full bg-primary text-white font-semibold text-sm flex items-center justify-center border border-primary/20">
              RV
            </div>
            <div className="hidden lg:block text-left">
              <span className="block text-xs font-bold text-slate-900 leading-tight">
                Dr. R. K. Verma
              </span>
              <span className="block text-[11px] text-slate-500 font-medium">
                Head of TPO
              </span>
            </div>
          </div>
        ) : (
          <Link
            to="/profile"
            className="flex items-center gap-2 pl-2 hover:opacity-90 transition-opacity"
            aria-label={`View ${student.name} profile`}
          >
            <div className="w-9 h-9 rounded-full bg-navy text-white font-semibold text-sm flex items-center justify-center border border-navy/20">
              {student.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="hidden lg:block text-left">
              <span className="block text-xs font-bold text-slate-900 leading-tight">
                {student.name}
              </span>
              <span className="block text-[11px] text-slate-500 font-medium">
                {student.branch} • CGPA {student.cgpa.toFixed(1)}
              </span>
            </div>
          </Link>
        )}
      </div>
    </header>
  )
}
