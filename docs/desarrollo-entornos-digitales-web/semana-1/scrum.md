---
sidebar_position: 2
---

# Metodologías Ágiles: Scrum e Historias de Usuario

Scrum es un marco de trabajo ágil utilizado para gestionar proyectos complejos, especialmente en el desarrollo de software. Se basa en principios de colaboración, flexibilidad y entrega incremental de valor. Scrum se estructura en roles, eventos y artefactos que facilitan la organización y ejecución del trabajo en equipo.

<img src={require('@site/static/img/desarrollo-entornos-digitales-web/scrum.png').default} alt="Scrum" width="800" />

## Roles en Scrum

1. **Product Owner**: Es responsable de maximizar el valor del producto y gestionar el backlog del producto. Define las prioridades y asegura que el equipo trabaje en las tareas más importantes.

2. **Scrum Master**: Facilita el proceso Scrum, ayuda al equipo a seguir las prácticas ágiles y elimina obstáculos que puedan impedir el progreso del equipo.

3. **Equipo de Desarrollo**: Son los profesionales que trabajan en la creación del producto. Son autoorganizados y multifuncionales, responsables de entregar incrementos de producto al final de cada sprint.

## Eventos en Scrum

Las ceremonias o eventos de Scrum buscan fomentar la comunicación, la planificación y la revisión continua del trabajo:

1. **Product Backlog Refinement**: Revisión y ajuste continuo del backlog del producto para asegurar que esté actualizado y priorizado.
2. **Sprint Planning Meeting**: Reunión al inicio de cada sprint donde el equipo planifica el trabajo a realizar durante el sprint.
3. **Daily Scrum**: Reunión diaria de 15 minutos donde el equipo sincroniza actividades y planifica las próximas 24 horas.
4. **Sprint Review**: Reunión al final del sprint para revisar el trabajo completado y obtener feedback del Product Owner y otros stakeholders.
5. **Sprint Retrospective**: Reunión al final del sprint para reflexionar sobre el proceso y buscar mejoras continuas.

## Artefactos en Scrum

1. **Product Backlog**: Lista priorizada de todas las funcionalidades, mejoras y correcciones necesarias para el producto.
2. **Sprint Backlog**: Conjunto de elementos del Product Backlog seleccionados para el sprint actual, junto con un plan para entregar el incremento de producto.
3. **Incremento**: La suma de todos los elementos del Product Backlog completados durante un sprint y los sprints anteriores, que debe estar en un estado utilizable y cumplir con la definición de "hecho".

## Historias de Usuario

Las historias de usuario son descripciones breves y simples de una funcionalidad desde la perspectiva del usuario final. Representan una necesidad o deseo del usuario y se utilizan para capturar requisitos de manera ágil, evitando documentación extensa y enfocándose en el valor que se entrega.

Una historia de usuario típicamente sigue el formato:

**"Como [tipo de usuario], quiero [realizar una acción] para [obtener un beneficio]"**

### Ejemplo de Historias de Usuario

1. **Historia de Usuario para un E-commerce**:

    - Como cliente, quiero agregar productos al carrito de compras para poder adquirir múltiples artículos en una sola transacción.

2. **Historia de Usuario para una Aplicación Educativa**:

    - Como estudiante, quiero ver el progreso de mis cursos para saber qué temas me faltan por completar.

3. **Historia de Usuario para un Sistema de Gestión**:
    - Como administrador, quiero generar reportes mensuales de ventas para analizar el rendimiento del negocio.

### Historias de Usuario vs. Requerimientos de Software

Aunque ambos describen lo que un sistema debe hacer, existen diferencias clave:

-   **Historias de Usuario**: Son informales, centradas en el usuario, escritas en lenguaje natural y enfocadas en el valor del negocio. Son flexibles y se refinan durante el desarrollo.

-   **Requerimientos de Software**: Son más formales, técnicos y detallados. Describen funcionalidades específicas del sistema, restricciones técnicas y criterios de aceptación precisos.

En Scrum, las historias de usuario son el enfoque preferido porque promueven la conversación y colaboración entre el equipo y los stakeholders, manteniendo la flexibilidad necesaria para adaptarse a cambios.

### Puntuación de Historias de Usuario

La puntuación de historias de usuario es una técnica utilizada para estimar el esfuerzo o la complejidad relativa de implementar una historia de usuario. Una de las metodologías más comunes para puntuar historias de usuario es el uso de la **Escala de Fibonacci** (1, 2, 3, 5, 8, 13, 21, etc.), que refleja la naturaleza creciente del esfuerzo requerido a medida que las historias se vuelven más complejas.

#### Proceso de Puntuación - Planning Poker

