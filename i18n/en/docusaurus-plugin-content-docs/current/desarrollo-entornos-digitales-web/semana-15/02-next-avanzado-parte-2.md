---
sidebar_position: 2
description: "Step-by-step guide, part 2: routines with your own API (Route Handlers), forms with Server Actions, optimistic UI, exercises in a modal with parallel and intercepted routes, theme saved in a cookie, typography and metadata for sharing."
---

# Advanced Next.js, part 2: routines, forms and metadata

In [part 1](./01-next-avanzado-parte-1.md) we built the exercise catalog. Now the app lets you **build routines**: choose exercises, save them and mark what you have already done. It is the excuse to see how Next.js writes data (your own API and Server Actions) and to polish the experience (modals, theme and a preview when sharing).

:::note[Starting point]
You must have part 1 finished: the whole `features/exercises/` folder, the `/exercises` and `/exercises/[id]` routes, and daisyUI working.
:::

---

## 1. Where routines live

As with the exercises, first the types and a data store. Routines **do change** (they are created and marked), so they live in server memory; in a real project they would go to a database.

```ts title="features/routines/types.ts" showLineNumbers
export type Level = 'principiante' | 'intermedio' | 'avanzado';

export const LEVELS: { value: Level; label: string }[] = [
    { value: 'principiante', label: 'Principiante' },
    { value: 'intermedio', label: 'Intermedio' },
    { value: 'avanzado', label: 'Avanzado' },
];

export interface Routine {
    id: number;
    name: string;
    description: string;
    level: Level;
    exerciseIds: number[];
    doneIds: number[]; // exercises you have already marked as done
}

// What arrives from a form or a request to create a routine
export interface RoutineInput {
    name: string;
    description: string;
    level: string;
    exerciseIds: number[];
}
```

```ts title="features/routines/store.ts" showLineNumbers
import type { Level, Routine, RoutineInput } from './types';

// In development, Next re-evaluates the modules when a file is saved. Keeping the list in
// globalThis prevents it from resetting. In a real project a database would go here.
const globalForRoutines = globalThis as unknown as { routines?: Routine[] };

const routines: Routine[] = (globalForRoutines.routines ??= [
    {
        id: 1,
        name: 'Piernas de acero',
        description: 'Tres ejercicios para trabajar piernas y glúteos en casa.',
        level: 'intermedio',
        exerciseIds: [1, 4, 3],
        doneIds: [],
    },
    {
        id: 2,
        name: 'Despertar suave',
        description: 'Movilidad y cardio ligero para empezar el día.',
        level: 'principiante',
        exerciseIds: [8, 5],
        doneIds: [],
    },
]);

export const routinesStore = {
    list(): Routine[] {
        return routines;
    },

    get(id: number): Routine | undefined {
        return routines.find((routine) => routine.id === id);
    },

    create(input: RoutineInput): Routine {
        const routine: Routine = {
            id: Math.max(0, ...routines.map((r) => r.id)) + 1,
            name: input.name.trim(),
            description: input.description.trim(),
            level: input.level as Level,
            exerciseIds: input.exerciseIds,
            doneIds: [],
        };
        routines.push(routine);
        return routine;
    },

    toggleDone(id: number, exerciseId: number): void {
        const routine = routines.find((r) => r.id === id);
        if (!routine) return;
        routine.doneIds = routine.doneIds.includes(exerciseId)
            ? routine.doneIds.filter((done) => done !== exerciseId)
            : [...routine.doneIds, exerciseId];
    },
};
```
The validation rules go in **a single file**, because two different entry points will use them (the API and the form) and they must be identical:

```ts title="features/routines/validation.ts" showLineNumbers
import { EXERCISES } from '@/features/exercises/data';
import { LEVELS, type RoutineInput } from './types';

export type RoutineErrors = Partial<Record<'name' | 'level' | 'exerciseIds', string>>;

// A single place for the rules: used by the form (Server Action) and the API (Route Handler)
export function validateRoutine(input: RoutineInput): RoutineErrors {
    const errors: RoutineErrors = {};

    if (input.name.trim().length < 3) {
        errors.name = 'El nombre debe tener al menos 3 caracteres.';
    }
    if (!LEVELS.some((level) => level.value === input.level)) {
        errors.level = 'Elige un nivel.';
    }
    if (input.exerciseIds.length === 0) {
        errors.exerciseIds = 'Elige al menos un ejercicio.';
    } else if (input.exerciseIds.some((id) => !EXERCISES.some((exercise) => exercise.id === id))) {
        errors.exerciseIds = 'Hay ejercicios que no existen.';
    }

    return errors;
}
```
---

