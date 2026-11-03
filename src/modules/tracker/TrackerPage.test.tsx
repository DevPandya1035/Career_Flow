import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { TrackerPage } from './TrackerPage'
import { useStore } from '../../store'
import { MOCK_JOBS } from '../../data/jobs'

describe('Application Tracker Component', () => {
  beforeEach(() => {
    localStorage.clear()
    useStore.getState().resetStore?.()
  })

  it('renders all 5 recruitment stage columns', () => {
    render(
      <MemoryRouter>
        <TrackerPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Applied')).toBeInTheDocument()
    expect(screen.getByText('Shortlisted')).toBeInTheDocument()
    expect(screen.getByText('Assessment')).toBeInTheDocument()
    expect(screen.getByText('Interview')).toBeInTheDocument()
    expect(screen.getByText('Selected')).toBeInTheDocument()
  })

  it('shows empty state when no applications exist', () => {
    render(
      <MemoryRouter>
        <TrackerPage />
      </MemoryRouter>
    )

    expect(screen.getByText(/no applications yet/i)).toBeInTheDocument()
  })

  it('displays application card in Applied stage and allows advancing stage via demo control', async () => {
    // Add application
    const flipkart = MOCK_JOBS.find((j) => j.company === 'Flipkart')!
    useStore.getState().addApplication({ jobId: flipkart.id, resumeId: 'resume-1' })

    render(
      <MemoryRouter>
        <TrackerPage />
      </MemoryRouter>
    )

    // Verify Flipkart card is in Applied column
    expect(screen.getByText('Flipkart')).toBeInTheDocument()
    expect(screen.getByText(/sde-1/i)).toBeInTheDocument()

    // Advance button moves it to Shortlisted (Walkthrough step 5)
    const advanceBtn = screen.getByRole('button', { name: /advance stage/i })
    await userEvent.click(advanceBtn)

    expect(useStore.getState().applications[0].status).toBe('Shortlisted')
  })
})
