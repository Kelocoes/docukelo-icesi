---
sidebar_position: 3
sidebar_label: "Spring Security Architecture"
---

# Spring Security Architecture

To master Spring Security rather than relying on copy-pasting configurations, we must examine how the framework intercepts and processes every incoming HTTP request inside the Servlet container (Apache Tomcat):

<div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
  <img
    src="/img/computacion-2/spring-security-architecture-filterchain.svg"
    alt="Spring Security Internal Architecture"
    style={{ width: "100%", maxWidth: "980px" }}
  />
</div>

---

## 1. The HTTP Request Lifecycle in Detail

When a client sends a request to an endpoint in our application, the request interacts sequentially with the components of Spring Security. Trace the step-by-step lifecycle below:

<ZoomableMermaid value={`sequenceDiagram
    autonumber
    actor Client as HTTP Client (Browser)
    participant FilterChain as SecurityFilterChain<br/>(FilterChainProxy)
    participant AuthFilter as UsernamePassword<br/>AuthenticationFilter
    participant AuthManager as AuthenticationManager<br/>(ProviderManager)
    participant AuthProvider as DaoAuthenticationProvider
    participant UserDetailsSvc as CustomUserDetailsService
    participant DB as Database (JPA)
    participant PasswordEnc as PasswordEncoder<br/>(BCrypt)
    participant SecurityCtx as SecurityContextHolder<br/>(ThreadLocal)
    participant Dispatcher as DispatcherServlet<br/>(@Controller)

    Client->>FilterChain: 1. POST /login (username, password)
    FilterChain->>AuthFilter: 2. Intercepts and extracts credentials
    AuthFilter->>AuthManager: 3. authenticate(unauthenticatedToken)
    AuthManager->>AuthProvider: 4. authenticate(token)
    AuthProvider->>UserDetailsSvc: 5. loadUserByUsername(username)
    UserDetailsSvc->>DB: 6. Query user record by username
    DB-->>UserDetailsSvc: 7. Returns User database entity
    UserDetailsSvc-->>AuthProvider: 8. Returns UserDetails (hash + roles)
    AuthProvider->>PasswordEnc: 9. matches(rawPassword, storedHash)
    PasswordEnc-->>AuthProvider: 10. true (password matches)
    AuthProvider-->>AuthManager: 11. Returns Authentication (validated)
    AuthManager-->>AuthFilter: 12. Returns completed Authentication
    AuthFilter->>SecurityCtx: 13. setAuthentication(auth)
    AuthFilter-->>Client: 14. Successful redirect (302 to /mvc/users)
    Note over Client,Dispatcher: Subsequent requests from authenticated user:
    Client->>FilterChain: 15. GET /mvc/users (JSESSIONID cookie)
    FilterChain->>SecurityCtx: 16. Validates Principal & GrantedAuthorities
    FilterChain->>Dispatcher: 17. Dispatches to Controller (200 OK)
`} />

---

## 2. Anatomy of Architectural Components

### A. Security Filter Chain (`SecurityFilterChain`)
In standard Java Web (Jakarta EE), **Filters** are interceptors executed before a request reaches the primary `Servlet` (`DispatcherServlet`). Spring Security registers an ordered chain of specialized filters (`SecurityFilterChain` managed by `FilterChainProxy`). Each filter handles a specific concern (CORS validation, CSRF protection, capturing login credentials, or validating URL path permissions).

### B. Authentication Filter (`UsernamePasswordAuthenticationFilter`)
This filter intercepts login attempts. It reads username and password parameters from the request body (in forms) or from the `Authorization: Basic ...` header. It wraps these credentials into an unauthenticated `UsernamePasswordAuthenticationToken` and delegates it to the central manager.

### C. AuthenticationManager (`ProviderManager`)
The core interface defining the authentication contract (`authenticate(Authentication)`). In practice, Spring Security uses its default implementation: `ProviderManager`. The manager does not perform verification itself; instead, it acts as a coordinator, iterating through a list of registered providers until finding one capable of supporting that credential type.

### D. AuthenticationProvider (`DaoAuthenticationProvider`)
The component containing the **concrete verification logic**. For applications backed by relational databases, Spring utilizes `DaoAuthenticationProvider`. This provider:
1. Calls the `UserDetailsService` to fetch the user from persistent storage.
2. Uses the `PasswordEncoder` to check whether the submitted plain password matches the stored database hash.
3. If matching, constructs and returns a fully authenticated and validated `Authentication` object.

### E. UserDetailsService and UserDetails
- **`UserDetailsService`:** A functional interface with a single method:
  ```java
  UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
  ```
  Serves as the adapter between Spring Security and your persistence layer (JPA Repositories).
- **`UserDetails`:** The abstraction representing a user identity in Spring Security. Provides standard methods to query credentials and account state:
  - `getUsername()`: The account username.
  - `getPassword()`: The stored password hash.
  - `getAuthorities()`: Collection of assigned permissions and roles (`GrantedAuthority`).
  - `isAccountNonExpired()`, `isAccountNonLocked()`, `isEnabled()`: Account lifecycle status flags.

### F. PasswordEncoder
The interface responsible for processing and validating passwords:
```java
public interface PasswordEncoder {
    String encode(CharSequence rawPassword);
    boolean matches(CharSequence rawPassword, String encodedPassword);
}
```
In modern production environments, the mandatory standard implementation is `BCryptPasswordEncoder`.

### G. SecurityContextHolder and SecurityContext
Once a user is successfully authenticated, the filter stores the validated `Authentication` instance inside the `SecurityContextHolder`:
```java
SecurityContextHolder.getContext().setAuthentication(authenticatedToken);
```
The `SecurityContextHolder` stores this information using **`ThreadLocal`**, binding the security context to the execution thread of the active request. Consequently, any controller or service can inspect the authenticated user at any point:
```java
Authentication auth = SecurityContextHolder.getContext().getAuthentication();
String currentUsername = auth.getName();
```

---

## Self-Assessment Quiz

<Quiz id="compu2-semana9-arquitectura-spring-security-quiz">
  <Question title="What is the role of AuthenticationManager in the Spring Security authentication workflow?">
    <Option>Directly connecting to the relational database using JDBC queries.</Option>
    <Option>Hashing the user plaintext password in memory before reaching the filter.</Option>
    <Option correct>Acting as a central coordinator delegating credential validation to one or more registered AuthenticationProviders.</Option>
    <Option>Rendering the login template or corresponding Thymeleaf view.</Option>
  </Question>
  <Question title="What contract does the UserDetailsService interface define to bridge the application database with Spring Security?">
    <Option>boolean authenticate(String user, String pass)</Option>
    <Option correct>UserDetails loadUserByUsername(String username)</Option>
    <Option>void saveUserCredentials(UserDetails userDetails)</Option>
    <Option>String encodePassword(CharSequence rawPassword)</Option>
  </Question>
  <Question title="How does SecurityContextHolder store authenticated user details during the HTTP request lifecycle?">
    <Option>Inside a global static variable shared across all server concurrent users.</Option>
    <Option>By writing a temporary cache file to the web server local hard drive.</Option>
    <Option>Inside a database audit table updated on every individual request.</Option>
    <Option correct>Using ThreadLocal storage strictly bound to the execution thread of the active Servlet request.</Option>
  </Question>
</Quiz>

