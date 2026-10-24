---
sidebar_position: 4
description: "Explora lo que permite Zustand: selectores y useShallow, acciones asíncronas, middleware (devtools, persist, immer), slices y uso fuera de React."
---

# Capacidades de Zustand

Con `create`, `set` y selectores ya puedes resolver la mayoría de los casos del curso. Esta lección reúne lo que Zustand agrega **cuando el store crece**: controlar con precisión qué se vuelve a renderizar, hacer peticiones desde las acciones, guardar el estado en `localStorage`, depurarlo con las herramientas de Redux y repartirlo en varios archivos.

---

## 1. Selectores y re-renders

La promesa de Zustand es que **un componente solo se renderiza cuando cambia lo que seleccionó**. Observa en el árbol de la barra de navegación qué componentes se vuelven a pintar cuando llega una notificación, con y sin selectores:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-13/selectores-y-rerender/index.html"
  title="Qué componentes se re-renderizan según el selector"
  height={700}
/>

La regla con la que Zustand decide: después de cada `set`, vuelve a ejecutar el selector de cada componente suscrito y compara el resultado nuevo con el anterior usando `Object.is` (igualdad por referencia). Si son iguales, no hay render.

| Selector | Qué devuelve | ¿Cuándo re-renderiza? |
| :--- | :--- | :--- |
| `useStore()` | El store completo | Con **cualquier** cambio |
| `useStore((s) => s.notifications)` | El arreglo | Cuando se reemplaza el arreglo por otro |
| `useStore((s) => s.addNotification)` | Una función | Nunca (la referencia no cambia) |
| `useStore((s) => s.notifications.length)` | Un número | Solo si cambia la cantidad |

### `useShallow`: seleccionar varios valores

Es tentador pedir varias cosas a la vez con un objeto:

```tsx title="Esto provoca un bucle en Zustand 5" showLineNumbers
// Cada render crea un objeto NUEVO, Object.is lo ve distinto y vuelve a renderizar
const { user, token } = useAuthStore((s) => ({ user: s.user, token: s.token }));
```

En Zustand 5 esto termina en un error de "maximum update depth exceeded". La solución es envolver el selector con **`useShallow`**, que compara el contenido del objeto propiedad por propiedad en lugar de por referencia:

```tsx title="Varios valores con useShallow" showLineNumbers
import { useShallow } from 'zustand/react/shallow';

const { user, token } = useAuthStore(
  useShallow((s) => ({ user: s.user, token: s.token })),
);
```

:::tip[Otra opción, sin useShallow]
Usa **un selector por valor**: `const user = useAuthStore((s) => s.user);` y `const token = useAuthStore((s) => s.token);`. Es igual de eficiente y no necesita importar nada. Reserva `useShallow` para cuando quieras agrupar muchos valores.
:::

### Estado derivado

Cuando un valor se **calcula** a partir del estado (cuántas notificaciones sin leer, total del carrito), no lo guardes: derívalo.

```tsx title="Derivar en el selector" showLineNumbers
// Bien: devuelve un número (primitivo), solo cambia si cambia la cuenta
const unread = useNotificationsStore((s) => s.notifications.filter((n) => !n.read).length);

// Cuidado: filter devuelve un arreglo NUEVO en cada ejecución del selector.
// Si necesitas la lista filtrada, selecciona el arreglo original y filtra en el componente.
const all = useNotificationsStore((s) => s.notifications);
const unreadItems = all.filter((n) => !n.read);
```

---

## 2. Acciones asíncronas

En Redux, las peticiones requieren un *thunk*. En Zustand una acción puede ser, simplemente, una función `async`. Guarda en el store el estado de la petición (`isLoading`, `error`) para que la interfaz lo muestre:

