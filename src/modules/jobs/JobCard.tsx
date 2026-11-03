import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Bookmark, 
  MapPin, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ExternalLink
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import type { Job, Student } from '../../types'
import { checkEligibility, getSkillsGap } from '../../lib/eligibility'
import { EligibilityPill } from '../../components/ui/EligibilityPill'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'

export interface JobCardProps {
  job: Job
  student: Student
  isApplied: boolean
  isSaved: boolean
  onApply: (job: Job) => void
  onToggleSave: (jobId: string) => void
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  student,
  isApplied,
  isSaved,
  onApply,
  onToggleSave
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const eligibility = checkEligibility(student, job)
  const skillsGap = getSkillsGap(student, job)

  const firstFailedReason =
    eligibility.fail.length > 0
      ? `${eligibility.fail[0].criterion}: Your ${eligibility.fail[0].studentValue}, required ${eligibility.fail[0].required}`
      : undefined

  const formattedDeadline = format(parseISO(job.deadline), 'MMM dd, yyyy')

  return (
    <article
      data-testid={`job-card-${job.id}`}
      aria-labelledby={`job-title-${job.id}`}
      className="bg-white rounded-xl border border-surface-border shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
    >
      <div className="p-5 md:p-6">
        {/* Top Header: Logo, Company & Role, Save Bookmark */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-navy/5 text-navy font-bold text-base flex items-center justify-center shrink-0 border border-slate-200/50">
              {job.companyLogo || job.company.substring(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  id={`job-title-${job.id}`}
                  className="font-bold text-base text-slate-900 leading-tight"
                >
                  {job.company}
                </h3>
                <EligibilityPill isEligible={eligibility.isEligible} size="sm" />
              </div>
              <p className="text-sm font-medium text-slate-700 mt-0.5">{job.role}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onToggleSave(job.id)}
            aria-label={isSaved ? `Unsave ${job.company} drive` : `Save ${job.company} drive`}
            className={`p-2 rounded-lg transition-colors shrink-0 ${
              isSaved
                ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Key Metrics: CTC, Type, Location, Deadline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3.5 p-3 bg-slate-50/80 rounded-lg text-xs text-slate-600 border border-slate-100">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Package</span>
            <span className="font-extrabold text-slate-900 text-sm">₹{job.ctcLPA} LPA</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Role Type</span>
            <span className="font-medium text-slate-800">{job.type}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Location</span>
            <span className="font-medium text-slate-800 flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              {job.locations[0]}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Closes On</span>
            <span className="font-medium text-slate-800 flex items-center gap-1 truncate">
              <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
              {formattedDeadline}
            </span>
          </div>
        </div>

        {/* Quick Criteria Summary */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mb-2">
          <span className="font-medium text-slate-500">Eligibility Criteria:</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
            CGPA ≥ {job.eligibility.minCGPA}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
            {job.eligibility.branches.join(', ')}
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
            Max {job.eligibility.maxBacklogs} backlogs
          </span>
        </div>

        {/* Expandable Criteria & Description Drawer */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-700 space-y-3 animate-in fade-in duration-200">
            <div>
              <p className="font-bold text-slate-900 mb-1">Job Description</p>
              <p className="text-slate-600 leading-relaxed text-xs">{job.description}</p>
            </div>

            <div>
              <p className="font-bold text-slate-900 mb-1">Selection Rounds</p>
              <div className="flex flex-wrap gap-1.5">
                {job.rounds.map((round, idx) => (
                  <Badge key={idx} variant="default" size="sm">
                    {idx + 1}. {round}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="font-bold text-slate-900 mb-1">Skills Compatibility</p>
              <div className="flex flex-wrap gap-1.5">
                {skillsGap.matched.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-medium border border-emerald-200"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {skill}
                  </span>
                ))}
                {skillsGap.missing.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[11px] font-medium border border-amber-200"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {skill} (Recommended)
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-1">
              <Link
                to={`/eligibility?job=${job.id}`}
                className="text-primary hover:underline font-semibold inline-flex items-center gap-1 text-xs"
              >
                <span>Run what-if scenario in Eligibility Checker</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Card Actions Footer: Fitts's Law 48px Height & Balanced Layout */}
      <div className="px-5 py-3.5 bg-slate-50/70 border-t border-surface-border flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
        >
          <span>{isExpanded ? 'Hide details' : 'View details'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center gap-2">
          {isApplied ? (
            <div className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#E2F4EF] text-[#0B7662] font-bold text-xs border border-[#0B7662]/30">
              <CheckCircle2 className="w-4 h-4 text-[#0B7662]" />
              <span>Application Submitted</span>
            </div>
          ) : (
            <Button
              variant="primary"
              size="md"
              disabled={!eligibility.isEligible}
              disabledReason={firstFailedReason}
              onClick={() => onApply(job)}
              className="h-11 min-w-[130px] font-bold text-sm shadow-sm"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              <span>Apply Now</span>
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
