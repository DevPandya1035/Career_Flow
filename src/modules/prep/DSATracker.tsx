import React from 'react'
import { Code2, Plus, CheckCircle2 } from 'lucide-react'
import { useStore } from '../../store'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../hooks/useToast'

export const DSATracker: React.FC = () => {
  const dsa = useStore((state) => state.prep.dsa)
  const logDSAProblem = useStore((state) => state.logDSAProblem)
  const { success } = useToast()

  const handleLog = (topic: string) => {
    logDSAProblem(topic)
    success('Problem Logged', `Recorded +1 solved problem in ${topic}. Readiness score updated.`)
  }

  const topics = Object.entries(dsa)
  const totalSolved = topics.reduce((acc, [, t]) => acc + t.solved, 0)
  const totalProblems = topics.reduce((acc, [, t]) => acc + t.total, 0)
  const overallPercentage = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Overview Metric Banner */}
      <div className="bg-white p-5 rounded-xl border border-surface-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-base text-slate-900">
              Data Structures & Algorithms Tracker
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track solved problems across placement topics to boost algorithmic readiness.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Total Solved</span>
            <span className="text-xl font-black text-slate-900 tabular-nums">
              {totalSolved} / {totalProblems}
            </span>
          </div>
          <div className="w-24">
            <ProgressBar value={overallPercentage} max={100} size="md" showPercentage={false} />
            <span className="text-[11px] font-bold text-teal text-right block mt-0.5">
              {overallPercentage}% Completed
            </span>
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map(([topic, data]) => {
          const isFinished = data.solved >= data.total
          const percent = Math.round((data.solved / data.total) * 100)

          return (
            <div
              key={topic}
              className="bg-white p-4.5 rounded-xl border border-surface-border shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-bold text-sm text-slate-900">{topic}</h4>
                  {isFinished ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-teal" />
                      <span>Mastered</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-500 tabular-nums">
                      {data.solved} / {data.total}
                    </span>
                  )}
                </div>

                <ProgressBar
                  value={data.solved}
                  max={data.total}
                  size="sm"
                  color={percent >= 70 ? 'teal' : 'primary'}
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {percent}% completed
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={isFinished}
                  onClick={() => handleLog(topic)}
                  aria-label={`+1 Solved in ${topic}`}
                  className="text-xs font-semibold py-1 px-3"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  <span>+1 Solved</span>
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
