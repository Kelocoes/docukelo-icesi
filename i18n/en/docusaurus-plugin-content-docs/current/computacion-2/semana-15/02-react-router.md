---
sidebar_position: 2
description: "Build a multi-page React app with React Router in Data mode: installation, nested routes, navigation with useNavigate and the history, path variables and query params."
---

# React Router

An application built with React and Vite delivers **a single HTML file**, but users expect several pages: `/productos`, `/carrito`, a link they can share, and a Back button that works. **React Router** is the library that solves that. In this chapter we use its **Data mode** (`createBrowserRouter`), the recommended way for applications that run in the browser.

:::note[Interactive graphics]
The interactive graphics in this chapter are shown in Spanish.
:::

## The problem: an SPA has a single page

On a classic site, each URL corresponds to a **file** on the server: `/productos` requests `productos.html`. An SPA (_Single Page Application_) works differently: the server always delivers the same `index.html` and JavaScript builds what you see. So what is the URL for?

Browse the same store on both types of site and see what is requested from the server on each click:

<InteractiveFrame
  src="/interactive/computacion-2/semana-15/spa-vs-multipagina/index.html"
  title="Comparison between a classic site, with one HTML file per URL, and an SPA with React Router: what is requested from the server on each click"
  height={640}
/>

### What you should take away

- **React Router does not look for files.** The URL is data: the router compares it with a list of **routes** and decides which components to draw. To the user it looks like another page; in reality the DOM changed.
- **Navigating does not reload the page.** It changes the URL with the browser's `history` API and React updates only what changed, just like with state.
- **The URL is still useful.** It can be copied, bookmarked and used with Back and Forward.
- **On reload, the server does take part.** Since only `index.html` exists, the server must return it for **any** route. The Vite server already does it; when deploying, configure the rule (for example, `try_files` in Nginx or `rewrites` on the hosting).

## Installing React Router

React Router has three ways of being used. Here we use **Data** mode, where you define routes as objects and the router also knows how to load data:

| Mode | How it is defined | When |
| --- | --- | --- |
| **Declarative** | With components (`<Routes>`, `<Route>`) | The simplest, without data loading. |
| **Data** | With objects (`createBrowserRouter`) | **The one in this course:** routes, `loader`s and error handling. |
| **Framework** | With files and a Vite plugin | Full applications with SSR. |

Inside your Vite project, install the package:

```bash
npm install react-router
```

:::note[And react-router-dom?]
Up to version 6, the browser components lived in `react-router-dom`. Since version 7 everything is imported from `react-router`; in old tutorials you will see the other package.
:::

Create the router **once, outside any component**, and pass it to `RouterProvider`:

```jsx title="src/main.jsx" showLineNumbers
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

const router = createBrowserRouter([
  { path: "/", Component: () => <h1>Hola desde "/"</h1> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
```

`RouterProvider` replaces `<App />`: from here on, the router decides what is drawn according to the URL. Try it with `npm run dev` and open `http://localhost:5173/`.

## Routes, pages and subpages

Each route is an object with a `path` and the `Component` that is drawn when the URL matches. To have nested **subpages**, routes go inside `children`, and the parent decides where they are drawn with `<Outlet />`:

```jsx title="src/router.jsx" showLineNumbers
import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import Home from "./pages/Home";
import Lista from "./pages/Lista";
import Detalle from "./pages/Detalle";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      {
        path: "productos",
        children: [
          { index: true, Component: Lista },
          { path: ":id", Component: Detalle },
        ],
      },
    ],
  },
]);
```

```jsx title="src/pages/Root.jsx" showLineNumbers
import { Outlet, NavLink } from "react-router";

export default function Root() {
  return (
    <>
      <nav>
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/productos">Productos</NavLink>
      </nav>

      <Outlet />
    </>
  );
}
```

Go through the configuration and see what is drawn for each URL. Hover over the code or over the screen:

<InteractiveFrame
  src="/interactive/computacion-2/semana-15/rutas-anidadas/index.html"
  title="Nested routes in React Router Data mode: the root route as a layout with Outlet, index routes, a prefix and a dynamic route, linked to what is drawn for each URL"
  height={900}
/>

| Piece | What it is for |
| --- | --- |
| `path` | The URL segment the route handles. The parent's is added to the children's. |
| `Component` | What is drawn when the route matches. |
| `children` | Nested routes: they are drawn in the parent's `<Outlet />`. |
| `index: true` | The default child: it is drawn when the URL is exactly the parent's. |
| Route without `Component` | It only groups its children under a prefix (`productos`). |
| Route without `path` | A **layout**: it shares components without adding segments to the URL. |
| `:id` | Dynamic segment: it matches any value. |
| `*` | Wildcard: it matches any URL that did not match another route (ideal for the 404). |

### Link and NavLink: links that do not reload

A regular `<a href>` requests the page from the server and reloads everything. Instead, use:

- **`<Link to="/productos">`**: a link that changes the URL and notifies the router, without reloading.
- **`<NavLink to="/productos">`**: the same, but it knows whether its route is the current one and adds the `active` class to it (or the one you define with `className={({ isActive }) => ...}`), ideal for menus.

### A page for what does not exist

Add a wildcard route at the end of the list. If no other route matches, this one is drawn:

```jsx title="src/router.jsx" showLineNumbers
{ path: "*", Component: NotFound },
```

## Navigating: the history stack

Besides links, sometimes you have to navigate **from code**: when you finish logging in, when you save a form, when you press «Back». That is what the `useNavigate` hook is for:

```jsx title="Detalle.jsx" showLineNumbers
import { useNavigate } from "react-router";

export default function Detalle() {
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate("/carrito")}>Agregar al carrito</button>
      <button onClick={() => navigate(-1)}>Volver</button>
    </>
  );
}
```

To understand what `navigate("/carrito")` and `navigate(-1)` do, you have to understand **where the browser keeps the pages you visit**: in a **stack**.

### What a stack is

A **stack** is a collection where you only add and remove at **one end**, the top: the last one in is the first one out (LIFO), like a pile of plates. Compare it with a queue, where the first one in is the first one out:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-13/pila-vs-cola/index.html"
  title="Stack (LIFO) versus queue (FIFO): the exit order of the same elements"
  height={620}
/>

### The browser history

The history works like a stack with one difference: it has a **pointer** that marks which entry you are on. Going to a new page (`push`) adds an entry; Back and Forward destroy nothing, they only **move the pointer**. Try it, including what happens to what was ahead and what changes with `replace`:

<InteractiveFrame
  src="/interactive/computacion-2/semana-15/historial-navegacion/index.html"
  title="Navigation history simulator: how the stack of entries and the pointer change when navigating with navigate, Back, Forward and replace"
  height={720}
/>

| Call | What happens to the history |
| --- | --- |
| `navigate("/carrito")` | **Push:** adds a new entry and the pointer moves to it. If there were entries ahead, they are discarded. |
| `navigate(-1)` | **Back:** moves the pointer one entry down (equivalent to the Back button). |
| `navigate(1)` | **Forward:** moves the pointer one entry up. |
| `navigate("/gracias", { replace: true })` | **Replace:** replaces the current entry; the history does not grow. |

### When to use Link and when to use useNavigate

- **`<Link>`** when the user clicks on something that **is** a link: it is accessible, it can be opened in another tab and the browser understands it.
- **`navigate`** when the navigation is a **consequence** of something: a submission finished, the session expired, the user pressed a button that does more things.
- **`replace: true`** when you do not want Back to return to that page: after paying, after logging in or after a redirect.

## Data in the URL: path variables and query params

The URL can carry data. There are two ways and they are used for different things:

| | Path variable | Query params |
| --- | --- | --- |
| **Example** | `/productos/42` | `/productos?categoria=teclados&orden=precio` |
| **Defined in the route** | Yes: `productos/:id` | No: they are free |
| **Answers** | **Which** resource (product 42) | **How** to see it (filter, order, page) |
| **Is mandatory** | Yes, without it the route does not match | No, the route matches with or without them |
| **Hook to read it** | `useParams()` | `useSearchParams()` |

Go through how each one is read from a component:

<InteractiveFrame
  src="/interactive/computacion-2/semana-15/params-url/index.html"
  title="Anatomy of a URL with a path variable and query params and how they are read in a component with useParams and useSearchParams"
  height={800}
/>

### Navigating with a path variable

The list creates one link per product, putting its `id` in the URL; the `:id` route does the rest:

```jsx title="src/pages/Lista.jsx" showLineNumbers
import { Link } from "react-router";

const productos = [
  { id: 42, nombre: "Teclado" },
  { id: 7, nombre: "Mouse" },
];

export default function Lista() {
  return (
    <ul>
      {productos.map((p) => (
        <li key={p.id}>
          <Link to={`/productos/${p.id}`}>{p.nombre}</Link>
        </li>
      ))}
    </ul>
  );
}
```

```jsx title="src/pages/Detalle.jsx" showLineNumbers
import { useParams } from "react-router";

export default function Detalle() {
  const { id } = useParams();   // always a string: "42"

  return <h1>Producto {id}</h1>;
}
```

### Filtering with query params

`useSearchParams` is used like `useState`: it returns the current value and a function to change it. The difference is that the state **lives in the URL**, so the filter can be shared and survives a reload:

```jsx title="src/pages/Lista.jsx" showLineNumbers
import { useSearchParams } from "react-router";

export default function Lista() {
  const [params, setParams] = useSearchParams();
  const categoria = params.get("categoria");     // null if it does not exist

  const visibles = categoria
    ? productos.filter((p) => p.categoria === categoria)
    : productos;

  return (
    <>
      <button onClick={() => setParams({ categoria: "teclados" })}>Teclados</button>
      <button onClick={() => setParams({})}>Todos</button>

      {/* ...list of visibles */}
    </>
  );
}
```

Changing the query params **navigates** to the new URL (`/productos?categoria=teclados`) and the component runs again with the new value.

## Loading data with a loader

In Data mode, each route can have a `loader`: a function that runs **before** the route is drawn and receives the `params`. The data reaches the component with `useLoaderData`, without `useEffect` or a loading state:

```jsx title="src/router.jsx" showLineNumbers
{
  path: ":id",
  loader: async ({ params }) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${params.id}`);
    if (!res.ok) throw new Response("No existe", { status: 404 });
    return res.json();
  },
  Component: Detalle,
  ErrorBoundary: ErrorPagina,
}
```

```jsx title="src/pages/Detalle.jsx" showLineNumbers
import { useLoaderData } from "react-router";

export default function Detalle() {
  const usuario = useLoaderData();
  return <h1>{usuario.name}</h1>;
}
```

If the `loader` throws an error (or a `Response` with a status code), the router draws the route's `ErrorBoundary` instead of its `Component`. Inside it, `useRouteError()` returns whatever was thrown:

```jsx title="src/pages/ErrorPagina.jsx" showLineNumbers
import { useRouteError, isRouteErrorResponse } from "react-router";

