---
sidebar_position: 1
sidebar_label: "Spring Boot"
---

# Spring Boot

**Arquitectura, Servlets, Estructura de Carpetas y Ejecución**

Spring Boot es un framework diseñado para simplificar el desarrollo de aplicaciones Java de nivel empresarial al proporcionar una capa de auto-configuración y abstracción sobre el ecosistema Spring.

<iframe 
    src="https://www.canva.com/design/DAGw9HXIKGs/-bEewM44akNfhPn7pb6XZw/view?embed"
    width="100%"
    height="600px"
    allowfullscreen="true"
    frameborder="0"
></iframe>

---

## 1. Arquitectura de Flujo y Servlets en Spring Boot

En las aplicaciones web tradicionales Java EE, las solicitudes HTTP eran procesadas directamente por Servlets registrados de forma manual en un servidor de aplicaciones. Spring Boot encapsula esta complejidad mediante el servidor web embebido (Apache Tomcat por defecto) y el patrón **Front Controller**.

### 1.1. Flujo de una Solicitud HTTP

<ZoomableMermaid value={`sequenceDiagram
    autonumber
    actor Cliente as Cliente (Navegador/Postman)
    participant Server as Servlet Container (Tomcat)
    participant DS as DispatcherServlet
    participant Ctrl as Controller Layer
    participant Svc as Service Layer
    participant Repo as Repository Layer
    participant DB as Database / Model

    Cliente->>Server: Solicitud HTTP (POST /api/v1/usuarios)
    Server->>DS: Enruta HTTP Request
    DS->>Ctrl: Intercepta y mapea Handler (UserController)
    Ctrl->>Svc: Invoca método de negocio (UserService)
    Svc->>Repo: Ejecuta operación de datos (UserRepository)
    Repo->>DB: Consulta / Persistencia (Entidad JPA)
    DB-->>Repo: Retorna resultado
    Repo-->>Svc: Objeto de Dominio / Entidad
    Svc-->>Ctrl: DTO / Modelo procesado
    Ctrl-->>DS: Response Entities / HTTP Status
    DS-->>Server: Construcción de Respuesta HTTP
    Server-->>Cliente: Respuesta HTTP (JSON / HTTP 201 Created)`} />

:::info[Explicación Detallada del Diagrama de Secuencia]
El flujo ilustra la trayectoria de una solicitud HTTP a través de la arquitectura de la aplicación:
1. **Cliente (Navegador/Postman)**: Emite la petición HTTP hacia un endpoint específico.
2. **Servlet Container (Tomcat Embebido)**: Recibe el socket TCP y extrae la estructura HTTP.
3. **DispatcherServlet**: Actúa como el *Front Controller* central. Intercepta todas las solicitudes entrantes y consulta los mapeos de la aplicación para delegar la petición al controlador adecuado.
4. **Controller Layer**: Procesa los parámetros de la solicitud, valida la entrada y delega la ejecución lógica a la capa de servicios.
5. **Service Layer**: Aplica las reglas de negocio, transacciones y orquestación.
6. **Repository Layer**: Abstrae la comunicación con el mecanismo de almacenamiento mediante interfaces de datos.
7. **Database / Model**: Realiza las operaciones físicas sobre la base de datos o estructuras de persistencia y retorna el resultado de vuelta a través del pipeline.
:::

### 1.2. El Rol de `DispatcherServlet` y `SpringBootServletInitializer`

Spring Boot utiliza `DispatcherServlet` como la columna vertebral del procesamiento de peticiones en Spring MVC:

- **`DispatcherServlet`**: Es un Servlet especial que sirve de punto de entrada único para las solicitudes HTTP. Realiza la resolución de Handlers, conversión de JSON/XML mediante `HttpMessageConverter` y manejo global de excepciones.
- **`SpringBootServletInitializer`**: Cuando una aplicación Spring Boot se despliega como un ejecutable JAR independiente, el servidor Tomcat embebido se inicia automáticamente a través de la clase principal `@SpringBootApplication`. Sin embargo, si se requiere empaquetar la aplicación como un archivo **WAR** para desplegarla en un servidor de aplicaciones externo tradicional (como Tomcat independiente, WildFly o Payara), la clase principal debe extender `SpringBootServletInitializer` y sobrescribir el método `configure`.

