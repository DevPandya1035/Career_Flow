import React from 'react'
import { FileCheck, CheckCircle2 } from 'lucide-react'
import { useStore } from '../../store'
import { ProgressBar } from '../../components/ui/ProgressBar'

export const ResumeChecklist: React.FC = () => {
  const checklist = useStore((state) => state.prep.checklist)
  const toggleChecklistItem = useStore((state) => state.toggleChecklistItem)

  const entries = Object.entries(checklist)
  const totalItems = entries.length
  const completedItems = entries.filter(([, checked]) => checked).length
  const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white p-5 rounded-xl border border-surface-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-base text-slate-900">
              ATS-Optimized Resume Quality Checklist
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Recruiter screening algorithms parse resumes before human interviews. Check off standards.
          </p>
        </div>

        <div className="w-48 shrink-0">
          <ProgressBar
            value={percentage}
            max={100}
            label={`${completedItems}/${totalItems} Passed`}
            color={percentage >= 80 ? 'teal' : 'primary'}
          />
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="bg-white rounded-xl border border-surface-border shadow-xs p-5 divide-y divide-slate-100">
        {entries.map(([item, checked]) => (
          <label
            key={item}
            className="flex items-start gap-3.5 py-3 cursor-pointer select-none hover:bg-slate-50/70 px-2 rounded-lg transition-colors"
          >
            <input
              type="checkbox"
              checked={checked}
              aria-label={item}
              onChange={() => toggleChecklistItem(item)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal focus:ring-teal"
            />
            <div className="flex-1">
              <span
                className={`text-xs block font-semibold leading-relaxed ${
                  checked ? 'text-slate-900 line-through text-slate-400' : 'text-slate-800'
                }`}
              >
                {item}
              </span>
            </div>
            {checked ? (
              <CheckCircle2 className="w-4 h-4 text-teal shrink-0 mt-0.5" />
            ) : (
              <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold">
                Action Needed
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  )
}
