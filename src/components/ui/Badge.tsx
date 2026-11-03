import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 
    | 'default'
    | 'primary'
    | 'eligible'
    | 'ineligible'
    | 'applied'
    | 'shortlisted'
    | 'assessment'
    | 'interview'
    | 'selected'
    | 'warning'
  size?: 'sm' | 'md'
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1'
  }[size]

  // WCAG 2.1 AA calibrated contrast pairings from HCI report Table 5.5
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200/80',
    primary: 'bg-blue-50 text-blue-700 border border-blue-200/80',
    eligible: 'bg-[#E2F4EF] text-[#0B7662] border border-[#0B7662]/20 font-semibold',
    ineligible: 'bg-[#FDE8E6] text-[#B3261E] border border-[#B3261E]/20 font-semibold',
    applied: 'bg-[#E6EFFD] text-[#2358B8] border border-[#2358B8]/20',
    shortlisted: 'bg-[#FFF3D6] text-[#8A5A00] border border-[#8A5A00]/25 font-semibold',
    assessment: 'bg-purple-50 text-purple-700 border border-purple-200',
    interview: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    selected: 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold',
    warning: 'bg-[#FFF3D6] text-[#8A5A00] border border-[#8A5A00]/25'
  }[variant]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium leading-none select-none tracking-tight ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
