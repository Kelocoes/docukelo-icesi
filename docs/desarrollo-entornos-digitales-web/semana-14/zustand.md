---
sidebar_position: 1
---

# Guía: Zustand en Next.js

## ¿Qué es Zustand?

Zustand es una librería de gestión de estado ligera, simple y flexible para aplicaciones React. Proporciona una forma elegante de centralizar el estado global sin la complejidad de Redux o MobX.

### Características principales

- Ligero: ~2.5KB en tamaño comprimido
- Simple: Sintaxis minimalista y fácil de aprender
- Reactivo: Actualizaciones automáticas cuando el estado cambia
- Flexible: Soporta middleware, devtools, persistencia
- TypeScript friendly: Tipado completo y seguro

## Zustand vs Context API

### Context API (nativo de React)

#### Ventajas

- No requiere dependencias externas
- Forma estándar de React
- Integrado en el ecosistema

#### Desventajas

- Prop drilling: Necesitas envolver componentes en múltiples proveedores
- Re-renders innecesarios: Todos los consumidores se re-renderizan si el contexto cambia, incluso si no usan ese valor
- Requiere más boilerplate (Provider, useContext)
- Gestión de estado más verbosa con useReducer

### Zustand

#### Ventajas

- Sin prop drilling: Acceso directo al estado desde cualquier componente
- Re-renders selectivos: Solo se re-renderiza si la parte del estado que usan cambió (mediante selectors)
- Sintaxis más limpia y clara
- Menos boilerplate
- Mejor rendimiento en aplicaciones grandes

#### Desventajas

- Depende de una librería externa
- Requiere aprender una nueva API (aunque es simple)

### Comparación directa

Context API - necesitas Provider y useContext:

```javascript
<NotificationProvider>
    <App />
</NotificationProvider>;

const { notifications, addNotification } = useContext(NotificationContext);
```

Zustand - acceso directo sin Provider:

```javascript
const notifications = useNotificationsStore((s) => s.notifications);
const addNotification = useNotificationsStore((s) => s.addNotification);
```

## Estructura y Conceptos

### Partes de una store Zustand

```typescript
import { create } from "zustand";

// 1. Define el tipo del estado
type MyState = {
  // Datos (state)
  count: number;
  items: string[];

  // Acciones (mutations)
  increment: () => void;
  addItem: (item: string) => void;
};

// 2. Crea la store con create()
export const useMyStore = create<MyState>((set) => ({
  // Estado inicial
  count: 0,
  items: [],

  // Acciones: reciben (set) que es la función para actualizar estado
  increment: () => set((state) => ({ count: state.count + 1 })),
  addItem: (item: string) =>
    set((state) => ({ items: [...state.items, item] })),
}));

// 3. Usa la store en componentes
function MyComponent() {
  const count = useMyStore((s) => s.count); // Selector: solo suscríbete a 'count'
  const increment = useMyStore((s) => s.increment);

  return <button onClick={increment}>{count}</button>;
}
```

### Conceptos clave

#### create()

Función que genera el hook personalizado de la store. Recibe un callback que define el estado y acciones.

#### set()

Función que actualiza el estado. Siempre retorna un objeto con los cambios (merge automático).

#### Selectors

Las funciones (s) => s.propiedad son selectors. Solo se suscribe a esa propiedad.
Si usas useMyStore() sin selector, se suscribe a TODO y se re-renderiza siempre.

#### Acciones

Funciones que llaman set() para mutar el estado de forma controlada.

## Implementación paso a paso

### Paso 1: Instalar Zustand

```bash
npm install zustand
```

### Paso 2: Crear la carpeta de stores

```
src/lib/store/
```

Esto centraliza toda la lógica de estado global.

### Paso 3: Definir tipos

Primero, piensa en qué datos necesitas:

- Estado: notifications (lista de notificaciones)
- Acciones: cómo cambiar ese estado

### Paso 4: Crear la store

Escribe el archivo src/lib/store/notificationsStore.ts con:

- Tipos del estado
- Estados iniciales
- Acciones que mutan el estado

### Paso 5: Suscribirse en componentes

Importa el hook y accede al estado/acciones con selectors.

### Paso 6: (Opcional) Añadir middleware

Zustand soporta middleware para persistencia, logging, etc.

## Ejemplo Práctico: Notificaciones

### Archivo 1: src/lib/store/notificationsStore.ts

```typescript
import { create } from "zustand";

// Tipo para cada notificación
export type NotificationItem = {
    id: number;
    title: string;
    body?: string;
    read?: boolean;
    createdAt: string;
};

// Tipo del estado completo
type NotificationsState = {
    notifications: NotificationItem[];
    addNotification: (title: string, body?: string) => void;
    markRead: (id: number) => void;
    markAllRead: () => void;
    removeNotification: (id: number) => void;
};

// Contador para IDs único
let nextId = Date.now();

// Crear la store
export const useNotificationsStore = create<NotificationsState>((set) => ({
    // Estado inicial
    notifications: [],

    // Acción: añadir notificación
    addNotification: (title: string, body?: string) =>
        set((state) => ({
            notifications: [
                {
                    id: ++nextId,
                    title,
                    body,
                    read: false,
                    createdAt: new Date().toISOString(),
                },
                ...state.notifications,
            ],
        })),

    // Acción: marcar una notificación como leída
    markRead: (id: number) =>
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n,
            ),
        })),

    // Acción: marcar todas como leídas
    markAllRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({
                ...n,
                read: true,
            })),
        })),

    // Acción: borrar una notificación
    removeNotification: (id: number) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),
}));
```

