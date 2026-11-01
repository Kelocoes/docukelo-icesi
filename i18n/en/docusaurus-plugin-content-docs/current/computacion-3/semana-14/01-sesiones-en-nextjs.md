---
sidebar_position: 1
description: "What a session is, how to store and decode the token issued by the backend in an httpOnly cookie, keep the user and their roles in Redux, what 'use server' is and how to protect routes in Next.js."
---

# Sessions and protected routes in Next.js

In [week 12](../semana-12/03-configuracion-redux-nextjs.md) we stored state with Redux and organized the project with Clean Architecture. In the [week 13 in-class assignment](../semana-13/03-trabajo-en-clase.md) we built login and registration with a mocked datasource. Something is still missing: **nothing remembers who signed in**. If you reload, Redux starts empty, and anyone can type `/routines` in the address bar.

This document closes that loop. We assume a realistic architecture: **a backend issues the token** (a JWT) and **verifies it on every request**. The front end only does three things with it: it stores it, it **decodes** it to know who the user is and which roles they have, and it forwards it. By the end you will know:

1. **What a session is** and where it is best stored.
2. **How to configure it**: store the token in a cookie and decode it.
3. **How to integrate it into your architecture**: which layer each file belongs to and how they relate.
4. **What `'use server'` is**, what it is for and how to use it.
5. **How to protect routes** and use roles in the interface.

