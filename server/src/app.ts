import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { jobsRouter } from './routes/jobs'
import { studentRouter } from './routes/student'
import { applicationsRouter } from './routes/applications'
import { prepRouter } from './routes/prep'
import { adminRouter } from './routes/admin'

export const app = express()

app.use(cors())
app.use(express.json())

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'CareerFlow API', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/jobs', jobsRouter)
app.use('/api/student', studentRouter)
app.use('/api/applications', applicationsRouter)
app.use('/api/prep', prepRouter)
app.use('/api/admin', adminRouter)

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[API Error]:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  })
})

export default app