```java title="src/main/java/com/icesi/app/ServletInitializer.java" showLineNumbers
package com.icesi.app;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

// Esta clase permite que un servidor Servlet externo configure la aplicación cuando se despliega un WAR
public class ServletInitializer extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        // Enlaza la configuración del servlet externo con la clase principal de Spring Boot
        return application.sources(DemoApplication.class);
    }
}
```

---

## 2. Arquitectura Multicapa en Spring Boot

Una arquitectura limpia en Spring Boot promueve la separación estricta de responsabilidades dividiendo el proyecto en capas claramente delimitadas: **Model**, **Repository**, **Service** y **Controller**.

<ZoomableMermaid value={`graph TD
    classDef modelStyle fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1;
    classDef repoStyle fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e;
    classDef serviceStyle fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#166534;
    classDef ctrlStyle fill:#f3e8ff,stroke:#9333ea,stroke-width:2px,color:#6b21a8;

    C["Capa Controller<br/>(UserController)"]:::ctrlStyle --> S["Capa Service Interface<br/>(UserService)"]:::serviceStyle
    S --> SI["Service Implementation<br/>(UserServiceImpl)"]:::serviceStyle
    SI --> R["Capa Repository Interface<br/>(UserRepository)"]:::repoStyle
    R --> M["Capa Model / Entity<br/>(User)"]:::modelStyle`} />

:::info[Explicación Detallada de la Estructura por Capas]
- **Model (Modelo/Entidad)**: Representa los datos del dominio o las tablas de la base de datos.
- **Repository (Repositorio)**: Interfaz que extiende las abstracciones de persistencia (como `JpaRepository`) para gestionar operaciones CRUD.
- **Service (Servicio)**: Interfaz e implementación que contienen la lógica de negocio pura, aislamiento de transacciones y reglas del dominio.
- **Controller (Controlador)**: Recibe peticiones HTTP, efectúa la validación inicial de parámetros y envía la respuesta en el formato adecuado.
:::

### 2.1. Capa de Modelo (Model)

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

### 2.2. Capa de Repositorio (Repository Interface)

```java title="src/main/java/com/icesi/app/repository/UserRepository.java" showLineNumbers
package com.icesi.app.repository;

import com.icesi.app.model.User;
import java.util.List;
import java.util.Optional;

// Definición de interfaz de repositorio para desacoplar el acceso a datos
public interface UserRepository {
    // Guarda o actualiza una entidad en el almacenamiento
    User save(User user);
    // Busca un usuario por su identificador único
    Optional<User> findById(Long id);
    // Obtiene la lista completa de usuarios
    List<User> findAll();
    // Elimina un usuario por su identificador
    void deleteById(Long id);
}
```

### 2.3. Capa de Servicio (Service Interface e Implementación)

**Interfaz del Servicio:**

```java title="src/main/java/com/icesi/app/service/UserService.java" showLineNumbers
package com.icesi.app.service;

import com.icesi.app.model.User;
import java.util.List;

// Contrato de servicio que define los casos de uso del dominio
public interface UserService {
    // Registra un nuevo usuario aplicando reglas de negocio
    User createUser(User user);
    // Obtiene un usuario especifico por ID
    User getUserById(Long id);
    // Obtiene el listado de todos los usuarios
    List<User> getAllUsers();
}
```

**Implementación del Servicio:**

```java title="src/main/java/com/icesi/app/service/impl/UserServiceImpl.java" showLineNumbers
package com.icesi.app.service.impl;

import com.icesi.app.model.User;
import com.icesi.app.repository.UserRepository;
import com.icesi.app.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

// Marca la clase como componente de servicio de Spring para inyección de dependencias
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    // Inyección de dependencias por constructor
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User createUser(User user) {
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalArgumentException("El email del usuario es obligatorio");
        }
        return userRepository.save(user);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
```

