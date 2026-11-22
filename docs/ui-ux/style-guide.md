# UI/UX Style Guide & Design System

**Group 4 To-Do Application**  
**Author:** Naivedya Pramod Yadav ([@Not-naive18](https://github.com/Not-naive18)) — UI/UX Designer  
**Target Repository:** `arohi06/To-do-project-GRP-4`  
**Branch:** `feature/ui-ux`  

---

## 1. Color System

The color palette is engineered around high accessibility (WCAG AA compliant contrast ratios), modern aesthetic appeal, and clear semantic meaning.

### 1.1 Primary & Accent Palette

| Token Name | Hex Code | HSL | RGB | Usage |
|---|---|---|---|---|
| `--color-primary-50` | `#EEF2FF` | `226°, 100%, 97%` | `238, 242, 255` | Light brand tint, hover backgrounds |
| `--color-primary-100` | `#E0E7FF` | `226°, 100%, 94%` | `224, 231, 255` | Subtle pill/badge background |
| `--color-primary-500` | `#6366F1` | `239°, 84%, 67%` | `99, 102, 241` | Primary brand accent, focus rings |
| `--color-primary-600` | `#4F46E5` | `244°, 76%, 59%` | `79, 70, 229` | **Primary CTA Buttons, active nav links** |
| `--color-primary-700` | `#4338CA` | `245°, 58%, 51%` | `67, 56, 202` | Button hover and pressed state |

### 1.2 Neutral & Surface Palette (Slate)

| Token Name | Hex Code | Usage |
|---|---|---|
| `--color-bg-app` | `#F8FAFC` | Main application background |
| `--color-surface` | `#FFFFFF` | Card, container, and modal surface |
| `--color-surface-hover` | `#F1F5F9` | Hover state for lists and cards |
| `--color-border` | `#E2E8F0` | Subtle borders, table dividers, card outlines |
| `--color-border-focus` | `#4F46E5` | Active input border |
| `--color-text-primary` | `#0F172A` | Primary headlines, titles, active labels |
| `--color-text-secondary` | `#475569` | Body text, descriptions, labels |
| `--color-text-muted` | `#94A3B8` | Placeholders, timestamps, metadata icons |

### 1.3 Semantic Status Colors

| Status | Badge Background | Badge Text | Border | Meaning / State |
|---|---|---|---|---|
| **Pending** | `#FEF3C7` (Amber 100) | `#92400E` (Amber 800) | `#FDE68A` | Task awaiting action |
| **In Progress** | `#E0E7FF` (Indigo 100) | `#3730A3` (Indigo 800) | `#C7D2FE` | Task currently being worked on |
| **Completed** | `#D1FAE5` (Emerald 100) | `#065F46` (Emerald 800) | `#A7F3D0` | Task marked done |

### 1.4 Semantic Priority Colors

| Priority | Badge Background | Badge Text | Icon Indicator | Usage |
|---|---|---|---|---|
| **Low** | `#F1F5F9` (Slate 100) | `#334155` (Slate 700) | 🟢 Circle | Minor or optional backlog items |
| **Medium** | `#FEF3C7` (Amber 100) | `#B45309` (Amber 700) | 🟡 Circle | Standard priority tasks |
| **High** | `#FEE2E2` (Rose 100) | `#B91C1C` (Rose 700) | 🔴 Alert Flag | Urgent deadlines requiring immediate attention |

---

## 2. Typography Scale

The design standard utilizes **Inter**, a clean and highly legible sans-serif font family.

- **Primary Font Family:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Monospace Family (for IDs/dates):** `'JetBrains Mono', 'Fira Code', monospace`

### Typography Hierarchy Table

| Level | Size (rem / px) | Weight | Line Height | Letter Spacing | CSS Utility / Element |
|---|---|---|---|---|---|
| Display / App Title | `2.25rem / 36px` | 700 (Bold) | 1.25 | `-0.025em` | `.text-4xl`, `h1` on Login/Dashboard |
| Page Heading | `1.75rem / 28px` | 600 (SemiBold) | 1.3 | `-0.02em` | `.text-3xl`, `h2` Section titles |
| Card Title | `1.25rem / 20px` | 600 (SemiBold) | 1.4 | `-0.01em` | `.text-xl`, `h3` Task title, Modal title |
| Section Subheading | `1.00rem / 16px` | 600 (SemiBold) | 1.5 | `normal` | `.text-base-bold`, Table headers |
| Body Copy | `0.938rem / 15px`| 400 (Regular) | 1.55 | `normal` | `.text-body`, Task descriptions |
| Secondary / Metadata | `0.875rem / 14px`| 500 (Medium) | 1.4 | `normal` | `.text-sm`, Dates, form labels |
| Microcopy / Badges | `0.75rem / 12px` | 600 (SemiBold) | 1.2 | `+0.02em` | `.text-xs`, Status and priority pills |

---

## 3. Spacing, Elevation & Geometry

### 3.1 Spacing Scale (4px Base Grid)

```scss
$spacing-1: 0.25rem;  //  4px - Micro gaps
$spacing-2: 0.5rem;   //  8px - Pill paddings, inline gaps
$spacing-3: 0.75rem;  // 12px - Input padding vertical
$spacing-4: 1.0rem;   // 16px - Standard component padding
$spacing-5: 1.25rem;  // 20px - Card body padding
$spacing-6: 1.5rem;   // 24px - Section gutter
$spacing-8: 2.0rem;   // 32px - Layout columns gutter
$spacing-12: 3.0rem;  // 48px - Page margins
```

### 3.2 Border Radius System

```scss
$radius-sm:   4px;    // Checkboxes, micro-tags
$radius-md:   8px;    // Form inputs, buttons, priority pills
$radius-lg:   12px;   // Task cards, stat cards
$radius-xl:   16px;   // Modals, slide-out panels
$radius-full: 9999px; // Circular status badges, avatar icons
```

### 3.3 Shadows & Elevation

```scss
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);                          // Flat cards, subtle borders
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04); // Default cards, dropdowns
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.03); // Hovered cards, floating buttons
$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.04); // Modals, overlays
```

---

## 4. UI Component Specifications

### 4.1 Buttons

- **Primary Button (`.btn-primary`):**
  - Background: `#4F46E5` (Hover: `#4338CA`, Active: `#3730A3`)
  - Text: `#FFFFFF`, SemiBold 14px
  - Padding: `0.625rem 1.25rem` (10px 20px)
  - Radius: `8px`, Shadow: `$shadow-sm`
  - Usage: "Add Task", "Sign In", "Save Changes"

- **Secondary / Ghost Button (`.btn-secondary`):**
  - Background: `#FFFFFF` (Hover: `#F8FAFC`)
  - Border: `1px solid #CBD5E1`
  - Text: `#334155`
  - Usage: "Cancel", "Reset Filters", "Back"

- **Danger Button (`.btn-danger`):**
  - Background: `#EF4444` (Hover: `#DC2626`)
  - Text: `#FFFFFF`
  - Usage: "Delete Task", "Log Out"

- **Icon Button (`.btn-icon`):**
  - Circular or 36x36px square with centered SVG icon
  - Usage: Edit, Delete, Close Modal, Refresh

### 4.2 Form Controls & Inputs

- **Text Inputs (`.form-input`) & Selects (`.form-select`):**
  - Height: `42px`
  - Padding: `0.5rem 0.875rem`
  - Border: `1px solid #CBD5E1` (Focus: `2px solid #4F46E5`, Box-shadow: `0 0 0 3px rgba(79, 70, 229, 0.15)`)
  - Radius: `8px`
  - Font Size: `14px`
- **Labels (`.form-label`):**
  - Font Size: `13px`, Weight: `600`, Color: `#334155`, Margin-bottom: `4px`
- **Error State (`.has-error`):**
  - Border: `1px solid #EF4444`
  - Error message text: `12px`, `#DC2626`, with warning icon

### 4.3 KPI Stat Summary Cards (Dashboard)

- White background, `16px` padding, `12px` border-radius, `$shadow-sm`
- Left side: Title (13px muted uppercase) and Large Metric Number (28px Bold)
- Right side: Colored circular icon badge reflecting the metric category (Total, Pending, In Progress, Completed)
- Micro-progress bar at card bottom showing completion percentage

### 4.4 Task Item Card / Row

- Left: Large custom checkbox (`20px x 20px`) for instant completion toggling
- Middle:
  - Line 1: Task Title (15px SemiBold; line-through and muted when completed)
  - Line 2: Task Description snippet (13px muted, max 2 lines with ellipsis)
  - Line 3: Meta row containing:
    - Due Date indicator with calendar icon (Red alert if overdue, Amber if due today, Slate if upcoming)
    - Priority pill (`High`, `Medium`, `Low`)
    - Status pill (`Pending`, `In Progress`, `Completed`)
- Right: Action buttons (Edit icon button, Delete icon button)

### 4.5 Modals & Overlays

- Backdrop: `rgba(15, 23, 42, 0.5)` with `backdrop-filter: blur(4px)`
- Container: Centered, max-width `540px`, background `#FFFFFF`, radius `16px`, shadow `$shadow-xl`
- Header: Title, subtitle, and close `✕` button
- Body: Spacing `16px` between input groups
- Footer: Action buttons aligned to right ("Cancel" + "Create / Save Task")

---

## 5. Responsive Breakpoint Guidelines

| Device Category | Breakpoint Query | Layout Adjustments |
|---|---|---|
| **Mobile** | `< 640px` | Single-column layout. Metric cards stack 2x2 or 1x1. Task cards collapse action buttons into a menu. Filter toolbar converts to a drawer or sticky bottom sheet. |
| **Tablet** | `640px – 1024px` | 2-column or responsive grid. Metric cards render 2x2. Filter toolbar displays compact dropdowns. |
| **Desktop** | `> 1024px` | Full multi-column layout. Metric cards display 4 across. Task list with full inline metadata and action buttons. Modal centered with generous padding. |

---

## 6. Accessibility & Contrast Verification

- **Text Contrast:** All body text (`#0F172A`, `#475569`) on white backgrounds exceeds `7:1` (exceeds WCAG AAA requirements).
- **Interactive Focus States:** All buttons, inputs, and links include visible high-contrast focus rings (`outline: 2px solid #4F46E5; outline-offset: 2px;`).
- **Color Independence:** Statuses and priorities are never communicated by color alone; every badge includes explicit text labels and icon shapes.
