---
sidebar_position: 1
sidebar_label: "Spring Boot"
---

# Spring Boot

**Architecture, Servlets, Directory Structure, and Execution**

Spring Boot is a framework designed to simplify the development of enterprise-grade Java applications by providing an auto-configuration and abstraction layer on top of the Spring ecosystem.

<iframe 
    src="https://www.canva.com/design/DAGw9HXIKGs/-bEewM44akNfhPn7pb6XZw/view?embed"
    width="100%"
    height="600px"
    allowfullscreen="true"
    frameborder="0"
></iframe>

---

## 1. Flow Architecture and Servlets in Spring Boot

In traditional Java EE web applications, HTTP requests were directly processed by Servlets registered manually in an application server. Spring Boot encapsulates this complexity through the embedded web server (Apache Tomcat by default) and the **Front Controller** pattern.

### 1.1. HTTP Request Flow

<ZoomableMermaid value={`sequenceDiagram
    autonumber
    actor Client as Client (Browser/Postman)
    participant Server as Servlet Container (Tomcat)
    participant DS as DispatcherServlet
    participant Ctrl as Controller Layer
    participant Svc as Service Layer
    participant Repo as Repository Layer
    participant DB as Database / Model

    Client->>Server: HTTP Request (POST /api/v1/users)
    Server->>DS: Route HTTP Request
    DS->>Ctrl: Intercept & Map Handler (UserController)
    Ctrl->>Svc: Invoke Business Method (UserService)
    Svc->>Repo: Execute Data Operation (UserRepository)
    Repo->>DB: Query / Persistence (JPA Entity)
    DB-->>Repo: Return Result
    Repo-->>Svc: Domain Object / Entity
    Svc-->>Ctrl: DTO / Processed Model
    Ctrl-->>DS: Response Entities / HTTP Status
    DS-->>Server: Build HTTP Response
    Server-->>Client: HTTP Response (JSON / HTTP 201 Created)`} />

:::info[Detailed Sequence Diagram Explanation]
The flow illustrates the trajectory of an HTTP request across the application architecture:
1. **Client (Browser/Postman)**: Issues an HTTP request to a specific endpoint.
2. **Servlet Container (Embedded Tomcat)**: Receives the TCP socket and extracts the HTTP payload.
3. **DispatcherServlet**: Acts as the central *Front Controller*. Intercepts all incoming requests and delegates execution to the appropriate controller handler.
4. **Controller Layer**: Processes request parameters, validates input, and delegates business execution to the service layer.
5. **Service Layer**: Contains core business logic, transaction isolation, and domain rules.
6. **Repository Layer**: Abstracts storage communication through data interface contracts.
7. **Database / Model**: Performs physical storage operations and returns the result back through the pipeline.
:::

### 1.2. The Role of `DispatcherServlet` and `SpringBootServletInitializer`

Spring Boot uses `DispatcherServlet` as the core backbone of Spring MVC request processing:

- **`DispatcherServlet`**: A special Servlet serving as a single entry point for HTTP requests. Handles handler mapping, JSON/XML conversion via `HttpMessageConverter`, and global exception management.
- **`SpringBootServletInitializer`**: When running a Spring Boot application as an executable standalone JAR, embedded Tomcat starts automatically via `@SpringBootApplication`. However, if you need to package the application as a **WAR** file for deployment on an external traditional application server (such as standalone Tomcat, WildFly, or Payara), the main class must extend `SpringBootServletInitializer` and override the `configure` method.

```java title="src/main/java/com/icesi/app/ServletInitializer.java" showLineNumbers
package com.icesi.app;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

// This class enables an external Servlet container to configure the app when deployed as a WAR
public class ServletInitializer extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        // Binds the external servlet configuration with the Spring Boot main class
        return application.sources(DemoApplication.class);
    }
}
```

---

## 2. Multi-Layer Architecture in Spring Boot

