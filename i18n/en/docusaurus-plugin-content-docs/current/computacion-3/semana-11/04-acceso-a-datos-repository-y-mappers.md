---
sidebar_position: 4
---

# Data Access: Repository, Datasources, and Mappers

In the previous session, we constructed the system's core: the **Domain Layer**, entirely devoid of external dependencies. We now enter the **Infrastructure Layer**, the boundary where the application interfaces with the outside world: HTTP calls to NestJS servers, local browser storage, and in-memory mock data fixtures.

In this lesson, we will explore how the **Repository Pattern**, **Datasources**, and **defensive Mappers** ensure that changes in external APIs never break internal business logic.

---

## 1. DTO vs. Entity and the Customs Border of the Mapper

When consuming a REST API (for instance, the NestJS backend for Internet Computing 3), JSON responses often follow database-specific conventions: `snake_case` field names, timestamps serialized as ISO 8601 strings (`string`), and nullable or omitted properties.

If we allow these raw objects to travel directly into our React components, we establish fragile coupling: any property rename on the backend breaks our views. To prevent this, we construct a defensive customs checkpoint using a **Mapper**:

![DTO vs. Domain Entity and the Role of the Mapper](/img/computacion-3/clean-arch-entity-vs-dto.svg)

### 1.1. Defining the DTO (Data Transfer Object)
The DTO is a TypeScript interface that reflects **faithfully and exactly** the JSON payload traveling over the wire:

```typescript title="src/features/exercises/infrastructure/dtos/exercise.dto.ts" showLineNumbers
export interface ExerciseResponseDto {
  id: string;
  exercise_name: string;
  description: string;
  muscle_group: string | null;
  difficulty_level: string;
  created_at: string; // ISO 8601 string: "2026-10-11T12:00:00.000Z"
}

export interface CreateExerciseDto {
  exercise_name: string;
  description: string;
  muscle_group: string;
  difficulty_level: string;
}
```

### 1.2. Implementing the Mapper
The Mapper is a utility class or module composed of pure functions responsible for transforming DTOs into Entities and vice versa:

```typescript title="src/features/exercises/infrastructure/mappers/exercise.mapper.ts" showLineNumbers
import { Exercise, MuscleGroup, Difficulty } from '../../domain/entities/exercise';
import { CreateExerciseParams } from '../../domain/repositories/exercise.repository';
import { ExerciseResponseDto, CreateExerciseDto } from '../dtos/exercise.dto';

export class ExerciseMapper {
  /**
   * Converts a network DTO into a clean Domain Entity
   */
  static toDomain(dto: ExerciseResponseDto): Exercise {
    return new Exercise({
      id: dto.id,
      name: dto.exercise_name,
      description: dto.description,
      muscleGroup: this.mapMuscleGroup(dto.muscle_group),
      difficulty: this.mapDifficulty(dto.difficulty_level),
      createdAt: new Date(dto.created_at),
    });
  }

  /**
   * Converts domain parameters into a serializable DTO for POST requests
   */
  static toDto(params: CreateExerciseParams): CreateExerciseDto {
    return {
      exercise_name: params.name,
      description: params.description,
      muscle_group: params.muscleGroup,
      difficulty_level: params.difficulty,
    };
  }

  private static mapMuscleGroup(rawGroup: string | null): MuscleGroup {
    const validGroups: MuscleGroup[] = ['CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS', 'CORE'];
    const normalized = (rawGroup ?? '').toUpperCase() as MuscleGroup;
    return validGroups.includes(normalized) ? normalized : 'CORE';
  }

  private static mapDifficulty(rawDiff: string): Difficulty {
    const validDiffs: Difficulty[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
    const normalized = rawDiff.toUpperCase() as Difficulty;
    return validDiffs.includes(normalized) ? normalized : 'BEGINNER';
  }
}
```

