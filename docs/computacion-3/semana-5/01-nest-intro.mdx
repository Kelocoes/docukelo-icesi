---
sidebar_position: 1
---

import PdfViewer from "@site/src/components/PdfViewer/PdfViewer";

# Introducción a NestJS

NestJS es un framework progresivo de Node.js diseñado para construir aplicaciones de servidor (backend) eficientes, confiables y escalables. Está construido con TypeScript de forma nativa y combina elementos de la Programación Orientada a Objetos (POO), la Programación Funcional (FP) y la Programación Reactiva Funcional (FRP).

---

## 1. Fundamentos Conceptuales y Arquitectura

NestJS proporciona una arquitectura de aplicación lista para usar (*out-of-the-box*) que permite a los desarrolladores y equipos crear aplicaciones altamente testeables, escalables, sueltamente acopladas y fáciles de mantener. Se inspira fuertemente en patrones de diseño probados en el desarrollo empresarial, como la **Inyección de Dependencias (DI)** y la arquitectura modular en capas (similar a Angular o Spring Boot).

### Ciclo de Vida de una Solicitud (Request Lifecycle)

En NestJS, las solicitudes HTTP entrantes atraviesan una secuencia ordenada de etapas antes de retornar una respuesta al cliente. Cada etapa cumple una función específica de seguridad, validación, orquestación o manejo de errores:

<div style={{ textAlign: "center", margin: "1.5rem 0" }}>
  <img src="/img/computacion-3/nest-request-lifecycle.svg" alt="Ciclo de vida de una solicitud HTTP en NestJS" width="100%" />
</div>

#### Etapas del Ciclo de Vida:

1. **Cliente (HTTP Request)**: El cliente (navegador, aplicación móvil o Postman) emite una petición con método, cabeceras (*headers*), parámetros y cuerpo (*body*).
2. **Middlewares**: Se ejecutan de primero con acceso a `req` y `res`. Se emplean para registros de tráfico (*logging*), análisis de cookies y habilitación de CORS.
3. **Guards (Guardias)**: Determinan si la petición tiene autorización para continuar evaluando tokens JWT, sesiones o permisos de roles.
4. **Interceptors (Pre)**: Se activan antes del controlador para enlazar contexto de ejecución, inicializar auditorías o medir tiempos de respuesta.
5. **Pipes (Tuberías)**: Validan y transforman los datos de entrada según los esquemas definidos en los DTOs (ej. validación de campos obligatorios o conversión con `ParseIntPipe`).
6. **Controller y Service**: El controlador resuelve la ruta HTTP (`@Get`, `@Post`) y delega la ejecución a los servicios inyectados, donde reside la lógica de negocio y persistencia.
7. **Interceptors (Post)**: Interceptan el valor devuelto por el servicio para mutar, envolver o formatear la estructura final de datos (por ejemplo, encapsular en `{ data: ... }`).
8. **Exception Filters (Filtros de Excepciones)**: Si ocurre un error no capturado en cualquier punto del ciclo, este filtro estandariza y serializa el mensaje de error en una respuesta HTTP limpia (400, 404, 500).
9. **Respuesta HTTP**: El servidor envía el código de estado y el payload JSON final de regreso al cliente.

---

## 2. Recurso Visual y Hoja de Ruta

A continuación puedes consultar la presentación interactiva del módulo y la hoja de atajos (*Cheatsheet*) oficial con los comandos e instrucciones clave de NestJS.

<iframe 
    src="https://www.canva.com/design/DAG-mDgHK-8/44Hv_nQphNgBu0_MODzMrg/view?embed"
    width="100%"
    height="540px"
    allowFullScreen
></iframe>

<br/>

<PdfViewer src="/files/computacion-3/Nest-cheatsheet.pdf" width="100%" height="600px" title="NestJS Cheatsheet" />

---

## 3. Cuestionario de Autoevaluación