```typescript title="src/features/auth/store/auth.store.ts (acción asíncrona)" showLineNumbers
import { create } from 'zustand';
import { authService } from '../services/auth.service';
import type { LoginCredentials } from '../types';

type AuthState = {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const token = await authService.login(credentials);
      set({ token, isLoading: false });
      return true;
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'No se pudo iniciar sesión',
      });
      return false;
    }
  },

  logout: () => set({ token: null }),
}));
```

El componente solo llama la acción y reacciona al resultado:

```tsx title="Uso en LoginForm" showLineNumbers
const login = useAuthStore((s) => s.login);
const isLoading = useAuthStore((s) => s.isLoading);
const error = useAuthStore((s) => s.error);

const onSubmit = async (data: LoginCredentials) => {
  const ok = await login(data);
  if (ok) router.replace('/dashboard');
};
```

:::note[Mismo ciclo que un thunk]
`isLoading = true` antes, `token` al terminar bien, `error` al fallar: es el ciclo `pending`, `fulfilled` y `rejected` de `createAsyncThunk`, sin la maquinaria extra. A cambio, tú eres responsable de escribirlo completo y de manera consistente en todos tus stores.
:::

---

## 3. Middleware: capas alrededor del store

Un **middleware** es una función que envuelve la creación del store y le agrega una capacidad, sin cambiar cómo escribes tus acciones. Se importan de `zustand/middleware` y se anidan alrededor de la función del store. Recorre qué hace cada capa y qué pasa en una llamada a `set` y al recargar la página:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-13/middleware-en-capas/index.html"
  title="Middleware de Zustand como capas alrededor del store"
  height={740}
/>

| Middleware | Para qué sirve | Importación |
| :--- | :--- | :--- |
| `devtools` | Conecta el store con la extensión Redux DevTools: historial de cambios y viaje en el tiempo | `zustand/middleware` |
| `persist` | Guarda el estado en `localStorage` (u otro almacenamiento) y lo restaura al recargar | `zustand/middleware` |
| `immer` | Permite escribir las acciones "mutando" el estado, mientras produce copias inmutables | `zustand/middleware/immer` |
| `subscribeWithSelector` | Permite suscribirse fuera de React a un valor concreto, no a todo el store | `zustand/middleware` |

### `persist`: que el estado sobreviva a recargar

El caso de uso más común: no perder la sesión al refrescar el navegador.

```typescript title="persist con partialize" showLineNumbers
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isLoading: false,
      error: null,
      login: async (credentials) => { /* ... */ return true; },
      logout: () => set({ token: null }),
    }),
    {
      name: 'auth-storage',                       // clave en localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token }), // solo guarda lo necesario
      version: 1,                                 // para migrar si cambia la forma
    },
  ),
);
```

Tres detalles que evitan errores comunes:

- **`partialize`**: decide qué se guarda. No persistas `isLoading` ni `error`: al recargar, una pantalla con "cargando" eterno es un bug.
- **`version`**: si cambias la forma del estado guardado, sube la versión y define `migrate`; así los usuarios con datos viejos no rompen la app.
- **Las funciones no se guardan**: `JSON.stringify` las descarta, y al restaurar el estado las acciones vuelven a tomarse del código.

:::warning[Persistencia y renderizado en el servidor]
`localStorage` no existe en el servidor. Si el store restaura datos al crearse, el navegador dibuja algo distinto al HTML que envió el servidor y React avisa con un error de **hidratación** (*hydration mismatch*). La solución es retrasar la restauración hasta que el componente se monte:

```typescript title="persist sin desfase de hidratación" showLineNumbers
persist(creator, {
  name: 'auth-storage',
  skipHydration: true,           // no restaurar al crear el store
  partialize: (s) => ({ token: s.token }),
});

// En un Client Component alto del árbol (por ejemplo, el layout):
useEffect(() => {
  useAuthStore.persist.rehydrate();
}, []);
```

Lo usaremos en el caso práctico para que el `AuthGuard` espere a conocer la sesión antes de decidir si expulsa al usuario.
:::

### `devtools`: ver el historial

