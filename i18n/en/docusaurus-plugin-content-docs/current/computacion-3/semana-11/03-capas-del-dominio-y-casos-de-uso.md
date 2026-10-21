---
sidebar_position: 3
description: "Model the domain layer of a Clean Architecture frontend, including entities, use cases, and repository contracts free of external dependencies."
---

# Domain Layer: Entities and Use Cases

The **Domain Layer** constitutes the foundational core of any application engineered under Clean Architecture. Within this layer reside the system's entities and its most stable business rules.

A fundamental characteristic in frontend engineering is that **the Domain is written in 100% pure TypeScript**. It does not depend on React, has no knowledge of hooks (`useState`), remains unaware of Next.js, and never executes direct network calls via `fetch` or `axios`.

---

## 1. The Architectural Onion in the Frontend

The concentric structure of Clean Architecture situates the Domain at the absolute center, encircled by Use Cases and bounded externally by interface adapters:

![Clean Architecture Onion in the Frontend](/img/computacion-3/clean-arch-onion-layers.svg)

### The Dependency Rule in Action
- The presentation layer (React) knows about use cases.
- Use cases know about entities and repository contracts.
- **Entities and repository contracts have zero knowledge of anything outside the domain.**

---

## 2. Modeling Domain Entities

An **Entity** represents a core business concept endowed with its own identity and business invariants that must be satisfied at all times.

In our fitness feature module, the `Exercise` model defines required immutable properties and domain constraints:

```typescript title="src/features/exercises/domain/entities/exercise.ts" showLineNumbers
export type MuscleGroup = 'CHEST' | 'BACK' | 'LEGS' | 'SHOULDERS' | 'ARMS' | 'CORE';
export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface ExerciseProps {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly muscleGroup: MuscleGroup;
  readonly difficulty: Difficulty;
  readonly createdAt: Date;
}

export class Exercise {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly muscleGroup: MuscleGroup;
  readonly difficulty: Difficulty;
  readonly createdAt: Date;

  constructor(props: ExerciseProps) {
    this.validate(props);
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.muscleGroup = props.muscleGroup;
    this.difficulty = props.difficulty;
    this.createdAt = props.createdAt;
  }

  /**
   * Business invariant: An exercise cannot exist with incomplete data
   */
  private validate(props: ExerciseProps): void {
    if (!props.name || props.name.trim().length < 3) {
      throw new Error('Exercise name must have at least 3 characters.');
    }

    if (!props.description || props.description.trim().length < 10) {
      throw new Error('Description must have at least 10 explanatory characters.');
    }
  }

  /**
   * Business method: Determines if the exercise is suitable for beginners
   */
  isBeginnerFriendly(): boolean {
    return this.difficulty === 'BEGINNER';
  }
}
```

### Characteristics of a Clean Entity
1. **Immutability**: All properties are read-only (`readonly`). Modifying an object produces a new instance, preventing unintended side effects across the user interface.
2. **Strict Typing**: We utilize union types (`type MuscleGroup = 'CHEST' | ...`) rather than loose `string` types.
3. **Invariant Validation**: If incoming data violates business rules, the constructor throws an exception before an invalid object can pollute the application.

---

## 3. Repository Contracts in the Domain

The domain requires persisting and querying data, but **it must not know how or from where data is retrieved**. To accomplish this, it defines an **abstract contract** via a TypeScript `interface`:

```typescript title="src/features/exercises/domain/repositories/exercise.repository.ts" showLineNumbers
import { Exercise } from '../entities/exercise';

export interface CreateExerciseParams {
  name: string;
  description: string;
  muscleGroup: Exercise['muscleGroup'];
  difficulty: Exercise['difficulty'];
}

export interface ExerciseRepository {
  /**
   * Retrieves the full list of available exercises
   */
  getAll(): Promise<Exercise[]>;

  /**
   * Retrieves an exercise by its unique identifier
   */
  getById(id: string): Promise<Exercise | null>;

  /**
   * Persists a new exercise and returns the persisted entity
   */
  create(params: CreateExerciseParams): Promise<Exercise>;
}
```

