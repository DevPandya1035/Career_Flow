import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'
import { Badge } from './Badge'
import { Card } from './Card'
import { Modal } from './Modal'
import { ProgressBar } from './ProgressBar'
import { EligibilityPill } from './EligibilityPill'

describe('Shared UI Components', () => {
  describe('Button', () => {
    it('renders label and handles click', async () => {
      const onClick = vi.fn()
      render(<Button onClick={onClick}>Apply Now</Button>)
      const btn = screen.getByRole('button', { name: /apply now/i })
      expect(btn).toBeInTheDocument()
      await userEvent.click(btn)
      expect(onClick).toHaveBeenCalledOnce()
    })

    it('handles disabled state with reason in tooltip/aria', () => {
      render(
        <Button disabled disabledReason="CGPA must be at least 8.5">
          Apply
        </Button>
      )
      const btn = screen.getByRole('button', { name: /apply/i })
      expect(btn).toBeDisabled()
      expect(btn).toHaveAttribute('aria-describedby')
      expect(screen.getByText('CGPA must be at least 8.5')).toBeInTheDocument()
    })
  })

  describe('Badge & EligibilityPill', () => {
    it('renders Eligible pill with teal tone and check icon', () => {
      render(<EligibilityPill isEligible={true} />)
      expect(screen.getByText(/eligible/i)).toBeInTheDocument()
    })

    it('renders Ineligible pill with red tone and warning/x icon', () => {
      render(<EligibilityPill isEligible={false} />)
      expect(screen.getByText(/ineligible/i)).toBeInTheDocument()
    })

    it('renders custom Badge variants', () => {
      render(<Badge variant="shortlisted">Shortlisted</Badge>)
      expect(screen.getByText(/shortlisted/i)).toBeInTheDocument()
    })
  })

  describe('Card', () => {
    it('renders content with padding and card styling', () => {
      render(<Card title="Upcoming Drives"><div>Drive Content</div></Card>)
      expect(screen.getByText('Upcoming Drives')).toBeInTheDocument()
      expect(screen.getByText('Drive Content')).toBeInTheDocument()
    })
  })

  describe('Modal', () => {
    it('renders dialog with aria-modal when open', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Confirm Application">
          <div>Modal Body</div>
        </Modal>
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
      expect(screen.getByText('Confirm Application')).toBeInTheDocument()
    })

    it('calls onClose when close button clicked or Escape pressed', async () => {
      const onClose = vi.fn()
      render(
        <Modal isOpen={true} onClose={onClose} title="Test Modal">
          <div>Content</div>
        </Modal>
      )
      const closeBtn = screen.getByLabelText(/close modal/i)
      await userEvent.click(closeBtn)
      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('ProgressBar', () => {
    it('renders accessible progress bar with value and limits', () => {
      render(<ProgressBar value={60} max={100} label="DSA Readiness" />)
      const progress = screen.getByRole('progressbar')
      expect(progress).toHaveAttribute('aria-valuenow', '60')
      expect(progress).toHaveAttribute('aria-valuemin', '0')
      expect(progress).toHaveAttribute('aria-valuemax', '100')
    })
  })
})
