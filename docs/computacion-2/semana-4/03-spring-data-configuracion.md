---
sidebar_position: 3
sidebar_label: "Spring Data JPA"
---

# Spring Data JPA

**Configuración de Base de Datos, Datasource y Persistencia**

Spring Data JPA es un módulo dentro del ecosistema Spring Data que proporciona una abstracción de alto nivel para gestionar la persistencia de datos relacionales reduciendo sustancialmente el código de acceso a datos.

---

## 1. ¿Qué es Spring Data y cómo se instala?

**Spring Data** busca estandarizar el acceso a bases de datos relacionales y NoSQL. **Spring Data JPA** extiende la especificación JPA para automatizar la creación de repositorios mediante interfaces.

### 1.1. Dependencias en Maven y Gradle

**En Maven (`pom.xml`):**

```xml title="pom.xml" showLineNumbers
<dependencies>
    <!-- Starter de Spring Data JPA (incluye Hibernate, Spring Data y JPA) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- Base de datos H2 para entorno de desarrollo/pruebas -->
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Driver de PostgreSQL para producción/desarrollo relacional -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

**En Gradle (`build.gradle`):**

```groovy title="build.gradle" showLineNumbers
dependencies {
    // Dependencia de Spring Data JPA
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    // Driver de base de datos H2
    runtimeOnly 'com.h2database:h2'
    // Driver de PostgreSQL
    runtimeOnly 'org.postgresql:postgresql'
}
```

:::tip[Comprobación de la Instalación de Dependencias de Persistencia]
Una vez agregados los starters de Spring Data JPA y los drivers JDBC (`h2` o `postgresql`), verifica que los artefactos de persistencia se descargaron e instalaron correctamente en tu repositorio local ejecutando:
- **Maven**: `./mvnw clean install` (o `mvn clean install`)
- **Gradle**: `./gradlew build` (o `./gradlew --refresh-dependencies`)

Este procedimiento asegura que Hibernate, las especificaciones de Jakarta EE y los controladores de BD estén disponibles antes de arrancar la aplicación.
:::

---

## 2. Desglose Detallado de `application.properties`

A continuación se analizan paso a paso las propiedades clave de configuración de persistencia para PostgreSQL y H2:

```properties title="src/main/resources/application.properties" showLineNumbers
# ==========================================
# 1. CONFIGURACIÓN DE DATASOURCE (PostgreSQL)
# ==========================================
# URL de conexión JDBC hacia PostgreSQL (Host: localhost, Puerto: 5432, Base de datos: boardgame)
spring.datasource.url=jdbc:postgresql://localhost:5432/boardgame

# Usuario con permisos de lectura/escritura en PostgreSQL
spring.datasource.username=postgres

# Contraseña de la base de datos
spring.datasource.password=postgres

# Clase del driver JDBC oficial de PostgreSQL
spring.datasource.driver-class-name=org.postgresql.Driver

# Dialecto de Hibernate para optimizar las consultas SQL generadas hacia PostgreSQL
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect


# ==========================================
# 2. ALTERNATIVA: BASE DE DATOS H2 (En Memoria o Archivo)
# ==========================================
# Driver oficial para H2 Database
# spring.datasource.driver-class-name=org.h2.Driver

# Opción A: H2 en Memoria RAM
# spring.datasource.url=jdbc:h2:mem:db-kevin;DB_CLOSE_DELAY=-1

# Opción B: H2 Persistido en Archivo local (crea el archivo ./db-kevin.mv.db)
# spring.datasource.url=jdbc:h2:./db-kevin;DB_CLOSE_DELAY=-1

# Credenciales por defecto en H2
# spring.datasource.username=postgres
# spring.datasource.password=postgres


