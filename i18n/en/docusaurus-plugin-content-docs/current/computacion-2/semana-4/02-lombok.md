---
sidebar_position: 2
sidebar_label: "Project Lombok"
---

# Project Lombok

**Eliminating Boilerplate Code and Annotations in Spring Boot**

**Project Lombok** is a compile-time annotation processing library that automates the generation of repetitive boilerplate code in Java applications, such as getters, setters, constructors, `toString()`, `equals()`, `hashCode()`, and loggers.

---

## 1. What is Lombok and how does it work?

During standard Java compilation, writing private attributes requires defining dozens of lines of redundant code. Lombok hooks into the compile-time annotation processing phase of `javac` and directly injects bytecode for methods into compiled `.class` files, keeping `.java` source files completely clean.

<ZoomableMermaid value={`graph LR
    classDef srcStyle fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1;
    classDef procStyle fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e;
    classDef classStyle fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#166534;

    A[".java Source File<br/>(Clean class with annotations)"]:::srcStyle --> B["javac Compiler + Lombok<br/>(Annotation Processor)"]:::procStyle
    B --> C[".class Bytecode File<br/>(Contains generated getters, setters & constructors)"]:::classStyle`} />

---

## 2. Installation and Setup

To use Lombok in a Spring Boot project, declare the dependency in your build tool:

<Tabs>
  <TabItem value="mvn" label="Maven (pom.xml)" default>

```xml title="pom.xml" showLineNumbers
<dependencies>
    <!-- Project Lombok dependency -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <excludes>
                    <!-- Excludes Lombok from final executable JAR since it is only needed at compile time -->
                    <exclude>
                        <groupId>org.projectlombok</groupId>
                        <artifactId>lombok</artifactId>
                    </exclude>
                </excludes>
            </configuration>
        </plugin>
    </plugins>
</build>
```

  </TabItem>
  <TabItem value="gradle" label="Gradle (build.gradle)">

```groovy title="build.gradle" showLineNumbers
dependencies {
    // Lombok as compile-only dependency and annotation processor
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
}
```

  </TabItem>
</Tabs>

:::tip[Verifying Lombok Installation]
After declaring the Lombok dependency and annotation processor, verify that the library downloads and configures correctly on your classpath by running:
- **Maven**: `./mvnw clean install` (or `mvn clean install`)
- **Gradle**: `./gradlew build` (or `./gradlew --refresh-dependencies`)

This command processes annotations and confirms that `javac` recognizes Lombok instructions without errors.
:::

---

## 3. Detailed Lombok Annotation Catalog

### 3.1. Encapsulation (`@Getter` and `@Setter`)

Generates read (`getFields()`) and write (`setFields()`) methods. Can be placed at the class level or on individual fields.

```java title="src/main/java/com/icesi/app/model/Product.java" showLineNumbers
package com.icesi.app.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Product {
    private Long id;
    private String name;
    
    // Overrides setter visibility to private for this specific field
    @Setter(lombok.AccessLevel.PRIVATE)
    private Double price;
}
```

### 3.2. Constructor Generation

- **`@NoArgsConstructor`**: Generates a no-argument constructor (required by frameworks like JPA and Jackson).
- **`@AllArgsConstructor`**: Generates a constructor with one parameter for every field in the class.
- **`@RequiredArgsConstructor`**: Generates a constructor only for fields marked as `final` or annotated with `@NonNull`. **This is the recommended Spring pattern for constructor dependency injection.**

```java title="src/main/java/com/icesi/app/service/impl/ProductServiceImpl.java" showLineNumbers
package com.icesi.app.service.impl;

import com.icesi.app.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
// Automatically generates a constructor for 'productRepository' because it is declared 'final'
@RequiredArgsConstructor
public class ProductServiceImpl {

    // Spring automatically injects this mandatory dependency without writing manual constructor code
    private final ProductRepository productRepository;
}
```

### 3.3. Code Bundlers (`@Data` and `@Value`)

- **`@Data`**: Bundles `@Getter`, `@Setter`, `@ToString`, `@EqualsAndHashCode`, and `@RequiredArgsConstructor`. Ideal for simple DTOs or POJOs.
- **`@Value`**: Immutable variant of `@Data`. Makes all fields `private final` and generates no setters.

```java title="src/main/java/com/icesi/app/dto/UserResponseDto.java" showLineNumbers
package com.icesi.app.dto;

import lombok.Data;

@Data
public class UserResponseDto {
    private Long id;
    private String name;
    private String email;
}
```

### 3.4. Design Patterns & Logging (`@Builder` and `@Slf4j`)

- **`@Builder`**: Produces a fluent builder API based on the Builder design pattern.
- **`@Slf4j`**: Automatically injects an SLF4J logger instance named `log`.

```java title="src/main/java/com/icesi/app/service/impl/NotificationService.java" showLineNumbers
package com.icesi.app.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationService {

    public void sendEmail(String to, String subject) {
        log.info("Sending email to: {} with subject: {}", to, subject);
        log.debug("Technical payload details...");
    }
}
```

---

## 4. Integrated Example: Builder Pattern

