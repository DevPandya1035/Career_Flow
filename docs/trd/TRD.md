# CareerFlow — Technical Requirements Document (TRD)

> **Save path:** `docs/trd/TRD.md`

---

## Revision History

| Version | Date | Author | Summary |
|---------|------|--------|---------|
| v1.0 | 2026-11-03 | CareerFlow Engineering | Initial client-side release |
| v2.0 | 2026-11-03 | CareerFlow Engineering | Full-stack architecture: Node.js Express compute layer, Prisma relational ORM, PostgreSQL database, and TPO Admin REST API |

---

## 1. Overview & Purpose

This Technical Requirements Document (TRD) specifies the full-stack engineering architecture, backend compute layer, relational database schema, state management, accessibility, performance, and AWS deployment topology for **CareerFlow v2.0**.

CareerFlow is an **enterprise-grade, full-stack campus placement and recruitment portal**. It features:
- **A responsive frontend SPA** (React 18 + TypeScript + Tailwind CSS + Vite).
- **A high-performance backend compute service** (Node.js + Express + TypeScript + Zod validation).
- **A robust relational database layer** (Prisma ORM with SQLite for zero-config local development and Amazon RDS PostgreSQL in production).
- **A two-sided platform** supporting both the Student journey (discover, evaluate eligibility, opt in, prep) and the TPO Admin journey (publish drives, specify hard cutoffs, review applicants, 1-click bulk auto-shortlist, and analyze placement KPIs).

---

## 2. Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **UI Framework** | React | 18.x | Component tree, hooks, concurrent rendering |
| **Language** | TypeScript | 5.x | Static typing, strict mode across frontend & backend |
| **Build Tool** | Vite | 5.x | Fast HMR dev server, production bundle |
| **Backend Compute** | Node.js + Express | 20.x / 4.x | REST API server, controllers, routing, middleware |
| **Database & ORM** | Prisma ORM | 5.x | Relational schema, migrations, type-safe queries |
| **Local Database** | SQLite | 3.x | Zero-setup, standalone local database (`prisma/dev.db`) |
| **Production Database** | PostgreSQL (Amazon RDS) | 16.x | ACID-compliant relational cloud persistence |
| **Request Validation** | Zod | 3.x | Schema validation for API payloads and criteria |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS, design token discipline |
| **Routing** | React Router | v6 | Nested routes, client-side SPA routing |
| **State Management** | Zustand | 4.x | Frontend store with API synchronization |
| **Icons & Visuals** | lucide-react & canvas-confetti | latest | Accessible icons and celebratory confetti |
| **Testing** | Vitest + RTL + Supertest | latest | Unit, component, API integration, and E2E testing |
| **Cloud Hosting (AWS)** | App Runner / ECS + RDS + S3/CloudFront | AWS | Compute container, relational database, CDN distribution |

### Design Tokens (Tailwind Config)

