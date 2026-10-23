---
sidebar_position: 4
description: "Navigate between routes in Next.js App Router using the Link component and the useRouter hook, including event-driven navigation."
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Event-Driven Navigation

Navigating in a web application means changing routes and updating the view without a full page reload in the browser. In Next.js (App Router), navigation can be initiated declaratively from the client or programmatically in both client components and on the server. In [Week 9](../semana-9/04-arquitectura-estructura-proyecto.md) we covered the basic folder structure and routing; now we will dive into triggering transitions via user events and interactions.

---

## Navigation Mechanisms

Next.js provides several tools to change routes or modify the URL depending on the execution context:

| Mechanism | Environment | When to Use | Example |
| :--- | :--- | :--- | :--- |
| **`<Link>`** | Client and Server | Static links and visible on-screen menus. | `<Link href="/productos">Catálogo</Link>` |
| **`router.push()`** | Client (`'use client'`) | Navigating after a user action or event. | `router.push('/productos')` |
| **`router.replace()`** | Client (`'use client'`) | Redirecting without adding the current route to history. | `router.replace('/dashboard')` |
| **`router.back()`** | Client (`'use client'`) | Going back to the previous page in history. | `router.back()` |
| **`router.forward()`** | Client (`'use client'`) | Moving forward to the next page in history. | `router.forward()` |
| **`router.refresh()`** | Client (`'use client'`) | Refreshing server data without losing local client state. | `router.refresh()` |
| **`redirect()`** | Server | Redirecting before rendering the page or inside an action. | `redirect('/login')` |
| **`permanentRedirect()`** | Server | Redirecting permanently (HTTP status code 308). | `permanentRedirect('/nuevo-catalogo')` |
| **`notFound()`** | Server | Rendering the 404 view when a record does not exist. | `notFound()` |
| **`pushState / replaceState`** | Client (`'use client'`) | Updating the URL without navigating or requesting the page from the server. | `window.history.pushState(null, '', '?orden=asc')` |

---

## The Link Component

The `<Link>` component is the standard declarative navigation mechanism in Next.js. It renders an accessible `<a>` tag and optimizes performance by prefetching routes in the background.

### Basic Usage and Dynamic Routes

For static routes or dynamic routes using template literals:

```tsx title="components/MenuNavegacion.tsx"
import Link from 'next/link';

export function MenuNavegacion({ productoId }: { productoId: string }) {
  return (
    <nav className="flex gap-4">
      <Link href="/productos">All products</Link>
      <Link href={`/productos/${productoId}`}>Product details</Link>
    </nav>
  );
}
```

### Main Props of Link

- **`replace`**: when `true`, replaces the current URL in the history stack instead of adding a new entry (`replace={true}`).
- **`scroll`**: controls whether the page scrolls to the top after navigation. Defaults to `true`. With `scroll={false}`, the vertical scroll position is preserved.
- **`prefetch`**: controls background prefetching when entering the viewport. In production, it defaults to `true`.

### Active Link with usePathname

To highlight the link for the page the user is currently on, use the `usePathname` hook:

```tsx title="components/NavLink.tsx"
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={isActive ? 'font-bold text-blue-600' : 'text-gray-600'}>
      {children}
    </Link>
  );
}
```

---

## The useRouter Hook

The `useRouter` hook allows programmatic navigation in response to JavaScript events.

It requires the `'use client'` directive because it accesses browser history, which only exists on the client.

### Available Methods

- **`router.push(href, options?)`**: navigates to the specified route and pushes a new entry onto the history stack.
- **`router.replace(href, options?)`**: navigates to the specified route and replaces the current entry in the history stack.
- **`router.back()`**: navigates back one position in browser history.
- **`router.forward()`**: navigates forward one position in browser history.
- **`router.refresh()`**: requests fresh Server Components from the server without resetting client local state.
- **`router.prefetch(href)`**: manually prefetches the code and data for a route in the background.

### Navigation with onClick

The most direct use case occurs when clicking a button or card:

```tsx title="components/BotonVerProducto.tsx"
'use client';

import { useRouter } from 'next/navigation';

export function BotonVerProducto({ id }: { id: string }) {
  const router = useRouter();

  return (
    <button type="button" onClick={() => router.push(`/productos/${id}`)}>
      View product
    </button>
  );
}
```

### Navigation After Form Submission

In a form, navigation should only execute once the asynchronous operation concludes successfully:

```tsx title="components/FormularioProducto.tsx" showLineNumbers
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function FormularioProducto() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const ok = await guardar({ nombre });
    if (ok) {
      router.push('/productos');
    } else {
      setError('The product could not be saved.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Product name"
      />
      <button type="submit">Save</button>
    </form>
  );
}

async function guardar(datos: { nombre: string }): Promise<boolean> {
  return datos.nombre.trim().length > 0;
}
```

Explore in the following interactive animation how saving flows between the User, the Client Component, and the Next.js Router. Toggle the bottom switch to simulate a failed save:

<InteractiveFrame
  src="/interactive/computacion-3/semana-12/navegacion-por-eventos/index.html"
  title="Interactive sequence of event-driven navigation after form submission"
  height={740}
/>

The flow above demonstrates two paths:
1. **Success**: the promise resolves successfully, the component enters the `if` block and executes `router.push('/productos')`. Next.js mounts the new view.
2. **Failure**: the promise returns `false`, enters the `else` block, sets error state, and does not invoke `router.push()`. The user preserves their entered text.

---

## push vs. replace

The difference between `router.push` and `router.replace` lies in how they manage the browser's history stack:

- **`push`**: adds a new URL to the top of the stack. The "Back" button returns to the previous screen.
- **`replace`**: replaces the current URL with the new one without expanding the stack. The "Back" button skips back to the route prior to the replaced one.

<ThemedImage
  alt="Browser History Stack: push vs. replace"
  sources={{
    light: useBaseUrl('/img/computacion-3/s12-push-vs-replace-light.svg'),
    dark: useBaseUrl('/img/computacion-3/s12-push-vs-replace-dark.svg'),
  }}
  style={{ width: '100%', maxWidth: 960, margin: '1.5rem auto', display: 'block' }}
/>

The classic use case for `replace` is user authentication. Once the user is logged in, redirecting with `replace` prevents pressing the "Back" button from returning to the login form:

```tsx title="components/FormularioLogin.tsx" showLineNumbers
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function FormularioLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await loginSimulado(email);
    if (ok) {
      router.replace('/dashboard');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Sign in</button>
    </form>
  );
}

async function loginSimulado(email: string): Promise<boolean> {
  return email.includes('@');
}
```

---

## Reading the URL

To read routes and parameters, Next.js provides utilities on both the client and the server.

### On the Client

In Client Components, three hooks from `next/navigation` are used:
- **`usePathname()`**: returns the current pathname (for example, `"/productos"`).
- **`useParams()`**: returns an object with dynamic route segments (for example, `{ id: '42' }`).
- **`useSearchParams()`**: returns a read-only instance of query parameters (for example, `?categoria=calzado`).

:::note[Suspense and useSearchParams]
Any Client Component that uses `useSearchParams()` must be wrapped inside a `<Suspense>` boundary to prevent disabling static prerendering for the page.
:::

Example of a reactive filter that updates `?categoria=` with `router.push`:

```tsx title="components/FiltroCategoria.tsx" showLineNumbers
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function FiltroCategoria() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSelect = (categoria: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoria) {
      params.set('categoria', categoria);
    } else {
      params.delete('categoria');
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <select onChange={(e) => handleSelect(e.target.value)}>
      <option value="">All</option>
      <option value="ropa">Clothing</option>
      <option value="calzado">Footwear</option>
    </select>
  );
}
```

### On the Server

In Next.js 16, the `params` and `searchParams` props received by server pages are promises (`Promise`) and must be resolved using `await`:

```tsx title="app/productos/[id]/page.tsx" showLineNumbers
interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ categoria?: string }>;
}

export default async function ProductoPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { categoria } = await searchParams;

  return (
    <main>
      <h1>Product: {id}</h1>
      <p>Active category: {categoria || 'general'}</p>
    </main>
  );
}
```

---

## Server-Side Navigation

In Server Components, Route Handlers, and Server Actions, the `useRouter` hook is not available. Navigation is managed using functions from `next/navigation`:

- **`redirect(url)`**: interrupts rendering and redirects the HTTP response to another route.
- **`permanentRedirect(url)`**: issues a permanent redirect with HTTP status code 308.
- **`notFound()`**: cancels rendering and displays the nearest `not-found.tsx` file.

### Example in Server Component and Server Action

```tsx title="app/dashboard/page.tsx"
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const sesion = await verificarSesion();
  if (!sesion) {
    redirect('/login');
  }

  return <h1>Private dashboard</h1>;
}

async function verificarSesion() {
  return null;
}
```

In a Server Action after saving a form:

```tsx title="app/acciones.ts"
'use server';

import { redirect } from 'next/navigation';

export async function crearProducto(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  // Save to the database...
  redirect('/productos');
}
```

For a non-existent resource:

```tsx title="app/productos/[id]/page.tsx"
import { notFound } from 'next/navigation';

export default async function ProductoDetalle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === '0' || id === 'inexistente') {
    notFound();
  }

  return <h1>Product {id}</h1>;
}
```

:::caution[Do Not Catch Redirects in try/catch]
Both `redirect()` and `notFound()` throw internal errors (`NEXT_REDIRECT` and `NEXT_NOT_FOUND`) to halt execution and pass control to Next.js. If you place them inside a generic `try/catch` block, the block will catch the error and prevent the redirect from working. If you need to catch other errors, call `redirect` outside the `try/catch`.
:::

---

## Native History API

In Client Components, you can directly use the browser's `window.history.pushState` and `window.history.replaceState` methods.

This allows updating the URL in the address bar (for example, when sorting a list or opening a secondary tab) without navigating or requesting the page again from the server. Next.js automatically synchronizes these calls with `usePathname` and `useSearchParams`.