1. **Revisión de la Historia**: El equipo revisa la historia de usuario para comprender su alcance y los requisitos asociados.
2. **Discusión**: El equipo discute los aspectos técnicos, riesgos y dependencias relacionados con la historia.
3. **Asignación de Puntos**: Cada miembro del equipo asigna una puntuación basada en su percepción del esfuerzo necesario. Se pueden utilizar técnicas como el Planning Poker para facilitar este proceso.
4. **Consenso**: Si hay discrepancias significativas en las puntuaciones, el equipo discute las razones y vuelve a puntuar hasta llegar a un consenso.

<img src={require('@site/static/img/desarrollo-entornos-digitales-web/planning_poker.png').default} alt="Planning Poker" width="600" />

---

## Cuestionario de Autoevaluación

<Quiz id="web-env-scrum-quiz">
  <Question title="En la metodología Scrum, ¿quién es el principal responsable de gestionar el Product Backlog y priorizar sus elementos?">
    <Option>El Scrum Master.</Option>
    <Option correct>El Product Owner.</Option>
    <Option>El Equipo de Desarrollo.</Option>
    <Option>El Gerente de Infraestructura.</Option>
  </Question>
  <Question title="¿Cuál es el rol principal del Scrum Master dentro del equipo?">
    <Option>Asignar tareas individuales a los desarrolladores diariamente.</Option>
    <Option correct>Facilitar el proceso Scrum, promover prácticas ágiles y remover obstáculos que impidan el avance del equipo.</Option>
    <Option>Aprobar o rechazar el presupuesto económico del proyecto.</Option>
    <Option>Escribir el código de los requerimientos no funcionales.</Option>
  </Question>
  <Question title="¿Qué reunión diaria de corta duración (aprox. 15 minutos) permite al equipo sincronizar sus actividades y planificar las siguientes 24 horas?">
    <Option>Sprint Planning Meeting.</Option>
    <Option>Sprint Retrospective.</Option>
    <Option correct>Daily Scrum.</Option>
    <Option>Product Backlog Refinement.</Option>
  </Question>
  <Question title="¿En qué evento de Scrum el equipo reflexiona sobre el proceso de trabajo del sprint finalizado para identificar mejoras continuas?">
    <Option>Sprint Review.</Option>
    <Option correct>Sprint Retrospective.</Option>
    <Option>Daily Scrum.</Option>
    <Option>Sprint Planning Meeting.</Option>
  </Question>
  <Question title="¿Cuál es la principal diferencia entre el Product Backlog y el Sprint Backlog?">
    <Option correct>El Product Backlog contiene todas las funcionalidades deseadas del producto; el Sprint Backlog contiene solo los elementos seleccionados para el sprint actual.</Option>
    <Option>El Product Backlog es técnico y el Sprint Backlog es comercial.</Option>
    <Option>El Sprint Backlog es administrado por el cliente y el Product Backlog por el Scrum Master.</Option>
    <Option>No hay diferencia, son dos nombres para la misma lista de tareas.</Option>
  </Question>
  <Question title="¿Cuál es el formato estándar comúnmente utilizado para redactar una Historia de Usuario?">
    <Option>Dado que [contexto], Cuando [evento], Entonces [resultado].</Option>
    <Option correct>Como [tipo de usuario], quiero [realizar una acción] para [obtener un beneficio].</Option>
    <Option>SI [condición] ENTONCES [acción] SINO [excepción].</Option>
    <Option>El sistema debe [acción] sobre [objeto] en [métrica].</Option>
  </Question>
  <Question title="En comparación con los requerimientos formales de software, ¿cuál es una característica clave de las Historias de Usuario?">
    <Option>Son documentos rígidos e inmutables que no se pueden modificar.</Option>
    <Option correct>Son descripciones breves, informales y centradas en el usuario que promueven la conversación y flexibilidad.</Option>
    <Option>Detallan las consultas SQL exactas que deben ejecutarse en la base de datos.</Option>
    <Option>Suelen redactarse en código ensamblador.</Option>
  </Question>
  <Question title="¿Por qué se utiliza comúnmente la Escala de Fibonacci (1, 2, 3, 5, 8, 13...) en la estimación de Historias de Usuario?">
    <Option>Porque permite calcular la velocidad en horas exactas de trabajo.</Option>
    <Option correct>Porque refleja la incertidumbre y complejidad creciente a medida que el tamaño de las tareas aumenta.</Option>
    <Option>Porque es la única escala aceptada por los compiladores de TypeScript.</Option>
    <Option>Porque impone un límite máximo de 5 historias de usuario por sprint.</Option>
  </Question>
  <Question title="Durante la técnica de Planning Poker, ¿qué debe hacer el equipo si existe una discrepancia significativa en la puntuación otorgada por los miembros?">
    <Option>Tomar el promedio matemático exacto de todas las cartas mostradas.</Option>
    <Option>Asignar automáticamente el valor más alto posible sin discutir.</Option>
    <Option correct>Discutir las razones detrás de las estimaciones extremas y volver a votar hasta alcanzar un consenso.</Option>
    <Option>Cancelar el sprint inmediatamente.</Option>
  </Question>
  <Question title="En Scrum, ¿qué se exige para que un Incremento de producto sea considerado válido al final de un Sprint?">
    <Option>Que incluya la totalidad de las historias de usuario de todo el proyecto.</Option>
    <Option correct>Que se encuentre en un estado utilizable y cumpla con la definición de "Hecho" (Definition of Done).</Option>
    <Option>Que haya sido probado únicamente en tiempo de compilación.</Option>
    <Option>Que no contenga ninguna interfaz gráfica.</Option>
  </Question>
  <Question title="Evalúa la siguiente Historia de Usuario: 'El sistema debe conectarse a la base de datos PostgreSQL utilizando JDBC para consultar los registros de usuarios.' ¿Es esta una Historia de Usuario correctamente especificada?">
    <Option>Verdadero. Está bien especificada porque describe una funcionalidad técnica requerida para el funcionamiento del sistema.</Option>
    <Option>Verdadero. Es correcta porque define con claridad los componentes de software y protocolos que utilizará el equipo de desarrollo.</Option>
    <Option correct>Falso. Está mal especificada porque no sigue la estructura centrada en el usuario ('Como [rol], quiero [acción] para [beneficio]') y describe un requerimiento técnico de implementación en lugar de una necesidad de negocio.</Option>
    <Option>Falso. Está mal especificada únicamente porque menciona PostgreSQL en lugar de MySQL.</Option>
  </Question>
  <Question title="Evalúa la siguiente Historia de Usuario: 'Como cliente de la tienda, quiero agregar productos a mi lista de deseos para guardarlos y comprarlos en una sesión posterior.' ¿Es esta una Historia de Usuario correctamente especificada?">
    <Option correct>Verdadero. Está bien especificada porque identifica el rol del usuario ('cliente de la tienda'), la acción deseada ('agregar a lista de deseos') y el beneficio de negocio ('comprarlos en una sesión posterior').</Option>
    <Option>Verdadero. Es correcta porque indica exactamente qué tabla y columna de la base de datos debe mutar al hacer clic.</Option>
    <Option>Falso. Está mal especificada porque el beneficio debería omitirse para mantener la historia lo más corta posible.</Option>
    <Option>Falso. Está mal especificada porque solo el administrador del sistema puede realizar acciones de compra.</Option>
  </Question>
  <Question title="Evalúa la siguiente Historia de Usuario: 'Como usuario, quiero presionar el botón azul de la esquina superior derecha.' ¿Es esta una Historia de Usuario correctamente especificada?">
    <Option>Verdadero. Es correcta porque indica de forma precisa el elemento de interfaz de usuario con el que se debe interactuar.</Option>
    <Option correct>Falso. Está mal especificada porque omite el propósito o beneficio del valor de negocio ('para [beneficio]') y se enfoca en un detalle visual de UI en lugar de la necesidad funcional del usuario.</Option>
    <Option>Verdadero. Está bien especificada porque especifica el color y la ubicación exacta del componente gráfico.</Option>
    <Option>Falso. Está mal especificada únicamente porque el botón debería ser de color verde según las guías de Scrum.</Option>
  </Question>
  <Question title="Evalúa la siguiente Historia de Usuario: 'Como estudiante, quiero filtrar los cursos por su nivel de dificultad para encontrar únicamente el contenido adecuado a mis conocimientos previos.' ¿Es esta una Historia de Usuario correctamente especificada?">
    <Option>Falso. Está mal especificada porque el beneficio es demasiado extenso y debería redactarse como un requerimiento no funcional de rendimiento.</Option>
    <Option>Falso. Está mal especificada porque no incluye la consulta SQL necesaria para ordenar los cursos.</Option>
    <Option correct>Verdadero. Está bien especificada porque cumple con el formato estándar ('Como [rol], quiero [acción] para [beneficio]'), expresando una necesidad real del estudiante y el valor que le aporta.</Option>
    <Option>Verdadero. Es correcta porque exige al desarrollador utilizar TypeScript para construir los filtros.</Option>
  </Question>
  <Question title="Evalúa la siguiente Historia de Usuario: 'Como cliente, quiero registrar una cuenta, pagar con tarjeta de crédito, calificar la atención del repartidor y solicitar una factura para usar la aplicación.' ¿Es esta una Historia de Usuario correctamente especificada?">
    <Option>Verdadero. Está bien especificada porque abarca múltiples funcionalidades esenciales dentro de una sola frase eficiente.</Option>
    <Option>Verdadero. Es correcta porque especifica todos los pasos que el cliente realizará desde que entra hasta que sale del sistema.</Option>
    <Option>Falso. Está mal especificada únicamente porque el rol de 'cliente' debe ser reemplazado por 'administrador'.</Option>
    <Option correct>Falso. Está mal especificada porque agrupa múltiples funcionalidades no atómicas en una sola historia (registro, pago, calificación y facturación), dificultando su estimación, desarrollo e independencia.</Option>
  </Question>
</Quiz>


