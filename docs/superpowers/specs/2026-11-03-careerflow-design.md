# CareerFlow Design Spec

> Canonical design document. Authored by Dev Rahulkumar Pandya & Satyam Singh.
> This file is the spec the Implementation Plan argues from.

---

## 1. Intent & Why

Campus recruitment forces students to manage many drives simultaneously. Job details, eligibility rules, deadlines, preparation material and application status are scattered across notice boards, emails, spreadsheets and chat groups.

CareerFlow collapses this into one student-centred portal. Its tagline — *"Your Career. Your Journey. Your Future."* — names the four-step journey: **Discover → Prepare → Apply → Succeed**.

---

## 2. Goals

| Objective | Attribute | Target |
|---|---|---|
| Eligibility visible at a glance on every job card | Efficiency | ≤ 10 seconds to judge eligibility from job list |
| No applications to ineligible drives | Effectiveness | Zero ineligible submissions |
| Application stage always visible | Effectiveness | Student correctly states current stage |
| Accessible, consistent interface | Satisfaction | SUS ≥ 68 |
| All six modules reachable and completable | Effectiveness | 100% task completion in usability test |

---

## 3. Non-Goals

- Placement officer interface
- Recruiter interface
- Backend, database, real authentication
- Email / push notifications
- Automatic resume parsing
- Native mobile apps

---

## 4. Constraints

- **Client-only.** No network calls at runtime. Everything in `localStorage`.
- **Mock data.** Ten companies with realistic criteria.
- **Responsive.** 320px phone to 1920px desktop.
- **Accessible.** WCAG 2.1 AA. Keyboard-operable. Screen-reader-friendly.
- **Lightweight.** Bundle ≤ 200KB gzipped.

---

## 5. Approaches Considered

| Approach | Trade-off | Decision |
|---|---|---|
| React + TypeScript + Vite + Tailwind | Best ecosystem fit, fast DX, type safety | **Chosen** |
| Next.js | SSR overhead unnecessary for a prototype | Rejected |
| Plain HTML/CSS/JS | No component reuse, harder to maintain | Rejected |
| Redux for state | Too much boilerplate for a prototype | Rejected — use Zustand |
| CSS Modules | Less design-token discipline | Rejected — use Tailwind |

---

## 6. Module Specifications

### 6.1 Dashboard (`/`)

**Purpose:** Overview at a glance. One screen reveals readiness, upcoming deadlines and application status.

**Content:**
- Welcome heading: "Good morning, [name]" + "Your Career. Your Journey. Your Future."
- Journey Stepper: 4 chips (Discover / Prepare / Apply / Succeed) — greyed out completed steps, active highlighted
- Readiness Ring (SVG, 0–100, `role="meter"`)
- Upcoming Deadlines widget: 5 nearest job deadlines not yet applied to
- Stage Count Chips: Applied / Shortlisted / Assessment / Interview / Selected counts, each linking to tracker
- Recommended Jobs: horizontal strip, 3 jobs matched to student's branch preference

**Readiness Formula:**
```
score = DSA_score×0.40 + Aptitude_score×0.20 + Checklist_score×0.25 + Profile_score×0.15
```
Where each component is 0–100:
- DSA: (total problems solved / total problems in all topics) × 100
- Aptitude: last recorded score (0–100)
- Checklist: (checked items / total items) × 100
- Profile: 25 points each for (cgpa > 0, skills.length > 0, resumes.length > 0, branch set)

---

### 6.2 Job Opportunities (`/jobs`)

**Purpose:** Discover and apply to campus drives.

**Job Card anatomy:**
- Company logo (colored letter circle as placeholder)
- Company name + role title (prominent)
- CTC in LPA
- Application deadline (formatted: "Nov 30")
- CGPA requirement
- `EligibilityPill`: green "Eligible" or red "Ineligible"
- Save/bookmark icon (toggle)
- "Apply Now" button: disabled + `disabledReason` if ineligible; enabled if eligible and not already applied; "Applied" chip if already applied

**Filters:**
- Search text (searches company + role)
- Role type: SWE | Analyst | Core | Finance | Consulting (multi-checkbox)
- Min CGPA slider (0–10, 0.5 step)
- Branch filter (multi-select)
- "Saved only" toggle
- Sort: Deadline ↑, CTC ↓, Company A–Z

**Apply flow (2-step modal):**
1. Resume picker: radio buttons per resume; "No resumes — go to Profile" if empty
2. Confirmation: job summary + checkbox "I confirm I want to apply to [Company] for [Role]"; Submit blocked until checked; inline error if submitted unticked

**Post-apply:** success toast → application appears in tracker (Applied stage).

---

### 6.3 Application Tracker (`/tracker`)

**Purpose:** Follow every application from Applied to outcome.

**Five stages:** Applied → Shortlisted → Assessment → Interview → Selected

**Stage column:**
- Header: stage name + application count badge
- Application cards (sorted by deadline)
- "No applications here" empty placeholder

