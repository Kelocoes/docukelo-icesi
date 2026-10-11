---
sidebar_position: 1
---

# Application Structure and Providers in NestJS

Up to this point, we have explored how to design relational databases and model database tables into code using TypeORM entities. However, in a professional web backend, entities are just one part of a much larger architectural engine.

To build a scalable, maintainable, and robust enterprise system, it is essential to organize code following a **layered architecture** and understand the mechanism that connects these layers without tight coupling: **Inversion of Control (IoC)** and **Providers**.

---

## Layered Architecture in NestJS

A modern web application never connects the user interface directly to the database. Instead, it distributes responsibilities across well-defined tiers so that each layer fulfills a single purpose.

To understand how data flows through the application, we can examine the system across two abstraction levels:

<img src="/img/desarrollo-entornos-digitales-web/nest-layered-architecture.svg" alt="Layered Architecture in NestJS" width="100%" />

---

## Tight Coupling vs. Inversion of Control

Now that we understand the individual layers, a fundamental question emerges: **how do controllers, services, and repositories connect to each other?**

### Traditional Coupled Approach (Manual Instantiation with `new`)

In traditional object-oriented programming without a dependency container, when a class requires another class, it instantiates it directly using the `new` operator:

```typescript title="users.controller.ts (Without Inversion of Control)" showLineNumbers
export class UsersController {
  private usersService: UsersService;

  constructor() {
    // Direct tight coupling: the controller is responsible for creating the service
    this.usersService = new UsersService();
  }

  getUsers() {
    return this.usersService.findAll();
  }
}
```

This pattern introduces severe architectural drawbacks:
* **Rigid coupling**: If the constructor of `UsersService` changes in the future (for instance, requiring a database connection, config service, or repository), every controller instantiating it with `new` will break and require manual refactoring.
* **Impossibility of unit testing**: It becomes impossible to isolate the controller for unit tests with a mock service, because the controller forcibly instantiates the real dependency.
* **Inefficient memory duplication**: Every consumer creates a fresh instance of the dependency, duplicating resources and state.

---

### Inversion of Control (IoC) and Dependency Injection (DI)

To solve this problem, NestJS implements the **Inversion of Control (IoC)** design pattern. The consuming class is no longer tasked with "manufacturing" its dependencies; instead, it simply **declares its requirements as constructor parameters**.

The **NestJS IoC Container** takes responsibility for instantiating the components, resolving the dependency graph in the correct order, and injecting them ready for use:

<img src="/img/desarrollo-entornos-digitales-web/nest-ioc-container.svg" alt="NestJS IoC Container and Dependency Provisioning" width="100%" />

| Criterion | Manual Instantiation (`new`) | Dependency Injection (IoC) |
|---|---|---|
| **Creation Responsibility** | Each consuming class creates its dependencies | The NestJS IoC Container constructs them automatically |
| **Coupling Level** | High (classes depend on concrete implementations) | Low (classes depend on decoupled contracts or abstractions) |
| **Unit Testing** | Very difficult (cannot substitute mocks) | Straightforward (simply pass simulated objects in the constructor) |
| **Maintainability** | Fragile when constructor signatures change | Centralized and managed across NestJS modules |

---

## What is a Provider in NestJS?

In NestJS, a **Provider** is any plain TypeScript class decorated with `@Injectable()` that can be managed by the IoC container and injected as a dependency into other application components.

The vast majority of classes containing operational logic in NestJS are providers:
* **Services (`Services`)**: Pure business logic and domain rules.
* **Repositories (`Repositories`)**: Database interaction and TypeORM table management.
* **API Clients & Adapters**: External service communication (payment gateways, mailers, third-party APIs).
* **Helpers & Utilities**: Reusable helper functions and calculation modules.

### The `@Injectable()` Decorator

The `@Injectable()` decorator attaches reflection metadata to the class, instructing the NestJS runtime: *"this class is a provider and can be injected into any component that requests it"*.

```typescript title="users.service.ts" showLineNumbers
import { Injectable } from '@nestjs/common';

export interface User {
  id: number;
  name: string;
  email: string;
}

// Mark the class as a NestJS managed provider
@Injectable()
export class UsersService {
  private readonly users: User[] = [
    { id: 1, name: 'Ada Lovelace', email: 'ada@icesi.edu.co' },
    { id: 2, name: 'Alan Turing', email: 'alan@icesi.edu.co' },
  ];

  findAll(): User[] {
    return this.users;
  }

  findById(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }
}
```

