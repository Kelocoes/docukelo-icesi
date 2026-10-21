---
sidebar_position: 5
description: "Conecta el dominio con la interfaz usando inyección de dependencias, custom hooks como presenters y la pantalla anfitriona en Next.js."
---

# Inyección de Dependencias, Presenters y Next.js

Habiendo diseñado la Capa de Dominio y la Capa de Infraestructura, nos enfrentamos a la pregunta final: **¿cómo conectamos todo esto con los componentes visuales de React en Next.js sin volver a ensuciar la interfaz con llamadas directas a red?**

En esta lección cerraremos el ciclo construyendo:
1. Un contenedor de **Inyección de Dependencias (DI)** funcional en TypeScript (*Composition Root*).
2. Un **Custom Hook** de React (`useExercises`) que asume el rol de *Presenter/Controller* con estado local (`useState`), preparando el terreno para futuros gestores globales.
3. Componentes visuales desacoplados en el **App Router** de Next.js.

---

## 1. Inyección de Dependencias: El Composition Root

En lugar de instalar librerías pesadas de inyección de dependencias con decoradores experimentales (`reflect-metadata`), en TypeScript moderno podemos construir un **Composition Root** funcional, limpio y fuertemente tipado:

![Inyección de Dependencias y Composition Root en Frontend](/img/computacion-3/clean-arch-dependency-injection.svg)

```typescript title="src/features/exercises/di/exercise.container.ts" showLineNumbers
import { ExerciseMockDatasource } from '../infrastructure/datasources/exercise-mock-datasource';
import { ExerciseApiDatasource } from '../infrastructure/datasources/exercise-api-datasource';
import { ExerciseRepositoryImpl } from '../infrastructure/repositories/exercise.repository.impl';
import { GetExercisesUseCase } from '../domain/usecases/get-exercises.usecase';
import { CreateExerciseUseCase } from '../domain/usecases/create-exercise.usecase';

// 1. Selector de Datasource según variable de entorno
const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || process.env.NODE_ENV === 'development';

const datasource = isMock 
  ? new ExerciseMockDatasource() 
  : new ExerciseApiDatasource('http://localhost:3000/api');

// 2. Instanciación del repositorio inyectando la fuente física
const exerciseRepository = new ExerciseRepositoryImpl(datasource);

// 3. Exportación de Casos de Uso listos para ser consumidos por la UI
export const exerciseContainer = {
  getExercises: new GetExercisesUseCase(exerciseRepository),
  createExercise: new CreateExerciseUseCase(exerciseRepository),
};

export type ExerciseContainer = typeof exerciseContainer;
```

:::tip[El poder del Composition Root]
Para cambiar de datos simulados (*Mock*) a la API real en producción, basta con alternar una variable de entorno (`NEXT_PUBLIC_USE_MOCK=false`). El resto de la aplicación ni siquiera sabe qué origen de datos está activo.
:::

---

## 2. Capa de Presentación: El Custom Hook como Presenter

El Custom Hook actúa como el **Presenter** o **ViewModel**: orquesta la ejecución de los Casos de Uso y mantiene el estado reactivo local que alimenta a los componentes visuales de React.

:::important[¿Por qué no usamos Redux todavía en esta semana?]
El objetivo pedagógico de esta semana es dominar **Clean Architecture**. Si introdujéramos Redux ahora, los estudiantes confundirían la separación arquitectónica con la complejidad de *actions*, *reducers* y *stores*.
Al resolver la UI con estado local (`useState`), los estudiantes comprenderán que el Dominio es 100% independiente de cómo se gestione el estado en React. Más adelante, cuando el estado deba compartirse entre rutas distantes, la adopción de Redux o Zustand será una decisión natural que **no tocará ni una sola línea del Dominio**.
:::

