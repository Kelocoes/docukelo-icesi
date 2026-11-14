---
sidebar_position: 4
description: "Despliega una aplicación React con Vite en Apache Tomcat del servidor de las salas: base de la URL, web.xml para las rutas, variables de entorno, archivo .war y copia a webapps."
---

# Despliegue de la aplicación en Tomcat

Tu app funciona en `localhost:5173`, pero solo tú la ves. Para que otros la usen, hay que **publicarla** en un servidor. En el curso usarás el **Tomcat** del computador remoto de las salas: el mismo tipo de servidor donde ya desplegaste tu backend, ahora sirviendo archivos estáticos.

Un build de Vite produce solo **HTML, CSS y JavaScript**. Tomcat no ejecuta React: lo único que hace es **entregar esos archivos** al navegador, y React corre allá. Recorre los pasos completos antes de hacerlos:

<InteractiveFrame
  src="/interactive/computacion-2/semana-16/despliegue-tomcat/index.html"
  title="Pasos para desplegar una aplicación de Vite en Tomcat: build, copiar WEB-INF, crear el .war, copiarlo a webapps y abrir la URL"
  height={760}
/>

## Paso 1: decidir en qué ruta vivirá la app

Tomcat publica cada aplicación en una **subruta** que sale del nombre del `.war`. Por ejemplo, `iaslab#compu2#apellido.war` queda en `http://IP:8080/iaslab/compu2/apellido/`. Esto afecta a dos cosas de tu proyecto, y olvidarlo es la causa más común de una pantalla en blanco:

1. **Los archivos de `dist/`** (JavaScript y CSS) se piden con rutas que empiezan por `/assets/...`. En la raíz del servidor eso funciona, pero en una subruta Tomcat no los encuentra. Vite lo resuelve con `base`.
2. **React Router** cree que su raíz es `/`, pero la app vive en `/iaslab/compu2/apellido/`. Se le indica con `basename`.

```js title="vite.config.js" showLineNumbers
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/iaslab/compu2/apellido/", // la misma ruta que el nombre del .war
});
```

```jsx title="src/router.jsx (al final)" showLineNumbers
const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL, // Vite lo rellena con el valor de base
});
```

`import.meta.env.BASE_URL` toma el valor de `base`, así que cambias la ruta en un solo lugar. En desarrollo vale `/` y no estorba.

:::tip
Con un `base` que no es `/`, el servidor de desarrollo también sirve la app en esa ruta (`localhost:5173/iaslab/compu2/apellido/`). Es una buena forma de probar antes de desplegar.
:::

## Paso 2: configurar el enrutamiento (`web.xml`)

Las aplicaciones de una sola página (SPA) manejan las rutas **en el navegador**. Si el usuario recarga la página en `/dashboard`, el navegador le pide esa ruta a Tomcat. Tomcat busca un archivo llamado `dashboard`, no lo encuentra y responde **404 Not Found**.

Activa y desactiva el `web.xml` en la pieza y mira qué pasa al recargar una ruta:

<InteractiveFrame
  src="/interactive/computacion-2/semana-16/spa-404-tomcat/index.html"
  title="Qué pasa al recargar una ruta de la aplicación React desplegada en Tomcat, con y sin web.xml"
  height={720}
/>

La solución es decirle a Tomcat que, cuando no encuentre algo, entregue el `index.html`: así React arranca, lee la URL y su router dibuja la página correcta.

1. En la raíz del proyecto, crea una carpeta llamada `WEB-INF`.
2. Dentro, crea el archivo `web.xml`:

```xml title="WEB-INF/web.xml" showLineNumbers
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
                      http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
  version="4.0">

    <display-name>React App Deployment</display-name>

    <!-- Si no encuentra el archivo, entrega index.html y deja que React Router decida -->
    <error-page>
        <error-code>404</error-code>
        <location>/index.html</location>
    </error-page>

</web-app>
```

:::note[¿Dónde queda `WEB-INF` en tu proyecto?]
Créala en la raíz del proyecto (junto a `package.json`), no dentro de `src/`. En el paso 4 la copiarás dentro de `dist/`, que es lo que se empaqueta.
:::

## Paso 3: variables de entorno de producción

Cuando generes la versión de producción, la app debe llamar al backend real, no a `localhost`. Vite carga `.env.production` al ejecutar `npm run build`:

```env title=".env.production"
VITE_API_URL=http://192.168.131.110:8081/compunet2-2026/rest
```

