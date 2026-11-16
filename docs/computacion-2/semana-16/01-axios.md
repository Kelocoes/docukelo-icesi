---
sidebar_position: 1
description: "Consume una API desde React con useEffect y Axios: GET al montar, un cliente configurado con .env e interceptor, login con POST y el token guardado en localStorage."
---

# Axios y useEffect: consumir una API

Hasta ahora tus componentes trabajan con datos que ellos mismos inventan. En una aplicación real los datos viven en un **servidor** y el componente tiene que pedirlos. En este capítulo conectas tu app de React con el backend de rutinas: primero **recuerdas `useEffect`** (el hook que se conecta con el mundo exterior), luego pides datos con **Axios** y al final haces **login**, guardas el **token** y lo envías en cada petición.

## Repaso de `useEffect`

Un componente solo debe **calcular lo que se dibuja**. Pedir datos a un servidor no es parte de ese cálculo: es hablar con algo que React no controla. Para eso existe `useEffect`: se ejecuta **después** de que React pintó la pantalla.

```jsx title="Forma de un efecto"
useEffect(() => {
  // 1. el efecto: se ejecuta después del render
  return () => {
    // 2. la limpieza (opcional): se ejecuta antes del siguiente efecto y al desmontar
  };
}, [dependencias]); // 3. cuándo se repite
```

El arreglo de dependencias decide **cuándo se repite** el efecto:

| Dependencias | Cuándo corre el efecto | Uso típico |
| :-- | :-- | :-- |
| `[]` | Una sola vez, al montar | Cargar la lista inicial desde la API |
| `[id]` | Al montar y cada vez que `id` cambia | Pedir el detalle de la rutina que cambia con la URL |
| _(sin arreglo)_ | Después de **cada** render | Casi nunca; suele causar bucles de peticiones |

:::note[¿Por qué mi petición sale dos veces en desarrollo?]
En modo desarrollo, `<StrictMode>` monta cada componente, lo desmonta y lo vuelve a montar a propósito para comprobar que tu limpieza funciona. En producción corre una sola vez. Si la petición es un `GET`, no pasa nada; si ves duplicados con `POST`, revisa que no los estés enviando desde un efecto.
:::

Si necesitas repasar cuándo corre y cuándo se limpia un efecto, vuelve a la [semana 15](../semana-15/react-hooks).

## Axios: el cliente HTTP

