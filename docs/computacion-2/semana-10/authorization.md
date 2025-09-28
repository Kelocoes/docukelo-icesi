---
sidebar_position: 1
---

# Authorization

Breve guía para entender la autorización en aplicaciones web usando Spring Security.

## Autorización basada en permisos

La autorización basada en permisos implica asignar permisos específicos a los usuarios o roles, y luego verificar esos permisos antes de permitir el acceso a ciertos recursos o acciones. En Spring Security, esto se puede lograr utilizando anotaciones como `@PreAuthorize` y `@PostAuthorize`, o configurando reglas de seguridad en la configuración de seguridad.

- `@PreAuthorize`: Esta anotación se utiliza para verificar los permisos antes de que se ejecute un método. Por ejemplo, `@PreAuthorize("hasRole('ADMIN')")` asegura que solo los usuarios con el rol ADMIN puedan acceder al método anotado.
- `@PostAuthorize`: Esta anotación se utiliza para verificar los permisos después de que se haya ejecutado un método. Por ejemplo, `@PostAuthorize("returnObject.owner == authentication.name")` asegura que el usuario que llama al método sea el propietario del objeto devuelto.

## Configuración de reglas de seguridad

En el archivo de configuración de seguridad, puedes definir reglas de seguridad para diferentes rutas y métodos HTTP. Por ejemplo:

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
        .authorizeRequests()
            .antMatchers("/admin/**").hasRole("ADMIN")
            .antMatchers("/user/**").hasRole("USER")
            .anyRequest().authenticated()
        .and()
        .httpBasic();
}
```

O también puedes especificar la autorización a nivel de método:

```java
@Configuration
@EnableMethodSecurity
public class WebSecurityConfig {
    /* Configuración de seguridad */
}
```

Y luego en tus controladores:

```java
@Controller
@RequestMapping("/mvc/users")
@RequiredArgsConstructor
public class UserMVCController {

    private final IUserService userService;
    private final IRoleService roleService;
    
    @GetMapping
    @PreAuthorize("hasAuthority('view-user')")
    public String getAll(Model model) {
        model.addAttribute("users", userService.findAll());
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        auth.getAuthorities().forEach(authority -> System.out.println(authority.getAuthority()));
        return "users/list";
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('view-user') or #id == authentication.principal.user.id")
    public String getById(@PathVariable Long id, Model model) {
        User user = userService.findById(id);
        model.addAttribute("user", user);
        return "users/detail";
    }

    @GetMapping("/add")
    @PreAuthorize("hasAuthority('create-user')")
    public String addUserForm(Model model) {
        User user = new User();
        model.addAttribute("user", user);
        model.addAttribute("roles", roleService.findAll());
        return "users/add";
    }

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('create-user')")
    public String addUser(@ModelAttribute User user) {
        user.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        userService.save(user);
        return "redirect:/mvc/users";
    }

    @GetMapping("/edit")
    @PreAuthorize("hasAuthority('edit-user') or #id == authentication.principal.user.id")
    public String editUserForm(@RequestParam Long id, Model model) {
        User user = userService.findById(id);
        model.addAttribute("actualUser", user);
        model.addAttribute("roles", roleService.findAll());
        return "users/edit";
    }

    @PostMapping("/edit")
    @PreAuthorize("hasAuthority('edit-user') or #id == authentication.principal.user.id")
    public String editUser(@ModelAttribute("actualUser") User user) {
        userService.save(user);
        return "redirect:/mvc/users";
    }

    @GetMapping("/delete")
    @PreAuthorize("hasAuthority('delete-user')")
    public String deleteUser(@RequestParam Long id) {
        userService.deleteById(id);
        return "redirect:/mvc/users";
    }
}
```

