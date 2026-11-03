import type { StateCreator } from 'zustand'
import type { Application, ApplicationStatus } from '../types'

const STAGE_ORDER: ApplicationStatus[] = [
  'Applied',
  'Shortlisted',
  'Assessment',
  'Interview',
  'Selected'
]

const STAGE_NEXT_STEPS: Record<ApplicationStatus, string> = {
  Applied: 'Awaiting initial resume screening from placement cell',
  Shortlisted: 'Shortlisted! Prepare for online coding / aptitude assessment',
  Assessment: 'Assessment scheduled. Check test link and slot guidelines',
  Interview: 'Interview scheduled. Technical & managerial round prep recommended',
  Selected: 'Offer Extended! Congratulations. Review and accept offer letter',
  Rejected: 'Application closed for this cycle.'
}

export interface ApplicationsSlice {
  applications: Application[]
  addApplication: (payload: { jobId: string; resumeId: string }) => boolean
  advanceApplicationStatus: (id: string) => void
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void
}

export const createApplicationsSlice: StateCreator<
  ApplicationsSlice,
  [],
  [],
  ApplicationsSlice
> = (set, get) => ({
  applications: [],

  addApplication: ({ jobId, resumeId }) => {
    const existing = get().applications.find((app) => app.jobId === jobId)
    if (existing) {
      return false // Duplicate blocked
    }

    const newApp: Application = {
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      jobId,
      resumeId,
      appliedAt: new Date().toISOString(),
      status: 'Applied',
      nextStep: STAGE_NEXT_STEPS['Applied']
    }

    set((state) => ({
      applications: [newApp, ...state.applications]
    }))
    return true
  },

  advanceApplicationStatus: (id) =>
    set((state) => ({
      applications: state.applications.map((app) => {
        if (app.id !== id) return app
        const currentIndex = STAGE_ORDER.indexOf(app.status)
        if (currentIndex < 0 || currentIndex >= STAGE_ORDER.length - 1) return app
        const nextStatus = STAGE_ORDER[currentIndex + 1]
        return {
          ...app,
          status: nextStatus,
          nextStep: STAGE_NEXT_STEPS[nextStatus]
        }
      })
    })),

  updateApplicationStatus: (id, status) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id
          ? { ...app, status, nextStep: STAGE_NEXT_STEPS[status] }
          : app
      )
    }))
})
