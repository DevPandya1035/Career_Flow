# CareerFlow — Data Schema

> **Version:** 2.0.0 · **Last updated:** 2026-11-03  
> **Scope:** Relational Prisma Schema, PostgreSQL DDL, TypeScript definitions, seed data specifications, validation rules, and algorithmic formulas defining the data contract for CareerFlow.

---

## 1. Overview

CareerFlow operates a **unified data layer** shared between the React frontend and the Express backend compute layer:

1. **Relational Database Schema (`prisma/schema.prisma`):** The authoritative SQL contract defining tables, relations, cascade deletes, and constraints. Operates on **SQLite** for zero-config local development and **PostgreSQL (Amazon RDS)** in production.
2. **TypeScript Interfaces (`src/types/index.ts` & `server/src/types/`):** Full-stack type safety ensuring that API payloads, store slices, and UI props adhere to the same domain contracts.
3. **Database Seed Data (`prisma/seed.ts`):** Pre-populates the database with 10 verified placement companies, Aarav Mehta's student profile, and default prep topics.
4. **Zustand Store Layer:** Frontend state cache synchronized with the backend REST API via typed client calls (`src/lib/api.ts`).

---

## 2. Prisma Database Schema (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "sqlite" // SQLite for local run; PostgreSQL in production via env
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Student {
  id               String            @id @default(cuid())
  name             String
  email            String            @unique
  branch           String            // CS, IT, ECE, ME, CE, EE
  year             Int               @default(4)
  cgpa             Float
  tenthPercent     Float
  twelfthPercent   Float
  backlogs         Int               @default(0)
  skills           String            // Stored as JSON string array
  preferredRoles   String            // JSON string array
  preferredLocs    String            // JSON string array
  resumes          Resume[]
  applications     Application[]
  dsaTopics        DSATopic[]
  aptitudeAttempts AptitudeAttempt[]
  checklistItems   ResumeChecklist[]
  mockSlots        MockSlot[]
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
}

model Resume {
  id           String        @id @default(cuid())
  studentId    String
  student      Student       @relation(fields: [studentId], references: [id], onDelete: Cascade)
  filename     String
  sizeKB       Int
  uploadedAt   DateTime      @default(now())
  isPrimary    Boolean       @default(false)
  url          String?
  applications Application[]
}

model Job {
  id                 String        @id @default(cuid())
  company            String
  companyLogo        String        @default("CF")
  role               String
  type               String        // SWE, Analyst, Core, Finance, Consulting
  ctcLPA             Float
  deadline           DateTime
  minCGPA            Float
  maxBacklogs        Int           @default(0)
  branches           String        // JSON array: ["CS","IT"]
  minTenthPercent    Float         @default(60.0)
  minTwelfthPercent  Float         @default(60.0)
  requiredSkills     String        // JSON array: ["React","DSA"]
  description        String
  rounds             String        // JSON array: ["OA","Tech","HR"]
  locations          String        // JSON array: ["Bengaluru","Remote"]
  isActive           Boolean       @default(true)
  applications       Application[]
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt
}

model Application {
  id        String   @id @default(cuid())
  studentId String
  student   Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  jobId     String
  job       Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  resumeId  String
  resume    Resume   @relation(fields: [resumeId], references: [id])
  status    String   @default("Applied") // Applied, Shortlisted, Assessment, Interview, Selected, Rejected
  appliedAt DateTime @default(now())
  nextStep  String   @default("Application received and pending initial review.")
  feedback  String?

  @@unique([studentId, jobId])
}

model DSATopic {
  id        String  @id @default(cuid())
  studentId String
  student   Student @relation(fields: [studentId], references: [id], onDelete: Cascade)
  topicName String
  solved    Int     @default(0)
  total     Int     @default(20)

  @@unique([studentId, topicName])
}

model AptitudeAttempt {
  id             String   @id @default(cuid())
  studentId      String
  student        Student  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  date           DateTime @default(now())
  score          Int
  totalQuestions Int
  topic          String
}

