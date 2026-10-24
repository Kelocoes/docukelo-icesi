---
sidebar_position: 5
description: "Caso práctico: migra la sesión del login de la semana 12 a un store de Zustand con persistencia y construye un sistema de notificaciones con criterios de entrega."
---

# Caso práctico: sesión y notificaciones con Zustand

Ahora aplicamos todo sobre el proyecto de la semana 12. Tienes un login que guarda el token en `localStorage` mediante `session.ts`, un `AuthGuard` y un dashboard. En esta práctica:

1. **Migramos la sesión** a un store de Zustand con `persist`, de modo que cualquier componente pueda reaccionar al login y al logout.
2. **Construimos un sistema de notificaciones** que se emite desde una pantalla y se lee en la barra de navegación, sin pasar `props`.
3. **Verificamos con Redux DevTools** qué ocurre en cada cambio.

:::note[Punto de partida]
Trabaja sobre tu proyecto de la [semana 12](../semana-12/02-caso-de-estudio-login-register.md). Debes tener funcionando `LoginForm`, `RegisterForm`, `AuthGuard`, `apiFetch` y el layout `(app)`.
:::

---

## 1. Qué vamos a cambiar

| Archivo (semana 12) | Qué pasa en la semana 13 |
| :--- | :--- |
| `shared/lib/session.ts` | Se reemplaza por `shared/store/session.store.ts` |
| `shared/lib/api.ts` | Lee el token del store con `getState()` |
| `features/auth/services/auth.service.ts` | Guarda y borra el token en el store |
| `features/auth/components/AuthGuard.tsx` | Espera a que la sesión se restaure y lee el store con un selector |
| `app/(app)/layout.tsx` | Restaura la sesión y muestra la campana de notificaciones |
| (nuevo) `features/notifications/...` | Store, creador y campana de notificaciones |

---

## 2. Paso a paso

