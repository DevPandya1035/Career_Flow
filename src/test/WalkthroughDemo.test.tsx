import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { useStore } from '../store'

describe('End-to-End HCI Walkthrough Demo (Dev Rahulkumar Pandya & Satyam Singh Report)', () => {
  beforeEach(() => {
    localStorage.clear()
    useStore.getState().resetStore?.()
  })

  it('executes full 6-step campus placement journey end-to-end', async () => {
    render(<App />)

    // ==========================================
    // STEP 1: DASHBOARD
    // ==========================================
    // Aarav Mehta lands on Dashboard, sees readiness score ring, stage counts, deadlines
    expect(screen.getByRole('heading', { name: /placement readiness meter/i })).toBeInTheDocument()
    expect(screen.getByRole('meter', { name: /placement readiness score/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /upcoming deadlines/i })).toBeInTheDocument()

    // ==========================================
    // STEP 2: DISCOVER JOBS
    // ==========================================
    // Aarav navigates to Job Opportunities
    const jobsLinks = screen.getAllByRole('link', { name: /jobs|job opportunities/i })
    await userEvent.click(jobsLinks[0])

    expect(screen.getByRole('heading', { name: /campus opportunities/i })).toBeInTheDocument()
    expect(screen.getByText('Google')).toBeInTheDocument()
    expect(screen.getByText('Flipkart')).toBeInTheDocument()

    // Google has Ineligible badge (Aarav CGPA 8.4 < 8.5)
    const googleCards = screen.getAllByTestId('job-card-job-google-1')
    expect(googleCards.length).toBeGreaterThan(0)
    expect(googleCards[0]).toHaveTextContent(/ineligible/i)

    // Flipkart has Eligible badge
    const flipkartCards = screen.getAllByTestId('job-card-job-flipkart-1')
    expect(flipkartCards.length).toBeGreaterThan(0)
    expect(flipkartCards[0]).toHaveTextContent(/eligible/i)

    // ==========================================
    // STEP 3: ELIGIBILITY CHECKER (WHAT-IF)
    // ==========================================
    const eligLinks = screen.getAllByRole('link', { name: /eligibility/i })
    await userEvent.click(eligLinks[0])

    expect(screen.getByRole('heading', { name: /eligibility checker & what-if analyzer/i })).toBeInTheDocument()

    // Select Google
    const companySelect = screen.getByRole('combobox', { name: /select company/i })
    await userEvent.selectOptions(companySelect, 'job-google-1')

    // Initially Ineligible
    expect(screen.getAllByText(/ineligible/i).length).toBeGreaterThanOrEqual(1)

    // Adjust What-If CGPA to 8.6
    const whatIfCgpa = screen.getByLabelText(/what-if cgpa/i)
    await userEvent.clear(whatIfCgpa)
    await userEvent.type(whatIfCgpa, '8.6')

    // Result changes dynamically to Eligible!
    expect(screen.getAllByText(/^Eligible$/i).length).toBeGreaterThanOrEqual(1)

    // ==========================================
    // STEP 4: APPLY TO JOB
    // ==========================================
    await userEvent.click(jobsLinks[0])

    // Find Flipkart Apply Now button
    const flipkartCard = screen.getByTestId('job-card-job-flipkart-1')
    const applyButton = within(flipkartCard).getByRole('button', { name: /apply now/i })
    expect(applyButton).toBeInTheDocument()
    await userEvent.click(applyButton)

    // Apply Modal is open
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /apply to flipkart/i })).toBeInTheDocument()

    // Confirmation checkbox
    const confirmCheckbox = screen.getByRole('checkbox', {
      name: /confirm application submission/i
    })
    await userEvent.click(confirmCheckbox)

    const submitBtn = screen.getByRole('button', { name: /submit application/i })
    expect(submitBtn).toBeEnabled()
    await userEvent.click(submitBtn)

    // Modal closes and application is created
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    // ==========================================
    // STEP 5: TRACK APPLICATION
    // ==========================================
    const trackerLinks = screen.getAllByRole('link', { name: /tracker/i })
    await userEvent.click(trackerLinks[0])

    expect(screen.getByRole('heading', { name: /application pipeline tracker/i })).toBeInTheDocument()
    expect(screen.getByText('Flipkart')).toBeInTheDocument()

    // Advance Flipkart from Applied -> Shortlisted
    const advanceButton = screen.getByRole('button', { name: /advance stage/i })
    await userEvent.click(advanceButton)

    // Verify status updated in store
    const app = useStore.getState().applications.find((a) => a.jobId === 'job-flipkart-1')
    expect(app?.status).toBe('Shortlisted')

    // ==========================================
    // STEP 6: PREPARATION HUB
    // ==========================================
    const prepLinks = screen.getAllByRole('link', { name: /prep/i })
    await userEvent.click(prepLinks[0])

    expect(screen.getByRole('heading', { name: /preparation hub/i })).toBeInTheDocument()

    const initialSolved = useStore.getState().prep.dsa['Arrays'].solved
    const logButton = screen.getAllByRole('button', { name: /\+1 solved/i })[0]
    await userEvent.click(logButton)

    expect(useStore.getState().prep.dsa['Arrays'].solved).toBe(initialSolved + 1)
  })
})
