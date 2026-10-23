---
sidebar_position: 3
description: "Configura Redux Toolkit en un proyecto Next.js con Clean Architecture, ubicando cada pieza en su capa y siguiendo una guía paso a paso."
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Redux en el proyecto

En la lección anterior exploramos los conceptos fundamentales de Redux Toolkit: *stores*, *slices*, *reducers*, *selectors*, *actions* y *thunks*. Sin embargo, el desafío de ingeniería más importante no es memorizar la API de Redux, sino integrarlo dentro de una aplicación empresarial moderna con **Next.js (App Router)** sin degradar la arquitectura por capas que construimos previamente.

En esta guía paso a paso aprenderás a transformar el estado local de nuestra aplicación de rutinas de entrenamiento en un estado global robusto y predecible, **sin alterar una sola línea de código JSX en los componentes visuales**.

---

## 1. Punto de Partida y Objetivo

El proyecto del curso dispone de dos ramas de trabajo en GitHub que ilustran esta transición:

<CardGrid cols={2}>
  <Card 
    title="Punto de Partida: Rama week-11/next-clean" 
    description="Aplicación estructurada con Clean Architecture en frontend, con inversión de dependencias y estado local gestionado mediante useState en el hook useRoutines." 
    link="https://github.com/Kelocoes/compunet3-202602/tree/week-11/next-clean" 
  />
  <Card 
    title="Solución Final: Rama week-12/next-redux" 
    description="Integración completa de Redux Toolkit en Next.js App Router, con fábrica makeStore, StoreProvider para SSR, Thunks asíncronos y hook fachada useRoutines adaptado." 
    link="https://github.com/Kelocoes/compunet3-202602/tree/week-12/next-redux" 
  />
</CardGrid>

### El Objetivo de Diseño
En muchas implementaciones ingenuas, introducir Redux implica llenar los componentes de la interfaz (`RoutineForm`, `RoutineCard`, páginas) con llamadas directas a `useDispatch()`, `useSelector()` y acciones como `dispatch(fetchRoutines())`. Esto acopla la vista a la librería de estado y rompe el principio de sustitución.

Nuestro objetivo en esta guía es **reemplazar el motor de estado interno preservando intacta la API pública del Hook Fachada** (`useRoutines`). Los componentes de React seguirán invocando `createRoutine()` y leyendo `routines`, `isLoading` y `errorMessage` sin enterarse jamás de si por debajo los datos provienen de un `useState`, de Redux Toolkit o de Zustand.

---

## 2. Dónde Vive Redux en la Clean Architecture

Para mantener la integridad arquitectónica, debemos definir con precisión los límites de cada elemento:

1. **Capa de Dominio (`domain`)**: Es 100% agnóstica de React, Next.js y Redux. Contiene las Entidades (`Routine`), las interfaces de repositorio (`RoutineRepository`) y los Casos de Uso (`GetRoutinesUseCase`, `CreateRoutineUseCase`). No importa qué gestor de estado se instale; el Dominio nunca cambia.
2. **Capa de Infraestructura (`infrastructure`)**: Implementa los contratos de acceso a datos (`RoutineRepositoryImpl`) y los datasources (`RoutineMockDatasource`, API HTTP).
3. **Capa de Presentación (`presentation`)**: Aquí reside **Redux Toolkit**. Redux es un gestor de estado reactivo global para la interfaz de usuario.
   - Los **Async Thunks** orquestan la asincronía invocando a los Casos de Uso a través del contenedor de inyección de dependencias (`routineContainer`).
   - El **Slice** almacena **ViewModels** (estructuras de datos planas y serializables preparadas para pintar en pantalla), nunca entidades de clase con métodos de negocio.
   - El **Hook Fachada** (`useRoutines`) actúa como aduana entre los componentes visuales y el Store de Redux.

Explora el recorrido completo de una mutación en el siguiente diagrama interactivo por capas:

<InteractiveFrame
  src="/interactive/computacion-3/semana-12/redux-en-clean-architecture/index.html"
  title="Redux Toolkit en Clean Architecture"
  height={740}
/>

---

## 3. Estructura de Carpetas: Antes y Después

La organización física de los archivos refleja la distinción entre lo que es transversal a la aplicación y lo que le pertenece a una funcionalidad (*feature*) específica.

<ThemedImage
  alt="Estructura de Carpetas con Redux Toolkit en Clean Architecture"
  sources={{
    light: useBaseUrl('/img/computacion-3/s12-carpetas-redux-clean-light.svg'),
    dark: useBaseUrl('/img/computacion-3/s12-carpetas-redux-clean-dark.svg'),
  }}
/>

