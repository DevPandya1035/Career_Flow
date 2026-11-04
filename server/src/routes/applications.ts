import { Router } from 'express'
import { prisma } from '../prisma'

export const applicationsRouter = Router()

// GET /api/applications - List student applications
applicationsRouter.get('/', async (_req, res, next) => {
  try {
    const student = await prisma.student.findFirst()
    if (!student) return res.status(404).json({ error: 'Student not found' })

    const apps = await prisma.application.findMany({
      where: { studentId: student.id },
      include: {
        job: true,
        resume: true
      },
      orderBy: { appliedAt: 'desc' }
    })

    res.json(
      apps.map((a) => ({
        id: a.id,
        jobId: a.jobId,
        studentId: a.studentId,
        resumeId: a.resumeId,
        status: a.status,
        appliedAt: a.appliedAt.toISOString(),
        nextStep: a.nextStep,
        feedback: a.feedback
      }))
    )
  } catch (err) {
    next(err)
  }
})

// POST /api/applications - Opt-in / apply to a drive
applicationsRouter.post('/', async (req, res, next) => {
  try {
    const { jobId, resumeId } = req.body
    if (!jobId || !resumeId) {
      return res.status(400).json({ error: 'jobId and resumeId are required' })
    }

    const student = await prisma.student.findFirst()
    if (!student) return res.status(404).json({ error: 'Student not found' })

    const job = await prisma.job.findUnique({ where: { id: jobId } })
    if (!job) return res.status(404).json({ error: 'Placement drive not found' })

    const existing = await prisma.application.findUnique({
      where: {
        studentId_jobId: {
          studentId: student.id,
          jobId
        }
      }
    })

    if (existing) {
      return res.status(409).json({
        error: 'You have already applied to this company placement drive'
      })
    }

    const created = await prisma.application.create({
      data: {
        studentId: student.id,
        jobId,
        resumeId,
        status: 'Applied',
        nextStep: 'Application registered. Awaiting initial screening.'
      }
    })

    res.status(201).json({
      id: created.id,
      jobId: created.jobId,
      studentId: created.studentId,
      resumeId: created.resumeId,
      status: created.status,
      appliedAt: created.appliedAt.toISOString(),
      nextStep: created.nextStep,
      feedback: created.feedback
    })
  } catch (err) {
    next(err)
  }
})

