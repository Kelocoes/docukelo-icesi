---
sidebar_position: 3
description: "Configura Zustand en Next.js paso a paso: instalación, tipado con TypeScript, ubicación de los stores por feature, uso en Client Components y el cuidado con el servidor."
---

# Configuración de Zustand en Next.js

Ya sabemos qué es un store. Ahora lo dejamos funcionando en un proyecto Next.js (App Router) con TypeScript, siguiendo la estructura por *features* de la semana 12. La instalación es corta; lo que merece atención es **dónde poner cada archivo** y **qué cuidar porque Next.js también se ejecuta en el servidor**.

---

## 1. Instalación

Desde la raíz del proyecto Next.js:

```bash
npm install zustand
```

Zustand 5 requiere React 18 o superior; con Next.js 16 y React 19 no hay nada más que configurar. No hay que registrar un `Provider`, ni un plugin, ni tocar `next.config`.

---

## 2. Dónde viven los stores

Aplicamos la misma regla que ya usamos para el resto del código: **un store pertenece a la feature que lo necesita**. Solo lo que usan varias features va a `shared/`.

```plaintext
src/
├── app/
│   └── (app)/layout.tsx
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── services/
│   │   └── types.ts
│   └── notifications/
│       ├── components/
│       │   ├── NotificationCreator.tsx
│       │   └── NotificationBell.tsx
│       └── store/
│           └── notifications.store.ts <-- lista de notificaciones (solo la usa esta feature)
└── shared/
    └── store/
        ├── session.store.ts           <-- token de sesión (lo necesitan api.ts y varias features)
        └── ui.store.ts                <-- estado de interfaz transversal (sidebar, tema)
```

Fíjate en la sesión: el cliente HTTP (`shared/lib/api.ts`) necesita el token, y `shared/` no puede depender de una feature. Por eso el store de sesión vive en `shared/store/` y no en `features/auth/`. Es la misma razón por la que en la semana 12 `session.ts` estaba en `shared/lib/`.

Convenciones que usaremos en el curso:

| Convención | Ejemplo |
| :--- | :--- |
| Archivo: `<nombre>.store.ts` | `notifications.store.ts` |
| Hook exportado: `use<Nombre>Store` | `useNotificationsStore` |
| Un store por responsabilidad | No metas sesión, notificaciones y tema en uno solo |
| Los componentes importan el **hook**, nunca el estado interno | `import { useNotificationsStore } from '../store/notifications.store'` |

:::tip[Un store por responsabilidad, no un store por app]
A diferencia de Redux, donde hay un único store, en Zustand es normal tener **varios stores pequeños**. Es más fácil de entender y cada componente se suscribe solo a lo que necesita. Si dos stores deben colaborar, uno puede leer al otro con `useOtroStore.getState()`.
:::

---

## 3. Crear el primer store

Un store bien escrito separa en el tipo **datos** y **acciones**, y nombra las acciones con verbos:

```typescript title="src/features/notifications/store/notifications.store.ts" showLineNumbers
import { create } from 'zustand';

export type NotificationItem = {
  id: number;
  title: string;
  read: boolean;
  createdAt: string;
};

type NotificationsData = {
  notifications: NotificationItem[];
};

type NotificationsActions = {
  addNotification: (title: string) => void;
  markRead: (id: number) => void;
  markAllRead: () => void;
  removeNotification: (id: number) => void;
};

export type NotificationsState = NotificationsData & NotificationsActions;

const initialState: NotificationsData = {
  notifications: [],
};

export const useNotificationsStore = create<NotificationsState>()((set) => ({
  ...initialState,

  addNotification: (title) =>
    set((state) => ({
      notifications: [
        { id: Date.now(), title, read: false, createdAt: new Date().toISOString() },
        ...state.notifications,
      ],
    })),

  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    })),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
```

Por qué conviene separar `initialState`: lo reutilizamos para **reiniciar** el store (por ejemplo al cerrar sesión o entre pruebas) sin repetir los valores.

---

## 4. Usarlo en componentes

Los hooks de Zustand solo funcionan en **Client Components**, así que el archivo lleva `'use client'` en la primera línea. Recuerda la regla de la semana 11: la directiva se coloca en el componente que usa el hook, no en el store.

```tsx title="src/features/notifications/components/NotificationCreator.tsx" showLineNumbers
'use client';

import { useState } from 'react';
import { useNotificationsStore } from '../store/notifications.store';

export function NotificationCreator() {
  const [title, setTitle] = useState('');

  // Solo la acción: este componente NO se re-renderiza cuando cambia la lista
  const addNotification = useNotificationsStore((s) => s.addNotification);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addNotification(title.trim());
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        className="input input-bordered"
        placeholder="Título de la notificación"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button className="btn btn-primary" type="submit">Emitir</button>
    </form>
  );
}
```

```tsx title="src/features/notifications/components/NotificationBell.tsx" showLineNumbers
'use client';

import { useNotificationsStore } from '../store/notifications.store';

export function NotificationBell() {
  // Selector que devuelve un número: solo cambia cuando cambia la cantidad de no leídas
  const unread = useNotificationsStore(
    (s) => s.notifications.filter((n) => !n.read).length,
  );

  return (
    <button className="btn btn-ghost" type="button">
      Notificaciones
      {unread > 0 && <span className="badge badge-secondary ml-2">{unread}</span>}
    </button>
  );
}
```

`NotificationCreator` y `NotificationBell` **no se conocen**: no comparten `props`, ni un padre común que guarde el estado, ni un `Provider`. Ambos hablan con el store. Eso es lo que sustituye al *prop drilling* de la lección 1.