export default function ErrorPagina() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <h1>{error.status}: {error.data}</h1>;
  }
  return <h1>Algo salió mal</h1>;
}
```

:::tip[When a loader and when a useEffect]
A `loader` is for data that the **page needs in order to exist** (the product for the `:id`): it is requested before drawing and the navigation waits. A `useEffect` remains the tool for synchronizing something with the component already on screen, as you saw in the hooks chapter.
:::

## Further Reading

- [React Router: Installation (Data mode)](https://reactrouter.com/start/data/installation)
- [React Router: Routing](https://reactrouter.com/start/data/routing)
- [React Router: Data Loading](https://reactrouter.com/start/data/data-loading)
- [useNavigate](https://reactrouter.com/api/hooks/useNavigate)
- [useParams](https://reactrouter.com/api/hooks/useParams)
- [useSearchParams](https://reactrouter.com/api/hooks/useSearchParams)
- [Error Boundaries](https://reactrouter.com/how-to/error-boundary)
- [History API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/History_API)

---

## Self-Assessment Quiz

<Quiz id="compunet2-s15-react-router-quiz">
  <Question title="In an SPA with React Router, what happens when you click a Link to /productos?">
    <Option>The browser requests the productos.html file from the server and reloads the page.</Option>
    <Option correct>The router reads the new URL, picks the components of that route and React updates the DOM, without requesting a page from the server.</Option>
    <Option>The server runs the component and returns the HTML already built.</Option>
    <Option>React Router downloads all the application's JavaScript again.</Option>
  </Question>
  <Question title="When reloading with F5 on /productos/42 of an SPA, why must the server return index.html for any route?">
    <Option>Because the browser does not understand URLs with parameters.</Option>
    <Option>Because React Router is uninstalled on reload.</Option>
    <Option correct>Because only one HTML file exists: without that rule the server would look for a /productos/42 file that does not exist and would respond 404.</Option>
    <Option>Because the server must recompile the application with Vite.</Option>
  </Question>
  <Question title="What is imported from react-router/dom in Data mode?">
    <Option>createBrowserRouter</Option>
    <Option>useNavigate</Option>
    <Option correct>RouterProvider</Option>
    <Option>Outlet</Option>
  </Question>
  <Question title="What is the Outlet component for?">
    <Option>To log the user out.</Option>
    <Option>To create links that do not reload the page.</Option>
    <Option correct>To mark where the child route that matches the URL is drawn inside the parent's component.</Option>
    <Option>To show the 404 page.</Option>
  </Question>
  <Question title="What does a route with index: true do?">
    <Option>It is the last route evaluated when none matches.</Option>
    <Option>It creates an index of all the child routes.</Option>
    <Option correct>It is drawn in its parent's Outlet when the URL matches exactly the parent's.</Option>
    <Option>It lets the route have several children with the same path.</Option>
  </Question>
  <Question title="You have a history with three entries and the pointer on the middle one (after pressing Back). If you navigate with navigate('/carrito'), what happens?">
    <Option>The entry ahead is kept and Forward keeps working.</Option>
    <Option>The history is erased completely.</Option>
    <Option correct>The entry ahead is discarded and the new one is pushed in its place.</Option>
    <Option>The current entry is replaced by the new one.</Option>
  </Question>
  <Question title="What is navigate('/gracias', { replace: true }) for after paying?">
    <Option>For the history to grow by one more entry.</Option>
    <Option correct>To replace the current entry so that Back does not return to the cart.</Option>
    <Option>To reload the whole page.</Option>
    <Option>To move the pointer one position back.</Option>
  </Question>
  <Question title="In the URL /productos/42?color=negro with the route productos/:id, what does each hook return?">
    <Option>useParams returns color and useSearchParams returns id.</Option>
    <Option>Both return the same object with id and color.</Option>
    <Option>useParams returns the id as a number (42) and useSearchParams is only for changing the URL.</Option>
    <Option correct>useParams returns the id as a string ("42") and useSearchParams lets you read color with get("color").</Option>
  </Question>
  <Question title="When is it better to use a query param instead of a path variable?">
    <Option>When the data identifies which resource is requested.</Option>
    <Option correct>When the data is optional and describes how to see the list: a filter, an order or a page.</Option>
    <Option>When the route must not match if the data is missing.</Option>
    <Option>Never, a path variable is always better.</Option>
  </Question>
</Quiz>
