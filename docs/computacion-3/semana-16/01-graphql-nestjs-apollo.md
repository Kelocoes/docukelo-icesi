---
sidebar_position: 1
description: "Configuración paso a paso de GraphQL en NestJS con Apollo Server y Apollo Sandbox (Code First), creación de resolvers, tipos e inputs, y conexión desde Next.js manteniendo Clean Architecture."
---

# GraphQL en NestJS con Apollo y Clean Architecture

En la sesión anterior (*Semana 15: Introducción a GraphQL*) entendimos qué problema resuelve GraphQL frente a REST, cómo se lee un schema en SDL y cómo funcionan las queries y mutations. Ahora pasamos a la **implementación real**: vamos a construir un backend en **NestJS** con **Apollo Server** y **Apollo Sandbox**, y luego lo conectaremos a nuestro frontend en **Next.js** sin romper la **Clean Architecture** que ya tienes configurada.

Ya conoces qué es un `Service`, un `Controller` y un `Repository` en NestJS. La buena noticia es que **no tienes que reinventar tu capa de negocio ni tu repositorio**: en GraphQL, el **Resolver** simplemente reemplaza al Controller como puerta de entrada, mientras que el `Service` y el `Repository` (que simularemos en memoria para mantener el foco en GraphQL) siguen funcionando igual.

---

## 1. Fundamentos conceptuales en NestJS

Antes de escribir código, ubica qué cambia y qué permanece igual al pasar de REST a GraphQL. Explora el recorrido completo de una petición en el siguiente diagrama interactivo:

<InteractiveFrame
  src="/interactive/computacion-3/semana-16/arquitectura-nestjs-graphql/index.html"
  title="Arquitectura de una petición GraphQL entre Next.js con Clean Architecture y NestJS con Apollo Server"
  height={640}
/>

### Qué es cada pieza en el backend

| Concepto | Rol en NestJS + GraphQL | Equivalente en REST |
| :--- | :--- | :--- |
| **ApolloDriver** | Motor que recibe peticiones `POST /graphql`, valida la consulta contra el schema y ejecuta los resolvers. | Enrutador HTTP de Express/Fastify |
| **Schema (`schema.gql`)** | Contrato tipado de tipos, queries y mutations disponibles en la API. | Documentación OpenAPI / Swagger |
| **Resolver (`@Resolver`)** | Clase que conecta las operaciones del schema (`@Query`, `@Mutation`) con tus servicios. | `@Controller()` con `@Get()`, `@Post()` |
| **ObjectType (`@ObjectType`)** | Clase TypeScript decorada que define qué campos puede devolver un tipo en GraphQL. | DTO de respuesta |
| **InputType (`@InputType`)** | Clase TypeScript decorada que define qué datos acepta una mutación o consulta como entrada. | DTO de petición (`@Body()`) |

### Code First frente a Schema First

NestJS ofrece dos formas de construir el schema de GraphQL:

| Enfoque | Cómo funciona | Cuándo conviene |
| :--- | :--- | :--- |
| **Code First** | Escribes clases TypeScript con decoradores (`@ObjectType`, `@Field`, `@InputType`) y NestJS genera el archivo `schema.gql` automáticamente al arrancar. | Proyectos NestJS con TypeScript, `class-validator` o TypeORM: evita duplicar tipos entre TS y SDL. |
| **Schema First** | Escribes manualmente los archivos `.graphql` en SDL y luego creas resolvers o generas interfaces TypeScript a partir de ellos. | Equipos donde el contrato SDL se diseña antes en un repositorio compartido entre varios lenguajes. |

En este curso usaremos **Code First** porque se integra de forma natural con los decoradores de NestJS y `class-validator`. Observa cómo cada decorador TypeScript se traduce directamente en el `schema.gql` generado:

<InteractiveFrame
  src="/interactive/computacion-3/semana-16/code-first-schema/index.html"
  title="Mapeo Code First en NestJS: de decoradores TypeScript a schema.gql"
  height={620}
/>

### Qué son los Resolvers y cómo se conectan con Clean Architecture

Un **Resolver** es una clase anotada con `@Resolver()` cuya única responsabilidad es recibir una operación GraphQL, extraer sus argumentos con `@Args()` y delegar el trabajo al `Service` correspondiente:

