---
sidebar_position: 3
sidebar_label: "DTOs (Data Transfer Objects)"
description: "Aplica el patrón DTO para aislar las entidades de la capa de persistencia y automatiza el mapeo con MapStruct."
---

# DTOs (Data Transfer Objects)

En la arquitectura de aplicaciones empresariales, mezclar las clases de persistencia de base de datos con los datos transferidos a través de la red es una fuente común de vulnerabilidades y problemas de rendimiento. El patrón **DTO (Data Transfer Object)** surge como una solución fundamental para desacoplar el modelo interno de la API pública.

---

## 1. El Patrón DTO y la Barrera de Aislamiento

Un **DTO** es un objeto simple (POJO) cuyo único propósito es transportar datos entre capas de software (por ejemplo, entre la capa de servicio y el controlador REST), sin contener lógica de negocio ni anotaciones de persistencia:

<div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
  <img
    src="/img/computacion-2/dto-layer-abstraction.svg"
    alt="Patrón DTO y Barrera de Aislamiento"
    style={{ width: "100%", maxWidth: "980px" }}
  />
</div>

### Desglose de Componentes y Razones Arquitectónicas

| Capa del Diagrama | Clase Representativa | Por qué debe aislarse |
| :--- | :--- | :--- |
| **Zona Privada (Persistencia)** | `@Entity Usuario` | Refleja fielmente las tablas de la base de datos SQL. Contiene campos confidenciales (`passwordHash`, `salt`), metadatos internos (`createdAt`) y relaciones bidireccionales (`@OneToMany List<Pedido>`). |
| **Riesgos de Exponer la Entidad** | *Fuga y Vulnerabilidad* | **1. Fuga de secretos:** La serialización JSON podría exponer hashes o datos privados.<br/>**2. Bucles infinitos en Jackson:** Si `Usuario` tiene `pedidos` y cada `Pedido` apunta a `usuario`, la serialización colapsa en un `StackOverflowError`.<br/>**3. Ataques Mass Assignment:** Un cliente malicioso podría enviar en un JSON `{"id": 1, "rol": "ADMIN"}` y sobreescribir datos protegidos si se enlaza directamente a la entidad. |
| **Capa de Transformación** | `MapStruct` | Filtra, copia y traduce únicamente los atributos acordados entre la entidad y el DTO. |
| **Zona Pública (API REST)** | `UsuarioDTO` | Proporciona una proyección limpia, estable y optimizada para el cliente web o móvil. Los cambios en las columnas de la base de datos no rompen el contrato de la API. |

---

## 2. Tipos de DTOs según la Operación

En aplicaciones robustas se diseñan DTOs diferenciados para la entrada y la salida de información:

1. **Request DTOs (Entrada):** Representan los datos que el cliente envía para crear o actualizar un recurso (por ejemplo: `UsuarioCreateDTO`). Contienen anotaciones de validación (`@NotBlank`, `@Email`, `@Size`).
2. **Response DTOs (Salida):** Representan los datos proyectados que el cliente tiene autorización de visualizar (por ejemplo: `UsuarioResponseDTO`). No incluyen contraseñas ni datos internos.

### Jerarquías con DTOs Abstractos
Cuando múltiples DTOs comparten atributos comunes (como `nombre` y `email`), podemos definir una clase base abstracta:

```java title="src/main/java/com/ejemplo/demo/dto/PersonaBaseDTO.java" showLineNumbers
package com.ejemplo.demo.dto;

/**
 * Clase abstracta para reutilizar atributos comunes.
 * No se instancia directamente, sirve como molde para DTOs concretos.
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
 * Extiende PersonaBaseDTO incorporando atributos propios del empleado.
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

## 3. Mapeo Automático con MapStruct

Escribir conversiones manuales entre entidades y DTOs (`dto.setNombre(entidad.getNombre())`) es repetitivo, propenso a errores humanos y tedioso de mantener. **MapStruct** es una biblioteca generadora de código basada en procesadores de anotaciones de Java que automatiza este proceso.

### ¿Cómo Funciona MapStruct? (Tiempo de Compilación vs. Runtime)

A diferencia de herramientas como *ModelMapper* que utilizan **reflexión en tiempo de ejecución** (lo que ralentiza las peticiones HTTP), MapStruct opera **durante la compilación del código** (`javac`):

<ZoomableMermaid value={`flowchart LR
    Source["<b>UsuarioMapper.java</b><br/>Interfaz con @Mapper"]
    Compiler["<b>Compilador Java (javac)</b><br/>+ mapstruct-processor"]
    Generated["<b>UsuarioMapperImpl.class</b><br/>Código Java generado (get/set)"]
    Spring["<b>Spring IoC</b><br/>Inyectable con @Autowired"]

    Source --> Compiler
    Compiler -->|Genera código fuente nativo| Generated
    Generated -->|Registrado como Bean| Spring

    classDef srcStyle fill:#eff6ff,stroke:#3b82f6,stroke-width:1.5px,color:#1e3a8a;
    classDef compStyle fill:#fef3c7,stroke:#d97706,stroke-width:1.5px,color:#92400e;
    classDef genStyle fill:#f0fdf4,stroke:#16a34a,stroke-width:1.5px,color:#14532d;

    class Source srcStyle;
    class Compiler compStyle;
    class Generated,Spring genStyle;
