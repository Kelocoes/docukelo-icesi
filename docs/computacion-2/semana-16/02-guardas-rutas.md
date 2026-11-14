---
sidebar_position: 2
description: "Protege las rutas de una app React con un guarda: un componente con Outlet y Navigate de React Router que revisa el token guardado y, si quieres, lo decodifica con jwt-decode."
---

# Guardas de ruta: proteger páginas con React Router

En el capítulo anterior guardaste el token en `localStorage`. Pero guardarlo no impide nada: cualquiera puede escribir `/dashboard` en la barra de direcciones y ver la página, aunque no haya iniciado sesión (los datos seguirían protegidos por el servidor, pero la pantalla sí se dibujaría). Un **guarda de ruta** resuelve eso: es la puerta que revisa si hay sesión **antes** de dibujar la página.

## Qué es un guarda

Un guarda es un **componente de React Router** que envuelve a un grupo de rutas y decide una de dos cosas:

- **Dejar pasar:** devuelve `<Outlet />`, el hueco donde React Router dibuja la ruta hija.
- **Bloquear:** devuelve `<Navigate />`, que redirige a otra ruta (normalmente `/login`).

No dibuja nada propio ni pide datos: solo **abre o cierra la puerta**. Los dos componentes que usa ya los conoces de la [semana 15](../semana-15/react-router): `Outlet` marca dónde se dibujan las rutas hijas y `Navigate` cambia de ruta desde el JSX.

## El guarda más sencillo

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

- **`localStorage.getItem("token")`** devuelve el token o `null`. La lectura es inmediata: no hay petición al servidor.
- **`replace`** reemplaza la entrada actual del historial en lugar de agregar una nueva. Sin él, el botón «Atrás» llevaría al usuario a la ruta bloqueada, que lo redirigiría otra vez al login: un bucle molesto.

## Conectar el guarda al router

El guarda se usa como **ruta padre sin `path`**: no cambia la URL, solo envuelve a sus hijas. Todo lo que quede dentro de `children` queda protegido.

```jsx title="src/router.jsx" showLineNumbers
import { createBrowserRouter } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  { path: "/login", Component: Login },          // pública
  {
    Component: ProtectedRoute,                   // el guarda
    children: [
      { path: "/dashboard", Component: Dashboard },   // protegidas
      { path: "/rutinas", Component: Rutinas },
      { path: "/rutinas/:id", Component: RutinaDetalle },
    ],
  },
]);
```

Una página nueva queda protegida con solo ponerla dentro de `children`. No hay que acordarse de proteger cada componente.

El diagrama muestra el guarda como un **wrapper**: la ruta padre del `router.jsx` que envuelve a las rutas protegidas. Cambia el estado de la sesión y mira qué hace cuando alguien entra a `/dashboard`; en la pestaña **Pantalla** ves lo que verá el usuario, y abajo el código de `router.jsx` y de `ProtectedRoute.jsx`:

<InteractiveFrame
  src="/interactive/computacion-2/semana-16/guarda-outlet/index.html"
  title="Un guarda de ruta con React Router: el usuario entra a /dashboard y ProtectedRoute decide entre Outlet y Navigate según el token"
  height={780}
/>

### Qué debes llevarte

- **El guarda se ejecuta antes que sus hijas:** para dibujar `/dashboard`, el router dibuja primero al padre. Si el padre redirige, el Dashboard **nunca se monta** ni pide datos.
- **`Outlet` y `Navigate` son las dos salidas:** pasar o redirigir.
- **El guarda no sustituye al servidor:** protege la **pantalla**; la seguridad de los datos la sigue haciendo el backend con el token en cada petición.

## Ir más allá: el token tiene información

Tener un token guardado no significa que sea válido: puede haber **vencido**. Y el token trae información útil (quién es el usuario, su rol) que no necesitas pedirle al servidor. Un **JWT** (JSON Web Token) es un texto con tres partes: encabezado, contenido y firma. Explora qué hay en cada una:

<InteractiveFrame
  src="/interactive/computacion-2/semana-16/jwt-anatomia/index.html"
  title="Anatomía de un token JWT: encabezado, contenido y firma, y cómo jwtDecode lee el contenido y el campo exp"
  height={640}
/>