model ResumeChecklist {
  id        String  @id @default(cuid())
  studentId String
  student   Student @relation(fields: [studentId], references: [id], onDelete: Cascade)
  itemKey   String
  isChecked Boolean @default(false)

  @@unique([studentId, itemKey])
}

model MockSlot {
  id          String   @id @default(cuid())
  interviewer String
  company     String
  date        String
  time        String
  isBooked    Boolean  @default(false)
  studentId   String?
  student     Student? @relation(fields: [studentId], references: [id])
}
```

---

## 3. Full TypeScript Type Definitions

All types live in `src/types/index.ts`.

```ts
// ─── Enumerations ────────────────────────────────────────────────────────────

/** Academic branch / department of the student. */
export type Branch = 'CS' | 'IT' | 'ECE' | 'ME' | 'CE' | 'EE'

/** Category of job / recruitment drive. */
export type JobType = 'SWE' | 'Analyst' | 'Core' | 'Finance' | 'Consulting'

/** Lifecycle stages of a placement application (ordered). */
export type ApplicationStatus =
  | 'Applied'
  | 'Shortlisted'
  | 'Assessment'
  | 'Interview'
  | 'Selected'
  | 'Rejected'

/** Status of a mock interview booking. */
export type MockInterviewStatus = 'booked' | 'completed'

// ─── Resume ──────────────────────────────────────────────────────────────────

/**
 * A single resume file uploaded by the student.
 * Files are not stored as blobs — only metadata is persisted.
 * In production, a URL would reference cloud storage.
 */
export interface Resume {
  /** UUID v4 */
  id: string
  /** Original filename, e.g. "Aarav_Mehta_Resume_v2.pdf" */
  filename: string
  /** File size in kilobytes (max 2048 KB = 2 MB) */
  sizeKB: number
  /** ISO 8601 datetime string, e.g. "2026-09-15T10:30:00Z" */
  uploadedAt: string
  /** Whether this is the default resume used when applying */
  isPrimary: boolean
}

// ─── Student ─────────────────────────────────────────────────────────────────

/**
 * The core student profile. This is the single-user identity of the app.
 * All eligibility checks are performed against this profile.
 */
export interface Student {
  /** UUID v4 */
  id: string
  /** Full legal name */
  name: string
  /** College email address */
  email: string
  /** Academic department */
  branch: Branch
  /** Current academic year (2 = 2nd year, 3 = 3rd year, 4 = final year) */
  year: 2 | 3 | 4
  /**
   * Cumulative Grade Point Average on a 10-point scale.
   * Constraints: 0.0 ≤ cgpa ≤ 10.0 (one decimal place)
   */
  cgpa: number
  /**
   * Class 10 (SSC / CBSE / ICSE) percentage.
   * Constraints: 0 ≤ tenthPercent ≤ 100
   */
  tenthPercent: number
  /**
   * Class 12 (HSC / CBSE / ICSE) percentage.
   * Constraints: 0 ≤ twelfthPercent ≤ 100
   */
  twelfthPercent: number
  /**
   * Number of active (uncleared) backlogs.
   * Constraints: backlogs ≥ 0
   */
  backlogs: number
  /**
   * Technical and soft skills listed by the student.
   * Values are normalised to Title Case for display, lowercase for matching.
   * Examples: ['React', 'Python', 'SQL', 'Machine Learning']
   */
  skills: string[]
  /** All uploaded resume files; at most one may have isPrimary = true */
  resumes: Resume[]
  /** Job role and location preferences for filtering */
  preferences: {
    roles: string[]
    locations: string[]
  }
}

// ─── Job & Eligibility ───────────────────────────────────────────────────────

/**
 * Criteria a student must meet to apply for a job.
 * All numeric minimums are inclusive (≥).
 */
