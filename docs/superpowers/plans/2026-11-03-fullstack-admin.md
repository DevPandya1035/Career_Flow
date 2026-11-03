# CareerFlow Full-Stack & TPO Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve CareerFlow into a full-stack platform with Node.js/Express compute, Prisma ORM, PostgreSQL/SQLite database, TPO Admin module (drive creation with criteria, applicant review, bulk auto-shortlist, placement analytics), student opt-in flow, and update all 11 documentation files.

**Architecture:** Client-Server-Database architecture with React 18 + Vite frontend, Express + TypeScript REST API backend, Prisma ORM targeting SQLite for zero-config local development and Amazon RDS PostgreSQL in production. Two-sided platform with role-based routing (Student vs. TPO Admin).

**Tech Stack:** React 18, TypeScript 5, Vite 5, Tailwind CSS 3, Zustand, Node.js 20, Express, Prisma ORM, SQLite / PostgreSQL, Zod, Vitest, Supertest.

**Spec:** `docs/superpowers/specs/2026-11-03-careerflow-fullstack-admin.md`

## Global Constraints
- Node 20+, TypeScript 5 strict mode.
- Prisma ORM must use SQLite by default locally (`prisma/dev.db`) with zero setup friction; seamless switch to PostgreSQL in production via `DATABASE_URL`.
- Pure eligibility engine (`src/lib/eligibility.ts`) must remain pure and shared across both frontend client and backend controller.
- All 11 markdown documentation files in `docs/` must accurately reflect the full-stack compute, database, and TPO admin capabilities.
- All user-facing UI must adhere to WCAG 2.1 AA accessibility and Tailwind design tokens.

## Review Focus
1. **Drive creation validation:** TPO Admin creating a drive with missing or negative criteria (e.g. CGPA < 0 or > 10, deadline in the past) must be rejected with 400 Bad Request and clean UI error message.
2. **Bulk Auto-Shortlist accuracy:** Running bulk auto-shortlist must only shortlist applicants who satisfy 100% of the drive's hard criteria (CGPA, backlogs, branch, 10th%, 12th%), leaving ineligible applicants untouched.
3. **Duplicate application rejection:** A student attempting to opt into the same drive twice must receive a 409 Conflict error without duplicating database records.
4. **Offline / API fallback resiliency:** If the backend API server is momentarily unreachable, the frontend must gracefully fall back to cached local storage rather than crashing.
5. **Role isolation:** Admin-only routes (`/api/admin/*`) must validate admin role context and prevent unauthorized mutations.

---

### Task 1: Update All 11 Documentation Files

**Files:**
- Modify: `docs/prd/PRD.md`
- Modify: `docs/trd/TRD.md`
- Modify: `docs/architecture/Architecture.md`
- Modify: `docs/schema/Schema.md`
- Modify: `docs/rules/Rules.md`
- Modify: `docs/ux/App-Flow.md`
- Modify: `docs/ux/UI-UX-Design-Brief.md`
- Modify: `docs/phases/Phases.md`
- Modify: `docs/memory/Memory.md`
- Modify: `docs/superpowers/plans/2026-11-03-careerflow.md`
- Modify: `docs/superpowers/specs/2026-11-03-careerflow-design.md`

- [ ] **Step 1: Update PRD & TRD**
  - Add TPO Admin Persona, FR27–FR35 (Drive creation, criteria specification, applicant review, bulk auto-shortlist, placement analytics, role switching).
  - Add Backend compute (Node/Express), Prisma ORM, and AWS App Runner + RDS PostgreSQL specifications to TRD.
- [ ] **Step 2: Update Architecture, Schema & Rules**
  - Update Architecture with Client-Server-Database diagrams, request lifecycles, and AWS cloud topology.
  - Update Schema with complete Prisma schema, PostgreSQL DDL, relational integrity, and seed specifications.
  - Update Rules with backend conventions, error codes, and admin role validation.
- [ ] **Step 3: Update UX Brief, App Flow, Phases & Memory**
  - Add TPO Admin wireframes, Drive Creator form, Applicant Review table, and Role Switcher in UX Brief and App Flow.
  - Update Phases.md with Phases P10 (Backend & DB), P11 (Admin Portal), P12 (Full-Stack Verification).
  - Update Memory.md with new architectural decisions and invariants.