# ==========================================
# 3. GESTIÓN DE ESQUEMA CON HIBERNATE (ddl-auto)
# ==========================================
# Define la estrategia de generación automática del esquema DDL:
# - none: No realiza ninguna modificación en la BD.
# - validate: Valida que las tablas coincidan con las entidades JPA (falla si hay diferencias).
# - update: Actualiza la estructura de la base de datos agregando nuevas columnas o tablas sin borrar datos.
# - create: Crea el esquema al iniciar, borrando tablas previas si existían.
# - create-drop: Crea el esquema al iniciar la app y lo destruye completamente al cerrar la aplicación.
spring.jpa.hibernate.ddl-auto=create-drop


# ==========================================
# 4. INICIALIZACIÓN DE DATOS CON SCRIPTS SQL
# ==========================================
# Define cuándo deben ejecutarse los archivos schema.sql y data.sql:
# - always: Ejecuta los scripts SQL siempre durante el arranque.
# - never: Nunca ejecuta scripts SQL automáticos.
spring.sql.init.mode=always

# Muestra u oculta las sentencias SQL ejecutadas por Hibernate en la consola de logs
spring.jpa.show-sql=false

# Diferimiento de la inicialización del DataSource:
# Esta propiedad es fundamental. Al estar en 'true', fuerza a que Spring Boot espere a que Hibernate
# termine de crear las tablas (ddl-auto) ANTES de intentar ejecutar el archivo data.sql.
spring.jpa.defer-datasource-initialization=true


# ==========================================
# 5. CONSOLA WEB DE H2
# ==========================================
# Habilita la interfaz web interactiva para inspeccionar la base de datos H2 desde el navegador
spring.h2.console.enabled=true

