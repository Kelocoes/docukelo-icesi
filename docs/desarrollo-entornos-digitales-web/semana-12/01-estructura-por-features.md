---
sidebar_position: 1
description: "Aprende a organizar un proyecto Next.js por features, mantener páginas delgadas en app y separar el consumo de API en capas."
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Organización por Features

Cuando empezamos a construir aplicaciones en Next.js, es habitual colocar todos los botones en una carpeta de componentes, todas las funciones de red en otra y todos los tipos en un archivo común. En proyectos de clase o prototipos de dos pantallas esto parece cómodo. Sin embargo, a medida que el producto digital crece con módulos reales como inicio de sesión, registro, catálogo y panel de administración, esa organización colapsa.

En esta lección aprenderemos a organizar el código por **features** (funcionalidades del producto), aprenderemos por qué la carpeta `app/` debe mantenerse delgada y descubriremos el lugar exacto donde debe vivir el consumo de APIs externas mediante capas bien delimitadas.

---

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-12/por-tipo-vs-por-feature/index.html"
  title="Comparación interactiva: estructura por tipo frente a estructura por features"
  height={640}
/>

---

## 1. El Problema del Cajón de Sastre

La estructura tradicional más extendida en tutoriales básicos organiza el código **por tipo técnico**:

```plaintext
src/
├── components/     <-- Todos los componentes de la aplicación juntos
├── hooks/          <-- Todos los hooks personalizados
├── services/       <-- Todas las llamadas a endpoints de backend
└── types/          <-- Todas las interfaces de TypeScript
```

A primera vista parece ordenada, pero tiene el mismo defecto que un armario mal organizado.

### La Analogía del Armario

Imagina que organizas tu ropa estrictamente por tipo de prenda:
- En el primer cajón guardas **todas** las camisetas (deportivas, de fiesta, térmicas y pijamas).
- En el segundo cajón guardas **todos** los pantalones (jeans, bermudas y licras).
- En la zapatera guardas **todos** los zapatos revueltos.

Cada mañana, cuando necesitas armar un conjunto completo para ir a entrenar, estás obligado a abrir los tres cajones, rebuscar entre prendas que no tienen nada que ver y saltar de un mueble a otro. Si una prenda se deteriora o decides regalarla, debes revisar cajón por cajón para no dejar ropa suelta.

En el desarrollo de interfaces ocurre exactamente lo mismo:
1. **Dispersión cognitiva**: Para modificar el formulario de inicio de sesión tienes que abrir cuatro carpetas distantes (`components/LoginForm.tsx`, `hooks/useAuth.ts`, `services/authService.ts` y `types/auth.ts`).
2. **Colisiones de equipo**: Dos diseñadores o programadores trabajando en pantallas diferentes abren constantemente las mismas carpetas globales (`components/`, `hooks/`), multiplicando los conflictos de edición.
3. **Miedo al borrado**: Si una funcionalidad se vuelve obsoleta, eliminarla exige hacer arqueología para descubrir qué archivos pertenecían a ella sin romper componentes ajenos.

---

## 2. Qué es una Feature

Una **feature** (funcionalidad) es una unidad vertical completa de valor para el usuario final. Representa una capacidad concreta de la aplicación:
- Autenticación (`auth`): inicio de sesión, registro y recuperación de contraseña.
- Usuarios (`users`): lista de perfiles, edición de bio y asignación de roles.
- Catálogo (`products` o `catalog`): listado, búsqueda y filtros de productos.

### La Regla de Oro: Colocación

> **Regla de oro de la colocación (Co-location):**
> Lo que cambia junto, debe vivir junto en la misma carpeta.

Cuando diseñamos o modificamos la pantalla de autenticación, casi nunca tocamos el catálogo de productos. Lo que sí tocamos a la vez es el formulario visual, su validación de estado, la llamada al servidor y el contrato de datos.

Al agrupar todos esos archivos en una carpeta autocontenida (`src/features/auth/`), obtenemos tres ventajas inmediatas:
- **Foco absoluto**: Al abrir la carpeta de la feature tenemos en pantalla únicamente lo relevante para esa tarea.
- **Aislamiento**: Los cambios dentro de una feature no generan efectos secundarios imprevistos en otras pantallas.
- **Portabilidad**: Si el proyecto evoluciona o se divide en microfrontends, trasladar o descartar la feature es tan simple como mover o borrar su carpeta.