### ¿Por qué `src/store/` es transversal y el Slice vive en la Feature?
- **`src/store/` (Transversal)**: Contiene la configuración central del Store (`store.ts`), los hooks tipados de conveniencia (`hooks.ts`) y el componente proveedor del contexto (`StoreProvider.tsx`). Estos elementos aplican a toda la aplicación y unifican todos los reducers de los diferentes módulos.
- **`src/features/routines/presentation/store/` (Específico de la Feature)**: El *slice* (`routines.slice.ts`) le pertenece exclusivamente a la funcionalidad de rutinas. Si en el futuro eliminamos el módulo de rutinas, eliminamos su carpeta sin dejar código huérfano en el resto del proyecto.

### Comparativa de Archivos en el Repositorio

```text
compunet3-202602/
├── app/
│   ├── layout.tsx                                          # [MODIFICADO] Envoltorio con <StoreProvider>
│   └── routines-clean/
│       └── page.tsx                                        # [INTACTO] 0 cambios de JSX
├── package.json                                            # [MODIFICADO] Dependencias @reduxjs/toolkit y react-redux
└── src/
    ├── features/
    │   └── routines/
    │       ├── di/
    │       │   └── routine.container.ts                    # [INTACTO] Composition Root agnóstico
    │       ├── domain/                                     # [INTACTO] Entidades y Casos de Uso
    │       ├── infrastructure/                             # [INTACTO] Repositorios y Datasources
    │       └── presentation/
    │           ├── components/                             # [INTACTO] RoutineCard y RoutineForm
    │           ├── hooks/
    │           │   └── use-routines.ts                     # [MODIFICADO] Fachada conectada a Redux
    │           ├── store/
    │           │   └── routines.slice.ts                   # [NUEVO] Slice, Thunks y Reducers
    │           └── viewmodels/
    │               └── routine.viewmodel.ts                # [INTACTO] DTOs de interfaz y Mappers
    └── store/                                              # [NUEVO] Infraestructura global de Redux
        ├── hooks.ts                                        # [NUEVO] useAppDispatch y useAppSelector
        ├── store.ts                                        # [NUEVO] Fábrica makeStore y tipos de TypeScript
        └── StoreProvider.tsx                               # [NUEVO] Provider de cliente ('use client')
```

---

## 4. Guía Paso a Paso de Configuración

<StepByStep>

<Step number="1" title="Instalar Dependencias Oficiales de Redux">
En Next.js requerimos dos librerías: `@reduxjs/toolkit` (la herramienta oficial recomendada para la lógica del store) y `react-redux` (las ataduras para conectar el store a los componentes de React).

Ejecuta el siguiente comando en la raíz de tu proyecto:

```bash
npm install @reduxjs/toolkit react-redux
```

Verifica que tu archivo `package.json` incluya ambas dependencias:

```json title="package.json" showLineNumbers
{
  "dependencies": {
    "@reduxjs/toolkit": "^2.13.0",
    "next": "16.3.8",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "react-redux": "^9.3.0"
  }
}
```
</Step>

<Step number="2" title="Crear el Slice de la Feature (routines.slice.ts)">
El *slice* encapsula la definición del estado de las rutinas, los thunks asíncronos que orquestan las operaciones con Clean Architecture y los reducers que mutan el estado de forma inmutable.

Crea el archivo `src/features/routines/presentation/store/routines.slice.ts`:

