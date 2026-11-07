---
sidebar_position: 2
description: "Guía paso a paso, parte 2: rutinas con una API propia (Route Handlers), formularios con Server Actions, interfaz optimista, ejercicios en un modal con rutas paralelas e interceptadas, tema guardado en una cookie, tipografía y metadatos para compartir."
---

# Next.js avanzado, parte 2: rutinas, formularios y metadatos

En la [parte 1](./01-next-avanzado-parte-1.md) construimos el catálogo de ejercicios. Ahora la app permite **armar rutinas**: elegir ejercicios, guardarlos y marcar lo que ya hiciste. Es el pretexto para ver cómo escribe datos Next.js (API propia y Server Actions) y para pulir la experiencia (modales, tema y vista previa al compartir).

:::note[Punto de partida]
Debes tener terminada la parte 1: `features/exercises/` completo, las rutas `/exercises` y `/exercises/[id]`, y daisyUI funcionando.
:::

---

## 1. Dónde viven las rutinas

Igual que con los ejercicios, primero los tipos y un almacén de datos. Las rutinas **sí cambian** (se crean y se marcan), así que viven en memoria del servidor; en un proyecto real irían a una base de datos.

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
    doneIds: number[]; // ejercicios que ya marcaste como hechos
}

// Lo que llega de un formulario o de una petición para crear una rutina
export interface RoutineInput {
    name: string;
    description: string;
    level: string;
    exerciseIds: number[];
}
```

```ts title="features/routines/store.ts" showLineNumbers
import type { Level, Routine, RoutineInput } from './types';

// En desarrollo, Next vuelve a evaluar los módulos al guardar un archivo. Guardar la lista en
// globalThis evita que se reinicie. En un proyecto real aquí iría una base de datos.
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

Las reglas de validación van en **un solo archivo**, porque las usarán dos puertas de entrada distintas (la API y el formulario) y deben ser idénticas:

```ts title="features/routines/validation.ts" showLineNumbers
import { EXERCISES } from '@/features/exercises/data';
import { LEVELS, type RoutineInput } from './types';

export type RoutineErrors = Partial<Record<'name' | 'level' | 'exerciseIds', string>>;

// Un solo lugar para las reglas: lo usan el formulario (Server Action) y la API (Route Handler)
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

## 2. Una API propia con Route Handlers

Un archivo `route.ts` dentro de `app/api/...` convierte la carpeta en un **endpoint**. Cada función exportada con el nombre de un verbo HTTP (`GET`, `POST`…) responde a ese verbo.

```ts title="app/api/routines/route.ts" showLineNumbers
import { NextResponse } from 'next/server';
import { routinesStore } from '@/features/routines/store';
import { validateRoutine } from '@/features/routines/validation';

// GET /api/routines -> la lista de rutinas en JSON
export async function GET() {
    return NextResponse.json(routinesStore.list());
}

// POST /api/routines -> crea una rutina a partir de un JSON
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

**Pruébalo** desde la consola del navegador (en cualquier página de la app):

```js title="Consola del navegador" showLineNumbers
// Debe devolver las dos rutinas iniciales
await fetch('/api/routines').then((r) => r.json())

// Datos inválidos: responde 400 con los errores
await fetch('/api/routines', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'A' }),
}).then((r) => r.status)
```

:::note[¿Entonces la lista de rutinas llama a esta API?]
No. Una página de servidor lee `routinesStore.list()` **directamente**; hacer `fetch('/api/routines')` desde el mismo servidor sería un viaje innecesario. El Route Handler existe para quien está **fuera** de Next: una app móvil, otro servicio o una prueba. Si solo tu interfaz usa el dato, probablemente no lo necesites.
:::

La lista y el detalle de las rutinas, leyendo el almacén sin API:

