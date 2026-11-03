import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createStudentSlice, type StudentSlice } from './studentSlice'
import { createJobsSlice, type JobsSlice, INITIAL_FILTERS } from './jobsSlice'
import { createApplicationsSlice, type ApplicationsSlice } from './applicationsSlice'
import { createPrepSlice, type PrepSlice, INITIAL_PREP_PROGRESS } from './prepSlice'
import { DEFAULT_STUDENT } from '../data/student'
import { MOCK_JOBS } from '../data/jobs'

export type StoreState = StudentSlice & 
  JobsSlice & 
  ApplicationsSlice & 
  PrepSlice & {
    resetStore?: () => void
  }

export const useStore = create<StoreState>()(
  persist(
    (set, get, api) => ({
      ...createStudentSlice(set, get, api),
      ...createJobsSlice(set, get, api),
      ...createApplicationsSlice(set, get, api),
      ...createPrepSlice(set, get, api),

      resetStore: () =>
        set({
          student: DEFAULT_STUDENT,
          jobs: MOCK_JOBS,
          savedJobIds: [],
          searchQuery: '',
          filters: INITIAL_FILTERS,
          applications: [],
          prep: INITIAL_PREP_PROGRESS
        })
    }),
    {
      name: 'careerflow_storage_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        student: state.student,
        savedJobIds: state.savedJobIds,
        applications: state.applications,
        prep: state.prep
      })
    }
  )
)
