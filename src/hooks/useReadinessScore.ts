import { useStore } from '../store'
import type { PrepProgress, Student } from '../types'

/**
 * Calculates placement readiness score (0-100) based on weighted formula:
 * DSA: 40%
 * Aptitude: 20%
 * Checklist: 25%
 * Profile Completeness: 15%
 */
export function calcReadinessScore(prep: PrepProgress, student: Student): number {
  // 1. DSA Progress (40%)
  const dsaTopics = Object.values(prep.dsa)
  let dsaScore = 0
  if (dsaTopics.length > 0) {
    const totalProblems = dsaTopics.reduce((acc, t) => acc + t.total, 0)
    const solvedProblems = dsaTopics.reduce((acc, t) => acc + t.solved, 0)
    dsaScore = totalProblems > 0 ? (solvedProblems / totalProblems) * 40 : 0
  }

  // 2. Aptitude Progress (20%)
  let aptitudeScore = 0
  if (prep.aptitude.length > 0) {
    const latest = prep.aptitude[0]
    aptitudeScore = (latest.score / 100) * 20
  }

  // 3. Resume Checklist (25%)
  const checklistItems = Object.values(prep.checklist)
  let checklistScore = 0
  if (checklistItems.length > 0) {
    const checked = checklistItems.filter(Boolean).length
    checklistScore = (checked / checklistItems.length) * 25
  }

  // 4. Profile Completeness (15%)
  let profileScore = 0
  if (student.cgpa > 0) profileScore += 3.75
  if (student.skills.length > 0) profileScore += 3.75
  if (student.resumes.length > 0) profileScore += 3.75
  if (student.branch) profileScore += 3.75

  const total = Math.round(dsaScore + aptitudeScore + checklistScore + profileScore)
  return Math.min(Math.max(total, 0), 100)
}

export function useReadinessScore(): number {
  const prep = useStore((state) => state.prep)
  const student = useStore((state) => state.student)
  return calcReadinessScore(prep, student)
}
