import { PrismaClient } from '@prisma/client'
import { MOCK_JOBS } from '../src/data/jobs'
import { DEFAULT_STUDENT } from '../src/data/student'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding CareerFlow database...')

  const existingJobs = await prisma.job.count()
  const force = process.env.FORCE_SEED === 'true' || process.argv.includes('--force')

  if (existingJobs > 0 && !force) {
    console.log(`Database already initialized (${existingJobs} jobs present). Skipping seed.`)
    return
  }

  // Clear existing records when seeding
  await prisma.application.deleteMany()
  await prisma.resume.deleteMany()
  await prisma.dsaTopic.deleteMany()
  await prisma.aptitudeAttempt.deleteMany()
  await prisma.resumeChecklist.deleteMany()
  await prisma.mockSlot.deleteMany()
  await prisma.job.deleteMany()
  await prisma.student.deleteMany()

  // 1. Seed Student (Aarav Mehta)
  const student = await prisma.student.create({
    data: {
      id: 'student-aarav-1',
      name: DEFAULT_STUDENT.name,
      email: DEFAULT_STUDENT.email,
      branch: DEFAULT_STUDENT.branch,
      year: DEFAULT_STUDENT.year,
      cgpa: DEFAULT_STUDENT.cgpa,
      tenthPercent: DEFAULT_STUDENT.tenthPercent,
      twelfthPercent: DEFAULT_STUDENT.twelfthPercent,
      backlogs: DEFAULT_STUDENT.backlogs,
      skills: JSON.stringify(DEFAULT_STUDENT.skills),
      preferredRoles: JSON.stringify(DEFAULT_STUDENT.preferences.roles),
      preferredLocs: JSON.stringify(DEFAULT_STUDENT.preferences.locations),
      resumes: {
        create: DEFAULT_STUDENT.resumes.map((r) => ({
          filename: r.filename,
          sizeKB: r.sizeKB,
          isPrimary: r.isPrimary,
          url: r.url ?? '#'
        }))
      }
    }
  })

  // 2. Seed Jobs (10 Mock Companies)
  for (const job of MOCK_JOBS) {
    await prisma.job.create({
      data: {
        id: job.id,
        company: job.company,
        companyLogo: job.companyLogo || job.company.substring(0, 2),
        role: job.role,
        type: job.type,
        ctcLPA: job.ctcLPA,
        deadline: new Date(job.deadline),
        minCGPA: job.eligibility.minCGPA,
        maxBacklogs: job.eligibility.maxBacklogs,
        branches: JSON.stringify(job.eligibility.branches),
        minTenthPercent: job.eligibility.minTenthPercent ?? 60.0,
        minTwelfthPercent: job.eligibility.minTwelfthPercent ?? 60.0,
        requiredSkills: JSON.stringify(job.eligibility.requiredSkills),
        description: job.description,
        rounds: JSON.stringify(job.rounds),
        locations: JSON.stringify(job.locations),
        isActive: true
      }
    })
  }

  // 3. Seed Prep: DSA Topics
  const dsaTopics = [
    { name: 'Arrays', solved: 14, total: 20 },
    { name: 'Strings', solved: 10, total: 20 },
    { name: 'Linked Lists', solved: 8, total: 15 },
    { name: 'Trees & BST', solved: 5, total: 20 },
    { name: 'Dynamic Programming', solved: 4, total: 25 },
    { name: 'Graphs', solved: 3, total: 20 }
  ]

  for (const t of dsaTopics) {
    await prisma.dsaTopic.create({
      data: {
        studentId: student.id,
        topicName: t.name,
        solved: t.solved,
        total: t.total
      }
    })
  }

  // 4. Seed Prep: Mock Slots
  const mockSlots = [
    {
      id: 'mock-1',
      interviewer: 'Ananya Sharma',
      company: 'Amazon',
      date: '2026-11-15',
      time: '18:00 - 19:00 IST',
      isBooked: false
    },
    {
      id: 'mock-2',
      interviewer: 'Vikram Joshi',
      company: 'Microsoft',
      date: '2026-11-18',
      time: '19:30 - 20:30 IST',
      isBooked: false
    },
    {
      id: 'mock-3',
      interviewer: 'Neha Agarwal',
      company: 'Google',
      date: '2026-11-20',
      time: '17:00 - 18:00 IST',
      isBooked: false
    }
  ]

  for (const s of mockSlots) {
    await prisma.mockSlot.create({
      data: s
    })
  }

  // 5. Seed Initial Checklist
  const checklistItems = [
    { itemKey: 'Contact info matches institutional email', isChecked: true },
    { itemKey: 'Single-page standard format (≤ 1 page for undergrads)', isChecked: true },
    { itemKey: 'Quantified impact metrics in project bullet points (XYZ format)', isChecked: true },
    { itemKey: 'Standard fonts (Arial, Calibri, Helvetica) for ATS readability', isChecked: true },
    { itemKey: 'No tables or multi-column layouts that break parsing', isChecked: false },
    { itemKey: 'Skills section includes keywords matching target roles', isChecked: true },
    { itemKey: 'GitHub repository links functioning and public', isChecked: false },
    { itemKey: 'PDF file size strictly ≤ 2MB', isChecked: true }
  ]

  for (const item of checklistItems) {
    await prisma.resumeChecklist.create({
      data: {
        studentId: student.id,
        itemKey: item.itemKey,
        isChecked: item.isChecked
      }
    })
  }

  console.log('Seeding complete! 10 jobs, 1 student, and prep assets created.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

