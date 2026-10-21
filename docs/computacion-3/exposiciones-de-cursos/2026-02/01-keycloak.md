---
sidebar_position: 1
---

# Keycloak: Gestión Centralizada de Identidad y Acceso

Guía completa y material de la exposición sobre **Keycloak** (IAM, SSO, OAuth2 y OIDC) en aplicaciones web modernas.

### Integrantes
- Wilder García
- Felipe Rivas
- Catalina Bernal

---

## Diapositivas y Recursos

<PdfViewer src="/files/computacion-3/exposiciones-de-cursos/2026-02/Keycloak.pdf" />

:::info[Enlaces del Proyecto y Presentación]
- **Presentación (PDF):** [Descargar Keycloak.pdf](/files/computacion-3/exposiciones-de-cursos/2026-02/Keycloak.pdf)
- **Documentación Oficial:** [Keycloak Documentation](https://www.keycloak.org/documentation)
:::

---

## 1. Introducción al Problema y Fundamentos

Al desarrollar arquitecturas web modernas y sistemas distribuidos, administrar usuarios de forma manual en cada servicio introduce riesgos de seguridad, inconsistencias y sobrecostos de desarrollo:

- Almacenamiento seguro y cifrado de contraseñas (hashing, salting).
- Manejo de sesiones, tokens de acceso y expiración.
- Implementación de Single Sign-On (SSO) y Social Login (Google, GitHub).
- Control de acceso basado en roles (RBAC) y permisos granulares.

**Keycloak** es una solución de código abierto de **Gestión de Identidad y Acceso (IAM)** desarrollada y respaldada por Red Hat. Actúa como un servidor central de autenticación y autorización que desacopla la seguridad de la lógica de negocio de las aplicaciones.

### Diferencia clave entre Autenticación y Autorización

- **Autenticación (AuthN):** Valida **quién es** el usuario (credenciales, MFA, biometría).
- **Autorización (AuthZ):** Determina **qué puede hacer** ese usuario una vez identificado (roles, scopes, permisos sobre endpoints específicos).

---

## 2. Arquitectura de la Solución

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
| Backend Protected API  | ---> 4. Verifica firma y roles del JWT
+------------------------+
```

1. El usuario interactúa con la interfaz en React. Al requerir autenticación, se redirige al login unificado de Keycloak.
2. Tras validar credenciales, Keycloak emite un **Access Token** en formato JSON Web Token (JWT) con los claims y roles del usuario.
3. El frontend adjunta el token en el encabezado `Authorization: Bearer <token>` en cada petición a la API.
4. El backend valida criptográficamente el token y autoriza el acceso a los endpoints protegidos (por ejemplo, `/api/admin` exige el rol `ADMIN`).

---

## 3. Demostración Práctica: Paso a Paso

<StepByStep>
  <Step number="1" title="Levantar Keycloak con Docker">
    Ejecuta el contenedor de Keycloak en modo desarrollo exponiendo el puerto 8080:

    ```bash
    docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:latest start-dev
    ```
  </Step>

  <Step number="2" title="Configurar Realm y Cliente en la Consola">
    1. Accede a `http://localhost:8080` e inicia sesión con `admin` / `admin`.
    2. Crea un nuevo Realm (por ejemplo, `demo-realm`).
    3. Registra un nuevo Client `demo-client`:
       - Client type: OpenID Connect.
       - Client Authentication: Off (para SPA público).
       - Valid Redirect URIs: `http://localhost:5173/*`.
       - Web Origins: `http://localhost:5173`.
  </Step>

  <Step number="3" title="Crear Roles y Usuarios">
    1. En **Realm Roles**, crea los roles `USER` y `ADMIN`.
    2. En **Users**, crea dos usuarios: `estudiante` y `profesor`.
    3. Asigna credenciales de contraseña y asigna el rol `ADMIN` al usuario `profesor`.
  </Step>

  <Step number="4" title="Integrar el Frontend React y Probar">
    Inicia la aplicación frontend conectada mediante `keycloak-js`:

    ```bash
    cd frontend
    npm install
    npm run dev
    ```

    Prueba el flujo:
    - Iniciar sesión con `estudiante`: Acceso a rutas públicas y estándar.
    - Intentar acceder al panel administrativo: Acceso denegado (falta rol `ADMIN`).
    - Iniciar sesión con `profesor`: Acceso concedido al panel administrativo.
  </Step>
</StepByStep>
