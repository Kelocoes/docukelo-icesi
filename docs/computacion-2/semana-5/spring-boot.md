---
sidebar_position: 1
---

# Spring Boot: Introducción y Primeros Pasos

> **Versión de referencia:** Spring Boot 3.x (Jakarta EE), Java 17+.

---

## 1. Panorama general: Spring Framework, Spring Context y Spring Boot

| Tecnología | ¿Qué es? | ¿Para qué se usa? | ¿Qué configuras tú? |
|---|---|---|---|
| **Spring Framework (Core)** | Conjunto de módulos (Core, Beans, AOP, MVC, Data, Security…) | Base para crear aplicaciones Java con IoC/DI, MVC, etc. | Casi todo: servidores, `DispatcherServlet`, DataSource, ViewResolvers, JSON, logging… |
| **Spring Context** | Implementación del contenedor IoC (ApplicationContext) | Gestiona beans, ciclo de vida, eventos | Definir beans/manual wiring; poco “azúcar sintáctico” |
| **Spring Boot** | Capa de productividad **sobre** Spring | Arranque rápido, **Auto‑Configuration**, **Starters**, **Tomcat embebido**, **Actuator**, **DevTools** | Mucho menos: declaras dependencias “starter” y propiedades; Boot configura lo común por ti |

**Idea clave:** con Spring “puro” tú diseñas y cableas casi todo. Con **Spring Boot** declaras la intención y Boot configura lo estándar de forma **opinionated** (por convención), reduciendo *boilerplate* y tiempo de arranque del proyecto.

---

## 2. Arranque del proyecto (Initializr, CLI y plantillas)

