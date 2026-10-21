---
sidebar_position: 2
description: "Aprende los conceptos de Redux Toolkit, como store, slices, reducers, selectors y thunks, y su flujo de datos unidireccional."
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Conceptos de Redux

En la lección anterior analizamos cómo React gestiona el estado local mediante `useState`, los límites del levantamiento de estado (*lifting state up*) y por qué React Context no es un motor de estado global concebido para datos que cambian con alta frecuencia. Cuando una aplicación escala hacia múltiples módulos independientes que deben compartir información y sincronizarse con un backend, el estado disperso produce duplicidad, inconsistencias visuales y acoplamiento severo por *prop drilling*.

En esta lección estudiaremos los fundamentos teóricos y la arquitectura de **Redux Toolkit (RTK)**, el estándar oficial y moderno para gestionar estado predecible en aplicaciones complejas, entendiendo cada una de sus piezas antes de implementarlo sobre nuestra arquitectura limpia.

---

## 1. Qué es Redux y qué problema resuelve

Redux es un contenedor del estado predecible para aplicaciones JavaScript. Nació para abordar el problema fundamental de la dispersión del estado: cuando varios componentes distantes en el árbol de vistas necesitan leer y modificar los mismos datos (como la lista de rutinas de entrenamiento o la sesión de usuario), mantener copias locales sincronizadas se convierte en una fuente inagotable de fallos.

### Los Tres Principios de Redux

El diseño de Redux descansa sobre tres principios inmutables que garantizan predictibilidad y trazabilidad matemática:

1. **Única fuente de verdad (*Single source of truth*)**: Todo el estado global de la aplicación reside en un único árbol de objetos dentro de un único almacén (*Store*). No existen almacenes paralelos compitiendo entre sí; cualquier parte de la aplicación que requiera consultar datos acude a la misma fuente.
2. **El estado es de solo lectura (*State is read-only*)**: Ningún componente, servicio o función puede modificar directamente el árbol de estado. La única manera de expresar una intención de cambio es despachando una **acción** (*Action*), un objeto plano que formaliza qué suceso acaba de ocurrir.
3. **Los cambios se realizan mediante funciones puras (*Changes are made with pure functions*)**: La transformación del estado a partir de una acción es calculada exclusivamente por **reductores** (*Reducers*). Un reductor jamás produce efectos secundarios (no realiza peticiones HTTP, no escribe en disco ni altera variables externas); toma el estado actual, procesa la acción y devuelve una nueva referencia de estado.

---

## 2. Arquitectura y Vocabulario Técnico

Para dominar Redux es indispensable asimilar su vocabulario técnico fundamental. Cada concepto cumple un rol delimitado en el engranaje del estado:

### Store

El **Store** es el contenedor central que custodia el árbol de estado global de la aplicación. Solo existe una instancia de store activa en el cliente.

> **Analogía:** La bóveda principal de un banco. Nadie puede entrar a cambiar el dinero directamente; todo ingreso o retiro debe quedar formalmente registrado en taquilla.

```typescript title="src/store/store.ts" showLineNumbers
import { configureStore } from '@reduxjs/toolkit';
import { routinesReducer } from '@/src/features/routines/presentation/store/routines.slice';

export const store = configureStore({
  reducer: {
    routines: routinesReducer,
  },
});
```

:::note[En Next.js no usaremos un store global]
En Next.js (App Router) un store global compartido provocaría fugas de estado entre peticiones concurrentes en el servidor. En nuestro proyecto crearemos el store mediante una función fábrica `makeStore` por cada renderizado, como se explica en [Configuración de Redux en Next.js](./03-configuracion-redux-nextjs.md).
:::

### State

El **State** es la estructura de datos viva que refleja el estado de la aplicación en un instante determinado. En aplicaciones medianas o grandes se organiza en ramas (*slices*).

> **Analogía:** La fotografía instantánea del inventario del gimnasio al inicio del día.

```typescript title="Tipado del Estado de Rutinas" showLineNumbers
interface RoutinesState {
  items: RoutineItemViewModel[];
  isLoading: boolean;
  isMutating: boolean;
  errorMessage: string | null;
}
```

