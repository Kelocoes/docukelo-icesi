---
sidebar_position: 2
description: "Despliega una aplicación Next.js en Vercel: crear el proyecto, variables de entorno, un flujo de GitHub Actions que ejecuta las pruebas E2E antes de desplegar, previews por pull request y producción."
---

# Despliegue en Vercel con GitHub Actions

Hasta ahora tu aplicación vive en `localhost`. **Desplegar** es ponerla en un servidor accesible desde internet, con una dirección pública, en un entorno de **producción**. [Vercel](https://vercel.com) es la plataforma de la empresa que mantiene Next.js: entiende un proyecto de Next.js sin configuración, lo construye, lo publica y le da una URL con HTTPS.

En este documento hacemos tres cosas: publicar la aplicación, configurarla con variables de entorno y **automatizar el despliegue** con GitHub Actions para que las pruebas E2E del [documento anterior](./01-pruebas-e2e-playwright.md) decidan si un cambio llega a producción.

---

## 1. CI/CD y las dos formas de desplegar

Dos siglas que verás siempre juntas:

- **CI (integración continua):** en cada cambio, una máquina limpia instala el proyecto y ejecuta las pruebas. Es lo que hicimos al final del documento de pruebas.
- **CD (entrega continua):** si todo pasó, el cambio se publica automáticamente, sin que nadie suba archivos a mano.

Sigue un cambio de principio a fin. Elige el evento y activa «Fallan las pruebas» para ver qué se bloquea:

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/flujo-cicd-vercel/index.html"
  title="El camino de un cambio desde el push hasta el despliegue en Vercel: GitHub Actions ejecuta las pruebas E2E y solo si pasan se despliega, a una URL de preview o a producción"
  height={480}
/>

Hay dos formas de conectar GitHub con Vercel:

| | **Integración de Git** | **GitHub Actions + CLI de Vercel** |
| :--- | :--- | :--- |
| **Cómo se configura** | Importas el repositorio en Vercel y listo. | Escribes un flujo (`.github/workflows`) con la CLI de Vercel. |
| **Dónde se construye** | En los servidores de Vercel. | En la máquina de GitHub Actions. |
| **Preview por pull request** | Automático, con comentario en el PR. | Lo creas tú en el flujo. |
| **Ejecuta tus pruebas** | **No.** | **Sí**, y puedes bloquear el despliegue si fallan. |

:::note[¿Necesito GitHub Actions para desplegar?]
No. Vercel documenta que, con la integración de Git, la mayoría de los equipos no necesita ningún flujo: cada pull request recibe su URL de preview, los despliegues son inmutables y volver a una versión anterior es instantáneo. Se agrega GitHub Actions cuando hay que **ejecutar pruebas**, análisis de seguridad, presupuestos de rendimiento o aprobaciones antes de desplegar. Como queremos que las pruebas E2E **decidan**, en este curso usamos las dos cosas: primero la integración para entender el proyecto (sección 2) y luego el flujo con la CLI (sección 4).
:::

---

## 2. Crear el proyecto en Vercel

<StepByStep>
  <Step number="1" title="Crea la cuenta">
    Entra a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub. El plan gratuito (Hobby) alcanza para el curso.
  </Step>
  <Step number="2" title="Importa el repositorio">
    Crea un proyecto nuevo (**Add New > Project**) y elige el repositorio de tu aplicación. Vercel te pedirá permiso para leerlo.
  </Step>
  <Step number="3" title="Revisa la configuración">
    Vercel detecta que es Next.js y propone los comandos de instalación y de build. Si el proyecto está dentro de una subcarpeta del repositorio, indícala en **Root Directory**.
  </Step>
  <Step number="4" title="Agrega las variables de entorno">
    Antes del primer despliegue, agrega las que la aplicación necesita (por ejemplo `API_URL`). Las explicamos en la sección 3.
  </Step>
  <Step number="5" title="Despliega">
    Pulsa **Deploy**. Cuando termina, Vercel te da una URL como `https://tu-app.vercel.app`.
  </Step>
</StepByStep>

Desde ese momento, cada `push` a la rama principal crea un despliegue de **producción** y cada `push` a otra rama o pull request crea un despliegue de **preview** con su propia URL. Los despliegues no se sobrescriben: se conservan, y volver a uno anterior (*rollback*) solo mueve un puntero, no reconstruye nada.

---

## 3. Variables de entorno

Tu aplicación necesita valores que **cambian según dónde corre** y que no deben estar en el código: la dirección del backend (`API_URL`), claves, el modo de la aplicación. Vercel las guarda por proyecto y por **entorno**:

| Entorno | Cuándo se usa |
| :--- | :--- |
| **Production** | Despliegues desde la rama de producción (normalmente `main`). |
| **Preview** | Despliegues de cualquier otra rama o pull request. |
| **Development** | Cuando trabajas en tu computador. Se descargan con `vercel env pull`. |

Elige de dónde viene el cambio y mira qué entorno usa Vercel y con qué valores:

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/entornos-vercel/index.html"
  title="Los tres entornos de Vercel, Development, Preview y Production, y qué valor de la variable API_URL usa cada uno según de dónde proviene el cambio"
  height={520}
/>

Lo que debes tener presente:

- **Un cambio en una variable solo afecta a los despliegues nuevos.** El despliegue que ya está publicado conserva los valores con que se construyó. Para ver el cambio, vuelve a desplegar.
- **`NEXT_PUBLIC_` se escribe en el código al construir.** Next.js reemplaza las variables que empiezan con `NEXT_PUBLIC_` por su valor dentro del código que va al navegador. Si la lees como `process.env[nombre]` (con un nombre dinámico), no se reemplaza y llega `undefined`.
- **Sin prefijo, la variable es solo del servidor.** `API_URL`, como la usamos en la [semana 14](../semana-14/01-sesiones-en-nextjs.md) para hablar con el backend desde la Server Action, nunca llega al navegador.
- **`localhost` no sirve en producción.** `API_URL` debe apuntar a un backend **desplegado**; en Vercel no existe tu `localhost:4000`.

```bash
vercel env pull .env.local   # descarga las variables de Development a tu computador
```

:::tip[La cookie de sesión y HTTPS]
En la semana 14 la cookie de sesión se marca `secure` cuando `NODE_ENV === 'production'`: solo viaja por HTTPS. Vercel sirve todo por HTTPS, así que funciona sin cambios; en `http://localhost` se permite en desarrollo.
:::

---

## 4. Un flujo de GitHub Actions: pruebas primero, despliegue después

Con la integración de Git, Vercel despliega **sin esperar** a tus pruebas. Para que las pruebas decidan, el despliegue lo hace GitHub Actions con la **CLI de Vercel**, y se desactiva el despliegue automático de la integración.

### 4.1. Preparar las credenciales

El flujo necesita tres datos para actuar en tu nombre. Recorre de dónde sale cada uno:

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/secretos-vercel/index.html"
  title="Las tres credenciales del flujo de despliegue en Vercel, de dónde sale cada una, y los cuatro comandos de la CLI que las usan"
  height={900}
/>

1. **Token:** créalo en la página de tokens de tu cuenta de Vercel (o con `vercel tokens add`) y cópialo: solo se muestra una vez.
2. **Los dos ids:** en la raíz de tu proyecto, vincúlalo con Vercel. Esto crea `.vercel/project.json` con `orgId` y `projectId`:

```bash
npm install --global vercel@latest
vercel login
vercel link
```

3. **Guárdalos en GitHub:** en el repositorio, **Settings > Secrets and variables > Actions > New repository secret**. Crea `VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID`.

:::warning[No subas `.vercel` ni el token]
La carpeta `.vercel/` es local: asegúrate de que está en `.gitignore`. El token da acceso a tu cuenta; si lo escribes en un archivo del repositorio, **revócalo** y crea otro.
:::

### 4.2. Desactivar el despliegue automático de la integración

Si dejas las dos cosas activas, cada cambio se despliega **dos veces**: una por la integración y otra por el flujo. En la raíz del proyecto crea `vercel.json`:

```json title="vercel.json" showLineNumbers
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "git": {
    "deploymentEnabled": false
  }
}
```

### 4.3. El flujo

Un solo archivo con tres trabajos: las pruebas, el despliegue de preview (en pull requests) y el despliegue de producción (en `push` a `main`). Los de despliegue declaran `needs: test`, así que **solo corren si las pruebas pasan**:

```yaml title=".github/workflows/deploy.yml" showLineNumbers
name: CI/CD
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    env:
      API_URL: ${{ vars.API_URL }}
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: lts/*
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test

  deploy-preview:
    needs: test
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: npm install --global vercel@latest
      - run: vercel pull --yes --environment=preview
      - run: vercel build
      - run: vercel deploy --prebuilt

  deploy-production:
    needs: test
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: npm install --global vercel@latest
      - run: vercel pull --yes --environment=production
      - run: vercel build --prod
      - run: vercel deploy --prebuilt --prod
```

| Pieza | Qué hace |
| :--- | :--- |
| `on` | Corre en cada `push` a `main` y en cada pull request hacia `main`. |
| `env` (arriba) | Entrega a la CLI el token y los ids. La CLI lee `VERCEL_TOKEN` del entorno (la guía oficial usa la bandera `--token`, que tiene prioridad). |
| `needs: test` | El trabajo espera al de pruebas y **no corre si falló**. |
| `if: github.event_name ...` | Preview solo en pull requests; producción solo en `push`. |
| `vercel pull` | Trae las variables y la configuración del entorno elegido. |
| `vercel build` | Construye la aplicación en la máquina de GitHub. |
| `vercel deploy --prebuilt` | Sube el resultado ya construido. **Sin `--prebuilt`, Vercel lo construiría otra vez**: dos builds por commit. |
| `--prod` | Publica en el dominio de producción; sin él, el despliegue es de preview. |

:::note[Dos detalles de `--prebuilt`]
Como el build ocurre fuera de Vercel, las *System Environment Variables* de Vercel no están disponibles durante el build. Y los despliegues hechos con la CLI no se tratan como un despliegue completo del proveedor de Git: se ve la rama y el commit, pero Vercel no comenta la URL en el pull request (la URL aparece en el registro del paso `vercel deploy`).
:::

:::warning[Los pull requests desde forks no reciben secrets]
Por seguridad, GitHub no entrega los secrets a los flujos que vienen de un fork. Para los pull requests entre ramas del mismo repositorio (lo habitual en el curso) funciona sin cambios.
:::

---

## 5. Probar la aplicación desplegada

Las pruebas del trabajo `test` usan una copia de la app levantada dentro del flujo. Pero lo que llega a los usuarios es **el despliegue**, con sus variables, su HTTPS y su red. Podemos ejecutar las mismas pruebas contra la URL del preview.

`vercel deploy` imprime la URL del despliegue como salida, así que el flujo la puede pasar al siguiente trabajo:

```yaml title=".github/workflows/deploy.yml (cambios en el preview)" showLineNumbers
  deploy-preview:
    needs: test
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    outputs:
      url: ${{ steps.deploy.outputs.url }}
    steps:
      - uses: actions/checkout@v6
      - run: npm install --global vercel@latest
      - run: vercel pull --yes --environment=preview
      - run: vercel build
      - id: deploy
        run: echo "url=$(vercel deploy --prebuilt)" >> "$GITHUB_OUTPUT"

  e2e-preview:
    needs: deploy-preview
    runs-on: ubuntu-latest
    env:
      BASE_URL: ${{ needs.deploy-preview.outputs.url }}
      VERCEL_AUTOMATION_BYPASS_SECRET: ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }}
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: lts/*
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
```

Y `playwright.config.ts` decide dónde apuntar: si existe `BASE_URL`, prueba el despliegue y **no** levanta el servidor local:

```ts title="playwright.config.ts (cambios)" showLineNumbers
const baseURL = process.env.BASE_URL ?? 'http://localhost:3000'

export default defineConfig({
  // ...
  use: {
    baseURL,
    extraHTTPHeaders: process.env.VERCEL_AUTOMATION_BYPASS_SECRET
      ? { 'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET }
      : {},
  },
  // solo se levanta la app local cuando no se prueba un despliegue
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npm run build && npm run start',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
})
```

:::note[¿Por qué el secret `VERCEL_AUTOMATION_BYPASS_SECRET`?]
Los despliegues de preview suelen tener **Deployment Protection** activada: quien abre la URL debe iniciar sesión en Vercel, y Playwright no puede. Vercel permite crear un *secret de bypass para automatización* en la configuración del proyecto; Playwright lo envía en el encabezado `x-vercel-protection-bypass` y la página abre normalmente. Guárdalo también como secret de GitHub.
:::

:::tip[Si usas la integración de Git en lugar de la CLI]
La integración de Vercel avisa a GitHub cuando un despliegue queda listo. Un flujo con `on: deployment_status` puede ejecutar Playwright contra `github.event.deployment_status.target_url` sin esperar ni consultar nada. Además, las **Deployment Checks** de Vercel pueden impedir que un despliegue se promueva a producción hasta que un flujo de GitHub Actions termine bien. Es la alternativa cuando no necesitas controlar el build.
:::

---

## 6. Revisar y arreglar problemas

Cuando algo no funciona, busca el síntoma:

| Síntoma | Causa probable | Qué hacer |
| :--- | :--- | :--- |
| Cada cambio se despliega dos veces | La integración de Git sigue activa junto con el flujo. | Agrega `git.deploymentEnabled: false` en `vercel.json`. |
| Cambié una variable en el panel y todo sigue igual | Las variables solo se aplican a despliegues nuevos. | Vuelve a desplegar. |
| Una variable `NEXT_PUBLIC_` llega `undefined` al navegador | Se lee con un nombre dinámico, o no está definida para el entorno que se construye. | Escríbela completa (`process.env.NEXT_PUBLIC_X`), defínela en ese entorno y vuelve a desplegar. |
| El preview usa valores de producción (o al revés) | La variable no está asignada al entorno correcto. | Revisa a cuáles entornos aplica cada variable. |
| El login funciona en local y falla en el despliegue | `API_URL` apunta a `localhost`, o el backend no es accesible desde Vercel. | Apunta `API_URL` a un backend desplegado. |
| Las pruebas contra el preview piden iniciar sesión en Vercel | Deployment Protection está activa. | Usa el secret de bypass (sección 5). |
| El flujo no tiene acceso a `VERCEL_TOKEN` | El secret no existe, tiene otro nombre o el pull request viene de un fork. | Revisa los nombres en **Settings > Secrets**. |

Si un despliegue de producción sale mal, abre el panel del proyecto en Vercel y vuelve a una versión anterior (*instant rollback*): la versión vieja ya está construida, así que el cambio es inmediato.

---

## Further Reading

- [Vercel: How can I use GitHub Actions with Vercel?](https://vercel.com/guides/how-can-i-use-github-actions-with-vercel)
- [Vercel: Environment variables](https://vercel.com/docs/environment-variables)
- [Vercel: Deployment environments](https://vercel.com/docs/deployments/environments)
- [Vercel CLI: deploy](https://vercel.com/docs/cli/deploy)
- [Vercel: Protection Bypass for Automation](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation)
- [Vercel: Git configuration (`vercel.json`)](https://vercel.com/docs/project-configuration/git-configuration)
- [Playwright: Continuous Integration](https://playwright.dev/docs/ci-intro)