Recuerda: solo las variables que empiezan por `VITE_` llegan al código. Y el valor queda **escrito dentro del JavaScript generado** en el momento del build: si cambia la dirección del backend, hay que volver a construir.

## Paso 4: construir y empaquetar el `.war`

Tomcat no despliega carpetas sueltas de forma estándar, sino archivos **`.war`** (_Web Application Archive_): un zip con otra extensión.

1. **Generar la carpeta de producción:**

   ```bash title="Terminal"
   npm run build
   ```

   Se crea `dist/` con los archivos optimizados.

2. **Incluir la configuración de Tomcat:** copia `WEB-INF` dentro de `dist/`.

   ```bash title="Terminal"
   cp -r WEB-INF dist/
   ```

3. **Crear el `.war`:** entra a `dist/` y comprime su **contenido** (no la carpeta).

   ```bash title="Terminal"
   cd dist
   zip -r iaslab#compu2#apellido.war *
   ```

El **nombre del archivo es la URL**. Tomcat usa el símbolo `#` para separar niveles de carpetas:

| Nombre del `.war` | URL de acceso |
| :-- | :-- |
| `myapp.war` | `http://ip:8080/myapp` |
| `iaslab#compu2#apellido.war` | `http://ip:8080/iaslab/compu2/apellido` |

:::warning[El nombre y el `base` deben coincidir]
Si el `.war` se llama `iaslab#compu2#perez.war`, el `base` de Vite tiene que ser `/iaslab/compu2/perez/`. Si no coinciden, la página carga en blanco porque el navegador pide los archivos en otra ruta.
:::

:::tip[Sin `zip` en Windows]
Si tu terminal no tiene `zip`, comprime el contenido de `dist/` con el explorador (selecciona todo, _Enviar a → Carpeta comprimida_) y cambia la extensión de `.zip` a `.war`. O usa `jar cf iaslab#compu2#apellido.war -C dist .` si tienes el JDK instalado.
:::

## Paso 5: copiar al servidor

Tomcat vigila su carpeta `webapps/`. Copiar el `.war` allí es todo el despliegue.

1. Localiza `webapps/` en la instalación de Tomcat del servidor de las salas.
2. Copia el archivo (por ejemplo, con `scp`, o con el explorador de archivos remoto que usas en clase):

   ```bash title="Terminal"
   scp "iaslab#compu2#apellido.war" usuario@servidor:/opt/tomcat/webapps/
   ```

3. En unos segundos Tomcat lo detecta, lo descomprime y la aplicación queda publicada. **No hace falta reiniciar Tomcat.**

Para **actualizar** una versión, repite los pasos 4 y 5 con el mismo nombre de archivo: Tomcat reemplaza la aplicación anterior.

## Paso 6: probar

Abre `http://IP:8080/iaslab/compu2/apellido/` en el navegador. Si algo falla, revisa en este orden:

| Síntoma | Causa probable |
| :-- | :-- |
| Pantalla en blanco y errores 404 de `.js` en la consola | `base` de Vite distinto del nombre del `.war` |
| Carga el inicio, pero al recargar `/dashboard` sale 404 de Tomcat | Falta `WEB-INF/web.xml` **dentro** del `.war` |
| Las rutas del router no coinciden o salen en blanco | Falta `basename` en `createBrowserRouter` |
| La app carga pero las peticiones fallan | `.env.production` apunta a otra dirección, o el backend no permite el origen (CORS) |
| Sigue viéndose la versión anterior | Caché del navegador: recarga forzada (`Ctrl + Shift + R`) |

## Checklist de despliegue

- [ ] `base` en `vite.config.js` igual al nombre del `.war` (con `#` convertido en `/`).
- [ ] `basename: import.meta.env.BASE_URL` en el router.
- [ ] `WEB-INF/web.xml` con la regla del 404, copiada dentro de `dist/`.
- [ ] `.env.production` con la URL real del backend.
- [ ] `.war` creado con el **contenido** de `dist/`.
- [ ] Copiado a `webapps/` y probado en el navegador, incluyendo recargar una ruta interna.

## Recursos

- [Vite: despliegue de un sitio estático](https://vite.dev/guide/static-deploy)
- [Vite: la opción `base`](https://vite.dev/config/shared-options#base)
- [React Router: `basename` en `createBrowserRouter`](https://reactrouter.com/api/data-routers/createBrowserRouter)
- [Apache Tomcat: despliegue de aplicaciones](https://tomcat.apache.org/tomcat-10.1-doc/deployer-howto.html)
