---
sidebar_position: 5
sidebar_label: "Práctica: Spring Security y JPA"
---

import { StepByStep, Step } from '@site/src/components/StepByStep';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Admonition from '@theme/Admonition';

# Guía Práctica: Implementación de Spring Security con JPA y Thymeleaf

En las guías conceptuales anteriores ([Autenticación vs. Autorización](./01-autenticacion-vs-autorizacion.md), [Criptografía](./02-criptografia-passwords-hashing.md), [Arquitectura de Spring Security](./03-arquitectura-spring-security.md) y [Authorities vs. Roles](./04-authorities-vs-roles.md)), analizamos los fundamentos teóricos del control de acceso, la cadena de filtros (`SecurityFilterChain`), el rol del `AuthenticationManager` y la validación de hashes con `PasswordEncoder`.

En esta guía práctica llevaremos todos esos conceptos a la realidad del código en **Spring Boot**. Comenzaremos configurando credenciales en memoria para familiarizarnos con el registro de Beans y luego migraremos a una arquitectura empresarial completa conectando **Spring Data JPA**, adaptadores **`UserDetails`**, permisos dinámicos mediante **`GrantedAuthority`**, hashing con **BCrypt** y vistas personalizadas en **Thymeleaf**.

---

## Repositorio Base de Inicio

