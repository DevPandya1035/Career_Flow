/**
 * CareerFlow Core Types
 * Based on ISO 9241-210 Human-Centred Design Specifications
 */

export type Branch = 'CS' | 'IT' | 'ECE' | 'ME' | 'CE' | 'EE'

export type JobType = 'SWE' | 'Analyst' | 'Core' | 'Finance' | 'Consulting'

export type ApplicationStatus = 
  | 'Applied' 
  | 'Shortlisted' 
  | 'Assessment' 
  | 'Interview' 
  | 'Selected' 
  | 'Rejected'

export interface Resume {
  id: string
  filename: string
  sizeKB: number
  uploadedAt: string
  isPrimary: boolean
  url?: string
}

export interface StudentPreferences {
  roles: string[]
  locations: string[]
}

export interface Student {
  id: string
  name: string
  email: string
  branch: Branch
  year: number
  cgpa: number
  tenthPercent: number
  twelfthPercent: number
  backlogs: number
  skills: string[]
  resumes: Resume[]
  preferences: StudentPreferences
}

export interface EligibilityCriteria {
  minCGPA: number
  maxBacklogs: number
  branches: Branch[]
  minTenthPercent: number
  minTwelfthPercent: number
  requiredSkills: string[]
}

export interface Job {
  id: string
  company: string
  companyLogo: string
  role: string
  type: JobType
  ctcLPA: number
  deadline: string // ISO 8601 string
  eligibility: EligibilityCriteria
  description: string
  rounds: string[]
  locations: string[]
  isSaved?: boolean
}

export interface CriterionDetail {
  criterion: string
  studentValue: string
  required: string
  passed: boolean
}

export interface EligibilityResult {
  isEligible: boolean
  pass: CriterionDetail[]
  fail: CriterionDetail[]
}

export interface Application {
  id: string
  jobId: string
  resumeId: string
  appliedAt: string // ISO 8601 string
  status: ApplicationStatus
  nextStep: string
  deadlineAlert?: string
}

export interface DSATopic {
  name: string
  total: number
  solved: number
}

export interface AptitudeAttempt {
  id: string
  score: number
  totalQuestions: number
  date: string
}

export interface MockInterviewSlot {
  id: string
  datetime: string
  interviewer: string
  type: string
  status: 'available' | 'booked' | 'completed'
}

export interface PrepProgress {
  dsa: Record<string, { total: number; solved: number }>
  aptitude: AptitudeAttempt[]
  checklist: Record<string, boolean>
  mockInterviews: MockInterviewSlot[]
}
