---
sidebar_position: 3
description: "Share the authenticated user with the whole app using Context API: what prop drilling is, how an AuthProvider is set up, what is redrawn when something changes and when it is (or is not) a good idea."
---

# Context API: sharing state without passing props

You already know how to log in, store the token and protect routes. One problem is left: **how does the top menu know the user's name?** The guard reads `localStorage`, but when the user logs in, no component finds out about the change. You need a place where the **current user** lives and that any component can query. That is what **Context API** solves: React's mechanism for sharing data with a whole component tree.

:::note[Interactive graphics]
The interactive graphics in this chapter are shown in Spanish.
:::

## The problem: prop drilling

In React, data goes down **from parents to children through props**. If a deep component needs a piece of data, every component in between has to receive it and forward it, even if they do not use it. This is called **prop drilling**:

```jsx title="Without Context: the user crosses components that do not use it" showLineNumbers
function App() {
  const [user, setUser] = useState(null);
  return <Layout user={user} />;
}

function Layout({ user }) {            // does not use user, only forwards it
  return <Navbar user={user} />;
}

function Navbar({ user }) {            // neither does this one
  return <UserMenu user={user} />;
}

function UserMenu({ user }) {          // the only one that needs it
  return <span>Hola, {user.sub}</span>;
}
```

With three levels it is annoying; with six, it is a real problem: renaming the prop forces you to touch every intermediate component, and each one knows about a piece of data that does not belong to it. The session state is needed by **many components in different branches** (menu, pages, guards), so it is the classic example.

### And upward: callbacks

Data goes **down** through props, but a child cannot modify its parent's state. For `LoginPage` to change the user, the state's owner passes down a **function** and the child **calls** it: data goes down, events go up.

```jsx title="A callback goes up through props" showLineNumbers
function App() {
  const [user, setUser] = useState(null);
  // the function goes down as a prop...
  return <Layout onLogin={(token) => setUser(jwtDecode(token))} />;
}

function Layout({ onLogin }) {         // only forwards it
  return <Main onLogin={onLogin} />;
}

function Main({ onLogin }) {           // only forwards it
  return <LoginPage onLogin={onLogin} />;
}

function LoginPage({ onLogin }) {
  // ...and the child calls it upward
  return <button onClick={() => onLogin(token)}>Entrar</button>;
}
```

Prop drilling happens in **both directions**: the data goes down through all the intermediate components, and so does the function that changes it.

Walk through the tree of a routines app: how the user goes down, how callbacks go up, what changes with a context and which components are redrawn when the user changes.

<InteractiveFrame
  src="/interactive/computacion-2/semana-16/prop-drilling-context/index.html"
  title="Component tree of an app with an authenticated user: prop drilling, an AuthProvider with Context API and which components are redrawn when the user changes"
  height={720}
/>

### What to take away

- **With props, the data travels through every branch on the way**, even if the intermediate components do not use it.
- **With Context, the data jumps** straight from the Provider to each consumer, without going through the ones in between.
- **With the wrapper written correctly (`{children}`), only the consumers are redrawn:** the intermediate components skip the render.

## The three pieces of a context

Context API is made of three pieces you already know separately: **create** the channel, **publish** a value on it and **consume** it where needed.

| Piece | What it does |
| :-- | :-- |
| `createContext(defaultValue)` | Creates the channel. It stores nothing on its own |
| `<Context.Provider value={...}>` | Publishes a value for the whole tree below |
| `useContext(Context)` | Reads the value of the nearest Provider above |

The **Provider** is a normal component, with its own `useState`. It is called a **wrapper** because it wraps the app: everything inside is its scope.

## Setting up `AuthContext`

A single file gathers the session logic: the state, `login` and `logout`.

```jsx title="src/context/AuthContext.jsx" showLineNumbers
import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext(null);

function leerSesion() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const datos = jwtDecode(token);
    return datos.exp * 1000 > Date.now() ? datos : null; // null if it expired
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // initial function: runs only once, on mount
  const [user, setUser] = useState(leerSesion);

  const login = (token) => {
    localStorage.setItem("token", token);
    setUser(jwtDecode(token));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// a shortcut to consume the context
export function useAuth() {
  return useContext(AuthContext);
}
```

Key points:

- **`useState(leerSesion)`** receives the **function**, not its result: React runs it only on the first render. That way, when the page is reloaded the session is recovered from the stored token.
- **`login` and `logout` do two things at once:** they update `localStorage` (so it survives a reload) **and** the state (so the interface reacts).
- **`useAuth()`** is a minimal custom hook: it avoids importing `useContext` and `AuthContext` in every consumer.

Walk through the file and see which part does what and what shows up in the application:

<InteractiveFrame
  src="/interactive/computacion-2/semana-16/context-configuracion/index.html"
  title="The AuthContext.jsx file: createContext, AuthProvider with its state, value, children and useContext, linked to what happens in the application"
  height={780}
/>

## Wrapping the application

The wrapper goes **above** everything that needs the context. Usually, in the entry point:

```jsx title="src/main.jsx" showLineNumbers
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { AuthProvider } from "./context/AuthContext";
import router from "./router";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
);
```

Since `AuthProvider` wraps `RouterProvider`, **all the routes, guards and pages** are inside its scope.

## Consuming the context

Any component below reads the user in one line, no matter how many levels down it is:

```jsx title="src/components/UserMenu.jsx" showLineNumbers
import { useAuth } from "../context/AuthContext";

export default function UserMenu() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div>
      <span>Hola, {user.sub}</span>
      <button onClick={logout}>Salir</button>
    </div>
  );
}
```

And the login form now uses `login` from the context instead of writing to `localStorage` on its own:

```jsx title="Login.jsx (excerpt)" showLineNumbers
const { login } = useAuth();

async function handleSubmit(e) {
  e.preventDefault();
  const res = await api.post("/auth/login", { email, password });
  login(res.data.token); // stores the token AND notifies the whole app
  navigate("/dashboard");
}
```

## What happens when something changes in the wrapper

When `login()` calls `setUser`, the `AuthProvider` changes its state and runs again, and it publishes a **new** `value`. There is a React rule and an exception worth telling apart:

- **The rule:** when a component is redrawn, **the components it draws are redrawn too**. If `App` holds the state and draws `Layout`, a state change in `App` redraws its whole tree, even if nobody uses that data.
- **The exception:** a component that arrives as **`children`** was already created by whoever is higher up (in `main.jsx`). When the Provider is redrawn, `children` is the **same element** as before, and React reuses it instead of running it again. That is why, with `<AuthProvider>` wrapping the app, only the components that call `useContext(AuthContext)` are redrawn.

If the Provider drew `Layout` inside its own JSX (instead of receiving it as `children`), the whole tree would be redrawn. That is why the wrapper is always written with `{children}`.

What is true in any case: **if the `value` changes, all the consumers are redrawn**, even if they only use a part of it. That is why:

- Put data that **changes rarely** in the context (user, theme, language), not a counter that changes every second.
- One context per topic: one for the session, another for the theme. Mixing them makes a change redraw those that do not need it.

## Guards with Context

Now the guard can read the session from the context instead of `localStorage`. Everything that depends on the user updates by itself when you log in or out:

```jsx title="src/components/ProtectedRoute.jsx" showLineNumbers
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user } = useAuth();

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
```

The token's expiry is checked **once**, in `leerSesion`, on mount. While the app stays open, the response interceptor in `api.js` (the `401` from the Axios chapter) catches a token that expires mid-session.

## When to use Context and when not to

| Situation | Tool |
| :-- | :-- |
| A parent passes data to its direct child | **Props**: explicit and easy to trace |
| Two or three levels deep | **Props**: drilling a little is not a problem |
| Data that many components in different branches need (user, theme, language) | **Context** |
| Heavily shared state that changes often (cart, filters, server data) | A **store** such as Redux or Zustand |
| Data that comes from the API | An effect with Axios, or libraries such as TanStack Query |

:::note[Context versus Redux]
If you worked with Redux Toolkit in Computación 3, the idea is similar: a central place that any component reads from. The difference is **scale**: Context has no tools for state that changes a lot (it redraws all the consumers) or for debugging the changes. For the user's session it is enough and needs nothing installed; for complex state, a store is the best option.
:::

:::warning[Do not abuse Context]
Putting everything in a context is the most common mistake: the tree ends up coupled to a «global state» that is hard to follow. Start with `useState` and props; lift the state to a common ancestor when two siblings need it; use Context only when prop drilling starts to hurt.
:::

## Summary

- **Prop drilling:** passing data through components that do not use it, just so it reaches a deep one.
- **Context:** a channel to share a value with the whole tree below, without intermediate props.
- **Provider:** the wrapper that holds the state and publishes the `value`; **`useContext`:** reads it.
- **When the `value` changes**, the consumers are redrawn; the other components are only redrawn if the Provider draws them itself (not as `children`).
- **Use it for** session, theme or language; **not for** all of the application's state.

## Resources

- [Passing Data Deeply with Context (react.dev)](https://react.dev/learn/passing-data-deeply-with-context)
- [`useContext` (react.dev)](https://react.dev/reference/react/useContext)
- [Scaling Up with Reducer and Context (react.dev)](https://react.dev/learn/scaling-up-with-reducer-and-context)
