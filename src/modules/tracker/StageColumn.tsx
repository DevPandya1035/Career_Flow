import React from 'react'
import type { ApplicationStatus, Application, Job, Student } from '../../types'
import { ApplicationCard } from './ApplicationCard'

export interface StageColumnProps {
  stage: ApplicationStatus
  applications: Application[]
  jobs: Job[]
  student: Student
  onAdvance: (id: string) => void
}

const STAGE_CONFIG: Record<
  ApplicationStatus,
  { label: string; headerColor: string; badgeColor: string; description: string }
> = {
  Applied: {
    label: 'Applied',
    headerColor: 'border-blue-500',
    badgeColor: 'bg-blue-100 text-blue-800',
    description: 'Submitted to placement cell'
  },
  Shortlisted: {
    label: 'Shortlisted',
    headerColor: 'border-amber-500',
    badgeColor: 'bg-amber-100 text-amber-800',
    description: 'Resume shortlisted by recruiter'
  },
  Assessment: {
    label: 'Assessment',
    headerColor: 'border-purple-500',
    badgeColor: 'bg-purple-100 text-purple-800',
    description: 'Online test / OA scheduled'
  },
  Interview: {
    label: 'Interview',
    headerColor: 'border-indigo-500',
    badgeColor: 'bg-indigo-100 text-indigo-800',
    description: 'Technical & HR interviews'
  },
  Selected: {
    label: 'Selected',
    headerColor: 'border-emerald-500',
    badgeColor: 'bg-emerald-100 text-emerald-800 font-bold',
    description: 'Final job offer received'
  },
  Rejected: {
    label: 'Archived',
    headerColor: 'border-slate-400',
    badgeColor: 'bg-slate-100 text-slate-600',
    description: 'Closed drives'
  }
}

export const StageColumn: React.FC<StageColumnProps> = ({
  stage,
  applications,
  jobs,
  student,
  onAdvance
}) => {
  const config = STAGE_CONFIG[stage]

  return (
    <div className="flex flex-col bg-slate-50/80 rounded-2xl border border-surface-border p-3.5 min-w-[280px] sm:min-w-[300px] w-full flex-1">
      {/* Column Header */}
      <div className={`pb-3 mb-3 border-b-2 ${config.headerColor} flex items-center justify-between`}>
        <div>
          <h3 className="font-bold text-sm text-slate-900 tracking-tight">
            {config.label}
          </h3>
          <p className="text-[11px] text-slate-500">{config.description}</p>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-bold tabular-nums ${config.badgeColor}`}
        >
          {applications.length}
        </span>
      </div>

      {/* Cards Scrollable Stream */}
      <div className="flex-1 space-y-3 overflow-y-auto min-h-[160px]">
        {applications.length === 0 ? (
          <div className="h-full min-h-[140px] border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 text-center text-xs text-slate-400">
            <span>No applications in this stage</span>
          </div>
        ) : (
          applications.map((app) => {
            const job = jobs.find((j) => j.id === app.jobId)
            return (
              <ApplicationCard
                key={app.id}
                application={app}
                job={job}
                student={student}
                onAdvance={onAdvance}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
