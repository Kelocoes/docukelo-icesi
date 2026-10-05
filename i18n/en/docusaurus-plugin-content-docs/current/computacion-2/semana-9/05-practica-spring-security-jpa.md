---
sidebar_position: 5
sidebar_label: "Hands-on Lab: Spring Security & JPA"
---

import { StepByStep, Step } from '@site/src/components/StepByStep';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Admonition from '@theme/Admonition';

# Practical Guide: Spring Security Implementation with JPA and Thymeleaf

In the previous conceptual guides ([Authentication vs. Authorization](./01-autenticacion-vs-autorizacion.md), [Cryptography](./02-criptografia-passwords-hashing.md), [Spring Security Architecture](./03-arquitectura-spring-security.md), and [Authorities vs. Roles](./04-authorities-vs-roles.md)), we examined the theoretical architecture of access control, the filter chain (`SecurityFilterChain`), the role of `AuthenticationManager`, and password hash validation via `PasswordEncoder`.

In this practical guide, we translate all those concepts into working code in **Spring Boot**. We will start with in-memory credentials to understand Bean registration and then transition to a complete enterprise architecture connecting **Spring Data JPA**, **`UserDetails`** adapters, dynamic permissions via **`GrantedAuthority`**, **BCrypt** password hashing, and custom **Thymeleaf** views.

---

## Starter Repository

