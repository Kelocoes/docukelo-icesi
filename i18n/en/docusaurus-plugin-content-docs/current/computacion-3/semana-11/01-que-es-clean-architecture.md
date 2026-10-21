---
sidebar_position: 1
description: "Understand the origins, purpose, and core objectives of Clean Architecture and the problems it solves in frontend application design."
---

# What is Clean Architecture?

Before writing a single line of code, it is essential to understand **the core idea**. Clean Architecture is neither a directory structure nor a third-party library: it is a systematic approach to deciding **which parts of software are allowed to depend on which other parts**. In this lesson, we will explore what it is, what problem it solves, its main goals, its core propositions, and its fundamental components.

:::note[Summary in a Single Sentence]
Clean Architecture posits that **business rules** must reside at the very center of the software system, while everything else (user interfaces, databases, frameworks, external APIs) constitutes an **interchangeable detail** that depends on the core, never the reverse.
:::

---

## 1. Definition and Origins

**Clean Architecture** is a software architectural style proposed by **Robert C. Martin**, widely known as *Uncle Bob*, in a 2012 article and subsequently elaborated in his book *Clean Architecture: A Craftsman's Guide to Software Structure and Design* (2017).

It did not emerge in a vacuum. Rather, it represents a **synthesis** of preceding architectural philosophies that pursued the same goal: cleanly separating what is essential to the business domain from external tools and implementation mechanisms.

![Timeline: Hexagonal, Onion, and Clean Architecture](/img/computacion-3/clean-arch-origins-timeline.svg)

| Proposal | Author | Core Contribution |
|:---|:---|:---|
| **Hexagonal Architecture** (Ports and Adapters) | Alistair Cockburn, 2005 | The application interacts with external agents through replaceable **ports** and **adapters**. |
| **Onion Architecture** | Jeffrey Palermo, 2008 | **Concentric** layers with the domain core at the center and dependencies pointing strictly inward. |
| **Clean Architecture** | Robert C. Martin, 2012 | Unifies preceding models and formalizes the **Dependency Rule** across concentric circles. |

---

## 2. What Problem Does It Solve?

Software undergoes continuous evolution: frameworks are updated or replaced, user interfaces are redesigned, databases are migrated, and backend APIs adjust their contracts. When business logic is **intertwined** with these external tools, every external change forces developers to rewrite core logic that, conceptually, should have remained untouched.

Martin formalizes this challenge by distinguishing between two types of code:

- **Policies**: What the system *does* and why it matters to the business (validating an exercise, calculating a fee, authorizing an operation). They change infrequently and slowly.
- **Details**: *How* data is rendered or persisted (React, Next.js, PostgreSQL, `fetch`). They change rapidly and frequently.

The architectural flaw arises when policies **depend** on details. The solution is to invert that dependency relationship.

:::tip[A Benchmark Question for Any Architecture]
How much code must be altered if tomorrow you switch frameworks, replace the database, or migrate to a different third-party API provider? The less code you have to touch, the cleaner the architecture.
:::

---

## 3. Core Objectives

A clean architecture strives to ensure that the system is:

| Objective | Meaning | Practical Benefit |
|:---|:---|:---|
| **Independent of Frameworks** | The framework is a tool, not the structural backbone of the system. | It can be upgraded or replaced without rewriting business logic. |
| **Independent of User Interfaces** | The UI can be redesigned without altering domain rules. | The exact same business logic serves web, mobile, or CLI interfaces. |
| **Independent of Databases** | The business core does not know whether persistence is SQL, NoSQL, or an API. | Storage engines can be swapped with minimal blast radius. |
| **Independent of External Agencies** | Business rules have no coupling to third-party services. | External vendors can be substituted without domain refactoring. |
| **Testable** | Business rules can be thoroughly tested without UI, server runtimes, or databases. | Fast, resilient, and inexpensive unit test suites. |

![Core domain with interchangeable implementation details](/img/computacion-3/clean-arch-independence.svg)