`} />

**Ventajas clave:**
* **Máximo rendimiento:** La implementación generada utiliza métodos `get` y `set` puros. Es tan rápido como el código escrito a mano.
* **Seguridad de tipos:** Si un campo no coincide o cambia de tipo de dato, el compilador genera un error antes de que la aplicación llegue a producción.
* **Cero dependencias pesadas en producción:** No requiere motores de reflexión complejos.

---

## 4. Guía Práctica de Integración de MapStruct

<StepByStep>
  <Step number="1" title="Configurar Dependencias y Plugin de Maven">
    Agrega las dependencias de MapStruct y configura el procesador de anotaciones en tu archivo `pom.xml`:

```xml title="pom.xml" showLineNumbers
<properties>
    <org.mapstruct.version>1.5.5.Final</org.mapstruct.version>
</properties>

<dependencies>
    <!-- Núcleo de anotaciones de MapStruct -->
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>${org.mapstruct.version}</version>
    </dependency>

    <!-- Soporte para serialización de tipos Java 8 Date/Time con Jackson -->
    <dependency>
        <groupId>com.fasterxml.jackson.datatype</groupId>
        <artifactId>jackson-datatype-jsr310</artifactId>
    </dependency>
</dependencies>

<build>
    <plugins>
        <!-- Plugin del compilador configurando el procesador de anotaciones de MapStruct -->
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

  <Step number="2" title="Definir la Interfaz del Mapper">
    Declara una interfaz con la anotación `@Mapper(componentModel = "spring")`. El parámetro `componentModel = "spring"` instruye a MapStruct para que anote la clase generada con `@Component`, permitiendo inyectarla directamente en cualquier servicio de Spring Boot:

```java title="src/main/java/com/ejemplo/demo/mapper/UsuarioMapper.java" showLineNumbers
package com.ejemplo.demo.mapper;

import com.ejemplo.demo.dto.UsuarioResponseDTO;
import com.ejemplo.demo.model.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    /**
     * Mapea de Entidad a DTO de respuesta.
     * Los campos con el mismo nombre (id, nombre, email) se copian de forma automática.
     */
    UsuarioResponseDTO toDTO(Usuario usuario);

    /**
     * Mapeo inverso de DTO hacia Entidad
     */
    Usuario toEntity(UsuarioResponseDTO dto);
}
```
  </Step>

  <Step number="3" title="Mapeo Avanzado y Renombrado de Campos">
    Cuando los nombres de los atributos de la entidad no coinciden con los del DTO, o cuando deseamos reutilizar mappers subordinados para listas y relaciones anidadas, utilizamos la anotación `@Mapping`:

```java title="src/main/java/com/ejemplo/demo/mapper/ProyectoMapper.java" showLineNumbers
package com.ejemplo.demo.mapper;

import com.ejemplo.demo.dto.ProyectoResponseDTO;
import com.ejemplo.demo.model.Proyecto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

// 'uses = {TareaMapper.class}' permite delegar la conversión de colecciones de tareas
@Mapper(componentModel = "spring", uses = {TareaMapper.class})
public interface ProyectoMapper {

    /**
     * Personalización explícita de campos:
     * - 'titulo' en la entidad se mapea al atributo 'nombreProyecto' en el DTO.
     * - 'passwordSecreta' se ignora deliberadamente para no exponerla.
     */
    @Mapping(source = "titulo", target = "nombreProyecto")
    @Mapping(target = "passwordSecreta", ignore = true)
    ProyectoResponseDTO toDTO(Proyecto proyecto);
}
```
  </Step>

  <Step number="4" title="Inyectar y Utilizar el Mapper en el Servicio">
    Inyecta el mapper generado en la capa de servicio para transformar los datos antes de entregarlos al controlador:

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
    private UsuarioMapper usuarioMapper; // Inyección del bean generado por MapStruct

    public UsuarioResponseDTO buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Conversión limpia y segura a DTO
        return usuarioMapper.toDTO(usuario);
    }
}
```
  </Step>
</StepByStep>

---

## 5. Resumen de Buenas Prácticas

1. **Nunca devuelvas Entidades JPA directamente en un `@RestController`:** Protege tu aplicación contra exposición accidental de campos sensibles y ataques de asignación masiva.
2. **Usa Request DTOs y Response DTOs independientes:** Cada operación tiene necesidades de validación y exposición distintas.
3. **Aprovecha MapStruct para eliminar código repetitivo:** Ahorra cientos de líneas de código manual y garantiza verificaciones de tipos estrictas durante el tiempo de compilación.
