# UI/UX Screen Wireframes — Group 4 To-Do Application

**Author:** Naivedya Pramod Yadav ([@Not-naive18](https://github.com/Not-naive18)) — UI/UX Designer  
**Repository:** `arohi06/To-do-project-GRP-4`  
**Git Branch:** `feature/ui-ux`  

This document provides visual ASCII wireframes, layout blueprints, component breakdowns, and responsive behavior for the **4 core screens**:
1. [Screen 1: Login & Authentication Screen](#screen-1-login--authentication-screen)
2. [Screen 2: Dashboard Screen](#screen-2-dashboard-screen)
3. [Screen 3: Add / Edit Task Modal & Screen](#screen-3-add--edit-task-modal--screen)
4. [Screen 4: Task List & Management Screen](#screen-4-task-list--management-screen)

---

## Screen 1: Login & Authentication Screen

### Layout Overview
- Clean centered card on subtle gradient background (`#F8FAFC` to `#EEF2FF`).
- High-contrast form elements with client-side validation feedback.
- Seamless toggle between "Sign In" and "Create Account".

### Desktop Wireframe (`> 1024px`)

```text
+---------------------------------------------------------------------------------------+
|  Group 4 TaskMaster                                            [ Help ]  [ Docs ]    |
|                                                                                       |
|                           +-------------------------------------+                     |
|                           |            [ 🗹 App Logo ]          |                     |
|                           |         Welcome to TaskMaster       |                     |
|                           |      Sign in to manage your tasks   |                     |
|                           |                                     |                     |
|                           |  Email Address                      |                     |
|                           |  +-------------------------------+  |                     |
|                           |  | user@example.com              |  |                     |
|                           |  +-------------------------------+  |                     |
|                           |                                     |                     |
|                           |  Password               [Forgot?]   |                     |
|                           |  +-------------------------------+  |                     |
|                           |  | **********            [ 👁 Show]|  |                     |
|                           |  +-------------------------------+  |                     |
|                           |                                     |                     |
|                           |  [ ] Remember me for 30 days        |                     |
|                           |                                     |                     |
|                           |  +-------------------------------+  |                     |
|                           |  |        [ Sign In Button ]     |  |                     |
|                           |  +-------------------------------+  |                     |
|                           |                                     |                     |
|                           |  ----------------- OR ------------- |                     |
|                           |                                     |                     |
|                           |  Don't have an account?             |                     |
|                           |  [ Sign Up / Create Account Link ]  |                     |
|                           +-------------------------------------+                     |
|                                                                                       |
|   © 2026 Group 4 — Winter Internship | Project Manager: Vyas Angre                     |
+---------------------------------------------------------------------------------------+
```

### Mobile Layout Adjustments (`< 640px`)
- Card extends to full width with `16px` margin padding.
- Button height increases to `48px` for touch accessibility.

---

## Screen 2: Dashboard Screen

### Layout Overview
- Sticky top navigation bar with user profile dropdown and global "+ Add Task" button.
- 4 KPI summary cards: **Total Tasks**, **Completed**, **Pending**, **High Priority**.
- Circular completion progress ring & visual completion bar.
- Recent Tasks widget and Upcoming Deadlines alert panel.

### Desktop Wireframe (`> 1024px`)

```text
+---------------------------------------------------------------------------------------+
| [🗹 TaskMaster]  [ Dashboard ]  [ All Tasks ]  [ Analytics ]     [🔍 Search...]  [+ New Task] [Avatar ▾] |
+---------------------------------------------------------------------------------------+
|                                                                                       |
|  Welcome back, Naivedya! 👋                                 Saturday, 21 Nov 2026     |
|  Here is a summary of your task workload today.                                       |
|                                                                                       |
|  +-------------------+  +-------------------+  +-------------------+  +-------------------+  |
|  | TOTAL TASKS       |  | COMPLETED TASKS   |  | PENDING TASKS     |  | HIGH PRIORITY     |  |
|  |     [ 18 ]        |  |     [ 12 ]        |  |     [ 6 ]         |  |     [ 3 ]         |  |
|  | 🗹 100% Volume    |  | 🟢 66.7% Finished |  | 🟡 Needs action   |  | 🔴 Urgent         |  |
|  +-------------------+  +-------------------+  +-------------------+  +-------------------+  |
|                                                                                       |
|  +--------------------------------------------+  +---------------------------------+  |
|  | OVERALL COMPLETION PROGRESS               |  | UPCOMING DEADLINES (Next 48 hrs) |  |
|  |                                            |  |                                 |  |
|  |  [=======================>        ] 67%    |  | 🔴 Finalize API Knex migration   |  |
|  |  12 of 18 tasks completed                  |  |    Due: Today, 5:00 PM (Overdue)|  |
|  |                                            |  |                                 |  |
|  |  [ View Detailed Analytics -> ]           |  | 🟡 Design UI/UX Screen Prototypes|  |
|  |                                            |  |    Due: Today, 11:59 PM         |  |
|  +--------------------------------------------+  +---------------------------------+  |
|                                                                                       |
|  +---------------------------------------------------------------------------------+  |
|  | RECENT ACTIVE TASKS                                   [ View All Tasks (18) -> ]|  |
|  |---------------------------------------------------------------------------------|  |
|  | [ ] Complete frontend services integration            [ High ]  [ Today ]  [✏][🗑]  |
|  | [x] Configure PostgreSQL schema & Knex seeds          [ Done ]  [ 19 Nov]  [✏][🗑]  |
|  | [ ] Write comprehensive QA test cases                 [ Med  ]  [ Tomorrow][✏][🗑]|  |
|  +---------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------+
```

---

## Screen 3: Add / Edit Task Modal & Screen

### Layout Overview
- Accessible modal dialog overlay (centered with soft backdrop blur).
- Can also be rendered as a standalone dedicated page (`/tasks/new` or `/tasks/:id/edit`).
- Field structure strictly aligned with Backend API and Database schema:
  - `title` (string, required)
  - `description` (text, optional)
  - `priority` (low, medium, high — segmented selector buttons)
  - `status` (pending, in_progress, completed — dropdown or pill selector)
  - `due_date` (date-time picker)

### Wireframe Modal Layout

```text
+-------------------------------------------------------------------+
|  [ Backdrop: rgba(15, 23, 42, 0.5) with blur ]                    |
|                                                                   |
|         +-----------------------------------------------+         |
|         |  Create New Task                       [ ✕ ]  |         |
|         |  Fill in the details below to add a new task. |         |
|         |-----------------------------------------------|         |
|         |                                               |         |
|         |  Task Title *                                 |         |
|         |  +-----------------------------------------+  |         |
|         |  | e.g. Implement user authentication API  |  |         |
|         |  +-----------------------------------------+  |         |
|         |                                               |         |
|         |  Description (Optional)                       |         |
|         |  +-----------------------------------------+  |         |
|         |  | Add notes, requirements, or links...    |  |         |
|         |  |                                         |  |         |
|         |  +-----------------------------------------+  |         |
|         |                                               |         |
|         |  Priority *                                   |         |
|         |  +-------------+  +-------------+  +--------+ |         |
|         |  |   Low  🟢   |  |  Medium 🟡  |  | High 🔴| |         |
|         |  +-------------+  +-------------+  +--------+ |         |
|         |                                               |         |
|         |  Due Date & Time                              |         |
|         |  +-----------------------------------------+  |         |
|         |  | 📅  2026-11-21 23:59                    |  |         |
|         |  +-----------------------------------------+  |         |
|         |                                               |         |
|         |  Status                                       |         |
|         |  +-----------------------------------------+  |         |
|         |  | [ Pending                ▾ ]            |  |         |
|         |  +-----------------------------------------+  |         |
|         |-----------------------------------------------|         |
|         |                  [ Cancel ]  [ 🗹 Create Task ]|         |
|         +-----------------------------------------------+         |
+-------------------------------------------------------------------+
```

---

## Screen 4: Task List & Management Screen

### Layout Overview
- Complete task repository view with real-time live filtering and search.
- Filter Bar: Search input + Status filter tabs (`All`, `Pending`, `In Progress`, `Completed`) + Priority filter (`All`, `High`, `Medium`, `Low`) + Sort options.
- Individual Task Card features:
  - Checkbox for 1-click status toggle (transitions between `Pending` and `Completed` with strike-through animation).
  - Title and expandable description.
  - Due date countdown badge (`Due today`, `Overdue`, `Nov 25`).
  - Priority badge (`High`, `Medium`, `Low`).
  - Quick action buttons (Edit pencil, Delete trash bin with safety confirmation).
- Empty State when no tasks match current search/filters.

### Desktop Wireframe (`> 1024px`)

```text
+---------------------------------------------------------------------------------------+
| [🗹 TaskMaster]  [ Dashboard ]  [ All Tasks (Active) ]           [🔍 Search...]  [+ New Task] |
+---------------------------------------------------------------------------------------+
|                                                                                       |
|  Tasks Management                                           [ + Add New Task Button ] |
|  Manage, prioritize, and track all your team deliverables.                            |
|                                                                                       |
|  +---------------------------------------------------------------------------------+  |
|  | [🔍 Search by task title or description...]               [ Filter ▾ ] [ Sort ▾ ] |  |
|  |                                                                                 |  |
|  | Status:   (•) All (18)   ( ) Pending (6)   ( ) In Progress (0)   ( ) Completed(12)|  |
|  | Priority: [ All Priorities ▾ ]    Sort by: [ Due Date (Soonest) ▾ ]             |  |
|  +---------------------------------------------------------------------------------+  |
|                                                                                       |
|  +---------------------------------------------------------------------------------+  |
|  | [ ]  Design modern UI/UX wireframes & style guide             [ High 🔴 ]       |  |
|  |      docs/ui-ux/ design system covering 4 screens             [ Due Today ⏰ ]   |  |
|  |      Assigned: Naivedya Pramod Yadav                          [ Pending 🟡 ]    |  |
|  |                                                               [ ✏ Edit ] [ 🗑 ] |  |
|  |---------------------------------------------------------------------------------|  |
|  | [ ]  Develop backend REST APIs with Fastify & Knex             [ High 🔴 ]       |  |
|  |      CRUD endpoints for /api/tasks and CORS enabled           [ Due 21 Nov ⏰ ]  |  |
|  |      Assigned: Adhira Mahesh                                  [ Pending 🟡 ]    |  |
|  |                                                               [ ✏ Edit ] [ 🗑 ] |  |
|  |---------------------------------------------------------------------------------|  |
|  | [x]  Create database schema and migrations                    [ High 🔴 ]       |  |
|  |      PostgreSQL knex migrations for users and tasks tables    [ Completed 🟢 ]  |  |
|  |      Assigned: Arohi Tyagi                                    [ ✏ Edit ] [ 🗑 ] |  |
|  |---------------------------------------------------------------------------------|  |
|  | [ ]  Test all app features and prepare QA test cases           [ Medium 🟡 ]     |  |
|  |      Edge cases, empty inputs, network failure verification   [ Due 22 Nov ]    |  |
|  |      Assigned: Siddhant Prashant Saravade                     [ Pending 🟡 ]    |  |
|  |                                                               [ ✏ Edit ] [ 🗑 ] |  |
|  +---------------------------------------------------------------------------------+  |
|                                                                                       |
|  [ Showing 4 of 18 tasks ]                             [ < Previous ] [ 1 ] [ 2 ] [ Next > ] |
+---------------------------------------------------------------------------------------+
```

### Empty State Wireframe (When no tasks match)

```text
+---------------------------------------------------------------------------------------+
|  +---------------------------------------------------------------------------------+  |
|  |                                                                                 |  |
|  |                                   [ 🗹✨ ]                                      |  |
|  |                                No tasks found                                   |  |
|  |             There are no tasks matching your current search or filters.         |  |
|  |                                                                                 |  |
|  |                         [ Clear Filters ]   [ + Create Task ]                   |  |
|  |                                                                                 |  |
|  +---------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------+
```