```tsx title="components/OrdenLista.tsx" showLineNumbers
'use client';

import { useSearchParams } from 'next/navigation';

export function OrdenLista() {
  const searchParams = useSearchParams();

  const cambiarOrden = (orden: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('orden', orden);
    window.history.pushState(null, '', `?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      <button type="button" onClick={() => cambiarOrden('asc')}>Ascending</button>
      <button type="button" onClick={() => cambiarOrden('desc')}>Descending</button>
    </div>
  );
}
```

---

## Decision Guide

Apply this rule of thumb to choose the appropriate mechanism:

- If the user clicks a visible menu or button: use **`<Link>`**.
- If navigation depends on a client-side event or validation: use **`router.push`**.
- If you completed a flow that should not be reopened (login or checkout): use **`router.replace`**.
- If redirecting from the server due to missing session or permissions: use **`redirect`**.
- If the requested identifier does not exist in the database: use **`notFound`**.
- If you are only updating URL parameters without reloading views: use **`window.history.pushState`**.

---

## Common Pitfalls

| Mistake | Root Cause | Solution |
| :--- | :--- | :--- |
| **Importing from `next/router`** | Confusing the Pages Router package with the App Router package. | Always import `useRouter` from `next/navigation`. |
| **Calling `router.push` during render** | Executing navigation directly within the function body. | Move the call inside an event handler (`onClick`, `onSubmit`) or `useEffect`. |
| **Using `<a>` for internal routes** | Using native HTML anchors instead of the `<Link>` component. | Use `<Link>` to prevent full page reloads. |
| **Forgetting `'use client'` with `useRouter`** | Attempting to run interactive hooks inside a Server Component. | Add `'use client';` to the first line of the file. |

---

## Self-Assessment Quiz

<Quiz id="compunet3-s12-navegacion-eventos-quiz">
  <Question title="From which package should useRouter be imported when working with Next.js App Router?">
    <Option>next/router</Option>
    <Option correct>next/navigation</Option>
    <Option>next/link</Option>
    <Option>react-router-dom</Option>
  </Question>

  <Question title="Why is it mandatory to include the 'use client' directive in components using useRouter?">
    <Option>Because Server Components only support CSS stylesheet files.</Option>
    <Option correct>Because useRouter accesses browser history, which only exists on the client.</Option>
    <Option>Because it allows compiling the project in static mode without JavaScript.</Option>
    <Option>To force rendering of special HTTP headers.</Option>
  </Question>

  <Question title="What is the main difference between router.push and router.replace?">
    <Option>router.push restarts the browser and router.replace clears cookies.</Option>
    <Option correct>router.push adds an entry to the history stack, while router.replace substitutes the current entry.</Option>
    <Option>router.push only works on the server and router.replace on the client.</Option>
    <Option>router.replace only supports external absolute URLs.</Option>
  </Question>

  <Question title="Why is router.replace('/dashboard') recommended after a successful login?">
    <Option>To reduce the size of the downloaded JavaScript bundle.</Option>
    <Option correct>To prevent the user from returning to the login form when clicking the browser's 'Back' button.</Option>
    <Option>Because router.push is discouraged on protected screens.</Option>
    <Option>To force the browser to clear the image cache.</Option>
  </Question>

  <Question title="In Next.js 16, how are params and searchParams consumed within a server page?">
    <Option>By directly reading props.params.id synchronously.</Option>
    <Option correct>By awaiting the promises (for example, const &#123; id &#125; = await params).</Option>
    <Option>By using the useServerParams() hook in the header.</Option>
    <Option>Through the global variable process.env.PARAMS.</Option>
  </Question>

  <Question title="What is the purpose of the scroll=&#123;false&#125; prop in Link or useRouter?">
    <Option>It removes the scrollbar from the entire browser window.</Option>
    <Option correct>It preserves the vertical scroll position without automatically scrolling to the top.</Option>
    <Option>It speeds up the view transition animation.</Option>
    <Option>It prevents the next page from executing fetch requests.</Option>
  </Question>

  <Question title="Why should redirect('/login') not be wrapped inside a generic try/catch block?">
    <Option>Because it causes a memory leak in the Node.js server.</Option>
    <Option correct>Because redirect() throws an internal error (NEXT_REDIRECT) that the catch will intercept, preventing the redirect.</Option>
    <Option>Because Next.js disables the database connection when try/catch is detected.</Option>
    <Option>Because TypeScript produces an unresolvable compile error.</Option>
  </Question>

  <Question title="What happens if a native HTML &lt;a href='/productos'&gt; tag is used instead of &lt;Link href='/productos'&gt; for internal routes?">
    <Option>The application automatically changes visual themes.</Option>
    <Option correct>The browser performs a full page reload, losing in-memory React state.</Option>
    <Option>Next.js automatically converts the &lt;a&gt; tag into a Server Action.</Option>
    <Option>Navigation is blocked due to CORS security policies.</Option>
  </Question>
</Quiz>
