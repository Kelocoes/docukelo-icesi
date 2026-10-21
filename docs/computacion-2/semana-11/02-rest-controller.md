---
sidebar_position: 2
sidebar_label: "Rest Controller"
description: "Construye controladores REST en Spring Boot con @RestController, @RequestMapping y la captura de parámetros de la petición HTTP."
---

# Rest Controller

En el ecosistema de **Spring Boot**, la capa de presentación de una API REST se construye a través de **controladores REST**. Spring simplifica la captura de parámetros, la deserialización de cuerpos en formato JSON y el envío de respuestas estandarizadas mediante un potente sistema de anotaciones.

---

## 1. Anatomía de una Petición HTTP y Mapeo en Spring Boot

Para diseñar controladores REST de forma intuitiva, es indispensable comprender cómo mapea Spring Boot las diferentes partes de una **petición HTTP entrante** a los argumentos de un método Java:

<ZoomableMermaid value={`flowchart LR
    Req["Petición HTTP"]

    Req --> Path["URL path"]
    Req --> Query["Query string"]
    Req --> Headers["Headers"]
    Req --> Body["Body JSON"]

    Path --> PV["@PathVariable"]
    Query --> RP["@RequestParam"]
    Headers --> RH["@RequestHeader"]
    Body --> RB["@RequestBody"]

    PV --> M["Método del controlador"]
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

### Componentes Clave del Ciclo de Despacho

| Elemento de la Petición | Anotación en Spring Boot | Tipo de Datos Java Típico | Responsabilidad |
| :--- | :--- | :--- | :--- |
| **Segmento dinámico del Path** | `@PathVariable` | `Long`, `UUID`, `String` | Identificar de forma unívoca el recurso en la jerarquía URI. |
| **Parámetros de consulta (Query)** | `@RequestParam` | `String`, `Integer`, `Boolean` | Filtrar, ordenar, buscar o paginar colecciones de datos. |
| **Encabezados HTTP** | `@RequestHeader` | `String` | Inspeccionar tokens de seguridad, tipos de dispositivo o metadatos de red. |
| **Cuerpo de la Petición (Payload)** | `@RequestBody` | Clases DTO / POJOs | Deserializar el payload JSON entrante en objetos de Java mediante Jackson. |
| **Cuerpo de Respuesta** | `@ResponseBody` (incluido en `@RestController`) | Clases DTO, Listas | Serializar objetos de retorno de Java en JSON hacia el cliente. |

---

## 2. Definición del Controlador: `@RestController` y `@RequestMapping`

### `@RestController`
Combina dos anotaciones esenciales: `@Controller` (que registra la clase como un componente gestionado en el contenedor de Spring) y `@ResponseBody` (que indica que el valor retornado por cada método debe escribirse directamente en el cuerpo de la respuesta HTTP, en lugar de buscar una plantilla de vista HTML como Thymeleaf).

```java title="src/main/java/com/ejemplo/demo/controller/ProductoController.java" showLineNumbers
package com.ejemplo.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/v1/productos") // Prefijo de ruta base para todos los endpoints de la clase
public class ProductoController {

    /**
     * Responde a peticiones GET /api/v1/productos.
     * Jackson convierte automáticamente la lista de Java a un array JSON: ["Monitor", "Teclado"]
     */
    @GetMapping
    public List<String> listarProductos() {
        return List.of("Monitor Curvo 27\"", "Teclado Mecánico RGB", "Mouse Inalámbrico");
    }
}
```

---

## 3. Captura de Parámetros de Ruta: `@PathVariable`

Permite extraer variables incrustadas directamente dentro del path de la URL. Es el mecanismo estándar para apuntar a un recurso específico por su identificador primario:

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
     * Responde a peticiones como: GET /api/v1/productos/42
     * El nombre de la variable entre llaves {id} debe coincidir con el nombre del argumento Java.
     */
    @GetMapping("/{id}")
    public String obtenerProductoPorId(@PathVariable Long id) {
        // En una aplicación real, consultaríamos el servicio con el identificador recibido
        return "Detalle del producto con ID: " + id;
    }

    /**
     * Ejemplo con nombres explícitos si difieren del argumento Java
     */
    @GetMapping("/codigo/{sku-producto}")
    public String obtenerPorSku(@PathVariable("sku-producto") String sku) {
        return "Buscando producto por SKU: " + sku;
    }
}
```

---

## 4. Captura de Parámetros de Consulta: `@RequestParam`

Permite capturar valores pasados en la cadena de consulta (*Query String*) tras el carácter `?`. Se emplea para filtros opcionales, ordenamientos y paginación:

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
     * Responde a: GET /api/v1/productos/buscar?nombre=teclado&categoria=computo&limite=10
     * - 'nombre' es obligatorio por defecto.
     * - 'categoria' es opcional (required = false).
     * - 'limite' tiene un valor por defecto asignado (defaultValue = "20").
     */
    @GetMapping("/buscar")
    public String buscarProductos(
            @RequestParam String nombre,
            @RequestParam(required = false) String categoria,
            @RequestParam(defaultValue = "20") int limite) {

        return String.format(
            "Búsqueda: nombre='%s', categoría='%s', límite=%d",
            nombre,
            categoria != null ? categoria : "TODAS",
            limite
        );
    }
}
```

:::tip[¿Cuándo usar @PathVariable y cuándo @RequestParam?]
* Usa **`@PathVariable`** cuando el parámetro sea indispensable para identificar el recurso (por ejemplo: `/usuarios/15`, `/pedidos/890`).
* Usa **`@RequestParam`** cuando el parámetro sea un modificador opcional de la consulta (por ejemplo: `/usuarios?rol=admin&activo=true`).
:::

---

## 5. Recepción de Cuerpos JSON: `@RequestBody`

Deserializa el contenido del cuerpo de la petición HTTP (`Content-Type: application/json`) en una instancia de una clase Java. Spring utiliza internamente la biblioteca **Jackson** para transformar las claves JSON en propiedades de la clase:

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
     * Responde a peticiones POST /api/v1/productos con cuerpo JSON:
     * {
     *   "nombre": "Monitor Gamer",
     *   "precio": 350.0
     * }
     */
    @PostMapping
    public ResponseEntity<String> crearProducto(@RequestBody ProductoCreateDTO nuevoProducto) {
        // El objeto 'nuevoProducto' ya contiene los atributos deserializados por Jackson
        String mensaje = "Producto creado con éxito: " + nuevoProducto.getNombre();
        
        // Retorna HTTP 201 Created indicando la creación del nuevo recurso
        return ResponseEntity.status(HttpStatus.CREATED).body(mensaje);
    }
}
```

