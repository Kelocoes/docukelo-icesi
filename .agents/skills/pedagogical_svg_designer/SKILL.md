---
name: pedagogical-svg-designer
description: Designs clean, abstract, conceptual vector SVG diagrams for lectures and slides in DocuKelo. Uses a visual grammar (shapes, arrows, wires, rings, funnels, plugs, pipelines) where structure carries the meaning and text is reduced to labels. Includes a reasoning protocol, shape and color vocabularies, a pattern catalog, technical SVG rules, and a QA checklist so any agent can reproduce the same quality on any topic.
---

# Pedagogical SVG Designer Skill

This skill teaches an agent how to **think** a diagram before drawing it, and how to **draw** it so the audience understands the concept **without reading**. It is topic-agnostic: software architecture, networks, DevOps, UI/UX, data, AI, or anything else taught at Universidad Icesi.

Reference material:
- [shape-library.md](./references/shape-library.md): copy-paste SVG snippets for every shape, connector and boilerplate used here.
- [pattern-catalog.md](./references/pattern-catalog.md): the 10 composition patterns, with layout sketches, coordinates and reference files in the repo.

> **Golden rule:** a diagram is not a summary of the lesson. It is **one idea made visible**. If the audience needs to read a sentence to get it, the diagram failed.

---

## 1. Core Philosophy

1. **One diagram = one idea.** Express the idea as a single claim sentence first (for example, "dependencies only point inward"). If you need "and" to state it, split it into two diagrams.
2. **Structure carries meaning, text only names things.** Position, shape, size, color, direction and connection must encode the concept. Text is limited to labels.
3. **Show relationships, not inventories.** Do not list what exists. Show how things relate: who depends on whom, what flows where, what can be swapped, what is forbidden.
4. **Abstract, not literal.** Prefer simplified geometric forms (circle, hexagon, triangle, cloud, plug) over screenshots, UI chrome or realistic hardware. The audience should recognise the *role*, not the product.
5. **No emojis, no decorative icons, no clip art.** Every element must have a meaning.
6. **Slide-ready.** Must be legible when projected: few elements, big shapes, thick strokes, generous whitespace.

---

## 2. The Reasoning Protocol (follow in order, write the answers down)

Before producing any SVG, answer these steps explicitly (in your reasoning or as a short comment). Skipping them is the main cause of weak diagrams.

### Step 1. State the single idea
Write one sentence: *"The viewer should leave knowing that ___."*
Also write the **anti-idea** (the misconception it corrects). It often becomes the left side of a before/after.

### Step 2. Classify the relationship
Pick the dominant relationship in the idea. It selects the visual grammar.

| If the idea is about... | Dominant relationship | Visual grammar |
|:---|:---|:---|
| Messy vs. organized | Contrast | Before/After split with divider |
| Protection, levels, "inside vs outside" | Containment, hierarchy | Concentric rings |
| Steps over time or request/response | Sequence | Pipeline of stations with morphing packets |
| Raw becomes clean | Transformation | Funnel with irregular shapes in, uniform shapes out |
| Replaceable parts, interfaces, contracts | Substitutability | Socket and plugs, or core with swappable satellites |
| Choosing between options | Selection | Switch connecting one source to one consumer |
| Folders, modules, components | Structure | Tree with folder shapes and curved branches |
| Evolution, history | Chronology | Axis with nodes and one icon per era |
| Layers that depend on each other | Dependency direction | Stacked slabs with directional arrows |
| Forbidden or discouraged | Constraint | Red dashed arrow ending in an X |

### Step 3. Inventory the nouns, then cut
List every concept you could draw. Keep **3 to 7**. Anything beyond 7 is a second diagram. For each kept noun, decide whether it needs to be **seen** (shape) or just **named** (label).

### Step 4. Assign a shape and a color role to each noun
Use the vocabularies in sections 4 and 5. Rule: **same type of thing = same shape**; **different type = different shape**. If two nouns share a role, they share a shape. This lets the viewer decode the diagram without a legend.

### Step 5. Choose the pattern and compose
Select a pattern from [pattern-catalog.md](./references/pattern-catalog.md). Place elements on the grid. Decide reading direction (left to right, top to bottom, or outside to inside) and keep it consistent.

