---
sidebar_position: 1
---

# Paginación y Ordenamiento en Spring Data JPA

En sistemas empresariales con miles o millones de registros, realizar consultas masivas como `findAll()` saturará el ancho de banda, bloqueará memoria en la máquina virtual (JVM) y degradará la experiencia del usuario. La **paginación** y el **ordenamiento** dividen el conjunto de datos en segmentos discretos (páginas) ordenados de forma eficiente directamente en el motor de base de datos SQL.

---

## 1. Conceptos y Fundamentos Teóricos

<div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
  <img 
    src="/img/computacion-2/spring-pagination-overview.svg" 
    alt="Comparativa entre consulta masiva sin paginación y consulta segmentada con Pageable" 
    style={{width: '90%', maxWidth: '820px'}}
  />
</div>

### Componentes de la Arquitectura de Paginación

1. **Pageable**: Interfaz de Spring Data que encapsula la petición de paginación enviada por el cliente:
   - Número de página (`page`, indexado desde 0).
   - Tamaño de la página (`size`, cantidad de elementos por página).
   - Configuración de ordenamiento (`Sort`).
2. **PageRequest**: Implementación concreta principal de `Pageable` para instanciar solicitudes mediante `PageRequest.of(page, size, sort)`.
3. **Sort**: Define el criterio de ordenamiento por uno o más atributos de la entidad, indicando la dirección (`Sort.Direction.ASC` o `Sort.Direction.DESC`).
4. **Page&lt;T&gt;**: Sub-interfaz de Spring Data que no solo contiene la lista de elementos solicitada (`getContent()`), sino también metadatos calculados de la consulta completa (`getTotalElements()`, `getTotalPages()`, `getNumber()`, `hasNext()`, `hasPrevious()`).
5. **Slice&lt;T&gt;**: Alternativa a `Page<T>` que sabe si existe una página siguiente pero **no** ejecuta el `COUNT(*)` general. Es ideal para scroll infinito en interfaces móviles donde el total de páginas no es necesario.

### Ventajas de Implementar Paginación

| Ventaja | Impacto Técnico |
| :--- | :--- |
| **Prevención de Caídas (OOM)** | Evita que la JVM intente cargar 500,000 entidades en el Heap de memoria, previniendo errores `java.lang.OutOfMemoryError`. |
| **Bajo Consumo de Red y Payload Liviano** | Transfiere payloads JSON compactos (20 a 50 elementos) en milisegundos en lugar de archivos masivos de decenas de megabytes. |
| **Traducción Nativa a SQL** | Spring Data traduce `Pageable` a cláusulas estándar del motor SQL (`LIMIT` y `OFFSET` en PostgreSQL/MySQL o `FETCH FIRST` en Oracle). |
| **Control para el Frontend** | Proporciona de forma prefabricada la información requerida por componentes de tablas (como DataTables o componentes paginados de React). |

### Flujo de Ejecución en Spring Data

<ZoomableMermaid value={`sequenceDiagram
    autonumber
    participant Client as Frontend (React / Postman)
    participant Ctrl as ProductController
    participant Svc as ProductService
    participant Repo as ProductRepository
    participant DB as PostgreSQL / MySQL

    Client->>Ctrl: GET /api/products?page=0&size=10&sortBy=price&direction=desc
    Ctrl->>Svc: getProducts(page, size, sortBy, direction)
    Svc->>Svc: Pageable pageable = PageRequest.of(0, 10, Sort.by("price").descending())
    Svc->>Repo: findAll(pageable)
    Repo->>DB: SELECT * FROM products ORDER BY price DESC LIMIT 10 OFFSET 0
    DB-->>Repo: 10 registros de productos
    Repo->>DB: SELECT COUNT(*) FROM products
    DB-->>Repo: Total: 1,450 registros
    Repo-->>Svc: Page<Product> (datos + metadatos)
    Svc-->>Ctrl: Page<ProductDTO>
    Ctrl-->>Client: HTTP 200 OK con JSON de Page`} />

El diagrama anterior detalla la interacción en dos fases que realiza `Page<T>`: primero obtiene la rebanada de datos mediante `LIMIT` y `OFFSET`, y posteriormente ejecuta una consulta de conteo para conocer el total absoluto de registros.

---

## 2. Guía Práctica: Paso a Paso

A continuación configuraremos una entidad, su repositorio con soporte de paginación, el servicio y el controlador REST expuesto.

<StepByStep>
  <Step number="1" title="Definir la Entidad JPA">
    Creamos la entidad base con anotaciones estándar de JPA y Lombok para gestionar los datos de un catálogo.