Error handling has its own document: [Error handling in Next.js](./02-manejo-de-errores-nextjs.md). Everything follows the [official Next.js authentication documentation](https://nextjs.org/docs/app/guides/authentication), adapted to the course architecture.

---

## 1. What is a session and where is it stored?

A **session** is how an application remembers who you are between one request and the next. HTTP has no memory: each request arrives on its own, so after the login you have to store something (a token or an id) and send it back on every request.

In the week 13 in-class assignment the login ended and stored nothing: after a reload, the page no longer knew who you were. The question is **where to store that token**. There are four options: pick one in "Guardar en" (Store in) and see where it ends up, what happens on reload, what the server receives and what a malicious script can read.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/donde-vive-la-sesion/index.html"
  title="Where to store the session: memory, localStorage, plain cookie and httpOnly cookie"
  height={600}
/>

What the piece shows, in summary:

| Place | Pros | Cons | Use it for |
| :--- | :--- | :--- | :--- |
| **Memory** (Redux, `useState`) | Simple and reactive. | Lost on reload; the server cannot see it. | Interface state. |
| **`localStorage`** | Persists; about 5 MB; easy to use. | Only exists in the browser (the first render does not know who you are); any script on the page can read it (XSS); you have to add it to every request yourself. | Preferences (theme, filters). **Never** a session token. |
| **Plain cookie** (`document.cookie`) | The server receives it on every request automatically. | JavaScript can read it too; about 4 KB. | Non-sensitive data the server needs. |
| **`httpOnly` cookie** | Persists, the server receives it and JavaScript cannot read it. | About 4 KB; only the server creates and deletes it. | **The session.** |

There are also two ways to organize the session. In the first, the token is a **JWT**: it carries the data inside (the id, the name, the roles, the expiry) and the backend verifies it with its key, without querying a database. It is the one we will use because the backend issues a JWT. In the second, the cookie only holds an id and the data lives on the server:

| | JWT session (*stateless*) | Database session (the cookie only holds an id) |
| :--- | :--- | :--- |
| **Pros** | The backend verifies it without asking anyone; the front end can read its content without requesting it; scales easily. | Revoked instantly; the data never leaves the server. |
| **Cons** | Cannot be revoked before it expires; the content can be read (it is signed, not encrypted). | One query per request; you have to store and clean up sessions. |

---

## 2. The lifecycle of a session

Before writing code it helps to see the whole journey. Follow Ana from the moment she signs in until she signs out. Turn on "Pedir la página sin cookie" (Request the page without a cookie) to see what happens without a session.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/ciclo-sesion-cookie/index.html"
  title="Lifecycle of a cookie session: sign in, protected route and sign out"
  height={640}
/>

The lifecycle has three moments, and each one is solved by a different piece that we will build in this document:

| Moment | What happens | Who does it |
| :--- | :--- | :--- |
| **Sign in** | The backend checks the credentials and hands out a token; the front end decodes it and stores it in a cookie. | The backend (here, a mock), a Server Action (`loginAction`) and `session.ts`. |
| **Request a protected route** | The browser sends the cookie on its own; the Next.js server decodes the token, sees that it has not expired and lets the request through. The backend verifies it when you ask it for data. | `proxy.ts` and the DAL (`requireSession`). |
| **Sign out** | The server deletes the cookie. | A Server Action (`logoutAction`) and `session.ts`. |

---

## 3. Configure the session: store and decode the token

In this architecture **the backend issues and verifies the token; the front end does not create it, sign it or verify it**. Its job has three parts:

1. **Store it** in an `httpOnly` cookie, so it survives reloads and JavaScript cannot read it.
2. **Decode it** to know who the user is and which roles they have (the id, the name, the roles and the expiry are inside the token) **without making any request**. That information is kept in the application state to use it in the interface.
3. **Forward it** to the backend on every call (`Authorization: Bearer ...`). The backend verifies the signature and decides.

:::note[In the course the backend is a mock]
While there is no backend, the mocked datasource from week 13 plays the backend: when the credentials are correct it returns a JWT with the id, the name and the roles, signed with a test secret. When a real backend exists, you only replace that datasource with an HTTP one (section 4); the rest of the code does not notice.
:::

### Signing, verifying and decoding are not the same thing

| Operation | What it does | Who does it here |
| :--- | :--- | :--- |
| **Sign** | Creates the token with a secret key. | The backend (in the course, the mock). |
| **Verify** | Checks with the key that nobody modified the token. | **The backend**, on every request it receives. |
| **Decode** | Reads the token content **without checking anything**. It needs no key. | **The front end**, with `jwt-decode`. |

:::warning[What the front end decodes is only good for the interface]
A JWT can be read without the key (it is base64). If someone modifies its content (for example, `roles: ["ADMIN"]`), the front end decodes it anyway and would believe it. That is why what the front end reads is for **showing or hiding** things, never for **protecting data**: the backend verifies the signature and decides. A fake token does not get a single piece of data.
:::

### Which library?

A single function is enough to decode. We use **`jwt-decode`**:

| Option | When |
| :--- | :--- |
| **`jwt-decode`** | The chosen one: it does one thing (decode), needs no key and works in the browser and on the server. |
| `jose` | Verifies and signs in addition to decoding. It is more than we need, unless one day you want to verify the token in the front end. |
| Decode by hand (`atob`) | It works, but you have to handle the base64 and special characters yourself. |

### Install

| Package | What it is for |
| :--- | :--- |
| `jwt-decode` | Decodes the token (it does not verify or sign it). |
| `zod` | Validates the data coming from the form. |
| `server-only` | Makes the build fail if a client component imports a server file. |

```bash
npm install jwt-decode zod server-only
```

No environment variable is needed: the front end uses no key. (The mock uses a fixed test secret inside its own file. When the real backend exists, you will only need `API_URL`.)

### The `session.ts` file

This piece shows `session.ts` line by line and what it produces: the token that arrives, its decoded content and the `Set-Cookie` header. Hover over the code or the result: the matching part lights up.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/anatomia-cookie-sesion/index.html"
  title="Anatomy of the session.ts file: decode the backend token and store it in the cookie"
  height={1100}
/>

**`session.ts` is the only file that knows how the session is stored and read.** The others use it; nobody else touches the cookie:

| Function | What it does | Who calls it |
| :--- | :--- | :--- |
| `decodeToken` | Reads the token content and discards an expired one; returns the content or `null`. It does not verify the signature. | `createSession`, `proxy.ts` and the DAL. |
| `createSession` | Decodes the token the backend handed out and stores it in the cookie, with the token's expiry. Returns the content. | `loginAction`. |
| `deleteSession` | Deletes the cookie. | `logoutAction`. |

```ts title="src/lib/session.ts" showLineNumbers
import 'server-only'
import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'

export type TokenPayload = {
  sub: string // user id
  name: string
  roles: string[] // for example ['USER'] or ['ADMIN']
  exp: number // expiry, in seconds since 1970
}

// Reads the token content. It does NOT verify the signature: the backend does that.
export function decodeToken(token: string | undefined): TokenPayload | null {
  if (!token) return null
  try {
    const payload = jwtDecode<TokenPayload>(token)
    if (payload.exp * 1000 < Date.now()) return null // already expired
    return payload
  } catch {
    return null // it does not look like a JWT
  }
}

export async function createSession(token: string) {
  const payload = decodeToken(token)
  if (!payload) throw new Error('El backend entregó un token inválido')

  const store = await cookies()
  store.set('session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    expires: new Date(payload.exp * 1000), // cookie and token expire together
    path: '/',
  })
  return payload
}

export async function deleteSession() {
  const store = await cookies()
  store.delete('session')
}
```

How to read it: `decodeToken` returns `null` instead of throwing an error, because "there is no session" is a normal result, not a failure. Checking `exp` is not verifying the signature: it only avoids treating a token that is no longer valid as a session. `createSession` stores **the same token** the backend handed out. The `store.set` options are explained in the piece.

:::tip[If the browser does not store the cookie in development]
`secure: true` requires HTTPS. Most browsers allow it on `http://localhost`, but Safari does not. While developing you can use `secure: process.env.NODE_ENV === 'production'`.
:::

:::note[When the token expires]
The cookie expires together with the token, so the proxy stops finding a session and redirects to the login. Real backends usually also hand out a *refresh token* to renew the session without asking for the password; we do not cover it here.
:::

---

## 4. Integrate it into your architecture

The dependency rule from week 12 does not change: **the domain knows nothing about cookies or JWT**. A cookie is an HTTP detail and a JWT is a backend detail. The domain only answers one question: "do these credentials give me a token?". Everything else (the cookie, the form, the state) lives outside.

This piece shows the project from weeks 12 and 13 and where each new file goes. Hover or tap each line to see its role.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/estructura-auth/index.html"
  title="Project folder structure with the auth feature and the session"
  height={1200}
/>

The `auth` feature has the same shape as `routines`. Each file plays a role and builds on the previous one:

| Layer | File | What it does | Who uses it |
| :--- | :--- | :--- | :--- |
| Domain | `AuthTokens`, `AuthRepository`, `LoginUseCase` | Defines what a login returns (a token) and answers whether some credentials obtain it. | The Server Action. |
| Infrastructure | `AuthMockDatasource` (today), `AuthApiDatasource` (real backend), `AuthRepositoryImpl` | Ask the backend for the token and fulfill the domain contract. | The container. |
| DI | `auth.container.ts` | Assembles the use case with its dependencies. | The Server Action. |
| Presentation | `loginAction` (Server Action) | Validates, requests the token, stores it with `createSession` and returns the user with their roles. Runs on the server. | The thunk. |
| Presentation | `auth.slice.ts` (thunks) | Calls the action and stores in Redux the user with their roles and the login status. | The hook. |
| Presentation | `useAuth()` | Facade hook: the only thing the interface knows (`user`, `login`, `hasRole`...). | `LoginForm`, `LogoutButton` and any component. |
| Presentation | `LoginForm`, `LogoutButton` | The week 13 interface. | The `/login` page and the header. |
| Presentation | `AuthHydrator` | Fills the store with the session when the page loads or reloads. | The root layout. |
| Cross-cutting | `src/lib/session.ts`, `src/lib/dal.ts` | Decode and store the token; deliver the session along with the data. Several features use them. | The action, the proxy and the pages. |
| Root | `proxy.ts` | First barrier: redirects anyone without a session. | Next.js, before every request. |

`session.ts` and `dal.ts` go in `src/lib/`, just like `src/store/` with Redux: they do not belong to a feature because any protected feature needs them.

These are the files of the `auth` part that Next.js does not touch. The first two are domain; the third is **the simulated backend** (which is later replaced by the real one); the fourth assembles everything.

<Tabs>
<TabItem value="contrato" label="Contract and use case" default>

The domain defines **what** a login returns and **what** it needs from outside, without saying how it is obtained. For it, the token is opaque text:

```ts title="src/features/auth/domain/entities/auth-tokens.ts" showLineNumbers
export interface AuthTokens {
  accessToken: string
}
```

```ts title="src/features/auth/domain/repositories/auth.repository.ts" showLineNumbers
export interface AuthRepository {
  login(email: string, password: string): Promise<AuthTokens | null>
}
```

One use case per user action. This one normalizes the email and asks the repository for the tokens; it returns `null` if the credentials are not valid:

```ts title="src/features/auth/domain/usecases/login.usecase.ts" showLineNumbers
export class LoginUseCase {
  constructor(private repository: AuthRepository) {}

  execute(email: string, password: string) {
    return this.repository.login(email.trim().toLowerCase(), password)
  }
}
```

</TabItem>
<TabItem value="mock" label="Simulated backend (mock)">

The mock does what the backend would do: if the credentials are correct, it **builds a JWT** with the user's id, name and roles, with a one-hour expiry. It signs it by hand with Node's `crypto` module (a JWT is `header.payload.signature`), so no token library is needed. It includes `import 'server-only'` because it contains users and the key:

```ts title="src/features/auth/infrastructure/auth.mock.datasource.ts" showLineNumbers
import 'server-only'
import { createHmac } from 'node:crypto'

const SECRET = 'secreto-de-prueba' // the simulated "backend secret"

const USERS = [
  { id: '7', name: 'Ana', email: 'ana@icesi.edu.co', password: '123456', roles: ['USER'] },
  { id: '1', name: 'Admin', email: 'admin@icesi.edu.co', password: 'admin123', roles: ['ADMIN'] },
]

const base64url = (data: object) => Buffer.from(JSON.stringify(data)).toString('base64url')

// Builds an HS256 JWT: header.payload.signature
function signMockToken(payload: object) {
  const body = `${base64url({ alg: 'HS256', typ: 'JWT' })}.${base64url(payload)}`
  const signature = createHmac('sha256', SECRET).update(body).digest('base64url')
  return `${body}.${signature}`
}

// Simulates the backend's POST /auth/login
export class AuthMockDatasource {
  async login(email: string, password: string) {
    const user = USERS.find((u) => u.email === email && u.password === password)
    if (!user) return null // the backend would respond 401

    const exp = Math.floor(Date.now() / 1000) + 60 * 60 // expires in 1 hour
    const accessToken = signMockToken({ sub: user.id, name: user.name, roles: user.roles, exp })
    return { accessToken }
  }
}
```

The repository fulfills the domain contract with any datasource that has `login` (the mock today, the HTTP one tomorrow):

```ts title="src/features/auth/infrastructure/auth.repository.impl.ts" showLineNumbers
export interface AuthDatasource {
  login(email: string, password: string): Promise<AuthTokens | null>
}

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private datasource: AuthDatasource) {}

  login(email: string, password: string) {
    return this.datasource.login(email, password)
  }
}
```

:::warning[For class only]
Storing the password in plain text and signing with a secret written in the code only works for the mock. A real backend stores a password *hash* (for example with bcrypt) and its key is never in the code.
:::

</TabItem>
<TabItem value="api" label="Real backend">

When the backend exists, this datasource takes the mock's place. It makes the login POST and returns the token **the backend signed**:

```ts title="src/features/auth/infrastructure/auth.api.datasource.ts" showLineNumbers
import 'server-only'

export class AuthApiDatasource {
  async login(email: string, password: string) {
    const res = await fetch(`${process.env.API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (res.status === 401) return null // expected error: invalid credentials
    if (!res.ok) throw new Error('El backend no respondió') // unexpected error

    return (await res.json()) as { accessToken: string }
  }
}
```

A 401 is an **expected** error (it returns `null`, like the mock); any other failure is **unexpected** and is thrown. The [errors document](./02-manejo-de-errores-nextjs.md) shows what happens with each one. The only environment variable the front end needs is the API address:

```text title=".env.local"
API_URL=http://localhost:3001
```

</TabItem>
<TabItem value="di" label="Container">

The Composition Root assembles the pieces. The switch from the mock to the real backend is **this single line**. It includes `import 'server-only'` because it **must never reach the browser**:

```ts title="src/features/auth/di/auth.container.ts" showLineNumbers
import 'server-only'

