---
sidebar_position: 5
description: "Complete a hands-on activity building components with daisyUI following the feature-based structure, with delivery criteria and a rubric."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import DaisyPreview from '@site/src/components/DaisyPreview';

# Activity: Components with daisyUI

In this hands-on activity, you will build and integrate a library of modular, accessible, and responsive components for Next.js (App Router), combining the speed of **Tailwind CSS v4** utility classes with the visual semantics of **daisyUI 5** and the institutional design guidelines of Universidad Icesi.

As designers and developers of digital environments, the goal is not only to lay out appealing interfaces, but also to organize code professionally: reusable components, typed *props* contracts with TypeScript, coherent visual hierarchy, and strict separation of concerns.

<CardGrid cols={3}>
  <Card
    title="03. Tailwind CSS"
    description="Design tokens, spacing utilities, flexbox, grid, and mobile-first approach in Tailwind CSS v4."
    link="./03-tailwind-css.md"
  />
  <Card
    title="04. daisyUI"
    description="Semantic components, visual modifiers, interaction states, and themes in daisyUI 5."
    link="./04-daisyui.md"
  />
  <Card
    title="Official daisyUI Catalog"
    description="Official documentation and live examples of buttons, badges, modals, navigation, and forms."
    link="https://daisyui.com/components/"
  />
</CardGrid>

---

## 1. Assignment

### Objective

Design, lay out, and modularize web interface components following atomic design technical specifications and the course architectural principles:

1. **Semantics and accessibility**: leverage native HTML tags and daisyUI semantic classes instead of nesting meaningless generic elements.
2. **Modularity and typing**: isolate each element in its own file with explicit *props* contracts in TypeScript (`interface Props`).
3. **Mobile-first**: ensure each component adapts naturally from mobile screens (360 px) to desktop displays.
4. **Feature-based organization**: place each file within the folder structure by *features* and *shared* explained in [01. Feature-Based Structure](./01-estructura-por-features.md).

### Structure and Placement Rule

Each component must live in its **own independent file**. Accumulating multiple components in a single file or creating disorganized global folders "by type" is strictly prohibited:

* **Reusable generic components** (base buttons, status badges, alerts, confirmation modals, metric indicators): must be located in `src/shared/components/ui/<component-name>.tsx`.
* **Components tied to a specific feature** (course cards, backlog panel, tutoring form, faculty profile cards): must be located within their corresponding feature in `src/features/<feature>/components/<component-name>.tsx`.

```text title="Structure by features and shared"
src/
├── features/
│   ├── auth/
│   │   └── components/       # Login and register components
│   ├── courses/
│   │   └── components/       # course-card.tsx
│   ├── tutoring/
│   │   └── components/       # tutoring-request-form.tsx
│   └── projects/
│       └── components/       # sprint-accordion-panel.tsx
└── shared/
    └── components/
        └── ui/               # action-button.tsx, status-badge.tsx, alert-banner.tsx, etc.
```

---

## 2. Grading Criteria

The catalog in this guide contains **20 progressive exercises** organized into three complexity levels. To pass the activity, you must submit a **minimum selection of 7 components**, distributed according to the following technical criteria:

### Required Selection (7 components)

1. **Level 1 — Visual Atoms (choose 2 components):**
   * *Recommended:* **01. Action Button** (`src/shared/components/ui/action-button.tsx`) and **03. Alert Banner** (`src/shared/components/ui/alert-banner.tsx`).
   * *Valid alternatives:* 02 (Status Badge), 04 (Avatar with Ring), 05 (Kbd Pill), 06 (Visual Rating), or 07 (Bento Stat Metric).
2. **Level 2 — Molecules and Information (choose 3 components):**
   * *Recommended:* **08. Course Card** (`src/features/courses/components/course-card.tsx`), **10. Toast Floating Notification** (`src/shared/components/ui/toast-notification.tsx`), and **13. Step Milestone Tracker** (`src/shared/components/ui/step-progress-tracker.tsx`).
   * *Valid alternatives:* 09 (Multi-Metric Bento Panel), 11 (Chat Bubble), 12 (Directory Row), or 14 (Tag Selector).
3. **Level 3 — Complex Organisms (choose 2 components):**
   * *Recommended:* **16. App Navbar with Menu** (`src/shared/components/ui/academic-app-navbar.tsx`) and **18. Submission Confirmation Modal** (`src/shared/components/ui/submission-confirm-modal.tsx`).
   * *Valid alternatives:* 15 (Event Card with Countdown), 17 (Tutoring Form), 19 (Faculty Profile with Tabs), or 20 (Accordion Backlog).

:::tip[Integration Option in the Case Study]
If you prefer a workflow more tightly integrated with the course project, you can connect at least **2 of your selected components** directly into the Login and Register screens developed in [02. Case Study: Login and Register](./02-caso-de-estudio-login-register.md):
* Use `ActionButton` (Exercise 01) as the primary button with interactive loading state (`isLoading`).
* Use `AlertBanner` (Exercise 03) to display error or confirmation messages for credentials.
* Use `SubmissionConfirmModal` (Exercise 18) to request confirmation before resetting or submitting the form.
:::

:::note[Technical Bonus]
Implementing additional components beyond the required 7, or completing all 20 exercises, will be considered a practical bonus in the evaluation.
:::

---

## 3. Submission and Rubric

### Submission Method

