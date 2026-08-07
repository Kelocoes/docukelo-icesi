---
sidebar_position: 3
---

# Exercises: From Text to Diagram

The best way to learn database design is by practicing going from a problem description to a diagram.

These exercises progressively increase in complexity.

Before solving each one, try to identify the fundamental parts of the problem.

:::tip[Before drawing the diagram, ask yourself]
- What things (entities) appear in the text?
- What information do I have for each (attributes)?
- How do they relate to each other?
- How many of A can relate to how many of B? (1:1, 1:N, N:M)
- Do I need a junction table for any N:M relationship?
:::

### Exercise 1: Simple Blog
**Level: Beginner**

A blog has authors who write articles. Each article belongs to a single author.

:::info[Hint]
Think about the main entity creating content and the entity representing that content. Where should you place the foreign key to connect both?
:::

<details>
<summary>View proposed solution</summary>

```mermaid
%%{init: {
    "theme": "base",
    "themeVariables": {
        "primaryColor": "#bed1fa",
        "primaryTextColor": "#000000",
        "lineColor": "#bed1fa"
    }
}}%%
erDiagram
    direction LR
    AUTHOR ||--o{ ARTICLE : "writes"
    
    AUTHOR {
        int id PK
        string name
        string email
    }
    
    ARTICLE {
        int id PK
        string title
        text content
        date publication_date
        int author_id FK
    }
```

In this diagram we see a classic one-to-many relationship. The author exists independently and the article depends on the author.
</details>

### Exercise 2: Basic Library
**Level: Beginner**

A library organizes its books by categories. Each book belongs to a single category, but a category can have many books.

:::info[Hint]
Identify which entity serves as a grouping or classification for the other. The grouping entity usually lends its identifier to the classified items.
:::

<details>
<summary>View proposed solution</summary>

```mermaid
%%{init: {
    "theme": "base",
    "themeVariables": {
        "primaryColor": "#bed1fa",
        "primaryTextColor": "#000000",
        "lineColor": "#bed1fa"
    }
}}%%
erDiagram
    direction LR
    CATEGORY ||--o{ BOOK : "groups"
    
    CATEGORY {
        int id PK
        string name
        text description
    }
    
    BOOK {
        int id PK
        string title
        string author
        int year
        int category_id FK
    }
```

Here the category acts as a catalog. We store the category identifier inside each book to know where it belongs.
</details>

### Exercise 3: Store with Products and Suppliers
**Level: Basic**

A store sells products. Each product has a supplier supplying it. A supplier can supply several products, but each product has a single main supplier.

:::info[Hint]
Consider contact details you might need from the supplier and inventory details for the product. Cardinality determines where we store the reference.
:::

<details>
<summary>View proposed solution</summary>

```mermaid
%%{init: {
    "theme": "base",
    "themeVariables": {
        "primaryColor": "#bed1fa",
        "primaryTextColor": "#000000",
        "lineColor": "#bed1fa"
    }
}}%%
erDiagram
    direction LR
    SUPPLIER ||--o{ PRODUCT : "supplies"
    
    SUPPLIER {
        int id PK
        string name
        string phone
        string country
    }
    
    PRODUCT {
        int id PK
        string name
        float price
        int stock
        int supplier_id FK
    }
```

Since a product has only one main supplier, it is safe to put the supplier identifier inside the product table.
</details>

### Exercise 4: Simple Social Network
**Level: Basic**

In a social network, users publish posts. Each post is written by a single user. Posts have a title, content, and publication date.

:::info[Hint]
Similar to the blog exercise, but with social network-specific attributes. Think about user-specific information to collect.
:::

<details>
<summary>View proposed solution</summary>

```mermaid
%%{init: {
    "theme": "base",
    "themeVariables": {
        "primaryColor": "#bed1fa",
        "primaryTextColor": "#000000",
        "lineColor": "#bed1fa"
    }
}}%%
erDiagram
    direction LR
    USER ||--o{ POST : "publishes"
    
    USER {
        int id PK
        string name
        string email
        date registration_date
    }
    
    POST {
        int id PK
        string title
        text content
        date date
        int user_id FK
    }
```

The fundamental structure remains one-to-many. The user identifier is placed in the post to represent ownership.
</details>

### Exercise 5: Course System
**Level: Intermediate**

In an educational platform, teachers teach courses. Students enroll in courses. Each course has a single assigned teacher, but a student can enroll in multiple courses and a course can have multiple students.

:::info[Hint]
The relationship between teachers and courses is direct, but between students and courses it is many-to-many. What junction table do you need to handle enrollment?
:::

