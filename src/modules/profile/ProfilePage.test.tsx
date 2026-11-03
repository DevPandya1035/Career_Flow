import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ProfilePage } from './ProfilePage'
import { useStore } from '../../store'

describe('Student Profile Module', () => {
  beforeEach(() => {
    localStorage.clear()
    useStore.getState().resetStore?.()
  })

  it('renders academic details, skills, and resume management sections', () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: /academic & personal details/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /technical skills & competencies/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /resume management/i })).toBeInTheDocument()
  })

  it('validates CGPA and prevents saving invalid numbers', async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    )

    const cgpaInput = screen.getByLabelText(/current cgpa/i)
    await userEvent.clear(cgpaInput)
    await userEvent.type(cgpaInput, '11.5')

    expect(screen.getByText(/cgpa must be between 0.0 and 10.0/i)).toBeInTheDocument()
    const saveButton = screen.getByRole('button', { name: /save changes/i })
    expect(saveButton).toBeDisabled()
  })

  it('updates academic profile and updates the store with valid values', async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    )

    const cgpaInput = screen.getByLabelText(/current cgpa/i)
    await userEvent.clear(cgpaInput)
    await userEvent.type(cgpaInput, '8.9')

    const saveButton = screen.getByRole('button', { name: /save changes/i })
    expect(saveButton).toBeEnabled()
    await userEvent.click(saveButton)

    expect(useStore.getState().student.cgpa).toBe(8.9)
  })

  it('allows adding and removing skills dynamically', async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    )

    const skillInput = screen.getByPlaceholderText(/add a skill/i)
    await userEvent.type(skillInput, 'Kubernetes{enter}')

    expect(useStore.getState().student.skills).toContain('Kubernetes')
    expect(screen.getByText('Kubernetes')).toBeInTheDocument()

    const removeBtn = screen.getByRole('button', { name: /remove kubernetes/i })
    await userEvent.click(removeBtn)

    expect(useStore.getState().student.skills).not.toContain('Kubernetes')
  })

  it('manages primary resumes and simulates new resume upload', async () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    )

    // Check default primary resume
    expect(screen.getByText(/^primary$/i)).toBeInTheDocument()

    // Test file input upload simulation
    const file = new File(['dummy pdf content'], 'Aarav_Mehta_Research.pdf', { type: 'application/pdf' })
    const fileInput = screen.getByLabelText(/upload resume/i)
    
    await userEvent.upload(fileInput, file)

    const state = useStore.getState()
    const added = state.student.resumes.find((r) => r.filename === 'Aarav_Mehta_Research.pdf')
    expect(added).toBeDefined()
  })
})