### Action

Una **Action** es un objeto plano de JavaScript que describe un acontecimiento ocurrido en el sistema. Posee obligatoriamente una propiedad `type` (una cadena que identifica la operación) y opcionalmente un `payload` con los datos asociados.

> **Analogía:** Un formulario de solicitud sellado que entregas en la ventanilla describiendo el trámite que deseas realizar.

```typescript title="Objeto Action plano" showLineNumbers
const createRoutineAction = {
  type: 'routines/create',
  payload: {
    name: 'Espalda y Bíceps',
    description: 'Rutina de hipertrofia de tirón',
  },
};
```

### Reducer

Un **Reducer** es una función pura con la firma `(state, action) => newState`. Recibe el estado actual y la acción recibida, y calcula el nuevo estado resultante sin alterar el estado previo.

> **Analogía:** Un contador contable que toma el libro de balances anterior, revisa el comprobante de pago recibido y escribe una hoja de balance completamente nueva sin rayar ni borrar la anterior.

```typescript title="Reducer conceptual" showLineNumbers
function counterReducer(state = { value: 0 }, action: { type: string; payload?: number }) {
  switch (action.type) {
    case 'counter/increment':
      return { ...state, value: state.value + 1 };
    default:
      return state;
  }
}
```

:::note[Immer en Redux Toolkit: La magia de la inmutabilidad]
En Redux tradicional era obligatorio usar desestructuración profunda (`...state, items: [...state.items, newItem]`) para no mutar el estado. RTK incorpora la biblioteca **Immer**, la cual envuelve el estado en un objeto *Proxy draft*. Esto permite escribir sintaxis mutativa aparente como `state.items.unshift(action.payload)` o `state.isLoading = true`; Immer intercepta cada asignación y produce internamente una copia inmutable impecable.
:::

### Slice

Un **Slice** es una porción lógica del estado global que empaqueta en un único archivo el estado inicial, los reducers correspondientes y los creadores de acciones (*action creators*) autogenerados para una característica (*feature*) concreta.

> **Analogía:** El departamento especializado de créditos dentro del banco; gestiona sus propias reglas y datos, pero opera bajo la misma entidad financiera.

```typescript title="Estructura mínima de un Slice" showLineNumbers
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const routinesSlice = createSlice({
  name: 'routines',
  initialState: { items: [], isLoading: false } as RoutinesState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload; // Sintaxis Immer segura
    },
  },
});
```

### Dispatch

El método **`dispatch`** es el único mecanismo que ofrece el store para solicitar una mutación de estado. Se le entrega un objeto acción y el store se encarga de dirigirlo a los reducers pertinentes.

> **Analogía:** Introducir una carta formal por la ranura del buzón de correspondencia.

```typescript title="Despacho de una acción" showLineNumbers
dispatch(routinesSlice.actions.setLoading(true));
```

### Selector y `useSelector`

Un **Selector** es una función pura que extrae fragmentos concretos del árbol de estado global. El hook `useSelector` de React Redux suscribe al componente a dichos datos; si el store cambia pero la porción extraída mantiene su valor por igualdad referencial, el componente **no se re-renderiza**, optimizando el rendimiento de React.

> **Analogía:** Solicitar al banco únicamente el saldo de tu cuenta corriente, sin pedir el balance de todos los clientes de la sucursal.

```tsx title="Consumo con useSelector" showLineNumbers
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';

export function RoutineCounter() {
  const count = useSelector((state: RootState) => state.routines.items.length);
  return <span>Total de rutinas: {count}</span>;
}
```

### `useDispatch`

Hook provisto por React Redux para acceder a la función `dispatch` del store dentro de componentes del cliente (`'use client'`).

```tsx title="Uso de useDispatch" showLineNumbers
import { useDispatch } from 'react-redux';
import { routinesSlice } from '@/src/features/routines/presentation/store/routines.slice';

export function ClearErrorButton() {
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(routinesSlice.actions.clearError())}>Limpiar</button>;
}
```

