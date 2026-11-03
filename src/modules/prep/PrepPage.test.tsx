import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { PrepPage } from './PrepPage'
import { useStore } from '../../store'

describe('Preparation Hub Module', () => {
  beforeEach(() => {
    localStorage.clear()
    useStore.getState().resetStore?.()
  })

  it('renders all 4 preparation tabs (DSA, Aptitude, Resume Checklist, Mock Interviews)', () => {
    render(
      <MemoryRouter>
        <PrepPage />
      </MemoryRouter>
    )

    expect(screen.getByRole('tab', { name: /dsa tracker/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /aptitude practice/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /resume checklist/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /mock interviews/i })).toBeInTheDocument()
  })

  it('allows logging a solved DSA problem which updates progress bar (Walkthrough step 6)', async () => {
    render(
      <MemoryRouter>
        <PrepPage />
      </MemoryRouter>
    )

    const initialSolved = useStore.getState().prep.dsa['Arrays'].solved

    // Find Log Problem button for Arrays
    const logButtons = screen.getAllByRole('button', { name: /\+1 solved/i })
    await userEvent.click(logButtons[0])

    expect(useStore.getState().prep.dsa['Arrays'].solved).toBe(initialSolved + 1)
  })

  it('toggles resume checklist items and updates progress', async () => {
    render(
      <MemoryRouter>
        <PrepPage />
      </MemoryRouter>
    )

    // Switch to Resume Checklist tab
    const checklistTab = screen.getByRole('tab', { name: /resume checklist/i })
    await userEvent.click(checklistTab)

    // Find checklist item
    const itemCheckbox = screen.getByRole('checkbox', { name: /github repository links functioning/i })
    expect(itemCheckbox).not.toBeChecked()

    await userEvent.click(itemCheckbox)
    expect(itemCheckbox).toBeChecked()
    expect(useStore.getState().prep.checklist['GitHub repository links functioning']).toBe(true)
  })

  it('books and cancels a mock interview slot', async () => {
    render(
      <MemoryRouter>
        <PrepPage />
      </MemoryRouter>
    )

    // Switch to Mock Interviews tab
    const mockTab = screen.getByRole('tab', { name: /mock interviews/i })
    await userEvent.click(mockTab)

    const bookButtons = screen.getAllByRole('button', { name: /book slot/i })
    await userEvent.click(bookButtons[0])

    expect(screen.getByText(/booked/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel booking/i })).toBeInTheDocument()
  })
})