### Step 6. Spend the text budget
Title (one claim). Then labels only (section 7). For every text node ask: *"If I delete it, does the diagram still work?"* If yes, delete it.

### Step 7. Verify with the tests in section 10
Run the XML validation, the geometry check, and the three perception tests (5-second, squint, no-read).

---

## 3. Visual Grammar: What Each Graphic Device Means

Use graphic devices consistently. Their meaning must not change between diagrams in the same lesson.

| Device | Meaning | Style |
|:---|:---|:---|
| Solid arrow | Allowed flow or dependency | stroke 3, slate or accent color, arrowhead |
| Dashed arrow | Optional, inactive, return path, or "would connect to" | stroke 2.5 to 3, `stroke-dasharray="6 5"` or `8 6` |
| Red dashed arrow ending in a circled X | Forbidden direction | red `#dc2626` |
| Thick rounded line (wire, pipe) | A connection that carries something | stroke 4 to 14, `stroke-linecap="round"` |
| Tangled curves | Coupling, chaos, "everything talks to everything" | many red curves crossing, low opacity |
| Concentric circles | Levels, protection, stability from center outward | fills from light to saturated toward the core |
| Funnel | Normalization, validation, translation | trapezoid with an ellipse mouth |
| Plug and socket | Contract and replaceable implementation | socket = interface, plug = implementation |
| Switch (pill with knob) | Selector or configuration decision | pill with a circle knob toward the active side |
| Dashed outline shape | Alternative or inactive option | `stroke-dasharray`, gray |
| Check inside circle | Valid, clean, guaranteed data | green circle with a tick |
| Divider with small "vs" circle | Contrast between two worlds | dashed vertical line |

### Morphing packets (key technique for flows)
When data changes nature along a flow, **change the shape of the packet**, not the label. Example: circle (input params) becomes triangle (raw DTO) becomes rounded square (clean entity). Include a three-item mini legend only when shapes are not self-evident.

---

## 4. Shape Vocabulary (shape = type of thing)

Assign roles, not product names. Reuse the same mapping in every diagram of a lesson.

| Shape | Typical meaning | Notes |
|:---|:---|:---|
| Large circle | Core, center, central concept, station in a pipeline | Fill pale, stroke strong, 3 to 4 px |
| Concentric rings | Layers of protection or abstraction | Center = most stable |
| Hexagon | Rules, policy, application logic, a port | Alternative: use-case node |
| Triangle | Raw, external, unvalidated data | Orange tints |
| Rounded square | Clean, internal, validated data | Green tints |
| Diamond | State, decision, variable | Use sparingly |
| Cloud | Remote system, API, internet | Three circles plus a base rectangle |
| Chip (rectangle with pins) | Memory, mock, local simulation | Pins on top and bottom |
| Window (rectangle with title bar) | User interface, screen | Three simple bars inside, no text |
| Cylinder | Database or storage | Ellipse caps |
| Folder | Directory or module | Rounded body with a tab |
| Pill (rounded rectangle, radius = half height) | Technology tag, library name, token | Mono font, 12px |
| Parallelogram slab | One layer in a stack | Skewed sides give depth without 3D |
| Small filled circle on a boundary | Port or connection point | White fill, colored stroke |

If a topic needs a new shape, pick the simplest geometric form that suggests the role, document its meaning in the diagram (label or legend), and keep it consistent.

---

## 5. Color Semantics (roles, not topics)

Always use a **light fill with a strong stroke of the same hue**. Color encodes **role**.

| Role | Fill | Stroke | Text | Typical use |
|:---|:---|:---|:---|:---|
| Core / most important concept | `#ede9fe` | `#7c3aed` | `#581c87` | Domain, kernel, the protected thing |
| Application / mediator | `#ffedd5` | `#ea580c` | `#9a3412` | Use cases, services, orchestrators |
| Presentation / user side | `#dbeafe` | `#2563eb` | `#1e3a8a` | UI, clients, input |
| Infrastructure / data / success | `#dcfce7` | `#16a34a` | `#14532d` | Storage, adapters, valid state |
| Raw / warning | `#fed7aa` or `#fde68a` | `#ea580c` or `#d97706` | `#92400e` | Unvalidated data, caution |
| Problem / forbidden | `#fee2e2` | `#ef4444` or `#dc2626` | `#b91c1c` | Antipattern, coupling, prohibited |
| Neutral / inactive | `#f1f5f9` | `#94a3b8` | `#475569` | Alternatives, disabled, background |

