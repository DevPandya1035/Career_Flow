import React from 'react'
import { Link } from 'react-router-dom'
import { Layers, Briefcase, Plus, Sparkles } from 'lucide-react'
import { useStore } from '../../store'
import type { ApplicationStatus } from '../../types'
import { StageColumn } from './StageColumn'
import { Button } from '../../components/ui/Button'

const STAGES: ApplicationStatus[] = [
  'Applied',
  'Shortlisted',
  'Assessment',
  'Interview',
  'Selected'
]

export const TrackerPage: React.FC = () => {
  const applications = useStore((state) => state.applications)
  const jobs = useStore((state) => state.jobs)
  const student = useStore((state) => state.student)
  const advanceApplicationStatus = useStore((state) => state.advanceApplicationStatus)

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-surface-border">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary" />
            <span>Application Pipeline Tracker</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Follow your applications through the five campus recruitment stages.
          </p>
        </div>

        {/* Demo Mode Notice */}
        <div className="flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-xl px-3 py-1.5 text-xs">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-medium">
            Demo Mode: Click &ldquo;Advance Stage&rdquo; on any card to simulate recruiter progression.
          </span>
        </div>
      </div>

      {/* Main Kanban Content */}
      {applications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-surface-border shadow-xs space-y-4 max-w-lg mx-auto my-8">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-primary mx-auto flex items-center justify-center">
            <Briefcase className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              No applications yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              You haven&rsquo;t applied to any campus drives yet. Explore open job opportunities, verify your criteria, and submit your applications.
            </p>
          </div>
          <Link to="/jobs">
            <Button variant="primary" size="md" className="font-bold">
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Browse Job Opportunities</span>
            </Button>
          </Link>
        </div>
      ) : null}

      {/* The 5-stage horizontal board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 items-start min-w-[1200px]">
          {STAGES.map((stage) => {
            const stageApps = applications.filter((app) => app.status === stage)
            return (
              <StageColumn
                key={stage}
                stage={stage}
                applications={stageApps}
                jobs={jobs}
                student={student}
                onAdvance={advanceApplicationStatus}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TrackerPage
