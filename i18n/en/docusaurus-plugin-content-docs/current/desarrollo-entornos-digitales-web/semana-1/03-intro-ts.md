---
sidebar_position: 3
description: "Learn to install and use TypeScript: basic types, functions, interfaces, classes, generics and modules to write safer JavaScript code."
---

# TypeScript

TypeScript is a **superset of JavaScript** developed by Microsoft that adds **static typing** and other modern features to improve the quality, maintainability and scalability of your code. This means that **all valid JavaScript code is also valid TypeScript code**, and TypeScript also gives you additional tools.

## 1. Why use TypeScript?

JavaScript is a flexible and dynamic language, but that flexibility can lead to errors that are hard to detect. TypeScript helps you prevent them **before running the code** thanks to static typing and more powerful development tools.

**Main advantages:**

- Static typing (prevents common type errors).
- Autocompletion and better support in editors such as VS Code.
- Error detection at compile time.
- Use of modern JavaScript features even before they are supported by all browsers.
- Code that is easier to maintain.

**Example of a problem in JavaScript:**

```javascript title="Why use TypeScript"
function sumar(a, b) {
  return a + b;
}

console.log(sumar(5, "10")); // "510" instead of 15
```

**Solution in TypeScript:**

```typescript title="Why use TypeScript (solution)"
function sumar(a: number, b: number): number {
  return a + b;
}

// console.log(sumar(5, "10")); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
console.log(sumar(5, 10)); // 15
```

---

## 2. Basic installation and setup

### 2.1 Global installation

We need Node.js and npm installed.

```bash
npm install -g typescript
```

Verify the installation:

```bash
tsc -v
```

### 2.2 Initialize a project with TypeScript

```bash title="Initialize a project with TypeScript"
mkdir proyecto-ts
cd proyecto-ts
npm init -y
npm install typescript --save-dev
```

Generate the `tsconfig.json` configuration file:

```bash
npx tsc --init
```

This will create a file with many commented options. The most important ones to get started:

```json title="Initialize a project (solution)"
{
  "compilerOptions": {
    "target": "es6",               // JS version to generate
    "module": "commonjs",          // Module system
    "outDir": "./dist",            // Output folder
    "rootDir": "./src",            // Source code folder
    "strict": true,                 // Enable all strict checks
    "esModuleInterop": true         // Better module compatibility
  }
}
```

Recommended project structure:

```
proyecto-ts/
├── src/
│   └── index.ts
├── dist/
├── package.json
└── tsconfig.json
```

### 2.3 Compile and run

To compile:

```bash
npx tsc
```

This will generate `.js` files in `dist/`.

To run:

```bash
node dist/index.js
```

If we want to compile and run in a single step, we can use `ts-node`:

```bash
npm install -D ts-node
npx ts-node src/index.ts
```

---

## 3. Basic types in TypeScript

TypeScript adds static types that let us define what kind of data we expect.

```typescript title="Basic types in TypeScript"
let nombre: string = "Kevin";
let edad: number = 25;
let activo: boolean = true;
let indefinido: undefined = undefined;
let nulo: null = null;
let cualquiera: any = "Hello"; // Avoid whenever possible
```

**Arrays:**

```typescript title="Basic types in TypeScript (solution)"
let numeros: number[] = [1, 2, 3];
let letras: Array<string> = ["a", "b", "c"];
```

**Tuples:**

```typescript title="Basic types in TypeScript (3)"
let persona: [string, number] = ["Kevin", 25];
```

**Enums:**

```typescript title="Basic types in TypeScript (4)"
enum Color {
  Rojo = "ROJO",
  Verde = "VERDE",
  Azul = "AZUL"
}

let colorFav: Color = Color.Verde;
console.log(colorFav); // "VERDE"
```

**Union types:**

```typescript title="Basic types in TypeScript (5)"
let id: string | number;
id = "ABC123";
id = 42;
```

**Type aliases:**

```typescript title="Basic types in TypeScript (6)"
type ID = string | number;
let usuarioID: ID = 101;
```

---

## 4. Functions in TypeScript

We can type parameters and return values.

