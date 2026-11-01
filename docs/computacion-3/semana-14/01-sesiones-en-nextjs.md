---
sidebar_position: 1
description: "Qué es una sesión, cómo guardar y decodificar el token que emite el backend en una cookie httpOnly, mantener el usuario, su rol y sus permisos en Redux, y qué es 'use server' en Next.js."
---

# Sesiones en Next.js

En la [semana 12](../semana-12/03-configuracion-redux-nextjs.md) guardamos el estado con Redux y organizamos el proyecto con Clean Architecture. En el [trabajo en clase de la semana 13](../semana-13/03-trabajo-en-clase.md) construimos el login y el registro como pantallas visuales. Falta algo: **nada recuerda quién inició sesión**. Si recargas, Redux nace vacío.

Este documento resuelve esa mitad del problema: la **sesión**. La otra mitad, impedir que cualquiera entre a una ruta o ejecute una acción sin permiso, es el tema del siguiente documento: [Rutas protegidas](./02-rutas-protegidas-en-nextjs.md).

Suponemos una arquitectura realista: **un backend emite el token** (un JWT) y **lo verifica en cada petición**. El front solo hace tres cosas con él: lo guarda, lo **decodifica** para saber quién es el usuario, qué rol y qué permisos tiene, y lo reenvía. Al terminarlo sabrás:

1. **Qué es una sesión** y dónde conviene guardarla.
2. **Cómo configurarla**: guardar el token en una cookie y decodificarlo.
3. **Cómo integrarla en tu arquitectura**: en qué capa va cada archivo y cómo se relacionan.
4. **Qué es `'use server'`**, para qué sirve y cómo se usa.
5. **Cómo implementar el login, el registro y el cierre de sesión**, y cómo mantener al usuario en la interfaz al recargar.

