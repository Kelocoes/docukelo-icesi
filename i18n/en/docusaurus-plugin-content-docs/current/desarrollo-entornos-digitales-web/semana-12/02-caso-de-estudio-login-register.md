---
sidebar_position: 2
---

# Case Study: Login, Registration, and Navigation

In the previous lesson, we explored feature-based architecture and defined where API consumption logic should reside. Now we will put that structure into practice by building a complete, functional, and realistic case study: an application with login, user registration (*register*), and a protected main dashboard (*dashboard*) that queries authenticated data from the course backend.

Throughout this lab, you will learn how to connect the Next.js client to a real NestJS server, manage credentials using JWT tokens, handle reactive loading and error states in client forms, and master declarative and programmatic navigation mechanisms in the App Router.

:::note[Functional Design with Semantic HTML]
In this document, we will focus exclusively on architecture, REST API integration, and navigation flows. Interfaces will be built using **standard semantic HTML** (`<form>`, `<label>`, `<input>`, `<button>`, `<fieldset>` tags) without Tailwind CSS utility classes. The entire styling layer, responsive visual design, and daisyUI components will be incorporated in documents 03, 04, and 05.
:::

---

## 1. What We Are Going to Build

The goal of this case study is to implement an end-to-end authentication flow composed of three main screens:

1. **Registration Screen (`/register`)**: Allows a new user to create an account by submitting their username, email, and password. Upon successful completion, the system redirects the user to the login form.
2. **Login Screen (`/login`)**: Prompts for email and password. Upon validating credentials against the backend, it receives a JWT token, stores it in the client session, and redirects the user to the protected dashboard.
3. **Protected Dashboard (`/dashboard`)**: An internal screen that can only be viewed by users with an active session. This view queries the list of registered users from the backend using authenticated HTTP requests and provides dynamic links to view each user's details (`/users/[id]`).

### Application Navigation Map

To understand how the user moves between these views and which event triggers each transition, explore the following interactive diagram:

<iframe
  src="/interactive/desarrollo-entornos-digitales-web/semana-12/mapa-navegacion/index.html"
  title="Interactive navigation map between public and protected routes in Next.js"
  style={{ width: '100%', height: 640, border: 0 }}
  loading="lazy"
/>

### Connection to the Course Backend

Our Next.js frontend application will communicate with the official NestJS backend (`interfaces-3-202602`), which provides the following REST endpoints:

| Endpoint | Method | Authentication | Payload | Successful Response |
| :--- | :--- | :--- | :--- | :--- |
| `/auth/login` | `POST` | Public | `LoginInputDto`: `{ email, password }` | `201 Created` with JWT token in plain text |
| `/users` | `POST` | Public | `CreateUserDto`: `{ username, email, passwordHash, roleId, bio? }` | `201 Created` with registered user object |
| `/users` | `GET` | Protected (with guards) | None (`Authorization: Bearer <token>` header) | `200 OK` with `User[]` array |
| `/users/:id` | `GET` | Protected (with guards) | Numeric URL parameter (`:id`) | `200 OK` with `User` object |

:::note[If your backend does not have guards yet]
In the backend branch used in this session, authentication *guards* on `GET /users` and `GET /users/:id` are not yet enforced (they are activated in the security week). Consequently, the list responds identically without a token, but the frontend already sends the `Authorization: Bearer <token>` header via `apiFetch` so that integration is ready once activated.
:::

---

## 2. Setting Up the Project and the Backend

Before writing code in Next.js, it is essential to synchronize the frontend and backend runtime environments to avoid port conflicts and browser security blocks.

### Port Separation and Enabling CORS

By default, both Next.js applications and NestJS servers attempt to listen on port `3000`. If you run both projects on the same machine, a port collision will occur (*Address already in use*).

To solve this cleanly and clearly:

1. **Next.js (Frontend)**: Will run on its default port `http://localhost:3000`.
2. **NestJS (Backend)**: Will run on port `http://localhost:4000`.
3. **CORS (Cross-Origin Resource Sharing)**: Because the frontend and backend run on different origins (port 3000 vs. port 4000), the browser will block requests for security reasons unless the backend explicitly authorizes requests coming from `http://localhost:3000`.

In your NestJS backend project's `src/main.ts` file, define port `4000` and enable CORS before putting the server to listen:

```typescript title="backend/src/main.ts" showLineNumbers
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS to allow requests from the Next.js application
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // The backend listens on port 4000
  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`NestJS backend running on http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error('Error starting backend:', error);
  process.exit(1);
});
```

### Environment Variable in Next.js

At the root of the Next.js project, create the `.env.local` file to point the base URL to the backend:

```bash title=".env.local" showLineNumbers
NEXT_PUBLIC_API_URL=http://localhost:4000
```

:::tip[The NEXT_PUBLIC_ Prefix]
In Next.js, environment variables are private by default and only exist on the Node.js server. By prepending the `NEXT_PUBLIC_` prefix, we instruct the compiler to include this variable in the JavaScript bundle sent to the browser, allowing Client Components to read it via `process.env.NEXT_PUBLIC_API_URL`.
:::

---

## 3. Creating the Structure

Applying the feature-based architecture studied in lesson 01, we will organize our project by separating routing responsibilities (in `app/`), authentication functionality (in `features/auth/`), and cross-cutting utilities (in `shared/`).

<StepByStep>
  <Step number="1" title="Define Route Groups in app/">
    We leverage parenthesized route groups to apply different layouts without altering URLs:
    - `src/app/(auth)/`: Groups `/login` and `/register`. Uses a minimalist, centered layout free of navigation bars.
    - `src/app/(app)/`: Groups `/dashboard` and `/users/[id]`. Uses a layout that includes the application's global header and the `<AuthGuard>` security barrier.
  </Step>
  <Step number="2" title="Create the features/auth module">
    Centralizes visual form components (`LoginForm.tsx`, `RegisterForm.tsx`), the route guard (`AuthGuard.tsx`), the connection service (`auth.service.ts`), and TypeScript interfaces (`types.ts`).
  </Step>
  <Step number="3" title="Configure the shared/ layer">
    Defines the unified HTTP client (`src/shared/lib/api.ts`) and the credential manager in browser memory (`src/shared/lib/session.ts`).
  </Step>
</StepByStep>

The resulting folder tree for this case study is as follows:

```plaintext
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx              <-- Centered layout for authentication
│   │   ├── login/
│   │   │   └── page.tsx            <-- Renders <LoginForm />
│   │   └── register/
│   │       └── page.tsx            <-- Renders <RegisterForm />
│   ├── (app)/
│   │   ├── layout.tsx              <-- Layout with navbar and <AuthGuard />
│   │   ├── dashboard/
│   │   │   ├── loading.tsx         <-- Declarative loading state
│   │   │   └── page.tsx            <-- Lists users from backend
│   │   └── users/
│   │       └── [id]/
│   │           └── page.tsx        <-- Dynamic user detail
│   ├── layout.tsx                  <-- Root layout (html, body)
│   ├── not-found.tsx               <-- Custom 404 screen
│   └── page.tsx                    <-- Redirects to /login or /dashboard
├── features/
│   └── auth/
│       ├── components/
│       │   ├── AuthGuard.tsx
│       │   ├── LoginForm.tsx
│       │   └── RegisterForm.tsx
│       ├── services/
│       │   └── auth.service.ts
│       └── types.ts
└── shared/
    └── lib/
        ├── api.ts                  <-- fetch wrapper for REST calls
        └── session.ts              <-- Token management in localStorage
