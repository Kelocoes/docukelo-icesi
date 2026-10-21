---
sidebar_position: 4
sidebar_label: "JWT Foundations & Architecture"
description: "Understand what a JSON Web Token is, how it is structured and how its issuance and validation flow in a REST API."
---

# JWT Foundations and Architecture

To build secure, high-performance REST APIs in Spring Boot, it is crucial to understand the **JSON Web Token (JWT)** standard, its cryptographic foundations, and how it integrates into the **Spring Security** lifecycle.

This guide explores the theoretical concepts, token anatomy, authentication and authorization request flows, and answers the most critical security questions encountered in real-world systems.

---

## 1. What is JWT and Why is it Used in REST APIs?

A **JSON Web Token (JWT)** is an open standard defined in [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519) that establishes a compact and self-contained format for securely transmitting structured information between parties as a JSON object.

### Key Characteristics

1. **Compact:** Due to its dot-delimited string structure, a JWT can easily be transmitted via HTTP headers (`Authorization: Bearer <token>`), URL query parameters, or POST request bodies.
2. **Self-Contained:** The token carries all necessary information about the authenticated subject (identifier, roles, issuance timestamp, expiration). The server does not need to look up session tables or RAM heaps to identify the client.
3. **Cryptographically Verifiable:** Although anyone can decode and inspect its contents, the token contains a digital signature generated using a secret key known only to the issuing server. This guarantees that data has not been tampered with in transit.

---

## 2. Cryptographic Anatomy of a JSON Web Token

A JWT token consists of three independent parts, each encoded in **Base64Url** and joined together by dots (`.`):

$$\text{JWT} = \text{Header} \,.\, \text{Payload} \,.\, \text{Signature}$$

<div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
  <img
    src="/img/computacion-2/jwt-structure-anatomy.svg"
    alt="Cryptographic Anatomy of a JSON Web Token"
    style={{ width: "100%", maxWidth: "980px" }}
  />
</div>

### Component Breakdown

#### A. Header
Declares the token metadata: the cryptographic signing algorithm (`alg`) and the token type (`typ`):
```json title="Decoded Header"
{
  "alg": "HS256",
  "typ": "JWT"
}
```
* `alg: "HS256"`: Specifies HMAC with the SHA-256 hash function.
* `typ: "JWT"`: Identifies the token as a JSON Web Token.

#### B. Payload (Claims)
Contains claims regarding the entity (typically the user) and additional operational metadata:
```json title="Decoded Payload"
{
  "sub": "user123",
  "email": "juan@example.com",
  "roles": ["ROLE_USER"],
  "iat": 1773517905,
  "exp": 1773604305
}
```
* **Registered Claims (RFC 7519):** Predefined standard claims:
  * `sub` (*Subject*): Unique identifier of the user (e.g., username or database ID).
  * `iat` (*Issued At*): Epoch timestamp when the token was created.
  * `exp` (*Expiration Time*): Epoch timestamp after which the token is invalid.
* **Custom Claims:** Application-specific properties (e.g., `email`, `roles`, or `tenantId`) that allow services to make authorization decisions without querying a database.

:::caution[JWT Tokens are NOT Encrypted]
The Header and Payload are merely **Base64Url-encoded**, not encrypted. Anyone who intercepts the token can decode and inspect the data in plain text. **Never place passwords, secret keys, or confidential information inside a JWT payload.**
:::

#### C. Signature
Guarantees **authenticity** and **integrity**. It is computed by taking the Base64Url-encoded Header, the Base64Url-encoded Payload, and signing them with a server-held secret key (`SECRET_KEY`):

```text title="Mathematical Signature Computation"
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  SECRET_KEY
)
```

If an attacker modifies even a single character in the Payload (e.g., changing `"ROLE_USER"` to `"ROLE_ADMIN"`), the recalculated signature will not match the token signature, causing the server to immediately reject the request.

---

## 3. Flow 1: Token Issuance (Login Flow)

To obtain a JWT token, the client submits credentials to a public authentication endpoint:

<ZoomableMermaid value={`sequenceDiagram
    autonumber
    actor Cliente as HTTP Client (Frontend / Postman)
    participant FilterChain as SecurityFilterChain
    participant Controller as AuthController
    participant Service as AuthService
    participant UserDetailsSvc as UserDetailsService
    participant DB as Database (JPA)
    participant Encoder as PasswordEncoder (BCrypt)
    participant JwtSvc as JwtService

    Cliente->>FilterChain: 1. POST /api/public/auth/login (username, password)
    Note over FilterChain: Public permitAll() route -> requires no prior token
    FilterChain->>Controller: 2. Hands request to controller
    Controller->>Service: 3. login(LoginRequestDTO)
    Service->>UserDetailsSvc: 4. loadUserByUsername(username)
    UserDetailsSvc->>DB: 5. Look up user and roles
    DB-->>UserDetailsSvc: 6. Return database entity
    UserDetailsSvc-->>Service: 7. Return UserDetails (hash + authorities)
    Service->>Encoder: 8. matches(rawPassword, storedHash)
    Encoder-->>Service: 9. Password valid (true)
    Service->>JwtSvc: 10. generateToken(user, authentication)
    Note over JwtSvc: Builds Header + Payload and signs with SECRET_KEY
    JwtSvc-->>Service: 11. Return String accessToken
    Service-->>Controller: 12. Return TokenResponseDTO(accessToken)
    Controller-->>Cliente: 13. HTTP 200 OK with { "accessToken": "eyJhbGci..." }
`} />

### Interacting Components in Issuance

| Component | Role in the Flow |
| :--- | :--- |
| **`SecurityFilterChain`** | Allows unauthenticated access because `/api/public/**` is configured with `permitAll()`. |
| **`AuthController`** | Exposes the REST endpoint and deserializes the JSON request body into a `LoginRequestDTO`. |
| **`AuthService`** | Orchestrates authentication: queries the user, validates the password using `PasswordEncoder`, and requests a signed token. |
| **`PasswordEncoder`** | Safely compares the plain text password submitted by the user against the BCrypt hash stored in the database. |
| **`JwtService`** | Uses the JWT library (JJWT) to assemble claims, set expiration, and sign the token using the secret key. |

---

## 4. Flow 2: Consuming Protected Endpoints (JWT Authorization)

Once the client receives the token, it includes it in the `Authorization` header of all subsequent requests using the `Bearer` scheme:

```http title="HTTP Header in Protected Request"
GET /api/usuarios/10 HTTP/1.1
Host: localhost:8080
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

<ZoomableMermaid value={`sequenceDiagram
    autonumber
    actor Cliente as HTTP Client
    participant Chain as SecurityFilterChain
    participant JwtFilter as JwtAuthenticationFilter (OncePerRequestFilter)
    participant JwtSvc as JwtService
    participant SecCtx as SecurityContextHolder
    participant AuthFilter as UsernamePasswordAuthenticationFilter
    participant Dispatcher as DispatcherServlet (@RestController)

    Cliente->>Chain: 1. GET /api/usuarios/10 con header Authorization Bearer token
    Chain->>JwtFilter: 2. Intercepts request (addFilterBefore)
    JwtFilter->>JwtFilter: 3. Header present and starts with "Bearer "?
    JwtFilter->>JwtSvc: 4. isTokenValid(token)
    Note over JwtSvc: Verifies signature with SECRET_KEY and checks exp > now
    JwtSvc-->>JwtFilter: 5. Valid token (true)
    JwtFilter->>JwtSvc: 6. getUserDetailsFromToken(token)
    JwtSvc-->>JwtFilter: 7. Return Principal + GrantedAuthorities
    JwtFilter->>SecCtx: 8. setAuthentication(UsernamePasswordAuthenticationToken)
    Note over SecCtx: User authenticated in current thread (ThreadLocal)
    JwtFilter->>AuthFilter: 9. filterChain.doFilter(request, response)
    Note over AuthFilter: User already authenticated -> skips form login
    AuthFilter->>Dispatcher: 10. Allows execution of @GetMapping method
    Dispatcher-->>Cliente: 11. HTTP 200 OK with requested data
