import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { JobsPage } from './JobsPage'
import { useStore } from '../../store'

describe('JobsPage Walkthrough Integration', () => {
  beforeEach(() => {
    localStorage.clear()
    useStore.getState().resetStore?.()
  })

  it('renders all 10 companies initially', () => {
    render(
      <MemoryRouter>
        <JobsPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Google')).toBeInTheDocument()
    expect(screen.getByText('Goldman Sachs')).toBeInTheDocument()
    expect(screen.getByText('Flipkart')).toBeInTheDocument()
  })

  it('filtering by "Eligible Jobs Only" removes Google and Goldman Sachs (CGPA 8.4 < 8.5)', async () => {
    render(
      <MemoryRouter>
        <JobsPage />
      </MemoryRouter>
    )

    const eligibleCheckbox = screen.getByRole('checkbox', { name: /eligible jobs only/i })
    await userEvent.click(eligibleCheckbox)

    // Google & Goldman Sachs have minCGPA 8.5, Aarav has 8.4 -> both drop out
    expect(screen.queryByText('Google')).not.toBeInTheDocument()
    expect(screen.queryByText('Goldman Sachs')).not.toBeInTheDocument()

    // Flipkart has minCGPA 6.5 -> stays in
    expect(screen.getByText('Flipkart')).toBeInTheDocument()
  })

  it('allows applying to Flipkart through the confirmation modal', async () => {
    render(
      <MemoryRouter>
        <JobsPage />
      </MemoryRouter>
    )

    // Find the specific article/card for Flipkart
    const flipkartHeading = screen.getByRole('heading', { name: 'Flipkart' })
    const flipkartCard = flipkartHeading.closest('article')!
    expect(flipkartCard).toBeDefined()

    // Within Flipkart's card, click Apply Now
    const applyBtn = within(flipkartCard).getByRole('button', { name: /apply now/i })
    await userEvent.click(applyBtn)

    // Modal opens specifically for Flipkart
    expect(screen.getByText(/apply to flipkart/i)).toBeInTheDocument()

    // Tick confirmation checkbox
    const confirmCheckbox = screen.getByRole('checkbox', { name: /confirm/i })
    await userEvent.click(confirmCheckbox)

    // Submit
    const submitBtn = screen.getByRole('button', { name: /submit application/i })
    await userEvent.click(submitBtn)

    // State in store updated
    expect(useStore.getState().applications.some((a) => a.jobId === 'job-flipkart-1')).toBe(true)
  })
})
