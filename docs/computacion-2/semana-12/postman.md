---
sidebar_position: 1
---

# Postman

## Introducción

**Postman** es una herramienta esencial para **probar y validar APIs HTTP**, permitiendo a los desarrolladores backend verificar el correcto funcionamiento de sus endpoints, automatizar pruebas y documentar los servicios que ofrecen.

Más allá de ser solo una interfaz para hacer peticiones, Postman ofrece potentes características como **scripts de pre y post ejecución**, **colecciones de pruebas automatizadas**, y **manejo de entornos** que facilitan el trabajo diario con APIs REST o GraphQL.

---

## ¿Por qué usar Postman para probar APIs?

Aunque podrías probar tus endpoints con `curl` o incluso con código, Postman ofrece ventajas clave:

-   Interfaz visual clara para inspeccionar peticiones y respuestas.
-   Soporte para múltiples métodos HTTP (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, etc.).
-   Posibilidad de crear **colecciones** de peticiones reutilizables.
-   Soporte de **variables** y **entornos**, ideales para proyectos con múltiples servidores (dev, test, prod).
-   Ejecución automática de **scripts** antes o después de una petición.
-   Integración con **Newman**, para ejecutar tests en CI/CD.

---

## Componentes Clave de Postman

### 1. Request (Petición)

Cada solicitud HTTP tiene los siguientes elementos configurables:

-   **Método:** GET, POST, PUT, DELETE, etc.
-   **URL:** Dirección del endpoint (por ejemplo, `https://api.miapp.com/users`).
-   **Headers:** Información adicional (por ejemplo, `Authorization`, `Content-Type`).
-   **Body:** Datos enviados en peticiones POST/PUT.
-   **Params:** Parámetros en la URL (`?page=1&limit=10`).

### 2. Collections (Colecciones)

Una colección es un conjunto organizado de peticiones, agrupadas por módulo o funcionalidad. Ejemplo:

-   `Auth` → `/login`, `/register`, `/refresh-token`
-   `Users` → `/users`, `/users/:id`
-   `Products` → `/products`, `/products/:id`

Las colecciones permiten ejecutar pruebas de manera secuencial o automatizada.

### 3. Environment (Entornos)

Los entornos definen variables globales o específicas del contexto.

Ejemplo de variables en un entorno:

```json
{
    "base_url": "https://api-dev.miapp.com",
    "token": "{{jwt_token}}"
}
```

Estas variables se pueden usar dentro de peticiones como:

```
{{base_url}}/users
```

---

## Prueba de endpoints con Postman

Una vez que tienes una API en ejecución (por ejemplo, un backend en Spring Boot o NestJS), puedes:

1. Crear una nueva **Request**.
2. Seleccionar el método HTTP (por ejemplo, `POST`).
3. Ingresar la URL del endpoint.
4. Agregar headers (por ejemplo, `Content-Type: application/json`).
5. Agregar el body (si aplica):

```json
{
    "email": "kevin@example.com",
    "password": "123456"
}
```

6. Presionar **Send** para ejecutar la petición y observar la respuesta JSON, status code, headers, etc.

---

## Pre-request Script

Los **Pre-request Scripts** son fragmentos de JavaScript que se ejecutan **antes** de enviar la petición. Se usan para:

-   Generar tokens dinámicos.
-   Configurar variables de entorno.
-   Calcular firmas o hashes.
-   Loggear información previa.

Ejemplo:

```js
// Se ejecuta antes de enviar la request
const timestamp = Date.now();
const apiKey = "123abc";

pm.environment.set("timestamp", timestamp);
pm.environment.set(
    "signature",
    CryptoJS.HmacSHA256(timestamp + apiKey, "secret").toString()
);

console.log("Timestamp generado:", timestamp);
```

Luego puedes usar las variables creadas en la petición:

```
Authorization: {{signature}}
X-Timestamp: {{timestamp}}
```

---

## Post-response Script (Tests)

Los **Tests** en Postman son scripts que se ejecutan **después** de recibir la respuesta de la API. Se utilizan para validar el comportamiento del endpoint.

Ejemplo:

```js
pm.test("Status code es 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Respuesta contiene userId", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("userId");
});

pm.test("Tiempo de respuesta menor a 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});
```

También puedes guardar información de la respuesta para futuras peticiones:

```js
const token = pm.response.json().token;
pm.environment.set("jwt_token", token);
```

---

## Ejecutar listas de peticiones (Runner)

Postman permite **ejecutar una colección completa** o un subconjunto de peticiones en orden usando el **Collection Runner**.

1. Selecciona una colección.
2. Clic en **Run Collection**.
3. Elige el entorno que usarás.
4. Configura iteraciones, delays, y exportación de resultados.

Esto es útil para:

-   Pruebas de regresión.
-   Validar endpoints después de un despliegue.
-   Automatizar secuencias (login → crear → listar → eliminar).

Ejemplo de flujo:

1. `/login` → guarda el token con `pm.environment.set('jwt_token')`.
2. `/users` → usa `{{jwt_token}}` en el header.
3. `/logout` → invalida el token.

---

## Variables en Postman

Postman soporta varios niveles de variables:

| Tipo        | Alcance                               | Ejemplo                           |
| ----------- | ------------------------------------- | --------------------------------- |
| Global      | Disponible en todo el workspace       | `{{base_url}}`                    |
| Environment | Específico de un entorno              | `{{jwt_token}}`                   |
| Collection  | Solo dentro de una colección          | `{{user_id}}`                     |
| Local       | Temporal (solo durante una ejecución) | `pm.variables.set('temp', '123')` |

Definir variables te permite reutilizar endpoints en diferentes entornos (dev, test, prod) sin cambiar las URLs.

---

## Recursos recomendados

-   [Documentación oficial de Postman](https://learning.postman.com/)
-   [API Testing con Postman (YouTube)](https://www.youtube.com/@postman)
-   [Guía de variables y entornos](https://learning.postman.com/docs/sending-requests/variables/)
