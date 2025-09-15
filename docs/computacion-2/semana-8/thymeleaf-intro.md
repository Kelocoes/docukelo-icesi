---
sidebar_position: 1
---

# Thymeleaf Intro

Introducción a Spring MVC usando Thymeleaf como motor de plantillas.


## Qué es Thymeleaf?

Thymeleaf es un motor de plantillas Java orientado a la generación de vistas HTML (aunque soporta otros modos como XML, TEXT y JAVASCRIPT). Fue diseñado con dos ideas clave:

1. **Natural templating**: las plantillas Thymeleaf son HTML válidos que pueden renderizarse en el navegador tal cual (para facilitar diseño y colaboración con diseñadores). Esto significa que antes de procesarlas en el servidor, los archivos `.html` se ven y funcionan como HTML normal.
2. **Integración con Java y Spring**: Thymeleaf ofrece una sintaxis expresiva (`th:*`) para acceder a variables del modelo, utilidades y realizar manipulaciones ligeras (iteración, condicionales, inyección de atributos, etc.). Tiene integración directa con Spring MVC y Spring Boot, incluida compatibilidad con binding de formularios y utilidades extras para Spring Security.

Elementos clave:

- **Template Engine**: procesa plantillas (files) y las convierte en texto (normalmente HTML) usando un `TemplateResolver` y un `TemplateEngine`.
- **Template Modes**: Thymeleaf puede procesar plantillas en varios modos: `HTML`, `XML`, `TEXT`, `JAVASCRIPT` y `CSS`.
- **Standard Dialect**: conjunto por defecto de atributos `th:*` y expresiones.
- **Extensions / Extras**: por ejemplo `thymeleaf-extras-springsecurity5` para helpers de seguridad.

Comparativa rápida con otros motores:

- **JSP**: JSP mezcla Java con HTML; Thymeleaf promueve separación y natural templating.
- **FreeMarker / Velocity**: también son poderosos, pero Thymeleaf pone énfasis en HTML nativo y mejor integración con Spring Boot.


## Ventajas de hacer Server Side Rendering (SSR)

**Server Side Rendering (SSR)** implica construir el HTML en el servidor antes de enviarlo al cliente. Thymeleaf es ideal para SSR en aplicaciones Java/Spring.

### Ventajas

- **SEO y social previews**: motores de búsqueda y redes sociales ven contenido ya renderizado (mejor indexación y rich previews).
- **Rápida primera carga**: el navegador recibe HTML completo (no depende de JavaScript para mostrar contenido inicial), especialmente útil en conexiones lentas o dispositivos con baja capacidad.
- **Seguridad**: el procesamiento de datos sensibles ocurre en el servidor (menor exposición), y Thymeleaf escapa por defecto el contenido para evitar XSS si se usa `th:text`.
- **Simplicidad para aplicaciones tradicionales**: para apps con roles de servidor/cliente clásicos (formularios, páginas multipágina), SSR reduce complejidad de la arquitectura (no necesitas SPAs completas).
- **Accesibilidad progresiva**: los usuarios sin JS o con bloqueadores aún reciben contenido funcional.
- **Colaboración con diseñadores**: los archivos HTML se ven igual antes y después del procesamiento (natural templating).

### Desventajas / trade-offs

- **Interactividad compleja**: aplicaciones muy interactivas o ricas en estado en el cliente suelen beneficiarse de arquitecturas SPA/CSR (con frameworks JS). SSR es complementario y puede combinarse con JavaScript.
- **Escalado**: renderizar HTML en servidor añade CPU/latencia por cada petición; hay que considerar caching, CDN y escalado horizontal.
- **Experiencias con muchas actualizaciones en tiempo real**: para UIs que cambian constantemente por cliente puede resultar más eficiente delegar lógica al cliente.

Resumen: SSR con Thymeleaf es excelente para aplicaciones web convencionales, dashboards con actualizaciones periódicas y páginas que requieren buen SEO; para aplicaciones altamente interactivas conviene evaluar combinación híbrida (SSR + JS progresivo).


## Configuración de Thymeleaf en Spring Boot

Spring Boot facilita la configuración de Thymeleaf con auto-configuración si se incluye la dependencia `spring-boot-starter-thymeleaf`.

### 1) Dependencias

**Maven**:

```xml
<!-- pom.xml -->
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-thymeleaf</artifactId>
    </dependency>
</dependencies>
```

**Gradle (Groovy DSL)**:

```groovy
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
}
```

> `spring-boot-starter-thymeleaf` trae Thymeleaf y la integración con Spring Boot; no es necesario configurar `TemplateEngine` manualmente para la mayoría de casos.


### 2) Estructura de carpetas (convención)

```
src/
  main/
    java/  (tu código Java)
    resources/
      static/          (css, js, images — accesibles tal cual)
      templates/       (archivos .html de Thymeleaf)
      application.properties
```

