---
sidebar_position: 1
---

# Guía para el uso del módulo de Spring Security en Spring Boot

Para poder seguir de la mejor manera esta guía, te recomiendo empezar con el proyecto de Spring Boot que se encuentra en este enlace:
[Enlace de repositorio antes de Security](https://github.com/Kelocoes/compunet2-202502/tree/springboot-mvc)
A pesar de ello, esta guía podría serte útil para la configuración de Spring Security en cualquier proyecto de Spring Boot.

## Activando Spring Security

1. Para iniciar con Spring Security, es necesario agregar al `pom.xml` del proyecto el siguiente código:

```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
```

2. Ejecuta el comando `mvn clean install` para instalar las dependencias.

3. Ejecuta el comando `mvn spring-boot:run` para correr la aplicación. A partir de agregar la dependencia de Spring Security, la aplicación se bloqueará ante cualquier solicitud y pedirá un usuario y contraseña. Por defecto, Spring Security crea un usuario llamado `user` y una contraseña aleatoria que se muestra en la consola al iniciar la aplicación.

4. Intenta hacer una solicitud para obtener la información de la aplicación, por ejemplo, intenta ingresar a `http://localhost:8081/compunet2-2025/mvc/users`. Spring Security bloqueará la solicitud y pedirá un usuario y contraseña.

    4.1 Si estás usando Postman, puedes agregar un usuario y contraseña en la pestaña de `Authorization`. Selecciona el tipo `Basic Auth` y agrega el usuario y contraseña que se muestra en la consola al iniciar la aplicación.

5. Para poder modificar este usuario y contraseña, lo más adecuado será crear un archivo de configuración (anotado con `@Configuration`) y crear un bean de tipo `UserDetailsService`. En este bean, se puede modificar el usuario y contraseña por defecto.

```java
package com.games.back.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

@Configuration
public class WebSecurityConfig {
    @Bean
    public UserDetailsService userDetailsService() {
        InMemoryUserDetailsManager userDetailsMngr = new InMemoryUserDetailsManager();

        UserDetails user = User.withUsername("miUsuario") // Cambiar el usuario
                .password("123456") // Especificar la contraseña
                .authorities("read") // Las authorities representan los permisos que tiene el usuario
                .roles("USER") // Los roles son un conjunto de authorities
                .build();
        
        userDetailsMngr.createUser(user); // Agregar el usuario a la lista de usuarios

        return userDetailsMngr; // Retornar la lista de usuarios
    }
}
```

6. Además, es importante especificar un `PasswordEncoder` para que Spring Security pueda encriptar la contraseña. Se puede hacer de la siguiente manera:

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return NoOpPasswordEncoder.getInstance(); // No usar para producción
    // return new BCryptPasswordEncoder(); // Más recomendable y generalmente usado, no usar si aún no has hecho el proceso de encriptación
}
```

7. Si vuelves a ejecutar la aplicación, podrás ver que el usuario y contraseña por defecto ya no funcionan (además de que no aparece la contraseña autogenerada) y que ahora debes usar el usuario y contraseña que especificaste en el archivo de configuración.

## Custom UserDetailsService

Hasta el momento hemos visto cómo crear un usuario en memoria, pero en la mayoría de los casos, los usuarios y contraseñas se almacenan en una base de datos. Para ello, es necesario crear una clase que implemente la interfaz `UserDetailsService` y sobreescribir el método `loadUserByUsername`.

8. Crea una carpeta en `service` para los aspectos de autenticación, y ahí crea el `CustomDetailsService`. Este nos permitirá buscar un usuario en la base de datos por su nombre de usuario y no quemar el usuario y contraseña en el código.

```java
public class CustomUserDetailsService implements UserDetailsService{

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'loadUserByUsername'");
    }
    
}
```

9. Además de eso, ya podemos modificar nuestro bean de `UserDetailsService` para que use el `CustomUserDetailsService`. (O anotarlo con `@Service`).

```java
@Bean
public UserDetailsService userDetailsService() {
    return new CustomUserDetailsService();
}
```

10. Es importante tener lista nuestra entidad de usuarios hasta este punto con sus repositorios y servicios creados. Añadiremos un nuevo servicio que permita buscar un usuario por su nombre de usuario (si aún no ha sido especificado).

 ```java
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
```

11. Debemos inyectar la dependencia de `UserService` en nuestro `CustomUserDetailsService` para poder buscar el usuario por su nombre de usuario.

```java
@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.findByUsername(username);
        return null;
    }
}
```

12. Hasta aquí esto está incompleto debido a que el método `loadUserByUsername` debe retornar un objeto de tipo `UserDetails`. Para solucionar esto, debemos crear una clase que implemente la interfaz `UserDetails` y retornar una instancia de esta clase. Recomiendo entonces crear una carpeta `security` y crear ahí la clase `CustomUserDetails`.

```java
package com.games.back.security;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.games.back.model.User;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final User user;

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // GrantedAuthority es una interfaz que representa un permiso concedido a un objeto de autenticación.
        // Podemos crear una implementación personalizada de GrantedAuthority para representar nuestros propios permisos.
        // En este caso, estamos devolviendo una lista de permisos que el usuario tiene.
        return List.of(() -> "read");
    }
}
```

13. Ahora, en nuestro `CustomUserDetailsService` ya podremos retornar una instancia de `SecurityUser` en el método `loadUserByUsername`.

```java
@Override
public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    try {
        User user = userService.findByUsername(username);
        return new CustomUserDetails(user);
    } catch (RuntimeException ex) {
        throw new UsernameNotFoundException("User not found with username: " + username, ex);
    }
}
```

14. Intentemos ejecutar la aplicación nuevamente y ver si podemos autenticarnos con el usuario y contraseña que hemos especificado en la base de datos.

## Custom SecurityAuthorities

15. Hasta el momento se ha dejado quemado el permiso del usuario en el método `getAuthorities` de la clase `SecurityUser`. Para poder hacer esto de manera más dinámica, se puede crear una clase que implemente la interfaz `GrantedAuthority` y retornar una lista de estas instancias en el método `getAuthorities`.

```java
package com.games.back.security;