:::tip[The Value of the Mapper]
If the backend team renames `difficulty_level` to `diff` in NestJS, the only file that requires modification across the entire frontend codebase is `exercise.mapper.ts`. Neither Use Cases, nor Hooks, nor Next.js pages will ever be affected by this change.
:::

---

## 2. The Datasource Pattern: Decoupling Data Origins

A **Datasource** is the concrete provider that interacts directly with the physical data source. To keep the architecture flexible, we define the datasource contract first:

![The Repository Pattern and Decoupled Datasources](/img/computacion-3/clean-arch-repository-pattern-flow.svg)

```typescript title="src/features/exercises/infrastructure/datasources/exercise-datasource.interface.ts" showLineNumbers
import { ExerciseResponseDto, CreateExerciseDto } from '../dtos/exercise.dto';

export interface ExerciseDatasource {
  fetchExercises(): Promise<ExerciseResponseDto[]>;
  fetchExerciseById(id: string): Promise<ExerciseResponseDto | null>;
  createExercise(dto: CreateExerciseDto): Promise<ExerciseResponseDto>;
}
```

### 2.1. Implementation 1: Mock Datasource (Development and Testing)
Enables engineers to build user interfaces and validate user workflows before backend endpoints are deployed or when working without internet connectivity:

```typescript title="src/features/exercises/infrastructure/datasources/exercise-mock-datasource.ts" showLineNumbers
import { ExerciseDatasource } from './exercise-datasource.interface';
import { ExerciseResponseDto, CreateExerciseDto } from '../dtos/exercise.dto';

// Utility helper to simulate network latency in milliseconds
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class ExerciseMockDatasource implements ExerciseDatasource {
  private exercises: ExerciseResponseDto[] = [
    {
      id: 'ex-1',
      exercise_name: 'Flat Barbell Bench Press',
      description: 'Horizontal barbell press on a flat bench for pectoral development.',
      muscle_group: 'CHEST',
      difficulty_level: 'INTERMEDIATE',
      created_at: new Date('2026-02-10').toISOString(),
    },
    {
      id: 'ex-2',
      exercise_name: 'Barbell Back Squat',
      description: 'Deep knee and hip flexion with barbell positioned across upper back.',
      muscle_group: 'LEGS',
      difficulty_level: 'ADVANCED',
      created_at: new Date('2026-02-12').toISOString(),
    },
    {
      id: 'ex-3',
      exercise_name: 'Overhand Pull-ups',
      description: 'Vertical pull on a stationary bar elevating chin over bar.',
      muscle_group: 'BACK',
      difficulty_level: 'INTERMEDIATE',
      created_at: new Date('2026-02-14').toISOString(),
    },
  ];

  async fetchExercises(): Promise<ExerciseResponseDto[]> {
    await delay(350); // Realistic loading simulation
    return [...this.exercises];
  }

  async fetchExerciseById(id: string): Promise<ExerciseResponseDto | null> {
    await delay(200);
    const item = this.exercises.find((e) => e.id === id);
    return item ? { ...item } : null;
  }

  async createExercise(dto: CreateExerciseDto): Promise<ExerciseResponseDto> {
    await delay(450);
    const newDto: ExerciseResponseDto = {
      id: `ex-${Date.now()}`,
      exercise_name: dto.exercise_name,
      description: dto.description,
      muscle_group: dto.muscle_group,
      difficulty_level: dto.difficulty_level,
      created_at: new Date().toISOString(),
    };
    this.exercises.push(newDto);
    return { ...newDto };
  }
}
```

### 2.2. Implementation 2: API Datasource (Production with NestJS)
Consumes live REST endpoints exposed by NestJS on port `3000`:

```typescript title="src/features/exercises/infrastructure/datasources/exercise-api-datasource.ts" showLineNumbers
import { ExerciseDatasource } from './exercise-datasource.interface';
import { ExerciseResponseDto, CreateExerciseDto } from '../dtos/exercise.dto';

export class ExerciseApiDatasource implements ExerciseDatasource {
  constructor(private readonly baseUrl: string = 'http://localhost:3000/api') {}

  async fetchExercises(): Promise<ExerciseResponseDto[]> {
    const res = await fetch(`${this.baseUrl}/exercises`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: Failed to fetch exercises`);
    }

    return await res.json();
  }

  async fetchExerciseById(id: string): Promise<ExerciseResponseDto | null> {
    const res = await fetch(`${this.baseUrl}/exercises/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    return await res.json();
  }

  async createExercise(dto: CreateExerciseDto): Promise<ExerciseResponseDto> {
    const res = await fetch(`${this.baseUrl}/exercises`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(dto),
    });

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: Failed to persist exercise`);
    }

    return await res.json();
  }
}
```

---

## 3. Implementing the Concrete Repository

The concrete repository `ExerciseRepositoryImpl` implements the `ExerciseRepository` contract declared in the domain layer. Its duty is to assemble the components: invoking the datasource and mapping resulting DTOs into Domain Entities:

```typescript title="src/features/exercises/infrastructure/repositories/exercise.repository.impl.ts" showLineNumbers
import { Exercise } from '../../domain/entities/exercise';
import { ExerciseRepository, CreateExerciseParams } from '../../domain/repositories/exercise.repository';
import { ExerciseDatasource } from '../datasources/exercise-datasource.interface';
import { ExerciseMapper } from '../mappers/exercise.mapper';

export class ExerciseRepositoryImpl implements ExerciseRepository {
  constructor(private readonly datasource: ExerciseDatasource) {}

  async getAll(): Promise<Exercise[]> {
    const dtos = await this.datasource.fetchExercises();
    return dtos.map((dto) => ExerciseMapper.toDomain(dto));
  }

  async getById(id: string): Promise<Exercise | null> {
    const dto = await this.datasource.fetchExerciseById(id);
    return dto ? ExerciseMapper.toDomain(dto) : null;
  }