const datasource = new AuthMockDatasource() // later: new AuthApiDatasource()
const repository = new AuthRepositoryImpl(datasource)

export const authContainer = {
  login: new LoginUseCase(repository),
}
```

</TabItem>
</Tabs>

The part that touches Next.js is still missing: the action, the slice, the hook and the form. First we need to understand what `'use server'` is.

---

## 5. `'use server'` and Server Actions

So far all the application code runs in the browser (client components, thunks) or on the server while rendering (Server Components). But sometimes the browser needs to **ask the server to run something**: request the token from the backend, write an `httpOnly` cookie, save to a database. A **Server Action** is a function you write in your project, but that runs on the server and is called from the browser as if it were local.

The `'use server'` directive is what marks that function. Follow a call from the thunk to `loginAction` and see what Next.js does; then go on to "Sin use server" (Without use server).

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/use-server-que-hace/index.html"
  title="What use server does: the call crosses to the server, and what would happen without the directive"
  height={720}
/>

### What it is and what it is for

- **What it does:** it marks functions as server code. Next.js does not include them in the browser's JavaScript: instead it hands out a "receipt" with an id. Calling the receipt sends a **POST** to the server, which looks up the real function by that id and runs it.
- **What we use it for:** for what only the server can or should do: **write an `httpOnly` cookie**, run logic with secrets that must not reach the browser (the datasource, the API address) and validate reliably.
- **What it saves you:** writing the endpoint, the route and the `fetch`. You call a function; Next.js does the rest.

### How it is written

There are two ways. The usual one in this course is to put the directive **at the top of a file**: all the functions it exports become Server Actions.

```ts title="app/actions.ts" showLineNumbers
'use server'

