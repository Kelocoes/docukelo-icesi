---
sidebar_position: 2
---

# Angular: Architecture and Modern Web Application Development

Comprehensive guide for the **Angular** course presentation, covering Standalone Components, Reactivity, Data Binding, Built-in Control Flow, and Services with Dependency Injection.

### Team Members
- Internet Computing 3 Student Team (Moodle User: A00404735)

---

## Slides and Repository

<IframeWindow url="/files/computacion-3/exposiciones-de-cursos/2026-02/angular-slides.html" />

:::tip[Presentation Mode]
Interact directly with the presentation above. Use `→` or `Space` to advance, `N` to view speaker notes, or press `F` for fullscreen.
:::

:::info[Project Links and Source Code]
- **GitHub Repository:** [Bellito29/angular-proyecto](https://github.com/Bellito29/angular-proyecto)
- **Web Slides:** [Open Slides in Full Tab](pathname:///files/computacion-3/exposiciones-de-cursos/2026-02/angular-slides.html)
:::

---

## 1. Mental Model and Architecture

Angular is an enterprise frontend framework maintained by Google, built on strict TypeScript typing and a batteries-included philosophy:

- **Standalone Components:** Modern Angular components eliminate the need for `NgModule`, declaring their own imports and dependencies directly.
- **Declarative HTML Templates:** Template syntax for property binding, event listening, and structural control flow.
- **Dependency Injection (DI):** Hierarchical injector system providing shared singleton or scoped service instances without manual instantiations.

<ZoomableMermaid value={`graph TD
    A["Standalone Component"] -->|Uses| B["HTML Template"]
    A -->|Injects| C["Data Service"]
    C -->|HttpClient| D[("External REST API")]
    B -->|Event Binding| A
    A -->|Property Binding| B

    style A fill:#dbeafe,stroke:#2563eb,stroke-width:2px
    style C fill:#dcfce7,stroke:#16a34a,stroke-width:2px
    style D fill:#fef3c7,stroke:#d97706,stroke-width:2px`} />

---

## 2. Binding Syntax and Control Flow

| Binding Type | Syntax | Purpose |
| :--- | :--- | :--- |
| **Interpolation** | `{{ value }}` | Renders TypeScript values into HTML text |
| **Property Binding** | `[property]="variable"` | Sets DOM properties and element attributes dynamically |
| **Event Binding** | `(event)="method()"` | Listens for user interactions and invokes component methods |
| **Two-Way Binding** | `[(ngModel)]="variable"` | Synchronizes form inputs and state bidirectionally |

### Built-in Control Flow (`@for` and `@if`)

```html title="src/app/task-list.component.html"
@if (tasks.length > 0) {
  <ul>
    @for (task of tasks; track task.id) {
      <li>{{ task.title }}</li>
    }
  </ul>
} @else {
  <p>No pending tasks.</p>
}
```

:::note[Why track is Essential]
The `track` expression allows Angular's reconciliation algorithm to uniquely identify each collection item, minimizing DOM mutations by updating only modified elements rather than re-rendering the entire list.
:::

---

## 3. Practical Walkthrough: Step by Step

<StepByStep>
  <Step number="1" title="Install Angular CLI and Create Project">
    Ensure you have Node.js 18+ installed and install the official CLI:

    ```bash
    npm install -g @angular/cli
    ng new angular-demo --standalone --routing --style=css
    cd angular-demo
    ```
  </Step>

  <Step number="2" title="Generate Service with Dependency Injection">
    Create a dedicated service to encapsulate HTTP requests:

    ```bash
    ng generate service services/task
    ```

    ```typescript title="src/app/services/task.service.ts"
    import { Injectable, inject } from '@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { Observable } from 'rxjs';

    @Injectable({ providedIn: 'root' })
    export class TaskService {
      private http = inject(HttpClient);

      getTasks(): Observable<any[]> {
        return this.http.get<any[]>('https://api.example.com/tasks');
      }
    }
    ```
  </Step>

  <Step number="3" title="Create Component and Inject Service">
    ```typescript title="src/app/components/tasks.component.ts"
    import { Component, inject, OnInit } from '@angular/core';
    import { TaskService } from '../services/task.service';

    @Component({
      selector: 'app-tasks',
      standalone: true,
      template: `
        <h2>Task List</h2>
        @for (item of tasks; track item.id) {
          <div>{{ item.title }}</div>
        }
      `
    })
    export class TasksComponent implements OnInit {
      private taskService = inject(TaskService);
      tasks: any[] = [];

      ngOnInit() {
        this.taskService.getTasks().subscribe(data => this.tasks = data);
      }
    }
    ```
  </Step>

  <Step number="4" title="Serve the Application">
    ```bash
    ng serve -o
    ```
  </Step>
</StepByStep>
