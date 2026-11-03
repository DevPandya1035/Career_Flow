# CareerFlow — Project Memory

> This file is the single source of truth for every AI agent and developer working on this project.
> Update it as decisions are made, phases complete, and context evolves.
> **Last updated:** 2026-11-03

---

## What This Project Is

**CareerFlow** is an enterprise-grade campus placement and career management portal.
Tagline: *"Your Career. Your Journey. Your Future."*

It is a **full-stack application** featuring:
- **Frontend SPA:** React 18 + TypeScript + Tailwind CSS + Vite + Zustand.
- **Backend Compute:** Node.js + Express REST API server with Zod validation.
- **Database & Persistence:** Prisma ORM with SQLite for zero-config local development (`prisma/dev.db`) and PostgreSQL (Amazon RDS) for production.
- **Two-Sided Portals:**
  - **Student Portal:** Discover verified jobs, check algorithmic eligibility, opt in (apply) with tailored resumes, simulate future improvements, and prepare across DSA, aptitude, and mocks.
  - **TPO Admin Portal:** Campus placement officers publish company placement drives with customized cutoffs, review student applicants, perform 1-click **Bulk Auto-Shortlisting**, advance interview stages, and view placement analytics.
- **AWS Cloud Architecture:** AWS App Runner / ECS Fargate container for compute + Amazon RDS for PostgreSQL + S3 & CloudFront for static assets.

---

## Portals & Modules

| Portal | Module | Route | Purpose |
|---|---|---|---|
| Student | Dashboard | `/` | Readiness score, deadlines, stage counts, recommended jobs |
| Student | Job Opportunities | `/jobs` | Search, filter, sort, eligibility badge, apply/opt-in flow |
| Student | Application Tracker | `/tracker` | Five-stage pipeline with demo advance & offer acceptance |
| Student | Eligibility Checker | `/eligibility` | What-if CGPA/skills vs. company criteria simulator |
| Student | Preparation Hub | `/prep` | DSA tracker, aptitude, resume checklist, mock interviews |
| Student | Student Profile | `/profile` | Academic details, skills, resumes, preferences |
| Admin | Admin Dashboard | `/admin` | Placement analytics, branch placement stats, avg CTC |
| Admin | Drive Manager | `/admin/drives` | Create & publish company drives with custom eligibility cutoffs |
| Admin | Applicant Review | `/admin/applicants` | Review candidate rosters, bulk auto-shortlist, stage progression |

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React 18 | Hooks, concurrent features, ecosystem |
| Language | TypeScript 5 (strict) | Type safety for eligibility logic |
| Build | Vite 5 | Fast HMR, small bundles |
| Styling | Tailwind CSS 3 | Utility-first, design token discipline |
| Routing | React Router v6 | File-tree-like routing |
| State | Zustand + immer | Minimal boilerplate, localStorage persist |
| Icons | lucide-react | Consistent, accessible SVG icons |
| Date handling | date-fns | Lightweight, tree-shakeable |
| Testing | Vitest + RTL | Co-located tests, fast feedback |

---

## Design Tokens (Source of Truth)

```
Navy Sidebar    #0F2044
Primary Blue    #2563EB   (hover: #1D4ED8)
Teal Success    #0D9488
Error Red       #EF4444
Text Primary    #0F172A
Text Secondary  #475569
Page BG         #F8FAFC
Card BG         #FFFFFF
Border          #E2E8F0

Font: Inter
Base size: 16px / 1rem
Scale: 12, 14, 16, 18, 24, 32px
```

---

## Key Decisions Made

| Decision | Choice | Rationale |
|---|---|---|
| Unified TypeScript Stack | Node.js + Express + Prisma + React | Single language across frontend, backend, and ORM schema |
| Prisma ORM (SQLite / PostgreSQL) | SQLite for local dev, PostgreSQL for RDS | Zero configuration needed for local run (`prisma/dev.db`), seamless migration to Amazon RDS |
| Pure Eligibility Engine | `src/lib/eligibility.ts` shared | Same pure evaluation rules executed synchronously on client and backend |
| 1-Click Bulk Auto-Shortlist | Atomic batch processing | Eliminates manual screening overhead for TPO officers, evaluated against published cutoffs |
| Zustand over Redux | Zustand | Less boilerplate, built-in persist middleware |
| Tailwind over CSS modules | Tailwind | Design token discipline, responsive utilities |
| Vite over CRA | Vite | Faster dev server, smaller production bundle |
| Named exports only | Named exports | Better tree-shaking, easier refactoring |
| Readiness score formula | DSA 40% + Aptitude 20% + Checklist 25% + Profile 15% | Weighted to reflect placement importance |

---

## Personas

| Name | Branch | CGPA | Key Need |
|---|---|---|---|
| Aarav Mehta, 21 | CS | 8.4 | Eligibility at a glance, DSA tracker, readiness score |
| Meera Nair, 21 | ECE | 7.8 | Branch-aware eligibility, skill gap view |
| Rohit Sharma, 22 | ME | 6.2 | 12th score eligibility, aptitude prep, status clarity |
| Dr. R. K. Verma, 52 | TPO Head | — | Publish placement drives, specify criteria cutoffs, bulk auto-shortlist applicants |

**Default mock student:** Aarav Mehta, CS, CGPA 8.4, 10th 92%, 12th 88%, 0 backlogs, skills: React, Python, DSA, SQL

