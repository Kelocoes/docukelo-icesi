---
sidebar_position: 1
description: "What a session is, how to store and decode the token issued by the backend in an httpOnly cookie, keep the user, their role and their permissions in Redux, and what 'use server' is in Next.js."
---

# Sessions in Next.js

In [week 12](../semana-12/03-configuracion-redux-nextjs.md) we stored state with Redux and organized the project with Clean Architecture. In the [week 13 in-class assignment](../semana-13/03-trabajo-en-clase.md) we built login and registration as visual screens. Something is still missing: **nothing remembers who signed in**. If you reload, Redux starts empty.

This document solves that half of the problem: the **session**. The other half, preventing anyone from entering a route or running an action without permission, is the topic of the next document: [Protected routes](./02-rutas-protegidas-en-nextjs.md).

We assume a realistic architecture: **a backend issues the token** (a JWT) and **verifies it on every request**. The front end only does three things with it: it stores it, it **decodes** it to know who the user is, which role and which permissions they have, and it forwards it. By the end you will know:

1. **What a session is** and where it is best stored.
2. **How to configure it**: store the token in a cookie and decode it.
3. **How to integrate it into your architecture**: which layer each file belongs to and how they relate.
4. **What `'use server'` is**, what it is for and how to use it.
5. **How to implement login, registration and sign out**, and how to keep the user in the interface after a reload.