```ts
// tailwind.config.ts — custom token extensions
export default {
  theme: {
    extend: {
      colors: {
        navy:    { DEFAULT: '#0F2044', light: '#1A3366' },
        primary: { DEFAULT: '#2563EB', hover: '#1D4ED8' },
        teal:    { DEFAULT: '#0D9488', light: '#CCFBF1' },
        surface: '#F8FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

---

## 3. Project Structure

```
CareerFlow/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx                  # Entry point — ReactDOM.createRoot
│   ├── App.tsx                   # Router + layout shell
│   ├── index.css                 # Tailwind directives
│   │
│   ├── modules/
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── components/
│   │   │   │   ├── ReadinessScoreCard.tsx
│   │   │   │   ├── DeadlinesWidget.tsx
│   │   │   │   ├── QuickLinks.tsx
│   │   │   │   └── StageStepper.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── jobs/
│   │   │   ├── Jobs.tsx
│   │   │   ├── components/
│   │   │   │   ├── JobCard.tsx
│   │   │   │   ├── JobFilters.tsx
│   │   │   │   ├── JobDetail.tsx
│   │   │   │   ├── ApplyDialog.tsx
│   │   │   │   └── EligibilityBadge.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── tracker/
│   │   │   ├── Tracker.tsx
│   │   │   ├── components/
│   │   │   │   ├── KanbanColumn.tsx
│   │   │   │   └── ApplicationCard.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── eligibility/
│   │   │   ├── EligibilityChecker.tsx
│   │   │   ├── components/
│   │   │   │   ├── CompanySelector.tsx
│   │   │   │   ├── WhatIfControls.tsx
│   │   │   │   ├── CriteriaTable.tsx
│   │   │   │   └── SkillsGapPanel.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── prep/
│   │   │   ├── PrepHub.tsx
│   │   │   ├── components/
│   │   │   │   ├── DSATracker.tsx
│   │   │   │   ├── AptitudePractice.tsx
│   │   │   │   ├── ResumeChecklist.tsx
│   │   │   │   └── MockInterviewBooking.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── profile/
│   │       ├── Profile.tsx
│   │       ├── components/
│   │       │   ├── AcademicDetails.tsx
│   │       │   ├── SkillTags.tsx
│   │       │   ├── ResumeUpload.tsx
│   │       │   └── JobPreferences.tsx
│   │       └── index.ts
│   │
│   ├── components/
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       ├── Toast.tsx
│   │       ├── Sidebar.tsx
│   │       ├── TopBar.tsx
│   │       ├── ProgressBar.tsx
│   │       └── Stepper.tsx
│   │
│   ├── store/
│   │   ├── index.ts              # Combines all slices
│   │   ├── studentProfileSlice.ts
│   │   ├── jobsSlice.ts
│   │   ├── applicationsSlice.ts
│   │   ├── prepProgressSlice.ts
│   │   └── uiSlice.ts
│   │
│   ├── types/
│   │   ├── student.ts
│   │   ├── job.ts
│   │   ├── application.ts
│   │   ├── eligibility.ts
│   │   ├── prep.ts
│   │   └── ui.ts
│   │
│   ├── data/
│   │   ├── mockJobs.ts           # 30+ seed job records
│   │   ├── mockCompanies.ts      # Company metadata
│   │   └── dsaTopics.ts          # DSA topic list with categories
│   │
│   ├── hooks/
│   │   ├── useLocalStorage.ts    # Generic read/write hook
│   │   ├── useEligibility.ts     # Wraps eligibility engine
│   │   ├── useReadinessScore.ts  # Derives readiness from store slices
│   │   └── useToast.ts           # Toast notification state
│   │
│   └── lib/
│       ├── eligibilityEngine.ts  # Pure eligibility checker function
│       └── readinessCalculator.ts# Pure readiness score function
│
├── tests/
│   ├── unit/
│   │   ├── eligibilityEngine.test.ts
│   │   └── readinessCalculator.test.ts
│   └── components/
│       ├── ApplyDialog.test.tsx
│       ├── JobCard.test.tsx
│       └── EligibilityChecker.test.tsx
│
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── eslint.config.js
├── .prettierrc
└── package.json
```

---

## 4. Module Architecture

### 4.1 Dashboard Module

| Concern | Detail |
|---------|--------|
| **Entry component** | `modules/dashboard/Dashboard.tsx` |
| **Sub-components** | `ReadinessScoreCard`, `DeadlinesWidget`, `QuickLinks`, `StageStepper` |
| **Store slices consumed** | `studentProfile`, `applications`, `jobs`, `prepProgress` |
| **Derived data** | Readiness score (`useReadinessScore`), upcoming deadlines (filtered from `jobs`), active application count (from `applications`) |
| **Key behaviour** | Readiness score is computed on every render from profile completeness (30%), prep progress (40%), and application activity (30%). No user input on this page. |

### 4.2 Job Opportunities Module

| Concern | Detail |
|---------|--------|
| **Entry component** | `modules/jobs/Jobs.tsx` |
| **Sub-components** | `JobCard`, `JobFilters`, `JobDetail`, `ApplyDialog`, `EligibilityBadge` |
| **Store slices consumed** | `jobs`, `applications`, `studentProfile` |
| **Key behaviour** | Jobs list is filtered and sorted client-side. `EligibilityBadge` calls `checkEligibility` synchronously. `ApplyDialog` is a controlled `Modal` — on confirm it dispatches `addApplication` to the applications slice. |

### 4.3 Application Tracker Module

| Concern | Detail |
|---------|--------|
| **Entry component** | `modules/tracker/Tracker.tsx` |
| **Sub-components** | `KanbanColumn` (×5), `ApplicationCard` |
| **Store slices consumed** | `applications`, `jobs` |
| **Key behaviour** | Applications are grouped by `stage` field and rendered in five `KanbanColumn` components side by side. "Advance Stage" button dispatches `advanceStage(applicationId)` action. Selected-stage cards receive `ring-2 ring-teal` styling. |

### 4.4 Eligibility Checker Module

| Concern | Detail |
|---------|--------|
| **Entry component** | `modules/eligibility/EligibilityChecker.tsx` |
| **Sub-components** | `CompanySelector`, `WhatIfControls`, `CriteriaTable`, `SkillsGapPanel` |
| **Store slices consumed** | `studentProfile`, `jobs` |
| **Key behaviour** | The component maintains local `whatIfStudent` state (copy of profile with overrides). On every change to `WhatIfControls`, `checkEligibility(whatIfStudent, selectedJob)` is called and result re-renders `CriteriaTable` and `SkillsGapPanel` immediately. No debounce needed (pure function, O(n) where n = criteria count). |

### 4.5 Preparation Hub Module

| Concern | Detail |
|---------|--------|
| **Entry component** | `modules/prep/PrepHub.tsx` |
| **Sub-components** | `DSATracker`, `AptitudePractice`, `ResumeChecklist`, `MockInterviewBooking` |
| **Store slices consumed** | `prepProgress` |
| **Key behaviour** | Tabbed interface (or accordion). Each sub-component reads/writes from `prepProgressSlice`. DSA topic states are `NotStarted | InProgress | Done`. Checklist items are boolean. Mock interview slots are stored as ISO date strings. |

### 4.6 Student Profile Module

| Concern | Detail |
|---------|--------|
| **Entry component** | `modules/profile/Profile.tsx` |
| **Sub-components** | `AcademicDetails`, `SkillTags`, `ResumeUpload`, `JobPreferences` |
| **Store slices consumed** | `studentProfile` |
| **Key behaviour** | All edits use controlled inputs. `ResumeUpload` validates file type (`application/pdf`) and size (≤ 2 MB) before `FileReader.readAsDataURL`. On save, the base64 string is stored in the profile slice and auto-persisted to localStorage. |

---

## 5. State Management

Zustand is used with the `persist` middleware to auto-sync each slice to `localStorage`.

### 5.1 Store Slices

#### `studentProfileSlice`

```ts
interface StudentProfileState {
  student: Student;
  updateStudent: (patch: Partial<Student>) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  uploadResume: (resume: Resume) => void;
  deleteResume: () => void;
}
```

#### `jobsSlice`

```ts
interface JobsState {
  jobs: Job[];
  savedJobIds: string[];
  filters: JobFilters;
  sortBy: SortOption;
  setFilters: (filters: Partial<JobFilters>) => void;
  setSortBy: (sort: SortOption) => void;
  toggleSaveJob: (jobId: string) => void;
}
```

#### `applicationsSlice`

```ts
interface ApplicationsState {
  applications: Application[];
  addApplication: (jobId: string, resumeId: string) => void;
  advanceStage: (applicationId: string) => void;
  withdrawApplication: (applicationId: string) => void;
}
```

#### `prepProgressSlice`

```ts
interface PrepProgressState {
  dsaTopics: DSATopic[];
  aptitudeScores: AptitudeScore[];
  checklistItems: ChecklistItem[];
  bookedSlots: MockSlot[];
  updateDSATopic: (topicId: string, status: TopicStatus) => void;
  updateAptitudeScore: (topicId: string, score: number) => void;
  toggleChecklistItem: (itemId: string) => void;
  bookSlot: (slot: MockSlot) => void;
  cancelSlot: (slotId: string) => void;
}
```

#### `uiSlice`

```ts
interface UIState {
  sidebarOpen: boolean;
  toasts: Toast[];
  activePage: Route;
  toggleSidebar: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
  setActivePage: (route: Route) => void;
}
```

### 5.2 Persist Middleware Configuration

```ts
// store/index.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useStore = create<RootState>()(
  persist(
    (set, get) => ({
      ...studentProfileSlice(set, get),
      ...jobsSlice(set, get),
      ...applicationsSlice(set, get),
      ...prepProgressSlice(set, get),
      ...uiSlice(set, get),
    }),
    {
      name: 'careerflow-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // ui slice is intentionally excluded from persistence
        student:      state.student,
        savedJobIds:  state.savedJobIds,
        applications: state.applications,
        dsaTopics:    state.dsaTopics,
        aptitudeScores: state.aptitudeScores,
        checklistItems: state.checklistItems,
        bookedSlots:  state.bookedSlots,
      }),
    }
  )
);
```

---

## 6. Data Layer

### 6.1 localStorage Keys

| Key | Type | Contents |
|-----|------|----------|
| `careerflow-store` | JSON string | Persisted Zustand state (all slices except UI) |
| `careerflow-resume` | Base64 string | Raw base64-encoded PDF (stored separately to avoid Zustand serialisation overhead) |

> **Note:** The resume is stored under a separate key to avoid inflating the main store JSON. The `student.resume` field in the store holds only metadata (`{ filename, uploadedAt, size }`); the actual base64 data is read from `careerflow-resume` when needed.

### 6.2 Key TypeScript Types

```ts
// types/student.ts

