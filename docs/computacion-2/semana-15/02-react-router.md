---
sidebar_position: 2
description: "Crea una aplicación React con varias páginas usando React Router en modo Data: instalación, rutas anidadas, navegación con useNavigate y el historial, path variables y query params."
---

# React Router

Una aplicación hecha con React y Vite entrega **un solo archivo HTML**, pero los usuarios esperan varias páginas: `/productos`, `/carrito`, un enlace que se pueda compartir y un botón Atrás que funcione. **React Router** es la librería que resuelve eso. En este capítulo usamos su **modo Data** (`createBrowserRouter`), la forma recomendada para aplicaciones que corren en el navegador.

## El problema: una SPA tiene una sola página

En un sitio clásico, cada URL corresponde a un **archivo** del servidor: `/productos` pide `productos.html`. Una SPA (_Single Page Application_) funciona distinto: el servidor entrega siempre el mismo `index.html` y el JavaScript arma lo que ves. ¿Y entonces para qué sirve la URL?

Recorre la misma tienda en los dos tipos de sitio y mira qué se le pide al servidor en cada clic:

<InteractiveFrame
  src="/interactive/computacion-2/semana-15/spa-vs-multipagina/index.html"
  title="Comparación entre un sitio clásico, con un archivo HTML por URL, y una SPA con React Router: qué se le pide al servidor en cada clic"
  height={640}
/>

### Qué debes llevarte

- **React Router no busca archivos.** La URL es un dato: el router la compara con una lista de **rutas** y decide qué componentes dibujar. Para el usuario parece otra página; en realidad cambió el DOM.
- **Navegar no recarga la página.** Cambia la URL con la API `history` del navegador y React actualiza solo lo que cambió, igual que con el estado.
- **La URL sigue siendo útil.** Se puede copiar, guardar en favoritos y usar con Atrás y Adelante.
- **Al recargar, el servidor sí participa.** Como solo existe `index.html`, el servidor debe devolverlo para **cualquier** ruta. El servidor de Vite ya lo hace; al desplegar, configura la regla (por ejemplo, `try_files` en Nginx o `rewrites` en el hosting).

## Instalar React Router

React Router tiene tres modos de uso. Aquí usamos el modo **Data**, donde defines las rutas como objetos y el router también sabe cargar datos:

| Modo | Cómo se define | Cuándo |
| --- | --- | --- |
| **Declarative** | Con componentes (`<Routes>`, `<Route>`) | Lo más simple, sin carga de datos. |
| **Data** | Con objetos (`createBrowserRouter`) | **El de este curso:** rutas, `loader`s y manejo de errores. |
| **Framework** | Con archivos y un plugin de Vite | Aplicaciones completas con SSR. |

Dentro de tu proyecto de Vite, instala el paquete:

```bash
npm install react-router
```

:::note[¿Y react-router-dom?]
Hasta la versión 6 los componentes para el navegador estaban en `react-router-dom`. Desde la versión 7 todo se importa desde `react-router`; en tutoriales viejos verás el otro paquete.
:::

Crea el router **una sola vez, fuera de cualquier componente**, y pásalo a `RouterProvider`:

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

`RouterProvider` reemplaza a `<App />`: desde aquí, el router decide qué se dibuja según la URL. Pruébalo con `npm run dev` y abre `http://localhost:5173/`.

## Rutas, páginas y subpáginas

Cada ruta es un objeto con un `path` y el `Component` que se dibuja cuando la URL coincide. Para tener **subpáginas** anidas las rutas se ponen dentro de `children`, y el padre decide dónde se dibujan con `<Outlet />`:

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

Recorre la configuración y mira qué se dibuja con cada URL. Pasa el mouse por el código o por la pantalla:

<InteractiveFrame
  src="/interactive/computacion-2/semana-15/rutas-anidadas/index.html"
  title="Rutas anidadas de React Router en modo Data: la ruta raíz como layout con Outlet, rutas index, un prefijo y una ruta dinámica, enlazadas con lo que se dibuja para cada URL"
  height={900}
