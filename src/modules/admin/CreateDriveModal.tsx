import React, { useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { useStore } from '../../store'
import { useToast } from '../../hooks/useToast'
import { api } from '../../lib/api'
import type { Branch, JobType, CreateDriveInput, Job } from '../../types'

interface CreateDriveModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (createdJob: Job) => void
}

const ALL_BRANCHES: Branch[] = ['CS', 'IT', 'ECE', 'ME', 'CE', 'EE']
const JOB_TYPES: JobType[] = ['SWE', 'Analyst', 'Core', 'Finance', 'Consulting']

export const CreateDriveModal: React.FC<CreateDriveModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const toast = useToast()
  const jobs = useStore((state) => state.jobs)
  const setJobs = useStore.setState

  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [type, setType] = useState<JobType>('SWE')
  const [ctcLPA, setCtcLPA] = useState(24)
  const [deadline, setDeadline] = useState('2026-12-15T23:59')
  const [minCGPA, setMinCGPA] = useState(7.5)
  const [maxBacklogs, setMaxBacklogs] = useState(0)
  const [branches, setBranches] = useState<Branch[]>(['CS', 'IT'])
  const [minTenthPercent, setMinTenthPercent] = useState(70)
  const [minTwelfthPercent, setMinTwelfthPercent] = useState(70)
  const [skillsInput, setSkillsInput] = useState('Data Structures, Algorithms, System Design')
  const [roundsInput, setRoundsInput] = useState('Online Assessment, Technical Interview, HR Interview')
  const [locationsInput, setLocationsInput] = useState('Bengaluru, Hyderabad')
  const [description, setDescription] = useState('Exciting campus recruitment drive for engineering graduates.')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleBranch = (b: Branch) => {
    if (branches.includes(b)) {
      if (branches.length === 1) return // Keep at least one
      setBranches(branches.filter((x) => x !== b))
    } else {
      setBranches([...branches, b])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!company.trim()) {
      setError('Company name is required.')
      return
    }
    if (!role.trim()) {
      setError('Role title is required.')
      return
    }
    if (ctcLPA <= 0) {
      setError('CTC must be greater than 0.')
      return
    }
    if (minCGPA < 0 || minCGPA > 10) {
      setError('Minimum CGPA must be between 0.0 and 10.0.')
      return
    }
    if (branches.length === 0) {
      setError('Select at least one eligible engineering branch.')
      return
    }

    setSubmitting(true)

    const payload: CreateDriveInput = {
      company: company.trim(),
      companyLogo: company.trim().substring(0, 2).toUpperCase(),
      role: role.trim(),
      type,
      ctcLPA: Number(ctcLPA),
      deadline: new Date(deadline).toISOString(),
      minCGPA: Number(minCGPA),
      maxBacklogs: Number(maxBacklogs),
      branches,
      minTenthPercent: Number(minTenthPercent),
      minTwelfthPercent: Number(minTwelfthPercent),
      requiredSkills: skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      description: description.trim(),
      rounds: roundsInput
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean),
      locations: locationsInput
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean)
    }

    try {
      let created: Job
      try {
        created = await api.admin.createDrive(payload)
      } catch {
        // Local offline fallback
        created = {
          id: `job-${Date.now()}`,
          company: payload.company,
          companyLogo: payload.companyLogo || payload.company.substring(0, 2).toUpperCase(),
          role: payload.role,
          type: payload.type,
          ctcLPA: payload.ctcLPA,
          deadline: payload.deadline,
          eligibility: {
            minCGPA: payload.minCGPA,
            maxBacklogs: payload.maxBacklogs,
            branches: payload.branches,
            minTenthPercent: payload.minTenthPercent,
            minTwelfthPercent: payload.minTwelfthPercent,
            requiredSkills: payload.requiredSkills
          },
          description: payload.description,
          rounds: payload.rounds,
          locations: payload.locations,
          isSaved: false
        }
      }

      // Prepend to store
      setJobs({ jobs: [created, ...jobs] })
      toast.success(`Drive published successfully: ${created.company} (${created.role})`)
      onSuccess?.(created)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to publish placement drive.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Placement Drive"
      subtitle="Publish a new recruitment opportunity with eligibility cutoffs for campus students."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="company-name" className="block text-xs font-semibold text-slate-700 mb-1">
              Company Name *
            </label>
            <input
              id="company-name"
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Cisco, Uber, Oracle"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="role-title" className="block text-xs font-semibold text-slate-700 mb-1">
              Job Role / Profile *
            </label>
            <input
              id="role-title"
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Software Development Engineer"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="role-type" className="block text-xs font-semibold text-slate-700 mb-1">
              Role Domain
            </label>
            <select
              id="role-type"
              value={type}
              onChange={(e) => setType(e.target.value as JobType)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="ctc-lpa" className="block text-xs font-semibold text-slate-700 mb-1">
              Package (CTC in LPA) *
            </label>
            <input
              id="ctc-lpa"
              type="number"
              step="0.5"
              min="1"
              required
              value={ctcLPA}
              onChange={(e) => setCtcLPA(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="deadline-date" className="block text-xs font-semibold text-slate-700 mb-1">
              Application Deadline *
            </label>
            <input
              id="deadline-date"
              type="datetime-local"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Eligibility Criteria Sub-section */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3.5">
          <p className="text-xs font-bold text-navy uppercase tracking-wider">
            Mandatory Eligibility Cutoffs (FR28)
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="min-cgpa" className="block text-xs font-semibold text-slate-700 mb-1">
                Minimum CGPA (0-10)
              </label>
              <input
                id="min-cgpa"
                type="number"
                step="0.1"
                min="0"
                max="10"
                required
                value={minCGPA}
                onChange={(e) => setMinCGPA(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label htmlFor="max-backlogs" className="block text-xs font-semibold text-slate-700 mb-1">
                Max Allowed Backlogs
              </label>
              <input
                id="max-backlogs"
                type="number"
                min="0"
                max="10"
                value={maxBacklogs}
                onChange={(e) => setMaxBacklogs(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label htmlFor="min-tenth" className="block text-xs font-semibold text-slate-700 mb-1">
                  10th % Cutoff
                </label>
                <input
                  id="min-tenth"
                  type="number"
                  min="0"
                  max="100"
                  value={minTenthPercent}
                  onChange={(e) => setMinTenthPercent(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="min-twelfth" className="block text-xs font-semibold text-slate-700 mb-1">
                  12th % Cutoff
                </label>
                <input
                  id="min-twelfth"
                  type="number"
                  min="0"
                  max="100"
                  value={minTwelfthPercent}
                  onChange={(e) => setMinTwelfthPercent(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Branch Pill Toggles */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Eligible Engineering Branches *
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_BRANCHES.map((b) => {
                const active = branches.includes(b)
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleBranch(b)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      active
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {b}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Skills, Rounds, Description */}
        <div className="space-y-3">
          <div>
            <label htmlFor="required-skills" className="block text-xs font-semibold text-slate-700 mb-1">
              Required Skills (comma-separated)
            </label>
            <input
              id="required-skills"
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. React, Python, SQL"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="test-rounds" className="block text-xs font-semibold text-slate-700 mb-1">
                Interview / Test Rounds (comma-separated)
              </label>
              <input
                id="test-rounds"
                type="text"
                value={roundsInput}
                onChange={(e) => setRoundsInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label htmlFor="job-locations" className="block text-xs font-semibold text-slate-700 mb-1">
                Job Locations (comma-separated)
              </label>
              <input
                id="job-locations"
                type="text"
                value={locationsInput}
                onChange={(e) => setLocationsInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="job-desc" className="block text-xs font-semibold text-slate-700 mb-1">
              Role & Drive Description
            </label>
            <textarea
              id="job-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all disabled:opacity-50"
          >
            {submitting ? 'Publishing...' : 'Publish Placement Drive'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

