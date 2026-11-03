import React from 'react'
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import type { EligibilityResult, Job } from '../../types'
import { EligibilityPill } from '../../components/ui/EligibilityPill'

export interface ResultsTableProps {
  job: Job
  result: EligibilityResult
  isWhatIfMode: boolean
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  job,
  result,
  isWhatIfMode
}) => {
  const totalCriteria = result.pass.length + result.fail.length
  const passedCriteria = result.pass.length

  const allItems = [
    ...result.pass.map((p) => ({ ...p, status: 'pass' as const })),
    ...result.fail.map((f) => ({ ...f, status: 'fail' as const }))
  ]

  return (
    <div className="bg-white rounded-xl border border-surface-border shadow-xs overflow-hidden">
      {/* Header Banner */}
      <div className="p-5 border-b border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900 leading-tight">
              {job.company} Placement Criteria Evaluation
            </h3>
            {isWhatIfMode && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                What-If Simulation
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {job.role} • {passedCriteria} of {totalCriteria} requirements satisfied
          </p>
        </div>

        <div>
          <EligibilityPill isEligible={result.isEligible} size="md" />
        </div>
      </div>

      {/* Criteria Breakdown Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Evaluation Criterion</th>
              <th className="py-3 px-4">Your Value {isWhatIfMode && '(Simulated)'}</th>
              <th className="py-3 px-4">Required by {job.company}</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {allItems.map((item, idx) => {
              const isPassed = item.status === 'pass'

              return (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    isPassed ? 'hover:bg-slate-50/50' : 'bg-red-50/30 hover:bg-red-50/50'
                  }`}
                >
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {item.criterion}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-mono font-medium">
                    {item.studentValue}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {item.required}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {isPassed ? (
                      <span className="inline-flex items-center gap-1 text-[#0B7662] font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-teal" />
                        <span>Pass</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-danger font-semibold">
                        <XCircle className="w-4 h-4 text-danger" />
                        <span>Fail</span>
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Guidance Message per Issue I5 */}
      <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-600">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {result.isEligible ? (
            isWhatIfMode ? (
              <span>
                <strong>What-If Verdict:</strong> You would meet this company’s criteria with these values! To actually apply, update your profile on the Student Profile page.
              </span>
            ) : (
              <span>
                <strong>Official Verdict:</strong> You are fully eligible for this drive. You can apply directly on the Job Opportunities page.
              </span>
            )
          ) : (
            <span>
              <strong>Official Verdict:</strong> Your current profile does not meet one or more criteria. You can test improvements above, or view other eligible companies on the Jobs page.
            </span>
          )}
        </p>
      </div>
    </div>
  )
}
