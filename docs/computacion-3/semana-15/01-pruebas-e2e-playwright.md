---
sidebar_position: 1
description: "Pruebas end-to-end con Playwright: por qué importan, instalación y configuración, estructura de carpetas, localizadores, auto-espera, sesión en las pruebas, depuración y CI."
---

# Pruebas end-to-end con Playwright

Una prueba **end-to-end** (E2E) abre un navegador real, usa tu aplicación como lo haría una persona y comprueba lo que ve. No le importa cómo está escrito el código: comprueba que **el sistema completo** (interfaz, servidor, cookies, datos) funciona junto.

[Playwright](https://playwright.dev) es la herramienta que usaremos. Funciona con cualquier aplicación web, no solo con Next.js; los ejemplos usan un inicio de sesión porque es el recorrido que construimos en la [semana 14](../semana-14/01-sesiones-en-nextjs.md), pero todo lo demás aplica a cualquier proyecto.

---

## 1. Por qué pruebas E2E

Elige un error y mira en qué nivel de la pirámide se detecta mejor.

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/piramide-pruebas/index.html"
  title="Pirámide de pruebas: dónde se detecta cada error"
  height={600}
/>

| | Unitarias | Integración | E2E |
| :--- | :--- | :--- | :--- |
| **Qué prueban** | Una función o un caso de uso. | Varias piezas con dependencias simuladas. | El sistema completo, en un navegador real. |
| **Velocidad** | Milisegundos. | Cientos de milisegundos. | Segundos. |
| **Cuántas** | Muchas. | Algunas. | Pocas: los recorridos importantes. |
| **Si fallan** | Señalan la línea exacta. | Señalan un módulo. | Señalan que algo, en algún punto, falló. |
| **Qué no ven** | Que las piezas funcionen juntas. | El sistema real. | Los casos borde (son lentas para eso). |

:::note[Para qué se usan en este curso]
Los recorridos que no puedes probar con una función: iniciar sesión, que la cookie se guarde, que una ruta protegida redirija, crear una rutina y verla en la lista.
:::

---

## 2. Instalar y configurar

En la raíz del proyecto:

```bash
npm init playwright@latest
```

El asistente hace unas preguntas:

| Pregunta | Qué responder |
| :--- | :--- |
| ¿JavaScript o TypeScript? | **TypeScript**, como el resto del proyecto. |
| ¿Dónde poner las pruebas? | **`e2e`**, para no mezclarlas con pruebas unitarias. |
| ¿Agregar un flujo de GitHub Actions? | **Sí**, si vas a usar CI (ver la sección 8). |
| ¿Instalar los navegadores? | **Sí**: descarga Chromium, Firefox y WebKit. |

Mira qué crea y cómo organizarlo en tu proyecto:

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/estructura-playwright/index.html"
  title="Estructura de carpetas de un proyecto con Playwright"
  height={1200}
/>

La configuración vive en `playwright.config.ts`. Esta es la de una aplicación Next.js con sesión:

```ts title="playwright.config.ts" showLineNumbers
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // en CI, un test.only olvidado hace fallar la ejecución
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000', // permite escribir page.goto('/login')
    trace: 'on-first-retry',          // guarda una traza cuando un reintento falla
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
  ],
  // Arranca la aplicación antes de las pruebas
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000, // el build puede tardar más que el valor por defecto
  },
})
```

Agrega scripts para no recordar los comandos:

```json title="package.json" showLineNumbers
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

:::tip[Con Next.js, prueba contra el build de producción]
La [guía de Next.js](https://nextjs.org/docs/app/guides/testing/playwright) recomienda probar contra `npm run build` y `npm run start`: es lo que verán los usuarios y evita que `next dev` compile cada página en la primera visita. Con `webServer` Playwright levanta el servidor por ti. Para empezar rápido también existe `npx create-next-app@latest --example with-playwright`.
:::

---

## 3. Tu primera prueba

Recorre la prueba línea por línea: cada una se enlaza con lo que ocurre en el navegador. Una prueba tiene tres momentos: preparar (*arrange*), actuar (*act*) y comprobar (*assert*).

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/anatomia-test-playwright/index.html"
  title="Anatomía de una prueba de Playwright"
  height={900}
/>

```ts title="e2e/login.spec.ts" showLineNumbers
import { test, expect } from '@playwright/test'

test('inicia sesión y ve sus rutinas', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Correo').fill('ana@icesi.edu.co')
  await page.getByLabel('Contraseña').fill('123456')
  await page.getByRole('button', { name: 'Iniciar sesión' }).click()

  await expect(page).toHaveURL('/routines')
  await expect(page.getByRole('heading', { name: 'Mis rutinas' })).toBeVisible()
})
```

Ejecútala:

```bash
npm run test:e2e
npx playwright show-report
```

---

## 4. Cómo encontrar elementos

Una prueba frágil se rompe cuando cambia el diseño aunque la aplicación funcione. La defensa es localizar los elementos **como los percibe un usuario**.

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/localizadores-playwright/index.html"
  title="Localizadores de Playwright, del más robusto al más frágil"
  height={900}
/>

---

## 5. La auto-espera

Las aplicaciones web son asíncronas: un botón tarda en habilitarse, una página tarda en cargar. Playwright **espera por ti**: antes de actuar comprueba que el elemento esté listo, y las aserciones reintentan. Activa «La aplicación tarda en responder» para ver los reintentos.

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/autoespera-playwright/index.html"
  title="Auto-espera de Playwright: click y expect reintentan solos"
  height={700}
/>

| Hazlo así | No lo hagas así | Por qué |
| :--- | :--- | :--- |
| `await expect(el).toBeVisible()` | `expect(await el.isVisible()).toBe(true)` | La primera reintenta; la segunda comprueba una sola vez. |
| `await expect(page).toHaveURL('/routines')` | `expect(page.url()).toBe(...)` | Mismo motivo: la URL puede tardar en cambiar. |
| Esperar una condición | `await page.waitForTimeout(3000)` | Dormir hace la prueba lenta e inestable a la vez. |

---

## 6. La sesión en las pruebas

Cada `test()` empieza con un navegador limpio: sin cookies. Para probar la parte protegida, ¿cada prueba tiene que iniciar sesión? No: se hace una sola vez y se reutiliza.

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/reutilizar-sesion-playwright/index.html"
  title="Reutilizar la sesión en las pruebas con storageState"
  height={760}
/>

```ts title="e2e/auth.setup.ts" showLineNumbers
import { test as setup, expect } from '@playwright/test'

