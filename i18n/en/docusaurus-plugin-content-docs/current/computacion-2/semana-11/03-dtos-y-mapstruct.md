---
sidebar_position: 3
sidebar_label: "DTOs (Data Transfer Objects)"
description: "Apply the DTO pattern to isolate persistence entities and automate object mapping with MapStruct."
---

# DTOs (Data Transfer Objects)

In enterprise application architecture, mixing database persistence entities directly with data transferred across the network is a common source of vulnerabilities and performance degradation. The **DTO (Data Transfer Object)** pattern is a foundational solution to decouple internal domain models from public API contracts.

---

## 1. The DTO Pattern and the Isolation Boundary

A **DTO** is a plain object (POJO) whose sole responsibility is transporting data between software layers (e.g., between the service layer and the REST controller), containing zero business logic or persistence annotations:

<div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
  <img
    src="/img/computacion-2/dto-layer-abstraction.svg"
    alt="DTO Pattern and Isolation Boundary"
    style={{ width: "100%", maxWidth: "980px" }}
  />
</div>

### Component Breakdown and Architectural Rationale

| Diagram Layer | Representative Class | Why It Must Be Isolated |
| :--- | :--- | :--- |
| **Private Zone (Persistence)** | `@Entity Usuario` | Directly models SQL database tables. Contains sensitive fields (`passwordHash`, `salt`), internal metadata (`createdAt`), and bidirectional relationships (`@OneToMany List<Pedido>`). |
| **Risks of Exposing Entities** | *Data Leakage & Bugs* | **1. Secret leakage:** JSON serialization can expose password hashes or audit fields.<br/>**2. Infinite recursion in Jackson:** If `User` has `orders` and each `Order` references `user`, serialization collapses with a `StackOverflowError`.<br/>**3. Mass Assignment attacks:** A malicious client could send `{"id": 1, "role": "ADMIN"}` in a JSON body and overwrite protected properties if bound directly to the entity. |
| **Transformation Layer** | `MapStruct` | Filters, copies, and converts only authorized attributes between entities and DTOs. |
| **Public Zone (REST API)** | `UsuarioDTO` | Provides a clean, stable projection optimized for web and mobile clients. Changes in database table columns do not break the public API contract. |

---

## 2. DTO Types by Operation

Robust applications design differentiated DTOs for incoming versus outgoing data:

1. **Request DTOs (Input):** Represent data sent by the client to create or update a resource (e.g., `UsuarioCreateDTO`). Include validation annotations (`@NotBlank`, `@Email`, `@Size`).
2. **Response DTOs (Output):** Represent projected data authorized for client consumption (e.g., `UsuarioResponseDTO`). Never contain passwords or internal hashes.

### Hierarchies with Abstract DTOs
When multiple DTOs share common fields (such as `name` and `email`), we can define an abstract base class:

```java title="src/main/java/com/ejemplo/demo/dto/PersonaBaseDTO.java" showLineNumbers
package com.ejemplo.demo.dto;

/**
 * Abstract class to reuse shared attributes.
 * Cannot be directly instantiated; serves as a template for concrete DTOs.
 */
public abstract class PersonaBaseDTO {
    private String nombre;
    private String email;

    public PersonaBaseDTO() {}

    public PersonaBaseDTO(String nombre, String email) {
        this.nombre = nombre;
        this.email = email;
    }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
```

```java title="src/main/java/com/ejemplo/demo/dto/EmpleadoDTO.java" showLineNumbers
package com.ejemplo.demo.dto;

/**
 * Extends PersonaBaseDTO adding employee-specific fields.
 */
public class EmpleadoDTO extends PersonaBaseDTO {
    private String cargo;
    private Double salario;

    public EmpleadoDTO() {}

    public String getCargo() { return cargo; }
    public void setCargo(String cargo) { this.cargo = cargo; }

    public Double getSalario() { return salario; }
    public void setSalario(Double salario) { this.salario = salario; }
}
```

---

## 3. Automatic Mapping with MapStruct

Writing manual entity-to-DTO conversions (`dto.setName(entity.getName())`) is repetitive, error-prone, and cumbersome to maintain. **MapStruct** is an annotation-processor-based code generator for Java that automates this translation.

### How MapStruct Works (Compile-Time vs. Runtime)

Unlike libraries like *ModelMapper* that rely on **runtime reflection** (which adds overhead to every HTTP request), MapStruct operates **during compilation** (`javac`):

<ZoomableMermaid value={`flowchart LR
    Source["<b>UsuarioMapper.java</b><br/>Interface with @Mapper"]
    Compiler["<b>Java Compiler (javac)</b><br/>+ mapstruct-processor"]
    Generated["<b>UsuarioMapperImpl.class</b><br/>Generated Java code (get/set)"]
    Spring["<b>Spring IoC</b><br/>Injectable with @Autowired"]

    Source --> Compiler
    Compiler -->|Generates native source code| Generated
    Generated -->|Registered as Spring Bean| Spring

    classDef srcStyle fill:#eff6ff,stroke:#3b82f6,stroke-width:1.5px,color:#1e3a8a;
    classDef compStyle fill:#fef3c7,stroke:#d97706,stroke-width:1.5px,color:#92400e;
    classDef genStyle fill:#f0fdf4,stroke:#16a34a,stroke-width:1.5px,color:#14532d;

    class Source srcStyle;
    class Compiler compStyle;
    class Generated,Spring genStyle;
`} />