## 2. Your own API with Route Handlers

A `route.ts` file inside `app/api/...` turns the folder into an **endpoint**. Each function exported with the name of an HTTP verb (`GET`, `POST`…) answers that verb.

```ts title="app/api/routines/route.ts" showLineNumbers
import { NextResponse } from 'next/server';
import { routinesStore } from '@/features/routines/store';
import { validateRoutine } from '@/features/routines/validation';

// GET /api/routines -> the routines list as JSON
export async function GET() {
    return NextResponse.json(routinesStore.list());
}

// POST /api/routines -> creates a routine from a JSON
export async function POST(request: Request) {
    const body = await request.json().catch(() => null);

    const input = {
        name: String(body?.name ?? ''),
        description: String(body?.description ?? ''),
        level: String(body?.level ?? ''),
        exerciseIds: Array.isArray(body?.exerciseIds) ? body.exerciseIds.map(Number) : [],
    };

    const errors = validateRoutine(input);
    if (Object.keys(errors).length > 0) {
        return NextResponse.json({ errors }, { status: 400 });
    }

    return NextResponse.json(routinesStore.create(input), { status: 201 });
}
```
**Try it** from the browser console (on any page of the app):

```js title="Browser console" showLineNumbers
// Should return the two initial routines
await fetch('/api/routines').then((r) => r.json())

// Invalid data: responds 400 with the errors
await fetch('/api/routines', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'A' }),
}).then((r) => r.status)
```
:::note[So does the routines list call this API?]
No. A server page reads `routinesStore.list()` **directly**; doing `fetch('/api/routines')` from the same server would be an unnecessary trip. The Route Handler exists for whoever is **outside** Next: a mobile app, another service or a test. If only your interface uses the data, you probably do not need it.
:::

The routines list and detail, reading the store without an API:

```tsx title="app/(app)/routines/page.tsx" showLineNumbers
import Link from 'next/link';
import { routinesStore } from '@/features/routines/store';
import { LEVELS } from '@/features/routines/types';

export const metadata = { title: 'Rutinas' };

// This page does not call /api/routines: in a Server Component the data is read directly
export default function RoutinesPage() {
    const routines = routinesStore.list();

    return (
        <div className="flex flex-col gap-6">
            <header className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Rutinas</h1>
                    <p className="text-sm opacity-70">Combina ejercicios y marca lo que ya hiciste.</p>
                </div>
                <Link href="/routines/new" className="btn btn-primary btn-sm">Nueva rutina</Link>
            </header>

            <ul className="grid gap-4 sm:grid-cols-2">
                {routines.map((routine) => (
                    <li key={routine.id}>
                        <Link href={`/routines/${routine.id}`} className="card bg-base-100 shadow-sm transition-shadow hover:shadow-md">
                            <div className="card-body gap-2 p-4">
                                <h2 className="card-title text-base">{routine.name}</h2>
                                <p className="text-sm opacity-70">{routine.description}</p>
                                <div className="flex items-center gap-2">
                                    <span className="badge badge-secondary badge-sm">
                                        {LEVELS.find((level) => level.value === routine.level)?.label}
                                    </span>
                                    <span className="text-xs opacity-70">{routine.exerciseIds.length} ejercicios</span>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```
Add `{ href: '/routines', label: 'Rutinas' }` to `LINKS` in `app/(app)/layout.tsx`.

---

## 3. Forms with Server Actions

A **Server Action** is a function that is declared on the client side but **runs on the server**. It connects directly to `<form action={...}>`: no `fetch`, no `onSubmit`, no `preventDefault`. Follow the journey of a submission, with and without errors:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-15/server-action-flujo/index.html"
  title="What happens when the form is submitted with a Server Action"
  height={680}
/>

**Step 1. The action.** It goes in a file with `'use server'` at the top:

