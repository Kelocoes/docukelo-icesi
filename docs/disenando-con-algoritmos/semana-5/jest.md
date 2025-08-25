---
sidebar_position: 4
---

# Guía de Jest en JS

## ¿Qué es Jest?

Jest es un **framework de testing** desarrollado por Facebook, pensado originalmente para proyectos con React, pero que puedes usar con cualquier aplicación de **JavaScript**.  
Es rápido, tiene una sintaxis muy intuitiva y viene con muchas funcionalidades listas para usar.

---

## Instalación

Primero, asegúrate de tener **Node.js** y **npm** instalados en tu máquina.

En tu proyecto, corre este comando:

```bash
npm install --save-dev jest
```

Luego, en tu archivo `package.json`, agrega el script:

```json
"scripts": {
  "test": "jest"
}
```

Pero, hace falta donde lo vamos a probar, así que lo vamos a hacerlo paso a paso:

---

## Tu primer test

Crea un archivo con el nombre `suma.js`:

```js
// Definimos una función llamada 'suma' que recibe dos parámetros y devuelve la suma de estos
function suma(a, b) {
  return a + b;
}

// Exportamos la función 'suma' para que pueda ser usada en otros archivos
module.exports = suma;
```

Ahora, crea el archivo `suma.test.js`:

```js
// Importamos la función 'suma' desde el archivo suma.js
// Esto nos permite usar esa función dentro de nuestro test.
const suma = require("./suma");

// Aquí definimos un test con Jest.

// El primer parámetro es una descripción (no es obligatorio).
test("la función suma debe devolver la suma de dos números", () => {
  // El segundo parámetro es una función que contiene las expectativas del test.
  expect(suma(2, 3)).toBe(5);
  // Usamos 'expect' para indicar el resultado esperado.
  // Estamos llamando a suma(2, 3) y verificamos que el resultado sea exactamente 5.
  // '.toBe(5)' comprueba igualdad estricta (===).
});
```

Corre el test con:

```bash
npm test
```

¡Y listo! Si todo va bien, verás un mensajito verde que te diga "PASS" ✅

---

## Conceptos importantes

### 1. Matchers

- **toBe** → compara valores primitivos

```js
expect(2 + 2).toBe(4);
```

- **toEqual** → compara objetos/arrays

```js
expect({ nombre: "Pedro" }).toEqual({ nombre: "Pedro" });
```

- **toBeNull / toBeUndefined / toBeDefined**

```js
expect(null).toBeNull();
```

- **toContain**

```js
expect(["rojo", "azul"]).toContain("rojo");
```

- **toBeGreaterThan / toBeLessThan**

```js
expect(10).toBeGreaterThan(5);
```

---

### 2. Agrupar tests con `describe`

Sirve para organizar mejor tus pruebas:

```js
describe("Operaciones matemáticas", () => {
  test("suma", () => {
    expect(2 + 2).toBe(4);
  });

  test("resta", () => {
    expect(5 - 3).toBe(2);
  });
});
```

### 3. Before & After Hooks

Puedes preparar o limpiar cosas antes y después de tus tests:

```js
beforeAll(() => {
  console.log("Se ejecuta una vez ANTES de todos los tests");
});

beforeEach(() => {
  console.log("Se ejecuta una vez ANTES de cada tests");
});

afterAll(() => {
  console.log("Se ejecuta una vez DESPUÉS de todos los tests");
});

afterEach(() => {
  console.log("Se ejecuta una vez DESPUÉS de cada tests");
});
```

### 4. Mocks

A veces no quieres usar funciones reales (por ejemplo, llamadas a una API). Para eso están los _mocks_:

```js
// Creamos una función "falsa" (mock) con Jest.
// jest.fn() nos da una función vacía que podemos usar para pruebas.
const fakeFn = jest.fn();

// Llamamos a la función falsa pasando el argumento 'Hola'.
// Esto queda registrado dentro del mock (Jest guarda cada vez que se llamó y con qué argumentos).
fakeFn("Hola");

// Verificamos que la función haya sido llamada al menos una vez.
// Si nunca la hubiéramos ejecutado, este test fallaría.
expect(fakeFn).toHaveBeenCalled();

// Verificamos que la función haya sido llamada específicamente con el argumento 'Hola'.
// Si la llamamos con otro valor (ej: 'Chao'), este test fallaría.
expect(fakeFn).toHaveBeenCalledWith("Hola");
```

Ejemplo con un módulo:

```js
// Le decimos a Jest que "mockee" (simule) el módulo './api'.
// Eso significa que en lugar de usar las funciones reales de ese archivo,
// Jest creará versiones falsas (mocks) que podemos controlar.
jest.mock("./api");

// Importamos el módulo 'api'. Como ya lo mockeamos arriba,
// lo que recibimos aquí son esas funciones simuladas.
const api = require("./api");

test("usa el mock", () => {
  // Configuramos el mock para que, cuando alguien llame a api.getData(),
  // no ejecute la lógica real, sino que devuelva una promesa resuelta con "dato falso".
  api.getData.mockResolvedValue("dato falso");

  // Llamamos a la función simulada (api.getData()).
  // Como es un mock configurado, devolverá la promesa con "dato falso".
  return api.getData().then((data) => {
    // Aquí comprobamos que el valor devuelto efectivamente sea "dato falso".
    expect(data).toBe("dato falso");
  });
});
```

## Tests asíncronos

El mundo real está lleno de cosas asíncronas (APIs, llamadas a bases de datos, timers, etc.).  
En Jest hay varias formas de testear código asíncrono: con **callbacks**, con **promesas** y con **async/await**.

