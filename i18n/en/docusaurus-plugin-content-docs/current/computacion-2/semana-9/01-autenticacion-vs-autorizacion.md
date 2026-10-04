---
sidebar_position: 1
sidebar_label: "Authentication vs Authorization"
---

# Authentication vs. Authorization and Application Security

In previous weeks of Network Computing 2, we explored the internal architecture of Spring Boot, the lifecycle of Beans, relational persistence with Spring Data JPA, and building dynamic views with Server-Side Rendering (SSR) via Thymeleaf.

However, until now our applications have been completely open: any user with network access could trigger controllers, alter database records, or access administrative views. In enterprise systems, **security is not an afterthought**; it is a critical non-functional requirement that must be embedded into the core architecture (*Secure by Design*).

---

## 1. Application-Level Security

When thinking about computer security, we often picture perimeter infrastructure mechanisms: firewalls, reverse proxies, virtual private networks (VPNs), or cloud subnet security groups. While these perimeter defenses are indispensable, **they have no understanding of business context**.

A network firewall can verify that an incoming request arrives from an allowed IP address over port `443` encrypted with HTTPS, but **it cannot know** whether the person making the request is a student checking their own grades or an attacker attempting to wipe the grades of the entire class.

:::info[Principle of Defense in Depth]
**Application-level security** evaluates the semantic context of each interaction: it determines who the acting user is, verifies the authenticity of their credentials, and checks whether they possess the organizational permissions required to execute a specific method or access a protected resource.
:::

---

## 2. The Core of Access Control

Every access control system is founded on strictly and sequentially answering two separate questions:

<div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
  <img
    src="/img/computacion-2/authn-vs-authz-conceptual.svg"
    alt="Authentication vs Authorization"
    style={{ width: "100%", maxWidth: "920px" }}
  />
</div>

### A. Authentication — *Who are you?*
The process of **verifying the identity claimed** by an external user, system, or service.
- **Input:** An identifier (*username*, email, client ID) accompanied by verifiable proof (*credentials*, such as a password, JWT token, or digital certificate).
- **Process:** The system compares the provided credentials against a trusted identity store (relational database, LDAP directory, or OAuth2 provider).
- **Outcome:** If valid, the system establishes a **Principal** (an object representing the authenticated user in the current session/thread context). If mismatched, it rejects the request, typically returning an **HTTP 401 Unauthorized** status code.

### B. Authorization (Access Control) — *What are you allowed to do?*
The process of **determining whether an authenticated user has sufficient privileges** to perform a specific action or access a protected resource.
- **Input:** The verified identity (*Principal*), their assigned permissions (*Granted Authorities* / *Roles*), and the requested endpoint or operation (e.g., `DELETE /mvc/users/42`).
- **Process:** The security engine evaluates the configured access rules (e.g., *"Only users with role ADMIN can delete accounts"*).
- **Outcome:** If the user holds the required permissions, execution continues to the controller (`200 OK`). If privileges are insufficient, the operation is blocked, returning an **HTTP 403 Forbidden** status code.

---

## 3. Comparative Matrix: Authentication vs. Authorization

| Criterion | Authentication | Authorization |
| :--- | :--- | :--- |
| **Core Question** | *Who are you?* | *What are you allowed to do?* |
| **Stage in Flow** | Mandatory first step. Always precedes authorization. | Second step. Operates strictly on already-authenticated identities. |
| **Key Data Used** | Credentials (Username, Password, Tokens, OTP, Biometrics). | Atomic permissions (*Authorities*) or user profiles (*Roles*). |
| **Failure HTTP Code** | **HTTP 401 Unauthorized** (missing or invalid identity). | **HTTP 403 Forbidden** (valid identity, but insufficient permissions). |
| **Spring Abstraction** | `AuthenticationManager`, `AuthenticationProvider`, `PasswordEncoder`. | `SecurityFilterChain`, `AuthorizationFilter`, `@PreAuthorize`. |

---

## Self-Assessment Quiz

<Quiz id="compu2-semana9-authn-vs-authz-quiz">
  <Question title="What is the primary difference between Authentication and Authorization?">
    <Option>Authentication evaluates permissions on resources, while authorization validates username and password.</Option>
    <Option correct>Authentication verifies claimed identity (Who are you?), while authorization validates privileges to perform an action (What are you allowed to do?).</Option>
    <Option>Authentication occurs at the network firewall level, while authorization takes place directly in the database.</Option>
    <Option>Both concepts are synonymous and interchangeable within the Spring Security framework.</Option>
  </Question>
  <Question title="If a user submits invalid credentials or omits credentials when requesting a protected resource, which HTTP status code must the server return?">
    <Option>HTTP 403 Forbidden</Option>
    <Option correct>HTTP 401 Unauthorized</Option>
    <Option>HTTP 404 Not Found</Option>
    <Option>HTTP 500 Internal Server Error</Option>
  </Question>
  <Question title="Under the Principle of Defense in Depth, why are perimeter network firewalls insufficient on their own to protect business logic?">
    <Option>Because network firewalls do not support connections over HTTPS or TLS protocols.</Option>
    <Option>Because network firewalls only operate on Linux-based operating systems.</Option>
    <Option correct>Because firewalls validate origin IP addresses and ports, but have no understanding of application semantic context or user permissions.</Option>
    <Option>Because firewalls can only authenticate incoming requests that carry session cookies.</Option>
  </Question>
</Quiz>

