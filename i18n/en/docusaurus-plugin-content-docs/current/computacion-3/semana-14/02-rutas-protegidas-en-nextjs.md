---
sidebar_position: 2
description: "How to protect routes and actions in Next.js with three independent layers: proxy.ts, the DAL with requireSession and requirePermission, and Server Actions. Includes permissions in the token, splitting the page into server and client, and the limits of what the front end can guarantee."
---

# Protected routes in Next.js

In the [previous document](./01-sesiones-en-nextjs.md) we built the session: the user signs in, the token stays in an `httpOnly` cookie and the interface knows who they are. But **having a session is worthless if anyone can type `/routines` in the address bar**, or send a POST to a Server Action without going through your interface.

Protecting a route means deciding, **on every request**, whether the user can see that content or run that action. A single door is not enough: this document builds three, each one on its own. By the end you will know:

1. **What each layer checks** (the proxy, the DAL and the Server Actions) and what it **cannot** do.
2. **How permissions travel** inside the token and who uses them for what.
3. **How to write** `requireSession`, `requirePermission`, `proxy.ts` and the actions that require a permission.
4. **Why** the routines page is split into a server page and a client view.
5. **What the front end guarantees and what it does not**: hiding a button is not protecting, and the token's signature is verified by the backend.

What happens when something fails (a missing permission, a backend that is down) has its own document: [Error handling in Next.js](./03-manejo-de-errores-nextjs.md).

---

## 1. Three doors, not one

Follow a request through the three layers. Pick a request type in the selector and see where it stops: without a cookie, without permission, with a tampered cookie, and a direct POST to an action.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/capas-de-defensa/index.html"
  title="Three layers of defense for a protected route: proxy, DAL and Server Actions"
  height={680}
/>

| Layer | What it checks | What it CANNOT do |
| :--- | :--- | :--- |
| **`proxy.ts`** | That there is a decodable, valid token, before rendering. It is fast and does not query the backend. | It does not verify the signature or look at fine-grained permissions. It is an "optimistic" check. |
| **The DAL** (`requireSession`, `requirePermission`) | The same, but **next to the page or the data**, and it also checks the permission. | It does not verify the signature. The final decision belongs to the backend. |
| **Each Server Action** | That the caller has a session and the permission, on its own. | It does not inherit what the page that uses it checks. |

A Server Action is a public endpoint: someone can send it a POST without going through your interface. That is why **each action requires its permission**, even if the proxy and the page already did.

The front end can decode the token, so it decides quickly, with no requests, what to show and where to redirect. But it **does not verify the signature**: the backend remains the one that verifies the token on every call and decides the real permissions.

---

## 2. Permissions travel inside the token

The token issued by the backend does not only say who you are: it also carries your **role** and the list of **permissions** you have. In the course, the mock signs a JWT like this:

```json title="Content of Ana's token (decoded)"
{
  "sub": "1",
  "name": "Ana Pérez",
  "role": "USER",
  "permissions": ["view_routines"],
  "exp": 1793500000
}
```

This guide protects with **permissions**, not roles: an action such as "create a routine" asks `do you have create_routines?`, not `are you ADMIN?`. It is more flexible (two roles can share a permission) and what changes when you add a feature is a string, not a condition written in several places. The `role` travels in the token, but no guard uses it.

| User | Role | Permissions |
| :--- | :--- | :--- |
| `ana@icesi.edu.co` | `USER` | `view_routines` |
| `admin@icesi.edu.co` | `ADMIN` | `view_routines`, `create_routines` |
| Anyone who registers | `USER` | `view_routines` |

Each layer reads the same data, but for different purposes. Pick a case and follow what each one does with the permissions:

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/permisos-por-capa/index.html"
  title="What each layer does with the token's permissions: the interface, the proxy, the page and the action"
  height={760}
/>

The key difference:

| | `hasPermission()` (in `useAuth`) | `requirePermission()` (in the DAL) |
| :--- | :--- | :--- |
| **Where it runs** | In the browser | On the server |
| **Where it reads from** | Redux (the hydrated user) | The cookie, on every request |
| **What for** | **Showing or hiding** (for example the form) | **Preventing** access |
| **If it fails** | It returns `false` | It throws an exception |

:::warning[Hiding is not protecting]
Hiding the create-routine form improves the experience, but anyone can send the request by hand. The front end's permissions are **for the interface only**; what prevents the routine from being created is `createRoutineAction` rejecting it on the server.
:::

:::note[The token can be out of date]
The token's permissions are valid until it expires: if a user loses a permission, their old token still says the previous thing. If you need **fresh** data, ask the backend (for example `GET /auth/me` with the token); it costs a request, so do it only where it matters. With the course mock, sign out and sign back in to see a permission change.
:::

---

## 3. Where each file goes

This piece is the same one from the previous guide, opened on its third phase: it shows the files the guards add.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/estructura-auth/index.html#fase=3"
  title="Folder structure of the project with the guards: token.ts, dal.ts, proxy.ts and the routines actions"
  height={1200}
/>

| File | What it does | Used by |
| :--- | :--- | :--- |
| `src/lib/token.ts` | What does not depend on the server: the cookie name, the token's shape and `decodeToken`. | `session.ts`, the DAL and the proxy. |
| `src/lib/dal.ts` | It grows: `requireSession` and `requirePermission`. | The pages and the Server Actions. |
| `proxy.ts` | The first barrier: it redirects before rendering. | Next.js, before every request. |
| `RoutinesView.tsx` | The routines client view. | The routines page. |
| `routines.actions.ts` | Read and create routines, each one requiring its permission. | The routines slice's thunks. |

---

## 4. `token.ts`: what the session and the proxy share

The proxy needs to decode the token and know the cookie's name, just like `session.ts` and the DAL. But `session.ts` carries `import 'server-only'` and uses `next/headers`. So that the proxy does not depend on that, move the cookie, the type and `decodeToken` to a pure file:

```ts title="src/lib/token.ts" showLineNumbers
import { jwtDecode } from 'jwt-decode'

export const SESSION_COOKIE = 'session'

export type TokenPayload = {
  sub: string
  name: string
  role: string
  permissions: string[]
  exp: number
}

// Reads the token content. It does NOT verify the signature: the backend does that.
export function decodeToken(token: string | undefined): TokenPayload | null {
  if (!token) return null
  try {
    const payload = jwtDecode<TokenPayload>(token)
    if (typeof payload.exp !== 'number' || payload.exp * 1000 < Date.now()) return null
    return payload
  } catch {
    return null
  }
}
```

`session.ts` stops defining them and imports them. It only keeps what does depend on the server, `createSession` and `deleteSession`:

```ts title="src/lib/session.ts (imports)" showLineNumbers
import 'server-only'
import { cookies } from 'next/headers'
import { decodeToken, SESSION_COOKIE, type TokenPayload } from './token'
```

And the DAL imports from the same source:

```ts title="src/lib/dal.ts (imports)" showLineNumbers
import { decodeToken, SESSION_COOKIE } from './token'
```

---

## 5. The DAL: the session and the permission, next to the data

**What it does:** `getSession()` reads the cookie, decodes the token and returns the user, their role, their permissions and the token itself, or `null` if there is no valid session. `requireSession()` does the same but **redirects to `/login`** if there is none. `requirePermission(permission)` also requires that the permission is in the token. **What it is for:** they are the checks you call right before reading or changing something. **How it relates:** it uses `decodeToken`; the pages and the Server Actions call it.

```ts title="src/lib/dal.ts" showLineNumbers
import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { decodeToken, SESSION_COOKIE } from './token'

export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  const payload = decodeToken(token)
  if (!payload || !token) return null

  // the data comes from the token: no need to ask the backend
  return { userId: payload.sub, name: payload.name, role: payload.role, permissions: payload.permissions, accessToken: token }
}

export async function requireSession() {
  const session = await getSession()
  if (!session) redirect('/login')
  return session
}

export async function requirePermission(permission: string) {
  const session = await requireSession()
  if (!session.permissions.includes(permission)) {
    throw new Error('No tienes permiso')
  }
  return session
}
```

