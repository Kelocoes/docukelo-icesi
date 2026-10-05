---
sidebar_position: 1
sidebar_label: "Autenticación vs Autorización"
---

# Autenticación vs. Autorización

En las semanas anteriores de Computación en Red 2 exploramos la arquitectura interna de Spring Boot, el ciclo de vida de los Beans, la persistencia relacional con Spring Data JPA y la construcción de vistas dinámicas con Server-Side Rendering (SSR) mediante Thymeleaf.

Sin embargo, hasta este momento nuestras aplicaciones han sido completamente abiertas: cualquier usuario con acceso a la red puede invocar controladores, modificar registros o acceder a páginas administrativas. En sistemas empresariales, **la seguridad no es un accesorio tardío**, sino un requisito no funcional crítico que debe diseñarse desde el núcleo de la arquitectura (*Secure by Design*).

---

## 1. Seguridad a Nivel de Aplicación (Application-Level Security)

Cuando pensamos en seguridad informática, con frecuencia imaginamos mecanismos perimetrales de infraestructura: *firewalls*, proxies inversos, redes privadas virtuales (VPN) o políticas de subred en la nube. Si bien estos mecanismos son indispensables, **no conocen el contexto del negocio**.

Un firewall de red puede verificar que una petición provenga de una dirección IP permitida y que viaje por el puerto `443` cifrada con HTTPS, pero **no puede determinar** si la persona que envía la petición es un estudiante consultando sus notas o un intruso intentando eliminar las calificaciones de todo el curso.

:::info[Principio de Defensa en Profundidad (Defense in Depth)]
La **seguridad a nivel de aplicación** evalúa el contexto semántico de cada interacción: determina quién es el usuario que ejecuta la acción, valida la autenticidad de sus credenciales y verifica si cuenta con los permisos organizacionales necesarios para invocar un método o acceder a un recurso específico.
:::

---

## 2. El Núcleo del Control de Acceso

Cualquier sistema de control de acceso se fundamenta en responder de manera estricta y secuencial a dos preguntas distintas:

<div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
  <img
    src="/img/computacion-2/authn-vs-authz-conceptual.svg"
    alt="Autenticación vs Autorización"
    style={{ width: "100%", maxWidth: "920px" }}
  />
</div>

### A. Autenticación (Authentication) — *¿Quién eres?*
Es el proceso de **verificar la identidad declarada** por un usuario, sistema o servicio externo.
- **Entrada:** Un identificador (*username*, correo electrónico, identificador de cliente) acompañado de una prueba fehaciente (*credentials*, tales como contraseña, token JWT o certificado digital).
- **Proceso:** El sistema compara las credenciales suministradas contra un almacén confiable de identidades (base de datos relacional, servidor LDAP o proveedor OAuth2).
- **Resultado:** Si la prueba es válida, el sistema establece un **Principal** (un objeto que representa al usuario autenticado en la sesión o contexto actual). Si no coincide, rechaza la solicitud retornando un código de error **HTTP 401 Unauthorized**.

### B. Autorización (Authorization / Access Control) — *¿Qué puedes hacer?*
Es el proceso de **determinar si un usuario autenticado posee los privilegios suficientes** para realizar una operación o acceder a un recurso protegido.
- **Entrada:** La identidad verificada del usuario (*Principal*), sus permisos asignados (*Granted Authorities* / *Roles*) y el recurso o endpoint solicitado (ej. `DELETE /mvc/users/42`).
- **Proceso:** El motor de seguridad evalúa las reglas de acceso configuradas (ej. *"Solo usuarios con rol ADMIN pueden eliminar cuentas"*).
- **Resultado:** Si el usuario posee los permisos requeridos, la petición continúa hacia el controlador (`200 OK`). Si carece de privilegios, el sistema aborta la operación retornando un código de error **HTTP 403 Forbidden**.

---

## 3. Cuadro Comparativo: Autenticación vs. Autorización

| Criterio | Autenticación (Authentication) | Autorización (Authorization) |
| :--- | :--- | :--- |
| **Pregunta fundamental** | *¿Quién eres tú?* (*Who are you?*) | *¿Qué tienes permitido hacer?* (*What are you allowed to do?*) |
| **Paso en el flujo** | Primer paso obligado. Siempre antecede a la autorización. | Segundo paso. Solo ocurre sobre identidades ya autenticadas. |
| **Dato clave utilizado** | Credenciales (Username, Password, Tokens, OTP, Biometría). | Permisos individuales (*Authorities*) o perfiles de usuario (*Roles*). |
| **Código HTTP de fallo** | **HTTP 401 Unauthorized** (identidad ausente o inválida). | **HTTP 403 Forbidden** (identidad válida, pero permisos insuficientes). |
| **Abstracción en Spring** | `AuthenticationManager`, `AuthenticationProvider`, `PasswordEncoder`. | `SecurityFilterChain`, `AuthorizationFilter`, `@PreAuthorize`. |

---

## Cuestionario de Autoevaluación

<Quiz id="compu2-semana9-authn-vs-authz-quiz">
  <Question title="¿Cuál es la diferencia primordial entre Autenticación y Autorización?">
    <Option>La autenticación evalúa permisos sobre recursos, mientras que la autorización valida el usuario y contraseña.</Option>
    <Option correct>La autenticación verifica la identidad declarada (¿quién eres?), mientras que la autorización valida los privilegios para ejecutar una acción (¿qué puedes hacer?).</Option>
    <Option>La autenticación ocurre a nivel de firewall de red, mientras que la autorización ocurre en la base de datos.</Option>
    <Option>Ambos conceptos son sinónimos e intercambiables dentro del framework Spring Security.</Option>
  </Question>
  <Question title="Si un usuario envía credenciales erróneas o no envía credenciales al solicitar un recurso protegido, ¿qué código de estado HTTP debe responder el servidor?">
    <Option>HTTP 403 Forbidden</Option>
    <Option correct>HTTP 401 Unauthorized</Option>
    <Option>HTTP 404 Not Found</Option>
    <Option>HTTP 500 Internal Server Error</Option>
  </Question>
  <Question title="En el principio de Defensa en Profundidad (Defense in Depth), ¿por qué los firewalls de infraestructura no son suficientes para proteger la lógica de negocio?">
    <Option>Porque los firewalls no soportan conexiones mediante el protocolo HTTPS o TLS.</Option>
    <Option>Porque los firewalls de red únicamente operan en sistemas operativos Linux.</Option>
    <Option correct>Porque los firewalls validan puertos e IPs de origen, pero desconocen el contexto semántico de la aplicación y los permisos del usuario.</Option>
    <Option>Porque los firewalls solo pueden autenticar peticiones que utilicen cookies de sesión.</Option>
  </Question>
</Quiz>
