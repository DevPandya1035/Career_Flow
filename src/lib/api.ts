import type {
  Job,
  Student,
  Resume,
  Application,
  PrepProgress,
  ApplicationStatus,
  ApplicantReviewItem,
  PlacementAnalytics,
  CreateDriveInput
} from '../types'

const API_BASE = '/api'

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  const response = await fetch(url, {
    ...options,
    headers
  })

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`
    try {
      const errorData = await response.json()
      if (errorData.error) {
        errorMsg = errorData.error
      } else if (errorData.message) {
        errorMsg = errorData.message
      }
    } catch {
      // response wasn't JSON
    }
    throw new Error(errorMsg)
  }

  return response.json()
}

export const api = {
  jobs: {
    list: () => request<Job[]>('/jobs'),
    get: (id: string) => request<Job>(`/jobs/${id}`)
  },

  student: {
    get: () => request<Student>('/student'),
    update: (data: Partial<Student>) =>
      request<Student>('/student', {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    addResume: (resume: { filename: string; sizeKB: number; isPrimary?: boolean; url?: string }) =>
      request<Resume>('/student/resumes', {
        method: 'POST',
        body: JSON.stringify(resume)
      }),
    deleteResume: (id: string) =>
      request<{ success: boolean }>(`/student/resumes/${id}`, {
        method: 'DELETE'
      })
  },

  applications: {
    list: () => request<Application[]>('/applications'),
    create: (jobId: string, resumeId: string) =>
      request<Application>('/applications', {
        method: 'POST',
        body: JSON.stringify({ jobId, resumeId })
      })
  },

  prep: {
    get: () => request<PrepProgress>('/prep'),
    incrementDsa: (topic: string) =>
      request<PrepProgress>(`/prep/dsa/${encodeURIComponent(topic)}/increment`, {
        method: 'POST'
      }),
    saveAptitude: (score: number, totalQuestions: number) =>
      request<PrepProgress>('/prep/aptitude', {
        method: 'POST',
        body: JSON.stringify({ score, totalQuestions })
      }),
    toggleChecklist: (key: string, checked: boolean) =>
      request<PrepProgress>('/prep/checklist', {
        method: 'PATCH',
        body: JSON.stringify({ key, checked })
      }),
    bookMock: (slotId: string) =>
      request<PrepProgress>(`/prep/mock/${slotId}/book`, {
        method: 'POST'
      }),
    cancelMock: (slotId: string) =>
      request<PrepProgress>(`/prep/mock/${slotId}/cancel`, {
        method: 'POST'
      })
  },

  admin: {
    createDrive: (data: CreateDriveInput) =>
      request<Job>('/admin/jobs', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    updateDrive: (id: string, data: Partial<CreateDriveInput>) =>
      request<Job>(`/admin/jobs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    archiveDrive: (id: string) =>
      request<{ success: boolean; message: string }>(`/admin/jobs/${id}`, {
        method: 'DELETE'
      }),
    getApplicants: (jobId: string) =>
      request<ApplicantReviewItem[]>(`/admin/jobs/${jobId}/applicants`),
    autoShortlist: (jobId: string) =>
      request<{
        success: boolean
        jobId: string
        shortlistedCount: number
        totalEvaluated: number
        message: string
      }>(`/admin/jobs/${jobId}/auto-shortlist`, {
        method: 'POST'
      }),
    updateApplicantStage: (
      applicationId: string,
      status: ApplicationStatus,
      nextStep?: string,
      feedback?: string
    ) =>
      request<{
        id: string
        status: ApplicationStatus
        nextStep: string
        feedback?: string
      }>(`/admin/applications/${applicationId}/stage`, {
        method: 'PATCH',
        body: JSON.stringify({ status, nextStep, feedback })
      }),
    getAnalytics: () => request<PlacementAnalytics>('/admin/analytics')
  }
}

