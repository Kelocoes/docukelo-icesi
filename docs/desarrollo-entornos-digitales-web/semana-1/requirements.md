---
sidebar_position: 1
---

# Requerimientos en el Desarrollo de Software

Los requerimientos describen las necesidades y restricciones que un producto de software debe satisfacer para contribuir a la solución de un problema del mundo real. Funcionan como un medio de comunicación entre los stakeholders y el equipo de desarrollo, y establecen la base para las actividades técnicas y de gestión a lo largo del proyecto.

Desde el punto de vista del desarrollo de software, los requerimientos pueden entenderse desde dos perspectivas complementarias:

- **Expresión de necesidades**: describen qué se espera que el sistema haga y bajo qué condiciones, a partir de las necesidades del contexto real.
- **Marco de referencia para el desarrollo**: orientan las decisiones de análisis, diseño, implementación y verificación del sistema.

:::warning
Si el equipo realiza un trabajo deficiente en la determinación de los requerimientos, es común que se presenten:

- Incrementos en el tiempo de desarrollo
- Incrementos en el costo del proyecto
- Retrasos importantes o cancelaciones  
  :::

## Problemas Relacionados con los Requerimientos

En la práctica, existen dos problemas principales asociados a los requerimientos:

- **Incompletitud**: cuando no se capturan todas las necesidades, reglas de negocio o restricciones relevantes del sistema.
- **Ambigüedad**: cuando un requerimiento puede interpretarse de más de una forma, lo que puede llevar a implementaciones inconsistentes.

Estos problemas suelen originarse por una comprensión limitada del dominio, una comunicación deficiente con los stakeholders o una documentación poco precisa.

## Requerimientos y Ciclo de Vida del Software

Los requerimientos están presentes a lo largo de todas las fases del ciclo de vida del software y no se limitan únicamente a una etapa inicial.

<img src="/img/software-lifecycle.png" alt="Ciclo de vida del software" width="800" />

:::info
El análisis de requerimientos suele ser una de las fases más subestimadas del desarrollo de software, a pesar de que sus resultados influyen directamente en las fases posteriores.
:::

En este contexto, los requerimientos del software:

- No son necesariamente una actividad de _front-end_ o de inicio del proyecto.
- Constituyen un **proceso continuo** que se ajusta conforme evoluciona el entendimiento del sistema.
- Deben estar enlazados a la organización y al contexto del proyecto, incluyendo aspectos técnicos, organizacionales y operativos.

## Fundamentos de Requerimientos

Los requerimientos se definen como:

- Una **condición o capacidad** necesitada por el usuario para resolver un problema o alcanzar un objetivo.
- Una **condición o capacidad** que debe ser cumplida o poseída por un sistema para satisfacer un contrato, estándar, especificación u otro documento formalmente impuesto.
- Una **declaración** que identifica una necesidad, capacidad, característica o atributo de calidad que debe ser incluido en el sistema.

Estas definiciones reflejan que los requerimientos pueden originarse tanto en necesidades explícitas de los usuarios como en restricciones externas impuestas al sistema.

## Tipos de Requerimientos

Existen dos tipos principales de requerimientos.

### 1. Requerimientos del Producto de Software

Especifican la forma esperada del software y su funcionamiento una vez desarrollado.

#### 1.1 Requerimientos Funcionales

Describen las funciones o servicios que el sistema debe proveer. Indican cómo el sistema debe reaccionar ante determinadas entradas o eventos.

Ejemplos comunes incluyen:

- Procesamiento de información
- Interacción con usuarios
- Comunicación con otros sistemas

#### 1.2 Requerimientos No Funcionales

Describen las restricciones bajo las cuales el sistema debe operar. No definen qué hace el sistema, sino cómo lo hace.

Incluyen aspectos como:

- Rendimiento: tiempos de respuesta, capacidad de procesamiento
- Usabilidad: facilidad de uso, accesibilidad
- Fiabilidad: disponibilidad, tolerancia a fallos
- Seguridad: confidencialidad, integridad, autenticación

##### 1.2.1 Restricciones de Tecnología

Obligan o prohíben el uso específico de tecnologías, plataformas o infraestructuras.

Ejemplos:

- Lenguajes de programación permitidos: Java, Python, JavaScript
- Infraestructura de despliegue: nube, on-premise, híbrida.
- Motores de bases de datos: MySQL, PostgreSQL, etc.

