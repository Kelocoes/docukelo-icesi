---
sidebar_position: 2
---


# Despliegue de la Aplicación en Tomcat

Este manual describe el proceso paso a paso para desplegar una aplicación de Frontend (desarrollada con React y Vite) en un servidor de aplicaciones Apache Tomcat.

---

## Paso 1: Configurar el enrutamiento (web.xml)

Las aplicaciones SPA (Single Page Applications) como React manejan el enrutamiento en el navegador (lado del cliente). Si un usuario recarga la página en una ruta específica (ej. `/dashboard`), Tomcat buscará una carpeta física llamada `dashboard` en el servidor y, al no encontrarla, devolverá un error **404 Not Found**.

Para solucionar esto, debemos configurar Tomcat para que redirija todas las peticiones no encontradas al `index.html`, permitiendo que React Router tome el control.

1. En la raíz de tu proyecto, crea una carpeta llamada `WEB-INF`.
2. Dentro de `WEB-INF`, crea un archivo llamado `web.xml` con el siguiente contenido:

```xml title="WEB-INF/web.xml"
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
                      http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
  version="4.0">

    <display-name>React App Deployment</display-name>

    <!-- Redirigir errores 404 al index.html para soporte de SPA Routing -->
    <error-page>
        <error-code>404</error-code>
        <location>/index.html</location>
    </error-page>

</web-app> 
```

---

## Paso 2: Configurar Variables de Entorno

Antes de generar la versión de producción, asegúrate de que las variables de entorno apunten a la dirección IP o dominio real de tu backend.

Edita tu archivo `.env.production` (o `.env`):

```env
VITE_API_URL=http://192.168.131.110:8081/compunet2-2026/rest
```

> **Nota:** Recuerda que en Vite, las variables deben comenzar con el prefijo `VITE_` para que sean accesibles en el código.

---

## Paso 3: Construcción y Empaquetado (.war)

Tomcat no despliega carpetas sueltas de forma estándar, sino archivos **.war** (Web Application Archive). Sigue estos pasos en tu terminal:

1. **Generar la carpeta de producción:**
   ```bash
   npm run build
   ```
   Esto creará una carpeta llamada `dist/` con los archivos optimizados.

2. **Incluir la configuración de Tomcat:**
   Copia la carpeta `WEB-INF` que creamos en el Paso 1 dentro de la carpeta `dist/`.
   ```bash
   cp -r WEB-INF dist/
   ```

3. **Crear el archivo WAR:**
   Entra a la carpeta `dist/` y comprime todo su contenido. 

   **Convención de Nombres:** 
   El nombre del archivo .war definirá la URL de acceso. Tomcat usa el símbolo `#` para separar niveles de carpetas.
   *   `myapp.war` -> `http://ip:8080/myapp`
   *   `iaslab#compu2#profe.war` -> `http://ip:8080/iaslab/compu2/profe`

   ```bash
   cd dist
   zip -r iaslab#compu2#miapellido.war *
   ```

---

## Paso 4: Despliegue en el Servidor

Una vez tengas tu archivo `.war`, debes moverlo al directorio donde Tomcat busca aplicaciones para desplegar.

1. Localiza la carpeta `webapps/` en tu instalación de Tomcat.
2. Copia el archivo generado:
   ```bash
   # Ejemplo en Linux/macOS
   cp iaslab#compu2#miapellido.war /opt/tomcat/webapps/
   ```
3. Tomcat detectará el archivo automáticamente, lo descomprimirá y la aplicación estará disponible en cuestión de segundos.
