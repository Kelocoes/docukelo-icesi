---
sidebar_position: 4
sidebar_label: "Fundamentos y Arquitectura de JWT"
description: "Comprende qué es un JSON Web Token, cómo se estructura y cómo fluyen su emisión y validación en una API REST."
---

# Fundamentos y Arquitectura de JWT

Para construir APIs REST seguras y de alto rendimiento en Spring Boot, es fundamental comprender el estándar **JSON Web Token (JWT)**, su diseño criptográfico y cómo se acopla dentro del ciclo de vida de **Spring Security**.

En esta guía abordaremos los fundamentos teóricos, la anatomía interna de un token, los flujos arquitectónicos de emisión y validación, y las respuestas a las preguntas de seguridad más críticas que surgen en aplicaciones reales.

---

## 1. ¿Qué es JWT y por qué se utiliza en APIs REST?

Un **JSON Web Token (JWT)** es un estándar abierto definido en el [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519) que establece una forma compacta y autónoma (*self-contained*) para transmitir información estructurada entre dos partes como un objeto JSON.

### Características Principales

1. **Compacto:** Por su formato de texto delimitado por puntos, un JWT puede enviarse fácilmente a través de cabeceras HTTP (`Authorization: Bearer <token>`), parámetros de URL o cuerpos de peticiones POST.
2. **Autónomo (*Self-Contained*):** El token transporta dentro de sí mismo toda la información necesaria sobre el usuario (identificador, roles, fecha de emisión y expiración). El servidor no necesita consultar la memoria RAM ni una tabla de sesiones para saber quién es el cliente.
3. **Verificable Criptográficamente:** Aunque cualquiera puede leer su contenido, el token cuenta con una firma digital generada con una clave secreta que solo el servidor conoce. Esto garantiza que la información no ha sido alterada en el camino.

---

## 2. Anatomía Criptográfica de un Token JWT

Un token JWT está compuesto por tres secciones independientes codificadas en **Base64Url** y concatenadas por un punto (`.`):

$$\text{JWT} = \text{Header} \,.\, \text{Payload} \,.\, \text{Signature}$$

<div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
  <img
    src="/img/computacion-2/jwt-structure-anatomy.svg"
    alt="Anatomía Criptográfica de un JSON Web Token"
    style={{ width: "100%", maxWidth: "980px" }}
  />
</div>

### Desglose de los Componentes

#### A. Header (Encabezado)
Define los metadatos del token: el algoritmo criptográfico utilizado (`alg`) y el tipo de credencial (`typ`):
```json title="Header Decodificado"
{
  "alg": "HS256",
  "typ": "JWT"
}
```
* `alg: "HS256"`: Indica que la firma utiliza el algoritmo simétrico HMAC con la función hash SHA-256.
* `typ: "JWT"`: Identifica que el objeto procesado corresponde al estándar JSON Web Token.

#### B. Payload (Carga Útil o Claims)
Contiene las afirmaciones (*claims*) sobre la identidad del usuario y los metadatos de vigencia de la credencial:
```json title="Payload Decodificado"
{
  "sub": "user123",
  "email": "juan@example.com",
  "roles": ["ROLE_USER"],
  "iat": 1773517905,
  "exp": 1773604305
}
```
* **Claims Registrados (RFC 7519):** Metadatos estandarizados de control:
  * `sub` (*Subject*): Identificador único del usuario (por ejemplo, el username o ID).
  * `iat` (*Issued At*): Timestamp en segundos en el momento en que se generó el token.
  * `exp` (*Expiration Time*): Timestamp exacto a partir del cual el token pierde validez.
* **Claims Personalizados (Custom Claims):** Datos propios del negocio que facilitan la toma de decisiones sin consultar la base de datos (por ejemplo, `email`, `roles`, o `tenantId`).

:::caution[Los tokens JWT NO están cifrados]
El Header y el Payload están simplemente codificados en **Base64Url**, no cifrados. Cualquier interceptor, extensión de navegador o proxy intermedio puede decodificar la cadena y leer los datos en texto plano. **Nunca almacenes contraseñas, hashes, claves privadas ni datos confidenciales en el Payload.**
:::

#### C. Signature (Firma Digital)
Garantiza la **autenticidad** y la **integridad** del token. Se calcula aplicando el algoritmo especificado en el Header a la concatenación del Header y el Payload codificados, utilizando una clave secreta que reside únicamente en el servidor (`SECRET_KEY`):

```text title="Cálculo Matemático de la Firma"
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  SECRET_KEY
)
```