- **`@Query(() => [Routine], { name: 'routines' })`**: expone una operación de lectura en el tipo raíz `Query`.
- **`@Mutation(() => Routine, { name: 'createRoutine' })`**: expone una operación de escritura en el tipo raíz `Mutation`.
- **`@Args('input')`**: extrae el argumento enviado en la consulta o mutación (y pasa por `ValidationPipe` si está habilitado).
- **`@ResolveField()`**: se usa cuando un campo anidado (por ejemplo `author` dentro de `Post`) requiere ejecutarse bajo demanda solo si el cliente lo pide en su consulta.

En el frontend en Next.js, la **Clean Architecture** protege al dominio (`Routine`, `GetRoutinesUseCase`, `CreateRoutineUseCase`) y a la presentación (componentes, hooks, Server Actions) de los detalles de red. Para migrar de datos mock a GraphQL, **solo agregamos un nuevo Datasource y un nuevo Repository en la capa de infraestructura** y los conectamos en `routine.container.ts`:

<InteractiveFrame
  src="/interactive/computacion-3/semana-16/resolver-y-clean-arch/index.html"
  title="Flujo línea por línea entre RoutineGraphQLRepositoryImpl, RoutineGraphQLDatasource y RoutinesResolver"
  height={680}
/>

---

## 2. Guía paso a paso: Backend en NestJS con Apollo Sandbox

Vamos a crear un entorno aislado con dos carpetas dentro de una carpeta de trabajo (`graphql-sandbox`): `back/` para el servidor NestJS y `front/` para el cliente Next.js.

