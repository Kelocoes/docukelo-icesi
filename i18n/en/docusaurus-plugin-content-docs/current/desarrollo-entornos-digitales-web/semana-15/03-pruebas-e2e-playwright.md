---
sidebar_position: 3
description: "End-to-end tests with Playwright on the exercises and routines app: installation, configuration, reusable session with storageState, login mocking, locators, auto-waiting and debugging."
---

# End-to-end tests with Playwright

Until now, to know whether the app worked you opened it and tried it by hand: log in, filter exercises, create a routine. Every time you change something you would have to repeat everything. An **end-to-end** (E2E) test does that journey for you: it opens a real browser, uses the app as a person would and checks what it sees.

[Playwright](https://playwright.dev) is the tool we will use. Here we set it up on the app from [part 1](./01-next-avanzado-parte-1.md) and [part 2](./02-next-avanzado-parte-2.md), and write tests for the login, the filters, the modal, the form and the theme.

---

## 1. Why E2E tests

Pick an error and see at which level of the pyramid it is best detected.

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/piramide-pruebas/index.html"
  title="Testing pyramid: where each error is detected"
  height={600}
/>

| | Unit | Integration | E2E |
| :--- | :--- | :--- | :--- |
| **What they test** | A function. | Several pieces together. | The whole app, in a real browser. |
| **Speed** | Milliseconds. | Hundreds of milliseconds. | Seconds. |
| **How many** | Many. | Some. | Few: the important journeys. |
| **When they fail** | They point to the exact line. | They point to a module. | They tell you something, somewhere, failed. |

:::note[What we will test in this course]
The journeys that matter to whoever uses the app: logging in, searching and filtering exercises, opening one in the modal, creating a routine and marking an exercise as done, switching the theme.
:::

---

## 2. Install and configure

At the root of the project:

```bash
npm init playwright@latest
```
| Installer question | What to answer |
| :--- | :--- |
| JavaScript or TypeScript? | **TypeScript**, like the rest of the project. |
| Where to put the tests? | **`e2e`**, to keep them apart from the app code. |
| Add a GitHub Actions workflow? | **No**. You will run the tests on your own computer. |
| Install the browsers? | **Yes**: it downloads Chromium, Firefox and WebKit. |

See what it creates and how to organize it:

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/estructura-playwright/index.html"
  title="Folder structure of a project with Playwright"
  height={1200}
/>

Everything is controlled from `playwright.config.ts`. This is our app's configuration, with a comment on every decision:

```ts title="playwright.config.ts" showLineNumbers
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    // Where the tests live
    testDir: './e2e',

    // Tests in different files run in parallel
    fullyParallel: true,

    // If you leave a test.only by mistake, the run fails instead of skipping the rest
    forbidOnly: !!process.env.CI,

    // An HTML report opened with: npx playwright show-report
    reporter: 'html',

    use: {
        // Lets you write page.goto('/login') instead of the full address
        baseURL: 'http://localhost:3000',

        // Saves a trace (step-by-step movie) when a retry fails
        trace: 'on-first-retry',
    },

    projects: [
        // 1. Log in only once and save the result in a file
        { name: 'setup', testMatch: /auth\.setup\.ts/ },

        // 2. The other tests start with that session already logged in
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
            dependencies: ['setup'],
        },
    ],

    // Starts the app before the tests (and reuses it if you already have it running)
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 120_000, // Next's first compilation can take a while
    },
});
```
| Option | What it controls |
| :--- | :--- |
| `testDir` | The folder where Playwright looks for `*.spec.ts` files. |
| `fullyParallel` | Runs tests at the same time to finish sooner. |
| `baseURL` | The base address: in the tests you only write the path. |
| `trace` | When to save the "movie" of a test so you can review it later. |
| `projects` | Run variants: browsers, screen sizes or previous steps such as `setup`. |
| `dependencies` | The `chromium` project does not start until `setup` finishes successfully. |
| `webServer` | Starts the app for you and waits for it to respond. With `reuseExistingServer` it uses the one you already have running. |

Add scripts so you do not have to remember commands:

```json title="package.json" showLineNumbers
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```
And avoid committing the saved session to the repository:

```text title=".gitignore" showLineNumbers
# Playwright
/playwright/.auth/
/playwright-report/
/test-results/
```
:::tip[`npm run dev` or the production build]
For class we use `npm run dev`: it is the most convenient and reuses the server you already have open. It has a cost: Next compiles each page the first time it is visited, and that can make the first tests slow. If you see timeouts, change the command to `npm run build && npm run start`, which tests exactly what users would see (and raise the `timeout`).
:::

---

## 3. Your first test

A test has three moments: arrange, act and assert. Go through the anatomy line by line:

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/anatomia-test-playwright/index.html"
  title="Anatomy of a Playwright test"
  height={900}
/>

This is our app's first test: filter exercises by category.

```ts title="e2e/exercises.spec.ts (first test)" showLineNumbers
import { test, expect } from '@playwright/test';

test('filtra los ejercicios por categoría', async ({ page }) => {
    await page.goto('/exercises');

    await page.getByRole('button', { name: 'Cardio' }).click();

    await expect(page).toHaveURL(/category=cardio/);
    await expect(page.getByRole('heading', { name: 'Saltos de tijera' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sentadilla' })).toHaveCount(0);
});
```
Run it and look at the report:

```bash
npm run test:e2e
npx playwright show-report
```
:::note[Tests read your interface like a person]
`getByLabel('Buscar ejercicio')` only finds the field because the component has a label (`<span className="sr-only">Buscar ejercicio</span>` inside a `<label>`). If it did not, the test would fail even though the app works. That is an advantage: writing tests pushes you to build an **accessible** interface.
:::

---

## 4. How to find elements

A fragile test breaks when the design changes even though the app keeps working. The defense is to locate elements **as a person perceives them**: by their role, their label or their text.

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/localizadores-playwright/index.html"
  title="Playwright locators, from most robust to most fragile"
  height={900}
/>

The ones we use in the app:

| Locator | Where |
| :--- | :--- |
| `getByRole('button', { name: 'Cardio' })` | Category filter button. |
| `getByLabel('Buscar ejercicio')` | Search field. |
| `getByRole('link', { name: /Zancadas/ })` | The exercise card (a link). |
| `getByRole('dialog')` | The modal. |
| `getByText('Elige un nivel.')` | A form error message. |

### When a locator matches two elements

Playwright is strict: if `getByRole('button', { name: 'Cerrar' })` finds **two** buttons, the test fails with a *strict mode violation* error instead of guessing. In our app this happens twice:

| Problem | Why it happens | Solution |
| :--- | :--- | :--- |
| `name: 'Cerrar'` matches the modal button and the "Cerrar Sesión" button in the bar | `name` matches partially | Scope it to the modal: `page.getByRole('dialog').getByRole('button', { name: 'Cerrar' })` |
| `getByRole('alert')` matches the error message and a `role="alert"` that Next.js adds to announce page changes | Two elements with the same role | Filter by text: `page.getByRole('alert').filter({ hasText: 'Credenciales inválidas' })` |

---

## 5. Auto-waiting

Web applications are asynchronous: the list takes 0.8 s to appear, the checkbox takes a while to be confirmed. Playwright **waits for you**: before acting it checks that the element is ready, and `expect` assertions retry until they are met. Turn on "The application is slow to respond" to see the retries.

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/autoespera-playwright/index.html"
  title="Playwright auto-waiting: click and expect retry on their own"
  height={700}
/>

| Do this | Not this | Why |
| :--- | :--- | :--- |
| `await expect(el).toBeVisible()` | `expect(await el.isVisible()).toBe(true)` | The first one retries; the second checks only once. |
| `await expect(page).toHaveURL('/routines')` | `expect(page.url()).toBe(...)` | The URL may take time to change. |
| `await expect(el).toHaveCount(0)` | `await page.waitForTimeout(3000)` | Sleeping makes the test slow and unstable at the same time. |

In our app this shows with the search: the text is typed, waits 300 ms of *debounce* and then the list takes 0.8 s. The test has not a single `sleep`; the assertions wait on their own.

---

## 6. Simulating the server: `page.route`

The app's login calls a NestJS backend. E2E tests should not depend on that server being on, nor on the user `ana@icesi.edu.co` existing. `page.route` intercepts a browser request and **answers in its place**.

```ts title="e2e/mocks.ts" showLineNumbers
import type { Page } from '@playwright/test';

// The response the NestJS backend would give on login (the data is made up)
export const LOGIN_OK = {
    access_token: 'token-de-prueba',
    token_type: 'Bearer',
    user: { id: 1, email: 'ana@icesi.edu.co' },
};

// Intercepts the browser's login request and responds without calling the real backend
export async function mockLoginOk(page: Page) {
    await page.route('**/auth/login', (route) => route.fulfill({ json: LOGIN_OK }));
}

export async function mockLoginError(page: Page) {
    await page.route('**/auth/login', (route) =>
        route.fulfill({ status: 401, json: { message: 'Credenciales inválidas' } }),
    );
}
```
| Part | What it does |
| :--- | :--- |
| `'**/auth/login'` | A pattern: any request whose address ends in `/auth/login`. |
| `route.fulfill({ json })` | Responds with that JSON and status 200, without touching the network. |
| `status: 401` | Simulates a server error, to test the error message. |

:::warning[It only sees what the browser does]
`page.route` intercepts requests that leave **the browser** (such as the login `fetch` on the client). If a Next.js page requests data from the **server** (a Server Component calling an API), that request does not go through the browser and `page.route` does not see it. That is why we mock the login, which is done from the client, and not the exercises, which are read on the server.
:::

---

## 7. Log in only once: `storageState`

Every `test()` starts with a clean browser. If every test had to log in, they would be slow and repetitive. The solution: log in **once** in a previous step and save what the browser remembers.

```ts title="e2e/auth.setup.ts" showLineNumbers
import { test as setup, expect } from '@playwright/test';
import { mockLoginOk } from './mocks';

const authFile = 'playwright/.auth/user.json';

setup('iniciar sesión una sola vez', async ({ page }) => {
    await mockLoginOk(page);

    await page.goto('/login');
    await page.getByLabel('Correo electrónico').fill('ana@icesi.edu.co');
    await page.getByLabel('Contraseña').fill('12345678');
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

    await expect(page).toHaveURL('/dashboard');

    // Saves what the browser remembers: here, the token Zustand left in localStorage
    await page.context().storageState({ path: authFile });
});
```
`storageState` saves **cookies and `localStorage`**. In our app the token lives in `localStorage` (the week 13 Zustand store put it there), and that is why it works: the following tests start with the token already set and the `AuthGuard` lets them through.

The order is in the configuration: the `chromium` project declares `dependencies: ['setup']` and `storageState: 'playwright/.auth/user.json'`. The tests for the protected part write nothing about authentication:

```ts title="e2e/dashboard.spec.ts" showLineNumbers
import { test, expect } from '@playwright/test';

// These tests use the session saved by auth.setup.ts (see the "chromium" project)
test('crear una notificación aumenta el contador de la campana', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('button', { name: 'Notificaciones (0)' })).toBeVisible();

    await page.getByRole('button', { name: 'Crear Notificación' }).click();

    await expect(page.getByRole('button', { name: 'Notificaciones (1)' })).toBeVisible();
});

test('cerrar sesión lleva al login y vuelve a proteger el dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    await page.getByRole('button', { name: 'Cerrar Sesión' }).click();
    await expect(page).toHaveURL('/login');

    // Without a token, the app's guard sends us back to the login
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
});
```
The tests **for the login itself** are the exception: they must start without a session.

```ts title="e2e/login.spec.ts" showLineNumbers
import { test, expect } from '@playwright/test';
import { mockLoginError, mockLoginOk } from './mocks';

// The login tests must start WITHOUT a session
test.use({ storageState: { cookies: [], origins: [] } });

test('inicia sesión y llega al dashboard', async ({ page }) => {
    await mockLoginOk(page);

    await page.goto('/login');
    await page.getByLabel('Correo electrónico').fill('ana@icesi.edu.co');
    await page.getByLabel('Contraseña').fill('12345678');
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('button', { name: 'Crear Notificación' })).toBeVisible();
});

test('muestra un error si las credenciales son incorrectas', async ({ page }) => {
    await mockLoginError(page);

    await page.goto('/login');
    await page.getByLabel('Correo electrónico').fill('ana@icesi.edu.co');
    await page.getByLabel('Contraseña').fill('incorrecta');
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

    // Next.js also uses its own role="alert": we filter by text to pick ours
    await expect(page.getByRole('alert').filter({ hasText: 'Credenciales inválidas' })).toBeVisible();
    await expect(page).toHaveURL('/login');
});

test('sin sesión, entrar al dashboard lleva al login', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL('/login');
});
```
:::warning[Careful with `playwright/.auth/`]
`user.json` contains the saved token. Keep it in `.gitignore` and never commit it to the repository.
:::

---

## 8. The app's tests

The other files use what you have already seen. Read them as a list of what the app promises.

```ts title="e2e/exercises.spec.ts" showLineNumbers
import { test, expect } from '@playwright/test';

test('filtra los ejercicios por categoría', async ({ page }) => {
    await page.goto('/exercises');

    await page.getByRole('button', { name: 'Cardio' }).click();

    await expect(page).toHaveURL(/category=cardio/);
    await expect(page.getByRole('heading', { name: 'Saltos de tijera' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sentadilla' })).toHaveCount(0);
});

test('busca un ejercicio por texto', async ({ page }) => {
    await page.goto('/exercises');

    await page.getByLabel('Buscar ejercicio').fill('plan');

    await expect(page).toHaveURL(/q=plan/);
    await expect(page.getByRole('heading', { name: 'Plancha' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Flexiones' })).toHaveCount(0);
});

test('abre el ejercicio en un modal y lo cierra', async ({ page }) => {
    await page.goto('/exercises');

    await page.getByRole('link', { name: /Zancadas/ }).click();

    await expect(page).toHaveURL('/exercises/4');
    await expect(page.getByRole('dialog')).toBeVisible();

    // Inside the modal: "Cerrar" also matches "Cerrar Sesión" in the bar
    await page.getByRole('dialog').getByRole('button', { name: 'Cerrar' }).click();
    await expect(page).toHaveURL('/exercises');
    await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('una dirección que no existe muestra la página de ejercicio no encontrado', async ({ page }) => {
    await page.goto('/exercises/999');

    await expect(page.getByRole('heading', { name: 'Ese ejercicio no existe' })).toBeVisible();
});
```

```ts title="e2e/routines.spec.ts" showLineNumbers
import { test, expect } from '@playwright/test';

test('el formulario avisa de los campos que faltan', async ({ page }) => {
    await page.goto('/routines/new');

    await page.getByRole('button', { name: 'Guardar rutina' }).click();

    await expect(page.getByText('El nombre debe tener al menos 3 caracteres.')).toBeVisible();
    await expect(page.getByText('Elige un nivel.')).toBeVisible();
    await expect(page.getByText('Elige al menos un ejercicio.')).toBeVisible();
});

test('crea una rutina y marca un ejercicio como hecho', async ({ page }) => {
    // A different name on each run: the list lives in server memory
    const name = `Rutina de prueba ${Date.now()}`;

    await page.goto('/routines/new');
    await page.getByLabel('Nombre de la rutina').fill(name);
    await page.getByLabel('Nivel').selectOption('principiante');
    await page.getByLabel('Plancha').check();
    await page.getByLabel('Sentadilla').check();
    await page.getByRole('button', { name: 'Guardar rutina' }).click();

    // After saving, the action redirects to the list and the routine appears in it
    await expect(page).toHaveURL('/routines');
    await page.getByRole('link', { name: new RegExp(name) }).click();

    await expect(page.getByText('0 de 2 ejercicios hechos')).toBeVisible();
    await page.getByLabel('Plancha').check();
    await expect(page.getByText('1 de 2 ejercicios hechos')).toBeVisible();
});

test('cambia el tema y lo recuerda al recargar', async ({ page }) => {
    await page.goto('/dashboard');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'icesi');

    await page.getByRole('button', { name: 'Cambiar tema' }).click();
    await expect(html).toHaveAttribute('data-theme', 'icesi-dark');

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'icesi-dark');

    // Lo dejamos como estaba para no afectar a otras pruebas
    await page.getByRole('button', { name: 'Cambiar tema' }).click();
    await expect(html).toHaveAttribute('data-theme', 'icesi');
});
```
Notice three decisions:

| Decision | Why |
| :--- | :--- |
| `Date.now()` in the routine name | Data lives in server memory and is shared between tests; a different name avoids clashes between runs. |
| The theme is left as it was | A test must not change the state another one expects. |
| The **cookie** is tested by reloading | Reloading proves the theme was remembered by the server, not just on screen. |

:::note[Data shared between tests]
If the app stores data in memory, all tests see the same list. Use unique names when creating data, or set `workers: 1` in `playwright.config.ts` so the tests run one after another.
:::

---

## 9. When a test fails

It will break at some point. These are the tools to understand why:

| Tool | Command | What for |
| :--- | :--- | :--- |
| **UI Mode** | `npx playwright test --ui` | Run and walk through each step with a timeline and the DOM at each moment. |
| **Inspector** | `npx playwright test --debug` | Go step by step with the browser visible. |
| **See the browser** | `npx playwright test --headed` | Watch the test while it runs. |
| **Codegen** | `npx playwright codegen http://localhost:3000` | Record your actions and get code and locators. |
| **HTML report** | `npx playwright show-report` | See what happened in the last run. |
| **Trace Viewer** | `npx playwright show-trace <file>.zip` | Replay a run with DOM, network and console. |
| **A single test** | `npx playwright test -g "modal"` | Do not run everything while debugging. |
| **A single file** | `npx playwright test e2e/login.spec.ts` | Run only one file. |

:::tip[Start with `--ui`]
It is the fastest way to understand why a test fails: you see every action, the state of the page before and after, and the error messages.
:::

## Common errors

| Symptom | Cause | Fix |
| :--- | :--- | :--- |
| *strict mode violation: resolved to 2 elements* | The locator matches more than one element. | Scope it with another locator or use `filter({ hasText })`. |
| `Timeout` waiting for an element in the first test | Next is compiling the page for the first time in `npm run dev`. | Raise the `timeout`, open the page once beforehand or test against the build. |
| The login fails in the test but works by hand | The real backend is not available or the `page.route` pattern does not match the URL. | Check the real address in the Network tab and adjust the pattern. |
| Tests for protected routes send you to the login | `setup` did not save the state or the configuration does not use it. | Check `dependencies: ['setup']` and `storageState` in the project. |
| `page.route` intercepts nothing | The request is made from Next's **server**, not from the browser. | It only works with client requests; use a test data server otherwise. |
| A test passes alone and fails alongside others | They depend on data shared in memory. | Use unique names, do not rely on order or use `workers: 1`. |
| `Executable doesn't exist` | The browsers are missing. | `npx playwright install`. |

## Challenges

1. Write a test that checks that, when loading `/exercises?category=movilidad` directly, only mobility exercises appear.
2. Test that, at `/routines/new`, if you fill in only the name and submit, **the name stays in the field** and only the level and exercises are missing.
3. Write a test for `/api/routines`: use `request` (`test('...', async ({ request }) => ...)`) and check that `POST` with invalid data responds 400.
4. Change `webServer.command` to `npm run build && npm run start` and compare the total time of the suite.