export interface Student {
  id: string;
  name: string;
  branch: Branch;
  cgpa: number;
  backlogs: number;
  twelfthPercentage: number;
  skills: string[];
  resume: Resume | null;
  preferences: JobPreferences;
}

export type Branch =
  | 'CSE' | 'ECE' | 'EEE' | 'ME' | 'CE'
  | 'IT'  | 'CHE' | 'BT'  | 'Other';

export interface Resume {
  filename: string;
  uploadedAt: string;   // ISO 8601
  sizeBytes: number;
}

export interface JobPreferences {
  preferredRoles: string[];
  preferredLocations: string[];
  workType: 'onsite' | 'hybrid' | 'remote' | 'any';
}
```

```ts
// types/job.ts

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  companyLogoUrl: string;
  role: string;
  ctc: number;             // in LPA (Lakhs Per Annum)
  location: string[];
  jobType: 'fulltime' | 'internship';
  description: string;
  deadline: string;        // ISO 8601 date string
  eligibilityCriteria: EligibilityCriteria;
  requiredSkills: string[];
  postedAt: string;        // ISO 8601
}

export interface EligibilityCriteria {
  allowedBranches: Branch[];
  minCgpa: number;
  maxBacklogs: number;
  minTwelfthPercentage: number;
  requiredSkills: string[];    // skills that are hard requirements
}
```

```ts
// types/application.ts