**Application Card:**
- Company logo + name + role
- Applied date
- Next-step nudge (e.g. "Online test on Dec 5")
- "Advance (Demo)" button → calls `advanceApplicationStatus`
- If Selected: "Accept Offer" CTA → confetti animation + status update

**Empty state:** full-page illustration + "No applications yet" + link to /jobs.

---

### 6.4 Eligibility Checker (`/eligibility`)

**Purpose:** What-if analysis before committing to apply.

**Left panel:**
- Company dropdown (all 10 companies)
- Profile summary (branch, CGPA, 10th %, 12th %, skills)
- CGPA override input ("What-if CGPA", labeled, helper: "Change this to see how your eligibility would change")

**Right panel:**
- Overall ELIGIBLE / INELIGIBLE badge
- Results table: Criterion | Your Value | Required | Status (✓ / ✗)
- Criteria checked: CGPA, Active Backlogs, Branch, 10th %, 12th %, Required Skills

**Behaviour:** reactive — updates instantly as override inputs change.

---

### 6.5 Preparation Hub (`/prep`)

**Purpose:** Structured preparation with progress tracking.

**Tabs:** DSA | Aptitude | Resume Checklist | Mock Interviews

**DSA tab:**
- 8 topics: Arrays, Linked Lists, Trees, Graphs, Dynamic Programming, Sorting, Searching, System Design
- Each: topic name, "X / Y solved", `ProgressBar`, "+1 Solved" button
- Store: `prep.dsa[topic].solved`, `prep.dsa[topic].total`

**Aptitude tab:**
- Score history list (date + score)
- "Practice Quiz" button → 3-question placeholder modal → records score

**Resume Checklist tab:**
- 8 items: Contact Info, Professional Summary, Work/Intern Experience, Projects, Technical Skills, Education, Formatting & Length, Keywords for ATS
- Toggleable with `role="checkbox"`, progress bar

**Mock Interviews tab:**
- 3 available slots (e.g. "Nov 10 3pm", "Nov 12 11am", "Nov 15 2pm")
- Book button → slot moves to "Booked" section
- Cancel option

---

### 6.6 Student Profile (`/profile`)

**Purpose:** The student's data that feeds the eligibility engine.

**Section 1 — Personal & Academic:**
Fields: Name, Email, Branch (CS/IT/ECE/ME/CE/EE), Year (2/3/4), CGPA (0–10), 10th %, 12th %, Active Backlogs. All validated on blur. Save → toast.

**Section 2 — Skills:**
Tag input: type + Enter or comma. Remove with ×. Stored in `student.skills`.

**Section 3 — Resumes:**
Upload dropzone: PDF only, ≤ 2MB, max 3 files. Each card: filename, size (KB), upload date, ★ set-primary button, 🗑 delete button.

**Section 4 — Preferences:**
Role type checkboxes. Location tag input.

---

## 7. Cross-Module Links

| Trigger | From | To |
|---|---|---|
| Stage count chip click | Dashboard | Tracker (filtered to stage) |
| Job card eligibility badge click | Jobs | Eligibility Checker (pre-selected company) |
| "Update Profile" link in Eligibility fail | Eligibility | Profile |
| "Go to Profile" in Apply modal (no resume) | Jobs / ApplyModal | Profile |
| Readiness score click | Dashboard | Prep Hub |
| "Browse Jobs" in empty Tracker | Tracker | Jobs |

---

## 8. Accessibility Requirements

- All interactive elements: keyboard-accessible, visible focus ring (`outline: 2px solid #2563EB; outline-offset: 2px`)
- Color never used as the only signal (ELIGIBLE/INELIGIBLE always has text + icon)
- ARIA: `role="dialog"` + `aria-modal` + `aria-labelledby` on modals; `aria-current="page"` on active nav link; `aria-describedby` on disabled buttons; `role="progressbar"` + `aria-valuenow` on progress bars; `role="meter"` on readiness ring
- All images/icons have `aria-label` or `aria-hidden` as appropriate
- Focus trap in modals; ESC closes; focus returns to trigger
- Minimum contrast: 4.5:1 for normal text, 3:1 for large text/UI components

---

## 9. Error & Edge Cases

| Case | Behaviour |
|---|---|
| Student has no resumes and tries to Apply | Apply button opens modal → step 1 shows "Upload a resume first" + link to /profile |
| Student applies to same job twice | `addApplication` guard rejects duplicate; Apply button already shows "Applied" state |
| All jobs filtered out | Empty state: "No jobs match your filters. Clear filters." |
| CGPA override set to 0 or empty | Eligibility checker shows fail for all CGPA-based criteria |
| localStorage corrupted / missing | Store initialises from `DEFAULT_STUDENT` and `MOCK_JOBS` |
| Resume file too large (> 2MB) | Inline error: "File must be under 2MB (PDF only)" — file rejected |
| Profile saved with CGPA = 11 | Inline validation error: "CGPA must be between 0 and 10" |

