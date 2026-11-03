# CareerFlow — Product Requirements Document (PRD)

> **Save path:** `docs/prd/PRD.md`

---

## Revision History

| Version | Date | Author | Summary |
|---------|------|--------|---------|
| v1.0 | 2026-11-03 | CareerFlow Team | Initial client-side release |
| v2.0 | 2026-11-03 | CareerFlow Team | Full-stack release: Node.js Express compute, Prisma relational database, AWS cloud architecture, and TPO Placement Admin portal |

---

## 1. Executive Summary

CareerFlow is an **enterprise-grade, full-stack campus placement and career management portal** delivered as a responsive web application (React 18 + TypeScript + Tailwind CSS + Vite) powered by a dedicated Node.js/Express compute layer and a Prisma-managed relational database (SQLite locally, Amazon RDS PostgreSQL in production). 

The platform supports two core roles:
1. **Students (Aarav, Meera, Rohit):** Discover verified company drives, check instant eligibility with zero ambiguity, opt in (apply) with tailored resumes, simulate future academic improvements, and prepare across DSA, aptitude, resume standards, and alumni mocks.
2. **TPO Admin (Campus Placement Cell):** Publish company placement drives with customized academic criteria (min CGPA, backlogs, branch list, 10th/12th cutoffs), review student applicant rosters, run 1-click **Bulk Auto-Shortlisting** of qualified candidates, advance candidate interview stages, and track real-time placement analytics.

The product targets undergraduate students at campus placement cells who currently juggle spreadsheets, notice boards, WhatsApp groups, and manual eligibility checks. CareerFlow reduces cognitive overhead, eliminates application errors caused by missed eligibility criteria, and gives each student a clear, personalised readiness score so they can focus preparation effort where it matters most.

The first release (v1.0) targets a System Usability Scale (SUS) score of **≥ 68** (above the industry "Good" threshold) and full **WCAG 2.1 AA** compliance, measured through usability testing with three representative student personas across CS, ECE, and ME branches.

---

## 2. Product Vision & Tagline

> **"Your Career. Your Journey. Your Future."**

**Vision:** To be the single, trusted companion that walks every campus student from placement readiness to offer acceptance — surfacing the right opportunity at the right time, eliminating guesswork, and celebrating every milestone along the way.

**Mission:** Deliver a zero-friction, fully accessible placement experience that respects student time, adapts to branch-specific constraints, and scales from the smallest college with ten recruiters to a large technical university with hundreds of companies.

---

## 3. Problem Statement

Campus placement processes today impose four significant pain points on students:

| # | Pain Point | Student Impact |
|---|-----------|----------------|
| **P1** | **Unclear eligibility** — Students do not know in advance whether they meet a company's branch, CGPA, backlog, or 12th-score cut-off until after they apply or are screened out. | Wasted effort, embarrassment, and loss of trust in the process. |
| **P2** | **Application errors** — Manual forms and offline spreadsheets lead to duplicate submissions, missing documents, or applying to roles for which the student is ineligible. | Rejections attributable to process failures rather than candidate capability. |
| **P3** | **Poor visibility into status** — Students have no real-time view of where their application stands (applied, shortlisted, in assessment, interviewed, or selected). | Anxiety, constant follow-up with placement coordinators, distraction from preparation. |
| **P4** | **High cognitive load** — Juggling multiple platforms (college ERP, WhatsApp groups, email, Google Sheets) forces students to context-switch constantly and risks missing critical deadlines. | Decision fatigue, missed opportunities, inequitable outcomes across students with varying digital literacy. |

CareerFlow addresses all four pain points in a single, locally-run web application that requires no login and no backend infrastructure.

---

## 4. Goals & Success Metrics

### 4.1 Goals

1. **Efficiency** (ISO 9241-11) — Reduce the time required for a student to discover a relevant job, verify eligibility, and complete an application.
2. **Effectiveness** (ISO 9241-11) — Ensure students can complete core tasks (apply, track, prepare) without errors or dead ends.
3. **Satisfaction** (ISO 9241-11) — Achieve a SUS score of ≥ 68, indicating a "Good" to "Excellent" usability rating.
4. **Accessibility** — Meet WCAG 2.1 AA across all six modules.
5. **Reliability** — Persist all student data across browser sessions without data loss.

