# CareerFlow — UI/UX Design Brief

> **Version:** 1.0 · **Audience:** Designers, Front-End Engineers · **Status:** Canonical Reference

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design Tokens](#2-design-tokens)
3. [Component Anatomy](#3-component-anatomy)
4. [Layout System](#4-layout-system)
5. [Module-by-Module Screen Specs](#5-module-by-module-screen-specs)
6. [Interaction Patterns](#6-interaction-patterns)
7. [Accessibility Spec](#7-accessibility-spec)
8. [Responsive Behaviour Table](#8-responsive-behaviour-table)
9. [Motion & Animation](#9-motion--animation)
10. [Error States & Empty States](#10-error-states--empty-states)

---

## 1. Design Philosophy

CareerFlow serves three student personas — Aarav (speed-focused power user), Meera (careful branch-aware comparer), and Rohit (anxiety-prone, needs clear explanations). Every design decision must simultaneously serve all three.

### HCI Principles Applied

| Principle | Application in CareerFlow |
|-----------|--------------------------|
| **Visibility of System Status** | Readiness score ring on Dashboard updates in real-time as profile data changes; application pipeline shows exact current stage at all times; toast notifications confirm every mutating action within 300 ms. |
| **Recognition over Recall** | Company logos, branch tags, and role-type chips are always visible on Job Cards — users never need to remember details from a previous screen. Eligibility Checker shows full criterion table (not just pass/fail summary) so Rohit can see *why* a company is out of reach. |
| **Error Prevention** | Apply button is disabled (not hidden) when CGPA is below threshold; the confirmation dialog requires an explicit checkbox tick before enabling Submit, preventing accidental applications. Duplicate-application guard prevents resubmission. |
| **Fitts's Law** | Primary actions (Apply, Advance Stage, Submit) use full-width buttons on mobile and minimum 44×44 px touch targets everywhere. Sidebar nav items are 48 px tall on desktop. The floating bottom nav on mobile spans the full viewport width. |
| **Gestalt Grouping** | Related controls cluster together: search + filter controls sit in a unified left panel on Jobs; criterion rows in the Eligibility Checker use alternating background rows to separate visual groups. Card borders and shadows create strong figure-ground separation. |
| **Feedback** | Every async action triggers a Toast. Toggling a Resume Checklist item immediately updates the progress bar. Stage advancement plays a micro-animation. CGPA override input in Eligibility Checker re-runs results on every keystroke (debounced 300 ms). |
| **Consistency & Standards** | Primary blue `#2563EB` is used exclusively for primary actions. Teal `#0D9488` means success/eligible everywhere. Red `#EF4444` means error/ineligible everywhere. Button shapes, pill shapes, and card shapes are identical across all modules. |
| **Universal Design** | All interactive elements meet WCAG 2.1 AA contrast. Focus rings are visible on all focusable elements. Screen-reader announcements fire on dynamic content updates. Keyboard navigation follows logical DOM order with skip links. |

---

## 2. Design Tokens

### 2.1 Color Tokens

| Token Name | Hex Value | Usage |
|------------|-----------|-------|
| `color-sidebar-bg` | `#0F2044` | Sidebar background |
| `color-sidebar-text` | `#FFFFFF` | Sidebar labels |
| `color-sidebar-active-border` | `#2563EB` | Active item left border (4 px) |
| `color-sidebar-active-bg` | `#1E3A6E` | Active item background |
| `color-page-bg` | `#F8FAFC` | Main content area background |
| `color-primary` | `#2563EB` | Primary actions, links |
| `color-primary-hover` | `#1D4ED8` | Primary button hover state |
| `color-primary-pressed` | `#1E40AF` | Primary button active/pressed |
| `color-success` | `#0D9488` | Eligible pill, success states |
| `color-success-bg` | `#CCFBF1` | Eligible pill background |
| `color-danger` | `#EF4444` | Ineligible pill, error states |
| `color-danger-bg` | `#FEE2E2` | Ineligible pill background |
| `color-warning` | `#F59E0B` | Warning toasts, pending states |
| `color-warning-bg` | `#FEF3C7` | Warning pill background |
| `color-text-primary` | `#0F172A` | Body copy, headings |
| `color-text-secondary` | `#475569` | Subtext, placeholders |
| `color-text-disabled` | `#94A3B8` | Disabled labels |
| `color-border` | `#E2E8F0` | Card borders, input borders |
| `color-border-focus` | `#2563EB` | Input / button focus ring |
| `color-surface` | `#FFFFFF` | Card and modal surface |
| `color-overlay` | `rgba(0,0,0,0.4)` | Modal backdrop |

### 2.2 Typography

| Token Name | Value | Usage |
|------------|-------|-------|
| `font-family-base` | `'Inter', sans-serif` | All UI text |
| `font-size-xs` | `12px` | Pills, captions, helper text |
| `font-size-sm` | `14px` | Body secondary, input labels |
| `font-size-base` | `16px` | Body primary, button labels |
| `font-size-lg` | `18px` | Card titles, section headers |
| `font-size-xl` | `24px` | Module page titles |
| `font-size-2xl` | `32px` | Dashboard score display |
| `font-weight-regular` | `400` | Body copy |
| `font-weight-medium` | `500` | Labels, nav items |
| `font-weight-semibold` | `600` | Card titles, button labels |
| `font-weight-bold` | `700` | Page headings, score numerals |
| `line-height-tight` | `1.25` | Headings |
| `line-height-normal` | `1.5` | Body copy |

### 2.3 Spacing (4 px grid)

| Token | Value | Tailwind Equivalent |
|-------|-------|---------------------|
| `space-1` | `4px` | `p-1` |
| `space-2` | `8px` | `p-2` |
| `space-3` | `12px` | `p-3` |
| `space-4` | `16px` | `p-4` |
| `space-5` | `20px` | `p-5` |
| `space-6` | `24px` | `p-6` |
| `space-8` | `32px` | `p-8` |
| `space-10` | `40px` | `p-10` |
| `space-12` | `48px` | `p-12` |
| `space-16` | `64px` | `p-16` |

### 2.4 Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Cards (resting) |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.07)` | Cards (hover), dropdowns |
| `shadow-lg` | `0 10px 25px rgba(0,0,0,0.12)` | Modals |
| `shadow-focus` | `0 0 0 3px rgba(37,99,235,0.35)` | Focus rings |

### 2.5 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | `4px` | Inputs, small tags |
| `radius-md` | `6px` | Buttons |
| `radius-lg` | `8px` | Cards |
| `radius-xl` | `12px` | Modals, large panels |
| `radius-full` | `9999px` | Pills, avatar circles |

### 2.6 CSS Custom Properties

```css
:root {
  /* Colors */
  --color-sidebar-bg: #0F2044;
  --color-sidebar-text: #FFFFFF;
  --color-sidebar-active-border: #2563EB;
  --color-sidebar-active-bg: #1E3A6E;
  --color-page-bg: #F8FAFC;
  --color-primary: #2563EB;
  --color-primary-hover: #1D4ED8;
  --color-primary-pressed: #1E40AF;
  --color-success: #0D9488;
  --color-success-bg: #CCFBF1;
  --color-danger: #EF4444;
  --color-danger-bg: #FEE2E2;
  --color-warning: #F59E0B;
  --color-warning-bg: #FEF3C7;
  --color-text-primary: #0F172A;
  --color-text-secondary: #475569;
  --color-text-disabled: #94A3B8;
  --color-border: #E2E8F0;
  --color-border-focus: #2563EB;
  --color-surface: #FFFFFF;
  --color-overlay: rgba(0, 0, 0, 0.4);

  /* Typography */
  --font-family-base: 'Inter', system-ui, sans-serif;
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.5rem;     /* 24px */
  --font-size-2xl: 2rem;      /* 32px */

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.12);
  --shadow-focus: 0 0 0 3px rgba(37, 99, 235, 0.35);

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-full: 9999px;

  /* Motion */
  --duration-fast: 100ms;
  --duration-base: 150ms;
  --duration-slow: 200ms;
  --easing-default: ease-out;
}
```

---

## 3. Component Anatomy

### 3.1 Sidebar

**Structure:** Fixed left column, 240 px wide on `lg+`, collapses to icon-only (64 px) on `md`, hidden on `sm` (replaced by bottom nav).

| Region | Detail |
|--------|--------|
| Logo area | 64 px tall, `#0F2044` bg, CareerFlow wordmark (white, semibold 18 px) + icon |
| Nav items | 48 px tall each; icon (20×20 px) + label (14 px medium); horizontal padding 16 px |
| Active item | 4 px left border `#2563EB`; background `#1E3A6E`; label white bold |
| Hover item | Background `rgba(255,255,255,0.08)`; 150 ms transition |
| Collapsed state (md) | Icons only; tooltip on hover shows label; no text visible |
| Bottom section | "Profile" nav item pinned to bottom via `margin-top: auto` |

**States:**

- **Default:** bg `#0F2044`, text `#FFFFFF` at 70% opacity
- **Hover:** bg `rgba(255,255,255,0.08)`, text 100% opacity, 150 ms ease-out
- **Active:** left border 4 px `#2563EB`, bg `#1E3A6E`, text white bold
- **Focus (keyboard):** Focus ring `var(--shadow-focus)` inset or outline `2px solid #2563EB`

### 3.2 TopBar

**Structure:** 64 px tall, `#FFFFFF` bg, full width of main content area, `border-bottom: 1px solid #E2E8F0`, `position: sticky; top: 0; z-index: 40`.

| Region | Detail |
|--------|--------|
| Left | Module title — 24 px bold `#0F172A` |
| Center (md+) | Global search input — 400 px wide, icon left, placeholder "Search jobs, companies…" |
| Right | Notification bell icon (24 px) + avatar circle (32 px, `#2563EB` bg, initials) |
| Mobile | Hamburger (24 px) opens drawer; search icon opens full-width search bar overlay |

### 3.3 JobCard

**Dimensions:** `width: 100%`, `min-height: 200px`, `border-radius: 8px`, `padding: 24px`, white bg, `shadow-sm`.

| Element | Position / Style |
|---------|-----------------|
| Company logo | Top-left, 40×40 px, rounded-lg, bordered `#E2E8F0` |
| Save icon (bookmark) | Top-right, 20 px, filled `#2563EB` if saved, outline if not; toggle on click |
| Company name | Below logo row, 14 px semibold `#475569` |
| Role title | 18 px semibold `#0F172A`, single line, ellipsis overflow |
| CTC badge | `rounded-full`, bg `#EFF6FF`, text `#1D4ED8`, 12 px medium: e.g. "12 LPA" |
| Deadline | Calendar icon (12 px) + date string, 12 px `#475569` |
| CGPA required | Shield icon + "CGPA ≥ X.X", 12 px `#475569` |
| Eligibility pill | `StatusPill` (ELIGIBLE / INELIGIBLE), bottom-left of card meta row |
| Apply button | `Button variant=primary`, full width, bottom of card |

**States:**

- **Default:** `shadow-sm`, white bg
- **Hover:** `shadow-md`, `translateY(-1px)`, 150 ms ease-out
- **Ineligible card:** Apply button disabled, `opacity-50 cursor-not-allowed`
- **Applied:** Apply button replaced with "Applied ✓" chip (teal, disabled)

### 3.4 StatusPill

**Base:** `border-radius: 9999px`, `padding: 2px 10px`, `font-size: 12px`, `font-weight: 500`.

| Variant | Background | Text Color | Label |
|---------|------------|------------|-------|
| ELIGIBLE | `#CCFBF1` | `#0D9488` | ELIGIBLE |
| INELIGIBLE | `#FEE2E2` | `#EF4444` | INELIGIBLE |
| APPLIED | `#DBEAFE` | `#2563EB` | APPLIED |
| SHORTLISTED | `#FEF3C7` | `#B45309` | SHORTLISTED |
| ASSESSMENT | `#EDE9FE` | `#7C3AED` | ASSESSMENT |
| INTERVIEW | `#FFF7ED` | `#C2410C` | INTERVIEW |
| SELECTED | `#CCFBF1` | `#0D9488` | SELECTED |

### 3.5 Button Variants

All buttons: `font-family: Inter`, `font-weight: 600`, `border-radius: 6px`, `transition: 150ms ease-out`, minimum touch target 44×44 px.

| Variant | Background | Text | Border | Hover bg |
|---------|------------|------|--------|----------|
| **Primary** | `#2563EB` | white | none | `#1D4ED8` |
| **Secondary** | white | `#2563EB` | `1px solid #2563EB` | `#EFF6FF` |
| **Danger** | `#EF4444` | white | none | `#DC2626` |
| **Ghost** | transparent | `#475569` | none | `#F1F5F9` |
| **Disabled** | `#E2E8F0` | `#94A3B8` | none | same (no change) |

**Size variants:**

| Size | Padding | Font size | Height |
|------|---------|-----------|--------|
| sm | `6px 12px` | 14 px | 32 px |
| md (default) | `8px 16px` | 16 px | 40 px |
| lg | `12px 24px` | 16 px | 48 px |

**States:** Default → Hover (bg darkens) → Active/Pressed (scale 0.98) → Focus (shadow-focus ring) → Disabled (opacity 50%, cursor not-allowed, no hover effect).

### 3.6 Modal

**Overlay:** full viewport, `rgba(0,0,0,0.4)`, `backdrop-filter: blur(2px)`.
**Panel:** `border-radius: 12px`, `padding: 32px`, max-width `560px`, white bg, `shadow-lg`, centered vertically and horizontally.

| Region | Detail |
|--------|--------|
| Header | Title 18 px semibold + close button (X icon, 24 px, ghost) — flex row |
| Body | Scrollable if content overflows; max-height `60vh` |
| Footer | Flex row, gap 12 px, actions right-aligned; secondary action left |
| Backdrop click | Closes modal (configurable; disabled for confirmation dialogs) |

**States:** Closed → Opening (200 ms fade-in + scale from 0.95→1) → Open → Closing (100 ms fade-out).
**Focus trap:** On open, focus moves to first focusable element (or close button). Tab cycles within modal. Escape key closes (where permitted).

### 3.7 Toast

**Position:** Bottom-right on desktop, top-center on mobile. `z-index: 9999`.
**Dimensions:** `min-width: 300px`, `max-width: 420px`, `padding: 16px`, `border-radius: 8px`, white bg, `shadow-md`, `border-left: 4px solid <variant-color>`.

| Variant | Border color | Icon |
|---------|-------------|------|
| Success | `#0D9488` | ✓ circle (teal) |
| Error | `#EF4444` | ✗ circle (red) |
| Warning | `#F59E0B` | ⚠ (amber) |
| Info | `#2563EB` | ℹ circle (blue) |

**Anatomy:** Icon (20 px) + message text (14 px) + optional "Undo" link + dismiss X button.
**Auto-dismiss:** 4 000 ms by default; 6 000 ms for errors.
**Animation:** Slides in from right (desktop) in 100 ms ease-out; fades + slides out on dismiss.

### 3.8 ProgressBar

**Base:** `border-radius: 9999px`, height `8px`, bg `#E2E8F0`.
**Fill:** `border-radius: 9999px`, bg matches context (primary `#2563EB` for readiness, teal for solved problems). Width transition `300ms ease-out` on value change.

| Variant | Fill color | Usage |
|---------|-----------|-------|
| Default | `#2563EB` | Readiness score, general |
| Success | `#0D9488` | DSA solved progress |
| Warning | `#F59E0B` | Partially complete checklist |

**Label:** Percentage text (12 px semibold) displayed to the right of bar, or above for wider contexts.

### 3.9 Stepper (Application Pipeline)

**Orientation:** Horizontal on `lg+`, vertical on `sm`.
**Step states:**

| State | Circle | Line | Label |
|-------|--------|------|-------|
| Completed | Filled `#0D9488`, ✓ icon white | Solid teal | 12 px semibold teal |
| Active | Filled `#2563EB`, step number white | Dashed gray right-side | 12 px semibold blue |
| Upcoming | Outlined `#E2E8F0`, step number gray | Dashed gray | 12 px regular gray |

Step circle: 32×32 px, `border-radius: 50%`. Connector line: `2px` solid/dashed, stretches to fill gap between circles. Labels sit below circles.

---

## 4. Layout System

### 4.1 Global Shell

```
┌─────────────────────────────────────────────────┐
│  Sidebar (240px)  │  TopBar (full width, 64px)  │
│  fixed, full-h    │─────────────────────────────│
│  bg #0F2044       │  Main Content Area          │
│                   │  bg #F8FAFC                 │
│  [Logo]           │  padding: 32px              │
│  [Nav items]      │  overflow-y: auto           │
│  ...              │                             │
│  [Profile]        │                             │
└─────────────────────────────────────────────────┘
```

| Breakpoint | Sidebar | TopBar | Bottom Nav |
|------------|---------|--------|------------|
| `xl` (1280+) | 240 px fixed | Full width minus 240 px | Hidden |
| `lg` (1024–1279) | 240 px fixed | Full width minus 240 px | Hidden |
| `md` (768–1023) | Icon-only 64 px, expandable drawer | Full width minus 64 px | Hidden |
| `sm` (640–767) | Hidden (drawer on hamburger) | Full width | Visible, 56 px |
| `xs` (<640) | Hidden (drawer on hamburger) | Full width | Visible, 56 px |

### 4.2 Main Content Area

- `margin-left: 240px` on `lg+`, `64px` on `md`, `0` on `sm`
- `padding-top: 64px` (TopBar height)
- `padding: 32px` inner content padding on desktop; `16px` on mobile
- `max-width: 1440px` (centered for ultra-wide screens)

### 4.3 Mobile Bottom Nav

Height: 56 px. Background: white. `border-top: 1px solid #E2E8F0`. Five nav items: Dashboard, Jobs, Tracker, Prep, Profile. Active item: icon + label in `#2563EB`, others `#94A3B8`. Touch targets full height × equal-width columns.

---

## 5. Module-by-Module Screen Specs

### 5.1 Dashboard

**Page layout:** CSS grid, 12-column on `lg+`, 6-column on `md`, 1-column on mobile.

```
┌──────────────────────────────────────────────────────┐
│  Readiness Score Ring (col 1-4)  │  Deadlines (5-8) │
│                                  │  Stage Chips (9-12)│
├──────────────────────────────────────────────────────┤
│  Recommended Jobs — horizontal scroll strip (full)   │
└──────────────────────────────────────────────────────┘
```

**Readiness Score Ring:**
- SVG `<circle>` with `stroke-dasharray` / `stroke-dashoffset` for arc fill
- Center: score numeral (32 px bold), "/ 100" (14 px secondary), "Readiness" label (12 px secondary)
- Color gradient: 0–40 red, 41–70 amber, 71–100 teal (stroke color of arc)
- Ring size: 160×160 px on desktop, 120×120 px on mobile

**Deadlines Widget (card):**
- Title: "Upcoming Deadlines" (18 px semibold)
- List of up to 5 items: company logo (24 px) + role name + deadline date chip (colored by urgency: red if ≤ 3 days, amber ≤ 7 days, gray otherwise)
- "View all" ghost link at bottom

**Stage Count Chips:**
- Row of 5 chips: Applied | Shortlisted | Assessment | Interview | Selected
- Each chip: `StatusPill` variant + count badge (bold numeral, 24 px, centered above pill)
- Clicking a chip navigates to Tracker filtered to that stage

**Recommended Jobs Strip:**
- Horizontal scroll container, `overflow-x: auto`, `scroll-snap-type: x mandatory`
- Each mini-card: 200 px wide (snap unit), company logo + role + CTC + ELIGIBLE pill + "Apply" button
- Scroll arrows (left/right, 32 px circle, `shadow-md`) on desktop. Hidden on mobile.

### 5.2 Job Opportunities

**Desktop (lg+) layout:** Two-column grid — left filter sidebar (280 px fixed), right card grid (`flex: 1`).

**Filter Sidebar:**
- "Filters" heading + "Reset" ghost link (right-aligned)
- **Search:** Text input with magnifier icon, searches company name + role
- **Branch:** Multi-select checkbox group (CS, ECE, ME, EE, Civil…)
- **Role Type:** Radio group (Full-time, Internship, Both)
- **Min CGPA:** Slider (0.0–10.0, step 0.1) + numeric input
- **Saved only:** Toggle switch
- **Apply Filters** primary button (full-width, bottom of sidebar)

**Card Grid:**
- `display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px`
- Sort bar above grid: "Sort by:" + segmented control (Deadline | CTC | Company)
- Results count: "Showing 24 of 58 jobs" (14 px secondary, left-aligned in sort bar)

**Mobile:** Filter sidebar becomes a bottom sheet triggered by a "Filter" FAB (floating action button, bottom-right). Card grid becomes single column.

**Job Card anatomy (detailed):**

```
┌────────────────────────────────────────┐
│  [Logo 40×40]           [Save icon]   │
│  Company Name (14px secondary)         │
│  Role Title (18px semibold primary)    │
│  ─────────────────────────────────     │
│  [CTC chip]  [Deadline]  [CGPA req]   │
│  [ELIGIBLE pill]                       │
│                                        │
│  [      Apply Now (primary btn)      ] │
└────────────────────────────────────────┘
```

### 5.3 Application Tracker

**Layout:** Full-width horizontal scroll container with 5 stage columns. Each column: `min-width: 260px`, `max-width: 300px`.

**Column header:** Stage name (14 px semibold) + count badge (white, `#2563EB` bg, 20×20 px circle).

**Application Card (within column):**
- White card, `border-radius: 8px`, `padding: 16px`, `shadow-sm`
- Company logo (32 px) + company name (12 px secondary) — row
- Role title (16 px semibold)
- Deadline: calendar icon + date (12 px secondary)
- **Next-step nudge:** amber info box (`#FEF3C7` bg, `#B45309` text), 12 px, e.g. "Complete HackerRank assessment by Nov 10"
- **Demo Advance button:** ghost small, "→ Advance Stage"
- **Offer stage only:** "Accept Offer" primary button (green variant)

**Pipeline Stepper:** Displayed above the columns as a horizontal Stepper component (see §3.9), showing current stage highlighted.

### 5.4 Eligibility Checker

**Desktop (lg+):** Two-panel layout — left 360 px input panel, right flexible results panel. `gap: 24px`.

**Left panel:**
- "Company" dropdown (searchable select) — lists all available companies
- "Your Profile" summary card (read-only): CGPA, Branch, 10th %, 12th %, Backlogs, Skills (tags)
- "What-if CGPA Override" input (numeric, 0–10, step 0.01) with help text "Simulate a target CGPA"
- "Check Eligibility" primary button

**Right panel (results):**
- Company logo + name header (24 px semibold)
- Results table:

| Criterion | Required | Your Value | Status |
|-----------|----------|------------|--------|
| CGPA | ≥ 7.5 | 7.2 | ❌ |
| Backlogs | 0 | 0 | ✅ |
| Branch | CS, ECE | CS | ✅ |
| 10th % | ≥ 70 | 82 | ✅ |
| 12th % | ≥ 70 | 75 | ✅ |
| Skills | Python, SQL | Python | ⚠ Partial |

- Overall verdict: large `StatusPill` (ELIGIBLE / INELIGIBLE) + summary sentence
- If ineligible: "Improve CGPA by X.X points to qualify" actionable guidance text
- "Update Profile" ghost link

**Mobile:** Stacked — inputs above, results below; full-width panels.

### 5.5 Preparation Hub

**Tab Bar:** 4 tabs — DSA | Aptitude | Resume Checklist | Mock Interviews
- Active tab: bottom border `3px solid #2563EB`, label `#2563EB` semibold
- Inactive: label `#475569`, no border
- Tab height: 48 px, full-width on mobile (25% each)

**DSA Tab:**
- Grid: `repeat(auto-fill, minmax(180px, 1fr))`, gap 16 px
- Topic card: topic name (16 px semibold) + "X / Y problems" (12 px secondary) + ProgressBar (success variant, fills per solved count)
- Clicking topic card: opens modal with problem list (name + difficulty chip + solved checkbox)

**Aptitude Tab:**
- Score history graph: simple bar chart (last 5 quiz scores), SVG or recharts; x-axis = date, y-axis = score (0–100)
- "Start Practice Quiz" primary button — launches a quiz modal (10 questions, timer, MCQ)
- Recent quiz history list: date + score + duration

**Resume Checklist Tab:**
- Checklist items (8–12 items): "Add quantified achievements", "Include LinkedIn URL", etc.
- Each item: checkbox (custom styled, teal when checked) + label (14 px) + optional help tooltip (ℹ icon)
- Progress summary at top: "7 / 12 complete" + ProgressBar
- Checking an item triggers ProgressBar update + readiness score recalculation (dashboard updates)

**Mock Interviews Tab:**
- Calendar: 7-day week view, slots shown as 30-min blocks; available = blue outline, booked = blue filled, unavailable = gray
- Clicking available slot: opens booking modal (slot date/time + confirm button)
- Booked interviews list below calendar: slot date/time + "Cancel" ghost link + "Join (coming soon)" disabled button

### 5.6 Student Profile

**Layout:** Vertical section scroll (no tab sidebar needed for MVP) with three `<section>` cards stacked. On `lg+`, a sticky right-column summary card shows completion percentage.

**Section 1 — Personal / Academic:**
- Form fields (label + input/select, vertical layout, gap 16 px):
  - Full Name (text)
  - Branch (select: CS / ECE / ME / EE / Civil / Other)
  - Year of Study (select: 1 / 2 / 3 / 4)
  - CGPA (numeric, 0–10, step 0.01)
  - 10th % (numeric, 0–100)
  - 12th % (numeric, 0–100)
  - Active Backlogs (number, min 0)
- "Save Changes" primary button (bottom-right of section)

**Section 2 — Skills:**
- Tag input: type skill name + Enter/comma to add; rendered as chips (`#EFF6FF` bg, `#1D4ED8` text, × to remove)
- Suggestions dropdown (10 common skills) on focus
- Max 20 skills; counter badge "X / 20" top-right

**Section 3 — Resumes:**
- Upload dropzone: `2px dashed #E2E8F0` border, rounded-xl, center-aligned — drag-and-drop or "Browse" click. Accept `.pdf` only. Max 5 MB.
- Uploaded resume card: PDF icon + filename (14 px) + file size (12 px secondary) + "Preview" link + "Delete" ghost danger link + ⭐ "Set as Primary" toggle
- Primary resume highlighted with `border-left: 3px solid #0D9488`

---

## 6. Interaction Patterns

### 6.1 Apply Flow (Step-by-Step)

1. User clicks **"Apply Now"** on a JobCard (enabled only when ELIGIBLE)
2. **Resume Picker Modal** opens (200 ms fade-in + scale):
   - Title: "Select Resume for [Role] at [Company]"
   - Lists uploaded resumes (radio select); primary resume pre-selected
   - "Upload new resume" ghost link → opens upload dropzone inline
3. User selects resume, clicks **"Continue"**
4. **Confirmation Dialog** (within same modal, or step 2 of a 2-step modal):
   - Summary: company, role, resume filename
   - Checkbox: "I confirm this application is accurate and complete" (required)
   - Submit button: **disabled** until checkbox is ticked
5. Checkbox ticked → Submit button becomes enabled (primary)
6. User clicks **Submit**
7. Loading state on button (spinner, "Submitting…"), 500 ms simulated async
8. Modal closes → **Success Toast** slides in: "Applied to [Role] at [Company]!"
9. JobCard Apply button replaced with "Applied ✓" chip (disabled, teal)
10. Application Tracker automatically gains new card in "Applied" column

**Error path (checkbox not ticked before submit attempt via keyboard):** Inline error text "Please confirm before submitting" in red (12 px) appears below checkbox; checkbox border turns red. Submit button remains disabled.

### 6.2 Eligibility Fail State

- Apply button: `disabled`, `opacity-50`, `cursor-not-allowed`
- Tooltip on hover/focus: "You are ineligible: CGPA below threshold. [View Details →]"
- "View Details" link opens Eligibility Checker pre-filled with this company
- `aria-describedby` points Apply button to hidden tooltip text for screen readers

### 6.3 Toast Patterns

| Trigger | Variant | Message |
|---------|---------|---------|
| Application submitted | Success | "Applied to [Role] at [Company]!" |
| Profile saved | Success | "Profile updated successfully" |
| Resume uploaded | Success | "Resume '[filename]' uploaded" |
| Resume deleted | Info + Undo | "Resume deleted · Undo" (6 s) |
| Application error | Error | "Failed to submit. Please try again." |
| Filter reset | Info | "Filters cleared" |

Toasts stack vertically (newest on top on desktop, newest at top on mobile). Max 3 visible at once; oldest auto-dismiss first.

### 6.4 Dialog Focus Trap

1. On modal open: all elements outside modal receive `aria-hidden="true"` and `inert`
2. Focus moves to first focusable element (close button or first input)
3. Tab key cycles forward through focusable elements within modal
4. Shift+Tab cycles backward
5. Escape closes modal (except confirmation dialogs — Escape does nothing; user must explicitly Cancel or Submit)
6. On close: focus returns to the element that triggered the modal

### 6.5 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `?` | Opens keyboard shortcuts help modal |
| `G` then `D` | Go to Dashboard |
| `G` then `J` | Go to Jobs |
| `G` then `T` | Go to Tracker |
| `G` then `P` | Go to Prep Hub |
| `/` | Focus global search bar |
| `Escape` | Close modal / clear search |
| `←` / `→` | Navigate Tracker stage columns (when focused) |
| `Enter` on JobCard | Open job detail / trigger Apply |

---

## 7. Accessibility Spec

### 7.1 ARIA Roles Per Component

| Component | ARIA Role / Attributes |
|-----------|------------------------|
| Sidebar nav | `<nav aria-label="Main navigation">`, `<ul role="list">`, each item `<a role="link" aria-current="page">` for active |
| TopBar search | `<input role="searchbox" aria-label="Search jobs and companies">` |
| JobCard | `<article>`, Apply button `aria-label="Apply to [Role] at [Company]"` |
| StatusPill | `<span role="status" aria-label="Eligibility: ELIGIBLE">` |
| Modal | `<div role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-desc">` |
| Toast | `<div role="alert" aria-live="assertive" aria-atomic="true">` (error/success), `aria-live="polite"` (info) |
| ProgressBar | `<div role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" aria-label="Readiness score">` |
| Application Stepper | `<ol aria-label="Application stages">`, each step `<li aria-current="step">` for active |
| Tabs | `<div role="tablist">`, each `<button role="tab" aria-selected aria-controls>`, panels `role="tabpanel"` |
| Checkbox (confirm) | `<input type="checkbox" aria-required="true" aria-describedby="confirm-error">` |
| Disabled button | `aria-disabled="true"` (not `disabled` attr, so tooltip is still focusable) |

### 7.2 Focus Order

Focus follows logical DOM reading order. Tab order per screen:

**Jobs page:** Search input → Filter sidebar (each control in visual top-to-bottom order) → Apply Filters button → Sort control → Job cards (each card: Save icon → Apply button, in visual order) → Pagination

**Apply Modal:** Close button → Resume list (radio items) → Continue → (step 2) Checkbox → Cancel → Submit

### 7.3 Skip Links

A visually hidden "Skip to main content" `<a>` link is the first focusable element in the DOM. On focus, it becomes visible (white bg, `#2563EB` text, `shadow-md`, `z-index: 9999`). Activating it moves focus to `<main id="main-content">`.

### 7.4 Color Contrast Pairs (WCAG 2.1 AA)

| Foreground | Background | Ratio | Passes |
|------------|------------|-------|--------|
| `#0F172A` | `#F8FAFC` | 18.1:1 | ✅ AAA |
| `#FFFFFF` | `#2563EB` | 4.6:1 | ✅ AA |
| `#FFFFFF` | `#0F2044` | 14.8:1 | ✅ AAA |
| `#0D9488` | `#CCFBF1` | 3.5:1 | ✅ AA (large text) |
| `#EF4444` | `#FEE2E2` | 3.1:1 | ✅ AA (large text) |
| `#475569` | `#FFFFFF` | 5.9:1 | ✅ AA |
| `#1D4ED8` | `#EFF6FF` | 4.8:1 | ✅ AA |

> [!NOTE]
> `#0D9488` on `#CCFBF1` and `#EF4444` on `#FEE2E2` pass AA for large text (18 px+ or 14 px bold). Pills use 12 px bold — verify with specific rendering at 1x.

### 7.5 Screen Reader Announcements

| Event | Announcement (aria-live) |
|-------|--------------------------|
| Application submitted | "Success: Applied to Software Engineer at Google." (assertive) |
| Stage advanced in Tracker | "Application moved to Interview stage." (polite) |
| Filters applied | "Showing 14 of 58 jobs after filters applied." (polite) |
| Eligibility result loaded | "Eligibility check complete: Ineligible for Google. Reason: CGPA below 8.0." (polite) |
| Resume checklist item toggled | "Checklist: 8 of 12 items complete." (polite) |
| Readiness score change | "Readiness score updated to 74 out of 100." (polite) |

---

## 8. Responsive Behaviour Table

| Module | `xs` (<640) | `sm` (640–767) | `md` (768–1023) | `lg` (1024–1279) | `xl` (1280+) |
|--------|-------------|----------------|-----------------|------------------|-------------|
| **Dashboard** | Score ring full-width → Deadlines → Chips → Jobs (stacked) | Same as xs | 2-col: [Ring+Chips] [Deadlines]; Jobs strip full-width | 3-col grid + Jobs strip | 4-col grid + wide Jobs strip |
| **Jobs** | Single-col cards; filter bottom sheet via FAB | Same | 2-col cards; filter bottom sheet | Filter sidebar (280px) + 2-col card grid | Filter sidebar + 3-col card grid |
| **Tracker** | Vertical stage list (collapse stages); cards stacked | Horizontal scroll of stage columns (260px min) | Horizontal scroll | Horizontal scroll, all 5 columns visible | Horizontal scroll, columns expand to fill |
| **Eligibility Checker** | Input panel → Results panel (stacked) | Stacked | 2-panel side-by-side (360px + rest) | 2-panel | 2-panel with wider results |
| **Prep Hub** | Tab bar full-width (25% each); content stacked | Same | Tab bar; DSA grid 3-col | DSA grid 4-col | DSA grid 5-col |
| **Profile** | Sections stacked, no sticky sidebar | Stacked | Sections stacked | Sections + sticky completion card (240px right) | Wider form (640px) + sticky card |

---

## 9. Motion & Animation

All motion respects `prefers-reduced-motion: reduce` — if the media query matches, transitions are reduced to instant (0 ms) or simple opacity cross-fades.

### 9.1 Transition Catalogue

| Element / Event | Duration | Easing | Property |
|-----------------|----------|--------|----------|
| Sidebar nav item hover | 150 ms | ease-out | background-color, color |
| Sidebar collapse/expand | 250 ms | ease-in-out | width |
| Button hover | 150 ms | ease-out | background-color, transform (scale) |
| Button active press | 100 ms | ease-out | transform: scale(0.98) |
| JobCard hover | 150 ms | ease-out | box-shadow, transform: translateY(-1px) |
| Modal open | 200 ms | ease-out | opacity (0→1), transform: scale(0.95→1) |
| Modal close | 150 ms | ease-in | opacity (1→0), transform: scale(1→0.95) |
| Toast slide-in (desktop) | 100 ms | ease-out | transform: translateX(100%→0) |
| Toast slide-out | 150 ms | ease-in | transform: translateX(0→100%), opacity (1→0) |
| Toast slide-in (mobile) | 100 ms | ease-out | transform: translateY(-100%→0) |
| ProgressBar fill change | 300 ms | ease-out | width |
| Stepper stage advance | 400 ms | ease-in-out | fill color + connector line draw |
| Tab switch | 150 ms | ease-out | opacity, transform: translateX (fade-slide) |
| Score ring arc | 600 ms | ease-out | stroke-dashoffset (on initial mount) |
| Eligibility row appear | 200 ms | ease-out | opacity + translateY(8px→0), staggered 40 ms per row |
| Confetti (offer accepted) | 2 000 ms | ease-out | particle burst + fade |
| Checklist item toggle | 100 ms | ease-out | checkbox fill + ProgressBar width |

### 9.2 Stagger Patterns

- Eligibility criteria rows: each row appears 40 ms after the previous
- Job card grid on load: cards fade-in with 30 ms stagger per card (max 10 cards animated, rest instant)
- Dashboard widgets: stagger 80 ms between sections on initial mount

---

## 10. Error States & Empty States

### 10.1 Dashboard

| Condition | Empty State |
|-----------|------------|
| No upcoming deadlines | Deadlines widget: calendar illustration + "No upcoming deadlines. Browse jobs to apply!" + "Browse Jobs" primary button |
| No applications | Stage chips all show 0; no action needed, chips still visible |
| No recommended jobs | Recommended strip: briefcase illustration + "No recommendations yet. Complete your profile!" + "Update Profile" link |
| Profile incomplete (CGPA = 0) | Amber banner at top: "Complete your profile to see personalized jobs. Your readiness score may be inaccurate." |

### 10.2 Job Opportunities

| Condition | Empty State |
|-----------|------------|
| Zero jobs match filters | Card grid area: search illustration + "No jobs match your filters." + "Reset Filters" ghost button + "Broaden your search" hint |
| All jobs applied to | Same illustration but message: "You've applied to all available jobs!" |
| Search returns nothing | "No results for '[query]'" + spelling suggestion if possible + "Clear search" link |
| CGPA = 0 in profile | Banner above card grid: "Set your CGPA in Profile to see eligibility for jobs." |

### 10.3 Application Tracker

| Condition | Empty State |
|-----------|------------|
| No applications at all | Full-width centered: pipeline graphic (faded) + "No applications yet." + "Browse Jobs" primary button |
| Stage column is empty | Column shows a dashed card outline: "No applications in this stage" (12 px secondary, centered) |
| All applications rejected/expired | Info banner: "Looks quiet here. Check out new job openings!" + link |

### 10.4 Eligibility Checker

| Condition | Error/Empty State |
|-----------|-------------------|
| No company selected | Results panel: "Select a company on the left to check your eligibility." (instructional placeholder) |
| Profile incomplete | Results panel: amber warning card: "Your profile is incomplete. Results may be inaccurate. [Complete Profile →]" |
| CGPA override out of range | Inline input error: "CGPA must be between 0 and 10." in red below input |

### 10.5 Preparation Hub

| Condition | Empty State |
|-----------|------------|
| No problems solved (DSA) | Topic cards show 0 / N with empty progress bar; no special empty state needed |
| No quiz history (Aptitude) | Score graph area: "No quiz history yet. [Start Practice Quiz →]" |
| Checklist all unchecked | All items visible unchecked; no special empty state |
| No mock interview slots booked | Booked list: "No interviews booked. Pick a slot from the calendar above." |

### 10.6 Student Profile

| Condition | Error/Empty State |
|-----------|-------------------|
| No resumes uploaded (user tries to Apply) | Apply button blocked; tooltip: "Upload a resume in your Profile first. [Go to Profile →]" |
| No resumes uploaded (on Profile page) | Dropzone with extra emphasis: "Upload your resume to start applying to jobs." |
| No skills added | Skills section: "Add skills to improve eligibility matching." inline hint below empty tag input |
| Form validation errors | Each invalid field: red border + error message below (e.g., "CGPA must be between 0 and 10"); "Save Changes" disabled until all errors resolved |