The two demanding functions **return the session**, so you can use it afterwards, for example to take the `accessToken` and send it to the backend with `Authorization: Bearer ...`.

:::info[Without permission, a generic error]
If the permission is missing, `requirePermission` throws an error and the user sees an error screen instead of a 403 page. It is a simplification. Next.js offers `forbidden()` and `unauthorized()` to show dedicated pages with the 403 and 401 status, but they are **experimental** and you have to enable them with `experimental.authInterrupts` in `next.config.ts`. The [error handling document](./03-manejo-de-errores-nextjs.md) explains them.
:::

---

## 6. The routines page: server and client

You would want to call `requirePermission("view_routines")` right in the routines page. But that page, as it ended up in week 12, is a client component (`'use client'`), because it uses the `useRoutines` hook. And the DAL uses `cookies()` and `server-only`: they only exist on the server.

Pick the two structures in the selector: the first one fails, the second is the solution.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/pagina-servidor-cliente/index.html"
  title="Why the routines page is split into a server page and a client view"
  height={640}
/>

The solution is to split the page in two:

1. Create `src/features/routines/presentation/components/RoutinesView.tsx` with **the content of the current page**, turned into a component (`export function RoutinesView()`) and with relative imports (`../hooks/use-routines`, `./RoutineCard`, `./RoutineForm`).
2. Rewrite `app/(app)/routines/page.tsx` as a **server** page, which requires the permission and renders the view:

```tsx title="app/(app)/routines/page.tsx" showLineNumbers
import { requirePermission } from '@/src/lib/dal'
import { RoutinesView } from '@/src/features/routines/presentation/components/RoutinesView'

export default async function RoutinesPage() {
  await requirePermission('view_routines')

  return <RoutinesView />
}
```

Without a session, it redirects to `/login`. Without the permission, it fails before drawing anything. The browser receives the view, but **not the token**: it stays in the `httpOnly` cookie.

:::warning[Do not decide the session only in the layout]
Because of partial rendering, a layout is **not rendered again** on every navigation between child routes: it would not notice that the session changed. The layout only hydrates the interface; the session is required in each page (or, better, next to the data, with `requireSession`).
:::

---

## 7. `proxy.ts`: the first barrier

**What it does:** it runs before every request, decodes the token from the cookie and redirects: to `/login` if you ask for a protected route without a session, and to `/routines` if you already have a session and go to `/login` or `/register`. **What it is for:** avoiding rendering pages the user could not see, without spending a request on the backend. **How it relates:** it uses `decodeToken` from `token.ts`; Next.js runs it on its own, without you calling it. **It does not replace the DAL or the backend.**

Pick a request and see what the proxy decides: the matcher, reading the cookie and the three possible responses.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/proxy-reglas/index.html"
  title="What proxy.ts decides on each request: the matcher, the cookie and the three responses"
  height={640}
/>

Create `proxy.ts` at the **root** of the project, next to `app/`:

```ts title="proxy.ts" showLineNumbers
import { NextRequest, NextResponse } from 'next/server'
import { decodeToken, SESSION_COOKIE } from '@/src/lib/token'

const protectedRoutes = ['/routines']
const publicRoutes = ['/login', '/register']

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtected = protectedRoutes.some((route) => path.startsWith(route))
  const isPublic = publicRoutes.includes(path)

  const payload = decodeToken(req.cookies.get(SESSION_COOKIE)?.value)

  if (isProtected && !payload) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
  if (isPublic && payload) {
    return NextResponse.redirect(new URL('/routines', req.nextUrl))
  }
  return NextResponse.next()
}

export const config = {
  // Do not run the proxy for static files or for /api
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}
```

How to read it: `protectedRoutes` and `publicRoutes` are the route lists; `config.matcher` tells Next.js on which requests to run the proxy (all except static files and metadata files). Without a `matcher`, the proxy would run on every request, including static files. It runs on the Node.js runtime.

