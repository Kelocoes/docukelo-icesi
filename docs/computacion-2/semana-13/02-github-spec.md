---
sidebar_position: 2
description: "Metodología Spec-driven Development (SDD) con GitHub Spec Kit y la arquitectura artesanal con AGENTS.md y .agents/."
---

# Spec-driven Development

En la era del desarrollo de software asistido por Inteligencia Artificial, la velocidad para escribir código ha dejado de ser el principal cuello de botella. Hoy en día, herramientas como **GitHub Copilot, Cursor, Claude Code y Antigravity** pueden generar cientos de líneas de código en segundos. Sin embargo, esta velocidad introduce un nuevo riesgo crítico: la codificación descontrolada (*vibe coding*), donde los modelos de lenguaje alucinan librerías obsoletas, violan la arquitectura por capas y generan deuda técnica masiva.

Para solucionar este desafío surge el **Spec-driven Development (SDD)** o **Desarrollo Basado en Especificaciones**: una disciplina que traslada el foco desde *"generar código rápido"* hacia *"definir con precisión arquitectónica qué debe construirse antes de escribir una sola línea de código"*.

En este capítulo exploraremos la comparativa entre el SDLC tradicional y SDD, cómo las **6 fases de GitHub Spec Kit** formalizan este flujo, y cómo aplicar la **metodología artesanal y universal** mediante un archivo `AGENTS.md` y la carpeta `.agents/` en nuestros proyectos de Spring Boot.

---

## 1. SDLC Tradicional vs. Spec-driven Development

En el ciclo de vida de desarrollo de software tradicional (**SDLC**), la documentación suele concebirse como un subproducto burocrático que se desactualiza tan pronto como el código se modifica. En **SDD**, la especificación en Markdown es el **motor ejecutable** que guía estrictamente la generación de código.

Explora la comparativa en paralelo de las 6 fases fundacionales de SDD frente a los riesgos del flujo tradicional:

<iframe src="/interactive/computacion-2/semana-13/sdlc-vs-sdd/index.html" title="SDLC vs Spec-driven Development" style={{ width: '100%', height: 620, border: 0 }} loading="lazy" />

### De la Herramienta CLI al Estándar Universal

GitHub Spec Kit formalizó inicialmente este flujo con una herramienta de terminal (`specify-cli`), instalable a través de `uv`:

```bash title="Instalación y uso de GitHub Spec Kit oficial"
# 1. Instalar uv (gestor de herramientas en Rust)
curl -LsSf https://astral.sh/uv/install.sh | sh

# 2. Instalar specify-cli
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# 3. Inicializar un repositorio
specify init mi-proyecto-backend
```

Sin embargo, depender de comandos y ejecutables externos introduce fricciones en equipos heterogéneos y cajas negras. La práctica profesional moderna adopta una **abstracción artesanal**: estructurar el contexto directamente en carpetas y archivos Markdown versionados en Git.

---

## 2. SDD Artesanal: Arquitectura con `AGENTS.md` y `.agents/`

La metodología artesanal sitúa el control en un archivo de constitución raíz (`AGENTS.md`) y un directorio reservado de contexto (`.agents/`).

Interactúa con el siguiente diagrama para recorrer cómo se organizan las carpetas de memoria, especificaciones, planes técnicos y tareas, y cómo viaja la información hacia el agente de IA:

<iframe src="/interactive/computacion-2/semana-13/sdd-artesanal-flow/index.html" title="SDD Artesanal con AGENTS.md y .agents/" style={{ width: '100%', height: 680, border: 0 }} loading="lazy" />

---

## 3. Guía Práctica Paso a Paso: Implementando un Módulo con SDD Artesanal

A continuación construiremos desde cero la especificación formal para un nuevo requerimiento en nuestro backend de Spring Boot: **Módulo de Auditoría de Acciones de Usuario (`AuditLog`)**.

