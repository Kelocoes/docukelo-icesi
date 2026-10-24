---
sidebar_position: 2
description: "Aprende los conceptos de Zustand (store, create, set, get, acciones y selectores), su flujo de datos y cómo se compara con Redux Toolkit y Context."
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Conceptos de Zustand

En la lección anterior vimos por qué compartir estado con `props` o con Context se vuelve incómodo. **Zustand** (palabra alemana para "estado") es una librería de estado global para React que resuelve ese problema con una idea muy corta: un store es **una función que devuelve un hook**.

Si ya conoces Redux Toolkit (lo estudiamos en Computación en Internet 3), te sorprenderá lo poco que hay que aprender: no existen `dispatch`, ni objetos *action*, ni *reducers*, ni `Provider`.

---

## 1. Qué es Zustand

Zustand es una librería pequeña, sin dependencias y sin opiniones fuertes sobre cómo organizar tu código. Su modelo mental cabe en cuatro frases:

1. Creas un **store** con la función `create`.
2. El store guarda **estado** y **acciones** en el mismo objeto.
3. Las acciones cambian el estado llamando a **`set`**.
4. Los componentes leen con el hook que `create` devuelve, indicando con un **selector** qué dato necesitan.

:::note[Versión del curso]
Usamos **Zustand 5** con React 19 y Next.js 16. Si encuentras tutoriales antiguos (versión 3 o 4), la mayoría del código sigue funcionando; la diferencia que más afecta se explica en [Capacidades de Zustand](./04-capacidades-de-zustand.md#useshallow-seleccionar-varios-valores).
:::

---

## 2. Anatomía de un store

Este es el store de notificaciones que usaremos durante la semana. Léelo completo una vez; después lo desarmamos pieza por pieza.

```typescript title="src/features/notifications/store/notifications.store.ts" showLineNumbers
import { create } from 'zustand';

export type NotificationItem = {
  id: number;
  title: string;
  read: boolean;
};

type NotificationsState = {
  // Estado
  notifications: NotificationItem[];
  // Acciones
  addNotification: (title: string) => void;
  markAllRead: () => void;
};

export const useNotificationsStore = create<NotificationsState>()((set) => ({
  notifications: [],

  addNotification: (title) =>
    set((state) => ({
      notifications: [
        { id: Date.now(), title, read: false },
        ...state.notifications,
      ],
    })),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
}));
```

### `create`

`create` recibe una función que describe el store y devuelve un **hook** (por convención se nombra `useAlgoStore`). Ese hook es lo único que importan los componentes.

:::tip[Los dos paréntesis]
Con TypeScript escribimos `create<Estado>()(...)`: primero indicamos el tipo y luego pasamos la función. Esta forma "curried" es necesaria cuando usamos *middleware* (lo veremos en la lección 4), así que la usamos siempre para no cambiarla después.
:::

### Estado y acciones juntos

A diferencia de Redux, donde el estado vive en un *slice* y las acciones se despachan desde otro lado, en Zustand el estado y las funciones que lo modifican son **propiedades del mismo objeto**. Una acción es simplemente una función.

### `set`: cambiar el estado

`set` es el único camino para modificar el estado. Tiene dos formas:

```typescript title="Dos formas de set" showLineNumbers
// 1. Con un objeto: cuando el nuevo valor no depende del anterior
set({ notifications: [] });

// 2. Con una función: cuando depende del estado actual (lo más habitual)
set((state) => ({ notifications: [...state.notifications, nueva] }));
```

Dos reglas que conviene grabar:

- **`set` fusiona de forma superficial** (*shallow merge*): solo debes devolver las propiedades que cambian. Las demás se conservan. No necesitas escribir `...state`.
- **El estado es inmutable**: nunca hagas `state.notifications.push(...)`. Devuelve un arreglo nuevo (`[...]`, `map`, `filter`). Más adelante veremos `immer`, que permite escribir "mutando" sin romper la regla.

### `get`: leer el estado dentro de una acción

El segundo parámetro de la función de `create` es `get`, que devuelve el estado actual. Sirve cuando una acción necesita leer algo antes de decidir:

```typescript title="Usar get dentro de una acción" showLineNumbers
export const useAuthStore = create<AuthState>()((set, get) => ({
  token: null,
  isAuthenticated: () => get().token !== null,
}));
```

### Selector: qué parte del store necesito

Un **selector** es una función que recibe el estado completo y devuelve solo lo que el componente necesita:

```tsx title="Leer con selectores" showLineNumbers
const notifications = useNotificationsStore((s) => s.notifications);
const addNotification = useNotificationsStore((s) => s.addNotification);
```

El componente se suscribe **solo** a ese valor. Si cambia otra parte del store, no se vuelve a renderizar. Por eso los selectores no son opcionales en la práctica.

:::warning[Evita llamar el hook sin selector]
`const store = useNotificationsStore()` funciona, pero suscribe el componente a **todo** el store: se renderiza ante cualquier cambio, y perdemos la ventaja principal frente a Context.
:::

---

## 3. El flujo de datos

El recorrido de un cambio en Zustand es más corto que en Redux. Sigue paso a paso qué ocurre cuando el usuario emite una notificación:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-13/flujo-zustand/index.html"
  title="Flujo de un cambio de estado en Zustand"
  height={740}
/>

Resumen del recorrido:

1. El componente **llama la acción** directamente (`addNotification("Hola")`). No hay `dispatch` ni objeto *action*.
2. La acción llama a **`set`** con el cambio.
3. El store reemplaza su estado y **avisa a los suscriptores**.
4. Cada **selector** compara su resultado anterior con el nuevo (con `Object.is`).
5. Solo los componentes cuyo selector devolvió un valor distinto se **vuelven a renderizar**.

:::note[Por qué NotificationCreator no se re-renderiza]
`NotificationCreator` solo selecciona la acción `addNotification`. Las funciones de un store se crean **una sola vez**, así que su referencia nunca cambia y ese componente no se entera de que la lista creció. Es una de las razones por las que separar "leer datos" de "llamar acciones" con selectores distintos es barato y limpia el rendimiento.
:::

---

## 4. Zustand fuera de React

El hook que devuelve `create` trae, además, tres funciones que funcionan **sin componentes**. Esto es útil para el cliente HTTP, una utilidad o una prueba:

```typescript title="getState, setState y subscribe" showLineNumbers
// Leer el estado actual (sin suscribirse)
const { notifications } = useNotificationsStore.getState();

// Modificarlo desde cualquier archivo
useNotificationsStore.getState().addNotification('Guardado');
useNotificationsStore.setState({ notifications: [] });

// Escuchar cambios (devuelve la función para cancelar la suscripción)
const unsubscribe = useNotificationsStore.subscribe((state) => {
  console.log('Ahora hay', state.notifications.length);
});
```

Un ejemplo clásico: el `apiFetch` de la semana 12 puede leer el token con `useAuthStore.getState().token` sin ser un componente ni un hook.

---

## 5. Comparativa: Context, Zustand y Redux Toolkit

Ninguna herramienta es la mejor en todos los escenarios. Esta es la misma comparativa que vimos en Redux, ahora con Zustand en el centro:

<ThemedImage
  sources={{
    light: useBaseUrl('/img/computacion-3/s12-comparativa-herramientas-light.svg'),
    dark: useBaseUrl('/img/computacion-3/s12-comparativa-herramientas-dark.svg'),
  }}
  alt="Comparativa de gestión de estado: React Context vs Zustand vs Redux Toolkit"
/>

| Criterio | React Context | Zustand | Redux Toolkit |
| :--- | :--- | :--- | :--- |
| **Piezas que aprendes** | `createContext`, `Provider`, `useContext` | `create`, `set`, selector | `configureStore`, slice, reducer, action, `dispatch`, `Provider`, selector |
| **Boilerplate** | Medio | Mínimo | Moderado |
| **`Provider` obligatorio** | Sí | No (en la versión simple) | Sí |
| **Re-renders** | A todos los consumidores | Por selector | Por selector |
| **Flujo de datos** | Libre | Libre (tú decides la estructura) | Estricto y unidireccional |
| **Efectos asíncronos** | Tú lo resuelves | Acciones `async` normales | Thunks / `createAsyncThunk` |
| **Herramientas de depuración** | React DevTools | Middleware `devtools` (Redux DevTools) | Redux DevTools nativo |
| **Convención impuesta al equipo** | Ninguna | Ninguna | Alta |
| **Cuándo encaja** | Datos casi estáticos (tema, idioma) | Apps pequeñas y medianas, estado de UI y sesión | Equipos grandes, dominios complejos, trazabilidad |

### Mismo cambio, dos herramientas

Agregar una notificación en Redux Toolkit y en Zustand:

```tsx title="Redux Toolkit: varias piezas" showLineNumbers
// slice
reducers: { add: (state, action: PayloadAction<string>) => { state.items.unshift(...) } }
// componente
const dispatch = useAppDispatch();
dispatch(add('Hola'));
const items = useAppSelector((s) => s.notifications.items);
```

```tsx title="Zustand: el store y listo" showLineNumbers
// store
addNotification: (title) => set((s) => ({ notifications: [...] }))
// componente
const addNotification = useNotificationsStore((s) => s.addNotification);
addNotification('Hola');
const notifications = useNotificationsStore((s) => s.notifications);
```

:::important[Libertad frente a convención]
Que Zustand no imponga estructura es su ventaja y su riesgo. En un equipo grande, sin acuerdos se terminan teniendo veinte formas distintas de escribir un store. Por eso esta semana también fijamos **dónde viven los stores** y **cómo se nombran** (lección siguiente).
:::

---

## Cuestionario de Autoevaluación

<Quiz id="dedw-s13-02-zustand-conceptos-quiz">
  <Question title="¿Qué devuelve la función create de Zustand?">
    <Option>Un componente Provider que debe envolver la aplicación.</Option>
    <Option>Un objeto Action listo para despachar.</Option>
    <Option correct>Un hook que los componentes usan para leer el estado y llamar acciones.</Option>
    <Option>Un reducer que debe registrarse en un configureStore.</Option>
  </Question>
  <Question title="¿Qué hace set cuando se le entrega un objeto con solo una propiedad?">
    <Option>Reemplaza todo el estado y borra las propiedades que no se incluyeron.</Option>
    <Option correct>Fusiona de forma superficial: cambia esa propiedad y conserva las demás.</Option>
    <Option>Lanza un error porque debe recibir siempre el estado completo.</Option>
    <Option>Ejecuta la acción de forma asíncrona en el servidor.</Option>
  </Question>
  <Question title="¿Por qué conviene usar un selector como (s) => s.notifications en lugar de llamar useNotificationsStore() sin argumentos?">
    <Option>Porque sin selector TypeScript no puede inferir los tipos.</Option>
    <Option>Porque los selectores permiten mutar el estado directamente.</Option>
    <Option correct>Porque con el selector el componente solo se vuelve a renderizar cuando cambia ese dato, no ante cualquier cambio del store.</Option>
    <Option>Porque sin selector el store se reinicia en cada render.</Option>
  </Question>
  <Question title="¿Cuál de estas diferencias entre Redux Toolkit y Zustand es correcta?">
    <Option>Zustand exige dispatch y reducers; Redux Toolkit no.</Option>
    <Option correct>En Zustand las acciones son funciones del propio store; en Redux Toolkit se despachan objetos action que procesa un reducer.</Option>
    <Option>Zustand no permite usar el estado fuera de componentes de React.</Option>
    <Option>Redux Toolkit no admite selectores.</Option>
  </Question>
  <Question title="¿Para qué sirve useNotificationsStore.getState()?">
    <Option>Para suscribir un componente a todos los cambios del store.</Option>
    <Option>Para reiniciar el store a su estado inicial.</Option>
    <Option correct>Para leer el estado actual desde código que no es un componente, como un cliente HTTP, sin suscribirse.</Option>
    <Option>Para ejecutar los middleware registrados.</Option>
  </Question>
</Quiz>
