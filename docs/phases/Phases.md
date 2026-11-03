# CareerFlow — Phases

> Living phase tracker. Update status as work progresses.
> **Last updated:** 2026-11-03

---

## Phase Overview

```
P0 → P1 → P2 → P3 → P4 → P5 → P6 → P7 → P8 → P9
 ↑
 You are here
```

| Phase | Name | Description | Status | Est. Effort |
|---|---|---|---|---|
| P0 | Foundation | Scaffold, types, mock data, eligibility engine | 🟢 Complete | Small |
| P1 | App Shell | Sidebar, TopBar, routing, Zustand store, shared UI | 🟢 Complete | Medium |
| P2 | Dashboard | Readiness ring, deadlines, stage chips | 🟢 Complete | Medium |
| P3 | Job Opportunities | Card grid, filters, search, apply modal | 🟢 Complete | Large |
| P4 | Application Tracker | Kanban board, advance demo, offer CTA | 🟢 Complete | Medium |
| P5 | Eligibility Checker | What-if checker, pass/fail table | 🟢 Complete | Medium |
| P6 | Preparation Hub | DSA, aptitude, checklist, mock interviews | 🟢 Complete | Large |
| P7 | Student Profile | Academic form, skill tags, resume manager | 🟢 Complete | Medium |
| P8 | Polish | Responsive, accessibility, animations | 🟢 Complete | Medium |
| P9 | Client Verification | Full test suite, bundle check, final docs | 🟢 Complete | Small |
| P10 | Backend Compute & Database | Node.js Express, Prisma ORM, SQLite/PostgreSQL, seed script | 🟢 Complete | Medium |
| P11 | REST API Endpoints | Jobs, Student, Applications, Prep, TPO Admin routes | 🟢 Complete | Medium |
| P12 | TPO Admin Portal | Drive creator with criteria, applicant review, bulk auto-shortlist, role switcher | 🟢 Complete | Large |
| P13 | Full-Stack Verification | E2E two-sided placement walkthrough, build & cloud ready | 🟢 Complete | Small |

---

## Phase 0 — Foundation

**Goal:** Working project skeleton with all types and logic in place before any UI.

### Deliverables
- [ ] Vite + React + TypeScript project scaffolded (`npm run dev` works)
- [ ] Tailwind configured with design tokens
- [ ] All TypeScript interfaces (`Student`, `Job`, `Application`, `EligibilityResult`, `PrepProgress`)
- [ ] 10 mock companies in `src/data/jobs.ts`
- [ ] Default student (Aarav Mehta, CS, CGPA 8.4) in `src/data/student.ts`
- [ ] `checkEligibility(student, job)` pure function with tests — 100% coverage
- [ ] Vitest configured, test setup file created
- [ ] All tests passing

### Phase Completion Criteria
- `npm run dev` — no errors
- `npm test` — all tests green
- `checkEligibility` tests: Aarav ineligible for Google, eligible for Flipkart
- No TypeScript errors (`npx tsc --noEmit`)

---

## Phase 1 — App Shell

**Goal:** Navigable skeleton. Every route works. Shared UI components ready.

### Deliverables
- [ ] `Sidebar` — navy, 6 nav links, `aria-current="page"` on active
- [ ] `TopBar` — logo, student avatar, notification icon
- [ ] `AppShell` — sidebar + topbar + `<Outlet>`
- [ ] React Router v6 routes: `/`, `/jobs`, `/tracker`, `/eligibility`, `/prep`, `/profile`
- [ ] Zustand store with all slices + localStorage persist
- [ ] Shared UI: `Button`, `Badge`, `Card`, `Modal`, `Toast`, `ProgressBar`, `Stepper`, `EligibilityPill`
- [ ] All UI component tests passing

### Phase Completion Criteria
- Navigate to all 6 routes — no 404s
- Sidebar active link updates on navigation
- Modal opens, traps focus, closes on ESC
- Disabled button shows `aria-describedby` reason
- `npm test` — all shell + UI tests green