<StepByStep>
  <Step number="1" title="Crear la Constitución Raíz: AGENTS.md">
    En la raíz de tu proyecto, crea el archivo `AGENTS.md`. Este documento es el primer archivo que cualquier agente de IA lee al iniciar una sesión de trabajo.

    ```markdown title="AGENTS.md" showLineNumbers
    # Manual de Operación y Constitución del Agente

    Eres un Ingeniero de Software Senior especializado en desarrollo backend empresarial con Spring Boot y Java 17.

    ## Reglas de Oro Inmutables (Non-Negotiable Rules)
    1. **Arquitectura en Capas Estricta**: Controller -> Service -> Repository. Está terminantemente prohibido inyectar repositorios directamente en los controladores.
    2. **DTOs Obligatorios**: Nunca expongas entidades JPA (@Entity) en los endpoints REST. Toda comunicación usa Records o Clases DTO inmutables con validaciones (jakarta.validation.constraints.*).
    3. **Manejo Centralizado de Excepciones**: No captures excepciones con bloques try-catch vacíos. Lanza excepciones de dominio y manéjalas en @RestControllerAdvice.
    4. **Regla de Ejecución Atómica**: No implementes funcionalidades completas de una sola vez. Consulta .agents/tasks/ y ejecuta estrictamente una tarea por iteración.

    ## Directorio de Contexto
    * [Memoria Técnica](.agents/memory/tech-stack.md): Versiones oficiales de frameworks y base de datos.
    * [Reglas de Arquitectura](.agents/memory/architecture.md): Convenciones de nomenclatura y diseño.
    ```
  </Step>

  <Step number="2" title="Definir la Memoria Permanente: .agents/memory/">
    Crea la carpeta `.agents/memory/` y registra las restricciones tecnológicas en `tech-stack.md` para evitar que el agente utilice librerías incompatibles:

    ```markdown title=".agents/memory/tech-stack.md" showLineNumbers
    # Restricciones Técnicas del Stack

    - **Lenguaje**: Java 17 (LTS) - usar Records, Text Blocks y Switch Expressions.
    - **Framework**: Spring Boot 3.3.x.
    - **Seguridad**: Spring Security 6 con JWT stateless (filtro custom JwtAuthenticationFilter).
    - **Base de Datos**: PostgreSQL 16 con Spring Data JPA y Hibernate 6.
    - **Validaciones**: Jakarta Validation (@NotNull, @NotBlank, @Positive, @Email).
    - **Documentación de API**: Springdoc OpenAPI v2 (Swagger UI en /swagger-ui.html).
    ```
  </Step>

  <Step number="3" title="Redactar la Especificación Funcional: .agents/specs/">
    En `.agents/specs/feat-audit-spec.md`, redacta el **qué**. Define la necesidad del usuario, las entradas y salidas JSON, y los criterios de aceptación en formato Gherkin:

    ```markdown title=".agents/specs/feat-audit-spec.md" showLineNumbers
    # Especificación: Registro de Historial de Auditoría (Audit Log)

    ## 1. Historia de Usuario
    **Como** administrador del sistema,
    **quiero** que cada acción crítica (login, creación de cursos, cambio de roles) quede registrada en un log de auditoría persistente,
    **para** auditar la seguridad de la plataforma y cumplir con normas de trazabilidad.

    ## 2. Endpoints Requeridos
    - `POST /api/v1/audit-logs`: Endpoint interno para registrar eventos de auditoría.
    - `GET /api/v1/audit-logs`: Endpoint protegido (ROLE_ADMIN) con paginación (page, size) y orden descendente por fecha.

    ## 3. Esquema del Payload JSON (Entrada)
    ```json
    {
      "action": "COURSE_CREATED",
      "userEmail": "profesor@icesi.edu.co",
      "details": "Curso ID 101 registrado con 3 créditos",
      "ipAddress": "192.168.1.45"
    }
    ```

    ## 4. Criterios de Aceptación (Gherkin)
    - **Escenario 1**: Registro exitoso de auditoría
      - *Dado* que un usuario autenticado realiza una acción crítica,
      - *Cuando* el servicio emite una petición POST a `/api/v1/audit-logs` con campos válidos,
      - *Entonces* el sistema responde con HTTP 201 Created y persiste el evento con marca de tiempo UTC.

    - **Escenario 2**: Validación de campos obligatorios
      - *Dado* un payload con `action` vacío o `userEmail` con formato no válido,
      - *Cuando* se envía la petición,
      - *Entonces* el sistema responde con HTTP 400 Bad Request y un listado de errores de validación.
    ```
  </Step>

  <Step number="4" title="Fase Clarify: El Diálogo Crítico con el Agente">
    Antes de generar código, proporciona el archivo `.agents/specs/feat-audit-spec.md` al agente y ejecútale la siguiente orden:

    ```text title="Prompt de Clarificación (Clarify)"
    Revisa la especificación .agents/specs/feat-audit-spec.md a la luz de AGENTS.md y .agents/memory/.
    Hazme de 3 a 5 preguntas sobre casos borde, índices en base de datos o manejo de errores que no estén explícitamente claros.
    No generes código todavía.
    ```

    :::note[Ejemplo de Dudas que Revela la Fase Clarify]
    - *¿Qué sucede si la base de datos de auditoría falla? ¿Debe abortar la transacción principal (Rollback) o registrarse de forma asíncrona sin bloquear al usuario?*
    - *¿La búsqueda en `/api/v1/audit-logs` requerirá filtrado por rango de fechas o por email de usuario?*
    
    Resolver estas dudas en el documento Markdown **antes de programar** ahorra horas de refactorización posterior.
    :::
  </Step>

  <Step number="5" title="Diseñar el Plan Técnico: .agents/plans/">
    Una vez aclarada la especificación, se redacta el **cómo** técnico en `.agents/plans/feat-audit-plan.md`:

    ```markdown title=".agents/plans/feat-audit-plan.md" showLineNumbers
    # Plan Técnico: Módulo de Auditoría

    ## 1. Arquitectura de Componentes
    1. **Entidad JPA**: `AuditLog.java` con tabla `audit_logs`, clave primaria `UUID`, columnas indexadas `created_at` y `user_email`.
    2. **DTOs**: `CreateAuditLogRequest.java` (Record) y `AuditLogResponse.java` (Record).
    3. **Repositorio**: `AuditLogRepository.java` extiende `JpaRepository<AuditLog, UUID>`.
    4. **Servicio**: `AuditLogService.java` (interfaz) y `AuditLogServiceImpl.java` con método `@Transactional(propagation = Propagation.REQUIRES_NEW)`.
    5. **Controlador**: `AuditLogController.java` en `/api/v1/audit-logs` con `@PreAuthorize("hasRole('ADMIN')")` para el listado.

    ## 2. Riesgos y Decisiones Clave
    - **Aislamiento**: Usar `REQUIRES_NEW` para que el log quede guardado incluso si la operación del usuario posterior genera un error.
    - **Rendimiento**: Crear índice compuesto B-Tree sobre `(user_email, created_at)` para optimizar consultas de administradores.
    ```
  </Step>

  <Step number="6" title="Desglose de Tareas Atómicas: .agents/tasks/">
    El plan se divide en tareas pequeñas, numeradas y con criterio de aceptación claro en `.agents/tasks/feat-audit-tasks.md`:

    ```markdown title=".agents/tasks/feat-audit-tasks.md" showLineNumbers
    # Checklist de Tareas: Módulo de Auditoría

    - [ ] **Tarea 1: Modelo de Persistencia**
      - Crear entidad `AuditLog.java` con campos UUID, action, userEmail, details, ipAddress, createdAt.
      - Crear migración SQL o schema DDL con índice en `created_at`.
      - *Criterio de verificación*: Compila y la tabla se crea en PostgreSQL.

    - [ ] **Tarea 2: Capa de DTOs y Validación**
      - Crear `CreateAuditLogRequest` con anotaciones `@NotBlank` y `@Email`.
      - Crear `AuditLogResponse` con campos formateados.
      - *Criterio de verificación*: Pruebas unitarias de validación pasan.

    - [ ] **Tarea 3: Repositorio y Servicio de Negocio**
      - Crear `AuditLogRepository` con paginación `findAllByOrderByCreatedAtDesc`.
      - Implementar `AuditLogServiceImpl` con propagación transaccional.
      - *Criterio de verificación*: Prueba de integración en memoria guarda el registro.

    - [ ] **Tarea 4: Controlador REST y Seguridad**
      - Crear `AuditLogController` con endpoints POST y GET paginado.
      - Proteger GET con rol ADMIN y documentar con `@Operation` de OpenAPI.
      - *Criterio de verificación*: Pruebas en Postman (201 Created y 400 Bad Request).
    ```
  </Step>

  <Step number="7" title="Ejecución Guiada con el Agente de IA">
    Con las tareas desglosadas, interactúa con el agente autorizando **estrictamente una sola tarea**:

    ```text title="Prompt de Ejecución Controlada"
    Lee AGENTS.md, .agents/plans/feat-audit-plan.md y la Tarea 1 de .agents/tasks/feat-audit-tasks.md.
    Implementa ÚNICAMENTE la Tarea 1 (Entidad AuditLog y repositorio).
    No toques controladores ni servicios.
    Cuando termines, muestra el código creado y detén tu ejecución.
    ```

    Al terminar el agente, compilas tu backend, verificas que no haya errores, marcas `[x]` en la Tarea 1 y autorizas la Tarea 2.
  </Step>
