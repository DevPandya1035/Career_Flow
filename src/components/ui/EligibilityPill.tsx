import React from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { Badge } from './Badge'

export interface EligibilityPillProps {
  isEligible: boolean
  className?: string
  showIcon?: boolean
  size?: 'sm' | 'md'
}

export const EligibilityPill: React.FC<EligibilityPillProps> = ({
  isEligible,
  className = '',
  showIcon = true,
  size = 'md'
}) => {
  return (
    <Badge
      variant={isEligible ? 'eligible' : 'ineligible'}
      size={size}
      className={className}
    >
      {showIcon && (
        isEligible ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-[#0B7662]" aria-hidden="true" />
        ) : (
          <AlertCircle className="w-3.5 h-3.5 text-[#B3261E]" aria-hidden="true" />
        )
      )}
      <span>{isEligible ? 'Eligible' : 'Ineligible'}</span>
    </Badge>
  )
}
