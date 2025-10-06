---
sidebar_position: 1
---

# API REST

## Stateless vs Stateful

En el contexto de servicios web, la diferencia entre **stateless** y **stateful** se refiere a cómo se maneja el estado de las interacciones entre el cliente y el servidor.

<img src="/img/stateful-stateless.png" alt="Stateful vs Stateless" width="500" />

### Stateless
- Cada solicitud del cliente al servidor debe contener toda la información necesaria para ser procesada.
- El servidor **no guarda información de estado** sobre las solicitudes previas.
- Ideal para escalabilidad y simplicidad.

**Ejemplo:** Las APIs REST suelen ser stateless: cada petición HTTP incluye toda la información (headers, cuerpo, token, etc.) necesaria para procesar la solicitud.

**Ventajas:**
- Escalabilidad.
- Facilidad de recuperación ante fallos.
- Simplificación del servidor.

**Desventajas:**
- El cliente debe enviar más información en cada solicitud.
- No hay memoria de contexto entre peticiones.

### Stateful
- El servidor **mantiene información de sesión o contexto** del cliente.
- Cada solicitud puede depender de las anteriores.

**Ejemplo:** Aplicaciones que requieren sesiones persistentes, como un chat o una conexión FTP.

**Ventajas:**
- Permite mantener sesiones largas o datos temporales.
- Facilita interacciones complejas entre cliente y servidor.

**Desventajas:**
- Dificulta la escalabilidad.
- Requiere gestión de sesiones o replicación de estado.

#### Ejemplo de Stateful en Spring Boot

#### Ejemplo: Mantener información de usuario con HttpSession

Supongamos que tenemos una aplicación web con vistas Thymeleaf. El usuario ingresa su nombre en un formulario (`/login`), y luego, en otra vista (`/perfil`), el sistema muestra su información sin que él vuelva a enviarla. Esto se logra usando `HttpSession`.

```java
package com.ejemplo.demo.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.ui.Model;

@Controller
public class UsuarioController {

    // Primera solicitud: el usuario inicia sesión
    @PostMapping("/login")
    public String login(@RequestParam String nombre, HttpSession session) {
        session.setAttribute("usuario", nombre);
        return "redirect:/perfil";
    }

    // Segunda solicitud: el usuario accede a su perfil
    @GetMapping("/perfil")
    public String perfil(HttpSession session, Model model) {
        String nombreUsuario = (String) session.getAttribute("usuario");
        if (nombreUsuario == null) {
            return "redirect:/login";
        }
        model.addAttribute("nombre", nombreUsuario);
        return "perfil";
    }

    // Tercera solicitud: el usuario cierra sesión
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}
```

**Explicación paso a paso:**

1. **Primera solicitud (POST /login):**  
   El usuario envía su nombre. El controlador lo guarda en la sesión (`HttpSession`). Spring genera una cookie `JSESSIONID` y la envía al cliente.

2. **Segunda solicitud (GET /perfil):**  
   El usuario accede a `/perfil` y la cookie `JSESSIONID` permite recuperar el nombre guardado en la sesión. El controlador muestra la información personalizada.

3. **Cierre de sesión (GET /logout):**  
   Se destruye la sesión con `session.invalidate()`. El servidor elimina el contexto del usuario.

Este mecanismo permite mantener información entre solicitudes, haciendo el servicio **stateful**.

## ¿Qué es una API REST?

Una **API REST (Representational State Transfer)** es un estilo de arquitectura que define cómo deben comunicarse los sistemas distribuidos, especialmente sobre HTTP.  
REST se basa en recursos que pueden ser accedidos mediante URLs y manipulados con los métodos HTTP estándar.

**Ejemplo:**  
```
GET /api/usuarios
POST /api/usuarios
GET /api/usuarios/{id}
DELETE /api/usuarios/{id}
```

Cada URL representa un **recurso**, y las operaciones HTTP definen las acciones sobre él.

## Principios REST

1. **Interfaz uniforme (Uniform Interface):**
    - Cada recurso debe tener una URL única.
    - Las representaciones de los recursos son independientes del servidor (por ejemplo, JSON o XML).

2. **Sin estado (Stateless):**
    - Cada solicitud es independiente y debe contener toda la información necesaria.

3. **Cacheable:**
    - Las respuestas deben indicar si pueden o no ser almacenadas en caché para mejorar el rendimiento.

4. **Cliente-servidor:**
    - Separación entre la interfaz de usuario (cliente) y la lógica de negocio (servidor).

5. **Arquitectura en capas (Layered System):**
    - La comunicación puede pasar por múltiples capas (por ejemplo, balanceadores o proxies).

6. **Código bajo demanda (opcional):**
    - El servidor puede proporcionar código ejecutable al cliente (por ejemplo, JavaScript).


## Ejemplos de recursos REST

| Recurso | Método HTTP | Descripción |
|----------|--------------|--------------|
| `/usuarios` | `GET` | Obtener lista de usuarios |
| `/usuarios/10` | `GET` | Obtener usuario con ID 10 |
| `/usuarios` | `POST` | Crear un nuevo usuario |
| `/usuarios/10` | `PUT` | Actualizar usuario con ID 10 |
| `/usuarios/10` | `DELETE` | Eliminar usuario con ID 10 |
| `/usuarios?rol=admin` | `GET` | Obtener usuarios con rol "admin" (uso de query params) |
| `/usuarios?activo=true&edad_min=18` | `GET` | Filtrar usuarios activos mayores de 18 años |
| `/usuarios/10/permisos` | `GET` | Obtener permisos del usuario con ID 10 (recurso encadenado) |
| `/usuarios/10/permisos` | `POST` | Asignar un nuevo permiso al usuario con ID 10 |
| `/grupos/5/usuarios` | `GET` | Listar usuarios que pertenecen al grupo con ID 5 |
| `/usuarios/10/amigos` | `GET` | Obtener la lista de amigos del usuario con ID 10 |
| `/usuarios?pagina=2&tamano=20` | `GET` | Paginación: obtener la segunda página de usuarios, 20 por página |


## Métodos HTTP

| Método | Descripción | Uso común |
|--------|--------------|------------|
| **GET** | Recupera información | Consultar recursos |
| **POST** | Crea un nuevo recurso | Enviar datos al servidor |
| **PUT** | Actualiza completamente un recurso | Modificar datos existentes |
| **PATCH** | Actualiza parcialmente un recurso | Cambiar solo ciertos campos |
| **DELETE** | Elimina un recurso | Remover datos |
| **OPTIONS** | Devuelve los métodos permitidos | Verificar capacidades del recurso |


## Códigos de Estado HTTP

| Código | Significado | Descripción |
|--------|--------------|--------------|
| **200 OK** | Éxito | La solicitud fue procesada correctamente |
| **201 Created** | Recurso creado | Se ha creado un nuevo recurso |
| **204 No Content** | Sin contenido | La solicitud fue exitosa pero no devuelve cuerpo |
| **400 Bad Request** | Solicitud incorrecta | Error en los datos enviados |
| **401 Unauthorized** | No autenticado | Requiere autenticación |
| **403 Forbidden** | Prohibido | El usuario no tiene permisos |
| **404 Not Found** | No encontrado | El recurso no existe |
| **409 Conflict** | Conflicto | Ya existe o hay conflicto con otro recurso |
| **500 Internal Server Error** | Error del servidor | Fallo inesperado en el servidor |

## Further Reading

- [Referencia de códigos de estado HTTP en MDN](https://developer.mozilla.org/es/docs/Web/HTTP/Reference/Status)