<StepByStep>
  <Step number="1">
    ### 2.1 Crear la carpeta de trabajo y el proyecto NestJS

    Crea la carpeta `graphql-sandbox`, entra en ella e inicializa un proyecto nuevo de NestJS en la subcarpeta `back`. Usaremos el puerto `4000` en el backend para no chocar con el frontend de Next.js.

    ```bash title="Terminal" showLineNumbers
    mkdir graphql-sandbox
    cd graphql-sandbox
    npx @nestjs/cli@latest new back --package-manager npm --skip-git --strict
    cd back
    ```

    :::note[Sobre la versión de NestJS]
    El CLI actual instala **NestJS 12** con `@nestjs/core ^12`, Express 5 y soporte ESM (`"type": "module"` en `package.json`, por lo que los imports relativos llevan extensión `.js`). Si trabajas sobre un proyecto anterior con NestJS 10 u 11, las opciones de `GraphQLModule` usan `@apollo/server` v4 y `@nestjs/graphql` v12/v13.
    :::
  </Step>

  <Step number="2">
    ### 2.2 Instalar las dependencias de GraphQL, Apollo y validación

    Instala el paquete oficial de GraphQL para NestJS, el driver de Apollo, el motor de `@apollo/server`, el adaptador para Express 5 y `class-validator` para validar los `@InputType()`.

    ```bash title="Terminal (en back/)" showLineNumbers
    npm install @nestjs/graphql @nestjs/apollo @apollo/server @as-integrations/express5 graphql class-validator class-transformer
    ```
  </Step>

  <Step number="3">
    ### 2.3 Configurar GraphQLModule con Apollo Sandbox en AppModule

    Por defecto, `@nestjs/graphql` v14 activa **GraphiQL**. Para usar **Apollo Sandbox** (el IDE interactivo moderno de Apollo), desactivamos `graphiql: false` y agregamos el plugin `ApolloServerPluginLandingPageLocalDefault()`.

    ```ts title="src/app.module.ts" showLineNumbers
    import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
    import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
    import { Module } from '@nestjs/common';
    import { GraphQLModule } from '@nestjs/graphql';
    import { join } from 'node:path';
    import { AppController } from './app.controller.js';
    import { AppService } from './app.service.js';
    import { RoutinesModule } from './routines/routines.module.js';

    @Module({
      imports: [
        // Configura GraphQL en modo Code First con Apollo Server y Apollo Sandbox
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          graphiql: false,
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
        }),
        RoutinesModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    })
    export class AppModule {}
    ```

    :::warning[Si usas Helmet en producción]
    Si en tu proyecto tienes habilitado `helmet`, su política de seguridad (CSP) bloqueará los scripts e iframes del CDN de Apollo Sandbox. En ese caso, configura `contentSecurityPolicy` permitiendo `https://embeddable-sandbox.cdn.apollographql.com`, `https://apollo-server-landing-page.cdn.apollographql.com` y `https://sandbox.embed.apollographql.com`.
    :::
  </Step>

  <Step number="4">
    ### 2.4 Definir el ObjectType Routine

    Crea `src/routines/entities/routine.entity.ts`. El decorador `@ObjectType()` registra la clase en el schema y `@Field()` expone cada propiedad.

    ```ts title="src/routines/entities/routine.entity.ts" showLineNumbers
    import { Field, Int, ObjectType } from '@nestjs/graphql';

    @ObjectType({ description: 'Rutina de entrenamiento registrada en el sistema' })
    export class Routine {
      // Especificamos () => Int para que GraphQL no genere Float!
      @Field(() => Int, { description: 'Identificador único de la rutina' })
      id!: number;

      @Field({ description: 'Nombre de la rutina' })
      name!: string;

      // nullable: true indica que el campo es opcional en schema.gql (String sin !)
      @Field({ nullable: true, description: 'Descripción opcional de la rutina' })
      description?: string;

      @Field({ description: 'Fecha de creación en formato ISO 8601' })
      createdAt!: string;
    }
    ```
  </Step>

  <Step number="5">
    ### 2.5 Definir el InputType y reglas de validación

    Crea `src/routines/dto/create-routine.input.ts`. Usamos `@InputType()` para que la clase pueda recibirse como argumento en una mutación, junto con los decoradores de `class-validator`.

    ```ts title="src/routines/dto/create-routine.input.ts" showLineNumbers
    import { Field, InputType } from '@nestjs/graphql';
    import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

    @InputType({ description: 'Datos necesarios para crear una nueva rutina' })
    export class CreateRoutineInput {
      @Field({ description: 'Nombre de la rutina (mínimo 3 caracteres)' })
      @IsString()
      @MinLength(3, { message: 'El nombre de la rutina debe tener al menos 3 caracteres.' })
      @MaxLength(100, { message: 'El nombre de la rutina no puede exceder los 100 caracteres.' })
      name!: string;

      @Field({ nullable: true, description: 'Descripción opcional (mínimo 10 caracteres si se envía)' })
      @IsOptional()
      @IsString()
      @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres si se proporciona.' })
      description?: string;
    }
    ```
  </Step>

  <Step number="6">
    ### 2.6 Crear el repositorio en memoria y el servicio

    Simulamos la base de datos con un arreglo en memoria dentro de `RoutinesRepository` para concentrarnos en la capa GraphQL. El servicio `RoutinesService` permanece desacoplado de GraphQL.

    ```ts title="src/routines/routines.repository.ts" showLineNumbers
    import { Injectable } from '@nestjs/common';
    import { CreateRoutineInput } from './dto/create-routine.input.js';
    import { Routine } from './entities/routine.entity.js';

    @Injectable()
    export class RoutinesRepository {
      private readonly routines: Routine[] = [
        {
          id: 1,
          name: 'Torso Fuerza e Hipertrofia',
          description: 'Rutina de tren superior enfocada en empujes y tracciones pesadas.',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        },
        {
          id: 2,
          name: 'Pierna Completa e Isquios',
          description: 'Rutina de tren inferior con énfasis en sentadilla libre y peso muerto.',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        },
        {
          id: 3,
          name: 'Full Body Funcional',
          description: 'Circuito metabólico de cuerpo completo para resistencia y quema calórica.',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        },
      ];

      findAll(): Routine[] {
        return [...this.routines];
      }

      findById(id: number): Routine | null {
        const found = this.routines.find((routine) => routine.id === id);
        return found ? { ...found } : null;
      }

      create(input: CreateRoutineInput): Routine {
        const nextId =
          this.routines.length > 0
            ? Math.max(...this.routines.map((routine) => routine.id)) + 1
            : 1;

        const created: Routine = {
          id: nextId,
          name: input.name.trim(),
          description: input.description?.trim(),
          createdAt: new Date().toISOString(),
        };

        this.routines.push(created);
        return { ...created };
      }
    }
    ```

    ```ts title="src/routines/routines.service.ts" showLineNumbers
    import { Injectable } from '@nestjs/common';
    import { CreateRoutineInput } from './dto/create-routine.input.js';
    import { Routine } from './entities/routine.entity.js';
    import { RoutinesRepository } from './routines.repository.js';

    @Injectable()
    export class RoutinesService {
      constructor(private readonly routinesRepository: RoutinesRepository) {}

      findAll(): Routine[] {
        return this.routinesRepository.findAll();
      }

      findOne(id: number): Routine | null {
        return this.routinesRepository.findById(id);
      }

      create(input: CreateRoutineInput): Routine {
        return this.routinesRepository.create(input);
      }
    }
    ```
  </Step>

  <Step number="7">
    ### 2.7 Crear el Resolver y registrar RoutinesModule

    El resolver expone las dos queries (`routines` y `routine`) y la mutación (`createRoutine`).

    ```ts title="src/routines/routines.resolver.ts" showLineNumbers
    import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
    import { CreateRoutineInput } from './dto/create-routine.input.js';
    import { Routine } from './entities/routine.entity.js';
    import { RoutinesService } from './routines.service.js';

    @Resolver(() => Routine)
    export class RoutinesResolver {
      constructor(private readonly routinesService: RoutinesService) {}

      @Query(() => [Routine], {
        name: 'routines',
        description: 'Obtiene el listado de todas las rutinas registradas',
      })
      findAll(): Routine[] {
        return this.routinesService.findAll();
      }

      @Query(() => Routine, {
        name: 'routine',
        nullable: true,
        description: 'Busca una rutina por su identificador numérico',
      })
      findOne(@Args('id', { type: () => Int }) id: number): Routine | null {
        return this.routinesService.findOne(id);
      }

      @Mutation(() => Routine, {
        name: 'createRoutine',
        description: 'Crea una nueva rutina en el sistema',
      })
      createRoutine(@Args('input') input: CreateRoutineInput): Routine {
        return this.routinesService.create(input);
      }
    }
    ```

    ```ts title="src/routines/routines.module.ts" showLineNumbers
    import { Module } from '@nestjs/common';
    import { RoutinesRepository } from './routines.repository.js';
    import { RoutinesResolver } from './routines.resolver.js';
    import { RoutinesService } from './routines.service.js';

    @Module({
      providers: [RoutinesResolver, RoutinesService, RoutinesRepository],
    })
    export class RoutinesModule {}
    ```
  </Step>

  <Step number="8">
    ### 2.8 Habilitar CORS, ValidationPipe y levantar el servidor en el puerto 4000

    Actualiza `src/main.ts` para habilitar CORS, activar el `ValidationPipe` global y escuchar en el puerto `4000`.

    ```ts title="src/main.ts" showLineNumbers
    import { ValidationPipe } from '@nestjs/common';
    import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module.js';

    async function bootstrap() {
      const app = await NestFactory.create(AppModule);
      app.enableCors();
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          transform: true,
        }),
      );
      await app.listen(process.env.PORT ?? 4000);
    }
    await bootstrap();
    ```

    Inicia el servidor en modo desarrollo:

    ```bash title="Terminal (en back/)" showLineNumbers
    npm run start:dev
    ```

    Al arrancar, NestJS generará automáticamente `src/schema.gql`. Abre `http://localhost:4000/graphql` en tu navegador para ver **Apollo Sandbox** y prueba tu primera consulta y mutación:

    ```graphql title="Prueba en Apollo Sandbox" showLineNumbers
    query ObtenerRutinas {
      routines {
        id
        name
        description
        createdAt
      }
    }

    mutation CrearRutina {
      createRoutine(
        input: {
          name: "Movilidad Matinal"
          description: "Estiramientos dinámicos de 15 minutos."
        }
      ) {
        id
        name
        createdAt
      }
    }
    ```
  </Step>
