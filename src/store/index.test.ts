import { describe, it, expect, beforeEach } from 'vitest'
import { useStore } from './index'
import { MOCK_JOBS } from '../data/jobs'

describe('Zustand Global Store', () => {
  beforeEach(() => {
    localStorage.clear()
    useStore.getState().resetStore?.()
  })

  it('initializes with default student Aarav Mehta', () => {
    const student = useStore.getState().student
    expect(student.name).toBe('Aarav Mehta')
    expect(student.cgpa).toBe(8.4)
    expect(student.branch).toBe('CS')
  })

  it('initializes with 10 mock jobs', () => {
    const jobs = useStore.getState().jobs
    expect(jobs).toHaveLength(10)
  })

  it('can toggle save/bookmark a job', () => {
    const jobId = MOCK_JOBS[0].id
    expect(useStore.getState().savedJobIds.includes(jobId)).toBe(false)
    useStore.getState().toggleSaveJob(jobId)
    expect(useStore.getState().savedJobIds.includes(jobId)).toBe(true)
    useStore.getState().toggleSaveJob(jobId)
    expect(useStore.getState().savedJobIds.includes(jobId)).toBe(false)
  })

  it('adds an application to applications array and guards against duplicates', () => {
    const jobId = MOCK_JOBS[6].id // Flipkart
    const resumeId = 'resume-1'

    expect(useStore.getState().applications).toHaveLength(0)
    const success1 = useStore.getState().addApplication({ jobId, resumeId })
    expect(success1).toBe(true)
    expect(useStore.getState().applications).toHaveLength(1)
    expect(useStore.getState().applications[0].status).toBe('Applied')

    // Duplicate submission attempt
    const success2 = useStore.getState().addApplication({ jobId, resumeId })
    expect(success2).toBe(false)
    expect(useStore.getState().applications).toHaveLength(1)
  })

  it('advances application stage in demo mode (Applied -> Shortlisted -> Assessment -> Interview -> Selected)', () => {
    const jobId = MOCK_JOBS[6].id
    useStore.getState().addApplication({ jobId, resumeId: 'resume-1' })
    const app = useStore.getState().applications[0]
    expect(app.status).toBe('Applied')

    useStore.getState().advanceApplicationStatus(app.id)
    expect(useStore.getState().applications[0].status).toBe('Shortlisted')

    useStore.getState().advanceApplicationStatus(app.id)
    expect(useStore.getState().applications[0].status).toBe('Assessment')

    useStore.getState().advanceApplicationStatus(app.id)
    expect(useStore.getState().applications[0].status).toBe('Interview')

    useStore.getState().advanceApplicationStatus(app.id)
    expect(useStore.getState().applications[0].status).toBe('Selected')
  })

  it('updates prep DSA problem count and progress', () => {
    const initialSolved = useStore.getState().prep.dsa['Arrays']?.solved || 0
    useStore.getState().logDSAProblem('Arrays')
    expect(useStore.getState().prep.dsa['Arrays'].solved).toBe(initialSolved + 1)
  })

  it('toggles checklist items', () => {
    const item = 'Resume Formatted'
    const initial = !!useStore.getState().prep.checklist[item]
    useStore.getState().toggleChecklistItem(item)
    expect(useStore.getState().prep.checklist[item]).toBe(!initial)
  })

  it('updates student academic profile details with validation', () => {
    useStore.getState().updateStudentProfile({ cgpa: 8.8 })
    expect(useStore.getState().student.cgpa).toBe(8.8)
  })
})