---

## Phase 2 — Dashboard

**Goal:** Dashboard shows real data from store.

### Deliverables
- [ ] `ReadinessRing` — SVG, `role="meter"`, 0–100, color-coded
- [ ] `DeadlineWidget` — next 5 job deadlines (not yet applied)
- [ ] `StageCountChips` — counts from applications store, links to tracker
- [ ] `useReadinessScore` hook with `calcReadinessScore` tested
- [ ] `Dashboard.tsx` — responsive grid layout

### Phase Completion Criteria
- Initial readiness score = 0 (no prep done yet)
- Deadline widget shows Flipkart (Nov 30) as nearest deadline
- Stage chips all show 0
- Mobile layout looks correct at 375px

---

## Phase 3 — Job Opportunities

**Goal:** Full job discovery and apply flow working.

### Deliverables
- [ ] `JobCard` — company, role, CTC, deadline, eligibility pill, apply button
- [ ] `JobFilters` — search, role type, CGPA, branch, saved only, sort
- [ ] `JobsPage` — two-column layout, filter + card grid
- [ ] `ApplyModal` — resume picker + confirmation step
- [ ] All apply guard logic: ineligible → disabled; no resume → link to profile; duplicate → already applied state

### Phase Completion Criteria
- Google shows "Ineligible" pill for Aarav
- Flipkart shows "Eligible" pill
- Applying to Flipkart without ticking checkbox shows inline error
- After successful apply, card shows "Applied" state
- Applied job appears in tracker
- "Eligible jobs only" filter removes Google and Goldman Sachs (CGPA 8.5 min)

---

## Phase 4 — Application Tracker

**Goal:** Five-stage Kanban visible and interactive.

### Deliverables
- [ ] `TrackerPage` — horizontal scroll, 5 columns
- [ ] `StageColumn` — header with count, card list, empty placeholder
- [ ] `ApplicationCard` — company, role, date, next-step, advance button

### Phase Completion Criteria
- After applying to Flipkart, card appears in "Applied" column
- Clicking "Advance (Demo)" moves card to "Shortlisted"
- Empty state with "Browse Jobs" link when no applications

---

## Phase 5 — Eligibility Checker

**Goal:** What-if checker reactive to company selection and CGPA override.

### Deliverables
- [ ] `CompanyPicker` — dropdown of all 10 companies
- [ ] `ResultsTable` — criterion rows, pass/fail colouring
- [ ] `EligibilityPage` — two-panel layout, reactive to overrides

### Phase Completion Criteria
- Select Google → shows INELIGIBLE (Aarav CGPA 8.4 < 8.5)
- Change CGPA override to 8.6 → flips to ELIGIBLE instantly
- All 6 criteria checked and displayed correctly

---

## Phase 6 — Preparation Hub

**Goal:** All 4 prep tabs working and persisted to store.

### Deliverables
- [ ] `DSATracker` — 8 topics, progress bars, +1 solved button
- [ ] `AptitudePanel` — score history, practice quiz placeholder
- [ ] `ResumeChecklist` — 8 items, toggleable, progress bar
- [ ] `MockInterviews` — 3 slots, book/cancel

### Phase Completion Criteria
- Solving a DSA problem increments progress bar
- Ticking checklist items updates checklist progress
- Dashboard readiness score increases after logging DSA problems
- All state persists on page reload (localStorage)

---

## Phase 7 — Student Profile

**Goal:** Editable profile that feeds eligibility engine.

### Deliverables
- [x] `AcademicForm` — all fields with validation
- [x] `SkillTags` — tag input + remove
- [x] `ResumeManager` — file upload, list, primary, delete
- [x] `ProfilePage` — 3-section layout

### Phase Completion Criteria
- [x] Saving profile with CGPA 11 shows validation error
- [x] Saving valid profile shows success toast
- [x] After adding a resume, Apply modal shows it as an option
- [x] Changing branch to ME makes Google (CS/IT only) ineligible on /eligibility

---

## Phase 8 — Polish