  async create(params: CreateExerciseParams): Promise<Exercise> {
    const dtoToSend = ExerciseMapper.toDto(params);
    const createdDto = await this.datasource.createExercise(dtoToSend);
    return ExerciseMapper.toDomain(createdDto);
  }
}
```

:::important[Dependency Inversion Fulfilled]
Observe the constructor signature: `constructor(private readonly datasource: ExerciseDatasource) {}`.
The repository **does not instantiate its datasource using `new`**, but receives it via constructor parameter. This allows us to inject `ExerciseMockDatasource` during development or testing and `ExerciseApiDatasource` in production without modifying a single line of logic inside the repository.
:::

---

## 4. Lesson Summary

1. **DTOs** describe network API contracts exactly as they travel over HTTP.
2. **Mappers** transform DTOs into immutable Entities, insulating the application from backend changes.
3. **The Datasource pattern** encapsulates physical data retrieval (in-memory Mock vs. HTTP Fetch against NestJS).
4. **The concrete Repository** implements the domain interface by orchestrating the datasource and the mapper.
5. In the final lesson, we will connect this entire infrastructure to Next.js via **Dependency Injection** and a presentation **Custom Hook**.

---

## Self-Assessment Quiz

<Quiz id="compunet3-s11-acceso-a-datos-repository-y-mappers-quiz">
  <Question title="What is the specific responsibility of a DTO (Data Transfer Object) in the infrastructure layer?">
    <Option>Encapsulating methods containing business logic and complex rule validations.</Option>
    <Option correct>Faithfully and accurately representing the raw format of data traveling across the network (API JSON).</Option>
    <Option>Storing database secret credentials on the client device.</Option>
    <Option>Acting as a reactive hook that updates view state.</Option>
  </Question>
  <Question title="Why is the Mapper considered a 'defensive customs border' for the frontend application?">
    <Option>Because it encrypts network traffic using custom SSL protocols.</Option>
    <Option correct>Because it isolates the domain: if the backend renames fields or sends null values, only the Mapper requires updates without impacting the rest of the system.</Option>
    <Option>Because it intercepts malicious requests originating from unauthorized IP addresses.</Option>
    <Option>Because it automatically compiles TypeScript code into native server instructions.</Option>
  </Question>
  <Question title="What typical transformations are performed by the ExerciseMapper.toDomain() method?">
    <Option>Converts JSON objects into XML format for legacy SOAP interoperability.</Option>
    <Option correct>Transforms snake_case into camelCase, parses ISO date strings into Date objects, and assigns default fallbacks for null fields.</Option>
    <Option>Strips all object properties to conceal sensitive information.</Option>
    <Option>Generates graphical validation schemas for Tailwind components.</Option>
  </Question>
  <Question title="In the module's code, what occurs in ExerciseMapper if the backend returns an unrecognized or null muscle_group?">
    <Option>Throws a fatal exception that halts page rendering.</Option>
    <Option correct>The private mapMuscleGroup method normalizes the input and assigns a default muscle group ('CORE').</Option>
    <Option>Sends an automatic error report request to the NestJS server.</Option>
    <Option>Deletes the exercise from the in-memory array.</Option>
  </Question>
  <Question title="What is the key benefit of defining an abstract ExerciseDatasource interface?">
    <Option>Allows the web browser to execute direct SQL queries in IndexedDB.</Option>
    <Option correct>Decouples transport: enables interchangeable implementations such as in-memory Mocks or real HTTP network calls.</Option>
    <Option>Forces Next.js to compile pages strictly in static export mode.</Option>
    <Option>Eliminates the requirement to use class constructors in repositories.</Option>
  </Question>
  <Question title="Why is implementing an ExerciseMockDatasource with simulated artificial delay particularly valuable?">
    <Option>To test network congestion resilience in security penetration testing.</Option>
    <Option correct>To develop and test visual user interfaces and loading states quickly, even when the backend is not yet available.</Option>
    <Option>To permanently store user data inside server RAM.</Option>
    <Option>To reduce cloud database subscription costs.</Option>
  </Question>
  <Question title="In ExerciseApiDatasource, what verification is performed on the response before invoking res.json()?">
    <Option>Checks whether the response contains exactly 200 text characters.</Option>
    <Option correct>Evaluates whether res.ok is true; otherwise, throws an error containing the corresponding HTTP status code.</Option>
    <Option>Checks whether the user holds administrator privileges in the browser.</Option>
    <Option>Compares the MD5 hash of received data against a local cookie.</Option>
  </Question>
  <Question title="What is the primary responsibility of the ExerciseRepositoryImpl class?">
    <Option>Rendering exercise cards using Tailwind CSS.</Option>
    <Option correct>Implementing the ExerciseRepository domain contract by coordinating datasource calls and mapper conversions.</Option>
    <Option>Creating required tables and columns within a PostgreSQL database.</Option>
    <Option>Intercepting browser navigation routes using Next.js middlewares.</Option>
  </Question>
  <Question title="How does ExerciseRepositoryImpl receive its data dependency in the constructor?">
    <Option>Instantiates a hardcoded ExerciseApiDatasource object directly using new.</Option>
    <Option correct>Receives an ExerciseDatasource instance as a constructor parameter (dependency injection).</Option>
    <Option>Reads the instance from a global property on the window object.</Option>
    <Option>Dynamically imports the datasource using import() inside each method.</Option>
  </Question>
  <Question title="If the backend team renames difficulty_level to diff in the JSON endpoint, which frontend file must be updated?">
    <Option>src/features/exercises/domain/entities/exercise.ts and all visual components.</Option>
    <Option>src/features/exercises/domain/usecases/get-exercises.usecase.ts exclusively.</Option>
    <Option correct>Only the DTO and Mapper within the infrastructure layer (exercise.dto.ts and exercise.mapper.ts).</Option>
    <Option>src/app/exercises/page.tsx and next.config.js configuration.</Option>
  </Question>
</Quiz>
