---
sidebar_position: 4
description: "Implementa la capa de infraestructura con DTOs, datasources, mappers y repositorios concretos que desacoplan el origen de los datos."
---

# Acceso a Datos: Repository, Datasources y Mappers

En la sesión anterior construimos el núcleo de la aplicación: la **Capa de Dominio**, libre de dependencias externas. Ahora entraremos en la **Capa de Infraestructura**, el lugar donde la aplicación se comunica con el mundo real: llamadas HTTP a servidores NestJS, almacenamiento local y simulación de datos en memoria.

En esta lección exploraremos cómo el **Patrón Repositorio**, los **Datasources** y los **Mappers defensivos** garantizan que los cambios en las APIs externas nunca rompan la lógica interna del negocio.

---

## 1. DTO vs. Entidad y la Aduana del Mapper

Cuando consumimos una API REST (por ejemplo, el backend en NestJS de Computación en Internet 3), la respuesta JSON suele tener convenciones propias de la base de datos: nombres en `snake_case`, fechas representadas como cadenas ISO de texto (`string`) y posibles campos nulos o no definidos.

Si permitimos que esos objetos crudos viajen directamente hasta nuestros componentes de React, creamos un acoplamiento frágil: cualquier renombre en el backend romperá las vistas. Para evitarlo, establecemos una aduana defensiva mediante el **Mapper**:

![DTO vs. Entidad de Dominio y el Rol del Mapper](/img/computacion-3/clean-arch-entity-vs-dto.svg)

### 1.1. Definición del DTO (Data Transfer Object)
El DTO es un tipo de TypeScript que refleja **fiel y exactamente** la estructura JSON que viaja por el cable:

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

### 1.2. Implementación del Mapper
El Mapper es una clase utilitaria o módulo con funciones puras encargada de transformar DTOs en Entidades y viceversa:

```typescript title="src/features/exercises/infrastructure/mappers/exercise.mapper.ts" showLineNumbers
import { Exercise, MuscleGroup, Difficulty } from '../../domain/entities/exercise';
import { CreateExerciseParams } from '../../domain/repositories/exercise.repository';
import { ExerciseResponseDto, CreateExerciseDto } from '../dtos/exercise.dto';

export class ExerciseMapper {
  /**
   * Convierte un DTO de red en una Entidad de Dominio limpia
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
   * Convierte parámetros del dominio en un DTO serializable para la petición POST
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

:::tip[El valor del Mapper]
Si el equipo de backend renombra en NestJS `difficulty_level` a `diff`, el único archivo que debe modificarse en todo el frontend es `exercise.mapper.ts`. Ni los Casos de Uso, ni los Hooks, ni las páginas de Next.js se enterarán de este cambio.
:::

---

## 2. El Patrón Datasource: Desacoplando el Origen de los Datos

Un **Datasource** es el proveedor directo que interactúa con la fuente física de información. Para mantener la arquitectura flexible, definimos primero el contrato del datasource:

![El Patrón Repositorio y los Datasources Desacoplados](/img/computacion-3/clean-arch-repository-pattern-flow.svg)

```typescript title="src/features/exercises/infrastructure/datasources/exercise-datasource.interface.ts" showLineNumbers
import { ExerciseResponseDto, CreateExerciseDto } from '../dtos/exercise.dto';

export interface ExerciseDatasource {
  fetchExercises(): Promise<ExerciseResponseDto[]>;
  fetchExerciseById(id: string): Promise<ExerciseResponseDto | null>;
  createExercise(dto: CreateExerciseDto): Promise<ExerciseResponseDto>;
}
```

### 2.1. Implementación 1: Mock Datasource (Desarrollo y Pruebas)
Permite a los desarrolladores trabajar en la interfaz y validar flujos de usuario antes de que el backend esté desplegado o cuando no hay conexión a internet:

```typescript title="src/features/exercises/infrastructure/datasources/exercise-mock-datasource.ts" showLineNumbers
import { ExerciseDatasource } from './exercise-datasource.interface';
import { ExerciseResponseDto, CreateExerciseDto } from '../dtos/exercise.dto';

