---
sidebar_position: 3
---

# tRPC: End-to-End Type Safety without Code Generation

Complete guide and resources from the **tRPC** presentation for Fullstack architectures built on TypeScript (React, Node.js, Express, and MongoDB).

### Team Members
- Alejandro Vargas - A00404840
- Juan José Muñoz - A00450054
- David Chicué - A00405613
- Victoria Restrepo - A00405025

---

## Slides and Resources

<PdfViewer src="/files/computacion-3/exposiciones-de-cursos/2026-02/tRPC.pdf" />

:::info[Project Links and Presentation]
- **Presentation (PDF):** [Download tRPC.pdf](/files/computacion-3/exposiciones-de-cursos/2026-02/tRPC.pdf)
- **Official Documentation:** [tRPC Documentation](https://trpc.io)
:::

---

## 1. What is tRPC and What Problem Does it Solve?

In traditional Fullstack development (REST or GraphQL), maintaining type consistency between client and backend requires either:
- Writing and synchronizing duplicate interface contracts by hand.
- Relying on code generators (*code-gen*) targeting OpenAPI or GraphQL schemas.

**tRPC** eliminates intermediate schema generation by leveraging TypeScript's native type inference: **the backend router's TypeScript type is imported directly as a compile-time type in the frontend**.

<ZoomableMermaid value={`flowchart LR
    subgraph Server ["Server (Node / Express)"]
        R["tRPC Router"]
        Z["Runtime Zod Validation"]
        R --> Z
    end

    subgraph Client ["Client (React + Vite)"]
        C["trpcClient / React Query"]
    end

    R -.->|Compile-time Type Inference| C
    C -->|HTTP / Request Batching| R

    style R fill:#dbeafe,stroke:#2563eb,stroke-width:2px
    style Z fill:#fef3c7,stroke:#d97706,stroke-width:2px
    style C fill:#dcfce7,stroke:#16a34a,stroke-width:2px`} />

### Core Advantages
- **Zero Code-Gen:** No compiling `.proto` files or regenerating `.graphql` schemas.
- **Immediate Error Feedback:** Changing an API property on the server causes instant compiler diagnostics across frontend callers.
- **Complete IntelliSense:** Endpoints, request arguments, and response objects provide full autocomplete.
- **Runtime Validation via Zod:** Ensures incoming request bodies strictly comply with expected TypeScript structures.

---

## 2. Queries vs. Mutations

- **Query:** Semantic equivalent to `GET`. Used for reading data without mutating server state.
- **Mutation:** Semantic equivalent to `POST`, `PUT`, or `DELETE`. Used for creating, updating, or removing resources.

---

## 3. Practical Demo: Fullstack Task Manager

<StepByStep>
  <Step number="1" title="Define Router on Server">
    ```typescript title="server/src/trpc.ts"
    import { initTRPC } from '@trpc/server';
    import { z } from 'zod';

    const t = initTRPC.create();
    export const router = t.router;
    export const publicProcedure = t.procedure;

    export const appRouter = router({
      getTasks: publicProcedure.query(async () => {
        return [{ id: '1', title: 'Learn tRPC', completed: false }];
      }),
      createTask: publicProcedure
        .input(z.object({ title: z.string().min(3) }))
        .mutation(async ({ input }) => {
          return { id: Date.now().toString(), title: input.title, completed: false };
        })
    });

    export type AppRouter = typeof appRouter;
    ```
  </Step>

  <Step number="2" title="Attach Router to Express">
    ```typescript title="server/src/index.ts"
    import express from 'express';
    import * as trpcExpress from '@trpc/server/adapters/express';
    import { appRouter } from './trpc';

    const app = express();
    app.use(
      '/trpc',
      trpcExpress.createExpressMiddleware({
        router: appRouter,
      })
    );

    app.listen(4000, () => console.log('Server running on port 4000'));
    ```
  </Step>

  <Step number="3" title="Consume in React with End-to-End Type Safety">
    ```typescript title="client/src/App.tsx"
    import { createTRPCReact } from '@trpc/react-query';
    import type { AppRouter } from '../../server/src/trpc';

    export const trpc = createTRPCReact<AppRouter>();

    export function TaskList() {
      const { data: tasks, isLoading } = trpc.getTasks.useQuery();
      const createTask = trpc.createTask.useMutation();

      if (isLoading) return <div>Loading tasks...</div>;

      return (
        <div>
          <h2>Tasks</h2>
          {tasks?.map(t => <p key={t.id}>{t.title}</p>)}
          <button onClick={() => createTask.mutate({ title: 'New Task' })}>
            Add Task
          </button>
        </div>
      );
    }
    ```
  </Step>
</StepByStep>
