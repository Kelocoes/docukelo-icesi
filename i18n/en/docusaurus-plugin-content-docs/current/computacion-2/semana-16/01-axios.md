---
sidebar_position: 1
description: "Consume an API from React with useEffect and Axios: GET on mount, a client configured with .env and an interceptor, login with POST and the token stored in localStorage."
---

# Axios and useEffect: consuming an API

So far your components work with data they make up themselves. In a real application the data lives on a **server** and the component has to ask for it. In this chapter you connect your React app to the routines backend: first you **recall `useEffect`** (the hook that connects to the outside world), then you request data with **Axios**, and finally you **log in**, store the **token** and send it with every request.

:::note[Interactive graphics]
The interactive graphics in this chapter are shown in Spanish.
:::

## `useEffect` review

A component should only **calculate what is drawn**. Requesting data from a server is not part of that calculation: it is talking to something React does not control. That is what `useEffect` is for: it runs **after** React has painted the screen.

```jsx title="The shape of an effect"
useEffect(() => {
  // 1. the effect: runs after the render
  return () => {
    // 2. the cleanup (optional): runs before the next effect and on unmount
  };
}, [dependencias]); // 3. when it repeats
```

The dependency array decides **when the effect repeats**:

| Dependencies | When the effect runs | Typical use |
| :-- | :-- | :-- |
| `[]` | Only once, on mount | Load the initial list from the API |
| `[id]` | On mount and every time `id` changes | Request the detail of the routine that changes with the URL |
| _(no array)_ | After **every** render | Almost never; it often causes request loops |

:::note[Why does my request go out twice in development?]
In development mode, `<StrictMode>` mounts each component, unmounts it and mounts it again on purpose to check that your cleanup works. In production it runs only once. If the request is a `GET`, nothing happens; if you see duplicates with `POST`, check that you are not sending them from an effect.
:::

If you need to review when an effect runs and when it is cleaned up, go back to [week 15](../semana-15/react-hooks).

## Axios: the HTTP client