### Archivo 2: NotificationCreator.tsx

Componente que emite (crea) notificaciones para realizar pruebas:

```ts
"use client";

import { useState } from "react";
import { useNotificationsStore } from "@/lib/store/notificationsStore";

export default function NotificationCreator() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    // Suscribirse solo a la acción de añadir
    const add = useNotificationsStore((s) => s.addNotification);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        // Llamar acción de la store
        add(title.trim(), body.trim() || undefined);

        // Limpiar formulario
        setTitle("");
        setBody("");
    };

    return (
        <form onSubmit={onSubmit} className="flex gap-2 items-start">
            <input
                className="input input-bordered"
                placeholder="Título de notificación"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                className="input input-bordered"
                placeholder="Cuerpo (opcional)"
                value={body}
                onChange={(e) => setBody(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
                Emitir
            </button>
        </form>
    );
}
```

### Archivo 3: NavBar.tsx

Componente que muestra y gestiona notificaciones:

```ts
"use client";

import Link from "next/link";
import { useState } from "react";
import { useNotificationsStore } from "@/lib/store/notificationsStore";

export default function NavBar({ title = "Dashboard" }) {
    const [open, setOpen] = useState(false);

    // Selectors específicos para cada dato/acción que necesitamos
    const notifications = useNotificationsStore((s) => s.notifications);
    const unreadCount = notifications.filter((n) => !n.read).length;
    const markRead = useNotificationsStore((s) => s.markRead);
    const markAllRead = useNotificationsStore((s) => s.markAllRead);
    const removeNotification = useNotificationsStore(
        (s) => s.removeNotification,
    );

    return (
        <nav className="navbar bg-base-100 border-b border-base-200 px-4">
            <div className="flex-1">
                <Link href="/" className="btn btn-ghost normal-case text-xl">
                    {title}
                </Link>
            </div>

            <div className="flex-none">
                <ul className="menu menu-horizontal px-1 gap-2 items-center">
                    <li>
                        <Link href="/feed" className="btn btn-ghost">
                            Feed
                        </Link>
                    </li>
                    <li>
                        <Link href="/profile" className="btn btn-ghost">
                            Perfil
                        </Link>
                    </li>

                    <li className="relative">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => setOpen((v) => !v)}
                        >
                            Notificaciones
                            {unreadCount > 0 && (
                                <span className="badge badge-secondary ml-2">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-80 z-50 card bg-base-100 border border-base-200 shadow-lg">
                                <div className="card-body p-2">
                                    <div className="flex items-center justify-between px-2">
                                        <strong>Notificaciones</strong>
                                        <div className="flex gap-2">
                                            <button
                                                className="btn btn-xs"
                                                onClick={() => markAllRead()}
                                            >
                                                Marcar todas
                                            </button>
                                            <button
                                                className="btn btn-xs"
                                                onClick={() => setOpen(false)}
                                            >
                                                Cerrar
                                            </button>
                                        </div>
                                    </div>

                                    <div className="divide-y mt-2">
                                        {notifications.length === 0 && (
                                            <div className="p-2 text-sm text-base-content/60">
                                                Sin notificaciones
                                            </div>
                                        )}

                                        {notifications.map((n) => (
                                            <div
                                                key={n.id}
                                                className="p-2 flex items-start justify-between gap-2"
                                            >
                                                <div>
                                                    <div className="font-medium">
                                                        {n.title}
                                                    </div>
                                                    {n.body && (
                                                        <div className="text-sm text-base-content/70">
                                                            {n.body}
                                                        </div>
                                                    )}
                                                    <div className="text-xs text-base-content/50 mt-1">
                                                        {new Date(
                                                            n.createdAt,
                                                        ).toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    {!n.read && (
                                                        <button
                                                            className="btn btn-xs btn-outline"
                                                            onClick={() =>
                                                                markRead(n.id)
                                                            }
                                                        >
                                                            Leer
                                                        </button>
                                                    )}
                                                    <button
                                                        className="btn btn-xs btn-error"
                                                        onClick={() =>
                                                            removeNotification(
                                                                n.id,
                                                            )
                                                        }
                                                    >
                                                        Borrar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
}
```

## Flujo completo

### Cómo interactúan los componentes

```
NotificationCreator (emite)
       |
       v
   addNotification() <--> notificationsStore (estado central)
       ^
       |
   NavBar (consume y gestiona)
```

## Conclusiones

### Cuándo usar Zustand

- Estado compartido entre múltiples componentes
- Acciones independientes que mutan estado
- Necesitas buen rendimiento (re-renders selectivos)
- Quieres sintaxis simple y legible
- Tienes app pequeña-mediana

### Cuándo usar Context API

- Solo necesitas pasar datos entre padre e hijos
- Estado muy simple (ej. tema de la app)
- Quieres evitar dependencias externas
- Trabajas en proyecto muy pequeño

### Ventajas de Zustand en este proyecto

1. Simplísimo: Store de notificaciones en 50 líneas
2. Flexible: Fácil añadir acciones (ej. editNotification, getUnread())
3. Escalable: Puedes tener más stores (gameStore, filterStore, etc.)
4. Rendimiento: NavBar solo se re-renderiza si cambian notificaciones
5. TypeScript: Tipado completo, autocompletado en IDE

## Referencias

- Documentación oficial Zustand: https://github.com/pmndrs/zustand
- Zustand con TypeScript: https://docs.pmnd.rs/zustand/guides/typescript
- Middleware y persist: https://docs.pmnd.rs/zustand/integrations/persisting-store-data