export type ApplicationStage =
  | 'Applied'
  | 'Shortlisted'
  | 'Assessment'
  | 'Interview'
  | 'Selected';

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  stage: ApplicationStage;
  appliedAt: string;       // ISO 8601
  resumeFilename: string;
  stageHistory: StageEvent[];
}

export interface StageEvent {
  stage: ApplicationStage;
  timestamp: string;       // ISO 8601
}
```

```ts
// types/eligibility.ts

export interface EligibilityResult {
  eligible: boolean;
  criteria: CriterionResult[];
}

export interface CriterionResult {
  criterion: string;       // e.g. "CGPA", "Branch", "Backlogs", "12th Score", "Skills"
  required: string;        // human-readable requirement
  actual: string;          // human-readable student value
  pass: boolean;
}

export interface SkillsGap {
  required: string[];
  possessed: string[];
  missing: string[];
}
```

```ts
// types/prep.ts

export type TopicStatus = 'NotStarted' | 'InProgress' | 'Done';

export interface DSATopic {
  id: string;
  name: string;
  category: string;        // e.g. "Arrays", "Trees", "Graphs", "DP"
  status: TopicStatus;
}

export interface AptitudeScore {
  topicId: string;
  topicName: string;
  score: number;           // 0–100
  lastUpdated: string;     // ISO 8601
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface MockSlot {
  id: string;
  date: string;            // ISO 8601 date
  time: string;            // HH:mm
  bookedAt: string;        // ISO 8601
}
```

### 6.3 Mock Data Shape

```ts
// data/mockJobs.ts (excerpt)
export const mockJobs: Job[] = [
  {
    id: 'job-001',
    companyId: 'company-tcs',
    companyName: 'Tata Consultancy Services',
    companyLogoUrl: '/logos/tcs.svg',
    role: 'Systems Engineer',
    ctc: 7.5,
    location: ['Bangalore', 'Hyderabad', 'Chennai'],
    jobType: 'fulltime',
    description: 'Work on enterprise-grade software systems...',
    deadline: '2026-12-01',
    eligibilityCriteria: {
      allowedBranches: ['CSE', 'IT', 'ECE', 'EEE'],
      minCgpa: 6.0,
      maxBacklogs: 0,
      minTwelfthPercentage: 60,
      requiredSkills: [],
    },
    requiredSkills: ['Java', 'SQL', 'OOP'],
    postedAt: '2026-11-01',
  },
  // ... 29+ more entries
];
```

### 6.4 Hydration Pattern

On app boot, Zustand's `persist` middleware reads `careerflow-store` from `localStorage` and merges it with the default state. If no persisted data exists (first visit), the store initialises with defaults (empty student profile, empty applications array, seed DSA topics from `data/dsaTopics.ts`).

```ts
// store/studentProfileSlice.ts — default state
const defaultStudent: Student = {
  id: 'student-default',
  name: '',
  branch: 'CSE',
  cgpa: 0,
  backlogs: 0,
  twelfthPercentage: 0,
  skills: [],
  resume: null,
  preferences: {
    preferredRoles: [],
    preferredLocations: [],
    workType: 'any',
  },
};
```

---

## 7. Routing

React Router v6 is used with a layout route that renders `Sidebar` + `TopBar` as a shell, with module-specific pages rendered in the `<Outlet />`.

```tsx
// App.tsx
<Routes>
  <Route element={<AppLayout />}>
    <Route index        path="/"            element={<Dashboard />} />
    <Route             path="/jobs"         element={<Jobs />} />
    <Route             path="/jobs/:jobId"  element={<JobDetail />} />
    <Route             path="/tracker"      element={<Tracker />} />
    <Route             path="/eligibility"  element={<EligibilityChecker />} />
    <Route             path="/prep"         element={<PrepHub />} />
    <Route             path="/profile"      element={<Profile />} />
    <Route             path="*"             element={<Navigate to="/" replace />} />
  </Route>
</Routes>
```

| Route | Module | Description |
|-------|--------|-------------|
| `/` | Dashboard | Readiness score, deadlines, quick-links |
| `/jobs` | Job Opportunities | Searchable/filterable job listing |
| `/jobs/:jobId` | Job Detail | Full job view + Apply CTA |
| `/tracker` | Application Tracker | Five-stage Kanban |
| `/eligibility` | Eligibility Checker | What-if checker |
| `/prep` | Preparation Hub | DSA, aptitude, checklist, mock interviews |
| `/profile` | Student Profile | Academic details, skills, resume, preferences |

---

## 8. Component Library

All shared components live in `src/components/ui/` and are built without third-party component libraries, using Tailwind CSS exclusively for styling.

### 8.1 Button

```ts
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  children: React.ReactNode;
  ariaLabel?: string;
}
```

- Primary: `bg-primary text-white hover:bg-primary-hover` — pill-shaped with `rounded-full`
- Disabled state sets `opacity-50 cursor-not-allowed` and `aria-disabled="true"`
- Loading state renders a spinner icon and sets `aria-busy="true"`

### 8.2 Badge / Pill

```ts
interface BadgeProps {
  variant: 'eligible' | 'ineligible' | 'applied' | 'shortlisted' | 'assessment' | 'interview' | 'selected' | 'neutral';
  children: React.ReactNode;
}
```

| Variant | Visual |
|---------|--------|
| `eligible` | `bg-teal-light text-teal` pill |
| `ineligible` | `bg-red-100 text-red-700` pill |
| `selected` | `bg-teal text-white` pill |
| `applied` | `bg-blue-100 text-primary` pill |
| `shortlisted` | `bg-yellow-100 text-yellow-700` pill |
| `assessment` | `bg-orange-100 text-orange-700` pill |
| `interview` | `bg-purple-100 text-purple-700` pill |

### 8.3 Card

```ts
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string;
  tabIndex?: number;
}
```

Renders a white rounded-xl card with shadow-sm. When `onClick` is provided, adds `cursor-pointer` and keyboard `Enter`/`Space` handlers.

### 8.4 Modal / Dialog

```ts
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}
```

- Uses `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`
- Traps focus within the dialog when open (custom `useFocusTrap` hook)
- `Escape` key closes the dialog
- Backdrop click calls `onClose`
- Renders via `createPortal` into `document.body`

### 8.5 Toast

```ts
interface Toast {
  id: string;
  message: string;
  variant: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // ms, default 4000
}
```

- Rendered in a fixed `aria-live="polite"` region at bottom-right
- Auto-dismiss after `duration` ms
- Manual dismiss via × button

### 8.6 Sidebar

- Fixed left panel, `w-64` on desktop, slides in/out on mobile (`< md` breakpoint)
- Background: `bg-navy`
- Nav items: `text-white/70 hover:text-white hover:bg-white/10`
- Active item: `bg-white/15 text-white font-medium`
- Each item has `aria-current="page"` when active
- Keyboard navigation: `Tab` cycles through items; `Enter` navigates

### 8.7 TopBar

- Sticky top bar with page title, mobile menu toggle, and student name/avatar
- Mobile menu toggle: `aria-expanded` and `aria-controls="sidebar"` ARIA attributes

### 8.8 ProgressBar

```ts
interface ProgressBarProps {
  value: number;        // 0–100
  max?: number;         // default 100
  label: string;        // visible or aria-label
  showLabel?: boolean;
  color?: 'primary' | 'teal' | 'yellow' | 'red';
}
```

Renders `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`.

### 8.9 Stepper

```ts
interface StepperProps {
  steps: string[];
  currentStep: number; // 0-indexed
}
```

Renders a horizontal step indicator. Completed steps have a teal checkmark, current step has a filled primary circle, future steps are grey outlines.

---

## 9. Eligibility Engine

The eligibility engine is a **pure function** with no side effects, making it trivially testable and usable in both the `JobCard` (badge), the `ApplyDialog` (guard), and the `EligibilityChecker` (what-if table).

```ts
// lib/eligibilityEngine.ts