### Provider

El componente `<Provider store={store}>` suministra la instancia del store a todo el árbol de React mediante el Context API nativo.

:::important[Diferencia arquitectónica fundamental]
Existe una diferencia crítica entre:
1. **Usar Context como gestor de estado:** Colocar objetos cambiantes en un contexto nativo obliga a re-renderizar a **todos** los componentes consumidores ante cualquier mínima mutación.
2. **Usar Context como mecanismo de inyección del Store:** `<Provider>` solo transporta la referencia estática del store hacia abajo. La reactividad granular y la prevención de re-renders innecesarios la ejecuta el motor interno de subscripciones de Redux a través de `useSelector`.
:::

---

## 3. Flujo de Datos Unidireccional

En Redux, la información viaja siempre en un único sentido predecible (*One-Way Data Flow*). Ningún dato retrocede ni existen atajos que salten pasos de la cadena:

1. **La Vista (UI)** detecta un evento del usuario (por ejemplo, el clic en "Crear Rutina").
2. El componente invoca **`dispatch(action)`**, enviando un objeto descriptivo con los datos.
3. El **Store** recibe la acción y la entrega a la función **Reducer** correspondiente.
4. El **Reducer** calcula el siguiente estado de forma inmutable y devuelve el nuevo árbol.
5. El **Store** actualiza su referencia y notifica a los suscriptores.
6. Los **Selectores** verifican si la porción de datos que observan cambió; si es así, los componentes afectados se **re-renderizan** con la información actualizada.

A continuación puedes experimentar interactivamente este ciclo completo utilizando el dominio de rutinas del curso:

<iframe
  src="/interactive/computacion-3/semana-12/flujo-redux/index.html"
  title="Flujo de datos unidireccional en Redux Toolkit"
  style={{ width: '100%', height: 740, border: 0 }}
  loading="lazy"
/>

---

## 4. Operaciones Asíncronas y Ciclo de Vida de los Thunks

Los reductores deben ser estrictamente puros y síncronos: dado el mismo estado y la misma acción, deben devolver siempre el mismo resultado de inmediato. Entonces, ¿dónde realizamos las peticiones HTTP al backend, las lecturas a bases de datos o el manejo de temporizadores?

### ¿Qué es un Thunk?

Un **Thunk** es una función que encapsula una operación para retrasar su ejecución. En el ecosistema de Redux, Redux Thunk es un middleware que intercepta las acciones despachadas: si la acción es un objeto plano, la entrega directamente a los reducers; si es una función, la ejecuta proporcionándole acceso a `dispatch` y `getState`.

El thunk extrae toda la asincronía y los efectos colaterales fuera de los componentes de React y fuera de los reducers, manteniendo las vistas 100% declarativas.

### `createAsyncThunk` y sus Tres Estados

Redux Toolkit ofrece la función `createAsyncThunk` para automatizar las operaciones asíncronas estándar. A partir de un prefijo de acción, genera automáticamente tres creadores de acciones que modelan el ciclo de vida de una promesa:

- **`pending`**: Se despacha de forma inmediata antes de ejecutar la promesa asíncrona. Ideal para encender indicadores visuales (`isLoading = true`) y resetear mensajes de error anteriores.
- **`fulfilled`**: Se despacha cuando la promesa resuelve con éxito. El valor retornado por la función asíncrona viaja automáticamente en `action.payload`.
- **`rejected`**: Se despacha cuando la promesa es rechazada o arroja una excepción.

```typescript title="src/features/routines/presentation/store/routines.slice.ts" showLineNumbers
import { createAsyncThunk } from '@reduxjs/toolkit';
import { routineContainer } from '@/src/features/routines/di/routine.container';
import { RoutineViewModelMapper } from '../viewmodels/routine.viewmodel';

export const fetchRoutines = createAsyncThunk(
  'routines/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const domainEntities = await routineContainer.getRoutines.execute();
      return domainEntities.map(RoutineViewModelMapper.toViewModel);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar rutinas';
      return rejectWithValue(message);
    }
  }
);
```

