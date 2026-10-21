---
sidebar_position: 2
sidebar_label: "Rest Controller"
description: "Build REST controllers in Spring Boot with @RestController, @RequestMapping and HTTP request parameter binding."
---

# Rest Controller

In the **Spring Boot** ecosystem, the presentation layer of a REST API is built using **REST controllers**. Spring simplifies parameter binding, JSON payload deserialization, and standardized response generation through its powerful annotation model.

---

## 1. HTTP Request Anatomy and Spring Boot Mapping

To design REST controllers intuitively, you must understand how Spring Boot maps each part of an **incoming HTTP request** to Java method arguments:

<ZoomableMermaid value={`flowchart LR
    Req["HTTP Request"]

    Req --> Path["URL path"]
    Req --> Query["Query string"]
    Req --> Headers["Headers"]
    Req --> Body["Body JSON"]

    Path --> PV["@PathVariable"]
    Query --> RP["@RequestParam"]
    Headers --> RH["@RequestHeader"]
    Body --> RB["@RequestBody"]

    PV --> M["Controller Method"]
    RP --> M
    RH --> M
    RB --> M

    M --> R["ResponseEntity"]

    classDef http fill:#eff6ff,stroke:#2563eb,stroke-width:1.5px,color:#1e3a8a;
    classDef ann fill:#fef3c7,stroke:#d97706,stroke-width:1.5px,color:#78350f;
    classDef ctl fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px,color:#14532d;

    class Req,Path,Query,Headers,Body http;
    class PV,RP,RH,RB ann;
    class M,R ctl;
`} />

### Core Dispatch Components

| Request Element | Spring Boot Annotation | Typical Java Type | Responsibility |
| :--- | :--- | :--- | :--- |
| **Dynamic Path Segment** | `@PathVariable` | `Long`, `UUID`, `String` | Uniquely identify the resource within the URI hierarchy. |
| **Query String Parameters** | `@RequestParam` | `String`, `Integer`, `Boolean` | Filter, sort, search, or paginate collections. |
| **HTTP Headers** | `@RequestHeader` | `String` | Inspect authentication tokens, user agents, or network metadata. |
| **Request Body (Payload)** | `@RequestBody` | DTO Classes / POJOs | Deserialize the incoming JSON payload into Java objects via Jackson. |
| **Response Body** | `@ResponseBody` (bundled in `@RestController`) | DTO Classes, Lists | Serialize return Java objects into JSON sent to the client. |

---

## 2. Defining the Controller: `@RestController` and `@RequestMapping`

### `@RestController`
Combines two essential annotations: `@Controller` (which registers the class as a Spring-managed component) and `@ResponseBody` (which indicates that return values should be written directly to the HTTP response body rather than resolving a view template like Thymeleaf).

```java title="src/main/java/com/ejemplo/demo/controller/ProductoController.java" showLineNumbers
package com.ejemplo.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/v1/productos") // Base path prefix for all endpoints in this class
public class ProductoController {

    /**
     * Handles GET /api/v1/productos requests.
     * Jackson automatically serializes the Java List into a JSON array: ["Monitor", "Teclado"]
     */
    @GetMapping
    public List<String> listarProductos() {
        return List.of("27\" Curved Monitor", "RGB Mechanical Keyboard", "Wireless Mouse");
    }
}
```

---

## 3. Capturing Path Variables: `@PathVariable`

Extracts variables embedded directly in the URL path. This is the standard mechanism for targeting a specific resource by its primary identifier:

```java title="src/main/java/com/ejemplo/demo/controller/ProductoController.java" showLineNumbers
package com.ejemplo.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/productos")
public class ProductoController {

    /**
     * Handles requests such as: GET /api/v1/productos/42
     * The name inside curly braces {id} matches the Java parameter name.
     */
    @GetMapping("/{id}")
    public String obtenerProductoPorId(@PathVariable Long id) {
        return "Product details for ID: " + id;
    }

    /**
     * Example with explicit variable naming if it differs from the Java parameter
     */
    @GetMapping("/codigo/{sku-producto}")
    public String obtenerPorSku(@PathVariable("sku-producto") String sku) {
        return "Searching for product with SKU: " + sku;
    }
}
```

---

## 4. Capturing Query Parameters: `@RequestParam`

Captures query string parameters passed after the `?` character in the URL. Typically used for optional filters, sorting, and pagination:

```java title="src/main/java/com/ejemplo/demo/controller/ProductoController.java" showLineNumbers
package com.ejemplo.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/productos")
public class ProductoController {

    /**
     * Handles: GET /api/v1/productos/buscar?nombre=teclado&categoria=computo&limite=10
     * - 'nombre' is required by default.
     * - 'categoria' is optional (required = false).
     * - 'limite' has a default fallback (defaultValue = "20").
     */
    @GetMapping("/buscar")
    public String buscarProductos(
            @RequestParam String nombre,
            @RequestParam(required = false) String categoria,
            @RequestParam(defaultValue = "20") int limite) {

        return String.format(
            "Search: name='%s', category='%s', limit=%d",
            nombre,
            categoria != null ? categoria : "ALL",
            limite
        );
    }
}
```

:::tip[When to use @PathVariable vs @RequestParam?]
* Use **`@PathVariable`** when the parameter is essential to identify the resource itself (e.g., `/usuarios/15`, `/pedidos/890`).
* Use **`@RequestParam`** when the parameter is an optional modifier of the query (e.g., `/usuarios?rol=admin&activo=true`).
:::

---

## 5. Receiving JSON Payloads: `@RequestBody`

Deserializes the HTTP request body (`Content-Type: application/json`) into a Java object instance. Spring uses the **Jackson** library internally to map JSON properties to Java class fields:

```java title="src/main/java/com/ejemplo/demo/controller/ProductoController.java" showLineNumbers
package com.ejemplo.demo.controller;

import com.ejemplo.demo.dto.ProductoCreateDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/productos")
public class ProductoController {

    /**
     * Handles POST /api/v1/productos with JSON body:
     * {
     *   "nombre": "Gaming Monitor",
     *   "precio": 350.0
     * }
     */
    @PostMapping
    public ResponseEntity<String> crearProducto(@RequestBody ProductoCreateDTO nuevoProducto) {
        String mensaje = "Product successfully created: " + nuevoProducto.getNombre();
        
        // Returns HTTP 201 Created indicating successful creation of the new resource
        return ResponseEntity.status(HttpStatus.CREATED).body(mensaje);
    }
}
```

---

## 6. Inspecting HTTP Headers: `@RequestHeader`

Reads contextual metadata sent inside HTTP headers:

```java title="src/main/java/com/ejemplo/demo/controller/AuditoriaController.java" showLineNumbers
package com.ejemplo.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auditoria")
public class AuditoriaController {

    /**
     * Captures standard headers like User-Agent or custom business headers.
     */
    @GetMapping("/cliente")
    public String obtenerMetadatosCliente(
            @RequestHeader("User-Agent") String agenteUsuario,
            @RequestHeader(value = "X-Canal-Venta", defaultValue = "WEB") String canalVenta) {

        return String.format(
            "Client User-Agent: '%s' via sales channel: '%s'",
            agenteUsuario,
            canalVenta
        );
    }
}
```

---

## 7. Full Response Control with `ResponseEntity`

Rather than returning a raw object or `void`, best practice in REST APIs is returning a generic **`ResponseEntity<T>`** wrapper. This class represents the complete HTTP response, providing fine-grained control over:

1. **HTTP Status Code** (`200 OK`, `201 Created`, `204 No Content`, `404 Not Found`).
2. **Response Headers** (`Location`, cache directives, or custom tokens).
3. **Response Body** (the serialized DTO or payload).

```java title="src/main/java/com/ejemplo/demo/controller/ProductoController.java" showLineNumbers
package com.ejemplo.demo.controller;

import com.ejemplo.demo.dto.ProductoResponseDTO;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/productos")
public class ProductoController {

    /**
     * Dynamic response example using ResponseEntity based on resource existence
     */
    @GetMapping("/detalle/{id}")
    public ResponseEntity<ProductoResponseDTO> obtenerDetalle(@PathVariable Long id) {
        if (id <= 0) {
            // Returns HTTP 400 Bad Request if the input parameter is invalid
            return ResponseEntity.badRequest().build();
        }

        ProductoResponseDTO producto = new ProductoResponseDTO(id, "Laptop Pro 16", 1899.99);

        // Sets custom headers and returns HTTP 200 OK with the serialized body
        return ResponseEntity.ok()
                .header("X-Procesado-Por", "Backend-Node-01")
                .header(HttpHeaders.CACHE_CONTROL, "max-age=60") // 60-second cache
                .body(producto);
    }

    /**
     * Deletion example returning HTTP 204 No Content (empty body)
     */
    @GetMapping("/eliminar-demo/{id}")
    public ResponseEntity<Void> eliminarRecurso(@PathVariable Long id) {
        // REST standard prescribes returning 204 No Content upon resource removal
        return ResponseEntity.noContent().build();
    }
}
```
