---
sidebar_position: 2
description: "Cómo proteger rutas y acciones en Next.js con tres capas independientes: proxy.ts, el DAL con requireSession y requirePermission, y las Server Actions. Incluye permisos en el token, la división de la página en servidor y cliente, y los límites de lo que el front puede garantizar."
---

# Rutas protegidas en Next.js

En el [documento anterior](./01-sesiones-en-nextjs.md) construimos la sesión: el usuario inicia sesión, el token queda en una cookie `httpOnly` y la interfaz sabe quién es. Pero **tener sesión no sirve de nada si cualquiera puede escribir `/routines` en la barra de direcciones**, o enviar un POST a una Server Action sin pasar por tu interfaz.

Proteger una ruta es decidir, **en cada petición**, si el usuario puede ver ese contenido o ejecutar esa acción. Una sola puerta no alcanza: este documento construye tres, cada una por su cuenta. Al terminarlo sabrás:

1. **Qué comprueba cada capa** (el proxy, el DAL y las Server Actions) y qué **no** puede hacer.
2. **Cómo viajan los permisos** dentro del token y quién los usa para qué.
3. **Cómo escribir** `requireSession`, `requirePermission`, `proxy.ts` y las acciones que exigen un permiso.
4. **Por qué** la página de rutinas se divide en una página de servidor y una vista de cliente.
5. **Qué garantiza el front y qué no**: ocultar un botón no es proteger, y la firma del token la verifica el backend.

Lo que pasa cuando algo falla (un permiso que falta, un backend caído) tiene su propio documento: [Manejo de errores en Next.js](./03-manejo-de-errores-nextjs.md).

---

## 1. Tres puertas, no una

Sigue una petición por las tres capas. Elige un tipo de petición en el selector y mira en cuál se detiene: sin cookie, sin permiso, con una cookie alterada, y un POST directo a una acción.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/capas-de-defensa/index.html"
  title="Tres capas de defensa de una ruta protegida: proxy, DAL y Server Actions"
  height={680}
/>

| Capa | Qué comprueba | Qué NO puede hacer |
| :--- | :--- | :--- |
| **`proxy.ts`** | Que haya un token decodificable y vigente, antes de renderizar. Es rápida y no consulta al backend. | No verifica la firma ni mira los permisos finos. Es un chequeo «optimista». |
| **El DAL** (`requireSession`, `requirePermission`) | Lo mismo, pero **junto a la página o al dato**, y además comprueba el permiso. | No verifica la firma. La decisión final es del backend. |
| **Cada Server Action** | Que quien la llama tenga sesión y el permiso, por su cuenta. | No hereda lo que comprueba la página que la usa. |

Una Server Action es un endpoint público: alguien puede enviarle un POST sin pasar por tu interfaz. Por eso **cada acción exige su permiso**, aunque el proxy y la página ya lo hayan hecho.

El front puede decodificar el token y por eso decide rápido, sin peticiones, qué mostrar y a dónde redirigir. Pero **no verifica la firma**: el backend sigue siendo quien verifica el token en cada llamada y decide los permisos reales.

---

## 2. Los permisos viajan dentro del token

El token que emite el backend no solo dice quién eres: también lleva tu **rol** y la lista de **permisos** que tienes. En el curso, el mock firma un JWT así:

```json title="Contenido del token de ana (decodificado)"
{
  "sub": "1",
  "name": "Ana Pérez",
  "role": "USER",
  "permissions": ["view_routines"],
  "exp": 1793500000
}
```

Esta guía protege con **permisos**, no con roles: una acción como «crear una rutina» se pregunta `¿tienes create_routines?`, no `¿eres ADMIN?`. Es más flexible (dos roles pueden compartir un permiso) y lo que cambia al agregar una función es una cadena, no una condición escrita en varios sitios. El `role` viaja en el token, pero ninguna guardia lo usa.

| Usuario | Rol | Permisos |
| :--- | :--- | :--- |
| `ana@icesi.edu.co` | `USER` | `view_routines` |
| `admin@icesi.edu.co` | `ADMIN` | `view_routines`, `create_routines` |
| Cualquiera que se registre | `USER` | `view_routines` |

Cada capa lee los mismos datos, pero para fines distintos. Elige un caso y sigue qué hace cada una con los permisos:

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/permisos-por-capa/index.html"
  title="Qué hace cada capa con los permisos del token: la interfaz, el proxy, la página y la acción"
  height={760}
/>

La diferencia clave:

| | `hasPermission()` (en `useAuth`) | `requirePermission()` (en el DAL) |
| :--- | :--- | :--- |
| **Dónde corre** | En el navegador | En el servidor |
| **De dónde lee** | Redux (el usuario hidratado) | La cookie, en cada petición |
| **Para qué** | **Mostrar u ocultar** (por ejemplo el formulario) | **Impedir** el acceso |
| **Si falla** | Devuelve `false` | Lanza una excepción |

:::warning[Ocultar no es proteger]
Ocultar el formulario de crear rutina mejora la experiencia, pero cualquiera puede enviar la petición a mano. Los permisos del front son **solo para la interfaz**; lo que impide crear la rutina es que `createRoutineAction` la rechace en el servidor.
:::

:::note[El token puede estar desactualizado]
Los permisos del token valen hasta que este venza: si le quitan un permiso a un usuario, su token viejo sigue diciendo lo anterior. Si necesitas el dato **fresco**, pregúntale al backend (por ejemplo `GET /auth/me` con el token); cuesta una petición, así que hazlo solo donde importe. Con el mock del curso, cierra sesión y vuelve a entrar para ver un cambio de permisos.
:::

---

## 3. Dónde va cada archivo

Esta pieza es la misma de la guía anterior, abierta en su tercera fase: muestra los archivos que agregan las guardias.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/estructura-auth/index.html#fase=3"
  title="Estructura de carpetas del proyecto con las guardias: token.ts, dal.ts, proxy.ts y las acciones de rutinas"
  height={1200}
/>

| Archivo | Qué hace | Lo usan |
| :--- | :--- | :--- |
| `src/lib/token.ts` | Lo que no depende del servidor: el nombre de la cookie, la forma del token y `decodeToken`. | `session.ts`, el DAL y el proxy. |
| `src/lib/dal.ts` | Se amplía: `requireSession` y `requirePermission`. | Las páginas y las Server Actions. |
| `proxy.ts` | La primera barrera: redirige antes de renderizar. | Next.js, antes de cada petición. |
| `RoutinesView.tsx` | La vista de cliente de rutinas. | La página de rutinas. |
| `routines.actions.ts` | Leer y crear rutinas, cada una exigiendo su permiso. | Los thunks del slice de rutinas. |

---

## 4. `token.ts`: lo que comparten la sesión y el proxy

El proxy necesita decodificar el token y saber cómo se llama la cookie, igual que `session.ts` y el DAL. Pero `session.ts` lleva `import 'server-only'` y usa `next/headers`. Para que el proxy no dependa de eso, saca la cookie, el tipo y `decodeToken` a un archivo puro:

```ts title="src/lib/token.ts" showLineNumbers
import { jwtDecode } from 'jwt-decode'

export const SESSION_COOKIE = 'session'

export type TokenPayload = {
  sub: string
  name: string
  role: string
  permissions: string[]
  exp: number
}

// Lee el contenido del token. NO verifica la firma: eso lo hace el backend.
export function decodeToken(token: string | undefined): TokenPayload | null {
  if (!token) return null
  try {
    const payload = jwtDecode<TokenPayload>(token)
    if (typeof payload.exp !== 'number' || payload.exp * 1000 < Date.now()) return null
    return payload
  } catch {
    return null
  }
}
```

`session.ts` deja de definirlos y los importa. Solo conserva lo que sí depende del servidor, `createSession` y `deleteSession`:

```ts title="src/lib/session.ts (importaciones)" showLineNumbers
import 'server-only'
import { cookies } from 'next/headers'
import { decodeToken, SESSION_COOKIE, type TokenPayload } from './token'
```

Y el DAL importa de la misma fuente:

```ts title="src/lib/dal.ts (importaciones)" showLineNumbers
import { decodeToken, SESSION_COOKIE } from './token'
```

---

## 5. El DAL: la sesión y el permiso, junto al dato

**Qué hace:** `getSession()` lee la cookie, decodifica el token y devuelve el usuario, su rol, sus permisos y el propio token, o `null` si no hay sesión vigente. `requireSession()` hace lo mismo pero **redirige a `/login`** si no hay. `requirePermission(permiso)` además exige que el permiso esté en el token. **Para qué sirve:** son los chequeos que se llaman justo antes de leer o cambiar algo. **Se relaciona con:** usa `decodeToken`; lo llaman las páginas y las Server Actions.

```ts title="src/lib/dal.ts" showLineNumbers
import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { decodeToken, SESSION_COOKIE } from './token'

export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  const payload = decodeToken(token)
  if (!payload || !token) return null

  // los datos salen del token: no hace falta pedirlos al backend
  return { userId: payload.sub, name: payload.name, role: payload.role, permissions: payload.permissions, accessToken: token }
}

export async function requireSession() {
  const session = await getSession()
  if (!session) redirect('/login')
  return session
}

export async function requirePermission(permission: string) {
  const session = await requireSession()
  if (!session.permissions.includes(permission)) {
    throw new Error('No tienes permiso')
  }
  return session
}
```

