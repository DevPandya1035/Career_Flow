import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { AdminDashboard } from './AdminDashboard'
import { TopBar } from '../../components/layout/TopBar'
import { useStore } from '../../store'

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('AdminDashboard Component', () => {
  beforeEach(() => {
    useStore.getState().resetStore?.()
  })

  it('renders placement operations header and CTA buttons', async () => {
    renderWithRouter(<AdminDashboard />)

    await waitFor(() => {
      expect(screen.getByText(/Placement Cell Operations/i)).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: /create drive/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /review applicants/i })).toBeInTheDocument()
  })

  it('renders 4 KPI metrics cards', async () => {
    renderWithRouter(<AdminDashboard />)

    await waitFor(() => {
      expect(screen.getByTestId('kpi-drives')).toBeInTheDocument()
      expect(screen.getByTestId('kpi-applications')).toBeInTheDocument()
      expect(screen.getByTestId('kpi-placement-rate')).toBeInTheDocument()
      expect(screen.getByTestId('kpi-avg-ctc')).toBeInTheDocument()
    })
  })

  it('renders branch-wise placement breakdown progress bars', async () => {
    renderWithRouter(<AdminDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Branch Placement Rates')).toBeInTheDocument()
    })
    expect(screen.getByText(/CS Engineering/i)).toBeInTheDocument()
    expect(screen.getByText(/ECE Engineering/i)).toBeInTheDocument()
  })

  it('renders live placement drives table with company names', async () => {
    renderWithRouter(<AdminDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Live Placement Drives')).toBeInTheDocument()
    })
    expect(screen.getByText('Google')).toBeInTheDocument()
    expect(screen.getByText('Microsoft')).toBeInTheDocument()
  })

  it('TopBar role switcher toggles between Student and TPO Admin', async () => {
    const user = userEvent.setup()
    renderWithRouter(<TopBar />)

    const adminRadio = screen.getByRole('radio', { name: /TPO Admin/i })
    expect(adminRadio).toBeInTheDocument()
    expect(adminRadio).toHaveAttribute('aria-checked', 'false')

    await user.click(adminRadio)
    expect(useStore.getState().currentRole).toBe('admin')
    expect(adminRadio).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByText(/Dr. R. K. Verma/i)).toBeInTheDocument()
  })
})