`} />

---

## 5. Architectural Decisions in Spring Security

### Why does `JwtAuthenticationFilter` go BEFORE `UsernamePasswordAuthenticationFilter`?

In Spring Security configuration, we register the filter using:

```java title="Java example"
.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
```

**Technical Rationale:**
* `UsernamePasswordAuthenticationFilter` is the default filter designed for form-based login (`POST /login` with form-urlencoded fields or sessions).
* In a stateless REST API (`/api/**`), we need our JWT filter to inspect the `Authorization: Bearer <token>` header, validate the cryptographic signature, and populate `SecurityContextHolder` **before** any other filter attempts to redirect the user to a form or reject the request as unauthenticated.
* When execution proceeds down the chain toward authorization filters (`AuthorizationFilter`), Spring Security already finds the authenticated `Authentication` object ready in context.

### Is an `AuthenticationProvider` Required or is a Simple Filter Sufficient?

In Spring Security architecture, there are two primary approaches:

1. **Direct Filter Approach (`OncePerRequestFilter`):**
   * The filter extracts the token, `JwtService` validates signature and claims, and the filter directly builds a `UsernamePasswordAuthenticationToken` placed into `SecurityContextHolder`.
   * **Advantage:** Clean design, fewer classes, high processing speed, and loose coupling. Recommended for modern REST APIs and microservices.
2. **Custom `AuthenticationProvider` Approach:**
   * The filter creates an unauthenticated token, delegates to `AuthenticationManager.authenticate()`, which dispatches to a custom `AuthenticationProvider`.
   * **When needed:** Only when an application coordinates multiple disparate authentication backends (e.g., LDAP + biometric + JWT in the same chain). For standard REST services, the direct filter is cleaner and easier to maintain.

---

## 6. Critical Security Scenarios

### What Happens if a JWT Token is Stolen?
Because JWT is **stateless**, the server does not track issued tokens in memory. If an attacker intercepts the token (via Man-in-the-Middle or XSS), the server will accept it until it expires.

**Mitigation Strategies in Production:**
1. **Enforce HTTPS (TLS):** Encrypts all network traffic, preventing interception of HTTP headers.
2. **Short Expiration Windows:** Configure `accessToken` with a short lifespan (e.g., 15–60 minutes) to minimize exposure.
3. **Use Refresh Tokens:** Keep the access token short-lived, while maintaining a database-backed, revokable refresh token.
4. **Secure Client Storage:** In web browsers, store tokens in cookies flagged with `HttpOnly; Secure; SameSite=Strict`, preventing JavaScript-based XSS extraction.

### What Happens if an Attacker Modifies the Token?
If an attacker alters the payload (e.g., trying to claim `"roles": ["ROLE_ADMIN"]`):
1. The attacker modifies the JSON and re-encodes it in Base64Url.
2. When received by the server, `JwtService.isTokenValid(token)` re-computes the signature using the server's `SECRET_KEY`.
3. Because cryptographic signatures are mathematically bound to every bit of the header and payload, the computed signature will not match the token signature.
4. JJWT throws a `SignatureException`, and the request is immediately rejected with HTTP `401 Unauthorized`. **It is mathematically impossible to alter claims without invalidating the signature unless the server secret key is compromised.**

### What Happens When User Permissions Change in the Database?
This is known as the **Stale Claims** issue.

* **Default Behavior:** If an administrator revokes a role at 10:00 AM, but the user holds a token issued at 9:55 AM with validity until 10:55 AM, the server continues accepting old permissions for the remaining 55 minutes, because token validation does not touch the database.
* **Resolution Strategies:**
  * **Option A (Short Expiration):** Reduce token lifespan to 10–15 minutes, making the stale window negligible.
  * **Option B (Lightweight DB Lookup in Filter):** Inside `JwtAuthenticationFilter`, invoke `userDetailsService.loadUserByUsername(username)` to load fresh authorities on each request. Provides immediate consistency at the cost of one database query per request.
  * **Option C (Revocation Cache):** Track the timestamp when user permissions changed in an in-memory cache. If the token's `iat` claim predates that timestamp, reject the token immediately.

---

## Self-Assessment Quiz

<Quiz id="compu2-week11-jwt-foundations-quiz">
  <Question title="Why does the signature of a JWT guarantee data integrity in a stateless architecture?">
    <Option>Because it encrypts the payload on disk using a 512-bit symmetric cipher.</Option>
    <Option correct>Because any modification to the header or payload causes a mathematical mismatch against the signature verified with the server secret key.</Option>
    <Option>Because it continuously connects to the relational database to verify active session records.</Option>
    <Option>Because it converts JSON into binary bytecode that cannot be inspected by browsers.</Option>
  </Question>

  <Question title="In Spring Security for REST APIs, what is the purpose of .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)?">
    <Option>To enable Thymeleaf form logins for admin users.</Option>
    <Option>To require clients to supply their raw password on every request.</Option>
    <Option correct>To intercept the Bearer token and authenticate the user in SecurityContext before other filters attempt redirection or access denial.</Option>
    <Option>To disable HTTPS support on the embedded Tomcat server.</Option>
  </Question>

  <Question title="If an administrator revokes a permission in the database, what happens to an existing, non-expired JWT?">
    <Option>The token is deleted automatically from the client browser storage.</Option>
    <Option>The database sends a TCP signal that destroys the cryptographic signature.</Option>
    <Option correct>The token remains valid with old permissions until it expires, unless active DB checks or revocation lists are implemented.</Option>
    <Option>The server throws an HTTP 500 Internal Server Error on the next request.</Option>
  </Question>

  <Question title="Why should passwords and secret keys NEVER be stored in a JWT payload?">
    <Option>Because the JJWT library throws an exception when encountering the field name password.</Option>
    <Option>Because token size exceeds 10 megabytes.</Option>
    <Option correct>Because the payload is only Base64Url-encoded, not encrypted, meaning anyone can decode and read it in plain text.</Option>
    <Option>Because relational databases do not support storing Base64Url strings.</Option>
  </Question>
</Quiz>
