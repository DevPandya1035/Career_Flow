import React from 'react'
import { Link } from 'react-router-dom'
import { Layers, CheckCircle, Clock, Award, Users } from 'lucide-react'
import type { Application } from '../../types'

export interface StageCountChipsProps {
  applications: Application[]
}

export const StageCountChips: React.FC<StageCountChipsProps> = ({ applications }) => {
  const counts = {
    Applied: applications.filter((a) => a.status === 'Applied').length,
    Shortlisted: applications.filter((a) => a.status === 'Shortlisted').length,
    Assessment: applications.filter((a) => a.status === 'Assessment').length,
    Interview: applications.filter((a) => a.status === 'Interview').length,
    Selected: applications.filter((a) => a.status === 'Selected').length
  }

  const chips = [
    {
      stage: 'Applied',
      count: counts.Applied,
      icon: Clock,
      color: 'bg-blue-50 text-blue-700 border-blue-200/80',
      label: 'Applied'
    },
    {
      stage: 'Shortlisted',
      count: counts.Shortlisted,
      icon: Users,
      color: 'bg-amber-50 text-amber-800 border-amber-200/80',
      label: 'Shortlisted'
    },
    {
      stage: 'Assessment',
      count: counts.Assessment,
      icon: Layers,
      color: 'bg-purple-50 text-purple-700 border-purple-200/80',
      label: 'Assessment'
    },
    {
      stage: 'Interview',
      count: counts.Interview,
      icon: CheckCircle,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      label: 'Interview'
    },
    {
      stage: 'Selected',
      count: counts.Selected,
      icon: Award,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-bold',
      label: 'Offers Received'
    }
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {chips.map((chip) => {
        const Icon = chip.icon
        return (
          <Link
            key={chip.stage}
            to="/tracker"
            className="flex flex-col p-4 bg-white rounded-xl border border-surface-border shadow-xs hover:border-slate-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`p-2 rounded-lg ${chip.color}`}>
                <Icon className="w-4 h-4" />
              </span>
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {chip.count}
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-600 group-hover:text-primary transition-colors">
              {chip.label}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Click to view in tracker →
            </span>
          </Link>
        )
      })}
    </div>
  )
}
