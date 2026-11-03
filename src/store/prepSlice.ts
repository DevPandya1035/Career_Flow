import type { StateCreator } from 'zustand'
import type { PrepProgress, AptitudeAttempt } from '../types'

export const INITIAL_PREP_PROGRESS: PrepProgress = {
  dsa: {
    'Arrays': { total: 30, solved: 18 },
    'Linked Lists': { total: 20, solved: 12 },
    'Trees': { total: 25, solved: 10 },
    'Graphs': { total: 25, solved: 8 },
    'Dynamic Programming': { total: 35, solved: 14 },
    'Sorting & Searching': { total: 20, solved: 15 },
    'System Design': { total: 15, solved: 4 }
  },
  aptitude: [
    { id: 'apt-1', score: 80, totalQuestions: 20, date: '2026-10-25T11:00:00Z' },
    { id: 'apt-2', score: 85, totalQuestions: 20, date: '2026-11-01T15:30:00Z' }
  ],
  checklist: {
    'Contact information and LinkedIn verified': true,
    'Clean single-page ATS-friendly formatting': true,
    'Quantified bullet points (impact, %, metrics)': true,
    'Relevant coursework and technical projects highlighted': true,
    'GitHub repository links functioning': false,
    'Grammar and spell check performed': true,
    'PDF size under 2MB and readable text': true
  },
  mockInterviews: [
    {
      id: 'mock-1',
      datetime: '2026-11-06T14:00:00Z',
      interviewer: 'Alumni Mentor (Google SDE-2)',
      type: 'Data Structures & Algorithms Mock',
      status: 'available'
    },
    {
      id: 'mock-2',
      datetime: '2026-11-08T16:30:00Z',
      interviewer: 'Alumni Mentor (Microsoft SDE-1)',
      type: 'System Design & Problem Solving',
      status: 'available'
    },
    {
      id: 'mock-3',
      datetime: '2026-11-12T11:00:00Z',
      interviewer: 'Placement Cell Faculty Coordinator',
      type: 'HR & Behavioral Competency',
      status: 'available'
    }
  ]
}

export interface PrepSlice {
  prep: PrepProgress
  logDSAProblem: (topic: string) => void
  recordAptitudeAttempt: (score: number, totalQuestions: number) => void
  toggleChecklistItem: (item: string) => void
  bookMockInterview: (slotId: string) => void
  cancelMockInterview: (slotId: string) => void
}

export const createPrepSlice: StateCreator<
  PrepSlice,
  [],
  [],
  PrepSlice
> = (set) => ({
  prep: INITIAL_PREP_PROGRESS,

  logDSAProblem: (topic) =>
    set((state) => {
      const current = state.prep.dsa[topic] || { total: 20, solved: 0 }
      const newSolved = Math.min(current.solved + 1, current.total)
      return {
        prep: {
          ...state.prep,
          dsa: {
            ...state.prep.dsa,
            [topic]: { ...current, solved: newSolved }
          }
        }
      }
    }),

  recordAptitudeAttempt: (score, totalQuestions) =>
    set((state) => {
      const newAttempt: AptitudeAttempt = {
        id: `apt-${Date.now()}`,
        score,
        totalQuestions,
        date: new Date().toISOString()
      }
      return {
        prep: {
          ...state.prep,
          aptitude: [newAttempt, ...state.prep.aptitude]
        }
      }
    }),

  toggleChecklistItem: (item) =>
    set((state) => ({
      prep: {
        ...state.prep,
        checklist: {
          ...state.prep.checklist,
          [item]: !state.prep.checklist[item]
        }
      }
    })),

  bookMockInterview: (slotId) =>
    set((state) => ({
      prep: {
        ...state.prep,
        mockInterviews: state.prep.mockInterviews.map((slot) =>
          slot.id === slotId ? { ...slot, status: 'booked' } : slot
        )
      }
    })),

  cancelMockInterview: (slotId) =>
    set((state) => ({
      prep: {
        ...state.prep,
        mockInterviews: state.prep.mockInterviews.map((slot) =>
          slot.id === slotId ? { ...slot, status: 'available' } : slot
        )
      }
    }))
})