Additional rules:
- Canvas background `#f8fafc`, with `rx="16"`.
- Text on light fills uses the dark text color of that role. Text on dark shapes uses `#f8fafc`.
- Use at most **4 hues** in one diagram. Red appears only for problems or prohibitions.
- Never rely on color alone: shape and position must also carry the meaning.

---

## 6. Canvas, Layout and Typography

### Canvas
- `viewBox="0 0 880 440"` (2:1) with `width="100%" height="100%"`. This is the default for slides.
- Use `880 x 520` only if the idea truly needs vertical space. Never go taller than 560.
- Margins: 32 px left and right, 24 px bottom.

### Title
- One line at `x="32" y="38"`, `font-size 20`, weight 700, color `#0f172a`.
- Write it as a **claim**, not a topic: "Las flechas solo entran", not "Capas".
- Maximum around 60 characters. No subtitle unless indispensable.

### Zones
- Content area: `y` from 70 to 420.
- Reserve `y 70 to 100` for column headers (uppercase, letter-spacing, 12 to 13 px) when there are two or more groups.
- Keep a visual center of gravity: the most important shape is larger, more saturated, or more central.

### Spacing and alignment
- Gap between related shapes: 40 to 80 px. Between unrelated groups: at least 100 px.
- Align centers on a common axis (horizontal or vertical). Distribute stations evenly.
- Arrow length at least 40 px so the arrowhead is visible.

### Stroke and size
- Shape strokes: 2.5 to 4 px. Core shapes 3.5 to 4.
- Pipes and wires: 4 to 14 px.
- Minimum font size: 11 px. Labels 12 px. Headers 12 to 13 px uppercase with `letter-spacing: .06em` to `.08em`.
- Typefaces: `system-ui` for labels, `ui-monospace, Consolas, monospace` for code tokens.

### Reading direction
- Process: left to right.
- Hierarchy or layering: top to bottom, or outside to inside.
- Before/After: left (problem, red) and right (solution, green).
- Return paths go below the main flow as a dashed U.

---

## 7. Text Budget

| Element | Limit |
|:---|:---|
| Title | 1 line, one claim |
| Labels | 1 to 3 words |
| Tokens (code names) | Exact identifier only (`toDomain()`, `fetch`, `muscle_group: null`) |
| Total text nodes | Aim for 8 to 14 per diagram |
| Sentences | None. Never write a sentence inside a shape |
| Bullet lists | Forbidden inside diagrams |

Allowed text: titles, uppercase role headers, technology pills, function or file names, years, numbers on stations.
Forbidden text: explanations, definitions, "because" statements, descriptions of benefits. Those belong in the Markdown around the diagram.

If you feel the diagram needs an explanation, **change the structure** (a different shape, a clearer arrow), not the text.

---

## 8. Anti-Patterns (never do this)

| Anti-pattern | Why it fails | Do this instead |
|:---|:---|:---|
| Cards inside cards ("box hell") | No relationship is visible, only containment | Use shapes, rings, wires and arrows |
| Panels with code listings inside the SVG | Becomes a screenshot of code, unreadable on slides | Put the code in Markdown; draw only the concept |
| Cards with 3 bullet lines | It is a slide of text in disguise | One label per element |
| Same rounded rectangle for every concept | Viewer cannot tell types apart | Different shape per type |
| Decorative gradients, shadows, glow | Noise on projectors | Flat fills with strong strokes |
| Many arrows crossing | Unreadable, unless crossing is the point (chaos) | Route arrows, reduce nodes, or split diagram |
| Arrowheads covering shapes | Hides endpoints | End arrows 6 to 10 px before the shape edge |
| Legends longer than the diagram | Overly complex encoding | Simplify encoding |
| Emojis or icon fonts | Inconsistent rendering, unprofessional | Geometric shapes |
| Hardcoding product logos | Dated, license issues | Neutral shape plus pill label |