A clean architecture in Spring Boot promotes strict separation of concerns by splitting the project into clearly defined layers: **Model**, **Repository**, **Service**, and **Controller**.

<ZoomableMermaid value={`graph TD
    classDef modelStyle fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1;
    classDef repoStyle fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e;
    classDef serviceStyle fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#166534;
    classDef ctrlStyle fill:#f3e8ff,stroke:#9333ea,stroke-width:2px,color:#6b21a8;

    C["Controller Layer<br/>(UserController)"]:::ctrlStyle --> S["Service Interface Layer<br/>(UserService)"]:::serviceStyle
    S --> SI["Service Implementation<br/>(UserServiceImpl)"]:::serviceStyle
    SI --> R["Repository Interface Layer<br/>(UserRepository)"]:::repoStyle
    R --> M["Model / Entity Layer<br/>(User)"]:::modelStyle`} />

:::info[Detailed Layer Breakdown]
- **Model (Domain/Entity)**: Represents domain data or database tables.
- **Repository**: Interface extending persistence abstractions (such as `JpaRepository`) to manage CRUD operations.
- **Service**: Interface and implementation containing business logic, transaction isolation, and domain rules.
- **Controller**: Receives HTTP requests, validates parameters, and returns responses in JSON format.
:::

### 2.1. Model Layer

```java title="src/main/java/com/icesi/app/model/User.java" showLineNumbers
package com.icesi.app.model;

public class User {
    private Long id;
    private String name;
    private String email;

    public User() {}

    public User(Long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
```

### 2.2. Repository Interface Layer

```java title="src/main/java/com/icesi/app/repository/UserRepository.java" showLineNumbers
package com.icesi.app.repository;

import com.icesi.app.model.User;
import java.util.List;
import java.util.Optional;

// Repository interface contract to decouple data access logic
public interface UserRepository {
    // Saves or updates an entity in storage
    User save(User user);
    // Finds a user by unique identifier
    Optional<User> findById(Long id);
    // Returns the complete list of users
    List<User> findAll();
    // Deletes a user by identifier
    void deleteById(Long id);
}
```

### 2.3. Service Layer (Interface & Implementation)

**Service Interface:**

```java title="src/main/java/com/icesi/app/service/UserService.java" showLineNumbers
package com.icesi.app.service;

import com.icesi.app.model.User;
import java.util.List;

// Service contract defining domain use cases
public interface UserService {
    User createUser(User user);
    User getUserById(Long id);
    List<User> getAllUsers();
}
```

**Service Implementation:**

```java title="src/main/java/com/icesi/app/service/impl/UserServiceImpl.java" showLineNumbers
package com.icesi.app.service.impl;

import com.icesi.app.model.User;
import com.icesi.app.repository.UserRepository;
import com.icesi.app.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

// Marks the class as a Spring Service component for dependency injection
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    // Constructor injection
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User createUser(User user) {
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalArgumentException("User email is mandatory");
        }
        return userRepository.save(user);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
```

### 2.4. Controller Layer

```java title="src/main/java/com/icesi/app/controller/UserController.java" showLineNumbers
package com.icesi.app.controller;

import com.icesi.app.model.User;
import com.icesi.app.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Defines a REST controller exposing JSON endpoints
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
```

---

## 3. Typical Directory Structure in a Spring Boot Application