In the diagram above, components outlined with dashed borders represent **interchangeable alternatives** that can be plugged into the same boundary. That is independence: the core domain remains entirely oblivious to which implementation is connected.

---

## 4. What Does It Propose? The Dependency Rule

The entire architectural framework rests upon a single overarching rule:

> Source code dependencies must point **strictly inward**, toward higher-level policies.

This entails that:

1. An inner circle **cannot name or reference** anything declared within an outer circle: neither functions, classes, variables, nor data formats.
2. An outer circle **can freely consume** what an inner circle provides.
3. When the inner circle requires services from the outside (for example, persisting data), it declares an **interface contract**, and the outer layer provides the concrete implementation.

This last point is a direct application of the **Dependency Inversion Principle** (the D in SOLID).

### Control Flow vs. Source Code Dependency

At runtime, the execution call flows outward from the UI to the use case, and subsequently to the database. However, in **source code**, the dependency arrow pointing toward the database is inverted:

```typescript title="Dependency Inversion" showLineNumbers
// Inner circle: The use case declares WHAT it requires
export interface ExerciseRepository {
  getAll(): Promise<Exercise[]>;
}

export class GetExercisesUseCase {
  constructor(private readonly repository: ExerciseRepository) {}
  execute() {
    return this.repository.getAll();
  }
}

// Outer circle: Infrastructure FULFILLS the contract
export class ExerciseRepositoryImpl implements ExerciseRepository {
  async getAll() {
    // fetch, mappers, etc.
  }
}
```

The use case never imports `ExerciseRepositoryImpl`. It is the infrastructure layer that imports the domain interface. Therefore, source code dependencies point inward even though runtime execution travels outward.

---

## 5. Architectural Components: The Four Circles

![Concentric rings and the dependency rule](/img/computacion-3/clean-arch-onion-layers.svg)

Martin's canonical diagram depicts four concentric circles. The diagram above illustrates a simplified representation grouping the two outer circles. From innermost to outermost, the four layers are:

### 5.1. Entities
Encapsulate **enterprise-wide business rules**: objects possessing both data and behavior that remain valid across any application within the same business domain. They represent the most stable layer of the system and the last to change due to technical requirements.

*Example*: An `Exercise` entity requiring a minimum name length of three characters.

### 5.2. Use Cases
Encapsulate **application-specific business rules**. Each use case embodies a discrete user intent and **orchestrates** data flow to and from entities. It remains agnostic of whether it is triggered from a web browser, mobile device, or automated test runner.

*Example*: `CreateExerciseUseCase`, `GetExercisesUseCase`.

### 5.3. Interface Adapters
Act as **translators**. They convert data from the format most convenient for use cases and entities into the format most convenient for external agents, and vice versa. This layer houses controllers, presenters, gateways, concrete repositories, and mappers.

*Example*: `ExerciseMapper`, `ExerciseRepositoryImpl`.

### 5.4. Frameworks and Drivers
The outermost layer: **tools, devices, and implementation mechanisms**. Databases, web application frameworks, HTTP clients, and user interface toolkits reside here. Minimal custom code is written here—primarily configuration, glue code, and initialization scripts.

*Example*: Next.js, React, `fetch`, or a backend NestJS server.

### Summary by Layer

| Layer | Contents | Stability | Knowledge of Outer Layers |
|:---|:---|:---|:---|
| Entities | Enterprise business rules | Very High | None |
| Use Cases | Application-specific workflows | High | Entities only |
| Adapters | Mappers, repositories, presenters | Moderate | Use cases and entities |
| Frameworks and Drivers | UI, database, web runtime, HTTP | Low | Adapters |

:::note[The Four Circles Are Schematic]
Martin emphasizes that the four concentric circles are **illustrative**: a system may feature more or fewer layers depending on domain complexity. The only non-negotiable invariant is the Dependency Rule.
:::

---

## 6. Crossing Layer Boundaries

