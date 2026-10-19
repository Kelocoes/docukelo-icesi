---
sidebar_position: 1
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# El estado en React

En las semanas anteriores aprendimos a estructurar aplicaciones frontend en Next.js siguiendo los principios de **Clean Architecture**: modelamos entidades puras en la Capa de Dominio, aislamos fuentes de datos mediante Repositorios y Datasources en la Capa de Infraestructura, y conectamos Casos de Uso con componentes visuales mediante *Custom Hooks* que actuaron como adaptadores en la Capa de Presentación.

Sin embargo, a medida que una interfaz de usuario crece en número de pantallas, widgets y flujos concurrentes, surge un desafío inevitable: **¿dónde reside la memoria reactiva de la aplicación y cómo viaja entre componentes que no comparten una relación directa de padre e hijo?**

En esta lección analizaremos los fundamentos del estado en React (`useState`), los mecanismos de sincronización local (*State Hoisting*), las consecuencias del *Prop Drilling*, la solución nativa con *Context API* y sus limitaciones técnicas, sentando las bases pedagógicas para la adopción de un gestor de estado global como **Redux Toolkit**.

---

## 1. ¿Qué es el Estado y en qué se Diferencia de las Props?

En React, una aplicación es conceptualmente una función pura que proyecta datos en elementos del DOM:

$$\text{UI} = f(\text{state}, \text{props})$$

A pesar de que tanto las *props* como el *state* provocan actualizaciones visuales al cambiar, representan conceptos arquitectónicos radicalmente opuestos:

| Característica | Props (*Propiedades*) | State (*Estado Reactivo*) |
|:---|:---|:---|
| **Origen** | Vienen del exterior (inyectadas por el componente padre). | Se origina y gestiona internamente dentro del componente. |
| **Mutabilidad** | Estrictamente de solo lectura (*read-only*). Un componente hijo nunca debe alterar sus props. | Mutable únicamente a través de su función despachadora (`setState`). |
| **Propósito** | Configuración, parametrización y paso de canales de comunicación (callbacks). | Memoria reactiva que almacena datos efímeros, interacciones y respuestas de red. |
| **Ubicación en Next.js** | Válidas tanto en Server Components como en Client Components. | **Exclusivo de Client Components** (requiere la directiva `'use client'`). |

:::important[El Estado solo existe en el Cliente]
En el App Router de Next.js, los **React Server Components (RSC)** se ejecutan exclusivamente en el servidor durante la construcción o bajo demanda. Por ende, los hooks como `useState` o `useEffect` solo pueden ejecutarse en componentes marcados con `'use client'`.
:::

### 1.1. Anatomía de `useState` y el Ciclo de Renderizado

El hook `useState` registra una celda de memoria vinculada al nodo del componente en el árbol virtual de React. Cada llamada devuelve una tupla con el valor actual y una función modificadora:

```tsx title="Ejemplo: componente con estado local RoutineCounterBadge" showLineNumbers
'use client';

import { useState } from 'react';

export function RoutineCounterBadge() {
  const [completedCount, setCompletedCount] = useState<number>(0);

  const handleIncrement = () => {
    // Actualización funcional recomendada
    setCompletedCount((prev) => prev + 1);
  };

  return (
    <button onClick={handleIncrement}>
      <span>Completadas:</span>
      <strong>{completedCount}</strong>
    </button>
  );
}
```

### 1.2. Inmutabilidad: Por qué jamás debes mutar Arrays u Objetos

React detecta cambios de estado utilizando una comparación de igualdad superficial por identidad referencial (`Object.is(prev, next)`). 

Si mutas un array u objeto directamente (por ejemplo, ejecutando `routines.push(newRoutine)`), la referencia en memoria sigue siendo la misma. En consecuencia, React concluye que no hubo modificaciones y **descarta por completo el re-renderizado (*bail out*)**.

```tsx title="Ejemplo: mutación directa vs. actualización inmutable" showLineNumbers
// Antipatrón: Mutación directa (Rompe la reactividad)
const handleAddRoutineWrong = (newRoutine: RoutineItemViewModel) => {
  routines.push(newRoutine); // Muta el array en memoria
  setRoutines(routines);     // Object.is(routines, routines) === true -> No re-renderiza
};

// Correcto: Creación de nueva referencia inmutable
const handleAddRoutineCorrect = (newRoutine: RoutineItemViewModel) => {
  setRoutines((prev) => [newRoutine, ...prev]); // Genera un array completamente nuevo
};
```

### 1.3. Actualizaciones Asíncronas y Agrupamiento en Lote (*Batching*)