# Ruta URI para ingresar a la consola de H2 (ejemplo: http://localhost:8080/h2-console)
spring.h2.console.path=/h2-console
```

:::note[¿Por qué es indispensable `DB_CLOSE_DELAY=-1` en H2?]
Por defecto, las bases de datos H2 en memoria eliminan todo su contenido y se destruyen en el instante en que la última conexión JDBC activa se cierra. Al colocar el parámetro `;DB_CLOSE_DELAY=-1` en la cadena de conexión JDBC (`jdbc:h2:mem:db-kevin;DB_CLOSE_DELAY=-1`), le indicamos a H2 que **mantenga viva la base de datos en memoria** durante toda la vida útil del proceso JVM de Spring Boot, evitando la pérdida prematura del esquema y datos iniciales.
:::

---

## 3. Carga de Datos Iniciales con `data.sql`

Cuando `spring.jpa.defer-datasource-initialization=true` y `spring.sql.init.mode=always` están configurados, Spring Boot buscará automáticamente el archivo `data.sql` dentro de la carpeta `src/main/resources/`.

```sql title="src/main/resources/data.sql" showLineNumbers
-- Script de datos iniciales ejecutado automáticamente al arrancar la aplicación
INSERT INTO usuarios (nombre, email) VALUES ('Kevin', 'kevin@icesi.edu.co');
INSERT INTO usuarios (nombre, email) VALUES ('Ana', 'ana@icesi.edu.co');
INSERT INTO usuarios (nombre, email) VALUES ('Carlos', 'carlos@icesi.edu.co');
```

---

## Cuestionario de Autoevaluación

<Quiz id="s4-spring-data-config-quiz">
  <Question title="¿Cuál es la función del parámetro DB_CLOSE_DELAY=-1 en la URL JDBC de una base de datos H2 en memoria?">
    <Option>Deshabilitar la conexión con PostgreSQL.</Option>
    <Option correct>Mantener viva la base de datos en memoria RAM durante toda la vida útil de la JVM, evitando la destrucción del esquema cuando se cierra la última conexión JDBC.</Option>
    <Option>Forzar a Hibernate a ejecutar el comando ddl-auto=validate.</Option>
    <Option>Cambiar el puerto HTTP del servidor Tomcat al puerto 5432.</Option>
  </Question>
  <Question title="¿Por qué es indispensable la propiedad spring.jpa.defer-datasource-initialization=true cuando se utiliza data.sql y ddl-auto=create-drop?">
    <Option>Para ignorar los errores de compilación del archivo pom.xml.</Option>
    <Option correct>Para forzar a Spring Boot a esperar a que Hibernate cree las tablas físicas antes de intentar ejecutar las sentencias SQL de data.sql.</Option>
    <Option>Para desactivar la consola de H2 en el navegador.</Option>
    <Option>Para evitar el uso de drivers JDBC relacionales.</Option>
  </Question>
  <Question title="¿Qué realiza la estrategia spring.jpa.hibernate.ddl-auto=create-drop?">
    <Option>Únicamente valida que las tablas existan sin alterarlas.</Option>
    <Option correct>Crea el esquema de tablas al arrancar la aplicación y lo destruye completamente al cerrar el proceso de Spring Boot.</Option>
    <Option>No realiza ninguna modificación en la base de datos relacional.</Option>
    <Option>Elimina permanentemente el archivo data.sql del proyecto.</Option>
  </Question>
  <Question title="¿Cuál es el starter de Maven requerido para integrar el módulo de persistencia Spring Data JPA en Spring Boot?">
    <Option>spring-boot-starter-web</Option>
    <Option correct>spring-boot-starter-data-jpa</Option>
    <Option>spring-boot-starter-security</Option>
    <Option>spring-boot-starter-jdbc-only</Option>
  </Question>
  <Question title="¿En qué ruta por defecto busca Spring Boot el archivo data.sql para poblar registros iniciales?">
    <Option>src/main/java/data.sql</Option>
    <Option correct>src/main/resources/data.sql</Option>
    <Option>src/test/resources/sql/data.sql</Option>
    <Option>target/classes/db/data.sql</Option>
  </Question>
  <Question title="¿Qué propiedad habilita la interfaz gráfica interactiva para consultar la base de datos H2 en el navegador?">
    <Option>spring.h2.console.active=true</Option>
    <Option correct>spring.h2.console.enabled=true</Option>
    <Option>spring.datasource.console=always</Option>
    <Option>logging.level.h2=DEBUG</Option>
  </Question>
  <Question title="¿Cuál es la diferencia entre configurar H2 en memoria (mem:db) vs H2 persistido en archivo (./db)?">
    <Option>H2 en memoria requiere PostgreSQL instalado y H2 en archivo no.</Option>
    <Option correct>H2 en memoria almacena los datos en RAM perdiéndose al apagar el proceso, mientras que H2 en archivo guarda la base de datos en el disco local.</Option>
    <Option>H2 en archivo no soporta sentencias INSERT en data.sql.</Option>
    <Option>No hay diferencia, ambas opciones borran los datos en cada solicitud HTTP.</Option>
  </Question>
  <Question title="¿Qué efecto tiene configurar spring.sql.init.mode=always?">
    <Option>Desactiva la ejecución de cualquier script SQL.</Option>
    <Option correct>Fuerza la ejecución automática de los scripts de inicialización SQL (como data.sql) siempre que la aplicación arranque.</Option>
    <Option>Configura el puerto de la consola H2 en el valor 8080.</Option>
    <Option>Genera contraseñas cifradas en PostgreSQL.</Option>
  </Question>
  <Question title="¿Qué comando de consola se recomienda para verificar que los artefactos de Spring Data JPA se descargaron correctamente en el repositorio local?">
    <Option>./mvnw spring-boot:run-db</Option>
    <Option correct>./mvnw clean install (o ./gradlew build)</Option>
    <Option>./mvnw test-jpa --offline</Option>
    <Option>java -jar data.jar</Option>
  </Question>
  <Question title="¿Cuál es la función del dialecto org.hibernate.dialect.PostgreSQLDialect?">
    <Option>Crear automáticamente los usuarios de PostgreSQL en el sistema operativo.</Option>
    <Option correct>Indicarle a Hibernate cómo traducir óptimamente las consultas a la sintaxis SQL específica de PostgreSQL.</Option>
    <Option>Desactivar las claves foráneas de las tablas.</Option>
    <Option>Formatear la respuesta JSON de las peticiones REST.</Option>
  </Question>
</Quiz>