##### 1.2.2 Restricciones de Calidad

Establecen expectativas relacionadas con el comportamiento del sistema.

Preguntas típicas asociadas a este tipo de requerimientos incluyen:

- ¿En qué plataformas de cómputo debe ejecutarse el sistema?
- ¿Qué motor de base de datos debe utilizarse?
- ¿Con qué rapidez deben presentarse los resultados al usuario?

### 2. Requerimientos del Proceso de Software

Especifican las actividades y los recursos necesarios para desarrollar el software.

Incluyen aspectos como:

- Costos
- Tiempo
- Personal
- Herramientas y entorno de desarrollo

Estos requerimientos influyen directamente en la planificación y organización del proyecto.

## Elicitación de Requerimientos

La elicitación de requerimientos es el proceso de **descubrir, documentar y entender** los requerimientos del software desde las perspectivas de los stakeholders.

### Stakeholders

Un stakeholder es cualquier persona o entidad que:

- Está activamente involucrada en el proyecto
- Se ve afectada por el resultado del proyecto
- Puede influir en el resultado del proyecto

Stakeholders típicos incluyen:

- Clientes
- Usuarios finales
- Desarrolladores
- Gerentes de proyecto

### Técnicas de Elicitación

Los requerimientos pueden obtenerse mediante distintas técnicas, entre ellas:

- Entrevistas
- Reuniones
- Cuestionarios
- Análisis de protocolos
- Grupos focales

### Otras Fuentes de Requerimientos

Además de los stakeholders, los requerimientos pueden ser elicitados a partir de:

- Versiones pasadas del sistema
- Sistemas que se enlazan con el sistema bajo desarrollo
- Búsqueda de literatura
- Descripciones de escenarios de uso

## Análisis de Requerimientos

El análisis de requerimientos es el proceso de examinar los requerimientos elicitados para asegurar que sean completos, consistentes y viables.

Durante este proceso, los requerimientos deben cumplir con las siguientes características:

- Ser **no ambiguos**, es decir, interpretables de una sola forma
- Ser **verificables**, de modo que pueda demostrarse que el sistema los cumple
- Ser **atómicos**, sin combinar múltiples requerimientos en una sola declaración
- Representar una necesidad real del usuario o del sistema
- Utilizar el vocabulario propio del dominio del problema
- Ser aceptables para los stakeholders

En conjunto, los requerimientos deben ser:
**completos, concisos, consistentes y viables**.

## Especificación de Requerimientos

La especificación de requerimientos consiste en documentarlos de manera estructurada para facilitar su uso durante el desarrollo.

:::info
Las herramientas de gestión de proyectos ayudan a organizar los requerimientos y las tareas asociadas al desarrollo del software.
:::

Algunas herramientas comúnmente utilizadas son:

- [Jira](https://www.atlassian.com/software/jira)
- [Trello](https://trello.com/es)
- [ClickUp](https://clickup.com)

## Escritura de Requerimientos

La forma en que se redactan los requerimientos es crucial para su comprensión y uso efectivo. Una escritura clara, precisa y bien estructurada facilita la comunicación entre stakeholders, reduce ambigüedades y permite que el equipo de desarrollo implemente soluciones que verdaderamente satisfagan las necesidades del sistema.

### Características de una Buena Escritura de Requerimientos

Un requerimiento bien escrito debe cumplir con las siguientes características:

- **Claridad**: debe ser fácil de leer y entender por todos los stakeholders
- **Precisión**: debe utilizar términos específicos y evitar vaguedades
- **Concisión**: debe expresar la idea completa sin palabras innecesarias
- **Verificabilidad**: debe poder comprobarse mediante pruebas o inspección
- **Trazabilidad**: debe poder rastrearse desde su origen hasta su implementación

### Forma Usual de Redacción

La forma más común de redactar requerimientos funcionales sigue una estructura que incluye:

**Para requerimientos funcionales**, se suele utilizar el formato:

```
El sistema debe [acción] [objeto] [condición opcional]
```

**Para requerimientos no funcionales**, se prefiere:

```
El sistema debe [característica de calidad] [métrica medible] [en contexto específico]
```

### Patrones de Escritura Recomendados

#### 1. Uso de Verbos en Modo Imperativo

Los requerimientos deben expresarse utilizando verbos que indiquen obligación:

- **Debe** (obligatorio)
- **Debería** (recomendado pero no obligatorio)
- **Puede** (opcional)

Ejemplos:

- "El sistema **debe** validar el formato del correo electrónico antes de registrar un usuario"
- "El sistema **debería** mostrar un mensaje de confirmación después de guardar los datos"
- "El sistema **puede** permitir exportar los reportes en formato PDF"

#### 2. Evitar Ambigüedades

Palabras como "adecuado", "rápido", "fácil" o "flexible" son subjetivas y deben evitarse.

Ejemplos:

**Incorrecto**: "El sistema debe tener un tiempo de respuesta rápido"

**Correcto**: "El sistema debe responder a las consultas del usuario en menos de 2 segundos bajo condiciones normales de operación"

**Incorrecto**: "La interfaz debe ser fácil de usar"

**Correcto**: "El sistema debe permitir que un usuario nuevo complete el proceso de registro en menos de 3 minutos sin necesidad de asistencia"

#### 3. Requerimientos Atómicos

Cada requerimiento debe expresar una sola necesidad. Si contiene múltiples ideas, debe dividirse.

**Incorrecto**: "El sistema debe permitir al usuario registrarse, iniciar sesión y recuperar su contraseña"

**Correcto**:

- "El sistema debe permitir al usuario crear una cuenta proporcionando correo electrónico y contraseña"
- "El sistema debe permitir al usuario iniciar sesión utilizando correo electrónico y contraseña"
- "El sistema debe permitir al usuario recuperar su contraseña mediante un enlace enviado a su correo electrónico"

### Ejemplos de Requerimientos Funcionales Bien Redactados

**Ejemplo 1 - Autenticación**:

> REQ-FUN-001: El sistema debe autenticar al usuario mediante correo electrónico y contraseña, bloqueando la cuenta después de 5 intentos fallidos consecutivos durante un período de 15 minutos.

**Ejemplo 2 - Búsqueda**:

> REQ-FUN-002: El sistema debe permitir a los usuarios buscar productos por nombre, categoría o rango de precio, mostrando los resultados en formato de lista paginada con 20 elementos por página.

**Ejemplo 3 - Notificaciones**:

> REQ-FUN-003: El sistema debe enviar una notificación por correo electrónico al usuario cuando su pedido cambie de estado, incluyendo el número de seguimiento y la fecha estimada de entrega.

**Ejemplo 4 - Procesamiento de Pagos**:

> REQ-FUN-004: El sistema debe procesar pagos con tarjeta de crédito utilizando una pasarela de pago segura (PCI-DSS compliant), mostrando confirmación de la transacción dentro de los 5 segundos posteriores a la autorización.

**Ejemplo 5 - Generación de Reportes**:

> REQ-FUN-005: El sistema debe generar reportes mensuales de ventas en formato Excel, incluyendo totales por categoría de producto, región geográfica y método de pago, disponibles para descarga por usuarios con rol de Administrador.

### Ejemplos de Requerimientos No Funcionales Bien Redactados

**Ejemplo 1 - Rendimiento**:

> REQ-NFR-001: El sistema debe ser capaz de procesar al menos 1000 transacciones simultáneas sin que el tiempo de respuesta promedio exceda los 3 segundos.

**Ejemplo 2 - Disponibilidad**:

> REQ-NFR-002: El sistema debe estar disponible el 99.9% del tiempo mensual, excluyendo ventanas de mantenimiento programado notificadas con 48 horas de anticipación.

**Ejemplo 3 - Seguridad**:

> REQ-NFR-003: El sistema debe cifrar todas las contraseñas de usuario utilizando el algoritmo bcrypt con un factor de costo mínimo de 12 antes de almacenarlas en la base de datos.

**Ejemplo 4 - Usabilidad**:

> REQ-NFR-004: El sistema debe cumplir con las pautas de accesibilidad WCAG 2.1 nivel AA para garantizar que usuarios con discapacidades visuales puedan navegar utilizando lectores de pantalla.

**Ejemplo 5 - Escalabilidad**:

> REQ-NFR-005: La arquitectura del sistema debe soportar el incremento de la base de usuarios de 10,000 a 100,000 usuarios activos mensuales sin necesidad de rediseño significativo de la infraestructura.

**Ejemplo 6 - Mantenibilidad**:

> REQ-NFR-006: El código fuente del sistema debe mantener una cobertura de pruebas unitarias de al menos 80% y documentación técnica actualizada para facilitar el mantenimiento futuro.

## Actividad de Requerimientos

Una organización dedicada a la promoción de actividades recreativas y sociales, centradas principalmente en juegos de mesa y experiencias competitivas organizadas, ha identificado la necesidad de contar con un sistema de información que apoye la gestión de sus eventos y la interacción entre los usuarios que participan en ellos.

Actualmente, la organización coordina múltiples encuentros donde personas se reúnen para jugar distintos tipos de juegos, algunos de manera casual y otros con un carácter más estructurado y competitivo. Estos encuentros pueden variar en número de participantes, tipo de juego, ubicación y estado (por ejemplo, planificados, en curso o finalizados). El crecimiento sostenido de la comunidad ha hecho evidente que los mecanismos actuales (listas manuales, comunicación informal y registros dispersos) ya no son suficientes para garantizar un control adecuado ni una buena experiencia para los participantes.

El sistema que se desea desarrollar debe permitir a la organización mantener un registro centralizado de los usuarios que hacen parte de la comunidad, considerando que no todos cumplen el mismo rol ni tienen las mismas responsabilidades. Algunos usuarios se encargan de crear y administrar juegos, otros de organizar encuentros, mientras que el resto participa activamente en las sesiones. Asimismo, la organización requiere establecer ciertos niveles de acceso y acciones permitidas dentro del sistema, de acuerdo con las funciones que cumple cada usuario.

Por otra parte, cada juego manejado por la organización cuenta con características propias, como una descripción general, restricciones en el número de jugadores y una clasificación que permita agruparlos según su tipo o categoría. Estos juegos pueden ser utilizados en múltiples encuentros a lo largo del tiempo, y es importante conservar información histórica sobre su uso y aceptación dentro de la comunidad.

Durante los encuentros organizados, se desea llevar un control de los participantes, su desempeño y algunos resultados relevantes una vez finalizada la actividad. Esta información resulta clave tanto para fines estadísticos como para fomentar la competitividad y el compromiso de los usuarios. No obstante, no todos los encuentros requieren el mismo nivel de detalle, por lo que el sistema debe adaptarse a diferentes dinámicas de juego.

Adicionalmente, la organización considera importante ofrecer espacios de interacción donde los usuarios puedan compartir opiniones, observaciones o valoraciones relacionadas con los juegos, con el fin de enriquecer la experiencia colectiva y apoyar la toma de decisiones futuras sobre qué actividades promover.

Desde el punto de vista del negocio, el objetivo principal del sistema es mejorar la gestión de la comunidad y de los eventos, reducir la carga operativa asociada a la organización manual de los encuentros y contar con información confiable que apoye la planificación y mejora continua de las actividades. El sistema deberá estar disponible a través de una plataforma digital, accesible para los distintos tipos de usuarios, y alinearse con las políticas internas de control y seguridad de la información definidas por la organización.

### Instrucciones

A partir de la descripción anterior, se espera que de forma individual:

1. Identifique y documente **15 requerimientos funcionales** expresados como historias de usuario siguiendo la estructura:

    ```
    Como [tipo de usuario], quiero [realizar una acción] para [obtener un beneficio]
    ```

    Considere los diferentes roles mencionados en la problemática (administradores, organizadores, participantes) y las funcionalidades clave del sistema (gestión de usuarios, juegos, encuentros, participación y valoraciones).
2. Proponga **3 requerimientos no funcionales** relevantes para el sistema, siguiendo un formato estructurado que incluya:
    - Descripción clara y verificable
    - Métrica o criterio medible asociado

3. Entregue un **documento PDF** que contenga:
    - Listado de las 15 historias de usuario con identificadores (HU-001, HU-002, etc.)
    - Listado de los 3 requerimientos no funcionales

    **Nota**: Se sugiere utilizar herramientas de IA generativa (proporcionando un prompt adecuado basado en esta documentación) para facilitar la generación de propuestas coherentes y bien estructuradas.

No se espera una única solución correcta; se valorará la coherencia, claridad y capacidad de interpretación del problema :).