Error handling has its own document: [Error handling in Next.js](./03-manejo-de-errores-nextjs.md). Everything follows the [official Next.js authentication documentation](https://nextjs.org/docs/app/guides/authentication), adapted to the course architecture.

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

There are also two ways to organize the session. In the first, the token is a **JWT**: it carries the data inside (the id, the name, the role, the permissions, the expiry) and the backend verifies it with its key, without querying a database. It is the one we will use because the backend issues a JWT. In the second, the cookie only holds an id and the data lives on the server:

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

The lifecycle has three moments, and each one is solved by a different piece:

| Moment | What happens | Who does it |
| :--- | :--- | :--- |
| **Sign in** | The backend checks the credentials and hands out a token; the front end decodes it and stores it in a cookie. | The backend (here, a mock), a Server Action (`loginAction`) and `session.ts`. |
| **Request a protected route** | The browser sends the cookie on its own; the server decodes the token, sees that it has not expired and lets the request through. | `proxy.ts` and the DAL. We build them in the [next document](./02-rutas-protegidas-en-nextjs.md). |
| **Sign out** | The server deletes the cookie. | A Server Action (`logoutAction`) and `session.ts`. |

---

## 3. Configure the session: store and decode the token

In this architecture **the backend issues and verifies the token; the front end does not create it, sign it or verify it**. Its job has three parts:

1. **Store it** in an `httpOnly` cookie, so it survives reloads and JavaScript cannot read it.
2. **Decode it** to know who the user is, which role and which permissions they have (the id, the name, the role, the permissions and the expiry are inside the token) **without making any request**. That information is kept in the application state to use it in the interface.
3. **Forward it** to the backend on every call (`Authorization: Bearer ...`). The backend verifies the signature and decides.

:::note[In the course the backend is a mock]
While there is no backend, the mocked datasource plays the backend: when the credentials are correct it returns a JWT with the id, the name, the role and the permissions, signed with a test secret. When a real backend exists, you only replace that datasource with an HTTP one (section 4); the rest of the code does not notice.
:::

### Signing, verifying and decoding are not the same thing

| Operation | What it does | Who does it here |
| :--- | :--- | :--- |
| **Sign** | Creates the token with a secret key. | The backend (in the course, the mock). |
| **Verify** | Checks with the key that nobody modified the token. | **The backend**, on every request it receives. |
| **Decode** | Reads the token content **without checking anything**. It needs no key. | **The front end**, with `jwt-decode`. |

:::warning[What the front end decodes is only good for the interface]
A JWT can be read without the key (it is base64). If someone modifies its content (for example, `permissions: ["create_routines"]`), the front end decodes it anyway and would believe it. That is why what the front end reads is for **showing or hiding** things, never for **protecting data**: the backend verifies the signature and decides. A fake token does not get a single piece of data.
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
| `zod` | Validates the data coming into the Server Actions. |
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

**`session.ts` is the only file that knows how the session is stored and read.** The rest use it; nobody else touches the cookie:

| Function | What it does | Who calls it |
| :--- | :--- | :--- |
| `decodeToken` | Reads the token content and discards an expired one; returns the content or `null`. It does not verify the signature. | `createSession` and, in the next document, the DAL and the proxy. |
| `createSession` | Decodes the token handed out by the backend and stores it in the cookie, with the token's expiry. Returns the content. | `loginAction`. |
| `deleteSession` | Deletes the cookie. | `logoutAction`. |

```ts title="src/lib/session.ts" showLineNumbers
import 'server-only'
import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'session'

export type TokenPayload = {
  sub: string // user id
  name: string
  role: string // for example 'USER' or 'ADMIN'
  permissions: string[] // for example ['view_routines', 'create_routines']
  exp: number // expiry, in seconds since 1970
}

// Reads the token content. It does NOT verify the signature: the backend does that.
export function decodeToken(token: string | undefined): TokenPayload | null {
  if (!token) return null
  try {
    const payload = jwtDecode<TokenPayload>(token)
    if (typeof payload.exp !== 'number' || payload.exp * 1000 < Date.now()) return null // already expired
    return payload
  } catch {
    return null // it does not look like a JWT
  }
}

export async function createSession(token: string): Promise<TokenPayload> {
  const payload = decodeToken(token)
  if (!payload) throw new Error('El backend entregó un token inválido')

  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true, // browser JavaScript cannot read the cookie (protects against XSS)
    secure: process.env.NODE_ENV === 'production', // only travels over HTTPS in production; http://localhost is allowed in development
    sameSite: 'lax', // not sent on cross-site requests, except when following a link (protects against CSRF)
    expires: new Date(payload.exp * 1000), // exp is in seconds and Date expects milliseconds; the cookie expires when the token does
    path: '/', // the cookie is sent on every route of the application
  })
  return payload
}

export async function deleteSession(): Promise<void> {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}
```

How to read it: `decodeToken` returns `null` instead of throwing, because "there is no session" is a normal result, not a failure. Checking `exp` is not verifying the signature: it only avoids treating an expired token as a session. `createSession` stores **the same token** the backend handed out. The options of `store.set` are explained in the piece.

:::tip[Why `secure` depends on the environment]
`secure: true` requires HTTPS. Most browsers allow it on `http://localhost`, but Safari does not. That is why the cookie is only `secure` in production.
:::

:::note[When the token expires]
The cookie expires at the same time as the token, so the server stops finding a session and the login is requested again. Real backends usually also hand out a *refresh token* to renew the session without asking for the password; we do not cover it here.
:::

---

## 4. Integrate it into your architecture

The dependency rule from week 12 does not change: **the domain knows nothing about cookies or JWTs**. A cookie is an HTTP detail and a JWT is a backend detail. The domain only answers one question: "do these credentials give me a token?". Everything else (the cookie, the form, the state) lives outside.

This piece shows the week 12 and 13 project and where each new session file goes. Hover over or tap each line to see its purpose.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/estructura-auth/index.html#fase=2"
  title="Folder structure of the project with the auth feature and the session"
  height={1200}
/>

The `auth` feature has the same shape as `routines`. Each file plays a role and builds on the previous one:

| Layer | File | What it does | Used by |
| :--- | :--- | :--- | :--- |
| Domain | `AuthTokens`, `User`, `AuthRepository`, `LoginUseCase`, `RegisterUseCase` | Defines what a login hands out (a token), answers whether some credentials get it and applies the registration rules. | The Server Action. |
| Infrastructure | `AuthMockDatasource` (today), `AuthApiDatasource` (real backend), DTOs, mappers and `AuthRepositoryImpl` | They ask the backend for the token and fulfil the domain contract. | The container. |
| DI | `auth.container.ts` | Assembles the use cases with their dependencies. | The Server Action. |
| Presentation | `loginAction`, `registerAction` and `logoutAction` (Server Actions) | They validate, ask for the token, store it with `createSession` and return the user with their role and permissions. They run on the server. | The thunk. |
| Presentation | `auth.slice.ts` (thunks) and `AuthViewModelMapper` | They call the actions and store in Redux the user already prepared for display (with the avatar initials) and the login state. | The hook. |
| Presentation | `useAuth()` | Facade hook: the only thing the interface knows (`user`, `login`, `register`, `logout`, `hasRole`, `hasPermission`...). | `LoginForm`, `RegisterForm`, the `Header` and any component. |
| Presentation | `LoginForm`, `RegisterForm` | The week 13 interface. | The `/login` and `/register` pages. |
| Presentation | `AuthHydrator` | Fills the store with the session when the page loads or reloads. | The root layout. |
| Cross-cutting | `src/lib/session.ts`, `src/lib/dal.ts` | Decode and store the token; hand the session to the server. Several features use them. | The actions and the layout. |

`session.ts` and `dal.ts` go in `src/lib/`, just like `src/store/` with Redux: they do not belong to a feature because any protected feature needs them.

These are the files of the `auth` part that Next.js does not touch. The first two are domain; the third is **the simulated backend** (later replaced by the real one); the fourth assembles everything.

<Tabs>
<TabItem value="contrato" label="Contract and use cases" default>

The domain defines **what** a login hands out and **what** it needs from outside, without saying how it is obtained. For it, the token is an opaque string:

```ts title="src/features/auth/domain/entities/auth-tokens.ts" showLineNumbers
export interface AuthTokens {
  readonly accessToken: string
}
```

```ts title="src/features/auth/domain/repositories/auth.repository.ts" showLineNumbers
export interface AuthRepository {
  login(params: LoginParams): Promise<AuthTokens | null>
  register(params: RegisterParams): Promise<User>
}
```

One use case per user action. This one normalizes the email and asks the repository for the tokens; it returns `null` if the credentials are no good. Invalid credentials are an **expected** result, which is why it does not throw an exception:

```ts title="src/features/auth/domain/usecases/login.usecase.ts" showLineNumbers
export class LoginUseCase {
  constructor(private readonly repository: AuthRepository) {}

  async execute(params: LoginParams): Promise<AuthTokens | null> {
    const email = params.email.trim().toLowerCase()
    if (email === '' || params.password === '') return null

    return await this.repository.login({ email, password: params.password })
  }
}
```

Registration follows the same path with `RegisterUseCase` and `User`, but it **does not create a session**: it creates the account and the form sends the user to `/login`.

</TabItem>
<TabItem value="mock" label="Simulated backend (mock)">

The mock does what the backend would do: if the credentials are correct, it **builds a JWT** with the user's id, name, role and permissions, expiring in one hour. It signs it by hand with Node's `crypto` module (a JWT is `header.content.signature`), so no token library is needed. It carries `import 'server-only'` because it contains users and the key:

```ts title="src/features/auth/infrastructure/datasources/auth-mock-datasource.ts" showLineNumbers
import 'server-only'
import { createHmac } from 'node:crypto'

const MOCK_SECRET = 'secreto-de-prueba' // the simulated "backend secret"
const USER_PERMISSIONS = ['view_routines']
const ADMIN_PERMISSIONS = ['view_routines', 'create_routines']

const USERS = [
  { id: 1, full_name: 'Ana Pérez', email: 'ana@icesi.edu.co', password: '123456', role: 'USER', permissions: USER_PERMISSIONS },
  { id: 2, full_name: 'Admin Icesi', email: 'admin@icesi.edu.co', password: 'admin123', role: 'ADMIN', permissions: ADMIN_PERMISSIONS },
]

const base64url = (data: object) => Buffer.from(JSON.stringify(data)).toString('base64url')

// Builds an HS256 JWT: header.content.signature
function signMockToken(payload: object) {
  const body = `${base64url({ alg: 'HS256', typ: 'JWT' })}.${base64url(payload)}`
  const signature = createHmac('sha256', MOCK_SECRET).update(body).digest('base64url')
  return `${body}.${signature}`
}

// Simulates the backend's POST /auth/login
export class AuthMockDatasource {
  async login(dto: { email: string; password: string }) {
    const user = USERS.find((u) => u.email === dto.email && u.password === dto.password)
    if (!user) return null // the backend would answer 401

    const exp = Math.floor(Date.now() / 1000) + 60 * 60 // expires in 1 hour
    const accessToken = signMockToken({
      sub: String(user.id),
      name: user.full_name,
      role: user.role,
      permissions: user.permissions,
      exp,
    })
    return { access_token: accessToken }
  }
}
```

The repository fulfils the domain contract with any datasource that has `login` (the mock today, the HTTP one tomorrow), and a mapper turns `access_token` into the domain's `accessToken`:

```ts title="src/features/auth/infrastructure/repositories/auth.repository.impl.ts" showLineNumbers
export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly datasource: AuthDatasource) {}

  async login(params: LoginParams): Promise<AuthTokens | null> {
    const dto = await this.datasource.login(UserMapper.toLoginDto(params))
    return dto ? AuthTokensMapper.toDomain(dto) : null
  }
  // register(...) is the same: datasource + mapper
}
```

:::warning[For class only]
Storing the password in plain text and signing with a secret written in the code only works for the mock. A real backend stores a password *hash* (for example with bcrypt) and its key is never in the code. In addition, this mock **does not verify** the signature of the tokens it receives: a real backend does.
:::

</TabItem>
<TabItem value="api" label="Real backend">

When the backend exists, this datasource takes the mock's place. It makes the login POST and returns the token **the backend signed**:

```ts title="src/features/auth/infrastructure/datasources/auth-api-datasource.ts" showLineNumbers
import 'server-only'

export class AuthApiDatasource {
  async login(dto: { email: string; password: string }) {
    const res = await fetch(`${process.env.API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })

    if (res.status === 401) return null // expected error: invalid credentials
    if (!res.ok) throw new Error('El backend no respondió') // unexpected error

    return (await res.json()) as { access_token: string }
  }
}
```

A 401 is an **expected** error (it returns `null`, like the mock); any other failure is **unexpected** and is thrown. The [error handling document](./03-manejo-de-errores-nextjs.md) shows what happens with each one. The only environment variable the front end needs is the API address:

```text title=".env.local"
API_URL=http://localhost:3001
```

</TabItem>
<TabItem value="di" label="Container">

The Composition Root assembles the pieces. Switching from the mock to the real backend is **this single line**. It carries `import 'server-only'` because it **must never reach the browser**:

```ts title="src/features/auth/di/auth.container.ts" showLineNumbers
import 'server-only'

