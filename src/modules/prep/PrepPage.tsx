import React, { useState } from 'react'
import { Code2, Brain, FileCheck, Calendar } from 'lucide-react'
import { DSATracker } from './DSATracker'
import { AptitudePanel } from './AptitudePanel'
import { ResumeChecklist } from './ResumeChecklist'
import { MockInterviews } from './MockInterviews'

type TabKey = 'dsa' | 'aptitude' | 'checklist' | 'mock'

interface TabConfig {
  key: TabKey
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const TABS: TabConfig[] = [
  { key: 'dsa', label: 'DSA Tracker', icon: Code2 },
  { key: 'aptitude', label: 'Aptitude Practice', icon: Brain },
  { key: 'checklist', label: 'Resume Checklist', icon: FileCheck },
  { key: 'mock', label: 'Mock Interviews', icon: Calendar }
]

export const PrepPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('dsa')

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % TABS.length
      e.preventDefault()
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + TABS.length) % TABS.length
      e.preventDefault()
    } else if (e.key === 'Home') {
      nextIndex = 0
      e.preventDefault()
    } else if (e.key === 'End') {
      nextIndex = TABS.length - 1
      e.preventDefault()
    }

    if (nextIndex !== index) {
      setActiveTab(TABS[nextIndex].key)
      const tabElements = document.querySelectorAll<HTMLElement>('[role="tab"]')
      tabElements[nextIndex]?.focus()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Preparation Hub</h1>
        <p className="text-sm text-slate-500 mt-1">
          Sharpen algorithmic problem-solving, test cognitive aptitude, verify resume ATS readiness, and book alumni mock interviews.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="border-b border-surface-border">
        <nav
          className="flex space-x-2 -mb-px overflow-x-auto pb-1"
          role="tablist"
          aria-label="Preparation Hub Categories"
        >
          {TABS.map((tab, idx) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                role="tab"
                id={`prep-tab-${tab.key}`}
                aria-selected={isActive}
                aria-controls={`prep-tabpanel-${tab.key}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(tab.key)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-t ${
                  isActive
                    ? 'border-primary text-primary bg-primary/5 rounded-t-lg'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Panels */}
      <div
        role="tabpanel"
        id={`prep-tabpanel-${activeTab}`}
        aria-labelledby={`prep-tab-${activeTab}`}
        tabIndex={0}
        className="outline-none"
      >
        {activeTab === 'dsa' && <DSATracker />}
        {activeTab === 'aptitude' && <AptitudePanel />}
        {activeTab === 'checklist' && <ResumeChecklist />}
        {activeTab === 'mock' && <MockInterviews />}
      </div>
    </div>
  )
}

export default PrepPage
