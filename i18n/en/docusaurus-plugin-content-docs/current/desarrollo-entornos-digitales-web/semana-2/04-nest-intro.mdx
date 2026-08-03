---
sidebar_position: 4
---

# Introduction to NestJS

NestJS is a progressive Node.js framework designed for building efficient, reliable, and scalable server-side (backend) applications. It is natively built with TypeScript and combines elements of Object-Oriented Programming (OOP), Functional Programming (FP), and Functional Reactive Programming (FRP).

---

## 1. Conceptual Foundations and Architecture

NestJS provides an out-of-the-box application architecture that allows developers and teams to create highly testable, scalable, loosely coupled, and easily maintainable applications. It draws heavy inspiration from proven design patterns in enterprise development, such as **Dependency Injection (DI)** and controller-service architecture (similar to Angular or Spring Boot).

### A. Request Lifecycle

In NestJS, incoming HTTP requests pass through a series of sequentially organized layers before a response is sent back to the client. Each layer serves a specific purpose within the application architecture:

```mermaid
graph LR
    A["Client (HTTP Request)"] --> B["Middlewares"]
    B --> C["Guards"]
    C --> D["Interceptors (Pre)"]
    D --> E["Pipes"]
    E --> F["Controller (Route Handler)"]
    F --> G["Service (Business Logic)"]
    G --> F
    F --> H["Interceptors (Post)"]
    H --> I["Exception Filters"]
    I --> J["HTTP Response"]

    style A fill:#f8fafc,stroke:#64748b,stroke-width:2px
    style B fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#1e3a8a
    style C fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#78350f
    style D fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#1e3a8a
    style E fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#78350f
    style F fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#14532d
    style G fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#14532d
    style H fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#1e3a8a
    style I fill:#fee2e2,stroke:#dc2626,stroke-width:2px,color:#7f1d1d
    style J fill:#f8fafc,stroke:#64748b,stroke-width:2px
```

#### Technical Explanation of Lifecycle Layers:

* **Middlewares**: Functions executed before the route handler. They have access to the request (`req`) and response (`res`) objects. Commonly used for tasks like logging, body parsing, or header validation.
* **Guards**: Determine whether a given request will be handled by the controller based on specific conditions (such as user authentication or role-based permissions).
* **Interceptors**: Allow binding extra logic before or after target method execution, transforming function results, or extending basic behavior.
* **Pipes**: Used for two main use cases: **transformation** (converting input data to desired formats, like string to number) and **validation** (evaluating if input data is valid according to DTO rules).
* **Controllers**: Responsible for receiving incoming requests, processing HTTP routes (`GET`, `POST`, `PUT`, `DELETE`), and returning appropriate responses to the client.
* **Services (Providers)**: Contain pure application business logic. Injected into controllers using Dependency Injection.
* **Exception Filters**: Capture all unhandled errors thrown across the application to process and return a clean, standardized HTTP error response to the client.

---

## 2. Visual Resources and Cheatsheet

Below you can check the interactive presentation for this module and the official cheatsheet with key NestJS commands and instructions.

<iframe 
    src="https://www.canva.com/design/DAG-mDgHK-8/44Hv_nQphNgBu0_MODzMrg/view?embed"
    width="100%"
    height="600px"
    allowfullscreen="true"
    frameborder="0"
></iframe>

<br/>

<PdfViewer src="/files/desarrollo-entornos-digitales-web/Nest-cheatsheet.pdf" width="100%" height="600px" title="NestJS Cheatsheet" />

---

## 3. Self-Assessment Quiz

<Quiz id="dedw-nest-intro-quiz">
  <Question title="What is the primary purpose of Guards in the NestJS request lifecycle?">
    <Option>Transforming data types like converting strings to integers.</Option>
    <Option correct>Determining whether a request will be handled by the controller based on authentication or permission rules.</Option>
    <Option>Capturing unhandled exceptions and formatting error responses.</Option>
    <Option>Serving static files and assets directly from cache memory.</Option>
  </Question>
  <Question title="What responsibility do Pipes fulfill in NestJS?">
    <Option>Initiating connection with PostgreSQL database.</Option>
    <Option>Handling primary routing for HTTP GET and POST requests.</Option>
    <Option correct>Performing transformation and validation of input data before reaching the controller.</Option>
    <Option>Intercepting server responses to encrypt payload.</Option>
  </Question>
  <Question title="In what sequential order are layers evaluated before executing the Controller Route Handler?">
    <Option>Controller -&gt; Pipes -&gt; Guards -&gt; Middlewares.</Option>
    <Option correct>Middlewares -&gt; Guards -&gt; Interceptors (Pre) -&gt; Pipes -&gt; Controller.</Option>
    <Option>Pipes -&gt; Interceptors -&gt; Exception Filters -&gt; Controller.</Option>
    <Option>Guards -&gt; Exception Filters -&gt; Middlewares -&gt; Controller.</Option>
  </Question>
  <Question title="What is the main role of Services in NestJS architecture?">
    <Option>Defining HTTP route decorators like @Get() or @Post().</Option>
    <Option correct>Encapsulating pure application business logic to be injected via Dependency Injection.</Option>
    <Option>Configuring Nginx web server as reverse proxy.</Option>
    <Option>Validating JWT authorization headers exclusively.</Option>
  </Question>
  <Question title="Which NestJS component is responsible for catching unhandled errors to respond with a unified HTTP format?">
    <Option>Interceptors.</Option>
    <Option>Pipes.</Option>
    <Option correct>Exception Filters.</Option>
    <Option>Middlewares.</Option>
  </Question>
  <Question title="What programming paradigms does NestJS natively integrate alongside TypeScript?">
    <Option>Only traditional Object-Oriented Programming (OOP) without types.</Option>
    <Option correct>Object-Oriented Programming (OOP), Functional Programming (FP), and Functional Reactive Programming (FRP).</Option>
    <Option>Exclusively procedural programming without classes.</Option>
    <Option>Structured programming using plain imperative Node.js scripts.</Option>
  </Question>
  <Question title="Which lifecycle layer allows transforming or adding logic both BEFORE and AFTER execution of controller methods?">
    <Option>Exception Filters.</Option>
    <Option correct>Interceptors.</Option>
    <Option>Guards.</Option>
    <Option>Pipes.</Option>
  </Question>
  <Question title="How is a Service injected into a Controller in NestJS?">
    <Option>Importing it with require() statement inside each function.</Option>
    <Option>Declaring a global variable in main.ts.</Option>
    <Option correct>Through Dependency Injection in the constructor of the Controller class.</Option>
    <Option>Executing the command nest build --inject service.</Option>
  </Question>
  <Question title="Which lifecycle layer is the first to receive and process an incoming HTTP Request?">
    <Option>Pipes.</Option>
    <Option correct>Middlewares.</Option>
    <Option>Guards.</Option>
    <Option>Interceptors.</Option>
  </Question>
  <Question title="What is the primary function of Controllers in NestJS?">
    <Option>Managing physical persistence in SQL tables.</Option>
    <Option correct>Handling incoming HTTP requests, processing routes, and returning appropriate responses to the client.</Option>
    <Option>Compiling TypeScript code to machine binary code.</Option>
    <Option>Validating relational database schemas.</Option>
  </Question>
</Quiz>
