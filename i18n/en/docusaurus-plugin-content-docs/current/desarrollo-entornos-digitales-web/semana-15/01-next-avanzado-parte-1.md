---
sidebar_position: 1
description: "Step-by-step guide, part 1: on top of the week 13 project we build an exercises app with optimized images, dynamic routes, loading states with Suspense and filters stored in the URL."
---

# Advanced Next.js, part 1: exercises, images and loading

So far your project has a login, a Zustand session and a dashboard. In these two guides we add an **exercises and routines app** and, along the way, we look at the Next.js features that make an application feel professional: optimized images, pages that load in pieces, filters you can share, forms validated on the server, modal windows with their own URL, saved themes and a preview when sharing a link.

**This part (1)** builds the exercise catalog. [Part 2](./02-next-avanzado-parte-2.md) adds the routines.

:::note[Starting point]
Start from the [`week-13/next-zustand`](https://github.com/Kelocoes/interfaces-3-202602/tree/week-13/next-zustand) branch or from your own [week 13](../semana-13/05-caso-practico-sesion-y-notificaciones.md) project. You need the login, the `AuthGuard`, the `app/(app)/layout.tsx` layout and daisyUI working. The new routes go inside `app/(app)/`, so they are protected by the session.
:::

## What you will build

| Part | Next.js topic | What you will see in the app |
| :--- | :--- | :--- |
| 1 | Server Components and services | An exercise list that is read on the server |
| 1 | `next/image` | Photos that optimize themselves |
| 1 | Dynamic routes, `generateMetadata`, `not-found` | One page per exercise with its own title |
| 1 | `loading.tsx` and `Suspense` | Skeletons while data arrives |
| 1 | `searchParams` | Search and filters that live in the URL |
| 2 | Route Handlers | Your own API at `/api/routines` |
| 2 | Server Actions, `useActionState` | A "New routine" form validated on the server |
| 2 | `useOptimistic` | Checkboxes that respond instantly |
| 2 | Parallel and intercepted routes | Exercise detail in a modal |
| 2 | Cookies, `next/font`, metadata | Light/dark theme, typography and a preview when sharing |

---

## 1. The data and the service

Before drawing anything we need data. In a real project it would come from a database; here it lives in a file, but we read it **through a service** so that changing the source later does not force you to touch the screens.

```ts title="features/exercises/types.ts" showLineNumbers
export type Category = 'fuerza' | 'cardio' | 'movilidad';

export interface Exercise {
    id: number;
    name: string;
    category: Category;
    muscle: string;
    durationMin: number;
    description: string;
    image: string;
}

export const CATEGORIES: { value: Category; label: string }[] = [
    { value: 'fuerza', label: 'Fuerza' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'movilidad', label: 'Movilidad' },
];
```
For the photos we use [placehold.co](https://placehold.co), which generates images with the text and color you ask for, without downloading anything:

```ts title="features/exercises/data.ts" showLineNumbers
import type { Category, Exercise } from './types';

// Brand colors by category (without the #)
const COLORS: Record<Category, string> = { fuerza: '5454e9', cardio: 'e9683b', movilidad: '4cb979' };

// Placeholder image: size, background and text color, format and the text it shows
const img = (category: Category, text: string) =>
    `https://placehold.co/800x600/${COLORS[category]}/ffffff/png?text=${encodeURIComponent(text)}`;

export const EXERCISES: Exercise[] = [
    { id: 1, name: 'Sentadilla', category: 'fuerza', muscle: 'Piernas', durationMin: 10, image: img('fuerza', 'Sentadilla'), description: 'Baja la cadera como si te sentaras, con la espalda recta y las rodillas alineadas con los pies.' },
    { id: 2, name: 'Flexiones', category: 'fuerza', muscle: 'Pecho y brazos', durationMin: 8, image: img('fuerza', 'Flexiones'), description: 'Apoya manos y puntas de los pies, baja el pecho al suelo y empuja hasta estirar los brazos.' },
    { id: 3, name: 'Plancha', category: 'fuerza', muscle: 'Abdomen', durationMin: 5, image: img('fuerza', 'Plancha'), description: 'Mantén el cuerpo en línea recta apoyado en antebrazos y puntas de los pies.' },
    { id: 4, name: 'Zancadas', category: 'fuerza', muscle: 'Piernas y glúteos', durationMin: 10, image: img('fuerza', 'Zancadas'), description: 'Da un paso largo al frente y baja hasta que ambas rodillas formen un ángulo de 90 grados.' },
    { id: 5, name: 'Saltos de tijera', category: 'cardio', muscle: 'Cuerpo completo', durationMin: 6, image: img('cardio', 'Saltos de tijera'), description: 'Salta abriendo piernas y brazos a la vez, y vuelve a la posición inicial.' },
    { id: 6, name: 'Trote suave', category: 'cardio', muscle: 'Piernas y corazón', durationMin: 20, image: img('cardio', 'Trote suave'), description: 'Ritmo constante en el que puedas conversar sin quedarte sin aire.' },
    { id: 7, name: 'Estiramiento de isquiotibiales', category: 'movilidad', muscle: 'Parte trasera del muslo', durationMin: 5, image: img('movilidad', 'Isquiotibiales'), description: 'Sentado con una pierna estirada, inclínate hacia el pie sin rebotar.' },
    { id: 8, name: 'Postura del gato y la vaca', category: 'movilidad', muscle: 'Columna', durationMin: 5, image: img('movilidad', 'Gato y vaca'), description: 'En cuatro apoyos, alterna arquear y redondear la espalda al ritmo de la respiración.' },
];
```
The service filters and **simulates a delay**, so the effect of loading states is noticeable later:

```ts title="features/exercises/services/exercises.service.ts" showLineNumbers
import { EXERCISES } from '../data';
import type { Category, Exercise } from '../types';

// Simulates the delay of a database or a real API
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ExerciseFilters {
    q?: string;
    category?: string;
}

export async function getExercises(filters: ExerciseFilters = {}): Promise<Exercise[]> {
    await delay(800);

    const q = filters.q?.trim().toLowerCase();
    return EXERCISES.filter((exercise) => {
        const matchesText = !q || exercise.name.toLowerCase().includes(q) || exercise.muscle.toLowerCase().includes(q);
        const matchesCategory = !filters.category || exercise.category === (filters.category as Category);
        return matchesText && matchesCategory;
    });
}

export async function getExerciseById(id: number): Promise<Exercise | null> {
    await delay(300);
    return EXERCISES.find((exercise) => exercise.id === id) ?? null;
}
```
:::tip[Why a service]
Components call `getExercises()` without knowing where the data comes from. When you connect a database or your NestJS backend, only this file changes.
:::

---

## 2. Images with `next/image`

An image without care is what slows a page down the most: it weighs too much, it downloads even when it is not visible and, when it loads, it pushes the content down. The `Image` component from Next.js solves all three.

| With the plain HTML tag | With the `Image` component |
| :--- | :--- |
| Always downloads the original image. | Delivers the right size and format for each screen. |
| Downloads even when it is off screen. | Lazy loading: only when it is about to be seen. |
| The page jumps when the photo arrives. | Reserves the space and avoids the jump (*layout shift*). |

**Step 1.** Next only optimizes images from the domains you declare, so nobody can use your server as an optimizer for any site:

```ts title="next.config.ts" showLineNumbers
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        // Next only optimizes images from the domains you declare here
        remotePatterns: [{ protocol: 'https', hostname: 'placehold.co' }],
    },
};

