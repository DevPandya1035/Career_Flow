# CareerFlow — Rules & Conventions

> **Version:** 1.0.0 · **Last updated:** 2026-11-03  
> **Scope:** Authoritative coding standards, architectural conventions, accessibility requirements, git workflow, and phase completion checklists for any developer or AI agent contributing to CareerFlow.

> [!IMPORTANT]
> This document is the **primary governance file** for the CareerFlow codebase. Any developer or AI agent (Claude, Gemini, GPT, etc.) working on this project **must read and follow** these rules before making any changes. When in doubt, these rules take precedence over general conventions.

---

## Table of Contents

1. [Code Style & Conventions](#1-code-style--conventions)
2. [Component Rules](#2-component-rules)
3. [State Management Rules](#3-state-management-rules)
4. [Testing Rules](#4-testing-rules)
5. [Design System Rules](#5-design-system-rules)
6. [Documentation Rules](#6-documentation-rules)
7. [Git Conventions](#7-git-conventions)
8. [Error Handling Rules](#8-error-handling-rules)
9. [Accessibility Rules](#9-accessibility-rules)
10. [Performance Rules](#10-performance-rules)
11. [Mock Data Rules](#11-mock-data-rules)
12. [Phase Completion Checklist](#12-phase-completion-checklist)

---

## 1. Code Style & Conventions

### TypeScript

- **Strict mode is mandatory.** `tsconfig.json` must always have `"strict": true`. Never disable strict checks or use `@ts-ignore` / `@ts-nocheck` without a written justification in a comment.
- All variables, parameters, and return types must be explicitly typed. Avoid `any`; use `unknown` with narrowing when the type is truly unknown.
- Use `type` for unions, intersections, and primitives. Use `interface` for object shapes that may be extended.
- Prefer `const` over `let`. Never use `var`.
- Use optional chaining (`?.`) and nullish coalescing (`??`) over manual null checks.
- Template literals over string concatenation.
- Destructure objects and arrays wherever it improves clarity.

### File naming

| Artifact | Convention | Example |
|---|---|---|
| React components | `PascalCase.tsx` | `JobCard.tsx`, `AppShell.tsx` |
| Custom hooks | `camelCase.ts` prefixed `use` | `useEligibility.ts`, `useToast.ts` |
| Utility / pure functions | `camelCase.ts` | `eligibility.ts`, `formatDate.ts` |
| Store slices | `camelCase.ts` suffixed `Slice` | `studentSlice.ts`, `jobsSlice.ts` |
| Type definitions | `index.ts` in `src/types/` | `src/types/index.ts` |
| Mock data files | `camelCase.ts` | `jobs.ts`, `student.ts` |
| Backend routes | `camelCase.ts` | `jobs.ts`, `admin.ts` |
| Test files | Co-located; same name + `.test.ts(x)` | `eligibility.test.ts`, `JobCard.test.tsx` |

### Backend & API Rules

- **RESTful Endpoints:** Plural nouns for resource collections (`/api/jobs`, `/api/applications`).
- **Zod Validation:** Every POST, PUT, and PATCH request body must be validated with a Zod schema before hitting database logic. Return `400 Bad Request` with structured error messages if validation fails.
- **Relational Integrity:** Use Prisma transactions (`prisma.$transaction`) whenever multiple mutations must succeed atomically (e.g. bulk auto-shortlisting or deleting students with cascading resumes).
- **Standardized Response Envelope:**
  - Success: `res.json(data)` or `{ success: true, ... }`
  - Failure: `res.status(code).json({ error: 'Human-readable message', details?: ... })`
- **Error Codes:**
  - `400`: Bad Request (invalid criteria, negative CGPA, past deadline)
  - `404`: Resource Not Found (job ID or application ID not in DB)
  - `409`: Conflict (attempting to apply to the same job twice)
  - `500`: Internal Server Error (unhandled exceptions logged with stack trace)

### Exports

- **Named exports for everything** — components, hooks, utilities, types, constants.
- **Default exports** are allowed **only** for module-level page components (the root component of each module, e.g., `Dashboard.tsx`, `JobsPage.tsx`). This enables React Router's `lazy()`.
- Re-export from barrel `index.ts` files only when the export surface is stable and the barrel won't create circular deps.

### Import order (enforced by ESLint import plugin)

1. Node built-ins (`fs`, `path`)
2. External packages (`react`, `zustand`, `react-router-dom`)
3. Internal absolute imports (`@/types`, `@/store`, `@/lib`)
4. Relative imports (`./JobCard`, `../ui/Button`)

Each group separated by a blank line.

### Formatting

- **Prettier** is the canonical formatter. Run `prettier --write` before committing.
- 2-space indentation, single quotes, trailing commas (`"trailingComma": "all"`), 100-character line width.
- Never hand-format code to override Prettier's output.

---

## 2. Component Rules

### Props interface

- **Always define a `Props` interface** immediately above the component function. Do not use inline type literals for props.
- Prefix the interface with the component name: `interface JobCardProps { ... }`.
- Every prop must have a JSDoc comment if its purpose is not self-evident.

```tsx
// ✅ Correct
interface JobCardProps {
  job: Job
  /** Called when the student clicks the Apply button */
  onApply: (jobId: string) => void
  className?: string
}

export function JobCard({ job, onApply, className }: JobCardProps) { ... }

// ❌ Wrong — inline type, no interface
export function JobCard({ job, onApply }: { job: Job; onApply: () => void }) { ... }
```

### Styling

- **No inline styles.** All styling must use Tailwind CSS utility classes.
- Use `clsx` or `cn` (a `clsx` + `twMerge` wrapper) for conditional class composition.
- Never use `style={{ ... }}` props except for dynamic values that cannot be expressed in Tailwind (e.g., a programmatic `--progress` CSS variable for SVG animations).

```tsx
// ✅ Correct
<button className={cn('px-4 py-2 rounded-lg font-medium', isActive && 'bg-brand text-white')} />

// ❌ Wrong — inline style
<button style={{ backgroundColor: '#4F46E5', padding: '8px 16px' }} />
```

### Size limits

- **Maximum 250 lines per component file.** If a component exceeds this, extract sub-components or hooks.
- A component must do one thing. If it fetches, transforms, and renders complex UI, split it.

### Functional components only

- No class components. All components are arrow-function or function-declaration functional components.
- Hooks are the only permitted lifecycle mechanism.

### Accessibility on interactive elements

- Every `<button>`, `<a>`, `<input>`, `<select>`, `<textarea>`, custom interactive element must have:
  - A visible label or `aria-label` / `aria-labelledby`.
  - Correct `role` if the element is not a native interactive HTML element.
  - `disabled` state reflected in both visual style and the `disabled` / `aria-disabled` attribute.
- See §9 for full accessibility rules.

---

## 3. State Management Rules

### When to use the store vs. local state

| Use Zustand store | Use `useState` |
|---|---|
| Data that persists across page navigations | UI-only transient state (is dropdown open?) |
| Data shared between two or more components | Form field values before submission |
| Data that must survive a page reload | Animation state |
| All domain data: jobs, applications, profile, prep | Hover / focus state |

**Rule:** If in doubt, use the store. It is always safe to promote local state to the store; the reverse requires a refactor.

### Store actions

- All store actions must be **pure with respect to domain logic** — given the same prior state and arguments, they produce the same new state.
- **No side effects in actions.** Do not make API calls, set timers, or trigger toasts inside a Zustand action. Side effects belong in the calling component (e.g., call action → then call `showToast()`).
- Use **Immer** for all state mutations. Never return a new state object manually unless the mutation is trivially simple (e.g., replacing a primitive scalar).

```ts
// ✅ Correct — Immer mutation
addSkill: (skill) =>
  set(produce((state) => {
    if (!state.student.skills.includes(skill)) {
      state.student.skills.push(skill)
    }
  })),

// ❌ Wrong — manual spread, easy to miss nested updates
addSkill: (skill) =>
  set((state) => ({
    student: { ...state.student, skills: [...state.student.skills, skill] }
  })),
```

### Derived state

- **Never store derived values in the store.** Computed values (e.g., `filteredJobs`, `readinessScore`, `eligibilityResult`) must be computed by selectors.
- Selectors that are computationally expensive must be memoised with `useMemo` in the calling component or via a `createSelector`-equivalent.

### Selectors

- Selectors are functions that take the store state and return derived data.
- Name them `select<Something>`, e.g., `selectFilteredJobs`, `selectReadinessScore`.
- Co-locate selectors with their slice in the same file.

---

## 4. Testing Rules

### Framework

- **Vitest** for unit and integration tests; **Testing Library** (`@testing-library/react`) for component tests.
- All test files are **co-located** with the source file they test (same directory, `.test.ts` or `.test.tsx` suffix).

### Required test coverage

| Category | Requirement |
|---|---|
| Eligibility logic (`src/lib/eligibility.ts`) | 100% branch coverage. Every criterion pass/fail path must be tested. |
| Store actions (all slices) | All actions tested with initial state and post-mutation assertions. |
| Form validation | Every validation rule has a test asserting the correct error message. |
| Readiness score formula | Snapshot test + boundary tests (all 0, all 100, mixed weights). |
| Component accessibility | Every interactive component has a test asserting correct ARIA attributes. |
| Migration logic | Every `migrate()` function tested with stale state fixtures. |

### Test naming

```ts
describe('checkEligibility', () => {
  it('returns isEligible: true when all criteria pass', () => { ... })
  it('returns isEligible: false when CGPA is below minimum', () => { ... })
  it('omits branch criterion when branches array is empty', () => { ... })
})
```

Use `describe` to group by function/component, `it` (or `test`) with a plain-English sentence that reads like a specification.

### Accessibility tests

Use `@testing-library/jest-dom` + `jest-axe` (or `vitest-axe`) to run automated accessibility audits on every rendered component:

```tsx
import { axe } from 'vitest-axe'

it('has no accessibility violations', async () => {
  const { container } = render(<ApplyModal ... />)
  expect(await axe(container)).toHaveNoViolations()
})
```

---

## 5. Design System Rules

### Colours

- **Only use design token colours** defined in `tailwind.config.ts` under `theme.extend.colors`.
- Permitted token names: `brand`, `brand-light`, `brand-dark`, `success`, `warning`, `danger`, and the full Tailwind greyscale palette (`slate-*`, `gray-*`, `white`, `black`).
- **No hardcoded hex values** (`#4F46E5`) anywhere in component code. If a new colour is needed, add it as a token in `tailwind.config.ts` first.

### Spacing

- All spacing must use Tailwind's 4 px grid: `p-1` (4 px), `p-2` (8 px), `p-4` (16 px), etc.
- No arbitrary spacing values like `p-[13px]` unless there is a documented design reason.

### Typography

- Font family: `Inter` (configured in `tailwind.config.ts`). No other font families.
- Type scale: use Tailwind's `text-xs` through `text-4xl`. No custom font sizes except in `tailwind.config.ts`.

### Icons

- **`lucide-react` is the only permitted icon library.** Do not import from `react-icons`, `heroicons`, `phosphor`, or any other icon package.
- Icons must always have an `aria-hidden="true"` attribute (they are decorative) or an `aria-label` if they are the sole label for an interactive element.

### Custom CSS

- No custom CSS except for complex animations that cannot be achieved with Tailwind's `animate-*` utilities (e.g., SVG stroke-dashoffset animation for the ReadinessRing).
- All custom CSS must live in `src/index.css` under a clearly labelled comment block, never in `<style>` tags or `style` props.

---

## 6. Documentation Rules

### Architecture.md

- Every new module added to `src/modules/` must have its folder and key files added to the Project Structure section in `Architecture.md`.
- Every new store slice must be documented in the Store Architecture section.
- Every new top-level route must be added to the Routing table.

### Schema.md

- Every change to any TypeScript interface in `src/types/index.ts` must be reflected in Schema.md §2 (Full TypeScript Type Definitions).
- Every new `localStorage` key must be added to the localStorage Keys Table (§5).
- Every schema version bump must update §10 (Data Migration Notes) with the migration path.

### Rules.md (this file)

- Any new convention agreed upon by the team or a significant AI-assisted refactor that changes working patterns must be appended to the relevant section of this document.
- Rules must be specific and actionable, not vague aspirations.

### Inline code documentation

- Every exported function and interface must have a JSDoc comment.
- React components must have a one-line JSDoc describing their purpose.
- Complex algorithms (eligibility, readiness score) must have inline comments explaining each step.

---

## 7. Git Conventions

### Commit message format

Follow **Conventional Commits** strictly:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

**Types:**

| Type | Use for |
|---|---|
| `feat` | A new feature or module |
| `fix` | A bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `style` | Formatting, missing semicolons, etc. (no logic change) |
| `test` | Adding or updating tests |
| `docs` | Documentation changes only |
| `chore` | Build config, dependency updates, tooling |
| `perf` | A code change that improves performance |
| `a11y` | Accessibility improvements |

**Scope** = the module or file affected: `dashboard`, `jobs`, `tracker`, `eligibility`, `prep`, `profile`, `store`, `ui`, `docs`, `types`.

**Examples:**

```
feat(jobs): add job filter panel with CTC range slider
fix(eligibility): handle empty requiredSkills array correctly
docs(schema): add migration notes for v1 → v2
test(store): add unit tests for applicationsSlice actions
a11y(modal): add focus trap and ESC key handler to ApplyModal
```

### Branch naming

```
feature/<module-or-feature-name>    # new features
fix/<issue-or-bug-description>      # bug fixes
refactor/<what-is-being-refactored> # refactors
docs/<what-is-being-documented>     # documentation only
```

Examples: `feature/prep-module`, `fix/eligibility-skills-case`, `docs/architecture-component-hierarchy`

### Branching rules

- **Never commit directly to `main`.** All changes go through a feature branch + pull request.
- Feature branches are branched from `main` (or the current development branch if one exists).
- Squash merge feature branches into `main` to keep a clean linear history.
- Delete merged branches immediately.

---

## 8. Error Handling Rules

### Form validation (synchronous)

- Validate **on submit** first. Additionally validate **on blur** for fields the user has already interacted with (`touched` state).
- Display errors **inline**, immediately below the relevant field.
- Error elements must be linked to the input via `aria-describedby`:

```tsx
<input
  id="cgpa"
  aria-describedby={cgpaError ? 'cgpa-error' : undefined}
  aria-invalid={!!cgpaError}
/>
{cgpaError && (
  <p id="cgpa-error" role="alert" className="text-sm text-danger mt-1">
    {cgpaError}
  </p>
)}
```

- All error messages must be **human-readable and actionable**. Never surface raw error objects, stack traces, or technical identifiers to the user.

### Async operations / UI feedback

- Show a **Toast notification** for any action that has a success or failure outcome the user should know about (applying to a job, uploading a resume, logging a score).
- Use `useToast()` hook: `showToast({ type: 'success' | 'error' | 'info', message: string })`.
- Toast messages must be concise (≤ 80 characters).

### Edge cases

- Empty states must always render a helpful message + a call to action. Never show a blank panel.
- If `localStorage` is unavailable (e.g., private browsing in some browsers), the app must still function in-session with in-memory state. Show a one-time banner: "Your progress won't be saved in private browsing mode."

---

## 9. Accessibility Rules

> [!IMPORTANT]
> WCAG 2.1 Level AA is the **mandatory minimum** for all UI in CareerFlow. These rules are non-negotiable.

### Colour and contrast

- All text must meet a **4.5:1 contrast ratio** against its background (AA for normal text).
- Large text (≥ 18 pt or ≥ 14 pt bold) must meet **3:1**.
- **Never convey state with colour alone.** Always pair colour with a secondary indicator (icon, label, pattern, text).

```tsx
// ❌ Wrong — colour alone conveys eligibility
<span className="text-green-500">●</span>

// ✅ Correct — colour + icon + text
<span className="text-success flex items-center gap-1">
  <CheckCircle aria-hidden="true" size={14} />
  Eligible
</span>
```

### Images and icons

- All `<img>` elements must have a non-empty `alt` attribute. Decorative images use `alt=""`.
- All icons from `lucide-react` used decoratively must have `aria-hidden="true"`.
- Icons that are the sole label for a button or link must have a wrapping `aria-label` on the interactive element, not on the icon itself.

### Modals

- All modals (`Modal.tsx`) must:
  - **Trap focus** within the modal while open (use `focus-trap-react` or a custom implementation).
  - Return focus to the trigger element when closed.
  - Close on **ESC** key press.
  - Have `role="dialog"` and `aria-modal="true"`.
  - Have a visible title linked via `aria-labelledby`.

### Keyboard navigation

- **All interactive elements** (buttons, links, inputs, toggles, custom components) must be reachable via **Tab** key.
- All actions performable by mouse must also be performable by keyboard alone.
- Focus indicators must be clearly visible (Tailwind's `focus-visible:ring-2 focus-visible:ring-brand` is the project standard).
- Do not suppress the browser's default focus outline without replacing it with an equally visible custom style.

### Semantic HTML

- Use semantic HTML elements (`<nav>`, `<main>`, `<aside>`, `<header>`, `<section>`, `<article>`, `<h1>`–`<h6>`, `<ul>`/`<ol>`, `<button>`) correctly.
- Do not use `<div>` or `<span>` as interactive elements. If something is clickable, it must be a `<button>` or `<a>`.
- There must be exactly one `<h1>` per page. Heading levels must not skip (e.g., `<h1>` → `<h3>` without `<h2>`).

### Live regions

- Dynamic content changes (toast messages, status updates, eligibility results appearing) must be announced to screen readers via `aria-live="polite"` (or `"assertive"` for critical alerts).

---

## 10. Performance Rules

### Re-renders

- Do not prematurely optimise. Profile first with React DevTools Profiler.
- When profiling confirms excessive re-renders: use `React.memo` for components that receive the same props on parent re-renders, and `useCallback` for stable function references passed as props.
- Use granular Zustand subscriptions (`useStore(state => state.student.cgpa)`) to avoid subscribing to the entire store.

### Images

- All images must use `loading="lazy"` unless they are above-the-fold critical images.
- Use `width` and `height` attributes on all `<img>` tags to prevent cumulative layout shift (CLS).
- Company logos in mock data: use SVG or emoji placeholders; no large raster images.

### Bundle

- **Target bundle size: ≤ 200 KB gzipped** for the initial load. Check with `vite build --report` and review `dist/stats.html`.
- All module-level page components are lazy-loaded with `React.lazy()`.
- Vendor and store chunks are split manually in `vite.config.ts` (see Architecture.md §9).
- Do not import entire icon libraries — always import named exports from `lucide-react`.

### Scripts and blocking

- No synchronous `localStorage` reads on the render path outside of Zustand's rehydration (which happens once at store init).
- No `document.write`, no blocking `<script>` tags.
- All event handlers are debounced or throttled where appropriate (e.g., search input debounce: 300 ms).

---

## 11. Mock Data Rules

### Source of truth

- **All mock data lives in `src/data/`.** There are exactly two files:
  - `jobs.ts` — the `Job[]` array (10 companies minimum).
  - `student.ts` — the default `Student` object.
- **Never** hardcode mock data inline inside a component, hook, or store slice. Always import from `src/data/`.

### Typing

- All mock data must be fully typed. Use `satisfies` or explicit type annotation:

```ts
// ✅ Correct
export const mockJobs: Job[] = [ ... ]

// Also acceptable — satisfies catches excess property errors
export const mockJobs = [ ... ] satisfies Job[]

// ❌ Wrong — untyped
export const mockJobs = [ ... ]
```

### Minimum data requirements

- **10 companies** minimum in `jobs.ts`. All 10 listed in Schema.md §3 must be present.
- The mock data must cover all `JobType` values (`SWE`, `Analyst`, `Core`, `Finance`, `Consulting`) and multiple `Branch` eligibility patterns (branch-restricted and open-to-all).
- The default student profile must be designed so they are eligible for at least 5 and ineligible for at least 2 of the 10 companies, to showcase both states in the Eligibility module.

### No fabricated data in production paths

- Mock data is for development and demo only. If a real backend is added in future, `src/data/` files are replaced by API calls — they must not be imported anywhere except the store's initial state.

---

## 12. Phase Completion Checklist

Before marking **any development phase as complete** (whether tracked in an implementation plan or a project management tool), verify every item below. All items must be ✅ before the phase is considered done.

### Code quality

- [ ] All TypeScript errors resolved (`tsc --noEmit` exits with code 0)
- [ ] All ESLint errors resolved (`eslint src` exits with code 0)
- [ ] No `console.log`, `console.error`, or `debugger` statements in committed code
- [ ] No `TODO` or `FIXME` comments left unresolved (or explicitly deferred with a ticket reference)

### Tests

- [ ] All existing tests pass (`vitest run` exits with code 0)
- [ ] New logic (eligibility, store actions, formulas) has unit tests
- [ ] New forms have validation tests
- [ ] New interactive components have accessibility tests

### Accessibility

- [ ] All interactive elements keyboard-reachable
- [ ] All modals trap focus and close on ESC
- [ ] All images have `alt` text
- [ ] Colour contrast meets WCAG 2.1 AA
- [ ] `axe` audit run on all new pages/components; zero violations
- [ ] State never conveyed by colour alone

### Responsiveness

- [ ] Tested at 375 px (mobile), 768 px (tablet), 1280 px (desktop)
- [ ] No horizontal scroll at any breakpoint
- [ ] Touch targets ≥ 44 × 44 px

### Performance

- [ ] No new unnecessary re-renders (React DevTools Profiler checked)
- [ ] Bundle size still ≤ 200 KB gzipped (`vite build` checked)
- [ ] No new blocking scripts or synchronous render-path operations

### Documentation

- [ ] `Architecture.md` updated if new modules, routes, or slices were added
- [ ] `Schema.md` updated if types or localStorage keys changed
- [ ] `Rules.md` updated if new conventions were established
- [ ] JSDoc comments added to all new exported functions and interfaces

### Final check

- [ ] App runs with `vite dev` without errors or warnings in browser console
- [ ] App builds with `vite build` without errors or warnings
- [ ] All 6 modules navigable and functional
- [ ] localStorage rehydration tested (refresh page; data persists)

---

*End of Rules & Conventions Document*