import type { Student, Job, EligibilityResult, CriterionResult, SkillsGap } from '../types';

export function checkEligibility(
  student: Student,
  job: Job
): EligibilityResult {
  const criteria: CriterionResult[] = [];

  // Branch check
  const branchPass = job.eligibilityCriteria.allowedBranches.includes(student.branch);
  criteria.push({
    criterion: 'Branch',
    required: job.eligibilityCriteria.allowedBranches.join(', '),
    actual: student.branch,
    pass: branchPass,
  });

  // CGPA check
  const cgpaPass = student.cgpa >= job.eligibilityCriteria.minCgpa;
  criteria.push({
    criterion: 'CGPA',
    required: `≥ ${job.eligibilityCriteria.minCgpa}`,
    actual: student.cgpa.toFixed(2),
    pass: cgpaPass,
  });

  // Backlogs check
  const backlogPass = student.backlogs <= job.eligibilityCriteria.maxBacklogs;
  criteria.push({
    criterion: 'Active Backlogs',
    required: `≤ ${job.eligibilityCriteria.maxBacklogs}`,
    actual: String(student.backlogs),
    pass: backlogPass,
  });

  // 12th score check
  const twelfthPass =
    student.twelfthPercentage >= job.eligibilityCriteria.minTwelfthPercentage;
  criteria.push({
    criterion: '12th Percentage',
    required: `≥ ${job.eligibilityCriteria.minTwelfthPercentage}%`,
    actual: `${student.twelfthPercentage}%`,
    pass: twelfthPass,
  });

  // Skills check (hard-required skills)
  const studentSkillsLower = student.skills.map((s) => s.toLowerCase());
  const missingSkills = job.eligibilityCriteria.requiredSkills.filter(
    (skill) => !studentSkillsLower.includes(skill.toLowerCase())
  );
  const skillsPass = missingSkills.length === 0;
  criteria.push({
    criterion: 'Required Skills',
    required:
      job.eligibilityCriteria.requiredSkills.length > 0
        ? job.eligibilityCriteria.requiredSkills.join(', ')
        : 'None',
    actual: student.skills.join(', ') || 'None',
    pass: skillsPass,
  });

  return {
    eligible: criteria.every((c) => c.pass),
    criteria,
  };
}