```typescript title="src/features/exercises/presentation/hooks/use-exercises.ts" showLineNumbers
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Exercise } from '../../domain/entities/exercise';
import { CreateExerciseParams } from '../../domain/repositories/exercise.repository';
import { exerciseContainer } from '../../di/exercise.container';

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Consulta inicial de ejercicios
  const loadExercises = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await exerciseContainer.getExercises.execute();
      setExercises(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error desconocido al cargar ejercicios';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  // Acción para crear un nuevo ejercicio
  const createExercise = async (params: CreateExerciseParams): Promise<boolean> => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const newExercise = await exerciseContainer.createExercise.execute(params);
      
      // Actualización reactiva local e inmutable
      setExercises((prev) => [...prev, newExercise]);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'No se pudo guardar el ejercicio';
      setErrorMessage(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    exercises,
    isLoading,
    errorMessage,
    reload: loadExercises,
    createExercise,
  };
}
```

---

## 3. Componentes Visuales Desacoplados

Con el Hook protegiendo la interacción, los componentes de interfaz de usuario son **puros y declarativos**: reciben propiedades (*props*) y renderizan JSX con Tailwind CSS.

### 3.1. Tarjeta Individual de Ejercicio
```tsx title="src/features/exercises/presentation/components/ExerciseCard.tsx" showLineNumbers
import { Exercise } from '../../domain/entities/exercise';

interface ExerciseCardProps {
  exercise: Exercise;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const difficultyColors = {
    BEGINNER: 'bg-green-100 text-green-800 border-green-300',
    INTERMEDIATE: 'bg-amber-100 text-amber-800 border-amber-300',
    ADVANCED: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-slate-900">{exercise.name}</h3>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${difficultyColors[exercise.difficulty]}`}>
          {exercise.difficulty}
        </span>
      </div>
      <p className="text-sm text-slate-600 mb-4">{exercise.description}</p>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-semibold text-blue-600 uppercase tracking-wide">
          {exercise.muscleGroup}
        </span>
        <span>{exercise.createdAt.toLocaleDateString()}</span>
      </div>
    </div>
  );
}
```

### 3.2. Formulario de Captura de Ejercicio
```tsx title="src/features/exercises/presentation/components/ExerciseForm.tsx" showLineNumbers
'use client';

import { useState } from 'react';
import { MuscleGroup, Difficulty } from '../../domain/entities/exercise';
import { CreateExerciseParams } from '../../domain/repositories/exercise.repository';

interface ExerciseFormProps {
  onSubmit: (params: CreateExerciseParams) => Promise<boolean>;
  isLoading: boolean;
}

export function ExerciseForm({ onSubmit, isLoading }: ExerciseFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('CHEST');
  const [difficulty, setDifficulty] = useState<Difficulty>('BEGINNER');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit({ name, description, muscleGroup, difficulty });
    if (success) {
      setName('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-slate-50 border border-slate-200 rounded-xl mb-8 space-y-4">
      <h2 className="text-base font-bold text-slate-800">Registrar Nuevo Ejercicio</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nombre</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Press Militar con Barra"
            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Grupo Muscular</label>
          <select
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value as MuscleGroup)}
            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
          >
            <option value="CHEST">Pecho (Chest)</option>
            <option value="BACK">Espalda (Back)</option>
            <option value="LEGS">Piernas (Legs)</option>
            <option value="SHOULDERS">Hombros (Shoulders)</option>
            <option value="ARMS">Brazos (Arms)</option>
            <option value="CORE">Abdomen (Core)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Descripción</label>
        <textarea
          required
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Instrucciones biomecánicas y notas del ejercicio..."
          className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm rounded-lg transition-colors"
      >
        {isLoading ? 'Guardando...' : 'Crear Ejercicio'}
      </button>
    </form>
  );
}
```

---

## 4. La Pantalla Anfitriona en Next.js (App Router)

Observa cómo la página de Next.js se reduce a **menos de 35 líneas** claras y declarativas, actuando simplemente como el ensamblador visual:

```tsx title="src/app/exercises/page.tsx" showLineNumbers
'use client';

import { useExercises } from '@/features/exercises/presentation/hooks/use-exercises';
import { ExerciseCard } from '@/features/exercises/presentation/components/ExerciseCard';
import { ExerciseForm } from '@/features/exercises/presentation/components/ExerciseForm';

