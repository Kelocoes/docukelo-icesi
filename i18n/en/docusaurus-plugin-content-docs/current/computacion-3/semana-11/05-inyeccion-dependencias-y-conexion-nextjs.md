---
sidebar_position: 5
---

# Dependency Injection, Presenters, and Next.js

Having designed the Domain Layer and the Infrastructure Layer, we face the final architectural question: **how do we connect all of this to React visual components in Next.js without polluting the user interface with direct network calls once again?**

In this lesson, we will complete the cycle by constructing:
1. A functional, strongly-typed **Dependency Injection (DI)** container in TypeScript (*Composition Root*).
2. A React **Custom Hook** (`useExercises`) that fulfills the role of *Presenter/Controller* using local state (`useState`), laying the foundation for future global state managers.
3. Decoupled visual components hosted within the Next.js **App Router**.

---

## 1. Dependency Injection: The Composition Root

Rather than installing heavy dependency injection libraries with experimental decorators (`reflect-metadata`), modern TypeScript enables us to construct a functional, clean, and strongly-typed **Composition Root**:

![Dependency Injection and Composition Root in the Frontend](/img/computacion-3/clean-arch-dependency-injection.svg)

```typescript title="src/features/exercises/di/exercise.container.ts" showLineNumbers
import { ExerciseMockDatasource } from '../infrastructure/datasources/exercise-mock-datasource';
import { ExerciseApiDatasource } from '../infrastructure/datasources/exercise-api-datasource';
import { ExerciseRepositoryImpl } from '../infrastructure/repositories/exercise.repository.impl';
import { GetExercisesUseCase } from '../domain/usecases/get-exercises.usecase';
import { CreateExerciseUseCase } from '../domain/usecases/create-exercise.usecase';

// 1. Datasource selection based on environment variable
const isMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || process.env.NODE_ENV === 'development';

const datasource = isMock 
  ? new ExerciseMockDatasource() 
  : new ExerciseApiDatasource('http://localhost:3000/api');

// 2. Repository instantiation injecting physical data source
const exerciseRepository = new ExerciseRepositoryImpl(datasource);

// 3. Export use cases ready to be consumed by the UI
export const exerciseContainer = {
  getExercises: new GetExercisesUseCase(exerciseRepository),
  createExercise: new CreateExerciseUseCase(exerciseRepository),
};

export type ExerciseContainer = typeof exerciseContainer;
```

:::tip[The Power of the Composition Root]
To switch from simulated mock data to the live production API, toggling an environment variable (`NEXT_PUBLIC_USE_MOCK=false`) is all that is required. The rest of the application remains entirely unaware of which datasource is currently active.
:::

---

## 2. Presentation Layer: The Custom Hook as a Presenter

The Custom Hook acts as the **Presenter** or **ViewModel**: it orchestrates the execution of Use Cases and manages the local reactive state that feeds React visual components.

