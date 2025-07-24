---
sidebar_position: 5
---

# Servidor Tomcat

Esta pequeña documentación, es para que puedas ubicarte en el uso inicial de un servidor Tomcat, ya que es una herramienta muy útil para el desarrollo de aplicaciones web en Java.

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
