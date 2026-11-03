import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ChevronRight, Clock } from 'lucide-react'
import { differenceInDays, parseISO } from 'date-fns'
import type { Job } from '../../types'

export interface DeadlineWidgetProps {
  jobs: Job[]
  appliedJobIds: string[]
}

export const DeadlineWidget: React.FC<DeadlineWidgetProps> = ({ jobs, appliedJobIds }) => {
  // Filter jobs not yet applied to, sorted by nearest deadline
  const upcomingJobs = jobs
    .filter((j) => !appliedJobIds.includes(j.id))
    .map((j) => {
      const days = differenceInDays(parseISO(j.deadline), new Date())
      return { ...j, daysRemaining: Math.max(days, 0) }
    })
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 4)

  return (
    <div className="space-y-3">
      {upcomingJobs.length === 0 ? (
        <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 rounded-lg">
          No upcoming deadlines for unapplied drives.
        </div>
      ) : (
        upcomingJobs.map((job) => {
          const isUrgent = job.daysRemaining <= 3

          return (
            <Link
              key={job.id}
              to="/jobs"
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-navy/5 text-navy font-bold text-xs flex items-center justify-center shrink-0">
                  {job.companyLogo || job.company[0]}
                </div>
                <div>
                  <h5 className="font-semibold text-xs text-slate-900 group-hover:text-primary transition-colors">
                    {job.company}
                  </h5>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {job.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isUrgent
                      ? 'bg-[#FFF3D6] text-[#8A5A00] border border-[#8A5A00]/20'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>{job.daysRemaining === 0 ? 'Today' : `${job.daysRemaining} days left`}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          )
        })
      )}

      <div className="pt-1 text-center">
        <Link
          to="/jobs"
          className="text-xs font-semibold text-primary hover:text-primary-hover inline-flex items-center gap-1"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>View all upcoming drive deadlines</span>
        </Link>
      </div>
    </div>
  )
}