- [ ] **Step 4: Commit documentation updates**
  ```bash
  git add docs/
  git commit -m "docs: update all 11 markdown specifications for full-stack compute, database, and TPO admin portal"
  ```

---

### Task 2: Backend Scaffolding, Prisma Schema & Database Seeding

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Modify: `package.json`
- Create: `server/src/prisma.ts`

**Interfaces:**
- Consumes: MOCK_JOBS and DEFAULT_STUDENT definitions
- Produces: `prisma` client instance exporting typed models (`Student`, `Resume`, `Job`, `Application`, `DSATopic`, `AptitudeAttempt`, `ResumeChecklist`, `MockSlot`)

- [ ] **Step 1: Install backend and Prisma dependencies**
  - Add `express`, `cors`, `zod`, `dotenv`, `@prisma/client` to dependencies.
  - Add `prisma`, `tsx`, `supertest`, `@types/express`, `@types/cors`, `@types/supertest` to devDependencies.
- [ ] **Step 2: Write Prisma Schema in `prisma/schema.prisma`**
  - Define models: `Student`, `Resume`, `Job`, `Application`, `DSATopic`, `AptitudeAttempt`, `ResumeChecklist`, `MockSlot`.
- [ ] **Step 3: Write seed script in `prisma/seed.ts`**
  - Seeds the 10 mock placement companies, student Aarav Mehta with resumes, and prep topics.
- [ ] **Step 4: Push DB schema & execute seed**
  - Run: `npx prisma db push && npx tsx prisma/seed.ts`
  - Expected: SQLite database `prisma/dev.db` created and successfully seeded with 10 jobs and Aarav Mehta.
- [ ] **Step 5: Commit**
  ```bash
  git add prisma/ package.json server/src/prisma.ts
  git commit -m "feat(backend): prisma schema, database setup, and seed script"
  ```

---

### Task 3: Backend Express App & Jobs/Student REST Routes

**Files:**
- Create: `server/src/app.ts`
- Create: `server/src/index.ts`
- Create: `server/src/routes/jobs.ts`
- Create: `server/src/routes/student.ts`
- Test: `server/src/routes/jobs.test.ts`
- Test: `server/src/routes/student.test.ts`

**Interfaces:**
- Produces: `GET /api/jobs`, `GET /api/jobs/:id`, `GET /api/student`, `PUT /api/student`, `POST /api/student/resumes`

- [ ] **Step 1: Write failing tests for Jobs and Student routes**
  - In `server/src/routes/jobs.test.ts` and `student.test.ts`, assert `GET /api/jobs` returns 10 companies and `GET /api/student` returns Aarav Mehta.
- [ ] **Step 2: Run tests to verify failure**
  - Run: `npx vitest run server/src/routes/jobs.test.ts`
  - Expected: FAIL with connection refused / route not found.
- [ ] **Step 3: Implement `server/src/app.ts` and routes**
  - Setup Express app with CORS, JSON body parser.
  - Mount `/api/jobs` and `/api/student` routes querying Prisma.
- [ ] **Step 4: Run tests to verify pass**
  - Run: `npx vitest run server/src/routes/jobs.test.ts server/src/routes/student.test.ts`
  - Expected: PASS
- [ ] **Step 5: Commit**
  ```bash
  git add server/src/
  git commit -m "feat(api): express server setup with jobs and student endpoints"
  ```

---

### Task 4: Backend Applications & Preparation Hub Routes

**Files:**
- Create: `server/src/routes/applications.ts`
- Create: `server/src/routes/prep.ts`
- Test: `server/src/routes/applications.test.ts`
- Test: `server/src/routes/prep.test.ts`

**Interfaces:**
- Produces: `GET /api/applications`, `POST /api/applications`, `GET /api/prep`, `POST /api/prep/dsa/:topic/increment`, `POST /api/prep/mock/:slotId/book`

- [ ] **Step 1: Write failing tests for Applications and Prep routes**
  - Test submitting application (success + rejection of duplicate opt-ins).
  - Test incrementing DSA problem count (+1 solved) and booking mock slot.
- [ ] **Step 2: Run tests to verify failure**
  - Run: `npx vitest run server/src/routes/applications.test.ts`
  - Expected: FAIL
- [ ] **Step 3: Implement route handlers**
  - Validate payloads with Zod.
  - Enforce unique constraint on `(studentId, jobId)`.