[Axios](https://axios-http.com/) is a library that sends HTTP requests from the browser and returns **promises**. Install it with:

```bash title="Terminal"
npm install axios
```

Compared with `fetch`, which already comes with the browser, it saves you repeated work:

| Feature | Axios | `fetch` |
| :-- | :-- | :-- |
| Converts the JSON response | Yes, in `res.data` | No: you have to call `.json()` |
| HTTP errors (401, 404, 500) | Rejects the promise | No: it only rejects when there is no network |
| Interceptors | Yes | No |
| `POST` body | You pass an object and it converts it | You must use `JSON.stringify` and the header |

That difference in errors is the most important one: with Axios, a `401` lands in the `catch`; with `fetch` you would have to check `res.ok` by hand.

## GET with `useEffect`

The most common pattern: when the component appears, request the list and store three things in state: the **data**, whether it is **loading** and whether there was an **error**.

```jsx title="Rutinas.jsx" showLineNumbers
function Rutinas() {
  const [rutinas, setRutinas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/rutinas")
      .then((res) => setRutinas(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  return <Lista rutinas={rutinas} />;
}
```

Follow the request from start to finish. The **Flujo** tab shows how the files communicate and the **Pantalla** tab shows what the user would see (with the requests in Network); below, the code of `Rutinas.jsx` and `api.js`. Change the server response to see the success path and the error paths:

<InteractiveFrame
  src="/interactive/computacion-2/semana-16/useeffect-axios/index.html"
  title="A component that requests /rutinas with useEffect and Axios: first render, request and three possible server responses"
  height={760}
/>

### What to take away

- **The effect runs after painting:** that is why the first render always shows «Cargando...»: the data does not exist yet.
- **Changing state redraws:** `setRutinas` and `setCargando` cause a new render; the effect does not repeat because `[]` did not change.
- **There are always three cases:** data, loading and error. If you only program the happy path, the student who loses the network will see a blank screen.

:::tip[Do you want to use `async/await`?]
The function you pass to `useEffect` **cannot be `async`** (it would return a promise instead of the cleanup). Define an `async` function inside and call it:

```jsx title="async/await inside an effect"
useEffect(() => {
  async function cargar() {
    try {
      const res = await api.get("/rutinas");
      setRutinas(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }
  cargar();
}, []);
```
:::

## Where to store the token: `localStorage`

Later you will log in and the server will give you a **token**. That token has to live somewhere so it survives a page reload. The browser offers several places:

| Place | Survives a reload | Survives closing the tab | Your JavaScript can read it |
| :-- | :-: | :-: | :-: |
| React variable or state | No | No | Yes |
| `sessionStorage` | Yes | No | Yes |
| **`localStorage`** | **Yes** | **Yes** | **Yes** |
| `HttpOnly` cookie | Yes | Depends on its expiry | No: only the browser sends it |

`localStorage` is a store of **key-value pairs** that the browser keeps per site (origin). Its use boils down to four methods:

```js title="localStorage" showLineNumbers
localStorage.setItem("token", "eyJhbGci...");   // save
const token = localStorage.getItem("token");    // read (null if it does not exist)
localStorage.removeItem("token");               // delete one key
localStorage.clear();                           // delete everything from the site
```

Two things you need to know:

- **It only stores text.** For an object, convert it: `localStorage.setItem("user", JSON.stringify(user))` and read it with `JSON.parse(localStorage.getItem("user"))`.
- **Any script on the page can read it.** If your app had an XSS vulnerability, an attacker could steal the token. For class it is the simplest option and the one we will use; in production an `HttpOnly` cookie set by the backend is preferred.

You can see what you stored in the browser: _DevTools → Application → Local Storage_.

## Environment variables: `.env`

The server address changes depending on where the app runs: your computer, the test server, the lab. Writing it inside the code forces you to edit many files. A **`.env`** file keeps those values **outside the code**, as `NAME=value` pairs, in the project root:

```env title=".env"
VITE_API_URL=http://localhost:8081/compunet2-2026/rest
```

- In **Vite**, only variables that start with `VITE_` reach the browser code. They are read with `import.meta.env.VITE_API_URL`.
- The `.env` is read **on startup** of the development server: if you edit it, restart `npm run dev`.
- Vite loads `.env.production` when you run `npm run build`. That way you have one URL for development and another for production without touching the code.
- Add `.env` to `.gitignore` if it contains data specific to your environment.

:::warning[Vite's `.env` is not secret]
Everything that starts with `VITE_` ends up **inside the JavaScript** the browser downloads. It is for addresses and configuration, never for private keys.
:::

## The `api.js` client

Repeating the full URL in every request is fragile, and the token would have to be added by hand in each one. The solution is to **create a client once** and have every component import it.

```js title="src/api.js" showLineNumbers
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

- **`axios.create`** sets the `baseURL`: in the components you write `api.get("/rutinas")` and Axios builds the full URL.
- **A request interceptor** is a function that Axios runs **right before sending any request** made with `api`. Here it reads the token and, if it exists, adds the `Authorization: Bearer <token>` header.

Walk through the file and see which part produces each line of the outgoing request:

<InteractiveFrame
  src="/interactive/computacion-2/semana-16/api-cliente/index.html"
  title="The api.js file: the base URL from .env, the Axios instance and the interceptor that adds the token, linked to the outgoing request"
  height={780}
/>

:::tip
Because the interceptor reads `localStorage` **on every request** (and not once when the file loads), login and logout take effect immediately, without reloading the page.
:::

## POST: the login

A `POST` sends data in the **body** of the request. With Axios, the second argument is the object you want to send and the library converts it to JSON.

```jsx title="Login.jsx" showLineNumbers
import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Entrar</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

There is no `useEffect` here: the login happens when the user **submits the form**, not when the component appears. Rule of thumb: a `GET` for data the screen needs when it opens goes in an effect; a user action (login, create, delete) goes in an **event handler**.

:::note
The routes (`/auth/login`, `/rutinas`) and the response shape (`{ token }`) are those of the example backend. Adjust them to your API: check with Postman or Swagger what it returns.
:::

## The complete walkthrough

Follow the token's journey: it is requested with a `POST`, stored in the browser and travels in the header of the next request. In **Pantalla** you will see the form, the `localStorage` (Application tab) and the requests with their Authorization column; below, the three files involved. Change the option to see what happens with a wrong password.

<InteractiveFrame
  src="/interactive/computacion-2/semana-16/login-token/index.html"
  title="Walkthrough of a login with Axios: the POST, the token stored in localStorage and a protected request that sends it in the Authorization header"
  height={800}
/>

### What to take away

- **The token is not sent by hand:** `api.js` adds it to every request; your components only write the route.
- **The login carries no token:** it does not exist yet; that is why the interceptor lets it through without a header.
- **A failed login stores nothing:** the `401` lands in the `catch`, so `setItem` and `navigate` do not run.

## Another authenticated POST: creating a routine

With the token stored, any protected request works the same way. Creating a routine is a normal `POST`; the interceptor takes care of authentication:

```jsx title="NuevaRutina.jsx" showLineNumbers
async function crear(e) {
  e.preventDefault();
  try {
    const res = await api.post("/rutinas", { nombre, dias });
    setRutinas((actuales) => [res.data, ...actuales]);
    setNombre("");
  } catch (err) {
    setError(err.response?.data?.message ?? "No se pudo crear la rutina");
  }
}
```

Two details:

- **`err.response`** exists only if the server responded (for example, with a `400`). If there was no network, it is `undefined`; that is why `?.` is used.
- **`setRutinas((actuales) => [...])`** uses the functional form of the setter, which starts from the latest value. That way the list updates without requesting it from the server again.

## What happens when the token expires

The token has an expiry date. When it passes, the server answers `401` to any request. Instead of checking that in every component, it is solved **once** with a **response interceptor** in `api.js`:

```js title="src/api.js (at the end, before the export)" showLineNumbers
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = import.meta.env.BASE_URL + "login";
    }
    return Promise.reject(error);
  },
);
```

If the response is a `401`, it deletes the token and sends the user to the login; the rest of the errors keep propagating to the component's `catch`. `import.meta.env.BASE_URL` is used so it also works when the app is deployed under a subpath (you will see that in the last chapter).

In the next chapter you will learn to **stop a user without a token from seeing a page**, instead of waiting for the server to reject them.

## Resources

- [Axios documentation](https://axios-http.com/docs/intro)
- [`useEffect` on react.dev](https://react.dev/reference/react/useEffect)
- [Environment variables in Vite](https://vite.dev/guide/env-and-mode)
- [`localStorage` on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
