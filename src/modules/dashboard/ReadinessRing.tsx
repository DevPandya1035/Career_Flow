import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

export interface ReadinessRingProps {
  score: number
}

export const ReadinessRing: React.FC<ReadinessRingProps> = ({ score }) => {
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  // Color gradient / status based on score
  const strokeColor =
    score >= 75
      ? '#0D9488' // Teal
      : score >= 50
      ? '#2563EB' // Primary blue
      : '#F59E0B' // Warning amber

  const ratingLabel =
    score >= 75
      ? 'Strong Contender'
      : score >= 50
      ? 'Good Progress'
      : 'Prep Recommended'

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* SVG Ring Meter */}
      <div className="relative w-32 h-32 shrink-0">
        <svg 
          className="w-full h-full -rotate-90 transform" 
          viewBox="0 0 120 120"
          role="meter"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Placement Readiness Score"
        >
          {/* Background Track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="#E2E8F0"
            strokeWidth="10"
          />
          {/* Progress Arc */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Percentage */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {score}%
          </span>
          <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
            Ready
          </span>
        </div>
      </div>

      {/* Info & Prep Hub CTA */}
      <div className="flex-1 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-primary mb-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{ratingLabel}</span>
        </div>
        <h4 className="text-base font-bold text-slate-900">Placement Readiness</h4>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          Aggregated from your DSA problem counts, latest aptitude quizzes, resume checklist, and academic profile.
        </p>

        <Link
          to="/prep"
          className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-primary hover:text-primary-hover hover:underline"
        >
          <span>Continue preparation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
