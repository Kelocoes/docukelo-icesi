---
sidebar_position: 4
---

# Dependency Injection and Providers

In the previous guides, we explored NestJS fundamentals, built controllers and services with in-memory storage, and modeled relational entities using TypeORM and PostgreSQL. However, for all these parts to function cohesively in an enterprise-grade backend, understanding how layers communicate is essential: **Inversion of Control (IoC)**, **Dependency Injection (DI)**, and **Providers**.

---

## 1. Layered Architecture in NestJS

A modern backend application decouples responsibilities across well-defined tiers so that each element fulfills a single responsibility. In NestJS, data flows through structured architectural layers:

<div style={{ textAlign: "center", margin: "1.5rem 0" }}>
  <img src="/img/computacion-3/nest-layered-architecture.svg" alt="Layered Architecture in NestJS" width="100%" />
</div>

* **Client**: Browser, mobile application, or HTTP client initiating the request and consuming the response.
* **Controller (`@Controller`)**: Entry point for HTTP requests; routes URLs, validates parameters, and delegates execution to services.
* **Service (`@Injectable`)**: Contains domain business logic, data validations, and workflow orchestration.
* **Repository (`Repository<T>`)**: Abstracts database access through TypeORM, translating object-oriented operations into safe SQL queries.
* **Database (PostgreSQL)**: Physical storage engine enforcing relational constraints and persistent tables.

---

## 2. Tight Coupling vs. Inversion of Control

Now that the layers are defined, the core architectural question arises: **how does a controller obtain an instance of its service or repository?**

### Traditional Coupled Approach (Manual Instantiation with `new`)

In traditional object-oriented programming without dependency injection containers, a class directly instantiates its dependencies using `new`:

```typescript title="src/users/users.controller.ts (Without Inversion of Control)" showLineNumbers
export class UsersController {
  private usersService: UsersService;

  constructor() {
    // Rigid coupling: the controller instantiates the service directly
    this.usersService = new UsersService();
  }

  getUsers() {
    return this.usersService.findAll();
  }
}
```

This pattern creates severe architectural issues:
* **Rigid coupling**: If `UsersService` modifies its constructor signature in the future (for example, to require a database connection or repository), every controller instantiating it with `new` will fail to compile and require manual updates.
* **Impossibility of unit testing**: It becomes impossible to substitute the real service with a mock object, preventing developers from isolating the controller during unit tests.
* **Inefficient memory usage**: Every consumer instantiates a new dependency, duplicating resources and state.

---

### Inversion of Control (IoC) and Dependency Injection (DI)

NestJS solves this using the **Inversion of Control (IoC)** design pattern. The consuming class is no longer responsible for manufacturing what it needs; instead, it simply **declares its requirements as constructor parameters**.

The **NestJS IoC Container** automatically instantiates components, resolves the dependency graph in the correct order, and injects them ready for use:

<div style={{ textAlign: "center", margin: "1.5rem 0" }}>
  <img src="/img/computacion-3/nest-ioc-container.svg" alt="NestJS IoC Container and Dependency Provisioning" width="100%" />
</div>

| Criterion | Manual Instantiation (`new`) | Dependency Injection (IoC) |
|---|---|---|
| **Creation Responsibility** | Consuming class creates its own dependencies | The NestJS IoC Container constructs them automatically |
| **Coupling Level** | High (classes depend on concrete implementations) | Low (classes depend on decoupled contracts or abstractions) |
| **Unit Testing** | Complex (cannot substitute mocks) | Straightforward (simply pass mocked objects in the constructor) |
| **Maintainability** | Fragile when constructor signatures change | Centralized and managed across NestJS modules |

---

## 3. What is a Provider in NestJS?

In NestJS, a **Provider** is any plain TypeScript class decorated with `@Injectable()` that can be managed by the IoC container and injected as a dependency into other components.

The vast majority of classes containing operational logic in NestJS are providers:
* **Services (`Services`)**: Pure business logic and domain rules.
* **Repositories (`Repositories`)**: Database interaction and TypeORM table management.
* **API Clients & Adapters**: Communication with external services (payment gateways, mailers, third-party APIs).
* **Helpers & Utilities**: Reusable calculation and utility functions.