const datasource = new AuthMockDatasource() // later: new AuthApiDatasource()
const repository = new AuthRepositoryImpl(datasource)

export const authContainer = {
  login: new LoginUseCase(repository),
  register: new RegisterUseCase(repository),
}
```

</TabItem>
</Tabs>

What is left is the part that touches Next.js: the action, the slice, the hook and the form. First you need to understand what `'use server'` is.

---

## 5. `'use server'` and Server Actions

So far all the application code runs in the browser (client components, thunks) or on the server while rendering (Server Components). But sometimes the browser needs to **ask the server to run something**: request the token from the backend, write an `httpOnly` cookie, save to a database. A **Server Action** is a function you write in your project, but that runs on the server and is called from the browser as if it were local.

The `'use server'` directive is what marks that function. Follow a call from the thunk to `loginAction` and see what Next.js does; then go to "Sin use server" (Without use server).

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/use-server-que-hace/index.html"
  title="What use server does: the call crosses to the server, and what would happen without the directive"
  height={720}
/>

### Why the session needs the server

The session cookie is `httpOnly`, and a cookie like that **can only be created by the server**: that is exactly what prevents JavaScript from reading it. The server decides which cookie to create and sends it in the response with a `Set-Cookie` header; the **browser** stores it and resends it on its own on every request. That is why the code that writes the cookie has to run on the server, and a Server Action is the shortest way to have it.

### What it is and what it is for

- **What it does:** it marks functions as server code. Next.js does not include them in the browser's JavaScript: instead it hands out a "receipt" with an id. Calling the receipt sends a **POST** to the server, which looks up the real function by that id and runs it.
- **What we use it for:** for what only the server can or should do: **write an `httpOnly` cookie**, run logic with secrets that must not reach the browser (the datasource, the API address) and validate reliably.
- **What it saves you:** writing the endpoint, the route and the `fetch`. You call a function; Next.js does the rest.

### How it is written

There are two ways. The usual one in this course is to put the directive **at the top of a file**: every function it exports becomes a Server Action.

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

| Way | How | When |
| :--- | :--- | :--- |
| **As a form action** | `<form action={myAction}>`; it receives a `FormData`. With `useActionState` the component keeps the result. | It is the official guide's way: forms without extra JavaScript. |
| **From code** | `await myAction(arg1, arg2)` inside an event, a `useEffect` or **a thunk**; it receives normal arguments. | When you already have an architecture that decides when to call (our case: the thunk). |

### Rules to remember

| Rule | Why |
| :--- | :--- |
| Only **`async`** functions are exported. | The call travels over the network: it is always asynchronous. |
| Arguments and result must be **serializable** (text, numbers, plain objects). | They travel as data. You cannot return a class with methods or a function. |
| Its code **does not reach the browser**. | You can use secrets and datasources inside. |
| It is a **public endpoint**: anyone can send it a POST without going through your interface. | That is why you validate the data and, in the next document, require the session and the permission **inside each action**. |

:::warning[An action does not inherit the page's protections]
A page's session check does not cover the Server Actions that are defined or used in it: they are separate endpoints. The [next document](./02-rutas-protegidas-en-nextjs.md) shows how each action requires its session and its permission on its own.
:::

---

## 6. Implement login, registration and sign out

With all the pieces clear, the login flow is the week 12 chain (view, hook, thunk) plus a boundary with the server:

**`LoginForm` → `useAuth()` → thunk `loginMutation` → _[POST]_ → Server Action `loginAction` → `LoginUseCase` → backend**

The view knows neither Redux nor the action: the hook is the facade, just like `useRoutines`. The thunk runs in the browser and calls the action, which runs on the server. This piece walks through `loginAction` line by line, next to who calls it, the request and the response.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/anatomia-server-action/index.html"
  title="Anatomy of the loginAction Server Action: who calls it, validation, expected errors and cookie"
  height={1100}
/>

The following files are built from the bottom up (each one uses the previous).

### 6.1 The Server Action: the boundary with the server

**What it does:** it receives the email and password, validates them, asks the backend for the token through `LoginUseCase` and, if everything goes well, stores it in the cookie. **What it is for:** it is the only place where the domain (the token) and Next.js (the cookie) meet. **How it relates:** it uses `authContainer` (domain) and `createSession` (`session.ts`); the thunk calls it.

It always returns an `{ ok, ... }` object instead of throwing errors: expected errors (invalid data, wrong credentials) travel as a value, and that way a useful message reaches the screen. The user it returns (`id`, `name`, `role` and `permissions`) comes **from the token's content**, and it is the only thing the browser receives: the token stays in the `httpOnly` cookie, where JavaScript cannot read it.

Registration is also an action: the container is server-only, so the browser can only reach it through a Server Action. `registerAction` **does not create a session**: it creates the account and returns `{ ok: true }`; the form sends the user to `/login`.

```ts title="src/features/auth/presentation/actions/auth.actions.ts" showLineNumbers
'use server'