:::tip[`rejectWithValue` en una frase]
`rejectWithValue` permite capturar excepciones en el bloque `catch` y retornar un mensaje o código de error de dominio controlado directamente en `action.payload` dentro del estado `rejected`. Si se dejara escapar o relanzar el error, RTK lo serializaría de forma predeterminada como un `SerializedError` genérico en `action.error` (`{ name, message, stack, code }`), dejando `action.payload` como `undefined`.
:::

### `reducers` vs. `extraReducers`

Al definir un slice en Redux Toolkit existe una distinción fundamental entre ambas propiedades:

- **`reducers` (Acciones locales y síncronas)**: Define reducers internos para la feature. Genera automáticamente creadores de acción con el mismo nombre en `slice.actions` (por ejemplo, `clearError()`).
- **`extraReducers` (Acciones externas y asíncronas)**: Permite que el slice reaccione ante acciones creadas fuera de él, como las acciones `pending`, `fulfilled` y `rejected` generadas por `createAsyncThunk`, o acciones de otros slices (por ejemplo, vaciar la lista de rutinas si ocurre `auth/logout`). No genera nuevos action creators; se estructura mediante la notación recomendada `builder.addCase()`.

### Actualización Pesimista vs. Optimista

En las aplicaciones web interactivas existen dos estrategias para sincronizar el estado global con las mutaciones del backend:

1. **Actualización Pesimista (Estrategia de nuestro proyecto)**: Espera la confirmación del servidor. El nuevo elemento se añade a `state.items` únicamente dentro del bloque `builder.addCase(createRoutineMutation.fulfilled, ...)`. Si el servidor rechaza la creación, el estado local jamás se alteró y solo se activa `errorMessage`. Es la estrategia más segura y libre de inconsistencias.
2. **Actualización Optimista**: Inserta el elemento en el estado en cuanto se despacha `pending` con un identificador temporal, brindando feedback instantáneo al usuario. Si la petición falla en `rejected`, es obligatorio programar un mecanismo de reversión (*rollback*) para eliminar el elemento fantasma de la lista.

### Thunks y Clean Architecture

En un frontend diseñado con **Clean Architecture**, el thunk asíncrono **nunca** realiza llamadas `fetch` o invocaciones HTTP directas con URLs cableadas. Su responsabilidad es orquestar la llamada al **Caso de Uso del Dominio** (`GetRoutinesUseCase` o `CreateRoutineUseCase`) inyectado mediante el contenedor de dependencias, transformando posteriormente las entidades de dominio a ViewModels listos para la interfaz.

Explora en la siguiente pieza interactiva cómo se comporta el ciclo de vida de un thunk asíncrono, alternando el interruptor para comparar una respuesta exitosa frente a un fallo de red:

<iframe
  src="/interactive/computacion-3/semana-12/ciclo-thunk/index.html"
  title="Ciclo de vida de un createAsyncThunk con éxito y fallo"
  style={{ width: '100%', height: 740, border: 0 }}
  loading="lazy"
/>

---

## 5. Anatomía de un Slice en Redux Toolkit

El slice es el bloque de construcción primordial en el desarrollo con Redux moderno. Comprender cómo encajan sus propiedades permite estructurar cualquier módulo de la aplicación con limpieza y consistencia:

<iframe
  src="/interactive/computacion-3/semana-12/anatomia-slice/index.html"
  title="Anatomía interactiva de un Slice en Redux Toolkit"
  style={{ width: '100%', height: 740, border: 0 }}
  loading="lazy"
/>

---

## 6. Comparativa: Redux Toolkit vs. Zustand y React Context

En el ecosistema moderno de React coexisten diversas herramientas para gestionar el estado. Ninguna es intrínsecamente superior a las demás en todos los escenarios; la elección depende del tamaño del equipo, la complejidad del dominio y el volumen de actualizaciones reactivas:

<ThemedImage
  sources={{
    light: useBaseUrl('/img/computacion-3/s12-comparativa-herramientas-light.svg'),
    dark: useBaseUrl('/img/computacion-3/s12-comparativa-herramientas-dark.svg'),
  }}
  alt="Comparativa de gestión de estado: React Context vs Zustand vs Redux Toolkit"