When data crosses layer boundaries, it must travel as **simple data structures**: plain objects, Data Transfer Objects (DTOs), or method arguments. An outer data model (such as a database row or framework-specific request object) must never be passed inward, as this would cause the inner circle to **depend** on an external detail.

- Inward flow: A mapper transforms the raw DTO into a domain entity.
- Outward flow: A mapper transforms the entity into the serializable DTO expected by the external API.

This pattern is explored in depth in subsequent lessons on infrastructure.

---

## 7. How Does This Translate to Next.js Frontend Applications?

Although Clean Architecture originally emerged within backend server contexts, its core tenets translate directly to frontend engineering through a pragmatic adaptation:

| Martin's Canonical Ring | Corresponding Next.js Structure |
|:---|:---|
| Entities | `domain/entities` |
| Use Cases | `domain/usecases` and contracts in `domain/repositories` |
| Interface Adapters | `infrastructure/mappers`, `infrastructure/repositories`, presentation hooks |
| Frameworks and Drivers | Next.js, React, `fetch`, visual UI components |

In our implementation, we adopt **three cohesive folders per feature** (`domain`, `infrastructure`, `presentation`) rather than four nested rings. This represents a valid and practical simplification that strictly honors the Dependency Rule.

---

## 8. Trade-offs: When Not to Apply Clean Architecture

No architectural paradigm is without cost. It is essential to recognize its trade-offs:

- **Higher File Count and Indirection**: For straightforward screens, the layer separation can feel verbose.
- **Learning Curve**: Demands a thorough grasp of interface contracts, dependency inversion, and mapping boundaries.
- **Risk of Over-Engineering**: Applying full layered isolation to a simple CRUD application or a temporary prototype wastes engineering bandwidth.

:::tip[Rule of Thumb]
Apply Clean Architecture when a system is expected to **evolve and endure over time**, contains authentic business rules, integrates with volatile external data sources, or demands comprehensive unit test coverage. For disposable prototypes or weekend experiments, simpler architectures are well justified. The key is making a conscious architectural decision rather than acting out of habit.
:::

---

## 9. Key Takeaways

1. Clean Architecture decouples **policies** (business rules) from **details** (implementation mechanisms).
2. Its foundational law: **source code dependencies point strictly inward**.
3. It guarantees independence from frameworks, user interfaces, databases, and third-party services, ensuring high **testability**.
4. It organizes systems into concentric circles: **Entities, Use Cases, Adapters, and Frameworks**.
5. **Dependency Inversion** allows the domain core to define contracts that outer infrastructure layers must satisfy.
6. In subsequent lessons, we will implement this architecture hands-on using **Next.js and TypeScript**.

---

## Further Reading

<CardGrid cols={2}>
  <Card
    title="The Clean Architecture"
    description="Robert C. Martin's original 2012 foundational article."
    link="https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html"
  />
  <Card
    title="Screaming Architecture"
    description="Martin on designing architectures that communicate system intent."
    link="https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html"
  />
  <Card
    title="Hexagonal Architecture"
    description="Alistair Cockburn's original paper on Ports and Adapters."
    link="https://alistair.cockburn.us/hexagonal-architecture/"
  />
  <Card
    title="The Onion Architecture"
    description="Jeffrey Palermo's foundational series introducing concentric layer isolation."
    link="https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/"
  />
</CardGrid>

---

## Self-Assessment Quiz