Las llamadas a `setState` no alteran la variable de forma síncrona en la siguiente línea de ejecución. En su lugar, React encola la petición y agrupa múltiples llamadas dentro del mismo ciclo de eventos (*Automatic Batching*). Por esta razón, cuando una actualización depende del valor inmediatamente anterior, es mandatorio utilizar la **forma funcional**: `setCount((prev) => prev + 1)`.

La siguiente animación interactiva ilustra el ciclo de vida de `useState`, contrastando una actualización inmutable exitosa contra el error silencioso de la mutación directa:

<iframe
  src="/interactive/computacion-3/semana-12/ciclo-usestate/index.html"
  title="Ciclo de Vida de useState y la Regla de Inmutabilidad"
  style={{ width: '100%', height: 700, border: 0 }}
  loading="lazy"
/>

---

## 2. Estado Local vs. Estado Compartido

Cuando construimos una vista atómica, el estado local satisface todas las necesidades. Por ejemplo, el campo de texto de un buscador o el estado abierto/cerrado de un diálogo modal son datos que a ningún otro componente del sistema le interesa conocer.

Sin embargo, consideremos el dominio de rutinas de gimnasio de nuestra aplicación:

1. `RoutineForm`: formulario donde el usuario escribe el nombre de la rutina, el objetivo y pulsa "Guardar".
2. `RoutineList`: cuadrícula que renderiza las tarjetas de rutinas existentes.
3. `RoutineCounter`: distintivo ubicado en la barra de navegación o cabecera que muestra cuántas rutinas tiene activas el atleta.

```tsx title="Ejemplo: estado aislado entre componentes hermanos" showLineNumbers
// RoutineForm crea la rutina internamente
export function RoutineForm() {
  const [routines, setRoutines] = useState<RoutineItemViewModel[]>([]);
  // ... ¿Cómo se entera RoutineList de que se agregó una rutina aquí?
}

// RoutineList vive en otro archivo y no tiene acceso a setRoutines
export function RoutineList() {
  // Estado completamente desacoplado y ciego
  return <div>{/* Lista vacía o desincronizada */}</div>;
}
```

Si `RoutineForm` guarda la lista de rutinas en su propio estado local con `useState`, esa información queda atrapada en su subárbol. `RoutineList` y `RoutineCounter` son componentes hermanos que no tienen acceso físico a las variables de `RoutineForm`.

En React, el flujo de datos es **estrictamente unidireccional y descendente**. No existe una vía directa para enviar datos horizontalmente entre componentes hermanos sin un intermediario común.

---

## 3. Elevación del Estado (*State Hoisting / Lifting State Up*)

La solución natural propuesta por la arquitectura de React ante el problema de hermanos desconectados es **elevar el estado (*Lifting State Up*)**: trasladar la variable reactiva y su función modificadora al ancestro común más cercano a todos los componentes que requieren dicho dato.

Al situar el estado en la página contenedora (`RoutinesCleanPage`), esta asume la responsabilidad de almacenar la memoria reactiva, distribuir las variables por medio de *props* hacia abajo (`RoutineList`, `RoutineCounter`) y recibir notificaciones de eventos mediante *callbacks* hacia arriba (`RoutineForm`):

```tsx title="Ejemplo: state hoisting en la página de rutinas" showLineNumbers
'use client';

import { useState } from 'react';
import { RoutineItemViewModel } from '@/src/features/routines/presentation/viewmodels/routine.viewmodel';
import { RoutineForm } from '@/src/features/routines/presentation/components/RoutineForm';
import { RoutineCard } from '@/src/features/routines/presentation/components/RoutineCard';

export default function RoutinesCleanPage() {
  const [routines, setRoutines] = useState<RoutineItemViewModel[]>([]);

  const handleCreateRoutine = (newRoutine: RoutineItemViewModel) => {
    setRoutines((prev) => [newRoutine, ...prev]);
  };

  return (
    <main>
      <header>
        <h1>Mis Rutinas</h1>
        <span>Total: {routines.length}</span>
      </header>

      {/* Se pasa callback al formulario */}
      <RoutineForm onSubmit={handleCreateRoutine} />

      {/* Se pasa la colección al listado */}
      <section>
        {routines.map((routine) => (
          <RoutineCard key={routine.id} routine={routine} />
        ))}
      </section>
    </main>
  );
}
```

### Ventajas y Costo del State Hoisting

- **Ventajas**: Mantiene la predictibilidad del flujo unidireccional. La lógica se mantiene en TypeScript y React estándar sin librerías externas.
- **Costo**: El componente ancestro comienza a acumular estados heterogéneos y funciones manejadoras, convirtiéndose en un cuello de botella (*Fat Component*). Además, cada actualización del estado en el ancestro provocará la reevaluación de todo su subárbol de renderizado.

