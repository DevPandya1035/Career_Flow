import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  FileText, 
  Calendar, 
  ChevronRight, 
  Award, 
  CheckCircle2, 
  Sparkles,
  MapPin
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import confetti from 'canvas-confetti'
import type { Application, Job, Student } from '../../types'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { useToast } from '../../hooks/useToast'

export interface ApplicationCardProps {
  application: Application
  job: Job | undefined
  student: Student
  onAdvance: (id: string) => void
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  job,
  student,
  onAdvance
}) => {
  const { success } = useToast()
  const [hasAcceptedOffer, setHasAcceptedOffer] = useState(false)

  if (!job) return null

  const resume = student.resumes.find((r) => r.id === application.resumeId)
  const formattedDate = format(parseISO(application.appliedAt), 'MMM dd, yyyy')

  const isSelected = application.status === 'Selected'

  const handleAcceptOffer = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    setHasAcceptedOffer(true)
    success(
      'Congratulations on your Campus Offer!',
      `You have formally accepted the placement offer from ${job.company} (${job.role}) at ₹${job.ctcLPA} LPA!`
    )
  }

  const stageVariant = {
    Applied: 'applied',
    Shortlisted: 'shortlisted',
    Assessment: 'assessment',
    Interview: 'interview',
    Selected: 'selected',
    Rejected: 'ineligible'
  }[application.status] as any

  return (
    <div className="bg-white p-4 rounded-xl border border-surface-border shadow-xs hover:shadow-md transition-all space-y-3">
      {/* Card Header: Company, Logo, Stage */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-navy/5 text-navy font-bold text-xs flex items-center justify-center shrink-0">
            {job.companyLogo || job.company[0]}
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900 leading-tight">
              {job.company}
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">{job.role}</p>
          </div>
        </div>

        <Badge variant={stageVariant} size="sm">
          {application.status}
        </Badge>
      </div>

      {/* Package & Location */}
      <div className="flex items-center justify-between text-xs text-slate-600 pt-1 pb-1 border-y border-slate-100">
        <span className="font-extrabold text-slate-900">₹{job.ctcLPA} LPA</span>
        <span className="text-slate-500 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {job.locations[0]}
        </span>
        <span className="text-slate-400 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formattedDate}
        </span>
      </div>

      {/* Next Step Nudge Message (FR13) */}
      <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs">
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">
          Current Stage Status
        </p>
        <p className="text-slate-700 leading-relaxed font-medium">
          {application.nextStep}
        </p>
      </div>

      {/* Attached Resume Indicator */}
      {resume && (
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate max-w-[200px]">{resume.filename}</span>
        </div>
      )}

      {/* Offer Acceptance CTA for Selected Stage */}
      {isSelected && (
        <div className="pt-1">
          {hasAcceptedOffer ? (
            <div className="w-full py-2 px-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold text-center border border-emerald-200 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Offer Formally Accepted</span>
            </div>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleAcceptOffer}
              className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold shadow-xs py-2"
            >
              <Award className="w-3.5 h-3.5 mr-1" />
              <span>Accept Offer Letter</span>
            </Button>
          )}
        </div>
      )}

      {/* Advance Stage (Demo Mode Button) - Walkthrough step 5 */}
      {!isSelected && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => onAdvance(application.id)}
            aria-label={`Advance stage for ${job.company}`}
            className="w-full py-1.5 px-3 rounded-lg border border-dashed border-slate-300 hover:border-primary text-slate-600 hover:text-primary text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Advance Stage (Demo)</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  )
}