```typescript title="src/features/routines/presentation/store/routines.slice.ts" showLineNumbers
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { routineContainer } from '../../di/routine.container';
import { CreateRoutineParams } from '../../domain/repositories/routine.repository';
import { RoutineItemViewModel, RoutineViewModelMapper } from '../viewmodels/routine.viewmodel';

interface RoutinesState {
    items: RoutineItemViewModel[];
    isLoading: boolean;
    isMutating: boolean;
    errorMessage: string | null;
}

const initialState: RoutinesState = {
    items: [],
    isLoading: false,
    isMutating: false,
    errorMessage: null,
};

/**
 * 1. Thunk de Consulta / Lectura (Query)
 * Invoca el caso de uso GetRoutinesUseCase y mapea las entidades de dominio a ViewModels.
 */
export const fetchRoutines = createAsyncThunk(
    'routines/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const domainEntities = await routineContainer.getRoutines.execute();
            return domainEntities.map((entity) => RoutineViewModelMapper.toViewModel(entity));
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error al cargar rutinas';
            return rejectWithValue(message);
        }
    }
);

/**
 * 2. Thunk de Mutación (Mutation)
 * Invoca el caso de uso CreateRoutineUseCase para guardar una nueva rutina y retorna el nuevo ViewModel.
 */
export const createRoutineMutation = createAsyncThunk(
    'routines/create',
    async (params: CreateRoutineParams, { rejectWithValue }) => {
        try {
            const newEntity = await routineContainer.createRoutine.execute(params);
            return RoutineViewModelMapper.toViewModel(newEntity);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'No se pudo crear la rutina';
            return rejectWithValue(message);
        }
    }
);

export const routinesSlice = createSlice({
    name: 'routines',
    initialState,
    reducers: {
        clearError: (state) => {
            state.errorMessage = null;
        },
    },
    extraReducers: (builder) => {
        // --- Ciclo de vida de Lectura (fetchRoutines) ---
        builder
            .addCase(fetchRoutines.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(fetchRoutines.fulfilled, (state, action: PayloadAction<RoutineItemViewModel[]>) => {
                state.isLoading = false;
                state.items = action.payload;
            })
            .addCase(fetchRoutines.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = (action.payload as string) ?? 'Error al obtener rutinas';
            });

        // --- Ciclo de vida de Mutación (createRoutineMutation) ---
        builder
            .addCase(createRoutineMutation.pending, (state) => {
                state.isMutating = true;
                state.errorMessage = null;
            })
            .addCase(createRoutineMutation.fulfilled, (state, action: PayloadAction<RoutineItemViewModel>) => {
                state.isMutating = false;
                state.items.unshift(action.payload); // Actualización en el estado local de Redux
            })
            .addCase(createRoutineMutation.rejected, (state, action) => {
                state.isMutating = false;
                state.errorMessage = (action.payload as string) ?? 'Error al guardar rutina';
            });
    },
});

export const { clearError } = routinesSlice.actions;
export const routinesReducer = routinesSlice.reducer;
```

:::note[Análisis Detallado de Diseño en el Slice]
1. **¿Por qué el estado almacena `RoutineItemViewModel` y no `Routine` (Entidad)?**:  
   Las entidades de dominio pueden contener métodos de negocio, constructores privados o propiedades complejas no serializables. Redux exige estrictamente que el estado sea un **objeto plano de JavaScript serializable**. Además, el `RoutineItemViewModel` ya viene con los textos formateados y los colores calculados listos para ser consumidos de inmediato por la UI.
2. **¿Para qué sirve `rejectWithValue(message)`?**:  
   Si dejamos que el bloque `catch` lance un error convencional con `throw err`, Redux Toolkit captura el error y coloca un objeto genérico serializado en `action.error`. Al utilizar `rejectWithValue(message)`, el mensaje de error personalizado viaja directamente en `action.payload` cuando la acción llega al estado `rejected`, simplificando enormemente su lectura en el reducer.
3. **`reducers` frente a `extraReducers`**:  
   - `reducers`: Define acciones síncronas generadas internamente por el propio slice (como `clearError`), generando automáticamente creadores de acción en `routinesSlice.actions`.
   - `extraReducers`: Escucha acciones generadas externamente al slice, como el ciclo de vida de promesas generado por `createAsyncThunk` (`pending`, `fulfilled`, `rejected`).
4. **Actualización Pesimista frente a Optimista**:  
   El proyecto implementa un **flujo pesimista**: la inserción en el array (`state.items.unshift(action.payload)`) ocurre únicamente en el caso `fulfilled`, cuando el datasource y la base de datos confirmaron que el registro fue guardado. Si quisiéramos un flujo optimista (estilo chat), insertaríamos un elemento temporal en `pending` y revertiríamos la inserción mediante un *rollback* en `rejected`.
:::
</Step>

<Step number="3" title="Crear la Fábrica del Store (store.ts)">
En arquitecturas de servidor como Next.js App Router, la configuración del Store requiere una fábrica (`makeStore`) en lugar de exportar una instancia global (*singleton*).

Crea el archivo `src/store/store.ts`:

```typescript title="src/store/store.ts" showLineNumbers
import { configureStore } from '@reduxjs/toolkit';
import { routinesReducer } from '@/src/features/routines/presentation/store/routines.slice';

/**
 * Fábrica para crear una nueva instancia del Store de Redux.
 * 
 * ¿Por qué una función en vez de una constante global?
 * En Next.js (App Router con Server Components / SSR), una constante global 
 * compartiría el mismo store entre múltiples peticiones de usuarios en el servidor.
 * Con makeStore(), cada contexto obtiene su propia instancia limpia.
 */
export const makeStore = () => {
    return configureStore({
        reducer: {
            routines: routinesReducer,
        },
    });
};

// Tipos inferidos a partir del propio Store
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
```

