import { describe, it, expect } from 'vitest'
import { calcReadinessScore } from './useReadinessScore'
import type { PrepProgress, Student } from '../types'

describe('calcReadinessScore', () => {
  const emptyStudent: Student = {
    id: 's1',
    name: '',
    email: '',
    branch: '' as any,
    year: 4,
    cgpa: 0,
    tenthPercent: 0,
    twelfthPercent: 0,
    backlogs: 0,
    skills: [],
    resumes: [],
    preferences: { roles: [], locations: [] }
  }

  const emptyPrep: PrepProgress = {
    dsa: {},
    aptitude: [],
    checklist: {},
    mockInterviews: []
  }

  it('calculates score based on weighted factors: DSA 40%, Aptitude 20%, Checklist 25%, Profile 15%', () => {
    const student: Student = {
      ...emptyStudent,
      branch: 'CS',
      cgpa: 8.4,
      skills: ['React', 'Python'],
      resumes: [{ id: 'r1', filename: 'cv.pdf', sizeKB: 100, uploadedAt: '', isPrimary: true }]
    }

    const prep: PrepProgress = {
      dsa: {
        'Arrays': { total: 10, solved: 10 } // 100% DSA -> 40 points
      },
      aptitude: [{ id: 'a1', score: 100, totalQuestions: 20, date: '' }], // 100% Aptitude -> 20 points
      checklist: { 'Check 1': true }, // 100% Checklist -> 25 points
      mockInterviews: []
    }

    // Profile has cgpa (>0), skills (>0), resumes (>0), branch -> 100% Profile -> 15 points
    const score = calcReadinessScore(prep, student)
    expect(score).toBe(100)
  })

  it('returns appropriate percentage when partially complete', () => {
    const score = calcReadinessScore(emptyPrep, emptyStudent)
    expect(score).toBe(0)
  })
})