```

### Layout for Authentication

The `(auth)` group layout is responsible for positioning the forms in an isolated and centered manner:

```tsx title="src/app/(auth)/layout.tsx" showLineNumbers
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {children}
      </div>
    </main>
  );
}
```

Pages inside `(auth)` are thin and simply render the corresponding *feature* component:

```tsx title="src/app/(auth)/login/page.tsx" showLineNumbers
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return <LoginForm />;
}
```

```tsx title="src/app/(auth)/register/page.tsx" showLineNumbers
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default function RegisterPage() {
  return <RegisterForm />;
}
```

---

## 4. Consuming the API Step by Step

To communicate consistently with the NestJS backend, we will implement the data consumption chain: from the shared HTTP client to interactive form components.

### Login Flow Sequence

Before examining the code, let's analyze how messages flow between the form, the service layer, and the backend when the user logs in:

<iframe
  src="/interactive/desarrollo-entornos-digitales-web/semana-12/secuencia-login/index.html"
  title="Interactive sequence of the login authentication flow with JWT token and redirect"
  style={{ width: '100%', height: 640, border: 0 }}
  loading="lazy"
/>

### Step 1: The Shared HTTP Client (`api.ts`)

Instead of invoking `fetch` with repetitive configuration in each component, we build a wrapper that injects the base URL, attaches JSON headers, adds the authorization token when available, and extracts error messages returned by NestJS's `ValidationPipe`:

```typescript title="src/shared/lib/api.ts" showLineNumbers
import { session } from './session';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = session.getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`;
    try {
      const errorBody = await response.json();
      // NestJS ValidationPipe returns messages in errorBody.message (string or array of strings)
      if (Array.isArray(errorBody.message)) {
        errorMessage = errorBody.message.join(', ');
      } else if (typeof errorBody.message === 'string') {
        errorMessage = errorBody.message;
      }
    } catch {
      const errorText = await response.text();
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  // If the response is JSON, we parse it; if plain text (like the login JWT), return it directly
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return (await response.text()) as unknown as T;
}
```

### Step 2: Client Session Management (`session.ts`)

To preserve the token across page reloads in the browser, we encapsulate operations on `localStorage`:

```typescript title="src/shared/lib/session.ts" showLineNumbers
const TOKEN_KEY = 'auth_token';

export const session = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  },
};
```

:::warning[Production Security: localStorage vs. httpOnly Cookies]
In this pedagogical exercise, we store the JWT in `localStorage` due to its simplicity for reading and writing from JavaScript in the browser. However, in production commercial applications, storing tokens in `localStorage` poses a risk against **XSS** (*Cross-Site Scripting*) attacks, since any injected malicious script could access the credential. In real-world production environments, **cookies with the `httpOnly` attribute** are used, which are managed directly by the browser and are completely inaccessible to client-side JavaScript code.
:::

### Step 3: Feature Data Types (`types.ts`)

We define data contracts that match the DTOs and entities of the NestJS backend:

```typescript title="src/features/auth/types.ts" showLineNumbers
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  passwordHash: string; // The backend expects the field with this name and hashes it with bcrypt
  bio?: string;
  roleId: number;       // Numeric role identifier (for example, 1)
}

export interface UserRole {
  id: number;
  name: string;
  description?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  bio?: string;
  createdAt: string;
  role?: UserRole;
}
```

### Step 4: The Authentication Service (`auth.service.ts`)

The service isolates calls to the `/auth/login` and `/users` endpoints:

```typescript title="src/features/auth/services/auth.service.ts" showLineNumbers
import { apiFetch } from '@/shared/lib/api';
import { session } from '@/shared/lib/session';
import { LoginCredentials, RegisterData, User } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<string> {
    // The backend responds with the JWT as a plain text string
    const token = await apiFetch<string>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    session.setToken(token);
    return token;
  },

  async register(data: RegisterData): Promise<User> {
    return apiFetch<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout(): void {
    session.removeToken();
  },
};
```

### Step 5: Login Component (`LoginForm.tsx`)

Interactive forms are client components (`'use client'`). They manage local state with `useState` to capture user input, reflect waiting state during the request, and display clear error messages if authentication fails:

```tsx title="src/features/auth/components/LoginForm.tsx" showLineNumbers
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await authService.login({ email, password });
      // Immediate redirection replacing history
      router.replace('/dashboard');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unexpected error while logging in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <h1>Sign In</h1>
      <p>Enter your credentials to access the platform.</p>

      {errorMessage && (
        <div role="alert" style={{ color: 'red', marginBottom: '1rem' }}>
          <strong>Error: </strong> {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <fieldset disabled={isLoading} style={{ border: 'none', padding: 0 }}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="login-email">Email:</label>
            <br />
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="login-password">Password:</label>
            <br />
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ width: '100%', padding: '0.75rem', cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? 'Checking credentials...' : 'Sign In'}
          </button>
        </fieldset>
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        Don't have an account yet? <Link href="/register">Register here</Link>
      </p>
    </section>
  );
}
```

### Step 6: Registration Component (`RegisterForm.tsx`)

The registration form validates the minimum password length required by the backend DTO (`min: 8`) and checks that both passwords match before issuing the request:

```tsx title="src/features/auth/components/RegisterForm.tsx" showLineNumbers
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';

export function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic client-side validation
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must contain at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({
        username,
        email,
        passwordHash: password, // The backend hashes this field with bcrypt
        roleId: 1,              // General user role
      });

      // Successful registration: navigate to login so the user can sign in
      router.push('/login');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error registering account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <h1>Create Account</h1>
      <p>Register to start using the application.</p>

      {errorMessage && (
        <div role="alert" style={{ color: 'red', marginBottom: '1rem' }}>
          <strong>Error: </strong> {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <fieldset disabled={isLoading} style={{ border: 'none', padding: 0 }}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="reg-username">Username:</label>
            <br />
            <input
              id="reg-username"
              type="text"
              required
              minLength={3}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. JohnDoe"
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="reg-email">Email:</label>
            <br />
            <input
              id="reg-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="reg-password">Password (minimum 8 characters):</label>
            <br />
            <input
              id="reg-password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="reg-confirm">Confirm password:</label>
            <br />
            <input
              id="reg-confirm"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ width: '100%', padding: '0.75rem', cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </fieldset>
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        Already have an account? <Link href="/login">Sign in here</Link>
      </p>
    </section>
  );
}
```

---

## 5. Consuming the API in the Dashboard

When designing internal authenticated screens, a fundamental architectural question arises: **where should protected data consumption take place in Next.js?**

### The Client Storage Dilemma

In the previous step, we saved the JWT token in `localStorage`. However, `localStorage` is an API exclusive to the web browser. During server-side rendering (*Server-Side Rendering* or SSR), the Node.js server does not have physical access to the client's `localStorage`.

If we attempted to query `GET /users` directly from an asynchronous Server Component (`async function DashboardPage()`), the `Authorization: Bearer <token>` header would travel empty and the backend would reject the request with an HTTP `401 Unauthorized` error.

### The Pedagogical Solution: Dashboard as a Client Component

To resolve this challenge transparently and predictably in our design course, we implement the main dashboard as a **Client Component (`'use client'`)**. In this way:

1. The component mounts in the user's browser.
2. The `useEffect` function triggers on the client.
3. The client reads the token from `localStorage` and executes `apiFetch<User[]>('/users')`.
4. Local state stores the users and updates the view.