export default nextConfig;
```
:::warning[Restart the server]
`next.config.ts` is only read on startup. Stop `npm run dev` and start it again, or you will keep seeing the *hostname not configured* error.
:::

**Step 2.** The exercise card, with the photo, the name and the category:

```tsx title="features/exercises/components/ExerciseCard.tsx" showLineNumbers
import Image from 'next/image';
import Link from 'next/link';
import { CATEGORIES, type Exercise } from '../types';

export function ExerciseCard({ exercise, priority = false }: { exercise: Exercise; priority?: boolean }) {
    const category = CATEGORIES.find((c) => c.value === exercise.category);

    return (
        <Link
            href={`/exercises/${exercise.id}`}
            className="card bg-base-100 shadow-sm transition-shadow hover:shadow-md"
        >
            <figure className="relative aspect-[4/3]">
                <Image
                    src={exercise.image}
                    alt={exercise.name}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                    priority={priority}
                />
            </figure>

            <div className="card-body gap-1 p-4">
                <h2 className="card-title text-base">{exercise.name}</h2>
                <p className="text-sm opacity-70">{exercise.muscle}</p>
                <div className="mt-1 flex items-center gap-2">
                    <span className="badge badge-secondary badge-sm">{category?.label}</span>
                    <span className="text-xs opacity-70">{exercise.durationMin} min</span>
                </div>
            </div>
        </Link>
    );
}
```
What matters about the properties:

| Property | What it is for |
| :--- | :--- |
| `fill` | The image fills the whole container. The container must have `position: relative` and a size (here `relative aspect-[4/3]`). |
| `sizes` | Tells the browser how much space the image will take at each screen width, so it downloads the right version. |
| `priority` | Loads the image immediately. Use it only on the first ones, those visible when the page opens. |
| `alt` | The text screen readers read. Never leave it empty on an image with content. |

---

## 3. The list: a Server Component that waits for data

In the App Router every component is a server component unless you write `'use client'`. That allows something that was not possible before: **an `async` component that requests its own data directly**.

```tsx title="features/exercises/components/ExerciseGrid.tsx" showLineNumbers
import { getExercises, type ExerciseFilters } from '../services/exercises.service';
import { ExerciseCard } from './ExerciseCard';