### 4.2 Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| SUS Score | ≥ 68 | Post-task SUS questionnaire with 5+ participants per persona |
| Task Completion Rate | ≥ 90% | Moderated usability test (apply, track, check eligibility) |
| Time-on-Task: Apply Flow | ≤ 3 minutes | Stopwatch in usability sessions |
| Time-on-Task: Eligibility Check | ≤ 1 minute | Stopwatch in usability sessions |
| WCAG 2.1 AA Violations | 0 critical | Automated (axe-core) + manual audit |
| Lighthouse Accessibility Score | ≥ 90 | Automated CI check |
| FCP (throttled 4G) | ≤ 1 s | Lighthouse / WebPageTest |
| Bundle size (gzipped) | ≤ 200 KB | `vite build --report` |
| localStorage Hydration Success | 100% across sessions | Manual + automated tests |

---

## 5. Target Users

### 5.1 Persona Profiles

#### Persona 1 — Aarav Mehta (Computer Science)

| Attribute | Detail |
|-----------|--------|
| **Age** | 21 |
| **Branch** | Computer Science & Engineering |
| **CGPA** | 8.4 |
| **Skills** | Python, Java, Data Structures, SQL |
| **Goal** | Land a software engineering role at a top-tier product company |
| **Frustrations** | Doesn't know which companies have CS-only eligibility; spends too long on DSA prep without knowing what to prioritise |
| **Primary Needs** | Live eligibility badge on every job card; DSA topic tracker with completion states; a readiness score that reflects his current prep level |
| **Design Response** | Eligibility badge (teal "Eligible" / red "Ineligible") on every job card; DSA topic progress bars on Prep Hub; readiness score widget on Dashboard |

#### Persona 2 — Meera Nair (Electronics & Communication Engineering)

| Attribute | Detail |
|-----------|--------|
| **Age** | 21 |
| **Branch** | Electronics & Communication Engineering |
| **CGPA** | 7.9 |
| **Skills** | VLSI basics, Python, Embedded C |
| **Goal** | Get placed in a role that accepts ECE students and matches her interest in hardware/software boundary |
| **Frustrations** | Most filters assume CS; she often discovers ineligibility only after clicking into a job; her skill gap is hard to visualise |
| **Primary Needs** | Branch-aware eligibility filtering; skill gap view showing missing vs. possessed skills; a resume polish checklist |
| **Design Response** | Eligibility Checker with branch selector; skills gap table with "Have / Need / Gap" columns; Resume Checklist in Prep Hub |

#### Persona 3 — Rohit Sharma (Mechanical Engineering)

| Attribute | Detail |
|-----------|--------|
| **Age** | 22 |
| **Branch** | Mechanical Engineering |
| **CGPA** | 7.2 |
| **Skills** | AutoCAD, MATLAB, basic Python |
| **Goal** | Secure a core mechanical or manufacturing role; understand 12th-score requirements clearly |
| **Frustrations** | Eligibility criteria for ME roles often include 12th percentage — he doesn't know his cut-off status; unclear which stage his application is at |
| **Primary Needs** | 12th score eligibility display; clear application stage tracking; aptitude preparation resources |
| **Design Response** | Eligibility Engine surfaces 12th score criteria; five-stage Kanban pipeline in Tracker; Aptitude Score Practice section in Prep Hub |

#### Persona 4 — Dr. R. K. Verma (Head of Training & Placement / TPO Admin)

