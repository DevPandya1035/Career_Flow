import React, { useState, useEffect } from 'react'
import { GraduationCap, AlertCircle, Save } from 'lucide-react'
import { useStore } from '../../store'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../hooks/useToast'
import type { Branch } from '../../types'

const BRANCH_OPTIONS: { value: Branch; label: string }[] = [
  { value: 'CS', label: 'Computer Science & Engineering (CS)' },
  { value: 'IT', label: 'Information Technology (IT)' },
  { value: 'ECE', label: 'Electronics & Communication (ECE)' },
  { value: 'ME', label: 'Mechanical Engineering (ME)' },
  { value: 'CE', label: 'Civil Engineering (CE)' },
  { value: 'EE', label: 'Electrical Engineering (EE)' }
]

export const AcademicForm: React.FC = () => {
  const student = useStore((state) => state.student)
  const updateStudentProfile = useStore((state) => state.updateStudentProfile)
  const { success } = useToast()

  const [formData, setFormData] = useState({
    name: student.name,
    email: student.email,
    branch: student.branch,
    year: student.year,
    cgpa: student.cgpa.toString(),
    tenthPercent: student.tenthPercent.toString(),
    twelfthPercent: student.twelfthPercent.toString(),
    backlogs: student.backlogs.toString()
  })

  useEffect(() => {
    setFormData({
      name: student.name,
      email: student.email,
      branch: student.branch,
      year: student.year,
      cgpa: student.cgpa.toString(),
      tenthPercent: student.tenthPercent.toString(),
      twelfthPercent: student.twelfthPercent.toString(),
      backlogs: student.backlogs.toString()
    })
  }, [student])

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    const cgpaNum = parseFloat(formData.cgpa)
    if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
      errs.cgpa = 'CGPA must be between 0.0 and 10.0'
    }

    const backlogsNum = parseInt(formData.backlogs, 10)
    if (isNaN(backlogsNum) || backlogsNum < 0) {
      errs.backlogs = 'Backlogs must be 0 or greater'
    }

    const tenthNum = parseFloat(formData.tenthPercent)
    if (isNaN(tenthNum) || tenthNum < 0 || tenthNum > 100) {
      errs.tenthPercent = '10th percentage must be between 0 and 100'
    }

    const twelfthNum = parseFloat(formData.twelfthPercent)
    if (isNaN(twelfthNum) || twelfthNum < 0 || twelfthNum > 100) {
      errs.twelfthPercent = '12th percentage must be between 0 and 100'
    }

    if (!formData.name.trim()) {
      errs.name = 'Full name is required'
    }

    return errs
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const updated = { ...formData, [name]: value }
    setFormData(updated)

    // Live validation
    const errs: Record<string, string> = {}
    const cgpaNum = parseFloat(name === 'cgpa' ? value : updated.cgpa)
    if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
      errs.cgpa = 'CGPA must be between 0.0 and 10.0'
    }

    const backlogsNum = parseInt(name === 'backlogs' ? value : updated.backlogs, 10)
    if (isNaN(backlogsNum) || backlogsNum < 0) {
      errs.backlogs = 'Backlogs must be 0 or greater'
    }

    const tenthNum = parseFloat(name === 'tenthPercent' ? value : updated.tenthPercent)
    if (isNaN(tenthNum) || tenthNum < 0 || tenthNum > 100) {
      errs.tenthPercent = '10th percentage must be between 0 and 100'
    }

    const twelfthNum = parseFloat(name === 'twelfthPercent' ? value : updated.twelfthPercent)
    if (isNaN(twelfthNum) || twelfthNum < 0 || twelfthNum > 100) {
      errs.twelfthPercent = '12th percentage must be between 0 and 100'
    }

    setErrors(errs)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    updateStudentProfile({
      name: formData.name.trim(),
      email: formData.email.trim(),
      branch: formData.branch as Branch,
      year: parseInt(formData.year.toString(), 10),
      cgpa: parseFloat(formData.cgpa),
      tenthPercent: parseFloat(formData.tenthPercent),
      twelfthPercent: parseFloat(formData.twelfthPercent),
      backlogs: parseInt(formData.backlogs, 10)
    })

    success('Profile Updated', 'Your academic records and personal details have been saved.')
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <div className="bg-white p-6 rounded-xl border border-surface-border shadow-xs space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-surface-border">
        <GraduationCap className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-slate-900">Academic & Personal Details</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label htmlFor="student-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              id="student-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
            {errors.name && (
              <p className="text-xs text-danger mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="student-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              College Email
            </label>
            <input
              id="student-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Branch */}
          <div>
            <label htmlFor="student-branch" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Engineering Branch
            </label>
            <select
              id="student-branch"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              {BRANCH_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label htmlFor="student-year" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Academic Year
            </label>
            <select
              id="student-year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              <option value={1}>1st Year (Freshman)</option>
              <option value={2}>2nd Year (Sophomore)</option>
              <option value={3}>3rd Year (Pre-final)</option>
              <option value={4}>4th Year (Final Year)</option>
            </select>
          </div>

          {/* Current CGPA */}
          <div>
            <label htmlFor="student-cgpa" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Current CGPA
            </label>
            <input
              id="student-cgpa"
              name="cgpa"
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={formData.cgpa}
              onChange={handleChange}
              aria-invalid={!!errors.cgpa}
              aria-describedby={errors.cgpa ? 'cgpa-error' : undefined}
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.cgpa
                  ? 'border-danger focus:ring-danger/20 text-danger'
                  : 'border-slate-200 focus:ring-primary focus:border-transparent'
              }`}
              required
            />
            {errors.cgpa && (
              <p id="cgpa-error" className="text-xs text-danger mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.cgpa}
              </p>
            )}
          </div>

          {/* Active Backlogs */}
          <div>
            <label htmlFor="student-backlogs" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Active Backlogs
            </label>
            <input
              id="student-backlogs"
              name="backlogs"
              type="number"
              min="0"
              value={formData.backlogs}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.backlogs
                  ? 'border-danger focus:ring-danger/20'
                  : 'border-slate-200 focus:ring-primary focus:border-transparent'
              }`}
              required
            />
            {errors.backlogs && (
              <p className="text-xs text-danger mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.backlogs}
              </p>
            )}
          </div>

          {/* 10th Grade */}
          <div>
            <label htmlFor="student-tenth" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              10th Grade Percentage (%)
            </label>
            <input
              id="student-tenth"
              name="tenthPercent"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={formData.tenthPercent}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.tenthPercent
                  ? 'border-danger focus:ring-danger/20'
                  : 'border-slate-200 focus:ring-primary focus:border-transparent'
              }`}
              required
            />
            {errors.tenthPercent && (
              <p className="text-xs text-danger mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.tenthPercent}
              </p>
            )}
          </div>

          {/* 12th Grade */}
          <div>
            <label htmlFor="student-twelfth" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              12th Grade Percentage (%)
            </label>
            <input
              id="student-twelfth"
              name="twelfthPercent"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={formData.twelfthPercent}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.twelfthPercent
                  ? 'border-danger focus:ring-danger/20'
                  : 'border-slate-200 focus:ring-primary focus:border-transparent'
              }`}
              required
            />
            {errors.twelfthPercent && (
              <p className="text-xs text-danger mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.twelfthPercent}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-surface-border">
          <Button
            type="submit"
            disabled={hasErrors}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