1. Push your project to a **private repository within the course organization** on GitHub.
2. Include a `README.md` file in the project root that clearly lists which components you implemented and the path of each one within the folder architecture.
3. Submit the repository link on the course platform.
4. The development and submission timeframe will be indicated by the instructor during the session.

### Evaluation Rubric

| Criterion | Description | Weight |
| :--- | :--- | :---: |
| **Visual fidelity** | Strict adherence to proportions, typographic hierarchy, spacing, and the institutional Icesi color palette (Blue `#5454e9`, Purple `#865cf0`, Green `#4cb979`, Orange `#e9683b`, Yellow `#e4eb60`). | **30%** |
| **Proper use of daisyUI and Tailwind** | Effective application of daisyUI semantic classes combined with Tailwind utilities without CSS duplication or manual inline styles. | **25%** |
| **Mobile-first responsive design** | Fluid behavior without overflow on mobile screens (360 px), scaling smoothly to tablets and desktop displays. | **15%** |
| **Component reusability and typed props** | Well-typed TypeScript *props* contracts, clean default values, and appropriate use of Server/Client Components (no unnecessary `'use client'` directives). | **15%** |
| **Feature-based folder organization** | File structure consistent with [01. Feature-Based Structure](./01-estructura-por-features.md), locating each component in `src/shared/components/ui/` or in its corresponding feature. | **15%** |
| **Total** | Full compliance with the activity's quality standards and requirements. | **100%** |

---

## 4. Level 1: Atoms

Single-purpose interface elements, highly reusable and with minimal dependencies.

### 01. Action Button with Loading State and Badge

<Tabs>
<TabItem value="vista" label="Component & Preview" default>

<DaisyPreview id={1} height="135px" />

Interactive action button combining a vector icon, descriptive label, an informative tonal badge on the right (e.g., "PDF" file format), and support for dynamically toggling to a loading state (*loading spinner*).

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `src/shared/components/ui/action-button.tsx`
* **Purpose:** Provide a standardized base button for the entire application with support for visual states (normal, loading, disabled) without duplicating CSS code.
* **Suggested daisyUI style:** Institutional `icesi` theme with primary variant `btn-primary` (Icesi Blue `#5454e9`) and contextual badge in `badge-secondary` (Icesi Purple `#865cf0`).
* **Suggested Props Contract (TypeScript):**
  ```typescript title="src/shared/components/ui/action-button.tsx"
  interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    icon?: React.ReactNode;
    badgeText?: string;
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
  }
  ```
* **Suggested daisyUI base classes:** `btn`, `btn-primary`, `btn-outline`, `loading loading-spinner loading-xs`, `badge`, `badge-secondary`, `badge-sm`.
* **What to use:**
  * Keep the component as a **Server Component** if it is only used as a styled link (`<Link>`), or convert it to a client component (`'use client'`) only if it handles interactive `onClick` events with local state hooks.
  * Extend `React.ButtonHTMLAttributes<HTMLButtonElement>` to natively inherit properties such as `type`, `disabled`, and `aria-label`.
* **What to AVOID:**
  * **Do not** create your own custom SVG spinner with manual animations when daisyUI already provides `loading loading-spinner`.
  * **Do not** add inline styles with `style={{ backgroundColor: '#5454e9' }}`: use daisyUI's semantic theme abstraction (`btn-primary`).

</TabItem>
</Tabs>

---

### 02. Tonal Status Badge with Glowing Indicator

<Tabs>
<TabItem value="vista" label="Component & Preview" default>

<DaisyPreview id={2} height="135px" />

Pill-shaped micro-component combining a pulsing luminous dot (*pulsing dot*) with a text label to visually communicate the academic or administrative status of a record (active with Icesi Green `#4cb979`, under review with Purple `#865cf0`, pending with Orange `#e9683b`).

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `src/shared/components/ui/status-badge.tsx`
* **Purpose:** Display an entity's lifecycle or condition immediately without cluttering the interface.
* **Suggested daisyUI style:** Semantic status modifiers with the complementary Icesi palette: Icesi Green (`#4cb979` / `badge-success`), Icesi Purple (`#865cf0` / `badge-secondary`), and Icesi Orange (`#e9683b` / `badge-error`).
* **Suggested Props Contract (TypeScript):**
  ```typescript title="src/shared/components/ui/status-badge.tsx"
  type BadgeStatus = 'active' | 'pending' | 'danger' | 'neutral';

  interface StatusBadgeProps {
    status: BadgeStatus;
    label: string;
    hasPulse?: boolean;
    className?: string;
  }
  ```
* **Suggested daisyUI & Tailwind base classes:** `badge`, `badge-outline`, Tailwind utilities `inline-flex items-center gap-2`, `w-2 h-2 rounded-full animate-pulse`.
* **What to use:**
  * **100% pure Server Component**: this component is strictly visual and never requires `'use client'`.
  * Use an internal dictionary (object map or `switch`) to pair each `status` value with its semantic color classes.
* **What to AVOID:**
  * **Do not** use arbitrary color names in props (e.g., `color="green"` or `color="red"`). Use semantic status names (`status="active"`).
  * **Do not** nest unnecessary containers: a single semantic `<span>` element is sufficient.

</TabItem>
</Tabs>

---

### 03. Institutional Informative Alert Banner

<Tabs>
<TabItem value="vista" label="Component & Preview" default>

<DaisyPreview id={3} height="135px" />

