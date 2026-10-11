# Shape Library

Copy-paste SVG snippets for the pedagogical SVG designer. All coordinates are local: wrap each snippet in `<g transform="translate(x,y)">` and adjust. Colors follow the role palette in `SKILL.md` section 5.

## Boilerplate

Every diagram starts here. Keep only the markers and classes you use. Marker ids must be unique per file.

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 440" width="100%" height="100%">
  <defs>
    <marker id="a-slate" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,1 L10,5 L0,9 Z" fill="#475569"/>
    </marker>
    <marker id="a-purple" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,1 L10,5 L0,9 Z" fill="#7c3aed"/>
    </marker>
    <marker id="a-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,1 L10,5 L0,9 Z" fill="#16a34a"/>
    </marker>
    <marker id="a-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0,1 L10,5 L0,9 Z" fill="#dc2626"/>
    </marker>
    <!-- double-ended (swap) arrow -->
    <marker id="a-swap" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,1 L10,5 L0,9 Z" fill="#64748b"/>
    </marker>
  </defs>
  <style>
    .t     { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; }
    .title { font-size: 20px; font-weight: 700; fill: #0f172a; }
    .head  { font-size: 12px; font-weight: 800; letter-spacing: .08em; }
    .lbl   { font-size: 12px; font-weight: 600; fill: #334155; }
    .mono  { font-family: ui-monospace, Consolas, monospace; font-size: 12px; font-weight: 700; }
    .num   { font-size: 18px; font-weight: 800; fill: #fff; }
    .tag   { font-size: 11px; font-weight: 800; letter-spacing: .08em; fill: #64748b; }
  </style>
  <rect width="880" height="440" rx="16" fill="#f8fafc"/>
  <text x="32" y="38" class="t title">Claim sentence as title</text>
  <!-- content here -->
</svg>
```

---

## Core shapes

### Core circle (central concept)
```xml
<circle cx="440" cy="230" r="78" fill="#ede9fe" stroke="#7c3aed" stroke-width="4"/>
<text x="440" y="226" class="t head" fill="#581c87" text-anchor="middle">NÚCLEO</text>
```

### Concentric rings (outer to inner, draw largest first)
```xml
<circle cx="300" cy="250" r="165" fill="#dbeafe" stroke="#2563eb" stroke-width="2.5"/>
<circle cx="300" cy="250" r="112" fill="#ffedd5" stroke="#ea580c" stroke-width="2.5"/>
<circle cx="300" cy="250" r="60"  fill="#ede9fe" stroke="#7c3aed" stroke-width="3.5"/>
<!-- ring labels sit on the band, centered above the inner circle -->
<text x="300" y="112" class="t head" fill="#1e40af" text-anchor="middle">EXTERIOR</text>
<text x="300" y="165" class="t head" fill="#c2410c" text-anchor="middle">APLICACIÓN</text>
<text x="300" y="254" class="t head" fill="#581c87" text-anchor="middle">NÚCLEO</text>
```

### Hexagon (rule, policy, use case)
```xml
<polygon points="-40,0 -20,-34 20,-34 40,0 20,34 -20,34" fill="#ffedd5" stroke="#ea580c" stroke-width="3" stroke-linejoin="round"/>
```

### Triangle (raw data)
```xml
<polygon points="0,-14 12,8 -12,8" fill="#fed7aa" stroke="#ea580c" stroke-width="2.5" stroke-linejoin="round"/>
```

### Rounded square (clean data)
```xml
<rect x="-12" y="-12" width="24" height="24" rx="5" fill="#bbf7d0" stroke="#16a34a" stroke-width="2.5"/>
```

### Check circle (valid, guaranteed)
```xml
<circle cx="0" cy="0" r="20" fill="#bbf7d0" stroke="#16a34a" stroke-width="2.5"/>
<path d="M-9,0 L-3,6 L9,-7" stroke="#16a34a" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
```

### Diamond (state, decision)
```xml
<polygon points="0,-24 24,0 0,24 -24,0" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
```

### Irregular polygons (raw, messy input; vary the vertices)
```xml
<polygon points="70,150 96,128 112,158 88,176" fill="#fecaca" stroke="#ef4444" stroke-width="2.5" stroke-linejoin="round"/>
<polygon points="75,238 100,214 126,232 112,262 84,264" fill="#fed7aa" stroke="#ea580c" stroke-width="2.5" stroke-linejoin="round"/>
```

### Pill (technology tag)
```xml
<rect x="590" y="143" width="110" height="34" rx="17" fill="#fff" stroke="#2563eb" stroke-width="2"/>
<text x="645" y="165" class="mono" fill="#1e3a8a" text-anchor="middle">React</text>
```

### Numbered station (pipeline)
```xml
<circle cx="90" cy="170" r="34" fill="#2563eb"/>
<text x="90" y="177" class="t num" text-anchor="middle">1</text>
```

---

## Systems and places

### Cloud (remote system, API)
```xml
<g transform="translate(700,345)">
  <circle cx="-26" cy="6" r="20" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3"/>
  <circle cx="0" cy="-8" r="26" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3"/>
  <circle cx="28" cy="6" r="19" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3"/>
  <rect x="-26" y="2" width="54" height="24" fill="#f1f5f9"/>
  <line x1="-26" y1="26" x2="28" y2="26" stroke="#94a3b8" stroke-width="3"/>
  <text x="0" y="12" class="t mono" fill="#475569" text-anchor="middle">API</text>
</g>
```
Change fill and stroke to red (`#fee2e2`, `#ef4444`) for a "problem" cloud.

### Chip (memory, mock, local simulation)
```xml
<g transform="translate(590,150)">
  <rect x="0" y="-28" width="76" height="56" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="3"/>
  <g stroke="#16a34a" stroke-width="3" stroke-linecap="round">
    <path d="M12,-28 V-38 M32,-28 V-38 M52,-28 V-38 M64,-28 V-38 M12,28 V38 M32,28 V38 M52,28 V38 M64,28 V38"/>
  </g>
  <text x="38" y="5" class="t mono" fill="#14532d" text-anchor="middle">Mock</text>
</g>
```

### Window (user interface)
```xml
<g transform="translate(712,170)">
  <rect x="0" y="0" width="130" height="140" rx="10" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/>
  <line x1="0" y1="24" x2="130" y2="24" stroke="#2563eb" stroke-width="3"/>
  <circle cx="14" cy="12" r="4" fill="#2563eb"/>
  <circle cx="28" cy="12" r="4" fill="#2563eb"/>
  <rect x="16" y="42" width="98" height="16" rx="8" fill="#93c5fd"/>
  <rect x="16" y="68" width="98" height="16" rx="8" fill="#93c5fd"/>
  <rect x="16" y="94" width="98" height="16" rx="8" fill="#93c5fd"/>
</g>
```
Mini window (for a single element): 48x36 rectangle with one horizontal line at the top.

### Cylinder (database)
```xml
<g transform="translate(0,0)">
  <path d="M0,14 V70 C0,86 80,86 80,70 V14" fill="#dcfce7" stroke="#16a34a" stroke-width="3"/>
  <ellipse cx="40" cy="14" rx="40" ry="12" fill="#bbf7d0" stroke="#16a34a" stroke-width="3"/>
  <path d="M0,42 C0,58 80,58 80,42" fill="none" stroke="#16a34a" stroke-width="2.5"/>
</g>
```

### Folder (directory)
```xml
<g transform="translate(260,80)">
  <path d="M0,6 Q0,0 6,0 H26 L32,6 H114 Q120,6 120,12 V34 Q120,40 114,40 H6 Q0,40 0,34 Z"
        fill="#ede9fe" stroke="#7c3aed" stroke-width="3.5" stroke-linejoin="round"/>
  <text x="60" y="28" class="t mono" fill="#581c87" text-anchor="middle">domain</text>
</g>
```

### Parallelogram slab (one layer in a stack)
```xml
<polygon points="560,120 780,120 760,180 540,180" fill="#dbeafe" stroke="#2563eb" stroke-width="2.5" stroke-linejoin="round"/>
<text x="660" y="157" class="t head" fill="#1e3a8a" text-anchor="middle" font-size="14">UI</text>
```
Stack slabs with 50 px gaps; the middle slab (core) gets a thicker stroke (3).

---

## Connectors

### Straight arrow
```xml
<path d="M126,170 L234,170" stroke="#475569" stroke-width="3" fill="none" marker-end="url(#a-slate)"/>
```

### Curved wire (organic connection)
```xml
<path d="M174,150 C250,150 280,215 340,215" stroke="#16a34a" stroke-width="4" fill="none" stroke-linecap="round"/>
```
Active wire: solid and saturated. Inactive wire: `stroke="#cbd5e1" stroke-dasharray="8 7"`.

### Dependency arrow into the core
```xml
<path d="M590,250 L362,250" stroke="#7c3aed" stroke-width="3" fill="none" marker-end="url(#a-purple)"/>
```
End the line about 6 to 10 px before the target edge.

### Forbidden arrow
```xml
<path d="M236,250 L170,250" stroke="#dc2626" stroke-width="3" stroke-dasharray="6 5" fill="none" marker-end="url(#a-red)"/>
<circle cx="150" cy="250" r="14" fill="#fff" stroke="#dc2626" stroke-width="2.5"/>
<path d="M143,243 L157,257 M157,243 L143,257" stroke="#dc2626" stroke-width="2.5"/>
```

### Tangled coupling (chaos)
```xml
<g fill="none" stroke="#f87171" stroke-width="2" opacity="0.75">
  <path d="M110,150 C200,330 300,100 330,370"/>
  <path d="M350,150 C250,120 150,380 100,340"/>
  <path d="M390,270 C300,420 160,60 110,150"/>
  <path d="M100,340 C200,200 340,420 390,270"/>
</g>
```
Draw it before the satellites so shapes sit on top. Add short, saturated red segments from each satellite to the center node.

### Return U path (response)
```xml
<path d="M790,214 L790,330 L90,330 L90,216" stroke="#16a34a" stroke-width="3" stroke-dasharray="8 6" fill="none" stroke-linejoin="round" marker-end="url(#a-green)"/>
```

### Pipe (thick rail behind stations)
```xml
<line x1="90" y1="170" x2="790" y2="170" stroke="#e2e8f0" stroke-width="14" stroke-linecap="round"/>
```

### Swap arrow between alternatives
```xml
<path d="M-6,0 H6" stroke="#64748b" stroke-width="3" marker-start="url(#a-swap)" marker-end="url(#a-swap)"/>
```

### Divider with "vs"
```xml
<line x1="440" y1="80" x2="440" y2="410" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="6 6"/>
<circle cx="440" cy="245" r="18" fill="#fff" stroke="#cbd5e1" stroke-width="2"/>
<text x="440" y="250" class="t lbl" text-anchor="middle" fill="#94a3b8" font-size="11">vs</text>
```

---

## Interaction metaphors

### Funnel (transform, validate)
```xml
<polygon points="370,130 510,130 470,250 470,330 410,330 410,250" fill="#ede9fe" stroke="#7c3aed" stroke-width="3" stroke-linejoin="round"/>
<ellipse cx="440" cy="130" rx="70" ry="9" fill="#ddd6fe" stroke="#7c3aed" stroke-width="3"/>
<text x="440" y="195" class="t mono" fill="#581c87" text-anchor="middle">toDomain()</text>
```

### Socket (interface) and plug (implementation)
```xml
<!-- socket -->
<rect x="250" y="140" width="130" height="180" rx="26" fill="#ede9fe" stroke="#7c3aed" stroke-width="3.5"/>
<rect x="290" y="190" width="14" height="42" rx="4" fill="#581c87"/>
<rect x="326" y="190" width="14" height="42" rx="4" fill="#581c87"/>
<circle cx="315" cy="266" r="9" fill="#581c87"/>
<!-- plug, connected (prongs overlap the socket edge) -->
<rect x="362" y="200" width="22" height="8" rx="3" fill="#475569"/>
<rect x="362" y="214" width="22" height="8" rx="3" fill="#475569"/>
<rect x="384" y="190" width="64" height="42" rx="12" fill="#bbf7d0" stroke="#16a34a" stroke-width="3"/>
<path d="M448,211 C520,211 520,150 590,150" stroke="#16a34a" stroke-width="4" fill="none" stroke-linecap="round"/>
<!-- plug, disconnected (gray, with dashed arrow toward the socket) -->
<rect x="450" y="318" width="22" height="8" rx="3" fill="#94a3b8"/>
<rect x="450" y="332" width="22" height="8" rx="3" fill="#94a3b8"/>
<rect x="472" y="308" width="64" height="42" rx="12" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3"/>
<path d="M440,324 C420,324 395,310 384,292" stroke="#94a3b8" stroke-width="2.5" stroke-dasharray="6 5" fill="none" marker-end="url(#a-slate)"/>
```

### Switch (selector)
```xml
<circle cx="352" cy="215" r="9" fill="#16a34a"/>   <!-- active contact -->
<circle cx="352" cy="265" r="9" fill="#cbd5e1"/>   <!-- inactive contact -->
<rect x="318" y="196" width="68" height="88" rx="34" fill="#ede9fe" stroke="#7c3aed" stroke-width="3.5"/>
<circle cx="352" cy="226" r="20" fill="#7c3aed"/>  <!-- knob toward the active contact -->
```

### Port dot on a boundary
```xml
<circle cx="375" cy="205" r="7" fill="#fff" stroke="#7c3aed" stroke-width="3"/>
```

### Alternative pair (swappable options)
```xml
<rect x="-74" y="-30" width="62" height="60" rx="30" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/>       <!-- active -->
<path d="M-6,0 H6" stroke="#64748b" stroke-width="3" marker-start="url(#a-swap)" marker-end="url(#a-swap)"/>
<rect x="12" y="-30" width="62" height="60" rx="30" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3" stroke-dasharray="6 5"/> <!-- alternative -->
```

---

## Physical metaphors

Use only for infrastructure topics. Keep them flat and label-light.

### Laptop
```xml
<g transform="translate(0,0)">
  <rect x="0" y="0" width="140" height="88" rx="8" fill="#1e293b" stroke="#334155" stroke-width="2"/>
  <rect x="8" y="8" width="124" height="72" rx="4" fill="#0f172a"/>
  <path d="M-12,88 L152,88 L140,100 L0,100 Z" fill="#94a3b8"/>
</g>
```

### Server rack
```xml
<g transform="translate(0,0)">
  <rect x="0" y="0" width="150" height="120" rx="8" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
  <rect x="10" y="10" width="130" height="40" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
  <circle cx="26" cy="30" r="4" fill="#10b981"/>
  <rect x="10" y="62" width="130" height="40" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
  <circle cx="26" cy="82" r="4" fill="#a855f7"/>
</g>
```

### Shipping container (Docker)
```xml
<g transform="translate(0,0)">
  <rect x="0" y="0" width="150" height="85" rx="6" fill="#1d4ed8" stroke="#1e40af" stroke-width="2"/>
  <g stroke="#3b82f6" stroke-width="2.5">
    <line x1="25" y1="6" x2="25" y2="79"/><line x1="45" y1="6" x2="45" y2="79"/>
    <line x1="65" y1="6" x2="65" y2="79"/><line x1="85" y1="6" x2="85" y2="79"/>
    <line x1="105" y1="6" x2="105" y2="79"/><line x1="125" y1="6" x2="125" y2="79"/>
  </g>
</g>
```

---

## Text placement helpers

| Situation | Rule |
|:---|:---|
| Label under a shape | `y = shape bottom + 20`, `text-anchor="middle"`, class `lbl` |
| Label inside a circle or pill | `y = center + font-size/3`, `text-anchor="middle"` |
| Column header | `y = 84 to 92`, class `head`, color of the role |
| Station label above a pipeline | `y = station top - 20` |
| Token next to a shape | `x = shape right + 16`, left-aligned, class `mono` |
| Legend | One row at `y = 405`, shapes 16 px, labels `mono` 11 px |
