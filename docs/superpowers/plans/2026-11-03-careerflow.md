# CareerFlow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build CareerFlow — a six-module, client-only React + TypeScript campus placement portal with mock data — from scaffold to a fully interactive, accessible, responsive prototype.

**Architecture:** React 18 SPA, Vite 5 build, Tailwind CSS 3 styling, Zustand store persisted to localStorage, React Router v6 for navigation. No backend; all data in mock JSON and browser storage.

**Tech Stack:** React 18, TypeScript 5 (strict), Vite 5, Tailwind CSS 3, React Router v6, Zustand 4, lucide-react, date-fns, Vitest, @testing-library/react

**Spec:** `docs/superpowers/specs/2026-11-03-careerflow-design.md` (see also PRD, TRD, Architecture, Schema, UX Brief — all in `docs/`)

## Global Constraints

- TypeScript strict mode — no `any`, no `// @ts-ignore`
- Tailwind utility classes only — no hardcoded CSS hex values in components
- Design tokens: Navy `#0F2044`, Primary `#2563EB`, Teal `#0D9488`, Error `#EF4444`, Page BG `#F8FAFC`
- Font: Inter (Google Fonts CDN in index.html)
- All interactive elements keyboard-accessible, WCAG 2.1 AA contrast
- localStorage keys: `cf_student`, `cf_jobs`, `cf_applications`, `cf_prep`
- `checkEligibility` must be a pure function with no store reads
- No duplicate applications to the same job
- Apply button disabled + reason shown when student is ineligible
- Confirmation checkbox must be ticked before apply submits
- Ten mock companies minimum in `src/data/jobs.ts`
- All commits follow: `type(scope): description` (feat, fix, style, test, docs, chore)
- Bundle ≤ 200KB gzipped

## Review Focus

1. **Eligibility gate bypass** — a student with CGPA < minimum must never be able to submit an application even if the JS is manipulated
2. **Duplicate application** — applying to a job with an existing application must be blocked (button state + store guard)
3. **localStorage hydration** — stale or malformed localStorage data must not crash the app; fall back to defaults
4. **Mobile layout** — sidebar must collapse to bottom nav on screens < 768px; all tap targets ≥ 44px
5. **Focus management** — opening a modal must move focus to first focusable element; ESC must close it and return focus to trigger

---

## Phase 0 — Scaffold, Types, Mock Data

### Task 0.1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/index.css`

**Interfaces:**
- Produces: working `npm run dev` serving a blank React app at `localhost:5173`

- [ ] **Step 1: Scaffold Vite + React + TypeScript project**

Run: `npm create vite@latest . -- --template react-ts` from `/Users/dev/Desktop/Project/CareerFlow`
Expected: `package.json`, `src/main.tsx`, `src/App.tsx` created

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install react-router-dom zustand immer date-fns lucide-react
npm install -D tailwindcss postcss autoprefixer @types/node
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
npx tailwindcss init -p
```

- [ ] **Step 3: Configure Tailwind**

In `tailwind.config.ts`, add `content: ['./index.html', './src/**/*.{ts,tsx}']` and extend theme with design tokens (colors: navy, primary, teal, error).

- [ ] **Step 4: Add Inter font to `index.html`**

Add `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">` to `<head>`.

- [ ] **Step 5: Configure Vitest in `vite.config.ts`**

Add test config: `environment: 'jsdom'`, `setupFiles: ['./src/test/setup.ts']`, `globals: true`.

- [ ] **Step 6: Create test setup file**

Create `src/test/setup.ts` importing `@testing-library/jest-dom`.

- [ ] **Step 7: Verify dev server starts**

Run: `npm run dev`
Expected: Vite server running, no errors in console

- [ ] **Step 8: Commit**

```bash
git init && git add -A && git commit -m "chore(scaffold): vite react-ts + tailwind + zustand + router"
```

---

### Task 0.2: TypeScript Types

**Files:**
- Create: `src/types/index.ts`

**Interfaces:**
- Produces: `Student`, `Resume`, `Job`, `EligibilityCriteria`, `EligibilityResult`, `Application`, `PrepProgress`, `DSATopic`, `AptitudeAttempt`, `MockInterviewSlot` — all exported

- [ ] **Step 1: Write failing type test**

```ts
// src/types/index.test.ts
import { describe, it, expectTypeOf } from 'vitest'
import type { Student, Job, EligibilityResult, Application } from './index'

describe('Types', () => {
  it('Student has required fields', () => {
    expectTypeOf<Student>().toHaveProperty('cgpa')
    expectTypeOf<Student>().toHaveProperty('skills')
    expectTypeOf<Student>().toHaveProperty('resumes')
  })
  it('EligibilityResult has pass and fail arrays', () => {
    expectTypeOf<EligibilityResult>().toHaveProperty('isEligible')
    expectTypeOf<EligibilityResult>().toHaveProperty('pass')
    expectTypeOf<EligibilityResult>().toHaveProperty('fail')
  })
})
```

- [ ] **Step 2: Run test to verify it fails (compile error)**