import { z } from 'zod'
import { authContainer } from '../../di/auth.container'
import { createSession, deleteSession } from '@/src/lib/session'

const loginSchema = z.object({
  email: z.email('Correo inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

const registerSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
})

export type AuthUser = { id: string; name: string; role: string; permissions: string[] }

export type LoginResult =
  | { ok: true; user: AuthUser }
  | { ok: false; message: string }

export type RegisterResult =
  | { ok: true }
  | { ok: false; message: string }

export async function loginAction(email: string, password: string): Promise<LoginResult> {
  const parsed = loginSchema.safeParse({ email, password })
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message }
  }

  const tokens = await authContainer.login.execute(parsed.data)
  if (!tokens) {
    return { ok: false, message: 'Credenciales inválidas' }
  }

  const payload = await createSession(tokens.accessToken)
  return {
    ok: true,
    user: { id: payload.sub, name: payload.name, role: payload.role, permissions: payload.permissions },
  }
}

export async function registerAction(input: {
  name: string
  email: string
  password: string
  confirmPassword: string
}): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, message: 'Los datos del formulario no son válidos' }
  }

  try {
    await authContainer.register.execute(parsed.data)
    return { ok: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'No se pudo crear la cuenta'
    return { ok: false, message }
  }
}

export async function logoutAction(): Promise<void> {
  await deleteSession()
}
```

How to read it, in order: (1) `'use server'` turns it into an endpoint; (2) the schemas define the valid format; (3) `loginAction` validates, and if it fails it returns the message; (4) it asks the use case for the token (which asks the backend); (5) `createSession` decodes and stores it, and the action returns the user with their role and permissions, **never the token or a password**. `registerAction` validates that the data is text (it is a public endpoint) and leaves the business rules to the use case. `logoutAction` only deletes the cookie.

### 6.2 The slice, the ViewModel and their thunks

**What it does:** it stores in Redux the session user (`user`) and the login state (`isLoading`, `errorMessage`), and defines the thunks that call the actions. **What it is for:** so that any component can know who the user is, their role and their permissions without requesting them again, just like `routines.slice.ts` with the routines. **How it relates:** it calls the actions; the hook reads it.

The thunk is the bridge between the browser and the server: it translates the action's `{ ok: false, message }` into a `rejectWithValue`, and catches unexpected failures (network, server) with a `try/catch`. The `setUser` reducer is used by `AuthHydrator` (below) to fill the store on reload.

The store does not keep the raw `AuthUser`, but a **ViewModel**: the same idea as `RoutineItemViewModel` from week 12. What the interface needs already comes calculated, such as the avatar initials:

```ts title="src/features/auth/presentation/viewmodels/auth.viewmodel.ts" showLineNumbers
import type { AuthUser } from '../actions/auth.actions'