```ts title="features/routines/actions.ts" showLineNumbers
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { routinesStore } from './store';
import { validateRoutine, type RoutineErrors } from './validation';

export interface FormState {
    errors?: RoutineErrors;
    values?: { name: string; description: string; level: string; exerciseIds: number[] };
}

// Runs on the server when the "Nueva rutina" form is submitted
export async function createRoutineAction(_prev: FormState, formData: FormData): Promise<FormState> {
    const values = {
        name: String(formData.get('name') ?? ''),
        description: String(formData.get('description') ?? ''),
        level: String(formData.get('level') ?? ''),
        exerciseIds: formData.getAll('exerciseIds').map(Number),
    };

    const errors = validateRoutine(values);
    if (Object.keys(errors).length > 0) {
        // We also return what the person typed so the form is not emptied
        return { errors, values };
    }

    routinesStore.create(values);
    revalidatePath('/routines'); // the routines list must show the new one
    redirect('/routines');
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Marks or unmarks an exercise as done (used in section 4)
export async function toggleDoneAction(routineId: number, exerciseId: number): Promise<void> {
    await delay(800); // simulates a slow database so the optimistic UI is noticeable
    routinesStore.toggleDone(routineId, exerciseId);
    revalidatePath(`/routines/${routineId}`);
}
```
:::warning[A `'use server'` file only exports `async` functions]
If you export a constant or a regular function from a file with `'use server'` you will see the error *A "use server" file can only export async functions*. Shared constants go in another file (for example `types.ts`).
:::

Three details of the action:

| Detail | Why |
| :--- | :--- |
| It validates again on the server | Any browser validation can be bypassed; the server's cannot. |
| It returns `values` together with `errors` | If the form is emptied on failure, the person has to type everything again. |
| `revalidatePath` before `redirect` | Tells Next the list changed; without it, it might show the cached version. |

**Step 2. The form.** `useActionState` connects the action with the component and returns the latest result (`state`), the function for the `<form>` (`formAction`) and whether it is being submitted (`isPending`):

```tsx title="features/routines/components/RoutineForm.tsx" showLineNumbers
'use client';

import { useActionState } from 'react';
import { createRoutineAction, type FormState } from '../actions';
import { LEVELS } from '../types';
import type { Exercise } from '@/features/exercises/types';

const initialState: FormState = {};

export function RoutineForm({ exercises }: { exercises: Exercise[] }) {
    // state = the last thing the action returned; formAction goes in <form action>; isPending = it is being submitted
    const [state, formAction, isPending] = useActionState(createRoutineAction, initialState);
    const { errors, values } = state;

    return (
        <form action={formAction} className="flex flex-col gap-4">
            <div>
                <label className="label text-sm" htmlFor="routine-name">Nombre de la rutina</label>
                <input
                    id="routine-name"
                    name="name"
                    defaultValue={values?.name}
                    placeholder="Ej. Piernas de acero"
                    className="input input-bordered w-full"
                    aria-invalid={Boolean(errors?.name)}
                />
                {errors?.name && <p className="mt-1 text-sm text-error">{errors.name}</p>}
            </div>

            <div>
                <label className="label text-sm" htmlFor="routine-description">Descripción (opcional)</label>
                <textarea
                    id="routine-description"
                    name="description"
                    defaultValue={values?.description}
                    rows={3}
                    className="textarea textarea-bordered w-full"
                />
            </div>

            <div>
                <label className="label text-sm" htmlFor="routine-level">Nivel</label>
                <select
                    id="routine-level"
                    name="level"
                    defaultValue={values?.level ?? ''}
                    className="select select-bordered w-full"
                >
                    <option value="" disabled>Elige un nivel</option>
                    {LEVELS.map((level) => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                </select>
                {errors?.level && <p className="mt-1 text-sm text-error">{errors.level}</p>}
            </div>

            <fieldset>
                <legend className="label text-sm">Ejercicios</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                    {exercises.map((exercise) => (
                        <label key={exercise.id} className="flex cursor-pointer items-center gap-2 rounded-box border border-base-300 p-3">
                            <input
                                type="checkbox"
                                name="exerciseIds"
                                value={exercise.id}
                                defaultChecked={values?.exerciseIds.includes(exercise.id)}
                                className="checkbox checkbox-primary checkbox-sm"
                            />
                            <span className="text-sm">{exercise.name}</span>
                        </label>
                    ))}
                </div>
                {errors?.exerciseIds && <p className="mt-1 text-sm text-error">{errors.exerciseIds}</p>}
            </fieldset>

            <button type="submit" disabled={isPending} className="btn btn-primary w-fit">
                {isPending ? 'Guardando...' : 'Guardar rutina'}
            </button>
        </form>
    );
}
```

