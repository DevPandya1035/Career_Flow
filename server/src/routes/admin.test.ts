import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../app'
import { prisma } from '../prisma'

describe('TPO Admin REST API', () => {
  beforeEach(async () => {
    // Reset applications for isolated test runs
    await prisma.application.deleteMany()
  })

  it('POST /api/admin/jobs creates a new company placement drive with criteria', async () => {
    const drivePayload = {
      company: 'Uber Technologies',
      role: 'Backend SDE',
      type: 'SWE',
      ctcLPA: 48,
      deadline: '2026-12-25T23:59:59Z',
      minCGPA: 8.0,
      maxBacklogs: 0,
      branches: ['CS', 'IT'],
      minTenthPercent: 80,
      minTwelfthPercent: 80,
      requiredSkills: ['Node.js', 'PostgreSQL', 'System Design'],
      description: 'Distributed ride-hailing and dispatch backend microservices.',
      rounds: ['Online Assessment', 'Tech DSA', 'System Architecture', 'HR'],
      locations: ['Hyderabad', 'Bengaluru']
    }

    const res = await request(app)
      .post('/api/admin/jobs')
      .send(drivePayload)

    expect(res.status).toBe(201)
    expect(res.body.company).toBe('Uber Technologies')
    expect(res.body.ctcLPA).toBe(48)
    expect(res.body.eligibility.minCGPA).toBe(8.0)
    expect(res.body.eligibility.branches).toContain('CS')
  })

  it('GET /api/admin/jobs/:jobId/applicants returns student applicant roster with eligibility status', async () => {
    const student = await prisma.student.findFirst({ include: { resumes: true } })
    const resumeId = student!.resumes[0].id

    // Aarav applies to Flipkart
    await request(app)
      .post('/api/applications')
      .send({ jobId: 'job-flipkart-1', resumeId })

    const res = await request(app).get('/api/admin/jobs/job-flipkart-1/applicants')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(1)
    expect(res.body[0].student.name).toBe('Aarav Mehta')
    expect(res.body[0].isEligible).toBe(true)
  })

  it('POST /api/admin/jobs/:jobId/auto-shortlist bulk shortlists eligible candidates (FR31)', async () => {
    const student = await prisma.student.findFirst({ include: { resumes: true } })
    const resumeId = student!.resumes[0].id

    // Aarav (CGPA 8.4) applies to Flipkart (min CGPA 6.5) -> eligible
    await request(app)
      .post('/api/applications')
      .send({ jobId: 'job-flipkart-1', resumeId })

    const res = await request(app).post('/api/admin/jobs/job-flipkart-1/auto-shortlist')
    expect(res.status).toBe(200)
    expect(res.body.shortlistedCount).toBe(1)

    // Check application status transitioned to Shortlisted
    const appRecord = await prisma.application.findFirst({
      where: { jobId: 'job-flipkart-1' }
    })
    expect(appRecord?.status).toBe('Shortlisted')
  })

  it('PATCH /api/admin/applications/:id/stage updates candidate stage', async () => {
    const student = await prisma.student.findFirst({ include: { resumes: true } })
    const resumeId = student!.resumes[0].id

    const appRes = await request(app)
      .post('/api/applications')
      .send({ jobId: 'job-microsoft-1', resumeId })

    const appId = appRes.body.id

    const patchRes = await request(app)
      .patch(`/api/admin/applications/${appId}/stage`)
      .send({ status: 'Interview', nextStep: 'Final round scheduled with Engineering Manager.' })

    expect(patchRes.status).toBe(200)
    expect(patchRes.body.status).toBe('Interview')
    expect(patchRes.body.nextStep).toContain('Final round scheduled')
  })

  it('GET /api/admin/analytics returns placement statistics', async () => {
    const res = await request(app).get('/api/admin/analytics')
    expect(res.status).toBe(200)
    expect(res.body.totalDrives).toBeGreaterThanOrEqual(10)
    expect(res.body.averageCTC).toBeDefined()
    expect(res.body.branchStats).toBeDefined()
  })
})
