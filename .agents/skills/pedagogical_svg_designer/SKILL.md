---
name: pedagogical-svg-designer
description: Designs and generates clean, modern, pedagogical vector SVG diagrams and illustrations inspired by Professor Domiciano Rincón's visual teaching methodology. Ideal for explaining architectures, cloud deployments, multi-stage pipelines, and mental models to university students with high visual impact and concise text.
---

# Pedagogical SVG Designer Skill

This skill provides design standards, concrete physical metaphor recipes, component specifications, and ready-to-use vector templates for creating **modern, pedagogical SVG diagrams** in **DocuKelo** (Docusaurus).

Inspired by Professor **Domiciano Rincón's** educational visual methodology (*Seminario de Software*), this design system replaces walls of text and generic, boring rectangular flowcharts with **concrete, recognizable physical metaphors**, modular card containers, and strict text economy tailored for university engineering students.

---

## 1. Core Pedagogical Philosophy

1. **Concrete Physical Metaphors ("Show, Don't Box")**:
   - **STRICT PROHIBITION**: Never create diagrams that are simply lists of plain rectangular boxes filled with paragraphs.
   - Ground abstract software concepts into **concrete, recognizable physical objects**:
     - *Local development machine* &rarr; A detailed **laptop** with screen, dark code editor, and keyboard base.
     - *Cloud server or production host* &rarr; A **blade server rack** with horizontal server slots, LED activity status lights, and ventilation grills.
     - *Relational database* &rarr; A **3D cylinder** with stacked platter segments, metallic ring bands, and SSD volume metrics.
     - *Docker container* &rarr; An **intermodal freight shipping container** with corrugated vertical ribs and corner lock castings.
     - *Multi-stage compilation* &rarr; An **industrial filtration funnel or furnace** (raw ingredients in &rarr; build furnace &rarr; discarded waste filtered out &rarr; ultralight production capsule out).
     - *Client devices* &rarr; A **smartphone mockup** or a **browser window** with address bar.
2. **Absolute Text Economy ("Visual First")**:
   - Modern students scan visuals before reading prose. An SVG diagram is **not an article**; it is a mental model anchor.
   - Text inside SVGs MUST be strictly limited to:
     - Clear titles (`18px - 22px`) and single-line contextual subtitles (`12px - 14px`).
     - Short category tags and badges (e.g., `Step 1`, `PROD`, `LOCAL`).
     - Concrete technical metrics and commands (e.g., `PORT: 3000`, `~1.2 GB`, `~140 MB`, `npm run build`, `5432`).
     - Exact status chips (`100% Identical`, `Alpine Linux`, `Zero Overhead`).
   - **Zero narrative paragraphs inside SVG nodes**: All conceptual storytelling belongs in the surrounding Markdown text, not inside the vector graphic.
3. **Visual Encapsulation & Spatial Boundaries**:
   - Group related components inside clean **encapsulation cards** with soft backgrounds, rounded corners (`rx="12"`), and subtle border strokes.
   - Use dashed boundary containers (`stroke-dasharray="6 5"`) with security badges to visually represent private subnets, Docker networks, or cloud clusters.
4. **Storage & Markdown Integration Rules**:
   - **MANDATORY**: Always save each diagram as a standalone `.svg` file under `static/img/<course-name>/<diagram-name>.svg`.
   - In Markdown/MDX, embed via standard clean Markdown syntax:
     ```markdown
     ![Meaningful descriptive alt text](/img/<course-name>/<diagram-name>.svg)
     ```
   - **NEVER** paste multi-hundred-line inline `<svg>` blocks directly into Markdown files.

---

## 2. Palette & Design Tokens

Every pedagogical SVG must include a `<defs>` section containing CSS classes, filters, and arrow markers.