---

## Constructor-Based Dependency Injection

NestJS predominantly utilizes **constructor-based injection**. Required dependencies are declared as parameters inside the constructor signature of the consuming class.

Leveraging TypeScript parameter properties, prefixing an access modifier such as `private readonly` automatically declares and initializes the class member variable in a single step:

```typescript title="users.controller.ts" showLineNumbers
import { Controller, Get, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { UsersService, User } from './users.service';

@Controller('users')
export class UsersController {
  // Constructor injection:
  // NestJS analyzes the 'UsersService' type and automatically injects the instance
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll(): User[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): User {
    const user = this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
```

:::tip[Best Practice: The readonly Modifier]
Marking injected dependencies as `readonly` is a recommended best practice. It prevents accidental reassignments to the dependency reference throughout the lifecycle of the class.
:::

---

## Modular Architecture: The Structure of `@Module()`

For the NestJS IoC container to know which providers exist and who is allowed to use them, they must be registered within a **Module**.

A module in NestJS is a class decorated with `@Module()`. It acts as an encapsulation boundary grouping cohesive controllers and providers:

<img src="/img/desarrollo-entornos-digitales-web/nest-module-structure.svg" alt="@Module Property Structure in NestJS" width="100%" />

### The Four Main Properties of `@Module()`

The `@Module()` decorator takes a configuration object with four primary arrays:

1. **`controllers: [ ... ]`**:
   - Declares the controllers belonging to this module.
   - NestJS instantiates them and registers them with the HTTP router to listen for incoming requests.

2. **`providers: [ ... ]`**:
   - Declares the services and helper classes that the module's IoC container must instantiate.
   - **Encapsulation rule**: By default, providers registered here are **private** to the module. Only controllers or other providers in this same module can inject them.

3. **`imports: [ ... ]`**:
   - List of external modules whose exported providers are required within this module.
   - For example, to communicate with TypeORM, we import `TypeOrmModule.forFeature([User])`.

4. **`exports: [ ... ]`**:
   - Subset of providers in this module that you choose to make **public**.
   - Any other module that includes this module in its `imports` array will be able to inject the providers listed here.

### Full Module Example

```typescript title="users.module.ts" showLineNumbers
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [],                    // External modules providing required dependencies
  controllers: [UsersController], // Controllers listening to HTTP endpoints
  providers: [UsersService],      // Providers managed within this module
  exports: [UsersService],        // Makes UsersService available to other importing modules
})
export class UsersModule {}
```

---

## Troubleshooting Common Errors

### Error: `Nest can't resolve dependencies of the X (?)`

This is the most frequent error encountered when working with dependency injection in NestJS. It occurs when a component requests a provider in its constructor, but the IoC container finds no definition to construct it within the current module scope:

```text title="NestJS Console Error"
Error: Nest can't resolve dependencies of the UsersController (?). 
Please make sure that the argument UsersService at index [0] is available in the UsersModule context.

Potential solutions:
- If UsersService is a provider, is it part of the current UsersModule?
- If UsersService is exported from a separate @Module, is that module imported within UsersModule?
```

**Step-by-step resolution checklist:**
1. **Decorator check**: Verify that the service class is decorated with `@Injectable()`.
2. **Registered in `providers`**: Ensure that the service is included in the `providers` array of the current module (`UsersModule`).
3. **Cross-module export/import**: If the service belongs to another module (e.g., `AuthModule`), verify that `AuthModule` includes it in its `exports` array, and that `UsersModule` includes `AuthModule` in its `imports` array.

---

## Self-Assessment Quiz

