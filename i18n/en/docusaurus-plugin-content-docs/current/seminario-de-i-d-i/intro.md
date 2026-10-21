---
sidebar_position: 1
description: "Learn the purpose, units and weekly schedule of the AI-assisted frontend development stage with Flutter."
---

import PdfViewer from '@site/src/components/PdfViewer/PdfViewer';

# Course content

Welcome to the documentation space for **Seminar on R+D+i** (Software Engineering Seminar) at Universidad Icesi.

This stage of the course spans **week 9 through week 16** (sessions 17 to 32), integrating **Learning Units 3 and 4**. During this period you work on development assisted by AI agents in the console, specification-driven engineering (*Spec Driven Development*), cross-platform interface design with Flutter, and integration with cloud services through Supabase.

---

## General purpose of the stage

To train you in the contemporary AI-assisted software development workflow: from environment setup, console agents, context management and *skills*, through building declarative and reactive interfaces in Flutter, to integrating cloud services (authentication, Postgres database and storage), culminating in the delivery and defense of a working, auditable product.

---

## Units covered in this stage

### Unit 3: Fundamentals of AI-assisted solution development
* **Learning Outcome (LO3)**: Configure intelligent assistants, context files, tools and extension protocols to develop software solutions in a productive and controlled way.
* **Main topics**:
  * Console AI assistants and operating modes (autonomy levels, manual confirmation and planning).
  * Building and maintaining context files (`CLAUDE.md` / `AGENTS.md`) as living project contracts.
  * Creating, installing and using *skills* (e.g. the Flutter *skill*).
  * Technical specifications as a contract before code (*Spec Driven Development - SDD*).
  * Client-server architecture with MCP (*Model Context Protocol*) servers.

### Unit 4: Fundamentals of AI-assisted Frontend development
* **Learning Outcome (LO4)**: Develop a cross-platform frontend application assisted by AI and integrated with cloud backend services, applying design patterns, declarative components and state management.
* **Main topics**:
  * Declarative paradigm in Flutter (the UI as a function of state).
  * *Stateless* and *Stateful* component structure, lifecycle and controller management.
  * *Lifting state up*, *callbacks*, immutable models and mitigating *prop drilling*.
  * Declarative navigation, named routes and tab navigation (*BottomNavigationBar*).
  * Integration with a cloud backend (Supabase SDK): user authentication, CRUD operations on Postgres and file storage.

---

## Weekly plan and session schedule

The distribution of contents and activities for weeks 9 to 16 according to the course planner is detailed below:

### Week 9: Environment, Hello World and Basic Components
* **Session 17 (U4)**: Introduction to units 3 and 4. Fundamentals of cross-platform frontend. Installing the SDK, editor, emulator and Supabase environment. First application and running Hello World.
* **Session 18 (U4)**: Folder structure and `main.dart`. Declarative vs. imperative paradigm. Basic widgets (`Text`, `Image`, buttons) and *Stateless* components.

### Week 10: Screen Layout and First Agentic Steps
* **Session 19 (U4)**: Scaffolding with `Scaffold` and `SafeArea`. Composition with `Column`, `Row`, `Expanded`, `Container`, `Padding`, `SingleChildScrollView`. `Screen` vs. `Page` convention.
* **Session 20 (U3)**: Console AI assistants: operating modes and autonomy levels. Context management. Creating `CLAUDE.md` / `AGENTS.md`. Introduction to Data, Storage and Auth.

### Week 11: Agent Skills, Prototyping and State Management
* **Session 21 (U3)**: Concept, installation and invocation of *skills* (Flutter Skill). Auditing AI-generated interfaces against the `CLAUDE.md` contract. Proposal and non-functional design in Stitch/Figma.
* **Session 22 (U4)**: *StatelessWidget* vs. *StatefulWidget*: lifecycle (`initState`, `dispose`) and `setState`. Form handling with `TextEditingController`.

### Week 12: State Lifting and Navigation between Screens
* **Session 23 (U4)**: State lifting to the host `Screen`. Communication with *callbacks*, mitigating *prop drilling* and immutable models with `copyWith`.
* **Session 24 (U4)**: Navigation with `Navigator` and named routes in `MaterialApp` (`pushNamed`, `pop`, `pushNamedAndRemoveUntil`).

### Week 13: Tab Navigation and Spec Driven Development
* **Session 25 (U4)**: **Partial Delivery 1**: Defense of the navigable mockup / non-functional prototype. Horizontal navigation with `BottomNavigationBar`.
* **Session 26 (U3)**: *Spec Driven Development (SDD)*: the specification as a contract before code. Ecosystem of agents, *skills* and MCP servers. Data model design.

### Week 14: Cloud Database Integration (Supabase)
* **Session 27 (U3 and U4)**: Connecting Flutter to Supabase through the SDK. Service layer and CRUD operations with PostgREST. Handling loading and error states in the UI.
* **Session 28 (U3 and U4)**: Advanced persistence, queries and refinement of the client-server integration.

### Week 15: Authentication, Storage and Technical Wrap-up
* **Session 29 (U3 and U4)**: Authentication with Supabase Auth: login, sign-up, logout, persistence and route guards.
* **Session 30 (U3 and U4)**: Uploading and displaying files with Supabase Storage. Hands-on upload workshop and defense preparation.

### Week 16: Defenses and Final Evaluation
* **Session 31 (U3 and U4)**: **Final Delivery - Part I (Teams 1 to 3)**: Live demo and defense of the AI-assisted process.
* **Session 32 (U3 and U4)**: **Final Delivery - Part II (Teams 4 to 6)**: Live demo, defense and reflective closing of the course.

---

## Delivery and Evaluation Milestones

| Milestone | Session / Week | Description | AIGC Level |
| :--- | :--- | :--- | :--- |
| **Design and Model** | Week 11 / Session 21 | Application proposal, non-functional design in Stitch/Figma and data model. | Level 5 (Exploration) |
| **Partial Delivery 1** | Week 13 / Session 25 | Navigable Flutter prototype with components, screens and local state management (simulated data). | Level 5 (Exploration) |
| **Specifications and Backend** | Weeks 14-15 / Sessions 26 to 30 | Complete technical specifications (*SDD*) and working integration with Supabase (Auth, Postgres CRUD and Storage). | Level 4 and 5 |
| **Final Delivery (50%)** | Week 16 / Sessions 31 and 32 | Technical defense: Live demo of the application, repository, `CLAUDE.md`, *skills*, *specs* and audit of the agentic workflow. | Level 5 (Exploration) |

---

## Official Course Syllabus

Below you can view and download the full official course syllabus:

<PdfViewer src="/files/seminario-de-i-d-i/Syllabus-Seminario-Ingenieria-de-Software.pdf" width="100%" height="700px" title="Software Engineering Seminar Syllabus" />