```xml
<defs>
  <style>
    /* Typography & Hierarchy */
    .title { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; font-size: 20px; font-weight: 700; fill: #0f172a; }
    .sub   { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; font-size: 13px; fill: #64748b; }
    .label { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; fill: #475569; }
    .body  { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; font-size: 12px; fill: #334155; }
    .mono  { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; }

    /* Surface & Container Tokens */
    .bg-canvas { fill: #f8fafc; }
    .card-white { fill: #ffffff; stroke: #e2e8f0; stroke-width: 1.5; rx: 12px; }
    .card-dashed { fill: #f8fafc; stroke: #cbd5e1; stroke-width: 1.5; stroke-dasharray: 6 5; rx: 12px; }

    /* Semantic Accent Badges */
    .badge-blue   { fill: #eff6ff; stroke: #93c5fd; stroke-width: 1.2; rx: 6px; }
    .badge-green  { fill: #f0fdf4; stroke: #86efac; stroke-width: 1.2; rx: 6px; }
    .badge-purple { fill: #faf5ff; stroke: #d8b4fe; stroke-width: 1.2; rx: 6px; }
    .badge-orange { fill: #fff7ed; stroke: #fdba74; stroke-width: 1.2; rx: 6px; }
    .badge-red    { fill: #fef2f2; stroke: #fca5a5; stroke-width: 1.2; rx: 6px; }

    /* Directed Connectors */
    .arrow-base   { fill: none; stroke: #64748b; stroke-width: 1.8; marker-end: url(#arrow-gray); }
    .arrow-blue   { fill: none; stroke: #2563eb; stroke-width: 2; marker-end: url(#arrow-blue); }
    .arrow-dashed { fill: none; stroke: #94a3b8; stroke-width: 1.8; stroke-dasharray: 5 4; marker-end: url(#arrow-gray); }
  </style>

  <!-- Drop Shadow Filter -->
  <filter id="soft-shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
    <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.06"/>
  </filter>

  <!-- Markers -->
  <marker id="arrow-gray" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M0,0 L10,5 L0,10 L2.5,5 Z" fill="#64748b"/>
  </marker>
  <marker id="arrow-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M0,0 L10,5 L0,10 L2.5,5 Z" fill="#2563eb"/>
  </marker>
</defs>
```

---

## 3. Concrete Physical Metaphor Recipes (Vector Building Blocks)

### Metaphor 1: The Developer Laptop (Local Workstation)
Draws a laptop with code editor window and hardware base:

```xml
<g class="laptop" transform="translate(x, y)">
  <!-- Screen Bezel -->
  <rect x="0" y="0" width="180" height="110" rx="8" fill="#1e293b" stroke="#334155" stroke-width="2"/>
  <!-- Code Editor Window -->
  <rect x="8" y="8" width="164" height="94" rx="4" fill="#0f172a"/>
  <!-- Window Controls -->
  <circle cx="18" cy="18" r="3" fill="#ef4444"/>
  <circle cx="28" cy="18" r="3" fill="#f59e0b"/>
  <circle cx="38" cy="18" r="3" fill="#10b981"/>
  <!-- Mock Code Lines -->
  <text class="mono" x="18" y="38" fill="#38bdf8">$ npm run start:dev</text>
  <text class="mono" x="18" y="56" fill="#4ade80">&gt; NestJS: 127.0.0.1:3000</text>
  <text class="mono" x="18" y="74" fill="#94a3b8">&gt; Postgres: localhost:5432</text>
  <!-- Laptop Base & Hinge -->
  <path d="M-15,110 L195,110 L180,122 L0,122 Z" fill="#94a3b8"/>
  <rect x="70" y="112" width="40" height="5" rx="2" fill="#64748b"/>
</g>
```

### Metaphor 2: The Production Server Rack (Cloud Host)
Draws an enterprise 2U/4U blade rack chassis with status LEDs and disk bays:

```xml
<g class="server-rack" transform="translate(x, y)">
  <!-- Main Rack Chassis -->
  <rect x="0" y="0" width="190" height="140" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
  <!-- Blade Unit 1 (Backend App) -->
  <rect x="10" y="12" width="170" height="50" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
  <circle cx="26" cy="37" r="4" fill="#10b981"/>
  <text class="mono" x="38" y="34" fill="#38bdf8" font-weight="700">NestJS Container</text>
  <text class="mono" x="38" y="48" fill="#94a3b8">Port: 3000 (HTTPS)</text>
  <!-- Blade Unit 2 (Postgres Database) -->
  <rect x="10" y="74" width="170" height="50" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
  <circle cx="26" cy="99" r="4" fill="#a855f7"/>
  <text class="mono" x="38" y="96" fill="#c084fc" font-weight="700">PostgreSQL Cloud</text>
  <text class="mono" x="38" y="110" fill="#94a3b8">Volume SSD: Persistent</text>
</g>
```

### Metaphor 3: The 3D Relational Database Cylinder
Draws a dimensional database barrel with stacked segments:

```xml
<g class="db-cylinder" transform="translate(x, y)">
  <!-- Lower Body -->
  <path d="M0,18 C0,28 70,28 70,18 L70,55 C70,65 0,65 0,55 Z" fill="#0284c7"/>
  <!-- Segment Cut Lines -->
  <path d="M0,36 C0,46 70,46 70,36" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
  <!-- Top Cap Ellipse -->
  <ellipse cx="35" cy="18" rx="35" ry="10" fill="#38bdf8"/>
  <!-- Activity LED & Label -->
  <circle cx="16" cy="48" r="3" fill="#4ade80"/>
  <text class="mono" x="26" y="52" fill="#ffffff" font-weight="700" font-size="11px">SQL</text>
</g>
```

### Metaphor 4: The Intermodal Shipping Container (Docker)
Draws a corrugated steel shipping container encapsulating software components:

```xml
<g class="docker-container" transform="translate(x, y)">
  <!-- Container Box Body -->
  <rect x="0" y="0" width="150" height="85" rx="6" fill="#1d4ed8" stroke="#1e40af" stroke-width="2"/>
  <!-- Corrugated Vertical Rib Lines -->
  <line x1="25" y1="6" x2="25" y2="79" stroke="#3b82f6" stroke-width="2.5"/>
  <line x1="45" y1="6" x2="45" y2="79" stroke="#3b82f6" stroke-width="2.5"/>
  <line x1="65" y1="6" x2="65" y2="79" stroke="#3b82f6" stroke-width="2.5"/>
  <line x1="85" y1="6" x2="85" y2="79" stroke="#3b82f6" stroke-width="2.5"/>
  <line x1="105" y1="6" x2="105" y2="79" stroke="#3b82f6" stroke-width="2.5"/>
  <line x1="125" y1="6" x2="125" y2="79" stroke="#3b82f6" stroke-width="2.5"/>
  <!-- Container Stencil Stamp Badge -->
  <rect x="25" y="24" width="100" height="36" rx="4" fill="#0f172a" opacity="0.9"/>
  <text class="mono" x="75" y="40" fill="#38bdf8" font-weight="700" text-anchor="middle">DOCKER</text>
  <text class="mono" x="75" y="52" fill="#94a3b8" font-size="10px" text-anchor="middle">Linux x86_64</text>
</g>
```

### Metaphor 5: The Multi-Stage Optimization Funnel (Deps &rarr; Build &rarr; Runner)
Illustrates why production images shrink from 1.2 GB to ~140 MB:
- **Stage 1 (deps)**: Raw dependency ingestion card (`npm ci`).
- **Stage 2 (builder)**: Dark furnace/compiler card (`npm run build`), with explicit red trash/discard badge for `tsc`, tests, and devDependencies.
- **Stage 3 (runner)**: Clean, highlighted green production capsule holding solely `dist/main.js` and production dependencies (`--omit=dev`).

---

## 4. Layout & Spatial Composition Rules

| Area | Coordinate Standards | Design Rules |
|:---|:---|:---|
| **Header Zone** | `x="32"`, `y="34"` (Title), `y="54"` (Subtitle) | Concise main title (`20px`) and one-line objective subtitle (`13px`). |
| **Card Padding** | `rx="12"`, internal padding &ge; `16px` | Never let text touch borders. Maintain generous whitespace. |
| **Column Alignment** | 2-column or 3-column balanced grids | Ensure equal heights and vertical alignment of headers across columns. |
| **Connecting Arrows** | `path` with orthogonal bezier bends (`M... C...`) | Avoid overlapping arrows across other containers. Use explicit marker definitions. |
| **Footer / Summary** | `y="H - 35"` centered or bottom-aligned | Optional single-line takeaway chip (e.g. `Consistent Across All Machines`). |

---

## 5. Pre-Export Quality Verification Checklist

Before saving any SVG diagram, the agent MUST run this verification checklist:

- [ ] **No Generic Box Hell**: Does the diagram use at least one physical/concrete metaphor (laptop, server rack, cylinder database, container, furnace funnel) instead of plain text boxes?
- [ ] **Zero Text Clutter**: Are there zero narrative paragraphs? Is text strictly limited to labels, numbers, metrics, and commands?
- [ ] **Responsive ViewBox**: Does the `<svg>` include `viewBox="0 0 W H"` with `width="100%"` and a style constraining `max-width`?
- [ ] **Contrast & Accessibility**: Do dark panels have bright text (`#e2e8f0`, `#38bdf8`, `#4ade80`), and light panels have dark text (`#0f172a`, `#334155`)?
- [ ] **Saved in Correct Location**: Is the file saved in `static/img/<course-name>/<diagram-name>.svg`?
- [ ] **Referenced via Clean Markdown**: Is it embedded via `![Alt](/img/<course-name>/<diagram-name>.svg)` without raw inline XML in `.md` files?
