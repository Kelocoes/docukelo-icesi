# Guia_spring_boot

# Guía de estudio: Spring Boot desde cero

---

## 📑 Índice

### Introduccion a spring boot (model y relaciones)

1. [¿Qué es Spring Boot?](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
2. [Crear el proyecto con Spring Initializr](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
3. [Dependencias: qué hace cada una](about:blank#3-dependencias-qu%C3%A9-hace-cada-una)
4. [Estructura de carpetas de un proyecto](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
5. [El archivo](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21) [`application.properties`](about:blank#5-el-archivo-applicationproperties)
6. [La capa Model: entidades JPA](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
7. [Lombok: los getters y setters que no escribes](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
8. [Relaciones entre entidades (llaves foráneas)](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
9. [Clases intermedias: cuándo y por qué](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
10. [`@JsonIgnore` y el problema de la recursión infinita](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
11. [Cascade, orphanRemoval y borrado suave](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
12. [Ejemplo completo: app de Eventos](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)

### Service y JPA

1. [El modelo de aerolíneas](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21) 
2. [¿Qué es un Repository?](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
3. [Los métodos que vienen gratis](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
4. [Anatomía de un método derivado](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
5. [Consultas por atributo simple](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
6. [Consultas con condiciones y filtros](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
7. [Consultas con JOIN: navegando relaciones](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
8. [Mas ejemplos](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
9. [Ordenamiento, límites y paginación](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
10. [Usar el repositorio desde el Service](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
11. [Un servicio que llama a otro servicio](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
12. [Tabla de referencia rápida](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)

## Controller

### 🟦 Bloque 0 — Fundamentos previos

1. [¿Qué es un endpoint?](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
2. [Métodos HTTP e idempotencia](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
3. [Códigos de estado HTTP](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
4. [`@PathVariable` vs `@RequestParam`](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
5. [Los dos tipos de controlador: SSR vs CSR](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)

### 🟩 Bloque 1 — Construyendo el controlador MVC

1. [Paso 1: preparar el terreno](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
2. [Paso 2: la clase vacía](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
3. [Paso 3: el endpoint de prueba](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
4. [Paso 4: listar (el `Model` y las vistas)](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
5. [Paso 5: paginación con](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21) [`@RequestParam`](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
6. [Paso 6: buscar uno con](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21) [`@PathVariable`](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
7. [Paso 7: filtros de búsqueda](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
8. [Paso 8: crear (formulario + guardado)](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
9. [Paso 9: editar](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
10. [Paso 10: eliminar](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
11. [El controlador MVC completo](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
12. [Paso 11: login MVC y JSESSIONID](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)

### 🟨 Bloque 2 — De MVC a REST

1. [Paso 1: cambiar la anotación](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
2. [Paso 2: el problema de devolver entidades](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
3. [Paso 3: los DTOs](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
4. [Paso 4: convertir a mano (y por qué duele)](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
5. [Paso 5: MapStruct](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
6. [Paso 6: `ResponseEntity`](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21) [y códigos de estado](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
7. [Paso 7: CORS](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
8. [El controlador REST completo](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
9. [Comparación final MVC vs REST](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)

### 🟥 Bloque 3 — Autenticación y JWT

1. [Panorama: las piezas del rompecabezas](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
2. [Paso 1:](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21) [`SecurityAuthority`](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
3. [Paso 2:](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21) [`CustomUserDetails`](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
4. [Paso 3:](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21) [`CustomUserDetailsService`](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
5. [Paso 4:](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21) [`JwtService`](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
6. [Paso 5: DTOs de autenticación](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
7. [Paso 6:](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21) [`AuthService`](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
8. [Paso 7:](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21) [`AuthController`](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
9. [Paso 8:](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21) [`JwtAuthenticationFilter`](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
10. [Paso 9:](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21) [`CustomSecurityFilter`](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
11. [Paso 10:](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21) [`AppConfig` y las dos cadenas](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
12. [Paso 11:](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21) [`@PreAuthorize`](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
13. [El flujo completo, de principio a fin](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)
14. [JSESSIONID vs JWT](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)

### ⬜ Bloque 4 — Referencia

1. [Tablas de referencia y errores comunes](https://app.notion.com/p/Guia_spring_boot-3d34e04a83e480a1810fc84eb878a7b9?pvs=21)

---

# 1. ¿Qué es Spring Boot?

**Spring** es un framework de Java para construir aplicaciones. **Spring Boot** es una capa encima de Spring que elimina casi toda la configuración manual: trae un servidor web incrustado (Tomcat), auto-configura la conexión a base de datos, y arranca con un solo comando.

La idea central es la **inversión de control (IoC)**: tú no creas objetos con `new`, sino que Spring los crea y te los entrega donde los necesitas. A esos objetos administrados por Spring se les llama **beans**.

```java
// Sin Spring:
UserRepository repo = new UserRepositoryImpl(conexionBD);
UserService service = new UserServiceImpl(repo);

// Con Spring: solo declaras qué necesitas y él lo inyecta
@Service
public class UserService {
    private final UserRepository repo;   // Spring lo pone aquí solo
}
```

### Arquitectura por capas

Todo proyecto Spring Boot bien organizado sigue este flujo:

```
Cliente (Postman / navegador / frontend)
    ↓  HTTP
Controller   → recibe la petición, valida, arma la respuesta
    ↓
Service      → lógica de negocio, reglas, validaciones
    ↓
Repository   → habla con la base de datos (JPA)
    ↓
Base de datos (MySQL / PostgreSQL)
```

Y de vuelta en sentido inverso. **Cada capa solo habla con la de abajo**: un Controller nunca llama directo al Repository.

---

# 2. Crear el proyecto con Spring Initializr

### **Spring Initializr**

El punto de partida es [start.spring.io](https://start.spring.io/). Ahí seleccionamos:

- **Project**: Maven (o Gradle)
- **Language**: Java
- **Spring Boot version**: la estable más reciente (ej. 3.x)
- **Group**: com.example (o tu dominio)
- **Artifact**: nombre del proyecto
- **Dependencies** (importantes para empezar):
    - **Spring Web**: para construir APIs REST.
    - **Spring Data JPA**: para acceso a base de datos con ORM.
    - **Driver de base de datos** (ej. H2 para desarrollo, MySQL/PostgreSQL para producción).
    - **Lombok**: reduce código boilerplate (getters, setters, constructores, etc.).
    - Opcional: Spring Boot DevTools (recarga automática en desarrollo).

### **Estructura de carpetas generada**

text

```
src/
├── main/
│   ├── java/
│   │   └── com/example/proyecto/
│   │       ├── ProyectoApplication.java   (clase principal)
│   │       ├── controller/
│   │       ├── service/
│   │       ├── repository/
│   │       └── model/
│   └── resources/
│       ├── application.properties (o .yml)
│       └── static/, templates/ (para frontend)
└── test/
```

| Campo | Qué elegir | Por qué |
| --- | --- | --- |
| **Project** | Maven | Es el gestor de dependencias más común. Gradle también sirve. |
| **Language** | Java | — |
| **Spring Boot** | La versión estable más reciente (3.x) | Evita las versiones `SNAPSHOT` o `M1` (son de prueba). |
| **Group** | `com.example` | El “paquete raíz”. Suele ser el dominio de tu empresa al revés: `com.miempresa`. |
| **Artifact** | `eventos` | El nombre del proyecto. |
| **Name** | `eventos` | Se autocompleta. |
| **Package name** | `com.example.eventos` | Group + Artifact. Todas tus clases viven aquí adentro. |
| **Packaging** | Jar | Genera un `.jar` ejecutable con el servidor incluido. |
| **Java** | 17 o 21 | Spring Boot 3 requiere mínimo Java 17. |

Luego presionas **ADD DEPENDENCIES** y agregas las que necesitas (siguiente sección). Finalmente **GENERATE**, se descarga un `.zip`, lo descomprimes y lo abres en tu IDE.

---

# 3. Dependencias: qué hace cada una

Estas son las dependencias mínimas para una API REST con base de datos SQL:

| Dependencia | Nombre en Initializr | Para qué sirve |
| --- | --- | --- |
| **Spring Web** | `spring-boot-starter-web` | Permite crear controladores REST (`@RestController`), maneja HTTP y JSON. Incluye Tomcat. |
| **Spring Data JPA** | `spring-boot-starter-data-jpa` | Trae JPA + Hibernate. Es lo que convierte tus clases Java en tablas y te da los repositorios. |
| **MySQL Driver** | `mysql-connector-j` | El “traductor” para que Java pueda hablar con MySQL. Si usas PostgreSQL, eliges *PostgreSQL Driver*. |
| **Lombok** | `lombok` | Genera getters, setters y constructores automáticamente. |
| **Spring Boot DevTools** | `spring-boot-devtools` | Reinicia la app automáticamente al guardar cambios. Opcional pero muy cómodo. |
| **Validation** | `spring-boot-starter-validation` | Permite validar datos de entrada con `@NotNull`, `@Email`, etc. Opcional al inicio. |

### Cómo se ven en el `pom.xml`

Al generar el proyecto, estas dependencias quedan escritas en el archivo `pom.xml`:

```xml
<dependencies>
    <!-- API REST + Tomcat -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- JPA + Hibernate -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- Driver de MySQL -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <!-- Recarga automática -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
        <optional>true</optional>
    </dependency>
</dependencies>
```

> 💡 Si olvidaste una dependencia al crear el proyecto, puedes copiar el bloque `<dependency>` y pegarlo a mano en el `pom.xml`. Al guardar, Maven la descarga.
> 

### Alternativa para practicar: base de datos en memoria

Si no quieres instalar MySQL todavía, usa **H2 Database**. Es una base de datos que vive en la memoria RAM y se borra al apagar la app. Perfecta para aprender.

---

# 4. Estructura de carpetas de un proyecto

```
eventos/
├── pom.xml                          ← dependencias del proyecto
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/eventos/
│   │   │       ├── EventosApplication.java   ← clase principal (main)
│   │   │       ├── model/          ← las entidades (tablas)
│   │   │       │   ├── User.java
│   │   │       │   ├── Role.java
│   │   │       │   └── Event.java
│   │   │       ├── repository/     ← interfaces que hablan con la BD
│   │   │       │   ├── UserRepository.java
│   │   │       │   └── EventRepository.java
|		|		|				|		└── RoleRepository.java
│   │   │       ├── service/        ← lógica de negocio
│   │   │       │   ├── serviceImpl/
|		|		|				|		|		├── UserServiceImpl.java
|		|		|				|		|		├── EventServiceImpl.java
|		|		|				|		|		├── RoleServiceImpl.java
│   │   │       │   └── IUserService.java
|		|		|				|		└── IEventService.java
|		|		|				|		└── IRoleService.java
│   │   │       ├── controller/     ← endpoints HTTP
│   │   │       │   └── UserController.java
|		|		|				|		└── EventController.java
|		|		|				|		└── RoleController.java
│   │   │       └── dto/            ← objetos de transferencia (opcional)
│   │   └── resources/
│   │       ├── application.properties   ← configuración
│   │       └── static/                  ← archivos HTML/CSS/JS si los hay
│   └── test/
│       └── java/...                     ← pruebas unitarias
```

### La clase principal

```java
package com.example.eventos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EventosApplication {
    public static void main(String[] args) {
        SpringApplication.run(EventosApplication.class, args);
    }
}
```

`@SpringBootApplication` es en realidad tres anotaciones en una:

- `@Configuration` → esta clase puede definir beans.
- `@EnableAutoConfiguration` → configura automáticamente lo que encuentre en el classpath (si ve JPA, configura JPA; si ve Web, arranca Tomcat).
- `@ComponentScan` → busca clases con `@Component`, `@Service`, `@Repository`, `@RestController` **en este paquete y sus subpaquetes**.

Esa última es la razón por la que `model`, `service`, `repository` y `controller` **deben** estar dentro de `com.example.eventos`.

---

# 5. El archivo `application.properties`

Vive en `src/main/resources/`. Aquí configuras la conexión a base de datos y el comportamiento de Hibernate.

```
# ─── Nombre de la aplicación ─────────────────────────────
spring.application.name=eventos

# ─── Puerto del servidor ─────────────────────────────────
server.port=8080

# ─── Conexión a MySQL ────────────────────────────────────
spring.datasource.url=jdbc:mysql://localhost:3306/eventos_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=mi_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# ─── Hibernate / JPA ─────────────────────────────────────
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.open-in-view=false
```

### Explicación línea por línea

| Propiedad | Qué hace |
| --- | --- |
| `server.port` | Puerto donde escucha la app. Por defecto 8080. |
| `spring.datasource.url` | Dirección de la base de datos. `jdbc:mysql://host:puerto/nombre_bd`. El parámetro `createDatabaseIfNotExist=true` crea el esquema si no existe. |
| `spring.datasource.username` / `password` | Credenciales de MySQL. |
| `spring.datasource.driver-class-name` | La clase del driver. Normalmente Spring la detecta sola, pero es buena práctica ponerla. |
| **`spring.jpa.hibernate.ddl-auto`** | 🔑 **La más importante.** Define qué hace Hibernate con las tablas al arrancar. |
| `spring.jpa.show-sql` | Imprime en consola cada consulta SQL que ejecuta. Excelente para aprender y depurar. |
| `hibernate.format_sql` | Formatea ese SQL con saltos de línea para que sea legible. |
| `hibernate.dialect` | El “acento” de SQL que debe hablar Hibernate. Cambia según el motor. |
| `spring.jpa.open-in-view` | Ponlo en `false`. En `true` (el valor por defecto) mantiene la sesión de BD abierta durante toda la petición HTTP, lo que oculta errores de carga perezosa y consume conexiones. |

### Valores de `ddl-auto`

| Valor | Comportamiento | Cuándo usarlo |
| --- | --- | --- |
| `none` | No toca la base de datos. | Producción. |
| `validate` | Verifica que las tablas coincidan con tus entidades; si no, falla. | Producción con migraciones. |
| **`update`** | Crea tablas que faltan y agrega columnas nuevas. **No borra ni modifica columnas existentes.** | Desarrollo (el más usado al aprender). |
| `create` | Borra todo y crea las tablas de cero **cada vez que arrancas**. | Pruebas. |
| `create-drop` | Igual que `create`, pero además borra todo al apagar la app. | Tests automatizados. |

---

# 6. La capa Model: entidades JPA

Una **entidad** es una clase Java que representa una **tabla** de la base de datos. Cada atributo es una columna y cada instancia de la clase es una fila.

```java
package com.example.eventos.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_name", nullable = false, unique = true)
    private String userName;

    private String name;

    @Column(name = "last_name")
    private String lastName;

    private String password;

    private Integer age;
}
```

Hibernate traduce esto a:

```sql
CREATE TABLE users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_name  VARCHAR(255) NOT NULL UNIQUE,
    name       VARCHAR(255),
    last_name  VARCHAR(255),
    password   VARCHAR(255),
    age        INT
);
```

### Anotaciones de entidad

| Anotación | Qué hace |
| --- | --- |
| `@Entity` | Marca la clase como entidad JPA. **Sin esto, Hibernate la ignora.** |
| `@Id` | Marca el atributo como llave primaria. **Obligatorio.** |
| `@GeneratedValue` | La base de datos genera el ID automáticamente. |
| `@Column` | Configura la columna: nombre, `nullable`, `unique`, `length`, `updatable`. |
| `@Transient` | Este atributo **no** se guarda en la BD (es solo de memoria). |
| `@Enumerated(EnumType.STRING)` | Para guardar un `enum` como texto en vez de número. |

### Estrategias de `@GeneratedValue`

| Estrategia | Cómo funciona | Compatible con |
| --- | --- | --- |
| `IDENTITY` | Usa el `AUTO_INCREMENT` de la tabla. **La más común.** | MySQL, SQL Server |
| `SEQUENCE` | Usa una secuencia de BD. Más eficiente en lotes. | PostgreSQL, Oracle |
| `AUTO` | Hibernate decide. Puede sorprenderte. | Todas |
| `TABLE` | Usa una tabla auxiliar para llevar el contador. Lento. | Todas |

### Convención de nombres: camelCase → snake_case

Hibernate convierte automáticamente los nombres de atributos Java a nombres de columna SQL:

| Atributo Java | Columna generada |
| --- | --- |
| `userName` | `user_name` |
| `lastName` | `last_name` |
| `startDate` | `start_date` |

Entonces `@Column(name = "user_name")` sobre `userName` es **redundante**. Solo necesitas `@Column(name=...)` cuando el nombre de la columna **no** sigue esa convención, por ejemplo si la tabla ya existía y la columna se llama `usr_nm`.

Lo que sí es útil de `@Column` son sus otros atributos:

```java
@Column(nullable = false)                 // NOT NULL
@Column(unique = true)                    // UNIQUE
@Column(length = 100)                     // VARCHAR(100)
@Column(updatable = false)                // no se puede modificar tras insertar
@Column(columnDefinition = "TEXT")        // tipo SQL literal
```

### Clase model user con relaciones

```java
@Data
@NoArgsConstructor
@SQLRestriction("deleted = false")   // solo consulta registros no eliminados
@SQLDelete(sql = "UPDATE users SET deleted = true WHERE id = ?")
@Entity(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_name", nullable = false, updatable = false)
    private String userName;

    private String name;
    private String lastName;
    private String password;
    private Integer age;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean deleted = false;

    // Relación uno a muchos con User (auto-referencia)
    @OneToMany(mappedBy = "userOwn")
    @JsonIgnore
    private List<User> userList;

    // Relación muchos a uno con User (auto-referencia)
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    @JsonIgnore
    private User userOwn;

    // Relación con RoleUser (muchos usuarios tienen un rol)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_user_id", nullable = true)
    @JsonIgnore
    private RoleUser roleUser;

    // ... otras relaciones con eventos, rutinas, etc.
}
```

---

# 7. Lombok: los getters y setters que no escribes

En Java tradicional escribirías esto para cada atributo:

```java
public class User {
    private String name;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
```

Con 10 atributos eso son 200 líneas de código repetitivo. **Lombok** las genera por ti en tiempo de compilación.

| Anotación | Qué genera |
| --- | --- |
| `@Getter` | Un `getX()` por cada atributo. |
| `@Setter` | Un `setX(...)` por cada atributo. |
| `@ToString` | El método `toString()`. |
| `@EqualsAndHashCode` | `equals()` y `hashCode()`. |
| `@NoArgsConstructor` | Constructor vacío: `new User()`. |
| `@AllArgsConstructor` | Constructor con todos los atributos. |
| **`@Data`** | Todo lo anterior junto (excepto los constructores). |

Por eso escribes solo:

```java
@Data
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
}
```

…y en tu servicio puedes hacer `user.getName()` y `user.setName("Ana")` aunque nunca los escribiste.

### ⚠️ Dos cosas críticas sobre Lombok en entidades JPA

**1. `@NoArgsConstructor` es obligatorio.**
Hibernate crea las instancias por reflexión y necesita un constructor sin argumentos. Si pones `@AllArgsConstructor` sin `@NoArgsConstructor`, la app falla al arrancar.

**2. `@Data` genera `toString()` y `equals()` que recorren *todos* los atributos — incluidas las relaciones.**
Si `User` tiene una lista de `Event`, y cada `Event` tiene un `User`, entonces `user.toString()` llama a `event.toString()`, que llama a `user.toString()`… → `StackOverflowError`.

La solución es marcar las relaciones con:

```java
@ToString.Exclude
@OneToMany(mappedBy = "author")
private List<Event> events;
```

Por eso en tus ejemplos aparece en casi todas las listas. **Regla práctica: toda relación lleva.**

---

# 8. Relaciones entre entidades (llaves foráneas)

Aquí está el corazón de JPA. Una relación en la base de datos es una **llave foránea** (una columna que apunta al ID de otra tabla). En JPA, en vez de manejar el ID, manejas **el objeto completo**.

```java
// En SQL pensarías así:
private Integer roleId;      // ← guardas el número

// En JPA piensas así:
@ManyToOne
@JoinColumn(name = "role_id")
private Role role;           // ← guardas el objeto; JPA guarda el número por ti
```

Así puedes hacer `user.getRole().getName()` sin escribir un solo `JOIN`.

### clases de ejmplo:

```java
package com.example.proyectoEjercicio.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
// RoleUser es la clase Role, no confundir con clase intermedia
@Entity(name = "role_users")
public class RoleUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String role;

    // relaciones de role (un role tiene muchos)

    
    @OneToMany(mappedBy = "roleUser")
    @JsonIgnore
    private List<User> usersList;

   
    @OneToMany(mappedBy = "rolePermissionId", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnore 
    private List<PermissionRole>permissionList;
    
}

```

```java
package com.example.proyectoEjercicio.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@Entity(name = "permissions")
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String permission;

    //devido a los metodos de eliminacion agregamos cascade 
   
    @OneToMany(mappedBy = "permissionOfRole", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore 
    private List<PermissionRole>permissionOfRoleList;
    
}

```

```java
package com.example.proyectoEjercicio.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data 
@NoArgsConstructor
@Entity(name = "role_permissions") 
public class PermissionRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

   
    @ManyToOne
    @JoinColumn(name = "role", nullable = true)
    @JsonIgnore
    private RoleUser rolePermissionId;

   
    @ManyToOne
    @JoinColumn(name = "permission_role", nullable = true)
    @JsonIgnore
    private Permission permissionOfRole;
    
}

```

---

## **`@ManyToOne` (Muchos a Uno)**

Ejemplo: muchos usuarios tienen un rol.

java

```
@ManyToOne(fetch = FetchType.EAGER)
@JoinColumn(name = "role_user_id", nullable = true)
private RoleUser roleUser;
```

- **`@JoinColumn`** define la columna clave foránea en la tabla `users`.
- **`fetch = FetchType.EAGER`** carga el rol automáticamente al consultar el usuario (opcional, por defecto es `LAZY`).

## **`@OneToMany` (Uno a Muchos)**

Ejemplo: un rol tiene muchos usuarios.

java

```
// En la clase RoleUser
@OneToMany(mappedBy = "roleUser")
private List<User> usersList;
```

- **`mappedBy`** indica que la relación está mapeada por el campo `roleUser` en la entidad `User`. Es decir, la clave foránea está en la tabla `users`.

## **`@ManyToMany` (Muchos a Muchos) con clase intermedia**

Cuando una relación muchos a muchos tiene atributos adicionales, se necesita una clase intermedia.

**Ejemplo:** `RoleUser` y `Permission` se relacionan mediante `PermissionRole` (clase intermedia).

#### **Clase intermedia: `PermissionRole`**

java

```
@Entity(name = "role_permissions")
public class PermissionRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "role")
    private RoleUser rolePermissionId;

    @ManyToOne
    @JoinColumn(name = "permission_role")
    private Permission permissionOfRole;
}
```

**Explicación:**

- La clase intermedia tiene dos relaciones `@ManyToOne`: una hacia `RoleUser` y otra hacia `Permission`.
- Esto permite asignar permisos a roles y también almacenar información adicional (fecha de asignación, etc.) si se necesita.

#### **En `RoleUser`:**

java

```
@OneToMany(mappedBy = "rolePermissionId", cascade = CascadeType.ALL, orphanRemoval = true)
private List<PermissionRole> permissionList;
```

- **`cascade = CascadeType.ALL`**: cualquier operación (persistir, eliminar, etc.) sobre el rol se propaga a los `PermissionRole` asociados.
- **`orphanRemoval = true`**: si se elimina un `PermissionRole` de la lista, se borra de la base de datos.

#### **En `Permission`:**

java

```
@OneToMany(mappedBy = "permissionOfRole", cascade = CascadeType.ALL, orphanRemoval = true)
private List<PermissionRole> permissionOfRoleList;
```

**Ventaja de la clase intermedia:** permite manejar la relación de forma bidireccional y con atributos extra. Es la forma más flexible para relaciones `@ManyToMany`.

### **Relación con Eventos**

**`Event`** tiene relaciones con:

- `AuthorEvent` (User): usuario que crea el evento.
- `managerEvent` (User): encargado del evento.
- `eventSpace` (AvaibleSpace): espacio donde se realiza.
- `eventAttendees` (EventAttendee): asistentes al evento (clase intermedia).

java

```
@ManyToOne
@JoinColumn(name = "id_author_event")
private User AuthorEvent;

@ManyToOne
@JoinColumn(name = "id_in_charge")
private User managerEvent;

@ManyToOne
@JoinColumn(name = "id_available_space")
private AvaibleSpace eventSpace;

@OneToMany(mappedBy = "idEvent")
private List<EventAttendee> eventAttendees;
```

**`EventAttendee`** (clase intermedia entre `Event` y `User`):

java

```
@Entity(name = "event_attendees")
public class EventAttendee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_user_attendee")
    private User EventsAttendeeUser;

    @ManyToOne
    @JoinColumn(name = "id_event")
    private Event idEvent;
}
```

Esto permite que un usuario pueda asistir a varios eventos y un evento tenga varios usuarios.

### Resumen del par bidireccional

|  | Lado `@ManyToOne` | Lado `@OneToMany` |
| --- | --- | --- |
| ¿Tiene columna FK? | ✅ Sí | ❌ No |
| ¿Es el dueño? | ✅ Sí | ❌ No (es el inverso) |
| Anotación de enlace | `@JoinColumn(name="...")` | `mappedBy = "atributo"` |
| Tipo del atributo | Un objeto: `Role role` | Una lista: `List<User> users` |
| ¿Es obligatorio? | Sí, si quieres la FK | No, solo si necesitas navegar |

> **No siempre necesitas el lado `@OneToMany`.** Si nunca vas a pedir “dame todos los usuarios de este rol” desde el objeto `Role`, puedes omitir la lista y hacer la consulta en el repositorio: `userRepository.findByRoleId(1)`. Menos relaciones bidireccionales = menos problemas de serialización.
> 

## 8.1 `@OneToOne` — “uno a uno”

**Escenario:** un usuario tiene un único perfil.

```java
// Lado dueño
@Entity
public class User {
    @OneToOne
    @JoinColumn(name = "profile_id")
    private Profile profile;
}

// Lado inverso
@Entity
public class Profile {
    @OneToOne(mappedBy = "profile")
    private User user;
}
```

## 8.2 `@ManyToMany` — “muchos a muchos”

**Escenario:** un rol tiene muchos permisos, y un permiso puede estar en muchos roles.

En SQL esto **no se puede representar con una sola columna**: se necesita una tercera tabla (tabla puente).

```java
package com.example.proyectoEjercicio.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
// RoleUser es la clase Role, no confundir con clase intermedia
@Entity(name = "role_users")
public class RoleUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String role;

    // relaciones de role (un role tiene muchos)

    
    @OneToMany(mappedBy = "roleUser")
    @JsonIgnore
    private List<User> usersList;

   
    @OneToMany(mappedBy = "rolePermissionId", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnore 
    private List<PermissionRole>permissionList;
    
}

```

```java
package com.example.proyectoEjercicio.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@Entity(name = "permissions")
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String permission;

    //devido a los metodos de eliminacion agregamos cascade 
   
    @OneToMany(mappedBy = "permissionOfRole", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore 
    private List<PermissionRole>permissionOfRoleList;
    
}

```

```java
package com.example.proyectoEjercicio.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data 
@NoArgsConstructor
@Entity(name = "role_permissions") 
public class PermissionRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

   
    @ManyToOne
    @JoinColumn(name = "role", nullable = true)
    @JsonIgnore
    private RoleUser rolePermissionId;

   
    @ManyToOne
    @JoinColumn(name = "permission_role", nullable = true)
    @JsonIgnore
    private Permission permissionOfRole;
    
}

```

---

# 9. Clases intermedias: cuándo y por qué

### Cómo se construye una clase intermedia

Una clase intermedia es **una entidad normal** con su propio `@Id`, sus atributos propios y **dos `@ManyToOne`** (uno hacia cada lado de las entidades de los extremos).

```java
@Data
@NoArgsConstructor
@Entity
@Table(name = "event_attendees")
public class EventAttendee {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // ── Datos propios de la relación ──
    private Timestamp registrationDate;
    private Boolean attended;
    private String ticketCode;

    // ── Los dos extremos ──
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
   
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    @JsonIgnore
   
    private Event event;
}
```

Y el `@ManyToMany` se convierte en dos `@OneToMany` , uno en cada clase del extermo:

```
        ANTES                              DESPUÉS
   User ←──ManyToMany──→ Event    User ←OneToMany─ EventAttendee ─ManyToOne→ Event
```

```java
// En User
@OneToMany(mappedBy = "user")
@JsonIgnore
private List<EventAttendee> eventAttendees = new ArrayList<>();

// En Event
@OneToMany(mappedBy = "event")
@JsonIgnore
private List<EventAttendee> eventAttendees = new ArrayList<>();
```

> ✅ **Regla práctica:** en proyectos reales casi siempre se usa clase intermedia en lugar de `@ManyToMany`, incluso si al principio no tiene datos extra. Es mucho más fácil agregarle una columna después que migrar un `@ManyToMany` a una entidad.
> 

### Doble relación hacia la misma entidad

 `Event` apunta **dos veces** a `User`: el autor y el encargado.

```java
package com.example.proyectoEjercicio.model;

import java.sql.Timestamp;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;

    @ManyToOne
    @JoinColumn(name = "id_author_event", nullable = true)
    @JsonIgnore
    private User AuthorEvent;

    @ManyToOne
    @JoinColumn(name = "id_in_charge", nullable = true)
    @JsonIgnore
    private User managerEvent;

    @Column(name = "start_date")
    private Timestamp startDate;

    @Column(name = "end_date")
    private Timestamp endDate;

    @ManyToOne
    @JoinColumn(name = "id_available_space", nullable = true)
    @JsonIgnore
    private AvaibleSpace eventSpace;

    @OneToMany(mappedBy = "idEvent")
    @JsonIgnore
    private List<EventAttendee> eventAttendees;

}

```

```java
@ManyToOne
@JoinColumn(name = "author_id")
private User author;      // quien creó el evento

@ManyToOne
@JoinColumn(name = "manager_id")
private User manager;     // quien lo administra
```

Cuando esto pasa, del lado de `User` **debes** distinguirlas con `mappedBy`:

```java
@OneToMany(mappedBy = "author")     // ← eventos que creó
private List<Event> createdEvents;

@OneToMany(mappedBy = "manager")    // ← eventos que administra
private List<Event> managedEvents;
```

Si pusieras `mappedBy = "user"` en las dos, Hibernate no sabría cuál es cuál.

### Relación recursiva (una entidad hacia sí misma)

```java
@ManyToOne
@JoinColumn(name = "supervisor_id")
@JsonIgnore
private User supervisor;              // mi jefe

@OneToMany(mappedBy = "supervisor")
@JsonIgnore
private List<User> subordinates;      // mis subordinados
```

Aquí `@JsonIgnore` es **obligatorio**, o la serialización a JSON entra en bucle infinito.

---

# 10. `@JsonIgnore` y el problema de la recursión infinita

## El problema

Cuando un `@RestController` devuelve un objeto, **Jackson** (la librería de JSON de Spring) recorre todos sus getters y los convierte a JSON.

Con una relación bidireccional:

```java
User  ──tiene──→ List<Event>
Event ──tiene──→ User
```

Jackson hace:

```json
{
  "id": 1, "userName": "ana",
  "events": [
    { "id": 5, "title": "Concierto",
      "author": {
        "id": 1, "userName": "ana",
        "events": [
          { "id": 5, "title": "Concierto",
            "author": { ... ∞ ...
```

Resultado: `StackOverflowError` o un JSON de varios megabytes.

## La solución: `@JsonIgnore`

`@JsonIgnore` le dice a Jackson: *“al convertir a JSON, salta este atributo”*.

```java
@OneToMany(mappedBy = "author")
@JsonIgnore                       // ← se corta el ciclo
private List<Event> createdEvents;
```

> ⚠️ **`@JsonIgnore` NO afecta la base de datos.** La relación sigue existiendo, la FK sigue ahí, y `user.getCreatedEvents()` sigue funcionando en tu código Java. Solo desaparece del JSON de respuesta.
> 

### ¿En cuál de los dos lados lo pongo?

Regla: **en el lado que no quieres ver en la respuesta**, que casi siempre es el `@OneToMany` (la lista).

```java
// Event → quiero ver quién es el autor
@ManyToOne
private User author;              // SIN @JsonIgnore

// User → NO quiero arrastrar todos sus eventos
@OneToMany(mappedBy = "author")
@JsonIgnore                       // CON @JsonIgnore
private List<Event> createdEvents;
```

Así `GET /events/5` devuelve:

```json
{ "id": 5, "title": "Concierto", "author": { "id": 1, "userName": "ana" } }
```

…y no explota, porque el `author` ya no arrastra su lista de eventos.

### Alternativas más finas

| Anotación | Qué hace |
| --- | --- |
| `@JsonIgnore` | Nunca aparece en el JSON. |
| `@JsonIgnoreProperties({"password"})` | Ignora atributos específicos de la entidad relacionada. |
| `@JsonManagedReference` / `@JsonBackReference` | El “padre” se serializa, el “hijo” corta el ciclo. Más elegante pero menos flexible. |
| **DTOs** | La solución profesional: nunca devuelves entidades, devuelves clases hechas a la medida de cada endpoint. |

> 🎯 **Lo correcto a largo plazo son los DTOs**, pero para aprender y para proyectos pequeños, `@JsonIgnore` + resuelven el 90% de los problemas.
> 

### El trío que siempre va junto en una relación

```java
@JsonIgnore          // no lo serialices → evita recursión en JSON
@ToString.Exclude    // no lo imprimas  → evita recursión en toString()
@OneToMany(mappedBy = "author", fetch = FetchType.LAZY)
private List<Event> createdEvents = new ArrayList<>();
```

---

# 11. Cascade, orphanRemoval y borrado suave

## 11.1 `cascade`: propagar operaciones

`cascade` responde: *“cuando hago algo con el padre, ¿qué pasa con los hijos?”*

```java
@OneToMany(mappedBy = "role", cascade = CascadeType.ALL, orphanRemoval = true)
private List<PermissionRole> permissions;
```

| Tipo | Qué propaga |
| --- | --- |
| `PERSIST` | Al guardar el padre, guarda también los hijos nuevos. |
| `MERGE` | Al actualizar el padre, actualiza los hijos. |
| `REMOVE` | **Al borrar el padre, borra los hijos.** |
| `REFRESH` | Al recargar el padre desde la BD, recarga los hijos. |
| `DETACH` | Al desconectar el padre de la sesión, desconecta los hijos. |
| `ALL` | Todas las anteriores. |

### El caso típico: por qué lo necesitas

Sin `cascade`, si intentas borrar un `Permission` que está referenciado en la tabla `permission_role`, MySQL lanza:

```
Cannot delete or update a parent row: a foreign key constraint fails
```

Con `cascade = CascadeType.ALL` en la lista de registros intermedios, al borrar el permiso se borran primero sus filas en la tabla puente, y luego el permiso. Por eso en tu ejemplo aparece:

```java
@OneToMany(mappedBy = "permissionOfRole", cascade = CascadeType.ALL, orphanRemoval = true)
private List<PermissionRole> permissionOfRoleList;
```

### ⚠️ Cuándo NO usar `cascade = ALL`

`CascadeType.REMOVE` es peligroso cuando el “hijo” tiene vida propia.

```java
// ❌ MAL: borrar un rol borraría a todos los usuarios que lo tienen
@OneToMany(mappedBy = "role", cascade = CascadeType.ALL)
private List<User> users;

// ✅ BIEN: solo propaga guardado/actualización
@OneToMany(mappedBy = "role", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
private List<User> users;
```

**Regla práctica:**

- **Registros intermedios / detalles que no existen sin el padre** (`PermissionRole`, `EventAttendee`, `EventSchedule`) → `cascade = ALL, orphanRemoval = true`.
- **Entidades independientes** (`User`, `Event`, `Role`) → sin cascade de borrado.

## 11.2 `orphanRemoval`

Borra al hijo cuando lo **sacas de la lista del padre**, aunque no borres el padre.

```java
role.getPermissions().remove(0);
roleRepository.save(role);
// Con orphanRemoval = true → la fila se borra de la BD
// Sin orphanRemoval      → la fila queda huérfana con FK en NULL
```

Diferencia con `CascadeType.REMOVE`:

|  | Se activa cuando… |
| --- | --- |
| `CascadeType.REMOVE` | Borras el **padre completo**. |
| `orphanRemoval = true` | Quitas un **hijo de la colección**. |

## 11.3 Borrado suave (soft delete)

A veces no quieres borrar de verdad: quieres marcar el registro como eliminado y que deje de aparecer en las consultas. Eso es un **soft delete**.

```java
@Data
@NoArgsConstructor
@Entity
@Table(name = "users")
@SQLDelete(sql = "UPDATE users SET deleted = true WHERE id = ?")  // reemplaza el DELETE
@SQLRestriction("deleted = false")                                 // filtro global
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean deleted = false;
}
```

- `@SQLDelete` → cuando llamas `userRepository.delete(user)`, Hibernate ejecuta el `UPDATE` en lugar del `DELETE`.
- `@SQLRestriction("deleted = false")` → añade `AND deleted = false` a **todas** las consultas de esa entidad automáticamente. (En Hibernate 5 se llamaba `@Where`.)

Ventaja: nunca pierdes datos ni rompes llaves foráneas. Desventaja: hay que recordar que la tabla tiene filas “invisibles”.

---

# 12. Ejemplo completo: app de Eventos

Modelo del dominio:

- Un **usuario** tiene un **rol**.
- Un **rol** tiene muchos **permisos** (y un permiso puede estar en muchos roles) → tabla intermedia `RolePermission`.
- Un **evento** tiene un autor (quien lo creó) y un encargado (quien lo administra), ambos usuarios.
- Un **evento** ocurre en una **zona**.
- Un **evento** tiene varios **horarios**.
- Los usuarios **asisten** a eventos → tabla intermedia `EventAttendee`.

```
Permission ─┐
            ├─ RolePermission ─ Role ─< User ─┬─< Event ─┬─< EventSchedule
Permission ─┘                                 │          ├─> Zone
                                              └─< EventAttendee >─┘
```

## 12.1 `Permission`

```java
package com.example.eventos.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Entity(name = "permissions")
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;      // ej: "CREATE_EVENT", "DELETE_USER"

    // Un permiso puede estar asignado a muchos roles (vía tabla intermedia).
   //cascade ALL + orphanRemoval: si borro el permiso, se borran sus asignaciones.
    @OneToMany(mappedBy = "permission", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<RolePermission> rolePermissions = new ArrayList<>();
}
```

## 12.2 `Role`

```java
@Data
@NoArgsConstructor
@Entity(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;          // ej: "ADMIN", "ORGANIZER", "ATTENDEE"

    // Un rol tiene muchos permisos (a través de la intermedia)
    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<RolePermission> rolePermissions = new ArrayList<>();

    // Un rol lo tienen muchos usuarios.
    // OJO: SIN cascade de borrado — borrar un rol NO debe borrar usuarios.
    @OneToMany(mappedBy = "role")
    @JsonIgnore
    private List<User> users = new ArrayList<>();
}
```

## 12.3 `RolePermission` (clase intermedia)

```java
@Data
@NoArgsConstructor
@Entity(name = "role_permissions")
public class RolePermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Dato propio de la relación: cuándo se otorgó el permiso
    private Timestamp grantedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
   
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "permission_id", nullable = false)
   
    private Permission permission;
}
```

Fíjate: aquí **no** pongo `@JsonIgnore` en los `@ManyToOne`, porque al pedir un `RolePermission` sí quiero ver qué rol y qué permiso son. El ciclo ya está cortado del otro lado (en las listas de `Role` y `Permission`).

## 12.4 `User`

```java
@Data
@NoArgsConstructor
@Entity(name = "users")
@SQLDelete(sql = "UPDATE users SET deleted = true WHERE id = ?")
@SQLRestriction("deleted = false")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_name", nullable = false, unique = true, updatable = false)
    private String userName;

    private String name;

    @Column(name = "last_name")
    private String lastName;

    @JsonIgnore         // nunca devolver la contraseña en el JSON
    private String password;

    private Integer age;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean deleted = false;

    // ── Un usuario tiene UN rol ──
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;

    // ── Eventos que este usuario CREÓ ──
    @OneToMany(mappedBy = "author")
    @JsonIgnore
    private List<Event> createdEvents = new ArrayList<>();

    // ── Eventos que este usuario ADMINISTRA ──
    @OneToMany(mappedBy = "manager")
    @JsonIgnore
    private List<Event> managedEvents = new ArrayList<>();

    // ── Eventos a los que ASISTE (vía intermedia) ──
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<EventAttendee> eventAttendees = new ArrayList<>();
}
```

**Puntos clave de esta clase:**

1. `createdEvents` y `managedEvents` apuntan a la **misma entidad** `Event`, pero con `mappedBy` distinto. Eso es lo que las diferencia.
2. `role` usa `FetchType.EAGER` porque casi siempre que cargas un usuario quieres saber su rol (para permisos). Las listas usan LAZY por defecto.
3. `eventAttendees` sí lleva `cascade = ALL`: si se borra el usuario, sus inscripciones no tienen sentido.
4. `createdEvents` **no** lleva cascade de borrado: borrar al autor no debe borrar el evento.
5. `password` lleva `@JsonIgnore` — no por recursión, sino por seguridad.

## 12.5 `Zone` (zona del evento)

```java
@Data
@NoArgsConstructor
@Entity(name = "zones")
public class Zone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;          // "Auditorio A", "Salón principal"

    private Integer capacity;

    private String location;

    @OneToMany(mappedBy = "zone")
    @JsonIgnore
    private List<Event> events = new ArrayList<>();
}
```

## 12.6 `Event`

```java
@Data
@NoArgsConstructor
@Entity(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(name = "start_date")
    private Timestamp startDate;

    @Column(name = "end_date")
    private Timestamp endDate;

    // ── Quién lo creó ──
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;

    // ── Quién lo administra (encargado) ──
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private User manager;

    // ── En qué zona ocurre ──
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zone_id")
    private Zone zone;

    // ── Horarios del evento ──
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<EventSchedule> schedules = new ArrayList<>();

    // ── Asistentes ──
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<EventAttendee> attendees = new ArrayList<>();
}
```

Tabla generada:

```sql
CREATE TABLE events (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    start_date  DATETIME,
    end_date    DATETIME,
    author_id   INT,   -- FK → users(id)
    manager_id  INT,   -- FK → users(id)
    zone_id     INT    -- FK → zones(id)
);
```

Las tres llaves foráneas salieron de los tres `@ManyToOne`. Las listas (`schedules`, `attendees`) **no generaron ninguna columna aquí**: sus FKs están en las tablas hijas.

## 12.7 `EventSchedule` (horario)

```java
@Data
@NoArgsConstructor
@Entity(name = "event_schedules")
public class EventSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "start_time")
    private Timestamp startTime;

    @Column(name = "end_time")
    private Timestamp endTime;

    private String activity;  // "Registro", "Charla principal", "Coffee break"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    @JsonIgnore
    private Event event;
}
```

Un horario **no existe sin su evento** → por eso `nullable = false` y por eso el evento lo tiene con `cascade = ALL, orphanRemoval = true`.

## 12.8 `EventAttendee` (clase intermedia User ↔︎ Event)

```java
@Data
@NoArgsConstructor
@Entity(name = "event_attendees")
public class EventAttendee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // ── Datos propios de la inscripción ──
    @Column(name = "registration_date")
    private Timestamp registrationDate;

    private Boolean attended = false;

    @Column(name = "ticket_code", unique = true)
    private String ticketCode;

    // ── Los dos extremos ──
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
}
```

Esto es exactamente lo que **no** podrías hacer con un `@ManyToMany` simple: guardar `ticketCode` y `attended` en la relación.

---

## ✅ Resumen de la Parte 1

| Concepto | Regla mental |
| --- | --- |
| `@Entity` | Clase = tabla. |
| `@ManyToOne` | Lado dueño. Aquí está la columna FK. |
| `@OneToMany(mappedBy)` | Lado inverso. No crea columna. `mappedBy` = nombre del atributo del otro lado. |
| `@ManyToMany` | Solo si la relación no tiene datos propios. |
| Clase intermedia | Dos `@ManyToOne` + `@Id` propio + datos de la relación. |
| `@JsonIgnore` | Corta la recursión al serializar. No afecta la BD. |
| `@ToString.Exclude` | Corta la recursión en `toString()` de Lombok. |
| `cascade = ALL` | Solo para hijos que no existen sin el padre. |
| `orphanRemoval` | Borra al sacar de la lista. |
| `@SQLDelete` + `@SQLRestriction` | Borrado suave. |

# Parte 2 — Repository y consultas con Spring Data JPA

### **Repositorios necesarios para el ejemplo**

| **Entidad** | **Repositorio** |
| --- | --- |
| `Airline` | `AirlineRepository` |
| `Airplane` | `AirplaneRepository` |
| `Airport` | `AirportRepository` |
| `Flight` | `FlightRepository` |
| `Ticket` | `TicketRepository` |
| `TicketFlight` | `TicketFlightRepository` |

Cada uno extiende `JpaRepository<Entidad, Long>`.

---

## 1. Modelos de ejemplo

## 1.1 `Airline`

```java
package com.example.airline.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Entity(name = "airlines")
public class Airline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String country;

    @Column(name = "iata_code", unique = true)
    private String iataCode;      // ej: "AV", "LA"

    @OneToMany(mappedBy = "airline")
    @JsonIgnore
   
    private List<Airplane> airplanes = new ArrayList<>();
}
```

## 1.2 `Airplane`

```java
@Data
@NoArgsConstructor
@Entity(name = "airplanes")
public class Airplane {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String model;                    // "Airbus A320"

    @Column(name = "registration_number", unique = true)
    private String registrationNumber;       // "HK-4567"

    @Column(name = "seat_capacity")
    private Integer seatCapacity;

    // Un avión pertenece a UNA aerolínea
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "airline_id")
   
    private Airline airline;

    // Un avión hace MUCHOS vuelos
    @OneToMany(mappedBy = "airplane")
    @JsonIgnore
   
    private List<Flight> flights = new ArrayList<>();
}
```

## 1.3 `Airport`

```java
@Data
@NoArgsConstructor
@Entity(name = "airports")
public class Airport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;        // "El Dorado"
    private String city;        // "Bogotá"
    private String country;     // "Colombia"

    @Column(name = "iata_code", unique = true)
    private String iataCode;    // "BOG"

    // Vuelos que SALEN de este aeropuerto
    @OneToMany(mappedBy = "originAirport")
    @JsonIgnore
   
    private List<Flight> departingFlights = new ArrayList<>();

    // Vuelos que LLEGAN a este aeropuerto
    @OneToMany(mappedBy = "destinationAirport")
    @JsonIgnore
   
    private List<Flight> arrivingFlights = new ArrayList<>();
}
```

> 📌 Aquí se repite el patrón de la doble relación que vimos en `Event` (autor/encargado): `Airport` aparece **dos veces** en `Flight`, así que se distinguen por `mappedBy`.
> 
> 
> Nota también que **no** hay cascade: borrar un aeropuerto no debe borrar vuelos.
> 

## 1.4 `Flight`

```java
@Data
@NoArgsConstructor
@Entity(name = "flights")
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "flight_number")
    private String flightNumber;             // "AV8020"

    @Column(name = "departure_date")
    private Timestamp departureDate;

    @Column(name = "arrival_date")
    private Timestamp arrivalDate;

    // ── UN avión hace este vuelo ──
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "airplane_id")
   
    private Airplane airplane;

    // ── Aeropuerto de ORIGEN ──
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "origin_airport_id", nullable = false)
   
    private Airport originAirport;

    // ── Aeropuerto de DESTINO ──
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_airport_id", nullable = false)
   
    private Airport destinationAirport;

    // ── Tramos de tiquete que usan este vuelo ──
    @OneToMany(mappedBy = "flight", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
   
    private List<TicketFlight> ticketFlights = new ArrayList<>();
}
```

## 1.5 `Ticket`

```java
@Data
@NoArgsConstructor
@Entity(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "passenger_full_name")
    private String passengerFullName;

    @Column(name = "booking_code", unique = true)
    private String bookingCode;              // "XK9P2L"

    @Column(name = "purchase_date")
    private Timestamp purchaseDate;

    // Un tiquete puede tener VARIOS tramos (escalas)
    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
   
    private List<TicketFlight> ticketFlights = new ArrayList<>();
}
```

Fíjate que **`Ticket` ya no tiene `originAirport` ni `destinationAirport`**. No los necesita: el origen del viaje es el origen del primer tramo, y el destino es el destino del último tramo. Eso se calcula, no se duplica.

## 1.6 `TicketFlight` (clase intermedia Ticket ↔︎ Flight)

```java
@Data
@NoArgsConstructor
@Entity(name = "ticket_flights")
public class TicketFlight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Dato propio de la relación: es la escala 1, la 2, la 3...
    @Column(name = "segment_order")
    private Integer segmentOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
   
    private Ticket ticket;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id", nullable = false)
   
    private Flight flight;
}
```

---

# 2. ¿Qué es un Repository?

### **¿Qué es un Repository?**

Es una **interfaz** que extiende `JpaRepository<T, ID>`. Spring Data JPA proporciona automáticamente implementaciones de métodos CRUD comunes (`save`, `findById`, `findAll`, `deleteById`, etc.). También permite definir **métodos de consulta personalizados** basados en nombres de métodos (query derivation) o con anotación `@Query`.

### **Estructura de un Repository**

java

```java
package com.example.airline.repository;

import com.example.airline.model.Airline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AirlineRepository extends JpaRepository<Airline, Long> {

    // Método derivado: busca aerolínea por código IATA
    Optional<Airline> findByIataCode(String iataCode);

    // Método derivado: búsqueda por país
    List<Airline> findByCountry(String country);

    // Método con JPQL personalizado (NO SE SUELE UTILIZAR EN PARCIALES)
    @Query("SELECT a FROM airlines a WHERE a.name LIKE %:name%")
    List<Airline> searchByName(@Param("name") String name);
}
```

**Explicación:**

- `@Repository` es opcional pero recomendado (Spring lo detecta automáticamente al extender `JpaRepository`).
- Los métodos **derivados** se crean siguiendo la convención de nombres: `findBy[Propiedad][Operador]`. Ej: `findByIataCode`, `findByCountry`, `findByNameContaining`, etc.
- `@Query` permite escribir JPQL o SQL nativo para consultas complejas.

### Los dos parámetros genéricos

```java
JpaRepository<Flight, Long>
                 │      └── tipo del @Id de esa entidad
                 └── la entidad que maneja
```

Tienen que coincidir con la entidad. Si `Flight` tiene `private Long id`, va `Long`. Si tuviera `private Integer id`, iría `Integer`.

### Un repositorio por entidad

```
repository/
├── AirlineRepository.java      → JpaRepository<Airline, Long>
├── AirplaneRepository.java     → JpaRepository<Airplane, Long>
├── AirportRepository.java      → JpaRepository<Airport, Long>
├── FlightRepository.java       → JpaRepository<Flight, Long>
├── TicketRepository.java       → JpaRepository<Ticket, Long>
└── TicketFlightRepository.java → JpaRepository<TicketFlight, Long>
```

> 💡 `@Repository` es opcional cuando extiendes de `JpaRepository` (Spring ya lo detecta), pero se pone por claridad.
> 

---

# 3. Los métodos que vienen definifos por default

Sin escribir una sola línea, `JpaRepository` ya te da:

```java
// ── Lectura ──
List<Flight>     findAll();
List<Flight>     findAllById(Iterable<Long> ids);
Optional<Flight> findById(Long id);
long             count();
boolean          existsById(Long id);

// ── Escritura ──
Flight       save(Flight flight);            // INSERT si id es null, UPDATE si no
List<Flight> saveAll(Iterable<Flight> f);

// ── Borrado ──
void deleteById(Long id);
void delete(Flight flight);
void deleteAll();

// ── Ordenamiento y paginación ──
List<Flight> findAll(Sort sort);
Page<Flight> findAll(Pageable pageable);
```

## 3.1 Cómo funciona `findById` por dentro

```java
Optional<Flight> resultado = flightRepository.findById(5L);
```

Paso a paso:

1. Spring recibe la llamada y sabe que la entidad es `Flight`, cuya tabla es `flights` y cuyo `@Id` es la columna `id`.
2. Genera y ejecuta:
    
    ```sql
    SELECT f.id, f.flight_number, f.departure_date, f.arrival_date,
           f.airplane_id, f.origin_airport_id, f.destination_airport_id
    FROM flights f
    WHERE f.id = 5;
    ```
    
3. Toma la fila y **la convierte en un objeto `Flight`** (esto se llama *mapeo objeto-relacional*, ORM).
4. Envuelve el resultado en un `Optional`.

## 3.2 ¿Por qué `Optional`?

Porque el vuelo **puede no existir**. `Optional<Flight>` es una caja que puede estar llena o vacía, y te obliga a decidir qué hacer si está vacía. Así se evita el `NullPointerException`.

```java
// ❌ Esto NO compila: Optional<Flight> no es Flight
Flight vuelo = flightRepository.findById(5L);

// ✅ Opción 1: lanzar excepción si no existe (lo más común)
Flight vuelo = flightRepository.findById(5L)
        .orElseThrow(() -> new RuntimeException("Vuelo no encontrado con id: " + 5));

// ✅ Opción 2: devolver un valor por defecto
Flight vuelo = flightRepository.findById(5L).orElse(null);

// ✅ Opción 3: preguntar primero
Optional<Flight> opt = flightRepository.findById(5L);
if (opt.isPresent()) {
    Flight vuelo = opt.get();
}

// ✅ Opción 4: ejecutar algo solo si existe
flightRepository.findById(5L).ifPresent(v -> System.out.println(v.getFlightNumber()));
```

## 3.3 `save()` sirve para insertar Y para actualizar

```java
// INSERT: el id es null
Flight nuevo = new Flight();
nuevo.setFlightNumber("AV8020");
flightRepository.save(nuevo);         // → INSERT INTO flights ...

// UPDATE: el id ya existe
Flight existente = flightRepository.findById(5L).orElseThrow();
existente.setFlightNumber("AV8021");
flightRepository.save(existente);     // → UPDATE flights SET ... WHERE id = 5
```

Spring decide entre INSERT y UPDATE mirando si el `@Id` es `null`.

---

# 4. Anatomía de un método derivado

Spring Data JPA **lee el nombre del método**, lo parte en pedazos y construye la consulta SQL. Por eso el nombre importa tanto.

```
List<Flight> findByOriginAirportCountryOrderByDepartureDateAsc(String country);
└──┬──────┘  └─┬─┘└────────┬───────────┘└──────────┬────────┘ └──────┬─────┘
   │           │           │                       │                 │
   │           │           │                       │            parámetro que
   │           │           │                       │            reemplaza el ?1
   │           │           │                       │
tipo de     verbo      propiedad(es)          ordenamiento
retorno    (findBy)    a filtrar
```

### 1️⃣ El verbo (prefijo)

| Prefijo | Devuelve | Ejemplo |
| --- | --- | --- |
| `findBy` / `getBy` / `readBy` | La(s) entidad(es) | `findByFlightNumber` |
| `countBy` | `long` | `countByOriginAirportCountry` |
| `existsBy` | `boolean` | `existsByFlightNumber` |
| `deleteBy` / `removeBy` | `void` o `long` | `deleteByFlightNumber` |

### 2️⃣ El tipo de retorno

| Escribes | Cuándo usarlo |
| --- | --- |
| `Optional<Flight>` | Esperas **0 o 1** resultado (buscar por algo único). |
| `Flight` | Igual, pero devuelve `null` si no hay. Menos seguro. |
| `List<Flight>` | Esperas **varios** (o ninguno → lista vacía, nunca null). |
| `long` / `boolean` | Con `countBy` / `existsBy`. |

> ⚠️ Si declaras `Optional<Flight>` pero la consulta devuelve 3 filas, Spring lanza
`IncorrectResultSizeDataAccessException`. Usa `Optional` **solo** con campos `unique`.
> 

### 3️⃣ El cuerpo: propiedades y palabras clave

Aquí es donde Spring busca **nombres de atributos de tu entidad**, en `PascalCase`.

```java
// La entidad tiene: private String flightNumber;
findByFlightNumber(String n)     // ✅ flightNumber existe
findByFlightNumero(String n)      // ❌ NO EXISTE FlightNumero Y LA APP NO ARRANCA
```

> 🔑 **Esto es lo mejor de los métodos derivados:** si te equivocas en un nombre, el error aparece **al arrancar la aplicación**, no cuando un usuario llame al endpoint. Con `@Query` (SQL en texto) el error solo aparece en tiempo de ejecución.
> 

---

# 5. Consultas por atributo simple

### estructura

```
src/main/java/com/example/airline/
├── AirlineApplication.java          // Clase principal con @SpringBootApplication
├── model/                           // Entidades JPA
│   ├── Airline.java
│   ├── Airplane.java
│   ├── Airport.java
│   ├── Flight.java
│   ├── Ticket.java
│   └── TicketFlight.java
├── repository/                      // Interfaces de repositorio
│   ├── AirlineRepository.java
│   ├── AirplaneRepository.java
│   ├── AirportRepository.java
│   ├── FlightRepository.java
│   ├── TicketRepository.java
│   └── TicketFlightRepository.java
├── service/                         // Interfaz de servicios
│   ├── IAirlineService.java
│   ├── IAirplaneService.java
│   ├── IAirportService.java
│   ├── IFlightService.java
│   ├── ITicketService.java
│   └── ITicketFlightService.java
└── service/serviceImpl/             // Implementación de servicios
│   ├── AirlineServiceImpl.java
│   ├── AirplaneServiceImpl.java
│   ├── AirportServiceImpl.java
│   ├── FlightServiceImpl.java
│   ├── TicketServiceImpl.java
│   └── TicketFlightServiceImpl.java
└── controller/                      // Controladores REST
    ├── AirlineController.java
    ├── AirplaneController.java
    ├── AirportController.java
    ├── FlightController.java
    ├── TicketController.java
    └── TicketFlightController.java
```

## 5.1 Encontrar a todos

```java
public interface FlightRepository extends JpaRepository<Flight, Long> {
    findAll();
```

```java
List<Flight> todos = flightRepository.findAll();
```

```sql
SELECT * FROM flights;
```

## 5.2 Encontrar uno por atributo específico

```java
public interface FlightRepository extends JpaRepository<Flight, Long> {

    // El número de vuelo es único → Optional
    Optional<Flight> findByFlightNumber(String flightNumber);
}
```

```sql
SELECT * FROM flights WHERE flight_number = ?1;
```

Más ejemplos en otros repositorios:

```java
// TicketRepository
Optional<Ticket> findByBookingCode(String bookingCode);

// AirportRepository
Optional<Airport> findByIataCode(String iataCode);

// AirplaneRepository
Optional<Airplane> findByRegistrationNumber(String registrationNumber);

// AirlineRepository
Optional<Airline> findByIataCode(String iataCode);
```

## 5.3 Encontrar varios por atributo específico

Cuando el atributo **no es único**, el resultado es una lista:

```java
// AirportRepository
List<Airport> findByCountry(String country);          // todos los aeropuertos de Colombia
List<Airport> findByCity(String city);                // todos los de Bogotá

// AirplaneRepository
List<Airplane> findByModel(String model);             // todos los A320

// TicketRepository
List<Ticket> findByPassengerFullName(String name);    // todos los tiquetes de Ana Gómez
```

## 5.4 Combinar dos atributos: `And` / `Or`

```java
// Aeropuertos de una ciudad específica en un país específico
List<Airport> findByCityAndCountry(String city, String country);
```

```sql
SELECT * FROM airports WHERE city = ?1 AND country = ?2;
```

```java
// Aviones que sean A320 o A330
List<Airplane> findByModelOrModel(String m1, String m2);   // funciona pero es feo
List<Airplane> findByModelIn(List<String> modelos);        // ✅ mejor
```

> 🔑 **El orden de los parámetros del método debe coincidir con el orden en que aparecen en el nombre.** En `findByCityAndCountry(String city, String country)`, el primer parámetro va a `city` y el segundo a `country`. Si los inviertes, compila igual pero busca al revés.
> 

---

# 6. Consultas con condiciones y filtros

Aquí entran las palabras clave que traducen a operadores SQL.

## 6.1 Comparaciones numéricas

```java
// AirplaneRepository

// Aviones con más de N asientos
List<Airplane> findBySeatCapacityGreaterThan(Integer capacity);
// → WHERE seat_capacity > ?1

List<Airplane> findBySeatCapacityGreaterThanEqual(Integer capacity);
// → WHERE seat_capacity >= ?1

List<Airplane> findBySeatCapacityLessThan(Integer capacity);
// → WHERE seat_capacity < ?1

// Aviones con capacidad entre dos valores
List<Airplane> findBySeatCapacityBetween(Integer min, Integer max);
// → WHERE seat_capacity BETWEEN ?1 AND ?2
```

## 6.2 Comparaciones de fecha

```java
// FlightRepository

// Vuelos que salen después de cierta fecha
List<Flight> findByDepartureDateAfter(Timestamp fecha);
// → WHERE departure_date > ?1

// Vuelos que salieron antes
List<Flight> findByDepartureDateBefore(Timestamp fecha);
// → WHERE departure_date < ?1

// Vuelos dentro de un rango (ej: los de hoy)
List<Flight> findByDepartureDateBetween(Timestamp inicio, Timestamp fin);
// → WHERE departure_date BETWEEN ?1 AND ?2
```

## 6.3 Texto: `Containing`, `StartingWith`, `IgnoreCase`

```java
// TicketRepository

// Pasajeros cuyo nombre CONTIENE un texto (búsqueda tipo buscador)
List<Ticket> findByPassengerFullNameContainingIgnoreCase(String texto);
// → WHERE LOWER(passenger_full_name) LIKE LOWER('%?1%')

// AirportRepository
List<Airport> findByNameStartingWith(String prefijo);
// → WHERE name LIKE '?1%'

List<Airport> findByNameEndingWith(String sufijo);
// → WHERE name LIKE '%?1'

List<Airport> findByCountryIgnoreCase(String country);
// → WHERE LOWER(country) = LOWER(?1)
```

> 💡 `Containing` + `IgnoreCase` es la combinación estándar para un campo de búsqueda en una interfaz.
> 

## 6.4 Nulos y listas

```java
// Vuelos que todavía no tienen avión asignado
List<Flight> findByAirplaneIsNull();
// → WHERE airplane_id IS NULL

List<Flight> findByAirplaneIsNotNull();
// → WHERE airplane_id IS NOT NULL

// Aeropuertos de varios países a la vez
List<Airport> findByCountryIn(List<String> paises);
// → WHERE country IN (?1, ?2, ?3)
```

## 6.5 Encontrar uno por atributo, filtrado por condición

Este es el caso que pediste: **combinar un atributo exacto con una condición**.

```java
// FlightRepository

// El vuelo AV8020 que salga después de hoy
Optional<Flight> findByFlightNumberAndDepartureDateAfter(
        String flightNumber, Timestamp fecha);
```

```sql
SELECT * FROM flights
WHERE flight_number = ?1
  AND departure_date > ?2;
```

Más variantes:

```java
// Aviones de un modelo específico con capacidad mínima
List<Airplane> findByModelAndSeatCapacityGreaterThan(String model, Integer min);

// Tiquetes de un pasajero comprados en un rango de fechas
List<Ticket> findByPassengerFullNameAndPurchaseDateBetween(
        String nombre, Timestamp desde, Timestamp hasta);

// Aeropuertos de un país cuyo nombre contenga cierto texto
List<Airport> findByCountryAndNameContainingIgnoreCase(String country, String texto);
```

## 6.6 `countBy`, `existsBy`, `deleteBy`

```java
// ¿Cuántos vuelos salen de este aeropuerto?
long countByOriginAirportId(Long airportId);

// ¿Ya existe este número de vuelo? (validación antes de crear)
boolean existsByFlightNumber(String flightNumber);

// ¿Este código de reserva ya está tomado?
boolean existsByBookingCode(String bookingCode);

// Borrar todos los tramos de un tiquete
@Transactional
void deleteByTicketId(Long ticketId);
```

> ⚠️ `deleteBy...` **requiere** `@Transactional` (en el método del repositorio o en el servicio). Sin eso lanza `TransactionRequiredException`.
> 

---

# 7. Consultas con JOIN: navegando relaciones

Esta es la parte más potente. **Puedes filtrar por atributos de entidades relacionadas simplemente encadenando sus nombres**, y Spring genera el `JOIN` solo.

## 7.1 La idea básica

```java
// En Flight tengo:
private Airport originAirport;    // y Airport tiene: private String country;
```

Entonces:

```java
List<Flight> findByOriginAirportCountry(String country);
//                  └─────┬──────┘└──┬──┘
//              atributo de Flight   atributo de Airport
```

Spring genera:

```sql
SELECT f.* FROM flights f
INNER JOIN airports a ON f.origin_airport_id = a.id
WHERE a.country = ?1;
```

**Escribiste cero SQL.** Solo encadenaste `originAirport` + `country`.

## 7.2 Filtrar por el ID de la relación

Este es el caso más frecuente:

```java
// Todos los vuelos que salen de un aeropuerto específico
List<Flight> findByOriginAirportId(Long airportId);
// → WHERE f.origin_airport_id = ?1

// Todos los aviones de una aerolínea
List<Airplane> findByAirlineId(Long airlineId);
// → WHERE a.airline_id = ?1

// Todos los tramos de un tiquete
List<TicketFlight> findByTicketId(Long ticketId);
// → WHERE tf.ticket_id = ?1
```

> 💡 Al filtrar solo por el ID, Hibernate ni siquiera hace `JOIN`: usa directamente la columna FK, que ya está en la tabla. Es la consulta más eficiente.
> 

### Pasar el objeto en lugar del ID

```java
List<Flight> findByOriginAirport(Airport airport);   // pasas el objeto completo
List<Flight> findByOriginAirportId(Long id);         // pasas solo el id  ← preferible
```

Ambas funcionan. La segunda es mejor porque no te obliga a cargar el `Airport` antes.

## 7.3 Encadenar varios niveles

Puedes bajar tantos niveles como necesites:

```
TicketFlight → flight → originAirport → country
```

```java
// En TicketFlightRepository
List<TicketFlight> findByFlightOriginAirportCountry(String country);
```

```sql
SELECT tf.* FROM ticket_flights tf
INNER JOIN flights  f ON tf.flight_id       = f.id
INNER JOIN airports a ON f.origin_airport_id = a.id
WHERE a.country = ?1;
```

Tres tablas unidas con un solo nombre de método.

## 7.4 El guion bajo `_`: cuando hay ambigüedad

A veces el nombre es ambiguo. Imagina que `Flight` tuviera un atributo `originAirportCountry` **y además** la relación `originAirport` con su campo `country`. Spring no sabría cuál elegir.

El guion bajo **marca explícitamente dónde termina una propiedad y empieza la siguiente**:

```java
List<Flight> findByOriginAirport_Country(String country);
//                  └────┬──────┘ └──┬──┘
//              atributo de Flight   atributo de Airport
```

Es equivalente a `findByOriginAirportCountry`, pero **sin ambigüedad**.

```java
// Con guion bajo, súper legible en cadenas largas:
List<TicketFlight> findByFlight_OriginAirport_Country(String country);
List<TicketFlight> findByTicket_PassengerFullName(String name);
```

> ✅ **Recomendación:** usa `_` siempre que navegues relaciones. Hace obvio dónde está el “join” y evita errores raros de interpretación.
> 

## 7.5 `Distinct`: evitar duplicados

Cuando haces JOIN hacia una colección, puedes obtener la misma fila varias veces.

```java
// Aeropuertos que tienen vuelos hacia cierto país
List<Airport> findDistinctByDepartingFlights_DestinationAirport_Country(String country);
```

Sin `Distinct`, si un aeropuerto tiene 5 vuelos a España, aparecería 5 veces.

---

# 8. MAS EJEMPLOS

## ✅ Caso 1: Encontrar a todos

```java
// FlightRepository — no hay que declarar nada, findAll() viene incluido
```

```java
// FlightServiceImpl
public List<Flight> findAll() {
    return flightRepository.findAll();
}
```

## ✅ Caso 2: Encontrar uno por atributo específico

```java
public interface FlightRepository extends JpaRepository<Flight, Long> {
    Optional<Flight> findByFlightNumber(String flightNumber);
}
```

```java
public Flight findByFlightNumber(String flightNumber) {
    return flightRepository.findByFlightNumber(flightNumber)
            .orElseThrow(() -> new RuntimeException(
                    "No existe el vuelo: " + flightNumber));
}
```

## ✅ Caso 3: Encontrar por atributo específico filtrado por condición

```java
public interface FlightRepository extends JpaRepository<Flight, Long> {

    // Un vuelo específico, pero solo si sale después de cierta fecha
    Optional<Flight> findByFlightNumberAndDepartureDateAfter(
            String flightNumber, Timestamp fecha);

    // Vuelos de un aeropuerto con avión de capacidad mínima
    List<Flight> findByOriginAirport_IdAndAirplane_SeatCapacityGreaterThan(
            Long airportId, Integer minCapacity);
}
```

```sql
-- El segundo genera:
SELECT f.* FROM flights f
INNER JOIN airplanes ap ON f.airplane_id = ap.id
WHERE f.origin_airport_id = ?1
  AND ap.seat_capacity > ?2;
```

## ✅ Caso 4: Encontrar los `TicketFlight` de un vuelo específico de un país

Aquí hay que combinar **dos filtros que navegan la misma relación**: el vuelo concreto y el país de su aeropuerto de origen.

```java
public interface TicketFlightRepository extends JpaRepository<TicketFlight, Long> {

    List<TicketFlight> findByFlight_IdAndFlight_OriginAirport_Country(
            Long flightId, String country);
}
```

```sql
SELECT tf.* FROM ticket_flights tf
INNER JOIN flights  f ON tf.flight_id        = f.id
INNER JOIN airports a ON f.origin_airport_id = a.id
WHERE f.id = ?1
  AND a.country = ?2;
```

Uso:

```java
List<TicketFlight> tramos = ticketFlightRepository
        .findByFlight_IdAndFlight_OriginAirport_Country(12L, "Colombia");
```

Variantes útiles del mismo caso:

```java
// Por número de vuelo en vez de id
List<TicketFlight> findByFlight_FlightNumberAndFlight_OriginAirport_Country(
        String flightNumber, String country);

// Todos los tramos que salen de un país (sin importar el vuelo)
List<TicketFlight> findByFlight_OriginAirport_Country(String country);

// Tramos de un vuelo, ordenados por número de escala
List<TicketFlight> findByFlight_IdOrderBySegmentOrderAsc(Long flightId);
```

## ✅ Caso 5: Encontrar todos los vuelos de un país

“De un país” puede significar tres cosas. Aquí están las tres:

```java
public interface FlightRepository extends JpaRepository<Flight, Long> {

    // a) Vuelos que SALEN de ese país
    List<Flight> findByOriginAirport_Country(String country);

    // b) Vuelos que LLEGAN a ese país
    List<Flight> findByDestinationAirport_Country(String country);

    // c) Vuelos que salen O llegan a ese país
    List<Flight> findByOriginAirport_CountryOrDestinationAirport_Country(
            String countryOrigen, String countryDestino);

    // d) Vuelos internos: salen Y llegan al mismo país
    List<Flight> findByOriginAirport_CountryAndDestinationAirport_Country(
            String countryOrigen, String countryDestino);
}
```

El caso (c) se llamaría así desde el servicio:

```java
public List<Flight> findFlightsByCountry(String country) {
    // hay que pasar el país dos veces, uno por cada lado del OR
    return flightRepository
            .findByOriginAirport_CountryOrDestinationAirport_Country(country, country);
}
```

SQL del caso (c):

```sql
SELECT f.* FROM flights f
INNER JOIN airports o ON f.origin_airport_id      = o.id
INNER JOIN airports d ON f.destination_airport_id = d.id
WHERE o.country = ?1 OR d.country = ?2;
```

## 🎁 Ejemplos adicionales del mismo estilo

```java
// ── FlightRepository ──────────────────────────────────────

// Vuelos de una aerolínea (Flight → Airplane → Airline)
List<Flight> findByAirplane_Airline_Id(Long airlineId);

// Vuelos de una aerolínea por su código IATA
List<Flight> findByAirplane_Airline_IataCode(String iataCode);

// Vuelos entre dos ciudades
List<Flight> findByOriginAirport_CityAndDestinationAirport_City(
        String ciudadOrigen, String ciudadDestino);

// Vuelos de un país en un rango de fechas, ordenados por salida
List<Flight> findByOriginAirport_CountryAndDepartureDateBetweenOrderByDepartureDateAsc(
        String country, Timestamp desde, Timestamp hasta);

// Vuelos con avión de cierta capacidad mínima que salen de un país
List<Flight> findByOriginAirport_CountryAndAirplane_SeatCapacityGreaterThan(
        String country, Integer minCapacity);

// ¿Cuántos vuelos salen de un país?
long countByOriginAirport_Country(String country);

// ── TicketRepository ──────────────────────────────────────

// Tiquetes que incluyen un vuelo específico (Ticket → TicketFlight → Flight)
List<Ticket> findDistinctByTicketFlights_Flight_Id(Long flightId);

// Tiquetes que pasan por un país
List<Ticket> findDistinctByTicketFlights_Flight_OriginAirport_Country(String country);

// Tiquetes de un pasajero ordenados por fecha de compra (más reciente primero)
List<Ticket> findByPassengerFullNameOrderByPurchaseDateDesc(String nombre);

// Tiquetes con más de un tramo → esto NO se puede con métodos derivados.
// Requiere @Query o hacerlo en el servicio filtrando la lista.

// ── AirplaneRepository ────────────────────────────────────

// Aviones de una aerolínea con capacidad mínima
List<Airplane> findByAirline_IdAndSeatCapacityGreaterThanEqual(Long airlineId, Integer min);

// Aviones de aerolíneas de cierto país
List<Airplane> findByAirline_Country(String country);

// ── AirportRepository ─────────────────────────────────────

// Aeropuertos de un país ordenados por ciudad
List<Airport> findByCountryOrderByCityAsc(String country);

// Aeropuertos que tienen al menos un vuelo saliente
List<Airport> findDistinctByDepartingFlightsIsNotEmpty();
```

> ⚠️ **Límite de los métodos derivados:** no pueden hacer agregaciones (`SUM`, `AVG`, `GROUP BY`) ni condiciones sobre el tamaño de una colección (`HAVING COUNT(*) > 1`). Para eso sí se necesita `@Query`, o resolverlo en la capa de servicio con streams de Java.
> 

---

# 9. Ordenamiento, límites y paginación

## 9.1 `OrderBy` en el nombre del método

```java
List<Flight> findByOriginAirport_CountryOrderByDepartureDateAsc(String country);
List<Flight> findByOriginAirport_CountryOrderByDepartureDateDesc(String country);

// Ordenar por dos campos
List<Airport> findByCountryOrderByCityAscNameAsc(String country);
```

## 9.2 `Top` / `First`: limitar resultados

```java
// El próximo vuelo que sale de un aeropuerto
Optional<Flight> findFirstByOriginAirport_IdOrderByDepartureDateAsc(Long airportId);

// Los 5 tiquetes más recientes de un pasajero
List<Ticket> findTop5ByPassengerFullNameOrderByPurchaseDateDesc(String nombre);

// Los 10 aviones de mayor capacidad
List<Airplane> findTop10ByOrderBySeatCapacityDesc();
```

`First` y `Top` son sinónimos. `findFirstBy...` = `findTop1By...`.

## 9.3 `Sort` como parámetro (ordenamiento dinámico)

Cuando el orden lo decide el usuario en tiempo de ejecución:

```java
List<Flight> findByOriginAirport_Country(String country, Sort sort);
```

```java
// En el servicio
flightRepository.findByOriginAirport_Country("Colombia",
        Sort.by(Sort.Direction.DESC, "departureDate"));
```

## 9.4 `Pageable`: paginación

```java
Page<Flight> findByOriginAirport_Country(String country, Pageable pageable);
```

```java
// Página 0 (la primera), 20 elementos por página, ordenada por fecha
Pageable pagina = PageRequest.of(0, 20, Sort.by("departureDate").descending());
Page<Flight> resultado = flightRepository.findByOriginAirport_Country("Colombia", pagina);

resultado.getContent();        // List<Flight> con los 20
resultado.getTotalElements();  // total de vuelos que cumplen el filtro
resultado.getTotalPages();     // total de páginas
```

---

# 10. Usar el repositorio desde el Service

La regla es: **el Controller nunca toca el Repository.** Siempre pasa por el Service.

### **¿Por qué una capa de servicio?**

- Contiene la **lógica de negocio**.
- Orquesta múltiples repositorios si es necesario.
- Aplica reglas de validación y transacciones.
- Desacopla el controlador de los detalles de persistencia.

### **Estructura: Interfaz + Implementación**

#### **10.1 Interfaz del Servicio (IAirlineService)**

Define el **contrato** (qué operaciones están disponibles).

java

```java
package com.example.airline.service;

import com.example.airline.model.Airline;
import java.util.List;
import java.util.Optional;

public interface IAirlineService {

    Airline createAirline(Airline airline);
    List<Airline> getAllAirlines();
    Optional<Airline> getAirlineById(Long id);
    Optional<Airline> getAirlineByIataCode(String iataCode);
    Airline updateAirline(Long id, Airline airline);
    void deleteAirline(Long id);
    List<Airline> searchAirlinesByName(String name);
}
```

#### **10.2 Implementación del Servicio (AirlineServiceImpl)**

Implementa la interfaz, usa el repositorio y aplica lógica de negocio.

java

```java
package com.example.airline.service.serviceImpl;

import com.example.airline.model.Airline;
import com.example.airline.repository.AirlineRepository;
import com.example.airline.service.IAirlineService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AirlineServiceImpl implements IAirlineService {

    private final AirlineRepository airlineRepository;

    @Override
    @Transactional
    public Airline createAirline(Airline airline) {
        // Validación de negocio: IATA code debe ser único
        if (airline.getIataCode() != null) {
            Optional<Airline> existing = airlineRepository.findByIataCode(airline.getIataCode());
            if (existing.isPresent()) {
                throw new RuntimeException("IATA code already exists");
            }
        }
        return airlineRepository.save(airline);
    }

    @Override
    public List<Airline> getAllAirlines() {
        return airlineRepository.findAll();
    }

    @Override
    public Optional<Airline> getAirlineById(Long id) {
        return airlineRepository.findById(id);
    }

    @Override
    public Optional<Airline> getAirlineByIataCode(String iataCode) {
        return airlineRepository.findByIataCode(iataCode);
    }

    @Override
    @Transactional
    public Airline updateAirline(Long id, Airline airline) {
        Airline existing = airlineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Airline not found"));
        // Actualizar solo campos permitidos
        existing.setName(airline.getName());
        existing.setCountry(airline.getCountry());
        existing.setIataCode(airline.getIataCode());
        return airlineRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteAirline(Long id) {
        if (!airlineRepository.existsById(id)) {
            throw new RuntimeException("Airline not found");
        }
        airlineRepository.deleteById(id);
    }

    @Override
    public List<Airline> searchAirlinesByName(String name) {
        return airlineRepository.searchByName(name);
    }
}
```

**Explicación de anotaciones:**

- **`@Service`**: Marca la clase como un bean de servicio de Spring.
- **`@RequiredArgsConstructor`**: Lombok genera un constructor con los campos `final`. Esto permite inyección por constructor (recomendada).
- **`@Transactional`**: Garantiza que las operaciones se ejecuten dentro de una transacción (para escritura). En métodos de solo lectura se puede usar `@Transactional(readOnly = true)`.
- **`@Override`**: Indica que se está implementando un método de la interfaz.

### **Servicios para otras entidades**

Se sigue el mismo patrón para cada entidad:

- **IAirplaneService** / **AirplaneServiceImpl**
- **IAirportService** / **AirportServiceImpl**
- **IFlightService** / **FlightServiceImpl**
- **ITicketService** / **TicketServiceImpl**
- **ITicketFlightService** / **TicketFlightServiceImpl**

Cada servicio maneja su lógica de negocio correspondiente.

### Sobre `@Transactional`

- A nivel de clase → todos los métodos son transaccionales.
- `readOnly = true` en las lecturas → Hibernate optimiza (no rastrea cambios). Buena práctica.
- Si un método lanza una excepción no controlada, **la transacción se revierte completa** (rollback).

### Inyección por constructor (mejor que `@Autowired`)

```java
@Service
@Transactional
public class FlightServiceImpl implements IFlightService {

    private final FlightRepository flightRepository;

    public FlightServiceImpl(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }
}
```

Ventajas: el campo puede ser `final` (inmutable), no puede quedar en null, y es más fácil de probar. Desde Spring 4.3, si la clase tiene **un solo constructor**, ni siquiera necesitas `@Autowired`.

---

# 11. Un servicio que llama a otro servicio

Es totalmente válido y frecuente. La regla es: **un servicio puede llamar a otros servicios y a su propio repositorio.**

Ejemplo: crear un tiquete con sus tramos. Necesita validar que los vuelos existan (responsabilidad de `FlightService`) antes de guardar (responsabilidad de `TicketService`).

```java
@Service
@Transactional
public class TicketServiceImpl implements ITicketService {

    private final TicketRepository ticketRepository;
    private final TicketFlightRepository ticketFlightRepository;
    private final IFlightService flightService;      // ← otro servicio

    public TicketServiceImpl(TicketRepository ticketRepository,
                             TicketFlightRepository ticketFlightRepository,
                             IFlightService flightService) {
        this.ticketRepository = ticketRepository;
        this.ticketFlightRepository = ticketFlightRepository;
        this.flightService = flightService;
    }

    @Override
    public Ticket createTicketWithSegments(Ticket ticket, List<Long> flightIds) {

        // 1. Validar duplicado
        if (ticketRepository.existsByBookingCode(ticket.getBookingCode())) {
            throw new IllegalArgumentException("Código de reserva ya usado");
        }

        // 2. Guardar el tiquete
        Ticket guardado = ticketRepository.save(ticket);

        // 3. Crear un tramo por cada vuelo, usando el OTRO servicio para validar
        int orden = 1;
        for (Long flightId : flightIds) {
            Flight flight = flightService.findById(flightId);  // ← lanza si no existe

            TicketFlight tramo = new TicketFlight();
            tramo.setTicket(guardado);
            tramo.setFlight(flight);
            tramo.setSegmentOrder(orden++);

            ticketFlightRepository.save(tramo);
        }

        return guardado;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Ticket> findTicketsDepartingFrom(String country) {
        return ticketRepository
                .findDistinctByTicketFlights_Flight_OriginAirport_Country(country);
    }
}
```

### Ventaja de inyectar la **interfaz** (`IFlightService`) y no la implementación

Si mañana cambias `FlightServiceImpl` por `FlightServiceCacheImpl`, `TicketServiceImpl` no se entera. Eso es **desacoplamiento**, y es la razón por la que se crean interfaces de servicio.

### ⚠️ Cuidado con las dependencias circulares

Si `TicketService` inyecta `FlightService` y `FlightService` inyecta `TicketService`, Spring falla al arrancar con `BeanCurrentlyInCreationException`. Si eso te pasa, es señal de que la lógica está en el lugar equivocado: normalmente hay que mover ese método a un tercer servicio que use a los dos.

---

# 12. Tabla de referencia rápida

## Palabras clave de métodos derivados

| Palabra clave | Ejemplo | SQL generado |
| --- | --- | --- |
| `findBy` | `findByName` | `WHERE name = ?1` |
| `And` | `findByCityAndCountry` | `WHERE city = ?1 AND country = ?2` |
| `Or` | `findByCityOrCountry` | `WHERE city = ?1 OR country = ?2` |
| `Between` | `findByAgeBetween` | `WHERE age BETWEEN ?1 AND ?2` |
| `LessThan` | `findByAgeLessThan` | `WHERE age < ?1` |
| `LessThanEqual` | `findByAgeLessThanEqual` | `WHERE age <= ?1` |
| `GreaterThan` | `findByAgeGreaterThan` | `WHERE age > ?1` |
| `GreaterThanEqual` | `findByAgeGreaterThanEqual` | `WHERE age >= ?1` |
| `After` / `Before` | `findByDateAfter` | `WHERE date > ?1` |
| `IsNull` / `IsNotNull` | `findByAirplaneIsNull` | `WHERE airplane_id IS NULL` |
| `Like` | `findByNameLike` | `WHERE name LIKE ?1` |
| `Containing` | `findByNameContaining` | `WHERE name LIKE '%?1%'` |
| `StartingWith` | `findByNameStartingWith` | `WHERE name LIKE '?1%'` |
| `EndingWith` | `findByNameEndingWith` | `WHERE name LIKE '%?1'` |
| `IgnoreCase` | `findByNameIgnoreCase` | `WHERE LOWER(name) = LOWER(?1)` |
| `In` | `findByCountryIn` | `WHERE country IN (?1, ?2...)` |
| `NotIn` | `findByCountryNotIn` | `WHERE country NOT IN (...)` |
| `True` / `False` | `findByActiveTrue` | `WHERE active = true` |
| `Not` | `findByCountryNot` | `WHERE country <> ?1` |
| `OrderBy...Asc/Desc` | `findByCityOrderByNameAsc` | `ORDER BY name ASC` |
| `Distinct` | `findDistinctByCountry` | `SELECT DISTINCT` |
| `Top` / `First` | `findTop5ByOrderByIdDesc` | `LIMIT 5` |
| `IsEmpty` / `IsNotEmpty` | `findByFlightsIsNotEmpty` | Colección no vacía |
| `countBy` | `countByCountry` | `SELECT COUNT(*)` |
| `existsBy` | `existsByIataCode` | Devuelve `boolean` |
| `deleteBy` | `deleteByTicketId` | `DELETE` (requiere `@Transactional`) |

## Navegación de relaciones

| Escribes | Significa |
| --- | --- |
| `findByOriginAirportId(Long)` | Filtra por la columna FK directamente. Sin JOIN. |
| `findByOriginAirport(Airport)` | Igual, pero pasas el objeto. |
| `findByOriginAirport_Country(String)` | JOIN con `airports`, filtra por `country`. |
| `findByFlight_OriginAirport_Country(String)` | Doble JOIN, tres tablas. |
| `findByFlight_IdAndFlight_OriginAirport_Country(Long, String)` | Dos filtros sobre la misma cadena. |

## Errores comunes y su causa

| Mensaje de error | Causa |
| --- | --- |
| `mappedBy reference an unknown target entity property` | El nombre en `mappedBy` no coincide con el atributo del otro lado. |
| `Unable to locate Attribute with the given name [x] on this ManagedType` | Typo en el nombre del método derivado. |
| `No property 'x' found for type 'Y'` | Igual: el atributo no existe en la entidad. |
| `StackOverflowError` al llamar un endpoint | Falta `@JsonIgnore` en una relación bidireccional. |
| `StackOverflowError` al hacer log/`toString()` | Falta  @ToString.Exclude. |
| `IncorrectResultSizeDataAccessException` | Declaraste `Optional<T>` pero la consulta devuelve varias filas. |
| `LazyInitializationException` | Intentaste acceder a una relación LAZY fuera de la transacción. Usa `@Transactional` en el servicio. |
| `Cannot delete or update a parent row` | Falta `cascade` u `orphanRemoval` en la relación, o hay registros hijos. |
| `TransactionRequiredException` | Un método `deleteBy...` sin `@Transactional`. |
| `BeanCurrentlyInCreationException` | Dependencia circular entre servicios. |

---

# Controller

# 🟦 BLOQUE 0 — Fundamentos previos

Antes de escribir la primera línea de un controlador hay que entender qué es exactamente lo que un controlador atiende.

---

# 1. ¿Qué es un endpoint?

Un **endpoint** es la combinación de un **método HTTP** y una **ruta**.

```
POST  /api/rest/events?notify=true
└─┬─┘ └────┬────────┘ └────┬─────┘
método    ruta          query string
```

`GET /events` y `POST /events` **son dos endpoints distintos** aunque la ruta sea la misma. Es el par (método + ruta) el que identifica la operación.

### Anatomía completa de una URL

```
http://localhost:8081/api/mvc/events/5/schedules?page=0&size=10
└─┬──┘ └───┬──────┘└─┬┘└──────────┬─────────────┘└──────┬─────┘
protocolo  host    context     path (ruta)         query string
                    path
```

| Parte | Dónde se define |
| --- | --- |
| `localhost:8081` | `server.port` en `application.properties` |
| `/api` | `server.servlet.context-path=/api` |
| `/mvc/events` | `@RequestMapping("/mvc/events")` a nivel de clase |
| `/5/schedules` | `@GetMapping("/{id}/schedules")` a nivel de método |
| `?page=0&size=10` | `@RequestParam` |

> 💡 Con `server.servlet.context-path=/api`, **todas** las rutas quedan bajo `/api`. Por eso los ejemplos usan `http://localhost:8081/api/mvc/events`.
> 

### Cómo Spring decide qué método ejecutar

```
Petición: GET /api/mvc/events/5
                │
                ▼
         DispatcherServlet          ← el "recepcionista" de Spring
                │
                ▼
   Busca ruta base + ruta de método que coincidan
                │
                ▼
   @Controller @RequestMapping("/mvc/events")
   └── @GetMapping("/{id}")   ✅
                │
                ▼
        Ejecuta findById(5)
```

- Ninguna combinación coincide → **404 Not Found**
- La ruta coincide pero el método HTTP no → **405 Method Not Allowed**

---

# 2. Métodos HTTP e idempotencia

| Método | Propósito | Idempotente | Seguro | ¿Body? | Anotación |
| --- | --- | --- | --- | --- | --- |
| **GET** | Obtener | ✅ | ✅ | ❌ | `@GetMapping` |
| **POST** | Crear | ❌ | ❌ | ✅ | `@PostMapping` |
| **PUT** | Reemplazar completo | ✅ | ❌ | ✅ | `@PutMapping` |
| **PATCH** | Actualizar parcial | ⚠️ Depende | ❌ | ✅ | `@PatchMapping` |
| **DELETE** | Eliminar | ✅ | ❌ | ❌ | `@DeleteMapping` |

**Seguro (*safe*)**: no modifica nada. Solo GET lo es.

**Idempotente**: repetir la petición N veces deja el servidor en el mismo estado que hacerla una vez.

```
POST /rest/events      → crea el evento #1
POST /rest/events      → crea el evento #2      ← NO idempotente

PUT /rest/events/5     → el evento 5 queda con esos datos
PUT /rest/events/5     → el evento 5 queda igual ← idempotente

DELETE /rest/events/5  → borra el 5
DELETE /rest/events/5  → ya no existe, mismo estado ← idempotente
```

> ⚠️ Idempotente **no** significa "misma respuesta". El segundo DELETE puede devolver 404 en vez de 204, pero el **estado del servidor** es idéntico. Eso es lo que cuenta.
> 

### PUT vs PATCH

json

```json
// Estado actual del evento 5
{ "id": 5, "title": "Concierto", "description": "Rock", "zoneId": 2 }
```

`PUT /rest/events/5` con `{ "title": "Jazz" }` → semánticamente, `description` y `zoneId` deberían quedar en `null` (reemplaza todo).

`PATCH /rest/events/5` con `{ "title": "Jazz" }` → solo cambia el título.

> 📌 En la práctica, muchísimos proyectos implementan PUT con comportamiento de PATCH (actualizando solo los campos no nulos). Es una desviación común y aceptada. En esta guía se hace así, pero conviene saber que técnicamente no es lo que PUT significa.
> 

---

# 3. Códigos de estado HTTP

| Código | Nombre | Cuándo |
| --- | --- | --- |
| **200** | OK | GET, PUT o PATCH exitoso |
| **201** | Created | POST exitoso |
| **204** | No Content | DELETE exitoso, sin cuerpo de respuesta |
| **400** | Bad Request | Datos inválidos del cliente |
| **401** | Unauthorized | No hay credenciales o son inválidas |
| **403** | Forbidden | Autenticado, pero sin permiso |
| **404** | Not Found | El recurso no existe |
| **409** | Conflict | Conflicto de estado (`userName` ya existe) |
| **500** | Internal Server Error | Falló algo en el servidor |

### La diferencia entre 401 y 403 (pregunta clásica)

- **401** = *"no sé quién eres"*. Falta el token o la sesión, o son inválidos.
- **403** = *"sé quién eres, pero esto no es para ti"*. Un `ATTENDEE` intentando entrar a `/mvc/roles`, que exige `MANAGE_ROLES`.

---

# 4. `@PathVariable` vs `@RequestParam`

```
GET /rest/events/5/schedules?page=0&size=10
                  ↑                ↑
            @PathVariable    @RequestParam
```

## `@PathVariable` — parte de la ruta

java

```java
// GET /mvc/events/5
@GetMapping("/{id}")
public String findById(@PathVariable Integer id) { ... }
```

Si el nombre del parámetro Java no coincide con el de la plantilla:

java

```java
@GetMapping("/{eventId}")
public String findById(@PathVariable("eventId") Integer id) { ... }
```

Varias en la misma ruta:

java

```java
// GET /rest/events/5/attendees/12
@GetMapping("/{eventId}/attendees/{attendeeId}")
public ... find(@PathVariable Integer eventId, @PathVariable Integer attendeeId) { ... }
```

## `@RequestParam` — query string

java

```java
// GET /mvc/events?offset=0&pageSize=5
@GetMapping
public String findAll(@RequestParam(defaultValue = "0") int offset,
                      @RequestParam(defaultValue = "5") int pageSize) { ... }
```

| Atributo | Qué hace |
| --- | --- |
| `required` | `true` por defecto: si falta → **400 Bad Request** |
| `defaultValue` | Valor si no viene. **Implica `required = false`** |
| `name` / `value` | Nombre en la URL si difiere del parámetro Java |

> ⚠️ Para parámetros opcionales usa **tipos envoltorio** (`Integer`, `Boolean`), nunca primitivos (`int`, `boolean`). Un `int` no puede ser `null`: si el parámetro no viene, Spring lanza excepción.
> 

## ¿Cuándo usar cada uno?

| `@PathVariable` | `@RequestParam` |
| --- | --- |
| Identifica **un recurso concreto** | **Filtra, ordena o pagina** |
| Obligatorio | Normalmente opcional |
| `/events/5` | `/events?zoneId=2` |
| `/users/8` | `/users?age=25&limit=20` |

**Regla mental:** si al quitar el valor la URL sigue teniendo sentido → `@RequestParam`. Si deja de identificar algo → `@PathVariable`.

```
/events/5      → quito el 5  → /events (otra cosa: la lista)  → PathVariable
/events?limit=10 → quito limit → /events (lo mismo)           → RequestParam
```

## Los otros orígenes de datos

| Anotación | De dónde saca el dato | Se usa en |
| --- | --- | --- |
| `@PathVariable` | Ruta: `/events/**5**` | MVC y REST |
| `@RequestParam` | Query string: `?limit=**10**` | MVC y REST |
| `@ModelAttribute` | Formulario HTML (`form-urlencoded`) | **MVC** |
| `@RequestBody` | Cuerpo JSON | **REST** |
| `@RequestHeader` | Cabecera HTTP (`Authorization`) | REST |

---

# 5. Los dos tipos de controlador: SSR vs CSR

## `@Controller` — Server-Side Rendering

El servidor **arma el HTML completo** y lo manda listo.

```
1. GET /mvc/events
        ↓
2. El controlador pide los datos al servicio → List<Event>
        ↓
3. Los mete en el Model: model.addAttribute("events", lista)
        ↓
4. Devuelve el NOMBRE de una plantilla: return "events/list";
        ↓
5. Thymeleaf combina templates/events/list.html + los datos
        ↓
6. El navegador recibe HTML PURO y lo pinta
```

Lo que viaja por la red:

html

```html
<table>
  <tr><td>1</td><td>Concierto de Jazz</td><td>Auditorio A</td></tr>
  <tr><td>2</td><td>Feria de Ciencias</td><td>Salón principal</td></tr>
</table>
```

## `@RestController` — Client-Side Rendering

El servidor **solo manda datos**. El HTML lo construye el navegador con JavaScript.

```
1. El navegador carga una app de React (HTML vacío + bundle JS)
        ↓
2. React hace: fetch("/api/rest/events")
        ↓
3. El controlador pide los datos al servicio → List<Event>
        ↓
4. Los convierte a DTOs → Jackson los serializa a JSON
        ↓
5. React recibe el JSON y CONSTRUYE el HTML en el navegador
```

Lo que viaja por la red:

json

```json
[
  { "id": 1, "title": "Concierto de Jazz", "zoneName": "Auditorio A" },
  { "id": 2, "title": "Feria de Ciencias", "zoneName": "Salón principal" }
]
```

## Comparación

|  | `@Controller` (MVC / SSR) | `@RestController` (REST / CSR) |
| --- | --- | --- |
| **Devuelve** | El **nombre** de una plantilla (`String`) | El **objeto** (serializado a JSON) |
| **Quién arma el HTML** | El servidor (Thymeleaf) | El cliente (React) |
| **Qué viaja** | HTML completo | JSON |
| **Frontend** | Vive **dentro** del proyecto Spring | Proyecto **separado** |
| **Navegación** | Recarga la página entera | Cambia la vista sin recargar |
| **Datos que maneja** | **Entidades directamente** | **DTOs** |
| **Seguridad típica** | **Sesión + cookie JSESSIONID** | **JWT en el header** |
| **Estado** | Stateful | Stateless |
| **Formularios** | HTML `<form>` (solo GET y POST) | JSON con cualquier método |
| **Consumible por móvil** | ❌ No | ✅ Sí |
| **CORS** | No aplica | ⚠️ Hay que configurarlo |

## La anotación por dentro

java

```java
@RestController
// es exactamente equivalente a:
@Controller
@ResponseBody
```

`@ResponseBody` es lo que dice: *"no busques una plantilla, serializa el objeto que devolví"*.

Por eso, dentro de un `@Controller` MVC, marcar **un solo método** con `@ResponseBody` hace que ese método devuelva texto crudo. Es el truco que usaremos en el Paso 3.

## En un mismo proyecto pueden convivir

```
controller/
├── mvc/     → MvcEventController, MvcUserController, AuthController
└── rest/    → RestEventController, RestUserController, AuthController
```

> ⚠️ Si dos clases en paquetes distintos tienen el **mismo nombre** (como los dos `AuthController`), Spring falla porque el nombre del bean choca. Se resuelve nombrando el bean explícitamente:
> 
> 
> java
> 
> ```java
> @Controller("mvcAuthController")       // en el paquete mvc
> @RestController("restAuthController")  // en el paquete rest
> ```
> 

# 🟩 BLOQUE 1 — Construyendo el controlador MVC

A partir de aquí construimos `MvcEventController` desde cero. Cada paso agrega una pieza y explica el concepto que introduce.

---

# 1. Paso 1: preparar el terreno

## Qué se necesita

Un controlador MVC necesita un **motor de plantillas**. El estándar en Spring Boot es **Thymeleaf**:

xml

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

## Dónde van los archivos

```
src/main/
├── java/com/example/eventos/
│   ├── controller/
│   │   ├── mvc/                 ← controladores MVC
│   │   │   ├── MvcEventController.java
│   │   │   ├── MvcUserController.java
│   │   │   └── AuthController.java
│   │   └── rest/                ← controladores REST (Bloque 2)
│   ├── service/
│   ├── repository/
│   └── model/
└── resources/
    ├── templates/               ← las plantillas .html
    │   ├── login.html
    │   ├── hello.html
    │   └── events/
    │       ├── list.html
    │       └── form.html
    └── static/                  ← CSS, JS, imágenes
        └── css/styles.css
```

**La regla de resolución de vistas:** cuando un método devuelve `"events/list"`, Spring busca `src/main/resources/templates/events/list.html`. Sin el `templates/` y sin el `.html`.

---

# 2. Paso 2: la clase vacía

## El código

java

```java
package com.example.eventos.controller.mvc;

import com.example.eventos.service.EventService;
import com.example.eventos.service.UserService;
import com.example.eventos.service.ZoneService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/mvc/events")
@RequiredArgsConstructor
public class MvcEventController {

    private final EventService eventService;
    private final ZoneService zoneService;
    private final UserService userService;

    // los endpoints van aquí
}
```

## 🔍 Explicación de cada parte

### `@Controller`

Le dice a Spring dos cosas:

1. **"Registra esta clase como bean"**: al arrancar, el `@ComponentScan` la encuentra y crea una instancia.
2. **"Los `String` que devuelvan sus métodos son nombres de vista"**, no texto para el usuario.

### `@RequestMapping("/mvc/events")`

Ruta base de **toda** la clase. Todos los endpoints cuelgan de aquí:

java

```java
@RequestMapping("/mvc/events")     // ruta base
    @GetMapping                    // → GET  /mvc/events
    @GetMapping("/{id}")           // → GET  /mvc/events/5
    @PostMapping("/delete/{id}")   // → POST /mvc/events/delete/5
```

Con `context-path=/api`, la URL real es `http://localhost:8081/api/mvc/events`.

### `@RequiredArgsConstructor` e inyección de dependencias

Lombok genera un constructor con **todos los campos `final`**:

java

```java
// Lo que Lombok escribe por ti:
public MvcEventController(EventService eventService,
                          ZoneService zoneService,
                          UserService userService) {
    this.eventService = eventService;
    this.zoneService = zoneService;
    this.userService = userService;
}
```

Y Spring usa ese constructor para inyectar los servicios. Desde Spring 4.3, si la clase tiene **un solo constructor**, ni siquiera hace falta `@Autowired`.

**Por qué inyección por constructor y no `@Autowired` en el campo:**

| Por constructor (`final`) | Por campo (`@Autowired`) |
| --- | --- |
| El campo es inmutable | Puede reasignarse por error |
| No puede quedar `null` | Puede quedar `null` si algo falla |
| Fácil de probar (pasas dobles en el constructor) | Requiere reflection en los tests |
| Las dependencias circulares se detectan al arrancar | Se detectan tarde o nunca |

> 🔑 **La regla de las capas se respeta aquí:** el controlador inyecta **servicios**, nunca repositorios. Si un controlador inyecta un `EventRepository`, la lógica de negocio se está filtrando a la capa equivocada.
> 

---

# 3. Paso 3: el endpoint de prueba

Antes de escribir plantillas conviene comprobar que el controlador está conectado.

java

```java
@GetMapping("/ping")
@ResponseBody   // ← devuelve el texto "pong", NO busca una plantilla
public String ping() {
    return "pong";
}
```

Abres `http://localhost:8081/api/mvc/events/ping` y debe aparecer `pong` en el navegador.

## 🔍 Por qué hace falta `@ResponseBody`

Sin esa anotación, Spring interpretaría `"pong"` como un **nombre de vista** e intentaría abrir `templates/pong.html`. Como no existe, lanzaría:

```
TemplateInputException: Error resolving template [pong]
```

`@ResponseBody` le dice a ese método concreto: *"esto es contenido, no el nombre de un archivo"*.

> 🔑 **Este es el error conceptual número uno de MVC.** El `String` que devuelve un método `@Controller` **no es texto para el usuario**: es la ruta de una plantilla. Si devuelves `"Hola"`, Spring busca `templates/Hola.html`.
> 
> 
> Y de paso: recuerda que `@RestController` = `@Controller` + `@ResponseBody`. Este método `ping` se comporta exactamente como lo haría en un controlador REST.
> 

---

# 4. Paso 4: listar (el `Model` y las vistas)

## El código

java

```java
@GetMapping
public String findAll(Model model) {

    List<Event> events = eventService.findAll();

    model.addAttribute("events", events);   // ② mete los datos

    return "events/list";                   // ③ devuelve el nombre de la vista
}
```

## 🔍 Los tres elementos de todo método MVC

| Elemento | Qué es |
| --- | --- |
| **`Model model`** ① | Un mapa (`clave → valor`) que Spring **inyecta automáticamente**. Solo hay que declararlo como parámetro. Es el puente entre el controlador y el HTML. |
| **`model.addAttribute("events", lista)`** ② | Guarda datos bajo un nombre. **Ese nombre es el que se usará en el HTML.** |
| **`return "events/list"`** ③ | El nombre de la plantilla, sin `templates/` y sin `.html`. |

## La plantilla que lo recibe

`templates/events/list.html`:

html

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head><title>Eventos</title></head>
<body>

    <table>
        <tr><th>ID</th><th>Título</th><th>Zona</th><th>Autor</th></tr>

        <!-- "events" ES EL MISMO NOMBRE del addAttribute -->
        <tr th:each="event : ${events}">
            <td th:text="${event.id}"></td>
            <td th:text="${event.title}"></td>

            <!-- se navegan las relaciones del modelo directamente -->
            <td th:text="${event.zone != null ? event.zone.name : '-'}"></td>
            <td th:text="${event.author != null ? event.author.userName : '-'}"></td>
        </tr>
    </table>

</body>
</html>
```

### Sintaxis básica de Thymeleaf

| Atributo | Qué hace |
| --- | --- |
| `th:text="${var}"` | Reemplaza el contenido del elemento con el valor |
| `th:each="x : ${lista}"` | Repite el elemento por cada ítem (un `for`) |
| `th:if="${cond}"` | Muestra el elemento solo si la condición es cierta |
| `th:href="@{/ruta}"` | Genera una URL respetando el context path |
| `th:action="@{/ruta}"` | Igual, para el `action` de un formulario |
| `${...}` | Lee una variable del Model |
| `@{...}` | Construye una URL |

> 🔑 **La conexión clave:** el nombre en `model.addAttribute("events", ...)` es **exactamente** el que va en `th:each="event : ${events}"`.
> 
> 
> Si no coinciden, la tabla sale **vacía y sin ningún error**. Es el bug más frustrante de MVC porque no hay excepción ni mensaje: simplemente no aparece nada.
> 

## Ventaja de MVC: las relaciones se navegan solas

Fíjate en `${event.zone.name}`. La plantilla accede a la **entidad completa** con todas sus relaciones. No hace falta preparar nada: la entidad ya trae el objeto `Zone`.

Esto es cómodo, pero tiene un costo que veremos en el Bloque 2 (y que en REST se vuelve un problema real).

> ⚠️ Si la relación es `FetchType.LAZY` y la plantilla intenta acceder a ella fuera de la transacción, salta `LazyInitializationException`. Con `spring.jpa.open-in-view=true` (el valor por defecto) esto no ocurre porque la sesión queda abierta durante toda la petición — pero esa opción tiene otros problemas. Lo limpio es que el servicio traiga las relaciones que la vista necesita.
> 

---

# 5. Paso 5: paginación con `@RequestParam`

Si hay 5000 eventos, `findAll()` los trae todos y la página tarda una eternidad. Se pagina.

## El código

java

```java
// GET http://localhost:8081/api/mvc/events?offset=0&pageSize=5
@GetMapping
public String findAll(Model model,
                      @RequestParam(defaultValue = "0") int offset,
                      @RequestParam(defaultValue = "5") int pageSize) {

    Page<Event> page = eventService.findAll(offset, pageSize);

    model.addAttribute("events", page.getContent());  // los eventos de esta página
    model.addAttribute("page", page);                 // los metadatos de paginación

    return "events/list";
}
```

Y en el servicio:

java

```java
@Override
@Transactional(readOnly = true)
public Page<Event> findAll(int offset, int pageSize) {
    return eventRepository.findAll(PageRequest.of(offset, pageSize));
}
```

## 🔍 Explicación

### `defaultValue` hace opcionales los parámetros

```
GET /mvc/events                      → offset=0,  pageSize=5   (los valores por defecto)
GET /mvc/events?offset=2             → offset=2,  pageSize=5
GET /mvc/events?offset=2&pageSize=20 → offset=2,  pageSize=20
```

Sin `defaultValue`, la primera URL daría **400 Bad Request** por falta de parámetros.

### `Page<T>` no es una lista

Es una lista **más los metadatos** de la paginación:

| Método | Qué devuelve |
| --- | --- |
| `page.getContent()` | `List<Event>` con los elementos de esta página |
| `page.getTotalElements()` | Total de registros que existen |
| `page.getTotalPages()` | Total de páginas |
| `page.getNumber()` | Número de la página actual (empieza en 0) |
| `page.isFirst()` / `page.isLast()` | Si es la primera o la última |

Por eso se inyectan **dos atributos**: `events` para pintar la tabla y `page` para los botones.

## Los botones de paginación

html

```html
<div th:if="${page != null}">

    <a th:if="${!page.first}"
       th:href="@{/mvc/events(offset=${page.number - 1}, pageSize=${page.size})}">
       Anterior
    </a>

    <span th:text="'Página ' + (${page.number} + 1) + ' de ' + ${page.totalPages}"></span>

    <a th:if="${!page.last}"
       th:href="@{/mvc/events(offset=${page.number + 1}, pageSize=${page.size})}">
       Siguiente
    </a>
</div>
```

`@{/mvc/events(offset=..., pageSize=...)}` es la sintaxis de Thymeleaf para construir `/mvc/events?offset=1&pageSize=5`.

---

# 6. Paso 6: buscar uno con `@PathVariable`

## El código

java

```java
// GET http://localhost:8081/api/mvc/events/5
@GetMapping("/{id}")
public String findById(Model model, @PathVariable Integer id) {

    // el servicio devuelve Optional<Event>
    Event event = eventService.findById(id).orElse(null);

    if (event == null) {
        model.addAttribute("error", "Evento no encontrado");
        return "redirect:/mvc/events";
    }

    model.addAttribute("events", List.of(event));   // la plantilla espera una lista
    return "events/list";
}
```

## 🔍 Explicación

### `@PathVariable Integer id`

El `{id}` de la ruta se convierte automáticamente al tipo declarado. Si alguien pide `/mvc/events/abc`, Spring no puede convertir `"abc"` a `Integer` y responde **400 Bad Request** antes de entrar al método.

### Manejo del `Optional`

En la Parte 2 vimos que `findById` devuelve `Optional<Event>`. Aquí se resuelve con `.orElse(null)` y una comprobación:

java

```java
Event event = eventService.findById(id).orElse(null);if (event == null) { ... }
```

También podría usarse `.orElseThrow(...)` dentro de un `try/catch`. Ambas formas aparecen en el código de referencia.

### `List.of(event)`

La plantilla `events/list.html` tiene un `th:each` que espera una **colección**. Como aquí solo hay un evento, se envuelve en una lista de un elemento para reutilizar la misma plantilla.

Es un truco práctico de MVC: **una sola plantilla sirve para listar todo, listar filtrado y mostrar uno**.

### `redirect:` — el prefijo que cambia todo

java

```java
return "events/list";           // → renderiza templates/events/list.html
return "redirect:/mvc/events";  // → manda un 302 al navegador para que vaya a esa URL
```

Con `redirect:`, el `String` **ya no es un nombre de plantilla, es una URL**. El navegador hace una petición nueva.

> ⚠️ Ojo con este código: el `model.addAttribute("error", ...)` seguido de un `redirect:` **no funciona**. El `Model` se pierde al redirigir porque la petición siguiente es otra. Para que el mensaje sobreviva hace falta `RedirectAttributes`, que veremos en el Paso 8.
> 

---

# 7. Paso 7: filtros de búsqueda

## Filtrar por un atributo propio

java

```java
// GET http://localhost:8081/api/mvc/events/search_title?title=jazz
@GetMapping("/search_title")
public String findByTitleLike(Model model, @RequestParam String title) {

    model.addAttribute("events",
            eventService.findByTitleContainingIgnoreCase(title));

    return "events/list";
}
```

Aquí `@RequestParam String title` **sin `defaultValue` ni `required=false`** es obligatorio: si falta, 400.

Y el formulario que lo llama:

html

```html
<form th:action="@{/mvc/events/search_title}" method="get">
    <input type="text" name="title" placeholder="Buscar por título">
    <button type="submit">Buscar</button>
</form>
```

El `name="title"` del input es el que se convierte en `?title=...`, y ese es el nombre que recibe `@RequestParam String title`. **Tienen que coincidir.**

## Filtrar por una relación

Aquí se conecta con lo aprendido en la Parte 2: los métodos derivados que navegan relaciones.

java

```java
// GET http://localhost:8081/api/mvc/events/zone/2
@GetMapping("/zone/{zoneId}")
public String findByZone(Model model, @PathVariable Integer zoneId) {
    model.addAttribute("events", eventService.findByZone_Id(zoneId));
    return "events/list";
}

// GET http://localhost:8081/api/mvc/events/author/3
@GetMapping("/author/{authorId}")
public String findByAuthor(Model model, @PathVariable Integer authorId) {
    model.addAttribute("events", eventService.findByAuthor_Id(authorId));
    return "events/list";
}
```

Que en el repositorio son simplemente:

java

```java
List<Event> findByZone_Id(Integer zoneId);
List<Event> findByAuthor_Id(Integer authorId);
List<Event> findByTitleContainingIgnoreCase(String title);
```

> 🔑 **Nota la decisión de diseño:** aquí se usó `@PathVariable` (`/zone/2`) y no `@RequestParam` (`?zoneId=2`). Ambas funcionan. La convención MVC tiende a rutas semánticas; la convención REST prefiere `?zoneId=2` porque es un filtro, no un recurso. En el Bloque 2 lo cambiaremos a `@RequestParam`.
> 

---

# 8. Paso 8: crear (formulario + guardado)

Aquí aparece la diferencia estructural más grande entre MVC y REST.

## Un formulario necesita DOS endpoints

```
GET  /mvc/events/new    → devuelve el HTML del formulario vacío
POST /mvc/events        → recibe los datos escritos y los guarda
```

En REST bastaría un solo `POST /rest/events`, porque no hay que pintar nada.

## Endpoint 1: mostrar el formulario (GET)

java

```java
@GetMapping("/new")
public String showCreateForm(Model model) {

    // objeto vacío al que el formulario le irá poniendo los datos
    model.addAttribute("event", new Event());

    // se inyectan las zonas y los usuarios para llenar los <select>
    model.addAttribute("zones", zoneService.findAll());
    model.addAttribute("managers", userService.findAll(0, 50).getContent());

    return "events/form";
}
```

### 🔍 Por qué se inyecta un `new Event()` vacío

Thymeleaf usa `th:object="${event}"` para enlazar cada input a un campo del objeto. Sin un objeto en el Model, el formulario no puede enlazarse y lanza error al renderizar.

### 🔍 Por qué se inyectan `zones` y `managers`

Son las **relaciones**. El usuario no escribe el id de la zona a mano: elige de un desplegable. Para pintar ese desplegable hace falta la lista de zonas disponibles.

Esto revela algo importante: **el controlador MVC tiene que preparar todo lo que la vista necesita**, no solo el objeto principal.

## Endpoint 2: procesar el guardado (POST)

java

```java
@PostMapping
public String createEvent(@ModelAttribute Event event,
                          @RequestParam(required = false) Integer zoneId,
                          RedirectAttributes redirectAttributes) {
    try {
        // la relación se asigna a partir del id que llegó del <select>
        if (zoneId != null) {
            Zone zone = zoneService.findById(zoneId)
                    .orElseThrow(() -> new RuntimeException("Zona no encontrada"));
            event.setZone(zone);
        }

        eventService.save(event);
        redirectAttributes.addFlashAttribute("success", "Evento creado correctamente");

    } catch (Exception e) {
        redirectAttributes.addFlashAttribute("error",
                "Error al crear el evento: " + e.getMessage());
    }
    return "redirect:/mvc/events";
}
```

## 🔍 Explicación de los tres conceptos nuevos

### `@ModelAttribute`

Toma los campos de un formulario HTML y los mete en un objeto Java.

html

```html
<form method="post" action="/mvc/events">
    <input type="text" name="title">        <!-- → event.setTitle(...) -->
    <input type="text" name="description">  <!-- → event.setDescription(...) -->
</form>
```

Spring hace `new Event()` y llama a los setters cuyo nombre coincida con el `name` de cada input.

|  | `@ModelAttribute` | `@RequestBody` |
| --- | --- | --- |
| Formato de entrada | `application/x-www-form-urlencoded` | `application/json` |
| Se usa en | MVC | REST |
| Origen | Un `<form>` HTML | `fetch()`, axios, Postman |

### Las relaciones se envían como IDs

Fíjate en el patrón: el `<select>` manda un `zoneId` (un número), el controlador lo recibe con `@RequestParam Integer zoneId`, busca la `Zone` real y hace `event.setZone(zone)`.

**Nunca se envía el objeto `Zone` completo desde el HTML.**

> 🔑 **Recuerda este patrón.** Es exactamente el mismo que usarán los DTOs en el Bloque 2: el cliente maneja **IDs**, el servidor resuelve las **entidades**. Lo que en MVC hace el `<select name="zoneId">`, en REST lo hará el campo `private Integer zoneId` del DTO.
> 

### `redirect:` y el patrón POST-Redirect-GET

**¿Por qué no renderizar la lista directamente después de guardar?**

Por el problema del **doble envío**. Si después del `save()` devuelves `"events/list"`, la URL del navegador sigue siendo `POST /mvc/events`. Si el usuario recarga con F5, el navegador **reenvía el POST y crea el evento otra vez**.

```
❌ SIN redirect                          ✅ CON redirect
POST /mvc/events                         POST /mvc/events
    ↓ guarda                                 ↓ guarda
    ↓ renderiza la lista                     ↓ responde 302 → /mvc/events
URL del navegador: POST /mvc/events      GET /mvc/events
F5 → reenvía el POST → DUPLICADO         URL del navegador: GET /mvc/events
                                         F5 → solo recarga la lista ✅
```

Este patrón se llama **POST-Redirect-GET** y es obligatorio en MVC.

### `RedirectAttributes` y los flash attributes

El problema: al redirigir, **el `Model` se pierde**.

java

```java
model.addAttribute("success", "Creado");                     // ❌ se pierde
redirectAttributes.addFlashAttribute("success", "Creado");   // ✅ sobrevive
```

Un *flash attribute* se guarda temporalmente en la sesión, se entrega en la siguiente petición y **se borra solo**. Exactamente lo que se necesita para mensajes de "guardado correctamente".

| Método | Qué hace |
| --- | --- |
| `addFlashAttribute("k", v)` | Sobrevive el redirect, no aparece en la URL. Para mensajes. |
| `addAttribute("k", v)` | Se añade como query param: `/mvc/events?k=v`. Para filtros. |

Y en la plantilla:

html

```html
<div th:if="${success}" th:text="${success}" style="color:green"></div>
<div th:if="${error}"   th:text="${error}"   style="color:red"></div>
```

---

# 9. Paso 9: editar

Mismo patrón de dos endpoints, pero el formulario llega precargado.

## Mostrar el formulario con los datos (GET)

java

```java
@GetMapping("/edit/{id}")
public String showEditForm(@PathVariable Integer id, Model model,
                           RedirectAttributes redirectAttributes) {
    try {
        Event event = eventService.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado"));

        model.addAttribute("event", event);       // ← ahora sí tiene datos
        model.addAttribute("zones", zoneService.findAll());
        model.addAttribute("managers", userService.findAll(0, 50).getContent());

        return "events/form";                     // ← LA MISMA plantilla que crear

    } catch (RuntimeException e) {
        redirectAttributes.addFlashAttribute("error", e.getMessage());
        return "redirect:/mvc/events";
    }
}
```

La única diferencia con `showCreateForm` es que en vez de `new Event()` se pone el evento traído de la base de datos.

## Procesar la actualización (POST)

java

```java
@PostMapping("/update/{id}")
public String updateEvent(@PathVariable Integer id,
                          @ModelAttribute Event event,
                          RedirectAttributes redirectAttributes) {
    try {
        eventService.updateEvent(id, event);
        redirectAttributes.addFlashAttribute("success", "Evento actualizado correctamente");
    } catch (RuntimeException e) {
        redirectAttributes.addFlashAttribute("error", e.getMessage());
    }
    return "redirect:/mvc/events";
}
```

## 🔍 Por qué POST y no PUT

html

```html
<form method="put">   <!-- ❌ NO EXISTE. El navegador lo trata como GET -->
```

Los `<form>` HTML **solo soportan `GET` y `POST`**. Por eso en MVC:

```
Actualizar → POST /mvc/events/update/{id}   (en vez de PUT /mvc/events/{id})
Eliminar   → POST /mvc/events/delete/{id}   (en vez de DELETE /mvc/events/{id})
```

Y por eso las URLs de MVC **llevan verbos** (`/new`, `/edit`, `/update`, `/delete`), rompiendo la nomenclatura REST.

> 📌 **Eso está bien.** MVC no pretende ser REST: son dos estilos con reglas distintas. Cuando pasemos a REST en el Bloque 2, las URLs se limpiarán y los verbos desaparecerán.
> 
> 
> Existe un filtro (`HiddenHttpMethodFilter`) que permite simular PUT y DELETE con un campo oculto `<input type="hidden" name="_method" value="put">`, pero es más simple usar POST.
> 

## Una sola plantilla para crear y editar

`templates/events/form.html`:

html

```html
<form th:action="${event.id == null}
                 ? @{/mvc/events}
                 : @{/mvc/events/update/{id}(id=${event.id})}"
      method="post"
      th:object="${event}">

    <label>Título</label>
    <input type="text" th:field="*{title}">

    <label>Descripción</label>
    <input type="text" th:field="*{description}">

    <!-- Relación: se envía solo el ID -->
    <label>Zona</label>
    <select name="zoneId">
        <option th:each="z : ${zones}"
                th:value="${z.id}"
                th:text="${z.name}"
                th:selected="${event.zone != null and event.zone.id == z.id}">
        </option>
    </select>

    <button type="submit">Guardar</button>
</form>
```

- `th:object="${event}"` enlaza el formulario al objeto del Model.
- `th:field="*{title}"` genera a la vez `name="title"`, `id="title"` y `value="..."` con el valor actual. El `{...}` es "relativo al `th:object`".
- Si `event.id` es `null` → apunta a crear. Si no → a actualizar.

---

# 10. Paso 10: eliminar

java

```java
@PostMapping("/delete/{id}")
public String deleteEvent(@PathVariable Integer id,
                          RedirectAttributes redirectAttributes) {
    try {
        eventService.deleteById(id);
        redirectAttributes.addFlashAttribute("success", "Evento eliminado correctamente");
    } catch (RuntimeException e) {
        redirectAttributes.addFlashAttribute("error", e.getMessage());
    }
    return "redirect:/mvc/events";
}
```

En el HTML, como no se puede usar `method="delete"`, se hace con un formulario POST:

html

```html
<form th:action="@{/mvc/events/delete/{id}(id=${event.id})}" method="post"
      onsubmit="return confirm('¿Seguro que deseas eliminar este evento?');">
    <button type="submit">Eliminar</button>
</form>
```

> 🔑 **Aquí es donde se paga lo aprendido en la Parte 1.** Si `Event` tiene `schedules` y `attendees` con `cascade = CascadeType.ALL, orphanRemoval = true`, al borrar el evento se borran sus horarios y asistentes automáticamente. Si faltara ese cascade, MySQL lanzaría:
> 
> 
> ```
> Cannot delete or update a parent row: a foreign key constraint fails
> ```
> 
> y el `catch` mostraría ese mensaje al usuario. El modelo y el controlador no son mundos separados.
> 

---

# 11. El controlador MVC completo

Todos los pasos juntos:

java

```java
package com.example.eventos.controller.mvc;

import com.example.eventos.model.Event;
import com.example.eventos.model.Zone;
import com.example.eventos.service.EventService;
import com.example.eventos.service.UserService;
import com.example.eventos.service.ZoneService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/mvc/events")
@RequiredArgsConstructor
public class MvcEventController {

    private final EventService eventService;
    private final ZoneService zoneService;
    private final UserService userService;

    // ───────── PRUEBA DE CONEXIÓN ─────────
    // GET /api/mvc/events/ping
    @GetMapping("/ping")
    @ResponseBody
    public String ping() {
        return "pong";
    }

    // ───────── LISTAR CON PAGINACIÓN ─────────
    // GET /api/mvc/events?offset=0&pageSize=5
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public String findAll(Model model,
                          @RequestParam(defaultValue = "0") int offset,
                          @RequestParam(defaultValue = "5") int pageSize) {

        Page<Event> page = eventService.findAll(offset, pageSize);
        model.addAttribute("events", page.getContent());
        model.addAttribute("page", page);
        return "events/list";
    }

    // ───────── BUSCAR UNO ─────────
    // GET /api/mvc/events/5
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ')")
    public String findById(Model model, @PathVariable Integer id,
                           RedirectAttributes redirectAttributes) {

        Event event = eventService.findById(id).orElse(null);
        if (event == null) {
            redirectAttributes.addFlashAttribute("error", "Evento no encontrado");
            return "redirect:/mvc/events";
        }
        model.addAttribute("events", List.of(event));
        return "events/list";
    }

    // ───────── FILTRAR POR TÍTULO ─────────
    // GET /api/mvc/events/search_title?title=jazz
    @GetMapping("/search_title")
    @PreAuthorize("hasAuthority('READ')")
    public String findByTitleLike(Model model, @RequestParam String title) {
        model.addAttribute("events", eventService.findByTitleContainingIgnoreCase(title));
        return "events/list";
    }

    // ───────── FILTRAR POR ZONA (relación) ─────────
    // GET /api/mvc/events/zone/2
    @GetMapping("/zone/{zoneId}")
    @PreAuthorize("hasAuthority('READ')")
    public String findByZone(Model model, @PathVariable Integer zoneId) {
        model.addAttribute("events", eventService.findByZone_Id(zoneId));
        return "events/list";
    }

    // ───────── FILTRAR POR AUTOR (relación) ─────────
    // GET /api/mvc/events/author/3
    @GetMapping("/author/{authorId}")
    @PreAuthorize("hasAuthority('READ')")
    public String findByAuthor(Model model, @PathVariable Integer authorId) {
        model.addAttribute("events", eventService.findByAuthor_Id(authorId));
        return "events/list";
    }

    // ───────── FORMULARIO DE CREACIÓN ─────────
    // GET /api/mvc/events/new
    @GetMapping("/new")
    @PreAuthorize("hasAuthority('WRITE')")
    public String showCreateForm(Model model) {
        model.addAttribute("event", new Event());
        model.addAttribute("zones", zoneService.findAll());
        model.addAttribute("managers", userService.findAll(0, 50).getContent());
        return "events/form";
    }

    // ───────── GUARDAR ─────────
    // POST /api/mvc/events
    @PostMapping
    @PreAuthorize("hasAuthority('WRITE')")
    public String createEvent(@ModelAttribute Event event,
                              @RequestParam(required = false) Integer zoneId,
                              RedirectAttributes redirectAttributes) {
        try {
            if (zoneId != null) {
                Zone zone = zoneService.findById(zoneId)
                        .orElseThrow(() -> new RuntimeException("Zona no encontrada"));
                event.setZone(zone);
            }
            eventService.save(event);
            redirectAttributes.addFlashAttribute("success", "Evento creado correctamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error",
                    "Error al crear el evento: " + e.getMessage());
        }
        return "redirect:/mvc/events";
    }

    // ───────── FORMULARIO DE EDICIÓN ─────────
    // GET /api/mvc/events/edit/5
    @GetMapping("/edit/{id}")
    @PreAuthorize("hasAuthority('UPDATE')")
    public String showEditForm(@PathVariable Integer id, Model model,
                               RedirectAttributes redirectAttributes) {
        try {
            Event event = eventService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Evento no encontrado"));
            model.addAttribute("event", event);
            model.addAttribute("zones", zoneService.findAll());
            model.addAttribute("managers", userService.findAll(0, 50).getContent());
            return "events/form";
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/mvc/events";
        }
    }

    // ───────── ACTUALIZAR ─────────
    // POST /api/mvc/events/update/5
    @PostMapping("/update/{id}")
    @PreAuthorize("hasAuthority('UPDATE')")
    public String updateEvent(@PathVariable Integer id,
                              @ModelAttribute Event event,
                              RedirectAttributes redirectAttributes) {
        try {
            eventService.updateEvent(id, event);
            redirectAttributes.addFlashAttribute("success", "Evento actualizado correctamente");
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }
        return "redirect:/mvc/events";
    }

    // ───────── ELIMINAR ─────────
    // POST /api/mvc/events/delete/5
    @PostMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('DELETE')")
    public String deleteEvent(@PathVariable Integer id,
                              RedirectAttributes redirectAttributes) {
        try {
            eventService.deleteById(id);
            redirectAttributes.addFlashAttribute("success", "Evento eliminado correctamente");
        } catch (RuntimeException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }
        return "redirect:/mvc/events";
    }
}
```

## 📊 Resumen de las rutas MVC

| Método | Ruta | Qué hace | Devuelve |
| --- | --- | --- | --- |
| GET | `/mvc/events/ping` | Prueba de conexión | Texto `pong` |
| GET | `/mvc/events` | Lista paginada | `events/list` |
| GET | `/mvc/events/{id}` | Uno solo | `events/list` |
| GET | `/mvc/events/search_title?title=` | Filtra por título | `events/list` |
| GET | `/mvc/events/zone/{zoneId}` | Filtra por zona | `events/list` |
| GET | `/mvc/events/new` | Formulario vacío | `events/form` |
| POST | `/mvc/events` | Crea | `redirect:/mvc/events` |
| GET | `/mvc/events/edit/{id}` | Formulario con datos | `events/form` |
| POST | `/mvc/events/update/{id}` | Actualiza | `redirect:/mvc/events` |
| POST | `/mvc/events/delete/{id}` | Elimina | `redirect:/mvc/events` |

Diez endpoints, **tres plantillas** (`list`, `form`, y las de error), y todo trabajando **directamente con la entidad `Event`**. Sin DTOs, sin mappers, sin conversiones. Ese es el punto: MVC deja ver el flujo completo sin capas intermedias.

---

# 12. Paso 11: login MVC y JSESSIONID

## El controlador de login es sorprendentemente pequeño

java

```java
package com.example.eventos.controller.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller("mvcAuthController")
@RequestMapping("/mvc/auth")
public class AuthController {

    // GET /mvc/auth/login → solo entrega el formulario
    @GetMapping("/login")
    public String getLogin() {
        return "login";   // templates/login.html
    }
}
```

**No hay un método POST de login.** El `POST` lo intercepta Spring Security **antes** de llegar a ningún controlador. Tú solo entregas el HTML.

Y una ruta pública para verificar que la app responde sin autenticación:

java

```java
@Controller
@RequestMapping("/mvc/public")
public class HelloController {

    @GetMapping
    public String getHello() {
        return "hello";   // templates/hello.html
    }
}
```

## La plantilla de login

html

```html
<!-- templates/login.html -->
<form th:action="@{/mvc/auth/login}" method="post">
    <input type="text"     name="username" placeholder="Usuario">
    <input type="password" name="password" placeholder="Contraseña">
    <button type="submit">Entrar</button>
</form>
```

> ⚠️ Los campos **deben** llamarse `username` y `password`, o hay que declararlo con `.usernameParameter(...)` y `.passwordParameter(...)` en la configuración. No es opcional.
> 

## Cómo funciona la sesión con JSESSIONID

```
1. El usuario envía usuario + contraseña a POST /mvc/auth/login
                          ↓
2. Spring Security valida contra la BD (BCrypt compara el hash)
                          ↓
3. Si son correctos, CREA UN OBJETO EN LA MEMORIA DEL SERVIDOR
   sesión "A1B2C3" → { usuario: "ana", permisos: [READ, WRITE] }
                          ↓
4. Responde con la cabecera:
   Set-Cookie: JSESSIONID=A1B2C3; HttpOnly; Path=/
                          ↓
5. El navegador guarda la cookie AUTOMÁTICAMENTE
                          ↓
6. En CADA petición siguiente, el navegador la manda solo:
   Cookie: JSESSIONID=A1B2C3
                          ↓
7. El servidor busca "A1B2C3" en su memoria y recupera quién es
```

**El punto clave:** la cookie no contiene los datos del usuario. Contiene **una llave** que apunta a datos guardados **en la memoria del servidor**. Por eso esto es **stateful**: el servidor recuerda cosas entre peticiones.

## Ventajas y desventajas

| ✅ Ventajas | ❌ Desventajas |
| --- | --- |
| El navegador maneja la cookie solo, sin JavaScript | El servidor consume memoria por cada usuario conectado |
| Cerrar sesión es inmediato y real | Con varios servidores, la sesión no se comparte |
| `HttpOnly` protege la cookie de XSS | Vulnerable a CSRF (hay que dejar la protección activa) |
| Los permisos siempre están actualizados | No sirve para apps móviles ni para otras APIs |

> 🔑 **El problema de escalar:** con 3 servidores detrás de un balanceador, si el usuario inicia sesión en el servidor A, su sesión vive **solo en la memoria de A**. Si la siguiente petición cae en B, aparece como no autenticado.
> 
> 
> Se soluciona con *sticky sessions* o replicando la sesión en Redis, pero eso agrega complejidad. **JWT nació para resolver exactamente esto**, y lo veremos en el Bloque 3.
> 

# 🟨 BLOQUE 2 — De MVC a REST

Ya tenemos un controlador MVC funcionando. Ahora lo convertimos en REST **paso a paso**, y en cada paso aparece un problema nuevo que justifica la pieza siguiente.

```
Paso 1: cambiar @Controller por @RestController
            ↓
Paso 2: ⚠️ aparecen 4 problemas al devolver entidades
            ↓
Paso 3: los DTOs los resuelven
            ↓
Paso 4: pero convertir entidad↔DTO a mano es insostenible
            ↓
Paso 5: MapStruct lo automatiza
            ↓
Pasos 6-7: ResponseEntity y CORS terminan de adaptarlo
```

---

# 1. Paso 1: cambiar la anotación

## Qué cambia

```java
// ANTES (MVC)                          // DESPUÉS (REST)
@Controller                             @RestController
@RequestMapping("/mvc/events")          @RequestMapping("/rest/events")
```

Con ese cambio, **todo lo que devuelva un método deja de interpretarse como nombre de vista y se serializa a JSON**.

## Lo que deja de existir

| Ya no se usa | Por qué |
| --- | --- |
| `Model model` | No hay plantilla que rellenar |
| `return "events/list"` | No hay vistas |
| `redirect:` | No hay navegación de páginas |
| `RedirectAttributes` | No hay mensajes flash |
| `@ModelAttribute` | Los datos llegan como JSON, no como formulario |
| Los dos endpoints `/new` y `/edit/{id}` | No hay formularios que pintar |
| Los verbos en las URLs (`/update/`, `/delete/`) | Ahora el método HTTP dice la acción |

## Lo que aparece

| Aparece | Para qué |
| --- | --- |
| `@RequestBody` | Recibir JSON |
| `ResponseEntity<T>` | Controlar el código de estado |
| `@PutMapping`, `@DeleteMapping` | Ya no hay limitación de formularios HTML |
| `@CrossOrigin` | Permitir peticiones desde otro origen |
| **DTOs y mappers** | Pasos 3 a 5 |

## Primera versión REST (ingenua)

Traducción directa del controlador MVC, todavía **devolviendo entidades**:

```java
@RestController
@RequestMapping("/rest/events")
@RequiredArgsConstructor
public class RestEventController {

    private final EventService eventService;
    private final ZoneService zoneService;

    // GET /rest/events
    @GetMapping
    public Page<Event> findAll(@RequestParam(defaultValue = "0")  int offset,
                               @RequestParam(defaultValue = "10") int limit) {
        return eventService.findAll(offset, limit);
    }

    // GET /rest/events/5
    @GetMapping("/{id}")
    public Event findById(@PathVariable Integer id) {
        return eventService.findById(id).orElse(null);
    }

    // POST /rest/events
    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventService.save(event);
    }
}
```

Compila, arranca y responde. **Y está mal.** El Paso 2 explica por qué.

### Diferencias visibles ya en esta versión

|  | MVC | REST |
| --- | --- | --- |
| Formularios | 2 endpoints (`/new` + POST) | 1 endpoint (`POST`) |
| Actualizar | `POST /mvc/events/update/5` | `PUT /rest/events/5` |
| Eliminar | `POST /mvc/events/delete/5` | `DELETE /rest/events/5` |
| Filtrar por zona | `GET /mvc/events/zone/2` | `GET /rest/events?zoneId=2` |
| Error | Redirige con mensaje | Devuelve código 404 |

Fíjate en el filtro: en REST se prefiere `?zoneId=2` porque **filtrar no es identificar un recurso**. Las URLs quedan más limpias y consistentes.

---

# 2. Paso 2: el problema de devolver entidades

En MVC, devolver la entidad era perfectamente seguro: Thymeleaf pintaba solo los campos que la plantilla pedía. En REST, Jackson **serializa todo lo que encuentra**. Eso cambia las reglas por completo.

Esto es lo que sale realmente de `GET /rest/events/5`:

```json
{
  "id": 5,
  "title": "Concierto de Jazz",
  "description": "Noche de jazz",
  "startDate": "2026-03-15T20:00:00.000+00:00",
  "endDate": "2026-03-15T23:00:00.000+00:00",
  "author": {
    "id": 1,
    "userName": "ana",
    "password": "$2a$10$ODaRgGwE/i2RwUQlaUqhteBvNSzQSV4I5TVnRlY...",  ← 🚨
    "deleted": false,
    "role": {
      "id": 2,
      "name": "ORGANIZER",
      "rolePermissions": [ { "id": 1, "permission": { ... } }, ... ],
      "users": [ { "id": 1, "userName": "ana", "createdEvents": [ ... ∞
```

## Los cuatro problemas

### 🚨 Problema 1: fuga de datos sensibles

`password` sale en el JSON. En MVC nunca pasó porque la plantilla simplemente no lo pintaba. Aquí, basta olvidar un `@JsonIgnore` para filtrar hashes de contraseñas a cualquiera que llame al endpoint.

### 🚨 Problema 2: recursión infinita

`Event` → `author` → `createdEvents` → `Event` → `author` → … `StackOverflowError`, o un JSON de varios megabytes.

En la Parte 1 lo tapamos con `@JsonIgnore`. Funciona, pero es un parche: obliga a decorar las **entidades** pensando en cómo se ven en la API, mezclando dos responsabilidades que deberían estar separadas.

### 🚨 Problema 3: el cliente puede enviar lo que quiera

Con `@RequestBody Event event`, alguien puede mandar:

```json
{
  "title": "Mi evento",
  "id": 5,
  "author": { "id": 1, "role": { "id": 1, "name": "ADMIN" } }
}
```

Y si lo guardas tal cual, acaba de **sobrescribir el evento 5** y de tocar datos que nunca debió tocar. La entidad expone **todos** sus setters a cualquiera.

### 🚨 Problema 4: acoplamiento con la base de datos

Si mañana renombras `title` a `eventTitle` en la entidad, **el frontend se rompe** sin que nadie se entere hasta que un usuario lo reporte. La API queda amarrada a la estructura de las tablas.

## La conclusión

> 🔑 **La entidad es un objeto de persistencia, no un objeto de comunicación.** Sirve para hablar con la base de datos. Para hablar con el cliente hace falta otra cosa.
> 
> 
> Esa otra cosa es el **DTO**.
> 

Y aquí está la razón de fondo por la que empezamos con MVC: **estos cuatro problemas simplemente no existían ahí**. Solo aparecen cuando el objeto sale del servidor convertido en JSON. Entender el controlador primero sin ellos y encontrárselos después hace que la solución tenga sentido, en vez de parecer una capa más “porque sí”.

---

# 3. Paso 3: los DTOs

## Qué es un DTO

Un **DTO** (*Data Transfer Object*) es una clase plana, **sin anotaciones JPA**, con solo los campos que una operación concreta necesita.

```
        ENTRADA                                     SALIDA
Cliente ──JSON──► DTOeventRequest           Event ──► DTOeventResponse ──JSON──► Cliente
                        │                      ▲
                        ▼                      │
                      Event ──► Service ──►   BD
```

## Dos DTOs por entidad, no uno

|  | **Request DTO** | **Response DTO** |
| --- | --- | --- |
| Dirección | Cliente → servidor | Servidor → cliente |
| Se usa en | `@RequestBody` | Tipo de retorno |
| Contiene | Solo lo que el cliente **puede** modificar | Solo lo que el cliente **debe** ver |
| Nunca lleva | `id`, `deleted`, campos calculados | `password`, listas de relaciones |
| Relaciones | Como **IDs** (`zoneId`) | Como **valores planos** (`zoneName`) |

Son distintos porque las necesidades son distintas: al **crear** un evento el cliente manda `zoneId`, pero al **leerlo** quiere ver `zoneName`. Un solo DTO tendría que llevar ambos y siempre habría campos sobrando.

## DTOs de `Event`

```java
package com.example.eventos.dto.event;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
public class DTOeventRequest {

    private String title;
    private String description;
    private Timestamp startDate;
    private Timestamp endDate;

    // Las TRES relaciones llegan como IDs
    private Integer authorId;
    private Integer managerId;
    private Integer zoneId;

    // NO hay id        → lo asigna la base de datos
    // NO hay schedules ni attendees → se gestionan por sus propios endpoints
}
```

```java
package com.example.eventos.dto.event;

@Data
@NoArgsConstructor
public class DTOeventResponse {

    private Integer id;              // sí sale: el cliente lo necesita para editar/borrar
    private String title;
    private String description;
    private Timestamp startDate;
    private Timestamp endDate;

    // Relaciones APLANADAS: lo justo para pintar una tabla
    private String authorUserName;
    private String managerUserName;
    private String zoneName;
    private Integer zoneCapacity;
}
```

## DTOs de `User`

```java
@Data
@NoArgsConstructor
public class DTOuserRequest {
    private String userName;
    private String name;
    private String lastName;
    private String password;    // ENTRA (para crear), pero NUNCA sale
    private Integer age;
    private Integer roleId;     // la relación, como ID
}
```

```java
@Data
@NoArgsConstructor
public class DTOuserResponse {
    private Integer id;
    private String userName;
    private String name;
    private String lastName;
    private Integer age;
    private String roleName;    // relación aplanada

    // NO hay password  ← la razón principal de existir de este DTO
    // NO hay deleted
    // NO hay listas    ← cero riesgo de recursión infinita
}
```

## El resultado

```json
// ❌ Devolviendo la entidad Event
{
  "id": 5, "title": "Concierto de Jazz",
  "author": { "id": 1, "userName": "ana", "password": "$2a$10$OD...",
              "role": { "rolePermissions": [ ... ∞ ... ] } }
}

// ✅ Devolviendo DTOeventResponse
{
  "id": 5,
  "title": "Concierto de Jazz",
  "description": "Noche de jazz",
  "startDate": "2026-03-15T20:00:00.000+00:00",
  "endDate": "2026-03-15T23:00:00.000+00:00",
  "authorUserName": "ana",
  "managerUserName": "carlos",
  "zoneName": "Auditorio A",
  "zoneCapacity": 300
}
```

Los cuatro problemas resueltos de una vez:

| Problema | Cómo lo resuelve el DTO |
| --- | --- |
| 🚨 Fuga de datos | `password` no existe en el DTO. Imposible filtrarlo. |
| 🚨 Recursión infinita | No hay relaciones anidadas, solo `String` planos. |
| 🚨 Cliente manda lo que quiera | `DTOeventRequest` no tiene `id`. Aunque lo mande, Jackson lo descarta. |
| 🚨 Acoplamiento | Renombrar un campo de la entidad no cambia el JSON: solo el mapeo. |

## 🔑 El patrón de las relaciones (el mismo del formulario MVC)

```
MVC:   <select name="zoneId">  →  @RequestParam Integer zoneId  →  buscar Zone  →  setZone()
REST:  { "zoneId": 2 }         →  DTO.getZoneId()               →  buscar Zone  →  setZone()
```

**Es exactamente la misma idea.** El cliente maneja **IDs**, el servidor resuelve las **entidades**. Lo que en MVC hacía el `<select>`, en REST lo hace el campo `private Integer zoneId` del DTO.

Por eso se dice que el DTO es “el formulario de la API”: define qué campos puede llenar el cliente, igual que un `<form>` define qué puede escribir el usuario.

---

# 4. Paso 4: convertir a mano (y por qué duele)

Ahora hay un trabajo nuevo: **convertir entre entidad y DTO**. Veamos primero cómo se hace sin herramientas, porque de ahí sale la justificación del paso siguiente.

## Opción A: métodos de conversión dentro del DTO

Es lo más natural: se le pone al DTO un método de fábrica y un constructor.

```java
@Data
@NoArgsConstructor
public class DTOeventResponse {

    private Integer id;
    private String title;
    private String description;
    private Timestamp startDate;
    private Timestamp endDate;
    private String authorUserName;
    private String managerUserName;
    private String zoneName;
    private Integer zoneCapacity;

    // ── CONSTRUCTOR DE CONVERSIÓN ──
    public DTOeventResponse(Event event) {
        this.id          = event.getId();
        this.title       = event.getTitle();
        this.description = event.getDescription();
        this.startDate   = event.getStartDate();
        this.endDate     = event.getEndDate();

        // hay que comprobar null en CADA relación
        this.authorUserName  = event.getAuthor()  != null ? event.getAuthor().getUserName()  : null;
        this.managerUserName = event.getManager() != null ? event.getManager().getUserName() : null;
        this.zoneName        = event.getZone()    != null ? event.getZone().getName()        : null;
        this.zoneCapacity    = event.getZone()    != null ? event.getZone().getCapacity()    : null;
    }

    // ── MÉTODO DE FÁBRICA ──
    public static DTOeventResponse fromEntity(Event event) {
        return new DTOeventResponse(event);
    }
}
```

Y en el request, el camino inverso:

```java
@Data
@NoArgsConstructor
public class DTOeventRequest {

    private String title;
    private String description;
    private Timestamp startDate;
    private Timestamp endDate;
    private Integer authorId;
    private Integer managerId;
    private Integer zoneId;

    // ── CONVERSIÓN A ENTIDAD ──
    public Event toEntity() {
        Event event = new Event();
        event.setTitle(this.title);
        event.setDescription(this.description);
        event.setStartDate(this.startDate);
        event.setEndDate(this.endDate);
        // las relaciones NO: el DTO no puede consultar la base de datos
        return event;
    }

    // ── ACTUALIZACIÓN PARCIAL ──
    public void updateEntity(Event event) {
        if (this.title != null)       event.setTitle(this.title);
        if (this.description != null) event.setDescription(this.description);
        if (this.startDate != null)   event.setStartDate(this.startDate);
        if (this.endDate != null)     event.setEndDate(this.endDate);
    }
}
```

Uso en el controlador:

```java
return ResponseEntity.ok(DTOeventResponse.fromEntity(event));
```

## ⚠️ Por qué esto no escala

**1. El DTO deja de ser un DTO.** Debería ser una clase plana de datos. Ahora tiene lógica, conoce la entidad y sabe convertirse. Se acopló a lo que debía desacoplar.

**2. Son tres métodos por DTO, y dos DTOs por entidad.** Con las 8 entidades de la app de eventos:

```
8 entidades × 2 DTOs × ~3 métodos = ~48 métodos de conversión escritos a mano
```

**3. Cada campo nuevo obliga a tocar tres archivos.** Agregas `capacity` a `Event`: hay que acordarse de añadirlo al request, al response, al constructor de conversión, al `toEntity` y al `updateEntity`. **Si olvidas uno, el campo llega como `null` y no hay ningún error**: solo un dato que desaparece misteriosamente.

**4. Las comprobaciones de `null` se multiplican.** Cada relación aplanada necesita su `!= null ? ... : null`. Con tres relaciones son seis ternarios en un solo constructor.

**5. La actualización parcial es un muro de `if`.**

```java
if (request.getTitle() != null)       existing.setTitle(request.getTitle());
if (request.getDescription() != null) existing.setDescription(request.getDescription());
if (request.getStartDate() != null)   existing.setStartDate(request.getStartDate());
if (request.getEndDate() != null)     existing.setEndDate(request.getEndDate());
// ... uno por cada campo, en cada entidad
```

## Opción B: una clase mapper escrita a mano

Se puede sacar la lógica del DTO a una clase aparte:

```java
@Component
public class EventMapperManual {

    public DTOeventResponse toResponse(Event event) {
        DTOeventResponse dto = new DTOeventResponse();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        // ... y todo lo demás igual
        return dto;
    }
}
```

Mejora el problema 1 (el DTO vuelve a ser plano), pero **los problemas 2, 3, 4 y 5 siguen intactos**: sigue habiendo cientos de líneas de `setX(getX())` que hay que mantener a mano.

> 🔑 **Ese es exactamente el problema que resuelve MapStruct:** genera todos esos `setX(getX())` automáticamente, para que **los DTOs vuelvan a ser clases planas sin ningún método de conversión ni constructor especial**.
> 

---

# 5. Paso 5: MapStruct

## Qué es

MapStruct **genera el código de conversión en tiempo de compilación**. Tú declaras una interfaz vacía y él escribe la implementación con todos los `setX(getX())`.

Ventajas frente a otras librerías como ModelMapper:

- **No usa reflection** → es tan rápido como el código escrito a mano.
- **Los errores salen al compilar**, no en producción. Si un campo del DTO no tiene equivalente, avisa al construir el proyecto.
- **Puedes leer el código generado** en `target/generated-sources/annotations/`.

## Dependencias

```xml
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.6.3</version>
</dependency>
```

Y en el plugin de compilación, **el orden importa**:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <configuration>
        <annotationProcessorPaths>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>1.18.34</version>
            </path>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok-mapstruct-binding</artifactId>
                <version>0.2.0</version>
            </path>
            <path>
                <groupId>org.mapstruct</groupId>
                <artifactId>mapstruct-processor</artifactId>
                <version>1.6.3</version>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

> ⚠️ **Si Lombok y MapStruct no están en ese orden, todos los mapeos salen `null`.** MapStruct se ejecuta antes de que Lombok haya generado los getters, así que no encuentra nada que mapear. El `lombok-mapstruct-binding` es lo que los sincroniza. Es un error clásico y muy difícil de diagnosticar porque **compila sin errores**.
> 

## Los DTOs vuelven a ser planos

Este es el beneficio directo. Con MapStruct, `DTOeventResponse` queda así:

```java
@Data
@NoArgsConstructor
public class DTOeventResponse {
    private Integer id;
    private String title;
    private String description;
    private Timestamp startDate;
    private Timestamp endDate;
    private String authorUserName;
    private String managerUserName;
    private String zoneName;
    private Integer zoneCapacity;
}
```

**Cero constructores de conversión. Cero métodos `fromEntity`. Cero `toEntity`.** Solo campos.

La inyección de datos la hace el mapper por defecto: **si el nombre del campo coincide en ambos lados, se copia solo**. Solo hay que declarar explícitamente lo que *no* coincide.

## El mapper de `Event`

```java
package com.example.eventos.mapper;

import com.example.eventos.dto.event.DTOeventRequest;
import com.example.eventos.dto.event.DTOeventResponse;
import com.example.eventos.model.Event;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface EventMapper {

    // ── Entidad → DTO de salida ──
    @Mapping(source = "author.userName",  target = "authorUserName")
    @Mapping(source = "manager.userName", target = "managerUserName")
    @Mapping(source = "zone.name",        target = "zoneName")
    @Mapping(source = "zone.capacity",    target = "zoneCapacity")
    DTOeventResponse toResponse(Event event);

    // ── DTO de entrada → Entidad NUEVA ──
    @Mapping(target = "id",        ignore = true)
    @Mapping(target = "author",    ignore = true)
    @Mapping(target = "manager",   ignore = true)
    @Mapping(target = "zone",      ignore = true)
    @Mapping(target = "schedules", ignore = true)
    @Mapping(target = "attendees", ignore = true)
    Event toEntity(DTOeventRequest request);

    // ── DTO de entrada → Entidad EXISTENTE (actualizar) ──
    @Mapping(target = "id",      ignore = true)
    @Mapping(target = "author",  ignore = true)
    @Mapping(target = "manager", ignore = true)
    @Mapping(target = "zone",    ignore = true)
    void updateEntityFromRequest(DTOeventRequest request, @MappingTarget Event event);
}
```

Nota que **es una interfaz**: no hay ni una línea de implementación.

## 🔍 Explicación de cada anotación

| Elemento | Qué hace |
| --- | --- |
| `@Mapper` | Marca la interfaz para que MapStruct genere su implementación al compilar. |
| `componentModel = "spring"` | La implementación se registra como **bean de Spring**, así puedes inyectarla con `@RequiredArgsConstructor`. Sin esto tendrías que instanciarla a mano. |
| `nullValuePropertyMappingStrategy = IGNORE` | Si un campo del DTO viene `null`, **no sobrescribe** el de la entidad. Esencial para actualizaciones parciales. |
| `@Mapping(source = "zone.name", target = "zoneName")` | **Aplanado**: navega `event.getZone().getName()`. Si `zone` es `null`, MapStruct genera la comprobación solo: **no explota**. |
| `@Mapping(target = "x", ignore = true)` | No toques ese campo. Se usa para `id` y para las relaciones. |
| `@MappingTarget` | En vez de crear un objeto nuevo, **modifica el que le pasas**. Es lo que permite actualizar sin perder los campos que no vinieron en el DTO. |

## 🔍 Por qué las relaciones se ignoran

```java
@Mapping(target = "zone", ignore = true)
```

El DTO trae `zoneId` (un `Integer`), pero la entidad necesita un objeto `Zone` completo. **MapStruct no puede consultar la base de datos**: no sabe cómo convertir el número `2` en la `Zone` con id 2.

Por eso el reparto de trabajo es:

- El **mapper** copia los campos planos.
- El **controlador** (o el servicio) busca las entidades relacionadas y las asigna.

## 🔑 El patrón estándar de un POST en REST

```java
@PostMapping
public ResponseEntity<DTOeventResponse> createEvent(@RequestBody DTOeventRequest request) {

    // ① DTO → entidad (solo campos planos)
    Event newEvent = eventMapper.toEntity(request);

    // ② Resolver las relaciones a partir de los IDs
    if (request.getZoneId() != null) {
        Zone zone = zoneService.findById(request.getZoneId())
                .orElseThrow(() -> new RuntimeException("Zona no encontrada"));
        newEvent.setZone(zone);
    }

    // ③ Guardar
    Event saved = eventService.save(newEvent);

    // ④ Entidad → DTO de salida
    return ResponseEntity.status(HttpStatus.CREATED)
            .body(eventMapper.toResponse(saved));
}
```

**Esos cuatro pasos se repiten en todos los POST de la aplicación.** Vale la pena memorizarlos.

Compara el paso ② con el equivalente MVC:

```java
// MVC                                    // REST
if (zoneId != null) {                     if (request.getZoneId() != null) {
    Zone zone = zoneService                   Zone zone = zoneService
        .findById(zoneId)...;                     .findById(request.getZoneId())...;
    event.setZone(zone);                      newEvent.setZone(zone);
}                                         }
```

**Idéntico.** Lo único que cambió es de dónde sale el `zoneId`: del `@RequestParam` en MVC, del DTO en REST.

## Actualización parcial: antes y después

```java
// ❌ SIN mapper: un if por cada campo
if (request.getTitle() != null)       existing.setTitle(request.getTitle());
if (request.getDescription() != null) existing.setDescription(request.getDescription());
if (request.getStartDate() != null)   existing.setStartDate(request.getStartDate());
if (request.getEndDate() != null)     existing.setEndDate(request.getEndDate());

// ✅ CON mapper y nullValuePropertyMappingStrategy = IGNORE
eventMapper.updateEntityFromRequest(request, existing);
```

Una línea hace exactamente lo mismo, generada automáticamente.

## El mapper de `User`

```java
@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {

    @Mapping(source = "role.name", target = "roleName")
    DTOuserResponse toResponse(User user);

    @Mapping(target = "id",             ignore = true)
    @Mapping(target = "role",           ignore = true)
    @Mapping(target = "deleted",        ignore = true)
    @Mapping(target = "createdEvents",  ignore = true)
    @Mapping(target = "managedEvents",  ignore = true)
    @Mapping(target = "eventAttendees", ignore = true)
    User toEntity(DTOuserRequest request);

    @Mapping(target = "id",   ignore = true)
    @Mapping(target = "role", ignore = true)
    void updateEntityFromRequest(DTOuserRequest request, @MappingTarget User user);
}
```

Fíjate: `password` **sí** se mapea en `toEntity` (entra al crear el usuario), pero `DTOuserResponse` no tiene ese campo, así que **es imposible que salga**. La seguridad está en el diseño del DTO, no en recordar poner una anotación.

## Dónde ver el código generado

MapStruct escribe las implementaciones en:

```
target/generated-sources/annotations/com/example/eventos/mapper/EventMapperImpl.java
```

Ábrelo: verás exactamente los `setX(getX())` que no escribiste, con las comprobaciones de `null` incluidas. **Si un mapeo no funciona, ese archivo es el primer lugar donde mirar.**

---

# 6. Paso 6: `ResponseEntity` y códigos de estado

En MVC, un error se comunicaba redirigiendo con un mensaje que leía un humano. En REST hay que comunicárselo a **otro programa**, y para eso están los códigos de estado.

## Las tres formas de responder

**1. Devolver el objeto directamente** → siempre 200 OK:

```java
@GetMapping
public Page<DTOeventResponse> findAll() { ... }
```

**2. `@ResponseStatus`** → código fijo para todo el método:

```java
@PostMapping
@ResponseStatus(HttpStatus.CREATED)
public DTOeventResponse create(@RequestBody DTOeventRequest request) { ... }
```

**3. `ResponseEntity<T>`** → control total: código, cabeceras y cuerpo:

```java
ResponseEntity.ok(dto)                                // 200 + cuerpo
ResponseEntity.status(HttpStatus.CREATED).body(dto)   // 201 + cuerpo
ResponseEntity.noContent().build()                    // 204 sin cuerpo
ResponseEntity.notFound().build()                     // 404 sin cuerpo
ResponseEntity.badRequest().body(mensaje)             // 400 + cuerpo
```

> 💡 Usa `ResponseEntity` cuando el mismo método pueda responder con **códigos distintos** (200 si existe, 404 si no). Usa retorno directo cuando siempre sea 200.
> 

`ResponseEntity<Void>` significa “no devuelvo cuerpo”, y `.build()` cierra la construcción sin adjuntar nada.

## Traducción directa de los patrones MVC

| MVC | REST |
| --- | --- |
| `redirect:` + `addFlashAttribute("error", ...)` | `ResponseEntity.notFound().build()` |
| `redirect:` + `addFlashAttribute("success", ...)` | `ResponseEntity.ok(dto)` o `.status(CREATED)` |
| `try/catch` con mensaje al usuario | Código de estado que el frontend interpreta |

```java
// MVC                                     // REST
if (event == null) {                       if (event == null) {
    redirectAttributes.addFlashAttribute(      return ResponseEntity.notFound().build();
        "error", "No encontrado");         }
    return "redirect:/mvc/events";
}
```

## Manejo centralizado de errores

Los `try/catch` repetidos en cada método se pueden centralizar:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(EntityNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(IllegalArgumentException e) {
        return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleForbidden(AccessDeniedException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "No tienes permiso para esta operación"));
    }
}
```

Con esto el controlador queda limpio: lanza la excepción y el `@RestControllerAdvice` la convierte en la respuesta correcta.

```java
@GetMapping("/{id}")
public DTOeventResponse findById(@PathVariable Integer id) {
    return eventMapper.toResponse(eventService.findById(id));  // si no existe → 404
}
```

El equivalente para MVC es `@ControllerAdvice`, que redirige a una página de error en vez de devolver JSON.

---

# 7. Paso 7: CORS

## El problema

React corre en `localhost:5173` y Spring Boot en `localhost:8081`. Son **orígenes distintos**. Por seguridad, el navegador bloquea las peticiones entre orígenes distintos salvo que el servidor lo autorice.

```
❌ Access to fetch at 'http://localhost:8081/api/rest/events'
   from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Es el primer error que aparece al conectar un frontend.** Y no existe en MVC, porque ahí el HTML lo sirve el mismo servidor.

## Solución rápida: `@CrossOrigin`

```java
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/rest/events")
public class RestEventController { ... }
```

## Solución correcta: configuración global

Ponerlo en cada controlador es repetitivo. Mejor un solo bean:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    // Permitir explícitamente el React de Vite
    configuration.setAllowedOrigins(List.of("http://localhost:5173"));

    // Métodos HTTP permitidos
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

    // Cabeceras permitidas (imprescindible Authorization para el JWT)
    configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));

    // Permitir envío de credenciales/cookies
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

Este bean va en la clase de configuración de seguridad y lo veremos completo en el Bloque 3.

### 🔍 Los detalles que suelen fallar

| Detalle | Por qué importa |
| --- | --- |
| `OPTIONS` en `setAllowedMethods` | Antes de un POST/PUT/DELETE, el navegador manda una petición **preflight** con método `OPTIONS` para preguntar si tiene permiso. Si `OPTIONS` no está permitido, todo falla. |
| `"Authorization"` en `setAllowedHeaders` | Sin esto, el navegador **no deja enviar el JWT**. Todas las peticiones autenticadas fallan. |
| `setAllowCredentials(true)` | Necesario para enviar cookies. **Incompatible con `setAllowedOrigins("*")`**: hay que listar los orígenes explícitamente. |

Y en la cadena de seguridad hay que permitir explícitamente las preflight:

```java
.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
```

---

# 8. El controlador REST completo

Todos los pasos aplicados:

```java
package com.example.eventos.controller.rest;

import com.example.eventos.dto.event.DTOeventRequest;
import com.example.eventos.dto.event.DTOeventResponse;
import com.example.eventos.mapper.EventMapper;
import com.example.eventos.model.Event;
import com.example.eventos.model.User;
import com.example.eventos.model.Zone;
import com.example.eventos.service.EventService;
import com.example.eventos.service.UserService;
import com.example.eventos.service.ZoneService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/rest/events")
@RequiredArgsConstructor
public class RestEventController {

    private final EventService eventService;
    private final ZoneService zoneService;
    private final UserService userService;
    private final EventMapper eventMapper;

    // ───────── LISTAR con paginación y filtros ─────────
    // GET /rest/events?offset=0&limit=10
    // GET /rest/events?zoneId=2
    // GET /rest/events?title=jazz
    @GetMapping
    public Page<DTOeventResponse> findAll(
            @RequestParam(defaultValue = "0")  int offset,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) Integer authorId,
            @RequestParam(required = false) Integer managerId,
            @RequestParam(required = false) Integer zoneId,
            @RequestParam(required = false) String  title) {

        Page<Event> eventPage;

        if (authorId != null) {
            eventPage = new PageImpl<>(eventService.findByAuthor_Id(authorId));

        } else if (managerId != null) {
            eventPage = new PageImpl<>(eventService.findByManager_Id(managerId));

        } else if (zoneId != null) {
            eventPage = new PageImpl<>(eventService.findByZone_Id(zoneId));

        } else if (title != null) {
            eventPage = new PageImpl<>(eventService.findByTitleContainingIgnoreCase(title));

        } else {
            eventPage = eventService.findAll(offset, limit);
        }

        // Page.map() convierte cada Event en DTO conservando la paginación
        return eventPage.map(eventMapper::toResponse);
    }

    // ───────── OBTENER UNO ─────────
    // GET /rest/events/5
    @GetMapping("/{id}")
    public ResponseEntity<DTOeventResponse> findById(@PathVariable Integer id) {

        Event event = eventService.findById(id).orElse(null);

        if (event == null) {
            return ResponseEntity.notFound().build();              // 404
        }
        return ResponseEntity.ok(eventMapper.toResponse(event));   // 200
    }

    // ───────── RECURSO ANIDADO: horarios de un evento ─────────
    // GET /rest/events/5/schedules
    @GetMapping("/{id}/schedules")
    public ResponseEntity<List<DTOscheduleResponse>> findSchedules(@PathVariable Integer id) {

        List<DTOscheduleResponse> response = eventService.findSchedulesByEventId(id)
                .stream()
                .map(scheduleMapper::toResponse)
                .toList();

        return ResponseEntity.ok(response);
    }

    // ───────── CREAR ─────────
    // POST /rest/events
    @PostMapping
    public ResponseEntity<DTOeventResponse> createEvent(
            @RequestBody DTOeventRequest request) {

        // ① DTO → entidad (campos planos)
        Event newEvent = eventMapper.toEntity(request);

        // ② Resolver relaciones a partir de los IDs
        if (request.getAuthorId() != null) {
            User author = userService.findById(request.getAuthorId())
                    .orElseThrow(() -> new RuntimeException("Autor no encontrado"));
            newEvent.setAuthor(author);
        }
        if (request.getManagerId() != null) {
            User manager = userService.findById(request.getManagerId())
                    .orElseThrow(() -> new RuntimeException("Encargado no encontrado"));
            newEvent.setManager(manager);
        }
        if (request.getZoneId() != null) {
            Zone zone = zoneService.findById(request.getZoneId())
                    .orElseThrow(() -> new RuntimeException("Zona no encontrada"));
            newEvent.setZone(zone);
        }

        // ③ Guardar
        Event saved = eventService.save(newEvent);

        // ④ Entidad → DTO de salida
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(eventMapper.toResponse(saved));              // 201
    }

    // ───────── ACTUALIZAR ─────────
    // PUT /rest/events/5
    @PutMapping("/{id}")
    public ResponseEntity<DTOeventResponse> updateEvent(
            @PathVariable Integer id,
            @RequestBody DTOeventRequest request) {

        Event existing = eventService.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        // Los campos null del request NO borran los valores existentes,
        // gracias a nullValuePropertyMappingStrategy = IGNORE
        eventMapper.updateEntityFromRequest(request, existing);

        // Las relaciones, otra vez, a mano
        if (request.getZoneId() != null) {
            Zone zone = zoneService.findById(request.getZoneId())
                    .orElseThrow(() -> new RuntimeException("Zona no encontrada"));
            existing.setZone(zone);
        }
        if (request.getManagerId() != null) {
            User manager = userService.findById(request.getManagerId())
                    .orElseThrow(() -> new RuntimeException("Encargado no encontrado"));
            existing.setManager(manager);
        }

        Event updated = eventService.save(existing);
        return ResponseEntity.ok(eventMapper.toResponse(updated));  // 200
    }

    // ───────── ELIMINAR ─────────
    // DELETE /rest/events/5
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Integer id) {

        if (eventService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();   // 404
        }
        eventService.deleteById(id);
        return ResponseEntity.noContent().build();      // 204
    }
}
```

## 🔍 Dos detalles nuevos

### `Page.map()`

`Page<T>` transforma cada elemento **conservando los metadatos**:

```java
return eventPage.map(eventMapper::toResponse);   // Page<Event> → Page<DTOeventResponse>
```

El JSON resultante:

```json
{
  "content": [ { "id": 1, "title": "Concierto", "zoneName": "Auditorio A" }, ... ],
  "totalElements": 47,
  "totalPages": 5,
  "number": 0,
  "size": 10,
  "first": true,
  "last": false
}
```

React usa `totalPages` y `number` para pintar la paginación. Es el equivalente exacto del objeto `page` que en MVC se metía en el `Model`.

### `.stream().map(...).toList()`

Cuando el servicio devuelve una `List` en vez de un `Page`:

```java
List<DTOeventResponse> response = eventService.findByZone_Id(zoneId)
        .stream()                       // convierte la lista en un flujo
        .map(eventMapper::toResponse)   // transforma cada elemento
        .toList();                      // vuelve a lista
```

`eventMapper::toResponse` es una **referencia a método**: la forma corta de `event -> eventMapper.toResponse(event)`.

---

# 9. Comparación final MVC vs REST

## El mismo método, lado a lado

```java
// ══════════════════ MVC ══════════════════
@GetMapping("/{id}")
public String findById(Model model, @PathVariable Integer id,
                       RedirectAttributes ra) {
    Event event = eventService.findById(id).orElse(null);
    if (event == null) {
        ra.addFlashAttribute("error", "No encontrado");
        return "redirect:/mvc/events";              // ← redirige
    }
    model.addAttribute("events", List.of(event));
    return "events/list";                           // ← nombre de plantilla
}

// ══════════════════ REST ══════════════════
@GetMapping("/{id}")
public ResponseEntity<DTOeventResponse> findById(@PathVariable Integer id) {
    Event event = eventService.findById(id).orElse(null);
    if (event == null) {
        return ResponseEntity.notFound().build();   // ← código 404
    }
    return ResponseEntity.ok(eventMapper.toResponse(event));  // ← DTO → JSON
}
```

## Tabla de equivalencias

| Concepto | MVC | REST |
| --- | --- | --- |
| Anotación de clase | `@Controller` | `@RestController` |
| Recibe datos de formulario | `@ModelAttribute` | `@RequestBody` |
| Pasa datos a la salida | `Model` + `addAttribute` | Tipo de retorno |
| Devuelve | `String` (nombre de vista) | Objeto o `ResponseEntity` |
| Objeto que maneja | **La entidad directamente** | **DTOs** |
| Conversión | Ninguna | **Mapper** |
| Crear | `GET /new` + `POST /` | `POST /` |
| Editar | `GET /edit/{id}` + `POST /update/{id}` | `PUT /{id}` |
| Eliminar | `POST /delete/{id}` | `DELETE /{id}` |
| Filtrar | `GET /zone/{zoneId}` | `GET /?zoneId=2` |
| Éxito | `redirect:` + flash | Código 200/201/204 |
| Error | `redirect:` + flash | Código 404/400/403 |
| Paginación | `page` en el Model | `Page<T>` serializado |
| Seguridad | JSESSIONID | JWT |
| CORS | No aplica | Obligatorio configurarlo |

## Por qué el orden de aprendizaje importó

```
En MVC aprendiste:                    En REST solo cambió:
─────────────────────────             ──────────────────────────
· inyectar servicios                  · igual
· @PathVariable / @RequestParam       · igual
· resolver Optional                   · igual
· llamar métodos derivados de JPA     · igual
· resolver relaciones por ID          · igual (del DTO en vez del form)
· paginar con Page                    · igual (serializado en vez de en el Model)

Lo verdaderamente nuevo:
· DTOs      → porque el JSON expone todo
· Mappers   → porque convertir a mano no escala
· Códigos   → porque el receptor es un programa, no una persona
· CORS      → porque el cliente vive en otro origen
```

Tres cuartas partes del controlador REST ya las sabías. Solo hacía falta entender **qué problema nuevo** justifica cada pieza añadida.

# 🟥 BLOQUE 3 — Autenticación y JWT

En el Bloque 1 vimos que MVC usa **sesión + cookie JSESSIONID** y que Spring Security lo hace casi todo solo. En REST no es así: hay que construir varias piezas a mano.

Este bloque las construye **en orden de dependencia**: cada clase usa la anterior.

---

# 1. Panorama: las piezas del rompecabezas

## Los archivos que vamos a crear

```
src/main/java/com/example/eventos/
├── security/
│   ├── SecurityAuthority.java          ← ① Permission → GrantedAuthority
│   ├── CustomUserDetails.java          ← ② User → UserDetails
│   ├── CustomUserDetailsService.java   ← ③ carga el User desde la BD
│   └── filters/
│       ├── JwtAuthenticationFilter.java ← ⑧ valida el token en cada petición
│       └── CustomSecurityFilter.java    ← ⑨ filtro propio de ejemplo
├── service/
│   ├── JwtService.java                 ← ④ genera y valida tokens
│   └── AuthService.java                ← ⑥ login y register
├── dto/
│   ├── AuthRequest.java                ← ⑤
│   └── AuthResponse.java               ← ⑤
├── controller/rest/
│   └── AuthController.java             ← ⑦ POST /rest/auth/login
└── config/
    └── AppConfig.java                  ← ⑩ ata todo: CORS + 2 cadenas de seguridad
```

## Cómo encajan

```
                    ┌─────────────────────────────────────┐
   LOGIN            │  AuthController                     │
   (una vez)        │      ↓                              │
                    │  AuthService                        │
                    │      ↓ carga         ↓ genera       │
                    │  UserDetailsService  JwtService     │
                    │      ↓                    ↓         │
                    │  CustomUserDetails    → TOKEN       │
                    │      ↓ usa                          │
                    │  SecurityAuthority (Permission)     │
                    └─────────────────────────────────────┘
                                     ↓
                    ┌─────────────────────────────────────┐
   CADA PETICIÓN    │  JwtAuthenticationFilter            │
   POSTERIOR        │      ↓ valida con JwtService        │
                    │      ↓ carga con UserDetailsService │
                    │      ↓                              │
                    │  SecurityContextHolder              │
                    │      ↓                              │
                    │  @PreAuthorize del controlador      │
                    └─────────────────────────────────────┘
```

## El punto de partida: el modelo de la Parte 1

Toda la seguridad se apoya en las relaciones que modelamos:

```
User (ana)
  └─ role → Role (ORGANIZER)
              └─ rolePermissions → [ RolePermission, RolePermission ]
                                        └─ permission → Permission (READ)
                                        └─ permission → Permission (WRITE)
```

> 🔑 **Aquí es donde se paga la decisión de la Parte 1** de modelar `RolePermission` como clase intermedia en vez de un `@ManyToMany` simple. Es la cadena que hay que recorrer para saber qué puede hacer un usuario.
> 

---

# 2. Paso 1: `SecurityAuthority`

## El problema

Spring Security no sabe qué es un `Permission`. Solo entiende de `GrantedAuthority`, una interfaz con un único método: `getAuthority()` que devuelve un `String`.

## La solución: un adaptador

```java
package com.example.eventos.security;

import org.springframework.security.core.GrantedAuthority;
import com.example.eventos.model.Permission;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class SecurityAuthority implements GrantedAuthority {

    private final Permission permission;

    @Override
    public String getAuthority() {
        return permission.getName();    // ej: "READ", "WRITE", "MANAGE_EVENTS"
    }
}
```

## 🔍 Explicación

Es un **adaptador**: envuelve una entidad `Permission` y la presenta con la interfaz que Spring Security espera.

```
Permission (entidad JPA)  →  SecurityAuthority  →  GrantedAuthority (Spring Security)
   name = "READ"                                       getAuthority() = "READ"
```

El `String` que devuelve `getAuthority()` es **exactamente** el que después compara `@PreAuthorize("hasAuthority('READ')")`. Si en la base de datos el permiso se llama `READ`, en la anotación va `'READ'`.

> 💡 Es la clase más pequeña de todo el bloque, pero es la que conecta tu modelo de datos con el sistema de permisos de Spring.
> 

---

# 3. Paso 2: `CustomUserDetails`

## El problema

Spring Security tampoco sabe qué es tu entidad `User`. Necesita un `UserDetails`, que responda a: ¿cuál es el nombre de usuario? ¿cuál es la contraseña? ¿qué authorities tiene?

## La solución

```java
package com.example.eventos.security;

import com.example.eventos.model.User;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@AllArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final User user;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        // ① Recorre la cadena role → rolePermissions → permission
        List<GrantedAuthority> authorities = new ArrayList<>(
                user.getRole()
                    .getRolePermissions().stream()
                    .map(rolePermission -> rolePermission.getPermission())
                    .map(SecurityAuthority::new)      // ← usa el adaptador del Paso 1
                    .toList()
        );

        // ② Además del permiso, se añade el NOMBRE DEL ROL como authority
        authorities.add(new SimpleGrantedAuthority(user.getRole().getName()));

        return authorities;
    }

    @Override
    public String getPassword() {
        return user.getPassword();     // el hash de BCrypt
    }

    @Override
    public String getUsername() {
        return user.getUserName();
    }

    // Expone el User original para usarlo en AuthService
    public User getUser() {
        return user;
    }
}
```

## 🔍 Explicación

### Es un envoltorio (*wrapper*)

`CustomUserDetails` no copia los datos: guarda una referencia al `User` y traduce lo que Spring Security pide.

```
User (tu entidad)  →  CustomUserDetails  →  UserDetails (lo que Spring entiende)
  userName                                     getUsername()
  password                                     getPassword()
  role.rolePermissions                         getAuthorities()
```

### 🔑 Dos tipos de authority conviviendo

Este es un detalle que confunde mucho. El método devuelve **dos clases distintas** de authority:

| Authority | De dónde sale | Ejemplo | Se usa con |
| --- | --- | --- | --- |
| **Permisos** | `role.rolePermissions.permission.name` | `READ`, `WRITE`, `DELETE` | `hasAuthority('READ')` |
| **Nombre del rol** | `role.name` | `ADMIN`, `ORGANIZER` | `hasAuthority('ADMIN')` |

Por eso en la configuración se pueden mezclar reglas de grano fino (`hasAuthority('DELETE')`) con reglas de grano grueso (`hasAuthority('ADMIN')`). Ambas funcionan porque ambas cadenas están en la lista.

> ⚠️ **`hasRole` vs `hasAuthority`.** `hasRole('ADMIN')` busca internamente la authority `ROLE_ADMIN` (añade el prefijo). Como aquí el rol se añade sin prefijo, hay que usar **`hasAuthority('ADMIN')`**. Si prefieres `hasRole`, guarda los roles en la BD como `ROLE_ADMIN`.
> 

### `getUser()` no es parte de la interfaz

`UserDetails` no tiene ese método: se agrega para poder recuperar la entidad original más adelante:

```java
CustomUserDetails cud = (CustomUserDetails) userDetails;
User user = cud.getUser();     // ← el User completo, con id y relaciones
```

Se necesita en `AuthService` porque el token debe llevar el `userId`, y `UserDetails` solo expone el `username`.

### ⚠️ Cuidado con LAZY

`getAuthorities()` recorre `user.getRole().getRolePermissions()`. Si esas relaciones son `FetchType.LAZY` y el `User` se cargó fuera de una transacción, salta `LazyInitializationException`.

Dos formas de evitarlo:

- Marcar `role` como `FetchType.EAGER` (como hicimos en la Parte 1).
- Cargar el usuario dentro de un método `@Transactional`.

---

# 4. Paso 3: `CustomUserDetailsService`

## Qué hace

Es el puente entre Spring Security y la base de datos: dado un nombre de usuario, devuelve su `UserDetails`.

```java
package com.example.eventos.security;

import com.example.eventos.model.User;
import com.example.eventos.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User userFound = userService.findByUserName(username);

        if (userFound == null) {
            throw new UsernameNotFoundException("Usuario no encontrado: " + username);
        }

        return new CustomUserDetails(userFound);
    }
}
```

## 🔍 Explicación

### `UserDetailsService` es la interfaz que Spring Security busca

Tiene un solo método. Spring lo llama automáticamente:

- Al hacer login en MVC (`formLogin`).
- Desde el filtro JWT en cada petición REST.

**Nunca lo llamas tú directamente** salvo en `AuthService`, donde se usa a propósito.

### Respeta las capas

Fíjate que inyecta `UserService`, **no** `UserRepository`. Sigue la misma regla de las capas que el resto de la aplicación.

### No lleva `@Service`

En el código de referencia esta clase **no** tiene anotación de componente. Se registra a mano como bean en la configuración:

```java
@Bean
public UserDetailsService userDetailsService(UserService userService) {
    return new CustomUserDetailsService(userService);
}
```

Ambas formas valen. Registrarlo como `@Bean` deja explícito en un solo archivo qué implementación de `UserDetailsService` se está usando, lo cual ayuda cuando hay varias.

### El método en el servicio

```java
// UserService
User findByUserName(String userName);

// UserRepository — método derivado de la Parte 2
Optional<User> findByUserName(String userName);
```

> ⚠️ Si `User` tiene `@SQLRestriction("deleted = false")` (el borrado suave de la Parte 1), un usuario eliminado **no aparecerá** en esta búsqueda y no podrá autenticarse. Ese es justamente el comportamiento deseado.
> 

---

# 5. Paso 4: `JwtService`

## Qué es un JWT

Una cadena de texto con tres partes separadas por puntos:

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbmEiLCJyb2xlcyI6WyJSRUFEIl19.dBjftJeZ4CVP...
└─────── header ────┘└──────────────── payload ────────────┘└─ signature ─┘
```

| Parte | Contenido | Codificación |
| --- | --- | --- |
| **Header** | Algoritmo de firma (`HS256`) y tipo (`JWT`) | Base64URL |
| **Payload** | Los *claims*: usuario, permisos, expiración | Base64URL |
| **Signature** | Firma de header + payload con la clave secreta | HMAC |

### 🔑 Lo más importante: el token NO está cifrado, está FIRMADO

Cualquiera puede copiar un JWT, pegarlo en [jwt.io](https://jwt.io/) y **leer el payload completo**. Es solo Base64.

Lo que la firma garantiza es la **integridad**: si alguien cambia `"roles": ["READ"]` por `"roles": ["ADMIN"]`, la firma deja de coincidir y el servidor rechaza el token. Para generar una firma válida haría falta la **clave secreta**, que solo conoce el servidor.

> ⚠️ **Consecuencia práctica: nunca metas datos sensibles en el payload.** Ni contraseñas, ni documentos, ni datos personales. Solo identificadores y permisos.
> 

## Dependencias

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.6</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
```

Y la clave secreta en `application.properties`:

```
app.jwt.secret=bXlTdXBlclNlY3JldEtleUZvckpXVFNpZ25pbmcxMjM0NTY3ODkwMTIzNDU2Nzg5MA==
```

> ⚠️ Debe estar en **Base64** y tener al menos 256 bits (32 bytes) para HS256. En producción va en una variable de entorno, **nunca** en el repositorio.
> 

## La interfaz

```java
package com.example.eventos.service;

import com.example.eventos.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;

public interface JwtService {
    String  generateToken(User user, Collection<? extends GrantedAuthority> authorities);
    String  extractUsername(String token);
    boolean validateToken(String token, UserDetails userDetails);
}
```

## La implementación

```java
package com.example.eventos.service.serviceImpl;

import com.example.eventos.model.User;
import com.example.eventos.service.JwtService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.Map;

@Service
public class JwtServiceImpl implements JwtService {

    @Value("${app.jwt.secret}")
    private String secretKey;

    // Construye la clave criptográfica desde el String en Base64
    private SecretKey getSign() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ───────── GENERAR ─────────
    @Override
    public String generateToken(User user, Collection<? extends GrantedAuthority> authorities) {

        String roleName = (user.getRole() != null) ? user.getRole().getName() : null;

        return Jwts.builder()
            .id(user.getId().toString())
            .claims(Map.of(
                "userId",   user.getId(),
                "username", user.getUserName(),
                "role",     roleName,
                "roles",    authorities.stream()
                                .map(GrantedAuthority::getAuthority)
                                .toList()
            ))
            .subject(user.getUserName())                        // quién "es" el token
            .issuedAt(new Date(System.currentTimeMillis()))
            .expiration(new Date(System.currentTimeMillis() + 60 * 60 * 1000))  // 1 hora
            .signWith(getSign())
            .compact();
    }

    // ───────── EXTRAER EL USUARIO ─────────
    @Override
    public String extractUsername(String token) {
        return Jwts.parser()
            .verifyWith(getSign())        // ← si la firma no coincide, lanza excepción
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .getSubject();                // ← el campo "subject" que pusimos al generar
    }

    // ───────── VALIDAR ─────────
    @Override
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        Date expiration = Jwts.parser()
            .verifyWith(getSign())
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .getExpiration();
        return expiration.before(new Date());
    }
}
```

## 🔍 Explicación pieza por pieza

### `@Value("${app.jwt.secret}")`

Inyecta un valor de `application.properties` en un campo. Es la forma estándar de externalizar configuración.

### `getSign()`

Convierte el `String` en Base64 a un objeto `SecretKey` criptográfico. **La misma clave se usa para firmar y para verificar** (eso es HMAC, cifrado simétrico).

### Los claims del payload

| Claim | Qué guarda | Para qué |
| --- | --- | --- |
| `subject` | El `userName` | Es lo que `extractUsername` recupera después |
| `userId` | El id numérico | Para que el frontend sepa a quién representa el token |
| `role` | El nombre del rol | Para pintar la interfaz según el rol |
| `roles` | La lista de authorities | Para que el frontend muestre u oculte botones |
| `issuedAt` | Fecha de emisión | Auditoría |
| `expiration` | Fecha de vencimiento | Seguridad: el token muere solo |

> 🔑 **El `subject` es el claim más importante.** Es el que se usa en `extractUsername`, y con él el filtro carga el usuario desde la base de datos en cada petición.
> 

### `.expiration(... + 60 * 60 * 1000)`

Una hora en milisegundos. Es un compromiso: muy corto molesta al usuario, muy largo alarga la ventana en la que un token robado sirve.

### `verifyWith(getSign())` es donde ocurre la seguridad

Si el token fue manipulado, `parseSignedClaims` lanza `SignatureException` y la petición nunca llega al controlador. **Esa línea es toda la protección del sistema.**

### `validateToken` comprueba dos cosas

```java
username.equals(userDetails.getUsername())   // el token corresponde a este usuario
&& !isTokenExpired(token)                    // y no ha vencido
```

La firma ya se validó implícitamente al hacer `extractUsername`.

---

# 6. Paso 5: DTOs de autenticación

Igual que en el Bloque 2: no se exponen entidades, se usan DTOs.

```java
package com.example.eventos.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String userName;   // coincide con el campo de la entidad User
    private String password;
}
```

```java
package com.example.eventos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
}
```

## 🔍 Explicación

`AuthRequest` es un DTO de entrada perfecto: solo los dos campos que el cliente debe enviar. **No es la entidad `User`**, así que es imposible que alguien mande un `roleId` en el login e intente escalar privilegios.

`AuthResponse` con `@AllArgsConstructor` permite `new AuthResponse(token)` en una línea.

> 💡 Una versión más completa devolvería también el nombre y los permisos, para que el frontend no tenga que decodificar el token:
> 
> 
> ```java
> @Data @AllArgsConstructor
> public class AuthResponse {
>     private String token;
>     private String userName;
>     private List<String> authorities;
> }
> ```
> 

---

# 7. Paso 6: `AuthService`

Aquí se junta todo lo anterior.

```java
package com.example.eventos.service;

import com.example.eventos.dto.AuthResponse;
import com.example.eventos.dto.user.DTOuserRequest;

public interface AuthService {
    AuthResponse login(String username, String password);
    AuthResponse register(DTOuserRequest request);
}
```

```java
package com.example.eventos.service.serviceImpl;

import com.example.eventos.dto.AuthResponse;
import com.example.eventos.dto.user.DTOuserRequest;
import com.example.eventos.model.Role;
import com.example.eventos.model.User;
import com.example.eventos.security.CustomUserDetails;
import com.example.eventos.service.*;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserDetailsService userDetailsService;  // Spring inyecta CustomUserDetailsService
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserService userService;
    private final RoleService roleService;

    // ══════════════════ LOGIN ══════════════════
    @Override
    public AuthResponse login(String username, String password) {

        // ① Carga el usuario desde la BD (o lanza UsernameNotFoundException)
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        // ② Verifica la contraseña: compara el texto plano con el hash de BCrypt
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        // ③ Recupera el User real desde el wrapper
        CustomUserDetails customUserDetails = (CustomUserDetails) userDetails;
        User user = customUserDetails.getUser();

        // ④ Genera el token con el usuario y sus authorities
        String token = jwtService.generateToken(user, customUserDetails.getAuthorities());

        return new AuthResponse(token);
    }

    // ══════════════════ REGISTER ══════════════════
    @Override
    public AuthResponse register(DTOuserRequest request) {

        // ① Validar que el userName no exista
        if (userService.findByUserName(request.getUserName()) != null) {
            throw new RuntimeException("El nombre de usuario ya está registrado");
        }

        // ② Crear el usuario
        User newUser = new User();
        newUser.setUserName(request.getUserName());
        newUser.setName(request.getName());
        newUser.setLastName(request.getLastName());
        newUser.setAge(request.getAge());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));  // ← HASH

        // ③ Asignar el rol por defecto (nunca el que pida el cliente)
        Role role = roleService.findById(2)
                .orElseThrow(() -> new RuntimeException("Rol por defecto no encontrado"));
        newUser.setRole(role);

        // ④ Guardar
        userService.save(newUser);

        // ⑤ Recargar desde la BD para que las relaciones estén inicializadas
        UserDetails userDetails = userDetailsService.loadUserByUsername(newUser.getUserName());
        CustomUserDetails customUserDetails = (CustomUserDetails) userDetails;

        // ⑥ Generar el token
        String token = jwtService.generateToken(
                customUserDetails.getUser(), customUserDetails.getAuthorities());

        return new AuthResponse(token);
    }
}
```

## 🔍 Explicación de los puntos críticos

### `passwordEncoder.matches(plano, hash)`

BCrypt es **unidireccional**: no se puede descifrar un hash. Lo que hace `matches()` es volver a hashear el texto plano con la misma sal (que va guardada dentro del propio hash) y comparar los resultados.

```java
// ❌ NUNCA:
if (password.equals(user.getPassword()))       // compara texto plano con hash: siempre false

// ✅ SIEMPRE:
if (passwordEncoder.matches(password, userDetails.getPassword()))
```

Y al guardar, siempre `encode`:

```java
newUser.setPassword(passwordEncoder.encode(request.getPassword()));
```

> ⚠️ Si guardas contraseñas sin `encode()`, el login **nunca** funcionará, porque `matches()` compara contra un hash que no existe.
> 

### El cast a `CustomUserDetails`

```java
CustomUserDetails customUserDetails = (CustomUserDetails) userDetails;
User user = customUserDetails.getUser();
```

`UserDetails` es una interfaz: solo expone `getUsername()`, `getPassword()` y `getAuthorities()`. Como el token necesita el `userId`, hay que recuperar la entidad completa. De ahí el método extra `getUser()` que añadimos en el Paso 2.

### 🔑 El paso ⑤ del register: por qué recargar

Este es el detalle menos obvio de todo el bloque.

```java
userService.save(newUser);

// ⑤ NO se usa newUser directamente. Se recarga desde la BD.
UserDetails userDetails = userDetailsService.loadUserByUsername(newUser.getUserName());
```

**¿Por qué?** Porque el objeto `newUser` que acabamos de construir tiene el `Role` asignado, pero **la lista `rolePermissions` de ese rol puede no estar inicializada**. Al llamar a `getAuthorities()` sobre él, la lista saldría vacía o lanzaría `LazyInitializationException`, y el token se generaría **sin permisos**.

Recargándolo desde la base de datos, las relaciones se cargan correctamente y el token sale completo.

> 🔑 **El síntoma de olvidar este paso:** el usuario se registra bien, recibe su token, pero **cada petición posterior devuelve 403**. El token existe, es válido, pero su lista de permisos está vacía.
> 

### El rol se asigna en el servidor, nunca desde el request

```java
Role role = roleService.findById(2)   // el rol "básico" fijo
```

Aunque `DTOuserRequest` tenga un campo `roleId`, en el **registro público** se ignora deliberadamente. Si no, cualquiera podría registrarse como `ADMIN` mandando `{"roleId": 1}`.

> 💡 Usar el id `2` a fuego es frágil. Mejor buscarlo por nombre: `roleService.findByName("ATTENDEE")`.
> 

---

# 8. Paso 7: `AuthController`

```java
package com.example.eventos.controller.rest;

import com.example.eventos.dto.AuthRequest;
import com.example.eventos.dto.AuthResponse;
import com.example.eventos.dto.user.DTOuserRequest;
import com.example.eventos.service.AuthService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController("restAuthController")
@RequestMapping("/rest/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST /rest/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        try {
            AuthResponse response = authService.login(
                    authRequest.getUserName(),
                    authRequest.getPassword());
            return ResponseEntity.ok(response);                          // 200 + token

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 401
        }
    }

    // POST /rest/auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody DTOuserRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);  // 201

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();                       // 400
        }
    }
}
```

## 🔍 Explicación

### Compara con el `AuthController` de MVC

```java
// MVC: solo entrega el HTML, Spring Security intercepta el POST
@GetMapping("/login")
public String getLogin() { return "login"; }

// REST: TÚ escribes el endpoint, porque debe devolver un token en JSON
@PostMapping("/login")
public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) { ... }
```

Esa es la diferencia práctica más visible entre los dos modelos de seguridad.

### `@RestController("restAuthController")`

Si también existe un `AuthController` en el paquete `mvc`, los nombres de bean chocan. Nombrarlos explícitamente lo resuelve.

### Ambos son POST, no GET

Aunque “solo consultan”, llevan la contraseña en el cuerpo. Un GET la pondría en la URL, y las URLs quedan en logs, historial del navegador y proxies.

### 401 vs 400

- **Login fallido** → `401 Unauthorized`: las credenciales no sirven.
- **Registro fallido** → `400 Bad Request`: los datos enviados tienen algún problema (usuario duplicado, campos faltantes).

> ⚠️ **Sobre el `catch (Exception e)` genérico:** captura todo por igual, así que un fallo de conexión a la base de datos se reporta como “credenciales inválidas”. En un proyecto real conviene capturar excepciones concretas o delegar en el `@RestControllerAdvice` del Bloque 2.
> 
> 
> Si necesitas ver qué está fallando mientras desarrollas, agrega temporalmente un `e.printStackTrace()` — pero **quítalo antes de entregar**. Un stack trace en producción filtra la estructura interna de la aplicación.
> 

### Probarlo con Postman

```
POST http://localhost:8081/api/rest/auth/login
Content-Type: application/json

{ "userName": "ana", "password": "1234" }
```

Respuesta:

```json
{ "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbmEi..." }
```

Y a partir de ahí, en cada petición:

```
GET http://localhost:8081/api/rest/events
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbmEi...
```

---

# 9. Paso 8: `JwtAuthenticationFilter`

## Qué hace

Se ejecuta **antes** de que la petición llegue a cualquier controlador. Es lo que convierte un token en un usuario autenticado.

```java
package com.example.eventos.security.filters;

import com.example.eventos.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // ① Leer el header Authorization
        final String authHeader = request.getHeader("Authorization");

        // ② Si no hay header o no empieza con "Bearer", dejar pasar sin autenticar
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ③ Extraer el token (quitar "Bearer ")
        final String jwt = authHeader.substring(7);

        // ④ Extraer el username del token
        final String username = jwtService.extractUsername(jwt);

        // ⑤ Si hay username y aún no hay autenticación en el contexto
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // ⑥ Validar el token contra ese usuario
            if (jwtService.validateToken(jwt, userDetails)) {

                // ⑦ Crear el objeto de autenticación y meterlo en el contexto
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);   // continúa hacia el controlador
    }
}
```

## 🔍 Explicación paso a paso

| Paso | Qué hace y por qué |
| --- | --- |
| **①** | `Authorization: Bearer eyJhbGci...` es la cabecera estándar para tokens. |
| **②** | **No rechaza la petición**: solo la deja pasar sin autenticar. Es importante, porque rutas públicas como `/rest/auth/login` no llevan token. Quien decide si hace falta autenticación es la cadena de seguridad, no el filtro. |
| **③** | `substring(7)` quita exactamente `"Bearer "` (7 caracteres, con el espacio). |
| **④** | Aquí se valida la firma implícitamente: si el token fue manipulado, `extractUsername` lanza excepción. |
| **⑤** | La comprobación `getAuthentication() == null` evita re-autenticar si otro filtro ya lo hizo. |
| **⑥** | Comprueba que el token corresponde a ese usuario y que no expiró. |
| **⑦** | Crea el `Authentication` con las authorities **recién cargadas de la base de datos**. |

### `OncePerRequestFilter`

Garantiza que el filtro se ejecute **una sola vez por petición**, incluso si hay reenvíos internos (`forward`). Es la clase base estándar para filtros de seguridad.

### `SecurityContextHolder`: el “quién soy” de la petición

Es un almacén asociado al hilo que atiende la petición. Todo lo que venga después —`@PreAuthorize`, `authentication.principal`— lee de ahí.

**Y se limpia al terminar la petición.** Eso es lo que hace a JWT *stateless*: el servidor no recuerda nada entre peticiones.

### 🔑 Un detalle importante: las authorities vienen de la BD, no del token

```java
UserDetails userDetails = userDetailsService.loadUserByUsername(username);
// ...
new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
//                                                          ↑
//                                        de la BD, NO del claim "roles" del token
```

Esto tiene una consecuencia muy buena: **si el administrador le quita un permiso al usuario, el cambio surte efecto en la siguiente petición**, aunque el token viejo siga diciendo que lo tiene.

Se paga con una consulta a la base de datos por petición. Es un enfoque **semi-stateful**: rompe la pureza del stateless a cambio de control de seguridad en tiempo real. Es un compromiso perfectamente razonable.

> 📌 La alternativa “pura” sería leer las authorities del claim `roles` del token. Es más rápido (cero consultas), pero entonces revocar un permiso no tiene efecto hasta que el token expire.
> 

### El problema de la revocación

Como el servidor no guarda estado, **no puede invalidar un token emitido**. Tres soluciones:

| Estrategia | Cómo funciona | Costo |
| --- | --- | --- |
| **Expiración corta** | Tokens de 15 min + *refresh token*. El daño dura poco. | Bajo |
| **Consultar la BD** (la de arriba) | Las authorities siempre salen frescas. | Una consulta por petición |
| **Lista negra** | Los tokens revocados se guardan en Redis hasta expirar. | Infraestructura extra |

---

# 10. Paso 9: `CustomSecurityFilter`

Un filtro propio, útil para entender el mecanismo y para casos como un modo mantenimiento.

```java
package com.example.eventos.security.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro personalizado que se ejecuta una sola vez por petición.
 * flag = false → pasa la petición al siguiente filtro (comportamiento normal).
 * flag = true  → bloquea la petición con error 400 (modo mantenimiento).
 */
public class CustomSecurityFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        boolean flag = false;   // cambiar a true para activar el modo mantenimiento

        if (!flag) {
            // Comportamiento normal: continuar con la cadena
            filterChain.doFilter(request, response);
            return;
        }

        // Modo mantenimiento: bloquea el acceso
        response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                "Esta página está en mantenimiento, no puede acceder");
    }
}
```

## 🔍 Lo que enseña este filtro

Un filtro tiene exactamente **dos salidas posibles**:

```java
filterChain.doFilter(request, response);   // ✅ continúa hacia el siguiente filtro
// ─────────────────── o ───────────────────
response.sendError(...);                   // 🛑 corta la cadena aquí mismo
```

**Si olvidas llamar a `doFilter`, la petición se queda colgada.** Ese es el error más común al escribir un filtro propio: el navegador espera y espera, sin error ni respuesta.

Es el mismo mecanismo que usa `JwtAuthenticationFilter`, pero sin lógica: sirve para ver la estructura desnuda.

Se registra en la cadena MVC:

```java
.addFilterAt(customSecurityFilter(), UsernamePasswordAuthenticationFilter.class)
```

---

# 11. Paso 10: `AppConfig` y las dos cadenas

Aquí se ata todo. Es la clase más densa, pero cada bloque ya se explicó por separado.

```java
package com.example.eventos.config;

import com.example.eventos.security.CustomUserDetailsService;
import com.example.eventos.security.filters.CustomSecurityFilter;
import com.example.eventos.security.filters.JwtAuthenticationFilter;
import com.example.eventos.service.UserService;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity(debug = true)
@EnableMethodSecurity
public class AppConfig {

    // ═══════════ BEANS BÁSICOS ═══════════

    @Bean
    public UserDetailsService userDetailsService(UserService userService) {
        return new CustomUserDetailsService(userService);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CustomSecurityFilter customSecurityFilter() {
        return new CustomSecurityFilter();
    }

    // ═══════════ CORS GLOBAL ═══════════

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // ═══════════ CADENA 1: MVC (sesión + JSESSIONID) ═══════════

    @Bean
    @Order(1)
    public SecurityFilterChain mvcSecurityFilterChain(HttpSecurity http) throws Exception {
        return http
                .securityMatcher("/login/**", "/mvc/**", "/h2-console/**")
                .cors(Customizer.withDefaults())
                .addFilterAt(customSecurityFilter(), UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/mvc/auth/login/**", "/mvc/public/**",
                                         "/h2-console/**", "/css/**").permitAll()
                        .anyRequest().authenticated())
                .formLogin(form -> form
                        .loginPage("/mvc/auth/login")
                        .loginProcessingUrl("/mvc/auth/login")
                        .usernameParameter("username")
                        .passwordParameter("password")
                        .defaultSuccessUrl("/mvc/events", true)
                        .permitAll())
                .logout(Customizer.withDefaults())
                .headers(headers -> headers
                        .frameOptions(frame -> frame.sameOrigin()))
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/h2-console/**"))
                .build();
    }

    // ═══════════ CADENA 2: REST (JWT, stateless) ═══════════

    @Bean
    @Order(2)
    public SecurityFilterChain restSecurityFilterChain(HttpSecurity http,
                                                       JwtAuthenticationFilter jwtAuthFilter)
            throws Exception {
        return http
                .securityMatcher("/rest/**")
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/rest/auth/**").permitAll()

                        // Administración: solo ADMIN
                        .requestMatchers("/rest/users/**", "/rest/roles/**",
                                         "/rest/permissions/**").hasAuthority("ADMIN")

                        // Eventos: leer cualquiera autenticado; escribir solo ADMIN u ORGANIZER
                        .requestMatchers(HttpMethod.GET,    "/rest/events/**").authenticated()
                        .requestMatchers(HttpMethod.POST,   "/rest/events/**")
                                .hasAnyAuthority("ADMIN", "ORGANIZER")
                        .requestMatchers(HttpMethod.PUT,    "/rest/events/**")
                                .hasAnyAuthority("ADMIN", "ORGANIZER")
                        .requestMatchers(HttpMethod.DELETE, "/rest/events/**")
                                .hasAnyAuthority("ADMIN", "ORGANIZER")

                        // Zonas: mismo criterio
                        .requestMatchers(HttpMethod.POST,   "/rest/zones/**")
                                .hasAnyAuthority("ADMIN", "ORGANIZER")
                        .requestMatchers(HttpMethod.DELETE, "/rest/zones/**")
                                .hasAuthority("ADMIN")

                        .anyRequest().authenticated())
                .build();
    }
}
```

## 🔍 Explicación de las anotaciones de clase

| Anotación | Qué hace |
| --- | --- |
| `@Configuration` | Esta clase define beans. |
| `@EnableWebSecurity` | Activa Spring Security y permite personalizar las cadenas. |
| `debug = true` | Imprime en consola toda la cadena de filtros y qué hace cada petición. **Muy útil para depurar, quitar en producción.** |
| `@EnableMethodSecurity` | Habilita `@PreAuthorize`. **Sin esto, `@PreAuthorize` se ignora en silencio.** |

## 🔍 Por qué DOS cadenas

Porque MVC y REST necesitan **configuraciones incompatibles**:

|  | Cadena MVC | Cadena REST |
| --- | --- | --- |
| Sesión | Sí (JSESSIONID) | `STATELESS` |
| CSRF | Activo | Deshabilitado |
| Login | `formLogin` con HTML | `POST /rest/auth/login` con JSON |
| Filtro extra | `CustomSecurityFilter` | `JwtAuthenticationFilter` |
| Sin autenticar | Redirige al formulario | Devuelve 401 |

No se pueden mezclar en una sola cadena.

### `securityMatcher` y `@Order`

```java
@Order(1)  .securityMatcher("/mvc/**", ...)    // ← se evalúa primero
@Order(2)  .securityMatcher("/rest/**")        // ← si la 1 no coincide, esta
```

`securityMatcher` decide **a qué rutas aplica** la cadena. `@Order` decide **en qué orden** se evalúan. Spring toma **la primera que coincida** y las demás ni se miran.

> ⚠️ **Un `securityMatcher` demasiado amplio en la cadena de menor `@Order` se traga todo.** Si la cadena 1 fuera `.securityMatcher("/**")`, la cadena REST nunca se aplicaría y todas las peticiones a `/rest` intentarían usar sesión.
> 

## 🔍 Las líneas clave de la cadena REST

### `SessionCreationPolicy.STATELESS`

Le prohíbe a Spring crear `HttpSession`. Sin esto, seguiría generando `JSESSIONID` en paralelo al JWT y tendrías **dos mecanismos de sesión conviviendo**, con comportamientos difíciles de depurar.

### `csrf().disable()`

La protección CSRF existe porque el navegador envía cookies **automáticamente**. Como el JWT viaja en una cabecera que el JavaScript pone **a mano**, un sitio malicioso no puede provocar peticiones autenticadas. El ataque no aplica.

> ⚠️ **En MVC, en cambio, CSRF debe seguir activo.** Ahí sí hay cookies automáticas. Por eso la cadena 1 solo lo desactiva para `/h2-console/**` (que es una herramienta de desarrollo, no un endpoint de la app).
> 

### `addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)`

Inserta el filtro JWT **antes** del filtro de login por formulario. Así, cuando la petición llega al resto de la cadena, el usuario ya está autenticado en el `SecurityContextHolder`.

### `requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()`

Las peticiones **preflight** de CORS. El navegador manda un `OPTIONS` sin cabecera `Authorization` antes de cada POST/PUT/DELETE. Si esa petición se rechaza, **todas las escrituras desde React fallan**, aunque el token sea válido.

### El orden de los `requestMatchers` importa

Se evalúan **de arriba abajo** y gana **la primera coincidencia**:

```java
.requestMatchers("/rest/auth/**").permitAll()              // ① primero lo público
.requestMatchers(HttpMethod.GET, "/rest/events/**").authenticated()  // ② luego lo específico
.requestMatchers("/rest/users/**").hasAuthority("ADMIN")   // ③
.anyRequest().authenticated()                              // ④ el catch-all AL FINAL
```

> ⚠️ Si pusieras `.anyRequest().authenticated()` primero, **todo lo demás se ignoraría** y hasta el login exigiría estar autenticado (un candado con la llave dentro).
> 

## 🔍 Las líneas clave de la cadena MVC

| Línea | Qué hace |
| --- | --- |
| `.loginPage("/mvc/auth/login")` | La URL del formulario (tu `@GetMapping`) |
| `.loginProcessingUrl("/mvc/auth/login")` | La URL que **Spring Security** intercepta con POST |
| `.usernameParameter("username")` | El `name` del input del formulario |
| `.defaultSuccessUrl("/mvc/events", true)` | A dónde ir tras entrar. El `true` fuerza esa URL siempre |
| `.frameOptions(sameOrigin())` | Permite que la consola H2 se muestre en un `<iframe>` |
| `.logout(Customizer.withDefaults())` | Habilita `/logout`, que destruye la sesión |

---

# 12. Paso 11: `@PreAuthorize`

Es la última capa: autorización **a nivel de método**, más fina que la de rutas.

```java
@PreAuthorize("isAuthenticated()")                    // cualquier usuario logueado
@PreAuthorize("hasAuthority('READ')")                 // un permiso concreto
@PreAuthorize("hasAnyAuthority('WRITE', 'UPDATE')")   // alguno de varios
@PreAuthorize("hasAuthority('ADMIN')")                // por nombre de rol
@PreAuthorize("#id == authentication.principal.id")   // solo sus propios datos
```

Se ejecuta **antes** del método. Si la condición es falsa, devuelve **403 Forbidden** y el método nunca corre.

## Dos capas de autorización

|  | `requestMatchers` en `AppConfig` | `@PreAuthorize` en el método |
| --- | --- | --- |
| Granularidad | Por ruta y método HTTP | Por método Java |
| Dónde se ve | Todo junto, en un archivo | Junto al código que protege |
| Puede usar los parámetros | ❌ No | ✅ Sí (`#id`) |
| Cuándo usarla | Reglas amplias por sección | Reglas finas o condicionales |

Se complementan. Lo habitual es una regla amplia en la configuración y afinar con `@PreAuthorize` donde haga falta.

## Aplicado a los controladores

```java
@RestController
@RequestMapping("/rest/events")
@RequiredArgsConstructor
public class RestEventController {

    @GetMapping
    @PreAuthorize("hasAuthority('READ')")
    public Page<DTOeventResponse> findAll(...) { ... }

    @PostMapping
    @PreAuthorize("hasAuthority('WRITE')")
    public ResponseEntity<DTOeventResponse> createEvent(...) { ... }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('UPDATE')")
    public ResponseEntity<DTOeventResponse> updateEvent(...) { ... }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE')")
    public ResponseEntity<Void> deleteEvent(...) { ... }
}
```

Funciona **exactamente igual en MVC y en REST**. La única diferencia es qué pasa al fallar: en REST se devuelve un 403; en MVC, Spring redirige a la página de error.

## De dónde salen esas cadenas

```
Permission.name = "READ"          (tabla permissions)
        ↓
SecurityAuthority.getAuthority()  (Paso 1)
        ↓
CustomUserDetails.getAuthorities() (Paso 2)
        ↓
JwtAuthenticationFilter → SecurityContextHolder (Paso 8)
        ↓
@PreAuthorize("hasAuthority('READ')")  ✅
```

> 🔑 **Si `@PreAuthorize` devuelve 403 con un token que parece correcto**, sigue esa cadena hacia atrás. Casi siempre el problema está en que el permiso en la base de datos se llama distinto a lo que dice la anotación, o en que `getAuthorities()` devolvió una lista vacía por el problema de LAZY del Paso 6.
> 

---

# 13. El flujo completo, de principio a fin

## Registro

```
POST /rest/auth/register  { "userName": "ana", "password": "1234", ... }
        ↓
AuthController.register()
        ↓
AuthService.register()
   ① ¿existe el userName? → si sí, excepción → 400
   ② new User() + passwordEncoder.encode(password)
   ③ asignar rol por defecto
   ④ userService.save()
   ⑤ RECARGAR desde la BD (para que las relaciones estén cargadas)
   ⑥ jwtService.generateToken()
        ↓
201 Created  { "token": "eyJhbGci..." }
```

## Login

```
POST /rest/auth/login  { "userName": "ana", "password": "1234" }
        ↓
AuthController.login()
        ↓
AuthService.login()
   ① userDetailsService.loadUserByUsername("ana")
        └→ userService.findByUserName() → BD
        └→ new CustomUserDetails(user)
             └→ getAuthorities() recorre role → rolePermissions → permission
                  └→ [SecurityAuthority("READ"), SecurityAuthority("WRITE"),
                      SimpleGrantedAuthority("ORGANIZER")]
   ② passwordEncoder.matches("1234", hash) → true
   ③ recuperar el User real del wrapper
   ④ jwtService.generateToken(user, authorities)
        ↓
200 OK  { "token": "eyJhbGci..." }
```

## Cualquier petición posterior

```
GET /rest/events
Authorization: Bearer eyJhbGci...
        ↓
[CORS] ¿el origen está permitido? ✅
        ↓
[restSecurityFilterChain] securityMatcher "/rest/**" coincide
        ↓
[JwtAuthenticationFilter]
   ① lee la cabecera Authorization
   ③ quita "Bearer "
   ④ extractUsername() → valida la firma → "ana"
   ⑤ loadUserByUsername("ana") → authorities FRESCAS de la BD
   ⑥ validateToken() → ¿coincide el usuario? ¿no expiró?
   ⑦ SecurityContextHolder.setAuthentication(authToken)
        ↓
[authorizeHttpRequests] ¿GET /rest/events requiere authenticated()? ✅
        ↓
[@PreAuthorize("hasAuthority('READ')")] ¿está READ en las authorities? ✅
        ↓
RestEventController.findAll()
        ↓
EventService → EventRepository → BD
        ↓
eventMapper.toResponse() → DTOs
        ↓
200 OK  { "content": [...], "totalPages": 5 }
        ↓
🧹 SecurityContextHolder SE LIMPIA  ← esto es lo que hace a JWT stateless
```

---

# 14. JSESSIONID vs JWT

## El diagrama

```
╔══════════ JSESSIONID (MVC / Stateful) ══════════╗
║                                                  ║
║  Navegador                    Servidor           ║
║  ┌──────────┐                ┌───────────────┐   ║
║  │ Cookie:  │                │ MEMORIA:      │   ║
║  │ JSESSION │ ──── envía ──► │ "A1B2C3" → {  │   ║
║  │  =A1B2C3 │                │   user: ana,  │   ║
║  └──────────┘                │   perms: [..] │   ║
║                              │ }             │   ║
║  La cookie es solo una LLAVE └───────────────┘   ║
║  Los DATOS están en el servidor                  ║
╚══════════════════════════════════════════════════╝

╔══════════ JWT (REST / Stateless) ═══════════════╗
║                                                  ║
║  Navegador                    Servidor           ║
║  ┌────────────────────┐      ┌───────────────┐   ║
║  │ Token:             │      │ MEMORIA:      │   ║
║  │ { user: ana,       │─────►│    (vacía)    │   ║
║  │   roles: [READ],   │      │               │   ║
║  │   firma: xY9... }  │      │ Solo tiene la │   ║
║  └────────────────────┘      │ CLAVE SECRETA │   ║
║                              │ para validar  │   ║
║  El token lleva LOS DATOS    └───────────────┘   ║
╚══════════════════════════════════════════════════╝
```

## Tabla comparativa

| Característica | **JSESSIONID** | **JWT** |
| --- | --- | --- |
| ¿Dónde están los datos? | Memoria del servidor | Dentro del token |
| ¿Qué lleva el cliente? | Una llave (`A1B2C3`) | Los datos + firma |
| Estado en el servidor | Sí (stateful) | No (stateless) |
| Cómo viaja | Cookie automática | Cabecera `Authorization: Bearer` |
| ¿Quién lo envía? | El navegador, solo | El JavaScript, a mano |
| Escalar a N servidores | ❌ Sticky sessions o Redis | ✅ Cualquier servidor lo valida |
| Cerrar sesión | ✅ Inmediato | ❌ Válido hasta expirar |
| Revocar permisos | ✅ Inmediato | ❌ Requiere consultar la BD |
| Memoria | Crece con los usuarios conectados | Cero |
| Vulnerable a CSRF | ✅ Sí (protección necesaria) | ❌ No |
| Vulnerable a XSS | Menos (cookie `HttpOnly`) | Sí, si se guarda en `localStorage` |
| Sirve para móvil | ❌ No | ✅ Sí |
| Usado con | `@Controller` MVC | `@RestController` |

## El resumen en dos frases

> **JSESSIONID**: el servidor recuerda quién eres; tú solo llevas un número de ficha.
**JWT**: el servidor no recuerda nada; tú llevas tu credencial firmada y él verifica la firma.
> 

## Por qué cada uno va con su tipo de controlador

**MVC + JSESSIONID** encaja porque:

- El navegador maneja cookies sin JavaScript, y en MVC no hay JavaScript propio.
- Los formularios HTML no pueden añadir cabeceras `Authorization`.
- Un panel administrativo interno rara vez necesita escalar.

**REST + JWT** encaja porque:

- El frontend puede guardar el token y añadir la cabecera en cada `fetch`.
- La API la consumen también apps móviles, que no manejan cookies igual.
- Stateless es un principio de REST, y las sesiones lo violan directamente.

# ⬜ BLOQUE 4 — Referencia

---

# 1. Tablas de referencia y errores comunes

## 1.1 Anotaciones de controlador

| Anotación | Dónde va | Qué hace |
| --- | --- | --- |
| `@Controller` | Clase | Controlador MVC: devuelve nombres de vista |
| `@RestController` | Clase | `@Controller` + `@ResponseBody`: devuelve JSON |
| `@RequestMapping("/ruta")` | Clase o método | Ruta base |
| `@GetMapping` `@PostMapping` `@PutMapping` `@PatchMapping` `@DeleteMapping` | Método | Mapea el método HTTP |
| `@PathVariable` | Parámetro | Extrae de la ruta: `/events/{id}` |
| `@RequestParam` | Parámetro | Extrae de la query string: `?limit=10` |
| `@RequestBody` | Parámetro | Deserializa el JSON del cuerpo |
| `@ModelAttribute` | Parámetro | Enlaza un formulario HTML a un objeto (MVC) |
| `@RequestHeader` | Parámetro | Lee una cabecera HTTP |
| `@ResponseBody` | Método | Fuerza JSON en un `@Controller` MVC |
| `@ResponseStatus` | Método | Fija el código de estado |
| `@CrossOrigin` | Clase o método | Habilita CORS |
| `@PreAuthorize` | Método | Autorización previa. Requiere `@EnableMethodSecurity` |
| `@RestControllerAdvice` | Clase | Manejo global de excepciones (REST) |
| `@ControllerAdvice` | Clase | Manejo global de excepciones (MVC) |

## 1.2 Objetos de apoyo

| Tipo | Usado en | Para qué |
| --- | --- | --- |
| `Model` | MVC | Pasar datos a la plantilla |
| `RedirectAttributes` | MVC | Mensajes que sobreviven a un `redirect:` |
| `ResponseEntity<T>` | REST | Controlar código, cabeceras y cuerpo |
| `Page<T>` | Ambos | Resultados paginados con metadatos |
| `Optional<T>` | Ambos | Resultado que puede no existir |

## 1.3 Anotaciones de MapStruct

| Anotación | Qué hace |
| --- | --- |
| `@Mapper(componentModel = "spring")` | Genera la implementación como bean de Spring |
| `nullValuePropertyMappingStrategy = IGNORE` | Los `null` del DTO no sobrescriben la entidad |
| `@Mapping(source = "a.b", target = "c")` | Aplana una relación |
| `@Mapping(target = "x", ignore = true)` | No mapear ese campo |
| `@MappingTarget` | Modificar el objeto recibido en vez de crear uno nuevo |

## 1.4 Clases de seguridad

| Clase | Interfaz que implementa | Qué hace |
| --- | --- | --- |
| `SecurityAuthority` | `GrantedAuthority` | Adapta `Permission` a lo que Spring entiende |
| `CustomUserDetails` | `UserDetails` | Envuelve `User` y expone sus authorities |
| `CustomUserDetailsService` | `UserDetailsService` | Carga el usuario desde la BD por su nombre |
| `JwtServiceImpl` | `JwtService` | Genera, extrae y valida tokens |
| `AuthServiceImpl` | `AuthService` | Login y register |
| `JwtAuthenticationFilter` | `OncePerRequestFilter` | Valida el token en cada petición |
| `CustomSecurityFilter` | `OncePerRequestFilter` | Filtro propio (ejemplo de modo mantenimiento) |
| `AppConfig` | — | CORS, `PasswordEncoder` y las dos cadenas |

## 1.5 Errores comunes

### MVC

| Síntoma | Causa |
| --- | --- |
| `TemplateInputException: Error resolving template` | El nombre devuelto no coincide con ningún archivo en `templates/` |
| La tabla del HTML sale vacía **sin error** | El nombre de `addAttribute("x", ...)` no coincide con `${x}` en Thymeleaf |
| El navegador descarga un archivo en vez de mostrar la página | Falta la dependencia de Thymeleaf, o usaste `@RestController` |
| El mensaje de éxito no aparece tras guardar | Usaste `model.addAttribute` en vez de `redirectAttributes.addFlashAttribute` |
| Recargar tras crear duplica el registro | Falta `redirect:` (patrón POST-Redirect-GET) |
| El formulario con `method="put"` llega como GET | Los `<form>` HTML solo soportan GET y POST |
| `LazyInitializationException` al renderizar | La plantilla accedió a una relación LAZY fuera de la transacción |

### REST

| Síntoma | Causa |
| --- | --- |
| `blocked by CORS policy` | Falta `@CrossOrigin` o el bean `CorsConfigurationSource` |
| CORS falla solo en POST/PUT/DELETE | Falta permitir `OPTIONS` (peticiones preflight) |
| El JWT no llega al servidor | Falta `"Authorization"` en `setAllowedHeaders` |
| El JSON trae `password` y campos internos | Estás devolviendo la entidad en vez del DTO |
| `StackOverflowError` al llamar un endpoint | Relación bidireccional sin `@JsonIgnore`, o sin DTOs |
| Todos los campos del mapper salen `null` | Orden incorrecto en `annotationProcessorPaths`: falta `lombok-mapstruct-binding` |
| Al actualizar, los campos no enviados quedan en `null` | Falta `nullValuePropertyMappingStrategy = IGNORE` |
| El campo nuevo del DTO llega vacío | Olvidaste el `@Mapping` correspondiente (o el nombre no coincide) |

### Seguridad

| Síntoma | Causa |
| --- | --- |
| El login siempre falla con la contraseña correcta | Se guardó sin `passwordEncoder.encode()`, o se compara con `equals` |
| `403 Forbidden` con un token válido | El permiso del token no coincide con el de `@PreAuthorize` |
| `@PreAuthorize` no hace nada | Falta `@EnableMethodSecurity` |
| Tras registrarse, todo devuelve 403 | Falta recargar el usuario desde la BD antes de generar el token (Paso 6 ⑤) |
| Sigue generándose `JSESSIONID` en la API REST | Falta `SessionCreationPolicy.STATELESS` |
| La cadena REST nunca se aplica | El `securityMatcher` de la cadena MVC es demasiado amplio |
| Hasta el login exige autenticación | `.anyRequest().authenticated()` está antes de los `permitAll()` |
| La petición se queda colgada sin respuesta | Un filtro propio olvidó llamar a `filterChain.doFilter()` |
| `SignatureException` al validar | La clave secreta cambió, o el token fue manipulado |
| `WeakKeyException` al arrancar | La clave de `app.jwt.secret` es más corta de 256 bits |
| El JWT sigue funcionando tras cambiar permisos | Comportamiento normal. Requiere consultar la BD o lista negra |

## 1.6 Preguntas típicas de examen

**¿Diferencia entre `@Controller` y `@RestController`?**`@RestController` = `@Controller` + `@ResponseBody`. El primero devuelve nombres de vista para que el servidor renderice HTML (SSR); el segundo devuelve objetos que se serializan a JSON para que el cliente renderice (CSR).

**¿Diferencia entre `@PathVariable` y `@RequestParam`?**`@PathVariable` captura parte de la ruta e identifica un recurso concreto (obligatorio). `@RequestParam` captura la query string y sirve para filtrar, ordenar o paginar (normalmente opcional).

**¿Qué es idempotencia?**
Que repetir la misma petición deje el servidor en el mismo estado. GET, PUT y DELETE son idempotentes; POST no.

**¿Por qué en MVC se usa POST para actualizar y eliminar?**
Porque los formularios HTML solo soportan GET y POST. En REST no hay esa limitación y se usan PUT y DELETE.

**¿Para qué sirven los DTOs?**
Para desacoplar la API de la persistencia, ocultar datos sensibles como la contraseña, controlar qué puede modificar el cliente y evitar la recursión infinita de las relaciones bidireccionales.

**¿Por qué se usan mappers si los DTOs podrían convertirse solos?**
Porque poner constructores y métodos `fromEntity`/`toEntity` dentro del DTO lo acopla a la entidad y obliga a mantener a mano cientos de líneas de `setX(getX())`. Con MapStruct, el mapeo se genera al compilar y **los DTOs quedan como clases planas sin ningún método de conversión**.

**¿Qué diferencia hay entre JSESSIONID y JWT?**
JSESSIONID es una llave que apunta a datos guardados en la memoria del servidor (stateful). El JWT lleva los datos consigo, firmados, y el servidor solo verifica la firma (stateless).

**¿Por qué JWT es stateless?**
Porque el token contiene toda la información necesaria y está firmado. El servidor no guarda nada: solo valida la firma con su clave secreta.

**¿Se puede leer el contenido de un JWT?**
Sí. El header y el payload son Base64URL, no cifrado. Lo que impide manipularlo es la firma. Por eso nunca se ponen datos sensibles dentro.

**¿Qué pasa si a un usuario le quitan permisos y tiene un JWT activo?**
Depende del filtro. Si las authorities se leen del token, sigue teniéndolos hasta que expire. Si el filtro las recarga desde la base de datos (como en esta guía), el cambio surte efecto en la siguiente petición.

**¿Diferencia entre 401 y 403?**
401 = no sabemos quién eres (falta o falla la autenticación). 403 = sabemos quién eres, pero no tienes permiso.

**¿Por qué se desactiva CSRF en la cadena REST pero no en la MVC?**
Porque CSRF explota el envío automático de cookies. El JWT viaja en una cabecera puesta por JavaScript, así que el ataque no aplica. En MVC sí hay cookies automáticas y la protección debe seguir activa.

**¿Por qué hacen falta dos `SecurityFilterChain`?**
Porque MVC y REST necesitan configuraciones incompatibles: sesión contra stateless, CSRF activo contra desactivado, `formLogin` contra endpoint JSON.