Si un atacante modifica un solo carácter del Payload (por ejemplo, cambia `"ROLE_USER"` por `"ROLE_ADMIN"`), la firma matemática dejará de coincidir con el resultado calculado por el servidor, y la solicitud será rechazada de inmediato.

---

## 3. Flujo 1: Obtención del Token (Inicio de Sesión)

Para que un cliente obtenga un token JWT, debe interactuar con un endpoint público de autenticación enviando sus credenciales:

<ZoomableMermaid value={`sequenceDiagram
    autonumber
    actor Cliente as Cliente HTTP (Frontend / Postman)
    participant FilterChain as SecurityFilterChain
    participant Controller as AuthController
    participant Service as AuthService
    participant UserDetailsSvc as UserDetailsService
    participant DB as Base de Datos (JPA)
    participant Encoder as PasswordEncoder (BCrypt)
    participant JwtSvc as JwtService

    Cliente->>FilterChain: 1. POST /api/public/auth/login (username, password)
    Note over FilterChain: Ruta pública permitAll() -> no requiere token previo
    FilterChain->>Controller: 2. Pasa la petición al controlador
    Controller->>Service: 3. login(LoginRequestDTO)
    Service->>UserDetailsSvc: 4. loadUserByUsername(username)
    UserDetailsSvc->>DB: 5. Consulta usuario y roles
    DB-->>UserDetailsSvc: 6. Retorna entidad de base de datos
    UserDetailsSvc-->>Service: 7. Retorna UserDetails (hash + authorities)
    Service->>Encoder: 8. matches(rawPassword, storedHash)
    Encoder-->>Service: 9. Contraseña válida (true)
    Service->>JwtSvc: 10. generateToken(user, authentication)
    Note over JwtSvc: Construye Header + Payload y firma con SECRET_KEY
    JwtSvc-->>Service: 11. Retorna String accessToken
    Service-->>Controller: 12. Retorna TokenResponseDTO(accessToken)
    Controller-->>Cliente: 13. HTTP 200 OK con { "accessToken": "eyJhbGci..." }
`} />

### Componentes que Interactúan en la Emisión

| Componente | Rol en el Flujo |
| :--- | :--- |
| **`SecurityFilterChain`** | Permite el paso sin autenticación porque la ruta `/api/public/**` está configurada con `permitAll()`. |
| **`AuthController`** | Expone el endpoint HTTP REST y mapea el cuerpo JSON a un `LoginRequestDTO`. |
| **`AuthService`** | Orquesta la verificación: consulta el usuario, delega la validación de la contraseña a `PasswordEncoder` y solicita la creación del token. |
| **`PasswordEncoder`** | Compara de forma segura la contraseña en texto plano enviada por el usuario con el hash BCrypt guardado en la base de datos. |
| **`JwtService`** | Utiliza la librería criptográfica (JJWT) para ensamblar los claims, fijar la fecha de caducidad y firmar el token con la clave secreta. |

---

## 4. Flujo 2: Consumo de Endpoints Protegidos (Autorización con JWT)

Una vez que el cliente tiene el token, lo adjunta en el encabezado `Authorization` de todas sus solicitudes posteriores utilizando el esquema `Bearer`:

```http title="Encabezado HTTP en Petición Protegida"
GET /api/usuarios/10 HTTP/1.1
Host: localhost:8080
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

<ZoomableMermaid value={`sequenceDiagram
    autonumber
    actor Cliente as Cliente HTTP
    participant Chain as SecurityFilterChain
    participant JwtFilter as JwtAuthenticationFilter (OncePerRequestFilter)
    participant JwtSvc as JwtService
    participant SecCtx as SecurityContextHolder
    participant AuthFilter as UsernamePasswordAuthenticationFilter
    participant Dispatcher as DispatcherServlet (@RestController)

    Cliente->>Chain: 1. GET /api/usuarios/10 con header Authorization Bearer token
    Chain->>JwtFilter: 2. Intercepta la petición (addFilterBefore)
    JwtFilter->>JwtFilter: 3. ¿Existe cabecera y comienza con "Bearer "?
    JwtFilter->>JwtSvc: 4. isTokenValid(token)
    Note over JwtSvc: Verifica firma con SECRET_KEY y revisa exp > now
    JwtSvc-->>JwtFilter: 5. Token válido (true)
    JwtFilter->>JwtSvc: 6. getUserDetailsFromToken(token)
    JwtSvc-->>JwtFilter: 7. Retorna Principal + GrantedAuthorities
    JwtFilter->>SecCtx: 8. setAuthentication(UsernamePasswordAuthenticationToken)
    Note over SecCtx: El usuario queda autenticado en el hilo actual (ThreadLocal)
    JwtFilter->>AuthFilter: 9. filterChain.doFilter(request, response)
    Note over AuthFilter: Usuario ya autenticado -> no requiere login
    AuthFilter->>Dispatcher: 10. Permite acceso al método @GetMapping
    Dispatcher-->>Cliente: 11. HTTP 200 OK con los datos solicitados
