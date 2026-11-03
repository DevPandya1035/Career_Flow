import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Users, 
  Archive, 
  Calendar, 
  Briefcase, 
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useStore } from '../../store'
import { useToast } from '../../hooks/useToast'
import { api } from '../../lib/api'
import { CreateDriveModal } from './CreateDriveModal'
import type { Branch, JobType, Job } from '../../types'

export const DriveManager: React.FC = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const jobs = useStore((state) => state.jobs)
  const setJobs = useStore.setState
  const applications = useStore((state) => state.applications)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL')
  const [selectedType, setSelectedType] = useState<string>('ALL')

  const handleArchiveDrive = async (jobId: string, company: string) => {
    if (!confirm(`Are you sure you want to archive the ${company} recruitment drive?`)) {
      return
    }

    try {
      try {
        await api.admin.archiveDrive(jobId)
      } catch {
        // Fallback for offline mode
      }
      setJobs({ jobs: jobs.filter((j) => j.id !== jobId) })
      toast.info(`Recruitment drive for ${company} has been archived.`)
    } catch {
      toast.error('Failed to archive drive.')
    }
  }

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      j.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBranch =
      selectedBranch === 'ALL' || j.eligibility.branches.includes(selectedBranch as Branch)
    const matchesType = selectedType === 'ALL' || j.type === selectedType
    return matchesSearch && matchesBranch && matchesType
  })

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy tracking-tight">
            Placement Drives & Criteria Management
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Define corporate eligibility cutoffs, test rounds, and manage active campus recruitment drives.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover shadow-sm transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Placement Drive</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company or role title..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Branches</option>
            <option value="CS">CS</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="ME">ME</option>
            <option value="CE">CE</option>
            <option value="EE">EE</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Roles</option>
            <option value="SWE">SWE</option>
            <option value="Analyst">Analyst</option>
            <option value="Core">Core</option>
            <option value="Finance">Finance</option>
            <option value="Consulting">Consulting</option>
          </select>
        </div>
      </div>

      {/* Drives Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                <th className="py-3 px-4">Company & Role</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Package</th>
                <th className="py-3 px-4">Cutoff Criteria (FR28)</th>
                <th className="py-3 px-4">Eligible Branches</th>
                <th className="py-3 px-4">Applicants</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    No placement drives match the current filters.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => {
                  const applicantCount = applications.filter((a) => a.jobId === job.id).length
                  const deadlineDate = new Date(job.deadline)
                  const isExpired = deadlineDate.getTime() < Date.now()

                  return (
                    <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-200">
                            {job.companyLogo || job.company.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block text-sm">
                              {job.company}
                            </span>
                            <span className="text-slate-500 text-xs">{job.role}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded font-semibold text-[11px] bg-slate-100 text-slate-700">
                          {job.type}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ₹{job.ctcLPA} LPA
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 text-[11px] text-slate-600">
                          <div>
                            <span className="font-semibold text-slate-700">Min CGPA: </span>
                            <span className="font-bold text-navy">{job.eligibility.minCGPA.toFixed(1)}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-700">Max Backlogs: </span>
                            <span>{job.eligibility.maxBacklogs}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-700">10th/12th: </span>
                            <span>{job.eligibility.minTenthPercent}% / {job.eligibility.minTwelfthPercent}%</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {job.eligibility.branches.map((b) => (
                            <span
                              key={b}
                              className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/50"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/50">
                          <Users className="w-3 h-3" />
                          <span>{applicantCount} applied</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/applicants?jobId=${job.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>Review</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleArchiveDrive(job.id, job.company)}
                            aria-label={`Archive ${job.company} drive`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateDriveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
