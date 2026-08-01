---
sidebar_position: 2
title: "Agile Methodologies: Scrum and User Stories"
---

# Agile Methodologies: Scrum and User Stories

Scrum is an agile framework used to manage complex projects, particularly in software development. It is built on principles of collaboration, flexibility, and incremental value delivery. Scrum is structured around roles, events, and artifacts that facilitate team organization and execution.

<img src={require('@site/static/img/desarrollo-entornos-digitales-web/scrum.png').default} alt="Scrum" width="800" />

## Roles in Scrum

1. **Product Owner**: Responsible for maximizing product value and managing the Product Backlog. Defines priorities and ensures the team works on the most valuable items.

2. **Scrum Master**: Facilitates the Scrum process, helps the team follow agile practices, and removes impediments that hinder team progress.

3. **Development Team**: Self-organizing and cross-functional professionals responsible for building and delivering potentially shippable product increments at the end of each sprint.

## Events in Scrum

Scrum events promote communication, planning, and continuous review:

1. **Product Backlog Refinement**: Ongoing review and adjustment of the Product Backlog to ensure it remains updated and prioritized.
2. **Sprint Planning Meeting**: Meeting at the start of each sprint where the team plans the work to be completed during the sprint.
3. **Daily Scrum**: 15-minute daily meeting for the team to synchronize activities and plan the next 24 hours.
4. **Sprint Review**: Meeting at the end of the sprint to inspect completed work and gather feedback from the Product Owner and stakeholders.
5. **Sprint Retrospective**: Meeting at the end of the sprint to reflect on the process and identify continuous improvements.

## Artifacts in Scrum

1. **Product Backlog**: An ordered list of all features, enhancements, and fixes required for the product.
2. **Sprint Backlog**: Set of Product Backlog items selected for the current sprint, along with a plan for delivering the product increment.
3. **Increment**: The sum of all Product Backlog items completed during a sprint and previous sprints, which must be in a usable state meeting the Definition of Done.

## User Stories

User stories are short, simple descriptions of a feature from the perspective of the end user. They capture requirements agiley, avoiding extensive documentation and focusing on value.

A user story typically follows the template:

**"As a [type of user], I want to [perform an action] so that [obtain a benefit]"**

### Examples of User Stories

1. **E-commerce User Story**:
   - As a customer, I want to add products to my shopping cart so that I can purchase multiple items in a single transaction.

2. **Educational App User Story**:
   - As a student, I want to view my course progress so that I know which topics remain to be completed.

3. **Management System User Story**:
   - As an administrator, I want to generate monthly sales reports so that I can analyze business performance.

### User Stories vs. Software Requirements

- **User Stories**: Informal, user-centered, written in natural language, and focused on business value. Flexible and refined during development.
- **Software Requirements**: Formal, technical, and detailed. Describe specific system capabilities, technical constraints, and precise acceptance criteria.

### Story Point Estimation

User story point estimation estimates relative effort or complexity. A common scale is the **Fibonacci Sequence** (1, 2, 3, 5, 8, 13, 21...), reflecting growing uncertainty as complexity increases.

#### Estimation Process - Planning Poker

1. **Review Story**: Team reviews the story to understand scope.
2. **Discussion**: Team discusses technical aspects, risks, and dependencies.
3. **Point Assignment**: Each member assigns points using Planning Poker cards.
4. **Consensus**: Discrepancies are discussed until consensus is reached.

<img src={require('@site/static/img/desarrollo-entornos-digitales-web/planning_poker.png').default} alt="Planning Poker" width="600" />

---

## Self-Assessment Quiz

