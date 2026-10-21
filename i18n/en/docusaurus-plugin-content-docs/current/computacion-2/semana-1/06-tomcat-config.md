---
sidebar_position: 6
description: "Set up Smart Tomcat in IntelliJ IDEA and Visual Studio Code to run and debug Java web applications."
---

# Smart Tomcat Setup Guide

This guide helps you set up Smart Tomcat in your development environment, both in IntelliJ IDEA and in Visual Studio Code.

## Prerequisites

Make sure you have the following installed:

- [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/) or [Visual Studio Code](https://code.visualstudio.com/Download)
- [Java JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- [Tomcat 10 or higher](https://tomcat.apache.org)
- [Maven](https://maven.apache.org/download.cgi)
- [Git](https://git-scm.com/downloads)

---

## IntelliJ IDEA Setup

1. Open IntelliJ IDEA and select **New Project**.
2. Choose the **Jakarta EE** template and select **Web Application**.
3. Under **Application server**, select **Tomcat Server** and then **Tomcat 10**. If it is not configured yet, click **New** and select the folder where you installed Tomcat.

    ![Tomcat configuration in IntelliJ IDEA](/img/computacion-2/tomcat-jakarta-1.png)

4. Create the project and wait for IntelliJ to set up the environment.
5. Go to the upper-right corner, click the settings gear and select **Plugins**.
6. Search for **Smart Tomcat** and install it.

    ![Smart Tomcat plugin installation](/img/computacion-2/tomcat-jakarta-2.png)

7. Click the run icon and select **Edit Configurations**.

    ![Smart Tomcat configuration in IntelliJ IDEA](/img/computacion-2/tomcat-jakarta-3.png)

8. In the configuration window, select **Smart Tomcat** and click the **+** icon to add a new configuration.
9. Under **Tomcat Server**, select the Tomcat installation path and check that the port is correct (8080 by default).

    ![Tomcat server configuration](/img/computacion-2/tomcat-jakarta-4.png)

10. Apply the changes and close the configuration window.
11. You can now run your web application by clicking the run icon.

---

## Visual Studio Code Setup

1. Open Visual Studio Code and make sure the **Java Extension Pack** plugin is installed.
2. Open the command palette (`Ctrl+Shift+P`) and run **Java: Create Java Project**.
3. Select **Maven** and then **maven-archetype-webapp** in its latest version.

    ![Creating a Java project in VS Code](/img/computacion-2/tomcat-jakarta-vscode-1.png)

4. Choose the project's group and artifact (for example, `com.example` and `my-web-app`).
5. Select the project location and wait for it to be created.
6. Add the following dependency to the `pom.xml` file:

    ```xml title="pom.xml"
    <dependency>
          <groupId>jakarta.servlet</groupId>
          <artifactId>jakarta.servlet-api</artifactId>
          <version>5.0.0</version>
          <scope>provided</scope>
    </dependency>
    ```

7. Create the following folders to organize your project:
    - `src/main/java/com/example` for the Java code.
    - `src/main/webapp` for the web files (HTML, JSP, etc.).

8. The project structure should look like this:

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

9. Create the `HelloServlet.java` file in `src/main/java/com/example`:

    ```java title="HelloServlet.java"
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
At this point it is worth talking about what a Servlet is. A Servlet is a Java class that handles HTTP requests and responses, allowing you to build dynamic web applications. In this example, the `HelloServlet` Servlet answers GET requests with a "Hello World!" message.

Below is a diagram that shows where a servlet sits inside a web project. Go through it step by step: first you get to know the pieces, and then you follow the journey of a request to the servlet and back.

<iframe
  src="/interactive/computacion-2/semana-1/servlet-en-tomcat/index.html"
  title="The servlet inside Tomcat: Coyote, Catalina and the servlets"
  style={{ width: '100%', height: 640, border: 0 }}
  loading="lazy"
/>

As you can see, servlets usually live inside the Web Server, in this case Tomcat, and are invoked by the servlet container when an HTTP request matching their configuration is received.

In the lifecycle of a servlet you can observe the following. As you move through the diagram, notice which line of the `HelloServlet` code runs at each step:

<iframe
  src="/interactive/computacion-2/semana-1/ciclo-vida-servlet/index.html"
  title="Servlet lifecycle: init, doGet and destroy"
  style={{ width: '100%', height: 880, border: 0 }}
  loading="lazy"
/>

- The servlet is loaded into the Web Container when a request is received.
- Then an instance of that servlet is created.
- The `init()` method is called to initialize the servlet.
- When a request is received, the `doGet()` or `doPost()` method is invoked depending on the type of request.
- Finally, when the servlet is no longer needed, the `destroy()` method is called to release resources.

10. Compile the project with Maven. In the terminal, run:

     ```bash
     mvn clean compile
     ```

11. Install the **Community Server Connectors** extension from the VS Code marketplace.

     ![Installing Community Server Connectors in VS Code](/img/computacion-2/tomcat-jakarta-vscode-2.png)

12. Click the **Servers** tab (bottom left), right-click **Community Server Connectors** and select **Create new server**.

     ![Creating a new server in VS Code](/img/computacion-2/tomcat-jakarta-vscode-3.png)

13. Select **Tomcat** and the installed version, then click **Finish**.
14. Package your web application by running:

     ```bash
     mvn clean package
     ```

15. Right-click the Tomcat server you created and select **Add deployment**.

     ![Adding a deployment in VS Code](/img/computacion-2/tomcat-jakarta-vscode-4.png)

16. Select the WAR file generated in `target/my-web-app.war`.
17. Start the Tomcat server by right-clicking the server and selecting **Start**.
18. Open your browser and go to `http://localhost:8080/my-web-app/` to see your application running.