:::note[Un Server Component no usa el store]
Si intentas llamar `useNotificationsStore(...)` en un Server Component, Next.js falla con un error de hooks. Un store de Zustand es estado **del navegador**: los Server Components pueden renderizar un Client Component que lo use, pero nunca leerlo ni escribirlo.
:::

---

## 5. Cuidado con el servidor

En la lección de Redux vimos por qué un store compartido como variable global es peligroso en Next.js: el servidor Node.js atiende a muchos usuarios con **el mismo proceso**, y una variable a nivel de módulo se comparte entre todas las peticiones.

Con Zustand el riesgo existe, pero es más acotado. Conviene saber exactamente cuándo aparece:

| Situación | ¿Es seguro el `create` a nivel de módulo? |
| :--- | :--- |
| El estado solo cambia por eventos del usuario (clics, formularios) | **Sí.** Esas acciones solo corren en el navegador, donde cada pestaña tiene su propia copia del store |
| Los datos iniciales vienen del servidor (por ejemplo, el usuario del request) y los metes al store al renderizar | **No.** Un usuario podría ver datos del anterior |
| Se escribe en el store durante el render de un componente | **No.** Ocurre también en el servidor |

### Qué haremos en el curso

En el curso usamos stores **solo de interacción y de sesión del navegador** (notificaciones, token, tema), así que el `create` a nivel de módulo, como en la sección 3, es suficiente y es lo más simple.

Cuando necesites inicializar el store con datos que llegan del servidor, el patrón recomendado en la documentación oficial es crear **un store por petición** con `createStore` y entregarlo con un Context:

```tsx title="src/shared/store/counter-provider.tsx (patrón por petición)" showLineNumbers
'use client';

import { createContext, useContext, useRef } from 'react';
import { createStore, useStore, type StoreApi } from 'zustand';

type CounterState = { count: number; increment: () => void };

// Fábrica: cada llamada devuelve un store nuevo e independiente
const createCounterStore = (initialCount: number) =>
  createStore<CounterState>()((set) => ({
    count: initialCount,
    increment: () => set((s) => ({ count: s.count + 1 })),
  }));

const CounterContext = createContext<StoreApi<CounterState> | null>(null);

export function CounterProvider({
  initialCount,
  children,
}: {
  initialCount: number;
  children: React.ReactNode;
}) {
  const storeRef = useRef<StoreApi<CounterState>>(null);
  if (!storeRef.current) {
    storeRef.current = createCounterStore(initialCount);
  }
  return (
    <CounterContext.Provider value={storeRef.current}>
      {children}
    </CounterContext.Provider>
  );
}

export function useCounterStore<T>(selector: (s: CounterState) => T): T {
  const store = useContext(CounterContext);
  if (!store) throw new Error('useCounterStore debe usarse dentro de <CounterProvider>');
  return useStore(store, selector);
}
```

La idea es la misma que `makeStore` en Redux: una **fábrica** que crea una instancia por petición, en lugar de una instancia global. Si estudiaste esa lección, reconocerás el patrón.

:::important[Decisión práctica]
Empieza con la versión simple (`create` a nivel de módulo). Pasa al patrón por petición solo cuando necesites **hidratar el store con datos del servidor**. No lo uses "por si acaso": agrega un `Provider` y varias líneas que no necesitas todavía.
:::

---

## 6. Lista de verificación

Antes de continuar, comprueba que tu proyecto cumple todo esto:

- [ ] `zustand` aparece en `dependencies` de `package.json`.
- [ ] Cada store está en `features/<feature>/store/<feature>.store.ts` (o en `shared/store/` si lo necesitan varias features o la capa `shared/`).
- [ ] El tipo del estado separa datos y acciones, y el store se crea con `create<Estado>()(...)`.
- [ ] Los componentes que usan el hook tienen `'use client'`.
- [ ] Cada componente usa **selectores** (no llama el hook sin argumentos).
- [ ] Ningún Server Component lee ni escribe el store.

---

## Cuestionario de Autoevaluación

<Quiz id="dedw-s13-03-configuracion-zustand-nextjs-quiz">
  <Question title="¿Dónde debe ubicarse un store que solo usa la feature de notificaciones?">
    <Option>En app/, junto a la página que lo muestra.</Option>
    <Option correct>En features/notifications/store/notifications.store.ts.</Option>
    <Option>En un único archivo global store.ts con todos los stores de la app.</Option>
    <Option>Dentro de cada componente, para que no se comparta.</Option>
  </Question>
  <Question title="¿Qué ocurre si un Server Component intenta llamar un hook de Zustand?">
    <Option>Funciona igual, porque Next.js sincroniza el store con el servidor.</Option>
    <Option>Lee el estado del último usuario que visitó la página.</Option>
    <Option correct>Falla, porque los hooks solo funcionan en Client Components; el store es estado del navegador.</Option>
    <Option>Crea automáticamente un store por petición.</Option>
  </Question>
  <Question title="¿Por qué NotificationCreator selecciona solo la acción addNotification?">
    <Option>Porque es la única forma de llamar la acción en TypeScript.</Option>
    <Option>Para que el store guarde el título que escribe el usuario.</Option>
    <Option correct>Porque las acciones tienen una referencia estable, así el componente no se vuelve a renderizar cuando cambia la lista.</Option>
    <Option>Porque Zustand no permite leer datos y acciones en el mismo componente.</Option>
  </Question>
  <Question title="¿Cuándo es necesario pasar del create a nivel de módulo al patrón de un store por petición?">
    <Option>Siempre que la aplicación tenga más de un store.</Option>
    <Option>Cuando se usa TypeScript.</Option>
    <Option correct>Cuando el store debe inicializarse con datos que llegan del servidor, para evitar compartir datos entre peticiones.</Option>
    <Option>Cuando el estado incluye acciones asíncronas.</Option>
  </Question>
</Quiz>