<StepByStep>
  <Step number="1" title="Instalar Zustand">
    ```bash
    npm install zustand
    ```
  </Step>
  <Step number="2" title="Crear el store de sesión">
    Crea `src/shared/store/session.store.ts`. Guarda solo el token y una bandera para saber si la sesión ya se restauró desde `localStorage`.
  </Step>
  <Step number="3" title="Conectar el cliente HTTP y el servicio de autenticación">
    `api.ts` y `auth.service.ts` leen y escriben el token en el store.
  </Step>
  <Step number="4" title="Actualizar AuthGuard y el layout">
    El guardián espera la restauración; el layout la dispara una vez.
  </Step>
  <Step number="5" title="Crear el store de notificaciones y sus componentes">
    Reutiliza el store de la [lección 3](./03-configuracion-zustand-nextjs.md#3-crear-el-primer-store).
  </Step>
  <Step number="6" title="Emitir notificaciones desde el login">
    Avisa cuando se inicia y se cierra la sesión, y mira el resultado en Redux DevTools.
  </Step>
</StepByStep>

---

## 3. El store de sesión

```typescript title="src/shared/store/session.store.ts" showLineNumbers
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

type SessionState = {
  token: string | null;
  hasHydrated: boolean;
  setToken: (token: string) => void;
  clearSession: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useSessionStore = create<SessionState>()(
  devtools(
    persist(
      (set) => ({
        token: null,
        hasHydrated: false,

        setToken: (token) => set({ token }, undefined, 'session/setToken'),
        clearSession: () => set({ token: null }, undefined, 'session/clear'),
        setHasHydrated: (value) => set({ hasHydrated: value }, undefined, 'session/hydrated'),
      }),
      {
        name: 'auth_token',                       // misma clave que la semana 12
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ token: state.token }),
        skipHydration: true,                      // restauramos nosotros, después del primer render
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      },
    ),
    { name: 'SessionStore', enabled: process.env.NODE_ENV !== 'production' },
  ),
);
```

Qué decisiones hay aquí, y de qué lección vienen:

- **`partialize`** guarda solo `token`. `hasHydrated` es un dato de la sesión de navegación, no algo que deba persistir.
- **`skipHydration`** evita el desfase de hidratación del que hablamos en la [lección 4](./04-capacidades-de-zustand.md#3-middleware-capas-alrededor-del-store).
- **`onRehydrateStorage`** nos avisa cuando terminó de restaurar, para encender `hasHydrated`.
- **Nombres de acción** (tercer argumento de `set`) para leer el historial en Redux DevTools.

:::warning[Misma clave, distinto formato]
`persist` guarda un objeto JSON (`{"state":{"token":"..."},"version":0}`), mientras que `session.ts` guardaba el token como texto plano bajo `auth_token`. Si tu navegador conserva una sesión de la semana 12, borra esa clave (`localStorage.removeItem('auth_token')` en la consola) o inicia sesión de nuevo.
:::

---

## 4. Conectar el cliente HTTP y el servicio

`api.ts` ya no importa `session`. Lee el token con `getState()`, porque no es un componente:

```typescript title="src/shared/lib/api.ts (cambios)" showLineNumbers
import { useSessionStore } from '@/shared/store/session.store';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = useSessionStore.getState().token;
  // ... el resto queda igual que en la semana 12
}
```

El servicio de autenticación escribe en el store en lugar de `localStorage`:

```typescript title="src/features/auth/services/auth.service.ts (cambios)" showLineNumbers
import { useSessionStore } from '@/shared/store/session.store';

export const authService = {
  async login(credentials: LoginCredentials): Promise<string> {
    const token = await apiFetch<string>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    useSessionStore.getState().setToken(token);
    return token;
  },

  logout(): void {
    useSessionStore.getState().clearSession();
  },
  // register() no cambia
};
```

:::tip[Por qué getState() y no el hook]
`authService` y `apiFetch` son funciones normales, no componentes. Los hooks solo se pueden llamar dentro de componentes, mientras que `getState()` funciona en cualquier archivo.
:::

---

## 5. AuthGuard y layout

El guardián ya no consulta `localStorage`. Usa dos selectores y un `useEffect` para decidir:

```tsx title="src/features/auth/components/AuthGuard.tsx" showLineNumbers
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/shared/store/session.store';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hasHydrated = useSessionStore((s) => s.hasHydrated);
  const isAuthenticated = useSessionStore((s) => s.token !== null);

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated) {
    return <p className="p-8">Verificando autorización de acceso...</p>;
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
```

Observa lo que ganamos: si el token se borra en **cualquier** parte (un `logout`, un `401` del backend), el guardián se entera solo y redirige. En la semana 12 solo comprobaba una vez, al montarse.

El layout restaura la sesión una vez y muestra la campana:

```tsx title="src/app/(app)/layout.tsx (cambios)" showLineNumbers
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/features/auth/services/auth.service';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';
import { useSessionStore } from '@/shared/store/session.store';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Restaurar la sesión guardada, una sola vez al montar
  useEffect(() => {
    useSessionStore.persist.rehydrate();
  }, []);

  const handleLogout = () => {
    authService.logout();
    router.replace('/login');
  };

  return (
    <AuthGuard>
      <header className="navbar border-b border-base-200 px-4">
        <div className="flex-1" />
        <NotificationBell />
        <button type="button" className="btn btn-ghost" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>
      <main className="p-8">{children}</main>
    </AuthGuard>
  );
}
```

:::important[Un detalle que suele fallar]
`rehydrate()` se llama en el layout, no dentro de `AuthGuard`, para que ocurra **una sola vez por carga de página** y no cada vez que el guardián se monte. Si la página de login también necesita saber si ya hay sesión (para saltarse el formulario), aplica el mismo patrón en `app/(auth)/layout.tsx`.
:::

---

## 6. Notificaciones

Crea el store con el código de la [lección 3](./03-configuracion-zustand-nextjs.md#3-crear-el-primer-store) en `features/notifications/store/notifications.store.ts`, y los componentes `NotificationCreator` y `NotificationBell` de la sección 4 de esa lección. Con eso `NotificationBell` ya se actualiza cuando alguien emite una notificación.

### Emitir desde el login

Fuera de React se llama la acción con `getState()`. Agrega esto en `auth.service.ts`:

```typescript title="src/features/auth/services/auth.service.ts (notificaciones)" showLineNumbers
import { useNotificationsStore } from '@/features/notifications/store/notifications.store';

// dentro de login(), después de guardar el token:
useNotificationsStore.getState().addNotification('Inicio de sesión exitoso');

// dentro de logout():
useNotificationsStore.getState().addNotification('Sesión cerrada');
```

Ahora el login y el logout avisan a la barra de navegación sin que ningún componente se los pase. Esa es toda la conexión.

---

## 7. Verificar con Redux DevTools

Instala la extensión **Redux DevTools** y abre la pestaña en la página del dashboard. Comprueba:

1. Al cargar la página aparece `session/hydrated`: la sesión se restauró.
2. Al iniciar sesión ves `session/setToken` con el token en el estado.
3. Al cerrar sesión ves `session/clear`.
4. Con la pestaña **Diff**, confirma que cada acción cambió solo lo que debía.

---

## 8. Criterios de entrega

<CardGrid cols={2}>
  <Card
    title="Funcional"
    description="El login guarda la sesión en el store; recargar la página la conserva; cerrar sesión la borra y redirige a /login."
  />
  <Card
    title="Estructura"
    description="Cada store en su carpeta (shared/store o features/<x>/store), con tipos separados en datos y acciones."
  />
  <Card
    title="Rendimiento"
    description="Todos los componentes usan selectores; NotificationCreator no se re-renderiza al llegar una notificación."
  />
  <Card
    title="Evidencia"
    description="Captura de Redux DevTools con las acciones session/hydrated, session/setToken y session/clear."
  />
</CardGrid>

### Retos opcionales

- **Marcar como leídas:** agrega un menú desplegable con la lista de notificaciones y los botones `markRead` y `markAllRead`.
- **Persistir las notificaciones:** aplica `persist` con `partialize` al store de notificaciones y decide si deben sobrevivir al cierre de sesión (pista: `subscribe` y `setState` de la [lección 4](./04-capacidades-de-zustand.md#5-fuera-de-react-suscripciones-y-pruebas)).
- **Tema claro y oscuro:** crea `shared/store/ui.store.ts` con el tema y una acción `toggleTheme`.
- **Responder al 401:** si `apiFetch` recibe un `401`, llama `clearSession()` y deja que el `AuthGuard` expulse al usuario.

---

## Cuestionario de Autoevaluación

<Quiz id="dedw-s13-05-caso-practico-sesion-notificaciones-quiz">
  <Question title="¿Por qué el store de sesión se ubica en shared/store y no en features/auth?">
    <Option>Porque Zustand solo permite stores dentro de shared.</Option>
    <Option correct>Porque el cliente HTTP de shared necesita el token y shared no debe depender de una feature.</Option>
    <Option>Porque features/ no admite archivos de TypeScript.</Option>
    <Option>Porque el store de sesión debe ejecutarse en el servidor.</Option>
  </Question>
  <Question title="¿Por qué api.ts usa useSessionStore.getState() en vez de llamar el hook?">
    <Option>Porque getState() es más rápido que el hook.</Option>
    <Option correct>Porque apiFetch no es un componente y los hooks solo pueden llamarse dentro de componentes.</Option>
    <Option>Porque el hook no puede leer el token.</Option>
    <Option>Porque getState() suscribe la función a los cambios del store.</Option>
  </Question>
  <Question title="¿Para qué sirve la bandera hasHydrated en el store de sesión?">
    <Option>Para guardar el token en localStorage.</Option>
    <Option correct>Para que AuthGuard sepa que la sesión ya se restauró y no redirija al login antes de tiempo.</Option>
    <Option>Para evitar que el token se envíe al backend.</Option>
    <Option>Para reiniciar el store cuando el usuario cierra sesión.</Option>
  </Question>
  <Question title="¿Qué mejora trae el AuthGuard con selectores respecto al de la semana 12?">
    <Option>Ya no necesita useEffect.</Option>
    <Option>Funciona como Server Component.</Option>
    <Option correct>Reacciona automáticamente si el token se borra desde otra parte de la aplicación, en vez de comprobarlo solo al montarse.</Option>
    <Option>Evita que el usuario pueda cerrar sesión.</Option>
  </Question>
  <Question title="¿Qué se espera ver en Redux DevTools al cerrar la sesión?">
    <Option>Una acción session/hydrated y el token intacto.</Option>
    <Option correct>Una acción session/clear con el token en null.</Option>
    <Option>Ninguna acción, porque persist impide registrar cambios.</Option>
    <Option>Una acción addNotification con el token como payload.</Option>
  </Question>
</Quiz>
