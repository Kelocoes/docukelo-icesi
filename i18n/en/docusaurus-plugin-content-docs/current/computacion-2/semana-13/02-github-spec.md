---
sidebar_position: 2
description: "Spec-driven Development (SDD) methodology with GitHub Spec Kit and handcrafted architecture using AGENTS.md and .agents/."
---

# Spec-driven Development

In the era of Artificial Intelligence-assisted software engineering, raw code generation speed is no longer the primary bottleneck. Today, tools like **GitHub Copilot, Cursor, Claude Code, and Antigravity** can generate hundreds of lines of code in seconds. However, this velocity introduces a critical risk: uncontrolled coding (*vibe coding*), where language models hallucinate deprecated libraries, violate layered architectures, and accumulate massive technical debt.

To address this challenge, **Spec-driven Development (SDD)** emerged: an engineering discipline that shifts focus from *"generating code quickly"* to *"defining with architectural rigor exactly what must be built before writing a single line of code"*.

In this chapter, we explore the contrast between traditional SDLC and SDD, how the **6 foundational phases of GitHub Spec Kit** formalize this workflow, and how to apply the **handcrafted, universal methodology** using an `AGENTS.md` file and an `.agents/` folder structure in Spring Boot projects.

---

## 1. Traditional SDLC vs. Spec-driven Development

In the traditional Software Development Life Cycle (**SDLC**), documentation is frequently treated as a bureaucratic afterthought that drifts out of sync the moment code is modified. In **SDD**, the Markdown specification is the **executable driver** that strictly guides code generation.

Explore the parallel comparison between the 6 foundational phases of SDD and the pitfalls of the traditional development process:

<iframe src="/interactive/computacion-2/semana-13/sdlc-vs-sdd/index.html" title="SDLC vs Spec-driven Development" style={{ width: '100%', height: 620, border: 0 }} loading="lazy" />

### From CLI Tool to Universal Standard

GitHub Spec Kit initially formalized this workflow through a command-line tool (`specify-cli`), installable via `uv`:

```bash title="Installing and running official GitHub Spec Kit"
# 1. Install uv (Rust-based Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# 2. Install specify-cli
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# 3. Initialize a repository
specify init my-backend-project
```

However, relying on external command-line binaries introduces tooling friction and black-box behaviors across diverse development teams. Modern engineering teams adopt a **handcrafted abstraction**: structuring context directly within Git-versioned folders and Markdown documents.

---

## 2. Handcrafted SDD: Architecture with `AGENTS.md` and `.agents/`

The handcrafted methodology places governance in a root constitution document (`AGENTS.md`) and a reserved context repository (`.agents/`).

Interact with the architecture diagram below to inspect how memory, specifications, technical plans, and tasks are organized, and how context travels to the AI agent:

<iframe src="/interactive/computacion-2/semana-13/sdd-artesanal-flow/index.html" title="Handcrafted SDD with AGENTS.md and .agents/" style={{ width: '100%', height: 680, border: 0 }} loading="lazy" />

---

## 3. Step-by-Step Hands-on Guide: Implementing a Feature with Handcrafted SDD

Next, we will construct a formal specification from scratch for a new Spring Boot backend feature: **User Action Audit Log (`AuditLog`)**.

