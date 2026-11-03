import React from 'react'
import { Filter, RotateCcw, Bookmark, CheckCircle2 } from 'lucide-react'
import type { JobType, Branch } from '../../types'
import type { JobFilters as FiltersType } from '../../store/jobsSlice'
import { Button } from '../../components/ui/Button'

export interface JobFiltersProps {
  filters: FiltersType
  savedCount: number
  totalJobs: number
  filteredCount: number
  onChange: (updates: Partial<FiltersType>) => void
  onReset: () => void
}

const ROLE_TYPES: JobType[] = ['SWE', 'Analyst', 'Core', 'Finance', 'Consulting']
const BRANCHES: Branch[] = ['CS', 'IT', 'ECE', 'ME', 'CE', 'EE']

export const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  savedCount,
  totalJobs,
  filteredCount,
  onChange,
  onReset
}) => {
  const toggleRoleType = (type: JobType) => {
    const next = filters.roleTypes.includes(type)
      ? filters.roleTypes.filter((t) => t !== type)
      : [...filters.roleTypes, type]
    onChange({ roleTypes: next })
  }

  const toggleBranch = (b: Branch) => {
    const next = filters.branches.includes(b)
      ? filters.branches.filter((br) => br !== b)
      : [...filters.branches, b]
    onChange({ branches: next })
  }

  return (
    <aside className="bg-white p-5 rounded-xl border border-surface-border shadow-xs space-y-6 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold text-slate-900">Filter Drives</h2>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {filteredCount} of {totalJobs}
        </span>
      </div>

      {/* Quick Toggles: Eligible Only (FR7, Walkthrough) & Saved Only (Issue I1) */}
      <div className="space-y-2.5">
        <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal" />
            <span className="text-xs font-semibold text-slate-800">
              Eligible Jobs Only
            </span>
          </div>
          <input
            type="checkbox"
            checked={filters.showEligibleOnly}
            onChange={(e) => onChange({ showEligibleOnly: e.target.checked })}
            className="rounded border-slate-300 text-teal focus:ring-teal h-4 w-4"
          />
        </label>

        <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold text-slate-800">
              Saved Jobs Only
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 tabular-nums">
              ({savedCount})
            </span>
            <input
              type="checkbox"
              checked={filters.showSavedOnly}
              onChange={(e) => onChange({ showSavedOnly: e.target.checked })}
              className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 h-4 w-4"
            />
          </div>
        </label>
      </div>

      {/* Minimum CTC Slider */}
      <div>
        <div className="flex justify-between items-center text-xs font-bold text-slate-900 mb-1.5">
          <span>Minimum Package</span>
          <span className="text-primary tabular-nums font-extrabold">
            {filters.minCTC > 0 ? `≥ ₹${filters.minCTC} LPA` : 'Any CTC'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="45"
          step="5"
          value={filters.minCTC}
          onChange={(e) => onChange({ minCTC: Number(e.target.value) })}
          className="w-full accent-primary h-1.5 bg-slate-200 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
          <span>₹0</span>
          <span>₹20 LPA</span>
          <span>₹45 LPA</span>
        </div>
      </div>

      {/* Role Type Filter */}
      <div>
        <p className="text-xs font-bold text-slate-900 mb-2">Role Domain</p>
        <div className="space-y-1.5">
          {ROLE_TYPES.map((type) => {
            const isChecked = filters.roleTypes.includes(type)
            return (
              <label
                key={type}
                className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleRoleType(type)}
                  className="rounded border-slate-300 text-primary focus:ring-primary h-3.5 w-3.5"
                />
                <span className={isChecked ? 'font-semibold text-slate-900' : ''}>
                  {type}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Target Branches */}
      <div>
        <p className="text-xs font-bold text-slate-900 mb-2">Eligible Branch</p>
        <div className="flex flex-wrap gap-1.5">
          {BRANCHES.map((b) => {
            const active = filters.branches.includes(b)
            return (
              <button
                key={b}
                type="button"
                onClick={() => toggleBranch(b)}
                className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                  active
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {b}
              </button>
            )
          })}
        </div>
      </div>

      {/* Reset Filters */}
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="w-full text-xs font-semibold text-slate-600"
      >
        <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
        <span>Reset Filters</span>
      </Button>
    </aside>
  )
}
