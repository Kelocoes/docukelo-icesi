---
sidebar_position: 4
sidebar_label: "Authorities vs. Roles"
---

# The Authorization Model: Authorities vs. Roles

Once a user is authenticated, Spring Security evaluates their privileges to determine whether they are authorized to access given endpoints or execute specific methods.

All privileges in Spring Security are represented through the `GrantedAuthority` interface. However, two distinct design approaches are supported:

<div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
  <img
    src="/img/computacion-2/spring-security-authorities-roles.svg"
    alt="GrantedAuthority: Authorities vs Roles"
    style={{ width: "100%", maxWidth: "900px" }}
  />
</div>

---

## 1. Authorities (Atomic Permissions / Actions)

Represent **fine-grained actions or granular operations** on domain entities. They specify precisely what the user can execute:
- Examples: `READ`, `WRITE`, `DELETE_USER`, `EXPORT_REPORT`.
- Checked in path configurations or security annotations via `hasAuthority()`:
  ```java
  .requestMatchers(HttpMethod.DELETE, "/mvc/users/**").hasAuthority("DELETE_USER")
  ```

---

## 2. Roles (Organizational Profiles / Job Titles)

Represent **high-level user profiles** that aggregate a set of authorities.
- Examples: Administrator, Manager, Customer, SalesRep.
- **The `ROLE_` Prefix Convention:** In Spring Security, a role is technically a `GrantedAuthority` prefixed with `ROLE_` (e.g., `ROLE_ADMIN`, `ROLE_USER`).
- When checking a role with `hasRole("ADMIN")`, Spring Security automatically appends the `ROLE_` prefix under the hood:
  ```java
  // Both expressions evaluate identically:
  .requestMatchers("/mvc/admin/**").hasRole("ADMIN")
  .requestMatchers("/mvc/admin/**").hasAuthority("ROLE_ADMIN")
  ```

---

## 3. Architectural Best Practices for Complex Systems

:::tip[Decoupling Roles and Permissions in Relational Databases]
In mature enterprise architectures, users are assigned to **Roles**, and each Role is mapped to a list of **Permissions (Authorities)** in the relational database.

This enables permission sets to be reconfigured dynamically at runtime in the database tables (`roles`, `permissions`, `role_permissions`) without requiring Java source code recompilation or application redeployment.
:::

---

## Self-Assessment Quiz

<Quiz id="compu2-semana9-authorities-vs-roles-quiz">
  <Question title="In Spring Security, what is the conceptual difference between an Authority and a Role?">
    <Option>A Role is a cryptographic secret key, whereas an Authority represents an HTTP session.</Option>
    <Option correct>An Authority represents a fine-grained atomic action (e.g., WRITE), whereas a Role is a high-level profile group that by convention carries the ROLE_ prefix (e.g., ROLE_ADMIN).</Option>
    <Option>Authorities only apply to REST controllers, while Roles strictly govern Thymeleaf views.</Option>
    <Option>Authorities are required for login authentication, while Roles are optional in the SecurityContext.</Option>
  </Question>
  <Question title="If you configure an access rule with hasRole('MANAGER'), which authority string will Spring Security check for internally?">
    <Option>MANAGER</Option>
    <Option>AUTH_MANAGER</Option>
    <Option correct>ROLE_MANAGER</Option>
    <Option>PERMISSION_MANAGER</Option>
  </Question>
  <Question title="What is the architectural advantage of designing a relational database schema where Roles group Authorities?">
    <Option>It decreases the computational work factor cost in BCrypt hashing rounds.</Option>
    <Option>It allows HTTP requests to bypass the SecurityFilterChain entirely.</Option>
    <Option>It eliminates the requirement to implement the UserDetailsService interface.</Option>
    <Option correct>It allows privileges to be reconfigured and assigned dynamically in relational tables without modifying or recompiling Java application code.</Option>
  </Question>
</Quiz>