### 2.4. Capa de Controlador (Controller Interface e Implementación)

```java title="src/main/java/com/icesi/app/controller/UserController.java" showLineNumbers
package com.icesi.app.controller;

import com.icesi.app.model.User;
import com.icesi.app.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Define un controlador REST que expone endpoints JSON
@RestController
// Establece el mapeo de ruta base para los endpoints de usuarios
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    // Inyección de dependencias por constructor
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

## 3. Estructura Típica de Carpetas en un Proyecto Spring Boot

Un proyecto estándar de Spring Boot sigue la convención de paquetes estructurada dentro de la carpeta `src/main/java/`:

```
demo-app/
├── .mvn/                                  # Archivos de configuración del Maven Wrapper
├── mvnw                                   # Script ejecutable de Maven Wrapper (Linux/macOS)
├── mvnw.cmd                               # Script ejecutable de Maven Wrapper (Windows)
├── pom.xml                                # Archivo de gestión de dependencias Maven (o build.gradle)
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/icesi/app/
│   │   │       ├── DemoApplication.java   # Clase principal anotada con @SpringBootApplication
│   │   │       ├── controller/            # Controladores REST (@RestController)
│   │   │       ├── service/               # Interfaces de servicios de negocio
│   │   │       │   └── impl/              # Implementaciones de servicios (@Service)
│   │   │       ├── repository/            # Interfaces de persistencia (@Repository / JpaRepository)
│   │   │       ├── model/                 # Entidades JPA (@Entity) y modelos de dominio
│   │   │       ├── dto/                   # Data Transfer Objects para peticiones/respuestas
│   │   │       ├── config/                # Clases de configuración (@Configuration, CORS, Security)
│   │   │       └── exception/             # Manejadores globales de excepciones (@ControllerAdvice)
│   │   └── resources/
│   │       ├── application.properties     # Configuración principal de la aplicación
│   │       ├── application-dev.properties # Configuración del perfil de Desarrollo
│   │       ├── application-prod.properties# Configuración del perfil de Producción
│   │       ├── static/                    # Archivos estáticos (CSS, JS, imágenes)
│   │       └── templates/                 # Plantillas HTML de vista (Thymeleaf, si aplica)
│   └── test/
│       └── java/com/icesi/app/            # Pruebas unitarias e integración (@SpringBootTest)
```

:::warning[Regla del Paquete Raíz]
La clase principal `DemoApplication.java` (anotada con `@SpringBootApplication`) debe colocarse en el paquete raíz `com.icesi.app`. Spring Boot realiza un escaneo automático de componentes (`@ComponentScan`) **de manera descendente** a partir del paquete donde reside esta clase. Si colocas un controlador fuera de este árbol de paquetes, Spring Boot no lo detectará.
:::

---

## 4. Ejecución de la Aplicación y Gestión de Perfiles

### 4.1. Cómo Ejecutar la Aplicación desde la Consola

Spring Boot incluye ejecutables *Wrapper* (`mvnw` y `gradlew`) para permitir la compilación y ejecución directa sin necesidad de tener Maven o Gradle instalados previamente en el sistema operativo.

<Tabs>
  <TabItem value="mvn" label="Maven Wrapper" default>

```bash title="Comandos para ejecutar con Maven Wrapper"
# En Linux / macOS:
./mvnw clean spring-boot:run

# En Windows (PowerShell / CMD):
.\mvnw.cmd clean spring-boot:run
```

  </TabItem>
  <TabItem value="gradle" label="Gradle Wrapper">

```bash title="Comandos para ejecutar con Gradle Wrapper"
# En Linux / macOS:
./gradlew clean bootRun

