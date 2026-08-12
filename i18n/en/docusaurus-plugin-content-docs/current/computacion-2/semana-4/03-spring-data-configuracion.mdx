---
sidebar_position: 3
sidebar_label: "Spring Data JPA"
---

# Spring Data JPA

**Database Configuration, Datasource, and Persistence**

Spring Data JPA is a module within the Spring Data ecosystem providing a high-level abstraction for managing relational data persistence, drastically reducing data access boilerplate code.

---

## 1. What is Spring Data and how to install it?

**Spring Data** standardizes access to relational and NoSQL databases. **Spring Data JPA** extends the JPA specification to automate repository creation via interface contracts.

### 1.1. Maven and Gradle Dependencies

**In Maven (`pom.xml`):**

```xml title="pom.xml" showLineNumbers
<dependencies>
    <!-- Spring Data JPA Starter (includes Hibernate, Spring Data, and JPA) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- H2 Database for development/testing -->
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- PostgreSQL Driver for production/relational development -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

**In Gradle (`build.gradle`):**

```groovy title="build.gradle" showLineNumbers
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    runtimeOnly 'com.h2database:h2'
    runtimeOnly 'org.postgresql:postgresql'
}
```

:::tip[Verifying Persistence Dependency Installation]
After adding Spring Data JPA starters and JDBC drivers (`h2` or `postgresql`), verify that persistence artifacts download cleanly to your local repository by running:
- **Maven**: `./mvnw clean install` (or `mvn clean install`)
- **Gradle**: `./gradlew build` (or `./gradlew --refresh-dependencies`)
:::

---

## 2. Detailed Breakdown of `application.properties`

```properties title="src/main/resources/application.properties" showLineNumbers
# ==========================================
# 1. DATASOURCE CONFIGURATION (PostgreSQL)
# ==========================================
# JDBC connection URL to PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/boardgame

# PostgreSQL username
spring.datasource.username=postgres

# Database password
spring.datasource.password=postgres

# Official PostgreSQL JDBC Driver
spring.datasource.driver-class-name=org.postgresql.Driver

# Hibernate Dialect for optimizing SQL generation toward PostgreSQL
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect


# ==========================================
# 2. ALTERNATIVE: H2 DATABASE (In-Memory or File)
# ==========================================
# spring.datasource.driver-class-name=org.h2.Driver

# Option A: H2 In-Memory RAM
# spring.datasource.url=jdbc:h2:mem:db-kevin;DB_CLOSE_DELAY=-1

# Option B: H2 File-Persisted (creates ./db-kevin.mv.db)
# spring.datasource.url=jdbc:h2:./db-kevin;DB_CLOSE_DELAY=-1

# Default H2 credentials
# spring.datasource.username=postgres
# spring.datasource.password=postgres


# ==========================================
# 3. SCHEMA MANAGEMENT WITH HIBERNATE (ddl-auto)
# ==========================================
# Strategy for automatic DDL schema generation:
# - none: No modifications.
# - validate: Validates tables against JPA entities.
# - update: Updates schema adding missing columns/tables.
# - create: Creates schema on startup, dropping existing tables.
# - create-drop: Creates schema on startup and drops it when JVM shuts down.
spring.jpa.hibernate.ddl-auto=create-drop


# ==========================================
# 4. DATA INITIALIZATION WITH SQL SCRIPTS
# ==========================================
# Controls execution mode for schema.sql and data.sql:
# - always: Always run SQL scripts on startup.
# - never: Never run automatic SQL scripts.
spring.sql.init.mode=always

# Show or hide SQL queries in console logs
spring.jpa.show-sql=false

# Deferred DataSource initialization:
# When set to true, forces Spring Boot to wait for Hibernate DDL table creation
# BEFORE attempting to execute data.sql scripts.
spring.jpa.defer-datasource-initialization=true


# ==========================================
# 5. H2 WEB CONSOLE
# ==========================================
# Enables the interactive browser console for inspecting H2 databases
spring.h2.console.enabled=true

