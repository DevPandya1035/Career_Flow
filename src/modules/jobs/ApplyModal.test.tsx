import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ApplyModal } from './ApplyModal'
import { MOCK_JOBS } from '../../data/jobs'
import { DEFAULT_STUDENT } from '../../data/student'

const flipkart = MOCK_JOBS.find((j) => j.company === 'Flipkart')!

describe('ApplyModal Component', () => {
  it('renders resume picker and job details', () => {
    render(
      <MemoryRouter>
        <ApplyModal
          isOpen={true}
          job={flipkart}
          student={DEFAULT_STUDENT}
          onClose={() => {}}
          onSubmit={() => {}}
        />
      </MemoryRouter>
    )

    expect(screen.getByText(/apply to flipkart/i)).toBeInTheDocument()
    expect(screen.getByText(/select your active resume/i)).toBeInTheDocument()
    expect(screen.getByText('Aarav_Mehta_SDE_Resume.pdf')).toBeInTheDocument()
  })

  it('prevents submission if confirmation checkbox is not ticked', async () => {
    const onSubmit = vi.fn()
    render(
      <MemoryRouter>
        <ApplyModal
          isOpen={true}
          job={flipkart}
          student={DEFAULT_STUDENT}
          onClose={() => {}}
          onSubmit={onSubmit}
        />
      </MemoryRouter>
    )

    // The submit button is disabled or clicking it without checkbox shows an error
    const submitBtn = screen.getByRole('button', { name: /submit application/i })
    expect(submitBtn).toBeDisabled()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits successfully once resume is chosen and confirmation is ticked', async () => {
    const onSubmit = vi.fn()
    render(
      <MemoryRouter>
        <ApplyModal
          isOpen={true}
          job={flipkart}
          student={DEFAULT_STUDENT}
          onClose={() => {}}
          onSubmit={onSubmit}
        />
      </MemoryRouter>
    )

    const checkbox = screen.getByRole('checkbox', { name: /confirm/i })
    await userEvent.click(checkbox)

    const submitBtn = screen.getByRole('button', { name: /submit application/i })
    expect(submitBtn).toBeEnabled()

    await userEvent.click(submitBtn)
    expect(onSubmit).toHaveBeenCalledWith({
      jobId: flipkart.id,
      resumeId: DEFAULT_STUDENT.resumes[0].id
    })
  })
})
