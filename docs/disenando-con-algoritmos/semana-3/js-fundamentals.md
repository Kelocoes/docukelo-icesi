---
sidebar_position: 2
---

# Mega Guía de JavaScript para Principiantes

**Cómo usar esta guía:**

* Lee los conceptos en orden si eres completamente nuevo.
* Prueba los ejemplos en la consola del navegador (F12 → Console) o en Node.js.
* Resuelve los ejercicios y, si quieres, abre las soluciones escondidas con `<details>`.
---

## Tabla de contenidos

1. [¿Qué es JavaScript y dónde se ejecuta?](#que-es-javascript)
2. [Cómo ejecutar JavaScript (rápido)](#como-ejecutar)
3. [Tipos de datos](#tipos-de-datos)
4. [Variables (`var`, `let`, `const`)](#variables)
5. [Hoisting (levantar declaraciones)](#hoisting)
6. [Funciones (declaración, expresión, arrow)](#funciones)
7. [Control de flujo (`if`, `switch`)](#control-de-flujo)
8. [Bucles / Ciclos (`for`, `while`, `do...while`, `for...of`, `for...in`)](#bucles)
9. [`forEach` y `map` — cuándo y por qué](#foreach-map)
10. [Reference & Copying — valores por referencia y por valor](#referencia-copia)
11. [Destructuring (deconstrucción)](#destructuring)
12. [Temas extra y trucos útiles](#temas-extra)
13. [Ejercicios y soluciones](#ejercicios)
14. [Hoja rápida y pasos siguientes](#hoja-rapida)

---

## 1. ¿Qué es JavaScript y dónde se ejecuta? {#que-es-javascript}

JavaScript (JS) es un lenguaje de programación que se usa, sobre todo, para añadir interactividad a páginas web. Originalmente se ejecutaba únicamente en navegadores web (Chrome, Firefox, Safari), pero hoy también se usa fuera del navegador con Node.js—para crear servidores, herramientas y scripts.

* **Frontend (navegador):** manipular el DOM, responder a clics, animaciones.
* **Backend (Node.js):** servidores, APIs, tareas automatizadas.

JavaScript es **dinámico** (los tipos pueden cambiar en tiempo de ejecución) y **interpretado** (aunque los motores modernos lo compilan JIT para mejor rendimiento).

---

## 2. Cómo ejecutar JavaScript (rápido) {#como-ejecutar}

Tres formas sencillas:

1. **Consola del navegador:** abre una página web, presiona `F12` → pestaña "Console" y escribe `console.log('hola')`.
2. **Archivo .html** con un `<script>`:

```html
<!doctype html>
<html>
  <body>
    <script>
      console.log('Hola desde script en el HTML');
    </script>
  </body>
</html>
```

3. **Node.js:** instala Node y ejecuta `node archivo.js`.

---

## 3. Tipos de datos {#tipos-de-datos}

JavaScript tiene **tipos primitivos** y **objetos**.

### Tipos primitivos

* `Number` — números (enteros y decimales). Ej: `42`, `3.14`.
* `String` — texto. Ej: `'hola'`, `"mundo"`, `` `plantilla ${x}` ``.
* `Boolean` — `true` o `false`.
* `null` — ausencia intencional de valor.
* `undefined` — variable declarada pero sin valor.
* `Symbol` — identificadores únicos (avanzado).
* `BigInt` — enteros muy grandes: `123n`.

```js
console.log(typeof 42); // 'number'
console.log(typeof 'hola'); // 'string'
console.log(typeof null); // 'object'  <-- historic quirk
```

> Nota: `typeof null` devuelve `'object'` por compatibilidad histórica; considera `null` separado.

### Objetos

Colecciones de pares clave/valor: arrays, funciones, objetos literales.

```js
const persona = { nombre: 'Ana', edad: 30 };
const arr = [1, 2, 3];
```

---

## 4. Variables (`var`, `let`, `const`) {#variables}

JavaScript tiene tres maneras principales de declarar variables:

### `var`

* Antigua forma. Tiene **scope de función** — no de bloque.
* Está sujeta a hoisting (se "eleva").

```js
function ejemploVar() {
  if (true) {
    var x = 10;
  }
  console.log(x); // 10 — x está visible dentro de la función
}
```

### `let`

* Introducida en ES6 (2015).
* **Scope de bloque** (`{ ... }`).
* No permite redeclarar en el mismo scope.

```js
if (true) {
  let y = 5;
}
// console.log(y); // ReferenceError: y no está definida fuera del bloque
```

### `const`

* Igual que `let` (scope de bloque) pero **constante**: no se puede reasignar.
* **Ojo:** objetos declarados con `const` pueden modificarse internamente (mutación), solo la referencia no puede cambiar.

```js
const z = 3;
// z = 4; // TypeError: asignación a constante

const persona = { nombre: 'Luis' };
persona.nombre = 'María'; // válido — la referencia sigue siendo la misma
```

**Recomendación:** usa `const` por defecto, `let` cuando necesites reasignar, evita `var` en código moderno.

---

## 5. Hoisting (levantar declaraciones) {#hoisting}

El *hoisting* es el comportamiento donde las declaraciones de funciones y variables parecen moverse al inicio del scope.

### Ejemplos:

```js
console.log(a); // undefined
var a = 2;
```

¿Por qué `undefined` y no `ReferenceError`? Porque con `var`, la declaración `var a` se *hoistea* (sube) pero la asignación `= 2` queda en su lugar.

Con `let` y `const` sucede distinto:

```js
console.log(b); // ReferenceError: cannot access 'b' before initialization
let b = 3;
```

Las variables `let` y `const` están en lo que llamamos **Temporal Dead Zone (TDZ)** hasta que se ejecuta su declaración.

### Hoisting de funciones

```js
saludar(); // 'hola'
function saludar() { console.log('hola'); }
```

Las declaraciones de función se hoistean completamente (definición y todo), por eso se puede llamar antes.

---

## 6. Funciones {#funciones}

Las funciones son bloques de código que realizan tareas. JavaScript trata las funciones como **ciudadanos de primera clase** (pueden asignarse a variables, pasarse como argumentos y retornarse).

### Declaración de función

```js
function suma(a, b) {
  return a + b;
}
console.log(suma(2, 3)); // 5
```

### Expresión de función

```js
const resta = function(a, b) {
  return a - b;
};
console.log(resta(5, 2)); // 3
```

### Arrow functions (=>)

Sintaxis compacta introducida en ES6.

```js
const multiplicar = (a, b) => a * b;
console.log(multiplicar(3, 4)); // 12
```

**Diferencias clave:** las arrow functions no tienen su propio `this` ni `arguments` (útiles para callbacks y funciones pequeñas).

### Parámetros por defecto y rest

```js
function saludar(nombre = 'invitado') {
  console.log('Hola ' + nombre);
}

function sumaTodo(...nums) { // rest param
  return nums.reduce((acc, n) => acc + n, 0);
}
```

### Closure (cierres)

Una función puede recordar el entorno donde fue creada.

```js
function contador() {
  let cuenta = 0;
  return function() {
    cuenta++;
    return cuenta;
  }
}

const c = contador();
console.log(c()); // 1
console.log(c()); // 2  <- recuerda `cuenta`
```

Eso es un *closure*: la función interna mantiene acceso a `cuenta` aunque la ejecución de `contador()` haya terminado.

### IIFE (Immediately Invoked Function Expression)

```js
(function() {
  console.log('Esto se ejecuta inmediatamente');
})();
```

### Funciones como parámetros y retorno

```js
function operar(a, b, fn) {
  return fn(a, b);
}

operar(2, 3, (x, y) => x * y); // 6
```

---

## 7. Control de flujo (`if`, `switch`) {#control-de-flujo}

### `if / else`

```js
const edad = 18;
if (edad >= 18) {
  console.log('Eres mayor de edad');
} else {
  console.log('Eres menor de edad');
}
```

Ternario (forma compacta):

```js
const mensaje = edad >= 18 ? 'Mayor' : 'Menor';
```

### `switch` / `case`

Útil con múltiples opciones discretas.

```js
const dia = 'martes';
switch (dia) {
  case 'lunes':
    console.log('Empezamos la semana');
    break;
  case 'martes':
    console.log('Segundo día');
    break;
  default:
    console.log('Otro día');
}
```

**Ojo con `break`**: sin `break`, la ejecución cae (`fallthrough`) al siguiente caso.

---

## 8. Bucles / Ciclos {#bucles}

### `for` clásico

```js
for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

### `while`

```js
let i = 0;
while (i < 3) {
  console.log(i);
  i++;
}
```

### `do...while`

Se ejecuta al menos una vez.

```js
let n = 0;
do {
  console.log('ejecución', n);
  n++;
} while (n < 2);
```

### `for...of` (arrays y iterables)

```js
const arr = ['a', 'b', 'c'];
for (const letra of arr) {
  console.log(letra);
}
```

### `for...in` (propiedades de objetos)

```js
const obj = {x: 1, y: 2};
for (const k in obj) {
  console.log(k, obj[k]);
}
```

> `for...in` itera claves; `for...of` itera valores de colecciones iterables (arrays, strings).

---

## 9. `forEach` y `map` — cuándo y por qué {#foreach-map}

Ambos son métodos del prototype `Array`.

### `forEach`

* Ejecuta una función por cada elemento.
* **No devuelve** nada (retorna `undefined`).
* Ideal para efectos secundarios (p. ej. imprimir, modificar algo fuera del array).

```js
const nums = [1, 2, 3];
nums.forEach((n, i) => {
  console.log('Index', i, 'valor', n);
});
```

### `map`

* Transforma cada elemento y devuelve **un nuevo array** con los resultados.
* No modifica el array original a menos que lo reasignes.

```js
const dobles = nums.map(n => n * 2);
console.log(dobles); // [2, 4, 6]
```

**Comparación práctica:**

```js
const arr = [1, 2, 3];
const r1 = arr.forEach(x => x * 2); // r1 === undefined
const r2 = arr.map(x => x * 2); // r2 === [2,4,6]
```

### `filter`, `reduce` (mención rápida)

* `filter` devuelve un array con los elementos que pasan una condición.
* `reduce` acumula un resultado (suma, concatenación, etc.).

```js
const pares = arr.filter(x => x % 2 === 0);
const suma = arr.reduce((acc, x) => acc + x, 0);
```

**Buen patrón funcional:** encadenar `map` -> `filter` -> `reduce` para transformar datos sin mutarlos.

---

## 10. Reference & Copying — valores por referencia y por valor {#referencia-copia}

### Primitivos (por valor)

Los tipos primitivos (`number`, `string`, `boolean`, `null`, `undefined`, `symbol`, `bigint`) se copian **por valor**.

```js
let a = 5;
let b = a;
b = 10;
console.log(a); // 5 (no cambia)
```

### Objetos y arrays (por referencia)

Los objetos y arrays se copian **por referencia**: la variable almacena una referencia a la ubicación en memoria.

```js
const o1 = { x: 1 };
const o2 = o1;
o2.x = 2;
console.log(o1.x); // 2 — ambos apuntan al mismo objeto
```

### Copias superficiales (shallow copy)

* Arrays: `slice()`, spread `[...arr]`.
* Objetos: `Object.assign({}, obj)`, spread `{ ...obj }`.

```js
const a = [1, 2];
const b = [...a];
const o = { a: 1 };
const oCopy = { ...o };
```

**Aviso:** estas son *copias superficiales*. Si el objeto tiene objetos anidados, las subpropiedades siguen siendo referencias.

```js
const orig = { nested: { val: 1 } };
const shallow = { ...orig };
shallow.nested.val = 2;
console.log(orig.nested.val); // 2 -> ambas referencias apuntan al mismo nested
```

### Copia profunda (deep copy)

* `JSON.parse(JSON.stringify(obj))` (simple y común) — no funciona con funciones, `undefined`, `Date`, `RegExp`, `Map`, `Set`, `Symbol`.
* `structuredClone(obj)` — método moderno (si está disponible) para clonar de forma profunda.

```js
const deep = JSON.parse(JSON.stringify(orig));
deep.nested.val = 3;
console.log(orig.nested.val); // 2 (no cambia)
```

---

## 11. Destructuring (deconstrucción) {#destructuring}

Permite extraer valores de arrays u objetos en variables.

### Array destructuring

```js
const arr = [10, 20, 30];
const [a, b, c] = arr; // a=10, b=20, c=30
const [primero, ...resto] = arr; // primero=10, resto=[20,30]
```

### Object destructuring

```js
const persona = { nombre: 'Ana', edad: 25 };
const { nombre, edad } = persona;
// También puedes renombrar:
const { nombre: n, edad: e } = persona; // n='Ana', e=25
```

### Valores por defecto

```js
const [x = 1, y = 2] = [10]; // x=10, y=2
```

### Destructuring en parámetros de función

```js
function mostrar({ nombre, edad }) {
  console.log(nombre, edad);
}
mostrar({ nombre: 'Ana', edad: 25 });
```

---

## 12. Temas extra y trucos útiles {#temas-extra}

### Igualdad `==` vs `===`

* `==` hace coerción de tipos (intenta convertir).
* `===` compara estrictamente sin conversión. **Usa `===` por seguridad**.

```js
0 == false; // true
0 === false; // false
'' == false; // true
'' === false; // false
```

### Valores truthy / falsy

Falsy: `false`, `0`, `''` (cadena vacía), `null`, `undefined`, `NaN`.
Cualquier otro valor es truthy.

### Nullish coalescing `??`

Usa `??` para escoger el primer valor no `null`/`undefined`.

```js
const a = 0 ?? 5; // a = 0 (porque 0 no es null/undefined)
const b = null ?? 5; // b = 5
```

### Optional chaining `?.`

Evita errores si una parte intermedia es `null`/`undefined`.

```js
const user = { profile: null };
console.log(user.profile?.name); // undefined en vez de lanzar error
```

### Template literals

Interpolación con `` ` ``:

```js
const nombre = 'Ana';
console.log(`Hola ${nombre}`); // Hola Ana
```

### Spread operator

```js
const arr = [1,2];
const nuevo = [...arr, 3]; // [1,2,3]
const obj = { a: 1 };
const obj2 = { ...obj, b: 2 };
```

---

## 13. Ejercicios y soluciones {#ejercicios}

### Ejercicio 1 — Variables y tipos

Declara una variable `nombre` con tu nombre y otra `edad` con un número. Muestra en consola: `Hola, soy <nombre> y tengo <edad> años`.

<details>
<summary>Solución</summary>

```js
const nombre = 'María';
const edad = 28;
console.log(`Hola, soy ${nombre} y tengo ${edad} años`);
```

</details>

### Ejercicio 2 — Funciones y closures

Crea una función `hacerSaludo` que reciba `saludo` y retorne otra función que reciba `nombre` y muestre el saludo completo.

<details>
<summary>Solución</summary>

```js
function hacerSaludo(saludo) {
  return function(nombre) {
    console.log(`${saludo}, ${nombre}`);
  }
}
const hola = hacerSaludo('Hola');
hola('Carlos'); // "Hola, Carlos"
```

</details>

### Ejercicio 3 — `map` vs `forEach`

Tienes `const nums = [1,2,3,4]`.

* Usa `forEach` para imprimir el doble de cada número.
* Usa `map` para crear un nuevo array con los números al cuadrado.

<details>
<summary>Solución</summary>

```js
const nums = [1,2,3,4];
nums.forEach(n => console.log(n * 2));
const cuadrados = nums.map(n => n * n);
console.log(cuadrados); // [1,4,9,16]
```

</details>

### Ejercicio 4 — Reference & Copying

Crea un objeto `original = { a: 1, nested: { b: 2 } }`. Haz una copia superficial y una profunda. Modifica `nested.b` en la copia superficial y observa el efecto en `original`. Luego modifica `nested.b` en la copia profunda y comprueba.

<details>
<summary>Solución</summary>

```js
const original = { a: 1, nested: { b: 2 } };
const copyShallow = { ...original };
copyShallow.nested.b = 3;
console.log(original.nested.b); // 3 -> cambió

const copyDeep = JSON.parse(JSON.stringify(original));
copyDeep.nested.b = 4;
console.log(original.nested.b); // 3 -> no cambió
```

</details>

---
