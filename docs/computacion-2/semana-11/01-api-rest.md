---
sidebar_position: 1
sidebar_label: "API REST"
---

# API REST

En el desarrollo de sistemas distribuidos y aplicaciones web modernas, comprender cómo viaja la información entre el cliente y el servidor es esencial. Antes de profundizar en el diseño de endpoints, debemos analizar los dos paradigmas fundamentales de manejo de estado en la web: **Stateful** y **Stateless**.

---

## 1. Modelos de Comunicación: Stateful vs. Stateless

La distinción entre un servicio **stateful** (con estado) y **stateless** (sin estado) radica en **dónde y cómo se almacena el contexto de las interacciones** entre peticiones sucesivas.

<div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
  <img
    src="/img/computacion-2/rest-stateful-vs-stateless.svg"
    alt="Modelos de Comunicación Web: Stateful vs. Stateless"
    style={{ width: "100%", maxWidth: "980px" }}
  />
</div>

### Desglose Arquitectónico del Diagrama

| Componente del Diagrama | Enfoque Stateful (Con Estado) | Enfoque Stateless (Sin Estado / REST) |
| :--- | :--- | :--- |
| **Cliente HTTP** | Almacena una cookie de sesión (como `JSESSIONID`) que actúa únicamente como un puntero hacia la memoria del servidor. | Almacena y envía toda la información requerida (parámetros, credenciales o token JWT) en cada solicitud HTTP. |
| **Balanceador de Carga (Load Balancer)** | Debe implementar *Sticky Sessions* (enrutar al mismo servidor siempre) o replicar memoria entre nodos para evitar desconexiones. | Puede distribuir el tráfico de forma aleatoria (*Round Robin*) entre cualquier réplica disponible sin riesgo de pérdida de sesión. |
| **Memoria del Servidor (RAM)** | Almacena objetos en memoria (`HttpSession`), lo que incrementa el consumo de RAM proporcionalmente a los usuarios activos. | Cero memoria dedicada a sesiones. Cada réplica solo valida la petición o firma criptográfica al vuelo. |
| **Resiliencia ante Fallos** | Si un servidor colapsa, todas las sesiones almacenadas en su memoria RAM se destruyen inmediatamente. | Si un nodo colapsa, cualquier otra réplica puede atender la siguiente petición del cliente con total transparencia. |

---

## 2. Demostración Práctica de un Servicio Stateful en Spring Boot

En aplicaciones web tradicionales con renderizado del lado del servidor (como Spring MVC con plantillas Thymeleaf), es común utilizar `HttpSession` para recordar los datos del usuario entre diferentes páginas:

```java title="src/main/java/com/ejemplo/demo/controller/UsuarioController.java" showLineNumbers
package com.ejemplo.demo.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class UsuarioController {

    /**
     * Paso 1: El usuario envía su nombre en el formulario de login.
     * El servidor guarda el valor en su memoria RAM local mediante HttpSession.
     */
    @PostMapping("/login")
    public String login(@RequestParam String nombre, HttpSession session) {
        // Almacena el atributo 'usuario' en la sesión del servidor
        session.setAttribute("usuario", nombre);
        // Redirige al navegador hacia la vista del perfil
        return "redirect:/perfil";
    }

    /**
     * Paso 2: El navegador solicita el perfil enviando automáticamente la cookie JSESSIONID.
     * El servidor busca la sesión asociada en memoria y extrae el nombre guardado.
     */
    @GetMapping("/perfil")
    public String perfil(HttpSession session, Model model) {
        // Recupera el nombre previamente almacenado
        String nombreUsuario = (String) session.getAttribute("usuario");
        
        // Si no existe sesión activa, redirige al inicio de sesión
        if (nombreUsuario == null) {
            return "redirect:/login";
        }
        
        // Inyecta el nombre en el modelo de Thymeleaf
        model.addAttribute("nombre", nombreUsuario);
        return "perfil";
    }

    /**
     * Paso 3: Cierre de sesión explícito.
     * Invalida y destruye el registro de sesión en la memoria RAM del servidor.
     */
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}
```

### Ciclo de Interacción Paso a Paso

