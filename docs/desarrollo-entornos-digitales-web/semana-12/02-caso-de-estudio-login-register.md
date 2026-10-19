---
sidebar_position: 2
---

# Caso de Estudio: Login, Registro y Navegación

En la lección anterior exploramos la arquitectura basada en *features* y definimos dónde debe habitar la lógica de consumo de API. Ahora pondremos en práctica esa estructura construyendo un caso de estudio completo, funcional y realista: una aplicación con pantallas de inicio de sesión (*login*), registro de nuevos usuarios (*register*) y un panel principal protegido (*dashboard*) que consulta datos autenticados desde el backend del curso.

A lo largo de este laboratorio aprenderás a conectar el cliente Next.js con un servidor NestJS real, gestionar credenciales mediante tokens JWT, controlar estados reactivos de carga y error en formularios cliente, y dominar los mecanismos de navegación declarativa y programática del App Router.

:::note[Diseño Funcional con HTML Semántico]
En este documento nos concentraremos exclusivamente en la arquitectura, la integración con la API REST y los flujos de navegación. Las interfaces se construirán utilizando **HTML semántico estándar** (etiquetas `<form>`, `<label>`, `<input>`, `<button>`, `<fieldset>`) sin clases de utilidad de Tailwind CSS. Toda la capa de estilos, diseño visual responsivo y componentes con daisyUI se incorporará en los documentos 03, 04 y 05.
:::

---

## 1. Qué vamos a construir

El objetivo de este caso de estudio es implementar un flujo de autenticación de punta a punta compuesto por tres pantallas principales:

1. **Pantalla de Registro (`/register`)**: Permite a un nuevo usuario crear una cuenta enviando su nombre de usuario, correo electrónico y contraseña. Al completarse con éxito, el sistema redirige al usuario hacia el formulario de login.
2. **Pantalla de Inicio de Sesión (`/login`)**: Solicita correo electrónico y contraseña. Al validar las credenciales contra el backend, recibe un token JWT, lo almacena en la sesión del cliente y redirige al usuario hacia el panel protegido.
3. **Panel Protegido (`/dashboard`)**: Una pantalla interna que solo pueden visualizar usuarios con una sesión activa. Esta vista consulta el listado de usuarios registrados en el backend mediante peticiones HTTP autenticadas y ofrece enlaces dinámicos para consultar el detalle de cada usuario (`/users/[id]`).

### Mapa de Navegación de la Aplicación

Para comprender cómo transita el usuario entre estas vistas y qué evento dispara cada transición, explora el siguiente diagrama interactivo:

<iframe
  src="/interactive/desarrollo-entornos-digitales-web/semana-12/mapa-navegacion/index.html"
  title="Mapa interactivo de navegación entre rutas públicas y protegidas en Next.js"
  style={{ width: '100%', height: 640, border: 0 }}
  loading="lazy"
/>

### Conexión con el Backend del Curso

Nuestra aplicación frontend en Next.js se comunicará con el backend oficial en NestJS (`interfaces-3-202602`), el cual provee los siguientes endpoints REST:

| Endpoint | Método | Autenticación | Carga útil (Payload) | Respuesta exitosa |
| :--- | :--- | :--- | :--- | :--- |
| `/auth/login` | `POST` | Pública | `LoginInputDto`: `{ email, password }` | `201 Created` con el token JWT en texto plano |
| `/users` | `POST` | Pública | `CreateUserDto`: `{ username, email, passwordHash, roleId, bio? }` | `201 Created` con el objeto del usuario registrado |
| `/users` | `GET` | Protegida (con guards) | Ninguna (Cabecera `Authorization: Bearer <token>`) | `200 OK` con el arreglo de usuarios `User[]` |
| `/users/:id` | `GET` | Protegida (con guards) | Parámetro numérico en la URL (`:id`) | `200 OK` con el objeto del usuario `User` |

:::note[Si tu backend aún no tiene guards]
En la rama del backend que utilizas en esta sesión, los *guards* de autenticación en `GET /users` y `GET /users/:id` todavía no están aplicados (se activan en la semana de seguridad). En consecuencia, la lista responde igual sin token, pero el frontend ya envía el encabezado `Authorization: Bearer <token>` mediante `apiFetch` para que la integración quede lista cuando se activen.
:::

