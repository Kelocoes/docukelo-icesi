# Pattern Catalog

Ten composition patterns for conceptual diagrams. Each pattern states **when to use it**, **layout sketch**, **construction steps**, **text budget** and a **reference file** in the repo. Snippets live in [shape-library.md](./shape-library.md).

All coordinates assume the 880 x 440 canvas.

---

## P1. Before / After Split

**Use when:** the idea is a contrast between a problem and its solution (messy vs organized, coupled vs decoupled).

```
 ANTES (red)                |vs|             DESPUÉS (green)
  satellites + tangled      |                 stacked slabs
  curves around a dark      |                 with clean arrows
  center node               |
```

**Steps**
1. Dashed vertical divider at `x=440` with a small "vs" circle.
2. Column headers at `y=84`: left red, right green, 12 px uppercase.
3. Left: a dark central node (r 46) with 4 to 6 red-tinted satellites in different shapes; draw tangled red curves first, then short saturated links from each satellite to the center.
4. Right: 3 parallelogram slabs stacked vertically; core slab in the middle with thicker stroke; arrows pointing from the outer slabs to the core.

**Text budget:** 2 headers, one label per element (about 10 total).
**Reference:** `static/img/computacion-3/clean-arch-spaghetti-vs-layers.svg`

---

## P2. Concentric Rings

**Use when:** the idea is levels of protection, stability, or abstraction, with a rule about what can cross a boundary.

```
        ( ring 3 )                     [pill] --->
      (  ring 2  )   <-- arrows -----  [pill] --->
     (   core   )                       [pill] --->
 X <---- red dashed
```

**Steps**
1. Draw 3 rings from largest to smallest, fills getting more saturated toward the core.
2. Place ring labels on the band above the center (uppercase 12 px).
3. Add 3 pills on the right, each with an arrow pointing to the core boundary, crossing the rings.
4. Add one red dashed arrow leaving the core to the left, ending with a circled X.

**Text budget:** 3 ring labels, 3 pills, optional 1 core subtitle.
**Reference:** `static/img/computacion-3/clean-arch-onion-layers.svg`

---

## P3. Pipeline With Morphing Packets

**Use when:** the idea is a sequence of steps or a request/response round trip where data changes nature.

```
 FORM    HOOK    USE CASE    REPO+MAPPER    API
  (1) -o-> (2) -o-> (3) --o--> (4) --^--> (5)
   ^                                        |
   +------ []  ----- []  ----- []  <--- ----+   (return, dashed U)
```

**Steps**
1. Thick pale rail at `y=170`.
2. 4 or 5 numbered circles (r 34) evenly spaced; role colors per station.
3. Station names above (`y=112`), uppercase.
4. Short arrows between stations; packet shapes sit above each arrow (circle, triangle, square).
5. Return path: dashed U from last station down to `y=330` and back to the first; clean-data packets on the bottom line.
6. One-row legend at `y=405` describing only packet shapes.

**Text budget:** station names, numbers, two or three tiny tags (`toDomain()`, `re-render`), legend.
**Reference:** `static/img/computacion-3/clean-arch-data-flow-pipeline.svg`

---

## P4. Funnel Transformation

**Use when:** raw or inconsistent input becomes clean or normalized output (mapper, validator, parser, serializer).

```
 irregular ---->   \     /   ----> uniform
 irregular ---->    \   /    ----> uniform
 irregular ---->     \_/     ----> uniform
```

**Steps**
1. Three headers: input (blue or red), transform (purple), output (green) at `y=92`.
2. Left: three irregular polygons in different warm colors, each with a token next to it.
3. Center: funnel polygon with ellipse mouth; the function names inside.
4. Right: three identical check circles with the cleaned tokens.
5. Arrows converge into the funnel top, exit at the neck toward the outputs.

**Text budget:** 3 headers, 3 input tokens, 3 output tokens, 2 function names.
**Reference:** `static/img/computacion-3/clean-arch-entity-vs-dto.svg`

---

## P5. Socket And Plugs

**Use when:** an interface or contract can be fulfilled by several interchangeable implementations.

```
 (consumer) --->  [socket]  <== plug --- chip   (connected, active)
                       ^
                       :  dashed         plug --- cloud (disconnected)
```

**Steps**
1. Consumer circle on the left, arrow to the socket.
2. Socket: large rounded rectangle with two slots and a ground dot; header "REPOSITORY" (or the contract name) above.
3. Connected plug: prongs overlap the socket edge; saturated color; a wire to its device.
4. Disconnected plug: gray, offset lower right, dashed arrow toward the socket.
5. Devices: chip (local), cloud (remote), with a small tag (`DEV`, `PROD`).

**Text budget:** consumer label, contract name, two device labels, two tags.
**Reference:** `static/img/computacion-3/clean-arch-repository-pattern-flow.svg`

---

## P6. Switch (Selector)

