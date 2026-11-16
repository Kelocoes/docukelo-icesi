---
sidebar_position: 1
description: "Step-by-step configuration of GraphQL in NestJS with Apollo Server and Apollo Sandbox (Code First), creating resolvers, object types, and inputs, and connecting from Next.js while preserving Clean Architecture."
---

# GraphQL in NestJS with Apollo and Clean Architecture

In the previous session (*Week 15: Introduction to GraphQL*), we understood the problem GraphQL solves compared to REST, how to read an SDL schema, and how queries and mutations work. Now we move on to the **real implementation**: we will build a backend in **NestJS** with **Apollo Server** and **Apollo Sandbox**, and then connect it to our **Next.js** frontend without breaking the **Clean Architecture** you already have configured.

You already know what a `Service`, a `Controller`, and a `Repository` are in NestJS. The good news is that **you do not have to reinvent your business layer or your repository**: in GraphQL, the **Resolver** simply replaces the Controller as the entry point, while the `Service` and the `Repository` (which we will simulate in memory to keep the focus on GraphQL) continue working the same way.

:::note[Interactive graphics]
The interactive graphics in this chapter are shown in Spanish.
:::

---

## 1. Conceptual Foundations in NestJS

Before writing code, locate what changes and what stays the same when moving from REST to GraphQL. Explore the full journey of a request in the following interactive diagram:

<InteractiveFrame
  src="/interactive/computacion-3/semana-16/arquitectura-nestjs-graphql/index.html"
  title="Architecture of a GraphQL request between Next.js with Clean Architecture and NestJS with Apollo Server"
  height={640}
/>

### What each piece does on the backend

| Concept | Role in NestJS + GraphQL | REST Equivalent |
| :--- | :--- | :--- |
| **ApolloDriver** | Engine that receives `POST /graphql` requests, validates the query against the schema, and executes resolvers. | Express/Fastify HTTP router |
| **Schema (`schema.gql`)** | Typed contract of types, queries, and mutations available in the API. | OpenAPI / Swagger documentation |
| **Resolver (`@Resolver`)** | Class that connects schema operations (`@Query`, `@Mutation`) to your services. | `@Controller()` with `@Get()`, `@Post()` |
| **ObjectType (`@ObjectType`)** | Decorated TypeScript class that defines which fields a type can return in GraphQL. | Response DTO |
| **InputType (`@InputType`)** | Decorated TypeScript class that defines what data a mutation or query accepts as input. | Request DTO (`@Body()`) |

### Code First vs. Schema First

NestJS offers two ways to build a GraphQL schema:

| Approach | How it works | When it fits |
| :--- | :--- | :--- |
| **Code First** | You write TypeScript classes with decorators (`@ObjectType`, `@Field`, `@InputType`) and NestJS automatically generates `schema.gql` on startup. | NestJS projects with TypeScript, `class-validator`, or TypeORM: avoids duplicating types between TS and SDL. |
| **Schema First** | You manually write `.graphql` SDL files and then create resolvers or generate TypeScript interfaces from them. | Teams where the SDL contract is designed upfront in a shared repository across multiple languages. |

In this course we use **Code First** because it integrates naturally with NestJS decorators and `class-validator`. Watch how each TypeScript decorator translates directly into the generated `schema.gql`:

<InteractiveFrame
  src="/interactive/computacion-3/semana-16/code-first-schema/index.html"
  title="Code First mapping in NestJS: from TypeScript decorators to schema.gql"
  height={620}
/>

### What Resolvers are and how they connect with Clean Architecture

A **Resolver** is a class annotated with `@Resolver()` whose sole responsibility is to receive a GraphQL operation, extract its arguments with `@Args()`, and delegate the work to the corresponding `Service`:

- **`@Query(() => [Routine], { name: 'routines' })`**: exposes a read operation on the `Query` root type.
- **`@Mutation(() => Routine, { name: 'createRoutine' })`**: exposes a write operation on the `Mutation` root type.
- **`@Args('input')`**: extracts the argument sent in the query or mutation (and passes through `ValidationPipe` if enabled).
- **`@ResolveField()`**: used when a nested field (for example, `author` inside `Post`) needs to run on demand only if the client requests it in the query.

On the Next.js frontend, **Clean Architecture** shields the domain (`Routine`, `GetRoutinesUseCase`, `CreateRoutineUseCase`) and the presentation layer (components, hooks, Server Actions) from network details. To migrate from mock data to GraphQL, **we only add a new Datasource and a new Repository in the infrastructure layer** and wire them in `routine.container.ts`:

<InteractiveFrame
  src="/interactive/computacion-3/semana-16/resolver-y-clean-arch/index.html"
  title="Line-by-line flow between RoutineGraphQLRepositoryImpl, RoutineGraphQLDatasource, and RoutinesResolver"
  height={680}