---

## 2. Preparar el proyecto y el backend

Antes de escribir código en Next.js, es indispensable sincronizar los entornos de ejecución del frontend y del backend para evitar conflictos de puertos y bloqueos de seguridad en el navegador.

### Separación de Puertos y Habilitación de CORS

Por defecto, tanto las aplicaciones generadas con Next.js como los servidores de NestJS intentan escuchar en el puerto `3000`. Si ejecutas ambos proyectos en la misma máquina, se generará una colisión de puertos (*Address already in use*).

Para solucionar esto de manera sencilla y clara:

1. **Next.js (Frontend)**: Se ejecutará en su puerto por defecto `http://localhost:3000`.
2. **NestJS (Backend)**: Se ejecutará en el puerto `http://localhost:4000`.
3. **CORS (Cross-Origin Resource Sharing)**: Dado que el frontend y el backend corren en orígenes distintos (puerto 3000 vs. puerto 4000), el navegador bloqueará las peticiones por seguridad a menos que el backend autorice explícitamente las solicitudes provenientes de `http://localhost:3000`.

En el archivo `src/main.ts` de tu proyecto backend NestJS, define el puerto `4000` y habilita CORS antes de poner en escucha el servidor:

```typescript title="backend/src/main.ts" showLineNumbers
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para permitir peticiones desde la aplicación Next.js
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // El backend escucha en el puerto 4000
  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`Backend de NestJS ejecutándose en http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error('Error al iniciar el backend:', error);
  process.exit(1);
});
```

### Variable de Entorno en Next.js

En la raíz del proyecto Next.js, crea el archivo `.env.local` para apuntar la URL base hacia el backend:

```bash title=".env.local" showLineNumbers
NEXT_PUBLIC_API_URL=http://localhost:4000
```

:::tip[El Prefijo NEXT_PUBLIC_]
En Next.js, las variables de entorno son privadas por defecto y solo existen en el servidor de Node.js. Al anteponer el prefijo `NEXT_PUBLIC_`, le indicamos al compilador que incluya esta variable en el paquete de JavaScript enviado al navegador, permitiendo que los Client Components puedan leerla mediante `process.env.NEXT_PUBLIC_API_URL`.
:::

---

## 3. Crear la estructura

Aplicando la arquitectura por *features* estudiada en la lección 01, organizaremos nuestro proyecto separando las responsabilidades de enrutamiento (en `app/`), la funcionalidad de autenticación (en `features/auth/`) y las utilidades transversales (en `shared/`).

<StepByStep>
  <Step number="1" title="Definir los Route Groups en app/">
    Aprovechamos los grupos de rutas entre paréntesis para aplicar diseños distintos sin alterar las URLs:
    - `src/app/(auth)/`: Agrupa `/login` y `/register`. Utiliza un layout minimalista y centrado, libre de barras de navegación.
    - `src/app/(app)/`: Agrupa `/dashboard` y `/users/[id]`. Utiliza un layout que incluye el encabezado general de la aplicación y la barrera de seguridad `<AuthGuard>`.
  </Step>
  <Step number="2" title="Crear el módulo features/auth">
    Centraliza los componentes visuales de formularios (`LoginForm.tsx`, `RegisterForm.tsx`), el guardián de rutas (`AuthGuard.tsx`), el servicio de conexión (`auth.service.ts`) y las interfaces TypeScript (`types.ts`).
  </Step>
  <Step number="3" title="Configurar la capa compartida shared/">
    Define el cliente HTTP unificado (`src/shared/lib/api.ts`) y el gestor de credenciales en memoria del navegador (`src/shared/lib/session.ts`).
  </Step>
</StepByStep>

El árbol de carpetas resultante para este caso de estudio es el siguiente:

```plaintext
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx              <-- Layout centrado para autenticación
│   │   ├── login/
│   │   │   └── page.tsx            <-- Renderiza <LoginForm />
│   │   └── register/
│   │       └── page.tsx            <-- Renderiza <RegisterForm />
│   ├── (app)/
│   │   ├── layout.tsx              <-- Layout con navbar y <AuthGuard />
│   │   ├── dashboard/
│   │   │   ├── loading.tsx         <-- Estado de carga declarativo
│   │   │   └── page.tsx            <-- Lista usuarios del backend
│   │   └── users/
│   │       └── [id]/
│   │           └── page.tsx        <-- Detalle dinámico de usuario
│   ├── layout.tsx                  <-- Layout raíz (html, body)
│   ├── not-found.tsx               <-- Pantalla 404 personalizada
│   └── page.tsx                    <-- Redirige a /login o /dashboard
├── features/
│   └── auth/
│       ├── components/
│       │   ├── AuthGuard.tsx
│       │   ├── LoginForm.tsx
│       │   └── RegisterForm.tsx
│       ├── services/
│       │   └── auth.service.ts
│       └── types.ts
└── shared/
    └── lib/
        ├── api.ts                  <-- Wrapper de fetch para llamadas REST
        └── session.ts              <-- Gestión de token en localStorage