export default function ExercisesPage() {
  const { exercises, isLoading, errorMessage, createExercise } = useExercises();

  return (
    <main className="max-w-4xl mx-auto p-6 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Catálogo de Ejercicios</h1>
        <p className="text-sm text-slate-500 mt-1">Gestión modular implementada con Clean Architecture en Next.js</p>
      </header>

      {errorMessage && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {errorMessage}
        </div>
      )}

      <ExerciseForm onSubmit={createExercise} isLoading={isLoading} />

      {isLoading && exercises.length === 0 ? (
        <div className="text-center py-12 text-slate-400">Cargando ejercicios...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exercises.map((item) => (
            <ExerciseCard key={item.id} exercise={item} />
          ))}
        </div>
      )}
    </main>
  );
}
```

---

## 5. Tubería Completa de Ejecución

El siguiente diagrama resume el camino exacto que recorren los datos cuando el usuario completa y envía el formulario:

![Tubería de Ejecución: Del Evento UI al Backend NestJS](/img/computacion-3/clean-arch-data-flow-pipeline.svg)

---

## 6. Conclusiones y Puente Hacia el Futuro

Al finalizar esta semana, has transformado un componente monolítico y propenso a errores en una **arquitectura por capas profesional**:

1. **Desacoplamiento total**: El dominio no conoce a Next.js ni a React.
2. **Facilidad de testeo**: Los casos de uso y los mappers se prueban con Jest sin necesidad de levantar el navegador.
3. **Sustitución transparente**: Podemos alternar entre un Mock en memoria y una API en NestJS con un solo cambio en el contenedor de dependencias.
4. **Preparados para Redux**: Cuando en semanas posteriores la aplicación crezca y necesitemos compartir el estado de los ejercicios entre múltiples pantallas, el cambio se limitará a sustituir `useState` por un *slice* de Redux o un *store* de Zustand, dejando intactas todas las capas de Dominio e Infraestructura.

---

## Cuestionario de Autoevaluación

<Quiz id="compunet3-s11-inyeccion-dependencias-y-conexion-nextjs-quiz">
  <Question title="¿Qué es el 'Composition Root' en una aplicación TypeScript con Clean Architecture?">
    <Option>El componente raíz layout.tsx donde se cargan los estilos globales de CSS.</Option>
    <Option correct>El punto central (exercise.container.ts) donde se configuran y ensamblan las dependencias concretas para entregar los casos de uso listos para usar.</Option>
    <Option>El archivo tsconfig.json donde se configuran las rutas de alias de importación.</Option>
    <Option>Un script de base de datos que ejecuta las migraciones iniciales de tablas.</Option>
  </Question>
  <Question title="¿Cómo se puede alternar entre datos simulados (Mock) y la API real de NestJS en exercise.container.ts?">
    <Option>Reescribiendo manualmente todos los métodos del caso de uso antes de cada despliegue.</Option>
    <Option correct>Evaluando una variable de entorno como NEXT_PUBLIC_USE_MOCK para instanciar el datasource adecuado en una sola línea condicional.</Option>
    <Option>Eliminando la carpeta infrastructure del proyecto en tiempo de compilación.</Option>
    <Option>Creando dos repositorios de Git completamente separados.</Option>
  </Question>
  <Question title="¿Por qué se tomó la decisión pedagógica de NO introducir Redux en esta semana?">
    <Option>Porque Redux es incompatible con TypeScript y no permite tipar acciones de usuario.</Option>
    <Option correct>Para comprender primero Clean Architecture con estado local; introducir Redux ahora confundiría la separación arquitectónica con la complejidad de reducers y stores.</Option>
    <Option>Porque Next.js 14 y 15 prohíben el uso de gestores de estado en Client Components.</Option>
    <Option>Porque las entidades de dominio requieren obligatoriamente usar contexto nativo de React.</Option>
  </Question>
  <Question title="¿Qué rol asume el Custom Hook useExercises dentro de la arquitectura de la aplicación?">
    <Option>Actúa como un Gateway de base de datos que ejecuta sentencias SQL.</Option>
    <Option correct>Asume el rol de Presenter / ViewModel: orquesta la ejecución de los casos de uso y gestiona el estado reactivo local (loading, error, data).</Option>
    <Option>Reemplaza el sistema de ruteo del App Router de Next.js.</Option>
    <Option>Convierte código TypeScript en hojas de estilo compiladas de Tailwind.</Option>
  </Question>
  <Question title="En useExercises, ¿cómo se actualiza la lista de ejercicios tras crear uno nuevo exitosamente?">
    <Option>Recargando toda la ventana del navegador con window.location.reload().</Option>
    <Option correct>Mediante una actualización inmutable del estado local: setExercises((prev) =&gt; [...prev, newExercise]).</Option>
    <Option>Mutando directamente el array previo con prev.push(newExercise).</Option>
    <Option>Escribiendo el nuevo ejercicio directamente en una cookie de sesión.</Option>
  </Question>
  <Question title="¿Cuál es la característica principal de componentes visuales como ExerciseCard y ExerciseForm?">
    <Option>Realizan llamadas fetch directas dentro de manejadores de eventos onClick.</Option>
    <Option correct>Son componentes puros y declarativos: reciben datos y callbacks por props sin conocer clientes de red ni endpoints.</Option>
    <Option>Deben declarar sus propios esquemas de bases de datos internas.</Option>
    <Option>Heredan obligatoriamente de clases abstractas del dominio.</Option>
  </Question>
  <Question title="¿A cuántas líneas aproximadamente se reduce la página anfitriona src/app/exercises/page.tsx al usar Clean Architecture?">
    <Option>A más de 500 líneas debido a la gran cantidad de código de configuración.</Option>
    <Option correct>A menos de 35 líneas declarativas, actuando simplemente como ensamblador visual entre el hook y los componentes.</Option>
    <Option>A un solo archivo binario sin sintaxis JSX visible.</Option>
    <Option>A un bloque de código estático sin interactividad en el cliente.</Option>
  </Question>
  <Question title="En la tubería completa de ejecución, ¿qué ocurre en el camino de retorno cuando la API responde con un código 201 Created?">
    <Option>El navegador redirige forzosamente a la página de inicio de sesión.</Option>
    <Option correct>El JSON crudo pasa por ExerciseMapper.toDomain(), se retorna como Entidad pura al caso de uso, y el hook actualiza el estado provocando un re-render.</Option>
    <Option>Se destruye la instancia del Composition Root para liberar memoria RAM.</Option>
    <Option>El DOM de la página se limpia por completo eliminando los componentes hijos.</Option>
  </Question>
  <Question title="Cuando en semanas futuras se decida incorporar un gestor de estado global (como Redux o Zustand), ¿qué capas se verán modificadas?">
    <Option>Toda la capa de Dominio (entidades y casos de uso) deberá reescribirse.</Option>
    <Option>Se deberán cambiar los contratos de repositorio y las interfaces de los datasources.</Option>
    <Option correct>Únicamente la capa de presentación (el Custom Hook de React), dejando intactas las capas de Dominio e Infraestructura.</Option>
    <Option>Se deberá migrar el backend NestJS a una arquitectura de microservicios.</Option>
  </Question>
  <Question title="¿Cuál es la principal ventaja de desacoplar los componentes visuales de las llamadas a red?">
    <Option>Permite que el navegador ejecute la aplicación sin necesidad de interpretar JavaScript.</Option>
    <Option correct>Permite rediseñar, mover o reutilizar la interfaz visual sin riesgo de alterar las reglas de negocio o romper la lógica de persistencia.</Option>
    <Option>Evita tener que definir propiedades tipadas (props) en los componentes de React.</Option>
    <Option>Garantiza que la aplicación funcione únicamente en modo fuera de línea.</Option>
  </Question>
</Quiz>

