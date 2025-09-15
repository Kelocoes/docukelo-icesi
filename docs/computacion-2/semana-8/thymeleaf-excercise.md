---
sidebar_position: 3
---

# Guía de Thymeleaf: Caso Juegos de Mesa App

En esta guía vamos a explorar cómo utilizar Thymeleaf para crear una aplicación web sencilla que gestione una lista de juegos de mesa. Thymeleaf es un motor de plantillas para Java que permite generar HTML dinámico de manera eficiente y fácil de usar, puedes revisar las anteriores guías para entender su funcionamiento básico.

## Requisitos Previos

Puedes seguir esta guía haciendo uso del [repositorio del curso](https://github.com/Kelocoes/compunet2-202502/tree/springboot-test). Crea una nueva rama para trabajar en este ejercicio:

```bash
git checkout -b thymeleaf-exercise
```

Asegúrate de tener las siguientes dependencias en tu archivo `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
    <version>3.4.3</version>
</dependency>
```

## Contexto

Ya que tenemos el proyecto base, nos enfocaremos en la funcionalidad de gestionar los usuarios y los respectivos roles. La idea es que podamos listar, agregar, editar y eliminar usuarios desde una interfaz web. De esta manera, se omitiran las explicaciones de la especificación de servicios y repositorios adicionales.

## Estructura del Proyecto

Para trabajar con una estructura del proyecto base, vamos a crear unas carpetas en el apartado de `src/main/resources/templates` y `src/main/resources/static` para organizar mejor nuestros archivos Thymeleaf y recursos estáticos.

```plaintext
src/
└── main/
    └── resources/
        ├── templates/
        │   ├── users/
        │   │   ├── list.html
        │   │   ├── add.html
        │   │   ├── edit.html
        │   │   └── delete.html
        │   └── components/
        │       ├── header.html
        │       └── footer.html
        └── static/
            ├── css/
            │   └── users/
            │       └── styles.css
            │   └── components/
            │       └── header.css
            └── js/
                └── users/
                    └── scripts.js
```

También agregaremos en la carpeta `controller` una clase llamada `UserMVCController.java` para manejar las rutas y la lógica de negocio relacionada con los usuarios.

## Creación de componentes Thymeleaf

Para manejar una reutilización de código, vamos a crear dos componentes básicos: un encabezado y un pie de página. Estos componentes se incluirán en todas las páginas de usuarios.

### Componente Header

Crea un archivo llamado `header.html` en la carpeta `components` con el siguiente contenido:

```html
<header th:fragment="header">
    <h1>Gestión de Usuarios</h1>
    <nav>
        <ul>
            <li><a th:href="@{/mvc/users}">Lista de Usuarios</a></li>
            <li><a th:href="@{/mvc/users/add}">Agregar Usuario</a></li>
        </ul>
    </nav>
    <hr>
</header>
```

Aquí puedes observar que estamos utilizando la sintaxis de Thymeleaf para enlazar el archivo CSS y las rutas de navegación. El atributo `th:href` es utilizado para generar URLs dinámicas. Quizá te preguntes qué significa el símbolo `@{...}`. Este es un operador de Thymeleaf que se utiliza para construir URLs relativas a la raíz del contexto de la aplicación.


### Componente Footer

Crea un archivo llamado `footer.html` en la carpeta `components` con el siguiente contenido:

```html
<footer th:fragment="footer">
    <hr>
    <p>&copy; 2025 Aplicación de Juegos. Todos los derechos reservados.</p>
</footer>
```

Te dejaremos a ti la tarea de generar los archivos CSS para los componentes `header` y `footer`. Puedes agregar estilos básicos para mejorar la apariencia de estos componentes.

## Páginas de Usuarios

### Página de Lista de Usuarios

Crea un archivo llamado `list.html` en la carpeta `users` con el siguiente contenido:

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Lista de Usuarios</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" th:href="@{/css/components/header.css}">
    <link rel="stylesheet" th:href="@{/css/users/list.css}">
</head>
<body>
    <div th:replace="~{components/header :: header}"></div>
    <div class="container">
        <h2>Lista de Usuarios</h2>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr th:each="user : ${users}">
                    <td th:text="${user.id}">1</td>
                    <td th:text="${user.username}">JohnDoe</td>
                    <td th:text="${user.email}">email@example.com</td>
                    <td>
                        <a th:href="@{/users/edit(id=${user.id})}">Editar</a>
                        <a th:href="@{/users/delete(id=${user.id})}">Eliminar</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>
```

Hemos utilizado el atributo `th:each` para iterar sobre una lista de usuarios pasada desde el controlador. Cada usuario se representa en una fila de la tabla.

Además de eso, estamos haciendo uso del atributo `th:text` para mostrar los valores de las propiedades del usuario. También hemos incluido enlaces para editar y eliminar usuarios, utilizando `th:href` para generar las URLs dinámicamente.

Finalmente agregamos el componente `header` al inicio de la página utilizando `th:replace`.

Ahora es momento de crear el controlador que maneje las rutas por medio de la clase `UserMVCController.java`:

```java
package com.games.back.controller.mvc;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.games.back.services.IUserService;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/mvc/users")
@RequiredArgsConstructor
public class UserMVCController {

    private final IUserService userService;
    
    @GetMapping
    public String getAll(Model model) {
        model.addAttribute("users", userService.findAll());
        return "users/list";
    }
}
```

En este controlador, hemos definido una ruta base `/mvc/users` y un método `getAll` que maneja las solicitudes GET para listar todos los usuarios. El método utiliza el servicio `IUserService` para obtener la lista de usuarios y la agrega al modelo con el nombre `users`. Finalmente, retorna el nombre de la plantilla Thymeleaf `users/list` para renderizar la página.

Ejecuta la aplicación y navega a `http://localhost:8080/mvc/users` para ver la lista de usuarios.

> Nota: Asegúrate de comprobar los estilos de la aplicación, especialmente del componente `header`, ya que puede que necesite algunos ajustes para verse correctamente. También intenta agregar estilos a los usuarios para mejorar la apariencia de la tabla.


### Página de Agregar Usuario

Crea un archivo llamado `add.html` en la carpeta `users` con el siguiente contenido:

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Agregar Usuario</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" th:href="@{/css/components/header.css}">
    <link rel="stylesheet" th:href="@{/css/users/add.css}">
</head>
<body>
    <div th:replace="~{components/header :: header}"></div>
    <div class="container">
        <h2>Agregar Usuario</h2>
        <form th:action="@{/mvc/users/add}" method="post">
            <div>
                <label for="username">Nombre de Usuario:</label>
                <input type="text" id="username" name="username" maxlength="50" required>
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" maxlength="100" required>
            </div>
            <div>
                <label for="password_hash">Contraseña:</label>
                <input type="password" id="password_hash" name="password_hash" maxlength="255" required>
            </div>
            <div>
                <label for="bio">Biografía:</label>
                <textarea id="bio" name="bio" maxlength="500"></textarea>
            </div>
            <div>
                <label for="birthdate">Fecha de Nacimiento:</label>
                <input type="date" id="birthdate" name="birthdate">
            </div>
            <div>
                <label for="role">Rol:</label>
                <select id="role" name="role" required>
                    <option th:each="role : ${roles}" th:value="${role.id}" th:text="${role.name}"></option>
                </select>
            </div>
            <div>
                <button type="submit">Agregar Usuario</button>
            </div>
        </form>
    </div>
</body>
</html>
```

En esta página, hemos creado un formulario para agregar un nuevo usuario. El formulario incluye campos para el nombre de usuario, email, contraseña, biografía, fecha de nacimiento y rol. Utilizamos `th:action` para definir la URL a la que se enviará el formulario y `method="post"` para indicar que se trata de una solicitud POST.

El campo de selección para el rol utiliza `th:each` para iterar sobre una lista de roles pasada desde el controlador, permitiendo al usuario seleccionar un rol para el nuevo usuario.

Ahora, vamos a agregar el método correspondiente en el controlador `UserMVCController.java` para manejar la visualización del formulario y el procesamiento del envío del formulario:

```java
public class UserMVCController {

    private final IUserService userService;
    private final IRoleService roleService;
    
    @GetMapping
    public String getAll(Model model) {
        model.addAttribute("users", userService.findAll());
        return "users/list";
    }

    @GetMapping("/add")
    public String addUserForm(Model model) {
        User user = new User();
        model.addAttribute("user", user);
        model.addAttribute("roles", roleService.findAll());
        return "users/add";
    }
}
```

> Nota: Asegúrate de adicionar los estilos CSS para la página de agregar usuario en `add.css` para mejorar la apariencia del formulario.

Después de haber creado el formulario y el método del controlador, ejecuta la aplicación y navega a `http://localhost:8080/mvc/users/add` para ver el formulario de agregar usuario.

Ya podemos hacer clic en el enlace "Agregar Usuario" en el encabezado para acceder a esta página. No obstante, no tenemos un método para procesar el envío del formulario. Vamos a agregar ese método en el controlador:

```java
@PostMapping("/add")
public String addUser(@ModelAttribute User user) {
    user.setCreatedAt(new Timestamp(System.currentTimeMillis()));
    userService.save(user);
    return "redirect:/mvc/users";
}
```

### Página de Editar Usuario

Para la página de edición de usuario, debemos tener en cuenta que necesitamos cargar los datos del usuario existente en el formulario. Crea un archivo llamado `edit.html` en la carpeta `users` con el siguiente contenido:

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Editar Usuario</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" th:href="@{/css/components/header.css}">
    <link rel="stylesheet" th:href="@{/css/users/edit.css}">
</head>
<body>
    <div th:replace="~{components/header :: header}"></div>
    <div th:if="${actualUser == null}">
        <p>Usuario no encontrado.</p>
        <a th:href="@{/mvc/users}">Volver a la lista de usuarios</a>
    </div>
    <div th:if="${actualUser != null}" class="container">
        <h2>Editar Usuario</h2>
        <form th:action="@{/mvc/users/edit}" method="post">
            <input type="hidden" name="id" th:value="${actualUser.id}">
            <div>
                <label for="username">Nombre de Usuario:</label>
                <input type="text" id="username" name="username" maxlength="50" th:value="${actualUser.username}" required>
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" maxlength="100" th:value="${actualUser.email}" required>
            </div>
            <div>
                <label for="password_hash">Contraseña:</label>
                <input type="password" id="password_hash" name="password_hash" maxlength="255">
            </div>
            <div>
                <label for="bio">Biografía:</label>
                <textarea id="bio" name="bio" maxlength="500" th:text="${actualUser.bio}"></textarea>
            </div>
            <div>
                <label for="birthdate">Fecha de Nacimiento:</label>
                <input type="date" id="birthdate" name="birthdate" th:value="${actualUser.birthdate}">
            </div>
            <div>
                <label for="role">Rol:</label>
                <select id="role" name="role" required>
                    <option th:each="role : ${roles}" th:value="${role.id}" th:text="${role.name}" th:selected="${role.id == actualUser.role.id}"></option>
                </select>
            </div>
            <div>
                <button type="submit">Guardar Cambios</button>
            </div>
        </form>
    </div>
</body>
</html>
```

En esta página, hemos creado un formulario similar al de agregar usuario, pero con los campos prellenados con los datos del usuario existente. Utilizamos `th:value` y `th:text` para establecer los valores de los campos basándonos en el objeto `actualUser` pasado desde el controlador.

Ahora, vamos a agregar los métodos correspondientes en el controlador `UserMVCController.java` para manejar la visualización del formulario de edición y el procesamiento del envío del formulario:

```java
@GetMapping("/edit")
public String editUserForm(@RequestParam Long id, Model model) {
    User user = userService.findById(id);
    model.addAttribute("actualUser", user);
    model.addAttribute("roles", roleService.findAll());
    return "users/edit";
}

@PostMapping("/edit")
public String editUser(@ModelAttribute("actualUser") User user) {
    userService.save(user);
    return "redirect:/mvc/users";
}
```

En este controlador, hemos definido dos métodos: `editUserForm` para manejar las solicitudes GET y mostrar el formulario de edición con los datos del usuario existente, y `editUser` para manejar las solicitudes POST y procesar la actualización del usuario. 

### Página de Eliminar Usuario

Para este caso no necesitamos una página específica, ya que la eliminación se puede manejar mediante un enlace en la lista de usuarios. Agrega el siguiente método en el controlador `UserMVCController.java` para manejar la eliminación de usuarios:

```java
    @GetMapping("/delete")
    public String deleteUser(@RequestParam Long id) {
        userService.deleteById(id);
        return "redirect:/mvc/users";
    }
```

Este método maneja las solicitudes GET para eliminar un usuario basado en su ID. Después de eliminar el usuario, redirige a la lista de usuarios.

> Nota: Es posible que el método falle ya que existe una relación entre usuarios y juegos. Puedes manejar esta situación agregando una verificación antes de eliminar el usuario o configurando la relación para que permita eliminaciones en cascada si es apropiado para tu caso de uso.