/>

| Criterio | React Context | Zustand | Redux Toolkit (RTK) |
| :--- | :--- | :--- | :--- |
| **Propósito principal** | Inyección de dependencias y datos estáticos | Store global minimalista y ágil | Estado global estructurado y altamente predecible |
| **Boilerplate** | Mínimo | Prácticamente nulo | Moderado (estructurado en Slices) |
| **Curva de aprendizaje** | Inmediata | Muy baja | Moderada (requiere asimilar acciones y reductores) |
| **Re-renders** | Masivos (todo el subárbol consumidor) | Quirúrgicos por selector | Quirúrgicos por selector referencial |
| **Soporte de Middleware** | No nativo | Sencillo mediante plugins | Robusto y extensible (Thunk integrado por defecto) |
| **Requiere Provider** | Sí (`<Context.Provider>`) | No obligatorio | Sí (`<Provider store={store}>`) |
| **Herramientas de Depuración** | React DevTools genérico | Middleware para Redux DevTools | **Redux DevTools nativo** con Time Travel |
| **Escalabilidad en equipos** | Baja (fácil desorden) | Media / Alta | **Excelente** (impone una convención uniforme) |

---

## 7. Redux DevTools: Trazabilidad y Time Travel

Una de las mayores fortalezas del flujo unidireccional de Redux es su integración nativa con la extensión **Redux DevTools** en el navegador. Debido a que el estado es inmutable y cada cambio está catalogado en una acción explícita con su respectivo payload, las DevTools permiten inspeccionar en tiempo real la historia completa de sucesos de la aplicación. Es posible examinar la diferencia exacta (*diff*) que cada acción provocó en el árbol de datos, exportar e importar sesiones de depuración y utilizar la funcionalidad de **Time-Travel Debugging**, que permite rebobinar el estado paso a paso hacia el pasado para reproducir errores con absoluta fidelidad.

---

## Cuestionario de Autoevaluación

