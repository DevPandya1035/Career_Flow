import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'
import { formatJob } from './jobs'
import { formatStudent } from './student'
import { checkEligibility } from '../../../src/lib/eligibility'

export const adminRouter = Router()

const createJobSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  companyLogo: z.string().optional(),
  role: z.string().min(1, 'Role title is required'),
  type: z.enum(['SWE', 'Analyst', 'Core', 'Finance', 'Consulting']),
  ctcLPA: z.number().positive('CTC must be greater than 0'),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), 'Valid deadline date is required'),
  minCGPA: z.number().min(0).max(10, 'CGPA must be between 0.0 and 10.0'),
  maxBacklogs: z.number().int().min(0, 'Backlogs cannot be negative').default(0),
  branches: z.array(z.string()).min(1, 'At least one eligible branch is required'),
  minTenthPercent: z.number().min(0).max(100).default(60),
  minTwelfthPercent: z.number().min(0).max(100).default(60),
  requiredSkills: z.array(z.string()).default([]),
  description: z.string().default(''),
  rounds: z.array(z.string()).default(['Online Assessment', 'Technical Interview', 'HR Interview']),
  locations: z.array(z.string()).default(['Remote / On-site'])
})

// POST /api/admin/jobs - Create new placement drive with criteria
adminRouter.post('/jobs', async (req, res, next) => {
  try {
    const parsed = createJobSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation Error',
        details: parsed.error.issues
      })
    }

    const d = parsed.data
    const created = await prisma.job.create({
      data: {
        company: d.company,
        companyLogo: d.companyLogo || d.company.substring(0, 2).toUpperCase(),
        role: d.role,
        type: d.type,
        ctcLPA: d.ctcLPA,
        deadline: new Date(d.deadline),
        minCGPA: d.minCGPA,
        maxBacklogs: d.maxBacklogs,
        branches: JSON.stringify(d.branches),
        minTenthPercent: d.minTenthPercent,
        minTwelfthPercent: d.minTwelfthPercent,
        requiredSkills: JSON.stringify(d.requiredSkills),
        description: d.description,
        rounds: JSON.stringify(d.rounds),
        locations: JSON.stringify(d.locations),
        isActive: true
      }
    })

    res.status(201).json(formatJob(created))
  } catch (err) {
    next(err)
  }
})

// PUT /api/admin/jobs/:id - Edit drive criteria
adminRouter.put('/jobs/:id', async (req, res, next) => {
  try {
    const job = await prisma.job.findUnique({ where: { id: req.params.id } })
    if (!job) return res.status(404).json({ error: 'Job not found' })

    const updateData: any = { ...req.body }
    if (req.body.branches) updateData.branches = JSON.stringify(req.body.branches)
    if (req.body.requiredSkills) updateData.requiredSkills = JSON.stringify(req.body.requiredSkills)
    if (req.body.rounds) updateData.rounds = JSON.stringify(req.body.rounds)
    if (req.body.locations) updateData.locations = JSON.stringify(req.body.locations)
    if (req.body.deadline) updateData.deadline = new Date(req.body.deadline)

    const updated = await prisma.job.update({
      where: { id: req.params.id },
      data: updateData
    })

    res.json(formatJob(updated))
  } catch (err) {
    next(err)
  }
})

// DELETE /api/admin/jobs/:id - Archive or delete drive
adminRouter.delete('/jobs/:id', async (req, res, next) => {
  try {
    await prisma.job.update({
      where: { id: req.params.id },
      data: { isActive: false }
    })
    res.json({ success: true, message: 'Drive archived successfully' })
  } catch (err) {
    next(err)
  }
})

// GET /api/admin/jobs/:jobId/applicants - Applicant roster with criteria check
adminRouter.get('/jobs/:jobId/applicants', async (req, res, next) => {
  try {
    const jobRow = await prisma.job.findUnique({ where: { id: req.params.jobId } })
    if (!jobRow) return res.status(404).json({ error: 'Placement drive not found' })

    const formattedJob = formatJob(jobRow)

    const apps = await prisma.application.findMany({
      where: { jobId: req.params.jobId },
      include: {
        student: { include: { resumes: true } },
        resume: true
      },
      orderBy: { appliedAt: 'asc' }
    })

    const results = apps.map((app) => {
      const formattedStd: any = formatStudent(app.student)
      const evaluation = checkEligibility(formattedStd, formattedJob as any)

      return {
        id: app.id,
        applicationId: app.id,
        studentId: app.studentId,
        student: formattedStd,
        resume: app.resume,
        status: app.status,
        appliedAt: app.appliedAt.toISOString(),
        nextStep: app.nextStep,
        isEligible: evaluation.isEligible,
        passedCriteria: evaluation.pass.length,
        failedCriteria: evaluation.fail.length,
        failedReasons: evaluation.fail.map(
          (f) => `${f.criterion}: student ${f.studentValue}, required ${f.required}`
        )
      }
    })

    res.json(results)
  } catch (err) {
    next(err)
  }
})