```tsx title="app/(app)/routines/new/page.tsx" showLineNumbers
import Link from 'next/link';
import { EXERCISES } from '@/features/exercises/data';
import { RoutineForm } from '@/features/routines/components/RoutineForm';

export const metadata = { title: 'Nueva rutina' };

export default function NewRoutinePage() {
    return (
        <div className="flex flex-col gap-4">
            <Link href="/routines" className="btn btn-ghost btn-sm w-fit">← Volver a rutinas</Link>
            <h1 className="text-2xl font-bold">Nueva rutina</h1>
            <RoutineForm exercises={EXERCISES} />
        </div>
    );
}
```

**Check it:** at `/routines/new` press "Guardar rutina" without filling anything (the three messages should appear), then complete the form and save it (it takes you to the list with the new routine).

---

## 4. Optimistic UI

Marking an exercise as done takes 0.8 s on the server. If the checkbox waits for that response, the app feels broken. With **optimistic UI** the screen changes **now** and the server confirms later; if it fails, React undoes the change.

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-15/ui-optimista/index.html"
  title="Optimistic UI: the change is seen before the server responds"
  height={680}
/>

```tsx title="features/routines/components/ExerciseChecklist.tsx" showLineNumbers
'use client';

import { useOptimistic, useTransition } from 'react';
import { toggleDoneAction } from '../actions';
import type { Exercise } from '@/features/exercises/types';

interface Props {
    routineId: number;
    exercises: Exercise[];
    doneIds: number[]; // what the server has already confirmed
}

export function ExerciseChecklist({ routineId, exercises, doneIds }: Props) {
    const [, startTransition] = useTransition();

    // optimisticDone shows the change instantly; when the action finishes, the server sends the real value
    const [optimisticDone, toggleOptimistic] = useOptimistic(doneIds, (current: number[], exerciseId: number) =>
        current.includes(exerciseId) ? current.filter((id) => id !== exerciseId) : [...current, exerciseId],
    );

    const handleToggle = (exerciseId: number) => {
        startTransition(async () => {
            toggleOptimistic(exerciseId); // 1. the screen changes now
            await toggleDoneAction(routineId, exerciseId); // 2. the server saves (takes ~0.8 s)
        });
    };

    return (
        <div className="flex flex-col gap-3">
            <progress
                className="progress progress-primary"
                value={optimisticDone.length}
                max={exercises.length}
            />
            <p className="text-sm opacity-70" aria-live="polite">
                {optimisticDone.length} de {exercises.length} ejercicios hechos
            </p>

            <ul className="flex flex-col gap-2">
                {exercises.map((exercise) => (
                    <li key={exercise.id}>
                        <label className="flex cursor-pointer items-center gap-3 rounded-box bg-base-100 p-3 shadow-sm">
                            <input
                                type="checkbox"
                                checked={optimisticDone.includes(exercise.id)}
                                onChange={() => handleToggle(exercise.id)}
                                className="checkbox checkbox-primary"
                            />
                            <span className={optimisticDone.includes(exercise.id) ? 'line-through opacity-60' : ''}>
                                {exercise.name}
                            </span>
                            <span className="ml-auto text-xs opacity-60">{exercise.durationMin} min</span>
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```
The routine detail page, which hands the real data to the client component:

```tsx title="app/(app)/routines/[id]/page.tsx" showLineNumbers
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EXERCISES } from '@/features/exercises/data';
import { ExerciseChecklist } from '@/features/routines/components/ExerciseChecklist';
import { routinesStore } from '@/features/routines/store';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function RoutineDetailPage({ params }: PageProps) {
    const { id } = await params;
    const routine = routinesStore.get(Number(id));

    if (!routine) notFound();

    const exercises = routine.exerciseIds
        .map((exerciseId) => EXERCISES.find((exercise) => exercise.id === exerciseId))
        .filter((exercise) => exercise !== undefined);

    return (
        <div className="flex flex-col gap-4">
            <Link href="/routines" className="btn btn-ghost btn-sm w-fit">← Volver a rutinas</Link>
            <div>
                <h1 className="text-2xl font-bold">{routine.name}</h1>
                <p className="text-sm opacity-70">{routine.description}</p>
            </div>
            <ExerciseChecklist routineId={routine.id} exercises={exercises} doneIds={routine.doneIds} />
        </div>
    );
}
```
:::tip[When to use optimistic UI]
When the action almost always succeeds and people expect an immediate response: marking, liking, reordering. Do not use it for operations that often fail or are critical (payments), where it is better to wait for confirmation.
:::

