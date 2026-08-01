---
sidebar_position: 1
title: Requirements in Software Development
---

# Requirements in Software Development

Requirements describe the needs and constraints that a software product must satisfy to contribute to solving a real-world problem. They act as a medium of communication between stakeholders and the development team, establishing the foundation for technical and management activities throughout the project lifecycle.

From a software development perspective, requirements can be understood through two complementary viewpoints:

- **Expression of needs**: Describes what the system is expected to do and under what conditions, based on real-world context needs.
- **Framework for development**: Guides analysis, design, implementation, and verification decisions for the system.

:::warning
If the team performs poorly during requirement determination, common issues arise:

- Increased development time
- Project cost overruns
- Significant delays or cancellations  
:::

## Requirement-Related Problems

In practice, there are two primary problems associated with requirements:

- **Incompleteness**: Occurs when not all relevant needs, business rules, or system constraints are captured.
- **Ambiguity**: Occurs when a requirement can be interpreted in more than one way, potentially leading to inconsistent implementations.

These problems usually stem from a limited understanding of the domain, poor communication with stakeholders, or imprecise documentation.

## Requirements and the Software Lifecycle

Requirements are present throughout all phases of the software development lifecycle and are not limited to an initial phase.

<img src={require('@site/static/img/desarrollo-entornos-digitales-web/software-lifecycle.png').default} alt="Software Lifecycle" width="800" />

:::info
Requirement analysis is often one of the most underestimated phases in software development, despite its results directly influencing all subsequent phases.
:::

In this context, software requirements:

- Are not necessarily a front-end or project-start activity.
- Constitute a **continuous process** adjusted as system understanding evolves.
- Must link to the organization and project context, including technical, organizational, and operational aspects.

## Fundamentals of Requirements

Requirements are defined as:

- A **condition or capability** needed by a user to solve a problem or achieve an objective.
- A **condition or capability** that must be met or possessed by a system to satisfy a contract, standard, specification, or other formally imposed document.
- A **statement** identifying a need, capability, feature, or quality attribute that must be included in the system.

These definitions reflect that requirements may originate both from explicit user needs and from external constraints imposed on the system.

## Types of Requirements

There are two main types of requirements.

### 1. Software Product Requirements

Specify the expected form and behavior of the software once developed.

#### 1.1 Functional Requirements

Describe the functions or services the system must provide. They indicate how the system should react to specific inputs or events.

Common examples include:

- Information processing
- User interaction
- Communication with other systems

#### 1.2 Non-Functional Requirements

Describe constraints under which the system must operate. They do not define *what* the system does, but *how* it does it.

Include aspects such as:

- Performance: response times, processing capacity
- Usability: ease of use, accessibility
- Reliability: availability, fault tolerance
- Security: confidentiality, integrity, authentication

##### 1.2.1 Technology Constraints

Mandate or forbid specific technologies, platforms, or infrastructures.

Examples:

- Permitted programming languages: Java, Python, JavaScript
- Deployment infrastructure: cloud, on-premise, hybrid
- Database engines: MySQL, PostgreSQL, etc.

##### 1.2.2 Quality Constraints

Establish expectations related to system behavior.

Typical questions associated with this type of requirement include:

- On what computing platforms must the system execute?
- Which database engine must be used?
- How quickly should results be presented to the user?

### 2. Software Process Requirements

Specify the activities and resources needed to develop the software.

Include aspects such as:

- Costs
- Timeline / Schedule
- Personnel
- Tools and development environment

These requirements directly influence project planning and management.

## Requirement Elicitation

Requirement elicitation is the process of **discovering, documenting, and understanding** software requirements from the perspective of stakeholders.

### Stakeholders

A stakeholder is any individual or entity that:

- Is actively involved in the project
- Is affected by the project outcome
- Can influence the project outcome

Typical stakeholders include:

- Clients
- End users
- Developers
- Project managers

### Elicitation Techniques

Requirements can be gathered through various techniques, including:

- Interviews
- Meetings
- Questionnaires
- Protocol analysis
- Focus groups

### Other Requirement Sources

In addition to stakeholders, requirements can be elicited from:

- Past versions of the system
- Interfacing external systems
- Literature reviews
- Scenario descriptions

## Requirement Analysis

Requirement analysis is the process of examining elicited requirements to ensure they are complete, consistent, and viable.

During this process, requirements must meet the following criteria:

- Be **unambiguous**, interpretably only in one way
- Be **verifiable**, so compliance can be tested
- Be **atomic**, avoiding combined requirements in a single statement
- Represent a real user or system need
- Use problem domain vocabulary
- Be acceptable to stakeholders

Overall, requirements must be:
**complete, concise, consistent, and viable**.

## Requirement Specification

Requirement specification consists of structuring documentation to facilitate usage during development.

:::info
Project management tools help organize requirements and development tasks.
:::

Common tools include:

- [Jira](https://www.atlassian.com/software/jira)
- [Trello](https://trello.com/es)
- [ClickUp](https://clickup.com)

## Writing Requirements

The way requirements are drafted is crucial for their comprehension and effective use. Clear, precise, and well-structured writing reduces ambiguity and enables teams to deliver solutions that satisfy system needs.

### Characteristics of Good Requirement Writing

A well-written requirement must be:

- **Clear**: Easy to read and understand by all stakeholders
- **Precise**: Uses specific terms and avoids vagueness
- **Concise**: Expresses the complete idea without unnecessary wording
- **Verifiable**: Can be proven through testing or inspection
- **Traceable**: Can be tracked from origin to implementation

### Common Writing Structure

**For functional requirements**, the standard format is:

```
The system must [action] [object] [optional condition]
```

**For non-functional requirements**:

```
The system must [quality characteristic] [measurable metric] [in specific context]
```

### Recommended Writing Patterns

#### 1. Imperative Verbs

- **Must** (mandatory)
- **Should** (recommended)
- **May** (optional)

Examples:

- "The system **must** validate email format before registering a user."
- "The system **should** show a confirmation message after saving data."
- "The system **may** allow exporting reports in PDF format."

#### 2. Avoiding Ambiguity

Avoid subjective words like "adequate", "fast", "easy", or "flexible".

**Incorrect**: "The system must have a fast response time."

**Correct**: "The system must respond to user queries in less than 2 seconds under normal operating conditions."

#### 3. Atomic Requirements

Each requirement must express a single need.

**Incorrect**: "The system must allow users to register, log in, and recover their password."

**Correct**:

- "The system must allow users to create an account by providing an email and password."
- "The system must allow users to log in using email and password."
- "The system must allow users to reset their password via a link sent to their email."

---

## Requirements Activity

An organization dedicated to social and recreational activities, focused on board games and organized competitive events, needs an information system to manage events and community interactions.

### Instructions

1. Identify and document **15 functional requirements** formatted as user stories:
   `As [user role], I want to [action] so that [benefit]`
2. Propose **3 non-functional requirements** with measurable criteria.
3. Submit a PDF containing the 15 User Stories (US-001, US-002...) and 3 NFRs.

---

## Self-Assessment Quiz

<Quiz id="web-env-requirements-quiz">
  <Question title="What is a major consequence of poor requirement determination in software projects?">
    <Option>Generated code compiles faster in production.</Option>
    <Option correct>Increased development time, project cost overruns, and severe delays or cancellations.</Option>
    <Option>Automatic requirement migration to NoSQL databases.</Option>
    <Option>Easier elimination of the UI/UX design team.</Option>
  </Question>
  <Question title="What is the difference between an ambiguous requirement and an incomplete requirement?">
    <Option correct>An incomplete requirement omits key needs or constraints; an ambiguous requirement allows multiple conflicting interpretations.</Option>
    <Option>Incomplete requirements only affect non-functional requirements; ambiguous requirements only affect functional ones.</Option>
    <Option>Ambiguous requirements are impossible to fix; incomplete ones self-correct during compilation.</Option>
    <Option>They are identical terms representing the same code syntax error.</Option>
  </Question>
  <Question title="With respect to the software lifecycle, when should requirement management take place?">
    <Option>Only on the first day of the project prior to coding.</Option>
    <Option>At the end of the project during production deployment.</Option>
    <Option correct>As a continuous process adjusted throughout all phases of the software lifecycle.</Option>
    <Option>Only when the client requests a visual redesign.</Option>
  </Question>
  <Question title="Which statement accurately describes a functional requirement?">
    <Option correct>It specifies a function or service the system must provide and how it reacts to inputs or events.</Option>
    <Option>It defines the total budget and headcount allocated to the development team.</Option>
    <Option>It mandates PostgreSQL as the primary database engine.</Option>
    <Option>It determines maximum response latency in milliseconds under heavy load.</Option>
  </Question>
  <Question title="Which requirement category covers restricting backend development strictly to Java or Node.js?">
    <Option>Processing functional requirement.</Option>
    <Option correct>Technology constraint non-functional requirement.</Option>
    <Option>Stakeholder elicitation requirement.</Option>
    <Option>Atomic usability requirement.</Option>
  </Question>
  <Question title="What is meant by 'Requirement Elicitation'?">
    <Option>The process of transpiling JavaScript code to TypeScript.</Option>
    <Option correct>The process of discovering, documenting, and understanding software requirements from stakeholders.</Option>
    <Option>Executing unit test suites on the system.</Option>
    <Option>Estimating story points during Planning Poker.</Option>
  </Question>
  <Question title="What characteristic must a requirement meet to be considered 'atomic'?">
    <Option>It must be written in a low-level assembly language.</Option>
    <Option>It must take exactly one developer-day to implement.</Option>
    <Option correct>It must express a single need without combining multiple ideas or features into one statement.</Option>
    <Option>It must be visible exclusively to the Administrator profile.</Option>
  </Question>
  <Question title="According to recommended writing patterns, why should terms like 'fast', 'easy', or 'flexible' be avoided?">
    <Option correct>Because they are subjective and ambiguous terms that prevent objective measurement and verification.</Option>
    <Option>Because the word 'fast' is reserved exclusively for database query indexing.</Option>
    <Option>Because Docusaurus cannot compile MDX files containing multi-syllable adjectives.</Option>
    <Option>Because their usage is restricted to software process requirements.</Option>
  </Question>
  <Question title="Which statement represents a well-written functional requirement?">
    <Option>The system must be user-friendly and intuitive for all users.</Option>
    <Option correct>The system must allow users to search products by category and display results in a paginated list.</Option>
    <Option>The system must load all pages very fast during peak hours.</Option>
    <Option>The database must store passwords in plain text.</Option>
  </Question>
  <Question title="In non-functional requirements, what quality attribute is evaluated by 'The system must be available 99.9% of monthly time'?">
    <Option>Usability.</Option>
    <Option>Maintainability.</Option>
    <Option correct>Availability / Reliability.</Option>
    <Option>Elicitation.</Option>
  </Question>
</Quiz>