# En Windows (PowerShell / CMD):
.\gradlew.bat clean bootRun
```

  </TabItem>
</Tabs>

:::tip[Comprobación Previa de Instalación de Dependencias]
Antes de arrancar el servidor web con `spring-boot:run` o `bootRun`, se recomienda comprobar que todas las dependencias del proyecto y complementos se descarguen y compilen sin errores ejecutando:
- **Maven**: `./mvnw clean install` (o `mvn clean install`)
- **Gradle**: `./gradlew build` (o `./gradlew --refresh-dependencies`)
:::

### 4.2. Configuración con `application.properties`

```properties title="src/main/resources/application.properties" showLineNumbers
# Nombre de la aplicación
spring.application.name=demo-icesi-app

# Puerto de escucha del servidor web embebido (Tomcat)
server.port=8080

# Context Path: Prefijo global para la redirección de todas las solicitudes HTTP
# Ejemplo: Un endpoint @GetMapping("/users") responderá en http://localhost:8080/demo-api/users
server.servlet.context-path=/demo-api

# Configuración del sistema de logs
logging.level.root=INFO
logging.level.com.icesi.app=DEBUG
logging.file.name=logs/application.log
```

:::note[Importancia del Context Path]
Configurar `server.servlet.context-path=/demo-api` añade un prefijo obligatorio a todos los endpoints. Esto es fundamental para el redireccionamiento de solicitudes cuando la aplicación se despliega detrás de un Reverse Proxy (como Nginx) o cuando coexiste con otros servicios.
:::

### 4.3. Activación de Perfiles de Entorno mediante Línea de Comandos (CLI)

Además de definir `spring.profiles.active=dev` en el archivo `application.properties`, es muy común activar perfiles dinámicamente al momento de la ejecución desde la terminal o entornos de CI/CD:

<Tabs>
  <TabItem value="mvn" label="Maven Wrapper" default>

```bash title="Ejecución activando el perfil dev en Maven"
# En Linux / macOS:
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# En Windows (PowerShell / CMD):
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```

  </TabItem>
  <TabItem value="gradle" label="Gradle Wrapper">

```bash title="Ejecución activando el perfil dev en Gradle"
# En Linux / macOS:
./gradlew bootRun --args='--spring.profiles.active=dev'

# En Windows (PowerShell / CMD):
.\gradlew.bat bootRun --args="--spring.profiles.active=dev"
```

  </TabItem>
  <TabItem value="jar" label="Ejecutable JAR">

```bash title="Ejecución de un JAR compilado especificando el perfil"
# Opción 1: Mediante propiedad del sistema (-D)
java -Dspring.profiles.active=dev -jar target/demo-app-0.0.1-SNAPSHOT.jar

# Opción 2: Mediante argumento de aplicación (--)
java -jar target/demo-app-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev

# Opción 3: Mediante Variable de Entorno del Sistema Operativo
export SPRING_PROFILES_ACTIVE=dev
java -jar target/demo-app-0.0.1-SNAPSHOT.jar
```

  </TabItem>
</Tabs>

---

## Cuestionario de Autoevaluación

<Quiz id="s4-spring-boot-arquitectura-quiz">
  <Question title="¿Cuál es el rol principal del componente DispatcherServlet en Spring Boot?">
    <Option>Conectarse directamente a la base de datos relacional.</Option>
    <Option correct>Actuar como Front Controller central que intercepta y enruta todas las solicitudes HTTP hacia los controladores correspondientes.</Option>
    <Option>Compilar el código fuente Java a código máquina en tiempo de ejecución.</Option>
    <Option>Generar automáticamente los métodos getters y setters de los modelos.</Option>
  </Question>
  <Question title="¿En qué escenario es indispensable extender la clase SpringBootServletInitializer?">
    <Option>Al ejecutar una aplicación como un archivo ejecutable JAR independiente.</Option>
    <Option>Para activar la consola web de H2 en memoria.</Option>
    <Option correct>Al empaquetar la aplicación como un archivo WAR para desplegarla en un servidor de aplicaciones Servlet externo independiente.</Option>
    <Option>Para deshabilitar el puerto de red por defecto del servidor Tomcat.</Option>
  </Question>
  <Question title="¿Qué sucede si un controlador REST se ubica en un paquete fuera del árbol del paquete raíz anotado con @SpringBootApplication?">
    <Option>La aplicación falla inmediatamente al compilar.</Option>
    <Option correct>Spring Boot no detectará el controlador debido a que el ComponentScan por defecto solo escanea de forma descendente a partir del paquete raíz.</Option>
    <Option>El controlador responderá únicamente en el puerto 8081.</Option>
    <Option>Se deshabilitan las anotaciones de Lombok.</Option>
  </Question>
  <Question title="¿Cuál es la responsabilidad principal de la capa de Servicio (Service) en la arquitectura multicapa?">
    <Option>Recibir la petición HTTP y formatear el código de respuesta JSON.</Option>
    <Option>Ejecutar sentencias SQL directas sobre las tablas físicas.</Option>
    <Option correct>Contener la lógica de negocio pura, aislamiento de transacciones y reglas del dominio.</Option>
    <Option>Mapear únicamente las claves primarias de las entidades JPA.</Option>
  </Question>
  <Question title="¿Qué efecto tiene configurar la propiedad server.servlet.context-path=/demo-api en application.properties?">
    <Option>Cambia el puerto de escucha del servidor Tomcat a 8080.</Option>
    <Option correct>Antepone el prefijo /demo-api a todas las URIs de los controladores de la aplicación.</Option>
    <Option>Desactiva todos los registros de log del servidor.</Option>
    <Option>Forzará la ejecución de la aplicación únicamente en el perfil de producción.</Option>
  </Question>
  <Question title="¿Cuál es el comando adecuado para ejecutar una aplicación Spring Boot especificando el perfil dev mediante Maven Wrapper?">
    <Option>./mvnw clean install --profile=dev</Option>
    <Option correct>./mvnw spring-boot:run -Dspring-boot.run.profiles=dev</Option>
    <Option>./mvnw bootRun -Pdev</Option>
    <Option>java -jar app.jar -env dev</Option>
  </Question>
  <Question title="¿Cuál es la diferencia entre la interfaz de un Repositorio y su implementación en Spring Boot?">
    <Option correct>El desarrollador define la interfaz y Spring Boot genera dinámicamente la implementación de acceso a datos en tiempo de ejecución.</Option>
    <Option>La interfaz ejecuta las peticiones HTTP y la implementación las convierte a JSON.</Option>
    <Option>La interfaz pertenece a la capa de vista y la implementación a la base de datos.</Option>
    <Option>No existe diferencia, ambas son clases concretas anotadas con @Controller.</Option>
  </Question>
  <Question title="¿Qué comando con Gradle Wrapper permite ejecutar la aplicación pasando el argumento de perfil activo?">
    <Option>./gradlew run -Dprofile=dev</Option>
    <Option>./gradlew build --active-profile dev</Option>
    <Option correct>./gradlew bootRun --args=&#39;--spring.profiles.active=dev&#39;</Option>
    <Option>./gradlew spring-boot:start -dev</Option>
  </Question>
  <Question title="¿Por qué se incluye Maven Wrapper (mvnw) o Gradle Wrapper (gradlew) en la raíz del proyecto?">
    <Option>Para cifrar las contraseñas de la base de datos.</Option>
    <Option correct>Para permitir la compilación y ejecución del proyecto sin requerir la instalación previa global de Maven o Gradle en el sistema operativo.</Option>
    <Option>Para reemplazar la JVM de Java instalada en la máquina.</Option>
    <Option>Para generar diagramas de secuencia automáticos.</Option>
  </Question>
  <Question title="¿Cómo se puede activar un perfil activo al ejecutar un archivo JAR compilado desde la terminal usando variables de entorno?">
    <Option>SPRING_PORT=8080 java -jar app.jar</Option>
    <Option correct>export SPRING_PROFILES_ACTIVE=dev &amp;&amp; java -jar app.jar</Option>
    <Option>set PROFILE=dev &amp;&amp; ./mvnw run</Option>
    <Option>java -jar app.jar --port=8080</Option>
  </Question>
</Quiz>