---

## 6. Inspección de Encabezados HTTP: `@RequestHeader`

Permite leer información contextual enviada en los metadatos de la cabecera HTTP:

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
     * Captura cabeceras estándar como User-Agent o cabeceras personalizadas de negocio.
     */
    @GetMapping("/cliente")
    public String obtenerMetadatosCliente(
            @RequestHeader("User-Agent") String agenteUsuario,
            @RequestHeader(value = "X-Canal-Venta", defaultValue = "WEB") String canalVenta) {

        return String.format(
            "Petición originada en navegador/cliente: '%s' mediante el canal: '%s'",
            agenteUsuario,
            canalVenta
        );
    }
}
```

---

## 7. Control Total de Respuestas con `ResponseEntity`

En lugar de retornar directamente un objeto o `void`, una buena práctica en APIs REST es retornar un objeto **`ResponseEntity<T>`**. Esta clase genérica representa la respuesta HTTP completa, permitiendo controlar:

1. **El Código de Estado HTTP** (`200 OK`, `201 Created`, `204 No Content`, `404 Not Found`).
2. **Las Cabeceras HTTP de Respuesta** (`Location`, cabeceras de caché o firmas personalizadas).
3. **El Cuerpo de la Respuesta** (el DTO o payload serializado).

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
     * Ejemplo de respuesta dinámica con ResponseEntity según la existencia del recurso
     */
    @GetMapping("/detalle/{id}")
    public ResponseEntity<ProductoResponseDTO> obtenerDetalle(@PathVariable Long id) {
        if (id <= 0) {
            // Retorna un código HTTP 400 Bad Request si el parámetro no es válido
            return ResponseEntity.badRequest().build();
        }

        ProductoResponseDTO producto = new ProductoResponseDTO(id, "Laptop Pro 16", 1899.99);

        // Agrega una cabecera personalizada y retorna HTTP 200 OK con el cuerpo serializado
        return ResponseEntity.ok()
                .header("X-Procesado-Por", "Nodo-Backend-01")
                .header(HttpHeaders.CACHE_CONTROL, "max-age=60") // Caché de 60 segundos
                .body(producto);
    }

    /**
     * Ejemplo de eliminación retornando HTTP 204 No Content (sin cuerpo)
     */
    @GetMapping("/eliminar-demo/{id}")
    public ResponseEntity<Void> eliminarRecurso(@PathVariable Long id) {
        // Tras eliminar el recurso, el estándar REST prescribe devolver 204 No Content
        return ResponseEntity.noContent().build();
    }
}
```