```
demo-app/
├── .mvn/                                  # Maven Wrapper configuration files
├── mvnw                                   # Executable Maven Wrapper script (Linux/macOS)
├── mvnw.cmd                               # Executable Maven Wrapper script (Windows)
├── pom.xml                                # Maven build dependency file (or build.gradle)
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/icesi/app/
│   │   │       ├── DemoApplication.java   # Main class annotated with @SpringBootApplication
│   │   │       ├── controller/            # REST Controllers (@RestController)
│   │   │       ├── service/               # Business Service interfaces
│   │   │       │   └── impl/              # Service implementations (@Service)
│   │   │       ├── repository/            # Persistence interfaces (@Repository / JpaRepository)
│   │   │       ├── model/                 # JPA Entities (@Entity) and domain models
│   │   │       ├── dto/                   # Data Transfer Objects
│   │   │       ├── config/                # Configuration beans (@Configuration, CORS, Security)
│   │   │       └── exception/             # Global exception handlers (@ControllerAdvice)
│   │   └── resources/
│   │       ├── application.properties     # Main application properties
│   │       ├── application-dev.properties # Development profile configuration
│   │       ├── application-prod.properties# Production profile configuration
│   │       ├── static/                    # Static assets (CSS, JS, images)
│   │       └── templates/                 # HTML view templates (Thymeleaf, if applicable)
│   └── test/
│       └── java/com/icesi/app/            # Unit & Integration tests (@SpringBootTest)
```

:::warning[Root Package Rule]
The main class `DemoApplication.java` (annotated with `@SpringBootApplication`) must reside in the root package `com.icesi.app`. Spring Boot performs component scanning (`@ComponentScan`) **downwards** starting from this package. Placing controllers outside this package tree will cause Spring Boot to miss them.
:::

---

## 4. Application Execution and Profile Management

### 4.1. Running the Application from Terminal

<Tabs>
  <TabItem value="mvn" label="Maven Wrapper" default>

```bash title="Commands to run with Maven Wrapper"
# Linux / macOS:
./mvnw clean spring-boot:run

# Windows (PowerShell / CMD):
.\mvnw.cmd clean spring-boot:run
```

  </TabItem>
  <TabItem value="gradle" label="Gradle Wrapper">

```bash title="Commands to run with Gradle Wrapper"
# Linux / macOS:
./gradlew clean bootRun

# Windows (PowerShell / CMD):
.\gradlew.bat clean bootRun
```

  </TabItem>
</Tabs>

:::tip[Pre-execution Dependency Check]
Before starting the web server with `spring-boot:run` or `bootRun`, it is recommended to verify that all dependencies and plugins compile cleanly by running:
- **Maven**: `./mvnw clean install` (or `mvn clean install`)
- **Gradle**: `./gradlew build` (or `./gradlew --refresh-dependencies`)
:::

### 4.2. Configuration with `application.properties`

```properties title="src/main/resources/application.properties" showLineNumbers
# Application name
spring.application.name=demo-icesi-app

# Embedded Tomcat listening port
server.port=8080

# Context Path: Global prefix for request routing
server.servlet.context-path=/demo-api

# Logging configuration
logging.level.root=INFO
logging.level.com.icesi.app=DEBUG
logging.file.name=logs/application.log
```

### 4.3. Activating Environment Profiles via CLI

<Tabs>
  <TabItem value="mvn" label="Maven Wrapper" default>

```bash title="Running with dev profile in Maven"
# Linux / macOS
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Windows
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```

  </TabItem>
  <TabItem value="gradle" label="Gradle Wrapper">

```bash title="Running with dev profile in Gradle"
# Linux / macOS
./gradlew bootRun --args='--spring.profiles.active=dev'

# Windows
.\gradlew.bat bootRun --args="--spring.profiles.active=dev"
```

  </TabItem>
  <TabItem value="jar" label="Executable JAR">

```bash title="Running a compiled JAR with active profile"
# Option 1: System property (-D)
java -Dspring.profiles.active=dev -jar target/demo-app-0.0.1-SNAPSHOT.jar

# Option 2: Application argument (--)
java -jar target/demo-app-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev

# Option 3: Operating System Environment Variable
export SPRING_PROFILES_ACTIVE=dev
java -jar target/demo-app-0.0.1-SNAPSHOT.jar
```

  </TabItem>
</Tabs>

---

## Self-Assessment Quiz