---

### 1. Con Callbacks

Algunas funciones no devuelven promesas, sino que usan un **callback** para entregar el resultado.  
En Jest, para estos casos se usa el parámetro especial `done`, que le dice a Jest cuándo terminar el test:

```js
function fetchDataCallback(callback) {
  setTimeout(() => {
    callback("datos");
  }, 100);
}

test('fetchDataCallback devuelve "datos" usando callback', (done) => {
  fetchDataCallback((data) => {
    expect(data).toBe("datos");
    done(); // Le decimos a Jest que ya puede dar el test como terminado
  });
});
```

---

### 2. Con Promesas

Si la función devuelve una **Promise**, podemos devolverla directamente en el test.  
Jest esperará a que se resuelva antes de dar el test como terminado:

```js
function fetchDataPromise() {
  return Promise.resolve("datos");
}

test('fetchDataPromise devuelve "datos" con promesa', () => {
  return fetchDataPromise().then((data) => {
    expect(data).toBe("datos");
  });
});
```

También puedes testear que una promesa falle usando `.catch` o el matcher `rejects`:

```js
function fetchDataError() {
  return Promise.reject("error");
}

test('fetchDataPromise rechaza con "error"', () => {
  return expect(fetchDataError()).rejects.toBe("error");
});
```

---

### 3. Con Async/Await (lo más limpio ✨)

La forma más moderna y clara es usar **async/await**.  
Solo marcas el test como `async` y usas `await` para esperar el resultado:

```js
function fetchDataAsync() {
  return Promise.resolve("datos");
}

test('fetchDataAsync devuelve "datos" con async/await', async () => {
  const data = await fetchDataAsync();
  expect(data).toBe("datos");
});
```

Y para errores, simplemente usas `try/catch` o el matcher `rejects`:

```js
async function fetchDataAsyncError() {
  throw new Error("error");
}

test("fetchDataAsync lanza error", async () => {
  await expect(fetchDataAsyncError()).rejects.toThrow("error");
});
```

En resumen:

- **Callbacks** → usa `done()` para indicar cuándo terminó el test.
- **Promesas** → devuelve la promesa en el test.
- **Async/Await** → más legible; usa `await` y `rejects`.

---

## Prácticas recomendadas

A veces no quieres correr **todos** los tests, solo enfocarte en uno en
particular (porque el bug anda escondido ahí 👀).\
Para eso Jest te da dos súperpoderes:

### `test.only(...)`

Corre únicamente ese test y se olvida de los demás. Útil cuando estás
depurando un caso específico.

```js
test.only("suma correctamente 2 + 2", () => {
  expect(2 + 2).toBe(4);
});

test("este test se ignora temporalmente", () => {
  expect(true).toBe(false);
});
```

En este ejemplo, solo el primer test se ejecutará.

---

### `test.skip(...)`

Salta un test que no quieres ejecutar en ese momento (por ejemplo,
porque aún no está listo o depende de algo externo).

```js
test.skip("esto lo haremos después", () => {
  expect("hola").toBe("adiós");
});
```

El test queda marcado como _skipped_, así no molesta en los resultados.

---

### `describe.only` y `describe.skip`

Los bloques `describe` sirven para agrupar tests, sí. Pero también tienen `.only`
y `.skip` para controlar qué conjuntos de pruebas se ejecutan.

```js
describe.only("grupo especial", () => {
  test("ejecuta este", () => {
    expect(1 + 1).toBe(2);
  });

  test("también este", () => {
    expect(2 * 2).toBe(4);
  });
});

describe.skip("grupo en pausa", () => {
  test("ignorado", () => {
    expect(true).toBe(false);
  });
});
```

Con esto, puedes depurar solo un bloque de pruebas y dejar otros en
pausa sin borrarlos.

---

## Cobertura de código

La **cobertura de código** mide qué tanto de tu código está siendo probado por tus tests.  
Jest trae esta funcionalidad integrada y es muy fácil de usar.

Para generar un reporte de cobertura, simplemente corre:

```bash
npm test -- --coverage
```

Esto mostrará en consola qué porcentaje de tu código está cubierto por tests (líneas, funciones, ramas, etc.).  
Además, Jest generará una carpeta llamada `coverage` con un reporte en **HTML** que puedes abrir en tu navegador con el `index.html`.

👉 Ejemplo de salida en consola:

```
File        | % Stmts | % Branch | % Funcs | % Lines
------------|---------|----------|---------|---------
All files   |   85.71 |    75    |   80    |   85.71
```

---

## Consejos finales

- **Empieza simple**: no necesitas testear todo de una vez. Ve agregando pruebas poco a poco.
- **Usa nombres claros en tus tests** : deben explicar lo que esperas que suceda.
- **Confía en los mocks cuando trabajes con APIs o recursos externos** : te dan control y velocidad.
- **No te obsesiones con el 100% de cobertura**: es una métrica útil, pero lo importante es la calidad de los tests.
- **Integra los tests en tu flujo diario**: correrlos seguido evita sorpresas desagradables más adelante.
- **No pruebes cosas obvias**: como por ejemplo `expect(true).toBe(true)`.

---

## Recursos adicionales 📚

- [Documentación oficial de
  Jest](https://jestjs.io/docs/getting-started)
- [Cheatsheet rápida de Jest](https://devhints.io/jest)
- [Ejemplos prácticos en el
  GitHub de Jest](https://github.com/facebook/jest/tree/main/examples)
