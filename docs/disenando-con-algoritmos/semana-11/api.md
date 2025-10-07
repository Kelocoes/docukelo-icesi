---
sidebar_position: 2
---

# API

Una API (Interfaz de Programación de Aplicaciones) es un conjunto de reglas y definiciones que permite que diferentes programas se comuniquen entre sí. Las APIs facilitan la integración de servicios y el intercambio de datos, permitiendo que aplicaciones externas accedan a funcionalidades específicas sin necesidad de conocer los detalles internos de su implementación. Son fundamentales en el desarrollo moderno, ya que promueven la interoperabilidad y la reutilización de software.

---

## Cómo funcionan las APIs

Las APIs funcionan como intermediarios entre diferentes aplicaciones o servicios. Cuando una aplicación quiere acceder a una funcionalidad o datos de otra, envía una solicitud a la API correspondiente. La API procesa esta solicitud, realiza las operaciones necesarias y devuelve una respuesta con los datos o resultados solicitados.

<div align="center">
    <img src="/img/api.png" alt="Diagrama de cómo funciona una API" width="800"/>
</div>

---

## Tipos de APIs

Existen varios tipos de APIs, entre los más comunes se encuentran:

-   **APIs REST (Representational State Transfer)**  
     Utilizan el protocolo HTTP y son ampliamente utilizadas en aplicaciones web. Son conocidas por su simplicidad y escalabilidad.

-   **APIs SOAP (Simple Object Access Protocol)**  
     Utilizan XML para el intercambio de datos y son más rígidas en su estructura. Son comunes en entornos empresariales.

-   **APIs GraphQL**  
     Permiten a los clientes solicitar exactamente los datos que necesitan, lo que puede reducir la cantidad de datos transferidos y mejorar la eficiencia.

-   **APIs de bibliotecas y frameworks**  
     Proveen funciones y métodos específicos para ser utilizados dentro de un lenguaje de programación o entorno de desarrollo.

---

## Ejemplos de uso de APIs

-   **Redes sociales:**  
     Muchas plataformas como Twitter, Facebook e Instagram ofrecen APIs que permiten a los desarrolladores acceder a datos de usuarios, publicaciones y otros recursos.

-   **Servicios de pago:**  
     APIs como Stripe o PayPal permiten integrar funcionalidades de pago en aplicaciones web y móviles.

-   **Mapas y geolocalización:**  
     APIs como Google Maps permiten a los desarrolladores incorporar mapas, rutas y servicios de geolocalización en sus aplicaciones.

-   **Datos meteorológicos:**  
     APIs como OpenWeatherMap proporcionan acceso a datos meteorológicos en tiempo real y pronósticos.

---

## Protocolo HTTP

El Protocolo de Transferencia de Hipertexto (HTTP) es el protocolo fundamental utilizado en la web para la comunicación entre clientes (como navegadores web) y servidores. HTTP define cómo se formatean y transmiten los mensajes, y cómo los servidores y navegadores deben responder a diversas solicitudes.

### Petición HTTP

Una petición HTTP es un mensaje enviado por el cliente al servidor para solicitar un recurso o realizar una acción. Una petición HTTP típica consta de:

<img src="/img/http-request.png" alt="Estructura de una petición HTTP"/>

### Métodos HTTP

Los métodos HTTP indican la acción que se desea realizar en un recurso específico. Los métodos más comunes son:

-   **GET:** Solicita la representación de un recurso específico. No debe tener efectos secundarios y es seguro para recuperar datos.
-   **POST:** Envía datos al servidor para crear un nuevo recurso. Puede tener efectos secundarios y no es seguro para recuperar datos.
-   **PUT:** Actualiza un recurso existente o crea uno nuevo si no existe. Es idempotente, lo que significa que múltiples solicitudes con el mismo dato producirán el mismo resultado.
-   **DELETE:** Elimina un recurso específico. También es idempotente.
-   **PATCH:** Aplica modificaciones parciales a un recurso existente. No es idempotente.

---

### Códigos de estado HTTP

Los códigos de estado HTTP son respuestas estándar que indican el resultado de una petición HTTP. Se dividen en cinco categorías principales:
-   **1xx (Informativos):** Indican que la solicitud ha sido recibida y el proceso continúa.
-   **2xx (Éxito):** Indican que la solicitud fue exitosa. Ejemplo: 200 OK, 201 Created.
-   **3xx (Redirección):** Indican que se requiere una acción adicional para completar la solicitud. Ejemplo: 301 Moved Permanently, 302 Found.
-   **4xx (Errores del cliente):** Indican que hubo un error en la solicitud del cliente. Ejemplo: 400 Bad Request, 401 Unauthorized, 404 Not Found.
-   **5xx (Errores del servidor):** Indican que el servidor falló al completar una solicitud válida. Ejemplo: 500 Internal Server Error, 503 Service Unavailable.

### Ejemplo de uso de métodos HTTP en una API REST

-   **GET /usuarios/123:** Recupera la información del usuario con ID 123.
-   **POST /usuarios:** Crea un nuevo usuario con los datos proporcionados en el cuerpo de la solicitud.
-   **PUT /usuarios/123:** Actualiza la información del usuario con ID 123.
-   **DELETE /usuarios/123:** Elimina al usuario con ID 123.
-   **PATCH /usuarios/123:** Actualiza parcialmente la información del usuario con ID 123.

---

### Ejemplo de métodos usando fetch en JavaScript

```javascript
// GET
fetch("https://api.ejemplo.com/usuarios/123")
    .then((response) => response.json())
    .then((data) => console.log(data));

// POST
fetch("https://api.ejemplo.com/usuarios", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ nombre: "Juan", edad: 30 }),
})
    .then((response) => response.json())
    .then((data) => console.log(data));

// PUT
fetch("https://api.ejemplo.com/usuarios/123", {
    method: "PUT",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ nombre: "Juan Actualizado", edad: 31 }),
})
    .then((response) => response.json())
    .then((data) => console.log(data));

// DELETE
fetch("https://api.ejemplo.com/usuarios/123", {
    method: "DELETE",
})
    .then((response) => response.json())
    .then((data) => console.log(data));

// PATCH
fetch("https://api.ejemplo.com/usuarios/123", {
    method: "PATCH",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ edad: 32 }),
})
    .then((response) => response.json())
    .then((data) => console.log(data));
```

## Información o recursos adicionales

- [Event loop example](https://www.jsv9000.app)