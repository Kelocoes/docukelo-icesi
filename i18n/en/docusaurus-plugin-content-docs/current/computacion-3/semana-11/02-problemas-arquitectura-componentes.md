---
sidebar_position: 2
description: "Identify the monolithic component anti-pattern in Next.js and see how layered separation and SOLID principles improve frontend code."
---

# The Monolithic Component Anti-Pattern

When building applications with **Next.js**, the most common developer instinct is to place all application logic directly inside React components. This approach, known as an exclusively component-driven architecture, works for toy prototypes but rapidly devolves into a maintenance nightmare in real engineering projects.

In this lesson, we will analyze why overloaded components (*Fat Components*) degrade code maintainability and how **Clean Architecture** principles applied to the frontend solve this problem at its root.

---

## 1. Anatomy of a Spaghetti Component

Consider a simple screen for managing physical exercise routines (a common module connected to a NestJS backend). In a naive Next.js approach, the `ExercisePage.tsx` file typically looks like this:

```tsx title="src/app/exercises/page.tsx (Anti-pattern: Fat Component)" showLineNumbers
'use client';

import { useState, useEffect } from 'react';

// Typing coupled directly to the backend JSON contract
interface ExerciseFromApi {
  id: string;
  exercise_name: string;
  muscle_group: string | null;
  difficulty_lvl?: number;
}

export default function ExercisePage() {
  const [exercises, setExercises] = useState<ExerciseFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [muscle, setMuscle] = useState('');

  // 1. Direct network access inside the component
  useEffect(() => {
    fetch('http://localhost:3000/api/exercises')
      .then((res) => res.json())
      .then((data) => {
        setExercises(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  // 2. Business logic and invariants tangled with view events
  const handleCreate = async () => {
    if (name.trim().length < 3) {
      alert('Name must be at least 3 characters');
      return;
    }

    if (!['CHEST', 'BACK', 'LEGS', 'ARMS'].includes(muscle.toUpperCase())) {
      alert('Invalid muscle group');
      return;
    }

    // 3. Payload manually formatted to satisfy backend requirements
    const payload = {
      exercise_name: name,
      muscle_group: muscle.toUpperCase(),
      difficulty_lvl: 2,
    };

    const res = await fetch('http://localhost:3000/api/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const created = await res.json();
    setExercises((prev) => [...prev, created]);
    setName('');
  };

  // 4. Visual rendering with numerous Tailwind utility classes
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Exercise Management</h1>
      <div className="flex gap-2 mb-6">
        <input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Name" 
          className="border p-2 rounded" 
        />
        <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>

        {loading ? (
          <p>Loading exercises...</p>
        ) : (
          <ul className="space-y-2">
            {exercises.map((item) => (
              <li key={item.id} className="p-3 border rounded shadow-sm">
                <span className="font-semibold">{item.exercise_name}</span> - {item.muscle_group ?? 'General'}
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}
```

### Why is This Code Fragile and Costly to Maintain?

This file of barely 80 lines already conflates **five distinct responsibilities**:

1. **HTTP Transport Protocol**: Knows the exact URL (`http://localhost:3000/api/exercises`), HTTP verbs (`GET`, `POST`), and request headers (`Content-Type`).
2. **Raw Backend Format**: Directly depends on server naming conventions (`exercise_name`, `muscle_group`, `difficulty_lvl`). If the backend team renames a property to `camelCase` or refactors the schema, this entire file breaks.
3. **Business Logic and Invariants**: Validates that the name contains at least 3 characters and that the muscle group belongs to a whitelist inside a button handler.
4. **Local Reactive State**: Coordinates `loading`, `exercises`, `name`, and `muscle` state variables.
5. **Visual Rendering**: Handles JSX elements, semantic tags, and Tailwind CSS utility classes.

:::danger[The Core Problem: Violation of the Single Responsibility Principle (SRP)]
The component has far too many reasons to change. It will change if the REST API contract updates, if business validation rules evolve, if the user interface is redesigned, or if the team decides to migrate from `fetch` to `axios` or `react-query`.
:::

---

## 2. Visual Contrast: Monolith vs. Layered Separation

The diagram below illustrates the structural difference between concentrating all responsibilities into a single file versus distributing them across specialized layers:

![Monolithic Component vs. Layered Separation](/img/computacion-3/clean-arch-spaghetti-vs-layers.svg)

---

## 3. SOLID Principles Applied to the Frontend

To overcome this anti-pattern in Next.js, we rely on two foundational software design principles:

### 3.1. Single Responsibility Principle (SRP)
Each module, class, or function must have **a single responsibility and only one reason to change**:
- The **View (JSX)** should only concern itself with how data is presented to the user.
- The **Use Case** should only be responsible for orchestrating the requested user action and executing business rules.
- The **Repository** should only handle data persistence and retrieval.
- The **Mapper** should only handle transforming data between incompatible formats.

### 3.2. Dependency Inversion Principle (DIP) and the Dependency Rule
Clean Architecture creator Robert C. Martin formulates the golden rule:
> *Source code dependencies must point strictly inward, toward higher-level policies (the Domain).*

In the context of Next.js, this means:
- **The Domain does not know about React**: No file within the domain layer may import `useState`, `useEffect`, `next/navigation`, or UI dependencies.
- **The UI depends on abstractions**: The view consumes use cases and abstract interfaces, rather than concrete HTTP clients or hardcoded URLs.

---

## 4. Proposed Project Structure for Next.js

Adapting Clean Architecture conventions to the Next.js and TypeScript ecosystem, we organize code using **Vertical Slices (Features)**:

![Feature-Based Structure in Next.js](/img/computacion-3/clean-arch-nextjs-feature-structure.svg)

### Directory Mapping

```plaintext
src/
├── core/                                     # Cross-cutting application resources
│   ├── errors/                               # Standardized error classes
│   ├── http/                                 # Configured base HTTP client
│   └── components/ui/                        # Generic UI components (Button, Modal, Input)
│
└── features/                                 # Business modules (Vertical Slices)
    └── exercises/                            # Exercise feature module
        ├── domain/                           # Pure business rules (TypeScript)
        │   ├── entities/                     # Immutable entities (exercise.ts)
        │   ├── repositories/                 # Abstract contracts (exercise.repository.ts)
        │   └── usecases/                     # Use cases / Interactors (get-exercises.usecase.ts)
        │
        ├── infrastructure/                   # External communication adapters
        │   ├── dtos/                         # Raw API contracts (exercise.dto.ts)
        │   ├── mappers/                      # DTO <-> Entity converters (exercise.mapper.ts)
        │   ├── datasources/                  # HTTP connection or in-memory Mock
        │   └── repositories/                 # Concrete repository implementation
        │
        ├── di/                               # Dependency injection / Composition Root
        │   └── exercise.container.ts         # Dependency assembler
        │
        └── presentation/                     # Visual presentation layer (React / Next.js)
            ├── hooks/                        # Custom Hook Presenter (use-exercises.ts)
            └── components/                   # Pure visual components (ExerciseCard, ExerciseForm)
```

:::tip[Why Organize by Features Instead of Global Folders?]
Organizing by global technical directories (`src/entities`, `src/usecases`, `src/components`) scatters related code across the entire project tree. Grouping by feature (`features/exercises`) preserves high module cohesion and allows developers to isolate changes without affecting other functional areas of the codebase.
:::

---

## 5. Lesson Summary

1. **The spaghetti component** violates SRP by mixing networking, business logic, JSON formatting, and JSX into a single file.
2. **Any backend change** breaks the view if components directly consume raw API DTOs.
3. **Clean Architecture in Next.js** ensures the business core remains pure, immune to framework upgrades or endpoint changes.
4. In the next lesson, we will explore the **Domain Layer** in depth, crafting immutable entities and use cases in pure TypeScript.

---

## Self-Assessment Quiz