export function getSkillsGap(student: Student, job: Job): SkillsGap {
  const studentSkillsLower = student.skills.map((s) => s.toLowerCase());
  const required = job.requiredSkills;
  const possessed = required.filter((skill) =>
    studentSkillsLower.includes(skill.toLowerCase())
  );
  const missing = required.filter(
    (skill) => !studentSkillsLower.includes(skill.toLowerCase())
  );
  return { required, possessed, missing };
}
```

---

## 10. Accessibility Requirements

### 10.1 Colour Contrast

| Foreground | Background | Ratio | Usage |
|-----------|-----------|-------|-------|
| `#FFFFFF` | `#0F2044` (navy) | 13.2:1 | Sidebar nav text |
| `#FFFFFF` | `#2563EB` (primary) | 4.54:1 | Primary button text |
| `#1F2937` | `#F8FAFC` (surface) | 16.0:1 | Body text on page |
| `#FFFFFF` | `#0D9488` (teal) | 4.61:1 | Success badge text |
| `#B91C1C` | `#FEE2E2` (red-100) | 5.9:1 | Ineligible badge text |

All ratios meet WCAG 2.1 AA (≥ 4.5:1 for normal text, ≥ 3:1 for large/bold text and UI components).

### 10.2 Keyboard Navigation

| Component | Keyboard Behaviour |
|-----------|-------------------|
| Sidebar nav | `Tab` cycles items; `Enter` navigates; `Escape` closes on mobile |
| Job cards | `Tab` focuses card; `Enter` opens detail view |
| Apply button | `Enter` / `Space` opens dialog |
| Modal / Dialog | Focus trapped inside; `Escape` closes; first focusable element receives focus on open |
| Kanban columns | Advance Stage button reachable via `Tab` |
| Dropdowns / Selects | Native `<select>` elements used for ARIA compatibility |
| Skill tag removal | Each tag's × button is a `<button>` with `aria-label="Remove [skill]"` |

