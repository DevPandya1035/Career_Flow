import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../app'

describe('Jobs REST API', () => {
  it('GET /api/jobs returns array of all active company placement drives', async () => {
    const res = await request(app).get('/api/jobs')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThanOrEqual(10)

    const google = res.body.find((j: any) => j.company === 'Google')
    expect(google).toBeDefined()
    expect(google.eligibility.minCGPA).toBe(8.5)
    expect(google.eligibility.branches).toContain('CS')
  })

  it('GET /api/jobs/:id returns single job details', async () => {
    const res = await request(app).get('/api/jobs/job-google-1')
    expect(res.status).toBe(200)
    expect(res.body.company).toBe('Google')
    expect(res.body.role).toBe('Software Engineer (L3)')
  })

  it('GET /api/jobs/unknown returns 404', async () => {
    const res = await request(app).get('/api/jobs/non-existent-job')
    expect(res.status).toBe(404)
    expect(res.body.error).toMatch(/not found/i)
  })
})

