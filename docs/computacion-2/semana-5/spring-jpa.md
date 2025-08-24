---
sidebar_position: 2
---

# Spring Data JPA

Introducción a Spring Data JPA.

<iframe 
    src="https://www.canva.com/design/DAGuk3Z78AE/0fZHHcXwXwB7PL92i_qtpQ/view?embed"
    width="100%"
    height="600px"
    allowfullscreen="true"
    frameborder="0"
></iframe>

## 1. ¿Qué es JPA?
**JPA (Java Persistence API)** es una especificación de Java que define cómo manejar datos relacionales en aplicaciones Java.  
No es una implementación, sino un **conjunto de interfaces y anotaciones** que permiten trabajar con objetos Java y almacenarlos en bases de datos relacionales sin necesidad de escribir SQL directamente.

Ejemplo de anotación básica de JPA:
```java
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Usuario {
    @Id
    private Long id;
    private String nombre;
}
```

---

## 2. ¿Qué es Hibernate?
**Hibernate** es la implementación más usada de JPA.  
Cuando usas JPA en Spring Boot, lo más común es que **internamente se utilice Hibernate como proveedor ORM**.

Hibernate agrega:
- Manejo avanzado de caché.
- Traducción automática de HQL (Hibernate Query Language) a SQL.
- Gestión de proxies para relaciones.

En resumen:
- **JPA = Estándar** (define cómo).
- **Hibernate = Implementación** (realiza el cómo).

---

## 3. Spring Data JPA
Spring Data JPA es un módulo de Spring que simplifica aún más el uso de JPA y Hibernate.  
Permite crear repositorios sin necesidad de implementar consultas SQL o HQL de forma manual.

Ejemplo de repositorio con Spring Data JPA:
```java
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Consulta personalizada con query method
    Usuario findByNombre(String nombre);
}
```

---

## 4. Creando Entities en Spring Boot

En Spring Boot, las entidades suelen colocarse en el paquete `model` o `entity`.  
Ejemplo básico:

```java
import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(unique = true, nullable = false)
    private String email;

    // Getters y Setters
}
```

### Anotaciones más comunes en entidades:
- `@Entity` → Marca la clase como entidad.
- `@Table` → Permite configurar el nombre de la tabla.
- `@Id` → Define la clave primaria.
- `@GeneratedValue` → Estrategia de generación de IDs (`AUTO`, `IDENTITY`, `SEQUENCE`).
- `@Column` → Configura columnas (longitud, unicidad, nullables).
- `@Transient` → Ignora un campo para que no se persista en la base de datos.

---

## 5. Relaciones entre entidades

### OneToMany y ManyToOne (Uno a muchos y muchos a uno)

Ejemplo: **Un usuario puede tener muchos pedidos**.

```java
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pedido> pedidos;

    // getters y setters
}

@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String producto;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // getters y setters
}
```

### ManyToMany (Muchos a muchos)

Ejemplo: **Un estudiante puede tener muchos cursos y un curso puede tener muchos estudiantes**.

```java
@Entity
@Table(name = "estudiantes")
public class Estudiante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @ManyToMany
    @JoinTable(
        name = "estudiante_curso",
        joinColumns = @JoinColumn(name = "estudiante_id"),
        inverseJoinColumns = @JoinColumn(name = "curso_id")
    )
    private List<Curso> cursos;
}

@Entity
@Table(name = "cursos")
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @ManyToMany(mappedBy = "cursos")
    private List<Estudiante> estudiantes;
}
```

---

## 6. Creación de Repositorios

Spring Boot detecta automáticamente las interfaces que extienden `JpaRepository` y crea las implementaciones en tiempo de ejecución.

```java
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByProducto(String producto);
    List<Pedido> findByUsuarioId(Long usuarioId);
}
```

---

## 7. Uso en un Service y Controller

```java
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario crearUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }
}
```

Y en un **Controller**:

```java
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public Usuario crear(@RequestBody Usuario usuario) {
        return usuarioService.crearUsuario(usuario);
    }

    @GetMapping
    public List<Usuario> listar() {
        return usuarioService.listarUsuarios();
    }
}
```

---

## 8. Resumen
- **JPA** → Es una especificación (interfaz).
- **Hibernate** → Es la implementación más usada de JPA.
- **Spring Data JPA** → Abstrae la complejidad y genera automáticamente las implementaciones de repositorios.
- Con **anotaciones** se definen entidades, columnas y relaciones.
- Con **repositorios** se accede fácilmente a los datos sin escribir SQL manualmente.

Esto permite que el desarrollador se enfoque en la lógica de negocio y no en detalles de persistencia.