/>

| Pieza | Para qué sirve |
| --- | --- |
| `path` | El segmento de URL que la ruta atiende. El del padre se suma al de los hijos. |
| `Component` | Lo que se dibuja cuando la ruta coincide. |
| `children` | Rutas anidadas: se dibujan en el `<Outlet />` del padre. |
| `index: true` | La hija por defecto: se dibuja cuando la URL es exactamente la del padre. |
| Ruta sin `Component` | Solo agrupa sus hijas bajo un prefijo (`productos`). |
| Ruta sin `path` | Un **layout**: comparte componentes sin agregar segmentos a la URL. |
| `:id` | Segmento dinámico: coincide con cualquier valor. |
| `*` | Comodín: coincide con cualquier URL que no coincidió con otra (ideal para el 404). |

### Link y NavLink: enlaces que no recargan

Un `<a href>` normal pide la página al servidor y recarga todo. En su lugar, usa:

- **`<Link to="/productos">`**: un enlace que cambia la URL y le avisa al router, sin recargar.
- **`<NavLink to="/productos">`**: igual, pero sabe si su ruta es la actual y le agrega la clase `active` (o la que definas con `className={({ isActive }) => ...}`), ideal para menús.

### Una página para lo que no existe

Agrega al final de la lista una ruta comodín. Si ninguna otra coincide, se dibuja esta:

```jsx title="src/router.jsx" showLineNumbers
{ path: "*", Component: NotFound },
```

## Navegar: la pila del historial

Además de los enlaces, a veces hay que navegar **desde el código**: al terminar de iniciar sesión, al guardar un formulario, al pulsar «Volver». Para eso existe el hook `useNavigate`:

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

Para entender qué hacen `navigate("/carrito")` y `navigate(-1)` hay que entender **dónde guarda el navegador las páginas que visitas**: en una **pila**.

### Qué es una pila

Una **pila** es una colección donde solo se agrega y se quita por **un extremo**, el tope: el último en entrar es el primero en salir (LIFO), como una pila de platos. Compárala con una cola, donde el primero en entrar es el primero en salir:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-13/pila-vs-cola/index.html"
  title="Pila (LIFO) frente a cola (FIFO): el orden de salida de los mismos elementos"
  height={620}
/>

### El historial del navegador

El historial funciona como una pila con una diferencia: tiene un **puntero** que marca en qué entrada estás. Ir a una página nueva (`push`) apila una entrada; Atrás y Adelante no destruyen nada, solo **mueven el puntero**. Pruébalo, incluido qué pasa con lo que estaba adelante y qué cambia con `replace`:

<InteractiveFrame
  src="/interactive/computacion-2/semana-15/historial-navegacion/index.html"
  title="Simulador del historial de navegación: cómo cambian la pila de entradas y el puntero al navegar con navigate, Atrás, Adelante y replace"
  height={720}
/>

| Llamada | Qué pasa con el historial |
| --- | --- |
| `navigate("/carrito")` | **Push:** apila una entrada nueva y el puntero pasa a ella. Si había entradas adelante, se descartan. |
| `navigate(-1)` | **Atrás:** mueve el puntero una entrada hacia abajo (equivale al botón Atrás). |
| `navigate(1)` | **Adelante:** mueve el puntero una entrada hacia arriba. |
| `navigate("/gracias", { replace: true })` | **Replace:** reemplaza la entrada actual; el historial no crece. |

### Cuándo usar Link y cuándo useNavigate

- **`<Link>`** cuando el usuario hace clic en algo que **es** un enlace: es accesible, se puede abrir en otra pestaña y el navegador lo entiende.
- **`navigate`** cuando la navegación es **consecuencia** de algo: terminó un envío, expiró la sesión, el usuario pulsó un botón que hace más cosas.
- **`replace: true`** cuando no quieres que Atrás vuelva a esa página: después de pagar, de iniciar sesión o de una redirección.

