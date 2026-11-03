import React, { useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle2, Sliders, RotateCcw, ArrowRight, UserCheck } from 'lucide-react'
import { useStore } from '../../store'
import type { Branch, Student } from '../../types'
import { checkEligibility, getSkillsGap } from '../../lib/eligibility'
import { CompanyPicker } from './CompanyPicker'
import { ResultsTable } from './ResultsTable'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

export const EligibilityPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const jobs = useStore((state) => state.jobs)
  const student = useStore((state) => state.student)

  // Preselect from URL if provided, otherwise default to first job (Google)
  const initialJobId = searchParams.get('job') || jobs[0]?.id || ''
  const [selectedJobId, setSelectedJobId] = useState(initialJobId)

  // What-If Simulation State
  const [whatIfCGPA, setWhatIfCGPA] = useState<number>(student.cgpa)
  const [whatIfBacklogs, setWhatIfBacklogs] = useState<number>(student.backlogs)
  const [whatIfBranch, setWhatIfBranch] = useState<Branch>(student.branch)

  const selectedJob = useMemo(
    () => jobs.find((j) => j.id === selectedJobId) || jobs[0],
    [jobs, selectedJobId]
  )

  const isWhatIfMode = useMemo(() => {
    return (
      whatIfCGPA !== student.cgpa ||
      whatIfBacklogs !== student.backlogs ||
      whatIfBranch !== student.branch
    )
  }, [whatIfCGPA, whatIfBacklogs, whatIfBranch, student])

  // Simulated student for live computation
  const simulatedStudent: Student = useMemo(
    () => ({
      ...student,
      cgpa: whatIfCGPA,
      backlogs: whatIfBacklogs,
      branch: whatIfBranch
    }),
    [student, whatIfCGPA, whatIfBacklogs, whatIfBranch]
  )

  const liveResult = useMemo(
    () => checkEligibility(simulatedStudent, selectedJob),
    [simulatedStudent, selectedJob]
  )

  const skillsGap = useMemo(
    () => getSkillsGap(simulatedStudent, selectedJob),
    [simulatedStudent, selectedJob]
  )

  const handleResetToProfile = () => {
    setWhatIfCGPA(student.cgpa)
    setWhatIfBacklogs(student.backlogs)
    setWhatIfBranch(student.branch)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="pb-2 border-b border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            <span>Eligibility Checker & What-If Analyzer</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Test your qualifications against company cutoffs and simulate hypothetical CGPA improvements.
          </p>
        </div>

        {isWhatIfMode && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetToProfile}
            className="text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1 text-slate-400" />
            <span>Reset to Saved Profile</span>
          </Button>
        )}
      </div>

      {/* Two Column Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Company Picker & What-If Controls */}
        <div className="lg:col-span-5 space-y-5">
          <Card
            title="Drive Selection"
            subtitle="Choose a campus drive to inspect its published thresholds"
          >
            <CompanyPicker
              jobs={jobs}
              selectedJobId={selectedJob.id}
              onSelect={(id) => setSelectedJobId(id)}
            />
          </Card>

          {/* What-If Simulation Box */}
          <Card
            title={
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-primary" />
                  <span>What-If Academic Simulator</span>
                </span>
                {isWhatIfMode ? (
                  <span className="text-[10px] font-bold text-primary bg-blue-50 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-400">
                    Syncing with profile
                  </span>
                )}
              </div>
            }
            subtitle="Experiment with future CGPAs or backlog clearances"
          >
            <div className="space-y-4">
              {/* CGPA What-If Input */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-900 mb-1">
                  <label htmlFor="whatif-cgpa">What-If CGPA</label>
                  <span className="text-primary font-extrabold tabular-nums">
                    {whatIfCGPA.toFixed(2)}
                  </span>
                </div>
                <input
                  id="whatif-cgpa"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={whatIfCGPA}
                  onChange={(e) => setWhatIfCGPA(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Your saved profile CGPA is <strong>{student.cgpa.toFixed(2)}</strong>. Change this to see when eligibility flips.
                </p>
              </div>

              {/* Active Backlogs Input */}
              <div>
                <label
                  htmlFor="whatif-backlogs"
                  className="block text-xs font-bold text-slate-900 mb-1"
                >
                  Active Backlogs
                </label>
                <input
                  id="whatif-backlogs"
                  type="number"
                  min="0"
                  max="10"
                  value={whatIfBacklogs}
                  onChange={(e) => setWhatIfBacklogs(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Branch Select */}
              <div>
                <label
                  htmlFor="whatif-branch"
                  className="block text-xs font-bold text-slate-900 mb-1"
                >
                  Academic Department / Branch
                </label>
                <select
                  id="whatif-branch"
                  value={whatIfBranch}
                  onChange={(e) => setWhatIfBranch(e.target.value as Branch)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="CS">Computer Science (CS)</option>
                  <option value="IT">Information Technology (IT)</option>
                  <option value="ECE">Electronics & Communication (ECE)</option>
                  <option value="ME">Mechanical Engineering (ME)</option>
                  <option value="CE">Civil Engineering (CE)</option>
                  <option value="EE">Electrical Engineering (EE)</option>
                </select>
              </div>

              {/* Profile Synchronization Note (Issue I5) */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Want to permanently update your records?</span>
                <Link
                  to="/profile"
                  className="font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Update Profile</span>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Detailed Evaluation Table & Skills Match */}
        <div className="lg:col-span-7 space-y-5">
          <ResultsTable
            job={selectedJob}
            result={liveResult}
            isWhatIfMode={isWhatIfMode}
          />

          {/* Skills Breakdown Card (FR17) */}
          <Card
            title="Skills Match & Gaps"
            subtitle={`Compared against ${selectedJob.company} core competencies`}
          >
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-slate-900 mb-1.5">
                  Matched Skills ({skillsGap.matched.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {skillsGap.matched.length === 0 ? (
                    <span className="text-xs text-slate-400">No skills matched yet.</span>
                  ) : (
                    skillsGap.matched.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal" />
                        <span>{skill}</span>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {skillsGap.missing.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-900 mb-1.5">
                    Recommended Competencies ({skillsGap.missing.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsGap.missing.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200"
                      >
                        + {skill}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Practice these topics before interviews</span>
                    <Link
                      to="/prep"
                      className="font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <span>Open Prep Hub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default EligibilityPage