:::warning[El Peligro del Store Singleton en SSR: Fuga de Datos (State Pollution)]
En SPAs clásicas (Vite, CRA) se suele hacer: `export const store = configureStore(...)`.  
En Next.js con Server Components, el código del módulo vive en el proceso compartido de Node.js en el servidor. Si dos usuarios concurrentes (Usuario A y Usuario B) solicitan páginas al mismo tiempo, **un Store Singleton compartiría la misma memoria RAM entre ambos clientes**. Si el servidor inyectara datos del Usuario A en el store, el Usuario B podría recibir el HTML con la información privada de A.

La solución oficial es definir la fábrica `makeStore = () => configureStore(...)`. Cada ciclo de petición en el servidor o cliente genera su propia instancia aislada.
:::

Compara ambos comportamientos en la siguiente pieza interactiva:

<InteractiveFrame
  src="/interactive/computacion-3/semana-12/makestore-vs-singleton/index.html"
  title="makeStore frente a Singleton en Next.js"
  height={700}
/>
</Step>

<Step number="4" title="Crear los Hooks Tipados (hooks.ts)">
Los hooks nativos de React-Redux (`useDispatch` y `useSelector`) son genéricos y no conocen los tipos de nuestro estado global ni los tipos de los Thunks asíncronos. Para evitar tener que escribir `useSelector((state: RootState) => ...)` en cada archivo, creamos hooks fuertemente tipados.

Crea el archivo `src/store/hooks.ts`:

```typescript title="src/store/hooks.ts" showLineNumbers
import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from 'react-redux';
import type { AppDispatch, AppStore, RootState } from './store';

// Hooks tipados para usar en toda la aplicación en lugar de los hooks genéricos de react-redux (`useDispatch` y `useSelector`).
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;
```

:::tip[Nota sobre Redux Toolkit 2.0+ y .withTypes]
En versiones recientes de Redux Toolkit (v2.0+) y React-Redux (v9.0+), se introdujo el método de conveniencia `.withTypes`:
```typescript title="Guía Paso a Paso de Configuración"
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```
En la rama del curso se utilizó la anotación de tipos explícita tradicional (`TypedUseSelectorHook<RootState>`). Ambos enfoques son técnicamente equivalentes en tiempo de compilación y garantizan autocompletado total e inferencia estricta de tipos.
:::
</Step>

<Step number="5" title="Crear el Proveedor de Cliente (StoreProvider.tsx)">
`react-redux` requiere el Context API de React para propagar el Store a los componentes descendientes. Dado que el Context API solo existe en el navegador (Client Components), debemos encapsular `<Provider>` en un componente con la directiva `'use client'`.

Crea el archivo `src/store/StoreProvider.tsx`:

```tsx title="src/store/StoreProvider.tsx" showLineNumbers
'use client';

import { useState, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';

/**
 * Proveedor de Redux para Next.js App Router.
 * 
 * ¿Por qué 'use client'?
 * Redux utiliza el React Context API internamente, lo cual solo está disponible
 * en Client Components.
 * ¿Por qué useState(makeStore)?
 * Garantiza que la instancia del store se cree exactamente una vez durante el ciclo
 * de vida del cliente y permanezca estable sin reinicializarse en cada render.
 */
export function StoreProvider({ children }: { children: ReactNode }) {
    const [store] = useState<AppStore>(makeStore);

    return <Provider store={store}>{children}</Provider>;
}
```

:::note[Garantía de Instancia Única con useState]
Si hiciéramos `const store = makeStore()` dentro del cuerpo del componente, cada vez que el componente padre re-renderice se crearía un nuevo store de Redux, destruyendo todo el estado acumulado del usuario en la sesión.  
Al pasar la función `makeStore` como argumento perezoso a `useState(makeStore)`, React garantiza que la fábrica solo se invoca en el montaje inicial del cliente y preserva la misma instancia en memoria para siempre.

*(En la documentación oficial de Redux para Next.js también se suele ver el patrón con `useRef<AppStore | null>(null)` y `if (!storeRef.current) storeRef.current = makeStore()`. Ambas alternativas cumplen el mismo propósito pedagógico).*
:::
</Step>

<Step number="6" title="Envolver la Aplicación en app/layout.tsx">
Ahora debemos conectar el `StoreProvider` en el punto de entrada raíz de la aplicación para que todas las páginas y componentes tengan acceso al Store.

Modifica `app/layout.tsx`:

```tsx title="app/layout.tsx" showLineNumbers
import type { Metadata } from "next";
import "./globals.css";
// highlight-next-line
import { StoreProvider } from "@/src/store/StoreProvider";

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                {/* highlight-start */}
                <StoreProvider>
                    {children}
                </StoreProvider>
                {/* highlight-end */}
            </body>
        </html>
    );
}
```

