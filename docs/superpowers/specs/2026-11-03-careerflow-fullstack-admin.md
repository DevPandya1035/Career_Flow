# CareerFlow Full-Stack & TPO Admin Design Specification

> **Status:** Proposed  
> **Date:** 2026-11-03  
> **Authors:** Antigravity Engineering & Dev Rahulkumar Pandya / Satyam Singh (HCI Report Base)  
> **Scope:** Full-stack architecture with Node.js/Express compute, Prisma ORM, PostgreSQL database, and two-sided portal (Student Opt-In + TPO Admin Management).

---

## 1. Executive Summary & Goals

CareerFlow expands from a client-side prototype into a complete, enterprise-grade campus placement platform featuring:
1. **Dedicated Backend Compute Layer:** RESTful API server powered by Node.js, Express, and TypeScript.
2. **Relational Database:** Prisma ORM backed by SQLite (local zero-config) and PostgreSQL (AWS RDS in production).
3. **Two-Sided Platform:**
   - **Student Portal:** Aarav Mehta and peers discover drives, verify academic eligibility, opt in (apply) with tailored resumes, simulate future improvements, and practice.
   - **TPO Admin Portal:** Campus placement officers create drives, define granular eligibility criteria, review student applicants, perform 1-click **Bulk Auto-Shortlisting**, advance candidate interview stages, and track institute-wide placement analytics.
4. **AWS Deployment Architecture:** AWS App Runner / ECS Fargate container for compute + Amazon RDS for PostgreSQL + S3/CloudFront for CDN and static delivery.

---

## 2. User Roles & Core Workflows

### 2.1 Personas
- **Student (Aarav Mehta / CS / CGPA 8.4):** Evaluates eligibility against published drives, opts into company drives with resume & confirmation, tracks application stages.
- **TPO Placement Admin (Campus Placement Cell):** Publishes company drives with cutoffs, reviews candidate rosters, auto-shortlists eligible students, updates selection results, and presents placement statistics to college leadership.

### 2.2 The Placement Lifecycle Flow
```
[TPO Admin] Publishes Company Drive & Criteria
       │
       ▼
[Eligibility Engine] Evaluates All Students Automatically
       │
       ▼
[Student] Views Drive, Inspects Criteria & Opts In (Applies)
       │
       ▼
[TPO Admin] Reviews Applicants & Runs Bulk Auto-Shortlist
       │
       ▼
[TPO Admin] Advances Stages (Shortlisted → Assessment → Interview → Selected)
       │
       ▼
[Student] Tracks Live Progress & Formally Accepts Offer Letter
```

---

## 3. System Architecture & Topology

### 3.1 Local Development
- **Frontend:** Vite Dev Server running at `http://localhost:5173`. Proxies `/api` requests to backend port `5000`.
- **Backend:** Express TypeScript server running on `http://localhost:5000` via `tsx watch`.
- **Database:** Local SQLite database at `prisma/dev.db` with automated seed data (10 mock companies, Aarav Mehta profile, default mock interview slots).

### 3.2 AWS Production Topology
```mermaid
flowchart TD
    User[Student & TPO Browser] -->|HTTPS| CloudFront[Amazon CloudFront CDN]
    
    subgraph S3Static ["Static Frontend"]
        CloudFront -->|/* (HTML, JS, CSS)| S3[Amazon S3 Bucket]
    end

    subgraph ComputeLayer ["Backend Compute (VPC)"]
        CloudFront -->|/api/*| AppRunner[AWS App Runner / ECS Fargate<br/>Node.js Express Container]
    end

    subgraph DataLayer ["Database Layer (Private Subnet)"]
        AppRunner -->|Prisma Client / SSL| RDS[(Amazon RDS PostgreSQL)]
    end
```

---

## 4. Database Schema Specification (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "sqlite" // sqlite for local, postgresql in production via env
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

## 5. REST API Specifications (`/api/v1`)

