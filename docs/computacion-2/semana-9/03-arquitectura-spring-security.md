---
sidebar_position: 3
sidebar_label: "Arquitectura de Spring Security"
---

# Arquitectura de Spring Security

Para dominar Spring Security sin depender de configuraciones mágicas copiadas de internet, debemos entender cómo procesa el framework cada solicitud HTTP que ingresa al contenedor de Servlets (Apache Tomcat):

<div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
  <img
    src="/img/computacion-2/spring-security-architecture-filterchain.svg"
    alt="Arquitectura Interna de Spring Security"
    style={{ width: "100%", maxWidth: "980px" }}
  />
</div>

---

## 1. El Ciclo de Vida de una Petición HTTP en Detalle

Cuando un cliente envía una petición hacia un endpoint de nuestra aplicación, la solicitud interactúa secuencialmente con los componentes de Spring Security. Observa la traza paso a paso:

<ZoomableMermaid value={`sequenceDiagram
    autonumber
    actor Cliente as Cliente HTTP (Navegador)
    participant FilterChain as SecurityFilterChain<br/>(FilterChainProxy)
    participant AuthFilter as UsernamePassword<br/>AuthenticationFilter
    participant AuthManager as AuthenticationManager<br/>(ProviderManager)
    participant AuthProvider as DaoAuthenticationProvider
    participant UserDetailsSvc as CustomUserDetailsService
    participant DB as Base de Datos (JPA)
    participant PasswordEnc as PasswordEncoder<br/>(BCrypt)
    participant SecurityCtx as SecurityContextHolder<br/>(ThreadLocal)
    participant Dispatcher as DispatcherServlet<br/>(@Controller)

    Cliente->>FilterChain: 1. POST /login (username, password)
    FilterChain->>AuthFilter: 2. Intercepta y extrae credenciales
    AuthFilter->>AuthManager: 3. authenticate(unauthenticatedToken)
    AuthManager->>AuthProvider: 4. authenticate(token)
    AuthProvider->>UserDetailsSvc: 5. loadUserByUsername(username)
    UserDetailsSvc->>DB: 6. Consulta usuario por username
    DB-->>UserDetailsSvc: 7. Retorna entidad de base de datos
    UserDetailsSvc-->>AuthProvider: 8. Retorna UserDetails (hash + roles)
    AuthProvider->>PasswordEnc: 9. matches(rawPassword, storedHash)
    PasswordEnc-->>AuthProvider: 10. true (contraseña válida)
    AuthProvider-->>AuthManager: 11. Retorna Authentication (validado)
    AuthManager-->>AuthFilter: 12. Retorna Authentication completo
    AuthFilter->>SecurityCtx: 13. setAuthentication(auth)
    AuthFilter-->>Cliente: 14. Redirección exitosa (302 a /mvc/users)
    Note over Cliente,Dispatcher: Solicitudes posteriores del usuario autenticado:
    Cliente->>FilterChain: 15. GET /mvc/users (Cookie JSESSIONID)
    FilterChain->>SecurityCtx: 16. Valida Principal y GrantedAuthorities
    FilterChain->>Dispatcher: 17. Permite acceso al Controller (200 OK)
`} />

---

## 2. Anatomía de los Componentes Arquitectónicos

### A. Security Filter Chain (`SecurityFilterChain`)
En Java Web estándar (Jakarta EE), los **Filtros (Filters)** son interceptores que se ejecutan antes de que la petición alcance el `Servlet` principal (`DispatcherServlet`). Spring Security crea una cadena ordenada de filtros especializados (`SecurityFilterChain` administrada por `FilterChainProxy`). Cada filtro cumple una responsabilidad puntual (validar CORS, proteger contra ataques CSRF, capturar tokens de login o revisar permisos de ruta).

### B. Authentication Filter (`UsernamePasswordAuthenticationFilter`)
Es el filtro encargado de interceptar intentos de inicio de sesión. Lee el usuario y la contraseña provenientes del cuerpo de la petición (en formularios) o del encabezado `Authorization: Basic ...`. Empaqueta estos datos en un objeto no autenticado llamado `UsernamePasswordAuthenticationToken` y lo delega al gestor central.