```tsx title="src/app/(app)/dashboard/page.tsx" showLineNumbers
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/shared/lib/api';
import { User } from '@/features/auth/types';

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      try {
        const data = await apiFetch<User[]>('/users');
        if (isMounted) {
          setUsers(data);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Error loading users');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <p>Loading user list from backend...</p>;
  }

  if (errorMessage) {
    return (
      <div role="alert" style={{ color: 'red' }}>
        <p>Could not load information:</p>
        <p>{errorMessage}</p>
      </div>
    );
  }

  return (
    <article>
      <h1>Registered Users Dashboard</h1>
      <p>Total active users on the platform: {users.length}</p>

      {users.length === 0 ? (
        <p>No registered users found in the database.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {users.map((user) => (
            <li
              key={user.id}
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                marginBottom: '0.75rem',
                borderRadius: '4px',
              }}
            >
              <h3>{user.username}</h3>
              <p>Email: {user.email}</p>
              {user.bio && <p>Bio: {user.bio}</p>}
              <p>Role: {user.role?.name ?? 'No assigned role'}</p>
              <Link href={`/users/${user.id}`}>View full user details</Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
```

:::tip[When Would a Server Component Be Preferable?]
A Server Component would be ideal if we wanted to preload data directly on the server before delivering HTML to the client (improving SEO and eliminating loading flickers). To achieve this, the JWT token must not live in `localStorage`, but in an **HTTP cookie**. That way, the Server Component can read the credential on the server using the `cookies()` utility from `next/headers` and execute `fetch` prior to rendering the page.
:::

---

## 6. Navigation in This Case Study

In an interactive web application, navigation does not simply mean jumping from one link to another; it involves transitions after asynchronous actions, route protection, and intelligent history preservation.

### Navigation Mechanisms and When to Use Each

The Next.js App Router provides a catalog of specialized tools for each context:

| Mechanism | Environment | When to use it in this case study | Example in code |
| :--- | :--- | :--- | :--- |
| **`<Link>`** | Server and Client | Visible declarative links where the user deliberately clicks. | Jumping between `/login` and `/register`, top menu, going to `/users/[id]` detail. |
| **`router.push()`** | Client (`'use client'`) | Programmatic transition where **we do want** the user to be able to go back in history. | After successfully registering at `/register`, navigating to `/login`. |
| **`router.replace()`** | Client (`'use client'`) | Programmatic transition where **we do not want** the user to return to the previous screen. | After logging in at `/login`, or upon logging out from the menu. |
| **`router.back()`** | Client (`'use client'`) | Going back to the previous page in the browser history. | "Back to list" button on the user detail screen. |
| **`router.refresh()`** | Client (`'use client'`) | Refreshing data in the background without resetting the component's local state. | Re-fetching users after an update. |
| **`redirect()`** | Server | Redirecting immediately during execution on the server. | Redirecting to `/login` inside a Server Component or Server Action. |
| **`notFound()`** | Server | Triggering the 404 error interface when a resource does not exist. | If the requested user at `/users/[id]` does not exist in the database. |
| **`usePathname()`** | Client (`'use client'`) | Reading the current active route to visually highlight the active link. | Highlighting the "Dashboard" tab in the navigation bar. |

### The Complete Navigation Flow

Let's analyze in depth the technical navigation decisions made in our flow:

#### 1. Why `router.replace` and Not `router.push` After Login?

When a user logs in successfully, we execute:

```typescript
router.replace('/dashboard');
```

If we used `router.push('/dashboard')`, Next.js would add a new entry to the browser's history stack. If the user clicked the browser's **"Back"** button, they would see the login form again while already authenticated, causing confusion and interface errors. By using `replace()`, we substitute the `/login` URL with `/dashboard` in the active history entry.

#### 2. Logout Flow

Upon logging out, we clear the credential and redirect to login replacing the history:

```typescript
const handleLogout = () => {
  authService.logout();
  router.replace('/login');
};
```

#### 3. Route Protection with `AuthGuard`

To prevent an unauthenticated user from entering private screens by typing the URL directly in the browser, we implement a guard component (`AuthGuard`) that wraps the `(app)` group layout:

```tsx title="src/features/auth/components/AuthGuard.tsx" showLineNumbers
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { session } from '@/shared/lib/session';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!session.isAuthenticated()) {
      // If no token exists in localStorage, immediately expel to login
      router.replace('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return <p style={{ padding: '2rem' }}>Verifying access authorization...</p>;
  }

  return <>{children}</>;
}
```

