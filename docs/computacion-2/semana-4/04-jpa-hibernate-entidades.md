---
sidebar_position: 4
sidebar_label: "JPA y Hibernate"
---

# JPA y Hibernate

**Mapeo Objeto-Relacional (ORM) y Entidades**

Para interactuar con bases de datos relacionales en aplicaciones Java modernas se utilizan tecnologías ORM (Object-Relational Mapping), las cuales traducen las clases y objetos del lenguaje a tablas y filas en el motor de base de datos.

---

## 1. Diferencia entre JPA y Hibernate

Existe una distinción fundamental entre la especificación y su implementación concreta:

<ZoomableMermaid value={`graph LR
    classDef jpaStyle fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0369a1;
    classDef hibStyle fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e;
    classDef dbStyle fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#166534;

    JPA["JPA (Jakarta Persistence API)<br/>*Especificación Estándar (Interfaces y Anotaciones)*"]:::jpaStyle -->|Implementado por| HIB["Hibernate ORM Engine<br/>*Proveedor ORM (Generación de SQL y Gestión de Caché)*"]:::hibStyle
    HIB -->|Ejecuta SQL sobre| DB[(Base de Datos Relacional<br/>PostgreSQL / H2 / MySQL)]:::dbStyle`} />

:::info[Explicación Detallada del Diagrama de Persistencia]
1. **JPA (Jakarta Persistence API)**: Es una especificación del lenguaje Java (un conjunto de interfaces del paquete `jakarta.persistence.*` como `@Entity`, `@Id`, `@Column`). JPA **no contiene lógica ejecutable**; simplemente define el estándar de anotaciones y contratos.
2. **Hibernate ORM**: Es la implementación concreta (el motor) elegida por defecto en Spring Boot. Lee las anotaciones de JPA, traduce las operaciones de objetos a sintaxis SQL según el dialecto configurado y administra la sesión de persistencia.
3. **Base de Datos Relacional**: Es el motor físico donde residen los datos tabulares.
:::

---

## 2. Mapeo de Entidades JPA y sus Anotaciones

Una **Entidad** es una clase POJO (Plain Old Java Object) que representa una tabla en la base de datos. Cada instancia de la clase corresponde a una fila en la tabla.

### 2.1. Anotaciones de Mapeo Fundamental

| Anotación | Propósito | Atributos Comunes |
|---|---|---|
| `@Entity` | Declara que la clase Java es una entidad administrada por JPA. | `name` (nombre lógico de la entidad en JPQL) |
| `@Table` | Especifica la tabla física en la base de datos. | `name`, `schema`, `uniqueConstraints` |
| `@Id` | Marca un atributo como la clave primaria (*Primary Key*). | N/A |
| `@GeneratedValue` | Especifica la estrategia de generación automática de la clave primaria. | `strategy` (`IDENTITY`, `SEQUENCE`, `AUTO`, `TABLE`) |
| `@Column` | Configura los detalles de mapeo de la columna física. | `name`, `nullable`, `unique`, `length`, `precision` |
| `@JoinColumn` | Define la columna de clave foránea (*Foreign Key*) en relaciones. | `name`, `referencedColumnName`, `nullable` |
| `@Transient` | Indica que el atributo no debe persistirse en la base de datos. | N/A |

---

## 3. Modelo de Base de Datos Relacional (Diagrama ER)

Antes de escribir el código en Java, visualizamos el diseño del esquema relacional de la base de datos para un dominio de catálogo de productos:

<ZoomableMermaid value={`erDiagram
    CATEGORIAS ||--|{ PRODUCTOS : "clasifica (1:N)"
    PROVEEDORES ||--|{ PRODUCTOS : "suministra (1:N)"

    CATEGORIAS {
        bigint id PK
        varchar_80 nombre
        varchar_255 descripcion
    }

    PROVEEDORES {
        bigint id PK
        varchar_100 nombre_empresa
        varchar_50 nit_ruc
    }

    PRODUCTOS {
        bigint id PK
        varchar_120 nombre_producto
        numeric_10_2 precio
        varchar_50 codigo_sku
        bigint categoria_id FK
        bigint proveedor_id FK
    }`} />