:::important[Arquitectura de Interleaving: El Layout Sigue Siendo Server Component]
Observa un detalle fundamental de la arquitectura de Next.js: **el archivo `app/layout.tsx` NO lleva `'use client'`**.  
Sigue siendo un **Server Component**. `StoreProvider` es una hoja de cliente que recibe a `children` como propiedad.  
Gracias al patrón de **Interleaving** (estudiado en la semana 9), Next.js puede renderizar componentes de servidor dentro de `{children}` y pasarlos ya resueltos a través del proveedor de Redux sin convertir toda la aplicación en una SPA tradicional.
:::
</Step>

<Step number="7" title="Refactorizar el Hook Fachada (use-routines.ts)">
Llegamos al paso crucial: sustituir la implementación basada en `useState` por Redux Toolkit en el Hook Fachada, **manteniendo idéntica la firma de retorno**.

Observa la comparación entre ambas implementaciones:

<Tabs>
  <TabItem value="despues" label="Después (Con Redux Toolkit - week-12)" default>

```typescript title="src/features/routines/presentation/hooks/use-routines.ts" showLineNumbers
'use client';

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { fetchRoutines, createRoutineMutation } from '../store/routines.slice';
import { CreateRoutineParams } from '../../domain/repositories/routine.repository';

/**
 * Hook fachada (Presentation Layer).
 * 
 * Actúa como adaptador entre los componentes de React y el Store de Redux:
 * 1. Oculta los detalles de Redux a los componentes visuales (RoutineForm, RoutineCard).
 * 2. Mantiene exactamente la misma API pública que tenía con useState.
 */
export function useRoutines() {
    const dispatch = useAppDispatch();

    // 1. Lectura del estado global gestionado por Redux
    const routines = useAppSelector((state) => state.routines.items);
    const isLoading = useAppSelector((state) => state.routines.isLoading);
    const isMutating = useAppSelector((state) => state.routines.isMutating);
    const errorMessage = useAppSelector((state) => state.routines.errorMessage);

    // 2. Carga inicial: si el store aún no tiene datos y no está cargando, solicitamos las rutinas
    useEffect(() => {
        if (routines.length === 0 && !isLoading) {
            dispatch(fetchRoutines());
        }
    }, [dispatch, routines.length, isLoading]);

    // 3. Mutación de creación: delega al thunk asíncrono
    const createRoutine = async (params: CreateRoutineParams): Promise<boolean> => {
        const resultAction = await dispatch(createRoutineMutation(params));
        // Devuelve true si la acción culminó en fulfilled (éxito), o false si fue rejected (error)
        return createRoutineMutation.fulfilled.match(resultAction);
    };

    // 4. Recarga manual
    const reload = useCallback(() => {
        dispatch(fetchRoutines());
    }, [dispatch]);

    return {
        routines,
        // La UI considera que está cargando si estamos en consulta inicial o en proceso de guardado
        isLoading: isLoading || isMutating,
        errorMessage,
        reload,
        createRoutine,
    };
}
```

  </TabItem>
  <TabItem value="antes" label="Antes (Con useState - week-11 tras commit 3ff5dda)">

```typescript title="src/features/routines/presentation/hooks/use-routines.ts (Original con useState - week-11/next-clean tras commit 3ff5dda)" showLineNumbers
'use client';

import { useState, useEffect, useCallback } from 'react';
import { routineContainer } from '../../di/routine.container';
import { CreateRoutineParams } from '../../domain/repositories/routine.repository';
import { RoutineItemViewModel, RoutineViewModelMapper } from '../viewmodels/routine.viewmodel';

export function useRoutines() {
const [routines, setRoutines] = useState<RoutineItemViewModel[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(true);
const [errorMessage, setErrorMessage] = useState<string | null>(null);

useEffect(() => {
    let isMounted = true;
    const loadInitialRoutines = async () => {
        try {
            const domainEntities = await routineContainer.getRoutines.execute();
            if (isMounted) {
                const viewModels = domainEntities.map((entity) =>
                    RoutineViewModelMapper.toViewModel(entity)
                );
                setRoutines(viewModels);
            }
        } catch (err: unknown) {
            if (isMounted) {
                setErrorMessage(err instanceof Error ? err.message : 'Error desconocido al cargar rutinas');
            }
        } finally {
            if (isMounted) setIsLoading(false);
        }
    };
    loadInitialRoutines();
    return () => { isMounted = false; };
}, []);

// Recarga manual (disparada por el usuario en week-11/next-clean)
const reload = useCallback(async () => {
    try {
        setIsLoading(true);
        setErrorMessage(null);
        const domainEntities = await routineContainer.getRoutines.execute();
        const viewModels = domainEntities.map((entity) =>
            RoutineViewModelMapper.toViewModel(entity)
        );
        setRoutines(viewModels);
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : 'Error desconocido al recargar rutinas';
        setErrorMessage(message);
    } finally {
        setIsLoading(false);
    }
}, []);

const createRoutine = async (params: CreateRoutineParams): Promise<boolean> => {
    try {
        setIsLoading(true);
        setErrorMessage(null);
        const newEntity = await routineContainer.createRoutine.execute(params);
        const newViewModel = RoutineViewModelMapper.toViewModel(newEntity);
        setRoutines((prev) => [newViewModel, ...prev]);
        return true;
    } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'No se pudo guardar la rutina');
        return false;
    } finally {
        setIsLoading(false);
    }
};

return {
    routines,
    isLoading,
    errorMessage,
    reload,
    createRoutine,
};
}
```

  </TabItem>
