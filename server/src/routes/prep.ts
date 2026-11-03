import { Router } from 'express'
import { prisma } from '../prisma'

export const prepRouter = Router()

// GET /api/prep - Combined preparation progress
prepRouter.get('/', async (_req, res, next) => {
  try {
    const student = await prisma.student.findFirst()
    if (!student) return res.status(404).json({ error: 'Student not found' })

    const [dsaRows, aptRows, checkRows, mockRows] = await Promise.all([
      prisma.dsaTopic.findMany({ where: { studentId: student.id } }),
      prisma.aptitudeAttempt.findMany({
        where: { studentId: student.id },
        orderBy: { date: 'desc' }
      }),
      prisma.resumeChecklist.findMany({ where: { studentId: student.id } }),
      prisma.mockSlot.findMany({ orderBy: { date: 'asc' } })
    ])

    const dsa: Record<string, { solved: number; total: number }> = {}
    dsaRows.forEach((row) => {
      dsa[row.topicName] = { solved: row.solved, total: row.total }
    })

    const checklist: Record<string, boolean> = {}
    checkRows.forEach((row) => {
      checklist[row.itemKey] = row.isChecked
    })

    const mockInterviews = mockRows.map((m) => ({
      id: m.id,
      interviewer: m.interviewer,
      company: m.company,
      date: m.date,
      time: m.time,
      isBooked: m.isBooked,
      studentId: m.studentId
    }))

    const aptitude = aptRows.map((a) => ({
      id: a.id,
      date: a.date.toISOString(),
      score: a.score,
      totalQuestions: a.totalQuestions,
      topic: a.topic
    }))

    res.json({
      dsa,
      aptitude,
      checklist,
      mockInterviews
    })
  } catch (err) {
    next(err)
  }
})

// POST /api/prep/dsa/:topic/increment - Increment solved count
prepRouter.post('/dsa/:topic/increment', async (req, res, next) => {
  try {
    const topicName = req.params.topic
    const student = await prisma.student.findFirst()
    if (!student) return res.status(404).json({ error: 'Student not found' })

    const existing = await prisma.dsaTopic.findUnique({
      where: {
        studentId_topicName: {
          studentId: student.id,
          topicName
        }
      }
    })

    if (!existing) {
      const created = await prisma.dsaTopic.create({
        data: {
          studentId: student.id,
          topicName,
          solved: 1,
          total: 20
        }
      })
      return res.json(created)
    }

    const updated = await prisma.dsaTopic.update({
      where: { id: existing.id },
      data: { solved: existing.solved + 1 }
    })

    res.json(updated)
  } catch (err) {
    next(err)
  }
})

// POST /api/prep/aptitude - Record aptitude attempt
prepRouter.post('/aptitude', async (req, res, next) => {
  try {
    const { score, totalQuestions, topic } = req.body
    const student = await prisma.student.findFirst()
    if (!student) return res.status(404).json({ error: 'Student not found' })

    const created = await prisma.aptitudeAttempt.create({
      data: {
        studentId: student.id,
        score: Number(score),
        totalQuestions: Number(totalQuestions),
        topic: topic || 'Quantitative & Logical'
      }
    })

    res.status(201).json({
      id: created.id,
      date: created.date.toISOString(),
      score: created.score,
      totalQuestions: created.totalQuestions,
      topic: created.topic
    })
  } catch (err) {
    next(err)
  }
})

// PATCH /api/prep/checklist - Toggle checklist item
prepRouter.patch('/checklist', async (req, res, next) => {
  try {
    const { itemKey, isChecked } = req.body
    const student = await prisma.student.findFirst()
    if (!student) return res.status(404).json({ error: 'Student not found' })

    const item = await prisma.resumeChecklist.upsert({
      where: {
        studentId_itemKey: {
          studentId: student.id,
          itemKey
        }
      },
      update: { isChecked: Boolean(isChecked) },
      create: {
        studentId: student.id,
        itemKey,
        isChecked: Boolean(isChecked)
      }
    })

    res.json({ itemKey: item.itemKey, isChecked: item.isChecked })
  } catch (err) {
    next(err)
  }
})

// POST /api/prep/mock/:slotId/book - Reserve slot
prepRouter.post('/mock/:slotId/book', async (req, res, next) => {
  try {
    const slotId = req.params.slotId
    const student = await prisma.student.findFirst()
    if (!student) return res.status(404).json({ error: 'Student not found' })

    const updated = await prisma.mockSlot.update({
      where: { id: slotId },
      data: {
        isBooked: true,
        studentId: student.id
      }
    })

    res.json(updated)
  } catch (err) {
    next(err)
  }
})

// POST /api/prep/mock/:slotId/cancel - Release slot
prepRouter.post('/mock/:slotId/cancel', async (req, res, next) => {
  try {
    const slotId = req.params.slotId

    const updated = await prisma.mockSlot.update({
      where: { id: slotId },
      data: {
        isBooked: false,
        studentId: null
      }
    })

    res.json(updated)
  } catch (err) {
    next(err)
  }
})
