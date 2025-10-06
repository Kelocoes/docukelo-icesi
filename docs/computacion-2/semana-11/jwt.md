---
sidebar_position: 4
---


# Guía para de implementación de JWT en Spring Boot

En esta guía podrás encontrar diferentes pasos que te serán útiles en el proceso de implementación de JWT en tu proyecto de Spring Boot. Adicionalmente a esto, se formalizarán algunos aspectos que son necesarios para tener una seguridad adecuada dentro de nuestra aplicación.

## 1. ¿Qué es JWT?

JWT (JSON Web Token) es un estándar abierto (RFC 7519) que define un formato compacto y autónomo para transmitir información de forma segura entre las partes como un objeto JSON. Esta información puede ser verificada y confiable porque está firmada digitalmente. JWT se puede firmar utilizando un secreto (con el algoritmo HMAC) o un par de claves pública/privada utilizando RSA o ECDSA.

JWT se utiliza comúnmente para la autenticación y autorización en aplicaciones web y móviles. Permite a los servidores generar tokens que pueden ser enviados al cliente y luego utilizados para autenticar solicitudes posteriores. Esto elimina la necesidad de enviar credenciales de usuario en cada solicitud, lo que mejora la seguridad y la eficiencia.

## 2. ¿Por qué usar JWT?

- **Autenticación:** JWT es una forma de autenticar a los usuarios en una aplicación. Una vez que el usuario inicia sesión, el servidor genera un token JWT y lo envía al cliente. El cliente almacena este token y lo envía en cada solicitud posterior para acceder a recursos protegidos.
- **Autorización:** JWT también se utiliza para autorizar el acceso a recursos específicos. El token puede contener información sobre los permisos del usuario, lo que permite al servidor verificar si el usuario tiene acceso a un recurso determinado.
- **Interoperabilidad:** JWT es un estándar abierto y se puede utilizar en diferentes plataformas y lenguajes de programación. Esto facilita la integración entre diferentes sistemas y aplicaciones.
- **Compacto:** JWT es un formato compacto que se puede enviar a través de URL, encabezados HTTP o en el cuerpo de una solicitud. Esto lo hace ideal para aplicaciones móviles y web donde el tamaño del token es importante.
- **Autónomo:** JWT es autónomo, lo que significa que contiene toda la información necesaria para verificar su validez. Esto reduce la necesidad de realizar consultas a una base de datos para verificar la autenticidad del token.

## 3. Partes de un token JWT

Un token JWT consta de tres partes separadas por puntos (.):
- **Header (Encabezado):** El encabezado generalmente consta de dos partes: el tipo de token, que es JWT, y el algoritmo de firma que se utiliza, como HMAC SHA256 o RSA.
- **Payload (Carga útil):** La carga útil contiene las afirmaciones (claims) que son declaraciones sobre una entidad (generalmente, el usuario) y datos adicionales. Existen tres tipos de afirmaciones:
    - *Registered claims:* Son un conjunto de afirmaciones predefinidas que no son obligatorias pero recomendadas, como `iss` (emisor), `exp` (fecha de expiración), `sub` (sujeto), etc.
    - *Public claims:* Son afirmaciones definidas por los usuarios que pueden ser utilizadas por diferentes partes. Para evitar colisiones, deben ser definidas en el IANA JSON Web Token Registry o ser definidas como un URI.
    - *Private claims:* Son afirmaciones personalizadas creadas para compartir información entre partes que acuerdan usarlas.
- **Signature (Firma):** Para crear la firma, tomamos el encabezado codificado en Base64Url y la carga útil codificada en Base64Url, los unimos con un punto (.) y firmamos el resultado utilizando el algoritmo especificado en el encabezado y una clave secreta. La firma se utiliza para verificar que el remitente del JWT es quien dice ser y para garantizar que el mensaje no haya sido alterado.

## 4. Implementación de JWT en Spring Boot

Esta guía se enfocará en el proceso de generación y verificación de un `accessToken` usando JWT, por lo que aspectos de token de refresco no serán tratados en esta guía, sin embargo, su implementación no es complicada y puede ser realizada de forma similar a la implementación del `accessToken`.