| Attribute | Detail |
|-----------|--------|
| **Role** | Training & Placement Officer (TPO) / Campus Admin |
| **Experience** | 12+ years managing university placement seasons |
| **Responsibilities** | Liaising with corporate recruiters, defining hard cutoffs, publishing drives, screening candidate pools, running drives, reporting placement KPIs to leadership |
| **Frustrations** | Students applying to drives they aren't qualified for; manually shortlisting hundreds of spreadsheet rows; disparate communication channels |
| **Primary Needs** | Easy drive creation form with strict criteria; instant 1-click bulk auto-shortlisting based on published cutoffs; candidate stage progression controls; placement analytics |
| **Design Response** | TPO Admin Portal (`/admin`), Drive Manager with criteria builder, Applicant Review Table with Bulk Auto-Shortlist action, real-time Placement Analytics Dashboard |

### 5.2 Persona-to-Feature Mapping

| Feature | Aarav (CS) | Meera (ECE) | Rohit (ME) | Dr. Verma (TPO Admin) |
|---------|-----------|------------|-----------|----------------------|
| Eligibility badge on job cards | ✅ Primary | ✅ Primary | ✅ Primary | — |
| Branch-aware eligibility filter | Secondary | ✅ Primary | ✅ Primary | — |
| DSA Topic Tracker | ✅ Primary | Secondary | — | — |
| Skills Gap View | Secondary | ✅ Primary | — | — |
| 12th Score Criteria display | — | Secondary | ✅ Primary | — |
| Aptitude Practice | Secondary | Secondary | ✅ Primary | — |
| Resume Checklist | Secondary | ✅ Primary | Secondary | — |
| Application Stage Tracker | ✅ Primary | ✅ Primary | ✅ Primary | — |
| Readiness Score | ✅ Primary | ✅ Primary | ✅ Primary | — |
| Mock Interview Booking | ✅ Primary | Secondary | Secondary | — |
| Create Placement Drive with Cutoffs | — | — | — | ✅ Primary |
| Applicant Review Roster | — | — | — | ✅ Primary |
| 1-Click Bulk Auto-Shortlist | — | — | — | ✅ Primary |
| Stage Progression Control | — | — | — | ✅ Primary |
| Placement Analytics Dashboard | — | — | — | ✅ Primary |
| Role Switcher (Student ↔ Admin) | Secondary | Secondary | Secondary | ✅ Primary |

---

## 6. Scope

### 6.1 In Scope

| Area | Detail |
|------|--------|
| Dashboard | Readiness score, deadlines widget, quick-links, stage stepper |
| Job Opportunities | Search, filter (branch/CGPA/skills), sort, save, detail view, Apply flow |
| Application Tracker | Five-stage Kanban (Applied → Shortlisted → Assessment → Interview → Selected) |
| Eligibility Checker | What-if checker: pick company + tweak CGPA/branch/skills, see pass/fail table |
| Preparation Hub | DSA topic tracker, aptitude score practice, resume checklist, mock interview slot booking |
| Student Profile | Academic details, skill tags, resume upload (PDF ≤ 2 MB), job preferences |
| Accessibility | WCAG 2.1 AA, keyboard navigation, ARIA roles, colour contrast |
| Persistence | All state via browser `localStorage`, no backend required |
| Responsive Design | 320 px – 1920 px viewport widths |
| Testing | Unit tests for eligibility engine; component tests for apply flow; accessibility checks |

### 6.2 Out of Scope

| Area | Reason |
|------|--------|
| Backend / API | No server-side infrastructure; all state is client-only |
| Authentication / Login | No user accounts; student identity stored in profile only |
| Officer / Recruiter Views | Separate product scope; not addressed in v1.0 |
| Push / Email Notifications | Requires backend or service worker; deferred to v2 |
| Resume Parsing (AI) | NLP/ML infra out of scope for v1.0 |
| Native Mobile Apps | Browser-only; native app deferred |
| Internship vs. Full-Time Distinction | v1.0 treats all opportunities uniformly |
| Multi-language / Localisation | English only in v1.0 |
| Analytics / Telemetry | No data leaves the browser in v1.0 |

---

## 7. Functional Requirements

### 7.1 MoSCoW Key

