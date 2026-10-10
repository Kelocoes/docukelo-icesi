---
sidebar_position: 1
---

# Pagination and Sorting in Spring Data JPA

In enterprise systems handling thousands or millions of records, executing unconstrained queries such as `findAll()` exhausts network bandwidth, consumes excessive JVM memory (heap), and degrades user experience. **Pagination** and **sorting** split large datasets into manageable discrete chunks (pages) sorted efficiently directly by the SQL database engine.

---

## 1. Concepts and Theoretical Foundations

<div style={{textAlign: 'center', marginBottom: '1.5rem'}}>
  <img 
    src="/img/computacion-2/spring-pagination-overview.svg" 
    alt="Comparison between unpaginated query and segmented query with Pageable" 
    style={{width: '90%', maxWidth: '820px'}}
  />
</div>

### Core Pagination Architecture Components

1. **Pageable**: A Spring Data interface encapsulating pagination and sorting parameters sent by the client:
   - Page number (`page`, zero-based index).
   - Page size (`size`, number of items per page).
   - Sorting configuration (`Sort`).
2. **PageRequest**: The primary concrete implementation of `Pageable`, instantiated via factory methods like `PageRequest.of(page, size, sort)`.
3. **Sort**: Defines the sorting criteria over one or more entity attributes, specifying direction (`Sort.Direction.ASC` or `Sort.Direction.DESC`).
4. **Page&lt;T&gt;**: A Spring Data sub-interface that contains not only the requested page items (`getContent()`), but also computed pagination metadata (`getTotalElements()`, `getTotalPages()`, `getNumber()`, `hasNext()`, `hasPrevious()`).
5. **Slice&lt;T&gt;**: An alternative to `Page<T>` that knows whether a next slice exists, but **does not** execute an additional `COUNT(*)` query. It is ideal for infinite scroll interfaces in mobile applications.

### Benefits of Implementing Pagination

| Benefit | Technical Impact |
| :--- | :--- |
| **Prevents Out-of-Memory (OOM)** | Prevents the JVM from loading hundreds of thousands of entities into heap memory, avoiding `java.lang.OutOfMemoryError`. |
| **Low Network Overhead & Lightweight Payloads** | Transfers compact JSON payloads (20–50 items) in milliseconds rather than multi-megabyte responses. |
| **Native SQL Translation** | Spring Data automatically translates `Pageable` into native database clauses (`LIMIT` and `OFFSET` in PostgreSQL/MySQL or `FETCH FIRST` in Oracle). |
| **Frontend Table Compatibility** | Directly matches the data requirements of UI pagination components (such as React paginated tables or DataTables). |

### Execution Flow in Spring Data

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
    DB-->>Repo: 10 product records
    Repo->>DB: SELECT COUNT(*) FROM products
    DB-->>Repo: Total: 1,450 records
    Repo-->>Svc: Page<Product> (data + metadata)
    Svc-->>Ctrl: Page<ProductDTO>
    Ctrl-->>Client: HTTP 200 OK with Page JSON`} />

The diagram above illustrates the two-step querying executed by `Page<T>`: first, it fetches the paginated window using `LIMIT` and `OFFSET`, and second, it runs a count query to obtain the total number of matching records.

---

## 2. Practical Guide: Step-by-Step

Follow these steps to configure a JPA entity, a paginated repository, a service layer, and an exposed REST endpoint.

<StepByStep>
  <Step number="1" title="Define the JPA Entity">
    Create the base entity using standard JPA and Lombok annotations to manage product catalog data.

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

    // Commercial product name
    private String name;

    // Category for filtering
    private String category;

    // Unit price used for sorting
    private Double price;

    // Available inventory units
    private Integer stock;
}
```
  </Step>

  <Step number="2" title="Create the Repository with PagingAndSortingRepository">
    In Spring Data JPA, `JpaRepository` already extends `PagingAndSortingRepository`. Therefore, any standard repository supports paginated methods out of the box.

```java title="src/main/java/com/icesi/store/repository/ProductRepository.java" showLineNumbers
package com.icesi.store.repository;

import com.icesi.store.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Derived method: filters by category and applies pagination
    Page<Product> findByCategory(String category, Pageable pageable);

    // Case-insensitive partial name search with pagination
    Page<Product> findByNameContainingIgnoreCase(String keyword, Pageable pageable);
}
```