This guard is integrated into the application's shared layout alongside the navigation bar:

```tsx title="src/app/(app)/layout.tsx" showLineNumbers
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authService } from '@/features/auth/services/auth.service';
import { AuthGuard } from '@/features/auth/components/AuthGuard';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    authService.logout();
    router.replace('/login');
  };

  return (
    <AuthGuard>
      <div>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            borderBottom: '1px solid #eee',
          }}
        >
          <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link
              href="/dashboard"
              style={{ fontWeight: pathname === '/dashboard' ? 'bold' : 'normal' }}
            >
              Dashboard
            </Link>
          </nav>
          <button type="button" onClick={handleLogout}>
            Sign Out
          </button>
        </header>
        <main style={{ padding: '2rem' }}>{children}</main>
      </div>
    </AuthGuard>
  );
}
```

:::note[Early Inspection with proxy.ts in Next.js 16]
In Next.js 16, the `middleware.ts` convention has officially been renamed to `proxy.ts` (`export function proxy(request: Request)`). The `proxy.ts` file allows intercepting HTTP requests at the network level before they reach layouts. Since `proxy.ts` runs on the server and cannot read `localStorage`, its use is reserved for architectures with `httpOnly` cookies, a topic we will address in advanced lessons.
:::

### Dynamic Routes: `params` as a Promise in Next.js 16

In the App Router, bracketed folders define dynamic route segments (such as `/users/[id]`).

Starting with **Next.js 15 and Next.js 16**, the `params` prop received by the page is no longer a synchronous object, but a **`Promise`**. To read the identifier in a server page, we must resolve it with `await`:

```tsx title="src/app/(app)/users/[id]/page.tsx" showLineNumbers
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // In Next.js 16 params is a Promise that must be awaited
  const { id } = await params;
  const userId = Number(id);

  if (isNaN(userId)) {
    notFound();
  }

  return (
    <article>
      <h1>User Detail #{id}</h1>
      <p>Loading technical information for user identifier: {id}</p>
      <Link href="/dashboard">Back to general dashboard</Link>
    </article>
  );
}
```

### Declarative UI States: `loading.tsx` and `not-found.tsx`

Next.js allows managing interface transitions through special files placed alongside `page.tsx`:

- **`src/app/(app)/dashboard/loading.tsx`**: Provides an instant loading interface wrapped in a `Suspense` boundary while the route completes its operations.
- **`src/app/not-found.tsx`**: Displays a custom 404 error view when a route does not exist or the `notFound()` function is invoked.

---

## 7. Testing Everything

Once all modules are built, it is time to verify system behavior using the following manual testing checklist:

| Test Scenario | Action to Perform | Expected Result |
| :--- | :--- | :--- |
| **Invalid credentials** | On `/login`, enter a non-existent email or wrong password and press "Sign In". | The button is temporarily disabled, there is no navigation, and the error message returned by NestJS appears (for example, *"Credenciales invalidas"* with a wrong password). |
| **Mismatched passwords** | On `/register`, enter different passwords in both fields. | Client validation stops submission, displays *"Passwords do not match"*, and does not contact the backend. |
| **Password too short** | On `/register`, enter a password with fewer than 8 characters. | The client or backend (`ValidationPipe`) rejects registration indicating the minimum length restriction. |
| **Backend offline** | Stop the NestJS server and attempt to log in at `/login`. | The application catches the network error in the `catch` block and displays a user-friendly message without crashing. |
| **Refresh with active session** | With an active session on `/dashboard`, press `F5` in the browser. | The token in `localStorage` persists, `AuthGuard` confirms authorization, and the user list reloads. |
| **Direct access without token** | Open an incognito tab and navigate directly to `http://localhost:3000/dashboard`. | `AuthGuard` detects the absence of the token and executes `router.replace('/login')` immediately. |
| **History after logout** | Click "Sign Out" and then press the browser's "Back" button. | The private dashboard cannot be viewed; the user remains on the login form. |

