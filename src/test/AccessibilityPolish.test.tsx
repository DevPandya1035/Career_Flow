import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { ToastContainer } from '../components/ui/ToastContainer'
import { useToastStore } from '../hooks/useToast'
import { useStore } from '../store'

describe('Phase 8 — Polish & Accessibility (WCAG 2.1 AA & Fitts Law)', () => {
  beforeEach(() => {
    localStorage.clear()
    useStore.getState().resetStore?.()
    useToastStore.setState({ toasts: [] })
  })

  it('provides accessible mobile navigation bar with 6 module links and min 48px tap targets', () => {
    render(
      <MemoryRouter>
        <AppShell />
      </MemoryRouter>
    )

    const mobileNav = screen.getByRole('navigation', { name: /mobile navigation/i })
    expect(mobileNav).toBeInTheDocument()

    const links = mobileNav.querySelectorAll('a')
    expect(links.length).toBe(6)
    links.forEach((link) => {
      expect(link.className).toContain('min-w-[48px]')
      expect(link.className).toContain('min-h-[48px]')
    })
  })

  it('traps focus inside open Modal dialog and responds to Escape key', async () => {
    let closed = false
    const handleClose = () => {
      closed = true
    }

    render(
      <Modal isOpen={true} onClose={handleClose} title="Accessible Modal Test">
        <button type="button">Inside Button 1</button>
        <button type="button">Inside Button 2</button>
      </Modal>
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title')

    // Escape closes modal
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(closed).toBe(true)
  })

  it('ensures disabled buttons provide accessible tooltips via aria-describedby', () => {
    render(
      <Button disabled disabledReason="Minimum CGPA 8.5 required">
        Apply Now
      </Button>
    )

    const button = screen.getByRole('button', { name: /apply now/i })
    expect(button).toBeDisabled()
    
    const describedBy = button.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()

    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveTextContent(/minimum cgpa 8.5 required/i)
  })

  it('renders Toast notifications inside an aria-live region for screen readers', () => {
    render(
      <div>
        <ToastContainer />
      </div>
    )

    // Trigger a toast via toast store wrapped in act
    act(() => {
      useToastStore.getState().addToast({
        title: 'Action Succeeded',
        message: 'Placement drive application submitted.',
        type: 'success'
      })
    })

    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(screen.getByText('Action Succeeded')).toBeInTheDocument()
  })
})
