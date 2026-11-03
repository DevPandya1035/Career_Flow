import type { StateCreator } from 'zustand'
import type { Student, Resume } from '../types'
import { DEFAULT_STUDENT } from '../data/student'

export interface StudentSlice {
  student: Student
  updateStudentProfile: (updates: Partial<Student>) => void
  addResume: (resume: Omit<Resume, 'id' | 'uploadedAt'>) => void
  deleteResume: (id: string) => void
  setPrimaryResume: (id: string) => void
  addSkill: (skill: string) => void
  removeSkill: (skill: string) => void
}

export const createStudentSlice: StateCreator<
  StudentSlice,
  [],
  [],
  StudentSlice
> = (set) => ({
  student: DEFAULT_STUDENT,

  updateStudentProfile: (updates) =>
    set((state) => ({
      student: { ...state.student, ...updates }
    })),

  addResume: (resumeData) =>
    set((state) => {
      const newResume: Resume = {
        ...resumeData,
        id: `resume-${Date.now()}`,
        uploadedAt: new Date().toISOString()
      }
      // If first resume, make it primary
      if (state.student.resumes.length === 0) {
        newResume.isPrimary = true
      }
      return {
        student: {
          ...state.student,
          resumes: [...state.student.resumes, newResume]
        }
      }
    }),

  deleteResume: (id) =>
    set((state) => {
      const remaining = state.student.resumes.filter((r) => r.id !== id)
      if (remaining.length > 0 && !remaining.some((r) => r.isPrimary)) {
        remaining[0].isPrimary = true
      }
      return {
        student: {
          ...state.student,
          resumes: remaining
        }
      }
    }),

  setPrimaryResume: (id) =>
    set((state) => ({
      student: {
        ...state.student,
        resumes: state.student.resumes.map((r) => ({
          ...r,
          isPrimary: r.id === id
        }))
      }
    })),

  addSkill: (skill) =>
    set((state) => {
      const trimmed = skill.trim()
      if (!trimmed || state.student.skills.includes(trimmed)) return state
      return {
        student: {
          ...state.student,
          skills: [...state.student.skills, trimmed]
        }
      }
    }),

  removeSkill: (skill) =>
    set((state) => ({
      student: {
        ...state.student,
        skills: state.student.skills.filter((s) => s !== skill)
      }
    }))
})
