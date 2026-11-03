import { describe, it, expect } from 'vitest'
import { MOCK_JOBS } from './jobs'
import { DEFAULT_STUDENT } from './student'

describe('Mock data', () => {
  it('has exactly 10 jobs', () => {
    expect(MOCK_JOBS).toHaveLength(10)
  })

  it('every job has required fields and valid types', () => {
    MOCK_JOBS.forEach(job => {
      expect(job.id).toBeTruthy()
      expect(job.company).toBeTruthy()
      expect(job.role).toBeTruthy()
      expect(job.ctcLPA).toBeGreaterThan(0)
      expect(job.eligibility.minCGPA).toBeGreaterThan(0)
      expect(job.eligibility.branches.length).toBeGreaterThan(0)
    })
  })

  it('default student is Aarav Mehta with CGPA 8.4', () => {
    expect(DEFAULT_STUDENT.name).toBe('Aarav Mehta')
    expect(DEFAULT_STUDENT.cgpa).toBe(8.4)
    expect(DEFAULT_STUDENT.branch).toBe('CS')
  })

  it('Google requires CGPA 8.5 — Aarav is ineligible', () => {
    const google = MOCK_JOBS.find(j => j.company === 'Google')
    expect(google).toBeDefined()
    expect(google!.eligibility.minCGPA).toBe(8.5)
    expect(DEFAULT_STUDENT.cgpa).toBeLessThan(google!.eligibility.minCGPA)
  })

  it('Flipkart allows CGPA 6.5 — Aarav is eligible', () => {
    const flipkart = MOCK_JOBS.find(j => j.company === 'Flipkart')
    expect(flipkart).toBeDefined()
    expect(DEFAULT_STUDENT.cgpa).toBeGreaterThanOrEqual(flipkart!.eligibility.minCGPA)
  })
})