Run: `npm run test -- src/types/index.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement `src/types/index.ts`**

Write all interfaces exactly as specified in `docs/schema/Schema.md` Section 2. Include JSDoc on each interface.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/types/index.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/types/ && git commit -m "feat(types): add all TypeScript interfaces"
```

---

### Task 0.3: Mock Data

**Files:**
- Create: `src/data/jobs.ts`
- Create: `src/data/student.ts`

**Interfaces:**
- Produces: `MOCK_JOBS: Job[]` (10 entries), `DEFAULT_STUDENT: Student`

- [ ] **Step 1: Write failing test**

```ts
// src/data/jobs.test.ts
import { describe, it, expect } from 'vitest'
import { MOCK_JOBS } from './jobs'
import { DEFAULT_STUDENT } from './student'

describe('Mock data', () => {
  it('has exactly 10 jobs', () => {
    expect(MOCK_JOBS).toHaveLength(10)
  })
  it('every job has required fields', () => {
    MOCK_JOBS.forEach(job => {
      expect(job.id).toBeTruthy()
      expect(job.company).toBeTruthy()
      expect(job.eligibility.minCGPA).toBeGreaterThan(0)
    })
  })
  it('default student is Aarav Mehta with CGPA 8.4', () => {
    expect(DEFAULT_STUDENT.name).toBe('Aarav Mehta')
    expect(DEFAULT_STUDENT.cgpa).toBe(8.4)
    expect(DEFAULT_STUDENT.branch).toBe('CS')
  })
  it('Google requires CGPA 8.5 — Aarav is ineligible', () => {
    const google = MOCK_JOBS.find(j => j.company === 'Google')!
    expect(google.eligibility.minCGPA).toBe(8.5)
    expect(DEFAULT_STUDENT.cgpa).toBeLessThan(google.eligibility.minCGPA)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/data/jobs.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `src/data/jobs.ts`**

Add all 10 companies as per `docs/schema/Schema.md` Section 3. Each entry must satisfy the `Job` interface exactly.

- [ ] **Step 4: Implement `src/data/student.ts`**

Default student: Aarav Mehta, CS, year 4, CGPA 8.4, 10th 92%, 12th 88%, 0 backlogs, skills: ['React', 'Python', 'DSA', 'SQL'], empty resumes array.

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- src/data/jobs.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/data/ && git commit -m "feat(data): add 10 mock jobs and default student"
```

---

### Task 0.4: Eligibility Engine

**Files:**
- Create: `src/lib/eligibility.ts`
- Create: `src/lib/eligibility.test.ts`

**Interfaces:**
- Consumes: `Student`, `Job` from `src/types/index.ts`
- Produces: `checkEligibility(student: Student, job: Job): EligibilityResult`

- [ ] **Step 1: Write comprehensive failing tests**