export interface EligibilityCriteria {
  /** Minimum CGPA on 10-point scale (inclusive) */
  minCGPA: number
  /** Maximum allowed active backlogs (inclusive) */
  maxBacklogs: number
  /**
   * Allowed branches. Empty array = all branches allowed.
   * Values must match the Branch union.
   */
  branches: Branch[]
  /** Minimum Class 10 percentage (0 means no requirement) */
  minTenthPercent: number
  /** Minimum Class 12 percentage (0 means no requirement) */
  minTwelfthPercent: number
  /**
   * Skills the student must have (case-insensitive match against Student.skills).
   * Empty array = no skill requirement.
   */
  requiredSkills: string[]
}

/**
 * A single criterion result within an EligibilityResult.
 * Emitted for each criterion that was actually evaluated.
 */
export interface CriterionDetail {
  /** Human-readable criterion name, e.g. "CGPA", "Branch", "Active Backlogs" */
  criterion: string
  /** The student's current value as a display string, e.g. "8.4", "CS", "0" */
  studentValue: string
  /** The requirement as a display string, e.g. "≥ 8.5", "CS / IT", "≤ 0" */
  required: string
}

/**
 * The result of running checkEligibility(student, job).
 * Contains all evaluated criteria split into passing and failing groups.
 */
export interface EligibilityResult {
  /** True only if ALL criteria pass */
  isEligible: boolean
  /** Criteria the student satisfies */
  pass: CriterionDetail[]
  /** Criteria the student does not satisfy */
  fail: CriterionDetail[]
}

/**
 * A job listing posted by a company for campus recruitment.
 */
export interface Job {
  /** UUID v4 */
  id: string
  /** Company name, e.g. "Google" */
  company: string
  /**
   * Company logo — a URL (in production) or an emoji placeholder
   * for mock data, e.g. "🟦" or "/logos/google.svg"
   */
  companyLogo: string
  /** Job role title, e.g. "Software Engineer", "Business Analyst" */
  role: string
  /** Category of the job */
  type: JobType
  /** Cost-to-Company in Lakhs Per Annum */
  ctcLPA: number
  /** Application deadline as ISO 8601 datetime string */
  deadline: string
  /** Eligibility requirements for this job */
  eligibility: EligibilityCriteria
  /** Full job description (supports markdown) */
  description: string
  /** Ordered list of interview/selection rounds, e.g. ['Online Test', 'Technical', 'HR'] */
  rounds: string[]
  /** Office locations for this role, e.g. ['Bengaluru', 'Hyderabad'] */
  locations: string[]
  /** Whether the student has bookmarked/saved this job */
  isSaved: boolean
}

// ─── Application ─────────────────────────────────────────────────────────────

/**
 * A placement application submitted by the student for a specific job.
 */
export interface Application {
  /** UUID v4 */
  id: string
  /** References Job.id */
  jobId: string
  /** References Resume.id — the resume used to apply */
  resumeId: string
  /** ISO 8601 datetime string of when the student applied */
  appliedAt: string
  /** Current stage in the selection pipeline */
  status: ApplicationStatus
  /**
   * A nudge/hint to the student about the next action they should take.
   * Example: "Prepare for Online Assessment on Nov 10"
   */
  nextStep: string
  /**
   * Optional deadline alert text shown prominently if the next deadline is near.
   * Example: "Assessment due in 2 days"
   */
  deadlineAlert?: string
}

// ─── Preparation Progress ────────────────────────────────────────────────────

/**
 * Progress record for a single DSA topic.
 */
export interface DSATopic {
  /** Topic name, e.g. "Arrays", "Dynamic Programming" */
  topic: string
  /** Total problems in this topic */
  total: number
  /** Number of problems solved so far */
  solved: number
}

/**
 * A single aptitude test attempt.
 */
export interface AptitudeAttempt {
  /** Score as a percentage (0–100) */
  score: number
  /** ISO 8601 date string of when the attempt was made */
  date: string
}

/**
 * A single mock interview slot.
 */
export interface MockInterviewSlot {
  /**
   * Slot identifier — typically an ISO 8601 datetime string of the scheduled time.
   * Example: "2026-11-10T14:00:00Z"
   */
  slot: string
  status: MockInterviewStatus
}