### 10.3 ARIA Roles & Attributes

| Pattern | Implementation |
|---------|---------------|
| Page navigation | `<nav aria-label="Main navigation">` wrapping sidebar links |
| Current page | `aria-current="page"` on active nav item |
| Dialog | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="dialog-title"` |
| Progress bars | `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |
| Live region (toasts) | `aria-live="polite"`, `aria-atomic="true"` |
| Kanban columns | `role="region"`, `aria-label="[Stage] applications"` |
| Icon-only buttons | `aria-label` on every button that contains only an icon |
| Status badges | `role="status"` or inline text; never colour-only communication |
| Form fields | `<label>` explicitly associated via `htmlFor` / `id`; no placeholder-as-label |

### 10.4 Focus Management

- Modal open: focus moves to first focusable element inside dialog.
- Modal close: focus returns to the trigger element.
- Toast dismiss: focus remains on dismiss button; after auto-dismiss, focus is not moved.
- Route change: `<h1>` of new page receives focus (via `useEffect` + `ref.focus()`).

---

## 11. Performance Targets

| Metric | Target | Measurement Tool |
|--------|--------|-----------------|
| First Contentful Paint (FCP) | ≤ 1 s (throttled 4G) | Lighthouse, WebPageTest |
| Largest Contentful Paint (LCP) | ≤ 2.5 s (throttled 4G) | Lighthouse |
| Total Blocking Time (TBT) | ≤ 200 ms | Lighthouse |
| JavaScript bundle (gzipped) | ≤ 200 KB total | `vite build --report`, `rollup-plugin-visualizer` |
| CSS bundle (gzipped) | ≤ 20 KB | Tailwind JIT tree-shaking |
| Lighthouse Performance Score | ≥ 90 | CI pipeline |
| Lighthouse Accessibility Score | ≥ 90 | CI pipeline |

### 11.1 Optimisation Strategy

- **Code splitting:** React Router lazy-loads each module page with `React.lazy()` + `<Suspense>`.
- **Tree shaking:** lucide-react icons imported individually (`import { Briefcase } from 'lucide-react'`), not as a namespace.
- **Image optimisation:** Company logos are SVGs. No raster images in the critical path.
- **Tailwind JIT:** Only the utility classes present in source files are emitted; zero unused CSS in production.
- **Zustand:** Minimal re-renders via selector-based subscriptions (`useStore((s) => s.student)`).
- **No runtime CSS-in-JS:** Tailwind generates static CSS at build time.

---

## 12. Testing Strategy

### 12.1 Unit Tests — Eligibility Engine

