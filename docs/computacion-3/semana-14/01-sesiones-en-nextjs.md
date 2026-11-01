---
sidebar_position: 1
description: "Qué es una sesión, cómo guardar y decodificar el token que emite el backend en una cookie httpOnly, mantener el usuario y sus roles en Redux, qué es 'use server' y cómo proteger las rutas en Next.js."
---

# Sesiones y rutas protegidas en Next.js

En la [semana 12](../semana-12/03-configuracion-redux-nextjs.md) guardamos el estado con Redux y organizamos el proyecto con Clean Architecture. En el [trabajo en clase de la semana 13](../semana-13/03-trabajo-en-clase.md) construimos el login y el registro con un datasource mockeado. Falta algo: **nada recuerda quién inició sesión**. Si recargas, Redux nace vacío, y cualquiera puede escribir `/routines` en la barra de direcciones.

Este documento cierra ese ciclo. Suponemos una arquitectura realista: **un backend emite el token** (un JWT) y **lo verifica en cada petición**. El front solo hace tres cosas con él: lo guarda, lo **decodifica** para saber quién es el usuario y qué roles tiene, y lo reenvía. Al terminarlo sabrás:

1. **Qué es una sesión** y dónde conviene guardarla.
2. **Cómo configurarla**: guardar el token en una cookie y decodificarlo.
3. **Cómo integrarla en tu arquitectura**: en qué capa va cada archivo y cómo se relacionan.
4. **Qué es `'use server'`**, para qué sirve y cómo se usa.
5. **Cómo proteger las rutas** y usar los roles en la interfaz.