```typescript title="devtools con nombre de acción" showLineNumbers
import { devtools } from 'zustand/middleware';

export const useNotificationsStore = create<NotificationsState>()(
  devtools(
    (set) => ({
      notifications: [],
      addNotification: (title) =>
        set(
          (s) => ({ notifications: [{ id: Date.now(), title, read: false }, ...s.notifications] }),
          undefined,
          'notifications/add', // aparece como nombre de la acción en Redux DevTools
        ),
    }),
    { name: 'NotificationsStore', enabled: process.env.NODE_ENV !== 'production' },
  ),
);
```

Instala la extensión **Redux DevTools** en tu navegador: verás cada `set` con su nombre, el estado antes y después, y podrás moverte por el historial igual que con Redux.

### `immer`: escribir como si mutaras

Primero se instala (`npm install immer`). Después, en lugar de armar copias a mano, escribes el cambio directamente y el middleware produce el estado inmutable:

```typescript title="immer en una acción" showLineNumbers
import { immer } from 'zustand/middleware/immer';

export const useNotificationsStore = create<NotificationsState>()(
  immer((set) => ({
    notifications: [],
    addNotification: (title) =>
      set((state) => {
        state.notifications.unshift({ id: Date.now(), title, read: false });
      }),
    markRead: (id) =>
      set((state) => {
        const n = state.notifications.find((x) => x.id === id);
        if (n) n.read = true;
      }),
  })),
);
```

Es el mismo Immer que usa Redux Toolkit por dentro. Vale la pena cuando el estado tiene objetos anidados; para estados planos, el `set` con objeto es más simple.

### Combinar middleware

Se anidan unos dentro de otros. El orden recomendado: `devtools` por fuera (para ver todo), luego `persist`, y `immer` lo más cerca de tu código.

```typescript title="Los tres juntos" showLineNumbers
export const useNotificationsStore = create<NotificationsState>()(
  devtools(
    persist(
      immer((set) => ({ /* estado y acciones */ })),
      { name: 'notifications-storage' },
    ),
    { name: 'NotificationsStore' },
  ),
);
```

---

## 4. Dividir un store grande en slices

Cuando un store acumula demasiadas responsabilidades, puedes partirlo en **slices** (porciones) y combinarlos. Cada slice es una función que describe una parte del estado:

```typescript title="Patrón de slices" showLineNumbers
import { create, type StateCreator } from 'zustand';

type SessionSlice = { token: string | null; logout: () => void };
type UiSlice = { sidebarOpen: boolean; toggleSidebar: () => void };
type AppState = SessionSlice & UiSlice;

const createSessionSlice: StateCreator<AppState, [], [], SessionSlice> = (set) => ({
  token: null,
  logout: () => set({ token: null }),
});

const createUiSlice: StateCreator<AppState, [], [], UiSlice> = (set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
});

export const useAppStore = create<AppState>()((...args) => ({
  ...createSessionSlice(...args),
  ...createUiSlice(...args),
}));
```

:::important[¿Slices o varios stores?]
En el curso preferimos **varios stores pequeños por feature** (lección 3). Los slices son útiles cuando varias partes **deben vivir en el mismo store** (por ejemplo, para que una acción modifique dos porciones a la vez), o cuando entras a un proyecto que ya los usa.
:::

---

## 5. Fuera de React: suscripciones y pruebas

`subscribeWithSelector` permite reaccionar a un valor concreto desde cualquier archivo. Un caso típico: limpiar datos cuando se cierra la sesión.

```typescript title="Reaccionar al cierre de sesión" showLineNumbers
import { subscribeWithSelector } from 'zustand/middleware';

// auth.store.ts: envolver el creador con subscribeWithSelector
// create<AuthState>()(subscribeWithSelector((set) => ({ ... })))

useAuthStore.subscribe(
  (state) => state.token,
  (token) => {
    if (token === null) {
      useNotificationsStore.setState({ notifications: [] });
    }
  },
);
```