import org.springframework.security.core.GrantedAuthority;

import com.games.back.model.Permission;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class SecurityAuthority implements GrantedAuthority {

    private final Permission permission;

    @Override
    public String getAuthority() {
        return permission.getName();
    }

}

// En el método getAuthorities de SecurityUser
@Override
public Collection<? extends GrantedAuthority> getAuthorities() {
    List<SecurityAuthority> authorities = user.getRole().getRolePermissions().stream()
            .map(RolePermission::getPermission)
            .map(SecurityAuthority::new)
            .toList();
    return authorities;
}
```

**Nota:** Aquí lanzará un error respecto al Lazy Loading, ya que estamos intentando obtener algo fuera del contexto de Hibernate. Por favor, soluciona este problema.

16. Después de realizar todo hasta este punto, ya deberías poder autenticarte con un usuario y contraseña que se encuentre en la base de datos. Pero además de eso, imprime antes de enviar la respuesta al usuario las authorities, y comprueba que tenga todas las authorities asignadas a ese usuario:

```java
// En el controlador de usuarios
@GetMapping
public String getAll(Model model) {
    model.addAttribute("users", userService.findAll());
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    auth.getAuthorities().forEach(authority -> System.out.println(authority.getAuthority()));
    return "users/list";
}
```

## Contraseñas hasheadas

Para poder usar contraseñas hasheadas, es necesario cambiar el `PasswordEncoder` en el archivo de configuración de seguridad. En lugar de usar `NoOpPasswordEncoder`, se puede usar `BCryptPasswordEncoder`.

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

No obstante, puede que empiece a fallar la autenticación si las contraseñas en la base de datos no están hasheadas. Para solucionar esto, es necesario hashear las contraseñas antes de guardarlas en la base de datos. Esto se puede hacer en el servicio de usuarios.

```java
@Service
public class UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User save(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

}
```

Y en el arhivo `data.sql`, es necesario hashear las contraseñas antes de insertarlas en la base de datos. Puedes usar una herramienta en línea para hashear las contraseñas con BCrypt.

Las contraseñas serán `password` hasheada con BCrypt:

```sql
INSERT INTO users (username, email, password_hash, bio, created_at, role_id, birthdate) VALUES 
('admin', 'admin@example.com', '$2y$10$6o5vS5YmB6/txDbxtABg8OlTI2XTrdzGdwwsOt4EgVRsJujeef6CC', 'Administrator account', CURRENT_TIMESTAMP, 1, '1980-01-01'),
```

## Rutas privadas y públicas

Para manejar las rutas privadas y públicas, es necesario modificar el archivo de configuración de seguridad. En este archivo, se puede especificar qué rutas son públicas y cuáles requieren autenticación.

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(authz -> authz
            .requestMatchers("/mvc/public/**").permitAll()
            .anyRequest().authenticated()
        )
        .formLogin(Customizer.withDefaults())
        .logout(Customizer.withDefaults())
        .build();
}
```