El manejo de errores tiene su propio documento: [Manejo de errores en Next.js](./02-manejo-de-errores-nextjs.md). Todo sigue la [documentación oficial de autenticación de Next.js](https://nextjs.org/docs/app/guides/authentication), adaptada a la arquitectura del curso.

---

## 1. ¿Qué es una sesión y dónde se guarda?

Una **sesión** es la forma en que una aplicación recuerda quién eres entre una petición y la siguiente. HTTP no tiene memoria: cada petición llega sola, así que después del login hay que guardar algo (un token o un id) y enviarlo de vuelta en cada petición.

En el trabajo en clase de la semana 13 el login terminaba y no guardaba nada: al recargar, la página ya no sabía quién eras. La pregunta es **dónde guardar ese token**. Hay cuatro opciones: elige una en «Guardar en» y mira dónde queda, qué pasa al recargar, qué recibe el servidor y qué puede leer un script malicioso.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/donde-vive-la-sesion/index.html"
  title="Dónde guardar la sesión: memoria, localStorage, cookie común y cookie httpOnly"
  height={600}
/>

Lo que muestra la pieza, resumido:

| Lugar | Ventajas | Desventajas | Úsalo para |
| :--- | :--- | :--- | :--- |
| **Memoria** (Redux, `useState`) | Simple y reactiva. | Se pierde al recargar; el servidor no la ve. | El estado de la interfaz. |
| **`localStorage`** | Persiste; cerca de 5 MB; fácil de usar. | Solo existe en el navegador (el primer render no sabe quién eres); cualquier script de la página la lee (XSS); la agregas tú a cada petición. | Preferencias (tema, filtros). **Nunca** un token de sesión. |
| **Cookie común** (`document.cookie`) | El servidor la recibe sola en cada petición. | JavaScript también la lee; cerca de 4 KB. | Datos no sensibles que el servidor necesita. |
| **Cookie `httpOnly`** | Persiste, la recibe el servidor y JavaScript no la lee. | Cerca de 4 KB; solo el servidor la crea y la borra. | **La sesión.** |

Hay además dos formas de organizar la sesión. En la primera, el token es un **JWT**: lleva dentro los datos (el id, el nombre, los roles, el vencimiento) y el backend lo verifica con su clave, sin consultar una base de datos. Es la que usaremos porque el backend emite un JWT. En la segunda, la cookie solo guarda un id y los datos viven en el servidor:

| | Sesión con JWT (*stateless*) | Sesión en base de datos (la cookie solo guarda un id) |
| :--- | :--- | :--- |
| **Ventajas** | El backend lo verifica sin consultar a nadie; el front puede leer su contenido sin pedirlo; escala fácil. | Se revoca al instante; los datos nunca salen del servidor. |
| **Desventajas** | No se puede revocar antes de que venza; el contenido se puede leer (está firmado, no cifrado). | Una consulta por petición; hay que guardar y limpiar sesiones. |

---

## 2. El ciclo de una sesión

Antes de escribir código conviene ver el recorrido completo. Sigue a ana desde que inicia sesión hasta que la cierra. Activa «Pedir la página sin cookie» para ver qué pasa sin sesión.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/ciclo-sesion-cookie/index.html"
  title="Ciclo de una sesión con cookies: iniciar sesión, ruta protegida y cerrar sesión"
  height={640}
/>

El ciclo tiene tres momentos, y cada uno lo resuelve una pieza distinta que construiremos en este documento:

| Momento | Qué pasa | Quién lo hace |
| :--- | :--- | :--- |
| **Iniciar sesión** | El backend comprueba las credenciales y entrega un token; el front lo decodifica y lo guarda en una cookie. | El backend (aquí, un mock), una Server Action (`loginAction`) y `session.ts`. |
| **Pedir una ruta protegida** | El navegador envía la cookie sola; el servidor de Next.js decodifica el token, ve que no ha vencido y deja pasar. El backend lo verifica cuando le pides datos. | `proxy.ts` y el DAL (`requireSession`). |
| **Cerrar sesión** | El servidor borra la cookie. | Una Server Action (`logoutAction`) y `session.ts`. |

---

## 3. Configurar la sesión: guardar y decodificar el token

En esta arquitectura **el backend emite y verifica el token; el front no lo crea, no lo firma y no lo verifica**. Su trabajo tiene tres partes:

1. **Guardarlo** en una cookie `httpOnly`, para que sobreviva a las recargas y JavaScript no lo lea.
2. **Decodificarlo** para saber quién es el usuario y qué roles tiene (el id, el nombre, los roles y el vencimiento están dentro del token) **sin hacer ninguna petición**. Esa información se guarda en el estado de la aplicación para usarla en la interfaz.
3. **Reenviarlo** al backend en cada llamada (`Authorization: Bearer ...`). El backend verifica la firma y decide.

:::note[En el curso el backend es un mock]
Mientras no haya backend, el datasource mockeado de la semana 13 hace de backend: cuando las credenciales son correctas devuelve un JWT con el id, el nombre y los roles, firmado con un secreto de prueba. Cuando haya un backend real, solo se cambia ese datasource por uno HTTP (sección 4); el resto del código no se entera.
:::

### Firmar, verificar y decodificar no son lo mismo

| Operación | Qué hace | Quién la hace aquí |
| :--- | :--- | :--- |
| **Firmar** | Crea el token con una clave secreta. | El backend (en el curso, el mock). |
| **Verificar** | Comprueba con la clave que nadie modificó el token. | **El backend**, en cada petición que recibe. |
| **Decodificar** | Lee el contenido del token **sin comprobar nada**. No necesita clave. | **El front**, con `jwt-decode`. |

:::warning[Lo que decodifica el front solo sirve para la interfaz]
Un JWT se puede leer sin la clave (está en base64). Si alguien modifica su contenido (por ejemplo, `roles: ["ADMIN"]`), el front lo decodifica igual y lo creería. Por eso lo que el front lee sirve para **mostrar u ocultar** cosas, nunca para **proteger datos**: el backend verifica la firma y decide. Un token falso no consigue ni un dato.
:::

### ¿Qué librería?

Para decodificar basta una función. Usamos **`jwt-decode`**:

| Opción | Cuándo |
| :--- | :--- |
| **`jwt-decode`** | La elegida: hace una sola cosa (decodificar), no necesita clave y funciona en el navegador y en el servidor. |
| `jose` | Verifica y firma además de decodificar. Es más de lo que necesitamos, salvo que algún día quieras verificar el token en el front. |
| Decodificar a mano (`atob`) | Funciona, pero tienes que manejar el base64 y los caracteres especiales tú mismo. |

### Instalar

| Paquete | Para qué sirve |
| :--- | :--- |
| `jwt-decode` | Decodifica el token (no lo verifica ni lo firma). |
| `zod` | Valida los datos que llegan del formulario. |
| `server-only` | Hace fallar el build si un componente de cliente importa un archivo del servidor. |

```bash
npm install jwt-decode zod server-only
```

No hace falta ninguna variable de entorno: el front no usa ninguna clave. (El mock usa un secreto de prueba fijo dentro de su propio archivo. Cuando exista el backend real, solo necesitarás `API_URL`.)

### El archivo `session.ts`

Esta pieza muestra `session.ts` línea por línea y lo que produce: el token que llega, su contenido decodificado y el encabezado `Set-Cookie`. Pasa el mouse por el código o por el resultado: se ilumina lo que se corresponde.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/anatomia-cookie-sesion/index.html"
  title="Anatomía del archivo session.ts: decodificar el token del backend y guardarlo en la cookie"
  height={1100}
/>

**`session.ts` es el único archivo que sabe cómo se guarda y se lee la sesión.** Los demás lo usan; nadie más toca la cookie:

| Función | Qué hace | Quién la llama |
| :--- | :--- | :--- |
| `decodeToken` | Lee el contenido del token y descarta uno vencido; devuelve el contenido o `null`. No verifica la firma. | `createSession`, `proxy.ts` y el DAL. |
| `createSession` | Decodifica el token que entregó el backend y lo guarda en la cookie, con el vencimiento del token. Devuelve el contenido. | `loginAction`. |
| `deleteSession` | Borra la cookie. | `logoutAction`. |

```ts title="src/lib/session.ts" showLineNumbers
import 'server-only'
import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'

export type TokenPayload = {
  sub: string // id del usuario
  name: string
  roles: string[] // por ejemplo ['USER'] o ['ADMIN']
  exp: number // vencimiento, en segundos desde 1970
}

// Lee el contenido del token. NO verifica la firma: eso lo hace el backend.
export function decodeToken(token: string | undefined): TokenPayload | null {
  if (!token) return null
  try {
    const payload = jwtDecode<TokenPayload>(token)
    if (payload.exp * 1000 < Date.now()) return null // ya venció
    return payload
  } catch {
    return null // no tiene forma de JWT
  }
}

export async function createSession(token: string) {
  const payload = decodeToken(token)
  if (!payload) throw new Error('El backend entregó un token inválido')

  const store = await cookies()
  store.set('session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    expires: new Date(payload.exp * 1000), // cookie y token vencen a la vez
    path: '/',
  })
  return payload
}

export async function deleteSession() {
  const store = await cookies()
  store.delete('session')
}
```

Cómo leerlo: `decodeToken` devuelve `null` en lugar de lanzar un error, porque «no hay sesión» es un resultado normal, no una falla. Comprobar `exp` no es verificar la firma: solo evita tratar como sesión un token que ya no sirve. `createSession` guarda **el mismo token** que entregó el backend. Las opciones de `store.set` están explicadas en la pieza.

:::tip[Si el navegador no guarda la cookie en desarrollo]
`secure: true` exige HTTPS. La mayoría de navegadores lo permiten en `http://localhost`, pero Safari no. Mientras desarrollas puedes usar `secure: process.env.NODE_ENV === 'production'`.
:::

:::note[Cuando el token vence]
La cookie vence a la vez que el token, así que el proxy deja de encontrar una sesión y redirige al login. Los backends reales suelen entregar además un *refresh token* para renovar la sesión sin pedir la contraseña; no lo cubrimos aquí.
:::

---

## 4. Integrarla en tu arquitectura

La regla de dependencia de la semana 12 no cambia: **el dominio no sabe de cookies ni de JWT**. Una cookie es un detalle de HTTP y un JWT es un detalle del backend. El dominio solo responde una pregunta: «¿estas credenciales me dan un token?». Todo lo demás (la cookie, el formulario, el estado) vive afuera.

Esta pieza muestra el proyecto de las semanas 12 y 13 y dónde se ubica cada archivo nuevo. Pasa el mouse o toca cada línea para ver su función.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/estructura-auth/index.html"
  title="Estructura de carpetas del proyecto con la feature auth y la sesión"
  height={1200}
/>

La feature `auth` tiene la misma forma que `routines`. Cada archivo cumple un rol y se apoya en el anterior:

| Capa | Archivo | Qué hace | La usa |
| :--- | :--- | :--- | :--- |
| Dominio | `AuthTokens`, `AuthRepository`, `LoginUseCase` | Define qué entrega un login (un token) y responde si unas credenciales lo consiguen. | La Server Action. |
| Infraestructura | `AuthMockDatasource` (hoy), `AuthApiDatasource` (backend real), `AuthRepositoryImpl` | Piden el token al backend y cumplen el contrato del dominio. | El contenedor. |
| DI | `auth.container.ts` | Arma el caso de uso con sus dependencias. | La Server Action. |
| Presentación | `loginAction` (Server Action) | Valida, pide el token, lo guarda con `createSession` y devuelve el usuario con sus roles. Corre en el servidor. | El thunk. |
| Presentación | `auth.slice.ts` (thunks) | Llama a la acción y guarda en Redux el usuario con sus roles y el estado del login. | El hook. |
| Presentación | `useAuth()` | Hook fachada: lo único que conoce la interfaz (`user`, `login`, `hasRole`...). | `LoginForm`, `LogoutButton` y cualquier componente. |
| Presentación | `LoginForm`, `LogoutButton` | La interfaz de la semana 13. | La página `/login` y el header. |
| Presentación | `AuthHydrator` | Llena el store con la sesión al cargar o recargar la página. | El layout raíz. |
| Transversal | `src/lib/session.ts`, `src/lib/dal.ts` | Decodificar y guardar el token; entregar la sesión junto al dato. Los usan varias features. | La acción, el proxy y las páginas. |
| Raíz | `proxy.ts` | Primera barrera: redirige a quien no tiene sesión. | Next.js, antes de cada petición. |

`session.ts` y `dal.ts` van en `src/lib/`, igual que `src/store/` con Redux: no pertenecen a una feature porque cualquier feature protegida los necesita.

Estos son los archivos de la parte de `auth` que no toca Next.js. Los dos primeros son dominio; el tercero es **el backend simulado** (que más adelante se reemplaza por el real); el cuarto arma todo.

<Tabs>
<TabItem value="contrato" label="Contrato y caso de uso" default>

El dominio define **qué entrega** un login y **qué necesita** de afuera, sin decir cómo se obtiene. El token es para él un texto opaco:

```ts title="src/features/auth/domain/entities/auth-tokens.ts" showLineNumbers
export interface AuthTokens {
  accessToken: string
}
```

```ts title="src/features/auth/domain/repositories/auth.repository.ts" showLineNumbers
export interface AuthRepository {
  login(email: string, password: string): Promise<AuthTokens | null>
}
```

Un caso de uso por acción del usuario. Este normaliza el correo y le pide los tokens al repositorio; devuelve `null` si las credenciales no sirven:

```ts title="src/features/auth/domain/usecases/login.usecase.ts" showLineNumbers
export class LoginUseCase {
  constructor(private repository: AuthRepository) {}

  execute(email: string, password: string) {
    return this.repository.login(email.trim().toLowerCase(), password)
  }
}
```

</TabItem>
<TabItem value="mock" label="Backend simulado (mock)">

El mock hace lo que haría el backend: si las credenciales son correctas, **arma un JWT** con el id, el nombre y los roles del usuario, con un vencimiento de una hora. Lo firma a mano con el módulo `crypto` de Node (un JWT es `cabecera.contenido.firma`), así que no hace falta ninguna librería de tokens. Lleva `import 'server-only'` porque contiene usuarios y la clave:

```ts title="src/features/auth/infrastructure/auth.mock.datasource.ts" showLineNumbers
import 'server-only'
import { createHmac } from 'node:crypto'

const SECRET = 'secreto-de-prueba' // el "secreto del backend" simulado

const USERS = [
  { id: '7', name: 'Ana', email: 'ana@icesi.edu.co', password: '123456', roles: ['USER'] },
  { id: '1', name: 'Admin', email: 'admin@icesi.edu.co', password: 'admin123', roles: ['ADMIN'] },
]

const base64url = (data: object) => Buffer.from(JSON.stringify(data)).toString('base64url')

// Arma un JWT HS256: cabecera.contenido.firma
function signMockToken(payload: object) {
  const body = `${base64url({ alg: 'HS256', typ: 'JWT' })}.${base64url(payload)}`
  const signature = createHmac('sha256', SECRET).update(body).digest('base64url')
  return `${body}.${signature}`
}

// Simula POST /auth/login del backend
export class AuthMockDatasource {
  async login(email: string, password: string) {
    const user = USERS.find((u) => u.email === email && u.password === password)
    if (!user) return null // el backend respondería 401

    const exp = Math.floor(Date.now() / 1000) + 60 * 60 // vence en 1 hora
    const accessToken = signMockToken({ sub: user.id, name: user.name, roles: user.roles, exp })
    return { accessToken }
  }
}
```

El repositorio cumple el contrato del dominio con cualquier datasource que tenga `login` (el mock hoy, el HTTP mañana):

```ts title="src/features/auth/infrastructure/auth.repository.impl.ts" showLineNumbers
export interface AuthDatasource {
  login(email: string, password: string): Promise<AuthTokens | null>
}

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private datasource: AuthDatasource) {}

  login(email: string, password: string) {
    return this.datasource.login(email, password)
  }
}
```

:::warning[Solo para clase]
Guardar la contraseña en texto plano y firmar con un secreto escrito en el código solo sirve para el mock. Un backend real guarda un *hash* de la contraseña (por ejemplo con bcrypt) y su clave nunca está en el código.
:::

</TabItem>
<TabItem value="api" label="Backend real">

Cuando exista el backend, este datasource ocupa el lugar del mock. Hace el POST de login y devuelve el token que **el backend firmó**:

```ts title="src/features/auth/infrastructure/auth.api.datasource.ts" showLineNumbers
import 'server-only'

export class AuthApiDatasource {
  async login(email: string, password: string) {
    const res = await fetch(`${process.env.API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (res.status === 401) return null // error esperado: credenciales inválidas
    if (!res.ok) throw new Error('El backend no respondió') // error inesperado

    return (await res.json()) as { accessToken: string }
  }
}
```

Un 401 es un error **esperado** (devuelve `null`, como el mock); cualquier otra falla es **inesperada** y se lanza. El [documento de errores](./02-manejo-de-errores-nextjs.md) muestra qué pasa con cada una. La única variable de entorno que necesita el front es la dirección de la API:

```text title=".env.local"
API_URL=http://localhost:3001
```

</TabItem>
<TabItem value="di" label="Contenedor">

El Composition Root arma las piezas. El cambio del mock al backend real es **esta única línea**. Lleva `import 'server-only'` porque **nunca debe llegar al navegador**:

```ts title="src/features/auth/di/auth.container.ts" showLineNumbers
import 'server-only'