### Decodificar el token con `jwt-decode`

La librería [`jwt-decode`](https://github.com/auth0/jwt-decode) convierte el contenido del token en un objeto:

```bash title="Terminal"
npm install jwt-decode
```

```js title="Leer el contenido del token" showLineNumbers
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");
const datos = jwtDecode(token);

console.log(datos.sub); // "ana@icesi.edu.co"
console.log(datos.rol); // "USER"
console.log(datos.exp); // 1893456000 (segundos desde 1970)
```

Los nombres de los campos (`sub`, `rol`) dependen de lo que ponga **tu backend** en el token: míralos con `console.log(datos)` o pegando el token en [jwt.io](https://jwt.io).

:::warning[Decodificar no es verificar]
`jwtDecode` solo **lee** el contenido; no comprueba la firma, y cualquiera puede leerlo. Sirve para mejorar la experiencia (saludar al usuario, ocultar un botón), no para decidir la seguridad. Nunca guardes secretos en el contenido del token. La verificación real de la firma la hace el servidor en cada petición.
:::

### Un guarda que revisa el vencimiento

El campo `exp` es la fecha de vencimiento. Si ya pasó, el servidor rechazará el token con `401`, así que el guarda puede ahorrarse el viaje y mandar al login desde ya:

```jsx title="src/components/ProtectedRoute.jsx" showLineNumbers
import { Navigate, Outlet } from "react-router";
import { jwtDecode } from "jwt-decode";

function estaVencido(token) {
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 < Date.now(); // exp está en segundos; Date.now() en milisegundos
  } catch {
    return true; // un token que no se puede leer no sirve
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

El `try/catch` importa: si alguien escribe a mano un valor inválido en `localStorage`, `jwtDecode` lanza un error y el guarda debe tratarlo como «sin sesión», no romper la app.

## Guardas por rol

El mismo mecanismo sirve para permitir una página solo a algunos usuarios. Recibe los roles permitidos como prop y compara con el contenido del token:

```jsx title="src/components/RoleRoute.jsx" showLineNumbers
import { Navigate, Outlet } from "react-router";
import { jwtDecode } from "jwt-decode";

export default function RoleRoute({ roles }) {
  const { rol } = jwtDecode(localStorage.getItem("token"));

  return roles.includes(rol) ? <Outlet /> : <Navigate to="/sin-permiso" replace />;
}
```

Se usa **dentro** del guarda de sesión, porque asume que el token ya existe y es válido:

```jsx title="src/router.jsx (fragmento)" showLineNumbers
{
  Component: ProtectedRoute,                          // 1. ¿hay sesión?
  children: [
    { path: "/dashboard", Component: Dashboard },
    {
      element: <RoleRoute roles={["ADMIN"]} />,       // 2. ¿tiene el rol?
      children: [{ path: "/usuarios", Component: Usuarios }],
    },
  ],
},
```

Los guardas se **anidan**: cada uno es una puerta y hay que pasarlas en orden.

## Guardas y Context API

Cada guarda lee `localStorage` directamente, lo cual es simple pero tiene un límite: cuando el usuario hace login o logout, **ningún componente se entera** de que cambió la sesión (el menú no puede mostrar el nombre, por ejemplo) hasta que recargue. En el siguiente capítulo moverás esa información a un **Context** para que toda la app reaccione al login y al logout.

## Resumen

| Pieza | Para qué |
| :-- | :-- |
| `ProtectedRoute` | Revisa si hay sesión; devuelve `Outlet` o `Navigate` |
| Ruta padre sin `path` | Agrupa las rutas protegidas bajo un mismo guarda |
| `Navigate ... replace` | Redirige sin dejar la ruta bloqueada en el historial |
| `jwtDecode` | Lee `sub`, `rol` y `exp` del token (sin verificar la firma) |
| `RoleRoute` | Segunda puerta: permite solo ciertos roles |

## Recursos

- [`Outlet` en la documentación de React Router](https://reactrouter.com/api/components/Outlet)
- [`Navigate` en la documentación de React Router](https://reactrouter.com/api/components/Navigate)
- [jwt.io: decodificador de tokens](https://jwt.io)
- [jwt-decode en GitHub](https://github.com/auth0/jwt-decode)
