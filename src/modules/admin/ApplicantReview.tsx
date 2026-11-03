import React, { useEffect, useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Filter, 
  FileText, 
  Building2, 
  ChevronRight, 
  AlertTriangle,
  Award,
  Sparkles
} from 'lucide-react'
import { useStore } from '../../store'
import { useToast } from '../../hooks/useToast'
import { api } from '../../lib/api'
import { checkEligibility } from '../../lib/eligibility'
import type { ApplicantReviewItem, ApplicationStatus, Student, Job } from '../../types'

const MOCK_BATCH_STUDENTS: Student[] = [
  {
    id: 'student-priya',
    name: 'Priya Sharma',
    email: 'priya.sharma@campus.edu',
    branch: 'CS',
    year: 4,
    cgpa: 9.1,
    tenthPercent: 92,
    twelfthPercent: 90,
    backlogs: 0,
    skills: ['React', 'TypeScript', 'Node.js', 'System Design'],
    resumes: [{ id: 'res-priya-1', filename: 'Priya_Sharma_Resume.pdf', sizeKB: 180, uploadedAt: '2026-10-01', isPrimary: true }],
    preferences: { roles: ['SWE'], locations: ['Bengaluru'] }
  },
  {
    id: 'student-ananya',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@campus.edu',
    branch: 'IT',
    year: 4,
    cgpa: 8.8,
    tenthPercent: 88,
    twelfthPercent: 86,
    backlogs: 0,
    skills: ['Python', 'SQL', 'FastAPI', 'Algorithms'],
    resumes: [{ id: 'res-ananya-1', filename: 'Ananya_Iyer_Resume.pdf', sizeKB: 210, uploadedAt: '2026-10-05', isPrimary: true }],
    preferences: { roles: ['SWE', 'Analyst'], locations: ['Hyderabad'] }
  },
  {
    id: 'student-rohan',
    name: 'Rohan Patel',
    email: 'rohan.patel@campus.edu',
    branch: 'ME',
    year: 4,
    cgpa: 6.8,
    tenthPercent: 72,
    twelfthPercent: 68,
    backlogs: 1,
    skills: ['SolidWorks', 'MATLAB', 'C++'],
    resumes: [{ id: 'res-rohan-1', filename: 'Rohan_Patel_ME.pdf', sizeKB: 195, uploadedAt: '2026-10-10', isPrimary: true }],
    preferences: { roles: ['Core'], locations: ['Pune'] }
  }
]