```java title="src/main/java/com/icesi/store/model/Product.java" showLineNumbers
package com.icesi.store.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nombre comercial del producto
    private String name;

    // Categoría del producto para filtros
    private String category;

    // Precio unitario utilizado para ordenamiento
    private Double price;

    // Unidades disponibles en bodega
    private Integer stock;
}
```
  </Step>

  <Step number="2" title="Crear el Repositorio con PagingAndSortingRepository">
    En Spring Data JPA, la interfaz `JpaRepository` ya hereda de `PagingAndSortingRepository`. Por lo tanto, cualquier repositorio estándar ya soporta métodos paginados de forma nativa.

```java title="src/main/java/com/icesi/store/repository/ProductRepository.java" showLineNumbers
package com.icesi.store.repository;

import com.icesi.store.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Método generado automáticamente: filtra por categoría y aplica paginación
    Page<Product> findByCategory(String category, Pageable pageable);

    // Búsqueda por coincidencia parcial en nombre con paginación
    Page<Product> findByNameContainingIgnoreCase(String keyword, Pageable pageable);
}
```

:::info[¿Cómo funciona el método findAll?]
La interfaz `JpaRepository` ya provee el método `Page<T> findAll(Pageable pageable)`. No es necesario declararlo explícitamente en la interfaz a menos que desees aplicar filtros personalizados.
:::
  </Step>

  <Step number="3" title="Construir la Lógica de Negocio en el Servicio">
    En la capa de servicio se reciben los parámetros de la petición HTTP, se valida o normaliza la dirección de ordenamiento y se construye la instancia de `Pageable` mediante `PageRequest`.

```java title="src/main/java/com/icesi/store/service/ProductService.java" showLineNumbers
package com.icesi.store.service;

import com.icesi.store.model.Product;
import com.icesi.store.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Obtiene productos paginados con ordenamiento configurable.
     *
     * @param page Número de página (inicia en 0)
     * @param size Cantidad de elementos por página
     * @param sortBy Nombre del atributo por el cual ordenar
     * @param direction Dirección ("asc" o "desc")
     * @return Página de productos con metadatos
     */
    public Page<Product> getProducts(int page, int size, String sortBy, String direction) {
        // Determinamos la dirección del ordenamiento de manera segura
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") 
                ? Sort.Direction.DESC 
                : Sort.Direction.ASC;

        // Construimos el objeto Sort por la propiedad indicada
        Sort sort = Sort.by(sortDirection, sortBy);

        // Instanciamos el Pageable combinando página, tamaño y orden
        Pageable pageable = PageRequest.of(page, size, sort);

        // Ejecutamos la consulta en el repositorio
        return productRepository.findAll(pageable);
    }

    /**
     * Búsqueda paginada filtrando por categoría.
     */
    public Page<Product> getProductsByCategory(String category, int page, int size) {
        // Orden por defecto por precio ascendente
        Pageable pageable = PageRequest.of(page, size, Sort.by("price").ascending());
        return productRepository.findByCategory(category, pageable);
    }
}
```
  </Step>

  <Step number="4" title="Exponer el Endpoint REST en el Controlador">
    Configuramos los parámetros de la URL usando `@RequestParam` con valores por defecto (`defaultValue`). Esto permite que la llamada funcione aun si el cliente no envía filtros.

```java title="src/main/java/com/icesi/store/controller/ProductController.java" showLineNumbers
package com.icesi.store.controller;

import com.icesi.store.model.Product;
import com.icesi.store.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Page<Product> productPage = productService.getProducts(page, size, sortBy, direction);
        return ResponseEntity.ok(productPage);
    }
}
```
  </Step>

  <Step number="5" title="Inspeccionar la Estructura de Respuesta JSON">
    Cuando un cliente realiza la petición `GET /api/products?page=0&size=2&sortBy=price&direction=desc`, la estructura JSON devuelta por `Page<T>` tiene la siguiente forma:

```json title="HTTP 200 OK Response" showLineNumbers
{
  "content": [
    {
      "id": 84,
      "name": "Portátil Gamer Pro",
      "category": "Computadores",
      "price": 4500000.0,
      "stock": 12
    },
    {
      "id": 12,
      "name": "Monitor Curvo 34 Pulgadas",
      "category": "Pantallas",
      "price": 2800000.0,
      "stock": 5
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 2,
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "totalElements": 150,
  "totalPages": 75,
  "last": false,
  "first": true,
  "size": 2,
  "number": 0,
  "numberOfElements": 2,
  "empty": false
}
```