Prominent notification block featuring an informative vector icon in Icesi Blue (`#5454e9`), a bold title, explanatory body, and a secondary action button to direct the user to the corresponding action.

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `src/shared/components/ui/alert-banner.tsx`
* **Purpose:** Display important institutional announcements (registration openings, system notices, scheduled maintenance) in view headers.
* **Suggested daisyUI style:** `alert` component combined with `alert-info` in shades of Icesi Blue (`#5454e9` / `bg-[#f0f0fd]`).
* **Suggested Props Contract (TypeScript):**
  ```typescript title="src/shared/components/ui/alert-banner.tsx"
  interface AlertBannerProps {
    title: string;
    description: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    actionLabel?: string;
    onActionClick?: () => void;
  }
  ```
* **Suggested daisyUI base classes:** `alert`, `alert-info`, `alert-warning`, `alert-success`, `btn btn-xs btn-outline`.
* **What to use:**
  * If the action is navigation to another route (e.g., a link to `/calendario`), render a Next.js `<Link href="...">` component instead of a button with an imperative handler.
  * Add the accessible attribute `role="alert"` or `aria-live="polite"` for screen readers.
* **What to AVOID:**
  * **Do not** force `'use client'` if the banner only renders text and a link to another page.
  * **Do not** place alert text with poor contrast that fails to meet the WCAG AA standard.

</TabItem>
</Tabs>

---

### 04. User Avatar with Presence Ring and Role

<Tabs>
<TabItem value="vista" label="Component & Preview" default>

<DaisyPreview id={4} height="135px" />

Atomic set that includes a circular user photograph with an outer ring (*ring*) in Icesi Blue (`#5454e9`), green live status indicator in Icesi Green (`#4cb979`), name, academic role badge, and current location.

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `src/shared/components/ui/user-avatar.tsx`
* **Purpose:** Visually identify professors, lab monitors, or team members in contact panels and tutoring rosters.
* **Suggested daisyUI style:** Classes `avatar online` (or `offline`) combined with `ring ring-primary ring-offset-2`.
* **Suggested Props Contract (TypeScript):**
  ```typescript title="src/shared/components/ui/user-avatar.tsx"
  interface UserAvatarProps {
    name: string;
    role: string;
    program?: string;
    avatarUrl: string;
    isOnline?: boolean;
    locationText?: string;
    size?: 'sm' | 'md' | 'lg';
  }
  ```
* **Suggested daisyUI base classes:** `avatar`, `avatar online`, `avatar offline`, `rounded-full ring ring-primary ring-offset-base-100`, `badge badge-primary badge-xs`.
* **What to use:**
  * In production Next.js projects, use `next/image` (`<Image />`) with dimensions `width={56}` and `height={56}` for automatic image optimization on the server.
  * Add descriptive semantic alt text with the user's name (`alt="Profile picture of..."`).
* **What to AVOID:**
  * **Do not** manually calculate the absolute position of the green dot with fixed coordinates: daisyUI's `avatar online` class automatically positions the indicator.
  * **Do not** forget to include a typographic fallback with name initials if the image URL fails or is null.

</TabItem>
</Tabs>

---

### 05. Keyboard Shortcut Pill with Kbd

<Tabs>
<TabItem value="vista" label="Component & Preview" default>

<DaisyPreview id={5} height="120px" />

Compact row with a descriptive label on the left and simulated physical keys using semantic `<kbd>` elements on the right, ideal for command palettes or quick navigation menus.

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `src/shared/components/ui/shortcut-pill.tsx`
* **Purpose:** Inform the user of keyboard shortcuts to boost productivity and accessibility.
* **Suggested daisyUI style:** Classes `kbd kbd-sm` with white background and subtle shadow on a neutral container `bg-base-200` and border in Gray 2 (`#cecfd4`).
* **Suggested Props Contract (TypeScript):**
  ```typescript title="src/shared/components/ui/shortcut-pill.tsx"
  interface ShortcutPillProps {
    label: string;
    keys: string[]; // E.g.: ['⌘ Cmd', 'K'] or ['Ctrl', 'Shift', 'P']
  }
  ```
* **Suggested daisyUI base classes:** `kbd`, `kbd-sm`, `kbd-xs`, combined with flexbox `flex items-center justify-between`.
* **What to use:**
  * Render elements using the semantic HTML tag `<kbd>`.
  * Use `.map()` over the `keys` array, inserting a subtle `+` separator between keys.
* **What to AVOID:**
  * **Do not** make this a client component: key mapping is static and renders efficiently on the server.
  * **Do not** use disproportionate sizes: `kbd` elements must be discreet and harmonize with body typography.

</TabItem>
</Tabs>

---

### 06. Star Rating Display

<Tabs>
<TabItem value="vista" label="Component & Preview" default>

<DaisyPreview id={6} height="120px" />

Visual rating component that displays stars with support for half ratings (*half stars*), prominent numeric score, and total review count.

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `src/shared/components/ui/rating-display.tsx`
* **Purpose:** Display ratings for courses, workshops, or faculty evaluations in catalogs and course sheets.
* **Suggested daisyUI style:** Component `rating rating-sm rating-half` with masks `mask mask-star-2 bg-[#e9683b]` (Icesi Orange) or institutional yellow.
* **Suggested Props Contract (TypeScript):**
  ```typescript title="src/shared/components/ui/rating-display.tsx"
  interface RatingDisplayProps {
    score: number; // E.g.: 4.8 out of 5.0
    totalReviews?: number;
    showScoreText?: boolean;
    maxScore?: number;
  }
  ```
