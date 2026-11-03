import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { api } from './api'

describe('Frontend API Client (src/lib/api.ts)', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('api.jobs.list sends GET to /api/jobs and returns json', async () => {
    const mockJobs = [{ id: 'job-1', company: 'Google' }]
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockJobs
    })

    const result = await api.jobs.list()
    expect(global.fetch).toHaveBeenCalledWith('/api/jobs', {
      headers: { 'Content-Type': 'application/json' }
    })
    expect(result).toEqual(mockJobs)
  })

  it('api.admin.createDrive sends POST to /api/admin/jobs with payload', async () => {
    const payload = {
      company: 'Amazon',
      role: 'SDE-1',
      type: 'SWE' as const,
      ctcLPA: 45,
      deadline: '2026-11-20T23:59:59Z',
      minCGPA: 7.5,
      maxBacklogs: 0,
      branches: ['CS' as const],
      minTenthPercent: 70,
      minTwelfthPercent: 70,
      requiredSkills: ['Java'],
      description: 'AWS Cloud Services',
      rounds: ['OA', 'Technical'],
      locations: ['Bangalore']
    }

    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'job-amazon-new', ...payload })
    })

    const result = await api.admin.createDrive(payload)
    expect(global.fetch).toHaveBeenCalledWith('/api/admin/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    expect(result.id).toBe('job-amazon-new')
  })

  it('api.admin.autoShortlist sends POST to /api/admin/jobs/:jobId/auto-shortlist', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        jobId: 'job-1',
        shortlistedCount: 15,
        totalEvaluated: 20,
        message: 'Successfully shortlisted 15 qualifying candidate(s).'
      })
    })

    const res = await api.admin.autoShortlist('job-1')
    expect(global.fetch).toHaveBeenCalledWith('/api/admin/jobs/job-1/auto-shortlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    expect(res.shortlistedCount).toBe(15)
  })

  it('throws descriptive error when fetch returns non-200', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 409,
      statusText: 'Conflict',
      json: async () => ({ error: 'Candidate has already applied for this placement drive.' })
    })

    await expect(api.applications.create('job-1', 'resume-1')).rejects.toThrow(
      'Candidate has already applied for this placement drive.'
    )
  })
})