- [ ] **Step 4: Run tests to verify pass**
  - Run: `npx vitest run server/src/routes/applications.test.ts server/src/routes/prep.test.ts`
  - Expected: PASS
- [ ] **Step 5: Commit**
  ```bash
  git add server/src/routes/
  git commit -m "feat(api): application submission and preparation hub endpoints"
  ```

---

### Task 5: Backend TPO Admin API Routes & Bulk Auto-Shortlist

**Files:**
- Create: `server/src/routes/admin.ts`
- Test: `server/src/routes/admin.test.ts`

**Interfaces:**
- Produces: `POST /api/admin/jobs`, `PUT /api/admin/jobs/:id`, `GET /api/admin/jobs/:jobId/applicants`, `PATCH /api/admin/applications/:id/stage`, `POST /api/admin/jobs/:jobId/auto-shortlist`, `GET /api/admin/analytics`

- [ ] **Step 1: Write failing tests for TPO Admin routes**
  - Test creating a new drive with criteria.
  - Test listing applicants for a drive.
  - Test advancing an applicant's stage.
  - Test **Bulk Auto-Shortlist**: applicants meeting criteria get status 'Shortlisted', failing applicants remain 'Applied'.
  - Test analytics calculation (branch placement %, average CTC).
- [ ] **Step 2: Run tests to verify failure**
  - Run: `npx vitest run server/src/routes/admin.test.ts`
  - Expected: FAIL
- [ ] **Step 3: Implement `server/src/routes/admin.ts`**
  - Integrate pure `checkEligibility` engine inside `auto-shortlist` endpoint.
  - Add analytics aggregation queries.
- [ ] **Step 4: Run tests to verify pass**
  - Run: `npx vitest run server/src/routes/admin.test.ts`
  - Expected: PASS
- [ ] **Step 5: Commit**
  ```bash
  git add server/src/routes/admin.ts server/src/routes/admin.test.ts
  git commit -m "feat(api): TPO admin endpoints with drive creation, applicant review, and bulk auto-shortlisting"
  ```

---

### Task 6: Frontend API Client Layer & Vite Server Proxy

**Files:**
- Create: `src/lib/api.ts`
- Modify: `vite.config.ts`
- Modify: `src/store/index.ts`
- Test: `src/lib/api.test.ts`

**Interfaces:**
- Produces: `api.jobs`, `api.student`, `api.applications`, `api.prep`, `api.admin`

- [ ] **Step 1: Write failing test for `api.ts` client**
  - Mock fetch calls to verify typed responses and error handling.
- [ ] **Step 2: Implement `src/lib/api.ts`**
  - Typed methods for fetching and mutating resources with fallback to local store if offline.
- [ ] **Step 3: Update `vite.config.ts`**
  - Configure dev server proxy: `/api` -> `http://localhost:5000`.
- [ ] **Step 4: Run tests to verify pass**
  - Run: `npx vitest run src/lib/api.test.ts`
  - Expected: PASS
- [ ] **Step 5: Commit**
  ```bash
  git add src/lib/api.ts vite.config.ts src/lib/api.test.ts
  git commit -m "feat(client): typed API client layer and Vite proxy configuration"
  ```

---

### Task 7: Frontend Role Switcher & TPO Admin Dashboard

**Files:**
- Modify: `src/components/layout/TopBar.tsx`
- Create: `src/modules/admin/AdminDashboard.tsx`
- Modify: `src/App.tsx`
- Test: `src/modules/admin/AdminDashboard.test.tsx`

**Interfaces:**
- Produces: Role switch toggle (`Student` ↔ `TPO Admin`) and `/admin` dashboard route.

- [ ] **Step 1: Write failing test for Role Switcher and AdminDashboard**
  - Assert clicking "Switch to TPO Admin" navigates to `/admin`.
  - Assert AdminDashboard renders key metrics (Total Drives, Placed %, Avg CTC).
- [ ] **Step 2: Implement Role Switcher in `TopBar.tsx`**
  - Pill toggle button displaying current view with badge.
- [ ] **Step 3: Implement `AdminDashboard.tsx`**
  - Render KPI cards and branch-wise placement breakdown bars.
- [ ] **Step 4: Register routes in `App.tsx`**
  - Mount `/admin`, `/admin/drives`, `/admin/applicants`.