| Priority | Meaning |
|----------|---------|
| **Must** | Core; product fails without it |
| **Should** | High value; include if at all possible |
| **Could** | Nice-to-have; include if time permits |
| **Won't** | Explicitly out of scope for v1.0 |

---

### 7.2 Dashboard Module

| ID | Description | Module | Priority |
|----|-------------|--------|----------|
| FR1 | Display total number of available job opportunities | Dashboard | Must |
| FR2 | Display number of active (in-progress) applications | Dashboard | Must |
| FR3 | Display upcoming application deadlines within the next 7 days | Dashboard | Must |
| FR4 | Display student placement readiness score (0–100) derived from profile completeness, prep progress, and application activity | Dashboard | Must |
| FR5 | Display a quick-links panel to each of the six modules | Dashboard | Should |
| FR5a | Display a stage stepper reflecting the student's highest application stage across all active applications | Dashboard | Should |
| FR5b | Display a deadlines widget listing companies with applications due within the next 7 days | Dashboard | Should |

---

### 7.3 Job Opportunities Module

| ID | Description | Module | Priority |
|----|-------------|--------|----------|
| FR6 | Display a searchable, paginated list of job opportunities with company name, role title, CTC, deadline, and branch eligibility badge | Jobs | Must |
| FR7 | Filter job list by: branch eligibility, CGPA cut-off, skills required, job type | Jobs | Must |
| FR8 | Sort job list by: deadline (soonest first), CTC (highest first), company name (A–Z) | Jobs | Should |
| FR9 | Allow student to save/bookmark jobs; saved jobs persist across sessions | Jobs | Could |
| FR10 | Display a detailed job view with full description, eligibility criteria breakdown, required skills, and company information | Jobs | Must |

---

### 7.4 Application Flow

| ID | Description | Module | Priority |
|----|-------------|--------|----------|
| FR11 | Guard the Apply action with an eligibility check; if the student is ineligible, show a descriptive reason and disable the Apply button | Jobs | Must |
| FR12 | Present an Apply confirmation dialog with: resume picker (from uploaded resumes), summary of selected role, and a final "Confirm Apply" CTA; on confirmation, create an application record in state | Jobs | Must |

---

### 7.5 Application Tracker Module

| ID | Description | Module | Priority |
|----|-------------|--------|----------|
| FR13 | Display all applications in a five-stage Kanban pipeline: Applied → Shortlisted → Assessment → Interview → Selected | Tracker | Must |
| FR14 | Provide a demo "Advance Stage" button on each application card to simulate stage progression for demonstration purposes | Tracker | Must |
| FR14a | Display application date, company logo/name, and role title on each tracker card | Tracker | Should |
| FR14b | Highlight "Selected" stage cards with a distinct visual treatment (teal success colour) | Tracker | Should |

---

### 7.6 Eligibility Checker Module

| ID | Description | Module | Priority |
|----|-------------|--------|----------|
| FR15 | Provide a what-if eligibility checker: student selects a company and can adjust CGPA, branch, skills, and 12th score to see a pass/fail table instantly | Eligibility | Must |
| FR16 | Display eligibility result as a structured table with rows for each criterion (CGPA, branch, backlog count, 12th score, skills), each showing Pass or Fail status | Eligibility | Must |
| FR17 | Display a skills gap sub-section that lists skills required by the selected company, highlighting which the student possesses and which are missing | Eligibility | Should |

---

### 7.7 Preparation Hub Module

| ID | Description | Module | Priority |
|----|-------------|--------|----------|
| FR18 | Display a list of curated preparation resources (articles, videos, practice links) organised by topic | Prep Hub | Should |
| FR19 | Provide a DSA topic tracker with a list of standard topics; students can mark each topic as Not Started / In Progress / Done | Prep Hub | Must |
| FR20 | Provide an aptitude score practice section with topic-level scores that students can update | Prep Hub | Should |
| FR21 | Provide a resume quality checklist with binary check items; display overall completion percentage | Prep Hub | Must |
| FR22 | Provide a mock interview slot booking interface where students can pick a date/time slot; booked slots persist across sessions | Prep Hub | Could |

