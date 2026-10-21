---
sidebar_position: 6
---

# HTMX and Hypermedia Architecture

Presentation guide on **HTMX**, Hypertext As The Engine Of Application State (HATEOAS), Server-Driven UI, and reducing frontend client complexity in modern web applications.

### Team Members
- Juan Diego Balanta
- Edwar Estacio
- Valeria Piza

---

## Slides and Resources

:::tip[Presentation Slides]
Download and review the team's presentation slides:
- [Download HTMX Presentation (PPTX)](/files/computacion-3/exposiciones-de-cursos/2026-02/HTMX-presentacion.pptx)
:::

:::info[References and Essays]
- Roy Fielding, *REST APIs must be hypertext-driven*: [roy.gbiv.com](https://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven)
- Richardson Maturity Model: [martinfowler.com](https://martinfowler.com/articles/richardsonMaturityModel.html)
:::

---

## 1. Core Philosophy: Hypertext as the Engine of Application State (HATEOAS)

The original Web architecture defined by Roy Fielding in the formal specification of REST establishes that clients navigate and mutate state via **hypertext** that contains embedded navigation and action controls.

With the proliferation of Single Page Applications (SPAs), web servers were largely reduced to emitting raw JSON data lacking interaction semantics, compelling JavaScript client bundles to duplicate routing, validation, and state synchronization logic.

**htmx** revives Fielding's hypermedia vision by extending standard HTML:
- Allows **any HTML element** (not just `<a>` and `<form>`) to trigger HTTP requests.
- Enables requests to trigger on **any event** (`change`, `keyup`, `intersect`), not just `click` or `submit`.
- Swaps targeted portions of the DOM with server-rendered HTML fragments directly, without requiring custom client-side JavaScript.

<ZoomableMermaid value={`sequenceDiagram
    autonumber
    actor User as User
    participant Browser as Browser (HTMX)
    participant Server as Web Server (Node / Go / Python)

    User->>Browser: Clicks "Complete Task"
    Browser->>Server: PATCH /tasks/42 (with HX-Request header)
    Server-->>Browser: HTML Fragment (<li class="done">...)
    Note over Browser: HTMX swaps targeted element directly into DOM
    Browser-->>User: Interface instantaneously updated`} />

---

## 2. Fundamental HTMX Attributes

| Attribute | Purpose | Example |
| :--- | :--- | :--- |
| `hx-get` / `hx-post` / `hx-patch` / `hx-delete` | Defines the target URL and HTTP verb | `hx-post="/tasks"` |
| `hx-target` | CSS selector of the DOM element where response is injected | `hx-target="#task-list"` |
| `hx-swap` | DOM replacement strategy (`innerHTML`, `outerHTML`, `beforebegin`, etc.) | `hx-swap="outerHTML"` |
| `hx-trigger` | Event or conditional triggering the request (`click`, `keyup changed delay:500ms`) | `hx-trigger="keyup changed delay:300ms"` |
| `hx-swap-oob` | *Out of Band Swap*: allows updating remote elements outside the primary target in one response | `hx-swap-oob="true"` |

---

## 3. Practical Demo: TaskFlow with Zero Custom JavaScript

TaskFlow demonstrates a complete task manager powered by server-side templates and HTMX with zero client-side JavaScript, featuring full support for progressive enhancement.

<StepByStep>
  <Step number="1" title="Running the Demo">
    ```bash
    # Inside project directory
    npm install
    npm run dev
    ```
    The application will run at `http://localhost:3000`.
  </Step>

  <Step number="2" title="Inline DOM Editing">
    Clicking **Edit** causes HTMX to dispatch `GET /tasks/:id/edit`, fetching the edit form fragment and swapping the table row using `hx-swap="outerHTML"`.
  </Step>

  <Step number="3" title="Atomic Out of Band (OOB) Updates">
    Completing a task causes the server to return the updated row along with a counter badge marked with `hx-swap-oob="true"`. HTMX synchronizes both the header badge and the task row simultaneously in a single HTTP cycle.
  </Step>

  <Step number="4" title="Debounced Search with Dynamic Filters">
    The search input field dispatches queries on keystrokes with debounced delay:

    ```html title="views/search.html"
    <input 
      type="search" 
      name="q" 
      placeholder="Search tasks..." 
      hx-get="/tasks" 
      hx-trigger="keyup changed delay:300ms" 
      hx-target="#tasks-container" 
    />
    ```
  </Step>
</StepByStep>
