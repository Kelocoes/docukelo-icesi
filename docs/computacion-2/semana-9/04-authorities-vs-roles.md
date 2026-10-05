---
sidebar_position: 4
sidebar_label: "Authorities vs. Roles"
---

# Authorities vs. Roles

Una vez que el usuario está autenticado, Spring Security examina sus privilegios para determinar si tiene autorización para interactuar con las rutas o métodos del sistema.

Todo privilegio en Spring Security se representa mediante la interfaz `GrantedAuthority`. Sin embargo, a nivel de diseño se diferencian dos enfoques clave:

<div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
  <img
    src="/img/computacion-2/spring-security-authorities-roles.svg"
    alt="GrantedAuthority: Authorities vs Roles"
    style={{ width: "100%", maxWidth: "900px" }}
  />
</div>

---

## 1. Authorities (Permisos Puntuales / Acciones)

Representan **acciones específicas o permisos atómicos** sobre entidades del dominio. Definen con precisión quirúrgica qué puede ejecutar el usuario:
- Ejemplos: `READ`, `WRITE`, `DELETE_USER`, `EXPORT_REPORT`.
- En la configuración de rutas o anotaciones se verifican mediante `hasAuthority()`:
  ```java
  .requestMatchers(HttpMethod.DELETE, "/mvc/users/**").hasAuthority("DELETE_USER")
  ```

---

## 2. Roles (Perfiles Organizacionales / Cargos)

Representan **perfiles de usuario de alto nivel** que suelen agrupar un conjunto de authorities.
- Ejemplos: Administrador, Gerente, Cliente, Vendedor.
- **La Convención del Prefijo `ROLE_`:** En Spring Security, un rol es técnicamente una `GrantedAuthority` cuyo nombre comienza con el prefijo `ROLE_` (ej. `ROLE_ADMIN`, `ROLE_USER`).
- Al verificar un rol mediante `hasRole("ADMIN")`, Spring Security añade automáticamente el prefijo `ROLE_` por debajo:
  ```java
  // Ambas expresiones evalúan exactamente lo mismo:
  .requestMatchers("/mvc/admin/**").hasRole("ADMIN")
  .requestMatchers("/mvc/admin/**").hasAuthority("ROLE_ADMIN")
  ```

---

## 3. Buenas Prácticas de Diseño en Sistemas Complejos

:::tip[Desacoplamiento de Roles y Permisos en Base de Datos]
En arquitecturas empresariales maduras, los usuarios se vinculan a **Roles**, y cada Rol tiene asignada una lista de **Permisos (Authorities)** en la base de datos relacional. 

De esta forma, si cambian los permisos asignados a un rol, la configuración se ajusta dinámicamente en las tablas de la base de datos (`roles`, `permissions`, `role_permissions`) sin tener que modificar ni recompilar el código fuente Java de la aplicación.
:::

---

## Cuestionario de Autoevaluación

<Quiz id="compu2-semana9-authorities-vs-roles-quiz">
  <Question title="En Spring Security, ¿cuál es la diferencia conceptual entre una Authority y un Role?">
    <Option>Un Role es una clave criptográfica, mientras que una Authority es una sesión HTTP.</Option>
    <Option correct>Una Authority representa una acción atómica puntual (ej. WRITE), mientras que un Role es una agrupación de alto nivel que por convención lleva el prefijo ROLE_ (ej. ROLE_ADMIN).</Option>
    <Option>Las Authorities solo se aplican en controladores REST y los Roles solo en vistas Thymeleaf.</Option>
    <Option>Las Authorities son obligatorias para el login y los Roles son opcionales en el SecurityContext.</Option>
  </Question>
  <Question title="Si configuras una regla de autorización con hasRole('MANAGER'), ¿qué cadena de autoridad buscará internamente Spring Security?">
    <Option>MANAGER</Option>
    <Option>AUTH_MANAGER</Option>
    <Option correct>ROLE_MANAGER</Option>
    <Option>PERMISSION_MANAGER</Option>
  </Question>
  <Question title="¿Cuál es la ventaja de diseñar un esquema relacional donde los Roles agrupan Authorities en base de datos?">
    <Option>Reduce el costo computacional de las rondas de hashing de BCrypt.</Option>
    <Option>Permite que las peticiones HTTP no requieran pasar por el SecurityFilterChain.</Option>
    <Option>Elimina la necesidad de implementar la interfaz UserDetailsService.</Option>
    <Option correct>Permite modificar y reasignar privilegios dinámicamente en tablas relacionales sin tener que modificar ni recompilar el código Java de la aplicación.</Option>
  </Question>
</Quiz>