:::info[Explicación Detallada del Diagrama Entidad-Relación]
- **`CATEGORIAS`**: Tabla padre que almacena la clasificación del producto. Relación `1 a N` con `PRODUCTOS`.
- **`PROVEEDORES`**: Tabla padre que representa la empresa suministradora. Relación `1 a N` con `PRODUCTOS`.
- **`PRODUCTOS`**: Tabla principal que contiene dos Claves Foráneas (`FK`): `categoria_id` y `proveedor_id`, las cuales enlazan físicamente hacia las claves primarias (`PK`) de las tablas padres.
:::

---

## 4. Mapeo Completo en Código Java con JPA y Lombok

A continuación se traduce el diagrama ER a código de entidades Java utilizando anotaciones de JPA y Lombok:

### 4.1. Entidad `Category` (Tabla `categorias`)

```java title="src/main/java/com/icesi/app/model/Category.java" showLineNumbers
package com.icesi.app.model;

import jakarta.persistence.*;
import lombok.*;

// Marca la clase como Entidad administrada por el contexto de JPA
@Entity
// Define el nombre físico de la tabla en la base de datos relacional
@Table(name = "categorias")
// Lombok: Genera métodos de lectura Getters para todos los campos
@Getter
// Lombok: Genera métodos de modificación Setters para todos los campos
@Setter
// Lombok: Constructor vacío obligatorio requerido por el motor de reflexión de JPA
@NoArgsConstructor
// Lombok: Constructor completo con todos los atributos
@AllArgsConstructor
// Lombok: Construcción fluida de instancias mediante el patrón Builder
@Builder
public class Category {

    // Define la clave primaria (Primary Key)
    @Id
    // Estrategia IDENTITY: Delega la autogeneración al campo AUTO_INCREMENT/SERIAL de la BD
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Columna obligatoria (NOT NULL) con longitud máxima de 80 caracteres
    @Column(name = "nombre", nullable = false, length = 80)
    private String name;

    // Columna opcional de descripción detallada
    @Column(name = "descripcion", length = 255)
    private String description;
}
```

### 4.2. Entidad `Supplier` (Tabla `proveedores`)

```java title="src/main/java/com/icesi/app/model/Supplier.java" showLineNumbers
package com.icesi.app.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "proveedores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nombre comercial de la empresa proveedora
    @Column(name = "nombre_empresa", nullable = false, length = 100)
    private String companyName;

    // Número de identificación tributaria (único en la base de datos)
    @Column(name = "nit_ruc", unique = true, nullable = false, length = 50)
    private String taxId;
}
```

### 4.3. Entidad `Product` con Relaciones `@ManyToOne` (Tabla `productos`)

```java title="src/main/java/com/icesi/app/model/Product.java" showLineNumbers
package com.icesi.app.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "productos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nombre del producto no nulo con límite de 120 caracteres
    @Column(name = "nombre_producto", nullable = false, length = 120)
    private String name;

    // Precio unitario del producto
    @Column(name = "precio", nullable = false, precision = 10, scale = 2)
    private Double price;

    // Código SKU único de inventario
    @Column(name = "codigo_sku", unique = true, nullable = false, length = 50)
    private String sku;

    // Campo calculado o temporal en memoria (JPA ignorará este campo y NO creará columna en la BD)
    @Transient
    private String temporaryDiscountCode;

    // ==========================================
    // MAPEO DE RELACIONES RELACIONALES (FOREIGN KEYS)
    // ==========================================

    // Relación N:1 -> Muchos productos pertenecen a una Categoría
    // FetchType.LAZY evita cargar la categoría de la BD hasta que sea explícitamente consultada
    @ManyToOne(fetch = FetchType.LAZY)
    // Especifica la columna de clave foránea (Foreign Key) 'categoria_id' en la tabla 'productos'
    @JoinColumn(name = "categoria_id", nullable = false)
    private Category category;

    // Relación N:1 -> Muchos productos son suministrados por un Proveedor
    @ManyToOne(fetch = FetchType.LAZY)
    // Especifica la columna de clave foránea (Foreign Key) 'proveedor_id' en la tabla 'productos'
    @JoinColumn(name = "proveedor_id", nullable = false)
    private Supplier supplier;
}
```

---

## Cuestionario de Autoevaluación

