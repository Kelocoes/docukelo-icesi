---
sidebar_position: 1
---

# Introducción a Spring

Aspectos generales de Spring

<iframe 
    src="https://www.canva.com/design/DAGukx9Pgkc/m-B8e0D83nPrRhVAiyX76A/view?embed"
    width="100%"
    height="600px"
    allowfullscreen="true"
    frameborder="0"
></iframe>

## ¿Qué es Spring Context?

Spring Context es el núcleo del framework Spring y se encarga de la **gestión de objetos (beans)** y sus **dependencias**.  
A través del contenedor de Spring, los objetos no se crean manualmente, sino que son **administrados por el framework**, permitiendo una mejor organización, desacoplamiento y reutilización del código.

En este documento se muestra cómo usar **Spring Context integrado con Servlets**, sin utilizar JSP, para comprender cómo Spring puede convivir con aplicaciones web Java tradicionales.

---

## Estructura general del proyecto

La estructura mínima del proyecto será:

```
src/
├── main/
│   ├── java/
│   │   └── com/example/
│   │       ├── HolaMundo.java
│   │       └── HelloServlet.java
│   ├── resources/
│   │   └── applicationContext.xml
│   └── webapp/
│       └── WEB-INF/
└── pom.xml
```

---

## Paso 1: Crear el proyecto Maven

1. Abre Visual Studio Code.
2. Crea un nuevo proyecto **Maven** (puedes usar los arquetipos vistos previamente).
3. Asegúrate de que el proyecto tenga empaquetado `war`, ya que usará Servlets.

---

## Paso 2: Agregar la dependencia de Spring Context

Spring Context se obtiene desde Maven Central.

En el archivo `pom.xml`, agrega la dependencia:

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>6.0.11</version>
</dependency>
```

Esta dependencia permite:

- Crear el contenedor de Spring
- Definir beans
- Inyectar dependencias

---

## Paso 3: Descargar dependencias

Ejecuta el siguiente comando para descargar las dependencias:

```bash
mvn clean install
```

---

## Paso 4: Crear un Bean simple

Creamos una clase Java que será gestionada por Spring.

**Ruta:** `src/main/java/com/example/HolaMundo.java`

```java
package com.example;

public class HolaMundo {

    private String mensaje;

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}
```

### ¿Qué representa esta clase?

- Es un POJO (Plain Old Java Object).
- Spring se encargará de crear y configurar esta clase como un bean.

---

## Paso 5: Configurar el Application Context

Creamos el archivo de configuración de Spring.

**Ruta:** `src/main/resources/applicationContext.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
           http://www.springframework.org/schema/beans
           https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="HolaMundo" class="com.example.HolaMundo">
        <property name="mensaje" value="Hola Mundo spring!!" />
    </bean>

</beans>
```

### ¿Qué hace este archivo?

- Define el contenedor de Spring
- Registra un bean llamado `HolaMundo`
- Inicializa su propiedad `mensaje`

---

## Paso 6: Crear el Servlet que usa Spring Context

Creamos un Servlet que accede al contexto de Spring para obtener el bean.

**Ruta:** `src/main/java/com/example/HelloServlet.java`

```java
package com.example;

import java.io.IOException;
import java.io.PrintWriter;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet(name = "helloServlet", value = "/hello-servlet")
public class HelloServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Cargar el contexto de Spring desde el classpath
        ApplicationContext context =
                new ClassPathXmlApplicationContext("applicationContext.xml");

        // Obtener el bean definido en Spring
        HolaMundo hola = (HolaMundo) context.getBean("HolaMundo");

        // Respuesta HTTP
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        out.println("<html><body>");
        out.println("<h1>Hola Mundo desde Servlet</h1>");
        out.println("<p>El siguiente mensaje proviene de un bean gestionado por Spring:</p>");
        out.println("<p><strong>" + hola.getMensaje() + "</strong></p>");
        out.println("</body></html>");
    }
}
```

---

## Paso 7: ¿Qué está pasando en el Servlet?

1. El Servlet recibe una petición HTTP (`doGet`).
2. Se crea el `ApplicationContext` de Spring.
3. Se obtiene el bean `HolaMundo`.
4. El mensaje del bean se usa para generar la respuesta HTML.
5. Spring se utiliza solo para la lógica y gestión de objetos, no para la vista.