---

## 4. El Problema del *Prop Drilling*

El *State Hoisting* funciona de maravilla cuando los componentes que comparten el estado se encuentran a uno o dos niveles de profundidad del ancestro común. Sin embargo, en aplicaciones empresariales reales, las jerarquías de componentes rara vez son tan planas.

Imaginemos que el contador de rutinas no vive directamente en la cabecera de la página, sino en un widget dentro de la barra lateral de navegación (`SidebarNavigation`), la cual a su vez está contenida dentro de una plantilla estructural (`DashboardLayout`):

$$\text{RoutinesPage} \longrightarrow \text{DashboardLayout} \longrightarrow \text{SidebarNavigation} \longrightarrow \text{RoutineCounter}$$

```tsx title="Ejemplo: prop drilling a través de la jerarquía" showLineNumbers
// 1. Ancestro común: posee el dato
export function RoutinesPage() {
  const [routines] = useState<RoutineItemViewModel[]>([]);
  return <DashboardLayout totalRoutines={routines.length} />;
}

// 2. Intermedio 1: NO usa totalRoutines, solo lo transporta
export function DashboardLayout({ totalRoutines }: { totalRoutines: number }) {
  return (
    <div>
      <SidebarNavigation totalRoutines={totalRoutines} />
      <main>{/* contenido */}</main>
    </div>
  );
}

// 3. Intermedio 2: TAMPOCO usa totalRoutines, solo lo transporta
export function SidebarNavigation({ totalRoutines }: { totalRoutines: number }) {
  return (
    <aside>
      <RoutineCounter count={totalRoutines} />
    </aside>
  );
}

// 4. Consumidor final: Por fin usa el dato
export function RoutineCounter({ count }: { count: number }) {
  return <span>{count}</span>;
}
```

Este fenómeno se denomina **Prop Drilling** (perforación de propiedades): el paso forzado de datos y funciones a través de múltiples capas de componentes intermedios que no tienen ningún interés funcional en ellos, únicamente para abastecer a un descendiente lejano.

### Consecuencias Técnicas del Prop Drilling

1. **Acoplamiento Artificial**: Componentes de maquetación pura como `DashboardLayout` se vuelven dependientes del dominio de rutinas. No se pueden reutilizar en otras páginas sin arrastrar contratos de props innecesarios.
2. **Fragilidad ante Refactorizaciones**: Renombrar o cambiar el tipo de una prop exige modificar la firma de todos los componentes intermedios de la cadena.
3. **Re-renders Innecesarios**: Cada vez que el total de rutinas cambia, `DashboardLayout`, `SidebarNavigation` y todos sus hijos son re-evaluados por React, degradando el rendimiento de interfaces complejas.
4. **Contaminación del Autocompletado**: Los desarrolladores ven docenas de propiedades en componentes contenedores que solo actúan como tuberías pasivas.

---

## 5. Context API como Primera Solución y sus Límites

React ofrece de forma nativa la **Context API** (`createContext`, `useContext`, `Provider`) para resolver el problema del transporte transversal sin recurrir a dependencias externas de npm.

Context establece una especie de "agujero de gusano" en el árbol de componentes: un componente superior provee un valor y cualquier descendiente puede consumirlo directamente sin pedir permiso a los intermediarios.

```tsx title="Ejemplo: creación de RoutinesContext y Provider" showLineNumbers
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useRoutines } from '../hooks/use-routines';
import { RoutineItemViewModel } from '../viewmodels/routine.viewmodel';
import { CreateRoutineParams } from '../../domain/repositories/routine.repository';

interface RoutinesContextType {
  routines: RoutineItemViewModel[];
  isLoading: boolean;
  errorMessage: string | null;
  createRoutine: (params: CreateRoutineParams) => Promise<boolean>;
  reload: () => Promise<void>;
}

const RoutinesContext = createContext<RoutinesContextType | null>(null);

export function RoutinesProvider({ children }: { children: ReactNode }) {
  // Una única instancia del hook para todo el subárbol
  const routinesState = useRoutines();

  return (
    <RoutinesContext.Provider value={routinesState}>
      {children}
    </RoutinesContext.Provider>
  );
}

export function useRoutinesContext(): RoutinesContextType {
  const context = useContext(RoutinesContext);
  if (!context) {
    throw new Error('useRoutinesContext debe utilizarse dentro de un RoutinesProvider');
  }
  return context;
}
```