### 2.1. Spring Initializr (la vía más común)
- Sitio: [start.spring.io](https://start.spring.io) (o vía IDE).
- Eliges: **Project** (**Maven**/Gradle), **Language** (**Java**/Kotlin), **Spring Boot Version**, **Packaging** (Jar/**War**), **Java** (17+), y **Dependencies** (starters).
- Dependencias recomendadas para el curso:
    - Spring Web
    - Thymeleaf
    - Spring Data JPA
    - H2 Database
    - PostgreSQL Driver
    - Lombok

### 2.2. ¿Por qué es más simple que Spring “puro”?
- No configuras un Tomcat externo ni `web.xml` ni el `DispatcherServlet` manualmente.
- No defines decenas de beans típicos; Boot los **auto-configura** si detecta las dependencias correctas.

---

## 3. Aplicación mínima en Spring Boot

**Clase principal** con `@SpringBootApplication`:
```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
  public static void main(String[] args) {
    SpringApplication.run(DemoApplication.class, args);
  }
}
```

**Controlador REST** básico:
```java
package com.example.demo.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
  @GetMapping("/hello")
  public String hello() {
    return "Hola Spring Boot 👋";
  }
}
```

**Cómo arrancar:**
```bash
# Maven Wrapper
./mvnw spring-boot:run

# Gradle Wrapper
./gradlew bootRun
```
---

## 4. Servidor embebido (Tomcat) y alternativas

- **Tomcat embebido** viene por defecto con `spring-boot-starter-web` (MVC).
- Ventajas: ejecución con `java -jar`, ideal para **containers**/DevOps; no necesitas instalar un servidor aparte.
- Alternativas:
  - Jetty: reemplaza starter Tomcat por `spring-boot-starter-jetty`
  - Undertow: `spring-boot-starter-undertow`

---

## 5. `application.properties` / `application.yml` y configuración externa

Spring Boot soporta **Externalized Configuration**: propiedades en archivos, variables de entorno, argumentos de línea, etc.

### 5.1. Estructura básica
`src/main/resources/application.properties` **o** `application.yml`.

**Ejemplo (properties):**
```properties
spring.application.name=demo-boot
logging.level.org.springframework.web=INFO
```

**Ejemplo (YAML equivalente):**
```yaml
spring:
  application:
    name: demo-boot
logging:
  level:
    org.springframework.web: INFO
```

### 5.2. Perfiles (`application-{profile}.properties`)
Permiten variar config por entorno.

```properties
# application-dev.properties
server.port=8080
spring.datasource.url=jdbc:h2:mem:devdb
spring.jpa.hibernate.ddl-auto=create-drop

# application-prod.properties
server.port=8080
spring.datasource.url=jdbc:postgresql://db:5432/app
spring.jpa.hibernate.ddl-auto=validate
```

---

## 6. Estructura de carpetas (qué crea y para qué sirve)

```
demo-boot/
├─ mvnw / gradlew                 # Wrappers para Maven/Gradle
├─ pom.xml / build.gradle         # Build y dependencias
├─ src/
│  ├─ main/
│  │  ├─ java/
│  │  │  └─ com/example/demo/
│  │  │     ├─ DemoApplication.java        # Clase principal @SpringBootApplication
│  │  │     ├─ api/                        # Controladores REST (controllers)
│  │  │     ├─ service/                    # Servicios de dominio (lógica)
│  │  │     ├─ repository/                 # Repositorios (Spring Data JPA)
│  │  │     ├─ domain/ or model/           # Entidades JPA / modelos
│  │  │     ├─ config/                     # Configuración adicional (CORS, Swagger, etc.)
│  │  │     ├─ security/                   # Configuración de seguridad
│  │  │     └─ exception/                  # Manejo global de errores
│  │  └─ resources/
│  │     ├─ application.properties|yml     # Configuración externa
│  │     ├─ static/                        # Recursos estáticos (css, js, imágenes)
│  │     ├─ templates/                     # Vistas Thymeleaf/Freemarker (si usas MVC con plantillas)
│  │     └─ db/
│  │        ├─ migration/                  # Scripts Flyway (V1__init.sql, …)
│  │        └─ changelog/                  # Archivos Liquibase (alternativa)
│  └─ test/
│     └─ java/com/example/demo/            # Pruebas (@SpringBootTest, slices, etc.)
```

> **Regla importante:** el paquete de la clase principal define el **alcance de escaneo** (`@ComponentScan`). Coloca controladores/servicios/repositorios **debajo** del paquete raíz para que Boot los detecte automáticamente.

---

## 7. Logging, Actuator y observabilidad

### 7.1. Logging (Logback por defecto)
```properties
logging.level.root=INFO
logging.level.com.example.demo=DEBUG
logging.file.name=logs/app.log
```

### 7.2. Spring Boot Actuator
Añade **health checks**, métricas, info de app, etc.
```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

**Exponer endpoints vía HTTP:**
```properties
management.endpoints.web.exposure.include=health,info,metrics,env,beans,threaddump
management.endpoint.health.show-details=always
```

**Ejemplos de endpoints:** `/actuator/health`, `/actuator/metrics`, `/actuator/beans`.

> En producción, protege estos endpoints (por red o con Spring Security).

---

## 8. Utilidades muy útiles en Boot

- **DevTools** (reinicio rápido, LiveReload):
  ```xml
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
  </dependency>
  ```
- **Banner personalizado** (`src/main/resources/banner.txt`)
- **`CommandLineRunner` / `ApplicationRunner`** para datos iniciales:
  ```java
  @Bean
  CommandLineRunner seed(BookRepository repo) {
    return args -> repo.saveAll(List.of(
      new Book(null,"Clean Code","Robert C. Martin"),
      new Book(null,"Effective Java","Joshua Bloch")
    ));
  }
  ```

---

## 9. Diferencias prácticas al migrar desde Spring “puro”

1. **Eliminar** configuraciones manuales redundantes (XML/Java Config) si Boot ya las auto-configura.
2. **Agregar** starters adecuados (web, data-jpa, validation, security, actuator).
3. **Mover** la clase principal al paquete raíz y reubicar componentes para el `@ComponentScan` por convención.
4. **Externalizar** parámetros en `application.yml`.
5. **Revisar** Jakarta EE (`jakarta.*`) si vienes de Spring 5/Boot 2 (cambios de paquetes).

---

## 10. Checklist de propiedades frecuentes (cheat‑sheet)

```properties
# App
spring.application.name=demo

# Server
server.port=8080
server.servlet.context-path=/api
server.compression.enabled=true

# Carga de archivos
spring.servlet.multipart.max-file-size=20MB
spring.servlet.multipart.max-request-size=20MB

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Datasource (Postgres)
spring.datasource.url=jdbc:postgresql://localhost:5432/demo
spring.datasource.username=demo
spring.datasource.password=secret

# H2 console
spring.h2.console.enabled=true
spring.h2.console.path=/h2

# Logging
logging.level.root=INFO
logging.level.com.example=DEBUG
logging.file.name=logs/app.log

# Actuator
management.endpoints.web.exposure.include=health,info,metrics,prometheus
management.endpoint.health.show-details=always
```

---

## 11. Conclusión

- **Spring Boot** no reemplaza a Spring; **lo potencia** con convenciones, auto-configuración y herramientas de observabilidad.
- En desarrollo académico y profesional, acelera del “hola mundo” a un backend productivo con menos fricción, listos para **tests**, **contenedores** y **DevOps**.
- Dominar Boot implica entender cómo y cuándo **sobre‑escribir** la auto-configuración con tus propios beans cuando sea necesario.