:::tip[Uso directo de Pageable en Parámetros del Controlador]
Spring MVC permite recibir directamente `Pageable` como parámetro en el método del controlador:
```java
@GetMapping
public ResponseEntity<Page<Product>> listProducts(Pageable pageable) {
    return ResponseEntity.ok(productRepository.findAll(pageable));
}
```
El framework resolverá automáticamente parámetros como `?page=0&size=10&sort=price,desc` sin necesidad de deserializarlos manualmente.
:::
  </Step>
</StepByStep>

---

## 3. Cuestionario de Autoevaluación

<Quiz id="comp2-semana6-paginacion-quiz">
  <Question title="¿Cuál es el principal riesgo para la JVM al realizar consultas masivas sin paginación como findAll()?">
    <Option>Bloqueo inmediato de las conexiones SSH al servidor.</Option>
    <Option correct>Consumo desmedido del Heap de memoria y caídas por java.lang.OutOfMemoryError.</Option>
    <Option>Pérdida permanente de las tablas en el motor de base de datos.</Option>
    <Option>Incompatibilidad con los controladores REST de Spring Boot.</Option>
  </Question>
  <Question title="¿Qué índice numérico utiliza Spring Data JPA por defecto para representar la primera página?">
    <Option>1</Option>
    <Option correct>0</Option>
    <Option>-1</Option>
    <Option>Depende del motor SQL configurado.</Option>
  </Question>
  <Question title="¿Qué clase concreta se utiliza comúnmente para instanciar un objeto de tipo Pageable combinando página, tamaño y ordenamiento?">
    <Option>PageBuilder</Option>
    <Option>SortableList</Option>
    <Option correct>PageRequest</Option>
    <Option>PaginationFactory</Option>
  </Question>
  <Question title="¿Cuál es la diferencia técnica fundamental entre Page&lt;T&gt; y Slice&lt;T&gt;?">
    <Option>Slice&lt;T&gt; solo funciona con bases de datos NoSQL como MongoDB.</Option>
    <Option correct>Page&lt;T&gt; ejecuta una consulta adicional COUNT(*) para conocer el total de registros, mientras que Slice&lt;T&gt; no lo hace.</Option>
    <Option>Page&lt;T&gt; no permite ordenar por atributos de la entidad.</Option>
    <Option>Slice&lt;T&gt; carga todos los datos en memoria antes de filtrar.</Option>
  </Question>
  <Question title="En un entorno SQL relacional como PostgreSQL o MySQL, ¿a qué cláusulas se traduce la paginación con Pageable?">
    <Option>GROUP BY y HAVING</Option>
    <Option correct>LIMIT y OFFSET</Option>
    <Option>UNION y JOIN</Option>
    <Option>INDEX y CLUSTER</Option>
  </Question>
  <Question title="¿Qué método de Page&lt;T&gt; retorna la lista con las entidades concretas correspondientes a la página solicitada?">
    <Option>getElements()</Option>
    <Option>getData()</Option>
    <Option correct>getContent()</Option>
    <Option>toList()</Option>
  </Question>
  <Question title="¿Por qué la interfaz JpaRepository ya soporta paginación de forma nativa sin configuraciones adicionales?">
    <Option>Porque todas las interfaces de Java soportan paginación por defecto.</Option>
    <Option correct>Porque JpaRepository hereda directamente de PagingAndSortingRepository.</Option>
    <Option>Porque Tomcat intercepta los repositorios y divide las consultas en memoria.</Option>
    <Option>Porque requiere la anotación obligatoria @EnablePagination.</Option>
  </Question>
  <Question title="¿Cómo se define un criterio de ordenamiento descendente por el atributo 'price' utilizando la clase Sort?">
    <Option>Sort.by(&quot;price&quot;).reverse()</Option>
    <Option correct>Sort.by(&quot;price&quot;).descending()</Option>
    <Option>Sort.direction(DESC, &quot;price&quot;)</Option>
    <Option>new Sort(&quot;price:down&quot;)</Option>
  </Question>
  <Question title="¿Por qué es una buena práctica limitar el valor máximo del parámetro 'size' en los endpoints del controlador?">
    <Option>Porque Spring Boot rechaza tamaños de página mayores a 10 por diseño.</Option>
    <Option>Para evitar que el motor de base de datos desactive las llaves foráneas.</Option>
    <Option correct>Para proteger el servidor frente a peticiones maliciosas o excesivas que intenten extraer miles de registros a la vez.</Option>
    <Option>Porque el navegador no puede renderizar respuestas JSON de más de 100 caracteres.</Option>
  </Question>
  <Question title="¿Qué metadato de Page&lt;T&gt; indica si existen más páginas posteriores disponibles para consultar?">
    <Option>isEnd()</Option>
    <Option correct>hasNext()</Option>
    <Option>morePages()</Option>
    <Option>getNextOffset()</Option>
  </Question>
</Quiz>