**Key advantages:**
* **Maximum Performance:** The generated implementation consists of plain getters and setters. It executes as fast as handwritten code.
* **Type Safety:** If a field is renamed or types mismatch, the compiler raises an error before code reaches production.
* **Zero Heavy Dependencies in Production:** Does not require complex reflection engines.

---

## 4. Hands-on MapStruct Integration Guide

<StepByStep>
  <Step number="1" title="Configure Dependencies and Maven Plugin">
    Add MapStruct dependencies and configure the annotation processor in your `pom.xml`:

```xml title="pom.xml" showLineNumbers
<properties>
    <org.mapstruct.version>1.5.5.Final</org.mapstruct.version>
</properties>

<dependencies>
    <!-- MapStruct annotation core -->
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>${org.mapstruct.version}</version>
    </dependency>

    <!-- Support for Java 8 Date/Time types with Jackson -->
    <dependency>
        <groupId>com.fasterxml.jackson.datatype</groupId>
        <artifactId>jackson-datatype-jsr310</artifactId>
    </dependency>
</dependencies>

<build>
    <plugins>
        <!-- Compiler plugin configuring MapStruct annotation processor -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.11.0</version>
            <configuration>
                <annotationProcessorPaths>
                    <path>
                        <groupId>org.mapstruct</groupId>
                        <artifactId>mapstruct-processor</artifactId>
                        <version>${org.mapstruct.version}</version>
                    </path>
                </annotationProcessorPaths>
            </configuration>
        </plugin>
    </plugins>
</build>
```
  </Step>

  <Step number="2" title="Define the Mapper Interface">
    Declare an interface annotated with `@Mapper(componentModel = "spring")`. The `componentModel = "spring"` parameter instructs MapStruct to mark the generated implementation with `@Component`, allowing it to be injected directly into any Spring service:

```java title="src/main/java/com/ejemplo/demo/mapper/UsuarioMapper.java" showLineNumbers
package com.ejemplo.demo.mapper;

import com.ejemplo.demo.dto.UsuarioResponseDTO;
import com.ejemplo.demo.model.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    /**
     * Maps from Entity to Response DTO.
     * Properties with matching names (id, nombre, email) map automatically.
     */
    UsuarioResponseDTO toDTO(Usuario usuario);

    /**
     * Inverse mapping from DTO to Entity
     */
    Usuario toEntity(UsuarioResponseDTO dto);
}
```
  </Step>

  <Step number="3" title="Advanced Mapping and Field Renaming">
    When property names differ between the entity and DTO, or when delegating nested mappings, use the `@Mapping` annotation:

```java title="src/main/java/com/ejemplo/demo/mapper/ProyectoMapper.java" showLineNumbers
package com.ejemplo.demo.mapper;

import com.ejemplo.demo.dto.ProyectoResponseDTO;
import com.ejemplo.demo.model.Proyecto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

// 'uses = {TareaMapper.class}' delegates conversion of nested task collections
@Mapper(componentModel = "spring", uses = {TareaMapper.class})
public interface ProyectoMapper {

    /**
     * Explicit field mapping:
     * - 'titulo' on the entity maps to 'nombreProyecto' on the DTO.
     * - 'passwordSecreta' is deliberately ignored.
     */
    @Mapping(source = "titulo", target = "nombreProyecto")
    @Mapping(target = "passwordSecreta", ignore = true)
    ProyectoResponseDTO toDTO(Proyecto proyecto);
}
```
  </Step>

  <Step number="4" title="Inject and Use the Mapper in the Service Layer">
    Inject the generated mapper into the service to transform domain objects before handing them to the controller:

```java title="src/main/java/com/ejemplo/demo/service/UsuarioService.java" showLineNumbers
package com.ejemplo.demo.service;

import com.ejemplo.demo.dto.UsuarioResponseDTO;
import com.ejemplo.demo.mapper.UsuarioMapper;
import com.ejemplo.demo.model.Usuario;
import com.ejemplo.demo.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioMapper usuarioMapper; // Injected MapStruct-generated bean

    public UsuarioResponseDTO buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Clean, type-safe conversion to DTO
        return usuarioMapper.toDTO(usuario);
    }
}
```
  </Step>
</StepByStep>

---

## 5. Summary of Best Practices

1. **Never return JPA entities directly in a `@RestController`:** Protect your application from accidental data exposure and mass assignment attacks.
2. **Use independent Request DTOs and Response DTOs:** Each operation has distinct validation requirements and data exposure boundaries.
3. **Leverage MapStruct to eliminate boilerplate mapping code:** Saves hundreds of lines of repetitive code while ensuring compile-time type verification.
