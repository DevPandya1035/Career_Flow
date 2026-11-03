import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { JobCard } from './JobCard'
import { MOCK_JOBS } from '../../data/jobs'
import { DEFAULT_STUDENT } from '../../data/student'

const google = MOCK_JOBS.find((j) => j.company === 'Google')!
const flipkart = MOCK_JOBS.find((j) => j.company === 'Flipkart')!

describe('JobCard Component', () => {
  it('shows Ineligible pill for Google (Aarav CGPA 8.4 < 8.5)', () => {
    render(
      <MemoryRouter>
        <JobCard
          job={google}
          student={DEFAULT_STUDENT}
          isApplied={false}
          isSaved={false}
          onApply={() => {}}
          onToggleSave={() => {}}
        />
      </MemoryRouter>
    )

    expect(screen.getByText(/ineligible/i)).toBeInTheDocument()
  })

  it('shows Eligible pill for Flipkart', () => {
    render(
      <MemoryRouter>
        <JobCard
          job={flipkart}
          student={DEFAULT_STUDENT}
          isApplied={false}
          isSaved={false}
          onApply={() => {}}
          onToggleSave={() => {}}
        />
      </MemoryRouter>
    )

    expect(screen.getByText(/eligible/i)).toBeInTheDocument()
  })

  it('Apply button is disabled with explanation when student is ineligible', () => {
    render(
      <MemoryRouter>
        <JobCard
          job={google}
          student={DEFAULT_STUDENT}
          isApplied={false}
          isSaved={false}
          onApply={() => {}}
          onToggleSave={() => {}}
        />
      </MemoryRouter>
    )

    const applyBtn = screen.getByRole('button', { name: /apply/i })
    expect(applyBtn).toBeDisabled()
    expect(screen.getByRole('tooltip')).toHaveTextContent(/cgpa/i)
  })

  it('Apply button is enabled and calls onApply for eligible jobs', async () => {
    const onApply = vi.fn()
    render(
      <MemoryRouter>
        <JobCard
          job={flipkart}
          student={DEFAULT_STUDENT}
          isApplied={false}
          isSaved={false}
          onApply={onApply}
          onToggleSave={() => {}}
        />
      </MemoryRouter>
    )

    const applyBtn = screen.getByRole('button', { name: /apply now/i })
    expect(applyBtn).toBeEnabled()
    await userEvent.click(applyBtn)
    expect(onApply).toHaveBeenCalledWith(flipkart)
  })

  it('shows Applied status badge if already applied', () => {
    render(
      <MemoryRouter>
        <JobCard
          job={flipkart}
          student={DEFAULT_STUDENT}
          isApplied={true}
          isSaved={false}
          onApply={() => {}}
          onToggleSave={() => {}}
        />
      </MemoryRouter>
    )

    expect(screen.getByText(/application submitted/i)).toBeInTheDocument()
  })
})
