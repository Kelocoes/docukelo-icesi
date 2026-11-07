---
sidebar_position: 3
description: "Pruebas end-to-end con Playwright sobre la app de ejercicios y rutinas: instalación, configuración, sesión reutilizable con storageState, simulación del login, localizadores, auto-espera y depuración."
---

# Pruebas end-to-end con Playwright

Hasta ahora, para saber si la app funcionaba la abrías y la probabas a mano: iniciar sesión, filtrar ejercicios, crear una rutina. Cada vez que cambias algo tendrías que repetirlo todo. Una prueba **end-to-end** (E2E) hace ese recorrido por ti: abre un navegador real, usa la app como lo haría una persona y comprueba lo que ve.

[Playwright](https://playwright.dev) es la herramienta que usaremos. Aquí lo configuramos sobre la app de la [parte 1](./01-next-avanzado-parte-1.md) y la [parte 2](./02-next-avanzado-parte-2.md), y escribimos pruebas para el login, los filtros, el modal, el formulario y el tema.

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
| **Qué prueban** | Una función. | Varias piezas juntas. | La app completa, en un navegador real. |
| **Velocidad** | Milisegundos. | Cientos de milisegundos. | Segundos. |
| **Cuántas** | Muchas. | Algunas. | Pocas: los recorridos importantes. |
| **Si fallan** | Señalan la línea exacta. | Señalan un módulo. | Señalan que algo, en algún punto, falló. |

:::note[Qué probaremos en este curso]
Los recorridos que importan a quien usa la app: iniciar sesión, buscar y filtrar ejercicios, abrir uno en el modal, crear una rutina y marcar un ejercicio como hecho, cambiar el tema.
:::

---

## 2. Instalar y configurar

En la raíz del proyecto:

```bash
npm init playwright@latest
```

| Pregunta del asistente | Qué responder |
| :--- | :--- |
| ¿JavaScript o TypeScript? | **TypeScript**, como el resto del proyecto. |
| ¿Dónde poner las pruebas? | **`e2e`**, para tenerlas aparte del código de la app. |
| ¿Agregar un flujo de GitHub Actions? | **No**. Las pruebas las ejecutarás tú en tu equipo. |
| ¿Instalar los navegadores? | **Sí**: descarga Chromium, Firefox y WebKit. |

Mira qué crea y cómo organizarlo:

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/estructura-playwright/index.html"
  title="Estructura de carpetas de un proyecto con Playwright"
  height={1200}
/>

Todo se controla desde `playwright.config.ts`. Esta es la configuración de nuestra app, con un comentario en cada decisión:

```ts title="playwright.config.ts" showLineNumbers
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    // Dónde viven las pruebas
    testDir: './e2e',

    // Las pruebas de archivos distintos corren en paralelo
    fullyParallel: true,

    // Si dejas un test.only por error, la ejecución falla en lugar de saltarse el resto
    forbidOnly: !!process.env.CI,

    // Un reporte en HTML que se abre con: npx playwright show-report
    reporter: 'html',

    use: {
        // Permite escribir page.goto('/login') en lugar de la dirección completa
        baseURL: 'http://localhost:3000',

        // Guarda una traza (película paso a paso) cuando un reintento falla
        trace: 'on-first-retry',
    },

    projects: [
        // 1. Inicia sesión una sola vez y guarda el resultado en un archivo
        { name: 'setup', testMatch: /auth\.setup\.ts/ },

        // 2. Las demás pruebas parten con esa sesión ya iniciada
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
            dependencies: ['setup'],
        },
    ],

    // Arranca la aplicación antes de las pruebas (y la reutiliza si ya la tienes corriendo)
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 120_000, // la primera compilación de Next puede tardar
    },
});
```

| Opción | Qué controla |
| :--- | :--- |
| `testDir` | La carpeta donde Playwright busca archivos `*.spec.ts`. |
| `fullyParallel` | Ejecuta pruebas a la vez para terminar antes. |
| `baseURL` | La dirección base: en las pruebas escribes solo la ruta. |
| `trace` | Cuándo guardar la "película" de una prueba para poder revisarla después. |
| `projects` | Variantes de ejecución: navegadores, tamaños de pantalla o pasos previos como el `setup`. |
| `dependencies` | El proyecto `chromium` no arranca hasta que `setup` termine bien. |
| `webServer` | Levanta la app por ti y espera a que responda. Con `reuseExistingServer` usa la que ya tengas corriendo. |

Agrega scripts para no recordar comandos:

```json title="package.json" showLineNumbers
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

Y evita subir la sesión guardada al repositorio:

```text title=".gitignore" showLineNumbers
# Playwright
/playwright/.auth/
/playwright-report/
/test-results/
```

:::tip[`npm run dev` o el build de producción]
Para clase usamos `npm run dev`: es lo más cómodo y reaprovecha el servidor que ya tienes abierto. Tiene un costo: Next compila cada página la primera vez que se visita, y eso puede hacer lentas las primeras pruebas. Si ves tiempos de espera agotados, cambia el comando a `npm run build && npm run start`, que prueba exactamente lo que verían los usuarios (y sube el `timeout`).
:::

---

## 3. Tu primera prueba

Una prueba tiene tres momentos: preparar (*arrange*), actuar (*act*) y comprobar (*assert*). Recorre la anatomía línea por línea:

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/anatomia-test-playwright/index.html"
  title="Anatomía de una prueba de Playwright"
  height={900}
/>

Esta es la primera prueba de nuestra app: filtrar ejercicios por categoría.

```ts title="e2e/exercises.spec.ts (primera prueba)" showLineNumbers
import { test, expect } from '@playwright/test';

test('filtra los ejercicios por categoría', async ({ page }) => {
    await page.goto('/exercises');

    await page.getByRole('button', { name: 'Cardio' }).click();

    await expect(page).toHaveURL(/category=cardio/);
    await expect(page.getByRole('heading', { name: 'Saltos de tijera' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sentadilla' })).toHaveCount(0);
});
```

Ejecútala y mira el reporte:

```bash
npm run test:e2e
npx playwright show-report
```

:::note[Las pruebas leen tu interfaz como una persona]
`getByLabel('Buscar ejercicio')` solo encuentra el campo porque el componente tiene una etiqueta (`<span className="sr-only">Buscar ejercicio</span>` dentro de un `<label>`). Si no la tuviera, la prueba fallaría aunque la app funcione. Esto es una ventaja: escribir pruebas te empuja a construir una interfaz **accesible**.
:::

---

## 4. Cómo encontrar elementos

Una prueba frágil se rompe cuando cambia el diseño aunque la app siga funcionando. La defensa es localizar los elementos **como los percibe una persona**: por su rol, su etiqueta o su texto.

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/localizadores-playwright/index.html"
  title="Localizadores de Playwright, del más robusto al más frágil"
  height={900}
/>

Los que usamos en la app:

| Localizador | Dónde |
| :--- | :--- |
| `getByRole('button', { name: 'Cardio' })` | Botón de filtro por categoría. |
| `getByLabel('Buscar ejercicio')` | Campo de búsqueda. |
| `getByRole('link', { name: /Zancadas/ })` | La tarjeta del ejercicio (un enlace). |
| `getByRole('dialog')` | El modal. |
| `getByText('Elige un nivel.')` | Un mensaje de error del formulario. |

### Cuando un localizador coincide con dos elementos

Playwright es estricto: si `getByRole('button', { name: 'Cerrar' })` encuentra **dos** botones, la prueba falla con un error de *strict mode violation* en lugar de adivinar. En nuestra app pasa dos veces:

| Problema | Por qué ocurre | Solución |
| :--- | :--- | :--- |
| `name: 'Cerrar'` coincide con el botón del modal y con "Cerrar Sesión" de la barra | `name` busca por coincidencia parcial | Acota al modal: `page.getByRole('dialog').getByRole('button', { name: 'Cerrar' })` |
| `getByRole('alert')` coincide con el mensaje de error y con un `role="alert"` que Next.js agrega para anunciar cambios de página | Dos elementos con el mismo rol | Filtra por texto: `page.getByRole('alert').filter({ hasText: 'Credenciales inválidas' })` |

---

## 5. La auto-espera

Las aplicaciones web son asíncronas: la lista tarda 0,8 s en aparecer, la casilla tarda en confirmarse. Playwright **espera por ti**: antes de actuar comprueba que el elemento esté listo, y las aserciones `expect` reintentan hasta que se cumplen. Activa «La aplicación tarda en responder» para ver los reintentos.

<InteractiveFrame
  src="/interactive/computacion-3/semana-15/autoespera-playwright/index.html"
  title="Auto-espera de Playwright: click y expect reintentan solos"
  height={700}
/>

| Hazlo así | No lo hagas así | Por qué |
| :--- | :--- | :--- |
| `await expect(el).toBeVisible()` | `expect(await el.isVisible()).toBe(true)` | La primera reintenta; la segunda comprueba una sola vez. |
| `await expect(page).toHaveURL('/routines')` | `expect(page.url()).toBe(...)` | La URL puede tardar en cambiar. |
| `await expect(el).toHaveCount(0)` | `await page.waitForTimeout(3000)` | Dormir hace la prueba lenta e inestable a la vez. |

En nuestra app se nota con la búsqueda: el texto se escribe, espera 300 ms de *debounce* y luego la lista tarda 0,8 s. La prueba no tiene ni un solo `sleep`; las aserciones esperan solas.

---

## 6. Simular el servidor: `page.route`

El login de la app llama a un backend de NestJS. Las pruebas E2E no deberían depender de que ese servidor esté encendido, ni de que el usuario `ana@icesi.edu.co` exista. `page.route` intercepta una petición del navegador y **responde en su lugar**.

```ts title="e2e/mocks.ts" showLineNumbers
import type { Page } from '@playwright/test';

// La respuesta que daría el backend de NestJS al iniciar sesión (los datos son inventados)
export const LOGIN_OK = {
    access_token: 'token-de-prueba',
    token_type: 'Bearer',
    user: { id: 1, email: 'ana@icesi.edu.co' },
};

// Intercepta la petición de login del navegador y responde sin llamar al backend real
export async function mockLoginOk(page: Page) {
    await page.route('**/auth/login', (route) => route.fulfill({ json: LOGIN_OK }));
}

export async function mockLoginError(page: Page) {
    await page.route('**/auth/login', (route) =>
        route.fulfill({ status: 401, json: { message: 'Credenciales inválidas' } }),
    );
}
```

| Parte | Qué hace |
| :--- | :--- |
| `'**/auth/login'` | Un patrón: cualquier petición cuya dirección termine en `/auth/login`. |
| `route.fulfill({ json })` | Responde con ese JSON y estado 200, sin tocar la red. |
| `status: 401` | Simula un error del servidor, para probar el mensaje de error. |

:::warning[Solo ve lo que hace el navegador]
`page.route` intercepta las peticiones que salen **del navegador** (como el `fetch` del login en el cliente). Si una página de Next.js pide datos desde el **servidor** (un Server Component que llama a una API), esa petición no pasa por el navegador y `page.route` no la ve. Por eso mockeamos el login, que se hace desde el cliente, y no los ejercicios, que se leen en el servidor.
:::

---

## 7. Iniciar sesión una sola vez: `storageState`

Cada `test()` empieza con un navegador limpio. Si cada prueba tuviera que iniciar sesión, serían lentas y repetitivas. La solución: iniciar sesión **una vez** en un paso previo y guardar lo que el navegador recuerda.

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

    // Guarda lo que el navegador recuerda: aquí, el token que Zustand dejó en localStorage
    await page.context().storageState({ path: authFile });
});
```

`storageState` guarda **cookies y `localStorage`**. En nuestra app el token vive en `localStorage` (lo puso el store de Zustand de la semana 13), y por eso funciona: las pruebas siguientes arrancan con el token ya puesto y el `AuthGuard` las deja pasar.

El orden está en la configuración: el proyecto `chromium` declara `dependencies: ['setup']` y `storageState: 'playwright/.auth/user.json'`. Las pruebas de la parte protegida no escriben nada de autenticación:

```ts title="e2e/dashboard.spec.ts" showLineNumbers
import { test, expect } from '@playwright/test';

// Estas pruebas usan la sesión guardada por auth.setup.ts (ver el proyecto "chromium")
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

    // Sin token, el guard de la aplicación vuelve a mandarnos al login
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
});
```

Las pruebas **del propio login** son la excepción: deben empezar sin sesión.

```ts title="e2e/login.spec.ts" showLineNumbers
import { test, expect } from '@playwright/test';
import { mockLoginError, mockLoginOk } from './mocks';

// Las pruebas del login deben empezar SIN sesión
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

    // Next.js también usa un role="alert" propio: filtramos por el texto para elegir el nuestro
    await expect(page.getByRole('alert').filter({ hasText: 'Credenciales inválidas' })).toBeVisible();
    await expect(page).toHaveURL('/login');
});

test('sin sesión, entrar al dashboard lleva al login', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL('/login');
});
```

:::warning[Cuidado con `playwright/.auth/`]
`user.json` contiene el token guardado. Mantenlo en el `.gitignore` y nunca lo subas al repositorio.
:::

---

## 8. Las pruebas de la app

Los demás archivos usan lo que ya viste. Léelos como una lista de lo que la app promete.

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

    // Dentro del modal: "Cerrar" también coincide con "Cerrar Sesión" de la barra
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
    // Un nombre distinto en cada ejecución: la lista vive en la memoria del servidor
    const name = `Rutina de prueba ${Date.now()}`;

    await page.goto('/routines/new');
    await page.getByLabel('Nombre de la rutina').fill(name);
    await page.getByLabel('Nivel').selectOption('principiante');
    await page.getByLabel('Plancha').check();
    await page.getByLabel('Sentadilla').check();
    await page.getByRole('button', { name: 'Guardar rutina' }).click();

    // Después de guardar, la acción redirige a la lista y la rutina aparece en ella
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

Fíjate en tres decisiones:

| Decisión | Por qué |
| :--- | :--- |
| `Date.now()` en el nombre de la rutina | Los datos viven en la memoria del servidor y se comparten entre pruebas; un nombre distinto evita choques entre ejecuciones. |
| El tema se deja como estaba | Una prueba no debe cambiar el estado que otra espera. |
| Se prueba la **cookie** recargando | Recargar demuestra que el tema se recordó en el servidor, no solo en la pantalla. |

:::note[Datos compartidos entre pruebas]
Si la app guarda datos en memoria, todas las pruebas ven la misma lista. Usa nombres únicos al crear datos, o configura `workers: 1` en `playwright.config.ts` para que las pruebas corran una tras otra.
:::

---

## 9. Cuando una prueba falla

Se va a romper en algún momento. Estas son las herramientas para entender por qué:

| Herramienta | Comando | Para qué |
| :--- | :--- | :--- |
| **UI Mode** | `npx playwright test --ui` | Ejecutar y recorrer cada paso con una línea de tiempo y el DOM de cada momento. |
| **Inspector** | `npx playwright test --debug` | Ir paso a paso con el navegador visible. |
| **Ver el navegador** | `npx playwright test --headed` | Mirar la prueba mientras corre. |
| **Codegen** | `npx playwright codegen http://localhost:3000` | Grabar tus acciones y obtener código y localizadores. |
| **Reporte HTML** | `npx playwright show-report` | Ver qué pasó en la última ejecución. |
| **Trace Viewer** | `npx playwright show-trace <archivo>.zip` | Repetir una ejecución con DOM, red y consola. |
| **Una sola prueba** | `npx playwright test -g "modal"` | No ejecutar todo mientras depuras. |
| **Un solo archivo** | `npx playwright test e2e/login.spec.ts` | Ejecutar solo un archivo. |

:::tip[Empieza con `--ui`]
Es la forma más rápida de entender por qué falla una prueba: ves cada acción, el estado de la página antes y después, y los mensajes de error.
:::

## Errores comunes

| Síntoma | Causa | Solución |
| :--- | :--- | :--- |
| *strict mode violation: resolved to 2 elements* | El localizador coincide con más de un elemento. | Acótalo con otro localizador o usa `filter({ hasText })`. |
| `Timeout` esperando un elemento en la primera prueba | Next está compilando la página por primera vez en `npm run dev`. | Sube el `timeout`, abre la página una vez antes o prueba contra el build. |
| El login falla en la prueba pero funciona a mano | El backend real no está disponible o el patrón de `page.route` no coincide con la URL. | Revisa la dirección real en la pestaña Network y ajusta el patrón. |
| Las pruebas de rutas protegidas te mandan al login | El `setup` no guardó el estado o la configuración no lo usa. | Revisa `dependencies: ['setup']` y `storageState` en el proyecto. |
| `page.route` no intercepta nada | La petición se hace desde el **servidor** de Next, no desde el navegador. | Solo funciona con peticiones del cliente; usa un servidor de datos de prueba en el otro caso. |
| Una prueba pasa sola y falla junto a otras | Dependen de datos compartidos en memoria. | Usa nombres únicos, no dependas del orden o usa `workers: 1`. |
| `Executable doesn't exist` | Faltan los navegadores. | `npx playwright install`. |

## Retos

1. Escribe una prueba que verifique que, al cargar `/exercises?category=movilidad` directamente, solo aparecen ejercicios de movilidad.
2. Prueba que, en `/routines/new`, si llenas solo el nombre y envías, **el nombre sigue en el campo** y solo faltan el nivel y los ejercicios.
3. Escribe una prueba para `/api/routines`: usa `request` (`test('...', async ({ request }) => ...)`) y comprueba que `POST` con datos inválidos responde 400.
4. Cambia `webServer.command` a `npm run build && npm run start` y compara el tiempo total de la suite.