export async function ExerciseGrid({ q, category }: ExerciseFilters) {
    const exercises = await getExercises({ q, category });

    if (exercises.length === 0) {
        return (
            <p className="rounded-box border border-dashed border-base-300 p-8 text-center opacity-70">
                No encontramos ejercicios con esos filtros.
            </p>
        );
    }

    return (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {exercises.map((exercise, index) => (
                <li key={exercise.id}>
                    <ExerciseCard exercise={exercise} priority={index < 3} />
                </li>
            ))}
        </ul>
    );
}
```
Notice what is **not** there: no `useEffect`, no `useState`, no hand-written "loading" state. The component waits with `await` and returns ready-made HTML. If the catalog is the slow part of the page, that wait is exactly what we will show with a skeleton in section 5.

And the page that uses it:

```tsx title="app/(app)/exercises/page.tsx" showLineNumbers
import { ExerciseGrid } from '@/features/exercises/components/ExerciseGrid';

export const metadata = { title: 'Ejercicios' };

export default function ExercisesPage() {
    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 className="text-2xl font-bold">Ejercicios</h1>
                <p className="text-sm opacity-70">Elige un ejercicio para ver cómo se hace.</p>
            </header>

            <ExerciseGrid />
        </div>
    );
}
```
Also add the "Exercises" link to your navigation bar in `app/(app)/layout.tsx`:

```tsx title="app/(app)/layout.tsx (fragment)" showLineNumbers
const LINKS = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/exercises', label: 'Ejercicios' },
];
```
Open `http://localhost:3000/exercises`. You will see a blank screen for almost a second and then everything appears at once. We fix that next.

---

## 4. One page per exercise: dynamic routes

A folder in square brackets, `[id]`, is a **dynamic segment**: the same page serves `/exercises/1`, `/exercises/2`… and receives the value in `params`.

```tsx title="app/(app)/exercises/[id]/page.tsx" showLineNumbers
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EXERCISES } from '@/features/exercises/data';
import { ExerciseDetail } from '@/features/exercises/components/ExerciseDetail';
import { getExerciseById } from '@/features/exercises/services/exercises.service';

interface PageProps {
    params: Promise<{ id: string }>;
}

// Tells Next which ids exist so it can generate those pages at build time
export function generateStaticParams() {
    return EXERCISES.map((exercise) => ({ id: String(exercise.id) }));
}

// The tab title comes from the exercise
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const exercise = await getExerciseById(Number(id));
    return { title: exercise ? exercise.name : 'Ejercicio no encontrado' };
}

export default async function ExerciseDetailPage({ params }: PageProps) {
    const { id } = await params;
    const exercise = await getExerciseById(Number(id));

    if (!exercise) notFound();

    return (
        <div className="flex flex-col gap-4">
            <Link href="/exercises" className="btn btn-ghost btn-sm w-fit">
                ← Volver a ejercicios
            </Link>
            <ExerciseDetail exercise={exercise} />
        </div>
    );
}
```
:::warning[`params` is a promise]
Since Next.js 15, `params` and `searchParams` arrive as **promises**: you must write `await params`. If you use `params.id` directly you will see an error or a warning.
:::

The exercise content goes in a separate component, because in part 2 we will reuse it inside a modal:

```tsx title="features/exercises/components/ExerciseDetail.tsx" showLineNumbers
import Image from 'next/image';
import { CATEGORIES, type Exercise } from '../types';

// Shared by the exercise page and the modal opened from the list
export function ExerciseDetail({ exercise }: { exercise: Exercise }) {
    const category = CATEGORIES.find((c) => c.value === exercise.category);

    return (
        <article className="flex flex-col gap-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-box">
                <Image
                    src={exercise.image}
                    alt={exercise.name}
                    fill
                    priority
                    sizes="(min-width: 896px) 896px, 100vw"
                    className="object-cover"
                />
            </div>

            <h1 className="text-2xl font-bold">{exercise.name}</h1>
            <div className="flex flex-wrap items-center gap-2">
                <span className="badge badge-secondary">{category?.label}</span>
                <span className="badge badge-outline">{exercise.muscle}</span>
                <span className="text-sm opacity-70">{exercise.durationMin} minutos</span>
            </div>
            <p>{exercise.description}</p>
        </article>
    );
}
```
Three new features in a single page:

| Function | What it does |
| :--- | :--- |
| `generateStaticParams` | Lists the known ids so Next can prepare those pages in advance. |
| `generateMetadata` | Computes the tab title from the data (`Zancadas | Entrenamiento`). |
| `notFound()` | Interrupts the page and shows the "not found" screen. |

The "not found" screen is a special file. If it is inside `exercises/`, it is only used for that section:

```tsx title="app/(app)/exercises/not-found.tsx" showLineNumbers
import Link from 'next/link';

export default function ExerciseNotFound() {
    return (
        <div className="flex flex-col items-start gap-3">
            <h1 className="text-2xl font-bold">Ese ejercicio no existe</h1>
            <p className="opacity-70">Puede que el enlace esté mal escrito o que lo hayan quitado.</p>
            <Link href="/exercises" className="btn btn-primary btn-sm">
                Ver todos los ejercicios
            </Link>
        </div>
    );
}
```
**Check it:** open `/exercises/4` (it should show Zancadas, and the tab shows its name) and `/exercises/999` (it should show "Ese ejercicio no existe").

---

## 5. Loading states: `loading.tsx` and `Suspense`

The list takes 0.8 seconds. Next offers two tools so people are not left staring at a blank screen. Switch between the three versions of the page and watch what the browser receives:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-15/streaming-suspense/index.html"
  title="What the person sees while data is awaited"
  height={640}
/>

**Option A: `loading.tsx`.** A file with that name inside the folder is shown automatically while the page waits. It covers the **whole** page:

```tsx title="app/(app)/exercises/loading.tsx" showLineNumbers
import { ExerciseGridSkeleton } from '@/features/exercises/components/ExerciseGridSkeleton';

export default function Loading() {
    return (
        <div className="flex flex-col gap-6">
            <div className="skeleton h-8 w-40" />
            <ExerciseGridSkeleton />
        </div>
    );
}
```
The skeleton uses daisyUI's `skeleton` class to draw animated gray boxes shaped like the content:

```tsx title="features/exercises/components/ExerciseGridSkeleton.tsx" showLineNumbers
export function ExerciseGridSkeleton() {
    return (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Cargando ejercicios">
            {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="card bg-base-100 shadow-sm">
                    <div className="skeleton aspect-[4/3] w-full rounded-b-none" />
                    <div className="card-body gap-2 p-4">
                        <div className="skeleton h-4 w-2/3" />
                        <div className="skeleton h-3 w-1/3" />
                    </div>
                </li>
            ))}
        </ul>
    );
}
```
**Option B: `<Suspense>`.** It wraps **only** the slow part. The title appears right away and only the list waits:

```tsx title="app/(app)/exercises/page.tsx (with Suspense)" showLineNumbers
import { Suspense } from 'react';
import { ExerciseGrid } from '@/features/exercises/components/ExerciseGrid';
import { ExerciseGridSkeleton } from '@/features/exercises/components/ExerciseGridSkeleton';

export const metadata = { title: 'Ejercicios' };

export default function ExercisesPage() {
    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 className="text-2xl font-bold">Ejercicios</h1>
                <p className="text-sm opacity-70">Elige un ejercicio para ver cómo se hace.</p>
            </header>

            <Suspense fallback={<ExerciseGridSkeleton />}>
                <ExerciseGrid />
            </Suspense>
        </div>
    );
}
```
| | `loading.tsx` | `<Suspense>` |
| :--- | :--- | :--- |
| What it covers | The whole page | Only the piece it wraps |
| When to use it | Navigating between pages | A slow part inside a page |
| Effort | Create a file | Write the tag |

The **streaming** technique is behind this: the server first sends what it already has and, when the data is ready, it sends the rest over the same connection.

---

## 6. Filters that live in the URL

Where do we store the search text and the chosen category? The first idea is `useState`, but it has three flaws: it is lost on reload, it cannot be shared and the server does not know about it. The alternative is to store it **in the URL**: `/exercises?category=cardio&q=salt`.

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-15/url-como-estado/index.html"
  title="Filters live in the URL"
  height={640}
/>

There are two parts: the **client** changes the URL and the **server** reads it.

**Step 1: the page reads `searchParams`.** It is a promise, just like `params`:

```tsx title="app/(app)/exercises/page.tsx (final version)" showLineNumbers
import { Suspense } from 'react';
import { ExerciseFilters } from '@/features/exercises/components/ExerciseFilters';
import { ExerciseGrid } from '@/features/exercises/components/ExerciseGrid';
import { ExerciseGridSkeleton } from '@/features/exercises/components/ExerciseGridSkeleton';

interface PageProps {
    searchParams: Promise<{ q?: string; category?: string }>;
}

export const metadata = { title: 'Ejercicios' };

export default async function ExercisesPage({ searchParams }: PageProps) {
    const { q, category } = await searchParams;

    return (
        <div className="flex flex-col gap-6">
            <header>
                <h1 className="text-2xl font-bold">Ejercicios</h1>
                <p className="text-sm opacity-70">Elige un ejercicio para ver cómo se hace.</p>
            </header>

            <ExerciseFilters />

            {/* The key restarts Suspense on every search and shows the skeleton again */}
            <Suspense key={`${q ?? ''}|${category ?? ''}`} fallback={<ExerciseGridSkeleton />}>
                <ExerciseGrid q={q} category={category} />
            </Suspense>
        </div>
    );
}
```
:::tip[What the `key` is for]
Without it, `Suspense` only shows the skeleton the first time. When the `key` changes, React treats it as a new component and shows the skeleton again on every search.
:::

**Step 2: a client component changes the URL.** It needs hooks (`useRouter`, `useSearchParams`), so it carries `'use client'`:

```tsx title="features/exercises/components/ExerciseFilters.tsx" showLineNumbers
'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CATEGORIES } from '../types';

export function ExerciseFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const category = searchParams.get('category') ?? '';
    const urlText = searchParams.get('q') ?? '';
    const [text, setText] = useState(urlText);

    // Changes one URL parameter and keeps the others
    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        startTransition(() => router.replace(`${pathname}?${params.toString()}`));
    };

    // Waits 300 ms after the last key before searching (debounce)
    useEffect(() => {
        if (text === urlText) return;
        const timer = setTimeout(() => updateParam('q', text), 300);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text]);

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="input input-bordered flex w-full items-center gap-2 sm:max-w-xs">
                <span className="sr-only">Buscar ejercicio</span>
                <input
                    type="search"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Buscar ejercicio o músculo"
                    className="grow"
                />
                {isPending && <span className="loading loading-spinner loading-xs" />}
            </label>

            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
                <button
                    type="button"
                    onClick={() => updateParam('category', '')}
                    className={`btn btn-sm ${category === '' ? 'btn-primary' : 'btn-outline'}`}
                >
                    Todos
                </button>
                {CATEGORIES.map((c) => (
                    <button
                        key={c.value}
                        type="button"
                        onClick={() => updateParam('category', c.value)}
                        className={`btn btn-sm ${category === c.value ? 'btn-primary' : 'btn-outline'}`}
                    >
                        {c.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
```
What each piece does:

| Piece | Why it is there |
| :--- | :--- |
| `router.replace` | Changes the URL **without** adding a history entry for each typed letter (with `push`, the back button would have to go back letter by letter). |
| 300 ms *debounce* | Does not fire a search on every key: it waits until the person stops typing. |
| `useTransition` | Marks the URL change as non-urgent and provides `isPending` to show a *spinner* without blocking typing. |
| `<span className="sr-only">` | An invisible label for screen readers (and for the tests in the next guide). |

**Check it:** press "Cardio", see the URL change, reload the page and verify the filter is still there. Copy the link into another tab: you will see the same list.

---

## Common errors in this part

| Symptom | Cause | Fix |
| :--- | :--- | :--- |
| `hostname "placehold.co" is not configured under images` | `remotePatterns` is missing or you did not restart. | Add the domain in `next.config.ts` and restart `npm run dev`. |
| The image is not visible and the container is 0 tall | You used `fill` in a container without position or size. | Give it `relative` and a height or `aspect-[4/3]`. |
| `Property 'id' does not exist on type 'Promise<...>'` | You used `params.id` without `await`. | `const { id } = await params`. |
| `Cannot find name 'PageProps'` or `LayoutProps` | The global types have not been generated yet. | Run `npm run dev` or `npm run build` once. |
| Filters apply but the skeleton does not reappear | The `key` on `Suspense` is missing. | Use a `key` built from the filter values. |
| `useSearchParams` causes a build error | It is used in a client component without `Suspense` on a static page. | Keep the page dynamic (use `await searchParams`) or wrap the component in `Suspense`. |

## Challenges

1. Add a filter by **duration** (up to 5 minutes, up to 10 minutes) that also lives in the URL.
2. Show a different badge on the card depending on the category, using the brand color.
3. Replace `router.replace` with `router.push` and check how the back button behaves while typing.

**Next:** [part 2: routines, forms and metadata](./02-next-avanzado-parte-2.md).