---

## 3. La Carpeta app Solo Enruta

En la Semana 11 aprendimos que Next.js utiliza el sistema **App Router** (`src/app/`) basado en convenciones estrictas de nombres de archivo (`layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`).

Una tentación común entre principiantes es escribir toda la interfaz, los formularios y las peticiones `fetch` directamente dentro de `page.tsx`. Esto convierte los archivos de ruta en monstruos difíciles de leer y probar.

### Páginas Delgadas (Thin Pages)

En una estructura por features, los archivos dentro de `app/` cumplen una única función: **definir la URL pública y conectar el layout**. Son páginas delgadas (*thin pages*) cuyo código raramente supera las 20 líneas:

```tsx title="src/app/(auth)/login/page.tsx" showLineNumbers
import { LoginForm } from '@/features/auth';

export const metadata = {
  title: 'Iniciar Sesión | DocuKelo',
  description: 'Ingresa con tu correo institucional y contraseña',
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <LoginForm />
    </main>
  );
}
```

### Recordatorio de Convenciones de Rutas

Como vimos en la lección anterior sobre arquitectura de Next.js:
- **Route Groups `(auth)` y `(app)`**: Permiten agrupar las rutas bajo layouts visuales propios (por ejemplo, `(auth)` con fondo centrado sin barra de navegación para `/login` y `/register`, y `(app)` con barra de navegación y `<AuthGuard>` para vistas privadas como `/dashboard`) sin alterar la URL pública del navegador.
- **Carpetas privadas `_components`**: Si una ruta necesita un componente ultra-específico que no pertenece a ninguna feature de negocio ni se reutilizará jamás, puede colocarse en una carpeta privada con guion bajo. Sin embargo, para componentes de negocio reutilizables, la feature es siempre el hogar preferido.

---

## 4. Anatomía de una Feature

Cada feature sigue un patrón de estructura predecible. Veamos el árbol estándar para la funcionalidad de autenticación:

```plaintext
src/features/auth/
├── components/          <-- Elementos de interfaz gráfica propios de auth
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
├── hooks/               <-- Hooks con estado y ciclo de vida de React
│   └── useAuth.ts
├── services/            <-- Peticiones HTTP y comunicación con backend
│   └── auth.service.ts
├── types.ts             <-- Contratos, DTOs e interfaces de TypeScript
└── index.ts             <-- Punto de exportación pública (barril)
```

### Ejemplo Mínimo de Cada Archivo

#### 1. Tipos de Datos (`types.ts`)
Define la forma de la información que viaja entre el formulario, el cliente y el backend:

```ts title="src/features/auth/types.ts" showLineNumbers
export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthState {
  token: string | null;
  isLoading: boolean;
  errorMessage: string | null;
}
```

#### 2. Servicio HTTP (`services/auth.service.ts`)
Funciones asíncronas puras que llaman a los endpoints de la API:

```ts title="src/features/auth/services/auth.service.ts" showLineNumbers
import { apiFetch } from '@/shared/lib/api';
import { session } from '@/shared/lib/session';
import type { LoginInput } from '../types';

export const authService = {
  async login(credentials: LoginInput): Promise<string> {
    // El backend del curso responde con el token JWT como texto plano
    const token = await apiFetch<string>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    session.setToken(token);
    return token;
  },
};
```

#### 3. Hook de React (`hooks/useAuth.ts`)
Gestiona el estado reactivo (`loading`, `error`) y ofrece funciones manejadoras a la vista:

```ts title="src/features/auth/hooks/useAuth.ts" showLineNumbers
'use client';

import { useState } from 'react';
import { authService } from '../services/auth.service';
import type { LoginInput } from '../types';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginInput): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await authService.login(credentials);
      return token;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error inesperado';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
```

#### 4. Componente de UI (`components/LoginForm.tsx`)
Renderiza el formulario interactivo utilizando el hook:

```tsx title="src/features/auth/components/LoginForm.tsx" showLineNumbers
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await login({ email, password });
    if (token) {
      // El token ya fue guardado en session por el servicio; redirigir al panel principal
      router.replace('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <input
        type="email"
        placeholder="correo@icesi.edu.co"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full rounded border p-2"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full rounded border p-2"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded bg-blue-600 py-2 text-white disabled:opacity-50"
      >
        {isLoading ? 'Verificando...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}
```

#### 5. Barril Público (`index.ts`)
Funciona como la puerta de entrada de la feature. Solo exporta lo que el resto de la aplicación (como `app/`) tiene permitido consumir:

```ts title="src/features/auth/index.ts" showLineNumbers
export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';
export { useAuth } from './hooks/useAuth';
export type { LoginInput, AuthState } from './types';
```

### Convenciones de Nombres

| Elemento | Convención | Ejemplo |
| :--- | :--- | :--- |
| **Componentes React** | `PascalCase` con extensión `.tsx` | `LoginForm.tsx`, `UserCard.tsx` |
| **Hooks de React** | `camelCase` con prefijo `use` y extensión `.ts` | `useAuth.ts`, `useUserList.ts` |
| **Servicios y clientes** | `camelCase` o `kebab-case` con sufijo descriptivo | `auth.service.ts`, `api.ts` |
| **Archivos de tipos** | `types.ts` o `nombre.types.ts` | `types.ts`, `user.types.ts` |

---

## 5. Dónde Vive el Consumo de API

Uno de los errores más graves en proyectos formativos es invocar `fetch()` directamente dentro del evento `onClick` o `onSubmit` de un botón:

```tsx title="Dónde Vive el Consumo de API"
// Anti-patrón: fetch directo en el componente de UI
<button onClick={() => fetch('http://localhost:4000/auth/login', { method: 'POST', body: ... })}>
```

Esto acopla la interfaz visual a la URL del backend, duplica cabeceras, hace imposible capturar errores de forma consistente y dificulta actualizar la dirección del servidor en producción.

### La Cadena de Responsabilidades

Para resolver esto con rigor profesional, la comunicación con la API se divide en **cinco pasos bien sincronizados**:

<ThemedImage
  alt="Flujo de consumo de API por capas: Componente -> Hook -> Service -> api.ts -> Backend NestJS"
  sources={{
    light: useBaseUrl('/img/desarrollo-entornos-digitales-web/s12-flujo-consumo-api-light.svg'),
    dark: useBaseUrl('/img/desarrollo-entornos-digitales-web/s12-flujo-consumo-api-dark.svg'),
  }}
  style={{ width: '100%', maxWidth: '880px', margin: '1.5rem auto', display: 'block' }}
/>

1. **Componente (`LoginForm.tsx`)**: Gestiona la interacción con el usuario, la accesibilidad de las etiquetas y la captura del evento `onSubmit`. No conoce URLs del servidor ni cabeceras HTTP; delega la acción al hook y redirige al completarse.
2. **Hook React (`useAuth.ts`)**: Controla las banderas reactivas de estado (`isLoading`, `error`). Dispara la función asíncrona del servicio y actualiza la vista cuando los datos regresan.
3. **Service de Feature (`auth.service.ts`)**: Conoce las rutas específicas del módulo (`/auth/login`), transforma los datos según los contratos de TypeScript (`LoginInput`), y almacena el token recibido mediante `session.setToken()`.
4. **Cliente HTTP Centralizado (`src/shared/lib/api.ts`)**: Envuelve la función nativa `fetch` mediante la función `apiFetch`, lee la variable de entorno con la URL base, añade cabeceras automáticas (`Content-Type: application/json`, token de autorización desde `session.getToken()`) e intercepta respuestas fallidas.
5. **Backend (Servidor NestJS)**: Escucha en el puerto 4000, valida la información con `ValidationPipe`, verifica contraseñas encriptadas con bcrypt y devuelve el token JWT firmado o un código de error HTTP (como `401 Unauthorized`).

### Variables de Entorno (`.env.local`)

Para no escribir direcciones IP o URLs quemadas en el código, Next.js provee soporte nativo para variables de entorno mediante el archivo `.env.local` ubicado en la raíz del proyecto:

```bash title=".env.local" showLineNumbers
# URL base de la API del backend NestJS (puerto 4000)
NEXT_PUBLIC_API_URL=http://localhost:4000
```

:::tip[El Prefijo NEXT_PUBLIC_]
En Next.js, cualquier variable que deba ser leída desde el navegador (en Client Components o wrappers de `fetch`) **debe** llevar el prefijo `NEXT_PUBLIC_`. Las variables sin este prefijo son privadas y solo existen en el entorno del servidor Node.js.
:::

### Implementación del Cliente Centralizado (`api.ts`)

Este archivo vive en `src/shared/lib/api.ts` y expone la función `apiFetch`, convirtiéndose en el punto unificado del proyecto donde se utiliza `fetch`. Se apoya en `session.ts` para adjuntar el token de autorización cuando exista una sesión activa:

```ts title="src/shared/lib/api.ts" showLineNumbers
import { session } from './session';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = session.getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `Error HTTP ${response.status}`;
    try {
      const errorBody = await response.json();
      if (Array.isArray(errorBody.message)) {
        errorMessage = errorBody.message.join(', ');
      } else if (typeof errorBody.message === 'string') {
        errorMessage = errorBody.message;
      }
    } catch {
      const errorText = await response.text();
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return (await response.text()) as unknown as T;
}
```

:::note[Manejo de Sesión y Detalle de Implementación]
La gestión del token en almacenamiento del cliente se centraliza en `src/shared/lib/session.ts` con métodos como `session.getToken()`, `session.setToken()` y `session.removeToken()`. La implementación completa de `session.ts`, junto con la conexión paso a paso con formularios y navegación, se detalla en el siguiente documento: [02. Caso de Estudio: Login, Registro y Navegación](./02-caso-de-estudio-login-register.md).
:::

---

## 6. Código Compartido frente a Código de Feature

Una de las preguntas más frecuentes al diseñar interfaces es: ¿dónde guardo un botón, un modal o una función de ayuda?

Para esto existe el directorio `src/shared/`:

```plaintext
src/shared/
├── components/
│   └── ui/              <-- Primitivos visuales reutilizables (Botón, Input, Modal)
├── hooks/               <-- Hooks genéricos (useDebounce, useLocalStorage)
└── lib/                 <-- Clientes y utilidades puras (api.ts, formatters.ts)
```

### El Criterio de Promoción: La Regla de 2+

Para mantener un proyecto sano y evitar crear carpetas comunes abarrotadas:

> **Criterio de promoción a `shared`:**
> Un recurso pertenece a una feature hasta que **dos o más features independientes** lo necesiten sin relación directa.

<CardGrid>
  <Card title="Vive en la Feature (auth)">
    <ul>
      <li><code>LoginForm.tsx</code>: formulario específico de autenticación.</li>
      <li><code>useAuth.ts</code>: ciclo de vida de sesión.</li>
      <li><code>auth.service.ts</code>: rutas <code>/auth/login</code>.</li>
      <li><code>PasswordRequirements.tsx</code>: validador de 8 caracteres.</li>
    </ul>
  </Card>
  <Card title="Vive en Shared (shared)">
    <ul>
      <li><code>Button.tsx</code>: botón visual con estilos Tailwind del sistema de diseño.</li>
      <li><code>Input.tsx</code>: caja de texto con variantes de error.</li>
      <li><code>api.ts</code>: wrapper global de <code>fetch</code>.</li>
      <li><code>useDebounce.ts</code>: retraso de eventos de búsqueda.</li>
    </ul>
  </Card>
</CardGrid>

### Ejemplos de Decisiones de Ubicación

| Recurso | Destino Correcto | Motivo |
| :--- | :--- | :--- |
| `UserAvatar.tsx` usado en Header y en Perfil | `src/shared/components/ui/` | Se consume en dos módulos independientes. |
| `UserCard.tsx` que solo aparece en la lista de usuarios | `src/features/users/components/` | Su diseño y datos solo le importan a la feature de usuarios. |
| Formateador de moneda `formatCOP()` | `src/shared/lib/formatters.ts` | Utilidad matemática reutilizable en facturación y catálogo. |
| Validador `isValidPassword()` para registro | `src/features/auth/` | Regla de negocio exclusiva del flujo de credenciales. |