const datasource = new AuthMockDatasource() // luego: new AuthApiDatasource()
const repository = new AuthRepositoryImpl(datasource)

export const authContainer = {
  login: new LoginUseCase(repository),
}
```

</TabItem>
</Tabs>

Falta la parte que toca Next.js: la acción, el slice, el hook y el formulario. Antes hay que entender qué es `'use server'`.

---

## 5. `'use server'` y las Server Actions

Hasta ahora todo el código de la aplicación corre en el navegador (los componentes de cliente, los thunks) o en el servidor al renderizar (los Server Components). Pero a veces el navegador necesita **pedirle al servidor que ejecute algo**: pedir el token al backend, escribir una cookie `httpOnly`, guardar en una base de datos. Una **Server Action** es una función que escribes en tu proyecto, pero que corre en el servidor y se llama desde el navegador como si fuera local.

La directiva `'use server'` es la que marca esa función. Sigue una llamada del thunk a `loginAction` y mira qué hace Next.js; luego pasa a «Sin use server».

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/use-server-que-hace/index.html"
  title="Qué hace use server: la llamada cruza al servidor, y qué pasaría sin la directiva"
  height={720}
/>

### Qué es y para qué sirve

- **Qué hace:** marca las funciones como código del servidor. Next.js no las incluye en el JavaScript del navegador: en su lugar entrega un «recibo» con un id. Llamar al recibo envía un **POST** al servidor, que busca la función real por ese id y la ejecuta.
- **Para qué la usamos:** para lo que solo el servidor puede o debe hacer: **escribir una cookie `httpOnly`**, ejecutar lógica con secretos que no deben llegar al navegador (el datasource, la dirección de la API) y validar de forma confiable.
- **Qué te ahorra:** escribir el endpoint, la ruta y el `fetch`. Tú llamas a una función; Next.js hace el resto.

### Cómo se escribe

Hay dos formas. La normal en este curso es poner la directiva **al inicio de un archivo**: todas las funciones que exporta pasan a ser Server Actions.

```ts title="app/actions.ts" showLineNumbers
'use server'