export interface AuthUserViewModel {
  readonly id: string
  readonly displayName: string
  readonly role: string
  readonly permissions: string[]
  readonly initials: string
}

export class AuthViewModelMapper {
  static toViewModel(user: AuthUser): AuthUserViewModel {
    return {
      id: user.id,
      displayName: user.name,
      role: user.role,
      permissions: user.permissions,
      initials: AuthViewModelMapper.buildInitials(user.name),
    }
  }

  private static buildInitials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
  }
}
```

:::note[Why `permissions` is not `readonly string[]`]
Redux Toolkit reducers work on an Immer draft, which removes `readonly` from the state. TypeScript does not let you assign a read-only array to a mutable one, so the array is declared `string[]` and only the property is `readonly`.
:::

```ts title="src/features/auth/presentation/store/auth.slice.ts" showLineNumbers
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { loginAction, logoutAction, registerAction } from '../actions/auth.actions'
import type { LoginParams } from '../../domain/repositories/auth.repository'
import type { RegisterInput } from '../../domain/usecases/register.usecase'
import { AuthUserViewModel, AuthViewModelMapper } from '../viewmodels/auth.viewmodel'

interface AuthState {
  user: AuthUserViewModel | null
  isLoading: boolean
  errorMessage: string | null
}

const initialState: AuthState = { user: null, isLoading: false, errorMessage: null }

