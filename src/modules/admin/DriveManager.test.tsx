import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { DriveManager } from './DriveManager'
import { useStore } from '../../store'

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>)
}

describe('DriveManager Component', () => {
  beforeEach(() => {
    useStore.getState().resetStore?.()
  })

  it('renders drives table with company names, CTC, and criteria', async () => {
    renderWithRouter(<DriveManager />)

    expect(screen.getByText('Placement Drives & Criteria Management')).toBeInTheDocument()
    expect(screen.getByText('Google')).toBeInTheDocument()
    expect(screen.getByText('Microsoft')).toBeInTheDocument()
    expect(screen.getByText('Flipkart')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add Placement Drive/i })).toBeInTheDocument()
  })

  it('filters drives table by search query', async () => {
    const user = userEvent.setup()
    renderWithRouter(<DriveManager />)

    const searchInput = screen.getByPlaceholderText(/Search company or role/i)
    await user.type(searchInput, 'Google')

    expect(screen.getByText('Google')).toBeInTheDocument()
    expect(screen.queryByText('Flipkart')).not.toBeInTheDocument()
  })

  it('opens CreateDriveModal and creates a new placement drive', async () => {
    const user = userEvent.setup()
    renderWithRouter(<DriveManager />)

    const addButton = screen.getByRole('button', { name: /Add Placement Drive/i })
    await user.click(addButton)

    expect(screen.getByRole('heading', { name: /Create Placement Drive/i })).toBeInTheDocument()

    // Fill form
    const companyInput = screen.getByLabelText(/Company Name \*/i)
    const roleInput = screen.getByLabelText(/Job Role \/ Profile \*/i)

    await user.clear(companyInput)
    await user.type(companyInput, 'Netflix')
    await user.clear(roleInput)
    await user.type(roleInput, 'Senior Platform Engineer')

    const submitBtn = screen.getByRole('button', { name: /Publish Placement Drive/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /Create Placement Drive/i })).not.toBeInTheDocument()
      expect(screen.getByText('Netflix')).toBeInTheDocument()
    })
  })
})