---

### 7.8 Student Profile Module

| ID | Description | Module | Priority |
|----|-------------|--------|----------|
| FR23 | Allow student to view and edit academic details: name, branch, CGPA, backlogs, 12th percentage | Profile | Must |
| FR24 | Allow student to add, edit, and remove skill tags from their profile | Profile | Must |
| FR25 | Allow student to upload a resume (PDF, ≤ 2 MB); store with metadata; display filename and upload date; allow deletion | Profile | Must |
| FR26 | Allow student to set and update job preferences: preferred roles, preferred locations, work type (on-site/hybrid/remote) | Profile | Should |

---

### 7.9 TPO Admin Module (Placement Cell Management)

| ID | Description | Module | Priority |
|----|-------------|--------|----------|
| FR27 | Allow TPO Admin to create a new company placement drive with customized eligibility cutoffs (min CGPA, max backlogs, eligible branches, 10th/12th percentages, CTC, deadline, and selection rounds) | Admin | Must |
| FR28 | Allow TPO Admin to edit drive details, update registration deadlines, and archive/delete inactive drives | Admin | Must |
| FR29 | Provide an Applicant Review Roster displaying all students who opted into a drive, their academic metrics, attached resume, and current recruitment stage | Admin | Must |
| FR30 | Allow TPO Admin to update candidate recruitment stages individually (Applied → Shortlisted → Assessment → Interview → Selected / Rejected) | Admin | Must |
| FR31 | Provide a 1-click **Bulk Auto-Shortlist** action that evaluates all applicants against published criteria using the eligibility engine and transitions all passing students to Shortlisted | Admin | Must |
| FR32 | Provide a Placement Analytics Dashboard tracking total drives, overall student placement %, branch-wise placement breakdown, and average vs. highest CTC | Admin | Must |
| FR33 | Provide a TopBar Role Switcher allowing seamless toggling between **Student View** (Aarav Mehta) and **TPO Admin View** (Placement Cell) | Navigation | Must |
| FR34 | Persist all entities in a relational database schema via Prisma ORM with SQLite for zero-config local run and PostgreSQL for AWS RDS | Backend | Must |
| FR35 | Provide a RESTful compute API server powered by Node.js and Express with Zod request validation and comprehensive error handling | Backend | Must |

---

## 8. Non-Functional Requirements

| ID | Category | Requirement | Target |
|----|----------|-------------|--------|
| NFR1 | Accessibility | All interactive elements must be keyboard-operable; focus order must be logical and visible | WCAG 2.1 AA |
| NFR2 | Accessibility | Colour contrast ratio ≥ 4.5:1 for normal text, ≥ 3:1 for large text and UI components | WCAG 2.1 AA |
| NFR3 | Accessibility | All images and icons must have appropriate alt text or `aria-label`; decorative images must use `alt=""` | WCAG 2.1 AA |
| NFR4 | Performance | First Contentful Paint on throttled 4G connection (10 Mbps down, 1 Mbps up) | ≤ 1 second |
| NFR5 | Performance | Total JavaScript bundle size (gzipped) | ≤ 200 KB |
| NFR6 | Responsiveness | Application must be fully functional and readable at viewport widths from 320 px to 1920 px | All breakpoints |
| NFR7 | Backend Latency | REST API response times for queries and stage transitions under normal campus load | ≤ 200 ms p95 |
| NFR8 | Data Integrity | Relational database constraints and foreign keys enforce cascade deletions and prevent duplicate applications | 100% ACID |
| NFR9 | Resilience | Frontend includes resilient offline caching layer that falls back seamlessly if the backend is momentarily unreachable | 100% Uptime |
| NFR10 | Usability | System Usability Scale (SUS) score across all personas | ≥ 68 |

---

## 9. User Journey Map

### Stage 1 — Discover

> *The student opens CareerFlow for the first time (or returns after setup).*

