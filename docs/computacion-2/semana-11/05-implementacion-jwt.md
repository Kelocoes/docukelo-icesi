---
sidebar_position: 5
sidebar_label: "Implementación de JWT"
---

# Implementación de JWT

Esta guía práctica detalla la implementación paso a paso de la seguridad basada en **JSON Web Tokens (JWT)** en un proyecto de **Spring Boot 3 / Spring Security 6**.

Nos enfocaremos en la arquitectura de código, la configuración de la cadena de filtros sin estado (*stateless*), el servicio de utilidades criptográficas y el controlador de autenticación.

---

## 1. Arquitectura de Implementación y Mapa de Clases

Antes de codificar, observa el mapa de clases, las inyecciones de dependencias y las responsabilidades de cada componente en nuestro backend:

<div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
  <img
    src="/img/computacion-2/spring-jwt-implementation-architecture.svg"
    alt="Mapa de Clases y Arquitectura de Implementación JWT en Spring Boot"
    style={{ width: "100%", maxWidth: "980px" }}
  />
</div>

### Desglose de Responsabilidades Técnicas

| Clase / Componente | Paquete | Responsabilidad en el Sistema |
| :--- | :--- | :--- |
| **`WebSecurityConfig`** | `com.ejemplo.demo.config` | Define el `SecurityFilterChain` para rutas `/api/**`. Deshabilita CSRF, configura la política de sesión como `STATELESS` y posiciona el filtro JWT antes de `UsernamePasswordAuthenticationFilter`. |
| **`JwtAuthenticationFilter`** | `com.ejemplo.demo.config` | Intercepta cada solicitud HTTP entrante (`OncePerRequestFilter`), extrae el token del encabezado `Authorization: Bearer <token>`, valida su firma con `IJwtService` y registra la identidad en `SecurityContextHolder`. |
| **`IJwtService` / `JwtServiceImpl`** | `com.ejemplo.demo.service` | Encapsula la librería JJWT (`io.jsonwebtoken`). Genera tokens firmados, decodifica claims, extrae autoridades y valida la expiración contra la clave secreta inyectada. |
| **`AuthController`** | `com.ejemplo.demo.controller` | Expone el endpoint público `POST /api/public/auth/login`, recibe credenciales en `LoginRequestDTO` y retorna el `TokenResponseDTO`. |
| **`AuthServiceImpl`** | `com.ejemplo.demo.service` | Carga el usuario mediante `UserDetailsService`, valida la contraseña con `PasswordEncoder.matches()`, y si es correcta, solicita a `JwtService` emitir el token. |

---

## 2. Guía de Construcción Paso a Paso

<StepByStep>
  <Step number="1" title="Instalar Dependencias de JJWT en Maven">
    Para manipular tokens JWT en Java de forma moderna utilizaremos la librería oficial **JJWT (Java JSON Web Token)** en su versión 0.12+. Agrega los siguientes módulos dentro de tu archivo `pom.xml`:

```xml title="pom.xml" showLineNumbers
<!-- API pública de JJWT (interfaces y contratos) -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>

<!-- Implementación concreta del motor criptográfico JJWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>

<!-- Soporte para serialización y deserialización de JSON con Jackson -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
```

Descarga y actualiza las librerías en tu proyecto ejecutando:

```bash title="Terminal"
mvn clean install
```
  </Step>

  <Step number="2" title="Configurar Propiedades y Clave Secreta">
    El algoritmo `HS256` exige una clave secreta simétrica con una longitud mínima de 256 bits (32 caracteres alfanuméricos seguros). Define la clave y el tiempo de caducidad en tu archivo de configuración de propiedades:

```properties title="src/main/resources/application.properties" showLineNumbers
# Clave secreta simétrica para firmar y verificar tokens (mínimo 256 bits)
app.security.jwt.secret-key=dGhpc0lzQVZlcnlTZWN1cmVTZWNyZXRLZXlGb3JKV1RBdXRoZW50aWNhdGlvbkluU3ByaW5nQm9vdDIwMjU=

# Tiempo de expiración del accessToken en milisegundos (86400000 ms = 24 horas)
app.security.jwt.expiration-time=86400000
```

