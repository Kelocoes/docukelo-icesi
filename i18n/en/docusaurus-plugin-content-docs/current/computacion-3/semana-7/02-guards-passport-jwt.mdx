---
sidebar_position: 2
---

# Guards, Passport, and JSON Web Tokens (JWT)

Implementing an enterprise-grade security layer in NestJS requires understanding how three essential architectural pieces interact: the native **Guards** system, the battle-tested **Passport** authentication library via the **Strategy** pattern, and the **JSON Web Tokens (JWT)** standard.

In this guide, we analyze the architectural responsibility of Guards across the NestJS request lifecycle, the loose coupling enabled by the Strategy pattern, and the cryptographic anatomy of JWT tokens.

---

## 1. What is a Guard in NestJS?

A **Guard** is an `@Injectable()` class implementing the `CanActivate` interface. Its sole responsibility is to evaluate whether an incoming HTTP request is authorized to proceed to the targeted route handler.

<ZoomableMermaid value={`flowchart LR
    Req["HTTP Request"] --> Mid["Middlewares"]
    Mid --> G["Guards<br/>(CanActivate)"]
    G -->|true| Int1["Interceptors<br/>(Pre-controller)"]
    G -->|false / Exception| Err["401 / 403 Response"]
    Int1 --> P["Pipes<br/>(DTO Validation)"]
    P --> C["Controller<br/>(Route Handler)"]
    C --> Int2["Interceptors<br/>(Post-controller)"]
    Int2 --> Res["HTTP Response"]

    classDef guardStyle fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#92400e;
    classDef nestStyle fill:#eff6ff,stroke:#3b82f6,stroke-width:1.5px,color:#1e3a8a;
    classDef errStyle fill:#fee2e2,stroke:#dc2626,stroke-width:1.5px,color:#7f1d1d;

    class G guardStyle;
    class Mid,Int1,P,C,Int2,Req,Res nestStyle;
    class Err errStyle;`} />

### Position in the Request Lifecycle

Unlike traditional Express middlewares (which have no awareness of which controller class or handler method will execute next), Guards run **after middlewares** but **before interceptors and validation pipes**.

Guards receive the `ExecutionContext` instance, allowing them to inspect:
- The transport protocol context (HTTP, WebSockets, Microservices, or GraphQL).
- The underlying request object (`Request` from Express or Fastify).
- Metadata attached to the controller class or route handler method (via `Reflector`).

### The `CanActivate` Interface

Every Guard must implement the `canActivate` contract:

```typescript
export interface CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean>;
}
```

- Returning `true` allows the request pipeline to continue toward pipes and interceptors.
- Returning `false` causes NestJS to halt execution immediately and issue an HTTP `403 Forbidden` response.
- Throwing a recognized HTTP exception (e.g., `UnauthorizedException`) causes NestJS to emit the corresponding HTTP status code (`401 Unauthorized`).

---

## 2. The Passport Ecosystem and the Strategy Pattern

**Passport** is the predominant, field-tested authentication framework for Node.js. Its flexibility stems from its modular architecture centered on the **Strategy** design pattern.

### What is the Strategy Pattern?

The **Strategy Pattern** is a behavioral software design pattern that defines a family of algorithms, encapsulates each one into a dedicated class, and makes their instances interchangeable at runtime without altering client code.

<ZoomableMermaid value={`classDiagram
    class AuthGuard {
        +canActivate(context)
    }

    class PassportStrategyBase {
        <<abstract>>
        +validate(...args)*
    }

    class LocalStrategy {
        +validate(username, password)
    }

    class JwtStrategy {
        +validate(payload)
    }

    class GoogleStrategy {
        +validate(accessToken, profile)
    }

    AuthGuard --> PassportStrategyBase : delegates validation to
    PassportStrategyBase <|-- LocalStrategy : implements
    PassportStrategyBase <|-- JwtStrategy : implements
    PassportStrategyBase <|-- GoogleStrategy : implements`} />

### How Does NestJS Apply the Strategy Pattern?

Rather than coupling authentication logic directly inside controllers or middlewares:
1. The `@nestjs/passport` integration package provides the `PassportStrategy` base class.
2. We create dedicated strategy classes (such as `JwtStrategy`) that configure **how the token is extracted** (e.g., from the `Authorization: Bearer <token>` header) and **how its payload is verified**.
3. In controller routes, we simply bind the generic `AuthGuard('jwt')`. If authentication requirements evolve or OAuth2 providers are introduced in the future, controllers remain untouched.