Si deseas comenzar con el proyecto trabajado en este curso, puedes descargarlo por medio de este [enlace](https://github.com/Kelocoes/compunet2-202502/tree/springboot-rest).

### 4.1. Dependencias necesarias

Las siguientes dependencias son necesarias para la implementación de JWT en Spring Boot:

```xml
<dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.3</version>
</dependency>
<dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.6</version>
</dependency>
<dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.12.6</version>
</dependency>
```

Recuerda que si deseas instalar dichas dependencias en el contexto de Maven puedes hacerlo por medio de la siguiente línea de comandos:

```bash
mvn clean install
```

### 4.2. Adición de variables de entorno propias de JWT

Para la implementación de JWT es necesario contar con una clave secreta, la cual será utilizada para la firma del token. Adicionalmente, es recomendable contar con un tiempo de expiración para el token, el cual puede ser configurado en milisegundos. Para esto, se recomienda crear un archivo `application.properties` o `application.yml` en la carpeta `src/main/resources` y agregar las siguientes propiedades:

```properties
### JWT example
app.security.jwt.secret-key = mySecretKey
# 1 Day
app.security.jwt.expiration-time = 86400000
```

### 4.3 Modificación de la clase SecurityConfig

Vamos a agregar nuevas reglas de seguridad en la cadena de filtros de Spring Security, para esto, es necesario modificar la clase `SecurityConfig` que se encuentra en el paquete `config`. La clase debe quedar de la siguiente manera:

```java
@Configuration
@EnableMethodSecurity
public class WebSecurityConfig {

    @Bean
    public CustomAuthenticationFilter customAuthenticationFilter() {
        return new CustomAuthenticationFilter();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return new CustomUserDetailsService();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    @Order(1)
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .securityMatcher("/mvc/**")
            .addFilterBefore(customAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/mvc/public/**").permitAll()
                .requestMatchers("/mvc/auth/login", "/css/**", "/js/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/mvc/auth/login")           // URL personalizada para mostrar login
                .loginProcessingUrl("/mvc/auth/login")  // URL que procesa el login
                .defaultSuccessUrl("/mvc/users", true)  // Redirección después del login exitoso
                .failureUrl("/mvc/auth/login?error")    // Redirección en caso de error
                .usernameParameter("username") // Nombre del campo username
                .passwordParameter("password") // Nombre del campo password
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/mvc/auth/login?logout")
                .permitAll()
            )
            .build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain securityRestFilterChain(HttpSecurity http) throws Exception {
        return http
                .securityMatcher("/api/**")
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(authz -> authz
                                .requestMatchers("/api/public/**").permitAll()
                                .requestMatchers("/h2-console/**").permitAll()
                                .anyRequest().authenticated()
                )
                .headers(headers -> headers.frameOptions(frame -> frame.disable())) // Para acceder a H2 Console
                .sessionManagement(t -> t.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // No tener sesiones stateful
                .build();
    }

    private CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true); // Permitir credenciales, esto significa que las cookies, encabezados de autorización o certificados TLS pueden ser incluidos en las solicitudes
        configuration.addAllowedOriginPattern("*"); // Permitir cualquier origen
        configuration.addAllowedHeader("*"); // Permitir cualquier encabezado
        configuration.addAllowedMethod("*"); // Permitir cualquier método (GET, POST, PUT, DELETE, etc.)
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

Los cambios que se realizaron en la clase `SecurityConfig` son los siguientes:

- Headers frameOptions deshabilitado para permitir el acceso a la consola de H2, si no lo haces, no podrás acceder a la consola de H2 ya que este utiliza un iframe.
- SessionManagement configurado como STATELESS, esto es muy importante ya que JWT es un estándar sin estado (stateless), lo que significa que el servidor no mantiene ninguna información sobre el cliente entre solicitudes. Cada solicitud debe contener toda la información necesaria para que el servidor pueda procesarla.
- Se modificó el filtro de seguridad para las rutas que comienzan con `/api/**`, ya que estas rutas serán las que utilicen JWT para la autenticación y autorización.

### 4.4 Creación del filtro de autenticación JWT

Vamos a crear una nueva clase llamada `JwtAuthenticationFilter` en el paquete `config`, la cual se encargará de interceptar las solicitudes entrantes y validar el token JWT. La clase debe quedar de la siguiente manera:

```java
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private IJwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;
        UserDetails username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);

            if (jwtService.isTokenValid(token)) {
                username = jwtService.getUserDetailsFromToken(token);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username, token, username.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

Este usará un servicio llamado `IJwtService`, el cual se encargará de la generación y validación del token JWT. Vamos a crear este servicio en el siguiente paso.

```java
public interface IJwtService {
    String generateToken(User user, Authentication authentication);
    String extractUsername(String token);
    List<SimpleGrantedAuthority> extractAuthorities(String token);
    <T> T extractClaim(String token, Function<Claims, T> claimsResolver);
    UserDetails getUserDetailsFromToken(String token);
    boolean isTokenExpired(String token);
    boolean isTokenValid(String token);
}
```

Estos métodos permitirán lo siguiente:

- `generateToken(Authentication authentication)`: Generar un token JWT basado en la autenticación del usuario.
- `extractUsername(String token)`: Extraer el nombre de usuario del token JWT.
- `extractAuthorities(String token)`: Extraer las autoridades (roles) del usuario desde el token JWT.
- `extractClaim(String token, Function<Claims, T> claimsResolver)`: Extraer una afirmación específica del token JWT utilizando una función de resolución de afirmaciones.
- `getUserDetailsFromToken(String token)`: Obtener los detalles del usuario a partir del token JWT.
- `isTokenExpired(String token)`: Verificar si el token JWT ha expirado.
- `validateToken(String token)`: Validar la integridad y validez del token JWT.

Ahora realicemos la implementación de esta interfaz en una clase llamada `JwtService`:

```java
@Service
public class JwtServiceImpl implements IJwtService {

    @Value("${app.security.jwt.secret-key}")
    private String secretKey;

    @Value("${app.security.jwt.expiration-time}")
    private long expirationTime;

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    public String generateToken(User user, Authentication auth) {
        return Jwts.builder()
                .id(user.getId().toString())
                .claims(Map.of(
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "authorities", auth != null && auth.getAuthorities() != null ? auth.getAuthorities().stream()
                        .map(ga -> ga.getAuthority())
                        .toList() : List.of()
                ))
                .subject(user.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSignInKey())
                .compact();
    }

    @Override
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = Jwts.parser()
                .verifyWith(getSignInKey())
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
        return authorities.stream()
                .map(SimpleGrantedAuthority::new)
                .toList();
    }

    @Override
    public UserDetails getUserDetailsFromToken(String token) {
        String username = extractUsername(token);
        List<SimpleGrantedAuthority> authorities = extractAuthorities(token);
        return new org.springframework.security.core.userdetails.User(username, "", authorities);
    }

    @Override
    public boolean isTokenValid(String token) {
        try {
        Jwts.parser()
            .verifyWith(getSignInKey())
            .build()
            .parseSignedClaims(token);
        
        if (isTokenExpired(token)) {
            return false;
        }
        
        return true;
        } catch (Exception e) {
            return false;
        }
    }
}
```

### 4.5 Creación del endpoint de autenticación

Para la creación del endpoint de autenticación, vamos a crear un nuevo controlador llamado `AuthController` en el paquete `controllers`. Este controlador tendrá un endpoint para el login, el cual recibirá las credenciales del usuario y devolverá un token JWT si las credenciales son válidas.

```java
@RestController
@RequestMapping("/api/public/auth")
public class AuthController {
    
    @Autowired
    private IAuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {
        try {
            TokenResponseDTO token = authService.login(request);
            return ResponseEntity.ok(token);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}

public class LoginRequestDTO {
    
    private String username;
    private String password;
}

public class TokenResponseDTO{
    
    String accessToken;
}
```

### 4.6 Creación del servicio de autenticación

Vamos a crear una interfaz llamada `IAuthService` en el paquete `services`, la cual tendrá los métodos necesarios para el registro y login de usuarios.

```java
public interface IAuthService {
    TokenResponseDTO login(LoginRequestDTO request);
}

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements IAuthService {

    private final IJwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public TokenResponseDTO login(LoginRequestDTO request) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        if (userDetails == null) {
            throw new RuntimeException("Usuario no encontrado");
        }
        if (!passwordEncoder.matches(request.getPassword(), userDetails.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        CustomUserDetails customUD = (CustomUserDetails) userDetails;
        User user = customUD.getUser();
        Authentication auth = new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
        String token = jwtService.generateToken(user, auth);
        return new TokenResponseDTO(token); 
    }
    
}
```