export async function saludar(nombre: string) {
  return `Hola, ${nombre}`
}
```

También puede ir **dentro de una función**, pero solo en un Server Component:

```tsx title="app/page.tsx" showLineNumbers
export default function Page() {
  async function crear(formData: FormData) {
    'use server'
    // se ejecuta en el servidor
  }

  return <form action={crear}>{/* campos */}</form>
}
```

Un componente de cliente (`'use client'`) **no puede definir** Server Actions: las importa desde un archivo con `'use server'`.

### Cómo se llama

| Forma | Cómo | Cuándo |
| :--- | :--- | :--- |
| **Como acción de un formulario** | `<form action={miAccion}>`; recibe un `FormData`. Con `useActionState` el componente guarda el resultado. | Es la forma de la guía oficial: formularios sin JavaScript extra. |
| **Desde código** | `await miAccion(arg1, arg2)` dentro de un evento, un `useEffect` o **un thunk**; recibe argumentos normales. | Cuando ya tienes una arquitectura que decide cuándo llamar (nuestro caso: el thunk). |

### Reglas que debes recordar

| Regla | Por qué |
| :--- | :--- |
| Solo se exportan funciones **`async`**. | La llamada viaja por la red: siempre es asíncrona. |
| Los argumentos y el resultado deben ser **serializables** (texto, números, objetos planos). | Viajan como datos. No puedes devolver una clase con métodos ni una función. |
| Su código **no llega al navegador**. | Puedes usar secretos y datasources dentro. |
| Es un **endpoint público**: cualquiera puede enviarle un POST sin pasar por tu interfaz. | Por eso valida los datos y exige la sesión **dentro de cada acción**. |

:::warning[Una acción no hereda las protecciones de la página]
El chequeo de sesión de una página no cubre las Server Actions que se definen o se usan en ella: son endpoints aparte. Cada acción que lea o cambie datos debe exigir una sesión por su cuenta, y el backend decide los permisos. La sección 7 lo muestra.
:::

---

## 6. Implementar el login

Con todas las piezas claras, el flujo del login es la cadena de la semana 12 (vista → hook → thunk) más una frontera con el servidor:

**`LoginForm` → `useAuth()` → thunk `loginMutation` → _[POST]_ → Server Action `loginAction` → `LoginUseCase` → backend**

La vista no conoce Redux ni la acción: el hook es la fachada, igual que `useRoutines`. El thunk corre en el navegador y llama a la acción, que corre en el servidor. Esta pieza recorre `loginAction` línea por línea, junto a quién la llama, la petición y la respuesta.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/anatomia-server-action/index.html"
  title="Anatomía de la Server Action loginAction: quién la llama, validación, errores esperados y cookie"
  height={1100}
/>

Los archivos siguientes se construyen de abajo hacia arriba (cada uno usa al anterior).

### 6.1 La Server Action: la frontera con el servidor

**Qué hace:** recibe el correo y la contraseña, los valida, le pide el token al backend a través de `LoginUseCase` y, si todo sale bien, lo guarda en la cookie. **Para qué sirve:** es el único lugar donde se juntan el dominio (el token) y Next.js (la cookie). **Se relaciona con:** usa `authContainer` (dominio) y `createSession` (`session.ts`); la llama el thunk.

Devuelve siempre un objeto `{ ok, ... }` en lugar de lanzar errores: los errores esperados (datos inválidos, credenciales incorrectas) viajan como valor, y así llega a la pantalla un mensaje útil. El usuario que devuelve (`id`, `name` y `roles`) sale **del contenido del token**, y es lo único que recibe el navegador: el token se queda en la cookie `httpOnly`, donde JavaScript no lo puede leer.

```ts title="src/features/auth/presentation/actions/auth.actions.ts" showLineNumbers
'use server'