:::warning
Do not attempt to store a list of courses inside the student, nor a list of students inside the course. Remember that relational databases require bridge tables.
:::

<details>
<summary>View proposed solution</summary>

```mermaid
%%{init: {
    "theme": "base",
    "themeVariables": {
        "primaryColor": "#bed1fa",
        "primaryTextColor": "#000000",
        "lineColor": "#bed1fa"
    }
}}%%
erDiagram
    direction LR
    TEACHER ||--o{ COURSE : "teaches"
    STUDENT ||--o{ ENROLLMENT : "makes"
    COURSE ||--o{ ENROLLMENT : "receives"
    
    TEACHER {
        int id PK
        string name
    }
    
    COURSE {
        int id PK
        string name
        int teacher_id FK
    }
    
    STUDENT {
        int id PK
        string name
        string email
    }
    
    ENROLLMENT {
        int student_id FK
        int course_id FK
        date enrollment_date
        float grade
    }
```

The enrollments table acts as a bridge. It also allows us to save data like grades, which only make sense within that specific relationship context.
</details>

### Exercise 6: Social Network with Comments
**Level: Intermediate**

Users on a social network create posts and can comment on any post (including their own). Each comment belongs to a specific post and was written by a specific user.

:::info[Hint]
A comment is an entity depending on two others simultaneously. Think about how many foreign keys the table will need to avoid losing information.
:::

<details>
<summary>View proposed solution</summary>

```mermaid
%%{init: {
    "theme": "base",
    "themeVariables": {
        "primaryColor": "#bed1fa",
        "primaryTextColor": "#000000",
        "lineColor": "#bed1fa"
    }
}}%%
erDiagram
    direction LR
    USER ||--o{ POST : "publishes"
    USER ||--o{ COMMENT : "writes"
    POST ||--o{ COMMENT : "has"
    
    USER {
        int id PK
        string name
    }
    
    POST {
        int id PK
        text content
        int user_id FK
    }
    
    COMMENT {
        int id PK
        text text
        int user_id FK
        int post_id FK
    }
```

The comments entity must reference both its author and the original post where it was published.
</details>

### Exercise 7: Hospital System
**Level: Advanced**

A hospital has patients seen by doctors in specific rooms. Each appointment involves exactly one patient, one doctor, and one room. A doctor can have multiple specialties.

:::info[Hint]
The relationship between doctors and specialties is many-to-many. On the other hand, the appointment is the heart of the system connecting three separate entities.
:::

<details>
<summary>View proposed solution</summary>

```mermaid
%%{init: {
    "theme": "base",
    "themeVariables": {
        "primaryColor": "#bed1fa",
        "primaryTextColor": "#000000",
        "lineColor": "#bed1fa"
    }
}}%%
erDiagram
    direction LR
    DOCTOR ||--o{ DOCTOR_SPECIALTY : "has"
    SPECIALTY ||--o{ DOCTOR_SPECIALTY : "belongs"
    DOCTOR ||--o{ APPOINTMENT : "attends"
    PATIENT ||--o{ APPOINTMENT : "books"
    ROOM ||--o{ APPOINTMENT : "hosts"
    
    PATIENT {
        int id PK
        string name
    }
    
    DOCTOR {
        int id PK
        string name
    }
    
    SPECIALTY {
        int id PK
        string name
    }
    
    DOCTOR_SPECIALTY {
        int doctor_id FK
        int specialty_id FK
    }
    
    ROOM {
        int id PK
        string room_number
    }
    
    APPOINTMENT {
        int id PK
        datetime date_time
        int patient_id FK
        int doctor_id FK
        int room_id FK
    }
```

Notice how the appointment centralizes the model by containing three foreign keys simultaneously. Medical specialties are also isolated.
</details>

### Exercise 8: Online Store with Reviews
**Level: Advanced**

An online store organizes products into categories. Customers place orders containing several products in varying quantities. Furthermore, customers can write reviews for purchased products, providing a score and comment.

:::info[Hint]
There are two many-to-many relationships here. An order breaks down into line items to store quantities. Reviews are a separate relationship between customer and product.
:::

<details>
<summary>View proposed solution</summary>