<Quiz id="compunet3-s11-problemas-arquitectura-componentes-quiz">
  <Question title="What is the defining characteristic of a 'Fat Component' or monolithic component in Next.js?">
    <Option>Uses Server Actions exclusively for all read operations.</Option>
    <Option correct>Concentrates fetch calls, payload formatting, business rules, reactive state, and visual rendering in a single file.</Option>
    <Option>Delegates all user interaction to external hooks and reusable atomic components.</Option>
    <Option>Is written in strict TypeScript without permitting any implicit types.</Option>
  </Question>
  <Question title="Which fundamental SOLID principle is directly violated when a component mixes networking, business rules, and JSX?">
    <Option>Liskov Substitution Principle (LSP).</Option>
    <Option>Open/Closed Principle (OCP).</Option>
    <Option correct>Single Responsibility Principle (SRP).</Option>
    <Option>Interface Segregation Principle (ISP).</Option>
  </Question>
  <Question title="What technical consequence occurs if the view layer directly depends on raw API JSON types?">
    <Option>The application drastically increases the bundle size generated by Webpack.</Option>
    <Option correct>Any naming or structural change in the backend (e.g., renaming fields) immediately breaks the user interface.</Option>
    <Option>Next.js automatically disables Server-Side Rendering (SSR).</Option>
    <Option>The browser blocks HTTP requests due to strict CORS policies.</Option>
  </Question>
  <Question title="Why is it difficult to write unit tests for a monolithic component in Next.js?">
    <Option>Because Jest does not support files containing JSX or TSX syntax.</Option>
    <Option>Because TypeScript rules prevent mocking functions declared with the function keyword.</Option>
    <Option correct>Because validation or computation logic cannot be tested without mounting and rendering the component's entire DOM tree.</Option>
    <Option>Because React components can only be evaluated in deployed production environments.</Option>
  </Question>
  <Question title="In the context of frontend Clean Architecture, what constraint does the Domain Layer have regarding React?">
    <Option>It must exclusively use React Server Components to guarantee high performance.</Option>
    <Option correct>The Domain must not import useState, useEffect, next/navigation, or any user interface dependencies.</Option>
    <Option>It must extend React.Component to manage the lifecycle.</Option>
    <Option>It must encapsulate CSS styling using styled-components or Tailwind modules.</Option>
  </Question>
  <Question title="What does organizing code by Vertical Slices (Features) propose compared to global technical folders?">
    <Option>Creating a single index.ts file where the entire project source code is exported.</Option>
    <Option correct>Grouping domain, infrastructure, and presentation within feature-based directories (e.g., features/exercises).</Option>
    <Option>Strictly separating files by extension: .ts in the root and .tsx in public subdirectories.</Option>
    <Option>Housing all application components inside a shared src/components folder.</Option>
  </Question>
  <Question title="What is the role of the src/core/ directory within the proposed feature-based architecture?">
    <Option>Containing authentication controllers and private database logic.</Option>
    <Option>Replacing the native package.json and tsconfig.json configuration.</Option>
    <Option correct>Housing cross-cutting resources and utilities such as standardized errors, base HTTP clients, and generic UI components.</Option>
    <Option>Storing compiled binary files and static application bundles.</Option>
  </Question>
  <Question title="Within a feature organized using Clean Architecture, where are Custom Hooks such as useExercises located?">
    <Option>features/&lt;feature&gt;/domain/entities/</Option>
    <Option>features/&lt;feature&gt;/infrastructure/datasources/</Option>
    <Option correct>features/&lt;feature&gt;/presentation/hooks/</Option>
    <Option>features/&lt;feature&gt;/core/extensions/</Option>
  </Question>
  <Question title="What role is fulfilled by the interfaces located in features/&lt;feature&gt;/domain/repositories/?">
    <Option>Configuring connection parameters for relational or NoSQL databases.</Option>
    <Option correct>Defining abstract persistence contracts that infrastructure must implement, satisfying the DIP principle.</Option>
    <Option>Automatically generating corresponding REST endpoints on the NestJS server.</Option>
    <Option>Handling session variable storage in LocalStorage or Cookies.</Option>
  </Question>
  <Question title="What is the primary advantage of isolating the business core from framework evolution?">
    <Option>Enables Next.js to compile directly to native WebAssembly binaries.</Option>
    <Option>Guarantees that the application never requires preventive maintenance or security patches.</Option>
    <Option correct>Allows upgrading Next.js versions, switching state libraries, or migrating to another framework without altering business logic.</Option>
    <Option>Eliminates the need to write TypeScript types when passing data between components.</Option>
  </Question>
</Quiz>
