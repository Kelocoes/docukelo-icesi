---
sidebar_position: 5
---

# Tomcat Server

This documentation provides an initial overview of using an Apache Tomcat server, a vital tool for Java web application development.

## What is Apache Tomcat?

Apache Tomcat is an open-source web server developed by the Apache Software Foundation. It is designed to execute Java-based web applications, specifically Servlets and JavaServer Pages (JSP). Tomcat acts as a Servlet container, managing the execution of these components and facilitating communication between the client (web browser) and the web application.

Tomcat is widely used in web development and deployment due to its ease of use, flexibility, and compatibility with Java EE specifications. It provides a robust environment to run dynamic web applications, handling HTTP requests, user sessions, security, and other essential modern web application features.

## Structure of Apache Tomcat

The general directory structure of Apache Tomcat is as follows:

```
apache-tomcat/
├── bin/
├── conf/
├── lib/
├── logs/
├── temp/
├── webapps/
├── work/
└── README.txt
```

- **bin/**: Contains server startup and shutdown scripts, as well as utilities (e.g., `startup.sh`, `catalina.bat`).
- **conf/**: Server configuration files, including `server.xml` and `web.xml`.
- **lib/**: Necessary Java libraries (`.jar` files) required by Tomcat.
- **logs/**: Log files for activity monitoring and debugging.
- **temp/**: Temporary files created during runtime.
- **webapps/**: Target folder where web applications (`.war` files or unpacked folders) are deployed.
- **work/**: Temporary files generated during JSP compilation and execution.
- **README.txt**: Information file regarding Tomcat usage.

## What is Catalina?

Catalina is Apache Tomcat's Servlet container. It handles HTTP requests and manages the lifecycle of Servlets and JSPs (initialization, execution, destruction).

## Basic Tomcat Commands

```bash
# Start server
./bin/startup.sh

# Stop server
./bin/shutdown.sh

# Check server status
./bin/catalina.sh status

# View server logs in real time
tail -f logs/catalina.out
```

## How to Configure Tomcat to Serve Your Application

1. **Create a WAR File**: Package your web application into a `.war` file using Maven or Gradle.
2. **Place the WAR File in `webapps/`**: Copy your `.war` file to Tomcat's `webapps/` folder for auto-deployment.
3. **Configure `server.xml`**: Edit `conf/server.xml` if custom ports, contexts, or resources are required.
4. **Start the Server**: Run `./bin/startup.sh`. Your app will be accessible at `http://localhost:8080/your-app`.

---

## Self-Assessment Quiz

<Quiz id="comp2-tomcat-quiz">
  <Question title="What is the main role of Apache Tomcat in web application development?">
    <Option>To act as a Type-1 hypervisor for Linux virtual machines.</Option>
    <Option correct>To act as a servlet container executing Java components such as Servlets and JSPs.</Option>
    <Option>To compile C++ code directly into native binaries.</Option>
    <Option>To replace relational PostgreSQL databases in production.</Option>
  </Question>
  <Question title="In which directory of Tomcat's structure are .war files placed for automatic deployment?">
    <Option>bin/</Option>
    <Option>conf/</Option>
    <Option correct>webapps/</Option>
    <Option>logs/</Option>
  </Question>
  <Question title="Which Tomcat folder contains executable startup and shutdown scripts such as startup.sh or catalina.bat?">
    <Option correct>bin/</Option>
    <Option>temp/</Option>
    <Option>work/</Option>
    <Option>lib/</Option>
  </Question>
  <Question title="What is 'Catalina' within the architecture of Apache Tomcat?">
    <Option>The graphical UI library for React frontend.</Option>
    <Option correct>The Servlet container responsible for handling HTTP requests and managing the lifecycle of Servlets and JSPs.</Option>
    <Option>The static PDF document rendering engine.</Option>
    <Option>A log file reserved for operating system fatal errors.</Option>
  </Question>
  <Question title="Which configuration file located in conf/ allows configuring server ports, contexts, and resources?">
    <Option>webapps.xml</Option>
    <Option>catalina.out</Option>
    <Option correct>server.xml</Option>
    <Option>startup.sh</Option>
  </Question>
  <Question title="Which terminal command is used to start the Tomcat server on Unix/Linux systems?">
    <Option>./bin/catalina.sh status</Option>
    <Option correct>./bin/startup.sh</Option>
    <Option>./bin/shutdown.sh</Option>
    <Option>tail -f webapps/start</Option>
  </Question>
  <Question title="Which command allows viewing Tomcat's real-time activity logs?">
    <Option>./bin/startup.sh --logs</Option>
    <Option>cat conf/server.xml</Option>
    <Option correct>tail -f logs/catalina.out</Option>
    <Option>docker logs tomcat-app</Option>
  </Question>
  <Question title="Which command is used to stop an active Tomcat server?">
    <Option correct>./bin/shutdown.sh</Option>
    <Option>./bin/stop.bat</Option>
    <Option>tail -f logs/shutdown</Option>
    <Option>rm -rf webapps/</Option>
  </Question>
  <Question title="What type of packaged file is commonly generated with Maven or Gradle for deploying web apps to Tomcat?">
    <Option>.jar file with embedded web server.</Option>
    <Option correct>.war file (Web Application Archive).</Option>
    <Option>Windows executable .exe file.</Option>
    <Option>Vector graphics .svg file.</Option>
  </Question>
  <Question title="What is the default HTTP port used in Tomcat test URLs (http://localhost:8080/your-app)?">
    <Option>80</Option>
    <Option>443</Option>
    <Option correct>8080</Option>
    <Option>5432</Option>
  </Question>
</Quiz>