El manejo de errores tiene su propio documento: [Manejo de errores en Next.js](./03-manejo-de-errores-nextjs.md). Todo sigue la [documentación oficial de autenticación de Next.js](https://nextjs.org/docs/app/guides/authentication), adaptada a la arquitectura del curso.

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

Hay además dos formas de organizar la sesión. En la primera, el token es un **JWT**: lleva dentro los datos (el id, el nombre, el rol, los permisos, el vencimiento) y el backend lo verifica con su clave, sin consultar una base de datos. Es la que usaremos porque el backend emite un JWT. En la segunda, la cookie solo guarda un id y los datos viven en el servidor:

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

El ciclo tiene tres momentos, y cada uno lo resuelve una pieza distinta:

| Momento | Qué pasa | Quién lo hace |
| :--- | :--- | :--- |
| **Iniciar sesión** | El backend comprueba las credenciales y entrega un token; el front lo decodifica y lo guarda en una cookie. | El backend (aquí, un mock), una Server Action (`loginAction`) y `session.ts`. |
| **Pedir una ruta protegida** | El navegador envía la cookie sola; el servidor decodifica el token, ve que no ha vencido y deja pasar. | `proxy.ts` y el DAL. Los construimos en el [siguiente documento](./02-rutas-protegidas-en-nextjs.md). |
| **Cerrar sesión** | El servidor borra la cookie. | Una Server Action (`logoutAction`) y `session.ts`. |

---

## 3. Configurar la sesión: guardar y decodificar el token

En esta arquitectura **el backend emite y verifica el token; el front no lo crea, no lo firma y no lo verifica**. Su trabajo tiene tres partes:

1. **Guardarlo** en una cookie `httpOnly`, para que sobreviva a las recargas y JavaScript no lo lea.
2. **Decodificarlo** para saber quién es el usuario, qué rol y qué permisos tiene (el id, el nombre, el rol, los permisos y el vencimiento están dentro del token) **sin hacer ninguna petición**. Esa información se guarda en el estado de la aplicación para usarla en la interfaz.
3. **Reenviarlo** al backend en cada llamada (`Authorization: Bearer ...`). El backend verifica la firma y decide.

:::note[En el curso el backend es un mock]
Mientras no haya backend, el datasource mockeado hace de backend: cuando las credenciales son correctas devuelve un JWT con el id, el nombre, el rol y los permisos, firmado con un secreto de prueba. Cuando haya un backend real, solo se cambia ese datasource por uno HTTP (sección 4); el resto del código no se entera.
:::

### Firmar, verificar y decodificar no son lo mismo

| Operación | Qué hace | Quién la hace aquí |
| :--- | :--- | :--- |
| **Firmar** | Crea el token con una clave secreta. | El backend (en el curso, el mock). |
| **Verificar** | Comprueba con la clave que nadie modificó el token. | **El backend**, en cada petición que recibe. |
| **Decodificar** | Lee el contenido del token **sin comprobar nada**. No necesita clave. | **El front**, con `jwt-decode`. |

:::warning[Lo que decodifica el front solo sirve para la interfaz]
Un JWT se puede leer sin la clave (está en base64). Si alguien modifica su contenido (por ejemplo, `permissions: ["create_routines"]`), el front lo decodifica igual y lo creería. Por eso lo que el front lee sirve para **mostrar u ocultar** cosas, nunca para **proteger datos**: el backend verifica la firma y decide. Un token falso no consigue ni un dato.
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
| `zod` | Valida los datos que llegan a las Server Actions. |
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
| `decodeToken` | Lee el contenido del token y descarta uno vencido; devuelve el contenido o `null`. No verifica la firma. | `createSession` y, en el siguiente documento, el DAL y el proxy. |
| `createSession` | Decodifica el token que entregó el backend y lo guarda en la cookie, con el vencimiento del token. Devuelve el contenido. | `loginAction`. |
| `deleteSession` | Borra la cookie. | `logoutAction`. |

```ts title="src/lib/session.ts" showLineNumbers
import 'server-only'
import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'session'

export type TokenPayload = {
  sub: string // id del usuario
  name: string
  role: string // por ejemplo 'USER' o 'ADMIN'
  permissions: string[] // por ejemplo ['view_routines', 'create_routines']
  exp: number // vencimiento, en segundos desde 1970
}

// Lee el contenido del token. NO verifica la firma: eso lo hace el backend.
export function decodeToken(token: string | undefined): TokenPayload | null {
  if (!token) return null
  try {
    const payload = jwtDecode<TokenPayload>(token)
    if (typeof payload.exp !== 'number' || payload.exp * 1000 < Date.now()) return null // ya venció
    return payload
  } catch {
    return null // no tiene forma de JWT
  }
}

export async function createSession(token: string): Promise<TokenPayload> {
  const payload = decodeToken(token)
  if (!payload) throw new Error('El backend entregó un token inválido')

  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true, // JavaScript del navegador no puede leer la cookie (protege contra XSS)
    secure: process.env.NODE_ENV === 'production', // solo viaja por HTTPS en producción; en desarrollo se permite http://localhost
    sameSite: 'lax', // no se envía en peticiones entre sitios, salvo al navegar con un enlace (protege contra CSRF)
    expires: new Date(payload.exp * 1000), // exp viene en segundos y Date espera milisegundos; la cookie vence cuando vence el token
    path: '/', // la cookie se envía en todas las rutas de la aplicación
  })
  return payload
}

export async function deleteSession(): Promise<void> {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}
```

Cómo leerlo: `decodeToken` devuelve `null` en lugar de lanzar un error, porque «no hay sesión» es un resultado normal, no una falla. Comprobar `exp` no es verificar la firma: solo evita tratar como sesión un token que ya no sirve. `createSession` guarda **el mismo token** que entregó el backend. Las opciones de `store.set` están explicadas en la pieza.

:::tip[Por qué `secure` depende del entorno]
`secure: true` exige HTTPS. La mayoría de navegadores lo permiten en `http://localhost`, pero Safari no. Por eso la cookie solo es `secure` en producción.
:::

:::note[Cuando el token vence]
La cookie vence a la vez que el token, así que el servidor deja de encontrar una sesión y se vuelve a pedir el login. Los backends reales suelen entregar además un *refresh token* para renovar la sesión sin pedir la contraseña; no lo cubrimos aquí.
:::

---

## 4. Integrarla en tu arquitectura

La regla de dependencia de la semana 12 no cambia: **el dominio no sabe de cookies ni de JWT**. Una cookie es un detalle de HTTP y un JWT es un detalle del backend. El dominio solo responde una pregunta: «¿estas credenciales me dan un token?». Todo lo demás (la cookie, el formulario, el estado) vive afuera.

Esta pieza muestra el proyecto de las semanas 12 y 13 y dónde se ubica cada archivo nuevo de la sesión. Pasa el mouse o toca cada línea para ver su función.

<InteractiveFrame
  src="/interactive/computacion-3/semana-14/estructura-auth/index.html#fase=2"
  title="Estructura de carpetas del proyecto con la feature auth y la sesión"
  height={1200}
/>

La feature `auth` tiene la misma forma que `routines`. Cada archivo cumple un rol y se apoya en el anterior:

| Capa | Archivo | Qué hace | La usa |
| :--- | :--- | :--- | :--- |
| Dominio | `AuthTokens`, `User`, `AuthRepository`, `LoginUseCase`, `RegisterUseCase` | Define qué entrega un login (un token), responde si unas credenciales lo consiguen y aplica las reglas del registro. | La Server Action. |
| Infraestructura | `AuthMockDatasource` (hoy), `AuthApiDatasource` (backend real), DTOs, mappers y `AuthRepositoryImpl` | Piden el token al backend y cumplen el contrato del dominio. | El contenedor. |
| DI | `auth.container.ts` | Arma los casos de uso con sus dependencias. | La Server Action. |
| Presentación | `loginAction`, `registerAction` y `logoutAction` (Server Actions) | Validan, piden el token, lo guardan con `createSession` y devuelven el usuario con su rol y sus permisos. Corren en el servidor. | El thunk. |
| Presentación | `auth.slice.ts` (thunks) y `AuthViewModelMapper` | Llaman a las acciones y guardan en Redux el usuario ya preparado para pintar (con las iniciales del avatar) y el estado del login. | El hook. |
| Presentación | `useAuth()` | Hook fachada: lo único que conoce la interfaz (`user`, `login`, `register`, `logout`, `hasRole`, `hasPermission`...). | `LoginForm`, `RegisterForm`, el `Header` y cualquier componente. |
| Presentación | `LoginForm`, `RegisterForm` | La interfaz de la semana 13. | Las páginas `/login` y `/register`. |
| Presentación | `AuthHydrator` | Llena el store con la sesión al cargar o recargar la página. | El layout raíz. |
| Transversal | `src/lib/session.ts`, `src/lib/dal.ts` | Decodificar y guardar el token; entregar la sesión al servidor. Los usan varias features. | Las acciones y el layout. |

`session.ts` y `dal.ts` van en `src/lib/`, igual que `src/store/` con Redux: no pertenecen a una feature porque cualquier feature protegida los necesita.

Estos son los archivos de la parte de `auth` que no toca Next.js. Los dos primeros son dominio; el tercero es **el backend simulado** (que más adelante se reemplaza por el real); el cuarto arma todo.

<Tabs>
<TabItem value="contrato" label="Contrato y casos de uso" default>

El dominio define **qué entrega** un login y **qué necesita** de afuera, sin decir cómo se obtiene. El token es para él un texto opaco:

```ts title="src/features/auth/domain/entities/auth-tokens.ts" showLineNumbers
export interface AuthTokens {
  readonly accessToken: string
}
```

```ts title="src/features/auth/domain/repositories/auth.repository.ts" showLineNumbers
export interface AuthRepository {
  login(params: LoginParams): Promise<AuthTokens | null>
  register(params: RegisterParams): Promise<User>
}
```

Un caso de uso por acción del usuario. Este normaliza el correo y le pide los tokens al repositorio; devuelve `null` si las credenciales no sirven. Credenciales inválidas es un resultado **esperado**, por eso no lanza una excepción:

```ts title="src/features/auth/domain/usecases/login.usecase.ts" showLineNumbers
export class LoginUseCase {
  constructor(private readonly repository: AuthRepository) {}

  async execute(params: LoginParams): Promise<AuthTokens | null> {
    const email = params.email.trim().toLowerCase()
    if (email === '' || params.password === '') return null

    return await this.repository.login({ email, password: params.password })
  }
}
```

El registro sigue el mismo camino con `RegisterUseCase` y `User`, pero **no crea una sesión**: crea la cuenta y el formulario manda al usuario a `/login`.

</TabItem>
<TabItem value="mock" label="Backend simulado (mock)">

El mock hace lo que haría el backend: si las credenciales son correctas, **arma un JWT** con el id, el nombre, el rol y los permisos del usuario, con un vencimiento de una hora. Lo firma a mano con el módulo `crypto` de Node (un JWT es `cabecera.contenido.firma`), así que no hace falta ninguna librería de tokens. Lleva `import 'server-only'` porque contiene usuarios y la clave:

```ts title="src/features/auth/infrastructure/datasources/auth-mock-datasource.ts" showLineNumbers
import 'server-only'
import { createHmac } from 'node:crypto'

const MOCK_SECRET = 'secreto-de-prueba' // el "secreto del backend" simulado
const USER_PERMISSIONS = ['view_routines']
const ADMIN_PERMISSIONS = ['view_routines', 'create_routines']

const USERS = [
  { id: 1, full_name: 'Ana Pérez', email: 'ana@icesi.edu.co', password: '123456', role: 'USER', permissions: USER_PERMISSIONS },
  { id: 2, full_name: 'Admin Icesi', email: 'admin@icesi.edu.co', password: 'admin123', role: 'ADMIN', permissions: ADMIN_PERMISSIONS },
]

const base64url = (data: object) => Buffer.from(JSON.stringify(data)).toString('base64url')

// Arma un JWT HS256: cabecera.contenido.firma
function signMockToken(payload: object) {
  const body = `${base64url({ alg: 'HS256', typ: 'JWT' })}.${base64url(payload)}`
  const signature = createHmac('sha256', MOCK_SECRET).update(body).digest('base64url')
  return `${body}.${signature}`
}

// Simula POST /auth/login del backend
export class AuthMockDatasource {
  async login(dto: { email: string; password: string }) {
    const user = USERS.find((u) => u.email === dto.email && u.password === dto.password)
    if (!user) return null // el backend respondería 401

    const exp = Math.floor(Date.now() / 1000) + 60 * 60 // vence en 1 hora
    const accessToken = signMockToken({
      sub: String(user.id),
      name: user.full_name,
      role: user.role,
      permissions: user.permissions,
      exp,
    })
    return { access_token: accessToken }
  }
}
```

El repositorio cumple el contrato del dominio con cualquier datasource que tenga `login` (el mock hoy, el HTTP mañana), y un mapper convierte `access_token` en el `accessToken` del dominio:

```ts title="src/features/auth/infrastructure/repositories/auth.repository.impl.ts" showLineNumbers
export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly datasource: AuthDatasource) {}

  async login(params: LoginParams): Promise<AuthTokens | null> {
    const dto = await this.datasource.login(UserMapper.toLoginDto(params))
    return dto ? AuthTokensMapper.toDomain(dto) : null
  }
  // register(...) igual: datasource + mapper
}
```

:::warning[Solo para clase]
Guardar la contraseña en texto plano y firmar con un secreto escrito en el código solo sirve para el mock. Un backend real guarda un *hash* de la contraseña (por ejemplo con bcrypt) y su clave nunca está en el código. Además, este mock **no verifica** la firma de los tokens que recibe: un backend real sí.
:::

</TabItem>
<TabItem value="api" label="Backend real">

Cuando exista el backend, este datasource ocupa el lugar del mock. Hace el POST de login y devuelve el token que **el backend firmó**:

```ts title="src/features/auth/infrastructure/datasources/auth-api-datasource.ts" showLineNumbers
import 'server-only'

export class AuthApiDatasource {
  async login(dto: { email: string; password: string }) {
    const res = await fetch(`${process.env.API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })

    if (res.status === 401) return null // error esperado: credenciales inválidas
    if (!res.ok) throw new Error('El backend no respondió') // error inesperado

    return (await res.json()) as { access_token: string }
  }
}
```

Un 401 es un error **esperado** (devuelve `null`, como el mock); cualquier otra falla es **inesperada** y se lanza. El [documento de errores](./03-manejo-de-errores-nextjs.md) muestra qué pasa con cada una. La única variable de entorno que necesita el front es la dirección de la API:

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
  register: new RegisterUseCase(repository),
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

### Por qué la sesión necesita el servidor

La cookie de sesión es `httpOnly`, y una cookie así **solo la puede crear el servidor**: es justo lo que impide que JavaScript la lea. El servidor decide qué cookie crear y la envía en la respuesta con un encabezado `Set-Cookie`; el **navegador** la guarda y la reenvía sola en cada petición. Por eso el código que escribe la cookie tiene que correr en el servidor, y una Server Action es la forma más corta de tenerlo.

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
| Es un **endpoint público**: cualquiera puede enviarle un POST sin pasar por tu interfaz. | Por eso valida los datos y, en el siguiente documento, exige la sesión y el permiso **dentro de cada acción**. |

:::warning[Una acción no hereda las protecciones de la página]
El chequeo de sesión de una página no cubre las Server Actions que se definen o se usan en ella: son endpoints aparte. El [siguiente documento](./02-rutas-protegidas-en-nextjs.md) muestra cómo cada acción exige su sesión y su permiso por su cuenta.
:::

---

## 6. Implementar el login, el registro y el cierre de sesión

Con todas las piezas claras, el flujo del login es la cadena de la semana 12 (vista, hook, thunk) más una frontera con el servidor:

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

Devuelve siempre un objeto `{ ok, ... }` en lugar de lanzar errores: los errores esperados (datos inválidos, credenciales incorrectas) viajan como valor, y así llega a la pantalla un mensaje útil. El usuario que devuelve (`id`, `name`, `role` y `permissions`) sale **del contenido del token**, y es lo único que recibe el navegador: el token se queda en la cookie `httpOnly`, donde JavaScript no lo puede leer.

El registro también es una acción: el contenedor es de servidor, así que el navegador solo puede llegar a él a través de una Server Action. `registerAction` **no crea una sesión**: crea la cuenta y devuelve `{ ok: true }`; el formulario manda al usuario a `/login`.

```ts title="src/features/auth/presentation/actions/auth.actions.ts" showLineNumbers
'use server'