* **Suggested daisyUI base classes:** `rating`, `rating-sm`, `rating-half`, `mask mask-star-2`.
* **What to use:**
  * If the component only displays an existing score (read-only mode), mark the inputs as `disabled` or render static vector SVG stars.
  * Ensure accessibility attribute for screen readers (`aria-label="Rating of..."`).
* **What to AVOID:**
  * **Do not** install heavy external libraries when daisyUI handles the star mask system with pure CSS.
  * **Do not** round numbers abruptly in rendering without allowing a clear decimal (`score.toFixed(1)`).

</TabItem>
</Tabs>

---

### 07. Academic Metric Bento Stat

<Tabs>
<TabItem value="vista" label="Component & Preview" default>

<DaisyPreview id={7} height="185px" />

Bento-style informative card featuring a primary quantitative indicator (e.g., Cumulative GPA), institutional icon in a tonal container in Icesi Blue (`#5454e9`), and percentage trend with semester comparison in Icesi Green (`#4cb979`).

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `src/shared/components/ui/metric-bento-stat.tsx`
* **Purpose:** Present academic KPIs in dashboards and panels for students or faculty.
* **Suggested daisyUI style:** Component `stat` with white background, borders in Gray 2 (`#cecfd4`), and text in Icesi Blue `text-primary` (`#5454e9`).
* **Suggested Props Contract (TypeScript):**
  ```typescript title="src/shared/components/ui/metric-bento-stat.tsx"
  interface MetricBentoStatProps {
    title: string;
    value: string | number;
    maxValue?: string | number;
    trendText?: string;
    trendType?: 'positive' | 'negative' | 'neutral';
    icon: React.ReactNode;
  }
  ```
* **Suggested daisyUI base classes:** `stat`, `stat-figure`, `stat-title`, `stat-value`, `stat-desc`.
* **What to use:**
  * Excellent candidate for an **asynchronous React Server Component** (`async function MetricBentoStat(...)`) that queries the metric directly in the database or service before rendering the HTML.
  * Apply `text-primary` (`#5454e9`) for the primary numeric value and `text-[#4cb979]` for positive trends.
* **What to AVOID:**
  * **Do not** use disorganized text fonts: maintain typographic consistency using daisyUI's standardized hierarchy (`stat-title`, `stat-value`).
  * **Do not** use state hooks (`useState`) for static numeric data coming from the server.

</TabItem>
</Tabs>

---

## 5. Level 2: Molecules

Composite components that group multiple atoms and manage complex data structures.

### 08. Course Card with Progress Bar

<Tabs>
<TabItem value="vista" label="Component & Preview" default>

<DaisyPreview id={8} height="260px" />

Modular card summarizing course information: header with institutional gradient (Icesi Blue `#5454e9` to Icesi Purple `#865cf0`), course code, academic credit badge, instructor in charge, room, semester progress bar, and access actions.

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `src/features/courses/components/course-card.tsx`
* **Purpose:** Main card for the grid of enrolled courses in the student catalog.
* **Suggested daisyUI style:** `card bg-base-100 shadow-sm border border-[#cecfd4]`, bar `progress progress-primary`, and action buttons in `card-actions`.
* **Suggested Props Contract (TypeScript):**
  ```typescript title="src/features/courses/components/course-card.tsx"
  interface CourseCardProps {
    courseCode: string;
    title: string;
    instructor: string;
    room: string;
    credits: number;
    progressPercentage: number;
    courseUrl: string;
    syllabusUrl?: string;
  }
  ```
* **Suggested daisyUI base classes:** `card`, `card-body`, `card-title`, `card-actions`, `progress progress-primary`, `badge badge-outline`, `btn btn-sm btn-primary`.
* **What to use:**
  * Link the "Enter Classroom" button with Next.js's `<Link href="...">` component to enable instant client-side routing and prefetching.
  * Manage a top border or decorative header with the official gradient `bg-gradient-to-r from-[#5454e9] to-[#865cf0]`.
* **What to AVOID:**
  * **Do not** clutter the card with more than two primary buttons; respect visual hierarchy by using a ghost button (`btn-ghost`) for the syllabus and a solid one (`btn-primary`) for the main action.
  * **Do not** forget to clamp progress values: `progressPercentage` must be normalized between 0 and 100.

</TabItem>
</Tabs>

---

### 09. Multi-Metric Bento Analytics Panel

<Tabs>
<TabItem value="vista" label="Component & Preview" default>

<DaisyPreview id={9} height="175px" />

Horizontal panel coupling multiple academic performance indicators into a single cohesive unit with internal dividers, vector icons, and percentage subtitles in Icesi Green (`#4cb979`) and Icesi Purple (`#865cf0`).

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `src/shared/components/ui/analytics-bento-grid.tsx`
* **Purpose:** Display a bird's-eye view of curricular progress in the academic portal header.
* **Suggested daisyUI style:** Group container `stats stats-horizontal shadow-sm border border-[#cecfd4] bg-base-100`.
* **Suggested Props Contract (TypeScript):**
  ```typescript title="src/shared/components/ui/analytics-bento-grid.tsx"
  interface StatItem {
    label: string;
    value: string | number;
    total?: string | number;
    description: string;
    icon: React.ReactNode;
    colorVariant?: 'primary' | 'secondary';
  }

  interface AnalyticsBentoGridProps {
    stats: StatItem[];
  }
  ```