```tsx title="app/(app)/routines/page.tsx" showLineNumbers
import Link from 'next/link';
import { routinesStore } from '@/features/routines/store';
import { LEVELS } from '@/features/routines/types';

export const metadata = { title: 'Rutinas' };

// Esta página no llama a /api/routines: en un Server Component se lee el dato directamente
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

Agrega `{ href: '/routines', label: 'Rutinas' }` a `LINKS` en `app/(app)/layout.tsx`.

---

## 3. Formularios con Server Actions

Una **Server Action** es una función que se declara en el cliente pero **se ejecuta en el servidor**. Se conecta directamente al `<form action={...}>`: no hay `fetch`, ni `onSubmit`, ni `preventDefault`. Sigue el recorrido de un envío, con y sin errores:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-15/server-action-flujo/index.html"
  title="Qué pasa al enviar el formulario con una Server Action"
  height={680}
/>

**Paso 1. La acción.** Va en un archivo con `'use server'` arriba:

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

// Se ejecuta en el servidor cuando se envía el formulario de "Nueva rutina"
export async function createRoutineAction(_prev: FormState, formData: FormData): Promise<FormState> {
    const values = {
        name: String(formData.get('name') ?? ''),
        description: String(formData.get('description') ?? ''),
        level: String(formData.get('level') ?? ''),
        exerciseIds: formData.getAll('exerciseIds').map(Number),
    };

    const errors = validateRoutine(values);
    if (Object.keys(errors).length > 0) {
        // Devolvemos también lo que escribió la persona para no vaciar el formulario
        return { errors, values };
    }

    routinesStore.create(values);
    revalidatePath('/routines'); // la lista de rutinas debe mostrar la nueva
    redirect('/routines');
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Marca o desmarca un ejercicio como hecho (se usa en la sección 4)
export async function toggleDoneAction(routineId: number, exerciseId: number): Promise<void> {
    await delay(800); // simula una base de datos lenta para que se note la UI optimista
    routinesStore.toggleDone(routineId, exerciseId);
    revalidatePath(`/routines/${routineId}`);
}
```

:::warning[Un archivo `'use server'` solo exporta funciones `async`]
Si exportas una constante o una función normal desde un archivo con `'use server'` verás el error *A "use server" file can only export async functions*. Las constantes compartidas van en otro archivo (por ejemplo `types.ts`).
:::

Tres detalles de la acción:

| Detalle | Por qué |
| :--- | :--- |
| Valida otra vez en el servidor | Cualquier validación del navegador se puede saltar; la del servidor no. |
| Devuelve `values` junto con `errors` | Si el formulario se vacía al fallar, la persona tiene que escribir todo de nuevo. |
| `revalidatePath` antes de `redirect` | Le avisa a Next que la lista cambió; sin esto podría mostrar la versión guardada. |

**Paso 2. El formulario.** `useActionState` conecta la acción con el componente y devuelve el último resultado (`state`), la función para el `<form>` (`formAction`) y si se está enviando (`isPending`):

