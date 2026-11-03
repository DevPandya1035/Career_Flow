import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Sidebar } from './Sidebar'

describe('Sidebar Navigation', () => {
  it('renders all 6 module navigation links with accessible roles', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Sidebar />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /job/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /tracker/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /eligibility/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /prep/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument()
  })

  it('sets aria-current="page" on the active route link', () => {
    render(
      <MemoryRouter initialEntries={['/jobs']}>
        <Sidebar />
      </MemoryRouter>
    )

    const jobsLink = screen.getByRole('link', { name: /job/i })
    expect(jobsLink).toHaveAttribute('aria-current', 'page')

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
    expect(dashboardLink).not.toHaveAttribute('aria-current')
  })
})
