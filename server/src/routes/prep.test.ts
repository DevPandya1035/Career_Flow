import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../app'

describe('Preparation Hub REST API', () => {
  it('GET /api/prep returns aggregated prep data structure', async () => {
    const res = await request(app).get('/api/prep')
    expect(res.status).toBe(200)
    expect(res.body.dsa).toBeDefined()
    expect(res.body.dsa['Arrays']).toBeDefined()
    expect(res.body.mockInterviews).toBeDefined()
    expect(res.body.checklist).toBeDefined()
  })

  it('POST /api/prep/dsa/:topic/increment increments solved count by 1', async () => {
    const initialRes = await request(app).get('/api/prep')
    const initialSolved = initialRes.body.dsa['Arrays'].solved

    const incRes = await request(app).post('/api/prep/dsa/Arrays/increment')
    expect(incRes.status).toBe(200)
    expect(incRes.body.solved).toBe(initialSolved + 1)
  })

  it('POST /api/prep/mock/:slotId/book and /cancel toggles booking', async () => {
    const bookRes = await request(app).post('/api/prep/mock/mock-1/book')
    expect(bookRes.status).toBe(200)
    expect(bookRes.body.isBooked).toBe(true)

    const cancelRes = await request(app).post('/api/prep/mock/mock-1/cancel')
    expect(cancelRes.status).toBe(200)
    expect(cancelRes.body.isBooked).toBe(false)
  })
})