```

### Layout para Autenticación

El layout del grupo `(auth)` se encarga de posicionar los formularios de forma aislada y centrada:

```tsx title="src/app/(auth)/layout.tsx" showLineNumbers
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {children}
      </div>
    </main>
  );
}
```

Las páginas dentro de `(auth)` son delgadas y se limitan a renderizar el componente correspondiente de la *feature*:

```tsx title="src/app/(auth)/login/page.tsx" showLineNumbers
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return <LoginForm />;
}
```

```tsx title="src/app/(auth)/register/page.tsx" showLineNumbers
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default function RegisterPage() {
  return <RegisterForm />;
}
```

---

## 4. Consumir la API paso a paso

Para comunicarnos de forma consistente con el backend de NestJS, implementaremos la cadena de consumo de datos: desde el cliente HTTP compartido hasta los componentes de formulario interactivos.

### Secuencia del Proceso de Login

Antes de revisar el código, analicemos cómo fluyen los mensajes entre el formulario, la capa de servicio y el backend cuando el usuario inicia sesión:

<iframe
  src="/interactive/desarrollo-entornos-digitales-web/semana-12/secuencia-login/index.html"
  title="Secuencia interactiva del flujo de autenticación login con token JWT y redirección"
  style={{ width: '100%', height: 640, border: 0 }}
  loading="lazy"
/>

### Paso 1: El Cliente HTTP Compartido (`api.ts`)

En lugar de invocar `fetch` con configuraciones repetitivas en cada componente, construimos un envoltorio (*wrapper*) que inyecta la URL base, adjunta cabeceras JSON, añade el token de autorización cuando está disponible y extrae los mensajes de error retornados por el `ValidationPipe` de NestJS:

```typescript title="src/shared/lib/api.ts" showLineNumbers
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
      // NestJS ValidationPipe devuelve mensajes en errorBody.message (string o arreglo de strings)
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

  // Si la respuesta es JSON, la parseamos; si es texto plano (como el JWT de login), lo retornamos directo
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return (await response.text()) as unknown as T;
}
```

### Paso 2: Gestión de la Sesión en el Cliente (`session.ts`)

Para conservar el token entre recargas de página en el navegador, encapsulamos las operaciones sobre `localStorage`:

```typescript title="src/shared/lib/session.ts" showLineNumbers
const TOKEN_KEY = 'auth_token';

export const session = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  },
};
```

:::warning[Seguridad en Producción: localStorage vs. Cookies httpOnly]
En este ejercicio pedagógico guardamos el JWT en `localStorage` debido a su sencillez de lectura y escritura desde JavaScript en el navegador. Sin embargo, en aplicaciones comerciales de producción, guardar tokens en `localStorage` representa un riesgo frente a ataques de **XSS** (*Cross-Site Scripting*), ya que cualquier script malicioso inyectado podría acceder a la credencial. En entornos de producción reales se emplean **cookies con el atributo `httpOnly`**, las cuales son administradas directamente por el navegador y resultan completamente inaccesibles para el código JavaScript del cliente.
:::

### Paso 3: Tipos de Datos de la Feature (`types.ts`)

Definimos los contratos de datos que coinciden con los DTOs y entidades del backend de NestJS:

```typescript title="src/features/auth/types.ts" showLineNumbers
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  passwordHash: string; // El backend espera el campo con este nombre y lo hashea con bcrypt
  bio?: string;
  roleId: number;       // Identificador numérico del rol (por ejemplo, 1)
}