Para desarrollar esta práctica, utiliza el proyecto de Spring Boot disponible en el siguiente repositorio:
* **Repositorio oficial:** [Kelocoes/compunet2-202502](https://github.com/Kelocoes/compunet2-202502)
* **Rama de trabajo:** `springboot-mvc`

Clona el repositorio e impórtalo en tu entorno de desarrollo (IntelliJ IDEA, VS Code o Eclipse):

```bash
git clone -b springboot-mvc https://github.com/Kelocoes/compunet2-202502.git
```

---

## Laboratorio Paso a Paso

<StepByStep>
  <Step number="1" title="Agregar Dependencias al Proyecto">
    Para activar las capacidades de seguridad, añade el starter oficial de Spring Security a tu gestor de dependencias:

    <Tabs>
      <TabItem value="maven" label="Maven (pom.xml)" default>
        ```xml title="pom.xml" showLineNumbers
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        ```
      </TabItem>
      <TabItem value="gradle" label="Gradle (build.gradle)">
        ```groovy title="build.gradle" showLineNumbers
        implementation 'org.springframework.boot:spring-boot-starter-security'
        ```
      </TabItem>
    </Tabs>

    Actualiza las dependencias en tu terminal:
    ```bash
    mvn clean install
    ```
  </Step>

  <Step number="2" title="Ejecución Inicial y Bloqueo por Defecto de Rutas">
    Inicia tu aplicación Spring Boot:
    ```bash
    mvn spring-boot:run
    ```

    En cuanto la dependencia entra en el *classpath*, **Spring Security activa automáticamente una configuración de seguridad por defecto**:
    1. Registra un `SecurityFilterChain` preconfigurado.
    2. Bloquea **absolutamente todos** los endpoints de tu aplicación.
    3. Habilita autenticación mediante formulario web (`formLogin`) y mediante encabezados HTTP (`httpBasic`).
    4. Genera un usuario por defecto llamado `user` y una contraseña aleatoria de un solo uso que se imprime en los logs de la consola:

    ```text
    Using generated security password: d91a3b84-4e20-4a81-9b16-56201a05fe8a
    ```

    Si abres el navegador en `http://localhost:8080/mvc/users`, serás redirigido inmediatamente a un formulario de inicio de sesión por defecto (`/login`). Al ingresar `user` y la contraseña de la consola, obtendrás acceso al recurso.
  </Step>

  <Step number="3" title="Configurar Autenticación en Memoria (InMemoryUserDetailsManager)">
    Para evitar depender de contraseñas impresas en consola, crearemos una clase de configuración anotada con `@Configuration`. En este primer paso, definiremos un usuario en memoria utilizando `InMemoryUserDetailsManager`:

    ```java title="src/main/java/com/games/back/config/WebSecurityConfig.java" showLineNumbers
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

            UserDetails user = User.withUsername("miUsuario")
                    .password("123456")
                    .authorities("READ")
                    .roles("USER")
                    .build();
            
            userDetailsMngr.createUser(user);
            return userDetailsMngr;
        }
    }
    ```
  </Step>

  <Step number="4" title="Definir el PasswordEncoder Obligatorio">
    Desde Spring Security 5, el framework exige de manera obligatoria que se declare un Bean de tipo `PasswordEncoder`. Si no se define, Spring arrojará un error de tipo `There is no PasswordEncoder mapped for the id "null"`.

    Para pruebas rápidas en desarrollo local podemos usar temporalmente `NoOpPasswordEncoder` (el cual no aplica ningún hash y procesa contraseñas en texto plano):

    ```java title="src/main/java/com/games/back/config/WebSecurityConfig.java" showLineNumbers
    import org.springframework.security.crypto.password.NoOpPasswordEncoder;
    import org.springframework.security.crypto.password.PasswordEncoder;

    @Configuration
    public class WebSecurityConfig {

        // ... Bean userDetailsService definido en el paso 3 ...

        @Bean
        public PasswordEncoder passwordEncoder() {
            // ADVERTENCIA: NoOpPasswordEncoder es inseguro y se utiliza únicamente para aprendizaje
            return NoOpPasswordEncoder.getInstance(); 
        }
    }
    ```
  </Step>

  <Step number="5" title="Transición a Base de Datos: Arquitectura Dinámica">
    Tener usuarios en memoria no es viable en producción. A continuación, implementaremos la arquitectura donde Spring Security delega la consulta a nuestra base de datos relacional mediante Spring Data JPA.

    Analiza el cambio estructural:

    ```mermaid
    graph TD
        Config["WebSecurityConfig<br/>(Bean UserDetailsService)"]
        Service["CustomUserDetailsService<br/>(implements UserDetailsService)"]
        USvc["UserService"]
        Repo["UserRepository"]
        DB[("Base de Datos<br/>PostgreSQL")]
        Wrapper["CustomUserDetails<br/>(Wrapper adaptador de User)"]

        Config -->|Registra Bean| Service
        Service -->|Inyecta| USvc
        USvc -->|Consulta| Repo
        Repo -->|SQL JPA| DB
        Service -->|Construye y retorna| Wrapper
    ```

    Crea la clase `CustomUserDetailsService` en el paquete de seguridad:

    ```java title="src/main/java/com/games/back/security/CustomUserDetailsService.java" showLineNumbers
    package com.games.back.security;

    import org.springframework.security.core.userdetails.UserDetails;
    import org.springframework.security.core.userdetails.UserDetailsService;
    import org.springframework.security.core.userdetails.UsernameNotFoundException;
    import org.springframework.stereotype.Service;

    @Service
    public class CustomUserDetailsService implements UserDetailsService {

        @Override
        public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
            // Se completará en los siguientes pasos con la consulta a la base de datos
            throw new UnsupportedOperationException("Pendiente de enlazar con repositorio");
        }
    }
    ```

    En `WebSecurityConfig`, actualiza el Bean `userDetailsService` para que inyecte tu nuevo servicio dinámico en lugar del gestor en memoria:

    ```java title="src/main/java/com/games/back/config/WebSecurityConfig.java" showLineNumbers
    @Bean
    public UserDetailsService userDetailsService() {
        return new CustomUserDetailsService();
    }
    ```
  </Step>

  <Step number="6" title="Vincular con la Entidad y Repositorio de Usuarios">
    Asegúrate de que tu servicio de usuarios (`UserService`) exponga un método para recuperar entidades `User` por su nombre de usuario:

    ```java title="src/main/java/com/games/back/service/UserService.java" showLineNumbers
    package com.games.back.service;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;
    import com.games.back.model.User;
    import com.games.back.repository.UserRepository;

    @Service
    public class UserService {

        @Autowired
        private UserRepository userRepository;

        public User findByUsername(String username) {
            return userRepository.findByUsername(username);
        }
    }
    ```

    Inyecta `UserService` dentro de `CustomUserDetailsService`:

    ```java title="src/main/java/com/games/back/security/CustomUserDetailsService.java" showLineNumbers
    @Autowired
    private UserService userService;
    ```
  </Step>

  <Step number="7" title="Implementar la Envoltura Adaptadora (UserDetails)">
    Spring Security no conoce tus entidades de base de datos (`com.games.back.model.User`). Para conectar ambas capas, creamos una clase adaptadora (*Wrapper*) que implemente la interfaz `UserDetails`:

    ```java title="src/main/java/com/games/back/security/CustomUserDetails.java" showLineNumbers
    package com.games.back.security;

    import java.util.Collection;
    import java.util.List;
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
            // Temporalmente retornamos una authority fija; en el paso 8 la haremos dinámica
            return List.of(() -> "READ");
        }

        @Override
        public boolean isAccountNonExpired() {
            return true;
        }

        @Override
        public boolean isAccountNonLocked() {
            return true;
        }

        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }

        @Override
        public boolean isEnabled() {
            return true;
        }
    }
    ```

    Ahora completa el método `loadUserByUsername` en `CustomUserDetailsService`:

    ```java title="src/main/java/com/games/back/security/CustomUserDetailsService.java" showLineNumbers
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("Usuario no encontrado en la base de datos: " + username);
        }
        return new CustomUserDetails(user);
    }
    ```
  </Step>

  <Step number="8" title="Mapeo Dinámico de Roles y Permisos (GrantedAuthority)">
    Para que los roles y permisos almacenados en las tablas relacionales alimenten el motor de autorización de Spring Security, creamos una clase que implemente `GrantedAuthority`:

    ```java title="src/main/java/com/games/back/security/SecurityAuthority.java" showLineNumbers
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
    ```

    Actualiza el método `getAuthorities()` en `CustomUserDetails` para mapear dinámicamente los permisos asociados al rol del usuario:

    ```java title="src/main/java/com/games/back/security/CustomUserDetails.java" showLineNumbers
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getRole().getRolePermissions().stream()
                .map(RolePermission::getPermission)
                .map(SecurityAuthority::new)
                .toList();
    }
    ```

    :::warning[Alerta de Hibernate: LazyInitializationException]
    Si la relación entre `Role` y `RolePermission` está configurada como carga perezosa (`FetchType.LAZY`), acceder a `user.getRole().getRolePermissions()` fuera de una sesión transaccional de Hibernate lanzará un error `LazyInitializationException`. Para solucionarlo, anota el método en tu servicio con `@Transactional(readOnly = true)` o utiliza una consulta con `JOIN FETCH` en tu repositorio JPA.
    :::
  </Step>

  <Step number="9" title="Criptografía Segura: Hashing con BCrypt">
    Elimina definitivamente `NoOpPasswordEncoder` y registra el codificador criptográfico recomendado para producción: `BCryptPasswordEncoder`:

    ```java title="src/main/java/com/games/back/config/WebSecurityConfig.java" showLineNumbers
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    ```

    Cuando registres un nuevo usuario en tu aplicación, debes **hashear la contraseña antes de persistirla en la base de datos**:

    ```java title="src/main/java/com/games/back/service/UserService.java" showLineNumbers
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        // Aplica el hash BCrypt con salt automático
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        return userRepository.save(user);
    }
    ```

    En tu script inicial de inserción de datos (`src/main/resources/data.sql`), las contraseñas predefinidas deben insertarse previamente hasheadas con BCrypt:

    ```sql title="src/main/resources/data.sql"
    -- Contraseña en texto plano: "admin123" hasheada con BCrypt
    INSERT INTO users (username, email, password, role_id) VALUES 
    ('admin', 'admin@example.com', '$2a$10$wK1.wzXF0z8bZ9C6o7Z6m.VwE/K9K12aP8W1H0Vf8zQ4Y5X7v9Z6u', 1);
    ```
  </Step>

  <Step number="10" title="Configurar Reglas de Acceso en SecurityFilterChain">
    Por defecto, Spring Security bloquea todo. Mediante el Bean `SecurityFilterChain`, establecemos qué rutas son de libre acceso público (hojas de estilo CSS, scripts JS, endpoints informativos) y cuáles requieren autenticación obligatoria:

    ```java title="src/main/java/com/games/back/config/WebSecurityConfig.java" showLineNumbers
    import org.springframework.security.config.Customizer;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.web.SecurityFilterChain;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(auth -> auth
                // Rutas públicas accesibles sin autenticación
                .requestMatchers("/css/**", "/js/**", "/images/**").permitAll()
                .requestMatchers("/mvc/public/**").permitAll()
                
                // Rutas restringidas por Rol (Spring busca ROLE_ADMIN automáticamente)
                .requestMatchers("/mvc/admin/**").hasRole("ADMIN")

                // Rutas restringidas por Authority puntual
                .requestMatchers("/mvc/reports/**").hasAuthority("VIEW_REPORTS")

                // Cualquier otra solicitud requiere que el usuario esté autenticado
                .anyRequest().authenticated()
            )
            .formLogin(Customizer.withDefaults())
            .logout(Customizer.withDefaults())
            .build();
    }
    ```
  </Step>

  <Step number="11" title="Personalizar el Formulario de Login con Thymeleaf">
    Para sustituir el formulario de login genérico de Spring por una plantilla visual integrada con el diseño de tu aplicación web:

    1. Modifica la configuración de `formLogin` en el `SecurityFilterChain`:

    ```java title="src/main/java/com/games/back/config/WebSecurityConfig.java" showLineNumbers
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/css/**", "/js/**", "/images/**").permitAll()
                .requestMatchers("/mvc/auth/login", "/mvc/auth/register").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/mvc/auth/login")           // GET: Controlador que renderiza la vista
                .loginProcessingUrl("/mvc/auth/login")  // POST: Spring Security intercepta el formulario
                .defaultSuccessUrl("/mvc/users", true)  // Redirección ante autenticación exitosa
                .failureUrl("/mvc/auth/login?error=true") // Redirección ante credenciales inválidas
                .usernameParameter("username")          // Nombre del campo input en el HTML
                .passwordParameter("password")          // Nombre del campo input en el HTML
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/mvc/auth/login?logout=true")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            )
            .build();
    }
    ```

    2. Crea el controlador que sirve la vista:

    ```java title="src/main/java/com/games/back/controller/AuthController.java" showLineNumbers
    package com.games.back.controller;

    import org.springframework.stereotype.Controller;
    import org.springframework.ui.Model;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RequestParam;

    @Controller
    public class AuthController {

        @GetMapping("/mvc/auth/login")
        public String showLoginPage(
                @RequestParam(value = "error", required = false) String error,
                @RequestParam(value = "logout", required = false) String logout,
                Model model) {
            
            if (error != null) {
                model.addAttribute("errorMessage", "Usuario o contraseña incorrectos.");
            }
            if (logout != null) {
                model.addAttribute("logoutMessage", "Has cerrado sesión correctamente.");
            }
            return "auth/login";
        }
    }
    ```

    3. Diseña la plantilla Thymeleaf `src/main/resources/templates/auth/login.html`:

    ```html title="src/main/resources/templates/auth/login.html" showLineNumbers
    <!DOCTYPE html>
    <html xmlns:th="http://www.thymeleaf.org" lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Iniciar Sesión — Universidad Icesi</title>
        <link rel="stylesheet" th:href="@{/css/bootstrap.min.css}">
    </head>
    <body class="bg-light d-flex align-items-center justify-content-center" style="min-height: 100vh;">
        <div class="card shadow-sm p-4" style="width: 100%; max-width: 420px; border-radius: 12px;">
            <h3 class="text-center text-primary mb-4 font-weight-bold">Iniciar Sesión</h3>

            <!-- Mensajes de feedback dinámicos con Thymeleaf -->
            <div th:if="${errorMessage}" class="alert alert-danger py-2" th:text="${errorMessage}"></div>
            <div th:if="${logoutMessage}" class="alert alert-success py-2" th:text="${logoutMessage}"></div>

            <!-- Formulario procesado por Spring Security -->
            <form th:action="@{/mvc/auth/login}" method="post">
                <div class="mb-3">
                    <label for="username" class="form-label font-weight-bold">Usuario o Correo</label>
                    <input type="text" id="username" name="username" class="form-control" required autofocus>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label font-weight-bold">Contraseña</label>
                    <input type="password" id="password" name="password" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary w-100 py-2 font-weight-bold">Ingresar</button>
            </form>
        </div>
    </body>
    </html>
    ```
  </Step>
</StepByStep>

---

## Verificación y Pruebas

Una vez completados los 11 pasos:
1. Inicia la aplicación con `mvn spring-boot:run`.
2. Accede a `http://localhost:8080/mvc/auth/login` y prueba ingresar con credenciales erróneas para verificar el mensaje `Usuario o contraseña incorrectos`.
3. Ingresa con las credenciales de tu usuario de base de datos (`admin` / `admin123`). Spring Security procesará la autenticación, comparará el hash con BCrypt y te redirigirá a `/mvc/users`.
4. Al hacer clic en cerrar sesión (`/logout`), la sesión HTTP quedará invalidada y el usuario volverá a la pantalla de login con el mensaje de confirmación de salida.