export async function saludar(nombre: string) {
  return `Hola, ${nombre}`
}
```

It can also go **inside a function**, but only in a Server Component:

```tsx title="app/page.tsx" showLineNumbers
export default function Page() {
  async function crear(formData: FormData) {
    'use server'
    // runs on the server
  }

  return <form action={crear}>{/* fields */}</form>
}
```

A client component (`'use client'`) **cannot define** Server Actions: it imports them from a file with `'use server'`.

### How it is called

| Form | How | When |
| :--- | :--- | :--- |
| **As a form action** | `<form action={myAction}>`; it receives a `FormData`. With `useActionState` the component stores the result. | It is the official guide's way: forms without extra JavaScript. |
| **From code** | `await myAction(arg1, arg2)` inside an event, a `useEffect` or **a thunk**; it receives normal arguments. | When you already have an architecture that decides when to call (our case: the thunk). |

### Rules to remember

| Rule | Why |
| :--- | :--- |
| Only **`async`** functions are exported. | The call travels over the network: it is always asynchronous. |
| Arguments and result must be **serializable** (text, numbers, plain objects). | They travel as data. You cannot return a class with methods or a function. |
| Its code **does not reach the browser**. | You can use secrets and datasources inside. |
| It is a **public endpoint**: anyone can send it a POST without going through your interface. | So validate the data and require the session **inside each action**. |

:::warning[An action does not inherit the page's protections]
A page's session check does not cover the Server Actions defined or used in it: they are separate endpoints. Every action that reads or changes data must require a session on its own, and the backend decides the permissions. Section 7 shows it.
:::

---

## 6. Implement the login

With all the pieces clear, the login flow is the week 12 chain (view → hook → thunk) plus a boundary with the server:

**`LoginForm` → `useAuth()` → thunk `loginMutation` → _[POST]_ → Server Action `loginAction` → `LoginUseCase` → backend**

The view knows neither Redux nor the action: the hook is the facade, just like `useRoutines`. The thunk runs in the browser and calls the action, which runs on the server. This piece walks through `loginAction` line by line, along with who calls it, the request and the response.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/anatomia-server-action/index.html"
  title="Anatomy of the loginAction Server Action: who calls it, validation, expected errors and cookie"
  height={1100}
/>

The following files are built from the bottom up (each one uses the previous one).

### 6.1 The Server Action: the boundary with the server

**What it does:** it receives the email and password, validates them, asks the backend for the token through `LoginUseCase` and, if everything goes well, stores it in the cookie. **What it is for:** it is the only place where the domain (the token) and Next.js (the cookie) meet. **How it relates:** it uses `authContainer` (domain) and `createSession` (`session.ts`); the thunk calls it.

It always returns an `{ ok, ... }` object instead of throwing errors: expected errors (invalid data, wrong credentials) travel as a value, so a useful message reaches the screen. The user it returns (`id`, `name` and `roles`) comes **from the token content**, and it is the only thing the browser receives: the token stays in the `httpOnly` cookie, where JavaScript cannot read it.

```ts title="src/features/auth/presentation/actions/auth.actions.ts" showLineNumbers
'use server'