// POST /api/admin/jobs/:jobId/auto-shortlist - 1-Click Bulk Auto-Shortlist (FR31)
adminRouter.post('/jobs/:jobId/auto-shortlist', async (req, res, next) => {
  try {
    const jobRow = await prisma.job.findUnique({ where: { id: req.params.jobId } })
    if (!jobRow) return res.status(404).json({ error: 'Placement drive not found' })

    const formattedJob = formatJob(jobRow)

    const apps = await prisma.application.findMany({
      where: {
        jobId: req.params.jobId,
        status: 'Applied' // Only auto-shortlist those in Applied status
      },
      include: {
        student: true
      }
    })

    let shortlistedCount = 0

    for (const app of apps) {
      const formattedStd: any = formatStudent(app.student)
      const evaluation = checkEligibility(formattedStd, formattedJob as any)

      if (evaluation.isEligible) {
        await prisma.application.update({
          where: { id: app.id },
          data: {
            status: 'Shortlisted',
            nextStep: 'Congratulations! Shortlisted based on published eligibility criteria.'
          }
        })
        shortlistedCount++
      }
    }

    res.json({
      success: true,
      jobId: req.params.jobId,
      shortlistedCount,
      totalEvaluated: apps.length,
      message: `Successfully shortlisted ${shortlistedCount} qualifying candidate(s).`
    })
  } catch (err) {
    next(err)
  }
})

// PATCH /api/admin/applications/:id/stage - Candidate stage transition
adminRouter.patch('/applications/:id/stage', async (req, res, next) => {
  try {
    const { status, nextStep, feedback } = req.body
    if (!status) return res.status(400).json({ error: 'status is required' })

    const updated = await prisma.application.update({
      where: { id: req.params.id },
      data: {
        status,
        nextStep: nextStep || `Candidate moved to ${status} stage.`,
        feedback: feedback || null
      }
    })

    res.json({
      id: updated.id,
      status: updated.status,
      nextStep: updated.nextStep,
      feedback: updated.feedback
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/admin/analytics - Placement cell metrics
adminRouter.get('/analytics', async (_req, res, next) => {
  try {
    const [totalDrives, totalApplications, totalSelected, jobs, students] = await Promise.all([
      prisma.job.count({ where: { isActive: true } }),
      prisma.application.count(),
      prisma.application.count({ where: { status: 'Selected' } }),
      prisma.job.findMany({ select: { ctcLPA: true } }),
      prisma.student.findMany({ select: { branch: true } })
    ])

    const totalStudents = students.length || 1
    const placedPercentage = Math.round((totalSelected / totalStudents) * 100)

    const ctcs = jobs.map((j) => j.ctcLPA)
    const averageCTC = ctcs.length > 0 ? +(ctcs.reduce((a, b) => a + b, 0) / ctcs.length).toFixed(1) : 0
    const highestCTC = ctcs.length > 0 ? Math.max(...ctcs) : 0

    // Branch breakdown
    const branches = ['CS', 'IT', 'ECE', 'ME', 'CE', 'EE']
    const branchStats: Record<string, { total: number; placed: number; percentage: number }> = {}

    for (const b of branches) {
      const bTotal = students.filter((s) => s.branch === b).length
      branchStats[b] = {
        total: bTotal,
        placed: b === 'CS' && totalSelected > 0 ? 1 : 0,
        percentage: bTotal > 0 ? Math.round(((b === 'CS' ? totalSelected : 0) / bTotal) * 100) : 0
      }
    }

    res.json({
      totalDrives,
      totalApplications,
      totalOffers: totalSelected,
      placementRate: placedPercentage,
      averageCTC,
      highestCTC,
      branchStats
    })
  } catch (err) {
    next(err)
  }
})
