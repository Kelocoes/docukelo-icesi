---
sidebar_position: 5
---

# Configuración de Smart Tomcat

Esta guía te ayudará a configurar Smart Tomcat en tu entorno de desarrollo, tanto en IntelliJ IDEA como en Visual Studio Code.

## Requisitos previos

Asegúrate de tener instalado lo siguiente:

- [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/) o [Visual Studio Code](https://code.visualstudio.com/Download)
- [Java JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- [Tomcat 10 o superior](https://tomcat.apache.org)
- [Maven](https://maven.apache.org/download.cgi)
- [Git](https://git-scm.com/downloads)

---

## Configuración en IntelliJ IDEA

1. Abre IntelliJ IDEA y selecciona **New Project**.
2. Elige **Jakarta EE** como plantilla y selecciona **Web Application**.
3. En **Application server**, selecciona **Tomcat Server** y luego **Tomcat 10**. Si no está configurado, haz clic en **New** y selecciona la carpeta donde instalaste Tomcat.

    ![Configuración de Tomcat en IntelliJ IDEA](/img/tomcat-jakarta-1.png)

4. Crea el proyecto y espera a que IntelliJ configure el entorno.
5. Ve a la esquina superior derecha, haz clic en el engranaje de configuración y selecciona **Plugins**.
6. Busca **Smart Tomcat** e instálalo.

    ![Instalación del plugin Smart Tomcat](/img/tomcat-jakarta-2.png)

7. Haz clic en el icono de ejecución y selecciona **Edit Configurations**.

    ![Configuración de Smart Tomcat en IntelliJ IDEA](/img/tomcat-jakarta-3.png)

8. En la ventana de configuración, selecciona **Smart Tomcat** y haz clic en el icono **+** para agregar una nueva configuración.
9. En **Tomcat Server**, selecciona la ruta de instalación de Tomcat y verifica que el puerto sea el correcto (por defecto, 8080).

    ![Configuración del servidor Tomcat](/img/tomcat-jakarta-4.png)

10. Aplica los cambios y cierra la ventana de configuración.
11. Ahora puedes ejecutar tu aplicación web haciendo clic en el icono de ejecución.

---

## Configuración en Visual Studio Code

1. Abre Visual Studio Code y asegúrate de tener instalado el plugin **Java Extension Pack**.
2. Abre la paleta de comandos (`Ctrl+Shift+P`) y ejecuta **Java: Create Java Project**.
3. Selecciona **Maven** y luego **maven-archetype-webapp** en su versión más reciente.

    ![Creación de proyecto Java en Vscode](/img/tomcat-jakarta-vscode-1.png)

4. Elige el grupo y artefacto del proyecto (por ejemplo, `com.example` y `my-web-app`).
5. Selecciona la ubicación del proyecto y espera a que se cree.
6. Agrega la siguiente dependencia al archivo `pom.xml`:

    ```xml
    <dependency>
          <groupId>jakarta.servlet</groupId>
          <artifactId>jakarta.servlet-api</artifactId>
          <version>5.0.0</version>
          <scope>provided</scope>
    </dependency>
    ```

7. Crea las siguientes carpetas para organizar tu proyecto:
    - `src/main/java/com/example` para el código Java.
    - `src/main/webapp` para los archivos web (HTML, JSP, etc.).

8. La estructura del proyecto debe verse así:

    ```
    my-web-app/
    ├── pom.xml
    ├── src/
    │   ├── main/
    │   │   ├── java/com/example/
    │   │   └── webapp/
    │       ├── WEB-INF/
    │       │   └── web.xml
    │       └── index.jsp
    ```

9. Crea el archivo `HelloServlet.java` en `src/main/java/com/example`:

    ```java
    import java.io.*;
    import jakarta.servlet.http.*;
    import jakarta.servlet.annotation.*;

    @WebServlet(name = "helloServlet", value = "/hello-servlet")
    public class HelloServlet extends HttpServlet {
        private String message;

        public void init() {
             message = "Hello World!";
        }

        public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
             response.setContentType("text/html");
             PrintWriter out = response.getWriter();
             out.println("<html><body>");
             out.println("<h1>" + message + "</h1>");
             out.println("</body></html>");
        }

        public void destroy() {
        }
    }
    ```
A este punto es bueno hablar sobre lo que significa un Servlet. Un Servlet es una clase Java que maneja solicitudes y respuestas HTTP, permitiendo crear aplicaciones web dinámicas. En este ejemplo, el Servlet `HelloServlet` responde a las solicitudes GET con un mensaje "Hello World!".

A continuación te muestro una gráfica que expone la ubicación de un servlet dentro de un proyecto web:

<img src="/img/servlet.png" alt="Ubicación de un Servlet en un proyecto web" width="600"/>

Como puedes observar, los servlet se encuentran usualmente dentro del Web Server, en este caso Tomcat, y son invocados por el contenedor de servlets cuando se recibe una solicitud HTTP que coincide con su configuración.

En el ciclo de vida de un servlet, puedes observar lo siguiente:

<img src="/img/ciclo-vida-servlet.png" alt="Ciclo de vida de un Servlet" width="500"/>

- El servlet es cargado en el Web Container cuando se recibe una solicitud.
- Luego se crea una instancia de dicho servlet.
- El método `init()` es llamado para inicializar el servlet.
- Cuando se recibe una solicitud, el método `doGet()` o `doPost()` es invocado dependiendo del tipo de solicitud.
- Finalmente, cuando el servlet ya no es necesario, el método `destroy()` es llamado para liberar recursos.

10. Compila el proyecto con Maven. En la terminal ejecuta:

     ```bash
     mvn clean compile
     ```

11. Instala la extensión **Community Server Connectors** desde el marketplace de VS Code.

     ![Instalación de Community Server Connectors en Vscode](/img/tomcat-jakarta-vscode-2.png)

12. Haz clic en el tab **Servers** (parte inferior izquierda), haz clic derecho en **Community Server Connectors** y selecciona **Create new server**.

     ![Creación de nuevo servidor en Vscode](/img/tomcat-jakarta-vscode-3.png)

13. Selecciona **Tomcat** y la versión instalada, luego haz clic en **Finish**.
14. Empaqueta tu aplicación web ejecutando:

     ```bash
     mvn clean package
     ```

15. Haz clic derecho sobre el Tomcat creado y selecciona **Add deployment**.

     ![Agregar despliegue en Vscode](/img/tomcat-jakarta-vscode-4.png)

16. Selecciona el archivo WAR generado en `target/my-web-app.war`.
17. Inicia el servidor Tomcat haciendo clic derecho en el servidor y seleccionando **Start**.
18. Abre tu navegador y accede a `http://localhost:8080/my-web-app/` para ver tu aplicación en funcionamiento.