---

## 3. Structure and Mechanics of JSON Web Tokens (JWT) (RFC 7519)

A **JSON Web Token (JWT)** is an open, standardized specification (RFC 7519) defining a compact, self-contained mechanism for securely transmitting structured information between parties as a JSON object.

<img src="/img/computacion-3/jwt-anatomy-flow.svg" alt="Anatomy and Lifecycle of a JWT" width="100%" />

### Anatomy of a JWT Token

A JWT token consists of three distinct strings separated by periods (`.`):

$$\text{JWT} = \text{Header} \,.\, \text{Payload} \,.\, \text{Signature}$$

```text title="Example Encoded JWT Token"
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyLCJlbWFpbCI6ImFuYUBpY2VzaS5lZHUuY28ifQ.k7G_X9R7q0LwE58vY6pZaM1o9TuQeWd8xP
```

#### 1. Header

Indicates token metadata: token type (`typ: "JWT"`) and the cryptographic algorithm employed to produce the digital signature (e.g., `alg: "HS256"` for HMAC-SHA256 or `RS256` for RSA public/private key pairs).

```json title="Decoded Header"
{
  "alg": "HS256",
  "typ": "JWT"
}
```

#### 2. Payload (Claims)

Contains assertions (*claims*) regarding an entity (typically the authenticated subject) alongside contextual metadata:

- **Registered Claims (RFC 7519)**:
  - `sub` (*Subject*): The unique identifier of the user (e.g., database primary key).
  - `iat` (*Issued At*): Epoch timestamp when the token was generated.
  - `exp` (*Expiration Time*): Epoch timestamp marking when the token ceases to be valid.
- **Public / Custom Claims**:
  - Non-sensitive domain data required by client applications, such as `email`, `role`, or granted `permissions`.

```json title="Decoded Payload"
{
  "sub": 12,
  "email": "ana@icesi.edu.co",
  "permissions": ["users:read", "users:create"],
  "iat": 1773517905,
  "exp": 1773521505
}
```

:::caution[JWTs Are NOT Encrypted by Default]
The Header and Payload segments are merely **Base64Url-encoded**, not encrypted. Any network intermediary or client inspecting the token can decode and view its claims instantly. **Never place passwords, secret keys, or credit card numbers inside a JWT payload.**
:::

#### 3. Signature

The signature guarantees the **integrity** and **authenticity** of the token. It is calculated by hashing the encoded header, encoded payload, and an application secret key known only to the backend server (`JWT_SECRET`):

```javascript
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  JWT_SECRET
)
```

If an attacker tampers with the `sub` claim or modifies permissions in the payload, the server's computed signature will mismatch the incoming token signature, rejecting the request instantly.

---

## 4. Stateful vs. Stateless: Why JWT?

Adopting JWT over traditional cookie-based sessions represents a major architectural divergence:

| Architectural Metric | Stateful Sessions (Cookie-Based) | Stateless Tokens (JWT) |
| :--- | :--- | :--- |
| **State Storage** | Server memory or distributed store (Redis, SQL). | Client-side (in-memory storage or HttpOnly cookies). |
| **Horizontal Scaling** | Requires shared session stores (*sticky sessions* or Redis clusters). | Seamless; any backend replica configured with `JWT_SECRET` validates requests. |
| **Server Memory Overhead** | Grows proportionally with the volume of concurrent sessions. | Negligible; the server holds zero active session records in memory. |
| **Network Overhead** | Low (cookie only transports a compact Session ID). | Moderate (tokens carry claims, expanding HTTP request headers). |
| **Immediate Revocation** | Instantaneous (simply remove the session key from Redis). | Challenging (valid until expiry unless blacklisting/revocation caches are built). |

---

## 5. Dependency Installation

To implement this security architecture in NestJS, install the following production and development packages:

```bash title="Terminal"
npm install @nestjs/passport passport passport-jwt @nestjs/jwt
npm install -D @types/passport-jwt
```

### Overview of Each Package:

1. **`@nestjs/passport`**: The official module integrating Passport into NestJS's Dependency Injection system, providing `PassportStrategy` and `AuthGuard`.
2. **`passport`**: Core Node.js authentication middleware library.
3. **`passport-jwt`**: Passport strategy for extracting and verifying JWT tokens from HTTP request headers (`Bearer <token>`).
4. **`@nestjs/jwt`**: Utility module wrapping `jsonwebtoken` for signing and verifying tokens via an injectable service.
5. **`@types/passport-jwt`**: TypeScript type definitions ensuring static type safety across JWT strategies.

---

## Self-Assessment Quiz

<Quiz id="compunet3-s7-02-guards-passport-jwt-quiz">
  <Question title="What is the primary responsibility of a Guard in a NestJS application?">
    <Option>To transform and validate incoming request body payloads using class-validator.</Option>
    <Option correct>To determine whether an incoming request has permission to access a specific route handler prior to its execution.</Option>
    <Option>To catch unhandled runtime exceptions and convert them into standardized JSON error structures.</Option>
    <Option>To encrypt the HTTP response payload before sending it over the network.</Option>
  </Question>

  <Question title="Which TypeScript interface must a class implement to operate as a Guard in NestJS?">
    <Option>NestInterceptor</Option>
    <Option>PipeTransform</Option>
    <Option correct>CanActivate</Option>
    <Option>ConsumerProvider</Option>
  </Question>

  <Question title="At what stage of the NestJS HTTP request lifecycle do Guards execute?">
    <Option>Immediately after the controller produces its final response.</Option>
    <Option>Before any global application middlewares run.</Option>
    <Option correct>After middlewares execute, but before interceptors and validation pipes associated with the controller handler.</Option>
    <Option>Only when an unhandled 500 server error is thrown.</Option>
  </Question>

  <Question title="Which software design pattern does Passport rely on to facilitate interchangeable authentication mechanisms?">
    <Option>Observer</Option>
    <Option>Singleton</Option>
    <Option correct>Strategy</Option>
    <Option>Abstract Factory</Option>
  </Question>

  <Question title="What three structural components comprise a standard JWT token according to RFC 7519?">
    <Option>Username, PasswordHash, and Salt.</Option>
    <Option>Protocol, Domain, and QueryParams.</Option>
    <Option correct>Header, Payload, and Signature.</Option>
    <Option>ClientKey, SecretKey, and Nonce.</Option>
  </Question>

  <Question title="Why is it strictly discouraged to store passwords or API secrets in a JWT Payload?">
    <Option>Because the TypeScript compiler triggers a memory leak warning.</Option>
    <Option correct>Because the Payload is only Base64Url-encoded rather than encrypted, allowing anyone to decode and read it.</Option>
    <Option>Because JWT tokens are signed using algorithms incompatible with alphanumeric text.</Option>
    <Option>Because the passport-jwt library rejects tokens with more than three properties.</Option>
  </Question>

  <Question title="Which standardized JWT claim (RFC 7519) represents the subject or user identifier by international convention?">
    <Option>usr</Option>
    <Option>id</Option>
    <Option correct>sub</Option>
    <Option>auth</Option>
  </Question>

  <Question title="What is the critical function of the digital Signature in a JWT token?">
    <Option>To hide the user's email address to comply with privacy regulations.</Option>
    <Option correct>To allow the server to verify token authenticity and ensure claims have not been tampered with by external parties.</Option>
    <Option>To accelerate TypeORM database queries executed on the backend.</Option>
    <Option>To automatically refresh the token whenever a user navigates between web pages.</Option>
  </Question>

  <Question title="What fundamental architectural advantage does Stateless (JWT) authentication offer over traditional Stateful session architectures?">
    <Option>It allows instant token invalidation without requiring persistent storage.</Option>
    <Option>It eliminates the need for environment variables across backend nodes.</Option>
    <Option correct>It simplifies horizontal scaling across server replicas, as backend nodes do not need to synchronize shared session memory.</Option>
    <Option>It reduces HTTP header sizes down to zero bytes.</Option>
  </Question>

  <Question title="Which official NestJS package provides the PassportStrategy base class and the AuthGuard helper decorator?">
    <Option>@nestjs/core</Option>
    <Option>@nestjs/common</Option>
    <Option correct>@nestjs/passport</Option>
    <Option>@nestjs/jwt</Option>
  </Question>
</Quiz>
