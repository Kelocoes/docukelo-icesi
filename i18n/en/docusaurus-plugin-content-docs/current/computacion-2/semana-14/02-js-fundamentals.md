---
sidebar_position: 2
description: "Learn the fundamentals of JavaScript: where it runs, how to run it, data types, and the basic structures of the language."
---

# JavaScript Fundamentals

**How to use this guide:**

- Read the concepts in order if you are completely new.
- Try the examples in the browser console (F12 → Console) or in Node.js.
- Solve the exercises and, if you want, open the hidden solutions with `<details>`.

---

## Table of contents

1. [What is JavaScript and where does it run?](#que-es-javascript)
2. [How to run JavaScript (quick)](#como-ejecutar)
3. [Data types](#tipos-de-datos)
4. [Variables (`var`, `let`, `const`)](#variables)
5. [Hoisting (lifting declarations)](#hoisting)
6. [Functions (declaration, expression, arrow)](#funciones)
7. [Control flow (`if`, `switch`)](#control-de-flujo)
8. [Loops (`for`, `while`, `do...while`, `for...of`, `for...in`)](#bucles)
9. [`forEach` and `map` — when and why](#foreach-map)
10. [Reference & Copying — values by reference and by value](#referencia-copia)
11. [Destructuring](#destructuring)
12. [Extra topics and useful tricks](#temas-extra)
13. [Exercises and solutions](#ejercicios)
14. [Cheat sheet and next steps](#hoja-rapida)

---

## 1. What is JavaScript and where does it run? {#que-es-javascript}

JavaScript (JS) is a programming language used, above all, to add interactivity to web pages. It originally ran only in web browsers (Chrome, Firefox, Safari), but today it is also used outside the browser with Node.js—to build servers, tools, and scripts.

- **Frontend (browser):** manipulate the DOM, respond to clicks, animations.
- **Backend (Node.js):** servers, APIs, automated tasks.

JavaScript is **dynamic** (types can change at runtime) and **interpreted** (although modern engines JIT-compile it for better performance).

---

## 2. How to run JavaScript (quick) {#como-ejecutar}

Three simple ways:

1. **Browser console:** open a web page, press `F12` → "Console" tab and type `console.log('hello')`.
2. **An .html file** with a `<script>`:

```html title="How to run JavaScript (quick)"
<!doctype html>
<html>
    <body>
        <script>
            console.log("Hello from a script in the HTML");
        </script>
    </body>
</html>
```

3. **Node.js:** install Node and run `node file.js`.

---

## 3. Data types {#tipos-de-datos}

JavaScript has **primitive types** and **objects**.

### Primitive types

- `Number` — numbers (integers and decimals). E.g.: `42`, `3.14`.
- `String` — text. E.g.: `'hello'`, `"world"`, `` `template ${x}` ``.
- `Boolean` — `true` or `false`.
- `null` — intentional absence of a value.
- `undefined` — variable declared but without a value.
- `Symbol` — unique identifiers (advanced).
- `BigInt` — very large integers: `123n`.

```js title="Primitive types"
console.log(typeof 42); // 'number'
console.log(typeof "hello"); // 'string'
console.log(typeof null); // 'object'  <-- historic quirk
```

> Note: `typeof null` returns `'object'` for historical compatibility; consider `null` as a separate type.

### Objects

Collections of key/value pairs: arrays, functions, object literals.

```js title="Objects"
const persona = { nombre: "Ana", edad: 30 };
const arr = [1, 2, 3];
```

---

## 4. Variables (`var`, `let`, `const`) {#variables}

JavaScript has three main ways to declare variables:

### `var`

- The old way. It has **function scope** — not block scope.
- It is subject to hoisting (it gets "lifted").

```js title="var"
function ejemploVar() {
    if (true) {
        var x = 10;
    }
    console.log(x); // 10 — x is visible inside the function
}
```

### `let`

- Introduced in ES6 (2015).
- **Block scope** (`{ ... }`).
- Does not allow redeclaration in the same scope.

```js title="let"
if (true) {
    let y = 5;
}
// console.log(y); // ReferenceError: y is not defined outside the block
```

### `const`

- Same as `let` (block scope) but **constant**: it cannot be reassigned.
- **Watch out:** objects declared with `const` can be modified internally (mutation); only the reference cannot change.

```js title="const"
const z = 3;
// z = 4; // TypeError: assignment to a constant

const persona = { nombre: "Luis" };
persona.nombre = "María"; // valid — the reference is still the same
```

**Recommendation:** use `const` by default, `let` when you need to reassign, and avoid `var` in modern code.

---

## 5. Hoisting (lifting declarations) {#hoisting}

_Hoisting_ is the behavior where function and variable declarations appear to move to the top of the scope.

### Examples:

```js title="Hoisting"
console.log(a); // undefined
var a = 2;
```

Why `undefined` and not `ReferenceError`? Because with `var`, the declaration `var a` is _hoisted_ (lifted) but the assignment `= 2` stays in place.

With `let` and `const` it works differently:

```js title="Hoisting (2)"
console.log(b); // ReferenceError: cannot access 'b' before initialization
let b = 3;
```

`let` and `const` variables are in what we call the **Temporal Dead Zone (TDZ)** until their declaration is executed.

### Function hoisting

```js title="Function hoisting"
saludar(); // 'hello'
function saludar() {
    console.log("hello");
}
```

Function declarations are fully hoisted (definition and all), which is why you can call them beforehand.

---

## 6. Functions {#funciones}

Functions are blocks of code that perform tasks. JavaScript treats functions as **first-class citizens** (they can be assigned to variables, passed as arguments, and returned).

### Function declaration

```js title="Function declaration"
function suma(a, b) {
    return a + b;
}
console.log(suma(2, 3)); // 5
```

### Function expression

```js title="Function expression"
const resta = function (a, b) {
    return a - b;
};
console.log(resta(5, 2)); // 3
```

### Arrow functions (=>)

Compact syntax introduced in ES6.

```js title="Arrow functions (=>)"
const multiplicar = (a, b) => a * b;
console.log(multiplicar(3, 4)); // 12
```

**Key differences:** arrow functions have no `this` or `arguments` of their own (useful for callbacks and small functions).

### Default and rest parameters

```js title="Default and rest parameters"
function saludar(nombre = "guest") {
    console.log("Hello " + nombre);
}

function sumaTodo(...nums) {
    // rest param
    return nums.reduce((acc, n) => acc + n, 0);
}
```

### Closure

A function can remember the environment where it was created.

```js title="Closure"
function contador() {
    let cuenta = 0;
    return function () {
        cuenta++;
        return cuenta;
    };
}

const c = contador();
console.log(c()); // 1
console.log(c()); // 2  <- remembers `cuenta`
```

That is a _closure_: the inner function keeps access to `cuenta` even after the execution of `contador()` has finished.

### IIFE (Immediately Invoked Function Expression)

```js title="IIFE"
(function () {
    console.log("This runs immediately");
})();
```

### Functions as parameters and return values

```js title="Functions as parameters and return values"
function operar(a, b, fn) {
    return fn(a, b);
}

operar(2, 3, (x, y) => x * y); // 6
```

---

## 7. Control flow (`if`, `switch`) {#control-de-flujo}

### `if / else`

```js title="if / else"
const edad = 18;
if (edad >= 18) {
    console.log("You are an adult");
} else {
    console.log("You are a minor");
}
```

Ternary (compact form):

```js title="if / else"
const mensaje = edad >= 18 ? "Adult" : "Minor";
```

### `switch` / `case`

Useful with multiple discrete options.

```js title="switch / case"
const dia = "tuesday";
switch (dia) {
    case "monday":
        console.log("We start the week");
        break;
    case "tuesday":
        console.log("Second day");
        break;
    default:
        console.log("Another day");
}
```

**Watch out for `break`**: without `break`, execution falls through (`fallthrough`) to the next case.

---

## 8. Loops {#bucles}

### Classic `for`

```js title="Classic for"
for (let i = 0; i < 5; i++) {
    console.log(i);
}
```

### `while`

```js title="while"
let i = 0;
while (i < 3) {
    console.log(i);
    i++;
}
```

### `do...while`

It runs at least once.

```js title="do...while"
let n = 0;
do {
    console.log("execution", n);
    n++;
} while (n < 2);
```

### `for...of` (arrays and iterables)

```js title="for...of (arrays and iterables)"
const arr = ["a", "b", "c"];
for (const letra of arr) {
    console.log(letra);
}
```

### `for...in` (object properties)

```js title="for...in (object properties)"
const obj = { x: 1, y: 2 };
for (const k in obj) {
    console.log(k, obj[k]);
}
```

> `for...in` iterates keys; `for...of` iterates values of iterable collections (arrays, strings).

---

## 9. `forEach` and `map` — when and why {#foreach-map}

Both are methods of the `Array` prototype.

### `forEach`

- Runs a function for each element.
- It **returns nothing** (returns `undefined`).
- Ideal for side effects (e.g., printing, modifying something outside the array).

```js title="forEach"
const nums = [1, 2, 3];
nums.forEach((n, i) => {
    console.log("Index", i, "value", n);
});
```

### `map`

- Transforms each element and returns **a new array** with the results.
- It does not modify the original array unless you reassign it.

```js title="map"
const dobles = nums.map((n) => n * 2);
console.log(dobles); // [2, 4, 6]
```

**Practical comparison:**

```js title="map (2)"
const arr = [1, 2, 3];
const r1 = arr.forEach((x) => x * 2); // r1 === undefined
const r2 = arr.map((x) => x * 2); // r2 === [2,4,6]
```

### `filter`, `reduce` (quick mention)

- `filter` returns an array with the elements that pass a condition.
- `reduce` accumulates a result (sum, concatenation, etc.).

```js title="filter, reduce (quick mention)"
const pares = arr.filter((x) => x % 2 === 0);
const suma = arr.reduce((acc, x) => acc + x, 0);
```

**Good functional pattern:** chain `map` -> `filter` -> `reduce` to transform data without mutating it.

---

## 10. Reference & Copying — values by reference and by value {#referencia-copia}

### Primitives (by value)

Primitive types (`number`, `string`, `boolean`, `null`, `undefined`, `symbol`, `bigint`) are copied **by value**.

```js title="Primitives (by value)"
let a = 5;
let b = a;
b = 10;
console.log(a); // 5 (does not change)
```

### Objects and arrays (by reference)

Objects and arrays are copied **by reference**: the variable stores a reference to the location in memory.

```js title="Objects and arrays (by reference)"
const o1 = { x: 1 };
const o2 = o1;
o2.x = 2;
console.log(o1.x); // 2 — both point to the same object
```

### Shallow copies

- Arrays: `slice()`, spread `[...arr]`.
- Objects: `Object.assign({}, obj)`, spread `{ ...obj }`.

```js title="Shallow copies"
const a = [1, 2];
const b = [...a];
const o = { a: 1 };
const oCopy = { ...o };
```

**Warning:** these are _shallow copies_. If the object has nested objects, the sub-properties are still references.

```js title="Shallow copies (2)"
const orig = { nested: { val: 1 } };
const shallow = { ...orig };
shallow.nested.val = 2;
console.log(orig.nested.val); // 2 -> both references point to the same nested
```

### Deep copy

- `JSON.parse(JSON.stringify(obj))` (simple and common) — does not work with functions, `undefined`, `Date`, `RegExp`, `Map`, `Set`, `Symbol`.
- `structuredClone(obj)` — modern method (if available) to clone deeply.

```js title="Deep copy"
const deep = JSON.parse(JSON.stringify(orig));
deep.nested.val = 3;
console.log(orig.nested.val); // 2 (does not change)
```

---

## 11. Destructuring {#destructuring}

It lets you extract values from arrays or objects into variables.

### Array destructuring

```js title="Array destructuring"
const arr = [10, 20, 30];
const [a, b, c] = arr; // a=10, b=20, c=30
const [primero, ...resto] = arr; // primero=10, resto=[20,30]
```

### Object destructuring

```js title="Object destructuring"
const persona = { nombre: "Ana", edad: 25 };
const { nombre, edad } = persona;
// You can also rename:
const { nombre: n, edad: e } = persona; // n='Ana', e=25
```

### Default values

```js title="Default values"
const [x = 1, y = 2] = [10]; // x=10, y=2
```

### Destructuring in function parameters

```js title="Destructuring in function parameters"
function mostrar({ nombre, edad }) {
    console.log(nombre, edad);
}
mostrar({ nombre: "Ana", edad: 25 });
```

---

## 12. Extra topics and useful tricks {#temas-extra}

### Equality `==` vs `===`

- `==` performs type coercion (it tries to convert).
- `===` compares strictly without conversion. **Use `===` for safety**.

```js title="Equality == vs ==="
0 == false; // true
0 === false; // false
"" == false; // true
"" === false; // false
```

### Truthy / falsy values

Falsy: `false`, `0`, `''` (empty string), `null`, `undefined`, `NaN`.
Any other value is truthy.

### Nullish coalescing `??`

Use `??` to pick the first value that is not `null`/`undefined`.

```js title="Nullish coalescing"
const a = 0 ?? 5; // a = 0 (because 0 is not null/undefined)
const b = null ?? 5; // b = 5
```

### Optional chaining `?.`

It avoids errors if an intermediate part is `null`/`undefined`.

```js title="Optional chaining ?."
const user = { profile: null };
console.log(user.profile?.name); // undefined instead of throwing an error
```

### Template literals

Interpolation with `` ` ``:

```js title="Template literals"
const nombre = "Ana";
console.log(`Hello ${nombre}`); // Hello Ana
```

### Spread operator

```js title="Spread operator"
const arr = [1, 2];
const nuevo = [...arr, 3]; // [1,2,3]
const obj = { a: 1 };
const obj2 = { ...obj, b: 2 };
```

---

## 13. Exercises and solutions {#ejercicios}

### Exercise 1 — Variables and types

Declare a variable `nombre` with your name and another one `edad` with a number. Print to the console: `Hello, I'm <name> and I'm <age> years old`.

<details>
<summary>Solution</summary>

```js title="Exercise 1 — Variables and types"
const nombre = "María";
const edad = 28;
console.log(`Hello, I'm ${nombre} and I'm ${edad} years old`);
```

</details>

### Exercise 2 — Functions and closures

Create a function `hacerSaludo` that receives `saludo` and returns another function that receives `nombre` and prints the full greeting.

<details>
<summary>Solution</summary>

```js title="Exercise 2 — Functions and closures"
function hacerSaludo(saludo) {
    return function (nombre) {
        console.log(`${saludo}, ${nombre}`);
    };
}
const hola = hacerSaludo("Hello");
hola("Carlos"); // "Hello, Carlos"
```

</details>

### Exercise 3 — `map` vs `forEach`

You have `const nums = [1,2,3,4]`.

- Use `forEach` to print the double of each number.
- Use `map` to create a new array with the squared numbers.

<details>
<summary>Solution</summary>

```js title="Exercise 3 — map vs forEach"
const nums = [1, 2, 3, 4];
nums.forEach((n) => console.log(n * 2));
const cuadrados = nums.map((n) => n * n);
console.log(cuadrados); // [1,4,9,16]
```

</details>

### Exercise 4 — Reference & Copying

Create an object `original = { a: 1, nested: { b: 2 } }`. Make a shallow copy and a deep copy. Modify `nested.b` in the shallow copy and observe the effect on `original`. Then modify `nested.b` in the deep copy and check.

<details>
<summary>Solution</summary>

```js title="Exercise 4 — Reference & Copying"
const original = { a: 1, nested: { b: 2 } };
const copyShallow = { ...original };
copyShallow.nested.b = 3;
console.log(original.nested.b); // 3 -> it changed

const copyDeep = JSON.parse(JSON.stringify(original));
copyDeep.nested.b = 4;
console.log(original.nested.b); // 3 -> it did not change
```

</details>

---

## 14. Cheat sheet and next steps {#hoja-rapida}

### Quick Summary (Cheat Sheet)

| Concept | Syntax | Description |
| :--- | :--- | :--- |
| **Variables** | `let x = 1; const y = 2;` | `let` for reassignable values, `const` for constants. |
| **Functions** | `const f = (a) => a * 2;` | Compact, modern arrow functions. |
| **Loop** | `for (const item of array)` | Iterates over the elements of an array. |
| **Transform** | `array.map(n => n * 2)` | Returns a new, modified array. |
| **Copies** | `const copia = { ...original }` | Shallow copy using the spread operator. |

### Next Steps

1. Practice the previous exercises in your browser console.
2. Explore how to connect JavaScript with HTML using the DOM (Document Object Model).
3. Continue with the introduction to React guide to build dynamic interfaces.