Las dos funciones exigentes **devuelven la sesión**, así que puedes usarla después, por ejemplo para sacar el `accessToken` y enviárselo al backend con `Authorization: Bearer ...`.

:::info[Sin permiso, un error genérico]
Si falta el permiso, `requirePermission` lanza un error y el usuario ve una pantalla de error en vez de una página 403. Es una simplificación. Next.js ofrece `forbidden()` y `unauthorized()` para mostrar páginas propias con el estado 403 y 401, pero son **experimentales** y hay que activarlas con `experimental.authInterrupts` en `next.config.ts`. El [documento de errores](./03-manejo-de-errores-nextjs.md) las explica.
:::

---

## 6. La página de rutinas: servidor y cliente

Querrías llamar a `requirePermission("view_routines")` justo en la página de rutinas. Pero esa página, tal como quedó en la semana 12, es un componente de cliente (`'use client'`), porque usa el hook `useRoutines`. Y el DAL usa `cookies()` y `server-only`: solo existen en el servidor.

Elige las dos estructuras en el selector: la primera falla, la segunda es la solución.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/pagina-servidor-cliente/index.html"
  title="Por qué la página de rutinas se divide en una página de servidor y una vista de cliente"
  height={640}
/>

La solución es dividir la página en dos:

1. Crea `src/features/routines/presentation/components/RoutinesView.tsx` con **el contenido de la página actual**, convertido en un componente (`export function RoutinesView()`) y con imports relativos (`../hooks/use-routines`, `./RoutineCard`, `./RoutineForm`).
2. Reescribe `app/(app)/routines/page.tsx` como página de **servidor**, que exige el permiso y renderiza la vista:

```tsx title="app/(app)/routines/page.tsx" showLineNumbers
import { requirePermission } from '@/src/lib/dal'
import { RoutinesView } from '@/src/features/routines/presentation/components/RoutinesView'

export default async function RoutinesPage() {
  await requirePermission('view_routines')

  return <RoutinesView />
}
```

Sin sesión, redirige a `/login`. Sin el permiso, falla antes de dibujar nada. El navegador recibe la vista, pero **no el token**: sigue en la cookie `httpOnly`.

:::warning[No decidas la sesión solo en el layout]
Por el renderizado parcial, un layout **no se vuelve a renderizar** en cada navegación entre rutas hijas: no vería que la sesión cambió. El layout solo hidrata la interfaz; la sesión se exige en cada página (o, mejor, junto al dato, con `requireSession`).
:::

---

## 7. `proxy.ts`: la primera barrera

**Qué hace:** se ejecuta antes de cada petición, decodifica el token de la cookie y redirige: a `/login` si pides una ruta protegida sin sesión, y a `/routines` si ya tienes sesión y entras a `/login` o `/register`. **Para qué sirve:** evitar renderizar páginas que el usuario no podría ver, sin gastar una petición al backend. **Se relaciona con:** usa `decodeToken` de `token.ts`; lo ejecuta Next.js solo, sin que lo llames. **No reemplaza al DAL ni al backend.**

Elige una petición y mira qué decide el proxy: el matcher, la lectura de la cookie y las tres respuestas posibles.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/proxy-reglas/index.html"
  title="Qué decide proxy.ts en cada petición: el matcher, la cookie y las tres respuestas"
  height={640}
/>

Crea `proxy.ts` en la **raíz** del proyecto, junto a `app/`:

```ts title="proxy.ts" showLineNumbers
import { NextRequest, NextResponse } from 'next/server'
import { decodeToken, SESSION_COOKIE } from '@/src/lib/token'

const protectedRoutes = ['/routines']
const publicRoutes = ['/login', '/register']

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtected = protectedRoutes.some((route) => path.startsWith(route))
  const isPublic = publicRoutes.includes(path)

  const payload = decodeToken(req.cookies.get(SESSION_COOKIE)?.value)

  if (isProtected && !payload) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
  if (isPublic && payload) {
    return NextResponse.redirect(new URL('/routines', req.nextUrl))
  }
  return NextResponse.next()
}

export const config = {
  // No ejecutar el proxy para archivos estáticos ni para /api
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}
```

Cómo leerlo: `protectedRoutes` y `publicRoutes` son las listas de rutas; `config.matcher` le dice a Next.js en qué peticiones ejecutar el proxy (todas menos los archivos estáticos y los metadatos). Sin un `matcher`, el proxy correría en cada petición, incluidos los archivos estáticos. Corre en el runtime de Node.js.