**Use when:** configuration decides which of several sources or strategies feeds a consumer.

```
 [chip] ====\
             (  O)---> hexagon ---> window
 [cloud] ---/
```

**Steps**
1. Sources on the left: active in color, inactive gray.
2. Wires to two contact dots; active contact green, inactive light gray; inactive wire dashed.
3. Switch: vertical pill with a knob near the active contact.
4. One output wire to the consumer chain (hexagon, then window), using the purple arrow.
5. Tag under the switch for the config variable.

**Text budget:** source labels, switch caption, consumer label, one config token.
**Reference:** `static/img/computacion-3/clean-arch-dependency-injection.svg`

---

## P7. Tree Of Folders

**Use when:** the idea is project or module structure, and which folder depends on which.

```
 [root] ---curve---> [domain]  (entities)(repos)(usecases)
        ---curve---> [infra]   (dtos)(mappers)(datasources)(repos)
        ---curve---> [presentation] (hooks)(components)
        ---curve---> [di] (container)
        purple arrows from infra and presentation into domain
```

**Steps**
1. Root folder at the left, vertically centered.
2. Four curved branches (`C` paths) to folder shapes stacked on a column.
3. Leaf pills to the right of each folder, colored by layer, joined by a short gray line.
4. Dependency arrows between the folder column and the leaves: solid for direct, dashed for indirect, all pointing to the core folder.

**Text budget:** folder names and leaf names only.
**Reference:** `static/img/computacion-3/clean-arch-nextjs-feature-structure.svg`

---

## P8. Timeline

**Use when:** the idea is evolution, versions, or recurring ideas across eras.

```
 2005            2008            2012   --->
  o               o               o
 hexagon         3 rings        4 rings
```

**Steps**
1. Horizontal axis at `y=215` with a thick pale line and a purple arrow at the end.
2. One colored dot per era; year above in large weight 800; name in uppercase; author in gray.
3. One abstract icon per era below the axis; icons should visibly **evolve** (more rings, more structure).
4. One caption line under each icon.

**Text budget:** 3 years, 3 names, 3 authors, 3 captions.
**Reference:** `static/img/computacion-3/clean-arch-origins-timeline.svg`

---

## P9. Core With Swappable Satellites

**Use when:** the idea is independence: a protected core and several details that can be replaced.

```
 [A|B]                      [A|B]
       \                  /
         (   CORE  )
       /                  \
 [A|B]                      [A|B]
```

**Steps**
1. Core circle in the center (r 78), four port dots on its boundary.
2. Four wires from the ports to four satellite pairs.
3. Each pair: an active pill (colored) and an alternative pill (gray, dashed), joined by a swap arrow.
4. Category header above or below each pair (uppercase, role color).

**Text budget:** core label, 4 headers, 8 pill labels.
**Reference:** `static/img/computacion-3/clean-arch-independence.svg`

---

## P10. Layer Slabs With Direction

**Use when:** the idea is a stack of layers with a clear dependency direction (often into the middle).

```
  /===== UI ======/
        |
        v
  /== DOMAIN ====/      <- thicker stroke, strongest color
        ^
        |
  /=== DATA =====/
```

**Steps**
1. Parallelogram slabs with 50 px vertical gaps and the same width.
2. Core slab: thickest stroke and the most saturated color.
3. Arrows in the gaps: purple, 3 px, pointing at the core.
4. Optionally add a red dashed arrow with X to show a forbidden direction.

**Text budget:** one uppercase label per slab.
**Reference:** right column of `static/img/computacion-3/clean-arch-spaghetti-vs-layers.svg`.

---

## Choosing between patterns

| Question | Answer | Pattern |
|:---|:---|:---|
| Are there two worlds to compare? | Yes | P1 |
| Is there a protected center? | Yes, with levels | P2 |
| Is there a protected center with replaceable details? | Yes | P9 |
| Do things move through steps? | Yes | P3 |
| Does data change form? | Yes | P4 (single step) or P3 with morphing packets |
| Is it about a contract with multiple implementations? | Yes | P5 |
| Is it about picking one option by configuration? | Yes | P6 |
| Is it about folders or modules? | Yes | P7 |
| Is it about history? | Yes | P8 |
| Is it about stacked layers? | Yes | P10 |

Combining patterns is allowed only if the idea truly has two parts. Keep the total number of elements at or below 7 major shapes.

---

## Common mistakes in pattern application

- **P2 with too many rings:** more than 4 loses the squint test.
- **P3 with long labels:** keep station names to one or two words.
- **P5 with both plugs connected:** a socket accepts one plug; show the alternative as gray and dashed.
- **P7 with deep nesting:** show at most two levels; deeper levels belong in text.
- **P9 without port dots:** the wires need to visibly "end" on the core boundary.
- **P1 with unequal weight:** the "after" side must feel calmer (fewer lines, more whitespace), not just different.
