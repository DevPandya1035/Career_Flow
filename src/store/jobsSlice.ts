import type { StateCreator } from 'zustand'
import type { Job, JobType, Branch } from '../types'
import { MOCK_JOBS } from '../data/jobs'

export interface JobFilters {
  roleTypes: JobType[]
  minCTC: number
  branches: Branch[]
  minCGPA: number
  showEligibleOnly: boolean
  showSavedOnly: boolean
  sortBy: 'deadline' | 'ctc-desc' | 'company'
}

export const INITIAL_FILTERS: JobFilters = {
  roleTypes: [],
  minCTC: 0,
  branches: [],
  minCGPA: 0,
  showEligibleOnly: false,
  showSavedOnly: false,
  sortBy: 'deadline'
}

export interface JobsSlice {
  jobs: Job[]
  savedJobIds: string[]
  searchQuery: string
  filters: JobFilters
  toggleSaveJob: (jobId: string) => void
  setSearchQuery: (query: string) => void
  updateFilters: (updates: Partial<JobFilters>) => void
  resetFilters: () => void
}

export const createJobsSlice: StateCreator<
  JobsSlice,
  [],
  [],
  JobsSlice
> = (set) => ({
  jobs: MOCK_JOBS,
  savedJobIds: [],
  searchQuery: '',
  filters: INITIAL_FILTERS,

  toggleSaveJob: (jobId) =>
    set((state) => {
      const exists = state.savedJobIds.includes(jobId)
      return {
        savedJobIds: exists
          ? state.savedJobIds.filter((id) => id !== jobId)
          : [...state.savedJobIds, jobId]
      }
    }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  updateFilters: (updates) =>
    set((state) => ({
      filters: { ...state.filters, ...updates }
    })),

  resetFilters: () => set({ filters: INITIAL_FILTERS, searchQuery: '' })
})