import { z } from 'zod'
import { authContainer } from '../../di/auth.container'
import { createSession, deleteSession } from '@/src/lib/session'

const loginSchema = z.object({
  email: z.email('Correo inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

const registerSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
})

export type AuthUser = { id: string; name: string; role: string; permissions: string[] }

export type LoginResult =
  | { ok: true; user: AuthUser }
  | { ok: false; message: string }

export type RegisterResult =
  | { ok: true }
  | { ok: false; message: string }

export async function loginAction(email: string, password: string): Promise<LoginResult> {
  const parsed = loginSchema.safeParse({ email, password })
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message }
  }

  const tokens = await authContainer.login.execute(parsed.data)
  if (!tokens) {
    return { ok: false, message: 'Credenciales inválidas' }
  }

  const payload = await createSession(tokens.accessToken)
  return {
    ok: true,
    user: { id: payload.sub, name: payload.name, role: payload.role, permissions: payload.permissions },
  }
}

export async function registerAction(input: {
  name: string
  email: string
  password: string
  confirmPassword: string
}): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, message: 'Los datos del formulario no son válidos' }
  }

  try {
    await authContainer.register.execute(parsed.data)
    return { ok: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'No se pudo crear la cuenta'
    return { ok: false, message }
  }
}

export async function logoutAction(): Promise<void> {
  await deleteSession()
}
```

Cómo leerlo, en orden: (1) `'use server'` la convierte en endpoint; (2) los esquemas definen el formato válido; (3) `loginAction` valida, y si falla devuelve el mensaje; (4) le pide el token al caso de uso (que lo pide al backend); (5) `createSession` lo decodifica y lo guarda, y la acción devuelve el usuario con su rol y sus permisos, **nunca el token ni una contraseña**. `registerAction` valida que los datos sean texto (es un endpoint público) y deja las reglas de negocio al caso de uso. `logoutAction` solo borra la cookie.

### 6.2 El slice, el ViewModel y sus thunks

**Qué hace:** guarda en Redux el usuario de la sesión (`user`) y el estado del login (`isLoading`, `errorMessage`), y define los thunks que llaman a las acciones. **Para qué sirve:** que cualquier componente pueda saber quién es el usuario, su rol y sus permisos sin volver a pedirlo, igual que `routines.slice.ts` con las rutinas. **Se relaciona con:** llama a las acciones; lo lee el hook.

El thunk es el puente entre el navegador y el servidor: traduce el `{ ok: false, message }` de la acción en un `rejectWithValue`, y atrapa los fallos inesperados (la red, el servidor) con un `try/catch`. El reducer `setUser` lo usa `AuthHydrator` (más abajo) para llenar el store al recargar.

El store no guarda el `AuthUser` crudo, sino un **ViewModel**: la misma idea de `RoutineItemViewModel` de la semana 12. Lo que la interfaz necesita ya viene calculado, como las iniciales del avatar:

```ts title="src/features/auth/presentation/viewmodels/auth.viewmodel.ts" showLineNumbers
import type { AuthUser } from '../actions/auth.actions'