<Quiz id="s4-spring-boot-arquitectura-quiz">
  <Question title="What is the main role of the DispatcherServlet in Spring Boot?">
    <Option>To connect directly to the relational database engine.</Option>
    <Option correct>To act as the central Front Controller intercepting and routing all HTTP requests to appropriate handlers.</Option>
    <Option>To compile Java source code into machine code at runtime.</Option>
    <Option>To auto-generate getter and setter methods on model classes.</Option>
  </Question>
  <Question title="In which scenario is extending SpringBootServletInitializer mandatory?">
    <Option>When running an application as a standalone executable JAR.</Option>
    <Option>To enable the H2 web console in memory.</Option>
    <Option correct>When packaging the application as a WAR file to deploy on an external standalone Servlet application server.</Option>
    <Option>To disable the default Tomcat server port.</Option>
  </Question>
  <Question title="What happens if a REST controller is placed outside the root package tree annotated with @SpringBootApplication?">
    <Option>The application immediately fails to compile.</Option>
    <Option correct>Spring Boot will not detect the controller because ComponentScan only scans downwards from the root package.</Option>
    <Option>The controller will respond only on port 8081.</Option>
    <Option>Lombok annotations are disabled.</Option>
  </Question>
  <Question title="What is the primary responsibility of the Service layer in a multi-tier architecture?">
    <Option>Receiving HTTP requests and formatting JSON response codes.</Option>
    <Option>Executing direct raw SQL statements on physical tables.</Option>
    <Option correct>Containing pure business logic, transaction isolation, and domain rules.</Option>
    <Option>Mapping primary keys for JPA entities.</Option>
  </Question>
  <Question title="What effect does setting server.servlet.context-path=/demo-api have in application.properties?">
    <Option>Changes the Tomcat listening port to 8080.</Option>
    <Option correct>Prepends the /demo-api prefix to all controller URIs in the application.</Option>
    <Option>Disables all server log outputs.</Option>
    <Option>Forces the application to run exclusively in production profile.</Option>
  </Question>
  <Question title="Which CLI command runs a Spring Boot app specifying the dev profile via Maven Wrapper?">
    <Option>./mvnw clean install --profile=dev</Option>
    <Option correct>./mvnw spring-boot:run -Dspring-boot.run.profiles=dev</Option>
    <Option>./mvnw bootRun -Pdev</Option>
    <Option>java -jar app.jar -env dev</Option>
  </Question>
  <Question title="What is the difference between a Repository interface and its implementation in Spring Boot?">
    <Option correct>The developer defines the interface contract, and Spring Boot dynamically generates the data access implementation at runtime.</Option>
    <Option>The interface handles HTTP requests and implementation converts them to JSON.</Option>
    <Option>The interface belongs to the view layer and implementation to the database.</Option>
    <Option>There is no difference; both are concrete classes annotated with @Controller.</Option>
  </Question>
  <Question title="Which Gradle Wrapper command runs the app passing the active profile argument?">
    <Option>./gradlew run -Dprofile=dev</Option>
    <Option>./gradlew build --active-profile dev</Option>
    <Option correct>./gradlew bootRun --args=&#39;--spring.profiles.active=dev&#39;</Option>
    <Option>./gradlew spring-boot:start -dev</Option>
  </Question>
  <Question title="Why are Maven Wrapper (mvnw) or Gradle Wrapper (gradlew) included in project roots?">
    <Option>To encrypt database passwords.</Option>
    <Option correct>To allow building and running the project without requiring a global system installation of Maven or Gradle.</Option>
    <Option>To replace the system-installed Java JVM.</Option>
    <Option>To generate automated sequence diagrams.</Option>
  </Question>
  <Question title="How can an active profile be enabled when executing a JAR file via OS environment variables?">
    <Option>SPRING_PORT=8080 java -jar app.jar</Option>
    <Option correct>export SPRING_PROFILES_ACTIVE=dev &amp;&amp; java -jar app.jar</Option>
    <Option>set PROFILE=dev &amp;&amp; ./mvnw run</Option>
    <Option>java -jar app.jar --port=8080</Option>
  </Question>
</Quiz>