import { z } from 'zod'
import { authContainer } from '../../di/auth.container'
import { createSession, deleteSession } from '@/lib/session'

const schema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export type AuthUser = { id: string; name: string; roles: string[] }

export type LoginResult =
  | { ok: true; user: AuthUser }
  | { ok: false; message: string }

export async function loginAction(email: string, password: string): Promise<LoginResult> {
  const parsed = schema.safeParse({ email, password })
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message }
  }

  const tokens = await authContainer.login.execute(parsed.data.email, parsed.data.password)
  if (!tokens) {
    return { ok: false, message: 'Credenciales inválidas' }
  }

  const payload = await createSession(tokens.accessToken)
  return { ok: true, user: { id: payload.sub, name: payload.name, roles: payload.roles } }
}

export async function logoutAction() {
  await deleteSession()
}
```

How to read it, in order: (1) `'use server'` turns it into an endpoint; (2) `schema` defines the valid format; (3) `loginAction` validates, and if that fails it returns the message; (4) it asks the use case for the token (which asks the backend); (5) `createSession` decodes and stores it, and the action returns the user with their roles, **never the token or a password**. `logoutAction` only deletes the cookie.

### 6.2 The slice and its thunks

**What it does:** it stores in Redux the decoded user with their roles (`user`) and the login status (`isLoading`, `errorMessage`), and defines the thunks that call the actions. **What it is for:** so any component can know who the user is and which roles they have without requesting it again, just like `routines.slice.ts` does with routines. **How it relates:** it calls `loginAction` and `logoutAction`; the hook reads it.

The thunk is the bridge between the browser and the server: it translates the action's `{ ok: false, message }` into a `rejectWithValue`, and catches unexpected failures (the network, the server) with a `try/catch`. The `setUser` reducer is used by `AuthHydrator` (below) to fill the store on reload.

```ts title="src/features/auth/presentation/store/auth.slice.ts" showLineNumbers
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { loginAction, logoutAction, AuthUser } from '../actions/auth.actions'

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  errorMessage: string | null
}