[Axios](https://axios-http.com/) es una librería que envía peticiones HTTP desde el navegador y devuelve **promesas**. Se instala con:

```bash title="Terminal"
npm install axios
```

Frente a `fetch`, que ya viene en el navegador, te ahorra trabajo repetido:

| Característica | Axios | `fetch` |
| :-- | :-- | :-- |
| Convierte la respuesta JSON | Sí, en `res.data` | No: hay que llamar a `.json()` |
| Errores HTTP (401, 404, 500) | Rechaza la promesa | No: solo rechaza si no hay red |
| Interceptores | Sí | No |
| Cuerpo de un `POST` | Pasas un objeto y lo convierte | Debes usar `JSON.stringify` y el encabezado |

Esa diferencia en los errores es la más importante: con Axios, un `401` cae en el `catch`; con `fetch` tendrías que revisar `res.ok` a mano.

## GET con `useEffect`

El patrón más común: al aparecer el componente, pedir la lista y guardar tres cosas en estado: los **datos**, si está **cargando** y si hubo un **error**.

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

Recorre la petición de principio a fin. La pestaña **Flujo** muestra cómo se comunican los archivos y la pestaña **Pantalla** lo que vería el usuario (con las peticiones en Network); abajo, el código de `Rutinas.jsx` y de `api.js`. Cambia la respuesta del servidor para ver el camino de éxito y los de error:

<InteractiveFrame
  src="/interactive/computacion-2/semana-16/useeffect-axios/index.html"
  title="Un componente que pide /rutinas con useEffect y Axios: primer render, petición y tres posibles respuestas del servidor"
  height={760}
/>

### Qué debes llevarte

- **El efecto corre después de pintar:** por eso el primer render siempre muestra «Cargando...»: los datos aún no existen.
- **Cambiar el estado vuelve a dibujar:** `setRutinas` y `setCargando` provocan un nuevo render; el efecto no se repite porque `[]` no cambió.
- **Siempre hay tres casos:** datos, cargando y error. Si solo programas el caso feliz, el estudiante que pierda la red verá una pantalla en blanco.

:::tip[¿Quieres usar `async/await`?]
La función que le pasas a `useEffect` **no puede ser `async`** (devolvería una promesa en lugar de la limpieza). Define una función `async` adentro y llámala:

```jsx title="async/await dentro de un efecto"
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

## Dónde guardar el token: `localStorage`

Más adelante harás login y el servidor te devolverá un **token**. Ese token tiene que vivir en algún sitio para que sobreviva a recargar la página. El navegador ofrece varios lugares:

| Lugar | Sobrevive a recargar | Sobrevive a cerrar la pestaña | Lo puede leer tu JavaScript |
| :-- | :-: | :-: | :-: |
| Variable o estado de React | No | No | Sí |
| `sessionStorage` | Sí | No | Sí |
| **`localStorage`** | **Sí** | **Sí** | **Sí** |
| Cookie `HttpOnly` | Sí | Según su caducidad | No: solo la envía el navegador |

`localStorage` es un almacén de **pares clave-valor** que el navegador guarda por sitio (origen). Su uso se resume en cuatro métodos:

```js title="localStorage" showLineNumbers
localStorage.setItem("token", "eyJhbGci...");   // guardar
const token = localStorage.getItem("token");    // leer (null si no existe)
localStorage.removeItem("token");               // borrar una clave
localStorage.clear();                           // borrar todo lo del sitio
```

Dos cosas que tienes que saber:

- **Solo guarda texto.** Para un objeto, conviértelo: `localStorage.setItem("user", JSON.stringify(user))` y léelo con `JSON.parse(localStorage.getItem("user"))`.
- **Cualquier script de la página puede leerlo.** Si tu app tuviera una vulnerabilidad XSS, un atacante podría robar el token. Para la clase es la opción más simple y la que usaremos; en producción se prefiere una cookie `HttpOnly` que configura el backend.

Puedes ver lo que guardaste en el navegador: _DevTools → Application → Local Storage_.

## Variables de entorno: `.env`

La dirección del servidor cambia según dónde corre la app: tu computador, el servidor de pruebas, la sala. Escribirla dentro del código obliga a editar muchos archivos. Un archivo **`.env`** guarda esos valores **fuera del código**, como pares `NOMBRE=valor`, en la raíz del proyecto:

```env title=".env"
VITE_API_URL=http://localhost:8081/compunet2-2026/rest
```

- En **Vite**, solo las variables que empiezan por `VITE_` llegan al código del navegador. Se leen con `import.meta.env.VITE_API_URL`.
- El `.env` se lee **al arrancar** el servidor de desarrollo: si lo editas, reinicia `npm run dev`.
- Vite carga `.env.production` al hacer `npm run build`. Así tienes una URL para desarrollo y otra para producción sin tocar el código.
- Agrega `.env` al `.gitignore` si contiene datos propios del entorno.

:::warning[El `.env` de Vite no es secreto]
Todo lo que empieza por `VITE_` termina **dentro del JavaScript** que descarga el navegador. Sirve para direcciones y configuración, nunca para claves privadas.
:::

## El cliente `api.js`

Repetir la URL completa en cada petición es frágil y el token tendría que agregarse a mano en cada una. La solución es **crear un cliente una sola vez** y que todos los componentes lo importen.

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

- **`axios.create`** fija la `baseURL`: en los componentes escribes `api.get("/rutinas")` y Axios arma la URL completa.
- **Un interceptor de petición** es una función que Axios ejecuta **justo antes de enviar cualquier petición** hecha con `api`. Aquí lee el token y, si existe, agrega el encabezado `Authorization: Bearer <token>`.

Recorre el archivo y mira qué parte produce cada línea de la petición que sale:

<InteractiveFrame
  src="/interactive/computacion-2/semana-16/api-cliente/index.html"
  title="El archivo api.js: la URL base del .env, la instancia de Axios y el interceptor que agrega el token, enlazados con la petición que sale"
  height={780}
/>

:::tip
Como el interceptor lee `localStorage` **en cada petición** (y no una vez al cargar el archivo), el login y el logout surten efecto al instante, sin recargar la página.
:::

## POST: el login

Un `POST` envía datos en el **cuerpo** de la petición. Con Axios, el segundo argumento es el objeto que quieres enviar y la librería lo convierte a JSON.

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

Aquí no hay `useEffect`: el login ocurre cuando el usuario **envía el formulario**, no cuando el componente aparece. Regla práctica: un `GET` de datos que la pantalla necesita al abrirse va en un efecto; una acción del usuario (login, crear, borrar) va en un **manejador de eventos**.

:::note
Las rutas (`/auth/login`, `/rutinas`) y la forma de la respuesta (`{ token }`) son las del backend de ejemplo. Ajústalas a las de tu API: revisa con Postman o Swagger qué devuelve.
:::

## El recorrido completo

Sigue el viaje del token: se pide con un `POST`, se guarda en el navegador y viaja en el encabezado de la siguiente petición. En **Pantalla** verás el formulario, el `localStorage` (pestaña Application) y las peticiones con su columna Authorization; abajo, los tres archivos que intervienen. Cambia la opción para ver qué pasa con una contraseña incorrecta.

<InteractiveFrame
  src="/interactive/computacion-2/semana-16/login-token/index.html"
  title="Recorrido de un login con Axios: el POST, el token guardado en localStorage y una petición protegida que lo envía en el encabezado Authorization"
  height={800}
/>

### Qué debes llevarte

- **El token no se manda a mano:** `api.js` lo agrega en cada petición; tus componentes solo escriben la ruta.
- **El login no lleva token:** todavía no existe; por eso el interceptor lo deja pasar sin encabezado.
- **Un login fallido no guarda nada:** el `401` cae en el `catch`, así que `setItem` y `navigate` no se ejecutan.

## Otro POST autenticado: crear una rutina

Con el token guardado, cualquier petición protegida funciona igual. Crear una rutina es un `POST` normal; el interceptor se encarga de la autenticación:

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

Dos detalles:

- **`err.response`** existe solo si el servidor respondió (por ejemplo, con un `400`). Si no hubo red, es `undefined`; por eso se usa `?.`.
- **`setRutinas((actuales) => [...])`** usa la versión funcional del setter, que parte del valor más reciente. Así la lista se actualiza sin volver a pedirla al servidor.

## Qué pasa cuando el token vence

El token tiene fecha de vencimiento. Cuando pasa, el servidor responde `401` a cualquier petición. En lugar de revisar eso en cada componente, se resuelve **una vez** con un **interceptor de respuesta** en `api.js`:

```js title="src/api.js (al final, antes del export)" showLineNumbers
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

Si la respuesta es un `401`, borra el token y manda al login; el resto de errores se siguen propagando al `catch` del componente. Se usa `import.meta.env.BASE_URL` para que también funcione cuando la app se despliega en una subruta (lo verás en el último capítulo).

En el siguiente capítulo aprenderás a **impedir que un usuario sin token vea una página**, en lugar de esperar a que el servidor lo rechace.

## Recursos

- [Documentación de Axios](https://axios-http.com/docs/intro)
- [`useEffect` en react.dev](https://react.dev/reference/react/useEffect)
- [Variables de entorno en Vite](https://vite.dev/guide/env-and-mode)
- [`localStorage` en MDN](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage)