```tsx title="features/routines/components/RoutineForm.tsx" showLineNumbers
'use client';

import { useActionState } from 'react';
import { createRoutineAction, type FormState } from '../actions';
import { LEVELS } from '../types';
import type { Exercise } from '@/features/exercises/types';

const initialState: FormState = {};

export function RoutineForm({ exercises }: { exercises: Exercise[] }) {
    // state = lo último que devolvió la acción; formAction va en <form action>; isPending = se está enviando
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

**Compruébalo:** en `/routines/new` pulsa "Guardar rutina" sin llenar nada (deben salir los tres mensajes), luego completa el formulario y guárdalo (te lleva a la lista con la rutina nueva).

---

## 4. Interfaz optimista

Marcar un ejercicio como hecho tarda 0,8 s en el servidor. Si la casilla espera esa respuesta, la app se siente rota. Con **UI optimista** la pantalla cambia **ya** y el servidor confirma después; si falla, React deshace el cambio.

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-15/ui-optimista/index.html"
  title="UI optimista: el cambio se ve antes de que el servidor responda"
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
    doneIds: number[]; // lo que ya confirmó el servidor
}

export function ExerciseChecklist({ routineId, exercises, doneIds }: Props) {
    const [, startTransition] = useTransition();

    // optimisticDone muestra el cambio al instante; si la acción termina, el servidor manda el valor real
    const [optimisticDone, toggleOptimistic] = useOptimistic(doneIds, (current: number[], exerciseId: number) =>
        current.includes(exerciseId) ? current.filter((id) => id !== exerciseId) : [...current, exerciseId],
    );

    const handleToggle = (exerciseId: number) => {
        startTransition(async () => {
            toggleOptimistic(exerciseId); // 1. la pantalla cambia ya
            await toggleDoneAction(routineId, exerciseId); // 2. el servidor guarda (tarda ~0,8 s)
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

La página de detalle de una rutina, que le entrega los datos reales al componente de cliente:

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

:::tip[Cuándo usar UI optimista]
Cuando la acción casi siempre sale bien y la persona espera respuesta inmediata: marcar, dar "me gusta", reordenar. No la uses para operaciones que fallan a menudo o son críticas (pagos), donde conviene esperar la confirmación.
:::

---

## 5. El ejercicio en un modal: rutas paralelas e interceptadas

Queremos algo que se ve en muchas apps: al pulsar una tarjeta, el ejercicio se abre **en una ventana encima de la lista**, pero la URL cambia a `/exercises/4`, de modo que se puede compartir y, si alguien la abre directamente, ve la página completa.

Esto necesita dos funciones del App Router:

| Función | Nombre de la carpeta | Qué hace |
| :--- | :--- | :--- |
| **Ruta paralela** | `@modal` | Reserva un "espacio" extra en el layout que se llena de forma independiente. |
| **Ruta interceptada** | `(.)exercises/[id]` | Captura una navegación hacia otra ruta y muestra algo distinto **solo** cuando se llega desde dentro de la app. |

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-15/modal-interceptado/index.html"
  title="La misma URL puede mostrar un modal o una página completa"
  height={680}
/>

La estructura de carpetas queda así:

```text title="Estructura de app/(app)" showLineNumbers
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

:::note[Qué significa `(.)`]
`(.)` intercepta una ruta del **mismo nivel** que el espacio donde está. Aquí `@modal` es un espacio (no cuenta como nivel), así que `(.)exercises` captura `/exercises/...`. Existen también `(..)` (un nivel arriba) y `(...)` (desde la raíz).
:::

**Paso 1. El espacio vacío por defecto.** Cuando no hay un modal abierto, Next necesita saber qué dibujar en `@modal`:

```tsx title="app/(app)/@modal/default.tsx" showLineNumbers
// Cuando no hay ningún modal abierto, el espacio @modal no muestra nada
export default function Default() {
    return null;
}
```

**Paso 2. El componente Modal.** Es de cliente porque cierra la ventana volviendo atrás en el historial:

```tsx title="components/modal.tsx" showLineNumbers
'use client';

import { useRouter } from 'next/navigation';

// Un modal de daisyUI que se cierra volviendo a la página anterior del historial
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

**Paso 3. La ruta interceptada.** Reutiliza `ExerciseDetail` de la parte 1:

```tsx title="app/(app)/@modal/(.)exercises/[id]/page.tsx" showLineNumbers
import { notFound } from 'next/navigation';
import { Modal } from '@/components/modal';
import { ExerciseDetail } from '@/features/exercises/components/ExerciseDetail';
import { getExerciseById } from '@/features/exercises/services/exercises.service';

interface PageProps {
    params: Promise<{ id: string }>;
}

// Intercepta /exercises/[id] cuando se llega desde otra página de la app (clic en un enlace)
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

**Paso 4. El layout recibe el espacio como propiedad.** Agrega `modal` a las props y dibújalo después del contenido:

```tsx title="app/(app)/layout.tsx (fragmento)" showLineNumbers
export default function AppLayout({
    children,
    modal,
}: {
    children: React.ReactNode;
    modal: React.ReactNode; // lo que muestre el espacio paralelo @modal
}) {
    // ... el resto del layout queda igual ...

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

**Compruébalo, con los dos caminos a la misma URL:**

1. En `/exercises` pulsa una tarjeta: se abre el modal, la lista sigue detrás y la URL es `/exercises/4`. Cierra con la ✕ y vuelves a `/exercises`.
2. Con el modal abierto, recarga con F5: ahora ves la **página completa** del ejercicio. Es la ruta de verdad.

:::warning[Reinicia el servidor si no funciona]
Las carpetas `@modal` y `(.)` se detectan al arrancar. Si agregaste las carpetas con `npm run dev` ya corriendo y no ves el modal, detén el servidor y vuelve a iniciarlo.
:::

---

## 6. Tema claro y oscuro con una cookie

daisyUI cambia de tema con el atributo `data-theme` en `<html>`. Si lo guardas con `useState` o `localStorage`, la primera pintura sale con el tema equivocado y luego "parpadea". La solución es guardarlo en una **cookie**: el servidor la lee antes de pintar y entrega el HTML ya con el tema correcto.

**Paso 1. Define el tema oscuro** al final de `globals.css`, junto al tema `icesi` que ya existe:

```css title="app/globals.css (al final)" showLineNumbers
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

**Paso 2. Una Server Action que alterna la cookie:**

```ts title="shared/actions/theme.ts" showLineNumbers
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Un archivo "use server" solo puede exportar funciones async: las constantes no se exportan
const LIGHT = 'icesi';
const DARK = 'icesi-dark';

// Alterna entre el tema claro y el oscuro y lo recuerda en una cookie
export async function toggleThemeAction(): Promise<void> {
    const store = await cookies();
    const next = store.get('theme')?.value === DARK ? LIGHT : DARK;

    store.set('theme', next, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    revalidatePath('/', 'layout'); // vuelve a pintar toda la app con el tema nuevo
}
```

**Paso 3. Un botón en la barra** (un `<form>` cuya acción es la Server Action), en `app/(app)/layout.tsx`:

```tsx title="app/(app)/layout.tsx (fragmento)" showLineNumbers
import { toggleThemeAction } from '@/shared/actions/theme';

// ... dentro del header, junto a la campana de notificaciones:
<form action={toggleThemeAction}>
    <button type="submit" className="btn btn-ghost btn-sm">Cambiar tema</button>
</form>
```

Un formulario en un layout de cliente funciona porque `toggleThemeAction` es una Server Action que se importa como si fuera una función normal.

**Paso 4. El layout raíz lee la cookie** (y de paso carga la tipografía, ver la sección siguiente):

```tsx title="app/layout.tsx" showLineNumbers
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

// next/font descarga la tipografía al hacer el build y la sirve desde tu propio sitio
const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
    display: "swap",
});

export const metadata: Metadata = {
    // Base para armar las URLs absolutas de las imágenes al compartir (Open Graph)
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: { default: "Rutinas de ejercicio", template: "%s | Entrenamiento" },
    description: "Explora ejercicios, arma tus rutinas y marca lo que ya hiciste.",
};

// "async" porque leemos la cookie del tema en el servidor antes de pintar
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

:::warning[Costo de leer cookies]
En cuanto un layout llama a `cookies()`, **todas** las rutas que cuelgan de él pasan a renderizarse en cada petición (dinámicas). Las páginas de `/exercises/[id]` ya no se generan de antemano en el build. Para esta app es un buen intercambio; para un sitio de contenido estático, no lo sería.
:::

---

## 7. Tipografía y metadatos para compartir

**Tipografía con `next/font`.** Ya está en el layout: `Poppins` se descarga al hacer el build y se sirve desde tu propio dominio. Eso evita una petición a Google al abrir la página y el parpadeo de la letra al cargar. Para usar otra fuente de Google, cambia el nombre importado; `weight` solo acepta los pesos que la fuente tenga.

**Metadatos.** Dos archivos especiales en `app/` generan lo que los buscadores y las redes sociales leen:

```ts title="app/sitemap.ts" showLineNumbers
import type { MetadataRoute } from 'next';
import { EXERCISES } from '@/features/exercises/data';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

