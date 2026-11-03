import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../app'
import { prisma } from '../prisma'

describe('Applications REST API', () => {
  beforeEach(async () => {
    // Clean up applications for test isolation
    await prisma.application.deleteMany()
  })

  it('GET /api/applications returns empty array initially', async () => {
    const res = await request(app).get('/api/applications')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(0)
  })

  it('POST /api/applications allows student to opt into a drive', async () => {
    const student = await prisma.student.findFirst({ include: { resumes: true } })
    const resumeId = student!.resumes[0].id

    const res = await request(app)
      .post('/api/applications')
      .send({ jobId: 'job-flipkart-1', resumeId })

    expect(res.status).toBe(201)
    expect(res.body.jobId).toBe('job-flipkart-1')
    expect(res.body.status).toBe('Applied')
  })

  it('POST /api/applications rejects duplicate application with 409 Conflict', async () => {
    const student = await prisma.student.findFirst({ include: { resumes: true } })
    const resumeId = student!.resumes[0].id

    // First application
    await request(app)
      .post('/api/applications')
      .send({ jobId: 'job-amazon-1', resumeId })

    // Duplicate submission
    const dupRes = await request(app)
      .post('/api/applications')
      .send({ jobId: 'job-amazon-1', resumeId })

    expect(dupRes.status).toBe(409)
    expect(dupRes.body.error).toMatch(/already applied/i)
  })
})