import { z } from 'zod'
import { authContainer } from '../../di/auth.container'
import { createSession, deleteSession } from '@/lib/session'

const schema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export type AuthUser = { id: string; name: string; roles: string[] }

export type LoginResult =
  | { ok: true; user: AuthUser }
  | { ok: false; message: string }

export async function loginAction(email: string, password: string): Promise<LoginResult> {
  const parsed = schema.safeParse({ email, password })
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message }
  }

  const tokens = await authContainer.login.execute(parsed.data.email, parsed.data.password)
  if (!tokens) {
    return { ok: false, message: 'Credenciales inválidas' }
  }

  const payload = await createSession(tokens.accessToken)
  return { ok: true, user: { id: payload.sub, name: payload.name, roles: payload.roles } }
}

export async function logoutAction() {
  await deleteSession()
}
```

Cómo leerlo, en orden: (1) `'use server'` la convierte en endpoint; (2) `schema` define el formato válido; (3) `loginAction` valida, y si falla devuelve el mensaje; (4) le pide el token al caso de uso (que lo pide al backend); (5) `createSession` lo decodifica y lo guarda, y la acción devuelve el usuario con sus roles, **nunca el token ni una contraseña**. `logoutAction` solo borra la cookie.

### 6.2 El slice y sus thunks

**Qué hace:** guarda en Redux el usuario decodificado con sus roles (`user`) y el estado del login (`isLoading`, `errorMessage`), y define los thunks que llaman a las acciones. **Para qué sirve:** que cualquier componente pueda saber quién es el usuario y qué roles tiene sin volver a pedirlo, igual que `routines.slice.ts` con las rutinas. **Se relaciona con:** llama a `loginAction` y `logoutAction`; lo lee el hook.

El thunk es el puente entre el navegador y el servidor: traduce el `{ ok: false, message }` de la acción en un `rejectWithValue`, y atrapa los fallos inesperados (la red, el servidor) con un `try/catch`. El reducer `setUser` lo usa `AuthHydrator` (más abajo) para llenar el store al recargar.

```ts title="src/features/auth/presentation/store/auth.slice.ts" showLineNumbers
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { loginAction, logoutAction, AuthUser } from '../actions/auth.actions'

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  errorMessage: string | null
}