const authFile = 'playwright/.auth/user.json'

setup('autenticar', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Correo').fill('ana@icesi.edu.co')
  await page.getByLabel('Contraseña').fill('123456')
  await page.getByRole('button', { name: 'Iniciar sesión' }).click()
  await expect(page).toHaveURL('/routines')

  // Guarda las cookies del navegador, incluida la cookie httpOnly de la sesión
  await page.context().storageState({ path: authFile })
})
```

Las pruebas **del propio login** deben empezar sin sesión; las de la parte protegida ya llegan autenticadas:

```ts title="e2e/login.spec.ts" showLineNumbers
import { test, expect } from '@playwright/test'

test.use({ storageState: { cookies: [], origins: [] } }) // empezar sin sesión

test('muestra un error con credenciales incorrectas', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Correo').fill('ana@icesi.edu.co')
  await page.getByLabel('Contraseña').fill('incorrecta')
  await page.getByRole('button', { name: 'Iniciar sesión' }).click()

  await expect(page.getByText('Credenciales inválidas')).toBeVisible()
  await expect(page).toHaveURL('/login')
})

test('redirige a /login si no hay sesión', async ({ page }) => {
  await page.goto('/routines')
  await expect(page).toHaveURL('/login')
})

test('la cookie de sesión es httpOnly', async ({ page, context }) => {
  await page.goto('/login')
  await page.getByLabel('Correo').fill('ana@icesi.edu.co')
  await page.getByLabel('Contraseña').fill('123456')
  await page.getByRole('button', { name: 'Iniciar sesión' }).click()
  await expect(page).toHaveURL('/routines')

  const session = (await context.cookies()).find((c) => c.name === 'session')
  expect(session?.httpOnly).toBe(true)
})
```

```ts title="e2e/routines.spec.ts" showLineNumbers
import { test, expect } from '@playwright/test'

// Usa la sesión guardada por auth.setup.ts (configurada en el proyecto «chromium»)
test('ve la lista de rutinas', async ({ page }) => {
  await page.goto('/routines')
  await expect(page.getByRole('heading', { name: 'Mis rutinas' })).toBeVisible()
})
```

:::warning[Cuidado con `playwright/.auth/`]
`user.json` contiene cookies de sesión reales. Agrégalo al `.gitignore` (`/playwright/.auth/`) y nunca lo subas al repositorio.
:::

:::note[Datos de prueba en el datasource mockeado]
Si el servidor guarda los datos en memoria, todas las pruebas comparten el mismo estado. Usa nombres únicos al crear datos (`Rutina ${Date.now()}`) o configura `workers: 1` para que no se pisen.
:::

---

## 7. Cuando una prueba falla

| Herramienta | Comando | Para qué |
| :--- | :--- | :--- |
| **UI Mode** | `npx playwright test --ui` | Ejecutar y recorrer cada paso con una línea de tiempo y el DOM de cada momento. |
| **Inspector** | `npx playwright test --debug` | Ir paso a paso con el navegador visible. |
| **Ver el navegador** | `npx playwright test --headed` | Mirar la prueba mientras corre. |
| **Codegen** | `npx playwright codegen http://localhost:3000` | Grabar tus acciones y obtener código y localizadores. |
| **Reporte HTML** | `npx playwright show-report` | Ver qué pasó en la última ejecución. |
| **Trace Viewer** | `npx playwright show-trace <archivo>.zip` | Repetir una ejecución con DOM, red y consola. Se guarda con `trace: 'on-first-retry'`. |
| **Una sola prueba** | `npx playwright test -g "inicia sesión"` | No ejecutar todo mientras depuras. |

:::tip[Empieza con `--ui`]
Es la forma más rápida de entender por qué falla una prueba: ves cada acción, el estado de la página antes y después, y los mensajes de error.
:::

---

## 8. Ejecutarlas en cada cambio (CI)

El asistente puede generar un flujo de GitHub Actions. Esta es la idea:

```yaml title=".github/workflows/playwright.yml" showLineNumbers
name: Playwright Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    timeout-minutes: 30
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```
