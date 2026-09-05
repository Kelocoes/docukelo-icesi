---
sidebar_position: 1
---

import PdfViewer from "@site/src/components/PdfViewer/PdfViewer";

# Introduction to NestJS

NestJS is a progressive Node.js framework designed for building efficient, reliable, and scalable server-side (backend) applications. It is built with TypeScript natively and combines elements of Object-Oriented Programming (OOP), Functional Programming (FP), and Functional Reactive Programming (FRP).

---

## 1. Conceptual Foundations and Architecture

NestJS provides an out-of-the-box application architecture that enables developers and teams to create highly testable, scalable, loosely coupled, and easily maintainable applications. It draws heavy inspiration from proven design patterns in enterprise development, notably **Dependency Injection (DI)** and modular layered architecture (similar to Angular or Spring Boot).

### Request Lifecycle

In NestJS, incoming HTTP requests travel through an ordered sequence of stages before a response is returned to the client. Each stage fulfills a dedicated responsibility for security, validation, orchestration, or error handling:

<div style={{ textAlign: "center", margin: "1.5rem 0" }}>
  <img src="/img/computacion-3/nest-request-lifecycle.svg" alt="NestJS HTTP Request Lifecycle" width="100%" />
</div>

#### Stages of the Request Lifecycle:

1. **Client (HTTP Request)**: The client (browser, mobile application, or Postman) initiates a request containing HTTP method, headers, query/route parameters, and body payload.
2. **Middlewares**: Execute first with direct access to `req` and `res`. Typically used for access logging, cookie parsing, and CORS header configuration.
3. **Guards**: Determine whether a request is authorized to proceed by evaluating JWT bearer tokens, active sessions, or role-based permissions (RBAC).
4. **Interceptors (Pre)**: Trigger before route handlers execute to bind execution context, initialize audit logs, or start performance timers.
5. **Pipes**: Validate and transform incoming payload data according to Data Transfer Object (DTO) schemas (e.g., validating required fields or casting with `ParseIntPipe`).
6. **Controller and Service**: The controller matches the route endpoint (`@Get`, `@Post`) and delegates business operations to injected services where business rules and persistence logic reside.
7. **Interceptors (Post)**: Intercept the value returned by the service to mutate, wrap, or reformat the final response payload (e.g., standardizing responses into `{ data: ... }`).
8. **Exception Filters**: If an unhandled error occurs anywhere across the pipeline, exception filters capture and serialize the error into a clean HTTP response (400, 404, 500).
9. **HTTP Response**: The server delivers the HTTP status code and final JSON response back to the client.

---

## 2. Visual Resources and Cheatsheet

Below you can explore the interactive module presentation and the official cheatsheet detailing key NestJS commands and architectural guidelines.

<iframe 
    src="https://www.canva.com/design/DAG-mDgHK-8/44Hv_nQphNgBu0_MODzMrg/view?embed"
    width="100%"
    height="540px"
    allowFullScreen
></iframe>

<br/>

<PdfViewer src="/files/computacion-3/Nest-cheatsheet.pdf" width="100%" height="600px" title="NestJS Cheatsheet" />

---

## 3. Self-Assessment Quiz

<Quiz id="compu3-nest-intro-quiz">
  <Question title="What is the primary purpose of Guards in the NestJS request lifecycle?">
    <Option>Transform data types such as converting strings into integers.</Option>
    <Option correct>Determine whether a request will be handled by the route handler based on authentication or permission rules.</Option>
    <Option>Capture unhandled exceptions and format the error response.</Option>
    <Option>Serve static assets directly from browser cache.</Option>
  </Question>
  <Question title="What responsibility do Pipes fulfill in NestJS?">
    <Option>Initialize the connection pool to the PostgreSQL database.</Option>
    <Option>Handle the primary HTTP routing for GET and POST endpoints.</Option>
    <Option correct>Perform validation and transformation on incoming request data before reaching the controller.</Option>
    <Option>Intercept server responses to encrypt the outgoing payload.</Option>
  </Question>
  <Question title="In what sequential order are layers evaluated before executing the Controller Route Handler?">
    <Option>Controller -&gt; Pipes -&gt; Guards -&gt; Middlewares.</Option>
    <Option correct>Middlewares -&gt; Guards -&gt; Interceptors (Pre) -&gt; Pipes -&gt; Controller.</Option>
    <Option>Pipes -&gt; Interceptors -&gt; Exception Filters -&gt; Controller.</Option>
    <Option>Guards -&gt; Exception Filters -&gt; Middlewares -&gt; Controller.</Option>
  </Question>
  <Question title="What is the main role of Services in NestJS architecture?">
    <Option>Define route path decorators such as @Get() or @Post().</Option>
    <Option correct>Encapsulate core business logic to be injected into controllers via Dependency Injection.</Option>
    <Option>Configure Nginx web server as a reverse proxy.</Option>
    <Option>Exclusively validate JWT authorization headers on every request.</Option>
  </Question>
  <Question title="Which NestJS component is responsible for catching unhandled exceptions and returning unified HTTP error responses?">
    <Option>Interceptors.</Option>
    <Option>Pipes.</Option>
    <Option correct>Exception Filters.</Option>
    <Option>Middlewares.</Option>
  </Question>
  <Question title="Which programming paradigms does NestJS natively combine with TypeScript?">
    <Option>Exclusively traditional untyped object-oriented programming.</Option>
    <Option correct>Object-Oriented Programming (OOP), Functional Programming (FP), and Functional Reactive Programming (FRP).</Option>
    <Option>Strictly procedural flat scripting without classes.</Option>
    <Option>Structured programming using imperative vanilla Node.js scripts.</Option>
  </Question>
  <Question title="Which lifecycle layer allows executing custom logic both BEFORE and AFTER the controller method execution?">
    <Option>Exception Filters.</Option>
    <Option correct>Interceptors.</Option>
    <Option>Guards.</Option>
    <Option>Pipes.</Option>
  </Question>
  <Question title="How is a Service injected into a Controller in NestJS?">
    <Option>By importing it with require() inside every route handler function.</Option>
    <Option>By declaring a global variable inside main.ts.</Option>
    <Option correct>Through Dependency Injection declared within the Controller class constructor.</Option>
    <Option>By executing the terminal command nest build --inject service.</Option>
  </Question>
  <Question title="Which lifecycle layer is the very first to receive and process an incoming HTTP request?">
    <Option>Pipes.</Option>
    <Option correct>Middlewares.</Option>
    <Option>Guards.</Option>
    <Option>Interceptors.</Option>
  </Question>
  <Question title="What is the primary function of Controllers in NestJS?">
    <Option>Manage physical persistence and schema creation in SQL tables.</Option>
    <Option correct>Receive incoming HTTP requests, process routes, and return the appropriate response to the client.</Option>
    <Option>Compile TypeScript source files into native machine binary code.</Option>
    <Option>Validate relational database schemas against migration files.</Option>
  </Question>
</Quiz>