### C. AuthenticationManager (`ProviderManager`)
Es la interfaz central que define el contrato de autenticación (`authenticate(Authentication)`). En la práctica, Spring Security utiliza su implementación por defecto llamada `ProviderManager`. El `AuthenticationManager` no realiza la verificación directamente; en su lugar, actúa como un coordinador que consulta a una lista de uno o más proveedores registrados hasta encontrar el que sabe procesar ese tipo de credencial.

### D. AuthenticationProvider (`DaoAuthenticationProvider`)
Es el componente que contiene la **lógica concreta de verificación**. Para aplicaciones basadas en bases de datos relacionales, Spring utiliza `DaoAuthenticationProvider`. Este proveedor:
1. Invoca al `UserDetailsService` para cargar el usuario desde la persistencia.
2. Utiliza el `PasswordEncoder` para verificar si la contraseña plana ingresada coincide matemáticamente con el hash almacenado en la base de datos.
3. Si la verificación es exitosa, construye y devuelve un objeto `Authentication` completamente autenticado y validado.

### E. UserDetailsService y UserDetails
- **`UserDetailsService`:** Es una interfaz funcional con un único método:
  ```java
  UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
  ```
  Actúa como el adaptador entre el motor de Spring Security y tu capa de persistencia (JPA Repositories).
- **`UserDetails`:** Es la abstracción que representa a un usuario para Spring Security. Proporciona métodos estándar para consultar las credenciales y el estado de la cuenta:
  - `getUsername()`: Nombre de usuario.
  - `getPassword()`: Hash de la contraseña.
  - `getAuthorities()`: Colección de permisos y roles (`GrantedAuthority`).
  - `isAccountNonExpired()`, `isAccountNonLocked()`, `isEnabled()`: Banderas de estado de la cuenta.

### F. PasswordEncoder
Interfaz responsable de procesar y validar contraseñas:
```java
public interface PasswordEncoder {
    String encode(CharSequence rawPassword);
    boolean matches(CharSequence rawPassword, String encodedPassword);
}
```
En entornos de producción modernos, la implementación obligatoria es `BCryptPasswordEncoder`.

### G. SecurityContextHolder y SecurityContext
Una vez que el usuario ha sido autenticado exitosamente, el filtro almacena el objeto `Authentication` validado dentro del `SecurityContextHolder`:
```java
SecurityContextHolder.getContext().setAuthentication(authenticatedToken);
```
El `SecurityContextHolder` almacena esta información utilizando **`ThreadLocal`**, lo que significa que el contexto de seguridad está ligado al hilo de ejecución de la petición actual. Gracias a esto, cualquier controlador o servicio puede consultar en cualquier momento quién es el usuario logueado:
```java
Authentication auth = SecurityContextHolder.getContext().getAuthentication();
String currentUsername = auth.getName();
```

---

## Cuestionario de Autoevaluación

<Quiz id="compu2-semana9-arquitectura-spring-security-quiz">
  <Question title="¿Cuál es el rol de AuthenticationManager en el flujo de autenticación de Spring Security?">
    <Option>Conectarse directamente con la base de datos relacional mediante JDBC.</Option>
    <Option>Hashear la contraseña del usuario en memoria antes de que llegue al filtro.</Option>
    <Option correct>Actuar como coordinador central delegando la validación a uno o más AuthenticationProviders registrados.</Option>
    <Option>Renderizar la vista de login o el formulario Thymeleaf correspondiente.</Option>
  </Question>
  <Question title="¿Qué contrato define la interfaz UserDetailsService para integrar la base de datos de la aplicación con Spring Security?">
    <Option>boolean authenticate(String user, String pass)</Option>
    <Option correct>UserDetails loadUserByUsername(String username)</Option>
    <Option>void saveUserCredentials(UserDetails userDetails)</Option>
    <Option>String encodePassword(CharSequence rawPassword)</Option>
  </Question>
  <Question title="¿Cómo almacena SecurityContextHolder la información del usuario autenticado durante el ciclo de vida de la petición HTTP?">
    <Option>En una variable estática global compartida entre todos los usuarios del servidor.</Option>
    <Option>Escribiendo un archivo temporal en el disco duro del servidor web.</Option>
    <Option>Dentro de la base de datos en una tabla de auditoría en cada petición.</Option>
    <Option correct>Utilizando el almacenamiento ThreadLocal asociado estrictamente al hilo de ejecución del Servlet actual.</Option>
  </Question>
</Quiz>