<StepByStep>
  <Step number="1" title="Create Root Constitution: AGENTS.md">
    In your project root directory, create `AGENTS.md`. This is the first file any AI coding agent reads when initializing a session.

    ```markdown title="AGENTS.md" showLineNumbers
    # Agent Operating Manual & Constitution

    You are a Senior Software Engineer specializing in enterprise backend development with Spring Boot and Java 17.

    ## Non-Negotiable Golden Rules
    1. **Strict Layered Architecture**: Controller -> Service -> Repository. Injecting repositories directly into controllers is strictly prohibited.
    2. **Mandatory DTOs**: Never expose JPA entities (@Entity) on REST endpoints. All external communication uses immutable Records or DTO classes with Jakarta validation constraints.
    3. **Centralized Exception Handling**: Never suppress errors with empty try-catch blocks. Throw domain exceptions and handle them globally inside @RestControllerAdvice.
    4. **Atomic Execution Rule**: Do not implement entire features at once. Consult .agents/tasks/ and execute strictly one task per prompt iteration.

    ## Context Directory
    * [Technical Memory](.agents/memory/tech-stack.md): Official framework and database versions.
    * [Architecture Rules](.agents/memory/architecture.md): Naming conventions and layered design patterns.
    ```
  </Step>

  <Step number="2" title="Define Persistent Memory: .agents/memory/">
    Create `.agents/memory/` and record framework constraints in `tech-stack.md` to prevent agents from hallucinating incompatible libraries:

    ```markdown title=".agents/memory/tech-stack.md" showLineNumbers
    # Technical Stack Constraints

    - **Language**: Java 17 (LTS) - use Records, Text Blocks, and Switch Expressions.
    - **Framework**: Spring Boot 3.3.x.
    - **Security**: Spring Security 6 with stateless JWT (custom JwtAuthenticationFilter).
    - **Database**: PostgreSQL 16 with Spring Data JPA and Hibernate 6.
    - **Validation**: Jakarta Validation (@NotNull, @NotBlank, @Positive, @Email).
    - **API Documentation**: Springdoc OpenAPI v2 (Swagger UI at /swagger-ui.html).
    ```
  </Step>

  <Step number="3" title="Draft Functional Specification: .agents/specs/">
    In `.agents/specs/feat-audit-spec.md`, draft the **what**. Detail user stories, input/output JSON schemas, and acceptance criteria using Gherkin syntax:

    ```markdown title=".agents/specs/feat-audit-spec.md" showLineNumbers
    # Specification: User Action Audit Logging (Audit Log)

    ## 1. User Story
    **As a** system administrator,
    **I want** critical events (login, course creation, role modifications) logged to a persistent audit trail,
    **so that** I can monitor platform security and comply with audit standards.

    ## 2. Required Endpoints
    - `POST /api/v1/audit-logs`: Internal endpoint for recording audit entries.
    - `GET /api/v1/audit-logs`: Protected endpoint (ROLE_ADMIN) with pagination (page, size) and descending timestamp ordering.

    ## 3. Input JSON Schema
    ```json
    {
      "action": "COURSE_CREATED",
      "userEmail": "profesor@icesi.edu.co",
      "details": "Course ID 101 registered with 3 credits",
      "ipAddress": "192.168.1.45"
    }
    ```

    ## 4. Acceptance Criteria (Gherkin)
    - **Scenario 1**: Successful audit log persistence
      - *Given* an authenticated user performs a critical action,
      - *When* the service issues a POST request to `/api/v1/audit-logs` with valid fields,
      - *Then* the system responds with HTTP 201 Created and persists the entry with a UTC timestamp.

    - **Scenario 2**: Validation on mandatory fields
      - *Given* a payload with an empty `action` or malformed `userEmail`,
      - *When* the request is submitted,
      - *Then* the system responds with HTTP 400 Bad Request and validation error messages.
    ```
  </Step>

  <Step number="4" title="Clarify Phase: Critical Dialogue with the Agent">
    Before generating code, feed `.agents/specs/feat-audit-spec.md` to the agent with this instruction:

    ```text title="Clarification Prompt (Clarify)"
    Review the specification in .agents/specs/feat-audit-spec.md according to AGENTS.md and .agents/memory/.
    Ask 3 to 5 questions regarding edge cases, database indexes, or error scenarios that are not explicitly defined.
    Do not generate code yet.
    ```

    :::note[Examples of Ambiguities Uncovered in Clarify]
    - *If the audit database write fails, should it rollback the primary transaction or log asynchronously without blocking user requests?*
    - *Will filtering by date ranges or user email be required on `/api/v1/audit-logs` queries?*
    
    Clarifying these decisions in Markdown **before coding** saves hours of refactoring.
    :::
  </Step>

  <Step number="5" title="Design Technical Plan: .agents/plans/">
    Once the specification is clarified, formulate the technical **how** in `.agents/plans/feat-audit-plan.md`:

    ```markdown title=".agents/plans/feat-audit-plan.md" showLineNumbers
    # Technical Plan: Audit Logging Module

    ## 1. Component Architecture
    1. **JPA Entity**: `AuditLog.java` mapped to `audit_logs`, primary key `UUID`, indexed columns `created_at` and `user_email`.
    2. **DTOs**: `CreateAuditLogRequest.java` (Record) and `AuditLogResponse.java` (Record).
    3. **Repository**: `AuditLogRepository.java` extending `JpaRepository<AuditLog, UUID>`.
    4. **Service**: `AuditLogService.java` interface and `AuditLogServiceImpl.java` using `@Transactional(propagation = Propagation.REQUIRES_NEW)`.
    5. **Controller**: `AuditLogController.java` at `/api/v1/audit-logs` with `@PreAuthorize("hasRole('ADMIN')")` on GET queries.

    ## 2. Key Technical Decisions
    - **Isolation**: Use `REQUIRES_NEW` propagation so audit entries remain saved even if downstream user actions throw exceptions.
    - **Performance**: Create composite B-Tree index on `(user_email, created_at)` to optimize administrator queries.
    ```
  </Step>

  <Step number="6" title="Deconstruct Atomic Tasks: .agents/tasks/">
    Break the technical plan into numbered, verifiable tasks in `.agents/tasks/feat-audit-tasks.md`:

    ```markdown title=".agents/tasks/feat-audit-tasks.md" showLineNumbers
    # Task Checklist: Audit Logging Feature

    - [ ] **Task 1: Persistence Model**
      - Create entity `AuditLog.java` with UUID, action, userEmail, details, ipAddress, createdAt.
      - Create database migration script with index on `created_at`.
      - *Verification Criteria*: Project compiles and table schema is verified in PostgreSQL.

    - [ ] **Task 2: DTO Layer and Validation**
      - Create `CreateAuditLogRequest` with `@NotBlank` and `@Email`.
      - Create `AuditLogResponse` with formatted properties.
      - *Verification Criteria*: Validation unit tests pass.

    - [ ] **Task 3: Repository and Service Layer**
      - Create `AuditLogRepository` with `findAllByOrderByCreatedAtDesc` pagination.
      - Implement `AuditLogServiceImpl` with transaction propagation.
      - *Verification Criteria*: Integration test persists record.

    - [ ] **Task 4: REST Controller and Security**
      - Create `AuditLogController` exposing POST and paginated GET.
      - Secure GET with ADMIN role and document with OpenAPI `@Operation`.
      - *Verification Criteria*: Postman tests pass (201 Created and 400 Bad Request).
    ```
  </Step>

  <Step number="7" title="Guided Execution with AI Agent">
    With the tasks defined, interact with the agent authorizing **strictly one task at a time**:

    ```text title="Controlled Execution Prompt"
    Read AGENTS.md, .agents/plans/feat-audit-plan.md, and Task 1 from .agents/tasks/feat-audit-tasks.md.
    Implement ONLY Task 1 (AuditLog entity and repository).
    Do not touch controllers or services yet.
    When completed, show the code and stop execution.
    ```

    Once the agent finishes, compile your code, verify tests pass, mark `[x]` on Task 1, and authorize Task 2.
  </Step>
