---
sidebar_position: 4
sidebar_label: "JPA & Hibernate"
---

# JPA & Hibernate

**Object-Relational Mapping (ORM) and Entities**

Modern Java applications utilize Object-Relational Mapping (ORM) technologies to translate language objects and classes into database tables and rows.

---

## 1. Difference between JPA and Hibernate

There is a fundamental distinction between the specification standard and its concrete implementation engine:

<ZoomableMermaid value={`graph LR
    classDef jpaStyle fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1;
    classDef hibStyle fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e;
    classDef dbStyle fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#166534;

    JPA["JPA (Jakarta Persistence API)<br/>*Standard Specification (Interfaces & Annotations)*"]:::jpaStyle -->|Implemented by| HIB["Hibernate ORM Engine<br/>*ORM Provider (SQL Generation & Cache Management)*"]:::hibStyle
    HIB -->|Executes SQL on| DB[(Relational Database<br/>PostgreSQL / H2 / MySQL)]:::dbStyle`} />

:::info[Detailed Persistence Diagram Explanation]
1. **JPA (Jakarta Persistence API)**: A Java specification defining annotations (`@Entity`, `@Id`, `@Column`) and contracts without containing executable logic.
2. **Hibernate ORM**: The default concrete engine chosen by Spring Boot. Reads JPA annotations, translates object operations into SQL dialect statements, and manages persistence sessions.
3. **Relational Database**: Physical storage engine where tabular data resides.
:::

---

## 2. JPA Entity Mapping and Annotations

An **Entity** is a POJO (Plain Old Java Object) representing a physical table. Each class instance corresponds to a row in the table.

### 2.1. Core Mapping Annotations

| Annotation | Purpose | Common Attributes |
|---|---|---|
| `@Entity` | Declares the Java class as a JPA-managed entity. | `name` (logical entity name in JPQL) |
| `@Table` | Specifies physical database table name. | `name`, `schema`, `uniqueConstraints` |
| `@Id` | Marks field as Primary Key. | N/A |
| `@GeneratedValue` | Specifies automatic primary key generation strategy. | `strategy` (`IDENTITY`, `SEQUENCE`, `AUTO`, `TABLE`) |
| `@Column` | Configures column mapping details. | `name`, `nullable`, `unique`, `length`, `precision` |
| `@JoinColumn` | Defines Foreign Key column name in relationships. | `name`, `referencedColumnName`, `nullable` |
| `@Transient` | Specifies field should NOT be persisted in storage. | N/A |

---

## 3. Relational Database Model (ER Diagram)

Before writing Java code, we design the relational database schema for a product catalog domain:

<ZoomableMermaid value={`erDiagram
    CATEGORIES ||--|{ PRODUCTS : "classifies (1:N)"
    SUPPLIERS ||--|{ PRODUCTS : "supplies (1:N)"

    CATEGORIES {
        bigint id PK
        varchar_80 name
        varchar_255 description
    }

    SUPPLIERS {
        bigint id PK
        varchar_100 company_name
        varchar_50 tax_id
    }

    PRODUCTS {
        bigint id PK
        varchar_120 product_name
        numeric_10_2 price
        varchar_50 sku_code
        bigint category_id FK
        bigint supplier_id FK
    }`} />

:::info[Detailed ER Diagram Explanation]
- **`CATEGORIES`**: Parent table storing product classifications (1 to N with `PRODUCTS`).
- **`SUPPLIERS`**: Parent table storing supplier companies (1 to N with `PRODUCTS`).
- **`PRODUCTS`**: Main table containing two Foreign Keys (`FK`): `category_id` and `supplier_id`, physically referencing primary keys (`PK`) of parent tables.
:::

---

## 4. Complete Java Entity Mapping with JPA and Lombok

Below, the ER diagram is mapped into Java entity classes using JPA and Lombok annotations:

### 4.1. Entity `Category` (Table `categorias`)

```java title="src/main/java/com/icesi/app/model/Category.java" showLineNumbers
package com.icesi.app.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categorias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false, length = 80)
    private String name;

    @Column(name = "descripcion", length = 255)
    private String description;
}
```

### 4.2. Entity `Supplier` (Table `proveedores`)

```java title="src/main/java/com/icesi/app/model/Supplier.java" showLineNumbers
package com.icesi.app.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "proveedores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_empresa", nullable = false, length = 100)
    private String companyName;

    @Column(name = "nit_ruc", unique = true, nullable = false, length = 50)
    private String taxId;
}
```

### 4.3. Entity `Product` with `@ManyToOne` Relationships (Table `productos`)