</Tabs>

:::tip[Claves de la Refactorización del Hook]
1. **Carga Inicial Condicionada**:  
   `if (routines.length === 0 && !isLoading) dispatch(fetchRoutines());`  
   A diferencia del `useState` original (que forzaba una consulta a red cada vez que el componente se montaba), con Redux los datos persisten en la memoria global. Si el usuario navega a otra pantalla y regresa, `routines.length > 0`, por lo que **no se repite la petición a la API**, obteniendo una navegación instantánea.
2. **Desempaquetado del Thunk con `.fulfilled.match(...)`**:  
   Cuando despachas un thunk con `dispatch(createRoutineMutation(params))`, la promesa que retorna `dispatch` siempre resuelve (incluso si la operación interna falló y se fue por `rejected`). Para determinar si la operación tuvo éxito sin envolver todo en otro `try/catch`, Redux Toolkit proporciona el *type guard* `createRoutineMutation.fulfilled.match(resultAction)`, el cual retorna `true` si la acción fue exitosa o `false` si falló. Esto permite mantener la firma de retorno `Promise<boolean>` esperada por el formulario de la UI.
3. **Estado de Carga Unificado**:  
   `isLoading: isLoading || isMutating`. La vista solo necesita saber si hay una operación en curso para deshabilitar botones o mostrar indicadores de carga (*spinners*).
:::
</Step>

<Step number="8" title="Verificar la Integración y Depurar con Redux DevTools">
Abre la página en tu navegador (`http://localhost:3000/routines-clean`). Comprobarás que los componentes visuales:
- `RoutineCard`: Sigue recibiendo su ViewModel por props y dibuja las tarjetas exactamente igual.
- `RoutineForm`: Sigue invocando `createRoutine(values)` y reiniciando el formulario cuando retorna `true`.
- `RoutinesCleanPage`: Sigue leyendo las rutinas del hook y mapeándolas a componentes.

### Inspección con Redux DevTools
Instala la extensión **Redux DevTools** en Chrome o Firefox. Al abrir las herramientas de desarrollador observarás la secuencia completa de acciones despachadas por el motor:

```text
1. @@INIT                           # Inicialización del Store en el cliente
2. routines/fetchAll/pending        # Disparado al montar useRoutines (isLoading = true)
3. routines/fetchAll/fulfilled      # Llegaron los ViewModels (items = [...], isLoading = false)
4. routines/create/pending          # Usuario pulsó "Guardar rutina" (isMutating = true)
5. routines/create/fulfilled        # Datasource confirmó y se insertó el nuevo elemento
```

Puedes hacer clic en cualquier acción para ver la diferencia de estado (*diff*), inspeccionar el payload exacto o hacer "viaje en el tiempo" (*Time Travel Debugging*) para reproducir errores paso a paso.
</Step>

</StepByStep>

---

## 5. Guía para Aplicarlo en tu Propio Proyecto

Cuando construyas tu proyecto semestral o agregues una **segunda funcionalidad** (por ejemplo, gestión de ejercicios `exercises` o de usuarios `users`), sigue esta lista de comprobación:

1. **Definir los ViewModels de la nueva feature**:  
   Crear los tipos planos serializables en `src/features/<feature>/presentation/viewmodels/`.

2. **Crear el Slice en la Capa de Presentación**:  
   Crear `src/features/<feature>/presentation/store/<feature>.slice.ts`:
   - Definir la interfaz `<Feature>State` almacenando arrays de ViewModels.
   - Crear los Thunks que llamen a los Casos de Uso del container (`<feature>Container.<usecase>.execute()`).
   - Usar `rejectWithValue` en el bloque `catch`.
   - Manejar `pending`, `fulfilled` y `rejected` en `extraReducers`.

