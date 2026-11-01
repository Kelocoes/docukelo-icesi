---
sidebar_position: 1
description: "End-to-end tests with Playwright: why they matter, installation and configuration, folder structure, locators, auto-waiting, the session in tests, debugging and CI."
---

# End-to-end tests with Playwright

An **end-to-end** (E2E) test opens a real browser, uses your application the way a person would and checks what it sees. It does not care how the code is written: it checks that **the whole system** (interface, server, cookies, data) works together.

[Playwright](https://playwright.dev) is the tool we will use. It works with any web application, not only Next.js; the examples use a sign-in because it is the flow we built in [week 14](../semana-14/01-sesiones-en-nextjs.md), but everything else applies to any project.

---

## 1. Why E2E tests

Pick an error and see at which level of the pyramid it is best detected.

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/piramide-pruebas/index.html"
  title="Test pyramid: where each error is detected"
  height={600}
/>

| | Unit | Integration | E2E |
| :--- | :--- | :--- | :--- |
| **What they test** | A function or a use case. | Several pieces with simulated dependencies. | The whole system, in a real browser. |
| **Speed** | Milliseconds. | Hundreds of milliseconds. | Seconds. |
| **How many** | Many. | Some. | Few: the important flows. |
| **When they fail** | They point to the exact line. | They point to a module. | They point out that something, somewhere, failed. |
| **What they do not see** | That the pieces work together. | The real system. | Edge cases (they are too slow for that). |

:::note[What they are used for in this course]
The flows you cannot test with a function: signing in, the cookie being stored, a protected route redirecting, creating a routine and seeing it in the list.
:::

---

## 2. Install and configure

In the project root:

```bash
npm init playwright@latest
```

The wizard asks a few questions:

| Question | What to answer |
| :--- | :--- |
| JavaScript or TypeScript? | **TypeScript**, like the rest of the project. |
| Where to put the tests? | **`e2e`**, so they are not mixed with unit tests. |
| Add a GitHub Actions workflow? | **Yes**, if you are going to use CI (see section 8). |
| Install the browsers? | **Yes**: it downloads Chromium, Firefox and WebKit. |

See what it creates and how to organize it in your project:

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/estructura-playwright/index.html"
  title="Folder structure of a project with Playwright"
  height={1200}
/>

The configuration lives in `playwright.config.ts`. This is the one for a Next.js application with a session:

```ts title="playwright.config.ts" showLineNumbers
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // in CI, a forgotten test.only makes the run fail
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000', // lets you write page.goto('/login')
    trace: 'on-first-retry',          // saves a trace when a retry fails
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
  ],
  // Starts the application before the tests
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000, // the build can take longer than the default value
  },
})
```

Add scripts so you do not have to remember the commands:

```json title="package.json" showLineNumbers
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

:::tip[With Next.js, test against the production build]
The [Next.js guide](https://nextjs.org/docs/app/guides/testing/playwright) recommends testing against `npm run build` and `npm run start`: it is what users will see and it avoids `next dev` compiling each page on the first visit. With `webServer` Playwright starts the server for you. To get started quickly there is also `npx create-next-app@latest --example with-playwright`.
:::

---

## 3. Your first test

Walk through the test line by line: each one is linked to what happens in the browser. A test has three moments: set up (*arrange*), act (*act*) and check (*assert*).

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/anatomia-test-playwright/index.html"
  title="Anatomy of a Playwright test"
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

Run it:

```bash
npm run test:e2e
npx playwright show-report
```

---

## 4. How to find elements

A fragile test breaks when the design changes even though the application works. The defense is to locate elements **the way a user perceives them**.

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/localizadores-playwright/index.html"
  title="Playwright locators, from the most robust to the most fragile"
  height={900}
/>

---

## 5. Auto-waiting

Web applications are asynchronous: a button takes time to become enabled, a page takes time to load. Playwright **waits for you**: before acting it checks that the element is ready, and assertions retry. Turn on "La aplicación tarda en responder" (The application is slow to respond) to see the retries.

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/autoespera-playwright/index.html"
  title="Playwright auto-waiting: click and expect retry on their own"
  height={700}
/>

| Do it this way | Do not do it this way | Why |
| :--- | :--- | :--- |
| `await expect(el).toBeVisible()` | `expect(await el.isVisible()).toBe(true)` | The first one retries; the second checks only once. |
| `await expect(page).toHaveURL('/routines')` | `expect(page.url()).toBe(...)` | Same reason: the URL can take time to change. |
| Wait for a condition | `await page.waitForTimeout(3000)` | Sleeping makes the test slow and unstable at the same time. |

---

## 6. The session in tests

Each `test()` starts with a clean browser: no cookies. To test the protected part, does every test have to sign in? No: it is done once and reused.

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/reutilizar-sesion-playwright/index.html"
  title="Reuse the session in tests with storageState"
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

  // Saves the browser cookies, including the httpOnly session cookie
  await page.context().storageState({ path: authFile })
})
```

The tests **for the login itself** must start without a session; the ones for the protected part already arrive authenticated:

```ts title="e2e/login.spec.ts" showLineNumbers
import { test, expect } from '@playwright/test'

test.use({ storageState: { cookies: [], origins: [] } }) // start without a session

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

// Uses the session saved by auth.setup.ts (configured in the "chromium" project)
test('ve la lista de rutinas', async ({ page }) => {
  await page.goto('/routines')
  await expect(page.getByRole('heading', { name: 'Mis rutinas' })).toBeVisible()
})
```

:::warning[Be careful with `playwright/.auth/`]
`user.json` contains real session cookies. Add it to `.gitignore` (`/playwright/.auth/`) and never commit it to the repository.
:::

:::note[Test data in the mocked datasource]
If the server keeps the data in memory, all tests share the same state. Use unique names when creating data (`Rutina ${Date.now()}`) or set `workers: 1` so they do not step on each other.
:::

---

## 7. When a test fails

| Tool | Command | What it is for |
| :--- | :--- | :--- |
| **UI Mode** | `npx playwright test --ui` | Run and walk through each step with a timeline and the DOM at each moment. |
| **Inspector** | `npx playwright test --debug` | Go step by step with the browser visible. |
| **See the browser** | `npx playwright test --headed` | Watch the test while it runs. |
| **Codegen** | `npx playwright codegen http://localhost:3000` | Record your actions and get code and locators. |
| **HTML report** | `npx playwright show-report` | See what happened in the last run. |
| **Trace Viewer** | `npx playwright show-trace <file>.zip` | Replay a run with DOM, network and console. It is saved with `trace: 'on-first-retry'`. |
| **A single test** | `npx playwright test -g "inicia sesión"` | Do not run everything while debugging. |

:::tip[Start with `--ui`]
It is the fastest way to understand why a test fails: you see each action, the state of the page before and after, and the error messages.
:::

---

## 8. Run them on every change (CI)

The wizard can generate a GitHub Actions workflow. This is the idea:

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