<Quiz id="web-env-scrum-quiz">
  <Question title="In the Scrum framework, who is primarily responsible for managing and prioritizing the Product Backlog?">
    <Option>The Scrum Master.</Option>
    <Option correct>The Product Owner.</Option>
    <Option>The Development Team.</Option>
    <Option>The Infrastructure Manager.</Option>
  </Question>
  <Question title="What is the primary role of the Scrum Master within the team?">
    <Option>Assigning individual tasks to developers on a daily basis.</Option>
    <Option correct>Facilitating the Scrum process, promoting agile practices, and removing impediments that block team progress.</Option>
    <Option>Approving or rejecting the financial budget of the project.</Option>
    <Option>Writing code for non-functional requirements.</Option>
  </Question>
  <Question title="Which short daily meeting (approx. 15 minutes) allows the team to synchronize activities and plan the next 24 hours?">
    <Option>Sprint Planning Meeting.</Option>
    <Option>Sprint Retrospective.</Option>
    <Option correct>Daily Scrum.</Option>
    <Option>Product Backlog Refinement.</Option>
  </Question>
  <Question title="During which Scrum event does the team reflect on the completed sprint process to identify continuous improvements?">
    <Option>Sprint Review.</Option>
    <Option correct>Sprint Retrospective.</Option>
    <Option>Daily Scrum.</Option>
    <Option>Sprint Planning Meeting.</Option>
  </Question>
  <Question title="What is the key difference between the Product Backlog and the Sprint Backlog?">
    <Option correct>The Product Backlog contains all desired features for the product; the Sprint Backlog contains only items selected for the current sprint.</Option>
    <Option>The Product Backlog is technical and the Sprint Backlog is commercial.</Option>
    <Option>The Sprint Backlog is managed by the client and the Product Backlog by the Scrum Master.</Option>
    <Option>There is no difference; they are identical task lists.</Option>
  </Question>
  <Question title="What is the standard format used to write a User Story?">
    <Option>Given [context], When [event], Then [result].</Option>
    <Option correct>As a [type of user], I want to [perform an action] so that [obtain a benefit].</Option>
    <Option>IF [condition] THEN [action] ELSE [exception].</Option>
    <Option>The system must [action] on [object] in [metric].</Option>
  </Question>
  <Question title="Compared to formal software requirements, what is a key characteristic of User Stories?">
    <Option>They are rigid, unchangeable documents.</Option>
    <Option correct>They are short, informal, user-centered descriptions that promote conversation and flexibility.</Option>
    <Option>They detail exact SQL queries for database execution.</Option>
    <Option>They are written in assembly code.</Option>
  </Question>
  <Question title="Why is the Fibonacci Scale (1, 2, 3, 5, 8, 13...) commonly used in story point estimation?">
    <Option>Because it calculates exact developer work hours.</Option>
    <Option correct>Because it reflects growing uncertainty and complexity as story size increases.</Option>
    <Option>Because it is the only scale supported by TypeScript compilers.</Option>
    <Option>Because it enforces a maximum limit of 5 stories per sprint.</Option>
  </Question>
  <Question title="During Planning Poker, what should the team do if there is a significant discrepancy in estimation scores?">
    <Option>Take the exact mathematical average of all cards.</Option>
    <Option>Automatically assign the highest card without discussion.</Option>
    <Option correct>Discuss the reasons behind extreme estimates and revote until consensus is reached.</Option>
    <Option>Cancel the sprint immediately.</Option>
  </Question>
  <Question title="In Scrum, what is required for a Product Increment to be valid at the end of a Sprint?">
    <Option>It must include all user stories for the entire project.</Option>
    <Option correct>It must be in a usable state and satisfy the Definition of Done.</Option>
    <Option>It must have been tested at compile-time only.</Option>
    <Option>It must not contain any graphical user interface.</Option>
  </Question>
  <Question title="Evaluate the following User Story: 'The system must connect to the PostgreSQL database using JDBC to query user records.' Is this User Story correctly specified?">
    <Option>True. It is well-specified because it describes required technical functionality.</Option>
    <Option>True. It is correct because it clearly defines software components and protocols.</Option>
    <Option correct>False. It is poorly specified because it does not follow the user-centric format ('As a [role], I want [action] so that [benefit]') and describes technical implementation details instead of business value.</Option>
    <Option>False. It is poorly specified only because it mentions PostgreSQL instead of MySQL.</Option>
  </Question>
  <Question title="Evaluate the following User Story: 'As a store customer, I want to add products to my wishlist so that I can save and purchase them in a later session.' Is this User Story correctly specified?">
    <Option correct>True. It is well-specified because it identifies the user role ('store customer'), desired action ('add to wishlist'), and business benefit ('purchase in a later session').</Option>
    <Option>True. It is correct because it specifies which database table and column to mutate upon clicking.</Option>
    <Option>False. It is poorly specified because the benefit should be omitted to keep stories short.</Option>
    <Option>False. It is poorly specified because only administrators can perform purchases.</Option>
  </Question>
  <Question title="Evaluate the following User Story: 'As a user, I want to click the blue button in the top right corner.' Is this User Story correctly specified?">
    <Option>True. It is correct because it precisely indicates the UI element to interact with.</Option>
    <Option correct>False. It is poorly specified because it omits business benefit ('so that [benefit]') and focuses on visual UI details instead of functional user needs.</Option>
    <Option>True. It is well-specified because it details the color and location of the graphic widget.</Option>
    <Option>False. It is poorly specified only because the button should be green under Scrum guidelines.</Option>
  </Question>
  <Question title="Evaluate the following User Story: 'As a student, I want to filter courses by difficulty level so that I can find content suited to my prior knowledge.' Is this User Story correctly specified?">
    <Option>False. It is poorly specified because the benefit is too verbose and should be written as a performance non-functional requirement.</Option>
    <Option>False. It is poorly specified because it lacks the SQL query required to sort courses.</Option>
    <Option correct>True. It is well-specified because it complies with standard format ('As a [role], I want [action] so that [benefit]'), expressing a real student need and value.</Option>
    <Option>True. It is correct because it forces developers to use TypeScript for filtering.</Option>
  </Question>
  <Question title="Evaluate the following User Story: 'As a customer, I want to register an account, pay by credit card, rate delivery drivers, and request invoices to use the app.' Is this User Story correctly specified?">
    <Option>True. It is well-specified because it encompasses multiple essential features in one sentence.</Option>
    <Option>True. It is correct because it details all steps a customer performs from start to finish.</Option>
    <Option>False. It is poorly specified only because 'customer' should be replaced by 'administrator'.</Option>
    <Option correct>False. It is poorly specified because it groups multiple non-atomic capabilities into a single story (registration, payment, rating, invoicing), hindering estimation and independent delivery.</Option>
  </Question>
</Quiz>