### The `@Injectable()` Decorator

The `@Injectable()` decorator attaches reflection metadata that signals to the NestJS runtime: *"this class is a provider and can be injected wherever requested"*:

```typescript title="src/users/users.service.ts" showLineNumbers
import { Injectable } from '@nestjs/common';

export interface UserItem {
  id: number;
  email: string;
}

@Injectable()
export class UsersService {
  private readonly users: UserItem[] = [
    { id: 1, email: 'ada@icesi.edu.co' },
    { id: 2, email: 'alan@icesi.edu.co' },
  ];

  findAll(): UserItem[] {
    return this.users;
  }

  findById(id: number): UserItem | undefined {
    return this.users.find((u) => u.id === id);
  }
}
```

---

## 4. Constructor-Based Dependency Injection

NestJS primarily relies on **constructor-based injection**. Required dependencies are declared as parameters inside the constructor signature.

By prefixing an access modifier such as `private readonly` in TypeScript, the property is declared and initialized simultaneously in one concise line:

```typescript title="src/users/users.controller.ts" showLineNumbers
import { Controller, Get, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { UsersService, UserItem } from './users.service';

@Controller('users')
export class UsersController {
  // Constructor injection:
  // NestJS identifies the UsersService type and injects the singleton instance
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll(): UserItem[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): UserItem {
    const user = this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
```

:::tip[Best Practice: The readonly Modifier]
Declaring injected dependencies as `readonly` ensures that the reference cannot be accidentally reassigned throughout the class lifecycle.
:::

---

## 5. Modular Organization: The Structure of `@Module()`

For the IoC container to know which providers exist and which components are authorized to consume them, they must be registered within a **Module**.

A module is a class decorated with `@Module()` that establishes an encapsulation boundary:

<div style={{ textAlign: "center", margin: "1.5rem 0" }}>
  <img src="/img/computacion-3/nest-module-structure.svg" alt="@Module Property Structure in NestJS" width="100%" />
</div>

### Main Properties of `@Module()`

1. **`controllers: [ ... ]`**: Controllers belonging to this module that should be instantiated to listen for incoming HTTP routes.
2. **`providers: [ ... ]`**: Services and providers managed by the IoC container within this module. By default, they are **private** to the module.
3. **`imports: [ ... ]`**: External modules whose exported providers are required within this module.
4. **`exports: [ ... ]`**: Subset of providers from this module that are made **public** for other importing modules to inject.

```typescript title="src/users/users.module.ts" showLineNumbers
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [],                    // Imported modules
  controllers: [UsersController], // Route handling controllers
  providers: [UsersService],      // Providers registered in module
  exports: [UsersService],        // Makes UsersService available to importing modules
})
export class UsersModule {}
```

---

## 6. Troubleshooting Common Dependency Errors

### Error: `Nest can't resolve dependencies of the UsersController (?)`

This is the most common error encountered when configuring dependency injection in NestJS. It occurs when a component requests a provider in its constructor, but the IoC container finds no matching provider definition in the current module:

```text title="NestJS Console Error"
Error: Nest can't resolve dependencies of the UsersController (?). 
Please make sure that the argument UsersService at index [0] is available in the UsersModule context.

Potential solutions:
- If UsersService is a provider, is it part of the current UsersModule?
- If UsersService is exported from a separate @Module, is that module imported within UsersModule?
```

**Step-by-step resolution checklist:**
1. **Check `@Injectable()`**: Ensure the service class is decorated with `@Injectable()`.
2. **Check `providers` array**: Verify the service is registered in the `providers` array of `UsersModule`.
3. **Check `exports` and `imports`**: If the service belongs to another module (e.g., `AuthModule`), verify that `AuthModule` exports it and `UsersModule` imports `AuthModule`.

---

## Self-Assessment Quiz

<Quiz id="compu3-providers-di-quiz">

<Question title="In NestJS layered architecture, what is the primary responsibility of a Controller?">
  <Option>Directly execute SQL statements like CREATE TABLE or ALTER TABLE</Option>
  <Option correct>Serve as the HTTP entry point, route endpoints, validate incoming parameters, and delegate execution to the service layer</Option>
  <Option>Physically create tables in the PostgreSQL database</Option>
  <Option>Permanently cache records in client browser storage</Option>
