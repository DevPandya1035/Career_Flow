import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { ApplicantReview } from './ApplicantReview'
import { useStore } from '../../store'
import { api } from '../../lib/api'

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('ApplicantReview Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(api.admin, 'getApplicants').mockResolvedValue([])
    vi.spyOn(api.admin, 'autoShortlist').mockResolvedValue({
      success: true,
      jobId: 'job-1',
      shortlistedCount: 2,
      totalEvaluated: 4,
      message: 'Shortlisted'
    })
    vi.spyOn(api.admin, 'updateApplicantStage').mockResolvedValue({
      id: 'app-1',
      status: 'Interview',
      nextStep: 'Interview'
    })
    useStore.getState().resetStore?.()
  })

  it('renders drive selector, published cutoffs banner, and bulk shortlist button', async () => {
    renderWithRouter(<ApplicantReview />)

    await waitFor(() => {
      expect(screen.getByText('Applicant Review & Verification')).toBeInTheDocument()
    })
    expect(screen.getByLabelText(/Select Drive/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Bulk Auto-Shortlist/i })).toBeInTheDocument()
    expect(screen.getByText(/Min CGPA/i)).toBeInTheDocument()
  })

  it('audits and displays candidate eligibility badges based on drive cutoffs', async () => {
    renderWithRouter(<ApplicantReview />)

    await waitFor(() => {
      expect(screen.getByText('Priya Sharma')).toBeInTheDocument()
      expect(screen.getAllByText('Eligible').length).toBeGreaterThanOrEqual(1)
    })
  })

  it('executes 1-click Bulk Auto-Shortlist for qualifying candidates (FR31)', async () => {
    const user = userEvent.setup()
    renderWithRouter(<ApplicantReview />)

    await waitFor(() => {
      expect(screen.getByText('Priya Sharma')).toBeInTheDocument()
    })

    const bulkBtn = screen.getByRole('button', { name: /Bulk Auto-Shortlist/i })
    await user.click(bulkBtn)

    await waitFor(() => {
      expect(screen.getAllByText('Shortlisted').length).toBeGreaterThanOrEqual(1)
    })
  })

  it('allows manual candidate stage advancement via dropdown', async () => {
    const user = userEvent.setup()
    renderWithRouter(<ApplicantReview />)

    await waitFor(() => {
      expect(screen.getByText('Priya Sharma')).toBeInTheDocument()
    })

    const stageSelect = screen.getByLabelText(/Change stage for Priya Sharma/i)
    await user.selectOptions(stageSelect, 'Interview')

    await waitFor(() => {
      expect(stageSelect).toHaveValue('Interview')
    })
  })
})
