---
sidebar_position: 3
---

# DTOs (Data Transfer Objects)

Los DTOs son objetos que se utilizan para transferir datos entre diferentes capas de una aplicación, como entre la capa de presentación y la capa de servicio. Su principal objetivo es encapsular los datos y reducir el número de llamadas a la red o a la base de datos.

## Ventajas de usar DTOs

1. **Reducción de la Carga Útil**: Al enviar solo los datos necesarios, se minimiza la cantidad de información transferida.
2. **Desacoplamiento**: Los DTOs ayudan a desacoplar las capas de la aplicación, permitiendo cambios en una capa sin afectar a las demás.
3. **Facilidad de Mantenimiento**: Al tener una estructura clara para los datos, es más fácil realizar cambios y mantener el código.

## Ejemplo de un DTO

```java
public class UsuarioDTO {
    private Long id;
    private String nombre;
    private String email;

    // Getters y Setters
}
```

## Uso de DTOs en un Controlador

```java
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> obtenerUsuario(@PathVariable Long id) {
        UsuarioDTO usuario = new UsuarioDTO();
        usuario.setId(id);
        usuario.setNombre("Juan");
        usuario.setEmail("juan@example.com");
        return ResponseEntity.ok(usuario);
    }
}
```

### Creación de DTOs abstractos

En algunos casos, puede ser útil crear DTOs abstractos para definir una estructura base que otros DTOs pueden extender. Esto es especialmente útil cuando varios DTOs comparten atributos comunes.

```java
public abstract class PersonaDTO {
    private String nombre;
    private String email;

    // Getters y Setters
}

public class EmpleadoDTO extends PersonaDTO {
    private String puesto;
    private Double salario;

    // Getters y Setters
}
```

¿Por qué es una clase abstracta? Porque no queremos que se instancien objetos de `PersonaDTO` directamente, sino que sirva como base para otros DTOs más específicos como `EmpleadoDTO`.

## MapStruct

MapStruct es una herramienta que permite la conversión automática entre entidades y DTOs, generando el código necesario en tiempo de compilación. Esto ayuda a evitar la escritura manual de métodos de mapeo y reduce errores.

### ¿Cómo funciona MapStruct?

MapStruct utiliza interfaces anotadas con `@Mapper` para definir los métodos de conversión entre objetos. A partir de estas interfaces, MapStruct genera implementaciones concretas que realizan el mapeo de atributos, incluso permitiendo personalizar los nombres de los campos y el uso de otros mappers.

### Dependencias para utilizar MapStruct

Para usar MapStruct en un proyecto Maven, debes agregar las siguientes dependencias en tu `pom.xml`:

```xml
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct-processor</artifactId>
    <version>1.5.5.Final</version>
    <scope>provided</scope>
</dependency>
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.5.5.Final</version>
</dependency>
<dependency>
    <groupId>com.fasterxml.jackson.datatype</groupId>
    <artifactId>jackson-datatype-jsr310</artifactId>
    <version>2.18.2</version>
</dependency>
```

Te explico aquí que la dependencia `jackson-datatype-jsr310` es útil si estás trabajando con tipos de datos de Java 8 como `LocalDate` o `LocalDateTime`, ya que facilita su serialización y deserialización con Jackson.

Y también debes configurar el plugin del compilador para que MapStruct pueda generar el código durante la compilación:

```xml
<path>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct-processor</artifactId>
    <version>1.5.5.Final</version>
</path>
```


### Capacidades principales

- Mapeo automático de atributos con el mismo nombre.
- Personalización de mapeos usando la anotación `@Mapping`.
- Soporte para mapeo de colecciones y objetos anidados.
- Integración con frameworks como Spring.

### Ejemplo básico

```java
@Mapper
public interface UsuarioMapper {
    UsuarioMapper INSTANCE = Mappers.getMapper(UsuarioMapper.class);

    UsuarioDTO usuarioToUsuarioDTO(Usuario usuario);
    Usuario usuarioDTOToUsuario(UsuarioDTO usuarioDTO);
}
```

### Ejemplo avanzado con mapeo personalizado y uso de otros mappers

Supongamos que tienes una entidad `Project` con una lista de tareas (`Task`). Puedes usar MapStruct para mapear estos objetos y sus relaciones:

```java
@Mapper(componentModel = "spring", uses = {TaskMapper.class})
public interface ProjectMapper {

    @Mappings({
        @Mapping(source = "id", target = "id"),
        @Mapping(source = "name", target = "nombreCambiado"),
        @Mapping(source = "tasks", target = "tasks"),
    })
    ProjectOutDTO toProjectOutDTO(Project project);
}

@Mapper(componentModel = "spring")
public interface TaskMapper {

    @Mappings({
        @Mapping(source = "id", target = "id"),
        @Mapping(source = "name", target = "name"),
        @Mapping(source = "description", target = "description"),
        @Mapping(source = "dateCreated", target = "dateCreated"),
        @Mapping(source = "dueDate", target = "dueDate"),
        @Mapping(source = "status", target = "status")
    })
    TaskOutDTO toTaskOutDTO(Task task);
}
```

En este ejemplo, `ProjectMapper` utiliza `TaskMapper` para convertir la lista de tareas asociadas a un proyecto. Además, puedes personalizar el nombre de los atributos de destino, como en el caso de `name` a `nombreCambiado`.

### Beneficios de MapStruct

- Elimina código repetitivo de mapeo.
- Facilita el mantenimiento y la evolución de los DTOs y entidades.
- Permite mapeos complejos y personalizados de manera sencilla.
- Se integra fácilmente con Spring y otros frameworks.