:::info[proxy.ts o middleware.ts]
Next.js 16 renombró `middleware.ts` a `proxy.ts` (y la función exportada a `proxy`). En Next.js 15 o anterior el archivo se llama `middleware.ts` y exporta `middleware`.
:::

:::warning[Las Server Actions también pasan por el proxy, o no]
Una Server Action es un POST a la ruta donde se usa. Si el `matcher` cubre esa ruta, el proxy también ve el POST; si la **excluyera**, el proxy no la revisaría. Un cambio del `matcher`, o mover una acción a otra ruta, puede quitar la cobertura sin que nadie lo note. Por eso el proxy **no basta**: cada acción debe comprobar por su cuenta.
:::

---

## 8. Server Actions que exigen su permiso

Hasta ahora las rutinas se leían y se creaban desde el navegador. Para que sus permisos se comprueben en el servidor, pasan a ser Server Actions. Hay tres cambios.

**a) Marca el contenedor como `server-only`.** Primera línea de `src/features/routines/di/routine.container.ts`:

```ts title="src/features/routines/di/routine.container.ts (primera línea)" showLineNumbers
import 'server-only'
```

**b) Crea las acciones.** Cada una exige su permiso en la primera línea:

```ts title="src/features/routines/presentation/actions/routines.actions.ts" showLineNumbers
'use server'

import { requirePermission } from '@/src/lib/dal'
import { routineContainer } from '../../di/routine.container'
import type { CreateRoutineParams } from '../../domain/repositories/routine.repository'
import { RoutineViewModelMapper, type RoutineItemViewModel } from '../viewmodels/routine.viewmodel'

export type RoutinesResult =
  | { ok: true; routines: RoutineItemViewModel[] }
  | { ok: false; message: string }

export type CreateRoutineResult =
  | { ok: true; routine: RoutineItemViewModel }
  | { ok: false; message: string }

export async function getRoutinesAction(): Promise<RoutinesResult> {
  await requirePermission('view_routines')

  try {
    const entities = await routineContainer.getRoutines.execute()
    return { ok: true, routines: entities.map((entity) => RoutineViewModelMapper.toViewModel(entity)) }
  } catch {
    return { ok: false, message: 'Error al cargar rutinas' }
  }
}

export async function createRoutineAction(params: CreateRoutineParams): Promise<CreateRoutineResult> {
  await requirePermission('create_routines')

  try {
    const entity = await routineContainer.createRoutine.execute(params)
    return { ok: true, routine: RoutineViewModelMapper.toViewModel(entity) }
  } catch {
    return { ok: false, message: 'No se pudo crear la rutina' }
  }
}
```

`requirePermission` va **fuera** del `try/catch` a propósito: `redirect()` funciona lanzando una excepción especial, y un `catch` se la tragaría. La acción devuelve un ViewModel (un objeto plano), porque los argumentos y el resultado de una Server Action deben ser serializables.

**c) Cambia los dos thunks de `routines.slice.ts`** para que llamen a las acciones en vez del contenedor. Quita los imports de `routineContainer` y de `RoutineViewModelMapper`, e importa las acciones:

```ts title="src/features/routines/presentation/store/routines.slice.ts (thunks)" showLineNumbers
import { createRoutineAction, getRoutinesAction } from '../actions/routines.actions'

export const fetchRoutines = createAsyncThunk(
  'routines/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const result = await getRoutinesAction()
      if (!result.ok) return rejectWithValue(result.message)
      return result.routines
    } catch {
      return rejectWithValue('No se pudieron cargar las rutinas. Intenta de nuevo.')
    }
  }
)

export const createRoutineMutation = createAsyncThunk(
  'routines/create',
  async (params: CreateRoutineParams, { rejectWithValue }) => {
    try {
      const result = await createRoutineAction(params)
      if (!result.ok) return rejectWithValue(result.message)
      return result.routine
    } catch {
      return rejectWithValue('No se pudo crear la rutina. Intenta de nuevo.')
    }
  }
)
```

Dos efectos que conviene tener presentes:

- El mock de rutinas ahora vive **en el servidor**: las rutinas que crees sobreviven a recargar la página, y se pierden al reiniciar `npm run dev`.
- Es un único mock **compartido por todos los usuarios**: hoy no distingue de quién es cada rutina.

---

## 9. Mostrar u ocultar según permisos

Con el usuario y sus permisos en el estado, cualquier componente puede mostrar u ocultar elementos sin pedirle nada al backend. En `RoutinesView.tsx`, el formulario de crear rutina se dibuja solo a quien puede usarlo:

```tsx title="src/features/routines/presentation/components/RoutinesView.tsx (fragmento)" showLineNumbers
import { useAuth } from '@/src/features/auth/presentation/hooks/use-auth'

export function RoutinesView() {
  const { hasPermission } = useAuth()
  const { routines, isLoading, errorMessage, createRoutine } = useRoutines()
  const canCreate = hasPermission('create_routines')

  // ...
  {canCreate && (
    <section>
      <RoutineForm onSubmit={createRoutine} isLoading={isLoading} />
    </section>
  )}
}
```

Ana ve la lista pero no el formulario; el administrador ve ambos. Como el estado se hidrata en un efecto después del primer render, el formulario aparece un instante después del resto al recargar.

Recuerda la advertencia de la sección 2: esto es solo interfaz. Quien no tiene `create_routines` tampoco puede crear la rutina enviando el POST a mano, y eso lo garantiza la sección 8, no esta.

---

## 10. Probarlo

Con `npm run dev`, comprueba cada capa por separado:

| Qué probar | Resultado esperado |
| :--- | :--- |
| Abrir `/routines` sin sesión | Redirige a `/login` (lo hace el proxy) |
| Con sesión, abrir `/login` o `/register` | Redirige a `/routines` |
| Entrar como Ana (`USER`) | Ve la lista, pero **no** el formulario |
| Entrar como Admin (`ADMIN`) | Ve la lista y el formulario; crea una rutina |
| Recargar como Admin | La rutina creada sigue ahí (vive en el servidor) |
| Cerrar sesión y abrir `/routines` | Redirige a `/login` |

El proxy también se puede comprobar sin navegador:

```bash
curl -i http://localhost:3001/routines
```

La respuesta es `307` con `location: /login`.

Para comprobar que **la acción protege por sí misma**, envía a mano el POST de `createRoutineAction` con la cookie de Ana (solo tiene `view_routines`): la acción lo rechaza con «No tienes permiso» y no se crea la rutina. Sin cookie, el proxy lo frena antes con un `307`.

---

## 11. Límites que debes conocer

:::warning[La firma del token no se verifica en el front]
El proxy y el DAL solo **decodifican**. Un token con forma correcta pero con la firma inventada pasa ambos, y el backend simulado del curso tampoco lo comprueba: se puede comprobar creando una rutina con un token falso que diga `create_routines`. En una arquitectura real, el backend verifica la firma en cada petición y rechaza ese token con un 401. Las guardias del front mejoran la experiencia y reducen trabajo; no reemplazan al backend.
:::

- **La autenticación no es autorización.** El proxy responde «¿hay alguien?». El permiso responde «¿puede hacer esto?». Y «¿es suyo este dato?» solo lo puede decidir el backend, comparando el dueño del recurso con el id del token.
- **Sin permiso, el error es genérico.** Ver la sección 5.
- **El mock de rutinas.** Está en la memoria del servidor y se comparte entre usuarios. Además, al crear una rutina con una descripción de menos de 10 caracteres, el datasource guarda el registro antes de que la entidad lo valide, y desde ese momento cargar la lista falla para todos hasta reiniciar el servidor. La solución es validar en `CreateRoutineUseCase` antes de guardar.
- **Los mensajes de las acciones son genéricos.** El usuario no ve la causa real de un fallo de dominio, como una descripción demasiado corta. Los errores esperados deberían llevar un mensaje específico, como dice el [documento de errores](./03-manejo-de-errores-nextjs.md).
- **El estado no se reinicia al cambiar de usuario.** Redux conserva, por ejemplo, la lista de rutinas hasta recargar. Con un backend por usuario habría que limpiarla al cerrar sesión.

---

## Resumen

| Quiero... | Uso |
| :--- | :--- |
| Redirigir a quien no tiene sesión antes de renderizar | `proxy.ts` |
| Exigir sesión en una página o un dato | `requireSession()` en el DAL |
| Exigir un permiso en una página o un dato | `requirePermission()` en el DAL |
| Proteger una Server Action | `requirePermission()` en su primera línea |
| Proteger una ruta cuya página usa hooks | Página de servidor + vista de cliente |
| Mostrar u ocultar según el permiso | `hasPermission()` de `useAuth` (solo interfaz) |
| Saber si un dato es del usuario | El backend, con el id del token |

---

## Siguiente paso

Ya tienes sesión y rutas protegidas. Falta decidir qué hacer cuando algo sale mal: un permiso que falta, credenciales incorrectas, un backend caído, una página que no existe. Eso es el [manejo de errores](./03-manejo-de-errores-nextjs.md).