Cualquier componente descendiente ahora puede consumir el contexto limpiamente:

```tsx title="Ejemplo: consumo directo desde el contexto" showLineNumbers
'use client';

import { useRoutinesContext } from '../context/RoutinesContext';

export function RoutineCounter() {
  // Consumo directo sin atravesar Layout ni Sidebar
  const { routines } = useRoutinesContext();
  return <div>Total: {routines.length}</div>;
}
```

### Límites Técnicos de Context API en Aplicaciones Complejas

Aunque Context elimina el *Prop Drilling*, **no fue diseñado como un gestor de estado para datos de alta frecuencia o flujos asíncronos complejos**:

1. **Re-renderizados en Cascada Indiscriminados**: En React Context no existe suscripción granular por defecto. Cuando el `value` del Provider cambia, **todos los componentes que llaman a `useContext(RoutinesContext)` se re-renderizan**, incluso si a un componente solo le interesa `isLoading` y lo que cambió fue un elemento dentro de `routines`.
2. **Lógica de Mutación Dispersa**: Al crecer la aplicación, el Provider se sobrecarga con docenas de funciones manejadoras, o bien la lógica de actualización termina fragmentada y dispersa en múltiples componentes consumidores.
3. **Ausencia de Pipeline para Efectos Asíncronos**: Context no ofrece convenciones formales para manejar estados de carga intermedia, reintentos, cancelaciones ni peticiones concurrentes.
4. **Falta de Trazabilidad y Herramientas de Depuración**: No hay historial de eventos ni capacidad de viajar en el tiempo (*Time Travel Debugging*) para inspeccionar exactamente qué acción modificó una propiedad del estado hace cinco minutos.

---

## 6. Recorrido Completo: el Estado en el Árbol de Componentes

Antes de cerrar, juntemos todo lo anterior mirando la página como lo que realmente es: un **árbol de componentes**. La siguiente pieza recorre, sobre el mismo árbol de rutinas, dónde vive el estado local, cómo se comparte al subirlo al ancestro común (los datos bajan como *props* y los cambios suben como *callbacks*), por qué aparece el *prop drilling* cuando el consumidor está lejos y cómo Context lo evita, con su límite de re-renders.

<iframe
  src="/interactive/computacion-3/semana-12/arbol-estado/index.html"
  title="El estado en el árbol de componentes: lifting state up, prop drilling y Context"
  style={{ width: '100%', height: 760, border: 0 }}
  loading="lazy"
/>

---

## 7. Cierre y Puente: La Necesidad de un Gestor de Estado Global

Para superar las restricciones de Context API sin perder la pureza de nuestra arquitectura, la industria utiliza **Gestores de Estado Global** como **Redux Toolkit** o **Zustand**.

Un gestor de estado global proporciona:
- Un **único Store centralizado** con suscripciones granulares optimizadas (un componente solo re-renderiza si el selector específico que observa cambia de valor).
- **Flujo unidireccional estricto y predecible**: el estado nunca se muta a mano; se despachan acciones formales (`dispatch(action)`).
- **Soporte nativo para asincronía organizada**: *Thunks* que encapsulan la invocación a los Casos de Uso del Dominio.
- **Herramientas de inspección avanzadas**: Redux DevTools para auditar cada mutación en vivo.

### Matriz de Decisión Arquitectónica

Para saber exactamente qué herramienta elegir ante cada escenario, utiliza la siguiente matriz de decisión:

| Nivel de Solución | Herramienta | ¿Cuándo Utilizarlo? | Ejemplo en el Dominio |
|:---|:---|:---|:---|
| **1. Estado Local** | `useState` | Datos efímeros que solo le interesan a un único componente. | Texto en el input del formulario `RoutineForm`, estado de un modal. |
| **2. State Hoisting** | Props + Callbacks | 2 o 3 componentes cercanos que comparten un ancestro común directo. | `RoutineForm` y `RoutineList` dentro de la misma página `RoutinesCleanPage`. |
| **3. Context API** | `createContext` + `useContext` | Datos transversales globales de **baja frecuencia de cambio**. | Tema visual (dark/light), idioma de la aplicación, usuario autenticado en sesión. |
| **4. Store Global** | **Redux Toolkit** | Datos de negocio compartidos entre múltiples rutas, con **alta frecuencia de actualización** o flujos asíncronos complejos. | Colección de rutinas, estado de sincronización con la API, filtros cruzados y métricas del atleta. |

---

## 8. Escalera de Decisión Visual

La siguiente infografía resume gráficamente el camino de escalabilidad del estado en aplicaciones React:

