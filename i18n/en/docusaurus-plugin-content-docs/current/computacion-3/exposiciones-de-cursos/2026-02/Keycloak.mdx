---
sidebar_position: 1
---

# Keycloak: Centralized Identity and Access Management

Complete guide and resources from the **Keycloak** course presentation (IAM, SSO, OAuth2, and OIDC) in modern web applications.

### Team Members
- Wilder García
- Felipe Rivas
- Catalina Bernal

---

## Slides and Resources

<PdfViewer src="/files/computacion-3/exposiciones-de-cursos/2026-02/Keycloak.pdf" />

:::info[Project Links and Presentation]
- **Presentation (PDF):** [Download Keycloak.pdf](/files/computacion-3/exposiciones-de-cursos/2026-02/Keycloak.pdf)
- **Official Documentation:** [Keycloak Documentation](https://www.keycloak.org/documentation)
:::

---

## 1. Problem Overview and Foundations

In distributed systems and modern web applications, implementing standalone user management within every microservice introduces security liabilities, state synchronization bottlenecks, and maintenance overhead:

- Secure cryptographic password hashing and salting.
- Token lifecycle, session renewal, and automatic revocation.
- Single Sign-On (SSO) and federated Social Logins (Google, GitHub, Microsoft).
- Role-Based Access Control (RBAC) and granular permission authorization.

**Keycloak** is an open-source **Identity and Access Management (IAM)** solution backed by Red Hat. It operates as a centralized authentication and authorization server, decoupling security concerns from application business logic.

### Core Distinction: Authentication vs. Authorization

- **Authentication (AuthN):** Verifies **who** the user is (credentials, MFA, biometrics).
- **Authorization (AuthZ):** Dictates **what actions** the authenticated entity is permitted to perform (roles, scopes, route-level policies).

---

## 2. Solution Architecture

```
+----------------+          1. Login Request          +-------------------+
|                | ---------------------------------> |                   |
| Frontend React |                                    | Keycloak Server   |
| (Client SPA)   | <--------------------------------- | (OIDC / OAuth 2)  |
+----------------+          2. Access Token (JWT)     +-------------------+
        |
        | 3. API Request + Bearer Token
        v
+------------------------+
| Backend Protected API  | ---> 4. Verifies JWT signature and roles
+------------------------+
```

1. The user interacts with the React client. When hitting protected routes, the application redirects to Keycloak's centralized login screen.
2. Upon validating credentials, Keycloak issues an **Access Token** as a JSON Web Token (JWT) bearing the user's claims and assigned roles.
3. The frontend passes this token via the `Authorization: Bearer <token>` header with every API call.
4. The backend cryptographically validates the token and enforces access rules (e.g., `/api/admin` strictly requires the `ADMIN` role).

---

## 3. Practical Walkthrough: Step by Step

<StepByStep>
  <Step number="1" title="Spin up Keycloak with Docker">
    Start a Keycloak container in development mode exposing port 8080:

    ```bash
    docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
    ```
  </Step>

  <Step number="2" title="Configure Realm and Client in Admin Console">
    1. Navigate to `http://localhost:8080` and log in with `admin` / `admin`.
    2. Create a new Realm (e.g., `demo-realm`).
    3. Register a new Client named `demo-client`:
       - Client type: OpenID Connect.
       - Client Authentication: Off (for public client SPAs).
       - Valid Redirect URIs: `http://localhost:5173/*`.
       - Web Origins: `http://localhost:5173`.
  </Step>

  <Step number="3" title="Create Roles and Users">
    1. Under **Realm Roles**, declare roles `USER` and `ADMIN`.
    2. Under **Users**, create test users: `estudiante` and `profesor`.
    3. Assign password credentials and grant the `ADMIN` role to user `profesor`.
  </Step>

  <Step number="4" title="Integrate React Frontend and Test Flow">
    Launch the frontend client wired with `keycloak-js`:

    ```bash
    cd frontend
    npm install
    npm run dev
    ```

    Verify access behavior:
    - Log in with `estudiante`: Access granted to standard public and student views.
    - Attempt navigating to administrative panel: Access rejected (lacks `ADMIN` role).
    - Log in with `profesor`: Access granted to the administrative dashboard.
  </Step>
</StepByStep>
