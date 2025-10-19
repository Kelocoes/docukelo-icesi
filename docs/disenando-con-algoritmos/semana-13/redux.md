---
sidebar_position: 1
---

# Redux y Flux — introducción y guía práctica

## Introducción — el problema inicial que enfrentaba React

Cuando React se popularizó ofrecía composición por componentes y renderizado reactivo: al cambiar props o state, la UI se actualiza de forma eficiente. En aplicaciones medianas o grandes surgieron varias fricciones prácticas:

-   Estado compartido entre muchos componentes (usuario, carrito, preferencias).
-   "Prop drilling": pasar datos y callbacks por capas intermedias que no los usan.
-   Actualizaciones inconsistentes y condiciones de carrera si varias unidades gestionan el mismo dato.
-   Difícil trazabilidad: cualquiera puede llamar setState o mutar datos y no queda claro quién cambió qué.
-   Falta de convención global para flujo de datos → soluciones ad-hoc y difícil mantenimiento.

Estas limitaciones motivaron patrones que buscan previsibilidad, un único punto de verdad y facilidad para depurar.

## Flux: idea central y componentes

Flux es una arquitectura con flujo unidireccional. Elementos conceptuales:

-   **Actions**: objetos que describen qué ocurrió (ej. `{ type: 'ADD_TODO', payload: {...} }`).
-   **Dispatcher**: canal que recibe acciones y las distribuye.
-   **Stores**: contienen parte del estado y la lógica para actualizarlo.
-   **Views** (componentes): escuchan cambios en los stores y disparan actions.

Flujo simplificado:

<img src="/img/flux.png" alt="Flujo unidireccional en Flux" />

Beneficios:

-   Evita actualizaciones caóticas (flujo predecible).
-   Separa responsabilidades (presentación vs estado).
-   Mejora trazabilidad y reduce prop drilling.

Limitaciones:

-   Multiples stores y dispatcher introducen coordinación y boilerplate.
-   Aún puede faltar una única fuente de verdad clara.

## Redux: evolución práctica de Flux

Redux formaliza y simplifica Flux con tres principios:

1. **Single source of truth**: un único árbol de estado en un store.
2. **El estado es de solo lectura**: solo cambia mediante actions.
3. **Cambios realizados por reducers puros**: `(state, action) => newState`.

Componentes:

-   **Store** único con `getState()`, `dispatch(action)`, `subscribe(listener)`.
-   **Actions**: objetos planos `{ type, payload }`.
-   **Reducers**: funciones puras que retornan nuevo estado.
-   **Middleware**: capas opcionales entre dispatch y reducers para side-effects.
-   **Selectores**: funciones para leer partes del estado (posible memoización).

Ejemplo simple:

```javascript
// action
{ type: 'INCREMENT' }

// reducer
function counter(state = { count: 0 }, action) {
    switch (action.type) {
        case 'INCREMENT': 
            return { ...state, count: state.count + 1 };
        default: 
            return state;
    }
}
```

¿Por qué mejora sobre Flux?

-   Un único store evita dispersión del estado.
-   Reducers puros garantizan previsibilidad y testabilidad.
-   Permite time-travel/debugging por acciones serializables e inmutabilidad.
-   Ecosistema maduro (DevTools, middleware, RTK).

## Single Source of Truth (SSOT) — explicación y beneficios

SSOT: todo el estado de la app reside en un único objeto/árbol.

Beneficios concretos:

-   **Consistencia**: una sola referencia canónica.
-   **Sincronización**: todos consumen la misma vista tras actualizaciones.
-   **Depuración/auditoría**: registrar acciones y estado facilita reproducir bugs.
-   **Persistencia/SSR**: serializar y restaurar estado es directo.
-   **Undo/Redo** y reproducibilidad.

Riesgos:

-   Store muy grande si no se normaliza. Mantener solo lo esencial.
-   Posible over-engineering en apps pequeñas.

## Cómo Redux/Flux solucionan los problemas iniciales

-   **Prop drilling**: componentes se suscriben al store (connect/useSelector) en lugar de pasar props.
-   **Inconsistencias**: acciones y reducers puros dan cambios determinísticos.
-   **Debugging**: historial de acciones y estado anterior/posterior facilita tracing.
-   **Reglas claras**: solo las actions pueden modificar el estado.
-   **Testabilidad**: reducers y selectores son fácilmente testeables.

## Patrones prácticos y buenas prácticas

-   Normalizar el estado (byId + allIds) para evitar duplicación.
-   No guardar datos derivados; usar selectores o memoización.
-   Mantener UI local en el componente (modales, inputs efímeros).
-   Usar selectors (reselect) para evitar renders innecesarios.
-   Favorecer inmutabilidad (spread, Object.assign o immer).
-   Separar lógica asíncrona en middleware (thunks, sagas).
-   Dividir reducers con combineReducers en slices.
-   Usar TypeScript para seguridad de tipos en proyectos grandes.


## Rendimiento y optimizaciones

-   Conectar componentes solo a las partes del estado que necesitan.
-   Usar PureComponent / React.memo y comparar por referencia.
-   Normalizar datos y acceder por id.
-   Agrupar múltiples cambios en una sola action cuando corresponda.

## Alternativas y evolución del ecosistema

-   **Context API + hooks** (useReducer/useContext): buena para casos específicos/medianos.
-   **Redux Toolkit (RTK)**: reduce boilerplate, incluye createSlice y usa immer.
-   **Librerías modernas**: MobX, Zustand, Jotai — cada una con trade-offs.
-   **Server state managers**: React Query, SWR — orientados a cache de servidor y suelen convivir con Redux.

## ¿Cuándo usar Redux?

Úsalo si:

-   Mucho estado compartido entre componentes.
-   Necesitas debugging avanzado, time-travel o serialización.
-   Requieres predictibilidad y testabilidad del estado.

Evítalo si:

-   La app es pequeña o el estado es mayoritariamente local.
-   Prefieres soluciones más ligeras para casos puntuales.