/**
 * Complete preparation progress state for the student.
 * Persisted in careerflow-prep localStorage key.
 */
export interface PrepProgress {
  /**
   * DSA topic progress map.
   * Key = topic name (e.g. "Arrays"), value = { total, solved }
   */
  dsa: {
    [topic: string]: {
      total: number
      solved: number
    }
  }
  /** List of aptitude test attempts in chronological order */
  aptitude: AptitudeAttempt[]
  /**
   * Resume/placement checklist completion map.
   * Key = checklist item label, value = whether it's checked
   * Example: { "LinkedIn profile updated": true, "GitHub pinned projects": false }
   */
  checklist: {
    [item: string]: boolean
  }
  /** Booked and completed mock interview slots */
  mockInterviews: MockInterviewSlot[]
}
```

---

## 3. Mock Jobs Data Spec

All 10 mock jobs are defined in `src/data/jobs.ts`. Each conforms to the `Job` interface.

| # | Company | Role | Type | CTC (LPA) | Min CGPA | Branches | Deadline | Required Skills |
|---|---|---|---|---|---|---|---|---|
| 1 | Google | Software Engineer | SWE | 45 | 8.5 | CS, IT | 2026-12-01 | DSA, System Design |
| 2 | Microsoft | Software Engineer | SWE | 38 | 7.5 | CS, IT, ECE | 2026-12-05 | DSA, OOP |
| 3 | Flipkart | Software Engineer | SWE | 28 | 6.5 | All | 2026-12-10 | DSA |
| 4 | Goldman Sachs | Technology Analyst | Finance | 32 | 8.5 | All | 2026-11-25 | Python, SQL |
| 5 | JP Morgan | Technology Analyst | Analyst | 25 | 7.0 | All | 2026-11-30 | Python, SQL |
| 6 | Deloitte | Business Technology Analyst | Consulting | 12 | 6.0 | All | 2026-12-15 | _(none)_ |
| 7 | Mahindra | Graduate Engineer Trainee | Core | 8 | 6.0 | ME, CE, EE | 2026-12-20 | _(none)_ |
| 8 | Infosys | Systems Engineer | SWE | 6.5 | 6.0 | All | 2026-12-31 | _(none)_ |
| 9 | Amazon | Software Development Engineer | SWE | 32 | 7.0 | CS, IT, ECE | 2026-12-08 | DSA, OOP |
| 10 | Adobe | Member of Technical Staff | SWE | 35 | 8.0 | CS, IT | 2026-11-28 | DSA, React |

**Notes:**
- "All" branches means `branches: []` in the type (empty = unrestricted).
- `isSaved` defaults to `false` for all jobs.
- `companyLogo` uses an emoji placeholder in mock data (e.g. `"🔵"` for Google).
- Each job has 3–4 selection rounds; see `src/data/jobs.ts` for full round arrays and descriptions.

---

## 4. Default Student Profile

The default profile pre-loaded into the store for a new session. Defined in `src/data/student.ts`.

```ts
const defaultStudent: Student = {
  id: 'student-001',
  name: 'Aarav Mehta',
  email: 'aarav.mehta@college.edu',
  branch: 'CS',
  year: 4,
  cgpa: 8.4,
  tenthPercent: 91.0,
  twelfthPercent: 87.5,
  backlogs: 0,
  skills: ['React', 'Python', 'DSA', 'SQL'],
  resumes: [
    {
      id: 'resume-001',
      filename: 'Aarav_Mehta_Resume.pdf',
      sizeKB: 245,
      uploadedAt: '2026-09-01T09:00:00Z',
      isPrimary: true,
    }
  ],
  preferences: {
    roles: ['Software Engineer', 'Full Stack Developer'],
    locations: ['Bengaluru', 'Mumbai', 'Remote'],
  },
}
```

With this profile, Aarav is **eligible** for: Flipkart, Deloitte, Infosys, Amazon, JP Morgan, Microsoft, Adobe. He is **ineligible** for: Google (CGPA 8.4 < 8.5), Goldman Sachs (CGPA 8.4 < 8.5), Mahindra (wrong branch).

---

## 5. localStorage Keys Table

| Key | Stored Type | Description | Default Value |
|---|---|---|---|
| `careerflow-student` | `{ state: { student: Student }, version: 1 }` | Student profile, resumes, preferences | Aarav Mehta defaults from `src/data/student.ts` |
| `careerflow-jobs` | `{ state: { jobs: Job[], filters: JobFilters, searchQuery: string }, version: 1 }` | All job listings with saved flags and active UI filters | 10 mock jobs; all `isSaved: false`; no filters |
| `careerflow-applications` | `{ state: { applications: Application[] }, version: 1 }` | All submitted applications | `[]` |
| `careerflow-prep` | `{ state: { progress: PrepProgress }, version: 1 }` | DSA topic progress, aptitude scores, checklist, mock interviews | All zeroed / empty |

Each value is wrapped by Zustand's persist middleware in a `{ state, version }` envelope. The `version` field is used for schema migrations (see §10).

---

## 6. Zustand Store Slices Schema

### 6.1 Student Slice

```ts
// State interface
interface StudentState {
  student: Student
}

