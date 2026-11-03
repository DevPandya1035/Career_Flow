import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App Routing', () => {
  it('renders without crashing and shows the AppShell with Dashboard at root', () => {
    render(<App />)
    const dashboardLinks = screen.getAllByRole('link', { name: /dashboard/i })
    expect(dashboardLinks.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument()
  })
})