**Goal:** Production-quality responsiveness and accessibility.

### Deliverables
- [x] Mobile bottom nav (6 icons)
- [x] All modules verified at 320px, 375px, 768px, 1024px, 1280px
- [x] Tap targets ≥ 44px on mobile
- [x] Accessible dialogs, tooltips, and live region toasts
- [x] Keyboard navigation verified: focus trapping, Escape, arrow keys
- [x] Toast animations working
- [x] Modal transitions smooth

### Phase Completion Criteria
- [x] Zero accessibility defects on interactive elements
- [x] No horizontal overflow on 320px
- [x] Sidebar hides on mobile, bottom nav shows
- [x] ESC closes every modal

---

## Phase 9 — Verification

**Goal:** Ship-ready codebase.

### Deliverables
- [x] All tests passing (`npm test` — 72 tests across 18 test suites)
- [x] TypeScript: zero errors (`npx tsc --noEmit`)
- [x] Production build succeeds (`npm run build` — 98.87 kB gzipped)
- [x] Bundle ≤ 200KB gzipped (Achieved 98.87 kB gzipped)
- [x] Coverage: eligibility engine 100%, store slices ≥ 90%
- [x] `docs/memory/Memory.md` updated — all phases marked complete

### Phase Completion Criteria
- [x] `npm test` = green (72/72 tests passing)
- [x] `npm run build` = success
- [x] Readiness score updates correctly across all modules
- [x] All 10 companies loaded and eligibility computed correctly
- [x] The full walkthrough from the HCI report (steps 1–6 in Section 9) works exactly as described and verified by `src/test/WalkthroughDemo.test.tsx`

---

## Phase 10 — Backend Compute & Database

**Goal:** Unified TypeScript backend with Prisma ORM, SQLite for zero-config local run, and PostgreSQL for AWS RDS.

### Deliverables
- [x] Express 5 server scaffolded in `server/src/app.ts` with CORS and JSON middleware
- [x] Prisma schema defined in `prisma/schema.prisma` with relational models (`Student`, `Resume`, `Job`, `Application`, `DsaTopic`, `AptitudeAttempt`, `ResumeChecklist`, `MockSlot`)
- [x] SQLite zero-config local database generated at `prisma/dev.db`
- [x] Seed script `prisma/seed.ts` populating 10 corporate drives, Aarav Mehta student profile, DSA topics, and mock slots
- [x] Singleton Prisma client configured in `server/src/prisma.ts`

### Phase Completion Criteria
- [x] `npx prisma db push` executes cleanly
- [x] `npx tsx prisma/seed.ts` seeds all relational records without errors
- [x] `/api/health` returns status: 'ok'

---

## Phase 11 — REST API Endpoints

**Goal:** Secure, typed REST endpoints with Zod validation covering Student, Jobs, Applications, Prep, and TPO Admin.

### Deliverables
- [x] `GET /api/jobs`, `GET /api/jobs/:id` with formatters matching frontend interfaces
- [x] `GET /api/student`, `PUT /api/student` (CGPA 0.0–10.0 Zod validation), `POST /api/student/resumes`, `DELETE /api/student/resumes/:id`
- [x] `GET /api/applications`, `POST /api/applications` with 409 conflict guard preventing duplicate opt-in
- [x] `GET /api/prep`, `POST /api/prep/dsa/:topic/increment`, `POST /api/prep/aptitude`, `PATCH /api/prep/checklist`, `POST /api/prep/mock/:slotId/book`, `POST /api/prep/mock/:slotId/cancel`
- [x] `POST /api/admin/jobs`, `PUT /api/admin/jobs/:id`, `DELETE /api/admin/jobs/:id` (archive)
- [x] `GET /api/admin/jobs/:jobId/applicants` with verified criteria evaluation per applicant
- [x] `POST /api/admin/jobs/:jobId/auto-shortlist` (FR31 1-Click Bulk Auto-Shortlist)
- [x] `PATCH /api/admin/applications/:id/stage` (candidate stage advancement)
- [x] `GET /api/admin/analytics` (placement rates, average & highest CTC, branch breakdown)