export interface AuthUserViewModel {
  readonly id: string
  readonly displayName: string
  readonly role: string
  readonly permissions: string[]
  readonly initials: string
}

export class AuthViewModelMapper {
  static toViewModel(user: AuthUser): AuthUserViewModel {
    return {
      id: user.id,
      displayName: user.name,
      role: user.role,
      permissions: user.permissions,
      initials: AuthViewModelMapper.buildInitials(user.name),
    }
  }

  private static buildInitials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
  }
}
```

:::note[Por qué `permissions` no es `readonly string[]`]
Los reducers de Redux Toolkit trabajan sobre un borrador de Immer, que quita el `readonly` del estado. TypeScript no deja asignar un arreglo de solo lectura a uno mutable, así que el arreglo se declara `string[]` y solo la propiedad es `readonly`.
:::

```ts title="src/features/auth/presentation/store/auth.slice.ts" showLineNumbers
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { loginAction, logoutAction, registerAction } from '../actions/auth.actions'
import type { LoginParams } from '../../domain/repositories/auth.repository'
import type { RegisterInput } from '../../domain/usecases/register.usecase'
import { AuthUserViewModel, AuthViewModelMapper } from '../viewmodels/auth.viewmodel'

interface AuthState {
  user: AuthUserViewModel | null
  isLoading: boolean
  errorMessage: string | null
}