```typescript title="Functions in TypeScript"
function saludar(nombre: string): string {
  return `Hello, ${nombre}`;
}

console.log(saludar("Kevin"));
```

Optional and default parameters:

```typescript title="Functions in TypeScript (solution)"
function multiplicar(a: number, b: number = 2, mensaje?: string): number {
  if (mensaje) console.log(mensaje);
  return a * b;
}

console.log(multiplicar(3));
console.log(multiplicar(3, 4, "Calculating..."));
```

Arrow functions:

```typescript title="Functions in TypeScript (3)"
const dividir = (a: number, b: number): number => a / b;
```

---

## 5. Interfaces and Objects

Interfaces define the shape of an object.

```typescript title="Interfaces and Objects"
interface Usuario {
  id: number;
  nombre: string;
  activo?: boolean; // optional
}

let user1: Usuario = {
  id: 1,
  nombre: "Kevin"
};
```

Interfaces with functions:

```typescript title="Interfaces and Objects (solution)"
interface Operacion {
  (a: number, b: number): number;
}

const sumar: Operacion = (x, y) => x + y;
console.log(sumar(5, 3));
```

---

## 6. Classes in TypeScript

```typescript title="Classes in TypeScript"
class Persona {
  private nombre: string;
  protected edad: number;
  public activo: boolean;

  constructor(nombre: string, edad: number, activo: boolean) {
    this.nombre = nombre;
    this.edad = edad;
    this.activo = activo;
  }

  saludar(): string {
    return `Hello, I am ${this.nombre}`;
  }
}

const p1 = new Persona("Kevin", 25, true);
console.log(p1.saludar());
```

Inheritance:

```typescript title="Classes in TypeScript (solution)"
class Estudiante extends Persona {
  curso: string;
  constructor(nombre: string, edad: number, activo: boolean, curso: string) {
    super(nombre, edad, activo);
    this.curso = curso;
  }
}
```

---

## 7. Modules in TypeScript

**Export:**

```typescript title="utils.ts"
// file: utils.ts
export function sumar(a: number, b: number): number {
  return a + b;
}
```

**Import:**

```typescript title="index.ts"
// file: index.ts
import { sumar } from "./utils";
console.log(sumar(3, 4));
```

---

## 8. Advanced types

**Generics:**

Generics, just like in Java, let us create functions and classes that can work with different data types without losing type safety.
In them we specify a generic type denoted by `<T>`, which we can use in place of a specific type.

```typescript title="Advanced types"
function identidad<T>(valor: T): T {
  return valor;
}

console.log(identidad<string>("Hello"));
console.log(identidad<number>(123));
```

The previous example shows a function that receives a value of generic type `T` and returns it without modifying it. This makes the function flexible and reusable with different data types.

**Intersection types:**

These types let you combine multiple types into a single one, creating a new type that has all the properties of the combined types.

```typescript title="Advanced types (solution)"
interface A { a: string; }
interface B { b: number; }
// Same as interface C { a: string; b: number; }

type AB = A & B;
let obj: AB = { a: "Hello", b: 42 };
```

---

## 9. Running in the browser

To use TypeScript in the browser:

1. Compile to JavaScript.
2. Include the `.js` file in the HTML.

Example:

```typescript title="src/app.ts"
// src/app.ts
const mensaje: string = "Hello from TS";
console.log(mensaje);
```

```html title="index.html"
<!-- index.html -->
<script src="dist/app.js"></script>
```

---

## 10. Interface vs Type Alias

In TypeScript, both interfaces and type aliases are used to define types, but they have some key differences:

- **Interfaces**: Used mainly to define the shape of an object. They can be extended and are ideal for defining clear contracts between different parts of the code.

```typescript title="Interface vs Type Alias"
interface Usuario {
  id: number;
  nombre: string;
}
```

- **Type Aliases**: Used to define more complex types, including unions, tuples and primitive types. They cannot be extended like interfaces, but they are more flexible.

```typescript title="Interface vs Type Alias (solution)"
type ID = string | number;
type Usuario = {
  id: ID;
  nombre: string;
};
```

### Example: Something you can do with `type` but not with `interface`

`type aliases` let you define type unions, something that is not directly possible with `interface`.