<Quiz id="web-env-providers-di-quiz">
  <Question title="In NestJS layered architecture, what is the primary responsibility of a Controller?">
    <Option>Directly execute SQL statements like CREATE TABLE or ALTER TABLE.</Option>
    <Option correct>Serve as the HTTP entry point, route endpoints, validate incoming request parameters, and delegate execution to the service layer.</Option>
    <Option>Physically create tables in the PostgreSQL database.</Option>
    <Option>Permanently cache records in the client's browser storage.</Option>
  </Question>

  <Question title="Why is it considered poor architectural practice for a Controller to instantiate its Service using 'new UsersService()'?">
    <Option>Because JavaScript does not allow calling asynchronous methods on classes created with 'new'.</Option>
    <Option>Because it triggers a TypeScript syntax error that blocks compilation.</Option>
    <Option correct>Because it creates tight coupling, prevents substituting the service with a mock during unit testing, and duplicates instances unnecessarily.</Option>
    <Option>Because it forces the browser to restart the TCP connection on every request.</Option>
  </Question>

  <Question title="In the internal request flow of NestJS (Level 2), what is the correct sequence of layers through which data travels?">
    <Option>Client -&gt; Database -&gt; Repository -&gt; Controller -&gt; Service.</Option>
    <Option correct>Client -&gt; Controller -&gt; Service -&gt; Repository -&gt; Database.</Option>
    <Option>Client -&gt; Repository -&gt; Service -&gt; Controller -&gt; Database.</Option>
    <Option>Controller -&gt; Client -&gt; Service -&gt; Database -&gt; Repository.</Option>
  </Question>

  <Question title="What is the role of the @Injectable() decorator on a TypeScript class?">
    <Option>Transform the class into a REST endpoint accessible publicly through a URL.</Option>
    <Option correct>Mark the class as a provider eligible to be managed and injected by the NestJS IoC container.</Option>
    <Option>Configure an autoincrementing primary key column in PostgreSQL.</Option>
    <Option>Force the class to execute exclusively in the client's browser.</Option>
  </Question>

  <Question title="How is an injectable dependency typically declared in a NestJS controller constructor?">
    <Option>constructor(let usersService = new UsersService())</Option>
    <Option>constructor(@CreateInstance() usersService: UsersService)</Option>
    <Option correct>constructor(private readonly usersService: UsersService)</Option>
    <Option>constructor(usersService: import('./users.service'))</Option>
  </Question>

  <Question title="By default, what is the visibility scope of a provider declared in a module's 'providers' array?">
    <Option>It is global and automatically accessible across every file in the project.</Option>
    <Option correct>It is private to the module; only controllers and services within that same module can inject it.</Option>
    <Option>It can only be consumed by the PostgreSQL database.</Option>
    <Option>It is only visible to external applications connected via WebSockets.</Option>
  </Question>

  <Question title="If a service declared in ModuleA needs to be consumed by a service in ModuleB, what module configuration is required?">
    <Option>ModuleA must list the service in 'controllers' and ModuleB in 'imports'.</Option>
    <Option correct>ModuleA must include the service in its 'exports' array, and ModuleB must add ModuleA to its 'imports' array.</Option>
    <Option>Both services must be merged into a single TypeScript file.</Option>
    <Option>ModuleB must delete its @Module() decorator to gain global visibility.</Option>
  </Question>

  <Question title="What role does the Repository layer play in an application built with NestJS and TypeORM?">
    <Option>Define visual user interface components using HTML and CSS.</Option>
    <Option>Receive incoming HTTP requests and return HTTP 404 status codes.</Option>
    <Option correct>Abstract database access, encapsulating CRUD operations and mapping database tables to TypeScript objects.</Option>
    <Option>Manage user sessions and authentication cookies in the browser.</Option>
  </Question>

  <Question title="What technical advantage does framework-managed Inversion of Control (IoC) provide over traditional instantiation?">
    <Option>Increases the compiled JavaScript file size to accelerate disk reads.</Option>
    <Option correct>Decouples dependency creation from consumption, enhancing maintainability, modularity, and unit testability with mocks.</Option>
    <Option>Completely eliminates the need for a relational database.</Option>
    <Option>Automatically transforms all SQL queries into GraphQL queries.</Option>
  </Question>

  <Question title="If the terminal displays 'Nest can't resolve dependencies of the UsersController (?)', what is the first step to resolve it?">
    <Option>Reinstall the operating system on the development workstation.</Option>
    <Option>Delete the controller from the application.</Option>
    <Option correct>Verify that UsersService has the @Injectable() decorator and is registered in the 'providers' array of the relevant module.</Option>
    <Option>Change the Node.js server port from 3000 to 8080.</Option>
  </Question>
</Quiz>