// Initial state
const initialStudentState: StudentState = {
  student: defaultStudent,  // from src/data/student.ts
}

// Action signatures (all mutate state via Immer)
interface StudentActions {
  updateProfile: (patch: Partial<Omit<Student, 'id' | 'resumes'>>) => void
  addSkill: (skill: string) => void
  removeSkill: (skill: string) => void
  addResume: (resume: Resume) => void
  removeResume: (id: string) => void
  setPrimaryResume: (id: string) => void
  updatePreferences: (prefs: Partial<Student['preferences']>) => void
}
```

### 6.2 Jobs Slice

```ts
// Filter shape
interface JobFilters {
  type: JobType[]            // empty = show all types
  minCTC: number             // 0 = no minimum
  maxCTC: number             // Infinity = no maximum
  branches: Branch[]         // empty = show all branches
  minCGPA: number            // 0 = no minimum
  showEligibleOnly: boolean  // filter to only jobs student qualifies for
  showSavedOnly: boolean     // filter to only saved jobs
}

// State interface
interface JobsState {
  jobs: Job[]
  filters: JobFilters
  searchQuery: string
}

// Initial state
const initialJobsState: JobsState = {
  jobs: mockJobs,             // from src/data/jobs.ts
  filters: {
    type: [],
    minCTC: 0,
    maxCTC: Infinity,
    branches: [],
    minCGPA: 0,
    showEligibleOnly: false,
    showSavedOnly: false,
  },
  searchQuery: '',
}

// Action signatures
interface JobsActions {
  toggleSaveJob: (jobId: string) => void
  setFilters: (filters: Partial<JobFilters>) => void
  setSearchQuery: (query: string) => void
  resetFilters: () => void
}
```

### 6.3 Applications Slice

```ts
// State interface
interface ApplicationsState {
  applications: Application[]
}

// Initial state
const initialApplicationsState: ApplicationsState = {
  applications: [],
}

// Action signatures
interface ApplicationsActions {
  addApplication: (
    payload: Omit<Application, 'id' | 'appliedAt'>
  ) => void  // id generated as UUID, appliedAt = new Date().toISOString()
  updateStatus: (id: string, status: ApplicationStatus) => void
  updateNextStep: (id: string, nextStep: string) => void
  setDeadlineAlert: (id: string, alert: string | undefined) => void
  withdrawApplication: (id: string) => void  // removes from array
}
```

### 6.4 Prep Slice

```ts
// State interface
interface PrepState {
  progress: PrepProgress
}