---

## 7. Estructura Completa Recomendada

A continuación presentamos el árbol de directorios estándar y escalable recomendado para el proyecto integrador del curso:

```plaintext
mi-proyecto/
├── .env.local                     <-- Variables de entorno locales (NEXT_PUBLIC_API_URL)
├── package.json
├── tsconfig.json                  <-- Configura alias de importación "@/..."
├── next.config.ts
├── public/                        <-- Recursos estáticos públicos (logos, favicons)
└── src/
    ├── app/                       <-- Enrutador exclusivo: solo pages y layouts delgados
    │   ├── (auth)/
    │   │   ├── layout.tsx         <-- Layout centrado para autenticación
    │   │   ├── login/
    │   │   │   └── page.tsx       <-- Renderiza <LoginForm />
    │   │   └── register/
    │   │       └── page.tsx       <-- Renderiza <RegisterForm />
    │   ├── (app)/
    │   │   ├── layout.tsx         <-- Layout con navegación y <AuthGuard />
    │   │   └── dashboard/
    │   │       └── page.tsx       <-- Renderiza vista de usuarios y métricas
    │   ├── globals.css            <-- Estilos base de Tailwind CSS
    │   └── layout.tsx             <-- Layout raíz html y body
    │
    ├── features/                  <-- Funcionalidades completas del producto
    │   ├── auth/
    │   │   ├── components/
    │   │   │   ├── LoginForm.tsx
    │   │   │   └── RegisterForm.tsx
    │   │   ├── hooks/
    │   │   │   └── useAuth.ts
    │   │   ├── services/
    │   │   │   └── auth.service.ts
    │   │   ├── types.ts
    │   │   └── index.ts
    │   │
    │   └── users/
    │       ├── components/
    │       │   ├── UserCard.tsx
    │       │   └── UserList.tsx
    │       ├── hooks/
    │       │   └── useUsers.ts
    │       ├── services/
    │       │   └── user.service.ts
    │       ├── types.ts
    │       └── index.ts
    │
    └── shared/                    <-- Núcleo transversal y reutilizable
        ├── components/
        │   └── ui/
        │       ├── Button.tsx
        │       ├── Card.tsx
        │       └── Input.tsx
        └── lib/
            ├── api.ts             <-- Cliente HTTP base con apiFetch
            ├── session.ts         <-- Gestión de token en localStorage
            └── utils.ts
```

### Errores Comunes y Cómo Evitarlos

| Error Frecuente | Por qué es peligroso | Solución Correcta |
| :--- | :--- | :--- |
| **Feature importando de otra feature** | Si `features/users` importa archivos internos de `features/auth`, se produce acoplamiento circular. | Si comparten contratos o componentes, promoverlos a `shared` o comunicarlos mediante props. |
| **Crear un `shared` gigante** | Mover todo a `shared/` por anticipación recrea exactamente el cajón de sastre original. | Aplicar la regla de 2+: dejar los archivos en su feature hasta que otra realmente los solicite. |
| **Colocar llamadas `fetch` en `page.tsx`** | Dificulta reutilizar la lógica, saturar el enrutador y mezclar presentación con datos. | Mantener las páginas delgadas; delegar la petición en el `service` y el estado en el `hook`. |
| **Olvidar el prefijo `NEXT_PUBLIC_`** | Las variables como `API_URL` serán inaccesibles en los Client Components del navegador. | Declarar siempre `NEXT_PUBLIC_API_URL` en `.env.local` para valores que deba leer el cliente. |

---

## Cuestionario de Autoevaluación