const initialState: AuthState = { user: null, isLoading: false, errorMessage: null }

export const loginMutation = createAsyncThunk(
  'auth/login',
  async (params: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const result = await loginAction(params.email, params.password)
      if (!result.ok) return rejectWithValue(result.message) // expected error
      return result.user
    } catch {
      return rejectWithValue('No se pudo iniciar sesión. Intenta de nuevo.') // unexpected error
    }
  }
)

export const logoutMutation = createAsyncThunk('auth/logout', async () => {
  await logoutAction()
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload
    },
    clearError: (state) => {
      state.errorMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginMutation.pending, (state) => {
        state.isLoading = true
        state.errorMessage = null
      })
      .addCase(loginMutation.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(loginMutation.rejected, (state, action) => {
        state.isLoading = false
        state.errorMessage = (action.payload as string) ?? 'Error al iniciar sesión'
      })
      .addCase(logoutMutation.fulfilled, (state) => {
        state.user = null
      })
  },
})

export const { setUser, clearError } = authSlice.actions
export const authReducer = authSlice.reducer
```

Register the reducer in the week 12 store factory so that `state.auth` exists:

```ts title="src/store/store.ts" showLineNumbers
export const makeStore = () =>
  configureStore({
    reducer: {
      routines: routinesReducer,
      auth: authReducer, // new
    },
  })
```

### 6.3 The facade hook

**What it does:** it exposes `user`, `isLoading`, `errorMessage`, `login()`, `logout()` and `hasRole()`. **What it is for:** it is the only thing components know. If tomorrow you swap Redux for something else, or the action for a `fetch`, the components do not notice. **How it relates:** it dispatches the slice's thunks and is used by `LoginForm`, `LogoutButton` and any component that depends on roles.

`login()` returns `true` if the sign-in went well: that way the component decides whether to navigate, without knowing Redux. `hasRole('ADMIN')` answers whether the user has that role.

```ts title="src/features/auth/presentation/hooks/use-auth.ts" showLineNumbers
'use client'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loginMutation, logoutMutation } from '../store/auth.slice'

export function useAuth() {
  const dispatch = useAppDispatch()
  const { user, isLoading, errorMessage } = useAppSelector((state) => state.auth)

  const login = async (email: string, password: string) => {
    const action = await dispatch(loginMutation({ email, password }))
    return loginMutation.fulfilled.match(action) // true if the sign-in went well
  }

  const logout = async () => {
    await dispatch(logoutMutation())
  }

  const hasRole = (role: string) => !!user?.roles.includes(role)

  return { user, isLoading, errorMessage, login, logout, hasRole }
}
```

### 6.4 The components

**What they do:** `LoginForm` is the week 13 form, now connected to the hook: on submit it calls `login()` and, if it goes well, navigates with `router.replace('/routines')`. `LogoutButton` signs out and goes back to `/login`. **What they are for:** they are the only thing the user sees. **How they relate:** only to `useAuth`; they do not know that Redux, a Server Action or a cookie exist. The fields have a `<label>` so they are accessible (and so tests can find them by their label).

```tsx title="src/features/auth/presentation/components/LoginForm.tsx" showLineNumbers
'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/use-auth'

export function LoginForm() {
  const router = useRouter()
  const { login, isLoading, errorMessage } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const ok = await login(email, password)
    if (ok) router.replace('/routines')
  }

  return (
    <form onSubmit={onSubmit} className="card bg-base-100 w-full max-w-md shadow-md">
      <div className="card-body gap-3">
        <label className="flex flex-col gap-1">
          <span>Correo</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input input-bordered" />
        </label>
        <label className="flex flex-col gap-1">
          <span>Contraseña</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input input-bordered" />
        </label>

        {errorMessage && <p className="text-error text-sm" role="alert">{errorMessage}</p>}
        <button className="btn btn-primary" disabled={isLoading}>Iniciar sesión</button>
      </div>
    </form>
  )
}
```

```tsx title="src/features/auth/presentation/components/LogoutButton.tsx" showLineNumbers
'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/use-auth'