<Quiz id="compunet3-s12-redux-conceptos-quiz">
  <Question title="¿Cuál de los siguientes enunciados describe correctamente uno de los tres principios fundacionales de Redux?">
    <Option>Cada componente del árbol de React debe instanciar su propio store local independiente.</Option>
    <Option correct>El estado es de solo lectura y la única forma de modificarlo es despachando una acción que describa lo sucedido.</Option>
    <Option>Los reducers son funciones asíncronas encargadas de realizar peticiones HTTP directamente a la API.</Option>
    <Option>Las propiedades (props) de los componentes pueden mutar directamente las claves del árbol de estado global.</Option>
  </Question>
  <Question title="¿Qué problema resuelve la integración de la biblioteca Immer dentro de Redux Toolkit?">
    <Option>Permite almacenar funciones y promesas directamente dentro del árbol de estado global.</Option>
    <Option>Evita tener que conectar la aplicación con el componente Provider de React Redux.</Option>
    <Option correct>Permite escribir código que aparenta mutar el estado directamente (como push o asignaciones) mientras genera internamente copias inmutables seguras.</Option>
    <Option>Sustituye la necesidad de compilar TypeScript convirtiendo los tipos en tiempo de ejecución.</Option>
  </Question>
  <Question title="En la arquitectura de Redux, ¿qué es un Action Creator?">
    <Option>Un componente visual encargado de capturar los eventos del teclado y del ratón.</Option>
    <Option correct>Una función auxiliar que construye y retorna un objeto Action plano con su respectivo type y payload.</Option>
    <Option>Un middleware responsable de interceptar llamadas de red y cancelar peticiones abortadas.</Option>
    <Option>Un decorador especial de TypeScript que enlaza una clase de dominio con el Store.</Option>
  </Question>
  <Question title="¿Por qué los reducers de Redux deben mantenerse como funciones estrictamente puras?">
    <Option>Porque de lo contrario el navegador bloquea la renderización por motivos de seguridad CORS.</Option>
    <Option correct>Para garantizar que el cálculo del nuevo estado sea determinista, reproducible y compatible con Time-Travel Debugging.</Option>
    <Option>Porque React 19 no admite funciones impuras en ninguna parte del código JavaScript.</Option>
    <Option>Para permitir que el compilador de Next.js genere código binario en WebAssembly.</Option>
  </Question>
  <Question title="¿Cuál es la función del hook useSelector en una aplicación de React Redux?">
    <Option>Despachar de forma asíncrona acciones hacia el middleware de Thunks.</Option>
    <Option>Crear una nueva instancia del store global para el componente que lo invoca.</Option>
    <Option correct>Extraer una porción del estado global y suscribir el componente para que solo se re-renderice si dicha porción cambia de referencia.</Option>
    <Option>Reemplazar el uso de Context.Provider en el componente raíz de la aplicación.</Option>
  </Question>
  <Question title="¿Cuál es la diferencia principal entre las propiedades reducers y extraReducers dentro de createSlice?">
    <Option>reducers solo acepta datos booleanos, mientras que extraReducers gestiona arreglos y objetos complejos.</Option>
    <Option correct>reducers define acciones síncronas internas generando action creators automáticos, mientras que extraReducers escucha acciones externas o thunks asíncronos sin generar nuevos creadores.</Option>
    <Option>reducers se ejecuta en el servidor de Next.js, mientras que extraReducers corre en el navegador del cliente.</Option>
    <Option>extraReducers está en desuso y debe reemplazarse por llamadas manuales a useState.</Option>
  </Question>
  <Question title="¿Qué utilidad técnica aporta la función rejectWithValue dentro de un createAsyncThunk?">
    <Option>Cancela inmediatamente la petición HTTP antes de que salga del navegador.</Option>
    <Option correct>Permite devolver un mensaje o estructura de error personalizada en el payload de la acción rejected cuando se captura una excepción.</Option>
    <Option>Fuerza al reductor a reintentar la llamada asíncrona de manera indefinida.</Option>
    <Option>Elimina el slice de la memoria del store si la conexión se interrumpe.</Option>
  </Question>
  <Question title="En el contexto de Clean Architecture en frontend, ¿qué responsabilidad tiene un Async Thunk frente a la red?">
    <Option>Construir manualmente la URL y llamar a fetch directamente con los encabezados de autenticación.</Option>
    <Option correct>Orquestar la invocación al Caso de Uso inyectado en el contenedor de dependencias y mapear las entidades de dominio a ViewModels.</Option>
    <Option>Almacenar tokens de sesión en el almacenamiento local del navegador (LocalStorage).</Option>
    <Option>Renderizar directamente los componentes visuales de error en el DOM.</Option>
  </Question>
  <Question title="¿Por qué la estrategia de actualización pesimista (pessimistic update) implementada en el curso es más segura para iniciar?">
    <Option>Porque requiere escribir el doble de código en los componentes visuales.</Option>
    <Option correct>Porque el nuevo elemento solo se añade al estado en el bloque fulfilled, evitando mostrar datos en la interfaz si el backend rechaza la operación.</Option>
    <Option>Porque asume que el backend nunca fallará y prescinde del bloque catch de errores.</Option>
    <Option>Porque permite ejecutar operaciones asíncronas dentro de los reducers síncronos.</Option>
  </Question>
  <Question title="¿Qué diferencia crucial existe entre React Context y Redux Toolkit respecto a la optimización de re-renders?">
    <Option>React Context solo funciona en componentes de clase, mientras que Redux Toolkit solo funciona con funciones.</Option>
    <Option correct>React Context re-renderiza a todos los componentes consumidores cuando el valor cambia, mientras que Redux Toolkit permite selecciones granulares que solo actualizan los componentes cuyos datos específicos mutaron.</Option>
    <Option>React Context requiere compilar un servidor de Node.js independiente para funcionar.</Option>
    <Option>Redux Toolkit consume más memoria RAM en el servidor de Next.js debido a que no soporta SSR.</Option>
  </Question>
</Quiz>