<Quiz id="dedw-s12-estructura-features-quiz">
  <Question title="¿Cuál es el problema principal de organizar un proyecto exclusivamente por tipo técnico (components/, hooks/, services/)?">
    <Option>Que TypeScript no puede compilar archivos ubicados en carpetas con nombres en inglés.</Option>
    <Option correct>Que los archivos de una misma funcionalidad quedan dispersos en múltiples carpetas, generando fatiga cognitiva y dificultad para dar mantenimiento.</Option>
    <Option>Que Next.js prohíbe el uso de carpetas con nombres plurales dentro del directorio src/.</Option>
    <Option>Que los estilos de Tailwind CSS no se aplican en componentes globales.</Option>
  </Question>

  <Question title="¿Cuál es la regla de oro de la colocación (co-location) en el diseño de software?">
    <Option>Todos los archivos del proyecto deben almacenarse en la raíz junto al package.json.</Option>
    <Option>Los componentes visuales deben crearse siempre en el mismo archivo donde se ejecuta el backend.</Option>
    <Option correct>Lo que cambia junto por motivos de producto debe vivir junto en la misma carpeta.</Option>
    <Option>Los hooks deben ubicarse obligatoriamente dentro de la carpeta public/.</Option>
  </Question>

  <Question title="En una arquitectura organizada por features, ¿cuál es el rol de los archivos page.tsx dentro de src/app/?">
    <Option>Alojar todas las funciones de conexión directa a la base de datos SQL.</Option>
    <Option correct>Actuar como páginas delgadas (thin pages) que solo definen la URL pública y renderizan los componentes exportados por las features.</Option>
    <Option>Declarar los modelos de datos de TypeScript de toda la aplicación.</Option>
    <Option>Configurar los scripts de instalación de paquetes de npm.</Option>
  </Question>

  <Question title="¿Cuál es el propósito del archivo index.ts (barril) ubicado en la raíz de una feature como src/features/auth/?">
    <Option>Ejecutar pruebas unitarias de estrés en el navegador.</Option>
    <Option>Sobrescribir la configuración del archivo tsconfig.json.</Option>
    <Option correct>Definir la interfaz pública del módulo, exponiendo únicamente los componentes y tipos que el resto de la aplicación puede consumir.</Option>
    <Option>Almacenar las contraseñas de los usuarios en texto plano para agilizar el login.</Option>
  </Question>

  <Question title="¿Por qué se considera una mala práctica llamar a fetch() directamente dentro del onClick de un botón en un componente?">
    <Option>Porque React bloquea automáticamente las funciones fetch ejecutadas en botones.</Option>
    <Option correct>Porque acopla la vista a la URL del backend, duplica lógica de cabeceras y dificulta el manejo uniforme de errores y estados de carga.</Option>
    <Option>Porque fetch solo puede invocarse dentro del archivo next.config.ts.</Option>
    <Option>Porque impide que el navegador aplique animaciones de transición en CSS.</Option>
  </Question>

  <Question title="¿Cuál es la cadena de llamadas recomendada para consumir un endpoint desde la interfaz de usuario?">
    <Option>Componente -&gt; Backend NestJS -&gt; Hook -&gt; Service -&gt; api.ts</Option>
    <Option correct>Componente -&gt; Hook React -&gt; Service de Feature -&gt; Cliente api.ts -&gt; Backend NestJS</Option>
    <Option>Backend NestJS -&gt; Componente -&gt; api.ts -&gt; Hook -&gt; Service</Option>
    <Option>Service de Feature -&gt; Componente -&gt; Hook React -&gt; api.ts</Option>
  </Question>

  <Question title="¿Para qué sirve el prefijo NEXT_PUBLIC_ en una variable declarada en el archivo .env.local?">
    <Option>Para encriptar la variable con el algoritmo AES-256 antes de guardarla.</Option>
    <Option>Para publicar la variable automáticamente en el repositorio público de GitHub.</Option>
    <Option correct>Para permitir que el valor de la variable de entorno sea accesible desde el navegador en componentes de cliente.</Option>
    <Option>Para indicar que la variable solo debe cargarse cuando la aplicación corre en producción.</Option>
  </Question>

  <Question title="De acuerdo con el criterio de promoción a src/shared/, ¿cuándo debe trasladarse un elemento a la carpeta compartida?">
    <Option>Inmediatamente al momento de crearlo, para que todo el equipo lo tenga disponible por si acaso.</Option>
    <Option correct>Cuando dos o más features independientes necesitan consumir el mismo componente o utilidad sin acoplarse entre sí.</Option>
    <Option>Únicamente cuando el archivo supera las 500 líneas de código fuente.</Option>
    <Option>Solo cuando se trate de un archivo con extensión .css pura.</Option>
  </Question>
</Quiz>