:::note[Dependency Inversion Principle (DIP)]
Notice that the interface is named `ExerciseRepository` and resides within `domain/repositories/`. It makes no reference to `fetch`, `SQL`, `MongoDB`, or `Axios`. The domain establishes the contract; infrastructure is tasked with fulfilling it.
:::

---

## 4. Use Cases (Interactors)

A **Use Case** encapsulates a specific user intent within the system. It adheres to the single responsibility principle: a class featuring a single public `execute()` method.

### Use Case 1: Retrieve Exercises

```typescript title="src/features/exercises/domain/usecases/get-exercises.usecase.ts" showLineNumbers
import { Exercise } from '../entities/exercise';
import { ExerciseRepository } from '../repositories/exercise.repository';

export class GetExercisesUseCase {
  constructor(private readonly repository: ExerciseRepository) {}

  async execute(): Promise<Exercise[]> {
    const exercises = await this.repository.getAll();

    // Application rule: Sort alphabetically by name
    return exercises.sort((a, b) => a.name.localeCompare(b.name));
  }
}
```

### Use Case 2: Create a New Exercise

```typescript title="src/features/exercises/domain/usecases/create-exercise.usecase.ts" showLineNumbers
import { Exercise } from '../entities/exercise';
import { CreateExerciseParams, ExerciseRepository } from '../repositories/exercise.repository';

export class CreateExerciseUseCase {
  constructor(private readonly repository: ExerciseRepository) {}

  async execute(params: CreateExerciseParams): Promise<Exercise> {
    // 1. Input sanitization
    const sanitizedParams: CreateExerciseParams = {
      name: params.name.trim(),
      description: params.description.trim(),
      muscleGroup: params.muscleGroup,
      difficulty: params.difficulty,
    };

    // 2. Business rule validation prior to delegating persistence
    if (sanitizedParams.name.length < 3) {
      throw new Error('Name must be at least 3 characters long.');
    }

    // 3. Delegation to the repository contract
    return await this.repository.create(sanitizedParams);
  }
}
```

---

## 5. The Major Benefit: Instantaneous Unit Testing

Because use cases have zero dependencies on the DOM, React, or HTTP servers, they can be validated using unit tests that execute in milliseconds within Node.js using an in-memory test double (*Mock* or *Stub*):

```typescript title="src/features/exercises/domain/usecases/__tests__/create-exercise.usecase.test.ts" showLineNumbers
import { CreateExerciseUseCase } from '../create-exercise.usecase';
import { ExerciseRepository, CreateExerciseParams } from '../../repositories/exercise.repository';
import { Exercise } from '../../entities/exercise';

describe('CreateExerciseUseCase', () => {
  it('should throw an error if the name has fewer than 3 characters', async () => {
    // In-memory mock repository without needing Jest DOM or a backend server
    const mockRepo: ExerciseRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
    };

    const useCase = new CreateExerciseUseCase(mockRepo);

    const invalidParams: CreateExerciseParams = {
      name: 'Ab',
      description: 'Extensive test description',
      muscleGroup: 'CORE',
      difficulty: 'BEGINNER',
    };

    await expect(useCase.execute(invalidParams)).rejects.toThrow(
      'Name must be at least 3 characters long.'
    );
    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
```

---

## 6. Lesson Summary

1. **The Domain Layer** is completely agnostic of frameworks and user interfaces; it is written in pure TypeScript.
2. **Entities** safeguard business invariants through immutable properties and validation routines within the constructor.
3. **Domain Repositories** are strictly abstract contracts (`interfaces`), devoid of technical implementation details.
4. **Use Cases** express discrete user intents (`GetExercises`, `CreateExercise`) and are trivial to test in isolation.
5. In the next session, we will implement the **Infrastructure Layer**, constructing the concrete Repository pattern, Datasources, and defensive Mappers.

---

## Self-Assessment Quiz