```java title="src/main/java/com/icesi/app/model/Customer.java" showLineNumbers
package com.icesi.app.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Boolean active;
}
```

**Fluent Builder Usage:**

```java title="src/main/java/com/icesi/app/DemoApplication.java" showLineNumbers
Customer customer = Customer.builder()
        .id(1L)
        .firstName("Kevin")
        .lastName("Coes")
        .email("kevin@icesi.edu.co")
        .active(true)
        .build();
```

---

## 5. Warnings and Best Practices with JPA and Lombok

:::warning[Caution with @Data on JPA Entities]
Avoid placing `@Data` on classes annotated with JPA `@Entity` if they contain bidirectional relational relationships (`@OneToMany` / `@ManyToOne`).

**Why?**  
`@Data` automatically generates `hashCode()` and `equals()` using **all** fields. If two entities reference each other bidirectionally, executing `hashCode()` triggers circular invocation leading to a **`StackOverflowError`**.

**Recommendation:**  
Use explicit annotations on JPA entities:
```java
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User { ... }
```
:::

---

## Self-Assessment Quiz

<Quiz id="s4-lombok-quiz">
  <Question title="At what stage of the development lifecycle does Project Lombok operate?">
    <Option>Only when starting the Tomcat web server.</Option>
    <Option correct>At compile time (Annotation Processing), injecting bytecode directly into compiled .class files.</Option>
    <Option>At runtime intercepting client HTTP requests.</Option>
    <Option>When executing SQL database migration scripts.</Option>
  </Question>
  <Question title="Why is @RequiredArgsConstructor recommended for Spring dependency injection?">
    <Option>Because it generates mandatory no-arg constructors for Hibernate.</Option>
    <Option correct>Because it automatically generates a constructor for fields declared as &#39;final&#39;, allowing clean constructor injection without boilerplate.</Option>
    <Option>Because it converts all fields to static types.</Option>
    <Option>Because it eliminates the need for @Service annotations.</Option>
  </Question>
  <Question title="Why should @Data be avoided on JPA entities with bidirectional relationships?">
    <Option>Because it slows down PostgreSQL database connections.</Option>
    <Option correct>Because it generates hashCode() and equals() across all fields, leading to circular references and StackOverflowError crashes.</Option>
    <Option>Because it disables primary key generation.</Option>
    <Option>Because it deletes table data upon application restart.</Option>
  </Question>
  <Question title="Which annotations are bundled internally by the @Data grouping annotation?">
    <Option>@Entity, @Table, @Id, and @Column.</Option>
    <Option correct>@Getter, @Setter, @ToString, @EqualsAndHashCode, and @RequiredArgsConstructor.</Option>
    <Option>@Component, @Service, @Repository, and @Controller.</Option>
    <Option>@Slf4j, @Builder, @Value, and @Transient.</Option>
  </Question>
  <Question title="What functionality does @Slf4j provide to a Java class?">
    <Option>Converts the class into a persistent database entity.</Option>
    <Option correct>Automatically injects an SLF4J logger instance named &#39;log&#39; for emitting logs.</Option>
    <Option>Deploys the application into a Docker container in the cloud.</Option>
    <Option>Generates a data.sql initialization script.</Option>
  </Question>
  <Question title="What is the primary purpose of the Lombok @Builder annotation?">
    <Option>To create physical database tables.</Option>
    <Option correct>To provide a fluent builder API based on the Builder pattern for instantiating complex objects.</Option>
    <Option>To format controller JSON responses.</Option>
    <Option>To validate non-null string parameters.</Option>
  </Question>
  <Question title="How does @Value differ from @Data?">
    <Option>@Value is for database classes and @Data for web controllers.</Option>
    <Option correct>@Value generates immutable classes and instances (private final fields without setters), unlike @Data.</Option>
    <Option>@Value disables logging with @Slf4j.</Option>
    <Option>@Value requires manual compilation with C++.</Option>
  </Question>
  <Question title="Why is @NoArgsConstructor required on JPA entity classes?">
    <Option>To allow HTTP DELETE requests.</Option>
    <Option correct>Because JPA and serialization frameworks strictly require a no-arg constructor to instantiate entities via reflection.</Option>
    <Option>To override default port 8080.</Option>
    <Option>To prevent SQL injection attacks.</Option>
  </Question>
  <Question title="Which terminal command verifies Lombok Annotation Processing in a Maven project?">
    <Option>./mvnw spring-boot:stop</Option>
    <Option correct>./mvnw clean install</Option>
    <Option>./mvnw test-compile --no-lombok</Option>
    <Option>java -jar lombok.jar</Option>
  </Question>
  <Question title="How is Lombok excluded from the final executable artifact in Maven pom.xml?">
    <Option>By deleting pom.xml before building.</Option>
    <Option correct>By configuring spring-boot-maven-plugin with an &lt;exclude&gt; tag for lombok, since it is only needed at compile time.</Option>
    <Option>By adding @Transient over the main class.</Option>
    <Option>By setting &lt;scope&gt;runtime&lt;/scope&gt;.</Option>
  </Question>
</Quiz>