---

## 5. The exercise in a modal: parallel and intercepted routes

We want something seen in many apps: when you press a card, the exercise opens **in a window on top of the list**, but the URL changes to `/exercises/4`, so it can be shared and, if someone opens it directly, they see the full page.

This needs two App Router features:

| Feature | Folder name | What it does |
| :--- | :--- | :--- |
| **Parallel route** | `@modal` | Reserves an extra "slot" in the layout that is filled independently. |
| **Intercepted route** | `(.)exercises/[id]` | Captures a navigation to another route and shows something different **only** when you arrive from inside the app. |

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-15/modal-interceptado/index.html"
  title="The same URL can show a modal or a full page"
  height={680}
/>

The folder structure looks like this:

```text title="Structure of app/(app)" showLineNumbers
app/(app)/
├── layout.tsx                    ← recibe { children, modal }
├── exercises/
│   ├── page.tsx
│   └── [id]/page.tsx             ← la página completa (URL escrita o recarga)
└── @modal/
    ├── default.tsx               ← qué mostrar cuando no hay modal
    └── (.)exercises/
        └── [id]/page.tsx         ← el modal (clic desde la lista)
```
:::note[What `(.)` means]
`(.)` intercepts a route at the **same level** as the slot where it lives. Here `@modal` is a slot (it does not count as a level), so `(.)exercises` captures `/exercises/...`. There are also `(..)` (one level up) and `(...)` (from the root).
:::

**Step 1. The empty default.** When no modal is open, Next needs to know what to draw in `@modal`:

```tsx title="app/(app)/@modal/default.tsx" showLineNumbers
// When no modal is open, the @modal slot shows nothing
export default function Default() {
    return null;
}
```
**Step 2. The Modal component.** It is a client component because it closes the window by going back in the history:

```tsx title="components/modal.tsx" showLineNumbers
'use client';

import { useRouter } from 'next/navigation';

// A daisyUI modal that closes by going back to the previous history page
export function Modal({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
        <div className="modal modal-open" role="dialog" aria-modal="true">
            <div className="modal-box max-w-2xl">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    aria-label="Cerrar"
                >
                    ✕
                </button>
                {children}
            </div>
            <div className="modal-backdrop" onClick={() => router.back()} />
        </div>
    );
}
```
**Step 3. The intercepted route.** It reuses `ExerciseDetail` from part 1:

```tsx title="app/(app)/@modal/(.)exercises/[id]/page.tsx" showLineNumbers
import { notFound } from 'next/navigation';
import { Modal } from '@/components/modal';
import { ExerciseDetail } from '@/features/exercises/components/ExerciseDetail';
import { getExerciseById } from '@/features/exercises/services/exercises.service';

interface PageProps {
    params: Promise<{ id: string }>;
}

// Intercepts /exercises/[id] when arriving from another page of the app (clicking a link)
export default async function ExerciseModalPage({ params }: PageProps) {
    const { id } = await params;
    const exercise = await getExerciseById(Number(id));

    if (!exercise) notFound();

    return (
        <Modal>
            <ExerciseDetail exercise={exercise} />
        </Modal>
    );
}
```
**Step 4. The layout receives the slot as a prop.** Add `modal` to the props and draw it after the content:

```tsx title="app/(app)/layout.tsx (fragment)" showLineNumbers
export default function AppLayout({
    children,
    modal,
}: {
    children: React.ReactNode;
    modal: React.ReactNode; // whatever the parallel @modal slot shows
}) {
    // ... the rest of the layout stays the same ...

    return (
        <AuthGuard>
            <div className="min-h-screen bg-base-200">
                {/* header ... */}
                <main className="max-w-4xl mx-auto p-6">{children}</main>
                {modal}
            </div>
        </AuthGuard>
    );
}
```
**Check it, with both paths to the same URL:**

