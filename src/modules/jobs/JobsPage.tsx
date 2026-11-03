import React, { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, ArrowUpDown, Briefcase, RotateCcw } from 'lucide-react'
import { parseISO } from 'date-fns'
import { useStore } from '../../store'
import { checkEligibility } from '../../lib/eligibility'
import { useToast } from '../../hooks/useToast'
import type { Job } from '../../types'
import { JobCard } from './JobCard'
import { JobFilters } from './JobFilters'
import { ApplyModal } from './ApplyModal'
import { Button } from '../../components/ui/Button'

export const JobsPage: React.FC = () => {
  const jobs = useStore((state) => state.jobs)
  const student = useStore((state) => state.student)
  const savedJobIds = useStore((state) => state.savedJobIds)
  const toggleSaveJob = useStore((state) => state.toggleSaveJob)
  const applications = useStore((state) => state.applications)
  const addApplication = useStore((state) => state.addApplication)
  const filters = useStore((state) => state.filters)
  const updateFilters = useStore((state) => state.updateFilters)
  const resetFilters = useStore((state) => state.resetFilters)
  const searchQuery = useStore((state) => state.searchQuery)
  const setSearchQuery = useStore((state) => state.setSearchQuery)

  const { success, error } = useToast()
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const appliedJobIds = useMemo(() => applications.map((a) => a.jobId), [applications])

  // Client-side filtering & sorting engine
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        // 1. Text Search Filter (company, role, skills, description)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchesCompany = job.company.toLowerCase().includes(q)
          const matchesRole = job.role.toLowerCase().includes(q)
          const matchesSkills = job.eligibility.requiredSkills.some((s) =>
            s.toLowerCase().includes(q)
          )
          const matchesDesc = job.description.toLowerCase().includes(q)
          if (!matchesCompany && !matchesRole && !matchesSkills && !matchesDesc) {
            return false
          }
        }

        // 2. Eligible Only Filter (HCI Walkthrough step 1)
        if (filters.showEligibleOnly) {
          const { isEligible } = checkEligibility(student, job)
          if (!isEligible) return false
        }

        // 3. Saved Only Filter (HCI Issue I1)
        if (filters.showSavedOnly && !savedJobIds.includes(job.id)) {
          return false
        }

        // 4. Minimum CTC
        if (filters.minCTC > 0 && job.ctcLPA < filters.minCTC) {
          return false
        }

        // 5. Role Types
        if (filters.roleTypes.length > 0 && !filters.roleTypes.includes(job.type)) {
          return false
        }

        // 6. Branches
        if (
          filters.branches.length > 0 &&
          !filters.branches.some((b) => job.eligibility.branches.includes(b))
        ) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        if (filters.sortBy === 'deadline') {
          return parseISO(a.deadline).getTime() - parseISO(b.deadline).getTime()
        }
        if (filters.sortBy === 'ctc-desc') {
          return b.ctcLPA - a.ctcLPA
        }
        if (filters.sortBy === 'company') {
          return a.company.localeCompare(b.company)
        }
        return 0
      })
  }, [jobs, student, savedJobIds, filters, searchQuery])

  const handleApplySubmit = ({ jobId, resumeId }: { jobId: string; resumeId: string }) => {
    const job = jobs.find((j) => j.id === jobId)
    const resume = student.resumes.find((r) => r.id === resumeId)

    const submitted = addApplication({ jobId, resumeId })
    if (submitted) {
      success(
        'Application Submitted Successfully!',
        `Your application for ${job?.company} (${job?.role}) with resume "${resume?.filename}" is now tracked in your pipeline.`
      )
      setSelectedJobForApply(null)
    } else {
      error('Application Error', 'You have already submitted an application for this drive.')
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-surface-border">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" />
            <span>Campus Opportunities</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover company drives, check criteria with zero ambiguity, and apply safely.
          </p>
        </div>

        {/* Mobile Filter Toggle & Sort Menu */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden text-xs font-semibold"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
            <span>Filters</span>
          </Button>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <label htmlFor="sort-jobs" className="text-xs text-slate-500 font-medium">Sort:</label>
            <select
              id="sort-jobs"
              value={filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="deadline">Closing Soonest</option>
              <option value="ctc-desc">Highest CTC</option>
              <option value="company">Company (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar (1 col) + Jobs Grid (3 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-20">
          <JobFilters
            filters={filters}
            savedCount={savedJobIds.length}
            totalJobs={jobs.length}
            filteredCount={filteredJobs.length}
            onChange={updateFilters}
            onReset={resetFilters}
          />
        </div>

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <div className="lg:hidden col-span-1">
            <JobFilters
              filters={filters}
              savedCount={savedJobIds.length}
              totalJobs={jobs.length}
              filteredCount={filteredJobs.length}
              onChange={updateFilters}
              onReset={resetFilters}
            />
          </div>
        )}

        {/* Opportunities Card Stream */}
        <div className="col-span-1 lg:col-span-3 space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-surface-border shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No drives match your filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your minimum CTC, removing specific branch criteria, or clearing the search query.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="text-xs font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                <span>Clear All Filters</span>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  student={student}
                  isApplied={appliedJobIds.includes(job.id)}
                  isSaved={savedJobIds.includes(job.id)}
                  onApply={(j) => setSelectedJobForApply(j)}
                  onToggleSave={toggleSaveJob}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Two-Step Confirmation Apply Modal (FR11) */}
      <ApplyModal
        isOpen={!!selectedJobForApply}
        job={selectedJobForApply}
        student={student}
        onClose={() => setSelectedJobForApply(null)}
        onSubmit={handleApplySubmit}
      />
    </div>
  )
}

export default JobsPage
