import { Router } from 'express'
import { prisma } from '../prisma'

export const jobsRouter = Router()

export function formatJob(row: any) {
  return {
    id: row.id,
    company: row.company,
    companyLogo: row.companyLogo,
    role: row.role,
    type: row.type,
    ctcLPA: row.ctcLPA,
    deadline: row.deadline instanceof Date ? row.deadline.toISOString() : row.deadline,
    eligibility: {
      minCGPA: row.minCGPA,
      maxBacklogs: row.maxBacklogs,
      branches: typeof row.branches === 'string' ? JSON.parse(row.branches) : row.branches,
      minTenthPercent: row.minTenthPercent,
      minTwelfthPercent: row.minTwelfthPercent,
      requiredSkills:
        typeof row.requiredSkills === 'string'
          ? JSON.parse(row.requiredSkills)
          : row.requiredSkills
    },
    description: row.description,
    rounds: typeof row.rounds === 'string' ? JSON.parse(row.rounds) : row.rounds,
    locations: typeof row.locations === 'string' ? JSON.parse(row.locations) : row.locations,
    isActive: row.isActive
  }
}

// GET /api/jobs - List active placement drives
jobsRouter.get('/', async (_req, res, next) => {
  try {
    const rows = await prisma.job.findMany({
      where: { isActive: true },
      orderBy: { deadline: 'asc' }
    })
    res.json(rows.map(formatJob))
  } catch (err) {
    next(err)
  }
})

// GET /api/jobs/:id - Single drive details
jobsRouter.get('/:id', async (req, res, next) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id }
    })
    if (!job) {
      return res.status(404).json({ error: `Job with ID ${req.params.id} not found` })
    }
    res.json(formatJob(job))
  } catch (err) {
    next(err)
  }
})