- [ ] **Step 5: Run tests to verify pass**
  - Run: `npx vitest run src/modules/admin/AdminDashboard.test.tsx`
  - Expected: PASS
- [ ] **Step 6: Commit**
  ```bash
  git add src/components/layout/TopBar.tsx src/modules/admin/AdminDashboard.tsx src/App.tsx
  git commit -m "feat(admin): role switcher in topbar and TPO admin dashboard"
  ```

---

### Task 8: Frontend TPO Drive Manager (Create & Edit Company Drives)

**Files:**
- Create: `src/modules/admin/DriveManager.tsx`
- Create: `src/modules/admin/CreateDriveModal.tsx`
- Test: `src/modules/admin/DriveManager.test.tsx`

**Interfaces:**
- Produces: `/admin/drives` UI for creating drives with eligibility criteria and managing drive status.

- [ ] **Step 1: Write failing test for DriveManager & CreateDriveModal**
  - Test opening modal, entering company name, CTC, CGPA cutoff, branches, and submitting.
- [ ] **Step 2: Implement `CreateDriveModal.tsx`**
  - Form inputs for company, role, type, CTC, deadline, min CGPA, branches checkboxes, selection rounds.
  - Validation: CGPA 0–10, CTC > 0, future deadline required.
- [ ] **Step 3: Implement `DriveManager.tsx`**
  - Drive list with company cards, criteria summary, edit button, and "Add Drive" action.
- [ ] **Step 4: Run tests to verify pass**
  - Run: `npx vitest run src/modules/admin/DriveManager.test.tsx`
  - Expected: PASS
- [ ] **Step 5: Commit**
  ```bash
  git add src/modules/admin/DriveManager.tsx src/modules/admin/CreateDriveModal.tsx
  git commit -m "feat(admin): drive manager and criteria creation modal"
  ```

---

### Task 9: Frontend TPO Applicant Review & Bulk Auto-Shortlisting

**Files:**
- Create: `src/modules/admin/ApplicantReview.tsx`
- Test: `src/modules/admin/ApplicantReview.test.tsx`

**Interfaces:**
- Produces: `/admin/applicants` UI for inspecting applicants per drive, running bulk auto-shortlist, and advancing stages.

- [ ] **Step 1: Write failing test for ApplicantReview**
  - Test selecting a drive, viewing applicant table with student CGPA and eligibility badge.
  - Test clicking "Bulk Auto-Shortlist" triggers confirmation and updates qualifying applicants to "Shortlisted".
- [ ] **Step 2: Implement `ApplicantReview.tsx`**
  - Drive selector dropdown.
  - Applicant table: Student name, branch, CGPA, eligibility status pill, attached resume link, stage dropdown.
  - **"Bulk Auto-Shortlist"** button with lightning icon and confirmation modal.
- [ ] **Step 3: Run tests to verify pass**
  - Run: `npx vitest run src/modules/admin/ApplicantReview.test.tsx`
  - Expected: PASS
- [ ] **Step 4: Commit**
  ```bash
  git add src/modules/admin/ApplicantReview.tsx
  git commit -m "feat(admin): applicant review table with stage advancement and bulk auto-shortlisting"
  ```

---

### Task 10: End-to-End Walkthrough Test & Production Build

**Files:**
- Modify: `src/test/WalkthroughDemo.test.tsx`

- [ ] **Step 1: Update Walkthrough test to cover the full two-sided workflow**
  - TPO Admin creates a new drive: "Atlassian SDE", min CGPA 8.0, branches [CS, IT].
  - Student Aarav (CGPA 8.4) discovers the new drive in `/jobs`, checks eligibility (Eligible), and opts in.
  - TPO Admin visits `/admin/applicants`, inspects Aarav, runs "Bulk Auto-Shortlist" -> Aarav status updates to "Shortlisted".
  - TPO Admin advances Aarav to "Selected".
  - Student Aarav accepts offer on `/tracker` with celebratory confetti.
- [ ] **Step 2: Run all Vitest suites**
  - Run: `npm test`
  - Expected: 100% PASS across both frontend and backend suites.
- [ ] **Step 3: Run TypeScript compiler and production build**
  - Run: `npm run build`
  - Expected: Exit code 0, no type errors.
- [ ] **Step 4: Commit**
  ```bash
  git add src/test/WalkthroughDemo.test.tsx
  git commit -m "test: verify end-to-end full-stack two-sided placement workflow"
  ```