To follow along with this lab, use the starter Spring Boot project available at:
* **Official repository:** [Kelocoes/compunet2-202502](https://github.com/Kelocoes/compunet2-202502)
* **Working branch:** `springboot-mvc`

Clone the repository and import it into your preferred IDE (IntelliJ IDEA, VS Code, or Eclipse):

```bash
git clone -b springboot-mvc https://github.com/Kelocoes/compunet2-202502.git
```

---

## Step-by-Step Lab

<StepByStep>
  <Step number="1" title="Add Project Dependencies">
    To enable security capabilities, add the official Spring Security starter to your build manager:

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

    Update your dependencies in your terminal:
    ```bash
    mvn clean install
    ```
  </Step>

  <Step number="2" title="Initial Run and Default Endpoint Lockdown">
    Start your Spring Boot application:
    ```bash
    mvn spring-boot:run
    ```

    The moment the dependency is detected on the *classpath*, **Spring Security automatically enables a default auto-configuration**:
    1. Registers a preconfigured `SecurityFilterChain`.
    2. Locks down **every single endpoint** in your application.
    3. Enables web form authentication (`formLogin`) and HTTP headers (`httpBasic`).
    4. Generates a default user named `user` and outputs a random one-time password to the console logs:

    ```text
    Using generated security password: d91a3b84-4e20-4a81-9b16-56201a05fe8a
    ```

    Navigating to `http://localhost:8080/mvc/users` in your browser will immediately redirect you to the default login form (`/login`). Entering `user` and the printed console password grants access to the requested view.
  </Step>

  <Step number="3" title="Configure In-Memory Authentication (InMemoryUserDetailsManager)">
    To eliminate dependency on console-printed passwords, create a configuration class annotated with `@Configuration`. In this initial step, we define an in-memory user using `InMemoryUserDetailsManager`:

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

            UserDetails user = User.withUsername("myUser")
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

  <Step number="4" title="Define the Mandatory PasswordEncoder">
    Starting with Spring Security 5, declaring a `PasswordEncoder` Bean is strictly required. If omitted, Spring throws an error: `There is no PasswordEncoder mapped for the id "null"`.

    For rapid local prototyping, we can temporarily utilize `NoOpPasswordEncoder` (which performs no hashing and stores plaintext passwords):

    ```java title="src/main/java/com/games/back/config/WebSecurityConfig.java" showLineNumbers
    import org.springframework.security.crypto.password.NoOpPasswordEncoder;
    import org.springframework.security.crypto.password.PasswordEncoder;

    @Configuration
    public class WebSecurityConfig {

        // ... userDetailsService Bean defined in step 3 ...

        @Bean
        public PasswordEncoder passwordEncoder() {
            // WARNING: NoOpPasswordEncoder is insecure and intended exclusively for educational testing
            return NoOpPasswordEncoder.getInstance(); 
        }
    }
    ```
  </Step>

  <Step number="5" title="Transition to Database: Dynamic Architecture">
    Keeping users in memory is unsuitable for real applications. We will now structure the architecture where Spring Security delegates queries to our relational database through Spring Data JPA.

    Notice the structural flow:

    ```mermaid
    graph TD
        Config["WebSecurityConfig<br/>(UserDetailsService Bean)"]
        Service["CustomUserDetailsService<br/>(implements UserDetailsService)"]
        USvc["UserService"]
        Repo["UserRepository"]
        DB[("PostgreSQL<br/>Database")]
        Wrapper["CustomUserDetails<br/>(User adapter wrapper)"]

        Config -->|Registers Bean| Service
        Service -->|Injects| USvc
        USvc -->|Queries| Repo
        Repo -->|SQL JPA| DB
        Service -->|Builds & returns| Wrapper
    ```

    Create the `CustomUserDetailsService` class inside the security package:

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
            // Completed in following steps with database lookup
            throw new UnsupportedOperationException("Pending database repository link");
        }
    }
    ```

    In `WebSecurityConfig`, update the `userDetailsService` Bean to inject your new dynamic service rather than the in-memory manager:

    ```java title="src/main/java/com/games/back/config/WebSecurityConfig.java" showLineNumbers
    @Bean
    public UserDetailsService userDetailsService() {
        return new CustomUserDetailsService();
    }
    ```
  </Step>

  <Step number="6" title="Bind with User Entity and Repository">
    Verify that your user business service (`UserService`) exposes a lookup method to retrieve `User` entities by username:

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

    Inject `UserService` into `CustomUserDetailsService`:

    ```java title="src/main/java/com/games/back/security/CustomUserDetailsService.java" showLineNumbers
    @Autowired
    private UserService userService;
    ```
  </Step>

  <Step number="7" title="Implement the Adapter Wrapper (UserDetails)">
    Spring Security has no knowledge of your custom domain entities (`com.games.back.model.User`). To bridge both models, create an adapter class (*Wrapper*) implementing the `UserDetails` interface:

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
            // Temporarily returning static authority; made dynamic in Step 8
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

    Complete the `loadUserByUsername` method in `CustomUserDetailsService`:

    ```java title="src/main/java/com/games/back/security/CustomUserDetailsService.java" showLineNumbers
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found in database: " + username);
        }
        return new CustomUserDetails(user);
    }
    ```
  </Step>

  <Step number="8" title="Dynamic Role and Authority Mapping (GrantedAuthority)">
    To feed permissions and roles stored in relational tables directly into the Spring Security engine, implement the `GrantedAuthority` interface:

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

    Update `getAuthorities()` in `CustomUserDetails` to dynamically map permissions attached to the user's role:

    ```java title="src/main/java/com/games/back/security/CustomUserDetails.java" showLineNumbers
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getRole().getRolePermissions().stream()
                .map(RolePermission::getPermission)
                .map(SecurityAuthority::new)
                .toList();
    }
    ```

    :::warning[Hibernate Warning: LazyInitializationException]
    If the relationship between `Role` and `RolePermission` is configured for lazy loading (`FetchType.LAZY`), navigating `user.getRole().getRolePermissions()` outside an active transactional Hibernate session triggers a `LazyInitializationException`. Resolve this by annotating your service method with `@Transactional(readOnly = true)` or using a `JOIN FETCH` query in your repository.
    :::
  </Step>

  <Step number="9" title="Secure Cryptography: Hashing with BCrypt">
    Remove `NoOpPasswordEncoder` completely and register the production-ready cryptographic encoder: `BCryptPasswordEncoder`:

    ```java title="src/main/java/com/games/back/config/WebSecurityConfig.java" showLineNumbers
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    ```

    When persisting new user records, **hash raw passwords prior to saving to the database**:

    ```java title="src/main/java/com/games/back/service/UserService.java" showLineNumbers
    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        // Automatically applies BCrypt salt and work factor
        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);
        return userRepository.save(user);
    }
    ```

    In seed scripts (`src/main/resources/data.sql`), pre-hashed BCrypt strings must be provided:

    ```sql title="src/main/resources/data.sql"
    -- Plain password "admin123" hashed with BCrypt
    INSERT INTO users (username, email, password, role_id) VALUES 
    ('admin', 'admin@example.com', '$2a$10$wK1.wzXF0z8bZ9C6o7Z6m.VwE/K9K12aP8W1H0Vf8zQ4Y5X7v9Z6u', 1);
    ```
  </Step>

  <Step number="10" title="Configure Route Access Rules in SecurityFilterChain">
    By default, Spring Security restricts everything. Using `SecurityFilterChain`, we define which paths are publicly accessible (CSS styles, JS bundles, static assets) and which require authenticated access:

    ```java title="src/main/java/com/games/back/config/WebSecurityConfig.java" showLineNumbers
    import org.springframework.security.config.Customizer;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.web.SecurityFilterChain;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(auth -> auth
                // Public paths accessible without authentication
                .requestMatchers("/css/**", "/js/**", "/images/**").permitAll()
                .requestMatchers("/mvc/public/**").permitAll()
                
                // Endpoints restricted by Role (Spring looks for ROLE_ADMIN automatically)
                .requestMatchers("/mvc/admin/**").hasRole("ADMIN")

                // Endpoints restricted by specific Authority
                .requestMatchers("/mvc/reports/**").hasAuthority("VIEW_REPORTS")

                // Any other request requires an authenticated session
                .anyRequest().authenticated()
            )
            .formLogin(Customizer.withDefaults())
            .logout(Customizer.withDefaults())
            .build();
    }
    ```
  </Step>

  <Step number="11" title="Customize the Login View with Thymeleaf">
    To replace Spring's stock login page with a custom branded template:

    1. Configure `formLogin` parameters in `SecurityFilterChain`:

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
                .loginPage("/mvc/auth/login")           // GET: Controller serving the HTML view
                .loginProcessingUrl("/mvc/auth/login")  // POST: Spring Security interceptor endpoint
                .defaultSuccessUrl("/mvc/users", true)  // Redirect on successful authentication
                .failureUrl("/mvc/auth/login?error=true") // Redirect on invalid credentials
                .usernameParameter("username")          // Form input name in HTML
                .passwordParameter("password")          // Form input name in HTML
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

    2. Create the MVC controller that serves the view:

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
                model.addAttribute("errorMessage", "Invalid username or password.");
            }
            if (logout != null) {
                model.addAttribute("logoutMessage", "You have successfully logged out.");
            }
            return "auth/login";
        }
    }
    ```

    3. Create the Thymeleaf template in `src/main/resources/templates/auth/login.html`:

    ```html title="src/main/resources/templates/auth/login.html" showLineNumbers
    <!DOCTYPE html>
    <html xmlns:th="http://www.thymeleaf.org" lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Sign In — Universidad Icesi</title>
        <link rel="stylesheet" th:href="@{/css/bootstrap.min.css}">
    </head>
    <body class="bg-light d-flex align-items-center justify-content-center" style="min-height: 100vh;">
        <div class="card shadow-sm p-4" style="width: 100%; max-width: 420px; border-radius: 12px;">
            <h3 class="text-center text-primary mb-4 font-weight-bold">Sign In</h3>

            <!-- Dynamic feedback banners with Thymeleaf -->
            <div th:if="${errorMessage}" class="alert alert-danger py-2" th:text="${errorMessage}"></div>
            <div th:if="${logoutMessage}" class="alert alert-success py-2" th:text="${logoutMessage}"></div>

            <!-- Form submitted to Spring Security filter -->
            <form th:action="@{/mvc/auth/login}" method="post">
                <div class="mb-3">
                    <label for="username" class="form-label font-weight-bold">Username or Email</label>
                    <input type="text" id="username" name="username" class="form-control" required autofocus>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label font-weight-bold">Password</label>
                    <input type="password" id="password" name="password" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary w-100 py-2 font-weight-bold">Sign In</button>
            </form>
        </div>
    </body>
    </html>
    ```
  </Step>
</StepByStep>

---

## Verification and Testing

After finishing all 11 steps:
1. Start the application with `mvn spring-boot:run`.
2. Navigate to `http://localhost:8080/mvc/auth/login` and test invalid credentials to verify the `Invalid username or password.` message.
3. Sign in using your seeded database user (`admin` / `admin123`). Spring Security will authenticate the user, evaluate the BCrypt hash, and redirect to `/mvc/users`.
4. Trigger `/logout` to verify session invalidation, cookie removal, and return to the login screen with the logout confirmation banner.