* **Suggested daisyUI base classes:** `stats`, `stats-vertical lg:stats-horizontal`, `stat`, `stat-figure`, `stat-title`, `stat-value`, `stat-desc`.
* **What to use:**
  * Use the adaptive class `stats-vertical lg:stats-horizontal` so that blocks stack vertically on mobile screens and align in a row on desktop displays.
  * Use a typed `.map()` over the `stats` array to ensure the component can dynamically render 2, 3, or 4 metrics.
* **What to AVOID:**
  * **Do not** build the container with manual divs and independent borders when daisyUI already manages internal dividers in the `stats` group.
  * **Do not** repeat identical icons for distinct metrics.

</TabItem>
</Tabs>

---

### 10. Institutional Toast-Style Floating Notification

<Tabs>
<TabItem value="vista" label="Component & Preview" default>

<DaisyPreview id={10} height="135px" />

Floating event confirmation card with a circular success icon in Icesi Green (`#4cb979`), descriptive message, transaction or commit ID, and a quick dismiss button.

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `src/shared/components/ui/toast-notification.tsx`
* **Purpose:** Notify the student when a lab submission has been successfully received and confirmed.
* **Suggested daisyUI style:** `alert alert-success shadow-md rounded-2xl` with white background and accents in Icesi Green (`#4cb979`).
* **Suggested Props Contract (TypeScript):**
  ```typescript title="src/shared/components/ui/toast-notification.tsx"
  interface ToastNotificationProps {
    title: string;
    message: string;
    variant?: 'success' | 'info' | 'warning' | 'error';
    onClose?: () => void;
  }
  ```
* **Suggested daisyUI base classes:** `toast`, `toast-top toast-end`, `alert`, `alert-success`, `btn btn-xs btn-ghost`.
* **What to use:**
  * If positioning it floating fixed in the browser window, wrap the alert in the `toast toast-top toast-end` container.
  * Design the component with controlled state to allow manual dismissal or auto-dismiss after a timer in client components.
* **What to AVOID:**
  * **Do not** use alert colors that are too dark and obscure information; modern design prefers white backgrounds with subtle borders and semantic accents.
  * **Do not** forget to include the close button with accessibility (`aria-label="Close notification"`).

</TabItem>
</Tabs>

---

### 11. Academic Advising Chat Bubble

<Tabs>
<TabItem value="vista" label="Component & Preview" default>

<DaisyPreview id={11} height="240px" />

Asynchronous messaging thread positioning student messages on the left and instructor or monitor replies on the right with Icesi Blue (`#5454e9`), timestamps, and user avatar.

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `src/features/advising/components/advisor-chat-bubble.tsx`
* **Purpose:** Structure one-on-one academic consultation and feedback channels between students and instructors.
* **Suggested daisyUI style:** Components `chat chat-start` and `chat chat-end` with instructor bubble in `chat-bubble chat-bubble-primary` (`#5454e9`).
* **Suggested Props Contract (TypeScript):**
  ```typescript title="src/features/advising/components/advisor-chat-bubble.tsx"
  interface ChatMessageProps {
    senderName: string;
    senderRole?: string;
    message: string;
    timestamp: string;
    avatarUrl: string;
    isSenderTeacher?: boolean;
    deliveryStatus?: string;
  }
  ```
* **Suggested daisyUI base classes:** `chat`, `chat-start`, `chat-end`, `chat-image`, `chat-header`, `chat-bubble`, `chat-bubble-primary`, `chat-footer`.
* **What to use:**
  * Leverage daisyUI's semantic structure: `chat-header` for name and timestamp, `chat-bubble` for text, and `chat-footer` for delivery status.
  * Allow the `isSenderTeacher` boolean to toggle cleanly between `chat-start` and `chat-end` alignments.
* **What to AVOID:**
  * **Do not** lay out chat bubble tails with complex CSS tricks when daisyUI calculates them with native precision.
  * **Do not** mix socket or streaming logic directly inside this presentation component.

</TabItem>
</Tabs>

---

### 12. Student Directory Row with Actions Menu

<Tabs>
<TabItem value="vista" label="Component & Preview" default>

<DaisyPreview id={12} height="130px" />

Administrative data table row arranging an avatar with squircle mask (*squircle*), student name and student ID, academic program, status badge in Icesi Green (`#4cb979`), and action button in Icesi Blue (`#5454e9`).

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `src/features/students/components/student-table-row.tsx`
* **Purpose:** Render each element in a tabular roster of enrolled students or lab participants.
* **Suggested daisyUI style:** `table table-sm` with `hover:bg-slate-50` effect, `mask mask-squircle` on avatar, and button `btn-ghost btn-xs text-primary`.
* **Suggested Props Contract (TypeScript):**
  ```typescript title="src/features/students/components/student-table-row.tsx"
  interface StudentTableRowProps {
    studentId: string;
    studentCode: string;
    fullName: string;
    program: string;
    avatarUrl: string;
    status: 'active' | 'inactive' | 'graduated';
    onViewGradesClick?: () => void;
  }
  ```
* **Suggested daisyUI base classes:** `table`, `mask mask-squircle`, `avatar`, `badge`, `btn btn-ghost btn-xs`.
* **What to use:**
  * Render the component as a pure `<tr>` element to respect native HTML table hierarchy inside a `<tbody>`.
  * Ideal for rendering inside a Server Component that iterates over a student array fetched from a database query.