1. At `/exercises` press a card: the modal opens, the list stays behind and the URL is `/exercises/4`. Close with the ✕ and you go back to `/exercises`.
2. With the modal open, reload with F5: now you see the **full page** of the exercise. That is the real route.

:::warning[Restart the server if it does not work]
The `@modal` and `(.)` folders are detected on startup. If you added the folders with `npm run dev` already running and you do not see the modal, stop the server and start it again.
:::

---

## 6. Light and dark theme with a cookie

daisyUI switches theme with the `data-theme` attribute on `<html>`. If you save it with `useState` or `localStorage`, the first paint comes out with the wrong theme and then "flickers". The solution is to save it in a **cookie**: the server reads it before painting and delivers the HTML already with the right theme.

**Step 1. Define the dark theme** at the end of `globals.css`, next to the `icesi` theme that already exists:

```css title="app/globals.css (at the end)" showLineNumbers
@plugin "daisyui/theme" {
  name: "icesi-dark";
  color-scheme: dark;
  --color-primary: #7b7bf2;
  --color-primary-content: #0f172a;
  --color-secondary: #a78bf5;
  --color-secondary-content: #0f172a;
  --color-accent: #4cb979;
  --color-accent-content: #0f172a;
  --color-neutral: #cbd5e1;
  --color-neutral-content: #0f172a;
  --color-info: #7b7bf2;
  --color-info-content: #0f172a;
  --color-success: #4cb979;
  --color-success-content: #0f172a;
  --color-warning: #e4eb60;
  --color-warning-content: #1f2937;
  --color-error: #f0866a;
  --color-error-content: #0f172a;
  --color-base-100: #1e293b;
  --color-base-200: #172033;
  --color-base-300: #0f172a;
  --color-base-content: #e2e8f0;
}
```
**Step 2. A Server Action that toggles the cookie:**

```ts title="shared/actions/theme.ts" showLineNumbers
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// A "use server" file can only export async functions: constants are not exported
const LIGHT = 'icesi';
const DARK = 'icesi-dark';

// Toggles between the light and dark theme and remembers it in a cookie
export async function toggleThemeAction(): Promise<void> {
    const store = await cookies();
    const next = store.get('theme')?.value === DARK ? LIGHT : DARK;

    store.set('theme', next, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    revalidatePath('/', 'layout'); // repaints the whole app with the new theme
}
```
**Step 3. A button in the bar** (a `<form>` whose action is the Server Action), in `app/(app)/layout.tsx`:

```tsx title="app/(app)/layout.tsx (fragment)" showLineNumbers
import { toggleThemeAction } from '@/shared/actions/theme';

// ... inside the header, next to the notifications bell:
<form action={toggleThemeAction}>
    <button type="submit" className="btn btn-ghost btn-sm">Cambiar tema</button>
</form>
```
A form in a client layout works because `toggleThemeAction` is a Server Action that is imported as if it were a regular function.

**Step 4. The root layout reads the cookie** (and also loads the typography, see the next section):

```tsx title="app/layout.tsx" showLineNumbers
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

// next/font downloads the typeface at build time and serves it from your own site
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    display: "swap",
});

export const metadata: Metadata = {
    // Base to build the absolute URLs of the images when sharing (Open Graph)
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: { default: "Rutinas de ejercicio", template: "%s | Entrenamiento" },
    description: "Explora ejercicios, arma tus rutinas y marca lo que ya hiciste.",
};

// "async" because we read the theme cookie on the server before painting
export default async function RootLayout({ children }: LayoutProps<"/">) {
    const theme = (await cookies()).get("theme")?.value === "icesi-dark" ? "icesi-dark" : "icesi";

    return (
        <html
            lang="es"
            data-theme={theme}
            className={`${poppins.className} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
```
:::warning[The cost of reading cookies]
As soon as a layout calls `cookies()`, **all** the routes under it are rendered on every request (dynamic). The `/exercises/[id]` pages are no longer generated in advance at build time. For this app it is a good trade-off; for a static content site, it would not be.
:::

---

## 7. Typography and metadata for sharing

**Typography with `next/font`.** It is already in the layout: `Poppins` is downloaded at build time and served from your own domain. That avoids a request to Google when opening the page and the font flicker on load. To use another Google font, change the imported name; `weight` only accepts the weights the font has.

**Metadata.** Two special files in `app/` generate what search engines and social networks read:

```ts title="app/sitemap.ts" showLineNumbers
import type { MetadataRoute } from 'next';
import { EXERCISES } from '@/features/exercises/data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

