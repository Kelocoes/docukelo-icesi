---
sidebar_position: 3
description: "Modela entidades, contratos de repositorio y casos de uso en la capa de dominio de una aplicación frontend con Clean Architecture."
---

# Capa de Dominio: Entidades y Casos de Uso

La **Capa de Dominio** es el núcleo de cualquier aplicación construida bajo Clean Architecture. En esta capa residen las entidades y las reglas de negocio más estables del sistema.

Una característica fundamental en el frontend es que **el Dominio está escrito en TypeScript 100% puro**. No depende de React, no conoce ganchos (`useState`), no sabe qué es Next.js ni realiza llamadas directas a través de `fetch` o `axios`.

---

## 1. La Cebolla Arquitectónica en el Frontend

La estructura concéntrica de Clean Architecture sitúa al Dominio en el centro absoluto, rodeado por los Casos de Uso y finalmente por los adaptadores externos:

![La Cebolla de Clean Architecture en Frontend](/img/computacion-3/clean-arch-onion-layers.svg)

### La Regla de Dependencia en Acción
- La capa de presentación (React) conoce a los casos de uso.
- Los casos de uso conocen a las entidades y a los contratos de repositorio.
- **Las entidades y contratos de repositorio no conocen a nadie por fuera del dominio.**

---

## 2. Modelado de Entidades de Dominio

Una **Entidad** representa un concepto central del negocio con identidad propia e invariantes que deben cumplirse en todo momento.

En nuestra feature de fitness, el modelo `Exercise` define los atributos inmutables requeridos y las restricciones del dominio:

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
   * Invariante de negocio: Un ejercicio no puede existir con datos incompletos
   */
  private validate(props: ExerciseProps): void {
    if (!props.name || props.name.trim().length < 3) {
      throw new Error('El nombre del ejercicio debe tener al menos 3 caracteres.');
    }

    if (!props.description || props.description.trim().length < 10) {
      throw new Error('La descripción debe tener al menos 10 caracteres explicativos.');
    }
  }

  /**
   * Método de negocio: Determina si el ejercicio es adecuado para principiantes
   */
  isBeginnerFriendly(): boolean {
    return this.difficulty === 'BEGINNER';
  }
}
```

### Características de una Entidad Limpia
1. **Inmutabilidad**: Todas las propiedades son de solo lectura (`readonly`). Modificar un objeto genera una nueva instancia, evitando efectos secundarios imprevistos en la interfaz de usuario.
2. **Tipado Estricto**: Hacemos uso de tipos de unión (`type MuscleGroup = 'CHEST' | ...`) en lugar de `string` abiertos.
3. **Validación de Invariantes**: Si los datos no cumplen las reglas del negocio, el constructor arroja una excepción antes de que el objeto inválido contamine la aplicación.

---

## 3. Contratos de Repositorio en el Dominio

El dominio necesita persistir y consultar datos, pero **no debe saber cómo ni de dónde se obtienen**. Para lograrlo, define un **contrato abstracto** mediante una `interface` de TypeScript:

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
   * Obtiene la lista completa de ejercicios disponibles
   */
  getAll(): Promise<Exercise[]>;

  /**
   * Obtiene un ejercicio por su identificador único
   */
  getById(id: string): Promise<Exercise | null>;

  /**
   * Guarda un nuevo ejercicio y retorna la entidad persistida
   */
  create(params: CreateExerciseParams): Promise<Exercise>;
}
```

:::note[Principio de Inversión de Dependencias (DIP)]
Fíjate en que la interfaz se llama `ExerciseRepository` y está ubicada dentro de la carpeta `domain/repositories/`. No tiene mención a `fetch`, `SQL`, `MongoDB` ni `Axios`. El dominio define el contrato; la infraestructura se encargará de cumplirlo.
:::

---

## 4. Casos de Uso (Interactors)

Un **Caso de Uso** encapsula una intención específica del usuario en el sistema. Sigue el principio de responsabilidad única: una clase con un único método público `execute()`.

### Caso de Uso 1: Obtener Ejercicios

```typescript title="src/features/exercises/domain/usecases/get-exercises.usecase.ts" showLineNumbers
import { Exercise } from '../entities/exercise';
import { ExerciseRepository } from '../repositories/exercise.repository';

export class GetExercisesUseCase {
  constructor(private readonly repository: ExerciseRepository) {}

  async execute(): Promise<Exercise[]> {
    const exercises = await this.repository.getAll();

    // Regla de aplicación: ordenar alfabéticamente por nombre
    return exercises.sort((a, b) => a.name.localeCompare(b.name));
  }
}
```