export interface UserRole {
  id: number;
  name: string;
  description?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  bio?: string;
  createdAt: string;
  role?: UserRole;
}
```

### Paso 4: El Servicio de Autenticación (`auth.service.ts`)

El servicio aísla las llamadas a los endpoints `/auth/login` y `/users`:

```typescript title="src/features/auth/services/auth.service.ts" showLineNumbers
import { apiFetch } from '@/shared/lib/api';
import { session } from '@/shared/lib/session';
import { LoginCredentials, RegisterData, User } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<string> {
    // El backend responde con el JWT como string en texto plano
    const token = await apiFetch<string>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    session.setToken(token);
    return token;
  },

  async register(data: RegisterData): Promise<User> {
    return apiFetch<User>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout(): void {
    session.removeToken();
  },
};
```

### Paso 5: Componente de Inicio de Sesión (`LoginForm.tsx`)

Los formularios interactivos son componentes cliente (`'use client'`). Administran estados locales con `useState` para capturar la entrada del usuario, reflejar el estado de espera durante la petición y proyectar mensajes de error claros si la autenticación falla:

```tsx title="src/features/auth/components/LoginForm.tsx" showLineNumbers
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await authService.login({ email, password });
      // Redirección inmediata sustituyendo el historial
      router.replace('/dashboard');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error inesperado al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <h1>Iniciar Sesión</h1>
      <p>Ingresa tus credenciales para acceder a la plataforma.</p>

      {errorMessage && (
        <div role="alert" style={{ color: 'red', marginBottom: '1rem' }}>
          <strong>Error: </strong> {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <fieldset disabled={isLoading} style={{ border: 'none', padding: 0 }}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="login-email">Correo electrónico:</label>
            <br />
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="login-password">Contraseña:</label>
            <br />
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ width: '100%', padding: '0.75rem', cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? 'Comprobando credenciales...' : 'Iniciar Sesión'}
          </button>
        </fieldset>
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        ¿Aún no tienes cuenta? <Link href="/register">Regístrate aquí</Link>
      </p>
    </section>
  );
}
```

### Paso 6: Componente de Registro (`RegisterForm.tsx`)

El formulario de registro valida la longitud mínima de contraseña exigida por el DTO del backend (`min: 8`) y comprueba que ambas claves coincidan antes de emitir la petición:

```tsx title="src/features/auth/components/RegisterForm.tsx" showLineNumbers
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth.service';