3. **Registrar el nuevo Reducer en la Fábrica Global**:  
   Abrir `src/store/store.ts` y añadir la clave correspondiente en `makeStore`:

```typescript title="src/store/store.ts" showLineNumbers
export const makeStore = () => configureStore({
    reducer: {
        routines: routinesReducer,
        exercises: exercisesReducer, // <-- Nuevo módulo registrado
    },
});
```

4. **Construir o Adaptar el Hook Fachada**:  
   Crear `src/features/<feature>/presentation/hooks/use-<feature>.ts`:
   - Leer los datos con `useAppSelector((state) => state.<feature>.items)`.
   - Despachar las intenciones con `useAppDispatch()`.
   - Preservar la API amigable para los componentes visuales.

5. **Conectar la Vista**:  
   Consumir únicamente el Hook Fachada en los componentes JSX. No importar `react-redux` dentro de los componentes visuales.

---

## 6. Errores Comunes al Integrar Redux con Clean Architecture

| Error Común | Causa del Problema | Consecuencia en la Aplicación | Solución Arquitectónica |
| :--- | :--- | :--- | :--- |
| **Olvidar `'use client'` en `StoreProvider.tsx`** | Los Server Components no pueden ejecutar React Context ni hooks de React. | Error de compilación en Next.js: *"createContext only works in Client Components"*. | Declarar la directiva `'use client';` en la primera línea de `StoreProvider.tsx`. |
| **Exportar un Store Singleton en el Servidor** | Declarar `export const store = configureStore(...)` a nivel de módulo en Next.js. | Fuga de datos entre peticiones concurrentes (*Cross-Request State Pollution*). | Usar una función fábrica `export const makeStore = () => configureStore(...)`. |
| **Almacenar Entidades de Clase en el Estado** | Guardar instancias con métodos (ej. `new Routine(...)`) dentro de `state.items`. | Errores de serialización en Redux DevTools y fallos en hidratación SSR. | Guardar siempre **ViewModels planos** generados a través de mappers. |
| **Llamar a `fetch()` directo dentro del Thunk** | Saltarse los Casos de Uso y llamar directamente a endpoints HTTP en el thunk. | Rompe Clean Architecture; duplica lógica de negocio e impide testear el dominio. | El Thunk debe llamar **únicamente** a los casos de uso expuestos por el Composition Root (`routineContainer`). |
| **Usar Redux directamente en los Componentes JSX** | Invocar `useAppDispatch` o `useAppSelector` dentro de `RoutineCard` o `RoutineForm`. | Acopla la interfaz visual a Redux, impidiendo reutilizar componentes o cambiar de gestor de estado. | Consumir siempre el **Hook Fachada** (`useRoutines`), que encapsula a Redux. |
| **Crear el Store sin inicialización perezosa** | Escribir `const store = makeStore()` directamente en el cuerpo de `StoreProvider`. | Cada re-render del layout reinicializa el store, reseteando los datos del usuario. | Utilizar el inicializador perezoso de estado: `const [store] = useState(makeStore)`. |

---

## Cuestionario de Autoevaluación