<Quiz id="compunet3-s11-capas-del-dominio-y-casos-de-uso-quiz">
  <Question title="What language and dependency environment are required to write the Domain Layer in the frontend?">
    <Option>JavaScript ES5 with polyfill libraries for legacy browser support.</Option>
    <Option correct>100% pure TypeScript, without dependencies on React, Next.js, or HTTP clients such as fetch or Axios.</Option>
    <Option>React TSX with higher-order functional components.</Option>
    <Option>Node.js with native driver modules for direct SQL database connections.</Option>
  </Question>
  <Question title="Why are the properties of the Exercise entity declared as readonly?">
    <Option>To minimize memory consumption in mobile browsers.</Option>
    <Option correct>To guarantee immutability and prevent unintended side effects caused by direct mutations across the application.</Option>
    <Option>To allow Next.js to transform properties into global server-side constants.</Option>
    <Option>Because TypeScript does not allow classes without read-only attributes.</Option>
  </Question>
  <Question title="Where and how does the Exercise entity safeguard its business invariants?">
    <Option>In a Next.js middleware before processing the HTTP request.</Option>
    <Option>In a validation directive within the HTML form element.</Option>
    <Option correct>Inside its own constructor or validate() method, throwing exceptions if data violates business constraints.</Option>
    <Option>Through database annotations in production PostgreSQL.</Option>
  </Question>
  <Question title="What category of methods legitimately belongs inside a Domain Entity?">
    <Option>Asynchronous functions executing fetch() to refresh data from the network.</Option>
    <Option>DOM tree manipulations using querySelector.</Option>
    <Option correct>Methods encapsulating business logic and domain queries (e.g., isBeginnerFriendly()) evaluated against internal state.</Option>
    <Option>onClick event handler functions for user interface buttons.</Option>
  </Question>
  <Question title="How is the ExerciseRepository contract defined within the domain layer?">
    <Option>As a concrete class that instantiates database connection pools.</Option>
    <Option correct>As an abstract TypeScript interface that specifies required operations without technical details.</Option>
    <Option>As a useExerciseRepository hook function consuming React context.</Option>
    <Option>As a JSON configuration file containing API routes and credentials.</Option>
  </Question>
  <Question title="What is the primary responsibility of a Use Case (Interactor)?">
    <Option>Serializing React components to optimize Server-Side Rendering performance.</Option>
    <Option correct>Encapsulating and orchestrating a single, specific user intent within the system via an execute() method.</Option>
    <Option>Storing browser navigation history and user route visits.</Option>
    <Option>Managing static asset and image caching strategies.</Option>
  </Question>
  <Question title="In the module's GetExercisesUseCase, what application rule is executed after querying the repository?">
    <Option>Filtering exclusively for exercises marked with advanced difficulty.</Option>
    <Option correct>Alphabetically sorting the exercise list by name using localeCompare.</Option>
    <Option>Truncating the list to the first 5 records for static pagination.</Option>
    <Option>Converting all date fields to numeric UNIX timestamps.</Option>
  </Question>
  <Question title="What operations does CreateExerciseUseCase perform before delegating persistence to the repository?">
    <Option>Sends a push notification to the user's browser.</Option>
    <Option correct>Sanitizes string inputs (trim) and validates prerequisites such as minimum name length.</Option>
    <Option>Encrypts data using SHA-256 in memory.</Option>
    <Option>Directly inserts the record into NestJS database tables.</Option>
  </Question>
  <Question title="Why can use cases be validated in unit tests in milliseconds?">
    <Option>Because Jest automatically skips executing asynchronous code.</Option>
    <Option correct>Because they do not depend on the DOM or live servers; they are tested in Node.js by injecting test doubles (Mocks/Stubs).</Option>
    <Option>Because browsers compile test suites into native machine code prior to execution.</Option>
    <Option>Because use cases contain no logical branching requiring verification.</Option>
  </Question>
  <Question title="When invalid parameters are passed to CreateExerciseUseCase in unit tests, what behavior is verified?">
    <Option>That the server returns an HTTP 500 status code.</Option>
    <Option>That the browser displays an alert modal on the screen.</Option>
    <Option correct>That the returned promise is rejected with the expected error message and that mockRepo.create is never invoked.</Option>
    <Option>That the repository creates an empty exercise record with default values.</Option>
  </Question>
</Quiz>
