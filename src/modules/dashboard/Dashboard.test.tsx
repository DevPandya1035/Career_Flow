import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Dashboard } from './Dashboard'

describe('Dashboard Component', () => {
  it('renders welcome banner with student name and journey stepper', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    expect(screen.getByText(/aarav/i)).toBeInTheDocument()
    expect(screen.getAllByText(/discover/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/prepare/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/apply/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/succeed/i).length).toBeGreaterThanOrEqual(1)
  })

  it('renders readiness score meter, upcoming deadlines, and application status counters', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    expect(screen.getByRole('meter')).toBeInTheDocument()
    expect(screen.getAllByText(/upcoming deadlines/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/applied/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/shortlisted/i).length).toBeGreaterThanOrEqual(1)
  })

  it('renders recommended drives section', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    expect(screen.getByText(/recommended for you/i)).toBeInTheDocument()
  })
})
