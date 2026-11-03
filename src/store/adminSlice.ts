import { StateCreator } from 'zustand'
import type { UserRole, PlacementAnalytics, ApplicantReviewItem } from '../types'

export interface AdminSlice {
  currentRole: UserRole
  setCurrentRole: (role: UserRole) => void
  analytics: PlacementAnalytics | null
  setAnalytics: (analytics: PlacementAnalytics) => void
  selectedJobIdForReview: string | null
  setSelectedJobIdForReview: (jobId: string | null) => void
}

export const createAdminSlice: StateCreator<AdminSlice, [], [], AdminSlice> = (set) => ({
  currentRole: 'student',
  setCurrentRole: (role) => set({ currentRole: role }),
  analytics: null,
  setAnalytics: (analytics) => set({ analytics }),
  selectedJobIdForReview: null,
  setSelectedJobIdForReview: (jobId) => set({ selectedJobIdForReview: jobId })
})