// Next serves this file at /sitemap.xml: a list of public pages for search engines
export default function sitemap(): MetadataRoute.Sitemap {
    return [
        { url: `${SITE_URL}/exercises`, changeFrequency: 'weekly', priority: 1 },
        ...EXERCISES.map((exercise) => ({
            url: `${SITE_URL}/exercises/${exercise.id}`,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
    ];
}
```

```ts title="app/robots.ts" showLineNumbers
import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

// Next serves this file at /robots.txt: it tells search engines what they may visit
export default function robots(): MetadataRoute.Robots {
    return {
        rules: { userAgent: '*', allow: '/', disallow: ['/dashboard', '/routines'] },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
```
And the image shown when someone shares a link to the app (Open Graph). Next **draws it with JSX**:

```tsx title="app/opengraph-image.tsx" showLineNumbers
import { ImageResponse } from 'next/og';

export const alt = 'Rutinas de ejercicio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// The image shown when you share the link on social networks or messages. It is drawn with JSX and inline styles
export default function OpenGraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: 80,
                    background: '#5454e9',
                    color: 'white',
                }}
            >
                <div style={{ fontSize: 88, fontWeight: 700 }}>Rutinas de ejercicio</div>
                <div style={{ fontSize: 40, marginTop: 24 }}>Explora ejercicios y arma tus rutinas</div>
            </div>
        ),
        size,
    );
}
```
**Check it** by opening these addresses in the browser: `/robots.txt`, `/sitemap.xml` and `/opengraph-image`. Next generates each one from its file.

:::tip[What `metadataBase` does]
Open Graph images need an **absolute** URL. `metadataBase` in the root layout gives Next the domain to build them. In production, set `NEXT_PUBLIC_SITE_URL` to the real address.
:::

---

## 8. Production: check before delivering

```bash
npm run lint
npx tsc --noEmit
npm run build
```
Read the route table printed by `next build`: each route marked `ƒ` is rendered on every request and `○` was generated at build time. You should be able to explain why each one is what it is.

## Common errors in this part

| Symptom | Cause | Fix |
| :--- | :--- | :--- |
| *A "use server" file can only export async functions* | You exported a constant or a regular function from a `'use server'` file. | Remove the `export` or move it to another file. |
| The modal never appears, you always see the full page | `default.tsx` is missing in `@modal`, the layout does not render `{modal}`, or you did not restart the server. | Check all three points. |
| The modal stays open when going to another route | `default.tsx` is missing or the layout does not receive `modal`. | Return `null` in `@modal/default.tsx`. |
| The form empties when there are errors | The action does not return `values` or the form does not use `defaultValue`. | Return `{ errors, values }` and use them in the fields. |
| The new routine does not appear in the list | `revalidatePath('/routines')` is missing before `redirect`. | Add it in the action. |
| `redirect` seems not to work inside `try/catch` | `redirect` works by throwing an exception that `catch` swallows. | Call `redirect` outside the `try/catch`. |
| The theme goes back to light on reload | The cookie is not written (`path`) or the root layout does not read it. | Check `store.set(..., { path: '/' })` and the `await cookies()` in the root layout. |
| The routines list resets when saving a file | The store lives in a module variable and Next re-evaluates it in development. | Keep it in `globalThis`, as in `store.ts`. |
| `metadataBase` produces a warning | It is not defined in the root layout. | Add `metadataBase: new URL(...)`. |

## Challenges

1. Let people **delete a routine** with a Server Action and a button in the list.
2. Add a third theme (`icesi-contraste`) and make the button cycle through all three.
3. Create `app/(app)/routines/[id]/loading.tsx` and check when it is shown.
4. Make the `GET /api/routines` Route Handler accept `?level=intermedio` to filter.
5. Level up: replace `routinesStore` with calls to your NestJS backend using `fetch` from a Server Component.

**Next:** [end-to-end tests with Playwright](./03-pruebas-e2e-playwright.md) to automatically check everything you just built.