## Datos en la URL: path variables y query params

La URL puede llevar datos. Hay dos formas y se usan para cosas distintas:

| | Path variable | Query params |
| --- | --- | --- |
| **Ejemplo** | `/productos/42` | `/productos?categoria=teclados&orden=precio` |
| **Se define en la ruta** | Sí: `productos/:id` | No: son libres |
| **Responde a** | **Cuál** recurso (el producto 42) | **Cómo** verlo (filtro, orden, página) |
| **Es obligatorio** | Sí, sin él la ruta no coincide | No, la ruta coincide con o sin ellos |
| **Hook para leerlo** | `useParams()` | `useSearchParams()` |

Recorre cómo se lee cada uno desde un componente:

<InteractiveFrame
  src="/interactive/computacion-2/semana-15/params-url/index.html"
  title="Anatomía de una URL con path variable y query params y cómo se leen en un componente con useParams y useSearchParams"
  height={800}
/>

### Navegar con un path variable

La lista crea un enlace por producto, poniendo su `id` en la URL; la ruta `:id` hace el resto:

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
  const { id } = useParams();   // siempre es un texto: "42"

  return <h1>Producto {id}</h1>;
}
```

### Filtrar con query params

`useSearchParams` se usa como `useState`: devuelve el valor actual y una función para cambiarlo. La diferencia es que el estado **vive en la URL**, así que el filtro se puede compartir y sobrevive a una recarga:

```jsx title="src/pages/Lista.jsx" showLineNumbers
import { useSearchParams } from "react-router";