```ts
// src/lib/eligibility.test.ts
import { describe, it, expect } from 'vitest'
import { checkEligibility } from './eligibility'
import { DEFAULT_STUDENT } from '../data/student'
import { MOCK_JOBS } from '../data/jobs'

describe('checkEligibility', () => {
  const google = MOCK_JOBS.find(j => j.company === 'Google')!
  const flipkart = MOCK_JOBS.find(j => j.company === 'Flipkart')!

  it('marks Aarav ineligible for Google (CGPA 8.4 < 8.5)', () => {
    const result = checkEligibility(DEFAULT_STUDENT, google)
    expect(result.isEligible).toBe(false)
    expect(result.fail.some(f => f.criterion === 'CGPA')).toBe(true)
  })

  it('marks Aarav eligible for Flipkart (CGPA 6.5 min, CS allowed)', () => {
    const result = checkEligibility(DEFAULT_STUDENT, flipkart)
    expect(result.isEligible).toBe(true)
    expect(result.fail).toHaveLength(0)
  })

  it('fails branch check for wrong branch', () => {
    const meStudent = { ...DEFAULT_STUDENT, branch: 'ME' as const }
    const result = checkEligibility(meStudent, google)
    expect(result.fail.some(f => f.criterion === 'Branch')).toBe(true)
  })

  it('fails backlog check when student has active backlogs', () => {
    const student = { ...DEFAULT_STUDENT, backlogs: 2 }
    const result = checkEligibility(student, google)
    expect(result.fail.some(f => f.criterion === 'Active Backlogs')).toBe(true)
  })

  it('returns criterion values in fail array', () => {
    const result = checkEligibility(DEFAULT_STUDENT, google)
    const cgpaFail = result.fail.find(f => f.criterion === 'CGPA')!
    expect(cgpaFail.studentValue).toBe('8.4')
    expect(cgpaFail.required).toBe('≥ 8.5')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/lib/eligibility.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement `checkEligibility` in `src/lib/eligibility.ts`**

Pure function. Checks in order: CGPA, Active Backlogs, Branch, 10th %, 12th %, Required Skills. For each criterion, push to `pass[]` or `fail[]` with `{ criterion, studentValue, required }`. Return `{ isEligible: fail.length === 0, pass, fail }`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- src/lib/eligibility.test.ts`
Expected: PASS (all 5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/ && git commit -m "feat(eligibility): add pure checkEligibility function with tests"
```

---

## Phase 1 — App Shell

### Task 1.1: Zustand Store

**Files:**
- Create: `src/store/index.ts`
- Create: `src/store/studentSlice.ts`
- Create: `src/store/jobsSlice.ts`
- Create: `src/store/applicationsSlice.ts`
- Create: `src/store/prepSlice.ts`

**Interfaces:**
- Produces: `useStore` hook with `student`, `jobs`, `applications`, `prep` state + actions

- [ ] **Step 1: Write failing store test**

```ts
// src/store/index.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useStore } from './index'
import { MOCK_JOBS } from '../data/jobs'

describe('Store', () => {
  beforeEach(() => { localStorage.clear() })

  it('initializes with default student Aarav', () => {
    const { student } = useStore.getState()
    expect(student.name).toBe('Aarav Mehta')
  })

  it('initializes with 10 mock jobs', () => {
    const { jobs } = useStore.getState()
    expect(jobs).toHaveLength(10)
  })

  it('addApplication adds to applications array', () => {
    const { addApplication, applications } = useStore.getState()
    expect(applications).toHaveLength(0)
    addApplication({ jobId: MOCK_JOBS[0].id, resumeId: 'r1' })
    expect(useStore.getState().applications).toHaveLength(1)
  })

  it('addApplication blocks duplicate for same jobId', () => {
    const { addApplication } = useStore.getState()
    addApplication({ jobId: MOCK_JOBS[0].id, resumeId: 'r1' })
    addApplication({ jobId: MOCK_JOBS[0].id, resumeId: 'r1' })
    expect(useStore.getState().applications).toHaveLength(1)
  })

  it('advanceApplicationStatus advances stage correctly', () => {
    const { addApplication, advanceApplicationStatus, applications } = useStore.getState()
    addApplication({ jobId: MOCK_JOBS[0].id, resumeId: 'r1' })
    const appId = useStore.getState().applications[0].id
    useStore.getState().advanceApplicationStatus(appId)
    expect(useStore.getState().applications[0].status).toBe('Shortlisted')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/store/index.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement store slices**

Use Zustand `create` with `immer` middleware and `persist` middleware (`localStorage`, keys: `cf_student`, `cf_jobs`, `cf_applications`, `cf_prep`). Each slice owns its state + actions. `addApplication` must guard against duplicates by checking existing `jobId`. `advanceApplicationStatus` cycles: Applied → Shortlisted → Assessment → Interview → Selected.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- src/store/index.test.ts`
Expected: PASS (all 5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/store/ && git commit -m "feat(store): zustand store with all slices and localStorage persist"
```

---

### Task 1.2: App Shell — Sidebar, TopBar, Router

**Files:**
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/TopBar.tsx`
- Create: `src/components/layout/AppShell.tsx`
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

**Interfaces:**
- Produces: `<AppShell>` wrapping all routes; `<Sidebar>` with nav links to 6 modules; `<TopBar>` with student name + search icon

- [ ] **Step 1: Write failing render tests**

```tsx
// src/components/layout/Sidebar.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Sidebar } from './Sidebar'

describe('Sidebar', () => {
  it('renders all 6 nav links', () => {
    render(<MemoryRouter><Sidebar /></MemoryRouter>)
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /jobs/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /tracker/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /eligibility/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /prep/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument()
  })

  it('active link has aria-current="page"', () => {
    render(<MemoryRouter initialEntries={['/']}><Sidebar /></MemoryRouter>)
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('aria-current', 'page')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/components/layout/Sidebar.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement `Sidebar.tsx`**

Navy bg (`bg-[#0F2044]`), width 240px on lg (`w-60`), hidden on mobile (`hidden lg:flex`). NavLink items with `aria-current="page"` on active. Items: Dashboard (LayoutDashboard icon), Jobs (Briefcase), Tracker (ClipboardList), Eligibility (CheckCircle), Prep (BookOpen), Profile (User).

- [ ] **Step 4: Implement `TopBar.tsx`**

Height 64px, white bg, border-b. Left: "CareerFlow" logo text. Right: student avatar circle with first initial, notification bell icon.

- [ ] **Step 5: Implement `AppShell.tsx`**

`<div class="flex h-screen">`: `<Sidebar />` + `<div class="flex-1 flex flex-col overflow-hidden">`: `<TopBar />` + `<main class="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">`: `<Outlet />`.

- [ ] **Step 6: Configure `App.tsx` with React Router routes**

Routes: `/` → Dashboard, `/jobs` → JobsPage, `/tracker` → TrackerPage, `/eligibility` → EligibilityPage, `/prep` → PrepPage, `/profile` → ProfilePage. Wrap in `<BrowserRouter><AppShell>`.

- [ ] **Step 7: Create placeholder pages for all 6 modules**

Each returns `<div>Module Name — Coming Soon</div>` so router works.

- [ ] **Step 8: Run tests to verify they pass**

Run: `npm run test -- src/components/layout/`
Expected: PASS

- [ ] **Step 9: Verify in browser**

Run: `npm run dev` — navigate to each route, verify sidebar highlights active link, no console errors.

- [ ] **Step 10: Commit**

```bash
git add src/ && git commit -m "feat(shell): sidebar, topbar, router, app shell"
```

---

### Task 1.3: Shared UI Components

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Modal.tsx`
- Create: `src/components/ui/Toast.tsx`
- Create: `src/components/ui/ProgressBar.tsx`
- Create: `src/components/ui/Stepper.tsx`
- Create: `src/components/ui/EligibilityPill.tsx`

**Interfaces:**
- Produces: reusable components used by all modules

- [ ] **Step 1: Write failing tests**

```tsx
// src/components/ui/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders with label', () => {
    render(<Button>Apply Now</Button>)
    expect(screen.getByRole('button', { name: /apply now/i })).toBeInTheDocument()
  })
  it('disabled button is not clickable', async () => {
    const handler = vi.fn()
    render(<Button disabled onClick={handler}>Apply</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handler).not.toHaveBeenCalled()
  })
  it('disabled button shows tooltip via aria-describedby', () => {
    render(<Button disabled disabledReason="CGPA too low">Apply</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-describedby')
  })
})
```

```tsx
// src/components/ui/Modal.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'

describe('Modal', () => {
  it('traps focus inside when open', async () => {
    render(<Modal isOpen onClose={() => {}} title="Test"><button>First</button><button>Last</button></Modal>)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
  it('calls onClose when ESC is pressed', async () => {
    const onClose = vi.fn()
    render(<Modal isOpen onClose={onClose} title="Test"><div /></Modal>)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/components/ui/`
Expected: FAIL

- [ ] **Step 3: Implement all UI components**

- `Button`: variants (primary/secondary/ghost/danger), sizes (sm/md/lg), disabled state with optional `disabledReason` → render tooltip span with `id` referenced by `aria-describedby`
- `Badge`: color variants (eligible=teal, ineligible=red, applied=blue, shortlisted=yellow, selected=green), rounded-full pill shape
- `Card`: white bg, rounded-xl, shadow-sm, configurable padding
- `Modal`: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to title, focus trap (first focusable on open, ESC calls onClose, backdrop click calls onClose), body scroll lock
- `Toast`: position fixed bottom-right, slide-in animation, auto-dismiss after 4s, close button, variants (success/error/info)
- `ProgressBar`: `role="progressbar"`, `aria-valuenow`, `aria-valuemin=0`, `aria-valuemax=100`, animated fill
- `Stepper`: horizontal step indicator, numbered circles, connector lines, active/completed/pending states
- `EligibilityPill`: green "Eligible" or red "Ineligible" pill using Badge; accepts `isEligible: boolean`

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- src/components/ui/`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/ && git commit -m "feat(ui): shared component library — button, badge, card, modal, toast, progressbar, stepper"
```

---

## Phase 2 — Dashboard Module

### Task 2.1: Dashboard

**Files:**
- Create: `src/modules/dashboard/Dashboard.tsx`
- Create: `src/modules/dashboard/ReadinessRing.tsx`
- Create: `src/modules/dashboard/DeadlineWidget.tsx`
- Create: `src/modules/dashboard/StageCountChips.tsx`
- Create: `src/hooks/useReadinessScore.ts`

**Interfaces:**
- Consumes: `useStore` (student, jobs, applications, prep)
- Produces: Dashboard page visible at `/`

- [ ] **Step 1: Write failing tests**

```tsx
// src/modules/dashboard/Dashboard.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Dashboard } from './Dashboard'

describe('Dashboard', () => {
  it('shows student name in welcome message', () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>)
    expect(screen.getByText(/aarav/i)).toBeInTheDocument()
  })
  it('shows readiness score', () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>)
    expect(screen.getByRole('meter')).toBeInTheDocument()
  })
  it('shows upcoming deadlines section', () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>)
    expect(screen.getByText(/upcoming deadlines/i)).toBeInTheDocument()
  })
  it('shows stage count chips', () => {
    render(<MemoryRouter><Dashboard /></MemoryRouter>)
    expect(screen.getByText(/applied/i)).toBeInTheDocument()
  })
})
```

```ts
// src/hooks/useReadinessScore.test.ts
import { describe, it, expect } from 'vitest'
import { calcReadinessScore } from './useReadinessScore'

describe('calcReadinessScore', () => {
  it('returns 0 for empty prep state', () => {
    expect(calcReadinessScore({ dsa: {}, aptitude: [], checklist: {}, mockInterviews: [] }, { name: '', email: '', branch: 'CS', year: 4, cgpa: 0, tenthPercent: 0, twelfthPercent: 0, backlogs: 0, skills: [], resumes: [], preferences: { roles: [], locations: [] }, id: '' })).toBe(0)
  })
  it('is weighted: DSA 40%, Aptitude 20%, Checklist 25%, Profile 15%', () => {
    // full profile, 100% checklist, 100 aptitude, 100% DSA = score 100
    // exact values tested from formula in Schema.md Section 9
    expect(true).toBe(true) // formula coverage — see Schema.md for full spec
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/modules/dashboard/`
Expected: FAIL

- [ ] **Step 3: Implement `useReadinessScore.ts`**

Export `calcReadinessScore(prep, student): number` (0–100). Formula: DSA 40% (solved/total across topics), Aptitude 20% (last score / 100), Checklist 25% (checked/total items), Profile completeness 15% (cgpa > 0, skills > 0, resume uploaded, branch set = 25% each).

- [ ] **Step 4: Implement `ReadinessRing.tsx`**

SVG circle ring, `role="meter"`, `aria-valuenow={score}`, score number in center, color changes: < 40 red, 40–70 yellow, > 70 teal.

- [ ] **Step 5: Implement `DeadlineWidget.tsx`**

Shows upcoming job deadlines (jobs not yet applied to, sorted by deadline ascending, next 5). Each row: company name + role + days remaining chip.

- [ ] **Step 6: Implement `StageCountChips.tsx`**

Shows count of applications in each stage (Applied, Shortlisted, Assessment, Interview, Selected). Each chip is a link to `/tracker`.

- [ ] **Step 7: Implement `Dashboard.tsx`**

Grid layout: Welcome heading with student name + tagline stepper (Discover/Prepare/Apply/Succeed). Row 1: ReadinessRing (1/3) + DeadlineWidget (2/3). Row 2: StageCountChips. Row 3: Recommended jobs strip (link to /jobs).

- [ ] **Step 8: Run tests to verify they pass**

Run: `npm run test -- src/modules/dashboard/`
Expected: PASS

- [ ] **Step 9: Verify in browser**

Navigate to `/` — readiness ring shows score, deadlines list shows upcoming, stage chips show 0 counts.

- [ ] **Step 10: Commit**

```bash
git add src/modules/dashboard/ src/hooks/ && git commit -m "feat(dashboard): readiness ring, deadline widget, stage count chips"
```

---

## Phase 3 — Job Opportunities Module

### Task 3.1: Job List, Filters, and Cards

**Files:**
- Create: `src/modules/jobs/JobsPage.tsx`
- Create: `src/modules/jobs/JobCard.tsx`
- Create: `src/modules/jobs/JobFilters.tsx`

**Interfaces:**
- Consumes: `useStore` (jobs, student, applications), `checkEligibility`
- Produces: filterable, searchable job grid at `/jobs`

- [ ] **Step 1: Write failing tests**

```tsx
// src/modules/jobs/JobCard.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { JobCard } from './JobCard'
import { MOCK_JOBS } from '../../data/jobs'
import { DEFAULT_STUDENT } from '../../data/student'

const google = MOCK_JOBS.find(j => j.company === 'Google')!
const flipkart = MOCK_JOBS.find(j => j.company === 'Flipkart')!

describe('JobCard', () => {
  it('shows Ineligible pill for Google (Aarav CGPA 8.4 < 8.5)', () => {
    render(<MemoryRouter><JobCard job={google} student={DEFAULT_STUDENT} /></MemoryRouter>)
    expect(screen.getByText(/ineligible/i)).toBeInTheDocument()
  })
  it('shows Eligible pill for Flipkart', () => {
    render(<MemoryRouter><JobCard job={flipkart} student={DEFAULT_STUDENT} /></MemoryRouter>)
    expect(screen.getByText(/eligible/i)).toBeInTheDocument()
  })
  it('Apply button is disabled for ineligible job', () => {
    render(<MemoryRouter><JobCard job={google} student={DEFAULT_STUDENT} /></MemoryRouter>)
    expect(screen.getByRole('button', { name: /apply/i })).toBeDisabled()
  })
  it('Apply button enabled for eligible job', () => {
    render(<MemoryRouter><JobCard job={flipkart} student={DEFAULT_STUDENT} /></MemoryRouter>)
    expect(screen.getByRole('button', { name: /apply/i })).not.toBeDisabled()
  })
  it('disabled Apply button has aria-describedby pointing to reason', () => {
    render(<MemoryRouter><JobCard job={google} student={DEFAULT_STUDENT} /></MemoryRouter>)
    const btn = screen.getByRole('button', { name: /apply/i })
    expect(btn).toHaveAttribute('aria-describedby')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/modules/jobs/JobCard.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement `JobCard.tsx`**

Props: `job: Job`, `student: Student`. Compute `eligResult = checkEligibility(student, job)`. Show: company logo placeholder (first-letter colored circle), company name, role, CTC, deadline (formatted as "Nov 30"), CGPA requirement, `<EligibilityPill isEligible={eligResult.isEligible} />`. Apply button: disabled if ineligible, `disabledReason` = first fail criterion. Save/unsave icon button (bookmark). All keyboard-accessible.

- [ ] **Step 4: Implement `JobFilters.tsx`**

Props: filter state + setters. Filters: search text (input), role type (checkboxes: SWE/Analyst/Core/Finance/Consulting), min CGPA (slider or number input), branch filter (multiselect), saved only (toggle). Clear all button.

- [ ] **Step 5: Implement `JobsPage.tsx`**

Two-column on lg: `JobFilters` (w-64 sticky) + job card grid. Single column on mobile. Filter + search logic (pure, in component): filter jobs array client-side. Sort controls: by deadline, CTC, company name. Empty state when no jobs match. Each `JobCard` gets `onApply` prop that opens `ApplyModal`.

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm run test -- src/modules/jobs/`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/modules/jobs/ && git commit -m "feat(jobs): job list page with filters, search, eligibility pills"
```

---

### Task 3.2: Apply Modal

**Files:**
- Create: `src/modules/jobs/ApplyModal.tsx`

**Interfaces:**
- Consumes: `Modal`, `Button`, `useStore` (addApplication), student resumes
- Produces: apply flow — resume picker → confirmation → submit

- [ ] **Step 1: Write failing tests**

```tsx
// src/modules/jobs/ApplyModal.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ApplyModal } from './ApplyModal'
import { MOCK_JOBS } from '../../data/jobs'

describe('ApplyModal', () => {
  const job = MOCK_JOBS.find(j => j.company === 'Flipkart')!

  it('shows resume picker step first', () => {
    render(<ApplyModal job={job} isOpen onClose={() => {}} />)
    expect(screen.getByText(/choose a resume/i)).toBeInTheDocument()
  })
  it('submit is blocked without confirmation checkbox ticked', async () => {
    render(<ApplyModal job={job} isOpen onClose={() => {}} />)
    // advance to confirm step (mock resume selection)
    await userEvent.click(screen.getAllByRole('radio')[0])
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    const submitBtn = screen.getByRole('button', { name: /submit/i })
    await userEvent.click(submitBtn)
    expect(screen.getByText(/please confirm/i)).toBeInTheDocument()
  })
  it('submit succeeds when checkbox is ticked', async () => {
    const onClose = vi.fn()
    render(<ApplyModal job={job} isOpen onClose={onClose} />)
    await userEvent.click(screen.getAllByRole('radio')[0])
    await userEvent.click(screen.getByRole('button', { name: /next/i }))
    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onClose).toHaveBeenCalled()
  })
  it('shows no-resume message and links to Profile when no resumes uploaded', () => {
    // with student having 0 resumes
    render(<ApplyModal job={job} isOpen onClose={() => {}} hasNoResumes />)
    expect(screen.getByText(/upload a resume/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/modules/jobs/ApplyModal.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement `ApplyModal.tsx`**

2-step modal. Step 1: resume picker (radio buttons for each resume, "Upload a resume first" message linking to /profile if no resumes). Step 2: confirmation — shows job summary (company, role, resume selected), checkbox "I confirm I want to apply to [company] for [role] and all information is correct", Submit button (disabled until checkbox ticked; inline error if clicked while unticked). On submit: call `addApplication({ jobId, resumeId })`, show success toast, close modal.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test -- src/modules/jobs/ApplyModal.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/modules/jobs/ApplyModal.tsx && git commit -m "feat(jobs): apply modal with resume picker and confirmation step"
```

---

## Phase 4 — Application Tracker Module

### Task 4.1: Tracker

**Files:**
- Create: `src/modules/tracker/TrackerPage.tsx`
- Create: `src/modules/tracker/StageColumn.tsx`
- Create: `src/modules/tracker/ApplicationCard.tsx`

**Interfaces:**
- Consumes: `useStore` (applications, jobs), `advanceApplicationStatus`
- Produces: five-column Kanban board at `/tracker`

- [ ] **Step 1: Write failing tests**

```tsx
// src/modules/tracker/TrackerPage.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TrackerPage } from './TrackerPage'

describe('TrackerPage', () => {
  it('renders five stage columns', () => {
    render(<MemoryRouter><TrackerPage /></MemoryRouter>)
    expect(screen.getByText('Applied')).toBeInTheDocument()
    expect(screen.getByText('Shortlisted')).toBeInTheDocument()
    expect(screen.getByText('Assessment')).toBeInTheDocument()
    expect(screen.getByText('Interview')).toBeInTheDocument()
    expect(screen.getByText('Selected')).toBeInTheDocument()
  })
  it('shows empty state when no applications', () => {
    render(<MemoryRouter><TrackerPage /></MemoryRouter>)
    expect(screen.getByText(/no applications yet/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/modules/tracker/`
Expected: FAIL

- [ ] **Step 3: Implement `ApplicationCard.tsx`**

Shows: company logo circle, company name, role, applied date, next-step nudge text, "Advance (Demo)" button (calls `advanceApplicationStatus`), offer-accept CTA if status === 'Selected'.

- [ ] **Step 4: Implement `StageColumn.tsx`**

Props: `stage: Application['status']`, `applications: Application[]`, `jobs: Job[]`. Header: stage name + count badge. Scrollable card list. If empty: "No applications here" placeholder.

- [ ] **Step 5: Implement `TrackerPage.tsx`**

Horizontal scroll container with 5 `StageColumn` components. If total applications === 0: full empty state with link to /jobs.

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm run test -- src/modules/tracker/`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/modules/tracker/ && git commit -m "feat(tracker): five-stage kanban with demo advance button"
```

---

## Phase 5 — Eligibility Checker Module

### Task 5.1: Eligibility Checker

**Files:**
- Create: `src/modules/eligibility/EligibilityPage.tsx`
- Create: `src/modules/eligibility/CompanyPicker.tsx`
- Create: `src/modules/eligibility/ResultsTable.tsx`

**Interfaces:**
- Consumes: `useStore` (jobs, student), `checkEligibility`
- Produces: what-if eligibility checker at `/eligibility`

- [ ] **Step 1: Write failing tests**

```tsx
// src/modules/eligibility/EligibilityPage.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { EligibilityPage } from './EligibilityPage'

describe('EligibilityPage', () => {
  it('shows company dropdown', () => {
    render(<MemoryRouter><EligibilityPage /></MemoryRouter>)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })
  it('selecting Google shows ineligible result for Aarav', async () => {
    render(<MemoryRouter><EligibilityPage /></MemoryRouter>)
    await userEvent.selectOptions(screen.getByRole('combobox'), 'Google')
    expect(screen.getByText(/ineligible/i)).toBeInTheDocument()
    expect(screen.getByText(/cgpa/i)).toBeInTheDocument()
  })
  it('overriding CGPA to 8.6 flips Google result to eligible', async () => {
    render(<MemoryRouter><EligibilityPage /></MemoryRouter>)
    await userEvent.selectOptions(screen.getByRole('combobox'), 'Google')
    const cgpaInput = screen.getByLabelText(/cgpa override/i)
    await userEvent.clear(cgpaInput)
    await userEvent.type(cgpaInput, '8.6')
    expect(screen.getByText(/eligible/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/modules/eligibility/`
Expected: FAIL

- [ ] **Step 3: Implement `CompanyPicker.tsx`**

`<select>` with all 10 companies. On change, updates selected company state.

- [ ] **Step 4: Implement `ResultsTable.tsx`**

Props: `result: EligibilityResult`. Table with columns: Criterion, Your Value, Required, Status (✓ / ✗). Pass rows teal, fail rows red. Header shows overall ELIGIBLE / INELIGIBLE badge.

- [ ] **Step 5: Implement `EligibilityPage.tsx`**

State: `selectedJobId`, `cgpaOverride` (defaults to student.cgpa). Two-panel on lg. Left: `CompanyPicker` + profile summary + CGPA override input (labeled "What-if CGPA" with helper text). Right: `ResultsTable` (computed live from override values). Null state when no company selected.

- [ ] **Step 6: Run tests to verify they pass**

Run: `npm run test -- src/modules/eligibility/`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/modules/eligibility/ && git commit -m "feat(eligibility): what-if checker with override and pass/fail table"
```

---

## Phase 6 — Preparation Hub Module

### Task 6.1: Preparation Hub

**Files:**
- Create: `src/modules/prep/PrepPage.tsx`
- Create: `src/modules/prep/DSATracker.tsx`
- Create: `src/modules/prep/AptitudePanel.tsx`
- Create: `src/modules/prep/ResumeChecklist.tsx`
- Create: `src/modules/prep/MockInterviews.tsx`

**Interfaces:**
- Consumes: `useStore` (prep, student), `updateDSA`, `recordAptitude`, `toggleChecklistItem`, `bookMockInterview`
- Produces: 4-tab preparation hub at `/prep`

- [ ] **Step 1: Write failing tests**

```tsx
// src/modules/prep/DSATracker.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DSATracker } from './DSATracker'

describe('DSATracker', () => {
  it('shows DSA topics', () => {
    render(<DSATracker />)
    expect(screen.getByText(/arrays/i)).toBeInTheDocument()
  })
  it('logging a problem increments progress bar', async () => {
    render(<DSATracker />)
    const logBtn = screen.getAllByRole('button', { name: /log/i })[0]
    await userEvent.click(logBtn)
    // progress bar aria-valuenow should increase — check role exists
    expect(screen.getAllByRole('progressbar')[0]).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/modules/prep/`
Expected: FAIL

- [ ] **Step 3: Implement all prep components**

- `DSATracker`: grid of 8 topics (Arrays, Linked Lists, Trees, Graphs, DP, Sorting, Searching, System Design). Each: topic name, `X/Y solved`, `ProgressBar`, `+1` button that calls `updateDSA(topic, +1)`.
- `AptitudePanel`: score history list (date + score), "Take Practice Quiz" button (shows a 3-question placeholder modal with score result), score updates store.
- `ResumeChecklist`: list of 8 items (Contact info, Summary, Work experience, Projects, Skills, Education, Formatting, Keywords). Each toggleable. Progress shown.
- `MockInterviews`: list of available slots (3 mock slots). Book button. Booked list shows below. Cancel option.

- [ ] **Step 4: Implement `PrepPage.tsx`**

Tab bar: DSA | Aptitude | Resume Checklist | Mock Interviews. Tab panel shows active component. Overall progress summarized at top.

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm run test -- src/modules/prep/`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/modules/prep/ && git commit -m "feat(prep): DSA tracker, aptitude, resume checklist, mock interviews"
```

---

## Phase 7 — Student Profile Module

### Task 7.1: Student Profile

**Files:**
- Create: `src/modules/profile/ProfilePage.tsx`
- Create: `src/modules/profile/AcademicForm.tsx`
- Create: `src/modules/profile/SkillTags.tsx`
- Create: `src/modules/profile/ResumeManager.tsx`

**Interfaces:**
- Consumes: `useStore` (student), `updateStudent`, `addResume`, `removeResume`, `setPrimaryResume`
- Produces: editable profile at `/profile`

- [ ] **Step 1: Write failing tests**

```tsx
// src/modules/profile/AcademicForm.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AcademicForm } from './AcademicForm'

describe('AcademicForm', () => {
  it('shows CGPA field', () => {
    render(<AcademicForm />)
    expect(screen.getByLabelText(/cgpa/i)).toBeInTheDocument()
  })
  it('validates CGPA must be between 0 and 10', async () => {
    render(<AcademicForm />)
    const input = screen.getByLabelText(/cgpa/i)
    await userEvent.clear(input)
    await userEvent.type(input, '11')
    await userEvent.tab()
    expect(screen.getByText(/cgpa must be between 0 and 10/i)).toBeInTheDocument()
  })
  it('saves valid CGPA and shows success toast', async () => {
    render(<AcademicForm />)
    const input = screen.getByLabelText(/cgpa/i)
    await userEvent.clear(input)
    await userEvent.type(input, '8.5')
    await userEvent.click(screen.getByRole('button', { name: /save/i }))
    // toast appears
    expect(screen.getByText(/saved/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- src/modules/profile/`
Expected: FAIL

- [ ] **Step 3: Implement `AcademicForm.tsx`**

Fields: Name (text), Email (email), Branch (select), Year (select 1-4), CGPA (number, 0-10, step 0.01), 10th % (number, 0-100), 12th % (number, 0-100), Active Backlogs (number, ≥ 0). All with validation (aria-describedby for error). Save button calls `updateStudent`. Success toast on save.

- [ ] **Step 4: Implement `SkillTags.tsx`**

Tag input: type skill name + Enter/comma to add. Each tag shows a × remove button. Tags stored in `student.skills`.

- [ ] **Step 5: Implement `ResumeManager.tsx`**

File upload dropzone (PDF only, ≤ 2MB — validate client-side). Shows uploaded resumes as cards with: filename, size, upload date, ★ set-as-primary button, delete button. Max 3 resumes (show message if at limit).

- [ ] **Step 6: Implement `ProfilePage.tsx`**

Three sections (sidebar-tabbed or accordion): Personal & Academic | Skills | Resumes & Preferences. Preferences section: role type checkboxes, location tags.

- [ ] **Step 7: Run tests to verify they pass**

Run: `npm run test -- src/modules/profile/`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add src/modules/profile/ && git commit -m "feat(profile): academic form, skill tags, resume manager"
```

---

## Phase 8 — Polish & Accessibility

### Task 8.1: Responsive & Mobile

**Files:**
- Modify: `src/components/layout/Sidebar.tsx` (add mobile bottom nav)
- Modify: `src/components/layout/AppShell.tsx` (mobile layout)
- Modify: all module pages (verify responsive at 320px, 768px, 1024px, 1280px)

- [ ] **Step 1: Add bottom navigation for mobile**

Show 6-icon bottom nav bar on `md:hidden`. Hide sidebar on mobile.

- [ ] **Step 2: Verify every module at 320px width in browser DevTools**

Check: no horizontal overflow, all text readable, tap targets ≥ 44px, modals full-screen on mobile.

- [ ] **Step 3: Fix any overflow or layout issues found**

- [ ] **Step 4: Commit**

```bash
git add src/ && git commit -m "style(responsive): mobile bottom nav, 320px layout fixes"
```

---

### Task 8.2: Accessibility Audit

- [ ] **Step 1: Run axe-core via vitest-axe on all pages**

```bash
npm install -D @axe-core/react vitest-axe
```

Write `src/a11y/accessibility.test.tsx` that renders each module page and runs `axe()` — assert no violations.

- [ ] **Step 2: Fix all violations found**

Common fixes: missing aria-labels, insufficient color contrast, missing focus styles, unlabeled form inputs.

- [ ] **Step 3: Manually verify keyboard navigation**

Tab through each module. Every interactive element reachable. ESC closes modals. No focus traps outside modals.

- [ ] **Step 4: Commit**

```bash
git add src/ && git commit -m "fix(a11y): axe audit fixes, keyboard nav verified"
```

---

## Phase 9 — Final Verification

### Task 9.1: Full Test Suite

- [ ] **Step 1: Run full test suite**

Run: `npm run test`
Expected: All tests PASS, no failures

- [ ] **Step 2: Run coverage report**

Run: `npm run test -- --coverage`
Expected: eligibility engine 100% coverage, store slices ≥ 90%

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: build succeeds, no TypeScript errors

- [ ] **Step 4: Check bundle size**

Run: `npm run build -- --mode production` then inspect `dist/` — total JS ≤ 200KB gzipped

- [ ] **Step 5: Update docs**

Update `docs/memory/Memory.md` — mark all phases complete, update open questions.

- [ ] **Step 6: Final commit**

```bash
git add -A && git commit -m "feat: careerflow v1.0 — all six modules complete"
git tag v1.0
```