---

## 9. SVG Technical Rules

1. **Valid XML.** Do not use HTML entities such as `&bull;`, `&rarr;`, `&larr;`, `&nbsp;`. Write the Unicode character directly or use numeric references. Only `&amp;`, `&lt;`, `&gt;`, `&quot;` are valid. Escape `<` and `>` inside text (`&lt;` `&gt;`).
2. **Unique ids.** Marker ids must be unique inside each file. Use short descriptive ids (`a-purple`, `out`, `in`).
3. **Arrowheads.** Use `markerWidth/Height` 7 to 8, `refX="8"`, `orient="auto"`. For double-ended arrows use `orient="auto-start-reverse"` with `refX="5"`.
4. **Z-order.** Draw in this order: background, wires and connectors, shapes, text. Wires must pass *under* shapes.
5. **Self-contained.** No external fonts, images, scripts, `foreignObject` or `<image>` tags.
6. **Classes in a `<style>` block.** Define reusable classes (`.t`, `.title`, `.head`, `.mono`). Use inline attributes for per-element color.
7. **Text.** Always set `text-anchor` explicitly. Center labels over their shapes. Baseline is roughly `y` plus a third of the font size for vertical centering.
8. **Coordinates.** Keep all content inside `32..848` horizontally. Check that no label exceeds its neighbor's bounds (estimate width: `characters * font-size * 0.58` for system-ui, `* 0.62` for mono).
9. **Accessibility.** Embedding in Markdown requires a meaningful alt text describing the idea, not the pixels.
10. **File.** Save as `static/img/<course-name>/<kebab-case-name>.svg`. Embed with `![Alt](/img/<course-name>/<name>.svg)`. Never paste inline `<svg>` into Markdown or MDX.

