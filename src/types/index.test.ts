import { describe, it, expect, expectTypeOf } from 'vitest'
import type { 
  Student, 
  Job, 
  EligibilityResult, 
  Application, 
  PrepProgress 
} from './index'

describe('TypeScript Types', () => {
  it('Student has required properties and can instantiate', () => {
    const student: Student = {
      id: 's1',
      name: 'Aarav Mehta',
      email: 'aarav@mit.edu',
      branch: 'CS',
      year: 4,
      cgpa: 8.4,
      tenthPercent: 92,
      twelfthPercent: 88,
      backlogs: 0,
      skills: ['React', 'Python'],
      resumes: [],
      preferences: { roles: ['SWE'], locations: ['Bengaluru'] }
    }
    expect(student.name).toBe('Aarav Mehta')
    expect(student.cgpa).toBe(8.4)
    expectTypeOf(student).toMatchTypeOf<Student>()
  })

  it('Job has required properties', () => {
    const job: Job = {
      id: 'j1',
      company: 'Google',
      companyLogo: 'G',
      role: 'SWE',
      type: 'SWE',
      ctcLPA: 45,
      deadline: '2026-12-01',
      eligibility: {
        minCGPA: 8.5,
        maxBacklogs: 0,
        branches: ['CS', 'IT'],
        minTenthPercent: 80,
        minTwelfthPercent: 80,
        requiredSkills: ['DSA']
      },
      description: 'Software Engineer',
      rounds: ['Online Test', 'Technical', 'HR'],
      locations: ['Bengaluru']
    }
    expect(job.company).toBe('Google')
    expectTypeOf(job).toMatchTypeOf<Job>()
  })

  it('EligibilityResult has pass and fail arrays', () => {
    const result: EligibilityResult = {
      isEligible: false,
      pass: [{ criterion: 'Branch', studentValue: 'CS', required: 'CS, IT', passed: true }],
      fail: [{ criterion: 'CGPA', studentValue: '8.4', required: '≥ 8.5', passed: false }]
    }
    expect(result.isEligible).toBe(false)
    expect(result.fail).toHaveLength(1)
    expectTypeOf(result).toMatchTypeOf<EligibilityResult>()
  })

  it('Application has required properties', () => {
    const app: Application = {
      id: 'app1',
      jobId: 'j1',
      resumeId: 'r1',
      appliedAt: new Date().toISOString(),
      status: 'Applied',
      nextStep: 'Awaiting shortlist'
    }
    expect(app.status).toBe('Applied')
    expectTypeOf(app).toMatchTypeOf<Application>()
  })

  it('PrepProgress has dsa, aptitude, checklist, mockInterviews', () => {
    const prep: PrepProgress = {
      dsa: { 'Arrays': { total: 20, solved: 15 } },
      aptitude: [{ id: 'a1', score: 85, totalQuestions: 20, date: '2026-11-01' }],
      checklist: { 'Resume Formatted': true },
      mockInterviews: []
    }
    expect(prep.dsa['Arrays'].solved).toBe(15)
    expectTypeOf(prep).toMatchTypeOf<PrepProgress>()
  })
})