:::info[proxy.ts or middleware.ts]
Next.js 16 renamed `middleware.ts` to `proxy.ts` (and the exported function to `proxy`). In Next.js 15 or earlier the file is called `middleware.ts` and exports `middleware`.
:::

:::warning[Server Actions go through the proxy, or they do not]
A Server Action is a POST to the route where it is used. If the `matcher` covers that route, the proxy also sees the POST; if it **excluded** it, the proxy would not check it. A change to the `matcher`, or moving an action to another route, can remove the coverage without anyone noticing. That is why the proxy is **not enough**: each action must check on its own.
:::

---

## 8. Server Actions that require their permission

Until now routines were read and created from the browser. So that their permissions are checked on the server, they become Server Actions. There are three changes.

**a) Mark the container as `server-only`.** First line of `src/features/routines/di/routine.container.ts`:

```ts title="src/features/routines/di/routine.container.ts (first line)" showLineNumbers
import 'server-only'
```

**b) Create the actions.** Each one requires its permission on the first line:

```ts title="src/features/routines/presentation/actions/routines.actions.ts" showLineNumbers
'use server'

import { requirePermission } from '@/src/lib/dal'
import { routineContainer } from '../../di/routine.container'
import type { CreateRoutineParams } from '../../domain/repositories/routine.repository'
import { RoutineViewModelMapper, type RoutineItemViewModel } from '../viewmodels/routine.viewmodel'

export type RoutinesResult =
  | { ok: true; routines: RoutineItemViewModel[] }
  | { ok: false; message: string }

export type CreateRoutineResult =
  | { ok: true; routine: RoutineItemViewModel }
  | { ok: false; message: string }

export async function getRoutinesAction(): Promise<RoutinesResult> {
  await requirePermission('view_routines')

  try {
    const entities = await routineContainer.getRoutines.execute()
    return { ok: true, routines: entities.map((entity) => RoutineViewModelMapper.toViewModel(entity)) }
  } catch {
    return { ok: false, message: 'Error al cargar rutinas' }
  }
}

export async function createRoutineAction(params: CreateRoutineParams): Promise<CreateRoutineResult> {
  await requirePermission('create_routines')

  try {
    const entity = await routineContainer.createRoutine.execute(params)
    return { ok: true, routine: RoutineViewModelMapper.toViewModel(entity) }
  } catch {
    return { ok: false, message: 'No se pudo crear la rutina' }
  }
}
```

`requirePermission` goes **outside** the `try/catch` on purpose: `redirect()` works by throwing a special exception, and a `catch` would swallow it. The action returns a ViewModel (a plain object), because the arguments and result of a Server Action must be serializable.

**c) Change the two thunks in `routines.slice.ts`** so that they call the actions instead of the container. Remove the imports of `routineContainer` and `RoutineViewModelMapper`, and import the actions:

```ts title="src/features/routines/presentation/store/routines.slice.ts (thunks)" showLineNumbers
import { createRoutineAction, getRoutinesAction } from '../actions/routines.actions'

export const fetchRoutines = createAsyncThunk(
  'routines/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const result = await getRoutinesAction()
      if (!result.ok) return rejectWithValue(result.message)
      return result.routines
    } catch {
      return rejectWithValue('No se pudieron cargar las rutinas. Intenta de nuevo.')
    }
  }
)

export const createRoutineMutation = createAsyncThunk(
  'routines/create',
  async (params: CreateRoutineParams, { rejectWithValue }) => {
    try {
      const result = await createRoutineAction(params)
      if (!result.ok) return rejectWithValue(result.message)
      return result.routine
    } catch {
      return rejectWithValue('No se pudo crear la rutina. Intenta de nuevo.')
    }
  }
)
```

Two effects worth keeping in mind:

- The routines mock now lives **on the server**: the routines you create survive a page reload, and are lost when you restart `npm run dev`.
- It is a single mock **shared by all users**: today it does not distinguish whose each routine is.

---

## 9. Show or hide according to permissions

