---
sidebar_position: 1
---


# React Router — Primeras funcionalidades (Data & Framework)

**Resumen rápido**  
Este documento muestra, en **modo Data** y **modo Framework**, las funcionalidades iniciales más importantes de **React Router**.
Para mayor información, puedes revisar la documentación oficial de [React Router](https://reactrouter.com/en/main).


## ¿Qué es y qué problema resuelve?
React Router es la librería estándar para ruteo en aplicaciones React: permite sincronizar la UI con la URL, soportar rutas anidadas, manejar historial del navegador, hacer navegación programática y **cargar / mutar datos en contexto de rutas (data routers)** evitando recargas completas de la página — todo pensado para SPAs y aplicaciones con renderizado en servidor/cliente.

**Problemas comunes que soluciona**
- Evitar recargas completas al navegar dentro de la app (experiencia SPA).
- Mantener la URL como fuente de la verdad para ver/compartir un estado/ubicación.
- Rutas anidadas y composición de layouts (Outlets).
- Integración de carga de datos por ruta (loaders) y envío de formularios (actions) de forma declarativa.
- Manejo de estados de navegación (pending, submitting) y fetches concurrentes (useFetcher).



## Modos principales: Data y Framework
La documentación oficial describe tres "modos" de uso; aquí nos enfocamos en **Data** y **Framework**:

- **Data mode**: rutas definidas como objetos que pueden tener `loader`, `action`, `errorElement`, `Component`, `children`, etc. Ideal cuando quieres que la propia librería gestione carga/validación/errores y comportamiento de formularios. Usa `createBrowserRouter` / `RouterProvider`.

- **Framework mode**: convenciones y utilidades pensadas para integraciones con frameworks o setups que separan el "entry" (por ejemplo rutas en `routes.ts`, `root.tsx`) y facilitan SSR/Hydration. Permite adaptar React Router a distintas arquitecturas de framework.



## Navegación: métodos y hooks
Principales formas de navegar y sus diferencias:

- `<Link to="...">` — enlace declarativo que evita recarga completa (equivalente a `<a>` para SPA).  
- `<NavLink>` — igual que `Link`, pero con estado `active`/`pending` para estilos condicionales. 
- `useNavigate()` — hook que devuelve una función `navigate(to, options)` para navegación programática (redirigir tras un evento/efecto). Opciones: `replace`, `preventScrollReset`, `relative`, etc. Es preferible usar `redirect()` dentro de loaders/actions cuando la navegación es el resultado de esos procesos. 
- `<Navigate to="..." replace />` — componente que navega cuando se renderiza (útil en clases o condicionales).
- `useHref`, `generatePath` — para obtener URLs a partir de rutas con params.
- `redirect()` — utilidad para devolver en loaders/actions una redirección desde el servidor/lógica de ruteo. 



## Modo Data — ejemplos y patrones

### 1) Router con loaders (createBrowserRouter + RouterProvider)
```js
// src/main.jsx
import { createBrowserRouter, RouterProvider } from "react-router";
import Root from "./routes/Root";
import Users, { loader as usersLoader } from "./routes/Users";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: () => <h1>Home</h1> },
      { path: "users", loader: usersLoader, Component: Users },
    ],
  },
]);

// render
import { createRoot } from "react-dom/client";
createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
```

### 2) Loader y useLoaderData
```js
// src/routes/Users.jsx
import { useLoaderData, Link } from "react-router";

export async function loader() {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Response("Error cargando usuarios", { status: 502 });
  return res.json(); // puede devolver objetos, promesas, fechas, etc.
}

export default function Users() {
  const users = useLoaderData();
  return (
    <div>
      <h2>Usuarios</h2>
      <ul>
        {users.map(u => (
          <li key={u.id}><Link to={String(u.id)}>{u.name}</Link></li>
        ))}
      </ul>
    </div>
  );
}
```
*Nota:* los `loader`s se ejecutan antes de renderizar la ruta y su resultado está disponible con `useLoaderData`. Esto facilita que la UI tenga los datos listos al montarse. 

### 3) Actions y `<Form>` (envío progresivo)
```js
// src/routes/newUser.jsx
import { Form, redirect, useActionData } from "react-router";

export async function action({ request }) {
  const formData = await request.formData();
  const name = formData.get("name");
  // crear en backend...
  await fetch("/api/users", {
    method: "POST",
    body: JSON.stringify({ name }),
    headers: { "Content-Type": "application/json" },
  });
  // redirigir tras la creación
  return redirect("/users");
}

export default function NewUser() {
  const actionData = useActionData();
  return (
    <Form method="post">
      <input name="name" placeholder="Nombre" />
      <button type="submit">Crear</button>
      {actionData?.error && <p className="error">{actionData.error}</p>}
    </Form>
  );
}
```
El `<Form>` es una versión "progressively enhanced" del `<form>` HTML que funciona incluso sin JS y activa las acciones/estados de navegación (submitting). 

### 4) useFetcher — interacciones sin navegación
```js
import { useFetcher } from "react-router";

function FavoriteButton({ postId }) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" action={`/posts/${postId}/favorite`}>
      <button type="submit" disabled={fetcher.state === "submitting"}>
        {fetcher.state === "submitting" ? "Guardando..." : "Favorito"}
      </button>
    </fetcher.Form>
  );
}
```
`useFetcher` permite llamar loaders/actions sin cambiar la ruta actual (perfecto para popovers, botones en listas, signups rápidos). 

### 5) Redirecciones desde loaders/actions
```js
import { redirect } from "react-router";

export async function loader({ request }) {
  const user = await authCheck(request);
  if (!user) return redirect("/login");
  return { user };
}
```
Usar `redirect()` dentro de loaders/actions produce una navegación controlada por la librería, con comportamiento consistente en cliente/servidor. 

### 6) Manejo de errores por ruta
```js
{
  path: "users/:id",
  loader: userLoader,
  Component: User,
  errorElement: <UserError />
}
```
`errorElement` permite mostrar un UI específico cuando el loader lanza una `Response` o excepción.



## Modo Framework — integración con frameworks / SSR
En **Framework mode** se usan convenciones (archivos `root.tsx`, `routes.ts`, `entry.server.tsx`, etc.) para integrar React Router con frameworks que hacen SSR/SSG/streaming. El objetivo es ofrecer puntos de integración y herramientras para hydrating, rutas como módulos y adaptadores para distintas plataformas (por ejemplo aprovechando `createStaticHandler` o `ServerRouter`). Consulta los "Framework Conventions" de la docs para adaptarlo a tu infraestructura. 

**Ejemplo (esquema de integración simple)**
```ts
// routes.ts (definición de rutas en módulos)
import Root from "./root";
import Home, { loader as homeLoader } from "./routes/home";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  { path: "/", Component: Root, children: [{ index: true, Component: Home, loader: homeLoader }] }
]);

// entry.client.tsx
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { hydrateRoot } from "react-dom/client";

hydrateRoot(document, <RouterProvider router={router} />);
```
En setups con SSR se usan `entry.server.tsx` y `ServerRouter` / `createStaticHandler` para manejar peticiones desde el servidor y devolver markup ya con datos cargados.



## Recursos y documentación oficial
- React Router – Home / guía principal. 
- Data Loading (loaders) — ejemplos y patrones. 
- Navigating (Link, NavLink, useNavigate) — guía de navegación. 
- useNavigate API — detalles de `navigate(to, options)`. 
- useFetcher — interactuar con loaders/actions sin navegar. 
- Framework Conventions — integración con frameworks y SSR.