/>

---

## 2. Step-by-Step Guide: NestJS Backend with Apollo Sandbox

Let us create an isolated workspace with two folders inside a working directory (`graphql-sandbox`): `back/` for the NestJS server and `front/` for the Next.js client.

<StepByStep>
  <Step number="1">
    ### 2.1 Create the workspace folder and the NestJS project

    Create the `graphql-sandbox` folder, navigate into it, and scaffold a new NestJS project inside the `back` subfolder. We will use port `4000` for the backend so it does not collide with the Next.js frontend.

    ```bash title="Terminal" showLineNumbers
    mkdir graphql-sandbox
    cd graphql-sandbox
    npx @nestjs/cli@latest new back --package-manager npm --skip-git --strict
    cd back
    ```

    :::note[About the NestJS version]
    The current CLI installs **NestJS 12** with `@nestjs/core ^12`, Express 5, and ESM support (`"type": "module"` in `package.json`, meaning relative imports use the `.js` extension). If you work on an older project using NestJS 10 or 11, `GraphQLModule` options use `@apollo/server` v4 and `@nestjs/graphql` v12/v13.
    :::
  </Step>

  <Step number="2">
    ### 2.2 Install GraphQL, Apollo, and validation dependencies

    Install the official GraphQL package for NestJS, the Apollo driver, the `@apollo/server` engine, the Express 5 adapter, and `class-validator` to validate `@InputType()` classes.

    ```bash title="Terminal (in back/)" showLineNumbers
    npm install @nestjs/graphql @nestjs/apollo @apollo/server @as-integrations/express5 graphql class-validator class-transformer
    ```
  </Step>

  <Step number="3">
    ### 2.3 Configure GraphQLModule with Apollo Sandbox in AppModule

    By default, `@nestjs/graphql` v14 enables **GraphiQL**. To use **Apollo Sandbox** (Apollo's modern interactive IDE), set `graphiql: false` and add the `ApolloServerPluginLandingPageLocalDefault()` plugin.

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
        // Configures GraphQL in Code First mode with Apollo Server and Apollo Sandbox
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

    :::warning[If you use Helmet in production]
    If your project enables `helmet`, its Content Security Policy (CSP) will block the scripts and iframes from the Apollo Sandbox CDN. In that case, configure `contentSecurityPolicy` to allow `https://embeddable-sandbox.cdn.apollographql.com`, `https://apollo-server-landing-page.cdn.apollographql.com`, and `https://sandbox.embed.apollographql.com`.
    :::
  </Step>

  <Step number="4">
    ### 2.4 Define the Routine ObjectType

    Create `src/routines/entities/routine.entity.ts`. The `@ObjectType()` decorator registers the class in the schema and `@Field()` exposes each property.

    ```ts title="src/routines/entities/routine.entity.ts" showLineNumbers
    import { Field, Int, ObjectType } from '@nestjs/graphql';

    @ObjectType({ description: 'Training routine registered in the system' })
    export class Routine {
      // Specify () => Int so GraphQL does not generate Float!
      @Field(() => Int, { description: 'Unique identifier of the routine' })
      id!: number;

      @Field({ description: 'Routine name' })
      name!: string;

      // nullable: true marks the field as optional in schema.gql (String without !)
      @Field({ nullable: true, description: 'Optional description of the routine' })
      description?: string;

      @Field({ description: 'Creation timestamp in ISO 8601 format' })
      createdAt!: string;
    }
    ```
  </Step>

  <Step number="5">
    ### 2.5 Define the InputType and validation rules

    Create `src/routines/dto/create-routine.input.ts`. We use `@InputType()` so the class can be passed as an argument in a mutation, combined with `class-validator` decorators.

    ```ts title="src/routines/dto/create-routine.input.ts" showLineNumbers
    import { Field, InputType } from '@nestjs/graphql';
    import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

    @InputType({ description: 'Data required to create a new routine' })
    export class CreateRoutineInput {
      @Field({ description: 'Routine name (minimum 3 characters)' })
      @IsString()
      @MinLength(3, { message: 'El nombre de la rutina debe tener al menos 3 caracteres.' })
      @MaxLength(100, { message: 'El nombre de la rutina no puede exceder los 100 caracteres.' })
      name!: string;

      @Field({ nullable: true, description: 'Optional description (minimum 10 characters if provided)' })
      @IsOptional()
      @IsString()
      @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres si se proporciona.' })
      description?: string;
    }
    ```
  </Step>

  <Step number="6">
    ### 2.6 Create the in-memory repository and the service

    We simulate the database using an in-memory array inside `RoutinesRepository` to keep the focus on the GraphQL layer. `RoutinesService` remains decoupled from GraphQL.

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
    ### 2.7 Create the Resolver and register RoutinesModule

    The resolver exposes the two queries (`routines` and `routine`) and the mutation (`createRoutine`).

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
        description: 'Fetches the list of all registered routines',
      })
      findAll(): Routine[] {
        return this.routinesService.findAll();
      }

      @Query(() => Routine, {
        name: 'routine',
        nullable: true,
        description: 'Finds a routine by its numeric identifier',
      })
      findOne(@Args('id', { type: () => Int }) id: number): Routine | null {
        return this.routinesService.findOne(id);
      }

      @Mutation(() => Routine, {
        name: 'createRoutine',
        description: 'Creates a new routine in the system',
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
    ### 2.8 Enable CORS, ValidationPipe, and start the server on port 4000

    Update `src/main.ts` to enable CORS, register the global `ValidationPipe`, and listen on port `4000`.

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

    Start the server in development mode:

    ```bash title="Terminal (in back/)" showLineNumbers
    npm run start:dev
    ```

    When starting up, NestJS automatically generates `src/schema.gql`. Open `http://localhost:4000/graphql` in your browser to see **Apollo Sandbox** and test your first query and mutation:

    ```graphql title="Testing in Apollo Sandbox" showLineNumbers
    query GetRoutines {
      routines {
        id
        name
        description
        createdAt
      }
    }

    mutation CreateRoutine {
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

## 3. Step-by-Step Guide: Connecting the Frontend (Next.js + Clean Architecture)

Now we will connect the Next.js repository to the GraphQL backend. Because the `routines` feature follows **Clean Architecture**, the use cases (`GetRoutinesUseCase` and `CreateRoutineUseCase`), hooks, and UI components require zero changes.

<StepByStep>
  <Step number="1">
    ### 3.1 Clone the base repository from the right branch

    From the `graphql-sandbox` folder, clone the official repository starting specifically from the `week-15/next-testing-deploy` branch, and create a new local branch `week-16/graphql`.

    ```bash title="Terminal (in graphql-sandbox/)" showLineNumbers
    git clone --branch week-15/next-testing-deploy https://github.com/Kelocoes/compunet3-202602.git front
    cd front
    git checkout -b week-16/graphql
    npm install
    ```

    :::warning[Do not push to this branch]
    The `week-16/graphql` branch is your local workspace to complete this lab. Do not run `git push` against the base repository.
    :::
  </Step>

  <Step number="2">
    ### 3.2 Create the GraphQL Datasource

    Create `src/features/routines/infrastructure/datasources/routine-graphql-datasource.ts` implementing the existing `RoutineDatasource` interface (`fetchRoutines`, `fetchRoutineById`, and `createRoutine`).

    Pay attention to a key detail about GraphQL: **a GraphQL server can return HTTP `200 OK` even when the operation failed** and include an `errors` array. That is why we check both `response.ok` and `payload.errors`.

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
                throw new Error(`HTTP error ${response.status} while querying GraphQL`);
            }

            const payload: GraphQLResponse<T> = await response.json();

            if (payload.errors && payload.errors.length > 0) {
                throw new Error(payload.errors.map((e) => e.message).join(' | '));
            }

            if (!payload.data) {
                throw new Error('The GraphQL response contains no data.');
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
    ### 3.3 Implement the GraphQL Repository

    Create `src/features/routines/infrastructure/repositories/routine-graphql.repository.impl.ts` implementing `RoutineRepository`. Its role is to receive DTOs from the datasource and translate them into domain `Routine` entities using `RoutineMapper`.

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
    ### 3.4 Wire the new pieces in the dependency container

    Open `src/features/routines/di/routine.container.ts` and replace the mock datasource with `RoutineGraphQLDatasource` and `RoutineGraphQLRepositoryImpl`.

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
    ### 3.5 Test the full integration

    With the NestJS backend running on port `4000`, start the frontend in a second terminal (the project's `dev` script runs on port `3001`):

    ```bash title="Terminal (in front/)" showLineNumbers
    npm run dev
    ```

    Open `http://localhost:3001`, log in with the test user, and navigate to `/routines`:
    1. You will see the three initial routines loaded from the NestJS backend through the `routines` query.
    2. Create a new routine from the form: the `createRoutine` mutation will store it in memory on the backend.
    3. Reload the page or query `routines` again in **Apollo Sandbox** (`http://localhost:4000/graphql`) to confirm the routine created from Next.js now lives on the NestJS server.
  </Step>
</StepByStep>

---

## 4. Full Map: from Next.js (Clean Architecture) to NestJS (GraphQL)

Now that both projects are running, walk through the complete end-to-end map. On the left you will see the **Clean Architecture** layers in Next.js (`:3001` in dev, `:3000` standard) and on the right the **NestJS + Apollo** backend (`:4000`), along with the **exact data transformation** at each boundary and an IDE-style explorer (`tree -L` + active lines) to inspect every file involved.

:::tip[Visual recommendation]
This diagram brings together all layers and files from both projects. Click the **Fullscreen** button in the top-right corner of the frame to explore it comfortably, and click any file in the `tree` below to inspect its code.
:::

<InteractiveFrame
  src="/interactive/computacion-3/semana-16/flujo-completo-front-back/index.html"
  title="Complete end-to-end map: file flow, ports, data transformation, and tree -L between Next.js (Clean Architecture) and NestJS (GraphQL)"
  height={920}
/>

---

## Self-Assessment Quiz

<Quiz id="compunet3-s16-graphql-nestjs-quiz">
  <Question title="In the Code First approach of @nestjs/graphql, what is the role of the schema.gql file?">
    <Option>It must be written and maintained manually before creating resolvers.</Option>
    <Option correct>It is automatically generated from classes decorated with @ObjectType, @InputType, and @Resolver.</Option>
    <Option>It replaces app.module.ts in the Apollo configuration.</Option>
    <Option>It is only used when working with NoSQL databases.</Option>
  </Question>
  <Question title="Which option enables Apollo Sandbox instead of GraphiQL inside GraphQLModule.forRoot in NestJS?">
    <Option>playground: true together with ApolloDriver.</Option>
    <Option>sandbox: true with no plugins needed.</Option>
    <Option correct>graphiql: false and plugins: [ApolloServerPluginLandingPageLocalDefault()].</Option>
    <Option>autoSchemaFile: false in the root module.</Option>
  </Question>
  <Question title="Why must we specify @Field(() =&gt; Int) on the id: number field in the Routine class?">
    <Option>Because TypeScript does not support integer numbers in classes.</Option>
    <Option correct>Because TypeScript only has the number type and, if omitted, GraphQL would infer Float! instead of Int!.</Option>
    <Option>So that the field can accept null values.</Option>
    <Option>Because @ObjectType requires every field to take an arrow function.</Option>
  </Question>
  <Question title="If we write description?: string in TypeScript, what is required so that the field is not mandatory in schema.gql?">
    <Option>Nothing, the ? token in TypeScript is enough for GraphQL.</Option>
    <Option>Change the decorator to @OptionalField().</Option>
    <Option correct>Pass &#123; nullable: true &#125; inside the @Field() decorator.</Option>
    <Option>Declare the field as string | undefined in the resolver.</Option>
  </Question>
  <Question title="What is the main difference between @ObjectType() and @InputType()?">
    <Option>@ObjectType() only works with TypeORM and @InputType() only with in-memory storage.</Option>
    <Option correct>@ObjectType() defines output types returned by the API, whereas @InputType() defines input objects received by arguments.</Option>
    <Option>@InputType() does not allow class-validator decorators.</Option>
    <Option>There is no difference; both generate type in schema.gql.</Option>
  </Question>
  <Question title="Which NestJS layer replaces the traditional @Controller() when exposing an API with GraphQL?">
    <Option>The Repository.</Option>
    <Option>The Service.</Option>
    <Option correct>The Resolver (@Resolver).</Option>
    <Option>The Module.</Option>
  </Question>
  <Question title="Why must RoutineGraphQLDatasource check payload.errors in addition to response.ok?">
    <Option>Because fetch does not support the POST method for GraphQL.</Option>
    <Option correct>Because GraphQL servers often respond HTTP 200 OK even when the query or validation fails and return errors in the JSON body.</Option>
    <Option>Because Next.js converts 500 errors into empty responses.</Option>
    <Option>So Apollo Sandbox can autocomplete the schema.</Option>
  </Question>
  <Question title="When connecting Next.js to GraphQL while preserving Clean Architecture, which files in the domain layer had to be modified?">
    <Option>Routine and GetRoutinesUseCase.</Option>
    <Option>CreateRoutineUseCase and RoutineRepository.</Option>
    <Option correct>None; only the datasource and repository were added in infrastructure and wired in routine.container.ts.</Option>
    <Option>All presentation components and Redux hooks.</Option>
  </Question>
  <Question title="What happens when a client sends a CreateRoutineInput with a 2-character name while ValidationPipe is active?">
    <Option>It is saved in memory and the frontend displays a warning.</Option>
    <Option>Apollo ignores the @MinLength(3) decorator because it is exclusive to REST.</Option>
    <Option correct>ValidationPipe rejects the request before it reaches RoutinesService and Apollo responds with the error in errors[].</Option>
    <Option>NestJS trims the text automatically.</Option>
  </Question>
  <Question title="From which branch must the frontend repository be cloned before creating the week-16/graphql branch?">
    <Option>main</Option>
    <Option>week-14/auth</Option>
    <Option correct>week-15/next-testing-deploy</Option>
    <Option>week-16/nestjs</Option>
  </Question>
</Quiz>