// Función utilitaria para simular latencia de red en milisegundos
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class ExerciseMockDatasource implements ExerciseDatasource {
  private exercises: ExerciseResponseDto[] = [
    {
      id: 'ex-1',
      exercise_name: 'Press de Banca Plano',
      description: 'Empuje horizontal con barra sobre banco plano para desarrollo pectoral.',
      muscle_group: 'CHEST',
      difficulty_level: 'INTERMEDIATE',
      created_at: new Date('2026-02-10').toISOString(),
    },
    {
      id: 'ex-2',
      exercise_name: 'Sentadilla Libre con Barra',
      description: 'Flexión profunda de rodillas y caderas con barra tras nuca.',
      muscle_group: 'LEGS',
      difficulty_level: 'ADVANCED',
      created_at: new Date('2026-02-12').toISOString(),
    },
    {
      id: 'ex-3',
      exercise_name: 'Dominadas Pronas',
      description: 'Tracción vertical en barra fija elevando la barbilla sobre la barra.',
      muscle_group: 'BACK',
      difficulty_level: 'INTERMEDIATE',
      created_at: new Date('2026-02-14').toISOString(),
    },
  ];

  async fetchExercises(): Promise<ExerciseResponseDto[]> {
    await delay(350); // Simulación de carga realista
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

### 2.2. Implementación 2: API Datasource (Producción con NestJS)
Consume los endpoints REST reales construidos en NestJS en el puerto `3000`:

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
      throw new Error(`Error HTTP ${res.status}: Fallo al consultar ejercicios`);
    }

    return await res.json();
  }

  async fetchExerciseById(id: string): Promise<ExerciseResponseDto | null> {
    const res = await fetch(`${this.baseUrl}/exercises/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
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
      throw new Error(`Error HTTP ${res.status}: No se pudo guardar el ejercicio`);
    }

    return await res.json();
  }
}
```

---

## 3. Implementación del Repositorio Concreto

El repositorio concreto `ExerciseRepositoryImpl` implementa el contrato `ExerciseRepository` definido en la capa de dominio. Su labor es ensamblar las piezas: invocar el datasource y mapear los DTOs resultantes a Entidades de Dominio:

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

:::important[Inversión de Dependencias cumplida]
Nota la firma del constructor: `constructor(private readonly datasource: ExerciseDatasource) {}`.
El repositorio **no crea con `new` su fuente de datos**, sino que la recibe por parámetro. Esto nos permite inyectar `ExerciseMockDatasource` en desarrollo o testing y `ExerciseApiDatasource` en producción sin cambiar una sola línea de código en la lógica del repositorio.
:::

---

## 4. Resumen de la Lección

1. **Los DTOs** describen los contratos de red de la API tal como viajan por HTTP.
2. **Los Mappers** transforman los DTOs en Entidades inmutables, aislando la aplicación de cambios en el backend.
3. **El patrón Datasource** encapsula la obtención física de datos (Mock en memoria vs. Fetch HTTP a NestJS).
4. **El Repositorio concreto** implementa la interfaz del dominio coordinando el datasource y el mapper.
5. En la lección final conectaremos toda esta infraestructura con Next.js mediante **Inyección de Dependencias** y un **Custom Hook** de presentación.

---

## Cuestionario de Autoevaluación

<Quiz id="compunet3-s11-acceso-a-datos-repository-y-mappers-quiz">
  <Question title="¿Cuál es la función específica de un DTO (Data Transfer Object) en la capa de infraestructura?">
    <Option>Encapsular métodos con lógica de negocio y validación de reglas complejas.</Option>
    <Option correct>Representar fiel y exactamente el formato crudo de los datos que viajan por la red (JSON de la API).</Option>
    <Option>Almacenar las claves secretas de la base de datos en el cliente.</Option>
    <Option>Actuar como un hook reactivo que actualiza el estado de la vista.</Option>
  </Question>
  <Question title="¿Por qué se considera al Mapper como una 'aduana defensiva' para la aplicación frontend?">
    <Option>Porque cifra el tráfico de red mediante protocolos SSL personalizados.</Option>
    <Option correct>Porque aísla al dominio: si el backend renombra campos o envía datos nulos, solo se ajusta el Mapper sin afectar el resto del sistema.</Option>
    <Option>Porque bloquea peticiones maliciosas procedentes de IPs no autorizadas.</Option>
    <Option>Porque convierte automáticamente código TypeScript a instrucciones nativas de servidor.</Option>
  </Question>
  <Question title="¿Qué transformaciones típicas realiza el método ExerciseMapper.toDomain()?">
    <Option>Convierte objetos JSON a formato XML para compatibilidad con SOAP.</Option>
    <Option correct>Transforma snake_case a camelCase, convierte cadenas ISO a objetos Date y asigna valores por defecto si un campo viene nulo.</Option>
    <Option>Elimina todas las propiedades del objeto para ocultar información sensible.</Option>
    <Option>Genera esquemas de validación gráfica para componentes de Tailwind.</Option>
  </Question>
  <Question title="En el código del módulo, ¿qué sucede en ExerciseMapper si el backend entrega un muscle_group no reconocido o nulo?">
    <Option>Arroja una excepción fatal que bloquea el renderizado de la página.</Option>
    <Option correct>El método privado mapMuscleGroup normaliza el valor y asigna un grupo muscular por defecto ('CORE').</Option>
    <Option>Envía una petición de reporte de error automático al servidor NestJS.</Option>
    <Option>Borra el ejercicio de la lista en memoria.</Option>
  </Question>
  <Question title="¿Cuál es la ventaja de definir una interface abstracta ExerciseDatasource?">
    <Option>Permite que el navegador ejecute consultas SQL directas en IndexedDB.</Option>
    <Option correct>Desacopla el transporte: permite tener implementaciones intercambiables como Mock en memoria o llamadas HTTP reales.</Option>
    <Option>Obliga al framework Next.js a compilar las páginas en modo estático obligatorio.</Option>
    <Option>Elimina la necesidad de utilizar constructores en las clases del repositorio.</Option>
  </Question>
  <Question title="¿Para qué resulta especialmente útil implementar un ExerciseMockDatasource con delay artificial?">
    <Option>Para simular congestión de red en pruebas de penetración de seguridad.</Option>
    <Option correct>Para desarrollar y probar interfaces visuales y estados de carga de forma ágil, incluso sin tener el backend disponible.</Option>
    <Option>Para almacenar permanentemente los datos del usuario en la memoria RAM del servidor.</Option>
    <Option>Para reducir el costo de suscripción a bases de datos en la nube.</Option>
  </Question>
  <Question title="En ExerciseApiDatasource, ¿qué verificación se realiza sobre la respuesta antes de invocar res.json()?">
    <Option>Se comprueba que la respuesta contenga exactamente 200 caracteres de texto.</Option>
    <Option correct>Se evalúa si res.ok es verdadero; en caso contrario, se arroja un error con el código de estado HTTP correspondiente.</Option>
    <Option>Se verifica si el usuario tiene permisos de administrador en el navegador.</Option>
    <Option>Se compara el hash MD5 de los datos recibidos con una cookie local.</Option>
  </Question>
  <Question title="¿Cuál es la labor principal de la clase ExerciseRepositoryImpl?">
    <Option>Renderizar las tarjetas de ejercicios utilizando Tailwind CSS.</Option>
    <Option correct>Implementar el contrato del dominio ExerciseRepository coordinando la llamada al datasource y la conversión con el mapper.</Option>
    <Option>Crear las tablas y columnas necesarias dentro de la base de datos PostgreSQL.</Option>
    <Option>Interceptar las rutas del navegador web mediante middlewares de Next.js.</Option>
  </Question>
  <Question title="¿Cómo recibe ExerciseRepositoryImpl su dependencia de datos en el constructor?">
    <Option>Instancia directamente con new un objeto fijo de ExerciseApiDatasource.</Option>
    <Option correct>Recibe una instancia de ExerciseDatasource por parámetro en el constructor (inyección de dependencias).</Option>
    <Option>Lee la instancia desde una variable global del objeto window.</Option>
    <Option>Importa dinámicamente el datasource mediante import() dentro de cada método.</Option>
  </Question>
  <Question title="Si el equipo de backend renombra difficulty_level a diff en el endpoint JSON, ¿qué archivo debe modificarse en el frontend?">
    <Option>src/features/exercises/domain/entities/exercise.ts y todos los componentes visuales.</Option>
    <Option>src/features/exercises/domain/usecases/get-exercises.usecase.ts exclusivamente.</Option>
    <Option correct>Únicamente el DTO y el Mapper en la capa de infraestructura (exercise.dto.ts y exercise.mapper.ts).</Option>
    <Option>src/app/exercises/page.tsx y la configuración de next.config.js.</Option>
  </Question>
</Quiz>

