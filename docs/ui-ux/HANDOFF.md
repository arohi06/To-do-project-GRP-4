# Frontend Developer Handoff Guide

**Group 4 To-Do Application**  
**Designer:** Naivedya Pramod Yadav ([@Not-naive18](https://github.com/Not-naive18))  
**Frontend Developer:** Dhruva Dipak Pimpale ([@Dhruva-Pimpale](https://github.com/))  
**Backend API Developer:** Adhira Mahesh  
**Database Lead:** Arohi Tyagi  
**Project Manager:** Vyas Angre  

---

## 1. Quick Start for Dhruva (Frontend Dev)

All shared CSS and SCSS styles are organized under `frontend/styles/`.  
In your Angular application, `frontend/src/styles.scss` has been configured to import `frontend/styles/theme.scss`.

Every component in Angular can directly use these utility and component classes without writing custom CSS!

---

## 2. Core CSS Class Index

### Buttons
- `.btn .btn-primary`: Primary call-to-action button (Indigo `#4F46E5`).
- `.btn .btn-secondary`: Outline/neutral button (Gray/White).
- `.btn .btn-danger`: Red alert button for Delete actions (`#EF4444`).
- `.btn-sm`, `.btn-lg`: Size modifiers.
- `.btn-icon`: Square/circular icon action button (Edit, Delete, Close).

### KPI Stat Cards (Dashboard)
- `.stat-grid`: 4-column responsive grid container.
- `.stat-card`: Individual card surface with shadow.
- `.stat-card-total`, `.stat-card-completed`, `.stat-card-pending`, `.stat-card-urgent`: Semantic accent variants.
- `.stat-label`: Uppercase muted text.
- `.stat-value`: Large bold counter number.

### Status & Priority Badges
- Status badges:
  - `.badge-status-pending` (Amber / Yellow)
  - `.badge-status-inprogress` (Blue / Indigo)
  - `.badge-status-completed` (Emerald / Green)
- Priority badges:
  - `.badge-priority-low` (Slate / Green)
  - `.badge-priority-medium` (Amber / Orange)
  - `.badge-priority-high` (Red / Rose)

### Task List Elements
- `.task-card`: Card wrapper for individual tasks.
- `.task-card.is-completed`: Applies muted text and strike-through styling.
- `.task-checkbox`: Custom styled accessible checkbox.
- `.task-title`: Main task heading.
- `.task-meta`: Flex container for badges and due date.
- `.task-actions`: Container for Edit and Delete buttons.

### Form Inputs & Modals
- `.form-group`: Spaced container for label + input + error text.
- `.form-label`: SemiBold field label.
- `.form-input`: Clean input field with focus ring.
- `.form-textarea`: Multi-line text field for description.
- `.form-select`: Styled native dropdown.
- `.modal-backdrop`: Dark blurred overlay.
- `.modal-dialog`: Centered white dialog box with animations.

---

## 3. Angular Component Template Snippets

### A. Dashboard KPI Cards Template
```html
<div class="stat-grid">
  <!-- Total Tasks -->
  <div class="stat-card stat-card-total">
    <div class="stat-header">
      <span class="stat-label">Total Tasks</span>
      <span class="stat-icon">📋</span>
    </div>
    <div class="stat-value">{{ tasks.length }}</div>
    <div class="stat-footer">All team deliverables</div>
  </div>

  <!-- Completed Tasks -->
  <div class="stat-card stat-card-completed">
    <div class="stat-header">
      <span class="stat-label">Completed</span>
      <span class="stat-icon">✅</span>
    </div>
    <div class="stat-value">{{ completedCount }}</div>
    <div class="stat-footer text-success">{{ completionRate }}% completion rate</div>
  </div>

  <!-- Pending Tasks -->
  <div class="stat-card stat-card-pending">
    <div class="stat-header">
      <span class="stat-label">Pending</span>
      <span class="stat-icon">⏳</span>
    </div>
    <div class="stat-value">{{ pendingCount }}</div>
    <div class="stat-footer text-warning">Requires attention</div>
  </div>

  <!-- High Priority Tasks -->
  <div class="stat-card stat-card-urgent">
    <div class="stat-header">
      <span class="stat-label">High Priority</span>
      <span class="stat-icon">🔥</span>
    </div>
    <div class="stat-value">{{ highPriorityCount }}</div>
    <div class="stat-footer text-danger">Urgent deadlines</div>
  </div>
</div>
```

### B. Task Card Template (Inside `*ngFor="let task of filteredTasks"`)
```html
<div class="task-card" [class.is-completed]="task.status === 'completed'">
  <!-- Status Checkbox -->
  <input 
    type="checkbox" 
    class="task-checkbox" 
    [checked]="task.status === 'completed'"
    (change)="toggleTaskStatus(task)"
  />

  <!-- Task Details -->
  <div class="task-content">
    <h4 class="task-title">{{ task.title }}</h4>
    <p class="task-desc" *ngIf="task.description">{{ task.description }}</p>
    
    <div class="task-meta">
      <!-- Priority Badge -->
      <span class="badge" [ngClass]="'badge-priority-' + task.priority.toLowerCase()">
        {{ task.priority }}
      </span>

      <!-- Status Badge -->
      <span class="badge" [ngClass]="'badge-status-' + task.status.toLowerCase().replace(' ', '')">
        {{ task.status }}
      </span>

      <!-- Due Date -->
      <span class="task-due-date" *ngIf="task.due_date">
        📅 {{ task.due_date | date:'mediumDate' }}
      </span>
    </div>
  </div>

  <!-- Action Buttons -->
  <div class="task-actions">
    <button class="btn btn-icon btn-secondary" (click)="openEditModal(task)" title="Edit Task">
      ✏️
    </button>
    <button class="btn btn-icon btn-danger" (click)="deleteTask(task.id)" title="Delete Task">
      🗑️
    </button>
  </div>
</div>
```

---

## 4. Field Names Contract (Must Match Backend Exactly)

| Field Name | Type | Allowed Values | Mandatory? |
|---|---|---|---|
| `title` | string | 1 - 255 characters | **Yes** |
| `description` | string | text | No (nullable) |
| `status` | string | `'pending'`, `'in_progress'`, `'completed'` | Default: `'pending'` |
| `priority` | string | `'low'`, `'medium'`, `'high'` | Default: `'medium'` |
| `due_date` | string / ISO timestamp | e.g. `'2026-11-21T18:00:00Z'` | No (nullable) |