export function LogoutButton() {
  const router = useRouter()
  const { logout } = useAuth()

  async function onClick() {
    await logout()
    router.replace('/login')
  }

  return <button className="btn btn-ghost" onClick={onClick}>Cerrar sesión</button>
}
```

:::info[The official guide's way]
The Next.js documentation uses `<form action={...}>` with `useActionState`: the form calls the Server Action directly and the state lives in the component. It is equivalent and shorter; here we use the thunk to respect the week 12 architecture (view, hook, store, action).
:::

### 6.5 Keep the session in the state on reload

After the login, the slice already has the user and their roles. But on **reload** the page, Redux starts empty even though the cookie is still there. It has to be filled again, and the client cannot decode the token on its own: it is in an `httpOnly` cookie, which JavaScript cannot read. So **the server** does it: the root layout decodes the cookie and passes the client only the user and their roles (not the token) through a small component.

**What `AuthHydrator` does:** it receives the user through props and dispatches it to the store. **What it is for:** so `useAuth()` returns the user from the very first moment, also after a reload. **How it relates:** the root layout renders it, and gets the user with `getSession()` from the DAL (section 7).

```tsx title="src/features/auth/presentation/components/AuthHydrator.tsx" showLineNumbers
'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { setUser } from '../store/auth.slice'
import type { AuthUser } from '../actions/auth.actions'

export function AuthHydrator({ user }: { user: AuthUser | null }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setUser(user))
  }, [dispatch, user])

  return null
}
```

```tsx title="app/layout.tsx" showLineNumbers
import { getSession } from '@/lib/dal'
import { StoreProvider } from '@/store/StoreProvider'
import { AuthHydrator } from '@/features/auth/presentation/components/AuthHydrator'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession() // decodes the cookie; null if there is no session
  const user = session && { id: session.userId, name: session.name, roles: session.roles }

  return (
    <html lang="es">
      <body>
        <StoreProvider>
          <AuthHydrator user={user} />
          {children}
        </StoreProvider>
      </body>
    </html>
  )
}
```

:::note[This protects nothing]
The layout only **fills the interface**; it does not decide who can see what (a layout is not re-rendered on every navigation). Since the effect runs after the first render, `user` is `null` for an instant. If you do not want that flicker, pass the user as the initial state when creating the store in `StoreProvider`.
:::

---

## 7. Protect the routes

Having a session is useless if anyone can type `/routines`. Protecting a route means deciding, **on every request**, whether the user can see that content. A single door is not enough: go through the three and then try six different requests, including a fake token and the case of a Server Action without a check.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/capas-de-defensa/index.html"
  title="Three layers of defense: proxy, Data Access Layer and Server Actions"
  height={680}
/>

The front end decodes the token and so it can decide quickly, without requests, what to show and where to redirect. But it **does not verify the signature**: the backend is still the one that verifies the token on every call and decides the permissions.

| Layer | What it checks | What it can NOT do |
| :--- | :--- | :--- |
| **`proxy.ts`** | That there is a decodable, valid token, and (if you want) which roles it carries, before rendering. Fast; redirects entire routes. | It does not verify the signature or know whether the data belongs to the user. That is why it is an "optimistic" check. |
| **The DAL** (`requireSession`) | The same, next to the data about to be read, and it hands over the token to call the backend. | It does not decide permissions: the backend does that when verifying the token. |
| **Each Server Action** | That whoever calls it has a session, on its own; the backend decides the permissions. | It does not inherit what the page that uses it checks. |

### 7.1 The DAL: the session next to the data

**What it does:** `getSession()` reads the cookie, decodes the token and returns the id, the name, the roles and the token itself, or `null` if there is no valid session. `requireSession()` does the same but **redirects to `/login`** if there is none. **What it is for:** `requireSession` is the check you call right before reading or changing data; `getSession` is for when you only want to know whether there is a session (the layout). **How it relates:** it uses `decodeToken` from `session.ts`; pages, the layout and Server Actions call it.

```ts title="src/lib/dal.ts" showLineNumbers
import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { decodeToken } from './session'

export async function getSession() {
  const token = (await cookies()).get('session')?.value
  const payload = decodeToken(token)
  if (!payload) return null

  // userId, name and roles come from the token: no need to ask the backend for them
  return { userId: payload.sub, name: payload.name, roles: payload.roles, accessToken: token! }
}

export async function requireSession() {
  const session = await getSession()
  if (!session) redirect('/login')
  return session
}
```

Use it in the protected page: you get the token and send it to the backend, which will verify the signature and hand over **only** that user's data.

```tsx title="app/routines/page.tsx" showLineNumbers
import { requireSession } from '@/lib/dal'

export default async function RoutinesPage() {
  const { accessToken } = await requireSession()
  // ...request the routines from the backend with Authorization: Bearer ${accessToken}
}
```

### 7.2 Each Server Action requires its session

**What it does:** this example action deletes a routine. It first requires a session and then sends the token to the backend, which verifies the signature and decides whether that routine belongs to the user. **What it is for:** it illustrates the rule from section 5: an action is a public endpoint. **How it relates:** it uses `requireSession` from the DAL and the `routines` container. (It is an example: the week 12 feature has no "delete".)

```ts title="src/features/routines/presentation/actions/routines.actions.ts" showLineNumbers
'use server'