### Phase Completion Criteria
- [x] All 18 backend tests passing across 5 test suites (`server/src/routes/*.test.ts`)
- [x] Bulk auto-shortlist atomically shortlists qualifying candidates and preserves ineligible candidates in Applied stage

---

## Phase 12 — TPO Admin Portal

**Goal:** Fully integrated, accessible TPO Placement Cell portal with role switcher, drive manager, criteria setup, and applicant review.

### Deliverables
- [x] Role switcher segmented control in `TopBar.tsx` (`Student` ↔ `TPO Admin`)
- [x] Dynamic admin navigation in `Sidebar.tsx` with TPO Admin badge and quick switch back link
- [x] `AdminDashboard.tsx` with 4 KPI cards (Active Drives, Total Applications, Placement Rate, Average CTC), branch-wise placement progress bars, and recent drives table
- [x] `CreateDriveModal.tsx` with form fields for company, role, domain type, CTC, deadline, min CGPA, max backlogs, 10th/12th cutoffs, branch pills, and test rounds
- [x] `DriveManager.tsx` with filtering by branch and role, applicant counts, review links, and drive archiving
- [x] `ApplicantReview.tsx` with drive selector, published cutoffs banner, verified eligibility badges, candidate stage dropdown, and **1-Click Bulk Auto-Shortlist (FR31)**

### Phase Completion Criteria
- [x] Unit tests passing for `AdminDashboard`, `DriveManager`, and `ApplicantReview`
- [x] Role switcher updates state immediately and navigates to appropriate dashboard

---

## Phase 13 — Full-Stack Verification

**Goal:** Seamless end-to-end integration, 100% test pass rate, zero TypeScript errors, and production build readiness.

### Deliverables
- [x] End-to-end HCI walkthrough demo extended in `src/test/WalkthroughDemo.test.tsx` verifying full two-sided workflow (TPO publishes drive → Student discovers & opts in → TPO reviews & runs bulk auto-shortlist → Student pipeline updates to Shortlisted → Offer celebration)
- [x] 106 tests across 27 test files passing GREEN (`npm test`)
- [x] Production build passes (`npm run build` in < 1s with 0 errors)
- [x] Documentation synchronized (`PRD.md`, `TRD.md`, `Architecture.md`, `Schema.md`, `Rules.md`, `App-Flow.md`, `UI-UX-Design-Brief.md`, `Phases.md`, `Memory.md`)

### Phase Completion Criteria
- [x] `npm test` = green (106/106 tests passing)
- [x] `npm run build` = success with optimized bundle
- [x] Single command local run (`npm run dev`) and AWS App Runner / RDS production-ready topology verified

---

## Two-Sided Placement Walkthrough Script

> Run this to verify the complete full-stack portal:

1. Open `/jobs` → tick "Eligible jobs only" → Google disappears (CGPA 8.4 < 8.5)
2. Clear filter → open disabled Apply on Google → message shows exact failed cutoff
3. Open `/eligibility` → select Google → change CGPA override to 8.6 → table turns green
4. Go back to `/jobs` → apply to Flipkart with primary resume → confirmation modal → success toast
5. Open `/tracker` → verify Flipkart in "Applied"
6. Open `/prep` → log a DSA problem → readiness score increases on Dashboard
7. Click **TPO Admin** in TopBar → navigate to `/admin/drives` → click "Add Placement Drive" → publish "Salesforce" (Min CGPA: 8.0, Branches: CS, IT, CTC: 32 LPA)
8. Switch back to **Student** → discover "Salesforce" on `/jobs` → submit opt-in application
9. Switch to **TPO Admin** → open `/admin/applicants` → select "Salesforce" → click **"Bulk Auto-Shortlist"** → candidate automatically advances to "Shortlisted"
10. Switch back to **Student** → open `/tracker` → verify Salesforce is now in "Shortlisted" stage!