export default function Lista() {
  const [params, setParams] = useSearchParams();
  const categoria = params.get("categoria");     // null si no existe

  const visibles = categoria
    ? productos.filter((p) => p.categoria === categoria)
    : productos;

  return (
    <>
      <button onClick={() => setParams({ categoria: "teclados" })}>Teclados</button>
      <button onClick={() => setParams({})}>Todos</button>

      {/* ...lista de visibles */}
    </>
  );
}
```

Cambiar los query params **navega** a la nueva URL (`/productos?categoria=teclados`) y el componente se vuelve a ejecutar con el valor nuevo.

## Cargar datos con loader

En el modo Data, cada ruta puede tener un `loader`: una función que se ejecuta **antes** de dibujar la ruta y recibe los `params`. Los datos llegan al componente con `useLoaderData`, sin `useEffect` ni estado de carga:

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

Si el `loader` lanza un error (o una `Response` con un código de estado), el router dibuja el `ErrorBoundary` de la ruta en lugar de su `Component`. Dentro de él, `useRouteError()` entrega lo que se lanzó:

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

:::tip[Cuándo un loader y cuándo un useEffect]
Un `loader` sirve para datos que la **página necesita para existir** (el producto del `:id`): se piden antes de dibujar y la navegación espera. Un `useEffect` sigue siendo la herramienta para sincronizar algo con el componente ya en pantalla, como ya viste en el capítulo de hooks.
:::

## Further Reading

- [React Router: Installation (modo Data)](https://reactrouter.com/start/data/installation)
- [React Router: Routing](https://reactrouter.com/start/data/routing)
- [React Router: Data Loading](https://reactrouter.com/start/data/data-loading)
- [useNavigate](https://reactrouter.com/api/hooks/useNavigate)
- [useParams](https://reactrouter.com/api/hooks/useParams)
- [useSearchParams](https://reactrouter.com/api/hooks/useSearchParams)
- [Error Boundaries](https://reactrouter.com/how-to/error-boundary)
- [History API (MDN)](https://developer.mozilla.org/es/docs/Web/API/History_API)

---

## Cuestionario de Autoevaluación

<Quiz id="compunet2-s15-react-router-quiz">
  <Question title="En una SPA con React Router, ¿qué ocurre cuando haces clic en un Link hacia /productos?">
    <Option>El navegador pide el archivo productos.html al servidor y recarga la página.</Option>
    <Option correct>El router lee la nueva URL, elige los componentes de esa ruta y React actualiza el DOM, sin pedir una página al servidor.</Option>
    <Option>El servidor ejecuta el componente y devuelve el HTML ya armado.</Option>
    <Option>React Router descarga de nuevo todo el JavaScript de la aplicación.</Option>
  </Question>
  <Question title="Al recargar con F5 en /productos/42 de una SPA, ¿por qué el servidor debe devolver index.html para cualquier ruta?">
    <Option>Porque el navegador no entiende las URL con parámetros.</Option>
    <Option>Porque React Router se desinstala al recargar.</Option>
    <Option correct>Porque solo existe un archivo HTML: sin esa regla el servidor buscaría un archivo /productos/42 que no existe y respondería 404.</Option>
    <Option>Porque el servidor debe volver a compilar la aplicación con Vite.</Option>
  </Question>
  <Question title="¿Qué se importa desde react-router/dom en el modo Data?">
    <Option>createBrowserRouter</Option>
    <Option>useNavigate</Option>
    <Option correct>RouterProvider</Option>
    <Option>Outlet</Option>
  </Question>
  <Question title="¿Para qué sirve el componente Outlet?">
    <Option>Para cerrar la sesión del usuario.</Option>
    <Option>Para crear enlaces que no recargan la página.</Option>
    <Option correct>Para marcar dónde se dibuja la ruta hija que coincide con la URL dentro del componente del padre.</Option>
    <Option>Para mostrar la página 404.</Option>
  </Question>
  <Question title="¿Qué hace una ruta con index: true?">
    <Option>Es la última ruta que se evalúa cuando ninguna coincide.</Option>
    <Option>Crea un índice de todas las rutas hijas.</Option>
    <Option correct>Se dibuja en el Outlet de su padre cuando la URL coincide exactamente con la del padre.</Option>
    <Option>Permite que la ruta tenga varios hijos con el mismo path.</Option>
  </Question>
  <Question title="Tienes un historial con tres entradas y el puntero en la del medio (después de pulsar Atrás). Si navegas con navigate('/carrito'), ¿qué pasa?">
    <Option>La entrada de adelante se conserva y Adelante sigue funcionando.</Option>
    <Option>El historial se borra por completo.</Option>
    <Option correct>La entrada de adelante se descarta y se apila la nueva en su lugar.</Option>
    <Option>La entrada actual se reemplaza por la nueva.</Option>
  </Question>
  <Question title="¿Para qué sirve navigate('/gracias', { replace: true }) después de pagar?">
    <Option>Para que el historial crezca con una entrada más.</Option>
    <Option correct>Para reemplazar la entrada actual y que Atrás no vuelva al carrito.</Option>
    <Option>Para recargar la página completa.</Option>
    <Option>Para mover el puntero una posición hacia atrás.</Option>
  </Question>
  <Question title="En la URL /productos/42?color=negro con la ruta productos/:id, ¿qué entrega cada hook?">
    <Option>useParams devuelve color y useSearchParams devuelve id.</Option>
    <Option>Los dos devuelven el mismo objeto con id y color.</Option>
    <Option>useParams devuelve el id como número (42) y useSearchParams solo sirve para cambiar la URL.</Option>
    <Option correct>useParams devuelve el id como texto ("42") y useSearchParams permite leer color con get("color").</Option>
  </Question>
  <Question title="¿Cuándo conviene usar un query param en lugar de una path variable?">
    <Option>Cuando el dato identifica cuál recurso se pide.</Option>
    <Option correct>Cuando el dato es opcional y describe cómo ver la lista: un filtro, un orden o una página.</Option>
    <Option>Cuando la ruta no debe coincidir si falta el dato.</Option>
    <Option>Nunca, siempre es mejor una path variable.</Option>
  </Question>
</Quiz>