### Boilerplate
Start every file from the boilerplate in [shape-library.md](./references/shape-library.md#boilerplate).

---

## 10. Quality Assurance

### 10.1 Automated checks (run these, do not skip)
```bash
python -c "import xml.etree.ElementTree as ET,glob
for s in glob.glob('static/img/<course>/<prefix>-*.svg'):
    ET.parse(s); print('OK', s)"
```
Fix any `undefined entity` or `mismatched tag` error before delivering. Do not run `npm run build` unless the user explicitly asks.

### 10.2 Geometry checks (reason about coordinates)
- Does any label overlap a shape edge or another label?
- Does every arrow start and end outside shapes with a visible gap?
- Is the text inside shapes narrower than the shape (use the width estimate)?
- Are all elements inside the canvas margins?

### 10.3 Perception tests
1. **Five-second test:** can someone state the idea after five seconds, without reading the title? If not, strengthen the structure.
2. **Squint test:** blur your vision mentally. Do the big shapes and the colors alone suggest the idea (contrast, nesting, direction)?
3. **No-read test:** remove all text mentally. Can you still tell what is flowing, what is protected, what is swappable?
4. **Half-text test:** delete half of the labels. If the diagram still works, delete them.

### 10.4 Final checklist
- [ ] One idea, stated as a claim in the title.
- [ ] 3 to 7 visual elements, no more.
- [ ] Shape encodes type; color encodes role; arrows encode relationship.
- [ ] Zero sentences, zero bullets, zero emojis, zero code blocks inside the SVG.
- [ ] A recognizable pattern from the catalog (or a justified new one).
- [ ] Not boxes inside boxes. At least three different shape types used.
- [ ] Arrows have visible heads and gaps; forbidden direction uses red dashed plus X.
- [ ] Valid XML, `viewBox="0 0 880 440"`, `width="100%"`.
- [ ] Saved in `static/img/<course>/` and referenced with Markdown image syntax and descriptive alt text.

---

## 11. Workflow for an Agent

1. Read the lesson text and extract the concept(s) that deserve a diagram. Typically one diagram per concept that is spatial, directional, or about contrast.
2. For each diagram, write the **design brief**:
   ```
   Idea: ...
   Anti-idea: ...
   Relationship: ...
   Pattern: ...
   Elements (shape, role color, label): ...
   Reading direction: ...
   Text nodes (<= 14): ...
   ```
3. Draw using snippets from the shape library, adjusting coordinates on the grid.
4. Run the automated checks and the perception tests.
5. Embed in Markdown directly after the paragraph that introduces the concept, with a descriptive alt text.
6. If the user says a diagram "looks like boxes", redo it with a different pattern, not with cosmetic changes.

---

## 12. Worked Examples (reference implementations in this repo)

Open these to see the grammar applied. Each lists the brief that produced it.

| File | Idea | Pattern | Key devices |
|:---|:---|:---|:---|
| `static/img/computacion-3/clean-arch-spaghetti-vs-layers.svg` | Mixing everything couples; layers point to the core | Before/After split | Tangled red curves around a dark node; three parallelogram slabs with arrows to the middle slab |
| `static/img/computacion-3/clean-arch-onion-layers.svg` | Dependencies only point inward | Concentric rings | Three rings, three inward arrows with technology pills, one red dashed arrow with X |
| `static/img/computacion-3/clean-arch-entity-vs-dto.svg` | A mapper turns irregular raw data into uniform clean data | Funnel | Irregular polygons in, check circles out |
| `static/img/computacion-3/clean-arch-repository-pattern-flow.svg` | The repository is a socket; sources are interchangeable plugs | Socket and plugs | Plugged chip (active), unplugged cloud (dashed) |
| `static/img/computacion-3/clean-arch-data-flow-pipeline.svg` | One click travels to the backend and back | Pipeline with return U | Numbered stations, morphing packets (circle, triangle, square) |
| `static/img/computacion-3/clean-arch-dependency-injection.svg` | One switch decides which source feeds the app | Switch | Pill with knob, solid wire vs dashed wire, hexagon, window |
| `static/img/computacion-3/clean-arch-nextjs-feature-structure.svg` | A feature has three layers and they depend toward domain | Tree of folders | Folder shapes, curved branches, purple arrows into domain |
| `static/img/computacion-3/clean-arch-origins-timeline.svg` | The same idea recurs across three proposals | Timeline | Axis, hexagon and ring icons per era |
| `static/img/computacion-3/clean-arch-independence.svg` | The core stays; the details can be swapped | Core with swappable satellites | Wires, port dots, solid vs dashed pill pairs with swap arrows |

---

## 13. Adapting to Other Topics (examples of the thinking)

These are sketches of how to apply the protocol to non-architecture themes.

- **Docker image layers:** idea = "layers are cached and stacked". Pattern = stacked slabs, with one slab changing color to show cache invalidation and a red dashed arrow showing "everything above rebuilds".
- **HTTP request and response:** idea = "one request travels and returns". Pattern = pipeline with return U, morphing packets: request (circle), response (square), error (red triangle).
- **Git branching:** idea = "branches diverge and merge". Pattern = horizontal axis with curved branches; commits are circles; merge is a convergence node.
- **JWT authentication:** idea = "the token proves identity without asking again". Pattern = socket and keycard (shape: key outline) plus a checkpoint (hexagon) with a green check on valid and red X on invalid.
- **Frontend state management:** idea = "state lifted to a common parent". Pattern = tree with a state diamond moving up to the parent and arrows down to children (props) and up (callbacks, dashed).
- **Microservices vs monolith:** idea = "one block vs many small independent pieces". Pattern = before/after split with one large blob versus several small hexagons connected by thin wires.

For every new topic, **do the protocol first**; the shapes follow from the relationship, not from the product logos.

---

## 14. Physical Metaphor Library (optional, use sparingly)

When a topic is about **physical infrastructure**, you may use a more literal metaphor, but keep it abstract and label-light. Prefer the geometric vocabulary above for conceptual topics.

- **Local machine:** simplified laptop (screen rectangle plus base trapezoid).
- **Cloud host:** stacked horizontal slots with small status circles.
- **Database:** cylinder with two or three ring bands.
- **Docker container:** rectangle with vertical ribs and a corner stamp.
- **Multi-stage build:** funnel narrowing from wide input to a small output capsule.
- **Client devices:** phone (rounded tall rectangle) or window (title bar).

Snippets for each live in [shape-library.md](./references/shape-library.md#physical-metaphors).