# URI path for H2 console (e.g., http://localhost:8080/h2-console)
spring.h2.console.path=/h2-console
```

:::note[Why is `DB_CLOSE_DELAY=-1` Essential in H2?]
By default, in-memory H2 databases drop all tables and destroy content as soon as the last active JDBC connection closes. Setting `;DB_CLOSE_DELAY=-1` in the JDBC connection string keeps the in-memory database alive throughout the Spring Boot JVM process lifecycle.
:::

---

## 3. Initial Data Seeding with `data.sql`

When `spring.jpa.defer-datasource-initialization=true` and `spring.sql.init.mode=always` are set, Spring Boot automatically picks up `data.sql` from `src/main/resources/`.

```sql title="src/main/resources/data.sql" showLineNumbers
-- Initial data seed script executed automatically at application startup
INSERT INTO usuarios (nombre, email) VALUES ('Kevin', 'kevin@icesi.edu.co');
INSERT INTO usuarios (nombre, email) VALUES ('Ana', 'ana@icesi.edu.co');
INSERT INTO usuarios (nombre, email) VALUES ('Carlos', 'carlos@icesi.edu.co');
```

---

## 4. Step-by-Step Practical Guide

<StepByStep>
  <Step number="1" title="Include starters in build file">
    Verify that `spring-boot-starter-data-jpa` and `h2` or `postgresql` drivers are declared in `pom.xml` or `build.gradle`.
  </Step>
  <Step number="2" title="Configure H2 in-memory in application.properties">
    Set `spring.datasource.url=jdbc:h2:mem:db-kevin;DB_CLOSE_DELAY=-1` and enable `spring.h2.console.enabled=true`.
  </Step>
  <Step number="3" title="Set DDL strategy and deferred initialization">
    Set `spring.jpa.hibernate.ddl-auto=create-drop` and `spring.jpa.defer-datasource-initialization=true`.
  </Step>
  <Step number="4" title="Create data.sql file">
    Place `data.sql` inside `src/main/resources/` with `INSERT` statements to populate initial rows.
  </Step>
  <Step number="5" title="Verify records in H2 Console">
    Start the app, navigate to `http://localhost:8080/h2-console`, enter JDBC URL `jdbc:h2:mem:db-kevin`, and query tables.
  </Step>
</StepByStep>

---

## Self-Assessment Quiz

<Quiz id="s4-spring-data-config-quiz">
  <Question title="What is the role of DB_CLOSE_DELAY=-1 in an in-memory H2 JDBC URL?">
    <Option>To disable connection with PostgreSQL.</Option>
    <Option correct>To keep the in-memory database alive in RAM throughout the JVM process, preventing schema destruction when the last connection closes.</Option>
    <Option>To force Hibernate into ddl-auto=validate mode.</Option>
    <Option>To change Tomcat port to 5432.</Option>
  </Question>
  <Question title="Why is spring.jpa.defer-datasource-initialization=true required when combining data.sql with ddl-auto=create-drop?">
    <Option>To ignore pom.xml compilation errors.</Option>
    <Option correct>To force Spring Boot to wait for Hibernate table creation before attempting to execute data.sql scripts.</Option>
    <Option>To disable H2 browser console.</Option>
    <Option>To avoid using JDBC drivers.</Option>
  </Question>
  <Question title="What does spring.jpa.hibernate.ddl-auto=create-drop do?">
    <Option>Validates table existence without modifying them.</Option>
    <Option correct>Creates table schema on startup and drops it completely when Spring Boot shuts down.</Option>
    <Option>Does not perform any database modification.</Option>
    <Option>Permanently deletes data.sql files.</Option>
  </Question>
  <Question title="Which Maven starter is required to integrate Spring Data JPA into Spring Boot?">
    <Option>spring-boot-starter-web</Option>
    <Option correct>spring-boot-starter-data-jpa</Option>
    <Option>spring-boot-starter-security</Option>
    <Option>spring-boot-starter-jdbc-only</Option>
  </Question>
  <Question title="Where does Spring Boot look by default for data.sql to seed records?">
    <Option>src/main/java/data.sql</Option>
    <Option correct>src/main/resources/data.sql</Option>
    <Option>src/test/resources/sql/data.sql</Option>
    <Option>target/classes/db/data.sql</Option>
  </Question>
  <Question title="Which property enables the interactive web browser console for H2 databases?">
    <Option>spring.h2.console.active=true</Option>
    <Option correct>spring.h2.console.enabled=true</Option>
    <Option>spring.datasource.console=always</Option>
    <Option>logging.level.h2=DEBUG</Option>
  </Question>
  <Question title="What is the difference between H2 in-memory (mem:db) vs H2 file-persisted (./db)?">
    <Option>In-memory H2 requires PostgreSQL installed and file H2 does not.</Option>
    <Option correct>In-memory H2 stores data in RAM lost on shutdown, while file H2 persists data to local disk storage.</Option>
    <Option>File H2 does not support data.sql INSERT statements.</Option>
    <Option>There is no difference.</Option>
  </Question>
  <Question title="What effect does setting spring.sql.init.mode=always have?">
    <Option>Disables execution of SQL scripts.</Option>
    <Option correct>Forces automatic execution of SQL initialization scripts (such as data.sql) whenever the application starts.</Option>
    <Option>Sets H2 console port to 8080.</Option>
    <Option>Generates encrypted passwords in PostgreSQL.</Option>
  </Question>
  <Question title="Which terminal command is recommended to verify Spring Data JPA artifacts in your local repository?">
    <Option>./mvnw spring-boot:run-db</Option>
    <Option correct>./mvnw clean install (or ./gradlew build)</Option>
    <Option>./mvnw test-jpa --offline</Option>
    <Option>java -jar data.jar</Option>
  </Question>
  <Question title="What is the purpose of org.hibernate.dialect.PostgreSQLDialect?">
    <Option>To automatically create PostgreSQL system users.</Option>
    <Option correct>To instruct Hibernate how to translate queries into optimal PostgreSQL SQL syntax.</Option>
    <Option>To disable table foreign keys.</Option>
    <Option>To format controller JSON responses.</Option>
  </Question>
</Quiz>