---

## Self-Assessment Quiz

<Quiz id="dedw-s12-02-caso-de-estudio-login-register-quiz">
  <Question title="Why is it necessary to configure the NestJS backend on a port other than port 3000?">
    <Option>Because Next.js only supports connections to even-numbered ports.</Option>
    <Option correct>Because Next.js runs by default on port 3000 and two processes cannot listen simultaneously on the same port.</Option>
    <Option>To force the browser to automatically activate the HTTPS protocol.</Option>
    <Option>Because NestJS's ValidationPipe requires port 4000 to validate DTOs.</Option>
  </Question>

  <Question title="What is the role of the NEXT_PUBLIC_ prefix in the NEXT_PUBLIC_API_URL variable?">
    <Option>Allows the environment variable to be stored in encrypted form in the database.</Option>
    <Option>Enables static compilation mode for production.</Option>
    <Option correct>Instructs Next.js that the variable must be exposed to JavaScript code running in the client browser.</Option>
    <Option>Automatically disables CORS security blocks on the server.</Option>
  </Question>

  <Question title="Why is router.replace('/dashboard') used instead of router.push('/dashboard') after a successful login?">
    <Option>Because router.replace is the only method that can send parameters to the server.</Option>
    <Option correct>To replace the history entry and prevent the user from returning to the login form upon pressing the Back button.</Option>
    <Option>Because router.push blocks reading tokens in localStorage.</Option>
    <Option>To force a full reload of the HTML document from origin.</Option>
  </Question>

  <Question title="What is the technical reason why the token in localStorage cannot be read in a Server Component during SSR?">
    <Option>Because Server Components can only process CSS stylesheet files.</Option>
    <Option correct>Because localStorage is a web browser API that does not exist in the Node.js server environment.</Option>
    <Option>Because NestJS removes local storage during the initial handshake.</Option>
    <Option>Because TypeScript prohibits using storage interfaces in asynchronous functions.</Option>
  </Question>

  <Question title="In Next.js 16, how are identifiers accessed in a dynamic route page like /users/[id]?">
    <Option>By reading props.params.id directly in a synchronous manner.</Option>
    <Option>By invoking the useDynamicId() hook in the page body.</Option>
    <Option correct>By resolving the promise using await params (for example, const &#123; id &#125; = await params).</Option>
    <Option>By extracting the value directly from the global variable process.env.ID.</Option>
  </Question>

  <Question title="Why should a standard HTML &lt;a href='/register'&gt; tag not be used to navigate between internal pages?">
    <Option>Because the browser will throw a CORS error upon clicking.</Option>
    <Option correct>Because it causes a full page reload, destroying the application's reactive in-memory state.</Option>
    <Option>Because Next.js disables anchor tags in projects with TypeScript.</Option>
    <Option>Because Route Groups only respond to keyboard events.</Option>
  </Question>

  <Question title="What security vulnerability do httpOnly cookies mitigate compared to localStorage in production environments?">
    <Option>Distributed Denial of Service (DDoS) attacks.</Option>
    <Option>Unauthorized dependency injections into the NestJS container.</Option>
    <Option correct>Credential theft through Cross-Site Scripting (XSS) attacks, since JavaScript cannot read them.</Option>
    <Option>Schema desynchronization in the relational database.</Option>
  </Question>

  <Question title="What is the role of the AuthGuard component implemented in the (app) group layout?">
    <Option>Encrypt user passwords using the bcrypt algorithm.</Option>
    <Option>Manage WebSocket connection for real-time notifications.</Option>
    <Option correct>Verify on the client whether an active token exists and immediately redirect to /login if the user is unauthenticated.</Option>
    <Option>Generate cryptographic JWT signatures in the browser.</Option>
  </Question>
</Quiz>