### Caso de Uso 2: Crear un Nuevo Ejercicio

```typescript title="src/features/exercises/domain/usecases/create-exercise.usecase.ts" showLineNumbers
import { Exercise } from '../entities/exercise';
import { CreateExerciseParams, ExerciseRepository } from '../repositories/exercise.repository';

export class CreateExerciseUseCase {
  constructor(private readonly repository: ExerciseRepository) {}

  async execute(params: CreateExerciseParams): Promise<Exercise> {
    // 1. Sanitización de entradas
    const sanitizedParams: CreateExerciseParams = {
      name: params.name.trim(),
      description: params.description.trim(),
      muscleGroup: params.muscleGroup,
      difficulty: params.difficulty,
    };

    // 2. Validación de reglas antes de delegar a la persistencia
    if (sanitizedParams.name.length < 3) {
      throw new Error('El nombre debe tener al menos 3 caracteres.');
    }

    // 3. Delegación al repositorio
    return await this.repository.create(sanitizedParams);
  }
}
```

---

## 5. El Gran Beneficio: Pruebas Unitarias Instantáneas

Al no depender del DOM, de React ni de servidores HTTP, los casos de uso se pueden verificar con pruebas unitarias que corren en milisegundos en Node.js mediante un repositorio falso (*Mock* o *Stub*):

```typescript title="src/features/exercises/domain/usecases/__tests__/create-exercise.usecase.test.ts" showLineNumbers
import { CreateExerciseUseCase } from '../create-exercise.usecase';
import { ExerciseRepository, CreateExerciseParams } from '../../repositories/exercise.repository';
import { Exercise } from '../../entities/exercise';

describe('CreateExerciseUseCase', () => {
  it('debe arrojar error si el nombre tiene menos de 3 caracteres', async () => {
    // Repositorio falso en memoria sin necesidad de levantar Jest DOM ni backend
    const mockRepo: ExerciseRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
    };

    const useCase = new CreateExerciseUseCase(mockRepo);

    const invalidParams: CreateExerciseParams = {
      name: 'Ab',
      description: 'Descripción de prueba extensa',
      muscleGroup: 'CORE',
      difficulty: 'BEGINNER',
    };

    await expect(useCase.execute(invalidParams)).rejects.toThrow(
      'El nombre debe tener al menos 3 caracteres.'
    );
    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
```

---

## 6. Resumen de la Lección

1. **La Capa de Dominio** es agnóstica de frameworks e interfaces de usuario; se escribe en TypeScript puro.
2. **Las Entidades** salvaguardan las invariantes del negocio mediante atributos inmutables y validaciones en el constructor.
3. **Los Repositorios en Dominio** son únicamente contratos abstractos (`interfaces`), sin implementación técnica.
4. **Los Casos de Uso** expresan intenciones directas del usuario (`GetExercises`, `CreateExercise`) y son triviales de testear de forma aislada.
5. En la próxima sesión aprenderemos a implementar la **Capa de Infraestructura**, construyendo el patrón Repositorio concreto, los Datasources y los Mappers defensivos.

---

## Cuestionario de Autoevaluación

