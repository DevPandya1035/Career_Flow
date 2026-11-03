import { describe, it, expect } from 'vitest'
import { checkEligibility, getSkillsGap } from './eligibility'
import { DEFAULT_STUDENT } from '../data/student'
import { MOCK_JOBS } from '../data/jobs'
import type { Student } from '../types'

describe('Eligibility Engine: checkEligibility', () => {
  const google = MOCK_JOBS.find(j => j.company === 'Google')!
  const flipkart = MOCK_JOBS.find(j => j.company === 'Flipkart')!
  const mahindra = MOCK_JOBS.find(j => j.company === 'Mahindra & Mahindra')!

  it('marks Aarav ineligible for Google due to CGPA (8.4 < 8.5)', () => {
    const result = checkEligibility(DEFAULT_STUDENT, google)
    expect(result.isEligible).toBe(false)
    const cgpaFail = result.fail.find(f => f.criterion === 'CGPA')
    expect(cgpaFail).toBeDefined()
    expect(cgpaFail!.studentValue).toBe('8.40')
    expect(cgpaFail!.required).toBe('≥ 8.50')
  })

  it('marks Aarav eligible for Flipkart (all criteria passed)', () => {
    const result = checkEligibility(DEFAULT_STUDENT, flipkart)
    expect(result.isEligible).toBe(true)
    expect(result.fail).toHaveLength(0)
    expect(result.pass.length).toBeGreaterThanOrEqual(4)
  })

  it('fails branch criteria when student branch is not eligible', () => {
    // Aarav is CS, Mahindra accepts ME, CE, EE only
    const result = checkEligibility(DEFAULT_STUDENT, mahindra)
    expect(result.isEligible).toBe(false)
    const branchFail = result.fail.find(f => f.criterion === 'Branch')
    expect(branchFail).toBeDefined()
    expect(branchFail!.studentValue).toBe('CS')
    expect(branchFail!.required).toContain('ME')
  })

  it('fails backlog criteria when student has active backlogs exceeding max', () => {
    const studentWithBacklogs: Student = {
      ...DEFAULT_STUDENT,
      backlogs: 2
    }
    const result = checkEligibility(studentWithBacklogs, flipkart)
    expect(result.isEligible).toBe(false)
    const backlogFail = result.fail.find(f => f.criterion === 'Active Backlogs')
    expect(backlogFail).toBeDefined()
  })

  it('evaluates what-if CGPA overrides correctly', () => {
    // Override CGPA to 8.6 for Google (which needs 8.5)
    const whatIfStudent: Student = {
      ...DEFAULT_STUDENT,
      cgpa: 8.6,
      skills: ['Data Structures', 'Algorithms', 'System Design']
    }
    const result = checkEligibility(whatIfStudent, google)
    expect(result.isEligible).toBe(true)
  })

  it('identifies missing skills correctly via getSkillsGap', () => {
    const gap = getSkillsGap(DEFAULT_STUDENT, google)
    expect(gap.matched).toContain('Data Structures')
    expect(gap.missing).toContain('System Design')
  })
})