<Quiz id="s4-jpa-hibernate-quiz">
  <Question title="¿Cuál es la relación técnica entre JPA y Hibernate?">
    <Option>JPA es el motor ejecutable en C++ y Hibernate es una biblioteca de frontend.</Option>
    <Option correct>JPA es la especificación estándar (interfaces y anotaciones) y Hibernate es la implementación concreta del motor ORM.</Option>
    <Option>JPA administra la base de datos H2 y Hibernate administra PostgreSQL.</Option>
    <Option>Son dos frameworks independientes incompatibles entre sí.</Option>
  </Question>
  <Question title="¿Qué indica la anotación @Entity sobre una clase Java?">
    <Option>Que la clase representa un controlador de vistas Thymeleaf.</Option>
    <Option correct>Que la clase es una Entidad de datos persistente administrada por el contexto de JPA.</Option>
    <Option>Que los métodos de la clase serán expuestos en un puerto HTTP.</Option>
    <Option>Que la clase debe ser compilada usando Gradle en lugar de Maven.</Option>
  </Question>
  <Question title="¿Qué función cumple la anotación @Table(name = &quot;productos&quot;)?">
    <Option>Crear automáticamente una tabla HTML en el navegador.</Option>
    <Option correct>Especificar el nombre exacto de la tabla física en la base de datos relacional a la que se mapea la entidad Java.</Option>
    <Option>Indicar que la clase no debe conectarse a ninguna base de datos.</Option>
    <Option>Exportar el modelo de datos en formato Excel.</Option>
  </Question>
  <Question title="¿Cuál es el comportamiento de la estrategia GenerationType.IDENTITY en la anotación @GeneratedValue?">
    <Option>Generar claves primarias aleatorias con cadenas UUID.</Option>
    <Option correct>Delegar la autogeneración del valor de la clave primaria a la columna AUTO_INCREMENT o SERIAL de la base de datos relacional.</Option>
    <Option>Exigir que el programador ingrese el ID manualmente en cada inserción.</Option>
    <Option>Usar una secuencia global compartida en un archivo de texto.</Option>
  </Question>
  <Question title="¿Qué sucede cuando un atributo de entidad se marca con la anotación @Transient?">
    <Option>Se convierte en la clave primaria de la tabla.</Option>
    <Option correct>JPA lo ignora por completo durante el proceso de persistencia, evitando la creación de dicha columna en la base de datos.</Option>
    <Option>Se encripta de forma transparente con AES-256.</Option>
    <Option>Provoca un error de compilación si no tiene getter.</Option>
  </Question>
  <Question title="¿Qué anotación se utiliza para definir la columna física de clave foránea (Foreign Key) en una relación relacional?">
    <Option>@Column(primaryKey = true)</Option>
    <Option correct>@JoinColumn(name = &quot;categoria_id&quot;)</Option>
    <Option>@ForeignKeyMap</Option>
    <Option>@TableLink</Option>
  </Question>
  <Question title="¿Qué significa configurar FetchType.LAZY en una relación @ManyToOne?">
    <Option>Que la relación se cargará de inmediato en memoria apenas se instancie la entidad.</Option>
    <Option correct>Que la entidad asociada no se consultará de la base de datos hasta que sea explícitamente requerida por el código.</Option>
    <Option>Que la clave foránea será destruida al cerrar la sesión.</Option>
    <Option>Que la relación solo funciona en entornos de desarrollo.</Option>
  </Question>
  <Question title="En la relación relacional 1 a N entre Categoría y Productos, ¿en qué tabla física reside la columna de Clave Foránea (FK)?">
    <Option>En la tabla CATEGORIAS.</Option>
    <Option correct>En la tabla PRODUCTOS (mediante la columna categoria_id).</Option>
    <Option>En una tabla auxiliar generada automáticamente llamada CATEGORIAS_PRODUCTOS.</Option>
    <Option>En la memoria RAM del servidor Tomcat.</Option>
  </Question>
  <Question title="¿Qué atributos se pueden configurar en la anotación @Column para ajustar las restricciones de la base de datos?">
    <Option>porcentual, maxConnections y activeProfile.</Option>
    <Option correct>name, nullable, unique, length, precision y scale.</Option>
    <Option>author, copyright y version.</Option>
    <Option>httpMethod, contentType y charset.</Option>
  </Question>
  <Question title="¿Qué combinación de anotaciones de Lombok se recomienda usar en clases de entidad JPA para evitar bucles infinitos?">
    <Option>@Data exclusivamente.</Option>
    <Option correct>@Getter, @Setter, @NoArgsConstructor, @AllArgsConstructor y @Builder de manera explícita.</Option>
    <Option>@Value únicamente.</Option>
    <Option>@Controller y @ResponseBody.</Option>
  </Question>
</Quiz>