* **What to AVOID:**
  * **Do not** wrap the `<tr>` in a `<div>`: you will break the DOM validity of the HTML table.
  * **Do not** leave avatars unmasked when daisyUI offers the elegant `mask mask-squircle` class.

</TabItem>
</Tabs>

---

### 13. Step-by-Step Delivery Milestone Tracker

<Tabs>
<TabItem value="vista" label="Component & Preview" default>

<DaisyPreview id={13} height="130px" />

Sequential timeline illustrating milestones or sprints in a development project, indicating which stages have been completed with Icesi Blue (`#5454e9`), which is active today, and which are pending.

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `src/shared/components/ui/step-progress-tracker.tsx`
* **Purpose:** Provide clear visual feedback on the deliverables flow of a capstone project or workshop.
* **Suggested daisyUI style:** Unordered list `<ul className="steps steps-horizontal">` with active steps in `step-primary` (`#5454e9`).
* **Suggested Props Contract (TypeScript):**
  ```typescript title="src/shared/components/ui/step-progress-tracker.tsx"
  interface StepItem {
    label: string;
    isCompleted: boolean;
    isCurrent?: boolean;
    stepNumber?: number | string;
  }

  interface StepProgressTrackerProps {
    steps: StepItem[];
  }
  ```
* **Suggested daisyUI base classes:** `steps`, `steps-horizontal`, `step`, `step-primary`, attribute `data-content="✓"`.
* **What to use:**
  * Use daisyUI's HTML `data-content` attribute to customize step circle content (e.g., `data-content="✓"` for completed steps).
  * Support responsive design with `steps-vertical md:steps-horizontal` if the list contains more than 4 milestones.
* **What to AVOID:**
  * **Do not** calculate horizontal lines with absolute borders: daisyUI automatically calculates node connectors via CSS.
  * **Do not** omit accessible text labels for screen readers.

</TabItem>
</Tabs>

---

### 14. Thematic Tag Selector with Checkboxes

<Tabs>
<TabItem value="vista" label="Component & Preview" default>

<DaisyPreview id={14} height="145px" />

Interactive filter group presented as selectable badge pills (*badges*), where selected tags adopt Icesi Blue (`#5454e9`) and available tags remain neutral in Gray 2 (`#cecfd4`).

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `src/shared/components/ui/tag-filter-group.tsx`
* **Purpose:** Allow students or instructors to filter resources, modules, or study topics by technological category.
* **Suggested daisyUI style:** `badge badge-lg` styled as form controls via the CSS `peer-checked` trick.
* **Suggested Props Contract (TypeScript):**
  ```typescript title="src/shared/components/ui/tag-filter-group.tsx"
  interface TagOption {
    id: string;
    name: string;
    isSelected: boolean;
  }

  interface TagFilterGroupProps {
    title: string;
    tags: TagOption[];
    onTagToggle?: (tagId: string) => void;
  }
  ```
* **Suggested daisyUI & Tailwind base classes:** `badge`, `badge-lg`, `cursor-pointer`, `hidden peer`, `peer-checked:bg-primary peer-checked:text-white`.
* **What to use:**
  * Hide `<input type="checkbox" className="hidden peer" />` inside the `<label>` and style the adjacent `<span>` with Tailwind's `peer-checked:` modifiers.
  * If selection alters search parameters in the URL, link each tag with a `<Link href="...">` that manipulates `searchParams` in a Server Component.
* **What to AVOID:**
  * **Do not** force imperative state if filters can be canonically persisted in the URL (`?tech=tailwind&tech=daisyui`).
  * **Do not** forget keyboard focus (`focus-visible:ring-2`) for users navigating with `Tab`.

</TabItem>
</Tabs>

---

## 6. Level 3: Organisms

Complete interface structures that orchestrate multiple molecules, layouts, and action flows.

### 15. Event or Hackathon Card with Countdown

<Tabs>
<TabItem value="vista" label="Component & Preview" default>

<DaisyPreview id={15} height="280px" />

Institutional event announcement card featuring an event badge, remaining spots indicator in Icesi Orange (`#e9683b`), title, schedule and auditorium, a modular countdown clock in monospace typography with digits in Icesi Blue (`#5454e9`), and team registration button.

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `src/features/events/components/event-countdown-card.tsx`
* **Purpose:** Promote extracurricular workshops, development challenges, and engineering faculty events.
* **Suggested daisyUI style:** `card bg-base-100 border border-[#cecfd4]`, `countdown font-mono` component, and prominent `btn-primary` (`#5454e9`) button.
* **Suggested Props Contract (TypeScript):**
  ```typescript title="src/features/events/components/event-countdown-card.tsx"
  interface EventCountdownCardProps {
    eventTitle: string;
    categoryTag: string;
    spotsLeft: number;
    location: string;
    dateText: string;
    countdown: {
      days: number;
      hours: number;
      minutes: number;
    };
    onRegisterClick?: () => void;
  }
  ```
* **Suggested daisyUI base classes:** `card`, `countdown font-mono text-2xl font-bold text-primary`, `badge badge-primary`, `btn btn-primary w-full`.
* **What to use:**
  * daisyUI provides the `countdown` class which synchronizes tabular digit styles.
  * If the countdown ticks down in real time every second, encapsulate only the clock in a `'use client'` boundary, allowing the rest of the card to render as a Server Component.