:::info[How does findAll work?]
The `JpaRepository` interface already declares `Page<T> findAll(Pageable pageable)`. You do not need to redeclare it in your interface unless you are applying custom query filters.
:::
  </Step>

  <Step number="3" title="Implement Business Logic in the Service Layer">
    The service layer receives request parameters, validates sorting direction, and constructs the `Pageable` instance using `PageRequest`.

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
     * Retrieves paginated products with dynamic sorting.
     *
     * @param page Page index (0-based)
     * @param size Number of items per page
     * @param sortBy Entity attribute to sort by
     * @param direction Direction ("asc" or "desc")
     * @return Page of products with metadata
     */
    public Page<Product> getProducts(int page, int size, String sortBy, String direction) {
        // Resolve sort direction safely
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") 
                ? Sort.Direction.DESC 
                : Sort.Direction.ASC;

        // Build Sort specification
        Sort sort = Sort.by(sortDirection, sortBy);

        // Instantiate Pageable with page index, page size, and sort rules
        Pageable pageable = PageRequest.of(page, size, sort);

        // Execute query through repository
        return productRepository.findAll(pageable);
    }

    /**
     * Paginated category filter with default price ascending sort.
     */
    public Page<Product> getProductsByCategory(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("price").ascending());
        return productRepository.findByCategory(category, pageable);
    }
}
```
  </Step>

  <Step number="4" title="Expose the REST Endpoint in the Controller">
    Use `@RequestParam` with fallback defaults (`defaultValue`) so requests work seamlessly even without query string parameters.

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

  <Step number="5" title="Inspect the JSON Response Structure">
    When a client sends `GET /api/products?page=0&size=2&sortBy=price&direction=desc`, `Page<T>` produces the following JSON structure:

```json title="HTTP 200 OK Response" showLineNumbers
{
  "content": [
    {
      "id": 84,
      "name": "Pro Gaming Laptop",
      "category": "Computers",
      "price": 4500000.0,
      "stock": 12
    },
    {
      "id": 12,
      "name": "34-inch Curved Monitor",
      "category": "Displays",
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

:::tip[Direct Pageable Injection in Controller Parameters]
Spring MVC can bind `Pageable` directly as a controller parameter:
```java
@GetMapping
public ResponseEntity<Page<Product>> listProducts(Pageable pageable) {
    return ResponseEntity.ok(productRepository.findAll(pageable));
}
```
Spring automatically parses request parameters such as `?page=0&size=10&sort=price,desc` without manual binding.
:::
  </Step>
</StepByStep>

---

## 3. Self-Assessment Quiz

<Quiz id="comp2-semana6-paginacion-quiz-en">
  <Question title="What is the primary risk for the JVM when executing unpaginated queries such as findAll()?">
    <Option>Immediate closure of SSH connections to the host.</Option>
    <Option correct>Excessive heap memory consumption and crashes caused by java.lang.OutOfMemoryError.</Option>
    <Option>Permanent loss of tables in the database engine.</Option>
    <Option>Incompatibility with Spring Boot REST controllers.</Option>
  </Question>
  <Question title="What zero-based index does Spring Data JPA use by default for the initial page?">
    <Option>1</Option>
    <Option correct>0</Option>
    <Option>-1</Option>
    <Option>It depends on the configured SQL database dialect.</Option>
  </Question>
  <Question title="Which concrete class is standard for instantiating a Pageable object with page number, size, and sort order?">
    <Option>PageBuilder</Option>
    <Option>SortableList</Option>
    <Option correct>PageRequest</Option>
    <Option>PaginationFactory</Option>
  </Question>
  <Question title="What is the key technical difference between Page&lt;T&gt; and Slice&lt;T&gt;?">
    <Option>Slice&lt;T&gt; only works with NoSQL engines such as MongoDB.</Option>
    <Option correct>Page&lt;T&gt; executes an additional COUNT(*) query to determine total items, whereas Slice&lt;T&gt; does not.</Option>
    <Option>Page&lt;T&gt; does not allow sorting by entity attributes.</Option>
    <Option>Slice&lt;T&gt; loads all database records into memory before filtering.</Option>
  </Question>
  <Question title="In relational databases like PostgreSQL or MySQL, what clauses does Pageable translate to?">
    <Option>GROUP BY and HAVING</Option>
    <Option correct>LIMIT and OFFSET</Option>
    <Option>UNION and JOIN</Option>
    <Option>INDEX and CLUSTER</Option>
  </Question>
  <Question title="Which method on Page&lt;T&gt; returns the actual list of records for the current page?">
    <Option>getElements()</Option>
    <Option>getData()</Option>
    <Option correct>getContent()</Option>
    <Option>toList()</Option>
  </Question>
  <Question title="Why does JpaRepository natively support pagination without extra configurations?">
    <Option>Because all Java interfaces natively support pagination.</Option>
    <Option correct>Because JpaRepository inherits directly from PagingAndSortingRepository.</Option>
    <Option>Because Tomcat splits queries automatically in memory.</Option>
    <Option>Because it requires the mandatory @EnablePagination annotation.</Option>
  </Question>
  <Question title="How do you declare descending order for the 'price' attribute using the Sort class?">
    <Option>Sort.by(&quot;price&quot;).reverse()</Option>
    <Option correct>Sort.by(&quot;price&quot;).descending()</Option>
    <Option>Sort.direction(DESC, &quot;price&quot;)</Option>
    <Option>new Sort(&quot;price:down&quot;)</Option>
  </Question>
  <Question title="Why is it recommended to enforce an upper bound on the 'size' parameter in REST endpoints?">
    <Option>Because Spring Boot rejects page sizes above 10 by design.</Option>
    <Option>To prevent the database engine from dropping foreign key constraints.</Option>
    <Option correct>To protect the server against abusive requests attempting to fetch massive record sets at once.</Option>
    <Option>Because browsers cannot render JSON strings longer than 100 characters.</Option>
  </Question>
  <Question title="Which metadata method on Page&lt;T&gt; indicates if subsequent pages exist?">
    <Option>isEnd()</Option>
    <Option correct>hasNext()</Option>
    <Option>morePages()</Option>
    <Option>getNextOffset()</Option>
  </Question>
</Quiz>