- Los templates por defecto deben ir en `src/main/resources/templates`.
- Los recursos estáticos en `src/main/resources/static` (por ejemplo `static/css/style.css`), referenciados con `@{/css/style.css}`.

### 3) Propiedades útiles (application.properties / application.yml)

```properties
# Prefijos/sufijos y modo
spring.thymeleaf.prefix=classpath:/templates/
spring.thymeleaf.suffix=.html
spring.thymeleaf.mode=HTML
spring.thymeleaf.encoding=UTF-8

# Cache: en producción conviene true; en desarrollo false
spring.thymeleaf.cache=false

# Force template resolver order y check for existence
spring.thymeleaf.check-template-location=true
```


### 4) Personalización avanzada

Spring Boot auto-configura un `SpringTemplateEngine` con un `SpringResourceTemplateResolver`. Si necesitas personalizar (por ejemplo cambiar orden de resolvers, añadir dialects o configurar cache dinámicamente), puedes declarar beans en una clase `@Configuration`:

```java
@Configuration
public class ThymeleafConfig {

    @Bean
    public SpringResourceTemplateResolver templateResolver() {
        SpringResourceTemplateResolver resolver = new SpringResourceTemplateResolver();
        resolver.setPrefix("classpath:/templates/");
        resolver.setSuffix(".html");
        resolver.setTemplateMode(TemplateMode.HTML);
        resolver.setCacheable(false); // cambiar según entorno
        return resolver;
    }

    @Bean
    public SpringTemplateEngine templateEngine(SpringResourceTemplateResolver resolver) {
        SpringTemplateEngine engine = new SpringTemplateEngine();
        engine.setTemplateResolver(resolver);
        // registrar dialects si se requiere
        // engine.addDialect(new LayoutDialect());
        return engine;
    }
}
```

> Nota: si defines tus propios beans asegúrate de no romper la auto-configuración innecesariamente.

## Sintaxis básica de Thymeleaf

Thymeleaf introduce atributos `th:*` y un lenguaje de expresiones. A continuación se explican los elementos clave con ejemplos prácticos.

### 1) Declaración en el HTML

Un archivo Thymeleaf típico comienza como HTML válido. Puedes añadir el namespace `xmlns:th` para que editores resalten los atributos (opcional en muchos casos pero recomendable):

```html
<!DOCTYPE html>
<html lang="es" xmlns:th="http://www.thymeleaf.org">
<head>
  <meta charset="UTF-8">
  <title th:text="${title}">Título por defecto</title>
</head>
<body>
  <!-- contenido -->
</body>
</html>
```

### 2) Acceder a variables del `Model`

En el controlador, normalmente agregas atributos al `Model`:

```java
@GetMapping("/saludo")
public String saludo(Model model){
    model.addAttribute("title", "Bienvenido");
    model.addAttribute("usuario", new Usuario("Ana", "ana@example.com"));
    return "saludo"; // renderiza templates/saludo.html
}
```

En la plantilla:

```html
<h1 th:text="${title}">Bienvenido</h1>
<p th:text="${usuario.name}">Nombre</p>
```

### 3) Tipos de expresiones

- **Variable expression:** `${...}` (variables del modelo, request params, etc.)
  - Ej: `th:text="${user.name}"`
- **Selection expression:** `*{...}` (selección relativa al `th:object` actual)
  - Ej: dentro de `th:object="${user}"`, usar `*{name}` es equivalente a `${user.name}`
- **Message expression:** `#{...}` (messages desde `messages.properties`)
  - Ej: `th:text="#{label.username}"`
- **Link expression:** `@{...}` (construir URLs context-aware)
  - Ej: `th:href="@{/productos/{id}(id=${p.id})}"`
- **Fragment expression:** `~{...}` (usar fragmentos)
  - Ej: `th:replace="~{fragments/header :: mainHeader}"`

### 4) Atributos `th:*` comunes

- `th:text` — inserta texto escapado (seguro contra XSS)
- `th:utext` — texto sin escapar
- `th:each` — iteración
- `th:if` / `th:unless` — condicionales
- `th:switch` / `th:case` — switch/case
- `th:href` / `th:src` — rutas dinámicas
- `th:attr` — manipular atributos
- `th:classappend` — clases dinámicas
- `th:value` / `th:field` — inputs de formularios


### 5) Formularios y binding

Uso de `th:object` y `th:field` con binding de validaciones.

### 6) Fragments y layouts

Permite reuso de componentes y plantillas parciales (`th:insert`, `th:replace`).

### 7) Recursos estáticos y JavaScript inline

`@{}` permite enlazar recursos estáticos. `th:inline="javascript"` permite interpolar valores en scripts.

### 8) Utilidades `#`

Objetos como `#dates`, `#numbers`, `#strings` ayudan a formatear y manipular datos.
