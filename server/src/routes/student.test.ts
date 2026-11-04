import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../app'

describe('Student Profile REST API', () => {
  it('GET /api/student returns current student profile with resumes', async () => {
    const res = await request(app).get('/api/student')
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Aarav Mehta')
    expect(res.body.branch).toBe('CS')
    expect(res.body.cgpa).toBe(8.4)
    expect(Array.isArray(res.body.skills)).toBe(true)
    expect(Array.isArray(res.body.resumes)).toBe(true)
  })

  it('PUT /api/student updates academic details with valid inputs', async () => {
    const res = await request(app)
      .put('/api/student')
      .send({ cgpa: 8.7, backlogs: 0 })
    expect(res.status).toBe(200)
    expect(res.body.cgpa).toBe(8.7)

    // Reset back to 8.4
    await request(app).put('/api/student').send({ cgpa: 8.4 })
  })

  it('PUT /api/student rejects invalid CGPA > 10 with 400 Bad Request', async () => {
    const res = await request(app)
      .put('/api/student')
      .send({ cgpa: 12.5 })
    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })

  it('POST and DELETE /api/student/resumes adds and deletes resume', async () => {
    const addRes = await request(app)
      .post('/api/student/resumes')
      .send({ filename: 'Aarav_New_Resume.pdf', sizeKB: 120 })
    expect(addRes.status).toBe(201)
    expect(addRes.body.filename).toBe('Aarav_New_Resume.pdf')

    const resumeId = addRes.body.id
    const delRes = await request(app).delete(`/api/student/resumes/${resumeId}`)
    expect(delRes.status).toBe(200)
  })
})

