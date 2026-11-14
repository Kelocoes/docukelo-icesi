---
sidebar_position: 4
description: "Deploy a React app built with Vite to the lab server's Apache Tomcat: URL base, web.xml for the routes, environment variables, the .war file and copying it to webapps."
---

# Deploying the application on Tomcat

Your app works on `localhost:5173`, but only you can see it. For others to use it, you have to **publish** it on a server. In the course you will use the **Tomcat** on the remote lab computer: the same kind of server where you already deployed your backend, now serving static files.

A Vite build produces only **HTML, CSS and JavaScript**. Tomcat does not run React: all it does is **deliver those files** to the browser, and React runs there. Walk through the whole process before doing it:

:::note[Interactive graphics]
The interactive graphics in this chapter are shown in Spanish.
:::

<InteractiveFrame
  src="/interactive/computacion-2/semana-16/despliegue-tomcat/index.html"
  title="Steps to deploy a Vite application on Tomcat: build, copy WEB-INF, create the .war, copy it to webapps and open the URL"
  height={760}
/>

## Step 1: decide which path the app will live on

Tomcat publishes each application on a **subpath** that comes from the name of the `.war`. For example, `iaslab#compu2#apellido.war` ends up at `http://IP:8080/iaslab/compu2/apellido/`. This affects two things in your project, and forgetting it is the most common cause of a blank screen:

1. **The files in `dist/`** (JavaScript and CSS) are requested with paths that start with `/assets/...`. At the root of the server that works, but under a subpath Tomcat does not find them. Vite solves it with `base`.
2. **React Router** thinks its root is `/`, but the app lives at `/iaslab/compu2/apellido/`. You tell it with `basename`.

```js title="vite.config.js" showLineNumbers
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/iaslab/compu2/apellido/", // the same path as the .war name
});
```

```jsx title="src/router.jsx (at the end)" showLineNumbers
const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL, // Vite fills it in with the value of base
});
```

`import.meta.env.BASE_URL` takes the value of `base`, so you change the path in a single place. In development it is `/` and gets in the way of nothing.

:::tip
With a `base` that is not `/`, the development server also serves the app on that path (`localhost:5173/iaslab/compu2/apellido/`). It is a good way to test before deploying.
:::

## Step 2: configure routing (`web.xml`)

Single-page applications (SPAs) handle routes **in the browser**. If the user reloads the page at `/dashboard`, the browser asks Tomcat for that path. Tomcat looks for a file called `dashboard`, does not find it and answers **404 Not Found**.

Turn the `web.xml` on and off in the piece and see what happens when you reload a route:

<InteractiveFrame
  src="/interactive/computacion-2/semana-16/spa-404-tomcat/index.html"
  title="What happens when a route of the React application deployed on Tomcat is reloaded, with and without web.xml"
  height={720}
/>

The solution is to tell Tomcat that, when it cannot find something, it should deliver `index.html`: that way React starts, reads the URL and its router draws the right page.

1. In the project root, create a folder called `WEB-INF`.
2. Inside it, create the `web.xml` file:

```xml title="WEB-INF/web.xml" showLineNumbers
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
                      http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
  version="4.0">

    <display-name>React App Deployment</display-name>

    <!-- If it does not find the file, deliver index.html and let React Router decide -->
    <error-page>
        <error-code>404</error-code>
        <location>/index.html</location>
    </error-page>

</web-app>
```

:::note[Where does `WEB-INF` go in your project?]
Create it in the project root (next to `package.json`), not inside `src/`. In step 4 you will copy it into `dist/`, which is what gets packaged.
:::

## Step 3: production environment variables

When you generate the production version, the app must call the real backend, not `localhost`. Vite loads `.env.production` when you run `npm run build`:

```env title=".env.production"
VITE_API_URL=http://192.168.131.110:8081/compunet2-2026/rest
```

Remember: only variables that start with `VITE_` reach the code. And the value is **written inside the generated JavaScript** at build time: if the backend address changes, you have to build again.

## Step 4: build and package the `.war`

Tomcat does not deploy loose folders in the standard way, but **`.war`** files (_Web Application Archive_): a zip with a different extension.

1. **Generate the production folder:**

   ```bash title="Terminal"
   npm run build
   ```

   This creates `dist/` with the optimized files.

2. **Include the Tomcat configuration:** copy `WEB-INF` into `dist/`.

   ```bash title="Terminal"
   cp -r WEB-INF dist/
   ```

3. **Create the `.war`:** enter `dist/` and compress its **contents** (not the folder).

   ```bash title="Terminal"
   cd dist
   zip -r iaslab#compu2#apellido.war *
   ```

The **file name is the URL**. Tomcat uses the `#` symbol to separate folder levels:

| `.war` name | Access URL |
| :-- | :-- |
| `myapp.war` | `http://ip:8080/myapp` |
| `iaslab#compu2#apellido.war` | `http://ip:8080/iaslab/compu2/apellido` |

:::warning[The name and the `base` must match]
If the `.war` is called `iaslab#compu2#perez.war`, Vite's `base` has to be `/iaslab/compu2/perez/`. If they do not match, the page loads blank because the browser requests the files from another path.
:::

:::tip[No `zip` on Windows]
If your terminal does not have `zip`, compress the contents of `dist/` with the file explorer (select everything, _Send to → Compressed folder_) and change the extension from `.zip` to `.war`. Or use `jar cf iaslab#compu2#apellido.war -C dist .` if you have the JDK installed.
:::

## Step 5: copy to the server

Tomcat watches its `webapps/` folder. Copying the `.war` there is the whole deployment.

1. Locate `webapps/` in the Tomcat installation on the lab server.
2. Copy the file (for example, with `scp`, or with the remote file explorer you use in class):

   ```bash title="Terminal"
   scp "iaslab#compu2#apellido.war" usuario@servidor:/opt/tomcat/webapps/
   ```

3. Within a few seconds Tomcat detects it, unpacks it and the application is published. **There is no need to restart Tomcat.**

To **update** a version, repeat steps 4 and 5 with the same file name: Tomcat replaces the previous application.

## Step 6: test

Open `http://IP:8080/iaslab/compu2/apellido/` in the browser. If something fails, check in this order:

| Symptom | Likely cause |
| :-- | :-- |
| Blank screen and 404 errors for `.js` files in the console | Vite's `base` differs from the `.war` name |
| The home page loads, but reloading `/dashboard` gives a Tomcat 404 | `WEB-INF/web.xml` is missing **inside** the `.war` |
| The router's routes do not match or show blank | `basename` is missing in `createBrowserRouter` |
| The app loads but the requests fail | `.env.production` points to another address, or the backend does not allow the origin (CORS) |
| The previous version is still showing | Browser cache: hard reload (`Ctrl + Shift + R`) |

## Deployment checklist

- [ ] `base` in `vite.config.js` equal to the `.war` name (with `#` turned into `/`).
- [ ] `basename: import.meta.env.BASE_URL` in the router.
- [ ] `WEB-INF/web.xml` with the 404 rule, copied inside `dist/`.
- [ ] `.env.production` with the real backend URL.
- [ ] `.war` created with the **contents** of `dist/`.
- [ ] Copied to `webapps/` and tested in the browser, including reloading an internal route.

## Resources

- [Vite: deploying a static site](https://vite.dev/guide/static-deploy)
- [Vite: the `base` option](https://vite.dev/config/shared-options#base)
- [React Router: `basename` in `createBrowserRouter`](https://reactrouter.com/api/data-routers/createBrowserRouter)
- [Apache Tomcat: application deployment](https://tomcat.apache.org/tomcat-10.1-doc/deployer-howto.html)
