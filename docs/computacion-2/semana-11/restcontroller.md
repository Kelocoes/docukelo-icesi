---
sidebar_position: 2
---

# Rest Controller

## Guía sobre Spring Boot: RestController y sus Funcionalidades

Spring Boot simplifica la creación de APIs REST utilizando anotaciones y clases preconfiguradas. A continuación se detallan las principales anotaciones y componentes para construir controladores REST, explicando su propósito y mostrando ejemplos prácticos.

### 1. `@RestController`

La anotación `@RestController` indica que la clase manejará peticiones HTTP y devolverá directamente objetos serializados (generalmente en JSON o XML). Combina las funcionalidades de `@Controller` y `@ResponseBody`, evitando la necesidad de escribir ambas.

**Propósito:**  
Permitir que los métodos de la clase retornen datos directamente en el cuerpo de la respuesta HTTP, facilitando la creación de servicios RESTful.

**Ejemplo:**
```java
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @GetMapping
    public List<Usuario> listarUsuarios() {
        return List.of(new Usuario("Juan"), new Usuario("María"));
    }
}
```

### 2. `@RequestMapping` y Métodos HTTP

`@RequestMapping` define la ruta base o personalizada de un endpoint. Se puede combinar con métodos específicos como `@GetMapping`, `@PostMapping`, `@PutMapping` y `@DeleteMapping` para indicar el tipo de operación HTTP.

**Propósito:**  
Configurar rutas y métodos HTTP para cada acción del controlador.

**Ejemplo:**
```java
@RestController
@RequestMapping("/api")
public class ProductoController {

    @RequestMapping(value = "/productos", method = RequestMethod.GET)
    public List<String> listar() {
        return List.of("Teclado", "Mouse", "Monitor");
    }
}
```

### 3. `@PathVariable`

Permite capturar valores directamente desde la URL, facilitando la obtención de parámetros dinámicos.

**Propósito:**  
Extraer valores de la ruta para usarlos en la lógica del método.

**Ejemplo:**
```java
@GetMapping("/productos/{id}")
public String obtenerProducto(@PathVariable Long id) {
    return "Producto con ID: " + id;
}
```

### 4. `@RequestParam`

Se utiliza para obtener parámetros enviados en la URL como query params.

**Propósito:**  
Recibir valores opcionales o requeridos desde la cadena de consulta.

**Ejemplo:**
```java
@GetMapping("/buscar")
public String buscar(@RequestParam String nombre, @RequestParam(required = false) String categoria) {
    return "Buscando " + nombre + " en categoría " + categoria;
}
```

### 5. `@RequestBody`

Permite recibir datos en formato JSON desde el cuerpo de la solicitud, útil para crear o actualizar recursos.

**Propósito:**  
Deserializar el cuerpo de la petición HTTP en un objeto Java.

**Ejemplo:**
```java
@PostMapping("/crear")
public String crearUsuario(@RequestBody Usuario usuario) {
    return "Usuario creado: " + usuario.getNombre();
}
```

### 6. Obtención de Headers con `@RequestHeader`

Podemos leer encabezados HTTP de la solicitud usando `@RequestHeader`.

**Propósito:**  
Acceder a información adicional enviada por el cliente, como el tipo de navegador o tokens de autenticación.

**Ejemplo:**
```java
@GetMapping("/headers")
public String obtenerHeaders(@RequestHeader("User-Agent") String userAgent) {
    return "El cliente usa: " + userAgent;
}
```

### 7. `ResponseEntity`

`ResponseEntity` permite controlar completamente la respuesta HTTP, incluyendo el código de estado, cuerpo y encabezados.

**Propósito:**  
Personalizar la respuesta enviada al cliente, ajustando el estado y los datos retornados.

**Ejemplo:**
```java
@GetMapping("/status")
public ResponseEntity<String> estado() {
    return ResponseEntity.status(HttpStatus.ACCEPTED).body("Petición aceptada");
}
```

### 8. Agregar Headers Personalizados

Es posible agregar nuevos headers a la respuesta usando `ResponseEntity`.

**Propósito:**  
Enviar información adicional al cliente, como identificadores personalizados o metadatos.

**Ejemplo:**
```java
@GetMapping("/custom-header")
public ResponseEntity<String> customHeader() {
    return ResponseEntity.ok()
        .header("X-Custom-Header", "MiValorPersonalizado")
        .body("Header agregado exitosamente");
}
```