---
sidebar_position: 2
description: "Error handling in Next.js: expected and unexpected errors, the journey of an error in the login with Redux and Server Actions, error.tsx and global-error.tsx, notFound, redirect, unauthorized and forbidden."
---

# Error handling in Next.js

In the [previous document](./01-sesiones-en-nextjs.md) we built the login with a session and protected routes, but we almost always assumed everything goes well. In a real application things fail all the time: the user gets the password wrong, the data service goes down, someone opens a routine that does not exist. What matters is that **every failure reaches the screen in a controlled way**, with a message the user understands, without breaking the rest of the page.

This document answers three questions:

1. What **kinds of error** are there and which mechanism fits each one?
2. How does an error travel through the login chain (`LoginForm` → hook → thunk → Server Action → use case)?
3. What does Next.js do when an error happens **while rendering** a page (`error.tsx`, `global-error.tsx`, `not-found.tsx`)?

It follows the [official Next.js error handling documentation](https://nextjs.org/docs/app/getting-started/error-handling), applied to the course architecture.

---

## 1. Two kinds of error

The Next.js guide splits errors into two groups, and each group is handled differently:

| | **Expected** | **Unexpected** |
| :--- | :--- | :--- |
| **What they are** | Foreseen failures: form validation, wrong credentials, a resource that does not exist. | Bugs or external failures: an exception in the code, a service that is down, the network. |
| **How they are handled** | They are **returned as a value** and shown in the interface. | They are **thrown** (`throw`) and caught by an *error boundary* or a `try/catch`. |
| **Example** | `return { ok: false, message: 'Credenciales inválidas' }` | The backend responds 500 and the datasource throws an exception. |

There is also a third group: functions that **throw on purpose** to control the flow (`redirect()`, `notFound()`, `unauthorized()`, `forbidden()`). They are not program errors: they are commands that Next.js understands and turns into a redirect or a special page.

Pick what failed in your routines application and see which mechanism applies, where it happens and what the user sees:

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/manejo-de-errores/index.html"
  title="Error handling in Next.js: expected, unexpected and helpers such as redirect and notFound"
  height={820}
/>

The practical rule that the piece summarizes:

| Situation | Mechanism | Result |
| :--- | :--- | :--- |
| Validation or wrong credentials | `return { ok: false, message }` in the action | The thunk turns it into `rejectWithValue` and the form shows `errorMessage`. |
| A bug or a service that is down while rendering a page | An exception (`throw`) | The segment's `error.tsx`, with `retry()`. |
| Failure of an action called from a thunk | `try/catch` in the thunk | `errorMessage` in the store. |
| No session | `redirect('/login')` | Navigates to the login page. |
| No session, with its own page (experimental) | `unauthorized()` | `unauthorized.tsx`, status 401. |
| No permission (experimental) | `forbidden()` | `forbidden.tsx`, status 403. |
| The resource does not exist | `notFound()` | `not-found.tsx`, status 404. |
| Failure in an `onClick` | `try/catch` and `useState` | A boundary does not catch it (nor asynchronous code). |

---

## 2. Expected errors: return them as a value

A mistyped email is not a program failure: it is something you knew could happen. For those situations the Server Action **does not throw an exception**: it returns an object that describes the result. That is why `loginAction` returns `{ ok: true, user }` or `{ ok: false, message }`.

```ts title="src/features/auth/presentation/actions/auth.actions.ts (excerpt)" showLineNumbers
const tokens = await authContainer.login.execute(parsed.data.email, parsed.data.password)
if (!tokens) {
  return { ok: false, message: 'Credenciales inválidas' } // expected: it is returned
}
```

Why not a `throw`? There are two reasons:

- **The message would be lost.** When a server function throws an exception, Next.js in production **hides the error text** from the client (for security, so internal details do not leak) and only sends an identifier. What does travel intact is a returned value.
- **It is the normal flow, not an emergency.** The user got the password wrong: they should see the message next to the form and be able to try again, not an error screen.

That distinction starts **in the datasource**. When the backend responds, not all codes are equal:

| Backend response | Type | What the datasource does |
| :--- | :--- | :--- |
| `401` (invalid credentials) | Expected | Returns `null`; the action responds `{ ok: false, message }`. |
| `500`, or no response | Unexpected | Throws an error (`throw new Error('El backend no respondió')`). |

In our architecture the returned value follows a fixed path to the interface:

| Step | What happens |
| :--- | :--- |
| `loginAction` | Returns `{ ok: false, message }`. |
| Thunk `loginMutation` | Sees `ok: false` and calls `rejectWithValue(message)`. |
| Slice | On `rejected`, stores the text in `state.errorMessage`. |
| `useAuth()` | Exposes `errorMessage`. |
| `LoginForm` | Shows it with `{errorMessage && <p role="alert">…</p>}`. |

:::note[How the official guide would do it]
With `<form action>` and `useActionState`, the action receives `(prevState, formData)`, returns `{ message }` and the component reads it from `state`: `const [state, action, pending] = useActionState(login, initialState)`. The principle is the same (the expected error is a value); only who stores it changes: the component instead of the slice.
:::

The message's `role="alert"` attribute makes screen readers announce it as soon as it appears. It is part of showing an error well: that **everyone** perceives it.

---

## 3. The journey of an error in your login

An expected error has a clear path. But what happens when something fails that nobody foresaw? Pick a failure with the "Qué falla" (What fails) selector and follow its journey, from right to left, to the message Ana reads.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/viaje-del-error/index.html"
  title="The journey of an error in the login: invalid credentials, backend down and network down"
  height={560}
/>

What the piece shows:

- **The three cases end in the same place:** the form message. None reaches `error.tsx`.
- **The thunk is the place to catch the unexpected.** Asynchronous code (a thunk, an `onClick`) is **not covered by any error boundary**: boundaries only catch errors during *rendering*. That is why the thunk has a `try/catch`.
- **`createAsyncThunk` already catches exceptions** for you: if the thunk throws, Redux Toolkit dispatches the `rejected` action with the error. The explicit `try/catch` is for choosing **your own message** instead of a technical one.
- **What the user sees and what you see are different.** An unexpected error should show Ana a generic message ("No se pudo iniciar sesión. Intenta de nuevo.") and leave the real detail in the server logs.

```ts title="src/features/auth/presentation/store/auth.slice.ts (excerpt)" showLineNumbers
export const loginMutation = createAsyncThunk(
  'auth/login',
  async (params: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const result = await loginAction(params.email, params.password)
      if (!result.ok) return rejectWithValue(result.message) // expected: it arrived as a value
      return result.user
    } catch {
      return rejectWithValue('No se pudo iniciar sesión. Intenta de nuevo.') // unexpected
    }
  }
)
```

How to read it: line 6 handles the **foreseen failure** (the action responded that something was wrong). The `catch` block handles the **unforeseen** one (the call to the action failed: server down, lost network, uncaught exception). In both cases the result is the same for the user: an `errorMessage`.

:::warning[An `onClick` is not protected either]
The same goes for any event handler: if it fails, no boundary sees it. Use `try/catch` and store the error in the state (`setError(e.message)`). The exception is `startTransition`: its uncaught errors **do** bubble up to the nearest error boundary.
:::

---

## 4. Unexpected errors while rendering: `error.tsx`

Everything above happened in code that **calls** something. But what if a page fails **while it renders**? For example, `RoutinesPage` requests the routines, the datasource throws an exception and the page cannot be drawn. That is where Next.js's **error boundary** comes in: the `error.tsx` file.

An `error.tsx` is a client component that Next.js shows **instead of** the part of the screen that failed. The layouts above it stay visible: the user does not lose the menu or the rest of the page.

```tsx title="app/routines/error.tsx" showLineNumbers
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error) // the error logging would go here
  }, [error])

  return (
    <div role="alert" className="flex flex-col gap-3">
      <h2>No pudimos cargar tus rutinas</h2>
      <button className="btn" onClick={() => retry()}>Reintentar</button>
    </div>
  )
}
```

How to read it: it must be `'use client'` (error boundaries are client components). It receives the `error` and a `retry()` function that **tries to render the segment again**. The `useEffect` is the place to log the error.

### Which `error.tsx` is shown?

Each `app/` folder can have its own `error.tsx`. What matters is **which one catches what**: an `error.tsx` wraps the page and the routes below it, but **not** the `layout.tsx` of its own folder (the layout is outside it). Pick where the error is thrown and see which one catches it:

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/error-boundaries-segmentos/index.html"
  title="Which error.tsx catches an error depending on where it is thrown"
  height={780}
/>

| Thrown in… | Caught by | What the user sees |
| :--- | :--- | :--- |
| A segment's page | That segment's `error.tsx` | The layouts stay on screen; only the page is replaced. |
| A segment's layout | The `error.tsx` of the folder above | That segment's layout and everything it contains is replaced. |
| The root layout (`app/layout.tsx`) | `app/global-error.tsx` | The whole page is replaced. |
| The `error.tsx` itself | The `error.tsx` of the upper level | An error boundary does not catch itself. |
| A segment without `error.tsx` | The nearest one upwards | The error "bubbles up". |

There is a special file for the root layout. Since it replaces **the whole** page, it must include its own `<html>` and `<body>` tags:

```tsx title="app/global-error.tsx" showLineNumbers
'use client'

export default function GlobalError({ retry }: { error: Error; retry: () => void }) {
  return (
    <html>
      <body>
        <h2>Algo salió mal</h2>
        <button onClick={() => retry()}>Reintentar</button>
      </body>
    </html>
  )
}
```

:::note[`retry` or `reset`]
In earlier versions of Next.js the `error.tsx` prop was called `reset`; the current documentation uses `retry`. If your project uses another version, check which one it receives.
:::

:::tip[A fallback inside a component]
If you only want to protect **a part** of a page (a widget), without creating a segment, Next.js offers `catchError` (from `next/error`): it wraps a component and defines its own fallback.
:::

---

## 5. Errors thrown on purpose

Some situations are not "errors" but **flow decisions**: there is no session, you have no permission, the resource does not exist. Next.js offers functions that throw a special exception and turn it into the right response. Each one has a convention file to customize what the user sees:

| Function | When | Result | File |
| :--- | :--- | :--- | :--- |
| `redirect('/login')` | There is no session (or any redirect). | Navigates to another route. | — |
| `notFound()` | The resource does not exist. | Status 404. | `not-found.tsx` |
| `unauthorized()` | There is no session and you want your own page. | Status 401. | `unauthorized.tsx` |
| `forbidden()` | There is a session but no permission. | Status 403. | `forbidden.tsx` |

`unauthorized()` and `forbidden()` are **experimental**: they must be enabled in `next.config.ts`.

```ts title="next.config.ts" showLineNumbers
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
}

export default nextConfig
```

Example with the routine that does not exist and the one that belongs to another user:

```tsx title="app/routines/[id]/page.tsx" showLineNumbers
import { notFound, forbidden } from 'next/navigation'
import { requireSession } from '@/lib/dal'

export default async function RoutinePage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await requireSession()  // no session: redirect('/login')
  const { id } = await params

  const routine = await getRoutine(id)
  if (!routine) notFound()                  // does not exist: 404
  if (routine.ownerId !== userId) forbidden() // belongs to someone else: 403

  return <RoutineView routine={routine} />
}
```

```tsx title="app/routines/[id]/not-found.tsx" showLineNumbers
export default function NotFound() {
  return <p>No encontramos esa rutina.</p>
}
```

:::warning[Do not put them in a `try/catch`]
`redirect()`, `notFound()`, `unauthorized()` and `forbidden()` work by **throwing** an exception. If you call them inside a `try/catch`, the `catch` swallows them and neither the redirect happens nor the page appears. Call them outside the `try`, or rethrow the error with `unstable_rethrow(error)` (from `next/navigation`). Also do not write `return notFound()`: the function never returns anything, it stops execution.
:::

---

## 6. What the user sees and what you see

Good error handling separates two audiences:

| | Message to the user | Log for you |
| :--- | :--- | :--- |
| **Expected error** | Specific and actionable: "Credenciales inválidas", "La contraseña debe tener al menos 6 caracteres". | Usually not needed. |
| **Unexpected error** | Generic: "No se pudo iniciar sesión. Intenta de nuevo." Never the text of an exception. | The full detail: what failed and where. |
| **Security** | It must not reveal information: do not say "that email does not exist" (it tells an attacker which emails are registered). | You can log the attempt. |

In production, Next.js already helps you: the message of an error thrown on the server is **replaced with a generic one** and a `digest` (an identifier) is attached. That same `digest` appears in the server logs, so you can relate what the user saw to what happened. In `error.tsx` you receive it in `error.digest`.

---

## Summary

| I want to… | I use |
| :--- | :--- |
| Show "invalid credentials" in the form | `return { ok: false, message }` + `rejectWithValue` + `errorMessage`. |
| Keep an unexpected failure from breaking the form | `try/catch` in the thunk. |
| Make a failure while rendering show an error screen | `error.tsx` in the segment (and `global-error.tsx` for the root layout). |
| Redirect someone without a session | `redirect('/login')` in the DAL. |
| Show my own 404 / 401 / 403 page | `notFound()` / `unauthorized()` / `forbidden()` + its file. |
| Keep an `onClick` error from passing silently | `try/catch` and `setError(...)`. |