export const ApplicantReview: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const toast = useToast()
  const jobs = useStore((state) => state.jobs)
  const student = useStore((state) => state.student)
  const applications = useStore((state) => state.applications)
  const updateApplicationStatus = useStore((state) => state.updateApplicationStatus)

  const initialJobId = searchParams.get('jobId') || jobs[0]?.id || ''
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId)
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL')
  const [applicants, setApplicants] = useState<ApplicantReviewItem[]>([])
  const [loading, setLoading] = useState(false)
  const [isShortlisting, setIsShortlisting] = useState(false)

  const selectedJob = useMemo(
    () => jobs.find((j) => j.id === selectedJobId) || jobs[0],
    [jobs, selectedJobId]
  )

  // Fetch or generate applicants for selected drive
  useEffect(() => {
    if (!selectedJob) return
    setLoading(true)

    let isMounted = true
    api.admin.getApplicants(selectedJob.id)
      .then((data) => {
        if (isMounted) {
          // If server returns applicants, use them
          if (data && data.length > 0) {
            setApplicants(data)
          } else {
            generateLocalApplicants(selectedJob)
          }
          setLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          generateLocalApplicants(selectedJob)
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [selectedJob?.id])

  const generateLocalApplicants = (currentJob: Job) => {
    // Collect Aarav if applied
    const candidatePool: { std: Student; appStatus: ApplicationStatus; appId: string }[] = []

    const aaravApp = applications.find((a) => a.jobId === currentJob.id)
    if (aaravApp) {
      candidatePool.push({
        std: student,
        appStatus: aaravApp.status,
        appId: aaravApp.id
      })
    } else {
      // Show Aarav as Applied by default so reviewer has active applicant
      candidatePool.push({
        std: student,
        appStatus: 'Applied',
        appId: `app-${student.id}-${currentJob.id}`
      })
    }

    // Add mock batch candidates
    for (const mockStd of MOCK_BATCH_STUDENTS) {
      candidatePool.push({
        std: mockStd,
        appStatus: 'Applied',
        appId: `app-${mockStd.id}-${currentJob.id}`
      })
    }

    const items: ApplicantReviewItem[] = candidatePool.map(({ std, appStatus, appId }) => {
      const evalResult = checkEligibility(std, currentJob)
      return {
        id: appId,
        applicationId: appId,
        studentId: std.id,
        student: std,
        resume: std.resumes[0] || null,
        status: appStatus,
        appliedAt: new Date().toISOString(),
        nextStep: appStatus === 'Shortlisted' ? 'Shortlisted for assessment' : 'Under screening',
        isEligible: evalResult.isEligible,
        passedCriteria: evalResult.pass.length,
        failedCriteria: evalResult.fail.length,
        failedReasons: evalResult.fail.map(
          (f) => `${f.criterion}: student has ${f.studentValue}, cutoff requires ${f.required}`
        )
      }
    })

    setApplicants(items)
  }

  const handleDriveChange = (jobId: string) => {
    setSelectedJobId(jobId)
    setSearchParams({ jobId })
  }

  // 1-Click Bulk Auto-Shortlist (FR31)
  const handleBulkAutoShortlist = async () => {
    if (!selectedJob) return
    setIsShortlisting(true)

    try {
      let shortlistedCount = 0
      try {
        const res = await api.admin.autoShortlist(selectedJob.id)
        shortlistedCount = res.shortlistedCount
      } catch {
        // Local state fallback
        shortlistedCount = applicants.filter(
          (a) => a.isEligible && a.status === 'Applied'
        ).length
      }

      // Update local applicants list
      setApplicants((prev) =>
        prev.map((item) => {
          if (item.isEligible && item.status === 'Applied') {
            // Also update global store if it matches Aarav's app
            const matchApp = applications.find((a) => a.jobId === selectedJob.id)
            if (matchApp && item.student.id === student.id) {
              updateApplicationStatus(matchApp.id, 'Shortlisted')
            }
            return {
              ...item,
              status: 'Shortlisted',
              nextStep: 'Shortlisted based on corporate eligibility criteria.'
            }
          }
          return item
        })
      )

      toast.success(
        `Bulk Auto-Shortlist complete! Shortlisted qualifying candidates for ${selectedJob.company}.`
      )
    } catch {
      toast.error('Failed to run bulk auto-shortlist.')
    } finally {
      setIsShortlisting(false)
    }
  }

  // Stage advancement per candidate
  const handleStageChange = async (appId: string, newStatus: ApplicationStatus) => {
    try {
      try {
        await api.admin.updateApplicantStage(appId, newStatus)
      } catch {
        // Offline fallback
      }

      setApplicants((prev) =>
        prev.map((item) =>
          item.id === appId
            ? { ...item, status: newStatus, nextStep: `Candidate moved to ${newStatus} round.` }
            : item
        )
      )

      // Also update store if this was an active application
      updateApplicationStatus(appId, newStatus)
      toast.info(`Candidate stage updated to: ${newStatus}`)
    } catch {
      toast.error('Failed to update stage.')
    }
  }

  const filteredApplicants = applicants.filter((item) => {
    if (selectedStatusFilter === 'ALL') return true
    return item.status === selectedStatusFilter
  })

  const eligibleCount = applicants.filter((a) => a.isEligible).length
  const appliedCount = applicants.filter((a) => a.status === 'Applied' && a.isEligible).length

  if (!selectedJob) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-slate-600">No active placement drives found.</p>
        <Link to="/admin/drives" className="text-primary font-semibold text-sm mt-2 inline-block">
          Create a Placement Drive →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Drive Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy tracking-tight">
            Applicant Review & Verification
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Evaluate candidate eligibility against corporate cutoffs and run automated stage shortlisting.
          </p>
        </div>

        {/* Drive Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="drive-select" className="text-xs font-semibold text-slate-700 shrink-0">
            Select Drive:
          </label>
          <select
            id="drive-select"
            value={selectedJob.id}
            onChange={(e) => handleDriveChange(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-navy shadow-xs focus:ring-2 focus:ring-primary/20"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.company} — {job.role} (₹{job.ctcLPA} LPA)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Published Criteria Cutoffs Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-navy font-bold flex items-center justify-center text-sm shrink-0 border border-slate-200">
              {selectedJob.companyLogo || selectedJob.company.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-navy">{selectedJob.company}</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                  {selectedJob.type}
                </span>
                <span className="font-bold text-xs text-primary">₹{selectedJob.ctcLPA} LPA</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{selectedJob.role}</p>
            </div>
          </div>

          {/* Published Cutoffs Summary */}
          <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Min CGPA</span>
              <span className="font-bold text-navy">{selectedJob.eligibility.minCGPA.toFixed(1)}</span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Max Backlogs</span>
              <span className="font-bold text-navy">{selectedJob.eligibility.maxBacklogs}</span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">10th / 12th</span>
              <span className="font-bold text-navy">
                {selectedJob.eligibility.minTenthPercent}% / {selectedJob.eligibility.minTwelfthPercent}%
              </span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Eligible Branches</span>
              <div className="flex gap-1 mt-0.5">
                {selectedJob.eligibility.branches.map((b) => (
                  <span key={b} className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 1-Click Bulk Auto-Shortlist Button (FR31) */}
          <button
            onClick={handleBulkAutoShortlist}
            disabled={isShortlisting || appliedCount === 0}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-primary-hover shadow-sm transition-all shrink-0 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>
              {isShortlisting
                ? 'Evaluating & Shortlisting...'
                : `Bulk Auto-Shortlist (${appliedCount} Qualifying)`}
            </span>
          </button>
        </div>
      </div>

      {/* Filters & Status Counters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700">Filter Stage:</span>
          {(['ALL', 'Applied', 'Shortlisted', 'Assessment', 'Interview', 'Selected', 'Rejected'] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setSelectedStatusFilter(status)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedStatusFilter === status
                    ? 'bg-navy text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-navy">{filteredApplicants.length}</span> of {applicants.length} candidates
          ({eligibleCount} verified eligible)
        </div>
      </div>

      {/* Applicants Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                <th className="py-3 px-4">Student Candidate</th>
                <th className="py-3 px-4">Academic Metrics</th>
                <th className="py-3 px-4">10th / 12th / Backlogs</th>
                <th className="py-3 px-4">Eligibility Audit</th>
                <th className="py-3 px-4">Resume</th>
                <th className="py-3 px-4">Application Stage</th>
                <th className="py-3 px-4 text-right">Advance Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500">
                    No applicants found matching stage filter "{selectedStatusFilter}".
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((item) => {
                  const s = item.student
                  const meetsCGPA = s.cgpa >= selectedJob.eligibility.minCGPA

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Candidate info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                            {s.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{s.name}</span>
                            <span className="text-[11px] text-slate-500">{s.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Academics: Branch & CGPA */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 mr-2">
                            {s.branch}
                          </span>
                          <span className={`font-bold ${meetsCGPA ? 'text-emerald-700' : 'text-amber-700'}`}>
                            CGPA {s.cgpa.toFixed(1)}
                          </span>
                        </div>
                      </td>

                      {/* 10th / 12th / Backlogs */}
                      <td className="py-3 px-4 text-[11px] text-slate-600">
                        <div>10th: {s.tenthPercent}% • 12th: {s.twelfthPercent}%</div>
                        <div className={s.backlogs > 0 ? 'text-red-600 font-semibold' : 'text-slate-500'}>
                          Backlogs: {s.backlogs}
                        </div>
                      </td>

                      {/* Verified Eligibility Audit Badge */}
                      <td className="py-3 px-4">
                        {item.isEligible ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Eligible</span>
                          </span>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200/60" title={item.failedReasons.join(', ')}>
                            <XCircle className="w-3.5 h-3.5 text-red-600" />
                            <span>Ineligible</span>
                          </div>
                        )}
                      </td>

                      {/* Resume link */}
                      <td className="py-3 px-4">
                        {item.resume ? (
                          <a
                            href={item.resume.url || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-slate-600 hover:text-primary font-medium text-[11px]"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate max-w-[120px]">{item.resume.filename}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 text-[11px]">No resume</span>
                        )}
                      </td>

                      {/* Application status badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            item.status === 'Selected'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Shortlisted'
                              ? 'bg-blue-100 text-blue-800'
                              : item.status === 'Interview'
                              ? 'bg-purple-100 text-purple-800'
                              : item.status === 'Assessment'
                              ? 'bg-amber-100 text-amber-800'
                              : item.status === 'Rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Advance Stage Control */}
                      <td className="py-3 px-4 text-right">
                        <select
                          aria-label={`Change stage for ${s.name}`}
                          value={item.status}
                          onChange={(e) =>
                            handleStageChange(item.id, e.target.value as ApplicationStatus)
                          }
                          className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Assessment">Assessment</option>
                          <option value="Interview">Interview</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