// Next sirve este archivo en /sitemap.xml: una lista de las páginas públicas para los buscadores
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

// Next sirve este archivo en /robots.txt: le dice a los buscadores qué pueden visitar
export default function robots(): MetadataRoute.Robots {
    return {
        rules: { userAgent: '*', allow: '/', disallow: ['/dashboard', '/routines'] },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
```

Y la imagen que se muestra cuando alguien comparte un enlace de la app (Open Graph). Next la **dibuja con JSX**:

```tsx title="app/opengraph-image.tsx" showLineNumbers
import { ImageResponse } from 'next/og';

export const alt = 'Rutinas de ejercicio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// La imagen que se ve cuando compartes el enlace en redes o mensajes. Se dibuja con JSX y estilos en línea
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

**Compruébalo** abriendo estas direcciones en el navegador: `/robots.txt`, `/sitemap.xml` y `/opengraph-image`. Cada una la genera Next a partir de su archivo.

:::tip[Qué hace `metadataBase`]
Las imágenes de Open Graph necesitan una URL **absoluta**. `metadataBase` en el layout raíz le da a Next el dominio para construirlas. En producción, define `NEXT_PUBLIC_SITE_URL` con la dirección real.
:::

---

## 8. Producción: revisa antes de entregar

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Lee la tabla de rutas que imprime `next build`: cada ruta marcada con `ƒ` se renderiza en cada petición y con `○` se generó en el build. Debes poder explicar por qué cada una es lo que es.

## Errores comunes de esta parte

| Síntoma | Causa | Solución |
| :--- | :--- | :--- |
| *A "use server" file can only export async functions* | Exportaste una constante o función normal desde un archivo `'use server'`. | Déjala sin `export` o muévela a otro archivo. |
| El modal nunca aparece, siempre ves la página completa | Falta `default.tsx` en `@modal`, el layout no renderiza `{modal}`, o no reiniciaste el servidor. | Revisa los tres puntos. |
| El modal queda abierto al ir a otra ruta | Falta el `default.tsx` o el layout no recibe `modal`. | Devuelve `null` en `@modal/default.tsx`. |
| El formulario se vacía cuando hay errores | La acción no devuelve `values` o el formulario no usa `defaultValue`. | Devuelve `{ errors, values }` y úsalos en los campos. |
| La rutina nueva no aparece en la lista | Falta `revalidatePath('/routines')` antes del `redirect`. | Agrégalo en la acción. |
| `redirect` parece no funcionar dentro de `try/catch` | `redirect` funciona lanzando una excepción que el `catch` se traga. | Llama a `redirect` fuera del `try/catch`. |
| El tema vuelve al claro al recargar | La cookie no se escribe (`path`) o el layout raíz no la lee. | Revisa `store.set(..., { path: '/' })` y el `await cookies()` del layout raíz. |
| La lista de rutinas se reinicia al guardar un archivo | El almacén vive en una variable de módulo y Next lo reevalúa en desarrollo. | Guárdalo en `globalThis`, como en `store.ts`. |
| `metadataBase` genera una advertencia | Falta definirla en el layout raíz. | Agrega `metadataBase: new URL(...)`. |

## Retos

1. Permite **eliminar una rutina** con una Server Action y un botón en la lista.
2. Agrega un tercer tema (`icesi-contraste`) y haz que el botón recorra los tres.
3. Crea `app/(app)/routines/[id]/loading.tsx` y comprueba cuándo se ve.
4. Haz que el Route Handler `GET /api/routines` acepte `?level=intermedio` para filtrar.
5. Sube de nivel: reemplaza `routinesStore` por llamadas a tu backend de NestJS con `fetch` desde un Server Component.

**Siguiente:** [pruebas end-to-end con Playwright](./03-pruebas-e2e-playwright.md) para comprobar automáticamente todo lo que acabas de construir.