export function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validación básica en cliente
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('La contraseña debe contener al menos 8 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({
        username,
        email,
        passwordHash: password, // El backend hashea este campo con bcrypt
        roleId: 1,              // Rol de usuario general
      });

      // Registro exitoso: navega a login para que el usuario inicie sesión
      router.push('/login');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error al registrar la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <h1>Crear Cuenta</h1>
      <p>Regístrate para comenzar a utilizar la aplicación.</p>

      {errorMessage && (
        <div role="alert" style={{ color: 'red', marginBottom: '1rem' }}>
          <strong>Error: </strong> {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <fieldset disabled={isLoading} style={{ border: 'none', padding: 0 }}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="reg-username">Nombre de usuario:</label>
            <br />
            <input
              id="reg-username"
              type="text"
              required
              minLength={3}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ej. JuanPerez"
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="reg-email">Correo electrónico:</label>
            <br />
            <input
              id="reg-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="reg-password">Contraseña (mínimo 8 caracteres):</label>
            <br />
            <input
              id="reg-password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="reg-confirm">Confirmar contraseña:</label>
            <br />
            <input
              id="reg-confirm"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ width: '100%', padding: '0.75rem', cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </fieldset>
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        ¿Ya tienes cuenta? <Link href="/login">Inicia sesión aquí</Link>
      </p>
    </section>
  );
}
```

---

## 5. Consumir la API en el dashboard

Cuando diseñamos pantallas internas autenticadas surge una interrogante arquitectónica fundamental: **¿dónde debe ejecutarse el consumo de datos protegidos en Next.js?**

### El Dilema del Almacenamiento en Cliente

En el paso anterior guardamos el token JWT en `localStorage`. Sin embargo, `localStorage` es una API exclusiva del navegador web. Durante el renderizado en el servidor (*Server-Side Rendering* o SSR), el servidor de Node.js no tiene acceso físico al `localStorage` del cliente.

Si intentáramos consultar `GET /users` directamente desde un Server Component asíncrono (`async function DashboardPage()`), la cabecera `Authorization: Bearer <token>` viajaría vacía y el backend rechazaría la solicitud con un error HTTP `401 Unauthorized`.

### La Solución Didáctica: Dashboard como Client Component

Para resolver este desafío de manera transparente y predecible en nuestro curso de diseño, implementamos el panel principal como un **Client Component (`'use client'`)**. De esta forma:

1. El componente se monta en el navegador del usuario.
2. La función `useEffect` se activa en el cliente.
3. El cliente lee el token desde `localStorage` y ejecuta `apiFetch<User[]>('/users')`.
4. El estado local almacena los usuarios y actualiza la vista.

```tsx title="src/app/(app)/dashboard/page.tsx" showLineNumbers
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/shared/lib/api';
import { User } from '@/features/auth/types';

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      try {
        const data = await apiFetch<User[]>('/users');
        if (isMounted) {
          setUsers(data);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Error al cargar usuarios');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <p>Cargando listado de usuarios desde el backend...</p>;
  }

  if (errorMessage) {
    return (
      <div role="alert" style={{ color: 'red' }}>
        <p>No se pudo cargar la información:</p>
        <p>{errorMessage}</p>
      </div>
    );
  }

  return (
    <article>
      <h1>Panel de Usuarios Registrados</h1>
      <p>Total de usuarios activos en la plataforma: {users.length}</p>

      {users.length === 0 ? (
        <p>No hay usuarios registrados en la base de datos.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {users.map((user) => (
            <li
              key={user.id}
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                marginBottom: '0.75rem',
                borderRadius: '4px',
              }}
            >
              <h3>{user.username}</h3>
              <p>Correo: {user.email}</p>
              {user.bio && <p>Biografía: {user.bio}</p>}
              <p>Rol: {user.role?.name ?? 'Sin rol asignado'}</p>
              <Link href={`/users/${user.id}`}>Ver detalle completo del usuario</Link>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
```

:::tip[¿Cuándo convendría usar un Server Component?]
Un Server Component resultaría ideal si quisiéramos precargar los datos directamente en el servidor antes de entregar el HTML al cliente (mejorando el SEO y eliminando los parpadeos de carga). Para lograrlo, el token JWT no debe vivir en `localStorage`, sino en una **cookie HTTP**. De ese modo, el Server Component puede leer la credencial en el servidor usando la utilidad `cookies()` de `next/headers` y realizar el `fetch` antes de renderizar la página.
:::

---

## 6. Navegación en este caso de estudio

En una aplicación web interactiva, la navegación no consiste únicamente en saltar de un enlace a otro; involucra transiciones tras acciones asíncronas, protección de rutas y preservación inteligente del historial.

### Formas de Navegar y Cuándo Usar Cada Una

Next.js App Router proporciona un catálogo de herramientas especializadas para cada contexto:

| Mecanismo | Entorno | Cuándo usarlo en este caso de estudio | Ejemplo en el código |
| :--- | :--- | :--- | :--- |
| **`<Link>`** | Servidor y Cliente | Enlaces declarativos visibles donde el usuario hace clic deliberadamente. | Saltar entre `/login` y `/register`, menú superior, ir al detalle `/users/[id]`. |
| **`router.push()`** | Cliente (`'use client'`) | Transición programática donde **sí deseamos** que el usuario pueda retroceder en el historial. | Tras registrarse exitosamente en `/register`, navegar a `/login`. |
| **`router.replace()`** | Cliente (`'use client'`) | Transición programática donde **no deseamos** que el usuario regrese a la pantalla previa. | Tras iniciar sesión en `/login`, o al cerrar sesión en el menú. |
| **`router.back()`** | Cliente (`'use client'`) | Retroceder a la página anterior en el historial del navegador. | Botón "Volver a la lista" en la pantalla de detalle de usuario. |
| **`router.refresh()`** | Cliente (`'use client'`) | Refrescar datos en segundo plano sin reiniciar el estado local del componente. | Reconsultar usuarios tras una actualización. |
| **`redirect()`** | Servidor | Redireccionar de inmediato durante la ejecución en el servidor. | Redirigir a `/login` dentro de un Server Component o Server Action. |
| **`notFound()`** | Servidor | Activar la interfaz de error 404 cuando un recurso no existe. | Si el usuario solicitado en `/users/[id]` no existe en la base de datos. |
| **`usePathname()`** | Cliente (`'use client'`) | Leer la ruta activa actual para resaltar visualmente el enlace activo. | Iluminar la pestaña "Dashboard" en la barra de navegación. |

### El Flujo de Navegación Completo

Analicemos en profundidad las decisiones técnicas de navegación tomadas en nuestro flujo:

#### 1. ¿Por qué `router.replace` y no `router.push` tras el Login?

Cuando un usuario inicia sesión correctamente, ejecutamos:

```typescript
router.replace('/dashboard');
```

Si utilizáramos `router.push('/dashboard')`, Next.js añadiría una nueva entrada en la pila del historial del navegador. Si el usuario hiciera clic en el botón **"Atrás"** del navegador, volvería a visualizar el formulario de inicio de sesión estando ya autenticado, lo que generaría confusión y errores en la interfaz. Al utilizar `replace()`, sustituimos la URL `/login` por `/dashboard` en la entrada activa del historial.

#### 2. Cierre de Sesión (Logout)

Al cerrar sesión, limpiamos la credencial y redirigimos al login reemplazando el historial:

```typescript
const handleLogout = () => {
  authService.logout();
  router.replace('/login');
};
```

#### 3. Protección de Rutas con `AuthGuard`

Para evitar que un usuario no autenticado ingrese a pantallas privadas escribiendo la URL directamente en el navegador, implementamos un componente guardián (`AuthGuard`) que envuelve al layout del grupo `(app)`:

```tsx title="src/features/auth/components/AuthGuard.tsx" showLineNumbers
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { session } from '@/shared/lib/session';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!session.isAuthenticated()) {
      // Si no existe token en localStorage, expulsar al login de inmediato
      router.replace('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return <p style={{ padding: '2rem' }}>Verificando autorización de acceso...</p>;
  }

  return <>{children}</>;
}
```

Este guardián se integra en el layout compartido de la aplicación junto a la barra de navegación:

```tsx title="src/app/(app)/layout.tsx" showLineNumbers
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authService } from '@/features/auth/services/auth.service';
import { AuthGuard } from '@/features/auth/components/AuthGuard';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    authService.logout();
    router.replace('/login');
  };

  return (
    <AuthGuard>
      <div>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            borderBottom: '1px solid #eee',
          }}
        >
          <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link
              href="/dashboard"
              style={{ fontWeight: pathname === '/dashboard' ? 'bold' : 'normal' }}
            >
              Dashboard
            </Link>
          </nav>
          <button type="button" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </header>
        <main style={{ padding: '2rem' }}>{children}</main>
      </div>
    </AuthGuard>
  );
}
```

:::note[Inspección Temprana con proxy.ts en Next.js 16]
En Next.js 16, la convención de `middleware.ts` ha sido renombrada oficialmente a `proxy.ts` (`export function proxy(request: Request)`). El archivo `proxy.ts` permite interceptar solicitudes HTTP a nivel de red antes de que lleguen a los layouts. Dado que `proxy.ts` se ejecuta en el servidor y no puede leer `localStorage`, su uso se reserva para arquitecturas con cookies `httpOnly`, tema que abordaremos en lecciones avanzadas.
:::

### Rutas Dinámicas: `params` como Promise en Next.js 16

En el App Router, las carpetas con corchetes definen segmentos de ruta dinámicos (como `/users/[id]`).

A partir de **Next.js 15 y Next.js 16**, la propiedad `params` que recibe la página ya no es un objeto síncrono, sino una **`Promise`**. Para leer el identificador en una página de servidor debemos resolverla con `await`:

```tsx title="src/app/(app)/users/[id]/page.tsx" showLineNumbers
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // En Next.js 16 params es una Promise obligatoria de esperar
  const { id } = await params;
  const userId = Number(id);

  if (isNaN(userId)) {
    notFound();
  }

  return (
    <article>
      <h1>Detalle del Usuario #{id}</h1>
      <p>Cargando información técnica del identificador de usuario: {id}</p>
      <Link href="/dashboard">Volver al panel general</Link>
    </article>
  );
}
```

### Estados Declarativos de UI: `loading.tsx` y `not-found.tsx`

Next.js permite gestionar transiciones de interfaz mediante archivos especiales colocados junto a `page.tsx`:

- **`src/app/(app)/dashboard/loading.tsx`**: Provee una interfaz de carga instantánea envuelta en un límite de `Suspense` mientras la ruta completa sus operaciones.
- **`src/app/not-found.tsx`**: Despliega una vista de error 404 personalizada cuando una ruta no existe o se invoca la función `notFound()`.

---

## 7. Probar todo

Una vez construidos todos los módulos, es momento de comprobar el comportamiento del sistema mediante la siguiente lista de verificación de pruebas manuales:

| Escenario de Prueba | Acción a Realizar | Resultado Esperado |
| :--- | :--- | :--- |
| **Credenciales inválidas** | En `/login`, ingresar un correo inexistente o contraseña errónea y presionar "Iniciar Sesión". | El botón se desactiva temporalmente, no hay navegación y aparece el mensaje de error que devuelve NestJS (por ejemplo, *"Credenciales invalidas"* con contraseña errónea). |
| **Contraseñas desiguales** | En `/register`, ingresar contraseñas distintas en ambos campos. | La validación de cliente detiene el envío, muestra *"Las contraseñas no coinciden"* y no contacta al backend. |
| **Contraseña muy corta** | En `/register`, ingresar una contraseña con menos de 8 caracteres. | El cliente o el backend (`ValidationPipe`) rechaza el registro indicando la restricción de longitud mínima. |
| **Backend fuera de línea** | Detener el servidor NestJS e intentar iniciar sesión en `/login`. | La aplicación captura el error de red en el bloque `catch` y muestra un mensaje amigable sin romperse. |
| **Refresco con sesión activa** | Con la sesión iniciada en `/dashboard`, presionar `F5` en el navegador. | El token en `localStorage` persiste, `AuthGuard` confirma la autorización y la lista de usuarios vuelve a cargarse. |
| **Acceso directo sin token** | Abrir una pestaña en modo incógnito e ingresar directo a `http://localhost:3000/dashboard`. | `AuthGuard` detecta la ausencia del token y ejecuta `router.replace('/login')` inmediatamente. |
| **Historial tras cerrar sesión** | Hacer clic en "Cerrar Sesión" y luego presionar el botón "Atrás" del navegador. | No se permite ver el panel privado; el usuario permanece en el formulario de inicio de sesión. |

