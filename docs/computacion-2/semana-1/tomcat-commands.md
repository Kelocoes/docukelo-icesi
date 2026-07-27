---
sidebar_position: 5
---

# Servidor Tomcat

Esta pequeña documentación, es para que puedas ubicarte en el uso inicial de un servidor Tomcat, ya que es una herramienta muy útil para el desarrollo de aplicaciones web en Java.

## ¿Qué es Apache Tomcat?

Apache Tomcat es un servidor web de código abierto desarrollado por la Apache Software Foundation. Está diseñado para ejecutar aplicaciones web basadas en Java, específicamente servlets y JavaServer Pages (JSP). Tomcat actúa como un contenedor de servlets, gestionando la ejecución de estos componentes y facilitando la comunicación entre el cliente (navegador web) y la aplicación web.

Tomcat es ampliamente utilizado en el desarrollo y despliegue de aplicaciones web debido a su facilidad de uso, flexibilidad y compatibilidad con las especificaciones de Java EE. Proporciona un entorno robusto para ejecutar aplicaciones web dinámicas, manejando solicitudes HTTP, sesiones de usuario, seguridad y otras funcionalidades esenciales para aplicaciones web modernas.

## Estructura de Apache Tomcat

La estructura general de un Apache Tomcat es la siguiente:

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

Vamos paso a paso explicando para que es cada uno de las carpetas y lo que podrás encontrar en ellas:

- **bin/**: Contiene los scripts de inicio y parada del servidor, así como otros utilitarios. Aquí encontrarás archivos como `startup.sh` o `catalina.bat` para iniciar el servidor.
- **conf/**: Aquí se encuentran los archivos de configuración del servidor, como `server.xml`, `web.xml`, y otros. Estos archivos son cruciales para definir cómo se comporta el servidor y cómo se configuran las aplicaciones web.
- **lib/**: Contiene las bibliotecas Java necesarias para que Tomcat funcione. Aquí encontrarás archivos `.jar` que son esenciales para el servidor.
- **logs/**: Aquí se almacenan los registros del servidor, lo que te permite ver la actividad del servidor y depurar problemas.
- **temp/**: Esta carpeta se utiliza para almacenar archivos temporales que el servidor necesita durante su funcionamiento.
- **webapps/**: Aquí es donde se despliegan las aplicaciones web. Puedes colocar tus archivos `.war` o carpetas de aplicaciones aquí para que Tomcat los sirva.
- **work/**: Esta carpeta contiene archivos temporales generados por el servidor durante la ejecución de las aplicaciones web. Aquí se almacenan los archivos compilados de JSP y otros recursos temporales.
- **README.txt**: Un archivo de texto que proporciona información básica sobre Tomcat y cómo usarlo.

## ¿Qué es Catalina?

Catalina es el contenedor de servlets de Apache Tomcat. Es responsable de manejar las solicitudes HTTP y ejecutar los servlets y JSPs. Catalina se encarga de la gestión del ciclo de vida de los servlets, incluyendo su inicialización, manejo de solicitudes y destrucción.

## Comandos básicos de Tomcat

Para interactuar con Tomcat, puedes usar los siguientes comandos desde la terminal:

```bash
# Iniciar el servidor
./bin/startup.sh
```

```bash
# Detener el servidor
./bin/shutdown.sh
```

```bash
# Ver el estado del servidor
./bin/catalina.sh status
```

```bash
# Ver los logs del servidor
tail -f logs/catalina.out
```
Estos comandos te permiten iniciar, detener y monitorear el estado del servidor Tomcat, así como ver los registros de actividad.

## ¿Cómo hago para configurar Tomcat para que sirva mi aplicación?

Para configurar Tomcat y que sirva tu aplicación, sigue estos pasos:

1. **Crea un archivo WAR**: Empaqueta tu aplicación web en un archivo `.war`. Puedes hacer esto usando herramientas como Maven o Gradle, o manualmente si tienes los archivos necesarios.
2. **Coloca el archivo WAR en la carpeta `webapps/`**: Copia tu archivo `.war` a la carpeta `webapps/` de tu instalación de Tomcat. Tomcat detectará automáticamente el archivo y desplegará la aplicación.
3. **Configura el archivo `server.xml`**: Si necesitas configurar puertos, contextos o recursos específicos, edita el archivo `conf/server.xml`. Aquí puedes definir el contexto de tu aplicación y otros parámetros.
4. **Inicia el servidor**: Usa el comando `./bin/startup.sh` para iniciar Tomcat. Si todo está configurado correctamente, tu aplicación debería estar disponible en `http://localhost:8080/tu-aplicacion`.

---

## Cuestionario de Autoevaluación

<Quiz id="comp2-tomcat-quiz">
  <Question title="¿Cuál es la función principal de Apache Tomcat en el desarrollo de aplicaciones web?">
    <Option>Servir como hipervisor tipo 1 para máquinas virtuales Linux.</Option>
    <Option correct>Actuar como un contenedor de servlets que ejecuta componentes Java como Servlets y JSPs.</Option>
    <Option>Compilar código C++ directamente en binarios nativos.</Option>
    <Option>Remplazar la base de datos relacional PostgreSQL en producción.</Option>
  </Question>
  <Question title="¿En qué carpeta de la estructura de Tomcat se colocan los archivos .war para su despliegue automático?">
    <Option>bin/</Option>
    <Option>conf/</Option>
    <Option correct>webapps/</Option>
    <Option>logs/</Option>
  </Question>
  <Question title="¿Qué carpeta de Tomcat contiene los scripts ejecutables de inicio y parada como startup.sh o catalina.bat?">
    <Option correct>bin/</Option>
    <Option>temp/</Option>
    <Option>work/</Option>
    <Option>lib/</Option>
  </Question>
  <Question title="¿Qué es 'Catalina' dentro de la arquitectura de Apache Tomcat?">
    <Option>Es la biblioteca de interfaz gráfica para el frontend en React.</Option>
    <Option correct>Es el contenedor de servlets responsable de manejar las solicitudes HTTP y el ciclo de vida de servlets y JSPs.</Option>
    <Option>Es el motor de renderizado de archivos PDF estáticos.</Option>
    <Option>Es un archivo de registro para errores fatales del sistema operativo.</Option>
  </Question>
  <Question title="¿Qué archivo ubicado en conf/ permite configurar puertos, contextos y recursos del servidor Tomcat?">
    <Option>webapps.xml</Option>
    <Option>catalina.out</Option>
    <Option correct>server.xml</Option>
    <Option>startup.sh</Option>
  </Question>
  <Question title="¿Qué comando de terminal se utiliza para iniciar el servidor Tomcat en sistemas tipo Unix/Linux?">
    <Option>./bin/catalina.sh status</Option>
    <Option correct>./bin/startup.sh</Option>
    <Option>./bin/shutdown.sh</Option>
    <Option>tail -f webapps/start</Option>
  </Question>
  <Question title="¿Qué comando permite visualizar en tiempo real los registros de actividad (logs) de Tomcat?">
    <Option>./bin/startup.sh --logs</Option>
    <Option>cat conf/server.xml</Option>
    <Option correct>tail -f logs/catalina.out</Option>
    <Option>docker logs tomcat-app</Option>
  </Question>
  <Question title="¿Qué comando se utiliza para detener la ejecución de un servidor Tomcat activo?">
    <Option correct>./bin/shutdown.sh</Option>
    <Option>./bin/stop.bat</Option>
    <Option>tail -f logs/shutdown</Option>
    <Option>rm -rf webapps/</Option>
  </Question>
  <Question title="¿Qué tipo de archivo empaquetado se genera comúnmente con Maven o Gradle para desplegar aplicaciones en Tomcat?">
    <Option>Archivo .jar con servidor incrustado.</Option>
    <Option correct>Archivo .war (Web Application Archive).</Option>
    <Option>Archivo .exe ejecutable de Windows.</Option>
    <Option>Archivo .svg vectorial de imágenes.</Option>
  </Question>
  <Question title="¿Cuál es el puerto HTTP por defecto utilizado en la URL de prueba de Tomcat (http://localhost:8080/tu-aplicacion)?">
    <Option>80</Option>
    <Option>443</Option>
    <Option correct>8080</Option>
    <Option>5432</Option>
  </Question>
</Quiz>
