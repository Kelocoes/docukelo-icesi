---
sidebar_position: 2
---

# Filter Chain

Las aplicaciones web modernas a menudo requieren múltiples filtros para manejar diversas preocupaciones transversales, como la autenticación, la autorización, el registro y la gestión de sesiones. En Spring Security, estos filtros se organizan en una cadena de filtros (filter chain) que procesa las solicitudes entrantes de manera secuencial.

## Cadena de filtros en Spring Security

Spring Security proporciona una cadena de filtros predefinida que maneja varias tareas de seguridad. Algunos de los filtros más comunes en la cadena incluyen:
- `SecurityContextPersistenceFilter`: Gestiona el contexto de seguridad para cada solicitud.
- `UsernamePasswordAuthenticationFilter`: Maneja la autenticación basada en nombre de usuario y contraseña
- `BasicAuthenticationFilter`: Maneja la autenticación HTTP básica.
- `AuthorizationFilter`: Verifica los permisos del usuario para acceder a recursos específicos.
- `CsrfFilter`: Protege contra ataques CSRF (Cross-Site Request Forgery).
- `LogoutFilter`: Maneja el proceso de cierre de sesión.

## Cómo crear una cadena de filtros personalizada

Puedes personalizar la cadena de filtros en Spring Security agregando tus propios filtros o modificando el orden de los filtros existentes. Aquí hay un ejemplo de cómo agregar un filtro personalizado a la cadena de filtros:

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .addFilterBefore(new CustomFilter(), UsernamePasswordAuthenticationFilter.class)
        .authorizeRequests()
            .anyRequest().authenticated()
        .and()
        .httpBasic();
    return http.build();
}
```

En este ejemplo, `CustomFilter` es un filtro personalizado que se agrega antes del `UsernamePasswordAuthenticationFilter`.

## Ejemplo de un filtro personalizado

Para crear un filtro personalizado, puedes extender la clase `OncePerRequestFilter` y anular el método `doFilterInternal`. Aquí hay un ejemplo simple:

```java
public class CustomAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(CustomAuthenticationFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        logger.info("Request received: {} {}", request.getMethod(), request.getRequestURI());

        Boolean flag = true;

        if (flag) {
            filterChain.doFilter(request, response);
            HttpServletResponse httpResponse = (HttpServletResponse) response;
            logger.info("Response sent: status={}", httpResponse.getStatus());
        } else {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            logger.warn("Unauthorized access attempt: {} {}", request.getMethod(), request.getRequestURI());
        }
    }
}
```

Este filtro puede tener diferentes lógicas de autenticación o autorización según tus necesidades. Es posible que dependiendo de tus necesidades, debas de ajustar incluso la lógica del AuthenticationManager y crear tus propios AuthenticationProvider.