<Quiz id="compunet3-s11-que-es-clean-architecture-quiz">
  <Question title="What is the foundational premise of Clean Architecture according to Robert C. Martin?">
    <Option>The frontend framework must dictate project directory structure and system entities.</Option>
    <Option correct>Business rules reside at the center, while external tools are interchangeable details that depend on the core.</Option>
    <Option>All architectural layers must have direct knowledge of database schemas to optimize query performance.</Option>
    <Option>Data flow must depend strictly upon reactive visual UI components.</Option>
  </Question>
  <Question title="Which two prior architectural paradigms are directly synthesized within Clean Architecture?">
    <Option>Model-View-Controller (1979) and Event-Driven Microservices (2014).</Option>
    <Option>Modular Monolith Architecture (2000) and Component-Driven Design (2015).</Option>
    <Option correct>Hexagonal Architecture (Cockburn, 2005) and Onion Architecture (Palermo, 2008).</Option>
    <Option>Serverless Architecture (2016) and Domain-Driven Storage (2003).</Option>
  </Question>
  <Question title="In Uncle Bob's terminology, what distinguishes policies from details?">
    <Option>Policies define CSS styles and views; details define cryptographic algorithms.</Option>
    <Option correct>Policies represent business rules and change slowly; details represent delivery mechanisms and change frequently.</Option>
    <Option>Policies represent SQL databases; details represent TypeScript interface contracts.</Option>
    <Option>Policies represent deployment configurations; details represent backend endpoint routes.</Option>
  </Question>
  <Question title="What does the Dependency Rule of Clean Architecture formally state?">
    <Option>Inner layers must import utility functions from outer layers to prevent code duplication.</Option>
    <Option>Dependencies must flow in bidirectional feedback loops between use cases and views.</Option>
    <Option correct>Source code dependencies can only point inward, toward higher-level policies.</Option>
    <Option>The system core must directly import external HTTP client libraries to manage persistence.</Option>
  </Question>
  <Question title="What occurs when the Dependency Inversion Principle (DIP) is applied to data persistence?">
    <Option>The use case must directly import the concrete repository implementation from the outer layer.</Option>
    <Option correct>The domain declares the repository interface contract, and the outer infrastructure layer implements it.</Option>
    <Option>The database automatically generates business entities using an Object-Relational Mapper.</Option>
    <Option>The presentation layer executes fetch requests directly without passing through abstractions.</Option>
  </Question>
  <Question title="In the concentric four-circle schema, which is the innermost and most stable layer?">
    <Option correct>Entities.</Option>
    <Option>Use Cases.</Option>
    <Option>Interface Adapters.</Option>
    <Option>Frameworks and Drivers.</Option>
  </Question>
  <Question title="What is the primary responsibility of the Use Cases layer?">
    <Option>Defining database connection pools and configuring low-level network sockets.</Option>
    <Option correct>Orchestrating the flow of data to and from entities, encapsulating specific application workflows.</Option>
    <Option>Rendering JSX templates and managing reactive DOM state transitions.</Option>
    <Option>Storing authentication credentials and session JWT tokens.</Option>
  </Question>
  <Question title="What role is fulfilled by Interface Adapters such as Mappers and Presenters?">
    <Option>Executing core enterprise business rules without permitting external intervention.</Option>
    <Option>Managing the lifecycle of the web server runtime and reverse proxies.</Option>
    <Option correct>Translating data between the format convenient for the domain and the format convenient for external agents.</Option>
    <Option>Replacing TypeScript completely with dynamic schema validation in JSON.</Option>
  </Question>
  <Question title="Why must data crossing layer boundaries consist of simple structures or DTOs?">
    <Option>To force the JavaScript runtime to serialize all system state into global variables.</Option>
    <Option>Because web browsers disallow passing TypeScript class instances through props.</Option>
    <Option correct>To prevent framework-specific or database-specific structures from leaking into and coupling inner circles.</Option>
    <Option>To eliminate the need for strict interfaces and types throughout application development.</Option>
  </Question>
  <Question title="In which of the following scenarios is implementing full layered Clean Architecture NOT recommended?">
    <Option>A fintech banking application with complex compliance rules and interchangeable payment gateways.</Option>
    <Option>An enterprise system designed to be maintained and scaled over several years.</Option>
    <Option correct>A disposable proof-of-concept prototype or a simple CRUD application built for a weekend hackathon.</Option>
    <Option>A healthcare management platform requiring comprehensive offline unit test coverage.</Option>
  </Question>
</Quiz>