</StepByStep>

---

## 3. Guía paso a paso: Conectar el Frontend (Next.js + Clean Architecture)

Ahora conectaremos el repositorio de Next.js con el backend GraphQL. Gracias a que la feature `routines` sigue **Clean Architecture**, los casos de uso (`GetRoutinesUseCase` y `CreateRoutineUseCase`), los hooks y los componentes no necesitan ninguna modificación.

<StepByStep>
  <Step number="1">
    ### 3.1 Clonar el repositorio base desde la rama correcta

    Desde la carpeta `graphql-sandbox`, clona el repositorio oficial partiendo exactamente de la rama `week-15/next-testing-deploy`, y crea una nueva rama local `week-16/graphql`.

    ```bash title="Terminal (en graphql-sandbox/)" showLineNumbers
    git clone --branch week-15/next-testing-deploy https://github.com/Kelocoes/compunet3-202602.git front
    cd front
    git checkout -b week-16/graphql
    npm install
    ```

    :::warning[No hagas push a esta rama]
    La rama `week-16/graphql` es tu espacio de trabajo local para completar este laboratorio. No ejecutes `git push` sobre el repositorio base.
    :::
  </Step>

  <Step number="2">
    ### 3.2 Crear el Datasource de GraphQL

    Crea `src/features/routines/infrastructure/datasources/routine-graphql-datasource.ts` implementando la interfaz existente `RoutineDatasource` (`fetchRoutines`, `fetchRoutineById` y `createRoutine`).

    Presta atención a un detalle clave de GraphQL: **un servidor GraphQL puede responder HTTP `200 OK` aunque la operación haya fallado** y devuelva un arreglo `errors`. Por eso verificamos tanto `response.ok` como `payload.errors`.

    ```ts title="src/features/routines/infrastructure/datasources/routine-graphql-datasource.ts" showLineNumbers
    import { RoutineDatasource } from './routine-datasource.interface';
    import { RoutineResponseDto, CreateRoutineDto } from '../dtos/routine.dto';

    interface GraphQLRoutine {
        id: number;
        name: string;
        description?: string | null;
        createdAt: string;
    }

    interface GraphQLResponse<T> {
        data?: T;
        errors?: Array<{ message: string }>;
    }

    const DEFAULT_GRAPHQL_URL = 'http://localhost:4000/graphql';

    export class RoutineGraphQLDatasource implements RoutineDatasource {
        private readonly endpoint: string;

        constructor(endpoint: string = process.env.GRAPHQL_URL ?? DEFAULT_GRAPHQL_URL) {
            this.endpoint = endpoint;
        }

        private async request<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, variables }),
                cache: 'no-store',
            });

            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status} al consultar GraphQL`);
            }

            const payload: GraphQLResponse<T> = await response.json();

            if (payload.errors && payload.errors.length > 0) {
                throw new Error(payload.errors.map((e) => e.message).join(' | '));
            }

            if (!payload.data) {
                throw new Error('La respuesta de GraphQL no contiene datos.');
            }

            return payload.data;
        }

        private toResponseDto(item: GraphQLRoutine): RoutineResponseDto {
            return {
                id: item.id,
                name: item.name,
                description: item.description ?? undefined,
                created_at: item.createdAt,
            };
        }

        async fetchRoutines(): Promise<RoutineResponseDto[]> {
            const query = `
                query FetchRoutines {
                    routines {
                        id
                        name
                        description
                        createdAt
                    }
                }
            `;

            const data = await this.request<{ routines: GraphQLRoutine[] }>(query);
            return data.routines.map((r) => this.toResponseDto(r));
        }

        async fetchRoutineById(id: number): Promise<RoutineResponseDto | null> {
            const query = `
                query FetchRoutineById($id: Int!) {
                    routine(id: $id) {
                        id
                        name
                        description
                        createdAt
                    }
                }
            `;

            const data = await this.request<{ routine: GraphQLRoutine | null }>(query, { id });
            return data.routine ? this.toResponseDto(data.routine) : null;
        }

        async createRoutine(dto: CreateRoutineDto): Promise<RoutineResponseDto> {
            const mutation = `
                mutation CreateRoutine($input: CreateRoutineInput!) {
                    createRoutine(input: $input) {
                        id
                        name
                        description
                        createdAt
                    }
                }
            `;

            const data = await this.request<{ createRoutine: GraphQLRoutine }>(mutation, {
                input: {
                    name: dto.name,
                    description: dto.description,
                },
            });

            return this.toResponseDto(data.createRoutine);
        }
    }
    ```
  </Step>

  <Step number="3">
    ### 3.3 Implementar el Repositorio para GraphQL

    Crea `src/features/routines/infrastructure/repositories/routine-graphql.repository.impl.ts` implementando `RoutineRepository`. Su función es recibir los DTOs del datasource y traducirlos a entidades `Routine` del dominio usando `RoutineMapper`.

    ```ts title="src/features/routines/infrastructure/repositories/routine-graphql.repository.impl.ts" showLineNumbers
    import { Routine } from '../../domain/entities/routine';
    import { CreateRoutineParams, RoutineRepository } from '../../domain/repositories/routine.repository';
    import { RoutineDatasource } from '../datasources/routine-datasource.interface';
    import { RoutineMapper } from '../mappers/routine.mapper';

    export class RoutineGraphQLRepositoryImpl implements RoutineRepository {
        constructor(private readonly datasource: RoutineDatasource) {}

        async getAll(): Promise<Routine[]> {
            const dtos = await this.datasource.fetchRoutines();
            return dtos.map((dto) => RoutineMapper.toDomain(dto));
        }

        async getById(id: number): Promise<Routine | null> {
            const dto = await this.datasource.fetchRoutineById(id);
            if (!dto) {
                return null;
            }
            return RoutineMapper.toDomain(dto);
        }

        async create(params: CreateRoutineParams): Promise<Routine> {
            const dtoToSend = RoutineMapper.toDto(params);
            const createdDto = await this.datasource.createRoutine(dtoToSend);
            return RoutineMapper.toDomain(createdDto);
        }
    }
    ```
  </Step>

  <Step number="4">
    ### 3.4 Conectar las nuevas piezas en el contenedor de dependencias

    Abre `src/features/routines/di/routine.container.ts` y reemplaza el datasource mock por `RoutineGraphQLDatasource` y `RoutineGraphQLRepositoryImpl`.

    ```ts title="src/features/routines/di/routine.container.ts" showLineNumbers
    import 'server-only';
    import { RoutineGraphQLDatasource } from '../infrastructure/datasources/routine-graphql-datasource';
    import { RoutineGraphQLRepositoryImpl } from '../infrastructure/repositories/routine-graphql.repository.impl';
    import { GetRoutinesUseCase } from '../domain/usecases/get-routines.usecase';
    import { CreateRoutineUseCase } from '../domain/usecases/create-routine.usecase';

    const datasource = new RoutineGraphQLDatasource();
    const routineRepository = new RoutineGraphQLRepositoryImpl(datasource);

    export const routineContainer = {
        getRoutines: new GetRoutinesUseCase(routineRepository),
        createRoutine: new CreateRoutineUseCase(routineRepository),
    };

    export type RoutineContainer = typeof routineContainer;
    ```
  </Step>

  <Step number="5">
    ### 3.5 Probar la integración completa

    Con el backend NestJS corriendo en el puerto `4000`, inicia el frontend en una segunda terminal (el script `dev` del proyecto corre en el puerto `3001`):

    ```bash title="Terminal (en front/)" showLineNumbers
    npm run dev
    ```

    Abre `http://localhost:3001`, inicia sesión con el usuario de prueba y navega a `/routines`:
    1. Verás cargadas las tres rutinas iniciales provenientes del backend NestJS a través de la query `routines`.
    2. Crea una rutina nueva desde el formulario: la mutación `createRoutine` la registrará en memoria en el backend.
    3. Recarga la página o vuelve a consultar `routines` en **Apollo Sandbox** (`http://localhost:4000/graphql`) para comprobar que la rutina creada desde Next.js ya vive en el servidor NestJS.
  </Step>