// Initial state
const initialPrepState: PrepState = {
  progress: {
    dsa: {},
    aptitude: [],
    checklist: {
      'Resume updated and proofread': false,
      'LinkedIn profile complete': false,
      'GitHub pinned projects': false,
      'Portfolio website live': false,
      'Mock interview completed': false,
      'Placement form submitted': false,
      'NOC from department obtained': false,
    },
    mockInterviews: [],
  },
}

// Action signatures
interface PrepActions {
  updateDSATopic: (topic: string, solved: number, total: number) => void
  logAptitudeScore: (score: number) => void  // date = new Date().toISOString()
  toggleChecklistItem: (item: string) => void
  bookMockInterview: (slot: string) => void
  completeMockInterview: (slot: string) => void
}
```

---

## 7. Validation Rules

### Student Profile

| Field | Rule | Error message |
|---|---|---|
| `name` | Required; 2–100 chars | "Name must be 2–100 characters" |
| `email` | Required; valid email format | "Enter a valid college email address" |
| `branch` | Required; must be one of the Branch union values | "Select a valid branch" |
| `year` | Required; must be 2, 3, or 4 | "Year must be 2, 3, or 4" |
| `cgpa` | Required; 0.0–10.0 (1 decimal place) | "CGPA must be between 0.0 and 10.0" |
| `tenthPercent` | Required; 0–100 | "10th percentage must be between 0 and 100" |
| `twelfthPercent` | Required; 0–100 | "12th percentage must be between 0 and 100" |
| `backlogs` | Required; integer ≥ 0 | "Backlogs must be 0 or more" |
| `skills` | Optional; each skill 1–50 chars, max 30 skills | "Skill name must be 1–50 characters" |

### Resume Upload

| Rule | Detail |
|---|---|
| File type | PDF only (`.pdf`; MIME `application/pdf`) |
| File size | Maximum 2 MB (2048 KB) |
| Max resumes | Maximum 5 resumes per student |
| Filename | 1–200 characters |

### Application

| Rule | Detail |
|---|---|
| Duplicate prevention | A student may not apply to the same `jobId` twice |
| Resume required | `resumeId` must reference an existing `Resume.id` in `student.resumes` |
| Deadline check | Warn (but do not block) if `job.deadline` has passed |

### Forms — General

- All required fields validated on submit (not on blur unless the field has been touched).
- Errors displayed inline below the field with `aria-describedby` linking error to input.
- No raw exception messages surfaced to the user.

---

## 8. Eligibility Check Algorithm

### Function signature

```ts
// src/lib/eligibility.ts
export function checkEligibility(
  student: Student,
  job: Job
): EligibilityResult
```

### Pseudocode

```
function checkEligibility(student, job):
  pass = []
  fail = []
  criteria = job.eligibility

  // 1. Branch check (skip if criteria.branches is empty)
  if criteria.branches.length > 0:
    if student.branch in criteria.branches:
      pass.append({ criterion: "Branch",
                    studentValue: student.branch,
                    required: criteria.branches.join(" / ") })
    else:
      fail.append({ criterion: "Branch", ... })

  // 2. CGPA check
  if student.cgpa >= criteria.minCGPA:
    pass.append({ criterion: "CGPA",
                  studentValue: student.cgpa.toFixed(1),
                  required: "≥ " + criteria.minCGPA })
  else:
    fail.append(...)

  // 3. Backlogs check
  if student.backlogs <= criteria.maxBacklogs:
    pass.append({ criterion: "Active Backlogs",
                  studentValue: student.backlogs,
                  required: "≤ " + criteria.maxBacklogs })
  else:
    fail.append(...)

  // 4. 10th percent check (skip if minTenthPercent == 0)
  if criteria.minTenthPercent > 0:
    if student.tenthPercent >= criteria.minTenthPercent:
      pass.append(...)
    else:
      fail.append(...)

  // 5. 12th percent check (skip if minTwelfthPercent == 0)
  if criteria.minTwelfthPercent > 0:
    if student.twelfthPercent >= criteria.minTwelfthPercent:
      pass.append(...)
    else:
      fail.append(...)

  // 6. Skills check (skip if requiredSkills is empty)
  if criteria.requiredSkills.length > 0:
    studentSkillsLower = student.skills.map(toLowercase)
    missingSkills = criteria.requiredSkills
                    .filter(s => s.toLowerCase() not in studentSkillsLower)
    if missingSkills.length == 0:
      pass.append({ criterion: "Required Skills",
                    studentValue: "All matched",
                    required: criteria.requiredSkills.join(", ") })
    else:
      fail.append({ criterion: "Required Skills",
                    studentValue: "Missing: " + missingSkills.join(", "),
                    required: criteria.requiredSkills.join(", ") })

  return {
    isEligible: fail.length == 0,
    pass,
    fail
  }