export const loginMutation = createAsyncThunk(
  'auth/login',
  async (params: LoginParams, { rejectWithValue }) => {
    try {
      const result = await loginAction(params.email, params.password)
      if (!result.ok) return rejectWithValue(result.message) // expected error
      return AuthViewModelMapper.toViewModel(result.user)
    } catch {
      return rejectWithValue('No se pudo iniciar sesión. Intenta de nuevo.') // unexpected error
    }
  }
)

export const registerMutation = createAsyncThunk(
  'auth/register',
  async (input: RegisterInput, { rejectWithValue }) => {
    try {
      const result = await registerAction(input)
      if (!result.ok) return rejectWithValue(result.message)
    } catch {
      return rejectWithValue('No se pudo crear la cuenta. Intenta de nuevo.')
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
    setUser: (state, action: PayloadAction<AuthUserViewModel | null>) => {
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
      .addCase(loginMutation.fulfilled, (state, action: PayloadAction<AuthUserViewModel>) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(loginMutation.rejected, (state, action) => {
        state.isLoading = false
        state.errorMessage = (action.payload as string) ?? 'No se pudo iniciar sesión'
      })

    builder
      .addCase(registerMutation.pending, (state) => {
        state.isLoading = true
        state.errorMessage = null
      })
      .addCase(registerMutation.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(registerMutation.rejected, (state, action) => {
        state.isLoading = false
        state.errorMessage = (action.payload as string) ?? 'No se pudo crear la cuenta'
      })

    builder.addCase(logoutMutation.fulfilled, (state) => {
      state.user = null
      state.errorMessage = null
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

Notice that **registration does not leave the user authenticated**: only the login stores the user in the state. The flow is to register and then sign in.

### 6.3 The facade hook

**What it does:** it exposes `user`, `isLoading`, `errorMessage`, `login()`, `register()`, `logout()`, `hasRole()` and `hasPermission()`. **What it is for:** it is the only thing the components know. If tomorrow you replace Redux with something else, or the action with a `fetch`, the components do not notice. **How it relates:** it dispatches the slice's thunks and it is used by `LoginForm`, `RegisterForm`, the `Header` and any component that depends on the user.

`login()` and `register()` return `true` if they succeeded: that way the component decides whether to navigate, without knowing Redux. `logout()` is asynchronous because it waits for the server to delete the cookie.

```ts title="src/features/auth/presentation/hooks/use-auth.ts" showLineNumbers
'use client'

import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/src/store/hooks'
import { clearError, loginMutation, logoutMutation, registerMutation } from '../store/auth.slice'
import type { LoginParams } from '../../domain/repositories/auth.repository'
import type { RegisterInput } from '../../domain/usecases/register.usecase'

export function useAuth() {
  const dispatch = useAppDispatch()

  const user = useAppSelector((state) => state.auth.user)
  const isLoading = useAppSelector((state) => state.auth.isLoading)
  const errorMessage = useAppSelector((state) => state.auth.errorMessage)

  const login = async (params: LoginParams): Promise<boolean> => {
    const resultAction = await dispatch(loginMutation(params))
    return loginMutation.fulfilled.match(resultAction) // true if the sign in succeeded
  }

  const register = async (input: RegisterInput): Promise<boolean> => {
    const resultAction = await dispatch(registerMutation(input))
    return registerMutation.fulfilled.match(resultAction)
  }

  const logout = async (): Promise<void> => {
    await dispatch(logoutMutation())
  }

  const resetError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const hasRole = (role: string): boolean => user?.role === role
  const hasPermission = (permission: string): boolean => !!user?.permissions.includes(permission)

  return { user, isAuthenticated: user !== null, isLoading, errorMessage, login, register, logout, resetError, hasRole, hasPermission }
}
```

### 6.4 The components

**What they do:** `LoginForm` is the week 13 form, now connected to the hook: on submit it calls `login()` and, if it succeeds, navigates with `router.replace('/routines')`. `RegisterForm` does the same with `register()` and, if it succeeds, navigates to `/login`. The `Header` shows the user's initials and signs out. **What they are for:** they are the only thing the user sees. **How they relate:** only to `useAuth`; they do not know Redux, a Server Action or a cookie exist.

```tsx title="src/features/auth/presentation/components/LoginForm.tsx (abridged)" showLineNumbers
'use client'

import { useState, type SyntheticEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/use-auth'

export function LoginForm() {
  const router = useRouter()
  const { login, isLoading, errorMessage } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function onSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const ok = await login({ email, password })
    if (ok) router.replace('/routines') // replace: "back" does not return to the login
  }

  // ...the fields and {errorMessage && <p role="alert">{errorMessage}</p>}
}
```

Signing out is a special case: you have to **wait** for the server to delete the cookie before navigating. A `<Link>` would navigate immediately; that is why the `Header` uses a button that waits for the sign out and then navigates:

```tsx title="src/shared/components/Header.tsx (excerpt)" showLineNumbers
'use client'

export function Header() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout() // deletes the cookie on the server
    router.replace('/login')
  }

  return (
    <header>
      <span>{user?.initials ?? '?'}</span>
      <button type="button" onClick={handleLogout}>Cerrar sesión</button>
    </header>
  )
}
```

:::info[The official guide's way]
The Next.js documentation uses `<form action={...}>` with `useActionState`: the form calls the Server Action directly and the state lives in the component. It is equivalent and shorter; here we use the thunk to respect the week 12 architecture (view, hook, store, action).
:::

### 6.5 Keep the session in the state on reload

After the login, the slice already has the user. But on **reload** Redux starts empty, even though the cookie is still there. It has to be filled again, and the client cannot decode the token on its own: it is in an `httpOnly` cookie, which JavaScript cannot read. So **the server** does it: the root layout reads the cookie and hands the client only the user, their role and their permissions (not the token) through a small component.

First, the piece that reads the session on the server. It is the **DAL** (*Data Access Layer*): the single place, on the server, that answers "who is making this request?". For now we only need `getSession()`:

```ts title="src/lib/dal.ts" showLineNumbers
import 'server-only'
import { cookies } from 'next/headers'
import { decodeToken, SESSION_COOKIE } from './session'

export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  const payload = decodeToken(token)
  if (!payload || !token) return null

  // userId, name, role and permissions come from the token: no need to ask the backend
  return { userId: payload.sub, name: payload.name, role: payload.role, permissions: payload.permissions, accessToken: token }
}
```

**What `AuthHydrator` does:** it receives the user as props and dispatches it to the store. **What it is for:** so that `useAuth()` returns the user from the very first moment, also after a reload. **How it relates:** it is rendered by the root layout, which gets the user with `getSession()`.

```tsx title="src/features/auth/presentation/components/AuthHydrator.tsx" showLineNumbers
'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/src/store/hooks'
import { setUser } from '../store/auth.slice'
import { AuthViewModelMapper } from '../viewmodels/auth.viewmodel'
import type { AuthUser } from '../actions/auth.actions'

export function AuthHydrator({ user }: { user: AuthUser | null }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setUser(user ? AuthViewModelMapper.toViewModel(user) : null))
  }, [dispatch, user])

  return null
}
```

```tsx title="app/layout.tsx" showLineNumbers
import { getSession } from '@/src/lib/dal'
import { StoreProvider } from '@/src/store/StoreProvider'
import { AuthHydrator } from '@/src/features/auth/presentation/components/AuthHydrator'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession() // reads the cookie; null if there is no session
  const user = session && {
    id: session.userId,
    name: session.name,
    role: session.role,
    permissions: session.permissions,
  }

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

Since the root layout reads cookies, all the routes go from static to dynamic (`ƒ` in the `npm run build` output): this is expected when the application depends on the session.

The complete journey, on reload, is this:

| Step | Where | What happens |
| :--- | :--- | :--- |
| 1 | Browser | You reload. It sends the request with the `session` cookie. |
| 2 | Server, in `layout.tsx` | `getSession()` reads the cookie and extracts `{ id, name, role, permissions }`. If there is no cookie, it returns `null`. |
| 3 | Server | The layout renders `<AuthHydrator user={...} />` and hands it that user. **The token is not sent.** |
| 4 | Browser | `AuthHydrator` appears on the page and runs `setUser(...)` in a `useEffect`. |
| 5 | Browser | Redux has the user and the avatar shows the initials. |

:::note[The avatar flickers for a moment on reload]
The effect runs **after** the first render, so for a moment the avatar shows `?`. It is not a failure: the session is still there. If you do not want that flicker, pass the user as the initial state when creating the store in `StoreProvider`.
:::

:::note[This does not protect anything]
The layout only **fills the interface**; it does not decide who can see what. A layout is not rendered again on every navigation between child routes, so it would not notice that the session changed. Protection is the topic of the next document.
:::

---

## Next step

You now have a session: the user signs in, the cookie survives reloads and the interface knows who they are. But anyone can still type `/routines` in the address bar, and anyone can send a POST to a Server Action. That is solved with [protected routes](./02-rutas-protegidas-en-nextjs.md): the proxy, the DAL and permissions.
