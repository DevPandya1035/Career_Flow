import React from 'react'

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  headerAction?: React.ReactNode
  footer?: React.ReactNode
  hoverable?: boolean
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  headerAction,
  footer,
  children,
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-surface-border shadow-sm overflow-hidden ${
        hoverable ? 'hover:shadow-md hover:border-slate-300 transition-all' : ''
      } ${className}`}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="px-5 py-4 border-b border-surface-border/80 flex items-center justify-between gap-4">
          <div>
            {title && (
              <h3 className="font-semibold text-slate-900 text-sm md:text-base leading-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5 leading-normal">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}

      <div className="p-5">{children}</div>

      {footer && (
        <div className="px-5 py-3.5 bg-slate-50/70 border-t border-surface-border/80 text-xs text-slate-600">
          {footer}
        </div>
      )}
    </div>
  )
}