</Question>

<Question title="Why is it considered poor architectural practice for a Controller to instantiate its Service using 'new UsersService()'?">
  <Option>Because JavaScript does not allow calling asynchronous methods on classes created with new</Option>
  <Option>Because it triggers a TypeScript syntax error that blocks compilation</Option>
  <Option correct>Because it creates tight coupling, prevents substituting the service with a mock during unit testing, and duplicates instances unnecessarily</Option>
  <Option>Because it forces the browser to restart the TCP connection on every request</Option>
</Question>

<Question title="In the internal request flow of NestJS, what is the correct sequence of layers through which data travels?">
  <Option>Client -&gt; Database -&gt; Repository -&gt; Controller -&gt; Service</Option>
  <Option correct>Client -&gt; Controller -&gt; Service -&gt; Repository -&gt; Database</Option>
  <Option>Client -&gt; Repository -&gt; Service -&gt; Controller -&gt; Database</Option>
  <Option>Controller -&gt; Client -&gt; Service -&gt; Database -&gt; Repository</Option>
</Question>

<Question title="What is the function of the @Injectable() decorator on a TypeScript class?">
  <Option>Transform the class into a REST endpoint accessible publicly through a URL</Option>
  <Option correct>Mark the class as a provider eligible to be managed and injected by the NestJS IoC container</Option>
  <Option>Configure an autoincrementing primary key column in PostgreSQL</Option>
  <Option>Force the class to execute exclusively in the client's browser</Option>
</Question>

<Question title="How is an injectable dependency typically declared in a NestJS controller constructor?">
  <Option>constructor(let usersService = new UsersService())</Option>
  <Option>constructor(@CreateInstance() usersService: UsersService)</Option>
  <Option correct>constructor(private readonly usersService: UsersService)</Option>
  <Option>constructor(usersService: import('./users.service'))</Option>
</Question>

<Question title="By default, what is the visibility scope of a provider declared in a module's 'providers' array?">
  <Option>It is global and automatically accessible across every file in the project</Option>
  <Option correct>It is private to the module; only controllers and services within that same module can inject it</Option>
  <Option>It can only be consumed by the PostgreSQL database</Option>
  <Option>It is only visible to external applications connected via WebSockets</Option>
</Question>

<Question title="If a service declared in ModuleA needs to be consumed by a service in ModuleB, what module configuration is required?">
  <Option>ModuleA must list the service in controllers and ModuleB in imports</Option>
  <Option correct>ModuleA must include the service in its exports array, and ModuleB must add ModuleA to its imports array</Option>
  <Option>Both services must be merged into a single TypeScript file</Option>
  <Option>ModuleB must delete its @Module() decorator to gain global visibility</Option>
</Question>

<Question title="What role does the Repository layer play in an application built with NestJS and TypeORM?">
  <Option>Define visual user interface components using HTML and CSS</Option>
  <Option>Receive incoming HTTP requests and return HTTP 404 status codes</Option>
  <Option correct>Abstract database access, encapsulating CRUD operations and mapping database tables to TypeScript objects</Option>
  <Option>Manage user sessions and authentication cookies in the browser</Option>
</Question>

<Question title="What technical advantage does framework-managed Inversion of Control (IoC) provide over traditional instantiation?">
  <Option>Increases the compiled JavaScript file size to accelerate disk reads</Option>
  <Option correct>Decouples dependency creation from consumption, enhancing maintainability, modularity, and unit testability with mocks</Option>
  <Option>Completely eliminates the need for a relational database</Option>
  <Option>Automatically transforms all SQL queries into GraphQL queries</Option>
</Question>

<Question title="If the terminal displays 'Nest can't resolve dependencies of the UsersController (?)', what is the first step to resolve it?">
  <Option>Reinstall the operating system on the development workstation</Option>
  <Option>Delete the controller from the application</Option>
  <Option correct>Verify that UsersService has the @Injectable() decorator and is registered in the providers array of the relevant module</Option>
  <Option>Change the Node.js server port from 3000 to 8080</Option>
</Question>

</Quiz>