* **What to AVOID:**
  * **Do not** mark the whole event card with `'use client'` just because the clock updates; leverage the composition pattern by passing client components as children of a Server Component.
  * **Do not** omit the urgency indicator when few spots remain.

</TabItem>
</Tabs>

---

### 16. Application Navbar with User Menu

<Tabs>
<TabItem value="vista" label="Component & Preview" default>

<DaisyPreview id={16} height="130px" />

Header bar unifying the institutional logo in Icesi Blue (`#5454e9`), portal name, and academic term on the left, alongside a notification button with counter badge in Icesi Purple (`#865cf0`) and avatar with dropdown menu on the right.

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `src/shared/components/ui/academic-app-navbar.tsx`
* **Purpose:** Persistent main navigation header for portal layouts (`layout.tsx`) in Next.js.
* **Suggested daisyUI style:** `navbar bg-base-100 border-b border-[#cecfd4]`, notification indicator `indicator` with `badge-secondary` (`#865cf0`).
* **Suggested Props Contract (TypeScript):**
  ```typescript title="layout.tsx"
  interface UserSessionData {
    name: string;
    avatarUrl: string;
    notificationsCount: number;
    currentTerm: string;
  }

  interface AcademicAppNavbarProps {
    brandName: string;
    user: UserSessionData;
  }
  ```
* **Suggested daisyUI base classes:** `navbar`, `navbar-start`, `navbar-end`, `indicator`, `indicator-item`, `badge badge-xs badge-secondary`, `avatar online`.
* **What to use:**
  * An ideal candidate to live in `app/layout.tsx` as a Server Component receiving authenticated session data from the server without exposing credentials on the client.
  * Use a `<Link href="/">` component for the logo to always return to the portal root.
* **What to AVOID:**
  * **Do not** add `'use client'` to the entire navbar; if the dropdown requires interaction, isolate only the dropdown menu into an independent client component.
  * **Do not** set rigid pixel heights that collapse the layout on mobile devices.

</TabItem>
</Tabs>

---

### 17. Modular Tutoring Request Form

<Tabs>
<TabItem value="vista" label="Component & Preview" default>

<DaisyPreview id={17} height="300px" />

Modular card form featuring a dropdown selector for advising topic, multiline text area for describing technical questions, and a primary submit button in Icesi Blue (`#5454e9`).

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `src/features/tutoring/components/tutoring-request-form.tsx`
* **Purpose:** Allow students to schedule technical support sessions with lab monitors or course instructors.
* **Suggested daisyUI style:** `card bg-base-100 border border-[#cecfd4]`, fields `select select-bordered select-sm` and `textarea textarea-bordered textarea-sm`.
* **Suggested Props Contract (TypeScript):**
  ```typescript title="src/features/tutoring/components/tutoring-request-form.tsx"
  interface TutoringTopicOption {
    id: string;
    label: string;
  }

  interface TutoringRequestFormProps {
    availableTopics: TutoringTopicOption[];
    actionHandler?: (formData: FormData) => Promise<void>; // Server Action
  }
  ```
* **Suggested daisyUI base classes:** `form-control`, `label`, `label-text`, `select select-bordered`, `textarea textarea-bordered`, `btn btn-primary btn-sm`.
* **What to use:**
  * In Next.js 16, you can connect this form directly to a **Server Action** via `<form action={...}>` using the action attribute without needing `'use client'` or `preventDefault()`.
  * Use semantic attributes `required`, `placeholder`, and `name` on each field so the `FormData` object is processed natively on the server.
* **What to AVOID:**
  * **Do not** use `onChange` with a `useState` for each text field unless you require live, character-by-character validation.
  * **Do not** forget to specify the `name` attribute on `<select>` and `<textarea>` elements.

</TabItem>
</Tabs>

---

### 18. Submission Confirmation Modal Dialog

<Tabs>
<TabItem value="vista" label="Component & Preview" default>

<DaisyPreview id={18} height="225px" />

Confirmation dialog warning about an irreversible action, featuring a warning icon in Icesi Orange (`#e9683b`), bold title, descriptive text of the file to submit, and an action bar with options to cancel or confirm submission in Icesi Blue (`#5454e9`).

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `src/shared/components/ui/submission-confirm-modal.tsx`
* **Purpose:** Prevent accidental submissions or file overwrites in graded deliverables.
* **Suggested daisyUI style:** Modal component `modal-box bg-base-100 border border-[#cecfd4] shadow-xl` and action bar `modal-action`.
* **Suggested Props Contract (TypeScript):**
  ```typescript title="src/shared/components/ui/submission-confirm-modal.tsx"
  interface SubmissionConfirmModalProps {
    isOpen: boolean;
    assignmentName: string;
    warningMessage?: string;
    onConfirm: () => void;
    onCancel: () => void;
  }
  ```
* **Suggested daisyUI base classes:** `modal`, `modal-open`, `modal-box`, `modal-action`, `btn btn-sm btn-ghost`, `btn btn-sm btn-primary`.
* **What to use:**
  * You can implement it using the native HTML `<dialog>` tag combined with daisyUI's `modal` class, invoking `.showModal()` or toggling the `modal-open` class.
  * Ensure the user can press the `Escape` key to close the modal naturally.
* **What to AVOID:**
  * **Do not** use manual React portals with direct manipulation of `document.body` when the native `<dialog>` tag and daisyUI handle the backdrop automatically.
  * **Do not** omit accessible focus: the primary action button must be readily identifiable by the user.