const initialState: AuthState = { user: null, isLoading: false, errorMessage: null }

export const loginMutation = createAsyncThunk(
  'auth/login',
  async (params: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const result = await loginAction(params.email, params.password)
      if (!result.ok) return rejectWithValue(result.message) // error esperado
      return result.user
    } catch {
      return rejectWithValue('No se pudo iniciar sesión. Intenta de nuevo.') // error inesperado
    }
  }
)

export const logoutMutation = createAsyncThunk('auth/logout', async () => {
  await logoutAction()
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload
    },
    clearError: (state) => {
      state.errorMessage = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginMutation.pending, (state) => {
        state.isLoading = true
        state.errorMessage = null
      })
      .addCase(loginMutation.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(loginMutation.rejected, (state, action) => {
        state.isLoading = false
        state.errorMessage = (action.payload as string) ?? 'Error al iniciar sesión'
      })
      .addCase(logoutMutation.fulfilled, (state) => {
        state.user = null
      })
  },
})

export const { setUser, clearError } = authSlice.actions
export const authReducer = authSlice.reducer
```

Registra el reducer en la fábrica del store de la semana 12 para que `state.auth` exista:

```ts title="src/store/store.ts" showLineNumbers
export const makeStore = () =>
  configureStore({
    reducer: {
      routines: routinesReducer,
      auth: authReducer, // nuevo
    },
  })
```

### 6.3 El hook fachada

**Qué hace:** expone `user`, `isLoading`, `errorMessage`, `login()`, `logout()` y `hasRole()`. **Para qué sirve:** es lo único que los componentes conocen. Si mañana cambias Redux por otra cosa, o la acción por un `fetch`, los componentes no se enteran. **Se relaciona con:** despacha los thunks del slice y lo usan `LoginForm`, `LogoutButton` y cualquier componente que dependa de los roles.

`login()` devuelve `true` si el inicio de sesión salió bien: así el componente decide si navegar, sin conocer Redux. `hasRole('ADMIN')` responde si el usuario tiene ese rol.

```ts title="src/features/auth/presentation/hooks/use-auth.ts" showLineNumbers
'use client'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loginMutation, logoutMutation } from '../store/auth.slice'

export function useAuth() {
  const dispatch = useAppDispatch()
  const { user, isLoading, errorMessage } = useAppSelector((state) => state.auth)

  const login = async (email: string, password: string) => {
    const action = await dispatch(loginMutation({ email, password }))
    return loginMutation.fulfilled.match(action) // true si el inicio de sesión salió bien
  }

  const logout = async () => {
    await dispatch(logoutMutation())
  }

  const hasRole = (role: string) => !!user?.roles.includes(role)

  return { user, isLoading, errorMessage, login, logout, hasRole }
}
```

### 6.4 Los componentes

**Qué hacen:** `LoginForm` es el formulario de la semana 13, ahora conectado al hook: al enviar llama a `login()` y, si sale bien, navega con `router.replace('/routines')`. `LogoutButton` cierra la sesión y vuelve a `/login`. **Para qué sirven:** son lo único que ve el usuario. **Se relacionan con:** solo con `useAuth`; no saben que existe Redux, una Server Action ni una cookie. Los campos llevan `<label>` para que sean accesibles (y para que las pruebas los encuentren por su etiqueta).

```tsx title="src/features/auth/presentation/components/LoginForm.tsx" showLineNumbers
'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/use-auth'

export function LoginForm() {
  const router = useRouter()
  const { login, isLoading, errorMessage } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const ok = await login(email, password)
    if (ok) router.replace('/routines')
  }

  return (
    <form onSubmit={onSubmit} className="card bg-base-100 w-full max-w-md shadow-md">
      <div className="card-body gap-3">
        <label className="flex flex-col gap-1">
          <span>Correo</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input input-bordered" />
        </label>
        <label className="flex flex-col gap-1">
          <span>Contraseña</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input input-bordered" />
        </label>

        {errorMessage && <p className="text-error text-sm" role="alert">{errorMessage}</p>}
        <button className="btn btn-primary" disabled={isLoading}>Iniciar sesión</button>
      </div>
    </form>
  )
}
```

```tsx title="src/features/auth/presentation/components/LogoutButton.tsx" showLineNumbers
'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/use-auth'