<Quiz id="compunet3-s11-capas-del-dominio-y-casos-de-uso-quiz">
  <Question title="¿Cuál es el lenguaje y entorno de dependencias requerido para escribir la Capa de Dominio en frontend?">
    <Option>JavaScript ES5 con librerías de polyfills para navegadores antiguos.</Option>
    <Option correct>TypeScript 100% puro, sin dependencias de React, Next.js ni clientes HTTP como fetch o Axios.</Option>
    <Option>React TSX con componentes funcionales de orden superior.</Option>
    <Option>Node.js con módulos nativos de conexión directa a bases de datos SQL.</Option>
  </Question>
  <Question title="¿Por qué se declaran las propiedades de la entidad Exercise como readonly?">
    <Option>Para reducir el uso de memoria en el navegador móvil.</Option>
    <Option correct>Para garantizar inmutabilidad y evitar efectos secundarios imprevistos por mutaciones directas en la aplicación.</Option>
    <Option>Para permitir que Next.js convierta las propiedades en constantes globales del servidor.</Option>
    <Option>Porque TypeScript no permite clases sin atributos de solo lectura.</Option>
  </Question>
  <Question title="¿Dónde y cómo protege la entidad Exercise sus invariantes de negocio?">
    <Option>En un middleware de Next.js antes de procesar la petición HTTP.</Option>
    <Option>En una directiva de validación dentro del formulario HTML.</Option>
    <Option correct>En su propio constructor o método validate(), arrojando excepciones si los datos no cumplen las restricciones del negocio.</Option>
    <Option>Mediante anotaciones en la base de datos PostgreSQL de producción.</Option>
  </Question>
  <Question title="¿Qué tipo de métodos pertenecen legítimamente a una Entidad de Dominio?">
    <Option>Funciones asíncronas que ejecutan fetch() para refrescar los datos desde la red.</Option>
    <Option>Manipulaciones de elementos del DOM mediante querySelector.</Option>
    <Option correct>Métodos con lógica y preguntas del negocio (ej. isBeginnerFriendly()) basados en su propio estado interno.</Option>
    <Option>Manejadores de eventos onClick para botones de interfaz.</Option>
  </Question>
  <Question title="¿Cómo se define el contrato ExerciseRepository dentro de la capa de dominio?">
    <Option>Como una clase concreta que instancia la conexión a la base de datos.</Option>
    <Option correct>Como una interface abstracta de TypeScript que especifica las operaciones requeridas sin detalles técnicos.</Option>
    <Option>Como una función hook useExerciseRepository que consume contexto de React.</Option>
    <Option>Como un archivo de configuración JSON con URLs y credenciales de la API.</Option>
  </Question>
  <Question title="¿Cuál es la responsabilidad principal de un Caso de Uso (Interactor)?">
    <Option>Serializar los componentes de React para optimizar el Server-Side Rendering.</Option>
    <Option correct>Encapsular y orquestar una única intención específica del usuario en el sistema a través de un método execute().</Option>
    <Option>Almacenar el historial de navegación y rutas visitadas por el usuario.</Option>
    <Option>Gestionar el almacenamiento en caché de imágenes y recursos estáticos.</Option>
  </Question>
  <Question title="En el caso de uso GetExercisesUseCase del módulo, ¿qué regla de aplicación se ejecuta tras consultar el repositorio?">
    <Option>Filtrar únicamente los ejercicios que tengan dificultad avanzada.</Option>
    <Option correct>Ordenar alfabéticamente la lista de ejercicios por su nombre mediante localeCompare.</Option>
    <Option>Truncar la lista a los primeros 5 resultados para paginación fija.</Option>
    <Option>Convertir todas las fechas a marcas de tiempo numéricas de UNIX.</Option>
  </Question>
  <Question title="¿Qué realiza CreateExerciseUseCase antes de solicitar la persistencia al repositorio?">
    <Option>Envía una notificación push al navegador del usuario.</Option>
    <Option correct>Sanitiza las cadenas de texto (trim) y valida reglas previas como la longitud mínima del nombre.</Option>
    <Option>Cifra los datos con el algoritmo SHA-256 en memoria.</Option>
    <Option>Inserta directamente el registro en la tabla de base de datos de NestJS.</Option>
  </Question>
  <Question title="¿Por qué los casos de uso se pueden probar en pruebas unitarias en milisegundos?">
    <Option>Porque Jest omite automáticamente la ejecución de código asíncrono.</Option>
    <Option correct>Porque no dependen del DOM ni de servidores reales; se prueban en Node.js inyectando repositorios falsos (Mocks/Stubs).</Option>
    <Option>Porque el navegador compila las pruebas a código máquina antes de ejecutarlas.</Option>
    <Option>Porque los casos de uso no contienen ninguna lógica que requiera comprobación.</Option>
  </Question>
  <Question title="Si en CreateExerciseUseCase.test.ts se pasan parámetros inválidos, ¿qué comportamiento se verifica en la prueba?">
    <Option>Que el servidor retorne un código de estado HTTP 500.</Option>
    <Option>Que el navegador muestre una alerta modal en pantalla.</Option>
    <Option correct>Que la promesa sea rechazada con el mensaje de error esperado y que mockRepo.create no sea invocado.</Option>
    <Option>Que el repositorio cree un ejercicio vacío con valores por defecto.</Option>
  </Question>
</Quiz>

