import React from 'react'
import { Check, ChevronRight } from 'lucide-react'

export interface StepItem {
  id: string
  label: string
  subtitle?: string
}

export interface StepperProps {
  steps: StepItem[]
  currentStepId: string
  completedStepIds?: string[]
  onStepClick?: (id: string) => void
  className?: string
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStepId,
  completedStepIds = [],
  onStepClick,
  className = ''
}) => {
  return (
    <nav aria-label="Placement Journey Stepper" className={`w-full ${className}`}>
      <ol className="flex items-center gap-2 overflow-x-auto py-1 text-xs">
        {steps.map((step, idx) => {
          const isCompleted = completedStepIds.includes(step.id)
          const isCurrent = step.id === currentStepId
          const isLast = idx === steps.length - 1

          return (
            <li key={step.id} className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onStepClick?.(step.id)}
                disabled={!onStepClick}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-left ${
                  isCurrent
                    ? 'bg-primary text-white font-semibold shadow-xs'
                    : isCompleted
                    ? 'bg-[#E2F4EF] text-[#0B7662] font-medium hover:bg-[#d0efe7]'
                    : 'bg-slate-100 text-slate-500 font-medium'
                } ${onStepClick ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <span
                  className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] ${
                    isCurrent
                      ? 'bg-white text-primary font-bold'
                      : isCompleted
                      ? 'bg-[#0B7662] text-white font-bold'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3" /> : idx + 1}
                </span>
                <span className="leading-tight">{step.label}</span>
              </button>

              {!isLast && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" aria-hidden="true" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