export function LogoutButton() {
  const router = useRouter()
  const { logout } = useAuth()

  async function onClick() {
    await logout()
    router.replace('/login')
  }

  return <button className="btn btn-ghost" onClick={onClick}>Cerrar sesión</button>
}
```

:::info[La forma de la guía oficial]
La documentación de Next.js usa `<form action={...}>` con `useActionState`: el formulario llama directamente a la Server Action y el estado vive en el componente. Es equivalente y más corta; aquí usamos el thunk para respetar la arquitectura de la semana 12 (vista, hook, store, acción).
:::

### 6.5 Mantener la sesión en el estado al recargar

Tras el login, el slice ya tiene el usuario y sus roles. Pero al **recargar** la página Redux nace vacío, aunque la cookie siga ahí. Hay que volver a llenarlo, y el cliente no puede decodificar el token por su cuenta: está en una cookie `httpOnly`, que JavaScript no puede leer. Entonces lo hace **el servidor**: el layout raíz decodifica la cookie y le pasa al cliente solo el usuario y sus roles (no el token) a través de un pequeño componente.

**Qué hace `AuthHydrator`:** recibe el usuario por props y lo despacha al store. **Para qué sirve:** que `useAuth()` devuelva el usuario desde el primer momento, también tras recargar. **Se relaciona con:** lo renderiza el layout raíz, que obtiene el usuario con `getSession()` del DAL (sección 7).

```tsx title="src/features/auth/presentation/components/AuthHydrator.tsx" showLineNumbers
'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { setUser } from '../store/auth.slice'
import type { AuthUser } from '../actions/auth.actions'

export function AuthHydrator({ user }: { user: AuthUser | null }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setUser(user))
  }, [dispatch, user])

  return null
}
```

```tsx title="app/layout.tsx" showLineNumbers
import { getSession } from '@/lib/dal'
import { StoreProvider } from '@/store/StoreProvider'
import { AuthHydrator } from '@/features/auth/presentation/components/AuthHydrator'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession() // decodifica la cookie; null si no hay sesión
  const user = session && { id: session.userId, name: session.name, roles: session.roles }

  return (
    <html lang="es">
      <body>
        <StoreProvider>
          <AuthHydrator user={user} />
          {children}
        </StoreProvider>
      </body>
    </html>
  )
}
```

:::note[Esto no protege nada]
El layout solo **llena la interfaz**; no decide quién puede ver qué (un layout no se vuelve a renderizar en cada navegación). Como el efecto corre después del primer render, `user` es `null` un instante. Si no quieres ese parpadeo, pasa el usuario como estado inicial al crear el store en `StoreProvider`.
:::

---

## 7. Proteger las rutas

Tener sesión no sirve de nada si cualquiera puede escribir `/routines`. Proteger una ruta es decidir, **en cada petición**, si el usuario puede ver ese contenido. Una sola puerta no alcanza: recorre las tres y luego prueba seis peticiones distintas, incluido un token falso y el caso de una Server Action sin chequeo.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/capas-de-defensa/index.html"
  title="Tres capas de defensa: proxy, Data Access Layer y Server Actions"
  height={680}
/>

El front decodifica el token y por eso puede decidir rápido, sin peticiones, qué mostrar y a dónde redirigir. Pero **no verifica la firma**: el backend sigue siendo quien verifica el token en cada llamada y decide los permisos.

| Capa | Qué comprueba | Qué NO puede hacer |
| :--- | :--- | :--- |
| **`proxy.ts`** | Que haya un token decodificable y vigente, y (si quieres) qué roles trae, antes de renderizar. Rápida; redirige rutas enteras. | No verifica la firma ni sabe si el dato le pertenece al usuario. Por eso es un chequeo «optimista». |
| **El DAL** (`requireSession`) | Lo mismo, junto al dato que se va a leer, y entrega el token para llamar al backend. | No decide permisos: eso lo hace el backend al verificar el token. |
| **Cada Server Action** | Que quien la llama tenga una sesión, por su cuenta; los permisos los decide el backend. | No hereda lo que comprueba la página que la usa. |

### 7.1 El DAL: la sesión junto al dato

**Qué hace:** `getSession()` lee la cookie, decodifica el token y devuelve el id, el nombre, los roles y el propio token, o `null` si no hay sesión vigente. `requireSession()` hace lo mismo pero **redirige a `/login`** si no hay. **Para qué sirve:** `requireSession` es el chequeo que se llama justo antes de leer o cambiar datos; `getSession` sirve cuando solo quieres saber si hay sesión (el layout). **Se relaciona con:** usa `decodeToken` de `session.ts`; lo llaman las páginas, el layout y las Server Actions.

```ts title="src/lib/dal.ts" showLineNumbers
import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { decodeToken } from './session'

export async function getSession() {
  const token = (await cookies()).get('session')?.value
  const payload = decodeToken(token)
  if (!payload) return null

  // userId, name y roles salen del token: no hace falta pedirlos al backend
  return { userId: payload.sub, name: payload.name, roles: payload.roles, accessToken: token! }
}

export async function requireSession() {
  const session = await getSession()
  if (!session) redirect('/login')
  return session
}
```

Úsalo en la página protegida: obtienes el token y se lo envías al backend, que verificará la firma y entregará **solo** los datos de ese usuario.

```tsx title="app/routines/page.tsx" showLineNumbers
import { requireSession } from '@/lib/dal'

export default async function RoutinesPage() {
  const { accessToken } = await requireSession()
  // ...pedir las rutinas al backend con Authorization: Bearer ${accessToken}
}
```

### 7.2 Cada Server Action exige su sesión

**Qué hace:** esta acción de ejemplo borra una rutina. Primero exige una sesión y luego envía el token al backend, que verifica la firma y decide si esa rutina es del usuario. **Para qué sirve:** ilustra la regla de la sección 5: una acción es un endpoint público. **Se relaciona con:** usa `requireSession` del DAL y el contenedor de `routines`. (Es un ejemplo: la feature de la semana 12 no tiene «borrar».)

```ts title="src/features/routines/presentation/actions/routines.actions.ts" showLineNumbers
'use server'