</StepByStep>

---

## 4. Mapa completo: de Next.js (Clean Architecture) a NestJS (GraphQL)

Ahora que ya tienes ambos proyectos funcionando, recorre el mapa completo de extremo a extremo. A la izquierda verás las capas de **Clean Architecture** en Next.js (`:3001` en desarrollo, `:3000` estándar) y a la derecha el backend en **NestJS + Apollo** (`:4000`), junto con la **transformación exacta del dato** en cada frontera y un explorador tipo IDE (`tree -L` + líneas activas) para inspeccionar cada archivo involucrado.

:::tip[Recomendación visual]
Este diagrama reúne todas las capas y archivos de ambos proyectos. Pulsa el botón **Pantalla completa** en la esquina superior derecha del recuadro para explorarlo con total comodidad, y haz clic sobre cualquier archivo del `tree` inferior para revisar su código.
:::

<InteractiveFrame
  src="/interactive/computacion-3/semana-16/flujo-completo-front-back/index.html"
  title="Mapa completo de extremo a extremo: flujo de archivos, puertos, transformación de datos y tree -L entre Next.js (Clean Architecture) y NestJS (GraphQL)"
  height={920}
/>

---

## Cuestionario de Autoevaluación

<Quiz id="compunet3-s16-graphql-nestjs-quiz">
  <Question title="En el enfoque Code First de @nestjs/graphql, ¿qué función cumple el archivo schema.gql?">
    <Option>Debe escribirse y mantenerse manualmente antes de crear los resolvers.</Option>
    <Option correct>Se genera automáticamente a partir de las clases decoradas con @ObjectType, @InputType y @Resolver.</Option>
    <Option>Reemplaza al archivo app.module.ts en la configuración de Apollo.</Option>
    <Option>Solo se utiliza cuando se trabaja con bases de datos NoSQL.</Option>
  </Question>
  <Question title="¿Qué opción permite activar Apollo Sandbox en lugar de GraphiQL dentro de GraphQLModule.forRoot en NestJS?">
    <Option>playground: true junto con ApolloDriver.</Option>
    <Option>sandbox: true sin necesidad de plugins.</Option>
    <Option correct>graphiql: false y plugins: [ApolloServerPluginLandingPageLocalDefault()].</Option>
    <Option>autoSchemaFile: false en el módulo raíz.</Option>
  </Question>
  <Question title="¿Por qué se debe indicar @Field(() =&gt; Int) en el campo id: number de la clase Routine?">
    <Option>Porque TypeScript no soporta números enteros en clases.</Option>
    <Option correct>Porque TypeScript solo tiene el tipo number y, si se omite, GraphQL lo inferiría como Float! en lugar de Int!.</Option>
    <Option>Para que el campo pueda recibir valores null.</Option>
    <Option>Porque @ObjectType exige que todos los campos lleven una función flecha.</Option>
  </Question>
  <Question title="Si en TypeScript escribimos description?: string, ¿qué hace falta para que en schema.gql el campo no sea obligatorio?">
    <Option>Nada, el signo ? en TypeScript basta para GraphQL.</Option>
    <Option>Cambiar el decorador a @OptionalField().</Option>
    <Option correct>Pasar &#123; nullable: true &#125; dentro del decorador @Field().</Option>
    <Option>Declarar el campo como string | undefined en el resolver.</Option>
  </Question>
  <Question title="¿Cuál es la diferencia principal entre @ObjectType() y @InputType()?">
    <Option>@ObjectType() solo funciona con TypeORM y @InputType() solo con memoria.</Option>
    <Option correct>@ObjectType() define tipos de salida que devuelve la API, mientras @InputType() define objetos de entrada que reciben los argumentos.</Option>
    <Option>@InputType() no permite usar decoradores de class-validator.</Option>
    <Option>No existe diferencia; ambos generan type en schema.gql.</Option>
  </Question>
  <Question title="¿Qué capa de NestJS reemplaza al @Controller() tradicional cuando exponemos una API con GraphQL?">
    <Option>El Repository.</Option>
    <Option>El Service.</Option>
    <Option correct>El Resolver (@Resolver).</Option>
    <Option>El Module.</Option>
  </Question>
  <Question title="¿Por qué en RoutineGraphQLDatasource debemos revisar payload.errors además de response.ok?">
    <Option>Porque fetch no soporta el método POST para GraphQL.</Option>
    <Option correct>Porque los servidores GraphQL suelen responder HTTP 200 OK incluso cuando la consulta o validación falla y devuelve errores en el JSON.</Option>
    <Option>Porque Next.js convierte los errores 500 en respuestas vacías.</Option>
    <Option>Para que Apollo Sandbox pueda autocompletar el schema.</Option>
  </Question>
  <Question title="Al conectar Next.js con GraphQL manteniendo Clean Architecture, ¿qué archivos de la capa de dominio tuvieron que modificarse?">
    <Option>Routine y GetRoutinesUseCase.</Option>
    <Option>CreateRoutineUseCase y RoutineRepository.</Option>
    <Option correct>Ninguno; solo se agregaron el datasource y el repositorio en infrastructure y se conectaron en routine.container.ts.</Option>
    <Option>Todos los componentes de presentación y los hooks de Redux.</Option>
  </Question>
  <Question title="¿Qué ocurre cuando un cliente envía un CreateRoutineInput con name de 2 caracteres estando activo ValidationPipe?">
    <Option>Se guarda en memoria y el frontend muestra una advertencia.</Option>
    <Option>Apollo ignora el decorador @MinLength(3) porque es exclusivo de REST.</Option>
    <Option correct>ValidationPipe rechaza la petición antes de que llegue a RoutinesService y Apollo responde con el error en errors[].</Option>
    <Option>NestJS recorta el texto automáticamente.</Option>
  </Question>
  <Question title="Desde qué rama debe clonarse el repositorio del frontend antes de crear la rama week-16/graphql?">
    <Option>main</Option>
    <Option>week-14/auth</Option>
    <Option correct>week-15/next-testing-deploy</Option>
    <Option>week-16/nestjs</Option>
  </Question>
</Quiz>
