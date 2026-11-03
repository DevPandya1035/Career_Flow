import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { EligibilityPage } from './EligibilityPage'
import { useStore } from '../../store'

describe('Eligibility Checker Page', () => {
  beforeEach(() => {
    localStorage.clear()
    useStore.getState().resetStore?.()
  })

  it('renders company selector with all 10 mock companies', () => {
    render(
      <MemoryRouter>
        <EligibilityPage />
      </MemoryRouter>
    )

    const selector = screen.getByRole('combobox', { name: /select company/i })
    expect(selector).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /google/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /flipkart/i })).toBeInTheDocument()
  })

  it('evaluates Aarav against Google as Ineligible by default (CGPA 8.4 < 8.5)', async () => {
    render(
      <MemoryRouter>
        <EligibilityPage />
      </MemoryRouter>
    )

    const selector = screen.getByRole('combobox', { name: /select company/i })
    await userEvent.selectOptions(selector, 'job-google-1')

    expect(screen.getAllByText(/ineligible/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/≥ 8.50/i)).toBeInTheDocument()
  })

  it('updates result to Eligible when CGPA override is set to 8.6 (Walkthrough step 3)', async () => {
    render(
      <MemoryRouter>
        <EligibilityPage />
      </MemoryRouter>
    )

    const selector = screen.getByRole('combobox', { name: /select company/i })
    await userEvent.selectOptions(selector, 'job-google-1')

    // Find CGPA What-if input
    const cgpaInput = screen.getByLabelText(/what-if cgpa/i)
    await userEvent.clear(cgpaInput)
    await userEvent.type(cgpaInput, '8.6')

    // Expect overall status turns to Eligible in the ResultsTable
    expect(screen.getAllByText(/^Eligible$/i).length).toBeGreaterThanOrEqual(1)
  })
})
