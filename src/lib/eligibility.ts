import type { Student, Job, EligibilityResult, CriterionDetail } from '../types'

/**
 * Pure function to check a student's eligibility for a specific job opportunity.
 * Academic criteria (CGPA, Backlogs, Branch, 10th%, 12th%) determine hard registration eligibility.
 * Skills compatibility is evaluated as an informative match & gap metric.
 */
export function checkEligibility(student: Student, job: Job): EligibilityResult {
  const pass: CriterionDetail[] = []
  const fail: CriterionDetail[] = []

  // 1. Minimum CGPA Check (Hard Gate)
  const cgpaPassed = student.cgpa >= job.eligibility.minCGPA
  const cgpaDetail: CriterionDetail = {
    criterion: 'CGPA',
    studentValue: student.cgpa.toFixed(2),
    required: `≥ ${job.eligibility.minCGPA.toFixed(2)}`,
    passed: cgpaPassed
  }
  if (cgpaPassed) pass.push(cgpaDetail)
  else fail.push(cgpaDetail)

  // 2. Maximum Active Backlogs Check (Hard Gate)
  const backlogsPassed = student.backlogs <= job.eligibility.maxBacklogs
  const backlogsDetail: CriterionDetail = {
    criterion: 'Active Backlogs',
    studentValue: `${student.backlogs}`,
    required: `≤ ${job.eligibility.maxBacklogs} allowed`,
    passed: backlogsPassed
  }
  if (backlogsPassed) pass.push(backlogsDetail)
  else fail.push(backlogsDetail)

  // 3. Eligible Branches Check (Hard Gate)
  const branchPassed = job.eligibility.branches.includes(student.branch)
  const branchDetail: CriterionDetail = {
    criterion: 'Branch',
    studentValue: student.branch,
    required: job.eligibility.branches.join(', '),
    passed: branchPassed
  }
  if (branchPassed) pass.push(branchDetail)
  else fail.push(branchDetail)

  // 4. 10th Percentage Check (Hard Gate)
  const tenthPassed = student.tenthPercent >= job.eligibility.minTenthPercent
  const tenthDetail: CriterionDetail = {
    criterion: '10th Standard',
    studentValue: `${student.tenthPercent}%`,
    required: `≥ ${job.eligibility.minTenthPercent}%`,
    passed: tenthPassed
  }
  if (tenthPassed) pass.push(tenthDetail)
  else fail.push(tenthDetail)

  // 5. 12th Percentage Check (Hard Gate)
  const twelfthPassed = student.twelfthPercent >= job.eligibility.minTwelfthPercent
  const twelfthDetail: CriterionDetail = {
    criterion: '12th Standard',
    studentValue: `${student.twelfthPercent}%`,
    required: `≥ ${job.eligibility.minTwelfthPercent}%`,
    passed: twelfthPassed
  }
  if (twelfthPassed) pass.push(twelfthDetail)
  else fail.push(twelfthDetail)

  // 6. Skills Criteria Match (Informative)
  if (job.eligibility.requiredSkills.length > 0) {
    const studentSkillsLower = student.skills.map((s) => s.trim().toLowerCase())
    const missing = job.eligibility.requiredSkills.filter(
      (skill) => !studentSkillsLower.includes(skill.trim().toLowerCase())
    )
    const skillsPassed = missing.length === 0
    const skillsDetail: CriterionDetail = {
      criterion: 'Core Skills',
      studentValue: `${job.eligibility.requiredSkills.length - missing.length}/${job.eligibility.requiredSkills.length} match`,
      required: job.eligibility.requiredSkills.join(', '),
      passed: skillsPassed
    }
    if (skillsPassed) pass.push(skillsDetail)
    else pass.push(skillsDetail) // Recorded with pass status indicating match count
  }

  // Academic criteria decide hard gate eligibility
  const isEligible = !fail.some((f) =>
    ['CGPA', 'Active Backlogs', 'Branch', '10th Standard', '12th Standard'].includes(f.criterion)
  )

  return {
    isEligible,
    pass,
    fail
  }
}

/**
 * Returns matched and missing skills between a student and a job posting.
 */
export function getSkillsGap(student: Student, job: Job): { matched: string[]; missing: string[] } {
  const studentSkillsLower = student.skills.map((s) => s.trim().toLowerCase())
  const matched: string[] = []
  const missing: string[] = []

  for (const skill of job.eligibility.requiredSkills) {
    if (studentSkillsLower.includes(skill.trim().toLowerCase())) {
      matched.push(skill)
    } else {
      missing.push(skill)
    }
  }

  return { matched, missing }
}