`} />

---

## 5. Decisiones Arquitectónicas en Spring Security

### ¿Por qué `JwtAuthenticationFilter` va ANTES de `UsernamePasswordAuthenticationFilter`?

En la configuración de Spring Security se utiliza la siguiente instrucción:

```java title="Ejemplo en Java"
.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
```

**Motivo Técnico:**
* `UsernamePasswordAuthenticationFilter` es el filtro predeterminado de Spring Security diseñado para autenticación basada en formularios (`POST /login` con parámetros form-urlencoded o sesiones HTTP).
* Si una petición HTTP llega a una API REST protegida (`/api/**`), queremos que nuestro filtro especializado en JWT capture el encabezado `Authorization: Bearer <token>`, valide la firma criptográfica y pueble el `SecurityContextHolder` **antes** de que cualquier otro filtro de la cadena intente redirigir al usuario a un formulario de login o determine que la petición no está autenticada.
* Al ejecutarse antes, cuando la petición continúa hacia los filtros de autorización posteriores (`AuthorizationFilter`), Spring Security ya encuentra la identidad del usuario y sus roles listos en el contexto de seguridad.

### ¿Es obligatorio crear un `AuthenticationProvider` o basta con un filtro?

En la literatura de Spring Security existen dos enfoques principales para soportar JWT:

1. **Enfoque con Filtro Directo (`OncePerRequestFilter`):**
   * El filtro extrae el token, `JwtService` valida la firma y los claims, y el filtro construye directamente un objeto `UsernamePasswordAuthenticationToken` que guarda en `SecurityContextHolder`.
   * **Ventaja:** Arquitectura limpia, menor cantidad de clases, alta velocidad de procesamiento y desacoplamiento total. Es el enfoque estándar recomendado para microservicios y APIs REST modernas.
2. **Enfoque con `AuthenticationProvider` personalizado:**
   * El filtro crea un token no autenticado, lo envía a `AuthenticationManager.authenticate()`, y este delega en una clase que implementa `AuthenticationProvider`.
   * **Cuándo se usa:** Solo cuando la aplicación necesita soportar múltiples proveedores de autenticación heterogéneos dentro de un mismo gestor central (por ejemplo, combinar LDAP, autenticación biométrica y JWT en la misma cadena). Para el 95% de los proyectos REST, el filtro directo es suficiente y más mantenible.

---

## 6. Escenarios Críticos de Seguridad

### ¿Qué ocurre si un token JWT es robado?
Debido a la naturaleza **stateless** de JWT, el servidor no mantiene un registro de tokens emitidos en su memoria. Por lo tanto, si un atacante obtiene una copia del token (mediante un ataque Man-in-the-Middle o inyección de scripts XSS), podrá enviar peticiones y el servidor las aceptará como legítimas mientras el token no haya expirado.

**Estrategias de Mitigación en Producción:**
1. **Obligatoriedad de HTTPS (TLS):** Cifra el canal de comunicación completo, impidiendo que terceros capturen las cabeceras HTTP en tránsito.
2. **Tiempos de Expiración Cortos:** Configurar el `accessToken` con una vida útil breve (por ejemplo, de 15 a 60 minutos) para reducir la ventana de oportunidad del atacante.
3. **Uso de Refresh Tokens:** Mantener el token de acceso con vida corta y utilizar un `refreshToken` de larga duración almacenado en base de datos que pueda ser revocado manualmente por el administrador en caso de compromiso.
4. **Almacenamiento Seguro en el Cliente:** En aplicaciones web, preferir almacenar los tokens en cookies con las banderas `HttpOnly; Secure; SameSite=Strict`, lo cual bloquea el acceso al token desde JavaScript y previene ataques XSS.

### ¿Qué ocurre si un atacante modifica el token?
Si un usuario con rol estándar intenta modificar el payload de su token para otorgarse permisos de administrador (`"roles": ["ROLE_ADMIN"]`):
1. El atacante altera el JSON y lo vuelve a codificar en Base64Url.
2. Al enviar la petición al servidor, el método `isTokenValid(token)` de `JwtService` utiliza la `SECRET_KEY` original del backend para calcular la firma matemática sobre el Header y el Payload recibidos.
3. Dado que la firma matemática depende estrictamente de cada bit del contenido, la firma recalculada no coincidirá con la firma que acompaña al token.
4. JJWT lanzará una excepción (`SignatureException`) y la petición será abortada automáticamente con un código HTTP `401 Unauthorized`. **Es matemáticamente imposible alterar los claims sin invalidar la firma a menos que se conozca la clave secreta.**

### ¿Qué ocurre cuando cambiamos los permisos de un usuario en la Base de Datos?
Este fenómeno se conoce como **Stale Claims** (afirmaciones desactualizadas).

* **Comportamiento por Defecto:** Si el administrador revoca un permiso en la base de datos a las 10:00 AM, pero el usuario posee un JWT emitido a las 09:55 AM con vigencia hasta las 10:55 AM, el servidor continuará aceptando los permisos antiguos durante los 55 minutos restantes, ya que la validación del token no consulta la base de datos.
* **Soluciones de Diseño:**
  * **Estrategia A (Expiración Rápida):** Reducir la expiración del `accessToken` a 10-15 minutos. El desfase temporal máximo será despreciable.
  * **Estrategia B (Consulta Ligera en Filtro):** Dentro de `JwtAuthenticationFilter`, en lugar de extraer los roles únicamente del Payload del token, invocar `userDetailsService.loadUserByUsername(username)` para leer las autoridades frescas desde la base de datos. Esto ofrece consistencia inmediata a cambio de realizar una consulta a base de datos en cada petición.
  * **Estrategia C (Lista de Revocación en Redis):** Almacenar en una caché en memoria ultra-rápida (Redis) la marca de tiempo en la que los roles de un usuario fueron modificados. Si el claim `iat` del token es anterior a dicha marca, el token se rechaza inmediatamente.

---

## Cuestionario de Autoevaluación

<Quiz id="compu2-semana11-fundamentos-jwt-quiz">
  <Question title="¿Por qué la firma (Signature) de un token JWT garantiza la integridad de los datos en una arquitectura sin estado?">
    <Option>Porque cifra el Payload en disco usando una clave simétrica de 512 bits.</Option>
    <Option correct>Porque cualquier modificación en los datos del Header o Payload produce una discrepancia matemática con la firma calculada con la clave secreta del servidor.</Option>
    <Option>Porque se conecta a la base de datos relacional para validar cada registro de sesión activo.</Option>
    <Option>Porque convierte los datos JSON en código binario ejecutable que no puede ser abierto por el navegador.</Option>
  </Question>

  <Question title="En la configuración de Spring Security para APIs REST, ¿cuál es el propósito de invocar .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)?">
    <Option>Habilitar el formulario de inicio de sesión de Thymeleaf para usuarios con rol administrador.</Option>
    <Option>Obligar al cliente a enviar la contraseña del usuario en cada petición HTTP.</Option>
    <Option correct>Interceptar el token Bearer y autenticar al usuario en el SecurityContext antes de que otros filtros intenten redirigir o bloquear la solicitud.</Option>
    <Option>Deshabilitar el soporte de HTTPS en el servidor Tomcat.</Option>
  </Question>

  <Question title="Si un administrador revoca un rol a un usuario en la base de datos, ¿qué sucede con un JWT previamente emitido que aún no ha expirado?">
    <Option>El token se elimina automáticamente de la memoria del navegador del usuario.</Option>
    <Option>La base de datos envía un evento TCP que destruye la firma criptográfica del token.</Option>
    <Option correct>El token sigue siendo válido con los roles antiguos hasta que expire, a menos que la aplicación implemente verificación activa en BD o una lista de revocación.</Option>
    <Option>El servidor retorna un error HTTP 500 Internal Server Error en la siguiente petición.</Option>
  </Question>

  <Question title="¿Cuál es la razón principal por la que NO se deben almacenar contraseñas ni claves privadas en el Payload de un JWT?">
    <Option>Porque la librería JJWT arroja una excepción si detecta campos con la palabra password.</Option>
    <Option>Porque los tokens aumentan su tamaño a más de 10 megabytes.</Option>
    <Option correct>Porque el Payload solo está codificado en Base64Url y no cifrado, permitiendo que cualquiera pueda leer su contenido en texto plano.</Option>
    <Option>Porque las bases de datos no permiten guardar cadenas codificadas en Base64Url.</Option>
  </Question>
</Quiz>