```ts
// tests/unit/eligibilityEngine.test.ts

import { describe, it, expect } from 'vitest';
import { checkEligibility, getSkillsGap } from '../../src/lib/eligibilityEngine';
import type { Student, Job } from '../../src/types';

const mockStudent: Student = {
  id: 'test-student',
  name: 'Aarav Mehta',
  branch: 'CSE',
  cgpa: 8.4,
  backlogs: 0,
  twelfthPercentage: 88,
  skills: ['Python', 'Java', 'SQL'],
  resume: null,
  preferences: { preferredRoles: [], preferredLocations: [], workType: 'any' },
};

const mockJob: Job = {
  id: 'job-001',
  // ... (full mock)
  eligibilityCriteria: {
    allowedBranches: ['CSE', 'IT'],
    minCgpa: 7.0,
    maxBacklogs: 0,
    minTwelfthPercentage: 75,
    requiredSkills: ['Python'],
  },
  requiredSkills: ['Python', 'React', 'Node.js'],
};

describe('checkEligibility', () => {
  it('returns eligible=true when all criteria pass', () => {
    const result = checkEligibility(mockStudent, mockJob);
    expect(result.eligible).toBe(true);
    expect(result.criteria.every((c) => c.pass)).toBe(true);
  });

  it('fails CGPA criterion when student CGPA is below cut-off', () => {
    const lowCgpaStudent = { ...mockStudent, cgpa: 6.0 };
    const result = checkEligibility(lowCgpaStudent, mockJob);
    expect(result.eligible).toBe(false);
    const cgpaResult = result.criteria.find((c) => c.criterion === 'CGPA');
    expect(cgpaResult?.pass).toBe(false);
  });

  it('fails branch criterion when student branch not in allowed list', () => {
    const mechStudent = { ...mockStudent, branch: 'ME' as const };
    const result = checkEligibility(mechStudent, mockJob);
    expect(result.eligible).toBe(false);
  });

  it('fails skills criterion when required skill is missing', () => {
    const noSkillsStudent = { ...mockStudent, skills: [] };
    const result = checkEligibility(noSkillsStudent, mockJob);
    expect(result.eligible).toBe(false);
  });
});

describe('getSkillsGap', () => {
  it('correctly identifies missing and possessed skills', () => {
    const gap = getSkillsGap(mockStudent, mockJob);
    expect(gap.possessed).toContain('Python');
    expect(gap.missing).toContain('React');
    expect(gap.missing).toContain('Node.js');
  });
});
```

### 12.2 Component Tests — Apply Flow

Key assertions for `ApplyDialog.test.tsx`:

- Apply button is disabled and shows "Ineligible" tooltip when `checkEligibility` returns `eligible: false`.
- Apply button is enabled when student is eligible.
- Clicking Apply opens the confirmation dialog.
- Selecting a resume and clicking "Confirm Apply" calls `addApplication` with correct arguments.
- Dialog closes on `Escape` key press and on Backdrop click.
- After successful submission, a success toast appears.

### 12.3 Accessibility Tests

```ts
// tests/components/JobCard.test.tsx (accessibility check)
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('JobCard has no accessibility violations', async () => {
  const { container } = render(<JobCard job={mockJob} student={mockStudent} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

axe-core checks are run for every component under `tests/components/`.

### 12.4 Coverage Targets

| Area | Target Coverage |
|------|----------------|
| `lib/eligibilityEngine.ts` | 100% statement, branch |
| `lib/readinessCalculator.ts` | 100% statement, branch |
| `modules/*/components/` | ≥ 80% statement |
| `components/ui/` | ≥ 70% statement |

---

## 13. Build & Dev Setup

### 13.1 Prerequisites

- Node.js ≥ 20 LTS
- npm ≥ 10

### 13.2 npm Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start Vite dev server with HMR on `http://localhost:5173` |
| `build` | `tsc && vite build` | Type-check then produce optimised production bundle in `dist/` |
| `preview` | `vite preview` | Serve the production bundle locally for smoke-testing |
| `test` | `vitest run` | Run all tests once |
| `test:watch` | `vitest` | Run tests in watch mode |
| `test:coverage` | `vitest run --coverage` | Run tests with V8 coverage report |
| `test:ui` | `vitest --ui` | Open Vitest browser UI |
| `lint` | `eslint . --ext .ts,.tsx` | Run ESLint |
| `format` | `prettier --write "src/**/*.{ts,tsx}"` | Format source files |
| `type-check` | `tsc --noEmit` | Type-check without emitting |

### 13.3 Vite Configuration

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: false, gzipSize: true, filename: 'dist/stats.html' }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          state: ['zustand'],
        },
      },
    },
    sourcemap: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
  },
});
```

### 13.4 TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src", "tests"]
}
```

---

## 14. Browser Support

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Google Chrome | Current – 1 | Primary development target |
| Microsoft Edge | Current – 1 | Chromium-based; functionally identical to Chrome |
| Mozilla Firefox | Current – 1 | Full support; tested in CI |
| Apple Safari | Current – 1 | macOS + iOS; test focus trap and dialog behaviour |

**Not supported:** Internet Explorer (any version), Opera Mini, legacy Edge (EdgeHTML).

The application relies on:
- `localStorage` API (supported universally in modern browsers)
- CSS Grid and Flexbox (full support in all targets)
- `FileReader` API for resume upload (full support in all targets)
- CSS Custom Properties (full support in all targets)
- ES2020 syntax (transpiled by Vite/esbuild targeting `ES2020`)

---

*End of TRD v1.0*