<Quiz id="compunet3-s12-configuracion-redux-nextjs-quiz">
  <Question title="¿En cuál capa de Clean Architecture se ubica Redux Toolkit y sus Slices?">
    <Option>En la Capa de Dominio, porque define el modelo de datos de la empresa.</Option>
    <Option correct>En la Capa de Presentación, actuando como gestor de estado reactivo global para la interfaz visual.</Option>
    <Option>En la Capa de Infraestructura, porque maneja la memoria y el almacenamiento del cliente.</Option>
    <Option>En una capa externa independiente fuera de la arquitectura de la aplicación.</Option>
  </Question>
  <Question title="¿Por qué es fundamental que la vista consuma useRoutines en lugar de interactuar directamente con useAppDispatch y useAppSelector?">
    <Option>Porque React 19 prohíbe el uso de hooks de Redux en componentes funcionales.</Option>
    <Option correct>Porque useRoutines actúa como Hook Fachada, desacoplando los componentes visuales de la implementación concreta del gestor de estado.</Option>
    <Option>Porque los componentes visuales no pueden compilarse si importan archivos de TypeScript.</Option>
    <Option>Porque useRoutines convierte automáticamente el código JSX en HTML estático.</Option>
  </Question>
  <Question title="¿Qué grave vulnerabilidad ocurre si exportamos un Store Singleton global (const store = configureStore(...)) en Next.js App Router?">
    <Option>El navegador bloquea la descarga de estilos CSS por políticas de CORS.</Option>
    <Option correct>Se produce Cross-Request State Pollution: múltiples usuarios concurrentes en el servidor comparten la misma instancia en memoria, filtrando datos confidenciales.</Option>
    <Option>Next.js desactiva automáticamente TypeScript en el proyecto.</Option>
    <Option>La base de datos relacional entra en un interbloqueo (deadlock) permanente.</Option>
  </Question>
  <Question title="¿Por qué el estado de Redux almacena RoutineItemViewModel[] en lugar de instancias de Routine (Entidad de dominio)?">
    <Option>Porque TypeScript no soporta arrays de entidades en aplicaciones de frontend.</Option>
    <Option correct>Porque Redux exige que el estado sea serializable (objetos planos sin métodos), y el ViewModel ya contiene datos formateados y listos para la UI.</Option>
    <Option>Porque las entidades de dominio ocupan más de 50 megabytes en memoria.</Option>
    <Option>Porque los reducers de Redux solo pueden procesar números y cadenas de texto.</Option>
  </Question>
  <Question title="En un Async Thunk, ¿qué ventaja ofrece retornar rejectWithValue(message) en el bloque catch frente a lanzar throw err?">
    <Option>Permite que la aplicación continúe ejecutándose sin conexión a internet.</Option>
    <Option correct>Garantiza que el mensaje personalizado de error viaje limpiamente en action.payload cuando el thunk resuelve en rejected.</Option>
    <Option>Evita que el navegador registre errores en la consola de depuración.</Option>
    <Option>Convierte automáticamente errores de red 500 en respuestas exitosas 200 OK.</Option>
  </Question>
  <Question title="¿Cuál es la diferencia fundamental entre la propiedad reducers y extraReducers dentro de createSlice?">
    <Option>reducers solo acepta funciones asíncronas, mientras extraReducers solo acepta funciones síncronas.</Option>
    <Option correct>reducers define acciones y reducers internos propios del slice; extraReducers responde a acciones externas o al ciclo de vida de promesas de thunks.</Option>
    <Option>extraReducers está obsoleto en Redux Toolkit y no debe utilizarse en código moderno.</Option>
    <Option>reducers aplica únicamente en el cliente y extraReducers en el servidor.</Option>
  </Question>
  <Question title="En StoreProvider.tsx, ¿por qué se utiliza useState(makeStore) con una función en lugar de const store = makeStore()?">
    <Option>Porque useState es obligatorio para importar librerías de terceros en Next.js.</Option>
    <Option correct>Porque el inicializador perezoso de useState asegura que makeStore() se ejecute exactamente una vez al montar y no se reinicialice en cada re-render.</Option>
    <Option>Porque makeStore retorna una promesa asíncrona que requiere ser resuelta por React.</Option>
    <Option>Para obligar al recolector de basura de JavaScript a eliminar el store cada segundo.</Option>
  </Question>
  <Question title="¿Cómo interactúa app/layout.tsx con StoreProvider preservando el patrón de Interleaving?">
    <Option>Convirtiendo todo el layout.tsx en Client Component mediante la directiva 'use client'.</Option>
    <Option correct>Manteniendo layout.tsx como Server Component y pasando los Server Components hijos en &#123;children&#125; a través del StoreProvider de cliente.</Option>
    <Option>Descargando el store de Redux mediante un web worker en segundo plano.</Option>
    <Option>Ejecutando el StoreProvider exclusivamente dentro de etiquetas iframe aisladas.</Option>
  </Question>
  <Question title="En el hook use-routines.ts refactorizado, ¿qué hace la sentencia createRoutineMutation.fulfilled.match(resultAction)?">
    <Option>Cancela la ejecución de la mutación si el servidor demora más de 5 segundos.</Option>
    <Option correct>Evalúa si la acción del thunk culminó exitosamente (fulfilled), retornando un booleano para cumplir el contrato Promise&lt;boolean&gt; del hook.</Option>
    <Option>Recarga toda la página del navegador para refrescar los datos desde cero.</Option>
    <Option>Transforma el ViewModel en una entidad pura de base de datos SQL.</Option>
  </Question>
  <Question title="En use-routines.ts, ¿qué ventaja pedagógica y de rendimiento tiene la condición if (routines.length === 0 && !isLoading) dispatch(fetchRoutines())?">
    <Option>Obliga a que el usuario cree una rutina antes de poder consultar las existentes.</Option>
    <Option correct>Aprovecha la persistencia global del Store para evitar peticiones redundantes a la API si los datos ya fueron cargados previamente.</Option>
    <Option>Desactiva la sincronización con Redux DevTools para mejorar la velocidad en producción.</Option>
    <Option>Garantiza que la aplicación funcione únicamente en modo offline.</Option>
  </Question>
</Quiz>