Esto permitirá el acceso a cualquier ruta que comience con `/mvc/public/` sin necesidad de autenticación, mientras que cualquier otra ruta requerirá autenticación.

```java
@Controller
@RequestMapping("/mvc/public")
public class PublicMVCController {
    
    @RequestMapping("/hello")
    public String hello() {
        return "hello";
    }
}
```

También se agregó la funcionalidad de login y logout por defecto de Spring Security. De esta manera podrías agregar un enlace a `/login` en tu aplicación para que los usuarios puedan autenticarse así como un enlace a `/logout` para cerrar sesión. Aquí te presento un ejemplo:

```html
<header th:fragment="header">
    <h1>Gestión de Usuarios</h1>
    <nav>
        <ul>
            <li><a th:href="@{/mvc/users}">Lista de Usuarios</a></li>
            <li><a th:href="@{/mvc/users/add}">Agregar Usuario</a></li>
            <li>
                <form th:action="@{/logout}" method="post" style="display: inline;">
                    <button type="submit">Logout</button>
                </form>
            </li>
        </ul>
    </nav>
    <hr>
</header>
```

## Lógin personalizado

También tenemos la posibilidad de crear un formulario de login personalizado. Para ello, es necesario crear un controlador que maneje las rutas de login y logout.

```java
@Controller
@RequestMapping("/mvc/auth")
public class LoginController {
    
    @GetMapping("/login")
    public String login() {
        return "auth/login";
    }
}
```

También deberemos de modificar nuestro filter chain para que use nuestro formulario de login personalizado.

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(authz -> authz
            .requestMatchers("/mvc/public/**").permitAll()
            .requestMatchers("/mvc/auth/login", "/css/**", "/js/**").permitAll()
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
```

Por último, es necesario crear la vista del formulario de login personalizado.

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Login</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" th:href="@{/css/auth/login.css}">
</head>
<body>
    <div class="login-container">
        <h2>Iniciar Sesión</h2>
        
        <!-- Mensaje de error -->
        <div th:if="${param.error}" class="error">
            Usuario o contraseña incorrectos
        </div>
        
        <!-- Mensaje de logout -->
        <div th:if="${param.logout}" class="success">
            Has cerrado sesión correctamente
        </div>
        
        <form th:action="@{/mvc/auth/login}" method="post">
            <div>
                <label for="username">Usuario:</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div>
                <label for="password">Contraseña:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div>
                <button type="submit">Iniciar Sesión</button>
            </div>
        </form>
    </div>
</body>
</html>
```