```

---

## 9. Readiness Score Formula

The **Placement Readiness Score** is a composite metric displayed as a ring gauge on the Dashboard. It is computed by the `selectReadinessScore()` selector in `prepSlice` and updates live as the student makes progress.

$$\text{Readiness} = 0.40 \times D + 0.20 \times A + 0.25 \times C + 0.15 \times P$$

Where:

| Variable | Weight | Metric | Calculation |
|---|---|---|---|
| $D$ — DSA Score | 40% | DSA problems solved | $\frac{\sum \text{solved}_i}{\sum \text{total}_i} \times 100$ (0 if no topics added) |
| $A$ — Aptitude Score | 20% | Best aptitude attempt | $\max(\text{aptitude scores})$ or 0 if none |
| $C$ — Checklist Score | 25% | Checklist items checked | $\frac{\text{checked items}}{\text{total items}} \times 100$ |
| $P$ — Profile Completeness | 15% | Profile fields filled | Weighted sum of profile fields (see below) |

### Profile Completeness sub-score

| Field | Sub-weight |
|---|---|
| Name, email, branch, year | 20% (5% each) |
| CGPA set (> 0) | 10% |
| 10th and 12th percent set | 10% (5% each) |
| At least 1 resume uploaded | 20% |
| At least 1 skill added | 20% |
| Preferences (roles + locations) set | 20% |

All component scores are clamped to [0, 100] before applying weights. The final Readiness Score is also clamped to [0, 100] and rounded to the nearest integer.

---

## 10. Data Migration Notes

Zustand's `persist` middleware supports a `migrate` callback and a `version` field. Use these whenever a breaking schema change is introduced.

### Versioning convention

- Every `localStorage` key stores `{ state: <slice state>, version: <number> }`.
- **Start at version 1.** Increment by 1 for every breaking schema change.
- Non-breaking additions (new optional fields with defaults) do **not** require a version bump — Zustand's partial rehydration handles them automatically via `merge`.

### Migration example

```ts
// In the store definition for studentSlice:
persist(
  (set, get) => ({ ...studentSlice }),
  {
    name: 'careerflow-student',
    version: 2,
    migrate: (persistedState: unknown, fromVersion: number) => {
      if (fromVersion === 1) {
        // v1 → v2: Student gained a `preferences` field
        const old = persistedState as { student: Omit<Student, 'preferences'> }
        return {
          student: {
            ...old.student,
            preferences: { roles: [], locations: [] },  // default
          },
        }
      }
      return persistedState
    },
  }
)
```

### Handling stale localStorage

If a user's stored `version` is older than the current schema version:
1. Zustand calls `migrate(storedState, storedVersion)` before rehydration.
2. The `migrate` function must return state conforming to the **current** schema.
3. If migration is not possible (e.g., version is too old or data is corrupted), clear the key and rehydrate from the default initial state.

```ts
// Fallback: wipe and reset
if (fromVersion < MINIMUM_SUPPORTED_VERSION) {
  localStorage.removeItem('careerflow-student')
  return initialStudentState
}
```

### Testing migrations

Every schema version bump must include a Vitest test that:
1. Seeds `localStorage` with a sample stale state at version N.
2. Initialises the store.
3. Asserts the rehydrated state matches the expected schema for version N+1.

---

*End of Data Schema Document*