```java title="src/main/java/com/icesi/app/model/Product.java" showLineNumbers
package com.icesi.app.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "productos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_producto", nullable = false, length = 120)
    private String name;

    @Column(name = "precio", nullable = false, precision = 10, scale = 2)
    private Double price;

    @Column(name = "codigo_sku", unique = true, nullable = false, length = 50)
    private String sku;

    // Transient field ignored by JPA
    @Transient
    private String temporaryDiscountCode;

    // Many-to-One: Many products belong to one Category
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Category category;

    // Many-to-One: Many products are supplied by one Supplier
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proveedor_id", nullable = false)
    private Supplier supplier;
}
```

---

## Self-Assessment Quiz

<Quiz id="s4-jpa-hibernate-quiz">
  <Question title="What is the technical relationship between JPA and Hibernate?">
    <Option>JPA is a C++ executable engine and Hibernate is a frontend library.</Option>
    <Option correct>JPA is the standard specification (interfaces and annotations) and Hibernate is the concrete ORM engine implementation.</Option>
    <Option>JPA manages H2 databases and Hibernate manages PostgreSQL.</Option>
    <Option>They are incompatible frameworks.</Option>
  </Question>
  <Question title="What does the @Entity annotation indicate on a Java class?">
    <Option>That the class represents a Thymeleaf view controller.</Option>
    <Option correct>That the class is a persistent data Entity managed by JPA context.</Option>
    <Option>That class methods will be exposed on an HTTP port.</Option>
    <Option>That the class must be compiled with Gradle instead of Maven.</Option>
  </Question>
  <Question title="What does @Table(name = &quot;productos&quot;) accomplish?">
    <Option>Automatically creates an HTML table in browsers.</Option>
    <Option correct>Specifies the exact physical database table name to which the Java entity maps.</Option>
    <Option>Prevents database connectivity.</Option>
    <Option>Exports data model to Excel.</Option>
  </Question>
  <Question title="What is the behavior of GenerationType.IDENTITY in @GeneratedValue?">
    <Option>Generates random UUID primary keys.</Option>
    <Option correct>Delegates primary key value autogeneration to the relational database AUTO_INCREMENT or SERIAL column.</Option>
    <Option>Requires developers to enter IDs manually on insert.</Option>
    <Option>Uses a shared global sequence text file.</Option>
  </Question>
  <Question title="What happens when an entity attribute is marked with @Transient?">
    <Option>It becomes the primary key of the table.</Option>
    <Option correct>JPA completely ignores it during persistence, preventing column creation in database tables.</Option>
    <Option>It is encrypted with AES-256.</Option>
    <Option>Causes compilation errors.</Option>
  </Question>
  <Question title="Which annotation defines physical Foreign Key columns in relationships?">
    <Option>@Column(primaryKey = true)</Option>
    <Option correct>@JoinColumn(name = &quot;categoria_id&quot;)</Option>
    <Option>@ForeignKeyMap</Option>
    <Option>@TableLink</Option>
  </Question>
  <Question title="What does configuring FetchType.LAZY on a @ManyToOne relationship mean?">
    <Option>The entity relationship loads immediately upon instantiation.</Option>
    <Option correct>Associated entities are not queried from database storage until explicitly requested by code.</Option>
    <Option>Foreign keys are dropped on session close.</Option>
    <Option>Relationships work only in development environments.</Option>
  </Question>
  <Question title="In a 1:N relationship between Category and Products, in which table does the Foreign Key column reside?">
    <Option>In the CATEGORIES table.</Option>
    <Option correct>In the PRODUCTS table (via the category_id column).</Option>
    <Option>In an auxiliary CATEGORIES_PRODUCTS join table.</Option>
    <Option>In Tomcat server RAM.</Option>
  </Question>
  <Question title="Which attributes can be configured in @Column to adjust database constraints?">
    <Option>percent, maxConnections, and activeProfile.</Option>
    <Option correct>name, nullable, unique, length, precision, and scale.</Option>
    <Option>author, copyright, and version.</Option>
    <Option>httpMethod, contentType, and charset.</Option>
  </Question>
  <Question title="Which combination of Lombok annotations is recommended on JPA entities to avoid circular references?">
    <Option>@Data exclusively.</Option>
    <Option correct>Explicitly using @Getter, @Setter, @NoArgsConstructor, @AllArgsConstructor, and @Builder.</Option>
    <Option>@Value only.</Option>
    <Option>@Controller and @ResponseBody.</Option>
  </Question>
</Quiz>
