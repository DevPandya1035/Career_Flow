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
| P7 | Student Profile | Academic form, skill tags, resume manager | ⬜ Pending | Medium |
| P8 | Polish | Responsive, accessibility, animations | ⬜ Pending | Medium |
| P9 | Verification | Full test suite, bundle check, final docs | ⬜ Pending | Small |

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
- [ ] `AcademicForm` — all fields with validation
- [ ] `SkillTags` — tag input + remove
- [ ] `ResumeManager` — file upload, list, primary, delete
- [ ] `ProfilePage` — 3-section layout

### Phase Completion Criteria
- Saving profile with CGPA 11 shows validation error
- Saving valid profile shows success toast
- After adding a resume, Apply modal shows it as an option
- Changing branch to ME makes Google (CS/IT only) ineligible on /eligibility

---

## Phase 8 — Polish

**Goal:** Production-quality responsiveness and accessibility.

### Deliverables
- [ ] Mobile bottom nav (6 icons)
- [ ] All modules verified at 320px, 375px, 768px, 1024px, 1280px
- [ ] Tap targets ≥ 44px on mobile
- [ ] Axe-core audit: zero violations
- [ ] Keyboard navigation manual test: all paths complete
- [ ] Toast animations working
- [ ] Modal transitions smooth

### Phase Completion Criteria
- Zero axe violations on all pages
- No horizontal overflow on 320px
- Sidebar hides on mobile, bottom nav shows
- ESC closes every modal

---

## Phase 9 — Verification

**Goal:** Ship-ready codebase.

### Deliverables
- [ ] All tests passing (`npm test`)
- [ ] TypeScript: zero errors (`npx tsc --noEmit`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Bundle ≤ 200KB gzipped
- [ ] Coverage: eligibility engine 100%, store slices ≥ 90%
- [ ] `docs/memory/Memory.md` updated — all phases marked complete

### Phase Completion Criteria
- `npm test` = green
- `npm run build` = success
- Readiness score updates correctly across all modules
- All 10 companies loaded and eligibility computed correctly
- The full walkthrough from the HCI report (steps 1–6 in Section 9) works exactly as described

---

## Walkthrough Demo Script (from HCI Report Section 9)

> Run this after Phase 9 to verify the full prototype:

1. Open `/jobs` → tick "Eligible jobs only" → Google and Goldman Sachs disappear (CGPA 8.4 < 8.5)
2. Clear filter → press disabled Apply on Google → message names the failed criterion ("CGPA: 8.4, required ≥ 8.5")
3. Open `/eligibility` → select Google → change CGPA override to 8.6 → table turns green → Apply enabled in what-if view
4. Go back to `/jobs` → apply to Flipkart → try submitting with checkbox unticked → inline error → tick it → submit → success toast
5. Open `/tracker` → see Flipkart in "Applied" → click "Advance (Demo)" → advances to "Shortlisted"
6. Open `/prep` → log a DSA problem → progress bar increments → go to `/` → readiness score increases