const initialState: AuthState = { user: null, isLoading: false, errorMessage: null }

export const loginMutation = createAsyncThunk(
  'auth/login',
  async (params: LoginParams, { rejectWithValue }) => {
    try {
      const result = await loginAction(params.email, params.password)
      if (!result.ok) return rejectWithValue(result.message) // error esperado
      return AuthViewModelMapper.toViewModel(result.user)
    } catch {
      return rejectWithValue('No se pudo iniciar sesión. Intenta de nuevo.') // error inesperado
    }
  }
)

export const registerMutation = createAsyncThunk(
  'auth/register',
  async (input: RegisterInput, { rejectWithValue }) => {
    try {
      const result = await registerAction(input)
      if (!result.ok) return rejectWithValue(result.message)
    } catch {
      return rejectWithValue('No se pudo crear la cuenta. Intenta de nuevo.')
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
    setUser: (state, action: PayloadAction<AuthUserViewModel | null>) => {
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
      .addCase(loginMutation.fulfilled, (state, action: PayloadAction<AuthUserViewModel>) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(loginMutation.rejected, (state, action) => {
        state.isLoading = false
        state.errorMessage = (action.payload as string) ?? 'No se pudo iniciar sesión'
      })

    builder
      .addCase(registerMutation.pending, (state) => {
        state.isLoading = true
        state.errorMessage = null
      })
      .addCase(registerMutation.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(registerMutation.rejected, (state, action) => {
        state.isLoading = false
        state.errorMessage = (action.payload as string) ?? 'No se pudo crear la cuenta'
      })

    builder.addCase(logoutMutation.fulfilled, (state) => {
      state.user = null
      state.errorMessage = null
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

Observa que el **registro no deja al usuario autenticado**: solo el login guarda el usuario en el estado. El flujo es registrarse y luego iniciar sesión.

### 6.3 El hook fachada

**Qué hace:** expone `user`, `isLoading`, `errorMessage`, `login()`, `register()`, `logout()`, `hasRole()` y `hasPermission()`. **Para qué sirve:** es lo único que los componentes conocen. Si mañana cambias Redux por otra cosa, o la acción por un `fetch`, los componentes no se enteran. **Se relaciona con:** despacha los thunks del slice y lo usan `LoginForm`, `RegisterForm`, el `Header` y cualquier componente que dependa del usuario.

`login()` y `register()` devuelven `true` si salieron bien: así el componente decide si navegar, sin conocer Redux. `logout()` es asíncrono porque espera a que el servidor borre la cookie.

```ts title="src/features/auth/presentation/hooks/use-auth.ts" showLineNumbers
'use client'

import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/src/store/hooks'
import { clearError, loginMutation, logoutMutation, registerMutation } from '../store/auth.slice'
import type { LoginParams } from '../../domain/repositories/auth.repository'
import type { RegisterInput } from '../../domain/usecases/register.usecase'

export function useAuth() {
  const dispatch = useAppDispatch()

  const user = useAppSelector((state) => state.auth.user)
  const isLoading = useAppSelector((state) => state.auth.isLoading)
  const errorMessage = useAppSelector((state) => state.auth.errorMessage)

  const login = async (params: LoginParams): Promise<boolean> => {
    const resultAction = await dispatch(loginMutation(params))
    return loginMutation.fulfilled.match(resultAction) // true si el inicio de sesión salió bien
  }

  const register = async (input: RegisterInput): Promise<boolean> => {
    const resultAction = await dispatch(registerMutation(input))
    return registerMutation.fulfilled.match(resultAction)
  }

  const logout = async (): Promise<void> => {
    await dispatch(logoutMutation())
  }

  const resetError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  const hasRole = (role: string): boolean => user?.role === role
  const hasPermission = (permission: string): boolean => !!user?.permissions.includes(permission)

  return { user, isAuthenticated: user !== null, isLoading, errorMessage, login, register, logout, resetError, hasRole, hasPermission }
}
```

### 6.4 Los componentes

**Qué hacen:** `LoginForm` es el formulario de la semana 13, ahora conectado al hook: al enviar llama a `login()` y, si sale bien, navega con `router.replace('/routines')`. `RegisterForm` hace lo mismo con `register()` y, si sale bien, navega a `/login`. El `Header` muestra las iniciales del usuario y cierra la sesión. **Para qué sirven:** son lo único que ve el usuario. **Se relacionan con:** solo con `useAuth`; no saben que existe Redux, una Server Action ni una cookie.

```tsx title="src/features/auth/presentation/components/LoginForm.tsx (resumido)" showLineNumbers
'use client'

import { useState, type SyntheticEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/use-auth'

export function LoginForm() {
  const router = useRouter()
  const { login, isLoading, errorMessage } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function onSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const ok = await login({ email, password })
    if (ok) router.replace('/routines') // replace: «atrás» no vuelve al login
  }

  // ...los campos y {errorMessage && <p role="alert">{errorMessage}</p>}
}
```

Cerrar la sesión es un caso especial: hay que **esperar** a que el servidor borre la cookie antes de navegar. Un `<Link>` navegaría de inmediato; por eso el `Header` usa un botón que espera el cierre y luego navega:

```tsx title="src/shared/components/Header.tsx (fragmento)" showLineNumbers
'use client'

export function Header() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout() // borra la cookie en el servidor
    router.replace('/login')
  }

  return (
    <header>
      <span>{user?.initials ?? '?'}</span>
      <button type="button" onClick={handleLogout}>Cerrar sesión</button>
    </header>
  )
}
```

:::info[La forma de la guía oficial]
La documentación de Next.js usa `<form action={...}>` con `useActionState`: el formulario llama directamente a la Server Action y el estado vive en el componente. Es equivalente y más corta; aquí usamos el thunk para respetar la arquitectura de la semana 12 (vista, hook, store, acción).
:::

### 6.5 Mantener la sesión en el estado al recargar

Tras el login, el slice ya tiene el usuario. Pero al **recargar** la página Redux nace vacío, aunque la cookie siga ahí. Hay que volver a llenarlo, y el cliente no puede decodificar el token por su cuenta: está en una cookie `httpOnly`, que JavaScript no puede leer. Entonces lo hace **el servidor**: el layout raíz lee la cookie y le pasa al cliente solo el usuario, su rol y sus permisos (no el token) a través de un pequeño componente.

Primero, la pieza que lee la sesión en el servidor. Es el **DAL** (*Data Access Layer*): el lugar único, en el servidor, que responde «¿quién hace esta petición?». Por ahora solo necesitamos `getSession()`:

```ts title="src/lib/dal.ts" showLineNumbers
import 'server-only'
import { cookies } from 'next/headers'
import { decodeToken, SESSION_COOKIE } from './session'

export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  const payload = decodeToken(token)
  if (!payload || !token) return null

  // userId, name, role y permissions salen del token: no hace falta pedirlos al backend
  return { userId: payload.sub, name: payload.name, role: payload.role, permissions: payload.permissions, accessToken: token }
}
```

**Qué hace `AuthHydrator`:** recibe el usuario por props y lo despacha al store. **Para qué sirve:** que `useAuth()` devuelva el usuario desde el primer momento, también tras recargar. **Se relaciona con:** lo renderiza el layout raíz, que obtiene el usuario con `getSession()`.

```tsx title="src/features/auth/presentation/components/AuthHydrator.tsx" showLineNumbers
'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/src/store/hooks'
import { setUser } from '../store/auth.slice'
import { AuthViewModelMapper } from '../viewmodels/auth.viewmodel'
import type { AuthUser } from '../actions/auth.actions'

export function AuthHydrator({ user }: { user: AuthUser | null }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setUser(user ? AuthViewModelMapper.toViewModel(user) : null))
  }, [dispatch, user])

  return null
}
```

```tsx title="app/layout.tsx" showLineNumbers
import { getSession } from '@/src/lib/dal'
import { StoreProvider } from '@/src/store/StoreProvider'
import { AuthHydrator } from '@/src/features/auth/presentation/components/AuthHydrator'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession() // lee la cookie; null si no hay sesión
  const user = session && {
    id: session.userId,
    name: session.name,
    role: session.role,
    permissions: session.permissions,
  }

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

Como el layout raíz lee cookies, todas las rutas pasan de estáticas a dinámicas (`ƒ` en el resultado de `npm run build`): es lo esperado cuando la aplicación depende de la sesión.

El recorrido completo, al recargar, es este:

| Paso | Dónde | Qué ocurre |
| :--- | :--- | :--- |
| 1 | Navegador | Recargas. Envía la petición con la cookie `session`. |
| 2 | Servidor, en `layout.tsx` | `getSession()` lee la cookie y extrae `{ id, name, role, permissions }`. Si no hay cookie, devuelve `null`. |
| 3 | Servidor | El layout renderiza `<AuthHydrator user={...} />` y le pasa ese usuario. **El token no se envía.** |
| 4 | Navegador | `AuthHydrator` aparece en la página y ejecuta `setUser(...)` en un `useEffect`. |
| 5 | Navegador | Redux queda con el usuario y el avatar muestra las iniciales. |

:::note[El avatar parpadea un instante al recargar]
El efecto corre **después** del primer render, así que durante un instante el avatar muestra `?`. No es un fallo: la sesión sigue ahí. Si no quieres ese parpadeo, pasa el usuario como estado inicial al crear el store en `StoreProvider`.
:::

:::note[Esto no protege nada]
El layout solo **llena la interfaz**; no decide quién puede ver qué. Un layout no se vuelve a renderizar en cada navegación entre rutas hijas, así que no vería que la sesión cambió. La protección es el tema del siguiente documento.
:::

---

## Siguiente paso

Ya tienes sesión: el usuario inicia sesión, la cookie sobrevive a las recargas y la interfaz sabe quién es. Pero todavía cualquiera puede escribir `/routines` en la barra de direcciones, y cualquiera puede enviar un POST a una Server Action. Eso se resuelve con las [rutas protegidas](./02-rutas-protegidas-en-nextjs.md): el proxy, el DAL y los permisos.