</StepByStep>

---

## 4. Buenas Prácticas para el Desarrollo Asistido por Agentes

Para obtener el máximo rendimiento al aplicar SDD con herramientas de IA en tus proyectos de Computación en Internet:

1. **La Regla de una Sola Tarea (Single-Task Rule)**: Nunca le pidas a un agente implementar múltiples módulos o capas simultáneas sin validación intermedia.
2. **La Verdad Vive en Markdown, No en el Chat**: Toda decisión que tomes durante una conversación con la IA debe quedar asentada en un archivo de `.agents/specs/` o `.agents/plans/`. Los chats son volátiles; los archivos `.md` persisten en el repositorio y son leídos por cualquier miembro del equipo.
3. **Validación Cruzada con Postman**: Cada tarea de controlador implementada mediante SDD debe ser verificada inmediatamente contra la colección de pruebas de Postman configurada en la sección anterior.

---

## Cuestionario de Autoevaluación

<Quiz id="c2-semana-13-sdd-quiz">
  <Question title="¿Cuál es la diferencia fundamental entre el enfoque de SDLC tradicional y Spec-driven Development (SDD)?">
    <Option>En SDD no se realizan pruebas de software automáticas.</Option>
    <Option correct>En SDD la especificación en Markdown es el motor ejecutable que guía estrictamente la generación de código, en lugar de ser un documento redactado a posteriori.</Option>
    <Option>En SDLC tradicional los modelos de lenguaje escriben el código de forma completamente autónoma sin supervisión.</Option>
    <Option>SDD solo funciona en aplicaciones de consola sin base de datos.</Option>
  </Question>

  <Question title="¿Cuál es el rol principal del archivo 'AGENTS.md' en la raíz de un repositorio?">
    <Option>Compilar el código fuente de Spring Boot y generar el archivo JAR de producción.</Option>
    <Option>Almacenar las contraseñas y claves privadas de la base de datos de producción.</Option>
    <Option correct>Actuar como la Constitución del proyecto: define la identidad del agente, reglas no negociables de arquitectura y enlaces a la memoria del repositorio.</Option>
    <Option>Reemplazar el archivo pom.xml o build.gradle del proyecto.</Option>
  </Question>

  <Question title="¿Qué tipo de información debe almacenarse en el directorio .agents/memory/?">
    <Option>Las credenciales de acceso a la cuenta bancaria de la empresa.</Option>
    <Option correct>Restricciones tecnológicas estables (versiones de Java, Spring Boot, convenciones de DTOs y reglas de arquitectura) que evitan alucinaciones de librerías incompatibles.</Option>
    <Option>El historial de commits de Git en formato binario.</Option>
    <Option>Los ejecutables compilados de Docker y Postgres.</Option>
  </Question>

  <Question title="¿Qué aspecto del desarrollo se define en el directorio .agents/specs/?">
    <Option>El CÓMO técnico detallado, como las clases Java, métodos y consultas SQL nativas.</Option>
    <Option correct>El QUÉ funcional desde la perspectiva del usuario: historias de usuario, esquemas de entrada/salida JSON y criterios de aceptación en formato Gherkin.</Option>
    <Option>El presupuesto económico y la nómina de los desarrolladores.</Option>
    <Option>La configuración de los puertos de red en el switch de la universidad.</Option>
  </Question>

  <Question title="¿Cuál es el propósito de la fase 'Clarify' antes de proceder al plan técnico de implementación?">
    <Option>Escribir los controladores REST de Spring Boot para ver cómo se comportan.</Option>
    <Option correct>Interrogar la especificación para identificar ambigüedades, resolver casos borde y acordar decisiones críticas antes de tocar código.</Option>
    <Option>Desplegar la aplicación en un servidor en la nube para pruebas de estrés.</Option>
    <Option>Eliminar todos los comentarios del código para reducir el tamaño del proyecto.</Option>
  </Question>

  <Question title="¿Qué define un documento técnico ubicado en .agents/plans/?">
    <Option>El salario mensual de cada programador del equipo de backend.</Option>
    <Option correct>El CÓMO arquitectónico: entidades JPA, contratos de DTOs, estrategias de transacción (@Transactional), índices y decisiones de diseño técnico.</Option>
    <Option>La lista de compras de hardware para los servidores.</Option>
    <Option>El contrato legal de términos y condiciones para el usuario final.</Option>
  </Question>

  <Question title="¿Qué características deben tener las tareas redactadas en .agents/tasks/?">
    <Option>Deben ser instrucciones de más de 500 líneas que abarquen todo el sistema de una sola vez.</Option>
    <Option>No deben tener criterios de verificación para que el agente tenga total libertad creativa.</Option>
    <Option correct>Deben ser atómicas, numeradas secuencialmente y acompañadas de un criterio de verificación concreto (por ejemplo, compilación o prueba unitaria).</Option>
    <Option>Deben redactarse en lenguaje ensamblador para máxima velocidad de ejecución.</Option>
  </Question>

  <Question title="¿Por qué se recomienda la 'Regla de una Sola Tarea' (Single-Task Rule) al guiar agentes de IA?">
    <Option>Porque los modelos de lenguaje solo pueden procesar una petición al día.</Option>
    <Option>Para obligar al desarrollador a escribir código a mano en lugar de delegar en la IA.</Option>
    <Option correct>Porque reduce el riesgo de alucinaciones, mantiene la atención del modelo enfocada y permite al desarrollador validar y verificar antes de continuar.</Option>
    <Option>Porque los repositorios Git no permiten guardar múltiples archivos en un commit.</Option>
  </Question>

  <Question title="¿Por qué se afirma que en SDD 'La Verdad Vive en Markdown, No en el Chat'?">
    <Option>Porque los clientes de chat de IA cobran por palabra escrita.</Option>
    <Option correct>Porque las conversaciones de chat son volátiles y se pierden, mientras que los archivos Markdown se versionan en Git y los lee cualquier agente o miembro del equipo.</Option>
    <Option>Porque los archivos Markdown ejecutan código binario más rápido que la ventana de chat.</Option>
    <Option>Porque Spring Boot solo compila archivos con extensión .md.</Option>
  </Question>

  <Question title="¿Cómo se complementa la metodología SDD con las pruebas en Postman al finalizar la implementación de un controlador?">
    <Option>Postman no se utiliza cuando se aplica la metodología SDD.</Option>
    <Option correct>Permite realizar una validación cruzada inmediata de los endpoints implementados contra la colección automatizada de pruebas y aserciones.</Option>
    <Option>Postman se encarga de formatear los archivos Markdown de la carpeta .agents/.</Option>
    <Option>Postman genera automáticamente las entidades JPA en el paquete repository.</Option>
  </Question>
</Quiz>

---

## Recursos recomendados

- [Repositorio Oficial de GitHub Spec Kit](https://github.com/github/spec-kit)
- [Principios de Spec-driven Development con LLMs](https://scrummanager.com/community/spec-driven-development-qu-es-de-dnde-viene-y-por-qu-importa)
- [Guía de Spring Boot 3 y Arquitectura Empresarial](https://spring.io/projects/spring-boot)
