import type { Student } from '../types'

export const DEFAULT_STUDENT: Student = {
  id: 'student-aarav-mehta',
  name: 'Aarav Mehta',
  email: 'aarav.mehta@mit.edu',
  branch: 'CS',
  year: 4,
  cgpa: 8.4,
  tenthPercent: 92,
  twelfthPercent: 88,
  backlogs: 0,
  skills: ['React', 'Python', 'Data Structures', 'SQL', 'Algorithms', 'Java'],
  resumes: [
    {
      id: 'resume-1',
      filename: 'Aarav_Mehta_SDE_Resume.pdf',
      sizeKB: 412,
      uploadedAt: '2026-10-15T10:30:00Z',
      isPrimary: true
    },
    {
      id: 'resume-2',
      filename: 'Aarav_Mehta_Research_CV.pdf',
      sizeKB: 580,
      uploadedAt: '2026-10-20T14:15:00Z',
      isPrimary: false
    }
  ],
  preferences: {
    roles: ['SWE', 'Analyst'],
    locations: ['Bengaluru', 'Hyderabad']
  }
}