With the user and their permissions in the state, any component can show or hide elements without asking the backend anything. In `RoutinesView.tsx`, the create-routine form is drawn only for whoever can use it:

```tsx title="src/features/routines/presentation/components/RoutinesView.tsx (excerpt)" showLineNumbers
import { useAuth } from '@/src/features/auth/presentation/hooks/use-auth'

export function RoutinesView() {
  const { hasPermission } = useAuth()
  const { routines, isLoading, errorMessage, createRoutine } = useRoutines()
  const canCreate = hasPermission('create_routines')

  // ...
  {canCreate && (
    <section>
      <RoutineForm onSubmit={createRoutine} isLoading={isLoading} />
    </section>
  )}
}
```

Ana sees the list but not the form; the administrator sees both. Since the state is hydrated in an effect after the first render, the form appears a moment after the rest on reload.

Remember the warning from section 2: this is interface only. Whoever does not have `create_routines` cannot create the routine by sending the POST by hand either, and that is guaranteed by section 8, not by this one.

---

## 10. Trying it out

With `npm run dev`, check each layer separately:

| What to try | Expected result |
| :--- | :--- |
| Open `/routines` without a session | Redirects to `/login` (the proxy does it) |
| With a session, open `/login` or `/register` | Redirects to `/routines` |
| Sign in as Ana (`USER`) | Sees the list, but **not** the form |
| Sign in as Admin (`ADMIN`) | Sees the list and the form; creates a routine |
| Reload as Admin | The created routine is still there (it lives on the server) |
| Sign out and open `/routines` | Redirects to `/login` |

The proxy can also be checked without a browser:

```bash
curl -i http://localhost:3001/routines
```

The response is `307` with `location: /login`.

To check that **the action protects itself**, send the `createRoutineAction` POST by hand with Ana's cookie (she only has `view_routines`): the action rejects it with "No tienes permiso" and the routine is not created. Without a cookie, the proxy stops it earlier with a `307`.

---

## 11. Limits you should know

:::warning[The token's signature is not verified in the front end]
The proxy and the DAL only **decode**. A token with the right shape but an invented signature passes both, and the course's simulated backend does not check it either: you can verify this by creating a routine with a fake token that says `create_routines`. In a real architecture, the backend verifies the signature on every request and rejects that token with a 401. The front end's guards improve the experience and reduce work; they do not replace the backend.
:::

- **Authentication is not authorization.** The proxy answers "is there someone?". The permission answers "can they do this?". And "is this data theirs?" can only be decided by the backend, comparing the resource owner with the token's id.
- **Without permission, the error is generic.** See section 5.
- **The routines mock.** It lives in the server's memory and is shared between users. In addition, when creating a routine with a description shorter than 10 characters, the datasource saves the record before the entity validates it, and from that moment loading the list fails for everyone until the server is restarted. The solution is to validate in `CreateRoutineUseCase` before saving.
- **The routines actions' messages are generic.** The user does not see the real cause of a domain failure, such as a description that is too short. Expected errors should carry a specific message, as the [error handling document](./03-manejo-de-errores-nextjs.md) says.
- **The state is not reset when switching users.** Redux keeps, for example, the routines list until a reload. With a per-user backend you would have to clear it on sign out.

---

## Summary

| I want to... | I use |
| :--- | :--- |
| Redirect whoever has no session before rendering | `proxy.ts` |
| Require a session in a page or some data | `requireSession()` in the DAL |
| Require a permission in a page or some data | `requirePermission()` in the DAL |
| Protect a Server Action | `requirePermission()` on its first line |
| Protect a route whose page uses hooks | Server page + client view |
| Show or hide according to the permission | `hasPermission()` from `useAuth` (interface only) |
| Know whether some data belongs to the user | The backend, with the token's id |

---

## Next step

You now have a session and protected routes. What is left is deciding what to do when something goes wrong: a missing permission, wrong credentials, a backend that is down, a page that does not exist. That is [error handling](./03-manejo-de-errores-nextjs.md).