Para las **pruebas**, el estado de un store persiste entre una prueba y la siguiente porque vive a nivel de módulo. Resetéalo con el estado inicial que guarda el propio hook:

```typescript title="Reiniciar un store en una prueba" showLineNumbers
beforeEach(() => {
  useNotificationsStore.setState(useNotificationsStore.getInitialState(), true);
});
```

El segundo argumento `true` indica **reemplazar** el estado completo en vez de fusionarlo.

---

## 6. Resumen de capacidades

| Necesito... | Uso |
| :--- | :--- |
| Que un componente solo se renderice cuando cambia un dato | Selector por valor |
| Leer varios valores con un solo hook | `useShallow` |
| Hacer una petición y mostrar cargando o error | Acción `async` con `isLoading` y `error` |
| Que la sesión sobreviva a recargar | `persist` con `partialize` (y `skipHydration` en Next.js) |
| Ver y rebobinar los cambios | `devtools` + Redux DevTools |
| Escribir acciones sobre estado anidado sin copias manuales | `immer` |
| Repartir un store grande | Slices o varios stores |
| Usar el store en un cliente HTTP o utilidad | `getState()` / `setState()` / `subscribe()` |
| Reiniciar el store en una prueba | `setState(getInitialState(), true)` |

---

## Cuestionario de Autoevaluación

<Quiz id="dedw-s13-04-capacidades-de-zustand-quiz">
  <Question title="¿Qué problema evita useShallow en Zustand 5?">
    <Option>Que el store se guarde dos veces en localStorage.</Option>
    <Option correct>Que un selector que devuelve un objeto nuevo en cada ejecución provoque renders sin fin.</Option>
    <Option>Que las acciones asíncronas se ejecuten en el servidor.</Option>
    <Option>Que se pierdan las acciones al recargar la página.</Option>
  </Question>
  <Question title="¿Qué hace la opción partialize del middleware persist?">
    <Option>Divide el store en varios archivos más pequeños.</Option>
    <Option>Retrasa la restauración del estado hasta que el componente se monte.</Option>
    <Option correct>Define qué porción del estado se guarda en el almacenamiento, para no persistir datos como isLoading o error.</Option>
    <Option>Convierte automáticamente las acciones en funciones puras.</Option>
  </Question>
  <Question title="¿Por qué se usa skipHydration junto con persist en Next.js?">
    <Option>Porque localStorage es demasiado lento para leerlo al crear el store.</Option>
    <Option correct>Para que el primer render del navegador coincida con el HTML del servidor y se restaure el estado después, evitando un error de hidratación.</Option>
    <Option>Para que el estado persistido se comparta entre todos los usuarios del servidor.</Option>
    <Option>Para evitar que el middleware devtools registre las acciones.</Option>
  </Question>
  <Question title="¿Cuál es la diferencia principal entre una acción async de Zustand y un createAsyncThunk de Redux Toolkit?">
    <Option>La acción de Zustand no puede capturar errores con try/catch.</Option>
    <Option correct>En Zustand es una función async normal dentro del store, y tú escribes el ciclo de carga y error; el thunk genera pending, fulfilled y rejected automáticamente.</Option>
    <Option>El thunk funciona sin store, mientras que Zustand requiere un Provider.</Option>
    <Option>Zustand obliga a usar dispatch para cada petición.</Option>
  </Question>
  <Question title="¿Cómo se reinicia un store de Zustand entre dos pruebas?">
    <Option>Reiniciando el servidor de desarrollo de Next.js.</Option>
    <Option>Llamando useStore() sin selector en el beforeEach.</Option>
    <Option correct>Con setState(getInitialState(), true), que reemplaza el estado completo por el inicial.</Option>
    <Option>No es necesario, porque el estado se reinicia solo después de cada prueba.</Option>
  </Question>
</Quiz>