```mermaid
%%{init: {
    "theme": "base",
    "themeVariables": {
        "primaryColor": "#bed1fa",
        "primaryTextColor": "#000000",
        "lineColor": "#bed1fa"
    }
}}%%
erDiagram
    direction LR
    CATEGORY ||--o{ PRODUCT : "classifies"
    CUSTOMER ||--o{ ORDER : "places"
    ORDER ||--o{ ORDER_DETAIL : "contains"
    PRODUCT ||--o{ ORDER_DETAIL : "includes"
    CUSTOMER ||--o{ REVIEW : "writes"
    PRODUCT ||--o{ REVIEW : "receives"
    
    CATEGORY {
        int id PK
        string name
    }
    
    PRODUCT {
        int id PK
        string name
        float current_price
        int category_id FK
    }
    
    CUSTOMER {
        int id PK
        string name
    }
    
    ORDER {
        int id PK
        date date
        int customer_id FK
    }
    
    ORDER_DETAIL {
        int order_id FK
        int product_id FK
        int quantity
        float unit_price
    }
    
    REVIEW {
        int customer_id FK
        int product_id FK
        int rating
        text comment
    }
```

It is crucial to save the unit price in order detail. Product prices can change over time, but the order must record the exact amount at purchase time.
</details>

### Exercise 9: Company with Employees and Departments
**Level: Expert**

A company has employees working in departments. Each department has a manager (who is also an employee). An employee belongs to a single department and has a single job title assigned. Employees can have a direct supervisor (who is also an employee in the same system).

:::info[Hint]
This exercise requires self-references and catalog normalization. How do you make an employee point to another employee? The department also needs to point to the employee table, and job titles should be in their own catalog table.
:::

<details>
<summary>View proposed solution</summary>

```mermaid
%%{init: {
    "theme": "base",
    "themeVariables": {
        "primaryColor": "#bed1fa",
        "primaryTextColor": "#000000",
        "lineColor": "#bed1fa"
    }
}}%%
erDiagram
    direction LR
    DEPARTMENT ||--o{ EMPLOYEE : "houses"
    TITLE ||--o{ EMPLOYEE : "defines"
    EMPLOYEE ||--o| EMPLOYEE : "supervises"
    EMPLOYEE ||--o| DEPARTMENT : "manages"
    
    DEPARTMENT {
        int id PK
        string name
        int manager_id FK
    }
    
    TITLE {
        int id PK
        string name
    }
    
    EMPLOYEE {
        int id PK
        string name
        int title_id FK
        int department_id FK
        int supervisor_id FK
    }
```

The employee table uses a self-referencing foreign key to record the supervisor, references `TITLE` for their position, and department references employee to assign its manager.
</details>

### Exercise 10: Project Management System
**Level: Expert**

In a software company, employees work on multiple projects assuming different roles (Tech Lead, Frontend Dev, QA, etc.). Each project belongs to a client. Projects break down into tasks assigned to employees. Some tasks can only start when others have been completed (dependencies).

:::info[Hint]
This is the final challenge. Break down the problem: clients and projects, employees on projects with roles (using a catalog table for roles), assigned tasks, and finally task dependencies.
:::

<details>
<summary>View proposed solution</summary>

```mermaid
%%{init: {
    "theme": "base",
    "themeVariables": {
        "primaryColor": "#bed1fa",
        "primaryTextColor": "#000000",
        "lineColor": "#bed1fa"
    }
}}%%
erDiagram
    direction LR
    CLIENT ||--o{ PROJECT : "requests"
    PROJECT ||--o{ PROJECT_EMPLOYEE : "involves"
    EMPLOYEE ||--o{ PROJECT_EMPLOYEE : "participates"
    ROLE ||--o{ PROJECT_EMPLOYEE : "assigns"
    PROJECT ||--o{ TASK : "divides"
    EMPLOYEE ||--o{ TASK : "executes"
    TASK ||--o{ TASK_DEPENDENCY : "requires"
    TASK ||--o{ TASK_DEPENDENCY : "unlocks"
    
    CLIENT {
        int id PK
        string name
    }
    
    PROJECT {
        int id PK
        string name
        int client_id FK
    }
    
    EMPLOYEE {
        int id PK
        string name
    }
    
    ROLE {
        int id PK
        string name
    }
    
    PROJECT_EMPLOYEE {
        int employee_id FK
        int project_id FK
        int role_id FK
        date assignment_date
    }
    
    TASK {
        int id PK
        string description
        int project_id FK
        int employee_id FK
    }
    
    TASK_DEPENDENCY {
        int task_id FK
        int prerequisite_task_id FK
    }
```

This model handles multiple assignments with cataloged roles, task tracking, and complex dependencies using a self-referencing junction table.
</details>

:::info[Conclusion]
If you reached Exercise 10, you now have the tools to design the database for almost any real-world application.
:::