:::tip[Buenas Prácticas en Producción]
En entornos reales de producción, nunca guardes la clave secreta directamente en texto plano dentro del repositorio Git. Inyéctala como una variable de entorno del sistema operativo (por ejemplo: `APP_SECURITY_JWT_SECRET_KEY=${JWT_SECRET}`).
:::
  </Step>

  <Step number="3" title="Implementar el Servicio Criptográfico IJwtService">
    Crea el contrato del servicio de utilidades JWT y su implementación correspondiente para firmar, parsear y extraer afirmaciones (*claims*).

Primero, declara la interfaz:

```java title="src/main/java/com/ejemplo/demo/service/IJwtService.java" showLineNumbers
package com.ejemplo.demo.service;

import io.jsonwebtoken.Claims;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.ejemplo.demo.model.User;

import java.util.List;
import java.util.function.Function;

public interface IJwtService {
    // Genera un token firmado a partir de la identidad y autoridades del usuario
    String generateToken(User user, Authentication authentication);

    // Extrae el subject (username) del token
    String extractUsername(String token);

    // Extrae los roles y permisos almacenados en el payload
    List<SimpleGrantedAuthority> extractAuthorities(String token);

    // Extrae un claim genérico utilizando una función resolutora
    <T> T extractClaim(String token, Function<Claims, T> claimsResolver);

    // Reconstruye el UserDetails para inyectar en el contexto de seguridad
    UserDetails getUserDetailsFromToken(String token);

    // Comprueba si el token ya superó su fecha límite de validez
    boolean isTokenExpired(String token);

    // Valida criptográficamente la integridad y expiración del token
    boolean isTokenValid(String token);
}
```

Ahora, implementa el servicio utilizando la API fluida de JJWT:

```java title="src/main/java/com/ejemplo/demo/service/JwtServiceImpl.java" showLineNumbers
package com.ejemplo.demo.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import com.ejemplo.demo.model.User;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtServiceImpl implements IJwtService {

    // Inyección de la clave secreta desde application.properties
    @Value("${app.security.jwt.secret-key}")
    private String secretKey;

    // Inyección de la expiración en milisegundos
    @Value("${app.security.jwt.expiration-time}")
    private long expirationTime;

    /**
     * Decodifica la clave en formato Base64 y genera la SecretKey de HMAC
     */
    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    public String generateToken(User user, Authentication auth) {
        // Extrae las autoridades asignadas al usuario
        List<String> authorities = (auth != null && auth.getAuthorities() != null)
                ? auth.getAuthorities().stream().map(a -> a.getAuthority()).toList()
                : List.of();

        return Jwts.builder()
                .id(user.getId().toString()) // Identificador único del JWT
                .claims(Map.of(
                        "username", user.getUsername(),
                        "email", user.getEmail(),
                        "authorities", authorities // Roles y permisos dentro del Payload
                ))
                .subject(user.getUsername()) // Claim estándar 'sub'
                .issuedAt(new Date(System.currentTimeMillis())) // Fecha de emisión
                .expiration(new Date(System.currentTimeMillis() + expirationTime)) // Fecha de expiración
                .signWith(getSignInKey()) // Firma digital con algoritmo HMAC-SHA256
                .compact(); // Serializa a formato Header.Payload.Signature
    }

    @Override
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = Jwts.parser()
                .verifyWith(getSignInKey()) // Valida la firma antes de leer los claims
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claimsResolver.apply(claims);
    }

    @Override
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    @Override
    public boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<SimpleGrantedAuthority> extractAuthorities(String token) {
        Claims claims = extractClaim(token, Function.identity());
        List<String> authorities = claims.get("authorities", List.class);
        if (authorities == null) {
            return List.of();
        }
        return authorities.stream()
                .map(SimpleGrantedAuthority::new)
                .toList();
    }

    @Override
    public UserDetails getUserDetailsFromToken(String token) {
        String username = extractUsername(token);
        List<SimpleGrantedAuthority> authorities = extractAuthorities(token);
        // Construye un UserDetails en memoria sin consultar la base de datos
        return new org.springframework.security.core.userdetails.User(username, "", authorities);
    }

    @Override
    public boolean isTokenValid(String token) {
        try {
            // Si la firma es alterada o la estructura es inválida, parseSignedClaims lanza excepción
            Jwts.parser()
                    .verifyWith(getSignInKey())
                    .build()
                    .parseSignedClaims(token);

            return !isTokenExpired(token);
        } catch (Exception e) {
            // El token fue modificado, expiró o no cuenta con una firma válida
            return false;
        }
    }
}
```
  </Step>

  <Step number="4" title="Crear el Filtro Interceptor JwtAuthenticationFilter">
    El filtro extiende de `OncePerRequestFilter` para garantizar que se ejecute exactamente una sola vez por cada petición HTTP despachada por el contenedor:

```java title="src/main/java/com/ejemplo/demo/config/JwtAuthenticationFilter.java" showLineNumbers
package com.ejemplo.demo.config;

import com.ejemplo.demo.service.IJwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private IJwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // 1. Obtener la cabecera HTTP 'Authorization'
        String authHeader = request.getHeader("Authorization");
        String token = null;
        UserDetails userDetails = null;

        // 2. Verificar que la cabecera exista y comience con el prefijo estándar 'Bearer '
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7); // Extraer los caracteres posteriores al prefijo

            // 3. Validar la firma y la vigencia del token
            if (jwtService.isTokenValid(token)) {
                // 4. Reconstruir los detalles del usuario a partir del Payload
                userDetails = jwtService.getUserDetailsFromToken(token);

                // 5. Crear el objeto de autenticación de Spring Security
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                // Adjuntar metadatos de la solicitud (IP, sesión web)
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 6. Almacenar el usuario autenticado en el contexto del hilo actual
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // 7. Continuar con el siguiente filtro en la cadena de Spring Security
        filterChain.doFilter(request, response);
    }
}
```
  </Step>

  <Step number="5" title="Configurar la Cadena de Seguridad en WebSecurityConfig">
    Configura el `SecurityFilterChain` dedicado para la API REST (`/api/**`). Asegúrate de desactivar CSRF (innecesario en APIs sin cookies de sesión) y configurar la política de sesiones como `STATELESS`:

```java title="src/main/java/com/ejemplo/demo/config/WebSecurityConfig.java" showLineNumbers
package com.ejemplo.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    /**
     * Cadena de seguridad exclusiva para la API REST (/api/**)
     */
    @Bean
    @Order(1)
    public SecurityFilterChain securityRestFilterChain(HttpSecurity http) throws Exception {
        return http
                // Aplica únicamente a solicitudes que coincidan con /api/**
                .securityMatcher("/api/**")

                // Deshabilita CSRF: la API es stateless y no utiliza cookies de sesión vulnerables
                .csrf(csrf -> csrf.disable())

                // Habilita y configura CORS para permitir peticiones desde clientes SPA
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Reglas de autorización por endpoint
                .authorizeHttpRequests(authz -> authz
                        // Endpoint público para login y registro
                        .requestMatchers("/api/public/**").permitAll()
                        // Cualquier otra ruta bajo /api/** requiere token válido
                        .anyRequest().authenticated()
                )

                // Posiciona nuestro filtro JWT ANTES del filtro de login por formulario
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)

                // Política de sesión STATELESS: Spring no creará ni utilizará HttpSession
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .build();
    }

    /**
     * Configuración de CORS permitiendo acceso desde aplicaciones frontend
     */
    private CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.addAllowedOriginPattern("*");
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```
  </Step>

  <Step number="6" title="Crear los DTOs y el Endpoint de Autenticación (Login)">
    Implementa los objetos de transferencia de datos (DTOs), el servicio de autenticación y el controlador REST que procesa las credenciales:

Primero, los DTOs:

```java title="src/main/java/com/ejemplo/demo/dto/LoginRequestDTO.java" showLineNumbers
package com.ejemplo.demo.dto;

public class LoginRequestDTO {
    private String username;
    private String password;

    public LoginRequestDTO() {}

    public LoginRequestDTO(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
```

```java title="src/main/java/com/ejemplo/demo/dto/TokenResponseDTO.java" showLineNumbers
package com.ejemplo.demo.dto;

public class TokenResponseDTO {
    private String accessToken;

    public TokenResponseDTO() {}

    public TokenResponseDTO(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
}
```

Luego, el servicio de autenticación:

```java title="src/main/java/com/ejemplo/demo/service/AuthServiceImpl.java" showLineNumbers
package com.ejemplo.demo.service;

import com.ejemplo.demo.dto.LoginRequestDTO;
import com.ejemplo.demo.dto.TokenResponseDTO;
import com.ejemplo.demo.model.CustomUserDetails;
import com.ejemplo.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements IAuthService {

    @Autowired
    private IJwtService jwtService;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public TokenResponseDTO login(LoginRequestDTO request) {
        // 1. Cargar el usuario desde la persistencia
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        if (userDetails == null) {
            throw new RuntimeException("Credenciales inválidas: usuario no encontrado");
        }

        // 2. Verificar que la contraseña coincida con el hash de la base de datos
        if (!passwordEncoder.matches(request.getPassword(), userDetails.getPassword())) {
            throw new RuntimeException("Credenciales inválidas: contraseña incorrecta");
        }

        // 3. Obtener la entidad de dominio y construir la autenticación
        CustomUserDetails customUD = (CustomUserDetails) userDetails;
        User user = customUD.getUser();
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());

        // 4. Emitir el token firmado con JJWT
        String token = jwtService.generateToken(user, auth);
        return new TokenResponseDTO(token);
    }
}
```

Por último, el controlador REST para exponer el endpoint de inicio de sesión:

```java title="src/main/java/com/ejemplo/demo/controller/AuthController.java" showLineNumbers
package com.ejemplo.demo.controller;

import com.ejemplo.demo.dto.LoginRequestDTO;
import com.ejemplo.demo.dto.TokenResponseDTO;
import com.ejemplo.demo.service.IAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/auth")
public class AuthController {

    @Autowired
    private IAuthService authService;

    /**
     * Endpoint público para iniciar sesión y obtener el accessToken
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {
        try {
            TokenResponseDTO token = authService.login(request);
            return ResponseEntity.ok(token);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
```
  </Step>

  <Step number="7" title="Verificación y Pruebas con Cliente HTTP">
    Prueba el ciclo completo utilizando herramientas como Postman, cURL o Thunder Client:

1. **Paso A: Obtener el Token (Login)**
   ```http title="Petición de Login"
   POST http://localhost:8080/api/public/auth/login
   Content-Type: application/json

   {
     "username": "juan",
     "password": "Password123*"
   }
   ```
   *Respuesta esperada (HTTP 200 OK):*
   ```json
   {
     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
   }
   ```

2. **Paso B: Consumir un Recurso Protegido**
   ```http title="Petición Protegida"
   GET http://localhost:8080/api/usuarios
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
   ```
   *Respuesta esperada (HTTP 200 OK).* Si omites la cabecera `Authorization` o envías un token expirado, Spring Security responderá con HTTP `401 Unauthorized`.
  </Step>
</StepByStep>

---

## 3. Repositorio de Ejemplo

Si deseas revisar el proyecto base de referencia con la estructura completa de paquetes, puedes clonar el repositorio oficial del curso en GitHub:

* [Repositorio base en GitHub (Rama springboot-rest)](https://github.com/Kelocoes/compunet2-202502/tree/springboot-rest)