---

## Mock Companies (10)

| Company | Role | CGPA Min | Branches | CTC (LPA) | Deadline |
|---|---|---|---|---|---|
| Google | SWE | 8.5 | CS, IT | 45 | 2026-12-01 |
| Microsoft | SWE | 7.5 | CS, IT, ECE | 35 | 2026-12-10 |
| Amazon | SWE | 7.0 | CS, IT, ECE | 30 | 2026-12-05 |
| Adobe | SWE | 8.0 | CS, IT | 28 | 2026-12-15 |
| Flipkart | SWE | 6.5 | All | 22 | 2026-11-30 |
| Goldman Sachs | Finance Analyst | 8.5 | All | 40 | 2026-11-25 |
| JP Morgan | Business Analyst | 7.0 | All | 25 | 2026-12-08 |
| Deloitte | Consultant | 6.0 | All | 18 | 2026-12-20 |
| Mahindra | Core Engineer | 6.0 | ME, CE, EE | 12 | 2026-12-12 |
| Infosys | SWE | 6.0 | All | 8 | 2026-11-28 |

**Aarav (CGPA 8.4) is ineligible for:** Google (8.5 min) and Goldman Sachs (8.5 min) — this is the demo scenario.

---

## Project Phases

| Phase | Scope | Status |
|---|---|---|
| P0 | Docs, types, mock data, project scaffold | 🟢 Complete |
| P1 | App shell (Sidebar, TopBar, routing, Zustand) | 🟢 Complete |
| P2 | Dashboard module | 🟢 Complete |
| P3 | Job Opportunities module | 🟢 Complete |
| P4 | Application Tracker module | 🟢 Complete |
| P5 | Eligibility Checker module | 🟢 Complete |
| P6 | Preparation Hub module | 🟢 Complete |
| P7 | Student Profile module | 🟢 Complete |
| P8 | Polish: accessibility, responsive, performance | 🟢 Complete |
| P9 | Testing: unit + component + a11y + production build | 🟢 Complete |
| P10 | Backend Compute & Database (Node.js, Express, Prisma, SQLite/PostgreSQL) | 🟢 Complete |
| P11 | REST API Endpoints (Jobs, Student, Applications, Prep, TPO Admin) | 🟢 Complete |
| P12 | TPO Admin Portal (Drive Creator, Applicant Review, 1-Click Bulk Shortlist) | 🟢 Complete |
| P13 | Full-Stack Verification (106 tests, production build, AWS-ready topology) | 🟢 Complete |

---

## Invariants (Must Never Change Without Updating This File)

1. **Full-stack with offline resilience.** The app connects to the Express REST API and seamlessly falls back to client memory/localStorage when offline.
2. **checkEligibility is a pure function.** Never read from store or database inside it; takes `(student, job)` and returns `{ isEligible, pass, fail }`.
3. **Design tokens are the only source for colors.** No hardcoded hex in components.
4. **All interactive elements are keyboard-accessible.** No exceptions (WCAG 2.1 AA).
5. **Modal dialogs trap focus.** ESC always closes.
6. **Apply is blocked when ineligible.** Button disabled + reason tooltip shown.
7. **Confirmation checkbox must be ticked** before Apply submits.
8. **No duplicate applications** to the same job (guarded both client-side and server-side with 409 Conflict).
9. **Two-sided security & integrity.** TPO Admin can publish drives, modify cutoffs, and bulk auto-shortlist; students cannot self-shortlist.

---

## Open Questions

- [x] Should the Preparation Hub's aptitude quiz be fully interactive or a placeholder? -> Fully interactive 3-question quiz with instant score and readiness contribution.
- [x] Should mock interviews show a real calendar widget or a simple slot list? -> Accessible interactive slot booking cards with alumni mentors.
- [x] Should the Dashboard's recommended jobs strip be driven by branch/role preference matching? -> Driven by `eligibleJobs` filtering.
- [x] Should there be a "Demo Mode" toggle that resets localStorage to default state? -> Reset action available via store / dev menu.

---

## Documentation Index

| Document | Path | Purpose |
|---|---|---|
| Memory (this file) | `docs/memory/Memory.md` | Single source of truth, updated as project evolves |
| PRD | `docs/prd/PRD.md` | Product requirements, personas, FR/NFR |
| TRD | `docs/trd/TRD.md` | Technical requirements, types, stack |
| UI/UX Design Brief | `docs/ux/UI-UX-Design-Brief.md` | Design tokens, component specs, interactions |
| App Flow | `docs/ux/App-Flow.md` | User flows, state transitions, edge cases |
| Architecture | `docs/architecture/Architecture.md` | File structure, data flow, build pipeline |
| Schema | `docs/schema/Schema.md` | Types, mock data, localStorage schema |
| Rules | `docs/rules/Rules.md` | Code conventions, testing rules, checklist |
| Implementation Plan | `docs/superpowers/plans/2026-11-03-careerflow.md` | Phase-by-phase task list |

---

## How to Update This File

After every meaningful decision or phase completion:
1. Update the **Phase** status table
2. Add a row to **Key Decisions Made** if a new architectural choice was made
3. Update **Open Questions** (check off resolved items, add new ones)
4. Update **Last updated** date at the top

This file is read by AI agents at the start of every session. Keep it dense and accurate.

