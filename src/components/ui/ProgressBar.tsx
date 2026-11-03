import React from 'react'

export interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  color?: 'teal' | 'primary' | 'amber' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'teal',
  size = 'md',
  className = ''
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100)

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5'
  }[size]

  const barColor = {
    teal: 'bg-[#0D9488]',
    primary: 'bg-primary',
    amber: 'bg-warning',
    danger: 'bg-danger'
  }[color]

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs text-slate-600 mb-1.5 font-medium">
          {label && <span>{label}</span>}
          {showPercentage && <span className="tabular-nums font-semibold">{percentage}%</span>}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
        className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClass}`}
      >
        <div
          className={`${heightClass} ${barColor} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
