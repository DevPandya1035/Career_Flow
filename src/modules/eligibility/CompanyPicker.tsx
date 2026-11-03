import React from 'react'
import { Building2 } from 'lucide-react'
import type { Job } from '../../types'

export interface CompanyPickerProps {
  jobs: Job[]
  selectedJobId: string
  onSelect: (id: string) => void
}

export const CompanyPicker: React.FC<CompanyPickerProps> = ({
  jobs,
  selectedJobId,
  onSelect
}) => {
  return (
    <div>
      <label
        htmlFor="company-select"
        className="block text-xs font-bold text-slate-900 mb-1.5"
      >
        Target Company & Role
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Building2 className="w-4 h-4" />
        </div>
        <select
          id="company-select"
          aria-label="Select Company"
          value={selectedJobId}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
        >
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.company} — {job.role} (₹{job.ctcLPA} LPA)
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