</TabItem>
</Tabs>

---

### 19. Faculty Profile Card with Tabs and Schedules

<Tabs>
<TabItem value="vista" label="Component & Preview" default>

<DaisyPreview id={19} height="280px" />

Faculty introduction card integrating an avatar with ring in Icesi Blue (`#5454e9`), department info, a tab system (*boxed tabs*) to toggle between courses, advising hours, and publications, plus a contact button.

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `src/features/faculty/components/faculty-profile-card.tsx`
* **Purpose:** Display the full faculty profile for IT department professors on the degree portal.
* **Suggested daisyUI style:** `card bg-base-100 border border-[#cecfd4]`, `tabs tabs-boxed bg-slate-100`, and active tab `tab-active text-primary` (`#5454e9`).
* **Suggested Props Contract (TypeScript):**
  ```typescript title="src/features/faculty/components/faculty-profile-card.tsx"
  interface FacultyTabContent {
    id: string;
    label: string;
    content: React.ReactNode;
  }

  interface FacultyProfileCardProps {
    fullName: string;
    academicRole: string;
    department: string;
    avatarUrl: string;
    tabs: FacultyTabContent[];
    onContactClick?: () => void;
  }
  ```
* **Suggested daisyUI base classes:** `card`, `avatar`, `tabs tabs-boxed`, `tab`, `tab-active`, `btn btn-xs btn-outline btn-primary`.
* **What to use:**
  * If switching tabs changes the view without reloading the page, this tab sub-panel does require `'use client'` to manage the active tab index with `useState`.
  * The outer container card can remain a Server Component passing the instructor data.
* **What to AVOID:**
  * **Do not** download heavy publications in the client bundle; render the initial content from the server.
  * **Do not** break corner radius harmony: if the outer card has `rounded-2xl`, the boxed tabs container must have `rounded-xl`.

</TabItem>
</Tabs>

---

### 20. Collapsible Accordion Sprint Deliverables Board

<Tabs>
<TabItem value="vista" label="Component & Preview" default>

<DaisyPreview id={20} height="235px" />

Collapsible accordion composed using daisyUI's `join` component, grouping course sprints with status badges in Icesi Green (`#4cb979` for completed) and Icesi Yellow (`#e4eb60` for in progress), animated arrows, and technical verification items inside.

</TabItem>
<TabItem value="consejos" label="Tips & Guide">

* **Suggested location:** `src/features/projects/components/sprint-accordion-panel.tsx`
* **Purpose:** Organize the semester project sprint backlog, allowing delivery phases to expand and collapse.
* **Suggested daisyUI style:** Unified container `join join-vertical w-full` with blocks `collapse collapse-arrow join-item border border-[#cecfd4]`.
* **Suggested Props Contract (TypeScript):**
  ```typescript title="src/features/projects/components/sprint-accordion-panel.tsx"
  interface SprintTask {
    description: string;
    isDone: boolean;
  }

  interface SprintPhase {
    sprintNumber: number;
    title: string;
    status: 'completed' | 'in_progress' | 'pending';
    tasks: SprintTask[];
    isDefaultOpen?: boolean;
  }

  interface SprintAccordionPanelProps {
    sprints: SprintPhase[];
  }
  ```
* **Suggested daisyUI base classes:** `join join-vertical`, `collapse collapse-arrow join-item`, `collapse-title`, `collapse-content`, `badge`.
* **What to use:**
  * daisyUI allows building collapsible accordions **100% in pure CSS without `'use client'` or JavaScript**, simply by placing an `<input type="radio" name="sprint-accordion" defaultChecked />` element inside the `collapse` block.
  * The `collapse-arrow` class automatically adds arrow rotation animation when the input changes state.
* **What to AVOID:**
  * **Major anti-pattern!** Do not write manual `onClick` event handlers with state booleans to open and close accordions when daisyUI's native solution with `<input type="radio">` or `<details>` is faster, accessible, and works as a Server Component without client-side JavaScript.
  * **Do not** forget to include the `join-item` class on each `collapse` element so that rounded corners and shared borders align seamlessly.

</TabItem>
</Tabs>

---

## 7. Best Practices

Apply this decision matrix before implementing each of your components in Next.js:

| Dimension | Recommended Approach | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **`'use client'` directive** | Only in components with interactive events (`onClick`, `onChange`), hooks (`useState`, `useEffect`), or browser APIs. | Adding `'use client'` to all files by default "just in case". |
| **Styles & Palette** | daisyUI semantic classes (`btn-primary`, `badge-secondary`, `bg-base-100`) configured in the institutional `icesi` theme (Blue `#5454e9`, Purple `#865cf0`, Green `#4cb979`, Orange `#e9683b`, Yellow `#e4eb60`). | Inline styles (`style={{...}}`) or arbitrary hexadecimal color classes (`bg-[#0033a0]`). |
| **Props Contract** | Clear and explicit TypeScript interfaces with union types (`'sm' \| 'md' \| 'lg'`). | Props typed with `any` or lacking default values. |
| **HTML Structure** | Native semantic tags (`<button>`, `<dialog>`, `<nav>`, `<kbd>`, `<progress>`). | Nesting multiple empty `<div>` tags lacking semantic meaning or accessibility. |
| **Navigation** | Next.js `<Link href="...">` component for internal portal routes. | Conventional `<a>` tags forcing a full page reload. |