---

## Cuestionario de Autoevaluación

<Quiz id="dedw-s12-02-caso-de-estudio-login-register-quiz">
  <Question title="¿Por qué es necesario configurar el backend de NestJS en un puerto distinto al puerto 3000?">
    <Option>Porque Next.js solo admite conexiones hacia puertos con numeración par.</Option>
    <Option correct>Porque Next.js se ejecuta por defecto en el puerto 3000 y dos procesos no pueden escuchar simultáneamente en el mismo puerto.</Option>
    <Option>Para obligar a que el navegador active el protocolo HTTPS automáticamente.</Option>
    <Option>Porque el ValidationPipe de NestJS requiere el puerto 4000 para validar DTOs.</Option>
  </Question>

  <Question title="¿Cuál es el rol del prefijo NEXT_PUBLIC_ en la variable NEXT_PUBLIC_API_URL?">
    <Option>Permite que la variable de entorno se almacene de forma encriptada en la base de datos.</Option>
    <Option>Habilita la compilación en modo estático para producción.</Option>
    <Option correct>Indica a Next.js que la variable debe ser expuesta al código JavaScript que corre en el navegador del cliente.</Option>
    <Option>Desactiva automáticamente los bloqueos de seguridad de CORS en el servidor.</Option>
  </Question>

  <Question title="¿Por qué se utiliza router.replace('/dashboard') en lugar de router.push('/dashboard') tras un login exitoso?">
    <Option>Porque router.replace es el único método que puede enviar parámetros al servidor.</Option>
    <Option correct>Para sustituir la entrada en el historial y evitar que el usuario vuelva al formulario de login al presionar el botón Atrás.</Option>
    <Option>Porque router.push bloquea la lectura de tokens en localStorage.</Option>
    <Option>Para forzar la recarga completa del documento HTML desde el origen.</Option>
  </Question>

  <Question title="¿Cuál es la razón técnica por la que el token en localStorage no puede leerse en un Server Component durante el SSR?">
    <Option>Porque los Server Components solo pueden procesar archivos de hojas de estilo CSS.</Option>
    <Option correct>Porque localStorage es una API del navegador web que no existe en el entorno del servidor Node.js.</Option>
    <Option>Porque NestJS elimina el almacenamiento local durante el handshake inicial.</Option>
    <Option>Porque TypeScript prohíbe el uso de interfaces de almacenamiento en funciones asíncronas.</Option>
  </Question>

  <Question title="En Next.js 16, ¿cómo se accede a los identificadores en una página de ruta dinámica como /users/[id]?">
    <Option>Leyendo directamente props.params.id de forma síncrona.</Option>
    <Option>Invocando el hook useDynamicId() en el cuerpo de la página.</Option>
    <Option correct>Resolviendo la promesa mediante await params (por ejemplo, const &#123; id &#125; = await params).</Option>
    <Option>Extrayendo el valor directamente desde la variable global process.env.ID.</Option>
  </Question>

  <Question title="¿Por qué no se debe utilizar una etiqueta HTML estándar &lt;a href='/register'&gt; para navegar entre páginas internas?">
    <Option>Porque el navegador arrojará un error de CORS al hacer clic.</Option>
    <Option correct>Porque causa una recarga completa de la página, destruyendo el estado reactivo en memoria de la aplicación.</Option>
    <Option>Porque Next.js inhabilita las etiquetas de ancla en proyectos con TypeScript.</Option>
    <Option>Porque los Route Groups solo responden a eventos de teclado.</Option>
  </Question>

  <Question title="¿Qué vulnerabilidad de seguridad mitigan las cookies httpOnly en comparación con localStorage en entornos de producción?">
    <Option>Ataques de denegación de servicio distribuido (DDoS).</Option>
    <Option>Inyecciones de dependencias no autorizadas en el contenedor de NestJS.</Option>
    <Option correct>Robo de credenciales mediante ataques de Cross-Site Scripting (XSS), ya que JavaScript no puede leerlas.</Option>
    <Option>Desincronización de esquemas en la base de datos relacional.</Option>
  </Question>

  <Question title="¿Cuál es la función del componente AuthGuard implementado en el layout del grupo (app)?">
    <Option>Encriptar las contraseñas de los usuarios con el algoritmo bcrypt.</Option>
    <Option>Gestionar la conexión WebSocket para notificaciones en tiempo real.</Option>
    <Option correct>Verificar en el cliente si existe un token activo y redirigir inmediatamente a /login si el usuario no está autenticado.</Option>
    <Option>Generar firmas criptográficas JWT en el navegador.</Option>
  </Question>
</Quiz>
