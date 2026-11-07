---
sidebar_position: 1
description: "Guía paso a paso, parte 1: sobre el proyecto de la semana 13 construimos una app de ejercicios con imágenes optimizadas, rutas dinámicas, estados de carga con Suspense y filtros guardados en la URL."
---

# Next.js avanzado, parte 1: ejercicios, imágenes y carga

Hasta ahora tu proyecto tiene login, una sesión con Zustand y un dashboard. En estas dos guías le agregamos una **app de ejercicios y rutinas** y, de paso, vemos las funciones de Next.js que hacen que una aplicación se sienta profesional: imágenes optimizadas, páginas que cargan por partes, filtros que se pueden compartir, formularios que validan en el servidor, ventanas modales con URL propia, temas guardados y vista previa al compartir un enlace.

**Esta parte (1)** construye el catálogo de ejercicios. La [parte 2](./02-next-avanzado-parte-2.md) agrega las rutinas.

:::note[Punto de partida]
Parte de la rama [`week-13/next-zustand`](https://github.com/Kelocoes/interfaces-3-202602/tree/week-13/next-zustand) o de tu propio proyecto de la [semana 13](../semana-13/05-caso-practico-sesion-y-notificaciones.md). Necesitas el login, el `AuthGuard`, el layout `app/(app)/layout.tsx` y daisyUI funcionando. Las rutas nuevas van dentro de `app/(app)/`, así quedan protegidas por la sesión.
:::

## Lo que vas a construir

| Parte | Tema de Next.js | Qué verás en la app |
| :--- | :--- | :--- |
| 1 | Server Components y servicios | Lista de ejercicios que se lee en el servidor |
| 1 | `next/image` | Fotos que se optimizan solas |
| 1 | Rutas dinámicas, `generateMetadata`, `not-found` | Una página por ejercicio con su título |
| 1 | `loading.tsx` y `Suspense` | Esqueletos mientras llegan los datos |
| 1 | `searchParams` | Búsqueda y filtros que viven en la URL |
| 2 | Route Handlers | Una API propia en `/api/routines` |
| 2 | Server Actions, `useActionState` | Formulario "Nueva rutina" validado en el servidor |
| 2 | `useOptimistic` | Casillas que responden al instante |
| 2 | Rutas paralelas e interceptadas | Detalle del ejercicio en un modal |
| 2 | Cookies, `next/font`, metadatos | Tema claro/oscuro, tipografía y vista previa al compartir |

---

## 1. Los datos y el servicio

Antes de pintar nada necesitamos datos. En un proyecto real vendrían de una base de datos; aquí viven en un archivo, pero los leemos **a través de un servicio** para que cambiar el origen después no obligue a tocar las pantallas.

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

Para las fotos usamos [placehold.co](https://placehold.co), que genera imágenes con el texto y el color que le pidas, sin tener que descargar nada:

```ts title="features/exercises/data.ts" showLineNumbers
import type { Category, Exercise } from './types';

// Colores de la marca por categoría (sin el #)
const COLORS: Record<Category, string> = { fuerza: '5454e9', cardio: 'e9683b', movilidad: '4cb979' };

// Imagen de relleno: tamaño, color de fondo y de texto, formato y el texto que muestra
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

El servicio filtra y **simula una demora**, para que más adelante se note el efecto de los estados de carga:

```ts title="features/exercises/services/exercises.service.ts" showLineNumbers
import { EXERCISES } from '../data';
import type { Category, Exercise } from '../types';

// Simula la demora de una base de datos o de una API real
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

:::tip[Por qué un servicio]
Los componentes llaman a `getExercises()` sin saber de dónde salen los datos. Cuando conectes una base de datos o tu backend de NestJS, solo cambia este archivo.
:::

---

## 2. Imágenes con `next/image`

Una imagen sin cuidado es lo que más hace lenta una página: pesa demasiado, se descarga aunque no se vea y, al cargar, empuja el contenido hacia abajo. El componente `Image` de Next.js resuelve las tres cosas.

| Con la etiqueta HTML normal | Con el componente `Image` |
| :--- | :--- |
| Descarga siempre la imagen original. | Entrega el tamaño y el formato adecuados a cada pantalla. |
| Se descarga aunque esté fuera de la pantalla. | Carga perezosa: solo cuando está por verse. |
| La página salta cuando llega la foto. | Reserva el espacio y evita el salto (*layout shift*). |

**Paso 1.** Next solo optimiza las imágenes de los dominios que declares, para que nadie use tu servidor como optimizador de cualquier sitio:

```ts title="next.config.ts" showLineNumbers
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        // Next solo optimiza imágenes de los dominios que declares aquí
        remotePatterns: [{ protocol: 'https', hostname: 'placehold.co' }],
    },
};

export default nextConfig;
```

:::warning[Reinicia el servidor]
`next.config.ts` solo se lee al arrancar. Detén `npm run dev` y vuelve a iniciarlo, o seguirás viendo el error *hostname not configured*.
:::

**Paso 2.** La tarjeta del ejercicio, con la foto, el nombre y la categoría:

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

Lo importante de las propiedades:

| Propiedad | Para qué sirve |
| :--- | :--- |
| `fill` | La imagen ocupa todo el contenedor. El contenedor debe tener `position: relative` y un tamaño (aquí `relative aspect-[4/3]`). |
| `sizes` | Le dice al navegador cuánto ocupará la imagen en cada ancho de pantalla, para que descargue la versión justa. |
| `priority` | Carga la imagen de inmediato. Úsalo solo en las primeras, las que se ven al abrir la página. |
| `alt` | El texto que leen los lectores de pantalla. Nunca lo dejes vacío en una imagen con contenido. |

---

## 3. La lista: un Server Component que espera datos

En el App Router, todo componente es de servidor salvo que escribas `'use client'`. Eso permite algo que antes no se podía: **un componente `async` que pide sus datos directamente**.

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

Fíjate en lo que **no** hay: ni `useEffect`, ni `useState`, ni estado de "cargando" escrito a mano. El componente espera con `await` y devuelve HTML ya listo. Si el catálogo es la parte lenta de la página, esa espera es justo lo que vamos a mostrar con un esqueleto en la sección 5.

Y la página que lo usa:

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

Agrega también el enlace "Ejercicios" a tu barra de navegación en `app/(app)/layout.tsx`:

```tsx title="app/(app)/layout.tsx (fragmento)" showLineNumbers
const LINKS = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/exercises', label: 'Ejercicios' },
];
```

Abre `http://localhost:3000/exercises`. Verás la pantalla en blanco casi un segundo y luego todo aparece de golpe. Lo arreglamos a continuación.

---

## 4. Una página por ejercicio: rutas dinámicas

Una carpeta entre corchetes, `[id]`, es un **segmento dinámico**: la misma página sirve para `/exercises/1`, `/exercises/2`… y recibe el valor en `params`.

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

// Le dice a Next qué ids existen para generar esas páginas al hacer el build
export function generateStaticParams() {
    return EXERCISES.map((exercise) => ({ id: String(exercise.id) }));
}

// El título de la pestaña sale del ejercicio
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

:::warning[`params` es una promesa]
Desde Next.js 15, `params` y `searchParams` llegan como **promesas**: hay que escribir `await params`. Si usas `params.id` directamente verás un error o una advertencia.
:::

El contenido del ejercicio va en un componente aparte, porque en la parte 2 lo reutilizaremos dentro de un modal:

```tsx title="features/exercises/components/ExerciseDetail.tsx" showLineNumbers
import Image from 'next/image';
import { CATEGORIES, type Exercise } from '../types';

// Lo comparten la página del ejercicio y el modal que se abre desde la lista
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

Tres funciones nuevas en una sola página:

| Función | Qué hace |
| :--- | :--- |
| `generateStaticParams` | Lista los ids conocidos para que Next pueda preparar esas páginas por adelantado. |
| `generateMetadata` | Calcula el título de la pestaña a partir de los datos (`Zancadas | Entrenamiento`). |
| `notFound()` | Interrumpe la página y muestra la pantalla de "no encontrado". |

La pantalla de "no encontrado" es un archivo especial. Si está dentro de `exercises/`, solo se usa para esa sección:

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

**Compruébalo:** entra a `/exercises/4` (debe verse Zancadas, y la pestaña dice su nombre) y a `/exercises/999` (debe verse "Ese ejercicio no existe").

---

## 5. Estados de carga: `loading.tsx` y `Suspense`

La lista tarda 0,8 segundos. Next ofrece dos herramientas para no dejar a la persona mirando una pantalla en blanco. Cambia entre las tres versiones de la página y observa qué recibe el navegador:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-15/streaming-suspense/index.html"
  title="Qué ve la persona mientras se esperan los datos"
  height={640}
/>

**Opción A: `loading.tsx`.** Un archivo con ese nombre dentro de la carpeta se muestra automáticamente mientras la página espera. Cubre **toda** la página:

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

El esqueleto usa la clase `skeleton` de daisyUI para dibujar cajas grises animadas con la forma del contenido:

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

**Opción B: `<Suspense>`.** Envuelve **solo** la parte lenta. El título y los filtros aparecen enseguida y únicamente la lista espera:

```tsx title="app/(app)/exercises/page.tsx (con Suspense)" showLineNumbers
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
| Qué cubre | Toda la página | Solo el pedazo que envuelve |
| Cuándo usarlo | Cambiar de página | Una parte lenta dentro de una página |
| Esfuerzo | Crear un archivo | Escribir la etiqueta |

La técnica de **streaming** es lo que hay detrás: el servidor envía primero lo que ya tiene y, cuando los datos están listos, manda el resto por la misma conexión.

---

## 6. Filtros que viven en la URL

¿Dónde guardar el texto de búsqueda y la categoría elegida? La primera idea es `useState`, pero tiene tres defectos: se pierde al recargar, no se puede compartir y el servidor no lo conoce. La alternativa es guardarlo **en la URL**: `/exercises?category=cardio&q=salt`.

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-15/url-como-estado/index.html"
  title="Los filtros viven en la URL"
  height={640}
/>

Hay dos partes: el **cliente** cambia la URL y el **servidor** la lee.

**Paso 1: la página lee `searchParams`.** Es una promesa, igual que `params`:

```tsx title="app/(app)/exercises/page.tsx (versión final)" showLineNumbers
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

            {/* La key reinicia el Suspense en cada búsqueda y vuelve a mostrar el esqueleto */}
            <Suspense key={`${q ?? ''}|${category ?? ''}`} fallback={<ExerciseGridSkeleton />}>
                <ExerciseGrid q={q} category={category} />
            </Suspense>
        </div>
    );
}
```

:::tip[Para qué sirve la `key`]
Sin ella, `Suspense` solo muestra el esqueleto la primera vez. Al cambiar la `key`, React lo trata como un componente nuevo y vuelve a mostrar el esqueleto en cada búsqueda.
:::

**Paso 2: un componente de cliente cambia la URL.** Necesita hooks (`useRouter`, `useSearchParams`), por eso lleva `'use client'`:

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

    // Cambia un parámetro de la URL y conserva los demás
    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        startTransition(() => router.replace(`${pathname}?${params.toString()}`));
    };

    // Espera 300 ms desde la última tecla antes de buscar (debounce)
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

Qué hace cada pieza:

| Pieza | Por qué está |
| :--- | :--- |
| `router.replace` | Cambia la URL **sin** agregar una entrada al historial por cada letra escrita (con `push`, el botón "atrás" tendría que retroceder letra por letra). |
| *debounce* de 300 ms | No lanza una búsqueda en cada tecla: espera a que la persona deje de escribir. |
| `useTransition` | Marca el cambio de URL como no urgente y da `isPending` para mostrar un *spinner* sin bloquear la escritura. |
| `<span className="sr-only">` | Una etiqueta invisible para lectores de pantalla (y para las pruebas de la siguiente guía). |

**Compruébalo:** pulsa "Cardio", mira que la URL cambie, recarga la página y comprueba que el filtro sigue. Copia el enlace en otra pestaña: verás la misma lista.

---

## Errores comunes de esta parte

| Síntoma | Causa | Solución |
| :--- | :--- | :--- |
| `hostname "placehold.co" is not configured under images` | Falta `remotePatterns` o no reiniciaste. | Agrega el dominio en `next.config.ts` y reinicia `npm run dev`. |
| La imagen no se ve y el contenedor mide 0 | Usaste `fill` en un contenedor sin posición ni tamaño. | Dale `relative` y una altura o `aspect-[4/3]`. |
| `Property 'id' does not exist on type 'Promise<...>'` | Usaste `params.id` sin `await`. | `const { id } = await params`. |
| `Cannot find name 'PageProps'` o `LayoutProps` | Los tipos globales aún no se generaron. | Ejecuta `npm run dev` o `npm run build` una vez. |
| Los filtros se aplican pero el esqueleto no reaparece | Falta la `key` en el `Suspense`. | Usa `key` con los valores de los filtros. |
| `useSearchParams` provoca un error en el build | Se usa en un componente de cliente sin `Suspense` en una página estática. | Mantén la página dinámica (usa `await searchParams`) o envuelve el componente en `Suspense`. |

## Retos

1. Agrega un filtro por **duración** (hasta 5 minutos, hasta 10 minutos) y que también viva en la URL.
2. Muestra en la tarjeta una insignia distinta según la categoría usando el color de la marca.
3. Cambia `router.replace` por `router.push` y comprueba cómo se comporta el botón "atrás" al escribir.

**Siguiente:** [parte 2: rutinas, formularios y metadatos](./02-next-avanzado-parte-2.md).
