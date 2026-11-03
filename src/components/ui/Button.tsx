import React, { useId } from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabledReason?: string
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  disabledReason,
  isLoading,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const reasonId = useId()

  const baseStyles =
    'relative inline-flex items-center justify-center font-semibold rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed select-none'

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5'
  }[size]

  const variantStyles = {
    primary:
      'bg-primary text-white hover:bg-primary-hover active:bg-blue-800 focus-visible:ring-primary shadow-sm disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none',
    secondary:
      'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 focus-visible:ring-slate-400 disabled:bg-slate-100 disabled:text-slate-400',
    outline:
      'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-primary disabled:border-slate-200 disabled:text-slate-400',
    danger:
      'bg-danger text-white hover:bg-danger-dark focus-visible:ring-danger shadow-sm disabled:bg-slate-200 disabled:text-slate-400',
    ghost:
      'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400 disabled:text-slate-300'
  }[variant]

  return (
    <div className="relative inline-flex flex-col group">
      <button
        disabled={disabled || isLoading}
        aria-describedby={disabled && disabledReason ? reasonId : undefined}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>

      {/* Accessible explanation when button is disabled */}
      {disabled && disabledReason && (
        <span
          id={reasonId}
          role="tooltip"
          className="mt-1 text-[11px] text-danger-dark font-medium flex items-center gap-1"
        >
          {disabledReason}
        </span>
      )}
    </div>
  )
}