<StepByStep>
  <Step number="1" title="Inicio de Sesión y Creación de JSESSIONID (POST /login)">
    El cliente envía sus credenciales. El contenedor de Servlets (Apache Tomcat) crea un objeto `HttpSession` en el Heap de memoria del servidor, le asigna un identificador único alfanumérico y lo devuelve al navegador en la cabecera HTTP `Set-Cookie: JSESSIONID=a81f...`.
  </Step>

  <Step number="2" title="Solicitudes Posteriores con Memoria Compartida (GET /perfil)">
    En cada petición subsiguiente, el navegador adjunta automáticamente la cookie `Cookie: JSESSIONID=a81f...`. El servidor intercepta la cookie, localiza la sesión en memoria y extrae el atributo `"usuario"`. Si este servidor se apaga, la sesión desaparece.
  </Step>

  <Step number="3" title="Destrucción del Contexto (GET /logout)">
    Al ejecutar `session.invalidate()`, el servidor libera el espacio en memoria ocupado por los atributos del cliente. Cualquier intento posterior de consultar `/perfil` resultará en una redirección a `/login`.
  </Step>
</StepByStep>

---

## 3. ¿Qué es una API REST?

Una **API REST (Representational State Transfer)** es un estilo de arquitectura de software propuesto por **Roy Fielding** en el año 2000 que define un conjunto de restricciones para construir servicios web ligeros, mantenibles y altamente escalables sobre el protocolo **HTTP**.

En una API REST, el elemento central es el **Recurso** (*Resource*). Cada recurso es una entidad de información identificable de forma unívoca mediante un URI (*Uniform Resource Identifier*) y manipulable a través de los verbos estándar de HTTP:

<ZoomableMermaid value={`flowchart LR
    subgraph Cliente ["Cliente HTTP (Frontend / Móvil)"]
        Req["Petición HTTP<br/><b>GET /api/usuarios/10</b><br/>Headers: Accept: application/json"]
        Res["Respuesta HTTP<br/><b>Status: 200 OK</b><br/>Body: JSON Serializado"]
    end

    subgraph Servidor ["Servidor REST (Spring Boot)"]
        Router["Router / DispatcherServlet"]
        Controller["@RestController"]
        Entity["Lógica y Persistencia"]
    end

    Req -->|1. Envía solicitud| Router
    Router --> Controller
    Controller --> Entity
    Entity --> Controller
    Controller -->|2. Retorna ResponseEntity| Res

    classDef clientStyle fill:#eff6ff,stroke:#3b82f6,stroke-width:1.5px,color:#1e3a8a;
    classDef serverStyle fill:#f8fafc,stroke:#64748b,stroke-width:1.5px,color:#0f172a;
    class Req,Res clientStyle;
    class Router,Controller,Entity serverStyle;
`} />

### Desglose del Contrato REST

1. **Sustantivos en lugar de verbos:** Las URIs representan recursos en plural (`/api/usuarios`, `/api/productos`), nunca acciones operativas como `GET /api/obtenerUsuarios` o `POST /api/eliminarProducto`.
2. **Métodos HTTP como acciones semánticas:** La acción que se desea ejecutar sobre el recurso la determina el método HTTP utilizado (`GET`, `POST`, `PUT`, `DELETE`).
3. **Representaciones desacopladas:** El recurso se transfiere mediante representaciones estructuradas acordadas entre las partes, siendo **JSON** (*JavaScript Object Notation*) el formato estándar predominante.

---

## 4. Principios Fundamentales de REST

Para que un servicio web sea considerado genuinamente **RESTful**, debe respetar seis principios arquitectónicos:

### 1. Interfaz Uniforme (Uniform Interface)
Simplifica y desacopla la arquitectura, permitiendo que cada parte evolucione independientemente. Requiere que:
* Cada recurso tenga una URI única y consistente.
* Las representaciones devueltas (JSON) contengan información suficiente para que el cliente entienda el estado del recurso.
* Los mensajes sean autodescriptivos mediante cabeceras HTTP (`Content-Type`, `Cache-Control`).

### 2. Sin Estado (Stateless)
Cada solicitud enviada al servidor debe contener **toda la información indispensable** para comprenderla y atenderla. El servidor nunca debe asumir o retener información de solicitudes previas.

:::info[Impacto en Escalabilidad Cloud]
Al no requerir memoria de sesión compartida en el servidor, las aplicaciones REST pueden escalar horizontalmente de 1 a 100 instancias en la nube (AWS, Azure, Docker, Kubernetes) sin requerir configuración especial de balanceo.
:::

### 3. Capacidad de Almacenamiento en Caché (Cacheable)
Las respuestas del servidor deben indicar explícitamente si pueden ser almacenadas en caché por navegadores o proxies intermedios (`Cache-Control: max-age=3600`) para optimizar el ancho de banda y la velocidad de respuesta.

### 4. Separación Cliente-Servidor (Client-Server)
La interfaz de usuario y las aplicaciones clientes (React, Flutter, iOS, Android) están completamente desacopladas de la lógica de negocio, acceso a datos y almacenamiento del backend.