</StepByStep>

---

## 4. Best Practices for Agent-Assisted Development

To maximize productivity and software quality when applying SDD:

1. **The Single-Task Rule**: Never prompt an agent to build multiple components or architectural layers simultaneously without validation.
2. **Truth Lives in Markdown, Not in the Chat**: Every architectural decision made during conversational turns must be committed to `.agents/specs/` or `.agents/plans/`. Chats are volatile; repository Markdown files are versioned in Git and readable by any team member or agent.
3. **Cross-Validation with Postman**: Every controller implemented via SDD should be verified immediately against the automated Postman test collection configured in the previous chapter.

---

## Self-Assessment Quiz

<Quiz id="c2-semana-13-sdd-quiz-en">
  <Question title="What is the foundational difference between traditional SDLC and Spec-driven Development (SDD)?">
    <Option>Automated software testing is not performed in SDD.</Option>
    <Option correct>In SDD, the Markdown specification is the executable driver that strictly guides code generation, rather than a document written after the fact.</Option>
    <Option>In traditional SDLC, large language models write code entirely autonomously without human supervision.</Option>
    <Option>SDD works exclusively on console applications without database persistence.</Option>
  </Question>

  <Question title="What is the primary role of the root 'AGENTS.md' file in a repository?">
    <Option>To compile Spring Boot source code and generate the production JAR artifact.</Option>
    <Option>To store database passwords and secret production keys.</Option>
    <Option correct>To act as the project Constitution: establishing agent identity, non-negotiable architectural rules, and index links to repository memory.</Option>
    <Option>To replace the pom.xml or build.gradle build configuration.</Option>
  </Question>

  <Question title="What type of technical information should be stored inside the .agents/memory/ directory?">
    <Option>Corporate financial statements and bank account credentials.</Option>
    <Option correct>Stable technology constraints (Java versions, Spring Boot releases, DTO patterns, and architecture rules) to prevent hallucinations of incompatible libraries.</Option>
    <Option>Git commit log history serialized into binary format.</Option>
    <Option>Compiled Docker and PostgreSQL executables.</Option>
  </Question>

  <Question title="What dimension of development is defined inside the .agents/specs/ directory?">
    <Option>The detailed technical HOW, including Java classes, method signatures, and native SQL statements.</Option>
    <Option correct>The functional WHAT from the user perspective: user stories, JSON input/output schemas, and Gherkin acceptance criteria.</Option>
    <Option>Team salary allocations and developer billing rates.</Option>
    <Option>Network switch port configurations in the server rack.</Option>
  </Question>

  <Question title="What is the main objective of the 'Clarify' phase before writing a technical implementation plan?">
    <Option>To code the Spring Boot REST controllers directly to see how they behave.</Option>
    <Option correct>To critically interrogate the specification to resolve ambiguities, address edge cases, and align on key decisions before touching code.</Option>
    <Option>To deploy the application to a cloud cluster for stress testing.</Option>
    <Option>To delete all code comments to reduce repository size.</Option>
  </Question>

  <Question title="What is documented in a technical plan within .agents/plans/?">
    <Option>Monthly salary budgets for backend developers.</Option>
    <Option correct>The architectural HOW: JPA entities, DTO contracts, transaction boundaries (@Transactional), database indexes, and design patterns.</Option>
    <Option>Hardware procurement invoices for server components.</Option>
    <Option>End-user legal terms of service agreements.</Option>
  </Question>

  <Question title="What core attributes should tasks in .agents/tasks/ possess?">
    <Option>They should be single prompts spanning over 500 lines covering the entire application at once.</Option>
    <Option>They must omit verification criteria to allow the agent maximum creative freedom.</Option>
    <Option correct>They must be atomic, sequentially numbered, and paired with concrete verification criteria (such as compilation or unit tests).</Option>
    <Option>They must be written in assembly language for maximum execution performance.</Option>
  </Question>

  <Question title="Why is the 'Single-Task Rule' strongly recommended when guiding AI coding agents?">
    <Option>Because language models can only process one prompt per calendar day.</Option>
    <Option>To force developers to write all code manually rather than delegating to AI.</Option>
    <Option correct>Because it minimizes hallucination risks, maintains focused model attention, and allows developers to inspect and verify before proceeding.</Option>
    <Option>Because Git repositories prevent committing multiple files at once.</Option>
  </Question>

  <Question title="Why is it stated in SDD that 'Truth Lives in Markdown, Not in the Chat'?">
    <Option>Because AI chat providers bill on a per-word basis.</Option>
    <Option correct>Because chat logs are ephemeral and easily lost, while Markdown files are tracked in Git and readable by any team member or agent.</Option>
    <Option>Because Markdown files execute binary instructions faster than chat windows.</Option>
    <Option>Because Spring Boot only compiles files with a .md extension.</Option>
  </Question>

  <Question title="How does SDD integrate with Postman testing once controller implementation tasks are completed?">
    <Option>Postman is discarded when practicing SDD methodology.</Option>
    <Option correct>It enables immediate cross-validation of implemented endpoints against automated Postman test suites and assertions.</Option>
    <Option>Postman formats Markdown documents within the .agents/ folder.</Option>
    <Option>Postman automatically generates JPA entities in the repository package.</Option>
  </Question>
</Quiz>

---

## Recommended Resources

- [Official GitHub Spec Kit Repository](https://github.com/github/spec-kit)
- [Principles of Spec-driven Development with LLMs](https://scrummanager.com/community/spec-driven-development-qu-es-de-dnde-viene-y-por-qu-importa)
- [Spring Boot 3 and Enterprise Architecture Guide](https://spring.io/projects/spring-boot)
