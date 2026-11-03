import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'

export const studentRouter = Router()

export function formatStudent(row: any) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    branch: row.branch,
    year: row.year,
    cgpa: row.cgpa,
    tenthPercent: row.tenthPercent,
    twelfthPercent: row.twelfthPercent,
    backlogs: row.backlogs,
    skills: typeof row.skills === 'string' ? JSON.parse(row.skills) : row.skills,
    preferences: {
      roles:
        typeof row.preferredRoles === 'string'
          ? JSON.parse(row.preferredRoles)
          : row.preferredRoles,
      locations:
        typeof row.preferredLocs === 'string'
          ? JSON.parse(row.preferredLocs)
          : row.preferredLocs
    },
    resumes: (row.resumes || []).map((r: any) => ({
      id: r.id,
      filename: r.filename,
      sizeKB: r.sizeKB,
      uploadedAt: r.uploadedAt instanceof Date ? r.uploadedAt.toISOString() : r.uploadedAt,
      isPrimary: r.isPrimary,
      url: r.url
    }))
  }
}

const updateStudentSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  branch: z.enum(['CS', 'IT', 'ECE', 'ME', 'CE', 'EE']).optional(),
  year: z.number().int().min(1).max(5).optional(),
  cgpa: z.number().min(0).max(10).optional(),
  tenthPercent: z.number().min(0).max(100).optional(),
  twelfthPercent: z.number().min(0).max(100).optional(),
  backlogs: z.number().int().min(0).optional(),
  skills: z.array(z.string()).optional()
})

// GET /api/student - Return current student profile
studentRouter.get('/', async (_req, res, next) => {
  try {
    const student = await prisma.student.findFirst({
      include: { resumes: true }
    })
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' })
    }
    res.json(formatStudent(student))
  } catch (err) {
    next(err)
  }
})

// PUT /api/student - Update academic and personal details
studentRouter.put('/', async (req, res, next) => {
  try {
    const parsed = updateStudentSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation Error',
        details: parsed.error.issues
      })
    }

    const current = await prisma.student.findFirst()
    if (!current) {
      return res.status(404).json({ error: 'Student profile not found' })
    }

    const updateData: any = { ...parsed.data }
    if (parsed.data.skills) {
      updateData.skills = JSON.stringify(parsed.data.skills)
    }

    const updated = await prisma.student.update({
      where: { id: current.id },
      data: updateData,
      include: { resumes: true }
    })

    res.json(formatStudent(updated))
  } catch (err) {
    next(err)
  }
})

// POST /api/student/resumes - Add resume
studentRouter.post('/resumes', async (req, res, next) => {
  try {
    const { filename, sizeKB, isPrimary, url } = req.body
    if (!filename || !sizeKB) {
      return res.status(400).json({ error: 'filename and sizeKB are required' })
    }

    const student = await prisma.student.findFirst({ include: { resumes: true } })
    if (!student) return res.status(404).json({ error: 'Student not found' })

    const shouldBePrimary = isPrimary || student.resumes.length === 0
    if (shouldBePrimary) {
      await prisma.resume.updateMany({
        where: { studentId: student.id },
        data: { isPrimary: false }
      })
    }

    const created = await prisma.resume.create({
      data: {
        studentId: student.id,
        filename,
        sizeKB: Number(sizeKB),
        isPrimary: shouldBePrimary,
        url: url || '#'
      }
    })

    res.status(201).json({
      id: created.id,
      filename: created.filename,
      sizeKB: created.sizeKB,
      uploadedAt: created.uploadedAt.toISOString(),
      isPrimary: created.isPrimary,
      url: created.url
    })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/student/resumes/:id - Remove resume
studentRouter.delete('/resumes/:id', async (req, res, next) => {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id: req.params.id }
    })
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    await prisma.resume.delete({ where: { id: req.params.id } })

    // If was primary, elect new primary if resumes remain
    if (resume.isPrimary) {
      const remaining = await prisma.resume.findFirst({
        where: { studentId: resume.studentId }
      })
      if (remaining) {
        await prisma.resume.update({
          where: { id: remaining.id },
          data: { isPrimary: true }
        })
      }
    }

    res.json({ success: true, message: 'Resume deleted successfully' })
  } catch (err) {
    next(err)
  }
})