import { requireSession } from '@/lib/dal'
import { routineContainer } from '../../di/routine.container'

export async function deleteRoutineAction(routineId: string) {
  // 1. Is there a session? (if not, redirect to /login)
  const { accessToken } = await requireSession()

  // 2. Authorization: the backend decides, verifying the token and comparing the owner
  const result = await routineContainer.deleteRoutine.execute(routineId, accessToken)
  if (!result.ok) {
    return { ok: false, message: 'No tienes permiso para borrar esta rutina' }
  }
  return { ok: true }
}
```

There are two different questions: **authentication** ("who are you?") and **authorization** ("can you do this?"). The front end can only *assume* the answer by reading the token; the backend **verifies** it. The `routines` HTTP datasource is the one that sends the token:

```ts title="src/features/routines/infrastructure/routine.api.datasource.ts (excerpt)" showLineNumbers
const res = await fetch(`${process.env.API_URL}/routines/${id}`, {
  method: 'DELETE',
  headers: { Authorization: `Bearer ${accessToken}` },
})
if (res.status === 401) return { ok: false } // the backend did not accept the token
if (res.status === 403) return { ok: false } // the backend says it is not theirs
```

### 7.3 `proxy.ts`: the first barrier

**What it does:** it runs before every request, decodes the token from the cookie and redirects: to `/login` if you request a protected route without a session, to `/routines` if you already have a session and go to `/login`, and to `/routines` if you request `/admin` without the `ADMIN` role. **What it is for:** to avoid rendering pages the user could not see, without spending a request to the backend. **How it relates:** it uses `decodeToken` from `session.ts`; Next.js runs it on its own, you do not call it. **It does not replace the DAL or the backend.**

```ts title="proxy.ts" showLineNumbers
import { NextRequest, NextResponse } from 'next/server'
import { decodeToken } from '@/lib/session'

const protectedRoutes = ['/routines', '/admin']
const publicRoutes = ['/login', '/register']

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtected = protectedRoutes.some((route) => path.startsWith(route))
  const isPublic = publicRoutes.includes(path)

  const payload = decodeToken(req.cookies.get('session')?.value)

  if (isProtected && !payload) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
  // User experience only: the backend checks the role again
  if (path.startsWith('/admin') && !payload?.roles.includes('ADMIN')) {
    return NextResponse.redirect(new URL('/routines', req.nextUrl))
  }
  if (isPublic && payload) {
    return NextResponse.redirect(new URL('/routines', req.nextUrl))
  }
  return NextResponse.next()
}

export const config = {
  // Do not run the proxy for static files or for /api
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
```

How to read it: `protectedRoutes` and `publicRoutes` are the route lists; `config.matcher` tells Next.js on which requests to run the proxy (all except static files). The role check redirects anyone who should not be in `/admin`, but a tampered token would get past it: what stops them from seeing admin data is the backend.

:::info[proxy.ts or middleware.ts]
Next.js 16 renamed `middleware.ts` to `proxy.ts` (and the exported function to `proxy`). In Next.js 15 or earlier the file is called `middleware.ts` and exports `middleware`.
:::

:::warning[Do not decide the session only in the layout]
Because of partial rendering, a layout **is not re-rendered** on every navigation between child routes: it would not see that the session changed. The layout only hydrates the interface (section 6.5); the session is required on each page (or, better, next to the data, with `requireSession`).
:::

### 7.4 Use roles in the interface

With the user and their roles in the state, any component can show or hide elements based on the role, without asking the backend anything:

```tsx title="src/components/Header.tsx (excerpt)" showLineNumbers
'use client'

import Link from 'next/link'
import { useAuth } from '@/features/auth/presentation/hooks/use-auth'

export function Header() {
  const { user, hasRole } = useAuth()

  return (
    <nav className="flex gap-4">
      <Link href="/routines">Mis rutinas</Link>
      {hasRole('ADMIN') && <Link href="/admin">Administración</Link>}
      {user && <span>Hola, {user.name}</span>}
    </nav>
  )
}
```

:::warning[Hiding is not protecting]
Hiding the admin link improves the experience, but anyone can type `/admin` or send the request by hand. The front end's roles are **for the interface only**; the backend is the one that checks that the token carries the role before handing over admin data.
:::

The token's data can be out of date until it expires (if a user's role was changed, the old token still says the previous role). If you need **fresh** data, ask the backend (`GET /auth/me` with the token); it costs a request, so do it only where it matters.

---

## Next step

You now have a session, `'use server'`, protected routes and roles in the interface. What is left is deciding what to do when something goes wrong: wrong credentials, a backend that is down, a page that does not exist. That is [error handling](./02-manejo-de-errores-nextjs.md).
