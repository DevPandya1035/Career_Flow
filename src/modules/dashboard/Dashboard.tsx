import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, Briefcase, Bell, CheckCircle2 } from 'lucide-react'
import { useStore } from '../../store'
import { useReadinessScore } from '../../hooks/useReadinessScore'
import { Stepper, type StepItem } from '../../components/ui/Stepper'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { EligibilityPill } from '../../components/ui/EligibilityPill'
import { ReadinessRing } from './ReadinessRing'
import { DeadlineWidget } from './DeadlineWidget'
import { StageCountChips } from './StageCountChips'
import { checkEligibility } from '../../lib/eligibility'

const JOURNEY_STEPS: StepItem[] = [
  { id: 'discover', label: 'Discover Drives' },
  { id: 'prepare', label: 'Prepare' },
  { id: 'apply', label: 'Apply Carefully' },
  { id: 'succeed', label: 'Succeed & Track' }
]

export const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const student = useStore((state) => state.student)
  const jobs = useStore((state) => state.jobs)
  const applications = useStore((state) => state.applications)
  const readinessScore = useReadinessScore()

  const appliedJobIds = applications.map((a) => a.jobId)

  // Journey completed steps calculation
  const completedSteps: string[] = []
  if (jobs.length > 0) completedSteps.push('discover')
  if (readinessScore >= 40) completedSteps.push('prepare')
  if (applications.length > 0) completedSteps.push('apply')
  if (applications.some((a) => a.status === 'Selected')) completedSteps.push('succeed')

  // Recommended jobs for the student (eligible or matching preferences)
  const eligibleRecommendedJobs = jobs
    .filter((job) => {
      const { isEligible } = checkEligibility(student, job)
      return isEligible && !appliedJobIds.includes(job.id)
    })
    .slice(0, 3)

  return (
    <div data-testid="dashboard-page" className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Welcome & Four-Step Journey Stepper Banner */}
      <section className="bg-gradient-to-r from-navy via-navy-light to-navy text-white rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-primary/10 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-slate-200 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Campus Placement Season</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Welcome back, {student.name}
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-xl leading-relaxed">
              &ldquo;Your Career. Your Journey. Your Future.&rdquo; Discover campus drives, verify academic eligibility with zero mistakes, prepare with precision, and track every application through to an offer.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/jobs')}
              className="bg-primary hover:bg-primary-hover shadow-md text-white font-bold"
            >
              <Briefcase className="w-4 h-4 mr-1.5" />
              <span>Explore Opportunities</span>
            </Button>
          </div>
        </div>

        {/* Stepper */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-[11px] font-semibold tracking-wider text-slate-300 uppercase mb-2">
            Your Placement Roadmap
          </p>
          <Stepper
            steps={JOURNEY_STEPS}
            currentStepId={
              applications.some((a) => a.status === 'Selected')
                ? 'succeed'
                : applications.length > 0
                ? 'succeed'
                : readinessScore >= 50
                ? 'apply'
                : 'prepare'
            }
            completedStepIds={completedSteps}
            onStepClick={(id) => {
              if (id === 'discover') navigate('/jobs')
              if (id === 'prepare') navigate('/prep')
              if (id === 'apply') navigate('/jobs')
              if (id === 'succeed') navigate('/tracker')
            }}
          />
        </div>
      </section>

      {/* 2. Top Metric Cards: Readiness Ring + Upcoming Deadlines */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <Card
            title="Placement Readiness Meter"
            subtitle="Real-time preparation health based on course criteria"
            className="h-full flex flex-col justify-between"
          >
            <ReadinessRing score={readinessScore} />
          </Card>
        </div>

        <div className="lg:col-span-6">
          <Card
            title="Upcoming Deadlines"
            subtitle="Don't miss application windows for unapplied drives"
            headerAction={
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {jobs.length - appliedJobIds.length} open drives
              </span>
            }
            className="h-full"
          >
            <DeadlineWidget jobs={jobs} appliedJobIds={appliedJobIds} />
          </Card>
        </div>
      </section>

      {/* 3. Five-Stage Application Pipeline Snapshot */}
      <section className="space-y-2.5">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-slate-900">Application Pipeline</h2>
            <p className="text-xs text-slate-500">
              Live status across all 5 recruitment funnel stages
            </p>
          </div>
          <Link
            to="/tracker"
            className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1"
          >
            <span>Open Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <StageCountChips applications={applications} />
      </section>

      {/* 4. Recommended Opportunities & Live Noticeboard */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recommended Jobs */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900">Recommended for You</h2>
            <Link
              to="/jobs"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View all 10 drives</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {eligibleRecommendedJobs.length === 0 ? (
              <div className="md:col-span-3 p-6 text-center bg-white border border-surface-border rounded-xl text-xs text-slate-500">
                You have applied to all recommended drives or need to update preferences.
              </div>
            ) : (
              eligibleRecommendedJobs.map((job) => {
                return (
                  <div
                    key={job.id}
                    className="bg-white p-4 rounded-xl border border-surface-border shadow-xs hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="w-9 h-9 rounded-lg bg-navy/5 text-navy font-bold text-sm flex items-center justify-center">
                          {job.companyLogo || job.company[0]}
                        </div>
                        <EligibilityPill isEligible={true} size="sm" />
                      </div>

                      <h3 className="font-bold text-sm text-slate-900">{job.company}</h3>
                      <p className="text-xs text-slate-500 leading-tight mt-0.5">{job.role}</p>

                      <div className="flex items-center gap-2 mt-3 text-xs font-medium text-slate-700">
                        <span className="font-extrabold text-slate-900">₹{job.ctcLPA} LPA</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500">{job.type}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        CGPA ≥ {job.eligibility.minCGPA}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate('/jobs')}
                        className="text-xs font-semibold py-1 px-3"
                      >
                        View & Apply
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Noticeboard / Placement Cell Alerts (FR4) */}
        <div className="lg:col-span-4">
          <Card
            title="Placement Cell Alerts"
            subtitle="Official notifications & announcements"
            headerAction={<Bell className="w-4 h-4 text-slate-400" />}
            className="h-full"
          >
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-100 text-xs">
                <div className="flex items-center gap-1.5 text-primary font-bold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Resume Verification</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Ensure uploaded resume format is PDF under 2MB. Placement cell verification closes Friday.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <p className="font-bold text-slate-900 mb-0.5">Mock Interview Drive</p>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Alumni mentorship slots are now open in the Preparation Hub. Book early to secure your time.
                </p>
              </div>

              <div className="pt-1 text-center">
                <Link
                  to="/prep"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Go to Preparation Hub</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