### 5.1 Public / Student Endpoints
- `GET /api/health` — Healthcheck
- `GET /api/student` — Current authenticated student profile
- `PUT /api/student` — Update academic records (validated against CGPA 0-10, percentages 0-100)
- `POST /api/student/resumes` — Upload / add resume
- `DELETE /api/student/resumes/:id` — Delete resume
- `PATCH /api/student/resumes/:id/primary` — Set primary resume
- `GET /api/jobs` — Active placement drives
- `GET /api/jobs/:id` — Single placement drive details
- `GET /api/applications` — Student's submitted applications
- `POST /api/applications` — Opt in / apply to drive (requires resume and hard confirmation)
- `GET /api/prep` — DSA counts, aptitude history, checklist, mock slots
- `POST /api/prep/dsa/:topic/increment` — Log solved problem (+1)
- `POST /api/prep/aptitude` — Record completed aptitude test
- `PATCH /api/prep/checklist` — Toggle ATS checklist item
- `POST /api/prep/mock/:slotId/book` — Reserve mock interview slot
- `POST /api/prep/mock/:slotId/cancel` — Release mock interview slot

### 5.2 TPO Admin Endpoints (`/api/admin/*`)
- `POST /api/admin/jobs` — Create new company drive with cutoffs
- `PUT /api/admin/jobs/:id` — Edit company drive cutoffs/details
- `DELETE /api/admin/jobs/:id` — Archive / delete drive
- `GET /api/admin/jobs/:jobId/applicants` — Retrieve all applicants for a drive, including academic metrics and attached resume
- `PATCH /api/admin/applications/:id/stage` — Advance/update candidate status (`Shortlisted`, `Assessment`, `Interview`, `Selected`, `Rejected`)
- `POST /api/admin/jobs/:jobId/auto-shortlist` — **Bulk Auto-Shortlist:** Runs pure eligibility engine on all applicants and transitions all qualifying candidates to `Shortlisted`
- `GET /api/admin/analytics` — Placement rates, branch-wise placement breakdown, average and highest CTC, drive counts

---

## 6. Frontend TPO Admin Module (`src/modules/admin/`)

1. **TopBar Role Switcher:**
   - Pill toggle: **"Student View"** (Aarav Mehta) ↔ **"TPO Admin View"** (Placement Office).
2. **Admin Portal Routes:**
   - `/admin` — **Admin Dashboard:** Total placement drives, total applications, students placed %, branch distribution chart, recent drive activity.
   - `/admin/drives` — **Drive Management:** Create Drive modal, criteria builder (CGPA, branches, CTC, deadline), drive table with action buttons.
   - `/admin/applicants` — **Applicant Roster & Stage Control:** Select drive, inspect applicant list, view eligibility badges, 1-click **Bulk Auto-Shortlist** button, stage transition dropdowns.
3. **Optimistic UI & Notification Feedback:**
   - Toast alerts for drive publishing, stage advancements, and bulk shortlisting operations.

---

## 7. Migration Plan & Backward Compatibility
1. Keep the pure eligibility engine (`src/lib/eligibility.ts`) unchanged — it continues to be used by both frontend client and backend controller.
2. The frontend Zustand store will sync with the backend via a unified API client layer (`src/lib/api.ts`).
3. If the backend is unreachable, the store falls back gracefully to local storage and seed data so offline testing and development never break.

---

## 8. Verification Strategy
- **Backend Tests:** Unit tests for REST routes, Zod validation, and Prisma operations using Vitest / Supertest.
- **Frontend Tests:** Component tests for Admin Dashboard, Drive Creator form, Applicant Review table, and Bulk Auto-Shortlist action.
- **End-to-End Walkthrough Test:** Updated to verify the complete two-sided workflow:
  1. TPO Admin posts a new drive with criteria.
  2. Student Aarav sees the new drive, checks eligibility, and opts in.
  3. TPO Admin views Aarav in the applicant roster and triggers Bulk Auto-Shortlist.
  4. Aarav's application reflects "Shortlisted" in real-time.

