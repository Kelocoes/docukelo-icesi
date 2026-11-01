---
sidebar_position: 2
description: "Manejo de errores en Next.js: errores esperados y inesperados, el viaje de un error en el login con Redux y Server Actions, error.tsx y global-error.tsx, notFound, redirect, unauthorized y forbidden."
---

# Manejo de errores en Next.js

En el [documento anterior](./01-sesiones-en-nextjs.md) construimos el login con sesión y rutas protegidas, pero casi siempre asumimos que todo sale bien. En una aplicación real fallan cosas todo el tiempo: el usuario se equivoca de contraseña, el servicio de datos se cae, alguien abre una rutina que no existe. Lo importante es que **cada falla llegue a la pantalla de forma controlada**, con un mensaje que el usuario entienda, sin romper el resto de la página.

Este documento responde tres preguntas:

1. ¿Qué **clases de error** hay y cuál mecanismo corresponde a cada una?
2. ¿Cómo viaja un error por la cadena del login (`LoginForm` → hook → thunk → Server Action → caso de uso)?
3. ¿Qué hace Next.js cuando un error ocurre **al renderizar** una página (`error.tsx`, `global-error.tsx`, `not-found.tsx`)?

Sigue la [documentación oficial de manejo de errores de Next.js](https://nextjs.org/docs/app/getting-started/error-handling), aplicada a la arquitectura del curso.

---

## 1. Dos clases de error

La guía de Next.js separa los errores en dos grupos, y cada grupo se maneja de una forma distinta:

| | **Esperados** | **Inesperados** |
| :--- | :--- | :--- |
| **Qué son** | Fallas previstas: validación de un formulario, credenciales incorrectas, un recurso que no existe. | Bugs o fallas externas: una excepción en el código, un servicio caído, la red. |
| **Cómo se manejan** | Se **devuelven como valor** y se muestran en la interfaz. | Se **lanzan** (`throw`) y los atrapa un *error boundary* o un `try/catch`. |
| **Ejemplo** | `return { ok: false, message: 'Credenciales inválidas' }` | El backend responde 500 y el backend responde con un error y el datasource lanza una excepción. |

Además hay un tercer grupo: funciones que **lanzan a propósito** para controlar el flujo (`redirect()`, `notFound()`, `unauthorized()`, `forbidden()`). No son errores del programa: son órdenes que Next.js entiende y convierte en una redirección o en una página especial.

Elige qué falló en tu aplicación de rutinas y mira qué mecanismo corresponde, dónde ocurre y qué ve el usuario:

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/manejo-de-errores/index.html"
  title="Manejo de errores en Next.js: esperados, inesperados y helpers como redirect y notFound"
  height={820}
/>

La regla práctica que resume la pieza:

| Situación | Mecanismo | Resultado |
| :--- | :--- | :--- |
| Validación o credenciales incorrectas | `return { ok: false, message }` en la acción | El thunk lo convierte en `rejectWithValue` y el formulario muestra `errorMessage`. |
| Un bug o un servicio caído al renderizar una página | Una excepción (`throw`) | `error.tsx` del segmento, con `retry()`. |
| Falla de una acción llamada desde un thunk | `try/catch` en el thunk | `errorMessage` en el store. |
| Sin sesión | `redirect('/login')` | Navega a la página de login. |
| Sin sesión, con página propia (experimental) | `unauthorized()` | `unauthorized.tsx`, estado 401. |
| Sin permiso (experimental) | `forbidden()` | `forbidden.tsx`, estado 403. |
| El recurso no existe | `notFound()` | `not-found.tsx`, estado 404. |
| Falla en un `onClick` | `try/catch` y `useState` | Un boundary no la atrapa (tampoco el código asíncrono). |

---

## 2. Errores esperados: devuélvelos como valor

Un correo mal escrito no es un fallo del programa: es algo que sabías que podía pasar. Para esas situaciones la Server Action **no lanza una excepción**: devuelve un objeto que describe el resultado. Esa es la razón de que `loginAction` devuelva `{ ok: true, user }` o `{ ok: false, message }`.

```ts title="src/features/auth/presentation/actions/auth.actions.ts (fragmento)" showLineNumbers
const tokens = await authContainer.login.execute(parsed.data.email, parsed.data.password)
if (!tokens) {
  return { ok: false, message: 'Credenciales inválidas' } // esperado: se devuelve
}
```

¿Por qué no un `throw`? Hay dos razones:

- **Se perdería el mensaje.** Cuando una función del servidor lanza una excepción, Next.js en producción **oculta el texto del error** al cliente (por seguridad, para no filtrar detalles internos) y solo envía un identificador. Lo que sí viaja intacto es un valor devuelto.
- **Es el flujo normal, no una emergencia.** El usuario se equivocó de contraseña: debe ver el mensaje junto al formulario y poder reintentar, no una pantalla de error.

Esa distinción empieza **en el datasource**. Cuando el backend responde, no todos los códigos son iguales:

| Respuesta del backend | Tipo | Qué hace el datasource |
| :--- | :--- | :--- |
| `401` (credenciales inválidas) | Esperado | Devuelve `null`; la acción responde `{ ok: false, message }`. |
| `500`, o no responde | Inesperado | Lanza un error (`throw new Error('El backend no respondió')`). |

En nuestra arquitectura el valor devuelto sigue un camino fijo hasta la interfaz:

| Paso | Qué ocurre |
| :--- | :--- |
| `loginAction` | Devuelve `{ ok: false, message }`. |
| Thunk `loginMutation` | Ve `ok: false` y hace `rejectWithValue(message)`. |
| Slice | En `rejected`, guarda el texto en `state.errorMessage`. |
| `useAuth()` | Expone `errorMessage`. |
| `LoginForm` | Lo muestra con `{errorMessage && <p role="alert">…</p>}`. |

:::note[Cómo lo haría la guía oficial]
Con `<form action>` y `useActionState`, la acción recibe `(prevState, formData)`, devuelve `{ message }` y el componente lo lee de `state`: `const [state, action, pending] = useActionState(login, initialState)`. El principio es el mismo (el error esperado es un valor); solo cambia quién lo guarda: el componente en lugar del slice.
:::

El atributo `role="alert"` del mensaje hace que los lectores de pantalla lo anuncien apenas aparece. Es parte de mostrar bien un error: que **todas** las personas lo perciban.

---

## 3. El viaje de un error en tu login

Un error esperado tiene un camino claro. Pero ¿qué pasa cuando falla algo que nadie previó? Elige una falla con el selector «Qué falla» y sigue su recorrido, de derecha a izquierda, hasta el mensaje que lee ana.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/viaje-del-error/index.html"
  title="El viaje de un error en el login: credenciales inválidas, backend caído y red caída"
  height={560}
/>

Lo que la pieza muestra:

- **Los tres casos terminan en el mismo lugar:** el mensaje del formulario. Ninguno llega a `error.tsx`.
- **El thunk es el lugar de atrapar lo inesperado.** El código asíncrono (un thunk, un `onClick`) **no lo cubre ningún error boundary**: los boundaries solo atrapan errores durante el *renderizado*. Por eso el thunk lleva `try/catch`.
- **`createAsyncThunk` ya atrapa las excepciones** por ti: si el thunk lanza, Redux Toolkit despacha la acción `rejected` con el error. El `try/catch` explícito sirve para elegir **tu propio mensaje** en lugar de uno técnico.
- **Lo que ve el usuario y lo que ves tú son distintos.** Un error inesperado debe mostrarle a ana un mensaje genérico («No se pudo iniciar sesión. Intenta de nuevo.») y dejar el detalle real en los registros del servidor.

```ts title="src/features/auth/presentation/store/auth.slice.ts (fragmento)" showLineNumbers
export const loginMutation = createAsyncThunk(
  'auth/login',
  async (params: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const result = await loginAction(params.email, params.password)
      if (!result.ok) return rejectWithValue(result.message) // esperado: llegó como valor
      return result.user
    } catch {
      return rejectWithValue('No se pudo iniciar sesión. Intenta de nuevo.') // inesperado
    }
  }
)
```

Cómo leerlo: la línea 6 maneja la **falla prevista** (la acción respondió que algo estaba mal). El bloque `catch` maneja la **imprevista** (la llamada a la acción falló: servidor caído, red perdida, excepción sin atrapar). En ambos casos el resultado es el mismo para el usuario: un `errorMessage`.

:::warning[Un `onClick` tampoco está protegido]
Lo mismo vale para cualquier manejador de eventos: si falla, ningún boundary lo ve. Usa `try/catch` y guarda el error en el estado (`setError(e.message)`). La excepción es `startTransition`: sus errores no atrapados **sí** suben al error boundary más cercano.
:::

---

## 4. Errores inesperados al renderizar: `error.tsx`

Todo lo anterior ocurría en código que **llama** a algo. Pero ¿y si una página falla **mientras se renderiza**? Por ejemplo, `RoutinesPage` pide las rutinas, el datasource lanza una excepción y la página no puede dibujarse. Ahí entra el **error boundary** de Next.js: el archivo `error.tsx`.

Un `error.tsx` es un componente de cliente que Next.js muestra **en lugar de** la parte de la pantalla que falló. Los layouts de arriba siguen visibles: el usuario no pierde el menú ni el resto de la página.

```tsx title="app/routines/error.tsx" showLineNumbers
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error) // aquí iría el registro del error
  }, [error])

  return (
    <div role="alert" className="flex flex-col gap-3">
      <h2>No pudimos cargar tus rutinas</h2>
      <button className="btn" onClick={() => retry()}>Reintentar</button>
    </div>
  )
}
```

Cómo leerlo: debe ser `'use client'` (los error boundaries son componentes de cliente). Recibe el `error` y una función `retry()` que **intenta renderizar de nuevo** el segmento. El `useEffect` es el lugar para registrar el error.

### ¿Qué `error.tsx` se muestra?

Cada carpeta de `app/` puede tener su propio `error.tsx`. Lo importante es **cuál atrapa qué**: un `error.tsx` envuelve a la página y a las rutas de abajo, pero **no** al `layout.tsx` de su propia carpeta (el layout está por fuera). Elige dónde se lanza el error y mira cuál lo atrapa:

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/error-boundaries-segmentos/index.html"
  title="Qué error.tsx atrapa un error según dónde se lance"
  height={780}
/>

| Se lanza en… | Lo atrapa | Qué ve el usuario |
| :--- | :--- | :--- |
| La página de un segmento | El `error.tsx` de ese segmento | Los layouts siguen en pantalla; solo se reemplaza la página. |
| El layout de un segmento | El `error.tsx` de la carpeta de arriba | Se reemplaza el layout de ese segmento y todo lo que contiene. |
| El layout raíz (`app/layout.tsx`) | `app/global-error.tsx` | Se reemplaza toda la página. |
| El propio `error.tsx` | El `error.tsx` del nivel superior | Un error boundary no se atrapa a sí mismo. |
| Un segmento sin `error.tsx` | El más cercano hacia arriba | El error «burbujea». |

Para el layout raíz existe un archivo especial. Como reemplaza **toda** la página, debe incluir sus propias etiquetas `<html>` y `<body>`:

```tsx title="app/global-error.tsx" showLineNumbers
'use client'

export default function GlobalError({ retry }: { error: Error; retry: () => void }) {
  return (
    <html>
      <body>
        <h2>Algo salió mal</h2>
        <button onClick={() => retry()}>Reintentar</button>
      </body>
    </html>
  )
}
```

:::note[`retry` o `reset`]
En versiones anteriores de Next.js la propiedad de `error.tsx` se llamaba `reset`; la documentación actual usa `retry`. Si tu proyecto usa otra versión, revisa cuál recibe.
:::

:::tip[Un fallback dentro de un componente]
Si solo quieres proteger **una parte** de una página (un widget), sin crear un segmento, Next.js ofrece `catchError` (de `next/error`): envuelve un componente y define su propio fallback.
:::

---

## 5. Errores que se lanzan a propósito

Algunas situaciones no son «errores» sino **decisiones de flujo**: no hay sesión, no tienes permiso, el recurso no existe. Next.js ofrece funciones que lanzan una excepción especial y la convierten en la respuesta correcta. Cada una tiene su archivo de convención para personalizar lo que ve el usuario:

| Función | Cuándo | Resultado | Archivo |
| :--- | :--- | :--- | :--- |
| `redirect('/login')` | No hay sesión (o cualquier redirección). | Navega a otra ruta. | — |
| `notFound()` | El recurso no existe. | Estado 404. | `not-found.tsx` |
| `unauthorized()` | No hay sesión y quieres una página propia. | Estado 401. | `unauthorized.tsx` |
| `forbidden()` | Hay sesión pero no permiso. | Estado 403. | `forbidden.tsx` |

`unauthorized()` y `forbidden()` son **experimentales**: hay que activarlas en `next.config.ts`.

```ts title="next.config.ts" showLineNumbers
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
}

export default nextConfig
```

Ejemplo con la rutina que no existe y la que es de otro usuario:

```tsx title="app/routines/[id]/page.tsx" showLineNumbers
import { notFound, forbidden } from 'next/navigation'
import { requireSession } from '@/lib/dal'

export default async function RoutinePage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await requireSession()  // sin sesión: redirect('/login')
  const { id } = await params

  const routine = await getRoutine(id)
  if (!routine) notFound()                  // no existe: 404
  if (routine.ownerId !== userId) forbidden() // es de otro: 403

  return <RoutineView routine={routine} />
}
```

```tsx title="app/routines/[id]/not-found.tsx" showLineNumbers
export default function NotFound() {
  return <p>No encontramos esa rutina.</p>
}
```

:::warning[No las metas en un `try/catch`]
`redirect()`, `notFound()`, `unauthorized()` y `forbidden()` funcionan **lanzando** una excepción. Si las llamas dentro de un `try/catch`, el `catch` se las traga y no ocurre la redirección ni aparece la página. Llámalas fuera del `try`, o vuelve a lanzar el error con `unstable_rethrow(error)` (de `next/navigation`). Tampoco escribas `return notFound()`: la función nunca devuelve nada, detiene la ejecución.
:::

---

## 6. Qué ve el usuario y qué ves tú

Un buen manejo de errores separa dos audiencias:

| | Mensaje al usuario | Registro para ti |
| :--- | :--- | :--- |
| **Error esperado** | Específico y accionable: «Credenciales inválidas», «La contraseña debe tener al menos 6 caracteres». | Normalmente no hace falta. |
| **Error inesperado** | Genérico: «No se pudo iniciar sesión. Intenta de nuevo.» Nunca el texto de una excepción. | El detalle completo: qué falló y dónde. |
| **Seguridad** | Que no revele información: no digas «ese correo no existe» (le dice a un atacante qué correos están registrados). | Sí puedes registrar el intento. |

En producción, Next.js ya te ayuda: el mensaje de un error lanzado en el servidor se **reemplaza por uno genérico** y se adjunta un `digest` (un identificador). Ese mismo `digest` aparece en los registros del servidor, así puedes relacionar lo que vio el usuario con lo que pasó. En `error.tsx` lo recibes en `error.digest`.

---

## Resumen

| Quiero… | Uso |
| :--- | :--- |
| Mostrar «credenciales inválidas» en el formulario | `return { ok: false, message }` + `rejectWithValue` + `errorMessage`. |
| Que una falla inesperada no rompa el formulario | `try/catch` en el thunk. |
| Que un fallo al renderizar muestre una pantalla de error | `error.tsx` en el segmento (y `global-error.tsx` para el layout raíz). |
| Redirigir a quien no tiene sesión | `redirect('/login')` en el DAL. |
| Mostrar una página 404 / 401 / 403 propia | `notFound()` / `unauthorized()` / `forbidden()` + su archivo. |
| Que un error de un `onClick` no pase en silencio | `try/catch` y `setError(...)`. |
