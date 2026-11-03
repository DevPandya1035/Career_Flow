# CareerFlow — Project Memory

> This file is the single source of truth for every AI agent and developer working on this project.
> Update it as decisions are made, phases complete, and context evolves.
> **Last updated:** 2026-11-03

---

## What This Project Is

**CareerFlow** is a student-facing campus placement and career management portal.
Tagline: *"Your Career. Your Journey. Your Future."*

It is a **fully client-side, responsive web application** (React + TypeScript + Tailwind + Vite) with mock data for ten companies and no backend. All state is persisted in `localStorage` via Zustand middleware.

The design follows ISO 9241-210 Human-Centred Design and applies HCI principles from the course report authored by Dev Rahulkumar Pandya (Roll 43) and Satyam Singh (Roll 36).

---

## Core Journey

```
Discover → Prepare → Apply → Succeed
```

Each step maps to one or more modules.

---

## Six Modules

| Module | Route | Purpose |
|---|---|---|
| Dashboard | `/` | Readiness score, deadlines, stage counts, recommended jobs |
| Job Opportunities | `/jobs` | Search, filter, sort, eligibility badge, apply flow |
| Application Tracker | `/tracker` | Five-stage pipeline with demo advance |
| Eligibility Checker | `/eligibility` | What-if CGPA/skills vs. company criteria |
| Preparation Hub | `/prep` | DSA tracker, aptitude, resume checklist, mock interviews |
| Student Profile | `/profile` | Academic details, skills, resumes, preferences |

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
| No backend | localStorage only | HCI course prototype scope; eliminates server complexity |
| Zustand over Redux | Zustand | Less boilerplate, built-in persist middleware |
| Tailwind over CSS modules | Tailwind | Design token discipline, responsive utilities |
| Vite over CRA | Vite | Faster dev server, smaller production bundle |
| Named exports only | Named exports | Better tree-shaking, easier refactoring |
| checkEligibility as pure function | Pure function in `src/lib/eligibility.ts` | Easily unit-tested, no side effects |
| Readiness score formula | DSA 40% + Aptitude 20% + Checklist 25% + Profile 15% | Weighted to reflect placement importance |

---

## Personas

| Name | Branch | CGPA | Key Need |
|---|---|---|---|
| Aarav Mehta, 21 | CS | 8.4 | Eligibility at a glance, DSA tracker, readiness score |
| Meera Nair, 21 | ECE | 7.8 | Branch-aware eligibility, skill gap view |
| Rohit Sharma, 22 | ME | 6.2 | 12th score eligibility, aptitude prep, status clarity |

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
| P0 | Docs, types, mock data, project scaffold | 🟡 In Progress |
| P1 | App shell (Sidebar, TopBar, routing, Zustand) | ⬜ Pending |
| P2 | Dashboard module | ⬜ Pending |
| P3 | Job Opportunities module | ⬜ Pending |
| P4 | Application Tracker module | ⬜ Pending |
| P5 | Eligibility Checker module | ⬜ Pending |
| P6 | Preparation Hub module | ⬜ Pending |
| P7 | Student Profile module | ⬜ Pending |
| P8 | Polish: accessibility, responsive, performance | ⬜ Pending |
| P9 | Testing: unit + component + a11y | ⬜ Pending |

---

## Invariants (Must Never Change Without Updating This File)

1. **No backend calls.** The app must work 100% offline.
2. **checkEligibility is a pure function.** Never read from store inside it.
3. **Design tokens are the only source for colors.** No hardcoded hex in components.
4. **All interactive elements are keyboard-accessible.** No exceptions.
5. **Modal dialogs trap focus.** ESC always closes.
6. **Apply is blocked when ineligible.** Button disabled + reason tooltip shown.
7. **Confirmation checkbox must be ticked** before Apply submits.
8. **No duplicate applications** to the same job.

---

## Open Questions

- [ ] Should the Preparation Hub's aptitude quiz be fully interactive or a placeholder?
- [ ] Should mock interviews show a real calendar widget (e.g., react-big-calendar) or a simple slot list?
- [ ] Should the Dashboard's recommended jobs strip be driven by branch/role preference matching?
- [ ] Should there be a "Demo Mode" toggle that resets localStorage to default state?

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