<Quiz id="compu3-nest-intro-quiz">
  <Question title="¿Cuál es el propósito principal de los Guards (Guardias) en el ciclo de vida de una solicitud en NestJS?">
    <Option>Transformar tipos de datos como convertir strings a números enteros.</Option>
    <Option correct>Determinar si una solicitud será procesada por el controlador según reglas de autenticación o permisos.</Option>
    <Option>Capturar excepciones no controladas y formatear la respuesta de error.</Option>
    <Option>Servir archivos estáticos y assets directamente desde la memoria caché.</Option>
  </Question>
  <Question title="¿Qué responsabilidad cumplen las Pipes (Tuberías) en NestJS?">
    <Option>Iniciar la conexión con la base de datos PostgreSQL.</Option>
    <Option>Manejar el enrutamiento principal de las peticiones HTTP GET y POST.</Option>
    <Option correct>Realizar transformación y validación de los datos de entrada antes de llegar al controlador.</Option>
    <Option>Interceptar la respuesta del servidor para encriptar el payload.</Option>
  </Question>
  <Question title="¿En qué orden secuencial se evalúan las capas antes de ejecutar el manejador del controlador (Controller Route Handler)?">
    <Option>Controller -&gt; Pipes -&gt; Guards -&gt; Middlewares.</Option>
    <Option correct>Middlewares -&gt; Guards -&gt; Interceptors (Pre) -&gt; Pipes -&gt; Controller.</Option>
    <Option>Pipes -&gt; Interceptors -&gt; Exception Filters -&gt; Controller.</Option>
    <Option>Guards -&gt; Exception Filters -&gt; Middlewares -&gt; Controller.</Option>
  </Question>
  <Question title="¿Cuál es el rol principal de los Services (Servicios) en la arquitectura de NestJS?">
    <Option>Definir los decorators de las rutas HTTP como @Get() o @Post().</Option>
    <Option correct>Encapsular la lógica de negocio pura de la aplicación para ser inyectados mediante Inyección de Dependencias.</Option>
    <Option>Configurar el servidor web Nginx como proxy reverso.</Option>
    <Option>Validar únicamente las cabeceras de autorización JWT en cada petición.</Option>
  </Question>
  <Question title="¿Qué componente de NestJS se encarga de capturar errores no manejados para responder con un formato HTTP unificado?">
    <Option>Interceptors.</Option>
    <Option>Pipes.</Option>
    <Option correct>Exception Filters.</Option>
    <Option>Middlewares.</Option>
  </Question>
  <Question title="¿Qué paradigma de programación integra NestJS de manera nativa junto con TypeScript?">
    <Option>Únicamente programación orientada a objetos (POO) tradicional sin tipos.</Option>
    <Option correct>Programación Orientada a Objetos (POO), Programación Funcional (FP) y Programación Reactiva Funcional (FRP).</Option>
    <Option>Exclusivamente programación basada en procedimientos planos sin clases.</Option>
    <Option>Programación estructurada mediante scripts imperativos en Node.js puro.</Option>
  </Question>
  <Question title="¿Qué capa del ciclo de vida permite transformar o agregar lógica tanto ANTES como DESPUÉS de la ejecución del método del controlador?">
    <Option>Exception Filters.</Option>
    <Option correct>Interceptors.</Option>
    <Option>Guards.</Option>
    <Option>Pipes.</Option>
  </Question>
  <Question title="¿Cómo se inyecta un Servicio dentro de un Controlador en NestJS?">
    <Option>Importándolo con la instrucción require() dentro de cada función.</Option>
    <Option>Declarando una variable global en el archivo main.ts.</Option>
    <Option correct>A través de la Inyección de Dependencias en el constructor de la clase del Controlador.</Option>
    <Option>Ejecutando el comando nest build --inject service.</Option>
  </Question>
  <Question title="¿Qué capa del ciclo de vida es la primera en recibir y procesar la petición HTTP entrante (Request)?">
    <Option>Pipes.</Option>
    <Option correct>Middlewares.</Option>
    <Option>Guards.</Option>
    <Option>Interceptors.</Option>
  </Question>
  <Question title="¿Cuál es la función principal de los Controllers en NestJS?">
    <Option>Gestionar la persistencia física en tablas SQL.</Option>
    <Option correct>Manejar las solicitudes HTTP entrantes, procesar las rutas y devolver la respuesta adecuada al cliente.</Option>
    <Option>Compilar código TypeScript a código binario de máquina.</Option>
    <Option>Validar los esquemas de bases de datos relacionales.</Option>
  </Question>
</Quiz>