:::important[Why Aren't We Using Redux Yet This Week?]
The primary pedagogical objective of this week is mastering **Clean Architecture**. If Redux were introduced now, students would conflate architectural layer separation with the mechanics of actions, reducers, and stores.
By solving UI requirements with local state (`useState`), students understand that the Domain is 100% independent of how state is managed in React. Later, when state needs to be shared across disparate routes, adopting Redux or Zustand will be a natural step that **does not touch a single line of Domain code**.
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

  // Initial query for exercises
  const loadExercises = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const data = await exerciseContainer.getExercises.execute();
      setExercises(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error while loading exercises';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  // Action to create a new exercise
  const createExercise = async (params: CreateExerciseParams): Promise<boolean> => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const newExercise = await exerciseContainer.createExercise.execute(params);
      
      // Reactive, immutable local update
      setExercises((prev) => [...prev, newExercise]);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not save exercise';
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

## 3. Decoupled Visual Components

With the Hook insulating user interaction, UI components remain **pure and declarative**: they receive properties (*props*) and render JSX with Tailwind CSS.

### 3.1. Individual Exercise Card
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

### 3.2. Exercise Input Form
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
      <h2 className="text-base font-bold text-slate-800">Register New Exercise</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Barbell Overhead Press"
            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Muscle Group</label>
          <select
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value as MuscleGroup)}
            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
          >
            <option value="CHEST">Chest</option>
            <option value="BACK">Back</option>
            <option value="LEGS">Legs</option>
            <option value="SHOULDERS">Shoulders</option>
            <option value="ARMS">Arms</option>
            <option value="CORE">Core</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
        <textarea
          required
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Biomechanical instructions and exercise notes..."
          className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm rounded-lg transition-colors"
      >
        {isLoading ? 'Saving...' : 'Create Exercise'}
      </button>
    </form>
  );
}
```

---

## 4. The Host Page in Next.js (App Router)

Notice how the Next.js page is reduced to **fewer than 35 lines** of clean, declarative code, serving simply as the visual assembler:

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
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Exercise Catalog</h1>
        <p className="text-sm text-slate-500 mt-1">Modular management implemented with Clean Architecture in Next.js</p>
      </header>

      {errorMessage && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {errorMessage}
        </div>
      )}

      <ExerciseForm onSubmit={createExercise} isLoading={isLoading} />

      {isLoading && exercises.length === 0 ? (
        <div className="text-center py-12 text-slate-400">Loading exercises...</div>
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

## 5. End-to-End Execution Pipeline

The diagram below illustrates the exact path data traverses when a user submits the form:

![Execution Pipeline: From UI Event to NestJS Backend](/img/computacion-3/clean-arch-data-flow-pipeline.svg)

---

## 6. Conclusions and the Road Ahead

By the conclusion of this week, you have transformed an error-prone monolithic component into a **professional layered architecture**:

1. **Complete Decoupling**: The domain has zero knowledge of Next.js or React.
2. **Ease of Testing**: Use cases and mappers are verified using Jest without booting a browser.
3. **Transparent Substitution**: We can switch between an in-memory Mock and a live NestJS API with a single change in the dependency container.
4. **Ready for Redux**: In subsequent weeks, as the application scales and requires sharing exercise state across multiple screens, the transition is confined to replacing `useState` with a Redux slice or Zustand store, leaving all Domain and Infrastructure layers completely untouched.

---

## Self-Assessment Quiz

<Quiz id="compunet3-s11-inyeccion-dependencias-y-conexion-nextjs-quiz">
  <Question title="What is the 'Composition Root' in a TypeScript application implementing Clean Architecture?">
    <Option>The root layout.tsx component where global CSS styles are imported.</Option>
    <Option correct>The central locus (exercise.container.ts) where concrete dependencies are wired and instantiated to provide use cases ready for consumption.</Option>
    <Option>The tsconfig.json configuration file where import alias paths are defined.</Option>
    <Option>A database script that executes initial schema migrations.</Option>
  </Question>
  <Question title="How can the system switch between simulated mock data and the live NestJS API in exercise.container.ts?">
    <Option>By manually rewriting all use case methods prior to each production deployment.</Option>
    <Option correct>By evaluating an environment variable such as NEXT_PUBLIC_USE_MOCK to instantiate the appropriate datasource in a single conditional line.</Option>
    <Option>By removing the infrastructure directory at compile time.</Option>
    <Option>By maintaining two entirely separate Git repositories.</Option>
  </Question>
  <Question title="Why was the pedagogical decision made NOT to introduce Redux this week?">
    <Option>Because Redux is incompatible with TypeScript and cannot type user actions.</Option>
    <Option correct>To first grasp Clean Architecture with local state; introducing Redux now would conflate architectural separation with reducer and store mechanics.</Option>
    <Option>Because Next.js 14 and 15 disallow state managers inside Client Components.</Option>
    <Option>Because domain entities require using native React context.</Option>
  </Question>
  <Question title="What role is fulfilled by the useExercises Custom Hook within the application architecture?">
    <Option>Acts as a database Gateway executing SQL queries.</Option>
    <Option correct>Fulfills the role of Presenter / ViewModel: orchestrating use case execution and managing reactive local state (loading, error, data).</Option>
    <Option>Replaces the routing engine of the Next.js App Router.</Option>
    <Option>Transpiles TypeScript code into compiled Tailwind stylesheets.</Option>
  </Question>
  <Question title="In useExercises, how is the exercises list updated after successfully creating a new item?">
    <Option>By reloading the entire browser window using window.location.reload().</Option>
    <Option correct>Through an immutable local state update: setExercises((prev) =&gt; [...prev, newExercise]).</Option>
    <Option>By directly mutating the preceding array with prev.push(newExercise).</Option>
    <Option>By writing the new exercise directly into a session cookie.</Option>
  </Question>
  <Question title="What is the defining characteristic of visual components such as ExerciseCard and ExerciseForm?">
    <Option>They execute direct fetch calls inside onClick event handlers.</Option>
    <Option correct>They are pure, declarative components: receiving data and callbacks through props without knowledge of network clients or endpoints.</Option>
    <Option>They must declare their own internal database schemas.</Option>
    <Option>They must extend abstract domain classes.</Option>
  </Question>
  <Question title="To approximately how many lines is the host page src/app/exercises/page.tsx reduced when using Clean Architecture?">
    <Option>To over 500 lines due to extensive configuration boilerplate.</Option>
    <Option correct>To fewer than 35 declarative lines, serving purely as the visual assembler between the hook and components.</Option>
    <Option>To a single binary file without visible JSX syntax.</Option>
    <Option>To a static code block devoid of client-side interactivity.</Option>
  </Question>
  <Question title="In the complete execution pipeline, what occurs along the return path when the API responds with HTTP 201 Created?">
    <Option>The browser forcibly redirects the user to the login route.</Option>
    <Option correct>The raw JSON passes through ExerciseMapper.toDomain(), is returned as a pure Entity to the use case, and the hook updates state, triggering a re-render.</Option>
    <Option>The Composition Root instance is destroyed to free RAM.</Option>
    <Option>The page DOM is wiped clean, removing all child components.</Option>
  </Question>
  <Question title="When a global state manager (such as Redux or Zustand) is introduced in subsequent weeks, which layers will be modified?">
    <Option>The entire Domain Layer (entities and use cases) must be rewritten.</Option>
    <Option>Repository contracts and datasource interfaces must be changed.</Option>
    <Option correct>Exclusively the presentation layer (the React Custom Hook), leaving Domain and Infrastructure layers completely untouched.</Option>
    <Option>The NestJS backend must be migrated to a microservices architecture.</Option>
  </Question>
  <Question title="What is the primary advantage of decoupling visual components from network calls?">
    <Option>Enables the browser to execute the application without interpreting JavaScript.</Option>
    <Option correct>Allows redesigning, relocating, or reusing the UI without risk of altering business rules or breaking persistence logic.</Option>
    <Option>Eliminates the requirement to define typed props in React components.</Option>
    <Option>Guarantees that the application functions strictly in offline mode.</Option>
  </Question>
</Quiz>