Aarav opens the portal and is greeted by the **Dashboard**. His readiness score of 62/100 is shown prominently — not high enough to feel confident, but a clear signal that there's work to do. The deadlines widget shows two companies closing applications in three days. Quick-links guide him to the Job Opportunities module. He filters by branch (CS), sorts by deadline, and sees twelve eligible companies highlighted in teal. An ineligible company appears greyed out with a red "Ineligible" badge — he understands immediately without clicking in.

---

### Stage 2 — Prepare

> *The student identifies gaps and works to close them before applying.*

Meera navigates to the **Eligibility Checker** and selects a semiconductor firm. The pass/fail table reveals she passes CGPA and branch criteria but fails on a required skill: "SystemVerilog." The skills gap panel lists it clearly. She pivots to the **Preparation Hub**, marks "SystemVerilog" as a DSA/tech topic to learn, and finds a curated resource link. She also opens the Resume Checklist and ticks off eight of twelve items, bringing her resume score to 67%. She books a mock interview slot for the following weekend.

---

### Stage 3 — Apply

> *The student applies to a shortlisted role.*

Rohit has found a core mechanical role. He clicks **Apply** on the job card. CareerFlow runs the eligibility engine instantly — his 12th score (78%) exceeds the 75% cut-off, his CGPA clears the 6.5 threshold, and he has zero backlogs. A green "Eligible" banner appears. The Apply confirmation dialog opens, showing the role summary and a dropdown to pick his uploaded resume. He confirms and the application is created. A success toast notification appears: *"Application submitted for Tata Motors — Manufacturing Engineer."* The Dashboard counter for active applications increments to 3.

---

### Stage 4 — Succeed

> *The student tracks progress and moves toward a placement offer.*

All three personas now check the **Application Tracker** regularly. Aarav sees his Accenture application advance from "Applied" to "Shortlisted." Meera's NXP application moves to "Assessment." Rohit's Tata Motors application reaches "Interview." When an application reaches "Selected," the card glows teal and the readiness score widget is replaced by a congratulations callout. The student's journey is complete — from confusion and fragmented tools to a single, clear placement confirmation.

---

## 10. Assumptions & Constraints

| # | Type | Statement |
|---|------|-----------|
| A1 | Assumption | Students have access to a modern browser on a device with at least 100 MB of free localStorage quota |
| A2 | Assumption | Mock/seed data is sufficient for demonstration; no live recruiter data feed is required in v1.0 |
| A3 | Assumption | Students will manually enter their academic details; no integration with college ERP is available |
| A4 | Assumption | A PDF ≤ 2 MB can be safely base64-encoded and stored in localStorage without hitting storage limits |
| A5 | Constraint | No backend, no REST API, no database — all persistence is `localStorage` only |
| A6 | Constraint | No authentication; the application is single-user per browser profile |
| A7 | Constraint | The application must be deployable as a static site (GitHub Pages, Netlify, Vercel) |
| A8 | Constraint | All development dependencies must be open-source with permissive licences (MIT/Apache 2.0) |
| A9 | Constraint | The product must work offline after the initial page load (assets cached by browser) |

---

## 11. Open Questions

| # | Question | Owner | Status |
|---|----------|-------|--------|
| OQ1 | Should the readiness score algorithm be configurable by the placement officer, or is a fixed formula sufficient for v1.0? | Product | Open |
| OQ2 | What is the maximum number of job listings the mock data should contain to remain realistic without straining localStorage? | Engineering | Open |
| OQ3 | Should saved/bookmarked jobs be shareable (e.g., via URL hash) in a future version? | Product | Deferred |
| OQ4 | Is a "dark mode" toggle required in v1.0 or can it be deferred? | Design | Deferred |
| OQ5 | What is the exact formula for "readiness score" — equal weights across profile, prep, and applications, or weighted? | Product | Open |
| OQ6 | Should the mock interview slot booking send any in-browser reminder (e.g., Notification API)? | Engineering | Open |
| OQ7 | Are there any accessibility requirements beyond WCAG 2.1 AA (e.g., WCAG 2.2, EN 301 549)? | QA | Open |

---

*End of PRD v1.0*