<ThemedImage
  alt="Escalera de decisión: del estado local al store global"
  sources={{
    light: useBaseUrl('/img/computacion-3/s12-escalera-decision-estado-light.svg'),
    dark: useBaseUrl('/img/computacion-3/s12-escalera-decision-estado-dark.svg'),
  }}
/>

---

## Cuestionario de Autoevaluación

<Quiz id="compunet3-s12-estado-react-quiz">
  <Question title="¿Cuál es la principal diferencia entre el estado (state) y las propiedades (props) en React?">
    <Option>Las props son mutables mediante funciones despachadoras mientras que el estado es inmutable.</Option>
    <Option correct>Las props son inyectadas por el componente padre y de solo lectura; el estado es memoria interna gestionada por el propio componente.</Option>
    <Option>El estado puede utilizarse libremente en Server Components y las props solo en Client Components.</Option>
    <Option>Las props provocan re-renderizados pero los cambios de estado no alteran el DOM.</Option>
  </Question>
  <Question title="¿Por qué mutar un array directamente con array.push() y luego pasarlo a setState no actualiza la vista?">
    <Option>Porque React bloquea la ejecución de métodos del prototipo Array en tiempo de compilación.</Option>
    <Option correct>Porque React compara la referencia en memoria con Object.is; al ser la misma referencia del array mutado, asume que nada cambió.</Option>
    <Option>Porque Next.js exige que todos los arrays se declaren como tuplas inmutables en TypeScript.</Option>
    <Option>Porque el Virtual DOM solo acepta operaciones de inserción realizadas con métodos HTTP POST.</Option>
  </Question>
  <Question title="¿En qué consiste el patrón de elevación de estado (Lifting State Up)?">
    <Option>En almacenar todas las variables de la aplicación en el almacenamiento local (localStorage) del navegador.</Option>
    <Option>En convertir todos los Client Components en Server Components para mejorar el rendimiento.</Option>
    <Option correct>En mover el estado reactivo y sus modificadores al ancestro común más cercano para distribuirlo hacia los componentes que lo necesitan.</Option>
    <Option>En reemplazar el hook useState por variables globales declaradas fuera de las funciones de React.</Option>
  </Question>
  <Question title="¿Qué problema arquitectónico describe el término 'Prop Drilling'?">
    <Option>La pérdida de tipos estrictos en TypeScript al pasar datos a través de peticiones fetch.</Option>
    <Option correct>La necesidad de transferir props a través de múltiples componentes intermedios que no las utilizan, solo para abastecer a un componente profundo.</Option>
    <Option>El error generado cuando un componente hijo intenta modificar directamente las props de su padre.</Option>
    <Option>La duplicación de código CSS al aplicar clases utilitarias de Tailwind en múltiples botones.</Option>
  </Question>
  <Question title="¿Cuál es la principal desventaja de rendimiento al utilizar Context API para datos de alta frecuencia de cambio?">
    <Option>Que Context API solo puede almacenar valores primitivos de tipo string o number.</Option>
    <Option correct>Que cada actualización en el Provider provoca el re-renderizado de todos los componentes suscritos, sin permitir selectores atómicos por defecto.</Option>
    <Option>Que Context API no es compatible con componentes que lleven la directiva 'use client'.</Option>
    <Option>Que el navegador cancela las peticiones asíncronas si se ejecutan dentro del cuerpo de un Provider.</Option>
  </Question>
  <Question title="¿Para qué escenario es más adecuada la Context API nativa de React según la matriz de decisión?">
    <Option>Para almacenar grandes listados de datos con miles de mutaciones por segundo.</Option>
    <Option correct>Para datos transversales de baja frecuencia de cambio, tales como el tema visual de la interfaz o el idioma del usuario.</Option>
    <Option>Para gestionar variables temporales de un formulario de un único paso.</Option>
    <Option>Para reemplazar las interfaces de los Repositorios en la Capa de Dominio.</Option>
  </Question>
  <Question title="¿Qué ventaja fundamental aporta un Store Global (como Redux Toolkit) frente a un Custom Hook tradicional?">
    <Option>Permite prescindir por completo de TypeScript en el proyecto de Next.js.</Option>
    <Option correct>Centraliza el estado en una única fuente de verdad en memoria, accesible por múltiples rutas y componentes con suscripciones granulares optimizadas.</Option>
    <Option>Hace que los componentes de React se ejecuten directamente en el servidor sin pasar por el navegador.</Option>
    <Option>Elimina la necesidad de escribir Casos de Uso y Entidades en Clean Architecture.</Option>
  </Question>
</Quiz>