```typescript title="Example: Something you can do"
type Resultado = string | number;

let respuesta: Resultado;
respuesta = "Success";
respuesta = 42;

// This cannot be done with `interface`.
```

In this case, `Resultado` can be a `string` or a `number`, which makes it more flexible for certain scenarios. Interfaces, on the other hand, are designed to describe the shape of objects and do not support type unions.

---

## 11. Recommendations

- Enable `strict` in `tsconfig.json`.
- Avoid using `any`.
- Use interfaces and types to define clear contracts.
- Take advantage of the editor's autocompletion and static analysis.
- Compile frequently to detect errors early.

---

## Self-Assessment Quiz

<Quiz id="web-env-intro-ts-quiz">
  <Question title="What does it mean that TypeScript is a 'superset' of JavaScript?">
    <Option>It completely replaces JavaScript and does not run on Node.js.</Option>
    <Option correct>It includes all JavaScript syntax and features while adding extra capabilities like static typing.</Option>
    <Option>It only runs on backend servers and cannot compile for web browsers.</Option>
    <Option>It is a CSS framework based on utility classes.</Option>
  </Question>
  <Question title="At what point does TypeScript detect type errors in your code?">
    <Option>Exclusively upon deployment to production.</Option>
    <Option correct>At compile-time (or static code analysis in the editor) before code execution.</Option>
    <Option>At runtime when a user clicks an element.</Option>
    <Option>Only when restarting the web server.</Option>
  </Question>
  <Question title="What happens in TypeScript if you declare 'let nombre = &quot;Kevin&quot;' and later attempt 'nombre = 42'?">
    <Option>It dynamically updates the variable type to number without warnings.</Option>
    <Option correct>It throws a compilation error due to static Type Inference.</Option>
    <Option>It automatically converts 42 to the string &quot;42&quot;.</Option>
    <Option>It deletes the variable from memory.</Option>
  </Question>
  <Question title="What is the official command for the TypeScript compiler to transpile .ts files into .js?">
    <Option>npm run build-ts</Option>
    <Option>node compile</Option>
    <Option correct>tsc</Option>
    <Option>ts-run</Option>
  </Question>
  <Question title="What is the purpose of the tsconfig.json file in a TypeScript project?">
    <Option>To install third-party packages from npm.</Option>
    <Option correct>To specify compiler settings and transpilation options for the project.</Option>
    <Option>To define global CSS styles for the application.</Option>
    <Option>To store secret database credentials.</Option>
  </Question>
  <Question title="In tsconfig.json, what does the setting '&quot;strict&quot;: true' accomplish?">
    <Option>It forbids arrow functions across the codebase.</Option>
    <Option correct>It enables a broad range of strict type checking rules for maximum code safety.</Option>
    <Option>It forces output files to be minified.</Option>
    <Option>It blocks imports from external libraries.</Option>
  </Question>
  <Question title="How do you declare a tuple in TypeScript containing a string first and a number second?">
    <Option>let tuple: (string | number)[] = [&quot;Kevin&quot;, 25];</Option>
    <Option correct>let tuple: [string, number] = [&quot;Kevin&quot;, 25];</Option>
    <Option>let tuple: Array&lt;string, number&gt; = [&quot;Kevin&quot;, 25];</Option>
    <Option>let tuple: &#123; string, number &#125; = [&quot;Kevin&quot;, 25];</Option>
  </Question>
  <Question title="What is the main benefit of using an 'enum' in TypeScript?">
    <Option>It allows asynchronous code execution without Promises.</Option>
    <Option correct>It allows defining a set of named constants, making code more readable and type-safe.</Option>
    <Option>It converts JavaScript objects into SQL tables.</Option>
    <Option>It reduces final HTML bundle size.</Option>
  </Question>
  <Question title="Which syntax indicates that a property inside an 'interface' is optional?">
    <Option>Adding the keyword 'optional' before the property name.</Option>
    <Option>Wrapping the property name in brackets '[property]'.</Option>
    <Option correct>Appending a question mark '?' to the property name.</Option>
    <Option>Explicitly setting the default value to 'null'.</Option>
  </Question>
  <Question title="What is a Union Type (A | B) in TypeScript?">
    <Option>A type requiring a variable to satisfy all properties of A and B simultaneously.</Option>
    <Option correct>A type allowing a variable to accept a value of type A or type B.</Option>
    <Option>A helper function merging two arrays together.</Option>
    <Option>A cross-compilation technique for legacy browsers.</Option>
  </Question>
  <Question title="What is the correct return type annotation for a function that returns no value in TypeScript?">
    <Option>function test(): null</Option>
    <Option>function test(): undefined</Option>
    <Option correct>function test(): void</Option>
    <Option>function test(): never</Option>
  </Question>
  <Question title="What is the difference between 'private' and 'protected' access modifiers in TypeScript classes?">
    <Option correct>Private restricts access strictly to the declaring class; protected allows access in the declaring class and its subclasses.</Option>
    <Option>Private is evaluated at compile-time, while protected is evaluated at runtime.</Option>
    <Option>Protected forbids property mutation, while private permits it.</Option>
    <Option>There is no difference; both modifiers are identical.</Option>
  </Question>
  <Question title="Which utility tool allows executing TypeScript files directly in development without manually transpiling JS files first?">
    <Option>nodemon-js</Option>
    <Option correct>ts-node</Option>
    <Option>tsc-build</Option>
    <Option>babel-preset</Option>
  </Question>
  <Question title="What is the purpose of Generics (&lt;T&gt;) in TypeScript?">
    <Option>To convert static types into 'any' without warnings.</Option>
    <Option correct>To create reusable components, functions, or classes that work across multiple data types while maintaining strict type safety.</Option>
    <Option>To import Node.js modules using CommonJS syntax.</Option>
    <Option>To declare variables whose value changes every second.</Option>
  </Question>
  <Question title="What is produced by using an intersection operator ('&amp;') between two types or interfaces?">
    <Option>A type accepting only values present in both types simultaneously as an exclusive selection.</Option>
    <Option correct>A new type combining all properties and members of both types into one.</Option>
    <Option>An array containing key names from both types.</Option>
    <Option>A syntax error if used outside a class.</Option>
  </Question>
  <Question title="What is a key distinction between 'interface' and 'type' aliases?">
    <Option correct>Interfaces focus on defining object shapes and can be extended/merged, whereas type aliases support union types, tuples, and primitive aliases.</Option>
    <Option>Interfaces only work with strings and types only work with numbers.</Option>
    <Option>Type aliases disappear at compile-time but interfaces are shipped to the browser.</Option>
    <Option>There is no difference; they are completely interchangeable in all scenarios.</Option>
  </Question>
  <Question title="If you declare 'function calc(a: number, b: number = 5, c?: string)' and return 'a + b', what return type is inferred?">
    <Option>string</Option>
    <Option correct>number</Option>
    <Option>void</Option>
    <Option>any</Option>
  </Question>
  <Question title="Why do TypeScript best practices strongly discourage using the 'any' type?">
    <Option>Because it reduces page rendering speed.</Option>
    <Option correct>Because it disables static type checking, voiding the safety benefits provided by TypeScript.</Option>
    <Option>Because web browsers throw fatal exceptions when encountering the word 'any'.</Option>
    <Option>Because it is only allowed inside JSON files.</Option>
  </Question>
  <Question title="How do you export and import a 'sumar' function between modules using standard ES Modules syntax?">
    <Option>export = &#123; sumar &#125;; / const sumar = require('./utils');</Option>
    <Option correct>export function sumar(...) &#123; ... &#125; / import &#123; sumar &#125; from './utils';</Option>
    <Option>module.exports = sumar; / include './utils';</Option>
    <Option>public sumar() / fetch('./utils');</Option>
  </Question>

  <Question title="What happens when you transpile a .ts file to JavaScript and run it in a web browser?">
    <Option>The browser directly executes TypeScript type annotations.</Option>
    <Option correct>The 'tsc' compiler strips away all type annotations, producing standard JavaScript compatible with browsers.</Option>
    <Option>End users must install a specialized browser extension to run TypeScript.</Option>
    <Option>The generated file can only run on Windows servers.</Option>
  </Question>
</Quiz>