### 5. Sistema en Capas (Layered System)
El cliente no necesita saber si está conectado directamente al servidor final de aplicaciones, o si la petición está pasando a través de una pasarela de API (*API Gateway*), un balanceador de carga o un cortafuegos (*WAF*).

### 6. Código bajo Demanda (Code on Demand - Opcional)
El servidor puede extender temporalmente las capacidades del cliente transfiriéndole código ejecutable (como scripts de JavaScript o applets).

---

## 5. Diseño y Buenas Prácticas en URLs de Recursos REST

| Recurso URI | Método HTTP | Acción Semántica | Código de Estado Típico |
| :--- | :--- | :--- | :--- |
| `/api/usuarios` | `GET` | Recuperar la lista completa de usuarios | `200 OK` |
| `/api/usuarios/10` | `GET` | Obtener el detalle del usuario con identificador `10` | `200 OK` o `404 Not Found` |
| `/api/usuarios` | `POST` | Registrar y crear un nuevo usuario con los datos del body | `201 Created` |
| `/api/usuarios/10` | `PUT` | Actualizar por completo los datos del usuario con ID `10` | `200 OK` |
| `/api/usuarios/10` | `PATCH` | Actualizar parcialmente campos específicos del usuario `10` | `200 OK` |
| `/api/usuarios/10` | `DELETE` | Eliminar de forma permanente el usuario con ID `10` | `204 No Content` |
| `/api/usuarios?rol=admin` | `GET` | Filtrar usuarios activos con rol administrador | `200 OK` |
| `/api/usuarios?page=2&size=20` | `GET` | Paginación: recuperar la página 2 con 20 registros | `200 OK` |
| `/api/usuarios/10/pedidos` | `GET` | Recurso anidado: listar pedidos pertenecientes al usuario `10` | `200 OK` |

---

## 6. Métodos HTTP y su Semántica de Idempotencia

En REST, un método es **idempotente** si ejecutar la misma solicitud múltiples veces consecutivas produce el mismo estado en el servidor que ejecutarla una sola vez:

| Método HTTP | Propósito Semántico | Idempotente | Seguro (Read-Only) |
| :--- | :--- | :---: | :---: |
| **`GET`** | Consulta y recuperación de representaciones de recursos. | Sí | Sí |
| **`POST`** | Creación de recursos secundarios o procesamiento de operaciones no idempotentes. | No | No |
| **`PUT`** | Reemplazo completo o creación idempotente en una URI específica. | Sí | No |
| **`PATCH`** | Modificación parcial de los atributos de un recurso existente. | No | No |
| **`DELETE`** | Eliminación de un recurso por su URI. | Sí | No |
| **`OPTIONS`** | Consulta los métodos HTTP y cabeceras permitidos por el endpoint (CORS preflight). | Sí | Sí |

---

## 7. Códigos de Estado HTTP Esenciales

Los códigos de estado informan al cliente sobre el resultado de su petición mediante familias numéricas estandarizadas:

| Código | Nombre Estándar | Cuándo Utilizarlo en Spring Boot |
| :--- | :--- | :--- |
| **`200 OK`** | Solicitud Exitosa | Consultas `GET`, actualizaciones exitosas `PUT`/`PATCH`. |
| **`201 Created`** | Recurso Creado | Creación exitosa en `POST`. Debe acompañarse de la cabecera `Location`. |
| **`204 No Content`** | Sin Contenido | Peticiones exitosas que no retornan cuerpo (frecuente en `DELETE`). |
| **`400 Bad Request`** | Solicitud Incorrecta | Error de sintaxis JSON o fallos en validaciones de entrada (`@Valid`). |
| **`401 Unauthorized`** | No Autenticado | La petición requiere credenciales o el token JWT expiró/es inválido. |
| **`403 Forbidden`** | Prohibido | El usuario está autenticado, pero no tiene los roles o permisos suficientes. |
| **`404 Not Found`** | No Encontrado | El identificador solicitado en el path no existe en el sistema. |
| **`409 Conflict`** | Conflicto | Intento de registrar un recurso duplicado (por ejemplo, email ya registrado). |
| **`500 Internal Error`** | Error del Servidor | Excepción no controlada o fallo inesperado en el backend. |

---

## Lecturas Complementarias

* [Especificación oficial del protocolo HTTP (RFC 9110)](https://www.rfc-editor.org/rfc/rfc9110.html)
* [Guía de Códigos de Estado HTTP en MDN Web Docs](https://developer.mozilla.org/es/docs/Web/HTTP/Reference/Status)
