# UI/UX Design Documentation — Group 4 To-Do Application

**Role:** UI/UX Designer
**Team Member:** Naivedya Pramod Yadav ([@Not-naive18](https://github.com/Not-naive18))
**Project:** To-Do Web Application (Winter Internship)
**Project Manager:** Vyas Angre
**Team Repository:** [arohi06/To-do-project-GRP-4](https://github.com/arohi06/To-do-project-GRP-4)
**Git Branch:** `feature/ui-ux`
**Target Folders:** `docs/ui-ux/` and `frontend/styles/`

---

## 1. Overview & Objective

This directory contains the complete UI/UX design specifications, wireframes, style guide, interactive screen prototypes, and design-to-code handoff documentation for the Group 4 To-Do Application.

The design covers the **4 core screens** requested in the project brief:
1. **Login & Registration Screen** — Secure user authentication with responsive card layout.
2. **Dashboard Screen** — Executive task overview with real-time KPI metric counters (Total, Pending, Completed, High Priority), visual progress indicators, and upcoming deadline widgets.
3. **Add / Edit Task Screen & Modal** — Intuitive form with input fields for title, description, priority (Low/Medium/High), status (Pending/In Progress/Completed), and due date picker.
4. **Task List Screen** — Dynamic task management interface with instant status toggle checkboxes, multi-criteria filtering (by status, priority, due date), search bar, and action buttons (edit, delete).

---

## 2. Directory Structure

```text
To-do-project-GRP-4/
├── docs/
│   ├── SETUP.md
│   └── ui-ux/
│       ├── README.md                # This design overview document
│       ├── style-guide.md           # Color system, typography, components, spacing
│       ├── wireframes.md            # Structural ASCII & layout wireframes for all 4 screens
│       ├── user-flow.md             # Mermaid diagrams for screen navigation & state flows
│       ├── HANDOFF.md               # Frontend developer handoff guide with CSS classes & HTML snippets
│       └── prototypes/              # Standalone interactive HTML/CSS prototypes (open in browser)
│           ├── index.html           # Full interactive multi-screen prototype with live interactions
│           ├── login.html           # Dedicated Login screen mockup
│           ├── dashboard.html       # Dedicated Dashboard screen mockup
│           ├── task-list.html       # Dedicated Task List & management screen mockup
│           └── add-task-modal.html  # Dedicated Add Task modal dialog mockup
└── frontend/
    └── styles/                      # Modular SCSS & CSS design system stylesheets
        ├── _variables.scss          # Design tokens (colors, font families, shadows, radii)
        ├── _mixins.scss             # Responsive breakpoints, glassmorphism, flex/grid helpers
        ├── _buttons.scss            # Button variants (primary, secondary, danger, ghost, icon)
        ├── _forms.scss              # Input fields, select dropdowns, labels, validation states
        ├── _badges.scss             # Status pills (Pending, In Progress, Completed) & Priority pills
        ├── _cards.scss              # Dashboard KPI metric cards & task item cards
        ├── _modal.scss              # Modal dialog backdrop, headers, form layouts, actions
        ├── _layout.scss             # Navbar, sidebar, app container, responsive grid
        ├── theme.scss               # Unified SCSS entry point
        └── styles.css               # Pre-compiled CSS for immediate testing and styling
```

---

## 3. Design Principles & Goals

- **Clarity & Focus:** Minimize cognitive load; users should be able to view, prioritize, and complete tasks with minimal clicks.
- **Visual Hierarchy:** Essential information (task priority, due date status, completion state) is instantly recognizable through consistent color-coding and typography weight.
- **Accessibility (WCAG 2.1 AA):** All text combinations satisfy high-contrast requirements (minimum 4.5:1 ratio for body copy). Keyboard navigability and ARIA labeling support.
- **Mobile-First Responsiveness:** Seamless experience across Mobile (< 640px), Tablet (640px – 1024px), and Desktop (> 1024px).
- **Smooth Developer Handoff:** Clean CSS classes and modular SCSS that Dhruva Dipak Pimpale (Frontend) can directly import into the Angular application without extra configuration.

---

## 4. Team Collaboration Links

- **Frontend Developer (Dhruva Dipak Pimpale — `feature/frontend`):** Refer to [HANDOFF.md](file:///docs/ui-ux/HANDOFF.md) and [theme.scss](file:///frontend/styles/theme.scss) for ready-to-use classes.
- **Backend Developer (Adhira Mahesh — `feature/backend-api`):** Refer to the data structures documented in [wireframes.md](file:///docs/ui-ux/wireframes.md) and [user-flow.md](file:///docs/ui-ux/user-flow.md).
- **Database Lead (Arohi Tyagi — `feature/database`):** Schema alignments confirmed against `users` and `tasks` tables.
- **QA & Testing (Siddhant Prashant Saravade — `feature/testing-docs`):** Design edge cases (empty states, field validations, long text wrapping) documented in [style-guide.md](file:///docs/ui-ux/style-guide.md).
