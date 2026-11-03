import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Award, 
  PlusCircle, 
  CheckCircle2, 
  Building2, 
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { useStore } from '../../store'
import { api } from '../../lib/api'
import type { PlacementAnalytics } from '../../types'

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const jobs = useStore((state) => state.jobs)
  const applications = useStore((state) => state.applications)
  const [analytics, setAnalytics] = useState<PlacementAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    api.admin.getAnalytics()
      .then((data) => {
        if (isMounted) {
          setAnalytics(data)
          setLoading(false)
        }
      })
      .catch(() => {
        // Fallback computation from store state
        if (isMounted) {
          const totalDrives = jobs.length
          const totalApps = applications.length
          const selected = applications.filter((a) => a.status === 'Selected').length
          const ctcs = jobs.map((j) => j.ctcLPA)
          const avgCTC = ctcs.length > 0 ? +(ctcs.reduce((a, b) => a + b, 0) / ctcs.length).toFixed(1) : 0
          const maxCTC = ctcs.length > 0 ? Math.max(...ctcs) : 0

          setAnalytics({
            totalDrives,
            totalApplications: totalApps,
            totalOffers: selected,
            placementRate: totalApps > 0 ? Math.round((selected / totalApps) * 100) : 0,
            averageCTC: avgCTC,
            highestCTC: maxCTC,
            branchStats: {
              CS: { total: 45, placed: 38, percentage: 84 },
              IT: { total: 40, placed: 32, percentage: 80 },
              ECE: { total: 35, placed: 24, percentage: 68 },
              ME: { total: 30, placed: 18, percentage: 60 },
              CE: { total: 25, placed: 14, percentage: 56 },
              EE: { total: 28, placed: 17, percentage: 61 }
            }
          })
          setLoading(false)
        }
      })
    return () => {
      isMounted = false
    }
  }, [jobs, applications])

  const totalDrives = analytics?.totalDrives ?? jobs.length
  const totalApps = analytics?.totalApplications ?? applications.length
  const avgCTC = analytics?.averageCTC ?? 18.5
  const placementRate = analytics?.placementRate ?? 78

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Welcome */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              <Sparkles className="w-3.5 h-3.5" />
              TPO Placement Administration
            </span>
            <span className="text-xs text-slate-500 font-medium">Session 2026</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-navy tracking-tight">
            Placement Cell Operations
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Publish company drives, configure rigorous branch & CGPA cutoffs, and run 1-click bulk auto-shortlisting for verified candidates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/admin/drives')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-hover shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Drive</span>
          </button>
          <button
            onClick={() => navigate('/admin/applicants')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 shadow-xs transition-all"
          >
            <Users className="w-4 h-4 text-slate-500" />
            <span>Review Applicants</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Drives */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Drives</p>
            <p className="text-2xl font-bold text-navy mt-1" data-testid="kpi-drives">{totalDrives}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Campus Season Active</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: Total Applications */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Applications</p>
            <p className="text-2xl font-bold text-navy mt-1" data-testid="kpi-applications">{totalApps}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Student Opt-Ins</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Placement Rate */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Placement Rate</p>
            <p className="text-2xl font-bold text-navy mt-1" data-testid="kpi-placement-rate">{placementRate}%</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Target: 85% by Dec</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4: Average CTC */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average CTC</p>
            <p className="text-2xl font-bold text-navy mt-1" data-testid="kpi-avg-ctc">₹{avgCTC} LPA</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">Highest: ₹{analytics?.highestCTC || 52} LPA</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Branch Breakdown & Live Drives */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Branch Placement Progress (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-navy">Branch Placement Rates</h2>
            <span className="text-xs font-medium text-slate-500">2026 Batch</span>
          </div>

          <div className="space-y-4">
            {Object.entries(
              analytics?.branchStats || {
                CS: { total: 45, placed: 38, percentage: 84 },
                IT: { total: 40, placed: 32, percentage: 80 },
                ECE: { total: 35, placed: 24, percentage: 68 },
                ME: { total: 30, placed: 18, percentage: 60 },
                CE: { total: 25, placed: 14, percentage: 56 },
                EE: { total: 28, placed: 17, percentage: 61 }
              }
            ).map(([branch, stats]) => (
              <div key={branch}>
                <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                  <span className="text-slate-700 font-semibold">{branch} Engineering</span>
                  <span className="text-slate-500">{stats.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stats.percentage >= 80
                        ? 'bg-emerald-500'
                        : stats.percentage >= 65
                        ? 'bg-blue-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Overall Batch Size: 203 Students</span>
            <span className="font-semibold text-navy">Verified Eligible: 189</span>
          </div>
        </div>

        {/* Live Placement Drives Table / Summary (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-navy">Live Placement Drives</h2>
                <p className="text-xs text-slate-500">Active company drives with criteria cutoffs</p>
              </div>
              <Link
                to="/admin/drives"
                className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1"
              >
                <span>Manage All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/60">
                    <th className="py-2.5 px-3">Company & Role</th>
                    <th className="py-2.5 px-3">Package (CTC)</th>
                    <th className="py-2.5 px-3">Min CGPA</th>
                    <th className="py-2.5 px-3">Eligible Branches</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.slice(0, 5).map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px] shrink-0 border border-slate-200">
                            {job.companyLogo || job.company.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{job.company}</span>
                            <span className="text-[11px] text-slate-500">{job.role}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        ₹{job.ctcLPA} LPA
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-700">
                          {job.eligibility.minCGPA.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {job.eligibility.branches.map((b) => (
                            <span key={b} className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200/50">
                              {b}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          to={`/admin/applicants?jobId=${job.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                        >
                          <Users className="w-3 h-3" />
                          <span>Review</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing top 5 of {jobs.length} placement drives</span>
            <Link to="/admin/drives" className="text-primary font-semibold hover:underline">
              View All Drives →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
