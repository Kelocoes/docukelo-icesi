---
sidebar_position: 4
---

# Introducción a Spring

<iframe 
    src="https://www.canva.com/design/DAGukx9Pgkc/m-B8e0D83nPrRhVAiyX76A/view?embed"
    width="100%"
    height="600px"
    allowfullscreen="true"
    frameborder="0"
></iframe>

## Spring Context usando JSP

Para crear un contexto de Spring que use JSP, sigue estos pasos:

1. Abre Visual Studio Code y crea un nuevo proyecto Maven, puedes usar los arquetipos de la anterior sección.
2. Busca los artefactos para adicionar las dependencias en la siguiente url

    [https://search.maven.org/](https://search.maven.org/).

3. Seleccionamos el Spring Context y copiamos el fragmento xml para adicionarlo al archivo `pom.xml`:

    ```xml
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>6.0.11</version>
    </dependency>
    ```

4. Ejecutamos el comando `mvn clean install` para descargar las dependencias.

```bash
mvn clean install
```

5. Adicionar la clase HolaMundo como bean en la ruta `src/main/java/com/example/HolaMundo.java`:

```java
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

6. Crea un archivo `applicationContext.xml` en la carpeta `src/main/resources` y define el bean:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="HolaMundo" class="com.example.HolaMundo">
        <property name="mensaje" value="Hola Mundo spring!!" />
    </bean>

</beans>
```

7. Crea un archivo main `Main.java` en la carpeta `src/main/java/com/example/` para cargar el contexto de Spring y obtener el bean `HolaMundo`:

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        HolaMundo holaMundo = (HolaMundo) context.getBean("HolaMundo");
        System.out.println(holaMundo.getMensaje());
    }
}
```

8. Ejecuta tu aplicación usando el editor de código.

Si deseas ejecutarlo desde la terminal, asegúrate de tener instalado el plugin de `dexec` de Maven y ejecuta el siguiente comando:

```xml
<plugin>
    <groupId>org.codehaus.mojo</groupId>
    <artifactId>exec-maven-plugin</artifactId>
    <version>3.1.0</version>
    <configuration>
        <mainClass>com.example.Main</mainClass>
    </configuration>
</plugin>
```

```bash
mvn exec:java -Dexec.mainClass="com.example.Main"
```

9. Si deseas usar JSP, usando el archivo `index.jsp` en la carpeta `src/main/webapp`:

```html
<%@ page import="org.springframework.context.ApplicationContext" %>
<%@ page import="org.springframework.context.support.ClassPathXmlApplicationContext" %>
<%@ page import="com.example.HolaMundo" %>

<!DOCTYPE html>
<html>
    <head>
        <title>Spring desde JSP</title>
    </head>
    <body>
        <h1>Ejemplo de Spring desde JSP</h1>
        
        <%
            // Crear el contexto de Spring
            ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
            
            // Obtener el bean
            HolaMundo hola = (HolaMundo) context.getBean("HolaMundo");
            
            // Obtener el mensaje del bean
            String mensaje = hola.getMensaje();
        %>
        
        <p><%= mensaje %></p>
        
    </body>
</html>
```

## Caso adicional: Spring Context en Servlet

Si deseas usar Spring Context en un Servlet, puedes seguir estos pasos:

1. Crea o modifica el Servlet que desees utilizar, por ejemplo, `HolaMundoServlet.java` en la carpeta `src/main/java/com/example/`:

```java
package com.example;

import java.io.*;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import jakarta.servlet.http.*;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.*;

@WebServlet(name = "helloServlet", value = "/hello-servlet")
public class HelloServlet extends HttpServlet {
    private String message;

    public void init() {
         message = "Hello World from a Servlet!";
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Crear el contexto de Spring
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
        
        // Obtener el bean
        HolaMundo hola = (HolaMundo) context.getBean("HolaMundo");
        
        
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        out.println("<html><body>");
        out.println("<h1>Hola Mundo desde Servlet</h1>");
        out.println("<p>El siguiente mensaje es un atributo del bean: </p>");
        out.println("<p>" + hola.getMensaje() + "</p>");
        out.println("</body></html>");
    }

    public void destroy() {
    }
}

```