import { requireSession } from '@/lib/dal'
import { routineContainer } from '../../di/routine.container'

export async function deleteRoutineAction(routineId: string) {
  // 1. ¿Hay sesión? (si no, redirige a /login)
  const { accessToken } = await requireSession()

  // 2. Autorización: la decide el backend, que verifica el token y compara el dueño
  const result = await routineContainer.deleteRoutine.execute(routineId, accessToken)
  if (!result.ok) {
    return { ok: false, message: 'No tienes permiso para borrar esta rutina' }
  }
  return { ok: true }
}
```

Hay dos preguntas distintas: la **autenticación** («¿quién eres?») y la **autorización** («¿puedes hacer esto?»). El front solo puede *suponer* la respuesta leyendo el token; el backend la **verifica**. El datasource HTTP de `routines` es el que envía el token:

```ts title="src/features/routines/infrastructure/routine.api.datasource.ts (fragmento)" showLineNumbers
const res = await fetch(`${process.env.API_URL}/routines/${id}`, {
  method: 'DELETE',
  headers: { Authorization: `Bearer ${accessToken}` },
})
if (res.status === 401) return { ok: false } // el backend no aceptó el token
if (res.status === 403) return { ok: false } // el backend dice que no es tuya
```

### 7.3 `proxy.ts`: la primera barrera

**Qué hace:** se ejecuta antes de cada petición, decodifica el token de la cookie y redirige: a `/login` si pides una ruta protegida sin sesión, a `/routines` si ya tienes sesión y entras a `/login`, y a `/routines` si pides `/admin` sin el rol `ADMIN`. **Para qué sirve:** evitar renderizar páginas que el usuario no podría ver, sin gastar una petición al backend. **Se relaciona con:** usa `decodeToken` de `session.ts`; lo ejecuta Next.js solo, sin que lo llames. **No reemplaza al DAL ni al backend.**

```ts title="proxy.ts" showLineNumbers
import { NextRequest, NextResponse } from 'next/server'
import { decodeToken } from '@/lib/session'

const protectedRoutes = ['/routines', '/admin']
const publicRoutes = ['/login', '/register']

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtected = protectedRoutes.some((route) => path.startsWith(route))
  const isPublic = publicRoutes.includes(path)

  const payload = decodeToken(req.cookies.get('session')?.value)

  if (isProtected && !payload) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
  // Solo experiencia de usuario: el backend vuelve a comprobar el rol
  if (path.startsWith('/admin') && !payload?.roles.includes('ADMIN')) {
    return NextResponse.redirect(new URL('/routines', req.nextUrl))
  }
  if (isPublic && payload) {
    return NextResponse.redirect(new URL('/routines', req.nextUrl))
  }
  return NextResponse.next()
}

export const config = {
  // No ejecutar el proxy para archivos estáticos ni para /api
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
```

Cómo leerlo: `protectedRoutes` y `publicRoutes` son las listas de rutas; `config.matcher` le dice a Next.js en qué peticiones ejecutar el proxy (todas menos los archivos estáticos). La comprobación de rol redirige a quien no debería estar en `/admin`, pero un token alterado la pasaría: lo que impide que vea datos de administrador es el backend.

:::info[proxy.ts o middleware.ts]
Next.js 16 renombró `middleware.ts` a `proxy.ts` (y la función exportada a `proxy`). En Next.js 15 o anterior el archivo se llama `middleware.ts` y exporta `middleware`.
:::

:::warning[No decidas la sesión solo en el layout]
Por el renderizado parcial, un layout **no se vuelve a renderizar** en cada navegación entre rutas hijas: no vería que la sesión cambió. El layout solo hidrata la interfaz (sección 6.5); la sesión se exige en cada página (o, mejor, junto al dato, con `requireSession`).
:::

### 7.4 Usar los roles en la interfaz

Con el usuario y sus roles en el estado, cualquier componente puede mostrar u ocultar elementos según el rol, sin pedirle nada al backend:

```tsx title="src/components/Header.tsx (fragmento)" showLineNumbers
'use client'

import Link from 'next/link'
import { useAuth } from '@/features/auth/presentation/hooks/use-auth'

export function Header() {
  const { user, hasRole } = useAuth()

  return (
    <nav className="flex gap-4">
      <Link href="/routines">Mis rutinas</Link>
      {hasRole('ADMIN') && <Link href="/admin">Administración</Link>}
      {user && <span>Hola, {user.name}</span>}
    </nav>
  )
}
```

:::warning[Ocultar no es proteger]
Ocultar el enlace de administración mejora la experiencia, pero cualquiera puede escribir `/admin` o enviar la petición a mano. Los roles del front son **solo para la interfaz**; el backend es quien comprueba que el token traiga el rol antes de entregar datos de administración.
:::

Los datos del token pueden estar desactualizados hasta que venza (si le cambiaron el rol a un usuario, el token viejo sigue diciendo el rol anterior). Si necesitas el dato **fresco**, pregúntale al backend (`GET /auth/me` con el token); cuesta una petición, así que hazlo solo donde importe.

---

## Siguiente paso

Ya tienes sesión, `'use server'`, rutas protegidas y los roles en la interfaz. Falta decidir qué hacer cuando algo sale mal: credenciales incorrectas, un backend caído, una página que no existe. Eso es el [manejo de errores](./02-manejo-de-errores-nextjs.md).
