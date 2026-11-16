---
sidebar_position: 3
description: "Comparte el usuario autenticado con toda la app usando Context API: qué es el prop drilling, cómo se configura un AuthProvider, qué se vuelve a dibujar cuando algo cambia y cuándo conviene (o no) usarlo."
---

# Context API: compartir estado sin pasar props

Ya sabes iniciar sesión, guardar el token y proteger rutas. Falta un problema: **¿cómo sabe el menú superior cómo se llama el usuario?** El guarda lee `localStorage`, pero cuando el usuario hace login, ningún componente se entera del cambio. Necesitas un lugar donde viva el **usuario actual** y que cualquier componente pueda consultar. Eso es lo que resuelve **Context API**, el mecanismo de React para compartir datos con todo un árbol de componentes.

## El problema: prop drilling

En React los datos bajan **de padres a hijos por props**. Si un componente profundo necesita un dato, todos los que están en medio tienen que recibirlo y reenviarlo, aunque no lo usen. Esto se llama **prop drilling** («perforar» con props):

```jsx title="Sin Context: el usuario cruza componentes que no lo usan" showLineNumbers
function App() {
  const [user, setUser] = useState(null);
  return <Layout user={user} />;
}

function Layout({ user }) {            // no usa user, solo lo reenvía
  return <Navbar user={user} />;
}

function Navbar({ user }) {            // tampoco
  return <UserMenu user={user} />;
}

function UserMenu({ user }) {          // el único que lo necesita
  return <span>Hola, {user.sub}</span>;
}
```

Con tres niveles molesta; con seis, es un problema real: renombrar la prop obliga a tocar todos los intermedios, y cada intermedio conoce un dato que no le pertenece. El estado de sesión lo necesitan **muchos componentes en ramas distintas** (menú, páginas, guardas), así que es el ejemplo clásico.

### Y hacia arriba: los callbacks

Los datos **bajan** por props, pero un hijo no puede modificar el estado de su padre. Para que `LoginPage` cambie el usuario, el dueño del estado le baja una **función** y el hijo la **llama**: datos hacia abajo, eventos hacia arriba.

```jsx title="Un callback sube por props" showLineNumbers
function App() {
  const [user, setUser] = useState(null);
  // la función baja como prop...
  return <Layout onLogin={(token) => setUser(jwtDecode(token))} />;
}

function Layout({ onLogin }) {         // solo la reenvía
  return <Main onLogin={onLogin} />;
}

function Main({ onLogin }) {           // solo la reenvía
  return <LoginPage onLogin={onLogin} />;
}

function LoginPage({ onLogin }) {
  // ...y el hijo la llama hacia arriba
  return <button onClick={() => onLogin(token)}>Entrar</button>;
}
```

El prop drilling pasa en **los dos sentidos**: el dato baja por todos los intermedios y la función que lo cambia también.

Recorre el árbol de una app de rutinas: cómo baja el usuario, cómo suben los callbacks, qué cambia con un contexto y qué componentes se repintan cuando el usuario cambia.

<InteractiveFrame
  src="/interactive/computacion-2/semana-16/prop-drilling-context/index.html"
  title="Árbol de componentes de una app con usuario autenticado: prop drilling, un AuthProvider con Context API y qué componentes se repintan cuando el usuario cambia"
  height={720}
/>

### Qué debes llevarte

- **Por props, el dato viaja por todas las ramas del camino**, aunque los intermedios no lo usen.
- **Con Context, el dato salta** directo del Provider a cada consumidor, sin pasar por los de en medio.
- **Con el wrapper bien escrito (`{children}`), solo se repintan los consumidores:** los intermedios se saltan el render.

## Las tres piezas de un contexto

Context API se compone de tres piezas que ya conoces por separado: **crear** el canal, **publicar** un valor en él y **consumirlo** donde haga falta.

| Pieza | Qué hace |
| :-- | :-- |
| `createContext(valorPorDefecto)` | Crea el canal. No guarda nada por sí solo |
| `<Contexto.Provider value={...}>` | Publica un valor para todo el árbol de abajo |
| `useContext(Contexto)` | Lee el valor del Provider más cercano hacia arriba |

El **Provider** es un componente normal, con su propio `useState`. Se le llama **wrapper** porque envuelve a la app: todo lo que está dentro es su alcance.

## Configurar `AuthContext`

Un solo archivo reúne la lógica de sesión: el estado, `login` y `logout`.

```jsx title="src/context/AuthContext.jsx" showLineNumbers
import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext(null);

function leerSesion() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const datos = jwtDecode(token);
    return datos.exp * 1000 > Date.now() ? datos : null; // null si venció
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // función inicial: se ejecuta una sola vez, al montar
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

// un atajo para consumir el contexto
export function useAuth() {
  return useContext(AuthContext);
}
```

Puntos clave:

- **`useState(leerSesion)`** recibe la **función**, no su resultado: React la ejecuta solo en el primer render. Así, al recargar la página la sesión se recupera del token guardado.
- **`login` y `logout` hacen dos cosas a la vez:** actualizan `localStorage` (para que sobreviva a recargar) **y** el estado (para que la interfaz reaccione).
- **`useAuth()`** es un custom hook mínimo: evita importar `useContext` y `AuthContext` en cada consumidor.

Recorre el archivo y mira qué parte hace cada cosa y qué se ve en la aplicación:

<InteractiveFrame
  src="/interactive/computacion-2/semana-16/context-configuracion/index.html"
  title="El archivo AuthContext.jsx: createContext, AuthProvider con su estado, value, children y useContext, enlazados con lo que pasa en la aplicación"
  height={780}
/>

## Envolver la aplicación

El wrapper se coloca **por encima** de todo lo que necesita el contexto. Normalmente, en el punto de entrada:

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

Como `AuthProvider` envuelve a `RouterProvider`, **todas las rutas, los guardas y las páginas** quedan dentro de su alcance.

## Consumir el contexto

Cualquier componente de abajo lee el usuario con una línea, sin importar a cuántos niveles esté:

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

Y el formulario de login ahora usa `login` del contexto en lugar de escribir en `localStorage` por su cuenta:

```jsx title="Login.jsx (fragmento)" showLineNumbers
const { login } = useAuth();

async function handleSubmit(e) {
  e.preventDefault();
  const res = await api.post("/auth/login", { email, password });
  login(res.data.token); // guarda el token Y avisa a toda la app
  navigate("/dashboard");
}
```

## Qué pasa cuando algo cambia en el wrapper

Cuando `login()` llama a `setUser`, el `AuthProvider` cambia su estado y se vuelve a ejecutar, y publica un `value` **nuevo**. Aquí hay una regla de React y una excepción que conviene distinguir:

- **La regla:** cuando un componente se repinta, **también se repintan los componentes que él dibuja**. Si `App` guarda el estado y dibuja a `Layout`, un cambio de estado en `App` repinta todo su árbol, aunque nadie use ese dato.
- **La excepción:** un componente que llega como **`children`** ya fue creado por quien está más arriba (en `main.jsx`). Cuando el Provider se repinta, `children` es el **mismo elemento** de antes, y React lo reutiliza en lugar de volver a ejecutarlo. Por eso, con `<AuthProvider>` envolviendo a la app, solo se repintan los componentes que llaman a `useContext(AuthContext)`.

Si el Provider dibujara a `Layout` dentro de su propio JSX (en vez de recibirlo como `children`), sí se repintaría todo el árbol. Por eso el wrapper se escribe siempre con `{children}`.

Lo que sí es cierto en cualquier caso: **si el `value` cambia, se repintan todos los consumidores**, aunque solo usen una parte. Por eso:

- Pon en el contexto datos que **cambian poco** (usuario, tema, idioma), no un contador que cambia cada segundo.
- Un contexto por tema: uno para la sesión, otro para el tema. Mezclarlos hace que un cambio repinte a quien no lo necesita.

## Guardas con Context

Ahora el guarda puede leer la sesión del contexto en lugar de `localStorage`. Todo el que dependa del usuario se actualiza solo cuando haces login o logout:

```jsx title="src/components/ProtectedRoute.jsx" showLineNumbers
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user } = useAuth();

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
```

El vencimiento del token se revisa **una vez**, en `leerSesion`, al montar. Mientras la app esté abierta, el interceptor de respuesta de `api.js` (el `401` del capítulo de Axios) atrapa un token que venza a mitad de sesión.

## ¿Cuándo usar Context y cuándo no?

| Situación | Herramienta |
| :-- | :-- |
| Un padre le pasa un dato a su hijo directo | **Props**: es explícito y fácil de rastrear |
| Dos o tres niveles de profundidad | **Props**: perforar un poco no es un problema |
| Un dato que necesitan muchos componentes en ramas distintas (usuario, tema, idioma) | **Context** |
| Estado muy compartido que cambia a menudo (carrito, filtros, datos del servidor) | Un **store** como Redux o Zustand |
| Datos que vienen de la API | Un efecto con Axios, o librerías como TanStack Query |

:::note[Context frente a Redux]
Si en Computación 3 trabajaste con Redux Toolkit, la idea es parecida: un lugar central del que cualquier componente lee. La diferencia está en la **escala**: Context no trae herramientas para estados que cambian mucho (repinta a todos los consumidores) ni para depurar los cambios. Para la sesión del usuario es suficiente y no necesita instalar nada; para un estado complejo, un store es la mejor opción.
:::

:::warning[No abuses de Context]
Meter todo en un contexto es el error más común: el árbol queda acoplado a un «estado global» difícil de seguir. Empieza con `useState` y props; sube el estado a un ancestro común cuando dos hermanos lo necesiten; recurre a Context solo cuando el prop drilling empiece a doler.
:::

## Resumen

- **Prop drilling:** pasar un dato por componentes que no lo usan, solo para que llegue a uno profundo.
- **Context:** un canal para compartir un valor con todo el árbol de abajo, sin props intermedias.
- **Provider:** el wrapper que guarda el estado y publica el `value`; **`useContext`:** lo lee.
- **Al cambiar el `value`**, se repintan los consumidores; los demás componentes solo se repintan si el Provider los dibuja él mismo (no como `children`).
- **Úsalo para** sesión, tema o idioma; **no para** todo el estado de la aplicación.

## Recursos

- [Pasar datos en profundidad con Context (react.dev)](https://react.dev/learn/passing-data-deeply-with-context)
- [`useContext` (react.dev)](https://react.dev/reference/react/useContext)
- [Escalar con reducer y contexto (react.dev)](https://react.dev/learn/scaling-up-with-reducer-and-context)
