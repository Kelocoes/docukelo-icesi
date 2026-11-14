---
sidebar_position: 2
description: "Protect the routes of a React app with a guard: a component with React Router's Outlet and Navigate that checks the stored token and, if you want, decodes it with jwt-decode."
---

# Route guards: protecting pages with React Router

In the previous chapter you stored the token in `localStorage`. But storing it prevents nothing: anyone can type `/dashboard` in the address bar and see the page even without logging in (the data would still be protected by the server, but the screen would be drawn). A **route guard** solves that: it is the door that checks whether there is a session **before** drawing the page.

:::note[Interactive graphics]
The interactive graphics in this chapter are shown in Spanish.
:::

## What a guard is

A guard is a **React Router component** that wraps a group of routes and decides one of two things:

- **Let through:** it returns `<Outlet />`, the slot where React Router draws the child route.
- **Block:** it returns `<Navigate />`, which redirects to another route (usually `/login`).

It draws nothing of its own and requests no data: it only **opens or closes the door**. You already know the two components it uses from [week 15](../semana-15/react-router): `Outlet` marks where child routes are drawn and `Navigate` changes route from JSX.

## The simplest guard

```jsx title="src/components/ProtectedRoute.jsx" showLineNumbers
import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

- **`localStorage.getItem("token")`** returns the token or `null`. The read is immediate: there is no request to the server.
- **`replace`** replaces the current history entry instead of adding a new one. Without it, the «Back» button would take the user to the blocked route, which would redirect them to the login again: an annoying loop.

## Connecting the guard to the router

The guard is used as a **parent route without a `path`**: it does not change the URL, it only wraps its children. Everything inside `children` is protected.

```jsx title="src/router.jsx" showLineNumbers
import { createBrowserRouter } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  { path: "/login", Component: Login },          // public
  {
    Component: ProtectedRoute,                   // the guard
    children: [
      { path: "/dashboard", Component: Dashboard },   // protected
      { path: "/rutinas", Component: Rutinas },
      { path: "/rutinas/:id", Component: RutinaDetalle },
    ],
  },
]);
```

A new page is protected just by putting it inside `children`. You do not have to remember to protect each component.

The diagram shows the guard as a **wrapper**: the parent route in `router.jsx` that wraps the protected routes. Change the session state and see what it does when someone enters `/dashboard`; in the **Pantalla** tab you see what the user will see, and below is the code of `router.jsx` and `ProtectedRoute.jsx`:

<InteractiveFrame
  src="/interactive/computacion-2/semana-16/guarda-outlet/index.html"
  title="A route guard with React Router: the user enters /dashboard and ProtectedRoute chooses between Outlet and Navigate depending on the token"
  height={780}
/>

### What to take away

- **The guard runs before its children:** to draw `/dashboard`, the router draws the parent first. If the parent redirects, the Dashboard **is never mounted** and requests no data.
- **`Outlet` and `Navigate` are the two exits:** let through or redirect.
- **The guard does not replace the server:** it protects the **screen**; the security of the data is still done by the backend with the token on every request.

## Going further: the token carries information

Having a stored token does not mean it is valid: it may have **expired**. And the token carries useful information (who the user is, their role) that you do not need to ask the server for. A **JWT** (JSON Web Token) is a text with three parts: header, payload and signature. Explore what is in each one:

<InteractiveFrame
  src="/interactive/computacion-2/semana-16/jwt-anatomia/index.html"
  title="Anatomy of a JWT token: header, payload and signature, and how jwtDecode reads the payload and the exp field"
  height={640}
/>

### Decoding the token with `jwt-decode`

The [`jwt-decode`](https://github.com/auth0/jwt-decode) library converts the token's payload into an object:

```bash title="Terminal"
npm install jwt-decode
```

```js title="Reading the token content" showLineNumbers
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");
const datos = jwtDecode(token);

console.log(datos.sub); // "ana@icesi.edu.co"
console.log(datos.rol); // "USER"
console.log(datos.exp); // 1893456000 (seconds since 1970)
```

The field names (`sub`, `rol`) depend on what **your backend** puts in the token: look at them with `console.log(datos)` or by pasting the token into [jwt.io](https://jwt.io).

:::warning[Decoding is not verifying]
`jwtDecode` only **reads** the content; it does not check the signature, and anyone can read it. It is useful to improve the experience (greet the user, hide a button), not to decide security. Never store secrets in the token's payload. The real verification of the signature is done by the server on every request.
:::

### A guard that checks expiry

The `exp` field is the expiry date. If it has already passed, the server will reject the token with `401`, so the guard can save the trip and send the user to the login right away:

```jsx title="src/components/ProtectedRoute.jsx" showLineNumbers
import { Navigate, Outlet } from "react-router";
import { jwtDecode } from "jwt-decode";

function estaVencido(token) {
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 < Date.now(); // exp is in seconds; Date.now() is in milliseconds
  } catch {
    return true; // a token that cannot be read is useless
  }
}

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  if (!token || estaVencido(token)) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

The `try/catch` matters: if someone types an invalid value into `localStorage` by hand, `jwtDecode` throws an error and the guard must treat it as «no session», not break the app.

## Role guards

The same mechanism lets you allow a page only to some users. It receives the allowed roles as a prop and compares them with the token's payload:

```jsx title="src/components/RoleRoute.jsx" showLineNumbers
import { Navigate, Outlet } from "react-router";
import { jwtDecode } from "jwt-decode";

export default function RoleRoute({ roles }) {
  const { rol } = jwtDecode(localStorage.getItem("token"));

  return roles.includes(rol) ? <Outlet /> : <Navigate to="/sin-permiso" replace />;
}
```

It is used **inside** the session guard, because it assumes the token already exists and is valid:

```jsx title="src/router.jsx (excerpt)" showLineNumbers
{
  Component: ProtectedRoute,                          // 1. is there a session?
  children: [
    { path: "/dashboard", Component: Dashboard },
    {
      element: <RoleRoute roles={["ADMIN"]} />,       // 2. does the user have the role?
      children: [{ path: "/usuarios", Component: Usuarios }],
    },
  ],
},
```

Guards **nest**: each one is a door and you have to pass them in order.

## Guards and Context API

Each guard reads `localStorage` directly, which is simple but has a limit: when the user logs in or out, **no component finds out** that the session changed (the menu cannot show the name, for example) until the page is reloaded. In the next chapter you will move that information into a **Context** so the whole app reacts to login and logout.

## Summary

| Piece | What it is for |
| :-- | :-- |
| `ProtectedRoute` | Checks whether there is a session; returns `Outlet` or `Navigate` |
| Parent route without `path` | Groups the protected routes under one guard |
| `Navigate ... replace` | Redirects without leaving the blocked route in the history |
| `jwtDecode` | Reads `sub`, `rol` and `exp` from the token (without verifying the signature) |
| `RoleRoute` | A second door: allows only certain roles |

## Resources

- [`Outlet` in the React Router documentation](https://reactrouter.com/api/components/Outlet)
- [`Navigate` in the React Router documentation](https://reactrouter.com/api/components/Navigate)
- [jwt.io: token decoder](https://jwt.io)
- [jwt-decode on GitHub](https://github.com/auth0/jwt-decode)
